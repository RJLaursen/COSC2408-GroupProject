import type { ResponseClassification } from "./classify-response";
import { getNextState, isActiveState, type ActiveState } from "./scenario";

export const MAX_MESSAGE_LENGTH = 2000;
export const HISTORY_LIMIT = 4;

export type Message = {
  speaker: "Sandra" | "You";
  text: string;
};

export type ConversationRequest = {
  state: ActiveState;
  message: string;
  history: Message[];
};

export type ConversationReply = {
  classification: ResponseClassification;
  reply: string;
};

export type StageDebug = {
  model: string;
  attempt: number;
  fallbackIndex: number;
  latencyMs: number;
};

export type ConversationDebug = {
  requestId: string;
  latencyMs: number;
  classificationStage?: StageDebug;
  generationStage?: StageDebug;
  classification?: ResponseClassification;
};

function readStageDebug(value: unknown): StageDebug | undefined {
  if (!value || typeof value !== "object") return;
  const data = value as Record<string, unknown>;
  if (typeof data.model !== "string" || typeof data.attempt !== "number" ||
    typeof data.fallbackIndex !== "number" || typeof data.latencyMs !== "number") return;
  return { model: data.model, attempt: data.attempt,
    fallbackIndex: data.fallbackIndex, latencyMs: data.latencyMs };
}

// Return only allowlisted diagnostics, never arbitrary server response fields.
export function readConversationDebug(value: unknown): ConversationDebug | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.requestId !== "string" || typeof data.latencyMs !== "number") return null;
  const classification = data.classification;
  return {
    requestId: data.requestId, latencyMs: data.latencyMs,
    classificationStage: readStageDebug(data.classificationStage),
    generationStage: readStageDebug(data.generationStage),
    ...(isClassification(classification) ? { classification } : {}),
  };
}

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  return (
    "speaker" in value &&
    (value.speaker === "Sandra" || value.speaker === "You") &&
    "text" in value &&
    typeof value.text === "string" &&
    value.text.trim().length > 0 &&
    value.text.length <= MAX_MESSAGE_LENGTH
  );
}

export function isConversationRequest(value: unknown): value is ConversationRequest {
  if (!value || typeof value !== "object") return false;
  return (
    "state" in value &&
    typeof value.state === "string" &&
    ["INITIAL_REQUEST", "PUSHBACK_1", "PUSHBACK_2", "PUSHBACK_3"].includes(value.state) &&
    "message" in value &&
    typeof value.message === "string" &&
    value.message.trim().length > 0 &&
    value.message.length <= MAX_MESSAGE_LENGTH &&
    "history" in value &&
    Array.isArray(value.history) &&
    value.history.length <= HISTORY_LIMIT &&
    value.history.every(isMessage)
  );
}

function isClassification(value: unknown): value is ResponseClassification {
  return value === "AGREE" || value === "REFUSE" || value === "STOP" || value === "UNCLEAR";
}

export function isClassificationResult(value: unknown): value is { classification: ResponseClassification } {
  return !!value && typeof value === "object" && Object.keys(value).length === 1 &&
    "classification" in value && isClassification(value.classification);
}

// A final guard for obvious invented assurances/instructions, not keyword censorship.
// Negated/contextual mentions of authorisation, doctors or supervision remain allowed.
const invalidReplyClaims = [
  /\bi(?:['’]ll| will| can) (?:personally )?supervise (?:you|this|the)/i,
  /\byou(?:['’]re| are) (?:fully )?authori[sz]ed\b/i,
  /\bi(?:['’]ll| will| can) sign (?:you|this|it) off\b/i,
  /(?<!\bno )\b(?:the )?doctor (?:has |already )?(?:approved|authori[sz]ed|signed off)\b/i,
  /\byou(?:['’]ve| have) (?:already )?(?:done|given|administered|performed) .{0,60}\bbefore\b/i,
  /\byou have (?:prior |previous )?experience (?:with|administering|giving)\b/i,
  /\bi(?:['’]ll| will| can) (?:take (?:over|care of)|administer|give (?:it|the medication))\b/i,
  /\bi(?:['’]ll| will| can) (?:get (?:it|that|the infusion|the drip|the medication) (?:started|done)|do (?:it|that|the task)|handle (?:the medication|the infusion))\b/i,
  /\b(?:get|ask|find) another (?:rn|nurse) to (?:do|give|administer)\b/i,
  /\b(?:hook (?:it|the iv|the infusion) up|set (?:it|the iv|the infusion|the drip) up|connect (?:the |his )?(?:iv |infusion )?(?:line|tubing|cannula))\b/i,
  /\b(?:set|hang|attach) (?:the |his |that )?(?:iv |infusion )?bag\b/i,
  /\b(?:just|please|then|go ahead and) (?:start|run) (?:the |his |that )?(?:drip|infusion)\b/i,
  /\bgood (?:morning|evening|night)\b/i,
];

function dialogueSentences(text: string): string[] {
  return text.toLowerCase().replace(/[‘’]/g, "'")
    // Titles such as "Mr." are not sentence boundaries.
    .replace(/\b(mr|mrs|ms|dr)\./g, "$1")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.replace(/[.!?]+$/, "").trim().replace(/\s+/g, " "))
    .filter((sentence) => sentence.length >= 10);
}

export function isGenerationResult(value: unknown, history: Message[] = []): value is { reply: string } {
  if (!value || typeof value !== "object" || Object.keys(value).length !== 1 ||
    !("reply" in value) || typeof value.reply !== "string") return false;
  const reply = value.reply;
  const recentSentences = history.filter((message) => message.speaker === "Sandra")
    .flatMap((message) => dialogueSentences(message.text));
  return reply.trim().length > 0 && reply.length <= MAX_MESSAGE_LENGTH &&
    !invalidReplyClaims.some((pattern) => pattern.test(reply)) &&
    !dialogueSentences(reply).some((sentence) => recentSentences.includes(sentence));
}

// Check the complete response on both sides of the API boundary.
export function isConversationReply(
  value: unknown,
  state: ActiveState,
): value is ConversationReply {
  if (!value || typeof value !== "object") return false;
  if (
    Object.keys(value).length !== 2 ||
    !("classification" in value) ||
    !("reply" in value) ||
    typeof value.reply !== "string" ||
    value.reply.length > MAX_MESSAGE_LENGTH
  ) return false;

  const classification = value.classification;
  if (!isClassification(classification)) return false;
  return isActiveState(getNextState(state, classification))
    ? isGenerationResult({ reply: value.reply })
    : value.reply === "";
}

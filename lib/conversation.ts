import type { ResponseClassification } from "./classify-response";
import { getNextState, isActiveState, type ActiveState } from "./scenario";

export const MAX_MESSAGE_LENGTH = 2000;
export const HISTORY_LIMIT = 4;
export const MAX_MEANING_LENGTH = 400;

export type ModelClassification = "AGREE" | "REFUSE" | "STOP" | "CONTINUE";
export type ModelUnderstanding = {
  classification: ModelClassification;
  meaning: string;
};

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
  status?: "pending" | "success" | "provider_error" | "unusable_response";
  httpStatus?: number;
  reason?: "incomplete_completion" | "invalid_json" | "validation_failed";
};

export type ConversationDebug = {
  requestId: string;
  latencyMs: number;
  classificationStage?: StageDebug;
  generationStage?: StageDebug;
  modelClassification?: ModelClassification;
  classification?: ResponseClassification;
  meaning?: string;
};

function readStageDebug(value: unknown): StageDebug | undefined {
  if (!value || typeof value !== "object") return;
  const data = value as Record<string, unknown>;
  if (typeof data.model !== "string" || typeof data.attempt !== "number" ||
    typeof data.fallbackIndex !== "number" || typeof data.latencyMs !== "number") return;
  const status = data.status;
  return { model: data.model, attempt: data.attempt,
    fallbackIndex: data.fallbackIndex, latencyMs: data.latencyMs,
    ...(status === "pending" || status === "success" || status === "provider_error" ||
      status === "unusable_response" ? { status } : {}),
    ...(typeof data.httpStatus === "number" ? { httpStatus: data.httpStatus } : {}),
    ...(data.reason === "incomplete_completion" || data.reason === "invalid_json" ||
      data.reason === "validation_failed" ? { reason: data.reason } : {}),
  };
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
    ...(isModelClassification(data.modelClassification) ? { modelClassification: data.modelClassification } : {}),
    ...(isClassification(classification) ? { classification } : {}),
    ...(isMeaning(data.meaning) ? { meaning: data.meaning } : {}),
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

function isModelClassification(value: unknown): value is ModelClassification {
  return value === "AGREE" || value === "REFUSE" || value === "STOP" || value === "CONTINUE";
}

function isMeaning(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAX_MEANING_LENGTH;
}

export function isModelUnderstanding(value: unknown): value is ModelUnderstanding {
  return !!value && typeof value === "object" && Object.keys(value).length === 2 &&
    "classification" in value && isModelClassification(value.classification) &&
    "meaning" in value && isMeaning(value.meaning);
}

// Translate only at the API boundary; the existing scenario types stay unchanged.
export function toApplicationClassification(value: ModelClassification): ResponseClassification {
  return value === "CONTINUE" ? "UNCLEAR" : value;
}

// A final guard for obvious invented assurances/instructions, not keyword censorship.
// Negated/contextual mentions of authorisation, doctors or supervision remain allowed.
const invalidReplyClaims = [
  // Include assurances with intervening words, while allowing explicit negation.
  /\bi(?:['’]ll| will| can) (?!(?:[^.!?]{0,60})\b(?:not|never|cannot|can't|won't)\b)[^.!?]{0,60}\b(?:supervise|watch|guide|oversee)\b/i,
  /\byou(?:['’]re| are) (?:fully |already |now )?(?:authori[sz]ed|permitted|allowed|signed off)\b/i,
  /\byou can (?:legally|independently) (?:administer|give|do)\b/i,
  /\byou have (?:my |the |full )?permission\b/i,
  /\bi(?:['’]m not| am not) (?:assessed|authori[sz]ed|permitted|allowed|qualified) to (?:give|administer)\b/i,
  /\bi(?:['’]ll| will| can) sign (?:you|this|it) off\b/i,
  /(?<!\bno )\b(?:the )?doctor (?:has |already )?(?:approved|authori[sz]ed|signed off)\b/i,
  /\byou(?:['’]ve| have) (?:already )?(?:done|given|administered|performed|practi[cs]ed) .{0,80}\b(?:before|(?:sim(?:ulation)?|skills?) lab|(?:many|several|a hundred) times)\b/i,
  /\b(?:beyond|same as|like) what you(?:['’]ve| have) (?:already )?(?:done|given|administered|performed)\b/i,
  /\byou(?:['’]ve| have) (?:already )?(?:seen|watched|observed) .{0,60}\b(?:before|(?:plenty of|many|several|numerous) times)\b/i,
  /\byou have (?:prior |previous )?experience (?:with|administering|giving)\b/i,
  /\bi(?:['’]ll| will| can) (?:take (?:over|care of)|administer|give (?:it|the medication))\b/i,
  /\bi(?:['’]ll| will| can) (?:get (?:it|that|the infusion|the drip|the medication) (?:started|done)|do (?:it|that|the task)|handle (?:the medication|the infusion))\b/i,
  /\b(?:get|ask|find) another (?:rn|nurse) to (?:do|give|administer)\b/i,
  /\b(?:another|(?:a|the)(?: qualified| registered)?) (?:rn|nurse) (?:will |can |should |needs to |to )(?:do|give|administer|handle)\b/i,
  /\b(?:hook (?:it|the iv|the infusion) up|set (?:it|the iv|the infusion|the drip) up|connect (?:the |his )?(?:iv |infusion )?(?:line|tubing|cannula))\b/i,
  /\b(?:set|hang|attach) (?:the |his |that )?(?:iv |infusion )?bag\b/i,
  /\b(?:get|have) (?:the |his |that )?(?:iv |infusion )?bag (?:set|hooked|connected) up\b/i,
  /\b(?:start|run|begin) (?:it|(?:(?:the|his|that|this) )?(?:Augmentin )?(?:drip|infusion|pump|bag))\b/i,
  /\b(?:it|this|that)(?:['’]s| is) (?:just )?(?:a |an )?(?:simple |straightforward )?(?:iv|intravenous) (?:push|bolus)\b/i,
  /\bpush (?:the |this |that )?(?:infusion|(?:iv )?bag)\b/i,
  // Reject explicit invented workload facts, rather than interpreting the student's intent.
  /\b(?:we(?:['’]re| are)|the ward is) (?:down|short(?: by)?) (?:\d+|one|two|three|four|five|six|seven|eight|nine|ten) (?:nurses|rns|staff)\b/i,
  /\bi(?:['’]m| am) (?:.{0,24} )?(?:with|covering|looking after|responsible for) (?:\d+|one|two|three|four|five|six|seven|eight|nine|ten) (?:other )?patients\b/i,
  /\bi(?:['’]ve| have) (?:got )?(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten) (?:other |additional )?(?:patients|iv antibiotics|antibiotics)\b/i,
  /\bit(?:['’]s| is) (?:Tuesday )?(?:morning|evening|night)\b/i,
  /\b(?:affect|impact|lower|reduce) (?:your |the )?(?:(?:final |placement )?grade|final assessment)\b/i,
  /\byou (?:could|will|would|may|might) (?:fail (?:your |the )?placement|lose (?:your )?registration)\b/i,
  // Invented consequences change the scenario regardless of the student's wording.
  /\b(?:breach|violate|break|against|contrary to) (?:of |the |a |hospital |ward )*(?:policy|policies|law|rules|regulations)\b/i,
  /\byou (?:could|will|would|may|might) (?:face (?:discipline|disciplinary|legal)|lose (?:your )?(?:placement|registration)|be (?:disciplined|punished|suspended))\b/i,
];

function offersSupervision(reply: string): boolean {
  // Check each clause so a denial elsewhere cannot mask an affirmative offer.
  return reply.replace(/[‘’]/g, "'").split(/[.!?;\n]|\b(?:but|however|so|and)\b/i).some((clause) => {
    const offer = /\b(?:under my(?: direct)? (?:supervision|observation|oversight)|with my (?:supervision|oversight)|with me (?:directly )?(?:supervising|overseeing|watching))\b/i.exec(clause);
    if (!offer) return false;
    const beforeOffer = clause.slice(0, offer.index);
    const denial = /\b(?:not|never|no|cannot|can't|won't|wouldn't|shouldn't|mustn't)\b/i.test(beforeOffer);
    const studentQuestion = /\b(?:you (?:asked|ask|are asking)|your question)\b/i.test(beforeOffer);
    return !denial && !studentQuestion;
  });
}

function dialogueSentences(text: string): string[] {
  return text.toLowerCase().replace(/[‘’]/g, "'")
    // Titles such as "Mr." are not sentence boundaries.
    .replace(/\b(mr|mrs|ms|dr)\./g, "$1")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.replace(/[.!?]+$/, "").trim().replace(/\s+/g, " "))
    .filter((sentence) => sentence.length >= 10);
}

export function isGenerationResult(
  value: unknown, history: Message[] = [],
): value is { reply: string } {
  if (!value || typeof value !== "object" || Object.keys(value).length !== 1 ||
    !("reply" in value) || typeof value.reply !== "string") return false;
  const reply = value.reply;
  const recentSentences = history.filter((message) => message.speaker === "Sandra")
    .flatMap((message) => dialogueSentences(message.text));
  return reply.trim().length > 0 && reply.length <= MAX_MESSAGE_LENGTH &&
    !invalidReplyClaims.some((pattern) => pattern.test(reply)) &&
    !offersSupervision(reply) &&
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

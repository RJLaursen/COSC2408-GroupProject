import type { ResponseClassification } from "./classify-response";
import { getNextState, isActiveState, type ActiveState } from "./scenario";

export const MAX_MESSAGE_LENGTH = 2000;
export const HISTORY_LIMIT = 4;
export const MAX_MEANING_LENGTH = 400;

export type ModelUnderstanding = {
  classification: ResponseClassification;
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
  modelClassification?: ResponseClassification;
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
    ...(isClassification(data.modelClassification) ? { modelClassification: data.modelClassification } : {}),
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
  return value === "AGREE" || value === "REFUSE" || value === "STOP" || value === "CONTINUE";
}

function isMeaning(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAX_MEANING_LENGTH;
}

export function isModelUnderstanding(value: unknown): value is ModelUnderstanding {
  return !!value && typeof value === "object" && Object.keys(value).length === 2 &&
    "classification" in value && isClassification(value.classification) &&
    "meaning" in value && isMeaning(value.meaning);
}

// Block obvious scenario contradictions; the prompt owns ordinary facts and style.
function makesFalseAuthorisationClaim(reply: string): boolean {
  return /\byou(?:'re| are) (?:fully |already |now )?(?:authori[sz]ed|permitted|allowed|signed off)\b/i.test(reply) ||
    /\byou (?:can (?:legally|independently) (?:administer|give|do)|have (?:my |the |full )?permission)\b/i.test(reply) ||
    /\bi(?:'ll| will| can) sign (?:you|this|it) off\b/i.test(reply) ||
    /(?<!\bno )\bdoctor (?:has |already )?(?:approved|authori[sz]ed|signed off)\b/i.test(reply);
}

function offersEnablingSupervision(reply: string): boolean {
  // Check each clause so a denial elsewhere cannot mask an affirmative offer.
  const negation = /\b(?:not|never|no|cannot|can't|won't|wouldn't|shouldn't|mustn't)\b/i;
  return reply.split(/[.!?;\n]|\b(?:but|however|so|and)\b/i).some((clause) => {
    const presenceOffer = /\b(i(?:'ll| will| can) [^.!?]{0,40})\b(?:stay|remain|be|observe|guide)\b[^.!?]{0,40}\b(?:while|as) you(?:'re| are)? (?:do(?:ing)?|giv(?:e|ing)|administer(?:ing)?|perform(?:ing)?)\b/i.exec(clause);
    const directOffer = /\bi(?:'ll| will| can) (?!(?:[^.!?]{0,40})\b(?:not|never|cannot|can't|won't)\b)[^.!?]{0,40}\b(?:supervise|oversee|watch (?:you|while you|as you))\b/i.exec(clause) ??
      (presenceOffer && !negation.test(presenceOffer[1]) ? presenceOffer : null);
    const offer = directOffer ?? /\b(?:under my(?: direct)? (?:supervision|observation|oversight)|with my (?:supervision|oversight)|with me (?:directly )?(?:supervising|overseeing|watching|there|here|present|beside you))\b/i.exec(clause);
    if (!offer) return false;
    const beforeOffer = clause.slice(0, offer.index);
    const denial = negation.test(beforeOffer);
    const studentQuestion = /\b(?:you (?:asked|ask|are asking)|your question)\b/i.test(beforeOffer);
    return !studentQuestion && (!!directOffer || !denial);
  });
}

function offersTakeoverOrAnotherRN(reply: string): boolean {
  return /\bi(?:'ll| will| can) (?:take (?:over|care of)|(?:administer|give|do|handle) (?:it|this|that|(?:the |his )?(?:medication|augmentin|infusion))|get (?:it|the infusion) (?:started|done))\b/i.test(reply) ||
    /\b(?:(?:get|ask|find) another (?:rn|nurse) to|(?:another|(?:a|the)(?: qualified| registered)?) (?:rn|nurse) (?:will|can|should|needs to|to)) (?:do|give|administer|handle)\b/i.test(reply);
}

function inventsPriorIVExperience(reply: string): boolean {
  // Referencing what the student said is not confirming it as a scenario fact.
  return reply.split(/[.!?;\n]/).some((sentence) => {
    const claim = /\byou(?:'ve| have) (?:already )?(?:done|given|administered|performed|practi[cs]ed)[^.!?]{0,60}\b(?:before|many times|several times)\b|\byou have (?:prior |previous )?experience (?:with|giving|administering)[^.!?]{0,30}/i.exec(sentence);
    return !!claim && /\b(?:this|it|ivs?|intravenous|infusions?|augmentin)\b/i.test(claim[0]) &&
      !/\byou (?:said|mentioned|told me)\b/i.test(sentence.slice(0, claim.index));
  });
}

function givesProceduralIVInstruction(reply: string): boolean {
  return /\b(?:hook|connect|attach|set up)\b[^.!?]{0,30}\b(?:line|tubing|cannula)\b/i.test(reply) ||
    /\b(?:hang|attach|set up) (?:the |his |that |an? )?(?:iv |infusion )?bag\b/i.test(reply) ||
    /\b(?:start|run|set) (?:the |his |that |an? )?(?:iv |infusion )?pump\b/i.test(reply);
}

function inventsHighStakesConsequence(reply: string): boolean {
  return /\byou (?:will|are going to) fail (?:your |the )?placement\b/i.test(reply) ||
    /\byou (?:will|would|could|may|might) (?:lose (?:your )?registration|face (?:legal|disciplinary) (?:action|punishment)|be (?:disciplined|punished|suspended))\b/i.test(reply);
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
  const safetyText = reply.replace(/[‘’]/g, "'").replace(/\s+/g, " ");
  const recentSentences = history.filter((message) => message.speaker === "Sandra")
    .flatMap((message) => dialogueSentences(message.text));
  return reply.trim().length > 0 && reply.length <= MAX_MESSAGE_LENGTH &&
    !makesFalseAuthorisationClaim(safetyText) &&
    !offersEnablingSupervision(safetyText) &&
    !offersTakeoverOrAnotherRN(safetyText) &&
    !inventsPriorIVExperience(safetyText) &&
    !givesProceduralIVInstruction(safetyText) &&
    !inventsHighStakesConsequence(safetyText) &&
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

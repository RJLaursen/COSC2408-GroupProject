export type ResponseClassification = "AGREE" | "REFUSE" | "STOP" | "UNCLEAR";

// Temporary phrase matching for this local prototype, not general language understanding.
// Keep classification separate from scenario transitions so it can be replaced later.
export function classifyResponse(message: string): ResponseClassification {
  const text = message
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const stopPatterns = [
    /^(please )?(stop|exit|quit)( (now|please|the simulation|this simulation))?$/,
    /\bi (want|need|would like) to (stop|exit|quit)\b/,
    /\bi (don't|do not) want to (continue|carry on)\b/,
    /\b(can|could) (we|i) (stop|exit|quit)\b/,
    /\bi('m| am) (distressed|overwhelmed)\b/,
  ];

  // An explicit stop request takes priority over all other response types.
  if (stopPatterns.some((pattern) => pattern.test(text))) return "STOP";

  // Avoid interpreting uncertain or conditional responses as a decision.
  if (/\b(maybe|perhaps|not sure|unsure|if|might)\b/.test(text)) {
    return "UNCLEAR";
  }

  const agreementPatterns = [
    /^(yes|yeah|yep|okay|ok|sure|no problem)( of course)?( sandra)?( please)?$/,
    /\bi('ll| will| can| agree to) (do|administer|give) (it|that|the (medication|augmentin|antibiotic|iv))\b/,
  ];
  const refusalPatterns = [
    /^(no|nope|no way)( thanks| thank you)?( sandra)?$/,
    /\bi('m| am) not (allowed|authorised|authorized|comfortable|qualified|assessed|trained)\b/,
    /\boutside (of )?my scope\b/,
    /\bi (can't|cannot|can not|won't|will not|don't want to|do not want to) (do|administer|give) (it|that|the (medication|augmentin|antibiotic|iv))\b/,
    /\b(rn|registered nurse) needs to (do|administer|give)\b/,
    /\bget another nurse\b/,
    /\bi (refuse|decline)\b/,
  ];

  const agrees = agreementPatterns.some((pattern) => pattern.test(text));
  const refuses = refusalPatterns.some((pattern) => pattern.test(text));

  // Conflicting or unrecognised phrases must not move the scenario forward.
  const startsWithAgreement = /^(yes|yeah|yep|okay|ok|sure|no problem)\b/.test(text);
  if (refuses && (agrees || startsWithAgreement)) return "UNCLEAR";
  if (refuses) return "REFUSE";
  if (agrees && /\b(not|never|don't|cannot|can't|won't)\b/.test(text)) {
    return "UNCLEAR";
  }
  if (agrees) return "AGREE";
  return "UNCLEAR";
}

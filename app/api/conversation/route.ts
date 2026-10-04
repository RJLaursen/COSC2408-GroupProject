import Groq from "groq-sdk";
import { setTimeout as delay } from "node:timers/promises";
import {
  isModelUnderstanding, isGenerationResult, isConversationRequest,
  type ModelUnderstanding, type ConversationDebug, type StageDebug,
} from "@/lib/conversation";
import { classificationPrompt, generationPrompt, getDialogueGoal } from "@/lib/conversation-prompts";

function rateLimitInfo(headers?: Headers) {
  const names = ["retry-after", "retry-after-ms", "x-ratelimit-limit-requests",
    "x-ratelimit-remaining-requests", "x-ratelimit-reset-requests",
    "x-ratelimit-limit-tokens", "x-ratelimit-remaining-tokens", "x-ratelimit-reset-tokens"];
  return Object.fromEntries(names.flatMap((name) => {
    const value = headers?.get(name);
    return value ? [[name, value]] : [];
  }));
}

// Retry transient failures once, but move on rather than waiting on a long rate limit.
function retryDelay(error: unknown): number | null {
  if (!(error instanceof Groq.APIError)) return null;
  const status = error.status;
  if (status !== undefined && ![408, 409, 429].includes(status) && status < 500) return null;
  const milliseconds = error.headers?.get("retry-after-ms");
  const secondsOrDate = error.headers?.get("retry-after");
  let wait = 250;
  if (milliseconds) wait = Number(milliseconds);
  else if (secondsOrDate) {
    wait = Number.isFinite(Number(secondsOrDate))
      ? Number(secondsOrDate) * 1000
      : Date.parse(secondsOrDate) - Date.now();
  } else if (status === 429) return null;
  return Number.isFinite(wait) && wait <= 1000 ? Math.max(0, wait) : null;
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return new Response(null, { status: 400 }); }
  if (!isConversationRequest(body)) return new Response(null, { status: 400 });

  const requestId = crypto.randomUUID();
  const started = Date.now();
  const state = body.state;
  const development = process.env.NODE_ENV === "development";
  const apiKey = process.env.GROQ_API_KEY;
  const debug: ConversationDebug = { requestId, latencyMs: 0 };

  function log(details: Record<string, unknown>) {
    if (!development || process.env.AI_DEBUG !== "true") return;
    // Only explicit fields are logged, never SDK errors or authorization headers.
    let text = JSON.stringify({ requestId, state, ...details });
    if (apiKey) text = text.replaceAll(apiKey, "[redacted]");
    console.debug("[conversation]", text);
  }

  function unavailable() {
    debug.latencyMs = Date.now() - started;
    return Response.json({ error: "Sandra's response is unavailable. Please try again.",
      ...(development ? { debug } : {}) }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  if (!apiKey) {
    log({ stage: "classification", status: "missing_configuration", latencyMs: Date.now() - started });
    return unavailable();
  }

  const models = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
  const groq = new Groq({ apiKey, timeout: 6000, maxRetries: 0 });

  // Both stages share fallback/retry handling, but start independently at the primary model.
  async function callStage<T>(
    stage: "classification" | "generation", prompt: string,
    validate: (value: unknown) => value is T, goal?: string,
  ): Promise<T | null> {
    const stageStarted = Date.now();
    const debugKey = stage === "classification" ? "classificationStage" : "generationStage";
    let attempt = 0;
    for (const [fallbackIndex, model] of models.entries()) {
      for (let modelAttempt = 1; modelAttempt <= 2; modelAttempt++) {
        if (request.signal.aborted) return null;
        attempt++;
        const attemptStarted = Date.now();
        const stageDebug: StageDebug = { model, attempt, fallbackIndex, latencyMs: 0, status: "pending" };
        debug[debugKey] = stageDebug;
        const completionRequest = {
          model,
          temperature: stage === "classification" ? 0.1 : 0.4,
          // Groq exposes different reasoning controls for Qwen and GPT-OSS.
          ...(model === "qwen/qwen3.8-27b"
            ? { reasoning_effort: "none" as const, reasoning_format: "hidden" as const }
            : { reasoning_effort: "low" as const, include_reasoning: false }),
          // Allow a concise meaning sentence as well as the decision classification.
          max_completion_tokens: 256,
          response_format: { type: "json_object" as const },
          messages: [{ role: "user" as const, content: prompt }],
        };
        log({ stage, goal, model, attempt, fallbackIndex, modelAttempt, status: "request", request: completionRequest });

        try {
          const { data: completion, response } = await groq.chat.completions
            .create(completionRequest, { signal: request.signal }).withResponse();
          const choice = completion.choices[0];
          let result: unknown;
          let parsedJson = false;
          try { result = JSON.parse(choice?.message.content || ""); parsedJson = true; }
          catch { result = null; }
          stageDebug.latencyMs = Date.now() - stageStarted;
          stageDebug.httpStatus = response.status;
          if (choice?.finish_reason !== "stop" || !validate(result)) {
            stageDebug.status = "unusable_response";
            stageDebug.reason = choice?.finish_reason !== "stop" ? "incomplete_completion" :
              !parsedJson ? "invalid_json" : "validation_failed";
            const parsed = result && typeof result === "object" ? result as Record<string, unknown> : null;
            log({ stage, goal, model, attempt, fallbackIndex, modelAttempt, httpStatus: response.status,
              status: "unusable_response", latencyMs: Date.now() - attemptStarted,
              reason: stageDebug.reason,
              finishReason: choice?.finish_reason,
              modelClassification: stage === "classification" ? parsed?.classification : debug.modelClassification,
              classification: debug.classification,
              rateLimit: rateLimitInfo(response.headers) });
            break;
          }
          stageDebug.status = "success";
          log({ stage, goal, ...stageDebug, modelAttempt, httpStatus: response.status, status: "success",
            modelClassification: stage === "classification" ? (result as ModelUnderstanding).classification : debug.modelClassification,
            classification: stage === "classification" ? (result as ModelUnderstanding).classification : debug.classification,
            meaning: stage === "classification" ? (result as ModelUnderstanding).meaning : debug.meaning,
            attemptLatencyMs: Date.now() - attemptStarted, rateLimit: rateLimitInfo(response.headers) });
          return result;
        } catch (error) {
          stageDebug.latencyMs = Date.now() - stageStarted;
          stageDebug.status = "provider_error";
          stageDebug.httpStatus = error instanceof Groq.APIError ? error.status : undefined;
          if (request.signal.aborted) return null;
          const wait = modelAttempt === 1 ? retryDelay(error) : null;
          log({ stage, goal, model, attempt, fallbackIndex, modelAttempt, status: "provider_error",
            httpStatus: error instanceof Groq.APIError ? error.status : undefined,
            errorType: error instanceof Error ? error.constructor.name : "UnknownError",
            // SDK APIError.message contains the provider error body, not request headers.
            // This stays in the opt-in server log and is redacted by log().
            providerMessage: error instanceof Groq.APIError ? error.message : undefined,
            latencyMs: Date.now() - attemptStarted, retryInMs: wait,
            rateLimit: error instanceof Groq.APIError ? rateLimitInfo(error.headers) : {} });
          if (wait === null) break;
          try { await delay(wait, undefined, { signal: request.signal }); }
          catch { return null; }
        }
      }
    }
    log({ stage, goal, status: "models_exhausted", latencyMs: Date.now() - stageStarted });
    return null;
  }

  const classified = await callStage("classification", classificationPrompt(body), isModelUnderstanding);
  if (!classified) return unavailable();
  const classification = classified.classification;
  debug.modelClassification = classified.classification;
  debug.classification = classification;
  debug.meaning = classified.meaning;
  const goal = getDialogueGoal(state, classification);
  log({ stage: "routing", status: "goal_derived", modelClassification: classified.classification,
    classification, meaning: classified.meaning, goal: goal?.name ?? null });
  let reply = "";
  if (goal) {
    const history = body.history;
    const generated = await callStage("generation", generationPrompt(body, goal, classified.meaning),
      (value): value is { reply: string } => isGenerationResult(value, history), goal.name);
    // Classification alone must never advance an active client turn.
    if (!generated) return unavailable();
    reply = generated.reply;
  }
  if (request.signal.aborted) return unavailable();
  debug.latencyMs = Date.now() - started;
  return Response.json({ classification, reply,
    ...(development ? { debug } : {}) }, { headers: { "Cache-Control": "no-store" } });
}

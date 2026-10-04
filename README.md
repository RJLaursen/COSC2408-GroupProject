# Virtual Health Precinct

Next.js, React and TypeScript application using the App Router and npm.
The home page uses Groq for a clinical simulation conversation with
Sandra, free-text student responses, basic outcomes and a stop option.

## Local development

Use Node.js 20.9 or later and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Edit `app/page.tsx` to update the home page.
The shared layout is in `app/layout.tsx`, with basic styles in `app/globals.css`.

## Checks and production

```sh
npm run lint
npm run build
npm start
```

## Groq configuration

Copy `.env.example` to `.env.local` if you do not already have one. Set
`GROQ_API_KEY` to enable AI conversation. Both stages use `qwen/qwen3.8-27b` first.
Failed or unusable responses try `openai/gpt-oss-120b`, then `openai/gpt-oss-20b`.
The model order is defined in the route.
Restart the development server after changing environment variables.

The browser calls `app/api/conversation/route.ts`, which uses `groq-sdk` on the
server. The API key stays server-side. Real environment files remain ignored;
`.env.example` contains placeholders only.

## Scenario logic

`lib/scenario.ts` owns the allowed state transitions and the opening Sandra message.
Agreement at any active stage ends the conversation. Refusals progress through
three pressure stages; the fourth refusal reaches the boundary-maintained outcome.
Unclear replies keep the current state without resetting refusal progression,
and stopping ends the conversation without further escalation.

Each text turn uses two separate Groq calls in JSON Object Mode:

1. Interpret the latest message using current state and recent history. Return
   exactly `{ classification, meaning }`, where model classifications are `AGREE`,
   `REFUSE`, `STOP` or `CONTINUE`, and meaning is a concise plain-English sentence
   of at most 400 characters. The classifier describes the actual point and actor
   before checking whether the student made a decision. Temperature is 0.1, with
   a 256-token limit.
2. Code uses `getNextState(...)` to check for a terminal outcome and
   derive one dialogue goal. The server first translates model `CONTINUE` to the
   existing application `UNCLEAR`; other classifications map directly. Terminal
   turns skip generation and return an empty reply.
3. Generate only Sandra's reply for that goal. Temperature is 0.4, with a 256-token
   limit. The prompt includes fixed facts, recent history and boundaries, not every
   escalation rule. Meaning is an advisory hint: raw history and the latest message
   take precedence if they conflict with it. Qwen uses `reasoning_effort: "none"`
   and hidden reasoning. GPT-OSS fallbacks use low reasoning with
   `include_reasoning: false`. Both stages use one user message each.

`lib/conversation-prompts.ts` maps refusals to first minimising pushback, workload
pressure, then placement-feedback pressure. All `CONTINUE` turns use one general
conversation goal: respond to the actual point and preserve current pressure
without escalation. Recent Sandra messages guide varied wording.
Generated replies that repeat a recent Sandra sentence/question try the next model.
`lib/conversation.ts` validates each stage's exact JSON shape and guards against
obvious invented assurances or IV instructions without banning sensitive words.
The client applies `getNextState(...)` only after a complete valid server result;
neither model chooses the state or outcome.
Stop remains immediate and local, including while a request is pending.

Each stage independently uses the same ordered model fallback chain. Classification
and generation can succeed on different models. Each model has a six-second
request timeout and at most one retry for a transient
error. Retry delays over one second, unusable output and non-transient errors move
to the next model. If every model fails or configuration is missing, state stays
unchanged and the student can retry the same message without duplicating it.
This also applies when classification succeeds but generation fails. The browser
allows 90 seconds for both stages' bounded attempts and aborts the request on Stop.

## Development diagnostics

Set `AI_DEBUG=true` in `.env.local` and restart `npm run dev` to log the exact model
request for each stage, request ID, stage, dialogue goal (generation), model,
attempt/fallback index, state, status, model/application classifications, meaning, timing and
available rate-limit headers in the server terminal. This includes conversation
text; use test conversations for debugging. Keys and authorization headers are
excluded. Full requests are not logged when this flag is off or in production.

Development API responses include safe `debug` metadata, which the browser writes
with `console.debug` (enable Debug/Verbose in DevTools). Metadata identifies each
stage's model, attempt, fallback index, latency and any validation failure reason,
plus total latency, model/application classifications and the advisory meaning.
Terminal turns have no generation metadata. Match its request ID to
the server log. Production responses have no debug metadata.

Fallback/retry handling can be checked with an isolated provider mock; there is no
browser-controlled failure switch or production model override.

Conversation history stays in React state only; refreshing the page starts a new
conversation. The latest message and up to four previous messages are
sent through the server to Groq. The application does not persist conversations.

Project requirements and planning documents are in `docs/`.

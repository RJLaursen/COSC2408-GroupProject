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
`GROQ_API_KEY` to enable AI conversation. `GROQ_MODEL` is configurable and defaults
to `openai/gpt-oss-120b`. Failed or unusable responses try `qwen/qwen3.8-27b`, then
`openai/gpt-oss-20b` (duplicate models are skipped).
Restart the development server after changing environment variables.

The browser calls `app/api/conversation/route.ts`, which uses `groq-sdk` on the
server. The API key stays server-side. Real environment files remain ignored;
`.env.example` contains placeholders only.

## Scenario logic

`lib/scenario.ts` owns the allowed state transitions and the opening Sandra message.
Agreement at any active stage ends the conversation. Four consecutive refusals
reach the boundary-maintained outcome. Unclear replies keep the current state,
and stopping ends the conversation without further escalation.

Each text turn uses two separate Groq calls in JSON Object Mode:

1. Classify intent only (`AGREE`, `REFUSE`, `STOP` or `UNCLEAR`), using current state,
   latest message and recent history. Temperature is 0.1, with a 192-token limit
   (128 caused Qwen JSON generation failures during live checks).
2. Code uses the unchanged `getNextState(...)` to check for a terminal outcome and
   derive one dialogue goal. Terminal turns skip generation and return an empty reply.
3. Generate only Sandra's reply for that goal. Temperature is 0.5, with a 256-token
   limit. The prompt includes fixed facts, recent history and boundaries, not every
   escalation rule. Both calls use low/hidden reasoning and one user message each.

`lib/conversation-prompts.ts` maps refusals to first minimising pushback, workload
pressure, then placement-feedback pressure. `UNCLEAR` redirects at the current
pressure level without escalation. Recent Sandra messages guide varied wording.
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
Live turns never use the old phrase classifier or fixed replies.

## Development diagnostics

Set `AI_DEBUG=true` in `.env.local` and restart `npm run dev` to log the exact model
request for each stage, request ID, stage, dialogue goal (generation), model,
attempt/fallback index, state, status, classification, timing and
available rate-limit headers in the server terminal. This includes conversation
text; use test conversations for debugging. Keys and authorization headers are
excluded. Full requests are not logged when this flag is off or in production.

Development API responses include safe `debug` metadata, which the browser writes
with `console.debug` (enable Debug/Verbose in DevTools). Metadata identifies each
stage's model, attempt, fallback index and latency, plus total latency and classification.
Terminal turns have no generation metadata. Match its request ID to
the server log. Production responses have no debug metadata.

To check fallback routing in an isolated development/test process, temporarily set
`GROQ_MODEL` to a nonexistent model name in that process. The provider rejects the
primary request and the next real model is attempted. Restore the setting after
testing; there is no browser-controlled failure switch.

Conversation history stays in React state only; refreshing the page starts a new
conversation. In AI mode the latest message and up to four previous messages are
sent through the server to Groq. The application does not persist conversations.

Project requirements and planning documents are in `docs/`.

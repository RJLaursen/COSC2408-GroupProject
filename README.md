# Virtual Health Precinct

Next.js, React and TypeScript application using the App Router and npm.
The home page contains a deterministic clinical simulation conversation with
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

No environment variables or external services are required for this prototype.
Local environment files are ignored by Git.

## Scenario logic

`lib/scenario.ts` owns the allowed state transitions and fixed Sandra dialogue.
Agreement at any active stage ends the conversation. Four consecutive refusals
reach the boundary-maintained outcome. Unclear replies keep the current state,
and stopping ends the conversation without further escalation.

`lib/classify-response.ts` is a temporary phrase matcher for development. It
recognises common agreement, refusal and stop phrases, ignoring case and basic
punctuation. Unrecognised, uncertain or conflicting phrases are treated as
unclear. It cannot reliably interpret arbitrary natural language and can be
replaced independently of the state transitions.

Conversation history stays in React state only; refreshing the page starts a new
conversation. No student responses are saved or sent to an external service.

Project requirements and planning documents are in `docs/`.

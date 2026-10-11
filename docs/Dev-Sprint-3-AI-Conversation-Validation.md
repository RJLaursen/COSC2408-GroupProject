# Sprint 3 AI Conversation Validation

## Purpose

Checked the existing Sprint 2 conversation on `main` on 11 October 2026 against
the [BA roadmap](BA-NFR-and-Enhancement-Roadmap.md). This covers MVP-01 core
behaviour and NFR-01 failure recovery, with an API-key exposure check relevant
to NFR-06. It supports the Week 1 baseline review.

## Current implementation

Qwen 3.8 27B is the primary model, followed by GPT-OSS 120B and GPT-OSS 20B.
The first AI call returns classification and a short meaning. The application
uses `getNextState()` to control branching and refusal pressure. Active turns
then generate Sandra's reply from raw dialogue, the application goal and advisory
meaning. Terminal turns skip generation.

## Validation completed

Ran 13 live student turns across six short conversations, then one affected-case
recheck after the small fix below: **14 live turns total**. All returned HTTP 200
with the expected classifications and states. Qwen handled both stages; live
fallback was not triggered. The extra reliability checks used isolated provider
mocks and mocked browser responses, not additional live AI calls.

| Test | Expected | Result |
|---|---|---|
| “can you do it?” / “am I allowed to?” | CONTINUE; INITIAL_REQUEST unchanged | Passed both questions |
| Clear refusal | REFUSE → PUSHBACK_1 | Passed |
| Question after refusal | CONTINUE; stay at PUSHBACK_1 | Passed |
| Three further refusals | PUSHBACK_2 → PUSHBACK_3 → NO_OUTCOME | Passed; minimising, workload and placement-feedback pressure progressed in order |
| Clear agreement | AGREE → YES_OUTCOME | Passed |
| Refusal, then agreement | PUSHBACK_1, then YES_OUTCOME | States passed; first reply exposed the safety defect below; affected turn passed after the fix |
| Explicit stop/distress | STOP → EXIT | Passed; terminal turns returned no Sandra dialogue or generation metadata |
| Casual uncertainty / prompt-injection request | CONTINUE; no progression or prompt disclosure | Passed; some redirect wording was awkward |
| Controlled fallback | Failed/unusable primary output tries the next model | Mocked Qwen failure and rejected generation both reached GPT-OSS 120B |
| All generation models fail, then Retry | Neutral error; no state advancement or fake reply; recovery | Mocked failures produced HTTP 503. Browser Retry sent the same INITIAL_REQUEST payload, kept one student message and recovered successfully |
| Loading and local Stop controls | Disable submission while waiting; Stop ends the session locally | Headless Chrome check passed; Stop made no additional conversation request |
| API-key handling | Server-side key; no exposure in client responses/scripts | Source review and checks of live responses and 14 loaded client scripts found no key exposure; mocked production response omitted debug metadata |

## Findings

One safety defect was found: Sandra said “please just go ahead and hang it.” The
existing procedural-instruction guard caught bag wording but missed the pronoun.
A one-line change in `lib/conversation.ts` extends that existing pattern to cover
“it”. Five targeted offline checks passed, including rejection of the captured
reply and acceptance of “Hang on”. The one live recheck returned REFUSE and the
first pushback without procedural instructions.

Minor dialogue limits remain: one reply invented “a dozen other patients”, and
some redirects asked for readiness despite an unresolved decision. These did not
change classification or scenario state. This was a compact baseline check, not
a load test, timeout test or full accessibility/mobile review.

## Sprint 3 considerations

- Keep monitoring AI reliability, rate limits and dialogue consistency.
- Preserve deterministic scenario logic and validate any later changes against it.
- Handle UX, accessibility and mobile improvements separately.
- Keep the current AI architecture unless a clear issue justifies changing it.

Checks: `npm run lint`, `npm run build` and `git diff --check` passed.

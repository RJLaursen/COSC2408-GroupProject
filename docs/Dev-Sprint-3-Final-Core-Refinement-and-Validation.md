# Sprint 3 final core refinement and validation

Date: 25 October 2026. Dev 1 worked from clean `main`; no branch, commit or push.
Reviewed the BA requirements, AI branching document, latest NFR roadmap, Week 2
Dev 1 record and Dev 2 Week 2 integration/testing report. This is a bounded final
pass, not a redesign or a claim of deployment approval.

## Changes

- Refined the existing semantic prompt: STOP requires an explicit wish to end the
  exercise/conversation itself or clear distress about continuing. In-world plans
  do not imply an exit. Questions quoting a prior refusal do not renew it; an
  explicit renewed refusal still counts. No regex classifier or extra AI call.
- Added Restart to YES, NO and EXIT. It aborts pending work, clears the request
  timeout, reply animation, errors and history, restores the opening/neutral
  character and focuses the empty input. Restart does not reload or call AI.
- Expanded outcome feedback within the existing cards: scope and patient-safety
  explanation, a respectful refusal example on YES, support contacts, and factual
  documentation/escalation follow-up on NO. A prior refusal state adds a supportive
  pressure note to YES; there is no new outcome branch or refusal counter.
- Added three official learning links only to YES/NO. The outcome body scrolls
  while Restart stays visible. Resource data is in `lib/learning-resources.ts`.
- Refined mobile layout: wider dialogue beneath the visible faces, smaller
  composer, labelled History/Patient details controls, and shorter-viewport
  positioning. VisualViewport resize and composer-size observation keep controls
  within the available area as far as browser testing can establish.

The two-stage AI architecture, Qwen → GPT-OSS 120B → GPT-OSS 20B order, scenario
transition function, validators, photographic assets, privacy and dependencies
were preserved. Educational guidance remains outside active Sandra dialogue.

## Focused live AI check

Hard stop at **16 student turns**, all HTTP 200: 14 initial checks, then one
targeted generation correction with two rechecks. No further optimisation cycle.

| Case | Expected / observed classification and state |
|---|---|
| “I'm going to the pub” | CONTINUE; INITIAL_REQUEST unchanged |
| “I gotta go” | CONTINUE; INITIAL_REQUEST unchanged |
| “I'm getting lunch” | CONTINUE; INITIAL_REQUEST unchanged |
| “I'll go speak to my facilitator” | CONTINUE; INITIAL_REQUEST unchanged |
| “I'm not comfortable administering that” | REFUSE; PUSHBACK_1 |
| “why keep asking when I said I am not assessed?” after refusal | CONTINUE; PUSHBACK_1 unchanged |
| “No, I'm still not doing it” | REFUSE; PUSHBACK_2 |
| “I won't administer the IV medication” | REFUSE; PUSHBACK_3 |
| Fourth refusal | REFUSE; NO_OUTCOME, empty reply |
| Immediate agreement / agreement after refusal | AGREE; YES_OUTCOME, empty reply |
| “Stop this simulation” / “I want to end this exercise” | STOP; EXIT, empty reply |
| Clear distress about continuing the exercise | STOP; EXIT, empty reply |
| Two targeted refusal rechecks | REFUSE; correct progression both times |

All 16 classifications matched expectations. Successful classification stages used
Qwen 8 times, GPT-OSS 120B 4 times and GPT-OSS 20B 4 times. Ten active generation
stages used Qwen 5 times, GPT-OSS 120B 4 times and GPT-OSS 20B once. Fallback was
used; these counts do not establish why each earlier model attempt was rejected.

No returned reply offered supervision, invented student authorisation or taught
step-by-step IV technique. However, the initial sample included “get it started”,
unsupported urgency (“critical dose” / “can't wait”) and a claim that Sandra could
not let the student leave. These were not accepted as clean dialogue results.
One compact generation-boundary clarification prohibited activation commands,
invented urgency and claims that the student cannot leave. The two affected
rechecks removed the activation/critical-dose wording.

**Remaining demonstrated issue:** a recheck still invented workload facts:
“I have three other patients needing attention and no one else to call in.”
This was recorded without another tuning cycle. The corrected STOP/compound-
question cases passed this small sample; perfect language reliability is not claimed.

## Controlled browser regression

| Area | Result |
|---|---|
| Immediate YES, four refusals/three distinct pushbacks to NO, later agreement | Passed; state transitions and pressure-note conditions checked |
| CONTINUE/off-topic and question between refusals | Passed; state preserved |
| Typed STOP and immediate local Stop | Passed; pending signal aborted |
| Restart from YES/NO/EXIT, including pending work and active reveal | Passed; opening-only history, neutral image, focused input, no AI request |
| Repeated Restart | Passed across 12 restart checks; no duplicate messages or previous-state leakage |
| Late response after Stop → Restart | Passed; did not alter the new session |
| Provider-unavailable presentation and Retry | Passed; no state advance/fake reply, same retry payload, no duplicate student message |
| Isolated API provider mock | Passed; all-model classification/generation failures returned 503 without a partial result, unsafe supervision output fell back to the next model, terminal STOP skipped generation, production omitted debug metadata |
| History, keyboard Send/Stop, focus return and Ctrl+Enter | Passed; Ctrl+Enter remains non-submitting |
| Reduced motion and 2,000-character limit | Passed |
| 1440×900 desktop and 768×1024 tablet | Passed; existing scene composition preserved |
| 390×844 and 390×500 | Passed; no horizontal overflow; composer about 122/120 px high, dialogue and controls reachable |
| VisualViewport height reduced independently to 420 px | Simulated check passed; composer, dialogue and History Stop remained reachable |
| Expanded feedback, resource links and Restart footer | Passed; content scrolls and footer remains visible |

Screenshots of the scene, long content, error and educational outcomes were
captured outside the repository and inspected. Browser helpers used controlled
responses and made no live provider calls. The short-viewport portrait received
one small positioning correction within the mobile pass.

## Learning resources

Direct requests returned HTTP 200 on the date above; page titles were checked,
and the Code of conduct response was verified as a PDF:

- [NMBA Registered nurse standards for practice](https://www.nursingmidwiferyboard.gov.au/Codes-Guidelines-Statements/Professional-standards/registered-nurse-standards-for-practice)
- [Australian Commission Medication Safety Standard](https://www.safetyandquality.gov.au/national-standards/nsqhs-standards/medication-safety-standard)
- [NMBA Code of conduct for nurses (PDF)](https://www.nursingmidwiferyboard.gov.au/documents/default.aspx?record=WD17%2f23850&dbid=AP&chksum=L8j874hp3DTlC1Sj4klHag%3d%3d)

Links have descriptive labels, announce the new-tab behaviour and use normal
anchors. The team/client must supply approved course-specific RMIT Canvas URLs;
add them to the resource array after approval. No Canvas links were invented.

## Handover and limitations

- Manual Dev 2/client review is still required, particularly the remaining invented
  workload wording. The final sample is bounded evidence, not an exhaustive AI evaluation.
- Deployment and actual Canvas embedding are **not verified** by this work.
- Screen-reader listening, physical mobile keyboards and broad browser testing
  remain open. The accessibility work is a basic review, not WCAG certification.
- The new outcome copy is aligned to the supplied scenario assumptions, not a
  general clinical policy or legal guarantee; obtain educator/client review.
- TTS/STT remain unimplemented. No unrelated teammate documents were changed.

## Final checks

`npm run lint`, `npm run build` and `git diff --check` passed. Temporary scripts,
records and screenshots stayed outside the repository. No dependencies, API keys,
environment configuration, scenario transitions or model order were changed.
The code is ready for manual Dev 2/client review with the workload-fact limitation
above; deployment readiness has not been demonstrated. No commit or push was made.

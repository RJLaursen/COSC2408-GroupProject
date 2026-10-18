# Sprint 3 Week 2 — Simulation Refinement and Validation

## Purpose

Refined the running MVP on `main` on 16 October 2026 against the current BA
roadmap, Week 1 development records, UX experience definition and usability
findings. The focus was a usable clinical interface, accessible interaction
feedback and a bounded dialogue review. The existing AI architecture, model
order, scenario states and educational outcome text were preserved.

The written UX material guided free-text interaction, a noticeable exit, no
scores/progress cues and learning content only after the conversation. The
linked Figma reference could not be opened during this work, so this is not a
claim of an exact match to the final visual design.

The sections below record the first refinement experiment. Its dashboard layout
and browser voice were subsequently rejected in visual review. The follow-up
section at the end supersedes those presentation choices and records their replacement.

## Changes implemented

- A clinical application header and supporting patient, medication, Sandra and
  student-role cards beside the desktop conversation. Mobile uses one column.
  Sandra has an initials placeholder, not final character artwork.
- A bounded conversation scroll area attached to the response form. New messages
  follow the bottom unless the student has scrolled up; a jump button is available.
- A growing textarea with internal scrolling at its maximum height and the existing
  2,000-character limit. Enter remains a newline; Ctrl+Enter does not submit.
- A skip link, visible keyboard focus, focus recovery after Send/Retry and a focused
  outcome heading. Waiting retains a status region, marks the log busy, disables
  duplicate submission and keeps Stop available.
- Optional browser-native Sandra voice, off by default. Only new Sandra replies
  are spoken. Stop voice, voice-off, terminal outcomes and Stop simulation cancel
  playback. Australian English is preferred, then English, then browser default.
  Unsupported/error cases leave the text conversation usable. No TTS service or
  dependency was added.
- One compact refinement in the existing prompt file: clarify questions referring
  to earlier refusals, answer the actual question before redirecting, and avoid
  inventing missing workload details. No phrase routing or validator rules were added.

## Validation

The exploratory sample was bounded to 12 attempts: two initial provider failures
and ten successful turns after network access was restored. After the prompt edit,
only three affected cases and ten core regression turns were run. One further
active turn checked real waiting and speech inside the local iframe. Total:
**26 live attempts, 24 HTTP 200 responses and two HTTP 503 responses**. Controlled
layout, speech and failure tests made no live provider calls.

| Area | Check | Result |
|---|---|---|
| Mobile | 390 × 844; conversation, long input, retry and outcome | Passed; no horizontal overflow |
| Tablet | 768 × 1024; supporting column and conversation | Passed; no horizontal overflow |
| Desktop | 1440 × 900; side-by-side clinical layout | Passed; screenshots reviewed |
| Long content | Mock 1,401-character Sandra reply, 1,700-character student message and several turns | Passed; bounded log, wrapping and older-message reading |
| Input growth | Actual typing/paste and maximum length | Passed; grows from about 98 px to 176 px mobile / 208 px larger screens, then scrolls; actual input capped at 2,000 characters |
| Keyboard/focus | Tab order, keyboard Send, Retry/outcome focus, Ctrl+Enter | Passed; visible 3 px outline, no trap found, Ctrl+Enter did not submit |
| Accessibility | Labels, headings, accessibility-tree roles and representative text contrast | Basic checks passed; not a screen-reader listening test or WCAG audit |
| Waiting | Real request in iframe plus controlled delayed request | Visible status and `aria-busy` worked; Send/input disabled, Stop usable |
| TTS | Off/on, new Sandra only, no replay/overlap, Stop voice/off/exit, unavailable/error cases | Controlled browser checks passed; real native speech emitted a start event and stopped on exit, using English fallback |
| Local iframe | Constrained widths, typing, real Send and Stop; response headers | Passed; no application X-Frame-Options/CSP blocked the local iframe |
| AI latency | Ten active post-change requests, measured through parsed HTTP response | Mean 571 ms; median 534 ms; slowest 1,035 ms |
| Core scenario | Agreement, four refusals, neutral questions between refusals, later agreement, typed Stop | All ten core live turns passed; terminal responses were empty and had no generation metadata |
| Failure/retry | Isolated provider failures and rejected output; browser Retry and Stop while pending | Passed; HTTP 503 did not apply a state transition or add fake dialogue; Retry preserved one student message; Stop aborted the pending request |

All ten latency-sample classifiers used Qwen 3.8 27B. Nine generations used Qwen;
one used GPT-OSS 120B after a primary response failed validation. Model, fallback
and request timing were recorded for each sample. The initial 403 failures were
excluded from successful-response latency statistics. This was not a load test.

**Local iframe embedding passed. Actual RMIT Canvas embedding remains unverified.**

## AI dialogue follow-up

The sample reproduced unanswered follow-ups and unsupported staff availability
claims, although it did not invent a numeric patient count. After the single
prompt refinement, the count question received an acknowledgement that Sandra
could not give a specific number. Short follow-ups still sometimes switched to
the medication request, and unsupported availability wording remained.

One classification defect remains reproducible. After a refusal, the question
“why keep asking when I said I am not assessed?” was classified REFUSE rather
than CONTINUE, advancing PUSHBACK_1 to PUSHBACK_2. The one affected-case recheck
still failed after the prompt clarification. The deterministic state machine
correctly followed the supplied classification; the language interpretation is
the problem. A neutral question between refusals passed the separate regression.
No further prompt-tuning cycle was attempted.

This means the UI/interaction work is implemented, but an unqualified merge-ready
claim for AI conversation quality is not justified yet. Keep this exact case for
the next focused follow-up rather than replacing the AI architecture.

## Known limitations

- Actual RMIT Canvas, deployment and broad cross-browser checks remain open.
- Speech voice quality/availability varies by browser and device. Native start and
  cancellation were observed; spoken quality was not assessed by listening.
- Accessibility review was basic; a screen reader and mobile on-screen keyboard
  should still be tried on real devices.
- The latency sample was small. Initial network/provider access failures recovered,
  but continuous availability, load and timeouts were not benchmarked.
- The compound-question classification defect, occasional invented availability
  and awkward redirection remain open.
- Final Sandra/Arthur visual assets are still for UX/team integration.

## Next-week handoff

- Address the demonstrated compound-question case with a focused check.
- Integrate agreed character/patient assets and compare the build with final UX.
- Test actual Canvas if access is available, then final browsers/deployment.
- Run the final end-to-end regression and fix remaining demonstrated issues.
- Prepare the final demonstration/presentation with the team.

## Final checks

`npm run lint`, `npm run build` and `git diff --check` passed. No dependencies,
environment configuration, scenario logic or model order changed. Temporary
test scripts, screenshots and the iframe harness were kept outside the repository.
No commit or push was made.

## Visual-review follow-up — ward scene

Reworked the interface around the requested Tate concept structure: a compact
top bar, a dominant ward scene, and conversation/composer below with a slight
overlap. Patient and placement facts now sit in an expandable overlay rather
than a permanent sidebar. Outcomes retain the scene behind a neutral reflection
panel and preserve the original educational text.

No suitable image assets existed. `app/ward-scene.tsx` contains a deliberately
featureless vector placeholder with Arthur in bed, oxygen/IV context and Sandra
standing on the right. The ward, Arthur and Sandra groups identify asset slots;
this is temporary artwork for layout review, not final character art. No remote
stock images or generated final assets were added.

The auto-growing bounded textarea, 2,000-character limit, keyboard focus recovery,
accessible status, retry semantics, long-text wrapping and careful log scrolling
were retained. Browser SpeechSynthesis and its controls were removed after the
manual voice-quality rejection. No replacement voice provider was integrated.

API requests still begin immediately. A normal Sandra typing bubble appears while
waiting, with a 700 ms minimum from submission for fast successful replies. New
dialogue then reveals over 800–1,400 ms; full reply text is always available to
assistive technology, while visual character changes are hidden from it. Reduced
motion skips the reveal. Stop remains available during requests, the short wait
and reveal; late responses are ignored. Terminal outcomes are not delayed for
presentation and do not receive fake dialogue.

| Follow-up check | Result |
|---|---|
| Desktop 1440 × 900, tablet 768 × 1024, mobile 390 × 844 | Initial scene, expanded details, alternating messages, long content, retry and outcomes passed; no horizontal overflow |
| Long content | 1,392-character Sandra reply and 1,708-character student input wrapped; textarea capped at 160 px desktop/tablet and 128 px mobile, then scrolled internally |
| Presentation timing with immediate controlled responses | API started in 0–1 ms; typing remained until about 700 ms, complete long reply visible by about 2.2 seconds total |
| Accessibility | One loading status region, full accessible reply during reveal, logical keyboard Send/Stop, visible focus, focus recovery and reduced-motion checks passed; no screen-reader certification claimed |
| Retry/Stop | Retry preserved one student message and the same request; Stop cancelled waiting/reveal/pending work, and a late response was ignored |
| Core live smoke | Four HTTP 200 turns: CONTINUE kept INITIAL_REQUEST, REFUSE advanced to PUSHBACK_1, later AGREE reached YES_OUTCOME; separate typed STOP reached EXIT |
| Models | All four classifiers and both active generations used `qwen/qwen3.8-27b`; no fallback needed; terminal turns had no generation |

Browser screenshots and test helpers were kept outside the repository. The
existing local development server was reused. AI prompts, classification/state
logic, safety validation, provider/model order, dependencies and real environment
configuration were untouched in this follow-up. The earlier compound-question
defect remains open; this was a presentation pass, not another AI evaluation.

Status: **READY FOR VISUAL REVIEW**. Final assets and a future natural voice
provider remain separate work. Actual Canvas and broad device/browser testing
remain unverified. Nothing was committed or pushed.

Final follow-up checks: `npm run lint`, `npm run build` and `git diff --check`
passed. Final screenshots were captured at all three target viewports; Stop also
remained visible in a shorter mobile viewport with the sticky top bar.

## Exact visual handoff implementation — 18 October 2026

The supplied archive was extracted locally into `.codex/ui-handoff/`. Both the
brief and PNG were inspected; the PNG guided composition, not patient facts or
production imagery. This pass supersedes the earlier scene-above-chat layout.

The ward now fills the viewport. Sandra is prominent in the left foreground,
Arthur is in bed behind/right, and the current Sandra line appears in a floating
bubble with a tail toward her face. A compact overlaid HUD contains History,
patient details and Stop. The translucent composer sits near the bottom.
The reference screenshot was not used or cropped as a production asset.

No approved separate images were available. The existing vector placeholders
were repositioned into independent ward, Sandra and Arthur layers in
`app/ward-scene.tsx`, ready for supplied clean artwork. Photorealism remains an
asset dependency. No image generator, remote stock images or new packages were used.

History is a native modal dialog: a right drawer on desktop/tablet and a full-width
sheet on mobile. It shows the complete local session, opens at the newest message,
preserves older reading during an incoming reply and closes without state changes
or API requests. Close, Escape, focus return and backdrop dismissal were checked.
Stop is also available inside the dialog.

The previous bounded textarea, input limit, focus recovery, 700 ms minimum thinking
presentation, fast reveal, reduced-motion behaviour and full accessible reply were
retained. Typing dots live in Sandra's bubble; there is one separate loading status
region. Voice and microphone slots are disabled and labelled unavailable; neither
captures or plays audio.

Controlled browser checks passed at 1440 × 900, 768 × 1024 and 390 × 844:

- Initial scene, expanded fixed patient facts, history, long dialogue/input,
  failure/retry and outcomes had no horizontal overflow. The bubble did not cover
  Sandra's face. Long dialogue scrolls within the bubble instead of being clipped.
- Immediate mocked responses started in 0–1 ms and kept the typing bubble for
  roughly 700 ms. Accessible full text was present once during visual reveal.
- CONTINUE preserved state, four refusals reached NO_OUTCOME, agreement reached
  YES_OUTCOME and typed/local Stop reached EXIT. Stop cancelled pending requests,
  minimum-wait/reveal presentation and late responses, including from History.
- Retry reused the same payload and preserved one student message. Keyboard
  Send/Stop, visible focus, modal focus containment, input limit and unchanged
  Ctrl+Enter behaviour passed. Reduced motion showed no intermediate reply text.

Screenshots were compared directly with the supplied PNG. One focused correction
pass fixed text-symbol rendering and the patient's mobile positioning. The main
remaining mismatch is the deliberately non-photographic art. Screenshots and test
helpers remain outside the repository; no live-provider evaluation was run.

AI prompts, API, model order, safety validation and scenario logic were untouched.
The original outcome educational paragraphs remain unchanged. Approved learning
resource/Canvas URLs are still needed; no links were invented. Actual Canvas,
real mobile keyboards, broad cross-browser and screen-reader listening tests remain
open. Status: **READY FOR VISUAL REVIEW**, not an automatic commit approval.

Final handoff checks: `npm run lint`, `npm run build` and `git diff --check` passed.
No commit or push was made.

## Supplied photographic assets — 18 October 2026

Replaced the vector ward, nurse and patient with the four supplied production
images. The background includes Arthur and no Sandra; the three Sandra canvases
are independently transparent and share the same 1024 × 1536 framing. Only the
four production assets were installed; archive prompts, notes and QA files were
kept outside the repository.

The already installed image optimizer produced quality-92 WebP copies without
resizing or trimming. All three alpha channels were verified byte-for-byte
identical to the PNG originals. Visual checks found no noticeable quality loss.
Total transfer size fell from 7,961,816 to 775,792 bytes (about 90% smaller).

| Installed file under `public/scene/` | Dimensions | Bytes |
|---|---|---:|
| `ward-arthur.webp` | 1672 × 941 | 187,326 |
| `sandra-neutral.webp` | 1024 × 1536 | 223,994 |
| `sandra-frustrated.webp` | 1024 × 1536 | 180,668 |
| `sandra-stern.webp` | 1024 × 1536 | 183,804 |

The room fills the scene with proportional cropping. Sandra remains anchored at
the bottom left with an unchanged 2:3 aspect ratio. All expressions load early
into the same rectangle, with a 140 ms opacity change; reduced motion removes it.
INITIAL_REQUEST/PUSHBACK_1 use neutral, PUSHBACK_2 frustrated and PUSHBACK_3 stern.
This is presentation state only: validated turns derive it from the existing
next state, and terminal outcomes retain the previous expression. The current
submission/reveal lock prevents a later turn changing the previous reply's image.

Mocked browser checks passed for CONTINUE, four refusals to NO, AGREE to YES,
typed/local Stop, retained terminal expressions, failure/Retry, history, keyboard,
focus and reduced motion. There were no live-provider requests or new dependencies.
Screenshots at 1440 × 900, 768 × 1024 and 390 × 844 were captured and inspected,
including frustrated/stern Sandra, history and outcome. One bounded mobile polish
pass reduced Sandra slightly, panned the room to retain Arthur's face, moved his
label below it and adjusted the speech tail. Long dialogue/input remained bounded
and no horizontal overflow was found.

AI/API/prompt/validator/state-machine files and educational outcome copy were
preserved. Voice and microphone remain unavailable. Expression differences are
subtle at phone size; real-device keyboard, screen-reader, broad browser and actual
Canvas checks remain outside this pass. Status: **READY FOR VISUAL REVIEW**.

Asset-integration final checks: lint, production build and `git diff --check`
passed. No commit or push was made.

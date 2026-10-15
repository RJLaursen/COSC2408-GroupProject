# BA — Non-Functional Requirements and Enhancement Roadmap

**Sprint 3 revision:** Week 2 evidence and prioritisation review (15 October 2026)  
**Document status:** Living roadmap; proposed implementation work remains subject to team agreement

## 1. Purpose

This document records potential improvements to the Virtual Health Precinct prototype and provides a lightweight way to assess their value, feasibility, priority, and status during Sprint 3.

The document is intended to support discussion and decision-making between the BA, developer(s), UX, and project manager. It is a **flexible roadmap of candidate improvements**, not a commitment to implement every item this sprint.

The existing minimum viable product (MVP) already supports a text-based clinical conversation with an AI nurse, including key response paths and escalation behaviour. Sprint 3 work should preserve and validate this core experience while identifying improvements that could make the simulation clearer, more accessible, more reliable, and more engaging.

## 2. Objectives

- Maintain traceability to the original MVP requirements and intended learning outcomes.
- Record observed issues and opportunities for improvement.
- Explore potential non-functional requirements (NFRs) and additional functional enhancements.
- Help Dev and UX understand candidate improvements and their rationale.
- Prioritise work according to educational value, user benefit, feasibility, dependencies, and available time.
- Record what was implemented and verified, and what was deferred or dropped with reasons.
- Produce a useful list of recommendations for future development.

## 3. Scope and terminology

This roadmap covers candidate improvements to the existing prototype. It does not replace the original BA requirements or scenario documentation.

For clarity, this document includes two related types of work:

- **Non-functional requirements (NFRs):** qualities or constraints that describe how the application should operate, such as usability, accessibility, reliability, performance, security, and compatibility.
- **Functional enhancements:** additional user-facing capabilities, such as text-to-speech or microphone input.

Some ideas overlap. For example, mobile compatibility is a requirement about supported use, while implementing a responsive layout is one way to meet it.

### Out of scope unless explicitly agreed

- Replacing the existing AI conversation system without a clear reason.
- Rebuilding the application architecture solely for speculative future features.
- Treating every idea in this roadmap as a Sprint 3 deliverable.
- Making changes that compromise the core scenario, escalation behaviour, or educational purpose.

## 4. Current MVP baseline and Sprint 3 evidence

The original MVP includes a Next.js/React/TypeScript application, a text-based conversation with the AI nurse Sandra, basic response classification, deterministic scenario branching, refusal pressure, escalation/stop outcomes, and server-side Groq integration.

### Development and validation evidence (11 October 2026)

Dev 1's **Sprint 3 AI Conversation Validation** report describes 14 live student turns total (13 initial turns across six conversations, plus one affected-case recheck). All reported live turns returned HTTP 200 with expected classifications and states. Qwen 3.8 27B handled the tested live calls; no live fallback occurred. GPT-OSS 120B and GPT-OSS 20B are configured as later fallbacks.

Reported live cases covered uncertainty, refusals and pushback progression, agreement, refusal followed by agreement, explicit stop/distress, and a prompt-injection-style request. A problematic reply containing an inappropriate procedural instruction was detected, the existing guard in `lib/conversation.ts` was extended, five targeted offline checks passed, and the affected live case was rechecked successfully.

Additional **mocked** checks covered primary-model failure, unusable generation output, error and Retry behaviour, loading controls, and local Stop behaviour. Source/client-response checks did not identify API-key exposure within the scope examined. Lint, build, and diff checks passed. These results are a meaningful baseline, not exhaustive evidence of correctness, resilience, security, or accessibility.

Dev 2's **Integration and Regression Testing — Sprint 3, Week 1** document reviewed and mapped **Dev 1's reported findings** to this roadmap. It was an evidence review, not an independent repeat of all the live or mocked tests.

### Known limitations and remaining concerns

- One response introduced an unsupported detail about patient workload; some redirects were awkward despite correct state transitions.
- Live fallback did not occur during the reported runs; failure and recovery were exercised with mocks rather than a live-provider outage or load test.
- There was no full load, timeout, accessibility, mobile, or broad browser compatibility assessment in the reported Dev 1 tests.
- Correct scenario transitions do not, by themselves, demonstrate that every response is realistic or supports the intended scope-of-practice learning outcome.

### UX design baseline

The UX member reports an end-to-end walkthrough of the **interactive Figma prototype**. They reconciled spacing, typography, and colours across screens, reviewed component states and contrast, and specified how long text should grow or truncate while keeping the ward scene and input row stable. These are **design/specification outcomes**, not verified changes to the running application.

UX identified five build-level checks still needed: (1) actual AI latency and waiting-state behaviour, (2) real generated dialogue lengths against the specified layout, (3) free-text field growth during typing, (4) Canvas iFrame embedding, and (5) keyboard focus order and screen reader behaviour. The waiting state should communicate status accessibly (for example, using an appropriate live region).

UX design reference: [Capstone Interactive Figma prototype](https://www.figma.com/design/cg8olBGlN4TM0OdzNkfztt/Capstone-Interactive?node-id=0-1&t=ASSxKzLufo83zYTH-1).

Any defect against an original MVP requirement should be tracked as an MVP issue, not automatically reclassified as an optional enhancement.

## 5. Prioritisation approach

Use MoSCoW as a discussion aid, not as a promise that all high-priority items will be delivered.

- **Must have:** Needed to preserve or complete an agreed MVP requirement, or to address a significant usability, reliability, security, or learning issue.
- **Should have:** Valuable improvement that is likely to be achievable if time and dependencies permit.
- **Could have:** Useful enhancement that can be explored or attempted if capacity remains.
- **Won't have this sprint / Deferred:** Not planned for implementation in this sprint; it may be reconsidered later.

Assess **priority** separately from **feasibility**. A high-value idea may still be deferred if it is too complex, has unresolved dependencies, or risks destabilising the MVP.

### Status definitions

- **Proposed:** Identified but not yet assessed.
- **Investigating:** Value, approach, or feasibility is being explored.
- **Approved for attempt:** The team agrees it is a reasonable candidate to attempt; delivery is not guaranteed.
- **In progress:** Work has started.
- **Implemented — unverified:** A change appears to be in place but has not yet passed agreed checks.
- **Verified:** Acceptance criteria have been checked and met.
- **Deferred:** Kept for possible future work.
- **Dropped:** No longer recommended, with a reason recorded.

## 6. Candidate improvement register — Week 2 review

Priorities and feasibility assessments remain **provisional**, unless the team explicitly agrees otherwise. Status below refers to the specific requirement in the row, not to completion of a whole category. **Partially evidenced** means some relevant checks exist, but not all acceptance criteria or target environments have been verified.

| ID | Area | Requirement / candidate improvement | Priority (provisional) | Week 2 evidence / status | Remaining acceptance or follow-up checks |
|---|---|---|---|---|---|
| MVP-01 | Core behaviour | Preserve appropriate conversation classification, refusal pressure, escalation/stop paths, and safe dialogue. | Must have | **Partially evidenced:** Dev 1 reported successful live turns and fixed/rechecked one procedural-instruction defect; Dev 2 reviewed the report. | Recheck representative scenarios after relevant changes; investigate invented details and awkward redirects; assess learning suitability, not only state transitions. |
| NFR-01 | Reliability | Provide clear AI failure feedback and a recovery path without advancing the scenario incorrectly. | Should have | **Partially evidenced:** mocked model fallback, HTTP 503, browser Retry, loading/Stop behaviour passed; not a live outage/load test. | Check real response latency and waiting state; consider timeout/rate-limit cases, and ensure recovery is understandable. |
| NFR-02 | Responsive design | Keep conversation and input usable on agreed mobile/tablet/desktop sizes. | Should have | **Design specified, build unverified:** UX documented long-text growth and fixed-layout expectations in Figma. | Test actual generated text and typing on agreed screen sizes; check text overflow and input growth in the running app. |
| NFR-03 | Accessibility and readability | Support readable content, contrast, keyboard interaction, understandable labels, and accessible status feedback. | Should have | **Design reviewed, build unverified:** UX reports a contrast audit of the prototype/palette. | Test keyboard focus order, screen reader behaviour, control labels, and accessible announcement of waiting/response states. |
| NFR-04 | Usability | Improve hierarchy, spacing, dialogue readability, and clarity of available actions. | Should have | **Design specified, build unverified:** UX reports reconciled spacing/type scale/component states across the interactive prototype. | Compare actual UI with the written specification and inspect usability during real dialogue; document agreed deviations. |
| ENH-01 | Visual design | Refine ward interface with consistent visual presentation and clinical context. | Could have | **Prototype refined:** interactive Figma and specification provide design direction; implementation is not confirmed. | Dev/UX to choose feasible components; BA to assess whether changes improve clarity without harming the MVP. |
| ENH-02 | NPC representation | Consider portrait/lightweight character assets before larger animated/3D models. | Could have | **Proposed; no implementation evidenced.** | Discuss effort, accessibility, loading cost and educational benefit before committing. |
| ENH-03 | Text-to-speech | Explore optional spoken output for Sandra's dialogue. | Could have | **Proposed; no implementation evidenced.** | Assess browser support, playback control, readable text fallback, and effort. |
| ENH-04 | Microphone / speech input | Explore optional speech-to-text student input with a text fallback. | Could have | **Proposed; no implementation evidenced.** | Assess permission handling, browser support, transcription errors, fallback and privacy implications. |
| NFR-05 | Browser compatibility | Verify intended browser support and Canvas embedding. | Should have | **Open:** UX explicitly identified Canvas iFrame testing; no live compatibility results provided. | Test agreed browsers and the actual Canvas embedding environment; record issues. |
| NFR-06 | Security and privacy | Avoid exposing API credentials or unnecessary sensitive information to the client. | Must have for relevant risks | **Partially evidenced:** Dev 1's source and sampled client-response/script checks found no API-key exposure; Dev 2 reviewed reported evidence. | Recheck after relevant changes; clarify what student data is retained/logged; do not describe this as a full security audit. |
| ENH-05 | Interaction feedback | Make scenario progression, waiting, and important decision states understandable. | Could have | **Design follow-up identified:** UX specified a waiting state, but real latency and accessible status announcement require build checks. | Test waiting state under real AI latency; verify it does not obscure dialogue or mislead users about state changes. |

### Recommended focus for Week 2 and Week 3

1. **Protect MVP correctness and learning outcomes:** preserve the corrected safety guard; monitor unsupported dialogue details and unnatural redirects; recheck major branches after relevant changes.
2. **Validate UI against actual content:** use real AI response lengths and long typed messages to test the UX-specified dialogue and input growth behaviour.
3. **Check accessibility and practical delivery:** waiting-state announcements, keyboard/screen reader behaviour, mobile layouts, and Canvas iFrame embedding.
4. **Keep optional additions exploratory:** NPC models, voice output, and microphone input remain possible future improvements rather than assumed sprint commitments.

These are BA recommendations based on available evidence, **not confirmed development assignments or agreed deferrals**. Dev, UX, and the PM should confirm feasible priorities.

## 7. Three-week review plan

The roadmap supports the existing BA planner tasks. The planner task titles remain unchanged; this section explains how the roadmap can contribute to each task.

### Week 1 — Validate MVP Requirements and AI Conversation Behaviour

**Focus:** Establish the current baseline and identify candidate improvements.

Activities:
- Re-run or review checks for the core AI conversation, key response paths, and escalation behaviour.
- Record defects or gaps against existing requirements separately from optional enhancements.
- Review the initial candidate improvement register with Dev and UX where possible.
- Identify the educational or user benefit of each candidate.
- Agree which items need further investigation before the team can make a decision.

Expected outputs:
- Confirmed or updated MVP baseline.
- Initial prioritisation and feasibility questions.
- Roadmap updated with observations and next steps.

### Week 2 — Validate AI Responses, Scenario Branching and Learning Outcomes

**Focus:** Connect reported AI validation evidence and UX specifications to learning outcomes and realistic implementation priorities.

Activities:
- Review existing Dev 1 and Dev 2 validation evidence for refusal, agreement, pushback, stop, recovery and safety behaviour; distinguish reviewed evidence from any new independent BA testing.
- Relate the remaining dialogue-quality issues to realism and the intended scope-of-practice learning outcomes.
- Map the UX prototype specifications to testable requirements for real response length, typing, waiting feedback, keyboard accessibility, and Canvas embedding.
- Refine priorities, acceptance checks, and known limitations in this roadmap using evidence currently available.
- Seek team feasibility decisions where possible; do not mark optional enhancements approved, implemented or deferred without such a decision.

Expected outputs:
- Week 2 evidence summary linked to MVP-01, NFR-01, NFR-02/03/04/05/06, and relevant enhancements.
- Revised roadmap with clear separation between verified behaviour, design specifications and outstanding build tests.
- Open questions and candidate priorities for Dev and UX consideration.

### Week 3 — Conduct Final MVP Requirements and Scenario Validation

**Focus:** Validate the end-of-sprint state and recommend future work.

Activities:
- Recheck the original MVP requirements and core scenario behaviour after any changes.
- Verify implemented enhancements against their acceptance checks.
- Record remaining defects, incomplete work, and known limitations.
- Update each candidate's final status and document important decisions.
- Recommend a prioritised set of follow-up items for future development, if applicable.

Expected outputs:
- Final Sprint 3 roadmap.
- Summary of implemented and verified enhancements.
- Outstanding issues and deferred items with reasons.
- Recommended next steps for future development.

## 8. Evidence references, decisions and change log

### Evidence reviewed for this revision

- **Dev 1:** `Sprint 3 AI Conversation Validation` — reported testing on 11 October 2026; live AI conversation, targeted safety fix, mocked fallback/retry checks, local controls and key-exposure review.
- **Dev 2:** `Dev 2 Integration and Regression Testing — Sprint 3, Week 1` — review of Dev 1's reported results, limitations and roadmap traceability; not a separate live-test run.
- **UX:** interactive Figma prototype and planner-board work summary — visual system, text overflow specifications, component states and contrast; outstanding build-level validation noted.

### Change log

| Date / Week | Item IDs | Update | Evidence / reason | Next action |
|---|---|---|---|---|
| Sprint 3, Week 1 | All | Initial candidate register created. | Initial roadmap based on reported MVP state. | Review as evidence becomes available. |
| 15 Oct 2026 — Week 2 review | MVP-01 | Record successful sampled branching checks and corrected procedural-instruction guard; keep wider educational validation open. | Dev 1 live tests and affected-case recheck, reviewed by Dev 2. | Recheck after conversation changes; monitor invented details and awkward redirects. |
| 15 Oct 2026 — Week 2 review | NFR-01, NFR-06 | Add partial evidence for recovery and API-key handling, with explicit limitations. | Dev 1 mocked reliability and source/client checks, reviewed by Dev 2. | Assess real latency/timeout behaviour and recheck security after changes. |
| 15 Oct 2026 — Week 2 review | NFR-02, NFR-03, NFR-04, ENH-01, ENH-05 | Record UX design progress separately from application implementation. | Interactive Figma and planner-board UX summary. | Test long responses, input growth, focus order, accessible waiting feedback and layout in the build. |
| 15 Oct 2026 — Week 2 review | NFR-05 | Add Canvas iFrame embedding as a concrete outstanding check. | UX handover. | Validate in the deployed/embedded environment when available. |
| 15 Oct 2026 — Week 2 review | ENH-02, ENH-03, ENH-04 | Keep exploratory; no delivery or formal deferral claimed. | No implementation evidence provided in the reviewed materials. | Consider only if MVP stability and team capacity allow. |

This log documents **BA assessment and evidence updates**, not a claim that Dev/UX/PM have approved every recommendation. Record subsequent implementation and prioritisation decisions when confirmed.

## 9. Final Sprint 3 review

Complete this section at the end of Week 3.

### MVP validation
- **Core requirements rechecked:** [To be completed]
- **Scenario and escalation checks completed:** [To be completed]
- **Outstanding MVP issues:** [To be completed]

### Enhancement summary
- **Implemented and verified:** [To be completed]
- **Implemented but not yet verified:** [To be completed]
- **Deferred for future work:** [To be completed]
- **Dropped with rationale:** [To be completed]

### Recommendations
[Summarise the most valuable next steps, based on observed results, educational value, feasibility, and remaining project needs.]

## 10. Review principles

1. Preserve the core educational purpose and existing MVP behaviour.
2. Treat candidate enhancements as options, not guaranteed Sprint 3 deliverables.
3. Base decisions on testing, team feedback, feasibility, and available capacity.
4. Record why significant changes are made.
5. Distinguish investigation, design, implementation, and verification.
6. Do not claim an item is complete until its agreed acceptance checks have been performed.
7. Keep this document lightweight and useful to the team; update it when there is meaningful new information.

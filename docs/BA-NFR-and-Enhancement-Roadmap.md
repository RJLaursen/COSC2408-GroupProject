# BA — Non-Functional Requirements and Enhancement Roadmap

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

## 4. Current MVP baseline

Based on the team's latest reported testing, the prototype has a working foundation:

- The application can be set up and run.
- A student can have a text-based conversation with the AI nurse character, Sandra.
- Basic agreement/disagreement and yes/no response paths work.
- Escalation behaviour is available.
- The current implementation uses a server-side API route to access Groq, keeping the API integration on the server side.
- The interface is functional but remains visually simple compared with the intended clinical simulation experience.

Previously observed limitation:
- The AI service has occasionally reached token or rate limits. Waiting and retrying has allowed testing to continue. This should be considered when evaluating reliability and error handling.

This baseline is provisional and should be reconfirmed during Sprint 3. Any newly discovered defect in an existing MVP requirement should be tracked as an MVP issue, rather than automatically being treated as an optional enhancement.

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

## 6. Candidate improvement register

Initial priorities and feasibility ratings below are **provisional suggestions**. The BA should refine them with Dev, UX, and the project manager after reviewing the current build and available time.

| ID | Area | Candidate requirement or enhancement | Rationale | Initial priority | Feasibility to assess | Suggested acceptance checks | Initial status |
|---|---|---|---|---|---|---|---|
| MVP-01 | Core behaviour | Reconfirm that the main clinical conversation, response paths, and escalation behaviour still work as intended. | Protects the core educational purpose while changes are made. | Must have | Low–Medium | Run agreed test conversations and record expected versus actual behaviour, including escalation. | Proposed |
| NFR-01 | Reliability | Provide clear feedback and a recovery path when the AI service fails, times out, or is rate-limited. | Prevents the student experience from appearing broken when an external service is unavailable. | Should have | Medium | A simulated or observed service failure produces a clear message; retry guidance is available where appropriate; no sensitive server details or API keys are exposed. | Proposed |
| NFR-02 | Responsive design | Keep the main conversation usable on agreed desktop, tablet, and mobile viewport sizes. | Supports access across student devices. | Should have | Medium | Dialogue, input, and essential controls remain visible and usable at agreed viewport sizes without unintended horizontal scrolling. | Proposed |
| NFR-03 | Accessibility and readability | Review text readability, contrast, keyboard operation, focus visibility, and control labels. | Makes the simulation easier to use for a wider range of students. | Should have | Low–Medium | Complete a basic accessibility review; essential controls have understandable labels and visible focus; text remains readable at agreed sizes. | Proposed |
| NFR-04 | Usability | Improve the hierarchy and spacing of the conversation interface and make the student's available actions clear. | Reduces friction and helps students concentrate on the clinical decision. | Should have | Medium | UX reviews the primary conversation flow; users can identify the latest dialogue and the next available action without ambiguity. | Proposed |
| ENH-01 | Visual design | Refine the ward interface with a more consistent visual style and clearer clinical context. | Improves presentation without requiring a full environment rebuild. | Could have | Medium | Agreed design changes are applied consistently and do not obstruct the conversation or key controls. | Proposed |
| ENH-02 | NPC representation | Add a nurse portrait or other lightweight visual representation; consider more complex models only if justified. | Helps students identify the speaking character and gives the simulation more presence. | Could have | Low–High, depending on approach | The character is identifiable throughout the interaction; the visual does not obscure essential content; asset loading remains acceptable. | Proposed |
| ENH-03 | Text-to-speech | Explore an optional way for students to hear the nurse's dialogue spoken aloud. | May improve accessibility and make dialogue feel more natural. | Could have | Medium | If attempted, playback can be started and stopped; text remains available; failure to play speech does not block scenario completion. | Proposed |
| ENH-04 | Microphone / speech input | Investigate whether speech-to-text input is feasible and appropriate for this prototype. | Could make the interaction more conversational, but may add browser, permission, and error-handling complexity. | Could have | Medium–High | Before implementation is approved, confirm browser support, permission handling, transcription failure behaviour, and a usable text-input fallback. | Proposed |
| NFR-05 | Browser compatibility | Confirm the intended browser/device support and check the prototype in the agreed environments. | Helps avoid avoidable issues during demonstration or student use. | Should have | Low–Medium | Record the browsers and devices checked, along with any reproducible compatibility issues. | Proposed |
| NFR-06 | Security and privacy | Review API-key handling and avoid exposing secrets or unnecessary sensitive information in the client. | Protects credentials and supports responsible handling of student interactions. | Must have for relevant risks | Medium | Confirm secrets are accessed server-side and are not committed to the repository or returned in client responses; record any identified privacy concerns for team review. | Proposed |
| ENH-05 | Interaction feedback | Explore clearer visual feedback when the scenario branches, escalation is triggered, or the student reaches an important decision point. | Helps students understand how the conversation is progressing. | Could have | Low–Medium | If implemented, key state changes are noticeable and understandable without changing the intended scenario logic. | Proposed |

### Notes on the register

- The register is a starting point; the team may add, merge, reprioritise, defer, or remove items.
- The initial feasibility ratings are estimates to be reviewed with Dev and UX, not technical conclusions.
- “Must have” for security means a relevant risk must be addressed; it does not automatically require a large new security feature.
- Avoid adding an enhancement simply because it is visually impressive. Prefer improvements that support learning, accessibility, reliability, or usability.
- Keep the original MVP requirements as the source of truth for core expected behaviour.

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

**Focus:** Use scenario testing and team feedback to refine priorities.

Activities:
- Test representative AI responses and important scenario branches against the intended learning outcomes.
- Record unexpected responses, confusing transitions, or issues requiring further work.
- Discuss proposed interface, accessibility, reliability, and interaction changes with Dev and UX.
- Update acceptance criteria and dependencies where necessary.
- Decide which enhancements are reasonable to attempt, and defer those that are too risky or time-consuming.

Expected outputs:
- Updated scenario-validation findings.
- Revised priorities and acceptance criteria.
- Recorded decisions about which enhancements to attempt, investigate further, defer, or drop.

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

## 8. Decision and change log

Record meaningful decisions as the roadmap evolves. Keep entries concise and evidence-based.

| Date / Week | Item ID | Change or decision | Reason / evidence | Follow-up |
|---|---|---|---|---|
| Sprint 3, Week 1 | All | Initial candidate register created. | Initial planning based on the current reported MVP state. | Confirm baseline and review with Dev and UX. |

Add a row whenever a priority changes, an item is approved for attempt, a feature is deferred or dropped, or an item is implemented and verified.

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

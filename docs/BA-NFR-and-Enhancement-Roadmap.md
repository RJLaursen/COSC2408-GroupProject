# BA — Non-Functional Requirements and Enhancement Roadmap

**Sprint 3 revision:** Week 3 — Final planned BA review (22 October 2026)  
**Document status:** Final planned roadmap revision; pending final implementation and regression verification  
**Document owner:** Business Analyst (BA)

## 1. Purpose

This document records the non-functional requirements (NFRs) and potential enhancements identified during development of the Virtual Health Precinct clinical simulation.

The roadmap provides a lightweight reference for evaluating requirements, reviewing implementation progress, identifying outstanding issues, and recommending future improvements.

It is a **flexible set of improvement opportunities**, not a commitment to implement every proposed feature during Sprint 3.

The current MVP provides a functioning AI-powered nursing simulation with scenario branching, refusal pressure, escalation behaviour, and a redesigned clinical interface. The main priority remains preserving the educational purpose and reliable operation of this existing functionality.

This Week 3 revision summarises progress across Sprint 3 using the development, UX, and testing evidence currently available.

**Important:** Further changes may occur before the final demonstration and handover. Any subsequent implementation should be reviewed through the Dev 2 testing role, with significant findings incorporated into the project documentation.

## 2. Objectives

- Confirm the current MVP against its original functional requirements and learning objectives.
- Review AI conversation behaviour, scenario branching, escalation, and safety.
- Record implemented UI, accessibility, reliability, and interaction improvements.
- Identify outstanding defects, compatibility limitations, and incomplete requirements.
- Distinguish completed implementation from partial or unverified functionality.
- Record optional enhancements that may be considered for future development.
- Support final testing, demonstration, and potential client handover.

## 3. Scope and terminology

This roadmap supplements the original BA requirements and scenario documentation.

It includes:

- **Non-functional requirements (NFRs):** Application qualities such as reliability, accessibility, performance, compatibility, security, and usability.
- **Functional enhancements:** Additional capabilities such as text-to-speech, microphone input, educational resources, or restart functionality.
- **MVP validation:** Verification that the existing clinical scenario, AI responses, and intended learning outcomes continue to operate correctly.

### Scope limitations

The roadmap does not require:

- Implementation of every proposed enhancement.
- Replacement of the existing AI architecture without demonstrated need.
- Major architectural changes solely to support optional features.
- Completion of advanced voice or animation features before the final demonstration.

The primary focus remains maintaining a usable and educationally appropriate MVP.

## 4. Current MVP and Sprint 3 Evidence

### 4.1 Original MVP baseline — Week 1

The original MVP includes:

- Next.js, React, and TypeScript application.
- Server-side Groq AI integration.
- AI nurse character Sandra.
- Free-text student responses.
- AI classification and scenario branching.
- Refusal pressure and escalation behaviour.
- Agreement, refusal, and stop outcomes.
- Basic conversation and session controls.

Dev 1's validation on 11 October 2026 reported successful testing of the principal scenario paths across 14 live turns, including the affected-case recheck.

Additional mocked tests supported AI fallback, recovery, retry, loading, and Stop behaviour.

A safety-related procedural instruction defect was identified, corrected, and rechecked successfully.

Dev 2 reviewed these results against the existing BA requirements, recording the evidence and its limitations.

### 4.2 Week 2 implementation progress — 16–18 October 2026

Dev 1 subsequently refined the application interface while preserving the existing AI architecture, scenario states, and educational outcome text.

The latest reported implementation includes:

- A redesigned, viewport-filling hospital ward environment.
- Photographic scene and character assets for Sandra and Arthur.
- Multiple Sandra expressions associated with scenario pressure states.
- Floating dialogue and student input areas.
- Conversation history accessible through a dedicated dialog.
- Expandable patient information.
- Improved Stop simulation functionality.
- Responsive layouts for different viewport sizes.
- Improved loading feedback, text handling, keyboard interaction, and reduced-motion behaviour.

The latest interface replaces earlier experimental dashboard layouts and placeholder character artwork.

Browser-native text-to-speech was investigated during development but removed following visual and voice-quality review. No replacement voice service was implemented. Microphone input also remains unavailable.

### 4.3 Dev 1 testing evidence

Dev 1 reported controlled browser checks at the following viewport sizes:

| Environment | Viewport | Reported result |
|---|---|---|
| Desktop | 1440 × 900 | Passed |
| Tablet | 768 × 1024 | Passed |
| Mobile | 390 × 844 | Passed |

The checks covered core layout, conversation display, text overflow, input handling, history, outcomes, and responsive positioning.

Additional reported tests included:

- AI conversation and scenario regression checks.
- Loading and waiting-state behaviour.
- Error recovery and Retry.
- Stop functionality during pending requests.
- Keyboard focus and history-dialog interaction.
- Reduced-motion behaviour.
- Basic accessibility structure.
- NPC expression changes.
- Long dialogue and input handling.

Lint, production build, and diff checks passed in the reported development work.

These results support the quality of the current implementation but do not establish full physical-device compatibility, deployment readiness, or comprehensive accessibility compliance.

### 4.4 Dev 2 Week 2 integration review

Dev 2 updated the local repository and reviewed the improved application.

The following behaviour was directly observed:

| Area | Dev 2 observation |
|---|---|
| AI conversation | Worked during the tested interactions |
| Scenario branching | Followed expected paths in tested cases |
| Conversation history | Worked as expected |
| Patient information | Displayed correctly |
| Stop simulation | Successfully ended the session |
| YES/NO outcomes | Both outcome screens appeared |
| Responsive layout | Interface adjusted when resizing the browser |

These observations provide additional supporting evidence for the updated MVP.

However, Dev 2 also identified two improvement opportunities:

**Missing educational resources**

Both outcome screens display, but no learning resource links or resource placeholders were observed.

The original educational outcome text remains present. Approved learning resources or Canvas URLs are still required before links can be added.

**No dedicated restart option**

The Stop function ends the current session, but restarting requires refreshing the webpage.

This is manageable during desktop testing but may be inconvenient for students using mobile devices or a Canvas-embedded simulation.

Neither item is automatically classified as a blocking MVP defect without confirmation against the original client requirements.

### 4.5 Outstanding AI conversation issue

Dev 1 identified a reproducible classification inconsistency involving the question:

> "why keep asking when I said I am not assessed?"

After an earlier refusal, this question was classified as REFUSE rather than CONTINUE, advancing the pushback scenario unnecessarily.

The deterministic scenario state machine operated according to the received classification. The issue concerns interpretation of the student's response rather than the state machine itself.

A focused recheck did not resolve the issue.

Other minor dialogue concerns included occasional awkward redirection and unsupported assumptions about staff availability.

These findings should remain visible during final regression testing because they may affect dialogue realism and the intended learning outcomes.

### 4.6 UX progress and implementation alignment

The UX member produced an interactive Figma prototype and supporting visual specifications covering:

- Layout and visual consistency.
- Typography and colour.
- Component states.
- Text overflow.
- Dialogue and input behaviour.
- Accessibility considerations.

Dev 1 subsequently implemented a redesigned interface informed by the UX handoff materials.

This represents meaningful progress toward the intended simulation experience.

However, final visual alignment, accessibility, and device compatibility should still be assessed against the latest available specifications and application build.

### 4.7 Remaining validation limitations

As of this revision:

- The compound-question classification issue remains unresolved in the latest documented testing.
- Actual RMIT Canvas embedding has not been verified.
- Physical mobile-device and on-screen keyboard testing remains outstanding.
- A complete screen-reader or WCAG accessibility assessment has not been performed.
- Broad cross-browser testing and final deployment verification remain open.
- AI reliability has not been evaluated through comprehensive load or timeout testing.
- Additional implementation changes may occur after this BA review.

These limitations should be retained in the final project handover where relevant.

## 5. Prioritisation approach

The roadmap continues to use MoSCoW prioritisation.

- **Must have:** Essential MVP requirements or significant functionality, security, or educational concerns.
- **Should have:** Valuable improvements that support usability, reliability, or accessibility when resources permit.
- **Could have:** Optional enhancements that improve the experience but are not essential to the MVP.
- **Deferred:** Items recommended for future consideration due to time, complexity, dependencies, or limited capacity.

Priority does not automatically imply implementation approval.

### Status definitions

- **Proposed:** Identified for consideration.
- **Investigating:** Feasibility or value is under review.
- **Implemented:** Feature exists in the application.
- **Partially verified:** Supporting evidence exists, but relevant acceptance checks remain open.
- **Verified in tested scope:** Reported or directly observed checks satisfy the applicable requirements within the stated test scope.
- **Recommended for deferral:** Not considered a priority for the remaining sprint; formal agreement may still be required.
- **Open issue:** Known limitation or defect requiring follow-up.

## 6. Candidate Improvement Register — Week 3 Review

The table below reflects the latest available development and testing evidence.

Statuses are scoped to the checks performed and should not be interpreted as full production certification.

| ID | Requirement / improvement | Priority | Week 3 status | Remaining action |
|---|---|---|---|---|
| MVP-01 | Core AI conversation, scenario branching, escalation, and safe dialogue | Must have | **Verified in tested scenarios; open issue remains.** Core paths passed, but compound-question classification is inconsistent. | Recheck known issue and run final regression after changes. |
| NFR-01 | AI reliability, failure feedback, and recovery | Should have | **Partially verified.** Fallback, Retry, Stop, and error handling have supporting tests. | Continue monitoring real-provider failures, latency, and recovery. |
| NFR-02 | Responsive desktop, tablet, and mobile layout | Should have | **Verified at tested browser viewport sizes.** Dev 1 checks and Dev 2 resizing observations support implementation. | Test physical mobile devices and Canvas compatibility. |
| NFR-03 | Accessibility, readability, and keyboard interaction | Should have | **Partially verified.** Focus, loading status, reduced motion, text handling, and basic accessibility checks passed. | Test with screen readers and physical mobile devices. |
| NFR-04 | Conversation usability and interface clarity | Should have | **Implemented and verified in tested interactions.** History, patient details, dialogue, and Stop controls work. | Review final changes and consider restart usability. |
| ENH-01 | Improved ward interface and visual presentation | Could have | **Implemented.** New photographic ward and clinical interface are present. | Complete final visual review if assets or layout change. |
| ENH-02 | NPC character representation and expressions | Could have | **Implemented.** Sandra uses photographic assets and pressure-based expressions. | Review expression clarity on smaller devices. |
| ENH-03 | Optional text-to-speech | Could have | **Recommended for deferral.** Browser voice was trialled and removed; no replacement implemented. | Reconsider future voice service if resources permit. |
| ENH-04 | Microphone and speech-to-text input | Could have | **Recommended for deferral.** Controls remain unavailable. | Review browser support, permissions, privacy, and feasibility later. |
| NFR-05 | Browser and Canvas compatibility | Should have | **Partially verified.** Local iframe and controlled browser checks passed. | Test actual Canvas deployment and agreed target browsers. |
| NFR-06 | Security and privacy | Must have for relevant risks | **Partially verified.** Previous API-key handling checks found no exposure within tested scope. | Recheck after relevant changes and confirm data-handling expectations. |
| ENH-05 | Waiting-state and interaction feedback | Could have | **Implemented and verified in controlled checks.** Typing indicators, reveal behaviour, accessible status, and Stop/Retry interactions improved. | Recheck after UI changes and with assistive technology. |
| ENH-06 | End-of-scenario educational resources | Could have | **Proposed.** YES/NO outcomes exist, but approved learning resource links are unavailable. | Confirm resource requirements and obtain approved URLs from the client. |
| ENH-07 | Restart Simulation / Try Again control | Could have | **Proposed.** Restart currently requires refreshing the page. | Consider a dedicated restart option, especially for Canvas/mobile use. |

### 6.1 Recommended priorities for remaining work

**Priority 1 — Preserve MVP correctness**

- Recheck the known compound-question classification issue.
- Preserve correct refusal, agreement, and escalation behaviour.
- Verify final outcomes and safety-related dialogue.
- Run regression tests after relevant development changes.

**Priority 2 — Validate usability and accessibility**

- Confirm that history, patient information, input, and Stop continue working.
- Review the final interface on agreed viewport sizes.
- Check accessible interaction and relevant mobile behaviour.
- Verify Canvas compatibility if access is available.

**Priority 3 — Educational finishing improvements**

- Consider adding approved learning resource links to outcome screens.
- Evaluate a dedicated Restart Simulation option.
- Ensure any added features do not interfere with the existing conversation flow.

**Priority 4 — Future enhancements**

- Text-to-speech.
- Microphone input.
- Further NPC animation or interaction.
- Broader accessibility and deployment improvements.

These priorities are BA recommendations and remain subject to team capacity and client requirements.

## 7. Three-Week BA Review Summary

### Week 1 — Validate MVP Requirements and AI Conversation Behaviour

**Focus:** Establish the baseline and identify potential improvements.

Work included reviewing the existing MVP, Dev 1's conversation validation, scenario transitions, safety-related findings, and initial reliability evidence.

The first NFR and Enhancement Roadmap was established to record candidate requirements, priorities, acceptance checks, and future opportunities.

**Outcome:** Initial roadmap and MVP evidence baseline.

### Week 2 — Validate AI Responses, Scenario Branching and Learning Outcomes

**Focus:** Review validation findings and refine the roadmap using team progress.

Dev 1 and Dev 2 evidence was reviewed against the original learning objectives and requirements.

UX specifications were considered, and the roadmap was updated to distinguish implemented functionality, supporting design work, and outstanding validation needs.

Subsequent Week 2 development introduced the redesigned clinical interface, improved interaction controls, and photographic character assets.

**Outcome:** Revised priorities and evidence, together with identified limitations and follow-up testing requirements.

### Week 3 — Conduct Final MVP Requirements and Scenario Validation

**Focus:** Establish the final planned BA assessment and support end-of-sprint verification.

Activities:

- Review the current MVP against the original functional and educational requirements.
- Assess the latest available development and testing evidence.
- Confirm which NFRs and enhancements have supporting implementation evidence.
- Identify remaining defects, usability concerns, and testing limitations.
- Update the roadmap with implemented features and recommendations.
- Preserve follow-up actions for any subsequent Dev 1 or UX changes.
- Support final Dev 2 regression testing and handover documentation.

**Current outcome:** This revision records the latest known project state and recommendations.

**Pending:** Final implementation changes, any additional testing evidence, and relevant client or team decisions.

The document may receive a small final evidence or change-log update if new work materially changes its conclusions.

## 8. Evidence References, Decisions and Change Log

### 8.1 Evidence reviewed

**Dev 1 — Sprint 3 AI Conversation Validation (11 October 2026)**

Initial live AI tests, scenario branching, safety guard correction, mocked error recovery, and API-key handling review.

**Dev 2 — Integration and Regression Testing, Week 1**

Review of Dev 1's reported baseline findings and mapping to BA requirements.

**UX — Interactive Figma Prototype**

Interactive scenario walkthrough, visual consistency, text handling, and accessibility specifications.

**Dev 1 — Sprint 3 Week 2 Simulation Refinement and Validation**

Detailed implementation and testing of the redesigned interface, responsive layouts, conversation history, patient information, NPC assets, accessibility controls, and AI regression behaviour.

**Dev 2 — Integration and Regression Testing, Week 2**

Local review of updated conversation functionality, scenario branching, history, patient details, Stop, outcome screens, and responsive behaviour.

The Week 2 Dev 2 review also identified missing educational resource links and the absence of a dedicated restart control.

### 8.2 Change log

| Date / Week | Requirement(s) | Update | Reason / evidence |
|---|---|---|---|
| Sprint 3 Week 1 | All | Initial roadmap created. | MVP baseline and proposed NFRs. |
| 15 Oct — Week 2 | MVP-01, NFR-01, NFR-06 | Added AI validation and recovery evidence. | Dev 1 tests and Dev 2 review. |
| 15 Oct — Week 2 | NFR-02/03/04, ENH-01/05 | Recorded UX design progress and outstanding build checks. | Interactive Figma and UX handover. |
| 18 Oct — Week 2 development | NFR-02/03/04, ENH-01/02/05 | Recorded implemented UI, responsive behaviour, NPC assets, and interaction improvements. | Dev 1 implementation and controlled tests. |
| 18 Oct — Week 2 review | MVP-01 | Recorded unresolved compound-question classification issue. | Dev 1 targeted AI testing. |
| Week 2 Dev 2 review | NFR-04, ENH-06/07 | Recorded successful local UI checks and two improvement opportunities. | Dev 2 integration testing. |
| 22 Oct — Week 3 BA review | All | Updated implementation statuses, outstanding requirements, and follow-up recommendations. | Review of available Sprint 3 evidence. |

### 8.3 Future updates

Any changes after this revision should be recorded only where they materially affect implementation status, acceptance criteria, testing results, or handover recommendations.

Final Dev 2 verification should distinguish:

- Directly tested functionality.
- Findings supported by Dev 1's documented tests.
- New issues requiring attention.
- Outstanding requirements that could not be verified.

## 9. Final Sprint 3 Review — Current Assessment

### 9.1 MVP validation

**Core requirements:**

The available testing evidence supports the operation of the main AI conversation system, refusal and agreement paths, escalation, Stop, and outcome screens in the tested scenarios.

**Scenario and learning outcomes:**

The simulation supports practising appropriate responses to requests outside a nursing student's scope of practice.

The scenario structure remains suitable for this intended learning activity within the reviewed scope. However, the unresolved compound-question classification issue and occasional awkward AI wording demonstrate that further refinement may improve realism and consistency.

The review does not establish that every possible AI response will correctly support the intended learning outcome.

**Outstanding MVP issues:**

- Compound-question classification inconsistency.
- Minor dialogue realism and redirection concerns.
- Final regression testing after subsequent changes.

### 9.2 Enhancement summary

**Implemented with supporting validation evidence:**

- Redesigned hospital ward interface.
- Photographic NPC and patient assets.
- Sandra expression changes.
- Conversation history.
- Expandable patient details.
- Improved Stop functionality.
- Responsive browser layouts.
- Updated waiting-state and dialogue feedback.
- Keyboard, focus, and reduced-motion improvements.

**Implemented but requiring broader verification:**

- Mobile usability on physical devices.
- Accessibility with screen readers.
- Compatibility with final deployment and Canvas.
- Broader browser and reliability behaviour.

**Recommended for future development or deferral:**

- Text-to-speech.
- Microphone and speech-to-text input.
- Optional educational resource links.
- Restart Simulation functionality.
- Further NPC animation or interaction improvements.
- More comprehensive accessibility and compatibility validation.

No formal decision to permanently remove these enhancements is implied.

### 9.3 Overall assessment

The Virtual Health Precinct has progressed beyond its original text-based MVP into a more complete clinical simulation interface.

The current implementation provides the central educational interaction, improved clinical presentation, and additional controls that support student usability.

The main scenario functionality has positive validation evidence, although some dialogue inconsistencies and environmental testing limitations remain.

Given the project's limited development capacity, prioritising functional correctness, accessibility, and final integration testing over additional experimental features remains appropriate.

This is a **final planned BA assessment**, not unconditional approval of all future changes or a claim of completed production certification.

### 9.4 Recommendations for handover

1. Resolve or document the remaining AI classification defect.
2. Run final end-to-end regression tests after the last development changes.
3. Confirm any approved educational resources required for the outcomes.
4. Consider a dedicated restart control if useful for Canvas or mobile access.
5. Verify actual Canvas integration and deployment arrangements with the client.
6. Retain deferred enhancements in the roadmap for potential future development.

### 9.5 Pending final verification

**Final Dev 2 regression results:** Pending any subsequent changes and testing.

**Final client/deployment confirmation:** Pending where applicable.

**Additional roadmap revisions:** Limited to material findings or confirmed decisions.

## 10. Review Principles

1. Preserve the original MVP requirements and intended nursing learning outcomes.
2. Prioritise safe and correct AI conversation behaviour.
3. Distinguish reported testing, direct observation, and unverified functionality.
4. Treat optional enhancements as recommendations rather than guaranteed deliverables.
5. Avoid unnecessary changes that could destabilise the functioning MVP.
6. Document remaining defects and limitations accurately.
7. Record significant post-review changes through Dev 2 verification.
8. Keep the roadmap useful for final handover and future development.

# Dev 2 Integration and Regression Testing — Sprint 3, Week 2

## Purpose

This document records the Dev 2 review and testing of the updated Virtual Health Precinct MVP during Sprint 3 Week 2.

The purpose is to validate the latest application changes, confirm that the existing AI conversation and scenario functionality remain operational, and identify outstanding usability or integration issues.

The review supports the BA NFR and Enhancement Roadmap and the Sprint 3 Dev 2 task, **Support Integration Testing and Resolve MVP Functionality Issues**.

This document combines Dev 2's local testing observations with supporting evidence from Dev 1's Sprint 3 Week 2 refinement and validation report. These two evidence sources are distinguished below.

## 1. Scope of Review

The updated application introduces a redesigned clinical simulation interface while retaining the existing AI conversation architecture and scenario logic.

The following areas were considered:

- AI conversation and scenario branching.
- Refusal, agreement and escalation behaviour.
- Updated ward environment and NPC visuals.
- Conversation history and patient information.
- Stop simulation functionality.
- Responsive interface behaviour.
- End-of-scenario educational outcomes.
- Accessibility, reliability and remaining integration limitations.

The latest interface includes photographic ward and character assets, a floating dialogue panel, conversation history, patient details, and an updated response input area.

Text-to-speech and microphone functionality remain unavailable in the latest implementation.

## 2. Dev 2 Local Testing Results

The following results reflect the application behaviour observed during Dev 2's local review after updating the repository.

| Test Area | Expected Behaviour | Observed Result | Status |
|---|---|---|---|
| AI conversation | Student input produces appropriate AI responses | Conversation tested and worked as expected | Passed in tested cases |
| Scenario branching | Student decisions follow the expected conversation paths | Branching tested and worked in the reviewed scenarios | Passed in tested cases |
| Conversation history | Previous dialogue can be accessed during the simulation | History feature tested and worked | Passed |
| Patient details | Relevant patient information can be viewed | Patient details feature tested and worked | Passed |
| Stop simulation | Student can stop the current simulation | Stop functionality tested and worked | Passed |
| End outcomes | Agreement/refusal outcomes are displayed | Both YES and NO outcome screens appeared | Passed |
| Educational resources | Students should be able to access appropriate follow-up learning material if included in the agreed requirements | No resource links or placeholders observed | Improvement identified |
| Responsive layout | Interface adjusts to different display sizes | Layout adjusted when the browser window was resized | Initial check passed |
| Restart functionality | Student can conveniently begin another attempt | Restart option was not available after stopping; page refresh required | Improvement identified |

### Dev 2 observations

The updated interface represents a substantial improvement over the earlier text-based MVP.

The ward environment, nurse character and dialogue panel provide a clearer clinical context. The new history and patient-details controls also allow students to access information during the interaction.

The core conversation and scenario branching worked during the local review, with no additional blocking issues observed in those checks.

Two usability and educational improvements were identified:

1. The end-of-scenario screens currently lack learning resource links or placeholders.
2. The stopped simulation does not provide a dedicated restart button, requiring a full page refresh.

The layout also responded to browser resizing. This supports an initial responsive-design finding, although it does not establish complete compatibility with physical mobile devices or Canvas embedding.

## 3. Supporting Review of Dev 1 Validation

Dev 1's Sprint 3 Week 2 report documents additional implementation and testing that supports the Dev 2 review.

These results were reported by Dev 1 and should not be interpreted as tests independently repeated by Dev 2.

### Visual and interface improvements

Dev 1 implemented or refined:

- A viewport-filling hospital ward scene.
- Photographic assets for the ward, Sandra and Arthur.
- Different Sandra expressions associated with scenario pressure states.
- A floating nurse dialogue panel.
- A responsive conversation input area.
- A conversation history dialog.
- Expandable patient information.
- Updated loading, waiting and message-reveal behaviour.

The latest photographic assets replaced earlier vector placeholders.

### Responsive design

Dev 1 reported controlled browser testing at:

- Desktop: 1440 × 900.
- Tablet: 768 × 1024.
- Mobile: 390 × 844.

The report records successful layout checks, including long dialogue, input handling, history, outcomes and NPC positioning, without unintended horizontal overflow.

Dev 2's browser resizing observation is consistent with these findings.

However, real mobile-device keyboards, touch interaction across devices and actual Canvas embedding remain unverified.

### Accessibility and interaction

Dev 1 reported passing controlled checks involving:

- Keyboard focus and visible focus indicators.
- History-dialog focus handling.
- Accessible loading status.
- Reduced-motion behaviour.
- Long-text wrapping and internal scrolling.
- Retry and Stop interactions.
- Input-length restrictions.

These provide supporting evidence of accessibility improvements, but do not constitute a complete accessibility audit.

Screen-reader listening tests and real-device accessibility testing remain outstanding.

### AI conversation and reliability

Dev 1 reported that core scenario checks continued to pass after the interface changes.

These included:

- CONTINUE responses preserving the current scenario state.
- Refusal progressing through pushback states.
- Agreement reaching YES_OUTCOME.
- Refusal progression reaching NO_OUTCOME.
- Stop reaching EXIT.
- Retry preserving the pending request without duplicating the student response.

Previous controlled failure tests also demonstrated recovery behaviour without applying inappropriate state transitions.

The existing AI architecture, model order and deterministic scenario logic were preserved.

## 4. Findings and Outstanding Issues

### Issue 1 — Missing educational resource links

**Severity:** Low / Enhancement candidate

The YES and NO outcome screens are displayed, but no dedicated learning resources or resource placeholders were observed during Dev 2 testing.

Dev 1's report also confirms that the original educational outcome paragraphs remain unchanged and that approved learning resource or Canvas URLs are still needed.

**Recommendation:**

Consider adding relevant educational resource links to the outcome screens when approved materials are available.

These could support further learning about scope of practice, clinical escalation and appropriate refusal of unsafe instructions.

Whether the links are required for MVP completion should be confirmed against the original project requirements and client expectations.

### Issue 2 — No dedicated restart option

**Severity:** Low / Usability improvement

Stopping the simulation successfully ends the current session. However, Dev 2 observed that restarting requires refreshing the webpage.

This is manageable during desktop testing but may be less convenient when the application is embedded into Canvas or accessed from a mobile device.

**Recommendation:**

Consider adding a Restart Simulation or Try Again button after the session ends.

The button should begin a fresh conversation without retaining previous scenario progress.

This remains a suggested improvement rather than a confirmed MVP defect.

### Issue 3 — Compound-question classification inconsistency

**Severity:** Moderate / AI dialogue issue

Dev 1 identified a reproducible classification issue involving the following student response:

> "why keep asking when I said I am not assessed?"

After a previous refusal, this question was classified as REFUSE instead of CONTINUE, causing the scenario to advance from PUSHBACK_1 to PUSHBACK_2.

The deterministic state machine behaved according to the classification it received. The issue relates to interpretation of the student's response.

A targeted recheck by Dev 1 did not resolve the inconsistency.

**Recommendation:**

Retain this exact scenario as a focused regression test.

Investigate whether classification instructions can be refined without introducing regressions in existing refusal and escalation behaviour.

This issue was identified in Dev 1's testing and was not independently reproduced in the reported Dev 2 local review.

### Issue 4 — Outstanding compatibility and accessibility checks

**Severity:** Testing limitation

Although the interface responded correctly during browser resizing and Dev 1's controlled viewport tests, several areas still require additional verification:

- Actual RMIT Canvas embedding.
- Physical mobile devices and on-screen keyboards.
- Screen-reader interaction.
- Broader browser compatibility.
- Final deployment behaviour.

**Recommendation:**

Complete targeted compatibility and accessibility checks when the necessary devices and environment are available.

## 5. Link to BA Requirements and Enhancement Roadmap

The findings support the following requirements and enhancement items.

| Roadmap ID | Area | Current Finding |
|---|---|---|
| MVP-01 | Core behaviour | Core conversation and branching passed in the reviewed cases; a specific compound-question defect remains open |
| NFR-01 | Reliability | Previous fallback, failure and retry testing provides supporting evidence |
| NFR-02 | Responsive design | Browser resizing and Dev 1's viewport tests passed; real-device testing remains open |
| NFR-03 | Accessibility | Keyboard, focus, loading and reduced-motion improvements reported; full accessibility validation remains open |
| NFR-04 | Usability | Updated dialogue, history and patient-details interfaces are implemented |
| NFR-05 | Browser compatibility | Controlled browser checks completed; broader browser and Canvas testing remains open |
| ENH-01 | Visual design | New ward scene, photographic assets and interface improvements implemented |
| ENH-02 | NPC representation | Sandra's photographic character assets and pressure-based expressions implemented |
| ENH-05 | Interaction feedback | Waiting indicators, dialogue presentation and history access improved |

The missing educational resources and restart functionality should be considered as additional candidate enhancements in the BA roadmap.

Voice and microphone features remain optional future enhancements and have not been implemented in the latest interface.

## 6. Follow-Up Recommendations

For the remaining Sprint 3 work:

1. Recheck the known compound-question classification issue.
2. Preserve and retest core refusal, agreement, escalation and Stop functionality.
3. Consider adding approved educational links to the outcome screens.
4. Evaluate a dedicated Restart Simulation option.
5. Test mobile usability and Canvas integration where feasible.
6. Continue verifying accessibility and responsive behaviour after further UI changes.

Optional enhancements should remain secondary to correct and safe MVP functionality.

## 7. Summary

The Sprint 3 Week 2 update introduces substantial interface improvements while retaining the existing AI conversation and scenario architecture.

Dev 2's local review confirmed that the tested conversation paths, history, patient details, Stop functionality and outcome screens operated as expected.

Browser resizing also demonstrated initial responsive behaviour.

The review identified two potential improvements: adding educational resource links to the outcome screens and providing a convenient way to restart after stopping.

Dev 1's additional validation provides supporting evidence for responsive layouts, accessibility improvements, NPC visuals and regression behaviour. A previously identified compound-question classification inconsistency remains unresolved.

Overall, the updated MVP appears suitable for continued refinement and final regression testing, subject to the documented limitations and outstanding issues.

**Evidence note:** Dev 2's direct observations are recorded in Section 2. Additional implementation details and controlled test results are based on Dev 1's Sprint 3 Week 2 report. Full mobile, Canvas, accessibility and cross-browser certification is not claimed.

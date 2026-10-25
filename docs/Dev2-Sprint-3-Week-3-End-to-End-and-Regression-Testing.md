# Dev 2 End-to-End and Regression Testing — Sprint 3, Week 3

## Purpose

This document records the final Sprint 3 Dev 2 review of the Virtual Health Precinct clinical simulation following Dev 1's latest refinements.

The purpose is to confirm that the updated MVP remains functional, validate improvements made since Week 2, and identify remaining limitations relevant to the final project handover.

The document also serves as a supplementary validation record for the Week 3 BA NFR and Enhancement Roadmap, confirming subsequent implementation changes without requiring a separate revision of the roadmap.

The review combines Dev 2's local observations with supporting evidence from Dev 1's final validation report dated 25 October 2026.

## 1. Scope of Review

The review focused on:

- AI conversation and scenario branching.
- Refusal, agreement, and STOP classification.
- YES, NO, and EXIT outcomes.
- Educational feedback and learning resources.
- Restart functionality and session reset.
- Updated interface and keyboard controls.
- Responsive layout behaviour.
- Previously identified functionality issues.

The latest application was retrieved from the GitHub `main` branch and tested locally.

## 2. Dev 2 Local Testing Results

The following results reflect functionality directly observed during Dev 2's local testing.

| Test Area | Observed Result | Status |
|---|---|---|
| AI conversation | Conversations worked as expected during the tested interactions. | Passed |
| Scenario branching | Refusal and agreement paths behaved correctly in the reviewed scenarios. | Passed |
| False STOP classification | An in-scenario statement about going to the pub no longer incorrectly ended the simulation. | Passed |
| YES outcome | Correct outcome screen and educational feedback displayed. | Passed |
| NO outcome | Correct outcome screen and educational feedback displayed. | Passed |
| EXIT outcome | Stop/exit functionality worked as expected. | Passed |
| Educational resources | Three public learning-resource links were visible on the YES and NO screens. | Display verified |
| Restart simulation | Restart returned the simulation to its original state without requiring a page refresh. | Passed |
| Existing UI controls | Previously working controls continued functioning. | Passed |
| Keyboard input | Enter submitted the response; Shift+Enter inserted a newline. | Passed |
| Responsive layout | The interface adjusted when the browser window was resized. | Initial check passed |
| Dialogue consistency | No major inconsistencies observed during the local sample. | Passed in tested cases |

### 2.1 Restart and session reset

The Restart Simulation feature was independently tested by Dev 2.

After completing or ending the scenario, selecting Restart returned the application to its opening state, with the previous conversation no longer displayed and the simulation ready for another attempt.

The behaviour was consistent with refreshing the webpage, without requiring a manual reload.

This addresses the usability issue identified during Dev 2's Week 2 testing, when restarting required refreshing the browser.

Dev 1's controlled regression tests additionally reported that Restart cleared session history, pending requests, errors, and animation state without issuing an unnecessary AI request.

These internal behaviours are supported by Dev 1's testing rather than independently verified in full by Dev 2.

### 2.2 Educational outcomes

Both YES and NO outcome screens now provide more substantial educational feedback.

The YES outcome explains the consequences of agreeing to a task outside the student's authorised scope and provides an example of a respectful refusal.

The NO outcome reinforces maintaining professional boundaries, patient safety, factual documentation, and appropriate escalation or support.

Three public learning resources are displayed:

- NMBA Registered nurse standards for practice.
- Australian Commission Medication Safety Standard.
- NMBA Code of conduct for nurses.

These are implemented public resources, rather than empty placeholders. Dev 1 reported successful link-response checks.

Course-specific RMIT Canvas resources remain subject to client approval and future integration.

### 2.3 Overall interface observations

The redesigned hospital environment, NPC visuals, conversation history, patient details, and Stop functionality continued to operate as expected during the reviewed interactions.

The responsive layout adjusted when the browser window was resized.

This provides additional evidence of usability and responsive implementation, although it does not establish full compatibility with physical mobile devices or Canvas embedding.

## 3. Supporting Dev 1 Validation

Dev 1's final report dated 25 October 2026 documented 16 live AI student turns.

All 16 returned HTTP 200 with the expected classifications and scenario states in the reported sample.

The final development work included:

- Refined STOP classification to distinguish explicit simulation exits from ordinary in-scenario statements.
- Corrected interpretation of questions referring to earlier refusals in the tested cases.
- Added Restart functionality to YES, NO, and EXIT.
- Expanded educational outcome feedback.
- Added three official public learning links.
- Improved mobile layout and viewport handling.
- Preserved the existing model order, scenario transitions, and AI architecture.

### 3.1 Scenario regression

Dev 1 reported successful controlled checks for:

- Agreement and refusal outcomes.
- Repeated refusals and pushback progression.
- Neutral questions between refusals.
- Explicit STOP and local Stop.
- Restart and session state reset.
- Failure and Retry.
- History and keyboard interaction.
- Reduced-motion behaviour.
- Responsive desktop, tablet, and mobile layouts.

### 3.2 Remaining AI dialogue limitation

Despite improvements to classification and response generation, Dev 1 recorded one generated response containing unsupported workload information:

> "I have three other patients needing attention and no one else to call in."

This issue demonstrates that occasional invented details remain possible.

Dev 2 did not observe a comparable issue during the local sample, but the limited testing does not establish that the problem has been eliminated.

Further dialogue-quality monitoring is recommended.

### 3.3 Technical verification

Dev 1 reported passing:

- `npm run lint`
- `npm run build`
- `git diff --check`

The final report also records controlled tests for error handling, fallback behaviour, accessibility controls, and responsive layouts.

These technical checks are attributed to Dev 1 and are not claimed as independently repeated Dev 2 tests.

## 4. Outstanding Issues and Limitations

### AI dialogue consistency

The main conversation paths appear stable within the tested scope.

However, generated responses may occasionally include unsupported contextual details or awkward wording. Further testing is recommended before broader educational deployment.

### Educational content approval

The implemented public learning resources are relevant to the simulation's topic.

Any course-specific RMIT resources should be provided or approved by the client. The expanded educational outcome text should also receive educator review before general student use.

### Canvas and deployment

The application has been reviewed locally, but actual RMIT Canvas integration and final deployment have not been verified through this testing.

### Accessibility and device compatibility

Basic accessibility and responsive behaviour have supporting testing evidence.

However, physical mobile-device keyboards, screen-reader listening, broader cross-browser testing, and comprehensive accessibility compliance remain unverified.

### Optional voice functionality

Text-to-speech and microphone input remain unavailable.

These are optional future enhancements and do not prevent completion of the existing text-based MVP.

## 5. Final BA Roadmap Reconciliation

The Week 3 BA NFR and Enhancement Roadmap was prepared using the implementation and testing evidence available at the time of its final planned review.

Dev 1 subsequently completed further refinements, and Dev 2 reviewed the updated application.

This section documents the latest evidence and should be read alongside the existing BA roadmap.

It supplements the roadmap's earlier statuses without replacing its requirements, priorities, or decision history.

| Roadmap ID | Earlier roadmap position | Final Dev 2 / Dev 1 findings |
|---|---|---|
| MVP-01 | Core behaviour verified in tested scenarios; classification issue outstanding | Dev 1's targeted compound-question and STOP tests passed. Dev 2 observed correct branching and improved STOP behaviour in its sample. Broader dialogue reliability remains open. |
| NFR-01 | Reliability partially verified | Existing fallback, Retry, and failure-handling evidence remains applicable. |
| NFR-02 | Responsive layout verified at tested viewport sizes | Dev 1 added further mobile refinements; Dev 2 observed successful browser resizing. Physical-device testing remains open. |
| NFR-03 | Accessibility partially verified | Previous keyboard, focus, reduced-motion, and loading checks remain applicable. Broader accessibility testing remains open. |
| NFR-04 | Usability implemented with supporting tests | Existing controls remained functional; Restart was independently tested by Dev 2. |
| ENH-01 | Visual interface implemented | Photographic ward and updated interface remain present in the reviewed build. |
| ENH-02 | NPC representation implemented | Character assets and expression changes remain part of the application. |
| ENH-03 | Text-to-speech recommended for deferral | Remains unimplemented. |
| ENH-04 | Microphone input recommended for deferral | Remains unimplemented. |
| NFR-05 | Browser and Canvas compatibility partially verified | Controlled browser testing supports the current layout; actual Canvas integration remains outstanding. |
| NFR-06 | Security and privacy partially verified | No newly reported exposure issues; previous checks remain limited in scope. |
| ENH-05 | Waiting and interaction feedback implemented | Existing loading, Stop, Retry, and dialogue feedback retained. |
| ENH-06 | Educational resources proposed | **Implemented.** Three public learning links and expanded educational feedback added to YES/NO outcomes. |
| ENH-07 | Restart functionality proposed | **Implemented and locally verified by Dev 2.** Restart returns the simulation to its original state. |

### 5.1 Significant changes since the BA roadmap review

Three changes are particularly relevant to the final requirements assessment.

**1. Improved classification behaviour**

The previously identified compound-question and incorrect STOP classification issues passed Dev 1's final targeted tests. Dev 2 also observed improved STOP behaviour.

These results strengthen MVP-01 validation, although they do not guarantee correct classification of every possible student input.

**2. Educational resources implemented**

ENH-06 has progressed from a proposed enhancement to an implemented feature.

The YES and NO screens now display public nursing and medication-safety resources alongside expanded learning feedback.

**3. Restart functionality implemented and verified**

ENH-07 has progressed from a proposed enhancement to an implemented and locally verified feature.

Dev 2 confirmed that Restart returns the simulation to its opening state without requiring a page refresh.

### 5.2 Roadmap documentation status

The BA roadmap remains the final planned requirements and enhancement review for Sprint 3.

This Dev 2 document provides supplementary evidence of the final implementation and confirms changes made after that review.

The earlier roadmap does not need to be rewritten solely to reflect these results, provided that this testing report is referenced during final project handover and the updated feature statuses are clearly communicated.

## 6. Recommendations for Handover

- Preserve the final validation evidence for core scenario branching and outcomes.
- Record the remaining AI dialogue-consistency limitation.
- Obtain educator/client review of the expanded outcome guidance.
- Add approved RMIT Canvas learning resources when available.
- Verify the final deployment and Canvas integration.
- Conduct further accessibility, device, and browser testing before broader student use.
- Retain optional voice interaction features for potential future development.
- Use this document alongside the final BA roadmap when reviewing completed enhancements and outstanding requirements.

## 7. Final Summary

The Sprint 3 Week 3 review confirms substantial progress in stabilising and improving the Virtual Health Precinct MVP.

Dev 2's local testing found that the reviewed AI conversations, scenario branching, outcome screens, existing interface controls, and responsive behaviour continued functioning after the final refinements.

Previously identified usability concerns have also been addressed.

The simulation now includes expanded educational outcome feedback, public learning resources, and Restart functionality. Dev 2 independently verified that restarting returns the application to its original state.

Dev 1's final testing provides additional evidence of improved AI classification, scenario regression, error recovery, and mobile layout behaviour.

Remaining limitations mainly concern occasional AI dialogue inconsistencies, educator approval, and deployment or accessibility checks that have not yet been completed.

The current MVP is suitable for final project demonstration and handover preparation within the documented testing scope. This does not constitute certification for unrestricted student or clinical use.

**Evidence note:** Dev 2's independent observations are distinguished from Dev 1's reported results. Section 5 supplements the existing Week 3 BA roadmap and records subsequent achievements relevant to final handover.

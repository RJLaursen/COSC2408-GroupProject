# Dev 2 Core Interface and AI Integration Validation

---

## 1. Purpose

This document records the Dev 2 review and validation of the current Virtual Health Precinct implementation.

The review checks whether the available implementation supports the requirements established for the core clinical simulation interface, conversation flow and scenario branching.

The review was performed against:

* Existing BA requirements.
* `BA-AI-Conversation-Flow-and-Scenario-Branching.md`
* User Experience Definition.
* Sprint 2 development requirements.
* The current development branch provided by Dev 1.

The purpose of the review is not to replace formal clinical validation or comprehensive system testing. It is an initial Dev 2 validation of the current implementation and a record of issues or limitations that should be considered during further development.

---

# 2. Implementation Reviewed

The current branch contains a Next.js / React / TypeScript application with the following relevant components:

### Application

* `app/page.tsx`
* `app/globals.css`
* `app/layout.tsx`

### Conversation logic

* `lib/classify-response.ts`
* `lib/scenario.ts`

### Project configuration

* `package.json`
* `package-lock.json`
* `tsconfig.json`
* `eslint.config.mjs`
* `next.config.ts`
* `.gitignore`
* `README.md`

The implementation provides a browser-based prototype containing the initial scenario, free-text student responses, scenario state transitions, Sandra's dialogue, outcome screens and an exit mechanism.

---

# 3. Validation Approach

The implementation was reviewed against the expected behaviour rather than only checking whether the application starts.

The review considered:

1. Core interface functionality.
2. Student input.
3. Conversation state management.
4. Agreement/refusal classification.
5. Scenario escalation.
6. Final outcomes.
7. Exit behaviour.
8. UX constraints.
9. AI/conversation responsibilities.
10. Unexpected or ambiguous responses.
11. Accessibility considerations.
12. Limitations of the current prototype.

The application was also run locally from the development branch to confirm that the implementation could be opened and interacted with.

---

# 4. Core Interface Validation

| ID    | Requirement                 | Expected Behaviour                                     | Result | Notes                                                      |
| ----- | --------------------------- | ------------------------------------------------------ | ------ | ---------------------------------------------------------- |
| UI-01 | Simulation loads in browser | Application displays the clinical simulation interface | PASS   | Core interface loads successfully.                         |
| UI-02 | Scenario introduction       | Student receives the Ward 4 North scenario context     | PASS   | Scenario and student context are displayed.                |
| UI-03 | Sandra introduced           | Sandra is identified as the senior nurse               | PASS   | Sandra Kowalski, RN, is identified in the scenario.        |
| UI-04 | Conversation displayed      | Previous messages remain visible                       | PASS   | Conversation is stored and rendered as a message list.     |
| UI-05 | Free-text response          | Student can enter their own response                   | PASS   | Textarea is provided for free-text input.                  |
| UI-06 | Empty response prevention   | Empty response cannot be submitted                     | PASS   | Input is trimmed and submit button is disabled when empty. |
| UI-07 | Stop simulation             | Student can stop the simulation during an active state | PASS   | Stop controls are available while the scenario is active.  |
| UI-08 | Outcome displayed           | Appropriate outcome appears after scenario completion  | PASS   | YES, NO and EXIT outcomes are implemented.                 |

---

# 5. Scenario Flow Validation

The expected scenario contains one initial request followed by up to three stages of pushback.

The implementation uses the following active states:

```text
INITIAL_REQUEST
PUSHBACK_1
PUSHBACK_2
PUSHBACK_3
```

Final states are:

```text
YES_OUTCOME
NO_OUTCOME
EXIT
```

The state transitions are implemented separately in `lib/scenario.ts`.

| ID      | Scenario Test                     | Expected Result                          | Result |
| ------- | --------------------------------- | ---------------------------------------- | ------ |
| FLOW-01 | Initial request displayed         | Sandra presents the out-of-scope request | PASS   |
| FLOW-02 | Initial agreement                 | Student moves directly to YES Outcome    | PASS   |
| FLOW-03 | Initial refusal                   | Student progresses to Pushback 1         | PASS   |
| FLOW-04 | Refusal after Pushback 1          | Student progresses to Pushback 2         | PASS   |
| FLOW-05 | Refusal after Pushback 2          | Student progresses to Pushback 3         | PASS   |
| FLOW-06 | Refusal after Pushback 3          | Student reaches NO Outcome               | PASS   |
| FLOW-07 | Agreement after Pushback 1        | Student reaches YES Outcome              | PASS   |
| FLOW-08 | Agreement after Pushback 2        | Student reaches YES Outcome              | PASS   |
| FLOW-09 | Agreement after Pushback 3        | Student reaches YES Outcome              | PASS   |
| FLOW-10 | Stop during active scenario       | Student reaches EXIT state               | PASS   |
| FLOW-11 | Response after completed scenario | Scenario does not restart or continue    | PASS   |

The core state-transition logic matches the defined conversation model.

---

# 6. Response Classification Validation

The current implementation uses `classifyResponse()` in `lib/classify-response.ts`.

The classifier currently supports four classifications:

```text
AGREE
REFUSE
STOP
UNCLEAR
```

The implementation uses temporary regular-expression/phrase matching.

This is explicitly identified in the source code as a temporary local prototype and should not be treated as full natural-language AI understanding.

### Classification checks

| ID       | Input Type                     | Expected Classification | Result |
| -------- | ------------------------------ | ----------------------- | ------ |
| CLASS-01 | Clear agreement such as "yes"  | AGREE                   | PASS   |
| CLASS-02 | Clear refusal such as "no"     | REFUSE                  | PASS   |
| CLASS-03 | Scope-based refusal            | REFUSE                  | PASS   |
| CLASS-04 | Authorisation/training refusal | REFUSE                  | PASS   |
| CLASS-05 | Explicit stop request          | STOP                    | PASS   |
| CLASS-06 | Distress-related stop request  | STOP                    | PASS   |
| CLASS-07 | Uncertain response             | UNCLEAR                 | PASS   |
| CLASS-08 | Unrecognised response          | UNCLEAR                 | PASS   |
| CLASS-09 | Conflicting agreement/refusal  | UNCLEAR                 | PASS   |

The classifier also gives STOP priority over other classifications and prevents clearly conflicting responses from being interpreted as a definitive decision.

---

# 7. Agreement and Refusal Behaviour

The current implementation correctly separates response classification from scenario transitions.

For example:

```text
INITIAL_REQUEST + AGREE → YES_OUTCOME
INITIAL_REQUEST + REFUSE → PUSHBACK_1
PUSHBACK_1 + REFUSE → PUSHBACK_2
PUSHBACK_2 + REFUSE → PUSHBACK_3
PUSHBACK_3 + REFUSE → NO_OUTCOME
```

This separation is appropriate because it allows the classification method to be replaced later without rewriting the core scenario state machine.

The implementation therefore supports the defined high-level branching model.

---

# 8. Unclear Response Handling

An unclear response does not automatically advance the scenario.

Instead:

```text
Current State + UNCLEAR → Current State
```

The implementation then provides a state-specific Sandra redirect.

For example, an unclear response during `PUSHBACK_1` results in a redirect asking the student for a clearer answer.

This behaviour supports the requirement that ambiguous responses should not accidentally result in agreement, refusal or scenario completion.

### Validation result

**PASS — with limitation.**

The state behaviour is appropriate, but the current classifier is still based on predefined patterns. More varied natural-language testing will be required once a genuine AI/NLP classification layer is introduced.

---

# 9. UX Requirement Validation

The current implementation was checked against the major constraints in the User Experience Definition.

| ID    | UX Requirement               | Result         | Notes                                                                                     |
| ----- | ---------------------------- | -------------- | ----------------------------------------------------------------------------------------- |
| UX-01 | Browser-based interaction    | PASS           | Implemented as a Next.js web application.                                                 |
| UX-02 | Free-text student responses  | PASS           | Student types responses into a textarea.                                                  |
| UX-03 | No suggested refusal wording | PASS           | No suggested responses or multiple-choice options provided.                               |
| UX-04 | No scoring                   | PASS           | No marks, percentages or score system implemented.                                        |
| UX-05 | No ranking                   | PASS           | No ranking or comparative performance system implemented.                                 |
| UX-06 | No progress indicator        | PASS           | Interface does not reveal the number of remaining pushbacks.                              |
| UX-07 | Exit always available        | PASS           | Stop simulation controls are available during active states.                              |
| UX-08 | No in-character teaching     | PASS           | Sandra's active dialogue does not provide instructional explanations.                     |
| UX-09 | Outcome feedback             | PASS           | Outcome screens provide educational/reflection content.                                   |
| UX-10 | No student account/state     | PASS / Pending | No login or saved state is implemented in the reviewed prototype.                         |
| UX-11 | Mobile support               | PENDING        | Basic responsive CSS is present, but dedicated mobile testing has not yet been completed. |

---

# 10. AI and Conversation Integration Review

The current implementation should be described as a **conversation prototype**, rather than a completed AI integration.

The current flow is driven by:

1. Student free-text input.
2. Local response classification.
3. Deterministic scenario state transitions.
4. Predefined Sandra dialogue.

There is currently no demonstrated external AI service responsible for generating Sandra's responses.

This is consistent with the development approach of establishing the core scenario flow before adding more advanced AI integration.

### Current architecture

```text
Student Input
     ↓
classifyResponse()
     ↓
Response Classification
     ↓
getNextState()
     ↓
Scenario State
     ↓
Predefined Sandra Dialogue / Redirect
     ↓
Updated Conversation
```

This provides a useful foundation for later AI integration because the scenario state remains controlled by the application.

---

# 11. AI Integration Requirements for Future Testing

Once an AI service is integrated, additional testing should confirm that the AI:

* Remains within Sandra's character.
* Responds to the student's actual message.
* Maintains the intended level of social pressure.
* Does not teach the student during the active conversation.
* Does not provide suggested refusal wording.
* Does not reveal hidden scenario progression.
* Does not independently decide the final outcome.
* Does not introduce unrelated scenarios.
* Handles natural variations in refusal and agreement.
* Does not become inconsistent with the current application state.

These tests cannot be fully completed against the current deterministic prototype.

---

# 12. Outcome Validation

Three final states are currently implemented.

## YES Outcome

The student reaches `YES_OUTCOME` after agreeing to the task.

The outcome explains that the student was not authorised to independently administer the medication and encourages reflection on maintaining a professional boundary and raising the concern with an appropriate supervisor/facilitator.

**Validation:** PASS for basic implementation.

## NO Outcome

The student reaches `NO_OUTCOME` after refusing through all three pushback stages.

The outcome acknowledges that the student maintained their boundary and provides guidance to consider escalation and appropriate support.

**Validation:** PASS for basic implementation.

## EXIT Outcome

The student reaches `EXIT` when the stop simulation action is used.

The outcome does not describe the student as having failed and instead allows the student to leave the interaction.

**Validation:** PASS.

---

# 13. Accessibility Observations

The implementation includes several positive accessibility features:

* Semantic headings are used.
* The response textarea has an associated `<label>`.
* The conversation uses `role="log"`.
* `aria-live="polite"` is used for conversation updates.
* Outcome changes are placed inside a live region.
* Buttons have clear text labels.
* The textarea supports keyboard input.
* The interface uses standard HTML controls rather than custom input components.

These features should be retained during future UI development.

A more comprehensive accessibility review should occur after the interface design is developed further.

---

# 14. Findings and Limitations

### Finding 1 — Core scenario state machine is implemented

The current implementation provides the expected initial request, three pushback states and final outcomes.

**Status:** Validated.

### Finding 2 — Response classification is currently deterministic

The classifier uses predefined regular-expression patterns.

**Status:** Partially validated for prototype purposes.

This is not yet equivalent to natural-language AI understanding. Broader testing will be required when the AI integration is implemented.

### Finding 3 — Sandra dialogue is currently predefined

Sandra's responses are stored as fixed strings in `scenario.ts`.

**Status:** Prototype implementation.

This means the current implementation cannot yet demonstrate whether an AI-generated Sandra response will appropriately adapt to the student's wording.

### Finding 4 — Scenario progression is controlled by application logic

The scenario state is maintained by the application and the AI is not currently responsible for deciding outcomes.

**Status:** Validated.

This is consistent with the BA conversation-flow architecture.

### Finding 5 — Learning objective wording requires further validation

The current implementation reaches the NO Outcome after three classified refusals, regardless of whether the student's refusal explicitly references scope, competency or assessment.

The UX Definition identifies articulation of scope, competency or assessment as one indicator of the intended learning outcome.

**Status:** Further BA/UX validation recommended.

This does not necessarily mean the current state machine is incorrect, but it identifies a requirement that may need to be clarified before final acceptance criteria are locked.

### Finding 6 — Mobile behaviour requires further testing

The CSS provides a basic flexible layout, but dedicated testing on mobile browser dimensions has not been completed.

**Status:** Pending.

### Finding 7 — Clinical content requires appropriate validation

The scenario contains a specific medication and administration instruction.

The technical implementation can be reviewed for functionality, but clinical appropriateness should remain subject to nursing/client validation.

**Status:** Pending clinical/client validation.

---

# 15. Recommended Follow-Up Tests

The following tests should be performed as the implementation develops:

* Test a wider range of natural-language refusals.
* Test a wider range of natural-language agreements.
* Test mixed and ambiguous responses.
* Test responses containing both refusal and agreement language.
* Test stop requests using different wording.
* Test unexpected/off-topic responses.
* Test AI-generated Sandra responses once AI integration exists.
* Test whether Sandra maintains appropriate pressure without teaching.
* Test that the AI cannot bypass the application's scenario state.
* Test mobile browser layouts.
* Test repeated simulation runs.
* Test final outcome behaviour from every possible branch.
* Test failure and recovery behaviour if the AI service becomes unavailable.

---

# 16. Overall Validation Status

The current implementation provides a functional foundation for the core clinical simulation interaction.

The following areas have been validated:

* Core browser interface.
* Student free-text input.
* Conversation history.
* Scenario state management.
* Agreement/refusal branching.
* Three-stage refusal escalation.
* Final outcomes.
* Stop/exit behaviour.
* Unclear response handling.
* Key UX restrictions.
* Basic accessibility implementation.

The following remain incomplete or require further validation:

* Genuine AI-generated conversation.
* Broad natural-language response understanding.
* AI-specific integration testing.
* Mobile testing.
* Clinical/client validation.
* Further clarification of the learning-outcome acceptance criteria.

The current implementation is therefore suitable as a **core conversation-flow prototype**, but should not yet be considered the final AI-enabled clinical simulation.

---

# 17. Dev 2 Conclusion

The reviewed implementation is consistent with the main scenario structure and UX constraints established for Sprint 2.

The separation between response classification, scenario state transitions and dialogue provides a reasonable technical foundation for later AI integration.

The primary remaining Dev 2 responsibility is to continue validating the implementation as additional functionality is released, particularly once the deterministic prototype is replaced or extended with actual AI-generated conversation.

This review provides the current validation baseline for further development and testing.

# BA AI Conversation Flow and Scenario Branching

---

## 1. Purpose

This document defines the expected AI conversation flow, student response classifications, scenario states, branching behaviour and final outcomes for the Virtual Health Precinct clinical simulation.

The purpose is to provide a clear behavioural reference for development and testing of the AI conversation. It translates the existing BA requirements and User Experience Definition into an explicit conversation model so that the application and AI can be implemented consistently.

The simulation is intended to give second-year Bachelor of Nursing students an opportunity to practise responding to an out-of-scope clinical request from a senior nurse while experiencing realistic social pressure.

The core learning scenario is intentionally narrow:

> A senior nurse asks the student nurse to perform a clinical task that is outside the student's scope of practice. The student must decide how to respond and maintain or fail to maintain their professional boundary under increasing pressure.

The simulation does not provide suggested refusal wording, scoring, ranking or progress indicators.

---

## 2. Source Requirements

This document is based on the following project requirements and design decisions:

* Existing BA functional requirements
* Existing AI dialogue acceptance criteria
* User Experience Definition
* Defined scenario success criteria
* Defined UX exclusions and constraints

The User Experience Definition is treated as the primary reference for experience-related decisions. Where an implementation detail is not defined by these sources, it should be treated as an outstanding decision rather than assumed to be final.

---

## 3. Conversation Model

### 3.1 Core Interaction

The simulation uses a free-text conversation between:

* **Student:** The user playing the student nurse.
* **Sandra:** The senior nurse NPC.

The student receives an initial clinical request from Sandra and responds using their own words.

The AI should respond naturally to the student's message while remaining within the current scenario state.

The application, rather than the AI alone, should control the overall scenario progression and final outcome.

### 3.2 Core Decision

The scenario contains one central decision:

> Whether the student complies with the request or refuses and maintains their professional boundary.

The student may be given multiple opportunities to maintain that boundary as Sandra applies increasing social pressure.

The repeated exchanges are therefore part of the same core decision rather than separate unrelated decisions.

---

# 4. Conversation States

The expected state sequence is:

```text
START
  ↓
INITIAL REQUEST
  ↓
STUDENT RESPONSE
  ├── AGREEMENT → YES OUTCOME
  │
  └── REFUSAL → PUSHBACK 1
                    ↓
               STUDENT RESPONSE
                ├── AGREEMENT → YES OUTCOME
                │
                └── REFUSAL → PUSHBACK 2
                                  ↓
                             STUDENT RESPONSE
                              ├── AGREEMENT → YES OUTCOME
                              │
                              └── REFUSAL → PUSHBACK 3
                                                ↓
                                           STUDENT RESPONSE
                                            ├── AGREEMENT → YES OUTCOME
                                            │
                                            └── REFUSAL → NO OUTCOME
```

A stop or distress action may interrupt the normal flow at any stage.

```text
ANY ACTIVE STATE
      ↓
STOP / EXIT
      ↓
EXIT / DE-ESCALATION
```

The exact wording of AI responses is not fixed in this document. The behaviour and state transitions are the requirements that the implementation must satisfy.

---

# 5. State and Branching Table

| Current State    | Student Response     | Classification  | Expected Behaviour                                                         | Next State                                                  |
| ---------------- | -------------------- | --------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Start            | N/A                  | N/A             | Initialise scenario and prepare the clinical interaction                   | Initial Request                                             |
| Initial Request  | Agreement            | Agree           | Student accepts the requested task                                         | YES Outcome                                                 |
| Initial Request  | Refusal              | Refuse          | Sandra applies first level of social pressure                              | Pushback 1                                                  |
| Pushback 1       | Agreement            | Agree           | Student agrees after first pushback                                        | YES Outcome                                                 |
| Pushback 1       | Refusal              | Refuse          | Sandra applies second level of social pressure                             | Pushback 2                                                  |
| Pushback 2       | Agreement            | Agree           | Student agrees after second pushback                                       | YES Outcome                                                 |
| Pushback 2       | Refusal              | Refuse          | Sandra applies third level of social pressure                              | Pushback 3                                                  |
| Pushback 3       | Agreement            | Agree           | Student agrees after third pushback                                        | YES Outcome                                                 |
| Pushback 3       | Refusal              | Refuse          | Student maintains the boundary through the final pushback                  | NO Outcome                                                  |
| Any active state | Stop / distress      | Stop            | Exit normal interaction and provide an appropriate exit/de-escalation path | Exit                                                        |
| Any active state | Unexpected / unclear | Unclear / Other | AI responds naturally without incorrectly advancing the scenario           | Remain in current state unless classification becomes clear |

---

# 6. Student Response Classification

The application/AI interaction needs to distinguish between the student's broad response types.

The classifications below describe **behavioural categories**, not exact keywords.

## 6.1 Agreement

An agreement occurs when the student's response indicates that they will perform, accept or comply with the requested task.

Examples of possible agreement behaviour include:

* Explicitly agreeing to perform the task.
* Indicating that they will do what Sandra requested.
* Accepting the request despite previously refusing it.

The system should not rely exclusively on one exact phrase. Natural-language variations should be supported.

An agreement at any escalation stage results in the **YES Outcome**.

---

## 6.2 Refusal

A refusal occurs when the student's response indicates that they will not perform the requested task.

A refusal should be interpreted from the meaning of the student's response rather than requiring a specific phrase.

A strong refusal may also explain why the student cannot perform the task, for example by referring to:

* Scope of practice.
* Competency.
* Training or assessment requirements.
* Professional responsibilities.

The simulation should allow students to express the refusal in their own words.

A refusal does not immediately end the scenario. While the student continues refusing, Sandra applies the next stage of pressure.

---

## 6.3 Unclear or Unexpected Response

A student may provide a response that does not clearly indicate agreement or refusal.

Examples include:

* Asking an unrelated question.
* Providing an incomplete response.
* Changing the subject.
* Giving a response that is ambiguous about whether they will comply.
* Providing conversational text that does not clearly establish a decision.

The AI should remain within the current scenario rather than incorrectly treating an unclear response as an agreement or refusal.

The implementation should determine how ambiguous responses are handled during development and testing.

Where possible, the AI should respond naturally and allow the student to clarify their position.

---

## 6.4 Stop or Distress Response

The student must always have an available way to leave the simulation.

A stop or exit action interrupts the normal conversation flow.

The student must not be trapped in the scenario because they have reached an escalation stage.

The stop path should not be treated as a failure outcome or score.

---

# 7. Escalation Behaviour

The purpose of the escalation sequence is to reproduce the social pressure identified in the User Experience Definition.

The pressure should increase through the conversation without turning the interaction into an instructional dialogue.

## 7.1 Initial Request

Sandra introduces the clinical situation and asks the student to perform the out-of-scope task.

The student then decides how to respond.

At this point, the system must recognise whether the student has agreed or refused.

---

## 7.2 First Pushback

If the student refuses the initial request, Sandra applies the first level of pressure.

The response should:

* Remain within the clinical scenario.
* Remain in Sandra's character.
* Respond to the student's actual message.
* Maintain the social pressure.
* Avoid teaching the student what they should say.
* Avoid validating the student's refusal.

If the student refuses again, the conversation advances to Pushback 2.

If the student agrees, the scenario ends in the YES Outcome.

---

## 7.3 Second Pushback

If the student maintains their refusal after the first pushback, Sandra applies a second level of pressure.

The second pushback should continue the same scenario rather than introducing a new learning objective.

The AI should continue to respond naturally to the student's actual message while maintaining the intended scenario state.

The student can either:

* Agree → YES Outcome.
* Refuse → Pushback 3.

---

## 7.4 Third Pushback

The third pushback represents the final planned escalation.

The student has now been given repeated opportunities to maintain their professional boundary.

The student can either:

* Agree → YES Outcome.
* Refuse → NO Outcome.

No further planned pushback stage is required after the third refusal.

---

# 8. AI Character and Behaviour Rules

Sandra's role is important because the simulation is intended to reproduce social pressure rather than provide an instructional conversation.

The AI should therefore follow the following rules.

## 8.1 Remain in Character

Sandra should continue acting as the senior nurse within the scenario.

The AI should not suddenly become a teacher, narrator or assessor during the conversation.

---

## 8.2 Do Not Teach in Character

Sandra should not explain the correct answer while the scenario is occurring.

The AI should not provide educational explanations such as:

* Explaining why the task is outside the student's scope.
* Explaining the correct professional response.
* Telling the student how to refuse.
* Giving the student the wording they should use.

Educational information belongs on the appropriate outcome/resource screen rather than inside Sandra's dialogue.

---

## 8.3 Do Not Validate the Refusal During the Scenario

The AI should not tell the student that their refusal is correct or incorrect while the scenario is active.

The simulation should allow the student to experience the pressure and make the decision themselves.

---

## 8.4 Respond to the Student's Actual Message

Sandra's response should be contextually relevant to what the student actually says.

The AI should not simply repeat a fixed response regardless of the student's input.

Different natural-language refusals should be capable of receiving appropriate responses while remaining within the same scenario stage.

---

## 8.5 Maintain Scenario State

The AI should not independently change the overall scenario state.

The application should maintain the authoritative state, including:

* Current escalation stage.
* Whether the student has agreed.
* Whether the student has refused.
* Whether the scenario has ended.
* Whether the student has exited.

The AI should generate dialogue appropriate to the state supplied by the application.

---

# 9. Application Responsibilities vs AI Responsibilities

To reduce ambiguity during development, responsibilities should be divided between the application and the AI.

| Responsibility                            | Application           | AI                           |
| ----------------------------------------- | --------------------- | ---------------------------- |
| Start scenario                            | Yes                   | No                           |
| Display initial scenario                  | Yes                   | May provide dialogue content |
| Collect student free-text                 | Yes                   | No                           |
| Determine/maintain current scenario state | Yes                   | No                           |
| Track escalation stage                    | Yes                   | No                           |
| Determine final outcome                   | Yes                   | No                           |
| Identify broad response meaning           | Support/coordinate    | Interpret natural language   |
| Generate natural Sandra response          | No                    | Yes                          |
| Remain in Sandra's character              | Enforce state/context | Yes                          |
| Avoid teaching in character               | Enforce requirements  | Yes                          |
| Respond to student's actual message       | Provide context/state | Yes                          |
| Provide final educational feedback        | Yes                   | Not as Sandra                |
| Provide exit path                         | Yes                   | No                           |

The AI should therefore be treated as the conversational component, while the application remains responsible for scenario control.

This separation reduces the risk of the AI independently deciding that the student has succeeded, failed or completed the simulation.

---

# 10. Outcome Logic

## 10.1 YES Outcome

The YES Outcome is reached whenever the student agrees to perform the requested task.

This includes:

* Agreeing immediately.
* Agreeing after Pushback 1.
* Agreeing after Pushback 2.
* Agreeing after Pushback 3.

The outcome should provide appropriate educational feedback and resources after the conversation has ended.

The student should not be shamed or treated as a bad student.

The User Experience Definition specifically identifies students who complied as a group that should still find the feedback useful rather than critical.

---

## 10.2 NO Outcome

The NO Outcome is reached when the student refuses the request through all three planned pushback stages.

This indicates that the student maintained the boundary despite increasing social pressure.

The outcome should provide appropriate educational feedback, including information about what to do after the situation, such as an escalation or reporting step.

The exact educational content should remain consistent with the validated clinical requirements and client guidance.

---

## 10.3 Exit Outcome

The student can leave the simulation at any point.

An exit should not be presented as a score, failure state or punishment.

The purpose of the exit is to ensure that a student who becomes uncomfortable or distressed is not trapped in the interaction.

---

# 11. Outcome Screen Requirements

The outcome stage is separate from Sandra's in-character conversation.

Because the simulation is intended to be unsupervised and formative, the outcome experience should provide sufficient information for the student to understand what happens after the scenario.

Outcome content should support the following:

1. Explain the relevant learning point.
2. Provide appropriate validation or explanation without shaming the student.
3. Provide information about what the student can do after an out-of-scope request.
4. Identify an appropriate escalation/reporting step.
5. Provide relevant learning resources where applicable.
6. Allow the student to leave or finish the simulation.

The outcome screen should not introduce a score, ranking or progress measurement.

---

# 12. UX Constraints Applied to Conversation Logic

The following UX decisions must be preserved during implementation.

## No Scoring or Ranking

The conversation must not assign points, grades or rankings.

The system should not describe the student's performance using a score.

## No Progress Indicator

The interface should not show how many refusals remain or how close the student is to the final outcome.

For example, the interface should not display:

```text
Pushback 2 of 3
```

or any equivalent progress indicator.

The escalation should be experienced through the conversation rather than through a visible progress meter.

## No Suggested Refusal Wording

The interface and AI must not provide selectable refusal phrases or tell the student what words to use.

The student must formulate their response in their own words.

## Exit Always Available

The student must have an accessible way to leave the simulation.

The escalation must never prevent the student from exiting.

## No Shaming

The outcome and feedback should remain formative.

A student who agrees should receive useful feedback rather than judgement or humiliation.

---

# 13. Unexpected and Off-Topic Conversation

Because the interaction uses free-text input, students may provide unexpected responses.

The system should avoid treating every unexpected message as an automatic agreement or refusal.

Potential unexpected inputs include:

* Off-topic questions.
* General conversation.
* Requests for help.
* Questions about the simulation.
* Ambiguous responses.
* Responses that contain both agreement and refusal language.
* Attempts to intentionally break the scenario.

The AI should remain within the current scenario where possible.

It should not:

* Reveal hidden scenario logic.
* Reveal the number of remaining pushbacks.
* Break character unnecessarily.
* Provide the correct answer.
* Create a new scenario outside the defined requirements.

If an input cannot be reliably classified, the implementation should preserve the current state until the student's position becomes sufficiently clear.

---

# 14. Stop and Distress Handling

The student may decide to leave the simulation at any point.

The stop mechanism should take priority over normal scenario escalation.

The expected behaviour is:

```text
Student selects exit/stop
        ↓
Current conversation stops
        ↓
Student is taken to an appropriate exit/de-escalation state
```

The stop action should not trigger:

* Additional pressure from Sandra.
* A score.
* A failure message.
* A requirement to continue.
* A hidden penalty.

This requirement supports the UX principle that leaving is always available.

---

# 15. Conversation State Validation Criteria

The following criteria can be used during development and later Dev 2 testing.

### AI-Flow-01 — Initial Scenario

The simulation starts with the intended clinical situation and Sandra's initial request.

### AI-Flow-02 — Free-Text Response

The student can respond using their own words rather than selecting from predefined answers.

### AI-Flow-03 — Agreement Classification

A clear agreement advances directly to the YES Outcome.

### AI-Flow-04 — Initial Refusal

A clear refusal advances to Pushback 1.

### AI-Flow-05 — Escalation

A refusal after Pushback 1 advances to Pushback 2.

### AI-Flow-06 — Final Escalation

A refusal after Pushback 2 advances to Pushback 3.

### AI-Flow-07 — Successful Boundary

A refusal after Pushback 3 reaches the NO Outcome.

### AI-Flow-08 — Agreement After Refusal

An agreement at any escalation stage reaches the YES Outcome.

### AI-Flow-09 — Character Consistency

Sandra remains in character and responds as the senior nurse.

### AI-Flow-10 — No In-Character Teaching

Sandra does not explain the correct answer or provide refusal wording during the active scenario.

### AI-Flow-11 — Contextual Response

Sandra's response reflects the student's actual message rather than always returning an unrelated fixed response.

### AI-Flow-12 — No Progress Disclosure

The interface does not reveal the number of remaining escalation stages.

### AI-Flow-13 — Exit

The student can exit at any active stage.

### AI-Flow-14 — No Scoring

The simulation does not assign a score, ranking or grade.

### AI-Flow-15 — Own Words

The student is able to formulate their own response without being given selectable or suggested refusal wording.

### AI-Flow-16 — Outcome Feedback

The final outcome provides appropriate formative information and next steps.

### AI-Flow-17 — Unexpected Input

Unexpected or ambiguous input does not incorrectly advance the scenario.

### AI-Flow-18 — Application State Control

The application maintains the authoritative conversation state and final outcome rather than relying on the AI to independently determine progression.

---

# 16. Implementation Notes for Development

The following points should be considered when the conversation is implemented.

### State Management

The application should maintain a clear state value representing the current stage of the scenario.

A conceptual state model could use:

```text
START
INITIAL_REQUEST
PUSHBACK_1
PUSHBACK_2
PUSHBACK_3
YES_OUTCOME
NO_OUTCOME
EXIT
```

The exact implementation is a development decision and is not prescribed by this BA document.

### Response Classification

The implementation should support natural-language responses rather than relying only on exact keyword matching.

The classification process should distinguish at minimum:

```text
AGREE
REFUSE
UNCLEAR / OTHER
STOP
```

### State Transition Control

The application should determine whether a transition is allowed.

For example:

```text
INITIAL_REQUEST + REFUSE → PUSHBACK_1
PUSHBACK_1 + REFUSE → PUSHBACK_2
PUSHBACK_2 + REFUSE → PUSHBACK_3
PUSHBACK_3 + REFUSE → NO_OUTCOME
```

The AI should receive enough state/context information to generate an appropriate response without being responsible for determining the overall simulation outcome.

---

# 17. Outstanding Decisions and Validation

The conversation model is defined sufficiently for development planning, but some areas remain subject to validation.

These should not be silently assumed to be final.

## Client Validation

The project still requires confirmation of what nursing students find most difficult about refusing a senior nurse.

This information may affect the realism and wording of Sandra's pressure without changing the core state model.

## Success Criteria Sign-Off

The defined success criteria should be confirmed with the client/stakeholders before being treated as fully validated.

## Student Input

Direct student input may be useful for validating whether the scenario and pressure feel realistic to the target user group.

Any collection of direct student input must follow the relevant RMIT requirements.

## Clinical Content

The exact clinical task, dialogue wording, escalation wording and educational resources should be validated against the appropriate nursing/client requirements.

This BA document defines the conversation structure and expected behaviour; it does not replace clinical validation.

---

# 18. BA Validation Outcome

The AI conversation has been translated from the existing requirements and UX Definition into an explicit state and branching model.

The defined model establishes:

* The initial scenario interaction.
* Agreement and refusal classifications.
* Three stages of refusal escalation.
* Agreement handling at every stage.
* The final refusal outcome.
* Stop/exit behaviour.
* Unexpected-input handling.
* AI character boundaries.
* Application versus AI responsibilities.
* Outcome behaviour.
* Testable acceptance criteria.

This provides a structured reference for development and subsequent Dev 2 validation.

The conversation flow can now be used to:

1. Guide implementation of the AI interaction.
2. Identify implementation ambiguities before testing.
3. Create integration and scenario test cases.
4. Validate the implemented behaviour against the BA requirements and UX Definition.

**Current status:** Defined for development, with client/clinical validation items remaining open.

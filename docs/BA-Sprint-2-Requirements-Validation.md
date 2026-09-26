# BA Sprint 2 Requirements and UX Validation Review

## 1. Review Purpose

This review compares the existing BA Requirements document against the completed User Experience Definition to confirm that the requirements remain suitable for Sprint 2 development and testing.

The review focuses on:

* Functional requirements
* AI dialogue behaviour
* Acceptance criteria
* Scenario branching and escalation
* Educational outcomes
* UX constraints that affect implementation
* Requirements that require further clarification

The purpose is to identify areas where the requirements should be made clearer or more testable before the core simulation interaction is developed.

## 2. Documents Reviewed

### BA Requirements Document

The existing requirements document defines the clinical scenario, functional and non-functional requirements, AI character rules, scenario state, user journey, acceptance criteria and development priorities.

The current requirements already establish natural-language interaction, agreement/refusal detection, three-stage escalation, YES/NO outcomes and stop/distress handling.

### User Experience Definition

The UX Definition establishes the intended users, context of use, experience principles, exclusions and success criteria. It identifies the simulation as an unsupervised, browser-based, formative and repeatable experience and establishes constraints including no scoring, no progress indicator, no supplied refusal phrasing and an always-available exit.

## 3. Requirements and UX Alignment

| Area                         | Current Requirement                                  | UX Alignment                                                           | BA Review                                                                            |
| ---------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Target user                  | Second-year Bachelor of Nursing student              | Matches defined primary user                                           | Aligned                                                                              |
| Browser access               | Browser-based with no installation                   | Matches browser-based Canvas access                                    | Aligned                                                                              |
| Natural-language interaction | Typed responses required                             | Matches free-text interaction                                          | Aligned                                                                              |
| AI character                 | Sandra remains in character and does not teach       | Matches "do not teach in character" principle                          | Aligned                                                                              |
| Scenario pressure            | Three stages of increasing pressure                  | Matches the requirement for realistic social pressure                  | Aligned                                                                              |
| Scoring                      | Not explicitly developed as a functional feature     | UX explicitly prohibits scoring/ranking                                | Add as an explicit constraint                                                        |
| Progress indicator           | Not defined as a functional requirement              | UX explicitly prohibits progress indicators                            | Add as an explicit constraint                                                        |
| Suggested refusal wording    | Existing BA document provides an example refusal     | UX states that the student’s words should be their own                 | Clarify that the example is documentation only and must not be presented to students |
| Stop/exit                    | Existing requirement provides stop/distress handling | UX requires leaving to remain available without consequence or verdict | Refine acceptance criteria                                                           |
| Outcome feedback             | YES/NO outcomes provide educational feedback         | UX requires teaching, validation and resolution on outcome screens     | Aligned; refine outcome requirements                                                 |
| Scenario state               | Application controls the scenario state              | UX requires a repeatable, controlled experience                        | Aligned                                                                              |
| Student data                 | No permanent assessment data                         | UX states no student data is stored                                    | Aligned                                                                              |

## 4. Functional Requirement Refinements

### 4.1 Student Interaction

The existing FR-02 requires typed natural-language interaction and identifies voice as a preferred feature.

**Refinement:**

Typed free-text interaction should remain the minimum required interaction for Sprint 2. Voice should remain optional and should not become a dependency for the core scenario.

This preserves the existing development priority while ensuring that the simulation can be completed without voice functionality.

### 4.2 AI Dialogue

The existing FR-03 and FR-04 establish dynamic dialogue and Sandra's character behaviour.

The UX Definition adds an important constraint: Sandra must not teach, validate the student's refusal or break the pressure of the scenario.

**Refinement:**

AI acceptance criteria should verify that Sandra:

* Responds to the student's actual message.
* Remains within the current scenario stage.
* Maintains the defined character.
* Does not provide teaching during the scenario.
* Does not directly validate a student's refusal.
* Does not provide suggested wording for the student.
* Does not break character or reveal that the interaction is a simulation.

### 4.3 Agreement and Refusal Detection

The existing requirements correctly establish that the system must recognise different natural-language forms of agreement and refusal.

The UX success criteria additionally identify the importance of the student's own words.

**Refinement:**

Acceptance testing should include multiple natural-language responses rather than relying on exact phrases. Refusal responses should also be assessed for whether they communicate a relevant professional boundary, while avoiding the requirement for one specific sentence.

### 4.4 Scenario Escalation

The existing requirements establish three escalation stages and allow the student to respond after each stage.

**Refinement:**

The application should remain responsible for controlling the scenario state. AI-generated dialogue should not independently decide when the scenario has reached its final outcome.

The expected state sequence remains:

```text
START
  ↓
INITIAL REQUEST
  ↓
STUDENT RESPONSE
  ├── AGREEMENT → YES OUTCOME
  │
  └── REFUSAL
       ↓
    PUSHBACK 1
       ↓
    STUDENT RESPONSE
       ├── AGREEMENT → YES OUTCOME
       │
       └── REFUSAL
            ↓
         PUSHBACK 2
            ↓
         STUDENT RESPONSE
            ├── AGREEMENT → YES OUTCOME
            │
            └── REFUSAL
                 ↓
              PUSHBACK 3
                 ↓
              STUDENT RESPONSE
                 ├── AGREEMENT → YES OUTCOME
                 └── REFUSAL → NO OUTCOME
```

This remains consistent with the existing BA scenario logic.

## 5. Acceptance Criteria Refinements

The existing acceptance criteria provide a useful foundation but should be expanded to cover the UX constraints that are now explicitly defined.

### AC-01 — Initial Scenario

**Given** the student enters the simulation
**When** the scenario begins
**Then** Sandra should present the clinical request and begin the scenario without providing teaching or reassurance.

### AC-02 — Natural-Language Input

**Given** Sandra has asked the student to perform the task
**When** the student enters a free-text response
**Then** the system should process the response and provide an appropriate Sandra response consistent with her character and the current scenario stage.

### AC-03 — Agreement

**Given** the student agrees to perform the task
**When** the agreement is recognised
**Then** the simulation should progress to the YES outcome.

### AC-04 — First Refusal

**Given** the student refuses the request
**When** the refusal is recognised
**Then** Sandra should provide the first pushback without teaching or validating the refusal.

### AC-05 — Second Refusal

**Given** the student continues to refuse
**When** the second refusal is recognised
**Then** Sandra should provide the second pushback while maintaining the established character and scenario pressure.

### AC-06 — Third Refusal

**Given** the student continues to refuse
**When** the third refusal is recognised
**Then** Sandra should provide the final threatening response without directly teaching the student.

### AC-07 — Final Refusal

**Given** the student refuses after the third escalation
**When** the refusal is recognised
**Then** the simulation should display the NO outcome and provide the appropriate educational feedback.

### AC-08 — Agreement After Refusal

**Given** the student has previously refused
**When** the student later agrees to perform the task
**Then** the simulation should display the YES outcome.

### AC-09 — Character Consistency

**Given** the student interacts with Sandra
**When** the student provides expected, unexpected or varied wording
**Then** Sandra should remain consistent with her defined character and the current scenario stage.

### AC-10 — Off-Topic Questions

**Given** the student asks an unrelated question
**When** Sandra responds
**Then** Sandra should remain in character and redirect the conversation toward the current scenario without providing unrelated teaching.

### AC-11 — Stop / Exit

**Given** the student requests to stop or indicates that they do not wish to continue
**When** the stop request is recognised
**Then** the escalation should stop and the student should be able to leave the scenario without a score, verdict or negative consequence.

### AC-12 — Learning Resources

**Given** the scenario has reached an outcome
**When** the outcome screen is displayed
**Then** relevant educational feedback and learning resources should be available.

### AC-13 — No Scoring or Ranking

**Given** the student is completing the simulation
**When** they interact with the scenario
**Then** the system must not display a score, percentage, ranking, pass/fail result or progress indicator.

### AC-14 — Student's Own Words

**Given** the student is responding to Sandra
**When** the student enters a response
**Then** the interface must allow the student to formulate their own response without supplied refusal phrases or multiple-choice responses.

## 6. Scenario Logic Validation

The existing scenario logic remains suitable for implementation, with the following principles carried forward:

1. The application controls the scenario state.
2. The AI determines Sandra's conversational response within the permitted state.
3. Agreement can occur at any stage and leads to the YES outcome.
4. Refusal progresses through the defined escalation stages.
5. Continued refusal after the final escalation leads to the NO outcome.
6. A student who initially refuses but later agrees receives the YES outcome.
7. A stop/distress request interrupts the normal escalation sequence.
8. Outcome screens provide the educational explanation rather than Sandra teaching during the scenario.

The existing three-stage escalation should remain distinct from the student's final decision. This allows the scenario to create pressure while keeping the outcome logic controlled and testable.

## 7. UX Constraints to Carry into Development

The following constraints from the UX Definition should be treated as implementation requirements during Sprint 2:

* No scoring or ranking.
* No progress indicator.
* No visual escalation indicator that reveals how many refusals remain.
* No suggested refusal wording.
* No multiple-choice refusal options.
* Sandra must not teach during the scenario.
* Sandra must not directly validate a refusal during the scenario.
* The student must always have access to an exit.
* Leaving the scenario must not produce a negative verdict.
* Educational content should be delivered through the outcome experience.
* The experience should remain formative rather than functioning as an assessment.

These constraints should be considered when reviewing both the interface and AI implementation.

## 8. Outstanding Validation Items

The UX Definition identifies several areas that remain open and should not be treated as fully validated requirements:

* Client confirmation of what students currently find most difficult about refusing a senior.
* Client sign-off on the UX success criteria.
* Review of comparable clinical simulations.
* Direct student input, subject to any required RMIT ethics approval.

These items should remain visible to the team and should be incorporated into later requirement or UX updates when information becomes available.

## 9. BA Validation Outcome

The existing BA requirements provide a suitable foundation for Sprint 2 development. The review identified several areas where the requirements and acceptance criteria should be made more explicit to reflect the completed UX Definition.

The main refinements concern:

* Explicitly excluding scoring and progress indicators.
* Protecting free-text responses and preventing supplied refusal wording.
* Ensuring Sandra does not teach or validate the student during the scenario.
* Strengthening stop/exit behaviour.
* Making the AI and application responsibilities clearer.
* Expanding acceptance criteria to cover the newly defined UX constraints.
* Maintaining controlled scenario state while allowing natural-language conversation.

The refined requirements are suitable to guide the next development stage, subject to the outstanding client and student validation items identified above.

**BA Validation Status: Requirements refined for Sprint 2 development and testing**

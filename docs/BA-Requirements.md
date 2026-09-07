# BA Requirements Document

---
(Note: File has been updated from docx to md format)

## 1. Document Purpose

This document defines the business, functional and non-functional requirements for the AI-driven clinical simulation.

It is intended to provide a shared reference for the Project Manager, Business Analyst, UX Designer and Developers throughout the project.

The document will be updated as the project progresses and new information, technical limitations or stakeholder feedback becomes available.

---

# 2. Project Overview

The project requires two computing student groups to collaboratively develop an AI-driven clinical simulation for undergraduate nursing students at RMIT University.

The simulation places a nursing student in a realistic hospital ward scenario where they are asked by a senior nurse to perform a clinical task outside their scope of practice.

The primary learning objective is for nursing students to practise respectfully declining an inappropriate request and understand the professional, legal and ethical consequences of both complying with and refusing the request.

Artificial intelligence will be used to create a dynamic conversation with the Nurse in Charge rather than relying entirely on predetermined dialogue options.

The project will initially prioritise a functional AI conversation experience. Visual and presentation elements will be developed and refined alongside the core functionality where project time permits.

---

# 3. Project Goals

The simulation should:

* Provide nursing students with an engaging way to practise handling an ethical and professional situation.
* Allow students to interact naturally with an AI-driven Nurse in Charge.
* Present realistic pressure and consequences associated with refusing an inappropriate clinical request.
* Reinforce the importance of practising within scope of practice.
* Provide educational feedback after the scenario.
* Provide links to relevant learning resources.
* Be accessible through a standard web browser.
* Provide a functional prototype within the 11-week project timeline.

---

# 4. Target User

## Primary User

The primary user is an undergraduate nursing student.

The scenario is specifically designed around a second-year Bachelor of Nursing student completing their second medical rotation at RMIT.

The student has completed learning related to medication administration but has not completed the required clinical assessment for IV medication administration.

The student is therefore not authorised to independently perform the requested task within the scenario.

---

# 5. Stakeholders

| Stakeholder                  | Interest / Responsibility                                    |
| ---------------------------- | ------------------------------------------------------------ |
| RMIT Nursing Students        | Primary users of the simulation                              |
| Nursing teaching staff       | Stakeholders in the educational outcome                      |
| Project Stakeholder / Client | Provides project direction and feedback                      |
| Project Manager              | Coordinates project schedule, tasks and team communication   |
| Business Analyst             | Defines requirements, scenario logic and acceptance criteria |
| UX Designer                  | Designs the user experience and visual presentation          |
| Developers                   | Implement the simulation and selected technologies           |

---

# 6. Clinical Scenario

## 6.1 Setting

**Location:** Ward 4 North, general medical ward
**Time:** 14:00 on a Tuesday afternoon
**Environment:** Busy metropolitan public hospital

The ward is short-staffed due to two unexpected sick leave callouts.

The patient involved in the scenario is:

**Mr Arthur Chen, 71**

* Admitted with community-acquired pneumonia and type 2 diabetes.
* Resting in bed.
* Receiving oxygen therapy.
* Has an IV cannula in place.

---

## 6.2 Student Nurse

The student is:

* A second-year Bachelor of Nursing student at RMIT.
* Completing their second medical rotation.
* Recently taught medication administration.
* Not yet clinically assessed for IV medication administration.
* Not authorised to independently perform the requested IV medication task in the scenario.

---

## 6.3 Nurse in Charge

**Sandra Kowalski, RN, 48**

Sandra is the Nurse in Charge of the afternoon shift.

Character traits:

* Experienced and competent.
* Under significant pressure due to staff shortages.
* Not intentionally malicious.
* Believes asking the student for assistance is reasonable.
* Is accustomed to being obeyed.
* Becomes increasingly irritated when challenged.
* Eventually uses pressure and threats relating to the student's placement.

Sandra should remain believable as a busy and stressed nurse rather than behaving as an exaggerated villain.

---

# 7. Clinical Task

Sandra asks the student to administer:

**Amoxicillin-clavulanate (Augmentin) 1.2 g in 100 mL normal saline via the patient's existing peripheral IV cannula over 30 minutes.**

For the purposes of this simulation, the task is treated as outside the student's authorised scope of practice.

The scenario is intended to demonstrate the risks associated with performing a clinical task without the required authorisation, competency or supervision.

---

# 8. Functional Requirements

## FR-01 — Browser Access

The simulation must be accessible through a standard web browser.

No software installation should be required for students.

---

## FR-02 — Student Interaction

The student must be able to interact with the Nurse in Charge.

Typed text input is the minimum required interaction method.

Voice interaction is preferred if it can be implemented reliably within the project timeline.

---

## FR-03 — Dynamic AI Dialogue

The Nurse in Charge must respond dynamically to the student's input.

The system should not rely solely on a fixed list of response buttons.

The AI should generate responses appropriate to:

* The student's message.
* The current scenario stage.
* Sandra's character.
* The scenario rules.

---

## FR-04 — Sandra Character Behaviour

The AI must maintain Sandra's established character throughout the scenario.

Sandra should:

* Remain in character.
* Respond naturally to the student's statements.
* Remain focused on the clinical situation.
* Become increasingly frustrated when the student refuses.
* Avoid validating the student's refusal during the scenario.

---

## FR-05 — Agreement Detection

The system must identify when the student agrees to perform the requested task.

Agreement may be expressed using different natural-language responses.

Examples include:

* "Yes."
* "Okay."
* "Sure, I'll do it."
* "No problem."
* "I'll administer it."

The exact wording should not need to match a predetermined phrase.

---

## FR-06 — Refusal Detection

The system must identify when the student refuses the request.

Examples include:

* "I'm not allowed to do that."
* "That's outside my scope."
* "I'm not comfortable doing that."
* "I think an RN needs to administer it."
* "Can you get another nurse to do it?"

The system should support different natural-language forms of refusal.

---

## FR-07 — Refusal Escalation

If the student refuses, Sandra must progress through three levels of escalation.

### Stage 1 — Dismissive

Sandra minimises the task and reassures the student that it is simple.

### Stage 2 — Frustrated

Sandra becomes more impatient and emphasises the staffing shortage.

### Stage 3 — Threatening

Sandra threatens to negatively influence the student's clinical placement if they continue to refuse.

The system must allow the student to respond after each stage.

---

## FR-08 — Scenario Branching

The scenario must branch according to the student's decisions.

### Agreement

If the student agrees at any point:

**Agreement → YES Outcome**

### Refusal

If the student continues to refuse through all three escalation stages:

**Refusal → NO Outcome**

If the student initially refuses but later agrees:

**Agreement → YES Outcome**

---

## FR-09 — YES Outcome

The YES outcome should explain why agreeing to perform the task was inappropriate.

The outcome should cover:

* Scope of practice.
* Lack of required competency/authorisation.
* Potential patient safety risks.
* Professional consequences.
* Risks to the student's placement and future registration.
* The inappropriate nature of the request.

The outcome should also provide an example of an appropriate respectful refusal.

---

## FR-10 — NO Outcome

The NO outcome should provide positive reinforcement for maintaining the professional boundary.

The outcome should explain:

* Why refusing was appropriate.
* The importance of practising within scope.
* Appropriate responses to pressure from senior staff.
* Appropriate escalation/reporting procedures.

---

## FR-11 — Learning Resources

Relevant educational resources should be accessible after the scenario.

Resources may include:

* NMBA Registered Nurse Standards for Practice.
* NMBA Code of Conduct for Nurses.
* RMIT nursing placement resources.
* Medication safety resources.
* Relevant RMIT learning materials.
* Guidance for raising placement concerns.

---

## FR-12 — Exceptional / Stop Interaction

If the student:

* Requests to stop.
* Becomes distressed.
* Becomes confused about continuing.

The normal escalation sequence should stop.

The student should be provided with an appropriate exit or transition.

The exact visual and interaction design of this behaviour will be determined by UX and Development.

---

## FR-13 — Scenario State

The application should keep track of the student's current position within the scenario.

A conceptual state sequence is:

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
                    │
                    └── REFUSAL → NO OUTCOME
```

The application should control the scenario state rather than relying entirely on the AI to determine when the scenario ends.

---

# 9. AI Character Rules

The AI Nurse in Charge should follow these behavioural constraints.

### Character

* Always remain in character as Sandra Kowalski.
* Do not acknowledge that the interaction is a simulation.
* Do not break the fourth wall.
* Do not become a teaching assistant.

### Clinical Information

Sandra should not provide clinical advice, definitions or educational explanations during the conversation.

If asked what scope of practice means, Sandra should respond:

> "I don't have time to explain fundamentals right now. Are you going to help me or not?"

### Request to Speak to Someone Else

If the student asks to speak to someone else, Sandra should respond:

> "I am the nurse in charge. There is no one else to speak to. This is my ward."

### Clinical Justifications

If the student uses clinical terminology or policies to justify refusing, Sandra should dismiss the explanation rather than validate it.

Example:

> "That's all well and good in a classroom. This is a real ward and I need help."

### Distress / Stop

If the student asks to stop or becomes distressed, normal escalation should cease and the appropriate exit/outcome behaviour should occur.

---

# 10. Non-Functional Requirements

These requirements describe qualities the final experience should have rather than specific functions.

## NFR-01 — Accessibility

The simulation should be usable through a standard web browser.

---

## NFR-02 — Responsive Design

The experience should support both:

* Desktop devices.
* Mobile devices.

---

## NFR-03 — Usability

The interaction should be easy for a nursing student to understand without requiring technical knowledge.

The student should clearly understand:

* What is happening.
* What they are expected to do.
* How to respond.
* When the scenario has ended.

---

## NFR-04 — Performance

The simulation should provide responses within a reasonable time so that conversation feels natural.

---

## NFR-05 — Reliability

The core scenario should consistently follow the intended branching rules.

The AI should not unexpectedly skip required stages or produce responses that break the scenario.

---

## NFR-06 — Security

AI service credentials and other sensitive configuration should not be exposed to the student through the browser.

---

## NFR-07 — Privacy

The system must not collect or permanently store student assessment data.

The simulation is intended as self-directed formative practice.

---

## NFR-08 — Cost

Development should use free tiers or free trials where practical.

Any paid services required for larger-scale deployment should be documented, including potential upgrade paths and limitations.

---

## NFR-09 — Canvas Compatibility

The completed experience should be accessible through Canvas using an external URL or another compatible method.

Full Canvas integration is not required for the computing students, but theoretical compatibility should be demonstrated where possible.

---

# 11. Selected Technology Direction

The team has selected **Next.js + React** as the foundation for the simulation.

The initial development priority is the functional AI conversation rather than advanced visual presentation.

### Reasons for selection

* Suitable for browser-based applications.
* Supports interactive interfaces.
* Suitable for desktop and mobile experiences.
* Allows the team to develop the conversation experience without requiring a dedicated game engine.
* Allows visual complexity to be increased progressively.
* Familiarity with web development can support faster prototyping.

The team will investigate and select a suitable AI model/service to work with the application.

---

# 12. Proposed AI Architecture

The AI should be integrated in a way that separates the conversation from the application's scenario logic.

Conceptually:

```text
Student
   ↓
React / Next.js Interface
   ↓
Scenario Logic
   ↓
AI Conversation
   ↓
Sandra's Response
   ↓
React / Next.js Interface
```

The AI should primarily determine:

> **What would Sandra say?**

The application should determine:

> **What stage of the scenario are we currently in?**

This separation should improve reliability and make the scenario easier to test.

---

# 13. High-Level User Journey

This section describes the functional journey from a BA perspective. Detailed visual design and interaction design will be developed by UX and Development.

## 13.1 Simulation Entry

1. Student accesses the simulation through a web browser.
2. The simulation loads the clinical environment.
3. The student is introduced to the scenario.
4. Sandra approaches and begins the interaction.

## 13.2 Clinical Request

5. Sandra explains the staffing situation.
6. Sandra asks the student to administer Mr Chen's IV Augmentin.
7. The student provides a natural-language response.

## 13.3 Student Decision

If the student agrees:

1. Sandra acknowledges the agreement.
2. The YES outcome is displayed.
3. Educational feedback is provided.
4. Relevant learning resources are provided.

If the student refuses:

1. Sandra provides the first pushback.
2. The student responds again.

## 13.4 Escalation

If the student continues refusing:

1. Sandra provides the second pushback.
2. The student responds again.
3. Sandra provides the third and final pushback.
4. The student responds again.

If the student agrees at any point, the YES outcome is displayed.

If the student continues refusing, the NO outcome is displayed.

## 13.5 Final Outcome

The student receives educational feedback based on their final decision.

The appropriate learning resources are then made available.

---

# 14. Example Respectful Refusal

The simulation should reinforce that an appropriate response can be respectful while still maintaining a professional boundary.

Example:

> "I'm really sorry, Sandra, I want to help, but IV medication administration is outside my scope as a student. I'm not assessed for that yet. Can I help in another way?"

The exact wording is not required. The purpose is to demonstrate the desired behaviour.

---

# 15. Acceptance Criteria

## AC-01 — Initial Scenario

**Given** the student enters the simulation
**When** the scenario begins
**Then** Sandra should present the clinical request.

---

## AC-02 — Natural-Language Input

**Given** Sandra has asked the student to perform the task
**When** the student enters a response
**Then** the system should process the response and provide an appropriate Sandra response.

---

## AC-03 — Agreement

**Given** the student agrees to perform the task
**When** the agreement is recognised
**Then** the simulation should progress to the YES outcome.

---

## AC-04 — First Refusal

**Given** the student refuses the request
**When** the refusal is recognised
**Then** Sandra should provide the first pushback.

---

## AC-05 — Second Refusal

**Given** the student continues to refuse
**When** the second refusal is recognised
**Then** Sandra should provide the second pushback.

---

## AC-06 — Third Refusal

**Given** the student continues to refuse
**When** the third refusal is recognised
**Then** Sandra should provide the threatening response.

---

## AC-07 — Final Refusal

**Given** the student refuses after the third escalation
**When** the refusal is recognised
**Then** the simulation should display the NO outcome.

---

## AC-08 — Agreement After Refusal

**Given** the student has previously refused
**When** the student later agrees to perform the task
**Then** the simulation should display the YES outcome.

---

## AC-09 — Character Consistency

**Given** the student interacts with Sandra
**When** the student asks questions or provides unexpected wording
**Then** Sandra should respond consistently with her defined character and scenario.

---

## AC-10 — Off-Topic Questions

**Given** the student asks an unrelated question
**When** Sandra responds
**Then** Sandra should remain in character and redirect the student toward the scenario.

---

## AC-11 — Stop / Distress

**Given** the student requests to stop or becomes distressed
**When** this is recognised
**Then** the escalation should stop and an appropriate exit or transition should occur.

---

## AC-12 — Learning Resources

**Given** the scenario has reached an outcome
**When** the outcome screen is displayed
**Then** relevant learning resources should be available.

---

# 16. Risks and Considerations

| Risk                                          | Potential Impact                             | Mitigation                                                                         |
| --------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| AI produces inappropriate/off-topic responses | Breaks realism and learning objective        | Strong character instructions and controlled scenario state                        |
| AI incorrectly identifies agreement/refusal   | Incorrect scenario outcome                   | Test multiple natural-language examples and retain application-level state control |
| AI response latency                           | Conversation feels unnatural                 | Evaluate model performance and optimise requests                                   |
| AI service costs                              | Development/deployment costs increase        | Use free tier/trial where possible and monitor usage                               |
| Voice interaction proves difficult            | Preferred feature may not be achievable      | Treat text interaction as minimum requirement                                      |
| Visual development takes too long             | Core functionality may be delayed            | Prioritise functional conversation first                                           |
| Canvas compatibility issues                   | Delivery requirements may not be met         | Test external URL/iFrame compatibility before final delivery                       |
| Technical limitations of selected tools       | Required functionality may not be achievable | Conduct early feasibility testing                                                  |
| Scenario becomes too rigid                    | Student experience feels scripted            | Allow natural-language input while maintaining controlled scenario states          |

---

# 17. Current Status

## Completed / Established

* [x] Updated project brief analysed.
* [x] Project goals identified.
* [x] Target user identified.
* [x] Clinical scenario documented.
* [x] Sandra character requirements documented.
* [x] Functional requirements identified.
* [x] Non-functional requirements identified.
* [x] High-level user journey documented.
* [x] YES/NO scenario branches documented.
* [x] AI character rules documented.
* [x] Initial acceptance criteria documented.
* [x] Initial project risks identified.
* [x] Next.js + React selected as the application foundation.
* [x] BA requirements document established in the project repository.

## In Progress

* [ ] Select and validate the AI model/service.
* [ ] Build AI conversation feasibility prototype.
* [ ] Test natural-language agreement/refusal detection.
* [ ] Confirm technical approach for scenario state management.
* [ ] Evaluate voice interaction feasibility.
* [ ] Begin detailed UX planning.
* [ ] Refine requirements based on Development and UX findings.
* [ ] Confirm Canvas compatibility.
* [ ] Confirm final hosting/deployment approach.

---

# 18. Planned Development Priorities

The project will prioritise functionality in the following order:

### Priority 1 — Core Conversation

* Student can enter the simulation.
* Sandra can initiate the scenario.
* Student can type responses.
* AI can generate Sandra's responses.

### Priority 2 — Scenario Logic

* Agreement detection.
* Refusal detection.
* Three-stage escalation.
* YES outcome.
* NO outcome.
* Stop/distress handling.

### Priority 3 — Educational Content

* Outcome feedback.
* Learning resources.
* Relevant RMIT materials.

### Priority 4 — User Experience

* Improved interface.
* Hospital environment.
* Character presentation.
* Animations and other visual elements.

### Priority 5 — Optional Enhancements

* Voice interaction.
* More advanced visual presentation.
* Additional immersion features.

This prioritisation ensures that the core learning experience can be completed even if optional visual or technical features cannot be implemented within the project timeline.

---

# 19. Open Questions

The following questions should be reviewed as the project progresses:

* Which AI model/service provides the best balance of quality, reliability and cost?
* Can the selected AI reliably recognise different forms of agreement and refusal?
* How should AI responses be constrained to prevent the scenario from going off-topic?
* Can voice interaction be implemented within the available timeframe?
* What level of visual immersion can realistically be achieved within the 11-week timeline?
* What is the preferred method for Canvas access?
* Does the selected hosting solution support the required Canvas integration?
* Are there additional stakeholder requirements that have not yet been identified?

---

# 20. Final Deliverables

By Week 11, the project is expected to provide:

* A fully functional browser-accessible experience.
* A publicly accessible URL.
* Demonstration of the complete end-to-end user experience.
* Demonstration of the AI-driven clinical conversation.
* Demonstration of the YES and NO scenario outcomes.
* Confirmation that the experience can be accessed through Canvas using an external URL or compatible embedding approach.

The final experience should demonstrate that the core learning objective is supported, even if some optional visual or voice features are not included.

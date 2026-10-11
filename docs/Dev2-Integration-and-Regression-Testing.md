# Dev 2 Integration and Regression Testing — Sprint 3, Week 1

## Purpose

This document records the Week 1 review of the existing AI conversation implementation and the reported validation results. It supports the BA review of MVP requirements and the Sprint 3 NFR and Enhancement Roadmap. The aim is to confirm that the current evidence covers the core simulation behaviour, identify remaining limitations, and guide follow-up testing.

This is a concise supporting record, not a replacement for Dev 1's detailed validation report.

## Scope reviewed

The Dev 1 report describes checks of the existing conversation flow, scenario branching, escalation, error recovery, loading and stop controls, and server-side API-key handling. It reports 14 live student turns across six short conversations, plus an affected-case recheck after a safety-related dialogue fix. Additional reliability checks used isolated provider mocks and mocked browser responses.

## Test summary

The following outcomes are based on the results documented in Dev 1's report.
| Area | Expected behaviour | Reported result | Status |
|---|---|---|---|
| Uncertain questions | Questions such as “can you do it?” or “am I allowed to?” do not incorrectly advance the scenario | Expected `CONTINUE` classification; initial state unchanged | Reported pass |
| Refusal and pushback | Refusal advances through the expected pushback states | Refusal and subsequent pushbacks progressed through the expected states | Reported pass |
| Agreement | Clear agreement produces the appropriate outcome | `AGREE` led to `YES_OUTCOME` | Reported pass |
| Escalation / stop | Explicit stop or distress ends the interaction appropriately | `STOP` led to `EXIT`; terminal turns did not generate further Sandra dialogue | Reported pass |
| Safety-related dialogue | Sandra should not provide inappropriate procedural instructions | A problematic reply was identified; the existing guard was updated and the affected case was rechecked successfully | Reported fix and recheck |
| AI failure and retry | Failed or unusable output should not advance the scenario or create a fake reply; retry should recover when possible | Mocked fallback and retry checks reported successful; failures returned a neutral error without state advancement | Reported pass in mocked tests |
| Loading and stop controls | Duplicate submissions are prevented while waiting; stopping ends the session locally | Controls and local stop behaviour passed reported headless-browser checks | Reported pass |
| API-key handling | API key remains server-side and is not exposed to the client | Source review and reported response/script checks found no exposure | Reported pass within stated checks |

## Findings and limitations

- The reported core conversation and scenario transitions behaved as expected in the tested cases.
- A safety-related dialogue issue was found and addressed with a targeted guard change. The affected case was rechecked successfully.
- Minor dialogue-quality limitations remain, including an invented detail in one response and occasional awkward redirection. These did not change the reported classification or scenario state.
- The reliability checks included mocked failures and responses; they are not a full live-provider failure or load test.
- Full accessibility, mobile/responsive layout, and broad browser compatibility testing remain outside the reported validation scope.

## Link to BA requirements and roadmap

This review supports the BA task **Validate MVP Requirements and AI Conversation Behaviour** and informs `BA-NFR-and-Enhancement-Roadmap.md`:

- **MVP-01 — Core behaviour:** the reported conversation and branching checks provide initial supporting evidence, but do not prove every possible AI response is correct.
- **NFR-01 — AI failure and recovery:** mocked fallback and retry behaviour have been checked; broader reliability testing remains open.
- **NFR-06 — Security and API-key handling:** the report records checks for client-side key exposure; this should not be interpreted as a complete security audit.
- **NFR-02 / NFR-03 — Mobile compatibility and accessibility:** remain open for separate review and testing.
- Dialogue consistency and safety should continue to be monitored as the implementation changes.

## Follow-up actions

- Keep the safety-related guard and its regression case in mind when changing conversation logic.
- Retest core refusal, agreement, pushback, and stop/escalation behaviour after relevant code changes.
- Record any new defects or deviations in the project issue/task records and communicate them to Dev 1.
- Treat optional UI and interaction enhancements as lower priority than the correct, safe operation of the MVP.

## Summary

The existing validation report provides initial evidence that the core AI conversation flow, branching, escalation, and selected recovery controls work in the tested cases. A safety-related dialogue issue was corrected and the affected case was rechecked. Further reliability, accessibility, mobile, and dialogue-quality checks remain appropriate as the project progresses.

**Evidence note:** This document summarises the results recorded by Dev 1. Any future tests performed directly by Dev 2 should be added with the test date, scenario, actual result, and outcome, and clearly distinguished from the referenced results.

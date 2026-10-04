import type { ResponseClassification } from "./classify-response";

export type ActiveState =
  | "INITIAL_REQUEST"
  | "PUSHBACK_1"
  | "PUSHBACK_2"
  | "PUSHBACK_3";

export type ScenarioState = ActiveState | "YES_OUTCOME" | "NO_OUTCOME" | "EXIT";

export function isActiveState(state: ScenarioState): state is ActiveState {
  return state !== "YES_OUTCOME" && state !== "NO_OUTCOME" && state !== "EXIT";
}

const nextRefusalState: Record<ActiveState, ScenarioState> = {
  INITIAL_REQUEST: "PUSHBACK_1",
  PUSHBACK_1: "PUSHBACK_2",
  PUSHBACK_2: "PUSHBACK_3",
  PUSHBACK_3: "NO_OUTCOME",
};

export function getNextState(
  state: ScenarioState,
  response: ResponseClassification,
): ScenarioState {
  // Once the conversation has ended, further responses cannot restart escalation.
  if (!isActiveState(state)) return state;
  if (response === "STOP") return "EXIT";
  if (response === "AGREE") return "YES_OUTCOME";
  if (response === "REFUSE") return nextRefusalState[state];
  // CONTINUE preserves the current state and refusal pressure.
  return state;
}

export const sandraDialogue: Record<ActiveState, string> = {
  INITIAL_REQUEST:
    "We're short-staffed on Ward 4 North. Mr Arthur Chen, 71, needs his Augmentin. Please administer 1.2 g in 100 mL normal saline through his existing peripheral IV cannula over 30 minutes.",
  PUSHBACK_1:
    "It's a straightforward task. You've covered medication administration in class, and his IV is already in place. I'm sure you can manage it.",
  PUSHBACK_2:
    "We're two nurses down and everyone is stretched. I don't have time to keep discussing this. I need you to help with Mr Chen's medication.",
  PUSHBACK_3:
    "I need students I can rely on. If you won't help, I'll have to raise your cooperation when I give feedback on your placement. Are you going to do it?",
};

export const sandraRedirect: Record<ActiveState, string> = {
  INITIAL_REQUEST:
    "I'm asking about Mr Chen's medication. Are you going to administer it?",
  PUSHBACK_1:
    "The IV is already in place. I need to know whether you'll do the task.",
  PUSHBACK_2:
    "We're short-staffed and I need a clear answer about Mr Chen's medication.",
  PUSHBACK_3:
    "I'm still waiting for your answer. Can I rely on you to do this?",
};

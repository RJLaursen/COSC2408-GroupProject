"use client";

import { useState, type FormEvent } from "react";
import { classifyResponse } from "@/lib/classify-response";
import {
  getNextState,
  isActiveState,
  sandraDialogue,
  sandraRedirect,
  type ScenarioState,
} from "@/lib/scenario";

type Message = {
  speaker: "Sandra" | "You";
  text: string;
};

type Conversation = {
  state: ScenarioState;
  messages: Message[];
};

export default function Home() {
  const [conversation, setConversation] = useState<Conversation>({
    state: "INITIAL_REQUEST",
    messages: [{ speaker: "Sandra", text: sandraDialogue.INITIAL_REQUEST }],
  });
  const [response, setResponse] = useState("");
  const active = isActiveState(conversation.state);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = response.trim();
    if (!active || !text) return;

    const classification = classifyResponse(text);

    setConversation((current) => {
      if (!isActiveState(current.state)) return current;

      const nextState = getNextState(current.state, classification);
      const messages: Message[] = [
        ...current.messages,
        { speaker: "You", text },
      ];

      if (isActiveState(nextState)) {
        messages.push({
          speaker: "Sandra",
          text:
            classification === "UNCLEAR"
              ? sandraRedirect[nextState]
              : sandraDialogue[nextState],
        });
      }

      return { state: nextState, messages };
    });
    setResponse("");
  }

  function handleExit() {
    setConversation((current) => ({
      ...current,
      state: getNextState(current.state, "STOP"),
    }));
    setResponse("");
  }

  return (
    <main>
      <header>
        <h1>Virtual Health Precinct</h1>
        <p>Clinical Simulation Prototype</p>
        <h2>Ward 4 North</h2>
        <p>
          You are a second-year nursing student on placement. You have studied
          medication administration but have not been clinically assessed or
          authorised to administer IV medication independently.
        </p>
        <p>Sandra Kowalski, RN, is the nurse in charge of the afternoon shift.</p>
        {active && (
          <button type="button" onClick={handleExit}>
            Stop simulation
          </button>
        )}
      </header>

      <section aria-labelledby="conversation-heading">
        <h2 id="conversation-heading">Conversation</h2>
        <ol
          className="conversation"
          role="log"
          aria-labelledby="conversation-heading"
          aria-live="polite"
          aria-relevant="additions"
        >
          {conversation.messages.map((message, index) => (
            <li key={index}>
              <strong>{message.speaker}</strong>
              <p>{message.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {active && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="response">Your response to Sandra</label>
          <textarea
            id="response"
            name="response"
            rows={3}
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            required
          />
          <div className="actions">
            <button type="submit" disabled={!response.trim()}>
              Send response
            </button>
            <button type="button" onClick={handleExit}>
              Stop simulation
            </button>
          </div>
        </form>
      )}

      <div aria-live="polite" aria-atomic="true">
        {conversation.state === "YES_OUTCOME" && (
          <section aria-labelledby="outcome-heading">
            <h2 id="outcome-heading">You agreed to the task</h2>
            <p>
              The conversation has ended. In this scenario, you were not
              authorised to administer IV medication independently. Agreeing to
              the request would place you outside your scope and could put the
              patient at risk.
            </p>
            <p>
              Pressure from a senior colleague can make responding difficult.
              Reflect on how you could maintain your professional boundary and
              raise the concern with your clinical facilitator or placement
              supervisor.
            </p>
          </section>
        )}
        {conversation.state === "NO_OUTCOME" && (
          <section aria-labelledby="outcome-heading">
            <h2 id="outcome-heading">You maintained your boundary</h2>
            <p>
              The conversation has ended. You continued to decline a task outside
              your authorised scope despite pressure. Maintaining this boundary
              supports patient safety.
            </p>
            <p>
              Consider how you would raise the concern with your clinical
              facilitator or placement supervisor and seek appropriate support.
            </p>
          </section>
        )}
        {conversation.state === "EXIT" && (
          <section aria-labelledby="outcome-heading">
            <h2 id="outcome-heading">Simulation stopped</h2>
            <p>
              You have left the conversation. You can take a break or close this
              page whenever you are ready.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

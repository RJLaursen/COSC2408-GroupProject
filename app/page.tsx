"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  HISTORY_LIMIT,
  MAX_MESSAGE_LENGTH,
  isConversationReply,
  readConversationDebug,
  type Message,
} from "@/lib/conversation";
import {
  getNextState,
  isActiveState,
  sandraDialogue,
  type ScenarioState,
} from "@/lib/scenario";

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
  const [isLoading, setIsLoading] = useState(false);
  const [failedTurn, setFailedTurn] = useState<{ text: string; history: Message[] } | null>(null);
  const pendingRequest = useRef<AbortController | null>(null);
  const active = isActiveState(conversation.state);

  useEffect(() => () => {
    pendingRequest.current?.abort();
    pendingRequest.current = null;
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = response.trim();
    if (!text || failedTurn) return;
    void sendResponse(text, conversation.messages.slice(-HISTORY_LIMIT));
  }

  async function sendResponse(text: string, history: Message[], retry = false) {
    const state = conversation.state;
    if (!isActiveState(state) || !text || pendingRequest.current) return;

    const controller = new AbortController();
    pendingRequest.current = controller;
    setIsLoading(true);
    setFailedTurn(null);
    setResponse("");
    if (!retry) {
      setConversation((current) => ({
        ...current,
        messages: [...current.messages, { speaker: "You", text }],
      }));
    }

    // Allow the bounded model attempts to finish, but never leave the input stuck.
    const timeout = window.setTimeout(() => controller.abort(), 90000);
    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, message: text, history }),
        signal: controller.signal,
      });
      const data: unknown = await response.json();
      if (!data || typeof data !== "object") throw new Error("Unusable response");
      if (process.env.NODE_ENV === "development" && "debug" in data) {
        const debug = readConversationDebug(data.debug);
        if (debug) console.debug("[conversation]", debug);
      }
      if (!response.ok || !("classification" in data) || !("reply" in data)) {
        throw new Error("Conversation unavailable");
      }
      const result = { classification: data.classification, reply: data.reply };
      if (!isConversationReply(result, state)) throw new Error("Unusable response");

      // Stop/unmount invalidates this request, even if a late response arrives.
      if (pendingRequest.current !== controller) return;
      setConversation((current) => {
        if (!isActiveState(current.state)) return current;
        const nextState = getNextState(current.state, result.classification);
        return {
          state: nextState,
          messages: isActiveState(nextState)
            ? [...current.messages, { speaker: "Sandra", text: result.reply }]
            : current.messages,
        };
      });
    } catch {
      if (pendingRequest.current === controller) setFailedTurn({ text, history });
    } finally {
      window.clearTimeout(timeout);
      if (pendingRequest.current === controller) {
        pendingRequest.current = null;
        setIsLoading(false);
      }
    }
  }

  function handleExit() {
    pendingRequest.current?.abort();
    pendingRequest.current = null;
    setIsLoading(false);
    setFailedTurn(null);
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
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={isLoading || failedTurn !== null}
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            required
          />
          <div className="actions">
            <button type="submit" disabled={isLoading || failedTurn !== null || !response.trim()}>
              Send response
            </button>
            <button type="button" onClick={handleExit}>
              Stop simulation
            </button>
          </div>
          <p role="status">{isLoading ? "Sandra is responding..." : ""}</p>
          {failedTurn && (
            <div>
              <p role="alert">Sandra&apos;s response is unavailable right now. Please try again.</p>
              <button type="button" onClick={() => void sendResponse(failedTurn.text, failedTurn.history, true)}>
                Retry response
              </button>
            </div>
          )}
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

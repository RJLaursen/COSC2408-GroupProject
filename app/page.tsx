"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
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
import SandraReply from "./sandra-reply";
import WardScene, { expressionForState, type SandraExpression } from "./ward-scene";
import UiIcon from "./ui-icon";

type Conversation = {
  state: ScenarioState;
  messages: Message[];
  expression: SandraExpression;
};

// Presentation only: the API starts immediately and Stop cancels this short wait.
function waitForPresentation(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted || milliseconds <= 0) return resolve();
    function finish() {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", finish);
      resolve();
    }
    const timer = window.setTimeout(finish, milliseconds);
    signal.addEventListener("abort", finish, { once: true });
  });
}

export default function Home() {
  const [conversation, setConversation] = useState<Conversation>({
    state: "INITIAL_REQUEST",
    messages: [{ speaker: "Sandra", text: sandraDialogue.INITIAL_REQUEST }],
    expression: "neutral",
  });
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [revealingReply, setRevealingReply] = useState<string | null>(null);
  const [failedTurn, setFailedTurn] = useState<{ text: string; history: Message[] } | null>(null);
  const pendingRequest = useRef<AbortController | null>(null);
  const responseInput = useRef<HTMLTextAreaElement | null>(null);
  const conversationLog = useRef<HTMLOListElement | null>(null);
  const historyDialog = useRef<HTMLDialogElement | null>(null);
  const outcomeHeading = useRef<HTMLHeadingElement | null>(null);
  const retryButton = useRef<HTMLButtonElement | null>(null);
  const followLatest = useRef(true);
  const lastScrollTop = useRef(0);
  const restoreFocus = useRef(false);
  const [scrolledUp, setScrolledUp] = useState(false);
  const active = isActiveState(conversation.state);
  const isBusy = isLoading || revealingReply !== null;
  const finishReveal = useCallback(() => setRevealingReply(null), []);
  const latestSandra = conversation.messages.findLast((message) => message.speaker === "Sandra")!;
  const latestSandraIndex = conversation.messages.lastIndexOf(latestSandra);
  const latestStudent = conversation.messages.findLast((message) => message.speaker === "You");

  useEffect(() => () => {
    pendingRequest.current?.abort();
    pendingRequest.current = null;
  }, []);

  useEffect(() => {
    const input = responseInput.current;
    if (input) {
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight + 2}px`;
    }
    const log = conversationLog.current;
    if (log && historyDialog.current?.open && followLatest.current) log.scrollTop = log.scrollHeight;
  }, [response, conversation.messages, isLoading]);

  useEffect(() => {
    if (!active) {
      historyDialog.current?.close();
      outcomeHeading.current?.focus({ preventScroll: true });
      outcomeHeading.current?.scrollIntoView({ block: "nearest" });
    } else if (!isBusy && restoreFocus.current && document.activeElement === document.body) {
      (failedTurn ? retryButton.current : responseInput.current)?.focus({ preventScroll: true });
    }
    if (!isBusy) restoreFocus.current = false;
  }, [active, isBusy, failedTurn]);

  function trackConversationScroll() {
    const log = conversationLog.current;
    if (!log) return;
    const nearBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 72;
    // Appending content can move the bottom without the student scrolling up.
    if (nearBottom) followLatest.current = true;
    else if (log.scrollTop < lastScrollTop.current) followLatest.current = false;
    lastScrollTop.current = log.scrollTop;
    setScrolledUp(!nearBottom);
  }

  function jumpToLatest() {
    const log = conversationLog.current;
    if (!log) return;
    followLatest.current = true;
    log.scrollTop = log.scrollHeight;
    log.focus({ preventScroll: true });
    setScrolledUp(false);
  }

  function openHistory() {
    historyDialog.current?.showModal();
    followLatest.current = true;
    const log = conversationLog.current;
    if (log) log.scrollTop = log.scrollHeight;
    setScrolledUp(false);
  }

  function closeHistory() {
    historyDialog.current?.close();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = response.trim();
    if (!text || failedTurn || isBusy) return;
    void sendResponse(text, conversation.messages.slice(-HISTORY_LIMIT));
  }

  async function sendResponse(text: string, history: Message[], retry = false) {
    const state = conversation.state;
    if (!isActiveState(state) || !text || pendingRequest.current || revealingReply !== null) return;

    const controller = new AbortController();
    const submittedAt = performance.now();
    restoreFocus.current = document.activeElement?.closest(".response-form") !== null;
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

      if (result.reply) {
        await waitForPresentation(700 - (performance.now() - submittedAt), controller.signal);
      }
      // Stop/unmount invalidates this request, even if a late response arrives.
      if (pendingRequest.current !== controller) return;
      setRevealingReply(result.reply || null);
      setConversation((current) => {
        if (!isActiveState(current.state)) return current;
        const nextState = getNextState(current.state, result.classification);
        return {
          state: nextState,
          // Terminal overlays retain the last active expression.
          expression: isActiveState(nextState) ? expressionForState(nextState) : current.expression,
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
    setRevealingReply(null);
    setFailedTurn(null);
    setConversation((current) => ({
      ...current,
      state: getNextState(current.state, "STOP"),
    }));
    setResponse("");
  }

  return (
    <div className={`application-shell${active ? "" : " simulation-ended"}`}>
      <a className="skip-link" href="#conversation-panel">Skip to Sandra&apos;s dialogue</a>
      <header className="application-header">
        <div className="application-brand">
          <span className="brand-mark" aria-hidden="true">+</span>
          <h1>Virtual Health Precinct</h1>
        </div>
        <p className="ward-label">Ward 4 North <span aria-hidden="true">&middot;</span> Tuesday 14:00</p>
        <div className="hud-controls">
          <button className="voice-placeholder" type="button" disabled title="Sandra voice unavailable - planned separately" aria-label="Sandra voice unavailable">
            <UiIcon name="speaker" />
          </button>
          <button className="history-button hud-button" type="button" onClick={openHistory} aria-haspopup="dialog" aria-controls="history-dialog">
            <UiIcon name="history" /><span>History</span>
          </button>
          {active && (
            <details className="patient-information">
              <summary><UiIcon name="patient" /><span>Patient details</span><span className="details-toggle" aria-hidden="true">&#8964;</span></summary>
              <div className="patient-information-content">
                <div className="patient-heading">
                  <span className="patient-symbol" aria-hidden="true"><UiIcon name="patient" /></span>
                  <div><h2>Arthur Chen</h2><p>71 years &middot; Your patient</p></div>
                </div>
                <dl>
                  <div><dt>Conditions</dt><dd>Community-acquired pneumonia<br />Type 2 diabetes</dd></div>
                  <div><dt>Current care</dt><dd>Oxygen</dd></div>
                  <div><dt>IV access</dt><dd>Existing peripheral IV cannula</dd></div>
                  <div><dt>Medication request</dt><dd>Augmentin 1.2 g in 100 mL normal saline over 30 minutes.</dd></div>
                </dl>
                <h3>Your role</h3>
                <p>
                  You are a second-year nursing student on placement. You have studied
                  medication administration but have not been clinically assessed or
                  authorised to administer IV medication independently.
                </p>
              </div>
            </details>
          )}
          {active && (
            <button className="button-stop" type="button" onClick={handleExit}>
              <span className="stop-symbol" aria-hidden="true" />Stop simulation
            </button>
          )}
        </div>
      </header>

      <main className="simulation-stage">
        <WardScene expression={conversation.expression} />
        <div className="scene-scrim" aria-hidden="true" />
        <p className="scene-patient-label">Arthur Chen <span>71 years &middot; Your patient</span></p>

        <section id="conversation-panel" className="scene-interaction" aria-label="Conversation with Sandra" tabIndex={-1} inert={!active}>
          <div className="speech-bubble" role="log" aria-label="Sandra's current dialogue" aria-live="polite" aria-relevant="additions" aria-busy={isLoading}>
            <div className="speech-heading">
              <h2>Sandra Kowalski, <span>RN</span></h2>
              <span aria-hidden="true">&middot;&middot;&middot;</span>
            </div>
            <div className="speech-content" tabIndex={0} aria-label="Sandra's reply">
              {isLoading ? (
                <div className="typing-dots" aria-hidden="true"><span /><span /><span /></div>
              ) : (
                <SandraReply
                  key={latestSandraIndex}
                  text={latestSandra.text}
                  animate={active && revealingReply === latestSandra.text}
                  onComplete={finishReveal}
                />
              )}
            </div>
          </div>
          {isLoading && latestStudent && (
            <div className="student-utterance" aria-live="off"><strong>You</strong><p>{latestStudent.text}</p></div>
          )}

          {active && (
            <form className="response-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="response">Your response to Sandra</label>
              <div className="composer-row">
                <span className="student-avatar" aria-hidden="true">You</span>
                <div className="composer-input">
                  <textarea
                    ref={responseInput}
                    id="response"
                    name="response"
                    rows={2}
                    maxLength={MAX_MESSAGE_LENGTH}
                    aria-describedby="response-hint response-count"
                    disabled={isBusy || failedTurn !== null}
                    value={response}
                    onChange={(event) => setResponse(event.target.value)}
                    required
                    placeholder="Type your response to Sandra..."
                  />
                  <button className="microphone-placeholder" type="button" disabled title="Microphone input unavailable - planned separately" aria-label="Microphone input unavailable">
                    <UiIcon name="microphone" />
                  </button>
                </div>
                <button className="button-primary" type="submit" disabled={isBusy || failedTurn !== null || !response.trim()}><UiIcon name="send" /><span>Send response</span></button>
              </div>
              <div className="response-help">
                <p id="response-hint">Enter adds a new line. You can stop at any time.</p>
                <span id="response-count">{response.length} / {MAX_MESSAGE_LENGTH}</span>
              </div>
              {failedTurn && (
                <div className="retry-notice">
                  <p role="alert">Sandra&apos;s response is unavailable right now. Please try again.</p>
                  <button ref={retryButton} className="button-secondary" type="button" onClick={() => void sendResponse(failedTurn.text, failedTurn.history, true)}>
                    Retry response
                  </button>
                </div>
              )}
            </form>
          )}
        </section>
        <p className="sr-only" role="status">{isLoading ? "Sandra is responding..." : ""}</p>

        <div className="outcome-region">
          {conversation.state === "YES_OUTCOME" && (
            <section className="conclusion-card" aria-labelledby="outcome-heading">
              <p className="eyebrow">Simulation complete · Reflection</p>
              <h2 id="outcome-heading" ref={outcomeHeading} tabIndex={-1}>You agreed to the task</h2>
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
            <section className="conclusion-card" aria-labelledby="outcome-heading">
              <p className="eyebrow">Simulation complete · Reflection</p>
              <h2 id="outcome-heading" ref={outcomeHeading} tabIndex={-1}>You maintained your boundary</h2>
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
            <section className="conclusion-card" aria-labelledby="outcome-heading">
              <p className="eyebrow">Conversation ended</p>
              <h2 id="outcome-heading" ref={outcomeHeading} tabIndex={-1}>Simulation stopped</h2>
              <p>
                You have left the conversation. You can take a break or close this
                page whenever you are ready.
              </p>
            </section>
          )}
        </div>
      </main>

      <dialog id="history-dialog" className="history-drawer" ref={historyDialog} aria-labelledby="history-heading" onClick={(event) => { if (event.target === event.currentTarget) closeHistory(); }}>
        <div className="history-surface">
          <header className="history-header">
            <div><p className="eyebrow">This conversation</p><h2 id="history-heading">Conversation history</h2></div>
            <button className="button-icon" type="button" onClick={closeHistory} aria-label="Close conversation history"><UiIcon name="close" /></button>
          </header>
          <ol className="history-log" ref={conversationLog} tabIndex={0} onScroll={trackConversationScroll} aria-label="Previous Sandra and student messages">
            {conversation.messages.map((message, index) => (
              <li key={index} className={`history-message ${message.speaker === "You" ? "history-student" : "history-sandra"}`}>
                <strong>{message.speaker === "Sandra" ? "Sandra Kowalski, RN" : "You"}</strong>
                <p>{message.text}</p>
              </li>
            ))}
          </ol>
          {scrolledUp && <button className="latest-messages button-secondary" type="button" onClick={jumpToLatest}>Jump to latest messages</button>}
          <div className="history-footer">
            <p>Conversation stays in this session only.</p>
            {active && <button className="button-stop" type="button" onClick={handleExit}>Stop simulation</button>}
          </div>
        </div>
      </dialog>
    </div>
  );
}

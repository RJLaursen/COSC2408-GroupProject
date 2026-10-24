"use client";

import {
  useCallback, useEffect, useRef, useState,
  type FormEvent, type KeyboardEvent,
} from "react";
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
import OutcomePanel from "./outcome-panel";

type Conversation = {
  state: ScenarioState;
  messages: Message[];
  expression: SandraExpression;
  agreedAfterRefusal: boolean;
};

function initialConversation(): Conversation {
  return {
    state: "INITIAL_REQUEST",
    messages: [{ speaker: "Sandra", text: sandraDialogue.INITIAL_REQUEST }],
    expression: "neutral",
    agreedAfterRefusal: false,
  };
}

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
  const [conversation, setConversation] = useState<Conversation>(initialConversation);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [revealingReply, setRevealingReply] = useState<string | null>(null);
  const [failedTurn, setFailedTurn] = useState<{ text: string; history: Message[] } | null>(null);
  const pendingRequest = useRef<AbortController | null>(null);
  const requestTimeout = useRef<number | null>(null);
  const restartFocus = useRef(false);
  const applicationShell = useRef<HTMLDivElement | null>(null);
  const responseForm = useRef<HTMLFormElement | null>(null);
  const responseInput = useRef<HTMLTextAreaElement | null>(null);
  const composing = useRef(false);
  const hudHeader = useRef<HTMLElement | null>(null);
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

  const cancelPendingTurn = useCallback(() => {
    pendingRequest.current?.abort();
    pendingRequest.current = null;
    if (requestTimeout.current !== null) window.clearTimeout(requestTimeout.current);
    requestTimeout.current = null;
  }, []);

  useEffect(() => () => cancelPendingTurn(), [cancelPendingTurn]);

  useEffect(() => {
    const viewport = window.visualViewport;
    function updateHeight() {
      if (!viewport || viewport.scale === 1) {
        applicationShell.current?.style.setProperty("--available-height", `${viewport?.height ?? window.innerHeight}px`);
      }
    }
    updateHeight();
    viewport?.addEventListener("resize", updateHeight);
    window.addEventListener("resize", updateHeight);
    return () => {
      viewport?.removeEventListener("resize", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const form = responseForm.current;
    const header = hudHeader.current;
    if (!header) return;
    const observer = new ResizeObserver(() => {
      applicationShell.current?.style.setProperty("--composer-height", `${form?.getBoundingClientRect().height ?? 0}px`);
      applicationShell.current?.style.setProperty("--hud-height", `${header.getBoundingClientRect().height}px`);
    });
    if (form) observer.observe(form);
    observer.observe(header);
    return () => observer.disconnect();
  }, [active]);

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
    } else if (restartFocus.current) {
      responseInput.current?.focus({ preventScroll: true });
      restartFocus.current = false;
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

  function handleResponseKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
    // Some IMEs report keyCode 229 while confirming a composed character.
    if (composing.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
    event.preventDefault();
    if (!isBusy && !failedTurn && response.trim()) event.currentTarget.form?.requestSubmit();
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
    requestTimeout.current = timeout;
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
          agreedAfterRefusal: nextState === "YES_OUTCOME" && current.state !== "INITIAL_REQUEST",
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
      if (requestTimeout.current === timeout) requestTimeout.current = null;
      if (pendingRequest.current === controller) {
        pendingRequest.current = null;
        setIsLoading(false);
      }
    }
  }

  function handleExit() {
    composing.current = false;
    cancelPendingTurn();
    setIsLoading(false);
    setRevealingReply(null);
    setFailedTurn(null);
    setConversation((current) => ({
      ...current,
      state: getNextState(current.state, "STOP"),
    }));
    setResponse("");
  }

  function handleRestart() {
    composing.current = false;
    cancelPendingTurn();
    historyDialog.current?.close();
    setIsLoading(false);
    setRevealingReply(null);
    setFailedTurn(null);
    setResponse("");
    setScrolledUp(false);
    followLatest.current = true;
    lastScrollTop.current = 0;
    restoreFocus.current = false;
    restartFocus.current = true;
    setConversation(initialConversation());
  }

  return (
    <div ref={applicationShell} className={`application-shell${active ? "" : " simulation-ended"}`}>
      <a className="skip-link" href="#conversation-panel">Skip to Sandra&apos;s dialogue</a>
      <header className="application-header" ref={hudHeader}>
        <div className="application-brand">
          <h1>Virtual Health Precinct</h1>
        </div>
        <p className="ward-label"><span>Ward 4 North</span> <span aria-hidden="true">&middot;</span> <span>Tuesday 14:00</span></p>
        <div className="hud-controls">
          <button className="history-button hud-button" type="button" onClick={openHistory} aria-haspopup="dialog" aria-controls="history-dialog">
            <UiIcon name="history" /><span>History</span>
          </button>
          {active && (
            <details className="patient-information">
              <summary><UiIcon name="patient" /><span>Patient details</span><span className="details-toggle" aria-hidden="true"><UiIcon name="chevron" /></span></summary>
              <div className="patient-information-content" tabIndex={0} aria-label="Patient information">
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
            <form className="response-form" ref={responseForm} onSubmit={handleSubmit}>
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
                    onKeyDown={handleResponseKeyDown}
                    onCompositionStart={() => { composing.current = true; }}
                    onCompositionEnd={() => { composing.current = false; }}
                    required
                    placeholder="Type your response to Sandra..."
                  />
                </div>
                <button className="button-primary" type="submit" disabled={isBusy || failedTurn !== null || !response.trim()}><UiIcon name="send" /><span>Send response</span></button>
              </div>
              <div className="response-help">
                <p id="response-hint">Enter to send. Shift+Enter for a new line.</p>
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
          {!active && (
            <OutcomePanel
              state={conversation.state}
              agreedAfterRefusal={conversation.agreedAfterRefusal}
              headingRef={outcomeHeading}
              onRestart={handleRestart}
            />
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

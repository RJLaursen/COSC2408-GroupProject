"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  animate: boolean;
  onComplete: () => void;
  typingDelayMs?: number;
};

export default function SandraReply({ text, animate, onComplete, typingDelayMs = 0 }: Props) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const characters = Array.from(text);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Longer replies reveal faster per character; none take longer than 1.4 seconds.
    const duration = Math.min(1400, Math.max(800, characters.length * 7));
    const start = performance.now() + typingDelayMs;
    let frame: number;
    function reveal(now: number) {
      const progress = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, (now - start) / duration));
      setVisibleCharacters(Math.ceil(characters.length * progress));
      if (progress < 1) frame = window.requestAnimationFrame(reveal);
      else onComplete();
    }
    frame = window.requestAnimationFrame(reveal);
    return () => window.cancelAnimationFrame(frame);
  }, [text, animate, onComplete, typingDelayMs]);

  return (
    <p className={`reply-text${animate && typingDelayMs > 0 && visibleCharacters === 0 ? " is-typing" : ""}`}>
      {/* The accessible text is complete and never updated character by character. */}
      <span className="sr-only">{text}</span>
      <span className="opening-typing typing-dots" aria-hidden="true"><span /><span /><span /></span>
      <span className="reply-space" aria-hidden="true">{text}</span>
      <span className="reply-visible" aria-hidden="true">
        {animate ? Array.from(text).slice(0, visibleCharacters).join("") : text}
      </span>
    </p>
  );
}

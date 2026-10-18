"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  animate: boolean;
  onComplete: () => void;
};

export default function SandraReply({ text, animate, onComplete }: Props) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const characters = Array.from(text);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Longer replies reveal faster per character; none take longer than 1.4 seconds.
    const duration = Math.min(1400, Math.max(800, characters.length * 7));
    const start = performance.now();
    let frame: number;
    function reveal(now: number) {
      const progress = reducedMotion.matches ? 1 : Math.min(1, (now - start) / duration);
      setVisibleCharacters(Math.ceil(characters.length * progress));
      if (progress < 1) frame = window.requestAnimationFrame(reveal);
      else onComplete();
    }
    frame = window.requestAnimationFrame(reveal);
    return () => window.cancelAnimationFrame(frame);
  }, [text, animate, onComplete]);

  return (
    <p className="reply-text">
      {/* The accessible text is complete and never updated character by character. */}
      <span className="sr-only">{text}</span>
      <span className="reply-space" aria-hidden="true">{text}</span>
      <span className="reply-visible" aria-hidden="true">
        {animate ? Array.from(text).slice(0, visibleCharacters).join("") : text}
      </span>
    </p>
  );
}

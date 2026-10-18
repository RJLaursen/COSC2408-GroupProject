import Image from "next/image";
import type { ActiveState } from "@/lib/scenario";

export type SandraExpression = "neutral" | "frustrated" | "stern";

export function expressionForState(state: ActiveState): SandraExpression {
  if (state === "PUSHBACK_3") return "stern";
  if (state === "PUSHBACK_2") return "frustrated";
  return "neutral";
}

const expressions: SandraExpression[] = ["neutral", "frustrated", "stern"];

export default function WardScene({ expression }: { expression: SandraExpression }) {
  return (
    <div className="ward-visuals" role="img" aria-label="Ward 4 North: Sandra in the left foreground, Arthur in bed on the right with oxygen and IV equipment.">
      <div className="ward-background-frame">
        <Image
          className="ward-background"
          src="/scene/ward-arthur.webp"
          alt=""
          fill
          sizes="100vw"
          unoptimized
          preload
        />
      </div>
      <div className="sandra-art" data-expression={expression}>
        {/* Load every expression early; identical canvases keep the character still. */}
        {expressions.map((name) => (
          <Image
            key={name}
            className={`sandra-image${name === expression ? " is-visible" : ""}`}
            src={`/scene/sandra-${name}.webp`}
            alt=""
            fill
            sizes="100vw"
            unoptimized
            loading="eager"
          />
        ))}
      </div>
    </div>
  );
}

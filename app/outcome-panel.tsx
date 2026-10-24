import type { RefObject } from "react";
import type { ScenarioState } from "@/lib/scenario";
import { learningResources } from "@/lib/learning-resources";

type Props = {
  state: ScenarioState;
  agreedAfterRefusal: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
};

export default function OutcomePanel({ state, agreedAfterRefusal, headingRef, onRestart }: Props) {
  if (state !== "YES_OUTCOME" && state !== "NO_OUTCOME" && state !== "EXIT") return null;
  const title = state === "YES_OUTCOME" ? "You agreed to the task" :
    state === "NO_OUTCOME" ? "You maintained your boundary" : "Simulation stopped";

  return (
    <section className="conclusion-card" aria-labelledby="outcome-heading">
      <div className="outcome-content" tabIndex={0} aria-label="Outcome feedback">
        <p className="eyebrow">{state === "EXIT" ? "Conversation ended" : "Simulation complete · Reflection"}</p>
        <h2 id="outcome-heading" ref={headingRef} tabIndex={-1}>{title}</h2>
        {state === "YES_OUTCOME" && (
          <>
            <p>
              In this scenario, you had not been clinically assessed or authorised
              to administer IV medication independently. Agreeing to Sandra&apos;s
              request would mean acting outside your authorised scope and could
              put Mr Chen at risk of medication-related harm.
            </p>
            {agreedAfterRefusal && (
              <p className="coercion-note">
                You initially refused, then agreed as the pressure continued.
                Holding a boundary with a senior colleague can be difficult;
                your initial concern still mattered.
              </p>
            )}
            <p>
              This exercise is an opportunity to practise, not a judgement of you.
              A respectful refusal could be:
            </p>
            <blockquote>
              &ldquo;Sandra, I want to help, but I am not assessed or authorised to
              administer IV medication independently. I cannot take on this task.
              Is there another way I can help?&rdquo;
            </blockquote>
            <p>
              Before taking on a task you are not authorised to perform, pause and
              contact your clinical facilitator or placement coordinator. Discuss
              the request and any pressure you experienced, and seek guidance and support.
            </p>
          </>
        )}
        {state === "NO_OUTCOME" && (
          <>
            <p>
              You maintained a professional boundary despite pressure. In this
              scenario, the task was outside your assessed and authorised scope.
              Declining it helps protect the patient and supports safe practice.
            </p>
            <p>
              Afterwards, make a factual record of the request, your response and
              the relevant circumstances using your placement&apos;s approved
              documentation or reporting process. Raise the incident with your
              clinical facilitator or placement coordinator and seek support
              with the next steps.
            </p>
          </>
        )}
        {state === "EXIT" ? (
          <p>You have left the conversation. You can take a break or close this page whenever you are ready.</p>
        ) : (
          <section className="learning-resources" aria-labelledby="learning-heading">
            <h3 id="learning-heading">Further learning</h3>
            <p>Official public resources. Links open in a new tab.</p>
            <ul>
              {learningResources.map((resource) => (
                <li key={resource.href}>
                  <a href={resource.href} target="_blank" rel="noopener noreferrer">{resource.label}</a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="outcome-actions">
        <button className="button-primary" type="button" onClick={onRestart}>Restart simulation</button>
      </div>
    </section>
  );
}

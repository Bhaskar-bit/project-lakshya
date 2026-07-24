import type { SyntheticEvent } from "react";
import type { FinancialReviewViewModel } from "./adapters/conversation-to-view-model";

export function AssessmentDetails({
  details,
  onOpened,
}: {
  details: FinancialReviewViewModel["assessmentDetails"];
  onOpened?: () => void;
}) {
  const toggled = (event: SyntheticEvent<HTMLDetailsElement>) => {
    if (event.currentTarget.open) onOpened?.();
  };
  return (
    <details className="details" onToggle={toggled}>
      <summary>Why is my score {details.length ? "what it is" : "unavailable"}?</summary>
      {details.map((assessment) => (
        <article key={assessment.pillar}>
          <h3>{assessment.pillar} · {assessment.score}</h3>
          {assessment.reasons.map((reason) => <p key={reason}>{reason}</p>)}
          <ul>{assessment.metrics.map((metric) => <li key={metric.name}>{metric.name}: {metric.value}</li>)}</ul>
          {assessment.evidence.length > 0 && <p>Evidence: {assessment.evidence.join(", ")}</p>}
          <details className="technical-details">
            <summary>Assessment details</summary>
            <p>Rule: {assessment.ruleId}</p>
            <p>Version: {assessment.version}</p>
          </details>
        </article>
      ))}
    </details>
  );
}

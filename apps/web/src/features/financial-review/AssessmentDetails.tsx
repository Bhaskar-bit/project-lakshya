import type { FinancialReviewViewModel } from "./adapters/conversation-to-view-model";

export function AssessmentDetails({ details }: { details: FinancialReviewViewModel["assessmentDetails"] }) {
  return <details className="details"><summary>Why is my score what it is?</summary>{details.map((assessment) => <article key={assessment.pillar}><h3>{assessment.pillar} · {assessment.score}</h3>{assessment.reasons.map((reason) => <p key={reason}>{reason}</p>)}<ul>{assessment.metrics.map((metric) => <li key={metric.name}>{metric.name}: {metric.value}</li>)}</ul>{assessment.evidence.length > 0 && <p>Evidence: {assessment.evidence.join(", ")}</p>}</article>)}</details>;
}

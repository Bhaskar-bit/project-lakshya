import type { FinancialReviewViewModel } from "./adapters/conversation-to-view-model";

export function HealthSummary({ review }: { review: FinancialReviewViewModel }) {
  return <section className="health-summary"><span className="eyebrow">{review.isPartial ? "Preliminary assessment" : "Financial health"}</span><h1>Financial Health</h1><div className="score">{review.score}<span>/ 100</span></div><strong>{review.grade}</strong><p>Assessment coverage: {review.coverageLabel}</p></section>;
}

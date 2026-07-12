import { ActionSequence } from "./ActionSequence";
import { AssessmentDetails } from "./AssessmentDetails";
import { FindingsList } from "./FindingsList";
import { HealthSummary } from "./HealthSummary";
import { TopActionCard } from "./TopActionCard";
import { createFinancialReviewViewModel } from "./adapters/conversation-to-view-model";
import { demoFinancialState } from "./fixtures/demo-financial-state";
import type { FinancialState } from "../../../../../packages/financial-engine/dist/index.js";

export function FinancialReviewPage({ financialState = demoFinancialState }: { financialState?: FinancialState }) {
  const review = createFinancialReviewViewModel(financialState);
  return <main className="review"><HealthSummary review={review} /><TopActionCard action={review.topAction} /><ActionSequence actions={review.subsequentActions} /><FindingsList findings={review.findings} /><AssessmentDetails details={review.assessmentDetails} /></main>;
}

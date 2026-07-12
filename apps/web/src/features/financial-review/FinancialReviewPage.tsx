import { ActionSequence } from "./ActionSequence";
import { AssessmentDetails } from "./AssessmentDetails";
import { FindingsList } from "./FindingsList";
import { HealthSummary } from "./HealthSummary";
import { TopActionCard } from "./TopActionCard";
import { createFinancialReviewViewModel } from "./adapters/conversation-to-view-model";
import { demoFinancialState } from "./fixtures/demo-financial-state";

export function FinancialReviewPage() {
  const review = createFinancialReviewViewModel(demoFinancialState);
  return <main className="review"><HealthSummary review={review} /><TopActionCard action={review.topAction} /><ActionSequence actions={review.subsequentActions} /><FindingsList findings={review.findings} /><AssessmentDetails details={review.assessmentDetails} /></main>;
}

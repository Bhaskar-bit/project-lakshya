import { useEffect } from "react";
import type { FinancialState } from "../../../../../packages/financial-engine/dist/index.js";
import { track } from "../../analytics";
import { PreliminaryDisclaimer } from "../../components/PreliminaryDisclaimer";
import { ActionSequence } from "./ActionSequence";
import { AssessmentDetails } from "./AssessmentDetails";
import { FindingsList } from "./FindingsList";
import { HealthSummary } from "./HealthSummary";
import { ReviewFeedback } from "./ReviewFeedback";
import { TopActionCard } from "./TopActionCard";
import {
  createFinancialReviewViewModel,
  type FinancialReviewViewModel,
} from "./adapters/conversation-to-view-model";
import { demoFinancialState } from "./fixtures/demo-financial-state";

export function FinancialReviewPage({
  financialState = demoFinancialState,
  assessmentSavedAt = "demo",
  onClear,
}: {
  financialState?: FinancialState;
  assessmentSavedAt?: string;
  onClear?: () => void;
}) {
  try {
    const review = createFinancialReviewViewModel(financialState);
    return <ReviewContent review={review} assessmentSavedAt={assessmentSavedAt} onClear={onClear} />;
  } catch {
    return (
      <main className="review">
        <StateMessage
          title="We couldn’t generate your review"
          message="Your saved answers are still in this browser. Please try again or restart the assessment."
          onClear={onClear}
        />
      </main>
    );
  }
}

function ReviewContent({
  review,
  assessmentSavedAt,
  onClear,
}: {
  review: FinancialReviewViewModel;
  assessmentSavedAt: string;
  onClear?: () => void;
}) {
  useEffect(() => {
    const properties = {
      assessmentCoverage: review.assessmentCoverage,
      grade: review.grade,
      topRecommendationCode: review.topRecommendationCode,
      actionPlanStatus: review.actionPlanStatus,
    };
    track("review_viewed", properties);
    if (review.topAction) track("top_action_viewed", properties);
  }, [review]);

  return (
    <main className="review">
      <header className="review-nav">
        <a className="brand" href="/">Lakshay</a>
        <a href="/assessment">New assessment</a>
      </header>
      <PreliminaryDisclaimer />
      <HealthSummary review={review} />
      <TopActionCard action={review.topAction} />
      <ActionSequence actions={review.subsequentActions} />
      <FindingsList findings={review.findings} />
      <AssessmentDetails
        details={review.assessmentDetails}
        onOpened={() => track("explainability_opened", {
          assessmentCoverage: review.assessmentCoverage,
          grade: review.grade,
        })}
      />
      <ReviewFeedback assessmentSavedAt={assessmentSavedAt} />
      <section className="privacy-controls">
        <h2>Your privacy</h2>
        <p>Your assessment data stays in this browser session. Financial amounts are never sent to analytics.</p>
        {onClear && <button className="button danger" type="button" onClick={onClear}>Clear my assessment data</button>}
      </section>
    </main>
  );
}

export function StateMessage({
  title,
  message,
  onClear,
}: {
  title: string;
  message: string;
  onClear?: () => void;
}) {
  return (
    <section className="state-message" role="status">
      <p className="eyebrow">Financial review</p>
      <h1>{title}</h1>
      <p>{message}</p>
      <div className="cta-row">
        <a className="button primary" href="/assessment">Start assessment</a>
        <a className="button secondary" href="/review/demo">View example</a>
        {onClear && <button className="button danger" type="button" onClick={onClear}>Clear saved data</button>}
      </div>
    </section>
  );
}

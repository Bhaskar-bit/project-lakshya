import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { track } from "./analytics";
import { LandingPage } from "./LandingPage";
import { AssessmentPage } from "./features/financial-review/AssessmentPage";
import { FinancialReviewPage, StateMessage } from "./features/financial-review/FinancialReviewPage";
import {
  clearAssessment,
  loadAssessment,
} from "./features/financial-review/adapters/assessment-storage";
import { financialAssessmentInputToState } from "./features/financial-review/adapters/input-to-financial-state";
import { demoFinancialState } from "./features/financial-review/fixtures/demo-financial-state";
import "./styles.css";

function route() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return <LandingPage />;
  if (path === "/assessment") return <AssessmentPage />;
  if (path === "/review/demo") {
    return <FinancialReviewPage financialState={demoFinancialState} assessmentSavedAt="demo" />;
  }
  if (path === "/review") {
    const result = loadAssessment();
    const clearAndRestart = () => {
      clearAssessment();
      track("assessment_restarted");
      window.location.assign("/assessment");
    };
    if (result.status === "VALID") {
      return (
        <FinancialReviewPage
          financialState={financialAssessmentInputToState(result.assessment.input)}
          assessmentSavedAt={result.assessment.savedAt}
          onClear={clearAndRestart}
        />
      );
    }
    const copy = result.status === "MISSING"
      ? {
        title: "No financial assessment was found",
        message: "Complete the short assessment first, or view the example review.",
      }
      : result.status === "UNSUPPORTED_SCHEMA"
        ? {
          title: "Your saved assessment is from an unsupported version",
          message: "Clear the old browser data and complete a new assessment.",
        }
        : {
          title: "Your saved assessment could not be read",
          message: "The browser data appears corrupted. Clear it and start a new assessment.",
        };
    return (
      <main className="review">
        <StateMessage {...copy} onClear={result.status === "MISSING" ? undefined : clearAndRestart} />
      </main>
    );
  }
  return (
    <main className="review">
      <StateMessage title="Page not found" message="Return home or start a financial assessment." />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode>{route()}</StrictMode>);

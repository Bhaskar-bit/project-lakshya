import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FinancialReviewPage } from "./features/financial-review/FinancialReviewPage";
import { AssessmentPage } from "./features/financial-review/AssessmentPage";
import { financialAssessmentInputToState } from "./features/financial-review/adapters/input-to-financial-state";
import { loadAssessment } from "./features/financial-review/adapters/assessment-storage";
import { demoFinancialState } from "./features/financial-review/fixtures/demo-financial-state";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
const path = window.location.pathname;
const page = path === "/assessment" ? <AssessmentPage /> : path === "/review/demo" ? <FinancialReviewPage financialState={demoFinancialState} /> : <FinancialReviewPage financialState={loadAssessment() ? financialAssessmentInputToState(loadAssessment()!) : demoFinancialState} />;
root.render(
  <StrictMode>
    {page}
  </StrictMode>,
);

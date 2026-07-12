import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FinancialReviewPage } from "./features/financial-review/FinancialReviewPage";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <FinancialReviewPage />
  </StrictMode>,
);

import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { FinancialReviewPage } from "./FinancialReviewPage";

test("renders the top action and its sequenced next action", () => {
  const html = renderToStaticMarkup(<FinancialReviewPage />);

  expect(html).toContain("Pay off credit-card debt");
  expect(html).toContain("₹1,00,000");
  expect(html).toContain("Build Emergency Fund");
  expect(html).toContain("Preliminary assessment");
});

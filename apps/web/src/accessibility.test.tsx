// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, expect, test } from "vitest";
import { LandingPage } from "./LandingPage";
import { FinancialReviewPage } from "./features/financial-review/FinancialReviewPage";

afterEach(cleanup);

test.each([
  ["landing", <LandingPage />],
  ["review", <FinancialReviewPage />],
])("%s screen has no detectable accessibility violations", async (_name, page) => {
  const { container } = render(page);
  const result = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(result.violations).toEqual([]);
});

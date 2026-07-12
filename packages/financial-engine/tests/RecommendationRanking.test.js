import assert from "node:assert/strict";
import test from "node:test";
import { CreditCardDebtRecommendationRule, EmergencyFundRecommendationRule, FindingSeverity, RecommendationEngine, RecommendationRegistry, SavingsRateRecommendationRule } from "../dist/index.js";

const since = new Date("2026-07-12T00:00:00.000Z");
test("RecommendationEngine ranks competing actions by priority then expected impact", () => {
  const engine = new RecommendationEngine(new RecommendationRegistry("v1", [new EmergencyFundRecommendationRule(), new CreditCardDebtRecommendationRule(), new SavingsRateRecommendationRule()]));
  const report = engine.evaluate([
    { severity: FindingSeverity.MEDIUM, code: "SAVINGS_RATE_LOW", version: "v1", since, title: "Low savings", description: "" },
    { severity: FindingSeverity.HIGH, code: "EF_LOW", version: "v1", since, title: "Low emergency fund", description: "" },
    { severity: FindingSeverity.HIGH, code: "CREDIT_CARD_DEBT_PRESENT", version: "v1", since, title: "Credit-card debt", description: "" },
  ]);
  assert.deepEqual(report.recommendations.map((recommendation) => recommendation.title), ["Pay off credit-card debt", "Build Emergency Fund", "Increase monthly savings surplus"]);
});

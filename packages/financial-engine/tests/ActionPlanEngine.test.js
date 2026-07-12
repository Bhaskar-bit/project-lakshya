import assert from "node:assert/strict";
import test from "node:test";
import { ActionPlanEngine, AssetType, LiabilityType, SafetyRule } from "../dist/index.js";

const cardRecommendation = {
  id: "RECOMMENDATION_002", title: "Pay off credit-card debt", description: "Eliminate revolving credit-card debt.", priority: 0,
  expectedScoreIncrease: 8, sourceFindingCode: "CREDIT_CARD_DEBT_PRESENT", sourceFindingVersion: "v1", measurableTarget: "Credit-card outstanding of 0",
};
const emergencyRecommendation = {
  id: "RECOMMENDATION_001", title: "Build Emergency Fund", description: "Build liquid savings.", priority: 0,
  expectedScoreIncrease: 6, sourceFindingCode: "EF_LOW", sourceFindingVersion: "v1", measurableTarget: "Emergency Fund coverage of 6 months", expectedCompletion: "4 months",
};

function state({ income = 150_000, essential = 80_000, discretionary = 20_000, cardBalance = 100_000 } = {}) {
  return {
    profile: { monthlyIncome: income, monthlyExpenses: essential + discretionary, age: 32, retirementAge: 60, dependents: 0 },
    assets: [{ id: "cash", type: AssetType.CASH, name: "Cash", currentValue: 330_000 }],
    liabilities: cardBalance > 0 ? [{ id: "card", type: LiabilityType.CREDIT_CARD, name: "Card", outstandingBalance: cardBalance, emi: 0, interestRate: 36 }] : [],
    goals: [], investments: [],
    cashFlow: { monthlyIncome: income, monthlyEssentialExpenses: essential, monthlyDiscretionaryExpenses: discretionary },
  };
}

test("ActionPlanEngine sequences competing actions using the ranked surplus allocation", () => {
  const financialState = state();
  const report = new ActionPlanEngine().evaluate({
    recommendations: [cardRecommendation, emergencyRecommendation],
    assessments: [new SafetyRule().evaluate(financialState)], financialState, currency: "INR",
  });

  assert.equal(report.plans[0].status, "ACTIONABLE");
  assert.equal(report.plans[0].suggestedMonthlyAllocation.amount, 50_000);
  assert.equal(report.plans[0].estimatedCompletionMonths, 2);
  assert.equal(report.plans[1].status, "BLOCKED");
  assert.deepEqual(report.plans[1].dependencies, ["RECOMMENDATION_002"]);
  assert.equal(report.policyVersion, "v1");
});

test("ActionPlanEngine blocks plans when no positive monthly surplus exists", () => {
  const financialState = state({ income: 100_000, essential: 90_000, discretionary: 20_000 });
  const report = new ActionPlanEngine().evaluate({ recommendations: [cardRecommendation], assessments: [], financialState, currency: "INR" });

  assert.equal(report.plans[0].status, "BLOCKED");
  assert.match(report.plans[0].rationale[0], /No positive monthly surplus/);
});

test("ActionPlanEngine returns insufficient data instead of guessing an unsupported target", () => {
  const financialState = state();
  const unsupported = { ...emergencyRecommendation, id: "RECOMMENDATION_999", sourceFindingCode: "EMI_RATIO_HIGH", title: "Reduce EMI burden" };
  const report = new ActionPlanEngine().evaluate({ recommendations: [unsupported], assessments: [], financialState, currency: "INR" });

  assert.equal(report.plans[0].status, "INSUFFICIENT_DATA");
});

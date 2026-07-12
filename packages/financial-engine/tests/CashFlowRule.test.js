import assert from "node:assert/strict";
import test from "node:test";
import { CashFlowRule } from "../dist/index.js";

function state(cashFlow) {
  return { profile: { monthlyIncome: cashFlow.monthlyIncome, monthlyExpenses: 0, age: 32, retirementAge: 60, dependents: 0 }, assets: [], liabilities: [], goals: [], investments: [], cashFlow };
}

test("CashFlowRule scores a low savings rate and emits SAVINGS_RATE_LOW", () => {
  const assessment = new CashFlowRule().evaluate(state({ monthlyIncome: 100_000, monthlyEssentialExpenses: 75_000, monthlyDiscretionaryExpenses: 10_000 }));
  assert.equal(assessment.score, 7);
  assert.equal(assessment.maximumScore, 15);
  assert.equal(assessment.findings[0].code, "SAVINGS_RATE_LOW");
  assert.equal(assessment.metrics[4].value, 15);
});

test("CashFlowRule detects negative monthly cash flow", () => {
  const assessment = new CashFlowRule().evaluate(state({ monthlyIncome: 100_000, monthlyEssentialExpenses: 90_000, monthlyDiscretionaryExpenses: 20_000 }));
  assert.equal(assessment.score, 0);
  assert.equal(assessment.findings[0].code, "CASHFLOW_NEGATIVE");
});

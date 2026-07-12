import assert from "node:assert/strict";
import test from "node:test";
import { DebtRule, LiabilityType } from "../dist/index.js";

function state(liabilities) {
  return { profile: { monthlyIncome: 100_000, monthlyExpenses: 60_000, age: 32, retirementAge: 60, dependents: 0 }, assets: [], liabilities, goals: [], investments: [], cashFlow: { monthlyIncome: 100_000, monthlyEssentialExpenses: 50_000, monthlyDiscretionaryExpenses: 10_000 } };
}

test("DebtRule caps the score and finds credit-card debt", () => {
  const assessment = new DebtRule().evaluate(state([{ id: "card", type: LiabilityType.CREDIT_CARD, name: "Card", outstandingBalance: 75_000, emi: 5_000, interestRate: 36 }]));
  assert.equal(assessment.score, 8);
  assert.ok(assessment.findings.some((finding) => finding.code === "CREDIT_CARD_DEBT_PRESENT"));
  assert.ok(assessment.findings.some((finding) => finding.code === "UNSECURED_DEBT_HIGH"));
});

test("DebtRule reports a healthy position without high-interest debt", () => {
  const assessment = new DebtRule().evaluate(state([]));
  assert.equal(assessment.score, 20);
  assert.equal(assessment.findings[0].code, "DEBT_POSITION_HEALTHY");
});

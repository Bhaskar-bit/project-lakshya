import assert from "node:assert/strict";
import test from "node:test";
import {
  AssetType,
  FindingSeverity,
  HealthEngine,
  PillarType,
  RuleRegistry,
  SafetyRule,
} from "../dist/index.js";

const profile = {
  monthlyIncome: 200_000,
  monthlyExpenses: 80_000,
  age: 32,
  retirementAge: 60,
  dependents: 1,
};

function state(assets) {
  return {
    profile,
    assets,
    liabilities: [],
    goals: [],
    investments: [],
    cashFlow: { monthlyIncome: profile.monthlyIncome, monthlyExpenses: profile.monthlyExpenses },
  };
}

test("Emergency Fund reduces the safety score when coverage is below target", () => {
  const rule = new SafetyRule();
  const result = rule.evaluate(
    state([
      { id: "cash", type: AssetType.CASH, name: "Emergency cash", currentValue: 160_000 },
      { id: "equity", type: AssetType.STOCK, name: "Equity", currentValue: 900_000 },
    ]),
  );

  assert.equal(result.pillar, PillarType.SAFETY);
  assert.equal(result.score, 8);
  assert.equal(result.maximumScore, 25);
  assert.equal(result.reasons[0], "Emergency Fund covers 2 months.");
  assert.deepEqual(result.metrics[0], {
    name: "Emergency Fund Coverage",
    value: 2,
    target: 6,
    unit: "months",
  });
  assert.deepEqual(result.findings[0], {
    severity: FindingSeverity.HIGH,
    code: "EF_LOW",
    title: "Emergency Fund below recommended level",
    description: "Current coverage is 2 months. Target is 6 months.",
  });
});

test("Emergency Fund reaches the full safety score at six months of liquid coverage", () => {
  const result = new SafetyRule().evaluate(
    state([
      { id: "savings", type: AssetType.SAVINGS, name: "Savings", currentValue: 480_000 },
    ]),
  );

  assert.equal(result.score, 25);
  assert.equal(result.reasons[0], "Emergency Fund covers 6 months.");
  assert.equal(result.findings.length, 0);
});

test("HealthEngine aggregates rule results into an immutable versioned report", () => {
  const engine = new HealthEngine(
    new RuleRegistry("v1.0.0", [new SafetyRule()]),
    "v1.0.0",
    () => new Date("2026-07-12T00:00:00.000Z"),
  );
  const report = engine.evaluate(
    state([{ id: "cash", type: AssetType.CASH, name: "Cash", currentValue: 160_000 }]),
  );

  assert.equal(report.score, 32);
  assert.equal(report.pillars[0].score, 8);
  assert.equal(report.ruleResults[0].metrics[2].value, 160_000);
  assert.equal(report.ruleResults[0].metrics[3].value, 80_000);
  assert.equal(report.engineVersion, "v1.0.0");
  assert.equal(report.rulesVersion, "v1.0.0");
  assert.equal(report.generatedAt.toISOString(), "2026-07-12T00:00:00.000Z");
  assert.ok(Object.isFrozen(report));
  assert.ok(Object.isFrozen(report.ruleResults));
});

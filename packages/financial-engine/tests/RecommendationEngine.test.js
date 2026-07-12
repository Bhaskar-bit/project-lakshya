import assert from "node:assert/strict";
import test from "node:test";
import {
  EmergencyFundRecommendationRule,
  FindingSeverity,
  RecommendationEngine,
  RecommendationRegistry,
  Priority,
} from "../dist/index.js";

const finding = {
  severity: FindingSeverity.HIGH,
  code: "EF_LOW",
  version: "v1",
  since: new Date("2026-07-14T00:00:00.000Z"),
  title: "Emergency Fund below recommended level",
  description: "Current coverage is 2 months. Target is 6 months.",
};

test("RecommendationEngine generates an emergency-fund recommendation from EF_LOW", () => {
  const engine = new RecommendationEngine(
    new RecommendationRegistry("v1.0.0", [new EmergencyFundRecommendationRule()]),
    "v1.0.0",
    () => new Date("2026-07-14T01:00:00.000Z"),
  );

  const report = engine.evaluate([finding]);

  assert.deepEqual(report.recommendations, [
    {
      title: "Build Emergency Fund",
      description: "Build liquid savings toward the recommended emergency-fund level.",
      priority: Priority.HIGH,
      expectedScoreIncrease: 6,
      expectedCompletion: "4 months",
    },
  ]);
  assert.equal(report.rulesVersion, "v1.0.0");
  assert.ok(Object.isFrozen(report));
});

test("RecommendationEngine ignores findings without a matching recommendation rule", () => {
  const engine = new RecommendationEngine(new RecommendationRegistry("v1.0.0", []));

  const report = engine.evaluate([finding]);

  assert.deepEqual(report.recommendations, []);
});

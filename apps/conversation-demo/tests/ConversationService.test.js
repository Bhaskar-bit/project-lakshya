import assert from "node:assert/strict";
import test from "node:test";
import {
  AssetType,
  EmergencyFundRecommendationRule,
  HealthEngine,
  RecommendationEngine,
  RecommendationRegistry,
  RuleRegistry,
  SafetyRule,
} from "../../../packages/financial-engine/dist/index.js";
import { ConversationService } from "../src/ConversationService.js";
import { renderFinancialConversation } from "../src/renderFinancialConversation.js";

test("ConversationService produces a review from assessments and recommendations", () => {
  const service = new ConversationService(
    new HealthEngine(new RuleRegistry("v1", [new SafetyRule()])),
    new RecommendationEngine(
      new RecommendationRegistry("v1", [new EmergencyFundRecommendationRule()]),
    ),
  );
  const conversation = service.evaluate({
    profile: { monthlyIncome: 200_000, monthlyExpenses: 80_000, age: 32, retirementAge: 60, dependents: 1 },
    assets: [{ id: "cash", type: AssetType.CASH, name: "Cash", currentValue: 160_000 }],
    liabilities: [],
    goals: [],
    investments: [],
    cashFlow: { monthlyIncome: 200_000, monthlyEssentialExpenses: 60_000, monthlyDiscretionaryExpenses: 20_000 },
  });

  const review = renderFinancialConversation(conversation);

  assert.equal(conversation.topFinding.code, "EF_LOW");
  assert.equal(conversation.topRecommendation.title, "Build Emergency Fund");
  assert.equal(conversation.healthReport.coverage.status, "PARTIAL");
  assert.equal(conversation.healthReport.coverage.evaluatedWeight, 25);
  assert.match(review, /Assessment coverage: 25%/);
  assert.match(review, /Only the Safety pillar has been evaluated/);
  assert.match(review, /2\.0 months/);
  assert.match(review, /Estimated Completion/);
});

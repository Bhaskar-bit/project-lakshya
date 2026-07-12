import {
  AssetType,
  CashFlowRule,
  DebtRule,
  EmergencyFundRecommendationRule,
  HealthEngine,
  RecommendationEngine,
  RecommendationRegistry,
  RuleRegistry,
  SafetyRule,
} from "../../../packages/financial-engine/dist/index.js";
import { ConversationService } from "./ConversationService.js";
import { renderFinancialConversation } from "./renderFinancialConversation.js";

const healthEngine = new HealthEngine(
  new RuleRegistry("v1.0.0", [new SafetyRule(), new CashFlowRule(), new DebtRule()]),
  "v1.0.0",
);
const recommendationEngine = new RecommendationEngine(
  new RecommendationRegistry("v1.0.0", [new EmergencyFundRecommendationRule()]),
  "v1.0.0",
);
const lakshay = new ConversationService(healthEngine, recommendationEngine);

const financialState = {
  profile: {
    monthlyIncome: 200_000,
    monthlyExpenses: 80_000,
    age: 32,
    retirementAge: 60,
    dependents: 1,
  },
  assets: [
    { id: "cash", type: AssetType.CASH, name: "Cash", currentValue: 20_000 },
    { id: "savings", type: AssetType.SAVINGS, name: "Savings Account", currentValue: 90_000 },
    { id: "liquid-fund", type: AssetType.LIQUID_FUND, name: "Liquid Fund", currentValue: 50_000 },
  ],
  liabilities: [],
  goals: [],
  investments: [],
  cashFlow: { monthlyIncome: 200_000, monthlyEssentialExpenses: 60_000, monthlyDiscretionaryExpenses: 20_000 },
};

const conversation = lakshay.evaluate(financialState);
console.log(renderFinancialConversation(conversation));

import {
  AssetType,
  ActionPlanEngine,
  CashFlowRule,
  DebtRule,
  EmergencyFundRecommendationRule,
  CreditCardDebtRecommendationRule,
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
  new RecommendationRegistry("v1.0.0", [new CreditCardDebtRecommendationRule(), new EmergencyFundRecommendationRule()]),
  "v1.0.0",
);
const lakshay = new ConversationService(healthEngine, recommendationEngine, new ActionPlanEngine());

const financialState = {
  profile: {
    monthlyIncome: 150_000,
    monthlyExpenses: 100_000,
    age: 32,
    retirementAge: 60,
    dependents: 1,
  },
  assets: [
    { id: "cash", type: AssetType.CASH, name: "Cash", currentValue: 40_000 },
    { id: "savings", type: AssetType.SAVINGS, name: "Savings Account", currentValue: 190_000 },
    { id: "liquid-fund", type: AssetType.LIQUID_FUND, name: "Liquid Fund", currentValue: 100_000 },
  ],
  liabilities: [{ id: "card", type: 3, name: "Credit Card", outstandingBalance: 100_000, emi: 0, interestRate: 36 }],
  goals: [],
  investments: [],
  cashFlow: { monthlyIncome: 150_000, monthlyEssentialExpenses: 80_000, monthlyDiscretionaryExpenses: 20_000 },
};

const conversation = lakshay.evaluate(financialState);
console.log(renderFinancialConversation(conversation));

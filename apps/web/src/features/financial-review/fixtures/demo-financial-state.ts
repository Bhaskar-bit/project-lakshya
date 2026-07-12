import { AssetType, LiabilityType, type FinancialState } from "../../../../../../packages/financial-engine/dist/index.js";

export const demoFinancialState: FinancialState = {
  profile: { monthlyIncome: 150_000, monthlyExpenses: 100_000, age: 32, retirementAge: 60, dependents: 1 },
  assets: [
    { id: "cash", type: AssetType.CASH, name: "Cash", currentValue: 40_000 },
    { id: "savings", type: AssetType.SAVINGS, name: "Savings Account", currentValue: 190_000 },
    { id: "liquid-fund", type: AssetType.LIQUID_FUND, name: "Liquid Fund", currentValue: 100_000 },
  ],
  liabilities: [{ id: "card", type: LiabilityType.CREDIT_CARD, name: "Credit Card", outstandingBalance: 100_000, emi: 0, interestRate: 36 }],
  goals: [], investments: [],
  cashFlow: { monthlyIncome: 150_000, monthlyEssentialExpenses: 80_000, monthlyDiscretionaryExpenses: 20_000 },
};

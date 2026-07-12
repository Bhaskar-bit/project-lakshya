import { AssetType, LiabilityType, type FinancialState } from "../../../../../../packages/financial-engine/dist/index.js";

export interface FinancialAssessmentInput {
  readonly monthlyIncome: number;
  readonly essentialExpenses: number;
  readonly discretionaryExpenses: number;
  readonly totalMonthlyEmi: number;
  readonly creditCardOutstanding: number;
  readonly unsecuredDebtOutstanding: number;
  readonly savingsBalance: number;
  readonly cashBalance: number;
  readonly liquidFundBalance: number;
}

/** Converts user-entered facts into the engine's FinancialState contract. */
export function financialAssessmentInputToState(input: FinancialAssessmentInput): FinancialState {
  const assets = [
    { id: "cash", type: AssetType.CASH, name: "Cash", currentValue: input.cashBalance },
    { id: "savings", type: AssetType.SAVINGS, name: "Savings Account", currentValue: input.savingsBalance },
    { id: "liquid-fund", type: AssetType.LIQUID_FUND, name: "Liquid Fund", currentValue: input.liquidFundBalance },
  ];
  const liabilities = [
    ...(input.creditCardOutstanding > 0 ? [{ id: "credit-card", type: LiabilityType.CREDIT_CARD, name: "Credit Card", outstandingBalance: input.creditCardOutstanding, emi: 0, interestRate: 0 }] : []),
    ...(input.unsecuredDebtOutstanding > 0 || input.totalMonthlyEmi > 0 ? [{ id: "unsecured-debt", type: LiabilityType.PERSONAL_LOAN, name: "Unsecured Debt", outstandingBalance: input.unsecuredDebtOutstanding, emi: input.totalMonthlyEmi, interestRate: 0 }] : []),
  ];
  return {
    profile: { monthlyIncome: input.monthlyIncome, monthlyExpenses: input.essentialExpenses + input.discretionaryExpenses, age: 0, retirementAge: 0, dependents: 0 },
    assets, liabilities, goals: [], investments: [],
    cashFlow: { monthlyIncome: input.monthlyIncome, monthlyEssentialExpenses: input.essentialExpenses, monthlyDiscretionaryExpenses: input.discretionaryExpenses },
  };
}

export function validateFinancialAssessment(input: FinancialAssessmentInput): Partial<Record<keyof FinancialAssessmentInput, string>> {
  const errors: Partial<Record<keyof FinancialAssessmentInput, string>> = {};
  if (input.monthlyIncome <= 0) errors.monthlyIncome = "Monthly take-home income must be greater than zero.";
  for (const [key, value] of Object.entries(input) as [keyof FinancialAssessmentInput, number][]) {
    if (value < 0) errors[key] = "Enter zero or a positive amount.";
  }
  return errors;
}

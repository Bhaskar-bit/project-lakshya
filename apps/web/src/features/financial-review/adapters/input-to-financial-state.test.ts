import { expect, test } from "vitest";
import { financialAssessmentInputToState, validateFinancialAssessment } from "./input-to-financial-state";

const input = { monthlyIncome: 150_000, essentialExpenses: 80_000, discretionaryExpenses: 20_000, totalMonthlyEmi: 15_000, creditCardOutstanding: 100_000, unsecuredDebtOutstanding: 40_000, savingsBalance: 90_000, cashBalance: 20_000, liquidFundBalance: 50_000 };
test("maps assessment facts into FinancialState without producing findings or scores", () => { const state = financialAssessmentInputToState(input); expect(state.cashFlow.monthlyIncome).toBe(150_000); expect(state.assets).toHaveLength(3); expect(state.liabilities).toHaveLength(2); });
test("accepts negative cash flow and rejects invalid income or negative balances", () => { expect(validateFinancialAssessment({ ...input, essentialExpenses: 200_000 })).toEqual({}); expect(validateFinancialAssessment({ ...input, monthlyIncome: 0, cashBalance: -1 })).toMatchObject({ monthlyIncome: expect.any(String), cashBalance: expect.any(String) }); });

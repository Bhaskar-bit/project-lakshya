import { expect, test } from "vitest";
import { loadAssessment, saveAssessment } from "./assessment-storage";

const memory = () => { const values = new Map<string, string>(); return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } as unknown as Storage; };
test("persists and restores an assessment", () => { const storage = memory(); const input = { monthlyIncome: 1, essentialExpenses: 0, discretionaryExpenses: 0, totalMonthlyEmi: 0, creditCardOutstanding: 0, unsecuredDebtOutstanding: 0, savingsBalance: 0, cashBalance: 0, liquidFundBalance: 0 }; saveAssessment(input, storage); expect(loadAssessment(storage)).toEqual(input); });

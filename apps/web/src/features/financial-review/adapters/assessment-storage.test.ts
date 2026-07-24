import { expect, test } from "vitest";
import { clearAssessment, loadAssessment, saveAssessment } from "./assessment-storage";

function memory(initial?: Record<string, string>): Storage {
  const values = new Map(Object.entries(initial ?? {}));
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => [...values.keys()][index] ?? null,
    removeItem: (key: string) => { values.delete(key); },
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
}

const input = {
  monthlyIncome: 1,
  essentialExpenses: 0,
  discretionaryExpenses: 0,
  totalMonthlyEmi: 0,
  creditCardOutstanding: 0,
  unsecuredDebtOutstanding: 0,
  savingsBalance: 0,
  cashBalance: 0,
  liquidFundBalance: 0,
  otherEmergencyEligibleAssets: 0,
};

test("persists and restores a versioned assessment", () => {
  const storage = memory();
  const saved = saveAssessment(input, storage, () => new Date("2026-07-25T00:00:00.000Z"));
  expect(saved.schemaVersion).toBe("1");
  expect(loadAssessment(storage)).toEqual({ status: "VALID", assessment: saved });
});

test("reports corrupted and unsupported persisted assessments", () => {
  const corrupted = memory({ "lakshya.financial-assessment": "{invalid" });
  expect(loadAssessment(corrupted)).toEqual({ status: "CORRUPTED" });
  const unsupported = memory({
    "lakshya.financial-assessment": JSON.stringify({ schemaVersion: "2", savedAt: "now", input }),
  });
  expect(loadAssessment(unsupported)).toEqual({ status: "UNSUPPORTED_SCHEMA" });
});

test("clears assessment data and reports the missing state", () => {
  const storage = memory();
  saveAssessment(input, storage);
  clearAssessment(storage);
  expect(loadAssessment(storage)).toEqual({ status: "MISSING" });
});

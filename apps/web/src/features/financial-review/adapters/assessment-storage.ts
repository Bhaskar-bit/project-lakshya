import type { FinancialAssessmentInput } from "./input-to-financial-state";

const KEY = "lakshya.financial-assessment.v1";

export function saveAssessment(input: FinancialAssessmentInput, storage: Storage = sessionStorage): void { storage.setItem(KEY, JSON.stringify(input)); }
export function loadAssessment(storage: Storage = sessionStorage): FinancialAssessmentInput | null {
  const raw = storage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as FinancialAssessmentInput; } catch { return null; }
}

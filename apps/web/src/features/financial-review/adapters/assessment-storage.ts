import type { FinancialAssessmentInput } from "./input-to-financial-state";

const ASSESSMENT_KEY = "lakshya.financial-assessment";
const FEEDBACK_KEY = "lakshya.financial-feedback.v1";
export const ASSESSMENT_SCHEMA_VERSION = "1" as const;

export interface PersistedAssessment {
  readonly schemaVersion: typeof ASSESSMENT_SCHEMA_VERSION;
  readonly savedAt: string;
  readonly input: FinancialAssessmentInput;
}

export type AssessmentLoadResult =
  | { readonly status: "VALID"; readonly assessment: PersistedAssessment }
  | { readonly status: "MISSING" | "CORRUPTED" | "UNSUPPORTED_SCHEMA" };

export interface PersistedFeedback {
  readonly assessmentSavedAt: string;
  readonly useful: boolean;
  readonly reason?: string;
  readonly submittedAt: string;
}

export function saveAssessment(
  input: FinancialAssessmentInput,
  storage: Storage = sessionStorage,
  now: () => Date = () => new Date(),
): PersistedAssessment {
  const assessment = Object.freeze({
    schemaVersion: ASSESSMENT_SCHEMA_VERSION,
    savedAt: now().toISOString(),
    input: Object.freeze({ ...input }),
  });
  storage.setItem(ASSESSMENT_KEY, JSON.stringify(assessment));
  return assessment;
}

export function loadAssessment(storage: Storage = sessionStorage): AssessmentLoadResult {
  const raw = storage.getItem(ASSESSMENT_KEY);
  if (!raw) return { status: "MISSING" };
  try {
    const value = JSON.parse(raw) as Partial<PersistedAssessment>;
    if (value.schemaVersion !== ASSESSMENT_SCHEMA_VERSION) return { status: "UNSUPPORTED_SCHEMA" };
    if (!value.savedAt || !isFinancialAssessmentInput(value.input)) return { status: "CORRUPTED" };
    return { status: "VALID", assessment: value as PersistedAssessment };
  } catch {
    return { status: "CORRUPTED" };
  }
}

export function clearAssessment(storage: Storage = sessionStorage): void {
  storage.removeItem(ASSESSMENT_KEY);
}

export function saveFeedback(feedback: PersistedFeedback, storage: Storage = localStorage): void {
  const existing = loadFeedback(storage);
  storage.setItem(FEEDBACK_KEY, JSON.stringify([...existing, feedback]));
}

export function loadFeedback(storage: Storage = localStorage): readonly PersistedFeedback[] {
  const raw = storage.getItem(FEEDBACK_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isFinancialAssessmentInput(value: unknown): value is FinancialAssessmentInput {
  if (!value || typeof value !== "object") return false;
  const values = Object.values(value);
  return values.length === 10 && values.every((item) => typeof item === "number" && Number.isFinite(item));
}

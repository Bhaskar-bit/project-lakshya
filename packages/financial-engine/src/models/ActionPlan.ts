import type { Money } from "./Money.js";

export type ActionPlanStatus = "ACTIONABLE" | "BLOCKED" | "INSUFFICIENT_DATA";

/** An executable, deterministic plan derived from a ranked recommendation. */
export interface ActionPlan {
  readonly recommendationId: string;
  readonly title: string;
  readonly targetAmount: Money;
  readonly suggestedMonthlyAllocation: Money;
  readonly estimatedCompletionMonths: number;
  readonly expectedScoreImpact: number;
  readonly rationale: readonly string[];
  readonly dependencies: readonly string[];
  readonly sourceFindingCodes: readonly string[];
  readonly status: ActionPlanStatus;
}

import type { ActionPlan } from "./ActionPlan.js";

export interface ActionPlanReport {
  readonly plans: readonly ActionPlan[];
  readonly generatedAt: Date;
  readonly engineVersion: string;
  readonly policyVersion: string;
}

import type { Assessment } from "../models/Assessment.js";
import type { FinancialState } from "../models/FinancialState.js";

/** Strategy contract for one independently versioned health evaluation rule. */
export interface HealthRule {
  readonly id: string;
  readonly version: string;
  evaluate(state: FinancialState): Assessment;
}

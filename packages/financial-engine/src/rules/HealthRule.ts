import type { FinancialState } from "../models/FinancialState.js";
import type { RuleResult } from "../models/RuleResult.js";

/** Strategy contract for one independently versioned health evaluation rule. */
export interface HealthRule {
  readonly id: string;
  evaluate(state: FinancialState): RuleResult;
}

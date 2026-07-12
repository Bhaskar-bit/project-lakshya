import {
  EMERGENCY_FUND_TARGET_MONTHS,
  LIQUID_ASSET_TYPES,
  SAFETY_MAXIMUM_SCORE,
} from "../constants/safety.js";
import { type FinancialState } from "../models/FinancialState.js";
import { PillarType } from "../models/PillarScore.js";
import type { RuleResult } from "../models/RuleResult.js";
import type { HealthRule } from "./HealthRule.js";

/** Scores emergency-fund readiness from liquid assets and monthly expenses. */
export class SafetyRule implements HealthRule {
  public readonly id = "safety.emergency-fund.v1";

  public evaluate(state: FinancialState): RuleResult {
    const monthlyExpenses = state.profile.monthlyExpenses;
    const liquidAssets = state.assets
      .filter((asset) => LIQUID_ASSET_TYPES.includes(asset.type))
      .reduce((total, asset) => total + asset.currentValue, 0);

    const coverageMonths =
      monthlyExpenses > 0 ? liquidAssets / monthlyExpenses : EMERGENCY_FUND_TARGET_MONTHS;
    const score = Math.min(
      SAFETY_MAXIMUM_SCORE,
      Math.round((coverageMonths / EMERGENCY_FUND_TARGET_MONTHS) * SAFETY_MAXIMUM_SCORE),
    );

    return Object.freeze({
      ruleId: this.id,
      pillar: PillarType.SAFETY,
      score,
      maximumScore: SAFETY_MAXIMUM_SCORE,
      reason: `Emergency Fund covers ${formatMonths(coverageMonths)} months.`,
    });
  }
}

function formatMonths(months: number): string {
  return Number.isInteger(months) ? String(months) : months.toFixed(1);
}

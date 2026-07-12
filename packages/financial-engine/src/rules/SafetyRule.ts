import {
  EMERGENCY_FUND_TARGET_MONTHS,
  LIQUID_ASSET_TYPES,
  SAFETY_MAXIMUM_SCORE,
} from "../constants/safety.js";
import { type FinancialState } from "../models/FinancialState.js";
import { FindingSeverity, type Finding } from "../models/Finding.js";
import type { Metric } from "../models/Metric.js";
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

    const metrics: readonly Metric<number>[] = Object.freeze([
      Object.freeze({
        name: "Emergency Fund Coverage",
        value: coverageMonths,
        target: EMERGENCY_FUND_TARGET_MONTHS,
        unit: "months",
      }),
      Object.freeze({
        name: "Emergency Fund Completion",
        value: Math.min(100, Math.round((coverageMonths / EMERGENCY_FUND_TARGET_MONTHS) * 100)),
        target: 100,
        unit: "percent",
      }),
      Object.freeze({
        name: "Liquid Assets",
        value: liquidAssets,
        unit: "currency",
      }),
      Object.freeze({
        name: "Monthly Expenses",
        value: monthlyExpenses,
        unit: "currency",
      }),
    ]);
    const reason = `Emergency Fund covers ${formatMonths(coverageMonths)} months.`;
    const findings: readonly Finding[] =
      coverageMonths < EMERGENCY_FUND_TARGET_MONTHS
        ? Object.freeze([
            Object.freeze({
              severity: FindingSeverity.HIGH,
              code: "EF_LOW",
              title: "Emergency Fund below recommended level",
              description: `Current coverage is ${formatMonths(coverageMonths)} months. Target is ${EMERGENCY_FUND_TARGET_MONTHS} months.`,
            }),
          ])
        : Object.freeze([]);

    return Object.freeze({
      ruleId: this.id,
      pillar: PillarType.SAFETY,
      score,
      maximumScore: SAFETY_MAXIMUM_SCORE,
      metrics,
      reasons: Object.freeze([reason]),
      findings,
    });
  }
}

function formatMonths(months: number): string {
  return Number.isInteger(months) ? String(months) : months.toFixed(1);
}

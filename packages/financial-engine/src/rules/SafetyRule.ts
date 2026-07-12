import {
  EMERGENCY_FUND_TARGET_MONTHS,
  LIQUID_ASSET_TYPES,
  SAFETY_MAXIMUM_SCORE,
} from "../constants/safety.js";
import type { Assessment } from "../models/Assessment.js";
import type { Evidence } from "../models/Evidence.js";
import { type FinancialState } from "../models/FinancialState.js";
import { FindingSeverity, type Finding } from "../models/Finding.js";
import type { Metric } from "../models/Metric.js";
import { PillarType } from "../models/PillarScore.js";
import type { HealthRule } from "./HealthRule.js";

/** Scores emergency-fund readiness from liquid assets and monthly expenses. */
export class SafetyRule implements HealthRule {
  public readonly id = "SAFETY_001";
  public readonly version = "v1";

  public constructor(private readonly now: () => Date = () => new Date()) {}

  public evaluate(state: FinancialState): Assessment {
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
    const evidence: readonly Evidence[] = Object.freeze(
      state.assets
        .filter((asset) => LIQUID_ASSET_TYPES.includes(asset.type))
        .map((asset) =>
          Object.freeze({ label: asset.name, value: asset.currentValue, unit: "currency" }),
        ),
    );
    const findings: readonly Finding[] =
      coverageMonths < EMERGENCY_FUND_TARGET_MONTHS
        ? Object.freeze([
            Object.freeze({
              severity: FindingSeverity.HIGH,
              code: "EF_LOW",
              version: "v1",
              since: this.now(),
              title: "Emergency Fund below recommended level",
              description: `Current coverage is ${formatMonths(coverageMonths)} months. Target is ${EMERGENCY_FUND_TARGET_MONTHS} months.`,
            }),
          ])
        : Object.freeze([]);

    return Object.freeze({
      ruleId: this.id,
      version: this.version,
      pillar: PillarType.SAFETY,
      score,
      maximumScore: SAFETY_MAXIMUM_SCORE,
      metrics,
      reasons: Object.freeze([reason]),
      findings,
      evidence,
    });
  }
}

function formatMonths(months: number): string {
  return Number.isInteger(months) ? String(months) : months.toFixed(1);
}

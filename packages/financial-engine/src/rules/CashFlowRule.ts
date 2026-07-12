import type { Assessment } from "../models/Assessment.js";
import type { Evidence } from "../models/Evidence.js";
import { FindingSeverity, type Finding } from "../models/Finding.js";
import type { FinancialState } from "../models/FinancialState.js";
import type { Metric } from "../models/Metric.js";
import { PillarType } from "../models/PillarScore.js";
import { CashFlowScoringPolicy } from "../policies/CashFlowScoringPolicy.js";
import type { HealthRule } from "./HealthRule.js";

/** Evaluates the sustainability of monthly income, expenses, and savings. */
export class CashFlowRule implements HealthRule {
  public readonly id = "CASHFLOW_001";
  public readonly version = "v1";

  public constructor(
    private readonly policy: CashFlowScoringPolicy = new CashFlowScoringPolicy(),
    private readonly now: () => Date = () => new Date(),
  ) {}

  public evaluate(state: FinancialState): Assessment {
    const { monthlyIncome, monthlyEssentialExpenses, monthlyDiscretionaryExpenses } = state.cashFlow;
    const monthlyExpenses = monthlyEssentialExpenses + monthlyDiscretionaryExpenses;
    const monthlySurplus = monthlyIncome - monthlyExpenses;
    const savingsRatePercent = monthlyIncome > 0 ? (monthlySurplus / monthlyIncome) * 100 : 0;
    const score = this.policy.scoreFor(savingsRatePercent);
    const reason = `Monthly savings rate is ${formatPercent(savingsRatePercent)}.`;
    const findings = findingFor(monthlySurplus, savingsRatePercent, this.now());

    const metrics: readonly Metric<number>[] = Object.freeze([
      Object.freeze({ name: "Monthly Income", value: monthlyIncome, unit: "currency" }),
      Object.freeze({ name: "Monthly Essential Expenses", value: monthlyEssentialExpenses, unit: "currency" }),
      Object.freeze({ name: "Monthly Discretionary Expenses", value: monthlyDiscretionaryExpenses, unit: "currency" }),
      Object.freeze({ name: "Monthly Surplus", value: monthlySurplus, unit: "currency" }),
      Object.freeze({ name: "Savings Rate", value: savingsRatePercent, target: 20, unit: "percent" }),
    ]);
    const evidence: readonly Evidence[] = Object.freeze([
      Object.freeze({ label: "Monthly Income", value: monthlyIncome, unit: "currency" }),
      Object.freeze({ label: "Monthly Expenses", value: monthlyExpenses, unit: "currency" }),
    ]);

    return Object.freeze({
      ruleId: this.id,
      version: `${this.version}.${this.policy.version}`,
      pillar: PillarType.CASHFLOW,
      score,
      maximumScore: 15,
      metrics,
      reasons: Object.freeze([reason]),
      findings,
      evidence,
    });
  }
}

function findingFor(surplus: number, savingsRate: number, since: Date): readonly Finding[] {
  if (surplus < 0) {
    return Object.freeze([Object.freeze({
      severity: FindingSeverity.HIGH, code: "CASHFLOW_NEGATIVE", version: "v1", since,
      title: "Monthly cash flow is negative", description: "Monthly expenses exceed monthly income.",
    })]);
  }
  if (savingsRate < 20) {
    return Object.freeze([Object.freeze({
      severity: FindingSeverity.MEDIUM, code: "SAVINGS_RATE_LOW", version: "v1", since,
      title: "Savings rate below target", description: `Current savings rate is ${formatPercent(savingsRate)}. Target is 20%.`,
    })]);
  }
  return Object.freeze([Object.freeze({
    severity: FindingSeverity.LOW, code: "SAVINGS_RATE_HEALTHY", version: "v1", since,
    title: "Savings rate is healthy", description: `Current savings rate is ${formatPercent(savingsRate)}.`,
  })]);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

import type { Assessment } from "../models/Assessment.js";
import type { Evidence } from "../models/Evidence.js";
import { FindingSeverity, type Finding } from "../models/Finding.js";
import type { FinancialState } from "../models/FinancialState.js";
import { LiabilityType } from "../models/Liability.js";
import type { Metric } from "../models/Metric.js";
import { PillarType } from "../models/PillarScore.js";
import { DebtScoringPolicy } from "../policies/DebtScoringPolicy.js";
import type { HealthRule } from "./HealthRule.js";

/** Evaluates repayment burden and high-risk consumer debt. */
export class DebtRule implements HealthRule {
  public readonly id = "DEBT_001";
  public readonly version = "v1";

  public constructor(
    private readonly policy: DebtScoringPolicy = new DebtScoringPolicy(),
    private readonly now: () => Date = () => new Date(),
  ) {}

  public evaluate(state: FinancialState): Assessment {
    const totalMonthlyEmi = state.liabilities.reduce((total, liability) => total + liability.emi, 0);
    const creditCardOutstanding = state.liabilities
      .filter((liability) => liability.type === LiabilityType.CREDIT_CARD)
      .reduce((total, liability) => total + liability.outstandingBalance, 0);
    const unsecuredOutstanding = state.liabilities
      .filter((liability) => liability.type === LiabilityType.CREDIT_CARD || liability.type === LiabilityType.PERSONAL_LOAN)
      .reduce((total, liability) => total + liability.outstandingBalance, 0);
    const monthlyIncome = state.cashFlow.monthlyIncome;
    const emiToIncomeRatio = monthlyIncome > 0 ? totalMonthlyEmi / monthlyIncome : 0;
    const score = this.policy.scoreFor({ emiToIncomeRatio, creditCardOutstanding, unsecuredOutstanding });
    const findings = findingsFor({ creditCardOutstanding, emiToIncomeRatio, unsecuredOutstanding }, this.now());
    const metrics: readonly Metric<number>[] = Object.freeze([
      Object.freeze({ name: "Total Monthly EMI", value: totalMonthlyEmi, unit: "currency" }),
      Object.freeze({ name: "EMI to Income Ratio", value: emiToIncomeRatio * 100, target: 30, unit: "percent" }),
      Object.freeze({ name: "Credit Card Outstanding", value: creditCardOutstanding, unit: "currency" }),
      Object.freeze({ name: "Unsecured Debt Outstanding", value: unsecuredOutstanding, unit: "currency" }),
    ]);
    const evidence: readonly Evidence[] = Object.freeze(state.liabilities.map((liability) => Object.freeze({
      label: liability.name, value: liability.outstandingBalance, unit: "currency",
    })));

    return Object.freeze({
      ruleId: this.id, version: `${this.version}.${this.policy.version}`, pillar: PillarType.DEBT,
      score, maximumScore: 20, metrics,
      reasons: Object.freeze([`EMI-to-income ratio is ${(emiToIncomeRatio * 100).toFixed(1)}%.`]),
      findings, evidence,
    });
  }
}

function findingsFor(values: { creditCardOutstanding: number; emiToIncomeRatio: number; unsecuredOutstanding: number }, since: Date): readonly Finding[] {
  const findings: Finding[] = [];
  if (values.creditCardOutstanding > 0) findings.push({ severity: FindingSeverity.HIGH, code: "CREDIT_CARD_DEBT_PRESENT", version: "v1", since, title: "Credit-card revolving debt present", description: "Credit-card debt is reducing financial flexibility." });
  if (values.emiToIncomeRatio >= 0.4) findings.push({ severity: FindingSeverity.HIGH, code: "EMI_RATIO_HIGH", version: "v1", since, title: "EMI burden is high", description: `EMIs consume ${(values.emiToIncomeRatio * 100).toFixed(1)}% of monthly income.` });
  if (values.unsecuredOutstanding > 0) findings.push({ severity: FindingSeverity.MEDIUM, code: "UNSECURED_DEBT_HIGH", version: "v1", since, title: "Unsecured debt outstanding", description: "Unsecured debt should be reduced before lower-priority financial goals." });
  if (findings.length === 0) findings.push({ severity: FindingSeverity.LOW, code: "DEBT_POSITION_HEALTHY", version: "v1", since, title: "Debt position is healthy", description: "EMI burden and high-interest debt are within healthy limits." });
  return Object.freeze(findings.map((finding) => Object.freeze(finding)));
}

import type { ActionPlan } from "../models/ActionPlan.js";
import type { ActionPlanReport } from "../models/ActionPlanReport.js";
import type { Assessment } from "../models/Assessment.js";
import type { FinancialState } from "../models/FinancialState.js";
import { LiabilityType } from "../models/Liability.js";
import type { Money } from "../models/Money.js";
import type { Recommendation } from "../models/Recommendation.js";
import { SurplusAllocationPolicy } from "../policies/SurplusAllocationPolicy.js";

/** Converts already-ranked recommendations into executable, policy-driven plans. */
export class ActionPlanEngine {
  public constructor(
    private readonly allocationPolicy: SurplusAllocationPolicy = new SurplusAllocationPolicy(),
    private readonly engineVersion = "v1.0.0",
    private readonly now: () => Date = () => new Date(),
  ) {}

  public evaluate(input: {
    readonly recommendations: readonly Recommendation[];
    readonly assessments: readonly Assessment[];
    readonly financialState: FinancialState;
    readonly currency: string;
  }): ActionPlanReport {
    const monthlySurplus = input.financialState.cashFlow.monthlyIncome
      - input.financialState.cashFlow.monthlyEssentialExpenses
      - input.financialState.cashFlow.monthlyDiscretionaryExpenses;
    const allocations = this.allocationPolicy.allocate({ monthlySurplus, recommendations: input.recommendations, financialState: input.financialState });
    const plans = input.recommendations.map((recommendation) => this.planFor(recommendation, input.assessments, input.financialState, input.currency, monthlySurplus, allocations));
    return Object.freeze({ plans: Object.freeze(plans), generatedAt: this.now(), engineVersion: this.engineVersion, policyVersion: this.allocationPolicy.version });
  }

  private planFor(recommendation: Recommendation, assessments: readonly Assessment[], state: FinancialState, currency: string, monthlySurplus: number, allocations: readonly { recommendationId: string; monthlyAmount: number; startsAfterRecommendationId?: string }[]): ActionPlan {
    const allocation = allocations.find((item) => item.recommendationId === recommendation.id);
    const target = targetFor(recommendation, assessments, state);
    const money = (amount: number): Money => Object.freeze({ amount, currency });
    if (target === null) return blockedPlan(recommendation, money(0), "Required target data is unavailable.", "INSUFFICIENT_DATA");
    if (target <= 0) return blockedPlan(recommendation, money(0), "The recommendation target is already complete.", "BLOCKED");
    if (monthlySurplus <= 0) return blockedPlan(recommendation, money(target), "No positive monthly surplus is available for this action.", "BLOCKED");
    const plannedAllocation = allocation?.monthlyAmount ?? 0;
    if (plannedAllocation <= 0) return Object.freeze({ recommendationId: recommendation.id, title: recommendation.title, targetAmount: money(target), suggestedMonthlyAllocation: money(0), estimatedCompletionMonths: 0, expectedScoreImpact: recommendation.expectedScoreIncrease, rationale: Object.freeze(["Higher-ranked actions use the available monthly surplus first."]), dependencies: Object.freeze(allocation?.startsAfterRecommendationId ? [allocation.startsAfterRecommendationId] : []), sourceFindingCodes: Object.freeze([recommendation.sourceFindingCode]), status: "BLOCKED" });
    const creditCard = state.liabilities.find((liability) => liability.type === LiabilityType.CREDIT_CARD);
    if (recommendation.sourceFindingCode === "CREDIT_CARD_DEBT_PRESENT" && creditCard && creditCard.emi > plannedAllocation) return blockedPlan(recommendation, money(target), "Available surplus is below the minimum credit-card payment.", "BLOCKED");
    return Object.freeze({ recommendationId: recommendation.id, title: recommendation.title, targetAmount: money(target), suggestedMonthlyAllocation: money(plannedAllocation), estimatedCompletionMonths: Math.ceil(target / plannedAllocation), expectedScoreImpact: recommendation.expectedScoreIncrease, rationale: Object.freeze([recommendation.description, `Allocated according to SurplusAllocationPolicy ${this.allocationPolicy.version}.`]), dependencies: Object.freeze([]), sourceFindingCodes: Object.freeze([recommendation.sourceFindingCode]), status: "ACTIONABLE" });
  }
}

function targetFor(recommendation: Recommendation, assessments: readonly Assessment[], state: FinancialState): number | null {
  if (recommendation.sourceFindingCode === "CREDIT_CARD_DEBT_PRESENT") return state.liabilities.filter((liability) => liability.type === LiabilityType.CREDIT_CARD).reduce((total, liability) => total + liability.outstandingBalance, 0);
  if (recommendation.sourceFindingCode === "EF_LOW") {
    const safety = assessments.find((assessment) => assessment.ruleId === "SAFETY_001");
    const coverage = safety?.metrics.find((metric) => metric.name === "Emergency Fund Coverage");
    const expenses = safety?.metrics.find((metric) => metric.name === "Monthly Expenses");
    if (typeof coverage?.target !== "number" || typeof coverage.value !== "number" || typeof expenses?.value !== "number") return null;
    return Math.max(0, (coverage.target - coverage.value) * expenses.value);
  }
  return null;
}

function blockedPlan(recommendation: Recommendation, targetAmount: Money, rationale: string, status: "BLOCKED" | "INSUFFICIENT_DATA"): ActionPlan {
  return Object.freeze({ recommendationId: recommendation.id, title: recommendation.title, targetAmount, suggestedMonthlyAllocation: Object.freeze({ amount: 0, currency: targetAmount.currency }), estimatedCompletionMonths: 0, expectedScoreImpact: recommendation.expectedScoreIncrease, rationale: Object.freeze([rationale]), dependencies: Object.freeze([]), sourceFindingCodes: Object.freeze([recommendation.sourceFindingCode]), status });
}

import { HealthGrade, type PillarType } from "../../../../../../packages/financial-engine/dist/index.js";
import { ConversationService, type FinancialConversation } from "../../../application/ConversationService";
import type { FinancialState } from "../../../../../../packages/financial-engine/dist/index.js";

export interface ActionViewModel {
  readonly title: string;
  readonly status: string;
  readonly primaryLabel: string;
  readonly primaryValue: string;
  readonly allocationLabel: string;
  readonly allocationValue: string;
  readonly completionLabel: string;
  readonly completionValue: string;
  readonly impactLabel: string;
  readonly impactValue: string;
  readonly explanation?: string;
}

export interface FindingViewModel {
  readonly status: string;
  readonly title: string;
  readonly fact: string;
  readonly sourcePillar: string;
  readonly scoreImpact: string;
}

export interface FinancialReviewViewModel {
  readonly score: number;
  readonly grade: string;
  readonly assessmentCoverage: number;
  readonly coverageLabel: string;
  readonly isPartial: boolean;
  readonly topRecommendationCode?: string;
  readonly actionPlanStatus?: string;
  readonly topAction?: ActionViewModel;
  readonly subsequentActions: readonly ActionViewModel[];
  readonly findings: readonly FindingViewModel[];
  readonly assessmentDetails: readonly {
    readonly pillar: string;
    readonly score: string;
    readonly ruleId: string;
    readonly version: string;
    readonly reasons: readonly string[];
    readonly metrics: readonly { name: string; value: string }[];
    readonly evidence: readonly string[];
    readonly findings: readonly string[];
  }[];
}

const conversationService = new ConversationService();

export function createFinancialReviewViewModel(financialState: FinancialState): FinancialReviewViewModel {
  return conversationToViewModel(conversationService.evaluate(financialState));
}

/** UI boundary: domain objects are converted once before React consumes them. */
export function conversationToViewModel(conversation: FinancialConversation): FinancialReviewViewModel {
  const { healthReport: health, recommendationReport, actionPlanReport } = conversation;
  const plans = actionPlanReport.plans;
  const planToView = (plan: typeof plans[number]): ActionViewModel => ({
    title: plan.title,
    status: plan.status,
    primaryLabel: plan.sourceFindingCodes.includes("CREDIT_CARD_DEBT_PRESENT") ? "Outstanding" : "Target gap",
    primaryValue: money(plan.targetAmount.amount),
    allocationLabel: "Monthly allocation",
    allocationValue: `${money(plan.suggestedMonthlyAllocation.amount)}/month`,
    completionLabel: "Time required",
    completionValue: plan.status === "ACTIONABLE" ? `${plan.estimatedCompletionMonths} months` : "Not currently available",
    impactLabel: "Health impact",
    impactValue: `+${plan.expectedScoreImpact} points`,
    explanation: plan.status === "BLOCKED" || plan.status === "INSUFFICIENT_DATA"
      ? humanizeBlockedPlan(plan.rationale[0], plan.dependencies.length > 0)
      : undefined,
  });
  const assessmentCoverage = Math.round(
    (health.coverage.evaluatedWeight / health.coverage.totalSupportedWeight) * 100,
  );
  return {
    score: health.score,
    grade: HealthGrade[health.grade],
    assessmentCoverage,
    isPartial: health.coverage.status === "PARTIAL",
    coverageLabel: `${assessmentCoverage}% · ${health.coverage.evaluatedPillars.length} supported pillars evaluated`,
    topRecommendationCode: recommendationReport.recommendations[0]?.sourceFindingCode,
    actionPlanStatus: plans[0]?.status,
    topAction: plans[0] ? planToView(plans[0]) : undefined,
    subsequentActions: plans.slice(1).map(planToView),
    findings: health.assessments.flatMap((assessment) =>
      assessment.findings.map((finding) => ({
        status: finding.severity === 0 ? "Needs attention" : finding.severity === 1 ? "Monitor" : "Healthy",
        title: finding.title,
        fact: finding.description,
        sourcePillar: pillarLabel(assessment.pillar),
        scoreImpact: `Score: ${assessment.score}/${assessment.maximumScore}`,
      })),
    ),
    assessmentDetails: health.assessments.map((assessment) => ({
      pillar: pillarLabel(assessment.pillar),
      score: `${assessment.score}/${assessment.maximumScore}`,
      ruleId: assessment.ruleId,
      version: assessment.version,
      reasons: assessment.reasons,
      metrics: assessment.metrics.map((metric) => ({
        name: metric.name,
        value: metric.unit === "currency"
          ? money(Number(metric.value))
          : `${Number(metric.value).toFixed(1)} ${metric.unit}`,
      })),
      evidence: assessment.evidence.map((item) => `${item.label}: ${money(item.value)}`),
      findings: assessment.findings.map((finding) => finding.title),
    })),
  };
}

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function pillarLabel(value: PillarType): string {
  return ["Safety", "Growth", "Debt", "Goals", "Cash Flow", "Protection"][value] ?? "Unknown";
}

function humanizeBlockedPlan(rationale: string, hasDependency: boolean): string {
  if (hasDependency) return "This action starts after the higher-priority action is complete.";
  if (rationale.includes("No positive monthly surplus")) return "No monthly surplus is currently available for this action.";
  if (rationale.includes("unavailable")) return "More information is needed before an allocation can be calculated.";
  return rationale;
}

import {
  ActionPlanEngine, CashFlowRule, CreditCardDebtRecommendationRule, DebtRule,
  EmergencyFundRecommendationRule, HealthEngine, HealthGrade, RecommendationEngine,
  RecommendationRegistry, RuleRegistry, SafetyRule, type FinancialState,
} from "../../../../../../packages/financial-engine/dist/index.js";

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
  readonly coverageLabel: string;
  readonly isPartial: boolean;
  readonly topAction?: ActionViewModel;
  readonly subsequentActions: readonly ActionViewModel[];
  readonly findings: readonly FindingViewModel[];
  readonly assessmentDetails: readonly { pillar: string; score: string; reasons: readonly string[]; metrics: readonly { name: string; value: string }[]; evidence: readonly string[]; findings: readonly string[] }[];
}

/** Application boundary: executes the real domain pipeline then adapts it for React. */
export function createFinancialReviewViewModel(financialState: FinancialState): FinancialReviewViewModel {
  const health = new HealthEngine(new RuleRegistry("v1.0.0", [new SafetyRule(), new CashFlowRule(), new DebtRule()])).evaluate(financialState);
  const findings = health.assessments.flatMap((assessment) => assessment.findings);
  const recommendations = new RecommendationEngine(new RecommendationRegistry("v1.0.0", [new CreditCardDebtRecommendationRule(), new EmergencyFundRecommendationRule()])).evaluate(findings).recommendations;
  const plans = new ActionPlanEngine().evaluate({ recommendations, assessments: health.assessments, financialState, currency: "INR" }).plans;
  const planToView = (plan: typeof plans[number]): ActionViewModel => ({
    title: plan.title, status: plan.status,
    primaryLabel: plan.sourceFindingCodes.includes("CREDIT_CARD_DEBT_PRESENT") ? "Outstanding" : "Target gap",
    primaryValue: money(plan.targetAmount.amount), allocationLabel: "Monthly allocation", allocationValue: `${money(plan.suggestedMonthlyAllocation.amount)}/month`,
    completionLabel: "Time required", completionValue: plan.status === "ACTIONABLE" ? `${plan.estimatedCompletionMonths} months` : "Not currently available",
    impactLabel: "Health impact", impactValue: `+${plan.expectedScoreImpact} points`, explanation: plan.status === "BLOCKED" || plan.status === "INSUFFICIENT_DATA" ? plan.rationale[0] : undefined,
  });
  return {
    score: health.score, grade: HealthGrade[health.grade], isPartial: health.coverage.status === "PARTIAL",
    coverageLabel: `${Math.round((health.coverage.evaluatedWeight / health.coverage.totalSupportedWeight) * 100)}% · ${health.coverage.evaluatedPillars.length} of ${health.coverage.evaluatedPillars.length + health.coverage.missingPillars.length} supported pillars evaluated`,
    topAction: plans[0] ? planToView(plans[0]) : undefined, subsequentActions: plans.slice(1).map(planToView),
    findings: health.assessments.flatMap((assessment) => assessment.findings.map((finding) => ({ status: finding.severity === 0 ? "Needs attention" : finding.severity === 1 ? "Monitor" : "Healthy", title: finding.title, fact: finding.description, sourcePillar: label(assessment.pillar), scoreImpact: `Score: ${assessment.score}/${assessment.maximumScore}` }))),
    assessmentDetails: health.assessments.map((assessment) => ({ pillar: label(assessment.pillar), score: `${assessment.score}/${assessment.maximumScore}`, reasons: assessment.reasons, metrics: assessment.metrics.map((metric) => ({ name: metric.name, value: metric.unit === "currency" ? money(Number(metric.value)) : `${Number(metric.value).toFixed(1)} ${metric.unit}` })), evidence: assessment.evidence.map((item) => `${item.label}: ${money(item.value)}`), findings: assessment.findings.map((finding) => finding.title) })),
  };
}

function money(value: number): string { return `₹${value.toLocaleString("en-IN")}`; }
function label(value: number): string { return ["Safety", "Growth", "Debt", "Goals", "Cash Flow", "Protection"][value] ?? "Unknown"; }

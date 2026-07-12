const WIDTH = 50;

/** Renders a FinancialConversation as a terminal-friendly financial review. */
export function renderFinancialConversation(conversation) {
  const { healthReport, topFinding, topRecommendation, topActionPlan, actionPlanReport } = conversation;
  const coverage = healthReport.assessments
    .flatMap((assessment) => assessment.metrics)
    .find((metric) => metric.name === "Emergency Fund Coverage");

  const lines = [
    "=".repeat(WIDTH),
    "Lakshay Financial Review",
    "=".repeat(WIDTH),
    "",
    healthReport.coverage.status === "PARTIAL" ? "Preliminary Financial Health" : "Overall Financial Health",
    "",
    `${healthReport.score} / 100 (${HealthGrade[healthReport.grade]})`,
    "",
    `Assessment coverage: ${Math.round((healthReport.coverage.evaluatedWeight / healthReport.coverage.totalSupportedWeight) * 100)}%`,
    coverageSummary(healthReport.coverage.evaluatedPillars),
    "",
    "Summary",
    "",
    summaryFor(topFinding),
    "",
    "-".repeat(WIDTH),
    "",
  ];

  if (topRecommendation && topActionPlan && coverage) {
    lines.push("Top Priority", "", topActionPlan.title, "");
    if (topActionPlan.sourceFindingCodes.includes("CREDIT_CARD_DEBT_PRESENT")) {
      lines.push("Outstanding", "", formatMoney(topActionPlan.targetAmount.amount), "", "Allocate", "", `${formatMoney(topActionPlan.suggestedMonthlyAllocation.amount)}/month`, "");
    } else {
      lines.push("Current Coverage", "", `${coverage.value.toFixed(1)} months`, "", "Recommended", "", `${coverage.target.toFixed(1)} months`, "");
    }
    lines.push("Health Improvement", "", `+${topActionPlan.expectedScoreImpact}`, "", "Estimated Completion", "", `${topActionPlan.estimatedCompletionMonths} months`, "", "-".repeat(WIDTH), "", nextActionLine(actionPlanReport.plans.slice(1), actionPlanReport.plans));
  } else {
    lines.push("No high-priority actions detected.");
  }

  lines.push("", "=".repeat(WIDTH));
  return lines.join("\n");
}

function formatMoney(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function summaryFor(finding) {
  if (!finding) return "Your financial review has no high-priority findings.";
  if (finding.code === "EF_LOW") {
    return "Your Emergency Fund is significantly below the recommended level.";
  }
  return finding.description;
}

function coverageSummary(evaluatedPillars) {
  if (evaluatedPillars.length === 1) return "Only the Safety pillar has been evaluated.";
  return `${evaluatedPillars.length} of 6 financial-health pillars have been evaluated.`;
}

function nextActionLine(plans, allPlans) {
  const next = plans[0];
  if (!next) return "No other high-priority actions detected.";
  if (next.status === "BLOCKED" && next.dependencies.length > 0) {
    const dependency = allPlans.find((plan) => plan.recommendationId === next.dependencies[0]);
    return `Next Action: ${next.title} starts after ${dependency?.title ?? next.dependencies[0]}.`;
  }
  return `Next Action: ${next.title}.`;
}
import { HealthGrade } from "../../../packages/financial-engine/dist/index.js";

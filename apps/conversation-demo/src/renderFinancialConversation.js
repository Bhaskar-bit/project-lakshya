const WIDTH = 50;

/** Renders a FinancialConversation as a terminal-friendly financial review. */
export function renderFinancialConversation(conversation) {
  const { healthReport, topFinding, topRecommendation } = conversation;
  const coverage = healthReport.assessments
    .flatMap((assessment) => assessment.metrics)
    .find((metric) => metric.name === "Emergency Fund Coverage");

  const lines = [
    "=".repeat(WIDTH),
    "Lakshay Financial Review",
    "=".repeat(WIDTH),
    "",
    "Overall Financial Health",
    "",
    `${healthReport.score} / 100 (${HealthGrade[healthReport.grade]})`,
    "",
    "Summary",
    "",
    summaryFor(topFinding),
    "",
    "-".repeat(WIDTH),
    "",
  ];

  if (topRecommendation && coverage) {
    lines.push(
      "Top Priority",
      "",
      topRecommendation.title,
      "",
      "Current Coverage",
      "",
      `${coverage.value.toFixed(1)} months`,
      "",
      "Recommended",
      "",
      `${coverage.target.toFixed(1)} months`,
      "",
      "Health Improvement",
      "",
      `+${topRecommendation.expectedScoreIncrease}`,
      "",
      "Estimated Completion",
      "",
      topRecommendation.expectedCompletion,
      "",
      "-".repeat(WIDTH),
      "",
      "No other high-priority actions detected.",
    );
  } else {
    lines.push("No high-priority actions detected.");
  }

  lines.push("", "=".repeat(WIDTH));
  return lines.join("\n");
}

function summaryFor(finding) {
  if (!finding) return "Your financial review has no high-priority findings.";
  if (finding.code === "EF_LOW") {
    return "Your Emergency Fund is significantly below the recommended level.";
  }
  return finding.description;
}
import { HealthGrade } from "../../../packages/financial-engine/dist/index.js";

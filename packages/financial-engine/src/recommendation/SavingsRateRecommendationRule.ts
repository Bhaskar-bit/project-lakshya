import { Priority, type Recommendation } from "../models/Recommendation.js";
import type { Finding } from "../models/Finding.js";
import type { RecommendationRule } from "./RecommendationRule.js";

export class SavingsRateRecommendationRule implements RecommendationRule {
  public readonly id = "RECOMMENDATION_004";
  public readonly version = "v1";
  public matches(finding: Finding): boolean { return (finding.code === "SAVINGS_RATE_LOW" || finding.code === "CASHFLOW_NEGATIVE") && finding.version === "v1"; }
  public create(finding: Finding): Recommendation {
    return Object.freeze({ id: this.id, title: "Increase monthly savings surplus", description: "Increase the monthly surplus available for financial goals and resilience.", priority: Priority.MEDIUM, expectedScoreIncrease: 3, sourceFindingCode: finding.code, sourceFindingVersion: finding.version, measurableTarget: "Savings rate of at least 20%" });
  }
}

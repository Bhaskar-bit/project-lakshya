import { Priority, type Recommendation } from "../models/Recommendation.js";
import type { Finding } from "../models/Finding.js";
import type { RecommendationRule } from "./RecommendationRule.js";

export class EmiBurdenRecommendationRule implements RecommendationRule {
  public readonly id = "RECOMMENDATION_003";
  public readonly version = "v1";
  public matches(finding: Finding): boolean { return finding.code === "EMI_RATIO_HIGH" && finding.version === "v1"; }
  public create(finding: Finding): Recommendation {
    return Object.freeze({ id: this.id, title: "Reduce EMI burden", description: "Lower recurring debt repayments to improve cash-flow resilience.", priority: Priority.HIGH, expectedScoreIncrease: 5, sourceFindingCode: finding.code, sourceFindingVersion: finding.version, measurableTarget: "EMI-to-income ratio below 30%" });
  }
}

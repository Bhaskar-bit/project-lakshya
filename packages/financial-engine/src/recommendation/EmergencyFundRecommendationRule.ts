import { Priority, type Recommendation } from "../models/Recommendation.js";
import type { Finding } from "../models/Finding.js";
import type { RecommendationRule } from "./RecommendationRule.js";

/** Deterministic response to the stable EF_LOW finding contract. */
export class EmergencyFundRecommendationRule implements RecommendationRule {
  public readonly id = "RECOMMENDATION_001";
  public readonly version = "v1";

  public matches(finding: Finding): boolean {
    return finding.code === "EF_LOW" && finding.version === "v1";
  }

  public create(_finding: Finding): Recommendation {
    return Object.freeze({
      id: this.id,
      title: "Build Emergency Fund",
      description: "Build liquid savings toward the recommended emergency-fund level.",
      priority: Priority.HIGH,
      expectedScoreIncrease: 6,
      sourceFindingCode: _finding.code,
      sourceFindingVersion: _finding.version,
      measurableTarget: "Emergency Fund coverage of 6 months",
      expectedCompletion: "4 months",
    });
  }
}

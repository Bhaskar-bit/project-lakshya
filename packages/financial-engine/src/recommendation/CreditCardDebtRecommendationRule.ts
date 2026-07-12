import { Priority, type Recommendation } from "../models/Recommendation.js";
import type { Finding } from "../models/Finding.js";
import type { RecommendationRule } from "./RecommendationRule.js";

export class CreditCardDebtRecommendationRule implements RecommendationRule {
  public readonly id = "RECOMMENDATION_002";
  public readonly version = "v1";
  public matches(finding: Finding): boolean { return finding.code === "CREDIT_CARD_DEBT_PRESENT" && finding.version === "v1"; }
  public create(finding: Finding): Recommendation {
    return Object.freeze({ id: this.id, title: "Pay off credit-card debt", description: "Eliminate revolving credit-card debt to restore financial flexibility.", priority: Priority.HIGH, expectedScoreIncrease: 8, sourceFindingCode: finding.code, sourceFindingVersion: finding.version, measurableTarget: "Credit-card outstanding of 0" });
  }
}

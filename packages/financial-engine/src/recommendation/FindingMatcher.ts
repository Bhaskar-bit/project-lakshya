import type { Finding } from "../models/Finding.js";
import type { Recommendation } from "../models/Recommendation.js";
import type { RecommendationRule } from "./RecommendationRule.js";

/** Matches findings to recommendation rules without knowing assessment rules. */
export class FindingMatcher {
  public constructor(private readonly rules: readonly RecommendationRule[]) {}

  public recommendationsFor(findings: readonly Finding[]): readonly Recommendation[] {
    return Object.freeze(
      findings.flatMap((finding) =>
        this.rules.filter((rule) => rule.matches(finding)).map((rule) => rule.create(finding)),
      ),
    );
  }
}

import type { RecommendationRule } from "./RecommendationRule.js";

/** Versioned collection of rules used to interpret findings as recommendations. */
export class RecommendationRegistry {
  public readonly rules: readonly RecommendationRule[];

  public constructor(
    public readonly version: string,
    rules: readonly RecommendationRule[],
  ) {
    this.rules = Object.freeze([...rules]);
  }
}

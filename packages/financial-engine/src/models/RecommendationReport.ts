import type { Recommendation } from "./Recommendation.js";

/** Immutable output of deterministic recommendation evaluation. */
export interface RecommendationReport {
  readonly recommendations: readonly Recommendation[];
  readonly generatedAt: Date;
  readonly engineVersion: string;
  readonly rulesVersion: string;
}

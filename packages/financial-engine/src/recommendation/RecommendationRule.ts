import type { Finding } from "../models/Finding.js";
import type { Recommendation } from "../models/Recommendation.js";

/** Strategy that translates a finding into a deterministic recommendation. */
export interface RecommendationRule {
  readonly id: string;
  readonly version: string;
  matches(finding: Finding): boolean;
  create(finding: Finding): Recommendation;
}

import type { Recommendation } from "./Recommendation.js";
import type { PillarScore } from "./PillarScore.js";

export enum HealthGrade {
  EXCELLENT,
  GOOD,
  FAIR,
  POOR,
  CRITICAL,
}

/** The derived assessment of a user's overall financial position. */
export interface FinancialHealth {
  score: number;
  grade: HealthGrade;
  pillars: PillarScore[];
  recommendations: Recommendation[];
}

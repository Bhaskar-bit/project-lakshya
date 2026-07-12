import type { Recommendation } from "./Recommendation.js";
import type { PillarScore } from "./PillarScore.js";
import type { Assessment } from "./Assessment.js";

export enum HealthGrade {
  EXCELLENT,
  GOOD,
  FAIR,
  POOR,
  CRITICAL,
}

/** Immutable audit report produced by a HealthEngine evaluation. */
export interface HealthReport {
  readonly score: number;
  readonly grade: HealthGrade;
  readonly pillars: readonly PillarScore[];
  readonly assessments: readonly Assessment[];
  readonly recommendations: readonly Recommendation[];
  readonly generatedAt: Date;
  readonly engineVersion: string;
  readonly rulesVersion: string;
}

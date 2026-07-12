import type { PillarType } from "./PillarScore.js";

export type AssessmentStatus = "PARTIAL" | "COMPLETE";

/** Declares which supported health dimensions contributed to a report. */
export interface AssessmentCoverage {
  readonly evaluatedWeight: number;
  readonly totalSupportedWeight: number;
  readonly evaluatedPillars: readonly PillarType[];
  readonly missingPillars: readonly PillarType[];
  readonly status: AssessmentStatus;
}

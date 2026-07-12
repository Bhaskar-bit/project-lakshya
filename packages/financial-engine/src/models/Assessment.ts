import type { Evidence } from "./Evidence.js";
import type { Finding } from "./Finding.js";
import type { Metric } from "./Metric.js";
import type { PillarType } from "./PillarScore.js";

/** Immutable, explainable evaluation of one stable business rule. */
export interface Assessment {
  readonly ruleId: string;
  readonly version: string;
  readonly pillar: PillarType;
  readonly score: number;
  readonly maximumScore: number;
  readonly metrics: readonly Metric<unknown>[];
  readonly reasons: readonly string[];
  readonly findings: readonly Finding[];
  readonly evidence: readonly Evidence[];
}

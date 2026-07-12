import type { Finding } from "./Finding.js";
import type { Metric } from "./Metric.js";
import type { PillarType } from "./PillarScore.js";

/** Immutable, explainable outcome returned by one health rule. */
export interface RuleResult {
  readonly ruleId: string;
  readonly pillar: PillarType;
  readonly score: number;
  readonly maximumScore: number;
  readonly metrics: readonly Metric<unknown>[];
  readonly reasons: readonly string[];
  readonly findings: readonly Finding[];
}

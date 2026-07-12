import type { PillarType } from "./PillarScore.js";

/** Immutable, explainable outcome returned by one health rule. */
export interface RuleResult {
  readonly ruleId: string;
  readonly pillar: PillarType;
  readonly score: number;
  readonly maximumScore: number;
  readonly reason: string;
}

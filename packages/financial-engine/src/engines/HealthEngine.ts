import type { FinancialState } from "../models/FinancialState.js";
import { HealthGrade, type HealthReport } from "../models/HealthReport.js";
import type { PillarScore } from "../models/PillarScore.js";
import { RuleRegistry } from "./RuleRegistry.js";

/** Orchestrates independently evaluated health rules into an audit report. */
export class HealthEngine {
  public constructor(
    private readonly registry: RuleRegistry,
    private readonly engineVersion = "v1.0.0",
    private readonly now: () => Date = () => new Date(),
  ) {}

  public evaluate(state: FinancialState): HealthReport {
    const results = this.registry.rules.map((rule) => rule.evaluate(state));
    const pillars: readonly PillarScore[] = Object.freeze(
      results.map((result) =>
        Object.freeze({
          type: result.pillar,
          score: result.score,
          maximumScore: result.maximumScore,
          reason: result.reason,
        }),
      ),
    );
    const totalScore = results.reduce((total, result) => total + result.score, 0);
    const totalMaximumScore = results.reduce(
      (total, result) => total + result.maximumScore,
      0,
    );
    const score = totalMaximumScore === 0 ? 0 : Math.round((totalScore / totalMaximumScore) * 100);

    return Object.freeze({
      score,
      grade: gradeFor(score),
      pillars,
      recommendations: Object.freeze([]),
      generatedAt: this.now(),
      engineVersion: this.engineVersion,
      rulesVersion: this.registry.version,
    });
  }
}

function gradeFor(score: number): HealthGrade {
  if (score >= 80) return HealthGrade.EXCELLENT;
  if (score >= 60) return HealthGrade.GOOD;
  if (score >= 40) return HealthGrade.FAIR;
  if (score >= 20) return HealthGrade.POOR;
  return HealthGrade.CRITICAL;
}

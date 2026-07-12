import type { FinancialState } from "../models/FinancialState.js";
import { HealthGrade, type HealthReport } from "../models/HealthReport.js";
import type { PillarScore } from "../models/PillarScore.js";
import { DefaultGradePolicy, type GradePolicy } from "../policies/GradePolicy.js";
import { RuleRegistry } from "./RuleRegistry.js";

/** Orchestrates independently evaluated health rules into an audit report. */
export class HealthEngine {
  public constructor(
    private readonly registry: RuleRegistry,
    private readonly engineVersion = "v1.0.0",
    private readonly now: () => Date = () => new Date(),
    private readonly gradePolicy: GradePolicy = new DefaultGradePolicy(),
  ) {}

  public evaluate(state: FinancialState): HealthReport {
    const results = this.registry.rules.map((rule) => rule.evaluate(state));
    const pillars: readonly PillarScore[] = Object.freeze(
      results.map((result) =>
        Object.freeze({
          type: result.pillar,
          score: result.score,
          maximumScore: result.maximumScore,
          reasons: result.reasons,
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
      grade: this.gradePolicy.gradeFor(score),
      pillars,
      ruleResults: Object.freeze([...results]),
      recommendations: Object.freeze([]),
      generatedAt: this.now(),
      engineVersion: this.engineVersion,
      rulesVersion: this.registry.version,
    });
  }
}

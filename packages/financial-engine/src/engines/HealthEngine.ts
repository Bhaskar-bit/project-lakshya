import type { FinancialState } from "../models/FinancialState.js";
import { HealthGrade, type HealthReport } from "../models/HealthReport.js";
import { PillarType, type PillarScore } from "../models/PillarScore.js";
import { DefaultGradePolicy, type GradePolicy } from "../policies/GradePolicy.js";
import { RuleRegistry } from "./RuleRegistry.js";
import { PILLAR_WEIGHTS } from "../constants/pillars.js";

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
    const evaluatedPillars = Object.freeze([...new Set(results.map((result) => result.pillar))]);
    const allPillars = Object.values(PillarType).filter((value): value is PillarType => typeof value === "number");
    const missingPillars = Object.freeze(allPillars.filter((pillar) => !evaluatedPillars.includes(pillar)));
    const evaluatedWeight = evaluatedPillars.reduce((total, pillar) => total + PILLAR_WEIGHTS[pillar], 0);
    const totalSupportedWeight = Object.values(PILLAR_WEIGHTS).reduce((total, weight) => total + weight, 0);

    return Object.freeze({
      score,
      grade: this.gradePolicy.gradeFor(score),
      pillars,
      assessments: Object.freeze([...results]),
      recommendations: Object.freeze([]),
      coverage: Object.freeze({
        evaluatedWeight,
        totalSupportedWeight,
        evaluatedPillars,
        missingPillars,
        status: missingPillars.length === 0 ? "COMPLETE" : "PARTIAL",
      }),
      generatedAt: this.now(),
      engineVersion: this.engineVersion,
      rulesVersion: this.registry.version,
    });
  }
}

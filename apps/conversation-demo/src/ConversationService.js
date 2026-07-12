/**
 * Application service that converts deterministic domain outputs into a
 * consumer-neutral financial conversation. It owns no financial formula.
 */
export class ConversationService {
  constructor(healthEngine, recommendationEngine) {
    this.healthEngine = healthEngine;
    this.recommendationEngine = recommendationEngine;
  }

  evaluate(financialState) {
    const healthReport = this.healthEngine.evaluate(financialState);
    const findings = healthReport.assessments.flatMap((assessment) => assessment.findings);
    const recommendationReport = this.recommendationEngine.evaluate(findings);
    const topFinding = findings[0] ?? null;
    const topRecommendation = recommendationReport.recommendations[0] ?? null;

    return Object.freeze({
      healthReport,
      findings: Object.freeze([...findings]),
      recommendationReport,
      topFinding,
      topRecommendation,
    });
  }
}

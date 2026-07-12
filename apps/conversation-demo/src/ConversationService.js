/**
 * Application service that converts deterministic domain outputs into a
 * consumer-neutral financial conversation. It owns no financial formula.
 */
export class ConversationService {
  constructor(healthEngine, recommendationEngine, actionPlanEngine) {
    this.healthEngine = healthEngine;
    this.recommendationEngine = recommendationEngine;
    this.actionPlanEngine = actionPlanEngine;
  }

  evaluate(financialState) {
    const healthReport = this.healthEngine.evaluate(financialState);
    const findings = healthReport.assessments.flatMap((assessment) => assessment.findings);
    const recommendationReport = this.recommendationEngine.evaluate(findings);
    const actionPlanReport = this.actionPlanEngine.evaluate({ recommendations: recommendationReport.recommendations, assessments: healthReport.assessments, financialState, currency: "INR" });
    const topFinding = findings[0] ?? null;
    const topRecommendation = recommendationReport.recommendations[0] ?? null;

    return Object.freeze({
      healthReport,
      findings: Object.freeze([...findings]),
      recommendationReport,
      actionPlanReport,
      topFinding,
      topRecommendation,
      topActionPlan: actionPlanReport.plans[0] ?? null,
    });
  }
}

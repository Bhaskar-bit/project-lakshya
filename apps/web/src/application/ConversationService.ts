import {
  ActionPlanEngine,
  CashFlowRule,
  CreditCardDebtRecommendationRule,
  DebtRule,
  EmergencyFundRecommendationRule,
  EmiBurdenRecommendationRule,
  HealthEngine,
  RecommendationEngine,
  RecommendationRegistry,
  RuleRegistry,
  SafetyRule,
  SavingsRateRecommendationRule,
  type ActionPlanReport,
  type Finding,
  type FinancialState,
  type HealthReport,
  type RecommendationReport,
} from "../../../../packages/financial-engine/dist/index.js";

export interface FinancialConversation {
  readonly healthReport: HealthReport;
  readonly findings: readonly Finding[];
  readonly recommendationReport: RecommendationReport;
  readonly actionPlanReport: ActionPlanReport;
}

/** Application orchestration only. Financial formulas remain inside domain engines and policies. */
export class ConversationService {
  private readonly healthEngine = new HealthEngine(
    new RuleRegistry("v1.0.0", [new SafetyRule(), new CashFlowRule(), new DebtRule()]),
  );
  private readonly recommendationEngine = new RecommendationEngine(
    new RecommendationRegistry("v1.0.0", [
      new CreditCardDebtRecommendationRule(),
      new EmergencyFundRecommendationRule(),
      new EmiBurdenRecommendationRule(),
      new SavingsRateRecommendationRule(),
    ]),
  );
  private readonly actionPlanEngine = new ActionPlanEngine();

  public evaluate(financialState: FinancialState): FinancialConversation {
    const healthReport = this.healthEngine.evaluate(financialState);
    const findings = Object.freeze(
      healthReport.assessments.flatMap((assessment) => assessment.findings),
    );
    const recommendationReport = this.recommendationEngine.evaluate(findings);
    const actionPlanReport = this.actionPlanEngine.evaluate({
      recommendations: recommendationReport.recommendations,
      assessments: healthReport.assessments,
      financialState,
      currency: "INR",
    });
    return Object.freeze({ healthReport, findings, recommendationReport, actionPlanReport });
  }
}

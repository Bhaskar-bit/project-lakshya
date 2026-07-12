import type { Finding } from "../models/Finding.js";
import type { RecommendationReport } from "../models/RecommendationReport.js";
import { FindingMatcher } from "./FindingMatcher.js";
import { RecommendationRegistry } from "./RecommendationRegistry.js";

/** Produces deterministic recommendations solely from finding contracts. */
export class RecommendationEngine {
  private readonly matcher: FindingMatcher;

  public constructor(
    private readonly registry: RecommendationRegistry,
    private readonly engineVersion = "v1.0.0",
    private readonly now: () => Date = () => new Date(),
  ) {
    this.matcher = new FindingMatcher(registry.rules);
  }

  public evaluate(findings: readonly Finding[]): RecommendationReport {
    return Object.freeze({
      recommendations: this.matcher.recommendationsFor(findings),
      generatedAt: this.now(),
      engineVersion: this.engineVersion,
      rulesVersion: this.registry.version,
    });
  }
}

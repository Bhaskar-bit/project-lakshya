import type { FinancialState } from "../models/FinancialState.js";
import type { Recommendation } from "../models/Recommendation.js";

export interface Allocation {
  readonly recommendationId: string;
  readonly monthlyAmount: number;
  readonly startsAfterRecommendationId?: string;
}

/** Versioned v1 policy that allocates one surplus pool in ranked sequence. */
export class SurplusAllocationPolicy {
  public readonly version = "v1";

  public allocate(input: {
    readonly monthlySurplus: number;
    readonly recommendations: readonly Recommendation[];
    readonly financialState: FinancialState;
  }): readonly Allocation[] {
    const available = Math.max(0, input.monthlySurplus);
    let predecessor: string | undefined;
    return Object.freeze(input.recommendations.map((recommendation, index) => {
      const allocation = Object.freeze({
        recommendationId: recommendation.id,
        monthlyAmount: index === 0 ? available : 0,
        ...(predecessor ? { startsAfterRecommendationId: predecessor } : {}),
      });
      predecessor = recommendation.id;
      return allocation;
    }));
  }
}

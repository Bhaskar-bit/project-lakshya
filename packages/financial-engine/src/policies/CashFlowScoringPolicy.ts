/** Versioned policy for interpreting monthly savings rate as a Cash Flow score. */
export class CashFlowScoringPolicy {
  public readonly version = "v1";

  public scoreFor(savingsRatePercent: number): number {
    if (savingsRatePercent < 0) return 0;
    if (savingsRatePercent < 10) return 3;
    if (savingsRatePercent < 20) return 7;
    if (savingsRatePercent < 30) return 11;
    if (savingsRatePercent < 40) return 13;
    return 15;
  }
}

/** Versioned policy for interpreting debt position as a Debt pillar score. */
export class DebtScoringPolicy {
  public readonly version = "v1";

  public scoreFor(input: {
    readonly emiToIncomeRatio: number;
    readonly creditCardOutstanding: number;
    readonly unsecuredOutstanding: number;
  }): number {
    if (input.creditCardOutstanding > 0) return 8;
    if (input.emiToIncomeRatio > 0.5) return 6;
    if (input.emiToIncomeRatio >= 0.4) return 10;
    if (input.emiToIncomeRatio >= 0.3) return 14;
    if (input.unsecuredOutstanding > 0) return 17;
    return 20;
  }
}

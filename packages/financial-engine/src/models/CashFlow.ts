/** Period cash-flow values available for future engine evaluations. */
export interface CashFlow {
  readonly monthlyIncome: number;
  readonly monthlyEssentialExpenses: number;
  readonly monthlyDiscretionaryExpenses: number;
}

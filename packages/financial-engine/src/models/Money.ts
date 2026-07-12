/** Monetary value in the caller's reporting currency. */
export interface Money {
  readonly amount: number;
  readonly currency: string;
}

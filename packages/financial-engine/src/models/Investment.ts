/** An investment position available for future engine evaluations. */
export interface Investment {
  readonly id: string;
  readonly name: string;
  readonly currentValue: number;
}

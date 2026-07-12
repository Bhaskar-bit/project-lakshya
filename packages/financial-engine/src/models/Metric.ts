/** A measured domain fact, optionally evaluated against a target. */
export interface Metric<T> {
  readonly name: string;
  readonly value: T;
  readonly target?: T;
  readonly unit: string;
}

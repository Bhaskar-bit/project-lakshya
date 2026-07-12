export enum FindingSeverity {
  HIGH,
  MEDIUM,
  LOW,
}

/** An observable domain fact emitted by a rule, before advice is generated. */
export interface Finding {
  readonly severity: FindingSeverity;
  readonly code: string;
  readonly title: string;
  readonly description: string;
}

export enum Priority {
  HIGH,
  MEDIUM,
  LOW,
}

/** An actionable suggestion with a measurable expected effect. */
export interface Recommendation {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly priority: Priority;
  readonly expectedScoreIncrease: number;
  readonly sourceFindingCode: string;
  readonly sourceFindingVersion: string;
  readonly measurableTarget: string;
  readonly expectedCompletion?: string;
}

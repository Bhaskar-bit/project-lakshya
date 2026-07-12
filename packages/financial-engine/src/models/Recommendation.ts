export enum Priority {
  HIGH,
  MEDIUM,
  LOW,
}

/** An actionable suggestion with a measurable expected effect. */
export interface Recommendation {
  title: string;
  description: string;
  priority: Priority;
  expectedScoreIncrease: number;
}

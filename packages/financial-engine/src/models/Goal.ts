export enum GoalType {
  EMERGENCY_FUND,
  RETIREMENT,
  EDUCATION,
  VACATION,
  CUSTOM,
}

/** A planned financial objective with a target amount and target date. */
export interface Goal {
  id: string;
  type: GoalType;
  name: string;
  targetAmount: number;
  currentFunding: number;
  targetDate?: Date;
}

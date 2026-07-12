export enum LiabilityType {
  HOME_LOAN,
  PERSONAL_LOAN,
  VEHICLE_LOAN,
  CREDIT_CARD,
  OTHER,
}

/** A financial obligation that reduces net worth. */
export interface Liability {
  id: string;
  type: LiabilityType;
  name: string;
  outstandingBalance: number;
  emi: number;
  interestRate: number;
}

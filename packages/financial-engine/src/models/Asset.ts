export enum AssetType {
  CASH,
  SAVINGS,
  FD,
  RD,
  LIQUID_FUND,
  GOLD,
  MUTUAL_FUND,
  STOCK,
  US_STOCK,
  PPF,
  EPF,
  NPS,
  PROPERTY,
  OTHER,
}

/** Something owned by the user that contributes positively to net worth. */
export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  currentValue: number;
}

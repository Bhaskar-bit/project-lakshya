export enum PillarType {
  SAFETY,
  GROWTH,
  DEBT,
  GOALS,
  CASHFLOW,
  PROTECTION,
}

/** The weighted contribution of one financial-health pillar. */
export interface PillarScore {
  type: PillarType;
  score: number;
  maximumScore: number;
  reason: string;
}

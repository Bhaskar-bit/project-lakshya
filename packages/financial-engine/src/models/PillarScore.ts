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
  readonly type: PillarType;
  readonly score: number;
  readonly maximumScore: number;
  readonly reasons: readonly string[];
}

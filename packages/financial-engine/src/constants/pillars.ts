import { PillarType } from "../models/PillarScore.js";

/** Supported v1 health-pillar weights. These must total 100. */
export const PILLAR_WEIGHTS: Readonly<Record<PillarType, number>> = Object.freeze({
  [PillarType.SAFETY]: 25,
  [PillarType.GROWTH]: 15,
  [PillarType.DEBT]: 20,
  [PillarType.GOALS]: 15,
  [PillarType.CASHFLOW]: 15,
  [PillarType.PROTECTION]: 10,
});

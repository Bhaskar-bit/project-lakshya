import { AssetType } from "../models/Asset.js";

export const EMERGENCY_FUND_TARGET_MONTHS = 6;
export const SAFETY_MAXIMUM_SCORE = 25;

/** Assets immediately usable for an emergency-fund calculation in v1. */
export const LIQUID_ASSET_TYPES: readonly AssetType[] = [
  AssetType.CASH,
  AssetType.SAVINGS,
  AssetType.LIQUID_FUND,
];

import type { Asset } from "../models/Asset.js";
import type { FinancialHealth } from "../models/FinancialHealth.js";
import type { FinancialProfile } from "../models/FinancialProfile.js";
import type { Goal } from "../models/Goal.js";
import type { Liability } from "../models/Liability.js";

/** Complete domain input required to assess current financial health. */
export interface HealthEngineInput {
  profile: FinancialProfile;
  assets: Asset[];
  liabilities: Liability[];
  goals: Goal[];
}

/** Public contract for the financial-health engine. */
export interface HealthEngine {
  calculate(input: HealthEngineInput): FinancialHealth;
}

import type { Asset } from "./Asset.js";
import type { CashFlow } from "./CashFlow.js";
import type { FinancialProfile } from "./FinancialProfile.js";
import type { Goal } from "./Goal.js";
import type { Investment } from "./Investment.js";
import type { Liability } from "./Liability.js";

/** Complete, immutable domain input shared by financial engines. */
export interface FinancialState {
  readonly profile: FinancialProfile;
  readonly assets: readonly Asset[];
  readonly liabilities: readonly Liability[];
  readonly goals: readonly Goal[];
  readonly investments: readonly Investment[];
  readonly cashFlow: CashFlow;
}

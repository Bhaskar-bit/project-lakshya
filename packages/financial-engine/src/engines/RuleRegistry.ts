import type { HealthRule } from "../rules/HealthRule.js";

/** Versioned collection of the rules evaluated by a HealthEngine. */
export class RuleRegistry {
  public readonly rules: readonly HealthRule[];

  public constructor(
    public readonly version: string,
    rules: readonly HealthRule[],
  ) {
    this.rules = Object.freeze([...rules]);
  }
}

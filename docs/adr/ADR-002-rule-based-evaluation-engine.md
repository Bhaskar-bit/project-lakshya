# ADR-002: Rule-Based Evaluation Engine

**Status:** Accepted  
**Date:** 2026-07-12

## Context

Financial-health scoring will evolve as the product gains new financial concepts, changing weights, more granular assessments, and versioned formulas. Putting calculations directly inside `HealthEngine` would couple orchestration to scoring policy and make every rule change a change to the engine itself.

## Decision

`HealthEngine` orchestrates evaluation; it does not contain financial scoring rules. A versioned `RuleRegistry` supplies independent `HealthRule` strategies. Each rule has a stable identifier and version, evaluates a `FinancialState`, and returns an immutable, explainable `Assessment` containing its score, maximum score, pillar, measurements, reasons, findings, and evidence.

Measurements and findings are the durable domain facts. Scores interpret measurements; recommendations interpret findings. `HealthEngine` aggregates `RuleResult` values into an immutable, versioned `HealthReport`; it delegates grade interpretation to a `GradePolicy`. Recommendation generation consumes rule results after evaluation and must not own scoring formulas.

The initial implementation contains only `SafetyRule`, which evaluates emergency-fund coverage against the six-month target.

## Consequences

- A new evaluation rule can be added without modifying `HealthEngine`.
- Each rule can be tested as a focused business rule.
- Reports and future Financial Snapshots can record engine and rules versions for reproducibility.
- The engine remains free of framework, database, ORM, and UI dependencies.

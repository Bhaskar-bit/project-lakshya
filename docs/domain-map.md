# Domain Map

Project Lakshya is organised around stable financial facts, configurable assumptions and policies, and derived decisions.

```text
Facts + Assumptions + Policies → Decisions
```

| Layer | Purpose | Examples |
| --- | --- | --- |
| Facts | Immutable or source-owned financial facts. | Assets, liabilities, goals, investments, financial profile. |
| Assumptions | Explicit planning inputs used by policies. | Inflation, expected equity return, medical inflation, education inflation. |
| Policies | Versioned, configurable interpretation of facts and assumptions. | Emergency-fund target, liquidity haircut, net-worth treatment, retirement policy. |
| Decisions | Deterministic, explainable outputs produced by engines. | Health, net worth, recommendations, retirement projections. |

## Bounded contexts

```text
Financial Core
├── Financial State
├── Health
├── Net Worth
├── Cash Flow
├── Goals
├── Recommendations
└── Snapshots

Planning
├── Retirement
├── Education
├── Emergency Fund
├── Loans
└── Insurance

Portfolio
├── Investments
├── Asset Allocation
├── Liability Allocation
└── Performance

Platform
├── Policies
├── Assumptions
├── Financial State Builder
├── Snapshots
└── AI Explanation
```

## Context responsibilities

| Context | Owns | Does not own |
| --- | --- | --- |
| Financial Core | Current Financial State and cross-cutting, deterministic financial decisions. | Persistence, UI, account integrations, or AI-generated calculations. |
| Planning | Future-oriented goals and projections, including retirement, education, and protection planning. | Raw portfolio performance or source-data collection. |
| Portfolio | Investment and allocation concepts, portfolio composition, and performance inputs. | Health scoring policy or recommendation presentation. |
| Platform | Configurable assumptions, policies, state assembly, historical snapshots, and AI explanation boundaries. | Financial formulas embedded in UI or infrastructure adapters. |

## Dependency direction

```text
Financial State Builder → Financial State
Assumptions → Policies
Financial State + Policies → Engines
Engines → Assessments → Findings → Insights → Recommendations
Snapshots retain the resulting state, decisions, and version provenance.
AI explains Insights; it does not calculate financial facts or decisions.
```

## Intended domain packages

Before UI work, the domain core is expected to contain:

- `financial-engine` — deterministic financial decisions.
- `financial-policies` — versioned policy contracts and implementations.
- `financial-types` — shared, explicit financial domain types.
- `financial-testkit` — reusable business-test fixtures and assertions.

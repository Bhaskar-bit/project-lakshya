# RFC-004: Net Worth Engine

**Status:** Proposed — Frozen pending financial-policy approval  
**Date:** 2026-07-12  
**Owners:** Project Lakshya Financial Core

## Summary

Define the business meaning, inputs, policies, and outputs of the NetWorthEngine before implementing it. The engine will be the single source of truth for multiple views of net worth, including total, liquid, investable, and emergency-fund-eligible positions, plus asset and liability allocations.

No NetWorthEngine implementation is authorised by this RFC while its status remains Proposed.

## Problem

The basic equation is straightforward:

```text
Net Worth = Assets − Liabilities
```

A financial-planning platform needs more than one interpretation of that equation. A dashboard, emergency-fund analysis, retirement planning, loan planning, and AI reviews need different, explainable views of the same financial state.

Treating asset type enums as the source of liquidity, investability, or emergency-fund eligibility would hard-code financial behaviour into the engine. It would not adapt well to countries, institutions, advisors, or policy changes.

## Goals

NetWorthEngine will be the single source of truth for:

- Total Net Worth
- Liquid Net Worth
- Investable Net Worth
- Emergency-Fund-Eligible Assets
- Asset Allocation
- Liability Allocation

## Non-goals

NetWorthEngine does not:

- Calculate investment returns, performance, or CAGR.
- Generate recommendations.
- Perform retirement calculations.
- Determine taxes or after-tax value.
- Persist, import, or fetch financial state.

Those concerns belong to their respective engines, policies, or infrastructure adapters.

## Design principles

1. **Financial behaviour over product names.** Asset types identify what an asset is; characteristics and policies determine how it behaves in a financial view.
2. **Policy-driven interpretation.** Engines are deterministic. Policies supply the configurable interpretation of liquidity and eligibility.
3. **One report, multiple views.** Consumers receive a common NetWorthReport rather than independently recalculating a net-worth variant.
4. **Explainability.** Every derived view must be traceable to assets, liabilities, capabilities, and policy decisions.
5. **No implicit regional assumptions.** Country-, institution-, and advisor-specific treatment belongs in policies, not hard-coded switches.

## 1. Asset taxonomy: what exists?

The asset taxonomy is a business classification, not a database schema and not a replacement for granular product types. Every asset belongs to one primary taxonomy category.

```text
Asset
├── Cash
├── Bank
├── Liquid Investments
├── Equity
├── Fixed Income
├── Precious Metals
├── Retirement Accounts
├── Real Estate
└── Other
```

| Taxonomy category | Meaning | Examples |
| --- | --- | --- |
| Cash | Physical or immediately available cash. | Cash on hand. |
| Bank | Deposits held with a banking institution. | Savings account, current account, fixed deposit. |
| Liquid Investments | Investments designed to be readily redeemable. | Liquid fund, money-market fund. |
| Equity | Ownership-oriented market investments. | Stocks, equity mutual funds, ETFs. |
| Fixed Income | Investments with primarily debt-like return characteristics. | Bonds, debt mutual funds, recurring deposits. |
| Precious Metals | Holdings whose principal exposure is precious metals. | Gold ETF, gold fund, physical gold. |
| Retirement Accounts | Assets subject to retirement-account rules or restrictions. | EPF, PPF, NPS, pension account. |
| Real Estate | Land and property interests. | Residential property, commercial property. |
| Other | Assets not yet represented by a defined category. | Collectibles, private holdings. |

Taxonomy creates a stable vocabulary. It does not by itself decide whether an asset is liquid, investable, or eligible for an emergency fund.

## 2. Asset characteristics: how does it behave?

Each asset receives financial characteristics. Characteristics express intrinsic or product-supplied facts; policies interpret those facts for a specific financial purpose.

| Characteristic | Meaning |
| --- | --- |
| Liquid | The asset can be converted to cash in a reasonable time. |
| Investable | The asset represents capital that can contribute to an investment portfolio view. |
| Emergency Fund Eligible | The asset may be counted toward an emergency reserve, subject to policy haircut. |
| Appreciating | The asset is expected to have potential long-term capital appreciation. |
| Retirement Eligible | The asset may be considered in retirement-planning views. |

Characteristics are not a replacement for policy percentages. For example, a Gold ETF may be liquid and emergency-fund eligible, while a policy determines whether 50%, 80%, or 90% of its value is counted toward emergency reserves.

### Illustrative asset behaviour

| Asset | Liquid | Investable | Emergency Fund Eligible | Appreciating | Retirement Eligible |
| --- | --- | --- | --- | --- | --- |
| Savings account | Yes | No | Yes | No | No |
| Liquid fund | Yes | Yes | Yes | Low | Yes |
| Gold ETF | Yes | Yes | Yes, with haircut | Yes | Yes |
| Property | No | Yes | No | Yes | Yes |
| PPF | No | Yes | No | Low | Yes |

## 3. Financial policies: how are characteristics interpreted?

Financial policies are versioned, configurable domain inputs. They allow the same engine and asset taxonomy to serve different countries, advisors, institutions, or risk approaches without code changes.

### LiquidityPolicy

LiquidityPolicy determines the proportion of an asset's current value eligible for liquid-net-worth and emergency-fund views. It may use taxonomy, characteristics, product metadata, geography, or institution rules.

Example treatment for a Gold ETF:

| Policy | Liquid-net-worth factor | Emergency-fund factor |
| --- | ---: | ---: |
| Conservative | 50% | 50% |
| Standard | 80% | 80% |
| Aggressive | 90% | 90% |

The policy is responsible for the factor; the engine applies it deterministically and records the policy version used.

### Future policy family

The policy boundary established here is intended to support future policy types without coupling them to NetWorthEngine:

- InflationPolicy
- RetirementPolicy
- EmergencyFundPolicy
- WithdrawalPolicy
- TaxPolicy

## 4. Allocation taxonomy

Consumer experiences should not expose a list of every granular asset type. NetWorthEngine rolls assets into five allocation buckets:

| Allocation bucket | Intended contents |
| --- | --- |
| Cash | Cash, bank balances, and policy-defined cash equivalents. |
| Debt | Fixed-income and debt-oriented investments. |
| Equity | Equity investments and equity-oriented funds. |
| Alternatives | Precious metals and other non-traditional investable assets. |
| Real Estate | Property and land interests. |

The taxonomy-to-allocation mapping is a policy concern. The same asset can retain its business taxonomy while a policy determines its presentation allocation.

## 5. Liability taxonomy and allocation

Liabilities are grouped by security, then by product type. This lets consumers distinguish relatively long-term secured debt from higher-risk unsecured obligations.

```text
Liability
├── Secured
│   ├── Home Loan
│   └── Vehicle Loan
└── Unsecured
    ├── Personal Loan
    ├── Credit Card
    └── Buy Now Pay Later
```

| Allocation bucket | Meaning |
| --- | --- |
| Secured | Debt backed by collateral, including home and vehicle loans. |
| Unsecured | Debt without collateral, including personal loans, credit cards, and buy-now-pay-later obligations. |

Liability allocation is calculated from outstanding balances, not original principal or monthly EMI.

## 6. Net worth views

NetWorthEngine returns one immutable report containing multiple views. All monetary values are expressed in the FinancialState reporting currency after any required currency normalisation performed before the engine boundary.

| View | Definition | Primary consumers |
| --- | --- | --- |
| Total Net Worth | Total current asset value minus total outstanding liability balance. | Dashboard, snapshots, monthly review, AI. |
| Liquid Net Worth | Policy-adjusted liquid asset value minus liabilities. | Emergency readiness, short-term planning. |
| Investable Net Worth | Policy-adjusted value of assets eligible for investment and planning views, less applicable liabilities where the consuming policy requires it. | Retirement and goal planning. |
| Emergency-Fund-Eligible Assets | Policy-adjusted value of assets that may support an emergency reserve. | Health Safety assessment, emergency-fund insight. |
| Asset Allocation | Asset value distributed across Cash, Debt, Equity, Alternatives, and Real Estate. | Dashboard, portfolio views, AI. |
| Liability Allocation | Outstanding liability balance distributed across Secured and Unsecured debt. | Dashboard, debt planning, AI. |

### Open policy decision: liability treatment in Investable Net Worth

The total-net-worth definition always subtracts all outstanding liabilities. Whether investable-net-worth subtracts all liabilities, only investment-linked liabilities, or none is intentionally unresolved in this RFC. It must be specified by the first approved Investment/Planning policy before NetWorthEngine is implemented.

## Proposed report contract

The final type names may change during implementation, but the report must expose these concepts and retain policy provenance:

```text
NetWorthReport
├── totalNetWorth
├── liquidNetWorth
├── investableNetWorth
├── emergencyFundEligibleAssets
├── assetAllocation
├── liabilityAllocation
├── generatedAt
├── engineVersion
└── policyVersions
```

The report must preserve sufficient evidence to explain every policy-adjusted amount. For example, an emergency-fund view must identify the source assets, their raw values, their policy factors, and their resulting eligible values.

## Consumer matrix

| Consumer | Required NetWorthEngine views |
| --- | --- |
| Dashboard | Total Net Worth, asset allocation, liability allocation. |
| Health Safety assessment | Liquid Net Worth, Emergency-Fund-Eligible Assets. |
| Goal planning | Total Net Worth, Investable Net Worth. |
| Retirement planning | Investable Net Worth, retirement-eligible asset evidence. |
| Loan planning | Total Net Worth, liability allocation. |
| Monthly snapshots | Complete immutable NetWorthReport with engine and policy versions. |
| AI reviews | Complete report, evidence, and policy provenance; AI explains but does not calculate. |

## Architecture boundaries

NetWorthEngine consumes pure FinancialState and approved financial policies. It must not know about PostgreSQL, API integrations, brokerage imports, manual-entry screens, snapshots, React, or AI models.

FinancialStateBuilder is an infrastructure or application-boundary capability. It assembles a valid FinancialState from sources such as databases, APIs, broker imports, manual entries, and snapshots before the state reaches an engine.

## Consequences

- Future features use a shared definition of net worth rather than reimplementing formulas.
- Policy changes can be versioned and applied without changing the engine's core logic.
- Historical reports and snapshots remain explainable through stored engine and policy versions.
- Asset model evolution is additive: new products can map to existing taxonomy and characteristics.
- Implementation is deferred until the remaining open policy decision is resolved and this RFC is approved.

## Decision log

| Decision | Chosen | Rejected | Why |
| --- | --- | --- | --- |
| Asset model | Taxonomy plus characteristics | Enum-only logic | Financial behaviour is more extensible than product-name switches. |
| Liquidity | Policy-driven factors | Hard-coded per asset | Supports country, institution, advisor, and risk-profile variation. |
| Net worth | Multiple named views | One total only | Different product features require different interpretations. |
| Allocation display | Five consumer-facing buckets | Exposing all granular asset types | Supports understandable dashboard and AI summaries. |
| Liability allocation | Secured versus unsecured | Product-type-only grouping | Highlights a financially meaningful debt distinction. |
| Engine boundary | Pure FinancialState and policies | Direct access to persistence or integrations | Keeps financial calculations deterministic and testable. |

## Approval criteria

RFC-004 can move to Accepted only when:

1. The investable-net-worth liability treatment is decided.
2. The initial LiquidityPolicy and allocation-mapping policy are specified and versioned.
3. The report evidence requirements are accepted.
4. Financial Core owners approve the taxonomy and consumer matrix.

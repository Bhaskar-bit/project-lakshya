# Domain Model

Lakshya is a financial-health product. Its core purpose is to help a user understand, improve, and track their overall financial health. Transactions are supporting data: they can inform balances, income, expenses, and monthly analytics, but they are not the centre of the domain.

## Core entities

```text
User
├── Financial Profile
├── Goals
├── Assets
├── Liabilities
├── Investments
├── Monthly Snapshots
└── Financial Health
```

| Entity | Ownership and purpose |
| --- | --- |
| User | Owns a financial workspace and its financial data. |
| FinancialProfile | Captures the user's financial context and planning assumptions. |
| Goal | Represents a desired financial outcome and its current health. |
| Asset | Represents something the user owns with measurable value. |
| Liability | Represents a debt or financial obligation. |
| Investment | Tracks investment-specific performance, allocation, and risk. It is distinct from an asset. |
| MonthlySnapshot | Immutable monthly record used to calculate trends and analytics. |
| FinancialHealth | Current, derived assessment of the user's financial wellbeing. |

## User

The User is the root owner of all domain data. A user has one FinancialProfile, zero or more Goals, Assets, Liabilities, Investments, and MonthlySnapshots, and one current FinancialHealth assessment.

## FinancialProfile

FinancialProfile is the primary context for personalisation and financial-health calculations.

| Field | Description |
| --- | --- |
| age | User's current age. |
| maritalStatus | Marital status relevant to household planning. |
| dependents | Number of people financially dependent on the user. |
| employmentType | Employment category, such as salaried, self-employed, or business owner. |
| country | Country of residence. |
| currency | Default reporting currency. |
| monthlyIncome | Typical monthly income. |
| monthlyExpenses | Typical monthly expenses. |
| retirementAge | Intended age of retirement. |
| riskProfile | Investment-risk tolerance, such as conservative, moderate, or aggressive. |

## Asset

An Asset is a current holding with a measurable value. Assets contribute to net worth, liquidity, allocation, and goal funding.

| Field | Description |
| --- | --- |
| id | Unique asset identifier. |
| type | Asset category, for example cash, gold, stocks, mutual funds, PPF, EPF, property, or crypto. |
| value | Current estimated value. |
| currency | Currency in which the value is recorded. |
| liquidity | Ease and expected time to convert the asset into cash. |
| goalId | Optional link to the goal this asset is intended to fund. |
| institution | Bank, broker, fund house, employer, or other custodian. |
| lastUpdated | Timestamp of the most recent valuation. |

## Liability

A Liability is an outstanding financial obligation. Liabilities reduce net worth and inform debt and affordability measures.

| Field | Description |
| --- | --- |
| id | Unique liability identifier. |
| type | Liability category, such as home loan, vehicle loan, education loan, credit card, or personal loan. |
| principal | Original loan amount. |
| interestRate | Annual interest rate. |
| emi | Recurring monthly repayment amount. |
| remainingMonths | Months remaining until repayment completes. |

## Goal

A Goal represents an intended financial outcome. Standard goal types are Emergency Fund, Retirement, Education, Vacation, and Custom.

| Field | Description |
| --- | --- |
| current | Current amount allocated or available for the goal. |
| target | Required amount at the target date. |
| gap | Difference between target and current amount. This is derived. |
| priority | Relative importance to the user. |
| probability | Estimated likelihood of reaching the target on time. |
| health | Assessment of whether the goal is on track. |
| inflation | Inflation assumption applied to the target. |
| targetDate | Intended completion date. |

## Investment

Investment records investment-specific facts that are needed for return, allocation, and risk analysis. An Investment may be represented by, or contribute to, an Asset, but it is not synonymous with one: assets describe what the user owns now; investments describe performance and portfolio intent.

| Field | Description |
| --- | --- |
| broker | Broker or investment platform. |
| purchase | Purchase value or cost basis. |
| current | Current market value. |
| returns | Absolute or percentage return, derived from purchase and current values. |
| allocation | Portfolio allocation percentage. |
| goal | Goal funded by the investment, if applicable. |
| risk | Risk classification for the holding. |

## MonthlySnapshot

MonthlySnapshot is the analytics foundation. At the end of each month, Lakshya stores a point-in-time record so that financial-health and goal trends can be calculated without rewriting history.

| Field | Description |
| --- | --- |
| income | Income recorded for the month. |
| expenses | Expenses recorded for the month. |
| netWorth | Total assets less total liabilities at month end. |
| healthScore | Financial-health score at month end. |
| goalProgress | Progress toward each goal at month end. |
| assetAllocation | Asset-class allocation at month end. |
| debtRatio | Debt measure at month end, calculated consistently by the health engine. |

## FinancialHealth

FinancialHealth is the user's current, derived financial assessment. It synthesises the FinancialProfile, assets, liabilities, goals, investments, and latest MonthlySnapshot into a health score and actionable component measures. It is recalculated when relevant financial inputs change and preserved historically through MonthlySnapshots.

## Supporting data: transactions

Transactions are supporting data, not a core entity in the product model. They may be used to derive or validate monthly income, expenses, asset balances, liability repayments, and snapshots. The Financial Health experience must remain useful even when transactions are incomplete, manually entered, or unavailable.

## Key relationships and derivations

- One User has one FinancialProfile and one current FinancialHealth assessment.
- One User has many Assets, Liabilities, Investments, Goals, and MonthlySnapshots.
- An Asset or Investment may be associated with one Goal; a Goal can have multiple linked Assets and Investments.
- Net worth is derived as total current Asset value minus outstanding Liability value.
- A Goal gap is derived as its target minus its current funded amount.
- FinancialHealth is derived from the user's current financial position and planning context; MonthlySnapshots retain the historical values needed for trends.

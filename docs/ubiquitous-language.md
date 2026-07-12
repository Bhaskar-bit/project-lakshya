# Ubiquitous Language

This document defines the canonical language of Project Lakshya's financial domain. Product, design, engineering, analytics, and support use these terms consistently. New names must not be introduced for an existing concept without deliberately updating this document.

## Core terms

| Term | Definition |
| --- | --- |
| Financial Health | A calculated score from 0 to 100 representing the user's overall financial position and readiness to meet their goals. It is never manually entered. |
| Financial State | The current, user-owned picture of financial profile, assets, liabilities, investments, goals, and derived measures. It is the product's primary subject. |
| Financial Profile | The user's planning context, including income, expenses, dependents, age, retirement age, currency, and risk profile. |
| Financial Engine | A pure business-logic package with no UI dependencies. It evaluates financial state and produces financial-health outputs. |
| Pillar | One named dimension of Financial Health: Safety, Growth, Debt, Goals, Cash Flow, or Protection. |
| Pillar Score | The calculated score for one Pillar, including its maximum weighted score, reasons, and relevant recommendations. |
| Weight | The maximum contribution a Pillar can make to Financial Health. All Pillar weights total 100. |
| Recommendation | An actionable, prioritised suggestion derived from financial state, with a measurable expected impact. |
| Expected Impact | The expected improvement produced by completing a Recommendation, normally expressed as an estimated Financial Health score gain. |
| Priority | The urgency of a Recommendation: High, Medium, or Low. |
| Reason | A concise, evidence-based explanation of why a Pillar received its score or why a Recommendation was generated. |
| Snapshot | An immutable monthly record of a user's Financial State and calculated outcomes. |

## Financial position

| Term | Definition |
| --- | --- |
| Asset | Anything the user owns that contributes positively to Net Worth. Examples include cash, gold, stocks, mutual funds, PPF, EPF, property, and crypto. |
| Asset Value | The current estimated monetary value of an Asset. |
| Liquidity | The ease and expected speed with which an Asset can be converted to cash without material loss of value. |
| Liability | A financial obligation that reduces Net Worth. Examples include home loans, vehicle loans, education loans, credit-card balances, and personal loans. |
| Outstanding Balance | The unpaid current amount of a Liability. Do not use this interchangeably with the original principal. |
| Principal | The original amount borrowed for a Liability. |
| EMI | Equated Monthly Instalment: the recurring monthly repayment for a Liability. |
| Net Worth | Total current Asset Value minus total Outstanding Balance of Liabilities. |
| Investment | An Asset position considered for performance, allocation, goal linkage, and risk analysis. Investment is not a synonym for Asset. |
| Cost Basis | Amount paid to acquire an Investment. This replaces the ambiguous term “purchase.” |
| Current Value | The latest estimated market value of an Asset or Investment. |
| Return | The gain or loss on an Investment relative to its Cost Basis. |
| Allocation | The proportion of a portfolio or asset base assigned to an asset class, investment, or goal. |

## Planning and goals

| Term | Definition |
| --- | --- |
| Goal | A planned financial objective with a target amount and target date. Do not use “objective” or “financial goal” as separate concepts. |
| Goal Type | The category of a Goal: Emergency Fund, Retirement, Education, Vacation, or Custom. |
| Target Amount | The amount required to achieve a Goal by its Target Date. |
| Current Funding | The amount currently allocated or available for a Goal. Do not call this simply “current” when meaning is unclear. |
| Goal Gap | Target Amount minus Current Funding. |
| Goal Progress | Current Funding as a proportion of Target Amount. |
| Target Date | The date by which a Goal should be achieved. |
| Goal Health | The calculated assessment of whether a Goal is on track to meet its Target Amount by its Target Date. |
| Emergency Fund | A Safety Goal that provides accessible funds for unforeseen events. |
| Emergency Fund Target | A derived Target Amount equal to six times Monthly Expenses. It is never entered manually. |
| Retirement | A Goal representing the resources needed to support the user after Retirement Age. |
| Retirement Age | The age at which the user intends to retire. |

## Income, expenses, and ratios

| Term | Definition |
| --- | --- |
| Income | Money received by the user in a defined period. Unless otherwise stated, income measures are monthly. |
| Monthly Income | Typical income received in one month, used for planning and ratio calculations. |
| Expense | Money spent or committed by the user in a defined period. |
| Monthly Expenses | Typical essential and discretionary expenses in one month, used for planning and the Emergency Fund Target. |
| Savings | Income remaining after Expenses for the same period. |
| Savings Rate | Savings divided by Income for the same period. |
| Debt Ratio | Total monthly EMI divided by Monthly Income. |
| Cash Flow | The direction and amount of money available after income and expenses for a period. |

## Financial-health pillars

| Pillar | Definition | Initial Weight |
| --- | --- | ---: |
| Safety | Readiness for unexpected events, led by emergency-fund adequacy and liquidity. | 25 |
| Growth | Capacity for wealth creation through suitable investing and long-term planning. | 20 |
| Debt | Sustainability of liabilities and EMI commitments. | 20 |
| Goals | Progress and likelihood of achieving financial Goals. | 15 |
| Cash Flow | Strength and consistency of income, expenses, and savings. | 10 |
| Protection | Adequacy of protection against financial shocks, including insurance when that data is available. | 10 |

## Data and product boundaries

| Term | Definition |
| --- | --- |
| Transaction | A dated financial event, such as a payment, income receipt, repayment, or investment contribution. Transactions are supporting data, not the primary product model. |
| Source Data | Any input used to create, update, or validate Financial State, including manual entry, transactions, account aggregation, broker integrations, and periodic balances. |
| Derived Value | A value calculated by the product from source data and domain rules. Users do not manually enter Derived Values. |
| Financial Health Report | The Financial Engine output containing the overall Financial Health score, Pillar Scores, reasons, and Recommendations. |

## Naming rules

- Use **Goal**, never `financialGoal`, `objective`, or `target` to name the entity.
- Use **Target Amount** for a goal's desired monetary value; **Target Date** for its desired completion date.
- Use **Current Funding** for the amount assigned to a Goal; **Current Value** for the value of an Asset or Investment.
- Use **Outstanding Balance** for a Liability's current unpaid amount; **Principal** for its original loan amount.
- Use **Financial Health** for the overall calculated assessment; use **Pillar Score** for an individual dimension.
- Use **Recommendation** only for an action with a stated expected impact; generic informational content is not a Recommendation.
- Use **Transaction** only for supporting financial events. Do not use it as a synonym for Financial State, Asset, Expense, or Financial Health.

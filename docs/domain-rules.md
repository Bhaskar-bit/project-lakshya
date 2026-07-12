# Domain Rules

These are business rules, not implementation details. Lakshya calculates the important financial measures for users; users provide financial state and supporting inputs, not manual scores or derived values.

## Derived-value principle

Anything that can be reliably calculated from the user's financial state must be derived by the product. Derived values are never manually entered by the user.

## Rules

### 1. Emergency Fund Target

```text
Emergency Fund Target = 6 × Monthly Expenses
```

The emergency-fund target is calculated from the FinancialProfile's monthly expenses. Users cannot enter this target manually.

### 2. Net Worth

```text
Net Worth = Total Assets − Total Liabilities
```

Net worth is calculated from the current value of all assets and the outstanding value of all liabilities.

### 3. Savings Rate

```text
Savings Rate = Savings ÷ Income
```

Savings rate is calculated from the relevant period's savings and income. It should be expressed consistently as a ratio or percentage in product experiences.

### 4. Debt Ratio

```text
Debt Ratio = Total EMI ÷ Income
```

Debt ratio is calculated from all recurring EMI obligations and income for the same period.

### 5. Financial Health

Financial Health is always calculated. A user never enters a financial-health score, status, or assessment. The assessment is derived from their financial state, including financial profile, assets, liabilities, goals, investments, and relevant period data.

## Financial state, not transactions

Lakshya is not an expense tracker.

The product owns the user's **financial state**: their current assets, liabilities, goals, investment position, financial profile, and derived financial health. Transactions are only one way to update or validate that state. Manual updates, account aggregation, periodic balances, and other sources are equally valid.

This distinction is intentional:

- Product experiences focus on the current state, trajectory, and next best action.
- Transactions remain supporting data, never the primary product model or experience.
- Financial insights must remain available when transaction data is incomplete or unavailable.
- Recommendations are based on derived financial state, not simply a ledger of past spending.

## Relationship to the Product Pyramid

Transactions may inform Assets; Assets support Goals; Goals inform Financial Health; Financial Health produces Recommendations. Each derived measure must preserve this upward flow of value.

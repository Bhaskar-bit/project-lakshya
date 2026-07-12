# Product Pyramid

The Product Pyramid is a foundational Lakshya product invariant. It defines how financial information becomes useful guidance and must not be inverted.

```text
Transactions
     ↓
Assets
     ↓
Goals
     ↓
Financial Health
     ↓
Recommendations
```

## Flow of value

| Layer | Role | Feeds into |
| --- | --- | --- |
| Transactions | Supporting financial activity data, such as income, spending, repayments, and contributions. | Assets |
| Assets | What the user currently owns and can allocate. | Goals |
| Goals | The financial outcomes the user is trying to achieve. | Financial Health |
| Financial Health | A holistic assessment of how well the user's current position supports their life and goals. | Recommendations |
| Recommendations | Clear, prioritised next actions that improve the user's financial health. | User action |

## Product rules

- Information flows upward through the pyramid; each layer adds context and meaning to the layer below it.
- Transactions are input data, not the primary product experience.
- Assets have meaning in the context of the goals they can support.
- Goals are evaluated within the user's broader financial health, not in isolation.
- Recommendations are the product outcome. They must be explainable through the user's financial-health assessment, goals, assets, and supporting transactions.
- No feature should bypass the pyramid when producing financial guidance.

## Design implication

Lakshya is not an expense tracker. It uses financial activity to understand the user's position, connect that position to their goals, assess financial health, and recommend the next best action.

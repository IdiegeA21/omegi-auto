# Car data (`data/cars.json`, built in Stage 2)

Each car carries a `payment` block so the owner can change prices or financing without code changes:

```json
"payment": {
  "price": 268000000,
  "downPayment": null,
  "downPaymentBy": null,
  "installment": true,
  "outright": true
}
```

| Field | Meaning |
|---|---|
| `price` | Full price in naira. `null` shows "Ask for price". |
| `downPayment` | A down payment the caption or owner **stated**. Shown as stated. |
| `downPaymentBy` | `"caption"` or `"owner"`. |
| `installment` | `true` only where the caption or owner says financing is open. Controls the red 40% treatment and the hero tag. |
| `outright` | Defaults to true. |

Rules (see `lib/payment.ts`): a price is never derived from a down payment; with no stated down payment, an installment-open car with a price shows 40% of price, labelled "(40%)"; monthly figures never appear unless an interest rate and tenor are set in `config/brand.ts`.

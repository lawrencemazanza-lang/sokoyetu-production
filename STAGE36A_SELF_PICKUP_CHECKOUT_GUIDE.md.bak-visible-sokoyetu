# SokoYetu Stage 36A: Self-Pickup Checkout Option

Stage 36A adds a buyer-facing self-pickup option in checkout.

## Behaviour

```text
Home delivery: delivery address required; KES 300 delivery fee unless subtotal is KES 10,000 or above.
Self-pickup: delivery address not required; delivery fee is KES 0; M-PESA amount excludes delivery fee.
```

## Test

```cmd
npm run stage36a:check
node --check server.js
npm run dev
```

Manual test: add product to cart, open checkout, select Self-pickup, confirm delivery fee is KES 0, submit controlled test order, check Admin Orders and Track Order.

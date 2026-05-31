# SokoYetu Stage 35C: Controlled Buyer Journey Smoke Test

Stage 35C checks the real buyer journey before production launch.

## New page

```text
/admin-buyer-smoke-test.html
```

## New endpoint

```text
GET /api/admin/buyer-journey-smoke
```

## What it checks

```text
Homepage
Categories
Product detail
Checkout
Track order
Support request
Admin orders
M-PESA reconciliation
Product count
Sample product
Core API route patterns
```

## What it does not do

```text
It does not automatically create orders.
It does not trigger M-PESA.
It does not modify payments.
It does not edit products.
It does not change database schema.
```

## Test

```cmd
npm run stage35c:check
node --check server.js
npm run dev
```

Open:

```text
http://localhost:5173/admin-buyer-smoke-test.html
```

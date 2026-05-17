# SokoYetu Stage 31A: Product Catalogue Quality Audit

Stage 31A adds a protected read-only product catalogue audit page.

## New page

```text
/admin-catalog-audit.html
```

## New endpoint

```text
GET /api/admin/catalog-audit
```

## Token

This page reuses:

```env
ADMIN_ORDER_TOKEN
```

## What it checks

- Missing product image
- Weak or missing description
- Missing category
- Missing or invalid price
- Out-of-stock products
- Suspicious/counterfeit wording
- Demo/test/placeholder wording

## What it does not do

This stage does not edit products. It only flags issues so admin can fix listings manually.

## What this stage does not touch

```text
checkout
M-PESA STK Push
DNS
email forwarding
database schema
product import
seller verification logic
support queue logic
LiveKit
payment logic
```

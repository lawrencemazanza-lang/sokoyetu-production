# SokoYetu Mtaani Stage 33C: M-PESA Payment Reconciliation and Transaction Evidence Dashboard

Stage 33C is read-only. It reviews M-PESA payment records against order records.

## New page

```text
/admin-mpesa-reconciliation.html
```

## New endpoint

```text
GET /api/admin/mpesa-reconciliation
```

## Token

This page reuses:

```env
ADMIN_ORDER_TOKEN
```

## What it reviews

```text
payment ID
order ID
customer phone
customer email
payment amount
order amount
payment status
order payment status
order status
M-PESA receipt
checkout request ID
record creation time
```

## Flags

```text
missingReceipt
amountMismatch
Pending payment
Failed/cancelled payment
Payment has no linked order
Order payment status not marked paid
Order says paid but payment record is not paid
```

## Why this matters

Before production M-PESA is switched on, admin should understand how payment records appear in the database. After production is switched on, this page helps detect whether callback and order updates are working correctly.

## What this stage does not touch

```text
checkout logic
M-PESA STK Push
M-PESA callback logic
DNS
email forwarding
database schema
admin tokens
product editor logic
seller verification logic
support queue logic
LiveKit
payment logic
```

## Test

```cmd
npm run stage33c:check
node --check server.js
npm run dev
```

Open:

```text
http://localhost:5173/admin-mpesa-reconciliation.html
```


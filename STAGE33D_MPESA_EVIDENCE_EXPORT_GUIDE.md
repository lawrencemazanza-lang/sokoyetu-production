# SokoYetu Mtaani Stage 33D: M-PESA Evidence Export and Payment Audit Pack

Stage 33D is read-only. It exports payment and order evidence for audit records.

## New page

```text
/admin-mpesa-evidence.html
```

## New endpoint

```text
GET /api/admin/mpesa-evidence/export
```

## Export formats

```text
CSV
JSON
```

## Filters

```text
all
issues
paid
pending
failed
missing-receipt
amount-mismatch
```

## Evidence fields

```text
paymentId
orderId
customerName
customerEmail
phone
paymentAmount
orderAmount
deliveryFee
paymentStatus
paymentStatusCategory
orderPaymentStatus
orderStatus
mpesaReceipt
checkoutRequestId
deliveryAddress
flags
paymentCreatedAt
orderCreatedAt
```

## Use cases

```text
pre-production payment audit
post-production payment audit
Safaricom follow-up
refund review
customer dispute evidence
manual reconciliation records
```

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
npm run stage33d:check
node --check server.js
npm run dev
```

Open:

```text
http://localhost:5173/admin-mpesa-evidence.html
```

Then preview and download CSV and JSON.


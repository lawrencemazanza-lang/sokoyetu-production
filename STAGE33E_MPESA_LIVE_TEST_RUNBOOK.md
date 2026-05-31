# SokoYetu Mtaani Stage 33E: M-PESA Live Test Runbook and Manual Test Log

Stage 33E creates a controlled live-test runbook for the first small production M-PESA payment.

## New page

```text
/admin-mpesa-live-test.html
```

## What it does

- Provides a pre-live-payment checklist.
- Lets admin record manual live test notes in the browser.
- Exports the manual test log as CSV or JSON.
- Stores the log in browser localStorage only.

## Important limitation

This page does not write to the server or database. It is a browser-based operations checklist and manual log only.

## Manual log fields

```text
createdAt
tester
environment
orderId
phone
expectedAmount
actualAmount
mpesaReceipt
checkoutRequestId
result
notes
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
npm run stage33e:check
npm run dev
```

Open:

```text
http://localhost:5173/admin-mpesa-live-test.html
```

Then:

1. Tick checklist items.
2. Save checklist.
3. Add one test log.
4. Export CSV.
5. Export JSON.


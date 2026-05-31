# SokoYetu Mtaani Stage 33A: Production M-PESA Readiness Checklist and Daraja Switch Plan

Stage 33A is read-only. It does not switch M-PESA to production.

## New page

```text
/admin-mpesa-readiness.html
```

## New endpoint

```text
GET /api/admin/mpesa-production-readiness
```

## Token

This page reuses:

```env
ADMIN_ORDER_TOKEN
```

## What it checks

```text
MPESA_ENV
MPESA_MODE
MPESA_CONSUMER_KEY or MPESA_DARAJA_CONSUMER_KEY
MPESA_CONSUMER_SECRET or MPESA_DARAJA_CONSUMER_SECRET
MPESA_SHORTCODE or MPESA_BUSINESS_SHORTCODE or MPESA_PAYBILL or MPESA_TILL
MPESA_PASSKEY or MPESA_LIPA_NA_MPESA_PASSKEY
MPESA_CALLBACK_URL
recent payment records
admin registration lock
```

## Safe production switch plan

1. Keep sandbox/test checkout unchanged.
2. Confirm Safaricom production Daraja app approval.
3. Confirm live PayBill/Till/shortcode.
4. Confirm live consumer key, consumer secret and passkey.
5. Confirm callback URL uses HTTPS and points to Render production domain.
6. Add production variables only in Render environment variables.
7. Deploy and run one very small real payment test.
8. Confirm the M-PESA receipt and order status in admin orders.
9. Monitor Render logs and support queue.

## Do not switch if

```text
Production Daraja app is not approved
Production shortcode/passkey is missing
Callback URL is not HTTPS
Admin registration is open
Admin orders page cannot verify payment status
Support queue is not monitored
```

## What this stage does not touch

```text
checkout logic
M-PESA STK Push
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
npm run stage33a:check
node --check server.js
npm run dev
```

Open:

```text
http://localhost:5173/admin-mpesa-readiness.html
```


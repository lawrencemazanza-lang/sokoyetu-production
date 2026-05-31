# SokoYetu Stage 34A: Launch War Room and Production Monitoring Checklist

Stage 34A adds a central launch-day operations page.

## New page

```text
/admin-launch-war-room.html
```

## What it provides

```text
Public health checks
Quick operations links
Launch checklist
Local launch log
CSV export
JSON export
```

## Health checks

The page checks:

```text
/api/health
/
 /categories.html
 /seller-stores.html
 /help-center.html
 /track-order.html
 /support-request.html
 /checkout.html
 /api/products
 /site.webmanifest
 /sitemap.xml
```

## Launch monitoring links

```text
Admin Orders
Support Queue
M-PESA Readiness
M-PESA Environment Guard
M-PESA Reconciliation
M-PESA Evidence Export
M-PESA Live Test Runbook
M-PESA Incident Response
Public QA Audit
Accessibility Audit
Backup Tools
Track Order
```

## Important limitation

The checklist and launch log use browser localStorage only. They do not write to the server or database.

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
npm run stage34a:check
npm run dev
```

Open:

```text
http://localhost:5173/admin-launch-war-room.html
```

Then:

1. Run public health checks.
2. Tick launch checklist items.
3. Save checklist.
4. Add one launch log.
5. Export CSV.
6. Export JSON.

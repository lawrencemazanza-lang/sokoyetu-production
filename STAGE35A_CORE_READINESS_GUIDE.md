# SokoYetu Stage 35A: Core Production Readiness Audit and Critical Gap Report

Stage 35A is a hard launch-readiness audit. It is read-only.

## New page

```text
/admin-core-readiness.html
```

## New endpoint

```text
GET /api/admin/core-readiness/audit
```

## Token

This page uses:

```env
ADMIN_ORDER_TOKEN
```

## What it checks

```text
Critical public files
Critical admin files
Core route/code patterns
Environment variables
Admin registration exposure
M-PESA production switch guard
Database model counts where available
Product count
Order and payment model availability
Routes declared after final 404 fallback
Potential secret exposure in public files
```

## Launch decision states

```text
HOLD
REVIEW
CONTROLLED_TESTING_OK
```

## Important note about 404 fallback

After Stage 32E, the final 404 fallback must remain after all real routes. If any API or admin route is inserted after that fallback, Express may return 404 before reaching the route. Stage 35A checks this.

## What this stage does not touch

```text
checkout logic
M-PESA STK Push
M-PESA callback logic
database schema
order logic
product logic
seller verification logic
support queue logic
LiveKit
payment logic
```

## Test

```cmd
npm run stage35a:check
node --check server.js
npm run dev
```

Open:

```text
http://localhost:5173/admin-core-readiness.html
```

Paste `ADMIN_ORDER_TOKEN`, run the audit, and copy the gap report.

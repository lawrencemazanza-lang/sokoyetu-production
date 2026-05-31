# SokoYetu Mtaani Stage 35B: Route Order Hardening and PUBLIC_SITE_URL Fix

This repair moves only the exact Stage 32E friendly 404/500 fallback block. It refuses to move unrelated routes such as authRateLimit.

## Fixes

```text
Routes after final fallback
PUBLIC_SITE_URL missing locally
```

## Test

```cmd
npm run stage35b:check
node --check server.js
npm run dev
```

Then test:

```cmd
curl -i http://localhost:5173/api/admin/core-readiness/audit
curl -i -H "x-admin-order-token: SokoYetu Mtaani_admin_orders_2026_change_this_secret" http://localhost:5173/api/admin/core-readiness/audit
```


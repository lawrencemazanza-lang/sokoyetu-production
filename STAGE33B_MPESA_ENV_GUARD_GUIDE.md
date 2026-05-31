# SokoYetu Mtaani Stage 33B: Production M-PESA Environment Variable Mapping and Safe Switch Guard

Stage 33B is read-only. It does not switch M-PESA to production.

## New page

```text
/admin-mpesa-env-guard.html
```

## New endpoint

```text
GET /api/admin/mpesa-env-guard
```

## New scripts

```text
npm run stage33b:check
npm run mpesa:env-map
```

## What it does

- Scans `server.js` for `process.env.*` M-PESA/Daraja/Safaricom variables.
- Shows which referenced variables are configured.
- Groups variables by purpose: environment, consumer key, consumer secret, shortcode, passkey and callback URL.
- Adds a production guard warning if production/live mode appears requested without explicit confirmation.
- Redacts secret values.

## Safe switch guard

If production/live mode is requested, add this only after manual verification:

```env
MPESA_PRODUCTION_CONFIRMED=true
```

Do not add that flag until:

```text
Safaricom production app is approved
Live shortcode is confirmed
Live passkey is confirmed
Production consumer key and secret are confirmed
Callback URL uses HTTPS and points to Render production
One small real payment test is planned
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
npm run stage33b:check
npm run mpesa:env-map
node --check server.js
npm run dev
```

Open:

```text
http://localhost:5173/admin-mpesa-env-guard.html
```


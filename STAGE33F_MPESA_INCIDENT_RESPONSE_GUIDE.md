# SokoYetu Stage 33F: M-PESA Incident Response and Rollback Playbook

Stage 33F adds a local incident-response page for M-PESA payment issues.

## New page

```text
/admin-mpesa-incident.html
```

## What it provides

```text
Immediate response rules
Rollback checklist
Manual incident log
CSV export
JSON export
Escalation note template
Customer update template
Safaricom/Daraja follow-up template
```

## Important limitation

The page uses browser localStorage only. It does not write to the server or database.

## Incident examples

```text
Receipt exists but order remains pending
STK Push failure
Callback delay or no callback
Amount mismatch
Duplicate payment
Customer dispute
Refund review
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
npm run stage33f:check
npm run dev
```

Open:

```text
http://localhost:5173/admin-mpesa-incident.html
```

Then:

1. Tick rollback checklist items.
2. Save checklist.
3. Add one incident log.
4. Export CSV.
5. Export JSON.
6. Build and copy escalation note.

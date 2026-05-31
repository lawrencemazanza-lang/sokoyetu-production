# SokoYetu Mtaani Stage 34B: Public Trust Center and Buyer Safety Hub

Stage 34B adds a public Trust Center page.

## New page

```text
/trust-center.html
```

## What it covers

```text
Buyer safety
M-PESA payment guidance
Order tracking
Support requests
Returns and refunds
Seller standards
Fraud-prevention reminders
What to do if payment succeeds but order remains pending
```

## Updated files

```text
package.json
trust-center.html
public-nav.js
index.html
sitemap.xml
scripts/check-stage34b-trust-center.js
STAGE34B_TRUST_CENTER_GUIDE.md
STAGE34B_BUYER_SAFETY_COPY.md
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
npm run stage34b:check
npm run dev
```

Open:

```text
http://localhost:5173/trust-center.html
```


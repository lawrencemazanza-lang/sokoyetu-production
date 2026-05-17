# SokoYetu Stage 34C: Public How It Works and Delivery Information Hub

Stage 34C adds public guidance pages for the buyer journey and delivery expectations.

## New pages

```text
/how-it-works.html
/delivery-info.html
```

## What it covers

```text
Browsing products
Reviewing product details
Seller stores
Checkout with M-PESA
Order tracking
Support requests
Delivery process
Delivery evidence
Returns and refund links
Payment and delivery safety reminders
```

## Updated files

```text
package.json
public-nav.js
index.html
sitemap.xml
scripts/check-stage34c-how-it-works.js
STAGE34C_HOW_IT_WORKS_DELIVERY_GUIDE.md
STAGE34C_BUYER_JOURNEY_COPY.md
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
npm run stage34c:check
npm run dev
```

Open:

```text
http://localhost:5173/how-it-works.html
http://localhost:5173/delivery-info.html
```

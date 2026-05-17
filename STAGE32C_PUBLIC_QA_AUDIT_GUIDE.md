# SokoYetu Stage 32C: Public Site Quality Assurance and Broken-Link Audit

Stage 32C adds an internal public-site QA audit page.

## New page

```text
/admin-public-audit.html
```

## What it checks

The page checks whether these pages and assets are reachable:

```text
/
 /categories.html
 /product-detail.html?id=1
 /seller-stores.html
 /seller-store.html?sellerId=1
 /help-center.html
 /track-order.html
 /support-request.html
 /contact-support.html
 /faq.html
 /returns-policy.html
 /privacy-policy.html
 /terms-of-service.html
 /public-nav.css
 /public-nav.js
 /favicon.svg
 /site.webmanifest
 /sitemap.xml
 /robots.txt
 /api/products
```

## What it does not test

This page does not test real payment completion or M-PESA settlement. It also does not submit orders, edit products, or change database records.

## Updated files

```text
package.json
admin-public-audit.html
admin-control.html
robots.txt
scripts/check-stage32c-public-qa.js
STAGE32C_PUBLIC_QA_AUDIT_GUIDE.md
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
npm run stage32c:check
npm run dev
```

Open:

```text
http://localhost:5173/admin-public-audit.html
```

Then click **Run public site QA audit**.

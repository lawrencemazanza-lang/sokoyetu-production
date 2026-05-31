# SokoYetu Stage 31F: Buyer Journey Polish and Public Site Navigation Cleanup

Stage 31F creates a cleaner public buyer journey.

## New files

```text
public-nav.css
public-nav.js
scripts/check-stage31f-buyer-journey.js
STAGE31F_BUYER_JOURNEY_POLISH_GUIDE.md
```

## Updated public pages

The following pages load the shared public navigation:

```text
index.html
categories.html
product-detail.html
seller-stores.html
seller-store.html
help-center.html
track-order.html
support-request.html
contact-support.html
faq.html
returns-policy.html
privacy-policy.html
terms-of-service.html
data-protection.html
seller-policy.html
```

## Public buyer journey

```text
Homepage
→ Categories
→ Product Detail
→ Seller Store
→ Checkout
→ Track Order
→ Support Request
→ Help Center
```

## Cleanup performed

The homepage clutter blocks from the earlier public-link stages are removed:

```text
Stage 30E floating helpbar
Stage 31C category note block
Stage 31D product detail note block
Stage 31E seller stores note block
```

These are replaced by one consistent shared navigation and footer.

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
npm run stage31f:check
npm run dev
```

Open:

```text
http://localhost:5173/
http://localhost:5173/categories.html
http://localhost:5173/product-detail.html?id=1
http://localhost:5173/seller-stores.html
http://localhost:5173/help-center.html
```

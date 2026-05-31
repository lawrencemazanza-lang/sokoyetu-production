# SokoYetu Mtaani Stage 31E: Public Seller Storefronts and Seller Directory

Stage 31E adds public seller-store discovery.

## New pages

```text
/seller-stores.html
/seller-store.html?sellerId=SELLER_ID
```

## What it does

- Fetches products from `/api/products`
- Groups products by seller ID
- Shows a seller directory
- Shows seller-specific product listings
- Links seller products to `/product-detail.html?id=PRODUCT_ID`
- Adds seller-store links where possible

## Updated files

```text
package.json
seller-stores.html
seller-store.html
product-detail.html
categories.html
index.html
sitemap.xml
scripts/check-stage31e-seller-storefronts.js
STAGE31E_SELLER_STOREFRONTS_GUIDE.md
```

## What this stage does not touch

```text
checkout
M-PESA STK Push
DNS
email forwarding
database schema
product editor logic
seller verification logic
support queue logic
LiveKit
payment logic
```

## Test

```cmd
npm run stage31e:check
npm run dev
```

Open:

```text
http://localhost:5173/seller-stores.html
```

Then open a seller store.


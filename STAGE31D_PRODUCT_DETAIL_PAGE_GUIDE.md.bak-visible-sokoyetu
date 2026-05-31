# SokoYetu Stage 31D: Public Product Detail and Share Page

Stage 31D adds a public product-detail page.

## New page

```text
/product-detail.html?id=PRODUCT_ID
```

## What it does

- Loads products from `/api/products`
- Finds the product using the `id` query parameter
- Shows product image, name, category, stock, price, seller ID and description
- Provides customer links to shop, checkout, category directory and Help Center
- Allows buyers to copy the product link

## Updated files

```text
product-detail.html
categories.html
index.html
sitemap.xml
scripts/check-stage31d-product-detail.js
STAGE31D_PRODUCT_DETAIL_PAGE_GUIDE.md
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
npm run stage31d:check
npm run dev
```

Open:

```text
http://localhost:5173/categories.html
```

Then click a product detail link, or open:

```text
http://localhost:5173/product-detail.html?id=1
```

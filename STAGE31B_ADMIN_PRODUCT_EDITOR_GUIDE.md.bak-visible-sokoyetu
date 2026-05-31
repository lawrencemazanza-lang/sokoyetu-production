# SokoYetu Stage 31B: Admin Product Correction and Listing Editor

Stage 31B adds a protected admin product editor.

## New page

```text
/admin-product-editor.html
```

## New endpoints

```text
GET  /api/admin/products/manage
POST /api/admin/products/:id/update
```

## Token

This page reuses:

```env
ADMIN_ORDER_TOKEN
```

## Editable fields

```text
name
description
category
price
oldPrice
stock
imageUrl
```

## Safety rules

The API rejects:

```text
invalid product IDs
short product names
zero or negative price
negative stock
suspicious counterfeit wording
invalid image URLs
```

## What this stage does not touch

```text
checkout
M-PESA STK Push
DNS
email forwarding
database schema
product import
seller verification logic
support queue logic
LiveKit
payment logic
```

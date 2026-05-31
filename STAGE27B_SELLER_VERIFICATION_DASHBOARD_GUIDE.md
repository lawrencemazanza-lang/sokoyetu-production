# SokoYetu Mtaani Stage 27B: Seller Verification Dashboard

Stage 27B adds a protected admin seller verification dashboard.

## New page

```text
/seller-verification.html
```

## New endpoints

```text
GET  /api/admin/sellers/verification
POST /api/admin/sellers/:id/verification-note
```

## Required environment variable

Add this to local `.env` and Render Environment Variables:

```env
SELLER_VERIFICATION_TOKEN=SokoYetu Mtaani_seller_verify_2026_change_this_secret
```

Use a stronger secret in production.

## What admin can do

- View seller accounts.
- Search by seller name, email or phone.
- Filter sellers with products, without products or needing risk review.
- See product count and recent products.
- See soft risk flags such as missing phone, missing images, out-of-stock products and counterfeit wording.
- Record an operational seller decision note.

## Important limitation

This safe version does not add a new database table for persistent seller approval. It records seller decisions in server logs only. A later Stage 27C can add a proper database-backed seller verification model and migration.


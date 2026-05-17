# SokoYetu Stage 27C: Persistent Seller Verification

Stage 27C adds database-backed seller verification.

## New Prisma model

```text
SellerVerification
```

## New page

```text
/seller-verification-persistent.html
```

## New endpoints

```text
GET  /api/admin/sellers/persistent-verification
POST /api/admin/sellers/:id/persistent-verification
```

## Required environment variable

```env
SELLER_VERIFICATION_TOKEN=sokoyetu_seller_verify_2026_change_this_secret
```

## Required Prisma command

After applying the patch, run:

```cmd
npm run stage27c:prisma
```

This runs:

```cmd
npx prisma generate && npx prisma db push
```

## Important

This stage changes `prisma/schema.prisma`. Test locally before pushing to Render.

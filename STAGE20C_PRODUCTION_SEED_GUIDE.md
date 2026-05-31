# SokoYetu Mtaani Stage 20C: Production Seed

Your Render app is live, but /api/products returns:

```json
{"products":[]}
```

This means Neon/Render production database has tables but no product data.

## What this patch adds

```cmd
npm run seed:production
npm run products:count
```

The seed script is safe to rerun. It does not delete existing products.

## Deploy this patch

```cmd
git add package.json package-lock.json scripts/seed-production-data.js scripts/count-products.js STAGE20C_PRODUCTION_SEED_GUIDE.md
git commit -m "Add production seed script"
git push
```

## Run seed on Render

Go to:

```text
Render → Web Service → Shell
```

Then run:

```cmd
npm run seed:production
npm run products:count
```

If Shell is not available on your plan, temporarily change your Render Build Command to:

```cmd
npm install && npx prisma generate && npx prisma migrate deploy && npm run seed:production
```

Deploy once, then change it back to:

```cmd
npm install && npx prisma generate && npx prisma migrate deploy
```

## Verify

Open:

```text
https://sokoyetu-production-1.onrender.com/api/products
```

It should show products with IDs.

Then test Add to Cart again.



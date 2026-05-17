# SokoYetu Stage 29A: Security, Backup and Monitoring Review

Stage 29A adds a protected admin system health page.

## New page

```text
/admin-system-health.html
```

## New endpoint

```text
GET /api/admin/system-health
```

## Token

This page reuses:

```env
ADMIN_ORDER_TOKEN
```

## What it checks

- Database query health
- User count
- Seller count
- Product count
- Order count
- Payment count
- Support queue note count
- Recent orders
- Public site URL
- Support email
- M-PESA mode and environment
- Upload mode
- Admin registration flag

## What it does not expose

It does not return secret environment variable values such as database passwords, JWT secrets, M-PESA keys, Cloudinary secrets or admin tokens.

## Launch rule

If M-PESA is still in sandbox, the site is suitable for testing and soft-launch rehearsal but not for real public payments.

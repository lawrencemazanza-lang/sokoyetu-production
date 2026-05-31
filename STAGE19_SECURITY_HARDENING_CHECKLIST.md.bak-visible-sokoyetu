# SokoYetu Stage 19 Security Hardening Checklist

Stage 19 adds basic security controls without changing the main business features.

## What was added

- HTTP security headers through Helmet.
- General request rate limit.
- Authentication rate limit.
- Payment route rate limit.
- Upload/product route rate limit.
- Safer auth cookie defaults.
- Admin self-registration block unless explicitly enabled.
- HTTP method protection.
- Security configuration checker.

## New command

```cmd
npm run security:check
```

## Manual security checks

### Secrets

- [ ] Do not share `.env` publicly.
- [ ] Regenerate Daraja credentials if they were shared in chat or screenshots.
- [ ] Keep Cloudinary API secret private.
- [ ] Keep LiveKit API secret private.
- [ ] Use a long random JWT secret before deployment.
- [ ] Do not commit `.env` to GitHub.

### Authentication

- [ ] Buyer login works.
- [ ] Seller login works.
- [ ] Admin login works.
- [ ] Admin self-registration is blocked.
- [ ] Wrong passwords are rate-limited after repeated attempts.

### Payments

- [ ] Daraja STK Push still works.
- [ ] Callback still updates order and payment status.
- [ ] Payment routes are not publicly writable except expected callback endpoint.

### Uploads

- [ ] Cloudinary product uploads still work.
- [ ] Non-image files are rejected.
- [ ] Large images above the limit are rejected.

### Roles

- [ ] Buyers cannot open Seller Studio.
- [ ] Sellers cannot open Admin Centre.
- [ ] Buyers and sellers cannot use admin-only APIs.
- [ ] Admin AI Suite remains admin-only.

### Production before go-live

- [ ] NODE_ENV is set to production.
- [ ] HTTPS is enabled.
- [ ] PostgreSQL is used.
- [ ] Cloudinary mode is used.
- [ ] Admin setup is locked.
- [ ] Test users are removed or their passwords are changed.
- [ ] Backups are configured.
- [ ] Logging and monitoring are configured.

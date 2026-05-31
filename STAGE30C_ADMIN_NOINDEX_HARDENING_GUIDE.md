# SokoYetu Mtaani Stage 30C: Admin Page Privacy and Search-Index Hardening

Stage 30C reduces the chance that internal admin and operations pages are indexed by search engines.

## What changed

The following pages receive noindex/nofollow meta tags where present:

```text
admin-control.html
admin-orders.html
admin-support.html
admin-backup.html
admin-system-health.html
admin-launch.html
seller-verification.html
seller-verification-persistent.html
order-operations.html
seller-onboarding.html
```

`robots.txt` is also updated to disallow these internal paths.

## Important limitation

This is search-index hardening, not full authentication. Protected admin data is still secured by backend token checks such as:

```text
ADMIN_ORDER_TOKEN
SELLER_VERIFICATION_TOKEN
```

Keep those tokens private.

## What this stage does not touch

```text
checkout
M-PESA STK Push
DNS
email forwarding
database schema
product import
LiveKit
payment logic
```

## Test

```cmd
npm run stage30c:check
```

Then open:

```text
http://localhost:5173/robots.txt
http://localhost:5173/admin-control.html
```


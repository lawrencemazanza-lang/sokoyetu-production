# SokoYetu Mtaani Stage 30B: Admin Control Center and Operations Navigation Hub

Stage 30B adds one central admin navigation page.

## New page

```text
/admin-control.html
```

## Purpose

The control center links the main operational pages:

```text
/admin-orders.html
/admin-support.html
/admin-backup.html
/admin-system-health.html
/admin-launch.html
/seller-onboarding.html
/seller-verification.html
/seller-verification-persistent.html
/track-order.html
/support-request.html
/contact-support.html
/privacy-policy.html
/returns-policy.html
/terms-of-service.html
```

## Security note

This page is only a navigation hub. It does not expose environment secrets. Protected pages still require their own tokens.

## Tokens

```text
ADMIN_ORDER_TOKEN
SELLER_VERIFICATION_TOKEN
```

Keep both private.


# SokoYetu Mtaani Stage 29B: Admin Backup and Data Export

Stage 29B adds protected operational exports.

## New page

```text
/admin-backup.html
```

## New endpoint

```text
GET /api/admin/export/:type
```

## Token

This page reuses:

```env
ADMIN_ORDER_TOKEN
```

## Export types

```text
products
orders
payments
sellers
support
users
```

## Export formats

```text
CSV
JSON
```

## Recommended backup routine

| Frequency | Export |
|---|---|
| Daily during soft launch | Orders and payments |
| Weekly | Products, sellers and support notes |
| Before major deployments | All available exports |
| Monthly | Confirm database provider backup/recovery route |

## Security note

Exported files may include customer emails, phone numbers, delivery addresses, payment references and order information. Store them safely and do not upload them publicly.


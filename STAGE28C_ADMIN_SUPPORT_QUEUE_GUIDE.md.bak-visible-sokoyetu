# SokoYetu Stage 28C: Admin Support and Refund Queue

Stage 28C gives admin a protected page for reviewing customer support and refund requests.

## New page

```text
/admin-support.html
```

## New endpoints

```text
GET  /api/admin/support-queue
POST /api/admin/support-queue/:trackingId/action
```

## Token

This page reuses:

```env
ADMIN_ORDER_TOKEN
```

No new token is required.

## What admin can do

- View customer support requests.
- View refund requests.
- Search by order ID, phone, customer email or note text.
- Contact customer.
- Contact seller.
- Mark issue resolved.
- Keep refund under review.
- Mark refund requested.
- Cancel order.

## Database approach

This stage uses the existing `DeliveryTracking` model, so no Prisma migration is needed.

## Important

This stage records support actions and can update order status to `REFUND_REQUESTED` or `CANCELLED` when admin chooses those actions.

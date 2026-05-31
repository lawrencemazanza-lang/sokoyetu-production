# SokoYetu Mtaani Stage 26B: Admin Order Tracking and Status Updates

Stage 26B adds a protected admin order operations page.

## New page

```text
/admin-orders.html
```

## New endpoints

```text
GET  /api/admin/orders/ops
POST /api/admin/orders/:id/status
```

## Required environment variable

Add this to local `.env` and Render Environment Variables:

```env
ADMIN_ORDER_TOKEN=sokoyetu_admin_orders_2026_change_this_secret
```

Use a stronger secret in production.

## What admin can do

- View recent orders.
- Filter by order status.
- Search by order ID, phone, delivery address or customer email.
- See customer, payment, items and tracking notes.
- Update order status.
- Add admin tracking notes.

## Statuses

```text
PENDING_PAYMENT
PAID
PROCESSING
READY_FOR_DELIVERY
OUT_FOR_DELIVERY
DELIVERED
FAILED_PAYMENT
CANCELLED
REFUND_REQUESTED
REFUNDED
```

## Soft launch rule

Do not fulfil orders with failed or pending payments. Admin should manually confirm payment, seller availability and delivery details before dispatch.



# SokoYetu Stage 28B: Customer Support and Refund Request Portal

Stage 28B adds a public support request page for existing orders.

## New page

```text
/support-request.html
```

## New endpoint

```text
POST /api/orders/support-request
```

## Privacy protection

The customer must enter:

```text
Order ID
Phone number used at checkout
```

The API records the request only if the phone number matches the order or payment phone.

## Request types

```text
GENERAL_SUPPORT
DELIVERY_ISSUE
PAYMENT_ISSUE
PRODUCT_ISSUE
CANCELLATION_REQUEST
REFUND_REQUEST
```

## Database approach

This stage uses the existing `DeliveryTracking` model to record support notes, so no Prisma migration is needed.

## Operational effect

- Refund requests add a `REFUND_REQUESTED` tracking note and update the order status to `REFUND_REQUESTED`.
- Cancellation requests update the order to `CANCELLED` if the order is not already delivered.
- Other support requests add a `CUSTOMER_SUPPORT_REQUESTED` tracking note.

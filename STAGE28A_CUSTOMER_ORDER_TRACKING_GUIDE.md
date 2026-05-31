# SokoYetu Mtaani Stage 28A: Customer Order Tracking

Stage 28A adds a public customer order-tracking page.

## New page

```text
/track-order.html
```

## New endpoint

```text
POST /api/orders/track
```

## Privacy protection

The customer must enter:

```text
Order ID
Phone number used at checkout
```

The API returns order details only if the phone number matches the order or payment phone.

## What customers can see

- Order ID
- Total amount
- Order status
- Payment status
- Delivery address
- M-PESA receipt if available
- Items ordered
- Tracking timeline

## Test locally

```text
http://localhost:5173/track-order.html
```

Use a real order ID from admin orders and the phone used during checkout.


# SokoYetu Mtaani Stage 36B: Checkout Routing and STK Repair

Stage 36B fixes the issue where the cart still opens the old M-PESA modal instead of the full checkout page.

## Problem

The self-pickup option is on:

```text
/checkout.html
```

But some cart buttons still opened the old M-PESA modal from `app.js`, which only asked for M-PESA phone and delivery address.

## Fix

```text
Cart checkout buttons now route to /checkout.html.
M-PESA Checkout buttons now route to /checkout.html.
The checkout page keeps Home delivery and Self-pickup options.
The checkout page creates the order first, then sends STK Push.
```

## What this does not change

```text
No M-PESA credential changes
No callback changes
No database schema changes
No payment amount calculation changes
No product logic changes
```

## Test

```cmd
npm run stage36b:check
node --check server.js
npm run dev
```

Manual test:

1. Add product to cart.
2. Click cart checkout.
3. Confirm the browser opens `/checkout.html`, not the old modal.
4. Confirm Home delivery and Self-pickup choices appear.
5. Select Self-pickup.
6. Confirm delivery fee is KES 0.
7. Submit controlled order.
8. Confirm STK Push is sent or the exact Daraja error is displayed.


# SokoYetu Stage 18 User Interface Polish Checklist

Stage 18 is a clean-up stage. It does not change PostgreSQL, Daraja, Cloudinary or LiveKit credentials.

## What this patch does

- Hides the old unstable Admin AI launcher.
- Keeps the corrected Admin AI Suite V2.
- Keeps the Live Studio and Live Sellers buttons.
- Standardises floating button positions.
- Prevents blank product images from showing broken placeholders.
- Adds small focus and mobile-polish rules.
- Adds a temporary readiness badge on page load.
- Creates this checklist for manual review.

## Manual checks

### Buyer

- [ ] Buyer can log in.
- [ ] Buyer can view products.
- [ ] Buyer can add product to cart.
- [ ] Buyer can checkout.
- [ ] Buyer can see Live Sellers.
- [ ] Buyer cannot see admin-only controls.

### Seller

- [ ] Seller can log in.
- [ ] Seller can open Seller Studio.
- [ ] Seller can upload product images to Cloudinary.
- [ ] Seller can see Live Studio.
- [ ] Seller can start live session.
- [ ] Seller can share screen if no camera exists.

### Admin

- [ ] Admin can log in.
- [ ] Admin can see Admin AI Suite V2.
- [ ] Old unstable AI launcher is hidden.
- [ ] Admin can use Wholesaler Search.
- [ ] Admin can see orders and payments.
- [ ] Admin can see live sessions.

### Interface

- [ ] No duplicate AI buttons.
- [ ] No duplicate live buttons.
- [ ] Floating buttons do not overlap badly.
- [ ] Close buttons work on modals.
- [ ] Product cards do not show broken image icons.
- [ ] Mobile view is still usable.

## If something looks wrong

Run in the browser console:

```js
sokoyetuStage18Cleanup()
```

Then refresh the page.

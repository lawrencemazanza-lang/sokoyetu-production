# SokoYetu Mtaani Stage 26A: Order Operations Workflow

Stage 26A defines how SokoYetu Mtaani should handle orders during soft launch.

This stage does not change checkout, M-PESA, DNS, email forwarding, product import or LiveKit logic.

## Core workflow

```text
Customer pays
→ Admin confirms payment
→ Admin confirms seller availability
→ Admin confirms delivery details
→ Seller prepares item
→ Delivery is arranged
→ Order is marked delivered
```

## Order statuses

Use these statuses operationally:

```text
Pending Payment
Paid
Processing
Ready for Delivery
Out for Delivery
Delivered
Failed Payment
Cancelled
Refund Requested
Refunded
```

## Soft launch rule

During soft launch, fulfilment should stay manual. Admin must verify every paid order before seller dispatch.


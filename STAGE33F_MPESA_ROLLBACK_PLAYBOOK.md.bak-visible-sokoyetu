# Stage 33F: M-PESA Rollback Playbook

Use this if a live M-PESA test or early production payment creates unresolved risk.

## Stop conditions

Pause live payment exposure if any of the following occur:

- Customer receives M-PESA receipt but order remains unpaid.
- Payment amount differs from order amount.
- STK Push fails repeatedly.
- Callback errors appear in Render logs.
- Admin orders page cannot confirm payment status.
- Reconciliation dashboard shows missing receipts or unresolved mismatches.
- Duplicate customer payment is reported.

## Immediate actions

1. Preserve evidence.
2. Do not delete payment records.
3. Do not ask the customer to pay again if they have a receipt.
4. Export M-PESA evidence CSV.
5. Check admin orders and reconciliation.
6. Check Render logs.
7. Log the incident.
8. Send customer update if customer-facing.
9. Escalate to Safaricom/Daraja if needed.
10. If necessary, revert M-PESA environment variables to sandbox/test and redeploy.

## Customer message

```text
Hello,

Thank you for contacting SokoYetu. We are reviewing your M-PESA payment/order issue. Please do not make another payment while we verify the transaction. If you have an M-PESA confirmation message, keep it safely. We will check the payment receipt, order status and reconciliation record, then update you.

Regards,
SokoYetu Support
```

## Safaricom/Daraja follow-up evidence

Prepare:

```text
Business shortcode
Customer phone
M-PESA receipt
CheckoutRequestID
MerchantRequestID if available
Expected amount
Actual amount
Callback URL
Transaction date and time
Observed issue
Render log excerpt if available
```

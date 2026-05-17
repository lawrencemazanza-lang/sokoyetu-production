# Stage 33E: First Real M-PESA Payment Test Checklist

Use this only after production credentials are confirmed.

## Before payment

- [ ] Safaricom production Daraja app approved.
- [ ] Live PayBill, Till or shortcode confirmed.
- [ ] Live passkey confirmed.
- [ ] Production consumer key and consumer secret added in Render.
- [ ] Callback URL uses HTTPS and production domain.
- [ ] MPESA_PRODUCTION_CONFIRMED=true only after manual approval.
- [ ] Admin orders page opens.
- [ ] Reconciliation page opens.
- [ ] Evidence export page opens.
- [ ] Support queue is monitored.
- [ ] Small test amount selected.
- [ ] Test phone has enough balance.

## During payment

- [ ] Place one small test order.
- [ ] Trigger STK Push.
- [ ] Confirm phone prompt appears.
- [ ] Enter M-PESA PIN.
- [ ] Record M-PESA receipt.
- [ ] Record checkout request ID if visible.
- [ ] Confirm order appears in admin orders.
- [ ] Confirm payment appears in reconciliation.

## After payment

- [ ] Export all evidence CSV.
- [ ] Export issue-only CSV.
- [ ] Save live test log CSV.
- [ ] Save live test log JSON.
- [ ] Check Render logs.
- [ ] Confirm support queue has no unexpected issue.
- [ ] Decide pass, review or fail.

## Stop wider launch if

- [ ] STK Push fails.
- [ ] Receipt is issued but order status does not update.
- [ ] Payment record amount differs from order amount.
- [ ] Callback errors appear in Render logs.
- [ ] Admin cannot verify the payment.
- [ ] Customer support/refund process is unclear.

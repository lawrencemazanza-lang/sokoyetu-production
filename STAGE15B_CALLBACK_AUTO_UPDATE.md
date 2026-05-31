# SokoYetu Mtaani Stage 15B: Automatic M-PESA Callback Database Update

Your STK Push already works. Stage 15B confirms that the callback updates SokoYetu Mtaani automatically.

## What this patch adds

New scripts:

```cmd
npm run mpesa:latest
npm run mpesa:mock-callback
npm run mpesa:poll
```

## Test 1: Prove your callback code updates PostgreSQL

1. Start SokoYetu Mtaani:

```cmd
npm run dev
```

2. In another CMD, make sure you already have a latest STK payment:

```cmd
npm run mpesa:latest
```

3. Run the mock callback:

```cmd
npm run mpesa:mock-callback
```

Expected result:

```text
Payment: PAID
Order paymentStatus: PAID
Order orderStatus: PAYMENT_CONFIRMED
```

This proves your SokoYetu Mtaani callback route works locally.

## Test 2: Real Safaricom callback

For real automatic update, MPESA_CALLBACK_URL must point to SokoYetu Mtaani, not Webhook.site.

Webhook.site proves Safaricom can send a callback, but it cannot update your SokoYetu Mtaani database.

You need:

```env
MPESA_CALLBACK_URL="https://PUBLIC_URL/api/payments/mpesa/callback"
```

where PUBLIC_URL forwards to:

```text
http://localhost:5173
```

If ngrok .dev is rejected by Safaricom, try Cloudflare Tunnel:

```cmd
cloudflared tunnel --url http://localhost:5173
```

Then use the generated HTTPS trycloudflare.com URL as:

```env
MPESA_CALLBACK_URL="https://something.trycloudflare.com/api/payments/mpesa/callback"
```

Restart SokoYetu Mtaani after changing .env.

Then run:

```cmd
npm run mpesa:stk
npm run mpesa:poll
```

If Safaricom sends the callback to SokoYetu Mtaani, the poll should eventually show PAID or FAILED.


# SokoYetu Step 15: Real Safaricom Daraja Sandbox STK Push

This step changes SokoYetu from demo M-PESA mode to real Daraja sandbox testing.

## What you need

1. Safaricom Daraja developer account.
2. Daraja sandbox app credentials: Consumer Key, Consumer Secret and Passkey.
3. Public callback URL, usually from ngrok during local testing.
4. SokoYetu server running on port 5173.

## A. Daraja app

Open the Safaricom Daraja Developer Portal, create or open a sandbox app, enable M-PESA Express / Lipa na M-PESA Online, then copy the Consumer Key, Consumer Secret and Passkey.

Sandbox shortcode normally used for Daraja testing:

```text
174379
```

## B. Public callback URL with ngrok

Safaricom cannot call localhost. Your local callback:

```text
http://localhost:5173/api/payments/mpesa/callback
```

must become a public HTTPS URL, such as:

```text
https://abc123.ngrok-free.app/api/payments/mpesa/callback
```

Run SokoYetu in one CMD:

```cmd
npm run dev
```

Run ngrok in a second CMD:

```cmd
ngrok http 5173
```

Copy the HTTPS forwarding URL and use it in `.env`.

## C. Update .env

Open:

```cmd
notepad .env
```

Set:

```env
MPESA_MODE="daraja"
MPESA_ENV="sandbox"
MPESA_SHORTCODE="174379"
MPESA_TRANSACTION_TYPE="CustomerPayBillOnline"
MPESA_CONSUMER_KEY="PASTE_YOUR_DARAJA_CONSUMER_KEY"
MPESA_CONSUMER_SECRET="PASTE_YOUR_DARAJA_CONSUMER_SECRET"
MPESA_PASSKEY="PASTE_YOUR_DARAJA_PASSKEY"
MPESA_CALLBACK_URL="https://YOUR_NGROK_URL/api/payments/mpesa/callback"
```

## D. Install helper scripts

```cmd
node apply-step15-daraja-sandbox.js
```

Then check:

```cmd
npm run mpesa:check
npm run mpesa:token
```

If token works, credentials are correct.

## E. Test STK

Keep SokoYetu running in one CMD and ngrok running in another CMD. In a third CMD:

```cmd
npm run mpesa:stk
```

Default test uses:

```text
Buyer: testbuyer3@sokoyetu.co.ke
Password: Test12345
Product ID: 2
Phone: 254708374149
```

Or pass your own test number:

```cmd
node scripts/test-mpesa-stk.js testbuyer3@sokoyetu.co.ke Test12345 2 2547XXXXXXXX "Nairobi CBD, Kenya"
```

## Success indicators

The response should include fields such as MerchantRequestID, CheckoutRequestID, ResponseCode and ResponseDescription. In SokoYetu, the payment status should move to STK_SENT, and the order status should move to WAITING_MPESA_CONFIRMATION.

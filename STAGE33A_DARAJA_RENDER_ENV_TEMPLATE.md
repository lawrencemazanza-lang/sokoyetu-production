# Stage 33A: Render Environment Template for Production M-PESA

Use this only after Safaricom production credentials are issued.

```env
MPESA_ENV=production
MPESA_MODE=production

MPESA_CONSUMER_KEY=PASTE_PRODUCTION_CONSUMER_KEY_HERE
MPESA_CONSUMER_SECRET=PASTE_PRODUCTION_CONSUMER_SECRET_HERE

MPESA_SHORTCODE=PASTE_LIVE_PAYBILL_OR_TILL_SHORTCODE_HERE
MPESA_PASSKEY=PASTE_LIVE_PASSKEY_HERE

MPESA_CALLBACK_URL=https://www.mySokoYetu Mtaani.co.ke/api/mpesa/callback
```

Your current code may use slightly different variable names. Stage 33A checks common aliases, but before switching you must confirm the exact variables used in `server.js`.

Never commit real production keys to GitHub.


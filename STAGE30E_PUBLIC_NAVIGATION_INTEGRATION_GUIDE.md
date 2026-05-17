# SokoYetu Stage 30E: Public Navigation and Customer Service Link Integration

Stage 30E makes the public customer service pages easier to find.

## What changed

The homepage now includes customer service shortcuts to:

```text
/help-center.html
/track-order.html
/support-request.html
/returns-policy.html
/contact-support.html
```

The sitemap also confirms public service pages including:

```text
/help-center.html
/track-order.html
/support-request.html
/contact-support.html
/returns-policy.html
/faq.html
```

## What this stage does not touch

```text
checkout logic
M-PESA STK Push
DNS
email forwarding
admin tokens
database schema
product import
seller verification logic
support queue logic
LiveKit
payment logic
```

## Test

```cmd
npm run stage30e:check
npm run dev
```

Open:

```text
http://localhost:5173/
http://localhost:5173/help-center.html
http://localhost:5173/track-order.html
http://localhost:5173/support-request.html
```

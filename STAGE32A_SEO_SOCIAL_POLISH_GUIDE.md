# SokoYetu Mtaani Stage 32A: SEO, Social Sharing and Public Metadata Polish

Stage 32A improves metadata on public-facing pages.

## What it adds

Each public page receives:

```text
title
meta description
canonical URL
Open Graph title
Open Graph description
Open Graph URL
Open Graph image
Twitter summary card
theme-color
```

## Pages updated

```text
index.html
categories.html
product-detail.html
seller-stores.html
seller-store.html
help-center.html
track-order.html
support-request.html
contact-support.html
faq.html
returns-policy.html
privacy-policy.html
terms-of-service.html
data-protection.html
seller-policy.html
```

## Additional file

```text
sokoyetu-structured-data.json
```

## What this stage does not touch

```text
checkout logic
M-PESA STK Push
DNS
email forwarding
database schema
admin tokens
product editor logic
seller verification logic
support queue logic
LiveKit
payment logic
```

## Test

```cmd
npm run stage32a:check
npm run dev
```

Open:

```text
http://localhost:5173/
http://localhost:5173/categories.html
http://localhost:5173/help-center.html
```



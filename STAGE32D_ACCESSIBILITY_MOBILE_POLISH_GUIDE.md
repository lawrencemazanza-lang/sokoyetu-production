# SokoYetu Mtaani Stage 32D: Accessibility and Mobile Usability Polish

Stage 32D adds shared accessibility and mobile usability improvements.

## New files

```text
public-a11y.css
public-a11y.js
admin-accessibility-audit.html
scripts/check-stage32d-accessibility.js
STAGE32D_ACCESSIBILITY_MOBILE_POLISH_GUIDE.md
```

## What the public accessibility layer adds

```text
Skip-to-main-content link
Visible keyboard focus styles
Reduced-motion support
Lazy image loading helper
Image alt fallback helper
Form aria-label fallback helper
Basic touch target improvements
Small live-region feedback for button/link actions
Mobile table overflow handling
```

## Updated public pages

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
checkout.html
```

## Internal audit page

```text
/admin-accessibility-audit.html
```

The audit checks basic signals such as:

```text
shared accessibility assets
h1 presence
main element presence
title presence
image alt attributes
form labels
empty buttons
empty links
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
npm run stage32d:check
npm run dev
```

Open:

```text
http://localhost:5173/
http://localhost:5173/admin-accessibility-audit.html
```

Then click **Run accessibility audit**.


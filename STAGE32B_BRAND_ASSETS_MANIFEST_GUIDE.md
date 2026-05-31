# SokoYetu Mtaani Stage 32B: Brand Assets, Favicon and Web App Manifest

Stage 32B gives the public site stronger browser and sharing identity.

## New files

```text
favicon.svg
sokoyetu-icon.svg
sokoyetu-share.svg
site.webmanifest
scripts/check-stage32b-brand-assets.js
STAGE32B_BRAND_ASSETS_MANIFEST_GUIDE.md
```

## Updated public pages

The main public pages now include:

```text
favicon link
web app manifest link
application-name metadata
mobile web app metadata
Open Graph share image
Twitter share image
```

## Important note

This stage does **not** add a service worker or offline caching. That is intentional because checkout and M-PESA flows should not be affected by stale cached pages.

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
npm run stage32b:check
npm run dev
```

Open:

```text
http://localhost:5173/favicon.svg
http://localhost:5173/site.webmanifest
http://localhost:5173/
```



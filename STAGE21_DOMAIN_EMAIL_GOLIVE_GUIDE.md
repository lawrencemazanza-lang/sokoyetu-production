# SokoYetu Mtaani Stage 21: Domain, Business Email and Go-Live Guide

Stage 21 prepares the live SokoYetu Mtaani deployment for public use.

This stage does not change cart, checkout, M-PESA, database, Cloudinary or LiveKit logic.

## 1. Choose the public domain

Recommended options:

```text
SokoYetu Mtaani.co.ke
www.SokoYetu Mtaani.co.ke
shop.SokoYetu Mtaani.co.ke
```

For launch, using `www.SokoYetu Mtaani.co.ke` or `shop.SokoYetu Mtaani.co.ke` is usually simpler because subdomains use CNAME records cleanly.

## 2. Add the custom domain in Render

Go to:

```text
Render Dashboard → SokoYetu Mtaani-production-1 → Settings → Custom Domains
```

Add the domain, for example:

```text
www.SokoYetu Mtaani.co.ke
```

Render will show DNS records to add at your domain provider.

## 3. Configure DNS

At your domain registrar or DNS provider:

For a subdomain such as `www`:

```text
Type: CNAME
Name/Host: www
Value/Target: SokoYetu Mtaani-production-1.onrender.com
```

For root/apex domain `SokoYetu Mtaani.co.ke`, follow the exact records Render gives you. If your DNS provider supports CNAME flattening, ALIAS or ANAME, use the option recommended by your provider and Render.

Remove conflicting old A, AAAA or CNAME records for the same host before verifying.

## 4. Verify domain in Render

After DNS is added:

```text
Render → Custom Domains → Verify
```

DNS can take minutes or longer to propagate. Once verified, Render provisions TLS/HTTPS.

## 5. Update environment variables after domain works

In Render environment variables, add or update:

```env
PUBLIC_SITE_URL=https://www.SokoYetu Mtaani.co.ke
SUPPORT_EMAIL=support@SokoYetu Mtaani.co.ke
BUSINESS_NAME=SokoYetu Mtaani
MPESA_CALLBACK_URL=https://www.SokoYetu Mtaani.co.ke/api/payments/mpesa/callback
```

Then redeploy.

## 6. Business email

Create at least:

```text
support@SokoYetu Mtaani.co.ke
orders@SokoYetu Mtaani.co.ke
admin@SokoYetu Mtaani.co.ke
```

Possible providers:

```text
Google Workspace
Zoho Mail
Microsoft 365
Namecheap Private Email
Your domain registrar email service
```

After choosing a provider, add the provider's MX records in your DNS dashboard.

## 7. Customer-facing cleanup

Check these pages:

```text
/
checkout.html
privacy-policy.html
terms-of-service.html
returns-policy.html
seller-policy.html
contact-support.html
faq.html
data-protection.html
```

Remove any visible words such as:

```text
demo
test
placeholder
sandbox
fake
coming soon
```

Keep sandbox wording only inside admin/internal documentation, not customer screens.

## 8. M-PESA production note

Current app works with Daraja sandbox. Public commercial launch needs:

```text
Production Daraja app
Production consumer key and secret
Production shortcode
Production passkey
Approved business PayBill or Till
Correct callback URL using the final domain
```

Do not process real customer orders using sandbox credentials.

## 9. Final command

Run locally:

```cmd
npm run stage21:check
```

Warnings are acceptable while preparing. Blocking issues must be fixed before public launch.


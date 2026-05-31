# SokoYetu Mtaani Stage 20: Production Deployment Guide

This stage prepares SokoYetu Mtaani for deployment on Render.

## What this patch added

- Deployment scripts in package.json
- render.yaml blueprint
- .env.production.example
- Deployment readiness checker
- Stronger .gitignore
- This guide

## Important warning

Do not upload your real .env file to GitHub.

Your real secrets must be added in the hosting dashboard as environment variables.

## Files to commit to GitHub

Commit these:

```text
app.js
server.js
style.css
index.html
livekit-room.html
package.json
package-lock.json
prisma/schema.prisma
prisma/migrations
render.yaml
scripts
*.md guides
```

Do not commit:

```text
.env
node_modules
dev.db
uploads/products
cookies.txt
```

## Render deployment method

### 1. Push project to GitHub

In the project folder:

```cmd
git init
git add .
git commit -m "Prepare SokoYetu Mtaani for production deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Create Render PostgreSQL database

In Render:

```text
New → PostgreSQL
Name: SokoYetu Mtaani-postgres
Database: SokoYetu Mtaani
User: SokoYetu Mtaani
```

Copy the internal connection string.

### 3. Create Render Web Service

In Render:

```text
New → Web Service
Connect your GitHub repository
Runtime: Node
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
Health Check Path: /api/health
```

### 4. Add environment variables

Add the production values from:

```text
.env.production.example
```

Use Render's environment variables panel. Do not paste secrets into code.

Required variables include:

```text
NODE_ENV
DATABASE_URL
JWT_SECRET
ADMIN_REGISTRATION_ENABLED
UPLOAD_MODE
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
MPESA_MODE
MPESA_ENV
MPESA_SHORTCODE
MPESA_TRANSACTION_TYPE
MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET
MPESA_PASSKEY
MPESA_CALLBACK_URL
LIVEKIT_URL
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
```

### 5. Set M-PESA callback after deployment

After Render gives your deployed URL, update:

```env
MPESA_CALLBACK_URL="https://YOUR-RENDER-DOMAIN/api/payments/mpesa/callback"
```

Example:

```env
MPESA_CALLBACK_URL="https://SokoYetu Mtaani-web.onrender.com/api/payments/mpesa/callback"
```

### 6. Deploy

Click Manual Deploy or wait for auto-deploy.

Check:

```text
https://YOUR-RENDER-DOMAIN/api/health
https://YOUR-RENDER-DOMAIN/api/products
```

## After deploy testing

Test:

- Buyer login
- Seller login
- Admin login
- Products load
- Cart works
- Checkout works
- M-PESA STK sends
- M-PESA callback updates database
- Cloudinary image upload works
- LiveKit room opens
- Admin AI Suite opens
- Wholesaler import works

## If deployment fails

Check:

- Build logs
- Environment variables
- DATABASE_URL format
- Prisma migration logs
- Whether package-lock.json is committed
- Whether NODE_ENV=production changed cookies while testing over HTTPS


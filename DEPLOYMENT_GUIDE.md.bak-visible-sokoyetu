# SokoYetu Deployment Guide

## Current status

This project is now a full-stack local development build with:

- Node.js and Express backend
- Prisma database layer
- SQLite local database
- Role-based authentication for buyer, seller and admin
- Product database
- Cart and order system
- M-PESA demo flow
- Seller Studio
- Admin Control Centre
- Admin AI Suite V2
- Product image upload to local uploads folder
- Delivery tracking
- Legal and support pages

## Local run

```cmd
cd "C:\Users\PC\Desktop\sokoyetu-fullstack\sokoyetu-elite-checked-fixed"
npm run dev
```

Open:

```text
http://localhost:5173/
```

Health check:

```text
http://localhost:5173/api/health
```

## Production warning

Do not launch this as a real public commercial marketplace until these are completed:

1. Move database from SQLite to PostgreSQL.
2. Move product images from local uploads to Cloudinary, Amazon S3 or another durable storage provider.
3. Replace M-PESA demo mode with real Safaricom Daraja credentials.
4. Use a real public callback URL for M-PESA.
5. Add HTTPS through the hosting provider.
6. Use a long secure JWT secret.
7. Review privacy, terms, returns, seller and data protection pages.
8. Add backup and monitoring.
9. Add admin account control and remove test accounts.
10. Test buyer, seller, admin, payment and order flows end to end.

## Recommended production structure

For a small launch:

- Frontend and backend: Render, Railway, DigitalOcean App Platform or VPS
- Database: PostgreSQL
- Images: Cloudinary or Amazon S3
- M-PESA: Safaricom Daraja
- Live selling: LiveKit, Agora or Twilio Live later

## Environment setup

Copy:

```cmd
copy .env.example .env
```

Then fill:

- DATABASE_URL
- JWT_SECRET
- MPESA credentials
- callback URL
- image storage credentials later

## Production command

```cmd
npm install
npx prisma generate
npm start
```

## Health check

```cmd
npm run health
```

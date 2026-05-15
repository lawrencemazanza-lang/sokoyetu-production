# Next Steps After Step 13

Step 13 prepared the project for deployment, but it did not make it production-live.

## Step 14: PostgreSQL migration

The next technical step is moving from SQLite to PostgreSQL.

Why:
- SQLite is okay for local development.
- PostgreSQL is better for real multi-user web hosting.
- Most cloud hosts support PostgreSQL easily.

## Step 15: Real M-PESA Daraja

After PostgreSQL:
- Create/confirm Safaricom Daraja app.
- Add Consumer Key, Consumer Secret and Passkey.
- Use sandbox first.
- Use a public callback URL.
- Test STK Push.
- Then move to live credentials.

## Step 16: Image storage

Move from local uploads to:
- Cloudinary
- Amazon S3
- DigitalOcean Spaces
- Another durable file storage

## Step 17: Real livestreaming

Choose a provider:
- LiveKit
- Agora
- Twilio Live

## Step 18: Final deployment

Deploy backend, database, environment variables, image storage, domain, HTTPS and monitoring.

# SokoYetu Step 14: SQLite to PostgreSQL Migration

This step moves the project from local SQLite to PostgreSQL.

## Why this is needed

SQLite is fine for local testing, but PostgreSQL is better for a real multi-user marketplace because it handles concurrent users, hosted environments, backups and scaling better.

Prisma's PostgreSQL quickstart says PostgreSQL requires a running database server and a connection string, and the required packages include `@prisma/adapter-pg` and `pg`. It also shows the Prisma Client being created with `new PrismaPg({ connectionString })` and passed into `new PrismaClient({ adapter })`.

## Before you start

Keep a copy of your current project folder. This patch backs up important files, but a full folder copy is safer.

Your current SQLite database file is:

```text
dev.db
```

Do not delete it.

## Step A: Create a PostgreSQL database

You need PostgreSQL installed locally, or you need a cloud PostgreSQL database.

### Local PostgreSQL example

If you installed PostgreSQL and know your password, create the database using pgAdmin or Command Prompt:

```cmd
psql -U postgres -c "CREATE DATABASE sokoyetu;"
```

If `psql` is not recognized, PostgreSQL is not in your Windows PATH. Use pgAdmin to create a database called:

```text
sokoyetu
```

## Step B: Update .env

Open:

```cmd
notepad .env
```

Change the database line from SQLite to PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/sokoyetu?schema=public"
```

Replace `YOUR_POSTGRES_PASSWORD` with your real PostgreSQL password.

Do not change your M-PESA demo settings yet.

## Step C: Run the patch

Copy this file into the project folder:

```text
apply-step14-postgresql-migration.js
```

Then run:

```cmd
cd "C:\Users\PC\Desktop\sokoyetu-fullstack\sokoyetu-elite-checked-fixed"
node apply-step14-postgresql-migration.js
```

## Step D: Install PostgreSQL packages

Run:

```cmd
npm install pg @prisma/adapter-pg
```

## Step E: Create PostgreSQL tables

Run:

```cmd
npx prisma migrate dev --name init_postgres
npx prisma generate
```

## Step F: Seed PostgreSQL

Run:

```cmd
node seed-postgres-data.js
```

This recreates the important test data in PostgreSQL:

```text
Admin: admin@sokoyetu.co.ke / Admin12345
Seller: demoseller@sokoyetu.co.ke / Seller12345
Buyer: testbuyer3@sokoyetu.co.ke / Test12345
```

It also seeds products and wholesalers.

## Step G: Start the server

Run:

```cmd
npm run dev
```

Open:

```text
http://localhost:5173/api/health
http://localhost:5173/api/products
```

Then test:

```text
Buyer login
Seller Studio
Admin Centre
Admin AI Suite
Wholesaler Search
Cart and checkout
Tracking
```

## If migration fails

Most failures are caused by one of these:

1. PostgreSQL is not running.
2. The database `sokoyetu` does not exist.
3. The PostgreSQL password in `.env` is wrong.
4. `DATABASE_URL` still says `file:./dev.db`.
5. `pg` and `@prisma/adapter-pg` are not installed.
6. Old SQLite migrations were not backed up.

## Rollback to SQLite

If you need to return to SQLite, restore the backed-up files:

```text
server.js.backup-postgres-...
schema.prisma.backup-postgres-...
.env.backup-postgres-...
```

Then set:

```env
DATABASE_URL="file:./dev.db"
```

and use the SQLite server adapter again.

# SokoYetu Stage 16: Production Image Storage with Cloudinary

## What changed

The image upload endpoint still uses the same frontend routes:

```text
POST  /api/uploads/product-image
PATCH /api/products/:id/image
```

But storage is now controlled through `.env`.

## Local mode

```env
UPLOAD_MODE="local"
```

Images are stored in:

```text
uploads/products
```

## Cloudinary mode

```env
UPLOAD_MODE="cloudinary"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Uploaded product images will be stored in Cloudinary under:

```text
sokoyetu/products
```

and the database will store the Cloudinary secure image URL.

## Test

Run:

```cmd
npm run images:check
```

Then start the server:

```cmd
npm run dev
```

Sign in as seller or admin, upload a product image, and check whether the saved product image URL starts with:

```text
https://res.cloudinary.com/
```

## Production note

Cloudinary mode is better for deployment because local uploads on a server can be lost during redeploys, scaling, or container rebuilds.

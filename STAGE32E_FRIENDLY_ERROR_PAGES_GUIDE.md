# SokoYetu Mtaani Stage 32E: Friendly Error Pages and Public Recovery Flow

Stage 32E adds friendly recovery pages for broken or unavailable routes.

## New pages

```text
/404.html
/500.html
```

## Server fallback

Missing public pages should show `404.html`. Missing API routes should return JSON.

## Test

```cmd
npm run stage32e:check
node --check server.js
npm run dev
```

Open:

```text
http://localhost:5173/not-a-real-page
http://localhost:5173/api/not-a-real-endpoint
http://localhost:5173/404.html
http://localhost:5173/500.html
```


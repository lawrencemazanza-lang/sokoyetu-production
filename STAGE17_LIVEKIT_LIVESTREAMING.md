# SokoYetu Stage 17: Real Livestreaming Provider

This stage connects SokoYetu live shopping to LiveKit.

## Added routes

GET /api/live/config
GET /api/live/sessions
GET /api/live/my-sessions
POST /api/live/sessions
PATCH /api/live/sessions/:id/end
POST /api/live/sessions/:id/token

## Added frontend

- Live Studio button for sellers and admins
- Live Sellers button for signed-in users
- livekit-room.html

## Required .env values

LIVEKIT_URL="wss://your-project.livekit.cloud"
LIVEKIT_API_KEY="your_livekit_api_key"
LIVEKIT_API_SECRET="your_livekit_api_secret"

## Commands

npm install livekit-server-sdk
npx prisma migrate dev --name add_live_sessions
npx prisma generate
npm run livekit:check
npm run dev

## Test

Sign in as seller, click Live Studio, create a session, allow camera and microphone.
Then sign in as buyer in another browser or incognito window, click Live Sellers, and join.

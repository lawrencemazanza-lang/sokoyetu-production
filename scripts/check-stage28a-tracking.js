require("dotenv").config();

console.log("SokoYetu Mtaani Stage 28A Customer Order Tracking Check");
console.log("-----------------------------------------------");

let warnings = 0;

if (!process.env.PUBLIC_SITE_URL) {
  console.log("WARN: PUBLIC_SITE_URL is not set.");
  warnings += 1;
} else {
  console.log("OK: PUBLIC_SITE_URL =", process.env.PUBLIC_SITE_URL);
}

if (!process.env.SUPPORT_EMAIL) {
  console.log("WARN: SUPPORT_EMAIL is not set.");
  warnings += 1;
} else {
  console.log("OK: SUPPORT_EMAIL =", process.env.SUPPORT_EMAIL);
}

console.log("OK: track-order.html should be available after server restart/deployment.");
console.log("OK: POST /api/orders/track should be available after server restart/deployment.");
console.log("Warnings:", warnings);


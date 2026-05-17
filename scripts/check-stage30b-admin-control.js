require("dotenv").config();

console.log("SokoYetu Stage 30B Admin Control Center Check");
console.log("--------------------------------------------");

let warnings = 0;

if (!process.env.PUBLIC_SITE_URL) {
  console.log("WARN: PUBLIC_SITE_URL is not set.");
  warnings += 1;
} else {
  console.log("OK: PUBLIC_SITE_URL =", process.env.PUBLIC_SITE_URL);
}

if (!process.env.ADMIN_ORDER_TOKEN) {
  console.log("WARN: ADMIN_ORDER_TOKEN is not set.");
  warnings += 1;
} else {
  console.log("OK: ADMIN_ORDER_TOKEN =", process.env.ADMIN_ORDER_TOKEN.slice(0, 4) + "...hidden");
}

if (!process.env.SELLER_VERIFICATION_TOKEN) {
  console.log("WARN: SELLER_VERIFICATION_TOKEN is not set. Seller verification pages may not work.");
  warnings += 1;
} else {
  console.log("OK: SELLER_VERIFICATION_TOKEN =", process.env.SELLER_VERIFICATION_TOKEN.slice(0, 4) + "...hidden");
}

console.log("OK: admin-control.html should be available after server restart/deployment.");
console.log("Warnings:", warnings);

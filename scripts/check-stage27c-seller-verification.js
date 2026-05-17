require("dotenv").config();

console.log("SokoYetu Stage 27C Persistent Seller Verification Check");
console.log("-----------------------------------------------------");

let warnings = 0;

if (!process.env.SELLER_VERIFICATION_TOKEN) {
  console.log("WARN: SELLER_VERIFICATION_TOKEN is not set.");
  warnings += 1;
} else {
  console.log("OK: SELLER_VERIFICATION_TOKEN =", process.env.SELLER_VERIFICATION_TOKEN.slice(0, 4) + "...hidden");
}

if (!process.env.DATABASE_URL) {
  console.log("WARN: DATABASE_URL is not set.");
  warnings += 1;
} else {
  console.log("OK: DATABASE_URL =", process.env.DATABASE_URL.slice(0, 4) + "...hidden");
}

console.log("");
console.log("Required after applying this stage:");
console.log("1. npm run stage27c:prisma");
console.log("2. npm run dev");
console.log("3. Open /seller-verification-persistent.html");
console.log("");
console.log("Warnings:", warnings);

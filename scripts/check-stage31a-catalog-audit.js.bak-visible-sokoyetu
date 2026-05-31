require("dotenv").config();

console.log("SokoYetu Stage 31A Product Catalogue Quality Audit Check");
console.log("-------------------------------------------------------");

let warnings = 0;

if (!process.env.ADMIN_ORDER_TOKEN) {
  console.log("WARN: ADMIN_ORDER_TOKEN is not set. Catalogue audit page reuses this token.");
  warnings += 1;
} else {
  console.log("OK: ADMIN_ORDER_TOKEN =", process.env.ADMIN_ORDER_TOKEN.slice(0, 4) + "...hidden");
}

if (!process.env.DATABASE_URL) {
  console.log("WARN: DATABASE_URL is not set.");
  warnings += 1;
} else {
  console.log("OK: DATABASE_URL =", process.env.DATABASE_URL.slice(0, 4) + "...hidden");
}

console.log("OK: admin-catalog-audit.html should be available after server restart/deployment.");
console.log("OK: /api/admin/catalog-audit should be available after server restart/deployment.");
console.log("Warnings:", warnings);

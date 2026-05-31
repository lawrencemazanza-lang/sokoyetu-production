require("dotenv").config();

console.log("SokoYetu Stage 33C M-PESA Reconciliation Check");
console.log("----------------------------------------------");

let warnings = 0;

if (!process.env.ADMIN_ORDER_TOKEN) {
  console.log("WARN: ADMIN_ORDER_TOKEN is not set.");
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

const fs = require("fs");
const path = require("path");
const root = process.cwd();

const requiredFiles = [
  "admin-mpesa-reconciliation.html",
  "scripts/check-stage33c-mpesa-reconciliation.js",
  "STAGE33C_MPESA_RECONCILIATION_GUIDE.md"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
  } else {
    console.log("OK:", file, "exists.");
  }
}

const serverPath = path.join(root, "server.js");
if (fs.existsSync(serverPath)) {
  const server = fs.readFileSync(serverPath, "utf8");
  const requiredServer = [
    "SokoYetu Stage 33C: M-PESA Payment Reconciliation API",
    "/api/admin/mpesa-reconciliation",
    "amountMismatch",
    "missingReceipt"
  ];

  for (const item of requiredServer) {
    if (!server.includes(item)) {
      console.log("WARN: server.js missing:", item);
      warnings += 1;
    } else {
      console.log("OK: server.js includes", item);
    }
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 33C M-PESA reconciliation check passed.");

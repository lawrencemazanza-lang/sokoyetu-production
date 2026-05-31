require("dotenv").config();

console.log("SokoYetu Stage 33D M-PESA Evidence Export Check");
console.log("-----------------------------------------------");

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
  "admin-mpesa-evidence.html",
  "scripts/check-stage33d-mpesa-evidence.js",
  "STAGE33D_MPESA_EVIDENCE_EXPORT_GUIDE.md",
  "STAGE33D_MPESA_AUDIT_PACK_TEMPLATE.md"
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
    "SokoYetu Stage 33D: M-PESA Evidence Export API",
    "/api/admin/mpesa-evidence/export",
    "stage33dCsv",
    "mpesa-evidence"
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

const adminControlPath = path.join(root, "admin-control.html");
if (fs.existsSync(adminControlPath)) {
  const control = fs.readFileSync(adminControlPath, "utf8");
  if (!control.includes("/admin-mpesa-evidence.html")) {
    console.log("WARN: admin-control.html does not link admin-mpesa-evidence.html.");
    warnings += 1;
  } else {
    console.log("OK: admin-control.html links admin-mpesa-evidence.html.");
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 33D M-PESA evidence export check passed.");

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Stage 35A Core Production Readiness Check");
console.log("-------------------------------------------------");

let warnings = 0;

const requiredFiles = [
  "admin-core-readiness.html",
  "scripts/check-stage35a-core-readiness.js",
  "STAGE35A_CORE_READINESS_GUIDE.md",
  "STAGE35A_CRITICAL_GAP_REPORT_TEMPLATE.md"
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
if (!fs.existsSync(serverPath)) {
  console.log("WARN: server.js is missing.");
  warnings += 1;
} else {
  const server = fs.readFileSync(serverPath, "utf8");
  const requiredServer = [
    "SokoYetu Stage 35A: Core Production Readiness Audit API",
    "/api/admin/core-readiness/audit",
    "stage35aRouteOrder",
    "stage35aDatabaseCounts",
    "Core readiness audit"
  ];

  for (const item of requiredServer) {
    if (!server.includes(item)) {
      console.log("WARN: server.js missing:", item);
      warnings += 1;
    } else {
      console.log("OK: server.js includes", item);
    }
  }

  const fallbackIndex = server.indexOf("SokoYetu Stage 32E: Friendly Error Pages");
  const stage35Index = server.indexOf("SokoYetu Stage 35A: Core Production Readiness Audit API");
  if (fallbackIndex !== -1 && stage35Index !== -1 && stage35Index > fallbackIndex) {
    console.log("WARN: Stage 35A endpoint appears after the 404 fallback and may be unreachable.");
    warnings += 1;
  } else if (fallbackIndex !== -1 && stage35Index !== -1) {
    console.log("OK: Stage 35A endpoint appears before the 404 fallback.");
  }
}

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

const controlPath = path.join(root, "admin-control.html");
if (fs.existsSync(controlPath)) {
  const control = fs.readFileSync(controlPath, "utf8");
  if (!control.includes("/admin-core-readiness.html")) {
    console.log("WARN: admin-control.html does not link admin-core-readiness.html.");
    warnings += 1;
  } else {
    console.log("OK: admin-control.html links admin-core-readiness.html.");
  }
}

const robotsPath = path.join(root, "robots.txt");
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes("Disallow: /admin-core-readiness.html")) {
    console.log("WARN: robots.txt does not disallow admin-core-readiness.html.");
    warnings += 1;
  } else {
    console.log("OK: robots.txt disallows admin-core-readiness.html.");
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 35A core production readiness check passed.");

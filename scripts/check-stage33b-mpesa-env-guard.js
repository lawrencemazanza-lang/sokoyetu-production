require("dotenv").config();
const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Stage 33B M-PESA Environment Guard Check");
console.log("------------------------------------------------");

let warnings = 0;

const requiredFiles = [
  "admin-mpesa-env-guard.html",
  "scripts/mpesa-env-map.js",
  "scripts/check-stage33b-mpesa-env-guard.js",
  "STAGE33B_MPESA_ENV_GUARD_GUIDE.md",
  "STAGE33B_RENDER_MPESA_ENV_SWITCH_TEMPLATE.md"
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
    "SokoYetu Stage 33B: M-PESA Environment Mapping and Guard API",
    "/api/admin/mpesa-env-guard",
    "MPESA_PRODUCTION_CONFIRMED",
    "M-PESA production guard"
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
  if (!control.includes("/admin-mpesa-env-guard.html")) {
    console.log("WARN: admin-control.html does not link admin-mpesa-env-guard.html.");
    warnings += 1;
  } else {
    console.log("OK: admin-control.html links admin-mpesa-env-guard.html.");
  }
}

const robotsPath = path.join(root, "robots.txt");
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes("Disallow: /admin-mpesa-env-guard.html")) {
    console.log("WARN: robots.txt does not disallow admin-mpesa-env-guard.html.");
    warnings += 1;
  } else {
    console.log("OK: robots.txt disallows admin-mpesa-env-guard.html.");
  }
}

console.log("");
console.log("Local environment guard:");
const env = String(process.env.MPESA_ENV || process.env.MPESA_MODE || "").toLowerCase();
const wantsProduction = env === "production" || env === "live";
const confirmed = String(process.env.MPESA_PRODUCTION_CONFIRMED || process.env.MPESA_LIVE_CONFIRMED || "").toLowerCase() === "true";

if (wantsProduction && !confirmed) {
  console.log("WARN: MPESA_ENV/MPESA_MODE appears production/live, but MPESA_PRODUCTION_CONFIRMED=true is not set.");
  warnings += 1;
} else {
  console.log("OK: Production guard confirmation state is safe.");
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 33B M-PESA environment guard check passed.");

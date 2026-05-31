const fs = require("fs");
const path = require("path");
require("dotenv").config();

const root = process.cwd();
console.log("SokoYetu Mtaani Stage 35C Buyer Journey Smoke Test Check");
console.log("------------------------------------------------");
let warnings = 0;

const files = [
  "admin-buyer-smoke-test.html",
  "scripts/check-stage35c-buyer-smoke.js",
  "STAGE35C_BUYER_JOURNEY_SMOKE_TEST_GUIDE.md",
  "STAGE35C_MANUAL_TEST_LOG_TEMPLATE.md"
];

for (const file of files) {
  if (!fs.existsSync(path.join(root, file))) {
    console.log("WARN:", file, "is missing.");
    warnings++;
  } else {
    console.log("OK:", file, "exists.");
  }
}

const serverPath = path.join(root, "server.js");
if (fs.existsSync(serverPath)) {
  const server = fs.readFileSync(serverPath, "utf8");
  const required = [
    "SokoYetu Mtaani Stage 35C: Controlled Buyer Journey Smoke Test API",
    "/api/admin/buyer-journey-smoke",
    "stage35cBuyerSmokeCounts"
  ];
  for (const item of required) {
    if (!server.includes(item)) {
      console.log("WARN: server.js missing:", item);
      warnings++;
    } else {
      console.log("OK: server.js includes", item);
    }
  }
  const fallback = server.lastIndexOf("SokoYetu Mtaani Stage 32E: Friendly Error Pages");
  const stage = server.indexOf("SokoYetu Mtaani Stage 35C: Controlled Buyer Journey Smoke Test API");
  if (fallback !== -1 && stage !== -1 && stage > fallback) {
    console.log("WARN: Stage 35C endpoint appears after final fallback.");
    warnings++;
  } else if (fallback !== -1 && stage !== -1) {
    console.log("OK: Stage 35C endpoint appears before final fallback.");
  }
}

if (!process.env.ADMIN_ORDER_TOKEN) {
  console.log("WARN: ADMIN_ORDER_TOKEN is not set.");
  warnings++;
} else {
  console.log("OK: ADMIN_ORDER_TOKEN =", process.env.ADMIN_ORDER_TOKEN.slice(0, 4) + "...hidden");
}

if (fs.existsSync(path.join(root, "admin-control.html"))) {
  const html = fs.readFileSync(path.join(root, "admin-control.html"), "utf8");
  if (!html.includes("/admin-buyer-smoke-test.html")) {
    console.log("WARN: admin-control.html does not link admin-buyer-smoke-test.html.");
    warnings++;
  } else {
    console.log("OK: admin-control.html links admin-buyer-smoke-test.html.");
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 35C buyer journey smoke test check passed.");


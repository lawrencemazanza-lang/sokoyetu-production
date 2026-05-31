const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Stage 33E M-PESA Live Test Runbook Check");
console.log("------------------------------------------------");

let warnings = 0;

const requiredFiles = [
  "admin-mpesa-live-test.html",
  "scripts/check-stage33e-mpesa-live-test.js",
  "STAGE33E_MPESA_LIVE_TEST_RUNBOOK.md",
  "STAGE33E_MPESA_FIRST_PAYMENT_CHECKLIST.md"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
  } else {
    console.log("OK:", file, "exists.");
  }
}

const pagePath = path.join(root, "admin-mpesa-live-test.html");
if (fs.existsSync(pagePath)) {
  const html = fs.readFileSync(pagePath, "utf8");
  const required = [
    "M-PESA Live Test Runbook",
    "localStorage",
    "Export CSV",
    "Export JSON",
    "No database records are changed",
    "noindex"
  ];

  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN: admin-mpesa-live-test.html missing:", item);
      warnings += 1;
    } else {
      console.log("OK: admin-mpesa-live-test.html includes", item);
    }
  }
}

const controlPath = path.join(root, "admin-control.html");
if (fs.existsSync(controlPath)) {
  const control = fs.readFileSync(controlPath, "utf8");
  if (!control.includes("/admin-mpesa-live-test.html")) {
    console.log("WARN: admin-control.html does not link admin-mpesa-live-test.html.");
    warnings += 1;
  } else {
    console.log("OK: admin-control.html links admin-mpesa-live-test.html.");
  }
}

const robotsPath = path.join(root, "robots.txt");
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes("Disallow: /admin-mpesa-live-test.html")) {
    console.log("WARN: robots.txt does not disallow admin-mpesa-live-test.html.");
    warnings += 1;
  } else {
    console.log("OK: robots.txt disallows admin-mpesa-live-test.html.");
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 33E M-PESA live test runbook check passed.");

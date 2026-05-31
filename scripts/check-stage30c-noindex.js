const fs = require("fs");
const path = require("path");

const root = process.cwd();

const pages = [
  "admin-control.html",
  "admin-orders.html",
  "admin-support.html",
  "admin-backup.html",
  "admin-system-health.html",
  "admin-launch.html",
  "seller-verification.html",
  "seller-verification-persistent.html",
  "order-operations.html",
  "seller-onboarding.html"
];

let warnings = 0;

console.log("SokoYetu Mtaani Stage 30C Admin Noindex Hardening Check");
console.log("-----------------------------------------------");

for (const page of pages) {
  const filePath = path.join(root, page);
  if (!fs.existsSync(filePath)) {
    console.log("WARN:", page, "is missing.");
    warnings += 1;
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");

  if (!html.includes('name="robots"') || !html.includes("noindex")) {
    console.log("WARN:", page, "does not contain robots noindex meta tag.");
    warnings += 1;
  } else {
    console.log("OK:", page, "has noindex meta tag.");
  }
}

const robotsPath = path.join(root, "robots.txt");

if (!fs.existsSync(robotsPath)) {
  console.log("WARN: robots.txt is missing.");
  warnings += 1;
} else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  const needed = [
    "/admin-control.html",
    "/admin-orders.html",
    "/admin-support.html",
    "/admin-backup.html",
    "/admin-system-health.html",
    "/admin-launch.html",
    "/seller-verification.html",
    "/seller-verification-persistent.html"
  ];

  for (const item of needed) {
    if (!robots.includes("Disallow: " + item)) {
      console.log("WARN: robots.txt missing Disallow:", item);
      warnings += 1;
    } else {
      console.log("OK: robots.txt disallows", item);
    }
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 30C noindex hardening check passed.");


const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Mtaani Stage 32D Accessibility and Mobile Polish Check");
console.log("--------------------------------------------------------");

let warnings = 0;

const requiredFiles = [
  "public-a11y.css",
  "public-a11y.js",
  "admin-accessibility-audit.html"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
  } else {
    console.log("OK:", file, "exists.");
  }
}

const publicPages = [
  "index.html",
  "categories.html",
  "product-detail.html",
  "seller-stores.html",
  "seller-store.html",
  "help-center.html",
  "track-order.html",
  "support-request.html",
  "contact-support.html",
  "faq.html",
  "returns-policy.html",
  "privacy-policy.html",
  "terms-of-service.html",
  "data-protection.html",
  "seller-policy.html",
  "checkout.html"
];

for (const page of publicPages) {
  const filePath = path.join(root, page);
  if (!fs.existsSync(filePath)) {
    console.log("WARN:", page, "is missing.");
    warnings += 1;
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");

  if (!html.includes("/public-a11y.css")) {
    console.log("WARN:", page, "does not link public-a11y.css.");
    warnings += 1;
  } else {
    console.log("OK:", page, "links public-a11y.css.");
  }

  if (!html.includes("/public-a11y.js")) {
    console.log("WARN:", page, "does not load public-a11y.js.");
    warnings += 1;
  } else {
    console.log("OK:", page, "loads public-a11y.js.");
  }
}

const robotsPath = path.join(root, "robots.txt");
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes("Disallow: /admin-accessibility-audit.html")) {
    console.log("WARN: robots.txt does not disallow admin-accessibility-audit.html.");
    warnings += 1;
  } else {
    console.log("OK: robots.txt disallows admin-accessibility-audit.html.");
  }
}

const adminControlPath = path.join(root, "admin-control.html");
if (fs.existsSync(adminControlPath)) {
  const control = fs.readFileSync(adminControlPath, "utf8");
  if (!control.includes("/admin-accessibility-audit.html")) {
    console.log("WARN: admin-control.html does not link admin-accessibility-audit.html.");
    warnings += 1;
  } else {
    console.log("OK: admin-control.html links admin-accessibility-audit.html.");
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 32D accessibility/mobile polish check passed.");


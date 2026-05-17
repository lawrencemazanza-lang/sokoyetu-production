const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Stage 32C Public Site QA Check");
console.log("--------------------------------------");

let warnings = 0;

const auditPath = path.join(root, "admin-public-audit.html");
if (!fs.existsSync(auditPath)) {
  console.log("WARN: admin-public-audit.html is missing.");
  warnings += 1;
} else {
  const html = fs.readFileSync(auditPath, "utf8");
  const required = [
    "Public Site QA Audit",
    "/api/products",
    "/site.webmanifest",
    "/sitemap.xml",
    "/categories.html",
    "/seller-stores.html",
    "/track-order.html",
    "/support-request.html",
    "noindex"
  ];

  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN: admin-public-audit.html missing:", item);
      warnings += 1;
    } else {
      console.log("OK: admin-public-audit.html includes", item);
    }
  }
}

const robotsPath = path.join(root, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  console.log("WARN: robots.txt is missing.");
  warnings += 1;
} else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes("Disallow: /admin-public-audit.html")) {
    console.log("WARN: robots.txt does not disallow admin-public-audit.html.");
    warnings += 1;
  } else {
    console.log("OK: robots.txt disallows admin-public-audit.html.");
  }
}

const controlPath = path.join(root, "admin-control.html");
if (fs.existsSync(controlPath)) {
  const control = fs.readFileSync(controlPath, "utf8");
  if (!control.includes("/admin-public-audit.html")) {
    console.log("WARN: admin-control.html does not link admin-public-audit.html.");
    warnings += 1;
  } else {
    console.log("OK: admin-control.html links admin-public-audit.html.");
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 32C public QA audit check passed.");

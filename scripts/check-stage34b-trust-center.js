const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Stage 34B Trust Center Check");
console.log("------------------------------------");

let warnings = 0;

const requiredFiles = [
  "trust-center.html",
  "scripts/check-stage34b-trust-center.js",
  "STAGE34B_TRUST_CENTER_GUIDE.md",
  "STAGE34B_BUYER_SAFETY_COPY.md"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
  } else {
    console.log("OK:", file, "exists.");
  }
}

const trustPath = path.join(root, "trust-center.html");
if (fs.existsSync(trustPath)) {
  const html = fs.readFileSync(trustPath, "utf8");
  const required = [
    "SokoYetu Trust Center",
    "M-PESA payment safety",
    "Do not pay twice",
    "/track-order.html",
    "/support-request.html",
    "/returns-policy.html",
    "/seller-policy.html",
    "/public-nav.js",
    "/public-a11y.js"
  ];

  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN: trust-center.html missing:", item);
      warnings += 1;
    } else {
      console.log("OK: trust-center.html includes", item);
    }
  }
}

const navPath = path.join(root, "public-nav.js");
if (fs.existsSync(navPath)) {
  const nav = fs.readFileSync(navPath, "utf8");
  if (!nav.includes("/trust-center.html")) {
    console.log("WARN: public-nav.js does not link Trust Center.");
    warnings += 1;
  } else {
    console.log("OK: public-nav.js links Trust Center.");
  }
}

const sitemapPath = path.join(root, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (!sitemap.includes("/trust-center.html")) {
    console.log("WARN: sitemap.xml does not include Trust Center.");
    warnings += 1;
  } else {
    console.log("OK: sitemap.xml includes Trust Center.");
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 34B Trust Center check passed.");

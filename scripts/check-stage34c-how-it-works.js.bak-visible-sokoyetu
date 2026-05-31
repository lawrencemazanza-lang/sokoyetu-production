const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Stage 34C How It Works and Delivery Check");
console.log("-------------------------------------------------");

let warnings = 0;

const requiredFiles = [
  "how-it-works.html",
  "delivery-info.html",
  "scripts/check-stage34c-how-it-works.js",
  "STAGE34C_HOW_IT_WORKS_DELIVERY_GUIDE.md",
  "STAGE34C_BUYER_JOURNEY_COPY.md"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
  } else {
    console.log("OK:", file, "exists.");
  }
}

const pageChecks = {
  "how-it-works.html": ["How SokoYetu Works", "Checkout with M-PESA", "/track-order.html", "/support-request.html", "/trust-center.html", "/public-nav.js", "/public-a11y.js"],
  "delivery-info.html": ["Delivery Information", "Before accepting delivery", "/track-order.html", "/support-request.html", "/returns-policy.html", "/public-nav.js", "/public-a11y.js"]
};

for (const [file, required] of Object.entries(pageChecks)) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, "utf8");
  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN:", file, "missing:", item);
      warnings += 1;
    } else {
      console.log("OK:", file, "includes", item);
    }
  }
}

const navPath = path.join(root, "public-nav.js");
if (fs.existsSync(navPath)) {
  const nav = fs.readFileSync(navPath, "utf8");
  for (const link of ["/how-it-works.html", "/delivery-info.html"]) {
    if (!nav.includes(link)) {
      console.log("WARN: public-nav.js missing:", link);
      warnings += 1;
    } else {
      console.log("OK: public-nav.js links", link);
    }
  }
}

const sitemapPath = path.join(root, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  for (const link of ["/how-it-works.html", "/delivery-info.html"]) {
    if (!sitemap.includes(link)) {
      console.log("WARN: sitemap.xml missing:", link);
      warnings += 1;
    } else {
      console.log("OK: sitemap.xml includes", link);
    }
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 34C How It Works and Delivery check passed.");

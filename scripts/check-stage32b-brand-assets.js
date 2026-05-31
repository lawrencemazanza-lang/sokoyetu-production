const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Mtaani Stage 32B Brand Assets and Manifest Check");
console.log("-------------------------------------------------");

let warnings = 0;

const assets = [
  "favicon.svg",
  "sokoyetu-icon.svg",
  "sokoyetu-share.svg",
  "site.webmanifest"
];

for (const file of assets) {
  if (!fs.existsSync(path.join(root, file))) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
  } else {
    console.log("OK:", file, "exists.");
  }
}

const pages = [
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
  "seller-policy.html"
];

for (const page of pages) {
  const filePath = path.join(root, page);
  if (!fs.existsSync(filePath)) {
    console.log("WARN:", page, "is missing.");
    warnings += 1;
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");
  const required = [
    "/favicon.svg",
    "/site.webmanifest",
    "SokoYetu Mtaani Stage 32B Brand start",
    "sokoyetu-share.svg",
    "application-name"
  ];

  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN:", page, "missing:", item);
      warnings += 1;
    }
  }

  if (required.every((item) => html.includes(item))) {
    console.log("OK:", page, "has brand/manifest metadata.");
  }
}

const manifestPath = path.join(root, "site.webmanifest");
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (!manifest.name || !manifest.short_name || !manifest.icons || !manifest.icons.length) {
      console.log("WARN: site.webmanifest is incomplete.");
      warnings += 1;
    } else {
      console.log("OK: site.webmanifest structure is valid.");
    }
  } catch (error) {
    console.log("WARN: site.webmanifest is not valid JSON:", error.message);
    warnings += 1;
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 32B brand assets and manifest check passed.");



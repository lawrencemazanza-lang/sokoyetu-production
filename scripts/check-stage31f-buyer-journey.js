const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Mtaani Stage 31F Buyer Journey Polish Check");
console.log("--------------------------------------------");

let warnings = 0;

const requiredFiles = [
  "public-nav.css",
  "public-nav.js",
  "index.html",
  "categories.html",
  "product-detail.html",
  "seller-stores.html",
  "seller-store.html",
  "help-center.html",
  "track-order.html",
  "support-request.html"
];

for (const file of requiredFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
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
  "support-request.html"
];

for (const page of publicPages) {
  const filePath = path.join(root, page);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, "utf8");
  if (!html.includes('/public-nav.css')) {
    console.log("WARN:", page, "does not link public-nav.css.");
    warnings += 1;
  } else {
    console.log("OK:", page, "links public-nav.css.");
  }
  if (!html.includes('/public-nav.js')) {
    console.log("WARN:", page, "does not load public-nav.js.");
    warnings += 1;
  } else {
    console.log("OK:", page, "loads public-nav.js.");
  }
}

const indexPath = path.join(root, "index.html");
if (fs.existsSync(indexPath)) {
  const index = fs.readFileSync(indexPath, "utf8");
  const oldMarkers = [
    "SokoYetu Mtaani Stage 30E: Public customer service shortcuts",
    "SokoYetu Mtaani Stage 31C: Public category directory link",
    "SokoYetu Mtaani Stage 31D: Product detail page note",
    "SokoYetu Mtaani Stage 31E: Seller stores link"
  ];

  for (const marker of oldMarkers) {
    if (index.includes(marker)) {
      console.log("WARN: index.html still contains old clutter marker:", marker);
      warnings += 1;
    } else {
      console.log("OK: index.html does not contain old marker:", marker);
    }
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 31F buyer journey polish check passed.");


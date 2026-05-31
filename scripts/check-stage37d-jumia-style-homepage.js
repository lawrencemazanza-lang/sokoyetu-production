const fs = require("fs");
const path = require("path");

const root = process.cwd();
const indexPath = path.join(root, "index.html");
let warnings = 0;

console.log("SokoYetu Mtaani Stage 37D Jumia-Style Homepage Check");
console.log("---------------------------------------------");

if (!fs.existsSync(indexPath)) {
  console.log("WARN: index.html is missing.");
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf8");

const required = [
  "soko37d-page",
  "soko37d-search",
  "soko37d-category-menu",
  "soko37d-hero",
  "soko37d-side-ads",
  "soko37d-flash-sale",
  "soko37d-live-section",
  "soko37d-ad-strip",
  "soko37d-sponsored",
  "soko37d-whatsapp",
  "soko37d-mobile-nav",
  "Flash Sale",
  "Live Shopping",
  "Sponsored Products",
  "254714565555",
  "6923522",
  "/api/products"
];

for (const item of required) {
  if (!html.includes(item)) {
    console.log("WARN: index.html missing:", item);
    warnings++;
  } else {
    console.log("OK: index.html includes", item);
  }
}

const forbidden = [
  "Daraja",
  "not working",
  "fallback",
  "SokoYetu Mtaani Stage",
  "launch-readiness draft",
  "M-PESA STK Push failed",
  "checkout page STK note"
];

for (const item of forbidden) {
  if (html.toLowerCase().includes(item.toLowerCase())) {
    console.log("WARN: customer-facing homepage contains unwanted wording:", item);
    warnings++;
  } else {
    console.log("OK: homepage does not contain", item);
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 37D homepage check passed.");


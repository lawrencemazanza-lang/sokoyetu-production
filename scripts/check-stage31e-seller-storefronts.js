const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Mtaani Stage 31E Seller Storefronts Check");
console.log("------------------------------------------");

let warnings = 0;

const files = [
  ["seller-stores.html", ["/api/products", "SokoYetu Mtaani Seller Stores", "/seller-store.html?sellerId="]],
  ["seller-store.html", ["/api/products", "Seller Store", "/product-detail.html?id="]],
];

for (const [file, required] of files) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
    continue;
  }

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

const sitemapPath = path.join(root, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  for (const link of ["/seller-stores.html", "/seller-store.html"]) {
    if (!sitemap.includes(link)) {
      console.log("WARN: sitemap.xml missing:", link);
      warnings += 1;
    } else {
      console.log("OK: sitemap.xml includes", link);
    }
  }
} else {
  console.log("WARN: sitemap.xml is missing.");
  warnings += 1;
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 31E seller storefronts check passed.");


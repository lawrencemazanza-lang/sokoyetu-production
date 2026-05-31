const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Mtaani Stage 31D Product Detail Page Check");
console.log("-------------------------------------------");

let warnings = 0;

const detailPath = path.join(root, "product-detail.html");
if (!fs.existsSync(detailPath)) {
  console.log("WARN: product-detail.html is missing.");
  warnings += 1;
} else {
  const html = fs.readFileSync(detailPath, "utf8");
  const required = ["/api/products", "productId()", "Copy product link", "Product Details"];
  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN: product-detail.html missing:", item);
      warnings += 1;
    } else {
      console.log("OK: product-detail.html includes", item);
    }
  }
}

const categoriesPath = path.join(root, "categories.html");
if (fs.existsSync(categoriesPath)) {
  const categories = fs.readFileSync(categoriesPath, "utf8");
  if (!categories.includes("/product-detail.html?id=")) {
    console.log("WARN: categories.html does not link to product-detail.html.");
    warnings += 1;
  } else {
    console.log("OK: categories.html links to product-detail.html.");
  }
} else {
  console.log("WARN: categories.html is missing.");
  warnings += 1;
}

const sitemapPath = path.join(root, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (!sitemap.includes("/product-detail.html")) {
    console.log("WARN: sitemap.xml does not include product-detail.html.");
    warnings += 1;
  } else {
    console.log("OK: sitemap.xml includes product-detail.html.");
  }
} else {
  console.log("WARN: sitemap.xml is missing.");
  warnings += 1;
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 31D product detail page check passed.");


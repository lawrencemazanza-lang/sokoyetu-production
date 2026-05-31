const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Mtaani Stage 31C Public Category Directory Check");
console.log("-------------------------------------------------");

let warnings = 0;

const categoriesPath = path.join(root, "categories.html");
if (!fs.existsSync(categoriesPath)) {
  console.log("WARN: categories.html is missing.");
  warnings += 1;
} else {
  const html = fs.readFileSync(categoriesPath, "utf8");
  const required = ["/api/products", "categoryFilter", "searchBox", "Browse SokoYetu Mtaani Categories"];
  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN: categories.html missing:", item);
      warnings += 1;
    } else {
      console.log("OK: categories.html includes", item);
    }
  }
}

const sitemapPath = path.join(root, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (!sitemap.includes("/categories.html")) {
    console.log("WARN: sitemap.xml does not include categories.html.");
    warnings += 1;
  } else {
    console.log("OK: sitemap.xml includes categories.html.");
  }
} else {
  console.log("WARN: sitemap.xml is missing.");
  warnings += 1;
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 31C category directory check passed.");


const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Stage 30E Public Navigation Integration Check");
console.log("-----------------------------------------------------");

let warnings = 0;

const indexPath = path.join(root, "index.html");
const sitemapPath = path.join(root, "sitemap.xml");

const requiredLinks = [
  "/help-center.html",
  "/track-order.html",
  "/support-request.html",
  "/returns-policy.html",
  "/contact-support.html"
];

if (!fs.existsSync(indexPath)) {
  console.log("WARN: index.html is missing.");
  warnings += 1;
} else {
  const index = fs.readFileSync(indexPath, "utf8");
  for (const link of requiredLinks) {
    if (!index.includes(link)) {
      console.log("WARN: index.html missing customer service link:", link);
      warnings += 1;
    } else {
      console.log("OK: index.html includes", link);
    }
  }
}

if (!fs.existsSync(sitemapPath)) {
  console.log("WARN: sitemap.xml is missing.");
  warnings += 1;
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const requiredSitemap = [
    "/help-center.html",
    "/track-order.html",
    "/support-request.html",
    "/contact-support.html",
    "/returns-policy.html",
    "/faq.html"
  ];

  for (const link of requiredSitemap) {
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
if (warnings === 0) console.log("Stage 30E public navigation integration check passed.");

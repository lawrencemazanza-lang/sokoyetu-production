const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Mtaani Stage 30D Public Help Center Check");
console.log("------------------------------------------");

let warnings = 0;

const helpPath = path.join(root, "help-center.html");
if (!fs.existsSync(helpPath)) {
  console.log("WARN: help-center.html is missing.");
  warnings += 1;
} else {
  const html = fs.readFileSync(helpPath, "utf8");
  const required = [
    "/track-order.html",
    "/support-request.html",
    "/returns-policy.html",
    "/contact-support.html",
    "/faq.html",
    "/privacy-policy.html",
    "/terms-of-service.html"
  ];

  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN: help-center.html missing link:", item);
      warnings += 1;
    } else {
      console.log("OK: help-center.html links", item);
    }
  }
}

const sitemapPath = path.join(root, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (!sitemap.includes("/help-center.html")) {
    console.log("WARN: sitemap.xml does not include help-center.html.");
    warnings += 1;
  } else {
    console.log("OK: sitemap.xml includes help-center.html.");
  }
} else {
  console.log("WARN: sitemap.xml is missing.");
  warnings += 1;
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 30D help center check passed.");


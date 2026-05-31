const fs = require("fs");
const path = require("path");

const root = process.cwd();
const indexPath = path.join(root, "index.html");
let warnings = 0;

console.log("SokoYetu Mtaani Stage 37F Flash Sale Theme and Logo Check");
console.log("--------------------------------------------------");

if (!fs.existsSync(indexPath)) {
  console.log("WARN: index.html is missing.");
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf8");

const required = [
  "SokoYetu Mtaani Stage 37F: themed flash sale and shopping cart logo",
  "soko37f-cart-logo",
  "soko37f-theme-card",
  "soko37f-theme-live",
  "getSoko37FTheme",
  "miniProductCard",
  "productCard",
  "renderLiveProduct"
];

for (const item of required) {
  if (!html.includes(item)) {
    console.log("WARN: index.html missing:", item);
    warnings++;
  } else {
    console.log("OK: index.html includes", item);
  }
}

const forbiddenLogo = '<span class="soko37e-logo-mark">SY</span>';
if (html.includes(forbiddenLogo)) {
  console.log("WARN: old plain SY logo is still present.");
  warnings++;
} else {
  console.log("OK: old plain SY logo is not present.");
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 37F flash sale theme and logo check passed.");


const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Mtaani Stage 32E Friendly Error Pages Check");
console.log("--------------------------------------------");

let warnings = 0;

const requiredFiles = ["404.html", "500.html"];

for (const file of requiredFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");
  const required = [
    "SokoYetu Mtaani",
    "/help-center.html",
    "/track-order.html",
    "/support-request.html",
    "noindex",
    "/public-nav.js",
    "/public-a11y.js"
  ];

  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN:", file, "missing:", item);
      warnings += 1;
    }
  }

  if (required.every((item) => html.includes(item))) {
    console.log("OK:", file, "has recovery links and noindex.");
  }
}

const serverPath = path.join(root, "server.js");
if (!fs.existsSync(serverPath)) {
  console.log("WARN: server.js is missing.");
  warnings += 1;
} else {
  const server = fs.readFileSync(serverPath, "utf8");
  const requiredServer = [
    "SokoYetu Mtaani Stage 32E: Friendly Error Pages",
    "API endpoint not found",
    "404.html",
    "500.html"
  ];

  for (const item of requiredServer) {
    if (!server.includes(item)) {
      console.log("WARN: server.js missing:", item);
      warnings += 1;
    } else {
      console.log("OK: server.js includes", item);
    }
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 32E friendly error pages check passed.");


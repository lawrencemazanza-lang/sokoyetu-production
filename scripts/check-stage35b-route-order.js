const fs = require("fs");
const path = require("path");
require("dotenv").config();

const root = process.cwd();
const serverPath = path.join(root, "server.js");

console.log("SokoYetu Mtaani Stage 35B Route Order Hardening Check");
console.log("----------------------------------------------");

let warnings = 0;

if (!fs.existsSync(serverPath)) {
  console.log("WARN: server.js is missing.");
  process.exit(1);
}

const server = fs.readFileSync(serverPath, "utf8");
const fallbackIndex = server.indexOf("SokoYetu Mtaani Stage 32E: Friendly Error Pages");
const routePattern = /app\.(get|post|put|patch|delete|use)\s*\(\s*["']([^"']+)/g;
const after = [];
let match;

if (fallbackIndex === -1) {
  console.log("WARN: Stage 32E fallback marker not found.");
  warnings++;
} else {
  console.log("OK: Stage 32E fallback marker found.");
  while ((match = routePattern.exec(server))) {
    if (match.index > fallbackIndex) after.push(match[1].toUpperCase() + " " + match[2]);
  }

  if (after.length) {
    console.log("WARN: Routes found after final fallback:");
    for (const route of after) console.log(" -", route);
    warnings++;
  } else {
    console.log("OK: No route declarations found after final fallback.");
  }
}

if (!process.env.PUBLIC_SITE_URL) {
  console.log("WARN: PUBLIC_SITE_URL is not set.");
  warnings++;
} else {
  console.log("OK: PUBLIC_SITE_URL =", process.env.PUBLIC_SITE_URL);
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 35B route order hardening check passed.");


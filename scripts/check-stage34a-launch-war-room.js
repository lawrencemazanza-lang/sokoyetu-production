const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Stage 34A Launch War Room Check");
console.log("----------------------------------------");

let warnings = 0;

const requiredFiles = [
  "admin-launch-war-room.html",
  "scripts/check-stage34a-launch-war-room.js",
  "STAGE34A_LAUNCH_WAR_ROOM_GUIDE.md",
  "STAGE34A_LAUNCH_DAY_CHECKLIST.md"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
  } else {
    console.log("OK:", file, "exists.");
  }
}

const pagePath = path.join(root, "admin-launch-war-room.html");
if (fs.existsSync(pagePath)) {
  const html = fs.readFileSync(pagePath, "utf8");
  const required = [
    "Launch War Room",
    "/api/health",
    "/admin-orders.html",
    "/admin-support.html",
    "/admin-mpesa-readiness.html",
    "/admin-mpesa-reconciliation.html",
    "localStorage",
    "Export CSV",
    "Export JSON",
    "noindex"
  ];

  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN: admin-launch-war-room.html missing:", item);
      warnings += 1;
    } else {
      console.log("OK: admin-launch-war-room.html includes", item);
    }
  }
}

const controlPath = path.join(root, "admin-control.html");
if (fs.existsSync(controlPath)) {
  const control = fs.readFileSync(controlPath, "utf8");
  if (!control.includes("/admin-launch-war-room.html")) {
    console.log("WARN: admin-control.html does not link admin-launch-war-room.html.");
    warnings += 1;
  } else {
    console.log("OK: admin-control.html links admin-launch-war-room.html.");
  }
}

const robotsPath = path.join(root, "robots.txt");
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes("Disallow: /admin-launch-war-room.html")) {
    console.log("WARN: robots.txt does not disallow admin-launch-war-room.html.");
    warnings += 1;
  } else {
    console.log("OK: robots.txt disallows admin-launch-war-room.html.");
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 34A launch war room check passed.");

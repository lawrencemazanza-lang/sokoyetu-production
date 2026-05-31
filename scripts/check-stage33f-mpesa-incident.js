const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Mtaani Stage 33F M-PESA Incident Response Check");
console.log("------------------------------------------------");

let warnings = 0;

const requiredFiles = [
  "admin-mpesa-incident.html",
  "scripts/check-stage33f-mpesa-incident.js",
  "STAGE33F_MPESA_INCIDENT_RESPONSE_GUIDE.md",
  "STAGE33F_MPESA_ROLLBACK_PLAYBOOK.md"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.log("WARN:", file, "is missing.");
    warnings += 1;
  } else {
    console.log("OK:", file, "exists.");
  }
}

const pagePath = path.join(root, "admin-mpesa-incident.html");
if (fs.existsSync(pagePath)) {
  const html = fs.readFileSync(pagePath, "utf8");
  const required = [
    "M-PESA Incident Response",
    "localStorage",
    "Export CSV",
    "Export JSON",
    "Rollback checklist",
    "No database records are changed",
    "noindex"
  ];

  for (const item of required) {
    if (!html.includes(item)) {
      console.log("WARN: admin-mpesa-incident.html missing:", item);
      warnings += 1;
    } else {
      console.log("OK: admin-mpesa-incident.html includes", item);
    }
  }
}

const controlPath = path.join(root, "admin-control.html");
if (fs.existsSync(controlPath)) {
  const control = fs.readFileSync(controlPath, "utf8");
  if (!control.includes("/admin-mpesa-incident.html")) {
    console.log("WARN: admin-control.html does not link admin-mpesa-incident.html.");
    warnings += 1;
  } else {
    console.log("OK: admin-control.html links admin-mpesa-incident.html.");
  }
}

const robotsPath = path.join(root, "robots.txt");
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes("Disallow: /admin-mpesa-incident.html")) {
    console.log("WARN: robots.txt does not disallow admin-mpesa-incident.html.");
    warnings += 1;
  } else {
    console.log("OK: robots.txt disallows admin-mpesa-incident.html.");
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 33F M-PESA incident response check passed.");


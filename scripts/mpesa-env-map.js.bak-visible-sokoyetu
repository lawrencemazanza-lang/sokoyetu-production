require("dotenv").config();
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const serverPath = path.join(root, "server.js");

if (!fs.existsSync(serverPath)) {
  console.error("ERROR: server.js was not found.");
  process.exit(1);
}

const server = fs.readFileSync(serverPath, "utf8");

function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function findProcessEnvKeys(text) {
  const keys = [];
  const dotPattern = /process\.env\.([A-Z0-9_]+)/g;
  const bracketPattern = /process\.env\[["']([A-Z0-9_]+)["']\]/g;
  let match;

  while ((match = dotPattern.exec(text))) keys.push(match[1]);
  while ((match = bracketPattern.exec(text))) keys.push(match[1]);

  return unique(keys);
}

function redact(value) {
  const text = String(value || "");
  if (!text) return "";
  if (text.length <= 8) return text.slice(0, 2) + "...hidden";
  return text.slice(0, 4) + "...hidden..." + text.slice(-3);
}

const allKeys = findProcessEnvKeys(server);
const mpesaKeys = allKeys.filter((key) => key.includes("MPESA") || key.includes("DARAJA") || key.includes("SAFARICOM"));

const groups = {
  environment: ["MPESA_ENV", "MPESA_MODE", "MPESA_BASE_URL"],
  consumerKey: ["MPESA_CONSUMER_KEY", "MPESA_DARAJA_CONSUMER_KEY", "DARAJA_CONSUMER_KEY", "SAFARICOM_CONSUMER_KEY"],
  consumerSecret: ["MPESA_CONSUMER_SECRET", "MPESA_DARAJA_CONSUMER_SECRET", "DARAJA_CONSUMER_SECRET", "SAFARICOM_CONSUMER_SECRET"],
  shortcode: ["MPESA_SHORTCODE", "MPESA_BUSINESS_SHORTCODE", "MPESA_PAYBILL", "MPESA_TILL", "BUSINESS_SHORTCODE"],
  passkey: ["MPESA_PASSKEY", "MPESA_LIPA_NA_MPESA_PASSKEY", "LIPA_NA_MPESA_PASSKEY"],
  callback: ["MPESA_CALLBACK_URL", "MPESA_STK_CALLBACK_URL", "CALLBACK_URL"],
  confirmation: ["MPESA_PRODUCTION_CONFIRMED", "MPESA_LIVE_CONFIRMED"]
};

function findConfigured(keys) {
  return keys.filter((key) => Object.prototype.hasOwnProperty.call(process.env, key));
}

console.log("SokoYetu M-PESA Environment Variable Map");
console.log("----------------------------------------");
console.log("");
console.log("M-PESA/Daraja/Safaricom keys referenced in server.js:");
if (mpesaKeys.length) {
  for (const key of mpesaKeys) console.log("-", key, process.env[key] ? "=" + redact(process.env[key]) : "(not set)");
} else {
  console.log("- None found.");
}

console.log("");
console.log("Recommended groups:");
for (const [group, keys] of Object.entries(groups)) {
  const used = keys.filter((key) => mpesaKeys.includes(key));
  const configured = findConfigured(keys);
  console.log("-", group + ":");
  console.log("  referenced:", used.length ? used.join(", ") : "not detected in server.js");
  console.log("  configured:", configured.length ? configured.map((key) => key + "=" + redact(process.env[key])).join(", ") : "none");
}

const env = String(process.env.MPESA_ENV || process.env.MPESA_MODE || "").toLowerCase();
const wantsProduction = env === "production" || env === "live";
const confirmed = String(process.env.MPESA_PRODUCTION_CONFIRMED || process.env.MPESA_LIVE_CONFIRMED || "").toLowerCase() === "true";

console.log("");
if (wantsProduction && !confirmed) {
  console.log("GUARD: Production/live appears requested, but MPESA_PRODUCTION_CONFIRMED=true is not set.");
  process.exitCode = 2;
} else {
  console.log("GUARD: No production-confirmation block detected.");
}

require("dotenv").config();

console.log("SokoYetu Mtaani Stage 19 Security Configuration Check");
console.log("--------------------------------------------");

let ok = true;
const warn = [];

function checkPresent(key, label = key) {
  if (!process.env[key]) {
    console.log("MISSING:", label);
    ok = false;
    return "";
  }

  const value = process.env[key];
  if (key.includes("SECRET") || key.includes("KEY") || key.includes("PASS")) {
    console.log("OK:", label, "=", value.slice(0, 4) + "...hidden");
  } else {
    console.log("OK:", label, "=", value);
  }

  return value;
}

const nodeEnv = process.env.NODE_ENV || "development";
console.log("NODE_ENV =", nodeEnv);

const jwt = checkPresent("JWT_SECRET");
if (jwt && jwt.length < 32) {
  warn.push("JWT_SECRET should be at least 32 characters before production.");
  ok = false;
}

if (nodeEnv === "production") {
  if (process.env.ADMIN_REGISTRATION_ENABLED === "true") {
    warn.push("ADMIN_REGISTRATION_ENABLED should not be true in production.");
    ok = false;
  }

  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("postgresql://")) {
    warn.push("Production should use PostgreSQL DATABASE_URL.");
    ok = false;
  }

  if (process.env.UPLOAD_MODE !== "cloudinary") {
    warn.push("Production image uploads should use Cloudinary or another durable storage provider.");
    ok = false;
  }

  if (process.env.MPESA_MODE !== "daraja") {
    warn.push("Production M-PESA should use MPESA_MODE=daraja.");
    ok = false;
  }
}

checkPresent("DATABASE_URL");
checkPresent("UPLOAD_MODE");
checkPresent("MPESA_MODE");
checkPresent("MPESA_CALLBACK_URL");
checkPresent("CLOUDINARY_CLOUD_NAME");
checkPresent("LIVEKIT_URL");
checkPresent("LIVEKIT_API_KEY");
checkPresent("LIVEKIT_API_SECRET");

console.log("");
if (warn.length) {
  console.log("Warnings:");
  warn.forEach((item) => console.log("-", item));
  console.log("");
}

console.log(ok ? "Security configuration looks acceptable for the current environment." : "Security configuration needs attention before deployment.");
process.exit(ok ? 0 : 1);


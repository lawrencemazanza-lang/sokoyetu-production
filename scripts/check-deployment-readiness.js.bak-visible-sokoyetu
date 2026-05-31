require("dotenv").config();

console.log("SokoYetu Stage 20 Deployment Readiness Check");
console.log("-------------------------------------------");

let ok = true;
const warnings = [];

function check(key, options = {}) {
  const value = process.env[key];

  if (!value) {
    console.log("MISSING:", key);
    ok = false;
    return "";
  }

  if (options.secret) {
    console.log("OK:", key, "=", value.slice(0, 4) + "...hidden");
  } else {
    console.log("OK:", key, "=", value);
  }

  return value;
}

const nodeEnv = process.env.NODE_ENV || "development";
console.log("NODE_ENV =", nodeEnv);

const databaseUrl = check("DATABASE_URL", { secret: true });
if (databaseUrl && !databaseUrl.startsWith("postgresql://")) {
  warnings.push("DATABASE_URL should be PostgreSQL for deployment.");
  ok = false;
}

const jwt = check("JWT_SECRET", { secret: true });
if (jwt && jwt.length < 32) {
  warnings.push("JWT_SECRET should be at least 32 characters.");
  ok = false;
}

check("UPLOAD_MODE");
if (process.env.UPLOAD_MODE !== "cloudinary") {
  warnings.push("UPLOAD_MODE should be cloudinary for production deployment.");
}

check("CLOUDINARY_CLOUD_NAME");
check("CLOUDINARY_API_KEY", { secret: true });
check("CLOUDINARY_API_SECRET", { secret: true });

check("MPESA_MODE");
check("MPESA_ENV");
check("MPESA_SHORTCODE");
check("MPESA_CONSUMER_KEY", { secret: true });
check("MPESA_CONSUMER_SECRET", { secret: true });
check("MPESA_PASSKEY", { secret: true });
const callback = check("MPESA_CALLBACK_URL");
if (callback && (callback.includes("localhost") || callback.includes("trycloudflare") || callback.includes("webhook.site") || callback.includes("ngrok"))) {
  warnings.push("MPESA_CALLBACK_URL should be the deployed domain callback URL before go-live.");
}

check("LIVEKIT_URL");
check("LIVEKIT_API_KEY", { secret: true });
check("LIVEKIT_API_SECRET", { secret: true });

if (process.env.ADMIN_REGISTRATION_ENABLED === "true") {
  warnings.push("ADMIN_REGISTRATION_ENABLED should be false before public deployment.");
  ok = false;
}

console.log("");
if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((warning) => console.log("-", warning));
  console.log("");
}

console.log(ok ? "Deployment readiness check passed for core required values." : "Deployment readiness check found issues.");
process.exit(ok ? 0 : 1);

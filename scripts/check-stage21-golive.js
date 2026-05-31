require("dotenv").config();

console.log("SokoYetu Mtaani Stage 21 Go-Live Readiness Check");
console.log("----------------------------------------");

let blocking = 0;
let warnings = 0;

function present(key, options = {}) {
  const value = process.env[key];

  if (!value) {
    const level = options.required ? "MISSING" : "WARN";
    console.log(level + ":", key);
    if (options.required) blocking += 1;
    else warnings += 1;
    return "";
  }

  if (options.secret) {
    console.log("OK:", key, "=", value.slice(0, 4) + "...hidden");
  } else {
    console.log("OK:", key, "=", value);
  }

  return value;
}

const publicSiteUrl = present("PUBLIC_SITE_URL");
const supportEmail = present("SUPPORT_EMAIL");
present("BUSINESS_NAME");

present("DATABASE_URL", { required: true, secret: true });
present("JWT_SECRET", { required: true, secret: true });
present("UPLOAD_MODE", { required: true });
present("CLOUDINARY_CLOUD_NAME", { required: true });
present("CLOUDINARY_API_KEY", { required: true, secret: true });
present("CLOUDINARY_API_SECRET", { required: true, secret: true });

present("MPESA_MODE", { required: true });
present("MPESA_ENV", { required: true });
present("MPESA_SHORTCODE", { required: true });
present("MPESA_TRANSACTION_TYPE", { required: true });
present("MPESA_CONSUMER_KEY", { required: true, secret: true });
present("MPESA_CONSUMER_SECRET", { required: true, secret: true });
present("MPESA_PASSKEY", { required: true, secret: true });
present("MPESA_CALLBACK_URL", { required: true });

present("LIVEKIT_URL", { required: true });
present("LIVEKIT_API_KEY", { required: true, secret: true });
present("LIVEKIT_API_SECRET", { required: true, secret: true });

if (process.env.ADMIN_REGISTRATION_ENABLED === "true") {
  console.log("MISSING/UNSAFE: ADMIN_REGISTRATION_ENABLED should be false before public launch.");
  blocking += 1;
} else {
  console.log("OK: ADMIN_REGISTRATION_ENABLED is not publicly open.");
}

if (process.env.MPESA_ENV === "sandbox") {
  console.log("WARN: MPESA_ENV is sandbox. This is fine for testing, but real launch needs production credentials.");
  warnings += 1;
}

if (process.env.MPESA_CALLBACK_URL && process.env.MPESA_CALLBACK_URL.includes("trycloudflare")) {
  console.log("WARN: MPESA_CALLBACK_URL still uses trycloudflare. Use the Render/custom domain callback before launch.");
  warnings += 1;
}

if (process.env.MPESA_CALLBACK_URL && process.env.MPESA_CALLBACK_URL.includes("ngrok")) {
  console.log("WARN: MPESA_CALLBACK_URL still uses ngrok. Use the Render/custom domain callback before launch.");
  warnings += 1;
}

if (publicSiteUrl && publicSiteUrl.includes("localhost")) {
  console.log("WARN: PUBLIC_SITE_URL should not be localhost for launch.");
  warnings += 1;
}

if (supportEmail && !supportEmail.includes("@")) {
  console.log("WARN: SUPPORT_EMAIL does not look like an email address.");
  warnings += 1;
}

console.log("");
console.log("Blocking issues:", blocking);
console.log("Warnings:", warnings);

if (blocking > 0) {
  console.log("Go-live check failed. Fix blocking issues first.");
  process.exit(1);
}

console.log("Core go-live check passed. Review warnings before public launch.");


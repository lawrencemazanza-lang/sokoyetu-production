require("dotenv").config();

console.log("SokoYetu Stage 29A Security and Monitoring Check");
console.log("-----------------------------------------------");

let warnings = 0;

function check(key, opts = {}) {
  const value = process.env[key];
  if (!value) {
    console.log("WARN:", key, "is not set.");
    warnings += 1;
    return;
  }
  console.log("OK:", key, "=", opts.secret ? value.slice(0, 4) + "...hidden" : value);
}

check("PUBLIC_SITE_URL");
check("BUSINESS_NAME");
check("SUPPORT_EMAIL");
check("DATABASE_URL", { secret: true });
check("ADMIN_ORDER_TOKEN", { secret: true });
check("JWT_SECRET", { secret: true });
check("UPLOAD_MODE");
check("MPESA_MODE");
check("MPESA_ENV");
check("MPESA_CALLBACK_URL");

if (process.env.ADMIN_REGISTRATION_ENABLED === "true") {
  console.log("WARN: ADMIN_REGISTRATION_ENABLED should be false for launch.");
  warnings += 1;
} else {
  console.log("OK: ADMIN_REGISTRATION_ENABLED is not publicly open.");
}

if (process.env.MPESA_ENV === "sandbox") {
  console.log("WARN: MPESA_ENV is sandbox. This is fine for testing, but real launch needs production Daraja credentials.");
  warnings += 1;
}

console.log("");
console.log("Review:");
console.log("- admin-system-health.html");
console.log("- STAGE29A_SECURITY_MONITORING_GUIDE.md");
console.log("- STAGE29A_LAUNCH_RISK_REGISTER.md");
console.log("");
console.log("Warnings:", warnings);

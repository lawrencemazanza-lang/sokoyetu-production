require("dotenv").config();

console.log("SokoYetu Stage 27A Seller Onboarding Check");
console.log("------------------------------------------");

let warnings = 0;

if (!process.env.PUBLIC_SITE_URL) {
  console.log("WARN: PUBLIC_SITE_URL is not set.");
  warnings += 1;
} else {
  console.log("OK: PUBLIC_SITE_URL =", process.env.PUBLIC_SITE_URL);
}

if (!process.env.SUPPORT_EMAIL) {
  console.log("WARN: SUPPORT_EMAIL is not set.");
  warnings += 1;
} else {
  console.log("OK: SUPPORT_EMAIL =", process.env.SUPPORT_EMAIL);
}

if (process.env.ADMIN_REGISTRATION_ENABLED === "true") {
  console.log("WARN: ADMIN_REGISTRATION_ENABLED should remain false during launch.");
  warnings += 1;
} else {
  console.log("OK: Admin self-registration is not publicly open.");
}

console.log("");
console.log("Review these files:");
console.log("- seller-onboarding.html");
console.log("- STAGE27A_SELLER_ONBOARDING_GUIDE.md");
console.log("- STAGE27A_SELLER_VERIFICATION_CHECKLIST.md");
console.log("- STAGE27A_SELLER_APPROVAL_MESSAGE_TEMPLATES.md");
console.log("");
console.log("Warnings:", warnings);

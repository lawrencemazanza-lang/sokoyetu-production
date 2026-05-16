require("dotenv").config();

console.log("SokoYetu Stage 26A Order Operations Check");
console.log("----------------------------------------");

const checks = [
  ["PUBLIC_SITE_URL", process.env.PUBLIC_SITE_URL],
  ["SUPPORT_EMAIL", process.env.SUPPORT_EMAIL],
  ["BUSINESS_NAME", process.env.BUSINESS_NAME],
  ["MPESA_CALLBACK_URL", process.env.MPESA_CALLBACK_URL],
  ["ADMIN_REGISTRATION_ENABLED", process.env.ADMIN_REGISTRATION_ENABLED],
];

let warnings = 0;

for (const [key, value] of checks) {
  if (!value) {
    console.log("WARN:", key, "is not set.");
    warnings += 1;
  } else {
    console.log("OK:", key, "=", value);
  }
}

if (process.env.ADMIN_REGISTRATION_ENABLED === "true") {
  console.log("WARN: ADMIN_REGISTRATION_ENABLED should be false for launch.");
  warnings += 1;
}

console.log("");
console.log("Manual order operations pages to review:");
console.log("- STAGE26A_ORDER_OPERATIONS_WORKFLOW.md");
console.log("- STAGE26A_SELLER_CUSTOMER_MESSAGE_TEMPLATES.md");
console.log("- order-operations.html");
console.log("");
console.log("Warnings:", warnings);
console.log("Stage 26A check completed.");

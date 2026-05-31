require("dotenv").config();

const required = [
  "MPESA_MODE",
  "MPESA_ENV",
  "MPESA_SHORTCODE",
  "MPESA_TRANSACTION_TYPE",
  "MPESA_CONSUMER_KEY",
  "MPESA_CONSUMER_SECRET",
  "MPESA_PASSKEY",
  "MPESA_CALLBACK_URL",
];

console.log("SokoYetu Mtaani M-PESA Configuration Check");
console.log("----------------------------------");

let ok = true;

for (const key of required) {
  const value = process.env[key];

  if (!value) {
    console.log("MISSING:", key);
    ok = false;
  } else if (key.includes("SECRET") || key.includes("PASSKEY") || key.includes("KEY")) {
    console.log("OK:", key, "=", value.slice(0, 4) + "...hidden");
  } else {
    console.log("OK:", key, "=", value);
  }
}

if (process.env.MPESA_MODE !== "daraja") {
  console.log("");
  console.log("WARNING: MPESA_MODE is not daraja. Real sandbox STK Push will not run until MPESA_MODE=\"daraja\".");
  ok = false;
}

if (process.env.MPESA_ENV !== "sandbox") {
  console.log("");
  console.log("WARNING: MPESA_ENV should be sandbox for Stage 15 testing.");
  ok = false;
}

if (process.env.MPESA_CALLBACK_URL && process.env.MPESA_CALLBACK_URL.includes("localhost")) {
  console.log("");
  console.log("WARNING: Callback URL is localhost. Safaricom cannot call localhost. Use ngrok or a deployed HTTPS URL.");
  ok = false;
}

console.log("");
console.log(ok ? "M-PESA config looks ready for sandbox testing." : "Fix the warnings above before testing real Daraja STK Push.");
process.exit(ok ? 0 : 1);


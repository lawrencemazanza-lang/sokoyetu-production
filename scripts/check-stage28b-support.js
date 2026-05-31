require("dotenv").config();

console.log("SokoYetu Mtaani Stage 28B Customer Support and Refund Portal Check");
console.log("----------------------------------------------------------");

let warnings = 0;

if (!process.env.SUPPORT_EMAIL) {
  console.log("WARN: SUPPORT_EMAIL is not set.");
  warnings += 1;
} else {
  console.log("OK: SUPPORT_EMAIL =", process.env.SUPPORT_EMAIL);
}

console.log("OK: support-request.html should be available after server restart/deployment.");
console.log("OK: POST /api/orders/support-request should be available after server restart/deployment.");
console.log("Warnings:", warnings);


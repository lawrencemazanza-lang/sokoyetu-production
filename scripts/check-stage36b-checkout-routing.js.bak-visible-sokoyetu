const fs = require("fs");
const path = require("path");

const root = process.cwd();

console.log("SokoYetu Stage 36B Checkout Routing and STK Repair Check");
console.log("-------------------------------------------------------");

let warnings = 0;

const appPath = path.join(root, "app.js");
const checkoutPath = path.join(root, "checkout.html");

if (!fs.existsSync(appPath)) {
  console.log("WARN: app.js is missing.");
  warnings++;
} else {
  const app = fs.readFileSync(appPath, "utf8");
  const required = [
    "SokoYetu Stage 36B: Checkout routing repair",
    "goToSokoYetuCheckout",
    "/checkout.html"
  ];
  for (const item of required) {
    if (!app.includes(item)) {
      console.log("WARN: app.js missing:", item);
      warnings++;
    } else {
      console.log("OK: app.js includes", item);
    }
  }

  if (app.includes("onclick=\"openModal('mpesaModal')\"")) {
    console.log("WARN: app.js still contains direct openModal('mpesaModal') checkout click.");
    warnings++;
  } else {
    console.log("OK: direct openModal('mpesaModal') checkout clicks removed or guarded.");
  }
}

if (!fs.existsSync(checkoutPath)) {
  console.log("WARN: checkout.html is missing.");
  warnings++;
} else {
  const checkout = fs.readFileSync(checkoutPath, "utf8");
  const required = [
    "deliveryMethod",
    "SELF_PICKUP",
    "Create order and send M-PESA prompt",
    "/api/orders",
    "/api/payments/mpesa/stk-push"
  ];
  for (const item of required) {
    if (!checkout.includes(item)) {
      console.log("WARN: checkout.html missing:", item);
      warnings++;
    } else {
      console.log("OK: checkout.html includes", item);
    }
  }
}

console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 36B checkout routing and STK repair check passed.");

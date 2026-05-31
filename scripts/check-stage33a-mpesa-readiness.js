require("dotenv").config();

console.log("SokoYetu Mtaani Stage 33A Production M-PESA Readiness Check");
console.log("---------------------------------------------------");

let warnings = 0;

function show(key, aliases = [], secret = false) {
  const keys = [key, ...aliases];
  const foundKey = keys.find((k) => process.env[k]);
  const value = foundKey ? process.env[foundKey] : "";

  if (!value) {
    console.log("WARN:", keys.join(" / "), "is not set.");
    warnings += 1;
    return;
  }

  console.log("OK:", foundKey, "=", secret ? value.slice(0, 4) + "...hidden" : value);
}

show("ADMIN_ORDER_TOKEN", [], true);
show("MPESA_ENV");
show("MPESA_MODE");
show("MPESA_CONSUMER_KEY", ["MPESA_DARAJA_CONSUMER_KEY"], true);
show("MPESA_CONSUMER_SECRET", ["MPESA_DARAJA_CONSUMER_SECRET"], true);
show("MPESA_SHORTCODE", ["MPESA_BUSINESS_SHORTCODE", "MPESA_PAYBILL", "MPESA_TILL"]);
show("MPESA_PASSKEY", ["MPESA_LIPA_NA_MPESA_PASSKEY"], true);
show("MPESA_CALLBACK_URL");

if ((process.env.MPESA_ENV || "").toLowerCase() === "production") {
  console.log("INFO: MPESA_ENV is production. Confirm this only after live Safaricom credentials are issued and tested.");
} else {
  console.log("INFO: MPESA_ENV is not production. Keep this until live Daraja credentials are ready.");
}

console.log("");
console.log("Manual readiness items:");
console.log("- Confirm Safaricom production app approval.");
console.log("- Confirm live PayBill/Till/shortcode.");
console.log("- Confirm live consumer key, consumer secret and passkey.");
console.log("- Confirm callback URL points to the Render domain.");
console.log("- Run a small real transaction only after the above are confirmed.");
console.log("");
console.log("Warnings:", warnings);


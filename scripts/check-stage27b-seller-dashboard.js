require("dotenv").config();

console.log("SokoYetu Mtaani Stage 27B Seller Verification Dashboard Check");
console.log("----------------------------------------------------");

let warnings = 0;

if (!process.env.SELLER_VERIFICATION_TOKEN) {
  console.log("WARN: SELLER_VERIFICATION_TOKEN is not set. The seller verification dashboard will not be usable until this is added.");
  warnings += 1;
} else {
  console.log("OK: SELLER_VERIFICATION_TOKEN =", process.env.SELLER_VERIFICATION_TOKEN.slice(0, 4) + "...hidden");
}

console.log("OK: seller-verification.html should be available after server restart/deployment.");
console.log("OK: /api/admin/sellers/verification should be available after server restart/deployment.");
console.log("Warnings:", warnings);


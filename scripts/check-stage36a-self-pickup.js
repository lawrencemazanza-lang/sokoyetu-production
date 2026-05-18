const fs = require("fs");
const path = require("path");
const root = process.cwd();
console.log("SokoYetu Stage 36A Self-Pickup Checkout Check");
console.log("---------------------------------------------");
let warnings = 0;
function checkFile(file, items) {
  const fp = path.join(root, file);
  if (!fs.existsSync(fp)) { console.log("WARN:", file, "is missing."); warnings++; return; }
  const text = fs.readFileSync(fp, "utf8");
  for (const item of items) {
    if (!text.includes(item)) { console.log("WARN:", file, "missing:", item); warnings++; }
    else console.log("OK:", file, "includes", item);
  }
}
checkFile("checkout.html", ["Self-pickup", "deliveryMethod", "SELF_PICKUP", "Pickup is free", "calculateDeliveryFee"]);
checkFile("server.js", ["SokoYetu Stage 36A: Self-pickup checkout support", "isSelfPickup", "finalDeliveryAddress", "SELF PICKUP", "deliveryFee = isSelfPickup ? 0"]);
console.log("");
console.log("Warnings:", warnings);
if (warnings === 0) console.log("Stage 36A self-pickup checkout check passed.");

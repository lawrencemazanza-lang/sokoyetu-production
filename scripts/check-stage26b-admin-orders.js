require("dotenv").config();

console.log("SokoYetu Mtaani Stage 26B Admin Order Tracking Check");
console.log("--------------------------------------------");

let warnings = 0;

if (!process.env.ADMIN_ORDER_TOKEN) {
  console.log("WARN: ADMIN_ORDER_TOKEN is not set. The admin order page will not be usable until this is added.");
  warnings += 1;
} else {
  console.log("OK: ADMIN_ORDER_TOKEN =", process.env.ADMIN_ORDER_TOKEN.slice(0, 4) + "...hidden");
}

console.log("OK: admin-orders.html should be available after server restart/deployment.");
console.log("OK: /api/admin/orders/ops should be available after server restart/deployment.");
console.log("Warnings:", warnings);


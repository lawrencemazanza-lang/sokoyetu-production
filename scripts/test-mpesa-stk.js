require("dotenv").config();

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5173";

async function readJson(response) {
  const text = await response.text();
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

function cookieFrom(response) {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) return "";
  return setCookie.split(";")[0];
}

async function main() {
  const email = process.argv[2] || "testbuyer3@SokoYetu Mtaani.co.ke";
  const password = process.argv[3] || "Test12345";
  const productId = Number(process.argv[4] || 2);
  const phone = process.argv[5] || "254708374149";
  const deliveryAddress = process.argv[6] || "Nairobi CBD, Kenya";

  console.log("Testing SokoYetu Mtaani STK flow with:");
  console.log({ email, productId, phone, deliveryAddress });

  const loginResponse = await fetch(BASE_URL + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const loginData = await readJson(loginResponse);
  const cookie = cookieFrom(loginResponse);

  if (!loginResponse.ok || !cookie) {
    console.error("Login failed:", loginData);
    process.exit(1);
  }

  console.log("Login OK:", loginData.user?.email);

  const cartResponse = await fetch(BASE_URL + "/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ productId, quantity: 1 }),
  });
  const cartData = await readJson(cartResponse);
  if (!cartResponse.ok) { console.error("Add to cart failed:", cartData); process.exit(1); }
  console.log("Add to cart OK:", cartData.cartItem?.product?.name);

  const orderResponse = await fetch(BASE_URL + "/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ deliveryAddress, phone }),
  });
  const orderData = await readJson(orderResponse);
  if (!orderResponse.ok) { console.error("Order creation failed:", orderData); process.exit(1); }
  console.log("Order OK:", orderData.order?.id, "Total:", orderData.order?.totalAmount);

  const stkResponse = await fetch(BASE_URL + "/api/payments/mpesa/stk-push", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ orderId: orderData.order.id, phone }),
  });
  const stkData = await readJson(stkResponse);
  console.log("STK status:", stkResponse.status);
  console.log(stkData);
  if (!stkResponse.ok) { console.error("STK Push failed."); process.exit(1); }
  console.log("");
  console.log("STK request started. Check Daraja response and callback handling.");
}

main().catch((error) => { console.error(error); process.exit(1); });


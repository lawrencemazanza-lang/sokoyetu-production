const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5173";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const payment = await prisma.payment.findFirst({
    orderBy: { createdAt: "desc" },
    include: { order: true },
  });

  if (!payment) {
    console.error("No payment found. Run npm run mpesa:stk first.");
    process.exit(1);
  }

  if (!payment.checkoutRequestId) {
    console.error("Latest payment has no CheckoutRequestID. Run npm run mpesa:stk first and confirm STK_SENT.");
    process.exit(1);
  }

  const receipt = "TEST" + Date.now().toString().slice(-8);

  const callbackPayload = {
    Body: {
      stkCallback: {
        MerchantRequestID: "mock-merchant-request",
        CheckoutRequestID: payment.checkoutRequestId,
        ResultCode: 0,
        ResultDesc: "The service request is processed successfully.",
        CallbackMetadata: {
          Item: [
            { Name: "Amount", Value: payment.amount },
            { Name: "MpesaReceiptNumber", Value: receipt },
            { Name: "Balance" },
            { Name: "TransactionDate", Value: Number(new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)) },
            { Name: "PhoneNumber", Value: Number(payment.phone || "254708374149") },
          ],
        },
      },
    },
  };

  console.log("Posting mock success callback to:", BASE_URL + "/api/payments/mpesa/callback");
  console.log("Using CheckoutRequestID:", payment.checkoutRequestId);

  const response = await fetch(BASE_URL + "/api/payments/mpesa/callback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(callbackPayload),
  });

  const data = await response.json();

  console.log("Callback response status:", response.status);
  console.log(data);

  const updated = await prisma.payment.findUnique({
    where: { id: payment.id },
    include: { order: true },
  });

  console.log("");
  console.log("Updated database status:");
  console.log("Payment:", updated.status);
  console.log("Receipt:", updated.mpesaReceipt);
  console.log("Order paymentStatus:", updated.order.paymentStatus);
  console.log("Order orderStatus:", updated.order.orderStatus);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

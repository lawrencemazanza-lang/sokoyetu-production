const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const intervalMs = Number(process.env.MPESA_POLL_INTERVAL_MS || 5000);
const maxChecks = Number(process.env.MPESA_POLL_MAX_CHECKS || 24);

async function readLatest() {
  return prisma.payment.findFirst({
    orderBy: { createdAt: "desc" },
    include: { order: true },
  });
}

async function main() {
  console.log("Polling latest M-PESA payment every", intervalMs / 1000, "seconds.");
  console.log("Press Ctrl + C to stop.");

  for (let i = 1; i <= maxChecks; i++) {
    const payment = await readLatest();

    if (!payment) {
      console.log("No payment found.");
    } else {
      console.log(
        "[" + i + "/" + maxChecks + "]",
        "Payment", payment.id,
        "Order", payment.orderId,
        "Checkout", payment.checkoutRequestId,
        "PaymentStatus", payment.status,
        "OrderPayment", payment.order.paymentStatus,
        "OrderStatus", payment.order.orderStatus
      );

      if (payment.status === "PAID" || payment.status === "FAILED") {
        console.log("Final callback status received.");
        break;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const payment = await prisma.payment.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: {
          user: true,
          items: { include: { product: true } },
          tracking: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  });

  if (!payment) {
    console.log("No payment record found.");
    return;
  }

  console.log("Latest payment");
  console.log("--------------");
  console.log("Payment ID:", payment.id);
  console.log("Order ID:", payment.orderId);
  console.log("Amount:", payment.amount);
  console.log("Phone:", payment.phone);
  console.log("CheckoutRequestID:", payment.checkoutRequestId);
  console.log("Payment status:", payment.status);
  console.log("Order paymentStatus:", payment.order.paymentStatus);
  console.log("Order orderStatus:", payment.order.orderStatus);
  console.log("Buyer:", payment.order.user.email);
  console.log("Items:", payment.order.items.map((item) => item.product.name + " x " + item.quantity).join(", "));
  console.log("");
  console.log("Tracking:");
  payment.order.tracking.forEach((track) => {
    console.log("-", track.status + ":", track.note || "");
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

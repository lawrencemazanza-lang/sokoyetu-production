const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "HP Pavilion 15 Laptop",
    description: "Powerful laptop for work, study, business, and entertainment with strong performance and reliable storage.",
    category: "Computing",
    price: 65000,
    oldPrice: 75000,
    stock: 18,
    imageUrl: "https://res.cloudinary.com/dx4ae8taf/image/upload/v1778838539/SokoYetu Mtaani/products/whm0j4tk1ayunwmbmtlo.jpg",
    importedByAdmin: true,
  },
  {
    name: "Samsung Galaxy A54 5G",
    description: "Modern 5G smartphone with clear display, strong battery life, and excellent camera quality.",
    category: "Phones & Tablets",
    price: 42000,
    oldPrice: 49000,
    stock: 25,
    imageUrl: "",
    importedByAdmin: true,
  },
  {
    name: "Nike Air Force 1 '07",
    description: "Classic casual sneakers for everyday fashion, comfort, and streetwear styling.",
    category: "Fashion",
    price: 12500,
    oldPrice: 15000,
    stock: 40,
    imageUrl: "",
    importedByAdmin: true,
  },
  {
    name: "Kenyan Coffee Blend - 500g",
    description: "Premium Kenyan coffee blend with rich aroma, smooth taste, and fresh roast quality.",
    category: "Groceries",
    price: 1200,
    oldPrice: 1500,
    stock: 120,
    imageUrl: "",
    importedByAdmin: true,
  },
  {
    name: "African Print Ankara Dress",
    description: "Elegant African print dress made for modern fashion, cultural events, and everyday confidence.",
    category: "Fashion",
    price: 3500,
    oldPrice: 4500,
    stock: 35,
    imageUrl: "",
    importedByAdmin: true,
  },
  {
    name: "Avocado Organic Skincare Set",
    description: "Natural skincare set made with avocado extracts for soft, healthy, and glowing skin.",
    category: "Beauty & Health",
    price: 2800,
    oldPrice: 3500,
    stock: 60,
    imageUrl: "",
    importedByAdmin: true,
  },
  {
    name: "JBL Tune 510BT Headphones",
    description: "Wireless Bluetooth headphones with clear sound, comfortable fit, and long battery life.",
    category: "Electronics",
    price: 5500,
    oldPrice: 7000,
    stock: 50,
    imageUrl: "",
    importedByAdmin: true,
  },
  {
    name: "Jiko Ceramic Cooking Pot - 5L",
    description: "Durable 5 litre ceramic cooking pot for modern Kenyan kitchens and family meals.",
    category: "Home & Garden",
    price: 1800,
    oldPrice: 2200,
    stock: 75,
    imageUrl: "",
    importedByAdmin: true,
  },
  {
    name: "Yoga Mat Premium Non-Slip",
    description: "Comfortable non-slip yoga mat for home workouts, gym sessions, stretching, and fitness routines.",
    category: "Sports",
    price: 2200,
    oldPrice: 3000,
    stock: 42,
    imageUrl: "",
    importedByAdmin: true,
  },
  {
    name: "Kenyan Honey - Pure Raw 1kg",
    description: "Pure raw Kenyan honey from trusted local suppliers, ideal for tea, cooking, and healthy living.",
    category: "Groceries",
    price: 950,
    oldPrice: 1200,
    stock: 100,
    imageUrl: "",
    importedByAdmin: true,
  },
];

async function main() {
  console.log("Starting SokoYetu Mtaani production seed...");
  console.log("Database:", process.env.DATABASE_URL.replace(/:[^:@/]+@/, ":****@"));

  let created = 0;
  let updated = 0;

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          description: product.description,
          category: product.category,
          price: product.price,
          oldPrice: product.oldPrice,
          stock: product.stock,
          imageUrl: existing.imageUrl || product.imageUrl,
          importedByAdmin: true,
        },
      });
      updated += 1;
    } else {
      await prisma.product.create({
        data: product,
      });
      created += 1;
    }
  }

  const count = await prisma.product.count();

  console.log("Production seed completed.");
  console.log("Products created:", created);
  console.log("Products updated:", updated);
  console.log("Total products:", count);
}

main()
  .catch((error) => {
    console.error("Production seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


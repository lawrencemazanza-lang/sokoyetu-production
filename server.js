const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { AccessToken } = require("livekit-server-sdk");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const app = express();

// ================================
// SokoYetu Stage 35C Repair: Early Buyer Journey Smoke Test API
// Registered early so /api/admin/buyer-journey-smoke is not swallowed by static/index fallback.
// Read-only. Does not create orders, trigger M-PESA, edit products, modify payments or change schema.
// ================================
function requireStage35cEarlySmokeToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

async function stage35cEarlySafeCount(modelName) {
  try {
    let client = null;
    try { if (typeof prisma !== "undefined") client = prisma; } catch (_) {}
    if (!client && global.prisma) client = global.prisma;

    if (!client || !client[modelName] || typeof client[modelName].count !== "function") {
      return { model: modelName, available: false, count: null, note: "Model not found on Prisma client." };
    }

    const count = await client[modelName].count();
    return { model: modelName, available: true, count, note: count === 0 ? "No records found." : "Records found." };
  } catch (error) {
    return { model: modelName, available: false, count: null, note: error.message };
  }
}

async function stage35cEarlyBuyerSmokeCounts() {
  const models = ["product", "order", "payment", "user"];
  const out = [];
  for (const model of models) out.push(await stage35cEarlySafeCount(model));
  return out;
}

function stage35cEarlyFileChecks(rootDir) {
  const files = [
    { file: "index.html", critical: true, note: "Homepage must open." },
    { file: "categories.html", critical: true, note: "Product browsing page must open." },
    { file: "product-detail.html", critical: true, note: "Product detail page must open." },
    { file: "checkout.html", critical: true, note: "Checkout page must open." },
    { file: "track-order.html", critical: true, note: "Order tracking page must open." },
    { file: "support-request.html", critical: false, note: "Support request page should exist." },
    { file: "admin-orders.html", critical: true, note: "Admin order monitoring must open." },
    { file: "admin-mpesa-reconciliation.html", critical: true, note: "Payment reconciliation must open." }
  ];

  return files.map((item) => ({
    ...item,
    exists: require("fs").existsSync(require("path").join(rootDir, item.file))
  }));
}

function stage35cEarlyRouteChecks(serverText) {
  const checks = [
    { pattern: "/api/health", critical: true, note: "Health endpoint must exist." },
    { pattern: "/api/products", critical: true, note: "Products API must exist." },
    { pattern: "/api/products/:id", critical: true, note: "Product detail API must exist." },
    { pattern: "/api/cart", critical: true, note: "Cart API pattern should exist." },
    { pattern: "/api/orders", critical: true, note: "Order API pattern should exist." },
    { pattern: "/api/orders/track", critical: true, note: "Order tracking route should exist." },
    { pattern: "/api/payments/:orderId/status", critical: true, note: "Payment status route should exist." },
    { pattern: "/api/admin/orders", critical: true, note: "Admin orders route should exist." },
    { pattern: "ADMIN_ORDER_TOKEN", critical: true, note: "Admin token protection should exist." }
  ];

  return checks.map((item) => ({ ...item, found: serverText.includes(item.pattern) }));
}

async function stage35cEarlySampleProduct() {
  try {
    let client = null;

    try {
      if (typeof prisma !== "undefined") client = prisma;
    } catch (_) {}

    if (!client && global.prisma) client = global.prisma;

    if (!client || !client.product || typeof client.product.findFirst !== "function") {
      return null;
    }

    let product = null;

    try {
      product = await client.product.findFirst({ orderBy: { id: "asc" } });
    } catch (_) {
      product = await client.product.findFirst();
    }

    if (!product) return null;

    const name =
      product.name ||
      product.title ||
      product.productName ||
      product.label ||
      ("Product " + product.id);

    const price =
      product.price ??
      product.sellingPrice ??
      product.unitPrice ??
      product.amount ??
      product.finalPrice ??
      null;

    const stock =
      product.stock ??
      product.quantity ??
      product.availableStock ??
      product.inventory ??
      null;

    const imageUrl =
      product.imageUrl ||
      product.image ||
      product.photoUrl ||
      product.thumbnail ||
      product.productImage ||
      "";

    return {
      id: product.id,
      name,
      title: product.title || product.name || name,
      price,
      stock,
      imageUrl,
    };
  } catch (_) {
    return null;
  }
}

app.get("/api/admin/buyer-journey-smoke", async (req, res) => {
  try {
    if (!requireStage35cEarlySmokeToken(req, res)) return;

    const fs = require("fs");
    const pathModule = require("path");
    const rootDir = __dirname;
    const serverText = fs.readFileSync(pathModule.join(rootDir, "server.js"), "utf8");

    const blockers = [];
    const warnings = [];
    const fileChecks = stage35cEarlyFileChecks(rootDir);
    const routeChecks = stage35cEarlyRouteChecks(serverText);

    for (const item of fileChecks) {
      if (!item.exists && item.critical) blockers.push("Critical buyer-flow file missing: " + item.file);
      else if (!item.exists) warnings.push("Optional buyer-flow file missing: " + item.file);
    }

    for (const item of routeChecks) {
      if (!item.found && item.critical) blockers.push("Critical buyer-flow route/code pattern missing: " + item.pattern);
      else if (!item.found) warnings.push("Optional buyer-flow route/code pattern missing: " + item.pattern);
    }

    const counts = await stage35cEarlyBuyerSmokeCounts();
    const productCount = counts.find((item) => item.model === "product");

    if (!productCount || !productCount.available) blockers.push("Could not verify product count.");
    else if (productCount.count === 0) blockers.push("Product table has zero products.");

    const sampleProduct = await stage35cEarlySampleProduct();
    if (!sampleProduct) blockers.push("No sample product could be selected.");

    const mpesaMode = process.env.MPESA_ENV || process.env.MPESA_MODE || "";
    if (!mpesaMode) warnings.push("M-PESA mode is not set; confirm expected checkout/payment behaviour manually.");

    const decision = blockers.length ? "HOLD" : warnings.length ? "REVIEW" : "READY_FOR_CONTROLLED_MANUAL_BUYER_TEST";

    return res.json({
      message: "Buyer journey smoke test loaded.",
      generatedAt: new Date().toISOString(),
      decision,
      blockers,
      warnings,
      mpesaMode,
      fileChecks,
      routeChecks,
      counts,
      sampleProduct,
      repair: "Stage 35C early API order repair active",
      note: "Read-only API. No order or payment was created by this smoke check."
    });
  } catch (error) {
    console.error("Buyer journey smoke test error:", error);
    return res.status(500).json({ message: "Could not run buyer journey smoke test.", details: error.message });
  }
});



// ================================
// SokoYetu Stage 35A Repair: Early Core Readiness Audit API
// Registered early so /api/admin/core-readiness/audit is not swallowed by static/index fallback.
// Read-only. Does not change orders, products, payments, sellers, support tickets or schema.
// ================================
function stage35aEarlyRequireToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

function stage35aEarlyMask(value) {
  const text = String(value || "");
  if (!text) return "";
  if (text.length <= 10) return text.slice(0, 2) + "...hidden";
  return text.slice(0, 4) + "...hidden..." + text.slice(-3);
}

function stage35aEarlyFileChecks(rootDir) {
  const files = [
    ["index.html", true, "Homepage must open."],
    ["categories.html", true, "Product browsing must work."],
    ["product-detail.html", true, "Product detail flow must work."],
    ["checkout.html", true, "Checkout page must exist."],
    ["track-order.html", true, "Buyer order tracking must exist."],
    ["admin-orders.html", true, "Admin order monitoring must exist."],
    ["admin-control.html", true, "Central admin control must exist."],
    ["admin-mpesa-readiness.html", true, "M-PESA readiness must be reviewable."],
    ["admin-mpesa-reconciliation.html", true, "Payment/order reconciliation must exist."],
    ["admin-mpesa-evidence.html", false, "Evidence export is useful."],
    ["404.html", false, "Friendly fallback should exist."],
    ["500.html", false, "Friendly error page should exist."],
    ["robots.txt", false, "Admin/noindex controls should exist."],
    ["sitemap.xml", false, "Public sitemap should exist."]
  ];
  return files.map(([file, critical, note]) => ({
    file, critical, note,
    exists: require("fs").existsSync(require("path").join(rootDir, file))
  }));
}

function stage35aEarlyRouteChecks(serverText) {
  const checks = [
    ["/api/health", true, "API health check must exist."],
    ["/api/products", true, "Public product API must exist."],
    ["/api/admin", true, "Protected admin route patterns should exist."],
    ["ADMIN_ORDER_TOKEN", true, "Admin token protection should be present."],
    ["mpesa", true, "M-PESA code or readiness references should exist."],
    ["checkout", true, "Checkout route/page references should exist."],
    ["SokoYetu Stage 32E: Friendly Error Pages", false, "Final friendly fallback should exist."],
    ["SokoYetu Stage 33C: M-PESA Payment Reconciliation API", false, "Payment reconciliation endpoint should exist if Stage 33C was applied."],
    ["SokoYetu Stage 33D: M-PESA Evidence Export API", false, "Evidence export endpoint should exist if Stage 33D was applied."]
  ];
  const lower = serverText.toLowerCase();
  return checks.map(([pattern, critical, note]) => ({
    pattern, critical, note,
    found: pattern === "mpesa" || pattern === "checkout" ? lower.includes(pattern) : serverText.includes(pattern)
  }));
}

function stage35aEarlyRouteOrder(serverText) {
  const fallbackIndex = serverText.lastIndexOf("SokoYetu Stage 32E: Friendly Error Pages");
  const earlyIndex = serverText.indexOf("SokoYetu Stage 35A Repair: Early Core Readiness Audit API");
  const routePattern = /app\.(get|post|put|patch|delete|use)\s*\(\s*["']([^"']+)/g;
  const routesAfterFallback = [];
  let match;
  if (fallbackIndex !== -1) {
    while ((match = routePattern.exec(serverText))) {
      if (match.index > fallbackIndex) routesAfterFallback.push(match[1].toUpperCase() + " " + match[2]);
    }
  }
  return {
    fallbackFound: fallbackIndex !== -1,
    stage35aBeforeFallback: fallbackIndex === -1 || (earlyIndex !== -1 && earlyIndex < fallbackIndex),
    routesAfterFallback
  };
}

function stage35aEarlySecretScan(rootDir) {
  const files = ["index.html", "app.js", "public-nav.js", "checkout.html", "categories.html", "product-detail.html"];
  const risky = ["MPESA_CONSUMER_SECRET", "MPESA_PASSKEY", "DATABASE_URL", "ADMIN_ORDER_TOKEN=", "sokoyetu_admin_orders_2026_change_this_secret"];
  const results = [];
  for (const file of files) {
    const filePath = require("path").join(rootDir, file);
    if (!require("fs").existsSync(filePath)) continue;
    const text = require("fs").readFileSync(filePath, "utf8");
    results.push({ file, matches: risky.filter((item) => text.includes(item)) });
  }
  return results;
}

async function stage35aEarlyCount(modelName) {
  try {
    let client = null;
    try { if (typeof prisma !== "undefined") client = prisma; } catch (_) {}
    if (!client && global.prisma) client = global.prisma;
    if (!client || !client[modelName] || typeof client[modelName].count !== "function") {
      return { model: modelName, available: false, count: null, note: "Model not found on Prisma client." };
    }
    const count = await client[modelName].count();
    return { model: modelName, available: true, count, note: count === 0 ? "No records found." : "Records found." };
  } catch (error) {
    return { model: modelName, available: false, count: null, note: error.message };
  }
}

async function stage35aEarlyDatabaseCounts() {
  const models = ["user", "seller", "product", "order", "payment", "supportTicket", "supportRequest"];
  const out = [];
  for (const model of models) out.push(await stage35aEarlyCount(model));
  return out;
}

app.get("/api/admin/core-readiness/audit", async (req, res) => {
  try {
    if (!stage35aEarlyRequireToken(req, res)) return;

    const fs = require("fs");
    const pathModule = require("path");
    const rootDir = __dirname;
    const serverText = fs.readFileSync(pathModule.join(rootDir, "server.js"), "utf8");

    const blockers = [];
    const warnings = [];

    const environment = {
      databaseUrlSet: Boolean(process.env.DATABASE_URL),
      databaseUrl: process.env.DATABASE_URL ? stage35aEarlyMask(process.env.DATABASE_URL) : "",
      adminOrderTokenSet: Boolean(process.env.ADMIN_ORDER_TOKEN),
      adminOrderToken: process.env.ADMIN_ORDER_TOKEN ? stage35aEarlyMask(process.env.ADMIN_ORDER_TOKEN) : "",
      publicSiteUrlSet: Boolean(process.env.PUBLIC_SITE_URL),
      publicSiteUrl: process.env.PUBLIC_SITE_URL || "",
      nodeEnv: process.env.NODE_ENV || "",
      adminRegistrationEnabled: process.env.ADMIN_REGISTRATION_ENABLED || "",
      mpesaMode: process.env.MPESA_ENV || process.env.MPESA_MODE || "",
      mpesaProductionConfirmed: String(process.env.MPESA_PRODUCTION_CONFIRMED || process.env.MPESA_LIVE_CONFIRMED || "").toLowerCase() === "true"
    };

    if (!environment.databaseUrlSet) blockers.push("DATABASE_URL is missing.");
    if (!environment.adminOrderTokenSet) blockers.push("ADMIN_ORDER_TOKEN is missing.");
    if (environment.adminRegistrationEnabled === "true") blockers.push("ADMIN_REGISTRATION_ENABLED is true. Lock admin registration before launch.");
    if (environment.nodeEnv && environment.nodeEnv !== "production") warnings.push("NODE_ENV is not production locally; Render should use production.");
    if (!environment.publicSiteUrlSet) warnings.push("PUBLIC_SITE_URL is not set.");
    if (environment.publicSiteUrl && !/mysokoyetu\.co\.ke/i.test(environment.publicSiteUrl)) warnings.push("PUBLIC_SITE_URL does not appear to use mysokoyetu.co.ke.");

    const mpesaMode = String(environment.mpesaMode || "").toLowerCase();
    if ((mpesaMode === "production" || mpesaMode === "live") && !environment.mpesaProductionConfirmed) {
      blockers.push("M-PESA production/live mode appears requested but MPESA_PRODUCTION_CONFIRMED=true is not set.");
    }

    const fileChecks = stage35aEarlyFileChecks(rootDir);
    fileChecks.forEach((x) => {
      if (!x.exists && x.critical) blockers.push("Critical file missing: " + x.file);
      else if (!x.exists) warnings.push("Optional/readiness file missing: " + x.file);
    });

    const routeChecks = stage35aEarlyRouteChecks(serverText);
    routeChecks.forEach((x) => {
      if (!x.found && x.critical) blockers.push("Critical route/code pattern missing: " + x.pattern);
      else if (!x.found) warnings.push("Optional route/code pattern missing: " + x.pattern);
    });

    const routeOrder = stage35aEarlyRouteOrder(serverText);
    if (routeOrder.routesAfterFallback && routeOrder.routesAfterFallback.length) {
      blockers.push("Routes appear after final 404 fallback and may be unreachable: " + routeOrder.routesAfterFallback.join(", "));
    }

    const databaseCounts = await stage35aEarlyDatabaseCounts();
    const productCount = databaseCounts.find((x) => x.model === "product");
    const orderCount = databaseCounts.find((x) => x.model === "order");
    const paymentCount = databaseCounts.find((x) => x.model === "payment");

    if (productCount && productCount.available && productCount.count === 0) blockers.push("Product table has zero products.");
    if (productCount && !productCount.available) warnings.push("Could not verify Product model count.");
    if (orderCount && !orderCount.available) warnings.push("Could not verify Order model count.");
    if (paymentCount && !paymentCount.available) warnings.push("Could not verify Payment model count.");

    const secretScan = stage35aEarlySecretScan(rootDir);
    secretScan.forEach((x) => {
      if (x.matches.length) blockers.push("Potential secret exposure in public file " + x.file + ": " + x.matches.join(", "));
    });

    const launchDecision = blockers.length ? "HOLD" : warnings.length ? "REVIEW" : "CONTROLLED_TESTING_OK";

    return res.json({
      message: "Core readiness audit completed.",
      generatedAt: new Date().toISOString(),
      launchDecision,
      blockers,
      warnings,
      environment,
      fileChecks,
      routeChecks,
      databaseCounts,
      routeOrder,
      secretScan,
      repair: "Stage 35A early API order repair active",
      note: "Read-only audit. No application data or settings were changed."
    });
  } catch (error) {
    console.error("Core readiness audit error:", error);
    return res.status(500).json({ message: "Could not run core readiness audit.", details: error.message });
  }
});



/* ================================
   SokoYetu Stage 19: Security Hardening
   Adds HTTP security headers, safer cookies, rate limits, request limits and role-abuse protection.
   ================================ */

const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 600 : 3000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please slow down and try again shortly.",
  },
});

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please wait and try again.",
  },
});

const paymentRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: isProduction ? 30 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many payment requests. Please wait and try again.",
  },
});

const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 40 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many upload requests. Please wait and try again.",
  },
});

app.use(generalRateLimit);
app.use("/api/auth/login", authRateLimit);
app.use("/api/auth/register", authRateLimit);
app.use("/api/payments", paymentRateLimit);
app.use("/api/uploads", uploadRateLimit);
app.use("/api/products", uploadRateLimit);

app.use((req, res, next) => {
  const originalCookie = res.cookie.bind(res);

  res.cookie = function hardenedCookie(name, value, options = {}) {
    const lowerName = String(name || "").toLowerCase();

    if (
      lowerName.includes("token") ||
      lowerName.includes("session") ||
      lowerName.includes("auth") ||
      lowerName === "jwt"
    ) {
      options = {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: "/",
        ...options,
      };
    }

    return originalCookie(name, value, options);
  };

  next();
});

app.use((req, res, next) => {
  if (req.path === "/api/auth/register" && req.method === "POST" && req.body) {
    const requestedRole = String(req.body.role || "").toLowerCase();

    if (requestedRole === "admin" && process.env.ADMIN_REGISTRATION_ENABLED !== "true") {
      return res.status(403).json({
        message: "Admin self-registration is disabled. Create admin accounts manually or enable ADMIN_REGISTRATION_ENABLED only during controlled setup.",
      });
    }
  }

  next();
});

app.use((req, res, next) => {
  const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ message: "HTTP method not allowed." });
  }

  next();
});



const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 5173;
const JWT_SECRET = process.env.JWT_SECRET || "sokoyetu_secret";

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.sokoyetu_token;

    if (!token) {
      return res.status(401).json({ message: "Please sign in first." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Account not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Please sign in first." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to access this section.",
      });
    }

    next();
  };
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SokoYetu backend is running.",
  });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const allowedRoles = ["buyer", "seller", "admin"];
    const safeRole = allowedRoles.includes(role) ? role : "buyer";

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        role: safeRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const token = createToken(user);

    res.cookie("sokoyetu_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Account created successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed.",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const userRecord = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!userRecord) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      userRecord.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      role: userRecord.role,
      createdAt: userRecord.createdAt,
    };

    const token = createToken(user);

    res.cookie("sokoyetu_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login failed.",
    });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("sokoyetu_token");
  res.json({
    message: "Logged out successfully.",
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    user: req.user,
  });
});

app.get("/api/buyer/dashboard", requireAuth, requireRole("buyer"), (req, res) => {
  res.json({
    message: "Buyer dashboard is protected and working.",
    user: req.user,
  });
});

app.get("/api/seller/dashboard", requireAuth, requireRole("seller"), (req, res) => {
  res.json({
    message: "Seller dashboard is protected and working.",
    user: req.user,
  });
});

app.get("/api/admin/dashboard", requireAuth, requireRole("admin"), (req, res) => {
  res.json({
    message: "Admin dashboard is protected and working.",
    user: req.user,
  });
});

app.get("/api/products", async (req, res) => {
  try {
    const { search, category } = req.query;

    const where = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        reviews: true,
      },
    });

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load products." });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load product." });
  }
});

app.post("/api/seller/products", requireAuth, requireRole("seller", "admin"), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      oldPrice,
      stock,
      imageUrl,
    } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({
        message: "Name, description, category, and price are required.",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        stock: stock ? Number(stock) : 0,
        imageUrl: imageUrl || null,
        sellerId: req.user.role === "seller" ? req.user.id : null,
        importedByAdmin: req.user.role === "admin",
      },
    });

    res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create product." });
  }
});

app.post("/api/admin/products", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      oldPrice,
      stock,
      imageUrl,
      sellerId,
      importedByAdmin,
    } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({
        message: "Name, description, category, and price are required.",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        stock: stock ? Number(stock) : 0,
        imageUrl: imageUrl || null,
        sellerId: sellerId ? Number(sellerId) : null,
        importedByAdmin: importedByAdmin === false ? false : true,
      },
    });

    res.status(201).json({
      message: "Admin product created successfully.",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create admin product." });
  }
});

app.patch("/api/products/:id", requireAuth, requireRole("seller", "admin"), async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (req.user.role === "seller" && existingProduct.sellerId !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own products.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "category",
      "price",
      "oldPrice",
      "stock",
      "imageUrl",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (["price", "oldPrice", "stock"].includes(field)) {
          updateData[field] = req.body[field] === null || req.body[field] === ""
            ? null
            : Number(req.body[field]);
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update product." });
  }
});

app.delete("/api/products/:id", requireAuth, requireRole("seller", "admin"), async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (req.user.role === "seller" && existingProduct.sellerId !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own products.",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete product." });
  }
});
app.get("/api/cart", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const deliveryFee = subtotal >= 10000 || subtotal === 0 ? 0 : 300;
    const total = subtotal + deliveryFee;

    res.json({
      cartItems,
      summary: {
        subtotal,
        deliveryFee,
        total,
        freeDeliveryThreshold: 10000,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load cart." });
  }
});

app.post("/api/cart", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: "This product is out of stock." });
    }

    const safeQuantity = quantity ? Math.max(1, Number(quantity)) : 1;

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: Number(productId),
        },
      },
      update: {
        quantity: {
          increment: safeQuantity,
        },
      },
      create: {
        userId: req.user.id,
        productId: Number(productId),
        quantity: safeQuantity,
      },
      include: { product: true },
    });

    res.status(201).json({
      message: "Product added to cart.",
      cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not add product to cart." });
  }
});

app.patch("/api/cart/:id", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    res.json({
      message: "Cart updated.",
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update cart item." });
  }
});

app.delete("/api/cart/:id", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    const id = Number(req.params.id);

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    res.json({ message: "Cart item removed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not remove cart item." });
  }
});

app.delete("/api/cart", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id },
    });

    res.json({ message: "Cart cleared." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not clear cart." });
  }
});

app.post("/api/orders", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    // SokoYetu Stage 36A: Self-pickup checkout support
    const { phone } = req.body;
    const requestedDeliveryMethod = String(req.body.deliveryMethod || req.body.fulfillmentMethod || "DELIVERY").toUpperCase();
    const isSelfPickup = ["SELF_PICKUP", "SELF-PICKUP", "PICKUP", "COLLECTION"].includes(requestedDeliveryMethod);
    const rawDeliveryAddress = String(req.body.deliveryAddress || "").trim();
    const deliveryMethod = isSelfPickup ? "SELF_PICKUP" : "DELIVERY";
    const finalDeliveryAddress = isSelfPickup
      ? "SELF PICKUP - Buyer will collect the order. Confirm pickup details using the checkout phone before releasing the product."
      : rawDeliveryAddress;

    if (!isSelfPickup && !finalDeliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required for home delivery." });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const deliveryFee = isSelfPickup ? 0 : (subtotal >= 10000 ? 0 : 300);
    const totalAmount = subtotal + deliveryFee;
    const orderFulfilmentMethod = deliveryMethod;
    const paymentPhone = phone || req.user.phone || "";

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount,
          deliveryFee,
          paymentMethod: "MPESA",
          paymentStatus: "PENDING",
          orderStatus: "PENDING_PAYMENT",
          deliveryAddress: finalDeliveryAddress,
          phone: paymentPhone,
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });

      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: "MPESA",
          phone: paymentPhone,
          amount: totalAmount,
          status: "PENDING",
        },
      });

      await tx.deliveryTracking.create({
        data: {
          orderId: order.id,
          status: "Order Created",
          note: "Order created and waiting for M-PESA payment.",
        },
      });

      await tx.cartItem.deleteMany({
        where: { userId: req.user.id },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: { include: { product: true } },
          payment: true,
          tracking: true,
        },
      });
    });

    res.status(201).json({
      message: "Order created successfully. M-PESA payment is pending.",
      order: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create order." });
  }
});

app.get("/api/orders", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        payment: true,
        tracking: true,
      },
    });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load orders." });
  }
});

app.get("/api/orders/:id", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    const id = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        payment: true,
        tracking: true,
      },
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load order." });
  }
});
// ================================
// SokoYetu Step 6: M-PESA STK Push Routes
// Paste this code in server.js ABOVE the final app.use((req, res) => {...}) fallback.
// This uses your existing Prisma models: Order and Payment.
// ================================

function normalizeKenyanPhone(phone) {
  if (!phone) return "";
  let cleaned = String(phone).replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.slice(1);
  }

  if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    cleaned = "254" + cleaned;
  }

  if (!cleaned.startsWith("254")) {
    return "";
  }

  return cleaned;
}

function getMpesaTimestamp() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const lookup = {};
  parts.forEach((part) => {
    lookup[part.type] = part.value;
  });

  return `${lookup.year}${lookup.month}${lookup.day}${lookup.hour}${lookup.minute}${lookup.second}`;
}

function getMpesaBaseUrl() {
  return process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

async function getMpesaAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-PESA consumer key and secret are missing.");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await fetch(
    `${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    console.error("M-PESA token error:", data);
    throw new Error("Could not get M-PESA access token.");
  }

  return data.access_token;
}

app.post("/api/payments/mpesa/stk-push", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        payment: true,
        items: { include: { product: true } },
      },
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({ message: "This order is already paid." });
    }

    const paymentPhone = normalizeKenyanPhone(phone || order.phone || req.user.phone);

    if (!paymentPhone) {
      return res.status(400).json({
        message: "Use a valid Kenyan phone number, for example 0714565555 or 254714565555.",
      });
    }

    const amount = Number(order.totalAmount);
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    const accountReference = `SokoYetu-${order.id}`;
    const transactionDescription = `Payment for SokoYetu order ${order.id}`;

    // DEMO MODE:
    // This lets you test the website flow without real Safaricom credentials.
    // Change MPESA_MODE to "daraja" in .env when you have real sandbox/live credentials.
    if (process.env.MPESA_MODE !== "daraja") {
      const demoCheckoutRequestId = `DEMO-${Date.now()}-${order.id}`;

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PENDING",
          orderStatus: "WAITING_MPESA_CONFIRMATION",
        },
        include: {
          payment: true,
          items: { include: { product: true } },
          tracking: true,
        },
      });

      await prisma.payment.update({
        where: { orderId: order.id },
        data: {
          phone: paymentPhone,
          amount,
          checkoutRequestId: demoCheckoutRequestId,
          status: "STK_SENT_DEMO",
        },
      });

      await prisma.deliveryTracking.create({
        data: {
          orderId: order.id,
          status: "M-PESA Demo STK Sent",
          note: "Demo payment prompt prepared. Switch MPESA_MODE to daraja for real Safaricom STK Push.",
        },
      });

      return res.json({
        message: "Demo M-PESA STK Push prepared successfully.",
        mode: "demo",
        checkoutRequestId: demoCheckoutRequestId,
        order: updatedOrder,
      });
    }

    if (!shortcode || !passkey || !callbackUrl) {
      return res.status(500).json({
        message: "M-PESA Daraja credentials are incomplete in .env.",
      });
    }

    const timestamp = getMpesaTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
    const accessToken = await getMpesaAccessToken();

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: paymentPhone,
      PartyB: shortcode,
      PhoneNumber: paymentPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDescription,
    };

    const stkResponse = await fetch(`${getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const stkData = await stkResponse.json();

    if (!stkResponse.ok) {
      console.error("M-PESA STK Push error:", stkData);
      return res.status(502).json({
        message: "M-PESA STK Push failed.",
        details: stkData,
      });
    }

    await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        phone: paymentPhone,
        amount,
        checkoutRequestId: stkData.CheckoutRequestID || null,
        status: "STK_SENT",
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PENDING",
        orderStatus: "WAITING_MPESA_CONFIRMATION",
      },
    });

    await prisma.deliveryTracking.create({
      data: {
        orderId: order.id,
        status: "M-PESA STK Sent",
        note: "Payment request sent to customer phone.",
      },
    });

    res.json({
      message: "M-PESA STK Push sent successfully.",
      mode: "daraja",
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID,
      response: stkData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not start M-PESA payment." });
  }
});

app.post("/api/payments/mpesa/callback", async (req, res) => {
  try {
    const body = req.body;
    console.log("M-PESA callback received:", JSON.stringify(body, null, 2));

    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return res.json({ ResultCode: 0, ResultDesc: "Callback received without STK body." });
    }

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    const resultDesc = callback.ResultDesc;

    const payment = await prisma.payment.findFirst({
      where: { checkoutRequestId },
      include: { order: true },
    });

    if (!payment) {
      return res.json({ ResultCode: 0, ResultDesc: "Payment record not found, callback accepted." });
    }

    if (resultCode === 0) {
      const metadataItems = callback.CallbackMetadata?.Item || [];

      const getMeta = (name) => {
        const found = metadataItems.find((item) => item.Name === name);
        return found ? found.Value : null;
      };

      const receipt = getMeta("MpesaReceiptNumber");
      const paidAmount = Number(getMeta("Amount") || payment.amount);

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          mpesaReceipt: receipt ? String(receipt) : null,
          amount: paidAmount,
        },
      });

      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "PAID",
          orderStatus: "PAYMENT_CONFIRMED",
        },
      });

      await prisma.deliveryTracking.create({
        data: {
          orderId: payment.orderId,
          status: "Payment Confirmed",
          note: receipt ? `M-PESA receipt: ${receipt}` : "M-PESA payment confirmed.",
        },
      });
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
        },
      });

      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "FAILED",
          orderStatus: "PAYMENT_FAILED",
        },
      });

      await prisma.deliveryTracking.create({
        data: {
          orderId: payment.orderId,
          status: "Payment Failed",
          note: resultDesc || "M-PESA payment failed or was cancelled.",
        },
      });
    }

    res.json({ ResultCode: 0, ResultDesc: "Callback processed successfully." });
  } catch (error) {
    console.error(error);
    res.json({ ResultCode: 0, ResultDesc: "Callback received with internal processing error." });
  }
});

app.get("/api/payments/:orderId/status", requireAuth, requireRole("buyer"), async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
        tracking: true,
      },
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({
      orderId: order.id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      payment: order.payment,
      tracking: order.tracking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load payment status." });
  }
});


// ================================
// SokoYetu Step 8: Seller Dashboard Backend
// These routes are protected. Only signed-in sellers can access them.
// Paste location: above the final app.use fallback.
// ================================

app.get("/api/seller/products", requireAuth, requireRole("seller"), async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        reviews: true,
      },
    });

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load seller products." });
  }
});

app.get("/api/seller/orders", requireAuth, requireRole("seller"), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: req.user.id,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payment: true,
        tracking: true,
        items: {
          where: {
            product: {
              sellerId: req.user.id,
            },
          },
          include: {
            product: true,
          },
        },
      },
    });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load seller orders." });
  }
});

app.get("/api/seller/dashboard-data", requireAuth, requireRole("seller"), async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: req.user.id },
      include: { reviews: true },
      orderBy: { createdAt: "desc" },
    });

    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: req.user.id,
            },
          },
        },
      },
      include: {
        payment: true,
        tracking: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          where: {
            product: {
              sellerId: req.user.id,
            },
          },
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const sellerRevenue = orders.reduce((sum, order) => {
      const orderSellerTotal = order.items.reduce((itemSum, item) => {
        return itemSum + item.price * item.quantity;
      }, 0);

      return sum + orderSellerTotal;
    }, 0);

    const paidRevenue = orders
      .filter((order) => order.paymentStatus === "PAID")
      .reduce((sum, order) => {
        const orderSellerTotal = order.items.reduce((itemSum, item) => {
          return itemSum + item.price * item.quantity;
        }, 0);

        return sum + orderSellerTotal;
      }, 0);

    const lowStockProducts = products.filter((product) => product.stock <= 5);

    const totalReviews = products.reduce((sum, product) => {
      return sum + product.reviews.length;
    }, 0);

    const averageRating =
      totalReviews === 0
        ? 0
        : products.reduce((sum, product) => {
            const productRatingTotal = product.reviews.reduce((ratingSum, review) => {
              return ratingSum + review.rating;
            }, 0);

            return sum + productRatingTotal;
          }, 0) / totalReviews;

    res.json({
      seller: req.user,
      metrics: {
        activeProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter((order) => order.orderStatus !== "DELIVERED").length,
        sellerRevenue,
        paidRevenue,
        lowStockCount: lowStockProducts.length,
        averageRating: Number(averageRating.toFixed(1)),
      },
      products,
      orders,
      lowStockProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load seller dashboard." });
  }
});

app.patch("/api/seller/orders/:id/status", requireAuth, requireRole("seller"), async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status, note } = req.body;

    const allowedStatuses = [
      "SELLER_PREPARING_ITEM",
      "DISPATCHED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
        allowedStatuses,
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        items: {
          some: {
            product: {
              sellerId: req.user.id,
            },
          },
        },
      },
      include: {
        items: {
          where: {
            product: {
              sellerId: req.user.id,
            },
          },
          include: { product: true },
        },
        payment: true,
        tracking: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found for this seller.",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: status,
      },
      include: {
        items: { include: { product: true } },
        payment: true,
        tracking: true,
      },
    });

    await prisma.deliveryTracking.create({
      data: {
        orderId,
        status,
        note: note || "Seller updated the order status.",
      },
    });

    res.json({
      message: "Seller order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update seller order status." });
  }
});



// ================================
// SokoYetu Step 9: Admin Dashboard Backend
// These routes are protected. Only signed-in admins can access them.
// Paste location: above the final app.use fallback.
// ================================

app.get("/api/admin/dashboard-data", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const [
      users,
      products,
      orders,
      payments,
      wholesalers,
      wholesalerProducts,
    ] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          reviews: true,
        },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          items: { include: { product: true } },
          payment: true,
          tracking: true,
        },
      }),
      prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          order: true,
        },
      }),
      prisma.wholesaler.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          products: true,
        },
      }),
      prisma.wholesalerProduct.findMany({
        include: {
          wholesaler: true,
        },
      }),
    ]);

    const paidRevenue = orders
      .filter((order) => order.paymentStatus === "PAID")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const pendingRevenue = orders
      .filter((order) => order.paymentStatus !== "PAID")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const lowStockProducts = products.filter((product) => product.stock <= 5);

    const usersByRole = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      { buyer: 0, seller: 0, admin: 0 }
    );

    const importedProducts = products.filter((product) => product.importedByAdmin);

    res.json({
      admin: req.user,
      metrics: {
        totalUsers: users.length,
        buyers: usersByRole.buyer || 0,
        sellers: usersByRole.seller || 0,
        admins: usersByRole.admin || 0,
        totalProducts: products.length,
        importedProducts: importedProducts.length,
        totalOrders: orders.length,
        paidOrders: orders.filter((order) => order.paymentStatus === "PAID").length,
        pendingOrders: orders.filter((order) => order.paymentStatus !== "PAID").length,
        paidRevenue,
        pendingRevenue,
        lowStockCount: lowStockProducts.length,
        wholesalers: wholesalers.length,
        wholesalerProducts: wholesalerProducts.length,
      },
      users,
      products,
      orders,
      payments,
      wholesalers,
      lowStockProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load admin dashboard." });
  }
});

app.get("/api/admin/users", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load users." });
  }
});

app.patch("/api/admin/users/:id/role", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;

    const allowedRoles = ["buyer", "seller", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role.",
        allowedRoles,
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      message: "User role updated successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update user role." });
  }
});

app.get("/api/admin/products", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        reviews: true,
      },
    });

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load admin products." });
  }
});

app.get("/api/admin/orders", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        items: { include: { product: true } },
        payment: true,
        tracking: true,
      },
    });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load admin orders." });
  }
});

app.patch("/api/admin/orders/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { orderStatus, paymentStatus, note } = req.body;

    const updateData = {};

    if (orderStatus) {
      updateData.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        items: { include: { product: true } },
        payment: true,
        tracking: true,
      },
    });

    if (orderStatus || paymentStatus || note) {
      await prisma.deliveryTracking.create({
        data: {
          orderId: id,
          status: orderStatus || paymentStatus || "Admin Update",
          note: note || "Admin updated this order.",
        },
      });
    }

    res.json({
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update order." });
  }
});

app.get("/api/admin/payments", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    res.json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load payments." });
  }
});

app.get("/api/admin/wholesalers", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { search } = req.query;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { location: { contains: search } },
            { category: { contains: search } },
          ],
        }
      : {};

    const wholesalers = await prisma.wholesaler.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { products: true },
    });

    res.json({ wholesalers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load wholesalers." });
  }
});

app.post("/api/admin/wholesalers", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { name, location, phone, email, category, score } = req.body;

    if (!name || !location || !category) {
      return res.status(400).json({
        message: "Wholesaler name, location, and category are required.",
      });
    }

    const wholesaler = await prisma.wholesaler.create({
      data: {
        name,
        location,
        phone: phone || null,
        email: email || null,
        category,
        score: score ? Number(score) : 80,
      },
    });

    res.status(201).json({
      message: "Wholesaler added successfully.",
      wholesaler,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not add wholesaler." });
  }
});

app.post("/api/admin/wholesalers/:id/products", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const wholesalerId = Number(req.params.id);
    const {
      name,
      category,
      wholesalePrice,
      marketPrice,
      stock,
      imageUrl,
      notes,
    } = req.body;

    if (!name || !category || !wholesalePrice || !marketPrice) {
      return res.status(400).json({
        message: "Product name, category, wholesale price, and market price are required.",
      });
    }

    const wholesaler = await prisma.wholesaler.findUnique({
      where: { id: wholesalerId },
    });

    if (!wholesaler) {
      return res.status(404).json({ message: "Wholesaler not found." });
    }

    const product = await prisma.wholesalerProduct.create({
      data: {
        wholesalerId,
        name,
        category,
        wholesalePrice: Number(wholesalePrice),
        marketPrice: Number(marketPrice),
        stock: stock ? Number(stock) : 0,
        imageUrl: imageUrl || null,
        notes: notes || null,
      },
    });

    res.status(201).json({
      message: "Wholesaler product added successfully.",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not add wholesaler product." });
  }
});

app.post("/api/admin/import-wholesale-product", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { wholesalerProductId, profitPercent } = req.body;

    if (!wholesalerProductId) {
      return res.status(400).json({
        message: "Wholesaler product ID is required.",
      });
    }

    const sourceProduct = await prisma.wholesalerProduct.findUnique({
      where: { id: Number(wholesalerProductId) },
      include: { wholesaler: true },
    });

    if (!sourceProduct) {
      return res.status(404).json({ message: "Wholesaler product not found." });
    }

    const safeProfitPercent = profitPercent ? Number(profitPercent) : 20;
    const sellingPrice = Math.ceil(sourceProduct.wholesalePrice * (1 + safeProfitPercent / 100));
    const expectedProfit = sellingPrice - sourceProduct.wholesalePrice;
    const isCompetitive = sellingPrice <= sourceProduct.marketPrice;

    const product = await prisma.product.create({
      data: {
        name: sourceProduct.name,
        description:
          sourceProduct.notes ||
          `Imported from verified wholesaler ${sourceProduct.wholesaler.name}. Priced with ${safeProfitPercent}% profit while checking market competitiveness.`,
        category: sourceProduct.category,
        price: sellingPrice,
        oldPrice: sourceProduct.marketPrice,
        stock: sourceProduct.stock,
        imageUrl: sourceProduct.imageUrl || null,
        sellerId: null,
        importedByAdmin: true,
      },
    });

    res.status(201).json({
      message: "Wholesaler product imported to SokoYetu wall successfully.",
      product,
      pricing: {
        wholesalePrice: sourceProduct.wholesalePrice,
        marketPrice: sourceProduct.marketPrice,
        profitPercent: safeProfitPercent,
        sellingPrice,
        expectedProfit,
        isCompetitive,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not import wholesale product." });
  }
});



// ================================
// SokoYetu Stage 16: Hybrid Local and Cloudinary Product Image Storage
// Keeps local uploads for development and uses Cloudinary when UPLOAD_MODE=cloudinary.
// Existing frontend forms still work because the same routes return imageUrl.
// ================================

const uploadRoot = path.join(__dirname, "uploads");
const productUploadDir = path.join(uploadRoot, "products");

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot);
}

if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

const useCloudinaryStorage =
  process.env.UPLOAD_MODE === "cloudinary" &&
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (useCloudinaryStorage) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log("Product image storage: Cloudinary");
} else {
  console.log("Product image storage: local uploads/products");
}

const productImageDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadDir);
  },
  filename: (req, file, cb) => {
    const safeOriginal = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/-+/g, "-");

    const ext = path.extname(safeOriginal) || ".jpg";
    const baseName = path.basename(safeOriginal, ext).slice(0, 60) || "product";
    cb(null, baseName + "-" + Date.now() + ext);
  },
});

const productImageUpload = multer({
  storage: useCloudinaryStorage ? multer.memoryStorage() : productImageDiskStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP and GIF product images are allowed."));
    }

    cb(null, true);
  },
});

function uploadBufferToCloudinary(file, folder = "sokoyetu/products") {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("No image buffer found for Cloudinary upload."));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

async function resolveUploadedProductImageUrl(req) {
  if (!req.file) {
    throw new Error("Product image is required.");
  }

  if (useCloudinaryStorage) {
    const result = await uploadBufferToCloudinary(req.file);
    return {
      imageUrl: result.secure_url,
      storage: "cloudinary",
      filename: result.public_id,
      size: req.file.size,
      mimetype: req.file.mimetype,
    };
  }

  return {
    imageUrl: "/uploads/products/" + req.file.filename,
    storage: "local",
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  };
}

app.post(
  "/api/uploads/product-image",
  requireAuth,
  requireRole("seller", "admin"),
  productImageUpload.single("image"),
  async (req, res) => {
    try {
      const uploaded = await resolveUploadedProductImageUrl(req);

      res.status(201).json({
        message: "Product image uploaded successfully.",
        imageUrl: uploaded.imageUrl,
        storage: uploaded.storage,
        file: {
          filename: uploaded.filename,
          size: uploaded.size,
          mimetype: uploaded.mimetype,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Could not upload product image." });
    }
  }
);

app.patch(
  "/api/products/:id/image",
  requireAuth,
  requireRole("seller", "admin"),
  productImageUpload.single("image"),
  async (req, res) => {
    try {
      const productId = Number(req.params.id);

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      if (req.user.role === "seller" && product.sellerId !== req.user.id) {
        return res.status(403).json({
          message: "You can only update images for your own products.",
        });
      }

      const uploaded = await resolveUploadedProductImageUrl(req);

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { imageUrl: uploaded.imageUrl },
      });

      res.json({
        message: "Product image updated successfully.",
        imageUrl: uploaded.imageUrl,
        storage: uploaded.storage,
        product: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Could not update product image." });
    }
  }
);




// ================================
// SokoYetu Stage 17: LiveKit Livestreaming Backend
// Adds real livestream sessions and server-generated LiveKit tokens.
// ================================

function hasLiveKitConfig() {
  return Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET);
}

function createLiveRoomName(sellerId) {
  return "sokoyetu-live-" + sellerId + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

app.get("/api/live/config", requireAuth, async (req, res) => {
  res.json({
    configured: hasLiveKitConfig(),
    livekitUrl: process.env.LIVEKIT_URL || null,
    user: req.user,
  });
});

app.get("/api/live/sessions", async (req, res) => {
  try {
    const sessions = await prisma.liveSession.findMany({
      where: { status: "LIVE" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load live sessions." });
  }
});

app.get("/api/live/my-sessions", requireAuth, requireRole("seller", "admin"), async (req, res) => {
  try {
    const where = req.user.role === "admin" ? {} : { sellerId: req.user.id };

    const sessions = await prisma.liveSession.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load your live sessions." });
  }
});

app.post("/api/live/sessions", requireAuth, requireRole("seller", "admin"), async (req, res) => {
  try {
    const { title, offerText, productId, productName } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: "Live session title is required." });
    }

    const session = await prisma.liveSession.create({
      data: {
        sellerId: req.user.id,
        sellerName: req.user.name,
        sellerEmail: req.user.email,
        title: title.trim(),
        offerText: offerText ? offerText.trim() : null,
        productId: productId ? Number(productId) : null,
        productName: productName ? productName.trim() : null,
        roomName: createLiveRoomName(req.user.id),
        status: "LIVE",
      },
    });

    res.status(201).json({
      message: "Live session created successfully.",
      session,
      livekitConfigured: hasLiveKitConfig(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create live session." });
  }
});

app.patch("/api/live/sessions/:id/end", requireAuth, requireRole("seller", "admin"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const session = await prisma.liveSession.findUnique({ where: { id } });

    if (!session) return res.status(404).json({ message: "Live session not found." });

    if (req.user.role !== "admin" && session.sellerId !== req.user.id) {
      return res.status(403).json({ message: "You can only end your own live sessions." });
    }

    const updated = await prisma.liveSession.update({
      where: { id },
      data: { status: "ENDED", endedAt: new Date() },
    });

    res.json({ message: "Live session ended.", session: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not end live session." });
  }
});

app.post("/api/live/sessions/:id/token", requireAuth, async (req, res) => {
  try {
    if (!hasLiveKitConfig()) {
      return res.status(400).json({
        message: "LiveKit is not configured. Add LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET to .env.",
      });
    }

    const id = Number(req.params.id);
    const session = await prisma.liveSession.findUnique({ where: { id } });

    if (!session) return res.status(404).json({ message: "Live session not found." });
    if (session.status !== "LIVE") return res.status(400).json({ message: "This live session has ended." });

    const isHost = req.user.role === "admin" || (req.user.role === "seller" && session.sellerId === req.user.id);
    const identity = req.user.role + "-" + req.user.id + "-" + Date.now();

    const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
      identity,
      name: req.user.name || req.user.email,
      ttl: "2h",
    });

    token.addGrant({
      roomJoin: true,
      room: session.roomName,
      canPublish: isHost,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await token.toJwt();

    res.json({
      token: jwt,
      livekitUrl: process.env.LIVEKIT_URL,
      roomName: session.roomName,
      session,
      canPublish: isHost,
      participant: { identity, name: req.user.name, role: req.user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create LiveKit token." });
  }
});



app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// ================================
// SokoYetu Stage 26B: Admin Order Tracking API
// Protected by ADMIN_ORDER_TOKEN. Does not change checkout or M-PESA STK Push flow.
// ================================
function requireAdminOrderToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

app.get("/api/admin/orders/ops", async (req, res) => {
  try {
    if (!requireAdminOrderToken(req, res)) return;

    const status = String(req.query.status || "").trim();
    const q = String(req.query.q || "").trim();
    const where = {};

    if (status) where.orderStatus = status;

    if (q) {
      const numericId = Number(q);
      where.OR = [
        ...(Number.isFinite(numericId) && numericId > 0 ? [{ id: numericId }] : []),
        { phone: { contains: q, mode: "insensitive" } },
        { deliveryAddress: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { id: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, role: true } },
        items: { include: { product: { select: { id: true, name: true, category: true, price: true, imageUrl: true } } } },
        payment: true,
        tracking: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });

    return res.json({ message: "Admin orders loaded.", count: orders.length, orders });
  } catch (error) {
    console.error("Admin orders load error:", error);
    return res.status(500).json({ message: "Could not load admin orders.", details: error.message });
  }
});

app.post("/api/admin/orders/:id/status", async (req, res) => {
  try {
    if (!requireAdminOrderToken(req, res)) return;

    const id = Number(req.params.id);
    const orderStatus = String(req.body?.orderStatus || "").trim();
    const note = String(req.body?.note || "").trim();

    const allowedStatuses = new Set([
      "PENDING_PAYMENT", "PAID", "PROCESSING", "READY_FOR_DELIVERY",
      "OUT_FOR_DELIVERY", "DELIVERED", "FAILED_PAYMENT", "CANCELLED",
      "REFUND_REQUESTED", "REFUNDED",
    ]);

    if (!id || id <= 0) return res.status(400).json({ message: "Valid order ID is required." });
    if (!allowedStatuses.has(orderStatus)) return res.status(400).json({ message: "Invalid order status." });

    const order = await prisma.order.update({
      where: { id },
      data: { orderStatus },
      include: {
        payment: true,
        user: { select: { id: true, name: true, email: true, phone: true, role: true } },
      },
    });

    await prisma.deliveryTracking.create({
      data: {
        orderId: id,
        status: orderStatus,
        note: note || `Admin updated order status to ${orderStatus}.`,
      },
    });

    return res.json({ message: "Order status updated.", order });
  } catch (error) {
    console.error("Admin order status update error:", error);
    return res.status(500).json({ message: "Could not update order status.", details: error.message });
  }
});



// ================================
// SokoYetu Stage 27B: Seller Verification Dashboard API
// Protected by SELLER_VERIFICATION_TOKEN. No schema migration in this safe version.
// ================================
function requireSellerVerificationToken(req, res) {
  const configuredToken = process.env.SELLER_VERIFICATION_TOKEN;
  const providedToken = req.headers["x-seller-verification-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "SELLER_VERIFICATION_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid seller verification token." });
    return false;
  }

  return true;
}

function assessSellerRisk(seller, products) {
  const issues = [];

  if (!seller.phone) issues.push("Missing phone");
  if (!seller.email) issues.push("Missing email");
  if (!seller.name) issues.push("Missing name");
  if (!products.length) issues.push("No products listed");

  const missingImages = products.filter((p) => !p.imageUrl).length;
  if (missingImages > 0) issues.push(`${missingImages} product(s) missing image`);

  const lowStock = products.filter((p) => Number(p.stock || 0) <= 0).length;
  if (lowStock > 0) issues.push(`${lowStock} product(s) out of stock`);

  const suspicious = products.filter((p) => /fake|replica|copy|counterfeit/i.test(String(p.name || "") + " " + String(p.description || ""))).length;
  if (suspicious > 0) issues.push(`${suspicious} product(s) need counterfeit wording review`);

  let riskLevel = "LOW";
  if (issues.some((issue) => /counterfeit|fake|replica|copy|Missing phone|Missing email/i.test(issue))) riskLevel = "HIGH";
  else if (issues.length) riskLevel = "MEDIUM";

  return { riskLevel, issues };
}

app.get("/api/admin/sellers/verification", async (req, res) => {
  try {
    if (!requireSellerVerificationToken(req, res)) return;

    const filter = String(req.query.filter || "").trim();
    const q = String(req.query.q || "").trim();

    const where = {
      role: "seller",
    };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ];
    }

    const sellers = await prisma.user.findMany({
      where,
      orderBy: { id: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        products: {
          orderBy: { id: "desc" },
          take: 20,
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            price: true,
            stock: true,
            imageUrl: true,
            createdAt: true,
          },
        },
      },
    });

    let prepared = sellers.map((seller) => {
      const products = seller.products || [];
      const risk = assessSellerRisk(seller, products);

      return {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        role: seller.role,
        productCount: products.length,
        products,
        riskLevel: risk.riskLevel,
        issues: risk.issues,
      };
    });

    if (filter === "with-products") prepared = prepared.filter((seller) => seller.productCount > 0);
    if (filter === "without-products") prepared = prepared.filter((seller) => seller.productCount === 0);
    if (filter === "risk-review") prepared = prepared.filter((seller) => seller.riskLevel !== "LOW");

    return res.json({
      message: "Seller verification records loaded.",
      count: prepared.length,
      sellers: prepared,
    });
  } catch (error) {
    console.error("Seller verification load error:", error);
    return res.status(500).json({
      message: "Could not load seller verification records.",
      details: error.message,
    });
  }
});

app.post("/api/admin/sellers/:id/verification-note", async (req, res) => {
  try {
    if (!requireSellerVerificationToken(req, res)) return;

    const id = Number(req.params.id);
    const decision = String(req.body?.decision || "").trim();
    const note = String(req.body?.note || "").trim();

    const allowed = new Set(["APPROVED", "MORE_INFO", "HOLD", "SUSPEND", "REJECT"]);

    if (!id || id <= 0) return res.status(400).json({ message: "Valid seller ID is required." });
    if (!allowed.has(decision)) return res.status(400).json({ message: "Invalid seller decision." });

    const seller = await prisma.user.findFirst({
      where: { id, role: "seller" },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    if (!seller) return res.status(404).json({ message: "Seller was not found." });

    console.log("Seller verification decision:", {
      sellerId: seller.id,
      sellerEmail: seller.email,
      decision,
      note,
      recordedAt: new Date().toISOString(),
    });

    return res.json({
      message: "Seller verification decision recorded in server logs.",
      seller,
      decision,
      note,
    });
  } catch (error) {
    console.error("Seller verification note error:", error);
    return res.status(500).json({
      message: "Could not record seller verification decision.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 27C: Persistent Seller Verification API
// Requires SellerVerification Prisma model and SELLER_VERIFICATION_TOKEN.
// ================================
function requirePersistentSellerVerificationToken(req, res) {
  const configuredToken = process.env.SELLER_VERIFICATION_TOKEN;
  const providedToken = req.headers["x-seller-verification-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "SELLER_VERIFICATION_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid seller verification token." });
    return false;
  }

  return true;
}

function assessPersistentSellerRisk(seller, products) {
  const issues = [];

  if (!seller.phone) issues.push("Missing phone");
  if (!seller.email) issues.push("Missing email");
  if (!seller.name) issues.push("Missing name");
  if (!products.length) issues.push("No products listed");

  const missingImages = products.filter((p) => !p.imageUrl).length;
  if (missingImages > 0) issues.push(`${missingImages} product(s) missing image`);

  const lowStock = products.filter((p) => Number(p.stock || 0) <= 0).length;
  if (lowStock > 0) issues.push(`${lowStock} product(s) out of stock`);

  const suspicious = products.filter((p) => /fake|replica|copy|counterfeit/i.test(String(p.name || "") + " " + String(p.description || ""))).length;
  if (suspicious > 0) issues.push(`${suspicious} product(s) need counterfeit wording review`);

  let riskLevel = "LOW";
  if (issues.some((issue) => /counterfeit|fake|replica|copy|Missing phone|Missing email/i.test(issue))) riskLevel = "HIGH";
  else if (issues.length) riskLevel = "MEDIUM";

  return { riskLevel, issues };
}

app.get("/api/admin/sellers/persistent-verification", async (req, res) => {
  try {
    if (!requirePersistentSellerVerificationToken(req, res)) return;

    const status = String(req.query.status || "").trim();
    const q = String(req.query.q || "").trim();

    const where = { role: "seller" };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ];
    }

    const sellers = await prisma.user.findMany({
      where,
      orderBy: { id: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        sellerVerification: true,
        products: {
          orderBy: { id: "desc" },
          take: 20,
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            price: true,
            stock: true,
            imageUrl: true,
            createdAt: true,
          },
        },
      },
    });

    let prepared = sellers.map((seller) => {
      const products = seller.products || [];
      const risk = assessPersistentSellerRisk(seller, products);
      const verification = seller.sellerVerification || {
        status: "UNDER_REVIEW",
        riskLevel: risk.riskLevel,
        decision: null,
        notes: null,
        reviewedBy: null,
      };

      return {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        role: seller.role,
        productCount: products.length,
        products,
        riskLevel: verification.riskLevel || risk.riskLevel,
        issues: risk.issues,
        verification,
      };
    });

    if (status) {
      prepared = prepared.filter((seller) => String(seller.verification?.status || "UNDER_REVIEW") === status);
    }

    return res.json({
      message: "Persistent seller verification records loaded.",
      count: prepared.length,
      sellers: prepared,
    });
  } catch (error) {
    console.error("Persistent seller verification load error:", error);
    return res.status(500).json({
      message: "Could not load persistent seller verification records.",
      details: error.message,
    });
  }
});

app.post("/api/admin/sellers/:id/persistent-verification", async (req, res) => {
  try {
    if (!requirePersistentSellerVerificationToken(req, res)) return;

    const sellerId = Number(req.params.id);
    const status = String(req.body?.status || "UNDER_REVIEW").trim();
    const riskLevel = String(req.body?.riskLevel || "LOW").trim();
    const decision = String(req.body?.decision || "").trim();
    const notes = String(req.body?.notes || "").trim();
    const reviewedBy = String(req.body?.reviewedBy || "").trim();

    const allowedStatuses = new Set(["UNDER_REVIEW", "APPROVED", "MORE_INFO", "HOLD", "SUSPENDED", "REJECTED"]);
    const allowedRisk = new Set(["LOW", "MEDIUM", "HIGH"]);
    const allowedDecision = new Set(["APPROVE", "REQUEST_MORE_INFO", "HOLD", "SUSPEND", "REJECT", ""]);

    if (!sellerId || sellerId <= 0) return res.status(400).json({ message: "Valid seller ID is required." });
    if (!allowedStatuses.has(status)) return res.status(400).json({ message: "Invalid seller verification status." });
    if (!allowedRisk.has(riskLevel)) return res.status(400).json({ message: "Invalid risk level." });
    if (!allowedDecision.has(decision)) return res.status(400).json({ message: "Invalid seller decision." });

    const seller = await prisma.user.findFirst({
      where: { id: sellerId, role: "seller" },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    if (!seller) return res.status(404).json({ message: "Seller was not found." });

    const verification = await prisma.sellerVerification.upsert({
      where: { sellerId },
      update: {
        status,
        riskLevel,
        decision: decision || null,
        notes: notes || null,
        reviewedBy: reviewedBy || null,
      },
      create: {
        sellerId,
        status,
        riskLevel,
        decision: decision || null,
        notes: notes || null,
        reviewedBy: reviewedBy || null,
      },
    });

    return res.json({
      message: "Seller verification saved.",
      seller,
      verification,
    });
  } catch (error) {
    console.error("Persistent seller verification save error:", error);
    return res.status(500).json({
      message: "Could not save seller verification.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 28A: Customer Order Tracking API
// Public lookup protected by order ID + matching phone number.
// Does not change checkout or payment flow.
// ================================
function normalizeKenyanPhoneForTracking(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return "254" + digits.slice(1);
  if (digits.startsWith("7") && digits.length === 9) return "254" + digits;
  if (digits.startsWith("1") && digits.length === 9) return "254" + digits;
  return digits;
}

app.post("/api/orders/track", async (req, res) => {
  try {
    const orderId = Number(req.body?.orderId);
    const phone = normalizeKenyanPhoneForTracking(req.body?.phone);

    if (!orderId || orderId <= 0) {
      return res.status(400).json({ message: "A valid order ID is required." });
    }

    if (!phone) {
      return res.status(400).json({ message: "A valid checkout phone number is required." });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, category: true, imageUrl: true },
            },
          },
        },
        payment: true,
        tracking: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order was not found." });
    }

    const orderPhone = normalizeKenyanPhoneForTracking(order.phone);
    const paymentPhone = normalizeKenyanPhoneForTracking(order.payment?.phone);

    if (phone !== orderPhone && phone !== paymentPhone) {
      return res.status(403).json({ message: "The phone number does not match this order." });
    }

    return res.json({
      message: "Order tracking loaded.",
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        deliveryFee: order.deliveryFee,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
        mpesaReceipt: order.payment?.mpesaReceipt || null,
        checkoutRequestId: order.payment?.checkoutRequestId || null,
        items: order.items.map((item) => ({
          productId: item.productId,
          name: item.product?.name || `Product #${item.productId}`,
          category: item.product?.category || null,
          imageUrl: item.product?.imageUrl || null,
          quantity: item.quantity,
          price: item.price,
        })),
        tracking: order.tracking.map((event) => ({
          status: event.status,
          note: event.note,
          createdAt: event.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Customer order tracking error:", error);
    return res.status(500).json({
      message: "Could not load order tracking.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 28B: Customer Support Request API
// Public request protected by order ID + matching checkout/payment phone.
// Uses DeliveryTracking so no database migration is needed.
// ================================
function normalizeKenyanPhoneForSupport(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return "254" + digits.slice(1);
  if (digits.startsWith("7") && digits.length === 9) return "254" + digits;
  if (digits.startsWith("1") && digits.length === 9) return "254" + digits;
  return digits;
}

app.post("/api/orders/support-request", async (req, res) => {
  try {
    const orderId = Number(req.body?.orderId);
    const phone = normalizeKenyanPhoneForSupport(req.body?.phone);
    const requestType = String(req.body?.requestType || "GENERAL_SUPPORT").trim();
    const customerName = String(req.body?.customerName || "").trim();
    const message = String(req.body?.message || "").trim();

    const allowedTypes = new Set([
      "GENERAL_SUPPORT",
      "DELIVERY_ISSUE",
      "PAYMENT_ISSUE",
      "PRODUCT_ISSUE",
      "CANCELLATION_REQUEST",
      "REFUND_REQUEST",
    ]);

    if (!orderId || orderId <= 0) {
      return res.status(400).json({ message: "A valid order ID is required." });
    }

    if (!phone) {
      return res.status(400).json({ message: "A valid checkout phone number is required." });
    }

    if (!allowedTypes.has(requestType)) {
      return res.status(400).json({ message: "Invalid support request type." });
    }

    if (!message || message.length < 8) {
      return res.status(400).json({ message: "Please enter a clear support message." });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order was not found." });
    }

    const orderPhone = normalizeKenyanPhoneForSupport(order.phone);
    const paymentPhone = normalizeKenyanPhoneForSupport(order.payment?.phone);

    if (phone !== orderPhone && phone !== paymentPhone) {
      return res.status(403).json({ message: "The phone number does not match this order." });
    }

    let nextOrderStatus = order.orderStatus;
    if (requestType === "REFUND_REQUEST") nextOrderStatus = "REFUND_REQUESTED";
    if (requestType === "CANCELLATION_REQUEST" && order.orderStatus !== "DELIVERED") nextOrderStatus = "CANCELLED";

    if (nextOrderStatus !== order.orderStatus) {
      await prisma.order.update({
        where: { id: order.id },
        data: { orderStatus: nextOrderStatus },
      });
    }

    const noteParts = [
      `Customer support request: ${requestType}`,
      customerName ? `Customer name: ${customerName}` : null,
      `Message: ${message}`,
    ].filter(Boolean);

    await prisma.deliveryTracking.create({
      data: {
        orderId: order.id,
        status: requestType === "REFUND_REQUEST" ? "REFUND_REQUESTED" : "CUSTOMER_SUPPORT_REQUESTED",
        note: noteParts.join(" | "),
      },
    });

    return res.json({
      message: "Support request received.",
      orderId: order.id,
      orderStatus: nextOrderStatus,
      requestType,
    });
  } catch (error) {
    console.error("Customer support request error:", error);
    return res.status(500).json({
      message: "Could not submit support request.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 28C: Admin Support Queue API
// Protected by ADMIN_ORDER_TOKEN. Uses existing DeliveryTracking model.
// ================================
function requireAdminSupportQueueToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

app.get("/api/admin/support-queue", async (req, res) => {
  try {
    if (!requireAdminSupportQueueToken(req, res)) return;

    const filter = String(req.query.filter || "").trim();
    const q = String(req.query.q || "").trim();

    const supportStatuses = [
      "CUSTOMER_SUPPORT_REQUESTED",
      "REFUND_REQUESTED",
      "SUPPORT_CONTACTED_CUSTOMER",
      "SUPPORT_CONTACTED_SELLER",
      "SUPPORT_RESOLVED",
      "REFUND_UNDER_REVIEW",
      "ORDER_CANCELLED_BY_SUPPORT",
    ];

    const where = filter
      ? { status: filter }
      : { status: { in: supportStatuses } };

    if (q) {
      const numericId = Number(q);
      where.OR = [
        ...(Number.isFinite(numericId) && numericId > 0 ? [{ orderId: numericId }] : []),
        { note: { contains: q, mode: "insensitive" } },
        { order: { phone: { contains: q, mode: "insensitive" } } },
        { order: { deliveryAddress: { contains: q, mode: "insensitive" } } },
        { order: { user: { email: { contains: q, mode: "insensitive" } } } },
      ];
    }

    const requests = await prisma.deliveryTracking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true, role: true } },
            payment: true,
            items: {
              include: {
                product: { select: { id: true, name: true, category: true, price: true, imageUrl: true } },
              },
            },
          },
        },
      },
    });

    return res.json({
      message: "Admin support queue loaded.",
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Admin support queue load error:", error);
    return res.status(500).json({
      message: "Could not load support queue.",
      details: error.message,
    });
  }
});

app.post("/api/admin/support-queue/:trackingId/action", async (req, res) => {
  try {
    if (!requireAdminSupportQueueToken(req, res)) return;

    const trackingId = Number(req.params.trackingId);
    const action = String(req.body?.action || "").trim();
    const note = String(req.body?.note || "").trim();

    const allowedActions = new Set([
      "CONTACT_CUSTOMER",
      "CONTACT_SELLER",
      "MARK_RESOLVED",
      "KEEP_REFUND_REVIEW",
      "MARK_REFUND_REQUESTED",
      "CANCEL_ORDER",
    ]);

    if (!trackingId || trackingId <= 0) {
      return res.status(400).json({ message: "Valid support tracking ID is required." });
    }

    if (!allowedActions.has(action)) {
      return res.status(400).json({ message: "Invalid support action." });
    }

    if (!note || note.length < 5) {
      return res.status(400).json({ message: "Admin response note is required." });
    }

    const current = await prisma.deliveryTracking.findUnique({
      where: { id: trackingId },
      include: { order: true },
    });

    if (!current) {
      return res.status(404).json({ message: "Support entry was not found." });
    }

    let trackingStatus = "CUSTOMER_SUPPORT_REQUESTED";
    let orderStatusUpdate = null;

    if (action === "CONTACT_CUSTOMER") trackingStatus = "SUPPORT_CONTACTED_CUSTOMER";
    if (action === "CONTACT_SELLER") trackingStatus = "SUPPORT_CONTACTED_SELLER";
    if (action === "MARK_RESOLVED") trackingStatus = "SUPPORT_RESOLVED";
    if (action === "KEEP_REFUND_REVIEW") trackingStatus = "REFUND_UNDER_REVIEW";
    if (action === "MARK_REFUND_REQUESTED") {
      trackingStatus = "REFUND_REQUESTED";
      orderStatusUpdate = "REFUND_REQUESTED";
    }
    if (action === "CANCEL_ORDER") {
      trackingStatus = "ORDER_CANCELLED_BY_SUPPORT";
      orderStatusUpdate = "CANCELLED";
    }

    if (orderStatusUpdate) {
      await prisma.order.update({
        where: { id: current.orderId },
        data: { orderStatus: orderStatusUpdate },
      });
    }

    const created = await prisma.deliveryTracking.create({
      data: {
        orderId: current.orderId,
        status: trackingStatus,
        note: `Admin action: ${action} | ${note}`,
      },
    });

    return res.json({
      message: "Support action saved.",
      action,
      tracking: created,
      orderStatus: orderStatusUpdate || current.order.orderStatus,
    });
  } catch (error) {
    console.error("Admin support action error:", error);
    return res.status(500).json({
      message: "Could not save support action.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 29A: Admin System Health API
// Protected by ADMIN_ORDER_TOKEN. Does not expose secret values.
// ================================
function requireAdminSystemHealthToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

app.get("/api/admin/system-health", async (req, res) => {
  try {
    if (!requireAdminSystemHealthToken(req, res)) return;

    const warnings = [];
    let databaseConnected = true;

    let users = 0;
    let sellers = 0;
    let products = 0;
    let orders = 0;
    let payments = 0;
    let supportNotes = 0;
    let recentOrders = [];

    try {
      users = await prisma.user.count();
      sellers = await prisma.user.count({ where: { role: "seller" } });
      products = await prisma.product.count();
      orders = await prisma.order.count();
      payments = await prisma.payment.count();
      supportNotes = await prisma.deliveryTracking.count({
        where: {
          status: {
            in: [
              "CUSTOMER_SUPPORT_REQUESTED",
              "REFUND_REQUESTED",
              "SUPPORT_CONTACTED_CUSTOMER",
              "SUPPORT_CONTACTED_SELLER",
              "SUPPORT_RESOLVED",
              "REFUND_UNDER_REVIEW",
              "ORDER_CANCELLED_BY_SUPPORT",
            ],
          },
        },
      });

      recentOrders = await prisma.order.findMany({
        orderBy: { id: "desc" },
        take: 10,
        select: {
          id: true,
          totalAmount: true,
          paymentStatus: true,
          orderStatus: true,
          createdAt: true,
        },
      });
    } catch (error) {
      databaseConnected = false;
      warnings.push("Database query failed: " + error.message);
    }

    if (!process.env.PUBLIC_SITE_URL) warnings.push("PUBLIC_SITE_URL is not set.");
    if (!process.env.SUPPORT_EMAIL) warnings.push("SUPPORT_EMAIL is not set.");
    if (!process.env.BUSINESS_NAME) warnings.push("BUSINESS_NAME is not set.");
    if (process.env.ADMIN_REGISTRATION_ENABLED === "true") warnings.push("ADMIN_REGISTRATION_ENABLED is true. Public admin registration should be locked.");
    if (process.env.MPESA_ENV === "sandbox") warnings.push("M-PESA is still in sandbox mode. This is safe for testing but not for real customer payments.");
    if (!process.env.MPESA_CALLBACK_URL) warnings.push("MPESA_CALLBACK_URL is not set.");
    if (process.env.UPLOAD_MODE && process.env.UPLOAD_MODE !== "cloudinary") warnings.push("UPLOAD_MODE is not cloudinary.");

    return res.json({
      message: "System health loaded.",
      generatedAt: new Date().toISOString(),
      config: {
        databaseConnected,
        publicSiteUrl: process.env.PUBLIC_SITE_URL || null,
        supportEmail: process.env.SUPPORT_EMAIL || null,
        businessName: process.env.BUSINESS_NAME || null,
        mpesaMode: process.env.MPESA_MODE || null,
        mpesaEnv: process.env.MPESA_ENV || null,
        uploadMode: process.env.UPLOAD_MODE || null,
        adminRegistrationEnabled: process.env.ADMIN_REGISTRATION_ENABLED || null,
      },
      metrics: {
        users,
        sellers,
        products,
        orders,
        payments,
        supportNotes,
      },
      recentOrders,
      warnings,
    });
  } catch (error) {
    console.error("System health error:", error);
    return res.status(500).json({
      message: "Could not load system health.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 29B: Admin Backup Export API
// Protected by ADMIN_ORDER_TOKEN. Exports operational data without exposing secrets.
// ================================
function requireAdminBackupToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

function stage29bFlatten(value) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function stage29bCsv(rows) {
  if (!rows.length) return "message\nNo records found\n";
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const text = stage29bFlatten(value);
    if (/[",\n\r]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
    return text;
  };
  return headers.join(",") + "\n" + rows.map((row) => headers.map((h) => escape(row[h])).join(",")).join("\n");
}

function stage29bSendExport(req, res, type, rows) {
  const format = String(req.query.format || "csv").toLowerCase() === "json" ? "json" : "csv";
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `sokoyetu-${type}-export-${stamp}.${format}`;

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  if (format === "json") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(JSON.stringify(rows, null, 2));
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  return res.send(stage29bCsv(rows));
}

app.get("/api/admin/export/:type", async (req, res) => {
  try {
    if (!requireAdminBackupToken(req, res)) return;

    const type = String(req.params.type || "").toLowerCase();
    let rows = [];

    if (type === "products") {
      const products = await prisma.product.findMany({
        orderBy: { id: "desc" },
        take: 5000,
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          price: true,
          oldPrice: true,
          stock: true,
          imageUrl: true,
          sellerId: true,
          createdAt: true,
        },
      });

      rows = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        oldPrice: p.oldPrice,
        stock: p.stock,
        sellerId: p.sellerId,
        hasImage: Boolean(p.imageUrl),
        imageUrl: p.imageUrl,
        createdAt: p.createdAt,
        description: p.description,
      }));
    } else if (type === "orders") {
      const orders = await prisma.order.findMany({
        orderBy: { id: "desc" },
        take: 5000,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          payment: true,
          items: true,
        },
      });

      rows = orders.map((o) => ({
        id: o.id,
        userId: o.userId,
        customerName: o.user?.name,
        customerEmail: o.user?.email,
        customerPhone: o.phone || o.user?.phone || o.payment?.phone,
        totalAmount: o.totalAmount,
        deliveryFee: o.deliveryFee,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        deliveryAddress: o.deliveryAddress,
        itemCount: o.items?.length || 0,
        checkoutRequestId: o.payment?.checkoutRequestId,
        mpesaReceipt: o.payment?.mpesaReceipt,
        createdAt: o.createdAt,
      }));
    } else if (type === "payments") {
      const payments = await prisma.payment.findMany({
        orderBy: { id: "desc" },
        take: 5000,
        include: { order: { select: { id: true, orderStatus: true, paymentStatus: true, totalAmount: true } } },
      });

      rows = payments.map((p) => ({
        id: p.id,
        orderId: p.orderId,
        provider: p.provider,
        phone: p.phone,
        amount: p.amount,
        status: p.status,
        checkoutRequestId: p.checkoutRequestId,
        mpesaReceipt: p.mpesaReceipt,
        orderStatus: p.order?.orderStatus,
        orderPaymentStatus: p.order?.paymentStatus,
        createdAt: p.createdAt,
      }));
    } else if (type === "sellers") {
      const sellers = await prisma.user.findMany({
        where: { role: "seller" },
        orderBy: { id: "desc" },
        take: 5000,
        include: { products: { select: { id: true, name: true, stock: true, price: true } } },
      });

      rows = sellers.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        role: s.role,
        productCount: s.products?.length || 0,
        totalStock: (s.products || []).reduce((sum, p) => sum + Number(p.stock || 0), 0),
        createdAt: s.createdAt,
      }));
    } else if (type === "support") {
      const supportNotes = await prisma.deliveryTracking.findMany({
        orderBy: { id: "desc" },
        take: 5000,
        include: {
          order: {
            select: {
              id: true,
              phone: true,
              orderStatus: true,
              paymentStatus: true,
              totalAmount: true,
              user: { select: { email: true, name: true } },
            },
          },
        },
      });

      rows = supportNotes.map((t) => ({
        id: t.id,
        orderId: t.orderId,
        status: t.status,
        note: t.note,
        orderStatus: t.order?.orderStatus,
        paymentStatus: t.order?.paymentStatus,
        orderPhone: t.order?.phone,
        customerEmail: t.order?.user?.email,
        createdAt: t.createdAt,
      }));
    } else if (type === "users") {
      const users = await prisma.user.findMany({
        orderBy: { id: "desc" },
        take: 5000,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      rows = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt,
      }));
    } else {
      return res.status(400).json({
        message: "Invalid export type. Use products, orders, payments, sellers, support, or users.",
      });
    }

    return stage29bSendExport(req, res, type, rows);
  } catch (error) {
    console.error("Admin export error:", error);
    return res.status(500).json({
      message: "Could not export data.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 30A: Soft Launch Readiness API
// Protected by ADMIN_ORDER_TOKEN. Final go/no-go operational view.
// ================================
function requireSoftLaunchToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

app.get("/api/admin/launch-readiness", async (req, res) => {
  try {
    if (!requireSoftLaunchToken(req, res)) return;

    const blockers = [];
    const warnings = [];

    let users = 0;
    let sellers = 0;
    let products = 0;
    let orders = 0;
    let payments = 0;
    let supportNotes = 0;
    let recentOrders = [];

    try {
      users = await prisma.user.count();
      sellers = await prisma.user.count({ where: { role: "seller" } });
      products = await prisma.product.count();
      orders = await prisma.order.count();
      payments = await prisma.payment.count();
      supportNotes = await prisma.deliveryTracking.count();
      recentOrders = await prisma.order.findMany({
        orderBy: { id: "desc" },
        take: 10,
        select: {
          id: true,
          totalAmount: true,
          paymentStatus: true,
          orderStatus: true,
          createdAt: true,
        },
      });
    } catch (error) {
      blockers.push("Database health check failed: " + error.message);
    }

    if (!process.env.PUBLIC_SITE_URL) blockers.push("PUBLIC_SITE_URL is not set.");
    if (!process.env.DATABASE_URL) blockers.push("DATABASE_URL is not set.");
    if (!process.env.JWT_SECRET) blockers.push("JWT_SECRET is not set.");
    if (!process.env.ADMIN_ORDER_TOKEN) blockers.push("ADMIN_ORDER_TOKEN is not set.");
    if (!process.env.SUPPORT_EMAIL) warnings.push("SUPPORT_EMAIL is not set.");
    if (!process.env.BUSINESS_NAME) warnings.push("BUSINESS_NAME is not set.");
    if (!process.env.MPESA_CALLBACK_URL) blockers.push("MPESA_CALLBACK_URL is not set.");
    if (process.env.ADMIN_REGISTRATION_ENABLED === "true") blockers.push("ADMIN_REGISTRATION_ENABLED is true. Public admin registration should be locked.");
    if (process.env.MPESA_ENV === "sandbox") warnings.push("M-PESA is still in sandbox mode. Continue only with controlled testing until production Daraja credentials are issued.");
    if (process.env.UPLOAD_MODE !== "cloudinary") warnings.push("UPLOAD_MODE is not cloudinary. Confirm product image storage before wider launch.");
    if (products === 0) warnings.push("No products found. Add launch products before inviting buyers.");
    if (sellers === 0) warnings.push("No seller accounts found. Add or verify sellers before marketplace launch.");

    const base = process.env.PUBLIC_SITE_URL || "https://www.mysokoyetu.co.ke";
    const links = [
      { label: "Public site", url: base },
      { label: "Checkout", url: base + "/checkout.html" },
      { label: "Track order", url: base + "/track-order.html" },
      { label: "Support request", url: base + "/support-request.html" },
      { label: "Admin orders", url: base + "/admin-orders.html" },
      { label: "Admin support", url: base + "/admin-support.html" },
      { label: "Admin backup", url: base + "/admin-backup.html" },
      { label: "System health", url: base + "/admin-system-health.html" },
    ];

    return res.json({
      message: "Launch readiness loaded.",
      generatedAt: new Date().toISOString(),
      readiness: blockers.length ? "NOT_READY" : "CONTROLLED_SOFT_LAUNCH_READY",
      config: {
        publicSiteUrl: process.env.PUBLIC_SITE_URL || null,
        supportEmail: process.env.SUPPORT_EMAIL || null,
        businessName: process.env.BUSINESS_NAME || null,
        mpesaMode: process.env.MPESA_MODE || null,
        mpesaEnv: process.env.MPESA_ENV || null,
        uploadMode: process.env.UPLOAD_MODE || null,
        adminRegistrationEnabled: process.env.ADMIN_REGISTRATION_ENABLED || null,
      },
      metrics: {
        users,
        sellers,
        products,
        orders,
        payments,
        supportNotes,
      },
      recentOrders,
      links,
      blockers,
      warnings,
    });
  } catch (error) {
    console.error("Launch readiness error:", error);
    return res.status(500).json({
      message: "Could not load launch readiness.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 31A: Product Catalogue Audit API
// Protected by ADMIN_ORDER_TOKEN. Read-only catalogue quality review.
// ================================
function requireCatalogAuditToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

function auditProductQuality(product) {
  const issues = [];
  let score = 0;

  const name = String(product.name || "").trim();
  const description = String(product.description || "").trim();
  const category = String(product.category || "").trim();
  const price = Number(product.price || 0);
  const stock = Number(product.stock || 0);
  const combined = (name + " " + description).toLowerCase();

  if (!name || name.length < 3) {
    issues.push("Missing or very short product name");
    score += 20;
  }

  if (!description || description.length < 30) {
    issues.push("Weak or missing description");
    score += 20;
  }

  if (!category) {
    issues.push("Missing category");
    score += 15;
  }

  if (!product.imageUrl) {
    issues.push("Missing product image");
    score += 25;
  }

  if (!price || price <= 0) {
    issues.push("Missing or invalid price");
    score += 25;
  }

  if (stock <= 0) {
    issues.push("Out of stock");
    score += 15;
  }

  if (/fake|replica|copy|counterfeit/i.test(combined)) {
    issues.push("Suspicious/counterfeit wording");
    score += 50;
  }

  if (/test|demo|placeholder/i.test(combined)) {
    issues.push("Demo/test/placeholder wording");
    score += 30;
  }

  if (description.length > 0 && description.length < 80) {
    issues.push("Description could be more detailed");
    score += 10;
  }

  return {
    issues,
    qualityScore: Math.min(score, 100),
  };
}

app.get("/api/admin/catalog-audit", async (req, res) => {
  try {
    if (!requireCatalogAuditToken(req, res)) return;

    const filter = String(req.query.filter || "").trim();
    const q = String(req.query.q || "").trim();

    const where = {};

    if (q) {
      const numeric = Number(q);
      where.OR = [
        ...(Number.isFinite(numeric) && numeric > 0 ? [{ id: numeric }, { sellerId: numeric }] : []),
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { id: "desc" },
      take: 500,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        oldPrice: true,
        stock: true,
        imageUrl: true,
        sellerId: true,
        createdAt: true,
      },
    });

    let audited = products.map((product) => {
      const audit = auditProductQuality(product);
      return {
        ...product,
        issues: audit.issues,
        qualityScore: audit.qualityScore,
      };
    });

    if (filter === "issues") audited = audited.filter((p) => p.issues.length > 0);
    if (filter === "missing-image") audited = audited.filter((p) => !p.imageUrl);
    if (filter === "weak-description") audited = audited.filter((p) => !p.description || String(p.description).trim().length < 30);
    if (filter === "out-of-stock") audited = audited.filter((p) => Number(p.stock || 0) <= 0);
    if (filter === "missing-category") audited = audited.filter((p) => !p.category);
    if (filter === "suspicious") audited = audited.filter((p) => /fake|replica|copy|counterfeit|test|demo|placeholder/i.test(String(p.name || "") + " " + String(p.description || "")));

    const summary = {
      totalLoaded: audited.length,
      withIssues: audited.filter((p) => p.issues.length > 0).length,
      missingImages: audited.filter((p) => !p.imageUrl).length,
      weakDescriptions: audited.filter((p) => !p.description || String(p.description).trim().length < 30).length,
      outOfStock: audited.filter((p) => Number(p.stock || 0) <= 0).length,
      suspicious: audited.filter((p) => /fake|replica|copy|counterfeit|test|demo|placeholder/i.test(String(p.name || "") + " " + String(p.description || ""))).length,
    };

    return res.json({
      message: "Catalogue audit loaded.",
      count: audited.length,
      summary,
      products: audited,
    });
  } catch (error) {
    console.error("Catalogue audit error:", error);
    return res.status(500).json({
      message: "Could not load catalogue audit.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 31B: Admin Product Editor API
// Protected by ADMIN_ORDER_TOKEN. Updates only existing Product fields.
// ================================
function requireProductEditorToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

app.get("/api/admin/products/manage", async (req, res) => {
  try {
    if (!requireProductEditorToken(req, res)) return;

    const q = String(req.query.q || "").trim();
    const filter = String(req.query.filter || "").trim();

    const where = {};

    if (q) {
      const numeric = Number(q);
      where.OR = [
        ...(Number.isFinite(numeric) && numeric > 0 ? [{ id: numeric }, { sellerId: numeric }] : []),
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }

    if (filter === "missing-image") {
      where.OR = [...(where.OR || []), { imageUrl: null }, { imageUrl: "" }];
    }

    if (filter === "out-of-stock") {
      where.stock = { lte: 0 };
    }

    if (filter === "weak-description") {
      where.OR = [
        ...(where.OR || []),
        { description: null },
        { description: "" },
      ];
    }

    if (filter === "missing-category") {
      where.OR = [
        ...(where.OR || []),
        { category: null },
        { category: "" },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { id: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        oldPrice: true,
        stock: true,
        imageUrl: true,
        sellerId: true,
        createdAt: true,
      },
    });

    return res.json({
      message: "Products loaded for editing.",
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Admin product manage load error:", error);
    return res.status(500).json({
      message: "Could not load products for editing.",
      details: error.message,
    });
  }
});

app.post("/api/admin/products/:id/update", async (req, res) => {
  try {
    if (!requireProductEditorToken(req, res)) return;

    const id = Number(req.params.id);
    const name = String(req.body?.name || "").trim();
    const description = String(req.body?.description || "").trim();
    const category = String(req.body?.category || "").trim();
    const imageUrl = String(req.body?.imageUrl || "").trim();
    const price = Number(req.body?.price);
    const oldPrice = Number(req.body?.oldPrice || 0);
    const stock = Number(req.body?.stock || 0);

    if (!id || id <= 0) return res.status(400).json({ message: "Valid product ID is required." });
    if (!name || name.length < 3) return res.status(400).json({ message: "Product name must be at least 3 characters." });
    if (!Number.isFinite(price) || price <= 0) return res.status(400).json({ message: "Product price must be greater than 0." });
    if (!Number.isFinite(oldPrice) || oldPrice < 0) return res.status(400).json({ message: "Old price cannot be negative." });
    if (!Number.isFinite(stock) || stock < 0) return res.status(400).json({ message: "Stock cannot be negative." });

    if (/fake|replica|copy|counterfeit/i.test(name + " " + description)) {
      return res.status(400).json({
        message: "Product contains suspicious counterfeit wording. Remove or review this wording before saving.",
      });
    }

    if (imageUrl && !new RegExp("https?://", "i").test(imageUrl)) {
      return res.status(400).json({ message: "Image URL must start with http:// or https://." });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        category: category || null,
        price: Math.round(price),
        oldPrice: Math.round(oldPrice),
        stock: Math.round(stock),
        imageUrl: imageUrl || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        oldPrice: true,
        stock: true,
        imageUrl: true,
        sellerId: true,
        createdAt: true,
      },
    });

    return res.json({
      message: "Product updated.",
      product,
    });
  } catch (error) {
    console.error("Admin product update error:", error);
    return res.status(500).json({
      message: "Could not update product.",
      details: error.message,
    });
  }
});



// ================================


// ================================
// SokoYetu Stage 35A: Core Production Readiness Audit API
// Read-only hard audit. Core readiness audit does not change orders, products, payments or schema.
// ================================
// SokoYetu Stage 33A: Production M-PESA Readiness API
// Read-only. Does not switch M-PESA environment or alter checkout logic.
// ================================
function requireMpesaReadinessToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

function readFirstEnv(keys) {
  for (const key of keys) {
    if (process.env[key]) return { key, value: process.env[key] };
  }
  return { key: keys[0], value: "" };
}

function redactMpesaValue(value) {
  const text = String(value || "");
  if (!text) return "";
  if (text.length <= 8) return text.slice(0, 2) + "...hidden";
  return text.slice(0, 4) + "...hidden..." + text.slice(-3);
}

app.get("/api/admin/mpesa-production-readiness", async (req, res) => {
  try {
    if (!requireMpesaReadinessToken(req, res)) return;

    const blockers = [];
    const warnings = [];

    const envMap = {
      mpesaEnv: readFirstEnv(["MPESA_ENV"]),
      mpesaMode: readFirstEnv(["MPESA_MODE"]),
      consumerKey: readFirstEnv(["MPESA_CONSUMER_KEY", "MPESA_DARAJA_CONSUMER_KEY"]),
      consumerSecret: readFirstEnv(["MPESA_CONSUMER_SECRET", "MPESA_DARAJA_CONSUMER_SECRET"]),
      shortcode: readFirstEnv(["MPESA_SHORTCODE", "MPESA_BUSINESS_SHORTCODE", "MPESA_PAYBILL", "MPESA_TILL"]),
      passkey: readFirstEnv(["MPESA_PASSKEY", "MPESA_LIPA_NA_MPESA_PASSKEY"]),
      callbackUrl: readFirstEnv(["MPESA_CALLBACK_URL"]),
    };

    const checks = [
      {
        label: "M-PESA environment",
        ok: Boolean(envMap.mpesaEnv.value),
        value: envMap.mpesaEnv.value || "",
        note: "Expected sandbox/test until production Daraja credentials are approved.",
      },
      {
        label: "M-PESA mode",
        ok: Boolean(envMap.mpesaMode.value),
        value: envMap.mpesaMode.value || "",
        note: "Check whether your code expects sandbox/live/production naming.",
      },
      {
        label: "Consumer key",
        ok: Boolean(envMap.consumerKey.value),
        value: envMap.consumerKey.value ? redactMpesaValue(envMap.consumerKey.value) : "",
        note: "Must be the production consumer key before live switch.",
      },
      {
        label: "Consumer secret",
        ok: Boolean(envMap.consumerSecret.value),
        value: envMap.consumerSecret.value ? redactMpesaValue(envMap.consumerSecret.value) : "",
        note: "Must be the production consumer secret before live switch.",
      },
      {
        label: "Business shortcode / PayBill / Till",
        ok: Boolean(envMap.shortcode.value),
        value: envMap.shortcode.value || "",
        note: "Must be the live business shortcode connected to the business account.",
      },
      {
        label: "Lipa na M-PESA passkey",
        ok: Boolean(envMap.passkey.value),
        value: envMap.passkey.value ? redactMpesaValue(envMap.passkey.value) : "",
        note: "Must match the live shortcode.",
      },
      {
        label: "Callback URL",
        ok: Boolean(envMap.callbackUrl.value),
        value: envMap.callbackUrl.value || "",
        note: "Should be HTTPS and should point to the Render production domain.",
      },
    ];

    for (const check of checks) {
      if (!check.ok) blockers.push(check.label + " is missing.");
    }

    const mpesaEnv = String(envMap.mpesaEnv.value || "").toLowerCase();
    const mpesaMode = String(envMap.mpesaMode.value || "").toLowerCase();
    const callbackUrl = String(envMap.callbackUrl.value || "");

    if (mpesaEnv && mpesaEnv !== "production" && mpesaEnv !== "live") {
      warnings.push("M-PESA environment is not production/live. This is expected until Safaricom production credentials are issued.");
    }

    if (mpesaMode && mpesaMode !== "production" && mpesaMode !== "live") {
      warnings.push("M-PESA mode is not production/live. Keep this until ready to switch.");
    }

    if (callbackUrl && !/^https:\/\//i.test(callbackUrl)) {
      blockers.push("Callback URL must use HTTPS for production.");
    }

    if (callbackUrl && !/mysokoyetu\.co\.ke/i.test(callbackUrl)) {
      warnings.push("Callback URL does not appear to use mysokoyetu.co.ke. Confirm it points to the Render production domain.");
    }

    if (process.env.ADMIN_REGISTRATION_ENABLED === "true") {
      blockers.push("ADMIN_REGISTRATION_ENABLED is true. Lock admin registration before real payments.");
    }

    let recentPayments = [];
    try {
      recentPayments = await prisma.payment.findMany({
        orderBy: { id: "desc" },
        take: 10,
        select: {
          id: true,
          orderId: true,
          amount: true,
          status: true,
          mpesaReceipt: true,
          checkoutRequestId: true,
          createdAt: true,
        },
      });
    } catch (error) {
      warnings.push("Could not load recent payment records: " + error.message);
    }

    return res.json({
      message: "Production M-PESA readiness loaded.",
      generatedAt: new Date().toISOString(),
      readiness: blockers.length ? "NOT_READY" : "MANUAL_APPROVAL_REQUIRED",
      environment: {
        mpesaEnv: envMap.mpesaEnv.value || null,
        mpesaMode: envMap.mpesaMode.value || null,
        callbackUrl: envMap.callbackUrl.value || null,
      },
      checks,
      blockers,
      warnings,
      recentPayments,
      switchPlan: [
        "Do not switch until Safaricom production Daraja app approval is confirmed.",
        "Add production credentials only in Render environment variables.",
        "Confirm production callback URL uses HTTPS and your live domain.",
        "Deploy and run one very small real payment test.",
        "Confirm order, payment status and M-PESA receipt in admin orders.",
        "Monitor Render logs and support queue for callback issues.",
      ],
    });
  } catch (error) {
    console.error("M-PESA readiness error:", error);
    return res.status(500).json({
      message: "Could not load M-PESA production readiness.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 33B: M-PESA Environment Mapping and Guard API
// Read-only. M-PESA production guard only; does not alter payment logic.
// ================================
function requireMpesaEnvGuardToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

function stage33bRedact(value) {
  const text = String(value || "");
  if (!text) return "";
  if (text.length <= 8) return text.slice(0, 2) + "...hidden";
  return text.slice(0, 4) + "...hidden..." + text.slice(-3);
}

function stage33bUnique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function stage33bFindEnvKeys(text) {
  const keys = [];
  const dotPattern = /process\.env\.([A-Z0-9_]+)/g;
  const bracketPattern = /process\.env\[["']([A-Z0-9_]+)["']\]/g;
  let match;

  while ((match = dotPattern.exec(text))) keys.push(match[1]);
  while ((match = bracketPattern.exec(text))) keys.push(match[1]);

  return stage33bUnique(keys);
}

function stage33bConfiguredKeys(keys) {
  return keys.filter((key) => Object.prototype.hasOwnProperty.call(process.env, key));
}

app.get("/api/admin/mpesa-env-guard", async (req, res) => {
  try {
    if (!requireMpesaEnvGuardToken(req, res)) return;

    const fs = require("fs");
    const pathModule = require("path");
    const serverText = fs.readFileSync(pathModule.join(__dirname, "server.js"), "utf8");

    const allKeys = stage33bFindEnvKeys(serverText);
    const mpesaKeys = allKeys.filter((key) => key.includes("MPESA") || key.includes("DARAJA") || key.includes("SAFARICOM"));

    const groups = [
      {
        group: "environment",
        keys: ["MPESA_ENV", "MPESA_MODE", "MPESA_BASE_URL"],
      },
      {
        group: "consumer key",
        keys: ["MPESA_CONSUMER_KEY", "MPESA_DARAJA_CONSUMER_KEY", "DARAJA_CONSUMER_KEY", "SAFARICOM_CONSUMER_KEY"],
      },
      {
        group: "consumer secret",
        keys: ["MPESA_CONSUMER_SECRET", "MPESA_DARAJA_CONSUMER_SECRET", "DARAJA_CONSUMER_SECRET", "SAFARICOM_CONSUMER_SECRET"],
      },
      {
        group: "business shortcode / PayBill / Till",
        keys: ["MPESA_SHORTCODE", "MPESA_BUSINESS_SHORTCODE", "MPESA_PAYBILL", "MPESA_TILL", "BUSINESS_SHORTCODE"],
      },
      {
        group: "passkey",
        keys: ["MPESA_PASSKEY", "MPESA_LIPA_NA_MPESA_PASSKEY", "LIPA_NA_MPESA_PASSKEY"],
      },
      {
        group: "callback URL",
        keys: ["MPESA_CALLBACK_URL", "MPESA_STK_CALLBACK_URL", "CALLBACK_URL"],
      },
      {
        group: "production confirmation guard",
        keys: ["MPESA_PRODUCTION_CONFIRMED", "MPESA_LIVE_CONFIRMED"],
      },
    ].map((item) => {
      const referencedKeys = item.keys.filter((key) => mpesaKeys.includes(key));
      const configuredKeys = stage33bConfiguredKeys(item.keys);
      const required = item.group !== "production confirmation guard";
      return {
        group: item.group,
        referencedKeys,
        configuredKeys,
        ok: required ? configuredKeys.length > 0 : true,
      };
    });

    const blockers = [];
    const warnings = [];

    const mpesaEnv = String(process.env.MPESA_ENV || "").toLowerCase();
    const mpesaMode = String(process.env.MPESA_MODE || "").toLowerCase();
    const productionRequested = ["production", "live"].includes(mpesaEnv) || ["production", "live"].includes(mpesaMode);
    const productionConfirmed = String(process.env.MPESA_PRODUCTION_CONFIRMED || process.env.MPESA_LIVE_CONFIRMED || "").toLowerCase() === "true";

    if (productionRequested && !productionConfirmed) {
      blockers.push("M-PESA production/live appears requested, but MPESA_PRODUCTION_CONFIRMED=true is not set.");
    }

    const missingRequired = groups.filter((g) => g.group !== "production confirmation guard" && !g.ok);
    for (const group of missingRequired) {
      warnings.push("No configured environment variable found for " + group.group + ".");
    }

    const callback = process.env.MPESA_CALLBACK_URL || process.env.MPESA_STK_CALLBACK_URL || process.env.CALLBACK_URL || "";
    if (callback && !/^https:\/\//i.test(callback)) {
      blockers.push("Production callback URL must use HTTPS.");
    }

    if (callback && !/mysokoyetu\.co\.ke/i.test(callback)) {
      warnings.push("Callback URL does not appear to use mysokoyetu.co.ke. Confirm it points to the Render production domain.");
    }

    const referencedMpesaKeys = mpesaKeys.map((key) => {
      const value = process.env[key];
      return {
        key,
        configured: Boolean(value),
        value: value ? stage33bRedact(value) : "",
      };
    });

    return res.json({
      message: "M-PESA environment guard loaded.",
      guardStatus: blockers.length ? "BLOCKED" : "PASSIVE_GUARD_OK",
      productionRequested,
      productionConfirmed,
      referencedMpesaKeys,
      groups,
      blockers,
      warnings,
      note: "M-PESA production guard is read-only and does not switch payment mode.",
    });
  } catch (error) {
    console.error("M-PESA production guard error:", error);
    return res.status(500).json({
      message: "Could not load M-PESA environment guard.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 33C: M-PESA Payment Reconciliation API
// Read-only payment/order evidence review. Does not change payment logic.
// ================================
function requireMpesaReconciliationToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

function stage33cStatusCategory(value) {
  const text = String(value || "").toLowerCase();

  if (text.includes("paid") || text.includes("success") || text.includes("complete") || text.includes("confirmed")) {
    return "paid";
  }

  if (text.includes("fail") || text.includes("cancel") || text.includes("error") || text.includes("decline")) {
    return "failed";
  }

  return "pending";
}

function stage33cFlagRecord(payment, order) {
  const flags = [];
  const paymentAmount = Number(payment?.amount || 0);
  const orderAmount = Number(order?.totalAmount || 0);
  const paymentStatus = String(payment?.status || "");
  const orderPaymentStatus = String(order?.paymentStatus || "");
  const paymentCategory = stage33cStatusCategory(paymentStatus);
  const orderPaymentCategory = stage33cStatusCategory(orderPaymentStatus);
  const hasReceipt = Boolean(payment?.mpesaReceipt);

  if (!order) {
    flags.push({ label: "Payment has no linked order", severity: "bad" });
  }

  if (order && paymentAmount && orderAmount && Math.round(paymentAmount) !== Math.round(orderAmount)) {
    flags.push({ label: "amountMismatch", severity: "bad" });
  }

  if (paymentCategory === "paid" && !hasReceipt) {
    flags.push({ label: "missingReceipt", severity: "bad" });
  }

  if (paymentCategory === "pending") {
    flags.push({ label: "Pending payment", severity: "warn" });
  }

  if (paymentCategory === "failed") {
    flags.push({ label: "Failed/cancelled payment", severity: "bad" });
  }

  if (order && paymentCategory === "paid" && orderPaymentCategory !== "paid") {
    flags.push({ label: "Order payment status not marked paid", severity: "warn" });
  }

  if (order && paymentCategory !== "paid" && orderPaymentCategory === "paid") {
    flags.push({ label: "Order says paid but payment record is not paid", severity: "bad" });
  }

  return flags;
}

app.get("/api/admin/mpesa-reconciliation", async (req, res) => {
  try {
    if (!requireMpesaReconciliationToken(req, res)) return;

    const filter = String(req.query.filter || "").trim();
    const q = String(req.query.q || "").trim();

    const where = {};

    if (q) {
      const numeric = Number(q);
      where.OR = [
        ...(Number.isFinite(numeric) && numeric > 0 ? [{ id: numeric }, { orderId: numeric }] : []),
        { phone: { contains: q, mode: "insensitive" } },
        { status: { contains: q, mode: "insensitive" } },
        { mpesaReceipt: { contains: q, mode: "insensitive" } },
        { checkoutRequestId: { contains: q, mode: "insensitive" } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      orderBy: { id: "desc" },
      take: 200,
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            paymentStatus: true,
            orderStatus: true,
            phone: true,
            deliveryAddress: true,
            createdAt: true,
            user: { select: { id: true, email: true, name: true, phone: true } },
          },
        },
      },
    });

    let records = payments.map((payment) => {
      const order = payment.order || null;
      const flags = stage33cFlagRecord(payment, order);
      const paymentStatusCategory = stage33cStatusCategory(payment.status);

      return {
        paymentId: payment.id,
        orderId: payment.orderId || order?.id || null,
        paymentAmount: payment.amount || 0,
        orderAmount: order?.totalAmount || 0,
        paymentStatus: payment.status || "",
        paymentStatusCategory,
        orderPaymentStatus: order?.paymentStatus || "",
        orderStatus: order?.orderStatus || "",
        phone: payment.phone || order?.phone || order?.user?.phone || "",
        customerEmail: order?.user?.email || "",
        mpesaReceipt: payment.mpesaReceipt || "",
        checkoutRequestId: payment.checkoutRequestId || "",
        createdAt: payment.createdAt,
        flags,
      };
    });

    if (filter === "issues") records = records.filter((r) => r.flags.length > 0);
    if (filter === "pending") records = records.filter((r) => r.paymentStatusCategory === "pending");
    if (filter === "paid") records = records.filter((r) => r.paymentStatusCategory === "paid");
    if (filter === "missing-receipt") records = records.filter((r) => r.flags.some((f) => f.label === "missingReceipt"));
    if (filter === "amount-mismatch") records = records.filter((r) => r.flags.some((f) => f.label === "amountMismatch"));

    const summary = {
      totalRecords: records.length,
      issueRecords: records.filter((r) => r.flags.length > 0).length,
      paidRecords: records.filter((r) => r.paymentStatusCategory === "paid").length,
      pendingRecords: records.filter((r) => r.paymentStatusCategory === "pending").length,
      failedRecords: records.filter((r) => r.paymentStatusCategory === "failed").length,
      missingReceipt: records.filter((r) => r.flags.some((f) => f.label === "missingReceipt")).length,
      amountMismatch: records.filter((r) => r.flags.some((f) => f.label === "amountMismatch")).length,
    };

    return res.json({
      message: "M-PESA reconciliation loaded.",
      generatedAt: new Date().toISOString(),
      summary,
      records,
      note: "Read-only reconciliation. No order or payment records were changed.",
    });
  } catch (error) {
    console.error("M-PESA reconciliation error:", error);
    return res.status(500).json({
      message: "Could not load M-PESA reconciliation.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 33D: M-PESA Evidence Export API
// Read-only evidence export. Does not update payments or orders.
// ================================
function requireMpesaEvidenceToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

function stage33dStatusCategory(value) {
  const text = String(value || "").toLowerCase();

  if (text.includes("paid") || text.includes("success") || text.includes("complete") || text.includes("confirmed")) {
    return "paid";
  }

  if (text.includes("fail") || text.includes("cancel") || text.includes("error") || text.includes("decline")) {
    return "failed";
  }

  return "pending";
}

function stage33dFlags(payment, order) {
  const flags = [];
  const paymentAmount = Number(payment?.amount || 0);
  const orderAmount = Number(order?.totalAmount || 0);
  const paymentCategory = stage33dStatusCategory(payment?.status);
  const orderPaymentCategory = stage33dStatusCategory(order?.paymentStatus);
  const hasReceipt = Boolean(payment?.mpesaReceipt);

  if (!order) flags.push("Payment has no linked order");
  if (order && paymentAmount && orderAmount && Math.round(paymentAmount) !== Math.round(orderAmount)) flags.push("amountMismatch");
  if (paymentCategory === "paid" && !hasReceipt) flags.push("missingReceipt");
  if (paymentCategory === "pending") flags.push("Pending payment");
  if (paymentCategory === "failed") flags.push("Failed/cancelled payment");
  if (order && paymentCategory === "paid" && orderPaymentCategory !== "paid") flags.push("Order payment status not marked paid");
  if (order && paymentCategory !== "paid" && orderPaymentCategory === "paid") flags.push("Order says paid but payment record is not paid");

  return flags;
}

function stage33dFlatten(value) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.join(" | ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function stage33dCsv(rows) {
  if (!rows.length) return "message\nNo evidence records found\n";
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const text = stage33dFlatten(value);
    if (text.includes(",") || text.includes('"') || text.includes("\n") || text.includes("\r")) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  };
  return headers.join(",") + "\n" + rows.map((row) => headers.map((header) => escape(row[header])).join(",")).join("\n");
}

app.get("/api/admin/mpesa-evidence/export", async (req, res) => {
  try {
    if (!requireMpesaEvidenceToken(req, res)) return;

    const filter = String(req.query.filter || "").trim();
    const q = String(req.query.q || "").trim();
    const format = String(req.query.format || "csv").toLowerCase() === "json" ? "json" : "csv";

    const where = {};

    if (q) {
      const numeric = Number(q);
      where.OR = [
        ...(Number.isFinite(numeric) && numeric > 0 ? [{ id: numeric }, { orderId: numeric }] : []),
        { phone: { contains: q, mode: "insensitive" } },
        { status: { contains: q, mode: "insensitive" } },
        { mpesaReceipt: { contains: q, mode: "insensitive" } },
        { checkoutRequestId: { contains: q, mode: "insensitive" } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      orderBy: { id: "desc" },
      take: 1000,
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            deliveryFee: true,
            paymentStatus: true,
            orderStatus: true,
            phone: true,
            deliveryAddress: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    let rows = payments.map((payment) => {
      const order = payment.order || null;
      const flags = stage33dFlags(payment, order);
      const paymentStatusCategory = stage33dStatusCategory(payment.status);

      return {
        paymentId: payment.id,
        orderId: payment.orderId || order?.id || "",
        customerName: order?.user?.name || "",
        customerEmail: order?.user?.email || "",
        phone: payment.phone || order?.phone || order?.user?.phone || "",
        paymentAmount: payment.amount || 0,
        orderAmount: order?.totalAmount || 0,
        deliveryFee: order?.deliveryFee || 0,
        paymentStatus: payment.status || "",
        paymentStatusCategory,
        orderPaymentStatus: order?.paymentStatus || "",
        orderStatus: order?.orderStatus || "",
        mpesaReceipt: payment.mpesaReceipt || "",
        checkoutRequestId: payment.checkoutRequestId || "",
        deliveryAddress: order?.deliveryAddress || "",
        flags,
        paymentCreatedAt: payment.createdAt,
        orderCreatedAt: order?.createdAt || "",
      };
    });

    if (filter === "issues") rows = rows.filter((row) => row.flags.length > 0);
    if (filter === "paid") rows = rows.filter((row) => row.paymentStatusCategory === "paid");
    if (filter === "pending") rows = rows.filter((row) => row.paymentStatusCategory === "pending");
    if (filter === "failed") rows = rows.filter((row) => row.paymentStatusCategory === "failed");
    if (filter === "missing-receipt") rows = rows.filter((row) => row.flags.includes("missingReceipt"));
    if (filter === "amount-mismatch") rows = rows.filter((row) => row.flags.includes("amountMismatch"));

    const stamp = new Date().toISOString().slice(0, 10);
    const safeFilter = filter || "all";
    const filename = "sokoyetu-mpesa-evidence-" + safeFilter + "-" + stamp + "." + format;

    res.setHeader("Content-Disposition", 'attachment; filename="' + filename + '"');

    if (format === "json") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.send(JSON.stringify({
        generatedAt: new Date().toISOString(),
        filter: safeFilter,
        count: rows.length,
        records: rows,
      }, null, 2));
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    return res.send(stage33dCsv(rows));
  } catch (error) {
    console.error("M-PESA evidence export error:", error);
    return res.status(500).json({
      message: "Could not export M-PESA evidence.",
      details: error.message,
    });
  }
});


// ================================
function requireStage35aCoreReadinessToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

function stage35aMask(value) {
  const text = String(value || "");
  if (!text) return "";
  if (text.length <= 10) return text.slice(0, 2) + "...hidden";
  return text.slice(0, 4) + "...hidden..." + text.slice(-3);
}

function stage35aRouteOrder(serverText) {
  const fallbackIndex = serverText.lastIndexOf("SokoYetu Stage 32E: Friendly Error Pages");
  const stage35aIndex = serverText.indexOf("SokoYetu Stage 35A: Core Production Readiness Audit API");
  const routePattern = /app\.(get|post|put|patch|delete|use)\s*\(\s*["']([^"']+)/g;
  const routesAfterFallback = [];

  if (fallbackIndex !== -1) {
    let match;
    while ((match = routePattern.exec(serverText))) {
      if (match.index > fallbackIndex) routesAfterFallback.push(match[1].toUpperCase() + " " + match[2]);
    }
  }

  return {
    fallbackFound: fallbackIndex !== -1,
    stage35aBeforeFallback: fallbackIndex === -1 || (stage35aIndex !== -1 && stage35aIndex < fallbackIndex),
    routesAfterFallback,
  };
}

async function stage35aSafeCount(modelName) {
  try {
    if (!global.prisma && typeof prisma === "undefined") {
      return { model: modelName, available: false, count: null, note: "Prisma client variable not available." };
    }

    const client = typeof prisma !== "undefined" ? prisma : global.prisma;
    const model = client && client[modelName];

    if (!model || typeof model.count !== "function") {
      return { model: modelName, available: false, count: null, note: "Model not found on Prisma client." };
    }

    const count = await model.count();
    return { model: modelName, available: true, count, note: count === 0 ? "No records found." : "Records found." };
  } catch (error) {
    return { model: modelName, available: false, count: null, note: error.message };
  }
}

async function stage35aDatabaseCounts() {
  const models = ["user", "seller", "product", "order", "payment", "supportTicket", "supportRequest"];
  const results = [];
  for (const model of models) results.push(await stage35aSafeCount(model));
  return results;
}

function stage35aFileChecks(rootDir) {
  const files = [
    { file: "index.html", critical: true, note: "Homepage must open." },
    { file: "categories.html", critical: true, note: "Public product browsing must work." },
    { file: "product-detail.html", critical: true, note: "Product detail flow must work." },
    { file: "checkout.html", critical: true, note: "Checkout page must exist." },
    { file: "track-order.html", critical: true, note: "Buyer order tracking must exist." },
    { file: "admin-orders.html", critical: true, note: "Admin order monitoring must exist." },
    { file: "admin-control.html", critical: true, note: "Central admin control must exist." },
    { file: "admin-mpesa-readiness.html", critical: true, note: "M-PESA readiness must be reviewable." },
    { file: "admin-mpesa-reconciliation.html", critical: true, note: "Payment/order reconciliation must exist." },
    { file: "admin-mpesa-evidence.html", critical: false, note: "Evidence export is useful for launch audit." },
    { file: "404.html", critical: false, note: "Friendly fallback should exist." },
    { file: "500.html", critical: false, note: "Friendly server error page should exist." },
    { file: "robots.txt", critical: false, note: "Admin/noindex controls should exist." },
    { file: "sitemap.xml", critical: false, note: "Public SEO sitemap should exist." },
  ];

  return files.map((item) => ({
    ...item,
    exists: require("fs").existsSync(require("path").join(rootDir, item.file)),
  }));
}

function stage35aRouteChecks(serverText) {
  const routes = [
    { pattern: "/api/health", critical: true, note: "API health check must exist." },
    { pattern: "/api/products", critical: true, note: "Public product API must exist." },
    { pattern: "/api/admin", critical: true, note: "Protected admin routes should exist." },
    { pattern: "ADMIN_ORDER_TOKEN", critical: true, note: "Admin token protection should be present." },
    { pattern: "mpesa", critical: true, note: "M-PESA code or readiness references should exist." },
    { pattern: "checkout", critical: true, note: "Checkout route/page references should exist." },
    { pattern: "SokoYetu Stage 32E: Friendly Error Pages", critical: false, note: "Final friendly fallback should exist." },
    { pattern: "SokoYetu Stage 33C: M-PESA Payment Reconciliation API", critical: false, note: "Payment reconciliation endpoint should exist if Stage 33C was applied." },
    { pattern: "SokoYetu Stage 33D: M-PESA Evidence Export API", critical: false, note: "Evidence export endpoint should exist if Stage 33D was applied." },
  ];

  const lower = serverText.toLowerCase();

  return routes.map((route) => ({
    ...route,
    found: route.pattern === "mpesa" || route.pattern === "checkout"
      ? lower.includes(route.pattern.toLowerCase())
      : serverText.includes(route.pattern),
  }));
}

function stage35aSecretScan(rootDir) {
  const files = ["index.html", "app.js", "public-nav.js", "checkout.html", "categories.html", "product-detail.html"];
  const risky = ["MPESA_CONSUMER_SECRET", "MPESA_PASSKEY", "DATABASE_URL", "ADMIN_ORDER_TOKEN=", "sokoyetu_admin_orders_2026_change_this_secret"];
  const results = [];

  for (const file of files) {
    const filePath = require("path").join(rootDir, file);
    if (!require("fs").existsSync(filePath)) continue;
    const text = require("fs").readFileSync(filePath, "utf8");
    const matches = risky.filter((item) => text.includes(item));
    results.push({ file, matches });
  }

  return results;
}

app.get("/api/admin/core-readiness/audit", async (req, res) => {
  try {
    if (!requireStage35aCoreReadinessToken(req, res)) return;

    const fs = require("fs");
    const pathModule = require("path");
    const rootDir = __dirname;
    const serverText = fs.readFileSync(pathModule.join(rootDir, "server.js"), "utf8");

    const blockers = [];
    const warnings = [];

    const env = {
      databaseUrlSet: Boolean(process.env.DATABASE_URL),
      databaseUrl: process.env.DATABASE_URL ? stage35aMask(process.env.DATABASE_URL) : "",
      adminOrderTokenSet: Boolean(process.env.ADMIN_ORDER_TOKEN),
      adminOrderToken: process.env.ADMIN_ORDER_TOKEN ? stage35aMask(process.env.ADMIN_ORDER_TOKEN) : "",
      publicSiteUrlSet: Boolean(process.env.PUBLIC_SITE_URL),
      publicSiteUrl: process.env.PUBLIC_SITE_URL || "",
      nodeEnv: process.env.NODE_ENV || "",
      adminRegistrationEnabled: process.env.ADMIN_REGISTRATION_ENABLED || "",
      mpesaMode: process.env.MPESA_ENV || process.env.MPESA_MODE || "",
      mpesaProductionConfirmed: String(process.env.MPESA_PRODUCTION_CONFIRMED || process.env.MPESA_LIVE_CONFIRMED || "").toLowerCase() === "true",
    };

    if (!env.databaseUrlSet) blockers.push("DATABASE_URL is missing.");
    if (!env.adminOrderTokenSet) blockers.push("ADMIN_ORDER_TOKEN is missing.");
    if (env.adminRegistrationEnabled === "true") blockers.push("ADMIN_REGISTRATION_ENABLED is true. Lock admin registration before launch.");
    if (env.nodeEnv && env.nodeEnv !== "production") warnings.push("NODE_ENV is not production. This can be acceptable locally but should be production on Render.");
    if (!env.publicSiteUrlSet) warnings.push("PUBLIC_SITE_URL is not set.");
    if (env.publicSiteUrl && !/mysokoyetu\.co\.ke/i.test(env.publicSiteUrl)) warnings.push("PUBLIC_SITE_URL does not appear to use mysokoyetu.co.ke.");

    const mpesaMode = String(env.mpesaMode || "").toLowerCase();
    if ((mpesaMode === "production" || mpesaMode === "live") && !env.mpesaProductionConfirmed) {
      blockers.push("M-PESA production/live mode appears requested but MPESA_PRODUCTION_CONFIRMED=true is not set.");
    }

    const fileChecks = stage35aFileChecks(rootDir);
    for (const file of fileChecks) {
      if (!file.exists && file.critical) blockers.push("Critical file missing: " + file.file);
      else if (!file.exists) warnings.push("Optional/readiness file missing: " + file.file);
    }

    const routeChecks = stage35aRouteChecks(serverText);
    for (const route of routeChecks) {
      if (!route.found && route.critical) blockers.push("Critical route/code pattern missing: " + route.pattern);
      else if (!route.found) warnings.push("Optional route/code pattern missing: " + route.pattern);
    }

    const routeOrder = stage35aRouteOrder(serverText);
    if (routeOrder.routesAfterFallback && routeOrder.routesAfterFallback.length) {
      blockers.push("One or more routes appear after the final 404 fallback and may be unreachable: " + routeOrder.routesAfterFallback.join(", "));
    }

    const databaseCounts = await stage35aDatabaseCounts();
    const productCount = databaseCounts.find((item) => item.model === "product");
    const orderCount = databaseCounts.find((item) => item.model === "order");
    const paymentCount = databaseCounts.find((item) => item.model === "payment");

    if (productCount && productCount.available && productCount.count === 0) blockers.push("Product table has zero products. Buyers will not have products to purchase.");
    if (productCount && !productCount.available) warnings.push("Could not verify Product model count.");
    if (orderCount && !orderCount.available) warnings.push("Could not verify Order model count.");
    if (paymentCount && !paymentCount.available) warnings.push("Could not verify Payment model count.");

    const secretScan = stage35aSecretScan(rootDir);
    for (const item of secretScan) {
      if (item.matches.length) blockers.push("Potential secret exposure in public file " + item.file + ": " + item.matches.join(", "));
    }

    const launchDecision = blockers.length ? "HOLD" : warnings.length ? "REVIEW" : "CONTROLLED_TESTING_OK";

    return res.json({
      message: "Core readiness audit completed.",
      generatedAt: new Date().toISOString(),
      launchDecision,
      blockers,
      warnings,
      environment: env,
      fileChecks,
      routeChecks,
      databaseCounts,
      routeOrder,
      secretScan,
      note: "Read-only audit. No application data or settings were changed.",
    });
  } catch (error) {
    console.error("Core readiness audit error:", error);
    return res.status(500).json({
      message: "Could not run core readiness audit.",
      details: error.message,
    });
  }
});



// ================================
// SokoYetu Stage 35C: Controlled Buyer Journey Smoke Test API
// Read-only buyer journey smoke test. Does not create orders or trigger payments.
// ================================
function requireStage35cBuyerSmokeToken(req, res) {
  const configuredToken = process.env.ADMIN_ORDER_TOKEN;
  const providedToken = req.headers["x-admin-order-token"];

  if (!configuredToken) {
    res.status(500).json({ message: "ADMIN_ORDER_TOKEN is not configured on the server." });
    return false;
  }

  if (!providedToken || providedToken !== configuredToken) {
    res.status(403).json({ message: "Invalid admin order token." });
    return false;
  }

  return true;
}

async function stage35cSafeCount(modelName) {
  try {
    let client = null;
    try { if (typeof prisma !== "undefined") client = prisma; } catch (_) {}
    if (!client && global.prisma) client = global.prisma;

    if (!client || !client[modelName] || typeof client[modelName].count !== "function") {
      return { model: modelName, available: false, count: null, note: "Model not found on Prisma client." };
    }

    const count = await client[modelName].count();
    return { model: modelName, available: true, count, note: count === 0 ? "No records found." : "Records found." };
  } catch (error) {
    return { model: modelName, available: false, count: null, note: error.message };
  }
}

async function stage35cBuyerSmokeCounts() {
  const models = ["product", "order", "payment", "user"];
  const out = [];
  for (const model of models) out.push(await stage35cSafeCount(model));
  return out;
}

function stage35cFileChecks(rootDir) {
  const files = [
    { file: "index.html", critical: true, note: "Homepage must open." },
    { file: "categories.html", critical: true, note: "Product browsing page must open." },
    { file: "product-detail.html", critical: true, note: "Product detail page must open." },
    { file: "checkout.html", critical: true, note: "Checkout page must open." },
    { file: "track-order.html", critical: true, note: "Order tracking page must open." },
    { file: "support-request.html", critical: false, note: "Support request page should exist." },
    { file: "admin-orders.html", critical: true, note: "Admin order monitoring must open." },
    { file: "admin-mpesa-reconciliation.html", critical: true, note: "Payment reconciliation must open." },
  ];

  return files.map((item) => ({
    ...item,
    exists: require("fs").existsSync(require("path").join(rootDir, item.file)),
  }));
}

function stage35cRouteChecks(serverText) {
  const checks = [
    { pattern: "/api/health", critical: true, note: "Health endpoint must exist." },
    { pattern: "/api/products", critical: true, note: "Products API must exist." },
    { pattern: "/api/products/:id", critical: true, note: "Product detail API must exist." },
    { pattern: "/api/cart", critical: true, note: "Cart API pattern should exist." },
    { pattern: "/api/orders", critical: true, note: "Order API pattern should exist." },
    { pattern: "/api/orders/track", critical: true, note: "Order tracking route should exist." },
    { pattern: "/api/payments/:orderId/status", critical: true, note: "Payment status route should exist." },
    { pattern: "/api/admin/orders", critical: true, note: "Admin orders route should exist." },
    { pattern: "ADMIN_ORDER_TOKEN", critical: true, note: "Admin token protection should exist." },
  ];

  return checks.map((item) => ({ ...item, found: serverText.includes(item.pattern) }));
}

async function stage35cSampleProduct() {
  try {
    let client = null;

    try {
      if (typeof prisma !== "undefined") client = prisma;
    } catch (_) {}

    if (!client && global.prisma) client = global.prisma;

    if (!client || !client.product || typeof client.product.findFirst !== "function") {
      return null;
    }

    let product = null;

    try {
      product = await client.product.findFirst({ orderBy: { id: "asc" } });
    } catch (_) {
      product = await client.product.findFirst();
    }

    if (!product) return null;

    const name =
      product.name ||
      product.title ||
      product.productName ||
      product.label ||
      ("Product " + product.id);

    const price =
      product.price ??
      product.sellingPrice ??
      product.unitPrice ??
      product.amount ??
      product.finalPrice ??
      null;

    const stock =
      product.stock ??
      product.quantity ??
      product.availableStock ??
      product.inventory ??
      null;

    const imageUrl =
      product.imageUrl ||
      product.image ||
      product.photoUrl ||
      product.thumbnail ||
      product.productImage ||
      "";

    return {
      id: product.id,
      name,
      title: product.title || product.name || name,
      price,
      stock,
      imageUrl,
    };
  } catch (_) {
    return null;
  }
}

app.get("/api/admin/buyer-journey-smoke", async (req, res) => {
  try {
    if (!requireStage35cBuyerSmokeToken(req, res)) return;

    const fs = require("fs");
    const pathModule = require("path");
    const rootDir = __dirname;
    const serverText = fs.readFileSync(pathModule.join(rootDir, "server.js"), "utf8");

    const blockers = [];
    const warnings = [];
    const fileChecks = stage35cFileChecks(rootDir);
    const routeChecks = stage35cRouteChecks(serverText);

    for (const item of fileChecks) {
      if (!item.exists && item.critical) blockers.push("Critical buyer-flow file missing: " + item.file);
      else if (!item.exists) warnings.push("Optional buyer-flow file missing: " + item.file);
    }

    for (const item of routeChecks) {
      if (!item.found && item.critical) blockers.push("Critical buyer-flow route/code pattern missing: " + item.pattern);
      else if (!item.found) warnings.push("Optional buyer-flow route/code pattern missing: " + item.pattern);
    }

    const counts = await stage35cBuyerSmokeCounts();
    const productCount = counts.find((item) => item.model === "product");

    if (!productCount || !productCount.available) blockers.push("Could not verify product count.");
    else if (productCount.count === 0) blockers.push("Product table has zero products.");

    const sampleProduct = await stage35cSampleProduct();
    if (!sampleProduct) blockers.push("No sample product could be selected.");

    const mpesaMode = process.env.MPESA_ENV || process.env.MPESA_MODE || "";
    if (!mpesaMode) warnings.push("M-PESA mode is not set; confirm expected checkout/payment behaviour manually.");

    const decision = blockers.length ? "HOLD" : warnings.length ? "REVIEW" : "READY_FOR_CONTROLLED_MANUAL_BUYER_TEST";

    return res.json({
      message: "Buyer journey smoke test loaded.",
      generatedAt: new Date().toISOString(),
      decision,
      blockers,
      warnings,
      mpesaMode,
      fileChecks,
      routeChecks,
      counts,
      sampleProduct,
      note: "Read-only API. No order or payment was created by this smoke check.",
    });
  } catch (error) {
    console.error("Buyer journey smoke test error:", error);
    return res.status(500).json({ message: "Could not run buyer journey smoke test.", details: error.message });
  }
});

// SokoYetu Stage 32E: Friendly Error Pages and Public Recovery Flow
// Final fallback only. Does not affect existing defined routes.
// ================================
app.use((req, res, next) => {
  if (res.headersSent) return next();

  if (req.path && req.path.startsWith("/api/")) {
    return res.status(404).json({
      message: "API endpoint not found.",
      path: req.path,
    });
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(404).send("Not found");
  }

  return res.status(404).sendFile(require("path").join(__dirname, "404.html"));
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  if (res.headersSent) return next(err);

  if (req.path && req.path.startsWith("/api/")) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }

  return res.status(500).sendFile(require("path").join(__dirname, "500.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SokoYetu full-stack server running at http://localhost:${PORT}/`);
  console.log(`API health check: http://localhost:${PORT}/api/health`);
  console.log("Press Ctrl + C to stop the server.");
});
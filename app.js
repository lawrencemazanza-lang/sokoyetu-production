const AS = "assets/";
const state = {
  role: localStorage.getItem("sokoyetuRole") || "buyer",
  user: null,
  authChecked: false,
  cart: JSON.parse(localStorage.getItem("sokoyetuCart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("sokoyetuWishlist") || "[]"),
  imported: JSON.parse(localStorage.getItem("sokoyetuImported") || "[]"),
  flashIndex: 0,
  adIndex: 0,
  selectedSupplier: 0,
  profit: Number(localStorage.getItem("sokoyetuProfit") || 18),
  searchQuery: "",
  categoryFilter: "all"
};

const categories = [
  ["🏬", "Official Stores"], ["📱", "Phones & Tablets"], ["💻", "Computing"], ["📺", "TVs & Audio"], ["🧺", "Appliances"],
  ["💄", "Beauty & Health"], ["👗", "Fashion"], ["🛒", "Supermarket"], ["🏡", "Home & Garden"], ["👶", "Baby & Kids"],
  ["⚽", "Sports"], ["🚗", "Automotive"], ["🛠️", "Tools & Hardware"], ["🎮", "Gaming"]
];

const products = [
  {id:"p1", name:"Samsung Galaxy A54 5G", seller:"TechHub Nairobi", category:"Phones", img:"phone.svg", price:42000, old:49000, stock:62, rating:4.8, reviews:120, discount:14},
  {id:"p2", name:"HP Pavilion 15 Laptop", seller:"Laptop Palace KE", category:"Computing", img:"laptop.svg", price:65000, old:75000, stock:34, rating:4.7, reviews:45, discount:13},
  {id:"p3", name:"Nike Air Force 1 '07", seller:"Kicks Kenya", category:"Fashion", img:"sneaker.svg", price:12500, old:15000, stock:27, rating:4.9, reviews:89, discount:17},
  {id:"p4", name:"Kenyan Coffee Blend 500g", seller:"Highlands Coffee Co.", category:"Groceries", img:"coffee.svg", price:1200, old:1500, stock:86, rating:4.9, reviews:340, discount:20},
  {id:"p5", name:"Avocado Organic Skincare Set", seller:"Nairobi Naturals", category:"Beauty", img:"beauty.svg", price:2800, old:3500, stock:43, rating:4.6, reviews:210, discount:20},
  {id:"p6", name:"Fresh Family Groceries Basket", seller:"Soko Fresh", category:"Supermarket", img:"groceries.svg", price:3650, old:4300, stock:51, rating:4.5, reviews:99, discount:15},
  {id:"p7", name:"Vitron 43 inch Smart TV", seller:"Vision Electronics", category:"TVs & Audio", img:"tv.svg", price:17999, old:25999, stock:20, rating:4.4, reviews:74, discount:31},
  {id:"p8", name:"Modern 5-Seater Sofa Set", seller:"Home Essentials KE", category:"Furniture", img:"furniture.svg", price:48500, old:62000, stock:8, rating:4.7, reviews:37, discount:22},
  {id:"p9", name:"Bluetooth Subwoofer System", seller:"Audio World KE", category:"Audio", img:"speaker.svg", price:4802, old:6100, stock:10, rating:4.3, reviews:61, discount:21},
  {id:"p10", name:"Twin Tub Washing Machine 7.5kg", seller:"Appliance Centre", category:"Appliances", img:"appliance.svg", price:17280, old:26200, stock:18, rating:4.6, reviews:96, discount:34},
  {id:"p11", name:"Maasai Beaded Bracelet Set", seller:"Maasai Crafts", category:"Fashion", img:"beauty.svg", price:850, old:1200, stock:78, rating:4.8, reviews:520, discount:29},
  {id:"p12", name:"Redmi Budget Smartphone Bundle", seller:"Mobile Mart KE", category:"Phones", img:"phone.svg", price:13999, old:16999, stock:32, rating:4.4, reviews:145, discount:18}
];

const ads = [
  {kicker:"Flash Deals Daily", title:"Kenya's smart marketplace for trusted products and live shopping.", text:"Shop phones, laptops, home essentials, groceries, fashion, beauty products and local brands from verified sellers across Kenya.", icon:"🛍️", cta:"Start Shopping"},
  {kicker:"Live Now", title:"Watch sellers demonstrate products before you buy.", text:"Join live rooms, ask questions, view pinned products and purchase directly through SokoYetu checkout.", icon:"📹", cta:"Watch Live Deals"},
  {kicker:"AI Buyer Tools", title:"Find the best product without wasting time.", text:"Use smart search, compare prices, filter by delivery speed and get personalised recommendations.", icon:"🤖", cta:"Open Smart Tools"},
  {kicker:"For Admin", title:"Source products from wholesalers and price competitively.", text:"AI wholesale sourcing helps compare market price, add profit percentage and publish to the SokoYetu wall.", icon:"📦", cta:"AI Wholesale"}
];

const liveSellers = [
  {name:"TechHub Nairobi", topic:"Phones, laptops and accessories", viewers:842, product:"Samsung Galaxy A54", icon:"📱"},
  {name:"Mama Africa Designs", topic:"Ankara dresses and handmade fashion", viewers:426, product:"African print dress", icon:"👗"},
  {name:"Home Essentials KE", topic:"Kitchen, furniture and home upgrades", viewers:318, product:"Ceramic cooking pot", icon:"🏡"},
  {name:"Nairobi Naturals", topic:"Skincare, beauty and wellness", viewers:267, product:"Avocado skincare set", icon:"💄"}
];

const suppliers = [
  {name:"River Road Electronics Hub", location:"Nairobi CBD", score:96, delivery:"Same-day Nairobi dispatch", categories:"Phones, audio, accessories", note:"Strong for fast-moving electronics and phone bundles.", products:[
    {name:"Android 128GB Smartphone Bundle", img:"phone.svg", cost:11200, market:15500, stock:240},
    {name:"Wireless Earbuds Bulk Pack", img:"speaker.svg", cost:1250, market:2300, stock:510},
    {name:"Laptop Backpack and Mouse Combo", img:"laptop.svg", cost:2100, market:3600, stock:140}
  ]},
  {name:"Eastleigh Fashion Wholesale", location:"Eastleigh, Nairobi", score:91, delivery:"24 to 48 hours", categories:"Fashion, shoes, bags", note:"Good margins for fashion drops and live-selling bundles.", products:[
    {name:"Ladies Ankara Dress Collection", img:"sneaker.svg", cost:1900, market:3600, stock:320},
    {name:"Urban Sneaker Wholesale Lot", img:"sneaker.svg", cost:7800, market:13000, stock:84},
    {name:"Fashion Handbag Mixed Designs", img:"beauty.svg", cost:1350, market:2600, stock:450}
  ]},
  {name:"Thika Road Home Supplies", location:"Ruiru / Thika Road", score:88, delivery:"Nationwide courier available", categories:"Home, appliances, furniture", note:"Best for home bundles, kitchen products and furniture.", products:[
    {name:"5L Ceramic Cooking Pot", img:"appliance.svg", cost:1150, market:2200, stock:190},
    {name:"Modern Compact Sofa Set", img:"furniture.svg", cost:31500, market:52000, stock:22},
    {name:"LED Desk Lamp Bulk Unit", img:"tv.svg", cost:950, market:1900, stock:310}
  ]}
];

const formatMoney = n => `KES ${Number(n).toLocaleString("en-KE")}`;
const image = p => {
  if (p.imageUrl) return p.imageUrl;
  const img = p.img || guessProductImage(p);
  if (/^https?:\/\//i.test(img)) return img;
  return AS + img;
};
const allProducts = () => [...state.imported, ...products];

function guessProductImage(p) {
  const hay = `${p.name || ""} ${p.category || ""}`.toLowerCase();
  if (/phone|tablet|galaxy|redmi|smartphone/.test(hay)) return "phone.svg";
  if (/laptop|computer|computing|mouse/.test(hay)) return "laptop.svg";
  if (/shoe|sneaker|nike|fashion|dress|ankara/.test(hay)) return "sneaker.svg";
  if (/coffee|honey|grocery|groceries|supermarket/.test(hay)) return "coffee.svg";
  if (/beauty|skin|health|skincare/.test(hay)) return "beauty.svg";
  if (/tv|television/.test(hay)) return "tv.svg";
  if (/sofa|furniture/.test(hay)) return "furniture.svg";
  if (/headphone|speaker|audio|jbl/.test(hay)) return "speaker.svg";
  if (/appliance|washing|pot|jiko|home|garden/.test(hay)) return "appliance.svg";
  return "phone.svg";
}

function mapApiProduct(item) {
  const old = item.oldPrice || Math.round(Number(item.price || 0) * 1.18);
  const price = Number(item.price || 0);
  const discount = old && price ? Math.max(1, Math.round((1 - price / old) * 100)) : 0;
  return {
    id: String(item.id),
    dbId: item.id,
    name: item.name,
    description: item.description || "Quality product available on SokoYetu from trusted sellers.",
    seller: item.seller?.name || (item.importedByAdmin ? "SokoYetu Verified" : "Verified Seller"),
    category: item.category || "Other",
    img: item.imageUrl || guessProductImage(item),
    imageUrl: item.imageUrl || "",
    price,
    old,
    stock: Number(item.stock || 0),
    rating: item.reviews?.length ? (item.reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / item.reviews.length).toFixed(1) : 4.6,
    reviews: item.reviews?.length || 0,
    discount,
    importedByAdmin: item.importedByAdmin
  };
}

async function loadProductsFromDatabase() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Could not load database products.");
    const data = await response.json();
    if (Array.isArray(data.products) && data.products.length) {
      products.length = 0;
      products.push(...data.products.map(mapApiProduct));
      state.cart = state.cart.map(cartItem => {
        const fresh = allProducts().find(p => String(p.id) === String(cartItem.id));
        return fresh ? { ...fresh, qty: cartItem.qty || 1 } : cartItem;
      });
      save();
    }
  } catch (error) {
    console.warn("Using local product fallback:", error.message);
  }
}

async function loadCartFromDatabase() {
  if (!state.user || state.user.role !== "buyer") return;

  try {
    const data = await apiRequest("/api/cart");
    state.cart = (data.cartItems || []).map(item => {
      const product = mapApiProduct(item.product);
      return {
        ...product,
        qty: item.quantity,
        cartItemId: item.id,
      };
    });
    save();
  } catch (error) {
    console.warn("Could not load database cart:", error.message);
  }
}
// ================================
// SokoYetu Step 7: Frontend M-PESA Hook
// Paste this in app.js near your other helper functions.
// Then call startMpesaPayment(order.id, phone) after creating an order.
// ================================

async function startMpesaPayment(orderId, phone) {
  const response = await fetch("/api/payments/mpesa/stk-push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      orderId,
      phone,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "M-PESA payment could not start.");
  }

  return data;
}

async function checkMpesaPaymentStatus(orderId) {
  const response = await fetch(`/api/payments/${orderId}/status`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not check payment status.");
  }

  return data;
}

// Example checkout usage.
// Use this pattern inside your existing checkout/order creation function:
//
// const orderResponse = await fetch("/api/orders", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   credentials: "include",
//   body: JSON.stringify({
//     deliveryAddress,
//     phone,
//   }),
// });
//
// const orderData = await orderResponse.json();
//
// if (!orderResponse.ok) {
//   throw new Error(orderData.message || "Could not create order.");
// }
//
// const mpesaData = await startMpesaPayment(orderData.order.id, phone);
//
// alert(
//   mpesaData.mode === "demo"
//     ? "Demo M-PESA request prepared successfully. In live mode, the customer will receive an STK Push prompt."
//     : "M-PESA request sent. Check your phone and enter your M-PESA PIN."
// );

async function bootstrapApp() {
  await loadCurrentUser();
  await loadProductsFromDatabase();
  if (state.user?.role === "buyer") {
    await loadCartFromDatabase();
  }
  renderApp();
}

function save() {
  localStorage.setItem("sokoyetuRole", state.role);
  localStorage.setItem("sokoyetuCart", JSON.stringify(state.cart));
  localStorage.setItem("sokoyetuWishlist", JSON.stringify(state.wishlist));
  localStorage.setItem("sokoyetuImported", JSON.stringify(state.imported));
  localStorage.setItem("sokoyetuProfit", String(state.profit));
}

function toast(message) {
  const el = document.querySelector(".toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}

function roleName() {
  return state.role[0].toUpperCase() + state.role.slice(1);
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function productCard(p) {
  return `
    <article class="product-card">
      <span class="card-discount">-${p.discount || Math.max(5, Math.round((1 - p.price / p.old) * 100))}%</span>
      <img src="${image(p)}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="card-seller">${p.seller}</div>
      <div class="card-price">${formatMoney(p.price)}</div>
      <div class="card-old">${formatMoney(p.old || Math.round(p.price * 1.22))}</div>
      <div class="seller">⭐ ${p.rating || 4.6} · ${p.reviews || 24} reviews</div>
      <div class="card-actions">
        <button class="btn orange small" onclick="addToCart('${p.id}')">Add</button>
        <button class="btn ghost small" onclick="toggleWishlist('${p.id}')">♡</button>
      </div>
    </article>
  `;
}

function renderHeader() {
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  return `
    <div class="top-promo">🌍 <span>Free delivery on orders above KES 10,000</span> &nbsp; | &nbsp; Shop with confidence - verified sellers, secure checkout and M-PESA support</div>
    <div class="mini-strip">
      <div class="mini-strip-inner">
        <a class="sell-link" href="#" onclick="setRole('seller'); openModal('accountModal'); return false;">Sell on SokoYetu →</a>
        <div class="mini-actions">
          <button class="mini-pill green" onclick="openModal('liveModal')">🔴 Live Sellers</button>
          <button class="mini-pill blue" onclick="openModal('smartModal')">🤖 Smart Buyer Tools</button>
          ${state.user?.role === "admin" ? `<button class="mini-pill" onclick="openModal('adminModal')">⚙️ AI Admin Centre</button>` : ""}
          ${state.user?.role === "seller" ? `<button class="mini-pill" onclick="openModal('sellerModal')">📹 Seller Studio</button>` : ""}
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="header-inner">
        <a class="logo-wrap" href="#" onclick="scrollToTop(); return false;">
          <div class="logo-mark"><div class="logo-letters">SY</div></div>
          <div>
            <div class="logo-text"><span class="soko">Soko</span><span class="yetu">Yetu</span></div>
            <div class="logo-sub">Smart Kenyan Market</div>
          </div>
        </a>
        <form class="search-box" onsubmit="searchProducts(event)">
          <input id="searchInput" placeholder="Search products, brands, categories..." autocomplete="off">
          <button>Search</button>
        </form>
        <div class="header-actions">
          <button class="header-btn" onclick="openModal('accountModal')">👤 ${state.user ? `${state.user.name} (${roleName()})` : "Sign In"}</button>
          <button class="header-btn" onclick="openModal('helpModal')">❔ Help</button>
          <button class="header-btn cart" onclick="openModal('cartModal')">🛒 Cart <span class="cart-badge">${cartCount}</span></button>
        </div>
      </div>
    </header>
    <nav class="category-strip"><div class="category-strip-inner">
      <button class="category-chip active" onclick="filterCategory('all')">All Categories</button>
      ${categories.slice(1, 11).map(c => `<button class="category-chip" onclick="filterCategory('${c[1]}')">${c[0]} ${c[1]}</button>`).join("")}
    </div></nav>
  `;
}

function renderApp() {
  document.getElementById("app").innerHTML = `
    ${renderHeader()}
    <main class="page">
      ${renderMarketplaceTop()}
      ${renderFilteredResults()}
      ${renderInfoGrid()}
      ${renderProductSection("Top selling items", allProducts().slice(0, 6))}
      ${renderProductSection("New on SokoYetu | Phone Deals", allProducts().filter(p => /phone|galaxy|redmi|smartphone/i.test(p.name)).concat(allProducts()).slice(0, 6))}
      ${renderProductSection("Home, TV and Appliance Deals", allProducts().filter(p => /tv|washing|sofa|lamp|pot|appliance/i.test(p.name)).concat(allProducts()).slice(0, 6))}
      ${renderLiveSellersSection()}
      ${renderRoleSection()}
    </main>
    ${renderFooter()}
    ${renderModals()}
    <div class="toast"></div>
  `;
  renderDynamicBits();
}

function renderMarketplaceTop() {
  return `
    <section class="market-grid">
      <aside class="card side-categories">
        <div class="side-title">Shop by Category</div>
        ${categories.map((c, idx) => `<a class="side-cat ${idx === 0 ? "selected" : ""}" href="#" onclick="filterCategory('${c[1]}'); return false;"><span>${c[0]}</span>${c[1]}</a>`).join("")}
      </aside>
      <div class="center-stage">
        <section class="ad-burner" id="adBurner"></section>
        ${renderFlashSales()}
      </div>
      <aside class="quick-panel">
        <button class="quick-card orange" onclick="openModal('liveModal')"><div class="quick-icon">🔴</div><strong>Live Sellers Now</strong><span>Join live rooms and buy pinned products.</span></button>
        <button class="quick-card blue" onclick="openModal('smartModal')"><div class="quick-icon">🤖</div><strong>Smart Buyer Tools</strong><span>Ask AI to find best deals by budget.</span></button>
        <button class="quick-card green" onclick="setRole('seller'); openModal('accountModal')"><div class="quick-icon">🏪</div><strong>Sell on SokoYetu</strong><span>Go live, list products and grow sales.</span></button>
        <button class="quick-card" onclick="window.location.href='/checkout.html'"><div class="quick-icon">📲</div><strong>M-PESA Checkout</strong><span>Fast STK-ready payment experience.</span></button>
      </aside>
    </section>
  `;
}

function renderFlashSales() {
  const items = [...products, ...state.imported].slice(0, 10);
  const repeated = [...items, ...items];
  return `
    <section class="flash-card">
      <div class="flash-head">
        <div class="flash-title">⚡ Flash Sales | Live Now</div>
        <div class="countdown">Time Left: <span class="time-pill" id="countdownText">00h : 00m : 00s</span> <button class="btn white small" onclick="filterCategory('flash')">See All</button></div>
      </div>
      <div class="flash-body">
        <div id="liveFlashProduct"></div>
        <div class="flash-mini-row">
          <div class="flash-mini-track">
            ${repeated.map(p => `
              <button class="mini-product" onclick="focusFlash('${p.id}')">
                <img src="${image(p)}" alt="${p.name}">
                <div class="name">${p.name}</div>
                <div class="mini-price">${formatMoney(p.price)}</div>
                <div class="mini-discount">-${p.discount}% · ${p.stock} left</div>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}


function categoryMatches(p, cat) {
  if (!cat || cat === "all" || cat === "flash") return true;
  const c = cat.toLowerCase();
  const hay = `${p.name} ${p.category} ${p.seller}`.toLowerCase();
  if (c.includes("phone")) return /phone|galaxy|redmi|smartphone|tablet/.test(hay);
  if (c.includes("comput")) return /laptop|comput|backpack|mouse/.test(hay);
  if (c.includes("tv") || c.includes("audio")) return /tv|audio|speaker|subwoofer|earbud/.test(hay);
  if (c.includes("appliance")) return /appliance|washing|pot|lamp/.test(hay);
  if (c.includes("beauty") || c.includes("health")) return /beauty|skincare|wellness/.test(hay);
  if (c.includes("fashion")) return /fashion|shoe|sneaker|dress|bracelet|ankara/.test(hay);
  if (c.includes("supermarket")) return /supermarket|grocery|groceries|coffee|basket/.test(hay);
  if (c.includes("home") || c.includes("garden")) return /home|sofa|furniture|lamp|pot/.test(hay);
  return hay.includes(c);
}

function getVisibleProducts() {
  const q = state.searchQuery.trim().toLowerCase();
  return allProducts().filter(p => {
    const hay = `${p.name} ${p.category} ${p.seller}`.toLowerCase();
    const queryOk = !q || hay.includes(q) || q.split(/\s+/).filter(Boolean).some(w => w.length > 2 && hay.includes(w));
    return queryOk && categoryMatches(p, state.categoryFilter);
  });
}

function renderFilteredResults() {
  if (!state.searchQuery && state.categoryFilter === "all") return "";
  const results = getVisibleProducts();
  const title = state.searchQuery ? `Search results for “${state.searchQuery}”` : `${state.categoryFilter} deals`;
  return `<section class="section filtered-results"><div class="section-head"><h2>${title}</h2><button class="see-all" onclick="clearFilters()">Clear →</button></div>${results.length ? `<div class="product-row">${results.slice(0, 8).map(productCard).join("")}</div>` : `<div class="empty-state">No product matched your search yet. Try another brand, product or category.</div>`}</section>`;
}

function visibleAds() {
  return state.user?.role === "admin" ? ads : ads.filter(a => a.kicker !== "For Admin");
}

function renderInfoGrid() {
  return `
    <section class="info-grid">
      <div class="info-card"><div class="info-icon">🚚</div><h3>Free Delivery</h3><p>Orders above KES 10,000 qualify for free delivery.</p></div>
      <div class="info-card"><div class="info-icon">📲</div><h3>M-PESA Ready</h3><p>Checkout is designed for STK push integration.</p></div>
      <div class="info-card"><div class="info-icon">✅</div><h3>Verified Sellers</h3><p>Seller profiles, trust badges and quality checks.</p></div>
      <div class="info-card"><div class="info-icon">↩️</div><h3>Easy Returns</h3><p>Clear seven-day return workflow for eligible products.</p></div>
    </section>
  `;
}

function renderProductSection(title, list) {
  const clean = list.filter(Boolean).slice(0, 6);
  return `
    <section class="section">
      <div class="section-head"><h2>${title}</h2><button class="see-all" onclick="filterCategory('all')">See All →</button></div>
      <div class="product-row">${clean.map(productCard).join("")}</div>
    </section>
  `;
}

function renderLiveSellersSection() {
  return `
    <section class="section">
      <div class="section-head"><h2>🔴 Live Sellers Now</h2><button class="see-all" onclick="openModal('liveModal')">View Live Rooms →</button></div>
      <div class="live-sellers-grid">
        ${liveSellers.map(s => `
          <article class="live-room">
            <div class="live-screen"><span class="live-label">LIVE</span><span class="viewer-label">${s.viewers} watching</span>${s.icon}</div>
            <div class="live-room-body"><h3>${s.name}</h3><p>${s.topic}</p><button class="btn orange small" onclick="openModal('liveModal')">Join Live</button></div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderRoleSection() {
  if (state.user?.role === "admin") {
    return `<section class="section"><div class="section-head"><h2>⚙️ Admin-only AI Digital Selling Centre</h2><button class="see-all" onclick="openModal('adminModal')">Open Admin Centre →</button></div><div style="padding:16px" class="tool-grid">${adminTools().map(t=>toolCard(t)).join("")}</div></section>`;
  }
  if (state.user?.role === "seller") {
    return `<section class="section"><div class="section-head"><h2>🏪 Seller-only Growth Studio</h2><button class="see-all" onclick="openModal('sellerModal')">Open Seller Studio →</button></div><div style="padding:16px" class="tool-grid">${sellerTools().map(t=>toolCard(t)).join("")}</div></section>`;
  }
  return `<section class="section"><div class="section-head"><h2>🤖 Buyer Smart Tools</h2><button class="see-all" onclick="openModal('smartModal')">Open Smart Tools →</button></div><div style="padding:16px" class="tool-grid">${buyerTools().map(t=>toolCard(t)).join("")}</div></section>`;
}

function toolCard(t) { return `<article class="tool-card"><h3>${t.icon} ${t.title}</h3><p>${t.text}</p><button class="btn ghost small" onclick="${t.action || "toast('Demo tool opened')"}">Open</button></article>`; }
function buyerTools(){return[
  {icon:"🔎", title:"AI Product Finder", text:"Describe what you need and get budget-aware product suggestions.", action:"openModal('smartModal')"},
  {icon:"📉", title:"Price Drop Alerts", text:"Save products and receive alerts when the price falls.", action:"openModal('wishlistModal')"},
  {icon:"🎁", title:"Bundle Builder", text:"Create smart bundles such as phone + case + earbuds."}
]}
function sellerTools(){return[
  {icon:"📹", title:"Live Selling Room", text:"Set up product demos, pin products and receive buyer questions.", action:"openModal('sellerModal')"},
  {icon:"📣", title:"Advert Maker", text:"Generate WhatsApp, TikTok and Instagram product copy."},
  {icon:"📦", title:"Stock Alerts", text:"Know when products are moving fast or nearly out of stock."}
]}
function adminTools(){return[
  {icon:"🏭", title:"AI Wholesale Sourcing", text:"Search wholesalers, open catalogues and import products with profit margin.", action:"openModal('adminModal')"},
  {icon:"🧮", title:"Profit Guard", text:"Compare wholesale cost, SokoYetu price and Kenyan market average."},
  {icon:"📲", title:"M-PESA Reconciliation", text:"Plan reconciliation between orders, payments and seller payouts.", action:"openModal('mpesaModal')"}
]}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <a class="logo-wrap" href="#"><div class="logo-mark"><div class="logo-letters">SY</div></div><div><div class="logo-text"><span style="color:#fff">Soko</span><span class="yetu">Yetu</span></div><div class="logo-sub" style="color:#f8c481">Smart Kenyan Market</div></div></a>
          <p>SokoYetu is Kenya's smart marketplace for trusted products, verified sellers, live shopping and AI-powered digital selling. Buyers discover better deals faster, sellers sell through product walls and live rooms, and admins can source products from wholesalers, price competitively and publish products with smarter marketing support.</p>
        </div>
        <div><h3>Quick Links</h3><a>Home</a><a>All Products</a><a>Track Order</a><a>Live Sellers</a><a>Become a Seller</a></div>
        <div><h3>Categories</h3><a>Electronics</a><a>Fashion</a><a>Home & Garden</a><a>Beauty & Health</a><a>Groceries</a><a>Sports</a></div>
        <div><h3>Contact Us</h3><p>Email: mysokoyetu@gmail.com<br>Location: Nairobi, Kenya</p><p><b>M-PESA Accepted</b><br>Pay easily with Lipa na M-PESA.</p></div>
      </div>
      <div class="footer-bottom"><span>© 2026 SokoYetu. All rights reserved.</span><span>Privacy Policy · Terms of Service · Returns Policy</span></div>
    </footer>
  `;
}

function renderModals() {
  return `
    <div id="accountModal" class="modal-backdrop">${modalShell("Choose account role", renderAccountModal())}</div>
    <div id="liveModal" class="modal-backdrop">${modalShell("Live sellers", renderLiveModal())}</div>
    <div id="smartModal" class="modal-backdrop">${modalShell("Smart buyer tools", renderSmartModal())}</div>
    <div id="cartModal" class="modal-backdrop">${modalShell("Your cart", renderCartModal(), "small")}</div>
    <div id="helpModal" class="modal-backdrop">${modalShell("Help centre", renderHelpModal(), "small")}</div>
    <div id="mpesaModal" class="modal-backdrop">${modalShell("M-PESA checkout", renderMpesaModal(), "small")}</div>
    <div id="sellerModal" class="modal-backdrop">${modalShell("Seller Studio", renderSellerModal())}</div>
    <div id="adminModal" class="modal-backdrop">${modalShell("Admin-only AI Centre", renderAdminModal())}</div>
    <div id="wishlistModal" class="modal-backdrop">${modalShell("Wishlist and price alerts", renderWishlistModal(), "small")}</div>
  `;
}

function modalShell(title, body, size="") { return `<section class="modal ${size}"><div class="modal-head"><h2>${title}</h2><button class="close-btn" onclick="closeModals()">×</button></div><div class="modal-body">${body}</div></section>`; }
function renderAccountModal(){
  if (state.user) {
    return `
      <div class="cart-summary">
        <div class="summary-line"><span>Signed in as</span><b>${state.user.name}</b></div>
        <div class="summary-line"><span>Email</span><b>${state.user.email}</b></div>
        <div class="summary-line"><span>Role</span><b>${roleName()}</b></div>
      </div>
      <p style="color:#6b7280">Your role controls what you can see. Buyer tools, seller studio and admin centre are separated for security.</p>
      <button class="btn ghost" onclick="logoutAccount()">Sign Out</button>
    `;
  }

  return `
    <p style="margin-top:0;color:#6b7280">Create a real database account or sign in. Choose Buyer, Seller or Admin before registering.</p>
    <div class="role-grid">
      ${["buyer","seller","admin"].map(r => `<button class="role-card ${state.role===r?"active":""}" onclick="setRole('${r}')"><b>${r==="buyer"?"🛍️ Buyer":r==="seller"?"🏪 Seller":"⚙️ Admin"}</b><span>${r==="buyer"?"Shop, join live rooms and use smart buyer tools.":r==="seller"?"Manage products, go live and run seller marketing.":"Source wholesalers, import products and manage marketplace tools."}</span></button>`).join("")}
    </div>
    <div class="form-grid">
      <div class="field"><label>Full name</label><input id="authName" placeholder="Enter your name"></div>
      <div class="field"><label>Email</label><input id="authEmail" placeholder="name@example.com"></div>
      <div class="field"><label>Phone</label><input id="authPhone" placeholder="0714565555"></div>
      <div class="field"><label>Password</label><input id="authPassword" type="password" placeholder="Password"></div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
      <button class="btn orange" onclick="registerAccount()">Create Account</button>
      <button class="btn ghost" onclick="loginAccount()">Sign In</button>
    </div>
  `;
}
function renderLiveModal(){ return `<p style="margin-top:0;color:#6b7280">Sellers can demonstrate products live, pin products, answer buyer questions and receive orders directly from live rooms.</p><div class="live-sellers-grid">${liveSellers.map(s=>`<article class="live-room"><div class="live-screen"><span class="live-label">LIVE</span><span class="viewer-label">${s.viewers} watching</span>${s.icon}</div><div class="live-room-body"><h3>${s.name}</h3><p>${s.topic}</p><div class="badge orange">Pinned: ${s.product}</div><br><br><button class="btn orange small" onclick="toast('Joined ${s.name} live room')">Join Live Room</button></div></article>`).join("")}</div>`;}
function renderSmartModal(){ return `<div class="field"><label>Ask SokoYetu AI</label><textarea rows="3" id="aiQuestion" placeholder="Example: I need a good phone under KES 25,000 with strong battery"></textarea></div><button style="margin-top:10px" class="btn orange" onclick="runSmartAssistant()">Get Recommendation</button><div id="aiAnswer" class="cart-summary"><b>Suggested use:</b> Ask by budget, category, delivery speed, rating or product purpose.</div><div class="tool-grid" style="margin-top:14px">${buyerTools().map(toolCard).join("")}</div>`;}
function renderHelpModal(){ return `<p>How can we help?</p><div class="tool-grid" style="grid-template-columns:1fr"><article class="tool-card"><h3>📦 Track your order</h3><p>View order status from payment confirmation to delivery.</p></article><article class="tool-card"><h3>↩️ Returns and refunds</h3><p>Eligible products follow a clear return request workflow.</p></article><article class="tool-card"><h3>📲 Payment options</h3><p>M-PESA, card and cash-on-delivery can be added in production.</p></article></div>`;}
function renderMpesaModal(){
  const subtotal = getCartTotal();
  const delivery = subtotal >= 10000 || subtotal === 0 ? 0 : 300;
  const total = subtotal + delivery;

  return `
    <p style="color:#6b7280">Complete your order by entering a valid M-PESA phone number and delivery address. In Daraja mode, the system sends a real STK Push prompt to the customer phone.</p>
    <div class="field"><label>M-PESA phone number</label><input id="mpesaPhone" value="${state.user?.phone || ''}" placeholder="0714565555"></div>
    <div class="field"><label>Delivery address</label><textarea id="deliveryAddress" rows="3" placeholder="Example: Nairobi CBD, Moi Avenue, Building name"></textarea></div>
    <div class="cart-summary">
      <div class="summary-line"><span>Subtotal</span><b>${formatMoney(subtotal)}</b></div>
      <div class="summary-line"><span>Delivery</span><b>${delivery === 0 ? 'Free' : formatMoney(delivery)}</b></div>
      <div class="seller">Free delivery applies above KES 10,000.</div>
      <div class="summary-line total"><span>Total</span><b>${formatMoney(total)}</b></div>
    </div>
    <button style="margin-top:12px;width:100%" class="btn green" onclick="createOrderFromCart()">Create Order & Prepare M-PESA Payment</button>
    <div id="orderResult" class="cart-summary" style="display:none;margin-top:12px"></div>
  `;
}
function renderWishlistModal(){ const items = allProducts().filter(p => state.wishlist.includes(p.id)); return items.length ? items.map(p=>`<div class="cart-item"><img src="${image(p)}"><div><b>${p.name}</b><div class="seller">Price alert active</div></div><b>${formatMoney(p.price)}</b></div>`).join("") : `<p>No wishlist items yet. Click the heart button on products to save them.</p>`; }
function renderSellerModal(){ return state.user?.role !== "seller" ? `<p>This area is for seller accounts only. Please sign in using a seller account.</p>` : `<div class="tool-grid">${sellerTools().map(toolCard).join("")}</div><div class="form-grid"><div class="field"><label>Live session title</label><input placeholder="Tonight's phone deals"></div><div class="field"><label>Product to pin</label><select>${products.slice(0,6).map(p=>`<option>${p.name}</option>`).join("")}</select></div><div class="field"><label>Coupon code</label><input value="LIVE10"></div><div class="field"><label>Verification status</label><select><option>Verified seller badge enabled</option></select></div></div><button style="margin-top:14px" class="btn orange" onclick="toast('Seller live room prepared')">Prepare Live Room</button>`; }
function renderAdminModal(){ return state.user?.role !== "admin" ? `<p>This area is for admin accounts only. Please sign in using an admin account.</p>` : `<div class="admin-layout"><aside class="admin-menu"><button class="active">AI Wholesale Sourcing</button><button>Product Wall Imports</button><button>Advert Studio</button><button>M-PESA Reconciliation</button><button>Quality Risk Checks</button></aside><div>${renderWholesaleTool()}</div></div>`; }
function renderWholesaleTool(){ const s=suppliers[state.selectedSupplier]; return `<div class="field"><label>Search wholesalers, products, category or location</label><input id="supplierSearch" oninput="renderSupplierSearch()" placeholder="Example: phones wholesalers in Nairobi"></div><div id="supplierResults" class="wholesaler-list" style="margin-top:12px">${suppliers.map((x,i)=>supplierCard(x,i)).join("")}</div><hr style="border:0;border-top:1px solid #eef0f3;margin:16px 0"><h3>${s.name}</h3><p style="color:#6b7280">${s.note}</p><div class="badge green">Reliability ${s.score}%</div> <div class="badge orange">${s.location}</div> <div class="badge">${s.delivery}</div><div class="field" style="max-width:260px;margin-top:12px"><label>Profit percentage</label><input id="profitInput" type="number" value="${state.profit}" oninput="updateProfit(this.value)"></div><div class="catalogue-grid">${s.products.map((p,i)=>catalogueCard(p,i)).join("")}</div>`; }
function supplierCard(s,i){ return `<button class="wholesaler-card" onclick="selectSupplier(${i})"><div><b>${s.name}</b><div class="seller">${s.location} · ${s.categories}</div></div><span class="badge green">${s.score}%</span></button>`; }
function catalogueCard(p,i){ const price=Math.round(p.cost*(1+state.profit/100)); const profit=price-p.cost; const competitive=price <= p.market; return `<article class="catalogue-card"><img src="${AS+p.img}"><div><b>${p.name}</b><div class="seller">Wholesale: ${formatMoney(p.cost)} · Stock ${p.stock}</div><div class="seller">Market avg: ${formatMoney(p.market)}</div><div><span class="badge ${competitive?'green':'red'}">SokoYetu: ${formatMoney(price)}</span> <span class="badge orange">Profit: ${formatMoney(profit)}</span></div><button style="margin-top:8px" class="btn orange small" onclick="importProduct(${i})">Add to SokoYetu Wall</button></div></article>`; }
function renderCartModal(){
  if (!state.user) return `<p>Please sign in as a buyer to use the real database cart.</p><button class="btn orange" onclick="openModal('accountModal')">Sign In or Create Account</button>`;
  if (state.user.role !== "buyer") return `<p>The cart is for buyer accounts. Please sign in as a buyer.</p>`;
  if (!state.cart.length) return `<p>Your cart is empty. Add items from Flash Sales or product sections.</p>`;

  const subtotal=getCartTotal();
  const delivery=subtotal>=10000?0:300;
  const total=subtotal+delivery;

  return `${state.cart.map(item=>`
    <div class="cart-item">
      <img src="${image(item)}">
      <div><b>${item.name}</b><div class="seller">Qty ${item.qty} · ${item.seller}</div></div>
      <div><b>${formatMoney(item.price*item.qty)}</b><br><button class="btn ghost small" onclick="removeFromCart('${item.cartItemId || item.id}')">Remove</button></div>
    </div>`).join("")}
    <div class="cart-summary">
      <div class="summary-line"><span>Subtotal</span><b>${formatMoney(subtotal)}</b></div>
      <div class="summary-line"><span>Delivery</span><b>${delivery===0?'Free':formatMoney(delivery)}</b></div>
      <div class="seller">Free delivery applies above KES 10,000.</div>
      <div class="summary-line total"><span>Total</span><b>${formatMoney(total)}</b></div>
    </div>
    <button style="margin-top:12px;width:100%" class="btn green" onclick="window.location.href='/checkout.html'">Checkout with M-PESA</button>`;
}

function renderDynamicBits() { renderAdBurner(); renderFlashProduct(); updateCountdown(); }
function renderAdBurner(){ const el=document.getElementById('adBurner'); if(!el) return; const list = visibleAds(); const active = state.adIndex % list.length; el.innerHTML = list.map((a,i)=>`<article class="ad-slide ${i===active?'active':''}"><div><div class="ad-kicker">${a.kicker}</div><h1>${a.title}</h1><p>${a.text}</p><div class="ad-cta"><button class="btn orange" onclick="${a.kicker==='Live Now'?"openModal('liveModal')":a.kicker==='AI Buyer Tools'?"openModal('smartModal')":a.kicker==='For Admin'?"openModal('adminModal')":"window.scrollTo({top:360,behavior:'smooth'})"}">${a.cta}</button><button class="btn white" onclick="filterCategory('all')">View Deals</button></div></div><div class="ad-visual">${a.icon}</div></article>`).join('') + `<div class="ad-dots">${list.map((a,i)=>`<span class="ad-dot ${i===active?'active':''}"></span>`).join('')}</div>`; }
function renderFlashProduct(){ const el=document.getElementById('liveFlashProduct'); if(!el) return; const list=allProducts().slice(0,10); const p=list[state.flashIndex % list.length]; el.innerHTML = `<article class="live-product streaming-in"><span class="live-badge">STREAMING DEAL</span><img class="product-img" src="${image(p)}" alt="${p.name}"><div class="live-info"><div class="seller">${p.seller}</div><h3>${p.name}</h3><div class="price-line"><span class="price">${formatMoney(p.price)}</span><span class="old">${formatMoney(p.old)}</span><span class="discount">-${p.discount}%</span></div><div class="stock-wrap"><div class="stock-text">${p.stock} items left</div><div class="stock-track"><div class="stock-bar" style="width:${Math.max(8, Math.min(100,p.stock))}%"></div></div></div><button class="btn orange small" onclick="addToCart('${p.id}')">Add to Cart</button></div></article>`; }
function updateCountdown(){ const target=new Date(); target.setHours(23,59,59,999); const diff=target-Date.now(); const h=Math.floor(diff/36e5); const m=Math.floor(diff%36e5/6e4); const s=Math.floor(diff%6e4/1000); const el=document.getElementById('countdownText'); if(el) el.textContent=`${String(h).padStart(2,'0')}h : ${String(m).padStart(2,'0')}m : ${String(s).padStart(2,'0')}s`; }

async function addToCart(id){
  const p=allProducts().find(x=>String(x.id)===String(id));
  if(!p) return;

  if (!state.user) {
    toast("Please sign in as a buyer to add items to cart.");
    openModal('accountModal');
    return;
  }

  if (state.user.role !== "buyer") {
    toast("Only buyer accounts can add products to cart.");
    return;
  }

  try {
    await apiRequest("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId: p.dbId || Number(p.id), quantity: 1 }),
    });

    await loadCartFromDatabase();
    renderApp();
    toast(`${p.name} added to cart`);
  } catch (error) {
    toast(error.message);
  }
}

async function removeFromCart(id){
  if (!state.user) return;

  try {
    await apiRequest(`/api/cart/${id}`, { method: "DELETE" });
    await loadCartFromDatabase();
    renderApp();
    openModal('cartModal');
    toast("Item removed from cart.");
  } catch (error) {
    toast(error.message);
  }
}
// SokoYetu Stage 20D: Checkout Real STK Push Fix
async function createOrderFromCart(){
  if (!state.user || state.user.role !== "buyer") {
    toast("Please sign in as a buyer first.");
    openModal("accountModal");
    return;
  }

  const phone = document.getElementById("mpesaPhone")?.value?.trim();
  const deliveryAddress = document.getElementById("deliveryAddress")?.value?.trim();

  if (!phone) {
    toast("M-PESA phone number is required.");
    return;
  }

  if (!deliveryAddress) {
    toast("Delivery address is required.");
    return;
  }

  try {
    const data = await apiRequest("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        phone,
        deliveryAddress,
      }),
    });

    const order = data.order || data;
    const orderId = order.id;

    if (!orderId) {
      throw new Error("Order was created, but the order ID was not returned.");
    }

    const mpesaData = await startMpesaPayment(orderId, phone);

    state.cart = [];
    save();

    const total = order.totalAmount ?? order.total ?? order.amount ?? 0;
    const orderResult = document.getElementById("orderResult");

    if (orderResult) {
      orderResult.style.display = "block";
      orderResult.innerHTML = `
        <div class="summary-line">
          <span>Order created</span>
          <b>#${orderId}</b>
        </div>

        <div class="summary-line">
          <span>Total</span>
          <b>${typeof formatMoney === "function" ? formatMoney(total) : total}</b>
        </div>

        <div class="summary-line">
          <span>M-PESA status</span>
          <b>${mpesaData.mode === "demo" ? "Demo STK Prepared" : "STK Push Sent"}</b>
        </div>

        <p class="seller">
          ${mpesaData.mode === "demo"
            ? "Demo M-PESA request prepared successfully. In Daraja mode, the customer receives a real STK Push prompt."
            : "M-PESA STK Push sent. Check the phone, enter the M-PESA PIN, then wait for confirmation."
          }
        </p>

        ${mpesaData.checkoutRequestId ? `
          <p class="seller"><b>Checkout Request ID:</b> ${mpesaData.checkoutRequestId}</p>
        ` : ""}
      `;
    }

    toast(
      mpesaData.mode === "demo"
        ? "Demo M-PESA request prepared successfully."
        : "M-PESA STK Push sent to phone."
    );

    setTimeout(async () => {
      try {
        if (typeof loadCartFromDatabase === "function") {
          await loadCartFromDatabase();
        }

        if (typeof renderApp === "function") {
          renderApp();
        }

/* Stage 20E fixed: old M-PESA demo modal suppressed after real STK Push */
      } catch {}
    }, 1200);
  } catch (error) {
    toast(error.message || "Checkout could not start M-PESA payment.");
  }
}



function toggleWishlist(id){ if(state.wishlist.includes(id)) state.wishlist=state.wishlist.filter(x=>x!==id); else state.wishlist.push(id); save(); toast('Wishlist updated'); }
function setRole(role){
  if (state.user && state.user.role !== role) {
    toast(`You are signed in as ${roleName()}. Sign out to use another role.`);
    return;
  }
  state.role=role;
  save();
  renderApp();
  toast(`Selected ${roleName()} account type`);
}
function openModal(id){ closeModals(); const el=document.getElementById(id); if(el) el.classList.add('open'); }
function closeModals(){ document.querySelectorAll('.modal-backdrop').forEach(m=>m.classList.remove('open')); }
function scrollToTop(){ window.scrollTo({top:0, behavior:'smooth'}); }
function filterCategory(cat){ state.categoryFilter = cat || 'all'; state.searchQuery = ''; renderApp(); toast(cat==='all'||cat==='flash'?'Showing marketplace deals':`Showing ${cat}`); window.scrollTo({top:320, behavior:'smooth'}); }
function focusFlash(id){ const list=allProducts().slice(0,10); const idx=list.findIndex(p=>p.id===id); if(idx>=0){ state.flashIndex=idx; renderFlashProduct(); } }
function searchProducts(e){ e.preventDefault(); const q=document.getElementById('searchInput').value.trim(); state.searchQuery = q; state.categoryFilter = 'all'; renderApp(); toast(q?`Showing results for: ${q}`:'Type a product, brand or category'); if(q) window.scrollTo({top:320, behavior:'smooth'}); }
function clearFilters(){ state.searchQuery=''; state.categoryFilter='all'; renderApp(); toast('Filters cleared'); }
function runSmartAssistant(){ const q=(document.getElementById('aiQuestion')||{}).value || ''; const match=allProducts().filter(p=>q.toLowerCase().split(/\s+/).some(word=>word.length>3 && p.name.toLowerCase().includes(word))).slice(0,3); const rec=match.length?match:allProducts().slice(0,3); document.getElementById('aiAnswer').innerHTML = `<b>AI suggestion:</b> Based on your request, compare these options first:<br>${rec.map(p=>`• ${p.name} — ${formatMoney(p.price)} from ${p.seller}`).join('<br>')}<br><br><span class="seller">This is a front-end demo. Connect a real AI API for live intelligent recommendations.</span>`; }
function selectSupplier(i){ state.selectedSupplier=i; renderApp(); openModal('adminModal'); }
function updateProfit(v){ state.profit=Math.max(0, Number(v||0)); save(); const modal=document.getElementById('adminModal'); if(modal && modal.classList.contains('open')) { modal.innerHTML = modalShell("Admin-only AI Centre", renderAdminModal()); } }
function importProduct(i){ const s=suppliers[state.selectedSupplier]; const p=s.products[i]; const price=Math.round(p.cost*(1+state.profit/100)); const newProduct={id:'w'+Date.now()+i, name:p.name, seller:'SokoYetu Wholesale Wall', category:'Wholesale Import', img:p.img, price, old:p.market, stock:p.stock, rating:4.6, reviews:0, discount:Math.max(1, Math.round((1-price/p.market)*100))}; state.imported.unshift(newProduct); save(); renderApp(); openModal('adminModal'); toast(`${p.name} added to SokoYetu wall`); }
function renderSupplierSearch(){ const q=(document.getElementById('supplierSearch')||{}).value?.toLowerCase() || ''; const html=suppliers.filter(s=>!q || `${s.name} ${s.location} ${s.categories} ${s.note}`.toLowerCase().includes(q)).map((s,i)=>supplierCard(s,i)).join('') || '<p>No matching supplier in demo data.</p>'; document.getElementById('supplierResults').innerHTML=html; }


async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

async function loadCurrentUser() {
  try {
    const data = await apiRequest("/api/auth/me");
    state.user = data.user;
    state.role = data.user.role;
    save();
  } catch (error) {
    state.user = null;
  } finally {
    state.authChecked = true;
  }
}

async function registerAccount() {
  try {
    const payload = {
      name: document.getElementById("authName")?.value.trim(),
      email: document.getElementById("authEmail")?.value.trim(),
      phone: document.getElementById("authPhone")?.value.trim(),
      password: document.getElementById("authPassword")?.value,
      role: state.role || "buyer",
    };

    if (!payload.name || !payload.email || !payload.password) {
      toast("Name, email and password are required.");
      return;
    }

    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    state.user = data.user;
    state.role = data.user.role;
    if (state.user.role === "buyer") {
      await loadCartFromDatabase();
    }
    save();
    renderApp();
    openModal("accountModal");
    toast("Account created successfully.");
  } catch (error) {
    toast(error.message);
  }
}

async function loginAccount() {
  try {
    const email = document.getElementById("authEmail")?.value.trim();
    const password = document.getElementById("authPassword")?.value;

    if (!email || !password) {
      toast("Email and password are required.");
      return;
    }

    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    state.user = data.user;
    state.role = data.user.role;
    if (state.user.role === "buyer") {
      await loadCartFromDatabase();
    }
    save();
    renderApp();
    openModal("accountModal");
    toast("Signed in successfully.");
  } catch (error) {
    toast(error.message);
  }
}

async function logoutAccount() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.warn(error);
  }

  state.user = null;
  state.role = "buyer";
  state.cart = [];
  save();
  renderApp();
  openModal("accountModal");
  toast("Signed out successfully.");
}

document.addEventListener('click', e => { if(e.target.classList.contains('modal-backdrop')) closeModals(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModals(); });

bootstrapApp();
setInterval(()=>{ const list = visibleAds(); state.adIndex=(state.adIndex+1)%list.length; renderAdBurner(); }, 4500);
setInterval(()=>{ const list=allProducts().slice(0,10); state.flashIndex=(state.flashIndex+1)%list.length; renderFlashProduct(); }, 2700);
setInterval(updateCountdown, 1000);



// ================================
// SokoYetu Step 8 Seller Frontend Patch
// Adds visible seller dashboard tools only when the signed-in user role is seller.
// ================================
(function initSokoYetuSellerFrontend() {
  const sellerStyle = document.createElement("style");
  sellerStyle.textContent = `
    .seller-studio-launcher {
      position: fixed;
      right: 18px;
      bottom: 88px;
      z-index: 9998;
      border: none;
      border-radius: 999px;
      padding: 13px 18px;
      background: linear-gradient(135deg, #f97316, #111827);
      color: #fff;
      font-weight: 800;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
      cursor: pointer;
      display: none;
      gap: 8px;
      align-items: center;
    }

    .seller-studio-launcher:hover {
      transform: translateY(-1px);
    }

    .seller-studio-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.58);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }

    .seller-studio-panel {
      width: min(1120px, 96vw);
      max-height: 90vh;
      overflow: auto;
      background: #fffaf4;
      border-radius: 26px;
      box-shadow: 0 30px 80px rgba(15, 23, 42, 0.35);
      border: 1px solid rgba(249, 115, 22, 0.18);
    }

    .seller-studio-head {
      position: sticky;
      top: 0;
      z-index: 2;
      background: linear-gradient(135deg, #111827, #f97316);
      color: white;
      padding: 22px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
    }

    .seller-studio-head h2 {
      margin: 0;
      font-size: 24px;
    }

    .seller-studio-head p {
      margin: 5px 0 0;
      color: rgba(255,255,255,0.82);
    }

    .seller-studio-close {
      border: none;
      background: rgba(255,255,255,0.18);
      color: white;
      border-radius: 14px;
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 800;
    }

    .seller-studio-body {
      padding: 20px;
      display: grid;
      gap: 18px;
    }

    .seller-metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .seller-metric-card, .seller-tool-card {
      background: white;
      border: 1px solid rgba(249, 115, 22, 0.14);
      border-radius: 20px;
      padding: 16px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
    }

    .seller-metric-card span {
      display: block;
      color: #6b7280;
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 7px;
    }

    .seller-metric-card b {
      font-size: 24px;
      color: #111827;
    }

    .seller-grid-two {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 16px;
    }

    .seller-form-grid {
      display: grid;
      gap: 10px;
    }

    .seller-form-grid input, .seller-form-grid textarea, .seller-form-grid select {
      width: 100%;
      border: 1px solid #fed7aa;
      border-radius: 14px;
      padding: 12px;
      font: inherit;
      background: #fff;
    }

    .seller-form-grid textarea {
      min-height: 80px;
      resize: vertical;
    }

    .seller-primary-btn {
      border: none;
      border-radius: 16px;
      background: #f97316;
      color: white;
      padding: 12px 14px;
      font-weight: 900;
      cursor: pointer;
    }

    .seller-secondary-btn {
      border: 1px solid #fed7aa;
      border-radius: 14px;
      background: #fff;
      color: #111827;
      padding: 9px 12px;
      font-weight: 800;
      cursor: pointer;
    }

    .seller-list {
      display: grid;
      gap: 10px;
      max-height: 360px;
      overflow: auto;
      padding-right: 4px;
    }

    .seller-row {
      border: 1px solid rgba(249, 115, 22, 0.14);
      background: #fff;
      border-radius: 16px;
      padding: 12px;
      display: grid;
      gap: 7px;
    }

    .seller-row-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
    }

    .seller-row h4 {
      margin: 0;
      color: #111827;
    }

    .seller-row p {
      margin: 0;
      color: #6b7280;
      font-size: 13px;
      line-height: 1.45;
    }

    .seller-badge {
      display: inline-flex;
      width: fit-content;
      border-radius: 999px;
      padding: 5px 8px;
      background: #fff7ed;
      color: #ea580c;
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .seller-order-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 8px;
    }

    .seller-empty {
      border: 1px dashed #fed7aa;
      border-radius: 18px;
      padding: 16px;
      color: #6b7280;
      background: #fff7ed;
      font-weight: 700;
    }

    @media (max-width: 860px) {
      .seller-metrics, .seller-grid-two {
        grid-template-columns: 1fr;
      }

      .seller-studio-launcher {
        bottom: 72px;
        right: 12px;
      }
    }
  `;
  document.head.appendChild(sellerStyle);

  function money(value) {
    return "KES " + Number(value || 0).toLocaleString("en-KE");
  }

  async function sellerApi(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Seller request failed.");
    }

    return data;
  }

  async function getSignedInUser() {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  function ensureSellerElements() {
    if (!document.getElementById("sellerStudioLauncher")) {
      const launcher = document.createElement("button");
      launcher.id = "sellerStudioLauncher";
      launcher.className = "seller-studio-launcher";
      launcher.innerHTML = "🏪 Seller Studio";
      launcher.addEventListener("click", openSellerStudio);
      document.body.appendChild(launcher);
    }

    if (!document.getElementById("sellerStudioBackdrop")) {
      const backdrop = document.createElement("div");
      backdrop.id = "sellerStudioBackdrop";
      backdrop.className = "seller-studio-backdrop";
      backdrop.innerHTML = `
        <section class="seller-studio-panel">
          <div class="seller-studio-head">
            <div>
              <h2>Seller Studio</h2>
              <p>Manage your products, orders, stock and live-selling readiness from one place.</p>
            </div>
            <button class="seller-studio-close" id="sellerStudioClose">Close</button>
          </div>

          <div class="seller-studio-body">
            <div class="seller-metrics" id="sellerMetrics"></div>

            <div class="seller-grid-two">
              <div class="seller-tool-card">
                <h3>Add New Product</h3>
                <p style="color:#6b7280;font-weight:700;">Create a real product saved under your seller account.</p>
                <form id="sellerProductForm" class="seller-form-grid">
                  <input name="name" placeholder="Product name" required />
                  <textarea name="description" placeholder="Product description" required></textarea>
                  <select name="category" required>
                    <option value="">Select category</option>
                    <option>Electronics</option>
                    <option>Phones & Tablets</option>
                    <option>Computing</option>
                    <option>Fashion</option>
                    <option>Beauty & Health</option>
                    <option>Groceries</option>
                    <option>Home & Garden</option>
                    <option>Sports</option>
                    <option>Books</option>
                    <option>Baby & Kids</option>
                    <option>Automotive</option>
                    <option>Tools & Hardware</option>
                  </select>
                  <input name="price" type="number" min="1" placeholder="Selling price, for example 3500" required />
                  <input name="oldPrice" type="number" min="1" placeholder="Old price, optional" />
                  <input name="stock" type="number" min="0" placeholder="Stock quantity" required />
                  <input name="imageUrl" placeholder="Image URL, optional for now" />
                  <button class="seller-primary-btn" type="submit">Save Product</button>
                </form>
              </div>

              <div class="seller-tool-card">
                <h3>Your Products</h3>
                <div id="sellerProductsList" class="seller-list"></div>
              </div>
            </div>

            <div class="seller-tool-card">
              <h3>Orders Containing Your Products</h3>
              <div id="sellerOrdersList" class="seller-list"></div>
            </div>
          </div>
        </section>
      `;
      document.body.appendChild(backdrop);

      document.getElementById("sellerStudioClose").addEventListener("click", closeSellerStudio);
      document.getElementById("sellerProductForm").addEventListener("submit", createSellerProductFromFrontend);
    }
  }

  async function refreshSellerLauncher() {
    ensureSellerElements();

    const user = await getSignedInUser();
    const launcher = document.getElementById("sellerStudioLauncher");

    if (user && user.role === "seller") {
      launcher.style.display = "inline-flex";
    } else {
      launcher.style.display = "none";
      closeSellerStudio();
    }
  }

  async function openSellerStudio() {
    ensureSellerElements();
    document.getElementById("sellerStudioBackdrop").style.display = "flex";
    await loadSellerDashboardFrontend();
  }

  function closeSellerStudio() {
    const backdrop = document.getElementById("sellerStudioBackdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  async function loadSellerDashboardFrontend() {
    const metricsEl = document.getElementById("sellerMetrics");
    const productsEl = document.getElementById("sellerProductsList");
    const ordersEl = document.getElementById("sellerOrdersList");

    metricsEl.innerHTML = "<div class='seller-empty'>Loading seller dashboard...</div>";
    productsEl.innerHTML = "";
    ordersEl.innerHTML = "";

    try {
      const data = await sellerApi("/api/seller/dashboard-data");

      const metrics = data.metrics || {};
      metricsEl.innerHTML = `
        <div class="seller-metric-card"><span>Active Products</span><b>${metrics.activeProducts || 0}</b></div>
        <div class="seller-metric-card"><span>Total Orders</span><b>${metrics.totalOrders || 0}</b></div>
        <div class="seller-metric-card"><span>Pending Orders</span><b>${metrics.pendingOrders || 0}</b></div>
        <div class="seller-metric-card"><span>Seller Revenue</span><b>${money(metrics.sellerRevenue || 0)}</b></div>
      `;

      if (!data.products || data.products.length === 0) {
        productsEl.innerHTML = "<div class='seller-empty'>No products yet. Add your first product on the left.</div>";
      } else {
        productsEl.innerHTML = data.products.map((product) => `
          <div class="seller-row">
            <div class="seller-row-top">
              <div>
                <h4>${product.name}</h4>
                <p>${product.category} · Stock: ${product.stock}</p>
              </div>
              <span class="seller-badge">${money(product.price)}</span>
            </div>
            <p>${product.description}</p>
          </div>
        `).join("");
      }

      if (!data.orders || data.orders.length === 0) {
        ordersEl.innerHTML = "<div class='seller-empty'>No buyer orders yet for your products.</div>";
      } else {
        ordersEl.innerHTML = data.orders.map((order) => {
          const items = (order.items || []).map((item) => `${item.product.name} × ${item.quantity}`).join(", ");
          return `
            <div class="seller-row">
              <div class="seller-row-top">
                <div>
                  <h4>Order #${order.id}</h4>
                  <p>Buyer: ${order.user?.name || "Buyer"} · ${order.phone || order.user?.phone || ""}</p>
                  <p>Items: ${items}</p>
                  <p>Payment: ${order.paymentStatus} · Order: ${order.orderStatus}</p>
                </div>
                <span class="seller-badge">${money(order.totalAmount)}</span>
              </div>
              <div class="seller-order-actions">
                <button class="seller-secondary-btn" data-seller-order="${order.id}" data-status="SELLER_PREPARING_ITEM">Preparing</button>
                <button class="seller-secondary-btn" data-seller-order="${order.id}" data-status="DISPATCHED">Dispatched</button>
                <button class="seller-secondary-btn" data-seller-order="${order.id}" data-status="OUT_FOR_DELIVERY">Out for Delivery</button>
                <button class="seller-secondary-btn" data-seller-order="${order.id}" data-status="DELIVERED">Delivered</button>
              </div>
            </div>
          `;
        }).join("");

        ordersEl.querySelectorAll("[data-seller-order]").forEach((button) => {
          button.addEventListener("click", async () => {
            await updateSellerOrderFromFrontend(button.dataset.sellerOrder, button.dataset.status);
          });
        });
      }
    } catch (error) {
      metricsEl.innerHTML = `<div class="seller-empty">${error.message}</div>`;
    }
  }

  async function createSellerProductFromFrontend(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      oldPrice: formData.get("oldPrice") ? Number(formData.get("oldPrice")) : null,
      stock: Number(formData.get("stock") || 0),
      imageUrl: formData.get("imageUrl") || "",
    };

    try {
      await sellerApi("/api/seller/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      form.reset();
      alert("Product saved successfully.");
      await loadSellerDashboardFrontend();

      if (typeof loadProductsFromDatabase === "function") {
        await loadProductsFromDatabase();
      }

      if (typeof renderApp === "function") {
        renderApp();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateSellerOrderFromFrontend(orderId, status) {
    try {
      await sellerApi(`/api/seller/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          note: "Updated from Seller Studio.",
        }),
      });

      alert("Order status updated.");
      await loadSellerDashboardFrontend();
    } catch (error) {
      alert(error.message);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(refreshSellerLauncher, 700);
    setTimeout(refreshSellerLauncher, 2000);
  });

  window.addEventListener("focus", refreshSellerLauncher);
  window.sokoyetuRefreshSellerLauncher = refreshSellerLauncher;
})();



// ================================
// SokoYetu Step 9 Admin Frontend Patch
// Adds visible Admin Control Centre only for signed-in admins.
// ================================
(function initSokoYetuAdminFrontend() {
  const adminStyle = document.createElement("style");
  adminStyle.textContent = `
    .admin-centre-launcher {
      position: fixed;
      right: 18px;
      bottom: 142px;
      z-index: 9998;
      border: none;
      border-radius: 999px;
      padding: 13px 18px;
      background: linear-gradient(135deg, #111827, #0ea5e9);
      color: #fff;
      font-weight: 900;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
      cursor: pointer;
      display: none;
      gap: 8px;
      align-items: center;
    }

    .admin-centre-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.62);
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }

    .admin-centre-panel {
      width: min(1240px, 97vw);
      max-height: 92vh;
      overflow: auto;
      background: #f8fafc;
      border-radius: 26px;
      box-shadow: 0 30px 90px rgba(15, 23, 42, 0.36);
      border: 1px solid rgba(14, 165, 233, 0.18);
    }

    .admin-centre-head {
      position: sticky;
      top: 0;
      z-index: 2;
      background: linear-gradient(135deg, #020617, #0ea5e9);
      color: white;
      padding: 22px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
    }

    .admin-centre-head h2 {
      margin: 0;
      font-size: 24px;
    }

    .admin-centre-head p {
      margin: 5px 0 0;
      color: rgba(255,255,255,0.82);
    }

    .admin-centre-close {
      border: none;
      background: rgba(255,255,255,0.18);
      color: white;
      border-radius: 14px;
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 900;
    }

    .admin-centre-body {
      padding: 20px;
      display: grid;
      gap: 18px;
    }

    .admin-metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .admin-card {
      background: white;
      border: 1px solid rgba(14, 165, 233, 0.16);
      border-radius: 20px;
      padding: 16px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
    }

    .admin-card h3 {
      margin: 0 0 10px;
      color: #0f172a;
    }

    .admin-metric-card span {
      display: block;
      color: #64748b;
      font-weight: 800;
      font-size: 13px;
      margin-bottom: 7px;
    }

    .admin-metric-card b {
      font-size: 24px;
      color: #0f172a;
    }

    .admin-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .admin-tab {
      border: 1px solid #bae6fd;
      background: #fff;
      color: #0f172a;
      border-radius: 999px;
      padding: 10px 13px;
      cursor: pointer;
      font-weight: 900;
    }

    .admin-tab.active {
      background: #0284c7;
      color: #fff;
      border-color: #0284c7;
    }

    .admin-grid-two {
      display: grid;
      grid-template-columns: 0.95fr 1.05fr;
      gap: 16px;
    }

    .admin-form {
      display: grid;
      gap: 10px;
    }

    .admin-form input, .admin-form textarea, .admin-form select {
      width: 100%;
      border: 1px solid #bae6fd;
      border-radius: 14px;
      padding: 12px;
      font: inherit;
      background: #fff;
    }

    .admin-form textarea {
      min-height: 80px;
      resize: vertical;
    }

    .admin-primary-btn {
      border: none;
      border-radius: 16px;
      background: #0284c7;
      color: white;
      padding: 12px 14px;
      font-weight: 900;
      cursor: pointer;
    }

    .admin-secondary-btn {
      border: 1px solid #bae6fd;
      border-radius: 14px;
      background: #fff;
      color: #0f172a;
      padding: 9px 12px;
      font-weight: 800;
      cursor: pointer;
    }

    .admin-list {
      display: grid;
      gap: 10px;
      max-height: 420px;
      overflow: auto;
      padding-right: 4px;
    }

    .admin-row {
      border: 1px solid rgba(14, 165, 233, 0.16);
      background: #fff;
      border-radius: 16px;
      padding: 12px;
      display: grid;
      gap: 8px;
    }

    .admin-row-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .admin-row h4 {
      margin: 0;
      color: #0f172a;
    }

    .admin-row p {
      margin: 0;
      color: #64748b;
      font-size: 13px;
      line-height: 1.45;
    }

    .admin-badge {
      display: inline-flex;
      width: fit-content;
      border-radius: 999px;
      padding: 5px 8px;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .admin-empty {
      border: 1px dashed #bae6fd;
      border-radius: 18px;
      padding: 16px;
      color: #64748b;
      background: #f0f9ff;
      font-weight: 800;
    }

    .admin-section {
      display: none;
    }

    .admin-section.active {
      display: block;
    }

    @media (max-width: 900px) {
      .admin-metrics, .admin-grid-two {
        grid-template-columns: 1fr;
      }

      .admin-centre-launcher {
        bottom: 128px;
        right: 12px;
      }
    }
  `;
  document.head.appendChild(adminStyle);

  function adminMoney(value) {
    return "KES " + Number(value || 0).toLocaleString("en-KE");
  }

  async function adminApi(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Admin request failed.");
    }

    return data;
  }

  async function getAdminSignedInUser() {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  function ensureAdminElements() {
    if (!document.getElementById("adminCentreLauncher")) {
      const launcher = document.createElement("button");
      launcher.id = "adminCentreLauncher";
      launcher.className = "admin-centre-launcher";
      launcher.innerHTML = "🛡️ Admin Centre";
      launcher.addEventListener("click", openAdminCentre);
      document.body.appendChild(launcher);
    }

    if (!document.getElementById("adminCentreBackdrop")) {
      const backdrop = document.createElement("div");
      backdrop.id = "adminCentreBackdrop";
      backdrop.className = "admin-centre-backdrop";
      backdrop.innerHTML = `
        <section class="admin-centre-panel">
          <div class="admin-centre-head">
            <div>
              <h2>SokoYetu Admin Control Centre</h2>
              <p>Monitor users, sellers, products, orders, payments, wholesalers and imported product pricing.</p>
            </div>
            <button class="admin-centre-close" id="adminCentreClose">Close</button>
          </div>

          <div class="admin-centre-body">
            <div class="admin-metrics" id="adminMetrics"></div>

            <div class="admin-tabs">
              <button class="admin-tab active" data-admin-tab="overview">Overview</button>
              <button class="admin-tab" data-admin-tab="users">Users</button>
              <button class="admin-tab" data-admin-tab="products">Products</button>
              <button class="admin-tab" data-admin-tab="orders">Orders</button>
              <button class="admin-tab" data-admin-tab="wholesale">Wholesale AI Sourcing</button>
            </div>

            <div id="adminOverview" class="admin-section active"></div>
            <div id="adminUsers" class="admin-section"></div>
            <div id="adminProducts" class="admin-section"></div>
            <div id="adminOrders" class="admin-section"></div>

            <div id="adminWholesale" class="admin-section">
              <div class="admin-grid-two">
                <div class="admin-card">
                  <h3>Add Wholesaler</h3>
                  <form id="adminWholesalerForm" class="admin-form">
                    <input name="name" placeholder="Wholesaler name" required />
                    <input name="location" placeholder="Location, for example Luthuli Avenue, Nairobi" required />
                    <input name="phone" placeholder="Phone number" />
                    <input name="email" placeholder="Email address" />
                    <input name="category" placeholder="Main category, for example Electronics" required />
                    <input name="score" type="number" min="1" max="100" placeholder="Supplier score, for example 90" />
                    <button class="admin-primary-btn" type="submit">Save Wholesaler</button>
                  </form>
                </div>

                <div class="admin-card">
                  <h3>Add Product to Selected Wholesaler</h3>
                  <form id="adminWholesaleProductForm" class="admin-form">
                    <select name="wholesalerId" id="adminWholesalerSelect" required></select>
                    <input name="name" placeholder="Wholesale product name" required />
                    <input name="category" placeholder="Category" required />
                    <input name="wholesalePrice" type="number" min="1" placeholder="Wholesale cost" required />
                    <input name="marketPrice" type="number" min="1" placeholder="Estimated Kenyan market price" required />
                    <input name="stock" type="number" min="0" placeholder="Available stock" />
                    <input name="imageUrl" placeholder="Image URL, optional" />
                    <textarea name="notes" placeholder="Product notes or AI-generated selling description"></textarea>
                    <button class="admin-primary-btn" type="submit">Save Wholesale Product</button>
                  </form>
                </div>
              </div>

              <div class="admin-card">
                <h3>Wholesalers and Importable Products</h3>
                <div id="adminWholesalersList" class="admin-list"></div>
              </div>
            </div>
          </div>
        </section>
      `;

      document.body.appendChild(backdrop);

      document.getElementById("adminCentreClose").addEventListener("click", closeAdminCentre);
      document.getElementById("adminWholesalerForm").addEventListener("submit", createAdminWholesaler);
      document.getElementById("adminWholesaleProductForm").addEventListener("submit", createAdminWholesaleProduct);

      document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
        tab.addEventListener("click", () => activateAdminTab(tab.dataset.adminTab));
      });
    }
  }

  function activateAdminTab(name) {
    document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.adminTab === name);
    });

    const map = {
      overview: "adminOverview",
      users: "adminUsers",
      products: "adminProducts",
      orders: "adminOrders",
      wholesale: "adminWholesale",
    };

    Object.values(map).forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.classList.remove("active");
    });

    const selected = document.getElementById(map[name]);
    if (selected) selected.classList.add("active");
  }

  async function refreshAdminLauncher() {
    ensureAdminElements();

    const user = await getAdminSignedInUser();
    const launcher = document.getElementById("adminCentreLauncher");

    if (user && user.role === "admin") {
      launcher.style.display = "inline-flex";
    } else {
      launcher.style.display = "none";
      closeAdminCentre();
    }
  }

  async function openAdminCentre() {
    ensureAdminElements();
    document.getElementById("adminCentreBackdrop").style.display = "flex";
    await loadAdminDashboardFrontend();
  }

  function closeAdminCentre() {
    const backdrop = document.getElementById("adminCentreBackdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  async function loadAdminDashboardFrontend() {
    const metricsEl = document.getElementById("adminMetrics");
    metricsEl.innerHTML = "<div class='admin-empty'>Loading admin dashboard...</div>";

    try {
      const data = await adminApi("/api/admin/dashboard-data");
      window.sokoyetuAdminData = data;

      const m = data.metrics || {};

      metricsEl.innerHTML = `
        <div class="admin-card admin-metric-card"><span>Total Users</span><b>${m.totalUsers || 0}</b></div>
        <div class="admin-card admin-metric-card"><span>Total Products</span><b>${m.totalProducts || 0}</b></div>
        <div class="admin-card admin-metric-card"><span>Total Orders</span><b>${m.totalOrders || 0}</b></div>
        <div class="admin-card admin-metric-card"><span>Pending Revenue</span><b>${adminMoney(m.pendingRevenue || 0)}</b></div>
      `;

      renderAdminOverview(data);
      renderAdminUsers(data.users || []);
      renderAdminProducts(data.products || []);
      renderAdminOrders(data.orders || []);
      renderAdminWholesalers(data.wholesalers || []);
    } catch (error) {
      metricsEl.innerHTML = `<div class="admin-empty">${error.message}</div>`;
    }
  }

  function renderAdminOverview(data) {
    const m = data.metrics || {};
    document.getElementById("adminOverview").innerHTML = `
      <div class="admin-grid-two">
        <div class="admin-card">
          <h3>Marketplace Snapshot</h3>
          <div class="admin-list">
            <div class="admin-row"><p>Buyers: <b>${m.buyers || 0}</b></p></div>
            <div class="admin-row"><p>Sellers: <b>${m.sellers || 0}</b></p></div>
            <div class="admin-row"><p>Admins: <b>${m.admins || 0}</b></p></div>
            <div class="admin-row"><p>Imported Products: <b>${m.importedProducts || 0}</b></p></div>
            <div class="admin-row"><p>Low Stock Products: <b>${m.lowStockCount || 0}</b></p></div>
          </div>
        </div>

        <div class="admin-card">
          <h3>Payment and Order Status</h3>
          <div class="admin-list">
            <div class="admin-row"><p>Paid Orders: <b>${m.paidOrders || 0}</b></p></div>
            <div class="admin-row"><p>Pending Orders: <b>${m.pendingOrders || 0}</b></p></div>
            <div class="admin-row"><p>Paid Revenue: <b>${adminMoney(m.paidRevenue || 0)}</b></p></div>
            <div class="admin-row"><p>Pending Revenue: <b>${adminMoney(m.pendingRevenue || 0)}</b></p></div>
            <div class="admin-row"><p>Wholesalers: <b>${m.wholesalers || 0}</b></p></div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAdminUsers(users) {
    const el = document.getElementById("adminUsers");

    if (!users.length) {
      el.innerHTML = "<div class='admin-empty'>No users found.</div>";
      return;
    }

    el.innerHTML = `
      <div class="admin-card">
        <h3>Users and Roles</h3>
        <div class="admin-list">
          ${users.map((user) => `
            <div class="admin-row">
              <div class="admin-row-top">
                <div>
                  <h4>${user.name}</h4>
                  <p>${user.email} · ${user.phone || "No phone"}</p>
                </div>
                <span class="admin-badge">${user.role}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderAdminProducts(products) {
    const el = document.getElementById("adminProducts");

    if (!products.length) {
      el.innerHTML = "<div class='admin-empty'>No products found.</div>";
      return;
    }

    el.innerHTML = `
      <div class="admin-card">
        <h3>Products</h3>
        <div class="admin-list">
          ${products.map((product) => `
            <div class="admin-row">
              <div class="admin-row-top">
                <div>
                  <h4>${product.name}</h4>
                  <p>${product.category} · Stock: ${product.stock}</p>
                  <p>Seller: ${product.seller?.name || (product.importedByAdmin ? "SokoYetu Admin Import" : "SokoYetu")}</p>
                </div>
                <span class="admin-badge">${adminMoney(product.price)}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderAdminOrders(orders) {
    const el = document.getElementById("adminOrders");

    if (!orders.length) {
      el.innerHTML = "<div class='admin-empty'>No orders found.</div>";
      return;
    }

    el.innerHTML = `
      <div class="admin-card">
        <h3>Orders and Payments</h3>
        <div class="admin-list">
          ${orders.map((order) => `
            <div class="admin-row">
              <div class="admin-row-top">
                <div>
                  <h4>Order #${order.id}</h4>
                  <p>Buyer: ${order.user?.name || "Buyer"} · ${order.phone || ""}</p>
                  <p>Payment: ${order.paymentStatus} · Order: ${order.orderStatus}</p>
                  <p>Items: ${(order.items || []).map((item) => item.product.name + " × " + item.quantity).join(", ")}</p>
                </div>
                <span class="admin-badge">${adminMoney(order.totalAmount)}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderAdminWholesalers(wholesalers) {
    const listEl = document.getElementById("adminWholesalersList");
    const selectEl = document.getElementById("adminWholesalerSelect");

    selectEl.innerHTML = wholesalers.length
      ? wholesalers.map((w) => `<option value="${w.id}">${w.name} — ${w.category}</option>`).join("")
      : "<option value=''>No wholesalers yet</option>";

    if (!wholesalers.length) {
      listEl.innerHTML = "<div class='admin-empty'>No wholesalers yet. Add your first wholesaler above.</div>";
      return;
    }

    listEl.innerHTML = wholesalers.map((w) => `
      <div class="admin-row">
        <div class="admin-row-top">
          <div>
            <h4>${w.name}</h4>
            <p>${w.location} · ${w.category}</p>
            <p>Score: ${w.score}/100 · ${w.phone || "No phone"}</p>
          </div>
          <span class="admin-badge">${(w.products || []).length} products</span>
        </div>

        <div class="admin-list">
          ${(w.products || []).length ? (w.products || []).map((p) => `
            <div class="admin-row">
              <div class="admin-row-top">
                <div>
                  <h4>${p.name}</h4>
                  <p>Wholesale: ${adminMoney(p.wholesalePrice)} · Market: ${adminMoney(p.marketPrice)} · Stock: ${p.stock}</p>
                  <p>${p.notes || ""}</p>
                </div>
                <div style="display:grid; gap:6px; min-width:130px;">
                  <input id="profit-${p.id}" type="number" value="20" min="1" max="100" style="border:1px solid #bae6fd;border-radius:12px;padding:8px;" />
                  <button class="admin-secondary-btn" data-import-wholesale="${p.id}">Import + Profit %</button>
                </div>
              </div>
            </div>
          `).join("") : "<div class='admin-empty'>No products under this wholesaler yet.</div>"}
        </div>
      </div>
    `).join("");

    listEl.querySelectorAll("[data-import-wholesale]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.importWholesale;
        const profitPercent = Number(document.getElementById("profit-" + id)?.value || 20);
        await importWholesaleProductFrontend(id, profitPercent);
      });
    });
  }

  async function createAdminWholesaler(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      location: formData.get("location"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      category: formData.get("category"),
      score: formData.get("score") ? Number(formData.get("score")) : 80,
    };

    try {
      await adminApi("/api/admin/wholesalers", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      form.reset();
      alert("Wholesaler saved successfully.");
      await loadAdminDashboardFrontend();
      activateAdminTab("wholesale");
    } catch (error) {
      alert(error.message);
    }
  }

  async function createAdminWholesaleProduct(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const wholesalerId = formData.get("wholesalerId");

    if (!wholesalerId) {
      alert("Select a wholesaler first.");
      return;
    }

    const payload = {
      name: formData.get("name"),
      category: formData.get("category"),
      wholesalePrice: Number(formData.get("wholesalePrice")),
      marketPrice: Number(formData.get("marketPrice")),
      stock: Number(formData.get("stock") || 0),
      imageUrl: formData.get("imageUrl") || "",
      notes: formData.get("notes") || "",
    };

    try {
      await adminApi(`/api/admin/wholesalers/${wholesalerId}/products`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      form.reset();
      alert("Wholesale product saved successfully.");
      await loadAdminDashboardFrontend();
      activateAdminTab("wholesale");
    } catch (error) {
      alert(error.message);
    }
  }

  async function importWholesaleProductFrontend(wholesalerProductId, profitPercent) {
    try {
      const data = await adminApi("/api/admin/import-wholesale-product", {
        method: "POST",
        body: JSON.stringify({
          wholesalerProductId: Number(wholesalerProductId),
          profitPercent: Number(profitPercent),
        }),
      });

      alert(
        "Imported to SokoYetu wall. Selling price: " +
        adminMoney(data.pricing.sellingPrice) +
        ". Competitive: " +
        (data.pricing.isCompetitive ? "Yes" : "No")
      );

      await loadAdminDashboardFrontend();

      if (typeof loadProductsFromDatabase === "function") {
        await loadProductsFromDatabase();
      }

      if (typeof renderApp === "function") {
        renderApp();
      }

      activateAdminTab("wholesale");
    } catch (error) {
      alert(error.message);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(refreshAdminLauncher, 900);
    setTimeout(refreshAdminLauncher, 2200);
  });

  window.addEventListener("focus", refreshAdminLauncher);
  window.sokoyetuRefreshAdminLauncher = refreshAdminLauncher;
})();



// ================================
// SokoYetu Step 10 Product Image Frontend Patch
// Adds image upload helper and enhances seller/admin product image workflow.
// ================================
(function initSokoYetuImageUploadPatch() {
  async function uploadProductImageFromInput(fileInput) {
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      return "";
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    const response = await fetch("/api/uploads/product-image", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not upload product image.");
    }

    return data.imageUrl;
  }

  function addImageInputsToSellerAndAdminForms() {
    const sellerForm = document.getElementById("sellerProductForm");

    if (sellerForm && !sellerForm.querySelector("[name='productImageFile']")) {
      const imageUrlInput = sellerForm.querySelector("[name='imageUrl']");

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.name = "productImageFile";
      fileInput.accept = "image/png,image/jpeg,image/webp,image/gif";
      fileInput.title = "Upload product image";

      if (imageUrlInput) {
        imageUrlInput.insertAdjacentElement("beforebegin", fileInput);
        imageUrlInput.placeholder = "Image URL will appear here after upload, or paste your own image URL";
      } else {
        sellerForm.insertBefore(fileInput, sellerForm.querySelector("button"));
      }
    }

    const adminWholesaleProductForm = document.getElementById("adminWholesaleProductForm");

    if (adminWholesaleProductForm && !adminWholesaleProductForm.querySelector("[name='productImageFile']")) {
      const imageUrlInput = adminWholesaleProductForm.querySelector("[name='imageUrl']");

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.name = "productImageFile";
      fileInput.accept = "image/png,image/jpeg,image/webp,image/gif";
      fileInput.title = "Upload wholesale product image";

      if (imageUrlInput) {
        imageUrlInput.insertAdjacentElement("beforebegin", fileInput);
        imageUrlInput.placeholder = "Image URL will appear here after upload, or paste your own image URL";
      } else {
        adminWholesaleProductForm.insertBefore(fileInput, adminWholesaleProductForm.querySelector("button"));
      }
    }
  }

  async function interceptSellerProductForm(event) {
    const form = event.target;

    if (!form || form.id !== "sellerProductForm") return;

    const fileInput = form.querySelector("[name='productImageFile']");
    const imageUrlInput = form.querySelector("[name='imageUrl']");

    if (fileInput && fileInput.files && fileInput.files[0] && imageUrlInput && !imageUrlInput.value) {
      try {
        const imageUrl = await uploadProductImageFromInput(fileInput);
        imageUrlInput.value = imageUrl;
      } catch (error) {
        event.preventDefault();
        event.stopImmediatePropagation();
        alert(error.message);
      }
    }
  }

  async function interceptAdminWholesaleProductForm(event) {
    const form = event.target;

    if (!form || form.id !== "adminWholesaleProductForm") return;

    const fileInput = form.querySelector("[name='productImageFile']");
    const imageUrlInput = form.querySelector("[name='imageUrl']");

    if (fileInput && fileInput.files && fileInput.files[0] && imageUrlInput && !imageUrlInput.value) {
      try {
        const imageUrl = await uploadProductImageFromInput(fileInput);
        imageUrlInput.value = imageUrl;
      } catch (error) {
        event.preventDefault();
        event.stopImmediatePropagation();
        alert(error.message);
      }
    }
  }

  document.addEventListener("submit", interceptSellerProductForm, true);
  document.addEventListener("submit", interceptAdminWholesaleProductForm, true);

  document.addEventListener("click", () => {
    setTimeout(addImageInputsToSellerAndAdminForms, 300);
    setTimeout(addImageInputsToSellerAndAdminForms, 1000);
  });

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(addImageInputsToSellerAndAdminForms, 1000);
    setTimeout(addImageInputsToSellerAndAdminForms, 2500);
  });

  window.sokoyetuAddImageInputs = addImageInputsToSellerAndAdminForms;
})();



// ================================
// SokoYetu Step 11 Delivery Tracking Frontend Patch
// Adds buyer order tracking panel and timeline view.
// ================================
(function initSokoYetuTrackingFrontend() {
  const trackingStyle = document.createElement("style");
  trackingStyle.textContent = `
    .tracking-launcher {
      position: fixed;
      left: 18px;
      bottom: 88px;
      z-index: 9998;
      border: none;
      border-radius: 999px;
      padding: 13px 18px;
      background: linear-gradient(135deg, #16a34a, #0f172a);
      color: #fff;
      font-weight: 900;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
      cursor: pointer;
      display: none;
      align-items: center;
      gap: 8px;
    }

    .tracking-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.62);
      z-index: 10001;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }

    .tracking-panel {
      width: min(1040px, 96vw);
      max-height: 90vh;
      overflow: auto;
      background: #f8fafc;
      border-radius: 26px;
      box-shadow: 0 30px 90px rgba(15, 23, 42, 0.35);
      border: 1px solid rgba(34, 197, 94, 0.18);
    }

    .tracking-head {
      position: sticky;
      top: 0;
      z-index: 2;
      background: linear-gradient(135deg, #052e16, #16a34a);
      color: #fff;
      padding: 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .tracking-head h2 {
      margin: 0;
      font-size: 24px;
    }

    .tracking-head p {
      margin: 5px 0 0;
      color: rgba(255,255,255,0.84);
    }

    .tracking-close {
      border: none;
      background: rgba(255,255,255,0.18);
      color: white;
      border-radius: 14px;
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 900;
    }

    .tracking-body {
      padding: 20px;
      display: grid;
      gap: 14px;
    }

    .tracking-order {
      background: white;
      border: 1px solid rgba(34, 197, 94, 0.18);
      border-radius: 20px;
      padding: 16px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
      display: grid;
      gap: 12px;
    }

    .tracking-order-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .tracking-order h3 {
      margin: 0;
      color: #0f172a;
    }

    .tracking-order p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
      line-height: 1.45;
    }

    .tracking-badge {
      display: inline-flex;
      width: fit-content;
      border-radius: 999px;
      padding: 6px 9px;
      background: #dcfce7;
      color: #166534;
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .tracking-timeline {
      display: grid;
      gap: 8px;
      padding-left: 4px;
    }

    .tracking-step {
      display: grid;
      grid-template-columns: 20px 1fr;
      gap: 10px;
      align-items: start;
    }

    .tracking-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #16a34a;
      margin-top: 4px;
      box-shadow: 0 0 0 4px #dcfce7;
    }

    .tracking-step-card {
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      background: #f0fdf4;
      padding: 10px;
    }

    .tracking-step-card b {
      color: #14532d;
    }

    .tracking-empty {
      border: 1px dashed #bbf7d0;
      border-radius: 18px;
      padding: 16px;
      color: #64748b;
      background: #f0fdf4;
      font-weight: 800;
    }

    @media (max-width: 860px) {
      .tracking-order-top {
        display: grid;
      }

      .tracking-launcher {
        left: 12px;
        bottom: 72px;
      }
    }
  `;

  document.head.appendChild(trackingStyle);

  function trackingMoney(value) {
    return "KES " + Number(value || 0).toLocaleString("en-KE");
  }

  async function trackingApi(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Tracking request failed.");
    }

    return data;
  }

  async function getTrackingSignedInUser() {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  function ensureTrackingElements() {
    if (!document.getElementById("trackingLauncher")) {
      const launcher = document.createElement("button");
      launcher.id = "trackingLauncher";
      launcher.className = "tracking-launcher";
      launcher.innerHTML = "📦 Track Orders";
      launcher.addEventListener("click", openTrackingPanel);
      document.body.appendChild(launcher);
    }

    if (!document.getElementById("trackingBackdrop")) {
      const backdrop = document.createElement("div");
      backdrop.id = "trackingBackdrop";
      backdrop.className = "tracking-backdrop";
      backdrop.innerHTML = `
        <section class="tracking-panel">
          <div class="tracking-head">
            <div>
              <h2>Track Your Orders</h2>
              <p>Follow payment, preparation, dispatch, delivery and completion updates.</p>
            </div>
            <button class="tracking-close" id="trackingClose">Close</button>
          </div>

          <div class="tracking-body" id="trackingOrdersBody">
            <div class="tracking-empty">Loading your orders...</div>
          </div>
        </section>
      `;

      document.body.appendChild(backdrop);
      document.getElementById("trackingClose").addEventListener("click", closeTrackingPanel);
    }
  }

  async function refreshTrackingLauncher() {
    ensureTrackingElements();

    const user = await getTrackingSignedInUser();
    const launcher = document.getElementById("trackingLauncher");

    if (user && user.role === "buyer") {
      launcher.style.display = "inline-flex";
    } else {
      launcher.style.display = "none";
      closeTrackingPanel();
    }
  }

  async function openTrackingPanel() {
    ensureTrackingElements();
    document.getElementById("trackingBackdrop").style.display = "flex";
    await loadBuyerTrackingOrders();
  }

  function closeTrackingPanel() {
    const backdrop = document.getElementById("trackingBackdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  function formatTrackingDate(value) {
    if (!value) return "";
    try {
      return new Date(value).toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return value;
    }
  }

  function renderTrackingTimeline(tracking) {
    if (!tracking || tracking.length === 0) {
      return "<div class='tracking-empty'>No tracking updates yet.</div>";
    }

    return `
      <div class="tracking-timeline">
        ${tracking.map((step) => `
          <div class="tracking-step">
            <div class="tracking-dot"></div>
            <div class="tracking-step-card">
              <b>${step.status}</b>
              <p>${step.note || ""}</p>
              <p>${formatTrackingDate(step.createdAt)}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  async function loadBuyerTrackingOrders() {
    const body = document.getElementById("trackingOrdersBody");
    body.innerHTML = "<div class='tracking-empty'>Loading your orders...</div>";

    try {
      const data = await trackingApi("/api/tracking/my-orders");
      const orders = data.orders || [];

      if (!orders.length) {
        body.innerHTML = "<div class='tracking-empty'>You have not placed any orders yet.</div>";
        return;
      }

      body.innerHTML = orders.map((order) => `
        <article class="tracking-order">
          <div class="tracking-order-top">
            <div>
              <h3>Order #${order.id}</h3>
              <p>${(order.items || []).map((item) => item.product.name + " × " + item.quantity).join(", ")}</p>
              <p>Payment: ${order.paymentStatus} · Order: ${order.orderStatus}</p>
              <p>Delivery address: ${order.deliveryAddress || "Not provided"}</p>
            </div>
            <span class="tracking-badge">${trackingMoney(order.totalAmount)}</span>
          </div>
          ${renderTrackingTimeline(order.tracking || [])}
        </article>
      `).join("");
    } catch (error) {
      body.innerHTML = `<div class="tracking-empty">${error.message}</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(refreshTrackingLauncher, 1000);
    setTimeout(refreshTrackingLauncher, 2400);
  });

  window.addEventListener("focus", refreshTrackingLauncher);
  window.sokoyetuRefreshTrackingLauncher = refreshTrackingLauncher;
})();



// ================================
// SokoYetu Admin AI Tools Active Patch
// Makes all admin AI tool icons/cards active.
// Visible only to signed-in admin users.
// ================================
(function initSokoYetuAdminAIToolsActivePatch() {
  const aiStyle = document.createElement("style");
  aiStyle.textContent = `
    .admin-ai-launcher {
      position: fixed;
      right: 18px;
      bottom: 198px;
      z-index: 10002;
      border: none;
      border-radius: 999px;
      padding: 13px 18px;
      background: linear-gradient(135deg, #7c3aed, #111827);
      color: #fff;
      font-weight: 900;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.32);
      cursor: pointer;
      display: none;
      gap: 8px;
      align-items: center;
    }

    .admin-ai-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      z-index: 10003;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }

    .admin-ai-panel {
      width: min(1180px, 97vw);
      max-height: 92vh;
      overflow: auto;
      background: #faf5ff;
      border-radius: 28px;
      box-shadow: 0 35px 95px rgba(15, 23, 42, 0.4);
      border: 1px solid rgba(124, 58, 237, 0.22);
    }

    .admin-ai-head {
      position: sticky;
      top: 0;
      z-index: 2;
      background: linear-gradient(135deg, #111827, #7c3aed);
      color: white;
      padding: 22px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
    }

    .admin-ai-head h2 {
      margin: 0;
      font-size: 25px;
      letter-spacing: -0.03em;
    }

    .admin-ai-head p {
      margin: 5px 0 0;
      color: rgba(255,255,255,0.84);
    }

    .admin-ai-close {
      border: none;
      background: rgba(255,255,255,0.18);
      color: white;
      border-radius: 14px;
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 900;
    }

    .admin-ai-body {
      padding: 20px;
      display: grid;
      grid-template-columns: 330px 1fr;
      gap: 18px;
    }

    .admin-ai-tools {
      display: grid;
      gap: 10px;
      align-content: start;
    }

    .admin-ai-tool {
      border: 1px solid rgba(124, 58, 237, 0.16);
      border-radius: 18px;
      background: #fff;
      padding: 14px;
      cursor: pointer;
      text-align: left;
      display: grid;
      grid-template-columns: 38px 1fr;
      gap: 11px;
      align-items: center;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    }

    .admin-ai-tool:hover,
    .admin-ai-tool.active {
      border-color: #7c3aed;
      box-shadow: 0 16px 32px rgba(124, 58, 237, 0.18);
      transform: translateY(-1px);
    }

    .admin-ai-icon {
      width: 38px;
      height: 38px;
      border-radius: 15px;
      display: grid;
      place-items: center;
      background: #ede9fe;
      color: #5b21b6;
      font-size: 20px;
    }

    .admin-ai-tool b {
      color: #111827;
      display: block;
      margin-bottom: 2px;
    }

    .admin-ai-tool span {
      color: #64748b;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.35;
    }

    .admin-ai-workspace {
      background: white;
      border: 1px solid rgba(124, 58, 237, 0.16);
      border-radius: 22px;
      padding: 18px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
      min-height: 520px;
    }

    .admin-ai-workspace h3 {
      margin: 0 0 8px;
      font-size: 24px;
      color: #111827;
      letter-spacing: -0.03em;
    }

    .admin-ai-workspace p {
      color: #64748b;
      line-height: 1.55;
    }

    .admin-ai-form {
      display: grid;
      gap: 10px;
      margin: 14px 0;
    }

    .admin-ai-form input,
    .admin-ai-form textarea,
    .admin-ai-form select {
      width: 100%;
      border: 1px solid #ddd6fe;
      border-radius: 14px;
      padding: 12px;
      font: inherit;
      background: #fff;
    }

    .admin-ai-form textarea {
      min-height: 92px;
      resize: vertical;
    }

    .admin-ai-btn {
      border: none;
      border-radius: 15px;
      background: #7c3aed;
      color: white;
      font-weight: 900;
      padding: 12px 14px;
      cursor: pointer;
      width: fit-content;
    }

    .admin-ai-output {
      border: 1px solid #ddd6fe;
      background: #f5f3ff;
      border-radius: 18px;
      padding: 15px;
      margin-top: 12px;
      display: grid;
      gap: 10px;
      color: #334155;
    }

    .admin-ai-output b {
      color: #111827;
    }

    .admin-ai-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .admin-ai-card {
      border: 1px solid #ddd6fe;
      border-radius: 18px;
      background: #fff;
      padding: 14px;
    }

    .admin-ai-card h4 {
      margin: 0 0 6px;
      color: #111827;
    }

    .admin-ai-badge {
      display: inline-flex;
      width: fit-content;
      border-radius: 999px;
      background: #ede9fe;
      color: #5b21b6;
      padding: 6px 9px;
      font-size: 12px;
      font-weight: 900;
    }

    @media (max-width: 900px) {
      .admin-ai-body {
        grid-template-columns: 1fr;
      }

      .admin-ai-launcher {
        right: 12px;
        bottom: 184px;
      }
    }
  `;

  document.head.appendChild(aiStyle);

  const tools = [
    {
      id: "wholesale",
      icon: "🏬",
      title: "AI Wholesaler Search",
      desc: "Find suppliers and check catalogue readiness."
    },
    {
      id: "pricing",
      icon: "💰",
      title: "Smart Profit Pricing",
      desc: "Add profit percentage and compare market price."
    },
    {
      id: "listing",
      icon: "📝",
      title: "Product Listing Builder",
      desc: "Generate title, description and tags."
    },
    {
      id: "ads",
      icon: "📣",
      title: "Social Advert Studio",
      desc: "Create WhatsApp, TikTok, Instagram and Facebook copy."
    },
    {
      id: "stock",
      icon: "📦",
      title: "Stock Alert Assistant",
      desc: "Review stock risks and reorder priorities."
    },
    {
      id: "forecast",
      icon: "📈",
      title: "Demand Forecast",
      desc: "Estimate product demand from marketplace signals."
    },
    {
      id: "mpesa",
      icon: "📲",
      title: "M-PESA Reconciliation",
      desc: "Check pending and demo payment records."
    },
    {
      id: "quality",
      icon: "🛡️",
      title: "Quality Risk Checker",
      desc: "Check listing risk before publishing."
    },
    {
      id: "bundle",
      icon: "🎁",
      title: "Bundle Builder",
      desc: "Create product bundles to increase basket value."
    },
    {
      id: "live",
      icon: "🔴",
      title: "Live Selling Planner",
      desc: "Create live-shopping scripts and pinned offers."
    }
  ];

  function aiMoney(value) {
    return "KES " + Number(value || 0).toLocaleString("en-KE");
  }

  async function aiApi(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Admin AI request failed.");
    }

    return data;
  }

  async function getAdminUserForAI() {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  function ensureAdminAIElements() {
    if (!document.getElementById("adminAILauncher")) {
      const launcher = document.createElement("button");
      launcher.id = "adminAILauncher";
      launcher.className = "admin-ai-launcher";
      launcher.innerHTML = "🤖 AI Tools";
      launcher.addEventListener("click", openAdminAITools);
      document.body.appendChild(launcher);
    }

    if (!document.getElementById("adminAIBackdrop")) {
      const backdrop = document.createElement("div");
      backdrop.id = "adminAIBackdrop";
      backdrop.className = "admin-ai-backdrop";
      backdrop.innerHTML = `
        <section class="admin-ai-panel">
          <div class="admin-ai-head">
            <div>
              <h2>SokoYetu Admin AI Centre</h2>
              <p>All artificial-intelligence selling, sourcing, pricing and marketing tools are active here.</p>
            </div>
            <button class="admin-ai-close" id="adminAIClose">Close</button>
          </div>
          <div class="admin-ai-body">
            <aside class="admin-ai-tools" id="adminAIToolList"></aside>
            <main class="admin-ai-workspace" id="adminAIWorkspace"></main>
          </div>
        </section>
      `;

      document.body.appendChild(backdrop);
      document.getElementById("adminAIClose").addEventListener("click", closeAdminAITools);

      document.getElementById("adminAIToolList").innerHTML = tools.map((tool) => `
        <button class="admin-ai-tool" data-ai-tool="${tool.id}">
          <span class="admin-ai-icon">${tool.icon}</span>
          <span><b>${tool.title}</b><span>${tool.desc}</span></span>
        </button>
      `).join("");

      document.querySelectorAll("[data-ai-tool]").forEach((button) => {
        button.addEventListener("click", () => activateAITool(button.dataset.aiTool));
      });
    }
  }

  async function refreshAdminAILauncher() {
    ensureAdminAIElements();

    const user = await getAdminUserForAI();
    const launcher = document.getElementById("adminAILauncher");

    if (user && user.role === "admin") {
      launcher.style.display = "inline-flex";
    } else {
      launcher.style.display = "none";
      closeAdminAITools();
    }
  }

  function openAdminAITools() {
    ensureAdminAIElements();
    document.getElementById("adminAIBackdrop").style.display = "flex";
    activateAITool("wholesale");
  }

  function closeAdminAITools() {
    const backdrop = document.getElementById("adminAIBackdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  function setActiveTool(id) {
    document.querySelectorAll("[data-ai-tool]").forEach((button) => {
      button.classList.toggle("active", button.dataset.aiTool === id);
    });
  }

  function activateAITool(id) {
    setActiveTool(id);

    const workspace = document.getElementById("adminAIWorkspace");

    const renderers = {
      wholesale: renderWholesaleTool,
      pricing: renderPricingTool,
      listing: renderListingTool,
      ads: renderAdsTool,
      stock: renderStockTool,
      forecast: renderForecastTool,
      mpesa: renderMpesaTool,
      quality: renderQualityTool,
      bundle: renderBundleTool,
      live: renderLiveTool
    };

    const renderer = renderers[id] || renderWholesaleTool;
    renderer(workspace);
  }

  function renderWholesaleTool(el) {
    el.innerHTML = `
      <h3>AI Wholesaler Search</h3>
      <p>Search saved wholesalers and identify suppliers that can support SokoYetu product sourcing.</p>
      <div class="admin-ai-form">
        <input id="aiWholesaleQuery" placeholder="Search category, product or location, for example Electronics Nairobi" />
        <button class="admin-ai-btn" id="aiWholesaleRun">Search Wholesalers</button>
      </div>
      <div class="admin-ai-output" id="aiWholesaleOutput">Enter a query and run the search.</div>
    `;

    document.getElementById("aiWholesaleRun").addEventListener("click", async () => {
      const q = document.getElementById("aiWholesaleQuery").value.trim();
      const out = document.getElementById("aiWholesaleOutput");
      out.innerHTML = "Searching saved wholesalers...";

      try {
        const data = await aiApi("/api/admin/wholesalers" + (q ? "?search=" + encodeURIComponent(q) : ""));
        const wholesalers = data.wholesalers || [];

        if (!wholesalers.length) {
          out.innerHTML = `
            <b>No matching wholesalers found.</b>
            <p>Add suppliers in Admin Centre → Wholesale AI Sourcing, then search again.</p>
          `;
          return;
        }

        out.innerHTML = wholesalers.map((w) => `
          <div class="admin-ai-card">
            <h4>${w.name}</h4>
            <p>${w.location} · ${w.category}</p>
            <p>Supplier score: <b>${w.score}/100</b> · Products: <b>${(w.products || []).length}</b></p>
            <span class="admin-ai-badge">${w.score >= 85 ? "Strong supplier" : "Review supplier"}</span>
          </div>
        `).join("");
      } catch (error) {
        out.innerHTML = error.message;
      }
    });
  }

  function renderPricingTool(el) {
    el.innerHTML = `
      <h3>Smart Profit Pricing</h3>
      <p>Calculate a selling price that protects profit while checking whether the item remains competitive in Kenya.</p>
      <div class="admin-ai-form">
        <input id="aiWholesaleCost" type="number" placeholder="Wholesale cost, for example 1800" />
        <input id="aiProfitPercent" type="number" value="20" placeholder="Profit percentage" />
        <input id="aiMarketAverage" type="number" placeholder="Estimated market average, for example 3200" />
        <button class="admin-ai-btn" id="aiPriceRun">Calculate Price</button>
      </div>
      <div class="admin-ai-output" id="aiPriceOutput">Enter pricing details.</div>
    `;

    document.getElementById("aiPriceRun").addEventListener("click", () => {
      const cost = Number(document.getElementById("aiWholesaleCost").value || 0);
      const profit = Number(document.getElementById("aiProfitPercent").value || 0);
      const market = Number(document.getElementById("aiMarketAverage").value || 0);
      const selling = Math.ceil(cost * (1 + profit / 100));
      const expectedProfit = selling - cost;
      const competitive = market ? selling <= market : true;
      const margin = selling ? Math.round((expectedProfit / selling) * 100) : 0;

      document.getElementById("aiPriceOutput").innerHTML = `
        <div><b>SokoYetu price:</b> ${aiMoney(selling)}</div>
        <div><b>Expected profit:</b> ${aiMoney(expectedProfit)}</div>
        <div><b>Estimated margin:</b> ${margin}%</div>
        <div><b>Market check:</b> ${competitive ? "Competitive against the market average." : "Too high. Reduce profit or negotiate wholesale cost."}</div>
      `;
    });
  }

  function renderListingTool(el) {
    el.innerHTML = `
      <h3>AI Product Listing Builder</h3>
      <p>Create cleaner product copy for imported or seller products.</p>
      <div class="admin-ai-form">
        <input id="aiListingName" placeholder="Product name, for example Smart Watch Series 8" />
        <input id="aiListingCategory" placeholder="Category, for example Electronics" />
        <textarea id="aiListingFeatures" placeholder="Main features, for example fitness tracking, call alerts, long battery"></textarea>
        <button class="admin-ai-btn" id="aiListingRun">Generate Listing</button>
      </div>
      <div class="admin-ai-output" id="aiListingOutput">Enter product details.</div>
    `;

    document.getElementById("aiListingRun").addEventListener("click", () => {
      const name = document.getElementById("aiListingName").value.trim() || "Quality Product";
      const category = document.getElementById("aiListingCategory").value.trim() || "General";
      const features = document.getElementById("aiListingFeatures").value.trim() || "reliable quality, practical design and everyday value";

      document.getElementById("aiListingOutput").innerHTML = `
        <b>Title:</b> ${name} - Trusted ${category} Deal<br>
        <b>Description:</b>
        <p>${name} is a practical ${category.toLowerCase()} choice for SokoYetu buyers looking for value, reliability and convenience. It offers ${features}. Ideal for customers who want quality at a fair Kenyan market price.</p>
        <b>Tags:</b> ${category}, SokoYetu Deal, Verified Product, Fast Delivery, M-PESA Accepted
      `;
    });
  }

  function renderAdsTool(el) {
    el.innerHTML = `
      <h3>AI Social Advert Studio</h3>
      <p>Generate quick product adverts for TikTok, Instagram, Facebook and WhatsApp Status.</p>
      <div class="admin-ai-form">
        <select id="aiAdPlatform">
          <option>WhatsApp Status</option>
          <option>TikTok</option>
          <option>Instagram</option>
          <option>Facebook</option>
        </select>
        <input id="aiAdProduct" placeholder="Product name" />
        <input id="aiAdPrice" placeholder="Price, for example KES 3,500" />
        <input id="aiAdOffer" placeholder="Offer, for example 20% off today" />
        <button class="admin-ai-btn" id="aiAdRun">Generate Advert</button>
      </div>
      <div class="admin-ai-output" id="aiAdOutput">Enter advert details.</div>
    `;

    document.getElementById("aiAdRun").addEventListener("click", () => {
      const platform = document.getElementById("aiAdPlatform").value;
      const product = document.getElementById("aiAdProduct").value.trim() || "this product";
      const price = document.getElementById("aiAdPrice").value.trim() || "a fair price";
      const offer = document.getElementById("aiAdOffer").value.trim() || "limited-time deal";

      document.getElementById("aiAdOutput").innerHTML = `
        <b>${platform} advert:</b>
        <p>🔥 New on SokoYetu: ${product}. Get it now for ${price}. ${offer}. Pay easily with M-PESA and enjoy trusted delivery across Kenya.</p>
        <b>Hashtags:</b> #SokoYetu #KenyaDeals #ShopOnlineKE #MPESAAccepted #FlashDeals
        <b>Call to action:</b> Shop now before the offer ends.
      `;
    });
  }

  async function renderStockTool(el) {
    el.innerHTML = `
      <h3>Stock Alert Assistant</h3>
      <p>Loading stock signals from admin dashboard...</p>
      <div class="admin-ai-output" id="aiStockOutput">Loading...</div>
    `;

    try {
      const data = await aiApi("/api/admin/dashboard-data");
      const low = data.lowStockProducts || [];
      const products = data.products || [];

      document.getElementById("aiStockOutput").innerHTML = `
        <div><b>Low stock count:</b> ${low.length}</div>
        <div><b>Total products monitored:</b> ${products.length}</div>
        <div class="admin-ai-grid">
          ${(low.length ? low : products.slice(0, 4)).map((p) => `
            <div class="admin-ai-card">
              <h4>${p.name}</h4>
              <p>Stock: ${p.stock}</p>
              <span class="admin-ai-badge">${p.stock <= 5 ? "Restock urgently" : "Healthy stock"}</span>
            </div>
          `).join("")}
        </div>
      `;
    } catch (error) {
      document.getElementById("aiStockOutput").innerHTML = error.message;
    }
  }

  async function renderForecastTool(el) {
    el.innerHTML = `
      <h3>Demand Forecast</h3>
      <p>Uses simple marketplace signals from current products and orders to suggest demand focus.</p>
      <div class="admin-ai-output" id="aiForecastOutput">Loading...</div>
    `;

    try {
      const data = await aiApi("/api/admin/dashboard-data");
      const products = data.products || [];
      const orders = data.orders || [];
      const categoryCounts = {};

      orders.forEach((order) => {
        (order.items || []).forEach((item) => {
          const category = item.product.category || "Other";
          categoryCounts[category] = (categoryCounts[category] || 0) + item.quantity;
        });
      });

      const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

      document.getElementById("aiForecastOutput").innerHTML = `
        <div><b>Orders analysed:</b> ${orders.length}</div>
        <div><b>Products analysed:</b> ${products.length}</div>
        <div><b>Demand signal:</b> ${topCategory ? topCategory[0] + " is currently leading." : "Not enough order data yet."}</div>
        <p>Recommendation: promote categories with recent orders, restock fast-moving products, and test flash-sale pricing on slow-moving inventory.</p>
      `;
    } catch (error) {
      document.getElementById("aiForecastOutput").innerHTML = error.message;
    }
  }

  async function renderMpesaTool(el) {
    el.innerHTML = `
      <h3>M-PESA Reconciliation Assistant</h3>
      <p>Review payment records and identify orders that still need confirmation.</p>
      <div class="admin-ai-output" id="aiMpesaOutput">Loading...</div>
    `;

    try {
      const data = await aiApi("/api/admin/dashboard-data");
      const payments = data.payments || [];
      const pending = payments.filter((p) => p.status !== "PAID");
      const paid = payments.filter((p) => p.status === "PAID");

      document.getElementById("aiMpesaOutput").innerHTML = `
        <div><b>Total payment records:</b> ${payments.length}</div>
        <div><b>Paid:</b> ${paid.length}</div>
        <div><b>Pending or demo:</b> ${pending.length}</div>
        <div class="admin-ai-grid">
          ${payments.slice(0, 6).map((p) => `
            <div class="admin-ai-card">
              <h4>Payment #${p.id}</h4>
              <p>Order #${p.orderId} · ${aiMoney(p.amount)}</p>
              <p>Status: ${p.status}</p>
              <span class="admin-ai-badge">${p.checkoutRequestId ? "Has checkout ID" : "Needs STK push"}</span>
            </div>
          `).join("")}
        </div>
      `;
    } catch (error) {
      document.getElementById("aiMpesaOutput").innerHTML = error.message;
    }
  }

  function renderQualityTool(el) {
    el.innerHTML = `
      <h3>Product Quality Risk Checker</h3>
      <p>Check whether a listing looks incomplete, risky or weak before it goes live.</p>
      <div class="admin-ai-form">
        <input id="aiQualityTitle" placeholder="Product title" />
        <textarea id="aiQualityDescription" placeholder="Product description"></textarea>
        <input id="aiQualityPrice" type="number" placeholder="Selling price" />
        <button class="admin-ai-btn" id="aiQualityRun">Check Quality</button>
      </div>
      <div class="admin-ai-output" id="aiQualityOutput">Enter listing details.</div>
    `;

    document.getElementById("aiQualityRun").addEventListener("click", () => {
      const title = document.getElementById("aiQualityTitle").value.trim();
      const desc = document.getElementById("aiQualityDescription").value.trim();
      const price = Number(document.getElementById("aiQualityPrice").value || 0);
      const issues = [];

      if (title.length < 8) issues.push("Title is too short.");
      if (desc.length < 45) issues.push("Description needs more detail.");
      if (!price || price < 50) issues.push("Price looks invalid or too low.");
      if (/fake|replica|copy/i.test(title + " " + desc)) issues.push("Possible counterfeit wording detected.");

      document.getElementById("aiQualityOutput").innerHTML = issues.length
        ? `<b>Risk issues found:</b><ul>${issues.map((i) => "<li>" + i + "</li>").join("")}</ul>`
        : "<b>Quality check passed.</b><p>The listing looks clear enough for marketplace review.</p>";
    });
  }

  function renderBundleTool(el) {
    el.innerHTML = `
      <h3>AI Bundle Builder</h3>
      <p>Create bundle ideas to increase average order value.</p>
      <div class="admin-ai-form">
        <input id="aiBundleMain" placeholder="Main product, for example Phone" />
        <input id="aiBundleAddons" placeholder="Add-ons, for example charger, case, earphones" />
        <input id="aiBundlePrice" type="number" placeholder="Total separate price" />
        <button class="admin-ai-btn" id="aiBundleRun">Create Bundle</button>
      </div>
      <div class="admin-ai-output" id="aiBundleOutput">Enter bundle details.</div>
    `;

    document.getElementById("aiBundleRun").addEventListener("click", () => {
      const main = document.getElementById("aiBundleMain").value.trim() || "Main product";
      const addons = document.getElementById("aiBundleAddons").value.trim() || "useful accessories";
      const price = Number(document.getElementById("aiBundlePrice").value || 0);
      const bundlePrice = price ? Math.ceil(price * 0.92) : 0;

      document.getElementById("aiBundleOutput").innerHTML = `
        <b>Bundle name:</b> ${main} Complete Value Pack<br>
        <b>Includes:</b> ${main}, ${addons}<br>
        <b>Suggested bundle price:</b> ${bundlePrice ? aiMoney(bundlePrice) : "Enter total price to calculate"}<br>
        <p>Marketing angle: save more when you buy the full set together on SokoYetu.</p>
      `;
    });
  }

  function renderLiveTool(el) {
    el.innerHTML = `
      <h3>Live Selling Planner</h3>
      <p>Prepare a seller livestream script, pinned offer and buyer call-to-action.</p>
      <div class="admin-ai-form">
        <input id="aiLiveSeller" placeholder="Seller or store name" />
        <input id="aiLiveProduct" placeholder="Main product" />
        <input id="aiLiveOffer" placeholder="Live offer, for example 10% off first 20 buyers" />
        <button class="admin-ai-btn" id="aiLiveRun">Generate Live Plan</button>
      </div>
      <div class="admin-ai-output" id="aiLiveOutput">Enter live selling details.</div>
    `;

    document.getElementById("aiLiveRun").addEventListener("click", () => {
      const seller = document.getElementById("aiLiveSeller").value.trim() || "Verified seller";
      const product = document.getElementById("aiLiveProduct").value.trim() || "featured product";
      const offer = document.getElementById("aiLiveOffer").value.trim() || "limited live-only deal";

      document.getElementById("aiLiveOutput").innerHTML = `
        <b>Opening script:</b>
        <p>Karibu SokoYetu Live. Today ${seller} is showing ${product}, available now with ${offer}. Ask questions in the chat and tap the pinned product to buy.</p>
        <b>Pinned product message:</b>
        <p>${product} is live now. Limited stock. Pay with M-PESA and track your order from your account.</p>
        <b>Closing call-to-action:</b>
        <p>Offer ends when the live session closes. Add to cart now before stock runs out.</p>
      `;
    });
  }

  // Also make older visual AI cards clickable if they exist.
  function activateLegacyAICards() {
    const textToTool = [
      ["wholesaler", "wholesale"],
      ["pricing", "pricing"],
      ["profit", "pricing"],
      ["listing", "listing"],
      ["advert", "ads"],
      ["ad studio", "ads"],
      ["stock", "stock"],
      ["forecast", "forecast"],
      ["m-pesa", "mpesa"],
      ["mpesa", "mpesa"],
      ["quality", "quality"],
      ["bundle", "bundle"],
      ["live", "live"]
    ];

    const candidates = Array.from(document.querySelectorAll("button, .card, .tool-card, [class*='ai'], [class*='tool']"));

    candidates.forEach((element) => {
      if (element.dataset.sokoyetuAiActivated) return;

      const text = (element.textContent || "").toLowerCase();
      const match = textToTool.find(([keyword]) => text.includes(keyword));

      if (!match) return;

      element.dataset.sokoyetuAiActivated = "true";
      element.style.cursor = "pointer";
      element.addEventListener("click", () => {
        openAdminAITools();
        activateAITool(match[1]);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(refreshAdminAILauncher, 900);
    setTimeout(refreshAdminAILauncher, 2200);
    setTimeout(activateLegacyAICards, 1400);
    setTimeout(activateLegacyAICards, 2800);
  });

  document.addEventListener("click", () => {
    setTimeout(activateLegacyAICards, 350);
  });

  window.addEventListener("focus", refreshAdminAILauncher);
  window.sokoyetuRefreshAdminAI = refreshAdminAILauncher;
})();



// ================================
// SokoYetu Admin AI Focus and Close Fix
// Fixes Admin AI panel close button and prevents input/search focus from being hijacked.
// ================================
(function initAdminAIFocusAndCloseFix() {
  function closeAIHard() {
    const backdrop = document.getElementById("adminAIBackdrop");
    if (backdrop) {
      backdrop.style.display = "none";
    }

    document.body.classList.remove("admin-ai-open");
  }

  function openAIHard() {
    const backdrop = document.getElementById("adminAIBackdrop");
    if (backdrop) {
      backdrop.style.display = "flex";
      document.body.classList.add("admin-ai-open");
    }
  }

  function protectTypingInsideAIPanel() {
    const backdrop = document.getElementById("adminAIBackdrop");
    if (!backdrop || backdrop.dataset.focusCloseFixed === "true") return;

    backdrop.dataset.focusCloseFixed = "true";

    const closeBtn = document.getElementById("adminAIClose");
    if (closeBtn) {
      closeBtn.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        closeAIHard();
        return false;
      };
    }

    backdrop.addEventListener("mousedown", function(event) {
      if (event.target === backdrop) {
        event.preventDefault();
        event.stopPropagation();
        closeAIHard();
      }
    }, true);

    backdrop.addEventListener("click", function(event) {
      if (event.target === backdrop) {
        event.preventDefault();
        event.stopPropagation();
        closeAIHard();
        return;
      }

      const close = event.target.closest("#adminAIClose, .admin-ai-close");
      if (close) {
        event.preventDefault();
        event.stopPropagation();
        closeAIHard();
        return;
      }

      const typingTarget = event.target.closest(
        ".admin-ai-panel input, .admin-ai-panel textarea, .admin-ai-panel select, .admin-ai-panel option"
      );

      if (typingTarget) {
        event.stopPropagation();
      }
    }, true);

    backdrop.addEventListener("input", function(event) {
      if (event.target.closest(".admin-ai-panel input, .admin-ai-panel textarea, .admin-ai-panel select")) {
        event.stopPropagation();
      }
    }, true);

    backdrop.addEventListener("keydown", function(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeAIHard();
        return;
      }

      if (event.target.closest(".admin-ai-panel input, .admin-ai-panel textarea, .admin-ai-panel select")) {
        event.stopPropagation();
      }
    }, true);

    backdrop.addEventListener("keyup", function(event) {
      if (event.target.closest(".admin-ai-panel input, .admin-ai-panel textarea, .admin-ai-panel select")) {
        event.stopPropagation();
      }
    }, true);

    backdrop.addEventListener("focusin", function(event) {
      if (event.target.closest(".admin-ai-panel input, .admin-ai-panel textarea, .admin-ai-panel select")) {
        event.stopPropagation();
      }
    }, true);
  }

  function removeBadLegacyAIHandlersFromPanel() {
    const panel = document.querySelector(".admin-ai-panel");
    if (!panel) return;

    // The previous patch tried to activate old visual cards broadly.
    // This marks actual AI panel structure as protected so later scans do not treat
    // the panel, workspace or form controls as legacy cards.
    panel.querySelectorAll(".admin-ai-panel, .admin-ai-workspace, .admin-ai-output, .admin-ai-form, input, textarea, select, option").forEach((el) => {
      el.dataset.sokoyetuAiActivated = "true";
    });
  }

  function patchExistingOpenFunction() {
    const launcher = document.getElementById("adminAILauncher");
    if (launcher && launcher.dataset.focusCloseFixed !== "true") {
      launcher.dataset.focusCloseFixed = "true";
      launcher.addEventListener("click", function() {
        setTimeout(function() {
          openAIHard();
          protectTypingInsideAIPanel();
          removeBadLegacyAIHandlersFromPanel();
        }, 50);
      }, true);
    }
  }

  function runFix() {
    protectTypingInsideAIPanel();
    removeBadLegacyAIHandlersFromPanel();
    patchExistingOpenFunction();
  }

  document.addEventListener("DOMContentLoaded", function() {
    setTimeout(runFix, 300);
    setTimeout(runFix, 1000);
    setTimeout(runFix, 2500);
  });

  document.addEventListener("click", function(event) {
    const target = event.target;

    // Do not let broad AI-card activation interfere with typing inside the AI panel.
    if (target.closest && target.closest(".admin-ai-panel input, .admin-ai-panel textarea, .admin-ai-panel select")) {
      event.stopPropagation();
    }

    setTimeout(runFix, 50);
  }, true);

  window.addEventListener("focus", runFix);

  window.sokoyetuCloseAdminAIHard = closeAIHard;
  window.sokoyetuFixAdminAIPanel = runFix;
})();



// ================================
// SokoYetu Admin AI Suite V2 Patch
// Replaces dormant admin AI cards with a clean active admin-only AI suite.
// It also searches real seeded wholesalers from the database.
// ================================
(function initSokoYetuAdminAISuiteV2() {
  const style = document.createElement("style");
  style.textContent = `
    #adminAISuiteV2Launcher {
      position: fixed;
      right: 18px;
      bottom: 254px;
      z-index: 12000;
      border: none;
      border-radius: 999px;
      padding: 13px 18px;
      background: linear-gradient(135deg, #6d28d9, #f97316);
      color: #fff;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 18px 45px rgba(15, 23, 42, .32);
      display: none;
    }

    #adminAISuiteV2Backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, .68);
      z-index: 12001;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }

    .ai2-panel {
      width: min(1220px, 97vw);
      max-height: 92vh;
      overflow: auto;
      background: #fffaf4;
      border-radius: 28px;
      box-shadow: 0 35px 95px rgba(15, 23, 42, .42);
      border: 1px solid rgba(249, 115, 22, .22);
    }

    .ai2-head {
      position: sticky;
      top: 0;
      z-index: 2;
      background: linear-gradient(135deg, #111827, #6d28d9, #f97316);
      color: white;
      padding: 22px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
    }

    .ai2-head h2 {
      margin: 0;
      font-size: 26px;
      letter-spacing: -.03em;
    }

    .ai2-head p {
      margin: 5px 0 0;
      color: rgba(255,255,255,.84);
    }

    #adminAISuiteV2Close {
      border: none;
      background: rgba(255,255,255,.18);
      color: white;
      border-radius: 14px;
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 900;
    }

    .ai2-body {
      padding: 18px;
      display: grid;
      grid-template-columns: 330px 1fr;
      gap: 18px;
    }

    .ai2-tools {
      display: grid;
      gap: 10px;
      align-content: start;
    }

    .ai2-tool {
      border: 1px solid rgba(109, 40, 217, .16);
      border-radius: 18px;
      background: white;
      padding: 14px;
      cursor: pointer;
      text-align: left;
      display: grid;
      grid-template-columns: 38px 1fr;
      gap: 11px;
      align-items: center;
      box-shadow: 0 10px 24px rgba(15,23,42,.06);
    }

    .ai2-tool:hover,
    .ai2-tool.active {
      border-color: #6d28d9;
      box-shadow: 0 16px 32px rgba(109,40,217,.18);
      transform: translateY(-1px);
    }

    .ai2-icon {
      width: 38px;
      height: 38px;
      border-radius: 15px;
      background: #ede9fe;
      color: #5b21b6;
      display: grid;
      place-items: center;
      font-size: 20px;
    }

    .ai2-tool b {
      display: block;
      color: #111827;
      margin-bottom: 2px;
    }

    .ai2-tool span:last-child {
      color: #64748b;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.35;
    }

    #adminAISuiteV2Workspace {
      background: white;
      border: 1px solid rgba(109,40,217,.16);
      border-radius: 22px;
      padding: 18px;
      box-shadow: 0 12px 30px rgba(15,23,42,.06);
      min-height: 540px;
    }

    #adminAISuiteV2Workspace h3 {
      margin: 0 0 8px;
      font-size: 24px;
      letter-spacing: -.03em;
      color: #111827;
    }

    #adminAISuiteV2Workspace p {
      color: #64748b;
      line-height: 1.55;
    }

    .ai2-form {
      display: grid;
      gap: 10px;
      margin: 14px 0;
    }

    .ai2-form input,
    .ai2-form textarea,
    .ai2-form select {
      width: 100%;
      border: 1px solid #ddd6fe;
      border-radius: 14px;
      padding: 12px;
      font: inherit;
      background: #fff;
      color: #111827;
    }

    .ai2-form textarea {
      min-height: 92px;
      resize: vertical;
    }

    .ai2-btn {
      border: none;
      border-radius: 15px;
      background: #6d28d9;
      color: white;
      font-weight: 900;
      padding: 12px 14px;
      cursor: pointer;
      width: fit-content;
    }

    .ai2-btn.orange {
      background: #f97316;
    }

    .ai2-output {
      border: 1px solid #ddd6fe;
      background: #f5f3ff;
      border-radius: 18px;
      padding: 15px;
      margin-top: 12px;
      display: grid;
      gap: 10px;
      color: #334155;
    }

    .ai2-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .ai2-card {
      border: 1px solid #ddd6fe;
      border-radius: 18px;
      background: white;
      padding: 14px;
      display: grid;
      gap: 8px;
    }

    .ai2-card h4 {
      margin: 0;
      color: #111827;
    }

    .ai2-badge {
      display: inline-flex;
      width: fit-content;
      border-radius: 999px;
      background: #ede9fe;
      color: #5b21b6;
      padding: 6px 9px;
      font-size: 12px;
      font-weight: 900;
    }

    @media (max-width: 900px) {
      .ai2-body {
        grid-template-columns: 1fr;
      }
      #adminAISuiteV2Launcher {
        right: 12px;
        bottom: 232px;
      }
    }
  `;
  document.head.appendChild(style);

  const tools = [
    ["wholesale", "🏬", "Wholesaler Search", "Search real wholesalers and their products."],
    ["pricing", "💰", "Profit Pricing", "Calculate fair profit and market position."],
    ["listing", "📝", "Listing Builder", "Generate product titles and descriptions."],
    ["ads", "📣", "Advert Studio", "Create social media advert copy."],
    ["stock", "📦", "Stock Alerts", "Review low-stock and restock signals."],
    ["forecast", "📈", "Demand Forecast", "Read category demand signals."],
    ["mpesa", "📲", "M-PESA Check", "Review payment records and pending orders."],
    ["quality", "🛡️", "Quality Check", "Check weak or risky listings."],
    ["bundle", "🎁", "Bundle Builder", "Create smart product bundles."],
    ["live", "🔴", "Live Plan", "Prepare seller live-shopping scripts."]
  ];

  function money(value) {
    return "KES " + Number(value || 0).toLocaleString("en-KE");
  }

  async function api(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed.");
    return data;
  }

  async function currentUser() {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  function ensure() {
    // Hide older AI launcher that had focus/click issues.
    const oldAI = document.getElementById("adminAILauncher");
    if (oldAI) oldAI.style.display = "none";

    if (!document.getElementById("adminAISuiteV2Launcher")) {
      const launcher = document.createElement("button");
      launcher.id = "adminAISuiteV2Launcher";
      launcher.textContent = "🧠 Admin AI Suite";
      launcher.addEventListener("click", openSuite);
      document.body.appendChild(launcher);
    }

    if (!document.getElementById("adminAISuiteV2Backdrop")) {
      const backdrop = document.createElement("div");
      backdrop.id = "adminAISuiteV2Backdrop";
      backdrop.innerHTML = `
        <section class="ai2-panel" role="dialog" aria-label="Admin AI Suite">
          <div class="ai2-head">
            <div>
              <h2>Admin AI Suite</h2>
              <p>Active sourcing, pricing, listing, advert, stock, payment and live-selling tools.</p>
            </div>
            <button id="adminAISuiteV2Close">Close</button>
          </div>
          <div class="ai2-body">
            <aside class="ai2-tools" id="adminAISuiteV2Tools"></aside>
            <main id="adminAISuiteV2Workspace"></main>
          </div>
        </section>
      `;
      document.body.appendChild(backdrop);

      document.getElementById("adminAISuiteV2Tools").innerHTML = tools.map(([id, icon, title, desc]) => `
        <button type="button" class="ai2-tool" data-ai2-tool="${id}">
          <span class="ai2-icon">${icon}</span>
          <span><b>${title}</b><span>${desc}</span></span>
        </button>
      `).join("");

      document.getElementById("adminAISuiteV2Close").addEventListener("click", closeSuite);
      backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop) closeSuite();
      });

      backdrop.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeSuite();
      });

      document.querySelectorAll("[data-ai2-tool]").forEach((button) => {
        button.addEventListener("click", () => activate(button.dataset.ai2Tool));
      });
    }
  }

  async function refreshLauncher() {
    ensure();
    const user = await currentUser();
    const launcher = document.getElementById("adminAISuiteV2Launcher");
    launcher.style.display = user && user.role === "admin" ? "inline-flex" : "none";
  }

  function openSuite() {
    ensure();
    document.getElementById("adminAISuiteV2Backdrop").style.display = "flex";
    activate("wholesale");
  }

  function closeSuite() {
    const backdrop = document.getElementById("adminAISuiteV2Backdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  function activeButton(id) {
    document.querySelectorAll("[data-ai2-tool]").forEach((button) => {
      button.classList.toggle("active", button.dataset.ai2Tool === id);
    });
  }

  function activate(id) {
    activeButton(id);
    const el = document.getElementById("adminAISuiteV2Workspace");
    const map = { wholesale, pricing, listing, ads, stock, forecast, mpesa, quality, bundle, live };
    (map[id] || wholesale)(el);
  }

  function wholesale(el) {
    el.innerHTML = `
      <h3>Wholesaler Search</h3>
      <p>Search real wholesalers saved in your database. Try: electronics, fashion, groceries, Nairobi, Mombasa, tools.</p>
      <div class="ai2-form">
        <input id="ai2WholesaleQuery" placeholder="Search wholesalers by category, product, or location" />
        <button type="button" class="ai2-btn" id="ai2WholesaleBtn">Search Wholesalers</button>
      </div>
      <div class="ai2-output" id="ai2WholesaleOut">Click search to list all wholesalers.</div>
    `;

    const run = async () => {
      const query = document.getElementById("ai2WholesaleQuery").value.trim();
      const out = document.getElementById("ai2WholesaleOut");
      out.innerHTML = "Loading wholesalers...";

      try {
        const data = await api("/api/admin/wholesalers" + (query ? "?search=" + encodeURIComponent(query) : ""));
        const wholesalers = data.wholesalers || [];

        if (!wholesalers.length) {
          out.innerHTML = `
            <b>No wholesalers found for "${query}".</b>
            <p>Try electronics, fashion, groceries, beauty, tools or Nairobi. The seed script also adds demo wholesalers if they were missing.</p>
          `;
          return;
        }

        out.innerHTML = `
          <div class="ai2-grid">
            ${wholesalers.map((w) => `
              <div class="ai2-card">
                <h4>${w.name}</h4>
                <span class="ai2-badge">${w.category} · Score ${w.score}/100</span>
                <p>${w.location} · ${w.phone || "No phone"}</p>
                <p><b>Products:</b> ${(w.products || []).length}</p>
                ${(w.products || []).map((p) => `
                  <div style="border-top:1px solid #ddd6fe;padding-top:8px;margin-top:8px;">
                    <b>${p.name}</b>
                    <p>Wholesale: ${money(p.wholesalePrice)} · Market: ${money(p.marketPrice)} · Stock: ${p.stock}</p>
                    <input id="ai2Profit-${p.id}" type="number" value="20" min="1" max="100" style="width:90px;border:1px solid #ddd6fe;border-radius:10px;padding:7px;" />
                    <button type="button" class="ai2-btn orange" data-ai2-import="${p.id}">Import to SokoYetu</button>
                  </div>
                `).join("")}
              </div>
            `).join("")}
          </div>
        `;

        out.querySelectorAll("[data-ai2-import]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = Number(btn.dataset.ai2Import);
            const profit = Number(document.getElementById("ai2Profit-" + id)?.value || 20);
            btn.textContent = "Importing...";
            try {
              const result = await api("/api/admin/import-wholesale-product", {
                method: "POST",
                body: JSON.stringify({ wholesalerProductId: id, profitPercent: profit })
              });
              btn.textContent = "Imported";
              alert("Imported. Selling price: " + money(result.pricing.sellingPrice) + ". Competitive: " + (result.pricing.isCompetitive ? "Yes" : "No"));
              if (typeof loadProductsFromDatabase === "function") await loadProductsFromDatabase();
              if (typeof renderApp === "function") renderApp();
            } catch (error) {
              btn.textContent = "Import to SokoYetu";
              alert(error.message);
            }
          });
        });
      } catch (error) {
        out.innerHTML = error.message;
      }
    };

    document.getElementById("ai2WholesaleBtn").addEventListener("click", run);
    document.getElementById("ai2WholesaleQuery").addEventListener("keydown", (e) => {
      if (e.key === "Enter") run();
    });
    run();
  }

  function pricing(el) {
    el.innerHTML = `
      <h3>Profit Pricing</h3>
      <p>Calculate selling price from wholesale cost and profit percentage.</p>
      <div class="ai2-form">
        <input id="ai2Cost" type="number" placeholder="Wholesale cost" />
        <input id="ai2Profit" type="number" value="20" placeholder="Profit percentage" />
        <input id="ai2Market" type="number" placeholder="Market average price" />
        <button type="button" class="ai2-btn" id="ai2PriceBtn">Calculate</button>
      </div>
      <div class="ai2-output" id="ai2PriceOut">Enter figures and calculate.</div>
    `;
    document.getElementById("ai2PriceBtn").onclick = () => {
      const cost = Number(document.getElementById("ai2Cost").value || 0);
      const profit = Number(document.getElementById("ai2Profit").value || 0);
      const market = Number(document.getElementById("ai2Market").value || 0);
      const price = Math.ceil(cost * (1 + profit / 100));
      const gain = price - cost;
      const competitive = market ? price <= market : true;
      document.getElementById("ai2PriceOut").innerHTML = `
        <b>Selling price:</b> ${money(price)}<br>
        <b>Profit:</b> ${money(gain)}<br>
        <b>Market check:</b> ${competitive ? "Competitive" : "Too high against market average"}
      `;
    };
  }

  function listing(el) {
    el.innerHTML = `
      <h3>Listing Builder</h3>
      <div class="ai2-form">
        <input id="ai2ListName" placeholder="Product name" />
        <input id="ai2ListCat" placeholder="Category" />
        <textarea id="ai2ListFeatures" placeholder="Main features"></textarea>
        <button type="button" class="ai2-btn" id="ai2ListBtn">Generate Listing</button>
      </div>
      <div class="ai2-output" id="ai2ListOut">Enter product details.</div>
    `;
    document.getElementById("ai2ListBtn").onclick = () => {
      const n = document.getElementById("ai2ListName").value || "Quality Product";
      const c = document.getElementById("ai2ListCat").value || "General";
      const f = document.getElementById("ai2ListFeatures").value || "reliable quality and everyday value";
      document.getElementById("ai2ListOut").innerHTML = `
        <b>Title:</b> ${n} - Best ${c} Deal on SokoYetu<br>
        <b>Description:</b><p>${n} is a practical ${c.toLowerCase()} product for buyers who want value, reliability and convenience. Key features include ${f}. Pay easily with M-PESA and track your order online.</p>
        <b>Tags:</b> ${c}, SokoYetu, verified product, M-PESA, Kenya deals
      `;
    };
  }

  function ads(el) {
    el.innerHTML = `
      <h3>Advert Studio</h3>
      <div class="ai2-form">
        <select id="ai2AdPlatform"><option>WhatsApp Status</option><option>TikTok</option><option>Instagram</option><option>Facebook</option></select>
        <input id="ai2AdProduct" placeholder="Product name" />
        <input id="ai2AdPrice" placeholder="Price" />
        <input id="ai2AdOffer" placeholder="Offer" />
        <button type="button" class="ai2-btn" id="ai2AdBtn">Generate Advert</button>
      </div>
      <div class="ai2-output" id="ai2AdOut">Enter advert details.</div>
    `;
    document.getElementById("ai2AdBtn").onclick = () => {
      const platform = document.getElementById("ai2AdPlatform").value;
      const product = document.getElementById("ai2AdProduct").value || "this product";
      const price = document.getElementById("ai2AdPrice").value || "a fair price";
      const offer = document.getElementById("ai2AdOffer").value || "limited offer";
      document.getElementById("ai2AdOut").innerHTML = `
        <b>${platform} advert:</b>
        <p>🔥 New on SokoYetu: ${product}. Get it now for ${price}. ${offer}. Pay with M-PESA and track delivery online.</p>
        <b>Hashtags:</b> #SokoYetu #KenyaDeals #ShopOnlineKE #MPESA
      `;
    };
  }

  async function stock(el) {
    el.innerHTML = `<h3>Stock Alerts</h3><div class="ai2-output" id="ai2StockOut">Loading...</div>`;
    try {
      const d = await api("/api/admin/dashboard-data");
      const products = d.products || [];
      const low = products.filter(p => p.stock <= 5);
      document.getElementById("ai2StockOut").innerHTML = `
        <b>Low stock:</b> ${low.length}<br>
        <div class="ai2-grid">${(low.length ? low : products.slice(0, 6)).map(p => `<div class="ai2-card"><h4>${p.name}</h4><p>Stock: ${p.stock}</p><span class="ai2-badge">${p.stock <= 5 ? "Restock" : "Healthy"}</span></div>`).join("")}</div>
      `;
    } catch (e) { document.getElementById("ai2StockOut").textContent = e.message; }
  }

  async function forecast(el) {
    el.innerHTML = `<h3>Demand Forecast</h3><div class="ai2-output" id="ai2ForecastOut">Loading...</div>`;
    try {
      const d = await api("/api/admin/dashboard-data");
      const counts = {};
      (d.orders || []).forEach(o => (o.items || []).forEach(i => counts[i.product.category] = (counts[i.product.category] || 0) + i.quantity));
      const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
      document.getElementById("ai2ForecastOut").innerHTML = `
        <b>Orders analysed:</b> ${(d.orders || []).length}<br>
        <b>Top demand signal:</b> ${top ? top[0] : "Not enough order data"}<br>
        <p>Recommendation: promote categories with sales, put slow products in flash deals, and restock fast-moving categories.</p>
      `;
    } catch (e) { document.getElementById("ai2ForecastOut").textContent = e.message; }
  }

  async function mpesa(el) {
    el.innerHTML = `<h3>M-PESA Check</h3><div class="ai2-output" id="ai2MpesaOut">Loading...</div>`;
    try {
      const d = await api("/api/admin/dashboard-data");
      const payments = d.payments || [];
      document.getElementById("ai2MpesaOut").innerHTML = `
        <b>Payment records:</b> ${payments.length}<br>
        <div class="ai2-grid">${payments.map(p => `<div class="ai2-card"><h4>Payment #${p.id}</h4><p>Order #${p.orderId} · ${money(p.amount)}</p><span class="ai2-badge">${p.status}</span></div>`).join("")}</div>
      `;
    } catch (e) { document.getElementById("ai2MpesaOut").textContent = e.message; }
  }

  function quality(el) {
    el.innerHTML = `
      <h3>Quality Check</h3>
      <div class="ai2-form">
        <input id="ai2QualityTitle" placeholder="Title" />
        <textarea id="ai2QualityDesc" placeholder="Description"></textarea>
        <input id="ai2QualityPrice" type="number" placeholder="Price" />
        <button type="button" class="ai2-btn" id="ai2QualityBtn">Check Listing</button>
      </div>
      <div class="ai2-output" id="ai2QualityOut">Enter listing details.</div>
    `;
    document.getElementById("ai2QualityBtn").onclick = () => {
      const title = document.getElementById("ai2QualityTitle").value;
      const desc = document.getElementById("ai2QualityDesc").value;
      const price = Number(document.getElementById("ai2QualityPrice").value || 0);
      const issues = [];
      if (title.length < 8) issues.push("Title is too short.");
      if (desc.length < 45) issues.push("Description needs more detail.");
      if (!price) issues.push("Price is missing.");
      document.getElementById("ai2QualityOut").innerHTML = issues.length ? "<b>Issues:</b><ul>" + issues.map(i=>"<li>"+i+"</li>").join("") + "</ul>" : "<b>Passed:</b> Listing looks ready for review.";
    };
  }

  function bundle(el) {
    el.innerHTML = `
      <h3>Bundle Builder</h3>
      <div class="ai2-form">
        <input id="ai2BundleMain" placeholder="Main product" />
        <input id="ai2BundleAdd" placeholder="Add-ons" />
        <input id="ai2BundlePrice" type="number" placeholder="Separate total price" />
        <button type="button" class="ai2-btn" id="ai2BundleBtn">Build Bundle</button>
      </div>
      <div class="ai2-output" id="ai2BundleOut">Enter bundle details.</div>
    `;
    document.getElementById("ai2BundleBtn").onclick = () => {
      const main = document.getElementById("ai2BundleMain").value || "Main product";
      const add = document.getElementById("ai2BundleAdd").value || "useful accessories";
      const price = Number(document.getElementById("ai2BundlePrice").value || 0);
      document.getElementById("ai2BundleOut").innerHTML = `
        <b>Bundle:</b> ${main} Complete Pack<br>
        <b>Includes:</b> ${main}, ${add}<br>
        <b>Suggested bundle price:</b> ${price ? money(Math.ceil(price * .92)) : "Enter price to calculate"}
      `;
    };
  }

  function live(el) {
    el.innerHTML = `
      <h3>Live Selling Planner</h3>
      <div class="ai2-form">
        <input id="ai2LiveSeller" placeholder="Seller/store name" />
        <input id="ai2LiveProduct" placeholder="Main product" />
        <input id="ai2LiveOffer" placeholder="Live offer" />
        <button type="button" class="ai2-btn" id="ai2LiveBtn">Create Live Plan</button>
      </div>
      <div class="ai2-output" id="ai2LiveOut">Enter live session details.</div>
    `;
    document.getElementById("ai2LiveBtn").onclick = () => {
      const seller = document.getElementById("ai2LiveSeller").value || "Verified seller";
      const product = document.getElementById("ai2LiveProduct").value || "featured product";
      const offer = document.getElementById("ai2LiveOffer").value || "live-only deal";
      document.getElementById("ai2LiveOut").innerHTML = `
        <b>Opening:</b><p>Karibu SokoYetu Live. Today ${seller} is showing ${product} with ${offer}. Ask questions and tap the pinned product to buy.</p>
        <b>Pinned message:</b><p>${product} is available now. Pay with M-PESA and track your order from your account.</p>
      `;
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(refreshLauncher, 600);
    setTimeout(refreshLauncher, 2000);
  });
  window.addEventListener("focus", refreshLauncher);
  window.sokoyetuOpenAdminAISuiteV2 = openSuite;
  window.sokoyetuRefreshAdminAISuiteV2 = refreshLauncher;
})();


// ================================
// SokoYetu Step 13 Old AI Cleanup
// Keeps the corrected 🧠 Admin AI Suite V2 and hides the older unstable 🤖 AI Tools launcher.
// ================================
(function cleanupOldAdminAIButtonsStep13() {
  function hideOldAI() {
    const oldLauncher = document.getElementById("adminAILauncher");
    if (oldLauncher) {
      oldLauncher.style.display = "none";
      oldLauncher.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll(".admin-ai-launcher").forEach((button) => {
      if (button.id !== "adminAISuiteV2Launcher") {
        button.style.display = "none";
        button.setAttribute("aria-hidden", "true");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(hideOldAI, 500);
    setTimeout(hideOldAI, 1600);
    setTimeout(hideOldAI, 3200);
  });

  document.addEventListener("click", () => {
    setTimeout(hideOldAI, 250);
  });

  window.addEventListener("focus", hideOldAI);
})();


// ================================
// SokoYetu Stage 17: LiveKit Livestreaming Frontend
// Adds role-aware live seller buttons.
// ================================
(function initSokoYetuLiveKitFrontend() {
  const liveStyle = document.createElement("style");
  liveStyle.textContent = `
    .sy-live-launcher{position:fixed;z-index:12500;left:18px;bottom:142px;border:none;border-radius:999px;padding:13px 18px;background:linear-gradient(135deg,#dc2626,#111827);color:#fff;font-weight:900;cursor:pointer;box-shadow:0 18px 45px rgba(15,23,42,.32);display:none}
    .sy-live-watch{left:18px;bottom:198px;background:linear-gradient(135deg,#f97316,#dc2626)}
    .sy-live-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.68);z-index:12501;display:none;align-items:center;justify-content:center;padding:18px}
    .sy-live-panel{width:min(1050px,96vw);max-height:92vh;overflow:auto;background:#fff7ed;border-radius:26px;border:1px solid rgba(220,38,38,.18);box-shadow:0 35px 95px rgba(15,23,42,.4)}
    .sy-live-head{background:linear-gradient(135deg,#111827,#dc2626);color:white;padding:22px;display:flex;justify-content:space-between;gap:14px;align-items:center;position:sticky;top:0;z-index:2}
    .sy-live-head h2{margin:0;font-size:25px;letter-spacing:-.03em}.sy-live-head p{margin:5px 0 0;color:rgba(255,255,255,.84)}
    .sy-live-close{border:none;background:rgba(255,255,255,.18);color:#fff;border-radius:14px;padding:10px 14px;cursor:pointer;font-weight:900}
    .sy-live-body{padding:18px;display:grid;gap:16px}.sy-live-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:16px}
    .sy-live-card{background:white;border:1px solid rgba(220,38,38,.16);border-radius:20px;padding:16px;box-shadow:0 12px 30px rgba(15,23,42,.06)}
    .sy-live-card h3,.sy-live-card h4{margin:0 0 8px;color:#111827}.sy-live-card p{color:#64748b;line-height:1.5;margin:0 0 8px}
    .sy-live-form{display:grid;gap:10px}.sy-live-form input,.sy-live-form textarea{width:100%;border:1px solid #fecaca;border-radius:14px;padding:12px;font:inherit;background:#fff}.sy-live-form textarea{min-height:86px;resize:vertical}
    .sy-live-btn{border:none;border-radius:15px;background:#dc2626;color:#fff;font-weight:900;padding:11px 14px;cursor:pointer;width:fit-content}.sy-live-btn.secondary{background:#111827}
    .sy-live-list{display:grid;gap:10px}.sy-live-badge{display:inline-flex;width:fit-content;border-radius:999px;background:#fee2e2;color:#991b1b;padding:6px 9px;font-size:12px;font-weight:900}
    .sy-live-empty{border:1px dashed #fecaca;border-radius:16px;padding:14px;background:#fff1f2;color:#64748b;font-weight:800}
    @media(max-width:900px){.sy-live-grid{grid-template-columns:1fr}.sy-live-launcher{left:12px}}
  `;
  document.head.appendChild(liveStyle);

  async function liveApi(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Live request failed.");
    return data;
  }

  async function getLiveUser() {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user || null;
    } catch { return null; }
  }

  function ensureLiveElements() {
    if (!document.getElementById("syLiveStudioLauncher")) {
      const studio = document.createElement("button");
      studio.id = "syLiveStudioLauncher";
      studio.className = "sy-live-launcher";
      studio.textContent = "🔴 Live Studio";
      studio.addEventListener("click", () => openLivePanel("studio"));
      document.body.appendChild(studio);
    }

    if (!document.getElementById("syLiveWatchLauncher")) {
      const watch = document.createElement("button");
      watch.id = "syLiveWatchLauncher";
      watch.className = "sy-live-launcher sy-live-watch";
      watch.textContent = "📺 Live Sellers";
      watch.addEventListener("click", () => openLivePanel("watch"));
      document.body.appendChild(watch);
    }

    if (!document.getElementById("syLiveBackdrop")) {
      const backdrop = document.createElement("div");
      backdrop.id = "syLiveBackdrop";
      backdrop.className = "sy-live-backdrop";
      backdrop.innerHTML = `
        <section class="sy-live-panel">
          <div class="sy-live-head">
            <div><h2>SokoYetu Live Shopping</h2><p>Sellers host live product sessions. Buyers join active live sellers.</p></div>
            <button class="sy-live-close" id="syLiveClose">Close</button>
          </div>
          <div class="sy-live-body" id="syLiveBody"></div>
        </section>
      `;
      document.body.appendChild(backdrop);
      document.getElementById("syLiveClose").addEventListener("click", closeLivePanel);
      backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeLivePanel(); });
    }
  }

  async function refreshLiveButtons() {
    ensureLiveElements();
    const user = await getLiveUser();
    const studio = document.getElementById("syLiveStudioLauncher");
    const watch = document.getElementById("syLiveWatchLauncher");

    if (!user) {
      studio.style.display = "none";
      watch.style.display = "none";
      closeLivePanel();
      return;
    }

    studio.style.display = ["seller", "admin"].includes(user.role) ? "inline-flex" : "none";
    watch.style.display = ["buyer", "admin", "seller"].includes(user.role) ? "inline-flex" : "none";
  }

  async function openLivePanel(mode) {
    ensureLiveElements();
    document.getElementById("syLiveBackdrop").style.display = "flex";
    await renderLivePanel(mode);
  }

  function closeLivePanel() {
    const backdrop = document.getElementById("syLiveBackdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  async function renderLivePanel(mode) {
    const body = document.getElementById("syLiveBody");
    const user = await getLiveUser();
    body.innerHTML = "<div class='sy-live-empty'>Loading live sessions...</div>";

    if (!user) {
      body.innerHTML = "<div class='sy-live-empty'>Sign in to use live shopping.</div>";
      return;
    }

    const canHost = ["seller", "admin"].includes(user.role);

    try {
      const [sessionsData, configData] = await Promise.all([liveApi("/api/live/sessions"), liveApi("/api/live/config")]);
      const sessions = sessionsData.sessions || [];
      const config = configData;

      body.innerHTML = `
        <div class="sy-live-grid">
          ${canHost ? `
            <div class="sy-live-card">
              <h3>Start Live Session</h3>
              <p>Go live as a seller. Buyers will see your session under Live Sellers.</p>
              <form id="syLiveCreateForm" class="sy-live-form">
                <input name="title" placeholder="Live title, for example Flash Sale: Phones Today" required />
                <input name="productName" placeholder="Featured product name, optional" />
                <textarea name="offerText" placeholder="Live offer, for example 10% off for first 20 buyers"></textarea>
                <button class="sy-live-btn" type="submit">Create and Join as Host</button>
              </form>
              <p style="margin-top:10px;"><span class="sy-live-badge">${config.configured ? "LiveKit configured" : "LiveKit not configured"}</span></p>
            </div>
          ` : `
            <div class="sy-live-card"><h3>Live Shopping</h3><p>Join active seller sessions and watch live product demonstrations.</p><span class="sy-live-badge">${config.configured ? "Ready" : "Live provider not configured"}</span></div>
          `}
          <div class="sy-live-card"><h3>Active Live Sellers</h3><div class="sy-live-list" id="syLiveSessionsList">${renderLiveSessions(sessions, user)}</div></div>
        </div>
      `;

      const form = document.getElementById("syLiveCreateForm");
      if (form) {
        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const formData = new FormData(form);
          try {
            const created = await liveApi("/api/live/sessions", {
              method: "POST",
              body: JSON.stringify({
                title: formData.get("title"),
                productName: formData.get("productName"),
                offerText: formData.get("offerText"),
              }),
            });
            await joinLiveSession(created.session.id);
          } catch (error) { alert(error.message); }
        });
      }

      bindLiveSessionButtons();
    } catch (error) {
      body.innerHTML = "<div class='sy-live-empty'>" + error.message + "</div>";
    }
  }

  function renderLiveSessions(sessions, user) {
    if (!sessions.length) return "<div class='sy-live-empty'>No sellers are live right now.</div>";

    return sessions.map((session) => {
      const isOwner = user && (user.role === "admin" || user.id === session.sellerId);
      return `
        <article class="sy-live-card">
          <h4>🔴 ${session.title}</h4>
          <p><b>Seller:</b> ${session.sellerName}</p>
          <p><b>Product:</b> ${session.productName || "Live product showcase"}</p>
          <p><b>Offer:</b> ${session.offerText || "Join live to see the offer."}</p>
          <span class="sy-live-badge">LIVE</span>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
            <button class="sy-live-btn" data-join-live="${session.id}">${isOwner ? "Join as Host" : "Join Live"}</button>
            ${isOwner ? `<button class="sy-live-btn secondary" data-end-live="${session.id}">End Live</button>` : ""}
          </div>
        </article>
      `;
    }).join("");
  }

  function bindLiveSessionButtons() {
    document.querySelectorAll("[data-join-live]").forEach((button) => {
      button.addEventListener("click", async () => joinLiveSession(button.dataset.joinLive));
    });

    document.querySelectorAll("[data-end-live]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!confirm("End this live session?")) return;
        try {
          await liveApi("/api/live/sessions/" + button.dataset.endLive + "/end", { method: "PATCH", body: JSON.stringify({}) });
          await renderLivePanel("watch");
        } catch (error) { alert(error.message); }
      });
    });
  }

  async function joinLiveSession(sessionId) {
    try {
      const data = await liveApi("/api/live/sessions/" + sessionId + "/token", { method: "POST", body: JSON.stringify({}) });
      const url = "/livekit-room.html?url=" + encodeURIComponent(data.livekitUrl) +
        "&token=" + encodeURIComponent(data.token) +
        "&room=" + encodeURIComponent(data.roomName) +
        "&publish=" + encodeURIComponent(String(data.canPublish));
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) { alert(error.message); }
  }

  document.addEventListener("DOMContentLoaded", () => { setTimeout(refreshLiveButtons, 800); setTimeout(refreshLiveButtons, 2200); });
  document.addEventListener("click", () => { setTimeout(refreshLiveButtons, 300); });
  window.addEventListener("focus", refreshLiveButtons);
  window.sokoyetuRefreshLiveButtons = refreshLiveButtons;
})();


// ================================
// SokoYetu Stage 18: Final UI Polish and Duplicate Cleanup
// Keeps the corrected Admin AI Suite V2, LiveKit buttons, Cloudinary uploads, Daraja payments and Seller Studio.
// Hides old duplicate/unstable launchers and improves floating controls.
// ================================
(function initSokoYetuStage18UIPolish() {
  const stage18Style = document.createElement("style");
  stage18Style.textContent = `
    /* Hide old unstable admin AI launcher/panel. Keep only Admin AI Suite V2. */
    #adminAILauncher,
    .admin-ai-launcher:not(#adminAISuiteV2Launcher) {
      display: none !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }

    /* Keep the corrected admin AI suite visible, clean and away from live buttons. */
    #adminAISuiteV2Launcher {
      right: 18px !important;
      bottom: 210px !important;
      z-index: 13000 !important;
      border-radius: 999px !important;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.28) !important;
    }

    /* Keep LiveKit buttons stacked cleanly on the left. */
    #syLiveStudioLauncher {
      left: 18px !important;
      bottom: 150px !important;
      z-index: 13000 !important;
    }

    #syLiveWatchLauncher {
      left: 18px !important;
      bottom: 206px !important;
      z-index: 13000 !important;
    }

    /* Small visual polish for legal/footer links and floating controls. */
    .stage18-clean-link,
    footer a,
    .footer a {
      text-decoration: none;
    }

    .stage18-ready-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 6px 10px;
      background: #ecfdf5;
      color: #047857;
      font-size: 12px;
      font-weight: 900;
      border: 1px solid #a7f3d0;
    }

    .stage18-warning-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 6px 10px;
      background: #fff7ed;
      color: #c2410c;
      font-size: 12px;
      font-weight: 900;
      border: 1px solid #fed7aa;
    }

    /* Prevent empty product images from showing broken icons where browsers expose empty src. */
    img[src=""],
    img:not([src]) {
      display: none !important;
    }

    /* Make modal close buttons clearly clickable. */
    .sy-live-close,
    #adminAISuiteV2Close,
    .admin-ai-close {
      cursor: pointer !important;
      user-select: none !important;
    }

    /* Mobile polish so floating buttons do not cover too much of the screen. */
    @media (max-width: 720px) {
      #adminAISuiteV2Launcher,
      #syLiveStudioLauncher,
      #syLiveWatchLauncher {
        font-size: 12px !important;
        padding: 10px 12px !important;
      }

      #adminAISuiteV2Launcher {
        right: 10px !important;
        bottom: 188px !important;
      }

      #syLiveStudioLauncher {
        left: 10px !important;
        bottom: 132px !important;
      }

      #syLiveWatchLauncher {
        left: 10px !important;
        bottom: 180px !important;
      }
    }
  `;
  document.head.appendChild(stage18Style);

  function hideOldAdminAIParts() {
    const oldLauncher = document.getElementById("adminAILauncher");
    if (oldLauncher) {
      oldLauncher.style.display = "none";
      oldLauncher.style.visibility = "hidden";
      oldLauncher.style.pointerEvents = "none";
      oldLauncher.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll(".admin-ai-launcher").forEach((button) => {
      if (button.id !== "adminAISuiteV2Launcher") {
        button.style.display = "none";
        button.style.visibility = "hidden";
        button.style.pointerEvents = "none";
        button.setAttribute("aria-hidden", "true");
      }
    });
  }

  function closeOldAdminAIPanelIfOpen() {
    const oldBackdrop = document.getElementById("adminAIBackdrop");
    if (oldBackdrop && oldBackdrop.style.display !== "none") {
      oldBackdrop.style.display = "none";
      oldBackdrop.setAttribute("aria-hidden", "true");
    }
  }

  function keepOnlyOneButton(selector, preferredId) {
    const buttons = Array.from(document.querySelectorAll(selector));
    const preferred = preferredId ? document.getElementById(preferredId) : null;

    buttons.forEach((button, index) => {
      if (preferred && button === preferred) return;

      if (!preferred && index === 0) return;

      button.style.display = "none";
      button.style.visibility = "hidden";
      button.style.pointerEvents = "none";
      button.setAttribute("aria-hidden", "true");
    });
  }

  function normalizeFloatingButtons() {
    const ai = document.getElementById("adminAISuiteV2Launcher");
    if (ai) {
      ai.textContent = "🧠 Admin AI Suite";
      ai.title = "Open corrected Admin AI Suite";
    }

    const studio = document.getElementById("syLiveStudioLauncher");
    if (studio) {
      studio.textContent = "🔴 Live Studio";
      studio.title = "Start or manage seller live sessions";
    }

    const watch = document.getElementById("syLiveWatchLauncher");
    if (watch) {
      watch.textContent = "📺 Live Sellers";
      watch.title = "Join active seller live sessions";
    }
  }

  function removeDuplicateFloatingButtons() {
    keepOnlyOneButton("#adminAISuiteV2Launcher", "adminAISuiteV2Launcher");
    keepOnlyOneButton("#syLiveStudioLauncher", "syLiveStudioLauncher");
    keepOnlyOneButton("#syLiveWatchLauncher", "syLiveWatchLauncher");
  }

  function addStage18StatusBadge() {
    if (document.getElementById("stage18StatusBadge")) return;

    const badge = document.createElement("div");
    badge.id = "stage18StatusBadge";
    badge.className = "stage18-ready-badge";
    badge.style.position = "fixed";
    badge.style.right = "18px";
    badge.style.bottom = "18px";
    badge.style.zIndex = "12999";
    badge.style.boxShadow = "0 10px 25px rgba(15,23,42,.12)";
    badge.textContent = "Ready: PostgreSQL · Daraja · Cloudinary · Live";

    document.body.appendChild(badge);

    setTimeout(() => {
      if (badge) badge.style.display = "none";
    }, 7000);
  }

  function fixBlankProductImages() {
    document.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (!src || src.trim() === "") {
        img.style.display = "none";
        img.setAttribute("aria-hidden", "true");
      }
    });
  }

  function runStage18Cleanup() {
    hideOldAdminAIParts();
    closeOldAdminAIPanelIfOpen();
    removeDuplicateFloatingButtons();
    normalizeFloatingButtons();
    fixBlankProductImages();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(runStage18Cleanup, 400);
    setTimeout(runStage18Cleanup, 1200);
    setTimeout(runStage18Cleanup, 2600);
    setTimeout(addStage18StatusBadge, 1600);
  });

  document.addEventListener("click", () => {
    setTimeout(runStage18Cleanup, 250);
  });

  window.addEventListener("focus", runStage18Cleanup);
  window.sokoyetuStage18Cleanup = runStage18Cleanup;
})();



// ================================
// SokoYetu Stage 20P: Hard Reset Checkout JavaScript
// Lightweight recovery after cart/checkout modal conflicts.
// Sends checkout/cart navigation to checkout.html without heavy observers or modal sync.
// ================================
(function initStage20PHardResetCheckoutJavaScript() {
  if (window.__sokoyetuStage20PInstalled) return;
  window.__sokoyetuStage20PInstalled = true;

  function goToCheckout(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.location.href = "/checkout.html";
  }

  function ensureCheckoutButton() {
    if (!document.body) return;

    // Remove old modal elements if they exist.
    var oldBackdrop = document.getElementById("syCustomerCartBackdrop");
    if (oldBackdrop) oldBackdrop.remove();

    var oldLauncher = document.getElementById("syCustomerCartLauncher");
    if (oldLauncher) oldLauncher.remove();

    if (!document.getElementById("syStage20PCheckoutStyle")) {
      var style = document.createElement("style");
      style.id = "syStage20PCheckoutStyle";
      style.textContent =
        "#syStage20PCheckoutBtn{position:fixed;right:18px;bottom:22px;z-index:19000;border:none;border-radius:999px;background:linear-gradient(135deg,#16a34a,#064e3b);color:#fff;font-weight:900;padding:13px 17px;box-shadow:0 18px 45px rgba(15,23,42,.28);cursor:pointer}" +
        "#syCustomerCartBackdrop,.sy-customer-cart-backdrop,#syCustomerCartLauncher{display:none!important;visibility:hidden!important;pointer-events:none!important}" +
        "@media(max-width:720px){#syStage20PCheckoutBtn{right:10px;bottom:14px;padding:11px 13px;font-size:13px}}";
      document.head.appendChild(style);
    }

    var button = document.getElementById("syStage20PCheckoutBtn");
    if (!button) {
      button = document.createElement("button");
      button.id = "syStage20PCheckoutBtn";
      button.type = "button";
      button.textContent = "✅ Secure Checkout";
      button.addEventListener("click", goToCheckout);
      document.body.appendChild(button);
    }
  }

  function isCheckoutClick(element) {
    if (!element) return false;

    var text = String(element.textContent || "").toLowerCase().trim();
    var id = String(element.id || "").toLowerCase();
    var className = String(element.className || "").toLowerCase();

    if (text.includes("add to cart")) return false;
    if (text.includes("send m-pesa")) return false;
    if (text.includes("stk push")) return false;

    return (
      id === "systage20pcheckoutbtn" ||
      text === "cart" ||
      text.includes("cart / checkout") ||
      text.includes("secure checkout") ||
      text.includes("view cart") ||
      text === "checkout" ||
      className.includes("checkout")
    );
  }

  document.addEventListener("click", function (event) {
    var clicked = event.target && event.target.closest ? event.target.closest("button, a, [role='button']") : null;
    if (!clicked || !isCheckoutClick(clicked)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.location.href = "/checkout.html";
  }, true);

  document.addEventListener("DOMContentLoaded", ensureCheckoutButton);

  if (document.readyState !== "loading") {
    ensureCheckoutButton();
  }
})();


// SokoYetu Stage 36B: Checkout routing repair
// Sends cart and M-PESA checkout buttons to checkout.html so buyers can choose Home delivery or Self-pickup.
(function initStage36BCheckoutRoutingRepair() {
  function goToSokoYetuCheckout(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.location.href = "/checkout.html";
  }

  function isCheckoutRouteClick(element) {
    if (!element) return false;

    const clickable = element.closest ? element.closest("button, a, [onclick], .quick-card, .btn") : null;
    if (!clickable) return false;

    const text = String(clickable.textContent || "").toLowerCase().replace(/\s+/g, " ").trim();
    const onclick = String(clickable.getAttribute && clickable.getAttribute("onclick") || "").toLowerCase();
    const id = String(clickable.id || "").toLowerCase();

    if (onclick.includes("mpesamodal")) return true;
    if (id === "systage20pcheckoutbtn") return true;
    if (text === "checkout") return true;
    if (text.includes("secure checkout")) return true;
    if (text.includes("checkout with m-pesa")) return true;
    if (text.includes("m-pesa checkout")) return true;

    return false;
  }

  document.addEventListener("click", function(event) {
    const target = event.target;
    if (isCheckoutRouteClick(target)) goToSokoYetuCheckout(event);
  }, true);

  window.goToSokoYetuCheckout = goToSokoYetuCheckout;
})();

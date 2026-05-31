(function () {
  const BRAND = "SokoYetu Mtaani";
  const TITLE = "SokoYetu Mtaani | Online Shopping & Marketplace in Kenya";
  const DESCRIPTION =
    "Shop online at SokoYetu Mtaani, Kenya's local online marketplace for trusted sellers, M-PESA payments, quality products, pickup, delivery, and customer support.";
  const DOMAIN = "https://www.mysokoyetu.co.ke/";

  function setMeta(selector, attrName, attrValue, content) {
    let tag = document.head.querySelector(selector);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attrName, attrValue);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  }

  function setCanonical() {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", DOMAIN);
  }

  function makeWordmark() {
    const wrapper = document.createElement("span");
    wrapper.className = "sy-final-wordmark";
    wrapper.setAttribute("aria-label", BRAND);

    const soko = document.createElement("span");
    soko.className = "sy-final-soko";
    soko.textContent = "Soko";

    const yetu = document.createElement("span");
    yetu.className = "sy-final-yetu";
    yetu.textContent = "Yetu";

    const mtaani = document.createElement("span");
    mtaani.className = "sy-final-mtaani";
    mtaani.textContent = "Mtaani";

    wrapper.appendChild(soko);
    wrapper.appendChild(yetu);
    wrapper.appendChild(mtaani);
    return wrapper;
  }

  function normalizeExistingWordmarks() {
    document.querySelectorAll(".sy-wordmark, .sy-brand-logo, .sy-final-wordmark").forEach((node) => {
      const parent = node.parentElement;
      const replacement = makeWordmark();
      node.replaceWith(replacement);
      markBrandContainer(replacement, parent);
    });
  }

  function markBrandContainer(wordmark, fallbackParent) {
    let container =
      wordmark.closest("a") ||
      wordmark.closest(".logo") ||
      wordmark.closest(".brand") ||
      wordmark.closest(".brand-name") ||
      wordmark.closest("[class*='logo']") ||
      wordmark.closest("[class*='brand']") ||
      fallbackParent ||
      wordmark.parentElement;

    if (!container) return;

    // Avoid marking the whole header if the actual logo container is available.
    if (/^(HEADER|NAV)$/i.test(container.tagName) && wordmark.parentElement) {
      container = wordmark.parentElement;
    }

    container.classList.add("sy-final-brand-anchor");
    container.style.overflow = "visible";
    container.style.whiteSpace = "nowrap";
    container.style.flexShrink = "0";
  }

  function replaceBrandTextInHeader() {
    const roots = document.querySelectorAll(
      "header, nav, .header, .site-header, .main-header, .header-main, .navbar, .top-header, .logo, .brand, .brand-name, footer, h1"
    );

    roots.forEach((root) => {
      if (!root || root.closest(".sy-final-wordmark")) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
          if (node.parentElement && node.parentElement.closest(".sy-final-wordmark, script, style, textarea, input, select")) {
            return NodeFilter.FILTER_REJECT;
          }

          const text = node.nodeValue.replace(/\s+/g, " ").trim();
          if (text.includes("SokoYetu Mtaani") || text.includes("SokoYetuMtaani") || text === "SokoYetu") {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        },
      });

      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach((textNode) => {
        const original = textNode.nodeValue;
        const normalized = original.replace("SokoYetuMtaani", "SokoYetu Mtaani");
        let phrase = null;

        if (normalized.includes("SokoYetu Mtaani")) phrase = "SokoYetu Mtaani";
        else if (normalized.trim() === "SokoYetu") phrase = "SokoYetu";

        if (!phrase) return;

        const index = normalized.indexOf(phrase);
        const before = normalized.slice(0, index);
        const after = normalized.slice(index + phrase.length);

        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        const wordmark = makeWordmark();
        frag.appendChild(wordmark);
        if (after) frag.appendChild(document.createTextNode(after));

        const parent = textNode.parentElement;
        textNode.parentNode.replaceChild(frag, textNode);
        markBrandContainer(wordmark, parent);
      });
    });
  }

  function protectSearchSpacing() {
    const wordmark = document.querySelector(".sy-final-wordmark");
    if (!wordmark) return;

    const header = wordmark.closest("header, nav, .header, .site-header, .main-header, .header-main, .navbar, .top-header");
    if (!header) return;

    const brand = wordmark.closest(".sy-final-brand-anchor") || wordmark.parentElement;
    if (brand) {
      brand.classList.add("sy-final-brand-anchor");
      brand.style.flex = "0 0 265px";
      brand.style.width = "265px";
      brand.style.minWidth = "265px";
      brand.style.maxWidth = "265px";
      brand.style.overflow = "visible";
      brand.style.zIndex = "20";
      brand.style.position = "relative";
    }

    const searchInput = header.querySelector('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]');
    if (searchInput) {
      const form = searchInput.closest("form") || searchInput.parentElement;
      if (form && form !== brand) {
        form.style.flex = "1 1 auto";
        form.style.minWidth = "260px";
        form.style.marginLeft = "12px";
        form.style.position = "relative";
        form.style.zIndex = "1";
      }
    }
  }

  function applyRuntimeSEO() {
    document.title = TITLE;
    setMeta('meta[name="description"]', "name", "description", DESCRIPTION);
    setMeta('meta[name="robots"]', "name", "robots", "index, follow, max-image-preview:large");
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", BRAND);
    setMeta('meta[property="og:title"]', "property", "og:title", TITLE);
    setMeta('meta[property="og:description"]', "property", "og:description", DESCRIPTION);
    setMeta('meta[property="og:url"]', "property", "og:url", DOMAIN);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", TITLE);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", DESCRIPTION);
    setCanonical();
  }

  function run() {
    applyRuntimeSEO();
    normalizeExistingWordmarks();
    replaceBrandTextInHeader();
    protectSearchSpacing();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("load", protectSearchSpacing);
})();

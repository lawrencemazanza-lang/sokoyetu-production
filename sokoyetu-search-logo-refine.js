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

  function setSEO() {
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

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = DOMAIN;
  }

  function makeWordmark() {
    const wrapper = document.createElement("span");
    wrapper.className = "sy-refined-wordmark";
    wrapper.setAttribute("aria-label", BRAND);

    const soko = document.createElement("span");
    soko.className = "sy-refined-soko";
    soko.textContent = "Soko";

    const yetu = document.createElement("span");
    yetu.className = "sy-refined-yetu";
    yetu.textContent = "Yetu";

    const mtaani = document.createElement("span");
    mtaani.className = "sy-refined-mtaani";
    mtaani.textContent = "Mtaani";

    wrapper.appendChild(soko);
    wrapper.appendChild(yetu);
    wrapper.appendChild(mtaani);

    return wrapper;
  }

  function markContainer(wordmark) {
    let container =
      wordmark.closest("a") ||
      wordmark.closest(".logo") ||
      wordmark.closest(".brand") ||
      wordmark.closest(".brand-name") ||
      wordmark.closest("[class*='logo']") ||
      wordmark.closest("[class*='brand']") ||
      wordmark.parentElement;

    if (!container) return;

    if (/^(HEADER|NAV)$/i.test(container.tagName) && wordmark.parentElement) {
      container = wordmark.parentElement;
    }

    container.classList.add("sy-refined-brand-anchor");
    container.style.flex = "0 0 248px";
    container.style.width = "248px";
    container.style.minWidth = "248px";
    container.style.maxWidth = "248px";
    container.style.overflow = "visible";
    container.style.whiteSpace = "nowrap";
    container.style.position = "relative";
    container.style.zIndex = "50";
  }

  function replaceOldWordmarkNodes() {
    const oldNodes = document.querySelectorAll(".sy-final-wordmark, .sy-wordmark, .sy-brand-logo, .sy-refined-wordmark");
    oldNodes.forEach((oldNode) => {
      const fresh = makeWordmark();
      oldNode.replaceWith(fresh);
      markContainer(fresh);
    });
  }

  function replacePlainBrandText() {
    const roots = document.querySelectorAll(
      "header, nav, .header, .site-header, .main-header, .header-main, .navbar, .top-header, .logo, .brand, .brand-name, footer, h1"
    );

    roots.forEach((root) => {
      if (!root || root.closest(".sy-refined-wordmark")) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
          if (node.parentElement && node.parentElement.closest(".sy-refined-wordmark, script, style, textarea, input, select")) {
            return NodeFilter.FILTER_REJECT;
          }
          const text = node.nodeValue.replace(/\s+/g, " ").trim();
          if (text.includes("SokoYetu Mtaani") || text.includes("SokoYetuMtaani") || text === "SokoYetu") {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      });

      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach((textNode) => {
        const text = textNode.nodeValue.replace("SokoYetuMtaani", "SokoYetu Mtaani");
        let phrase = null;
        if (text.includes("SokoYetu Mtaani")) phrase = "SokoYetu Mtaani";
        else if (text.trim() === "SokoYetu") phrase = "SokoYetu";
        if (!phrase) return;

        const index = text.indexOf(phrase);
        const fragment = document.createDocumentFragment();
        const before = text.slice(0, index);
        const after = text.slice(index + phrase.length);

        if (before) fragment.appendChild(document.createTextNode(before));
        const wordmark = makeWordmark();
        fragment.appendChild(wordmark);
        if (after) fragment.appendChild(document.createTextNode(after));

        textNode.parentNode.replaceChild(fragment, textNode);
        markContainer(wordmark);
      });
    });
  }

  function refineHeaderLayout() {
    const wordmark = document.querySelector(".sy-refined-wordmark");
    if (!wordmark) return;

    markContainer(wordmark);

    const header = wordmark.closest("header, nav, .header, .site-header, .main-header, .header-main, .navbar, .top-header");
    if (!header) return;

    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.gap = "1rem";
    header.style.overflow = "visible";

    const searchInput = header.querySelector('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]');
    if (searchInput) {
      const searchBox = searchInput.closest("form") || searchInput.closest(".search-bar, .search-box, .search-form, .search-container") || searchInput.parentElement;
      if (searchBox) {
        searchBox.style.flex = "0 1 620px";
        searchBox.style.width = "min(48vw, 620px)";
        searchBox.style.maxWidth = "620px";
        searchBox.style.minWidth = "320px";
        searchBox.style.marginLeft = "1.4rem";
        searchBox.style.marginRight = "0.55rem";
        searchBox.style.position = "relative";
        searchBox.style.zIndex = "1";
      }
    }
  }

  function run() {
    setSEO();
    replaceOldWordmarkNodes();
    replacePlainBrandText();
    refineHeaderLayout();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("load", refineHeaderLayout);
})();

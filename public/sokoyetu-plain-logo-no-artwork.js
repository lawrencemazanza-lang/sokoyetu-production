(function () {
  function makeWordmark() {
    const wrapper = document.createElement("span");
    wrapper.className = "sy-plain-wordmark";
    wrapper.setAttribute("aria-label", "SokoYetu Mtaani");

    const soko = document.createElement("span");
    soko.className = "sy-plain-soko";
    soko.textContent = "Soko";

    const yetu = document.createElement("span");
    yetu.className = "sy-plain-yetu";
    yetu.textContent = "Yetu";

    const mtaani = document.createElement("span");
    mtaani.className = "sy-plain-mtaani";
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

    container.classList.add("sy-plain-brand-anchor");
    container.style.textDecoration = "none";
    container.style.borderBottom = "0";
    container.style.boxShadow = "none";
    container.style.backgroundImage = "none";
    container.style.overflow = "visible";
    container.style.whiteSpace = "nowrap";
    container.style.flex = "0 0 238px";
    container.style.width = "238px";
    container.style.minWidth = "238px";
    container.style.maxWidth = "238px";
    container.style.position = "relative";
    container.style.zIndex = "80";
  }

  function removeDecorativeTextNodes(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const parent = node.parentElement;
      if (!parent) return;
      if (!parent.closest("header, nav, .header, .site-header, .main-header, .header-main, .navbar, .top-header, .logo, .brand, .brand-name")) return;
      const t = node.nodeValue.trim();

      // Remove tiny decorative marks that older scripts/styles may have left as real text.
      if (/^[â€¢Â·*"'`~^Â¨Â´Ë™ËËŠË‹Ë˜ËšË‡Ë‰\-_=]{1,4}$/.test(t)) {
        node.nodeValue = "";
      }
    });
  }

  function normalizeWordmarks() {
    document.querySelectorAll(".sy-refined-wordmark, .sy-final-wordmark, .sy-simple-wordmark, .sy-wordmark, .sy-brand-logo, .sy-plain-wordmark").forEach((node) => {
      const fresh = makeWordmark();
      node.replaceWith(fresh);
      markContainer(fresh);
    });
  }

  function replacePlainTextBrand() {
    const roots = document.querySelectorAll(
      "header, nav, .header, .site-header, .main-header, .header-main, .navbar, .top-header, .logo, .brand, .brand-name, footer, h1"
    );

    roots.forEach((root) => {
      if (!root || root.closest(".sy-plain-wordmark")) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
          if (node.parentElement && node.parentElement.closest(".sy-plain-wordmark, script, style, textarea, input, select")) {
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

  function fixHeaderSearchSpacing() {
    const wordmark = document.querySelector(".sy-plain-wordmark");
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
        searchBox.style.flex = "0 1 600px";
        searchBox.style.width = "min(46vw, 600px)";
        searchBox.style.maxWidth = "600px";
        searchBox.style.minWidth = "300px";
        searchBox.style.marginLeft = "1.5rem";
        searchBox.style.marginRight = "0.6rem";
        searchBox.style.position = "relative";
        searchBox.style.zIndex = "1";
      }
    }
  }

  function run() {
    removeDecorativeTextNodes(document.body);
    normalizeWordmarks();
    replacePlainTextBrand();
    removeDecorativeTextNodes(document.body);
    fixHeaderSearchSpacing();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("load", run);
})();

@echo off
setlocal EnableExtensions

echo.
echo ============================================
echo  SokoYetu Search Bar + Logo Artwork Refinement
echo ============================================
echo.

set "PROJECT_ROOT=%CD%"
if not exist "%PROJECT_ROOT%\index.html" (
  set "PROJECT_ROOT=C:\Users\PC\Desktop\sokoyetu-fullstack\sokoyetu-elite-checked-fixed"
)

echo Project folder:
echo %PROJECT_ROOT%
echo.

if not exist "%PROJECT_ROOT%\index.html" (
  echo ERROR: I cannot find index.html in this folder.
  echo Copy this CMD file into:
  echo C:\Users\PC\Desktop\sokoyetu-fullstack\sokoyetu-elite-checked-fixed
  echo Then run it again.
  pause
  exit /b 1
)

set "TMP_PS1=%TEMP%\sokoyetu_search_logo_refine_%RANDOM%.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%~f0'; $out='%TMP_PS1%'; $lines=Get-Content -LiteralPath $p; $i=[array]::IndexOf($lines,'#BEGINPS1'); if($i -lt 0){ throw 'PowerShell payload not found.' }; $lines[($i+1)..($lines.Length-1)] | Set-Content -LiteralPath $out -Encoding UTF8"

powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" -ProjectRoot "%PROJECT_ROOT%"
set "ERR=%ERRORLEVEL%"

del "%TMP_PS1%" >nul 2>nul

echo.
if "%ERR%"=="0" (
  echo Refinement finished.
  echo.
  echo Now run:
  echo npm run dev
  echo.
  echo Open http://localhost:5173/ and press Ctrl + F5.
) else (
  echo Refinement failed. Please send me the error above.
)
echo.
pause
exit /b %ERR%

#BEGINPS1
param(
    [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Applying refined search bar spacing and logo artwork..." -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

function Backup([string]$path) {
    $backup = "$path.bak-search-logo-refine"
    if (!(Test-Path -LiteralPath $backup)) {
        Copy-Item -LiteralPath $path -Destination $backup
    }
}

function EnsureBeforeHeadClose([string]$html, [string]$tag) {
    if ($html.Contains($tag)) { return $html }
    if ($html -match "</head>") {
        return $html -replace "</head>", "  $tag`r`n</head>"
    }
    return $tag + "`r`n" + $html
}

function EnsureBeforeBodyClose([string]$html, [string]$tag) {
    if ($html.Contains($tag)) { return $html }
    if ($html -match "</body>") {
        return $html -replace "</body>", "  $tag`r`n</body>"
    }
    return $html + "`r`n" + $tag
}

$css = @'
/* SokoYetu refined header: smaller artistic logo + shorter search bar */
:root {
  --sy-art-black: #111827;
  --sy-art-green: #057a55;
  --sy-art-orange: #f97316;
  --sy-art-orange-dark: #ea580c;
  --sy-art-cream: #fff7ed;
}

/* Brand container: enough room for the full wordmark, but not oversized */
.sy-final-brand-anchor,
.sy-refined-brand-anchor,
a:has(.sy-refined-wordmark),
.logo:has(.sy-refined-wordmark),
.brand:has(.sy-refined-wordmark),
.brand-name:has(.sy-refined-wordmark),
[class*="logo"]:has(.sy-refined-wordmark),
[class*="brand"]:has(.sy-refined-wordmark) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 0.48rem !important;
  flex: 0 0 248px !important;
  width: 248px !important;
  min-width: 248px !important;
  max-width: 248px !important;
  overflow: visible !important;
  white-space: nowrap !important;
  position: relative !important;
  z-index: 50 !important;
  text-decoration: none !important;
  padding-right: 0.65rem !important;
}

/* Keep the original cart/icon visible */
.sy-refined-brand-anchor img,
.sy-refined-brand-anchor svg,
.sy-refined-brand-anchor .logo-icon,
.sy-refined-brand-anchor .brand-icon,
.sy-refined-brand-anchor [class*="icon"],
.sy-final-brand-anchor img,
.sy-final-brand-anchor svg,
.sy-final-brand-anchor .logo-icon,
.sy-final-brand-anchor .brand-icon,
.sy-final-brand-anchor [class*="icon"] {
  flex: 0 0 auto !important;
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  max-width: 44px !important;
  max-height: 44px !important;
}

/* Smaller but more attractive 3-color wordmark */
.sy-refined-wordmark,
.sy-final-wordmark {
  display: inline-flex !important;
  align-items: baseline !important;
  gap: 0 !important;
  white-space: nowrap !important;
  font-size: clamp(1.02rem, 1.35vw, 1.28rem) !important;
  font-weight: 950 !important;
  letter-spacing: -0.052em !important;
  line-height: 1 !important;
  font-family: Inter, "Segoe UI", Arial, sans-serif !important;
  position: relative !important;
  padding: 0.14rem 0.12rem 0.28rem 0 !important;
  text-decoration: none !important;
  text-shadow: 0 1px 0 rgba(255,255,255,0.65);
}

.sy-refined-wordmark::after,
.sy-final-wordmark::after {
  content: "" !important;
  position: absolute !important;
  left: 2px !important;
  right: 2px !important;
  bottom: 0.03rem !important;
  height: 3px !important;
  border-radius: 999px !important;
  background: linear-gradient(90deg, var(--sy-art-black) 0 33%, var(--sy-art-green) 33% 66%, var(--sy-art-orange) 66% 100%) !important;
  opacity: 0.9 !important;
}

.sy-refined-soko,
.sy-final-soko {
  color: var(--sy-art-black) !important;
}

.sy-refined-yetu,
.sy-final-yetu {
  color: var(--sy-art-green) !important;
}

.sy-refined-mtaani,
.sy-final-mtaani {
  color: var(--sy-art-orange) !important;
  margin-left: 0.10em !important;
}

/* Small orange market spark. It makes the logo feel like artwork without hiding the icon. */
.sy-refined-wordmark::before,
.sy-final-wordmark::before {
  content: "•" !important;
  position: absolute !important;
  top: -0.42rem !important;
  right: -0.32rem !important;
  color: var(--sy-art-orange) !important;
  font-size: 0.65rem !important;
  line-height: 1 !important;
}

/* Header layout: brand left, shorter search bar shifted right, account/help/cart after it */
header:has(.sy-refined-wordmark),
.site-header:has(.sy-refined-wordmark),
.main-header:has(.sy-refined-wordmark),
.header-main:has(.sy-refined-wordmark),
.navbar:has(.sy-refined-wordmark),
.top-header:has(.sy-refined-wordmark),
header:has(.sy-final-wordmark),
.site-header:has(.sy-final-wordmark),
.main-header:has(.sy-final-wordmark),
.header-main:has(.sy-final-wordmark),
.navbar:has(.sy-final-wordmark),
.top-header:has(.sy-final-wordmark) {
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
  overflow: visible !important;
}

/* Reduce the search bar and push it away from the logo */
header:has(.sy-refined-wordmark) form,
.site-header:has(.sy-refined-wordmark) form,
.main-header:has(.sy-refined-wordmark) form,
.header-main:has(.sy-refined-wordmark) form,
.navbar:has(.sy-refined-wordmark) form,
.top-header:has(.sy-refined-wordmark) form,
header:has(.sy-final-wordmark) form,
.site-header:has(.sy-final-wordmark) form,
.main-header:has(.sy-final-wordmark) form,
.header-main:has(.sy-final-wordmark) form,
.navbar:has(.sy-final-wordmark) form,
.top-header:has(.sy-final-wordmark) form,
header:has(.sy-refined-wordmark) .search-bar,
header:has(.sy-refined-wordmark) .search-box,
header:has(.sy-refined-wordmark) .search-form,
header:has(.sy-final-wordmark) .search-bar,
header:has(.sy-final-wordmark) .search-box,
header:has(.sy-final-wordmark) .search-form {
  flex: 0 1 620px !important;
  width: min(48vw, 620px) !important;
  max-width: 620px !important;
  min-width: 320px !important;
  margin-left: 1.4rem !important;
  margin-right: 0.55rem !important;
  position: relative !important;
  z-index: 1 !important;
}

/* Make the input and search button match the smaller width cleanly */
header:has(.sy-refined-wordmark) input[type="search"],
header:has(.sy-refined-wordmark) input[placeholder*="Search"],
header:has(.sy-refined-wordmark) input[placeholder*="search"],
header:has(.sy-final-wordmark) input[type="search"],
header:has(.sy-final-wordmark) input[placeholder*="Search"],
header:has(.sy-final-wordmark) input[placeholder*="search"] {
  min-width: 0 !important;
  width: 100% !important;
}

/* If the project uses a container around search input and button */
header:has(.sy-refined-wordmark) .search-container,
header:has(.sy-final-wordmark) .search-container {
  width: min(48vw, 620px) !important;
  max-width: 620px !important;
  margin-left: 1.4rem !important;
}

/* Ensure right-side nav links remain visible */
header:has(.sy-refined-wordmark) nav,
header:has(.sy-refined-wordmark) .header-actions,
header:has(.sy-refined-wordmark) .account-links,
header:has(.sy-final-wordmark) nav,
header:has(.sy-final-wordmark) .header-actions,
header:has(.sy-final-wordmark) .account-links {
  flex: 0 0 auto !important;
}

/* Smaller screens */
@media (max-width: 1100px) {
  .sy-final-brand-anchor,
  .sy-refined-brand-anchor,
  a:has(.sy-refined-wordmark),
  .logo:has(.sy-refined-wordmark),
  .brand:has(.sy-refined-wordmark),
  .brand-name:has(.sy-refined-wordmark) {
    flex-basis: 230px !important;
    width: 230px !important;
    min-width: 230px !important;
    max-width: 230px !important;
  }

  header:has(.sy-refined-wordmark) form,
  header:has(.sy-final-wordmark) form,
  header:has(.sy-refined-wordmark) .search-bar,
  header:has(.sy-final-wordmark) .search-bar,
  header:has(.sy-refined-wordmark) .search-box,
  header:has(.sy-final-wordmark) .search-box,
  header:has(.sy-refined-wordmark) .search-form,
  header:has(.sy-final-wordmark) .search-form {
    width: min(43vw, 540px) !important;
    max-width: 540px !important;
    min-width: 260px !important;
    margin-left: 0.9rem !important;
  }
}

@media (max-width: 760px) {
  header:has(.sy-refined-wordmark),
  header:has(.sy-final-wordmark),
  .site-header:has(.sy-refined-wordmark),
  .site-header:has(.sy-final-wordmark),
  .main-header:has(.sy-refined-wordmark),
  .main-header:has(.sy-final-wordmark),
  .header-main:has(.sy-refined-wordmark),
  .header-main:has(.sy-final-wordmark) {
    flex-wrap: wrap !important;
    gap: 0.55rem !important;
  }

  .sy-final-brand-anchor,
  .sy-refined-brand-anchor,
  a:has(.sy-refined-wordmark),
  .logo:has(.sy-refined-wordmark),
  .brand:has(.sy-refined-wordmark),
  .brand-name:has(.sy-refined-wordmark) {
    flex-basis: auto !important;
    width: auto !important;
    min-width: 205px !important;
    max-width: none !important;
  }

  header:has(.sy-refined-wordmark) form,
  header:has(.sy-final-wordmark) form,
  header:has(.sy-refined-wordmark) .search-bar,
  header:has(.sy-final-wordmark) .search-bar,
  header:has(.sy-refined-wordmark) .search-box,
  header:has(.sy-final-wordmark) .search-box,
  header:has(.sy-refined-wordmark) .search-form,
  header:has(.sy-final-wordmark) .search-form {
    flex: 1 1 100% !important;
    width: 100% !important;
    max-width: none !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
'@

$js = @'
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
'@

$publicDir = Join-Path $ProjectRoot "public"
if (!(Test-Path -LiteralPath $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir | Out-Null
}

Set-Content -LiteralPath (Join-Path $ProjectRoot "sokoyetu-search-logo-refine.css") -Value $css -Encoding UTF8
Set-Content -LiteralPath (Join-Path $ProjectRoot "sokoyetu-search-logo-refine.js") -Value $js -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-search-logo-refine.css") -Value $css -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-search-logo-refine.js") -Value $js -Encoding UTF8

$changedHtml = 0
$htmlFiles = Get-ChildItem -LiteralPath $ProjectRoot -Filter "*.html" -File

foreach ($file in $htmlFiles) {
    $path = $file.FullName
    $html = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    $original = $html

    $html = EnsureBeforeHeadClose $html '<link rel="stylesheet" href="/sokoyetu-search-logo-refine.css">'
    $html = EnsureBeforeBodyClose $html '<script src="/sokoyetu-search-logo-refine.js" defer></script>'

    if ($html -ne $original) {
        Backup $path
        Set-Content -LiteralPath $path -Value $html -Encoding UTF8
        $changedHtml++
        Write-Host "Updated HTML: $path" -ForegroundColor Green
    }
}

$report = @"
SokoYetu Search + Logo Refinement Report

Changes:
- Search bar reduced to a maximum width of about 620px on desktop.
- Search bar is pushed to the right using extra left margin.
- Brand container reserves about 248px so the search bar cannot cover Mtaani.
- Logo text is smaller and more polished.
- Three-color wordmark:
  - Soko = black (#111827)
  - Yetu = green (#057a55)
  - Mtaani = orange (#f97316)
- Decorative three-color underline added under the wordmark.
- Small orange spark added above the wordmark.
- SEO runtime tags are kept active.

How to test:
1. npm run dev
2. Open http://localhost:5173/
3. Press Ctrl + F5
4. Confirm Mtaani is fully visible and the search bar starts after the full name.

Deploy:
git add .
git commit -m "Refine SokoYetu logo artwork and search bar spacing"
git push
"@

Set-Content -LiteralPath (Join-Path $ProjectRoot "SEARCH-LOGO-REFINE-REPORT.txt") -Value $report -Encoding UTF8

Write-Host ""
Write-Host "Created:" -ForegroundColor Green
Write-Host "- sokoyetu-search-logo-refine.css"
Write-Host "- sokoyetu-search-logo-refine.js"
Write-Host "- SEARCH-LOGO-REFINE-REPORT.txt"
Write-Host ""
Write-Host "HTML files updated: $changedHtml"
Write-Host ""
Write-Host "Next:"
Write-Host "1. npm run dev"
Write-Host "2. Open http://localhost:5173/"
Write-Host "3. Press Ctrl + F5"
Write-Host ""

exit 0

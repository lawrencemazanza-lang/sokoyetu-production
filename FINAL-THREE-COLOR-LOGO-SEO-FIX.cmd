@echo off
setlocal EnableExtensions

echo.
echo ============================================
echo  SokoYetu Final Three-Color Logo + SEO Fix
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

set "TMP_PS1=%TEMP%\sokoyetu_final_logo_seo_%RANDOM%.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%~f0'; $out='%TMP_PS1%'; $lines=Get-Content -LiteralPath $p; $i=[array]::IndexOf($lines,'#BEGINPS1'); if($i -lt 0){ throw 'PowerShell payload not found.' }; $lines[($i+1)..($lines.Length-1)] | Set-Content -LiteralPath $out -Encoding UTF8"

powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" -ProjectRoot "%PROJECT_ROOT%"
set "ERR=%ERRORLEVEL%"

del "%TMP_PS1%" >nul 2>nul

echo.
if "%ERR%"=="0" (
  echo Final three-color logo and SEO fix finished.
  echo.
  echo Now run:
  echo npm run dev
  echo.
  echo Then open http://localhost:5173/ and press Ctrl + F5.
) else (
  echo Fix failed. Please send me the error shown above.
)
echo.
pause
exit /b %ERR%

#BEGINPS1
param(
    [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"

$BrandName = "SokoYetu Mtaani"
$Domain = "https://www.mysokoyetu.co.ke"
$SeoTitle = "SokoYetu Mtaani | Online Shopping & Marketplace in Kenya"
$SeoDescription = "Shop online at SokoYetu Mtaani, Kenya's local online marketplace for trusted sellers, M-PESA payments, quality products, pickup, delivery, and customer support."

Write-Host ""
Write-Host "Applying final three-color logo and static SEO..." -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

function Backup([string]$path) {
    $backup = "$path.bak-final-three-color-seo"
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

function UpsertTag([string]$html, [string]$pattern, [string]$tag) {
    if ($html -match $pattern) {
        return [regex]::Replace($html, $pattern, $tag, 1)
    }
    return EnsureBeforeHeadClose $html $tag
}

function RemoveTagByPattern([string]$html, [string]$pattern) {
    return [regex]::Replace($html, $pattern, "`r`n")
}

$finalCss = @'
/* Final SokoYetu Mtaani header wordmark: 3 colors + search-bar spacing */
:root {
  --sy-soko: #111827;      /* black */
  --sy-yetu: #006b5a;      /* deep marketplace green */
  --sy-mtaani: #f97316;    /* orange */
  --sy-mtaani-dark: #ea580c;
}

/* The original green cart/logo icon remains visible. This styles only the words. */
.sy-final-wordmark {
  display: inline-flex !important;
  align-items: baseline !important;
  gap: 0 !important;
  white-space: nowrap !important;
  font-weight: 900 !important;
  letter-spacing: -0.045em !important;
  line-height: 1 !important;
  font-size: clamp(1.18rem, 1.75vw, 1.58rem) !important;
  font-family: inherit !important;
  vertical-align: middle !important;
  text-decoration: none !important;
}

.sy-final-soko {
  color: var(--sy-soko) !important;
}

.sy-final-yetu {
  color: var(--sy-yetu) !important;
}

.sy-final-mtaani {
  color: var(--sy-mtaani) !important;
  margin-left: 0.08em !important;
}

/* Reserve enough width for the cart icon + full brand name, so the search bar cannot cover Mtaani. */
.sy-final-brand-anchor {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 0.55rem !important;
  flex: 0 0 265px !important;
  width: 265px !important;
  min-width: 265px !important;
  max-width: 265px !important;
  overflow: visible !important;
  white-space: nowrap !important;
  position: relative !important;
  z-index: 20 !important;
  text-decoration: none !important;
  padding-right: 0.75rem !important;
}

.sy-final-brand-anchor img,
.sy-final-brand-anchor svg,
.sy-final-brand-anchor .logo-icon,
.sy-final-brand-anchor .brand-icon,
.sy-final-brand-anchor [class*="icon"] {
  flex: 0 0 auto !important;
  display: inline-flex !important;
}

/* Make common header layouts respect the reserved brand width. */
header:has(.sy-final-wordmark),
.site-header:has(.sy-final-wordmark),
.main-header:has(.sy-final-wordmark),
.header-main:has(.sy-final-wordmark),
.navbar:has(.sy-final-wordmark),
.top-header:has(.sy-final-wordmark) {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  overflow: visible !important;
}

header:has(.sy-final-wordmark) form,
.site-header:has(.sy-final-wordmark) form,
.main-header:has(.sy-final-wordmark) form,
.header-main:has(.sy-final-wordmark) form,
.navbar:has(.sy-final-wordmark) form,
.top-header:has(.sy-final-wordmark) form,
header:has(.sy-final-wordmark) .search-bar,
header:has(.sy-final-wordmark) .search-box,
header:has(.sy-final-wordmark) .search-form {
  flex: 1 1 auto !important;
  min-width: 260px !important;
  max-width: none !important;
  margin-left: 0.25rem !important;
  position: relative !important;
  z-index: 1 !important;
}

/* Prevent input fields from sitting over the brand name. */
header:has(.sy-final-wordmark) input[type="search"],
header:has(.sy-final-wordmark) input[placeholder*="Search"],
header:has(.sy-final-wordmark) input[placeholder*="search"] {
  min-width: 0 !important;
}

/* Previous scripts/classes are normalized into this final look. */
.sy-wordmark,
.sy-brand-logo,
.brand-logo,
.logo-text {
  overflow: visible !important;
}

/* Smaller screen behavior */
@media (max-width: 900px) {
  .sy-final-brand-anchor {
    flex-basis: 215px !important;
    width: 215px !important;
    min-width: 215px !important;
    max-width: 215px !important;
    gap: 0.38rem !important;
    padding-right: 0.35rem !important;
  }

  .sy-final-wordmark {
    font-size: 1.06rem !important;
    letter-spacing: -0.035em !important;
  }

  header:has(.sy-final-wordmark) form,
  .site-header:has(.sy-final-wordmark) form,
  .main-header:has(.sy-final-wordmark) form,
  .header-main:has(.sy-final-wordmark) form,
  .navbar:has(.sy-final-wordmark) form,
  .top-header:has(.sy-final-wordmark) form,
  header:has(.sy-final-wordmark) .search-bar,
  header:has(.sy-final-wordmark) .search-box,
  header:has(.sy-final-wordmark) .search-form {
    min-width: 160px !important;
  }
}

@media (max-width: 640px) {
  header:has(.sy-final-wordmark),
  .site-header:has(.sy-final-wordmark),
  .main-header:has(.sy-final-wordmark),
  .header-main:has(.sy-final-wordmark),
  .navbar:has(.sy-final-wordmark),
  .top-header:has(.sy-final-wordmark) {
    flex-wrap: wrap !important;
  }

  .sy-final-brand-anchor {
    flex-basis: auto !important;
    width: auto !important;
    min-width: 205px !important;
    max-width: none !important;
  }
}
'@

$finalJs = @'
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
'@

$publicDir = Join-Path $ProjectRoot "public"
if (!(Test-Path -LiteralPath $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir | Out-Null
}

# Create final assets in root and public.
Set-Content -LiteralPath (Join-Path $ProjectRoot "sokoyetu-final-brand.css") -Value $finalCss -Encoding UTF8
Set-Content -LiteralPath (Join-Path $ProjectRoot "sokoyetu-final-seo.js") -Value $finalJs -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-final-brand.css") -Value $finalCss -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-final-seo.js") -Value $finalJs -Encoding UTF8

# Disable older runtime scripts/styles that caused problems.
$disabledCss = "/* Disabled: replaced by sokoyetu-final-brand.css */"
$disabledJs = "// Disabled: replaced by sokoyetu-final-seo.js"
foreach ($name in @("sokoyetu-brand-seo.css","sokoyetu-clean-brand.css")) {
    Set-Content -LiteralPath (Join-Path $ProjectRoot $name) -Value $disabledCss -Encoding UTF8
    Set-Content -LiteralPath (Join-Path $publicDir $name) -Value $disabledCss -Encoding UTF8
}
foreach ($name in @("sokoyetu-brand-seo.js","sokoyetu-clean-seo.js")) {
    Set-Content -LiteralPath (Join-Path $ProjectRoot $name) -Value $disabledJs -Encoding UTF8
    Set-Content -LiteralPath (Join-Path $publicDir $name) -Value $disabledJs -Encoding UTF8
}

# Static JSON-LD for SEO source code.
$jsonLd = @'
<script type="application/ld+json" data-sokoyetu-final-seo="true">
[
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SokoYetu Mtaani",
    "url": "https://www.mysokoyetu.co.ke/",
    "description": "Shop online at SokoYetu Mtaani, Kenya's local online marketplace for trusted sellers, M-PESA payments, quality products, pickup, delivery, and customer support.",
    "areaServed": "Kenya",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "areaServed": "KE",
      "availableLanguage": ["English", "Swahili"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SokoYetu Mtaani",
    "url": "https://www.mysokoyetu.co.ke/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.mysokoyetu.co.ke/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
]
</script>
'@

$changedHtml = 0
$htmlFiles = Get-ChildItem -LiteralPath $ProjectRoot -Filter "*.html" -File

foreach ($file in $htmlFiles) {
    $path = $file.FullName
    $html = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    $original = $html

    # Remove older brand script/style references and avoid CSS conflicts.
    $html = RemoveTagByPattern $html '\s*<link[^>]+href=["'']/sokoyetu-brand-seo\.css["''][^>]*>\s*'
    $html = RemoveTagByPattern $html '\s*<link[^>]+href=["'']/sokoyetu-clean-brand\.css["''][^>]*>\s*'
    $html = RemoveTagByPattern $html '\s*<script[^>]+src=["'']/sokoyetu-brand-seo\.js["''][^>]*></script>\s*'
    $html = RemoveTagByPattern $html '\s*<script[^>]+src=["'']/sokoyetu-clean-seo\.js["''][^>]*></script>\s*'

    # Add final assets.
    $html = EnsureBeforeHeadClose $html '<link rel="stylesheet" href="/sokoyetu-final-brand.css">'
    $html = EnsureBeforeBodyClose $html '<script src="/sokoyetu-final-seo.js" defer></script>'

    if ($file.Name -ieq "index.html") {
        # Static SEO, visible in View Page Source.
        $html = UpsertTag $html '<title>.*?</title>' "<title>$SeoTitle</title>"
        $html = UpsertTag $html '<meta\s+name=["'']description["''][^>]*>' "<meta name=""description"" content=""$SeoDescription"">"
        $html = UpsertTag $html '<meta\s+name=["'']robots["''][^>]*>' '<meta name="robots" content="index, follow, max-image-preview:large">'
        $html = UpsertTag $html '<link\s+rel=["'']canonical["''][^>]*>' "<link rel=""canonical"" href=""$Domain/"">"
        $html = UpsertTag $html '<meta\s+property=["'']og:site_name["''][^>]*>' "<meta property=""og:site_name"" content=""$BrandName"">"
        $html = UpsertTag $html '<meta\s+property=["'']og:title["''][^>]*>' "<meta property=""og:title"" content=""$SeoTitle"">"
        $html = UpsertTag $html '<meta\s+property=["'']og:description["''][^>]*>' "<meta property=""og:description"" content=""$SeoDescription"">"
        $html = UpsertTag $html '<meta\s+property=["'']og:url["''][^>]*>' "<meta property=""og:url"" content=""$Domain/"">"
        $html = UpsertTag $html '<meta\s+property=["'']og:type["''][^>]*>' '<meta property="og:type" content="website">'
        $html = UpsertTag $html '<meta\s+name=["'']twitter:card["''][^>]*>' '<meta name="twitter:card" content="summary_large_image">'
        $html = UpsertTag $html '<meta\s+name=["'']twitter:title["''][^>]*>' "<meta name=""twitter:title"" content=""$SeoTitle"">"
        $html = UpsertTag $html '<meta\s+name=["'']twitter:description["''][^>]*>' "<meta name=""twitter:description"" content=""$SeoDescription"">"

        # Remove older JSON-LD from our prior packs, then add final JSON-LD.
        $html = [regex]::Replace($html, '\s*<script\s+type=["'']application/ld\+json["''][^>]*data-sokoyetu-[^>]*>.*?</script>\s*', "`r`n", [System.Text.RegularExpressions.RegexOptions]::Singleline)
        $html = EnsureBeforeHeadClose $html $jsonLd
    }

    if ($html -ne $original) {
        Backup $path
        Set-Content -LiteralPath $path -Value $html -Encoding UTF8
        $changedHtml++
        Write-Host "Updated HTML: $path" -ForegroundColor Green
    }
}

# SEO files
$robots = @"
User-agent: *
Allow: /

Sitemap: $Domain/sitemap.xml
"@

$sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>$Domain/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>$Domain/categories.html</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>$Domain/product-detail.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>$Domain/seller-stores.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>$Domain/how-it-works.html</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>$Domain/contact-support.html</loc>
    <priority>0.7</priority>
  </url>
</urlset>
"@

$manifest = @"
{
  "name": "SokoYetu Mtaani",
  "short_name": "SokoYetu",
  "description": "Your local online marketplace in Kenya.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "lang": "en-KE"
}
"@

Set-Content -LiteralPath (Join-Path $ProjectRoot "robots.txt") -Value $robots -Encoding UTF8
Set-Content -LiteralPath (Join-Path $ProjectRoot "sitemap.xml") -Value $sitemap -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "robots.txt") -Value $robots -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sitemap.xml") -Value $sitemap -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "site.webmanifest") -Value $manifest -Encoding UTF8

$report = @"
SokoYetu Mtaani Final SEO + Brand Report

Brand colors:
- Soko = black (#111827)
- Yetu = deep green (#006b5a)
- Mtaani = orange (#f97316)

Header fix:
- The brand container now reserves width for the full name.
- The search bar is pushed to the right instead of covering "Mtaani".
- The original logo/cart icon is preserved.

Static SEO added to index.html:
- <title>$SeoTitle</title>
- meta description
- robots meta
- canonical URL
- Open Graph tags
- Twitter Card tags
- Organization JSON-LD
- WebSite JSON-LD with SearchAction

SEO files added/updated:
- robots.txt
- sitemap.xml
- public/robots.txt
- public/sitemap.xml
- public/site.webmanifest

How to verify:
1. Run npm run dev
2. Open http://localhost:5173/
3. Press Ctrl + F5
4. Right-click > View Page Source
5. Search for:
   - SokoYetu Mtaani | Online Shopping & Marketplace in Kenya
   - meta name="description"
   - og:title
   - canonical
   - application/ld+json
6. Visit:
   - http://localhost:5173/robots.txt
   - http://localhost:5173/sitemap.xml

Deploy:
git add .
git commit -m "Fix SokoYetu Mtaani three-color logo and SEO"
git push
"@

Set-Content -LiteralPath (Join-Path $ProjectRoot "FINAL-SEO-BRAND-REPORT.txt") -Value $report -Encoding UTF8

Write-Host ""
Write-Host "Final brand assets created:" -ForegroundColor Green
Write-Host "- sokoyetu-final-brand.css"
Write-Host "- sokoyetu-final-seo.js"
Write-Host "- public\sokoyetu-final-brand.css"
Write-Host "- public\sokoyetu-final-seo.js"
Write-Host ""
Write-Host "Old conflicting brand assets disabled."
Write-Host "HTML files updated: $changedHtml"
Write-Host "SEO files updated: robots.txt, sitemap.xml, site.webmanifest"
Write-Host "Report created: FINAL-SEO-BRAND-REPORT.txt"
Write-Host ""
Write-Host "Next:"
Write-Host "1. npm run dev"
Write-Host "2. Open http://localhost:5173/"
Write-Host "3. Press Ctrl + F5"
Write-Host ""

exit 0

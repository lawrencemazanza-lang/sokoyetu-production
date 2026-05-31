@echo off
setlocal EnableExtensions

echo.
echo ============================================
echo  SokoYetu Clean Brand + Real SEO Fix
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

set "TMP_PS1=%TEMP%\sokoyetu_clean_brand_seo_%RANDOM%.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%~f0'; $out='%TMP_PS1%'; $lines=Get-Content -LiteralPath $p; $i=[array]::IndexOf($lines,'#BEGINPS1'); if($i -lt 0){ throw 'PowerShell payload not found.' }; $lines[($i+1)..($lines.Length-1)] | Set-Content -LiteralPath $out -Encoding UTF8"

powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" -ProjectRoot "%PROJECT_ROOT%"
set "ERR=%ERRORLEVEL%"

del "%TMP_PS1%" >nul 2>nul

echo.
if "%ERR%"=="0" (
  echo Clean brand and SEO fix finished.
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
Write-Host "Applying clean visible brand and real SEO tags..." -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

function Backup([string]$path) {
    $backup = "$path.bak-clean-brand-seo"
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

function UpsertTitle([string]$html) {
    if ($html -match "<title>.*?</title>") {
        return [regex]::Replace($html, "<title>.*?</title>", "<title>$SeoTitle</title>", 1)
    }
    return EnsureBeforeHeadClose $html "<title>$SeoTitle</title>"
}

function UpsertTag([string]$html, [string]$pattern, [string]$tag) {
    if ($html -match $pattern) {
        return [regex]::Replace($html, $pattern, $tag, 1)
    }
    return EnsureBeforeHeadClose $html $tag
}

$css = @'
/* SokoYetu Mtaani clean wordmark and SEO polish */
:root {
  --soko-black: #111827;
  --soko-orange: #f97316;
  --soko-orange-dark: #ea580c;
  --soko-bg-soft: #fff7ed;
}

/* Keep the original cart/logo icon visible. Only the words are styled. */
.sy-wordmark {
  display: inline-flex;
  align-items: baseline;
  gap: 0.12em;
  white-space: nowrap;
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 1;
  font-size: clamp(1.25rem, 1.65vw, 1.65rem);
  vertical-align: middle;
}

.sy-wordmark-black {
  color: var(--soko-black) !important;
}

.sy-wordmark-orange {
  color: var(--soko-orange) !important;
}

.sy-brand-anchor,
a:has(.sy-wordmark),
.logo:has(.sy-wordmark),
.brand:has(.sy-wordmark),
.brand-name:has(.sy-wordmark) {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.55rem !important;
  min-width: max-content !important;
  max-width: none !important;
  width: auto !important;
  overflow: visible !important;
  flex-shrink: 0 !important;
  text-decoration: none !important;
  padding-right: 0.75rem !important;
}

.sy-brand-anchor *,
a:has(.sy-wordmark) *,
.logo:has(.sy-wordmark) *,
.brand:has(.sy-wordmark) *,
.brand-name:has(.sy-wordmark) * {
  overflow: visible !important;
}

/* Prevent the search box from covering the full name */
header,
.site-header,
.main-header,
.navbar,
.top-header,
.header-main {
  overflow: visible !important;
}

header form,
.site-header form,
.main-header form,
.navbar form,
.search-bar,
.search-box,
.search-form {
  min-width: 280px;
}

/* On smaller screens, keep the name visible without swallowing the search bar */
@media (max-width: 900px) {
  .sy-wordmark {
    font-size: 1.15rem;
    letter-spacing: -0.035em;
  }

  .sy-brand-anchor,
  a:has(.sy-wordmark),
  .logo:has(.sy-wordmark),
  .brand:has(.sy-wordmark),
  .brand-name:has(.sy-wordmark) {
    gap: 0.35rem !important;
    padding-right: 0.35rem !important;
  }

  header form,
  .site-header form,
  .main-header form,
  .navbar form,
  .search-bar,
  .search-box,
  .search-form {
    min-width: 180px;
  }
}

/* Helpful SEO/trust styling for text blocks if used on pages */
.sy-seo-trust-strip {
  background: var(--soko-bg-soft);
  border: 1px solid #fed7aa;
  color: var(--soko-black);
  border-radius: 14px;
  padding: 10px 14px;
  font-weight: 700;
}

.sy-seo-highlight {
  color: var(--soko-orange-dark);
  font-weight: 900;
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
    wrapper.className = "sy-wordmark";
    wrapper.setAttribute("aria-label", BRAND);

    const black = document.createElement("span");
    black.className = "sy-wordmark-black";
    black.textContent = "SokoYetu";

    const orange = document.createElement("span");
    orange.className = "sy-wordmark-orange";
    orange.textContent = " Mtaani";

    wrapper.appendChild(black);
    wrapper.appendChild(orange);
    return wrapper;
  }

  function replaceTextNode(textNode, mode) {
    const text = textNode.nodeValue;
    const phrase = mode === "full" ? "SokoYetu Mtaani" : "SokoYetu";
    const index = text.indexOf(phrase);
    if (index < 0) return;

    const parent = textNode.parentElement;
    if (!parent || parent.closest(".sy-wordmark, script, style, textarea, input, select")) return;

    const fragment = document.createDocumentFragment();
    const before = text.slice(0, index);
    const after = text.slice(index + phrase.length);

    if (before) fragment.appendChild(document.createTextNode(before));
    fragment.appendChild(makeWordmark());
    if (after) fragment.appendChild(document.createTextNode(after));

    textNode.parentNode.replaceChild(fragment, textNode);

    const anchor = parent.closest("a, .logo, .brand, .brand-name, header, nav");
    if (anchor) anchor.classList.add("sy-brand-anchor");
  }

  function polishWordmark() {
    const roots = document.querySelectorAll(
      "header, nav, .header, .site-header, .main-header, .navbar, .top-header, .logo, .brand, .brand-name, footer, h1"
    );

    roots.forEach((root) => {
      if (root.closest && root.closest(".sy-wordmark")) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const text = (node.nodeValue || "").replace(/\s+/g, " ").trim();
          if (!text) return NodeFilter.FILTER_REJECT;
          if (node.parentElement && node.parentElement.closest(".sy-wordmark, script, style, textarea, input, select")) {
            return NodeFilter.FILTER_REJECT;
          }
          if (text.includes("SokoYetu Mtaani") || text === "SokoYetu") {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        },
      });

      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach((node) => {
        const text = node.nodeValue || "";
        if (text.includes("SokoYetu Mtaani")) replaceTextNode(node, "full");
        else if (text.trim() === "SokoYetu") replaceTextNode(node, "short");
      });
    });
  }

  function applySEO() {
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

  function addStructuredData() {
    if (document.querySelector('script[type="application/ld+json"][data-sokoyetu-clean-seo="true"]')) return;

    const data = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: BRAND,
        url: DOMAIN,
        description: DESCRIPTION,
        areaServed: "Kenya",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          areaServed: "KE",
          availableLanguage: ["English", "Swahili"]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: BRAND,
        url: DOMAIN,
        potentialAction: {
          "@type": "SearchAction",
          target: DOMAIN + "search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ];

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-sokoyetu-clean-seo", "true");
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function run() {
    applySEO();
    addStructuredData();
    polishWordmark();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
'@

# Create final assets in root and public.
Set-Content -LiteralPath (Join-Path $ProjectRoot "sokoyetu-clean-brand.css") -Value $css -Encoding UTF8
Set-Content -LiteralPath (Join-Path $ProjectRoot "sokoyetu-clean-seo.js") -Value $js -Encoding UTF8

$publicDir = Join-Path $ProjectRoot "public"
if (!(Test-Path -LiteralPath $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir | Out-Null
}
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-clean-brand.css") -Value $css -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-clean-seo.js") -Value $js -Encoding UTF8

# Neutralize the earlier script that removed the logo, in case any reference remains.
Set-Content -LiteralPath (Join-Path $ProjectRoot "sokoyetu-brand-seo.js") -Value "// Disabled: replaced by sokoyetu-clean-seo.js to preserve the logo icon." -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-brand-seo.js") -Value "// Disabled: replaced by sokoyetu-clean-seo.js to preserve the logo icon." -Encoding UTF8

$changedHtml = 0
$htmlFiles = Get-ChildItem -LiteralPath $ProjectRoot -Filter "*.html" -File

foreach ($file in $htmlFiles) {
    $path = $file.FullName
    $html = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    $original = $html

    # Remove the earlier poor styling/runtime script from HTML references.
    $html = [regex]::Replace($html, '\s*<link[^>]+href=["'']/sokoyetu-brand-seo\.css["''][^>]*>\s*', "`r`n")
    $html = [regex]::Replace($html, '\s*<script[^>]+src=["'']/sokoyetu-brand-seo\.js["''][^>]*></script>\s*', "`r`n")

    # Add clean styling and SEO runtime safely.
    $html = EnsureBeforeHeadClose $html '<link rel="stylesheet" href="/sokoyetu-clean-brand.css">'
    $html = EnsureBeforeBodyClose $html '<script src="/sokoyetu-clean-seo.js" defer></script>'

    if ($file.Name -ieq "index.html") {
        $html = UpsertTitle $html
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
    }

    if ($html -ne $original) {
        Backup $path
        Set-Content -LiteralPath $path -Value $html -Encoding UTF8
        $changedHtml++
        Write-Host "Updated HTML: $path" -ForegroundColor Green
    }
}

# Write SEO files.
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
SokoYetu Mtaani SEO Check Report
Generated by CLEAN-BRAND-SEO-FIX.cmd

Visible branding:
- The old runtime script that hid the logo was disabled.
- The original cart/logo icon is preserved.
- The wordmark uses only two colors:
  - SokoYetu: black (#111827)
  - Mtaani: orange (#f97316)

SEO added/updated:
- Homepage title: $SeoTitle
- Meta description: $SeoDescription
- Robots meta: index, follow, max-image-preview:large
- Canonical URL: $Domain/
- Open Graph tags for social sharing
- Twitter card tags
- Organization JSON-LD
- WebSite JSON-LD with SearchAction
- robots.txt
- sitemap.xml
- site.webmanifest

How to verify:
1. Run npm run dev
2. Open http://localhost:5173/
3. Press Ctrl + F5
4. Right-click page > View Page Source
5. Search for:
   - meta name="description"
   - og:title
   - canonical
   - application/ld+json
6. Open these URLs locally:
   - http://localhost:5173/robots.txt
   - http://localhost:5173/sitemap.xml

Deployment:
git add .
git commit -m "Fix SokoYetu Mtaani logo colors and SEO"
git push
"@

Set-Content -LiteralPath (Join-Path $ProjectRoot "SEO-CHECK-REPORT.txt") -Value $report -Encoding UTF8

Write-Host ""
Write-Host "Clean brand assets created:" -ForegroundColor Green
Write-Host "- sokoyetu-clean-brand.css"
Write-Host "- sokoyetu-clean-seo.js"
Write-Host "- public\sokoyetu-clean-brand.css"
Write-Host "- public\sokoyetu-clean-seo.js"
Write-Host ""
Write-Host "HTML files updated: $changedHtml"
Write-Host "SEO files updated: robots.txt, sitemap.xml, public\site.webmanifest"
Write-Host "Report created: SEO-CHECK-REPORT.txt"
Write-Host ""
Write-Host "Next:"
Write-Host "1. npm run dev"
Write-Host "2. Open http://localhost:5173/"
Write-Host "3. Press Ctrl + F5"
Write-Host "4. Check SEO-CHECK-REPORT.txt"
Write-Host ""

exit 0

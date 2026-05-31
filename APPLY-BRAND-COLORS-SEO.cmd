@echo off
setlocal EnableExtensions

echo.
echo ============================================
echo  SokoYetu Mtaani Brand Colors + SEO Pack
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

set "TMP_PS1=%TEMP%\sokoyetu_brand_colors_seo_%RANDOM%.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%~f0'; $out='%TMP_PS1%'; $lines=Get-Content -LiteralPath $p; $i=[array]::IndexOf($lines,'#BEGINPS1'); if($i -lt 0){ throw 'PowerShell payload not found.' }; $lines[($i+1)..($lines.Length-1)] | Set-Content -LiteralPath $out -Encoding UTF8"

powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" -ProjectRoot "%PROJECT_ROOT%"
set "ERR=%ERRORLEVEL%"

del "%TMP_PS1%" >nul 2>nul

echo.
if "%ERR%"=="0" (
  echo Brand colors and SEO update finished.
  echo Now run:
  echo npm run dev
  echo.
  echo Open http://localhost:5173/ and press Ctrl + F5.
) else (
  echo Update failed. Please send me the error shown above.
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
$SeoDescription = "Shop online at SokoYetu Mtaani, a local Kenyan marketplace for trusted sellers, secure payment, quality products, and reliable delivery across Kenya."

Write-Host ""
Write-Host "Applying brand colors and SEO safely..." -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

function Backup([string]$path) {
    $backup = "$path.bak-brand-colors-seo"
    if (!(Test-Path -LiteralPath $backup)) {
        Copy-Item -LiteralPath $path -Destination $backup
    }
}

$cssPath = Join-Path $ProjectRoot "sokoyetu-brand-seo.css"
$jsPath = Join-Path $ProjectRoot "sokoyetu-brand-seo.js"

$css = @'
/* SokoYetu Mtaani brand polish */
:root {
  --sy-black: #111827;
  --sy-orange: #f97316;
  --sy-orange-dark: #ea580c;
  --sy-orange-soft: #fff7ed;
}

.sy-brand-logo,
.brand-logo,
.logo-text {
  display: inline-flex;
  align-items: baseline;
  gap: 0.2rem;
  font-weight: 900;
  letter-spacing: -0.035em;
  line-height: 1;
  white-space: nowrap;
}

.sy-brand-black {
  color: var(--sy-black);
}

.sy-brand-orange {
  color: var(--sy-orange);
}

.sy-brand-logo:hover .sy-brand-orange {
  color: var(--sy-orange-dark);
}

.sy-brand-badge {
  background: linear-gradient(135deg, var(--sy-black), #374151);
  color: #ffffff;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  font-weight: 800;
}

.sy-brand-highlight {
  color: var(--sy-orange);
  font-weight: 800;
}

a .sy-brand-logo {
  text-decoration: none;
}

header .sy-brand-logo,
nav .sy-brand-logo,
.navbar .sy-brand-logo {
  font-size: clamp(1.15rem, 2vw, 1.7rem);
}

h1 .sy-brand-logo,
.hero .sy-brand-logo {
  font-size: inherit;
}

button,
.btn-primary,
.primary-btn,
.checkout-btn,
.add-to-cart,
[type="submit"] {
  transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

button:hover,
.btn-primary:hover,
.primary-btn:hover,
.checkout-btn:hover,
.add-to-cart:hover,
[type="submit"]:hover {
  transform: translateY(-1px);
}

/* Small SEO/trust strip helper if used later */
.sy-trust-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  background: var(--sy-orange-soft);
  border: 1px solid #fed7aa;
  color: var(--sy-black);
  border-radius: 1rem;
  padding: 0.75rem 1rem;
}
'@

$js = @'
(function () {
  const BRAND = "SokoYetu Mtaani";
  const TITLE = "SokoYetu Mtaani | Online Shopping & Marketplace in Kenya";
  const DESCRIPTION =
    "Shop online at SokoYetu Mtaani, a local Kenyan marketplace for trusted sellers, secure payment, quality products, and reliable delivery across Kenya.";
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

  function brandHTML() {
    return '<span class="sy-brand-logo" aria-label="SokoYetu Mtaani">' +
      '<span class="sy-brand-black">SokoYetu</span>' +
      '<span class="sy-brand-orange"> Mtaani</span>' +
      '</span>';
  }

  function polishVisibleBrand() {
    const selectors = [
      "header a", "header span", "header div",
      "nav a", "nav span", "nav div",
      ".logo", ".brand", ".brand-name", ".navbar-brand",
      "h1", "h2", "footer a", "footer span", "footer div"
    ];

    const nodes = Array.from(document.querySelectorAll(selectors.join(",")));
    const seen = new Set();

    nodes.forEach((node) => {
      if (seen.has(node)) return;
      seen.add(node);

      if (node.closest("script, style, textarea, input, select")) return;

      const text = (node.textContent || "").trim().replace(/\s+/g, " ");
      const className = String(node.className || "").toLowerCase();
      const looksLikeBrandArea =
        className.includes("logo") ||
        className.includes("brand") ||
        node.closest("header, nav, footer") ||
        /^h1$/i.test(node.tagName);

      if (!looksLikeBrandArea) return;

      if (text === "SokoYetu" || text === "SokoYetu Mtaani") {
        node.innerHTML = brandHTML();
      }
    });
  }

  function applySEO() {
    document.title = TITLE;
    setMeta('meta[name="description"]', "name", "description", DESCRIPTION);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", BRAND);
    setMeta('meta[property="og:title"]', "property", "og:title", TITLE);
    setMeta('meta[property="og:description"]', "property", "og:description", DESCRIPTION);
    setMeta('meta[property="og:url"]', "property", "og:url", DOMAIN);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", TITLE);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", DESCRIPTION);
    setCanonical();

    if (!document.querySelector('script[type="application/ld+json"][data-sokoyetu-seo="true"]')) {
      const jsonLd = document.createElement("script");
      jsonLd.type = "application/ld+json";
      jsonLd.setAttribute("data-sokoyetu-seo", "true");
      jsonLd.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: BRAND,
        url: DOMAIN,
        description: DESCRIPTION,
        areaServed: "Kenya",
        sameAs: []
      });
      document.head.appendChild(jsonLd);
    }
  }

  function run() {
    applySEO();
    polishVisibleBrand();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
'@

Set-Content -LiteralPath $cssPath -Value $css -Encoding UTF8
Set-Content -LiteralPath $jsPath -Value $js -Encoding UTF8
Write-Host "Created: $cssPath" -ForegroundColor Green
Write-Host "Created: $jsPath" -ForegroundColor Green

# Also place copies in public folder if it exists or is used by the project.
$publicDir = Join-Path $ProjectRoot "public"
if (!(Test-Path -LiteralPath $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir | Out-Null
}
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-brand-seo.css") -Value $css -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-brand-seo.js") -Value $js -Encoding UTF8

function EnsureHeadTag([string]$html, [string]$tag) {
    if ($html.Contains($tag)) { return $html }
    if ($html -match "</head>") {
        return $html -replace "</head>", "  $tag`r`n</head>"
    }
    return $html
}

function EnsureBodyTag([string]$html, [string]$tag) {
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
    return EnsureHeadTag $html "<title>$SeoTitle</title>"
}

function UpsertMeta([string]$html, [string]$pattern, [string]$tag) {
    if ($html -match $pattern) {
        return [regex]::Replace($html, $pattern, $tag, 1)
    }
    return EnsureHeadTag $html $tag
}

$changedHtml = 0
$htmlFiles = Get-ChildItem -LiteralPath $ProjectRoot -Filter "*.html" -File

foreach ($file in $htmlFiles) {
    $path = $file.FullName
    $html = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    $original = $html

    $html = EnsureHeadTag $html '<link rel="stylesheet" href="/sokoyetu-brand-seo.css">'
    $html = EnsureBodyTag $html '<script src="/sokoyetu-brand-seo.js" defer></script>'

    if ($file.Name -ieq "index.html") {
        $html = UpsertTitle $html
        $html = UpsertMeta $html '<meta\s+name=["'']description["''][^>]*>' "<meta name=""description"" content=""$SeoDescription"">"
        $html = UpsertMeta $html '<link\s+rel=["'']canonical["''][^>]*>' "<link rel=""canonical"" href=""$Domain/"">"
        $html = UpsertMeta $html '<meta\s+property=["'']og:site_name["''][^>]*>' "<meta property=""og:site_name"" content=""$BrandName"">"
        $html = UpsertMeta $html '<meta\s+property=["'']og:title["''][^>]*>' "<meta property=""og:title"" content=""$SeoTitle"">"
        $html = UpsertMeta $html '<meta\s+property=["'']og:description["''][^>]*>' "<meta property=""og:description"" content=""$SeoDescription"">"
        $html = UpsertMeta $html '<meta\s+property=["'']og:url["''][^>]*>' "<meta property=""og:url"" content=""$Domain/"">"
        $html = UpsertMeta $html '<meta\s+property=["'']og:type["''][^>]*>' '<meta property="og:type" content="website">'
        $html = UpsertMeta $html '<meta\s+name=["'']twitter:card["''][^>]*>' '<meta name="twitter:card" content="summary_large_image">'
        $html = UpsertMeta $html '<meta\s+name=["'']twitter:title["''][^>]*>' "<meta name=""twitter:title"" content=""$SeoTitle"">"
        $html = UpsertMeta $html '<meta\s+name=["'']twitter:description["''][^>]*>' "<meta name=""twitter:description"" content=""$SeoDescription"">"
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

Write-Host ""
Write-Host "HTML files updated: $changedHtml"
Write-Host "SEO files created/updated: robots.txt, sitemap.xml, site.webmanifest"
Write-Host ""
Write-Host "Next:"
Write-Host "1. npm run dev"
Write-Host "2. Open http://localhost:5173/"
Write-Host "3. Press Ctrl + F5"
Write-Host "4. If good: git add . && git commit -m ""Add SokoYetu Mtaani brand colors and SEO"" && git push"
Write-Host ""

exit 0

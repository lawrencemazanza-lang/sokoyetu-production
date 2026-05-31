@echo off
setlocal EnableExtensions

echo.
echo ============================================
echo  SokoYetu Remove Underline + Special Marks
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

set "TMP_PS1=%TEMP%\sokoyetu_clean_no_marks_%RANDOM%.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%~f0'; $out='%TMP_PS1%'; $lines=Get-Content -LiteralPath $p; $i=[array]::IndexOf($lines,'#BEGINPS1'); if($i -lt 0){ throw 'PowerShell payload not found.' }; $lines[($i+1)..($lines.Length-1)] | Set-Content -LiteralPath $out -Encoding UTF8"

powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" -ProjectRoot "%PROJECT_ROOT%"
set "ERR=%ERRORLEVEL%"

del "%TMP_PS1%" >nul 2>nul

echo.
if "%ERR%"=="0" (
  echo Clean logo fix finished.
  echo.
  echo Now run:
  echo npm run dev
  echo.
  echo Open http://localhost:5173/ and press Ctrl + F5.
) else (
  echo Fix failed. Please send me the error above.
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
Write-Host "Removing underline and special marks from SokoYetu Mtaani logo..." -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

function Backup([string]$path) {
    $backup = "$path.bak-no-underline-special"
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
/* Final clean SokoYetu Mtaani logo: no underline, no dots, no special marks */
:root {
  --sy-clean-black: #111827;
  --sy-clean-green: #057a55;
  --sy-clean-orange: #f97316;
}

/* Remove all decorative marks added by older packs */
.sy-refined-wordmark::before,
.sy-refined-wordmark::after,
.sy-final-wordmark::before,
.sy-final-wordmark::after,
.sy-simple-wordmark::before,
.sy-simple-wordmark::after {
  content: none !important;
  display: none !important;
  background: none !important;
  border: 0 !important;
  width: 0 !important;
  height: 0 !important;
  opacity: 0 !important;
}

/* Clean 3-color wordmark */
.sy-simple-wordmark,
.sy-refined-wordmark,
.sy-final-wordmark {
  display: inline-flex !important;
  align-items: baseline !important;
  gap: 0 !important;
  white-space: nowrap !important;
  font-size: clamp(1.02rem, 1.28vw, 1.22rem) !important;
  font-weight: 900 !important;
  letter-spacing: -0.035em !important;
  line-height: 1 !important;
  font-family: Inter, "Segoe UI", Arial, sans-serif !important;
  position: relative !important;
  padding: 0 !important;
  margin: 0 !important;
  text-decoration: none !important;
  border: 0 !important;
  box-shadow: none !important;
  background-image: none !important;
  text-shadow: none !important;
}

.sy-simple-soko,
.sy-refined-soko,
.sy-final-soko {
  color: var(--sy-clean-black) !important;
}

.sy-simple-yetu,
.sy-refined-yetu,
.sy-final-yetu {
  color: var(--sy-clean-green) !important;
}

.sy-simple-mtaani,
.sy-refined-mtaani,
.sy-final-mtaani {
  color: var(--sy-clean-orange) !important;
  margin-left: 0.08em !important;
}

/* Keep icon visible and prevent search bar overlap */
.sy-simple-brand-anchor,
.sy-refined-brand-anchor,
.sy-final-brand-anchor,
a:has(.sy-simple-wordmark),
a:has(.sy-refined-wordmark),
a:has(.sy-final-wordmark),
.logo:has(.sy-simple-wordmark),
.logo:has(.sy-refined-wordmark),
.logo:has(.sy-final-wordmark),
.brand:has(.sy-simple-wordmark),
.brand:has(.sy-refined-wordmark),
.brand:has(.sy-final-wordmark),
[class*="logo"]:has(.sy-simple-wordmark),
[class*="logo"]:has(.sy-refined-wordmark),
[class*="logo"]:has(.sy-final-wordmark),
[class*="brand"]:has(.sy-simple-wordmark),
[class*="brand"]:has(.sy-refined-wordmark),
[class*="brand"]:has(.sy-final-wordmark) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 0.45rem !important;
  flex: 0 0 238px !important;
  width: 238px !important;
  min-width: 238px !important;
  max-width: 238px !important;
  overflow: visible !important;
  white-space: nowrap !important;
  position: relative !important;
  z-index: 60 !important;
  text-decoration: none !important;
  padding-right: 0.55rem !important;
}

.sy-simple-brand-anchor img,
.sy-simple-brand-anchor svg,
.sy-refined-brand-anchor img,
.sy-refined-brand-anchor svg,
.sy-final-brand-anchor img,
.sy-final-brand-anchor svg,
.sy-simple-brand-anchor [class*="icon"],
.sy-refined-brand-anchor [class*="icon"],
.sy-final-brand-anchor [class*="icon"] {
  flex: 0 0 auto !important;
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  max-width: 44px !important;
  max-height: 44px !important;
}

/* Search bar stays smaller and shifted right */
header:has(.sy-simple-wordmark),
header:has(.sy-refined-wordmark),
header:has(.sy-final-wordmark),
.site-header:has(.sy-simple-wordmark),
.site-header:has(.sy-refined-wordmark),
.site-header:has(.sy-final-wordmark),
.main-header:has(.sy-simple-wordmark),
.main-header:has(.sy-refined-wordmark),
.main-header:has(.sy-final-wordmark),
.header-main:has(.sy-simple-wordmark),
.header-main:has(.sy-refined-wordmark),
.header-main:has(.sy-final-wordmark),
.navbar:has(.sy-simple-wordmark),
.navbar:has(.sy-refined-wordmark),
.navbar:has(.sy-final-wordmark),
.top-header:has(.sy-simple-wordmark),
.top-header:has(.sy-refined-wordmark),
.top-header:has(.sy-final-wordmark) {
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
  overflow: visible !important;
}

header:has(.sy-simple-wordmark) form,
header:has(.sy-refined-wordmark) form,
header:has(.sy-final-wordmark) form,
header:has(.sy-simple-wordmark) .search-bar,
header:has(.sy-refined-wordmark) .search-bar,
header:has(.sy-final-wordmark) .search-bar,
header:has(.sy-simple-wordmark) .search-box,
header:has(.sy-refined-wordmark) .search-box,
header:has(.sy-final-wordmark) .search-box,
header:has(.sy-simple-wordmark) .search-form,
header:has(.sy-refined-wordmark) .search-form,
header:has(.sy-final-wordmark) .search-form {
  flex: 0 1 600px !important;
  width: min(46vw, 600px) !important;
  max-width: 600px !important;
  min-width: 300px !important;
  margin-left: 1.5rem !important;
  margin-right: 0.6rem !important;
  position: relative !important;
  z-index: 1 !important;
}

/* No underline even if the logo is inside a link */
.sy-simple-brand-anchor,
.sy-simple-brand-anchor *,
.sy-refined-brand-anchor,
.sy-refined-brand-anchor *,
.sy-final-brand-anchor,
.sy-final-brand-anchor *,
a:has(.sy-simple-wordmark),
a:has(.sy-refined-wordmark),
a:has(.sy-final-wordmark) {
  text-decoration: none !important;
  border-bottom: 0 !important;
}

@media (max-width: 900px) {
  .sy-simple-brand-anchor,
  .sy-refined-brand-anchor,
  .sy-final-brand-anchor,
  a:has(.sy-simple-wordmark),
  a:has(.sy-refined-wordmark),
  a:has(.sy-final-wordmark) {
    flex-basis: 220px !important;
    width: 220px !important;
    min-width: 220px !important;
    max-width: 220px !important;
  }

  .sy-simple-wordmark,
  .sy-refined-wordmark,
  .sy-final-wordmark {
    font-size: 1rem !important;
  }

  header:has(.sy-simple-wordmark) form,
  header:has(.sy-refined-wordmark) form,
  header:has(.sy-final-wordmark) form,
  header:has(.sy-simple-wordmark) .search-bar,
  header:has(.sy-refined-wordmark) .search-bar,
  header:has(.sy-final-wordmark) .search-bar,
  header:has(.sy-simple-wordmark) .search-box,
  header:has(.sy-refined-wordmark) .search-box,
  header:has(.sy-final-wordmark) .search-box,
  header:has(.sy-simple-wordmark) .search-form,
  header:has(.sy-refined-wordmark) .search-form,
  header:has(.sy-final-wordmark) .search-form {
    width: min(42vw, 520px) !important;
    max-width: 520px !important;
    min-width: 250px !important;
    margin-left: 0.8rem !important;
  }
}
'@

$js = @'
(function () {
  function makeWordmark() {
    const wrapper = document.createElement("span");
    wrapper.className = "sy-simple-wordmark";
    wrapper.setAttribute("aria-label", "SokoYetu Mtaani");

    const soko = document.createElement("span");
    soko.className = "sy-simple-soko";
    soko.textContent = "Soko";

    const yetu = document.createElement("span");
    yetu.className = "sy-simple-yetu";
    yetu.textContent = "Yetu";

    const mtaani = document.createElement("span");
    mtaani.className = "sy-simple-mtaani";
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

    container.classList.add("sy-simple-brand-anchor");
    container.style.textDecoration = "none";
    container.style.borderBottom = "0";
    container.style.overflow = "visible";
    container.style.whiteSpace = "nowrap";
    container.style.flex = "0 0 238px";
    container.style.width = "238px";
    container.style.minWidth = "238px";
    container.style.maxWidth = "238px";
    container.style.position = "relative";
    container.style.zIndex = "60";
  }

  function cleanExistingWordmarks() {
    document.querySelectorAll(".sy-refined-wordmark, .sy-final-wordmark, .sy-wordmark, .sy-brand-logo, .sy-simple-wordmark").forEach((node) => {
      const fresh = makeWordmark();
      node.replaceWith(fresh);
      markContainer(fresh);
    });
  }

  function replacePlainBrandText() {
    const roots = document.querySelectorAll(
      "header, nav, .header, .site-header, .main-header, .header-main, .navbar, .top-header, .logo, .brand, .brand-name, footer, h1"
    );

    roots.forEach((root) => {
      if (!root || root.closest(".sy-simple-wordmark")) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
          if (node.parentElement && node.parentElement.closest(".sy-simple-wordmark, script, style, textarea, input, select")) {
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

  function fixSearchSpacing() {
    const wordmark = document.querySelector(".sy-simple-wordmark");
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
    cleanExistingWordmarks();
    replacePlainBrandText();
    fixSearchSpacing();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("load", fixSearchSpacing);
})();
'@

$publicDir = Join-Path $ProjectRoot "public"
if (!(Test-Path -LiteralPath $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir | Out-Null
}

Set-Content -LiteralPath (Join-Path $ProjectRoot "sokoyetu-no-underline-special.css") -Value $css -Encoding UTF8
Set-Content -LiteralPath (Join-Path $ProjectRoot "sokoyetu-no-underline-special.js") -Value $js -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-no-underline-special.css") -Value $css -Encoding UTF8
Set-Content -LiteralPath (Join-Path $publicDir "sokoyetu-no-underline-special.js") -Value $js -Encoding UTF8

$changedHtml = 0
$htmlFiles = Get-ChildItem -LiteralPath $ProjectRoot -Filter "*.html" -File

foreach ($file in $htmlFiles) {
    $path = $file.FullName
    $html = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    $original = $html

    $html = EnsureBeforeHeadClose $html '<link rel="stylesheet" href="/sokoyetu-no-underline-special.css">'
    $html = EnsureBeforeBodyClose $html '<script src="/sokoyetu-no-underline-special.js" defer></script>'

    if ($html -ne $original) {
        Backup $path
        Set-Content -LiteralPath $path -Value $html -Encoding UTF8
        $changedHtml++
        Write-Host "Updated HTML: $path" -ForegroundColor Green
    }
}

$report = @"
SokoYetu Clean Logo Report

Removed:
- Decorative underline under the brand name.
- Special dot/spark characters above the brand name.
- Link underlines/borders around the logo text.

Kept:
- Original cart/logo icon.
- Three-color brand name:
  - Soko = black
  - Yetu = green
  - Mtaani = orange
- Smaller logo font.
- Search bar spacing so Mtaani is not covered.

Test:
1. npm run dev
2. Open http://localhost:5173/
3. Press Ctrl + F5

Deploy:
git add .
git commit -m "Remove SokoYetu logo underline and special marks"
git push
"@

Set-Content -LiteralPath (Join-Path $ProjectRoot "NO-UNDERLINE-SPECIAL-REPORT.txt") -Value $report -Encoding UTF8

Write-Host ""
Write-Host "Created clean logo override files:" -ForegroundColor Green
Write-Host "- sokoyetu-no-underline-special.css"
Write-Host "- sokoyetu-no-underline-special.js"
Write-Host "- NO-UNDERLINE-SPECIAL-REPORT.txt"
Write-Host ""
Write-Host "HTML files updated: $changedHtml"
Write-Host ""
Write-Host "Next:"
Write-Host "1. npm run dev"
Write-Host "2. Open http://localhost:5173/"
Write-Host "3. Press Ctrl + F5"
Write-Host ""

exit 0

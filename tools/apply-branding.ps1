param(
    [string]$ProjectRoot = "."
)

$ErrorActionPreference = "Stop"

$BrandName = "SokoYetu Mtaani"
$Domain = "https://www.mysokoyetu.co.ke"
$SeoTitle = "SokoYetu Mtaani | Online Shopping & Marketplace in Kenya"
$SeoDescription = "Shop online at SokoYetu Mtaani, a local Kenyan marketplace for trusted sellers, secure payment, quality products, and reliable delivery."
$Tagline = "Your local online marketplace in Kenya"

Write-Host ""
Write-Host "Applying SokoYetu Mtaani branding..." -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

if (!(Test-Path $ProjectRoot)) {
    Write-Host "ERROR: Project root does not exist." -ForegroundColor Red
    exit 1
}

$SkipDirs = @(
    "\node_modules\",
    "\.git\",
    "\dist\",
    "\build\",
    "\.next\",
    "\coverage\",
    "\.render\",
    "\.vercel\"
)

$Extensions = @(
    ".html", ".js", ".jsx", ".ts", ".tsx", ".json", ".md", ".css", ".scss", ".env.example"
)

$Replacements = [ordered]@{
    "SokoYetu Marketplace Kenya" = $BrandName
    "SokoYetu Marketplace" = $BrandName
    "SokoYetu Online Market" = $BrandName
    "SokoYetu Online" = $BrandName
    "SokoYetu Kenya" = $BrandName
    "My SokoYetu" = $BrandName
    "Soko Yetu" = $BrandName
    "mysokoyetu" = "SokoYetu Mtaani"
}

function Should-SkipFile($FullName) {
    $normalized = $FullName.Replace("/", "\")
    foreach ($dir in $SkipDirs) {
        if ($normalized.Contains($dir)) {
            return $true
        }
    }
    return $false
}

function Backup-File($Path) {
    $backup = "$Path.bak-sokoyetu-mtaani"
    if (!(Test-Path $backup)) {
        Copy-Item $Path $backup
    }
}

function Update-TextFile($Path) {
    $ext = [System.IO.Path]::GetExtension($Path)
    if ($Extensions -notcontains $ext) {
        return $false
    }

    if (Should-SkipFile $Path) {
        return $false
    }

    $content = Get-Content -Path $Path -Raw -Encoding UTF8
    $original = $content

    foreach ($key in $Replacements.Keys) {
        $content = $content.Replace($key, $Replacements[$key])
    }

    # Protect URLs after the generic replacement.
    $content = $content.Replace("https://www.SokoYetu Mtaani.co.ke", $Domain)
    $content = $content.Replace("https://SokoYetu Mtaani.co.ke", "https://mysokoyetu.co.ke")
    $content = $content.Replace("http://www.SokoYetu Mtaani.co.ke", $Domain)
    $content = $content.Replace("http://SokoYetu Mtaani.co.ke", "https://mysokoyetu.co.ke")

    if ($content -ne $original) {
        Backup-File $Path
        Set-Content -Path $Path -Value $content -Encoding UTF8
        return $true
    }

    return $false
}

function Upsert-Tag($Html, $Pattern, $NewTag) {
    if ($Html -match $Pattern) {
        return [regex]::Replace($Html, $Pattern, $NewTag, 1)
    }

    if ($Html -match "</head>") {
        return $Html -replace "</head>", "  $NewTag`r`n</head>"
    }

    return $Html
}

function Update-IndexHtml($Path) {
    if (!(Test-Path $Path)) {
        return $false
    }

    $html = Get-Content -Path $Path -Raw -Encoding UTF8
    $original = $html

    if ($html -match "<title>.*?</title>") {
        $html = [regex]::Replace($html, "<title>.*?</title>", "<title>$SeoTitle</title>", 1)
    } elseif ($html -match "</head>") {
        $html = $html -replace "</head>", "  <title>$SeoTitle</title>`r`n</head>"
    }

    $html = Upsert-Tag $html '<meta\s+name=["'']description["''][^>]*>' "<meta name=""description"" content=""$SeoDescription"">"
    $html = Upsert-Tag $html '<link\s+rel=["'']canonical["''][^>]*>' "<link rel=""canonical"" href=""$Domain/"">"
    $html = Upsert-Tag $html '<meta\s+property=["'']og:site_name["''][^>]*>' "<meta property=""og:site_name"" content=""$BrandName"">"
    $html = Upsert-Tag $html '<meta\s+property=["'']og:title["''][^>]*>' "<meta property=""og:title"" content=""$SeoTitle"">"
    $html = Upsert-Tag $html '<meta\s+property=["'']og:description["''][^>]*>' "<meta property=""og:description"" content=""$SeoDescription"">"
    $html = Upsert-Tag $html '<meta\s+property=["'']og:url["''][^>]*>' "<meta property=""og:url"" content=""$Domain/"">"
    $html = Upsert-Tag $html '<meta\s+property=["'']og:type["''][^>]*>' "<meta property=""og:type"" content=""website"">"
    $html = Upsert-Tag $html '<meta\s+name=["'']twitter:card["''][^>]*>' "<meta name=""twitter:card"" content=""summary_large_image"">"
    $html = Upsert-Tag $html '<meta\s+name=["'']twitter:title["''][^>]*>' "<meta name=""twitter:title"" content=""$SeoTitle"">"
    $html = Upsert-Tag $html '<meta\s+name=["'']twitter:description["''][^>]*>' "<meta name=""twitter:description"" content=""$SeoDescription"">"
    $html = Upsert-Tag $html '<link\s+rel=["'']manifest["''][^>]*>' "<link rel=""manifest"" href=""/site.webmanifest"">"

    if ($html -ne $original) {
        Backup-File $Path
        Set-Content -Path $Path -Value $html -Encoding UTF8
        return $true
    }

    return $false
}

$changed = 0

Get-ChildItem -Path $ProjectRoot -Recurse -File | ForEach-Object {
    if (Update-TextFile $_.FullName) {
        $script:changed++
        Write-Host "Updated text: $($_.FullName)"
    }
}

$IndexCandidates = @(
    "$ProjectRoot\index.html",
    "$ProjectRoot\client\index.html",
    "$ProjectRoot\frontend\index.html",
    "$ProjectRoot\public\index.html",
    "$ProjectRoot\src\index.html"
)

foreach ($indexPath in $IndexCandidates) {
    if (Update-IndexHtml $indexPath) {
        $changed++
        Write-Host "Updated SEO tags: $indexPath" -ForegroundColor Green
    }
}

# Create/update public files.
$PublicDir = "$ProjectRoot\public"
if (!(Test-Path $PublicDir)) {
    New-Item -ItemType Directory -Path $PublicDir | Out-Null
}

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
    <loc>$Domain/shop</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>$Domain/about</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>$Domain/contact</loc>
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
  "theme_color": "#111827",
  "lang": "en-KE"
}
"@

Set-Content -Path "$PublicDir\robots.txt" -Value $robots -Encoding UTF8
Set-Content -Path "$PublicDir\sitemap.xml" -Value $sitemap -Encoding UTF8
Set-Content -Path "$PublicDir\site.webmanifest" -Value $manifest -Encoding UTF8

Write-Host ""
Write-Host "Created/updated public SEO files:" -ForegroundColor Green
Write-Host "$PublicDir\robots.txt"
Write-Host "$PublicDir\sitemap.xml"
Write-Host "$PublicDir\site.webmanifest"

# Create brand config if src exists.
$SrcDir = "$ProjectRoot\src"
if (Test-Path $SrcDir) {
    $brandConfig = @"
export const brandConfig = {
  name: "SokoYetu Mtaani",
  domain: "https://www.mysokoyetu.co.ke",
  tagline: "Your local online marketplace in Kenya",
  seoTitle: "SokoYetu Mtaani | Online Shopping & Marketplace in Kenya",
  seoDescription:
    "Shop online at SokoYetu Mtaani, a local Kenyan marketplace for trusted sellers, secure payment, quality products, and reliable delivery.",
  homepageHeading: "SokoYetu Mtaani",
  homepageSubheading: "Shop trusted products from local sellers across Kenya.",
  primaryCta: "Shop Now",
  secondaryCta: "Become a Seller",
};
"@
    Set-Content -Path "$SrcDir\brandConfig.js" -Value $brandConfig -Encoding UTF8
    Write-Host "$SrcDir\brandConfig.js"
}

Write-Host ""
Write-Host "Branding update complete." -ForegroundColor Cyan
Write-Host "Changed files found by search/replace: $changed"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Run: npm install"
Write-Host "2. Run your dev command, for example: npm run dev"
Write-Host "3. Check that your homepage and browser tab show SokoYetu Mtaani."
Write-Host "4. Commit and push to GitHub for Render deployment."
Write-Host ""
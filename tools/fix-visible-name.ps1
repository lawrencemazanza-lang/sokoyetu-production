param(
    [string]$ProjectRoot = "."
)

$ErrorActionPreference = "Stop"

$BrandName = "SokoYetu Mtaani"

Write-Host ""
Write-Host "Fixing remaining visible brand text..." -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

if (!(Test-Path $ProjectRoot)) {
    Write-Host "ERROR: Project root does not exist." -ForegroundColor Red
    exit 1
}

$SkipPieces = @(
    "\node_modules\",
    "\.git\",
    "\dist\",
    "\build\",
    "\.next\",
    "\coverage\",
    ".bak-sokoyetu-mtaani"
)

$Extensions = @(
    ".html", ".js", ".jsx", ".ts", ".tsx", ".json", ".md", ".css", ".scss", ".env.example", ".txt"
)

function ShouldSkip($Path) {
    $p = $Path.Replace("/", "\")
    foreach ($piece in $SkipPieces) {
        if ($p.Contains($piece)) { return $true }
    }
    return $false
}

function Backup($Path) {
    $backup = "$Path.bak-visible-sokoyetu"
    if (!(Test-Path $backup)) {
        Copy-Item $Path $backup
    }
}

$changed = 0
$scanned = 0

Get-ChildItem -Path $ProjectRoot -Recurse -File | ForEach-Object {
    $path = $_.FullName
    $ext = [System.IO.Path]::GetExtension($path)

    if ($Extensions -notcontains $ext) { return }
    if (ShouldSkip $path) { return }

    $scanned++
    $content = Get-Content -Path $path -Raw -Encoding UTF8
    $original = $content

    # Clean accidental duplication first.
    $content = $content -replace "SokoYetu Mtaani Mtaani", "SokoYetu Mtaani"

    # Replace common remaining visible-brand phrases.
    $content = $content -replace "Sell on SokoYetu(?! Mtaani)", "Sell on SokoYetu Mtaani"
    $content = $content -replace "WhatsApp SokoYetu(?! Mtaani)", "WhatsApp SokoYetu Mtaani"
    $content = $content -replace "through SokoYetu(?! Mtaani)", "through SokoYetu Mtaani"
    $content = $content -replace "Soko Yetu(?! Mtaani)", "SokoYetu Mtaani"

    # Replace remaining exact SokoYetu not already followed by Mtaani.
    $content = $content -replace "SokoYetu(?! Mtaani)", "SokoYetu Mtaani"

    # Keep technical lowercase names and URLs safe.
    $content = $content.Replace("mysokoyetu.co.ke", "mysokoyetu.co.ke")
    $content = $content.Replace("sokoyetu-elite", "sokoyetu-elite")

    # Clean duplication again.
    $content = $content -replace "SokoYetu Mtaani Mtaani", "SokoYetu Mtaani"

    if ($content -ne $original) {
        Backup $path
        Set-Content -Path $path -Value $content -Encoding UTF8
        $script:changed++
        Write-Host "Updated: $path" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Scanned files: $scanned"
Write-Host "Changed files: $changed"
Write-Host ""

Write-Host "Checking remaining visible SokoYetu text..." -ForegroundColor Cyan
$remaining = Select-String -Path "$ProjectRoot\*" -Pattern "SokoYetu(?! Mtaani)" -Recurse -ErrorAction SilentlyContinue |
    Where-Object {
        $_.Path -notmatch "\\node_modules\\" -and
        $_.Path -notmatch "\\.git\\" -and
        $_.Path -notmatch "\.bak-"
    } |
    Select-Object -First 20

if ($remaining) {
    Write-Host "Some remaining SokoYetu text was found. Review these manually:" -ForegroundColor Yellow
    $remaining | ForEach-Object {
        Write-Host "$($_.Path):$($_.LineNumber) $($_.Line)"
    }
} else {
    Write-Host "No remaining visible SokoYetu-only text found." -ForegroundColor Green
}

Write-Host ""
Write-Host "Next:"
Write-Host "1. Run: npm run dev"
Write-Host "2. Open: http://localhost:5173/"
Write-Host "3. Press: Ctrl + F5"
Write-Host "4. If correct, run: git add . && git commit -m ""Fix visible SokoYetu Mtaani branding"" && git push"
Write-Host ""
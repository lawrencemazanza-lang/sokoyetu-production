@echo off
setlocal EnableExtensions

echo.
echo ============================================
echo  SokoYetu One-Click Technical Repair
echo ============================================
echo.

set "PROJECT_ROOT=%CD%"
if not exist "%PROJECT_ROOT%\server.js" (
  set "PROJECT_ROOT=C:\Users\PC\Desktop\sokoyetu-fullstack\sokoyetu-elite-checked-fixed"
)

echo Project folder:
echo %PROJECT_ROOT%
echo.

if not exist "%PROJECT_ROOT%\server.js" (
  echo ERROR: I cannot find server.js in this folder.
  echo Please copy this CMD file into:
  echo C:\Users\PC\Desktop\sokoyetu-fullstack\sokoyetu-elite-checked-fixed
  echo Then run it again.
  pause
  exit /b 1
)

set "TMP_PS1=%TEMP%\sokoyetu_one_click_repair_%RANDOM%.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%~f0'; $out='%TMP_PS1%'; $lines=Get-Content -LiteralPath $p; $i=[array]::IndexOf($lines,'#BEGINPS1'); if($i -lt 0){ throw 'PowerShell payload not found.' }; $lines[($i+1)..($lines.Length-1)] | Set-Content -LiteralPath $out -Encoding UTF8"

powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" -ProjectRoot "%PROJECT_ROOT%"
set "ERR=%ERRORLEVEL%"

del "%TMP_PS1%" >nul 2>nul

echo.
if "%ERR%"=="0" (
  echo Repair finished.
  echo Now run:
  echo npm run dev
) else (
  echo Repair failed. Please send me the error shown above.
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
Write-Host "Repairing broken SokoYetu technical identifiers..." -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

$skipParts = @("\node_modules\", "\.git\", "\dist\", "\build\", "\.next\", "\coverage\", "\_local_backups\", ".bak-")
$extensions = @(".js", ".jsx", ".ts", ".tsx", ".json", ".mjs", ".cjs", ".env", ".html")

function ShouldSkip([string]$path) {
    $p = $path.Replace("/", "\")
    foreach ($part in $skipParts) {
        if ($p.Contains($part)) { return $true }
    }
    return $false
}

function Backup([string]$path) {
    $backup = "$path.bak-one-click-technical-repair"
    if (!(Test-Path -LiteralPath $backup)) {
        Copy-Item -LiteralPath $path -Destination $backup
    }
}

$changed = 0
$scanned = 0

$files = Get-ChildItem -LiteralPath $ProjectRoot -Recurse -File
foreach ($file in $files) {
    if ($extensions -notcontains $file.Extension) { continue }
    if (ShouldSkip $file.FullName) { continue }

    $scanned++
    $path = $file.FullName
    $content = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    $original = $content

    # Repair package names changed by broad branding replacement.
    $content = $content.Replace("SokoYetu Mtaani-elite-jumia-inspired", "sokoyetu-elite-jumia-inspired")
    $content = $content.Replace('"name": "SokoYetu Mtaani', '"name": "sokoyetu')
    $content = $content.Replace('"SokoYetu Mtaani-elite-jumia-inspired"', '"sokoyetu-elite-jumia-inspired"')

    # Repair invalid JavaScript identifiers and object property names.
    # Example: req.cookies.SokoYetu Mtaani_token -> req.cookies.sokoyetu_token
    $content = [regex]::Replace($content, "\.SokoYetu Mtaani_([A-Za-z0-9_]+)", ".sokoyetu_`$1")
    $content = [regex]::Replace($content, "\bSokoYetu Mtaani_([A-Za-z0-9_]+)", "sokoyetu_`$1")
    $content = [regex]::Replace($content, '(["''])SokoYetu Mtaani_([A-Za-z0-9_]+)(["''])', '$1sokoyetu_$2$3')

    # Repair hyphenated technical keys/packages only.
    $content = [regex]::Replace($content, "\bSokoYetu Mtaani-([A-Za-z0-9_-]+)", "sokoyetu-`$1")
    $content = [regex]::Replace($content, '(["''])SokoYetu Mtaani-([A-Za-z0-9_-]+)(["''])', '$1sokoyetu-$2$3')

    # Repair accidental env/config variable fragments.
    $content = [regex]::Replace($content, "\bSOKOYETU MTAANI_([A-Z0-9_]+)", "SOKOYETU_`$1")

    # Clean duplicated visible brand text only.
    $content = $content.Replace("SokoYetu Mtaani Mtaani", "SokoYetu Mtaani")

    if ($content -ne $original) {
        Backup $path
        Set-Content -LiteralPath $path -Value $content -Encoding UTF8
        $changed++
        Write-Host "Repaired: $path" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Scanned files: $scanned"
Write-Host "Changed files: $changed"

Write-Host ""
Write-Host "Checking for remaining broken patterns..." -ForegroundColor Cyan

$remaining = @()
foreach ($file in (Get-ChildItem -LiteralPath $ProjectRoot -Recurse -File)) {
    if ($extensions -notcontains $file.Extension) { continue }
    if (ShouldSkip $file.FullName) { continue }

    $matches = Select-String -LiteralPath $file.FullName -Pattern "SokoYetu Mtaani_[A-Za-z0-9_]+|SokoYetu Mtaani-[A-Za-z0-9_-]+" -ErrorAction SilentlyContinue
    foreach ($m in $matches) {
        $remaining += $m
        if ($remaining.Count -ge 20) { break }
    }
    if ($remaining.Count -ge 20) { break }
}

if ($remaining.Count -gt 0) {
    Write-Host "Some broken technical patterns may remain:" -ForegroundColor Yellow
    foreach ($m in $remaining) {
        Write-Host "$($m.Path):$($m.LineNumber) $($m.Line)"
    }
    Write-Host ""
    Write-Host "Send me this output if npm run dev still fails." -ForegroundColor Yellow
} else {
    Write-Host "No broken SokoYetu Mtaani_token-style patterns found." -ForegroundColor Green
}

Write-Host ""
Write-Host "Next command:"
Write-Host "npm run dev"
Write-Host ""

exit 0

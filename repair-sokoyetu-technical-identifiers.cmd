@echo off
setlocal

echo.
echo ============================================
echo  Repair SokoYetu technical identifiers
echo ============================================
echo.

set "PROJECT_ROOT=%CD%"

if not exist "%~dp0tools\repair-identifiers.ps1" (
  echo ERROR: Could not find tools\repair-identifiers.ps1
  echo Copy the full ZIP contents into your project folder first.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\repair-identifiers.ps1" -ProjectRoot "%PROJECT_ROOT%"

echo.
echo Done.
echo Now run:
echo npm run dev
echo.
pause

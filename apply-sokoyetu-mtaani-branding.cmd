@echo off
setlocal

echo.
echo ============================================
echo  SokoYetu Mtaani Branding Update
echo ============================================
echo.

set "PROJECT_ROOT=%CD%"

echo Project folder:
echo %PROJECT_ROOT%
echo.

if not exist "%~dp0tools\apply-branding.ps1" (
  echo ERROR: Could not find tools\apply-branding.ps1
  echo Make sure you copied the whole ZIP contents into your project folder.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\apply-branding.ps1" -ProjectRoot "%PROJECT_ROOT%"

echo.
echo Done. Check the messages above.
echo.
pause

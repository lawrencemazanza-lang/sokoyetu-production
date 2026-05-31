@echo off
setlocal

echo.
echo ============================================
echo  Fix visible SokoYetu name to SokoYetu Mtaani
echo ============================================
echo.

set "PROJECT_ROOT=%CD%"

if not exist "%~dp0tools\fix-visible-name.ps1" (
  echo ERROR: Could not find tools\fix-visible-name.ps1
  echo Copy the full ZIP contents into your project folder first.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\fix-visible-name.ps1" -ProjectRoot "%PROJECT_ROOT%"

echo.
echo Done.
echo Now run:
echo npm run dev
echo.
echo Then open http://localhost:5173/ and press Ctrl + F5.
echo.
pause

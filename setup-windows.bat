@echo off
echo Setting up Party Bus Booking Manager on Windows...
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    echo and restart this script.
    pause
    exit /b 1
)

:: Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do set NODE_VERSION=%%a.%%b.%%c
echo Node.js version: %NODE_VERSION:~1%

:: Clean install dependencies
echo Installing dependencies...
if exist node_modules (
    echo Removing existing node_modules folder for a clean install...
    rmdir /s /q node_modules
)

call npm install

echo.
echo Setup complete! You can now run the application with:
echo    .\start-windows.bat
echo.
pause
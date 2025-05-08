@echo off
echo Starting Party Bus Booking Manager...
echo.
set NODE_ENV=development
:: Install dependencies in the right location if not there
if not exist node_modules\express (
    echo Installing missing dependencies locally...
    npm install
)
:: Run with Node.js directly using the Windows-specific server file
echo Using Windows-compatible server configuration...
npx tsx server/index-windows.ts
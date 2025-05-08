@echo off
echo Starting Party Bus Booking Manager...
echo.
set NODE_ENV=development
:: Install dependencies in the right location if not there
if not exist node_modules\express (
    echo Installing missing dependencies locally...
    npm install
)
:: Run with Node.js directly for better Windows compatibility
npx tsx server/index.ts
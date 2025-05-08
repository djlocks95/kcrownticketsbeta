@echo off
echo Starting Party Bus Booking Manager...
echo.
set NODE_ENV=development
set PORT=3000

:: Install dependencies in the right location if not there
if not exist node_modules\express (
    echo Installing missing dependencies locally...
    npm install
)

:: Create a temporary server file with Windows compatibility
echo Creating Windows-compatible server configuration...
echo import express, { type Request, Response, NextFunction } from "express"; > temp-server.ts
echo import { registerRoutes } from "./server/routes"; >> temp-server.ts
echo import { setupVite, serveStatic, log } from "./server/vite"; >> temp-server.ts
echo. >> temp-server.ts
echo const app = express(); >> temp-server.ts
echo app.use(express.json()); >> temp-server.ts
echo app.use(express.urlencoded({ extended: false })); >> temp-server.ts
echo. >> temp-server.ts
echo app.use((req, res, next) => { >> temp-server.ts
echo   const start = Date.now(); >> temp-server.ts
echo   const path = req.path; >> temp-server.ts
echo   let capturedJsonResponse = undefined; >> temp-server.ts
echo. >> temp-server.ts
echo   const originalResJson = res.json; >> temp-server.ts
echo   res.json = function (bodyJson, ...args) { >> temp-server.ts
echo     capturedJsonResponse = bodyJson; >> temp-server.ts
echo     return originalResJson.apply(res, [bodyJson, ...args]); >> temp-server.ts
echo   }; >> temp-server.ts
echo. >> temp-server.ts
echo   res.on("finish", () => { >> temp-server.ts
echo     const duration = Date.now() - start; >> temp-server.ts
echo     if (path.startsWith("/api")) { >> temp-server.ts
echo       let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`; >> temp-server.ts
echo       if (capturedJsonResponse) { >> temp-server.ts
echo         logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`; >> temp-server.ts
echo       } >> temp-server.ts
echo. >> temp-server.ts
echo       if (logLine.length > 80) { >> temp-server.ts
echo         logLine = logLine.slice(0, 79) + "…"; >> temp-server.ts
echo       } >> temp-server.ts
echo. >> temp-server.ts
echo       log(logLine); >> temp-server.ts
echo     } >> temp-server.ts
echo   }); >> temp-server.ts
echo. >> temp-server.ts
echo   next(); >> temp-server.ts
echo }); >> temp-server.ts
echo. >> temp-server.ts
echo (async () => { >> temp-server.ts
echo   const server = await registerRoutes(app); >> temp-server.ts
echo. >> temp-server.ts
echo   app.use((err, _req, res, _next) => { >> temp-server.ts
echo     const status = err.status || err.statusCode || 500; >> temp-server.ts
echo     const message = err.message || "Internal Server Error"; >> temp-server.ts
echo. >> temp-server.ts
echo     res.status(status).json({ message }); >> temp-server.ts
echo   }); >> temp-server.ts
echo. >> temp-server.ts
echo   if (app.get("env") === "development") { >> temp-server.ts
echo     await setupVite(app, server); >> temp-server.ts
echo   } else { >> temp-server.ts
echo     serveStatic(app); >> temp-server.ts
echo   } >> temp-server.ts
echo. >> temp-server.ts
echo   const port = 3000; >> temp-server.ts
echo   server.listen(port, () => { >> temp-server.ts
echo     log(`serving on port ${port}`); >> temp-server.ts
echo     console.log("Open your browser to http://localhost:3000"); >> temp-server.ts
echo   }); >> temp-server.ts
echo })(); >> temp-server.ts

:: Run the Windows-compatible server
echo Starting server on port 3000...
echo Please open your browser to http://localhost:3000
npx tsx temp-server.ts
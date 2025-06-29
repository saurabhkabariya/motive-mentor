@echo off
SETLOCAL

echo ==========================================
echo  TAILWIND RESTORATION - CLEAN ENVIRONMENT
echo ==========================================
echo.

echo [1/5] Killing any existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo [2/5] Cleaning Next.js cache...
rmdir /s /q ".next" 2>nul
rmdir /s /q "node_modules\.cache" 2>nul

echo [3/5] Installing required dependencies...
call npm install -D tailwindcss postcss autoprefixer

echo [4/5] Rebuilding Tailwind CSS configuration...
call npx tailwindcss init -p

echo [5/5] Starting Next.js server in development mode...
set NODE_OPTIONS=
call npm run dev

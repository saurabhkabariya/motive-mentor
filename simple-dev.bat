@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo Killing any existing node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo Cleaning Next.js cache...
rd /s /q ".next" 2>nul
rd /s /q "node_modules\.cache" 2>nul

echo Starting Next.js Development Server without polyfills...
set NODE_OPTIONS=
npx next dev --port 3000

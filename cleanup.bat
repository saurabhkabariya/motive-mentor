@echo off
echo Cleaning up Next.js build files...

REM Stop any running Next.js processes
taskkill /f /im node.exe /fi "WINDOWTITLE eq next*" >nul 2>&1

REM Remove .next directory - using rd command which is more forceful
if exist .next (
  rd /s /q .next 2>nul
  if exist .next (
    echo Failed to remove .next directory with standard commands.
    echo Trying more forceful method...
    echo Y | del /f /s /q .next\* >nul 2>&1
    rd /s /q .next >nul 2>&1
  )
)

REM Clean npm cache
call npm cache clean --force

echo Cleanup complete. You can now rebuild your Next.js application.

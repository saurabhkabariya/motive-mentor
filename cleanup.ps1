# Cleanup script for Next.js issues
Write-Host "Starting cleanup process..." -ForegroundColor Green

# Step 1: Stop any running Next.js processes
Write-Host "Stopping any running Next.js processes..." -ForegroundColor Yellow
$nextProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*next*"}
if ($nextProcesses) {
    $nextProcesses | ForEach-Object { 
        Write-Host "Stopping process with ID: $($_.Id)" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Next.js processes stopped." -ForegroundColor Green
} else {
    Write-Host "No running Next.js processes found." -ForegroundColor Green
}

# Wait a moment to ensure processes are stopped
Start-Sleep -Seconds 2

# Step 2: Remove .next directory
$nextDir = Join-Path (Get-Location) ".next"
Write-Host "Removing .next directory: $nextDir" -ForegroundColor Yellow
if (Test-Path $nextDir) {
    try {
        Remove-Item -Path $nextDir -Recurse -Force
        Write-Host ".next directory removed successfully." -ForegroundColor Green
    } catch {
        Write-Host "Error removing .next directory: $_" -ForegroundColor Red
        Write-Host "Trying alternative method..." -ForegroundColor Yellow
        # Alternative method if permissions issues occur
        Start-Process powershell -ArgumentList "-Command", "Remove-Item -Path '$nextDir' -Recurse -Force" -Verb RunAs
    }
} else {
    Write-Host ".next directory not found." -ForegroundColor Green
}

# Step 3: Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Step 4: Provide instructions for next steps
Write-Host "`nCleanup completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'npm install' to reinstall dependencies" -ForegroundColor Cyan
Write-Host "2. Run 'npm run build' to rebuild the application" -ForegroundColor Cyan
Write-Host "3. Run 'npm run dev' to start the development server" -ForegroundColor Cyan

Write-Host "Starting Next.js development server with proper environment..." -ForegroundColor Cyan

# Check if a server is already running on port 3000
$portInUse = $false
try {
    $connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "Port 3000 is already in use. Will use an alternate port." -ForegroundColor Yellow
        $portInUse = $true
    }
} catch {
    # Continue even if we can't check ports
}

# Set environment variables
$env:NODE_OPTIONS = "--no-experimental-fetch --require=./node-polyfill.js"
$env:NEXT_DISABLE_SWC = "1"

# Check if a specific Node.js version is installed
$nodeVersion = node -v
Write-Host "Using Node.js $nodeVersion" -ForegroundColor Green

# Set the current directory to the script location
Set-Location $PSScriptRoot

# Clean cache if possible
Write-Host "Cleaning Next.js cache..." -ForegroundColor Cyan
try {
    npm run clean
} catch {
    Write-Host "Warning: Could not clean Next.js cache, but continuing anyway..." -ForegroundColor Yellow
}

# Create SWC directory if it doesn't exist
$swcPath = Join-Path $env:APPDATA "next-swc"
if (-not (Test-Path $swcPath)) {
    New-Item -Path $swcPath -ItemType Directory | Out-Null
    Write-Host "Created SWC directory at $swcPath" -ForegroundColor Green
}

# Run Next.js development server
Write-Host "Starting Next.js development server..." -ForegroundColor Cyan
try {
    & node ".\node_modules\next\dist\bin\next" dev
} catch {
    Write-Host "Failed to start server with direct method. Trying npm run dev..." -ForegroundColor Yellow
    npm run dev
}

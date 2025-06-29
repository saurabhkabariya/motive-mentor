Write-Host "Cleaning Next.js and SWC caches..."

# Remove Next.js cache directories
$directories = @(
    ".\.next",
    ".\node_modules\.cache"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "Removing $dir..."
        Remove-Item -Path $dir -Recurse -Force
    }
}

# Find and remove SWC binaries from the node_modules
$swcBinaries = Get-ChildItem -Path ".\node_modules" -Recurse -Filter "*.node" | Where-Object { $_.FullName -match "next[\\/]dist[\\/]compiled[\\/]swc" }

if ($swcBinaries) {
    Write-Host "Found SWC binaries, removing:"
    foreach ($file in $swcBinaries) {
        Write-Host "  $($file.FullName)"
        Remove-Item -Path $file.FullName -Force
    }
}

# Clear npm cache for next package
Write-Host "Clearing npm cache for next package..."
npm cache clean --force

Write-Host "Cleaning complete. Now reinstall dependencies with: npm install"

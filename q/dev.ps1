# Clean start script for QanDuAI project
Write-Host "Starting QanDu AI development server..." -ForegroundColor Cyan

# Kill any existing Node processes to avoid port conflicts
Write-Host "Cleaning up existing Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { 
    Write-Host "Terminating Node.js process with PID $($_.Id)" -ForegroundColor Yellow
    Stop-Process -Id $_.Id -Force 
}

# Start the development server using the wrapper script
Write-Host "Launching development server..." -ForegroundColor Cyan
npm run dev 
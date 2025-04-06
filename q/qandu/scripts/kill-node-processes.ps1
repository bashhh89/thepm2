#!/usr/bin/env pwsh
# Script to kill all Node.js processes and free up ports

Write-Host "Cleaning up existing Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    foreach ($process in $nodeProcesses) {
        Write-Host "Terminating Node.js process with PID $($process.Id)" -ForegroundColor Cyan
        Stop-Process -Id $process.Id -Force
    }
    Write-Host "Successfully terminated $($nodeProcesses.Count) Node.js processes" -ForegroundColor Green
} else {
    Write-Host "No Node.js processes found running" -ForegroundColor Green
}

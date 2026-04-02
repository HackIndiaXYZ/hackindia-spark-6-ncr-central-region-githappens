Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

if (Test-Path "frontend-next") {
    if (Test-Path "frontend") {
        Rename-Item -Path "frontend" -NewName "frontend_old_vite" -Force -ErrorAction SilentlyContinue
    }
    Rename-Item -Path "frontend-next" -NewName "frontend" -Force
    Write-Host "Migration finalized. frontend directory is now Next.js."
} else {
    Write-Host "frontend-next not found. Checking if frontend is already Next.js."
}

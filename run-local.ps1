# Admissions Agent - Run Local Mock Environment
# Double click or run: .\run-local.ps1

Clear-Host
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "   Vishnu Admissions Agent - Local Mock Environment" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host ""

# 1. Start Mock Server in a new console window so logs are separated
Write-Host "🚀 Starting Local Mock Server (Salesforce + Bedrock Agent) in a new window..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"`$Host.UI.RawUI.WindowTitle = 'Admissions Mock Server'; node Backend/mock-server/server.js`""

# 2. Start Next.js Frontend in current console window
Write-Host "🎨 Starting Next.js Frontend Dev Server on http://localhost:3000..." -ForegroundColor Cyan
Set-Location Frontend
npm run dev

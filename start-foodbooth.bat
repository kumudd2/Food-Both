@echo off
title FoodBooth Launcher
cd /d "d:\new"

:: Ensure PostgreSQL service is started
net start postgresql-x64-18 >nul 2>&1

:: Check if server is already running on port 3000
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo Starting FoodBooth server in background...
    start "" /b cmd /c "node serve.js > server.log 2>&1"
    timeout /t 2 >nul
) else (
    echo FoodBooth server is already running.
)

:: Open browser
start http://localhost:3000

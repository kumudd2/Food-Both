@echo off
title FoodBooth - Campus Pre-Order Web App
echo ========================================================
echo   🍔 Launching FoodBooth Production Web App
echo ========================================================
echo.
echo Starting web server on http://localhost:3000 ...
start "" node serve.js
timeout /t 2 /nobreak >nul
start "" http://localhost:3000
echo.
echo ========================================================
echo   FoodBooth is live!
echo   - Computer Browser: http://localhost:3000
echo   - Phone / Tablets:  http://10.236.14.111:3000
echo ========================================================
echo.
pause

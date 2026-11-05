@echo off
title FoodBooth - Campus Pre-Order Web App
echo ========================================================
echo   Launching FoodBooth Production Web App
echo ========================================================
echo.
echo Starting web server on http://localhost:3000 ...
start "" node serve.js
timeout /t 2 /nobreak >nul
start "" http://localhost:3000
echo FoodBooth is live at http://localhost:3000!
echo.
pause

@echo off
title Smart Cafeteria - Python Flask Backend Server
echo ===================================================================
echo   Starting Smart Cafeteria Python Flask Backend Server
echo ===================================================================
echo.

where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python was not found in your system PATH.
    echo.
    echo Please install Python 3.9+ from:
    echo   1. Windows Terminal: winget install Python.Python.3.11
    echo   2. Official Website: https://www.python.org/downloads/
    echo   3. Microsoft Store:  Search for "Python 3.11"
    echo.
    echo Make sure to check the box "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo Checking virtual environment...
if not exist "venv" (
    echo Creating virtual environment (venv)...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing required Python packages (Flask, Flask-CORS)...
pip install -r requirements.txt --quiet

echo.
echo ===================================================================
echo   Smart Cafeteria Backend Server starting on http://127.0.0.1:5000
echo   Press CTRL+C anytime to stop the server.
echo ===================================================================
echo.

python app.py

pause

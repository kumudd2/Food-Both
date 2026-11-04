@echo off
title Smart Cafeteria - Database Setup
echo ===================================================================
echo   Building Smart Cafeteria Database (from cafeteria_schema.sql)
echo ===================================================================
echo.

if exist "%~dp0build_database.exe" (
    echo [*] Running Native Windows Database Builder...
    "%~dp0build_database.exe"
    goto :done
)

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [*] Running Python Database Builder...
    python "%~dp0init_database.py"
    goto :done
)

echo [ERROR] Neither build_database.exe nor Python was found.
echo Please install Python 3.9+ or run build_database.exe.
pause
exit /b 1

:done
echo.
echo ===================================================================
echo   Database built and populated successfully: cafeteria.db
echo ===================================================================
pause

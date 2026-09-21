@echo off
title OmniPDF Web Studio Launcher
echo ===================================================
echo           Starting OmniPDF Studio Website          
echo ===================================================
echo [1/2] Launching Python FastAPI Conversion Engine...
cd /d "%~dp0\backend"
start /b python main.py

echo [2/2] Opening browser at http://127.0.0.1:8000
timeout /t 2 /nobreak >nul
start http://127.0.0.1:8000

echo.
echo OmniPDF Studio is running! Keep this terminal open.
echo URL: http://127.0.0.1:8000
echo.
pause

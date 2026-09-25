@echo off
chcp 65001 >nul
title TIS Lab Computer - បិទ Server
cls
echo ==========================================================
echo    🛑 កំពុងបិទ TIS Lab Computer Server...
echo ==========================================================
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
)
echo.
echo ✅ Server បានបិទរួចរាល់ដោយជោគជ័យ!
timeout /t 2 >nul

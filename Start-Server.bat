@echo off
chcp 65001 >nul
title TIS Lab Computer - ប្រព័ន្ធគ្រប់គ្រងសិស្ស Server (HostImg Pro)
cls
echo ==========================================================
echo    🏫 TIS Lab Computer - Modern School Web Server
echo    🌐 Localhost:  http://localhost:8080/
echo    📱 LAN / Wi-Fi: កុំព្យូទ័រ និងទូរស័ព្ទក្នុងបណ្តាញអាចចូលបានទាំងអស់!
echo ==========================================================
echo.
timeout /t 1 >nul
start http://localhost:8080/
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    node "%~dp0local-server.js"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
)
pause


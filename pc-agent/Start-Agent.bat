@echo off
chcp 65001 >nul
title TIS Lab Computer - Student PC Live Agent
color 0b
cd /d "%~dp0"

echo ========================================================
echo   TIS Lab Computer - Student PC Background Agent
echo   Connecting to Teacher Cockpit ^& Firebase Live Sync...
echo ========================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tis-lab-agent.ps1" %*
echo.
echo ========================================================
echo   Agent បានឈប់ដំណើរការ។ សូមពិនិត្យមើលសារខាងលើ។
echo ========================================================
pause



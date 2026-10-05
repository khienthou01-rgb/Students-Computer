@echo off
title TIS Lab Computer - Student PC Live Agent
color 0b
cd /d "%~dp0"

echo ========================================================
echo   TIS Lab Computer - Student PC Background Agent
echo   Connecting to Teacher Cockpit and Firebase Sync...
echo ========================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tis-lab-agent.ps1" %*

echo.
echo ========================================================
echo   Agent has stopped.
echo ========================================================
pause

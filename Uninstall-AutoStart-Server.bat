@echo off
chcp 65001 >nul
title TIS Lab Server - Disable Auto-Start
cls

echo ============================================================
echo   TIS LAB COMPUTER - DISABLE SERVER AUTO-START
echo ============================================================
echo.
echo Removing from Windows Registry...
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "TISLabServer" /f >nul 2>nul

echo Removing from Windows Startup Folder...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$folder = [Environment]::GetFolderPath('Startup'); $lnk = Join-Path $folder 'TIS-Lab-Server.lnk'; if (Test-Path $lnk) { Remove-Item $lnk -Force }" >nul 2>nul

echo.
echo [✓] Auto-Start has been disabled successfully.
echo.
pause

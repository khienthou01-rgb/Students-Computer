@echo off
chcp 65001 >nul
title TIS Lab Server - Auto-Start Setup
cls

echo ============================================================
echo   TIS LAB COMPUTER - ENABLE SERVER AUTO-START
echo ============================================================
echo.
echo [1/3] Configuring Windows Registry...
set "SCRIPT_DIR=%~dp0"
set "VBS_PATH=%~dp0Start-Background.vbs"

REM 1. Add to Windows Registry Run key
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "TISLabServer" /t REG_SZ /d "wscript.exe \"%VBS_PATH%\" /autostart" /f >nul 2>nul

echo [2/3] Creating Windows Startup Shortcut...
REM 2. Create shortcut in Windows Startup Folder
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $folder = [Environment]::GetFolderPath('Startup'); $s = $ws.CreateShortcut((Join-Path $folder 'TIS-Lab-Server.lnk')); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"%VBS_PATH%\" /autostart'; $s.WorkingDirectory = '%~dp0'; $s.Save()" >nul 2>nul

echo [3/3] Starting Server in background now...
wscript.exe "%VBS_PATH%" /autostart

echo.
echo ============================================================
echo   [SUCCESS] Auto-Start is now permanently enabled!
echo   Server will start automatically every time Windows boots.
echo.
echo   Localhost:  http://localhost:8080/
echo ============================================================
echo.
pause

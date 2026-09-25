@echo off
title TIS Lab Computer - Install AutoStart Shortcut
color 0a
cd /d "%~dp0"

echo ========================================================
echo   TIS Lab Computer - Setup AutoStart for Windows
echo ========================================================
echo.

set "AGENT_DIR=%~dp0"
set "VBS_TARGET=%AGENT_DIR%Silent-Start.vbs"

powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $shortcutPath = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup\TIS-Lab-Agent.lnk'; $s = $ws.CreateShortcut($shortcutPath); $s.TargetPath = '%VBS_TARGET%'; $s.WorkingDirectory = '%AGENT_DIR%'; $s.Save()"

echo [OK] Auto-Start shortcut installed successfully!
echo [OK] Agent will run silently in background on Windows startup.
echo ========================================================
pause


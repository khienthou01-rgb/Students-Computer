@echo off
title TIS Lab Computer - Stop Agent
color 0c
cd /d "%~dp0"
echo Stopping TIS Lab Agent and Student Assistant...
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'mshta.exe' -or ($_.Name -like 'powershell*' -and $_.CommandLine -like '*tis-lab-agent*') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Get-Process -Name 'mshta' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
echo [OK] Agent stopped successfully.
pause


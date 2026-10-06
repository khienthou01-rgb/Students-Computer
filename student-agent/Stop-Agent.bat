@echo off
chcp 65001 >nul
title TIS Student Agent - Stopping
echo Stopping TIS Student Agent processes...
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*tis_student_agent.py*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
echo [✓] TIS Student Agent stopped.
timeout /t 2 >nul
exit

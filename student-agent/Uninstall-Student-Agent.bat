@echo off
chcp 65001 >nul
title TIS Student Agent - Uninstaller
cd /d "%~dp0"

echo ===============================================================================
echo     TIAN XIN INTERNATIONAL SCHOOL (TIS) - STUDENT AGENT UNINSTALLER
echo ===============================================================================
echo.

echo [*] Terminating running Student Agent processes...
taskkill /f /fi "WINDOWTITLE eq *TIS Student Agent*" >nul 2>&1
wmic process where "commandline like '%%tis_student_agent.py%%'" call terminate >nul 2>&1

echo [*] Removing Windows Auto-Start Registry key...
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "TIS_Student_Agent" /f >nul 2>&1

echo [*] Removing installed files and configuration...
if exist "C:\ProgramData\TIS-Lab-Agent" (
    rmdir /s /q "C:\ProgramData\TIS-Lab-Agent"
)

echo.
echo [✓] SUCCESS: TIS Student Agent has been completely removed from this computer.
echo.
timeout /t 5 >nul
exit /b 0

@echo off
title TIS Lab Computer - Set Static IP (Command Prompt Fallback)
cd /d "%~dp0"
cls
echo ========================================================
echo   TIS Lab Computer - Student PC IP Setup (CMD Mode)
echo ========================================================
echo.

:: Check Admin Rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Administrator rights required!
    echo Please Right-Click this file and choose:
    echo "Run as administrator"
    echo.
    pause
    exit /b 1
)

:: Find Network Interface
set "NIC=Ethernet"
netsh interface show interface | findstr /i "Ethernet" >nul
if %errorlevel% neq 0 (
    set "NIC=Wi-Fi"
)
echo Active Network Interface: "%NIC%"
echo.
echo Please enter the Student PC Number (e.g. 1 for PC-01, 2 for PC-02, 16 for PC-16):
set /p PC_NUM="PC Number: "
if "%PC_NUM%"=="" set "PC_NUM=1"

set /a IP_OCTET=100 + %PC_NUM%
set "TARGET_IP=192.168.1.%IP_OCTET%"
set "SUBNET=255.255.255.0"
set "GATEWAY=192.168.1.1"

echo.
echo Setting IP Address: %TARGET_IP% on "%NIC%"...
netsh interface ip set address name="%NIC%" static %TARGET_IP% %SUBNET% %GATEWAY% 1 >nul 2>&1
netsh interface ip set dns name="%NIC%" static 8.8.8.8 primary >nul 2>&1
netsh interface ip add dns name="%NIC%" 1.1.1.1 index=2 >nul 2>&1

echo Enabling Remote Desktop (Port 3389)...
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f >nul 2>&1
netsh advfirewall firewall set rule group="remote desktop" new enable=Yes >nul 2>&1
sc config TermService start= auto >nul 2>&1
net start TermService >nul 2>&1

echo.
echo ========================================================
echo [SUCCESS] PC configured successfully!
echo IP Address:     %TARGET_IP%
echo Remote Desktop: Enabled (Port 3389)
echo.
echo You can now manage this PC from Teacher Dashboard:
echo https://students-computer.vercel.app/
echo ========================================================
echo.
pause

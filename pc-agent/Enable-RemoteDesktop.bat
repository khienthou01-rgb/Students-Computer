@echo off
:: ============================================================================
:: Enable Windows Remote Desktop (RDP) & Firewall Rule
:: MasterSchool TIS Lab Computer Management
:: ============================================================================
chcp 65001 >nul
echo.
echo ============================================================================
echo   TIS Lab Computer - បើកដំណើរការ Remote Desktop (RDP Port 3389)
echo ============================================================================
echo.

:: Check Admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] សូម Right Click លើ File នេះហើយរើស "Run as administrator"!
    pause
    exit /b 1
)

echo [*] កំពុងបើក Remote Desktop ក្នុង Windows Registry...
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f >nul

echo [*] កំពុងបើក Port 3389 លើ Windows Firewall...
netsh advfirewall firewall set rule group="remote desktop" new enable=Yes >nul

echo [*] កំពុងកំណត់សេវាកម្ម TermService ឱ្យដំណើរការស្វ័យប្រវត្តិ...
sc config TermService start= auto >nul
net start TermService >nul 2>&1

echo.
echo ============================================================================
echo [ជោគជ័យ] បានបើក Remote Desktop (RDP) រួចរាល់!
echo លោកគ្រូអាច Follow និងបញ្ជាកុំព្យូទ័រនេះតាម IP បានភ្លាមៗពីផ្ទាំង Web!
echo ============================================================================
echo.
pause

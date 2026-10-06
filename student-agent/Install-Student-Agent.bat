@echo off
chcp 65001 >nul
title TIS Student Agent - Windows Installer & Setup
cd /d "%~dp0"

echo ===============================================================================
echo     TIAN XIN INTERNATIONAL SCHOOL (TIS) - COMPUTER LAB STUDENT AGENT INSTALLER
echo ===============================================================================
echo.

:: 1. Check Python installation
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python is not detected in system PATH.
    echo [*] Attempting to install Python via Windows Package Manager (winget)...
    winget install --id Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements
    where python >nul 2>&1
    if %errorlevel% neq 0 (
        echo [X] Python installation failed. Please install Python 3.10+ manually and rerun this installer.
        pause
        exit /b 1
    )
)

echo [✓] Python is installed.
python --version

:: 2. Install required Python packages
echo.
echo [*] Installing required Python libraries (Pillow, websockets)...
python -m pip install --upgrade pip --quiet
python -m pip install Pillow websockets --quiet
if %errorlevel% neq 0 (
    echo [!] Pip install encountered a warning, continuing...
)

:: 3. Prepare Deployment Directory in ProgramData
set "DEST_DIR=C:\ProgramData\TIS-Lab-Agent"
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"
if not exist "C:\Classroom\Lessons" mkdir "C:\Classroom\Lessons"

echo.
echo [*] Deploying files to %DEST_DIR%...
xcopy /y /q "%~dp0*.py" "%DEST_DIR%\" >nul
xcopy /y /q "%~dp0*.bat" "%DEST_DIR%\" >nul

:: 4. Check for enrollment token parameter
set "TOKEN=%~1"
if "%TOKEN%"=="" (
    if not exist "%DEST_DIR%\agent_config.json" (
        echo.
        set /p "TOKEN=Enter 6-digit Classroom Enrollment Token (Leave blank if already registered): "
    )
)

if not "%TOKEN%"=="" (
    echo.
    echo [*] Registering student computer with token: %TOKEN%...
    python "%DEST_DIR%\tis_student_agent.py" --token %TOKEN% --silent
)

:: 5. Configure Windows Auto-Start
echo.
echo [*] Configuring Windows Auto-Start registry...
python "%DEST_DIR%\tis_student_agent.py" --autostart --silent

:: 6. Launch Student Agent
echo.
echo [*] Starting Student Agent in background...
start "" pythonw "%DEST_DIR%\tis_student_agent.py" --silent

echo.
echo ===============================================================================
echo [✓] SUCCESS: TIS Student Agent installed and running successfully!
echo     The computer is now actively connected to the Computer Lab classroom.
echo ===============================================================================
echo.
timeout /t 5 >nul
exit /b 0

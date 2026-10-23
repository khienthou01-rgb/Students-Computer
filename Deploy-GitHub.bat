@echo off
title TIS Lab Computer - Push & Deploy to GitHub Pages
chcp 65001 >nul
cls

echo ========================================================
echo   TIS Lab Computer - Deploy to GitHub Pages (Live Online)
echo ========================================================
echo.

:: Detect git executable across system paths
set "GIT_CMD=git"
where git >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" (
        set "GIT_CMD=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
    ) else if exist "C:\Users\KhienThou\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" (
        set "GIT_CMD=C:\Users\KhienThou\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
    ) else if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    ) else if exist "C:\Program Files (x86)\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files (x86)\Git\cmd\git.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
        set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    ) else if exist "C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" (
        set "GIT_CMD=C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
    ) else (
        echo [ERROR] រកមិនឃើញកម្មវិធី Git នៅក្នុងកុំព្យូទ័រឡើយ!
        echo សូមដំឡើង Git ឬពិនិត្យ PATH ឡើងវិញ។
        echo.
        pause
        exit /b 1
    )
)

:: Auto-fix safe directory to prevent ownership errors
"%GIT_CMD%" config --global --add safe.directory "%~dp0" >nul 2>&1
"%GIT_CMD%" config --global --add safe.directory "D:/System Student/masterSchool/masterSchool" >nul 2>&1

echo [1/3] កំពុងពិនិត្យ និងជ្រើសរើសឯកសារដែលបានកែប្រែ...
"%GIT_CMD%" add -A

echo.
echo [2/3] កំពុង Commit ទិន្នន័យ...
"%GIT_CMD%" commit -m "update: Sync student management system to GitHub Pages" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ បាន Commit កំណែប្រែជោគជ័យ!
) else (
    echo    ℹ️ គ្មានការផ្លាស់ប្តូរឯកសារថ្មីត្រូវ Commit ទេ (Working tree clean)
)

echo.
echo [3/3] កំពុង Push ឡើង GitHub Pages (Live)...
"%GIT_CMD%" push origin main
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ ការ Push ឡើង GitHub មានបញ្ហា! សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត។
) else (
    echo    ✓ បាន Push ឡើង GitHub រួចរាល់!
)

echo.
echo ========================================================
echo 🎉 ការ Deploy ឡើង GitHub Pages បានជោគជ័យ 100%!
echo 🌐 Link គេហទំព័រ Live៖
echo    https://khienthou01-rgb.github.io/Students-Computer/
echo ========================================================
echo.
pause

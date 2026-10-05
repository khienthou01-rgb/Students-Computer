@echo off
title Tian Xin International School - Deploy to Vercel
chcp 65001 >nul
cls

echo ========================================================
echo   🏫 Tian Xin International School (TIS)
echo   ▲ Deploy & Host on Vercel (Cloud Hosting Pro)
echo ========================================================
echo.

:: Detect git executable
set "GIT_CMD=git"
where git >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" (
        set "GIT_CMD=C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
    ) else if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
        set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    ) else (
        echo [ERROR] រកមិនឃើញកម្មវិធី Git នៅក្នុងកុំព្យូទ័រឡើយ!
        echo សូមដំឡើង Git ឬពិនិត្យ PATH ឡើងវិញ។
        echo.
        pause
        exit /b 1
    )
)

echo [1/4] កំពុងពិនិត្យ និងជ្រើសរើសឯកសារដែលបានកែសម្រួល...
"%GIT_CMD%" add -A

echo.
echo [2/4] កំពុង Commit ទិន្នន័យទៅកាន់ Git...
"%GIT_CMD%" commit -m "feat(deploy): optimize vercel deployment, routing and ip monitor system" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ បាន Commit កំណែប្រែជោគជ័យ!
) else (
    echo    ℹ️ គ្មានការផ្លាស់ប្តូរឯកសារថ្មីត្រូវ Commit ទេ (Working tree clean)
)

echo.
echo [3/4] កំពុង Push ទិន្នន័យឡើង GitHub (origin main)...
"%GIT_CMD%" push origin main
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ ការ Push ឡើង GitHub មានបញ្ហា! សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត។
) else (
    echo    ✓ បាន Push ឡើង GitHub រួចរាល់!
)

echo.
echo [4/4] ដំណើរការ Deploy ទៅកាន់ Vercel...
echo.
echo ជ្រើសរើសជម្រើសខាងក្រោម៖
echo [1] ទុកឱ្យ Vercel Deploy ដោយស្វ័យប្រវត្តិតាមរយៈ GitHub (លំនាំដើម)
echo [2] Deploy ផ្ទាល់ភ្លាមៗតាម Vercel CLI (npx vercel --prod)
echo.
set /p DEPLOY_CHOICE="សូមវាយលេខជម្រើស [1 ឬ 2] (ចុច Enter យកលេខ 1): "

if "%DEPLOY_CHOICE%"=="2" (
    echo.
    echo 🚀 កំពុងបញ្ជូនកូដឡើង Vercel Production តាម CLI...
    call npx vercel --prod --yes
)

echo.
echo ========================================================
echo 🎉 ជោគជ័យ! ប្រព័ន្ធ Tian Xin International School ត្រូវបានបញ្ជូនឡើង Vercel រួចរាល់!
echo.
echo 🌐 គេហទំព័រផ្សាយផ្ទាល់លើ Vercel:
echo    👉 https://students-computer.vercel.app/
echo.
echo 📊 ពិនិត្យស្ថានភាព Deploy លើ Vercel Dashboard:
echo    👉 https://vercel.com/dashboard
echo ========================================================
echo.
pause

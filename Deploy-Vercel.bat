@echo off
title Tian Xin International School - Deploy to Vercel
chcp 65001 >nul
cls
echo ========================================================
echo   🏫 Tian Xin International School (TIS)
echo   ▲ Deploy & Host on Vercel
echo ========================================================
echo.
echo [1/3] កំពុងពិនិត្យ និងជ្រើសរើសឯកសារដែលបានកែប្រែ...
"C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" add -A

echo.
echo [2/3] កំពុង Commit ទិន្នន័យទៅកាន់ GitHub...
"C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" commit -m "deploy: Update project configuration for Vercel Hosting"

echo.
echo [3/3] កំពុង Push ឡើង GitHub...
"C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" push origin main

echo.
echo ========================================================
echo 🎉 បានរុញទិន្នន័យឡើង GitHub រួចរាល់!
echo.
echo ▲ ប្រសិនបើលោកអ្នកបានភ្ជាប់ GitHub ជាមួយ Vercel៖
echo    Vercel នឹង Deploy គេហទំព័រនេះដោយស្វ័យប្រវត្តភ្លាមៗ!
echo.
echo 🌐 របៀបភ្ជាប់ GitHub ជាមួយ Vercel (ប្រសិនបើមិនទាន់បានភ្ជាប់)៖
echo    1. ចូលទៅកាន់ https://vercel.com/new
echo    2. ជ្រើសរើស Repository "Students-Computer"
echo    3. ចុច "Deploy" ជាការស្រេច!
echo ========================================================
echo.
pause

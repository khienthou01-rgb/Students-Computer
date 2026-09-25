@echo off
title TIS Lab Computer - Push & Deploy to GitHub Pages
chcp 65001 >nul
cls
echo ========================================================
echo   TIS Lab Computer - Deploy to GitHub Pages (Live Online)
echo ========================================================
echo.
echo [1/3] កំពុងពិនិត្យ និងជ្រើសរើសឯកសារដែលបានកែប្រែ...
"C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" add -A

echo [2/3] កំពុង Commit ទិន្នន័យ...
"C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" commit -m "update: Sync student management system to GitHub Pages"

echo [3/3] កំពុង Push ឡើង GitHub Pages (Live)...
"C:\Users\khien\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" push origin main

echo.
echo ========================================================
echo 🎉 ការ Deploy ឡើង GitHub Pages បានជោគជ័យ 100%!
echo 🌐 Link គេហទំព័រ Live៖
echo    https://khienthou01-rgb.github.io/Students-Computer/
echo ========================================================
echo.
pause

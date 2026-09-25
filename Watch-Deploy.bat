@echo off
title TIS Lab Computer - Live Watcher ^& Auto-Deploy
chcp 65001 >nul
cls
echo ========================================================
echo   TIS Lab Computer - កំពុងដំណើរការ Live Watcher ^& Auto-Deploy
echo   (រាល់ពេលលោកអ្នកកែសម្រួលកូដ Save វានឹង Deploy ដោយស្វ័យប្រវត្តិ)
echo ========================================================
echo.
node watch-deploy.js
echo.
pause

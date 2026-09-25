@echo off
title TIS Lab Computer - Smart Deploy to Firebase Hosting (Auto Cache-Busting)
chcp 65001 >nul
cls
echo ========================================================
echo   TIS Lab Computer - Smart Deploy & Live Cache Update
echo ========================================================
echo.
node deploy.js
echo.
pause

@echo off
title Tian Xin International School - Deploy to Vercel
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\deploy-vercel.ps1"
if %errorlevel% neq 0 pause

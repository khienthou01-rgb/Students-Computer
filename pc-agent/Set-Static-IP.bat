@echo off
title TIS Lab Computer - Set Static IP
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "& { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; & '%~dp0Set-Static-IP.ps1' }"
if %errorlevel% neq 0 (
    echo.
    echo An error occurred while executing the script.
    pause
)

@echo off
title TIS Lab Computer - Enable Remote Desktop
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "& { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; & '%~dp0Enable-RemoteDesktop.ps1' }"
if %errorlevel% neq 0 (
    echo.
    echo An error occurred while executing the script.
    pause
)

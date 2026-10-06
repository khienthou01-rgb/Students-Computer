@echo off
chcp 65001 >nul
title TIS Student Agent - Enable Auto-Start
cd /d "%~dp0"
echo ============================================================
echo   TIS STUDENT AGENT - ENABLING WINDOWS AUTO-START
echo ============================================================
echo.
python tis_student_agent.py --autostart --silent
echo.
echo [✓] Auto-Start configured. The agent will launch automatically when Windows starts.
pause
exit

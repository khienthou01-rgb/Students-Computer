@echo off
chcp 65001 >nul
title TIS Student Agent - Launching
cd /d "%~dp0"
echo ============================================================
echo   TIAN XIN INTERNATIONAL SCHOOL - STUDENT AGENT
echo ============================================================
echo Starting Student Agent in background...
start "" pythonw tis_student_agent.py %*
echo [✓] Student Agent is now running in background.
timeout /t 2 >nul
exit

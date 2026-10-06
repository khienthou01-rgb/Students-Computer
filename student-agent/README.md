# TIS Student Agent (Client Application)
**Computer Classroom Management Client for Windows**
Tian Xin International School (TIS)

---

## Overview
The **TIS Student Agent** runs natively on student computers in the classroom. It provides lightweight, high-performance background services to enable teacher supervision, screen monitoring, screen broadcasting, file transfer, and authorized remote control across the Local Area Network (LAN).

## Key Capabilities
- **Zero-IP Automatic Registration:** Registers via One-Time Token (OTT) or QR code.
- **Hardware Telemetry:** Auto-reports CPU, RAM, GPU, OS, Screen resolution, MAC, and LAN IP.
- **Persistent Machine ID:** Retains permanent identity even across DHCP IP changes.
- **Screen Monitoring:** Transmits adaptive JPEG screen frames on teacher demand.
- **Teacher Broadcast Viewer:** Displays teacher screen full-screen or windowed.
- **Interactive Remote Control:** Responds to authorized teacher mouse & keyboard commands with a visible on-screen security banner.
- **Lock Screen:** Locks workstation when requested by teacher.
- **File Distribution & Collection:** Downloads lesson materials and uploads student assignments.
- **Auto-Reconnection:** Automatically reconnects upon network recovery or PC reboot.

## Quick Start
```cmd
:: 1. Install & configure auto-start:
Install-Student-Agent.bat <TOKEN>

:: 2. Manual launch:
Start-Agent.bat

:: 3. Stop background agent:
Stop-Agent.bat

:: 4. Complete uninstallation:
Uninstall-Student-Agent.bat
```

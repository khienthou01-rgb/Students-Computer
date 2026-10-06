# TIS COMPUTER LAB MANAGEMENT SYSTEM - DEPLOYMENT & OPERATIONS MANUAL
**Tian Xin International School (TIS) - Computer Classroom Management System**
*Integrated NetSupport School & Veyon Architecture*

---

## 1. System Overview & Architecture

The Computer Lab Management System integrates directly into the existing Tian Xin International School (TIS) Student Management System. It operates on a **LAN-first high-performance architecture** supporting 20–40 student computers concurrently.

```
+---------------------------------------------------------------------------------+
|                 TIAN XIN INTERNATIONAL SCHOOL - TEACHER CONSOLE                 |
|       (Integrated into Student Management System Web UI - Port 8080)            |
+---------------------------------------+-----------------------------------------+
                                        |
                     HTTP REST API & WebSocket (/ws/classroom)
                                        |
+---------------------------------------v-----------------------------------------+
|                          TIS CLASSROOM HUB SERVER                               |
|        - Realtime WebSocket Server (ws://<SERVER-IP>:8080/ws/classroom)         |
|        - REST API Endpoints (/api/lab/*)                                        |
|        - Zero-IP One-Time Token (OTT) Engine & Dynamic QR Code Generator         |
|        - File Distribution & Assignment Collection Storage Engine               |
|        - Audit Logging & Session Attendance Auto-Synchronization                |
+---------------------------------------+-----------------------------------------+
                                        |
                 Local Area Network (LAN) WebSocket & HTTP Streaming
                                        |
         +------------------------------+------------------------------+
         |                                                             |
+--------v----------------------+                            +---------v---------------------+
|      STUDENT AGENT PC-01      |                            |      STUDENT AGENT PC-40      |
|  - Windows Background Service |                            |  - Windows Background Service |
|  - Native Hardware Telemetry  |   ... (20 to 40 PCs) ...   |  - Native Hardware Telemetry  |
|  - Screen Capture Engine      |                            |  - Screen Capture Engine      |
|  - Interactive Remote Control |                            |  - Interactive Remote Control |
|  - Lock Screen Overlay        |                            |  - Lock Screen Overlay        |
|  - Broadcast Viewer           |                            |  - Broadcast Viewer           |
|  - File Transfer Downloader   |                            |  - File Transfer Downloader   |
+-------------------------------+                            +-------------------------------+
```

---

## 2. Server Deployment & First-Run Setup

### Requirements
- **Operating System:** Windows 10/11 or Windows Server (also Linux/macOS compatible)
- **Node.js:** v18.0.0 or higher
- **Local Network:** Standard Ethernet or Wi-Fi LAN

### Starting the Server
1. Open PowerShell or Command Prompt in the project root:
   ```cmd
   cd "d:\System Student\masterSchool\masterSchool"
   ```
2. Start the integrated classroom server:
   ```cmd
   node server.js
   ```
3. The server starts listening on `0.0.0.0:8080`.
   - Access the Teacher Admin Console at: `http://localhost:8080` (or `http://<SERVER-LAN-IP>:8080`)
   - Realtime WebSocket Hub runs at: `ws://<SERVER-LAN-IP>:8080/ws/classroom`

---

## 3. Teacher Console Workflow

1. **Log in** with Teacher/Admin account (e.g. `លោកគ្រូ ខៀន ធូ`).
2. Click **🖥 បន្ទប់កុំព្យូទ័រ (Computer Lab)** in the sidebar navigation.
3. **Submenus:**
   - **Overview:** Live dashboard metrics, active computers, and quick bulk actions.
   - **Computers:** Comprehensive grid / list cards with real-time CPU, RAM, Ping, and thumbnail previews.
   - **Screen Monitor:** Multi-screen live matrix (`2×2`, `3×3`, `4×4`) with adjustable FPS and quality.
   - **Broadcast:** Stream teacher's screen to all student screens in real-time.
   - **Files:** Distribute lesson materials and inspect submitted assignments.
   - **Messages:** Send announcements, instructions, and warnings directly onto student screens.
   - **Sessions:** Start classroom sessions with automatic TIS attendance integration.
   - **Enrollment:** Generate One-Time Tokens (OTT) and QR codes for zero-IP registration.
   - **Audit Logs:** Full traceability for every command executed by teachers.
   - **Settings:** Adjust stream FPS, quality, token expiration, and allowed applications.

---

## 4. Student Agent Deployment (Zero-IP Setup)

Student computers require **NO manual typing of IP addresses**.

### Method A: One-Click Web QR Enrollment (Recommended)
1. On the Teacher Console, navigate to **Enrollment (ចុះឈ្មោះ & QR)**.
2. Display the generated QR Code on the classroom projector or copy the enrollment link (e.g. `http://192.168.1.105:8080/enroll/ABCD12`).
3. Student opens the link in their browser and clicks **[Download Student Agent]**.
4. Double-click the downloaded setup batch file. The agent will:
   - Auto-detect the server's LAN IP.
   - Inspect CPU, RAM, GPU, OS, Screen resolution, and MAC address.
   - Calculate permanent Machine ID (`MID-...`).
   - Register itself with the server using the single-use token.
   - Burn the token and transition to **🟢 ONLINE**.

### Method B: Classroom Installer Batch File
On any student computer:
1. Run `student-agent\Install-Student-Agent.bat`.
2. Enter the 6-digit classroom token when prompted (or pass as argument: `Install-Student-Agent.bat ABCD12`).
3. The installer installs required Python packages (`Pillow`, `websockets`), copies files to `C:\ProgramData\TIS-Lab-Agent`, registers Windows Auto-Start, and launches the background agent.

---

## 5. Security & Access Control

- **Cryptographic One-Time Tokens (OTT):** Generated with secure randomness (`crypto.randomBytes`). Tokens expire after a configurable TTL (default 10–30 minutes) and are burned immediately upon registration.
- **Hardware Machine Identity:** Hardware UUID and Motherboard serials are hashed into permanent Machine IDs. Dynamic DHCP changes (e.g., `192.168.1.101` -> `192.168.1.150`) do not affect computer identity.
- **Authorized Remote Control Banner:** Remote control requires teacher authentication and displays a prominent, topmost banner on the student's screen: *"Teacher Remote Control Active"*. Uncontrolled or stealth remote access is strictly prevented.
- **Application Allowlists:** Teachers can enforce allowed applications (`WINWORD.EXE`, `EXCEL.EXE`, `chrome.exe`, etc.) to keep students focused.
- **Audit Logging:** Every command (Lock, Unlock, Broadcast, Message, File Send, Remote Control, Restart, Shutdown) is recorded in `lab_db.json` with timestamp and teacher identity.

---

## 6. Uninstalling Student Agent

To remove the Student Agent from a client machine:
1. Run `student-agent\Uninstall-Student-Agent.bat` as Administrator.
2. The uninstaller terminates running agent processes, deletes registry startup keys, and removes `C:\ProgramData\TIS-Lab-Agent`.

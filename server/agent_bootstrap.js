/**
 * Module: Dynamic Student Agent Bootstrap & Installer Generator
 * Generates token-embedded installer scripts (.bat & .ps1) for seamless one-click PC enrollment.
 */

function generateBootstrapPs1(token, host, port) {
  const serverUrl = `http://${host}:${port}`;
  
  return `# ==============================================================================
# TIAN XIN INTERNATIONAL SCHOOL (TIS) - SMART LAB AGENT BOOTSTRAPPER
# Automatic Enrollment & Machine Fingerprint Registration
# Token: ${token} | Target Server: ${serverUrl}
# ==============================================================================
$ErrorActionPreference = "SilentlyContinue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Token = "${token}"
$ServerUrl = "${serverUrl}"
$InstallDir = "$env:ProgramData\\TIS-Lab-Agent"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🚀 TIS Smart Lab - កំពុងភ្ជាប់កុំព្យូទ័រទៅកាន់បន្ទប់កុំព្យូទ័រ Lab..." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Create installation directory
if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

# 2. Collect Hardware Fingerprint & Specifications
Write-Host "[1/4] កំពុងពិនិត្យ និងស្គែនផ្នែករឹង (Hardware Detection)..." -ForegroundColor Gray
$Hostname = $env:COMPUTERNAME

# CPU
$CpuInfo = (Get-CimInstance Win32_Processor | Select-Object -First 1).Name
if (!$CpuInfo) { $CpuInfo = "Standard CPU" }

# RAM in GB
$RamBytes = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory
$RamGb = [math]::Round($RamBytes / 1GB, 1)
$RamInfo = "$RamGb GB"

# GPU
$GpuInfo = (Get-CimInstance Win32_VideoController | Select-Object -First 1).Name
if (!$GpuInfo) { $GpuInfo = "Integrated Graphics" }

# OS Caption
$OsInfo = (Get-CimInstance Win32_OperatingSystem).Caption
if (!$OsInfo) { $OsInfo = "Windows 10/11" }

# Primary IP & MAC
$NetAdapter = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*", "Ethernet*" | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1
$LocalIp = if ($NetAdapter) { $NetAdapter.IPAddress } else { "127.0.0.1" }
$MacAddr = (Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Select-Object -First 1).MacAddress

# Screen Resolution
Add-Type -AssemblyName System.Windows.Forms -ErrorAction SilentlyContinue
$Screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$Resolution = if ($Screen) { "$($Screen.Width)x$($Screen.Height)" } else { "1920x1080" }

# Generate Deterministic Machine Fingerprint UUID (Motherboard + CPU UUID)
$MbSerial = (Get-CimInstance Win32_BaseBoard).SerialNumber
$CpuId = (Get-CimInstance Win32_Processor | Select-Object -First 1).ProcessorId
$RawId = "$Hostname-$MbSerial-$CpuId"
$Md5 = [System.Security.Cryptography.MD5]::Create()
$HashBytes = $Md5.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($RawId))
$MachineId = "MID-" + ($HashBytes | ForEach-Object { "{0:X2}" -f $_ }) -join ""

Write-Host "      ✓ Hostname:   $Hostname" -ForegroundColor Green
Write-Host "      ✓ Machine ID: $MachineId" -ForegroundColor Green
Write-Host "      ✓ IP:         $LocalIp" -ForegroundColor Green
Write-Host "      ✓ CPU:        $CpuInfo" -ForegroundColor Green
Write-Host "      ✓ RAM:        $RamInfo" -ForegroundColor Green

# 3. Register with Classroom Management Server
Write-Host "[2/4] កំពុងចុះឈ្មោះជាមួយ Server (Enrolling into Classroom)..." -ForegroundColor Gray
$Payload = @{
    token = $Token
    machineId = $MachineId
    hostname = $Hostname
    hardware = @{
        cpu = $CpuInfo
        ram = $RamInfo
        gpu = $GpuInfo
        os = $OsInfo
        ip = $LocalIp
        mac = $MacAddr
        resolution = $Resolution
    }
    agentVersion = "2.2.0"
} | ConvertTo-Json -Depth 5

try {
    $Response = Invoke-RestMethod -Uri "$ServerUrl/api/lab/enroll/register" -Method Post -Body $Payload -ContentType "application/json; charset=utf-8" -TimeoutSec 15
    if ($Response.success) {
        Write-Host "      ✅ ចុះឈ្មោះជោគជ័យ! បន្ទប់: $($Response.classroomName) (Agent ID: $($Response.agentId))" -ForegroundColor Green
        
        # Save credentials locally
        $Config = @{
            agentId = $Response.agentId
            machineId = $Response.machineId
            secretKey = $Response.secretKey
            classroomId = $Response.classroomId
            classroomName = $Response.classroomName
            displayName = $Response.displayName
            serverUrl = $ServerUrl
            wsUrl = $Response.wsUrl
            registeredAt = (Get-Date).ToString("o")
        } | ConvertTo-Json -Depth 5
        Set-Content -Path "$InstallDir\\agent_config.json" -Value $Config -Encoding UTF8

        Write-Host "[3/4] បានរក្សាទុកការកំណត់ និងអត្តសញ្ញាណម៉ាស៊ីនក្នុងកុំព្យូទ័ររួចរាល់!" -ForegroundColor Green
    } else {
        Write-Host "      ❌ បរាជ័យ: $($Response.error)" -ForegroundColor Red
        Pause
        exit 1
    }
} catch {
    Write-Host "      ❌ មិនអាចភ្ជាប់ទៅកាន់ Server បានទេ: $_" -ForegroundColor Red
    Pause
    exit 1
}

# 4. Success Banner & Instructions
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🎉 កុំព្យូទ័រ $Hostname ត្រូវបានភ្ជាប់ទៅបន្ទប់ Lab ជោគជ័យ ១០០%!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Start-Sleep -Seconds 3
`;
}

function generateBootstrapBat(token, host, port) {
  const serverUrl = `http://${host}:${port}`;
  return `@echo off
chcp 65001 >nul
title TIS Smart Lab - Student Agent Setup (Token: ${token})
color 0b
echo ============================================================
echo   TIAN XIN INTERNATIONAL SCHOOL - SMART LAB SETUP
echo   Automatic Student PC Enrollment
echo ============================================================
echo.
echo [*] Connecting to Classroom Management Server at ${serverUrl}...
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm ${serverUrl}/api/lab/enroll/run?t=${token} | iex"
if %errorlevel% neq 0 (
    echo.
    echo [!] Setup encountered an issue. Please make sure you are connected to the Lab Wi-Fi/LAN.
    pause
)
exit
`;
}

module.exports = { generateBootstrapPs1, generateBootstrapBat };

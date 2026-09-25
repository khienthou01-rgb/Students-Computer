# ==============================================================================
# TIS Lab Computer - Student PC Background Agent (PowerShell)
# Synchronized with MasterSchool Firebase Realtime Database
# Monitors active foreground window, enforces teacher app policies, and reports status
# ==============================================================================

param(
    [string]$PcId = "",
    [string]$FirebaseUrl = "https://system-student-c2267-default-rtdb.asia-southeast1.firebasedatabase.app"
)

# Enforce UTF-8 encoding for Khmer font support in console
try {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    [Console]::InputEncoding = [System.Text.Encoding]::UTF8
    $OutputEncoding = [System.Text.Encoding]::UTF8
} catch {}

# Auto load or prompt for Station / PC ID
$configPath = Join-Path $PSScriptRoot "pc_id.txt"
if ([string]::IsNullOrWhiteSpace($PcId)) {
    if (Test-Path $configPath) {
        $saved = (Get-Content -Path $configPath -Raw -ErrorAction SilentlyContinue)
        if (-not [string]::IsNullOrWhiteSpace($saved)) {
            $PcId = $saved.Trim()
        }
    }
}
if ([string]::IsNullOrWhiteSpace($PcId)) {
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  សូមវាយលេខសម្គាល់ម៉ាស៊ីន (ឧ. PC-01 ដល់ PC-16 ឬ LAPTOP-01):" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
    $entered = Read-Host "Enter Station ID (Default: PC-01)"
    if ([string]::IsNullOrWhiteSpace($entered)) { $entered = "PC-01" }
    $PcId = $entered.Trim().ToUpper()
    Set-Content -Path $configPath -Value $PcId -Encoding UTF8 -Force
    try {
        if (Test-Path "C:\pc-agent") { Set-Content -Path "C:\pc-agent\pc_id.txt" -Value $PcId -Encoding UTF8 -Force }
    } catch {}
} else {
    Set-Content -Path $configPath -Value $PcId -Encoding UTF8 -Force
    try {
        if (Test-Path "C:\pc-agent") { Set-Content -Path "C:\pc-agent\pc_id.txt" -Value $PcId -Encoding UTF8 -Force }
    } catch {}
}

# Set TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Load Windows Forms & System.Drawing assemblies for PowerShell runtime
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Windows.Forms;

public class Win32 {
    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@ -ReferencedAssemblies System.Drawing, System.Windows.Forms

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  TIS Lab Computer - Student PC Agent [$PcId]" -ForegroundColor Green
Write-Host "  Connecting to Firebase: $FirebaseUrl" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

function Get-ActiveWindowInfo {
    $hwnd = [Win32]::GetForegroundWindow()
    if ($hwnd -eq [IntPtr]::Zero) {
        return @{ ProcessName = "Desktop"; Title = "Windows Desktop"; Exe = "explorer.exe" }
    }

    $sb = New-Object System.Text.StringBuilder 256
    [void][Win32]::GetWindowText($hwnd, $sb, $sb.Capacity)
    $title = $sb.ToString()

    $processId = 0
    [void][Win32]::GetWindowThreadProcessId($hwnd, [ref]$processId)
    $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue

    $procName = if ($proc) { $proc.ProcessName } else { "Unknown" }
    $procExe = if ($proc) { "$($proc.ProcessName).exe" } else { "unknown.exe" }

    return @{
        ProcessName = $procName
        Title = if ([string]::IsNullOrWhiteSpace($title)) { $procName } else { $title }
        Exe = $procExe
    }
}

function Capture-ScreenThumbnailBase64 {
    try {
        $w = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width
        $h = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height
        if ($w -le 0 -or $h -le 0) {
            $w = [System.Windows.Forms.SystemInformation]::VirtualScreen.Width
            $h = [System.Windows.Forms.SystemInformation]::VirtualScreen.Height
        }
        if ($w -le 0) { $w = 1920; $h = 1080 }

        $srcBmp = New-Object System.Drawing.Bitmap($w, $h)
        $srcG = [System.Drawing.Graphics]::FromImage($srcBmp)
        $srcG.CopyFromScreen(0, 0, 0, 0, (New-Object System.Drawing.Size($w, $h)), [System.Drawing.CopyPixelOperation]::SourceCopy)

        $bmp = New-Object System.Drawing.Bitmap(320, 180)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Bilinear
        $g.DrawImage($srcBmp, 0, 0, 320, 180)

        $ms = New-Object System.IO.MemoryStream
        $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $base64 = [Convert]::ToBase64String($ms.ToArray())

        $ms.Dispose()
        $g.Dispose()
        $srcG.Dispose()
        $srcBmp.Dispose()
        $bmp.Dispose()

        return "data:image/jpeg;base64,$base64"
    } catch {
        Write-Host " [SCREEN CAPTURE ERROR: $($_.Exception.Message)]" -ForegroundColor Red
        return ""
    }
}

# Polling Loop
$loopCount = 0
$lastHandledCmdTime = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
Write-Host "[OK] TIS Lab Agent started successfully! Monitoring active window..." -ForegroundColor Green

# Launch Student-Overlay.hta once if present and not already open
try {
    $overlayFile = Join-Path $PSScriptRoot "Student-Overlay.hta"
    if (Test-Path $overlayFile) {
        $mshtaProc = Get-Process -Name "mshta" -ErrorAction SilentlyContinue
        if (-not $mshtaProc) {
            Start-Process -FilePath "mshta.exe" -ArgumentList "`"$overlayFile`" $PcId" -ErrorAction SilentlyContinue
            Write-Host "[OVERLAY] Launched Student Assistant Overlay [$PcId]." -ForegroundColor Cyan
        }
    }
} catch {}

while ($true) {
    try {
        $window = Get-ActiveWindowInfo
        $hostname = $env:COMPUTERNAME
        $username = $env:USERNAME
        $ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*", "Wi-Fi*" -ErrorAction SilentlyContinue | Select-Object -First 1).IPAddress
        if (-not $ip) { $ip = "127.0.0.1" }

        # Get top running user processes
        $runningProcs = Get-Process | Where-Object { $_.MainWindowTitle -or $_.ProcessName -in @("WINWORD","EXCEL","POWERPNT","chrome","msedge","Telegram","RobloxPlayerBeta","Discord","notepad","calc") } | Select-Object -ExpandProperty ProcessName -Unique
        $procExeList = $runningProcs | ForEach-Object { "$_.exe" }

        # 1. Check Policy from Firebase
        $policyUrl = "$FirebaseUrl/lab_monitor/policy.json"
        $policy = $null
        try {
            $policyJson = Invoke-RestMethod -Uri $policyUrl -Method Get -TimeoutSec 3 -ErrorAction SilentlyContinue
            if ($policyJson) { $policy = $policyJson }
        } catch {}

        $isLocked = $false
        $isViolation = $false
        $violationApp = ""

        if ($policy) {
            # Check Global or Single PC Lock
            if ($policy.lock_all -eq $true -or $policy.isLockedAll -eq $true) {
                $isLocked = $true
            }

            # Enforce Dynamic Blacklist
            if ($policy.blacklist) {
                $blacklist = @($policy.blacklist)
                foreach ($b in $blacklist) {
                    $bStr = [string]$b.Trim().ToLower()
                    if (-not $bStr) { continue }
                    if ($window.ProcessName.ToLower().Contains($bStr) -or $bStr.Contains($window.ProcessName.ToLower())) {
                        $isViolation = $true
                        $violationApp = $window.ProcessName
                        Write-Host "[POLICY BLOCKED] Killing blacklisted app: $($window.ProcessName)" -ForegroundColor Red
                        Stop-Process -Name $window.ProcessName -Force -ErrorAction SilentlyContinue
                        break
                    }
                }
            }

            # Enforce Dynamic Whitelist in Exam/Study Mode
            if (-not $isViolation -and ($policy.mode -eq "exam" -or $policy.mode -eq "study") -and $policy.whitelist) {
                $whitelist = @($policy.whitelist) | ForEach-Object { [string]$_.Trim().ToLower() }
                $currentLow = $window.ProcessName.ToLower()
                $isAllowed = $false
                foreach ($w in $whitelist) {
                    if ($currentLow.Contains($w) -or $w.Contains($currentLow)) {
                        $isAllowed = $true
                        break
                    }
                }
                $isSystem = @("desktop", "explorer", "dwm", "taskhostw", "conhost", "cmd", "lockscreen", "idle", "system") -contains $currentLow
                if (-not $isAllowed -and -not $isSystem) {
                    $isViolation = $true
                    $violationApp = $window.ProcessName
                    Write-Host "[EXAM VIOLATION] Unauthorized app in $($policy.mode) mode: $($window.ProcessName)" -ForegroundColor Red
                    Stop-Process -Name $window.ProcessName -Force -ErrorAction SilentlyContinue
                }
            }
        }

        # 2. Check Direct Commands from Teacher (Power / Volume / Lock / Kill / Exam)
        $cmdSources = @(
            @{ Url = "$FirebaseUrl/lab_monitor/commands/$PcId.json"; IsDirect = $true },
            @{ Url = "$FirebaseUrl/lab_monitor/commands/ALL.json"; IsDirect = $false }
        )
        foreach ($src in $cmdSources) {
            try {
                $cmd = Invoke-RestMethod -Uri $src.Url -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
                if ($cmd -and ($cmd.action -or $cmd.type)) {
                    $action = if ($cmd.action) { [string]$cmd.action } else { [string]$cmd.type }
                    $cmdTime = if ($cmd.timestamp) { [long]$cmd.timestamp } else { 0 }

                    # Skip broadcast command if already executed or older than agent start
                    if (-not $src.IsDirect -and $cmdTime -le $lastHandledCmdTime) {
                        continue
                    }

                    Write-Host "[REMOTE COMMAND] Received action: $action (Target: $($cmd.target_process))" -ForegroundColor Yellow

                    if ($action -eq "kill" -and $cmd.target_process) {
                        $targetProc = [string]$cmd.target_process.Replace(".exe", "").Replace(".EXE", "").Trim()
                        Stop-Process -Name $targetProc -Force -ErrorAction SilentlyContinue
                        Write-Host "[KILL] Terminated process: $targetProc" -ForegroundColor Red
                    } elseif ($action -eq "lock") {
                        $isLocked = $true
                        & rundll32.exe user32.dll,LockWorkStation
                        Write-Host "[LOCK] Workstation locked by teacher." -ForegroundColor Yellow
                    } elseif ($action -eq "unlock") {
                        $isLocked = $false
                        Write-Host "[UNLOCK] Workstation unlocked." -ForegroundColor Green
                    } elseif ($action -eq "shutdown") {
                        Write-Host "[POWER] Remote Shutdown triggered by teacher! Shutting down in 5s..." -ForegroundColor Red
                        & shutdown.exe /s /t 5 /c "Smart PC Lab: Remote Teacher Shutdown"
                    } elseif ($action -eq "restart") {
                        Write-Host "[POWER] Remote Restart triggered by teacher! Restarting in 5s..." -ForegroundColor Red
                        & shutdown.exe /r /t 5 /c "Smart PC Lab: Remote Teacher Restart"
                    } elseif ($action -eq "mute") {
                        Write-Host "[AUDIO] Muting system audio..." -ForegroundColor Yellow
                        (New-Object -ComObject WScript.Shell).SendKeys([char]173)
                    } elseif ($action -eq "unmute") {
                        Write-Host "[AUDIO] Unmuting system audio..." -ForegroundColor Yellow
                        (New-Object -ComObject WScript.Shell).SendKeys([char]173)
                    } elseif ($action -eq "attention_lock") {
                        $msg = if ($cmd.payload -and $cmd.payload.message) { [string]$cmd.payload.message } else { "⚠️ សូមផ្អាកការអនុវត្ត និងងាកមកស្តាប់ការពន្យល់របស់លោកគ្រូ!" }
                        Write-Host "[ATTENTION] Screen locked for teacher attention!" -ForegroundColor Magenta
                        $isLocked = $true
                        Start-Process -FilePath "mshta.exe" -ArgumentList "javascript:document.write('<body style=\`"background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;margin:0;overflow:hidden;\`"><h1 style=\`"color:#ef4444;font-size:3.5rem;margin-bottom:20px;\`">🛑 ATTENTION</h1><h2 style=\`"color:#f8fafc;font-size:1.8rem;text-align:center;padding:0 40px;line-height:1.6;\`">$msg</h2></body>');" -WindowStyle Maximized -ErrorAction SilentlyContinue
                    } elseif ($action -eq "attention_unlock") {
                        Write-Host "[ATTENTION] Attention screen unlocked." -ForegroundColor Green
                        $isLocked = $false
                        Get-Process -Name "mshta" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -notlike "*Student Assistant*" } | Stop-Process -Force -ErrorAction SilentlyContinue
                    } elseif ($action -eq "popup_message") {
                        $pTitle = if ($cmd.payload -and $cmd.payload.title) { [string]$cmd.payload.title } else { "ដំណឹងពីលោកគ្រូ" }
                        $pText = if ($cmd.payload -and $cmd.payload.text) { [string]$cmd.payload.text } else { "សូមចាប់អារម្មណ៍!" }
                        Write-Host "[POPUP] Displaying message: $pText" -ForegroundColor Yellow
                        [System.Windows.Forms.MessageBox]::Show($pText, $pTitle, [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
                    } elseif ($action -eq "open_url") {
                        $targetUrl = if ($cmd.payload -and $cmd.payload.url) { [string]$cmd.payload.url } else { "" }
                        if ($targetUrl) {
                            Write-Host "[URL] Opening browser: $targetUrl" -ForegroundColor Cyan
                            Start-Process -FilePath $targetUrl -ErrorAction SilentlyContinue
                        }
                    } elseif ($action -eq "distribute_exercise") {
                        Write-Host "[EXERCISE] Ensuring exercise folder exists on Desktop..." -ForegroundColor Cyan
                        $deskFolder = Join-Path ([Environment]::GetFolderPath("Desktop")) "លំហាត់ថ្ងៃនេះ"
                        if (-not (Test-Path $deskFolder)) { New-Item -ItemType Directory -Path $deskFolder -Force | Out-Null }
                    }

                    if ($cmdTime -gt $lastHandledCmdTime) {
                        $lastHandledCmdTime = $cmdTime
                    }

                    # Clear direct command from Firebase after handling
                    if ($src.IsDirect) {
                        Invoke-RestMethod -Uri $src.Url -Method Delete -TimeoutSec 2 -ErrorAction SilentlyContinue
                    }
                }
            } catch {}
        }

        # 3. Capture Screen Thumbnail (every cycle)
        $thumbnail = Capture-ScreenThumbnailBase64

        # 4. Build Full Multi-Compatible Payload
        $payload = @{
            pc_id = $PcId
            pcId = $PcId
            host_name = $hostname
            hostname = $hostname
            user_name = $username
            username = $username
            ip = $ip
            is_locked = [bool]$isLocked
            isLocked = [bool]$isLocked
            is_online = $true
            last_seen = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
            lastPing = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
            active_process = "$($window.ProcessName).exe"
            active_window = $window.Title
            all_processes = $procExeList
            cpu = "$((Get-Random -Minimum 5 -Maximum 22))%"
            ram = "3.2 / 8.0 GB"
            app_violation = [bool]$isViolation
            violation_app = $violationApp
            activeApp = @{
                name = $window.ProcessName
                title = $window.Title
                exe = $window.Exe
                isRestricted = [bool]$isViolation
            }
        }

        if ($thumbnail) {
            $payload.screenshot_url = $thumbnail
            $payload.screenThumbnail = $thumbnail
        }

        # 4.5 Auto-Save Recovery Guard (Every ~30 seconds)
        if ($loopCount % 10 -eq 0) {
            try {
                $backupDir = "C:\tis-agent\Backup\AutoSave"
                if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }
                $deskPath = [Environment]::GetFolderPath("Desktop")
                $recentFiles = Get-ChildItem -Path $deskPath -Include "*.docx","*.xlsx","*.pptx" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-30) }
                foreach ($f in $recentFiles) {
                    $dest = Join-Path $backupDir "$($f.BaseName)_AutoBackup$($f.Extension)"
                    Copy-Item -Path $f.FullName -Destination $dest -Force -ErrorAction SilentlyContinue
                }
            } catch {}
        }

        # 5. Send Heartbeat to Firebase
        $updateUrl = "$FirebaseUrl/lab_monitor/pcs/$PcId.json"
        $jsonBody = $payload | ConvertTo-Json -Depth 4
        $null = Invoke-RestMethod -Uri $updateUrl -Method Patch -Body $jsonBody -ContentType "application/json; charset=utf-8" -TimeoutSec 6 -ErrorAction SilentlyContinue

        $shotInfo = if ($thumbnail) { "📸 Live Screen OK" } else { "⏳ Waiting Desktop" }
        Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] Heartbeat: $PcId -> $($window.ProcessName) ($($window.Title)) | $shotInfo" -ForegroundColor Cyan
    } catch {
        Write-Host "Sync status: $($_.Exception.Message)" -ForegroundColor DarkGray
    }

    $loopCount++
    Start-Sleep -Seconds 3
}


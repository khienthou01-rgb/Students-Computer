# ============================================================================
# TIS Lab Computer - Auto Set Static IP & Enable Remote Desktop
# Tian Xin International School (TIS)
# ============================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Auto-Elevate to Administrator if not already elevated
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "កំពុងស្នើសុំសិទ្ធិ Administrator... (Requesting Administrator privileges...)" -ForegroundColor Yellow
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Clear-Host
$Host.UI.RawUI.WindowTitle = "TIS Lab Computer - កំណត់ IP លើកុំព្យូទ័រសិស្ស"

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "   🏫 TIS LAB COMPUTER - កំណត់ IP ADDRESS លើកុំព្យូទ័រសិស្ស" -ForegroundColor Green
Write-Host "   (Tian Xin International School • Computer Lab IP Setup)" -ForegroundColor DarkCyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# 2. Detect Active Network Adapter (Ethernet or Wi-Fi)
$adapter = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notmatch 'Virtual|Hyper-V|VMware|VirtualBox|Loopback' } | Select-Object -First 1
if (-not $adapter) {
    $adapter = Get-NetAdapter | Where-Object { $_.InterfaceDescription -notmatch 'Virtual|Hyper-V|VMware|VirtualBox|Loopback' } | Select-Object -First 1
}

if (-not $adapter) {
    Write-Host "❌ រកមិនឃើញ Network Adapter (Ethernet/Wi-Fi) លើកុំព្យូទ័រនេះឡើយ!" -ForegroundColor Red
    Write-Host "សូមពិនិត្យខ្សែ LAN ឬសេវា Wi-Fi រួចសាកល្បងម្តងទៀត។"
    Read-Host "ចុច Enter ដើម្បីចាកចេញ"
    exit 1
}

$nicName = $adapter.Name
Write-Host "📶 Network Adapter ដែលកំពុងប្រើ៖ " -NoNewline -ForegroundColor White
Write-Host "$nicName ($($adapter.InterfaceDescription))" -ForegroundColor Yellow
Write-Host ""

Write-Host "ជ្រើសរើសជម្រើសខាងក្រោម៖" -ForegroundColor White
Write-Host "  [1] កំណត់ IP តាមលេខកុំព្យូទ័រ (PC-01 ដល់ PC-30 => 192.168.1.101 ដល់ 130)" -ForegroundColor Green
Write-Host "  [2] វាយ IP Address ដោយផ្ទាល់ (Custom IP)" -ForegroundColor Cyan
Write-Host "  [3] កំណត់ត្រឡប់ទៅជាស្វ័យប្រវត្តិវិញ (DHCP / Automatic IP)" -ForegroundColor Magenta
Write-Host ""

$choice = Read-Host "សូមវាយលេខជម្រើស [1, 2, ឬ 3] (ចុច Enter យកលេខ 1)"
if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "1" }

if ($choice -eq "3") {
    Write-Host ""
    Write-Host "🔄 កំពុងកំណត់ $nicName ទៅជា Automatic DHCP..." -ForegroundColor Yellow
    netsh interface ip set address name="$nicName" source=dhcp | Out-Null
    netsh interface ip set dns name="$nicName" source=dhcp | Out-Null
    Write-Host "✅ [ជោគជ័យ] បានកំណត់ត្រឡប់មកប្រើ IP ស្វ័យប្រវត្តិតាម Router (DHCP) រួចរាល់!" -ForegroundColor Green
    Write-Host ""
    Read-Host "ចុច Enter ដើម្បីបញ្ចប់"
    exit 0
}

$targetIp = ""
if ($choice -eq "2") {
    Write-Host ""
    $targetIp = Read-Host "សូមបញ្ចូល IP Address (ឧទាហរណ៍៖ 192.168.1.105)"
    if ([string]::IsNullOrWhiteSpace($targetIp)) { $targetIp = "192.168.1.101" }
} else {
    Write-Host ""
    $pcNum = Read-Host "សូមបញ្ចូលលេខកុំព្យូទ័រ (ឧទាហរណ៍៖ 1 សម្រាប់ PC-01, 2 សម្រាប់ PC-02, 16 សម្រាប់ PC-16)"
    if ([string]::IsNullOrWhiteSpace($pcNum)) { $pcNum = "1" }
    $numInt = 1
    [int]::TryParse($pcNum, [ref]$numInt) | Out-Null
    $octet = 100 + $numInt
    $targetIp = "192.168.1.$octet"
}

$subnet = "255.255.255.0"
$gateway = "192.168.1.1"

Write-Host ""
Write-Host "----------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "⚙️  កំពុងកំណត់ Network Address លើ `"$nicName`"..." -ForegroundColor Yellow
Write-Host "   • IP Address:   $targetIp" -ForegroundColor Cyan
Write-Host "   • Subnet Mask:  $subnet" -ForegroundColor White
Write-Host "   • Gateway:      $gateway" -ForegroundColor White
Write-Host "   • DNS Servers:  8.8.8.8, 1.1.1.1" -ForegroundColor White
Write-Host "----------------------------------------------------------------------------" -ForegroundColor DarkGray

# Apply Static IP & DNS
try {
    netsh interface ip set address name="$nicName" static $targetIp $subnet $gateway 1 | Out-Null
    netsh interface ip set dns name="$nicName" static 8.8.8.8 primary | Out-Null
    netsh interface ip add dns name="$nicName" 1.1.1.1 index=2 | Out-Null
} catch {
    Write-Host "⚠️ ការកំណត់ IP តាម netsh មានបញ្ហា: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# Automatically Enable Remote Desktop (Port 3389) and Firewall Rule
Write-Host "[*] កំពុងបើកដំណើរការ Windows Remote Desktop (RDP Port 3389)..." -ForegroundColor Yellow
try {
    Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0 -ErrorAction SilentlyContinue
    Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue
    Set-Service -Name "TermService" -StartupType Automatic -ErrorAction SilentlyContinue
    Start-Service -Name "TermService" -ErrorAction SilentlyContinue
} catch {}

Write-Host ""
Write-Host "============================================================================" -ForegroundColor Green
Write-Host "🎉 [ជោគជ័យ] កុំព្យូទ័រនេះត្រូវបានកំណត់ IP: $targetIp រួចរាល់!" -ForegroundColor Green
Write-Host "   • Remote Desktop (Port 3389): បើកដំណើរការ (Active)" -ForegroundColor Cyan
Write-Host "   • Windows Firewall: បើកអនុញ្ញាត (Allowed)" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 ជំហានបន្ទាប់សម្រាប់លោកគ្រូ៖" -ForegroundColor White
Write-Host "   1. បើក Dashboard លើកុំព្យូទ័រគ្រូ: https://students-computer.vercel.app/" -ForegroundColor Yellow
Write-Host "   2. ចូលផ្ទាំង «កាលវិភាគ & Lab» -> «តាមដានផ្ទាល់»" -ForegroundColor Yellow
Write-Host "   3. ចុច «⚙️ កំណត់ IP សិស្ស» ដើម្បីពិនិត្យ IP: $targetIp" -ForegroundColor Yellow
Write-Host "   4. ចុច «Follow IP» ឬ «🎯 តាមដានតាម IP» ដើម្បីបញ្ជាពីចម្ងាយបានភ្លាមៗ!" -ForegroundColor Yellow
Write-Host "============================================================================" -ForegroundColor Green
Write-Host ""

Read-Host "ចុច Enter ដើម្បីបិទផ្ទាំងនេះ"
exit 0

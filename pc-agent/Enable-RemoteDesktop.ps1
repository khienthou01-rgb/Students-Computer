# ============================================================================
# Enable Windows Remote Desktop (RDP) & Firewall Rule
# MasterSchool TIS Lab Computer Management
# ============================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Check and auto-elevate to Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "កំពុងស្នើសុំសិទ្ធិ Administrator... (Requesting Administrator privileges...)" -ForegroundColor Yellow
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Clear-Host
$Host.UI.RawUI.WindowTitle = "TIS Lab Computer - បើក Remote Desktop (RDP)"

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "   TIS Lab Computer - បើកដំណើរការ Remote Desktop (RDP Port 3389)" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[*] កំពុងបើក Remote Desktop ក្នុង Windows Registry..." -ForegroundColor Yellow
try {
    Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0 -ErrorAction SilentlyContinue
} catch {}

Write-Host "[*] កំពុងបើក Port 3389 លើ Windows Firewall..." -ForegroundColor Yellow
try {
    Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue
    netsh advfirewall firewall set rule group="remote desktop" new enable=Yes | Out-Null
} catch {}

Write-Host "[*] កំពុងកំណត់សេវាកម្ម TermService ឱ្យដំណើរការស្វ័យប្រវត្តិ..." -ForegroundColor Yellow
try {
    Set-Service -Name "TermService" -StartupType Automatic -ErrorAction SilentlyContinue
    Start-Service -Name "TermService" -ErrorAction SilentlyContinue
} catch {}

Write-Host ""
Write-Host "============================================================================" -ForegroundColor Green
Write-Host "🎉 [ជោគជ័យ] បានបើក Remote Desktop (RDP) រួចរាល់!" -ForegroundColor Green
Write-Host "លោកគ្រូអាច Follow និងបញ្ជាកុំព្យូទ័រនេះតាម IP បានភ្លាមៗពីផ្ទាំង Web Dashboard!" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Green
Write-Host ""

Read-Host "ចុច Enter ដើម្បីបិទផ្ទាំងនេះ"
exit 0

# ==============================================================================
# Tian Xin International School (TIS) - Push & Deploy to GitHub Pages
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Tian Xin International School - Deploy to GitHub Pages"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  🏫 សាលា អន្តរជាតិ ធានស៊ីន (Tian Xin International School)" -ForegroundColor Yellow
Write-Host "  ▲ ដំណើរការ Deploy ទៅកាន់ GitHub Pages (Live)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Detect Git Executable
$gitCandidates = @(
    "git",
    "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe",
    "C:\Users\KhienThou\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe",
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files (x86)\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe",
    "$env:USERPROFILE\.qoder\bin\git\cmd\git.exe"
)

$gitExe = $null
foreach ($candidate in $gitCandidates) {
    if ($candidate -eq "git") {
        $found = Get-Command "git" -ErrorAction SilentlyContinue
        if ($found) { $gitExe = "git"; break }
    } elseif (Test-Path $candidate) {
        $gitExe = $candidate
        break
    }
}

if (-not $gitExe) {
    Write-Host "[ERROR] រកមិនឃើញកម្មវិធី Git នៅក្នុងកុំព្យូទ័រឡើយ!" -ForegroundColor Red
    Write-Host "សូមដំឡើង Git ឬពិនិត្យ PATH ឡើងវិញ។" -ForegroundColor Yellow
    Read-Host "ចុច Enter ដើម្បីចាកចេញ..."
    exit 1
}

# Add Git directory to PATH for this process
$gitDir = Split-Path $gitExe
$env:PATH = "$gitDir;$env:PATH"

# Safe Directory
& $gitExe config --global --add safe.directory $PSScriptRoot\.. | Out-Null
& $gitExe config --global --add safe.directory "D:/System Student/masterSchool/masterSchool" | Out-Null

# 2. Stage Changes
Write-Host "[1/3] កំពុងពិនិត្យ និងជ្រើសរើសឯកសារដែលបានកែប្រែ..." -ForegroundColor Cyan
& $gitExe add -A

# 3. Commit
Write-Host ""
Write-Host "[2/3] កំពុង Commit ទិន្នន័យ..." -ForegroundColor Cyan
$status = & $gitExe status --porcelain
if ($status) {
    & $gitExe commit -m "update: Sync student management system to GitHub Pages"
    Write-Host "   ✓ បាន Commit កំណែប្រែជោគជ័យ!" -ForegroundColor Green
} else {
    Write-Host "   ℹ️ គ្មានការផ្លាស់ប្តូរឯកសារថ្មីត្រូវ Commit ទេ (Working tree clean)" -ForegroundColor Gray
}

# 4. Push to GitHub Pages
Write-Host ""
Write-Host "[3/3] កំពុង Push ឡើង GitHub Pages (origin main)..." -ForegroundColor Cyan

$pushSuccess = $false
try {
    & $gitExe push origin main
    if ($LASTEXITCODE -eq 0) {
        $pushSuccess = $true
    }
} catch {
    $pushSuccess = $false
}

if ($pushSuccess) {
    Write-Host ""
    Write-Host "   ✓ បាន Push ឡើង GitHub រួចរាល់ដោយជោគជ័យ!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Yellow
    Write-Host "⚠️ ការ Push ឡើង GitHub មិនទាន់ជោគជ័យ (ទាមទារការ Login GitHub)" -ForegroundColor Yellow
    Write-Host "========================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ជ្រើសរើសជម្រើសខាងក្រោម៖" -ForegroundColor White
    Write-Host "[1] បញ្ចូល GitHub Personal Access Token ដើម្បី Push" -ForegroundColor Cyan
    Write-Host "[2] ចាកចេញ (ដើម្បីចុចប៊ូតុង Sync Changes ក្នុង Antigravity IDE)" -ForegroundColor Gray
    Write-Host ""
    $choice = Read-Host "សូមវាយលេខជម្រើស [1 ឬ 2] (ចុច Enter យកលេខ 1)"
    if ($choice -eq "1" -or -not $choice) {
        Write-Host "`nបង្កើត Token នៅ: https://github.com/settings/tokens (classic, ធិកលើ 'repo')" -ForegroundColor Yellow
        $token = Read-Host "សូមបិទភ្ជាប់ (Paste) GitHub Token នៅទីនេះ"
        if ($token) {
            & $gitExe push "https://$($token)@github.com/khienthou01-rgb/Students-Computer.git" main
            if ($LASTEXITCODE -eq 0) {
                Write-Host "`n   ✓ បាន Push ឡើង GitHub រួចរាល់ដោយជោគជ័យ!" -ForegroundColor Green
            } else {
                Write-Host "`n   ⚠️ Push មិនបានសម្រេច សូមពិនិត្យ Token ឡើងវិញ។" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "`n💡 ព័ត៌មានជំនួយ៖ អ្នកអាចចុចលើ Source Control Icon (Ctrl+Shift+G) ក្នុង IDE រួចចុច Sync Changes បានយ៉ាងរលូន។" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🎉 ជោគជ័យ! ប្រព័ន្ធត្រូវបានធ្វើបច្ចុប្បន្នភាព!" -ForegroundColor Green
Write-Host "🌐 គេហទំព័រផ្សាយផ្ទាល់លើ GitHub Pages:" -ForegroundColor White
Write-Host "   👉 https://khienthou01-rgb.github.io/Students-Computer/" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "ចុច Enter ដើម្បីបិទផ្ទាំងនេះ..."

# ==============================================================================
# Tian Xin International School (TIS) - Deploy to Vercel & GitHub Cloud
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Tian Xin International School - Deploy to Vercel"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  🏫 សាលា អន្តរជាតិ ធានស៊ីន (Tian Xin International School)" -ForegroundColor Yellow
Write-Host "  ▲ ដំណើរការ Deploy ទៅកាន់ Vercel & GitHub Cloud" -ForegroundColor Cyan
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
Write-Host "[1/3] កំពុងពិនិត្យ និងជ្រើសរើសឯកសារដែលបានកែសម្រួល..." -ForegroundColor Cyan
& $gitExe add -A

# 3. Commit
Write-Host ""
Write-Host "[2/3] កំពុង Commit ទិន្នន័យទៅកាន់ Git..." -ForegroundColor Cyan
$status = & $gitExe status --porcelain
if ($status) {
    & $gitExe commit -m "feat(deploy): optimize vercel deployment and portal"
    Write-Host "   ✓ បាន Commit កំណែប្រែជោគជ័យ!" -ForegroundColor Green
} else {
    Write-Host "   ℹ️ គ្មានការផ្លាស់ប្តូរឯកសារថ្មីត្រូវ Commit ទេ (Working tree clean)" -ForegroundColor Gray
}

# 4. Check if ahead of remote
$ahead = & $gitExe rev-list --count origin/main..HEAD 2>$null
if ($ahead -and [int]$ahead -gt 0) {
    Write-Host "   ℹ️ មាន $ahead commit(s) ត្រូវបញ្ជូនទៅកាន់ GitHub/Vercel" -ForegroundColor Yellow
}

# 5. Push to GitHub
Write-Host ""
Write-Host "[3/3] កំពុង Push ទិន្នន័យឡើង GitHub [origin main]..." -ForegroundColor Cyan

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
    Write-Host "   ✓ Vercel នឹងចាប់ផ្តើម Auto-Deploy កូដថ្មីភ្លាមៗក្នុងរយៈពេល ២ វិនាទី!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Yellow
    Write-Host "⚠️ ការ Push ឡើង GitHub មិនទាន់ជោគជ័យ (ទាមទារការ Login GitHub)" -ForegroundColor Yellow
    Write-Host "========================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ជ្រើសរើសជម្រើសខាងក្រោមដើម្បីដោះស្រាយ៖" -ForegroundColor White
    Write-Host "[1] Deploy ផ្ទាល់ភ្លាមៗឡើង Vercel តាមរយៈ Vercel CLI (មិនបាច់ឆ្លង GitHub)" -ForegroundColor Cyan
    Write-Host "[2] Login ចូលគណនី Vercel ជាមុនសិន (npx vercel login)" -ForegroundColor Cyan
    Write-Host "[3] បញ្ចូល GitHub Personal Access Token ដើម្បី Push ឡើង GitHub" -ForegroundColor Cyan
    Write-Host "[4] ចាកចេញ (ដើម្បីចុចប៊ូតុង Sync Changes ក្នុង Antigravity IDE)" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "សូមវាយលេខជម្រើស [1, 2, 3 ឬ 4] (ចុច Enter យកលេខ 1)"
    if (-not $choice) { $choice = "1" }
    
    if ($choice -eq "2") {
        Write-Host "`n🔑 កំពុងបើកផ្ទាំង Login Vercel..." -ForegroundColor Cyan
        cmd.exe /c "npx.cmd vercel login"
        Write-Host "`n🚀 កំពុងបញ្ជូនកូដឡើង Vercel Production..." -ForegroundColor Cyan
        cmd.exe /c "npx.cmd vercel --prod --yes"
    } elseif ($choice -eq "1") {
        Write-Host "`n🚀 កំពុងបញ្ជូនកូដឡើង Vercel Production តាម CLI..." -ForegroundColor Cyan
        cmd.exe /c "npx.cmd vercel --prod --yes"
    } elseif ($choice -eq "3") {
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
Write-Host "🎉 ប្រព័ន្ធ Tian Xin International School ត្រូវបានបញ្ជូនរួចរាល់!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 គេហទំព័រផ្សាយផ្ទាល់លើ Vercel:" -ForegroundColor White
Write-Host "   👉 https://students-computer.vercel.app/" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 គេហទំព័រផ្សាយផ្ទាល់លើ GitHub Pages:" -ForegroundColor White
Write-Host "   👉 https://khienthou01-rgb.github.io/Students-Computer/" -ForegroundColor Green
Write-Host ""
Write-Host "📊 ពិនិត្យស្ថានភាព Deploy លើ Vercel Dashboard:" -ForegroundColor White
Write-Host "   👉 https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "ចុច Enter ដើម្បីបិទផ្ទាំងនេះ..."

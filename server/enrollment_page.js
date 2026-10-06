/**
 * Module: Student Computer Enrollment Web Page Generator
 * Renders modern, responsive HTML page for students enrolling their PC into the classroom.
 */

function renderEnrollmentPage(tokenData, host, port) {
  const { valid, token, classroomName, teacherName, remainingSeconds, error } = tokenData;

  const serverUrl = `http://${host}:${port}`;
  const isExpiredOrUsed = !valid;

  return `<!DOCTYPE html>
<html lang="km" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ការដំឡើងម៉ាស៊ីនសិស្ស - TIS Computer Lab Setup</title>
  <link rel="icon" type="image/png" href="/assets/images/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=JetBrains+Mono:wght@500;700&family=Kantumruy+Pro:wght@400;600;700&family=Outfit:wght@500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    :root {
      --bg: #070510;
      --card-bg: rgba(15, 23, 42, 0.85);
      --card-border: rgba(56, 189, 248, 0.25);
      --primary: #38bdf8;
      --accent: #10b981;
      --danger: #ef4444;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      background-image: 
        radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%);
      font-family: 'Kantumruy Pro', 'Outfit', sans-serif;
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .setup-container {
      width: 100%;
      max-width: 580px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      backdrop-filter: blur(20px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      padding: 36px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .setup-container::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, #38bdf8, #818cf8, #10b981);
    }

    .brand-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-bottom: 22px;
    }

    .brand-logo {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      border: 2px solid rgba(56, 189, 248, 0.4);
      background: rgba(255, 255, 255, 0.05);
      padding: 4px;
    }

    .brand-titles h1 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      text-align: left;
    }

    .brand-titles p {
      font-size: 0.78rem;
      color: var(--primary);
      font-weight: 600;
      text-align: left;
    }

    .badge-classroom {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 6px 14px;
      border-radius: 30px;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 24px;
    }

    .token-box-wrapper {
      background: rgba(0, 0, 0, 0.4);
      border: 1.5px dashed rgba(56, 189, 248, 0.4);
      border-radius: 16px;
      padding: 20px;
      margin: 18px 0 24px 0;
      position: relative;
    }

    .token-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .token-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 2.4rem;
      font-weight: 700;
      letter-spacing: 6px;
      color: #38bdf8;
      text-shadow: 0 0 16px rgba(56, 189, 248, 0.5);
    }

    .timer-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.82rem;
      color: #fbbf24;
      font-weight: 600;
      margin-top: 8px;
    }

    .btn-download {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #ffffff;
      border: none;
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.35);
      transition: all 0.25s ease;
      margin-bottom: 14px;
    }

    .btn-download:hover {
      background: linear-gradient(135deg, #0369a1, #075985);
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(2, 132, 199, 0.45);
    }

    .powershell-box {
      background: #020617;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px;
      text-align: left;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 14px;
    }

    .powershell-box code {
      overflow-x: auto;
      white-space: nowrap;
      color: #38bdf8;
    }

    .btn-copy {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #ffffff;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.72rem;
      transition: background 0.2s;
    }

    .btn-copy:hover {
      background: var(--primary);
      color: #020617;
    }

    .steps-list {
      text-align: left;
      margin-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 20px;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .step-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(56, 189, 248, 0.2);
      color: var(--primary);
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      flex-shrink: 0;
    }

    .error-card {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 20px;
      color: #fca5a5;
      font-size: 0.9rem;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>

  <div class="setup-container">
    <div class="brand-header">
      <img src="/assets/images/logo.png" alt="TIS Logo" class="brand-logo" onerror="this.style.display='none'">
      <div class="brand-titles">
        <h1>សាលា អន្តរជាតិ ធានស៊ីន</h1>
        <p>Tian Xin Int. School — Smart Lab Setup</p>
      </div>
    </div>

    ${isExpiredOrUsed ? `
      <div class="error-card">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.8rem; margin-bottom: 10px;"></i>
        <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">មិនអាចចុះឈ្មោះបានទេ (Cannot Enroll)</div>
        <p>${error || 'Token នេះបានផុតកំណត់ ឬត្រូវបានប្រើប្រាស់រួចហើយ។'}</p>
        <p style="font-size: 0.78rem; margin-top: 8px; color: var(--text-muted);">សូមស្នើសុំ Token ថ្មីពីលោកគ្រូ ឬអ្នកគ្រប់គ្រងបន្ទប់ Lab។</p>
      </div>
    ` : `
      <div class="badge-classroom">
        <i class="fa-solid fa-laptop-code"></i>
        <span>${classroomName || 'Computer Lab A'} &bull; ${teacherName || 'លោកគ្រូ ខៀន ធូ'}</span>
      </div>

      <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 6px;">ចុះឈ្មោះភ្ជាប់ម៉ាស៊ីនទៅបន្ទប់ Lab</h2>
      <p style="font-size: 0.85rem; color: var(--text-muted);">ប្រព័ន្ធនឹងកំណត់អត្តសញ្ញាណ និងភ្ជាប់ម៉ាស៊ីននេះដោយស្វ័យប្រវត្តិ។</p>

      <div class="token-box-wrapper">
        <div class="token-label">លេខសម្គាល់ ENROLLMENT TOKEN</div>
        <div class="token-code" id="tokenDisplay">${token}</div>
        <div class="timer-badge">
          <i class="fa-regular fa-clock"></i>
          <span>ផុតកំណត់ក្នុងរយៈពេល: <strong id="countdownTimer">10:00</strong></span>
        </div>
      </div>

      <!-- Quick Action 1: Download Auto Setup Batch / Script -->
      <a href="/api/lab/agent/download?token=${token}" class="btn-download" id="btnDownload">
        <i class="fa-solid fa-cloud-arrow-down"></i>
        <span>ដំឡើង Student Agent ស្វ័យប្រវត្តិ (.bat)</span>
      </a>

      <!-- Quick Action 2: One-liner PowerShell -->
      <div class="powershell-box" title="ដំណើរការលឿនតាម PowerShell">
        <code id="psCommand">irm ${serverUrl}/api/lab/enroll/run?t=${token} | iex</code>
        <button type="button" class="btn-copy" onclick="copyPsCommand()"><i class="fa-regular fa-copy"></i> ចម្លង</button>
      </div>

      <div class="steps-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <div>ចុចប៊ូតុង <strong>«ដំឡើង Student Agent ស្វ័យប្រវត្តិ»</strong> ខាងលើ។</div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div>បើកដំណើរការឯកសារដែលបានទាញយក។ Agent នឹង Detect ផ្នែករឹង និងភ្ជាប់ទៅ Dashboard គ្រូភ្លាមៗ!</div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div>បន្ទាប់ពីភ្ជាប់រួច កុំព្យូទ័រនេះនឹងបង្ហាញពណ៌បៃតង <strong>Online</strong> នៅលើអេក្រង់លោកគ្រូ។</div>
        </div>
      </div>
    `}
  </div>

  <script>
    let remaining = ${remainingSeconds || 600};
    const timerEl = document.getElementById('countdownTimer');

    function updateTimer() {
      if (!timerEl) return;
      if (remaining <= 0) {
        timerEl.textContent = '00:00 (ផុតកំណត់)';
        timerEl.style.color = '#ef4444';
        setTimeout(() => window.location.reload(), 2000);
        return;
      }
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      timerEl.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      remaining--;
    }

    if (timerEl) {
      updateTimer();
      setInterval(updateTimer, 1000);
    }

    function copyPsCommand() {
      const code = document.getElementById('psCommand').innerText;
      navigator.clipboard.writeText(code).then(() => {
        alert('បានចម្លង Command រួចរាល់! បើក PowerShell រួចចុច Paste (Enter) ជាការស្រេច។');
      });
    }

    // Realtime check if enrolled
    const checkToken = "${token}";
    if (checkToken && !${isExpiredOrUsed}) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch('/api/lab/enroll/verify-token?token=' + checkToken);
          const data = await res.json();
          if (data && data.isUsed) {
            clearInterval(interval);
            document.querySelector('.setup-container').innerHTML = \`
              <div style="text-align: center; padding: 20px 0;">
                <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #10b981; display: inline-flex; align-items: center; justify-content: center; font-size: 2.2rem; margin-bottom: 16px;">
                  <i class="fa-solid fa-check"></i>
                </div>
                <h2 style="font-size: 1.4rem; color: #10b981; font-weight: 700; margin-bottom: 8px;">បានភ្ជាប់ជោគជ័យ!</h2>
                <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px;">កុំព្យូទ័រនេះត្រូវបានភ្ជាប់ទៅកាន់ \${data.classroomName || 'Computer Lab'} រួចរាល់ហើយ។</p>
                <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 12px; font-size: 0.85rem; color: #cbd5e1;">
                  ម៉ាស៊ីន: <strong>\${data.usedByHostname || 'PC-STUDENT'}</strong> &bull; ស្ថានភាព: <span style="color: #10b981;">● Online</span>
                </div>
              </div>
            \`;
          }
        } catch (e) {}
      }, 3000);
    }
  </script>
</body>
</html>`;
}

module.exports = { renderEnrollmentPage };

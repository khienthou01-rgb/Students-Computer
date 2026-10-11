/**
 * ==========================================================================
 * View: KPKT LAB COMPUTER - Central Multi-School Portal & Authentication View
 * Pixel-Perfect Match to Modern National School ERP System
 * ==========================================================================
 */

const LoginView = {
  currentRole: "teacher", // "teacher" | "student"
  _clockInterval: null,

  // Get real live metrics directly from system database
  getRealMetrics() {
    let students = 34; // Real registered students base
    let teachers = 2;  // Real teachers base (លោកគ្រូ ខៀន ធូ & មាស​​ មករា)
    let computers = 16; // Real 16 Lab PCs (PC-01 ដល់ PC-16)
    let courses = 4;   // Typing, Word, Excel, PowerPoint

    try {
      if (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents) {
        const list = StudentAPI.getLocalStudents();
        if (Array.isArray(list) && list.length > 0) students = list.length;
      } else {
        const raw = localStorage.getItem("master_school_students_db");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) students = parsed.length;
        }
      }
    } catch (e) {}

    try {
      if (typeof AuthService !== "undefined" && AuthService.getTeachers) {
        const list = AuthService.getTeachers();
        if (Array.isArray(list) && list.length > 0) teachers = list.length;
      }
    } catch (e) {}

    try {
      if (typeof TimetableView !== "undefined" && TimetableView.scanTotalPcs) {
        computers = TimetableView.scanTotalPcs() || 16;
      }
    } catch (e) {}

    try {
      if (typeof APP_CONFIG !== "undefined" && APP_CONFIG.courses) {
        courses = APP_CONFIG.courses.length || 4;
      }
    } catch (e) {}

    return { students, teachers, computers, courses };
  },

  render() {
    const metrics = this.getRealMetrics();
    const schools = (typeof AuthService !== "undefined" && AuthService.getSchools)
      ? AuthService.getSchools()
      : (APP_CONFIG.defaultSchools || []);
    const activeSchool = (typeof AuthService !== "undefined" && AuthService.getActiveSchool)
      ? AuthService.getActiveSchool()
      : schools[0];
    const totalSchoolsCount = Math.max(126, schools.length);

    return `
      <div class="kpkt-portal-wrapper animate-fadeIn">

        <!-- ============================================================== -->
        <!-- 1. TOP NAVIGATION HEADER BAR                                   -->
        <!-- ============================================================== -->
        <header class="kpkt-top-header">
          <div class="kpkt-brand-left">
            <div class="kpkt-logo-badge" title="សាលា អន្តរជាតិ ធានស៊ីន">
              <img src="assets/images/logo.png" alt="សាលា អន្តរជាតិ ធានស៊ីន" onerror="this.src='assets/images/default-male.svg'">
            </div>
            <div class="kpkt-brand-text">
              <div class="kpkt-brand-title">
                <span>សាលា អន្តរជាតិ ធានស៊ីន</span>
                <span class="kpkt-brand-tag">TIS LAB</span>
              </div>
              <div class="kpkt-brand-subtitle">Tian Xin International School • បន្ទប់កុំព្យូទ័រ TIS Lab Computer</div>
            </div>
          </div>

          <div class="kpkt-header-actions">
            <button type="button" class="kpkt-install-app-pill" id="btnHeaderPwaInstall" onclick="if(window.triggerPwaInstall) window.triggerPwaInstall();" title="ដំឡើងកម្មវិធីលើទូរស័ព្ទ (Install App)">
              <i class="fa-solid fa-mobile-screen-button"></i>
              <span>ដំឡើង App</span>
            </button>

            <div class="kpkt-schools-badge" title="ទីតាំងសាលារៀន">
              <i class="fa-solid fa-location-dot text-rose-400"></i>
              <span>ខេត្តកំពត • កម្ពុជា</span>
            </div>

            <div class="kpkt-clock-pill" id="kpktClockPill">
              <i class="fa-regular fa-clock"></i>
              <span id="kpktLiveClock">--:--:--</span>
            </div>

            <div class="kpkt-security-pill" title="ប្រព័ន្ធសុវត្ថិភាពកម្រិតខ្ពស់">
              <span class="kpkt-dot-live"></span>
              <span>SSL 256-Bit Secure</span>
            </div>
          </div>
        </header>

        <!-- ============================================================== -->
        <!-- 2. MAIN TWO-COLUMN SPLIT PORTAL                                -->
        <!-- ============================================================== -->
        <main class="kpkt-main-portal">

          <!-- ------------------------------------------------------------ -->
          <!-- LEFT COLUMN: TIS LAB SHOWCASE, METRICS & HIGHLIGHTS          -->
          <!-- ------------------------------------------------------------ -->
          <div class="kpkt-showcase-column">

            <!-- National & Portal Badges -->
            <div class="kpkt-top-badges-row">
              <div class="kpkt-badge-kh-motto">
                <i class="fa-solid fa-crown text-amber-400"></i>
                <span>ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ</span>
              </div>
              <div class="kpkt-badge-portal-type">
                <i class="fa-solid fa-school text-cyan-400"></i>
                <span>សាលា អន្តរជាតិ ធានស៊ីន (Tian Xin Int. School)</span>
              </div>
            </div>

            <!-- IT Supporter Brand Box -->
            <div class="kpkt-brand-box-row">
              <div class="kpkt-brand-box-icon">
                <img src="assets/images/logo.png" alt="Logo">
              </div>
              <div class="kpkt-brand-box-label">
                <span class="label-1">TIS LAB COMPUTER</span>
                <span class="label-2">WE ARE YOUR IT SUPPORTER</span>
              </div>
            </div>

            <!-- Headline Title -->
            <h1 class="kpkt-hero-title">
              សាលា អន្តរជាតិ ធានស៊ីន • <span class="accent-cyan">បន្ទប់កុំព្យូទ័រ TIS LAB</span>
            </h1>

            <!-- Accent Subtitle -->
            <div class="kpkt-hero-subtitle">
              <span>• បន្ទប់កុំព្យូទ័ររដ្ឋបាល</span>
              <span>• ថ្នាក់រៀន ៤ វគ្គ</span>
              <span>• គ្រូបង្រៀន និងសិស្សានុសិស្ស •</span>
            </div>

            <!-- Description Paragraph -->
            <p class="kpkt-hero-desc">
              ប្រព័ន្ធបច្ចេកវិទ្យាគ្រប់គ្រងសិស្សានុសិស្ស និងបន្ទប់កុំព្យូទ័ររដ្ឋបាល TIS Lab Computer នៃសាលាអន្តរជាតិធានស៊ីន ខេត្តកំពត សម្រួលដល់ការកត់ត្រាវត្តមានស្វ័យប្រវត្តិតាម Telegram ការប្រឡង ៤ វគ្គ (Typing, Word, Excel, PowerPoint) ស្ទូឌីយោកាតសិស្ស វិញ្ញាបនបត្រឌីជីថល QR Code និងតាមដាន PC Workstations។
            </p>

            <!-- Metrics Counter Cards (4 in 1 Row) - ទិន្នន័យពិតៗពីប្រព័ន្ធ -->
            <div class="kpkt-metrics-grid">
              <div class="kpkt-metric-card">
                <span class="kpkt-metric-number" style="color: #60a5fa;" id="loginStatStudents">${metrics.students}</span>
                <span class="kpkt-metric-label">សិស្សានុសិស្ស</span>
              </div>
              <div class="kpkt-metric-card">
                <span class="kpkt-metric-number" style="color: #a78bfa;" id="loginStatTeachers">${metrics.teachers}</span>
                <span class="kpkt-metric-label">លោកគ្រូ-អ្នកគ្រូ</span>
              </div>
              <div class="kpkt-metric-card">
                <span class="kpkt-metric-number" style="color: #34d399;" id="loginStatComputers">${metrics.computers}</span>
                <span class="kpkt-metric-label">ម៉ាស៊ីន Lab PC</span>
              </div>
              <div class="kpkt-metric-card">
                <span class="kpkt-metric-number" style="color: #fbbf24;" id="loginStatCourses">${metrics.courses} វគ្គ</span>
                <span class="kpkt-metric-label">កុំព្យូទ័ររដ្ឋបាល</span>
              </div>
            </div>

            <!-- Feature Highlights Cards (2x2 Grid) -->
            <div class="kpkt-features-grid">
              <div class="kpkt-feature-card">
                <div class="kpkt-feature-header">
                  <div class="kpkt-feature-icon" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">
                    <i class="fa-solid fa-clipboard-user"></i>
                  </div>
                  <span class="kpkt-feature-title">វត្តមាន & Telegram</span>
                </div>
                <p class="kpkt-feature-desc">កត់ត្រាវត្តមានឆ្លាតវៃ ស្កេនបាកូដកាតសិស្ស និងរបាយការណ៍ស្វ័យប្រវត្តិតាម Telegram</p>
              </div>

              <div class="kpkt-feature-card">
                <div class="kpkt-feature-header">
                  <div class="kpkt-feature-icon" style="background: rgba(168, 85, 247, 0.2); color: #c084fc;">
                    <i class="fa-solid fa-graduation-cap"></i>
                  </div>
                  <span class="kpkt-feature-title">ការប្រឡង ៤ វគ្គ</span>
                </div>
                <p class="kpkt-feature-desc">ប្រឡងវាយអត្ថបទរហ័ស Word Excel និង PowerPoint ជាមួយ Grading ស្វ័យប្រវត្តិ</p>
              </div>

              <div class="kpkt-feature-card">
                <div class="kpkt-feature-header">
                  <div class="kpkt-feature-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">
                    <i class="fa-solid fa-id-card"></i>
                  </div>
                  <span class="kpkt-feature-title">កាតសិស្ស & វិញ្ញាបនបត្រ</span>
                </div>
                <p class="kpkt-feature-desc">ស្ទូឌីយោកាតសិស្ស QR Code វិញ្ញាបនបត្រឌីជីថល និងសៀវភៅតាមដានសិក្សា</p>
              </div>

              <div class="kpkt-feature-card">
                <div class="kpkt-feature-header">
                  <div class="kpkt-feature-icon" style="background: rgba(244, 63, 94, 0.2); color: #fb7185;">
                    <i class="fa-solid fa-desktop"></i>
                  </div>
                  <span class="kpkt-feature-title">បន្ទប់ Lab & សុវត្ថិភាព</span>
                </div>
                <p class="kpkt-feature-desc">គ្រប់គ្រង Workstations PC-01 ដល់ PC-16 កម្មវិធីរៀន និងប្រព័ន្ធទិន្នន័យ SSL 256-Bit</p>
              </div>
            </div>

          </div>

          <!-- ------------------------------------------------------------ -->
          <!-- RIGHT COLUMN: AUTHENTICATION COCKPIT CARD                    -->
          <!-- ------------------------------------------------------------ -->
          <div class="kpkt-login-column">
            <div class="kpkt-login-card">

              <!-- Card Header -->
              <div class="kpkt-login-header">
                <div class="kpkt-login-avatar">
                  <img src="assets/images/logo.png" alt="Logo">
                </div>
                <h2 class="kpkt-login-card-title">ចូលកាន់ប្រព័ន្ធគ្រប់គ្រង</h2>
                <div class="kpkt-login-card-brand">សាលា អន្តរជាតិ ធានស៊ីន</div>
                <p class="kpkt-login-card-sub">សូមបញ្ចូលគណនីគ្រូបង្រៀន ឬអត្តលេខសិស្សដើម្បីចូលប្រើប្រព័ន្ធ</p>
              </div>

              <!-- Role Switcher Tabs -->
              <div class="kpkt-role-tabs">
                <button type="button" class="kpkt-role-tab ${this.currentRole === 'teacher' ? 'active' : ''}" data-role="teacher">
                  <i class="fa-solid fa-chalkboard-user"></i>
                  <span>👨‍🏫 ថ្នាក់ដឹកនាំ & គ្រូ (Staff)</span>
                </button>
                <button type="button" class="kpkt-role-tab ${this.currentRole === 'student' ? 'active' : ''}" data-role="student">
                  <i class="fa-solid fa-graduation-cap"></i>
                  <span>🎓 សិស្ស (Student)</span>
                </button>
              </div>

              <!-- ======================================================== -->
              <!-- TEACHER & STAFF AUTHENTICATION FORM                      -->
              <!-- ======================================================== -->
              <div id="kpktTeacherSection" style="display: ${this.currentRole === 'teacher' ? 'block' : 'none'};">

                <!-- Error Alert -->
                <div id="loginErrorAlert" class="login-error-alert" style="display: none; margin-bottom: 14px;">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span id="loginErrorMsg">ឈ្មោះគណនី ឬលេខសម្ងាត់មិនត្រឹមត្រូវ!</span>
                </div>

                <form id="teacherLoginForm" autocomplete="off">

                  <!-- Email / Username -->
                  <div class="kpkt-field-group">
                    <label class="kpkt-field-label" for="loginUsername">
                      <span><i class="fa-solid fa-envelope text-indigo-400"></i> អាសយដ្ឋានអ៊ីមែល ឬ ឈ្មោះគណនី (Username)</span>
                    </label>
                    <div class="kpkt-input-wrap">
                      <i class="fa-solid fa-at kpkt-input-icon"></i>
                      <input type="text" id="loginUsername" class="kpkt-input" placeholder="khienthou ឬ អ៊ីមែល..." required>
                    </div>
                  </div>

                  <!-- Password -->
                  <div class="kpkt-field-group">
                    <label class="kpkt-field-label" for="loginPassword">
                      <span><i class="fa-solid fa-lock text-indigo-400"></i> ពាក្យសម្ងាត់ (Password)</span>
                      <a href="javascript:void(0)" onclick="LoginView.forgotPasswordPrompt()" class="kpkt-field-hint text-sky-400" style="text-decoration: none;">ភ្លេចពាក្យសម្ងាត់?</a>
                    </label>
                    <div class="kpkt-input-wrap">
                      <i class="fa-solid fa-key kpkt-input-icon"></i>
                      <input type="password" id="loginPassword" class="kpkt-input" placeholder="••••••••" required>
                      <button type="button" id="togglePasswordVisibility" class="kpkt-btn-eye" aria-label="បង្ហាញលេខសម្ងាត់">
                        <i class="fa-regular fa-eye"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Remember Me & Security Tag -->
                  <div class="kpkt-meta-row">
                    <label class="kpkt-checkbox-label">
                      <input type="checkbox" id="loginRememberMe" checked>
                      <span>ចងចាំការចូលប្រើ (Remember Me)</span>
                    </label>
                    <div class="kpkt-secure-badge">
                      <i class="fa-solid fa-shield-check"></i>
                      <span>SSL 256-Bit Secure</span>
                    </div>
                  </div>

                  <!-- Sign In Submit Button -->
                  <button type="submit" id="loginSubmitBtn" class="btn-kpkt-submit">
                    <span>ចូលប្រើប្រព័ន្ធ • Sign In</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>

                  <!-- 1-Click Demo Login Banner -->
                  <div class="kpkt-quick-demo" onclick="LoginView.quickFill('teacher')" title="ចុចត្រង់នេះដើម្បីបំពេញគណនីសាកល្បងលោកគ្រូ ខៀន ធូ ភ្លាមៗ">
                    <div class="kpkt-demo-text">
                      <i class="fa-solid fa-bolt"></i>
                      <span>Demo Login: <strong>khienthou</strong> • Pass: <strong>••••••••</strong></span>
                    </div>
                    <span class="kpkt-demo-btn">បំពេញភ្លាម</span>
                  </div>

                </form>
              </div>

              <!-- ======================================================== -->
              <!-- STUDENT AUTHENTICATION FORM                              -->
              <!-- ======================================================== -->
              <div id="kpktStudentSection" style="display: ${this.currentRole === 'student' ? 'block' : 'none'};">

                <!-- Student Error Alert -->
                <div id="studentLoginErrorAlert" class="login-error-alert" style="display: none; margin-bottom: 14px;">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span id="studentLoginErrorMsg">អត្តលេខសិស្ស ឬលេខសម្ងាត់មិនត្រឹមត្រូវ!</span>
                </div>

                <form id="studentLoginForm" autocomplete="off">

                  <!-- Student ID / Phone -->
                  <div class="kpkt-field-group">
                    <label class="kpkt-field-label" for="studentLoginId">
                      <span><i class="fa-solid fa-id-card text-cyan-400"></i> អត្តលេខសិស្ស (Student ID)</span>
                      <span class="kpkt-field-hint">ឬលេខទូរស័ព្ទផ្ទាល់ខ្លួន</span>
                    </label>
                    <div class="kpkt-input-wrap">
                      <i class="fa-solid fa-address-card kpkt-input-icon text-cyan-400"></i>
                      <input type="text" id="studentLoginId" class="kpkt-input" placeholder="ឧ. TX-01 ឬ 0717210307..." required>
                    </div>
                  </div>

                  <!-- PIN / Password -->
                  <div class="kpkt-field-group">
                    <label class="kpkt-field-label" for="studentLoginPin">
                      <span><i class="fa-solid fa-key text-cyan-400"></i> លេខកូដសម្ងាត់ (PIN / Password)</span>
                      <span class="kpkt-field-hint">Default: 123</span>
                    </label>
                    <div class="kpkt-input-wrap">
                      <i class="fa-solid fa-lock kpkt-input-icon text-cyan-400"></i>
                      <input type="password" id="studentLoginPin" class="kpkt-input" placeholder="បញ្ចូលលេខកូដសម្ងាត់..." required>
                      <button type="button" id="toggleStudentPinVisibility" class="kpkt-btn-eye" aria-label="បង្ហាញលេខសម្ងាត់">
                        <i class="fa-regular fa-eye"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Remember Me -->
                  <div class="kpkt-meta-row">
                    <label class="kpkt-checkbox-label">
                      <input type="checkbox" id="studentRememberMe" checked>
                      <span>ចងចាំការចូលប្រើ (Remember Me)</span>
                    </label>
                    <div class="kpkt-secure-badge">
                      <i class="fa-solid fa-shield-check"></i>
                      <span>SSL 256-Bit Secure</span>
                    </div>
                  </div>

                  <!-- Sign In Submit Button -->
                  <button type="submit" id="studentLoginSubmitBtn" class="btn-kpkt-submit" style="background: linear-gradient(135deg, #0284c7, #06b6d4, #10b981);">
                    <span>🚀 ចូលទៅកាន់គណនីសិស្ស (Sign In)</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>

                  <!-- 1-Click Demo Student Login -->
                  <div class="kpkt-quick-demo" onclick="LoginView.quickFill('student')" style="border-color: rgba(6, 182, 212, 0.4); background: rgba(6, 182, 212, 0.1);" title="បំពេញអត្តលេខសិស្សសាកល្បង">
                    <div class="kpkt-demo-text" style="color: #38bdf8;">
                      <i class="fa-solid fa-graduation-cap"></i>
                      <span>Student Demo: <strong>TX-01</strong> • PIN: <strong>123</strong></span>
                    </div>
                    <span class="kpkt-demo-btn" style="background: #06b6d4; color: #fff;">បំពេញភ្លាម</span>
                  </div>

                </form>
              </div>

              <!-- Support & Help Links -->
              <div class="kpkt-login-support" style="margin-top: 20px;">
                <span>ជំនួយបច្ចេកទេស៖</span>
                <a href="https://t.me/my_master_kh_bot" target="_blank" class="kpkt-support-link">
                  <i class="fa-brands fa-telegram text-sky-400"></i>
                  <span>Telegram</span>
                </a>
                <a href="tel:017589489" class="kpkt-support-link">
                  <i class="fa-solid fa-phone text-emerald-400"></i>
                  <span>017 589 489</span>
                </a>
                <a href="tel:0717210307" class="kpkt-support-link">
                  <i class="fa-solid fa-phone text-cyan-400"></i>
                  <span>071 721 030 7</span>
                </a>
              </div>

            </div>
          </div>

        </main>

        <!-- ============================================================== -->
        <!-- 3. BOTTOM FOOTER BAR                                           -->
        <!-- ============================================================== -->
        <footer class="kpkt-bottom-footer">
          <div class="kpkt-footer-brand">
            <img src="assets/images/logo.png" alt="Logo" style="width: 20px; height: 20px; object-fit: contain;">
            <span><strong>សាលា អន្តរជាតិ ធានស៊ីន</strong> • TIS LAB COMPUTER • រក្សាសិទ្ធិគ្រប់យ៉ាង © 2026 • WE ARE YOUR IT SUPPORTER</span>
          </div>
          <div class="kpkt-footer-socials">
            <a href="tel:017589489" class="kpkt-social-pill"><i class="fa-solid fa-phone text-emerald-400"></i> 017 589 489</a>
            <a href="tel:0717210307" class="kpkt-social-pill"><i class="fa-solid fa-phone text-cyan-400"></i> 071 721 030 7</a>
            <a href="https://t.me/my_master_kh_bot" target="_blank" class="kpkt-social-pill"><i class="fa-brands fa-telegram text-sky-400"></i> Telegram</a>
            <a href="javascript:void(0)" class="kpkt-social-pill"><i class="fa-brands fa-facebook text-blue-400"></i> Facebook</a>
            <a href="javascript:void(0)" class="kpkt-social-pill"><i class="fa-brands fa-youtube text-rose-400"></i> YouTube</a>
          </div>
        </footer>

      </div>
    `;
  },

  initEvents() {
    this.startLiveClock();
    this.syncLiveCloudMetrics();

    // Role Tab Switching
    const roleTabs = document.querySelectorAll(".kpkt-role-tab");
    const teacherSec = document.getElementById("kpktTeacherSection");
    const studentSec = document.getElementById("kpktStudentSection");

    roleTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const role = tab.getAttribute("data-role");
        this.currentRole = role;

        roleTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        if (role === "student") {
          if (teacherSec) teacherSec.style.display = "none";
          if (studentSec) {
            studentSec.style.display = "block";
            studentSec.classList.add("animate-fadeIn");
          }
          const sInput = document.getElementById("studentLoginId");
          if (sInput) sInput.focus();
        } else {
          if (studentSec) studentSec.style.display = "none";
          if (teacherSec) {
            teacherSec.style.display = "block";
            teacherSec.classList.add("animate-fadeIn");
          }
          const tInput = document.getElementById("loginUsername");
          if (tInput) tInput.focus();
        }
      });
    });

    // Password visibility toggle
    const eyeBtn = document.getElementById("togglePasswordVisibility");
    const passwordInput = document.getElementById("loginPassword");
    if (eyeBtn && passwordInput) {
      eyeBtn.addEventListener("click", () => {
        const isPass = passwordInput.type === "password";
        passwordInput.type = isPass ? "text" : "password";
        eyeBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    // Student PIN visibility toggle
    const studentEyeBtn = document.getElementById("toggleStudentPinVisibility");
    const studentPinInput = document.getElementById("studentLoginPin");
    if (studentEyeBtn && studentPinInput) {
      studentEyeBtn.addEventListener("click", () => {
        const isPass = studentPinInput.type === "password";
        studentPinInput.type = isPass ? "text" : "password";
        studentEyeBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    // Teacher Form Submit
    const form = document.getElementById("teacherLoginForm");
    const usernameInput = document.getElementById("loginUsername");
    const rememberMeCheck = document.getElementById("loginRememberMe");
    const schoolSelect = document.getElementById("loginSchoolSelect");
    const errorAlert = document.getElementById("loginErrorAlert");
    const errorMsg = document.getElementById("loginErrorMsg");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = usernameInput?.value.trim();
        const password = passwordInput?.value.trim();
        const rememberMe = rememberMeCheck ? rememberMeCheck.checked : true;

        if (errorAlert) errorAlert.style.display = "none";

        const submitBtn = document.getElementById("loginSubmitBtn");
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>កំពុងផ្ទៀងផ្ទាត់...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
        }

        try {
          await App.handleLogin(username, password, rememberMe);
        } catch (err) {
          if (errorAlert && errorMsg) {
            errorMsg.textContent = err.message || "ឈ្មោះគណនី ឬលេខសម្ងាត់មិនត្រឹមត្រូវ!";
            errorAlert.style.display = "flex";
            errorAlert.classList.add("shake-animation");
            setTimeout(() => errorAlert.classList.remove("shake-animation"), 600);
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>ចូលប្រើប្រព័ន្ធ • Sign In</span> <i class="fa-solid fa-arrow-right"></i>`;
          }
        }
      });
    }

    // Student Form Submit
    const studentForm = document.getElementById("studentLoginForm");
    const studentIdInput = document.getElementById("studentLoginId");
    const studentRememberCheck = document.getElementById("studentRememberMe");
    const studentErrorAlert = document.getElementById("studentLoginErrorAlert");
    const studentErrorMsg = document.getElementById("studentLoginErrorMsg");

    if (studentForm) {
      studentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const idOrPhone = studentIdInput?.value.trim();
        const pin = studentPinInput?.value.trim();
        const rememberMe = studentRememberCheck ? studentRememberCheck.checked : true;

        if (studentErrorAlert) studentErrorAlert.style.display = "none";

        const submitBtn = document.getElementById("studentLoginSubmitBtn");
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>កំពុងផ្ទៀងផ្ទាត់...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
        }

        try {
          await App.handleStudentLogin(idOrPhone, pin, rememberMe);
        } catch (err) {
          if (studentErrorAlert && studentErrorMsg) {
            studentErrorMsg.textContent = err.message || "អត្តលេខសិស្ស ឬលេខកូដមិនត្រឹមត្រូវ!";
            studentErrorAlert.style.display = "flex";
            studentErrorAlert.classList.add("shake-animation");
            setTimeout(() => studentErrorAlert.classList.remove("shake-animation"), 600);
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>🚀 ចូលទៅកាន់គណនីសិស្ស (Sign In)</span> <i class="fa-solid fa-arrow-right"></i>`;
          }
        }
      });
    }
  },

  startLiveClock() {
    if (this._clockInterval) clearInterval(this._clockInterval);

    const updateClock = () => {
      const clockEl = document.getElementById("kpktLiveClock");
      if (!clockEl) return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const date = now.getDate();
      const year = now.getFullYear();

      clockEl.textContent = `${hours}:${minutes}:${seconds} | ${dayName}, ${monthName} ${date}, ${year}`;
    };

    updateClock();
    this._clockInterval = setInterval(updateClock, 1000);
  },

  quickFill(role) {
    if (role === 'teacher') {
      const u = document.getElementById("loginUsername");
      const p = document.getElementById("loginPassword");
      if (u && p) {
        u.value = "khienthou";
        p.value = "11112222";
        u.classList.add("input-pulse-glow");
        p.classList.add("input-pulse-glow");
        setTimeout(() => {
          u.classList.remove("input-pulse-glow");
          p.classList.remove("input-pulse-glow");
        }, 800);
        const submit = document.getElementById("loginSubmitBtn");
        if (submit) submit.focus();
        if (typeof Motion !== "undefined" && Motion.toast) {
          Motion.toast("⚡ បានបំពេញគណនីលោកគ្រូ Khien Thou រួចរាល់! ចុច Sign In ដើម្បីចូល។", "info", 2500);
        }
      }
    } else {
      const sId = document.getElementById("studentLoginId");
      const sPin = document.getElementById("studentLoginPin");
      if (sId && sPin) {
        let demoId = "TX-01";
        if (typeof StudentAPI !== "undefined") {
          const list = StudentAPI.getLocalStudents();
          if (list && list.length > 0) demoId = list[0].ID || list[0].id || "TX-01";
        }
        sId.value = demoId;
        sPin.value = "123";
        sId.classList.add("input-pulse-glow");
        sPin.classList.add("input-pulse-glow");
        setTimeout(() => {
          sId.classList.remove("input-pulse-glow");
          sPin.classList.remove("input-pulse-glow");
        }, 800);
        const submit = document.getElementById("studentLoginSubmitBtn");
        if (submit) submit.focus();
        if (typeof Motion !== "undefined" && Motion.toast) {
          Motion.toast(`⚡ បានបំពេញអត្តលេខសិស្ស ${demoId} រួចរាល់! ចុច Sign In ដើម្បីចូល។`, "info", 2500);
        }
      }
    }
  },

  forgotPasswordPrompt() {
    alert("សូមទំនាក់ទំនងទៅកាន់លោកគ្រូ ខៀន ធូ តាមលេខទូរស័ព្ទ 017 589 489 ឬ 071 721 030 7 ឬ Telegram @my_master_kh_bot ដើម្បីស្នើសុំកំណត់លេខសម្ងាត់ឡើងវិញ។");
  },

  // Asynchronously synchronize live counts from Firebase RTDB
  syncLiveCloudMetrics() {
    if (typeof firebase !== "undefined" && firebase.apps && firebase.apps.length > 0) {
      try {
        firebase.database().ref("students").once("value").then(snap => {
          const val = snap.val();
          if (val) {
            const list = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
            const count = list.length;
            const el = document.getElementById("loginStatStudents");
            if (el && count > 0) el.textContent = count;
          }
        }).catch(() => {});

        firebase.database().ref("teachers").once("value").then(snap => {
          const val = snap.val();
          if (val) {
            const list = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
            const count = list.length;
            const el = document.getElementById("loginStatTeachers");
            if (el && count > 0) el.textContent = count;
          }
        }).catch(() => {});

        firebase.database().ref("computers").once("value").then(snap => {
          const val = snap.val();
          if (val) {
            const list = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
            const count = list.length;
            const el = document.getElementById("loginStatComputers");
            if (el && count > 0) el.textContent = count;
          }
        }).catch(() => {});
      } catch (e) {}
    }
  },

  // =========================================================================
  // REGISTER NEW SCHOOL MODAL (សម្រាប់សាលាផ្សេងៗចុះឈ្មោះចូលរួមក្នុងបណ្តាញ)
  // =========================================================================
  openRegisterSchoolModal() {
    const existing = document.getElementById("registerSchoolModalRoot");
    if (existing) existing.remove();

    const provinces = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.provinces)
      ? APP_CONFIG.provinces
      : ["រាជធានីភ្នំពេញ", "ខេត្តកំពត", "ខេត្តកណ្តាល", "ខេត្តសៀមរាប", "ខេត្តបាត់ដំបង"];

    const modalHtml = `
      <div id="registerSchoolModalRoot" class="kpkt-modal-backdrop">
        <div class="kpkt-modal-container">
          <!-- Modal Header -->
          <div class="kpkt-modal-header">
            <div class="kpkt-modal-title-wrap">
              <div class="kpkt-modal-icon">
                <i class="fa-solid fa-school-flag"></i>
              </div>
              <div>
                <h3 class="kpkt-modal-title">ចុះឈ្មោះបង្កើតសាលារៀនថ្មី</h3>
                <p class="kpkt-modal-sub">ចូលរួមក្នុងបណ្តាញពហុសាលារៀន KPKT LAB COMPUTER ដោយឥតគិតថ្លៃ</p>
              </div>
            </div>
            <button type="button" class="btn-kpkt-modal-close" onclick="LoginView.closeRegisterSchoolModal()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Modal Body Form -->
          <form id="registerSchoolForm" onsubmit="LoginView.handleRegisterSchoolSubmit(event)">
            <div class="kpkt-modal-body">

              <div class="kpkt-form-grid-2">
                <div class="kpkt-field-group">
                  <label class="kpkt-field-label">ឈ្មោះសាលារៀន (ភាសាខ្មែរ)*</label>
                  <input type="text" id="regSchoolNameKh" class="kpkt-input" style="padding-left: 14px;" placeholder="ឧ. វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ" required>
                </div>

                <div class="kpkt-field-group">
                  <label class="kpkt-field-label">ឈ្មោះសាលា (English)*</label>
                  <input type="text" id="regSchoolNameEn" class="kpkt-input" style="padding-left: 14px;" placeholder="ឧ. Preah Sisowath High School" required>
                </div>
              </div>

              <div class="kpkt-form-grid-2">
                <div class="kpkt-field-group">
                  <label class="kpkt-field-label">ប្រភេទសាលា (School Type)*</label>
                  <select id="regSchoolType" class="kpkt-select" style="padding-left: 14px;">
                    <option value="វិទ្យាល័យ">វិទ្យាល័យ (High School)</option>
                    <option value="អនុវិទ្យាល័យ">អនុវិទ្យាល័យ (Secondary School)</option>
                    <option value="បឋមសិក្សា">បឋមសិក្សា (Primary School)</option>
                    <option value="សាលាអន្តរជាតិ">សាលាអន្តរជាតិ (International School)</option>
                    <option value="មជ្ឈមណ្ឌលកុំព្យូទ័រ & ភាសា">មជ្ឈមណ្ឌលកុំព្យូទ័រ & ភាសា</option>
                  </select>
                </div>

                <div class="kpkt-field-group">
                  <label class="kpkt-field-label">រាជធានី / ខេត្ត (Province)*</label>
                  <select id="regSchoolProvince" class="kpkt-select" style="padding-left: 14px;">
                    ${provinces.map(p => `<option value="${p}">${p}</option>`).join("")}
                  </select>
                </div>
              </div>

              <div class="kpkt-form-grid-2">
                <div class="kpkt-field-group">
                  <label class="kpkt-field-label">លេខកូដសាលា (School Code)*</label>
                  <input type="text" id="regSchoolCode" class="kpkt-input" style="padding-left: 14px;" placeholder="ឧ. SISOWATH ឬ ABC" required>
                  <span class="kpkt-field-hint">ជាអក្សរឡាតាំងធំខ្លីៗ</span>
                </div>

                <div class="kpkt-field-group">
                  <label class="kpkt-field-label">ឈ្មោះនាយក / អ្នកគ្រប់គ្រង*</label>
                  <input type="text" id="regAdminName" class="kpkt-input" style="padding-left: 14px;" placeholder="ឧ. លោកគ្រូ សុខ ចិន្តា" required>
                </div>
              </div>

              <div class="kpkt-form-grid-2">
                <div class="kpkt-field-group">
                  <label class="kpkt-field-label">ឈ្មោះគណនី Login (Username/Email)*</label>
                  <input type="text" id="regAdminUsername" class="kpkt-input" style="padding-left: 14px;" placeholder="ឧ. admin.sisowath" required>
                </div>

                <div class="kpkt-field-group">
                  <label class="kpkt-field-label">លេខទូរស័ព្ទទំនាក់ទំនង*</label>
                  <input type="tel" id="regPhone" class="kpkt-input" style="padding-left: 14px;" placeholder="ឧ. 012 345 678" required>
                </div>
              </div>

              <div class="kpkt-field-group">
                <label class="kpkt-field-label">ពាក្យសម្ងាត់សម្រាប់ចូលប្រើ (Password)*</label>
                <input type="password" id="regPassword" class="kpkt-input" style="padding-left: 14px;" placeholder="យ៉ាងតិច ៦ ខ្ទង់..." required>
              </div>

              <div id="regSchoolErrorAlert" style="display: none; color: #ef4444; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; margin-top: 10px;"></div>

            </div>

            <!-- Modal Footer -->
            <div class="kpkt-modal-footer">
              <button type="button" class="btn-kpkt-cancel" onclick="LoginView.closeRegisterSchoolModal()">បោះបង់</button>
              <button type="submit" id="btnSubmitRegSchool" class="btn-kpkt-register-submit">
                <i class="fa-solid fa-sparkles"></i>
                <span>បង្កើតសាលារៀន & ចូលប្រើ</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    setTimeout(() => {
      const input = document.getElementById("regSchoolNameKh");
      if (input) input.focus();
    }, 100);
  },

  closeRegisterSchoolModal() {
    const el = document.getElementById("registerSchoolModalRoot");
    if (el) el.remove();
  },

  async handleRegisterSchoolSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById("btnSubmitRegSchool");
    const errBox = document.getElementById("regSchoolErrorAlert");
    if (errBox) errBox.style.display = "none";

    const nameKh = document.getElementById("regSchoolNameKh")?.value.trim();
    const nameEn = document.getElementById("regSchoolNameEn")?.value.trim();
    const type = document.getElementById("regSchoolType")?.value;
    const province = document.getElementById("regSchoolProvince")?.value;
    const code = document.getElementById("regSchoolCode")?.value.trim();
    const adminName = document.getElementById("regAdminName")?.value.trim();
    const adminUsername = document.getElementById("regAdminUsername")?.value.trim();
    const phone = document.getElementById("regPhone")?.value.trim();
    const password = document.getElementById("regPassword")?.value.trim();

    if (!nameKh || !adminUsername || !password) {
      if (errBox) {
        errBox.textContent = "សូមបំពេញព័ត៌មានចាំបាច់ឱ្យបានគ្រប់គ្រាន់!";
        errBox.style.display = "block";
      }
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងចុះឈ្មោះ...`;
    }

    try {
      if (typeof AuthService === "undefined" || !AuthService.registerSchool) {
        throw new Error("ប្រព័ន្ធចុះឈ្មោះមិនទាន់រួចរាល់!");
      }

      const res = await AuthService.registerSchool({
        nameKh,
        nameEn,
        type,
        province,
        code,
        adminName,
        adminUsername,
        phone,
        password
      });

      // Confetti celebration 🎉
      if (typeof confetti === "function") {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      this.closeRegisterSchoolModal();

      if (typeof Motion !== "undefined" && Motion.toast) {
        Motion.toast(`🎉 បានចុះឈ្មោះសាលា «${res.school.nameKh}» ជោគជ័យ! កំពុងចូលប្រព័ន្ធ...`, "success", 3500);
      }

      // Pre-fill and auto login into new school!
      const userIn = document.getElementById("loginUsername");
      const passIn = document.getElementById("loginPassword");
      if (userIn) userIn.value = adminUsername;
      if (passIn) passIn.value = password;

      // Update school select option dynamically
      const schoolSelect = document.getElementById("loginSchoolSelect");
      if (schoolSelect) {
        const opt = document.createElement("option");
        opt.value = res.school.id;
        opt.textContent = `${res.school.nameKh} (${res.school.code}) - ${res.school.province}`;
        opt.selected = true;
        schoolSelect.appendChild(opt);
      }

      // Update total school counter in header
      const counterEl = document.getElementById("kpktSchoolCount");
      if (counterEl) {
        const cur = parseInt(counterEl.textContent, 10) || 126;
        counterEl.textContent = cur + 1;
      }

      // Automatically sign in!
      setTimeout(async () => {
        try {
          await App.handleLogin(adminUsername, password, true, res.school.id);
        } catch (loginErr) {
          console.warn("Auto-login notice:", loginErr);
        }
      }, 700);

    } catch (err) {
      if (errBox) {
        errBox.textContent = err.message || "មានបញ្ហាក្នុងការចុះឈ្មោះសាលារៀន!";
        errBox.style.display = "block";
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-sparkles"></i> បង្កើតសាលារៀន & ចូលប្រើ`;
      }
    }
  }
};

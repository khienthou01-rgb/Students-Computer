/**
 * View: Professional Dual-Role Authentication Portal (ទម្រង់ចូលប្រព័ន្ធកម្រិតអាជីពសម្រាប់គ្រូ និងសិស្ស)
 */
const LoginView = {
  currentRole: "teacher", // "teacher" | "student"

  render() {
    return `
      <div class="login-page-wrapper">
        <!-- Dynamic Ambient Floating Luminous Orbs -->
        <div class="login-ambient-orb orb-1"></div>
        <div class="login-ambient-orb orb-2"></div>
        <div class="login-ambient-orb orb-3"></div>

        <!-- Master Professional Centered Authentication Cockpit -->
        <div class="login-master-container">
          <div class="login-card-inner">

            <!-- Brand & Academy Header -->
            <div class="login-brand-header">
              <div class="login-brand-logo-wrap">
                <img src="assets/images/logo.png" alt="Tian Xin International School" class="login-brand-logo-img">
              </div>
              <h1 class="login-brand-title">សាលា អន្តរជាតិ ធានស៊ីន</h1>
              <p class="login-brand-en">TIAN XIN INTERNATIONAL SCHOOL (TIS)</p>
              <p class="login-brand-subtitle">ប្រព័ន្ធគ្រប់គ្រងសិស្ស & បន្ទប់អនុវត្តកុំព្យូទ័រ</p>
            </div>

            <!-- Dynamic Segmented Dual-Role Tab Switcher with Sliding Glider -->
            <div class="login-segmented-control" data-role="${this.currentRole}">
              <div class="segmented-pill-glider"></div>
              <button type="button" class="btn-segmented ${this.currentRole === 'teacher' ? 'active' : ''}" data-role="teacher">
                <i class="fa-solid fa-chalkboard-user"></i>
                <span>👨‍🏫 គ្រូបង្រៀន (Teacher)</span>
              </button>
              <button type="button" class="btn-segmented ${this.currentRole === 'student' ? 'active' : ''}" data-role="student">
                <i class="fa-solid fa-user-graduate"></i>
                <span>🎓 សិស្សានុសិស្ស (Student)</span>
              </button>
            </div>

            <!-- ======================================== -->
            <!-- 1. TEACHER AUTHENTICATION FORM           -->
            <!-- ======================================== -->
            <div id="teacherLoginSection" style="display: ${this.currentRole === 'teacher' ? 'block' : 'none'};" class="motion-fade-up">

              <!-- Quick One-Click Demo Login Banner -->
              <div class="login-quick-demo-banner" onclick="LoginView.quickFill('teacher')" title="ចុចត្រង់នេះដើម្បីបំពេញគណនីគ្រូសាកល្បងដោយស្វ័យប្រវត្តិ">
                <div class="quick-demo-left">
                  <span class="quick-demo-badge"><i class="fa-solid fa-bolt"></i> Demo Login</span>
                  <span class="quick-demo-creds">Username: <strong>khienthou</strong> • Pass: <strong>••••••••</strong></span>
                </div>
                <span class="quick-demo-action"><i class="fa-solid fa-wand-magic-sparkles"></i> បំពេញភ្លាម</span>
              </div>

              <!-- Teacher Error Alert Banner -->
              <div id="loginErrorAlert" class="login-error-alert" style="display: none;">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span id="loginErrorMsg">ឈ្មោះគណនី ឬលេខសម្ងាត់មិនត្រឹមត្រូវ!</span>
              </div>

              <!-- Form -->
              <form id="teacherLoginForm" autocomplete="off">
                <div class="form-field-group">
                  <label for="loginUsername">ឈ្មោះគណនីគ្រូ (Username ឬ Email)</label>
                  <div class="input-container-pro">
                    <i class="fa-solid fa-user-tie field-icon"></i>
                    <input type="text" id="loginUsername" class="input-pro" placeholder="បញ្ចូលឈ្មោះគណនី ឬអ៊ីមែល..." required>
                  </div>
                </div>

                <div class="form-field-group">
                  <label for="loginPassword">លេខសម្ងាត់ (Password)</label>
                  <div class="input-container-pro">
                    <i class="fa-solid fa-lock field-icon"></i>
                    <input type="password" id="loginPassword" class="input-pro" placeholder="បញ្ចូលលេខសម្ងាត់..." required>
                    <button type="button" id="togglePasswordVisibility" class="btn-eye-pro" aria-label="បង្ហាញលេខសម្ងាត់">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                  </div>
                </div>

                <div class="form-meta-row">
                  <label class="remember-checkbox-label">
                    <input type="checkbox" id="loginRememberMe" checked>
                    <span>ចងចាំការចូលប្រើ (Remember Me)</span>
                  </label>
                </div>

                <button type="submit" id="loginSubmitBtn" class="btn-submit-pro">
                  <span>ចូលប្រព័ន្ធគ្រប់គ្រង (Sign In)</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>

            <!-- ======================================== -->
            <!-- 2. STUDENT AUTHENTICATION FORM           -->
            <!-- ======================================== -->
            <div id="studentLoginSection" style="display: ${this.currentRole === 'student' ? 'block' : 'none'};" class="motion-fade-up">

              <!-- Quick One-Click Demo Student Login Banner -->
              <div class="login-quick-demo-banner student-demo" onclick="LoginView.quickFill('student')" title="ចុចត្រង់នេះដើម្បីបំពេញអត្តលេខសិស្សសាកល្បងដោយស្វ័យប្រវត្តិ">
                <div class="quick-demo-left">
                  <span class="quick-demo-badge student"><i class="fa-solid fa-graduation-cap"></i> Student Demo</span>
                  <span class="quick-demo-creds">ID: <strong>TX-01</strong> • PIN: <strong>123</strong></span>
                </div>
                <span class="quick-demo-action"><i class="fa-solid fa-wand-magic-sparkles"></i> បំពេញភ្លាម</span>
              </div>

              <!-- Student Error Alert Banner -->
              <div id="studentLoginErrorAlert" class="login-error-alert" style="display: none;">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span id="studentLoginErrorMsg">អត្តលេខសិស្ស ឬលេខសម្ងាត់មិនត្រឹមត្រូវ!</span>
              </div>

              <!-- Form -->
              <form id="studentLoginForm" autocomplete="off">
                <div class="form-field-group">
                  <label for="studentLoginId">អត្តលេខសិស្ស (Student ID) ឬលេខទូរស័ព្ទ</label>
                  <div class="input-container-pro">
                    <i class="fa-solid fa-id-card field-icon text-cyan-400"></i>
                    <input type="text" id="studentLoginId" class="input-pro" placeholder="បញ្ចូលអត្តលេខសិស្ស ឬលេខទូរស័ព្ទ..." required>
                  </div>
                </div>

                <div class="form-field-group">
                  <label for="studentLoginPin">លេខកូដសម្ងាត់ (PIN / Password)</label>
                  <div class="input-container-pro">
                    <i class="fa-solid fa-key field-icon text-cyan-400"></i>
                    <input type="password" id="studentLoginPin" class="input-pro" placeholder="បញ្ចូលលេខកូដសម្ងាត់..." required>
                    <button type="button" id="toggleStudentPinVisibility" class="btn-eye-pro" aria-label="បង្ហាញលេខសម្ងាត់">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                  </div>
                </div>

                <div class="form-meta-row">
                  <label class="remember-checkbox-label">
                    <input type="checkbox" id="studentRememberMe" checked>
                    <span>ចងចាំការចូលប្រើ (Remember Me)</span>
                  </label>
                </div>

                <button type="submit" id="studentLoginSubmitBtn" class="btn-submit-pro btn-submit-student">
                  <span>🚀 ចូលទៅកាន់គណនីសិស្ស (Sign In)</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>

            <!-- Card Bottom Security Guarantee Footer -->
            <div class="login-form-footer">
              <div class="footer-security-tag">
                <i class="fa-solid fa-shield-halved text-emerald-400"></i>
                <span>256-Bit SSL Encrypted & Secured</span>
              </div>
              <div class="footer-version">TIS Lab Computer v2.6 Pro</div>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    // Role Tab Switching (Dual Roles: Teacher & Student)
    const roleBtns = document.querySelectorAll(".btn-segmented");
    const teacherSec = document.getElementById("teacherLoginSection");
    const studentSec = document.getElementById("studentLoginSection");

    roleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-role");
        this.currentRole = role;

        const control = document.querySelector(".login-segmented-control");
        if (control) control.setAttribute("data-role", role);

        roleBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (role === "student") {
          if (teacherSec) teacherSec.style.display = "none";
          if (studentSec) {
            studentSec.style.display = "block";
            studentSec.classList.remove("motion-fade-up");
            void studentSec.offsetWidth;
            studentSec.classList.add("motion-fade-up");
          }
          const sInput = document.getElementById("studentLoginId");
          if (sInput) sInput.focus();
        } else {
          if (teacherSec) {
            teacherSec.style.display = "block";
            teacherSec.classList.remove("motion-fade-up");
            void teacherSec.offsetWidth;
            teacherSec.classList.add("motion-fade-up");
          }
          if (studentSec) studentSec.style.display = "none";
          const tInput = document.getElementById("loginUsername");
          if (tInput) tInput.focus();
        }
      });
    });

    // ----------------------------------------------------
    // TEACHER LOGIN EVENTS
    // ----------------------------------------------------
    const form = document.getElementById("teacherLoginForm");
    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");
    const rememberMeCheck = document.getElementById("loginRememberMe");
    const errorAlert = document.getElementById("loginErrorAlert");
    const errorMsg = document.getElementById("loginErrorMsg");
    const eyeBtn = document.getElementById("togglePasswordVisibility");

    if (eyeBtn && passwordInput) {
      eyeBtn.addEventListener("click", () => {
        const isPass = passwordInput.type === "password";
        passwordInput.type = isPass ? "text" : "password";
        eyeBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

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
            submitBtn.innerHTML = `<span>ចូលប្រព័ន្ធគ្រប់គ្រង (Sign In)</span> <i class="fa-solid fa-arrow-right"></i>`;
          }
        }
      });
    }

    // ----------------------------------------------------
    // STUDENT LOGIN EVENTS
    // ----------------------------------------------------
    const studentForm = document.getElementById("studentLoginForm");
    const studentIdInput = document.getElementById("studentLoginId");
    const studentPinInput = document.getElementById("studentLoginPin");
    const studentRememberCheck = document.getElementById("studentRememberMe");
    const studentErrorAlert = document.getElementById("studentLoginErrorAlert");
    const studentErrorMsg = document.getElementById("studentLoginErrorMsg");
    const studentEyeBtn = document.getElementById("toggleStudentPinVisibility");

    if (studentEyeBtn && studentPinInput) {
      studentEyeBtn.addEventListener("click", () => {
        const isPass = studentPinInput.type === "password";
        studentPinInput.type = isPass ? "text" : "password";
        studentEyeBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

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
  }
};




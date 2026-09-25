/**
 * ==========================================================================
 * TIS Lab Computer - Application Orchestrator & Controller
 * ==========================================================================
 */

const App = {
  // Global Application State
  state: {
    currentTab: "dashboard",
    students: [],
    filteredStudents: [],
    searchQuery: "",
    filters: {
      grade: "",
      course: "",
      gender: "",
      shift: "",
      status: ""
    },
    pagination: {
      page: 1,
      limit: 10
    },
    sort: {
      field: "ID",
      order: "desc"
    },
    selectedStudent: null
  },

  // Bootstrap the application
  async init() {
    this.initTheme();

    // Support #verify-cert, #self-register, #logout, and #student-login hash
    if (window.location.hash.startsWith("#verify-cert")) {
      this.mountVerifyCertScreen();
      return;
    } else if (window.location.hash === "#self-register") {
      this.mountSelfRegisterScreen();
      return;
    } else if (window.location.hash === "#logout") {
      history.replaceState(null, "", window.location.pathname);
      if (typeof AuthService !== "undefined") {
        AuthService.logout();
      }
    } else if (window.location.hash === "#student-login") {
      history.replaceState(null, "", window.location.pathname);
      if (typeof AuthService !== "undefined") {
        AuthService.logout();
      }
      this.mountLoginScreen("student");
      return;
    }

    window.addEventListener("hashchange", () => {
      if (window.location.hash.startsWith("#verify-cert")) {
        this.mountVerifyCertScreen();
      } else if (window.location.hash === "#self-register") {
        this.mountSelfRegisterScreen();
      } else if (window.location.hash === "#logout") {
        history.replaceState(null, "", window.location.pathname);
        this.handleLogout(true);
      } else if (window.location.hash === "#student-login") {
        history.replaceState(null, "", window.location.pathname);
        this.handleLogout(true);
        this.mountLoginScreen("student");
      }
    });

    if (typeof AuthService !== "undefined") {
      AuthService.init();
      this.state.currentUser = AuthService.getCurrentUser();
    }

    if (typeof AuthService !== "undefined" && !AuthService.isAuthenticated()) {
      this.mountLoginScreen();
      return;
    }

    this.mountDOM();
    this.bindEvents();

    // Ensure all exam scores are completely empty per user requirement: no student has taken any exam yet
    if (localStorage.getItem("ms_exams_cleared_all_v4") !== "true") {
      if (typeof StudentAPI !== "undefined" && StudentAPI.clearAllExams) {
        await StudentAPI.clearAllExams();
      }
      localStorage.setItem("ms_exams_cleared_all_v4", "true");
    }

    if (typeof AuthService === "undefined" || !AuthService.isStudent()) {
      this.setupAutoSync();
      await this.loadData();
    }

    // Initialize 7:00 PM Telegram daily attendance auto-scheduler
    if (typeof TelegramService !== "undefined" && TelegramService.initDailyAttendanceScheduler) {
      TelegramService.initDailyAttendanceScheduler();
    }

    // Initialize Teacher Tools Global Shortcuts & Weekly Telegram Backup Scheduler
    if (typeof TeacherToolsService !== "undefined") {
      if (TeacherToolsService.initGlobalKeyboardShortcuts) {
        TeacherToolsService.initGlobalKeyboardShortcuts();
      }
      if (TeacherToolsService.initWeeklyTelegramBackupScheduler) {
        TeacherToolsService.initWeeklyTelegramBackupScheduler();
      }
      if (TeacherToolsService.initBarcodeScannerListener) {
        TeacherToolsService.initBarcodeScannerListener();
      }
    }

    // Check for advance Khmer Calendar national holidays & prompt teacher
    if (typeof KhmerCalendarService !== "undefined" && KhmerCalendarService.checkAndPromptAdvanceHolidays) {
      KhmerCalendarService.checkAndPromptAdvanceHolidays();
    }
  },

  // Edit Student Wizard Helpers (2-Step Fullscreen / Responsive Wizard)
  editStep: 1,

  toggleEditFullscreen() {
    const card = document.querySelector("#editModal .modal-card");
    const btn = document.getElementById("btnToggleEditFullscreen");
    if (card) {
      card.classList.toggle("windowed");
      const isWindowed = card.classList.contains("windowed");
      if (btn) {
        btn.innerHTML = isWindowed ? `<i class="fa-solid fa-expand"></i>` : `<i class="fa-solid fa-compress"></i>`;
        btn.title = isWindowed ? "ពង្រីកពេញអេក្រង់" : "បង្រួមផ្ទាំង";
      }
    }
  },

  goToEditStep(step) {
    if (step > 1 && this.editStep === 1) {
      const nameKhInput = document.getElementById("editInputNameKh");
      if (!nameKhInput || !nameKhInput.value.trim()) {
        this.showToast("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!", "warning");
        if (nameKhInput) nameKhInput.focus();
        return;
      }
    }

    this.editStep = step;
    this.updateEditStepUI();
  },

  nextEditStep() {
    if (this.editStep < 2) {
      this.goToEditStep(this.editStep + 1);
    }
  },

  prevEditStep() {
    if (this.editStep > 1) {
      this.goToEditStep(this.editStep - 1);
    }
  },

  updateEditStepUI() {
    // 1. Progress Bar & Stepper Nodes
    const progressPercent = (this.editStep === 1) ? 0 : 100;
    const progressBar = document.getElementById("editStepperProgress");
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    for (let i = 1; i <= 2; i++) {
      const node = document.getElementById(`editStepNode${i}`);
      const section = document.getElementById(`editStepSection${i}`);
      if (node) {
        node.classList.remove("active", "completed");
        if (i === this.editStep) {
          node.classList.add("active");
        } else if (i < this.editStep) {
          node.classList.add("completed");
        }
      }
      if (section) {
        section.style.display = (i === this.editStep) ? "block" : "none";
      }
    }

    // 2. Subheader Icon & Text
    const subheaderIcon = document.getElementById("editSubheaderIcon");
    const subheaderText = document.getElementById("editSubheaderText");
    if (this.editStep === 1) {
      if (subheaderIcon) subheaderIcon.className = "fa-regular fa-user";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានអំពីសិស្ស";
    } else {
      if (subheaderIcon) subheaderIcon.className = "fa-solid fa-graduation-cap";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានវគ្គសិក្សាកុំព្យូទ័រ";
    }

    // 3. Footer Action Buttons
    const prevBtn = document.getElementById("btnEditPrevStep");
    const nextBtn = document.getElementById("btnEditNextStep");
    const submitBtn = document.getElementById("btnEditSubmit");

    if (prevBtn) {
      prevBtn.style.display = (this.editStep === 2) ? "inline-flex" : "none";
    }
    if (nextBtn) {
      nextBtn.style.display = (this.editStep === 1) ? "inline-flex" : "none";
    }
    if (submitBtn) {
      submitBtn.style.display = "inline-flex";
    }
  },

  mountSelfRegisterScreen() {
    const appEl = document.getElementById("app");
    const modalRoot = document.getElementById("modalRoot");
    if (modalRoot) modalRoot.innerHTML = "";
    if (!appEl) return;

    const branding = (typeof TeacherToolsService !== "undefined") 
      ? TeacherToolsService.getSchoolBranding() 
      : { schoolNameKh: "សាលាកុំព្យូទ័រ TIS Lab Computer", teacherTitle: "លោកគ្រូ ខៀន ធូ", schoolPhone: "071 721 0307" };

    appEl.innerHTML = `
      <div style="min-height: 100vh; background: #0f172a; padding: 20px 14px; font-family: 'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center;">
        <div style="width: 100%; max-width: 540px; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #1e1b4b, #4338ca); padding: 26px 24px; text-align: center; color: #fff;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 1.5rem; color: #38bdf8;">
              <i class="fa-solid fa-laptop-code"></i>
            </div>
            <h2 style="margin: 0 0 6px 0; font-size: 1.25rem; font-weight: 800; color: #fff;">${branding.schoolNameKh}</h2>
            <p style="margin: 0; font-size: 0.84rem; color: #c7d2fe;">ពាក្យសុំចុះឈ្មោះចូលរៀនវគ្គកុំព្យូទ័ររដ្ឋបាល (Online)</p>
          </div>

          <!-- Body Form -->
          <div id="selfRegFormContainer" style="padding: 24px 20px;">
            <form id="onlineSelfRegisterForm" autocomplete="off">
              
              <!-- Avatar Upload & 3:4 Preview -->
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 90px; height: 120px; margin: 0 auto 10px auto; border-radius: 8px; border: 2px dashed #94a3b8; overflow: hidden; background: #f8fafc; position: relative; display: flex; align-items: center; justify-content: center;">
                  <img id="selfRegAvatarPreview" src="" style="width: 100%; height: 100%; object-fit: cover; display: none;" alt="Photo">
                  <span id="selfRegAvatarPlace" style="font-size: 0.72rem; color: #94a3b8;"><i class="fa-solid fa-camera fa-2x mb-1" style="display: block;"></i> រូបថត 3x4</span>
                </div>
                <label class="btn-secondary btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; padding: 6px 14px; border-radius: 20px;">
                  <i class="fa-solid fa-upload"></i> <span>ថត ឬជ្រើសរើសរូបថត</span>
                  <input type="file" id="selfRegAvatarFile" accept="image/*" style="display: none;">
                </label>
                <input type="hidden" id="selfRegAvatarData" value="">
              </div>

              <!-- Name Kh & Name En -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #1e293b;">ឈ្មោះខ្មែរ <span style="color: #ef4444;">*</span></label>
                  <input type="text" id="selfRegNameKh" class="form-control" placeholder="ឧ. សុខ ចាន់ដារ៉ា" required style="font-size: 0.9rem;">
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #1e293b;">អក្សរឡាតាំង (Auto)</label>
                  <input type="text" id="selfRegNameEn" class="form-control font-mono" placeholder="SOK CHANDARA" style="font-size: 0.88rem; text-transform: uppercase;">
                </div>
              </div>

              <!-- Gender & DOB -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #1e293b;">ភេទ <span style="color: #ef4444;">*</span></label>
                  <select id="selfRegGender" class="form-control" style="font-size: 0.88rem;">
                    <option value="ប្រុស">ប្រុស (Male)</option>
                    <option value="ស្រី">ស្រី (Female)</option>
                  </select>
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #1e293b;">ថ្ងៃខែឆ្នាំកំណើត</label>
                  <input type="date" id="selfRegDob" class="form-control" value="2007-01-01" style="font-size: 0.88rem;">
                </div>
              </div>

              <!-- Phone & Shift -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #1e293b;">លេខទូរស័ព្ទ <span style="color: #ef4444;">*</span></label>
                  <input type="tel" id="selfRegPhone" class="form-control font-mono" placeholder="012 345 678" required style="font-size: 0.9rem;">
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #1e293b;">វេនសិក្សាដែលចង់រៀន <span style="color: #ef4444;">*</span></label>
                  <select id="selfRegShift" class="form-control" style="font-size: 0.88rem;">
                    <option value="ព្រឹក">វេនព្រឹក (08:00 - 09:00)</option>
                    <option value="ថ្ងៃ">វេនថ្ងៃ (15:00 - 16:00)</option>
                    <option value="រសៀល">វេនរសៀល (17:00 - 18:00)</option>
                  </select>
                </div>
              </div>

              <!-- Course Selection -->
              <div class="form-group" style="margin-bottom: 14px;">
                <label style="font-size: 0.82rem; font-weight: 700; color: #1e293b;">វគ្គកុំព្យូទ័រចាប់ផ្តើមរៀន</label>
                <select id="selfRegCourse" class="form-control" style="font-size: 0.88rem;">
                  <option value="Typing">វគ្គទី ១: ហាត់វាយអត្ថបទខ្មែរ-អង់គ្លេស (Typing)</option>
                  <option value="Microsoft Word">វគ្គទី ២: រៀបចំឯកសាររដ្ឋបាល (Microsoft Word)</option>
                  <option value="Microsoft Excel">វគ្គទី ៣: តារាងគណនាលុយ & រូបមន្ត (Microsoft Excel)</option>
                  <option value="Microsoft PowerPoint">វគ្គទី ៤: បទបង្ហាញស្លាយឌីជីថល (PowerPoint)</option>
                </select>
              </div>

              <!-- Address -->
              <div class="form-group" style="margin-bottom: 20px;">
                <label style="font-size: 0.82rem; font-weight: 700; color: #1e293b;">អាសយដ្ឋានបច្ចុប្បន្ន (ភូមិ/ឃុំ/ស្រុក/ខេត្ត)</label>
                <input type="text" id="selfRegAddress" class="form-control" placeholder="ឧ. ភូមិកំពង់បាយ ខេត្តកំពត" value="ខេត្តកំពត" style="font-size: 0.88rem;">
              </div>

              <!-- Submit Button -->
              <button type="submit" id="btnSubmitOnlineSelfReg" class="btn-primary" style="width: 100%; padding: 12px; font-size: 1rem; font-weight: 700; background: linear-gradient(135deg, #10b981, #059669); border: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); justify-content: center;">
                <i class="fa-solid fa-paper-plane"></i> <span>ដាក់ពាក្យចុះឈ្មោះឥឡូវនេះ</span>
              </button>
            </form>
          </div>

          <!-- Footer Contact Info -->
          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 20px; font-size: 0.78rem; color: #64748b; text-align: center; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <span><i class="fa-solid fa-phone" style="color: #10b981;"></i> ទំនាក់ទំនង៖ ${branding.schoolPhone}</span>
            <a href="#" onclick="history.replaceState(null, '', window.location.pathname); location.reload();" style="color: #4338ca; font-weight: 700; text-decoration: none;">ចូលប្រព័ន្ធគ្រូ ➔</a>
          </div>

        </div>
      </div>
    `;

    // Connect Events for self-registration form
    const nameKhInput = document.getElementById("selfRegNameKh");
    const nameEnInput = document.getElementById("selfRegNameEn");
    const phoneInput = document.getElementById("selfRegPhone");
    const avatarFile = document.getElementById("selfRegAvatarFile");
    const avatarPreview = document.getElementById("selfRegAvatarPreview");
    const avatarPlace = document.getElementById("selfRegAvatarPlace");
    const avatarDataInput = document.getElementById("selfRegAvatarData");
    const form = document.getElementById("onlineSelfRegisterForm");

    if (nameKhInput && nameEnInput) {
      nameKhInput.addEventListener("input", (e) => {
        if (typeof TeacherToolsService !== "undefined") {
          nameEnInput.value = TeacherToolsService.transliterateKhmerToLatin(e.target.value);
        }
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("blur", (e) => {
        if (typeof TeacherToolsService !== "undefined") {
          e.target.value = TeacherToolsService.formatPhoneNumber(e.target.value);
        }
      });
    }

    if (avatarFile) {
      avatarFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async (evt) => {
            try {
              const cropped = (typeof TeacherToolsService !== "undefined")
                ? await TeacherToolsService.cropToPassportAspectRatio(evt.target.result)
                : evt.target.result;
              if (avatarDataInput) avatarDataInput.value = cropped;
              if (avatarPreview) { avatarPreview.src = cropped; avatarPreview.style.display = "block"; }
              if (avatarPlace) avatarPlace.style.display = "none";
            } catch(err){}
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById("btnSubmitOnlineSelfReg");
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងបញ្ជូន...`;
        }

        try {
          const regData = {
            NameKh: nameKhInput?.value.trim() || "",
            NameEn: nameEnInput?.value.trim() || "",
            Gender: document.getElementById("selfRegGender")?.value || "ប្រុស",
            DOB: document.getElementById("selfRegDob")?.value || "",
            Phone: phoneInput?.value.trim() || "",
            Shift: document.getElementById("selfRegShift")?.value || "ព្រឹក",
            Course: document.getElementById("selfRegCourse")?.value || "Typing",
            Address: document.getElementById("selfRegAddress")?.value.trim() || "",
            Avatar: avatarDataInput?.value || ""
          };

          if (typeof TeacherToolsService !== "undefined") {
            await TeacherToolsService.addSelfRegistrationRequest(regData);
          }

          const container = document.getElementById("selfRegFormContainer");
          if (container) {
            container.innerHTML = `
              <div style="text-align: center; padding: 30px 14px;">
                <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #059669; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 16px auto;">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3 style="margin: 0 0 10px 0; font-size: 1.25rem; font-weight: 800; color: #065f46;">បានដាក់ពាក្យដោយជោគជ័យ!</h3>
                <p style="font-size: 0.9rem; color: #4b5563; line-height: 1.7; margin-bottom: 20px;">
                  សាលា <strong>${branding.schoolNameKh}</strong> បានទទួលពាក្យចុះឈ្មោះរបស់ប្អូន <strong>${regData.NameKh}</strong> រួចរាល់ហើយ។ លោកគ្រូនឹងពិនិត្យ និងរៀបចំកន្លែងអង្គុយម៉ាស៊ីនកុំព្យូទ័រជូនប្អូនក្នុងពេលឆាប់ៗ។
                </p>
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px; font-size: 0.84rem; color: #166534; margin-bottom: 24px;">
                  <div>• វគ្គសិក្សា៖ <strong>${regData.Course}</strong></div>
                  <div>• វេនសិក្សា៖ <strong>វេន${regData.Shift}</strong></div>
                  <div>• លេខទាក់ទង៖ <strong>${regData.Phone}</strong></div>
                </div>
                <button type="button" class="btn-secondary" onclick="location.reload();" style="width: 100%; justify-content: center;">
                  <i class="fa-solid fa-arrow-left"></i> <span>ត្រឡប់ទៅទំព័រដើម</span>
                </button>
              </div>
            `;
          }
        } catch(err) {
          alert("កំហុសក្នុងការចុះឈ្មោះ៖ " + err.message);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>ដាក់ពាក្យចុះឈ្មោះឥឡូវនេះ</span>`;
          }
        }
      });
    }
  },

  mountLoginScreen(role = null) {
    const appEl = document.getElementById("app");
    const modalRoot = document.getElementById("modalRoot");
    if (modalRoot) modalRoot.innerHTML = "";
    if (appEl && typeof LoginView !== "undefined") {
      if (role) LoginView.currentRole = role;
      appEl.innerHTML = LoginView.render();
      LoginView.initEvents();
    }
  },

  async handleLogin(username, password, rememberMe) {
    const user = await AuthService.login(username, password, rememberMe);
    this.state.currentUser = user;
    this.showToast(`🎉 ស្វាគមន៍ ${user.nameKh} មកកាន់ TIS Lab Computer!`, "success");
    this.triggerConfetti();

    this.mountDOM();
    this.bindEvents();
    this.setupAutoSync();
    await this.loadData();
  },

  async handleStudentLogin(idOrPhone, pin, rememberMe) {
    const studentUser = await AuthService.loginStudent(idOrPhone, pin, rememberMe);
    this.state.currentUser = studentUser;
    this.showToast(`🎉 ស្វាគមន៍ប្អូន ${studentUser.nameKh} មកកាន់ប្រព័ន្ធគណនីសិស្ស!`, "success");
    this.triggerConfetti();

    this.mountDOM();
    this.bindEvents();
  },

  handleLogout(skipConfirm = false) {
    const user = typeof AuthService !== "undefined" ? AuthService.getCurrentUser() : null;
    const isStudent = typeof AuthService !== "undefined" && AuthService.isStudent();
    const displayName = user ? user.nameKh : (isStudent ? "ប្អូន" : "លោកគ្រូ/អ្នកគ្រូ");
    
    let confirmed = true;
    if (!skipConfirm) {
      try {
        confirmed = confirm(isStudent 
          ? `តើប្អូន ${displayName} ពិតជាចង់ចាកចេញពីគណនីសិស្សមែនទេ?` 
          : `តើ${displayName} ពិតជាចង់ចាកចេញពីប្រព័ន្ធមែនទេ?`);
      } catch (e) {
        confirmed = true;
      }
    }

    if (confirmed) {
      if (typeof AuthService !== "undefined") {
        AuthService.logout();
      }
      this.state.currentUser = null;
      this.showToast("បានចាកចេញពីប្រព័ន្ធដោយជោគជ័យ!", "info");
      this.mountLoginScreen();
    }
  },

  // Mount modular components and views into the DOM shell
  mountDOM() {
    const appEl = document.getElementById("app");
    const modalRoot = document.getElementById("modalRoot");
    const isStudent = typeof AuthService !== "undefined" && AuthService.isStudent();

    if (appEl) {
      if (isStudent) {
        appEl.innerHTML = `
          <!-- Student Portal Shell (No Teacher Admin Sidebar) -->
          <main class="main-wrapper student-main-wrapper" style="margin-left: 0; width: 100%; min-height: 100vh;">
            <!-- Top Header Component -->
            ${HeaderComponent.render()}

            <!-- Dynamic Student Portal Body -->
            <div class="content-body student-content-body" style="max-width: 1300px; margin: 0 auto; padding: 24px;">
              ${typeof StudentPortalView !== "undefined" ? StudentPortalView.render() : '<p>កំពុងដំណើរការ...</p>'}
            </div>
          </main>
        `;
      } else {
        appEl.innerHTML = `
          <!-- Sidebar Navigation Component -->
          ${SidebarComponent.render()}

          <!-- Main Content Area -->
          <main class="main-wrapper">
            <!-- Top Header Component -->
            ${HeaderComponent.render()}

            <!-- Cloud Status Notification Banner -->
            <div id="cloudBannerNotice" class="cloud-banner-notice"></div>

            <!-- Dynamic Views Body -->
            <div class="content-body">
              ${DashboardView.render()}
              ${RegisterView.render()}
              ${DirectoryView.render()}
              ${typeof DroppedStudentsView !== "undefined" ? DroppedStudentsView.render() : ""}
              ${typeof GraduatedStudentsView !== "undefined" ? GraduatedStudentsView.render() : ""}
              ${typeof TeachersView !== "undefined" ? TeachersView.render() : ""}
              ${typeof ClassesView !== "undefined" ? ClassesView.render() : ""}
              ${typeof SubjectsView !== "undefined" ? SubjectsView.render() : ""}
              ${AttendanceView.render()}
              ${typeof TimetableLabView !== "undefined" ? TimetableLabView.render() : ""}
              ${typeof DurationView !== "undefined" ? DurationView.render() : ""}
              ${ExamsView.render()}
              ${typeof RankingsView !== "undefined" ? RankingsView.render() : ""}
              ${typeof IdCardsView !== "undefined" ? IdCardsView.render() : ""}
              ${typeof DocumentsView !== "undefined" ? DocumentsView.render() : ""}
              ${typeof FeesView !== "undefined" ? FeesView.render() : ""}
              ${typeof CertificatesView !== "undefined" ? CertificatesView.render() : ""}
              ${typeof ReportsView !== "undefined" ? ReportsView.render() : ""}
              ${typeof ResourcesView !== "undefined" ? ResourcesView.render() : ""}
              ${SettingsView.render()}
            </div>
          </main>
        `;
      }
    }

    if (modalRoot) {
      modalRoot.innerHTML = ModalsComponent.render();
    }
  },

  // Bind all event handlers from components & views
  bindEvents() {
    const isStudent = typeof AuthService !== "undefined" && AuthService.isStudent();

    HeaderComponent.initEvents();
    ModalsComponent.initEvents();

    if (isStudent) {
      if (typeof StudentPortalView !== "undefined") {
        StudentPortalView.initEvents();
      }
      if (typeof ExamsView !== "undefined") {
        ExamsView.initEvents();
      }
    } else {
      SidebarComponent.initEvents();
      DashboardView.initEvents();
      RegisterView.initEvents();
      DirectoryView.initEvents();
      if (typeof DroppedStudentsView !== "undefined") DroppedStudentsView.initEvents();
      if (typeof GraduatedStudentsView !== "undefined") GraduatedStudentsView.initEvents();
      if (typeof TeachersView !== "undefined") TeachersView.initEvents();
      if (typeof ClassesView !== "undefined") ClassesView.initEvents();
      if (typeof SubjectsView !== "undefined") SubjectsView.initEvents();
      AttendanceView.initEvents();
      if (typeof TimetableLabView !== "undefined") TimetableLabView.initEvents();
      if (typeof DurationView !== "undefined") DurationView.initEvents();
      ExamsView.initEvents();
      if (typeof RankingsView !== "undefined") RankingsView.initEvents();
      if (typeof IdCardsView !== "undefined") IdCardsView.initEvents();
      if (typeof DocumentsView !== "undefined") DocumentsView.initEvents();
      if (typeof FeesView !== "undefined") FeesView.initEvents();
      if (typeof CertificatesView !== "undefined") CertificatesView.initEvents();
      if (typeof ReportsView !== "undefined") ReportsView.initEvents();
      if (typeof ResourcesView !== "undefined") ResourcesView.initEvents();
      SettingsView.initEvents();
    }
  },

  // Dynamic Background Polling for Firebase Realtime Database changes
  setupAutoSync() {
    // Check for updates from Firebase every 60 seconds
    setInterval(() => {
      if (StudentAPI.isCloudConnected() && !StudentAPI._isFetching) {
        this.loadData(true, true); // silent background fetch
      }
    }, 60000);
  },

  // Update Dynamic Cloud Notice Banner (Kept clean & hidden per user request)
  updateCloudBanner() {
    const banner = document.getElementById("cloudBannerNotice");
    if (!banner) return;
    banner.innerHTML = "";
    banner.style.display = "none";
  },

  // Load and sync data dynamically from Google Sheets
  async loadData(forceRefresh = true, silent = false) {
    if (!silent) this.showLoader(true);
    try {
      this.state.students = await StudentAPI.getStudents(forceRefresh);
      if (typeof StudentAPI !== "undefined" && StudentAPI.fetchAttendanceCloud) {
        await StudentAPI.fetchAttendanceCloud();
      }
      this.applyFiltersAndSearch();
      const idInputOnSync = document.getElementById("modalAddStudentIdInput");
      if (idInputOnSync) {
        idInputOnSync.value = this.getNextStudentId();
        const receiptInput = document.getElementById("enrollInputReceiptNo");
        if (receiptInput) receiptInput.value = `INV-2026-${String(idInputOnSync.value).replace(/\D/g, "").padStart(4, "0")}`;
      }
      DashboardView.update(this.state.students);
      DirectoryView.renderTable();
      if (typeof AttendanceView !== "undefined" && AttendanceView.renderTable) {
        // Only re-render if user is not actively on attendance view during silent background sync
        if (!silent || this.state.currentTab !== "attendance") {
          AttendanceView.renderTable();
        }
      }
      if (typeof StudentAPI !== "undefined" && StudentAPI.fetchExamsCloud) {
        await StudentAPI.fetchExamsCloud();
      }
      if (typeof ExamsView !== "undefined" && ExamsView.renderTable) {
        ExamsView.renderTable();
      }
      if (typeof StudentAPI !== "undefined" && StudentAPI.fetchFeesCloud) {
        await StudentAPI.fetchFeesCloud();
      }
      if (typeof FeesView !== "undefined" && FeesView.renderTable) {
        FeesView.renderTable();
      }
      if (typeof StudentAPI !== "undefined" && StudentAPI.fetchCertificatesCloud) {
        await StudentAPI.fetchCertificatesCloud();
      }
      if (typeof CertificatesView !== "undefined" && CertificatesView.renderTable) {
        CertificatesView.renderTable();
      }
      if (typeof DroppedStudentsView !== "undefined" && DroppedStudentsView.renderTable) {
        DroppedStudentsView.renderTable();
      }
      if (typeof GraduatedStudentsView !== "undefined" && GraduatedStudentsView.renderTable) {
        GraduatedStudentsView.renderTable();
      }
      this.updateSidebarCounters();
      HeaderComponent.updateCloudBadge(StudentAPI.isCloudConnected());
      this.updateCloudBanner();
      if (typeof AuthService !== "undefined" && AuthService.fetchTeachersCloud) {
        await AuthService.fetchTeachersCloud();
      }
    } catch (err) {
      if (!silent) this.showToast("កំហុសក្នុងការទាញយកទិន្នន័យ: " + err.message, "error");
    } finally {
      if (!silent) this.showLoader(false);
    }
  },

  // Navigation & View Routing
  switchTab(tabId) {
    this.state.currentTab = tabId;

    // Update nav links
    document.querySelectorAll(".nav-link").forEach(item => {
      if (item.getAttribute("data-tab") === tabId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    if (typeof SidebarComponent !== "undefined" && SidebarComponent.expandGroupForTab) {
      SidebarComponent.expandGroupForTab(tabId);
    }

    // Update active view
    document.querySelectorAll(".page-view").forEach(view => {
      view.classList.remove("active");
    });

    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
      targetView.classList.add("active");
    }

    if (tabId === "dashboard") {
      DashboardView.update(this.state.students);
    } else if (tabId === "register") {
      this.openAddStudentModal();
    } else if (tabId === "directory") {
      DirectoryView.renderTable();
    } else if (tabId === "dropped") {
      if (typeof DroppedStudentsView !== "undefined" && DroppedStudentsView.renderTable) {
        DroppedStudentsView.renderTable();
      }
    } else if (tabId === "graduated") {
      if (typeof GraduatedStudentsView !== "undefined" && GraduatedStudentsView.renderTable) {
        GraduatedStudentsView.renderTable();
      }
    } else if (tabId === "teachers") {
      if (typeof TeachersView !== "undefined" && TeachersView.renderTable) {
        TeachersView.renderTable();
      }
    } else if (tabId === "classes") {
      if (typeof ClassesView !== "undefined" && ClassesView.renderGrid) {
        ClassesView.renderGrid();
      }
    } else if (tabId === "subjects") {
      if (typeof SubjectsView !== "undefined" && SubjectsView.renderGrid) {
        SubjectsView.renderGrid();
      }
    } else if (tabId === "attendance") {
      AttendanceView.renderTable();
    } else if (tabId === "timetable") {
      if (typeof TimetableLabView !== "undefined") {
        const mount = document.getElementById("timetableContentMount");
        if (mount) {
          mount.innerHTML = typeof TimetableLabView.renderCurrentTab === "function" ? TimetableLabView.renderCurrentTab() : (TimetableLabView.activeTab === 'timetable' ? TimetableLabView.renderTimetableSection() : TimetableLabView.renderLabMapSection());
          TimetableLabView.initEvents();
        }
      }
    } else if (tabId === "duration") {
      if (typeof DurationView !== "undefined") DurationView.renderCards();
    } else if (tabId === "exams") {
      ExamsView.renderTable();
    } else if (tabId === "rankings") {
      if (typeof RankingsView !== "undefined" && RankingsView.renderRankings) {
        RankingsView.renderRankings();
      }
    } else if (tabId === "idcards") {
      if (typeof IdCardsView !== "undefined") {
        IdCardsView.populateStudentsDropdown();
        IdCardsView.renderLiveCard();
      }
    } else if (tabId === "documents") {
      if (typeof DocumentsView !== "undefined" && DocumentsView.renderGrid) {
        DocumentsView.renderGrid();
      }
    } else if (tabId === "fees") {
      if (typeof FeesView !== "undefined") FeesView.renderTable();
    } else if (tabId === "certificates") {
      if (typeof CertificatesView !== "undefined") CertificatesView.renderTable();
    } else if (tabId === "reports") {
      if (typeof ReportsView !== "undefined" && ReportsView.renderReport) {
        ReportsView.renderReport();
      }
    } else if (tabId === "resources") {
      if (typeof ResourcesView !== "undefined") {
        const container = document.getElementById("resourcesContentContainer");
        if (container) container.innerHTML = ResourcesView.renderResourcesGrid();
      }
    } else if (tabId === "settings") {
      if (typeof SettingsView !== "undefined" && SettingsView.refreshTeachersGrid) {
        SettingsView.refreshTeachersGrid();
      }
    }

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {}
  },

  // Refresh or re-render currently active view
  renderView() {
    this.switchTab(this.state.currentTab || "directory");
  },

  // Alias for viewStudentDetails
  showStudentDetail(studentId) {
    return this.viewStudentDetails(studentId);
  },

  // Navigate to Certificate View and preview certificate
  viewCertificate(certId, studentId) {
    this.switchTab("certificates");
    setTimeout(() => {
      if (typeof CertificatesView !== "undefined" && CertificatesView.previewCertificate) {
        CertificatesView.previewCertificate(certId || studentId);
      }
    }, 150);
  },

  // Update sidebar counter badges
  updateSidebarCounters() {
    const droppedBadge = document.getElementById("sidebarDroppedCount");
    if (droppedBadge && typeof DroppedStudentsView !== "undefined" && DroppedStudentsView.getDroppedStudents) {
      droppedBadge.textContent = `${DroppedStudentsView.getDroppedStudents().length}`;
    }
    const gradBadge = document.getElementById("sidebarGraduatedCount");
    if (gradBadge && typeof GraduatedStudentsView !== "undefined" && GraduatedStudentsView.getGraduatedStudents) {
      gradBadge.textContent = `${GraduatedStudentsView.getGraduatedStudents().length}`;
    }
  },

  // Calculate days studied and duration info for student (4-month course, calendar-based)
  getStudentDaysInfo(student) {
    const defaultMonths = APP_CONFIG.DEFAULT_COURSE_DURATION_MONTHS || 4;
    if (!student) {
      return {
        daysElapsed: 0, daysRemaining: 120, percent: 0, totalCourseDays: 120,
        startDate: "—", endDate: "—",
        monthsElapsed: 0, daysInMonthElapsed: 0,
        monthsRemaining: defaultMonths, daysInMonthRemaining: 0,
        durationLabel: `0ខែ 0ថ្ងៃ`,
        remainingLabel: `${defaultMonths}ខែ 0ថ្ងៃ`,
        totalLabel: `${defaultMonths}ខែ`
      };
    }
    const startStr = student.StartDate || student.CreatedAt || new Date().toISOString().split("T")[0];
    const startDate = new Date(startStr);
    const now = new Date();
    startDate.setHours(0, 0, 0, 0);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calculate end date: exact calendar months from start
    let endDate;
    if (student.EndDate) {
      endDate = new Date(student.EndDate);
      endDate.setHours(0, 0, 0, 0);
    } else {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + defaultMonths);
      endDate.setHours(0, 0, 0, 0);
    }

    // Total and elapsed in days
    const diffTime = today.getTime() - startDate.getTime();
    const daysElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const totalDiff = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const percent = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDiff) * 100)));

    // Calculate elapsed months + days (calendar-based)
    const calcMonthsDays = (fromDate, toDate) => {
      if (toDate <= fromDate) return { months: 0, days: 0 };
      let months = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
      if (toDate.getDate() < fromDate.getDate()) months--;
      months = Math.max(0, months);
      const tempDate = new Date(fromDate);
      tempDate.setMonth(tempDate.getMonth() + months);
      const days = Math.max(0, Math.floor((toDate.getTime() - tempDate.getTime()) / (1000 * 60 * 60 * 24)));
      return { months, days };
    };

    // Clamp "today" to endDate for elapsed calculation
    const clampedToday = today > endDate ? endDate : today;
    const elapsed = calcMonthsDays(startDate, clampedToday);

    // Remaining: from today to endDate
    const remaining = today >= endDate ? { months: 0, days: 0 } : calcMonthsDays(today, endDate);

    // Total course in months
    const totalMonths = calcMonthsDays(startDate, endDate);

    return {
      daysElapsed,
      daysRemaining,
      percent,
      totalCourseDays: totalDiff,
      startDate: startStr,
      endDate: endDate.toISOString().split("T")[0],
      monthsElapsed: elapsed.months,
      daysInMonthElapsed: elapsed.days,
      monthsRemaining: remaining.months,
      daysInMonthRemaining: remaining.days,
      durationLabel: `${elapsed.months}ខែ ${elapsed.days}ថ្ងៃ`,
      remainingLabel: `${remaining.months}ខែ ${remaining.days}ថ្ងៃ`,
      totalLabel: `${totalMonths.months}ខែ ${totalMonths.days > 0 ? totalMonths.days + 'ថ្ងៃ' : ''}`
    };
  },

  // Open attendance view and filter by student's course
  openAttendanceForStudent(studentId) {
    const student = this.state.students.find(s => String(s.ID).trim() === String(studentId).trim());
    this.switchTab("attendance");
    if (student && typeof AttendanceView !== "undefined" && AttendanceView.filters) {
      AttendanceView.filters.course = student.Course || "";
      const sel = document.getElementById("attFilterCourse");
      if (sel) sel.value = student.Course || "";
      AttendanceView.renderTable();
    }
  },

  // Search & Filter Algorithm
  applyFiltersAndSearch() {
    const query = this.state.searchQuery;
    const { grade, course, gender, shift, status } = this.state.filters;

    this.state.filteredStudents = this.state.students.filter(s => {
      const matchQuery = !query || 
        (s.NameKh && s.NameKh.toLowerCase().includes(query)) ||
        (s.NameEn && s.NameEn.toLowerCase().includes(query)) ||
        (s.ID && s.ID.toLowerCase().includes(query)) ||
        (s.Phone && s.Phone.includes(query)) ||
        (s.Address && s.Address.toLowerCase().includes(query));

      const matchGrade = !grade || (s.Grade && s.Grade.includes(grade));
      const matchCourse = !course || (s.Course && s.Course.toLowerCase().includes(course.toLowerCase()));
      const matchGender = !gender || s.Gender === gender;
      const matchShift = !shift || (s.Shift && s.Shift.includes(shift));
      const matchStatus = !status || (
        status === "New" ? this.isNewStudent(s) :
        status === "AtRisk" ? (typeof StudentAPI !== "undefined" && StudentAPI.getStudentAtRiskStatus(s.ID)?.isAtRisk === true) :
        s.Status === status
      );

      return matchQuery && matchGrade && matchCourse && matchGender && matchShift && matchStatus;
    });

    this.applySorting();
  },

  applySorting() {
    const { field, order } = this.state.sort;
    const factor = order === "asc" ? 1 : -1;

    this.state.filteredStudents.sort((a, b) => {
      // 1. Numeric ID Sorting (STU-1023 vs STU-1018)
      if (field === "ID") {
        const numA = parseInt((a.ID || "").replace(/\D/g, ""), 10) || 0;
        const numB = parseInt((b.ID || "").replace(/\D/g, ""), 10) || 0;
        if (numA !== numB) {
          return (numA - numB) * factor;
        }
      }

      // 2. Date/Timestamp Sorting
      if (field === "CreatedAt" || field === "StartDate") {
        const timeA = new Date(a[field] || a.CreatedAt || a.StartDate || 0).getTime();
        const timeB = new Date(b[field] || b.CreatedAt || b.StartDate || 0).getTime();
        if (timeA !== timeB) {
          return (timeA - timeB) * factor;
        }
      }

      // 3. General field string comparison
      const valA = (a[field] || "").toString().toLowerCase();
      const valB = (b[field] || "").toString().toLowerCase();
      const cmp = valA.localeCompare(valB, "km") * factor;
      if (cmp !== 0) return cmp;

      // Tie-breaker: Always place newly added student (highest numeric ID) at the top!
      const numA = parseInt((a.ID || "").replace(/\D/g, ""), 10) || 0;
      const numB = parseInt((b.ID || "").replace(/\D/g, ""), 10) || 0;
      return numB - numA;
    });

    // Update header icons
    document.querySelectorAll(".sortable-th").forEach(th => {
      const icon = th.querySelector(".sort-icon");
      if (th.getAttribute("data-sort") === field) {
        th.classList.add("active-sort");
        if (icon) {
          icon.className = `sort-icon fa-solid fa-arrow-${order === "asc" ? "up" : "down"}`;
        }
      } else {
        th.classList.remove("active-sort");
        if (icon) {
          icon.className = "sort-icon fa-solid fa-sort text-muted";
        }
      }
    });
  },

  getShiftLabel(shiftId) {
    const found = (APP_CONFIG.shifts || []).find(s => s.id === shiftId || s.label === shiftId);
    return found ? found.label : (shiftId || "—");
  },

  getCourseBadgeClass(courseName) {
    if (!courseName) return "";
    const c = courseName.toLowerCase();
    if (c.includes("typing")) return "badge-course-typing";
    if (c.includes("word")) return "badge-course-word";
    if (c.includes("excel")) return "badge-course-excel";
    if (c.includes("powerpoint")) return "badge-course-powerpoint";
    return "badge-course-english";
  },

  getCourseIcon(courseName) {
    if (!courseName) return "";
    const c = courseName.toLowerCase();
    if (c.includes("typing")) return '<i class="fa-solid fa-keyboard"></i>';
    if (c.includes("word")) return '<i class="fa-solid fa-file-word"></i>';
    if (c.includes("excel")) return '<i class="fa-solid fa-file-excel"></i>';
    if (c.includes("powerpoint")) return '<i class="fa-solid fa-file-powerpoint"></i>';
    return '<i class="fa-solid fa-language"></i>';
  },

  filterByCourse(courseKeyword) {
    this.switchTab("directory");
    this.state.filters.course = courseKeyword;
    const courseSelect = document.getElementById("filterCourse");
    if (courseSelect) {
      const matchingOpt = Array.from(courseSelect.options).find(opt => opt.value.toLowerCase().includes(courseKeyword.toLowerCase()));
      courseSelect.value = matchingOpt ? matchingOpt.value : "";
    }
    this.state.pagination.page = 1;
    this.applyFiltersAndSearch();
    DirectoryView.renderTable();
  },

  filterByGrade(gradeKeyword) {
    this.switchTab("directory");
    this.state.filters.grade = gradeKeyword;
    const gradeSelect = document.getElementById("filterGrade");
    if (gradeSelect) gradeSelect.value = gradeKeyword;
    this.state.pagination.page = 1;
    this.applyFiltersAndSearch();
    DirectoryView.renderTable();
  },

  changePage(page) {
    this.state.pagination.page = page;
    DirectoryView.renderTable();
  },

  // Enrollment Wizard State & Methods
  enrollStep: 1,

  getNextStudentId() {
    const local = (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents()) || [];
    const state = (this.state && Array.isArray(this.state.students)) ? this.state.students : [];
    const studentMap = {};
    [...local, ...state].forEach(s => {
      if (s && s.ID) {
        studentMap[String(s.ID).trim().toUpperCase()] = s;
      }
    });
    const students = Object.values(studentMap);
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";
    let maxIdNum = 0;
    students.forEach(s => {
      const num = (typeof StudentAPI !== "undefined" && StudentAPI.parseStudentIdNumber)
        ? StudentAPI.parseStudentIdNumber(s && s.ID ? s.ID : "")
        : parseInt((s && s.ID ? s.ID : "").replace(/\D/g, ""), 10) || 0;
      if (num > maxIdNum) maxIdNum = num;
    });
    return (typeof StudentAPI !== "undefined" && StudentAPI.formatStudentId)
      ? StudentAPI.formatStudentId(maxIdNum + 1, prefix)
      : `${prefix}${String(maxIdNum + 1).padStart(2, "0")}`;
  },

  refreshEnrollStudentId() {
    const nextId = this.getNextStudentId();
    const idInput = document.getElementById("modalAddStudentIdInput");
    if (idInput) idInput.value = nextId;
    const receiptInput = document.getElementById("enrollInputReceiptNo");
    if (receiptInput) receiptInput.value = `INV-2026-${String(nextId).replace(/\D/g, "").padStart(4, "0")}`;
    this.showToast(`បានកំណត់អត្តលេខបន្ទាប់: ${nextId}`, "info");
  },

  generateAutoPin() {
    // School standard: '123' + 5 random digits (e.g. 12378904)
    const randomFive = Math.floor(10000 + Math.random() * 90000);
    return `123${randomFive}`;
  },

  refreshEnrollPin() {
    const newPin = this.generateAutoPin();
    this.syncEnrollPin(newPin);
    this.showToast(`🔑 បានបង្កើតលេខកូដ Auto PIN ថ្មី: ${newPin}`, "info");
    return newPin;
  },

  async copyEnrollPin() {
    const pinInput = document.getElementById("modalAddStudentPinInput") || document.getElementById("modalAddStep2PinInput");
    const pinVal = pinInput ? pinInput.value.trim() : "";
    if (!pinVal) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(pinVal);
      } else {
        const temp = document.createElement("input");
        temp.value = pinVal;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      this.showToast(`📋 បានចម្លងលេខកូដ PIN (${pinVal}) រួចរាល់!`, "success");
    } catch (e) {
      this.showToast(`លេខកូដ PIN: ${pinVal}`, "info");
    }
  },

  syncEnrollPin(val) {
    const pinVal = String(val || "").trim();
    const p1 = document.getElementById("modalAddStudentPinInput");
    const p2 = document.getElementById("modalAddStep2PinInput");
    if (p1 && p1.value !== pinVal) p1.value = pinVal;
    if (p2 && p2.value !== pinVal) p2.value = pinVal;
  },

  refreshEditPin() {
    const newPin = this.generateAutoPin();
    const p = document.getElementById("modalEditStudentPinInput");
    if (p) p.value = newPin;
    this.showToast(`🔑 បានបង្កើតលេខកូដ PIN ថ្មី: ${newPin}`, "info");
    return newPin;
  },

  async copyEditPin() {
    const p = document.getElementById("modalEditStudentPinInput");
    const pinVal = p ? p.value.trim() : "";
    if (!pinVal) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(pinVal);
      } else {
        const temp = document.createElement("input");
        temp.value = pinVal;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      this.showToast(`📋 បានចម្លងលេខកូដ PIN (${pinVal}) រួចរាល់!`, "success");
    } catch (e) {
      this.showToast(`លេខកូដ PIN: ${pinVal}`, "info");
    }
  },

  isNewStudent(s) {
    if (!s) return false;
    if (s.isNew === false || s.IsNew === false) return false;
    if (s.isNew === true || s.IsNew === true || s.isNewStudent === true) return true;
    
    // Check registration date: within the last 7 days
    const dateStr = s.CreatedAt || s.registeredAt;
    if (dateStr) {
      const createdDate = new Date(dateStr);
      if (!isNaN(createdDate.getTime())) {
        const diffDays = (new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays >= -0.5 && diffDays <= 7) return true;
      }
    }
    return false;
  },

  dismissEnrollAlert() {
    const alert = document.getElementById("enrollWelcomeAlert");
    if (alert) alert.classList.add("hidden");
  },

  toggleEnrollFullscreen() {
    const card = document.querySelector("#addStudentModal .modal-card");
    const btn = document.getElementById("btnToggleEnrollFullscreen");
    if (card) {
      card.classList.toggle("windowed");
      const isWindowed = card.classList.contains("windowed");
      if (btn) {
        btn.innerHTML = isWindowed ? `<i class="fa-solid fa-expand"></i>` : `<i class="fa-solid fa-compress"></i>`;
        btn.title = isWindowed ? "ពង្រីកពេញអេក្រង់" : "បង្រួមផ្ទាំង";
      }
    }
  },

  goToEnrollStep(step) {
    // Validate before moving forward
    if (step > 1 && this.enrollStep === 1) {
      const nameKhInput = document.getElementById("enrollInputNameKh");
      if (!nameKhInput || !nameKhInput.value.trim()) {
        this.showToast("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!", "warning");
        if (nameKhInput) nameKhInput.focus();
        return;
      }
    }
    if (step > 2 && this.enrollStep === 2) {
      const courseSelect = document.getElementById("modalAddCourseSelect");
      if (!courseSelect || !courseSelect.value) {
        this.showToast("សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ!", "warning");
        if (courseSelect) courseSelect.focus();
        return;
      }
    }

    this.enrollStep = step;
    this.updateEnrollStepUI();
  },

  nextEnrollStep() {
    if (this.enrollStep < 3) {
      this.goToEnrollStep(this.enrollStep + 1);
    }
  },

  prevEnrollStep() {
    if (this.enrollStep > 1) {
      this.goToEnrollStep(this.enrollStep - 1);
    }
  },

  updateEnrollStepUI() {
    // 1. Update Stepper Nodes & Progress Bar
    const progressPercent = ((this.enrollStep - 1) / 2) * 100;
    const progressBar = document.getElementById("enrollStepperProgress");
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    for (let i = 1; i <= 3; i++) {
      const node = document.getElementById(`enrollStepNode${i}`);
      const section = document.getElementById(`enrollStepSection${i}`);
      if (node) {
        node.classList.remove("active", "completed");
        if (i === this.enrollStep) {
          node.classList.add("active");
        } else if (i < this.enrollStep) {
          node.classList.add("completed");
        }
      }
      if (section) {
        section.style.display = (i === this.enrollStep) ? "block" : "none";
      }
    }

    // 2. Update Subheader Title & Icon
    const subheaderIcon = document.getElementById("enrollSubheaderIcon");
    const subheaderText = document.getElementById("enrollSubheaderText");
    if (this.enrollStep === 1) {
      if (subheaderIcon) subheaderIcon.className = "fa-regular fa-user";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានអំពីសិស្ស";
    } else if (this.enrollStep === 2) {
      if (subheaderIcon) subheaderIcon.className = "fa-solid fa-graduation-cap";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានវគ្គសិក្សាកុំព្យូទ័រ";
    } else if (this.enrollStep === 3) {
      if (subheaderIcon) subheaderIcon.className = "fa-solid fa-file-invoice-dollar";
      if (subheaderText) subheaderText.textContent = "ព័ត៌មានថ្លៃសិក្សា និងការទូទាត់";
      this.calculateEnrollFees();
    }

    // 3. Update Footer Buttons
    const footerLeft = document.getElementById("enrollFooterLeft");
    const nextBtn = document.getElementById("btnEnrollNextStep");
    const submitBtn = document.getElementById("btnEnrollSubmit");

    if (footerLeft) {
      if (this.enrollStep === 1) {
        footerLeft.innerHTML = `
          <button type="button" class="btn-enroll-cancel" data-close-modal="addStudentModal">
            <i class="fa-solid fa-xmark"></i>
            <span>បោះបង់</span>
          </button>
        `;
      } else {
        footerLeft.innerHTML = `
          <button type="button" class="btn-enroll-prev" onclick="App.prevEnrollStep()">
            <i class="fa-solid fa-arrow-left"></i>
            <span>ថយក្រោយ</span>
          </button>
        `;
      }
    }

    if (nextBtn && submitBtn) {
      if (this.enrollStep === 1) {
        nextBtn.style.display = "inline-flex";
        nextBtn.innerHTML = `<span>បន្ទាប់: ព័ត៌មានការសិក្សា</span> <i class="fa-solid fa-arrow-right"></i>`;
        submitBtn.style.display = "none";
      } else if (this.enrollStep === 2) {
        nextBtn.style.display = "inline-flex";
        nextBtn.innerHTML = `<span>បន្ទាប់: ព័ត៌មានហិរញ្ញវត្ថុ</span> <i class="fa-solid fa-arrow-right"></i>`;
        submitBtn.style.display = "none";
      } else if (this.enrollStep === 3) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline-flex";
      }
    }
  },

  calculateEnrollFees() {
    const totalFeeInput = document.getElementById("enrollInputTotalFee");
    const displayTotalFee = document.getElementById("enrollDisplayTotalFee");
    const paidFeeInput = document.getElementById("enrollInputPaidFee");
    const displayBalance = document.getElementById("enrollDisplayBalance");
    const balanceCard = document.getElementById("enrollKpiBalanceCard");
    const statusSelect = document.getElementById("enrollSelectPaymentStatus");

    // Standard fee is $50.00
    const totalFee = 50;
    if (totalFeeInput) totalFeeInput.value = totalFee;
    if (displayTotalFee) displayTotalFee.textContent = `${totalFee.toFixed(2)}`;

    const paidFee = paidFeeInput ? (parseFloat(paidFeeInput.value) || 0) : 50;
    const balance = Math.max(0, totalFee - paidFee);

    if (displayBalance) displayBalance.textContent = `${balance.toFixed(2)}`;
    if (balanceCard) {
      if (balance === 0) {
        balanceCard.className = "enroll-kpi-card enroll-kpi-balance zero";
      } else {
        balanceCard.className = "enroll-kpi-card enroll-kpi-balance";
      }
    }

    if (statusSelect) {
      if (paidFee >= totalFee) {
        statusSelect.value = "Paid";
      } else if (paidFee > 0) {
        statusSelect.value = "Partial";
      } else {
        statusSelect.value = "Pending";
      }
    }
  },

  // Open Add Student Popup Modal
  openAddStudentModal() {
    const form = document.getElementById("modalAddStudentForm");
    if (form) {
      form.reset();
    }
    const avatarPreview = document.getElementById("modalAddAvatarPreview");
    if (avatarPreview) {
      avatarPreview.src = "";
      avatarPreview.style.display = "none";
    }
    const placeholder = document.getElementById("enrollAvatarPlaceholder");
    if (placeholder) {
      placeholder.style.display = "flex";
    }
    const avatarInput = document.getElementById("modalAddAvatarInput");
    if (avatarInput) {
      avatarInput.value = "";
    }
    const enrollNameEnInput = document.getElementById("enrollInputNameEn");
    if (enrollNameEnInput) {
      enrollNameEnInput.value = "";
      enrollNameEnInput.dataset.manualEdited = "";
    }

    // Reset alert notice
    const alert = document.getElementById("enrollWelcomeAlert");
    if (alert) alert.classList.remove("hidden");

    // Reset Next Student ID
    const nextId = this.getNextStudentId();
    const idInput = document.getElementById("modalAddStudentIdInput");
    if (idInput) idInput.value = nextId;
    const receiptInput = document.getElementById("enrollInputReceiptNo");
    if (receiptInput) receiptInput.value = `INV-2026-${String(nextId).replace(/\D/g, "").padStart(4, "0")}`;

    // Auto-generate fresh Student PIN (123 + 5 random digits)
    const autoPin = this.generateAutoPin();
    this.syncEnrollPin(autoPin);

    // Save previous tab and set register tab as active
    if (this.state.currentTab !== "register") {
      this.state.previousTab = this.state.currentTab;
    }
    this.state.currentTab = "register";
    document.querySelectorAll(".nav-link").forEach(item => {
      if (item.getAttribute("data-tab") === "register") {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Reset step to 1
    this.enrollStep = 1;
    this.updateEnrollStepUI();

    ModalsComponent.open("addStudentModal");
  },

  // Handle Modal Add Student Submission
  async handleModalAddStudentSubmit(form) {
    const submitBtn = document.getElementById("btnEnrollSubmit") || form.querySelector("button[type='submit']");
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុកក្នុង Firebase...`;
      }

      const formData = new FormData(form);
      const studentId = formData.get("studentId")?.trim() || document.getElementById("modalAddStudentIdInput")?.value?.trim() || this.getNextStudentId();
      const pinVal = formData.get("pin")?.trim() || document.getElementById("modalAddStudentPinInput")?.value?.trim() || document.getElementById("modalAddStep2PinInput")?.value?.trim() || this.generateAutoPin();
      const rawNameKh = formData.get("nameKh")?.trim() || "";
      let rawNameEn = formData.get("nameEn")?.trim() || "";
      if ((!rawNameEn || /[\u1780-\u17FF]/.test(rawNameEn)) && rawNameKh) {
        if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin) {
          rawNameEn = TeacherToolsService.transliterateKhmerToLatin(rawNameKh);
        } else if (typeof StudentAPI !== "undefined" && StudentAPI.transliterateKhmerToLatin) {
          rawNameEn = StudentAPI.transliterateKhmerToLatin(rawNameKh);
        }
      }
      const studentData = {
        ID: studentId,
        NameKh: rawNameKh,
        NameEn: rawNameEn,
        NameCh: formData.get("nameCh")?.trim() || "",
        Gender: formData.get("gender") || "ប្រុស",
        DOB: formData.get("dob") || "",
        Nationality: formData.get("nationality")?.trim() || "ខ្មែរ",
        Phone: formData.get("phone")?.trim() || "",
        EmergencyPhone: formData.get("emergencyPhone")?.trim() || "",
        HealthNotes: formData.get("healthNotes")?.trim() || "",
        Address: formData.get("address")?.trim() || "ខេត្តកំពត",
        CurrentAddress: formData.get("currentAddress")?.trim() || "",
        Grade: "ថ្នាក់កុំព្យូទ័រ",
        Course: formData.get("course")?.trim() || "Typing",
        Shift: formData.get("shift") || "ព្រឹក",
        Status: formData.get("status") || "Active",
        StartDate: formData.get("startDate") || new Date().toISOString().split("T")[0],
        EndDate: formData.get("endDate") || "",
        PIN: pinVal,
        pin: pinVal,
        isNew: true,
        IsNew: true,
        isNewStudent: true,
        Avatar: formData.get("avatar")?.trim() || document.getElementById("modalAddAvatarPreview")?.src || "",
        CreatedAt: new Date().toISOString()
      };

      if (!studentData.NameKh) {
        this.goToEnrollStep(1);
        throw new Error("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!");
      }
      if (!studentData.Course) {
        this.goToEnrollStep(2);
        throw new Error("សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ!");
      }

      const created = await StudentAPI.createStudent(studentData);

      // Record fee in StudentAPI and sync to Firebase
      try {
        const totalAmount = parseFloat(formData.get("totalFee")) || 50;
        const paidAmount = parseFloat(formData.get("paidFee")) || 50;
        const fees = StudentAPI.getAllFees();
        fees[created.ID] = {
          studentId: created.ID,
          studentNameKh: created.NameKh,
          studentNameEn: created.NameEn || "",
          course: created.Course || "Typing",
          totalAmount: totalAmount,
          paidAmount: paidAmount,
          discount: 0,
          balance: Math.max(0, totalAmount - paidAmount),
          status: formData.get("paymentStatus") || (paidAmount >= totalAmount ? "Paid" : "Partial"),
          receiptNo: formData.get("receiptNo") || `INV-2026-${String(created.ID).replace(/\D/g, "").padStart(4, "0")}`,
          date: created.StartDate || new Date().toISOString().split("T")[0],
          paymentMethod: formData.get("paymentMethod") || "ABA KHQR",
          note: formData.get("paymentNote") || "បង់ថ្លៃសិក្សាពេលចុះឈ្មោះ",
          updatedAt: new Date().toISOString()
        };
        StudentAPI.saveAllFees(fees);
        if (StudentAPI.isCloudConnected()) {
          firebase.database().ref(`fees/${created.ID}`).set(fees[created.ID]).catch(e => console.warn(e));
        }
      } catch (fe) {
        console.warn("Fee record notice:", fe);
      }

      this.showToast(`បានបញ្ចូលទិន្នន័យសិស្ស ${created.NameKh} (${created.ID}) ជោគជ័យ!`, "success");
      this.triggerConfetti();

      // Trigger Telegram notification for new student enrollment
      if (typeof TelegramService !== "undefined") {
        const teacher = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) ? AuthService.getCurrentUser().nameKh : null;
        TelegramService.notifyNewStudent(created, teacher);
      }

      ModalsComponent.close("addStudentModal");
      form.reset();

      // Ensure sort is newest first (ID desc) so newly added student is right at the top
      this.state.sort.field = "ID";
      this.state.sort.order = "desc";
      this.state.pagination.page = 1;

      // Refresh data dynamically
      await this.loadData(false);
    } catch (err) {
      this.showToast(err.message || "មានបញ្ហាក្នុងការរក្សាទុក!", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  },

  // Auto-Generate Latin Name Helpers for Forms
  autoGenerateEnrollLatinName() {
    const nameKh = document.getElementById("enrollInputNameKh")?.value?.trim();
    const nameEnInput = document.getElementById("enrollInputNameEn");
    if (!nameKh) {
      this.showToast("សូមបញ្ចូលឈ្មោះជាភាសាខ្មែរជាមុនសិន!", "warning");
      return;
    }
    const latin = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin)
      ? TeacherToolsService.transliterateKhmerToLatin(nameKh)
      : (typeof StudentAPI !== "undefined" ? StudentAPI.transliterateKhmerToLatin(nameKh) : "");
    if (nameEnInput) {
      nameEnInput.value = latin;
      nameEnInput.dataset.manualEdited = "true";
    }
    this.showToast(`✨ បានបំប្លែងឈ្មោះឡាតាំង៖ ${latin}`, "success");
  },

  autoGenerateEditLatinName() {
    const nameKh = document.getElementById("editInputNameKh")?.value?.trim();
    const nameEnInput = document.getElementById("editInputNameEn");
    if (!nameKh) {
      this.showToast("សូមបញ្ចូលឈ្មោះជាភាសាខ្មែរជាមុនសិន!", "warning");
      return;
    }
    const latin = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin)
      ? TeacherToolsService.transliterateKhmerToLatin(nameKh)
      : (typeof StudentAPI !== "undefined" ? StudentAPI.transliterateKhmerToLatin(nameKh) : "");
    if (nameEnInput) {
      nameEnInput.value = latin;
      nameEnInput.dataset.manualEdited = "true";
    }
    this.showToast(`✨ បានបំប្លែងឈ្មោះឡាតាំង៖ ${latin}`, "success");
  },

  autoGenerateRegisterLatinName() {
    const nameKh = document.getElementById("regNameKh")?.value?.trim();
    const nameEnInput = document.getElementById("regNameEn") || document.querySelector('#studentForm input[name="nameEn"]');
    if (!nameKh) {
      this.showToast("សូមបញ្ចូលឈ្មោះជាភាសាខ្មែរជាមុនសិន!", "warning");
      return;
    }
    const latin = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin)
      ? TeacherToolsService.transliterateKhmerToLatin(nameKh)
      : (typeof StudentAPI !== "undefined" ? StudentAPI.transliterateKhmerToLatin(nameKh) : "");
    if (nameEnInput) {
      nameEnInput.value = latin;
      nameEnInput.dataset.manualEdited = "true";
    }
    this.showToast(`✨ បានបំប្លែងឈ្មោះឡាតាំង៖ ${latin}`, "success");
  },

  // Batch Auto-Generate Latin Names for all students without a valid Latin name
  async autoFixAllMissingLatinNames(showFeedback = true) {
    if (!this.state.students || this.state.students.length === 0) {
      if (showFeedback) this.showToast("មិនមានទិន្នន័យសិស្សនៅក្នុងប្រព័ន្ធឡើយ!", "warning");
      return 0;
    }

    let updatedCount = 0;
    const updates = {};
    const studentsToSave = [...this.state.students];

    studentsToSave.forEach(s => {
      const nameEn = (s.NameEn || s.nameEn || "").trim();
      if ((!nameEn || /[\u1780-\u17FF]/.test(nameEn)) && s.NameKh) {
        const transliterated = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin)
          ? TeacherToolsService.transliterateKhmerToLatin(s.NameKh)
          : (typeof StudentAPI !== "undefined" ? StudentAPI.transliterateKhmerToLatin(s.NameKh) : "");
        if (transliterated && transliterated !== nameEn) {
          s.NameEn = transliterated;
          s.nameEn = transliterated;
          updates[`students/${s.ID}`] = s;
          updatedCount++;
        }
      }
    });

    if (updatedCount > 0) {
      StudentAPI.saveLocalStudents(studentsToSave);
      this.state.students = studentsToSave;
      this.applyFiltersAndSearch();

      if (StudentAPI.isCloudConnected()) {
        try {
          await firebase.database().ref().update(updates);
          console.log(`✅ បាន Sync ឈ្មោះឡាតាំង ${updatedCount} នាក់ ទៅកាន់ Firebase RTDB`);
        } catch (err) {
          console.warn("Firebase Latin name update error:", err);
        }
      }

      if (typeof DirectoryView !== "undefined" && DirectoryView.renderTable) DirectoryView.renderTable();
      if (typeof DashboardView !== "undefined" && DashboardView.update) DashboardView.update(this.state.students);
      if (typeof IdCardsView !== "undefined" && IdCardsView.populateStudentsDropdown) IdCardsView.populateStudentsDropdown();

      if (showFeedback) {
        this.showToast(`✨ បានបង្កើតឈ្មោះជាអក្សរឡាតាំង (Auto Latin) ជូនសិស្សចំនួន ${updatedCount} នាក់ដោយជោគជ័យ!`, "success");
      }
    } else {
      if (showFeedback) {
        this.showToast(`✅ សិស្សទាំងអស់ (${this.state.students.length} នាក់) មានឈ្មោះជាអក្សរឡាតាំងរួចរាល់ហើយ!`, "info");
      }
    }

    return updatedCount;
  },

  // Student CRUD Operations
  async handleRegisterFormSubmit(form) {
    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnHtml = submitBtn.innerHTML;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុក...`;

      const formData = new FormData(form);
      const studentPin = formData.get("pin")?.trim() || this.generateAutoPin();
      const rawNameKh = formData.get("nameKh")?.trim() || "";
      let rawNameEn = formData.get("nameEn")?.trim() || "";
      if ((!rawNameEn || /[\u1780-\u17FF]/.test(rawNameEn)) && rawNameKh) {
        if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin) {
          rawNameEn = TeacherToolsService.transliterateKhmerToLatin(rawNameKh);
        } else if (typeof StudentAPI !== "undefined" && StudentAPI.transliterateKhmerToLatin) {
          rawNameEn = StudentAPI.transliterateKhmerToLatin(rawNameKh);
        }
      }
      const studentData = {
        ID: "",
        NameKh: rawNameKh,
        NameEn: rawNameEn,
        Gender: formData.get("gender") || "ប្រុស",
        Grade: "ថ្នាក់កុំព្យូទ័រ",
        Phone: formData.get("phone")?.trim() || "",
        Course: formData.get("course")?.trim() || "Typing",
        Shift: formData.get("shift") || "ព្រឹក",
        Status: formData.get("status") || "Active",
        StartDate: formData.get("startDate") || new Date().toISOString().split("T")[0],
        EndDate: formData.get("endDate") || "",
        Address: formData.get("address")?.trim() || "ខេត្តកំពត",
        PIN: studentPin,
        pin: studentPin,
        isNew: true,
        IsNew: true,
        isNewStudent: true,
        Avatar: formData.get("avatar")?.trim() || document.getElementById("avatarPreview")?.src || "",
        CreatedAt: new Date().toISOString()
      };

      if (!studentData.NameKh) {
        throw new Error("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!");
      }
      if (!studentData.Course) {
        throw new Error("សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ!");
      }

      const created = await StudentAPI.createStudent(studentData);
      this.showToast(`បានចុះឈ្មោះសិស្ស ${created.NameKh} (${created.ID}) ជោគជ័យ!`, "success");
      this.triggerConfetti();

      // Trigger Telegram notification for new student enrollment
      if (typeof TelegramService !== "undefined") {
        const teacher = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) ? AuthService.getCurrentUser().nameKh : null;
        TelegramService.notifyNewStudent(created, teacher);
      }

      RegisterView.reset();

      // Ensure sort is newest first (ID desc) so newly added student is right at the top
      this.state.sort.field = "ID";
      this.state.sort.order = "desc";
      this.state.pagination.page = 1;

      await this.loadData(false);
    } catch (err) {
      this.showToast(err.message || "មានបញ្ហាក្នុងការរក្សាទុក!", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  },

  async handleEditFormSubmit(form) {
    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnHtml = submitBtn.innerHTML;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុក...`;

      const formData = new FormData(form);
      const rawNameKh = formData.get("nameKh")?.trim() || "";
      let rawNameEn = formData.get("nameEn")?.trim() || "";
      if ((!rawNameEn || /[\u1780-\u17FF]/.test(rawNameEn)) && rawNameKh) {
        if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin) {
          rawNameEn = TeacherToolsService.transliterateKhmerToLatin(rawNameKh);
        } else if (typeof StudentAPI !== "undefined" && StudentAPI.transliterateKhmerToLatin) {
          rawNameEn = StudentAPI.transliterateKhmerToLatin(rawNameKh);
        }
      }
      const studentData = {
        ID: formData.get("id")?.trim(),
        NameKh: rawNameKh,
        NameEn: rawNameEn,
        Gender: formData.get("gender") || "ប្រុស",
        DOB: formData.get("dob") || "",
        Nationality: formData.get("nationality")?.trim() || "ខ្មែរ",
        Phone: formData.get("phone")?.trim() || "",
        HealthNotes: formData.get("healthNotes")?.trim() || "",
        Grade: "ថ្នាក់កុំព្យូទ័រ",
        Course: formData.get("course")?.trim() || "Typing",
        Shift: formData.get("shift") || "ព្រឹក",
        Status: formData.get("status") || "Active",
        StartDate: formData.get("startDate") || formData.get("createdAt") || new Date().toISOString().split("T")[0],
        EndDate: formData.get("endDate") || "",
        Address: formData.get("address")?.trim() || "ខេត្តកំពត",
        PIN: formData.get("pin")?.trim() || "123",
        Avatar: formData.get("avatar")?.trim() || "",
        CreatedAt: formData.get("createdAt") || new Date().toISOString().split("T")[0]
      };

      if (!studentData.NameKh) {
        this.goToEditStep(1);
        throw new Error("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ!");
      }
      if (!studentData.Course) {
        this.goToEditStep(2);
        throw new Error("សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ!");
      }

      await StudentAPI.updateStudent(studentData);
      this.showToast("បានកែប្រែទិន្នន័យសិស្សដោយជោគជ័យ!", "success");
      ModalsComponent.close("editModal");
      await this.loadData(false);
    } catch (err) {
      this.showToast(err.message || "មានកំហុសក្នុងការកែប្រែ!", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  },

  openStudentDetailsModal(studentId) {
    this.viewStudentDetails(studentId);
  },

  viewStudentDetails(studentId) {
    const student = this.state.students.find(s => String(s.ID).trim() === String(studentId).trim());
    if (!student) return;

    this.state.selectedStudent = student;

    // 1. Top Profile Summary Card
    const profAvatar = document.getElementById("profileHeaderAvatar");
    if (profAvatar) profAvatar.src = student.Avatar || this.getDefaultAvatar(student.Gender);

    const profName = document.getElementById("profileHeaderNameKh");
    if (profName) {
      if (this.isNewStudent(student)) {
        profName.innerHTML = `${this.escapeHtml(student.NameKh)} <span class="badge-new-student" style="font-size: 0.72rem; padding: 2px 8px;"><i class="fa-solid fa-sparkles"></i> សិស្សថ្មី</span>`;
      } else {
        profName.textContent = student.NameKh;
      }
    }

    const isDropped = (student.Status === "Dropped" || student.Status === "Drop" || student.isBlocked === true);
    const profId = document.getElementById("profileHeaderId");
    if (profId) {
      if (isDropped) {
        profId.innerHTML = `${student.ID} <span style="color: #ef4444; font-size: 0.72rem; background: rgba(239, 68, 68, 0.15); padding: 2px 6px; border-radius: 4px; margin-left: 4px; font-weight: 700;"><i class="fa-solid fa-lock"></i> ប្រើលែងកើត</span>`;
      } else if (student.Status === "Graduated") {
        profId.innerHTML = `${student.ID} <span style="color: #10b981; font-size: 0.72rem; background: rgba(16, 185, 129, 0.15); padding: 2px 6px; border-radius: 4px; margin-left: 4px; font-weight: 700;"><i class="fa-solid fa-user-graduate"></i> Alumni</span>`;
      } else if (this.isNewStudent(student)) {
        profId.innerHTML = `${student.ID} <span class="badge-new-student" style="font-size: 0.68rem; padding: 1px 6px;"><i class="fa-solid fa-sparkles"></i> New</span>`;
      } else {
        profId.textContent = student.ID;
      }
    }

    const profCourse = document.getElementById("profileHeaderCourse");
    if (profCourse) {
      profCourse.textContent = student.Course ? (student.Course + (student.Shift ? ` (${student.Shift})` : '')) : (student.Grade || 'ថ្នាក់កុំព្យូទ័រ');
    }

    const statusToggleText = document.getElementById("profileBtnStatusText");
    if (statusToggleText) {
      statusToggleText.textContent = student.Status === "Inactive" ? "បន្តការសិក្សា" : "ផ្អាកការសិក្សា";
    }

    // Toggle button visibilities based on status
    const profMarkDrop = document.getElementById("profileBtnMarkDrop");
    const profMarkGrad = document.getElementById("profileBtnMarkGraduate");
    const menuItemReactivate = document.getElementById("menuItemReactivateStudent");
    if (profMarkDrop) profMarkDrop.style.display = isDropped ? "none" : "inline-flex";
    if (profMarkGrad) profMarkGrad.style.display = (student.Status === "Graduated" || isDropped) ? "none" : "inline-flex";
    if (menuItemReactivate) menuItemReactivate.style.display = isDropped ? "flex" : "none";

    // 2. Financial Summary & Payment History
    const fee = typeof StudentAPI !== "undefined" ? StudentAPI.getStudentFee(student.ID) : null;
    const defaultPrice = 250;
    const tuition = fee ? (parseFloat(fee.totalAmount) || defaultPrice) : defaultPrice;
    const paid = fee ? (parseFloat(fee.paidAmount) || tuition) : tuition;
    const balance = Math.max(0, tuition - paid);
    const feeStatus = balance <= 0 ? "Paid" : (paid > 0 ? "Partial" : "Unpaid");

    const profFeeStatus = document.getElementById("profileHeaderFeeStatus");
    if (profFeeStatus) {
      if (feeStatus === "Paid") {
        profFeeStatus.className = "profile-badge-pill profile-badge-fee-paid";
        profFeeStatus.innerHTML = `<i class="fa-solid fa-circle-info"></i> <i class="fa-solid fa-check"></i> <span>បង់រួចរាល់</span>`;
      } else if (feeStatus === "Partial") {
        profFeeStatus.className = "profile-badge-pill profile-badge-fee-partial";
        profFeeStatus.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>នៅខ្វះ ${balance.toFixed(2)}</span>`;
      } else {
        profFeeStatus.className = "profile-badge-pill profile-badge-fee-unpaid";
        profFeeStatus.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>មិនទាន់បង់</span>`;
      }
    }

    // Blue Financial Summary Card (សង្ខេបហិរញ្ញវត្ថុ)
    const elCardTuition = document.getElementById("financeCardTuition");
    if (elCardTuition) elCardTuition.textContent = `${tuition.toFixed(2)}`;
    const elCardMaterials = document.getElementById("financeCardMaterials");
    if (elCardMaterials) elCardMaterials.textContent = "$0.00";
    const elCardAdmin = document.getElementById("financeCardAdmin");
    if (elCardAdmin) elCardAdmin.textContent = "$0.00";
    const elCardTotal = document.getElementById("financeCardTotal");
    if (elCardTotal) elCardTotal.textContent = `${tuition.toFixed(2)}`;
    const elCardPaid = document.getElementById("financeCardPaid");
    if (elCardPaid) elCardPaid.textContent = `${paid.toFixed(2)}`;
    const elCardBalance = document.getElementById("financeCardBalance");
    if (elCardBalance) elCardBalance.textContent = `${balance.toFixed(2)}`;

    // Payment History Table & Badges
    const allFees = typeof StudentAPI !== "undefined" ? StudentAPI.getAllFees() : {};
    const rawFee = allFees[student.ID];
    const payments = (rawFee && Array.isArray(rawFee.payments) && rawFee.payments.length > 0)
      ? rawFee.payments
      : [
          {
            stage: "#1",
            date: fee?.date || student.StartDate || new Date().toISOString().split("T")[0],
            label: "បង់ដំបូង (Initial)",
            months: "12 ខែ",
            method: fee?.paymentMethod || "Cash",
            amount: paid,
            total: tuition,
            status: balance <= 0 ? "រួចរាល់" : "នៅខ្វះ",
            receiver: "System"
          }
        ];

    const elCountBadge = document.getElementById("financeCountBadge");
    if (elCountBadge) elCountBadge.innerHTML = `<i class="fa-regular fa-newspaper"></i> <span>${payments.length} លើក</span>`;
    const elTotalBadge = document.getElementById("financeTotalPaidBadge");
    if (elTotalBadge) elTotalBadge.innerHTML = `<i class="fa-solid fa-dollar-sign"></i> <span>${paid.toFixed(2)}</span>`;

    const tbody = document.getElementById("financePaymentTableBody");
    if (tbody) {
      tbody.innerHTML = payments.map((p, idx) => `
        <tr>
          <td><span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700; border-radius: 6px; padding: 2px 8px;">${p.stage || `#${idx + 1}`}</span></td>
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${p.date}</div>
            <span style="font-size: 0.72rem; background: #e0f2fe; color: #0284c7; padding: 1px 6px; border-radius: 4px;">${p.label || 'បង់បន្ថែម'}</span>
          </td>
          <td>
            <div style="font-weight: 600;"><i class="fa-solid fa-clock-rotate-left text-muted"></i> ${p.months || '1 ខែ'}</div>
            <span class="text-xs text-muted">${p.method || 'Cash'}</span>
          </td>
          <td>
            <div style="font-size: 0.95rem; font-weight: 800; color: #059669; font-family: 'Plus Jakarta Sans', monospace;">${parseFloat(p.amount || 0).toFixed(2)}</div>
            <div class="text-xs text-muted">សរុប: ${parseFloat(p.total || tuition).toFixed(2)} <span class="badge ${p.status === 'រួចរាល់' ? 'status-active' : 'status-pending'}" style="font-size: 0.68rem; padding: 1px 5px;">${p.status || 'រួចរាល់'}</span></div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 22px; height: 22px; border-radius: 50%; background: #0284c7; color: white; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700;">SY</span>
              <span style="font-weight: 600; font-size: 0.82rem;">${p.receiver || 'System'}</span>
            </div>
          </td>
          <td style="text-align: right;">
            <div class="history-action-btns" style="justify-content: flex-end;">
              <button type="button" class="btn-tbl-action view" onclick="FeesView.printOfficialReceipt('${student.ID}')" title="មើលវិក្កយបត្រ"><i class="fa-regular fa-eye"></i></button>
              <button type="button" class="btn-tbl-action edit" onclick="FeesView.openRecordPaymentModal('${student.ID}')" title="កែប្រែ"><i class="fa-solid fa-pen"></i></button>
              <button type="button" class="btn-tbl-action print" onclick="FeesView.printOfficialReceipt('${student.ID}')" title="បោះពុម្ព"><i class="fa-solid fa-print"></i></button>
              <button type="button" class="btn-tbl-action delete" onclick="App.deleteStudentPaymentRow('${student.ID}', ${idx})" title="លុប"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // 3. Tab: ព័ត៌មានទូទៅ (General Info)
    const detailAvatar = document.getElementById("modalDetailAvatar");
    if (detailAvatar) detailAvatar.src = student.Avatar || this.getDefaultAvatar(student.Gender);
    const detNameKh = document.getElementById("modalDetailNameKh");
    if (detNameKh) detNameKh.textContent = student.NameKh;
    const detNameEn = document.getElementById("modalDetailNameEn");
    if (detNameEn) detNameEn.textContent = student.NameEn || "—";
    const detId = document.getElementById("modalDetailId");
    if (detId) detId.textContent = student.ID;
    const detGender = document.getElementById("modalDetailGender");
    if (detGender) detGender.textContent = student.Gender;
    const dobEl = document.getElementById("modalDetailDob");
    if (dobEl) dobEl.textContent = student.Dob || "—";
    const detGrade = document.getElementById("modalDetailGrade");
    if (detGrade) detGrade.textContent = student.Grade || "ថ្នាក់កុំព្យូទ័រ";
    const courseEl = document.getElementById("modalDetailCourse");
    if (courseEl) {
      if (student.Course) {
        courseEl.className = `badge-course ${this.getCourseBadgeClass(student.Course)}`;
        courseEl.innerHTML = `${this.getCourseIcon(student.Course)} ${this.escapeHtml(student.Course)}`;
        courseEl.style.display = "inline-flex";
      } else {
        courseEl.textContent = "—";
        courseEl.className = "text-muted";
        courseEl.style.display = "inline";
      }
    }
    const detShift = document.getElementById("modalDetailShift");
    if (detShift) detShift.textContent = this.getShiftLabel(student.Shift);
    const detPhone = document.getElementById("modalDetailPhone");
    if (detPhone) detPhone.textContent = student.Phone || "—";
    const guardPhoneEl = document.getElementById("modalDetailGuardianPhone");
    if (guardPhoneEl) guardPhoneEl.textContent = student.GuardianPhone || "—";
    const loginUserEl = document.getElementById("modalDetailLoginUser");
    if (loginUserEl) loginUserEl.textContent = student.ID || "—";
    const loginPinEl = document.getElementById("modalDetailLoginPin");
    if (loginPinEl) loginPinEl.textContent = student.PIN || student.pin || "123";
    const detAddr = document.getElementById("modalDetailAddress");
    if (detAddr) detAddr.textContent = student.Address || "—";
    const detCreated = document.getElementById("modalDetailCreatedAt");
    if (detCreated) detCreated.textContent = student.CreatedAt || "—";

    const statusEl = document.getElementById("modalDetailStatus");
    if (statusEl) {
      statusEl.className = `status-indicator status-${(student.Status || 'Active').toLowerCase()}`;
      statusEl.textContent = student.Status === 'Active' ? 'កំពុងសិក្សា' : student.Status === 'Graduated' ? 'បញ្ចប់ការសិក្សា' : 'ផ្អាក';
    }

    // Study Duration & Attendance Stats Breakdown
    const daysInfo = this.getStudentDaysInfo(student);
    const attSummary = StudentAPI.getStudentAttendanceSummary(student.ID);

    const elDaysStudied = document.getElementById("modalDetailDaysStudied");
    if (elDaysStudied) elDaysStudied.innerHTML = `<i class="fa-regular fa-calendar-days"></i> បានរៀន ${daysInfo.durationLabel} (${daysInfo.daysElapsed}/${daysInfo.totalCourseDays} ថ្ងៃ)`;

    const elProgressBar = document.getElementById("modalDetailProgressBar");
    if (elProgressBar) elProgressBar.style.width = `${daysInfo.percent}%`;

    const elStartDate = document.getElementById("modalDetailStartDate");
    if (elStartDate) elStartDate.textContent = daysInfo.startDate || "—";

    const elDaysRemaining = document.getElementById("modalDetailDaysRemaining");
    if (elDaysRemaining) elDaysRemaining.textContent = `នៅសល់ ${daysInfo.remainingLabel} (${daysInfo.daysRemaining} ថ្ងៃ)`;

    const elEndDate = document.getElementById("modalDetailEndDate");
    if (elEndDate) elEndDate.textContent = daysInfo.endDate || "—";

    // 4. Tab: គ្រួសារ (Family)
    const fatherEl = document.getElementById("familyFatherName");
    if (fatherEl) fatherEl.textContent = student.FatherName || "—";
    const motherEl = document.getElementById("familyMotherName");
    if (motherEl) motherEl.textContent = student.MotherName || "—";
    const emgEl = document.getElementById("familyEmergencyContact");
    if (emgEl) emgEl.textContent = student.EmergencyPhone || student.GuardianPhone || "—";
    const famAddr = document.getElementById("familyAddress");
    if (famAddr) famAddr.textContent = student.Address || "—";

    // 5. Tab: អវត្តមាន (Attendance Breakdown)
    const elAttTotal = document.getElementById("modalDetailAttTotal");
    if (elAttTotal) elAttTotal.textContent = `${attSummary.totalDays} ថ្ងៃ`;

    const elAttPresent = document.getElementById("modalDetailAttPresent");
    if (elAttPresent) elAttPresent.textContent = `${attSummary.present} ថ្ងៃ (${attSummary.rate}%)`;

    const elAttPerm = document.getElementById("modalDetailAttPerm");
    if (elAttPerm) elAttPerm.textContent = `${attSummary.permission} ថ្ងៃ`;

    const elAttAbsent = document.getElementById("modalDetailAttAbsent");
    if (elAttAbsent) elAttAbsent.textContent = `${attSummary.absent} ថ្ងៃ`;

    const attLogContainer = document.getElementById("modalAttendanceLogContainer");
    if (attLogContainer) {
      const allAtt = typeof StudentAPI !== "undefined" ? StudentAPI.getAllAttendance() : {};
      const studentRecords = [];
      Object.keys(allAtt || {}).sort().reverse().slice(0, 10).forEach(date => {
        const dayMap = allAtt[date];
        if (dayMap && dayMap[student.ID]) {
          studentRecords.push({
            date: date,
            status: dayMap[student.ID],
            note: "—"
          });
        }
      });

      if (studentRecords.length === 0) {
        attLogContainer.innerHTML = `<div class="text-muted text-center" style="padding: 12px;">មិនទាន់មានកំណត់ត្រាវត្តមានលម្អិតទេ</div>`;
      } else {
        attLogContainer.innerHTML = `
          <table class="history-table" style="font-size: 0.8rem; margin-top: 6px;">
            <thead>
              <tr>
                <th><i class="fa-regular fa-calendar"></i> កាលបរិច្ឆេទ</th>
                <th>ស្ថានភាពវត្តមាន</th>
                <th>កំណត់ចំណាំ</th>
              </tr>
            </thead>
            <tbody>
              ${studentRecords.map(r => `
                <tr>
                  <td><strong>${r.date}</strong></td>
                  <td><span class="badge ${r.status === 'Present' ? 'status-active' : (r.status === 'Permission' ? 'status-pending' : 'status-inactive')}">${r.status === 'Present' ? '✓ វត្តមាន' : (r.status === 'Permission' ? 'P ច្បាប់' : '✗ អវត្តមាន')}</span></td>
                  <td class="text-muted">${r.note || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    }

    // 6. Tab: សេវាផ្សេងៗ (Printable Student ID Card)
    const cardNameKh = document.getElementById("cardPreviewNameKh");
    const cardNameEn = document.getElementById("cardPreviewNameEn");
    const cardId = document.getElementById("cardPreviewId");
    const cardGrade = document.getElementById("cardPreviewGrade");
    const cardAvatar = document.getElementById("cardPreviewAvatar");
    const cardDob = document.getElementById("cardPreviewDob");

    if (cardNameKh) cardNameKh.textContent = student.NameKh;
    if (cardNameEn) cardNameEn.textContent = student.NameEn || "";
    if (cardId) cardId.textContent = student.ID;
    if (cardGrade) cardGrade.textContent = student.Grade || "ថ្នាក់កុំព្យូទ័រ";
    const cardPreviewCourse = document.getElementById("cardPreviewCourse");
    if (cardPreviewCourse) {
      if (student.Course) {
        cardPreviewCourse.textContent = student.Course;
        cardPreviewCourse.className = `badge-course ${this.getCourseBadgeClass(student.Course)}`;
        cardPreviewCourse.style.display = "inline-flex";
      } else {
        cardPreviewCourse.style.display = "none";
      }
    }
    if (cardAvatar) cardAvatar.src = student.Avatar || this.getDefaultAvatar(student.Gender);
    if (cardDob) cardDob.textContent = student.Dob || "2006-01-01";

    // 7. Tab: លទ្ធផលសិក្សា (4-Course Computer Exam Results & Ladder)
    const examSection = document.getElementById("modalDetailExamSection");
    const isComp = !student.Grade || (student.Grade || "").includes("កុំព្យូទ័រ") || student.Course;
    if (examSection) {
      examSection.style.display = isComp ? "block" : "none";
      if (isComp) {
        const exams = StudentAPI.getStudentExams(student.ID);
        const steps = [
          { id: "Typing", elId: "modalExamTyping", name: "Typing" },
          { id: "Word", elId: "modalExamWord", name: "Word" },
          { id: "Excel", elId: "modalExamExcel", name: "Excel" },
          { id: "PowerPoint", elId: "modalExamPowerPoint", name: "PowerPoint" }
        ];
        steps.forEach(st => {
          const stepEl = document.getElementById(st.elId);
          if (stepEl) {
            const ex = exams[st.id];
            const scoreEl = stepEl.querySelector(".ladder-score");
            const badgeEl = stepEl.querySelector(".ladder-badge");
            if (ex && ex.score !== null && ex.score !== undefined) {
              if (scoreEl) scoreEl.textContent = `${ex.score} (${ex.grade || ''})`;
              if (badgeEl) {
                badgeEl.className = `ladder-badge text-xs font-bold ${ex.status === 'Pass' ? 'text-emerald-600' : 'text-rose-600'}`;
                badgeEl.textContent = ex.status === 'Pass' ? '✓ ជាប់ (Pass)' : '✗ ធ្លាក់ (Fail)';
              }
            } else {
              if (scoreEl) scoreEl.textContent = "—";
              if (badgeEl) {
                badgeEl.className = "ladder-badge text-xs text-muted";
                badgeEl.textContent = (student.Course || '').includes(st.name) ? 'កំពុងរៀន' : 'មិនទាន់ប្រលង';
              }
            }
          }
        });

        const printTransBtn = document.getElementById("modalPrintTranscriptBtn");
        if (printTransBtn) {
          printTransBtn.onclick = () => {
            if (typeof ExamsView !== "undefined") ExamsView.printStudentTranscript(student.ID);
          };
        }
      }
    }

    // Set active tab to 'finance' by default
    const finTabBtn = document.querySelector("[data-student-tab='finance']");
    if (finTabBtn) {
      document.querySelectorAll("[data-student-tab]").forEach(b => b.classList.remove("active"));
      finTabBtn.classList.add("active");
      document.querySelectorAll(".student-tab-pane").forEach(pane => pane.classList.remove("active"));
      const finPane = document.getElementById("pane-finance");
      if (finPane) finPane.classList.add("active");
    }

    ModalsComponent.open("studentDetailsModal");
  },

  async handleQuickPaymentSubmit() {
    if (!this.state.selectedStudent) return;
    const student = this.state.selectedStudent;

    const amtInput = document.getElementById("quickPayAmount");
    const methodInput = document.getElementById("quickPayMethod");
    const dateInput = document.getElementById("quickPayDate");
    const noteInput = document.getElementById("quickPayNote");

    const amount = parseFloat(amtInput?.value) || 0;
    if (amount <= 0) {
      this.showToast("សូមបញ្ចូលចំនួនទឹកប្រាក់ដែលត្រូវបង់!", "warning");
      return;
    }

    const method = methodInput?.value || "Cash";
    const date = dateInput?.value || new Date().toISOString().split("T")[0];
    const note = noteInput?.value?.trim() || `បង់ថ្លៃសិក្សា ${amount}`;

    try {
      const allFees = StudentAPI.getAllFees();
      const currentFee = allFees[student.ID] || StudentAPI.getStudentFee(student.ID);
      const totalAmount = parseFloat(currentFee.totalAmount) || 250;
      const currentPaid = parseFloat(currentFee.paidAmount) || 0;
      const newPaid = Math.min(totalAmount, currentPaid + amount);
      const newBalance = Math.max(0, totalAmount - newPaid);

      const payments = Array.isArray(currentFee.payments) ? [...currentFee.payments] : [];
      payments.push({
        stage: `#${payments.length + 1}`,
        date: date,
        label: payments.length === 0 ? "បង់ដំបូង (Initial)" : "បង់បន្ថែម (Additional)",
        months: "1 ខែ",
        method: method,
        amount: amount,
        total: totalAmount,
        status: newBalance <= 0 ? "រួចរាល់" : "នៅខ្វះ",
        receiver: "System"
      });

      const updatedFee = {
        ...currentFee,
        studentId: student.ID,
        studentNameKh: student.NameKh,
        course: student.Course || "Typing",
        totalAmount: totalAmount,
        paidAmount: newPaid,
        balance: newBalance,
        status: newBalance <= 0 ? "Paid" : "Partial",
        paymentMethod: method,
        date: date,
        note: note,
        payments: payments,
        updatedAt: new Date().toISOString()
      };

      allFees[student.ID] = updatedFee;
      StudentAPI.saveAllFees(allFees);

      if (StudentAPI.isCloudConnected()) {
        try {
          await firebase.database().ref(`fees/${student.ID}`).set(updatedFee);
        } catch (e) {
          console.warn("Fee cloud sync notice:", e);
        }
      }

      this.showToast(`🎉 បានកត់ត្រាការបង់ប្រាក់ ${amount} ជូនសិស្ស ${student.NameKh} ជោគជ័យ!`, "success");
      this.triggerConfetti();

      // Hide Quick Pay Drawer
      const box = document.getElementById("inlineQuickPayBox");
      if (box) box.style.display = "none";

      // Refresh view
      this.viewStudentDetails(student.ID);

      // Trigger Telegram Notification
      if (typeof TelegramService !== "undefined") {
        TelegramService.notifyPayment(student, {
          course: student.Course || "Typing",
          paidAmount: amount,
          receiptNo: `INV-${new Date().getFullYear()}-${student.ID.replace(/\D/g, '').padStart(3, '0')}`,
          paymentMethod: method,
          date: date
        });
      }
    } catch (err) {
      this.showToast("កំហុសក្នុងការកត់ត្រាការបង់ប្រាក់: " + err.message, "error");
    }
  },

  async deleteStudentPaymentRow(studentId, index) {
    if (!confirm("តើអ្នកពិតជាចង់លុបកំណត់ត្រាបង់ប្រាក់នេះមែនទេ?")) return;

    try {
      const allFees = StudentAPI.getAllFees();
      const currentFee = allFees[studentId];
      if (currentFee && Array.isArray(currentFee.payments) && currentFee.payments[index]) {
        const removed = currentFee.payments.splice(index, 1)[0];
        const newPaid = Math.max(0, (currentFee.paidAmount || 0) - (removed.amount || 0));
        currentFee.paidAmount = newPaid;
        currentFee.balance = Math.max(0, (currentFee.totalAmount || 250) - newPaid);
        currentFee.status = currentFee.balance <= 0 ? "Paid" : (newPaid > 0 ? "Partial" : "Unpaid");

        allFees[studentId] = currentFee;
        StudentAPI.saveAllFees(allFees);

        if (StudentAPI.isCloudConnected()) {
          await firebase.database().ref(`fees/${studentId}`).set(currentFee);
        }

        this.showToast("បានលុបកំណត់ត្រាបង់ប្រាក់រួចរាល់!", "info");
        this.viewStudentDetails(studentId);
      }
    } catch (err) {
      this.showToast("មិនអាចលុបបានទេ: " + err.message, "error");
    }
  },

  async toggleStudentStatus(studentId) {
    const student = this.state.students.find(s => s.ID === studentId);
    if (!student) return;

    const newStatus = student.Status === "Inactive" ? "Active" : "Inactive";
    student.Status = newStatus;

    try {
      await StudentAPI.updateStudent(student);
      this.showToast(`បានប្តូរស្ថានភាពសិស្សទៅជា៖ ${newStatus === 'Active' ? 'កំពុងសិក្សា' : 'ផ្អាកការសិក្សា'}`, "success");
      this.viewStudentDetails(student.ID);
      await this.loadData(false);
    } catch (err) {
      this.showToast("កំហុសក្នុងការប្តូរស្ថានភាព: " + err.message, "error");
    }
  },

  async resetStudentPin(studentId) {
    const student = this.state.students.find(s => s.ID === studentId);
    if (!student) return;

    const newPin = "123";
    student.PIN = newPin;
    student.pin = newPin;

    try {
      await StudentAPI.updateStudent(student);
      this.showToast(`បានកំណត់លេខកូដ PIN ឡើងវិញជា "${newPin}" ដោយជោគជ័យ!`, "success");
      const pinEl = document.getElementById("modalDetailLoginPin");
      if (pinEl) pinEl.textContent = newPin;
    } catch (err) {
      this.showToast("កំហុសក្នុងការកំណត់ PIN: " + err.message, "error");
    }
  },

  openEditModal(studentId) {
    const student = this.state.students.find(s => String(s.ID).trim() === String(studentId).trim());
    if (!student) return;

    this.state.selectedStudent = student;

    const form = document.getElementById("editStudentForm");
    if (!form) return;

    form.querySelector("[name='id']").value = student.ID;
    form.querySelector("[name='nameKh']").value = student.NameKh || "";
    let curNameEn = (student.NameEn || "").trim();
    if ((!curNameEn || /[\u1780-\u17FF]/.test(curNameEn)) && student.NameKh) {
      if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin) {
        curNameEn = TeacherToolsService.transliterateKhmerToLatin(student.NameKh);
      }
    }
    const editNameEnInput = form.querySelector("[name='nameEn']");
    if (editNameEnInput) {
      editNameEnInput.value = curNameEn;
      editNameEnInput.dataset.manualEdited = "";
    }
    form.querySelector("[name='gender']").value = student.Gender || "ប្រុស";
    const dobInput = form.querySelector("[name='dob']");
    if (dobInput) dobInput.value = student.Dob || student.DOB || "";
    const natInput = form.querySelector("[name='nationality']");
    if (natInput) natInput.value = student.Nationality || "ខ្មែរ";
    form.querySelector("[name='phone']").value = student.Phone || "";
    const healthInput = form.querySelector("[name='healthNotes']");
    if (healthInput) healthInput.value = student.HealthNotes || "";
    const addressSelect = form.querySelector("[name='address']");
    if (addressSelect) addressSelect.value = student.Address || "ខេត្តកំពត";
    form.querySelector("[name='grade']").value = student.Grade || "ថ្នាក់កុំព្យូទ័រ";
    const courseSelect = form.querySelector("[name='course']");
    if (courseSelect) courseSelect.value = student.Course || "Typing";
    const shiftVal = student.Shift || "ព្រឹក";
    const shiftSelect = form.querySelector("[name='shift']");
    if (shiftSelect) {
      const matchOpt = Array.from(shiftSelect.options).find(opt => opt.value === shiftVal || opt.value.includes(shiftVal) || (opt.text && opt.text.includes(shiftVal)));
      shiftSelect.value = matchOpt ? matchOpt.value : (shiftSelect.options[0]?.value || "ព្រឹក");
    }
    form.querySelector("[name='status']").value = student.Status || "Active";
    const startInput = form.querySelector("[name='startDate']");
    if (startInput) startInput.value = student.StartDate || student.CreatedAt || "";
    const endInput = form.querySelector("[name='endDate']");
    if (endInput) endInput.value = student.EndDate || "";
    const pinInput = form.querySelector("[name='pin']");
    if (pinInput) pinInput.value = student.PIN || student.pin || "123";
    form.querySelector("[name='avatar']").value = student.Avatar || "";
    form.querySelector("[name='createdAt']").value = student.CreatedAt || "";

    const idDisplay = document.getElementById("editModalStudentIdDisplay");
    if (idDisplay) idDisplay.value = student.ID;

    const preview = document.getElementById("editAvatarPreview");
    const placeholder = document.getElementById("editAvatarPlaceholder");
    if (preview) {
      if (student.Avatar) {
        preview.src = student.Avatar;
        preview.style.display = "block";
        if (placeholder) placeholder.style.display = "none";
      } else {
        preview.src = "";
        preview.style.display = "none";
        if (placeholder) placeholder.style.display = "flex";
      }
    }

    this.editStep = 1;
    this.updateEditStepUI();
    ModalsComponent.open("editModal");
  },

  confirmDeleteStudent(studentId) {
    const student = this.state.students.find(s => String(s.ID).trim() === String(studentId).trim());
    if (!student) return;

    document.getElementById("deleteStudentName").textContent = `${student.NameKh} (${student.ID})`;

    const confirmBtn = document.getElementById("confirmDeleteBtn");
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener("click", async () => {
      try {
        newConfirmBtn.disabled = true;
        newConfirmBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងលុប...`;

        await StudentAPI.deleteStudent(student.ID);
        this.showToast(`បានលុបទិន្នន័យសិស្ស ${student.NameKh} រួចរាល់!`, "info");
        ModalsComponent.close("deleteConfirmModal");
        await this.loadData(false);
      } catch (err) {
        this.showToast(err.message || "មានកំហុសក្នុងការលុប!", "error");
      } finally {
        newConfirmBtn.disabled = false;
        newConfirmBtn.innerHTML = `<i class="fa-solid fa-trash"></i> យល់ព្រមលុប`;
      }
    });

    ModalsComponent.open("deleteConfirmModal");
  },

  // Print Student ID Card
  printStudentIdCard(targetStudentId = null) {
    let student = null;
    if (targetStudentId) {
      student = (this.state.students || []).find(s => String(s.ID).trim() === String(targetStudentId).trim());
    }
    if (!student) {
      student = this.state.selectedStudent;
    }
    if (!student && typeof AuthService !== "undefined" && AuthService.isStudent()) {
      const u = AuthService.getCurrentUser();
      student = u?.studentData || u;
    }
    if (!student) {
      this.showToast("រកមិនឃើញទិន្នន័យសិស្សសម្រាប់បោះពុម្ពកាតឡើយ!", "warning");
      return;
    }

    let printWindow = null;
    try {
      printWindow = window.open("", "_blank", "width=800,height=600");
    } catch (e) {
      printWindow = null;
    }

    if (!printWindow) {
      window.print();
      return;
    }

    try {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>បោះពុម្ពកាតសិស្ស - ${student?.NameKh || ''}</title>
          <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Plus+Jakarta+Sans:wght@600;800&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center;
              background: #f8fafc; font-family: 'Kantumruy Pro', sans-serif;
            }
            .id-card-print {
              width: 380px; height: 240px; border-radius: 16px;
              background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
              color: #ffffff; padding: 16px 20px; box-sizing: border-box;
              display: flex; flex-direction: column; justify-content: space-between;
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
              -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .card-header {
              display: flex; align-items: center; justify-content: space-between;
              border-bottom: 1px solid rgba(255,255,255,0.25); padding-bottom: 8px;
            }
            .school-title { font-size: 14px; font-weight: 700; letter-spacing: 0.5px; }
            .school-sub { font-size: 10px; opacity: 0.85; text-transform: uppercase; }
            .card-body { display: flex; gap: 16px; align-items: center; margin-top: 6px; }
            .card-avatar {
              width: 80px; height: 95px; border-radius: 8px;
              object-fit: cover; border: 2px solid #ffffff; background: #ffffff;
            }
            .card-info { flex: 1; }
            .card-name-kh { font-size: 17px; font-weight: 700; color: #fef08a; margin-bottom: 2px; }
            .card-name-en { font-size: 12px; font-family: 'Plus Jakarta Sans', sans-serif; opacity: 0.9; margin-bottom: 6px; }
            .card-row { font-size: 11px; display: flex; margin-bottom: 3px; opacity: 0.95; }
            .card-row span:first-child { width: 60px; opacity: 0.8; }
            .card-footer {
              display: flex; justify-content: space-between; align-items: flex-end;
              border-top: 1px solid rgba(255,255,255,0.2); padding-top: 6px; font-size: 9px; opacity: 0.85;
            }
            .barcode {
              font-family: monospace; letter-spacing: 3px; font-weight: bold;
              font-size: 12px; background: rgba(255,255,255,0.15); padding: 2px 6px; border-radius: 4px;
            }
            @media print { body { background: transparent; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="id-card-print">
            <div class="card-header">
              <div>
                <div class="school-title">TIS LAB COMPUTER</div>
                <div class="school-sub">STUDENT IDENTITY CARD</div>
              </div>
              <div style="font-size: 22px;">🎓</div>
            </div>
            <div class="card-body">
              <img src="${student?.Avatar || this.getDefaultAvatar(student?.Gender)}" class="card-avatar">
              <div class="card-info">
                <div class="card-name-kh">${student?.NameKh}</div>
                <div class="card-name-en">${student?.NameEn || ''}</div>
                <div class="card-row"><span>អត្តលេខ:</span> <strong>${student?.ID}</strong></div>
                <div class="card-row"><span>ថ្នាក់សិក្សា:</span> <strong>${student?.Grade}</strong></div>
                <div class="card-row"><span>ថ្ងៃកំណើត:</span> <span>${student?.Dob || '—'}</span></div>
              </div>
            </div>
            <div class="card-footer">
              <div>សុពលភាព: 2026 - 2027</div>
              <div class="barcode">${student?.ID}</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          <\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      window.print();
    }
  },

  // Open Monthly Report Modal
  openMonthlyReportModal() {
    const monthSelect = document.getElementById("reportMonthSelect");
    if (monthSelect) {
      const khmerMonths = [
        "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
        "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
      ];
      const now = new Date();
      let html = "";
      for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth();
        const val = `${y}-${String(m + 1).padStart(2, '0')}`;
        const label = `ខែ${khmerMonths[m]} ឆ្នាំ${y}${i === 0 ? " (បច្ចុប្បន្ន)" : ""}`;
        html += `<option value="${val}">${label}</option>`;
      }
      monthSelect.innerHTML = html;

      if (!monthSelect.dataset.listenerAttached) {
        monthSelect.dataset.listenerAttached = "true";
        monthSelect.addEventListener("change", () => this.updateMonthlyReportPreview());
        const shiftSelect = document.getElementById("reportShiftSelect");
        if (shiftSelect) shiftSelect.addEventListener("change", () => this.updateMonthlyReportPreview());
        const statusSelect = document.getElementById("reportStatusSelect");
        if (statusSelect) statusSelect.addEventListener("change", () => this.updateMonthlyReportPreview());
      }
    }

    this.updateMonthlyReportPreview();
    ModalsComponent.open("monthlyReportModal");
  },

  updateMonthlyReportPreview() {
    const shiftVal = document.getElementById("reportShiftSelect")?.value || "ALL";
    const statusVal = document.getElementById("reportStatusSelect")?.value || "Active";

    const allStudents = this.state.students || [];
    const filtered = allStudents.filter(s => {
      if (statusVal !== "ALL") {
        if (statusVal === "Active" && s.Status !== "Active") return false;
        if (statusVal === "Graduated" && s.Status !== "Graduated") return false;
        if (statusVal === "Dropped" && s.Status !== "Dropped" && s.Status !== "Drop" && !s.isBlocked) return false;
      }
      if (shiftVal !== "ALL") {
        if (!s.Shift || !s.Shift.includes(shiftVal)) return false;
      }
      return true;
    });

    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let totalPermDays = 0;

    filtered.forEach(s => {
      const att = StudentAPI.getStudentAttendanceSummary(s.ID);
      const days = this.getStudentDaysInfo(s);
      const present = (att && att.totalDays > 0) ? (att.present || 0) : (days.daysElapsed || 0);
      const absent = (att && att.absent) ? att.absent : 0;
      const perm = (att && att.permission) ? att.permission : 0;

      totalPresentDays += present;
      totalAbsentDays += absent;
      totalPermDays += perm;
    });

    const badge = document.getElementById("reportTotalBadge");
    if (badge) badge.textContent = `សរុប ${filtered.length} នាក់`;

    const elPres = document.getElementById("reportTotalPresentDays");
    if (elPres) elPres.textContent = `${totalPresentDays} ថ្ងៃ`;

    const elAbs = document.getElementById("reportTotalAbsentDays");
    if (elAbs) elAbs.textContent = `${totalAbsentDays} ថ្ងៃ`;

    const elPerm = document.getElementById("reportTotalPermDays");
    if (elPerm) elPerm.textContent = `${totalPermDays} ថ្ងៃ`;
  },

  exportFromMonthlyModal() {
    const monthSelect = document.getElementById("reportMonthSelect");
    const monthVal = monthSelect ? monthSelect.value : "";
    const monthLabel = monthSelect && monthSelect.selectedIndex >= 0 ? monthSelect.options[monthSelect.selectedIndex].text.replace(" (បច្ចុប្បន្ន)", "") : "";
    const shiftVal = document.getElementById("reportShiftSelect")?.value || "ALL";
    const statusVal = document.getElementById("reportStatusSelect")?.value || "Active";

    this.exportStandardMonthlyExcel({
      monthVal,
      monthLabel,
      shiftVal,
      statusVal
    });
    ModalsComponent.close("monthlyReportModal");
  },

  printFromMonthlyModal() {
    const monthSelect = document.getElementById("reportMonthSelect");
    const monthVal = monthSelect ? monthSelect.value : "";
    const monthLabel = monthSelect && monthSelect.selectedIndex >= 0 ? monthSelect.options[monthSelect.selectedIndex].text.replace(" (បច្ចុប្បន្ន)", "") : "";
    const shiftVal = document.getElementById("reportShiftSelect")?.value || "ALL";
    const statusVal = document.getElementById("reportStatusSelect")?.value || "Active";

    this.printStandardMonthlyReport({
      monthVal,
      monthLabel,
      shiftVal,
      statusVal
    });
  },

  // Export Standard Monthly Excel (.xlsx) with Royal Header, Proper Column Widths and Attendance in Days
  exportStandardMonthlyExcel(opts = {}) {
    if (typeof XLSX === "undefined") {
      this.showToast("កំហុស៖ មិនអាចរកឃើញកម្មវិធីបង្កើត Excel (XLSX)!", "error");
      return;
    }

    let students = [];
    if (opts && (opts.shiftVal || opts.statusVal)) {
      const all = this.state.students || [];
      students = all.filter(s => {
        if (opts.statusVal && opts.statusVal !== "ALL") {
          if (opts.statusVal === "Active" && s.Status !== "Active") return false;
          if (opts.statusVal === "Graduated" && s.Status !== "Graduated") return false;
          if (opts.statusVal === "Dropped" && s.Status !== "Dropped" && s.Status !== "Drop" && !s.isBlocked) return false;
        }
        if (opts.shiftVal && opts.shiftVal !== "ALL") {
          if (!s.Shift || !s.Shift.includes(opts.shiftVal)) return false;
        }
        return true;
      });
    } else {
      students = this.state.filteredStudents && this.state.filteredStudents.length > 0
        ? this.state.filteredStudents
        : (this.state.students || []);
    }

    if (students.length === 0) {
      this.showToast("គ្មានទិន្នន័យសិស្សសម្រាប់ទាញយកឡើយ!", "warning");
      return;
    }

    const khmerMonths = [
      "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
      "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
    ];
    const now = new Date();
    const currentKhmerMonth = opts.monthLabel || `ខែ${khmerMonths[now.getMonth()]} ឆ្នាំ${now.getFullYear()}`;
    const shiftText = opts.shiftVal && opts.shiftVal !== "ALL" ? `វេន${opts.shiftVal}` : "គ្រប់វេន";
    const statusText = opts.statusVal && opts.statusVal !== "ALL" ? (opts.statusVal === "Active" ? "កំពុងសិក្សា" : opts.statusVal) : "សិស្សទាំងអស់";

    const aoa = [
      ["ព្រះរាជាណាចក្រកម្ពុជា"],
      ["ជាតិ  សាសនា  ព្រះមហាក្សត្រ"],
      ["--- 🪷 ---"],
      ["មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័រ TIS Lab Computer"],
      ["ផ្នែក៖ គ្រប់គ្រងសិស្ស និងបច្ចេកវិទ្យាកុំព្យូទ័រ"],
      [],
      ["របាយការណ៍សិស្ស និងវត្តមានប្រចាំខែ (MONTHLY STUDENT ATTENDANCE REPORT)"],
      [`ប្រចាំខែ៖ ${currentKhmerMonth}  |  វេនសិក្សា៖ ${shiftText}  |  ស្ថានភាព៖ ${statusText}  |  កាលបរិច្ឆេទបញ្ចេញ៖ ${now.toLocaleDateString('km-KH')}`],
      [],
      [
        "ល.រ",
        "អត្តលេខ",
        "គោត្តនាម និងនាម",
        "ឈ្មោះជាឡាតាំង",
        "ភេទ",
        "ថ្ងៃខែឆ្នាំកំណើត",
        "វគ្គសិក្សា",
        "វេនសិក្សា",
        "ថ្ងៃចូលរៀន",
        "រយៈពេលវគ្គ (ថ្ងៃ)",
        "វត្តមាន (ថ្ងៃ)",
        "អវត្តមាន (ថ្ងៃ)",
        "សុំច្បាប់ (ថ្ងៃ)",
        "លេខទូរស័ព្ទ",
        "អាសយដ្ឋានបច្ចុប្បន្ន",
        "ស្ថានភាព"
      ]
    ];

    let femaleCount = 0;
    let sumCourseDays = 0;
    let sumPresentDays = 0;
    let sumAbsentDays = 0;
    let sumPermDays = 0;

    students.forEach((s, idx) => {
      const days = this.getStudentDaysInfo(s);
      const att = StudentAPI.getStudentAttendanceSummary(s.ID);
      const presentDays = (att && att.totalDays > 0) ? (att.present || 0) : (days.daysElapsed || 0);
      const absentDays = (att && att.absent) ? att.absent : 0;
      const permDays = (att && att.permission) ? att.permission : 0;
      const totalCourseDays = days.totalCourseDays || 122;

      if (s.Gender === "ស្រី" || s.Gender === "Female" || s.Gender === "F") femaleCount++;
      sumCourseDays += totalCourseDays;
      sumPresentDays += presentDays;
      sumAbsentDays += absentDays;
      sumPermDays += permDays;

      const statusKh = (s.Status === "Dropped" || s.Status === "Drop" || s.isBlocked)
        ? "បោះបង់"
        : (s.Status === "Graduated" ? "បញ្ចប់ការសិក្សា" : "កំពុងសិក្សា");

      aoa.push([
        idx + 1,
        s.ID || "",
        s.NameKh || "",
        s.NameEn || "",
        s.Gender || "",
        s.Dob || "",
        s.Course || s.Grade || "កុំព្យូទ័ររដ្ឋបាល",
        s.Shift || "",
        days.startDate || s.CreatedAt || "",
        `${totalCourseDays} ថ្ងៃ`,
        `${presentDays} ថ្ងៃ`,
        `${absentDays} ថ្ងៃ`,
        `${permDays} ថ្ងៃ`,
        s.Phone || s.GuardianPhone || "",
        s.Address || "",
        statusKh
      ]);
    });

    const dataRowCount = students.length;
    const summaryRowIdx = 10 + dataRowCount;

    // Summary Totals Row
    aoa.push([
      `សរុបសិស្សទាំងអស់ (${dataRowCount} នាក់ / ស្រី: ${femaleCount} នាក់)`,
      "", "", "", "", "", "", "", "",
      `${sumCourseDays} ថ្ងៃ`,
      `${sumPresentDays} ថ្ងៃ`,
      `${sumAbsentDays} ថ្ងៃ`,
      `${sumPermDays} ថ្ងៃ`,
      "", "", ""
    ]);

    // Cambodian Signatures Block
    aoa.push([]);
    const dayKh = String(now.getDate()).padStart(2, '0');
    const khmerDigits = ["០","១","២","៣","៤","៥","៦","៧","៨","៩"];
    const toKhmerNum = (num) => String(num).split("").map(c => khmerDigits[parseInt(c)] || c).join("");

    aoa.push([
      "",
      "បានឃើញ និងឯកភាព",
      "", "", "", "", "", "", "", "",
      `ខេត្តកំពត ថ្ងៃទី${toKhmerNum(dayKh)} ${currentKhmerMonth}`,
      "", "", "", "", ""
    ]);

    aoa.push([
      "",
      "នាយកមជ្ឈមណ្ឌល TIS Lab Computer",
      "", "", "", "", "", "", "", "",
      "គ្រូបន្ទុកថ្នាក់ / អ្នករៀបចំរបាយការណ៍",
      "", "", "", "", ""
    ]);

    aoa.push([]);
    aoa.push([]);
    aoa.push([
      "",
      "(ហត្ថលេខា និងត្រាផ្លូវការ)",
      "", "", "", "", "", "", "", "",
      "(ហត្ថលេខា និងឈ្មោះគ្រូ)",
      "", "", "", "", ""
    ]);

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Set Column Widths for readability in Excel
    ws["!cols"] = [
      { wch: 6 },   // Col 0: ល.រ
      { wch: 12 },  // Col 1: អត្តលេខ
      { wch: 22 },  // Col 2: គោត្តនាម និងនាម
      { wch: 22 },  // Col 3: ឈ្មោះជាឡាតាំង
      { wch: 8 },   // Col 4: ភេទ
      { wch: 14 },  // Col 5: ថ្ងៃកំណើត
      { wch: 20 },  // Col 6: វគ្គសិក្សា
      { wch: 14 },  // Col 7: វេនសិក្សា
      { wch: 14 },  // Col 8: ថ្ងៃចូលរៀន
      { wch: 18 },  // Col 9: រយៈពេលវគ្គ (ថ្ងៃ)
      { wch: 16 },  // Col 10: វត្តមាន (ថ្ងៃ) - Attendance in Days!
      { wch: 14 },  // Col 11: អវត្តមាន (ថ្ងៃ)
      { wch: 14 },  // Col 12: សុំច្បាប់ (ថ្ងៃ)
      { wch: 16 },  // Col 13: លេខទូរស័ព្ទ
      { wch: 28 },  // Col 14: អាសយដ្ឋាន
      { wch: 16 }   // Col 15: ស្ថានភាព
    ];

    // Merged Cells Setup
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 15 } }, // ព្រះរាជាណាចក្រកម្ពុជា
      { s: { r: 1, c: 0 }, e: { r: 1, c: 15 } }, // ជាតិ សាសនា ព្រះមហាក្សត្រ
      { s: { r: 2, c: 0 }, e: { r: 2, c: 15 } }, // Lotus
      { s: { r: 3, c: 0 }, e: { r: 3, c: 6 } },  // School Name
      { s: { r: 4, c: 0 }, e: { r: 4, c: 6 } },  // Department
      { s: { r: 6, c: 0 }, e: { r: 6, c: 15 } }, // Title
      { s: { r: 7, c: 0 }, e: { r: 7, c: 15 } }, // Subtitle
      { s: { r: summaryRowIdx, c: 0 }, e: { r: summaryRowIdx, c: 8 } }, // Totals label
      { s: { r: summaryRowIdx + 2, c: 1 }, e: { r: summaryRowIdx + 2, c: 4 } }, // Approved
      { s: { r: summaryRowIdx + 2, c: 10 }, e: { r: summaryRowIdx + 2, c: 15 } }, // Date
      { s: { r: summaryRowIdx + 3, c: 1 }, e: { r: summaryRowIdx + 3, c: 4 } }, // Director
      { s: { r: summaryRowIdx + 3, c: 10 }, e: { r: summaryRowIdx + 3, c: 15 } }, // Teacher
      { s: { r: summaryRowIdx + 6, c: 1 }, e: { r: summaryRowIdx + 6, c: 4 } }, // Stamp
      { s: { r: summaryRowIdx + 6, c: 10 }, e: { r: summaryRowIdx + 6, c: 15 } }  // Sign
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "របាយការណ៍សិស្ស");

    const exportFileName = `TIS_Lab_Student_Monthly_Report_${now.toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, exportFileName);
    this.showToast(`បានទាញយកឯកសារ Excel ស្តង់ដារ "${exportFileName}" ដោយជោគជ័យ!`, "success");
  },

  // Official Standard Print Report (A4 with Kingdom Header, Totals, Attendance in Days, and Signatures)
  printStandardMonthlyReport(opts = {}) {
    let students = [];
    if (opts && (opts.shiftVal || opts.statusVal)) {
      const all = this.state.students || [];
      students = all.filter(s => {
        if (opts.statusVal && opts.statusVal !== "ALL") {
          if (opts.statusVal === "Active" && s.Status !== "Active") return false;
          if (opts.statusVal === "Graduated" && s.Status !== "Graduated") return false;
          if (opts.statusVal === "Dropped" && s.Status !== "Dropped" && s.Status !== "Drop" && !s.isBlocked) return false;
        }
        if (opts.shiftVal && opts.shiftVal !== "ALL") {
          if (!s.Shift || !s.Shift.includes(opts.shiftVal)) return false;
        }
        return true;
      });
    } else {
      students = this.state.filteredStudents && this.state.filteredStudents.length > 0
        ? this.state.filteredStudents
        : (this.state.students || []);
    }

    if (students.length === 0) {
      this.showToast("គ្មានទិន្នន័យសិស្សសម្រាប់បោះពុម្ពឡើយ!", "warning");
      return;
    }

    const khmerMonths = [
      "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
      "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
    ];
    const now = new Date();
    const currentKhmerMonth = opts.monthLabel || `ខែ${khmerMonths[now.getMonth()]} ឆ្នាំ${now.getFullYear()}`;
    const shiftText = opts.shiftVal && opts.shiftVal !== "ALL" ? `វេន${opts.shiftVal}` : "គ្រប់វេនសិក្សា";
    const statusText = opts.statusVal && opts.statusVal !== "ALL" ? (opts.statusVal === "Active" ? "កំពុងសិក្សា" : opts.statusVal) : "សិស្សទាំងអស់";

    let femaleCount = 0;
    let sumPresentDays = 0;
    let sumAbsentDays = 0;
    let sumPermDays = 0;

    const rows = students.map((s, i) => {
      const days = this.getStudentDaysInfo(s);
      const att = StudentAPI.getStudentAttendanceSummary(s.ID);
      const presentDays = (att && att.totalDays > 0) ? (att.present || 0) : (days.daysElapsed || 0);
      const absentDays = (att && att.absent) ? att.absent : 0;
      const permDays = (att && att.permission) ? att.permission : 0;

      if (s.Gender === "ស្រី" || s.Gender === "Female" || s.Gender === "F") femaleCount++;
      sumPresentDays += presentDays;
      sumAbsentDays += absentDays;
      sumPermDays += permDays;

      const isDropped = (s.Status === "Dropped" || s.Status === "Drop" || s.isBlocked);
      const statusKh = isDropped ? "បោះបង់" : (s.Status === "Graduated" ? "បញ្ចប់" : "កំពុងរៀន");
      const statusColor = isDropped ? "#dc2626" : (s.Status === "Graduated" ? "#2563eb" : "#047857");

      return `
        <tr style="vertical-align: middle;">
          <td style="text-align: center; font-weight: 700; white-space: nowrap;">${i + 1}</td>
          <td style="font-weight: 700; color: #1e3a8a; text-align: center; font-family: monospace; white-space: nowrap;">${this.escapeHtml(s.ID || '')}</td>
          <td style="font-weight: 700; text-align: left; padding-left: 8px; white-space: nowrap;">${this.escapeHtml(s.NameKh || '')}</td>
          <td style="font-size: 11px; text-align: left; padding-left: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.escapeHtml(s.NameEn || '—')}</td>
          <td style="text-align: center; white-space: nowrap;">${this.escapeHtml(s.Gender || '')}</td>
          <td style="text-align: center; white-space: nowrap;">${this.escapeHtml(s.Course || s.Grade || 'កុំព្យូទ័រ')}</td>
          <td style="text-align: center; white-space: nowrap;">${this.escapeHtml(s.Shift || '—')}</td>
          <td style="text-align: center; font-size: 11px; font-family: monospace; white-space: nowrap;">${days.startDate || '—'}</td>
          <td style="text-align: center; font-weight: 800; color: #047857; white-space: nowrap; background: #ecfdf5;">${presentDays} ថ្ងៃ</td>
          <td style="text-align: center; white-space: nowrap; background: #fef2f2; ${absentDays > 0 ? 'color: #dc2626; font-weight: 800;' : 'color: #94a3b8;'}">${absentDays} ថ្ងៃ</td>
          <td style="text-align: center; white-space: nowrap; background: #fffbeb; ${permDays > 0 ? 'color: #d97706; font-weight: 800;' : 'color: #94a3b8;'}">${permDays} ថ្ងៃ</td>
          <td style="font-size: 11px; text-align: center; font-family: monospace; white-space: nowrap;">${this.escapeHtml(s.Phone || s.GuardianPhone || '—')}</td>
          <td style="text-align: center; font-size: 11px; font-weight: 700; white-space: nowrap; color: ${statusColor};">${statusKh}</td>
        </tr>
      `;
    }).join("");

    const khmerDigits = ["០","១","២","៣","៤","៥","៦","៧","៨","៩"];
    const toKhmerNum = (num) => String(num).split("").map(c => khmerDigits[parseInt(c)] || c).join("");
    const dayKh = String(now.getDate()).padStart(2, '0');

    let printWindow = null;
    try {
      printWindow = window.open("", "_blank", "width=1200,height=800");
    } catch (e) {
      printWindow = null;
    }

    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>របាយការណ៍សិស្ស និងវត្តមានប្រចាំខែ - TIS Lab Computer</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <style>
          @page {
            size: A4 landscape;
            margin: 8mm 10mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: 'Kantumruy Pro', sans-serif;
            background: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 18px 24px;
            font-size: 12px;
            line-height: 1.4;
          }
          @media print {
            body {
              background: #fff !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print { display: none !important; }
            .print-page-container {
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
            }
          }
          .no-print-bar {
            background: #1e293b;
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .print-btn {
            background: #059669;
            color: #fff;
            border: none;
            padding: 8px 18px;
            border-radius: 6px;
            font-family: inherit;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .close-btn {
            background: #475569;
            color: #fff;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            font-family: inherit;
            cursor: pointer;
          }
          .print-page-container {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .royal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 14px;
          }
          .school-info { text-align: left; }
          .kingdom-info { text-align: center; }
          .report-title-block {
            text-align: center;
            margin: 14px 0 16px 0;
            border-top: 1px dashed #cbd5e1;
            border-bottom: 1px dashed #cbd5e1;
            padding: 10px 0;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 14px;
          }
          .stat-box {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 6px 10px;
            text-align: center;
            background: #f8fafc;
          }
          .stat-label { font-size: 10px; color: #64748b; font-weight: 600; }
          .stat-val { font-size: 14px; font-weight: 800; }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 14px;
            border: 1px solid #94a3b8;
          }
          th, td {
            border: 1px solid #94a3b8;
            padding: 6px 8px;
            vertical-align: middle;
          }
          th {
            background: #f1f5f9;
            color: #1e293b;
            font-weight: 800;
            text-align: center;
            vertical-align: middle;
            height: 34px;
            white-space: nowrap;
          }
          tr:nth-child(even) td { background: #f8fafc; }
          tr:nth-child(even) td[style*="background: #ecfdf5"] { background: #e6f9f0 !important; }
          tr:nth-child(even) td[style*="background: #fef2f2"] { background: #fde8e8 !important; }
          tr:nth-child(even) td[style*="background: #fffbeb"] { background: #fef3c7 !important; }
          .signatures-container {
            margin-top: 24px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .sign-col {
            text-align: center;
            width: 38%;
          }
        </style>
      </head>
      <body>
        <div class="no-print no-print-bar">
          <div style="font-weight: 700;">
            <i class="fa-solid fa-print text-emerald-400"></i> មើលគំរូទម្រង់បោះពុម្ព A4 ផ្លូវការ (Standard Monthly Print Preview)
          </div>
          <div style="display: flex; gap: 10px;">
            <button type="button" class="print-btn" onclick="window.print()">
              <i class="fa-solid fa-print"></i> បោះពុម្ពឯកសារ (Print)
            </button>
            <button type="button" class="close-btn" onclick="window.close()">បិទ</button>
          </div>
        </div>

        <div class="print-page-container">
          <!-- Official Cambodian Royal Header -->
          <div class="royal-header">
            <div class="school-info">
              <div style="font-size: 13px; font-weight: 800; color: #0f172a;">មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័រ TIS Lab Computer</div>
              <div style="font-size: 11px; color: #475569; font-weight: 600;">ផ្នែក៖ គ្រប់គ្រងសិស្ស និងបច្ចេកវិទ្យាកុំព្យូទ័រ</div>
              <div style="font-size: 10px; color: #64748b;">អាសយដ្ឋាន៖ ខេត្តកំពត | ទូរស័ព្ទ៖ 071 721 0307</div>
            </div>
            <div class="kingdom-info">
              <div style="font-size: 14px; font-weight: 800; color: #1e3a8a;">ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div style="font-size: 12px; font-weight: 700; color: #1e3a8a; letter-spacing: 1px;">ជាតិ  សាសនា  ព្រះមហាក្សត្រ</div>
              <div style="font-size: 11px; color: #d97706; margin-top: 2px;">--- 🪷 ---</div>
            </div>
          </div>

          <!-- Report Title -->
          <div class="report-title-block">
            <div style="font-size: 16px; font-weight: 800; color: #064e3b; text-transform: uppercase;">
              របាយការណ៍សិស្ស និងវត្តមានប្រចាំខែ
            </div>
            <div style="font-size: 10.5px; font-weight: 700; color: #047857; letter-spacing: 0.5px; margin-top: 1px;">
              MONTHLY STUDENT ATTENDANCE & PERFORMANCE REPORT
            </div>
            <div style="font-size: 11px; color: #334155; margin-top: 4px; font-weight: 500;">
              <span><strong>ប្រចាំខែ៖</strong> ${currentKhmerMonth}</span> &nbsp;|&nbsp;
              <span><strong>វេនសិក្សា៖</strong> ${shiftText}</span> &nbsp;|&nbsp;
              <span><strong>ស្ថានភាព៖</strong> ${statusText}</span> &nbsp;|&nbsp;
              <span><strong>កាលបរិច្ឆេទបញ្ចេញ៖</strong> ${now.toLocaleDateString('km-KH')}</span>
            </div>
          </div>

          <!-- Summary Metric Cards -->
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-label">សិស្សសរុប (នាក់)</div>
              <div class="stat-val" style="color: #1e3a8a;">${students.length} នាក់ (ស្រី ${femaleCount})</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">វត្តមានសរុប (ថ្ងៃ)</div>
              <div class="stat-val" style="color: #059669;">${sumPresentDays} ថ្ងៃ</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">អវត្តមានសរុប (ថ្ងៃ)</div>
              <div class="stat-val" style="color: #dc2626;">${sumAbsentDays} ថ្ងៃ</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">សុំច្បាប់សរុប (ថ្ងៃ)</div>
              <div class="stat-val" style="color: #d97706;">${sumPermDays} ថ្ងៃ</div>
            </div>
          </div>

          <!-- Main Table: Attendance strictly in Days, NOT Percentage -->
          <table>
            <thead>
              <tr style="vertical-align: middle;">
                <th style="width: 38px; text-align: center;">ល.រ</th>
                <th style="width: 58px; text-align: center;">អត្តលេខ</th>
                <th style="min-width: 130px; text-align: left; padding-left: 8px;">គោត្តនាម និងនាម</th>
                <th style="width: 95px; text-align: left; padding-left: 6px;">ឈ្មោះឡាតាំង</th>
                <th style="width: 42px; text-align: center;">ភេទ</th>
                <th style="width: 75px; text-align: center;">វគ្គសិក្សា</th>
                <th style="width: 48px; text-align: center;">វេន</th>
                <th style="width: 92px; text-align: center;">ថ្ងៃចូលរៀន</th>
                <th style="width: 85px; text-align: center; background: #ecfdf5; color: #065f46;">វត្តមាន (ថ្ងៃ)</th>
                <th style="width: 80px; text-align: center; background: #fef2f2; color: #991b1b;">អវត្តមាន (ថ្ងៃ)</th>
                <th style="width: 75px; text-align: center; background: #fffbeb; color: #92400e;">ច្បាប់ (ថ្ងៃ)</th>
                <th style="width: 95px; text-align: center;">លេខទូរស័ព្ទ</th>
                <th style="width: 70px; text-align: center;">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
            <tfoot>
              <tr style="background: #f1f5f9; font-weight: 700; vertical-align: middle;">
                <td colspan="8" style="text-align: right; padding-right: 14px; font-weight: 800; font-size: 11.5px; background: #f1f5f9; border: 1px solid #94a3b8;">
                  សរុបរួម (${students.length} នាក់ / ស្រី ${femaleCount} នាក់) ៖
                </td>
                <td style="text-align: center; color: #047857; font-weight: 800; background: #d1fae5; border: 1px solid #94a3b8; white-space: nowrap;">${sumPresentDays} ថ្ងៃ</td>
                <td style="text-align: center; color: #b91c1c; font-weight: 800; background: #fee2e2; border: 1px solid #94a3b8; white-space: nowrap;">${sumAbsentDays} ថ្ងៃ</td>
                <td style="text-align: center; color: #b45309; font-weight: 800; background: #fef3c7; border: 1px solid #94a3b8; white-space: nowrap;">${sumPermDays} ថ្ងៃ</td>
                <td colspan="2" style="text-align: center; font-size: 10px; color: #64748b; background: #f1f5f9; border: 1px solid #94a3b8; white-space: nowrap;">គិតជាចំនួនថ្ងៃពិតប្រាកដ</td>
              </tr>
            </tfoot>
          </table>

          <!-- Signatures Block -->
          <div class="signatures-container">
            <div class="sign-col">
              <div style="font-weight: 700; color: #0f172a;">បានឃើញ និងឯកភាព</div>
              <div style="font-weight: 700; font-size: 12px; margin-top: 2px;">នាយកមជ្ឈមណ្ឌល TIS Lab Computer</div>
              <div style="height: 60px;"></div>
              <div style="font-style: italic; color: #64748b; font-size: 10px;">(ហត្ថលេខា និងត្រាផ្លូវការ)</div>
            </div>
            <div class="sign-col">
              <div style="color: #334155; font-size: 11px;">ខេត្តកំពត ថ្ងៃទី${toKhmerNum(dayKh)} ${currentKhmerMonth}</div>
              <div style="font-weight: 700; font-size: 12px; margin-top: 2px;">គ្រូបន្ទុកថ្នាក់ / អ្នករៀបចំរបាយការណ៍</div>
              <div style="height: 60px;"></div>
              <div style="font-style: italic; color: #64748b; font-size: 10px;">(ហត្ថលេខា និងឈ្មោះ)</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (e) {
      window.print();
    }
  },

  // Legacy bridge
  printStudentTable() {
    this.printStandardMonthlyReport();
  },

  // Legacy bridge
  exportToCsv() {
    this.exportStandardMonthlyExcel();
  },

  // Themes & UI Utilities
  initTheme() {
    const savedTheme = localStorage.getItem(APP_CONFIG.STORAGE_KEY_THEME) || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_THEME, next);

    const icon = document.getElementById("themeIcon");
    if (icon) {
      icon.className = next === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    DashboardCharts.updateTheme();
  },

  animateCounter(elementId, targetValue) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const start = parseInt(el.textContent, 10) || 0;
    if (start === targetValue) {
      el.textContent = targetValue;
      return;
    }
    const duration = 600;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (targetValue - start) * easeOut);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = targetValue;
      }
    }
    requestAnimationFrame(update);
  },

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    
    let iconClass = "fa-circle-info";
    if (type === "success") iconClass = "fa-circle-check";
    else if (type === "error") iconClass = "fa-circle-exclamation";
    else if (type === "warning") iconClass = "fa-triangle-exclamation";

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  },

  showLoader(show) {
    const loader = document.getElementById("globalLoader");
    if (!loader) return;
    if (show) loader.classList.add("active");
    else loader.classList.remove("active");
  },

  triggerConfetti() {
    if (typeof confetti === "function") {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  },

  getDefaultAvatar(gender) {
    if (gender === "ស្រី" || gender === "Female") {
      return "assets/images/default-female.svg";
    }
    return "assets/images/default-male.svg";
  },

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  // ------------------------------------------------------------------------
  // PUBLIC DIGITAL CERTIFICATE QR VERIFICATION PORTAL
  // ------------------------------------------------------------------------
  mountVerifyCertScreen() {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    // Parse params from hash
    const hash = window.location.hash;
    let studentId = "";
    let certNo = "";

    if (hash.includes("?")) {
      const query = hash.split("?")[1] || "";
      const params = new URLSearchParams(query);
      studentId = params.get("id") || "";
      certNo = params.get("cert") || "";
    } else if (hash.includes("-") && hash !== "#verify-cert") {
      studentId = hash.replace("#verify-cert-", "").trim();
    }

    if (!studentId && typeof StudentAPI !== "undefined") {
      const local = StudentAPI.getLocalStudents();
      if (local && local.length > 0) studentId = local[0].ID;
    }

    const certData = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.getCertificateVerificationData)
      ? TeacherToolsService.getCertificateVerificationData(studentId, certNo)
      : null;

    appEl.innerHTML = `
      <div style="min-height: 100vh; background: radial-gradient(circle at top, #1e1b4b, #0f172a 70%); display: flex; align-items: center; justify-content: center; padding: 24px; font-family: 'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif;">
        <div style="max-width: 600px; width: 100%; background: rgba(15, 23, 42, 0.85); border: 2px solid rgba(56, 189, 248, 0.3); border-radius: 24px; padding: 32px 28px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); backdrop-filter: blur(16px); color: #fff; text-align: center; position: relative;">
          
          <!-- School Branding -->
          <div style="margin-bottom: 20px;">
            <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #0284c7, #38bdf8); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 1.6rem; color: #fff; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <h2 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: #38bdf8;">TIS LAB COMPUTER</h2>
            <div style="font-size: 0.8rem; color: #94a3b8; letter-spacing: 1px;">CENTER OF COMPUTER & DIGITAL SKILLS</div>
          </div>

          ${certData ? `
            <!-- Verified Success Badge -->
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10b981; color: #34d399; padding: 6px 16px; border-radius: 30px; font-size: 0.85rem; font-weight: 700; margin-bottom: 24px;">
              <i class="fa-solid fa-circle-check" style="font-size: 1.1rem;"></i>
              <span>វិញ្ញាបនបត្រមានសុពលភាពផ្លូវការ (Authentic)</span>
            </div>

            <!-- Student Card -->
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin-bottom: 24px; text-align: left;">
              <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px;">
                <img src="${certData.avatar || this.getDefaultAvatar(certData.gender)}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 3px solid #38bdf8;" alt="Photo">
                <div>
                  <h3 style="margin: 0 0 4px 0; font-size: 1.25rem; font-weight: 800; color: #f8fafc;">${certData.nameKh}</h3>
                  <div style="font-size: 0.95rem; font-weight: 700; color: #94a3b8; font-family: 'Plus Jakarta Sans', sans-serif;">${certData.nameEn}</div>
                  <div style="font-size: 0.8rem; color: #38bdf8; font-family: monospace; margin-top: 2px;">ID: ${certData.studentId}</div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.85rem;">
                <div>
                  <div style="color: #94a3b8; font-size: 0.75rem;">វគ្គសិក្សាបញ្ចប់</div>
                  <strong style="color: #fbbf24;">${certData.course}</strong>
                </div>
                <div>
                  <div style="color: #94a3b8; font-size: 0.75rem;">និទ្ទេសបញ្ចប់វគ្គ</div>
                  <strong style="color: #34d399;">${certData.grade}</strong>
                </div>
                <div>
                  <div style="color: #94a3b8; font-size: 0.75rem;">កាលបរិច្ឆេទចេញប័ណ្ណ</div>
                  <strong style="color: #e2e8f0;">${certData.issueDate}</strong>
                </div>
                <div>
                  <div style="color: #94a3b8; font-size: 0.75rem;">លេខវិញ្ញាបនបត្រ</div>
                  <strong style="color: #38bdf8; font-family: monospace;">${certData.certificateNo}</strong>
                </div>
              </div>
            </div>

            <!-- Instructor Stamp / Verified Watermark -->
            <div style="border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 14px; margin-bottom: 20px; font-size: 0.8rem; color: #94a3b8;">
              <div>គ្រូបង្ហាត់ និងចុះហត្ថលេខា៖ <strong>${certData.instructor}</strong></div>
              <div style="font-size: 0.72rem; color: #64748b; margin-top: 4px;">ទិន្នន័យត្រូវបានផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិតាមរយៈប្រព័ន្ធ TIS Lab Database</div>
            </div>
          ` : `
            <!-- Invalid Warning -->
            <div style="background: rgba(239, 68, 68, 0.12); border: 1.5px solid #ef4444; color: #f87171; padding: 20px; border-radius: 16px; margin-bottom: 24px;">
              <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 8px;"></i>
              <h3 style="margin: 0 0 6px 0; font-size: 1.1rem; color: #fca5a5;">រកមិនឃើញវិញ្ញាបនបត្រនេះទេ</h3>
              <p style="margin: 0; font-size: 0.85rem; color: #cbd5e1;">
                លេខកូដសិស្ស ឬលេខវិញ្ញាបនបត្រមិនត្រឹមត្រូវ ឬមិនទាន់បានចេញជាផ្លូវការនៅក្នុងប្រព័ន្ធ។
              </p>
            </div>
          `}

          <!-- Actions -->
          <div style="display: flex; justify-content: center; gap: 12px;">
            <a href="index.html" class="btn-primary" style="text-decoration: none; padding: 10px 24px; font-size: 0.88rem; font-weight: 700; background: linear-gradient(135deg, #0284c7, #2563eb); border: none; border-radius: 10px; display: inline-flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-house"></i> <span>ចូលទៅកាន់ប្រព័ន្ធ</span>
            </a>
          </div>

        </div>
      </div>
    `;
  },

  openQuickContactModal(studentId, defaultTab = 'payment') {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.openQuickContactModal) {
      ModalsComponent.openQuickContactModal(studentId, defaultTab);
    }
  },

  openQuickBatchGradingModal(shift, course) {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.openQuickBatchGradingModal) {
      ModalsComponent.openQuickBatchGradingModal(shift, course);
    }
  },

  openStudentReceiptModal(studentId, feeRecord = null) {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.openStudentReceiptModal) {
      ModalsComponent.openStudentReceiptModal(studentId, feeRecord);
    }
  },

  openClassAttendanceQrSheetModal(shift = "ព្រឹក") {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.openClassAttendanceQrSheetModal) {
      ModalsComponent.openClassAttendanceQrSheetModal(shift);
    }
  }
};

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

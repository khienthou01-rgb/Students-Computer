/**
 * Component: Top Header Bar
 */
const HeaderComponent = {
  render() {
    const isStudent = typeof AuthService !== "undefined" && AuthService.isStudent();
    const currentUser = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) || null;

    return `
      <header class="top-header">
        <div class="header-left">
          ${isStudent ? `
            <div class="student-header-brand" style="display: flex; align-items: center; gap: 12px;">
              <div class="login-brand-icon" style="width: 42px; height: 42px; font-size: 1.2rem;">
                <i class="fa-solid fa-laptop-code"></i>
              </div>
              <div class="page-title">
                <h2>TIS Lab Computer - គណនីសិស្សានុសិស្ស</h2>
                <p>តាមដានការសិក្សា វត្តមាន និងការប្រឡងបញ្ចប់វគ្គ</p>
              </div>
            </div>
          ` : `
            <button type="button" id="mobileToggle" class="mobile-toggle" aria-label="បើកម៉ឺនុយ">
              <i class="fa-solid fa-bars"></i>
            </button>
            <div class="page-title">
              <h2>TIS Lab Computer</h2>
              <p>ប្រព័ន្ធគ្រប់គ្រងសិស្ស ស្ថិតិសិក្សា និងបន្ទប់កុំព្យូទ័រ</p>
            </div>
          `}
        </div>

        <div class="header-right">
          <!-- Hidden Cloud Connection Indicator (for API state compatibility) -->
          <div id="cloudStatusBadge" style="display: none;"></div>
          <button type="button" id="headerSyncBtn" style="display: none;"></button>

          <!-- 1. Global System Search Button (Ctrl + K) -->
          <button type="button" id="btnOpenGlobalSearch" onclick="HeaderComponent.openGlobalSearch()" class="btn-global-search-trigger" title="ស្វែងរកសិស្ស, គ្រូ, ថ្នាក់រៀន, ឯកសារ (Shortcut: Ctrl + K)">
            <span class="search-trigger-content">
              <i class="fa-solid fa-magnifying-glass text-cyan-400"></i>
              <span class="search-placeholder-text">ស្វែងរក...</span>
            </span>
            <kbd>Ctrl K</kbd>
          </button>

          <!-- 2. Real-Time Digital Clock HUD -->
          <div class="digital-hud-clock" id="digitalHudClock" title="ពេលវេលាប្រព័ន្ធបច្ចុប្បន្ន (Live Realtime Clock)">
            <div class="hud-time-val">
              <i class="fa-regular fa-clock"></i>
              <span id="hudLiveTime">--:--:--</span>
              <span class="hud-pulse-dot" title="ប្រព័ន្ធឌីជីថលកំពុងដំណើរការ"></span>
            </div>
            <div class="hud-date-val" id="hudLiveDate">
              --/--/----
            </div>
          </div>

          <!-- 3. Notifications Dropdown Button -->
          <div style="position: relative;" id="notifDropdownContainer">
            <button type="button" id="btnNotificationsBell" onclick="HeaderComponent.toggleNotifDropdown()" class="theme-btn" style="position: relative;" title="ការជូនដំណឹងប្រព័ន្ធ (Notifications)">
              <i class="fa-regular fa-bell"></i>
              <span id="notifCountBadge" style="position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 6px #ef4444;"></span>
            </button>
            <div id="notifDropdownMenu" style="display: none; position: absolute; top: 48px; right: 0; width: 320px; background: var(--bg-surface, #0f172a); border: 1px solid var(--border-color, rgba(56, 189, 248, 0.25)); border-radius: 14px; box-shadow: 0 15px 35px rgba(0,0,0,0.45); z-index: 9999; padding: 12px; backdrop-filter: blur(14px);">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; margin-bottom: 8px;">
                <span style="font-weight: 800; font-size: 0.85rem; color: var(--text-main, #f8fafc);"><i class="fa-solid fa-bell text-amber-400"></i> ការជូនដំណឹង (Notifications)</span>
                <span style="font-size: 0.7rem; color: #10b981; font-weight: 700;">ថ្មី ៣</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.78rem;">
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); padding: 8px 10px; border-radius: 8px; color: #34d399;">
                  <i class="fa-solid fa-circle-check"></i> <strong>វត្តមានប្រចាំថ្ងៃ៖</strong> សិស្សបានកត់ត្រាវត្តមានពេញលេញ
                </div>
                <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); padding: 8px 10px; border-radius: 8px; color: #38bdf8;">
                  <i class="fa-solid fa-desktop"></i> <strong>Lab PC Monitor៖</strong> ម៉ាស៊ីនទាំងអស់ដំណើរការធម្មតា
                </div>
                <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); padding: 8px 10px; border-radius: 8px; color: #fbbf24;">
                  <i class="fa-solid fa-award"></i> <strong>ការប្រឡង៖</strong> ការប្រឡងវគ្គ Typing ជិតមកដល់
                </div>
              </div>
            </div>
          </div>

          ${!isStudent ? `
            <!-- 3.1 Teacher Automation Tools Mega Menu -->
            <div style="position: relative;" id="teacherToolsDropdownContainer">
              <button type="button" id="btnTeacherToolsMega" onclick="HeaderComponent.toggleTeacherToolsDropdown()" class="theme-btn" style="position: relative; background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(217, 119, 6, 0.2)); border: 1.5px solid rgba(234, 179, 8, 0.4); color: #fbbf24;" title="ឧបករណ៍ជំនួយគ្រូស្វ័យប្រវត្តិ (Teacher Tools)">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </button>
              <div id="teacherToolsDropdownMenu" style="display: none; position: absolute; top: 48px; right: 0; width: 320px; background: var(--bg-surface, #0f172a); border: 1.5px solid var(--border-color, rgba(234, 179, 8, 0.35)); border-radius: 14px; box-shadow: 0 20px 40px rgba(0,0,0,0.55); z-index: 9999; padding: 10px; backdrop-filter: blur(14px);">
                <div style="padding: 6px 10px 8px 10px; border-bottom: 1px solid rgba(255,255,255,0.08); font-weight: 800; font-size: 0.85rem; color: #fbbf24; display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-toolbox"></i> <span>ឧបករណ៍ជំនួយគ្រូ (Teacher Tools)</span>
                  </div>
                  <span style="font-size: 0.68rem; background: rgba(234, 179, 8, 0.2); color: #fbbf24; padding: 2px 6px; border-radius: 4px; font-weight: 700;">PRO</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 6px;">
                  <!-- 1. Ultimate Classroom HUD -->
                  <button type="button" class="dropdown-item-custom" style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 8px;" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openClassroomHud();">
                    <i class="fa-solid fa-chalkboard-user text-cyan-400"></i> <strong style="color: #38bdf8;">ផ្ទាំង Projector (Classroom HUD)</strong>
                  </button>
                  <!-- 2. Exam Package Generator Engine -->
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openExamPackageGeneratorModal();">
                    <i class="fa-solid fa-file-circle-check text-indigo-400"></i> <span>បង្កើតវិញ្ញាសា + ចម្លើយ + Rubric A4</span>
                  </button>
                  <!-- 3. Dropout Early Warning Radar -->
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openDropoutRadarModal();">
                    <i class="fa-solid fa-shield-halved text-rose-400"></i> <span>រ៉ាដាសិស្សប្រឈមបោះបង់ (Radar)</span>
                  </button>
                  <!-- 4. Khmer Calendar & National Holidays Telegram Broadcast -->
                  <button type="button" class="dropdown-item-custom" style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.28); border-radius: 8px;" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openKhmerCalendarModal();">
                    <i class="fa-solid fa-calendar-days text-amber-400"></i> <strong style="color: #fbbf24;">ប្រតិទិនបុណ្យជាតិ & Telegram</strong>
                  </button>
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openExamCountdownTimer(30);">
                    <i class="fa-solid fa-stopwatch text-sky-400"></i> <span>នាឡិកាកំណត់ម៉ោងប្រឡង (Timer)</span>
                  </button>
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openSchoolExpensesModal();">
                    <i class="fa-solid fa-wallet text-emerald-400"></i> <span>ចំណូល-ចំណាយ & ចំណេញសុទ្ធ</span>
                  </button>
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openPcMaintenanceModal();">
                    <i class="fa-solid fa-screwdriver-wrench text-blue-400"></i> <span>ស្ថានភាពម៉ាស៊ីន 16-PC Lab</span>
                  </button>
                  <button type="button" class="dropdown-item-custom" style="background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.28); border-radius: 8px;" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openTelegramHubModal();">
                    <i class="fa-brands fa-telegram text-sky-400"></i> <strong style="color: #38bdf8;">បញ្ជាគ្រុប Telegram ទាំង ៣ (Hub)</strong>
                  </button>
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openTop3HonorRollModal();">
                    <i class="fa-solid fa-trophy text-amber-400"></i> <span>ផ្ទាំងកិត្តិយសសិស្សឆ្នើម TOP 3</span>
                  </button>
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openExerciseLibraryModal();">
                    <i class="fa-solid fa-book-open text-indigo-400"></i> <span>បណ្ណាល័យវិញ្ញាសាអនុវត្ត A4</span>
                  </button>
                  <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 4px 0;"></div>
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); TeacherToolsService.printMonthlyAttendanceSheet();">
                    <i class="fa-solid fa-clipboard-user text-green-400"></i> <span>បោះពុម្ពវត្តមាន A4 ប្រចាំខែ</span>
                  </button>
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); TeacherToolsService.printExecutiveSummaryA4();">
                    <i class="fa-solid fa-chart-pie text-purple-400"></i> <span>របាយការណ៍សង្ខេប A4 ថ្នាក់ដឹកនាំ</span>
                  </button>
                  <button type="button" class="dropdown-item-custom" onclick="HeaderComponent.closeTeacherToolsDropdown(); TeacherToolsService.exportJsonBackup();">
                    <i class="fa-solid fa-download text-teal-400"></i> <span>ទាញយក JSON Backup ប្រព័ន្ធ</span>
                  </button>
                  <!-- 4. End of Day Wrap-Up -->
                  <button type="button" class="dropdown-item-custom" style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; margin-top: 4px;" onclick="HeaderComponent.closeTeacherToolsDropdown(); ModalsComponent.openEndOfDayWrapUpModal();">
                    <i class="fa-solid fa-moon text-emerald-400"></i> <strong style="color: #34d399;">បិទបញ្ជីចុងថ្ងៃ ៦:០០ ល្ងាច (Wrap-Up)</strong>
                  </button>
                </div>
              </div>
            </div>

            <!-- 3.2 Student Birthday Indicator Button -->
            <div id="headerBirthdayContainer" style="display: none;">
              <button type="button" id="btnHeaderBirthday" onclick="HeaderComponent.handleBirthdayAlertClick()" class="theme-btn" style="position: relative; background: rgba(244, 63, 94, 0.15); border: 1.5px solid #f43f5e; color: #f43f5e;" title="ថ្ងៃខួបកំណើតសិស្សថ្ងៃនេះ!">
                🎂
                <span id="headerBirthdayBadgeCount" style="position: absolute; top: -3px; right: -3px; background: #f43f5e; color: #fff; font-size: 0.65rem; font-weight: 800; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">1</span>
              </button>
            </div>
          ` : ''}

          <!-- 4. Theme Mode Switcher -->
          <button type="button" id="themeToggleBtn" class="theme-btn" title="ប្តូរ Dark / Light Mode" aria-label="ប្តូរពណ៌ Theme">
            <i id="themeIcon" class="fa-solid fa-moon"></i>
          </button>

          ${!isStudent ? `
            <!-- Fast Add Student Button (Teachers Only) -->
            <button type="button" class="btn-primary header-btn-register" data-action="quick-register" title="ចុះឈ្មោះសិស្សថ្មីចូលប្រព័ន្ធ">
              <i class="fa-solid fa-user-plus"></i>
              <span>ចុះឈ្មោះសិស្សថ្មី</span>
            </button>
          ` : ''}

          <!-- User Profile & Logout Component -->
          ${(() => {
            const user = currentUser || {
              nameKh: isStudent ? "សិស្ស" : "លោកគ្រូ ខៀន ធូ",
              role: isStudent ? "សិស្សានុសិស្ស" : "Admin & Instructor",
              avatar: "assets/images/default-male.svg"
            };
            const roleBadge = isStudent ? `🎓 សិស្ស (${user.id || 'TX'})` : 'Admin & គ្រូ';
            const fullRoleTitle = user.role || (isStudent ? 'សិស្សានុសិស្ស' : 'គ្រូបង្រៀន & អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin)');
            const borderColor = isStudent ? '#10b981' : '#8b5cf6';

            return `
              <div class="header-teacher-profile" title="${fullRoleTitle}">
                <div class="teacher-avatar-wrap">
                  <img src="${user.avatar || 'assets/images/default-male.svg'}" alt="${user.nameKh}" class="avatar-sm" style="border: 2px solid ${borderColor};" onerror="this.src='assets/images/default-male.svg'">
                  <span class="online-indicator-dot" title="កំពុង Online"></span>
                </div>
                <div class="teacher-meta-info">
                  <div class="teacher-name-kh font-bold">${user.nameKh}</div>
                  <div class="teacher-role-tag">${roleBadge}</div>
                </div>
                <button type="button" id="headerLogoutBtn" class="btn-logout" title="ចាកចេញពីប្រព័ន្ធ (Sign Out)">
                  <i class="fa-solid fa-right-from-bracket"></i>
                  <span>ចាកចេញ</span>
                </button>
              </div>
            `;
          })()}
        </div>
      </header>
    `;
  },

  initEvents() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }

    // Quick Add Button (Open Popup Modal)
    document.querySelectorAll("[data-action='quick-register']").forEach(btn => {
      btn.addEventListener("click", () => App.openAddStudentModal());
    });

    // Theme Toggle
    const themeToggle = document.getElementById("themeToggleBtn");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        App.toggleTheme();
      });
    }

    // Live Sync Button in Header
    const headerSyncBtn = document.getElementById("headerSyncBtn");
    if (headerSyncBtn) {
      headerSyncBtn.addEventListener("click", async () => {
        const icon = headerSyncBtn.querySelector("i");
        if (icon) icon.classList.add("fa-spin");
        headerSyncBtn.disabled = true;
        await App.loadData(true);
        if (icon) icon.classList.remove("fa-spin");
        headerSyncBtn.disabled = false;
        App.showToast("បានទាញយកទិន្នន័យពី Firebase ជោគជ័យ!", "success");
      });
    }

    // Teacher Logout Button in Header
    const headerLogoutBtn = document.getElementById("headerLogoutBtn");
    if (headerLogoutBtn) {
      headerLogoutBtn.addEventListener("click", () => {
        App.handleLogout();
      });
    }

    // Global Search shortcut (Ctrl + K or Cmd + K)
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        HeaderComponent.openGlobalSearch();
      }
      if (e.key === "Escape") {
        HeaderComponent.closeGlobalSearch();
        const notifMenu = document.getElementById("notifDropdownMenu");
        if (notifMenu) notifMenu.style.display = "none";
      }
    });

    // Close notifications dropdown when clicking outside
    document.addEventListener("click", (e) => {
      const container = document.getElementById("notifDropdownContainer");
      const notifMenu = document.getElementById("notifDropdownMenu");
      if (container && notifMenu && !container.contains(e.target)) {
        notifMenu.style.display = "none";
      }

      // Close teacher tools dropdown when clicking outside
      const ttContainer = document.getElementById("teacherToolsDropdownContainer");
      const ttMenu = document.getElementById("teacherToolsDropdownMenu");
      if (ttContainer && ttMenu && !ttContainer.contains(e.target)) {
        ttMenu.style.display = "none";
      }
    });

    // Initialize Realtime Digital Clock HUD
    this.startDigitalClock();

    // Check student birthdays
    this.checkTodayBirthdays();
  },

  toggleNotifDropdown() {
    const notifMenu = document.getElementById("notifDropdownMenu");
    if (!notifMenu) return;
    notifMenu.style.display = (notifMenu.style.display === "block") ? "none" : "block";
  },

  toggleTeacherToolsDropdown() {
    const menu = document.getElementById("teacherToolsDropdownMenu");
    if (!menu) return;
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
  },

  closeTeacherToolsDropdown() {
    const menu = document.getElementById("teacherToolsDropdownMenu");
    if (menu) menu.style.display = "none";
  },

  checkTodayBirthdays() {
    if (typeof TeacherToolsService === "undefined" || !TeacherToolsService.getTodayBirthdays) return;
    const birthdays = TeacherToolsService.getTodayBirthdays();
    const container = document.getElementById("headerBirthdayContainer");
    const badge = document.getElementById("headerBirthdayBadgeCount");

    if (container && birthdays.length > 0) {
      container.style.display = "block";
      if (badge) badge.textContent = birthdays.length;
    } else if (container) {
      container.style.display = "none";
    }
  },

  async handleBirthdayAlertClick() {
    if (typeof TeacherToolsService === "undefined" || !TeacherToolsService.getTodayBirthdays) return;
    const birthdays = TeacherToolsService.getTodayBirthdays();
    if (birthdays.length === 0) {
      App.showToast("គ្មានសិស្សមានថ្ងៃខួបកំណើតនៅថ្ងៃនេះទេ!", "info");
      return;
    }

    const studentNames = birthdays.map(s => `• ${s.NameKh} (${s.ID} - វេន${s.Shift || 'ព្រឹក'})`).join("\n");
    const confirmed = confirm(
      `🎂 សិស្សដែលមានថ្ងៃខួបកំណើតថ្ងៃនេះ (${birthdays.length} នាក់)៖\n\n${studentNames}\n\nតើលោកគ្រូចង់ផ្ញើសារជូនពរស្វ័យប្រវត្តិតាម Telegram ដែរឬទេ?`
    );

    if (confirmed) {
      for (const student of birthdays) {
        await TeacherToolsService.sendBirthdayWishToTelegram(student);
      }
    }
  },

  openGlobalSearch() {
    let modal = document.getElementById("globalSearchModal");
    if (!modal) {
      const div = document.createElement("div");
      div.id = "globalSearchModal";
      div.className = "global-search-modal show";
      div.innerHTML = `
        <div class="global-search-box" onclick="event.stopPropagation()">
          <div class="global-search-header">
            <i class="fa-solid fa-magnifying-glass text-cyan-400"></i>
            <input type="text" id="globalSearchInputField" class="global-search-input" placeholder="វាយស្វែងរកសិស្ស, គ្រូ, ថ្នាក់រៀន, ឯកសារ..." oninput="HeaderComponent.executeGlobalSearch(this.value)" autocomplete="off">
            <kbd style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); padding: 2px 7px; border-radius: 4px; font-size: 0.72rem; color: #94a3b8; cursor: pointer;" onclick="HeaderComponent.closeGlobalSearch()">ESC</kbd>
          </div>
          <div class="global-search-results" id="globalSearchResultsMount">
            <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
              <i class="fa-solid fa-keyboard" style="font-size: 1.5rem; margin-bottom: 8px; color: #38bdf8;"></i>
              <p>វាយឈ្មោះសិស្ស, លេខសម្គាល់ (ID), វគ្គសិក្សា, ឬឈ្មោះគ្រូ ដើម្បីស្វែងរកភ្លាមៗ</p>
            </div>
          </div>
        </div>
      `;
      div.addEventListener("click", () => HeaderComponent.closeGlobalSearch());
      document.body.appendChild(div);
      modal = div;
    } else {
      modal.classList.add("show");
    }

    setTimeout(() => {
      const input = document.getElementById("globalSearchInputField");
      if (input) {
        input.value = "";
        input.focus();
      }
    }, 50);
  },

  closeGlobalSearch() {
    const modal = document.getElementById("globalSearchModal");
    if (modal) modal.classList.remove("show");
  },

  executeGlobalSearch(query) {
    const q = (query || "").trim().toLowerCase();
    const mount = document.getElementById("globalSearchResultsMount");
    if (!mount) return;

    if (!q) {
      mount.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          <i class="fa-solid fa-keyboard" style="font-size: 1.5rem; margin-bottom: 8px; color: #38bdf8;"></i>
          <p>វាយឈ្មោះសិស្ស, លេខសម្គាល់ (ID), វគ្គសិក្សា, ឬឈ្មោះគ្រូ ដើម្បីស្វែងរកភ្លាមៗ</p>
        </div>
      `;
      return;
    }

    const students = App.state.students || [];
    const matchedStudents = students.filter(s => 
      (s.NameKh && s.NameKh.toLowerCase().includes(q)) ||
      (s.NameEn && s.NameEn.toLowerCase().includes(q)) ||
      (s.ID && s.ID.toLowerCase().includes(q)) ||
      (s.Course && s.Course.toLowerCase().includes(q))
    ).slice(0, 5);

    let html = '';

    if (matchedStudents.length > 0) {
      html += `<div style="font-size: 0.72rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; padding: 6px 12px; letter-spacing: 0.5px;">👨‍🎓 សិស្សានុសិស្ស (Students):</div>`;
      matchedStudents.forEach(s => {
        html += `
          <div class="search-result-item" onclick="HeaderComponent.selectSearchResult('student', '${s.ID}')">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" onerror="this.src='${App.getDefaultAvatar('M')}'">
              <div>
                <div style="font-weight: 800; font-size: 0.88rem; color: #f8fafc;">${s.NameKh} <span style="font-size: 0.75rem; color: #94a3b8;">(${s.NameEn || ''})</span></div>
                <div style="font-size: 0.72rem; color: #34d399;">ID: ${s.ID} • ${s.Course || 'ថ្នាក់កុំព្យូទ័រ'} • ${s.Shift || 'វេនព្រឹក'}</div>
              </div>
            </div>
            <span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 0.7rem;">ពិនិត្យ</span>
          </div>
        `;
      });
    }

    // Computer Modules matching
    const modules = [
      { name: "Typing & Khmer Unicode", desc: "វគ្គដំបូង: វាយអត្ថបទរហ័ស & ស្ទាត់", tab: "exams" },
      { name: "Microsoft Word រដ្ឋបាល", desc: "រៀបចំឯកសារ តារាង & កិច្ចការរដ្ឋបាល", tab: "exams" },
      { name: "Microsoft Excel & Formulas", desc: "រូបមន្ត គណនាលេខ & វិក្កយបត្រ", tab: "exams" },
      { name: "Microsoft PowerPoint", desc: "រៀបចំស្លាយ បទបង្ហាញ & ចលនា", tab: "exams" },
      { name: "PC Lab Monitor & Timetable", desc: "ប្រព័ន្ធតាមដានអេក្រង់ & កាលវិភាគ", tab: "timetable" }
    ];

    const matchedModules = modules.filter(m => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
    if (matchedModules.length > 0) {
      html += `<div style="font-size: 0.72rem; font-weight: 800; color: #c084fc; text-transform: uppercase; padding: 10px 12px 6px 12px; letter-spacing: 0.5px;">💻 វគ្គសិក្សា & មុខងារ (Courses & Tools):</div>`;
      matchedModules.forEach(m => {
        html += `
          <div class="search-result-item" onclick="HeaderComponent.selectSearchResult('module', '${m.tab}')">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(192, 132, 252, 0.15); display: flex; align-items: center; justify-content: center; color: #c084fc;">
                <i class="fa-solid fa-laptop-code"></i>
              </div>
              <div>
                <div style="font-weight: 800; font-size: 0.86rem; color: #f8fafc;">${m.name}</div>
                <div style="font-size: 0.72rem; color: #94a3b8;">${m.desc}</div>
              </div>
            </div>
            <span class="badge" style="background: rgba(192, 132, 252, 0.15); color: #c084fc; font-size: 0.7rem;">បើកមើល</span>
          </div>
        `;
      });
    }

    if (!html) {
      html = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          <i class="fa-solid fa-circle-exclamation text-amber-400" style="font-size: 1.5rem; margin-bottom: 8px;"></i>
          <p>រកមិនឃើញលទ្ធផលសម្រាប់ «<strong>${App.escapeHtml(q)}</strong>» ទេ</p>
        </div>
      `;
    }

    mount.innerHTML = html;
  },

  selectSearchResult(type, id) {
    this.closeGlobalSearch();
    if (type === 'student') {
      App.switchTab('directory');
      setTimeout(() => {
        if (typeof App !== "undefined" && App.viewStudentDetails) {
          App.viewStudentDetails(id);
        }
      }, 200);
    } else if (type === 'module') {
      App.switchTab(id);
    }
  },

  startDigitalClock() {
    const updateTime = () => {
      const timeEl = document.getElementById("hudLiveTime");
      const dateEl = document.getElementById("hudLiveDate");
      if (!timeEl) return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${hours}:${minutes}:${seconds}`;

      if (dateEl) {
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        dateEl.textContent = `${day}/${month}/${year}`;
      }
    };

    updateTime();
    if (this._clockTimer) clearInterval(this._clockTimer);
    this._clockTimer = setInterval(updateTime, 1000);
  },

  updateCloudBadge(isConnected) {
    const badge = document.getElementById("cloudStatusBadge");
    if (!badge) return;

    if (isConnected) {
      badge.className = "cloud-status-badge status-connected";
      badge.innerHTML = `<i class="fa-solid fa-fire text-amber-500"></i> <span>Firebase (Live)</span>`;
    } else {
      badge.className = "cloud-status-badge status-local";
      badge.innerHTML = `<i class="fa-solid fa-cloud"></i> <span>Local (Demo)</span>`;
    }
  }
};

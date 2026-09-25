/**
 * Component: Sidebar Navigation (Organized with Collapsible Dropdown Accordions)
 */
const SidebarComponent = {
  // Storage key for user expanded categories
  STORAGE_KEY_OPEN_GROUPS: "ms_sidebar_open_groups",

  getOpenGroups() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_OPEN_GROUPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default open groups
    return ["students", "smartlab", "exams", "comm", "finance"];
  },

  saveOpenGroups(groups) {
    try {
      localStorage.setItem(this.STORAGE_KEY_OPEN_GROUPS, JSON.stringify(groups));
    } catch (e) {}
  },

  toggleGroup(groupId) {
    const el = document.querySelector(`.sidebar-group[data-group="${groupId}"]`);
    if (!el) return;

    el.classList.toggle("open");
    const isOpen = el.classList.contains("open");

    const groups = this.getOpenGroups();
    const idx = groups.indexOf(groupId);
    if (isOpen && idx === -1) {
      groups.push(groupId);
    } else if (!isOpen && idx !== -1) {
      groups.splice(idx, 1);
    }
    this.saveOpenGroups(groups);
  },

  expandGroupForTab(tabId) {
    const link = document.querySelector(`.sidebar-sub-menu [data-tab="${tabId}"]`);
    if (link) {
      const parentGroup = link.closest(".sidebar-group");
      if (parentGroup && !parentGroup.classList.contains("open")) {
        const groupId = parentGroup.getAttribute("data-group");
        if (groupId) this.toggleGroup(groupId);
      }
    }
  },

  render() {
    const openGroups = this.getOpenGroups();
    const isGroupOpen = (id) => openGroups.includes(id) ? "open" : "";

    return `
      <aside id="sidebar" class="sidebar">
        <div class="sidebar-header">
          <div class="brand-logo" title="TIS Lab Computer">
            <i class="fa-solid fa-laptop-code"></i>
          </div>
          <div class="brand-info">
            <h1>TIS Lab Computer</h1>
            <p>ប្រព័ន្ធគ្រប់គ្រងសិស្ស & Lab</p>
          </div>
        </div>

        <nav class="sidebar-menu">
          <!-- 1. ផ្ទាំងគ្រប់គ្រងមេ (Dashboard) -->
          <div class="menu-category">ទិដ្ឋភាពទូទៅ (Overview)</div>
          
          <button type="button" class="nav-link active" data-tab="dashboard" id="nav-dashboard" title="ផ្ទាំងគ្រប់គ្រងទូទៅ">
            <i class="fa-solid fa-chart-pie text-cyan-400"></i>
            <span>ផ្ទាំងគ្រប់គ្រង (Dashboard)</span>
          </button>

          <!-- 2. គ្រប់គ្រងសិស្ស & គ្រូ (Students & Staff) -->
          <div class="sidebar-group ${isGroupOpen('students')}" data-group="students">
            <button type="button" class="sidebar-group-toggle" onclick="SidebarComponent.toggleGroup('students')">
              <div class="group-toggle-left">
                <i class="fa-solid fa-user-group text-blue-400"></i>
                <span>គ្រប់គ្រងសិស្ស (Students)</span>
              </div>
              <i class="fa-solid fa-chevron-down group-arrow"></i>
            </button>
            <div class="sidebar-sub-menu">
              <button type="button" class="nav-link sub-link" data-tab="directory" id="nav-directory" title="បញ្ជីឈ្មោះសិស្ស">
                <i class="fa-solid fa-users text-blue-300"></i>
                <span>បញ្ជីសិស្ស (Students)</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="register" id="nav-register" title="ចុះឈ្មោះសិស្សថ្មី">
                <i class="fa-solid fa-user-plus text-emerald-400"></i>
                <span>ចុះឈ្មោះសិស្ស (Enroll)</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="graduated" id="nav-graduated" title="សិស្សបញ្ចប់ការសិក្សា">
                <i class="fa-solid fa-graduation-cap text-green-400"></i>
                <span>បញ្ចប់ការសិក្សា (Graduated)</span>
                <span id="sidebarGraduatedCount" class="badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-size: 0.72rem; padding: 2px 7px; border-radius: 10px; margin-left: auto;">0</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="dropped" id="nav-dropped" title="សិស្សបោះបង់ការសិក្សា">
                <i class="fa-solid fa-user-xmark text-rose-400"></i>
                <span>បោះបង់ (Dropped)</span>
                <span id="sidebarDroppedCount" class="badge" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; font-size: 0.72rem; padding: 2px 7px; border-radius: 10px; margin-left: auto;">0</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="teachers" id="nav-teachers" title="គ្រប់គ្រងគ្រូបង្រៀន">
                <i class="fa-solid fa-chalkboard-user text-sky-400"></i>
                <span>គ្រូបង្រៀន (Teachers)</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="classes" id="nav-classes" title="ថ្នាក់កុំព្យូទ័ររដ្ឋបាល">
                <i class="fa-solid fa-school text-indigo-400"></i>
                <span>ថ្នាក់កុំព្យូទ័រ (Classes)</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="subjects" id="nav-subjects" title="មុខវិជ្ជា & កម្មវិធីសិក្សា">
                <i class="fa-solid fa-book-open-reader text-purple-400"></i>
                <span>មុខវិជ្ជា (Subjects)</span>
              </button>
            </div>
          </div>

          <!-- 3. ថ្នាក់រៀន & បន្ទប់ Lab (Smart Lab & Teaching Arena) -->
          <div class="menu-category">ឧបករណ៍ជំនួយគ្រូ & LAB (TEACHER TOOLS)</div>

          <div class="sidebar-group ${isGroupOpen('smartlab')}" data-group="smartlab">
            <button type="button" class="sidebar-group-toggle" onclick="SidebarComponent.toggleGroup('smartlab')">
              <div class="group-toggle-left">
                <i class="fa-solid fa-laptop-code text-cyan-400"></i>
                <span>ថ្នាក់រៀន & Lab (Smart Lab)</span>
              </div>
              <span class="group-badge-pulse">HUD</span>
              <i class="fa-solid fa-chevron-down group-arrow"></i>
            </button>
            <div class="sidebar-sub-menu">
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openClassroomHud()" title="ផ្ទាំងបញ្ជា Projector ពេញអេក្រង់ & កង់បង្វិលហៅសិស្ស">
                <i class="fa-solid fa-chalkboard-user text-cyan-400"></i>
                <span style="font-weight: 700; color: #38bdf8;">ផ្ទាំង Projector (Classroom HUD)</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="timetable" id="nav-timetable" title="កាលវិភាគ និង Monitor អេក្រង់កុំព្យូទ័រ">
                <i class="fa-solid fa-desktop text-teal-400"></i>
                <span>កាលវិភាគ & PC Lab</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openExamCountdownTimer(30)" title="នាឡិកាកំណត់ម៉ោងប្រឡង">
                <i class="fa-solid fa-stopwatch text-amber-400"></i>
                <span>នាឡិកាកំណត់ម៉ោង (Timer)</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openPcMaintenanceModal()" title="ស្ថានភាពម៉ាស៊ីន 16-PC Lab">
                <i class="fa-solid fa-screwdriver-wrench text-blue-400"></i>
                <span>ស្ថានភាពម៉ាស៊ីន 16-PC Lab</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.triggerAttentionBanner()" title="សុំការយកចិត្តទុកដាក់ (Eyes on Teacher)">
                <i class="fa-solid fa-hand text-rose-400"></i>
                <span>សុំការយកចិត្តទុកដាក់ (Attention)</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="TeacherToolsService.printLabSeatingPlanA4()" title="បោះពុម្ពប្លង់កៅអីបន្ទប់ Lab A4">
                <i class="fa-solid fa-chair text-purple-400"></i>
                <span>ប្លង់កៅអីបន្ទប់ Lab A4</span>
              </button>
            </div>
          </div>

          <!-- 4. វិញ្ញាសា & ការប្រឡង (Exams & Exercises) -->
          <div class="sidebar-group ${isGroupOpen('exams')}" data-group="exams">
            <button type="button" class="sidebar-group-toggle" onclick="SidebarComponent.toggleGroup('exams')">
              <div class="group-toggle-left">
                <i class="fa-solid fa-award text-amber-400"></i>
                <span>វិញ្ញាសា & ប្រឡង (Exams)</span>
              </div>
              <i class="fa-solid fa-chevron-down group-arrow"></i>
            </button>
            <div class="sidebar-sub-menu">
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openQuickBatchGradingModal()" title="បញ្ចូលពិន្ទុរហ័សតាមវេន (Spreadsheet Entry)">
                <i class="fa-solid fa-table-cells text-amber-400"></i>
                <span style="font-weight: 700; color: #fbbf24;">⚡ បញ្ចូលពិន្ទុរហ័សតាមវេន</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openExamPackageGeneratorModal()" title="បង្កើតវិញ្ញាសាសិស្ស + ចម្លើយគ្រូ + Rubric A4">
                <i class="fa-solid fa-file-circle-check text-indigo-400"></i>
                <span style="font-weight: 700; color: #a5b4fc;">បង្កើតវិញ្ញាសា + Rubric A4</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openExerciseLibraryModal()" title="បណ្ណាល័យវិញ្ញាសាអនុវត្ត A4">
                <i class="fa-solid fa-book-open text-sky-400"></i>
                <span>បណ្ណាល័យវិញ្ញាសាអនុវត្ត A4</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="exams" id="nav-exams" title="ពិន្ទុ និងការប្រលងកុំព្យូទ័រ">
                <i class="fa-solid fa-clipboard-check text-violet-400"></i>
                <span>ពិន្ទុ & ប្រឡង (Scores)</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="rankings" id="nav-rankings" title="តារាងកិត្តិយស & ចំណាត់ថ្នាក់សិស្ស 3D">
                <i class="fa-solid fa-trophy text-amber-400"></i>
                <span>ចំណាត់ថ្នាក់ (Rankings)</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openTop3HonorRollModal()" title="ផ្ទាំងកិត្តិយសសិស្សឆ្នើម TOP 3">
                <i class="fa-solid fa-medal text-yellow-400"></i>
                <span>ផ្ទាំងកិត្តិយស TOP 3</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="idcards" id="nav-idcards" title="ស្ទូឌីយោបោះពុម្ពកាតសិស្ស">
                <i class="fa-solid fa-id-card text-blue-400"></i>
                <span>បោះពុម្ពកាតសិស្ស (Cards)</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="documents" id="nav-documents" title="ឃ្លាំងឯកសារ កិច្ចតែងការ & វិញ្ញាសា">
                <i class="fa-solid fa-folder-open text-pink-400"></i>
                <span>ឯកសារ & មេរៀន (Docs)</span>
              </button>
            </div>
          </div>

          <!-- 5. ទំនាក់ទំនង & Telegram Bot (Telegram & Radar) -->
          <div class="sidebar-group ${isGroupOpen('comm')}" data-group="comm">
            <button type="button" class="sidebar-group-toggle" onclick="SidebarComponent.toggleGroup('comm')">
              <div class="group-toggle-left">
                <i class="fa-brands fa-telegram text-sky-400"></i>
                <span>ទំនាក់ទំនង & Bot (Telegram)</span>
              </div>
              <i class="fa-solid fa-chevron-down group-arrow"></i>
            </button>
            <div class="sidebar-sub-menu">
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openQuickContactModal()" title="មជ្ឈមណ្ឌលទំនាក់ទំនង និងផ្ញើសាររហ័ស Telegram/SMS">
                <i class="fa-solid fa-address-book text-sky-400"></i>
                <span style="font-weight: 700; color: #38bdf8;">📞 មជ្ឈមណ្ឌលទំនាក់ទំនង</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openKhmerCalendarModal()" title="ប្រតិទិនបុណ្យជាតិ និងផ្សាយដំណឹង Telegram ស្វ័យប្រវត្តិ">
                <i class="fa-solid fa-calendar-days text-amber-400"></i>
                <span style="font-weight: 700; color: #fbbf24;">ប្រតិទិនបុណ្យជាតិ & Telegram</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openDropoutRadarModal()" title="រ៉ាដាសង្គ្រោះសិស្សប្រឈមនឹងការបោះបង់">
                <i class="fa-solid fa-shield-halved text-rose-400"></i>
                <span>រ៉ាដាសិស្សប្រឈមបោះបង់</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openTelegramHubModal()" title="មជ្ឈមណ្ឌលបញ្ជាគ្រុប Telegram ទាំង ៣ (Telegram Shift Hub)">
                <i class="fa-brands fa-telegram text-sky-400"></i>
                <span style="font-weight: 700; color: #38bdf8;">បញ្ជាគ្រុប Telegram ទាំង ៣</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="attendance" id="nav-attendance" title="កត់ត្រាវត្តមានសិស្ស">
                <i class="fa-solid fa-calendar-check text-emerald-400"></i>
                <span>កត់ត្រាវត្តមាន (Attendance)</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openClassAttendanceQrSheetModal()" title="តារាង Scan វត្តមានលឿនលើក្រដាស A4 (Class Attendance QR Sheet)">
                <i class="fa-solid fa-qrcode text-emerald-400"></i>
                <span style="font-weight: 700; color: #34d399;">📄 តារាង QR វត្តមាន A4</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="TeacherToolsService.printMonthlyAttendanceSheet()" title="បោះពុម្ពវត្តមាន A4 ប្រចាំខែ">
                <i class="fa-solid fa-print text-teal-400"></i>
                <span>បោះពុម្ពវត្តមាន A4 ប្រចាំខែ</span>
              </button>
            </div>
          </div>

          <!-- 6. ហិរញ្ញវត្ថុ & របាយការណ៍ (Finance & Daily Wrap-Up) -->
          <div class="sidebar-group ${isGroupOpen('finance')}" data-group="finance">
            <button type="button" class="sidebar-group-toggle" onclick="SidebarComponent.toggleGroup('finance')">
              <div class="group-toggle-left">
                <i class="fa-solid fa-wallet text-emerald-400"></i>
                <span>ហិរញ្ញវត្ថុ & របាយការណ៍</span>
              </div>
              <i class="fa-solid fa-chevron-down group-arrow"></i>
            </button>
            <div class="sidebar-sub-menu">
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openStudentReceiptModal()" title="ចេញបង្កាន់ដៃបង់ប្រាក់ឌីជីថល & បោះពុម្ព (Receipt/Invoice)">
                <i class="fa-solid fa-receipt text-amber-400"></i>
                <span style="font-weight: 700; color: #fbbf24;">🧾 ចេញបង្កាន់ដៃ & Print</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="fees" id="nav-fees" title="គ្រប់គ្រងថ្លៃសិក្សា និងវិក្កយបត្រ">
                <i class="fa-solid fa-file-invoice-dollar text-emerald-400"></i>
                <span>ថ្លៃសិក្សា (Payments)</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openSchoolExpensesModal()" title="ចំណូល-ចំណាយ និងចំណេញសុទ្ធ">
                <i class="fa-solid fa-receipt text-green-400"></i>
                <span>ចំណូល-ចំណាយ & ចំណេញសុទ្ធ</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="ModalsComponent.openEndOfDayWrapUpModal()" title="បិទបញ្ជីចុងថ្ងៃ ៦:០០ ល្ងាច & ផ្ញើ Telegram">
                <i class="fa-solid fa-moon text-emerald-300"></i>
                <span style="font-weight: 700; color: #34d399;">បិទបញ្ជីចុងថ្ងៃ ៦:០០ ល្ងាច</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="certificates" id="nav-certificates" title="វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា">
                <i class="fa-solid fa-certificate text-amber-400"></i>
                <span>វិញ្ញាបនបត្រ (Certificates)</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="TeacherToolsService.printExecutiveSummaryA4()" title="របាយការណ៍សង្ខេប A4 ថ្នាក់ដឹកនាំ">
                <i class="fa-solid fa-chart-pie text-purple-400"></i>
                <span>របាយការណ៍ A4 ថ្នាក់ដឹកនាំ</span>
              </button>
              <button type="button" class="nav-link sub-link" data-tab="reports" id="nav-reports" title="មជ្ឈមណ្ឌលរបាយការណ៍">
                <i class="fa-solid fa-chart-line text-blue-400"></i>
                <span>មជ្ឈមណ្ឌលរបាយការណ៍</span>
              </button>
              <button type="button" class="sub-link action-btn" onclick="TeacherToolsService.exportJsonBackup()" title="ទាញយក JSON Backup ប្រព័ន្ធ">
                <i class="fa-solid fa-download text-teal-400"></i>
                <span>ទាញយក JSON Backup</span>
              </button>
            </div>
          </div>

          <!-- 7. ការកំណត់ (Settings) -->
          <div class="menu-category">ប្រព័ន្ធ & ការកំណត់ (SETTINGS)</div>
          
          <button type="button" class="nav-link" data-tab="settings" id="nav-settings" title="ការកំណត់ទូទៅ">
            <i class="fa-solid fa-gear text-slate-400"></i>
            <span>ការកំណត់ (Settings)</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <!-- Active Teacher Account Card -->
          ${(() => {
            const user = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) || {
              nameKh: "លោកគ្រូ ខៀន ធូ",
              role: "គ្រូបង្រៀន & Admin",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
            };
            return `
              <div class="sidebar-teacher-card">
                <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
                  <div class="teacher-avatar-wrap">
                    <img src="${user.avatar || 'assets/images/default-male.svg'}" alt="${user.nameKh}" class="avatar-sm" style="border: 2px solid #10b981;" onerror="this.src='assets/images/default-male.svg'">
                    <span class="online-indicator-dot" style="background: #10b981;"></span>
                  </div>
                  <div style="overflow: hidden;">
                    <div style="font-size: 0.82rem; font-weight: 700; color: #ffffff; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${user.nameKh}</div>
                    <div style="font-size: 0.7rem; color: #10b981; font-weight: 600;"><i class="fa-solid fa-shield-check"></i> ${user.role || 'Admin'}</div>
                  </div>
                </div>
                <button type="button" id="sidebarLogoutBtn" class="btn-sidebar-logout" title="ចាកចេញ (Logout)">
                  <i class="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            `;
          })()}

          <!-- Theme & System Status Pill -->
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 6px 12px; margin-top: 8px;">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #34d399; font-weight: 700;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981;"></span>
              <span>Online v2.2</span>
            </div>
            <button type="button" id="sidebarThemeToggleBtn" onclick="App.toggleTheme()" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #f1f5f9; border-radius: 20px; padding: 3px 9px; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 5px;" title="ប្តូរ Dark / Light Mode">
              <i class="fa-solid fa-moon"></i> <span>Theme</span>
            </button>
          </div>
        </div>
      </aside>
    `;
  },

  initEvents() {
    const navLinks = document.querySelectorAll(".nav-link[data-tab]");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = link.getAttribute("data-tab");
        if (typeof ModalsComponent !== "undefined") {
          ModalsComponent.close("addStudentModal");
          ModalsComponent.close("editModal");
        }
        App.switchTab(tab);
        
        // Ensure its group is expanded
        this.expandGroupForTab(tab);

        // Close mobile sidebar if open
        const sidebar = document.getElementById("sidebar");
        if (sidebar && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
        }
      });
    });

    // Sidebar Logout button
    const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");
    if (sidebarLogoutBtn) {
      sidebarLogoutBtn.addEventListener("click", () => {
        App.handleLogout();
      });
    }
  }
};

window.SidebarComponent = SidebarComponent;

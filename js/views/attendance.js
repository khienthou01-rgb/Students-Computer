/**
 * View: 5-Day Weekly Roll-Call & Monthly Attendance Tracking (វត្តមានប្រចាំសប្តាហ៍ ៥ ថ្ងៃ និងតាមផ្នែកខែៗ)
 */
const AttendanceView = {
  // Calendar & Navigation State
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(), // 0 to 11
  currentWeekIndex: 0,
  
  // Data State
  records: {}, // Cache of dateStr -> { studentId -> status }
  hasUnsavedChanges: false,
  
  // Filters
  filters: {
    course: "",
    shift: "",
    search: ""
  },

  // Khmer Constants
  khmerMonths: [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
  ],
  khmerDays: ["ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ"],

  formatLocalDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  },

  // Calculate 5-Day School Weeks (Mon - Fri) for Selected Month
  getWeeksForMonth(year, month) {
    const weeks = [];
    const firstDayOfMonth = new Date(year, month, 1, 12, 0, 0);
    const lastDayOfMonth = new Date(year, month + 1, 0, 12, 0, 0);

    // Find the Monday on or before the 1st day of the month
    let curr = new Date(firstDayOfMonth);
    const dayOfWeek = curr.getDay(); // 0: Sun, 1: Mon, ... 6: Sat
    const mondayOffset = dayOfWeek === 0 ? -6 : (1 - dayOfWeek);
    curr.setDate(curr.getDate() + mondayOffset);

    const now = new Date();
    const todayStr = this.formatLocalDate(now);

    while (true) {
      const monday = new Date(curr);
      const friday = new Date(curr);
      friday.setDate(friday.getDate() + 4);

      // Stop if Monday is past the end of the month
      if (monday > lastDayOfMonth) break;

      const weekDays = [];
      let containsToday = false;

      for (let i = 0; i < 5; i++) {
        const d = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + i, 12, 0, 0);
        const dateStr = this.formatLocalDate(d);
        const dayNum = d.getDate();
        const monthNum = d.getMonth();
        const isToday = dateStr === todayStr;
        if (isToday) containsToday = true;

        weekDays.push({
          date: d,
          dateStr: dateStr,
          dayNameKh: this.khmerDays[i],
          dayNameEn: ["Mon", "Tue", "Wed", "Thu", "Fri"][i],
          dayNum: dayNum,
          monthNum: monthNum,
          isCurrentMonth: monthNum === month,
          isToday: isToday,
          displayLabel: `${String(dayNum).padStart(2, '0')}/${String(monthNum + 1).padStart(2, '0')}`
        });
      }

      const startDayStr = `${String(weekDays[0].dayNum).padStart(2, '0')}/${String(weekDays[0].monthNum + 1).padStart(2, '0')}`;
      const endDayStr = `${String(weekDays[4].dayNum).padStart(2, '0')}/${String(weekDays[4].monthNum + 1).padStart(2, '0')}`;

      weeks.push({
        index: weeks.length,
        label: `សប្តាហ៍ទី ${weeks.length + 1}`,
        rangeText: `${startDayStr} - ${endDayStr}`,
        days: weekDays,
        containsToday: containsToday
      });

      // Move to next Monday
      curr.setDate(curr.getDate() + 7);
    }

    return weeks;
  },

  getCurrentWeek() {
    const weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);
    if (!weeks.length) return null;
    if (this.currentWeekIndex < 0 || this.currentWeekIndex >= weeks.length) {
      this.currentWeekIndex = 0;
    }
    return weeks[this.currentWeekIndex] || weeks[0];
  },

  render() {
    const weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);
    
    // Auto-select week that contains today if current month
    const today = new Date();
    if (this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth()) {
      const todayWeekIdx = weeks.findIndex(w => w.containsToday);
      if (todayWeekIdx !== -1 && this.currentWeekIndex === 0) {
        this.currentWeekIndex = todayWeekIdx;
      }
    }

    const currentWeek = weeks[this.currentWeekIndex] || weeks[0];
    const monthNameKh = this.khmerMonths[this.currentMonth];

    return `
      <section id="view-attendance" class="page-view">
        <!-- Main Top Bar & Month Navigation -->
        <div class="card" style="margin-bottom: 18px; padding: 20px 24px; border-left: 4px solid #10b981;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
            <div>
              <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 6px 0;">
                <i class="fa-solid fa-calendar-check" style="color: #10b981;"></i>
                <span>កត់ត្រាវត្តមានសិស្ស ៥ ថ្ងៃប្រចាំសប្តាហ៍ (Weekly Attendance Checklist)</span>
              </h2>
              <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
                គ្រីសវត្តមានពីថ្ងៃចន្ទដល់សុក្រ រៀបចំតាមផ្នែកខែៗ គណនាស្ថិតិ និងរក្សាទុកចូលប្រព័ន្ធដោយស្វ័យប្រវត្តិ
              </p>
            </div>

            <!-- Save & Action Controls -->
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <!-- Leave Requests Inbox Button -->
              ${(() => {
                const leaveReqs = typeof StudentAPI !== "undefined" ? StudentAPI.getLeaveRequests() : [];
                const pendingCount = leaveReqs.filter(r => r.status === "pending").length;
                return `
                  <button type="button" id="openLeaveRequestsModalBtn" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;" title="សំណើសុំច្បាប់ពីសិស្ស">
                    <i class="fa-solid fa-envelope-open-text text-indigo-500"></i>
                    <span>សំណើសុំច្បាប់</span>
                    ${pendingCount > 0 ? `
                      <span class="badge" style="background: #ef4444; color: #ffffff; border-radius: 12px; padding: 2px 7px; font-size: 0.72rem; font-weight: 800;">
                        ${pendingCount} ថ្មី
                      </span>
                    ` : ''}
                  </button>

                  <button type="button" id="btnPublishLeaveGuideToTg" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem; color: #0088cc; border-color: rgba(0, 136, 204, 0.4); background: rgba(0, 136, 204, 0.08); display: inline-flex; align-items: center; gap: 6px;" title="ផ្ញើសារណែនាំពីរបៀបសុំច្បាប់ និងតុសេវាសិស្សចូលគ្រុប Telegram ទាំង ៣">
                    <i class="fa-solid fa-bullhorn text-sky-500"></i>
                    <span>ផ្សាយរបៀបសុំច្បាប់ទៅគ្រុបទាំង ៣</span>
                  </button>
                `;
              })()}

              <button type="button" id="btnOpenClassAttendanceQrSheet" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.88rem; background: linear-gradient(135deg, #059669, #047857); border: none; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35); font-weight: 700;" onclick="ModalsComponent.openClassAttendanceQrSheetModal(AttendanceView.filters ? AttendanceView.filters.shift : 'ព្រឹក')" title="បោះពុម្ពតារាង QR វត្តមានសិស្សលើក្រដាស A4 សម្រាប់ស្កេន ឬធីកវត្តមាន">
                <i class="fa-solid fa-qrcode"></i>
                <span>📄 តារាង QR វត្តមាន A4</span>
              </button>

              <button type="button" id="openQrScannerBtn" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.88rem; background: #6366f1; border-color: #6366f1; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);" title="ស្កេនកាតសិស្ស QR & Barcode ដើម្បីកត់ត្រាវត្តមានរហ័ស">
                <i class="fa-solid fa-camera"></i>
                <span>ស្កេន QR កាតសិស្ស</span>
              </button>

              <button type="button" id="btnSpeedMarkAllTodayPresent" class="btn-primary" style="height: 38px; padding: 0 14px; font-size: 0.85rem; background: #059669; border-color: #059669;" title="គ្រីសវត្តមានសិស្សទាំងអស់សម្រាប់ថ្ងៃនេះ (Speed Roll-call)">
                <i class="fa-solid fa-bolt text-amber-300"></i>
                <span>វត្តមានទាំងអស់ថ្ងៃនេះ (Speed)</span>
              </button>

              <button type="button" id="markAllWeekPresentBtn" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" title="គ្រីសវត្តមានសិស្សទាំងអស់សម្រាប់ ៥ ថ្ងៃក្នុងសប្តាហ៍នេះ">
                <i class="fa-solid fa-check-double text-emerald-500"></i>
                <span>គ្រីសវត្តមានទាំងអស់ (សប្តាហ៍នេះ)</span>
              </button>

              <button type="button" id="saveAttendanceBtn" class="btn-primary" style="height: 38px; padding: 0 18px; font-size: 0.88rem; background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>រក្សាទុកវត្តមាន</span>
              </button>

              <button type="button" id="btnPrintMonthlyAttendanceSheet" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" title="បោះពុម្ពតារាងវត្តមាន A4 ប្រចាំខែពេញលេញ សម្រាប់ដាក់ក្នុងបន្ទប់ ឬរដ្ឋបាល">
                <i class="fa-solid fa-file-invoice text-indigo-500"></i>
                <span>តារាងវត្តមាន A4 ប្រចាំខែ</span>
              </button>

              <button type="button" id="btnSendShiftSummaryNow" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem; color: #0088cc; border-color: rgba(0, 136, 204, 0.4); background: rgba(0, 136, 204, 0.08); display: inline-flex; align-items: center; gap: 6px;" title="ផ្ញើរបាយការណ៍វត្តមានសរុបតាមវេនទៅកាន់ Telegram Bot ភ្លាមៗ (ដោយមិនបាច់រង់ចាំ ៥ នាទី)">
                <i class="fa-solid fa-paper-plane text-sky-500"></i>
                <span id="btnSendShiftSummaryText">ផ្ញើសារសរុបវេនទៅ Telegram</span>
              </button>

              <button type="button" id="btnSendTelegramAttendanceSummary" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem; color: #10b981; border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.08); display: inline-flex; align-items: center; gap: 6px;" title="ផ្ញើរបាយការណ៍វត្តមានសរុបថ្ងៃនេះទៅកាន់ Telegram Bot (កំណត់ស្វ័យប្រវត្តិនាវេលាម៉ោង ៧:០០ យប់)">
                <i class="fa-brands fa-telegram"></i>
                <span>ផ្ញើវត្តមានសរុបថ្ងៃ (៧:០០ យប់)</span>
              </button>

              <button type="button" id="printAttendanceBtn" class="btn-secondary" style="height: 38px; padding: 0 12px;" title="បោះពុម្ពតារាងវត្តមាន">
                <i class="fa-solid fa-print"></i>
              </button>
            </div>
          </div>

          <!-- Live Shift Attendance Summary Countdown Banner (5-min Debounce) -->
          <div id="attShiftTelegramBanner" style="display: none; margin-top: 14px;"></div>

          <!-- 2-Day Consecutive Absence Detection Banner -->
          <div id="attConsecutiveAbsenceBanner" style="display: none; margin-top: 14px;"></div>

          <!-- Month Selector Toolbar (ផ្នែកខែៗ) -->
          <div class="att-month-bar">
            <div class="att-month-controls">
              <button type="button" id="prevMonthBtn" class="att-nav-btn" title="ខែមុន">
                <i class="fa-solid fa-chevron-left"></i>
              </button>

              <div class="att-month-selector-group">
                <i class="fa-regular fa-calendar" style="color: #10b981;"></i>
                <select id="attMonthSelect" class="form-control" style="border: none; background: transparent; font-weight: 700; font-size: 0.95rem; cursor: pointer; color: var(--text-main); padding: 4px 8px;">
                  ${this.khmerMonths.map((m, idx) => `
                    <option value="${idx}" ${idx === this.currentMonth ? "selected" : ""}>ខែ ${m}</option>
                  `).join("")}
                </select>

                <select id="attYearSelect" class="form-control" style="border: none; background: transparent; font-weight: 700; font-size: 0.95rem; cursor: pointer; color: var(--text-main); padding: 4px 8px;">
                  ${[2024, 2025, 2026, 2027, 2028].map(y => `
                    <option value="${y}" ${y === this.currentYear ? "selected" : ""}>ឆ្នាំ ${y}</option>
                  `).join("")}
                </select>
              </div>

              <button type="button" id="nextMonthBtn" class="att-nav-btn" title="ខែបន្ទាប់">
                <i class="fa-solid fa-chevron-right"></i>
              </button>

              <button type="button" id="todayMonthBtn" class="att-today-pill">
                <i class="fa-solid fa-bullseye"></i>
                <span>ខែបច្ចុប្បន្ន</span>
              </button>
            </div>

            <!-- Month Title Badge -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 0.85rem; padding: 6px 14px;">
                <i class="fa-solid fa-calendar-days"></i> ផ្នែក: ខែ${monthNameKh} ឆ្នាំ${this.currentYear} (${weeks.length} សប្តាហ៍)
              </span>
            </div>
          </div>

          <!-- Week Navigation Tabs (សប្តាហ៍ទី ១, ២, ៣, ៤, ៥) -->
          <div class="att-week-tabs-container" id="attWeekTabs">
            ${this.renderWeekTabs(weeks)}
          </div>
        </div>

        <!-- Attendance KPIs (ស្ថិតិវត្តមានប្រចាំខែ & សប្តាហ៍) -->
        <div class="att-kpi-grid">
          <!-- Total Students -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(99, 102, 241, 0.12); color: #4f46e5;">
              <i class="fa-solid fa-users"></i>
            </div>
            <div class="att-kpi-info">
              <h4>សិស្សត្រូវចូលរៀន</h4>
              <div class="att-kpi-num" id="attKpiTotal">0</div>
            </div>
          </div>

          <!-- Total Present -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(16, 185, 129, 0.12); color: #10b981;">
              <i class="fa-solid fa-user-check"></i>
            </div>
            <div class="att-kpi-info">
              <h4>វត្តមាន (Present)</h4>
              <div class="att-kpi-num" id="attKpiPresent" style="color: #10b981;">0</div>
            </div>
          </div>

          <!-- Total Permission -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
              <i class="fa-solid fa-envelope-open-text"></i>
            </div>
            <div class="att-kpi-info">
              <h4>សុំច្បាប់ (Excused)</h4>
              <div class="att-kpi-num" id="attKpiPermission" style="color: #f59e0b;">0</div>
            </div>
          </div>

          <!-- Total Absent -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;">
              <i class="fa-solid fa-user-xmark"></i>
            </div>
            <div class="att-kpi-info">
              <h4>អវត្តមាន (Absent)</h4>
              <div class="att-kpi-num" id="attKpiAbsent" style="color: #ef4444;">0</div>
            </div>
          </div>

          <!-- Attendance Rate -->
          <div class="att-kpi-box">
            <div class="att-kpi-icon" style="background: rgba(14, 165, 233, 0.12); color: #0284c7;">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
            <div class="att-kpi-info">
              <h4>អត្រាវត្តមានសប្តាហ៍នេះ</h4>
              <div class="att-kpi-num" id="attKpiRate" style="color: #0284c7;">0%</div>
            </div>
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="filter-bar" style="margin-bottom: 16px;">
          <!-- Filter Course (Only Computer Courses) -->
          <select id="attFilterCourse" class="filter-select">
            <option value="">-- គ្រប់វគ្គសិក្សាកុំព្យូទ័រ --</option>
            ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>

          <!-- Filter Shift -->
          <select id="attFilterShift" class="filter-select">
            <option value="">-- គ្រប់វេន --</option>
            ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
          </select>

          <!-- Search Student -->
          <div style="position: relative; flex: 1; max-width: 280px;">
            <input type="text" id="attSearchInput" class="form-control" placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តលេខ..." style="height: 36px; padding-left: 32px; font-size: 0.84rem;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 10px; top: 11px; color: var(--text-muted); font-size: 0.85rem;"></i>
          </div>

          <span class="text-xs text-muted" style="margin-left: auto; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-circle-info text-emerald-500"></i>
            <span>ចុចលើប្រអប់ថ្ងៃដើម្បីគ្រីសវត្តមាន (វត្តមាន ➔ ច្បាប់ ➔ អវត្តមាន ➔ សម្អាត)</span>
          </span>
        </div>

        <!-- 5-Day Weekly Roll Call Checklist Table (Monday to Friday) -->
        <div class="att-table-wrapper" id="attendanceTableContainer">
          <!-- Rendered dynamically -->
        </div>

        <!-- Help & Status Legend -->
        <div class="att-legend-bar">
          <div class="att-legend-items">
            <span style="font-weight: 700; color: var(--text-main);">កំណត់សម្គាល់:</span>
            <div class="att-legend-item">
              <span class="badge" style="background: #10b981; color: #ffffff; padding: 3px 8px;"><i class="fa-solid fa-check"></i> វត្តមាន</span>
              <span>មានវត្តមាន (Present)</span>
            </div>
            <div class="att-legend-item">
              <span class="badge" style="background: #f59e0b; color: #ffffff; padding: 3px 8px;"><i class="fa-solid fa-envelope-open-text"></i> ច្បាប់</span>
              <span>មានច្បាប់អនុញ្ញាត (Excused)</span>
            </div>
            <div class="att-legend-item">
              <span class="badge" style="background: #ef4444; color: #ffffff; padding: 3px 8px;"><i class="fa-solid fa-xmark"></i> អវត្តមាន</span>
              <span>អវត្តមានឥតច្បាប់ (Absent)</span>
            </div>
            <div class="att-legend-item">
              <span class="badge" style="background: var(--border-light); color: var(--text-muted); border: 1px dashed var(--border-color); padding: 3px 8px;"><i class="fa-solid fa-plus"></i> គ្រីស</span>
              <span>មិនទាន់កត់ត្រា</span>
            </div>
          </div>

          <div style="font-size: 0.75rem;">
            <i class="fa-solid fa-cloud-arrow-up text-emerald-500"></i> ទិន្នន័យត្រូវបាន Sync ទៅកាន់ Firebase Realtime Database
          </div>
        </div>
      </section>
    `;
  },

  renderWeekTabs(weeks) {
    if (!weeks) weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);

    return weeks.map((w, idx) => {
      const isActive = idx === this.currentWeekIndex;
      return `
        <button type="button" class="att-week-tab-btn ${isActive ? "active" : ""}" data-week-idx="${idx}">
          ${w.containsToday ? `<span class="att-week-badge-today"><i class="fa-solid fa-star"></i> សប្តាហ៍នេះ</span>` : ""}
          <div class="att-week-tab-title">
            <i class="fa-regular fa-calendar-check"></i>
            <span>${w.label}</span>
          </div>
          <div class="att-week-tab-dates">${w.rangeText}</div>
        </button>
      `;
    }).join("");
  },

  initEvents() {
    // Month Selector Change
    const monthSelect = document.getElementById("attMonthSelect");
    if (monthSelect) {
      monthSelect.addEventListener("change", (e) => {
        this.currentMonth = parseInt(e.target.value, 10);
        this.currentWeekIndex = 0;
        this.refreshWeekTabsAndTable();
      });
    }

    // Year Selector Change
    const yearSelect = document.getElementById("attYearSelect");
    if (yearSelect) {
      yearSelect.addEventListener("change", (e) => {
        this.currentYear = parseInt(e.target.value, 10);
        this.currentWeekIndex = 0;
        this.refreshWeekTabsAndTable();
      });
    }

    // Previous Month Button
    const prevMonthBtn = document.getElementById("prevMonthBtn");
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", () => {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
        this.currentWeekIndex = 0;
        this.updateMonthSelectUI();
        this.refreshWeekTabsAndTable();
      });
    }

    // Next Month Button
    const nextMonthBtn = document.getElementById("nextMonthBtn");
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", () => {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
        this.currentWeekIndex = 0;
        this.updateMonthSelectUI();
        this.refreshWeekTabsAndTable();
      });
    }

    // Today / Current Month Button
    const todayMonthBtn = document.getElementById("todayMonthBtn");
    if (todayMonthBtn) {
      todayMonthBtn.addEventListener("click", () => {
        const now = new Date();
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth();
        const weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);
        const todayWeekIdx = weeks.findIndex(w => w.containsToday);
        this.currentWeekIndex = todayWeekIdx !== -1 ? todayWeekIdx : 0;
        this.updateMonthSelectUI();
        this.refreshWeekTabsAndTable();
      });
    }

    // Week Tabs Delegation
    const tabsContainer = document.getElementById("attWeekTabs");
    if (tabsContainer) {
      tabsContainer.addEventListener("click", (e) => {
        const tabBtn = e.target.closest(".att-week-tab-btn");
        if (tabBtn) {
          const idx = parseInt(tabBtn.getAttribute("data-week-idx"), 10);
          this.currentWeekIndex = idx;
          document.querySelectorAll(".att-week-tab-btn").forEach(b => b.classList.remove("active"));
          tabBtn.classList.add("active");
          this.renderTable();
        }
      });
    }

    // Filter Course
    const courseFilter = document.getElementById("attFilterCourse");
    if (courseFilter) {
      courseFilter.addEventListener("change", (e) => {
        this.filters.course = e.target.value;
        this.renderTable();
      });
    }

    // Filter Shift
    const shiftFilter = document.getElementById("attFilterShift");
    if (shiftFilter) {
      shiftFilter.addEventListener("change", (e) => {
        this.filters.shift = e.target.value;
        this.renderTable();
      });
    }

    // Search Input
    const searchInput = document.getElementById("attSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    // Speed Roll-Call Today Button
    const speedTodayBtn = document.getElementById("btnSpeedMarkAllTodayPresent");
    if (speedTodayBtn) {
      speedTodayBtn.addEventListener("click", () => {
        const todayStr = this.formatLocalDate(new Date());
        this.markAllPresentForDay(todayStr);
      });
    }

    // Print Monthly Hardcopy Sheet Button
    const printMonthlyBtn = document.getElementById("btnPrintMonthlyAttendanceSheet");
    if (printMonthlyBtn) {
      printMonthlyBtn.addEventListener("click", () => {
        const shift = this.filters.shift || "ព្រឹក";
        if (typeof TeacherToolsService !== "undefined") {
          TeacherToolsService.printMonthlyAttendanceHardcopy(shift, this.currentYear, this.currentMonth);
        } else {
          window.print();
        }
      });
    }

    // Mark All Week Present
    const markWeekBtn = document.getElementById("markAllWeekPresentBtn");
    if (markWeekBtn) {
      markWeekBtn.addEventListener("click", () => {
        this.markAllWeekPresent();
      });
    }

    // Save Attendance
    const saveBtn = document.getElementById("saveAttendanceBtn");
    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        await this.saveAttendance();
      });
    }

    // Send Telegram Attendance Summary Button (7:00 PM / Manual Trigger)
    const sendTgSummaryBtn = document.getElementById("btnSendTelegramAttendanceSummary");
    if (sendTgSummaryBtn) {
      sendTgSummaryBtn.addEventListener("click", async () => {
        const originalHtml = sendTgSummaryBtn.innerHTML;
        sendTgSummaryBtn.disabled = true;
        sendTgSummaryBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>កំពុងផ្ញើទៅ Telegram...</span>`;
        try {
          const user = typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "លោកគ្រូ ខៀន ធូ";
          const res = await TelegramService.sendDailyAttendanceSummary(null, true, user);
          if (res && res.success) {
            App.showToast("🚀 " + res.message, "success");
            App.triggerConfetti();
          } else {
            App.showToast("⚠️ " + (res.error || "មិនអាចផ្ញើសារបានឡើយ សូមពិនិត្យការកំណត់ Telegram"), "warning");
          }
        } catch (err) {
          App.showToast("កំហុសក្នុងការផ្ញើ៖ " + err.message, "error");
        } finally {
          sendTgSummaryBtn.disabled = false;
          sendTgSummaryBtn.innerHTML = originalHtml;
        }
      });
    }

    // Send Shift Attendance Summary Now Button (Instant Send without waiting 5 mins)
    const btnSendShiftSummaryNow = document.getElementById("btnSendShiftSummaryNow");
    if (btnSendShiftSummaryNow) {
      const updateShiftBtnLabel = () => {
        const span = document.getElementById("btnSendShiftSummaryText");
        if (span) {
          const shift = this.filters.shift || "ព្រឹក";
          span.textContent = `ផ្ញើសារសរុប (វេន${shift}) ទៅ Telegram`;
        }
      };
      updateShiftBtnLabel();

      btnSendShiftSummaryNow.addEventListener("click", async () => {
        const shift = this.filters.shift || "ព្រឹក";
        const todayStr = new Date().toISOString().split("T")[0];
        const originalHtml = btnSendShiftSummaryNow.innerHTML;
        btnSendShiftSummaryNow.disabled = true;
        btnSendShiftSummaryNow.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>កំពុងផ្ញើ...</span>`;
        try {
          const user = typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "លោកគ្រូ ខៀន ធូ";
          const res = await TelegramService.sendShiftAttendanceSummary(shift, todayStr, user, false);
          if (res && res.success) {
            App.triggerConfetti();
          }
        } finally {
          btnSendShiftSummaryNow.disabled = false;
          btnSendShiftSummaryNow.innerHTML = originalHtml;
        }
      });

      // Update button label when shift filter changes
      const shiftFilterEl = document.getElementById("attFilterShift");
      if (shiftFilterEl) {
        shiftFilterEl.addEventListener("change", updateShiftBtnLabel);
      }
    }

    // Subscribe to Shift Timer Countdown Updates from TelegramService
    if (typeof TelegramService !== "undefined" && TelegramService.onShiftTimerChange) {
      TelegramService.onShiftTimerChange(() => {
        this.updateShiftTelegramBanner();
      });
    }
    this.updateShiftTelegramBanner();

    // Print Button
    const printBtn = document.getElementById("printAttendanceBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }

    // Leave Requests Modal Button
    const leaveReqBtn = document.getElementById("openLeaveRequestsModalBtn");
    if (leaveReqBtn) {
      leaveReqBtn.addEventListener("click", () => {
        this.openLeaveRequestsModal();
      });
    }

    // Publish Leave Guide & Student Desk to 3 Telegram Groups
    const publishLeaveBtn = document.getElementById("btnPublishLeaveGuideToTg");
    if (publishLeaveBtn) {
      publishLeaveBtn.addEventListener("click", async () => {
        if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
          App.showToast("សូមបើកដំណើរការ Telegram Bot ក្នុង Settings ជាមុនសិន!", "warning");
          return;
        }
        const origHtml = publishLeaveBtn.innerHTML;
        publishLeaveBtn.disabled = true;
        publishLeaveBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>កំពុងផ្សាយ...</span>`;
        try {
          const res = await TelegramService.publishStudentDeskToShifts("ALL");
          if (res && res.success) {
            App.showToast(`🎉 បានផ្សាយរបៀបសុំច្បាប់ និងតុសេវាសិស្សចូល ${res.sentCount} គ្រុបជោគជ័យ!`, "success");
            App.triggerConfetti();
          } else {
            App.showToast(`⚠️ មិនអាចផ្សាយបានទេ៖ ${res?.error || 'សូមពិនិត្យការកំណត់'}`, "error");
          }
        } catch (e) {
          App.showToast("កំហុសក្នុងការផ្សាយ៖ " + e.message, "error");
        } finally {
          publishLeaveBtn.disabled = false;
          publishLeaveBtn.innerHTML = origHtml;
        }
      });
    }

    // QR Code Scanner Button
    const qrBtn = document.getElementById("openQrScannerBtn");
    if (qrBtn) {
      qrBtn.addEventListener("click", () => {
        this.openQrScannerModal();
      });
    }

    // Initial Table Render
    this.renderTable();
  },

  updateShiftTelegramBanner() {
    const banner = document.getElementById("attShiftTelegramBanner");
    if (!banner) return;

    if (typeof TelegramService === "undefined" || !TelegramService.getActiveShiftTimers) {
      banner.style.display = "none";
      return;
    }

    const timers = TelegramService.getActiveShiftTimers();
    if (timers.length === 0) {
      banner.style.display = "none";
      banner.innerHTML = "";
      return;
    }

    const formatSecs = (s) => {
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    banner.style.display = "block";
    banner.innerHTML = timers.map(t => `
      <div style="background: linear-gradient(135deg, rgba(0, 136, 204, 0.12), rgba(99, 102, 241, 0.1)); border: 1px solid rgba(0, 136, 204, 0.35); border-radius: 12px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; box-shadow: 0 4px 14px rgba(0, 136, 204, 0.08); margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: #0088cc; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(0, 136, 204, 0.35);">
            <i class="fa-brands fa-telegram"></i>
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <span style="color: #0088cc;">${t.shiftInfo.label}</span>
              <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 0.72rem; padding: 2px 8px; border-radius: 10px; font-weight: 700;">បានបញ្ចូលវត្តមាន</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
              <i class="fa-solid fa-hourglass-half text-amber-500 fa-spin" style="animation-duration: 3s;"></i>
              <span>Bot នឹងផ្ញើសារសរុបស្វ័យប្រវត្តិក្នងរយៈពេល៖ <strong style="color: #f59e0b; font-family: monospace; font-size: 0.92rem; font-weight: 800;">${formatSecs(t.remainingSecs)}</strong> (៥ នាទីក្រោយបញ្ចូលចប់)</span>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="btn-primary btn-sm" style="background: #0088cc; border-color: #0088cc; height: 34px; padding: 0 14px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px;" onclick="AttendanceView.sendShiftNow(this, '${t.shift}', '${t.dateStr}')">
            <i class="fa-solid fa-paper-plane"></i> <span>ផ្ញើសារសរុបឥឡូវ</span>
          </button>
          <button type="button" class="btn-secondary btn-sm" style="height: 34px; padding: 0 10px; font-size: 0.78rem; color: var(--text-muted);" onclick="TelegramService.cancelShiftAttendanceTimer('${t.shift}', '${t.dateStr}')" title="ផ្អាកការផ្ញើស្វ័យប្រវត្តិ">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `).join("");
  },

  async sendShiftNow(btn, shift, dateStr) {
    if (!btn) return;
    const origHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>កំពុងផ្ញើ...</span>`;
    try {
      const user = typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "លោកគ្រូ ខៀន ធូ";
      await TelegramService.sendShiftAttendanceSummary(shift, dateStr, user, false);
    } catch (e) {
      App.showToast("កំហុសក្នុងការផ្ញើ៖ " + e.message, "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  },

  qrScannerInstance: null,

  openQrScannerModal() {
    ModalsComponent.open("qrAttendanceModal");
    const manualInput = document.getElementById("qrManualInput");
    if (manualInput) {
      manualInput.value = "";
      setTimeout(() => manualInput.focus(), 250);
    }
    const feedback = document.getElementById("qrScanFeedbackBox");
    if (feedback) feedback.style.display = "none";
  },

  async startQrScanner() {
    const startBtn = document.getElementById("startCamBtn");
    const stopBtn = document.getElementById("stopCamBtn");

    if (typeof Html5Qrcode === "undefined") {
      App.showToast("មិនទាន់អាចដំណើរការ Camera Library បានទេ សូមប្រើប្រអប់ Barcode ខាងក្រោម!", "warning");
      return;
    }

    try {
      if (this.qrScannerInstance) {
        await this.stopQrScanner();
      }

      this.qrScannerInstance = new Html5Qrcode("qrReaderContainer");
      if (startBtn) startBtn.style.display = "none";
      if (stopBtn) stopBtn.style.display = "inline-flex";

      await this.qrScannerInstance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          this.handleScannedCode(decodedText);
        },
        () => {
          // Frame errors during scan can be ignored
        }
      );
    } catch (err) {
      console.warn("Camera scan notice:", err);
      App.showToast("មិនអាចបើកកាមេរ៉ាបានទេ! សូមប្រើប្រអប់ Barcode ឬវាយអត្តលេខសិស្សផ្ទាល់។", "warning");
      if (startBtn) startBtn.style.display = "inline-flex";
      if (stopBtn) stopBtn.style.display = "none";
    }
  },

  async stopQrScanner() {
    const startBtn = document.getElementById("startCamBtn");
    const stopBtn = document.getElementById("stopCamBtn");
    if (this.qrScannerInstance) {
      try {
        await this.qrScannerInstance.stop();
        this.qrScannerInstance.clear();
      } catch (e) {}
      this.qrScannerInstance = null;
    }
    if (startBtn) startBtn.style.display = "inline-flex";
    if (stopBtn) stopBtn.style.display = "none";
  },

  handleManualQrSubmit() {
    const input = document.getElementById("qrManualInput");
    if (!input) return;
    const val = input.value.trim();
    if (!val) {
      App.showToast("សូមបញ្ចូល ឬស្កេនអត្តលេខសិស្ស!", "warning");
      return;
    }
    this.handleScannedCode(val);
    input.value = "";
    input.focus();
  },

  playSuccessChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  },

  handleScannedCode(rawCode) {
    if (!rawCode) return;
    const text = String(rawCode).trim();
    
    // Parse student ID from QR payload or raw barcode
    let studentId = "";
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";
    const stuMatch = text.match(/(?:TX|STU)[-_]?(\d+)/i);
    if (stuMatch) {
      const num = parseInt(stuMatch[1], 10);
      const mappedNum = (num >= 1000 && num < 2000) ? (num - 1000) : num;
      studentId = `${prefix}${String(mappedNum).padStart(2, "0")}`;
    } else if (/^\d+$/.test(text)) {
      const num = parseInt(text, 10);
      const mappedNum = (num >= 1000 && num < 2000) ? (num - 1000) : num;
      studentId = `${prefix}${String(mappedNum).padStart(2, "0")}`;
    } else {
      studentId = text.toUpperCase();
    }

    const students = App.state.students || [];
    const student = students.find(s => {
      const sId = (s && s.ID ? s.ID : "").toUpperCase();
      return sId === studentId || (sId.replace(/\D/g, "") && sId.replace(/\D/g, "") === studentId.replace(/\D/g, ""));
    });

    if (!student) {
      App.showToast(`⚠️ រកមិនឃើញសិស្សតាមកូដ "${text}" នេះទេ!`, "warning");
      return;
    }

    // Check if student ID is locked / student has dropped out
    const isDropped = (typeof StudentAPI !== "undefined" && StudentAPI.isStudentIdBlocked(student.ID)) ||
                      student.Status === "Dropped" || student.Status === "បោះបង់" || student.Status === "បោះបង់ការសិក្សា" || student.isBlocked === true;

    if (isDropped) {
      // Play harsh warning tone
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {}

      // Show locked feedback card in modal
      const feedback = document.getElementById("qrScanFeedbackBox");
      if (feedback) {
        feedback.style.display = "block";
        feedback.innerHTML = `
          <div style="display: flex; align-items: center; gap: 14px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 14px; border-radius: 12px;">
            <img src="${student.Avatar || App.getDefaultAvatar(student.Gender)}" alt="${student.NameKh}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid #ef4444;" onerror="this.src='${App.getDefaultAvatar(student.Gender)}'">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin: 0; font-size: 1.05rem; color: #ef4444; font-weight: 700;">${student.NameKh}</h4>
                <span class="badge" style="background: #ef4444; color: #ffffff; font-weight: 700; font-size: 0.78rem;">
                  <i class="fa-solid fa-lock"></i> អត្តលេខចាក់សោរ (Locked)
                </span>
              </div>
              <div style="font-size: 0.85rem; color: #ef4444; font-weight: 700; margin-top: 4px;">
                ⛔ សិស្សនេះបានបោះបង់ការសិក្សា! អត្តលេខ ${student.ID} ប្រើប្រាស់លែងកើតឡើយ។
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                កាលបរិច្ឆេទបោះបង់៖ ${student.DropDate || 'មិនបានបញ្ជាក់'} • មូលហេតុ៖ ${student.DropReason || 'រវល់ផ្ទាល់ខ្លួន'}
              </div>
            </div>
          </div>
        `;
      }

      App.showToast(`⛔ អត្តលេខ ${student.ID} (${student.NameKh}) បានបោះបង់ការសិក្សា! អត្តលេខនេះត្រូវបានចាក់សោរ ប្រើលែងកើតឡើយ។`, "error");
      return;
    }

    // Set today's attendance as Present
    const today = new Date();
    const todayStr = this.formatLocalDate(today);
    this.setDayStatus(student.ID, todayStr, "Present");

    // Play pleasant chime
    this.playSuccessChime();

    // Show instant feedback card in modal
    const feedback = document.getElementById("qrScanFeedbackBox");
    if (feedback) {
      const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      feedback.style.display = "block";
      feedback.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="${student.Avatar || App.getDefaultAvatar(student.Gender)}" alt="${student.NameKh}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid #10b981;" onerror="this.src='${App.getDefaultAvatar(student.Gender)}'">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="margin: 0; font-size: 1.05rem; color: var(--text-main); font-weight: 700;">${student.NameKh}</h4>
              <span class="badge" style="background: #10b981; color: #ffffff; font-weight: 700;">
                <i class="fa-solid fa-check-circle"></i> វត្តមាន (Present)
              </span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              <span class="font-mono font-bold" style="color: var(--primary);">${student.ID}</span> • ${student.Course || 'Typing'} (${student.Shift || 'ព្រឹក'})
            </div>
            <div style="font-size: 0.76rem; color: #059669; font-weight: 600; margin-top: 4px;">
              <i class="fa-regular fa-clock"></i> ម៉ោងកត់ត្រា៖ ${timeStr} • ${todayStr}
            </div>
          </div>
        </div>
      `;
    }

    App.showToast(`🎉 វត្តមានជោគជ័យ៖ ${student.NameKh} (${student.ID})`, "success");
    App.triggerConfetti();

    // Trigger Debounced 5-Minute Shift Attendance Summary to Telegram (consolidated report)
    if (typeof TelegramService !== "undefined" && TelegramService.scheduleShiftAttendanceSummary) {
      const shift = student.Shift || this.filters.shift || "ព្រឹក";
      TelegramService.scheduleShiftAttendanceSummary(shift, todayStr, "ស្កេនកាត / QR Code");
    }
  },

  updateMonthSelectUI() {
    const mSelect = document.getElementById("attMonthSelect");
    const ySelect = document.getElementById("attYearSelect");
    if (mSelect) mSelect.value = this.currentMonth;
    if (ySelect) ySelect.value = this.currentYear;
  },

  refreshWeekTabsAndTable() {
    const weeks = this.getWeeksForMonth(this.currentYear, this.currentMonth);
    const tabsContainer = document.getElementById("attWeekTabs");
    if (tabsContainer) {
      tabsContainer.innerHTML = this.renderWeekTabs(weeks);
    }
    this.renderTable();
  },

  loadAllAttendance() {
    const local = StudentAPI.getAllAttendance() || {};
    this.records = { ...local, ...(this.records || {}) };
  },

  getFilteredStudents() {
    let students = App.state.students || [];
    // Only active students attend classes! Exclude dropped out students whose ID is locked
    students = students.filter(s => {
      if (!s) return false;
      const status = (s.Status || "").toLowerCase();
      if (s.isBlocked === true || status === "dropped" || status === "បោះបង់" || status === "បោះបង់ការសិក្សា" || (typeof StudentAPI !== "undefined" && StudentAPI.isStudentIdBlocked(s.ID))) return false;
      return true;
    });

    if (this.filters.course) {
      students = students.filter(s => (s.Course || "").includes(this.filters.course));
    }
    if (this.filters.shift) {
      students = students.filter(s => s.Shift === this.filters.shift);
    }
    if (this.filters.search) {
      const q = this.filters.search;
      students = students.filter(s => 
        (s.NameKh && s.NameKh.toLowerCase().includes(q)) ||
        (s.NameEn && s.NameEn.toLowerCase().includes(q)) ||
        (s.ID && s.ID.toLowerCase().includes(q))
      );
    }
    return students;
  },

  _syncTimeout: null,
  syncToFirebase() {
    clearTimeout(this._syncTimeout);
    this._syncTimeout = setTimeout(async () => {
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
        try {
          await StudentAPI.saveMultipleDaysAttendance(this.records);
          console.log("☁️ បាន Sync វត្តមានទៅ Firebase RTDB ដោយស្វ័យប្រវត្តិ");
        } catch (e) {
          console.warn("Auto sync attendance to cloud notice:", e);
        }
      }
    }, 600);
  },

  // 1-Click Intuitive Toggle: Empty -> Present -> Untick
  toggleDayStatus(studentId, dateStr) {
    if (!this.records[dateStr]) this.records[dateStr] = {};
    const current = this.records[dateStr][studentId] || "";

    let nextStatus = "";
    if (current === "Present" || current === "វត្តមាន" || (current && current.toLowerCase() === "present")) {
      nextStatus = ""; // If already Present, clicking again unticks it
    } else {
      nextStatus = "Present"; // If empty/permission/absent, clicking marks Present
    }

    this.setDayStatus(studentId, dateStr, nextStatus);
  },

  setDayStatus(studentId, dateStr, status) {
    if (typeof StudentAPI !== "undefined" && StudentAPI.isStudentIdBlocked(studentId)) {
      App.showToast(`⛔ អត្តលេខ ${studentId} ត្រូវបានចាក់សោរ (បោះបង់ការសិក្សា) ប្រើលែងកើតឡើយ!`, "error");
      return;
    }

    if (!this.records[dateStr]) this.records[dateStr] = {};
    if (status) {
      this.records[dateStr][studentId] = status;
    } else {
      delete this.records[dateStr][studentId];
    }
    this.hasUnsavedChanges = true;

    // 1. Immediately persist to localStorage so it NEVER disappears on reload/re-render!
    StudentAPI.saveAllAttendance(this.records);

    // 2. Debounced auto-sync to Firebase Cloud
    this.syncToFirebase();

    // Update single cell DOM for seamless UX
    const cellBtn = document.querySelector(`.att-tick-btn[data-student-id="${studentId}"][data-date="${dateStr}"]`);
    if (cellBtn) {
      cellBtn.className = `att-tick-btn ${this.getStatusClass(status)}`;
      cellBtn.innerHTML = this.getStatusBtnInner(status);
    }

    // Update row summary
    this.updateStudentRowSummary(studentId);

    // Update overall KPIs
    this.updateKpiCounters();

    // Trigger Debounced 5-Minute Shift Attendance Summary to Telegram (consolidated per shift)
    if (typeof TelegramService !== "undefined" && TelegramService.scheduleShiftAttendanceSummary) {
      const student = (App.state.students || []).find(s => String(s.ID).trim() === String(studentId).trim());
      const shift = (student && student.Shift) ? student.Shift : (this.filters.shift || "ព្រឹក");
      const teacher = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) ? AuthService.getCurrentUser().nameKh : null;
      TelegramService.scheduleShiftAttendanceSummary(shift, dateStr, teacher);
    }
  },

  getStatusClass(status) {
    const s = (status || "").toLowerCase();
    if (status === "Present" || status === "វត្តមាន" || s === "present") return "state-present";
    if (status === "Permission" || status === "ច្បាប់" || s === "permission") return "state-permission";
    if (status === "Absent" || status === "អវត្តមាន" || s === "absent") return "state-absent";
    return "state-empty";
  },

  getStatusBtnInner(status) {
    const s = (status || "").toLowerCase();
    if (status === "Present" || status === "វត្តមាន" || s === "present") {
      return `<i class="fa-solid fa-check"></i> វត្តមាន`;
    }
    if (status === "Permission" || status === "ច្បាប់" || s === "permission") {
      return `<i class="fa-solid fa-envelope-open-text"></i> ច្បាប់`;
    }
    if (status === "Absent" || status === "អវត្តមាន" || s === "absent") {
      return `<i class="fa-solid fa-xmark"></i> អវត្តមាន`;
    }
    return `<i class="fa-solid fa-plus"></i> គ្រីស`;
  },

  // Mark all students present for a single day column
  markAllPresentForDay(dateStr) {
    if (!this.records[dateStr]) this.records[dateStr] = {};
    const students = this.getFilteredStudents();
    students.forEach(s => {
      const id = s.ID || s.id;
      if (id) {
        this.records[dateStr][id] = "Present";
      }
    });
    this.hasUnsavedChanges = true;
    StudentAPI.saveAllAttendance(this.records);
    this.syncToFirebase();
    this.renderTable();
    App.showToast(`បានគ្រីសវត្តមានសិស្សទាំងអស់ (${students.length} នាក់) សម្រាប់ថ្ងៃទី ${dateStr}`, "info");

    // Trigger shift summary scheduler for affected shifts
    if (typeof TelegramService !== "undefined" && TelegramService.scheduleShiftAttendanceSummary) {
      const teacher = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) ? AuthService.getCurrentUser().nameKh : null;
      const affectedShifts = [...new Set(students.map(s => s.Shift).filter(Boolean))];
      if (affectedShifts.length === 0) affectedShifts.push(this.filters.shift || "ព្រឹក");
      affectedShifts.forEach(sh => {
        TelegramService.scheduleShiftAttendanceSummary(sh, dateStr, teacher);
      });
    }
  },

  // Mark all students present for all 5 days of current week
  markAllWeekPresent() {
    const currentWeek = this.getCurrentWeek();
    if (!currentWeek) return;

    const students = this.getFilteredStudents();
    currentWeek.days.forEach(day => {
      if (!this.records[day.dateStr]) this.records[day.dateStr] = {};
      students.forEach(s => {
        const id = s.ID || s.id;
        if (id) {
          this.records[day.dateStr][id] = "Present";
        }
      });
    });

    this.hasUnsavedChanges = true;
    StudentAPI.saveAllAttendance(this.records);
    this.syncToFirebase();
    this.renderTable();
    App.showToast(`បានគ្រីសវត្តមានសិស្សទាំងអស់ (${students.length} នាក់) ពេញមួយសប្តាហ៍ទាំង ៥ ថ្ងៃជោគជ័យ!`, "success");
    App.triggerConfetti();

    // Trigger 5-minute delayed shift summary for affected shifts
    if (typeof TelegramService !== "undefined" && TelegramService.scheduleShiftAttendanceSummary) {
      const teacher = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) ? AuthService.getCurrentUser().nameKh : null;
      const todayStr = this.formatLocalDate(new Date());
      const affectedShifts = [...new Set(students.map(s => s.Shift).filter(Boolean))];
      if (affectedShifts.length === 0) affectedShifts.push(this.filters.shift || "ព្រឹក");
      affectedShifts.forEach(sh => {
        TelegramService.scheduleShiftAttendanceSummary(sh, todayStr, teacher);
      });
    }
  },

  // Explicit Save Attendance Handler
  async saveAttendance() {
    const saveBtn = document.getElementById("saveAttendanceBtn");
    const origHtml = saveBtn ? saveBtn.innerHTML : "";
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>កំពុងរក្សាទុក...</span>`;
    }

    try {
      // 1. Save all attendance locally and to cloud
      StudentAPI.saveAllAttendance(this.records);
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected() && typeof StudentAPI.saveMultipleDaysAttendance === "function") {
        await StudentAPI.saveMultipleDaysAttendance(this.records);
      }
      this.hasUnsavedChanges = false;

      App.showToast("💾 បានរក្សាទុកវត្តមានសិស្សដោយជោគជ័យ!", "success");
      App.triggerConfetti();

      if (typeof DashboardView !== "undefined" && DashboardView.update) {
        DashboardView.update(App.state.students);
      }

      // 2. Schedule 5-minute delayed shift attendance summary with PDF & Excel
      const todayStr = this.formatLocalDate(new Date());
      const teacher = (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) ? AuthService.getCurrentUser().nameKh : "លោកគ្រូ ខៀន ធូ";

      if (typeof TelegramService !== "undefined" && TelegramService.scheduleShiftAttendanceSummary) {
        const currentFilterShift = this.filters.shift;
        if (currentFilterShift) {
          TelegramService.scheduleShiftAttendanceSummary(currentFilterShift, todayStr, teacher, 5);
        } else {
          // If all shifts are shown, schedule for each shift that has data
          const students = this.getFilteredStudents();
          const shifts = [...new Set(students.map(s => s.Shift).filter(Boolean))];
          if (shifts.length === 0) shifts.push("ព្រឹក");
          shifts.forEach(sh => {
            TelegramService.scheduleShiftAttendanceSummary(sh, todayStr, teacher, 5);
          });
        }
        App.showToast("⏰ Telegram Bot នឹងផ្ញើរបាយការណ៍ PDF & Excel ទៅ Telegram ក្រោយ ៥ នាទី!", "info");
      }

      // 3. Check 7:00 PM Telegram daily summary trigger when attendance is saved
      const now = new Date();
      const currH = now.getHours();
      const hasTodayData = this.records && this.records[todayStr] && Object.keys(this.records[todayStr]).length > 0;

      if (currH >= 19 && hasTodayData && typeof TelegramService !== "undefined") {
        const sentKey = `ms_daily_att_sent_${todayStr}`;
        if (!localStorage.getItem(sentKey)) {
          setTimeout(() => {
            TelegramService.sendDailyAttendanceSummary(todayStr, false, "គ្រូបង្រៀន (កត់ត្រាវត្តមានរួចរាល់ ៧:០០ យប់)");
          }, 800);
        }
      }
    } catch (err) {
      console.warn("Save attendance error:", err);
      App.showToast("កំហុសក្នុងការរក្សាទុក៖ " + err.message, "error");
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = origHtml || `<i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកវត្តមាន</span>`;
      }
    }
  },

  updateStudentRowSummary(studentId) {
    const currentWeek = this.getCurrentWeek();
    if (!currentWeek) return;

    let present = 0;
    let permission = 0;
    let absent = 0;
    let recorded = 0;

    currentWeek.days.forEach(d => {
      const st = this.records[d.dateStr]?.[studentId];
      const sLower = (st || "").toLowerCase();
      if (st === "Present" || st === "វត្តមាន" || sLower === "present") { present++; recorded++; }
      else if (st === "Permission" || st === "ច្បាប់" || sLower === "permission") { permission++; recorded++; }
      else if (st === "Absent" || st === "អវត្តមាន" || sLower === "absent") { absent++; recorded++; }
    });

    const rate = recorded > 0 ? Math.round((present / recorded) * 100) : 100;

    const row = document.querySelector(`tr[data-row-student-id="${studentId}"]`);
    if (row) {
      const summaryCell = row.querySelector(".att-weekly-summary-cell");
      if (summaryCell) {
        summaryCell.innerHTML = `
          <div class="att-weekly-pill-box">
            <div class="att-weekly-counts">
              <span class="att-cnt-pres" title="វត្តមាន">${present} វ</span>
              <span class="att-cnt-perm" title="ច្បាប់">${permission} ច</span>
              <span class="att-cnt-abs" title="អវត្តមាន">${absent} អ</span>
            </div>
            <span class="badge-attendance-rate ${rate >= 85 ? 'rate-high' : rate >= 70 ? 'rate-medium' : 'rate-low'}">
              ${rate}% (${present}/5)
            </span>
          </div>
        `;
      }
    }
  },

  updateKpiCounters() {
    const currentWeek = this.getCurrentWeek();
    const students = this.getFilteredStudents();
    const totalStudents = students.length;

    let totalPossible = 0;
    let totalPresent = 0;
    let totalPermission = 0;
    let totalAbsent = 0;

    if (currentWeek) {
      currentWeek.days.forEach(d => {
        students.forEach(s => {
          totalPossible++;
          const id = s.ID || s.id;
          const st = this.records[d.dateStr]?.[id];
          const sLower = (st || "").toLowerCase();
          if (st === "Present" || st === "វត្តមាន" || sLower === "present") totalPresent++;
          else if (st === "Permission" || st === "ច្បាប់" || sLower === "permission") totalPermission++;
          else if (st === "Absent" || st === "អវត្តមាន" || sLower === "absent") totalAbsent++;
        });
      });
    }

    const recordedDays = totalPresent + totalPermission + totalAbsent;
    const rate = recordedDays > 0 ? Math.round((totalPresent / recordedDays) * 100) : 100;

    const elTotal = document.getElementById("attKpiTotal");
    const elPresent = document.getElementById("attKpiPresent");
    const elPerm = document.getElementById("attKpiPermission");
    const elAbsent = document.getElementById("attKpiAbsent");
    const elRate = document.getElementById("attKpiRate");

    if (elTotal) elTotal.textContent = totalStudents;
    if (elPresent) elPresent.textContent = totalPresent;
    if (elPerm) elPerm.textContent = totalPermission;
    if (elAbsent) elAbsent.textContent = totalAbsent;
    if (elRate) elRate.textContent = `${rate}%`;
  },

  renderTable() {
    const container = document.getElementById("attendanceTableContainer");
    if (!container) return;

    this.loadAllAttendance();
    const students = this.getFilteredStudents();
    const currentWeek = this.getCurrentWeek();

    if (!currentWeek) {
      container.innerHTML = `<div class="p-5 text-center text-muted">មិនមានទិន្នន័យសប្តាហ៍សម្រាប់ខែនេះឡើយ</div>`;
      return;
    }

    this.updateKpiCounters();

    const weekDays = currentWeek.days;

    container.innerHTML = `
      <table class="att-table-5days">
        <thead>
          <tr>
            <th class="text-center" style="width: 45px;">#</th>
            <th style="width: 90px;">អត្តលេខ</th>
            <th style="width: 220px;">ព័ត៌មានសិស្ស</th>
            <th style="width: 130px;">ថ្នាក់ & វេន</th>
            
            <!-- 5 Days Columns: Monday to Friday (ចន្ទ ដល់ សុក្រ) -->
            ${weekDays.map(day => `
              <th class="att-th-day ${day.isToday ? 'is-today' : ''}">
                <div class="att-day-name">
                  ${day.dayNameKh}
                  ${day.isToday ? '<span style="color: #10b981; font-size: 0.72rem; margin-left: 2px;">(ថ្ងៃនេះ)</span>' : ''}
                </div>
                <div class="att-day-date">${day.displayLabel}</div>
                <button type="button" class="att-day-mark-all" onclick="AttendanceView.markAllPresentForDay('${day.dateStr}')" title="គ្រីសវត្តមានទាំងអស់ថ្ងៃ${day.dayNameKh}">
                  <i class="fa-solid fa-check text-emerald-500"></i> គ្រីសទាំងអស់
                </button>
              </th>
            `).join("")}

            <!-- Weekly Summary Column -->
            <th class="text-center" style="width: 120px;">សរុបសប្តាហ៍</th>
          </tr>
        </thead>
        <tbody>
          ${students.length === 0 ? `
            <tr>
              <td colspan="10" class="text-center py-5 text-muted">មិនមានសិស្សតាមតម្រងដែលបានជ្រើសរើសឡើយ</td>
            </tr>
          ` : students.map((s, idx) => {
            let present = 0;
            let permission = 0;
            let absent = 0;
            let recorded = 0;

            weekDays.forEach(d => {
              const id = s.ID || s.id;
              const st = this.records[d.dateStr]?.[id];
              const sLower = (st || "").toLowerCase();
              if (st === "Present" || st === "វត្តមាន" || sLower === "present") { present++; recorded++; }
              else if (st === "Permission" || st === "ច្បាប់" || sLower === "permission") { permission++; recorded++; }
              else if (st === "Absent" || st === "អវត្តមាន" || sLower === "absent") { absent++; recorded++; }
            });

            const rate = recorded > 0 ? Math.round((present / recorded) * 100) : 100;

            const id = s.ID || s.id;
            return `
              <tr data-row-student-id="${id}">
                <td class="text-center font-semibold text-muted">${idx + 1}</td>
                <td><span class="badge badge-id font-mono">${App.escapeHtml(id)}</span></td>
                <td>
                  <div class="user-badge">
                    <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
                    <div>
                      <div class="font-bold student-name-link" onclick="App.viewStudentDetails('${id}')">
                        ${App.escapeHtml(s.NameKh)}
                        ${App.isNewStudent(s) ? `<span class="badge-new-student" title="សិស្សចុះឈ្មោះថ្មី"><i class="fa-solid fa-sparkles"></i> សិស្សថ្មី</span>` : ''}
                      </div>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="text-xs text-muted font-sans">${App.escapeHtml(s.NameEn || '')}</span>
                        ${s.Phone || s.GuardianPhone ? `
                          <a href="tel:${s.Phone || s.GuardianPhone}" style="color: #10b981; font-size: 0.72rem;" title="Call ទៅសិស្ស/អាណាព្យាបាល"><i class="fa-solid fa-phone"></i></a>
                          <a href="https://t.me/+855${String(s.Phone || s.GuardianPhone).replace(/^0/, '').replace(/\s+/g, '')}" target="_blank" style="color: #0088cc; font-size: 0.76rem;" title="ផ្ញើសារ Telegram ទៅអាណាព្យាបាល"><i class="fa-brands fa-telegram"></i></a>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="display: flex; flex-direction: column; gap: 3px; align-items: flex-start;">
                    <span class="badge-course ${App.getCourseBadgeClass(s.Course || 'Typing')}" style="font-size: 0.72rem; padding: 2px 6px;">${App.escapeHtml(s.Course || 'Typing')}</span>
                    <span class="text-xs text-muted font-semibold">${App.getShiftLabel(s.Shift)}</span>
                  </div>
                </td>

                <!-- 5 Interactive Day Tick Cells (ចន្ទ ដល់ សុក្រ) -->
                ${weekDays.map(day => {
                  const status = this.records[day.dateStr]?.[id] || "";
                  const statusClass = this.getStatusClass(status);
                  const btnInner = this.getStatusBtnInner(status);

                  return `
                    <td class="att-day-cell">
                      <div style="position: relative; display: inline-block; width: 100%;">
                        <button type="button" 
                          class="att-tick-btn ${statusClass}" 
                          data-student-id="${id}" 
                          data-date="${day.dateStr}"
                          onclick="AttendanceView.toggleDayStatus('${id}', '${day.dateStr}')"
                          title="ចុចដើម្បីគ្រីសវត្តមាន">
                          ${btnInner}
                        </button>

                        <!-- Quick Hover Status Chooser -->
                        <div class="att-quick-popover">
                          <button type="button" class="att-pop-btn p-pres" onclick="event.stopPropagation(); AttendanceView.setDayStatus('${id}', '${day.dateStr}', 'Present')">
                            <i class="fa-solid fa-check"></i> វត្តមាន
                          </button>
                          <button type="button" class="att-pop-btn p-perm" onclick="event.stopPropagation(); AttendanceView.setDayStatus('${id}', '${day.dateStr}', 'Permission')">
                            <i class="fa-solid fa-envelope-open-text"></i> ច្បាប់
                          </button>
                          <button type="button" class="att-pop-btn p-abs" onclick="event.stopPropagation(); AttendanceView.setDayStatus('${id}', '${day.dateStr}', 'Absent')">
                            <i class="fa-solid fa-xmark"></i> អវត្តមាន
                          </button>
                          <button type="button" class="att-pop-btn p-clr" onclick="event.stopPropagation(); AttendanceView.setDayStatus('${id}', '${day.dateStr}', '')">
                            <i class="fa-solid fa-trash-can"></i> លុប
                          </button>
                        </div>
                      </div>
                    </td>
                  `;
                }).join("")}

                <!-- Weekly Summary Column -->
                <td class="text-center att-weekly-summary-cell">
                  <div class="att-weekly-pill-box">
                    <div class="att-weekly-counts">
                      <span class="att-cnt-pres" title="វត្តមាន">${present} វ</span>
                      <span class="att-cnt-perm" title="ច្បាប់">${permission} ច</span>
                      <span class="att-cnt-abs" title="អវត្តមាន">${absent} អ</span>
                    </div>
                    <span class="badge-attendance-rate ${rate >= 85 ? 'rate-high' : rate >= 70 ? 'rate-medium' : 'rate-low'}">
                      ${rate}% (${present}/5)
                    </span>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;

    // Check and highlight 2-day consecutive absences
    this.checkConsecutiveAbsences();
  },

  checkConsecutiveAbsences() {
    const banner = document.getElementById("attConsecutiveAbsenceBanner");
    if (!banner) return;

    const currentWeek = this.getCurrentWeek();
    if (!currentWeek || !currentWeek.days || currentWeek.days.length < 2) {
      banner.style.display = "none";
      return;
    }

    // Find recorded dates in current week sorted ascending
    const recordedDays = currentWeek.days.filter(d => this.records[d.dateStr] && Object.keys(this.records[d.dateStr]).length > 0);
    if (recordedDays.length < 2) {
      banner.style.display = "none";
      return;
    }

    const lastDay = recordedDays[recordedDays.length - 1].dateStr;
    const prevDay = recordedDays[recordedDays.length - 2].dateStr;

    const students = this.getFilteredStudents();
    const absentStudents = [];

    students.forEach(s => {
      const r1 = this.records[lastDay] ? this.records[lastDay][s.ID] : null;
      const r2 = this.records[prevDay] ? this.records[prevDay][s.ID] : null;
      const isAbsent1 = r1 === "Absent" || r1 === "អវត្តមាន";
      const isAbsent2 = r2 === "Absent" || r2 === "អវត្តមាន";

      if (isAbsent1 && isAbsent2) {
        absentStudents.push(s);
      }
    });

    if (absentStudents.length === 0) {
      banner.style.display = "none";
      banner.innerHTML = "";
      return;
    }

    banner.style.display = "block";
    banner.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(245, 158, 11, 0.08)); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #ef4444; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <strong style="color: #b91c1c; font-size: 0.95rem;">សិស្សអវត្តមាន ២ ថ្ងៃជាប់គ្នា (${absentStudents.length} នាក់)</strong>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 2px;">
              សិស្សអវត្តមានទាំងថ្ងៃ ${prevDay} និង ${lastDay} ៖ ${absentStudents.map(s => `<strong>${s.NameKh}</strong> (${s.ID})`).join(", ")}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${absentStudents.map(s => `
            <button type="button" class="btn-primary btn-sm" style="background: #0088cc; border-color: #0088cc; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px;" onclick="TeacherToolsService.sendAbsenceInquiry(App.state.students.find(x => x.ID === '${s.ID}'), 2)">
              <i class="fa-brands fa-telegram"></i> <span>សួរនាំ ${s.NameKh}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  },

  // ====================================================
  // LEAVE REQUESTS ADMINISTRATIVE CONTROLS
  // ====================================================
  openLeaveRequestsModal() {
    ModalsComponent.open("leaveRequestAdminModal");
    this.renderLeaveRequestsList("all");
  },

  renderLeaveRequestsList(filter = "all") {
    const container = document.getElementById("adminLeaveRequestsListContainer");
    if (!container) return;

    let requests = typeof StudentAPI !== "undefined" ? StudentAPI.getLeaveRequests() : [];
    if (filter !== "all") {
      requests = requests.filter(r => r.status === filter);
    }

    if (requests.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-envelope-circle-check fa-3x mb-3" style="color: #94a3b8;"></i>
          <h4>មិនមានសំណើសុំច្បាប់ ${filter === "pending" ? "ដែលរង់ចាំពិនិត្យ" : ""} ឡើយ</h4>
          <p style="font-size: 0.85rem;">សិស្សអាចដាក់ពាក្យសុំច្បាប់តាមរយៈ Student Portal ដោយខ្លួនឯង។</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${requests.map(req => {
          const isPending = req.status === "pending";
          const isApproved = req.status === "approved";
          const isRejected = req.status === "rejected";

          return `
            <div style="background: var(--bg-surface); border: 1.5px solid ${isPending ? '#f59e0b' : isApproved ? '#10b981' : '#ef4444'}; border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; box-shadow: var(--shadow-xs);">
              <div style="flex: 1; min-width: 260px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                  <span class="font-mono font-bold" style="background: rgba(99, 102, 241, 0.1); color: #4f46e5; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem;">${req.studentId}</span>
                  <h4 style="margin: 0; font-size: 1rem; color: var(--text-main); font-weight: 700;">${req.studentNameKh}</h4>
                  <span class="badge" style="background: ${isPending ? '#fef3c7' : isApproved ? '#d1fae5' : '#fee2e2'}; color: ${isPending ? '#d97706' : isApproved ? '#059669' : '#dc2626'}; font-size: 0.72rem; font-weight: 700; padding: 3px 8px;">
                    ${isPending ? '⏳ រង់ចាំពិនិត្យ' : isApproved ? '✓ បានយល់ព្រម' : '✕ បានបដិសេធ'}
                  </span>
                  ${req.source === "telegram" ? `
                    <span class="badge" style="background: rgba(0, 136, 204, 0.15); color: #0088cc; font-size: 0.72rem; font-weight: 700; padding: 3px 8px;">
                      <i class="fa-brands fa-telegram"></i> Telegram Auto
                    </span>
                  ` : ''}
                </div>

                <div style="font-size: 0.86rem; color: var(--text-main); margin-bottom: 4px;">
                  <i class="fa-regular fa-calendar-days text-emerald-600"></i> សុំឈប់ពីថ្ងៃ៖ <strong>${req.startDate}</strong> ដល់ <strong>${req.endDate}</strong>
                </div>

                <div style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 4px;">
                  <i class="fa-solid fa-comment-dots text-indigo-500"></i> មូលហេតុ៖ <em>"${App.escapeHtml(req.reason || '')}"</em>
                </div>

                <div style="font-size: 0.76rem; color: var(--text-muted); display: flex; gap: 14px; flex-wrap: wrap;">
                  <span><i class="fa-regular fa-clock"></i> ពេលស្នើសុំ៖ ${new Date(req.createdAt).toLocaleString('km-KH')}</span>
                  ${req.phone ? `<span><i class="fa-solid fa-phone"></i> ទាក់ទង៖ <a href="tel:${req.phone}">${req.phone}</a></span>` : ''}
                  ${req.approvedBy ? `<span><i class="fa-solid fa-user-check"></i> ពិនិត្យដោយ៖ ${req.approvedBy}</span>` : ''}
                </div>
              </div>

              <!-- Action Buttons -->
              <div style="display: flex; gap: 8px;">
                ${isPending ? `
                  <button type="button" class="btn-primary" style="background: #10b981; border-color: #10b981; padding: 6px 14px; font-size: 0.84rem;" onclick="AttendanceView.handleApproveLeave('${req.id}')">
                    <i class="fa-solid fa-check"></i> យល់ព្រម (Approve)
                  </button>
                  <button type="button" class="btn-outline-danger" style="padding: 6px 14px; font-size: 0.84rem;" onclick="AttendanceView.handleRejectLeave('${req.id}')">
                    <i class="fa-solid fa-xmark"></i> បដិសេធ (Reject)
                  </button>
                ` : `
                  <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">
                    ${isApproved ? '✅ បានកត់ត្រា "ច្បាប់" រួចរាល់' : '❌ បានបដិសេធ'}
                  </span>
                `}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  async handleApproveLeave(reqId) {
    if (typeof StudentAPI === "undefined") return;
    try {
      const updated = await StudentAPI.updateLeaveRequestStatus(reqId, "approved", "លោកគ្រូ ខៀន ធូ");
      if (updated) {
        App.showToast(`🎉 បានយល់ព្រមច្បាប់ឈប់របស់សិស្ស ${updated.studentNameKh} និងគ្រីសវត្តមាន "P" ជោគជ័យ!`, "success");
        App.triggerConfetti();
        this.renderLeaveRequestsList("all");
        this.renderTable();
      }
    } catch (err) {
      App.showToast("កំហុសក្នុងការយល់ព្រមច្បាប់: " + err.message, "error");
    }
  },

  async handleRejectLeave(reqId) {
    if (typeof StudentAPI === "undefined") return;
    try {
      const updated = await StudentAPI.updateLeaveRequestStatus(reqId, "rejected", "លោកគ្រូ ខៀន ធូ");
      if (updated) {
        App.showToast(`បានបដិសេធច្បាប់ឈប់របស់សិស្ស ${updated.studentNameKh}`, "info");
        this.renderLeaveRequestsList("all");
      }
    } catch (err) {
      App.showToast("កំហុស: " + err.message, "error");
    }
  }
};

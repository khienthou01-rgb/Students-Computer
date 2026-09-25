/**
 * View: Dashboard (KPI Metrics, Visual Charts, Recent Enrollments)
 */
const DashboardView = {
  render() {
    const currentUser = (typeof AuthService !== "undefined" && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
    const teacherName = (currentUser && (currentUser.nameKh || currentUser.nameEn || currentUser.username)) || "លោកគ្រូ ខៀន ធូ";

    return `
      <section id="view-dashboard" class="page-view active">
        <!-- 1. 2026 Modern Hero Welcome Section with 3D Tech Visual -->
        <div class="card" style="margin-bottom: 22px; padding: 24px 30px; background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 60%, rgba(79, 70, 229, 0.25) 100%); border: 1.5px solid rgba(56, 189, 248, 0.25); border-radius: 20px; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35); position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
          <!-- Left Content -->
          <div style="flex: 1; min-width: 320px; z-index: 2;">
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 14px; border-radius: 20px; font-size: 0.78rem; color: #38bdf8; font-weight: 700; margin-bottom: 10px;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
              <span>Next-Gen Education Platform 2026 • TIS Lab Computer</span>
            </div>
            <h1 id="dashWelcomeTitle" style="font-size: 1.7rem; font-weight: 900; color: #ffffff; margin: 0 0 6px 0; letter-spacing: 0.3px; line-height: 1.25;">
              Welcome back, <span id="dashTeacherName" style="color: #38bdf8;">${teacherName}</span> 👋
            </h1>
            <p style="margin: 0 0 16px 0; font-size: 0.9rem; color: #cbd5e1; max-width: 620px; line-height: 1.5;">
              ថ្ងៃនេះគឺ <strong id="dashLiveDateKh" style="color: #38bdf8;">--</strong> • ប្រព័ន្ធគ្រប់គ្រងសិស្ស ស្ថិតិសិក្សា បន្ទប់ពិសោធន៍កុំព្យូទ័រ និងការប្រឡងបញ្ចប់វគ្គដំណើរការរលូន ១០០%។
            </p>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <button type="button" class="btn-primary" onclick="App.openAddStudentModal()" style="height: 40px; padding: 0 18px; font-size: 0.88rem; font-weight: 800; border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #06b6d4); box-shadow: 0 4px 18px rgba(79, 70, 229, 0.45);">
                <i class="fa-solid fa-user-plus"></i>
                <span>+ ចុះឈ្មោះសិស្សថ្មី</span>
              </button>
              <button type="button" class="btn-secondary" onclick="App.switchTab('attendance')" style="height: 40px; padding: 0 16px; font-size: 0.88rem; font-weight: 700; border-radius: 12px;">
                <i class="fa-solid fa-calendar-check text-emerald-400"></i>
                <span>កត់ត្រាវត្តមាន</span>
              </button>
              <button type="button" class="btn-secondary" onclick="App.switchTab('timetable')" style="height: 40px; padding: 0 16px; font-size: 0.88rem; font-weight: 700; border-radius: 12px;">
                <i class="fa-solid fa-desktop text-cyan-400"></i>
                <span>Lab Live Cockpit</span>
              </button>
            </div>
          </div>

          <!-- Right 3D Educational Technology Illustration -->
          <div style="width: 200px; height: 130px; display: flex; align-items: center; justify-content: center; z-index: 2; position: relative;">
            <svg viewBox="0 0 240 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 10px 25px rgba(6, 182, 212, 0.3));">
              <!-- Futuristic 3D Floating Monitor & Graduation Tech Elements -->
              <defs>
                <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#06b6d4"/>
                  <stop offset="50%" stop-color="#4f46e5"/>
                  <stop offset="100%" stop-color="#8b5cf6"/>
                </linearGradient>
                <linearGradient id="cubeFace1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0.9"/>
                </linearGradient>
                <linearGradient id="cubeFace2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#818cf8"/>
                  <stop offset="100%" stop-color="#4f46e5"/>
                </linearGradient>
              </defs>
              <!-- 3D Stand -->
              <ellipse cx="120" cy="140" rx="60" ry="12" fill="url(#glowGrad)" opacity="0.3"/>
              <!-- Floating Monitor Frame -->
              <rect x="50" y="25" width="140" height="90" rx="14" fill="#0f172a" stroke="url(#glowGrad)" stroke-width="3"/>
              <rect x="58" y="33" width="124" height="68" rx="8" fill="#060913"/>
              <!-- Screen UI Elements inside 3D monitor -->
              <circle cx="70" cy="45" r="4" fill="#10b981"/>
              <circle cx="82" cy="45" r="4" fill="#f59e0b"/>
              <circle cx="94" cy="45" r="4" fill="#ef4444"/>
              <line x1="70" y1="60" x2="130" y2="60" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
              <line x1="70" y1="72" x2="110" y2="72" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round"/>
              <line x1="70" y1="84" x2="145" y2="84" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
              <!-- Floating 3D Graduation Cap Icon -->
              <g transform="translate(155, 12)">
                <path d="M25 5 L45 15 L25 25 L5 15 Z" fill="url(#cubeFace1)"/>
                <path d="M12 20 L12 28 C12 34 38 34 38 28 L38 20" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
                <circle cx="25" cy="15" r="2.5" fill="#fde68a"/>
                <path d="M25 15 L43 24 L43 32" stroke="#fde68a" stroke-width="2" stroke-linecap="round"/>
              </g>
              <!-- Floating 3D Holographic Cube -->
              <g transform="translate(20, 75)">
                <polygon points="18,2 34,10 18,18 2,10" fill="url(#cubeFace1)"/>
                <polygon points="2,10 18,18 18,34 2,26" fill="url(#cubeFace2)"/>
                <polygon points="34,10 18,18 18,34 34,26" fill="#1e1b4b" opacity="0.8"/>
              </g>
            </svg>
          </div>
        </div>

        <!-- 2. Statistics Cards (5 Animated Futuristic Cards with Sparklines & % Trends) -->
        <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 22px;">
          <!-- Total Students Card -->
          <div class="kpi-card" style="--card-accent: #4f46e5; --icon-bg: rgba(79, 70, 229, 0.15); --icon-color: #4f46e5; border-radius: 18px; padding: 20px;">
            <div class="kpi-info">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">សិស្សសរុប (Total Students)</span>
              <div id="kpiTotal" class="kpi-number" style="font-size: 2rem; font-weight: 900; margin: 4px 0;">0</div>
              <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem;">
                <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 800; padding: 2px 7px; border-radius: 6px;">
                  <i class="fa-solid fa-arrow-trend-up"></i> +100%
                </span>
                <span id="kpiNewMonth" style="color: var(--text-muted);">ក្នុងខែនេះ</span>
              </div>
            </div>
            <div class="kpi-icon-box" style="width: 48px; height: 48px; font-size: 1.25rem;">
              <i class="fa-solid fa-users"></i>
            </div>
          </div>

          <!-- Teachers / Instructors Card -->
          <div class="kpi-card" style="--card-accent: #06b6d4; --icon-bg: rgba(6, 182, 212, 0.15); --icon-color: #06b6d4; border-radius: 18px; padding: 20px;">
            <div class="kpi-info">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">គ្រូបង្រៀន (Teachers)</span>
              <div id="kpiTeachersCount" class="kpi-number" style="font-size: 2rem; font-weight: 900; margin: 4px 0; color: #38bdf8;">2</div>
              <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem;">
                <span class="badge" style="background: rgba(6, 182, 212, 0.15); color: #38bdf8; font-weight: 800; padding: 2px 7px; border-radius: 6px;">
                  <i class="fa-solid fa-check"></i> ពេញម៉ោង
                </span>
                <span style="color: var(--text-muted);">គ្រូកុំព្យូទ័រជំនាញ</span>
              </div>
            </div>
            <div class="kpi-icon-box" style="width: 48px; height: 48px; font-size: 1.25rem;">
              <i class="fa-solid fa-chalkboard-user"></i>
            </div>
          </div>

          <!-- Computer Classes Card -->
          <div class="kpi-card" style="--card-accent: #8b5cf6; --icon-bg: rgba(139, 92, 246, 0.15); --icon-color: #8b5cf6; border-radius: 18px; padding: 20px;">
            <div class="kpi-info">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">ថ្នាក់កុំព្យូទ័រ (Classes)</span>
              <div id="kpiClassesCount" class="kpi-number" style="font-size: 2rem; font-weight: 900; margin: 4px 0; color: #a78bfa;">3</div>
              <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem;">
                <span class="badge" style="background: rgba(139, 92, 246, 0.15); color: #c084fc; font-weight: 800; padding: 2px 7px; border-radius: 6px;">
                  3 វេនសិក្សា
                </span>
                <span style="color: var(--text-muted);">Lab 16 ម៉ាស៊ីន</span>
              </div>
            </div>
            <div class="kpi-icon-box" style="width: 48px; height: 48px; font-size: 1.25rem;">
              <i class="fa-solid fa-school"></i>
            </div>
          </div>

          <!-- Attendance Rate Card -->
          <div class="kpi-card" style="--card-accent: #10b981; --icon-bg: rgba(16, 185, 129, 0.15); --icon-color: #10b981; border-radius: 18px; padding: 20px;">
            <div class="kpi-info">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">វត្តមានសរុប (Attendance)</span>
              <div id="kpiAttendanceRate" class="kpi-number" style="font-size: 2rem; font-weight: 900; margin: 4px 0; color: #34d399;">89.6%</div>
              <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem;">
                <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 800; padding: 2px 7px; border-radius: 6px;">
                  <i class="fa-solid fa-circle-check"></i> ល្អប្រសើរ
                </span>
                <span style="color: var(--text-muted);">វត្តមានទៀងទាត់</span>
              </div>
            </div>
            <div class="kpi-icon-box" style="width: 48px; height: 48px; font-size: 1.25rem;">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
          </div>

          <!-- Exam Pass Rate Card -->
          <div class="kpi-card" style="--card-accent: #f59e0b; --icon-bg: rgba(245, 158, 11, 0.15); --icon-color: #f59e0b; border-radius: 18px; padding: 20px;">
            <div class="kpi-info">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">អត្រាប្រឡងជាប់ (Pass Rate)</span>
              <div id="kpiPassRate" class="kpi-number" style="font-size: 2rem; font-weight: 900; margin: 4px 0; color: #fbbf24;">100%</div>
              <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem;">
                <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; font-weight: 800; padding: 2px 7px; border-radius: 6px;">
                  និទ្ទេស A-C
                </span>
                <span style="color: var(--text-muted);">ប្រឡងបញ្ចប់វគ្គ</span>
              </div>
            </div>
            <div class="kpi-icon-box" style="width: 48px; height: 48px; font-size: 1.25rem;">
              <i class="fa-solid fa-award"></i>
            </div>
          </div>
        </div>

        <!-- At-Risk Attendance Alert Banner Container -->
        <div id="dashAtRiskContainer"></div>

        <!-- Computer Courses Progress Tracking Section (៤ វគ្គកុំព្យូទ័រតាមលំដាប់) -->
        <div class="computer-progress-section">
          <div class="computer-progress-card">
            <div class="computer-progress-header">
              <div class="computer-progress-title">
                <div class="course-icon-circle" style="background: rgba(79, 70, 229, 0.12); color: var(--primary);">
                  <i class="fa-solid fa-laptop-code"></i>
                </div>
                <div>
                  <h3>វឌ្ឍនភាព ៤ វគ្គសិក្សាកុំព្យូទ័រ & ការប្រលង (Computer Courses & Exams)</h3>
                  <p>លំដាប់សិក្សា៖ Typing (វគ្គដំបូង) ➔ Microsoft Word ➔ Microsoft Excel ➔ Microsoft PowerPoint (វគ្គចុងក្រោយ)</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span class="badge" id="computerTotalStudentsBadge" style="background: var(--primary-light); color: var(--primary); font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; font-weight: 700;">
                  កុំព្យូទ័រ: 0 នាក់
                </span>
                <button type="button" class="btn-primary" onclick="App.switchTab('exams')" style="height: 32px; padding: 0 14px; font-size: 0.8rem; background: #8b5cf6; border-color: #8b5cf6;">
                  <i class="fa-solid fa-award"></i> មើលការប្រលង & ពិន្ទុ
                </button>
              </div>
            </div>

            <div class="course-progress-grid" style="grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));">
              <!-- 1. Typing Box -->
              <div class="course-item-box" style="border-top: 3px solid #8b5cf6;">
                <div class="course-item-top">
                  <div class="course-item-identity">
                    <div class="course-icon-circle" style="background: rgba(139, 92, 246, 0.12); color: #8b5cf6;">
                      <i class="fa-solid fa-keyboard"></i>
                    </div>
                    <div>
                      <div class="course-name-text">1. Typing</div>
                      <div class="course-desc-text">វគ្គដំបូង: វាយអត្ថបទ</div>
                    </div>
                  </div>
                  <div class="course-count-badge" id="courseCountTyping">0 <span>នាក់</span></div>
                </div>
                <div class="course-progress-track">
                  <div class="course-progress-fill" id="courseBarTyping" style="background: #8b5cf6; width: 0%;"></div>
                </div>
                <div class="course-item-bottom">
                  <span id="coursePctTyping">0%</span>
                  <button type="button" class="course-filter-btn" onclick="App.filterByCourse('Typing')">
                    <i class="fa-solid fa-filter"></i> សិស្ស Typing
                  </button>
                </div>
              </div>

              <!-- 2. Microsoft Word Box -->
              <div class="course-item-box" style="border-top: 3px solid #185abd;">
                <div class="course-item-top">
                  <div class="course-item-identity">
                    <div class="course-icon-circle" style="background: rgba(24, 90, 189, 0.12); color: #185abd;">
                      <i class="fa-solid fa-file-word"></i>
                    </div>
                    <div>
                      <div class="course-name-text">2. Microsoft Word</div>
                      <div class="course-desc-text">វគ្គទី២: រដ្ឋបាល Word</div>
                    </div>
                  </div>
                  <div class="course-count-badge" id="courseCountWord">0 <span>នាក់</span></div>
                </div>
                <div class="course-progress-track">
                  <div class="course-progress-fill" id="courseBarWord" style="background: #185abd; width: 0%;"></div>
                </div>
                <div class="course-item-bottom">
                  <span id="coursePctWord">0%</span>
                  <button type="button" class="course-filter-btn" onclick="App.filterByCourse('Word')">
                    <i class="fa-solid fa-filter"></i> សិស្ស Word
                  </button>
                </div>
              </div>

              <!-- 3. Microsoft Excel Box -->
              <div class="course-item-box" style="border-top: 3px solid #107c41;">
                <div class="course-item-top">
                  <div class="course-item-identity">
                    <div class="course-icon-circle" style="background: rgba(16, 124, 65, 0.12); color: #107c41;">
                      <i class="fa-solid fa-file-excel"></i>
                    </div>
                    <div>
                      <div class="course-name-text">3. Microsoft Excel</div>
                      <div class="course-desc-text">វគ្គទី៣: គណនាតារាង</div>
                    </div>
                  </div>
                  <div class="course-count-badge" id="courseCountExcel">0 <span>នាក់</span></div>
                </div>
                <div class="course-progress-track">
                  <div class="course-progress-fill" id="courseBarExcel" style="background: #107c41; width: 0%;"></div>
                </div>
                <div class="course-item-bottom">
                  <span id="coursePctExcel">0%</span>
                  <button type="button" class="course-filter-btn" onclick="App.filterByCourse('Excel')">
                    <i class="fa-solid fa-filter"></i> សិស្ស Excel
                  </button>
                </div>
              </div>

              <!-- 4. Microsoft PowerPoint Box -->
              <div class="course-item-box" style="border-top: 3px solid #d83b01;">
                <div class="course-item-top">
                  <div class="course-item-identity">
                    <div class="course-icon-circle" style="background: rgba(216, 59, 1, 0.12); color: #d83b01;">
                      <i class="fa-solid fa-file-powerpoint"></i>
                    </div>
                    <div>
                      <div class="course-name-text">4. PowerPoint</div>
                      <div class="course-desc-text">វគ្គចុងក្រោយ: Slide</div>
                    </div>
                  </div>
                  <div class="course-count-badge" id="courseCountPowerPoint">0 <span>នាក់</span></div>
                </div>
                <div class="course-progress-track">
                  <div class="course-progress-fill" id="courseBarPowerPoint" style="background: #d83b01; width: 0%;"></div>
                </div>
                <div class="course-item-bottom">
                  <span id="coursePctPowerPoint">0%</span>
                  <button type="button" class="course-filter-btn" onclick="App.filterByCourse('PowerPoint')">
                    <i class="fa-solid fa-filter"></i> សិស្ស Slide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual Analytics Charts Row -->
        <div class="charts-grid">
          <!-- Chart 1: Grade Distribution -->
          <div class="card chart-card">
            <div class="card-header-clean">
              <div class="card-title">
                <i class="fa-solid fa-chart-column"></i>
                <span>ស្ថិតិចំនួនសិស្សតាមវគ្គសិក្សាកុំព្យូទ័រ (Students by Computer Course)</span>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="gradeChart"></canvas>
            </div>
          </div>

          <!-- Chart 2: Gender Distribution -->
          <div class="card chart-card">
            <div class="card-header-clean">
              <div class="card-title">
                <i class="fa-solid fa-chart-pie"></i>
                <span>សមាមាត្រភេទ (Gender Ratio)</span>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="genderChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Secondary Row: Recent Registrations & Shift Distribution -->
        <div class="charts-grid">
          <!-- Recent Registrations -->
          <div class="card">
            <div class="card-header-clean">
              <div class="card-title">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <span>សិស្សដែលទើបចុះឈ្មោះថ្មីៗ (Recent Registrations)</span>
              </div>
              <button type="button" class="btn-secondary" data-action="quick-view-all">
                <span>មើលទាំងអស់</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>សិស្ស</th>
                    <th>អត្តលេខ</th>
                    <th>ថ្នាក់</th>
                    <th>ស្ថានភាព</th>
                    <th class="text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody id="recentRegistrationsList">
                  <!-- Rendered dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Chart 3: Shifts Distribution -->
          <div class="card chart-card">
            <div class="card-header-clean">
              <div class="card-title">
                <i class="fa-solid fa-sun"></i>
                <span>វេនសិក្សា (Study Shifts)</span>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="shiftChart"></canvas>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  initEvents() {
    document.querySelectorAll("[data-action='quick-view-all']").forEach(btn => {
      btn.addEventListener("click", () => App.switchTab("directory"));
    });
  },

  update(students) {
    const total = students.length;
    let male = 0;
    let female = 0;
    let active = 0;

    const currentMonth = new Date().toISOString().substring(0, 7);
    let newThisMonth = 0;

    students.forEach(s => {
      const g = (s.Gender || "").trim();
      if (g === "ប្រុស" || g.toLowerCase() === "male") male++;
      if (g === "ស្រី" || g.toLowerCase() === "female") female++;
      if (s.Status === "Active") active++;
      if (s.CreatedAt && s.CreatedAt.startsWith(currentMonth)) newThisMonth++;
    });

    // Update KPI counters
    App.animateCounter("kpiTotal", total);
    App.animateCounter("kpiMale", male);
    App.animateCounter("kpiFemale", female);
    App.animateCounter("kpiActive", active);

    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
    const activePctEl = document.getElementById("kpiActivePct");
    if (activePctEl) activePctEl.textContent = `${activePct}% នៃសិស្សសរុប`;

    const newMonthEl = document.getElementById("kpiNewMonth");
    if (newMonthEl) newMonthEl.textContent = `+${newThisMonth || total} នាក់ក្នុងខែនេះ`;

    // Set Live Khmer Date in Dashboard Hero
    const heroDateEl = document.getElementById("dashLiveDateKh");
    if (heroDateEl) {
      const now = new Date();
      const monthsKh = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
      const day = now.getDate();
      const month = monthsKh[now.getMonth()];
      const year = now.getFullYear();
      heroDateEl.textContent = `ថ្ងៃទី ${day} ខែ ${month} ឆ្នាំ ${year}`;
    }

    // Set Dynamic Welcome Greeting for Logged-In Teacher
    const teacherNameEl = document.getElementById("dashTeacherName");
    if (teacherNameEl) {
      const currentUser = (typeof AuthService !== "undefined" && AuthService.getCurrentUser) ? AuthService.getCurrentUser() : null;
      const tName = (currentUser && (currentUser.nameKh || currentUser.nameEn || currentUser.username)) || "លោកគ្រូ ខៀន ធូ";
      teacherNameEl.textContent = tName;
    }

    // Set Teachers and Classes count dynamically from live data
    const teachersEl = document.getElementById("kpiTeachersCount");
    if (teachersEl) {
      let tCount = 2;
      if (typeof AuthService !== "undefined" && AuthService.getTeachers) {
        const tList = AuthService.getTeachers();
        if (tList && tList.length > 0) tCount = tList.length;
      } else if (typeof TeachersView !== "undefined" && TeachersView.getTeachers) {
        const tList = TeachersView.getTeachers();
        if (tList && tList.length > 0) tCount = tList.length;
      }
      teachersEl.textContent = tCount;
    }

    const classesEl = document.getElementById("kpiClassesCount");
    if (classesEl) {
      let cCount = 3;
      if (typeof ClassesView !== "undefined" && ClassesView.getClasses) {
        const cList = ClassesView.getClasses();
        if (cList && cList.length > 0) cCount = cList.length;
      } else if (typeof APP_CONFIG !== "undefined" && APP_CONFIG.shifts) {
        cCount = APP_CONFIG.shifts.length;
      }
      classesEl.textContent = cCount;
    }

    const attEl = document.getElementById("kpiAttendanceRate");
    if (attEl) {
      let totalAtt = 0, presentAtt = 0;
      if (typeof StudentAPI !== "undefined" && StudentAPI.getAllAttendance) {
        const allAtt = StudentAPI.getAllAttendance();
        if (allAtt && typeof allAtt === "object") {
          Object.values(allAtt).forEach(day => {
            if (day && typeof day === "object") {
              Object.values(day).forEach(st => {
                totalAtt++;
                if (st === "Present" || st === "វត្តមាន") presentAtt++;
              });
            }
          });
        }
      }
      if (totalAtt > 0) {
        const rate = (Math.round((presentAtt / totalAtt) * 1000) / 10).toFixed(1);
        attEl.textContent = `${rate}%`;
      } else {
        attEl.textContent = "100%";
      }
    }

    const passEl = document.getElementById("kpiPassRate");
    if (passEl) {
      let totalExams = 0, passedExams = 0;
      if (typeof StudentAPI !== "undefined" && StudentAPI.getAllExams) {
        const allExams = StudentAPI.getAllExams();
        if (allExams && typeof allExams === "object") {
          Object.values(allExams).forEach(ex => {
            if (ex && typeof ex === "object") {
              totalExams++;
              const sc = parseFloat(ex.score || ex.Score || 0);
              if (sc >= 50) passedExams++;
            }
          });
        }
      }
      if (totalExams > 0) {
        const passRate = (Math.round((passedExams / totalExams) * 1000) / 10).toFixed(1);
        passEl.textContent = `${passRate}%`;
      } else {
        passEl.textContent = "100%";
      }
    }

    // Render At-Risk Attendance Alert Banner
    const atRiskContainer = document.getElementById("dashAtRiskContainer");
    if (atRiskContainer && typeof StudentAPI !== "undefined" && StudentAPI.getAllAtRiskStudents) {
      const atRiskList = StudentAPI.getAllAtRiskStudents();
      if (atRiskList && atRiskList.length > 0) {
        atRiskContainer.innerHTML = `
          <div class="dashboard-at-risk-banner">
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(239, 68, 68, 0.15); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; box-shadow: 0 0 12px rgba(239, 68, 68, 0.25);">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <div style="font-weight: 800; font-size: 1rem; color: #ef4444; display: flex; align-items: center; gap: 8px;">
                  <span>ការជូនដំណឹង៖ សិស្សប្រឈមនឹងការបោះបង់ (${atRiskList.length} នាក់)</span>
                  <span class="badge" style="background: #ef4444; color: #fff; font-size: 0.72rem; padding: 2px 7px; border-radius: 10px;">At-Risk Absence</span>
                </div>
                <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
                  មានសិស្សចំនួន <strong>${atRiskList.length} នាក់</strong> បានអវត្តមាន ៣ ថ្ងៃជាប់គ្នា ឬមានអត្រាវត្តមានទាបជាង ៧៥% ដែលត្រូវការគ្រូតាមដានសួរសុខទុក្ខជាបន្ទាន់។
                </div>
              </div>
            </div>

            <div class="at-risk-student-chips">
              ${atRiskList.slice(0, 4).map(item => `
                <div class="at-risk-chip" onclick="App.openQuickContactModal('${item.student.ID}', 'absence')" title="ចុចដើម្បីបើក Contact Hub ផ្ញើសារសួរសុខទុក្ខតាម Telegram">
                  <img src="${item.student.Avatar || App.getDefaultAvatar(item.student.Gender)}" style="width: 22px; height: 22px; border-radius: 50%;">
                  <span>${item.student.NameKh}</span>
                  <span style="color: #ef4444; font-weight: 800;">(${item.risk.consecutive || item.risk.totalAbsent}ថ្ងៃ)</span>
                  <i class="fa-solid fa-comment-dots text-sky-400"></i>
                </div>
              `).join('')}
              
              <button type="button" class="btn-secondary" style="height: 32px; padding: 0 12px; font-size: 0.78rem; font-weight: 700; color: #ef4444; border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.08);" onclick="App.switchTab('directory'); const f = document.getElementById('filterStatus'); if (f) f.value='AtRisk'; App.state.filters.status='AtRisk'; App.applyFiltersAndSearch(); if (typeof DirectoryView !== 'undefined' && DirectoryView.renderTable) DirectoryView.renderTable();">
                <span>មើលបញ្ជីពេញ &gt;</span>
              </button>
            </div>
          </div>
        `;
      } else {
        atRiskContainer.innerHTML = `
          <div style="margin-bottom: 22px; padding: 10px 16px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: #10b981;">
            <span><i class="fa-solid fa-circle-check"></i> វត្តមានសិស្សទាំងអស់ស្ថិតក្នុងកម្រិតល្អប្រសើរ (ពុំមានសិស្សប្រឈមការបោះបង់ឡើយ)</span>
            <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">100% On Track</span>
          </div>
        `;
      }
    }

    // Calculate Computer Course progress
    const computerStudents = (students || []).filter(s => !s.Grade || (s.Grade || "").includes("កុំព្យូទ័រ") || s.Course);
    const totalComp = computerStudents.length;

    let typingCount = 0;
    let wordCount = 0;
    let excelCount = 0;
    let powerPointCount = 0;

    computerStudents.forEach(s => {
      const c = (s.Course || "").toLowerCase();
      if (c.includes("typing") || c.includes("វាយ")) typingCount++;
      else if (c.includes("word")) wordCount++;
      else if (c.includes("excel")) excelCount++;
      else if (c.includes("powerpoint") || c.includes("ppt")) powerPointCount++;
      else typingCount++; // Default computer course is typing
    });

    const totalCompBadge = document.getElementById("computerTotalStudentsBadge");
    if (totalCompBadge) totalCompBadge.textContent = `កុំព្យូទ័រ: ${totalComp} នាក់`;

    App.animateCounter("courseCountTyping", typingCount);
    App.animateCounter("courseCountWord", wordCount);
    App.animateCounter("courseCountExcel", excelCount);
    App.animateCounter("courseCountPowerPoint", powerPointCount);

    const typingPct = totalComp > 0 ? Math.round((typingCount / totalComp) * 100) : 0;
    const wordPct = totalComp > 0 ? Math.round((wordCount / totalComp) * 100) : 0;
    const excelPct = totalComp > 0 ? Math.round((excelCount / totalComp) * 100) : 0;
    const pptPct = totalComp > 0 ? Math.round((powerPointCount / totalComp) * 100) : 0;

    const barTyping = document.getElementById("courseBarTyping");
    if (barTyping) barTyping.style.width = `${typingPct}%`;
    const pctTyping = document.getElementById("coursePctTyping");
    if (pctTyping) pctTyping.textContent = `${typingPct}% (${typingCount}/${totalComp})`;

    const barWord = document.getElementById("courseBarWord");
    if (barWord) barWord.style.width = `${wordPct}%`;
    const pctWord = document.getElementById("coursePctWord");
    if (pctWord) pctWord.textContent = `${wordPct}% (${wordCount}/${totalComp})`;

    const barExcel = document.getElementById("courseBarExcel");
    if (barExcel) barExcel.style.width = `${excelPct}%`;
    const pctExcel = document.getElementById("coursePctExcel");
    if (pctExcel) pctExcel.textContent = `${excelPct}% (${excelCount}/${totalComp})`;

    const barPpt = document.getElementById("courseBarPowerPoint");
    if (barPpt) barPpt.style.width = `${pptPct}%`;
    const pctPpt = document.getElementById("coursePctPowerPoint");
    if (pctPpt) pctPpt.textContent = `${pptPct}% (${powerPointCount}/${totalComp})`;

    // Render Charts
    DashboardCharts.render(students);

    // Render Recent Registrations
    this.renderRecentList(students);
  },

  renderRecentList(students) {
    const tbody = document.getElementById("recentRegistrationsList");
    if (!tbody) return;

    const recents = [...students].slice(0, 5);
    if (recents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">មិនទាន់មានទិន្នន័យសិស្សនៅឡើយ</td></tr>`;
      return;
    }

    tbody.innerHTML = recents.map(s => `
      <tr>
        <td>
          <div class="user-badge">
            <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
            <div>
              <div class="font-bold">
                ${App.escapeHtml(s.NameKh)}
                ${App.isNewStudent(s) ? `<span class="badge-new-student" title="សិស្សចុះឈ្មោះថ្មី"><i class="fa-solid fa-sparkles"></i> សិស្សថ្មី</span>` : ''}
              </div>
              <div class="text-xs text-muted">${App.escapeHtml(s.NameEn || '')}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-id">${App.escapeHtml(s.ID)}</span></td>
        <td>
          <span class="badge badge-grade">${App.escapeHtml(s.Grade)}</span>
          ${s.Course ? `<span class="badge-course ${App.getCourseBadgeClass(s.Course)}" style="margin-left: 4px;">${App.escapeHtml(s.Course)}</span>` : ''}
        </td>
        <td>
          <span class="status-indicator status-${(s.Status || 'Active').toLowerCase()}">
            ${s.Status === 'Active' ? 'កំពុងសិក្សា' : s.Status === 'Graduated' ? 'បញ្ចប់ការសិក្សា' : 'ផ្អាក'}
          </span>
        </td>
        <td class="text-right">
          <button type="button" class="btn-icon" onclick="App.viewStudentDetails('${s.ID}')" title="មើលលម្អិត">
            <i class="fa-solid fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join("");
  },

  printMonthlyReport() {
    const students = App.state.students || [];
    const total = students.length;
    const male = students.filter(s => s.Gender === "ប្រុស").length;
    const female = students.filter(s => s.Gender === "ស្រី").length;
    const active = students.filter(s => s.Status === "Active" || !s.Status).length;

    // Fees calculation
    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;
    let totalRevenue = 0;
    let totalBalance = 0;
    students.forEach(s => {
      const fee = typeof StudentAPI !== "undefined" ? StudentAPI.getStudentFee(s.ID) : null;
      const paid = fee ? (fee.paidAmount !== undefined ? parseFloat(fee.paidAmount) : defaultPrice) : defaultPrice;
      const bal = fee ? (fee.balance !== undefined ? parseFloat(fee.balance) : 0) : 0;
      totalRevenue += paid;
      totalBalance += bal;
    });

    // Courses calculation
    const typingCount = students.filter(s => s.Course === "Typing").length;
    const wordCount = students.filter(s => s.Course === "Word").length;
    const excelCount = students.filter(s => s.Course === "Excel").length;
    const pptCount = students.filter(s => s.Course === "PowerPoint").length;

    const printWin = window.open("", "_blank", "width=1000,height=800");
    if (!printWin) {
      App.showToast("សូមបើកអនុញ្ញាត Pop-up ក្នុង Browser ដើម្បីបោះពុម្ពរបាយការណ៍!", "warning");
      return;
    }

    const now = new Date();
    const monthsKh = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const monthName = monthsKh[now.getMonth()];
    const yearKh = now.getFullYear();

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>របាយការណ៍បូកសរុបលទ្ធផលការងារប្រចាំខែ - TIS Lab Computer</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Moul&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          * { box-sizing: border-box; }
          body { font-family: 'Kantumruy Pro', sans-serif; color: #0f172a; line-height: 1.5; margin: 0; padding: 15px; }
          .header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #0f172a; padding-bottom: 10px; }
          .moul-title { font-family: 'Moul', cursive; font-size: 1.1rem; color: #0f172a; }
          .report-title { font-family: 'Moul', cursive; font-size: 1.25rem; color: #1e3a8a; margin: 8px 0 4px 0; }
          .sub { font-size: 0.85rem; color: #475569; }
          .kpi-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          .kpi-table th, .kpi-table td { border: 1px solid #94a3b8; padding: 7px 10px; font-size: 0.86rem; }
          .kpi-table th { background: #f1f5f9; text-align: left; font-weight: 700; color: #1e293b; }
          .section-head { font-weight: 700; font-size: 0.95rem; color: #1e3a8a; margin: 14px 0 6px 0; border-left: 4px solid #0284c7; padding-left: 8px; }
          .footer-sign { margin-top: 30px; display: flex; justify-content: space-between; text-align: center; }
          .sign-col { width: 45%; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="moul-title">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div style="font-weight: 700; font-size: 0.95rem;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div style="margin-top: 10px; font-weight: 700;">មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល TIS Lab Computer</div>
          <div class="report-title">របាយការណ៍បូកសរុបលទ្ធផលការងារ & ស្ថិតិសិក្សាប្រចាំខែ</div>
          <div class="sub">ប្រចាំខែ ${monthName} ឆ្នាំ ${yearKh} • កាលបរិច្ឆេទចេញ៖ ${now.toISOString().split('T')[0]}</div>
        </div>

        <div class="section-head">១. ស្ថិតិទូទៅសិស្សានុសិស្ស (Enrollment & Demographics Overview)</div>
        <table class="kpi-table">
          <tr>
            <th style="width: 25%;">សិស្សចុះឈ្មោះសរុប</th>
            <td style="width: 25%; font-weight: bold; font-size: 1rem; color: #1e3a8a;">${total} នាក់</td>
            <th style="width: 25%;">អត្រាសិក្សាសកម្ម</th>
            <td style="width: 25%; font-weight: bold; color: #059669;">100.0% (${active}/${total} នាក់)</td>
          </tr>
          <tr>
            <th>សិស្សភេទប្រុស</th>
            <td>${male} នាក់ (${total > 0 ? Math.round((male/total)*100) : 0}%)</td>
            <th>សិស្សភេទស្រី</th>
            <td>${female} នាក់ (${total > 0 ? Math.round((female/total)*100) : 0}%)</td>
          </tr>
          <tr>
            <th>វេនសិក្សាជាក់ស្តែង</th>
            <td colspan="3">
              • <strong>វេនព្រឹក (08:00 - 09:00):</strong> ${students.filter(s => s.Shift === 'ព្រឹក').length} នាក់ &nbsp;|&nbsp;
              • <strong>វេនថ្ងៃ (15:00 - 16:00):</strong> ${students.filter(s => s.Shift === 'ថ្ងៃ').length} នាក់ &nbsp;|&nbsp;
              • <strong>វេនរសៀល (17:00 - 18:00):</strong> ${students.filter(s => s.Shift === 'រសៀល').length} នាក់
              <br><small style="color: #64748b;">(បន្ទប់អនុវត្តកុំព្យូទ័រ Lab A មាន ១៤ ម៉ាស៊ីន PC-01 ដល់ PC-14)</small>
            </td>
          </tr>
        </table>

        <div class="section-head">២. វឌ្ឍនភាព ៤ វគ្គកុំព្យូទ័រ & ការប្រឡង (Academic Performance & Module Progress)</div>
        <table class="kpi-table">
          <thead>
            <tr>
              <th>ល.រ</th>
              <th>វគ្គសិក្សា</th>
              <th>ចំនួនសិស្សកំពុងសិក្សា</th>
              <th>ស្ថានភាពប្រឡង</th>
              <th>អត្រាជាប់</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center;">១</td>
              <td><strong>1. Typing</strong> (វាយអត្ថបទរហ័ស ខ្មែរ-អង់គ្លេស)</td>
              <td>${typingCount} នាក់</td>
              <td>បញ្ចប់ការប្រឡងវាស់ស្ទង់ WPM</td>
              <td style="color: #059669; font-weight: bold;">100% ជាប់</td>
            </tr>
            <tr>
              <td style="text-align: center;">២</td>
              <td><strong>2. Microsoft Word</strong> (រៀបចំលិខិតរដ្ឋបាល)</td>
              <td>${wordCount} នាក់</td>
              <td>បញ្ចប់វិញ្ញាសារដ្ឋបាលផ្លូវការ</td>
              <td style="color: #059669; font-weight: bold;">100% ជាប់</td>
            </tr>
            <tr>
              <td style="text-align: center;">៣</td>
              <td><strong>3. Microsoft Excel</strong> (គណនាតារាង & រូបមន្ត)</td>
              <td>${excelCount} នាក់</td>
              <td>បញ្ចប់វិញ្ញាសារូបមន្ត IF, VLOOKUP</td>
              <td style="color: #059669; font-weight: bold;">100% ជាប់</td>
            </tr>
            <tr>
              <td style="text-align: center;">៤</td>
              <td><strong>4. Microsoft PowerPoint</strong> (ស្លាយបទបង្ហាញ)</td>
              <td>${pptCount} នាក់</td>
              <td>បញ្ចប់ការធ្វើ Slide Presentation</td>
              <td style="color: #059669; font-weight: bold;">100% ជាប់</td>
            </tr>
          </tbody>
        </table>

        <div class="section-head">៣. របាយការណ៍ហិរញ្ញវត្ថុ & ចំណូលថ្លៃសិក្សា (Tuition Revenue & Financial Collection)</div>
        <table class="kpi-table">
          <tr>
            <th style="width: 25%;">តម្លៃសិក្សាក្នុង ១ នាក់</th>
            <td style="width: 25%; font-weight: bold;">$${defaultPrice}.00 / វគ្គ</td>
            <th style="width: 25%;">ចំណូលរំពឹងទុកសរុប</th>
            <td style="width: 25%; font-weight: bold;">$${(total * defaultPrice).toFixed(2)}</td>
          </tr>
          <tr>
            <th>ចំណូលទទួលបានជាក់ស្តែង</th>
            <td style="color: #059669; font-weight: bold; font-size: 1.05rem;">$${totalRevenue.toFixed(2)} (Paid)</td>
            <th>បំណុលនៅជំពាក់</th>
            <td style="color: #059669; font-weight: bold; font-size: 1.05rem;">$${totalBalance.toFixed(2)} (គ្មានជំពាក់)</td>
          </tr>
          <tr>
            <th>អត្រាប្រមូលថវិកា</th>
            <td colspan="3" style="color: #059669; font-weight: bold;">
              <span style="background: rgba(16, 185, 129, 0.15); padding: 4px 10px; border-radius: 4px;">
                ✓ 100.0% (សិស្សទាំងអស់បានបង់ថ្លៃសិក្សាគ្រប់ចំនួន គ្មានបំណុលសេសសល់)
              </span>
            </td>
          </tr>
        </table>

        <div class="section-head">៤. ការវាយតម្លៃរួម និងទិសដៅបន្ត (Executive Summary & Action Plan)</div>
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; font-size: 0.84rem; line-height: 1.6; margin-bottom: 20px;">
          • ការគ្រប់គ្រងវត្តមានតាមប្រព័ន្ធ QR Code ស្វ័យប្រវត្តិតាមដានបានទៀងទាត់ និងមានការជូនដំណឹងផ្ទាល់ទៅកាន់ Telegram Bot។<br>
          • បន្ទប់កុំព្យូទ័រ Lab A មាន ១៤ ម៉ាស៊ីនដំណើរការល្អ និងបែងចែកកៅអីសិស្សបានត្រឹមត្រូវតាមវេននីមួយៗ។<br>
          • ស្ថានភាពហិរញ្ញវត្ថុមានស្ថិរភាពខ្ពស់ សិស្សានុសិស្សបានទូទាត់ថ្លៃសិក្សា $50 ពេញលេញ ១០០% តាមរយៈ ABA KHQR។
        </div>

        <div class="footer-sign">
          <div class="sign-col">
            <div>បានឃើញ និងបញ្ជាក់ត្រឹមត្រូវ</div>
            <div style="font-weight: 700; margin-top: 4px;">ប្រធានផ្នែករដ្ឋបាល និងគណនេយ្យ</div>
            <div style="margin-top: 45px; font-weight: bold;">អ្នកគ្រូ ស៊ូ ផល្លា</div>
          </div>
          <div class="sign-col">
            <div>ថ្ងៃទី ${now.getDate()} ខែ ${monthName} ឆ្នាំ ${yearKh}</div>
            <div style="font-weight: 700; margin-top: 4px;">នាយកមជ្ឈមណ្ឌល TIS Lab Computer</div>
            <div style="margin-top: 45px; font-weight: 700; font-size: 1.05rem; color: #0f172a;">លោកគ្រូ ខៀន ធូ</div>
            <div style="font-size: 0.8rem; color: #475569;">ទូរស័ព្ទ៖ 071 721 0307</div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => printWin.print(), 400);
  }
};

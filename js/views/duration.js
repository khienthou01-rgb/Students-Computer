/**
 * ==========================================================================
 * View: រយៈពេលវគ្គសិក្សា (Course Duration Countdown)
 * Shows a visual countdown timer for each student's 4-month course
 * ==========================================================================
 */
const DurationView = {
  filters: {
    course: "",
    shift: "",
    search: "",
    status: "all" // all, active, expiring, expired
  },

  render() {
    return `
      <section id="view-duration" class="page-view">
        <div class="view-header" style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <h2 style="margin: 0; font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">
              <i class="fa-solid fa-hourglass-half" style="color: #f59e0b;"></i> រយៈពេលវគ្គសិក្សា
            </h2>
            <span id="durationTotalBadge" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 4px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 700;">0 សិស្ស</span>
          </div>
          <p style="margin: 6px 0 0; font-size: 0.82rem; color: var(--text-secondary);">តាមដានរយៈពេល ៤ខែ នៃវគ្គសិក្សារបស់សិស្សនីមួយៗ</p>
        </div>

        <!-- Filter Bar -->
        <div class="duration-filter-bar" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; align-items: center;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.85rem;"></i>
            <input type="text" id="durationSearchInput" placeholder="ស្វែងរកសិស្ស..." style="width: 100%; padding: 9px 12px 9px 36px; border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.85rem; font-family: inherit; background: var(--bg-card); color: var(--text-primary); outline: none; transition: border 0.2s;">
          </div>
          <select id="durationFilterStatus" style="padding: 9px 14px; border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.82rem; font-family: inherit; background: var(--bg-card); color: var(--text-primary); cursor: pointer;">
            <option value="all">📊 ទាំងអស់</option>
            <option value="active">🟢 កំពុងរៀន</option>
            <option value="expiring">🟡 ជិតផុតកំណត់ (≤30ថ្ងៃ)</option>
            <option value="expired">🔴 ផុតកំណត់</option>
          </select>
          <select id="durationFilterCourse" style="padding: 9px 14px; border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.82rem; font-family: inherit; background: var(--bg-card); color: var(--text-primary); cursor: pointer;">
            <option value="">វគ្គទាំងអស់</option>
          </select>
          <select id="durationFilterShift" style="padding: 9px 14px; border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.82rem; font-family: inherit; background: var(--bg-card); color: var(--text-primary); cursor: pointer;">
            <option value="">វេនទាំងអស់</option>
            <option value="ព្រឹក">🌅 ព្រឹក</option>
            <option value="រសៀល">🌇 រសៀល</option>
            <option value="ថ្ងៃ">☀️ ថ្ងៃ</option>
          </select>
        </div>

        <!-- Summary Stats Cards -->
        <div id="durationSummaryCards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 24px;"></div>

        <!-- Student Duration Cards Grid -->
        <div id="durationCardsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px;"></div>
      </section>
    `;
  },

  initEvents() {
    const searchInput = document.getElementById("durationSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.renderCards();
      });
    }
    const statusFilter = document.getElementById("durationFilterStatus");
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        this.filters.status = e.target.value;
        this.renderCards();
      });
    }
    const courseFilter = document.getElementById("durationFilterCourse");
    if (courseFilter) {
      courseFilter.addEventListener("change", (e) => {
        this.filters.course = e.target.value;
        this.renderCards();
      });
    }
    const shiftFilter = document.getElementById("durationFilterShift");
    if (shiftFilter) {
      shiftFilter.addEventListener("change", (e) => {
        this.filters.shift = e.target.value;
        this.renderCards();
      });
    }
  },

  // Populate course dropdown from student data
  populateCourseFilter() {
    const select = document.getElementById("durationFilterCourse");
    if (!select) return;
    const students = App.state.students || [];
    const courses = [...new Set(students.map(s => s.Course).filter(Boolean))].sort();
    const currentVal = select.value;
    select.innerHTML = `<option value="">វគ្គទាំងអស់</option>` + courses.map(c => `<option value="${c}">${c}</option>`).join("");
    select.value = currentVal;
  },

  // Get filtered students
  getFilteredStudents() {
    const students = (App.state.students || []).filter(s => s.Status === "Active" || s.Status === "active");
    return students.filter(s => {
      // Search filter
      if (this.filters.search) {
        const q = this.filters.search;
        const match = (s.NameKh && s.NameKh.toLowerCase().includes(q)) ||
          (s.NameEn && s.NameEn.toLowerCase().includes(q)) ||
          (s.ID && s.ID.toLowerCase().includes(q));
        if (!match) return false;
      }
      // Course filter
      if (this.filters.course && s.Course !== this.filters.course) return false;
      // Shift filter
      if (this.filters.shift && (!s.Shift || !s.Shift.includes(this.filters.shift))) return false;
      // Status filter (duration-based)
      if (this.filters.status !== "all") {
        const info = App.getStudentDaysInfo(s);
        if (this.filters.status === "expired" && info.daysRemaining > 0) return false;
        if (this.filters.status === "expiring" && (info.daysRemaining > 30 || info.daysRemaining <= 0)) return false;
        if (this.filters.status === "active" && info.daysRemaining <= 0) return false;
      }
      return true;
    });
  },

  // Render summary stat cards
  renderSummaryCards(students) {
    const container = document.getElementById("durationSummaryCards");
    if (!container) return;

    let totalActive = 0, totalExpiring = 0, totalExpired = 0, totalStudying = 0;
    students.forEach(s => {
      const info = App.getStudentDaysInfo(s);
      totalStudying++;
      if (info.daysRemaining <= 0) totalExpired++;
      else if (info.daysRemaining <= 30) totalExpiring++;
      else totalActive++;
    });

    container.innerHTML = `
      <div class="duration-stat-card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08)); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 14px; padding: 16px 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
            <i class="fa-solid fa-users"></i>
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">${totalStudying}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); font-weight: 600;">សិស្សកំពុងរៀន</div>
          </div>
        </div>
      </div>
      <div class="duration-stat-card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08)); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 14px; padding: 16px 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #10b981;">${totalActive}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); font-weight: 600;">នៅមានពេល (>30ថ្ងៃ)</div>
          </div>
        </div>
      </div>
      <div class="duration-stat-card" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.08)); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 14px; padding: 16px 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #f59e0b;">${totalExpiring}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); font-weight: 600;">ជិតផុតកំណត់ (≤30ថ្ងៃ)</div>
          </div>
        </div>
      </div>
      <div class="duration-stat-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.08)); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 14px; padding: 16px 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem;">
            <i class="fa-solid fa-hourglass-end"></i>
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #ef4444;">${totalExpired}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); font-weight: 600;">ផុតកំណត់ហើយ</div>
          </div>
        </div>
      </div>
    `;
  },

  // Get progress bar color based on percentage
  getProgressColor(percent, daysRemaining) {
    if (daysRemaining <= 0) return { gradient: "linear-gradient(90deg, #ef4444, #dc2626)", glow: "rgba(239, 68, 68, 0.4)" };
    if (daysRemaining <= 30) return { gradient: "linear-gradient(90deg, #f59e0b, #d97706)", glow: "rgba(245, 158, 11, 0.4)" };
    if (percent >= 75) return { gradient: "linear-gradient(90deg, #06b6d4, #0891b2)", glow: "rgba(6, 182, 212, 0.4)" };
    return { gradient: "linear-gradient(90deg, #10b981, #059669)", glow: "rgba(16, 185, 129, 0.4)" };
  },

  // Get status badge HTML
  getStatusBadge(daysRemaining, percent) {
    if (daysRemaining <= 0) {
      return `<span style="background: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fa-solid fa-circle-xmark"></i> ផុតកំណត់
      </span>`;
    }
    if (daysRemaining <= 30) {
      return `<span style="background: rgba(245, 158, 11, 0.15); color: #d97706; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; animation: durationPulse 1.5s infinite;">
        <i class="fa-solid fa-clock"></i> ជិតផុតកំណត់
      </span>`;
    }
    return `<span style="background: rgba(16, 185, 129, 0.15); color: #059669; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
      <i class="fa-solid fa-circle-check"></i> កំពុងរៀន
    </span>`;
  },

  // Render the student duration cards
  renderCards() {
    this.populateCourseFilter();
    const students = this.getFilteredStudents();

    // Update badge count
    const badge = document.getElementById("durationTotalBadge");
    if (badge) badge.textContent = `${students.length} សិស្ស`;

    this.renderSummaryCards(students);

    const grid = document.getElementById("durationCardsGrid");
    if (!grid) return;

    if (students.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-inbox" style="font-size: 3rem; margin-bottom: 12px; opacity: 0.3;"></i>
          <p style="font-size: 0.95rem; font-weight: 600;">មិនមានសិស្សទេ</p>
          <p style="font-size: 0.82rem;">សូមផ្លាស់ប្តូរ filter ឬបន្ថែមសិស្សថ្មី</p>
        </div>
      `;
      return;
    }

    // Sort: expired first, then expiring, then active (by daysRemaining ASC)
    const sorted = students.map(s => ({ student: s, info: App.getStudentDaysInfo(s) }))
      .sort((a, b) => a.info.daysRemaining - b.info.daysRemaining);

    grid.innerHTML = sorted.map(({ student: s, info }) => {
      const progressColor = this.getProgressColor(info.percent, info.daysRemaining);
      const statusBadge = this.getStatusBadge(info.daysRemaining, info.percent);
      const photoSrc = s.Photo || s.photo || "assets/images/default-" + (s.Gender === "ស្រី" ? "female" : "male") + ".svg";

      // Calculate circular progress
      const radius = 36;
      const circumference = 2 * Math.PI * radius;
      const strokeOffset = circumference - (info.percent / 100) * circumference;

      return `
        <div class="duration-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; transition: all 0.3s ease; position: relative; overflow: hidden; cursor: pointer;" onclick="App.viewStudentDetails('${s.ID}')">
          <!-- Glow effect for expiring -->
          ${info.daysRemaining <= 30 && info.daysRemaining > 0 ? `<div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: radial-gradient(circle, rgba(245, 158, 11, 0.15), transparent); border-radius: 50%;"></div>` : ""}
          ${info.daysRemaining <= 0 ? `<div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: radial-gradient(circle, rgba(239, 68, 68, 0.12), transparent); border-radius: 50%;"></div>` : ""}

          <!-- Top Row: Photo + Info + Circular Progress -->
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
            <!-- Student Photo -->
            <div style="width: 48px; height: 48px; border-radius: 14px; overflow: hidden; flex-shrink: 0; border: 2px solid var(--border-color);">
              <img src="${photoSrc}" alt="${App.escapeHtml(s.NameKh)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/default-male.svg'">
            </div>

            <!-- Student Info -->
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${App.escapeHtml(s.NameKh || "—")}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 2px;">
                <span style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #6366f1;">${App.escapeHtml(s.ID)}</span>
                <span>•</span>
                <span>${App.escapeHtml(s.Course || "—")}</span>
                <span>•</span>
                <span>${App.escapeHtml(s.Shift || "—")}</span>
              </div>
            </div>

            <!-- Circular Progress Ring -->
            <div style="position: relative; width: 80px; height: 80px; flex-shrink: 0;">
              <svg viewBox="0 0 80 80" style="transform: rotate(-90deg); width: 80px; height: 80px;">
                <circle cx="40" cy="40" r="${radius}" fill="none" stroke="var(--border-color)" stroke-width="5" opacity="0.3"></circle>
                <circle cx="40" cy="40" r="${radius}" fill="none" stroke="${info.daysRemaining <= 0 ? '#ef4444' : info.daysRemaining <= 30 ? '#f59e0b' : '#10b981'}" stroke-width="5" stroke-linecap="round"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${strokeOffset}"
                  style="transition: stroke-dashoffset 0.8s ease;"></circle>
              </svg>
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                <div style="font-size: 1.1rem; font-weight: 800; color: ${info.daysRemaining <= 0 ? '#ef4444' : info.daysRemaining <= 30 ? '#f59e0b' : '#10b981'};">
                  ${info.percent}%
                </div>
              </div>
            </div>
          </div>

          <!-- Duration Details -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px;">
            <div style="background: var(--bg-body); border-radius: 10px; padding: 10px 12px;">
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 2px;">បានរៀន</div>
              <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">${info.durationLabel}</div>
              <div style="font-size: 0.72rem; color: var(--text-secondary);">${info.daysElapsed}/${info.totalCourseDays} ថ្ងៃ</div>
            </div>
            <div style="background: var(--bg-body); border-radius: 10px; padding: 10px 12px;">
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 2px;">នៅសល់</div>
              <div style="font-size: 0.88rem; font-weight: 700; color: ${info.daysRemaining <= 0 ? '#ef4444' : info.daysRemaining <= 30 ? '#d97706' : 'var(--text-primary)'};">
                ${info.daysRemaining <= 0 ? 'ផុតកំណត់!' : info.remainingLabel}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-secondary);">${info.daysRemaining} ថ្ងៃ</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div style="margin-bottom: 10px;">
            <div style="height: 8px; background: var(--bg-body); border-radius: 10px; overflow: hidden; position: relative;">
              <div style="height: 100%; width: ${info.percent}%; background: ${progressColor.gradient}; border-radius: 10px; transition: width 0.8s ease; box-shadow: 0 0 8px ${progressColor.glow};"></div>
            </div>
          </div>

          <!-- Bottom Row: Dates + Status Badge -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.74rem; color: var(--text-muted);">
              <i class="fa-regular fa-calendar"></i> ${info.startDate} → ${info.endDate}
            </div>
            ${statusBadge}
          </div>
        </div>
      `;
    }).join("");
  }
};

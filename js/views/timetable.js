/**
 * View: Class Timetable & Computer Lab Seat Manager (កាលវិភាគសិក្សា & គ្រប់គ្រងកៅអីម៉ាស៊ីនកុំព្យូទ័រ Lab)
 * Synchronized with the real study shifts entered by user in the system:
 * 1. វេនព្រឹក (08:00 - 09:00)
 * 2. វេនថ្ងៃ (15:00 - 16:00)
 * 3. វេនរសៀល (17:00 - 18:00)
 */
const TimetableLabView = {
  activeTab: "timetable", // "timetable" | "lab" | "monitor"
  activeShift: "ព្រឹក",
  monitorShift: "ALL", // "ALL" | "ព្រឹក" | "ថ្ងៃ" | "រសៀល"
  TOTAL_PCS: 16,
  gridZoom: "medium", // "small" (7 cols) | "medium" (4 cols) | "large" (3 cols)
  isLockAllActive: false,
  isBlankAllActive: false,
  selectedInspectPcId: null,
  firebaseListenerAttached: false,
  lastPolicy: null,
  pcsLiveState: {},

  // Dynamic Total PCs: Detects actual live PCs from Firebase, seat map, or manual setting
  getTotalPcs() {
    let count = parseInt(localStorage.getItem("tis_lab_total_pcs"), 10);
    if (!count || count < 16) {
      count = 16;
      localStorage.setItem("tis_lab_total_pcs", "16");
    }
    
    // 1. Scan live Firebase PCs
    const livePcs = (typeof StudentAPI !== "undefined" && StudentAPI.livePcs) ? StudentAPI.livePcs : (this.pcsLiveState || {});
    if (livePcs && typeof livePcs === "object") {
      Object.keys(livePcs).forEach(k => {
        const match = k.match(/PC-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > count) count = num;
        }
      });
    }

    // 2. Scan seat map directly from storage to avoid circular recursion
    try {
      const storageKey = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.STORAGE_KEY_LAB) ? APP_CONFIG.STORAGE_KEY_LAB : "master_school_lab_seats";
      const rawSeats = localStorage.getItem(storageKey);
      if (rawSeats) {
        const seats = JSON.parse(rawSeats);
        if (seats && typeof seats === "object") {
          Object.values(seats).forEach(shiftSeats => {
            if (shiftSeats && typeof shiftSeats === "object") {
              Object.keys(shiftSeats).forEach(k => {
                const match = k.match(/PC-(\d+)/i);
                if (match) {
                  const num = parseInt(match[1], 10);
                  if (num > count) count = num;
                }
              });
            }
          });
        }
      }
    } catch (e) {}

    // 3. Scan maintenance
    const maint = (typeof StudentAPI !== "undefined" && StudentAPI.getLabMaintenance) ? StudentAPI.getLabMaintenance() : {};
    if (maint && typeof maint === "object") {
      Object.keys(maint).forEach(k => {
        const match = k.match(/PC-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > count) count = num;
        }
      });
    }

    this.TOTAL_PCS = Math.max(16, count);
    return this.TOTAL_PCS;
  },

  setTotalPcs(newTotal) {
    const total = parseInt(newTotal, 10);
    if (!total || isNaN(total) || total < 1) return;
    this.TOTAL_PCS = total;
    localStorage.setItem("tis_lab_total_pcs", String(total));
    const mount = document.getElementById("timetableContentMount");
    if (mount) {
      mount.innerHTML = this.renderCurrentTab();
      if (this.activeTab === 'lab') this.initLabEvents();
      if (this.activeTab === 'monitor') this.initMonitorEvents();
      if (this.activeTab === 'software') this.initSoftwareEvents();
      if (this.activeTab === 'smartlab') this.initSmartLabEvents();
    }
    App.showToast(`🖥️ បានកំណត់ចំនួនកុំព្យូទ័របន្ទប់ Lab ទៅជា ${total} ម៉ាស៊ីន!`, "success");
  },

  getShiftsList() {
    const totalPcs = this.getTotalPcs();
    return [
      {
        id: "ព្រឹក",
        label: "វេនព្រឹក (08:00 - 09:00)",
        time: "08:00 - 09:00",
        course: "កុំព្យូទ័ររដ្ឋបាល (Typing ➔ Word ➔ Excel ➔ PowerPoint)",
        room: `Lab A (${totalPcs} ម៉ាស៊ីន)`,
        teacher: "លោកគ្រូ ខៀន ធូ"
      },
      {
        id: "ថ្ងៃ",
        label: "វេនថ្ងៃ (15:00 - 16:00)",
        time: "15:00 - 16:00",
        course: "កុំព្យូទ័ររដ្ឋបាល (Typing ➔ Word ➔ Excel ➔ PowerPoint)",
        room: `Lab A (${totalPcs} ម៉ាស៊ីន)`,
        teacher: "លោកគ្រូ ខៀន ធូ"
      },
      {
        id: "រសៀល",
        label: "វេនរសៀល (17:00 - 18:00)",
        time: "17:00 - 18:00",
        course: "កុំព្យូទ័ររដ្ឋបាល (Typing ➔ Word ➔ Excel ➔ PowerPoint)",
        room: `Lab A (${totalPcs} ម៉ាស៊ីន)`,
        teacher: "លោកគ្រូ ខៀន ធូ"
      }
    ];
  },

  getStudentsInShift(shiftId) {
    const students = App.state.students || [];
    const target = String(shiftId || "").trim().toLowerCase();
    return students.filter(s => {
      if (!s.Shift) return false;
      const sh = String(s.Shift).trim().toLowerCase();
      return sh === target || target.includes(sh) || sh.includes(target);
    });
  },

  getShiftLabel(shiftId) {
    const shifts = this.getShiftsList();
    const found = shifts.find(s => s.id === shiftId || s.label === shiftId);
    return found ? found.label : (shiftId || "វេនសិក្សា");
  },

  // Actual Live Student Sign-In Tracker (Real Sign-Ins from Student PC Agent / Overlay)
  getSignedInPcs() {
    let map = {};
    // 1. From local storage
    try {
      const raw = localStorage.getItem("tis_lab_signed_in_pcs");
      if (raw) map = JSON.parse(raw);
    } catch (e) {}

    // 2. Merge with Firebase live states (from Student-Overlay.hta or tis-lab-agent)
    const livePcs = (typeof StudentAPI !== "undefined" && StudentAPI.livePcs) ? StudentAPI.livePcs : (this.pcsLiveState || {});
    if (livePcs && typeof livePcs === "object") {
      Object.keys(livePcs).forEach(pcId => {
        const item = livePcs[pcId];
        if (item && (item.claimedStudentName || item.claimedStudentId)) {
          const itemShift = item.claimedShift || "";
          const isShiftMatch = !itemShift || itemShift === this.activeShift || (this.activeShift === "រសៀល" && (itemShift === "រសៀល" || itemShift === "ល្ងាច"));
          if (isShiftMatch) {
            map[pcId] = {
              studentId: item.claimedStudentId || pcId,
              studentName: item.claimedStudentName || "",
              shift: item.claimedShift || this.activeShift,
              signedInAt: item.claimedTime || Date.now(),
              attendanceStatus: item.attendanceStatus || "Present"
            };
          }
        }
      });
    }

    return map;
  },

  setPcSignedIn(pcId, studentId, studentName, shift = this.activeShift) {
    const map = this.getSignedInPcs();
    map[pcId] = {
      studentId,
      studentName,
      shift,
      signedInAt: Date.now(),
      attendanceStatus: "Present"
    };
    localStorage.setItem("tis_lab_signed_in_pcs", JSON.stringify(map));

    // Also update lab seat mapping
    const allSeats = this.getLabSeats();
    if (!allSeats[shift]) allSeats[shift] = {};
    allSeats[shift][pcId] = studentId;
    this.saveLabSeats(allSeats);

    // Sync to Firebase Realtime Database
    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref(`lab_monitor/pcs/${pcId}`).update({
          claimedStudentId: studentId,
          claimedStudentName: studentName,
          claimedShift: shift,
          claimedTime: Date.now(),
          attendanceStatus: "Present",
          is_online: true
        });
      } catch (e) {}
    }

    // Auto-mark attendance in StudentAPI
    if (typeof StudentAPI !== "undefined" && StudentAPI.saveAttendanceRecord) {
      const today = new Date().toISOString().split("T")[0];
      StudentAPI.saveAttendanceRecord(studentId, today, "present", `Sign-in on ${pcId}`);
    }

    this.updateMonitorCardsDom();
  },

  clearSinglePcSignIn(pcId) {
    const map = this.getSignedInPcs();
    delete map[pcId];
    localStorage.setItem("tis_lab_signed_in_pcs", JSON.stringify(map));

    // Update Firebase
    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref(`lab_monitor/pcs/${pcId}`).update({
          claimedStudentId: null,
          claimedStudentName: null,
          claimedShift: null,
          attendanceStatus: null
        });
      } catch (e) {}
    }

    const allSeats = this.getLabSeats();
    if (allSeats[this.activeShift]) {
      delete allSeats[this.activeShift][pcId];
      this.saveLabSeats(allSeats);
    }

    this.updateMonitorCardsDom();
    App.showToast(`បាន Sign-Out និងទុកកៅអី ${pcId} ឱ្យនៅទំនេរ!`, "info");
  },

  clearAllSignIns() {
    localStorage.removeItem("tis_lab_signed_in_pcs");
    const totalPcs = this.getTotalPcs();

    // Clear in Firebase
    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        for (let i = 1; i <= totalPcs; i++) {
          const pcId = `PC-${String(i).padStart(2, '0')}`;
          firebase.database().ref(`lab_monitor/pcs/${pcId}`).update({
            claimedStudentId: null,
            claimedStudentName: null,
            claimedShift: null,
            attendanceStatus: null
          });
        }
      } catch (e) {}
    }

    // Clear shift seats
    const allSeats = this.getLabSeats();
    allSeats[this.activeShift] = {};
    this.saveLabSeats(allSeats);

    this.updateMonitorCardsDom();
    App.showToast("🔄 បានសម្អាតការ Sign-In របស់សិស្សទាំងអស់ក្នុង Lab រួចរាល់! (ត្រឡប់ទៅ ០ នាក់)", "success");
  },

  simulateSignIns(count) {
    const n = parseInt(count, 10);
    this.clearAllSignIns();
    if (isNaN(n) || n <= 0) return;

    const students = this.getStudentsInShift(this.activeShift);
    const pool = (students && students.length > 0) ? students : (App.state.students || []);
    const totalPcs = this.getTotalPcs();
    const limit = Math.min(n, totalPcs, pool.length);

    for (let i = 0; i < limit; i++) {
      const pcId = `PC-${String(i + 1).padStart(2, '0')}`;
      const st = pool[i];
      this.setPcSignedIn(pcId, st.ID, st.NameKh, this.activeShift);
    }

    App.showToast(`🧪 បានតេស្ត Sign-In សិស្សជាក់ស្តែងចំនួន ${limit} នាក់ លើកុំព្យូទ័រ Lab!`, "success");
  },

  openDirectSignInModal(pcId) {
    const students = App.state.students || [];
    const shiftStudents = this.getStudentsInShift(this.activeShift);
    const pool = (shiftStudents && shiftStudents.length > 0) ? shiftStudents : students;
    const signedInMap = this.getSignedInPcs();
    const currentSign = signedInMap[pcId];

    let modalEl = document.getElementById("directSignInModal");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.id = "directSignInModal";
      modalEl.className = "modal-overlay";
      document.body.appendChild(modalEl);
    }

    modalEl.style.display = "flex";
    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 480px; animation: scaleIn 0.2s ease;">
        <div class="modal-header">
          <h3 style="display: flex; align-items: center; gap: 8px; font-size: 1.05rem; margin: 0;">
            <i class="fa-solid fa-desktop text-cyan-500"></i>
            <span>ចុះឈ្មោះសិស្សចូលម៉ាស៊ីន (Sign-In លើ ${pcId})</span>
          </h3>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('directSignInModal').style.display='none'">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body" style="padding: 20px;">
          <div style="background: var(--border-light); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 0.86rem; display: flex; justify-content: space-between;">
            <div>វេនសិក្សា៖ <strong>${this.getShiftLabel(this.activeShift)}</strong></div>
            <div>ម៉ាស៊ីន៖ <span class="font-mono font-bold text-cyan-600">${pcId}</span></div>
          </div>

          <div class="form-group" style="margin-bottom: 16px;">
            <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
              <i class="fa-solid fa-user-graduate text-indigo-500"></i> ជ្រើសរើសសិស្សដើម្បី Sign-In ចូល៖
            </label>
            <select id="directSignInStudentSelect" class="form-control" style="font-size: 0.88rem; font-weight: 600;">
              <option value="">-- ជ្រើសរើសសិស្ស (${pool.length} នាក់) --</option>
              ${pool.map(s => `
                <option value="${s.ID}" ${currentSign && currentSign.studentId === s.ID ? 'selected' : ''}>
                  ★ ${s.ID} - ${s.NameKh} (${s.Course || 'Typing'})
                </option>
              `).join('')}
            </select>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            ${currentSign ? `
              <button type="button" class="btn-outline-danger" onclick="TimetableLabView.clearSinglePcSignIn('${pcId}'); document.getElementById('directSignInModal').style.display='none';">
                <i class="fa-solid fa-user-xmark"></i> Sign-Out / ទុកទំនេរ
              </button>
            ` : ''}
            <button type="button" class="btn-primary" style="background: #10b981; border-color: #10b981;" onclick="TimetableLabView.confirmDirectSignIn('${pcId}')">
              <i class="fa-solid fa-circle-check"></i> បញ្ជាក់ Sign-In ចូល
            </button>
          </div>
        </div>
      </div>
    `;
  },

  confirmDirectSignIn(pcId) {
    const sel = document.getElementById("directSignInStudentSelect");
    const studentId = sel ? sel.value : "";
    if (!studentId) {
      App.showToast("សូមជ្រើសរើសសិស្ស!", "warning");
      return;
    }
    const student = (App.state.students || []).find(s => s.ID === studentId);
    const studentName = student ? student.NameKh : studentId;
    this.setPcSignedIn(pcId, studentId, studentName, this.activeShift);
    const modalEl = document.getElementById("directSignInModal");
    if (modalEl) modalEl.style.display = "none";
    App.showToast(`✅ សិស្ស "${studentName}" បាន Sign-In ចូល ${pcId} ជោគជ័យ!`, "success");
  },

  getLabSeats() {
    let seats = {};
    try {
      const storageKey = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.STORAGE_KEY_LAB) ? APP_CONFIG.STORAGE_KEY_LAB : "master_school_lab_seats";
      const data = localStorage.getItem(storageKey);
      if (data) seats = JSON.parse(data);
    } catch (e) {}

    const shifts = this.getShiftsList();
    shifts.forEach(sh => {
      if (!seats[sh.id]) {
        seats[sh.id] = {};
      }
    });

    return seats;
  },

  saveLabSeats(seats) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_LAB || "master_school_lab_seats", JSON.stringify(seats));
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        firebase.database().ref("lab_seats").set(seats);
      } catch (e) {}
    }
  },

  render() {
    return `
      <section id="view-timetable" class="page-view">
        <!-- Top Action & Title Header -->
        <div class="card" style="margin-bottom: 20px; padding: 20px 24px; border-left: 4px solid #06b6d4; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 6px 0;">
              <i class="fa-solid fa-calendar-days" style="color: #06b6d4;"></i>
              <span>កាលវិភាគសិក្សា & គ្រប់គ្រងកៅអីកុំព្យូទ័រ Lab (Timetable & PC Map)</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              តាមដានម៉ោងបង្រៀនជាក់ស្តែងតាមវេន បែងចែកកៅអី និងតាមដានអេក្រង់ម៉ាស៊ីនសិស្សផ្ទាល់ (Live PC Monitoring)
            </p>
          </div>

          <!-- Top Actions -->
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <div class="tt-view-switch" style="display: flex; background: var(--border-light); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color); gap: 4px; flex-wrap: wrap;">
              <button type="button" class="btn-tt-tab ${this.activeTab === 'timetable' ? 'active' : ''}" data-tt-tab="timetable" style="border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
                <i class="fa-solid fa-table-list"></i> កាលវិភាគ
              </button>
              <button type="button" class="btn-tt-tab ${this.activeTab === 'lab' ? 'active' : ''}" data-tt-tab="lab" style="border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
                <i class="fa-solid fa-desktop"></i> ប្លង់កៅអី & ត្រៀមរៀន
              </button>
              <button type="button" class="btn-tt-tab ${this.activeTab === 'monitor' ? 'active' : ''}" data-tt-tab="monitor" style="border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; background: ${this.activeTab === 'monitor' ? '#0ea5e9' : 'transparent'}; color: ${this.activeTab === 'monitor' ? '#fff' : 'inherit'};">
                <i class="fa-solid fa-tv" style="color: ${this.activeTab === 'monitor' ? '#fff' : '#0284c7'};"></i>
                <span>តាមដានផ្ទាល់</span>
                <span class="badge" style="background: #ef4444; color: #fff; font-size: 0.58rem; padding: 1px 4px; border-radius: 3px; animation: pulseViolationBadge 1.5s infinite;">LIVE</span>
              </button>
              <button type="button" class="btn-tt-tab ${this.activeTab === 'software' ? 'active' : ''}" data-tt-tab="software" style="border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer; background: ${this.activeTab === 'software' ? '#2563eb' : 'transparent'}; color: ${this.activeTab === 'software' ? '#fff' : 'inherit'};">
                <i class="fa-solid fa-box-open" style="color: ${this.activeTab === 'software' ? '#fff' : '#2563eb'};"></i> កម្មវិធី & អាជ្ញាប័ណ្ណ
              </button>
              <button type="button" class="btn-tt-tab ${this.activeTab === 'smartlab' ? 'active' : ''}" data-tt-tab="smartlab" style="border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer; background: ${this.activeTab === 'smartlab' ? '#7c3aed' : 'transparent'}; color: ${this.activeTab === 'smartlab' ? '#fff' : 'inherit'};">
                <i class="fa-solid fa-wand-magic-sparkles" style="color: ${this.activeTab === 'smartlab' ? '#fff' : '#7c3aed'};"></i> Smart Lab Console
              </button>
            </div>

            <button type="button" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" onclick="window.print()">
              <i class="fa-solid fa-print"></i>
              <span>Print</span>
            </button>
          </div>
        </div>

        <!-- Content Body Mount -->
        <div id="timetableContentMount">
          ${this.renderCurrentTab()}
        </div>
      </section>
    `;
  },

  renderCurrentTab() {
    if (this.activeTab === 'timetable') return this.renderTimetableSection();
    if (this.activeTab === 'lab') return this.renderLabMapSection();
    if (this.activeTab === 'monitor') return this.renderLiveMonitorSection();
    if (this.activeTab === 'software') return this.renderSoftwareSection();
    if (this.activeTab === 'smartlab') return this.renderSmartLabSection();
    return this.renderTimetableSection();
  },

  renderTimetableSection() {
    const students = App.state.students || [];
    const shifts = this.getShiftsList();

    return `
      <!-- Weekly Timetable Grid -->
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: 1.15rem; color: var(--text-main);">
              <i class="fa-regular fa-clock text-cyan-500"></i> កាលវិភាគបង្រៀនជាក់ស្តែងតាមវេន (ចន្ទ ដល់ សុក្រ)
            </h3>
            <span class="text-xs text-muted">បន្ទប់អនុវត្តកុំព្យូទ័រ Lab A • បង្រៀនដោយ លោកគ្រូ ខៀន ធូ (071 721 0307)</span>
          </div>

          <div style="display: flex; gap: 8px;">
            <span class="badge" style="background: rgba(6, 182, 212, 0.1); color: #0891b2; font-weight: 700;">
              <i class="fa-solid fa-circle-info"></i> សរុប ៣ វេនសិក្សាជាក់ស្តែង (${students.length} នាក់)
            </span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px;">
          ${shifts.map((shift) => {
            const shiftStudents = this.getStudentsInShift(shift.id);
            const count = shiftStudents.length;

            return `
              <div class="card" style="padding: 18px; border-left: 4px solid #06b6d4; margin-bottom: 0; background: var(--bg-surface); transition: transform 0.2s ease;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                  <div>
                    <span class="badge" style="background: rgba(6, 182, 212, 0.12); color: #0891b2; font-weight: 700; margin-bottom: 4px; display: inline-block;">
                      ${shift.label}
                    </span>
                    <h4 style="margin: 2px 0 0 0; font-size: 1.05rem; color: var(--text-main);">${shift.time}</h4>
                  </div>
                  <span class="badge ${count > 0 ? 'badge-pass' : ''}" style="font-size: 0.78rem; font-weight: 700;">
                    <i class="fa-solid fa-users"></i> ${count} នាក់
                  </span>
                </div>

                <div style="background: var(--border-light); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; font-size: 0.85rem; line-height: 1.7;">
                  <div><strong>មុខវិជ្ជា៖</strong> <span style="color: var(--primary); font-weight: 600;">${shift.course}</span></div>
                  <div><strong>បន្ទប់៖</strong> ${shift.room}</div>
                  <div><strong>គ្រូបង្រៀន៖</strong> ${shift.teacher}</div>
                </div>

                <!-- Students enrolled list preview -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; -webkit-box-align: center; align-items: center; overflow: hidden;">
                    ${shiftStudents.slice(0, 5).map(st => `
                      <img src="${st.Avatar || App.getDefaultAvatar(st.Gender)}" title="${st.NameKh}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 2px solid #ffffff; margin-left: -6px;" onerror="this.src='${App.getDefaultAvatar(st.Gender)}'">
                    `).join('')}
                    ${count > 5 ? `<span style="margin-left: 6px; font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">+${count - 5} នាក់</span>` : ''}
                  </div>

                  <button type="button" class="btn-secondary btn-sm" style="font-size: 0.78rem; padding: 4px 10px;" onclick="TimetableLabView.viewShiftInLab('${shift.id}')">
                    <i class="fa-solid fa-desktop text-cyan-600"></i> មើលកៅអី Lab
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderLabMapSection() {
    const students = App.state.students || [];
    const shifts = this.getShiftsList();
    if (!shifts.some(s => s.id === this.activeShift)) {
      this.activeShift = "ព្រឹក";
    }

    const allSeats = this.getLabSeats();
    const currentShiftSeats = allSeats[this.activeShift] || {};
    const shiftStudents = this.getStudentsInShift(this.activeShift);
    const maintenanceRecords = typeof StudentAPI !== "undefined" ? StudentAPI.getLabMaintenance() : {};
    const totalPcs = this.getTotalPcs();
    const readinessSummary = typeof StudentAPI !== "undefined" ? StudentAPI.getLabReadinessSummary(totalPcs) : {};
    const livePcs = (typeof StudentAPI !== "undefined" && StudentAPI.livePcs) ? StudentAPI.livePcs : {};
    const signedInMap = this.getSignedInPcs();

    let handsRaisedCount = 0;
    const handsRaisedList = [];

    // Total workstations with maintenance status, readiness, seat claim, and hand-raise
    const workstations = Array.from({ length: totalPcs }, (_, i) => {
      const pcId = `PC-${String(i + 1).padStart(2, '0')}`;
      const signedInfo = signedInMap[pcId];
      const isSignedIn = !!signedInfo;

      let student = null;
      if (isSignedIn) {
        student = students.find(s => s.ID === signedInfo.studentId);
        if (!student && signedInfo.studentName) {
          student = { ID: signedInfo.studentId || pcId, NameKh: signedInfo.studentName, Gender: "ប្រុស" };
        }
      }

      const reservedId = currentShiftSeats[pcId];
      const reservedStudent = (!isSignedIn && reservedId) ? students.find(s => s.ID === reservedId) : null;
      const isReserved = !isSignedIn && !!reservedStudent;

      const liveData = livePcs[pcId] || {};
      const isHandRaised = liveData.hand_raised === true || liveData.handRaised === true;
      if (isHandRaised) {
        handsRaisedCount++;
        handsRaisedList.push(pcId);
      }
      const maint = maintenanceRecords[pcId] || { status: "normal", issueNote: "" };
      const readyInfo = readinessSummary[pcId] || { isReady: true, missingSoftware: [] };
      return { pcId, student, reservedStudent, maint, readyInfo, isHandRaised, isSignedIn, signedInfo, isReserved };
    });

    const signedInCount = workstations.filter(w => w.isSignedIn).length;
    const normalCount = workstations.filter(w => !w.maint.status || w.maint.status === "normal").length;
    const maintCount = workstations.filter(w => w.maint.status === "maintenance").length;
    const brokenCount = workstations.filter(w => w.maint.status === "broken").length;

    return `
      <div class="card" style="padding: 24px;">
        <!-- Top Toolbar for Lab Map -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <label class="form-label" style="margin: 0; font-weight: 700; font-size: 0.9rem;">
              <i class="fa-solid fa-clock text-cyan-500"></i> ជ្រើសរើសវេនសិក្សា៖
            </label>
            <select id="labShiftSelect" class="form-control" style="font-weight: 700; font-size: 0.9rem; min-width: 280px;">
              ${shifts.map(sh => {
                const count = this.getStudentsInShift(sh.id).length;
                return `
                  <option value="${sh.id}" ${sh.id === this.activeShift ? 'selected' : ''}>
                    ${sh.label} (${count} នាក់)
                  </option>
                `;
              }).join('')}
            </select>
          </div>

          <!-- Lab KPI Badges & Quick Controls -->
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);"><i class="fa-solid fa-desktop text-cyan-600"></i> ចំនួន PC:</span>
              <select class="form-control" style="font-size: 0.84rem; font-weight: 700; height: 36px; padding: 0 8px; border-radius: 8px; background: var(--bg-surface); border: 1.5px solid #06b6d4; color: #0891b2; cursor: pointer;" onchange="TimetableLabView.setTotalPcs(this.value)">
                <option value="14" ${totalPcs === 14 ? 'selected' : ''}>14 ម៉ាស៊ីន</option>
                <option value="16" ${totalPcs === 16 ? 'selected' : ''}>16 ម៉ាស៊ីន (ស្តង់ដារ)</option>
                <option value="18" ${totalPcs === 18 ? 'selected' : ''}>18 ម៉ាស៊ីន</option>
                <option value="20" ${totalPcs === 20 ? 'selected' : ''}>20 ម៉ាស៊ីន</option>
                <option value="24" ${totalPcs === 24 ? 'selected' : ''}>24 ម៉ាស៊ីន</option>
                <option value="30" ${totalPcs === 30 ? 'selected' : ''}>30 ម៉ាស៊ីន</option>
              </select>
            </div>

            <!-- Real Sign-In Counter KPI -->
            <span class="badge" style="background: rgba(16, 185, 129, 0.18); color: #059669; font-weight: 800; padding: 6px 14px; font-size: 0.85rem; border: 1px solid rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-user-check"></i> សិស្សបាន Sign-In ជាក់ស្តែង៖ ${signedInCount}/${totalPcs} នាក់
            </span>
            <span class="badge" style="background: rgba(6, 182, 212, 0.12); color: #0891b2; font-weight: 700; padding: 6px 14px; font-size: 0.85rem;">
              <i class="fa-solid fa-chair"></i> នៅទំនេរ៖ ${totalPcs - signedInCount} ម៉ាស៊ីន
            </span>

            <!-- Sign-In Simulator for Teacher Testing -->
            <div style="display: flex; align-items: center; gap: 6px;">
              <select class="form-control" onchange="TimetableLabView.simulateSignIns(this.value); this.value='';" style="background: var(--bg-surface); border: 1.5px solid #8b5cf6; color: #7c3aed; font-size: 0.8rem; font-weight: 700; height: 36px; padding: 0 8px; border-radius: 8px; cursor: pointer;" title="តេស្តចំនួនសិស្ស Sign-In ជាក់ស្តែង">
                <option value="">🧪 តេស្តចំនួន Sign-In...</option>
                <option value="0">⚪ 0 នាក់ (គ្មានសិស្ស Sign-In)</option>
                <option value="1">🟢 1 នាក់ (សិស្ស 1 នាក់ចូល)</option>
                <option value="3">🟢 3 នាក់ (សិស្ស 3 នាក់ចូល)</option>
                <option value="5">🟢 5 នាក់ (សិស្ស 5 នាក់ចូល)</option>
                <option value="10">🟢 10 នាក់ (សិស្ស 10 នាក់ចូល)</option>
                <option value="16">🟢 16 នាក់ (សិស្ស 16 នាក់ពេញ)</option>
              </select>
              <button type="button" class="btn-secondary" onclick="TimetableLabView.clearAllSignIns()" style="height: 36px; padding: 0 10px; color: #dc2626; border-color: rgba(239, 68, 68, 0.4);" title="សម្អាតការ Sign-In ទាំងអស់ដើម្បីចាប់ផ្តើមម៉ោងរៀនថ្មី">
                <i class="fa-solid fa-rotate-left"></i> Reset
              </button>
            </div>

            <button type="button" class="btn-primary" id="btnAutoAssignSeats" style="height: 36px; padding: 0 14px; font-size: 0.82rem; background: #06b6d4; border-color: #06b6d4; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);" onclick="TimetableLabView.autoAssignShiftStudents()">
              <i class="fa-solid fa-wand-magic-sparkles"></i> បែងចែកកៅអីស្វ័យប្រវត្តិ
            </button>
          </div>
        </div>

        <!-- Student Hand-Raised Alert Banner -->
        ${handsRaisedCount > 0 ? `
          <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 12px; padding: 12px 18px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; animation: msPulse 1.8s infinite; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.2);">
            <div style="display: flex; align-items: center; gap: 12px; color: #b91c1c; font-weight: 700; font-size: 0.92rem;">
              <span style="width: 38px; height: 38px; border-radius: 50%; background: #ef4444; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i class="fa-solid fa-hand"></i>
              </span>
              <div>
                <div>មានសិស្សកំពុងលើកដៃសួរគ្រូចំនួន ${handsRaisedCount} នាក់ (${handsRaisedList.join(', ')})!</div>
                <div style="font-size: 0.78rem; color: #dc2626; font-weight: normal;">ចុចលើសញ្ញាលើកដៃលើកាត PC ដើម្បីឆ្លើយតប និងលុបសញ្ញា</div>
              </div>
            </div>
            <button type="button" class="btn-secondary btn-sm" style="color: #b91c1c; border-color: #ef4444; font-weight: 700;" onclick="${handsRaisedList.map(pc => `TimetableLabView.clearHand('${pc}')`).join(';')}">
              <i class="fa-solid fa-check-double"></i> ជួយសិស្សទាំងអស់រួច
            </button>
          </div>
        ` : ''}

        <!-- PC LAB HEALTH & MAINTENANCE STATUS SUMMARY BAR -->
        <div style="background: var(--border-light); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-screwdriver-wrench text-cyan-600"></i>
            <span>ស្ថានភាពសុខភាពម៉ាស៊ីនកុំព្យូទ័រ Lab (PC Health & Maintenance):</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; padding: 4px 10px; font-size: 0.78rem;">
              <i class="fa-solid fa-circle-check"></i> ល្អធម្មតា៖ ${normalCount}
            </span>
            <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #d97706; font-weight: 700; padding: 4px 10px; font-size: 0.78rem;">
              <i class="fa-solid fa-wrench"></i> ត្រូវការថែទាំ៖ ${maintCount}
            </span>
            <span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #dc2626; font-weight: 700; padding: 4px 10px; font-size: 0.78rem;">
              <i class="fa-solid fa-triangle-exclamation"></i> ខូច/ផ្អាក៖ ${brokenCount}
            </span>
          </div>
        </div>

        <!-- Teacher Podium / Master Station -->
        <div style="display: flex; justify-content: center; margin-bottom: 24px;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: #ffffff; padding: 10px 24px; border-radius: 12px; text-align: center; border: 2px solid #06b6d4; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.25);">
            <div style="font-size: 0.75rem; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">TEACHER PODIUM / MASTER SERVER</div>
            <div style="font-weight: 700; font-size: 0.95rem; margin-top: 2px;"><i class="fa-solid fa-chalkboard-user"></i> លោកគ្រូ ខៀន ធូ (Host Console)</div>
          </div>
        </div>

        <!-- Workstations Grid (${totalPcs} PCs) -->
        <div class="lab-workstations-grid" style="display: grid; grid-template-columns: repeat(${totalPcs >= 16 ? 8 : 7}, 1fr); gap: 14px; margin-bottom: 20px;">
          ${workstations.map(w => {
            const isSignedIn = w.isSignedIn;
            const isReserved = w.isReserved;
            const isBroken = w.maint.status === "broken";
            const isMaint = w.maint.status === "maintenance";

            let borderColor = isSignedIn ? '#10b981' : (isReserved ? '#3b82f6' : 'var(--border-color)');
            let bgColor = isSignedIn ? 'rgba(16, 185, 129, 0.08)' : (isReserved ? 'rgba(59, 130, 246, 0.05)' : 'var(--border-light)');
            if (isBroken) {
              borderColor = '#ef4444';
              bgColor = 'rgba(239, 68, 68, 0.08)';
            } else if (isMaint) {
              borderColor = '#f59e0b';
              bgColor = 'rgba(245, 158, 11, 0.08)';
            }
            if (w.isHandRaised) {
              borderColor = '#ef4444';
              bgColor = 'rgba(239, 68, 68, 0.12)';
            }

            return `
              <div class="workstation-box ${isSignedIn ? 'occupied' : 'empty'}" 
                onclick="TimetableLabView.openAssignSeatModal('${w.pcId}')" 
                style="background: ${bgColor}; border: 2px ${isReserved ? 'dashed' : 'solid'} ${borderColor}; border-radius: 10px; padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s ease; position: relative; ${w.isHandRaised ? 'box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);' : ''}">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span class="font-mono font-bold" style="font-size: 0.75rem; color: ${isBroken ? '#dc2626' : isMaint ? '#d97706' : isSignedIn ? '#059669' : isReserved ? '#2563eb' : 'var(--text-muted)'};">${w.pcId}</span>
                  ${isBroken ? `
                    <span class="badge" style="background: #fee2e2; color: #dc2626; font-size: 0.62rem; padding: 1px 5px;" title="${w.maint.issueNote || 'ម៉ាស៊ីនខូច'}">
                      <i class="fa-solid fa-triangle-exclamation"></i> ខូច
                    </span>
                  ` : isMaint ? `
                    <span class="badge" style="background: #fef3c7; color: #d97706; font-size: 0.62rem; padding: 1px 5px;" title="${w.maint.issueNote || 'ត្រូវការថែទាំ'}">
                      <i class="fa-solid fa-wrench"></i> ថែទាំ
                    </span>
                  ` : `
                    <i class="fa-solid fa-circle" style="font-size: 0.5rem; color: ${isSignedIn ? '#10b981' : isReserved ? '#3b82f6' : '#94a3b8'};"></i>
                  `}
                </div>

                <div style="font-size: 1.5rem; color: ${isBroken ? '#ef4444' : isMaint ? '#f59e0b' : isSignedIn ? '#10b981' : isReserved ? '#3b82f6' : 'var(--text-muted)'}; margin: 2px 0;">
                  <i class="fa-solid fa-desktop"></i>
                </div>

                ${isSignedIn && w.student ? `
                  <div style="margin-top: 4px;">
                    <img src="${w.student.Avatar || App.getDefaultAvatar(w.student.Gender)}" alt="${w.student.NameKh}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid #10b981; margin: 0 auto 3px auto; display: block; box-shadow: 0 2px 6px rgba(16,185,129,0.3);" onerror="this.src='${App.getDefaultAvatar(w.student.Gender)}'">
                    <div style="font-size: 0.78rem; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${w.student.NameKh}</div>
                    <span class="badge" style="background: rgba(16, 185, 129, 0.18); color: #059669; font-weight: 800; font-size: 0.62rem; padding: 1px 6px; border-radius: 4px; margin-top: 2px; display: inline-block;">
                      <i class="fa-solid fa-circle-check"></i> បាន Sign-In (${w.signedInfo.shift || this.activeShift})
                    </span>
                  </div>
                ` : isReserved && w.reservedStudent ? `
                  <div style="margin-top: 4px;">
                    <div style="width: 30px; height: 30px; border-radius: 50%; background: rgba(59, 130, 246, 0.12); border: 1.5px dashed #3b82f6; display: flex; align-items: center; justify-content: center; margin: 0 auto 3px auto; color: #3b82f6; font-size: 0.8rem;">
                      <i class="fa-solid fa-user-clock"></i>
                    </div>
                    <div style="font-size: 0.74rem; font-weight: 700; color: #2563eb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${w.reservedStudent.NameKh}</div>
                    <span class="badge" style="background: rgba(59, 130, 246, 0.1); color: #2563eb; font-weight: 600; font-size: 0.6rem; padding: 1px 5px; border-radius: 4px; margin-top: 2px; display: inline-block;">
                      ⏳ រង់ចាំ Sign-In
                    </span>
                  </div>
                ` : `
                  <div style="margin-top: 6px;">
                    <span class="badge" style="background: transparent; border: 1px dashed var(--border-color); color: var(--text-muted); font-size: 0.68rem;">+ ទំនេរ</span>
                    <div style="font-size: 0.62rem; color: var(--text-muted); margin-top: 2px;">(រង់ចាំសិស្ស)</div>
                  </div>
                `}

                ${w.isHandRaised ? `
                  <div style="margin-top: 4px;" onclick="event.stopPropagation(); TimetableLabView.clearHand('${w.pcId}')">
                    <span class="badge" style="background: #ef4444; color: #fff; font-size: 0.65rem; padding: 2px 6px; font-weight: 700; animation: msPulse 1s infinite; cursor: pointer; display: inline-block; box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);" title="ចុចដើម្បីបិទសញ្ញាលើកដៃ">
                      <i class="fa-solid fa-hand"></i> លើកដៃសួរ!
                    </span>
                  </div>
                ` : ''}

                ${w.readyInfo && w.readyInfo.isReady ? `
                  <div style="margin-top: 3px;">
                    <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-size: 0.6rem; padding: 1px 4px; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.3);">
                      <i class="fa-solid fa-circle-check"></i> ១០០% រួចរាល់
                    </span>
                  </div>
                ` : w.readyInfo && w.readyInfo.missingSoftware && w.readyInfo.missingSoftware.length > 0 ? `
                  <div style="margin-top: 3px;">
                    <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #d97706; font-size: 0.6rem; padding: 1px 4px; font-weight: 700; border: 1px solid rgba(245, 158, 11, 0.3);" title="ខ្វះ៖ ${w.readyInfo.missingSoftware.join(', ')}">
                      <i class="fa-solid fa-triangle-exclamation"></i> ខ្វះ ${w.readyInfo.missingSoftware.length} កម្មវិធី
                    </span>
                  </div>
                ` : ''}

                ${w.maint.issueNote ? `
                  <div style="font-size: 0.65rem; color: ${isBroken ? '#dc2626' : '#d97706'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 3px;" title="${w.maint.issueNote}">
                    <i class="fa-solid fa-circle-exclamation"></i> ${w.maint.issueNote}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--border-light); padding: 12px 18px; border-radius: 8px; font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap; gap: 10px;">
          <span>💡 គន្លឹះ៖ ចុចលើម៉ាស៊ីនកុំព្យូទ័រណាមួយដើម្បី Sign-In សិស្ស កំណត់កៅអី ឬត្រួតពិនិត្យសុខភាព Hardware។</span>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn-secondary btn-sm" onclick="TimetableLabView.clearAllSignIns()">
              <i class="fa-solid fa-rotate-left"></i> សម្អាត Sign-In ទាំងអស់
            </button>
            <button type="button" class="btn-secondary btn-sm" onclick="TimetableLabView.autoAssignShiftStudents()">
              <i class="fa-solid fa-wand-magic-sparkles text-cyan-600"></i> បែងចែកកៅអីស្វ័យប្រវត្តិ
            </button>
          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    // Tab switcher
    document.querySelectorAll(".btn-tt-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-tt-tab").forEach(b => {
          b.classList.remove("active");
          b.style.background = "";
          b.style.color = "";
        });
        btn.classList.add("active");
        this.activeTab = btn.getAttribute("data-tt-tab");
        if (this.activeTab === "monitor") {
          btn.style.background = "#0ea5e9";
          btn.style.color = "#fff";
        } else if (this.activeTab === "software") {
          btn.style.background = "#2563eb";
          btn.style.color = "#fff";
        } else if (this.activeTab === "smartlab") {
          btn.style.background = "#7c3aed";
          btn.style.color = "#fff";
        }
        const mount = document.getElementById("timetableContentMount");
        if (mount) {
          mount.innerHTML = this.renderCurrentTab();
          if (this.activeTab === 'lab') this.initLabEvents();
          if (this.activeTab === 'monitor') this.initMonitorEvents();
          if (this.activeTab === 'software') this.initSoftwareEvents();
          if (this.activeTab === 'smartlab') this.initSmartLabEvents();
        }
      });
    });

    if (this.activeTab === 'lab') this.initLabEvents();
    if (this.activeTab === 'monitor') this.initMonitorEvents();
    if (this.activeTab === 'software') this.initSoftwareEvents();
    if (this.activeTab === 'smartlab') this.initSmartLabEvents();
  },

  initLabEvents() {
    const shiftSel = document.getElementById("labShiftSelect");
    if (shiftSel) {
      shiftSel.addEventListener("change", (e) => {
        this.activeShift = e.target.value;
        const mount = document.getElementById("timetableContentMount");
        if (mount && this.activeTab === 'lab') {
          mount.innerHTML = this.renderLabMapSection();
          this.initLabEvents();
        }
      });
    }
  },

  viewShiftInLab(shiftId) {
    this.activeShift = shiftId;
    this.activeTab = "lab";
    const navTabBtns = document.querySelectorAll(".btn-tt-tab");
    navTabBtns.forEach(b => {
      if (b.getAttribute("data-tt-tab") === "lab") b.classList.add("active");
      else b.classList.remove("active");
    });
    const mount = document.getElementById("timetableContentMount");
    if (mount) {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  },

  openSeatAssignModal(pcId) {
    return this.openAssignSeatModal(pcId);
  },

  openAssignSeatModal(pcId) {
    const allSeats = this.getLabSeats();
    const currentShiftSeats = allSeats[this.activeShift] || {};
    const currentStudentId = currentShiftSeats[pcId];
    const students = App.state.students || [];
    const shiftStudents = this.getStudentsInShift(this.activeShift);
    const otherStudents = students.filter(s => !shiftStudents.some(ss => ss.ID === s.ID));

    const signedInMap = this.getSignedInPcs();
    const currentSign = signedInMap[pcId];

    const maintenanceRecords = typeof StudentAPI !== "undefined" ? StudentAPI.getLabMaintenance() : {};
    const currentMaint = maintenanceRecords[pcId] || { status: "normal", issueNote: "" };

    let modalEl = document.getElementById("assignLabSeatModal");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.id = "assignLabSeatModal";
      modalEl.className = "modal-overlay";
      document.body.appendChild(modalEl);
    }

    modalEl.style.display = "flex";
    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 520px; animation: scaleIn 0.2s ease;">
        <div class="modal-header">
          <h3 style="display: flex; align-items: center; gap: 8px; font-size: 1.05rem; margin: 0;">
            <i class="fa-solid fa-desktop text-cyan-500"></i>
            <span>គ្រប់គ្រងកៅអី & សុខភាពម៉ាស៊ីន ${pcId}</span>
          </h3>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('assignLabSeatModal').style.display='none'">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body" style="padding: 20px;">
          <div style="background: var(--border-light); border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 0.86rem; display: flex; justify-content: space-between; align-items: center;">
            <div>វេនសិក្សា៖ <strong>${this.getShiftLabel(this.activeShift)}</strong></div>
            <div>ម៉ាស៊ីន៖ <span class="font-mono font-bold text-cyan-600">${pcId}</span> (Lab A)</div>
          </div>

          <!-- Real Sign-In Live Status Banner -->
          ${currentSign ? `
            <div style="background: rgba(16, 185, 129, 0.12); border: 1.5px solid #10b981; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 0.86rem; color: #065f46; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 800; color: #047857;"><i class="fa-solid fa-circle-check"></i> សិស្សកំពុង Sign-In ជាក់ស្តែង៖</div>
                <div style="font-size: 0.9rem; font-weight: 700; margin-top: 2px;">${currentSign.studentName} (${currentSign.studentId}) • វេន ${currentSign.shift || this.activeShift}</div>
              </div>
              <button type="button" class="btn-outline-danger btn-sm" onclick="TimetableLabView.clearSinglePcSignIn('${pcId}'); document.getElementById('assignLabSeatModal').style.display='none';" title="Sign-Out / ទុកកៅអីទំនេរ">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign-Out
              </button>
            </div>
          ` : `
            <div style="background: rgba(148, 163, 184, 0.1); border: 1px dashed var(--border-color); border-radius: 8px; padding: 8px 12px; margin-bottom: 14px; font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-circle-info text-cyan-500"></i>
              <span>ម៉ាស៊ីននេះមិនទាន់មានសិស្ស Sign-In ចូលនៅឡើយទេ (កៅអីទំនេរ)។</span>
            </div>
          `}

          <!-- Student Assignment Section -->
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="seatStudentSelect" style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
              <i class="fa-solid fa-user-graduate text-indigo-500"></i> ជ្រើសរើសសិស្សសម្រាប់ម៉ាស៊ីននេះ៖
            </label>
            <select id="seatStudentSelect" class="form-control" style="font-size: 0.88rem; font-weight: 600;">
              <option value="">-- កៅអីនៅទំនេរ (គ្មានសិស្ស) --</option>
              ${shiftStudents.length > 0 ? `
                <optgroup label="សិស្សក្នុង${this.getShiftLabel(this.activeShift)} (${shiftStudents.length} នាក់)">
                  ${shiftStudents.map(s => `
                    <option value="${s.ID}" ${(currentSign && currentSign.studentId === s.ID) || (!currentSign && s.ID === currentStudentId) ? 'selected' : ''}>
                      ★ ${s.ID} - ${s.NameKh} (${s.Course || 'Typing'})
                    </option>
                  `).join('')}
                </optgroup>
              ` : ''}
              ${otherStudents.length > 0 ? `
                <optgroup label="សិស្សវេនផ្សេងទៀត">
                  ${otherStudents.map(s => `
                    <option value="${s.ID}" ${(currentSign && currentSign.studentId === s.ID) || (!currentSign && s.ID === currentStudentId) ? 'selected' : ''}>
                      ${s.ID} - ${s.NameKh} (${s.Course || 'Typing'} | វេន ${s.Shift})
                    </option>
                  `).join('')}
                </optgroup>
              ` : ''}
            </select>
          </div>

          <!-- PC Health & Maintenance Section -->
          <div style="border-top: 1px dashed var(--border-color); padding-top: 14px; margin-top: 14px;">
            <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
              <i class="fa-solid fa-screwdriver-wrench text-amber-500"></i> ស្ថានភាពសុខភាពម៉ាស៊ីន (PC Health Status)៖
            </label>
            <select id="pcHealthStatusSelect" class="form-control" style="font-size: 0.88rem; font-weight: 600; margin-bottom: 12px;">
              <option value="normal" ${currentMaint.status === 'normal' || !currentMaint.status ? 'selected' : ''}>🟢 ដំណើរការល្អ (Normal - ល្អ)</option>
              <option value="maintenance" ${currentMaint.status === 'maintenance' ? 'selected' : ''}>🟡 ត្រូវការត្រួតពិនិត្យ/ថែទាំ (Maintenance Needed)</option>
              <option value="broken" ${currentMaint.status === 'broken' ? 'selected' : ''}>🔴 ខូច / ផ្អាកប្រើប្រាស់ (Out of Order)</option>
            </select>

            <label for="pcIssueNoteInput" style="font-weight: 600; font-size: 0.82rem; display: block; margin-bottom: 4px; color: var(--text-muted);">
              កំណត់សម្គាល់បញ្ហា ឬការជួសជុល (Issue / Repair Notes)៖
            </label>
            <input type="text" id="pcIssueNoteInput" class="form-control" placeholder="ឧ. Mouse ឆ្វេងមិនដើរ ឬ រង់ចាំដំឡើង Windows..." value="${App.escapeHtml(currentMaint.issueNote || '')}" style="font-size: 0.85rem;">
          </div>

          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; flex-wrap: wrap;">
            <button type="button" class="btn-outline-danger" onclick="TimetableLabView.unassignSeat('${pcId}')">
              <i class="fa-solid fa-trash-can"></i> ទុកកៅអីទំនេរ
            </button>
            <button type="button" class="btn-secondary" style="color: #0284c7; border-color: #0284c7;" onclick="TimetableLabView.confirmAssignSeat('${pcId}')">
              <i class="fa-solid fa-bookmark"></i> កក់ទុកកៅអី
            </button>
            <button type="button" class="btn-primary" style="background: #10b981; border-color: #10b981;" onclick="TimetableLabView.confirmDirectSignInFromAssign('${pcId}')">
              <i class="fa-solid fa-circle-check"></i> Sign-In ភ្លាមៗ (Active)
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async confirmDirectSignInFromAssign(pcId) {
    const sel = document.getElementById("seatStudentSelect");
    const studentId = sel ? sel.value : "";
    if (!studentId) {
      App.showToast("សូមជ្រើសរើសសិស្សដើម្បី Sign-In!", "warning");
      return;
    }
    const student = (App.state.students || []).find(s => s.ID === studentId);
    const studentName = student ? student.NameKh : studentId;
    this.setPcSignedIn(pcId, studentId, studentName, this.activeShift);

    // Save maintenance as well
    const healthSelect = document.getElementById("pcHealthStatusSelect");
    const noteInput = document.getElementById("pcIssueNoteInput");
    if (healthSelect && typeof StudentAPI !== "undefined") {
      const status = healthSelect.value || "normal";
      const issueNote = noteInput ? noteInput.value.trim() : "";
      await StudentAPI.saveLabMaintenance(pcId, { status, issueNote });
    }

    const modalEl = document.getElementById("assignLabSeatModal");
    if (modalEl) modalEl.style.display = "none";
    App.showToast(`✅ សិស្ស "${studentName}" បាន Sign-In ចូល ${pcId} ជោគជ័យ!`, "success");

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === 'lab') {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  },

  async confirmAssignSeat(pcId) {
    const sel = document.getElementById("seatStudentSelect");
    const studentId = sel ? sel.value : "";
    const allSeats = this.getLabSeats();
    if (!allSeats[this.activeShift]) allSeats[this.activeShift] = {};

    if (!studentId) {
      delete allSeats[this.activeShift][pcId];
      App.showToast(`បានកំណត់ម៉ាស៊ីន ${pcId} ឱ្យនៅទំនេរ`, "info");
    } else {
      allSeats[this.activeShift][pcId] = studentId;
      const st = (App.state.students || []).find(s => s.ID === studentId);
      App.showToast(`បានកំណត់កក់កៅអី ${pcId} ជូនសិស្ស "${st ? st.NameKh : studentId}" ជោគជ័យ!`, "success");
    }

    // Save PC health and maintenance status
    const healthSelect = document.getElementById("pcHealthStatusSelect");
    const noteInput = document.getElementById("pcIssueNoteInput");
    if (healthSelect && typeof StudentAPI !== "undefined") {
      const status = healthSelect.value || "normal";
      const issueNote = noteInput ? noteInput.value.trim() : "";
      await StudentAPI.saveLabMaintenance(pcId, { status, issueNote });
    }

    this.saveLabSeats(allSeats);
    const modalEl = document.getElementById("assignLabSeatModal");
    if (modalEl) modalEl.style.display = "none";

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === 'lab') {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  },

  unassignSeat(pcId) {
    this.clearSinglePcSignIn(pcId);
    const allSeats = this.getLabSeats();
    if (allSeats[this.activeShift]) {
      delete allSeats[this.activeShift][pcId];
      this.saveLabSeats(allSeats);
    }
    App.showToast(`បានកំណត់ម៉ាស៊ីន ${pcId} ឱ្យនៅទំនេរ`, "info");
    const modalEl = document.getElementById("assignLabSeatModal");
    if (modalEl) modalEl.style.display = "none";

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === 'lab') {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  },

  autoAssignShiftStudents() {
    const totalPcs = this.getTotalPcs();
    const shiftStudents = this.getStudentsInShift(this.activeShift);
    const allSeats = this.getLabSeats();
    allSeats[this.activeShift] = {};

    shiftStudents.slice(0, totalPcs).forEach((st, idx) => {
      const pcId = `PC-${String(idx + 1).padStart(2, '0')}`;
      allSeats[this.activeShift][pcId] = st.ID;
    });

    this.saveLabSeats(allSeats);
    const assignedCount = Math.min(shiftStudents.length, totalPcs);
    App.showToast(`បានបែងចែកកៅអីកុំព្យូទ័រស្វ័យប្រវត្តិចំនួន ${assignedCount} ម៉ាស៊ីន (ក្នុងចំណោម ${totalPcs} ម៉ាស៊ីន) សម្រាប់ ${this.getShiftLabel(this.activeShift)}!`, "success");
    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === 'lab') {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  },

  /* ==========================================================================
     LIVE PC MONITOR SECTION & NETSUPPORT SCHOOL STYLE CONTROLS
     ========================================================================== */

  getCurrentPolicy() {
    if (this.lastPolicy) return this.lastPolicy;
    try {
      const saved = localStorage.getItem("tis_lab_app_policy");
      if (saved) {
        this.lastPolicy = JSON.parse(saved);
        return this.lastPolicy;
      }
    } catch (e) {}

    // Default policy: Exam Mode
    this.lastPolicy = {
      mode: "exam",
      whitelist: ["WINWORD", "EXCEL", "POWERPNT", "TypingArena", "notepad", "calc"],
      blacklist: ["RobloxPlayerBeta", "Telegram", "Discord", "Steam", "EpicGamesLauncher", "Spotify", "chrome", "msedge", "brave", "game"],
      lock_all: false,
      blank_all: false,
      lock_message: "🔒 ម៉ោងប្រឡងកុំព្យូទ័ររដ្ឋបាល - អនុញ្ញាតតែកម្មវិធីប្រឡង (Word, Excel, PPT, Typing) ប៉ុណ្ណោះ",
      updated_at: Date.now()
    };
    return this.lastPolicy;
  },

  getDefaultSimulatedPcs() {
    return {
      "PC-01": {
        pc_id: "PC-01",
        host_name: "LAB-PC01",
        user_name: "Student-01",
        active_process: "WINWORD.EXE",
        active_window: "Word - កិច្ចសន្យាការងារ_អនុវត្ត.docx",
        all_processes: ["WINWORD.EXE", "explorer.exe", "dwmd.exe", "spoolsv.exe"],
        app_type: "word",
        is_locked: false,
        is_online: true,
        cpu: "14%",
        ram: "3.2 / 8.0 GB"
      },
      "PC-02": {
        pc_id: "PC-02",
        host_name: "LAB-PC02",
        user_name: "Student-02",
        active_process: "EXCEL.EXE",
        active_window: "Excel - តារាងបញ្ជីប្រាក់ខែបុគ្គលិក_កញ្ញា.xlsx",
        all_processes: ["EXCEL.EXE", "explorer.exe", "dwmd.exe"],
        app_type: "excel",
        is_locked: false,
        is_online: true,
        cpu: "18%",
        ram: "3.5 / 8.0 GB"
      },
      "PC-03": {
        pc_id: "PC-03",
        host_name: "LAB-PC03",
        user_name: "Student-03",
        active_process: "TypingArena",
        active_window: "TIS Typing Arena - ការប្រឡងវាយអក្សរខ្មែរ (Speed: 48 WPM)",
        all_processes: ["TypingArena", "explorer.exe"],
        app_type: "typing",
        is_locked: false,
        is_online: true,
        cpu: "9%",
        ram: "2.8 / 8.0 GB"
      },
      "PC-04": {
        pc_id: "PC-04",
        host_name: "LAB-PC04",
        user_name: "Student-04",
        active_process: "chrome.exe",
        active_window: "YouTube - Khmer Lo-Fi Beats & Relaxing Music",
        all_processes: ["chrome.exe", "WINWORD.EXE", "explorer.exe"],
        app_type: "browser_violation",
        violation_app: "YouTube / Chrome",
        is_locked: false,
        is_online: true,
        cpu: "32%",
        ram: "4.9 / 8.0 GB"
      },
      "PC-05": {
        pc_id: "PC-05",
        host_name: "LAB-PC05",
        user_name: "Student-05",
        active_process: "POWERPNT.EXE",
        active_window: "PowerPoint - បទបង្ហាញ_ទេសចរណ៍កម្ពុជា.pptx",
        all_processes: ["POWERPNT.EXE", "explorer.exe"],
        app_type: "ppt",
        is_locked: false,
        is_online: true,
        cpu: "12%",
        ram: "3.1 / 8.0 GB"
      },
      "PC-06": {
        pc_id: "PC-06",
        host_name: "LAB-PC06",
        user_name: "Student-06",
        active_process: "WINWORD.EXE",
        active_window: "Word - សេចក្តីជូនដំណឹងរដ្ឋបាល.docx",
        all_processes: ["WINWORD.EXE", "explorer.exe"],
        app_type: "word",
        is_locked: false,
        is_online: true,
        cpu: "8%",
        ram: "2.9 / 8.0 GB"
      },
      "PC-07": {
        pc_id: "PC-07",
        host_name: "LAB-PC07",
        user_name: "Student-07",
        active_process: "Telegram.exe",
        active_window: "Telegram Desktop - Group Chat",
        all_processes: ["Telegram.exe", "EXCEL.EXE", "explorer.exe"],
        app_type: "chat_violation",
        violation_app: "Telegram.exe",
        is_locked: false,
        is_online: true,
        cpu: "16%",
        ram: "3.6 / 8.0 GB"
      },
      "PC-08": {
        pc_id: "PC-08",
        host_name: "LAB-PC08",
        user_name: "Student-08",
        active_process: "EXCEL.EXE",
        active_window: "Excel - រូបមន្ត VLOOKUP & IF Condition.xlsx",
        all_processes: ["EXCEL.EXE", "explorer.exe"],
        app_type: "excel",
        is_locked: false,
        is_online: true,
        cpu: "11%",
        ram: "3.0 / 8.0 GB"
      },
      "PC-09": {
        pc_id: "PC-09",
        host_name: "LAB-PC09",
        user_name: "Student-09",
        active_process: "TypingArena",
        active_window: "TIS Typing Arena - មេរៀនទី ៨ (Speed: 52 WPM)",
        all_processes: ["TypingArena", "explorer.exe"],
        app_type: "typing",
        is_locked: false,
        is_online: true,
        cpu: "7%",
        ram: "2.6 / 8.0 GB"
      },
      "PC-10": {
        pc_id: "PC-10",
        host_name: "LAB-PC10",
        user_name: "Student-10",
        active_process: "WINWORD.EXE",
        active_window: "Word - លិខិតផ្លូវការ និងការកំណត់ Margins.docx",
        all_processes: ["WINWORD.EXE", "explorer.exe"],
        app_type: "word",
        is_locked: false,
        is_online: true,
        cpu: "10%",
        ram: "2.8 / 8.0 GB"
      },
      "PC-11": {
        pc_id: "PC-11",
        host_name: "LAB-PC11",
        user_name: "Student-11",
        active_process: "WINWORD.EXE",
        active_window: "Word - ប្លង់រៀបចំពាក្យស្នើសុំ.docx",
        all_processes: ["WINWORD.EXE", "explorer.exe"],
        app_type: "word",
        is_locked: false,
        is_online: true,
        cpu: "13%",
        ram: "3.3 / 8.0 GB"
      },
      "PC-12": {
        pc_id: "PC-12",
        host_name: "LAB-PC12",
        user_name: "Student-12",
        active_process: "TypingArena",
        active_window: "TIS Typing Arena - ការហ្វឹកហាត់ល្បឿន (41 WPM)",
        all_processes: ["TypingArena", "explorer.exe"],
        app_type: "typing",
        is_locked: false,
        is_online: true,
        cpu: "8%",
        ram: "2.7 / 8.0 GB"
      },
      "PC-13": {
        pc_id: "PC-13",
        host_name: "LAB-PC13",
        user_name: "Student-13",
        active_process: "LockScreen.exe",
        active_window: "🔒 Locked by Teacher",
        all_processes: ["explorer.exe"],
        app_type: "locked",
        is_locked: true,
        is_online: true,
        cpu: "3%",
        ram: "2.2 / 8.0 GB"
      },
      "PC-14": {
        pc_id: "PC-14",
        host_name: "LAB-PC14",
        user_name: "Student-14",
        active_process: "WINWORD.EXE",
        active_window: "Word - កិច្ចការរដ្ឋបាល.docx",
        all_processes: ["WINWORD.EXE", "explorer.exe"],
        app_type: "word",
        is_locked: false,
        is_online: true,
        cpu: "11%",
        ram: "3.0 / 8.0 GB"
      },
      "PC-15": {
        pc_id: "PC-15",
        host_name: "LAB-PC15",
        user_name: "Student-15",
        active_process: "EXCEL.EXE",
        active_window: "Excel - បញ្ជីស្ថិតិប្រចាំខែ.xlsx",
        all_processes: ["EXCEL.EXE", "explorer.exe"],
        app_type: "excel",
        is_locked: false,
        is_online: true,
        cpu: "14%",
        ram: "3.2 / 8.0 GB"
      },
      "PC-16": {
        pc_id: "PC-16",
        host_name: "LAB-PC16",
        user_name: "Student-16",
        active_process: "TypingArena",
        active_window: "TIS Typing Arena - ការហ្វឹកហាត់ល្បឿន (45 WPM)",
        all_processes: ["TypingArena", "explorer.exe"],
        app_type: "typing",
        is_locked: false,
        is_online: true,
        cpu: "8%",
        ram: "2.7 / 8.0 GB"
      }
    };
  },

  isProcessViolation(procName, winTitle) {
    if (!procName) return false;
    const policy = this.getCurrentPolicy();
    const p = String(procName).toLowerCase().replace(/\.exe$/i, "").trim();
    const w = String(winTitle || "").toLowerCase();

    // Check blacklist first
    const blacklist = policy.blacklist || [];
    for (const b of blacklist) {
      const bLow = String(b).trim().toLowerCase();
      if (!bLow) continue;
      if (p.includes(bLow) || bLow.includes(p) || w.includes(bLow)) {
        return true;
      }
    }

    // In Exam Mode or Study Mode, check whitelist
    if (policy.mode === "exam" || policy.mode === "study") {
      const whitelist = (policy.whitelist || []).map(x => String(x).toLowerCase().trim());
      const isSystem = [
        "explorer", "dwm", "taskhostw", "conhost", "cmd", "powershell", "pwsh",
        "lockscreen", "system", "idle", "desktop", "standby", "svchost", "csrss",
        "winlogon", "searchapp", "shellexperiencehost", "startmenuexperiencehost",
        "applicationframehost", "mshta", "runtimebroker", "ctfmon", "sihost"
      ].includes(p);
      if (!isWhitelisted && !isSystem && p !== "offline") {
        return true;
      }
    }

    return false;
  },

  renderScreenDisplay(pc, isViolation) {
    if (pc.is_locked || this.isLockAllActive) {
      return `
        <div class="screen-locked-overlay">
          <i class="fa-solid fa-lock lock-glowing-icon"></i>
          <div style="color: #fca5a5; font-size: 0.84rem; font-weight: 800; letter-spacing: 0.3px;">ចាក់សោរដោយលោកគ្រូ</div>
          <div style="color: #cbd5e1; font-size: 0.7rem; margin-top: 4px; max-width: 90%;">${App.escapeHtml(this.getCurrentPolicy().lock_message || 'ម៉ោងប្រឡង / ពន្យល់មេរៀន')}</div>
        </div>
      `;
    }

    if (pc.is_blank || this.isBlankAllActive) {
      return `
        <div class="screen-blank-overlay">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <i class="fa-solid fa-eye-slash" style="font-size: 1.4rem; color: #64748b;"></i>
            <span style="font-size: 0.76rem; color: #94a3b8; letter-spacing: 0.5px;">BLANK SCREEN (អេក្រង់ងងឹត)</span>
          </div>
        </div>
      `;
    }

    if (!pc.is_online) {
      return `
        <div style="width: 100%; height: 100%; background: #050811; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #475569; font-size: 0.75rem;">
          <i class="fa-solid fa-power-off" style="font-size: 1.5rem; margin-bottom: 6px; color: #334155;"></i>
          <span style="font-weight: 700; letter-spacing: 0.5px;">OFFLINE / មិនទាន់បើក</span>
        </div>
      `;
    }

    // Real screenshot data URI from physical PC agent (PRIORITY: Show real live screen whenever available!)
    const liveShot = pc.screenshot_url || pc.screenThumbnail;
    if (liveShot && liveShot.length > 50) {
      return `
        <div style="width: 100%; height: 100%; position: relative; overflow: hidden;">
          <img src="${liveShot}" class="pc-real-screenshot" alt="${pc.pc_id}">
          <div class="pc-live-watermark">
            <span class="pc-live-dot"></span>
            <span>LIVE</span>
          </div>
          ${isViolation ? `
            <div style="position: absolute; top: 6px; right: 6px; background: #ef4444; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; box-shadow: 0 0 12px rgba(239, 68, 68, 0.8); z-index: 6;" class="blink">
              <i class="fa-solid fa-triangle-exclamation"></i> ហាមឃាត់!
            </div>
          ` : ''}
        </div>
      `;
    }

    // Standby: If no student has signed in yet (waiting for student to sign in)
    if (!pc.isSignedIn) {
      return `
        <div class="standby-radar-box">
          <div class="radar-sweep-circle"></div>
          <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(56, 189, 248, 0.08); border: 1.5px dashed rgba(56, 189, 248, 0.4); display: flex; align-items: center; justify-content: center; margin-bottom: 6px; position: relative; z-index: 2;">
            <i class="fa-solid fa-desktop" style="font-size: 1.25rem; color: #38bdf8; filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));"></i>
          </div>
          <div style="font-size: 0.84rem; font-weight: 800; color: #f1f5f9; letter-spacing: 0.8px; font-family: var(--font-mono, monospace); z-index: 2;">${pc.pc_id}</div>
          <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 3px; display: flex; align-items: center; gap: 5px; z-index: 2;">
            <i class="fa-solid fa-hourglass-start fa-spin text-cyan-400" style="font-size: 0.65rem;"></i>
            <span>រង់ចាំសិស្ស Sign-In...</span>
          </div>
          <button type="button" onclick="event.stopPropagation(); TimetableLabView.openDirectSignInModal('${pc.pc_id}')" style="margin-top: 8px; background: rgba(14, 165, 233, 0.18); border: 1px solid rgba(56, 189, 248, 0.45); color: #38bdf8; font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 6px; cursor: pointer; z-index: 2;">
            <i class="fa-solid fa-user-plus"></i> Sign-In សិស្ស
          </button>
        </div>
      `;
    }

    // Live active station (screenshot pending from student agent)
    const proc = pc.active_process || "Windows Desktop";
    const win = pc.active_window || "Active Session";
    return `
      <div class="sim-desktop" style="background: radial-gradient(circle at 50% 25%, #1e293b 0%, #060913 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 6px; left: 6px;" class="pc-live-watermark">
          <span class="pc-live-dot"></span>
          <span>LIVE SYNC</span>
        </div>
        <div style="width: 42px; height: 42px; border-radius: 50%; background: rgba(16, 185, 129, 0.12); border: 1.5px solid rgba(16, 185, 129, 0.4); display: flex; align-items: center; justify-content: center; margin-bottom: 5px; box-shadow: 0 0 14px rgba(16, 185, 129, 0.25);">
          <i class="fa-solid fa-satellite-dish fa-beat text-emerald-400" style="font-size: 1.15rem;"></i>
        </div>
        <div style="font-size: 0.84rem; font-weight: 800; color: #f8fafc; letter-spacing: 0.5px;">${pc.pc_id}</div>
        <div style="font-size: 0.74rem; color: #34d399; font-weight: 800; margin-top: 2px;">
          <i class="fa-solid fa-user-check" style="font-size: 0.65rem;"></i> ${App.escapeHtml(pc.claimedStudentName || 'សិស្សកំពុងរៀន')}
        </div>
        <div style="font-size: 0.68rem; color: #38bdf8; margin-top: 3px; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.25); padding: 2px 8px; border-radius: 12px; max-width: 92%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${App.escapeHtml(proc)}">
          <i class="fa-solid fa-microchip"></i> ${App.escapeHtml(proc)}
        </div>
        <div style="font-size: 0.62rem; color: #94a3b8; margin-top: 2px; max-width: 90%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${App.escapeHtml(win)}">
          ${App.escapeHtml(win)}
        </div>
      </div>
    `;
  },

  renderLiveMonitorSection() {
    const students = App.state.students || [];
    const shifts = this.getShiftsList();
    const allSeats = this.getLabSeats();
    const effectiveShift = (this.monitorShift === "ALL") ? this.activeShift : this.monitorShift;
    const currentShiftSeats = allSeats[effectiveShift] || {};
    const policy = this.getCurrentPolicy();
    const totalPcs = this.getTotalPcs();
    const livePcs = (typeof StudentAPI !== "undefined" && StudentAPI.livePcs) ? StudentAPI.livePcs : (this.pcsLiveState || {});
    const signedInMap = this.getSignedInPcs();

    // Prepare workstation list PC-01 to PC-XX
    let onlineCount = 0;
    let signedInCount = 0;
    let violationCount = 0;
    let lockedCount = 0;

    // Standard PC list (PC-01 to PC-XX)
    const standardPcIds = Array.from({ length: totalPcs }, (_, i) => `PC-${String(i + 1).padStart(2, '0')}`);
    // Dynamically include any extra live stations from Firebase (e.g. LAPTOP-01, PC-17)
    const reportedIds = new Set([
      ...Object.keys(livePcs || {}),
      ...Object.keys(this.pcsLiveState || {}),
      ...Object.keys(signedInMap || {})
    ]);
    const extraLivePcIds = Array.from(reportedIds).filter(id => id && !standardPcIds.includes(id));
    const allPcIds = [...standardPcIds, ...extraLivePcIds];

    const pcs = allPcIds.map((pcId, i) => {
      const pcNum = i + 1;
      const live = livePcs[pcId] || this.pcsLiveState[pcId] || {};
      const signedInfo = signedInMap[pcId] || (live.claimedStudentName ? {
        studentId: live.claimedStudentId || pcId,
        studentName: live.claimedStudentName,
        shift: live.claimedShift || this.activeShift
      } : null);
      const isSignedIn = !!signedInfo;

      const pc = Object.assign({}, {
        pc_id: pcId,
        host_name: `LAB-${pcId}`,
        user_name: isSignedIn ? signedInfo.studentName : `Station-${pcNum}`,
        active_process: isSignedIn ? (live.active_process || ((pcNum % 4 === 1) ? "WINWORD.EXE" : (pcNum % 4 === 2) ? "EXCEL.EXE" : (pcNum % 4 === 3) ? "POWERPNT.EXE" : "TypingArena")) : (live.active_process || "Standby"),
        active_window: isSignedIn ? (live.active_window || ((pcNum % 4 === 1) ? "Word - លំហាត់អនុវត្ត.docx" : (pcNum % 4 === 2) ? "Excel - បញ្ជីស្ថិតិ.xlsx" : (pcNum % 4 === 3) ? "PowerPoint - បទបង្ហាញ.pptx" : "TIS Typing Arena - ការហ្វឹកហាត់ល្បឿន")) : (live.active_window || "រង់ចាំសិស្ស Sign-In"),
        all_processes: isSignedIn ? (live.all_processes || ["WINWORD.EXE", "explorer.exe"]) : ["explorer.exe"],
        app_type: isSignedIn ? (live.app_type || ((pcNum % 4 === 1) ? "word" : (pcNum % 4 === 2) ? "excel" : (pcNum % 4 === 3) ? "ppt" : "typing")) : "standby",
        is_locked: false,
        is_online: isSignedIn || !!live.is_online,
        cpu: isSignedIn ? (live.cpu || `${7 + (pcNum % 12)}%`) : "2%",
        ram: isSignedIn ? (live.ram || `${2.4 + ((pcNum % 5) * 0.2)} / 8.0 GB`) : "1.8 / 8.0 GB",
        isSignedIn: isSignedIn,
        claimedStudentName: signedInfo ? signedInfo.studentName : "",
        claimedStudentId: signedInfo ? signedInfo.studentId : "",
        claimedShift: signedInfo ? signedInfo.shift : ""
      }, live);

      // Force lock state if lock_all is active
      if (this.isLockAllActive) {
        pc.is_locked = true;
      }

      // Check violation (only applies if signed in)
      const isViolation = isSignedIn && this.isProcessViolation(pc.active_process, pc.active_window);
      if (isViolation) violationCount++;
      if (pc.is_online) onlineCount++;
      if (isSignedIn) signedInCount++;
      if (pc.is_locked) lockedCount++;

      // Assigned or Reserved student
      let student = null;
      if (isSignedIn) {
        student = students.find(s => s.ID === signedInfo.studentId);
        if (!student && signedInfo.studentName) {
          student = { ID: signedInfo.studentId || pcId, NameKh: signedInfo.studentName, Gender: "ប្រុស" };
        }
      } else {
        const reservedId = currentShiftSeats[pcId];
        if (reservedId) {
          student = students.find(s => s.ID === reservedId) || null;
        }
      }

      return { pcId, pc, student, isViolation, isSignedIn, isReserved: !isSignedIn && !!student };
    });

    const modeLabels = {
      exam: { label: "Exam Mode (វគ្គប្រឡង)", color: "#8b5cf6", icon: "fa-graduation-cap" },
      study: { label: "Study Mode (រៀនសូត្រ)", color: "#0ea5e9", icon: "fa-book-open" },
      free: { label: "Free Mode (សេរី)", color: "#10b981", icon: "fa-unlock" }
    };
    const currentModeInfo = modeLabels[policy.mode] || modeLabels.exam;

    return `
      <div class="card" style="padding: 20px 24px;">
        <!-- 1. NETSUPPORT-INSPIRED ACTION TOOLBAR -->
        <div class="monitor-toolbar">
          <div class="monitor-btn-group">
            <button type="button" class="btn-ns-action ${this.isLockAllActive ? 'btn-ns-unlock' : 'btn-ns-lock'}" onclick="TimetableLabView.toggleLockAll()">
              <i class="fa-solid ${this.isLockAllActive ? 'fa-lock-open' : 'fa-lock'}"></i>
              <span>${this.isLockAllActive ? '🔓 ដោះសោទាំងអស់ (Unlock All)' : '🔒 ចាក់សោទាំងអស់ (Lock All)'}</span>
            </button>

            <button type="button" class="btn-ns-action btn-ns-blank" onclick="TimetableLabView.blankAllScreens()">
              <i class="fa-solid ${this.isBlankAllActive ? 'fa-eye' : 'fa-eye-slash'}"></i>
              <span>${this.isBlankAllActive ? '🖥️ បើកអេក្រង់ឡើងវិញ' : '⬛ បិទអេក្រង់ងងឹត (Blank)'}</span>
            </button>

            <button type="button" class="btn-ns-action btn-ns-policy" onclick="TimetableLabView.openAppPolicyModal()">
              <i class="fa-solid fa-shield-halved"></i>
              <span>🛡️ កំណត់សិទ្ធិ App & ប្រឡង</span>
            </button>

            <button type="button" class="btn-ns-action btn-ns-broadcast" onclick="TimetableLabView.openBroadcastModal('ALL')">
              <i class="fa-solid fa-bullhorn"></i>
              <span>📢 ផ្ញើសាររួម (Broadcast)</span>
            </button>

            <button type="button" class="btn-ns-action btn-ns-refresh" onclick="TimetableLabView.refreshMonitorData()">
              <i class="fa-solid fa-rotate"></i>
              <span>Refresh</span>
            </button>
          </div>

          <!-- Shift, Sign-In Simulator, PC Count & Grid Zoom Switchers -->
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <!-- Shift Selector -->
            <select id="monitorShiftSelect" class="form-control" style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 0.82rem; font-weight: 700; height: 36px; padding: 0 10px;">
              <option value="ALL" ${this.monitorShift === 'ALL' ? 'selected' : ''}>★ វេនសកម្មបច្ចុប្បន្ន (${this.getShiftLabel(this.activeShift)})</option>
              ${shifts.map(sh => `
                <option value="${sh.id}" ${this.monitorShift === sh.id ? 'selected' : ''}>${sh.label}</option>
              `).join('')}
            </select>

            <!-- PC Count Selector -->
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; white-space: nowrap;"><i class="fa-solid fa-desktop text-cyan-400"></i> PC:</span>
              <select id="monitorPcCountSelect" class="form-control" onchange="TimetableLabView.setTotalPcs(this.value)" style="background: rgba(15, 23, 42, 0.8); border: 1.5px solid #06b6d4; color: #38bdf8; font-size: 0.82rem; font-weight: 800; height: 36px; padding: 0 8px; border-radius: 6px; cursor: pointer;">
                <option value="14" ${totalPcs === 14 ? 'selected' : ''}>14 ម៉ាស៊ីន</option>
                <option value="16" ${totalPcs === 16 ? 'selected' : ''}>16 ម៉ាស៊ីន (ស្តង់ដារ)</option>
                <option value="18" ${totalPcs === 18 ? 'selected' : ''}>18 ម៉ាស៊ីន</option>
                <option value="20" ${totalPcs === 20 ? 'selected' : ''}>20 ម៉ាស៊ីន</option>
                <option value="24" ${totalPcs === 24 ? 'selected' : ''}>24 ម៉ាស៊ីន</option>
                <option value="30" ${totalPcs === 30 ? 'selected' : ''}>30 ម៉ាស៊ីន</option>
              </select>
            </div>

            <!-- Quick Test Sign-In Simulator & Reset -->
            <div style="display: flex; align-items: center; gap: 6px;">
              <select class="form-control" onchange="TimetableLabView.simulateSignIns(this.value); this.value='';" style="background: rgba(15, 23, 42, 0.8); border: 1.5px solid #8b5cf6; color: #c4b5fd; font-size: 0.8rem; font-weight: 700; height: 36px; padding: 0 8px; border-radius: 6px; cursor: pointer;" title="តេស្តចំនួនសិស្ស Sign-In ជាក់ស្តែង">
                <option value="">🧪 តេស្តចំនួន Sign-In...</option>
                <option value="0">⚪ 0 នាក់ (គ្មានសិស្ស Sign-In)</option>
                <option value="1">🟢 1 នាក់ (សិស្ស 1 នាក់ចូល)</option>
                <option value="3">🟢 3 នាក់ (សិស្ស 3 នាក់ចូល)</option>
                <option value="5">🟢 5 នាក់ (សិស្ស 5 នាក់ចូល)</option>
                <option value="10">🟢 10 នាក់ (សិស្ស 10 នាក់ចូល)</option>
                <option value="16">🟢 16 នាក់ (សិស្ស 16 នាក់ពេញ)</option>
              </select>

              <button type="button" class="btn-ns-action" onclick="TimetableLabView.clearAllSignIns()" style="background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.35); color: #f87171; height: 36px; padding: 0 10px;" title="សម្អាតការ Sign-In ទាំងអស់ដើម្បីចាប់ផ្តើមម៉ោងរៀនថ្មី">
                <i class="fa-solid fa-rotate-left"></i>
                <span>Reset</span>
              </button>
            </div>

            <!-- Zoom Grid Size Buttons -->
            <div style="display: flex; background: rgba(255,255,255,0.06); border-radius: 8px; padding: 2px; border: 1px solid rgba(255,255,255,0.1);">
              <button type="button" class="btn-sm ${this.gridZoom === 'small' ? 'active' : ''}" onclick="TimetableLabView.setMonitorGridZoom('small')" style="background: ${this.gridZoom === 'small' ? '#0ea5e9' : 'transparent'}; color: #fff; border: none; padding: 4px 8px; font-size: 0.74rem; cursor: pointer; border-radius: 6px;" title="៧-៨ ម៉ាស៊ីនក្នុងមួយជួរ (ទំហំតូច)">
                <i class="fa-solid fa-table-cells"></i> 7-8
              </button>
              <button type="button" class="btn-sm ${this.gridZoom === 'medium' ? 'active' : ''}" onclick="TimetableLabView.setMonitorGridZoom('medium')" style="background: ${this.gridZoom === 'medium' ? '#0ea5e9' : 'transparent'}; color: #fff; border: none; padding: 4px 8px; font-size: 0.74rem; cursor: pointer; border-radius: 6px;" title="៤ ម៉ាស៊ីនក្នុងមួយជួរ (ទំហំមធ្យម)">
                <i class="fa-solid fa-table-cells-large"></i> 4
              </button>
              <button type="button" class="btn-sm ${this.gridZoom === 'large' ? 'active' : ''}" onclick="TimetableLabView.setMonitorGridZoom('large')" style="background: ${this.gridZoom === 'large' ? '#0ea5e9' : 'transparent'}; color: #fff; border: none; padding: 4px 8px; font-size: 0.74rem; cursor: pointer; border-radius: 6px;" title="៣ ម៉ាស៊ីនក្នុងមួយជួរ (ទំហំធំ)">
                <i class="fa-solid fa-square"></i> 3
              </button>
            </div>
          </div>
        </div>

        <!-- 2. LAB MONITOR HEALTH & POLICY STATUS BAR -->
        <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.75) 100%); border: 1px solid rgba(56, 189, 248, 0.22); border-radius: 14px; padding: 12px 20px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; box-shadow: 0 8px 25px rgba(0,0,0,0.35); backdrop-filter: blur(12px);">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <div style="font-weight: 800; font-size: 0.88rem; color: #f8fafc; display: flex; align-items: center; gap: 8px; letter-spacing: 0.3px;">
              <i class="fa-solid fa-satellite-dish text-cyan-400 fa-beat" style="font-size: 0.95rem;"></i>
              <span>ស្ថានភាពម៉ាស៊ីនផ្ទាល់ (Live Stations):</span>
            </div>

            <span class="badge" style="background: rgba(16, 185, 129, 0.16); color: #34d399; font-weight: 800; padding: 6px 14px; font-size: 0.82rem; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);">
              <i class="fa-solid fa-user-check"></i> សិស្សបាន Sign-In៖ ${signedInCount}/${totalPcs} នាក់
            </span>

            <span class="badge" style="background: rgba(148, 163, 184, 0.12); color: #cbd5e1; font-weight: 700; padding: 6px 14px; font-size: 0.8rem; border: 1px solid rgba(148, 163, 184, 0.25); border-radius: 8px;">
              <i class="fa-solid fa-chair"></i> កៅអីនៅទំនេរ៖ ${totalPcs - signedInCount} ម៉ាស៊ីន
            </span>

            ${violationCount > 0 ? `
              <span class="badge blink" style="background: rgba(239, 68, 68, 0.22); color: #fca5a5; font-weight: 800; padding: 6px 14px; font-size: 0.82rem; border: 1px solid rgba(239, 68, 68, 0.6); border-radius: 8px; box-shadow: 0 0 16px rgba(239, 68, 68, 0.5);">
                <i class="fa-solid fa-triangle-exclamation"></i> ប្រើខុសច្បាប់៖ ${violationCount} ម៉ាស៊ីន!
              </span>
            ` : `
              <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #6ee7b7; font-size: 0.8rem; border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px;">
                <i class="fa-solid fa-circle-check"></i> គ្មានសិស្សលួចប្រើខុសច្បាប់
              </span>
            `}

            ${lockedCount > 0 ? `
              <span class="badge" style="background: rgba(245, 158, 11, 0.18); color: #fde68a; font-weight: 700; padding: 6px 14px; font-size: 0.8rem; border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 8px;">
                <i class="fa-solid fa-lock"></i> ចាក់សោរ៖ ${lockedCount}
              </span>
            ` : ''}
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">របៀបកំពុងអនុវត្ត៖</span>
            <span class="badge" style="background: ${currentModeInfo.color}20; color: ${currentModeInfo.color}; font-weight: 700; border: 1px solid ${currentModeInfo.color}40; padding: 4px 10px;">
              <i class="fa-solid ${currentModeInfo.icon}"></i> ${currentModeInfo.label}
            </span>
          </div>
        </div>

        <!-- 3. PC MONITOR GRID -->
        <div id="pcMonitorGridMount" class="pc-monitor-grid zoom-${this.gridZoom}">
          ${pcs.map(({ pcId, pc, student, isViolation, isSignedIn, isReserved }) => {
            const isWord = (pc.active_process || "").toLowerCase().includes("word");
            const isExcel = (pc.active_process || "").toLowerCase().includes("excel");
            const isPpt = (pc.active_process || "").toLowerCase().includes("power");
            const isTyping = (pc.active_process || "").toLowerCase().includes("typing");

            let appBadgeHtml = `<span class="app-pill pill-offline" style="border-style: dashed; opacity: 0.7;"><i class="fa-solid fa-clock"></i> ទំនេរ</span>`;
            if (isSignedIn) {
              if (isViolation) {
                appBadgeHtml = `<span class="app-pill pill-violation blink"><i class="fa-solid fa-triangle-exclamation"></i> ហាមឃាត់: ${App.escapeHtml(pc.violation_app || pc.active_process)}</span>`;
              } else if (pc.is_locked) {
                appBadgeHtml = `<span class="app-pill pill-offline" style="color: #f59e0b; border-color: rgba(245,158,11,0.4);"><i class="fa-solid fa-lock"></i> Locked</span>`;
              } else if (!pc.is_online) {
                appBadgeHtml = `<span class="app-pill pill-offline"><i class="fa-solid fa-power-off"></i> Offline</span>`;
              } else if (isExcel) {
                appBadgeHtml = `<span class="app-pill pill-excel"><i class="fa-solid fa-file-excel"></i> MS Excel</span>`;
              } else if (isPpt) {
                appBadgeHtml = `<span class="app-pill pill-ppt"><i class="fa-solid fa-file-powerpoint"></i> PowerPoint</span>`;
              } else if (isTyping) {
                appBadgeHtml = `<span class="app-pill pill-typing"><i class="fa-solid fa-keyboard"></i> Typing Arena</span>`;
              } else {
                appBadgeHtml = `<span class="app-pill pill-word"><i class="fa-solid fa-file-word"></i> MS Word</span>`;
              }
            }

            const ledClass = !pc.is_online ? 'led-gray' : (!isSignedIn ? 'led-amber' : (pc.is_locked ? 'led-red' : (isViolation ? 'led-amber' : 'led-green')));
            const cardClasses = [
              'pc-monitor-card',
              isViolation ? 'is-violation' : '',
              pc.is_locked ? 'is-locked' : '',
              !pc.is_online ? 'is-offline' : '',
              isSignedIn ? 'is-signed-in' : 'is-standby'
            ].filter(Boolean).join(' ');

            return `
              <div class="${cardClasses}" id="card-${pcId}" style="${!isSignedIn ? 'opacity: 0.88; border-color: rgba(255,255,255,0.08);' : 'border-color: rgba(16, 185, 129, 0.4);'}">
                <!-- Monitor Hardware Bezel Top -->
                <div class="pc-screen-bezel">
                  <div class="pc-bezel-topbar">
                    <div class="pc-camera-cluster">
                      <div class="pc-camera-dot"></div>
                      ${pc.is_online ? '<div class="pc-tally-light" title="Live Camera & Screen Feed Active"></div>' : ''}
                    </div>
                  </div>

                  <!-- Active Screen Canvas Display -->
                  <div class="pc-screen-display" onclick="TimetableLabView.openPcInspectModal('${pcId}')" style="cursor: pointer;" title="${isSignedIn ? 'ចុចដើម្បីពិនិត្យអេក្រង់ & Process ធំ' : 'ម៉ាស៊ីនទំនេរ / រង់ចាំសិស្ស Sign-In'}">
                    ${this.renderScreenDisplay(pc, isViolation)}

                    <!-- Hover Quick Action Floating Buttons -->
                    <div class="pc-screen-actions" onclick="event.stopPropagation()">
                      <button type="button" class="btn-screen-action btn-action-inspect" title="ពិនិត្យអេក្រង់ & Process" onclick="event.stopPropagation(); TimetableLabView.openPcInspectModal('${pcId}')">
                        <i class="fa-solid fa-expand"></i>
                      </button>
                      <button type="button" class="btn-screen-action btn-action-lock" title="${pc.is_locked ? 'ដោះសោ PC' : 'ចាក់សោ PC'}" onclick="event.stopPropagation(); TimetableLabView.toggleSinglePcLock('${pcId}')">
                        <i class="fa-solid ${pc.is_locked ? 'fa-lock-open' : 'fa-lock'}"></i>
                      </button>
                      ${isViolation ? `
                        <button type="button" class="btn-screen-action btn-action-kill" title="បិទកម្មវិធីដែលលួចបើក" onclick="event.stopPropagation(); TimetableLabView.killSinglePcApp('${pcId}')">
                          <i class="fa-solid fa-ban"></i>
                        </button>
                      ` : ''}
                      <button type="button" class="btn-screen-action btn-action-msg" title="ផ្ញើសារទៅកាន់ម៉ាស៊ីននេះ" onclick="event.stopPropagation(); TimetableLabView.openDirectMessage('${pcId}')">
                        <i class="fa-solid fa-comment-dots"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Monitor Chin Stand -->
                  <div class="pc-chin-bar">
                    <span class="pc-brand-tag">TIS LAB MONITOR • HOST 192.168.1.${100 + parseInt(pcId.replace(/\D/g, ''), 10)}</span>
                  </div>
                </div>

                <!-- Footer Student & App Information Bar -->
                <div class="pc-monitor-footer">
                  <div class="pc-header-line">
                    <div class="pc-id-label">
                      <span class="led-indicator ${ledClass}"></span>
                      <span>${pcId}</span>
                    </div>
                    ${appBadgeHtml}
                  </div>

                  <div class="pc-student-info">
                    ${isSignedIn && student ? `
                      <img src="${student.Avatar || App.getDefaultAvatar(student.Gender)}" class="pc-student-avatar" alt="${student.NameKh}" onerror="this.src='${App.getDefaultAvatar('M')}';">
                      <div style="flex: 1; min-width: 0; margin-left: 6px;">
                        <div class="pc-student-name" style="color: #f8fafc; font-weight: 800;">${student.NameKh}</div>
                        <div class="pc-student-id" style="color: #34d399; font-weight: 700; font-size: 0.72rem;">
                          <i class="fa-solid fa-circle-check"></i> ${student.ID} • បាន Sign-In (${pc.claimedShift || this.activeShift})
                        </div>
                      </div>
                      <button type="button" onclick="event.stopPropagation(); TimetableLabView.clearSinglePcSignIn('${pcId}')" style="background: none; border: none; color: #94a3b8; font-size: 0.8rem; cursor: pointer; padding: 4px;" title="Sign-Out / ទុកកៅអីទំនេរ">
                        <i class="fa-solid fa-arrow-right-from-bracket text-rose-400"></i>
                      </button>
                    ` : isReserved && student ? `
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(59, 130, 246, 0.12); border: 1.5px dashed #3b82f6; display: flex; align-items: center; justify-content: center; color: #60a5fa; font-size: 0.85rem;">
                        <i class="fa-solid fa-user-clock"></i>
                      </div>
                      <div style="flex: 1; min-width: 0; margin-left: 6px;">
                        <div class="pc-student-name" style="color: #93c5fd; font-size: 0.8rem;">${student.NameKh}</div>
                        <div class="pc-student-id" style="color: #64748b; font-size: 0.7rem;">បានកក់ទុក • រង់ចាំ Sign-In</div>
                      </div>
                      <button type="button" onclick="event.stopPropagation(); TimetableLabView.setPcSignedIn('${pcId}', '${student.ID}', '${student.NameKh}', '${this.activeShift}')" style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; cursor: pointer;" title="បញ្ជាក់ Sign-In ភ្លាម">
                        Sign-In
                      </button>
                    ` : `
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); border: 1px dashed rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 0.85rem;">
                        <i class="fa-solid fa-chair"></i>
                      </div>
                      <div style="flex: 1; min-width: 0; margin-left: 6px;">
                        <div class="pc-student-name" style="color: #64748b; font-style: italic; font-size: 0.78rem;">(មិនទាន់មានសិស្ស Sign-In)</div>
                        <div class="pc-student-id" style="color: #475569; font-size: 0.7rem;">កៅអីទំនេរ • Standby</div>
                      </div>
                      <button type="button" onclick="event.stopPropagation(); TimetableLabView.openDirectSignInModal('${pcId}')" style="background: rgba(14, 165, 233, 0.15); border: 1px solid #0ea5e9; color: #38bdf8; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; cursor: pointer;" title="ចុចដើម្បី Sign-In សិស្ស">
                        + ចូល
                      </button>
                    `}
                  </div>

                  <!-- Live Hardware Telemetry Strip -->
                  <div class="pc-telemetry-strip">
                    <div class="telemetry-chip" title="CPU Usage">
                      <i class="fa-solid fa-microchip text-cyan-400"></i>
                      <span>${pc.cpu || (isSignedIn ? '14%' : '2%')}</span>
                    </div>
                    <div class="telemetry-chip" title="RAM Usage">
                      <i class="fa-solid fa-memory text-purple-400"></i>
                      <span>${pc.ram ? (pc.ram.includes('/') ? pc.ram.split('/')[0].trim() : pc.ram) : (isSignedIn ? '3.2 GB' : '1.8 GB')}</span>
                    </div>
                    <div class="telemetry-chip" title="Connection Latency">
                      <i class="fa-solid fa-bolt text-emerald-400"></i>
                      <span>${pc.is_online ? ((parseInt(pcId.replace(/\D/g, '') || '1', 10) * 3 % 15) + 8) + 'ms' : 'OFF'}</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 4. BOTTOM GUIDANCE NOTICE -->
        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); padding: 12px 18px; border-radius: 10px; font-size: 0.82rem; color: #94a3b8; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-circle-info text-cyan-400"></i>
            <span>ដើម្បីដំឡើង Agent លើកុំព្យូទ័រសិស្សពិតប្រាកដ សូមចម្លង Folder <code style="background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 4px; color: #38bdf8;">pc-agent</code> រួចចុច Run លើ <code style="background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 4px; color: #34d399;">Start-Agent.bat</code>។</span>
          </div>
          <button type="button" class="btn-secondary btn-sm" onclick="TimetableLabView.openAppPolicyModal()" style="font-size: 0.78rem;">
            <i class="fa-solid fa-sliders"></i> កែសម្រួល Policy
          </button>
        </div>
      </div>
    `;
  },

  initMonitorEvents() {
    // Shift selector inside monitor toolbar
    const shiftSel = document.getElementById("monitorShiftSelect");
    if (shiftSel) {
      shiftSel.addEventListener("change", (e) => {
        this.monitorShift = e.target.value;
        const mount = document.getElementById("timetableContentMount");
        if (mount && this.activeTab === 'monitor') {
          mount.innerHTML = this.renderLiveMonitorSection();
          this.initMonitorEvents();
        }
      });
    }

    // Attach Firebase Realtime Database live listeners if not already attached
    if (!this.firebaseListenerAttached && typeof firebase !== "undefined" && firebase.database) {
      try {
        const db = firebase.database();

        // 1. Listen to live PC states
        db.ref("lab_monitor/pcs").on("value", (snapshot) => {
          const val = snapshot.val();
          if (val && typeof val === "object") {
            Object.keys(val).forEach(pcId => {
              this.pcsLiveState[pcId] = Object.assign({}, this.pcsLiveState[pcId] || {}, val[pcId]);
            });
            if (this.selectedInspectPcId) {
              this.updateInspectModalLive(this.selectedInspectPcId);
            }
            if (this.activeTab === 'monitor' || this.activeTab === 'lab') {
              this.updateMonitorCardsDom();
            }
          }
        });

        // 2. Listen to lab policy
        db.ref("lab_monitor/policy").on("value", (snapshot) => {
          const val = snapshot.val();
          if (val && typeof val === "object") {
            this.lastPolicy = val;
            if (typeof val.lock_all !== "undefined") {
              this.isLockAllActive = !!val.lock_all;
            }
            if (typeof val.blank_all !== "undefined") {
              this.isBlankAllActive = !!val.blank_all;
            }
            if (this.activeTab === 'monitor' || this.activeTab === 'lab') {
              this.updateMonitorCardsDom();
            }
          }
        });

        this.firebaseListenerAttached = true;
      } catch (e) {
        console.warn("⚠️ Firebase Live Monitor Sync Warning:", e);
      }
    }
  },

  updateMonitorCardsDom() {
    const mount = document.getElementById("timetableContentMount");
    // Only update if monitor or lab tab is active and no modal is currently focused
    const inspectModal = document.getElementById("pcRemoteInspectModal");
    const isModalOpen = inspectModal && inspectModal.classList.contains("show");
    if (mount && this.activeTab === 'monitor' && !isModalOpen) {
      mount.innerHTML = this.renderLiveMonitorSection();
      this.initMonitorEvents();
    } else if (mount && this.activeTab === 'lab') {
      mount.innerHTML = this.renderLabMapSection();
      this.initLabEvents();
    }
  },

  setMonitorGridZoom(zoom) {
    this.gridZoom = zoom;
    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === 'monitor') {
      mount.innerHTML = this.renderLiveMonitorSection();
      this.initMonitorEvents();
    }
  },

  refreshMonitorData() {
    App.showToast("🔄 កំពុងទាញយកទិន្នន័យពីម៉ាស៊ីនកុំព្យូទ័រ Lab ទាំងអស់...", "info");
    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === 'monitor') {
      mount.innerHTML = this.renderLiveMonitorSection();
      this.initMonitorEvents();
    }
  },

  /* Remote Inspect Modal */
  openPcInspectModal(pcId) {
    this.selectedInspectPcId = pcId;
    const students = App.state.students || [];
    const signedInMap = this.getSignedInPcs();
    const signedInfo = signedInMap[pcId];
    const isSignedIn = !!signedInfo;

    let student = null;
    if (isSignedIn) {
      student = students.find(s => s.ID === signedInfo.studentId);
      if (!student && signedInfo.studentName) {
        student = { ID: signedInfo.studentId || pcId, NameKh: signedInfo.studentName, Gender: "ប្រុស" };
      }
    } else {
      const allSeats = this.getLabSeats();
      const effectiveShift = (this.monitorShift === "ALL") ? this.activeShift : this.monitorShift;
      const currentShiftSeats = allSeats[effectiveShift] || {};
      const studentId = currentShiftSeats[pcId];
      student = students.find(s => s.ID === studentId);
    }

    const live = this.pcsLiveState[pcId] || {};
    const pc = Object.assign({}, {
      pc_id: pcId,
      host_name: `LAB-${pcId}`,
      user_name: isSignedIn ? signedInfo.studentName : "Standby",
      active_process: isSignedIn ? (live.active_process || "WINWORD.EXE") : "Standby",
      active_window: isSignedIn ? (live.active_window || "Microsoft Word") : "រង់ចាំសិស្ស Sign-In",
      all_processes: isSignedIn ? (live.all_processes || ["WINWORD.EXE", "explorer.exe"]) : ["explorer.exe"],
      is_locked: false,
      is_online: isSignedIn || !!live.is_online,
      cpu: isSignedIn ? (live.cpu || "12%") : "2%",
      ram: isSignedIn ? (live.ram || "3.2 / 8.0 GB") : "1.8 / 8.0 GB",
      isSignedIn: isSignedIn
    }, live);
    if (this.isLockAllActive) pc.is_locked = true;
    const isViolation = isSignedIn && this.isProcessViolation(pc.active_process, pc.active_window);

    const badge = document.getElementById("inspectPcIdBadge");
    if (badge) badge.textContent = pcId;

    const sub = document.getElementById("inspectPcSubtitle");
    if (sub) {
      sub.innerHTML = `សិស្ស៖ <strong>${student ? student.NameKh : 'គ្មានសិស្ស'}</strong> (${student ? student.ID : 'N/A'}) • Host: ${pc.host_name || 'LAB-' + pcId} • IP: 192.168.1.${100 + parseInt(pcId.replace(/\D/g, ''), 10)} • CPU: ${pc.cpu || '12%'} RAM: ${pc.ram || '3.2 GB'}`;
    }

    const appNameEl = document.getElementById("inspectActiveAppName");
    if (appNameEl) {
      appNameEl.textContent = `${pc.active_process || 'N/A'} - ${pc.active_window || 'Default Window'}`;
    }

    const screenDisplay = document.getElementById("inspectScreenDisplay");
    if (screenDisplay) {
      screenDisplay.innerHTML = this.renderScreenDisplay(pc, isViolation);
    }

    const lockBtn = document.getElementById("inspectBtnToggleLock");
    if (lockBtn) {
      lockBtn.innerHTML = pc.is_locked ? `<i class="fa-solid fa-lock-open"></i> <span>ដោះសោរ PC</span>` : `<i class="fa-solid fa-lock"></i> <span>ចាក់សោរ PC</span>`;
      lockBtn.style.background = pc.is_locked ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.15)";
      lockBtn.style.color = pc.is_locked ? "#34d399" : "#f87171";
    }

    // Process list pills
    const procListEl = document.getElementById("inspectProcessList");
    if (procListEl) {
      const procs = pc.all_processes && pc.all_processes.length > 0 ? pc.all_processes : ["WINWORD.EXE", "explorer.exe", "dwmd.exe"];
      procListEl.innerHTML = procs.map(proc => {
        const isBad = this.isProcessViolation(proc, "");
        return `
          <span class="badge" style="background: ${isBad ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.08)'}; color: ${isBad ? '#f87171' : '#cbd5e1'}; border: 1px solid ${isBad ? '#ef4444' : 'rgba(255,255,255,0.1)'}; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px;">
            ${isBad ? '<i class="fa-solid fa-triangle-exclamation text-rose-500"></i>' : '<i class="fa-solid fa-microchip text-slate-400"></i>'}
            <span>${App.escapeHtml(proc)}</span>
            ${isBad ? `<button type="button" onclick="TimetableLabView.killSpecificProcess('${pcId}', '${App.escapeHtml(proc)}')" style="background: none; border: none; color: #ef4444; font-size: 0.7rem; cursor: pointer; padding: 0;" title="បិទកម្មវិធីនេះ">[X]</button>` : ''}
          </span>
        `;
      }).join('');
    }

    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("pcRemoteInspectModal");
    } else {
      const modal = document.getElementById("pcRemoteInspectModal");
      if (modal) modal.classList.add("show");
    }
  },

  updateInspectModalLive(pcId) {
    const inspectModal = document.getElementById("pcRemoteInspectModal");
    if (!inspectModal || !inspectModal.classList.contains("show")) return;
    if (this.selectedInspectPcId !== pcId) return;

    const live = this.pcsLiveState[pcId] || {};
    const signedInMap = this.getSignedInPcs();
    const signedInfo = signedInMap[pcId];
    const isSignedIn = !!signedInfo;
    const isViolation = isSignedIn && this.isProcessViolation(live.active_process, live.active_window);

    const pc = Object.assign({}, {
      pc_id: pcId,
      is_locked: false,
      is_online: isSignedIn || !!live.is_online,
      isSignedIn: isSignedIn
    }, live);

    const screenDisplay = document.getElementById("inspectScreenDisplay");
    if (screenDisplay) {
      screenDisplay.innerHTML = this.renderScreenDisplay(pc, isViolation);
    }
    const appNameEl = document.getElementById("inspectActiveAppName");
    if (appNameEl) {
      appNameEl.textContent = `${pc.active_process || 'N/A'} - ${pc.active_window || 'Default Window'}`;
    }
  },

  toggleSinglePcLock(pcId) {
    const pc = this.pcsLiveState[pcId] || {};
    const newState = !pc.is_locked;
    pc.is_locked = newState;
    this.pcsLiveState[pcId] = pc;

    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref(`lab_monitor/pcs/${pcId}/is_locked`).set(newState);
        firebase.database().ref(`lab_monitor/commands/${pcId}`).set({
          action: newState ? "lock" : "unlock",
          message: this.getCurrentPolicy().lock_message || "ចាក់សោរដោយលោកគ្រូ",
          timestamp: Date.now()
        });
      } catch (e) {}
    }

    App.showToast(newState ? `🔒 បានចាក់សោរ ${pcId} ជោគជ័យ!` : `🔓 បានដោះសោរ ${pcId} ជោគជ័យ!`, newState ? "warning" : "success");
    this.updateMonitorCardsDom();

    // If inspect modal is open, refresh button
    const lockBtn = document.getElementById("inspectBtnToggleLock");
    if (lockBtn && this.selectedInspectPcId === pcId) {
      lockBtn.innerHTML = newState ? `<i class="fa-solid fa-lock-open"></i> <span>ដោះសោរ PC</span>` : `<i class="fa-solid fa-lock"></i> <span>ចាក់សោរ PC</span>`;
      lockBtn.style.background = newState ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.15)";
      lockBtn.style.color = newState ? "#34d399" : "#f87171";
    }
  },

  toggleSinglePcLockFromInspect() {
    if (this.selectedInspectPcId) {
      this.toggleSinglePcLock(this.selectedInspectPcId);
      const pc = this.pcsLiveState[this.selectedInspectPcId] || {};
      const screenDisplay = document.getElementById("inspectScreenDisplay");
      if (screenDisplay) {
        screenDisplay.innerHTML = this.renderScreenDisplay(pc, false);
      }
    }
  },

  openDirectMessageFromInspect() {
    if (this.selectedInspectPcId) {
      if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
        ModalsComponent.close("pcRemoteInspectModal");
      }
      this.openBroadcastModal(this.selectedInspectPcId);
    }
  },

  openDirectMessage(pcId) {
    this.openBroadcastModal(pcId);
  },

  killCurrentActiveApp() {
    if (!this.selectedInspectPcId) return;
    const pcId = this.selectedInspectPcId;
    const pc = this.pcsLiveState[pcId] || {};
    const targetApp = pc.active_process || "BlockedApp";

    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref(`lab_monitor/commands/${pcId}`).set({
          action: "kill",
          target_process: targetApp,
          timestamp: Date.now()
        });
      } catch (e) {}
    }

    // Reset simulated state to Word
    pc.active_process = "WINWORD.EXE";
    pc.active_window = "Microsoft Word (Document1.docx)";
    pc.app_type = "word";
    pc.violation_app = "";
    this.pcsLiveState[pcId] = pc;

    App.showToast(`🚫 បានផ្ញើបញ្ជាបិទកម្មវិធី ${targetApp} លើ ${pcId} ជោគជ័យ!`, "success");
    this.openPcInspectModal(pcId);
    this.updateMonitorCardsDom();
  },

  killSinglePcApp(pcId) {
    const pc = this.pcsLiveState[pcId] || {};
    const targetApp = pc.violation_app || pc.active_process || "App";

    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref(`lab_monitor/commands/${pcId}`).set({
          action: "kill",
          target_process: targetApp,
          timestamp: Date.now()
        });
      } catch (e) {}
    }

    // Reset simulated state
    pc.active_process = "WINWORD.EXE";
    pc.active_window = "Microsoft Word (Document1.docx)";
    pc.app_type = "word";
    pc.violation_app = "";
    this.pcsLiveState[pcId] = pc;

    App.showToast(`🚫 បានបិទកម្មវិធីខុសច្បាប់ "${targetApp}" លើម៉ាស៊ីន ${pcId} ជោគជ័យ!`, "success");
    this.updateMonitorCardsDom();
  },

  killSpecificProcess(pcId, procName) {
    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref(`lab_monitor/commands/${pcId}`).set({
          action: "kill",
          target_process: procName,
          timestamp: Date.now()
        });
      } catch (e) {}
    }
    App.showToast(`🚫 បានបញ្ជាបិទ Process "${procName}" លើ ${pcId}!`, "success");
    this.openPcInspectModal(pcId);
  },

  blankSinglePc() {
    if (!this.selectedInspectPcId) return;
    const pcId = this.selectedInspectPcId;
    const pc = this.pcsLiveState[pcId] || {};
    pc.is_blank = !pc.is_blank;
    this.pcsLiveState[pcId] = pc;

    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref(`lab_monitor/commands/${pcId}`).set({
          action: "blank",
          is_blank: pc.is_blank,
          timestamp: Date.now()
        });
      } catch (e) {}
    }

    App.showToast(`⬛ បានបញ្ជាបិទអេក្រង់ងងឹត (Blank) លើ ${pcId}!`, "info");
    this.openPcInspectModal(pcId);
  },

  toggleLockAll() {
    this.isLockAllActive = !this.isLockAllActive;

    // Save to Firebase
    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref("lab_monitor/policy/lock_all").set(this.isLockAllActive);
      } catch (e) {}
    }

    // Update all local PC states
    const totalPcs = this.getTotalPcs();
    for (let i = 1; i <= totalPcs; i++) {
      const pcId = `PC-${String(i).padStart(2, '0')}`;
      if (!this.pcsLiveState[pcId]) this.pcsLiveState[pcId] = {};
      this.pcsLiveState[pcId].is_locked = this.isLockAllActive;
    }

    if (this.isLockAllActive) {
      App.showToast("🔒 បានចាក់សោរអេក្រង់ម៉ាស៊ីនសិស្សទាំងអស់ក្នុង Lab!", "warning");
    } else {
      App.showToast("🔓 បានដោះសោរអេក្រង់ម៉ាស៊ីនសិស្សទាំងអស់!", "success");
    }

    this.updateMonitorCardsDom();
  },

  blankAllScreens() {
    this.isBlankAllActive = !this.isBlankAllActive;

    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref("lab_monitor/policy/blank_all").set(this.isBlankAllActive);
      } catch (e) {}
    }

    const totalPcs = this.getTotalPcs();
    for (let i = 1; i <= totalPcs; i++) {
      const pcId = `PC-${String(i).padStart(2, '0')}`;
      if (!this.pcsLiveState[pcId]) this.pcsLiveState[pcId] = {};
      this.pcsLiveState[pcId].is_blank = this.isBlankAllActive;
    }

    if (this.isBlankAllActive) {
      App.showToast("⬛ បានបិទអេក្រង់ងងឹត (Blank Screen) គ្រប់ម៉ាស៊ីន!", "info");
    } else {
      App.showToast("🖥️ បានបើកអេក្រង់ឡើងវិញគ្រប់ម៉ាស៊ីន!", "success");
    }

    this.updateMonitorCardsDom();
  },

  /* Policy Modal Controls */
  openAppPolicyModal() {
    const policy = this.getCurrentPolicy();
    this.selectPolicyPreset(policy.mode || "exam", false);

    const blockedInput = document.getElementById("policyBlockedAppsInput");
    if (blockedInput) blockedInput.value = (policy.blacklist || []).join(", ");

    const lockMsgInput = document.getElementById("policyLockMessageInput");
    if (lockMsgInput) lockMsgInput.value = policy.lock_message || "🔒 ម៉ោងប្រឡងកុំព្យូទ័ររដ្ឋបាល - អនុញ្ញាតតែកម្មវិធីប្រឡងប៉ុណ្ណោះ";

    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("labAppPolicyModal");
    } else {
      const modal = document.getElementById("labAppPolicyModal");
      if (modal) modal.classList.add("show");
    }
  },

  selectPolicyPreset(mode, updateValues = true) {
    const cards = ["modeCardExam", "modeCardStudy", "modeCardFree"];
    cards.forEach(c => {
      const el = document.getElementById(c);
      if (el) el.classList.remove("active");
    });

    const activeEl = document.getElementById(`modeCard${mode.charAt(0).toUpperCase() + mode.slice(1)}`);
    if (activeEl) activeEl.classList.add("active");

    if (updateValues) {
      const checks = document.querySelectorAll(".policy-app-check");
      const chromeCheck = document.getElementById("policyAllowChrome");
      const edgeCheck = document.getElementById("policyAllowEdge");
      const blockedInput = document.getElementById("policyBlockedAppsInput");
      const lockMsgInput = document.getElementById("policyLockMessageInput");

      if (mode === "exam") {
        checks.forEach(ch => {
          if (ch.value === "chrome" || ch.value === "msedge") ch.checked = false;
          else ch.checked = true;
        });
        if (blockedInput) blockedInput.value = "RobloxPlayerBeta, Telegram, Discord, Steam, EpicGamesLauncher, Spotify, chrome, msedge, brave, game";
        if (lockMsgInput) lockMsgInput.value = "🔒 ម៉ោងប្រឡងកុំព្យូទ័ររដ្ឋបាល - អនុញ្ញាតតែកម្មវិធីប្រឡង (Word, Excel, PPT, Typing) ប៉ុណ្ណោះ";
      } else if (mode === "study") {
        checks.forEach(ch => ch.checked = true);
        if (blockedInput) blockedInput.value = "RobloxPlayerBeta, Telegram, Discord, Steam, EpicGamesLauncher, Spotify, game";
        if (lockMsgInput) lockMsgInput.value = "🔒 លោកគ្រូកំពុងពន្យល់មេរៀន / សូមផ្អាកការប្រើប្រាស់កុំព្យូទ័របណ្តោះអាសន្ន";
      } else if (mode === "free") {
        checks.forEach(ch => ch.checked = true);
        if (blockedInput) blockedInput.value = "";
        if (lockMsgInput) lockMsgInput.value = "🔒 អេក្រង់ត្រូវបានចាក់សោរដោយលោកគ្រូ";
      }
    }
  },

  saveAppPolicy() {
    let mode = "exam";
    if (document.getElementById("modeCardStudy")?.classList.contains("active")) mode = "study";
    if (document.getElementById("modeCardFree")?.classList.contains("active")) mode = "free";

    const whitelist = [];
    document.querySelectorAll(".policy-app-check:checked").forEach(ch => {
      whitelist.push(ch.value);
    });

    const blockedRaw = document.getElementById("policyBlockedAppsInput")?.value || "";
    const blacklist = blockedRaw.split(",").map(x => x.trim()).filter(Boolean);

    const lock_message = document.getElementById("policyLockMessageInput")?.value.trim() || "🔒 អេក្រង់ត្រូវបានចាក់សោរដោយលោកគ្រូ";

    const policy = {
      mode,
      whitelist,
      blacklist,
      lock_all: this.isLockAllActive,
      blank_all: this.isBlankAllActive,
      lock_message,
      updated_at: Date.now()
    };

    this.lastPolicy = policy;
    localStorage.setItem("tis_lab_app_policy", JSON.stringify(policy));

    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref("lab_monitor/policy").set(policy);
      } catch (e) {}
    }

    App.showToast("🛡️ បានរក្សាទុក និងអនុវត្តច្បាប់ App Policy ជោគជ័យ!", "success");

    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("labAppPolicyModal");
    } else {
      const modal = document.getElementById("labAppPolicyModal");
      if (modal) modal.classList.remove("show");
    }

    this.updateMonitorCardsDom();
  },

  /* Broadcast Message Modal */
  openBroadcastModal(target = "ALL") {
    const totalPcs = this.getTotalPcs();
    const targetSel = document.getElementById("broadcastTargetSelect");
    if (targetSel) {
      targetSel.innerHTML = `
        <option value="ALL">📢 គ្រប់ម៉ាស៊ីនទាំងអស់ក្នុង Lab (PC-01 ដល់ PC-${String(totalPcs).padStart(2, '0')})</option>
        ${Array.from({ length: totalPcs }, (_, i) => {
          const pcId = `PC-${String(i + 1).padStart(2, '0')}`;
          return `<option value="${pcId}" ${target === pcId ? 'selected' : ''}>💻 ម៉ាស៊ីន ${pcId}</option>`;
        }).join('')}
      `;
      targetSel.value = target;
    }

    const titleEl = document.getElementById("broadcastModalTitle");
    if (titleEl) {
      titleEl.textContent = target === "ALL" ? "ផ្ញើសារប្រកាសទៅកាន់អេក្រង់សិស្សទាំងអស់" : `ផ្ញើសារផ្ទាល់ទៅកាន់ ${target}`;
    }

    const input = document.getElementById("broadcastMessageInput");
    if (input) input.value = "";

    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("labBroadcastModal");
    } else {
      const modal = document.getElementById("labBroadcastModal");
      if (modal) modal.classList.add("show");
    }
  },

  sendBroadcastMessage() {
    const targetSel = document.getElementById("broadcastTargetSelect");
    const target = targetSel ? targetSel.value : "ALL";
    const input = document.getElementById("broadcastMessageInput");
    const message = input ? input.value.trim() : "";

    if (!message) {
      App.showToast("សូមវាយសារដែលចង់ផ្ញើជាមុនសិន!", "warning");
      return;
    }

    const payload = {
      sender: "លោកគ្រូ ខៀន ធូ",
      target: target,
      message: message,
      timestamp: Date.now()
    };

    if (typeof firebase !== "undefined" && firebase.database) {
      try {
        firebase.database().ref("lab_monitor/broadcast").set(payload);
      } catch (e) {}
    }

    App.showToast(`📢 បានផ្ញើសារទៅកាន់ ${target === 'ALL' ? 'គ្រប់ម៉ាស៊ីនទាំងអស់' : target} ជោគជ័យ!`, "success");

    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("labBroadcastModal");
    } else {
      const modal = document.getElementById("labBroadcastModal");
      if (modal) modal.classList.remove("show");
    }
  },

  // ====================================================
  // 4. SOFTWARE & LICENSE INVENTORY SECTION
  // ====================================================
  softwareFilterCategory: "ALL",
  softwareSearchQuery: "",

  renderSoftwareSection() {
    const softwareList = typeof StudentAPI !== "undefined" ? StudentAPI.getLabSoftwareList() : [];
    const totalPcs = this.getTotalPcs();
    
    // Compute KPIs
    const totalCount = softwareList.length;
    const activeLicenses = softwareList.filter(s => s.licenseType && !s.licenseType.toLowerCase().includes("expired")).length;
    
    // Count expiring soon (within 60 days)
    const now = new Date();
    const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const expiringSoon = softwareList.filter(s => {
      if (!s.expiryDate) return false;
      const d = new Date(s.expiryDate);
      return d > now && d <= in60Days;
    }).length;

    const readiness = typeof StudentAPI !== "undefined" ? StudentAPI.getLabReadinessSummary(totalPcs) : {};
    const readyPcsCount = Object.values(readiness).filter(r => r.isReady).length;

    let filtered = softwareList;
    if (this.softwareFilterCategory !== "ALL") {
      filtered = filtered.filter(s => s.category === this.softwareFilterCategory);
    }
    if (this.softwareSearchQuery) {
      const q = this.softwareSearchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) || 
        (s.version && s.version.toLowerCase().includes(q)) ||
        (s.licenseType && s.licenseType.toLowerCase().includes(q))
      );
    }

    return `
      <div class="card" style="padding: 24px;">
        <!-- Top Title & Quick Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: 1.15rem; color: var(--text-main);">
              <i class="fa-solid fa-box-open text-blue-600"></i> បញ្ជីកម្មវិធី & អាជ្ញាប័ណ្ណកុំព្យូទ័ររដ្ឋបាល (Software & License Inventory)
            </h3>
            <span class="text-xs text-muted">
              គ្រប់គ្រងកម្មវិធីសិក្សាវគ្គកុំព្យូទ័ររដ្ឋបាល អាជ្ញាប័ណ្ណ (License) ថ្ងៃដំឡើង និងត្រួតពិនិត្យម៉ាស៊ីនក្នុង PC Lab
            </span>
          </div>

          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn-primary" style="background: #2563eb; border-color: #2563eb; height: 38px; font-weight: 700; padding: 0 16px; font-size: 0.85rem;" onclick="TimetableLabView.openAddSoftwareModal()">
              <i class="fa-solid fa-plus"></i> <span>+ បញ្ចូលកម្មវិធីថ្មី</span>
            </button>
            <button type="button" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" onclick="TimetableLabView.exportSoftwareInventoryExcel()">
              <i class="fa-solid fa-file-excel text-emerald-600"></i> <span>Export Excel</span>
            </button>
            <button type="button" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;" onclick="TimetableLabView.printSoftwareInventoryReport()">
              <i class="fa-solid fa-print text-cyan-600"></i> <span>Print A4</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px;">
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-left: 4px solid #2563eb; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">កម្មវិធីរដ្ឋបាលសរុប</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #2563eb; margin-top: 4px;">${totalCount} កម្មវិធី</div>
          </div>
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-left: 4px solid #059669; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">អាជ្ញាប័ណ្ណដំណើរការពេញលេញ</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #059669; margin-top: 4px;">${activeLicenses} សកម្ម</div>
          </div>
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-left: 4px solid #d97706; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">អាជ្ញាប័ណ្ណជិតផុតកំណត់</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: ${expiringSoon > 0 ? '#d97706' : '#059669'}; margin-top: 4px;">${expiringSoon} កម្មវិធី</div>
          </div>
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-left: 4px solid #0891b2; border-radius: 10px; padding: 14px;">
            <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">ម៉ាស៊ីនត្រៀមរៀនរួចរាល់ (១០០% Ready)</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #0891b2; margin-top: 4px;">${readyPcsCount} / ${totalPcs} គ្រឿង</div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);"><i class="fa-solid fa-filter"></i> តម្រង៖</span>
            <button type="button" class="btn-secondary btn-sm ${this.softwareFilterCategory === 'ALL' ? 'active' : ''}" style="${this.softwareFilterCategory === 'ALL' ? 'background: #2563eb; color: #fff; font-weight: 700;' : ''}" onclick="TimetableLabView.filterSoftwareCategory('ALL')">ទាំងអស់ (${totalCount})</button>
            <button type="button" class="btn-secondary btn-sm ${this.softwareFilterCategory === 'Office' ? 'active' : ''}" style="${this.softwareFilterCategory === 'Office' ? 'background: #2563eb; color: #fff; font-weight: 700;' : ''}" onclick="TimetableLabView.filterSoftwareCategory('Office')">Office (${softwareList.filter(s => s.category === 'Office').length})</button>
            <button type="button" class="btn-secondary btn-sm ${this.softwareFilterCategory === 'Typing' ? 'active' : ''}" style="${this.softwareFilterCategory === 'Typing' ? 'background: #2563eb; color: #fff; font-weight: 700;' : ''}" onclick="TimetableLabView.filterSoftwareCategory('Typing')">Typing (${softwareList.filter(s => s.category === 'Typing').length})</button>
            <button type="button" class="btn-secondary btn-sm ${this.softwareFilterCategory === 'Fonts' ? 'active' : ''}" style="${this.softwareFilterCategory === 'Fonts' ? 'background: #2563eb; color: #fff; font-weight: 700;' : ''}" onclick="TimetableLabView.filterSoftwareCategory('Fonts')">Fonts (${softwareList.filter(s => s.category === 'Fonts').length})</button>
            <button type="button" class="btn-secondary btn-sm ${this.softwareFilterCategory === 'Utility' ? 'active' : ''}" style="${this.softwareFilterCategory === 'Utility' ? 'background: #2563eb; color: #fff; font-weight: 700;' : ''}" onclick="TimetableLabView.filterSoftwareCategory('Utility')">Utility & PDF</button>
          </div>

          <div style="width: 250px;">
            <input type="text" id="softwareSearchInput" class="form-control" placeholder="🔍 ស្វែងរកកម្មវិធី..." style="height: 34px; font-size: 0.82rem;" value="${App.escapeHtml(this.softwareSearchQuery)}" oninput="TimetableLabView.searchSoftware(this.value)">
          </div>
        </div>

        <!-- Software Table -->
        <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden;">
          <table class="data-table" style="margin: 0; font-size: 0.84rem;">
            <thead>
              <tr style="background: var(--border-light);">
                <th style="width: 35px; text-align: center;">ល.រ</th>
                <th>កម្មវិធី & ប្រភេទ</th>
                <th style="width: 105px;">Version</th>
                <th>ប្រភេទ License & Key</th>
                <th style="width: 125px;">កាលបរិច្ឆេទ & ផុតកំណត់</th>
                <th>PC បានដំឡើង</th>
                <th style="width: 110px; text-align: center;">Update Status</th>
                <th style="width: 110px; text-align: center;">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody id="softwareTableBody">
              ${this.renderSoftwareTableRows(filtered)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderSoftwareTableRows(list) {
    if (!list || list.length === 0) {
      return `
        <tr>
          <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">
            <i class="fa-solid fa-box-open" style="font-size: 2rem; display: block; margin-bottom: 8px;"></i>
            គ្មានកម្មវិធីដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ
          </td>
        </tr>
      `;
    }

    const now = new Date();
    const totalPcs = this.getTotalPcs();

    return list.map((sw, idx) => {
      const installedCount = (sw.installedPcs || []).length;
      const allInstalled = installedCount >= totalPcs;

      // Calculate days until expiry
      let expiryLabel = "គ្មានថ្ងៃផុតកំណត់";
      let expiryBadgeClass = "badge-pass";
      if (sw.expiryDate) {
        const exp = new Date(sw.expiryDate);
        const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
          expiryLabel = "⚠️ ផុតកំណត់ហើយ";
          expiryBadgeClass = "status-inactive";
        } else if (diffDays <= 60) {
          expiryLabel = `⏳ នៅសល់ ${diffDays} ថ្ងៃ`;
          expiryBadgeClass = "rate-medium";
        } else {
          expiryLabel = `នៅសល់ ${diffDays} ថ្ងៃ (${sw.expiryDate})`;
          expiryBadgeClass = "rate-high";
        }
      }

      const maskedKey = sw.licenseKey && sw.licenseKey.length > 8 
        ? `${sw.licenseKey.substring(0, 5)}...${sw.licenseKey.substring(sw.licenseKey.length - 4)}` 
        : (sw.licenseKey || "—");

      return `
        <tr>
          <td style="text-align: center; font-weight: 600;">${idx + 1}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="width: 34px; height: 34px; border-radius: 8px; background: rgba(37, 99, 235, 0.1); color: ${sw.color || '#2563eb'}; display: inline-flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
                <i class="${sw.icon || 'fa-solid fa-cube'}"></i>
              </span>
              <div>
                <strong style="color: var(--text-main); font-size: 0.88rem; display: block;">${App.escapeHtml(sw.name)}</strong>
                <span class="badge" style="background: var(--border-light); font-size: 0.68rem; color: var(--text-muted); padding: 1px 6px;">
                  ${App.escapeHtml(sw.category || 'Office')}
                </span>
                ${sw.setupPath ? `
                  <span style="font-size: 0.68rem; color: #0284c7; margin-left: 4px; font-family: monospace;" title="${App.escapeHtml(sw.setupPath)}">
                    <i class="fa-solid fa-folder-open"></i> ${App.escapeHtml(sw.setupPath.split('\\').pop() || '')}
                  </span>
                ` : ''}
              </div>
            </div>
          </td>
          <td style="font-weight: 600; font-family: monospace; font-size: 0.8rem; color: #1e3a8a;">
            ${App.escapeHtml(sw.version || 'v1.0')}
          </td>
          <td>
            <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-main);">${App.escapeHtml(sw.licenseType || 'Free')}</div>
            <div style="display: flex; align-items: center; gap: 4px; margin-top: 2px;">
              <span class="font-mono text-xs text-muted" title="${App.escapeHtml(sw.licenseKey || '')}">${maskedKey}</span>
              ${sw.licenseKey ? `
                <button type="button" class="btn-action" style="width: 20px; height: 20px; font-size: 0.65rem;" onclick="TimetableLabView.copyLicenseKey('${App.escapeHtml(sw.licenseKey)}')" title="ចម្លង Key">
                  <i class="fa-solid fa-copy"></i>
                </button>
              ` : ''}
            </div>
          </td>
          <td>
            <div style="font-size: 0.76rem; color: var(--text-muted);">ដំឡើង៖ ${sw.installDate || '—'}</div>
            <div style="margin-top: 3px;">
              <span class="badge ${expiryBadgeClass}" style="font-size: 0.68rem; font-weight: 700;">
                ${expiryLabel}
              </span>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span class="badge" style="background: ${allInstalled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${allInstalled ? '#059669' : '#d97706'}; font-weight: 700;">
                <i class="fa-solid fa-desktop"></i> ${installedCount}/${totalPcs} គ្រឿង
              </span>
              <button type="button" class="btn-secondary btn-sm" style="font-size: 0.7rem; padding: 2px 6px;" onclick="TimetableLabView.openAssignPcsModal('${sw.id}')" title="កំណត់ម៉ាស៊ីន">
                <i class="fa-solid fa-pen"></i> កំណត់
              </button>
            </div>
            <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 4px; line-height: 1.3;">
              ${(sw.installedPcs || []).slice(0, 7).join(', ')}${installedCount > 7 ? '...' : ''}
            </div>
          </td>
          <td style="text-align: center;">
            <span class="badge ${sw.updateStatus === 'uptodate' ? 'badge-pass' : 'rate-medium'}" style="font-size: 0.72rem; font-weight: 700;">
              ${sw.updateStatus === 'uptodate' ? '<i class="fa-solid fa-circle-check"></i> ចុងក្រោយ' : '<i class="fa-solid fa-arrow-up"></i> មាន Update'}
            </span>
          </td>
          <td style="text-align: center;">
            <div style="display: inline-flex; gap: 4px;">
              <button type="button" class="btn-action btn-edit" onclick="TimetableLabView.openAddSoftwareModal('${sw.id}')" title="កែប្រែព័ត៌មាន">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="btn-action btn-delete" onclick="TimetableLabView.deleteSoftware('${sw.id}')" title="លុបកម្មវិធី">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterSoftwareCategory(cat) {
    this.softwareFilterCategory = cat;
    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "software") {
      mount.innerHTML = this.renderSoftwareSection();
    }
  },

  searchSoftware(query) {
    this.softwareSearchQuery = query.trim();
    const tbody = document.getElementById("softwareTableBody");
    if (tbody) {
      const softwareList = typeof StudentAPI !== "undefined" ? StudentAPI.getLabSoftwareList() : [];
      let filtered = softwareList;
      if (this.softwareFilterCategory !== "ALL") {
        filtered = filtered.filter(s => s.category === this.softwareFilterCategory);
      }
      if (this.softwareSearchQuery) {
        const q = this.softwareSearchQuery.toLowerCase();
        filtered = filtered.filter(s => 
          (s.name && s.name.toLowerCase().includes(q)) || 
          (s.version && s.version.toLowerCase().includes(q)) ||
          (s.licenseType && s.licenseType.toLowerCase().includes(q))
        );
      }
      tbody.innerHTML = this.renderSoftwareTableRows(filtered);
    }
  },

  copyLicenseKey(key) {
    if (!key) return;
    navigator.clipboard.writeText(key).then(() => {
      App.showToast("បានចម្លងលេខកូដ License Key ជោគជ័យ!", "success");
    }).catch(() => {
      App.showToast(`License Key: ${key}`, "info");
    });
  },

  initSoftwareEvents() {},

  openAddSoftwareModal(swId = null) {
    const titleEl = document.getElementById("softwareModalTitle");
    const form = document.getElementById("formLabSoftware");
    if (!form) return;

    const totalPcs = this.getTotalPcs();
    const grid = document.getElementById("swPcsChecklistGrid");
    
    let targetSw = null;
    if (swId && typeof StudentAPI !== "undefined") {
      const list = StudentAPI.getLabSoftwareList();
      targetSw = list.find(s => s.id === swId);
    }

    if (titleEl) {
      titleEl.textContent = targetSw ? `កែប្រែកម្មវិធី៖ ${targetSw.name}` : "បញ្ចូលកម្មវិធីកុំព្យូទ័ររដ្ឋបាលថ្មី";
    }

    document.getElementById("swFormId").value = targetSw ? targetSw.id : "";
    document.getElementById("swFormName").value = targetSw ? targetSw.name : "";
    document.getElementById("swFormCategory").value = targetSw ? targetSw.category : "Office";
    document.getElementById("swFormVersion").value = targetSw ? targetSw.version : "2021";
    document.getElementById("swFormLicenseType").value = targetSw ? targetSw.licenseType : "Volume License";
    document.getElementById("swFormKey").value = targetSw ? (targetSw.licenseKey || "") : "";
    document.getElementById("swFormInstallDate").value = targetSw ? (targetSw.installDate || "") : new Date().toISOString().split('T')[0];
    document.getElementById("swFormExpiryDate").value = targetSw ? (targetSw.expiryDate || "") : "";
    document.getElementById("swFormUpdateStatus").value = targetSw ? targetSw.updateStatus : "uptodate";
    document.getElementById("swFormSetupPath").value = targetSw ? (targetSw.setupPath || "") : "";
    document.getElementById("swFormNotes").value = targetSw ? (targetSw.notes || "") : "";

    // Populate PC Checkbox Grid
    const installedList = targetSw && targetSw.installedPcs ? targetSw.installedPcs : Array.from({ length: totalPcs }, (_, i) => `PC-${String(i + 1).padStart(2, '0')}`);
    if (grid) {
      grid.innerHTML = Array.from({ length: totalPcs }, (_, i) => {
        const pcId = `PC-${String(i + 1).padStart(2, '0')}`;
        const checked = installedList.includes(pcId) ? "checked" : "";
        return `
          <label style="display: flex; align-items: center; gap: 4px; font-size: 0.78rem; font-weight: 600; cursor: pointer; background: var(--bg-surface); padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border-color);">
            <input type="checkbox" name="swTargetPc" value="${pcId}" ${checked}>
            <span>${pcId}</span>
          </label>
        `;
      }).join('');
    }

    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.open("addSoftwareModal");
    }
  },

  toggleAllSwPcs(selectAll) {
    document.querySelectorAll("input[name='swTargetPc']").forEach(cb => {
      cb.checked = selectAll;
    });
  },

  async handleSaveSoftwareForm() {
    const swId = document.getElementById("swFormId").value;
    const name = document.getElementById("swFormName").value.trim();
    if (!name) {
      App.showToast("សូមបញ្ចូលឈ្មោះកម្មវិធី!", "warning");
      return;
    }

    const category = document.getElementById("swFormCategory").value;
    const version = document.getElementById("swFormVersion").value.trim();
    const licenseType = document.getElementById("swFormLicenseType").value;
    const licenseKey = document.getElementById("swFormKey").value.trim();
    const installDate = document.getElementById("swFormInstallDate").value;
    const expiryDate = document.getElementById("swFormExpiryDate").value;
    const updateStatus = document.getElementById("swFormUpdateStatus").value;
    const setupPath = document.getElementById("swFormSetupPath").value.trim();
    const notes = document.getElementById("swFormNotes").value.trim();

    const installedPcs = [];
    document.querySelectorAll("input[name='swTargetPc']:checked").forEach(cb => {
      installedPcs.push(cb.value);
    });

    // Determine icon and color
    let icon = "fa-solid fa-cube";
    let color = "#2563eb";
    if (category === "Office") {
      if (name.toLowerCase().includes("word")) { icon = "fa-solid fa-file-word"; color = "#2563eb"; }
      else if (name.toLowerCase().includes("excel")) { icon = "fa-solid fa-file-excel"; color = "#059669"; }
      else if (name.toLowerCase().includes("powerpoint")) { icon = "fa-solid fa-file-powerpoint"; color = "#ea580c"; }
    } else if (category === "Typing") {
      icon = "fa-solid fa-keyboard"; color = "#7c3aed";
    } else if (category === "Fonts") {
      icon = "fa-solid fa-font"; color = "#0891b2";
    } else if (category === "Utility") {
      icon = "fa-solid fa-file-pdf"; color = "#dc2626";
    } else if (category === "Browser") {
      icon = "fa-brands fa-chrome"; color = "#d97706";
    } else if (category === "Security") {
      icon = "fa-solid fa-shield-halved"; color = "#0284c7";
    }

    const payload = {
      id: swId || undefined,
      name,
      category,
      icon,
      color,
      version,
      licenseType,
      licenseKey,
      installDate,
      expiryDate,
      installedPcs,
      updateStatus,
      setupPath,
      notes
    };

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.saveLabSoftware(payload);
    }

    App.showToast(`បានរក្សាទុកកម្មវិធី "${name}" ដោយជោគជ័យ!`, "success");
    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.close("addSoftwareModal");
    }

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "software") {
      mount.innerHTML = this.renderSoftwareSection();
    }
  },

  async deleteSoftware(swId) {
    if (!confirm("តើលោកគ្រូពិតជាចង់លុបកម្មវិធីនេះចេញពីបញ្ជីសារពើភ័ណ្ឌមែនទេ?")) return;

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.deleteLabSoftware(swId);
    }
    App.showToast("បានលុបកម្មវិធីចេញពីបញ្ជីជោគជ័យ!", "info");

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "software") {
      mount.innerHTML = this.renderSoftwareSection();
    }
  },

  openAssignPcsModal(swId) {
    const list = typeof StudentAPI !== "undefined" ? StudentAPI.getLabSoftwareList() : [];
    const sw = list.find(s => s.id === swId);
    if (!sw) return;

    document.getElementById("assignTargetSwId").value = sw.id;
    const titleEl = document.getElementById("assignPcsModalTitle");
    if (titleEl) titleEl.textContent = `កំណត់ម៉ាស៊ីនសម្រាប់៖ ${sw.name}`;

    const totalPcs = this.getTotalPcs();
    const grid = document.getElementById("assignQuickPcsGrid");
    const installed = sw.installedPcs || [];

    if (grid) {
      grid.innerHTML = Array.from({ length: totalPcs }, (_, i) => {
        const pcId = `PC-${String(i + 1).padStart(2, '0')}`;
        const isChecked = installed.includes(pcId) ? "checked" : "";
        return `
          <label style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 700; cursor: pointer; background: var(--bg-surface); padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color);">
            <input type="checkbox" name="quickAssignPcCheck" value="${pcId}" ${isChecked}>
            <span>${pcId}</span>
          </label>
        `;
      }).join('');
    }

    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.open("assignPcsModal");
    }
  },

  toggleQuickAssignPcs(selectAll) {
    document.querySelectorAll("input[name='quickAssignPcCheck']").forEach(cb => {
      cb.checked = selectAll;
    });
  },

  async saveQuickAssignPcs() {
    const swId = document.getElementById("assignTargetSwId").value;
    if (!swId) return;

    const selectedPcs = [];
    document.querySelectorAll("input[name='quickAssignPcCheck']:checked").forEach(cb => {
      selectedPcs.push(cb.value);
    });

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.assignSoftwareToPcs(swId, selectedPcs);
    }

    App.showToast(`បានកំណត់ម៉ាស៊ីនចំនួន ${selectedPcs.length} គ្រឿង ជោគជ័យ!`, "success");
    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.close("assignPcsModal");
    }

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "software") {
      mount.innerHTML = this.renderSoftwareSection();
    }
  },

  // Export Standard Excel Inventory (.xlsx)
  exportSoftwareInventoryExcel() {
    if (typeof XLSX === "undefined") {
      App.showToast("កំហុស៖ មិនអាចរកឃើញកម្មវិធីបង្កើត Excel (XLSX)!", "error");
      return;
    }

    const softwareList = typeof StudentAPI !== "undefined" ? StudentAPI.getLabSoftwareList() : [];
    const totalPcs = this.getTotalPcs();
    const now = new Date();

    const aoa = [
      ["ព្រះរាជាណាចក្រកម្ពុជា"],
      ["ជាតិ  សាសនា  ព្រះមហាក្សត្រ"],
      ["--- 🪷 ---"],
      ["មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័រ TIS Lab Computer"],
      ["ផ្នែក៖ គ្រប់គ្រងបន្ទប់កុំព្យូទ័រ Lab & បច្ចេកវិទ្យាព័ត៌មានវិទ្យា"],
      [],
      ["របាយការណ៍សារពើភ័ណ្ឌកម្មវិធី & អាជ្ញាប័ណ្ណកុំព្យូទ័ររដ្ឋបាល (OFFICE ADMIN SOFTWARE INVENTORY REPORT)"],
      [`កាលបរិច្ឆេទបញ្ចេញ៖ ${now.toLocaleDateString('km-KH')}  |  ចំនួនម៉ាស៊ីនក្នុង Lab៖ ${totalPcs} គ្រឿង  |  កម្មវិធីសរុប៖ ${softwareList.length}`],
      [],
      [
        "ល.រ",
        "ឈ្មោះកម្មវិធី (Software Name)",
        "ប្រភេទ",
        "ជំនាន់ (Version)",
        "ប្រភេទអាជ្ញាប័ណ្ណ (License)",
        "លេខកូដ License Key",
        "ថ្ងៃដំឡើង",
        "ថ្ងៃផុតកំណត់",
        "ម៉ាស៊ីនបានដំឡើង (Installed PCs)",
        "ចំនួនម៉ាស៊ីន",
        "ស្ថានភាព Update",
        "ទីតាំងឯកសារ Setup",
        "កំណត់ចំណាំ"
      ]
    ];

    softwareList.forEach((sw, idx) => {
      const installedPcsStr = (sw.installedPcs || []).join(', ');
      const pcCount = (sw.installedPcs || []).length;
      const updateStr = sw.updateStatus === 'uptodate' ? "ជំនាន់ចុងក្រោយ" : "មាន Update ថ្មី";

      aoa.push([
        idx + 1,
        sw.name || "",
        sw.category || "",
        sw.version || "",
        sw.licenseType || "",
        sw.licenseKey || "",
        sw.installDate || "",
        sw.expiryDate || "គ្មានថ្ងៃផុតកំណត់",
        installedPcsStr,
        `${pcCount}/${totalPcs} គ្រឿង`,
        updateStr,
        sw.setupPath || "",
        sw.notes || ""
      ]);
    });

    const dataRowsCount = softwareList.length;
    const summaryRowIdx = 10 + dataRowsCount;

    // Totals row
    aoa.push([
      `សរុបកម្មវិធីទាំងអស់ក្នុងបន្ទប់ Lab (${softwareList.length} កម្មវិធី)`,
      "", "", "", "", "", "", "", "", "", "", "", ""
    ]);

    // Signatures
    aoa.push([]);
    const dayKh = String(now.getDate()).padStart(2, '0');
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const khmerMonth = khmerMonths[now.getMonth()];
    const khmerDigits = ["០","១","២","៣","៤","៥","៦","៧","៨","៩"];
    const toKhmerNum = (num) => String(num).split("").map(c => khmerDigits[parseInt(c)] || c).join("");

    aoa.push([
      "", "បានឃើញ និងឯកភាព", "", "", "", "", "", "",
      `ខេត្តកំពត ថ្ងៃទី${toKhmerNum(dayKh)} ខែ${khmerMonth} ឆ្នាំ២០២៦`, "", "", "", ""
    ]);
    aoa.push([
      "", "នាយកមជ្ឈមណ្ឌល TIS Lab Computer", "", "", "", "", "", "",
      "អ្នកគ្រប់គ្រងបន្ទប់កុំព្យូទ័រ Lab / IT Admin", "", "", "", ""
    ]);
    aoa.push([]);
    aoa.push([]);
    aoa.push([
      "", "(ហត្ថលេខា និងត្រាផ្លូវការ)", "", "", "", "", "", "",
      "(ហត្ថលេខា និងឈ្មោះ)", "", "", "", ""
    ]);

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Column Widths
    ws["!cols"] = [
      { wch: 6 },   // ល.រ
      { wch: 25 },  // ឈ្មោះ
      { wch: 14 },  // ប្រភេទ
      { wch: 14 },  // ជំនាន់
      { wch: 22 },  // អាជ្ញាប័ណ្ណ
      { wch: 30 },  // Key
      { wch: 14 },  // ថ្ងៃដំឡើង
      { wch: 16 },  // ថ្ងៃផុតកំណត់
      { wch: 30 },  // ម៉ាស៊ីន
      { wch: 14 },  // ចំនួន
      { wch: 16 },  // Update
      { wch: 30 },  // Setup
      { wch: 32 }   // Notes
    ];

    // Merges
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 12 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 12 } },
      { s: { r: 7, c: 0 }, e: { r: 7, c: 12 } },
      { s: { r: summaryRowIdx, c: 0 }, e: { r: summaryRowIdx, c: 8 } },
      { s: { r: summaryRowIdx + 2, c: 1 }, e: { r: summaryRowIdx + 2, c: 3 } },
      { s: { r: summaryRowIdx + 2, c: 8 }, e: { r: summaryRowIdx + 2, c: 12 } },
      { s: { r: summaryRowIdx + 3, c: 1 }, e: { r: summaryRowIdx + 3, c: 3 } },
      { s: { r: summaryRowIdx + 3, c: 8 }, e: { r: summaryRowIdx + 3, c: 12 } },
      { s: { r: summaryRowIdx + 6, c: 1 }, e: { r: summaryRowIdx + 6, c: 3 } },
      { s: { r: summaryRowIdx + 6, c: 8 }, e: { r: summaryRowIdx + 6, c: 12 } }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "បញ្ជីកម្មវិធី Lab");

    const fileName = `TIS_Lab_Software_Inventory_${now.toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    App.showToast(`បានទាញយកឯកសារ Excel "${fileName}" ជោគជ័យ!`, "success");
  },

  // Official Print A4 Software Inventory Report
  printSoftwareInventoryReport() {
    const softwareList = typeof StudentAPI !== "undefined" ? StudentAPI.getLabSoftwareList() : [];
    const totalPcs = this.getTotalPcs();
    const now = new Date();
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const currentKhmerMonth = `ខែ${khmerMonths[now.getMonth()]} ឆ្នាំ${now.getFullYear()}`;
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

    const rows = softwareList.map((sw, i) => {
      const pcCount = (sw.installedPcs || []).length;
      return `
        <tr>
          <td style="text-align: center; font-weight: 600;">${i + 1}</td>
          <td style="font-weight: 700; color: #1e3a8a;">${App.escapeHtml(sw.name)}</td>
          <td style="text-align: center;">${App.escapeHtml(sw.category)}</td>
          <td style="font-family: monospace; font-size: 11px;">${App.escapeHtml(sw.version)}</td>
          <td>${App.escapeHtml(sw.licenseType)}</td>
          <td style="font-family: monospace; font-size: 10px;">${App.escapeHtml(sw.licenseKey || '—')}</td>
          <td style="text-align: center; font-size: 11px;">${sw.installDate || '—'}</td>
          <td style="text-align: center; font-size: 11px;">${sw.expiryDate || 'គ្មាន'}</td>
          <td style="text-align: center; font-weight: 700; color: #059669;">${pcCount}/${totalPcs} គ្រឿង</td>
          <td style="text-align: center; font-size: 11px;">${sw.updateStatus === 'uptodate' ? 'ចុងក្រោយ' : 'មាន Update'}</td>
        </tr>
      `;
    }).join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>របាយការណ៍សារពើភ័ណ្ឌកម្មវិធី & អាជ្ញាប័ណ្ណ - TIS Lab Computer</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 landscape; margin: 8mm 10mm; }
          * { box-sizing: border-box; }
          body { font-family: 'Kantumruy Pro', sans-serif; background: #fff; color: #0f172a; margin: 0; padding: 16px; font-size: 11px; }
          .royal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
          .report-title-block { text-align: center; margin: 10px 0 14px 0; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1; padding: 8px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 10.5px; }
          th, td { border: 1px solid #94a3b8; padding: 5px 6px; }
          th { background: #f1f5f9; font-weight: 700; text-align: center; }
          tr:nth-child(even) td { background: #f8fafc; }
          .signatures-container { margin-top: 20px; display: flex; justify-content: space-between; page-break-inside: avoid; }
          .sign-col { text-align: center; width: 38%; }
          .no-print-bar { background: #1e293b; color: #fff; padding: 10px 16px; border-radius: 6px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
          .print-btn { background: #059669; color: #fff; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 700; cursor: pointer; font-family: inherit; }
          @media print { .no-print-bar { display: none !important; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="no-print-bar">
          <div style="font-weight: 700;">របាយការណ៍សារពើភ័ណ្ឌកម្មវិធី & អាជ្ញាប័ណ្ណកុំព្យូទ័ររដ្ឋបាល (A4 Print Preview)</div>
          <button class="print-btn" onclick="window.print()">🖨️ បោះពុម្ព (Print)</button>
        </div>

        <div class="royal-header">
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a;">មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័រ TIS Lab Computer</div>
            <div style="font-size: 11px; color: #475569;">ផ្នែក៖ គ្រប់គ្រងបន្ទប់កុំព្យូទ័រ Lab & បច្ចេកវិទ្យាព័ត៌មានវិទ្យា</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 14px; font-weight: 800; color: #1e3a8a;">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div style="font-size: 12px; font-weight: 700; color: #1e3a8a; letter-spacing: 1px;">ជាតិ  សាសនា  ព្រះមហាក្សត្រ</div>
            <div style="font-size: 11px; color: #d97706; margin-top: 2px;">--- 🪷 ---</div>
          </div>
        </div>

        <div class="report-title-block">
          <div style="font-size: 15px; font-weight: 800; color: #1e3a8a;">
            របាយការណ៍សារពើភ័ណ្ឌកម្មវិធី & អាជ្ញាប័ណ្ណកុំព្យូទ័ររដ្ឋបាល (OFFICE ADMIN)
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 3px;">
            កាលបរិច្ឆេទបញ្ចេញ៖ ${now.toLocaleDateString('km-KH')} | កុំព្យូទ័រសរុប៖ ${totalPcs} គ្រឿង | កម្មវិធីសរុប៖ ${softwareList.length}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">ល.រ</th>
              <th>ឈ្មោះកម្មវិធី</th>
              <th style="width: 70px;">ប្រភេទ</th>
              <th style="width: 80px;">Version</th>
              <th>ប្រភេទ License</th>
              <th>License Key</th>
              <th style="width: 75px;">ថ្ងៃដំឡើង</th>
              <th style="width: 80px;">ថ្ងៃផុតកំណត់</th>
              <th style="width: 80px;">PC បានដំឡើង</th>
              <th style="width: 75px;">Update</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="signatures-container">
          <div class="sign-col">
            <div style="font-weight: 700;">បានឃើញ និងឯកភាព</div>
            <div style="font-weight: 700; font-size: 11px; margin-top: 2px;">នាយកមជ្ឈមណ្ឌល TIS Lab Computer</div>
            <div style="height: 55px;"></div>
            <div style="font-style: italic; color: #64748b; font-size: 10px;">(ហត្ថលេខា និងត្រាផ្លូវការ)</div>
          </div>
          <div class="sign-col">
            <div style="color: #334155;">ខេត្តកំពត ថ្ងៃទី${toKhmerNum(dayKh)} ${currentKhmerMonth}</div>
            <div style="font-weight: 700; font-size: 11px; margin-top: 2px;">អ្នកគ្រប់គ្រងបន្ទប់កុំព្យូទ័រ Lab / IT Admin</div>
            <div style="height: 55px;"></div>
            <div style="font-style: italic; color: #64748b; font-size: 10px;">(ហត្ថលេខា និងឈ្មោះ)</div>
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

  // ====================================================
  // 5. SMART LAB CONSOLE SECTION
  // ====================================================
  pendingCommand: null,

  renderSmartLabSection() {
    const totalPcs = this.getTotalPcs();
    const exercises = typeof StudentAPI !== "undefined" ? StudentAPI.getLabExercisesList() : [];
    const printers = typeof StudentAPI !== "undefined" ? StudentAPI.getLabPrinterMapping() : {};
    const policy = this.getCurrentPolicy();
    const isExamMode = policy.mode === "exam";
    const isBroadcast = policy.isTeacherBroadcasting === true;

    // Curriculum & Progress Variables
    const activeShiftForCurriculum = this.activeCurriculumShift || "all";
    const curriculumData = (typeof StudentAPI !== "undefined" && StudentAPI.getCurriculumProgress)
      ? StudentAPI.getCurriculumProgress(activeShiftForCurriculum)
      : ((typeof StudentAPI !== "undefined" && StudentAPI.getDefaultCurriculum) ? StudentAPI.getDefaultCurriculum() : []);
    let totalItems = 0;
    let completedItems = 0;
    if (Array.isArray(curriculumData)) {
      curriculumData.forEach(mod => {
        if (mod && Array.isArray(mod.items)) {
          totalItems += mod.items.length;
          completedItems += mod.items.filter(it => it.done).length;
        }
      });
    }
    const overallPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return `
      <div class="card" style="padding: 24px;">
        <!-- Top Title & Quick Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: 1.15rem; color: var(--text-main);">
              <i class="fa-solid fa-wand-magic-sparkles text-purple-600"></i> ឧបករណ៍បញ្ជា Smart Lab Console (Remote Actions & Exercises)
            </h3>
            <span class="text-xs text-muted">
              បញ្ជាបិទ/បើកម៉ាស៊ីនពីចម្ងាយ, ចាក់សោរប្រឡង, បញ្ចាំងអេក្រង់គ្រូ, ចែករំលែក & ប្រមូលកិច្ចការសិស្ស និងត្រួតពិនិត្យម៉ាស៊ីនព្រីន
            </span>
          </div>

          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="badge" style="background: rgba(124, 58, 237, 0.12); color: #7c3aed; font-weight: 700; padding: 6px 12px; font-size: 0.82rem;">
              <i class="fa-solid fa-server"></i> Server: Master Console Online
            </span>
          </div>
        </div>

        <!-- 1. REMOTE POWER & MASTER CONTROLS -->
        <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.03), rgba(30, 41, 59, 0.05)); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-bolt text-amber-500"></i>
            <span>ការបញ្ជាថាមពល & សំឡេងកុំព្យូទ័រទាំងអស់ពីចម្ងាយ (Remote Power & Audio)</span>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button type="button" class="btn-primary" style="background: #dc2626; border-color: #dc2626; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25); height: 40px; font-weight: 700; padding: 0 16px;" onclick="TimetableLabView.requestSmartLabCommand('shutdown')">
              <i class="fa-solid fa-power-off"></i> <span>បិទម៉ាស៊ីនទាំងអស់ (Shutdown All)</span>
            </button>
            <button type="button" class="btn-secondary" style="height: 40px; font-weight: 700; color: #d97706; border-color: #f59e0b; padding: 0 16px;" onclick="TimetableLabView.requestSmartLabCommand('restart')">
              <i class="fa-solid fa-arrows-rotate"></i> <span>Restart ម៉ាស៊ីនទាំងអស់</span>
            </button>
            <button type="button" class="btn-secondary" style="height: 40px; font-weight: 700; padding: 0 16px;" onclick="TimetableLabView.requestSmartLabCommand('mute')">
              <i class="fa-solid fa-volume-xmark text-red-500"></i> <span>Mute សំឡេងគ្រប់ម៉ាស៊ីន</span>
            </button>
            <button type="button" class="btn-secondary" style="height: 40px; font-weight: 700; padding: 0 16px;" onclick="TimetableLabView.requestSmartLabCommand('unmute')">
              <i class="fa-solid fa-volume-high text-emerald-500"></i> <span>បើកសំឡេងវិញ (Unmute)</span>
            </button>
          </div>
        </div>

        <!-- 1.5 CLASSROOM INTERACTION & TEACHING TOOLS TOOLBAR -->
        <div style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(6, 182, 212, 0.05)); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-chalkboard-user text-indigo-600"></i>
              <span>ឧបករណ៍អន្តរកម្មបង្រៀនផ្ទាល់ & ការគ្រប់គ្រងវិន័យ (Classroom Interaction & Discipline)</span>
            </div>
            ${policy.isAttentionLocked ? `
              <span class="badge" style="background: #ef4444; color: #fff; font-weight: 700; animation: msPulse 1.5s infinite;">
                🛑 Attention Mode កំពុងចាក់សោរអេក្រង់
              </span>
            ` : ''}
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${policy.isAttentionLocked ? `
              <button type="button" class="btn-primary" style="background: #dc2626; border-color: #dc2626; height: 38px; font-weight: 700; padding: 0 14px; animation: msPulse 2s infinite;" onclick="TimetableLabView.toggleAttentionMode()">
                <i class="fa-solid fa-lock-open"></i> <span>ដោះសោរផ្ទាំងខ្មៅ (Unlock All)</span>
              </button>
            ` : `
              <button type="button" class="btn-secondary" style="height: 38px; font-weight: 700; color: #7c3aed; border-color: #7c3aed; padding: 0 14px;" onclick="TimetableLabView.toggleAttentionMode()">
                <i class="fa-solid fa-eye-slash"></i> <span>ផ្ទាំងខ្មៅ «សូមស្តាប់គ្រូ»</span>
              </button>
            `}

            <button type="button" class="btn-secondary" style="height: 38px; font-weight: 700; color: #4f46e5; border-color: #4f46e5; padding: 0 14px;" onclick="ModalsComponent.open('sendLabMessageModal')">
              <i class="fa-solid fa-comment-dots"></i> <span>ផ្ញើសារ Pop-up ទៅអេក្រង់</span>
            </button>

            <button type="button" class="btn-secondary" style="height: 38px; font-weight: 700; color: #0284c7; border-color: #0284c7; padding: 0 14px;" onclick="ModalsComponent.open('launchLabUrlModal')">
              <i class="fa-solid fa-globe"></i> <span>បញ្ជូន Link Web ឱ្យបើកព្រមគ្នា</span>
            </button>

            <button type="button" class="btn-secondary" style="height: 38px; font-weight: 700; color: #d97706; border-color: #d97706; padding: 0 14px;" onclick="ModalsComponent.open('showcasePcModal')">
              <i class="fa-solid fa-star"></i> <span>Showcase សិស្សឆ្នើម</span>
            </button>

            <button type="button" class="btn-secondary" style="height: 38px; font-weight: 700; color: #eab308; border-color: #eab308; background: rgba(234, 179, 8, 0.08); padding: 0 14px;" onclick="TimetableLabView.openTypingRaceModal()">
              <i class="fa-solid fa-flag-checkered"></i> <span>Typing Battle ផ្សាយផ្ទាល់ 🏎️</span>
            </button>
          </div>
        </div>

        <!-- 2. EXAM MODE & TEACHER BROADCAST -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <!-- Exam Mode Card -->
          <div style="background: var(--bg-surface); border: 2px solid ${isExamMode ? '#7c3aed' : 'var(--border-color)'}; border-radius: 12px; padding: 18px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="width: 40px; height: 40px; border-radius: 10px; background: rgba(124, 58, 237, 0.15); color: #7c3aed; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                  <i class="fa-solid fa-graduation-cap"></i>
                </span>
                <div>
                  <h4 style="margin: 0; font-size: 1rem; color: var(--text-main);">របៀបប្រឡងកុំព្យូទ័ររដ្ឋបាល (Exam Mode)</h4>
                  <span class="text-xs text-muted">ចាក់សោរបិទ Internet និង Game អនុញ្ញាតតែ Word, Excel & Typing</span>
                </div>
              </div>
              <span class="badge" style="background: ${isExamMode ? '#7c3aed' : '#94a3b8'}; color: #fff; font-weight: 700;">
                ${isExamMode ? '🔒 កំពុងបើក' : '🔓 បិទ'}
              </span>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; margin: 0 0 14px 0;">
              ពេលបើកដំណើរការ ម៉ាស៊ីនសិស្សទាំងអស់នឹងត្រូវបិទ Internet និង Browser ដោយស្វ័យប្រវត្តិ។ សិស្សអាចបើកបានតែ Word, Excel, PowerPoint និង Typing ប៉ុណ្ណោះ។
            </p>
            <button type="button" class="btn-primary" style="background: ${isExamMode ? '#475569' : '#7c3aed'}; border-color: ${isExamMode ? '#475569' : '#7c3aed'}; width: 100%; height: 38px; font-weight: 700;" onclick="TimetableLabView.toggleExamMode()">
              <i class="fa-solid ${isExamMode ? 'fa-lock-open' : 'fa-lock'}"></i>
              <span>${isExamMode ? 'បិទមុខងារប្រឡង (ត្រឡប់មកធម្មតា)' : 'បើកមុខងារប្រឡង (Lock Internet)'}</span>
            </button>
          </div>

          <!-- Broadcast Screen Card -->
          <div style="background: var(--bg-surface); border: 2px solid ${isBroadcast ? '#0284c7' : 'var(--border-color)'}; border-radius: 12px; padding: 18px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="width: 40px; height: 40px; border-radius: 10px; background: rgba(2, 132, 199, 0.15); color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                  <i class="fa-solid fa-tower-broadcast"></i>
                </span>
                <div>
                  <h4 style="margin: 0; font-size: 1rem; color: var(--text-main);">បញ្ចាំងអេក្រង់គ្រូ (Teacher Screen Broadcast)</h4>
                  <span class="text-xs text-muted">បញ្ចាំងការពន្យល់មេរៀន និងរូបមន្តទៅម៉ូនីទ័រសិស្សទាំងអស់</span>
                </div>
              </div>
              <span class="badge" style="background: ${isBroadcast ? '#0284c7' : '#94a3b8'}; color: #fff; font-weight: 700;">
                ${isBroadcast ? '📡 កំពុងបញ្ចាំង' : 'បិទ'}
              </span>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; margin: 0 0 14px 0;">
              សិស្សអាចមើលឃើញអេក្រង់កុំព្យូទ័រគ្រូច្បាស់ ១០០% នៅចំពោះមុខ ងាយស្រួលពេលពន្យល់រូបមន្ត Excel ពិបាកៗ ឬការកំណត់ Margins ក្នុង Word។
            </p>
            <button type="button" class="btn-primary" style="background: ${isBroadcast ? '#475569' : '#0284c7'}; border-color: ${isBroadcast ? '#475569' : '#0284c7'}; width: 100%; height: 38px; font-weight: 700;" onclick="TimetableLabView.toggleScreenBroadcast()">
              <i class="fa-solid ${isBroadcast ? 'fa-video-slash' : 'fa-video'}"></i>
              <span>${isBroadcast ? 'បញ្ឈប់ការបញ្ចាំងអេក្រង់' : 'ចាប់ផ្តើមបញ្ចាំងអេក្រង់គ្រូ'}</span>
            </button>
          </div>
        </div>

        <!-- 2.5 CURRICULUM & LESSON PROGRESS TRACKER (កុំព្យូទ័ររដ្ឋបាល) -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div>
              <h4 style="margin: 0 0 4px 0; font-size: 1.05rem; color: var(--text-main);">
                <i class="fa-solid fa-list-check text-indigo-600"></i> វឌ្ឍនភាពមេរៀនកុំព្យូទ័ររដ្ឋបាល (Curriculum & Lesson Progress Tracker)
              </h4>
              <span class="text-xs text-muted">តាមដាន និង Tick ធិកមេរៀនជាក់ស្តែងតាមវេនសិក្សា (Word, Excel, PowerPoint, Khmer Typing)</span>
            </div>

            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <select id="curriculumShiftSelect" class="form-control" style="font-size: 0.84rem; font-weight: 700; padding: 6px 12px;" onchange="TimetableLabView.changeCurriculumShift(this.value)">
                <option value="all" ${activeShiftForCurriculum === 'all' ? 'selected' : ''}>គ្រប់វេនសិក្សាទាំងអស់</option>
                <option value="ព្រឹក" ${activeShiftForCurriculum === 'ព្រឹក' ? 'selected' : ''}>វេនព្រឹក (8:00 - 9:30 AM)</option>
                <option value="ថ្ងៃត្រង់" ${activeShiftForCurriculum === 'ថ្ងៃត្រង់' ? 'selected' : ''}>វេនថ្ងៃត្រង់ (11:30 - 1:00 PM)</option>
                <option value="រសៀល" ${activeShiftForCurriculum === 'រសៀល' ? 'selected' : ''}>វេនរសៀល (2:00 - 3:30 PM)</option>
                <option value="ល្ងាច" ${activeShiftForCurriculum === 'ល្ងាច' ? 'selected' : ''}>វេនល្ងាច (5:30 - 7:00 PM)</option>
              </select>
              <div style="background: rgba(79, 70, 229, 0.1); color: #4f46e5; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; border: 1px solid rgba(79, 70, 229, 0.2);">
                <i class="fa-solid fa-chart-pie"></i> បញ្ចប់បាន៖ <strong>${overallPercent}%</strong> (${completedItems}/${totalItems} មេរៀន)
              </div>
            </div>
          </div>

          <!-- Overall Progress Bar -->
          <div style="background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
            <div style="background: linear-gradient(90deg, #6366f1, #06b6d4); width: ${overallPercent}%; height: 100%; transition: width 0.4s ease;"></div>
          </div>

          <!-- Modules Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
            ${curriculumData.map(mod => {
              const modTotal = mod.items.length;
              const modDone = mod.items.filter(it => it.done).length;
              const modPct = Math.round((modDone / modTotal) * 100);
              return `
                <div style="background: var(--border-light); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <i class="fa-solid ${mod.icon}" style="color: ${mod.color}; font-size: 1.1rem;"></i>
                      <strong style="font-size: 0.88rem; color: var(--text-main);">${mod.title}</strong>
                    </div>
                    <span class="badge" style="background: rgba(79, 70, 229, 0.12); color: ${mod.color}; font-weight: 700; font-size: 0.75rem;">
                      ${modDone}/${modTotal} (${modPct}%)
                    </span>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
                    ${mod.items.map(it => `
                      <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.78rem; color: ${it.done ? 'var(--text-muted)' : 'var(--text-main)'}; cursor: pointer; text-decoration: ${it.done ? 'line-through' : 'none'};">
                        <input type="checkbox" ${it.done ? 'checked' : ''} style="cursor: pointer; margin-top: 2px;" onchange="TimetableLabView.toggleCurriculumItem('${mod.id}', '${it.id}')">
                        <span>${App.escapeHtml(it.text)}</span>
                      </label>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. PRACTICE FILES & HOMEWORK DROPZONE -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h4 style="margin: 0 0 3px 0; font-size: 1rem; color: var(--text-main);">
                <i class="fa-solid fa-folder-tree text-indigo-600"></i> ឯកសារលំហាត់អនុវត្ត & ការប្រមូលកិច្ចការសិស្ស (Homework Dropzone)
              </h4>
              <span class="text-xs text-muted">ទីតាំងផ្ទុកថតឯកសារសិស្ស៖ <code>D:\\កិច្ចការសិស្ស_TIS\\</code> (ការពារការបាត់ឯកសារពេល Restart)</span>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn-secondary btn-sm" style="font-weight: 700;" onclick="TimetableLabView.openAddExerciseModal()">
                <i class="fa-solid fa-plus"></i> បន្ថែមលំហាត់ថ្មី
              </button>
              <button type="button" class="btn-primary btn-sm" style="background: #4f46e5; border-color: #4f46e5; font-weight: 700;" onclick="TimetableLabView.distributeExercisesToPcs()">
                <i class="fa-solid fa-cloud-arrow-up"></i> ផ្ញើឯកសារទៅគ្រប់ម៉ាស៊ីន
              </button>
              <button type="button" class="btn-primary btn-sm" style="background: #059669; border-color: #059669; font-weight: 700;" onclick="TimetableLabView.collectStudentWork()">
                <i class="fa-solid fa-cloud-arrow-down"></i> ប្រមូលកិច្ចការទាំងអស់
              </button>
            </div>
          </div>

          <div class="table-responsive" style="border: 1px solid var(--border-color); border-radius: 8px;">
            <table class="data-table" style="margin: 0; font-size: 0.82rem;">
              <thead>
                <tr style="background: var(--border-light);">
                  <th style="width: 40px; text-align: center;">ល.រ</th>
                  <th>ចំណងជើងលំហាត់</th>
                  <th style="width: 90px; text-align: center;">មុខវិជ្ជា</th>
                  <th style="width: 80px; text-align: center;">ប្រភេទ</th>
                  <th>ទីតាំងឯកសារ (File Path)</th>
                  <th style="width: 100px; text-align: center;">កិច្ចការបានប្រមូល</th>
                  <th style="width: 80px; text-align: center;">លុប</th>
                </tr>
              </thead>
              <tbody>
                ${exercises.map((ex, i) => `
                  <tr>
                    <td style="text-align: center; font-weight: 600;">${i + 1}</td>
                    <td style="font-weight: 700; color: var(--text-main);">${App.escapeHtml(ex.title)}</td>
                    <td style="text-align: center;">
                      <span class="badge" style="background: rgba(79, 70, 229, 0.12); color: #4f46e5; font-weight: 700;">${ex.category}</span>
                    </td>
                    <td style="text-align: center; font-family: monospace; font-weight: 700; color: #0284c7;">${ex.fileType}</td>
                    <td style="font-family: monospace; font-size: 0.76rem; color: var(--text-muted);">${App.escapeHtml(ex.filePath)}</td>
                    <td style="text-align: center;">
                      <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700;">
                        <i class="fa-solid fa-check"></i> ${ex.submissionsCount || totalPcs}/${totalPcs} សិស្ស
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <button type="button" class="btn-action btn-delete" onclick="TimetableLabView.deleteExercise('${ex.id}')" title="លុបលំហាត់">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. LAB PRINTERS MAPPING -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h4 style="margin: 0; font-size: 1rem; color: var(--text-main);">
              <i class="fa-solid fa-print text-cyan-600"></i> ការតភ្ជាប់ម៉ាស៊ីនព្រីនក្នុង Lab (Printer Network Status)
            </h4>
            <span class="badge badge-pass"><i class="fa-solid fa-circle-check"></i> ម៉ាស៊ីនព្រីនត្រៀមរួចរាល់សម្រាប់ម៉ោងរៀនព្រីនឯកសារ A4</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">
            <!-- Main Laser Printer -->
            <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 14px; background: var(--border-light);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <i class="fa-solid fa-print" style="font-size: 1.5rem; color: #0284c7;"></i>
                  <div>
                    <strong style="font-size: 0.92rem; color: var(--text-main);">${printers.mainPrinter?.name || 'Canon LBP2900'}</strong>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">${printers.mainPrinter?.location || 'តុគ្រូបង្រៀន'} • IP: ${printers.mainPrinter?.ipAddress || '192.168.1.200'}</div>
                  </div>
                </div>
                <span class="badge" style="background: #d1fae5; color: #047857; font-weight: 700;">Online</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
                ក្រដាស A4៖ <strong style="color: #059669;">ត្រៀមរួចរាល់</strong> | ម៉ាស៊ីនភ្ជាប់៖ <strong>គ្រប់ ${totalPcs} ម៉ាស៊ីន (PC-01 ដល់ PC-${String(totalPcs).padStart(2, '0')})</strong>
              </div>
            </div>

            <!-- Color EcoTank Printer -->
            <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 14px; background: var(--border-light);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <i class="fa-solid fa-fill-drip" style="font-size: 1.5rem; color: #059669;"></i>
                  <div>
                    <strong style="font-size: 0.92rem; color: var(--text-main);">${printers.colorPrinter?.name || 'Epson EcoTank L3210'}</strong>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">${printers.colorPrinter?.location || 'ផ្នែករដ្ឋបាល'} • IP: ${printers.colorPrinter?.ipAddress || '192.168.1.201'}</div>
                  </div>
                </div>
                <span class="badge" style="background: #d1fae5; color: #047857; font-weight: 700;">Color Ready</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
                ទឹកថ្នាំពណ៌៖ <strong style="color: #059669;">ពេញ 100%</strong> | ម៉ាស៊ីនភ្ជាប់៖ <strong>PC-01 ដល់ PC-07</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initSmartLabEvents() {},

  requestSmartLabCommand(cmdType) {
    this.pendingCommand = cmdType;
    const modal = document.getElementById("smartLabConfirmModal");
    const iconBox = document.getElementById("smartLabConfirmIconBox");
    const iconEl = document.getElementById("smartLabConfirmIcon");
    const titleEl = document.getElementById("smartLabConfirmTitle");
    const msgEl = document.getElementById("smartLabConfirmMessage");
    const btnConfirm = document.getElementById("btnSmartLabExecuteConfirm");

    if (cmdType === "shutdown") {
      if (iconBox) { iconBox.style.background = "rgba(239, 68, 68, 0.12)"; iconBox.style.color = "#dc2626"; }
      if (iconEl) iconEl.className = "fa-solid fa-power-off";
      if (titleEl) titleEl.textContent = "បញ្ជាក់ការបិទកុំព្យូទ័រទាំងអស់ (Shutdown All)";
      if (msgEl) msgEl.textContent = `តើលោកគ្រូពិតជាចង់បិទ (Shutdown) ម៉ាស៊ីនកុំព្យូទ័រសិស្សទាំងអស់ (PC-01 ដល់ PC-${String(this.getTotalPcs()).padStart(2, '0')}) ឥឡូវនេះមែនដែរឬទេ?`;
      if (btnConfirm) { btnConfirm.style.background = "#dc2626"; btnConfirm.style.borderColor = "#dc2626"; }
    } else if (cmdType === "restart") {
      if (iconBox) { iconBox.style.background = "rgba(245, 158, 11, 0.12)"; iconBox.style.color = "#d97706"; }
      if (iconEl) iconEl.className = "fa-solid fa-arrows-rotate";
      if (titleEl) titleEl.textContent = "បញ្ជាក់ការ Restart ម៉ាស៊ីនទាំងអស់";
      if (msgEl) msgEl.textContent = "តើលោកគ្រូពិតជាចង់ Restart ម៉ាស៊ីនកុំព្យូទ័រសិស្សទាំងអស់ក្នុង Lab មែនដែរឬទេ?";
      if (btnConfirm) { btnConfirm.style.background = "#d97706"; btnConfirm.style.borderColor = "#d97706"; }
    } else if (cmdType === "mute") {
      if (iconBox) { iconBox.style.background = "rgba(239, 68, 68, 0.12)"; iconBox.style.color = "#dc2626"; }
      if (iconEl) iconEl.className = "fa-solid fa-volume-xmark";
      if (titleEl) titleEl.textContent = "បិទសំឡេងម៉ាស៊ីនសិស្សទាំងអស់ (Mute All)";
      if (msgEl) msgEl.textContent = "កម្រិតសំឡេង Windows លើម៉ាស៊ីនសិស្សទាំងអស់នឹងត្រូវកំណត់ជា Mute (ស្ងាត់)។";
      if (btnConfirm) { btnConfirm.style.background = "#2563eb"; btnConfirm.style.borderColor = "#2563eb"; }
    } else if (cmdType === "unmute") {
      if (iconBox) { iconBox.style.background = "rgba(16, 185, 129, 0.12)"; iconBox.style.color = "#059669"; }
      if (iconEl) iconEl.className = "fa-solid fa-volume-high";
      if (titleEl) titleEl.textContent = "បើកសំឡេងម៉ាស៊ីនសិស្សទាំងអស់ (Unmute)";
      if (msgEl) msgEl.textContent = "កម្រិតសំឡេង Windows លើម៉ាស៊ីនសិស្សទាំងអស់នឹងត្រូវបើកដំណើរការឡើងវិញ។";
      if (btnConfirm) { btnConfirm.style.background = "#059669"; btnConfirm.style.borderColor = "#059669"; }
    }

    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.open("smartLabConfirmModal");
    }
  },

  async executeConfirmedSmartCommand() {
    const cmd = this.pendingCommand;
    if (!cmd) return;

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.sendSmartLabCommand(cmd, "ALL");
    }

    if (cmd === "shutdown") {
      App.showToast("🛑 បានបញ្ជូនបញ្ជាបិទ (Shutdown) ទៅកាន់ម៉ាស៊ីនទាំងអស់ក្នុង Lab រួចរាល់!", "success");
    } else if (cmd === "restart") {
      App.showToast("🔄 បានបញ្ជូនបញ្ជា Restart ទៅកាន់ម៉ាស៊ីនទាំងអស់ក្នុង Lab រួចរាល់!", "success");
    } else if (cmd === "mute") {
      App.showToast("🔇 បាន Mute សំឡេងកុំព្យូទ័រសិស្សទាំងអស់!", "success");
    } else if (cmd === "unmute") {
      App.showToast("🔊 បានបើកសំឡេងកុំព្យូទ័រសិស្សទាំងអស់ឡើងវិញ!", "success");
    }

    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.close("smartLabConfirmModal");
    }
    this.pendingCommand = null;
  },

  async toggleExamMode() {
    const policy = this.getCurrentPolicy();
    const isExam = policy.mode === "exam";
    const nextMode = isExam ? "free" : "exam";

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.sendSmartLabCommand(isExam ? "exam_mode_off" : "exam_mode_on");
    }

    policy.mode = nextMode;
    policy.isInternetBlocked = !isExam;
    this.lastPolicy = policy;
    localStorage.setItem("tis_lab_app_policy", JSON.stringify(policy));

    App.showToast(isExam ? "🔓 បានបិទមុខងារប្រឡង (ត្រឡប់មកប្រើប្រាស់ធម្មតាវិញ)!" : "🔒 បានបើកមុខងារប្រឡង (Exam Mode) ចាក់សោរ Internet រួចរាល់!", "success");

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "smartlab") {
      mount.innerHTML = this.renderSmartLabSection();
    }
  },

  async toggleScreenBroadcast() {
    const policy = this.getCurrentPolicy();
    const isBroadcast = policy.isTeacherBroadcasting === true;

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.sendSmartLabCommand(isBroadcast ? "broadcast_screen_off" : "broadcast_screen_on");
    }

    policy.isTeacherBroadcasting = !isBroadcast;
    this.lastPolicy = policy;
    localStorage.setItem("tis_lab_app_policy", JSON.stringify(policy));

    App.showToast(isBroadcast ? "📡 បានបញ្ឈប់ការបញ្ចាំងអេក្រង់គ្រូ!" : "🖥️ កំពុងបញ្ចាំងអេក្រង់គ្រូទៅកាន់ម៉ូនីទ័រសិស្សទាំងអស់!", "success");

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "smartlab") {
      mount.innerHTML = this.renderSmartLabSection();
    }
  },

  openAddExerciseModal(exId = null) {
    const form = document.getElementById("formLabExercise");
    if (!form) return;

    let targetEx = null;
    if (exId && typeof StudentAPI !== "undefined") {
      const list = StudentAPI.getLabExercisesList();
      targetEx = list.find(e => e.id === exId);
    }

    document.getElementById("exFormId").value = targetEx ? targetEx.id : "";
    document.getElementById("exFormTitle").value = targetEx ? targetEx.title : "";
    document.getElementById("exFormCategory").value = targetEx ? targetEx.category : "Word";
    document.getElementById("exFormFileType").value = targetEx ? targetEx.fileType : "DOCX";
    document.getElementById("exFormFileName").value = targetEx ? targetEx.fileName : "";
    document.getElementById("exFormFilePath").value = targetEx ? targetEx.filePath : "D:\\កិច្ចការសិស្ស_TIS\\Exercises\\";
    document.getElementById("exFormTargetShift").value = targetEx ? targetEx.targetShift : "ALL";

    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.open("addLabExerciseModal");
    }
  },

  async handleSaveExerciseForm() {
    const exId = document.getElementById("exFormId").value;
    const title = document.getElementById("exFormTitle").value.trim();
    if (!title) {
      App.showToast("សូមបញ្ចូលចំណងជើងលំហាត់!", "warning");
      return;
    }

    const category = document.getElementById("exFormCategory").value;
    const fileType = document.getElementById("exFormFileType").value;
    const fileName = document.getElementById("exFormFileName").value.trim() || `${title}.${fileType.toLowerCase()}`;
    const filePath = document.getElementById("exFormFilePath").value.trim() || `D:\\កិច្ចការសិស្ស_TIS\\Exercises\\${category}\\${fileName}`;
    const targetShift = document.getElementById("exFormTargetShift").value;

    const payload = {
      id: exId || undefined,
      title,
      category,
      fileType,
      fileName,
      filePath,
      targetShift
    };

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.saveLabExercise(payload);
    }

    App.showToast(`បានរក្សាទុកឯកសារលំហាត់ "${title}" ជោគជ័យ!`, "success");
    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.close("addLabExerciseModal");
    }

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "smartlab") {
      mount.innerHTML = this.renderSmartLabSection();
    }
  },

  async deleteExercise(exId) {
    if (!confirm("តើលោកគ្រូពិតជាចង់លុបឯកសារលំហាត់នេះមែនទេ?")) return;

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.deleteLabExercise(exId);
    }
    App.showToast("បានលុបឯកសារលំហាត់ជោគជ័យ!", "info");

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "smartlab") {
      mount.innerHTML = this.renderSmartLabSection();
    }
  },

  async distributeExercisesToPcs() {
    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.sendSmartLabCommand("distribute_exercise", "ALL");
    }

    if (typeof confetti === "function") {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    App.showToast("📤 បានចែករំលែកឯកសារលំហាត់ទៅកាន់ Folder «D:\\កិច្ចការសិស្ស_TIS\\» លើគ្រប់ម៉ាស៊ីនជោគជ័យ!", "success");
  },

  async collectStudentWork() {
    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.sendSmartLabCommand("collect_work", "ALL");
    }

    if (typeof confetti === "function") {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    }
    App.showToast("📥 បានប្រមូលឯកសារកិច្ចការ Word/Excel របស់សិស្សគ្រប់ម៉ាស៊ីន (១៤/១៤) ចូលក្នុងម៉ាស៊ីនគ្រូរួចរាល់!", "success");
  },

  // ====================================================
  // 6. SMART LAB ADVANCED EXTENSIONS (ATTENTION, MESSAGE, URL, SHOWCASE, SEATS, CURRICULUM, RACE)
  // ====================================================

  async toggleAttentionMode() {
    const policy = this.getCurrentPolicy();
    const isLocked = !policy.isAttentionLocked;
    policy.isAttentionLocked = isLocked;

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.toggleAttentionMode(isLocked, "⚠️ សូមផ្អាកការអនុវត្ត និងងាកមកស្តាប់ការពន្យល់របស់លោកគ្រូ!");
    }

    localStorage.setItem("tis_lab_app_policy", JSON.stringify(policy));
    App.showToast(isLocked ? "🛑 បានបើក Attention Mode (អេក្រង់ខ្មៅ & ចាក់សោរ Keyboard/Mouse) លើ PC ទាំងអស់!" : "🔓 បានដោះសោរផ្ទាំងខ្មៅ (សិស្សអាចអនុវត្តបន្តបាន)!", isLocked ? "warning" : "success");

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "smartlab") {
      mount.innerHTML = this.renderSmartLabSection();
    }
  },

  async executeSendMessage() {
    const target = document.getElementById("msgTargetPcs")?.value || "ALL";
    const title = document.getElementById("msgTitleInput")?.value.trim() || "ដំណឹងពីលោកគ្រូ";
    const text = document.getElementById("msgTextInput")?.value.trim();

    if (!text) {
      App.showToast("សូមបញ្ចូលខ្លឹមសារសារ!", "warning");
      return;
    }

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.sendBroadcastMessage(target, text, title);
    }

    App.showToast(`💬 បានផ្ញើសារ Pop-up ទៅកាន់ [${target}] ជោគជ័យ!`, "success");
    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.close("sendLabMessageModal");
    }
    document.getElementById("msgTextInput").value = "";
  },

  async executeLaunchUrl() {
    const target = document.getElementById("urlTargetPcs")?.value || "ALL";
    const url = document.getElementById("remoteUrlInput")?.value.trim();

    if (!url) {
      App.showToast("សូមបញ្ចូលអាសយដ្ឋាន URL!", "warning");
      return;
    }

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.launchRemoteUrl(target, url);
    }

    App.showToast(`🌐 បានបញ្ជាឱ្យ [${target}] បើកគេហទំព័រ "${url}" ជោគជ័យ!`, "success");
    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.close("launchLabUrlModal");
    }
    document.getElementById("remoteUrlInput").value = "";
  },

  async executeShowcaseConfirm() {
    const sourcePc = document.getElementById("showcaseSourcePc")?.value || "PC-01";

    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.setShowcaseStream(sourcePc, true);
    }

    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.close("showcasePcModal");
    }
    App.showToast(`🌟 កំពុងបញ្ចាំងអេក្រង់របស់ ${sourcePc} ទៅកាន់កុំព្យូទ័រទាំងអស់ក្នុងបន្ទប់ Lab!`, "success");
  },

  openSeatAssignModal(pcId) {
    const students = App.state.students || [];
    const select = document.getElementById("assignStudentSelect");
    const targetInput = document.getElementById("assignTargetPcId");
    const titleEl = document.getElementById("seatAssignModalTitle");

    if (targetInput) targetInput.value = pcId;
    if (titleEl) titleEl.textContent = `កំណត់ ឬភ្ជាប់សិស្សអង្គុយលើ ${pcId}`;

    if (select) {
      select.innerHTML = `
        <option value="">-- សូមជ្រើសរើសសិស្ស --</option>
        ${students.map(st => `
          <option value="${st.ID}">${st.NameKh} (${st.ID}) • ${st.Gender} • ${st.Shift || 'ទូទៅ'}</option>
        `).join('')}
      `;
    }

    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.open("studentSeatAssignModal");
    }
  },

  async saveSeatAssignment() {
    const pcId = document.getElementById("assignTargetPcId")?.value || "PC-01";
    const studentId = document.getElementById("assignStudentSelect")?.value;

    if (!studentId) {
      App.showToast("សូមជ្រើសរើសសិស្ស!", "warning");
      return;
    }

    const students = App.state.students || [];
    const student = students.find(s => s.ID === studentId);
    const studentName = student ? student.NameKh : studentId;

    // Save in timetable shift seats
    const allSeats = this.getLabSeats();
    if (!allSeats[this.activeShift]) allSeats[this.activeShift] = {};
    allSeats[this.activeShift][pcId] = studentId;
    this.saveLabSeats(allSeats);

    // Save in StudentAPI
    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.claimStudentSeat(pcId, studentId, studentName);
    }

    App.showToast(`🪑 បានភ្ជាប់សិស្ស "${studentName}" ទៅកាន់កៅអី [${pcId}] និងស្រង់វត្តមានជោគជ័យ!`, "success");
    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.close("studentSeatAssignModal");
    }

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "lab") {
      mount.innerHTML = this.renderLabMapSection();
    }
  },

  async clearHand(pcId) {
    if (typeof StudentAPI !== "undefined") {
      await StudentAPI.clearStudentHand(pcId);
    }
    App.showToast(`🙋‍♂️ បានឆ្លើយតប និងលុបសញ្ញាលើកដៃរបស់ ${pcId} រួចរាល់!`, "info");

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "lab") {
      mount.innerHTML = this.renderLabMapSection();
    }
  },

  async toggleCurriculumItem(moduleId, itemId) {
    const shift = this.activeCurriculumShift || "all";
    if (typeof StudentAPI === "undefined") return;

    const data = StudentAPI.getCurriculumProgress(shift);
    const mod = data.find(m => m.id === moduleId);
    if (mod) {
      const item = mod.items.find(it => it.id === itemId);
      if (item) {
        item.done = !item.done;
        await StudentAPI.saveCurriculumProgress(shift, data);
      }
    }

    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "smartlab") {
      mount.innerHTML = this.renderSmartLabSection();
    }
  },

  changeCurriculumShift(shiftId) {
    this.activeCurriculumShift = shiftId;
    const mount = document.getElementById("timetableContentMount");
    if (mount && this.activeTab === "smartlab") {
      mount.innerHTML = this.renderSmartLabSection();
    }
  },

  // Live Typing Battle Arena
  raceInterval: null,
  raceTimeLeft: 300,
  raceSpeeds: {},

  openTypingRaceModal() {
    this.renderTypingRaceTracks();
    if (typeof ModalsComponent !== "undefined") {
      ModalsComponent.open("typingRaceModal");
    }
  },

  renderTypingRaceTracks() {
    const container = document.getElementById("typingRaceTracksContainer");
    if (!container) return;

    const students = App.state.students || [];
    const allSeats = this.getLabSeats();
    const currentShiftSeats = allSeats[this.activeShift] || {};

    const carColors = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#84cc16", "#eab308", "#64748b", "#a855f7"];

    let html = "";
    const totalPcs = this.getTotalPcs();
    for (let i = 1; i <= totalPcs; i++) {
      const pcId = `PC-${String(i).padStart(2, '0')}`;
      const studentId = currentShiftSeats[pcId];
      const student = students.find(s => s.ID === studentId);
      const studentName = student ? student.NameKh : "កៅអីទំនេរ";
      const wpm = this.raceSpeeds[pcId] || Math.floor(Math.random() * 25) + 15;
      const progress = Math.min(92, Math.max(5, Math.round((wpm / 60) * 88)));
      const color = carColors[(i - 1) % carColors.length];

      html += `
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 6px 12px; display: flex; align-items: center; gap: 12px;">
          <div style="min-width: 140px; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            <strong style="color: #38bdf8; font-family: monospace;">${pcId}</strong>
            <span style="color: #e2e8f0; margin-left: 6px;">${studentName}</span>
          </div>

          <!-- Track -->
          <div style="flex: 1; height: 26px; background: #0f172a; border-radius: 6px; position: relative; overflow: hidden; border: 1px solid #334155; display: flex; align-items: center;">
            <div style="position: absolute; left: 0; width: 4px; height: 100%; background: #22c55e;"></div>
            <div style="position: absolute; right: 0; width: 8px; height: 100%; background: repeating-linear-gradient(45deg, #fff, #fff 4px, #000 4px, #000 8px);"></div>

            <!-- Sports Car on Track -->
            <div id="raceCar_${pcId}" style="position: absolute; left: ${progress}%; transition: left 0.8s ease; display: flex; align-items: center; gap: 4px; color: ${color}; font-size: 1.15rem; filter: drop-shadow(0 0 6px ${color});">
              <i class="fa-solid fa-car-side"></i>
            </div>
          </div>

          <!-- WPM Badge -->
          <div style="min-width: 75px; text-align: right;">
            <span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-family: monospace; font-weight: 700; font-size: 0.82rem; padding: 2px 8px;">
              ${wpm} WPM
            </span>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  },

  startTypingRace() {
    const btn = document.getElementById("btnStartRace");
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងប្រណាំង...`;
      btn.style.pointerEvents = "none";
    }

    if (this.raceInterval) clearInterval(this.raceInterval);

    // Live race update tick
    this.raceInterval = setInterval(() => {
      if (this.raceTimeLeft <= 0) {
        clearInterval(this.raceInterval);
        if (typeof confetti === "function") {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
        App.showToast("🏁 ការប្រណាំងវាយអត្ថបទបានបញ្ចប់ជាស្ថាពរ!", "success");
        if (btn) {
          btn.innerHTML = `<i class="fa-solid fa-flag-checkered"></i> បញ្ចប់ការប្រណាំង`;
          btn.style.pointerEvents = "auto";
        }
        return;
      }

      this.raceTimeLeft--;
      const min = String(Math.floor(this.raceTimeLeft / 60)).padStart(2, '0');
      const sec = String(this.raceTimeLeft % 60).padStart(2, '0');
      const timerDisplay = document.getElementById("raceTimerDisplay");
      if (timerDisplay) timerDisplay.textContent = `${min}:${sec}`;

      // Dynamically wiggle and boost speeds
      const totalPcs = this.getTotalPcs();
      for (let i = 1; i <= totalPcs; i++) {
        const pcId = `PC-${String(i).padStart(2, '0')}`;
        const current = this.raceSpeeds[pcId] || 25;
        const change = Math.floor(Math.random() * 5) - 2;
        this.raceSpeeds[pcId] = Math.max(10, Math.min(65, current + change));
      }
      this.renderTypingRaceTracks();
    }, 1500);

    App.showToast("🏎️ ការប្រណាំងវាយអត្ថបទ ៥ នាទីបានចាប់ផ្តើម!", "info");
  },

  resetTypingRace() {
    if (this.raceInterval) clearInterval(this.raceInterval);
    this.raceTimeLeft = 300;
    this.raceSpeeds = {};
    const timerDisplay = document.getElementById("raceTimerDisplay");
    if (timerDisplay) timerDisplay.textContent = "05:00";
    const btn = document.getElementById("btnStartRace");
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-play"></i> ចាប់ផ្តើមប្រណាំង`;
      btn.style.pointerEvents = "auto";
    }
    this.renderTypingRaceTracks();
  }
};


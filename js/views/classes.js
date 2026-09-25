/**
 * View: Computer Classes Management (គ្រប់គ្រងថ្នាក់រៀនកុំព្យូទ័រ)
 * 100% Computer-focused classes per user requirement:
 * Typing, Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Computer Office Admin.
 */
const ClassesView = {
  searchQuery: "",
  filterShift: "",
  filterCourse: "",

  defaultClasses: [
    {
      id: "CLS-TYP-01",
      name: "ថ្នាក់វាយអត្ថបទរហ័ស (Typing Khmer & English)",
      course: "Typing",
      shift: "ព្រឹក",
      time: "08:00 - 09:00",
      room: "បន្ទប់ Computer Lab (16 ម៉ាស៊ីន)",
      teacher: "លោកគ្រូ ខៀន ធូ",
      maxSeats: 16,
      occupiedSeats: 16,
      status: "សកម្ម",
      color: "#8b5cf6"
    },
    {
      id: "CLS-TYP-02",
      name: "ថ្នាក់វាយអត្ថបទរហ័ស (Typing Khmer & English)",
      course: "Typing",
      shift: "ថ្ងៃ",
      time: "15:00 - 16:00",
      room: "បន្ទប់ Computer Lab (16 ម៉ាស៊ីន)",
      teacher: "មាស​​ មករា",
      maxSeats: 16,
      occupiedSeats: 9,
      status: "សកម្ម",
      color: "#06b6d4"
    },
    {
      id: "CLS-TYP-03",
      name: "ថ្នាក់វាយអត្ថបទរហ័ស (Typing Khmer & English)",
      course: "Typing",
      shift: "រសៀល",
      time: "17:00 - 18:00",
      room: "បន្ទប់ Computer Lab (16 ម៉ាស៊ីន)",
      teacher: "លោកគ្រូ ខៀន ធូ",
      maxSeats: 16,
      occupiedSeats: 2,
      status: "សកម្ម",
      color: "#f59e0b"
    }
  ],

  resetToDefaults() {
    localStorage.setItem("ms_classes_list_2026_v4", JSON.stringify(this.defaultClasses));
    localStorage.setItem("ms_classes_list_2026", JSON.stringify(this.defaultClasses));
    this.renderGrid();
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("បានស្ដារថ្នាក់កុំព្យូទ័រទាំងអស់មកវិញដូចដើមរួចរាល់!", "success");
    }
  },

  getClasses() {
    try {
      const stored = localStorage.getItem("ms_classes_list_2026_v4");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= this.defaultClasses.length) {
          const hasLegacy = parsed.some(c => c.teacher && (c.teacher.includes("ចិន្តា") || c.teacher.includes("វីរៈ") || c.teacher.includes("រចនា")));
          if (!hasLegacy) return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem("ms_classes_list_2026_v4", JSON.stringify(this.defaultClasses));
    localStorage.setItem("ms_classes_list_2026", JSON.stringify(this.defaultClasses));
    return JSON.parse(JSON.stringify(this.defaultClasses));
  },

  saveClasses(classes) {
    localStorage.setItem("ms_classes_list_2026_v4", JSON.stringify(classes));
    localStorage.setItem("ms_classes_list_2026", JSON.stringify(classes));
  },

  render() {
    return `
      <section id="view-classes" class="page-view">
        <!-- Header Banner -->
        <div class="card" style="margin-bottom: 20px; padding: 22px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid #818cf8;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-school" style="color: #818cf8;"></i>
              <span>គ្រប់គ្រងថ្នាក់រៀនកុំព្យូទ័រ (Computer Classes)</span>
              <span id="classesCountBadge" class="badge" style="background: rgba(129, 140, 248, 0.15); color: #818cf8; font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">3 ថ្នាក់</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              ថ្នាក់បង្រៀនជំនាញកុំព្យូទ័រតាមវេនសិក្សា ចំនួនសិស្សតាមម៉ាស៊ីន Lab និងគ្រូទទួលបន្ទុក
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="btnResetClassesBtn" class="btn-secondary" onclick="ClassesView.resetToDefaults()" style="height: 42px; padding: 0 16px; font-size: 0.88rem; font-weight: 700; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px;" title="ស្ដារថ្នាក់រៀនទាំង ៣ មកវិញដូចដើម">
              <i class="fa-solid fa-rotate-left"></i> <span>ស្ដារដូចដើម (Reset)</span>
            </button>
            <button type="button" id="btnAddClassBtn" class="btn-primary" style="height: 42px; padding: 0 18px; font-size: 0.88rem; font-weight: 700; background: linear-gradient(135deg, #4f46e5, #818cf8); border-color: transparent; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);">
              <i class="fa-solid fa-plus"></i> <span>+ បង្កើតថ្នាក់ថ្មី (Add Class)</span>
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="card" style="padding: 16px 20px; margin-bottom: 20px; display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
          <div style="flex: 1; min-width: 240px; position: relative;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
            <input type="text" id="classesSearchInput" placeholder="ស្វែងរកតាមឈ្មោះថ្នាក់, កូដ, គ្រូបង្រៀន..." class="form-control" style="padding-left: 40px; height: 42px; border-radius: 12px;">
          </div>
          <select id="classesCourseFilter" class="form-control" style="width: auto; min-width: 170px; height: 42px; border-radius: 12px;">
            <option value="">-- វគ្គសិក្សាទាំងអស់ --</option>
            <option value="Typing">Typing</option>
            <option value="Word">Microsoft Word</option>
            <option value="Excel">Microsoft Excel</option>
            <option value="PowerPoint">Microsoft PowerPoint</option>
          </select>
          <select id="classesShiftFilter" class="form-control" style="width: auto; min-width: 150px; height: 42px; border-radius: 12px;">
            <option value="">-- វេនសិក្សាទាំងអស់ --</option>
            <option value="ព្រឹក">វេនព្រឹក (08:00 - 09:00)</option>
            <option value="ថ្ងៃ">វេនថ្ងៃ (15:00 - 16:00)</option>
            <option value="រសៀល">វេនរសៀល (17:00 - 18:00)</option>
          </select>
        </div>

        <!-- Class Cards Grid -->
        <div id="classesGridContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 20px;">
          <!-- Dynamically filled -->
        </div>

        <!-- Add/Edit Class Modal -->
        <div id="classModal" class="modal" style="display: none;">
          <div class="modal-backdrop" onclick="ClassesView.closeModal()"></div>
          <div class="modal-card" style="max-width: 520px;">
            <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding: 18px 24px;">
              <h3 id="classModalTitle" style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-school" style="color: #818cf8;"></i>
                <span>បន្ថែមថ្នាក់កុំព្យូទ័រថ្មី</span>
              </h3>
              <button type="button" class="btn-icon" onclick="ClassesView.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form id="classForm" onsubmit="ClassesView.handleSave(event)" style="padding: 24px;">
              <input type="hidden" id="classEditId" value="">
              <div style="margin-bottom: 16px;">
                <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">ឈ្មោះថ្នាក់ *</label>
                <input type="text" id="classInputName" class="form-control" required placeholder="ឧ. ថ្នាក់កុំព្យូទ័រ Excel វេនព្រឹក">
              </div>
              <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                <div style="flex: 1;">
                  <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">មុខវិជ្ជា/វគ្គ *</label>
                  <select id="classInputCourse" class="form-control" required>
                    <option value="Typing">Typing</option>
                    <option value="Word">Microsoft Word</option>
                    <option value="Excel">Microsoft Excel</option>
                    <option value="PowerPoint">Microsoft PowerPoint</option>
                  </select>
                </div>
                <div style="flex: 1;">
                  <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">វេនសិក្សា *</label>
                  <select id="classInputShift" class="form-control" required>
                    <option value="ព្រឹក">វេនព្រឹក (08:00 - 09:00)</option>
                    <option value="ថ្ងៃ">វេនថ្ងៃ (15:00 - 16:00)</option>
                    <option value="រសៀល">វេនរសៀល (17:00 - 18:00)</option>
                  </select>
                </div>
              </div>
              <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                <div style="flex: 1;">
                  <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">បន្ទប់/Lab</label>
                  <input type="text" id="classInputRoom" class="form-control" value="បន្ទប់ Computer Lab 01">
                </div>
                <div style="flex: 1;">
                  <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">គ្រូទទួលបន្ទុក *</label>
                  <input type="text" id="classInputTeacher" class="form-control" required value="លោកគ្រូ ខៀន ធូ">
                </div>
              </div>
              <div style="display: flex; gap: 16px; margin-bottom: 20px;">
                <div style="flex: 1;">
                  <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">ចំណុះម៉ាស៊ីន (Seats)</label>
                  <input type="number" id="classInputMaxSeats" class="form-control" value="20" min="5" max="50">
                </div>
                <div style="flex: 1;">
                  <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">ស្ថានភាព</label>
                  <select id="classInputStatus" class="form-control">
                    <option value="សកម្ម">សកម្ម</option>
                    <option value="ផ្អាក">ផ្អាកបណ្តោះអាសន្ន</option>
                  </select>
                </div>
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 18px;">
                <button type="button" class="btn-secondary" onclick="ClassesView.closeModal()">បោះបង់</button>
                <button type="submit" class="btn-primary" style="background: #4f46e5; border-color: #4f46e5; font-weight: 700;">
                  <i class="fa-solid fa-floppy-disk"></i> រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  },

  renderGrid() {
    const container = document.getElementById("classesGridContainer");
    if (!container) return;

    const classes = this.getClasses();
    const query = this.searchQuery.toLowerCase().trim();
    const course = this.filterCourse;
    const shift = this.filterShift;

    // Dynamically calculate actual students from App.state.students if available
    const allStudents = (typeof App !== "undefined" && App.state && App.state.students) || [];

    const filtered = classes.filter(c => {
      const matchQ = !query || 
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.id && c.id.toLowerCase().includes(query)) ||
        (c.teacher && c.teacher.toLowerCase().includes(query));
      const matchC = !course || c.course === course;
      const matchS = !shift || c.shift === shift;
      return matchQ && matchC && matchS;
    });

    const badge = document.getElementById("classesCountBadge");
    if (badge) badge.textContent = `${filtered.length} ថ្នាក់`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: 16px; border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-school" style="font-size: 3rem; color: var(--text-muted); opacity: 0.4; margin-bottom: 12px;"></i>
          <p style="font-size: 1rem; color: var(--text-muted); margin: 0;">មិនមានថ្នាក់រៀនកុំព្យូទ័រដែលត្រូវនឹងការស្វែងរកនេះទេ</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(c => {
      // Calculate active student count for this course & shift
      const actualCount = allStudents.filter(s => {
        const cMatch = (s.Course || s.course) === c.course;
        const sMatch = (s.Shift || s.shift) === c.shift;
        const st = String(s.Status || s.status || "").toLowerCase();
        return cMatch && sMatch && st !== "dropped" && st !== "graduated";
      }).length;
      const displayCount = actualCount > 0 ? actualCount : (c.occupiedSeats || 0);
      const percent = Math.min(100, Math.round((displayCount / (c.maxSeats || 20)) * 100));
      const isAlmostFull = percent >= 90;

      const courseIcons = {
        Typing: { icon: "fa-keyboard", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.12)" },
        Word: { icon: "fa-file-word", color: "#185abd", bg: "rgba(24, 90, 189, 0.12)" },
        Excel: { icon: "fa-file-excel", color: "#107c41", bg: "rgba(16, 124, 65, 0.12)" },
        PowerPoint: { icon: "fa-file-powerpoint", color: "#d83b01", bg: "rgba(216, 59, 1, 0.12)" }
      };

      const meta = courseIcons[c.course] || { icon: "fa-desktop", color: "#6366f1", bg: "rgba(99, 102, 241, 0.12)" };

      return `
        <div class="card class-card" style="padding: 22px; border-radius: 18px; border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: all 0.25s ease;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 46px; height: 46px; border-radius: 12px; background: ${meta.bg}; color: ${meta.color}; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                  <i class="fa-solid ${meta.icon}"></i>
                </div>
                <div>
                  <span class="badge" style="background: rgba(99, 102, 241, 0.1); color: #6366f1; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 6px;">${c.id}</span>
                  <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; margin-top: 2px;">វេន${c.shift} (${c.time || '08:00 - 09:00'})</div>
                </div>
              </div>
              <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 0.74rem; font-weight: 700; padding: 3px 10px; border-radius: 20px;">
                ● ${c.status || 'សកម្ម'}
              </span>
            </div>

            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin: 0 0 10px 0; line-height: 1.4;">${c.name}</h3>

            <div style="background: var(--bg-main); padding: 12px 14px; border-radius: 12px; font-size: 0.82rem; display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);"><i class="fa-solid fa-chalkboard-user" style="width: 16px; color: #38bdf8;"></i> គ្រូទទួលបន្ទុក:</span>
                <span style="font-weight: 700; color: var(--text-main);">${c.teacher}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);"><i class="fa-solid fa-door-open" style="width: 16px; color: #f59e0b;"></i> ទីតាំង:</span>
                <span style="font-weight: 600; color: var(--text-main);">${c.room || 'បន្ទប់ Lab'}</span>
              </div>
            </div>

            <!-- Capacity Progress -->
            <div style="margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; margin-bottom: 6px;">
                <span style="color: var(--text-muted);">ចំនួនសិស្សកំពុងរៀន</span>
                <span style="color: ${isAlmostFull ? '#ef4444' : '#10b981'};">${displayCount} / ${c.maxSeats || 20} ម៉ាស៊ីន (${percent}%)</span>
              </div>
              <div style="width: 100%; height: 8px; border-radius: 8px; background: rgba(0,0,0,0.08); overflow: hidden;">
                <div style="width: ${percent}%; height: 100%; border-radius: 8px; background: ${isAlmostFull ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #6366f1, #38bdf8)'}; transition: width 0.3s ease;"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 8px; justify-content: space-between; align-items: center; pt: 10px; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" onclick="App.switchTab('timetable')" style="height: 32px; padding: 0 10px; font-size: 0.78rem; border-radius: 8px; color: #06b6d4;">
              <i class="fa-solid fa-desktop"></i> មើល Lab PC
            </button>
            <div style="display: flex; gap: 6px;">
              <button type="button" class="btn-secondary" onclick="ClassesView.openEditModal('${c.id}')" style="height: 32px; padding: 0 10px; font-size: 0.78rem; border-radius: 8px;">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" class="btn-secondary" onclick="ClassesView.handleDelete('${c.id}')" style="height: 32px; padding: 0 10px; font-size: 0.78rem; border-radius: 8px; color: #ef4444;">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  openAddModal() {
    const modal = document.getElementById("classModal");
    const form = document.getElementById("classForm");
    const title = document.getElementById("classModalTitle");
    if (!modal || !form) return;

    form.reset();
    document.getElementById("classEditId").value = "";
    if (title) title.innerHTML = `<i class="fa-solid fa-plus" style="color: #818cf8;"></i> <span>បង្កើតថ្នាក់កុំព្យូទ័រថ្មី</span>`;
    modal.style.display = "flex";
  },

  openEditModal(id) {
    const classes = this.getClasses();
    const c = classes.find(item => item.id === id);
    if (!c) return;

    const modal = document.getElementById("classModal");
    const title = document.getElementById("classModalTitle");
    if (!modal) return;

    document.getElementById("classEditId").value = c.id;
    document.getElementById("classInputName").value = c.name || "";
    document.getElementById("classInputCourse").value = c.course || "Typing";
    document.getElementById("classInputShift").value = c.shift || "ព្រឹក";
    document.getElementById("classInputRoom").value = c.room || "បន្ទប់ Computer Lab 01";
    document.getElementById("classInputTeacher").value = c.teacher || "លោកគ្រូ ខៀន ធូ";
    document.getElementById("classInputMaxSeats").value = c.maxSeats || 20;
    document.getElementById("classInputStatus").value = c.status || "សកម្ម";

    if (title) title.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: #818cf8;"></i> <span>កែសម្រួលថ្នាក់ (${c.id})</span>`;
    modal.style.display = "flex";
  },

  closeModal() {
    const modal = document.getElementById("classModal");
    if (modal) modal.style.display = "none";
  },

  handleSave(e) {
    e.preventDefault();
    const editId = document.getElementById("classEditId").value;
    const classes = this.getClasses();

    const name = document.getElementById("classInputName").value.trim();
    const course = document.getElementById("classInputCourse").value;
    const shift = document.getElementById("classInputShift").value;
    const room = document.getElementById("classInputRoom").value.trim();
    const teacher = document.getElementById("classInputTeacher").value.trim();
    const maxSeats = parseInt(document.getElementById("classInputMaxSeats").value) || 20;
    const status = document.getElementById("classInputStatus").value;

    const timeMap = {
      "ព្រឹក": "08:00 - 09:00",
      "ថ្ងៃ": "15:00 - 16:00",
      "រសៀល": "17:00 - 18:00"
    };

    if (editId) {
      const idx = classes.findIndex(c => c.id === editId);
      if (idx !== -1) {
        classes[idx] = {
          ...classes[idx],
          name, course, shift, room, teacher, maxSeats, status,
          time: timeMap[shift] || "08:00 - 09:00"
        };
      }
    } else {
      const prefix = "CLS-" + course.substring(0, 3).toUpperCase() + "-";
      const count = classes.filter(c => c.course === course).length + 1;
      const newId = prefix + String(count).padStart(2, "0");

      classes.push({
        id: newId,
        name, course, shift, room, teacher, maxSeats, status,
        time: timeMap[shift] || "08:00 - 09:00",
        occupiedSeats: 0
      });
    }

    this.saveClasses(classes);
    this.closeModal();
    this.renderGrid();
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("បានរក្សាទុកព័ត៌មានថ្នាក់កុំព្យូទ័រដោយជោគជ័យ!", "success");
    }
  },

  handleDelete(id) {
    if (!confirm(`តើអ្នកពិតជាចង់លុបថ្នាក់កុំព្យូទ័រ ID ${id} នេះមែនទេ? (ប្រសិនបើច្រឡំលុប អ្នកអាចចុចប៊ូតុង "ស្ដារដូចដើម" ឡើងវិញបាន)`)) return;
    let classes = this.getClasses();
    classes = classes.filter(c => c.id !== id);
    this.saveClasses(classes);
    this.renderGrid();
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("បានលុបថ្នាក់កុំព្យូទ័ររួចរាល់! (អាចចុច 'ស្ដារដូចដើម' បាន)", "info");
    }
  },

  initEvents() {
    const addBtn = document.getElementById("btnAddClassBtn");
    if (addBtn) addBtn.onclick = () => this.openAddModal();

    const searchInput = document.getElementById("classesSearchInput");
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderGrid();
      };
    }

    const courseFilter = document.getElementById("classesCourseFilter");
    if (courseFilter) {
      courseFilter.onchange = (e) => {
        this.filterCourse = e.target.value;
        this.renderGrid();
      };
    }

    const shiftFilter = document.getElementById("classesShiftFilter");
    if (shiftFilter) {
      shiftFilter.onchange = (e) => {
        this.filterShift = e.target.value;
        this.renderGrid();
      };
    }

    this.renderGrid();
  }
};

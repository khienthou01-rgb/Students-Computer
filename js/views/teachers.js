/**
 * View: Teachers Management (ប្រព័ន្ធគ្រប់គ្រងគ្រូបង្រៀន & បុគ្គលិកអប់រំ)
 * TIS Lab Computer - 2026 Modern EdTech UI
 * Fully integrated with AuthService & Firebase Realtime Database:
 * - Photo file upload with client-side canvas compression & 8 professional avatar presets
 * - System login credentials (Username & Password with show/hide toggle)
 * - Comprehensive teacher dossier (Contact, Telegram, Degree, Shifts, Experience, Address)
 * - Teacher Profile & Printable ID Card Modal with dynamic QR Code
 * - Official A4 Print Roster & Excel (.xlsx) Export
 */
const TeachersView = {
  searchQuery: "",
  filterSubject: "",
  filterStatus: "",
  filterShift: "",
  filterGender: "",
  currentAvatarDataUrl: "",

  // Curated Professional Preset Avatars (4 Male, 4 Female)
  presetAvatars: [
    {
      gender: "ប្រុស",
      title: "គ្រូប្រុស ១",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
    },
    {
      gender: "ប្រុស",
      title: "គ្រូប្រុស ២",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250"
    },
    {
      gender: "ប្រុស",
      title: "គ្រូប្រុស ៣",
      url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250"
    },
    {
      gender: "ប្រុស",
      title: "គ្រូប្រុស ៤",
      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250"
    },
    {
      gender: "ស្រី",
      title: "គ្រូស្រី ១",
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
    },
    {
      gender: "ស្រី",
      title: "គ្រូស្រី ២",
      url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"
    },
    {
      gender: "ស្រី",
      title: "គ្រូស្រី ៣",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
    },
    {
      gender: "ស្រី",
      title: "គ្រូស្រី ៤",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250"
    }
  ],

  // Available shifts for checkboxes
  availableShifts: [
    { id: "morning", label: "🌅 វេនព្រឹក (8:00 - 9:30 AM)" },
    { id: "noon", label: "☀️ វេនថ្ងៃ (11:00 - 12:30 PM)" },
    { id: "afternoon", label: "🌇 វេនរសៀល (2:00 - 3:30 PM)" },
    { id: "evening", label: "🌙 វេនយប់ (5:30 - 7:00 PM)" },
    { id: "weekend", label: "🗓️ ថ្នាក់ចុងសប្តាហ៍ (Weekend)" }
  ],

  // Get teachers list synced with AuthService & Cloud
  getTeachers() {
    if (typeof AuthService !== "undefined" && AuthService.getTeachers) {
      return AuthService.getTeachers();
    }
    try {
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEY_TEACHERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return (typeof APP_CONFIG !== "undefined" && APP_CONFIG.defaultTeachers) ? APP_CONFIG.defaultTeachers : [];
  },

  // Save teachers and sync to Firebase Realtime Database
  async saveTeachers(teachers) {
    if (typeof AuthService !== "undefined" && AuthService.saveTeachers) {
      await AuthService.saveTeachers(teachers);
    } else {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
    }
    if (typeof App !== "undefined" && App.updateSidebarCounters) {
      App.updateSidebarCounters();
    }
  },

  // Render Main Teacher Management View
  render() {
    return `
      <section id="view-teachers" class="page-view">
        <!-- Header Action Banner -->
        <div class="card" style="margin-bottom: 20px; padding: 22px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid #0284c7; background: var(--bg-card);">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-chalkboard-user" style="color: #0284c7;"></i>
              <span>គ្រប់គ្រងគ្រូបង្រៀនកុំព្យូទ័រ (Teachers Management)</span>
              <span id="teachersCountBadge" class="badge" style="background: rgba(2, 132, 199, 0.12); color: #0284c7; font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">0 នាក់</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              ព័ត៌មានលម្អិតគ្រូបង្រៀន រូបថត គណនី Login មុខវិជ្ជាទទួលបន្ទុក កាលវិភាគបង្រៀន និងការគ្រប់គ្រងបុគ្គលិកអប់រំ
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <button type="button" id="btnExportTeachersExcelBtn" class="btn-secondary" style="height: 42px; padding: 0 16px; font-size: 0.88rem; font-weight: 600; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px;" title="ទាញយកបញ្ជីគ្រូជា Excel (.xlsx)">
              <i class="fa-solid fa-file-excel" style="color: #10b981;"></i> <span>Export Excel</span>
            </button>
            <button type="button" id="btnPrintTeachersBtn" class="btn-secondary" style="height: 42px; padding: 0 16px; font-size: 0.88rem; font-weight: 600; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px;" title="បោះពុម្ពបញ្ជីផ្លូវការ A4">
              <i class="fa-solid fa-print" style="color: #0284c7;"></i> <span>បោះពុម្ពបញ្ជី A4</span>
            </button>
            <button type="button" id="btnAddTeacherBtn" class="btn-primary" style="height: 42px; padding: 0 20px; font-size: 0.88rem; font-weight: 700; background: linear-gradient(135deg, #0284c7, #38bdf8); border: none; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);">
              <i class="fa-solid fa-user-plus"></i> <span>+ បន្ថែមគ្រូថ្មី (Add Teacher)</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Stat Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 22px;">
          <div class="kpi-card" style="border-top: 3px solid #0284c7; background: var(--bg-card); padding: 18px; border-radius: 16px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600; margin-bottom: 6px;">គ្រូបង្រៀនសរុប</div>
                <div id="kpiTeacherTotal" style="font-size: 1.7rem; font-weight: 800; color: #0284c7;">0</div>
                <div style="font-size: 0.76rem; color: #10b981; margin-top: 4px;"><i class="fa-solid fa-circle-check"></i> បុគ្គលិកពេញសិទ្ធិ</div>
              </div>
              <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(2, 132, 199, 0.12); color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                <i class="fa-solid fa-users"></i>
              </div>
            </div>
          </div>

          <div class="kpi-card" style="border-top: 3px solid #6366f1; background: var(--bg-card); padding: 18px; border-radius: 16px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600; margin-bottom: 6px;">គ្រូប្រុស</div>
                <div id="kpiTeacherMale" style="font-size: 1.7rem; font-weight: 800; color: #6366f1;">0</div>
                <div id="kpiTeacherMalePct" style="font-size: 0.76rem; color: var(--text-muted); margin-top: 4px;">0% នៃគ្រូសរុប</div>
              </div>
              <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(99, 102, 241, 0.12); color: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                <i class="fa-solid fa-mars"></i>
              </div>
            </div>
          </div>

          <div class="kpi-card" style="border-top: 3px solid #ec4899; background: var(--bg-card); padding: 18px; border-radius: 16px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600; margin-bottom: 6px;">គ្រូស្រី</div>
                <div id="kpiTeacherFemale" style="font-size: 1.7rem; font-weight: 800; color: #ec4899;">0</div>
                <div id="kpiTeacherFemalePct" style="font-size: 0.76rem; color: var(--text-muted); margin-top: 4px;">0% នៃគ្រូសរុប</div>
              </div>
              <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(236, 72, 153, 0.12); color: #ec4899; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                <i class="fa-solid fa-venus"></i>
              </div>
            </div>
          </div>

          <div class="kpi-card" style="border-top: 3px solid #10b981; background: var(--bg-card); padding: 18px; border-radius: 16px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600; margin-bottom: 6px;">ស្ថានភាពសកម្ម</div>
                <div id="kpiTeacherActive" style="font-size: 1.7rem; font-weight: 800; color: #10b981;">100%</div>
                <div style="font-size: 0.76rem; color: #10b981; margin-top: 4px;"><i class="fa-solid fa-circle" style="font-size: 0.55rem;"></i> កំពុងបង្រៀនជាក់ស្តែង</div>
              </div>
              <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(16, 185, 129, 0.12); color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                <i class="fa-solid fa-user-check"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="card" style="padding: 16px 20px; margin-bottom: 22px; display: flex; gap: 14px; flex-wrap: wrap; align-items: center; background: var(--bg-card);">
          <div style="flex: 1; min-width: 240px; position: relative;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
            <input type="text" id="teacherSearchInput" placeholder="ស្វែងរកតាមឈ្មោះ, ID, លេខទូរស័ព្ទ, គណនី Login..." class="form-control" style="padding-left: 40px; height: 42px; border-radius: 12px;">
          </div>

          <select id="teacherSubjectFilter" class="form-control" style="width: auto; min-width: 170px; height: 42px; border-radius: 12px;">
            <option value="">-- ជំនាញទាំងអស់ --</option>
            <option value="Typing">Typing (វាយអត្ថបទ)</option>
            <option value="Word">Microsoft Word</option>
            <option value="Excel">Microsoft Excel</option>
            <option value="PowerPoint">Microsoft PowerPoint</option>
            <option value="Admin">Computer & Network Admin</option>
            <option value="Graphic">Graphic Design</option>
          </select>

          <select id="teacherShiftFilter" class="form-control" style="width: auto; min-width: 150px; height: 42px; border-radius: 12px;">
            <option value="">-- គ្រប់វេនបង្រៀន --</option>
            <option value="morning">វេនព្រឹក</option>
            <option value="noon">វេនថ្ងៃ</option>
            <option value="afternoon">វេនរសៀល</option>
            <option value="evening">វេនយប់</option>
            <option value="weekend">ចុងសប្តាហ៍</option>
          </select>

          <select id="teacherGenderFilter" class="form-control" style="width: auto; min-width: 120px; height: 42px; border-radius: 12px;">
            <option value="">-- ភេទទាំងអស់ --</option>
            <option value="ប្រុស">ប្រុស</option>
            <option value="ស្រី">ស្រី</option>
          </select>

          <select id="teacherStatusFilter" class="form-control" style="width: auto; min-width: 140px; height: 42px; border-radius: 12px;">
            <option value="">-- គ្រប់ស្ថានភាព --</option>
            <option value="សកម្ម">សកម្ម (Active)</option>
            <option value="ឈប់សម្រាក">ឈប់សម្រាក (Leave)</option>
            <option value="ផ្អាក">ផ្អាក (Inactive)</option>
          </select>

          <button type="button" id="btnClearTeacherFilterBtn" class="btn-secondary" style="height: 42px; padding: 0 14px; border-radius: 12px;" title="ជម្រះតម្រង">
            <i class="fa-solid fa-filter-circle-xmark"></i>
          </button>
        </div>

        <!-- Teachers Cards Grid -->
        <div id="teachersCardsContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 20px;">
          <!-- Dynamically Rendered -->
        </div>

        <!-- ========================================================= -->
        <!-- MODAL 1: ADD / EDIT TEACHER WITH PHOTO UPLOADER & LOGIN  -->
        <!-- ========================================================= -->
        <div id="tchManageModal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); z-index: 99999; align-items: center; justify-content: center; padding: 16px;">
          <div class="modal-card" style="max-width: 680px; width: 100%; max-height: 90vh; overflow-y: auto; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); animation: msSlideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
            <div class="modal-header" style="padding: 20px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); border-radius: 24px 24px 0 0;">
              <h3 id="tchModalTitle" style="margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-user-plus" style="color: #0284c7;"></i>
                <span>បន្ថែមគ្រូបង្រៀនថ្មី</span>
              </h3>
              <button type="button" class="modal-close-btn" id="closeTchModalBtn" style="background: none; border: none; font-size: 1.2rem; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 8px;">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form id="tchManageForm" autocomplete="off" style="padding: 24px;">
              <input type="hidden" id="tchEditId" value="">

              <!-- PHOTO / AVATAR MANAGEMENT BOX (FEATURED) -->
              <div class="avatar-upload-card" id="tchAvatarUploadBox">
                <div class="avatar-preview-wrap">
                  <img id="tchAvatarPreview" src="assets/images/default-male.svg" alt="Avatar" onerror="this.src='assets/images/default-male.svg'">
                  <label for="tchFileInput" class="avatar-edit-overlay" title="ចុចប្តូររូបថត">
                    <i class="fa-solid fa-camera"></i>
                  </label>
                </div>

                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin: 0;">
                      <i class="fa-solid fa-image text-indigo-500"></i> រូបថតគ្រូបង្រៀន (Photo / Avatar)
                    </label>
                    <button type="button" id="btnClearTchAvatarBtn" style="background: none; border: none; font-size: 0.75rem; color: #ef4444; cursor: pointer; font-weight: 600;">
                      <i class="fa-solid fa-rotate-left"></i> រូបលំនាំដើម
                    </button>
                  </div>

                  <!-- Upload Buttons & Dropzone -->
                  <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
                    <label class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem; cursor: pointer; border-radius: 10px; display: inline-flex; align-items: center; gap: 6px; background: #0284c7; border: none; font-weight: 700; margin: 0;">
                      <i class="fa-solid fa-cloud-arrow-up"></i>
                      <span>Upload រូបពីកុំព្យូទ័រ/ទូរស័ព្ទ</span>
                      <input type="file" id="tchFileInput" accept="image/*" style="display: none;">
                    </label>
                    <button type="button" id="btnToggleTchPresetAvatars" class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 10px; font-weight: 600;">
                      <i class="fa-solid fa-icons" style="color: #f59e0b;"></i> រូបគំរូស្អាតៗ (Presets)
                    </button>
                  </div>

                  <!-- Direct URL input -->
                  <input type="text" id="tchInputAvatar" class="form-control" placeholder="https://... ឬ Link រូបភាពខាងក្រៅ" style="height: 34px; font-size: 0.78rem; border-radius: 8px;">

                  <!-- 8 Quick Preset Avatars (Toggled) -->
                  <div id="tchPresetAvatarsPicker" style="margin-top: 10px; display: none; background: var(--bg-surface); padding: 10px; border-radius: 12px; border: 1px solid var(--border-color);">
                    <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">
                      👉 ចុចលើរូបណាមួយដើម្បីជ្រើសរើសភ្លាមៗ៖
                    </div>
                    <div class="preset-avatars-grid">
                      ${this.presetAvatars.map((p, idx) => `
                        <div class="preset-avatar-item" data-avatar-url="${p.url}" title="${p.title} (${p.gender})">
                          <img src="${p.url}" alt="${p.title}" loading="lazy">
                        </div>
                      `).join("")}
                    </div>
                  </div>
                </div>
              </div>

              <!-- SYSTEM LOGIN CREDENTIALS SECTION (USER REQUESTED) -->
              <div style="background: linear-gradient(135deg, rgba(2, 132, 199, 0.07), rgba(99, 102, 241, 0.07)); border: 1px solid rgba(2, 132, 199, 0.25); border-radius: 16px; padding: 16px; margin-bottom: 20px;">
                <div style="font-size: 0.85rem; font-weight: 800; color: #0284c7; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span>គណនី និងពាក្យសម្ងាត់សម្រាប់ Login ចូលប្រព័ន្ធ (System Login Credentials)</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                  <div class="form-group" style="margin: 0;">
                    <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">
                      ឈ្មោះគណនី (Username) <span style="color: #ef4444;">*</span>
                    </label>
                    <div style="position: relative;">
                      <i class="fa-solid fa-user" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.85rem;"></i>
                      <input type="text" id="tchInputUsername" class="form-control" required placeholder="ឧ. khienthou, vanna" style="padding-left: 36px; font-weight: 700;">
                    </div>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">ជាអក្សរឡាតាំងជាប់គ្នា គ្មានដកឃ្លា</span>
                  </div>

                  <div class="form-group" style="margin: 0;">
                    <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">
                      ពាក្យសម្ងាត់ (Password) <span style="color: #ef4444;">*</span>
                    </label>
                    <div style="position: relative;">
                      <i class="fa-solid fa-key" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.85rem;"></i>
                      <input type="password" id="tchInputPassword" class="form-control" required placeholder="បញ្ចូលពាក្យសម្ងាត់" value="123456" style="padding-left: 36px; padding-right: 38px; font-weight: 700;">
                      <button type="button" id="btnToggleTchPasswordVisibility" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;">
                        <i class="fa-solid fa-eye" id="tchPasswordEyeIcon"></i>
                      </button>
                    </div>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">លំនាំដើម: 123456 (អាចប្តូរបាន)</span>
                  </div>
                </div>
              </div>

              <!-- PERSONAL INFORMATION (NAMES & GENDER) -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">ឈ្មោះភាសាខ្មែរ <span style="color: #ef4444;">*</span></label>
                  <input type="text" id="tchInputNameKh" class="form-control" placeholder="ឧ. លោកគ្រូ ហុង វណ្ណា" required>
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">ឈ្មោះជាឡាតាំង (English Name)</label>
                  <input type="text" id="tchInputNameEn" class="form-control" placeholder="ឧ. Mr. HONG VANNA">
                </div>
              </div>

              <!-- GENDER, DOB, AND ROLE -->
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">ភេទ</label>
                  <select id="tchInputGender" class="form-control">
                    <option value="ប្រុស">ប្រុស (Male)</option>
                    <option value="ស្រី">ស្រី (Female)</option>
                  </select>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">ថ្ងៃខែឆ្នាំកំណើត</label>
                  <input type="date" id="tchInputDob" class="form-control">
                </div>

                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">តួនាទី / មុខតំណែង</label>
                  <select id="tchInputRole" class="form-control">
                    <option value="គ្រូបង្រៀន">គ្រូបង្រៀន (Teacher)</option>
                    <option value="គ្រូបង្រៀន & អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin)">គ្រូបង្រៀន & Admin</option>
                    <option value="ប្រធានបន្ទប់កុំព្យូទ័រ">ប្រធានបន្ទប់កុំព្យូទ័រ (Lab Head)</option>
                    <option value="គ្រូបង្រៀនបច្ចេកទេស">គ្រូបង្រៀនបច្ចេកទេស</option>
                    <option value="ជំនួយការគ្រូ">ជំនួយការគ្រូ (Assistant)</option>
                  </select>
                </div>
              </div>

              <!-- CONTACT INFO: PHONE, TELEGRAM, EMAIL -->
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">លេខទូរស័ព្ទ <span style="color: #ef4444;">*</span></label>
                  <input type="text" id="tchInputPhone" class="form-control" placeholder="ឧ. 071 721 0307" required>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">តេឡេក្រាម (Telegram)</label>
                  <input type="text" id="tchInputTelegram" class="form-control" placeholder="0717210307 ឬ @username">
                </div>

                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">អ៊ីមែល (Email)</label>
                  <input type="email" id="tchInputEmail" class="form-control" placeholder="teacher@gmail.com">
                </div>
              </div>

              <!-- SPECIALIZATION & DEGREE -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">ជំនាញឯកទេសទទួលបន្ទុក <span style="color: #ef4444;">*</span></label>
                  <input type="text" id="tchInputSubject" class="form-control" required placeholder="ឧ. Typing, MS Word & Excel, Computer Admin">
                </div>

                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">កម្រិតសញ្ញាបត្រ / វប្បធម៌</label>
                  <input type="text" id="tchInputDegree" class="form-control" placeholder="ឧ. បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ (BSc CS)">
                </div>
              </div>

              <!-- TEACHING SHIFTS (CHECKBOX PILLS) -->
              <div class="form-group" style="margin-bottom: 14px;">
                <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 6px; display: block;">
                  <i class="fa-solid fa-clock text-amber-500"></i> វេនបង្រៀនទទួលបន្ទុក (Teaching Shifts)
                </label>
                <div class="shift-pills-wrap" id="tchShiftsPills">
                  ${this.availableShifts.map(s => `
                    <label class="shift-pill-check" data-shift="${s.id}">
                      <input type="checkbox" name="tchShifts" value="${s.id}">
                      <span>${s.label}</span>
                    </label>
                  `).join("")}
                </div>
              </div>

              <!-- JOIN DATE, EXPERIENCE, ADDRESS, AND STATUS -->
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">កាលបរិច្ឆេទចូលបម្រើការ</label>
                  <input type="date" id="tchInputJoinDate" class="form-control">
                </div>

                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">បទពិសោធន៍បង្រៀន</label>
                  <input type="text" id="tchInputExperience" class="form-control" placeholder="ឧ. ៣ ឆ្នាំ">
                </div>

                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">ស្ថានភាព</label>
                  <select id="tchInputStatus" class="form-control">
                    <option value="សកម្ម">សកម្ម (Active)</option>
                    <option value="ឈប់សម្រាក">ឈប់សម្រាក (On Leave)</option>
                    <option value="ផ្អាក">ផ្អាក (Inactive)</option>
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 14px;">
                <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">អាសយដ្ឋានបច្ចុប្បន្ន</label>
                <input type="text" id="tchInputAddress" class="form-control" placeholder="ឧ. ក្រុងកំពត ខេត្តកំពត">
              </div>

              <div class="form-group" style="margin-bottom: 24px;">
                <label style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px; display: block;">កំណត់សម្គាល់បន្ថែម (Bio / Notes)</label>
                <textarea id="tchInputNotes" class="form-control" rows="2" placeholder="កំណត់សម្គាល់ឯកទេស ឬការទទួលខុសត្រូវបន្ថែម..."></textarea>
              </div>

              <!-- MODAL ACTION BUTTONS -->
              <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--border-color); padding-top: 18px;">
                <button type="button" class="btn-secondary" id="btnCancelTchModal" style="padding: 10px 20px; border-radius: 12px; font-weight: 600;">បោះបង់</button>
                <button type="submit" class="btn-primary" id="btnSaveTchSubmit" style="padding: 10px 24px; border-radius: 12px; font-weight: 700; background: linear-gradient(135deg, #0284c7, #38bdf8); border: none; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);">
                  <i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកទិន្នន័យ</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- MODAL 2: TEACHER PROFILE & PRINTABLE ID CARD DIALOG       -->
        <!-- ========================================================= -->
        <div id="tchProfileModal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); z-index: 99999; align-items: center; justify-content: center; padding: 16px;">
          <div class="modal-card" style="max-width: 580px; width: 100%; max-height: 92vh; overflow-y: auto; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); position: relative;">
            <button type="button" class="modal-close-btn" id="closeTchProfileModalBtn" style="position: absolute; top: 14px; right: 14px; background: rgba(0,0,0,0.4); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 20;">
              <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Card Cover & Avatar -->
            <div class="teacher-profile-cover">
              <div class="teacher-profile-avatar">
                <img id="profAvatar" src="assets/images/default-male.svg" alt="Teacher">
              </div>
              <div style="position: absolute; right: 20px; bottom: 12px;">
                <span id="profStatusBadge" class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.4);">
                  ● សកម្ម
                </span>
              </div>
            </div>

            <div style="padding: 50px 24px 24px 24px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="font-size: 0.8rem; font-weight: 800; color: #0284c7; letter-spacing: 0.5px;" id="profId">TCH-001</div>
                  <h2 style="margin: 2px 0; font-size: 1.35rem; font-weight: 800; color: var(--text-main);" id="profNameKh">លោកគ្រូ ខៀន ធូ</h2>
                  <div style="font-size: 0.88rem; color: var(--text-muted); font-weight: 600;" id="profNameEn">Mr. KHIEN THOU</div>
                </div>
                <div>
                  <span id="profRoleBadge" class="teacher-role-tag" style="font-size: 0.8rem; padding: 5px 12px;">
                    គ្រូបង្រៀន & Admin
                  </span>
                </div>
              </div>

              <!-- Login Credentials Pill for Admin Reference -->
              <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 14px; padding: 12px 16px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">គណនី Login (Username & Password)</div>
                  <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">
                    <span id="profUsernameDisplay">khienthou</span> • 
                    <span id="profPasswordDisplay" style="color: #0284c7; font-family: monospace;">••••••</span>
                  </div>
                </div>
                <button type="button" id="btnCopyTeacherLogin" class="btn-secondary" style="height: 32px; font-size: 0.75rem; padding: 0 10px; border-radius: 8px;" title="ចម្លងព័ត៌មាន Login">
                  <i class="fa-regular fa-copy"></i> Copy Login
                </button>
              </div>

              <!-- Information Grid -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; font-size: 0.82rem;">
                <div style="background: var(--bg-surface); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color);">
                  <div style="color: var(--text-muted); font-size: 0.74rem;">ជំនាញឯកទេស</div>
                  <div style="font-weight: 700; color: var(--text-main);" id="profSubject">កុំព្យូទ័រ</div>
                </div>

                <div style="background: var(--bg-surface); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color);">
                  <div style="color: var(--text-muted); font-size: 0.74rem;">កម្រិតសញ្ញាបត្រ</div>
                  <div style="font-weight: 700; color: var(--text-main);" id="profDegree">បរិញ្ញាបត្រ</div>
                </div>

                <div style="background: var(--bg-surface); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color);">
                  <div style="color: var(--text-muted); font-size: 0.74rem;">វេនបង្រៀន</div>
                  <div style="font-weight: 700; color: var(--text-main);" id="profShifts">គ្រប់វេន</div>
                </div>

                <div style="background: var(--bg-surface); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color);">
                  <div style="color: var(--text-muted); font-size: 0.74rem;">បទពិសោធន៍</div>
                  <div style="font-weight: 700; color: var(--text-main);" id="profExperience">៣ ឆ្នាំ</div>
                </div>

                <div style="background: var(--bg-surface); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color);">
                  <div style="color: var(--text-muted); font-size: 0.74rem;">ទូរស័ព្ទ</div>
                  <div style="font-weight: 700;" id="profPhone">071...</div>
                </div>

                <div style="background: var(--bg-surface); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color);">
                  <div style="color: var(--text-muted); font-size: 0.74rem;">តេឡេក្រាម</div>
                  <div style="font-weight: 700; color: #0088cc;" id="profTelegram">@...</div>
                </div>

                <div style="grid-column: 1 / -1; background: var(--bg-surface); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color);">
                  <div style="color: var(--text-muted); font-size: 0.74rem;">អាសយដ្ឋាន</div>
                  <div style="font-weight: 600; color: var(--text-main);" id="profAddress">ខេត្តកំពត</div>
                </div>
              </div>

              <!-- QR Code & Quick Contact Bar -->
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; background: var(--bg-main); padding: 14px; border-radius: 14px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div id="profQrContainer" style="width: 58px; height: 58px; background: #fff; border-radius: 8px; padding: 4px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);"></div>
                  <div>
                    <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-main);">Teacher QR Verify</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">ស្កេនមើលព័ត៌មានគ្រូ & Contact</div>
                  </div>
                </div>

                <div style="display: flex; gap: 8px;">
                  <a id="profCallBtn" href="tel:" class="teacher-action-btn call-btn" style="width: 38px; height: 38px;" title="Call">
                    <i class="fa-solid fa-phone"></i>
                  </a>
                  <a id="profTgBtn" href="#" target="_blank" class="teacher-action-btn tg-btn" style="width: 38px; height: 38px;" title="Telegram">
                    <i class="fa-brands fa-telegram"></i>
                  </a>
                </div>
              </div>

              <!-- Profile Modal Footer Actions -->
              <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                <button type="button" class="btn-secondary" id="btnPrintSingleTeacherCard" style="border-radius: 10px; font-weight: 600;">
                  <i class="fa-solid fa-id-card"></i> បោះពុម្ពកាតគ្រូ
                </button>
                <button type="button" class="btn-primary" id="btnEditFromProfile" style="border-radius: 10px; font-weight: 700; background: #0284c7; border: none;">
                  <i class="fa-solid fa-pen-to-square"></i> កែប្រែព័ត៌មាន
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Hidden Container for Official A4 Printable Roster -->
        <div id="officialTeacherPrintArea" style="display: none;"></div>
      </section>
    `;
  },

  // Client-side smart image compression (Canvas WebP/JPEG)
  compressImage(file, maxDimension = 360, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          let dataUrl = canvas.toDataURL("image/webp", quality);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  renderTable() {
    this.renderCards();
  },

  // Render dynamic Teacher Cards Grid
  renderCards() {
    const container = document.getElementById("teachersCardsContainer");
    if (!container) return;

    const teachers = this.getTeachers();
    const query = this.searchQuery.toLowerCase().trim();
    const subj = this.filterSubject.toLowerCase();
    const stat = this.filterStatus;
    const shift = this.filterShift.toLowerCase();
    const gender = this.filterGender;

    const filtered = teachers.filter(t => {
      const matchQ = !query || 
        (t.nameKh && t.nameKh.toLowerCase().includes(query)) ||
        (t.nameEn && t.nameEn.toLowerCase().includes(query)) ||
        (t.phone && t.phone.includes(query)) ||
        (t.username && t.username.toLowerCase().includes(query)) ||
        (t.id && t.id.toLowerCase().includes(query));
      
      const matchS = !subj || 
        (t.subject && t.subject.toLowerCase().includes(subj)) ||
        (t.classes && t.classes.toLowerCase().includes(subj));

      const matchSt = !stat || (t.status === stat);

      const matchShift = !shift || 
        (t.shifts && t.shifts.some(s => s.toLowerCase().includes(shift))) ||
        (t.classes && t.classes.toLowerCase().includes(shift));

      const matchG = !gender || (t.gender === gender);

      return matchQ && matchS && matchSt && matchShift && matchG;
    });

    // Update KPIs
    const totalCount = teachers.length;
    const maleCount = teachers.filter(t => t.gender === "ប្រុស").length;
    const femaleCount = teachers.filter(t => t.gender === "ស្រី").length;
    const activeCount = teachers.filter(t => t.status !== "ឈប់សម្រាក" && t.status !== "ផ្អាក").length;
    const activePct = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 100;

    const totalEl = document.getElementById("kpiTeacherTotal");
    const maleEl = document.getElementById("kpiTeacherMale");
    const femaleEl = document.getElementById("kpiTeacherFemale");
    const activeEl = document.getElementById("kpiTeacherActive");
    const badgeEl = document.getElementById("teachersCountBadge");

    if (totalEl) totalEl.textContent = totalCount;
    if (maleEl) {
      maleEl.textContent = maleCount;
      const malePctEl = document.getElementById("kpiTeacherMalePct");
      if (malePctEl) malePctEl.textContent = `${totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0}% នៃគ្រូសរុប`;
    }
    if (femaleEl) {
      femaleEl.textContent = femaleCount;
      const femalePctEl = document.getElementById("kpiTeacherFemalePct");
      if (femalePctEl) femalePctEl.textContent = `${totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0}% នៃគ្រូសរុប`;
    }
    if (activeEl) activeEl.textContent = `${activePct}%`;
    if (badgeEl) badgeEl.textContent = `${filtered.length} នាក់`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: var(--bg-card); border-radius: 20px; border: 2px dashed var(--border-color);">
          <i class="fa-solid fa-chalkboard-user" style="font-size: 3rem; color: var(--text-muted); opacity: 0.4; margin-bottom: 14px;"></i>
          <h4 style="font-size: 1.1rem; color: var(--text-main); margin: 0 0 6px 0;">រកមិនឃើញព័ត៌មានគ្រូបង្រៀនឡើយ</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">សូមសាកល្បងជម្រះតម្រងស្វែងរក ឬចុចប៊ូតុង "+ បន្ថែមគ្រូថ្មី" ខាងលើ</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => {
      const isMale = t.gender === "ប្រុស";
      const defaultAvatar = isMale ? "assets/images/default-male.svg" : "assets/images/default-female.svg";
      const avatarSrc = t.avatar || defaultAvatar;
      const role = t.role || "គ្រូបង្រៀន";
      const isAdmin = role.includes("Admin");
      const isHead = role.includes("ប្រធាន");

      const tgClean = (t.telegram || t.phone || "").replace(/^@/, "").replace(/\s+/g, "");
      const tgLink = tgClean ? (tgClean.startsWith("+") ? `https://t.me/${tgClean}` : `https://t.me/+855${tgClean.replace(/^0/, '')}`) : "#";

      return `
        <div class="card teacher-card" data-teacher-id="${t.id}">
          <div>
            <!-- Top Row: Role & Status -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <span class="teacher-role-tag ${isAdmin ? 'teacher-role-admin' : isHead ? 'teacher-role-head' : ''}">
                <i class="fa-solid ${isAdmin ? 'fa-shield-halved' : isHead ? 'fa-award' : 'fa-chalkboard-user'}"></i>
                ${role}
              </span>
              <span class="badge" style="background: ${t.status === 'សកម្ម' || !t.status ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${t.status === 'សកម្ម' || !t.status ? '#10b981' : '#ef4444'}; font-size: 0.74rem; font-weight: 700; padding: 3px 10px; border-radius: 20px;">
                ● ${t.status || 'សកម្ម'}
              </span>
            </div>

            <!-- Profile Info: Avatar + Names -->
            <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 16px; cursor: pointer;" onclick="TeachersView.openProfileModal('${t.id}')">
              <div class="teacher-avatar-ring">
                <img src="${avatarSrc}" alt="${t.nameKh}" onerror="this.src='${defaultAvatar}'">
                <span class="teacher-online-dot"></span>
              </div>
              <div style="overflow: hidden;">
                <div style="font-size: 0.74rem; font-weight: 800; color: #0284c7; letter-spacing: 0.5px;">${t.id || 'TCH'}</div>
                <h3 style="margin: 2px 0; font-size: 1.08rem; font-weight: 800; color: var(--text-main); white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${t.nameKh}</h3>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${t.nameEn || ''}</div>
              </div>
            </div>

            <!-- Login Credentials Badge (Helpful for Lab Admin) -->
            ${t.username ? `
              <div style="background: rgba(2, 132, 199, 0.06); border: 1px dashed rgba(2, 132, 199, 0.3); border-radius: 10px; padding: 6px 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
                <div>
                  <span style="color: var(--text-muted);">Login:</span>
                  <strong style="color: #0284c7; font-family: monospace;">${t.username}</strong>
                  <span style="color: var(--text-muted); margin: 0 4px;">|</span>
                  <span style="color: var(--text-muted); font-family: monospace;">••••••</span>
                </div>
                <button type="button" onclick="event.stopPropagation(); TeachersView.copyLoginCredentials('${t.username}', '${t.password || '123456'}')" style="background: none; border: none; color: #0284c7; cursor: pointer; font-size: 0.75rem;" title="Copy Username & Password">
                  <i class="fa-regular fa-copy"></i> Copy
                </button>
              </div>
            ` : ''}

            <!-- Details Block -->
            <div style="background: var(--bg-main); padding: 12px 14px; border-radius: 14px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);"><i class="fa-solid fa-award" style="color: #f59e0b; width: 16px;"></i> ជំនាញ:</span>
                <span style="font-weight: 700; color: var(--text-main); text-align: right;">${t.subject || 'កុំព្យូទ័ររដ្ឋបាល'}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);"><i class="fa-solid fa-clock" style="color: #6366f1; width: 16px;"></i> ថ្នាក់/វេន:</span>
                <span style="font-weight: 600; color: var(--text-main); text-align: right; max-width: 170px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" title="${t.classes || 'គ្រប់វេន'}">${t.classes || 'គ្រប់វេន'}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);"><i class="fa-solid fa-phone" style="color: #10b981; width: 16px;"></i> ទូរស័ព្ទ:</span>
                <a href="tel:${t.phone}" style="font-weight: 700; color: #0284c7; text-decoration: none;">${t.phone || 'N/A'}</a>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons Group -->
          <div style="display: flex; justify-content: space-between; align-items: center; pt: 12px; border-top: 1px solid var(--border-color); margin-top: 4px;">
            <div style="display: flex; gap: 6px;">
              ${t.phone ? `
                <a href="tel:${t.phone}" class="teacher-action-btn call-btn" title="Call ទៅគ្រូ">
                  <i class="fa-solid fa-phone"></i>
                </a>
              ` : ''}
              ${tgClean ? `
                <a href="${tgLink}" target="_blank" class="teacher-action-btn tg-btn" title="ផ្ញើសារ Telegram">
                  <i class="fa-brands fa-telegram"></i>
                </a>
              ` : ''}
              <button type="button" class="teacher-action-btn view-btn" onclick="TeachersView.openProfileModal('${t.id}')" title="មើលកាត & ប្រវត្តិរូប">
                <i class="fa-solid fa-id-card"></i>
              </button>
            </div>

            <div style="display: flex; gap: 6px;">
              <button type="button" class="teacher-action-btn edit-btn" onclick="TeachersView.openEditModal('${t.id}')" title="កែប្រែព័ត៌មាន">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="teacher-action-btn del-btn" onclick="TeachersView.handleDelete('${t.id}')" title="លុបគ្រូ">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  // Open Add Teacher Modal
  openAddModal() {
    const modal = document.getElementById("tchManageModal");
    const title = document.getElementById("tchModalTitle");
    const form = document.getElementById("tchManageForm");
    if (!modal || !form) return;

    form.reset();
    document.getElementById("tchEditId").value = "";
    this.currentAvatarDataUrl = "";

    const preview = document.getElementById("tchAvatarPreview");
    if (preview) preview.src = "assets/images/default-male.svg";

    // Auto generate next TCH ID
    const teachers = this.getTeachers();
    const nextNum = teachers.length + 1;
    const nextId = "TCH-" + String(nextNum).padStart(3, "0");

    // Suggest default username
    const usernameInput = document.getElementById("tchInputUsername");
    if (usernameInput) {
      usernameInput.value = `teacher${nextNum}`;
      delete usernameInput.dataset.manuallyEdited;
    }

    const pwdInput = document.getElementById("tchInputPassword");
    if (pwdInput) pwdInput.value = "123456";

    const joinDateInput = document.getElementById("tchInputJoinDate");
    if (joinDateInput) joinDateInput.value = new Date().toISOString().split("T")[0];

    // Reset shift pill checkboxes
    document.querySelectorAll("#tchShiftsPills input[type='checkbox']").forEach(cb => {
      cb.checked = false;
      cb.parentElement.classList.remove("active");
    });

    if (title) title.innerHTML = `<i class="fa-solid fa-user-plus" style="color: #0284c7;"></i> <span>បន្ថែមគ្រូបង្រៀនថ្មី (${nextId})</span>`;

    modal.style.display = "flex";
  },

  // Open Edit Teacher Modal
  openEditModal(id) {
    const teachers = this.getTeachers();
    const t = teachers.find(item => item.id === id || item.username === id);
    if (!t) return;

    const modal = document.getElementById("tchManageModal");
    const title = document.getElementById("tchModalTitle");
    if (!modal) return;

    document.getElementById("tchEditId").value = t.id || id;
    document.getElementById("tchInputNameKh").value = t.nameKh || "";
    document.getElementById("tchInputNameEn").value = t.nameEn || "";
    document.getElementById("tchInputUsername").value = t.username || "";
    document.getElementById("tchInputPassword").value = t.password || "123456";
    document.getElementById("tchInputGender").value = t.gender || "ប្រុស";
    document.getElementById("tchInputDob").value = t.dob || "";
    document.getElementById("tchInputRole").value = t.role || "គ្រូបង្រៀន";
    document.getElementById("tchInputPhone").value = t.phone || "";
    document.getElementById("tchInputTelegram").value = t.telegram || "";
    document.getElementById("tchInputEmail").value = t.email || "";
    document.getElementById("tchInputSubject").value = t.subject || "";
    document.getElementById("tchInputDegree").value = t.degree || "";
    document.getElementById("tchInputJoinDate").value = t.joinDate || "";
    document.getElementById("tchInputExperience").value = t.experience || "";
    document.getElementById("tchInputStatus").value = t.status || "សកម្ម";
    document.getElementById("tchInputAddress").value = t.address || "";
    document.getElementById("tchInputNotes").value = t.notes || "";
    document.getElementById("tchInputAvatar").value = t.avatar || "";

    this.currentAvatarDataUrl = t.avatar || "";
    const preview = document.getElementById("tchAvatarPreview");
    const defaultAv = t.gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
    if (preview) preview.src = t.avatar || defaultAv;

    // Check shift pill checkboxes
    const activeShifts = Array.isArray(t.shifts) ? t.shifts : (t.classes ? t.classes.split(/,\s*/) : []);
    document.querySelectorAll("#tchShiftsPills input[type='checkbox']").forEach(cb => {
      const match = activeShifts.some(s => s.toLowerCase().includes(cb.value.toLowerCase()));
      cb.checked = match;
      if (match) cb.parentElement.classList.add("active");
      else cb.parentElement.classList.remove("active");
    });

    if (title) title.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: #0284c7;"></i> <span>កែសម្រួលព័ត៌មានគ្រូ (${t.id || t.username})</span>`;
    modal.style.display = "flex";
  },

  closeModal() {
    const modal = document.getElementById("tchManageModal");
    if (modal) modal.style.display = "none";
  },

  // Open Teacher Profile & ID Card Modal
  openProfileModal(id) {
    const teachers = this.getTeachers();
    const t = teachers.find(item => item.id === id || item.username === id);
    if (!t) return;

    const modal = document.getElementById("tchProfileModal");
    if (!modal) return;

    const defaultAv = t.gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
    document.getElementById("profAvatar").src = t.avatar || defaultAv;
    document.getElementById("profId").textContent = t.id || "TCH";
    document.getElementById("profNameKh").textContent = t.nameKh || "គ្រូបង្រៀន";
    document.getElementById("profNameEn").textContent = t.nameEn || "";
    document.getElementById("profRoleBadge").textContent = t.role || "គ្រូបង្រៀន";
    document.getElementById("profStatusBadge").textContent = `● ${t.status || 'សកម្ម'}`;
    document.getElementById("profUsernameDisplay").textContent = t.username || "N/A";
    document.getElementById("profPasswordDisplay").textContent = t.password || "123456";

    document.getElementById("profSubject").textContent = t.subject || "កុំព្យូទ័ររដ្ឋបាល";
    document.getElementById("profDegree").textContent = t.degree || "បរិញ្ញាបត្រ";
    document.getElementById("profShifts").textContent = t.classes || (Array.isArray(t.shifts) ? t.shifts.join(", ") : "គ្រប់វេន");
    document.getElementById("profExperience").textContent = t.experience || "១+ ឆ្នាំ";
    document.getElementById("profPhone").textContent = t.phone || "N/A";
    document.getElementById("profTelegram").textContent = t.telegram ? `@${t.telegram.replace(/^@/, '')}` : (t.phone || "N/A");
    document.getElementById("profAddress").textContent = t.address || "ខេត្តកំពត";

    // Call and Telegram quick buttons
    const callBtn = document.getElementById("profCallBtn");
    if (callBtn) callBtn.href = t.phone ? `tel:${t.phone}` : "#";

    const tgBtn = document.getElementById("profTgBtn");
    const tgClean = (t.telegram || t.phone || "").replace(/^@/, "").replace(/\s+/g, "");
    if (tgBtn) {
      tgBtn.href = tgClean ? (tgClean.startsWith("+") ? `https://t.me/${tgClean}` : `https://t.me/+855${tgClean.replace(/^0/, '')}`) : "#";
    }

    // Dynamic QR Code Generation
    const qrContainer = document.getElementById("profQrContainer");
    if (qrContainer) {
      qrContainer.innerHTML = "";
      if (typeof QRCode !== "undefined") {
        const qrData = `TIS LAB TEACHER\nID: ${t.id}\nName: ${t.nameKh}\nRole: ${t.role}\nPhone: ${t.phone}`;
        new QRCode(qrContainer, {
          text: qrData,
          width: 50,
          height: 50,
          colorDark: "#0f172a",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }

    // Bind Edit button from profile modal
    const editBtn = document.getElementById("btnEditFromProfile");
    if (editBtn) {
      editBtn.onclick = () => {
        this.closeProfileModal();
        this.openEditModal(t.id);
      };
    }

    // Bind Single ID Card Print button
    const printCardBtn = document.getElementById("btnPrintSingleTeacherCard");
    if (printCardBtn) {
      printCardBtn.onclick = () => this.printSingleTeacherCard(t);
    }

    // Bind Copy Login button
    const copyBtn = document.getElementById("btnCopyTeacherLogin");
    if (copyBtn) {
      copyBtn.onclick = () => this.copyLoginCredentials(t.username, t.password || "123456");
    }

    modal.style.display = "flex";
  },

  closeProfileModal() {
    const modal = document.getElementById("tchProfileModal");
    if (modal) modal.style.display = "none";
  },

  // Copy login credentials to clipboard
  copyLoginCredentials(username, password) {
    const text = `💻 ព័ត៌មាន Login គ្រូបង្រៀន TIS Lab:\n👤 Username: ${username}\n🔑 Password: ${password}\n🌐 Link: https://system-student-c2267.web.app`;
    navigator.clipboard.writeText(text).then(() => {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`📋 បានចម្លងគណនី (${username}) រួចរាល់!`, "success");
      }
    }).catch(() => {
      prompt("ព័ត៌មាន Login គ្រូបង្រៀន៖", text);
    });
  },

  // Save Teacher Data (Add or Edit)
  async handleSave(e) {
    e.preventDefault();
    const editId = document.getElementById("tchEditId").value;
    const teachers = this.getTeachers();

    const nameKh = document.getElementById("tchInputNameKh").value.trim();
    const nameEn = document.getElementById("tchInputNameEn").value.trim();
    const username = document.getElementById("tchInputUsername").value.trim().toLowerCase();
    const password = document.getElementById("tchInputPassword").value.trim();
    const gender = document.getElementById("tchInputGender").value;
    const dob = document.getElementById("tchInputDob").value;
    const role = document.getElementById("tchInputRole").value;
    const phone = document.getElementById("tchInputPhone").value.trim();
    const telegram = document.getElementById("tchInputTelegram").value.trim();
    const email = document.getElementById("tchInputEmail").value.trim();
    const subject = document.getElementById("tchInputSubject").value.trim();
    const degree = document.getElementById("tchInputDegree").value.trim();
    const joinDate = document.getElementById("tchInputJoinDate").value || new Date().toISOString().split("T")[0];
    const experience = document.getElementById("tchInputExperience").value.trim();
    const status = document.getElementById("tchInputStatus").value;
    const address = document.getElementById("tchInputAddress").value.trim();
    const notes = document.getElementById("tchInputNotes").value.trim();

    // Selected shifts
    const shifts = [];
    document.querySelectorAll("#tchShiftsPills input[type='checkbox']:checked").forEach(cb => {
      shifts.push(cb.value);
    });
    const classes = shifts.length > 0 ? shifts.map(s => {
      const match = this.availableShifts.find(as => as.id === s);
      return match ? match.label.split("(")[0].trim() : s;
    }).join(", ") : "គ្រប់វេន";

    // Avatar selection: file upload base64 -> direct url -> default
    let avatar = this.currentAvatarDataUrl || document.getElementById("tchInputAvatar").value.trim();
    if (!avatar) {
      avatar = gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
    }

    if (!nameKh) {
      if (typeof App !== "undefined" && App.showToast) App.showToast("សូមបញ្ចូលឈ្មោះខ្មែររបស់គ្រូ!", "warning");
      return;
    }

    if (!username) {
      if (typeof App !== "undefined" && App.showToast) App.showToast("សូមបញ្ចូលឈ្មោះគណនី (Username) សម្រាប់ Login!", "warning");
      return;
    }

    try {
      const teacherPayload = {
        nameKh, nameEn, username, password, gender, dob, role, phone,
        telegram, email, subject, degree, classes, shifts, joinDate,
        experience, status, address, notes, avatar
      };

      if (editId) {
        // Update existing teacher via AuthService if available
        if (typeof AuthService !== "undefined" && AuthService.updateTeacher) {
          await AuthService.updateTeacher(editId, teacherPayload);
        } else {
          const idx = teachers.findIndex(t => t.id === editId || t.username === editId);
          if (idx !== -1) {
            teachers[idx] = { ...teachers[idx], ...teacherPayload, id: editId };
            await this.saveTeachers(teachers);
          }
        }
        if (typeof App !== "undefined" && App.showToast) {
          App.showToast(`✅ បានកែសម្រួលព័ត៌មានលោកគ្រូ/អ្នកគ្រូ ${nameKh} ដោយជោគជ័យ!`, "success");
        }
      } else {
        // Generate new TCH ID
        const newId = "TCH-" + String(teachers.length + 1).padStart(3, "0");
        teacherPayload.id = newId;

        if (typeof AuthService !== "undefined" && AuthService.addTeacher) {
          await AuthService.addTeacher(teacherPayload);
        } else {
          teachers.push(teacherPayload);
          await this.saveTeachers(teachers);
        }

        if (typeof App !== "undefined" && App.showToast) {
          App.showToast(`🎉 បានបន្ថែមគ្រូបង្រៀនថ្មី ${nameKh} (Username: ${username}) ជោគជ័យ!`, "success");
        }
      }

      this.closeModal();
      this.renderCards();
    } catch (err) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`⚠️ ${err.message}`, "error");
      } else {
        alert(err.message);
      }
    }
  },

  // Delete Teacher
  async handleDelete(id) {
    const teachers = this.getTeachers();
    const t = teachers.find(item => item.id === id || item.username === id);
    const teacherName = t ? t.nameKh : id;

    if (!confirm(`តើអ្នកពិតជាចង់លុបគណនីគ្រូបង្រៀន "${teacherName}" នេះមែនទេ?`)) return;

    try {
      if (typeof AuthService !== "undefined" && AuthService.deleteTeacher) {
        await AuthService.deleteTeacher(id);
      } else {
        let updated = teachers.filter(item => item.id !== id && item.username !== id);
        await this.saveTeachers(updated);
      }
      this.renderCards();
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`បានលុបគ្រូបង្រៀន "${teacherName}" ចេញពីប្រព័ន្ធ!`, "info");
      }
    } catch (err) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`⚠️ ${err.message}`, "error");
      } else {
        alert(err.message);
      }
    }
  },

  // Print Official A4 Teacher Directory
  printOfficialRoster() {
    const teachers = this.getTeachers();
    const printArea = document.getElementById("officialTeacherPrintArea");
    if (!printArea) return;

    const todayKhmer = new Date().toLocaleDateString("km-KH", {
      year: "numeric", month: "long", day: "numeric"
    });

    printArea.innerHTML = `
      <div style="font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 24px; color: #000; background: #fff;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 2px solid #000; padding-bottom: 16px;">
          <div style="text-align: left;">
            <div style="font-size: 1.1rem; font-weight: 800;">សាលា TIS Lab Computer</div>
            <div style="font-size: 0.85rem; color: #444;">ប្រព័ន្ធគ្រប់គ្រងសិស្ស & បន្ទប់អនុវត្តកុំព្យូទ័រ</div>
            <div style="font-size: 0.82rem; color: #444;">ទូរស័ព្ទ៖ 071 721 0307 | ខេត្តកំពត</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.05rem; font-weight: 800;">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div style="font-size: 0.95rem; font-weight: 700;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div style="font-size: 0.8rem; margin-top: 4px;">***</div>
          </div>
        </div>

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0 0 6px 0;">បញ្ជីរាយនាមគ្រូបង្រៀន និងបុគ្គលិកអប់រំកុំព្យូទ័រ</h2>
          <div style="font-size: 0.88rem; color: #555;">គិតត្រឹមថ្ងៃទី ${todayKhmer} • បុគ្គលិកសរុប៖ <strong>${teachers.length} នាក់</strong></div>
        </div>

        <!-- Table -->
        <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f1f5f9; border-top: 1px solid #000; border-bottom: 1px solid #000;">
              <th style="border: 1px solid #000; padding: 8px 4px; text-align: center; width: 35px;">ល.រ</th>
              <th style="border: 1px solid #000; padding: 8px 6px; text-align: center; width: 65px;">អត្តលេខ</th>
              <th style="border: 1px solid #000; padding: 8px 6px; text-align: center; width: 50px;">រូបថត</th>
              <th style="border: 1px solid #000; padding: 8px 8px; text-align: left;">ឈ្មោះខ្មែរ / ឡាតាំង</th>
              <th style="border: 1px solid #000; padding: 8px 6px; text-align: center; width: 45px;">ភេទ</th>
              <th style="border: 1px solid #000; padding: 8px 8px; text-align: left;">តួនាទី / មុខតំណែង</th>
              <th style="border: 1px solid #000; padding: 8px 8px; text-align: left;">ជំនាញឯកទេស</th>
              <th style="border: 1px solid #000; padding: 8px 8px; text-align: left;">វេនបង្រៀន</th>
              <th style="border: 1px solid #000; padding: 8px 8px; text-align: center; width: 95px;">លេខទូរស័ព្ទ</th>
              <th style="border: 1px solid #000; padding: 8px 6px; text-align: center; width: 65px;">ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            ${teachers.map((t, idx) => `
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="border: 1px solid #000; padding: 6px 4px; text-align: center;">${idx + 1}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: 700; font-family: monospace;">${t.id || 'TCH'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                  <img src="${t.avatar || 'assets/images/default-male.svg'}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover;">
                </td>
                <td style="border: 1px solid #000; padding: 6px 8px;">
                  <div style="font-weight: 700;">${t.nameKh}</div>
                  <div style="font-size: 0.72rem; color: #555;">${t.nameEn || ''}</div>
                </td>
                <td style="border: 1px solid #000; padding: 6px; text-align: center;">${t.gender || 'ប្រុស'}</td>
                <td style="border: 1px solid #000; padding: 6px 8px;">${t.role || 'គ្រូបង្រៀន'}</td>
                <td style="border: 1px solid #000; padding: 6px 8px;">${t.subject || 'កុំព្យូទ័រ'}</td>
                <td style="border: 1px solid #000; padding: 6px 8px; font-size: 0.76rem;">${t.classes || 'គ្រប់វេន'}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: 600;">${t.phone || '—'}</td>
                <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: 700;">${t.status || 'សកម្ម'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <!-- Sign-off Block -->
        <div style="display: flex; justify-content: space-between; margin-top: 40px; page-break-inside: avoid;">
          <div style="text-align: center; width: 220px;">
            <div style="font-weight: 700; margin-bottom: 60px;">បានឃើញ និងឯកភាព<br>ប្រធានផ្នែកបន្ទប់កុំព្យូទ័រ Lab</div>
            <div style="font-weight: 800;">លោកគ្រូ ខៀន ធូ</div>
          </div>
          <div style="text-align: center; width: 220px;">
            <div>ខេត្តកំពត, ថ្ងៃទី ${todayKhmer}</div>
            <div style="font-weight: 700; margin-bottom: 60px; margin-top: 4px;">នាយកសាលា / គណៈគ្រប់គ្រង</div>
            <div style="font-weight: 800;">ហត្ថលេខា និងត្រា</div>
          </div>
        </div>
      </div>
    `;

    document.body.classList.add("printing-teacher-roster");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-teacher-roster");
    }, 1000);
  },

  // Print Single Teacher ID Card
  printSingleTeacherCard(t) {
    const printArea = document.getElementById("officialTeacherPrintArea");
    if (!printArea) return;

    printArea.innerHTML = `
      <div style="font-family: 'Kantumruy Pro', sans-serif; display: flex; justify-content: center; padding: 40px 0;">
        <div style="width: 320px; border: 2px solid #0284c7; border-radius: 18px; padding: 24px; text-align: center; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="font-size: 0.95rem; font-weight: 800; color: #0284c7;">TIS LAB COMPUTER</div>
          <div style="font-size: 0.72rem; color: #666; margin-bottom: 14px;">TEACHER & STAFF ID CARD</div>
          <img src="${t.avatar || 'assets/images/default-male.svg'}" style="width: 86px; height: 86px; border-radius: 16px; object-fit: cover; border: 3px solid #0284c7; margin: 0 auto 12px auto; display: block;">
          <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">${t.nameKh}</div>
          <div style="font-size: 0.85rem; color: #475569; font-weight: 600; margin-bottom: 8px;">${t.nameEn || ''}</div>
          <div style="display: inline-block; background: #f0fdf4; color: #16a34a; font-weight: 700; font-size: 0.75rem; padding: 3px 12px; border-radius: 20px; border: 1px solid #bbf7d0; margin-bottom: 14px;">
            ${t.role || 'គ្រូបង្រៀន'}
          </div>
          <div style="text-align: left; background: #f8fafc; padding: 10px 14px; border-radius: 10px; font-size: 0.78rem; line-height: 1.6; margin-bottom: 14px;">
            <div><strong>អត្តលេខ (ID):</strong> ${t.id}</div>
            <div><strong>ជំនាញ:</strong> ${t.subject || 'កុំព្យូទ័រ'}</div>
            <div><strong>ទូរស័ព្ទ:</strong> ${t.phone || '071 721 0307'}</div>
          </div>
          <div style="font-size: 0.68rem; color: #64748b;">
            ប័ណ្ណសម្គាល់ខ្លួនផ្លូវការគ្រូបង្រៀន • TIS Lab Computer
          </div>
        </div>
      </div>
    `;

    document.body.classList.add("printing-teacher-roster");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-teacher-roster");
    }, 1000);
  },

  // Export Teacher Directory to Excel (.xlsx)
  exportExcel() {
    if (typeof XLSX === "undefined") {
      alert("SheetJS Excel Library មិនទាន់ដំណើរការទេ។");
      return;
    }

    const teachers = this.getTeachers();
    const rows = teachers.map((t, idx) => ({
      "ល.រ": idx + 1,
      "អត្តលេខ (ID)": t.id || "TCH",
      "ឈ្មោះខ្មែរ": t.nameKh || "",
      "ឈ្មោះឡាតាំង": t.nameEn || "",
      "ភេទ": t.gender || "ប្រុស",
      "ឈ្មោះគណនី (Username)": t.username || "",
      "ពាក្យសម្ងាត់ (Password)": t.password || "123456",
      "តួនាទី / មុខតំណែង": t.role || "គ្រូបង្រៀន",
      "ជំនាញឯកទេស": t.subject || "",
      "កម្រិតសញ្ញាបត្រ": t.degree || "",
      "ថ្នាក់/វេនបង្រៀន": t.classes || "",
      "លេខទូរស័ព្ទ": t.phone || "",
      "តេឡេក្រាម": t.telegram || "",
      "អ៊ីមែល": t.email || "",
      "ថ្ងៃចូលបង្រៀន": t.joinDate || "",
      "បទពិសោធន៍": t.experience || "",
      "ស្ថានភាព": t.status || "សកម្ម",
      "អាសយដ្ឋាន": t.address || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");

    const todayStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `TIS_Lab_Teachers_List_${todayStr}.xlsx`);

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("🎉 បានទាញយកឯកសារ Excel បញ្ជីគ្រូបង្រៀនជោគជ័យ!", "success");
    }
  },

  // Initialize View Events
  initEvents() {
    // Add Teacher button
    const addBtn = document.getElementById("btnAddTeacherBtn");
    if (addBtn) addBtn.onclick = () => this.openAddModal();

    // Close Add/Edit modal
    const closeBtn = document.getElementById("closeTchModalBtn");
    if (closeBtn) closeBtn.onclick = () => this.closeModal();

    const cancelBtn = document.getElementById("btnCancelTchModal");
    if (cancelBtn) cancelBtn.onclick = () => this.closeModal();

    // Close Profile modal
    const closeProfBtn = document.getElementById("closeTchProfileModalBtn");
    if (closeProfBtn) closeProfBtn.onclick = () => this.closeProfileModal();

    // Print A4 button
    const printBtn = document.getElementById("btnPrintTeachersBtn");
    if (printBtn) printBtn.onclick = () => this.printOfficialRoster();

    // Export Excel button
    const exportExcelBtn = document.getElementById("btnExportTeachersExcelBtn");
    if (exportExcelBtn) exportExcelBtn.onclick = () => this.exportExcel();

    // Form Submit
    const form = document.getElementById("tchManageForm");
    if (form) form.onsubmit = (e) => this.handleSave(e);

    // Image File Upload (Input Change)
    const fileInput = document.getElementById("tchFileInput");
    if (fileInput) {
      fileInput.onchange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          const compressed = await this.compressImage(file);
          this.currentAvatarDataUrl = compressed;
          const preview = document.getElementById("tchAvatarPreview");
          if (preview) preview.src = compressed;
          const urlInput = document.getElementById("tchInputAvatar");
          if (urlInput) urlInput.value = "";
          if (typeof App !== "undefined" && App.showToast) {
            App.showToast("✅ បានជ្រើសរើស និងបង្រួមរូបភាពដោយជោគជ័យ!", "success");
          }
        } catch (err) {
          alert("បរាជ័យក្នុងការ Upload រូបភាព៖ " + err.message);
        }
      };
    }

    // Direct URL input change
    const urlInput = document.getElementById("tchInputAvatar");
    if (urlInput) {
      urlInput.oninput = (e) => {
        const url = e.target.value.trim();
        const preview = document.getElementById("tchAvatarPreview");
        if (url && preview) {
          preview.src = url;
          this.currentAvatarDataUrl = url;
        }
      };
    }

    // Clear Avatar button
    const clearAvatarBtn = document.getElementById("btnClearTchAvatarBtn");
    if (clearAvatarBtn) {
      clearAvatarBtn.onclick = () => {
        this.currentAvatarDataUrl = "";
        const gender = document.getElementById("tchInputGender")?.value || "ប្រុស";
        const def = gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
        const preview = document.getElementById("tchAvatarPreview");
        if (preview) preview.src = def;
        if (urlInput) urlInput.value = "";
        document.querySelectorAll(".preset-avatar-item").forEach(el => el.classList.remove("selected"));
      };
    }

    // Gender change auto update default avatar if no custom image
    const genderSelect = document.getElementById("tchInputGender");
    if (genderSelect) {
      genderSelect.onchange = (e) => {
        if (!this.currentAvatarDataUrl && (!urlInput || !urlInput.value.trim())) {
          const def = e.target.value === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
          const preview = document.getElementById("tchAvatarPreview");
          if (preview) preview.src = def;
        }
      };
    }

    // Toggle Preset Avatars Picker
    const togglePresetBtn = document.getElementById("btnToggleTchPresetAvatars");
    const presetBox = document.getElementById("tchPresetAvatarsPicker");
    if (togglePresetBtn && presetBox) {
      togglePresetBtn.onclick = () => {
        presetBox.style.display = presetBox.style.display === "none" ? "block" : "none";
      };
    }

    // Preset Avatar click selection
    document.querySelectorAll(".preset-avatar-item").forEach(item => {
      item.onclick = () => {
        document.querySelectorAll(".preset-avatar-item").forEach(el => el.classList.remove("selected"));
        item.classList.add("selected");
        const url = item.getAttribute("data-avatar-url");
        if (url) {
          this.currentAvatarDataUrl = url;
          const preview = document.getElementById("tchAvatarPreview");
          if (preview) preview.src = url;
          if (urlInput) urlInput.value = url;
        }
      };
    });

    // Toggle Password Visibility
    const togglePwdBtn = document.getElementById("btnToggleTchPasswordVisibility");
    const pwdInput = document.getElementById("tchInputPassword");
    const eyeIcon = document.getElementById("tchPasswordEyeIcon");
    if (togglePwdBtn && pwdInput && eyeIcon) {
      togglePwdBtn.onclick = () => {
        if (pwdInput.type === "password") {
          pwdInput.type = "text";
          eyeIcon.classList.remove("fa-eye");
          eyeIcon.classList.add("fa-eye-slash");
        } else {
          pwdInput.type = "password";
          eyeIcon.classList.remove("fa-eye-slash");
          eyeIcon.classList.add("fa-eye");
        }
      };
    }

    // Shift Pill Checkboxes click handling
    document.querySelectorAll("#tchShiftsPills .shift-pill-check").forEach(label => {
      const cb = label.querySelector("input[type='checkbox']");
      if (cb) {
        cb.onchange = () => {
          if (cb.checked) label.classList.add("active");
          else label.classList.remove("active");
        };
      }
    });

    // Auto-suggest username when typing Name En or Name Kh
    const nameEnInput = document.getElementById("tchInputNameEn");
    const usernameInput = document.getElementById("tchInputUsername");
    if (nameEnInput && usernameInput) {
      nameEnInput.oninput = () => {
        const editId = document.getElementById("tchEditId").value;
        if (!editId && !usernameInput.dataset.manuallyEdited) {
          const clean = nameEnInput.value.toLowerCase().replace(/^(mr|ms|mrs|miss)\.?\s*/i, "").replace(/[^a-z0-9]/g, "");
          if (clean) usernameInput.value = clean;
        }
      };
      usernameInput.oninput = () => {
        usernameInput.dataset.manuallyEdited = "true";
      };
    }

    // Search & Filter Listeners
    const searchInput = document.getElementById("teacherSearchInput");
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderCards();
      };
    }

    const subjFilter = document.getElementById("teacherSubjectFilter");
    if (subjFilter) {
      subjFilter.onchange = (e) => {
        this.filterSubject = e.target.value;
        this.renderCards();
      };
    }

    const shiftFilter = document.getElementById("teacherShiftFilter");
    if (shiftFilter) {
      shiftFilter.onchange = (e) => {
        this.filterShift = e.target.value;
        this.renderCards();
      };
    }

    const genderFilter = document.getElementById("teacherGenderFilter");
    if (genderFilter) {
      genderFilter.onchange = (e) => {
        this.filterGender = e.target.value;
        this.renderCards();
      };
    }

    const statFilter = document.getElementById("teacherStatusFilter");
    if (statFilter) {
      statFilter.onchange = (e) => {
        this.filterStatus = e.target.value;
        this.renderCards();
      };
    }

    const clearFilterBtn = document.getElementById("btnClearTeacherFilterBtn");
    if (clearFilterBtn) {
      clearFilterBtn.onclick = () => {
        if (searchInput) searchInput.value = "";
        if (subjFilter) subjFilter.value = "";
        if (shiftFilter) shiftFilter.value = "";
        if (genderFilter) genderFilter.value = "";
        if (statFilter) statFilter.value = "";
        this.searchQuery = "";
        this.filterSubject = "";
        this.filterShift = "";
        this.filterGender = "";
        this.filterStatus = "";
        this.renderCards();
      };
    }

    // Initial render
    this.renderCards();
  }
};

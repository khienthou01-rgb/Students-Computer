/**
 * View: Student ID Card Studio (ស្ទូឌីយោបោះពុម្ពកាតសិស្ស)
 * 2026 Modern Card Studio with live interactive preview, QR generation, batch A4 sheet printing.
 */
const IdCardsView = {
  selectedStudent: null,
  cardTheme: "blue", // "blue", "emerald", "purple", "dark"
  cardOrientation: "vertical", // "vertical", "horizontal"

  render() {
    return `
      <section id="view-idcards" class="page-view">
        <!-- Header Banner -->
        <div class="card" style="margin-bottom: 20px; padding: 22px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid #38bdf8;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-id-card" style="color: #38bdf8;"></i>
              <span>ស្ទូឌីយោកាតសិស្ស (Student ID Card Studio)</span>
              <span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">A4 Batch Print Ready</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              បង្កើតកាតសិស្សអាជីព ស្កេន QR Code បោះពុម្ពកាតទោល ឬបោះពុម្ពជាសន្លឹក A4 ចំនួន ៨ សន្លឹកក្នុងពេលតែមួយ
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="btnPrintBatchCardsBtn" class="btn-secondary" style="height: 42px; padding: 0 16px; font-size: 0.88rem; font-weight: 600; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-layer-group"></i> <span>បោះពុម្ព A4 Batch (8 កាត)</span>
            </button>
            <button type="button" id="btnPrintSingleCardBtn" class="btn-primary" style="height: 42px; padding: 0 18px; font-size: 0.88rem; font-weight: 700; background: linear-gradient(135deg, #0284c7, #38bdf8); border-color: transparent; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);">
              <i class="fa-solid fa-print"></i> <span>បោះពុម្ពកាតនេះ (Print Card)</span>
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 340px 1fr; gap: 24px; align-items: start;">
          <!-- Left Configuration Panel -->
          <div class="card" style="padding: 22px; border-radius: 20px; border: 1px solid var(--border-color);">
            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-sliders" style="color: #38bdf8;"></i>
              <span>ការកំណត់ទម្រង់កាត</span>
            </h3>

            <!-- Student Picker -->
            <div style="margin-bottom: 18px;">
              <label class="form-label" style="font-weight: 700; font-size: 0.85rem; margin-bottom: 6px; display: block;">ជ្រើសរើសសិស្ស *</label>
              <select id="idCardStudentSelect" class="form-control" style="height: 42px; border-radius: 12px;">
                <option value="">-- ជ្រើសរើសសិស្ស --</option>
              </select>
            </div>

            <!-- Color Palette Style -->
            <div style="margin-bottom: 18px;">
              <label class="form-label" style="font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; display: block;">ពណ៌ស្បែកកាត (Theme Color)</label>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                <button type="button" class="btn-theme-swatch active" data-theme="blue" style="height: 36px; border-radius: 10px; background: linear-gradient(135deg, #0284c7, #38bdf8); border: 2px solid #0284c7; cursor: pointer;"></button>
                <button type="button" class="btn-theme-swatch" data-theme="emerald" style="height: 36px; border-radius: 10px; background: linear-gradient(135deg, #059669, #34d399); border: 2px solid transparent; cursor: pointer;"></button>
                <button type="button" class="btn-theme-swatch" data-theme="purple" style="height: 36px; border-radius: 10px; background: linear-gradient(135deg, #7c3aed, #a855f7); border: 2px solid transparent; cursor: pointer;"></button>
                <button type="button" class="btn-theme-swatch" data-theme="dark" style="height: 36px; border-radius: 10px; background: linear-gradient(135deg, #0f172a, #334155); border: 2px solid transparent; cursor: pointer;"></button>
              </div>
            </div>

            <!-- Orientation -->
            <div style="margin-bottom: 18px;">
              <label class="form-label" style="font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; display: block;">ទម្រង់កាត (Orientation)</label>
              <div style="display: flex; gap: 10px;">
                <button type="button" id="btnOrientVertical" class="btn-secondary" style="flex: 1; height: 38px; border-radius: 10px; font-weight: 700; font-size: 0.82rem; background: rgba(56, 189, 248, 0.15); color: #0284c7; border-color: #38bdf8;">
                  <i class="fa-solid fa-arrows-up-down"></i> បញ្ឈរ (Vertical)
                </button>
                <button type="button" id="btnOrientHorizontal" class="btn-secondary" style="flex: 1; height: 38px; border-radius: 10px; font-weight: 700; font-size: 0.82rem;">
                  <i class="fa-solid fa-arrows-left-right"></i> បណ្តោយ (Horizontal)
                </button>
              </div>
            </div>

            <!-- Card Elements Toggle -->
            <div style="background: var(--bg-main); padding: 14px; border-radius: 14px; font-size: 0.82rem; display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: var(--text-main);"><i class="fa-solid fa-qrcode" style="color: #38bdf8;"></i> បង្ហាញ QR Code</span>
                <input type="checkbox" id="chkShowQr" checked style="transform: scale(1.2);">
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: var(--text-main);"><i class="fa-solid fa-phone" style="color: #10b981;"></i> បង្ហាញលេខទូរស័ព្ទ</span>
                <input type="checkbox" id="chkShowPhone" checked style="transform: scale(1.2);">
              </div>
            </div>
          </div>

          <!-- Right Live Interactive Preview Area -->
          <div class="card" style="padding: 30px; border-radius: 20px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 480px; background: radial-gradient(circle, var(--bg-card) 0%, rgba(56, 189, 248, 0.03) 100%);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">
              <i class="fa-solid fa-eye" style="color: #38bdf8;"></i> ការបង្ហាញផ្ទាល់ (Live Preview)
            </div>

            <div id="idCardLiveMount">
              <!-- Live card element rendered here -->
            </div>
          </div>
        </div>

        <!-- Hidden Printable Sheet Container for 8-Card Batch A4 printing -->
        <div id="printBatchSheetMount" class="print-batch-sheet" style="display: none;"></div>
      </section>
    `;
  },

  normalizeStudent(s) {
    if (!s) return null;
    return {
      ...s,
      ID: s.ID || s.id || '',
      id: s.ID || s.id || '',
      NameKh: s.NameKh || s.nameKh || '—',
      nameKh: s.NameKh || s.nameKh || '—',
      NameEn: s.NameEn || s.nameEn || '',
      nameEn: s.NameEn || s.nameEn || '',
      Gender: s.Gender || s.gender || 'ប្រុស',
      gender: s.Gender || s.gender || 'ប្រុស',
      Course: s.Course || s.course || 'Typing',
      course: s.Course || s.course || 'Typing',
      Shift: s.Shift || s.shift || 'ព្រឹក',
      shift: s.Shift || s.shift || 'ព្រឹក',
      Phone: s.Phone || s.phone || '',
      phone: s.Phone || s.phone || '',
      Photo: s.Photo || s.Avatar || s.photo || '',
      photo: s.Photo || s.Avatar || s.photo || ''
    };
  },

  populateStudentsDropdown() {
    const select = document.getElementById("idCardStudentSelect");
    if (!select) return;

    const rawStudents = (typeof App !== "undefined" && App.state && App.state.students) || [];
    const students = rawStudents.map(s => this.normalizeStudent(s));
    select.innerHTML = `<option value="">-- ជ្រើសរើសសិស្ស (${students.length} នាក់) --</option>` + 
      students.map(s => `<option value="${s.id}">${s.id} - ${s.nameKh} (${s.course} • វេន${s.shift})</option>`).join("");

    if (students.length > 0 && !this.selectedStudent) {
      this.selectedStudent = students[0];
      select.value = students[0].id;
    }
  },

  getThemeGradients() {
    switch (this.cardTheme) {
      case "emerald":
        return {
          primary: "#059669",
          secondary: "#34d399",
          gradient: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
          accent: "#34d399",
          textHeader: "#ffffff"
        };
      case "purple":
        return {
          primary: "#7c3aed",
          secondary: "#a855f7",
          gradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
          accent: "#c084fc",
          textHeader: "#ffffff"
        };
      case "dark":
        return {
          primary: "#0f172a",
          secondary: "#334155",
          gradient: "linear-gradient(135deg, #020617 0%, #1e293b 100%)",
          accent: "#38bdf8",
          textHeader: "#ffffff"
        };
      case "blue":
      default:
        return {
          primary: "#0369a1",
          secondary: "#0284c7",
          gradient: "linear-gradient(135deg, #075985 0%, #0284c7 100%)",
          accent: "#38bdf8",
          textHeader: "#ffffff"
        };
    }
  },

  renderLiveCard() {
    const mount = document.getElementById("idCardLiveMount");
    if (!mount) return;

    const raw = this.selectedStudent || {
      id: "TX-2026-001",
      nameKh: "ស៊ឹម វឌ្ឍនៈ",
      nameEn: "SIM VATTANAK",
      gender: "ប្រុស",
      course: "Microsoft Excel",
      shift: "ព្រឹក",
      phone: "012 345 678",
      dob: "2006-05-12"
    };
    const s = this.normalizeStudent(raw);

    const theme = this.getThemeGradients();
    const isVertical = this.cardOrientation === "vertical";
    const avatar = s.photo || (s.gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg");
    const showQr = document.getElementById("chkShowQr") ? document.getElementById("chkShowQr").checked : true;
    const showPhone = document.getElementById("chkShowPhone") ? document.getElementById("chkShowPhone").checked : true;

    // Fast QR Simulation API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://system-student-c2267.web.app/#student-login?id=' + (s.id || ''))}`;

    if (isVertical) {
      mount.innerHTML = `
        <div id="printableIdCard" class="id-card-element" style="width: 320px; height: 490px; border-radius: 20px; background: #ffffff; color: #1e293b; box-shadow: 0 16px 36px rgba(0,0,0,0.18); overflow: hidden; display: flex; flex-direction: column; position: relative; border: 1px solid #cbd5e1; font-family: 'Kantumruy Pro', 'Outfit', sans-serif;">
          <!-- Top Header Band -->
          <div style="background: ${theme.gradient}; padding: 18px 16px 36px; text-align: center; color: #ffffff; position: relative;">
            <div style="font-size: 0.72rem; letter-spacing: 1px; font-weight: 800; text-transform: uppercase; color: ${theme.accent};">សាលាកុំព្យូទ័ររដ្ឋបាល</div>
            <div style="font-size: 1.1rem; font-weight: 900; letter-spacing: 0.5px; margin: 2px 0;">TIS LAB COMPUTER</div>
            <div style="font-size: 0.68rem; opacity: 0.85;">STUDENT IDENTITY CARD</div>
          </div>

          <!-- Lanyard Punch Hole Marker -->
          <div style="position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 28px; height: 5px; border-radius: 4px; background: rgba(255,255,255,0.4);"></div>

          <!-- Photo Container -->
          <div style="display: flex; justify-content: center; margin-top: -34px; position: relative; z-index: 2;">
            <div style="width: 96px; height: 96px; border-radius: 18px; border: 4px solid #ffffff; box-shadow: 0 6px 16px rgba(0,0,0,0.15); overflow: hidden; background: #f8fafc;">
              <img src="${avatar}" alt="${s.nameKh}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/default-male.svg'">
            </div>
          </div>

          <!-- Student Core Info -->
          <div style="padding: 12px 20px 0; text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 1.2rem; font-weight: 900; color: #0f172a; margin-bottom: 2px;">${s.nameKh}</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px;">${s.nameEn || ''}</div>

              <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 12px; margin-bottom: 12px; font-size: 0.8rem; text-align: left; display: flex; flex-direction: column; gap: 5px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b;">អត្តលេខ (ID):</span>
                  <span style="font-weight: 800; color: ${theme.primary};">${s.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b;">វគ្គសិក្សា:</span>
                  <span style="font-weight: 700; color: #0f172a;">${s.course}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b;">វេនសិក្សា:</span>
                  <span style="font-weight: 700; color: #0f172a;">វេន${s.shift}</span>
                </div>
                ${showPhone && s.phone ? `
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b;">ទូរស័ព្ទ:</span>
                    <span style="font-weight: 700; color: #0f172a;">${s.phone}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Bottom QR & Barcode Area -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed #cbd5e1; padding: 10px 0 14px;">
              <div style="text-align: left;">
                <div style="font-size: 0.65rem; color: #64748b;">សុពលភាពសិក្សា</div>
                <div style="font-size: 0.75rem; font-weight: 800; color: #0f172a;">៤ ខែ (2026)</div>
              </div>
              ${showQr ? `
                <div style="width: 50px; height: 50px; border-radius: 8px; border: 1px solid #e2e8f0; padding: 2px; background: #fff;">
                  <img src="${qrUrl}" alt="QR" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    } else {
      // Horizontal Card
      mount.innerHTML = `
        <div id="printableIdCard" class="id-card-element" style="width: 480px; height: 300px; border-radius: 20px; background: #ffffff; color: #1e293b; box-shadow: 0 16px 36px rgba(0,0,0,0.18); overflow: hidden; display: flex; position: relative; border: 1px solid #cbd5e1; font-family: 'Kantumruy Pro', 'Outfit', sans-serif;">
          <!-- Left Decorative Brand Bar -->
          <div style="width: 150px; background: ${theme.gradient}; color: #fff; padding: 20px 14px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
            <div>
              <div style="font-size: 0.65rem; font-weight: 800; color: ${theme.accent}; text-transform: uppercase;">សាលាកុំព្យូទ័រ</div>
              <div style="font-size: 0.95rem; font-weight: 900; line-height: 1.2;">TIS LAB</div>
            </div>
            <div style="width: 86px; height: 86px; border-radius: 14px; border: 3px solid #fff; margin: 0 auto; overflow: hidden; background: #f8fafc;">
              <img src="${avatar}" alt="${s.nameKh}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/default-male.svg'">
            </div>
            <div style="font-size: 0.72rem; font-weight: 800; background: rgba(0,0,0,0.25); border-radius: 6px; padding: 2px 6px;">
              ${s.id}
            </div>
          </div>

          <!-- Right Details -->
          <div style="flex: 1; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 1.2rem; font-weight: 900; color: #0f172a;">${s.nameKh}</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: #64748b; margin-bottom: 12px;">${s.nameEn || ''}</div>

              <div style="font-size: 0.84rem; display: flex; flex-direction: column; gap: 6px;">
                <div><strong style="color: #64748b;">វគ្គ:</strong> <span style="font-weight: 700; color: ${theme.primary};">${s.course}</span></div>
                <div><strong style="color: #64748b;">វេន:</strong> <span style="font-weight: 700;">វេន${s.shift}</span></div>
                ${showPhone && s.phone ? `<div><strong style="color: #64748b;">ទូរស័ព្ទ:</strong> <span>${s.phone}</span></div>` : ''}
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; pt: 8px;">
              <div style="font-size: 0.7rem; color: #64748b;">Student ID Card • Valid 2026</div>
              ${showQr ? `
                <div style="width: 44px; height: 44px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px;">
                  <img src="${qrUrl}" alt="QR" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }
  },

  printSingle() {
    window.print();
  },

  printBatch() {
    const rawStudents = (typeof App !== "undefined" && App.state && App.state.students) || [];
    const students = rawStudents.map(st => this.normalizeStudent(st));
    if (students.length === 0) {
      if (typeof App !== "undefined" && App.showToast) App.showToast("មិនទាន់មានទិន្នន័យសិស្សសម្រាប់បោះពុម្ពទេ!", "warning");
      return;
    }

    const batchMount = document.getElementById("printBatchSheetMount");
    if (!batchMount) return;

    // Take up to 8 students for an A4 page
    const batch = students.slice(0, 8);
    const theme = this.getThemeGradients();

    batchMount.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 20px; page-break-inside: avoid;">
        ${batch.map(s => {
          const avatar = s.photo || (s.gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg");
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent('https://system-student-c2267.web.app/#student-login?id=' + (s.id || ''))}`;
          return `
            <div style="border: 1px solid #cbd5e1; border-radius: 14px; padding: 14px; display: flex; gap: 12px; background: #fff; break-inside: avoid;">
              <img src="${avatar}" style="width: 70px; height: 70px; border-radius: 10px; object-fit: cover; border: 2px solid ${theme.primary};" onerror="this.src='assets/images/default-male.svg'">
              <div style="flex: 1; font-size: 0.8rem; line-height: 1.4;">
                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${s.nameKh}</div>
                <div style="font-weight: 700; color: ${theme.primary};">${s.id}</div>
                <div>${s.course} • វេន${s.shift}</div>
                <div style="font-size: 0.72rem; color: #64748b;">TIS LAB COMPUTER</div>
              </div>
              <img src="${qrUrl}" style="width: 50px; height: 50px; align-self: center;">
            </div>
          `;
        }).join("")}
      </div>
    `;

    batchMount.style.display = "block";
    window.print();
    setTimeout(() => {
      batchMount.style.display = "none";
    }, 1000);
  },

  initEvents() {
    this.populateStudentsDropdown();

    const select = document.getElementById("idCardStudentSelect");
    if (select) {
      select.onchange = (e) => {
        const id = e.target.value;
        const rawStudents = (typeof App !== "undefined" && App.state && App.state.students) || [];
        const found = rawStudents.find(s => (s.ID || s.id) === id);
        this.selectedStudent = this.normalizeStudent(found);
        this.renderLiveCard();
      };
    }

    // Theme swatches
    const swatches = document.querySelectorAll(".btn-theme-swatch");
    swatches.forEach(btn => {
      btn.onclick = () => {
        swatches.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.cardTheme = btn.getAttribute("data-theme") || "blue";
        this.renderLiveCard();
      };
    });

    // Orientation toggle
    const btnV = document.getElementById("btnOrientVertical");
    const btnH = document.getElementById("btnOrientHorizontal");
    if (btnV && btnH) {
      btnV.onclick = () => {
        this.cardOrientation = "vertical";
        btnV.style.background = "rgba(56, 189, 248, 0.15)";
        btnV.style.color = "#0284c7";
        btnV.style.borderColor = "#38bdf8";
        btnH.style.background = "";
        btnH.style.color = "";
        btnH.style.borderColor = "";
        this.renderLiveCard();
      };
      btnH.onclick = () => {
        this.cardOrientation = "horizontal";
        btnH.style.background = "rgba(56, 189, 248, 0.15)";
        btnH.style.color = "#0284c7";
        btnH.style.borderColor = "#38bdf8";
        btnV.style.background = "";
        btnV.style.color = "";
        btnV.style.borderColor = "";
        this.renderLiveCard();
      };
    }

    const chkQr = document.getElementById("chkShowQr");
    if (chkQr) chkQr.onchange = () => this.renderLiveCard();

    const chkPhone = document.getElementById("chkShowPhone");
    if (chkPhone) chkPhone.onchange = () => this.renderLiveCard();

    const printSingleBtn = document.getElementById("btnPrintSingleCardBtn");
    if (printSingleBtn) printSingleBtn.onclick = () => this.printSingle();

    const printBatchBtn = document.getElementById("btnPrintBatchCardsBtn");
    if (printBatchBtn) printBatchBtn.onclick = () => this.printBatch();

    this.renderLiveCard();
  }
};

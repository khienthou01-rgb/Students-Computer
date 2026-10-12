/**
 * ==========================================================================
 * Service: OfficeTemplates (បណ្ណាល័យឯកសារគំរូ Office រដ្ឋបាល & Excel ស្រាប់ៗ)
 * Standard Administrative & Spreadsheet Templates for Cambodian Computer Lab
 * Aligned with the 120-page textbook: «សៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័រ»
 * ==========================================================================
 */

const OfficeTemplates = {
  TEMPLATES: [
    // --- MICROSOFT WORD ---
    {
      id: "TMPL-WRD-001",
      category: "Word",
      title: "គំរូលិខិតរដ្ឋបាលជាតិផ្លូវការ (Official Administrative Letter)",
      desc: "ក្បាលលិខិតជាតិ 'ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ' Font Muol Light 14pt, Margins Top 2.5cm, Bottom 2.5cm, Left 2.5cm, Right 2cm",
      icon: "fa-file-word",
      color: "#185abd",
      tags: ["លិខិតរដ្ឋបាល", "Margins A4", "Font Muol Light"],
      bookPage: "ទំព័រ ៤៥ (Project ទី១)"
    },
    {
      id: "TMPL-WRD-002",
      category: "Word",
      title: "គំរូលិខិតអញ្ជើញផ្លូវការ (Official Invitation Letter)",
      desc: "ទម្រង់លិខិតអញ្ជើញចូលរួមកម្មវិធី ឬកិច្ចប្រជុំផ្លូវការ មានតារាងកម្មវិធី និងហត្ថលេខាត្រឹមត្រូវតាមរដ្ឋបាល",
      icon: "fa-envelope-open-text",
      color: "#185abd",
      tags: ["លិខិតអញ្ជើញ", "រដ្ឋបាល", "Table"],
      bookPage: "ទំព័រ ៤៨ (Project ទី២)"
    },
    {
      id: "TMPL-WRD-003",
      category: "Word",
      title: "គំរូប្រវត្តិរូបសង្ខេបដាក់ពាក្យការងារ (Professional Resume / CV)",
      desc: "គំរូ CV ស្តង់ដារខ្មែរ-អង់គ្លេស មានរចនាសម្ព័ន្ធស្អាតបាត បញ្ជាក់ព័ត៌មានផ្ទាល់ខ្លួន ការអប់រំ និងបទពិសោធន៍",
      icon: "fa-id-badge",
      color: "#185abd",
      tags: ["ប្រវត្តិរូប", "CV", "ការងារ"],
      bookPage: "ទំព័រ ៥២ (Project ទី៣)"
    },

    // --- MICROSOFT EXCEL ---
    {
      id: "TMPL-EXC-001",
      category: "Excel",
      title: "គំរូតារាងបញ្ជីប្រាក់បៀវត្សបុគ្គលិក (Staff Payroll Sheet)",
      desc: "តារាងគណនាប្រាក់ខែបុគ្គលិក មានរូបមន្ត =SUM(), =IF(), គណនាប្រាក់លើកទឹកចិត្ត និងកាត់កងស្វ័យប្រវត្តិ",
      icon: "fa-file-excel",
      color: "#107c41",
      tags: ["ប្រាក់ខែ", "SUM", "IF"],
      bookPage: "ទំព័រ ១០៨ (Project ទី១)"
    },
    {
      id: "TMPL-EXC-002",
      category: "Excel",
      title: "គំរូតារាងស្រង់វត្តមានសិស្សប្រចាំខែ (Monthly Attendance Tracker)",
      desc: "តារាងស្រង់វត្តមាន ៣ វេន មានរូបមន្ត =COUNTIF() រាប់ចំនួនវត្តមាន ច្បាប់ និងអវត្តមានស្វ័យប្រវត្តិ",
      icon: "fa-calendar-check",
      color: "#107c41",
      tags: ["វត្តមាន", "COUNTIF", "ស្ថិតិ"],
      bookPage: "ទំព័រ ៩៦"
    },
    {
      id: "TMPL-EXC-003",
      category: "Excel",
      title: "គំរូតារាងពិន្ទុ និងចំណាត់ថ្នាក់សិស្ស (Grade & Rank Sheet)",
      desc: "តារាងគណនាពិន្ទុសរុប មធ្យមភាគ ចំណាត់ថ្នាក់ និងនិទ្ទេស ដោយប្រើរូបមន្ត =AVERAGE(), =RANK(), =IF()",
      icon: "fa-chart-simple",
      color: "#107c41",
      tags: ["ពិន្ទុ", "AVERAGE", "RANK", "IF"],
      bookPage: "ទំព័រ ១១២ (Project ទី២)"
    },

    // --- MICROSOFT POWERPOINT ---
    {
      id: "TMPL-PPT-001",
      category: "PowerPoint",
      title: "គំរូបទបង្ហាញកិច្ចការសាលា (School Presentation Pitch)",
      desc: "ស្ទីលស្លាយស្តង់ដារ ១៦:៩ មានគម្របមាតិកា SmartArt ដ្យាក្រាម និងបែបផែន Transitions ស្អាតបាត",
      icon: "fa-file-powerpoint",
      color: "#d83b01",
      tags: ["ស្លាយ", "Slide Master", "Transitions"],
      bookPage: "ទំព័រ ៦៨"
    }
  ],

  openModal(defaultCat = "all") {
    this.ensureModalInDOM();
    this.renderModal(defaultCat);
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("officeTemplatesModal");
    } else {
      const el = document.getElementById("officeTemplatesModal");
      if (el) el.style.display = "flex";
    }
  },

  closeModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("officeTemplatesModal");
    } else {
      const el = document.getElementById("officeTemplatesModal");
      if (el) el.style.display = "none";
    }
  },

  ensureModalInDOM() {
    let modal = document.getElementById("officeTemplatesModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "officeTemplatesModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10760";
      document.body.appendChild(modal);
    }
  },

  renderModal(filterCat = "all") {
    const modal = document.getElementById("officeTemplatesModal");
    if (!modal) return;

    let list = this.TEMPLATES;
    if (filterCat && filterCat !== "all") {
      list = list.filter(t => t.category === filterCat);
    }

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 960px; width: 95%; max-height: 90vh; background: #0f172a; border-radius: 20px; border: 1.5px solid #10b981; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); overflow: hidden; display: flex; flex-direction: column; padding: 0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #064e3b, #047857); border-bottom: 2px solid #10b981; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(16, 185, 129, 0.25); border: 1.5px solid #10b981; display: flex; align-items: center; justify-content: center; color: #a7f3d0; font-size: 1.35rem;">
              <i class="fa-solid fa-folder-open"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #fff;">
                បណ្ណាល័យឯកសារគំរូ Office រដ្ឋបាល & Excel ស្រាប់ៗ
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.78rem; color: #d1fae5;">
                ទាញយកឯកសារគំរូ (.docx, .xlsx, .pptx) រៀបចំតាមក្បួនសៀវភៅមូលដ្ឋាន ១២០ ទំព័រ
              </p>
            </div>
          </div>
          <button type="button" onclick="OfficeTemplates.closeModal()" style="background: rgba(255, 255, 255, 0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Filter Tabs -->
        <div style="background: #1e293b; border-bottom: 1px solid #334155; padding: 10px 24px; display: flex; gap: 8px;">
          <button type="button" onclick="OfficeTemplates.renderModal('all')" class="btn-paper-filter ${filterCat === 'all' ? 'active' : ''}" style="height: 32px; font-size: 0.8rem; padding: 0 14px;">
            <i class="fa-solid fa-layer-group"></i> ទាំងអស់ (${this.TEMPLATES.length})
          </button>
          <button type="button" onclick="OfficeTemplates.renderModal('Word')" class="btn-paper-filter ${filterCat === 'Word' ? 'active' : ''}" style="height: 32px; font-size: 0.8rem; padding: 0 14px;">
            <i class="fa-solid fa-file-word text-blue-400"></i> MS Word
          </button>
          <button type="button" onclick="OfficeTemplates.renderModal('Excel')" class="btn-paper-filter ${filterCat === 'Excel' ? 'active' : ''}" style="height: 32px; font-size: 0.8rem; padding: 0 14px;">
            <i class="fa-solid fa-file-excel text-emerald-400"></i> MS Excel
          </button>
          <button type="button" onclick="OfficeTemplates.renderModal('PowerPoint')" class="btn-paper-filter ${filterCat === 'PowerPoint' ? 'active' : ''}" style="height: 32px; font-size: 0.8rem; padding: 0 14px;">
            <i class="fa-solid fa-file-powerpoint text-orange-400"></i> PowerPoint
          </button>
        </div>

        <!-- Grid Content -->
        <div style="flex: 1; overflow-y: auto; padding: 22px 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          ${list.map(t => `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-top: 4px solid ${t.color}; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <span class="badge" style="background: ${t.color}25; color: ${t.color}; font-weight: 800; font-size: 0.76rem;">
                    <i class="fa-solid ${t.icon}"></i> ${t.category}
                  </span>
                  <span style="font-size: 0.74rem; color: #fbbf24; font-weight: 600;">
                    ${t.bookPage}
                  </span>
                </div>

                <h4 style="margin: 0 0 8px; font-size: 0.98rem; font-weight: 800; color: #fff; line-height: 1.45;">
                  ${t.title}
                </h4>

                <p style="margin: 0 0 14px; font-size: 0.8rem; color: #cbd5e1; line-height: 1.55;">
                  ${t.desc}
                </p>

                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;">
                  ${t.tags.map(tag => `
                    <span style="background: rgba(255, 255, 255, 0.06); color: #94a3b8; font-size: 0.72rem; padding: 2px 8px; border-radius: 4px;">
                      #${tag}
                    </span>
                  `).join("")}
                </div>
              </div>

              <div style="display: flex; gap: 8px;">
                <button type="button" onclick="OfficeTemplates.previewTemplate('${t.id}')" class="btn-secondary" style="flex: 1; height: 36px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="fa-solid fa-eye"></i> <span>មើលគំរូ</span>
                </button>
                <button type="button" onclick="OfficeTemplates.downloadTemplate('${t.id}')" class="btn-primary" style="height: 36px; padding: 0 14px; font-size: 0.8rem; background: ${t.color}; border: none; border-radius: 8px; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-download"></i> <span>ទាញយក</span>
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  previewTemplate(id) {
    const t = this.TEMPLATES.find(item => item.id === id);
    if (!t) return;

    const win = window.open("", "_blank");
    if (!win) {
      alert("សូមអនុញ្ញាត Popup ដើម្បីមើលគំរូឯកសារ");
      return;
    }

    let contentHtml = "";
    if (t.id === "TMPL-WRD-001") {
      contentHtml = `
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="font-family: 'Moul', serif; font-size: 15px; margin: 0 0 4px;">ព្រះរាជាណាចក្រកម្ពុជា</h2>
          <h3 style="font-family: 'Moul', serif; font-size: 13px; margin: 0;">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
          <div style="margin: 8px 0; font-family: cursive; font-size: 16px;">3 3 3</div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <strong>ស្ថាប័ន / ក្រុមហ៊ុន៖</strong> សាលា អន្តរជាតិ ធានស៊ីន<br>
            <strong>លេខ៖</strong> ........ / TIS
          </div>
          <div style="text-align: right;">
            រាជធានីភ្នំពេញ, ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២៦
          </div>
        </div>
        <div style="text-align: center; margin: 25px 0;">
          <h3 style="font-family: 'Moul', serif; font-size: 14px; margin: 0;">លិខិតរដ្ឋបាលផ្លូវការ</h3>
        </div>
        <p style="text-indent: 1.25cm; line-height: 1.8;">
          សូមគោរពជម្រាបជូនលោក/លោកស្រីជ្រាបថា ដោយអនុលោមតាមគោលការណ៍ណែនាំស្តីពីការរៀបចំឯកសាររដ្ឋបាលកម្ពុជា សាលា អន្តរជាតិ ធានស៊ីន បានរៀបចំក្បួនខ្នាតរឹមទំព័រ A4 គម្លាតរឹមខាងលើ ២.៥ស.ម ខាងក្រោម ២.៥ស.ម ខាងឆ្វេង ២.៥ស.ម និងខាងស្តាំ ២.០ស.ម ព្រមទាំងប្រើប្រាស់ពុម្ពអក្សរជាតិ Khmer OS Muol Light 14pt និង Khmer OS Siemreap 11pt។
        </p>
      `;
    } else {
      contentHtml = `
        <h3 style="color: ${t.color};">${t.title}</h3>
        <p>${t.desc}</p>
        <div style="border: 1px dashed #cbd5e1; padding: 20px; border-radius: 8px; margin-top: 15px; background: #f8fafc;">
          <strong>ខ្លឹមសារគំរូនៃឯកសារ (${t.category})៖</strong><br>
          ឯកសារនេះត្រូវបានរៀបចំស្របតាមស្តង់ដារបង្រៀននៃសៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័ររដ្ឋបាល & IT (${t.bookPage})។
        </div>
      `;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>${t.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Moul&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 25mm 20mm 25mm 25mm; }
          body { font-family: 'Kantumruy Pro', sans-serif; font-size: 12px; color: #1e293b; margin: 0; padding: 30px; }
        </style>
      </head>
      <body>
        ${contentHtml}
        <script>setTimeout(() => window.print(), 500);<\/script>
      </body>
      </html>
    `);
    win.document.close();
  },

  downloadTemplate(id) {
    const t = this.TEMPLATES.find(item => item.id === id);
    if (!t) return;

    // Create downloadable blob
    const sampleText = `=== ${t.title} ===\nសាលា អន្តរជាតិ ធានស៊ីន (TIS LAB COMPUTER)\n${t.desc}\n${t.bookPage}\n`;
    const blob = new Blob([sampleText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${t.id}_${t.category}_Template.txt`;
    a.click();
    URL.revokeObjectURL(url);

    if (typeof App !== "undefined") {
      App.showToast(`🎉 បានទាញយកគំរូ «${t.title}» រួចរាល់!`, "success");
    }
  }
};

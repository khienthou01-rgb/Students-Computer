/**
 * View: Documents & Lesson Materials Manager (ឃ្លាំងឯកសារ & មេរៀនកុំព្យូទ័រ)
 * 2026 Modern File Center for computer lessons, exercises, exams, and templates.
 */
const DocumentsView = {
  searchQuery: "",
  activeCategory: "all",

  defaultDocs: [
    {
      id: "DOC-001",
      title: "កម្រងលំហាត់អនុវត្តន៍រូបមន្ត Excel ពីកម្រិតដំបូងដល់កម្រិតខ្ពស់",
      category: "exercises",
      type: "xlsx",
      size: "2.4 MB",
      date: "2026-09-15",
      downloads: 142,
      desc: "ឯកសារផ្ទុកនូវ ៥០ លំហាត់អនុវត្តជាក់ស្តែង រូបមន្ត SUM, IF, VLOOKUP, INDEX/MATCH និង Pivot Tables។"
    },
    {
      id: "DOC-002",
      title: "សៀវភៅណែនាំការតាក់តែងលិខិតរដ្ឋបាលផ្លូវការ Microsoft Word",
      category: "lessons",
      type: "pdf",
      size: "5.1 MB",
      date: "2026-09-10",
      downloads: 215,
      desc: "ក្បួនតាក់តែងលិខិតបទដ្ឋានរដ្ឋបាល លិខិតអញ្ជើញ លិខិតបង្គាប់ការ និងទម្រង់បែបបទផ្លូវការ។"
    },
    {
      id: "DOC-003",
      title: "វិញ្ញាសាប្រឡងវាស់ស្ទង់សមត្ថភាពកុំព្យូទ័ររដ្ឋបាលប្រចាំឆមាស",
      category: "exams",
      type: "pdf",
      size: "1.8 MB",
      date: "2026-09-01",
      downloads: 98,
      desc: "កម្រងវិញ្ញាសាប្រឡងបញ្ចប់វគ្គ Typing, Word, Excel, PowerPoint ចំនួន ៤ ផ្នែក។"
    },
    {
      id: "DOC-004",
      title: "កញ្ចប់គំរូស្លាយបទបង្ហាញបែបអាជីព PowerPoint Slide Master (50 Slides)",
      category: "templates",
      type: "pptx",
      size: "12.8 MB",
      date: "2026-08-28",
      downloads: 320,
      desc: "Template ស្លាយបទបង្ហាញបែបបច្ចេកវិទ្យា 2026 ទំនើប ងាយស្រួលកែប្រែ មាន Infographics ស្រាប់។"
    },
    {
      id: "DOC-005",
      title: "តារាងក្តារចុចខ្មែរយូនីកូដ និងគន្លឹះវាយអត្ថបទរហ័ស 10 ម្រាមដៃ",
      category: "lessons",
      type: "pdf",
      size: "850 KB",
      date: "2026-08-20",
      downloads: 410,
      desc: "គំនូសតាងទីតាំងម្រាមដៃលើក្តារចុចខ្មែរ ស្រៈ ព្យញ្ជនៈ ជើងអក្សរ និងសញ្ញាវណ្ណយុត្តិ។"
    }
  ],

  getDocs() {
    try {
      const stored = localStorage.getItem("ms_documents_list_2026");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem("ms_documents_list_2026", JSON.stringify(this.defaultDocs));
    return this.defaultDocs;
  },

  saveDocs(docs) {
    localStorage.setItem("ms_documents_list_2026", JSON.stringify(docs));
  },

  render() {
    return `
      <section id="view-documents" class="page-view">
        <!-- Header Banner -->
        <div class="card" style="margin-bottom: 20px; padding: 22px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid #f472b6;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-folder-open" style="color: #f472b6;"></i>
              <span>ឃ្លាំងឯកសារ & មេរៀនកុំព្យូទ័រ (Documents & Resources)</span>
              <span id="docsCountBadge" class="badge" style="background: rgba(244, 114, 182, 0.15); color: #ec4899; font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">5 ឯកសារ</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              មេរៀន PDF, លំហាត់អនុវត្ត Excel, Slide PowerPoint, វិញ្ញាសាប្រឡង និងទម្រង់លិខិតរដ្ឋបាល
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="btnUploadDocModal" class="btn-primary" style="height: 42px; padding: 0 18px; font-size: 0.88rem; font-weight: 700; background: linear-gradient(135deg, #db2777, #f472b6); border-color: transparent; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(219, 39, 119, 0.35);">
              <i class="fa-solid fa-cloud-arrow-up"></i> <span>+ បង្ហោះឯកសារថ្មី (Upload)</span>
            </button>
          </div>
        </div>

        <!-- Category Tabs & Search Bar -->
        <div class="card" style="padding: 16px 20px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <!-- Filter Pill Tabs -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="docCategoryTabs">
            <button type="button" class="btn-secondary active" data-cat="all" style="height: 38px; border-radius: 10px; font-weight: 700; font-size: 0.82rem; padding: 0 14px;">
              <i class="fa-solid fa-border-all"></i> ទាំងអស់
            </button>
            <button type="button" class="btn-secondary" data-cat="lessons" style="height: 38px; border-radius: 10px; font-weight: 700; font-size: 0.82rem; padding: 0 14px;">
              <i class="fa-solid fa-book"></i> មេរៀន (Lessons)
            </button>
            <button type="button" class="btn-secondary" data-cat="exercises" style="height: 38px; border-radius: 10px; font-weight: 700; font-size: 0.82rem; padding: 0 14px;">
              <i class="fa-solid fa-laptop-code"></i> លំហាត់ (Exercises)
            </button>
            <button type="button" class="btn-secondary" data-cat="exams" style="height: 38px; border-radius: 10px; font-weight: 700; font-size: 0.82rem; padding: 0 14px;">
              <i class="fa-solid fa-file-circle-check"></i> វិញ្ញាសា (Exams)
            </button>
            <button type="button" class="btn-secondary" data-cat="templates" style="height: 38px; border-radius: 10px; font-weight: 700; font-size: 0.82rem; padding: 0 14px;">
              <i class="fa-solid fa-shapes"></i> គំរូរដ្ឋបាល (Templates)
            </button>
          </div>

          <!-- Search -->
          <div style="min-width: 240px; position: relative;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
            <input type="text" id="docsSearchInput" placeholder="ស្វែងរកឯកសារ..." class="form-control" style="padding-left: 38px; height: 38px; border-radius: 10px;">
          </div>
        </div>

        <!-- Documents Grid -->
        <div id="docsGridContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
          <!-- Dynamically filled -->
        </div>

        <!-- Upload Doc Modal -->
        <div id="uploadDocModal" class="modal" style="display: none;">
          <div class="modal-backdrop" onclick="DocumentsView.closeModal()"></div>
          <div class="modal-card" style="max-width: 500px;">
            <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding: 18px 24px;">
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-cloud-arrow-up" style="color: #ec4899;"></i>
                <span>បង្ហោះឯកសារកុំព្យូទ័រថ្មី</span>
              </h3>
              <button type="button" class="btn-icon" onclick="DocumentsView.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form id="uploadDocForm" onsubmit="DocumentsView.handleUpload(event)" style="padding: 24px;">
              <div style="margin-bottom: 16px;">
                <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">ចំណងជើងឯកសារ *</label>
                <input type="text" id="docInputTitle" class="form-control" required placeholder="ឧ. លំហាត់រូបមន្ត Excel ភាគ ២">
              </div>
              <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                <div style="flex: 1;">
                  <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">ប្រភេទទិន្នន័យ *</label>
                  <select id="docInputCategory" class="form-control" required>
                    <option value="lessons">មេរៀន (Lessons)</option>
                    <option value="exercises">លំហាត់ (Exercises)</option>
                    <option value="exams">វិញ្ញាសា (Exams)</option>
                    <option value="templates">គំរូរដ្ឋបាល (Templates)</option>
                  </select>
                </div>
                <div style="flex: 1;">
                  <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">កន្ទុយ File *</label>
                  <select id="docInputType" class="form-control" required>
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                  </select>
                </div>
              </div>
              <div style="margin-bottom: 16px;">
                <label class="form-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; display: block;">ការពិពណ៌នាសង្ខេប</label>
                <textarea id="docInputDesc" class="form-control" rows="3" placeholder="ពិពណ៌នាអំពីខ្លឹមសារនៃឯកសារនេះ..."></textarea>
              </div>
              <div style="border: 2px dashed var(--border-color); border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 20px; background: var(--bg-main);">
                <i class="fa-solid fa-file-arrow-up" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 8px;"></i>
                <div style="font-size: 0.85rem; color: var(--text-main); font-weight: 600;">ជ្រើសរើសឯកសារ ឬអូសទម្លាក់ទីនេះ</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">គាំទ្រ PDF, Word, Excel, PowerPoint រហូតដល់ 25MB</div>
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 18px;">
                <button type="button" class="btn-secondary" onclick="DocumentsView.closeModal()">បោះបង់</button>
                <button type="submit" class="btn-primary" style="background: #db2777; border-color: #db2777; font-weight: 700;">
                  <i class="fa-solid fa-upload"></i> បង្ហោះចូលឃ្លាំង
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  },

  renderGrid() {
    const container = document.getElementById("docsGridContainer");
    if (!container) return;

    const docs = this.getDocs();
    const query = this.searchQuery.toLowerCase().trim();
    const cat = this.activeCategory;

    const filtered = docs.filter(d => {
      const matchQ = !query || 
        d.title.toLowerCase().includes(query) ||
        (d.desc && d.desc.toLowerCase().includes(query));
      const matchC = cat === "all" || d.category === cat;
      return matchQ && matchC;
    });

    const badge = document.getElementById("docsCountBadge");
    if (badge) badge.textContent = `${filtered.length} ឯកសារ`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: 16px;">
          <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-muted); opacity: 0.3; margin-bottom: 12px;"></i>
          <p style="color: var(--text-muted);">មិនមានឯកសារក្នុងប្រភេទនេះទេ</p>
        </div>
      `;
      return;
    }

    const typeIcons = {
      pdf: { icon: "fa-file-pdf", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" },
      xlsx: { icon: "fa-file-excel", color: "#107c41", bg: "rgba(16, 124, 65, 0.12)" },
      docx: { icon: "fa-file-word", color: "#185abd", bg: "rgba(24, 90, 189, 0.12)" },
      pptx: { icon: "fa-file-powerpoint", color: "#d83b01", bg: "rgba(216, 59, 1, 0.12)" }
    };

    container.innerHTML = filtered.map(d => {
      const meta = typeIcons[d.type] || { icon: "fa-file", color: "#64748b", bg: "rgba(100, 116, 139, 0.12)" };

      return `
        <div class="card doc-card" style="padding: 22px; border-radius: 18px; border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.25s ease;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 14px; background: ${meta.bg}; color: ${meta.color}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                <i class="fa-solid ${meta.icon}"></i>
              </div>
              <span class="badge" style="background: rgba(0,0,0,0.06); color: var(--text-muted); font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 10px; text-transform: uppercase;">
                ${d.type} • ${d.size}
              </span>
            </div>

            <h3 style="font-size: 1rem; font-weight: 800; color: var(--text-main); margin: 0 0 8px 0; line-height: 1.4;">
              ${d.title}
            </h3>

            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 16px 0;">
              ${d.desc || 'ឯកសារជំនួយស្មារតីក្នុងការអនុវត្តកុំព្យូទ័រ។'}
            </p>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 12px; margin-bottom: 14px;">
              <span><i class="fa-solid fa-calendar"></i> ${d.date}</span>
              <span><i class="fa-solid fa-download"></i> ${d.downloads || 0} ដង</span>
            </div>

            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn-primary" onclick="DocumentsView.downloadDoc('${d.id}')" style="flex: 1; height: 36px; font-size: 0.82rem; font-weight: 700; border-radius: 10px; background: ${meta.color}; border-color: ${meta.color}; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                <i class="fa-solid fa-download"></i> ទាញយក (Download)
              </button>
              <button type="button" class="btn-secondary" onclick="DocumentsView.handleDelete('${d.id}')" style="height: 36px; padding: 0 12px; font-size: 0.82rem; border-radius: 10px; color: #ef4444;" title="លុប">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  downloadDoc(id) {
    const docs = this.getDocs();
    const d = docs.find(item => item.id === id);
    if (!d) return;

    d.downloads = (d.downloads || 0) + 1;
    this.saveDocs(docs);
    this.renderGrid();

    // Create realistic downloadable text blob
    const content = `TIS LAB COMPUTER\n====================\nTitle: ${d.title}\nCategory: ${d.category}\nDate: ${d.date}\n\n${d.desc}\n\nOfficial Material for Student Training 2026.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${d.title.replace(/[\s\/]/g, "_")}.${d.type === 'pdf' ? 'txt' : d.type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`បានទាញយកឯកសារ "${d.title}" ដោយជោគជ័យ!`, "success");
    }
  },

  openUploadModal() {
    const modal = document.getElementById("uploadDocModal");
    const form = document.getElementById("uploadDocForm");
    if (!modal || !form) return;
    form.reset();
    modal.style.display = "flex";
  },

  closeModal() {
    const modal = document.getElementById("uploadDocModal");
    if (modal) modal.style.display = "none";
  },

  handleUpload(e) {
    e.preventDefault();
    const title = document.getElementById("docInputTitle").value.trim();
    const category = document.getElementById("docInputCategory").value;
    const type = document.getElementById("docInputType").value;
    const desc = document.getElementById("docInputDesc").value.trim();

    if (!title) return;

    const docs = this.getDocs();
    const newId = "DOC-" + String(docs.length + 1).padStart(3, "0");

    docs.unshift({
      id: newId,
      title,
      category,
      type,
      size: (Math.random() * 4 + 1).toFixed(1) + " MB",
      date: new Date().toISOString().split("T")[0],
      downloads: 1,
      desc: desc || "ឯកសារបង្រៀនថ្មីទើបបង្ហោះចូលប្រព័ន្ធ។"
    });

    this.saveDocs(docs);
    this.closeModal();
    this.renderGrid();

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("បានបង្ហោះឯកសារថ្មីចូលឃ្លាំងដោយជោគជ័យ!", "success");
    }
  },

  handleDelete(id) {
    if (!confirm("តើអ្នកពិតជាចង់លុបឯកសារនេះចេញពីឃ្លាំងមែនទេ?")) return;
    let docs = this.getDocs();
    docs = docs.filter(d => d.id !== id);
    this.saveDocs(docs);
    this.renderGrid();
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("បានលុបឯកសាររួចរាល់!", "info");
    }
  },

  initEvents() {
    const uploadBtn = document.getElementById("btnUploadDocModal");
    if (uploadBtn) uploadBtn.onclick = () => this.openUploadModal();

    const searchInput = document.getElementById("docsSearchInput");
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderGrid();
      };
    }

    const catButtons = document.querySelectorAll("#docCategoryTabs button[data-cat]");
    catButtons.forEach(btn => {
      btn.onclick = () => {
        catButtons.forEach(b => {
          b.classList.remove("active");
          b.style.background = "";
          b.style.color = "";
        });
        btn.classList.add("active");
        btn.style.background = "linear-gradient(135deg, #db2777, #f472b6)";
        btn.style.color = "#ffffff";
        this.activeCategory = btn.getAttribute("data-cat") || "all";
        this.renderGrid();
      };
    });

    this.renderGrid();
  }
};

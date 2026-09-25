/**
 * View: Computer Curriculum & Subjects (មុខវិជ្ជា & កម្មវិធីសិក្សាកុំព្យូទ័រ)
 * 100% Computer-focused modules: Typing, Word, Excel, PowerPoint, Computer Admin.
 */
const SubjectsView = {
  searchQuery: "",
  selectedModule: null,

  modules: [
    {
      id: "SUB-TYP-101",
      code: "TYPING",
      title: "ជំនាញវាយអត្ថបទខ្មែរ-អង់គ្លេស (Touch Typing Mastery)",
      duration: "៣០ ម៉ោង (៤ សប្តាហ៍)",
      level: "មូលដ្ឋានគ្រឹះ (Level 1)",
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.12)",
      icon: "fa-keyboard",
      description: "បណ្តុះបណ្តាលវិធីសាស្ត្រវាយក្តារចុចដោយម្រាមដៃ ១០ (Touch Typing) ទាំងអក្សរខ្មែរ យូនីកូដ (Khmer Unicode) និងអក្សរអង់គ្លេស ដោយមិនមើលក្តារចុច ជាមួយល្បឿន និងភាពត្រឹមត្រូវខ្ពស់។",
      lessonsCount: 12,
      exercisesCount: 24,
      syllabus: [
        "មេរៀនទី ១: ស្គាល់ក្តារចុច និងទីតាំងម្រាមដៃគោល (Home Row ASDF JKL;)",
        "មេរៀនទី ២: ការអនុវត្តវាយជួរអក្សរខាងលើ និងខាងក្រោម (Top & Bottom Rows)",
        "មេរៀនទី ៣: ការវាយលេខ និងសញ្ញាពិសេស (Number & Symbol Rows)",
        "មេរៀនទី ៤: រចនាសម្ព័ន្ធក្តារចុចខ្មែរយូនីកូដ (Khmer Unicode Layout)",
        "មេរៀនទី ៥: ព្យញ្ជនៈ ស្រៈពេញតួ និងស្រៈនិស្ស័យភាសាខ្មែរ",
        "មេរៀនទី ៦: ការវាយជើងអក្សរខ្មែរ និងវណ្ណយុត្តិ (Shift + F Key)",
        "មេរៀនទី ៧: លំហាត់អនុវត្តការវាយអត្ថបទល្បឿន (Speed Drills)",
        "មេរៀនទី ៨: ការប្រលងវាស់ល្បឿន Typing Speed Test (WPM & Accuracy)"
      ]
    },
    {
      id: "SUB-WRD-201",
      code: "MS-WORD",
      title: "រដ្ឋបាលឯកសារកម្រិតខ្ពស់ (Microsoft Word Pro)",
      duration: "៤៥ ម៉ោង (៦ សប្តាហ៍)",
      level: "កម្រិតមធ្យម (Level 2)",
      color: "#185abd",
      bg: "rgba(24, 90, 189, 0.12)",
      icon: "fa-file-word",
      description: "ការរៀបចំនិងតាក់តែងលិខិតរដ្ឋបាល សៀវភៅ របាយការណ៍ស្ថាប័ន កិច្ចសន្យា ការប្រើប្រាស់ Styles, Table of Contents, Mail Merge, Page Layout និង Header/Footer តាមស្តង់ដារក្រសួង។",
      lessonsCount: 16,
      exercisesCount: 30,
      syllabus: [
        "មេរៀនទី ១: ចំណុចប្រទាក់ Word Interface & Font Settings (Khmer OS)",
        "មេរៀនទី ២: Paragraph Formatting, Indentation, Line Spacing",
        "មេរៀនទី ៣: ការបង្កើត និងតុបតែងតារាងអាជីព (Advanced Tables)",
        "មេរៀនទី ៤: រូបភាព រូបរាង (Shapes, SmartArt, Icons & Wrapping)",
        "មេរៀនទី ៥: ការកំណត់ទំព័រ Page Setup, Margins, Breaks, Columns",
        "មេរៀនទី ៦: Header & Footer, Page Numbers (អក្សរខ្មែរ & លេខរ៉ូម៉ាំង)",
        "មេរៀនទី ៧: ការបង្កើតមាតិកាស្វ័យប្រវត្តិ (Table of Contents & Styles)",
        "មេរៀនទី ៨: ការផ្ញើសំបុត្រ និងលិខិតអញ្ជើញស្វ័យប្រវត្តិ (Mail Merge)",
        "មេរៀនទី ៩: ការតាក់តែងលិខិតបទដ្ឋានរដ្ឋបាលផ្លូវការ (Official Admin Letters)"
      ]
    },
    {
      id: "SUB-EXC-301",
      code: "MS-EXCEL",
      title: "ការគណនាតារាង & ទិន្នន័យ (Microsoft Excel Mastery)",
      duration: "៦០ ម៉ោង (៨ សប្តាហ៍)",
      level: "កម្រិតខ្ពស់ (Level 3)",
      color: "#107c41",
      bg: "rgba(16, 124, 65, 0.12)",
      icon: "fa-file-excel",
      description: "ស្ទាត់ជំនាញក្នុងការប្រើរូបមន្តគណនាស្មុគស្មាញ (SUM, IF, Nested IF, VLOOKUP, XLOOKUP, INDEX/MATCH), Pivot Tables, Dashboard រូបភាពក្រាហ្វិក និងការគ្រប់គ្រងបញ្ជីទិន្នន័យអាជីវកម្ម។",
      lessonsCount: 20,
      exercisesCount: 40,
      syllabus: [
        "មេរៀនទី ១: មូលដ្ឋានគ្រឹះ Cell References, Formula Basics (+, -, *, /)",
        "មេរៀនទី ២: រូបមន្តស្ថិតិបឋម (SUM, AVERAGE, MIN, MAX, COUNT, COUNTA)",
        "មេរៀនទី ៣: លក្ខខណ្ឌតក្កវិជ្ជា (IF, Nested IF, AND, OR, IFS)",
        "មេរៀនទី ៤: រូបមន្តរាប់និងបូកតាមលក្ខខណ្ឌ (COUNTIF, COUNTIFS, SUMIF, SUMIFS)",
        "មេរៀនទី ៥: រូបមន្តស្វែងរកទិន្នន័យ (VLOOKUP, HLOOKUP, XLOOKUP, INDEX/MATCH)",
        "មេរៀនទី ៦: ការរៀបចំទិន្នន័យ Data Validation, Sorting & Advanced Filter",
        "មេរៀនទី ៧: ការវិភាគទិន្នន័យធំដោយ Pivot Table & Pivot Charts",
        "មេរៀនទី ៨: ការបង្កើតផ្ទាំងគ្រប់គ្រង Dashboard និងរបាយការណ៍ហិរញ្ញវត្ថុ"
      ]
    },
    {
      id: "SUB-PPT-401",
      code: "MS-POWERPOINT",
      title: "ការរចនាស្លាយបទបង្ហាញ (PowerPoint & Visual Presentation)",
      duration: "៣៥ ម៉ោង (៤ សប្តាហ៍)",
      level: "កម្រិតមធ្យម (Level 2)",
      color: "#d83b01",
      bg: "rgba(216, 59, 1, 0.12)",
      icon: "fa-file-powerpoint",
      description: "រៀនបង្កើតស្លាយបទបង្ហាញបែបសម័យថ្មី ស្អាត ទាក់ទាញ ជាមួយ Slide Master, Transitions, Morph Animation, Infographics, ការបញ្ចូល Video/Audio និងបច្ចេកទេសធ្វើបទបង្ហាញប្រកបដោយទំនុកចិត្ត។",
      lessonsCount: 14,
      exercisesCount: 20,
      syllabus: [
        "មេរៀនទី ១: គោលការណ៍រចនាស្លាយអាជីព (Layout, Color Palette & Contrast)",
        "មេរៀនទី ២: ការប្រើប្រាស់ Slide Master បង្កើត Template ផ្ទាល់ខ្លួន",
        "មេរៀនទី ៣: Typography & Khmer Font pairing សម្រាប់បទបង្ហាញ",
        "មេរៀនទី ៤: Infographics, Charts & SmartArt Visualization",
        "មេរៀនទី ៥: ចលនា Morph Transitions & Interactive Motion Animations",
        "មេរៀនទី ៦: ការបញ្ចូល Multimedia (Video, Audio & Screen Recording)",
        "មេរៀនទី ៧: Slide Show Presenter View & បច្ចេកទេសធ្វើបទបង្ហាញ"
      ]
    },
    {
      id: "SUB-ADM-501",
      code: "OFFICE-ADMIN",
      title: "រដ្ឋបាលកុំព្យូទ័រ & ប្រព័ន្ធការិយាល័យ (Office Computer Admin)",
      duration: "៣០ ម៉ោង (៤ សប្តាហ៍)",
      level: "អនុវត្តការងារជាក់ស្តែង",
      color: "#0284c7",
      bg: "rgba(2, 132, 199, 0.12)",
      icon: "fa-desktop",
      description: "ចំណេះដឹងគ្រប់គ្រងកុំព្យូទ័រការិយាល័យជាក់ស្តែង ការគ្រប់គ្រង File/Folder, Cloud Storage (Google Drive/OneDrive), ការប្រើប្រាស់ម៉ាស៊ីនព្រីន (Printer/Scanner), PDF Converter និងសុវត្ថិភាពទិន្នន័យ។",
      lessonsCount: 10,
      exercisesCount: 18,
      syllabus: [
        "មេរៀនទី ១: ការគ្រប់គ្រង Files & Folders រៀបចំប្រព័ន្ធទុកដាក់ឯកសារ",
        "មេរៀនទី ២: កម្មវិធីជំនួយការិយាល័យ (PDF Tools, WinRAR, OCR Scanning)",
        "មេរៀនទី ៣: ការដំឡើង និងប្រើប្រាស់ម៉ាស៊ីនព្រីន (Printers & Scanners)",
        "មេរៀនទី ៤: ការប្រើប្រាស់ Google Drive & Cloud Backup ក្នុងការងាររដ្ឋបាល",
        "មេរៀនទី ៥: សុវត្ថិភាពកុំព្យូទ័រ កំចាត់មេរោគ និងការថែទាំប្រព័ន្ធ Windows"
      ]
    }
  ],

  render() {
    return `
      <section id="view-subjects" class="page-view">
        <!-- Header Banner -->
        <div class="card" style="margin-bottom: 20px; padding: 22px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 4px solid #c084fc;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin: 0 0 4px 0;">
              <i class="fa-solid fa-book-open-reader" style="color: #c084fc;"></i>
              <span>មុខវិជ្ជា & កម្មវិធីសិក្សាកុំព្យូទ័រ (Computer Curriculum)</span>
              <span class="badge" style="background: rgba(192, 132, 252, 0.15); color: #c084fc; font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">៥ វគ្គស្តង់ដារ</span>
            </h2>
            <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
              កម្មវិធីសិក្សាជំនាញកុំព្យូទ័ររដ្ឋបាល និងការិយាល័យ ស្របតាមស្តង់ដារទីផ្សារការងារ ២០២៦
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" onclick="window.print()" class="btn-secondary" style="height: 42px; padding: 0 16px; font-size: 0.88rem; font-weight: 600; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-print"></i> <span>បោះពុម្ពកម្មវិធីសិក្សា</span>
            </button>
          </div>
        </div>

        <!-- Search Toolbar -->
        <div class="card" style="padding: 16px 20px; margin-bottom: 22px; display: flex; gap: 14px; align-items: center;">
          <div style="flex: 1; position: relative;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
            <input type="text" id="subjectsSearchInput" placeholder="ស្វែងរកតាមឈ្មោះមុខវិជ្ជា, កូដ, ឬមេរៀន..." class="form-control" style="padding-left: 40px; height: 42px; border-radius: 12px;">
          </div>
        </div>

        <!-- Subjects Grid -->
        <div id="subjectsGridContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 22px;">
          <!-- Dynamically filled -->
        </div>

        <!-- Syllabus Modal Details -->
        <div id="syllabusModal" class="modal" style="display: none;">
          <div class="modal-backdrop" onclick="SubjectsView.closeModal()"></div>
          <div class="modal-card" style="max-width: 650px;">
            <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding: 18px 24px;">
              <h3 id="syllabusModalTitle" style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-book" style="color: #c084fc;"></i>
                <span>កម្មវិធីសិក្សាលម្អិត</span>
              </h3>
              <button type="button" class="btn-icon" onclick="SubjectsView.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="syllabusModalBody" style="padding: 24px; max-height: 70vh; overflow-y: auto;">
              <!-- Filled dynamically -->
            </div>
            <div style="padding: 16px 24px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn-primary" onclick="SubjectsView.closeModal()" style="font-weight: 600;">យល់ព្រម</button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderGrid() {
    const container = document.getElementById("subjectsGridContainer");
    if (!container) return;

    const query = this.searchQuery.toLowerCase().trim();
    const filtered = this.modules.filter(m => {
      return !query || 
        m.title.toLowerCase().includes(query) ||
        m.code.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: 16px;">
          <p style="color: var(--text-muted);">មិនមានមុខវិជ្ជាដែលត្រូវនឹងការស្វែងរកនេះទេ</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(m => {
      return `
        <div class="card module-card" style="padding: 24px; border-radius: 20px; border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.25s ease; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: ${m.color};"></div>
          
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
              <div style="width: 52px; height: 52px; border-radius: 16px; background: ${m.bg}; color: ${m.color}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 12px ${m.bg};">
                <i class="fa-solid ${m.icon}"></i>
              </div>
              <span class="badge" style="background: rgba(0,0,0,0.06); color: var(--text-muted); font-size: 0.74rem; font-weight: 700; padding: 4px 10px; border-radius: 12px;">
                ${m.id}
              </span>
            </div>

            <div style="font-size: 0.76rem; font-weight: 700; color: ${m.color}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
              ${m.level}
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin: 0 0 10px 0; line-height: 1.4;">
              ${m.title}
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin: 0 0 18px 0;">
              ${m.description}
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: var(--bg-main); padding: 12px 14px; border-radius: 14px; font-size: 0.8rem; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-clock" style="color: #6366f1;"></i>
                <span style="color: var(--text-muted);">${m.duration}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-list-check" style="color: #10b981;"></i>
                <span style="font-weight: 700; color: var(--text-main);">${m.lessonsCount} មេរៀន</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-laptop-code" style="color: #06b6d4;"></i>
                <span style="font-weight: 700; color: var(--text-main);">${m.exercisesCount} លំហាត់</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-award" style="color: #f59e0b;"></i>
                <span style="font-weight: 700; color: var(--text-main);">ប្រឡងបញ្ចប់</span>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; pt: 12px; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" onclick="SubjectsView.openSyllabus('${m.id}')" style="flex: 1; height: 38px; font-size: 0.82rem; font-weight: 700; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
              <i class="fa-solid fa-book-open"></i> មាតិកាមេរៀន (Syllabus)
            </button>
            <button type="button" class="btn-primary" onclick="App.switchTab('classes')" style="height: 38px; padding: 0 14px; font-size: 0.82rem; font-weight: 700; border-radius: 10px; background: ${m.color}; border-color: ${m.color};" title="មើលថ្នាក់រៀន">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  openSyllabus(id) {
    const m = this.modules.find(item => item.id === id);
    if (!m) return;

    const modal = document.getElementById("syllabusModal");
    const title = document.getElementById("syllabusModalTitle");
    const body = document.getElementById("syllabusModalBody");
    if (!modal || !body) return;

    if (title) title.innerHTML = `<i class="fa-solid ${m.icon}" style="color: ${m.color};"></i> <span>${m.title}</span>`;

    body.innerHTML = `
      <div style="background: ${m.bg}; padding: 16px; border-radius: 14px; margin-bottom: 20px; border-left: 4px solid ${m.color};">
        <div style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">កាលវិភាគ & ថិរវេលា: ${m.duration}</div>
        <div style="font-size: 0.86rem; color: var(--text-muted);">${m.description}</div>
      </div>

      <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin: 0 0 14px 0; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-list-ol" style="color: ${m.color};"></i>
        <span>បញ្ជីមាតិកាមេរៀនលម្អិត (${m.syllabus.length} ជំពូក)</span>
      </h4>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${m.syllabus.map((item, idx) => `
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--bg-main); border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="width: 28px; height: 28px; border-radius: 8px; background: ${m.bg}; color: ${m.color}; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; flex-shrink: 0;">
              ${idx + 1}
            </div>
            <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-main);">
              ${item}
            </div>
          </div>
        `).join("")}
      </div>
    `;

    modal.style.display = "flex";
  },

  closeModal() {
    const modal = document.getElementById("syllabusModal");
    if (modal) modal.style.display = "none";
  },

  initEvents() {
    const searchInput = document.getElementById("subjectsSearchInput");
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderGrid();
      };
    }
    this.renderGrid();
  }
};

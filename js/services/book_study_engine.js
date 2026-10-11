/**
 * Service & Component: Book Study Engine & Pre-Exam AI Review
 * (ប្រព័ន្ធសៀវភៅសិក្សាមូលដ្ឋាន E-Book និងសំណួររំលឹកមុនប្រឡងបង្កើតដោយ Gemini AI)
 * Aligned with the official 120-page textbook: «សៀវភៅមូលដ្ឋាន.pdf»
 */

const BookStudyEngine = {
  BOOK_INFO: {
    id: "BOOK-TIS-001",
    title: "សៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័ររដ្ឋបាល & IT (Windows 10, Typing, Word, Excel, PowerPoint 2019)",
    shortTitle: "សៀវភៅមូលដ្ឋានកុំព្យូទ័រ (120 ទំព័រ)",
    pdfUrl: "assets/books/computer_basics_book.pdf",
    khmerPdfUrl: "assets/books/សៀវភៅមូលដ្ឋាន.pdf",
    totalPages: 120,
    fileSize: "8.8 MB",
    school: "សាលា អន្តរជាតិ ធានស៊ីន - TIS LAB COMPUTER",
    chapters: [
      {
        id: "ch1",
        number: 1,
        title: "មេរៀនទី ១: មូលដ្ឋានគ្រឹះកុំព្យូទ័រ (Computer Fundamentals)",
        desc: "តើអ្វីជាកុំព្យូទ័រ, ប្រភេទកុំព្យូទ័រ, Hardware & Software, ការស្វែងយល់ពី Keyboard",
        startPage: 11,
        endPage: 14,
        course: "Typing",
        color: "#8b5cf6",
        icon: "fa-desktop"
      },
      {
        id: "ch2",
        number: 2,
        title: "មេរៀនទី ២: ការប្រើប្រាស់វីនដូ ១០ (Windows 10 Operating System)",
        desc: "Desktop, Taskbar, ICON, Windows Explorer, ការគ្រប់គ្រង File & Folder (Rename, Copy, Cut, Paste)",
        startPage: 15,
        endPage: 19,
        course: "Typing",
        color: "#0284c7",
        icon: "fa-windows"
      },
      {
        id: "ch3",
        number: 3,
        title: "មេរៀនទី ៣: ជំនាញវាយអត្ថបទ Typing (ខ្មែរ-អង់គ្លេស)",
        desc: "Typing English & Khmer 10 ម្រាមដៃ, ក្តារចុចយូនីកូដ, ជើងអក្សរគ្រាប់ចុច j, ស្រៈ និងព្យញ្ជនៈ",
        startPage: 20,
        endPage: 22,
        course: "Typing",
        color: "#10b981",
        icon: "fa-keyboard"
      },
      {
        id: "ch4",
        number: 4,
        title: "មេរៀនទី ៤: កម្មវិធី Microsoft Word 2019 (រដ្ឋបាល & តាក់តែងអត្ថបទ)",
        desc: "Page Setup, Margins, Font Muol Light & Siemreap, Tab, Columns, Drop Cap, Shapes, WordArt, Table, Equations, Header/Footer, Shortcuts, Project លិខិតរដ្ឋបាល",
        startPage: 23,
        endPage: 56,
        course: "Word",
        color: "#185abd",
        icon: "fa-file-word"
      },
      {
        id: "ch5",
        number: 5,
        title: "មេរៀនទី ៥: កម្មវិធី Microsoft PowerPoint 2019 (ស្លាយ & បទបង្ហាញ)",
        desc: "Slide Management (Ctrl+M), Text Box, WordArt, Shape, SmartArt, Audio/Video, Hyperlink, Transitions, Animations, Slide Show (F5, Shift+F5, Black screen B), Print",
        startPage: 57,
        endPage: 72,
        course: "PowerPoint",
        color: "#d83b01",
        icon: "fa-file-powerpoint"
      },
      {
        id: "ch6",
        number: 6,
        title: "មេរៀនទី ៦: កម្មវិធី Microsoft Excel 2019 (តារាងគណនា & រូបមន្ត)",
        desc: "Workbook, Worksheet, Cell, Data Types, Formulas: Day/Month/Year, Hour/Minute/Second, Upper/Lower/Proper, Min/Max/Average, Rank, IF, Countif, Sumif, Sort, Filter, Subtotal, Charts, Print",
        startPage: 73,
        endPage: 120,
        course: "Excel",
        color: "#107c41",
        icon: "fa-file-excel"
      }
    ]
  },

  // សំណួររំលឹកមុនប្រឡងដកស្រង់ដោយផ្ទាល់ពីសៀវភៅមូលដ្ឋាន ១២០ ទំព័រ (Pre-Exam Review Questions)
  PRE_EXAM_STUDY_QUESTIONS: [
    // មេរៀនទី ១ & ២: មូលដ្ឋានគ្រឹះ & Windows 10
    {
      id: "REV-CH1-01",
      chapterId: "ch1",
      course: "Typing",
      chapterTitle: "មេរៀនទី ១: មូលដ្ឋានគ្រឹះកុំព្យូទ័រ",
      question: "តើអ្វីទៅជាកុំព្យូទ័រ (Computer)?",
      answer: "កុំព្យូទ័រ គឺជាឧបករណ៍អេឡិចត្រូនិកដែលអាចទទួលទិន្នន័យ (Input) ដំណើរការគណនាទិន្នន័យ (Process) និងបង្ហាញលទ្ធផលព័ត៌មាន (Output) ព្រមទាំងរក្សាទុកទិន្នន័យ (Storage)។",
      examTip: "សំណួរនេះមាននៅលើទំព័រទី ៤ នៃសៀវភៅមូលដ្ឋាន។ ត្រូវចាំ ៤ ដំណាក់កាល៖ Input ➔ Process ➔ Output ➔ Storage។"
    },
    {
      id: "REV-CH1-02",
      chapterId: "ch1",
      course: "Typing",
      chapterTitle: "មេរៀនទី ១: មូលដ្ឋានគ្រឹះកុំព្យូទ័រ",
      question: "តើ Hardware និង Software មានភាពខុសគ្នាដូចម្តេច?",
      answer: "Hardware គឺជាសមាសភាគរូបវន្តដែលយើងអាចមើលឃើញ និងប៉ះពាល់បាន (ឧ. Monitor, Keyboard, Mouse, System Unit, Hard Drive)។ រីឯ Software គឺជាកម្មវិធី ឬសេចក្តីណែនាំបញ្ជាឱ្យកុំព្យូទ័រដំណើរការ (ឧ. Windows 10, MS Word, Excel, PowerPoint)។",
      examTip: "សំណួរទំព័រទី ៤៖ Hardware ប៉ះបាន រីឯ Software ជាកម្មវិធីបញ្ជា។"
    },
    {
      id: "REV-CH2-01",
      chapterId: "ch2",
      course: "Typing",
      chapterTitle: "មេរៀនទី ២: ការប្រើប្រាស់វីនដូ ១០",
      question: "ដើម្បីប្តូរឈ្មោះ (Rename), ថតចម្លង (Copy), និងបន្លាស់ទី (Move/Cut) លើ File ឬ Folder ក្នុង Windows 10 ត្រូវធ្វើដូចម្តេច?",
      answer: "ចុច Right Click លើ File/Folder នោះ៖\n- ប្តូរឈ្មោះ៖ ជ្រើសយក 'Rename'\n- ថតចម្លង៖ ជ្រើសយក 'Copy' រួចទៅកន្លែងថ្មី Right Click យក 'Paste'\n- បន្លាស់ទី៖ ជ្រើសយក 'Cut' រួចទៅកន្លែងថ្មី Right Click យក 'Paste'។",
      examTip: "សៀវភៅទំព័រទី ៩៖ ក្បួនគ្រប់គ្រង Folder ត្រូវចាំ Shortcuts: Ctrl+C (Copy), Ctrl+X (Cut), Ctrl+V (Paste), F2 (Rename)។"
    },

    // មេរៀនទី ៣: Typing
    {
      id: "REV-CH3-01",
      chapterId: "ch3",
      course: "Typing",
      chapterTitle: "មេរៀនទី ៣: ជំនាញវាយអត្ថបទ Typing",
      question: "ក្នុងការវាយអក្សរយូនីកូដខ្មែរ (Khmer Unicode) តើគ្រាប់ចុចមួយណាប្រើសម្រាប់បង្កើត 'ជើងអក្សរ'?",
      answer: "គឺគ្រាប់ចុចអក្សរ 'j' (Subscript key)។ ឧទាហរណ៍៖ ដើម្បីវាយពាក្យ 'ក្ដារ' ត្រូវវាយ អក្សរ ក + j + ដ + ា + រ។",
      examTip: "សៀវភៅទំព័រទី ១១៖ គ្រាប់ចុច j ដើរតួជាសញ្ញាជើងអក្សរខ្មែរជានិច្ច។"
    },
    {
      id: "REV-CH3-02",
      chapterId: "ch3",
      course: "Typing",
      chapterTitle: "មេរៀនទី ៣: ជំនាញវាយអត្ថបទ Typing",
      question: "តើគ្រាប់ចុចជួរកណ្តាល (Home Row Keys) សម្រាប់ដាក់ម្រាមដៃទាំង ១០ មានគ្រាប់ចុចអ្វីខ្លះ?",
      answer: "ដៃឆ្វេងដាក់លើគ្រាប់៖ A S D F (កូនដៃលើ A, មេដៃលើ Spacebar)\nដៃស្តាំដាក់លើគ្រាប់៖ J K L ; (ចង្អុលដៃលើ J, មេដៃលើ Spacebar) ដោយមានចំណុចផុសលើគ្រាប់ F និង J។",
      examTip: "សៀវភៅទំព័រទី ២-៣ និង ១០៖ ត្រូវចាំ Home Row Keys ជានិច្ចពេលប្រឡង Typing។"
    },

    // មេរៀនទី ៤: Microsoft Word 2019
    {
      id: "REV-CH4-01",
      chapterId: "ch4",
      course: "Word",
      chapterTitle: "មេរៀនទី ៤: កម្មវិធី Microsoft Word 2019",
      question: "តើក្បួនខ្នាតរឹមទំព័រ (Margins) ស្តង់ដារលិខិតរដ្ឋបាលកម្ពុជា ត្រូវកំណត់ទំហំប៉ុន្មានខ្លះ?",
      answer: "ចូល Tab Layout ➔ Margins ➔ Custom Margins៖\n- ខាងលើ (Top): 2.5 cm\n- ខាងក្រោម (Bottom): 2.5 cm\n- ខាងឆ្វេង (Left): 2.5 cm (សម្រាប់ចោះកាតាឡុក)\n- ខាងស្តាំ (Right): 2.0 cm (ឬ 1.5 cm)។",
      examTip: "សៀវភៅទំព័រទី ១៤ & ៤៥៖ ស្តង់ដារលិខិតរដ្ឋបាលជាតិកម្ពុជា តែងតែចេញក្នុងវិញ្ញាសាប្រឡងបញ្ចប់វគ្គ Word។"
    },
    {
      id: "REV-CH4-02",
      chapterId: "ch4",
      course: "Word",
      chapterTitle: "មេរៀនទី ៤: កម្មវិធី Microsoft Word 2019",
      question: "ក្បាលលិខិតជាតិ 'ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ' ត្រូវប្រើ Font និងទំហំប៉ុន្មាន?",
      answer: "ត្រូវប្រើ Font 'Khmer OS Muol Light' ទំហំ 14pt (ដាក់ចំកណ្តាល Center)។ រីឯខ្លឹមសារអត្ថបទរដ្ឋបាលទូទៅ ប្រើ Font 'Khmer OS Siemreap' ទំហំ 11pt ឬ 12pt គម្លាតបន្ទាត់ 1.15។",
      examTip: "សៀវភៅទំព័រទី ១៥ & ៤៥ (Project ទី១)៖ Font Muol Light សម្រាប់ក្បាលលិខិតផ្លូវការ។"
    },
    {
      id: "REV-CH4-03",
      chapterId: "ch4",
      course: "Word",
      chapterTitle: "មេរៀនទី ៤: កម្មវិធី Microsoft Word 2019",
      question: "តើមុខងារ Drop Cap និង Columns ប្រើប្រាស់សម្រាប់អ្វី?",
      answer: "មុខងារ Columns (Tab Layout ➔ Columns) ប្រើសម្រាប់បំបែកអត្ថបទជាច្រើនជួរឈរដូចកាសែត។ រីឯ Drop Cap (Tab Insert ➔ Drop Cap) ប្រើសម្រាប់ពង្រីកតួអក្សរដំបូងគេនៃកថាខណ្ឌឱ្យធំលេចធ្លោ។",
      examTip: "សៀវភៅទំព័រទី ២១៖ Drop Cap ស្ថិតក្នុង Insert Tab, Columns ស្ថិតក្នុង Layout Tab។"
    },
    {
      id: "REV-CH4-04",
      chapterId: "ch4",
      course: "Word",
      chapterTitle: "មេរៀនទី ៤: កម្មវិធី Microsoft Word 2019",
      question: "ដើម្បីបញ្ចូលក្រឡា (Merge Cells) ក្នុងតារាង Word ត្រូវធ្វើដូចម្តេច?",
      answer: "Select ក្រឡា (Cells) ដែលត្រូវបញ្ចូលគ្នា ➔ ចូលទៅកាន់ Tab 'Layout' ក្រោម Table Tools ➔ ចុចលើពាក្យ 'Merge Cells'។",
      examTip: "សៀវភៅទំព័រទី ៣៥៖ Merge Cells = បញ្ចូលក្រឡា, Split Cells = ពុះបំបែកក្រឡា។"
    },

    // មេរៀនទី ៥: Microsoft PowerPoint 2019
    {
      id: "REV-CH5-01",
      chapterId: "ch5",
      course: "PowerPoint",
      chapterTitle: "មេរៀនទី ៥: Microsoft PowerPoint 2019",
      question: "តើ Shortcut សម្រាប់បញ្ចាំង Slide Show ពីដើម និងពីស្លាយបច្ចុប្បន្ន មានភាពខុសគ្នាដូចម្តេច?",
      answer: "- ចុចគ្រាប់ចុច F5៖ ចាប់ផ្តើមបញ្ចាំង Slide Show ពីស្លាយដំបូងគេបង្អស់ (First Slide)\n- ចុច Shift + F5៖ ចាប់ផ្តើមបញ្ចាំងពីស្លាយបច្ចុប្បន្នដែលកំពុងជ្រើសរើស (Current Slide)។",
      examTip: "សៀវភៅទំព័រទី ៥៧៖ F5 = ពីដើម, Shift + F5 = ពីស្លាយកំពុងមើល។"
    },
    {
      id: "REV-CH5-02",
      chapterId: "ch5",
      course: "PowerPoint",
      chapterTitle: "មេរៀនទី ៥: Microsoft PowerPoint 2019",
      question: "តើ Transitions និង Animations ក្នុង PowerPoint ខុសគ្នាដូចម្តេច?",
      answer: "- Transitions (Tab Transition)៖ ជាបែបផែនចលនាផ្លាស់ប្តូរពេលរំកិលពី Slide មួយទៅកាន់ Slide មួយទៀត\n- Animations (Tab Animation)៖ ជាបែបផែនចលនាដាក់លើអត្ថបទ រូបភាព ឬរូបរាង (Objects) ខាងក្នុង Slide។",
      examTip: "សៀវភៅទំព័រទី ៥៥-៥៦៖ Transition = រវាង Slide, Animation = លើអក្សរ/រូបភាព។"
    },

    // មេរៀនទី ៦: Microsoft Excel 2019
    {
      id: "REV-CH6-01",
      chapterId: "ch6",
      course: "Excel",
      chapterTitle: "មេរៀនទី ៦: Microsoft Excel 2019",
      question: "តើរូបមន្តអក្សរ Upper, Lower, និង Proper មានតួនាទីអ្វីខ្លះ?",
      answer: "- =UPPER(text)៖ បំប្លែងអក្សរទាំងអស់ទៅជាអក្សរធំ (Capital letters)\n- =LOWER(text)៖ បំប្លែងអក្សរទាំងអស់ទៅជាអក្សរតូច (Lowercase)\n- =PROPER(text)៖ បំប្លែងអក្សរដើមនៃពាក្យនីមួយៗទៅជាអក្សរធំ (Title case)។",
      examTip: "សៀវភៅទំព័រទី ៨៩៖ ចំណុចទី ៧ រូបមន្ត Upper, Lower, Proper ចេញប្រឡងញឹកញាប់។"
    },
    {
      id: "REV-CH6-02",
      chapterId: "ch6",
      course: "Excel",
      chapterTitle: "មេរៀនទី ៦: Microsoft Excel 2019",
      question: "តើរូបមន្ត IF, SUMIF, និង COUNTIF មានទម្រង់សរសេរយ៉ាងដូចម្តេច?",
      answer: "1. =IF(logical_test, value_if_true, value_if_false)\n   ឧ. =IF(E2>=50, \"ជាប់\", \"ធ្លាក់\")\n2. =COUNTIF(range, criteria)\n   ឧ. =COUNTIF(C2:C50, \"ស្រី\") សម្រាប់រាប់ចំនួនសិស្សស្រី\n3. =SUMIF(range, criteria, [sum_range])\n   ឧ. =SUMIF(C2:C50, \"Typing\", D2:D50) សម្រាប់បូកសរុបពិន្ទុតែវគ្គ Typing។",
      examTip: "សៀវភៅទំព័រទី ៩៤, ៩៦, ៩៨៖ រូបមន្តមានលក្ខខណ្ឌ IF, COUNTIF, SUMIF ជាចំណុចស្នូលនៃវគ្គ Excel។"
    },
    {
      id: "REV-CH6-03",
      chapterId: "ch6",
      course: "Excel",
      chapterTitle: "មេរៀនទី ៦: Microsoft Excel 2019",
      question: "តើការចាក់សោក្រឡាដាច់ខាត (Absolute Reference) ដោយប្រើសញ្ញា $ (ឧ. $A$1) មានប្រយោជន៍អ្វី?",
      answer: "ដើម្បីរក្សាទីតាំងក្រឡា $A$1 ឱ្យនៅថេរដដែល មិនផ្លាស់ប្តូរនៅពេលយើង Copy ឬ Autofill អូសរូបមន្តចុះក្រោម ឬទៅស្តាំ។",
      examTip: "សៀវភៅទំព័រទី ៨៧៖ ចុច F4 លើ Keyboard ដើម្បីបន្ថែមសញ្ញា $ ចាក់សោក្រឡា។"
    }
  ],

  /**
   * Open the E-Book Reader Modal
   */
  openBookReaderModal(initialPage = 1) {
    this.ensureModal();
    this.renderBookReader(initialPage);
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("bookReaderModal");
    } else {
      const el = document.getElementById("bookReaderModal");
      if (el) el.style.display = "flex";
    }
  },

  closeBookReaderModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("bookReaderModal");
    } else {
      const el = document.getElementById("bookReaderModal");
      if (el) el.style.display = "none";
    }
  },

  ensureModal() {
    let modal = document.getElementById("bookReaderModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "bookReaderModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10600";
      document.body.appendChild(modal);
    }
  },

  renderBookReader(page = 1) {
    const modal = document.getElementById("bookReaderModal");
    if (!modal) return;

    const b = this.BOOK_INFO;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 1100px; width: 96%; height: 92vh; display: flex; flex-direction: column; padding: 0; overflow: hidden; background: #0f172a; border-radius: 16px; border: 1.5px solid rgba(139, 92, 246, 0.4); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);">
        <!-- Top Reader Header -->
        <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); border-bottom: 2px solid #8b5cf6; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(139, 92, 246, 0.25); border: 1px solid #8b5cf6; display: flex; align-items: center; justify-content: center; color: #c084fc; font-size: 1.2rem;">
              <i class="fa-solid fa-book-open"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
                <span>${b.shortTitle}</span>
                <span class="badge" style="background: #10b981; color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">ផ្លូវការ ${b.totalPages} ទំព័រ</span>
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.76rem; color: #cbd5e1;">${b.school}</p>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <!-- Chapter Jump Select -->
            <select onchange="BookStudyEngine.jumpToPage(this.value)" style="height: 36px; padding: 0 10px; background: rgba(15, 23, 42, 0.9); border: 1px solid #8b5cf6; border-radius: 8px; color: #fff; font-size: 0.82rem;">
              <option value="1">ទំព័រដំបូង (គម្របសៀវភៅ)</option>
              <option value="5">មាតិកា (Table of Contents)</option>
              ${b.chapters.map(ch => `
                <option value="${ch.startPage}" ${page >= ch.startPage && page <= ch.endPage ? 'selected' : ''}>
                  ${ch.title.split(':')[0]} (ទំព័រ ${ch.startPage})
                </option>
              `).join("")}
            </select>

            <a href="${b.pdfUrl}" download="សៀវភៅមូលដ្ឋានកុំព្យូទ័រ_TIS_LAB.pdf" class="btn-primary" style="height: 36px; padding: 0 14px; font-size: 0.82rem; background: #10b981; border: none; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; border-radius: 8px;">
              <i class="fa-solid fa-download"></i> <span>ទាញយក PDF</span>
            </a>

            <button type="button" onclick="BookStudyEngine.openPreExamReviewModal('all')" class="btn-primary" style="height: 36px; padding: 0 14px; font-size: 0.82rem; background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">
              <i class="fa-solid fa-brain"></i> <span>សំណួររំលឹកមុនប្រឡង</span>
            </button>

            <button type="button" onclick="BookStudyEngine.closeBookReaderModal()" style="background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Embedded PDF Viewer / Fallback -->
        <div style="flex: 1; background: #1e293b; position: relative;">
          <iframe id="bookPdfIframe" src="${b.pdfUrl}#page=${page}&view=FitH" style="width: 100%; height: 100%; border: none;" title="សៀវភៅមូលដ្ឋានកុំព្យូទ័រ"></iframe>
        </div>

        <!-- Bottom Quick Chapter Bar -->
        <div style="background: #0f172a; border-top: 1px solid #334155; padding: 8px 16px; display: flex; gap: 8px; overflow-x: auto; white-space: nowrap;">
          ${b.chapters.map(ch => `
            <button type="button" onclick="BookStudyEngine.jumpToPage(${ch.startPage})" style="height: 30px; padding: 0 12px; font-size: 0.74rem; background: rgba(30, 41, 59, 0.8); border: 1px solid ${ch.color}50; border-radius: 6px; color: #fff; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid ${ch.icon}" style="color: ${ch.color};"></i>
              <span>${ch.title.split(':')[0]} (${ch.startPage}-${ch.endPage})</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  },

  jumpToPage(pageNum) {
    const iframe = document.getElementById("bookPdfIframe");
    if (iframe) {
      iframe.src = `${this.BOOK_INFO.pdfUrl}#page=${pageNum}&view=FitH`;
    }
  },

  /**
   * Pre-Exam Study Guide & Questions Preview Modal
   * (ផ្ទាំងសំណួររំលឹកទុកឱ្យសិស្សមើលមុនប្រឡង)
   */
  openPreExamReviewModal(filterCourseOrChapter = "all") {
    let modal = document.getElementById("preExamReviewModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "preExamReviewModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10700";
      document.body.appendChild(modal);
    }

    this.renderPreExamReview(filterCourseOrChapter);
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("preExamReviewModal");
    } else {
      modal.style.display = "flex";
    }
  },

  closePreExamReviewModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("preExamReviewModal");
    } else {
      const el = document.getElementById("preExamReviewModal");
      if (el) el.style.display = "none";
    }
  },

  renderPreExamReview(filter = "all") {
    const modal = document.getElementById("preExamReviewModal");
    if (!modal) return;

    let questions = this.PRE_EXAM_STUDY_QUESTIONS;
    if (filter && filter !== "all") {
      questions = questions.filter(q => q.course === filter || q.chapterId === filter);
    }

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 980px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; padding: 0; overflow: hidden; background: #0f172a; border-radius: 18px; border: 1.5px solid #8b5cf6; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e1b4b, #4c1d95); border-bottom: 2px solid #a855f7; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(168, 85, 247, 0.25); border: 1.5px solid #a855f7; display: flex; align-items: center; justify-content: center; color: #d8b4fe; font-size: 1.3rem;">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
                <span>សំណួររំលឹកមុនប្រឡង (Pre-Exam Study Guide)</span>
                <span class="badge" style="background: #a855f7; color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">ស្រង់ពីសៀវភៅ ១២០ ទំព័រ</span>
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.78rem; color: #cbd5e1;">
                សំណួរ និងចម្លើយពន្យល់សំខាន់ៗបង្កើតឡើងដោយ AI Gemini ចេញពីសៀវភៅមូលដ្ឋាន ដើម្បីឱ្យសិស្សមើលរំលឹកមុនប្រឡង
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="button" onclick="BookStudyEngine.openBookReaderModal()" class="btn-secondary" style="height: 36px; padding: 0 14px; font-size: 0.82rem;">
              <i class="fa-solid fa-book-open"></i> <span>បើកអានសៀវភៅ</span>
            </button>
            <button type="button" onclick="BookStudyEngine.closePreExamReviewModal()" style="background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Filter Category Tabs -->
        <div style="background: rgba(15, 23, 42, 0.7); border-bottom: 1px solid #334155; padding: 10px 24px; display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" onclick="BookStudyEngine.renderPreExamReview('all')" class="btn-paper-filter ${filter === 'all' ? 'active' : ''}" style="height: 34px; font-size: 0.8rem; padding: 0 14px;">
            <i class="fa-solid fa-layer-group"></i> ទាំងអស់ (${this.PRE_EXAM_STUDY_QUESTIONS.length})
          </button>
          <button type="button" onclick="BookStudyEngine.renderPreExamReview('Typing')" class="btn-paper-filter ${filter === 'Typing' ? 'active' : ''}" style="height: 34px; font-size: 0.8rem; padding: 0 14px;">
            <i class="fa-solid fa-keyboard text-purple-400"></i> មេរៀនទី ១-៣ (Typing & IT)
          </button>
          <button type="button" onclick="BookStudyEngine.renderPreExamReview('Word')" class="btn-paper-filter ${filter === 'Word' ? 'active' : ''}" style="height: 34px; font-size: 0.8rem; padding: 0 14px;">
            <i class="fa-solid fa-file-word text-blue-400"></i> មេរៀនទី ៤ (MS Word 2019)
          </button>
          <button type="button" onclick="BookStudyEngine.renderPreExamReview('PowerPoint')" class="btn-paper-filter ${filter === 'PowerPoint' ? 'active' : ''}" style="height: 34px; font-size: 0.8rem; padding: 0 14px;">
            <i class="fa-solid fa-file-powerpoint text-orange-400"></i> មេរៀនទី ៥ (PowerPoint 2019)
          </button>
          <button type="button" onclick="BookStudyEngine.renderPreExamReview('Excel')" class="btn-paper-filter ${filter === 'Excel' ? 'active' : ''}" style="height: 34px; font-size: 0.8rem; padding: 0 14px;">
            <i class="fa-solid fa-file-excel text-emerald-400"></i> មេរៀនទី ៦ (MS Excel 2019)
          </button>
        </div>

        <!-- Question Cards List -->
        <div style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 16px;">
          ${questions.map((q, idx) => `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px 20px; transition: all 0.2s;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #d8b4fe; font-size: 0.75rem; font-weight: 700;">
                  <i class="fa-solid fa-bookmark"></i> ${q.chapterTitle}
                </span>
                <span class="badge font-mono" style="background: rgba(255, 255, 255, 0.08); color: #94a3b8; font-size: 0.74rem;">
                  សំណួរទី ${idx + 1}
                </span>
              </div>

              <h4 style="margin: 0 0 10px; font-size: 1rem; font-weight: 700; color: #fff; line-height: 1.5;">
                ${q.question}
              </h4>

              <div style="background: rgba(15, 23, 42, 0.6); border-left: 3.5px solid #10b981; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px; font-size: 0.85rem; color: #cbd5e1; line-height: 1.6; white-space: pre-line;">
                <strong style="color: #34d399;"><i class="fa-solid fa-circle-check"></i> ចម្លើយផ្លូវការ៖</strong>
                ${q.answer}
              </div>

              ${q.examTip ? `
                <div style="font-size: 0.76rem; color: #fbbf24; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 6px; padding: 6px 12px; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-lightbulb"></i>
                  <span><strong>គន្លឹះប្រឡង:</strong> ${q.examTip}</span>
                </div>
              ` : ''}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
};

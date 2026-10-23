/**
 * ==========================================================================
 * Service & Component: Book Study Engine & Gemini AI Pre-Exam Review
 * (ប្រព័ន្ធសៀវភៅសិក្សាមូលដ្ឋាន E-Book និងសំណួររំលឹកមុនប្រឡងបង្កើតដោយ Gemini AI)
 * Aligned with the official 120-page textbook: «សៀវភៅមូលដ្ឋាន.pdf»
 * ==========================================================================
 */

const BookStudyEngine = {
  STORAGE_KEY_PRE_EXAM: "master_school_pre_exam_questions",

  BOOK_INFO: {
    id: "BOOK-TIS-001",
    title: "សៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័ររដ្ឋបាល & IT (Windows 10, Typing, Word, Excel, PowerPoint 2019)",
    shortTitle: "សៀវភៅមូលដ្ឋានកុំព្យូទ័រ (120 ទំព័រ)",
    pdfUrl: "assets/books/computer_basics_book.pdf",
    khmerPdfUrl: "assets/books/សៀវភៅមូលដ្ឋាន.pdf",
    telegramPdfUrl: "https://api.telegram.org/file/bot8895987401:AAHkXzItXSRlxk-y7H4f3mNxCpiOp6LeHVk/documents/file_0.pdf",
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
        pdfUrl: "assets/books/chapters/ch1_fundamentals.pdf",
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
        pdfUrl: "assets/books/chapters/ch2_windows10.pdf",
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
        pdfUrl: "assets/books/chapters/ch3_typing.pdf",
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
        pdfUrl: "assets/books/chapters/ch4_word.pdf",
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
        pdfUrl: "assets/books/chapters/ch5_powerpoint.pdf",
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
        pdfUrl: "assets/books/chapters/ch6_excel.pdf",
        course: "Excel",
        color: "#107c41",
        icon: "fa-file-excel"
      }
    ]
  },

  // សំណួររំលឹកមុនប្រឡងដកស្រង់ដោយផ្ទាល់ពីសៀវភៅមូលដ្ឋាន ១២០ ទំព័រ (Default Pre-Exam Seed Questions)
  DEFAULT_STUDY_QUESTIONS: [
    // មេរៀនទី ១ & ២: មូលដ្ឋានគ្រឹះ & Windows 10
    {
      id: "REV-CH1-01",
      chapterId: "ch1",
      course: "Typing",
      chapterTitle: "មេរៀនទី ១: មូលដ្ឋានគ្រឹះកុំព្យូទ័រ",
      question: "តើអ្វីទៅជាកុំព្យូទ័រ (Computer)?",
      answer: "កុំព្យូទ័រ គឺជាឧបករណ៍អេឡិចត្រូនិកដែលអាចទទួលទិន្នន័យ (Input) ដំណើរការគណនាទិន្នន័យ (Process) និងបង្ហាញលទ្ធផលព័ត៌មាន (Output) ព្រមទាំងរក្សាទុកទិន្នន័យ (Storage)។",
      examTip: "សំណួរនេះមាននៅលើទំព័រទី ៤ នៃសៀវភៅមូលដ្ឋាន។ ត្រូវចាំ ៤ ដំណាក់កាល៖ Input ➔ Process ➔ Output ➔ Storage។",
      options: [
        "ឧបករណ៍អេឡិចត្រូនិកទទួល គណនា បង្ហាញ និងរក្សាទុកទិន្នន័យ",
        "ម៉ាស៊ីនសម្រាប់មើលតែវីដេអូកម្សាន្ត",
        "ប្រអប់ដែកសម្រាប់តភ្លើងប្រើប្រាស់ក្នុងផ្ទះ",
        "ទូរទស្សន៍ខ្នាតតូចគ្មានសមត្ថភាពគណនា"
      ],
      correct: 0
    },
    {
      id: "REV-CH1-02",
      chapterId: "ch1",
      course: "Typing",
      chapterTitle: "មេរៀនទី ១: មូលដ្ឋានគ្រឹះកុំព្យូទ័រ",
      question: "តើ Hardware និង Software មានភាពខុសគ្នាដូចម្តេច?",
      answer: "Hardware គឺជាសមាសភាគរូបវន្តដែលយើងអាចមើលឃើញ និងប៉ះពាល់បាន (ឧ. Monitor, Keyboard, Mouse, System Unit, Hard Drive)។ រីឯ Software គឺជាកម្មវិធី ឬសេចក្តីណែនាំបញ្ជាឱ្យកុំព្យូទ័រដំណើរការ (ឧ. Windows 10, MS Word, Excel, PowerPoint)។",
      examTip: "សំណួរទំព័រទី ៤៖ Hardware ប៉ះបាន រីឯ Software ជាកម្មវិធីបញ្ជា។",
      options: [
        "Hardware ជាផ្នែករឹងប៉ះបាន រីឯ Software ជាកម្មវិធីបញ្ជាដំណើរការ",
        "Hardware គឺកណ្តុរ រីឯ Software គឺក្តារចុច",
        "ដូចគ្នាទាំងស្រុងគ្មានភាពខុសគ្នាឡើយ",
        "Hardware ប្រើពេលអត់ភ្លើង Software ប្រើពេលមានភ្លើង"
      ],
      correct: 0
    },
    {
      id: "REV-CH2-01",
      chapterId: "ch2",
      course: "Typing",
      chapterTitle: "មេរៀនទី ២: ការប្រើប្រាស់វីនដូ ១០",
      question: "ដើម្បីប្តូរឈ្មោះ (Rename), ថតចម្លង (Copy), និងបន្លាស់ទី (Move/Cut) លើ File ឬ Folder ក្នុង Windows 10 ត្រូវធ្វើដូចម្តេច?",
      answer: "ចុច Right Click លើ File/Folder នោះ៖\n- ប្តូរឈ្មោះ៖ ជ្រើសយក 'Rename'\n- ថតចម្លង៖ ជ្រើសយក 'Copy' រួចទៅកន្លែងថ្មី Right Click យក 'Paste'\n- បន្លាស់ទី៖ ជ្រើសយក 'Cut' រួចទៅកន្លែងថ្មី Right Click យក 'Paste'។",
      examTip: "សៀវភៅទំព័រទី ៩៖ ក្បួនគ្រប់គ្រង Folder ត្រូវចាំ Shortcuts: Ctrl+C (Copy), Ctrl+X (Cut), Ctrl+V (Paste), F2 (Rename)។",
      options: [
        "ចុច Right Click ➔ Rename (ប្តូរឈ្មោះ), Copy (ថតចម្លង), Cut (បន្លាស់ទី)",
        "ចុច Delete រួចវាយឈ្មោះថ្មី",
        "ចុច Ctrl + P រួចបិទកុំព្យូទ័រ",
        "ទាញទម្លាក់ចូល Recycle Bin រួចបើកឡើងវិញ"
      ],
      correct: 0
    },

    // មេរៀនទី ៣: Typing
    {
      id: "REV-CH3-01",
      chapterId: "ch3",
      course: "Typing",
      chapterTitle: "មេរៀនទី ៣: ជំនាញវាយអត្ថបទ Typing",
      question: "ក្នុងការវាយអក្សរយូនីកូដខ្មែរ (Khmer Unicode) តើគ្រាប់ចុចមួយណាប្រើសម្រាប់បង្កើត 'ជើងអក្សរ'?",
      answer: "គឺគ្រាប់ចុចអក្សរ 'j' (Subscript key)។ ឧទាហរណ៍៖ ដើម្បីវាយពាក្យ 'ក្ដារ' ត្រូវវាយ អក្សរ ក + j + ដ + ា + រ។",
      examTip: "សៀវភៅទំព័រទី ១១៖ គ្រាប់ចុច j ដើរតួជាសញ្ញាជើងអក្សរខ្មែរជានិច្ច។",
      options: [
        "គ្រាប់ចុចអក្សរ j",
        "គ្រាប់ចុច Shift",
        "គ្រាប់ចុច Ctrl",
        "គ្រាប់ចុច Spacebar"
      ],
      correct: 0
    },
    {
      id: "REV-CH3-02",
      chapterId: "ch3",
      course: "Typing",
      chapterTitle: "មេរៀនទី ៣: ជំនាញវាយអត្ថបទ Typing",
      question: "តើគ្រាប់ចុចជួរកណ្តាល (Home Row Keys) សម្រាប់ដាក់ម្រាមដៃទាំង ១០ មានគ្រាប់ចុចអ្វីខ្លះ?",
      answer: "ដៃឆ្វេងដាក់លើគ្រាប់៖ A S D F (កូនដៃលើ A, មេដៃលើ Spacebar)\nដៃស្តាំដាក់លើគ្រាប់៖ J K L ; (ចង្អុលដៃលើ J, មេដៃលើ Spacebar) ដោយមានចំណុចផុសលើគ្រាប់ F និង J។",
      examTip: "សៀវភៅទំព័រទី ២-៣ និង ១០៖ ត្រូវចាំ Home Row Keys ជានិច្ចពេលប្រឡង Typing។",
      options: [
        "ដៃឆ្វេង A S D F និងដៃស្តាំ J K L ;",
        "ដៃឆ្វេង Q W E R និងដៃស្តាំ U I O P",
        "ដៃឆ្វេង Z X C V និងដៃស្តាំ M N B V",
        "ដៃឆ្វេង 1 2 3 4 និងដៃស្តាំ 7 8 9 0"
      ],
      correct: 0
    },

    // មេរៀនទី ៤: Microsoft Word 2019
    {
      id: "REV-CH4-01",
      chapterId: "ch4",
      course: "Word",
      chapterTitle: "មេរៀនទី ៤: កម្មវិធី Microsoft Word 2019",
      question: "តើក្បួនខ្នាតរឹមទំព័រ (Margins) ស្តង់ដារលិខិតរដ្ឋបាលកម្ពុជា ត្រូវកំណត់ទំហំប៉ុន្មានខ្លះ?",
      answer: "ចូល Tab Layout ➔ Margins ➔ Custom Margins៖\n- ខាងលើ (Top): 2.5 cm\n- ខាងក្រោម (Bottom): 2.5 cm\n- ខាងឆ្វេង (Left): 2.5 cm (សម្រាប់ចោះកាតាឡុក)\n- ខាងស្តាំ (Right): 2.0 cm (ឬ 1.5 cm)។",
      examTip: "សៀវភៅទំព័រទី ១៤ & ៤៥៖ ស្តង់ដារលិខិតរដ្ឋបាលជាតិកម្ពុជា តែងតែចេញក្នុងវិញ្ញាសាប្រឡងបញ្ចប់វគ្គ Word។",
      options: [
        "Top 2.5cm, Bottom 2.5cm, Left 2.5cm, Right 2.0cm",
        "Top 5cm, Bottom 5cm, Left 5cm, Right 5cm",
        "Top 1cm, Bottom 1cm, Left 1cm, Right 1cm",
        "មិនបាច់កំណត់រឹមទេប្រើតាមស្រេចចិត្ត"
      ],
      correct: 0
    },
    {
      id: "REV-CH4-02",
      chapterId: "ch4",
      course: "Word",
      chapterTitle: "មេរៀនទី ៤: កម្មវិធី Microsoft Word 2019",
      question: "ក្បាលលិខិតជាតិ 'ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ' ត្រូវប្រើ Font និងទំហំប៉ុន្មាន?",
      answer: "ត្រូវប្រើ Font 'Khmer OS Muol Light' ទំហំ 14pt (ដាក់ចំកណ្តាល Center)។ រីឯខ្លឹមសារអត្ថបទរដ្ឋបាលទូទៅ ប្រើ Font 'Khmer OS Siemreap' ទំហំ 11pt ឬ 12pt គម្លាតបន្ទាត់ 1.15។",
      examTip: "សៀវភៅទំព័រទី ១៥ & ៤៥ (Project ទី១)៖ Font Muol Light សម្រាប់ក្បាលលិខិតផ្លូវការ។",
      options: [
        "Khmer OS Muol Light ទំហំ 14pt",
        "Khmer OS Battambang ទំហំ 8pt",
        "Arial Black ទំហំ 24pt",
        "Times New Roman 10pt"
      ],
      correct: 0
    },
    {
      id: "REV-CH4-03",
      chapterId: "ch4",
      course: "Word",
      chapterTitle: "មេរៀនទី ៤: កម្មវិធី Microsoft Word 2019",
      question: "តើមុខងារ Drop Cap និង Columns ប្រើប្រាស់សម្រាប់អ្វី?",
      answer: "មុខងារ Columns (Tab Layout ➔ Columns) ប្រើសម្រាប់បំបែកអត្ថបទជាច្រើនជួរឈរដូចកាសែត។ រីឯ Drop Cap (Tab Insert ➔ Drop Cap) ប្រើសម្រាប់ពង្រីកតួអក្សរដំបូងគេនៃកថាខណ្ឌឱ្យធំលេចធ្លោ។",
      examTip: "សៀវភៅទំព័រទី ២១៖ Drop Cap ស្ថិតក្នុង Insert Tab, Columns ស្ថិតក្នុង Layout Tab។",
      options: [
        "Columns បំបែកជួរឈរដូចកាសែត, Drop Cap ពង្រីកអក្សរដើមកថាខណ្ឌឱ្យធំ",
        "Columns សម្រាប់ប្តូរពណ៌, Drop Cap សម្រាប់លុបអក្សរ",
        "Columns សម្រាប់ព្រីន, Drop Cap សម្រាប់ Save",
        "ទាំងពីរនេះប្រើសម្រាប់គណនាលេខបូកដក"
      ],
      correct: 0
    },
    {
      id: "REV-CH4-04",
      chapterId: "ch4",
      course: "Word",
      chapterTitle: "មេរៀនទី ៤: កម្មវិធី Microsoft Word 2019",
      question: "ដើម្បីបញ្ចូលក្រឡា (Merge Cells) ក្នុងតារាង Word ត្រូវធ្វើដូចម្តេច?",
      answer: "Select ក្រឡា (Cells) ដែលត្រូវបញ្ចូលគ្នា ➔ ចូលទៅកាន់ Tab 'Layout' ក្រោម Table Tools ➔ ចុចលើពាក្យ 'Merge Cells'។",
      examTip: "សៀវភៅទំព័រទី ៣៥៖ Merge Cells = បញ្ចូលក្រឡា, Split Cells = ពុះបំបែកក្រឡា។",
      options: [
        "Select Cells ➔ Tab Table Layout ➔ ចុច Merge Cells",
        "ចុច Ctrl + Delete លើ Keyboard",
        "ចុច Tab File ➔ Save As",
        "ចុចបិទកម្មវិធី Word រួចបើកវិញ"
      ],
      correct: 0
    },

    // មេរៀនទី ៥: Microsoft PowerPoint 2019
    {
      id: "REV-CH5-01",
      chapterId: "ch5",
      course: "PowerPoint",
      chapterTitle: "មេរៀនទី ៥: Microsoft PowerPoint 2019",
      question: "តើ Shortcut សម្រាប់បញ្ចាំង Slide Show ពីដើម និងពីស្លាយបច្ចុប្បន្ន មានភាពខុសគ្នាដូចម្តេច?",
      answer: "- ចុចគ្រាប់ចុច F5៖ ចាប់ផ្តើមបញ្ចាំង Slide Show ពីស្លាយដំបូងគេបង្អស់ (First Slide)\n- ចុច Shift + F5៖ ចាប់ផ្តើមបញ្ចាំងពីស្លាយបច្ចុប្បន្នដែលកំពុងជ្រើសរើស (Current Slide)។",
      examTip: "សៀវភៅទំព័រទី ៥៧៖ F5 = ពីដើម, Shift + F5 = ពីស្លាយកំពុងមើល។",
      options: [
        "F5 បញ្ចាំងពីស្លាយដំបូងគេ, Shift + F5 បញ្ចាំងពីស្លាយបច្ចុប្បន្ន",
        "F5 សម្រាប់បិទម៉ាស៊ីន, Shift + F5 សម្រាប់បើកម៉ាស៊ីន",
        "ដូចគ្នាទាំងស្រុងមិនខុសគ្នាឡើយ",
        "F5 សម្រាប់ដាក់ចម្រៀង, Shift + F5 សម្រាប់ដាក់រូបភាព"
      ],
      correct: 0
    },
    {
      id: "REV-CH5-02",
      chapterId: "ch5",
      course: "PowerPoint",
      chapterTitle: "មេរៀនទី ៥: Microsoft PowerPoint 2019",
      question: "តើ Transitions និង Animations ក្នុង PowerPoint ខុសគ្នាដូចម្តេច?",
      answer: "- Transitions (Tab Transition)៖ ជាបែបផែនចលនាផ្លាស់ប្តូរពេលរំកិលពី Slide មួយទៅកាន់ Slide មួយទៀត\n- Animations (Tab Animation)៖ ជាបែបផែនចលនាដាក់លើអត្ថបទ រូបភាព ឬរូបរាង (Objects) ខាងក្នុង Slide។",
      examTip: "សៀវភៅទំព័រទី ៥៥-៥៦៖ Transition = រវាង Slide, Animation = លើអក្សរ/រូបភាព។",
      options: [
        "Transitions ចលនារវាង Slide, Animations ចលនាលើអក្សរឬរូបភាពក្នុង Slide",
        "Transitions សម្រាប់ព្រីន, Animations សម្រាប់ Save",
        "Transitions ជាភាសាខ្មែរ, Animations ជាភាសាអង់គ្លេស",
        "Transitions សម្រាប់លុប Slide, Animations សម្រាប់បន្ថែម Slide"
      ],
      correct: 0
    },

    // មេរៀនទី ៦: Microsoft Excel 2019
    {
      id: "REV-CH6-01",
      chapterId: "ch6",
      course: "Excel",
      chapterTitle: "មេរៀនទី ៦: Microsoft Excel 2019",
      question: "តើរូបមន្តអក្សរ Upper, Lower, និង Proper មានតួនាទីអ្វីខ្លះ?",
      answer: "- =UPPER(text)៖ បំប្លែងអក្សរទាំងអស់ទៅជាអក្សរធំ (Capital letters)\n- =LOWER(text)៖ បំប្លែងអក្សរទាំងអស់ទៅជាអក្សរតូច (Lowercase)\n- =PROPER(text)៖ បំប្លែងអក្សរដើមនៃពាក្យនីមួយៗទៅជាអក្សរធំ (Title case)។",
      examTip: "សៀវភៅទំព័រទី ៨៩៖ ចំណុចទី ៧ រូបមន្ត Upper, Lower, Proper ចេញប្រឡងញឹកញាប់។",
      options: [
        "UPPER (អក្សរធំទាំងអស់), LOWER (អក្សរតូចទាំងអស់), PROPER (អក្សរធំដើមពាក្យ)",
        "UPPER (បូកលេខ), LOWER (ដកលេខ), PROPER (គុណលេខ)",
        "UPPER (លុបក្រឡា), LOWER (បន្ថែមក្រឡា), PROPER (ចាក់ពណ៌)",
        "ទាំងបីនេះគឺជារូបមន្តរកថ្ងៃខែឆ្នាំ"
      ],
      correct: 0
    },
    {
      id: "REV-CH6-02",
      chapterId: "ch6",
      course: "Excel",
      chapterTitle: "មេរៀនទី ៦: Microsoft Excel 2019",
      question: "តើរូបមន្ត IF, SUMIF, និង COUNTIF មានទម្រង់សរសេរយ៉ាងដូចម្តេច?",
      answer: "1. =IF(logical_test, value_if_true, value_if_false)\n   ឧ. =IF(E2>=50, \"ជាប់\", \"ធ្លាក់\")\n2. =COUNTIF(range, criteria)\n   ឧ. =COUNTIF(C2:C50, \"ស្រី\") សម្រាប់រាប់ចំនួនសិស្សស្រី\n3. =SUMIF(range, criteria, [sum_range])\n   ឧ. =SUMIF(C2:C50, \"Typing\", D2:D50) សម្រាប់បូកសរុបពិន្ទុតែវគ្គ Typing។",
      examTip: "សៀវភៅទំព័រទី ៩៤, ៩៦, ៩៨៖ រូបមន្តមានលក្ខខណ្ឌ IF, COUNTIF, SUMIF ជាចំណុចស្នូលនៃវគ្គ Excel។",
      options: [
        "IF (លក្ខខណ្ឌ), COUNTIF (រាប់មានលក្ខខណ្ឌ), SUMIF (បូកសរុបមានលក្ខខណ្ឌ)",
        "IF (គូររូប), COUNTIF (ដាក់ពណ៌), SUMIF (ព្រីន)",
        "IF (បិទ Excel), COUNTIF (បើក Excel), SUMIF (Save)",
        "ទាំងបីជារូបមន្តសម្រាប់លុបលេខសូន្យ"
      ],
      correct: 0
    },
    {
      id: "REV-CH6-03",
      chapterId: "ch6",
      course: "Excel",
      chapterTitle: "មេរៀនទី ៦: Microsoft Excel 2019",
      question: "តើការចាក់សោក្រឡាដាច់ខាត (Absolute Reference) ដោយប្រើសញ្ញា $ (ឧ. $A$1) មានប្រយោជន៍អ្វី?",
      answer: "ដើម្បីរក្សាទីតាំងក្រឡា $A$1 ឱ្យនៅថេរដដែល មិនផ្លាស់ប្តូរនៅពេលយើង Copy ឬ Autofill អូសរូបមន្តចុះក្រោម ឬទៅស្តាំ។",
      examTip: "សៀវភៅទំព័រទី ៨៧៖ ចុច F4 លើ Keyboard ដើម្បីបន្ថែមសញ្ញា $ ចាក់សោក្រឡា។",
      options: [
        "រក្សាទីតាំងក្រឡាឱ្យនៅថេរពេលអូសចម្លងរូបមន្ត (Autofill)",
        "ដើម្បីប្តូររូបិយប័ណ្ណទៅជាប្រាក់ដុល្លារ",
        "ដើម្បីលុបទិន្នន័យក្នុងក្រឡានោះ",
        "ដើម្បីលាក់ក្រឡាមិនឱ្យគេមើលឃើញ"
      ],
      correct: 0
    }
  ],

  cachedCurriculum: null,
  activeReviewTab: "all",
  activeReviewMode: "study", // 'study' | 'quiz'

  init() {
    this.ensureStorage();
  },

  ensureStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_PRE_EXAM);
      if (!stored) {
        localStorage.setItem(this.STORAGE_KEY_PRE_EXAM, JSON.stringify(this.DEFAULT_STUDY_QUESTIONS));
      }
    } catch (e) {
      console.warn("BookStudyEngine storage init warning:", e);
    }
  },

  getAllPreExamQuestions() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_PRE_EXAM);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...this.DEFAULT_STUDY_QUESTIONS];
  },

  saveAllPreExamQuestions(questions) {
    try {
      localStorage.setItem(this.STORAGE_KEY_PRE_EXAM, JSON.stringify(questions));
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected && StudentAPI.isCloudConnected()) {
        try {
          firebase.database().ref("pre_exam_questions").set(questions);
        } catch (e) {}
      }
      return true;
    } catch (e) {
      console.error("Failed to save pre exam questions:", e);
      return false;
    }
  },

  addPreExamQuestion(q) {
    const questions = this.getAllPreExamQuestions();
    const newId = `REV-AI-${Date.now().toString().slice(-4)}`;
    const newItem = {
      ...q,
      id: q.id || newId,
      createdAt: new Date().toISOString()
    };
    questions.unshift(newItem);
    this.saveAllPreExamQuestions(questions);
    return newItem;
  },

  /**
   * Fetch curriculum JSON content if needed
   */
  async loadCurriculum() {
    if (this.cachedCurriculum) return this.cachedCurriculum;
    try {
      const resp = await fetch("assets/books/book_curriculum.json");
      if (resp.ok) {
        this.cachedCurriculum = await resp.json();
        return this.cachedCurriculum;
      }
    } catch (e) {
      console.warn("Could not fetch book_curriculum.json, using built-in structure", e);
    }
    return null;
  },

  /**
   * CORE REQUIREMENT:
   * AI Gemini generates Pre-Exam Questions AND Exam Papers strictly using the User's Textbook Content!
   */
  async generateQuestionsFromBookWithAI({
    chapterId = "ch4",
    topic = "",
    count = 5,
    difficulty = "មធ្យម",
    targetMode = "both" // 'review' | 'bank' | 'both'
  }) {
    const chapter = this.BOOK_INFO.chapters.find(c => c.id === chapterId) || this.BOOK_INFO.chapters[3];
    const curriculum = await this.loadCurriculum();

    let chapterExcerpt = "";
    if (curriculum && curriculum.chapters) {
      const match = curriculum.chapters.find(c => c.id === chapterId);
      if (match && match.extracted_content) {
        chapterExcerpt = match.extracted_content.slice(0, 3500); // Send rich 3.5k characters of real textbook Khmer
      }
    }

    const cleanTopic = topic.trim() || chapter.desc;

    const prompt = `
You are the Senior Curriculum Exam Director for Tian Xin International School (សាលា អន្តរជាតិ ធានស៊ីន - TIS LAB COMPUTER).
Generate authentic exam and pre-exam study questions based STRICTLY and FAITHFULLY on the official 120-page textbook:
Textbook: «${this.BOOK_INFO.title}»
Chapter: ${chapter.title} (Pages ${chapter.startPage}-${chapter.endPage})
Subject/Course: ${chapter.course}
Curriculum Summary: ${chapter.desc}
Specific Lesson Focus: ${cleanTopic}
Difficulty: ${difficulty}
Question Count: ${count}

${chapterExcerpt ? `ACTUAL LESSON EXCERPT FROM TEXTBOOK:\n${chapterExcerpt}\n` : ''}

CRITICAL RULES:
1. Every question must be directly grounded in the content taught in this chapter (Khmer Unicode shortcuts, Windows 10 file operations, MS Word margins/tables, Excel formulas like IF/SUMIF/COUNTIF/UPPER, PowerPoint animation/slide show keys).
2. Write in polite, educational Khmer language with English technical terms in parentheses where appropriate.
3. For each question, provide:
   - question: The clear question in Khmer.
   - answer: The comprehensive, model answer that students must understand.
   - examTip: An actionable exam tip explicitly mentioning the chapter and page range (e.g. "ដកស្រង់ពីមេរៀនទី... ទំព័រទី... នៃសៀវភៅមូលដ្ឋាន")
   - options: An array of 4 distinct Multiple Choice choices (A, B, C, D) in Khmer.
   - correct: Index of correct option (0, 1, 2, or 3).
   - points: 10
   - explanation: Educational explanation for why that option is correct.

Return strictly a RAW JSON array of objects without markdown backticks:
[
  {
    "scenario": "${cleanTopic}",
    "question": "ខ្លឹមសារសំណួរជាភាសាខ្មែរ?",
    "answer": "ចម្លើយផ្លូវការលម្អិត...",
    "examTip": "ដកស្រង់ចេញពីសៀវភៅមូលដ្ឋាន ទំព័រទី...៖ គន្លឹះចងចាំ...",
    "options": ["ជម្រើស A", "ជម្រើស B", "ជម្រើស C", "ជម្រើស D"],
    "correct": 0,
    "points": 10,
    "difficulty": "${difficulty}",
    "explanation": "ការពន្យល់លម្អិត..."
  }
]
`.trim();

    let generatedList = [];

    // Call Gemini AI
    if (typeof GeminiAIService !== "undefined") {
      try {
        generatedList = await GeminiAIService.callGeminiJson(prompt);
      } catch (err) {
        console.warn("Gemini AI API call encountered issue, using chapter fallback engine:", err.message);
      }
    }

    // Smart Textbook Fallback if AI offline
    if (!Array.isArray(generatedList) || generatedList.length === 0) {
      generatedList = this._fallbackGenerateChapterQuestions(chapter, cleanTopic, count, difficulty);
    }

    const createdReviewQuestions = [];
    const createdBankQuestions = [];

    // Process & Sync
    generatedList.forEach((item, idx) => {
      // 1. Add to Pre-Exam Review (for students to study before exam)
      if (targetMode === "review" || targetMode === "both") {
        const reviewItem = this.addPreExamQuestion({
          chapterId: chapter.id,
          course: chapter.course,
          chapterTitle: chapter.title,
          question: item.question,
          answer: item.answer || item.explanation || (item.options ? item.options[item.correct || 0] : ""),
          examTip: item.examTip || `ដកស្រង់ពីសៀវភៅមូលដ្ឋាន ទំព័រ ${chapter.startPage}-${chapter.endPage} (${chapter.title})`,
          options: item.options,
          correct: item.correct !== undefined ? item.correct : 0
        });
        createdReviewQuestions.push(reviewItem);
      }


    });

    return {
      chapter,
      reviewCount: createdReviewQuestions.length,
      bankCount: createdBankQuestions.length,
      reviewQuestions: createdReviewQuestions,
      bankQuestions: createdBankQuestions
    };
  },

  _fallbackGenerateChapterQuestions(chapter, topic, count, difficulty) {
    const res = [];
    const templates = {
      ch1: [
        {
          q: "តើ Hardware និង Software របស់កុំព្យូទ័រ មានចំណុចណាខ្លះដែលខុសគ្នា?",
          a: "Hardware គឺជាសមាសភាគរូបវន្តប៉ះបាន (Mouse, Keyboard, CPU) រីឯ Software ជាប្រព័ន្ធបញ្ជា (Windows, Office)។",
          tip: "សៀវភៅទំព័រ ១១-១២៖ ត្រូវចាំថា Hardware ប៉ះបាន រីឯ Software ជាកម្មវិធី។",
          opts: ["Hardware ប៉ះបាន រីឯ Software ជាកម្មវិធីបញ្ជា", "Hardware ជាកម្មវិធី រីឯ Software ជាប្រអប់ដែក", "ទាំងពីរគឺដូចគ្នា", "មិនមានភាពខុសគ្នាឡើយ"],
          correct: 0
        },
        {
          q: "តើ System Unit មានផ្ទុកនូវសមាសធាតុសំខាន់ៗអ្វីខ្លះដែលមិនអាចខ្វះបាន?",
          a: "System Unit មានផ្ទុក Motherboard, CPU, RAM, Hard Disk, និង Power Supply។",
          tip: "សៀវភៅទំព័រ ១២៖ CPU, RAM, Hard Disk ស្ថិតក្នុង Case System Unit។",
          opts: ["CPU, RAM, Hard Disk, Power Supply", "មានតែ Mouse និង Keyboard", "មានតែកញ្ចក់ Monitor", "មានតែខ្សែភ្លើង"],
          correct: 0
        }
      ],
      ch2: [
        {
          q: "ដើម្បីប្តូរឈ្មោះ File ឬ Folder ក្នុង Windows 10 ដោយប្រើ Shortcut តើត្រូវចុចគ្រាប់ចុចមួយណា?",
          a: "ចុចគ្រាប់ចុច F2 លើ Keyboard ដើម្បី Rename ឈ្មោះ File/Folder ភ្លាមៗ។",
          tip: "សៀវភៅទំព័រ ១៩៖ គ្រាប់ចុច F2 = Rename, Delete = លុបចូល Recycle Bin។",
          opts: ["F2", "F5", "Ctrl + P", "Alt + F4"],
          correct: 0
        },
        {
          q: "ដើម្បីចូលទៅកាន់ Windows File Explorer តាមរយៈ Shortcut Key ត្រូវចុច៖",
          a: "ចុច Windows Key + E ដើម្បីបើក File Explorer រហ័ស។",
          tip: "សៀវភៅទំព័រ ១៨៖ Windows Key + E បើក Explorer គ្រប់គ្រង Drive C: និង D:។",
          opts: ["Windows Key + E", "Ctrl + Shift + Esc", "Alt + Tab", "Windows Key + L"],
          correct: 0
        }
      ],
      ch3: [
        {
          q: "ក្នុងការវាយអត្ថបទយូនីកូដខ្មែរ (Khmer Unicode) តើគ្រាប់ចុច 'j' ប្រើសម្រាប់អ្វី?",
          a: "ប្រើសម្រាប់បង្កើតជើងអក្សរព្យញ្ជនៈខ្មែរ (Coeng Key)។",
          tip: "សៀវភៅទំព័រ ២១៖ គ្រាប់ចុច j គឺសម្រាប់ផ្ញើជើងព្យញ្ជនៈជានិច្ច។",
          opts: ["ផ្ញើជើងព្យញ្ជនៈ (ជើងអក្សរ)", "ដកឃ្លា", "ចុះបន្ទាត់", "ប្តូរភាសា"],
          correct: 0
        }
      ],
      ch4: [
        {
          q: "តើក្បួនខ្នាតរឹមទំព័រ (Margins) ស្តង់ដារលិខិតរដ្ឋបាលកម្ពុជា ត្រូវកំណត់យ៉ាងដូចម្តេច?",
          a: "ចូល Tab Layout ➔ Margins ➔ Custom Margins: Top 2.5cm, Bottom 2.5cm, Left 2.5cm, Right 2.0cm។",
          tip: "សៀវភៅទំព័រ ២៤ & ៤៥៖ ស្តង់ដារលិខិតរដ្ឋបាលជាតិ A4។",
          opts: ["Top 2.5cm, Bottom 2.5cm, Left 2.5cm, Right 2.0cm", "Top 5cm, Bottom 5cm, Left 5cm, Right 5cm", "1cm គ្រប់ជ្រុង", "មិនបាច់កំណត់"],
          correct: 0
        },
        {
          q: "ក្បាលលិខិតផ្លូវការ 'ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ' ត្រូវប្រើ Font អ្វី?",
          a: "ប្រើ Font Khmer OS Muol Light ទំហំ 14pt (Center)។",
          tip: "សៀវភៅទំព័រ ២៥ & ៤៦៖ Font Muol Light សម្រាប់ក្បាលលិខិត។",
          opts: ["Khmer OS Muol Light (14pt)", "Khmer OS Battambang (10pt)", "Khmer OS Siemreap (9pt)", "Arial (12pt)"],
          correct: 0
        }
      ],
      ch5: [
        {
          q: "តើ Shortcut សម្រាប់បង្កើត New Slide បន្ថែមក្នុង PowerPoint គឺគ្រាប់ចុចអ្វី?",
          a: "ចុច Ctrl + M ដើម្បីបង្កើត New Slide ថ្មីបន្ថែម។",
          tip: "សៀវភៅទំព័រ ៥៨៖ Ctrl+M = New Slide, Ctrl+N = New Presentation File។",
          opts: ["Ctrl + M", "Ctrl + N", "Ctrl + S", "Alt + M"],
          correct: 0
        },
        {
          q: "ដើម្បីចាប់ផ្តើម Slide Show ពីស្លាយបច្ចុប្បន្នដែលកំពុងមើល (Current Slide) ត្រូវចុច៖",
          a: "ចុច Shift + F5 ដើម្បីបញ្ចាំងពីស្លាយបច្ចុប្បន្ន។",
          tip: "សៀវភៅទំព័រ ៦២៖ F5 = ពីដើម, Shift + F5 = ពីស្លាយបច្ចុប្បន្ន។",
          opts: ["Shift + F5", "F5", "Ctrl + F5", "Alt + F5"],
          correct: 0
        }
      ],
      ch6: [
        {
          q: "នៅក្នុង Microsoft Excel តើសញ្ញាណាដែលត្រូវសរសេរនៅខាងមុខជានិច្ច មុនពេលចាប់ផ្តើមរូបមន្ត?",
          a: "សញ្ញាស្មើ (=) ត្រូវតែដាក់នៅមុខរូបមន្ត ឬអនុគមន៍ជានិច្ច។",
          tip: "សៀវភៅទំព័រ ៧៥៖ រាល់រូបមន្តក្នុង Excel ត្រូវចាប់ផ្តើមដោយសញ្ញាស្មើ (=)។",
          opts: ["សញ្ញាស្មើ (=)", "សញ្ញាបូក (+)", "សញ្ញាគុណ (*)", "សញ្ញាដក (-)"],
          correct: 0
        },
        {
          q: "តើរូបមន្ត =PROPER(text) ក្នុង Excel ប្រើសម្រាប់បំប្លែងអក្សរដូចម្តេច?",
          a: "បំប្លែងតួអក្សរដើមនៃពាក្យនីមួយៗឱ្យទៅជាអក្សរធំ (Capitalize each word)។",
          tip: "សៀវភៅទំព័រ ៨៩៖ UPPER (ធំទាំងអស់), LOWER (តូចទាំងអស់), PROPER (ធំដើមពាក្យ)។",
          opts: ["បំប្លែងអក្សរដើមនៃពាក្យនីមួយៗទៅជាអក្សរធំ", "បំប្លែងអក្សរទាំងអស់ទៅជាអក្សរធំ", "បំប្លែងទៅជាអក្សរតូច", "លុបអក្សរចោល"],
          correct: 0
        }
      ]
    };

    const chapterList = templates[chapter.id] || templates.ch4;
    for (let i = 0; i < count; i++) {
      const base = chapterList[i % chapterList.length];
      res.push({
        scenario: `${chapter.title.split(':')[0]} - ${topic}`,
        question: base.q,
        answer: base.a,
        examTip: base.tip,
        options: base.opts,
        correct: base.correct,
        points: 10,
        difficulty: difficulty,
        explanation: base.a
      });
    }
    return res;
  },

  /**
   * Open the E-Book Reader Modal
   */
  openBookReaderModal(initialPage = 1, initialChapterId = null) {
    this.ensureModal();
    this.renderBookReader(initialPage, initialChapterId);
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

  renderBookReader(page = 1, chapterId = null) {
    const modal = document.getElementById("bookReaderModal");
    if (!modal) return;

    const b = this.BOOK_INFO;
    let currentSrc = `${b.pdfUrl}#page=${page}&view=FitH`;

    if (chapterId) {
      const matched = b.chapters.find(c => c.id === chapterId);
      if (matched && matched.pdfUrl) {
        currentSrc = matched.pdfUrl;
      }
    }

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
            <select onchange="BookStudyEngine.handleReaderSelect(this.value)" style="height: 36px; padding: 0 10px; background: rgba(15, 23, 42, 0.9); border: 1px solid #8b5cf6; border-radius: 8px; color: #fff; font-size: 0.82rem;">
              <option value="page:1">ទំព័រដំបូង (គម្របសៀវភៅ)</option>
              <option value="page:5">មាតិកា (Table of Contents)</option>
              ${b.chapters.map(ch => `
                <option value="chapter:${ch.id}" ${chapterId === ch.id ? 'selected' : ''}>
                  ${ch.title.split(':')[0]} (${ch.startPage}-${ch.endPage})
                </option>
              `).join("")}
            </select>

            <a href="${b.telegramPdfUrl}" target="_blank" class="btn-primary" style="height: 36px; padding: 0 12px; font-size: 0.8rem; background: #0284c7; border: none; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; border-radius: 8px;">
              <i class="fa-brands fa-telegram"></i> <span>តេឡេក្រាម E-Book</span>
            </a>

            <button type="button" onclick="BookStudyEngine.openPreExamReviewModal('all')" class="btn-primary" style="height: 36px; padding: 0 14px; font-size: 0.82rem; background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">
              <i class="fa-solid fa-brain"></i> <span>សំណួររំលឹកមុនប្រឡង</span>
            </button>

            <button type="button" onclick="BookStudyEngine.closeBookReaderModal()" style="background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Embedded PDF Viewer -->
        <div style="flex: 1; background: #1e293b; position: relative;">
          <iframe id="bookPdfIframe" src="${currentSrc}" style="width: 100%; height: 100%; border: none;" title="សៀវភៅមូលដ្ឋានកុំព្យូទ័រ"></iframe>
        </div>

        <!-- Bottom Quick Chapter Bar -->
        <div style="background: #0f172a; border-top: 1px solid #334155; padding: 8px 16px; display: flex; gap: 8px; overflow-x: auto; white-space: nowrap;">
          <button type="button" onclick="BookStudyEngine.jumpToPage(1)" style="height: 30px; padding: 0 12px; font-size: 0.74rem; background: rgba(30, 41, 59, 0.8); border: 1px solid #8b5cf650; border-radius: 6px; color: #fff; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-book"></i>
            <span>សៀវភៅពេញលេញ (១២០ ទំព័រ)</span>
          </button>
          ${b.chapters.map(ch => `
            <button type="button" onclick="BookStudyEngine.loadChapterPdf('${ch.id}')" style="height: 30px; padding: 0 12px; font-size: 0.74rem; background: rgba(30, 41, 59, 0.8); border: 1px solid ${ch.color}50; border-radius: 6px; color: #fff; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid ${ch.icon}" style="color: ${ch.color};"></i>
              <span>${ch.title.split(':')[0]} (${ch.startPage}-${ch.endPage})</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  },

  handleReaderSelect(val) {
    if (val.startsWith("page:")) {
      this.jumpToPage(parseInt(val.split(":")[1], 10));
    } else if (val.startsWith("chapter:")) {
      this.loadChapterPdf(val.split(":")[1]);
    }
  },

  jumpToPage(pageNum) {
    const iframe = document.getElementById("bookPdfIframe");
    if (iframe) {
      iframe.src = `${this.BOOK_INFO.pdfUrl}#page=${pageNum}&view=FitH`;
    }
  },

  loadChapterPdf(chapterId) {
    const chapter = this.BOOK_INFO.chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    const iframe = document.getElementById("bookPdfIframe");
    if (iframe) {
      iframe.src = chapter.pdfUrl || `${this.BOOK_INFO.pdfUrl}#page=${chapter.startPage}&view=FitH`;
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

    this.activeReviewTab = filterCourseOrChapter || "all";
    this.activeReviewMode = "study";
    this.renderPreExamReview(this.activeReviewTab);

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

  switchReviewTab(filter) {
    this.activeReviewTab = filter;
    this.renderPreExamReview(filter);
  },

  switchReviewMode(mode) {
    this.activeReviewMode = mode;
    this.renderPreExamReview(this.activeReviewTab);
  },

  renderPreExamReview(filter = "all") {
    const modal = document.getElementById("preExamReviewModal");
    if (!modal) return;

    let allQuestions = this.getAllPreExamQuestions();
    let questions = allQuestions;
    if (filter && filter !== "all") {
      questions = questions.filter(q => q.course === filter || q.chapterId === filter);
    }

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 1020px; width: 95%; max-height: 92vh; display: flex; flex-direction: column; padding: 0; overflow: hidden; background: #0f172a; border-radius: 18px; border: 1.5px solid #8b5cf6; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);">
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
                បង្កើតដោយ Google Gemini AI ចេញពីសៀវភៅមូលដ្ឋាន ដើម្បីឱ្យសិស្សមើលរំលឹកមុនប្រឡង (សំណួរប្រឡងចេញពីសំណួរទាំងនេះ ១០០%)
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button type="button" onclick="BookStudyEngine.openBookAiGeneratorModal()" class="btn-primary" style="height: 36px; padding: 0 14px; font-size: 0.82rem; background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px; font-weight: 700;">
              <i class="fa-solid fa-wand-magic-sparkles"></i> <span>⚡ AI បង្កើតសំណួរពីសៀវភៅ</span>
            </button>
            <button type="button" onclick="BookStudyEngine.openBookReaderModal()" class="btn-secondary" style="height: 36px; padding: 0 12px; font-size: 0.8rem;">
              <i class="fa-solid fa-book-open"></i> <span>អាន E-Book</span>
            </button>
            <button type="button" onclick="BookStudyEngine.printPreExamReviewHandout('${filter}')" class="btn-secondary" style="height: 36px; padding: 0 12px; font-size: 0.8rem;" title="បោះពុម្ព A4 ទុកឱ្យសិស្សអាន">
              <i class="fa-solid fa-print"></i> <span>បោះពុម្ព A4</span>
            </button>
            <button type="button" onclick="BookStudyEngine.closePreExamReviewModal()" style="background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Filter Category Tabs & Mode Switch -->
        <div style="background: rgba(15, 23, 42, 0.85); border-bottom: 1px solid #334155; padding: 10px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <!-- Category Filters -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" onclick="BookStudyEngine.switchReviewTab('all')" class="btn-paper-filter ${filter === 'all' ? 'active' : ''}" style="height: 32px; font-size: 0.78rem; padding: 0 12px;">
              <i class="fa-solid fa-layer-group"></i> ទាំងអស់ (${allQuestions.length})
            </button>
            <button type="button" onclick="BookStudyEngine.switchReviewTab('Typing')" class="btn-paper-filter ${filter === 'Typing' ? 'active' : ''}" style="height: 32px; font-size: 0.78rem; padding: 0 12px;">
              <i class="fa-solid fa-keyboard text-purple-400"></i> មេរៀនទី ១-៣ (Typing & IT)
            </button>
            <button type="button" onclick="BookStudyEngine.switchReviewTab('Word')" class="btn-paper-filter ${filter === 'Word' ? 'active' : ''}" style="height: 32px; font-size: 0.78rem; padding: 0 12px;">
              <i class="fa-solid fa-file-word text-blue-400"></i> មេរៀនទី ៤ (MS Word)
            </button>
            <button type="button" onclick="BookStudyEngine.switchReviewTab('PowerPoint')" class="btn-paper-filter ${filter === 'PowerPoint' ? 'active' : ''}" style="height: 32px; font-size: 0.78rem; padding: 0 12px;">
              <i class="fa-solid fa-file-powerpoint text-orange-400"></i> មេរៀនទី ៥ (PowerPoint)
            </button>
            <button type="button" onclick="BookStudyEngine.switchReviewTab('Excel')" class="btn-paper-filter ${filter === 'Excel' ? 'active' : ''}" style="height: 32px; font-size: 0.78rem; padding: 0 12px;">
              <i class="fa-solid fa-file-excel text-emerald-400"></i> មេរៀនទី ៦ (MS Excel)
            </button>
          </div>

          <!-- Mode Toggle: Study Q&A vs Practice Quiz -->
          <div style="display: flex; background: rgba(30, 41, 59, 0.9); border-radius: 8px; padding: 3px; border: 1px solid #475569;">
            <button type="button" onclick="BookStudyEngine.switchReviewMode('study')" style="height: 28px; padding: 0 12px; font-size: 0.75rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; ${this.activeReviewMode === 'study' ? 'background: #8b5cf6; color: #fff;' : 'background: transparent; color: #94a3b8;'}">
              <i class="fa-solid fa-book"></i> មើលសំណួរ-ចម្លើយ
            </button>
            <button type="button" onclick="BookStudyEngine.switchReviewMode('quiz')" style="height: 28px; padding: 0 12px; font-size: 0.75rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; ${this.activeReviewMode === 'quiz' ? 'background: #10b981; color: #fff;' : 'background: transparent; color: #94a3b8;'}">
              <i class="fa-solid fa-vial"></i> សាកល្បងឆ្លើយតេស្ត
            </button>
          </div>
        </div>

        <!-- Question Cards List -->
        <div style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 16px;">
          ${questions.length === 0 ? `
            <div style="text-align: center; padding: 50px 20px; color: #94a3b8;">
              <i class="fa-solid fa-book-sparkles" style="font-size: 2.5rem; color: #8b5cf6; margin-bottom: 12px;"></i>
              <h4 style="color: #fff; margin: 0 0 6px;">មិនទាន់មានសំណួរក្នុងប្រភេទទិន្នន័យនេះ</h4>
              <p style="font-size: 0.85rem; margin: 0 0 16px;">ចុច «⚡ AI បង្កើតសំណួរពីសៀវភៅ» ដើម្បីឱ្យ Gemini AI ទាញយកមេរៀនពីសៀវភៅមកបង្កើត!</p>
              <button type="button" onclick="BookStudyEngine.openBookAiGeneratorModal('${filter}')" class="btn-primary" style="padding: 8px 18px; font-size: 0.85rem;">
                <i class="fa-solid fa-wand-magic-sparkles"></i> បង្កើតឥឡូវនេះ
              </button>
            </div>
          ` : this.activeReviewMode === "quiz" ? this.renderPracticeQuizView(questions) : this.renderStudyCardView(questions)}
        </div>
      </div>
    `;
  },

  renderStudyCardView(questions) {
    return questions.map((q, idx) => `
      <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px 20px; transition: all 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #d8b4fe; font-size: 0.75rem; font-weight: 700;">
            <i class="fa-solid fa-bookmark"></i> ${q.chapterTitle || 'មេរៀនមូលដ្ឋាន'}
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
    `).join("");
  },

  renderPracticeQuizView(questions) {
    return questions.map((q, idx) => {
      const opts = Array.isArray(q.options) && q.options.length > 0 
        ? q.options 
        : [q.answer, "ជម្រើសផ្សេងទៀត (ខុស)", "មិនត្រឹមត្រូវ", "គ្មានចម្លើយ"];
      const correctIdx = q.correct !== undefined ? q.correct : 0;

      return `
        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.75rem; font-weight: 700;">
              <i class="fa-solid fa-vial"></i> តេស្តសាកល្បង • សំណួរទី ${idx + 1}
            </span>
            <span class="badge font-mono" style="background: rgba(255, 255, 255, 0.08); color: #94a3b8; font-size: 0.74rem;">
              ${q.chapterTitle || 'មេរៀនមូលដ្ឋាន'}
            </span>
          </div>

          <h4 style="margin: 0 0 12px; font-size: 1rem; font-weight: 700; color: #fff; line-height: 1.5;">
            ${q.question}
          </h4>

          <div id="quizOpts-${idx}" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;">
            ${opts.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              return `
                <button type="button" onclick="BookStudyEngine.handlePracticeAnswer(${idx}, ${optIdx}, ${correctIdx})" class="quiz-practice-opt" style="text-align: left; background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 8px; padding: 10px 14px; color: #cbd5e1; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px;">
                  <span style="width: 26px; height: 26px; border-radius: 6px; background: rgba(255, 255, 255, 0.08); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.78rem; color: #fff;">${letter}</span>
                  <span>${opt}</span>
                </button>
              `;
            }).join("")}
          </div>

          <div id="quizResult-${idx}" style="display: none; padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; margin-top: 8px;"></div>
        </div>
      `;
    }).join("");
  },

  handlePracticeAnswer(qIdx, selectedIdx, correctIdx) {
    const parent = document.getElementById(`quizOpts-${qIdx}`);
    const resultBox = document.getElementById(`quizResult-${qIdx}`);
    if (!parent || !resultBox) return;

    const btns = parent.querySelectorAll("button");
    const isCorrect = selectedIdx === correctIdx;

    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) {
        btn.style.background = "rgba(16, 185, 129, 0.25)";
        btn.style.borderColor = "#10b981";
        btn.style.color = "#34d399";
        btn.innerHTML += ` <i class="fa-solid fa-check ml-auto text-emerald-400"></i>`;
      } else if (idx === selectedIdx && !isCorrect) {
        btn.style.background = "rgba(239, 68, 68, 0.25)";
        btn.style.borderColor = "#ef4444";
        btn.style.color = "#f87171";
        btn.innerHTML += ` <i class="fa-solid fa-xmark ml-auto text-red-400"></i>`;
      }
    });

    resultBox.style.display = "block";
    if (isCorrect) {
      resultBox.style.background = "rgba(16, 185, 129, 0.15)";
      resultBox.style.border = "1px solid #10b981";
      resultBox.style.color = "#34d399";
      resultBox.innerHTML = `<strong>🎉 ត្រឹមត្រូវល្អណាស់!</strong> អ្នកបានឆ្លើយត្រឹមត្រូវតាមខ្លឹមសារសៀវភៅមូលដ្ឋាន។`;
    } else {
      resultBox.style.background = "rgba(239, 68, 68, 0.15)";
      resultBox.style.border = "1px solid #ef4444";
      resultBox.style.color = "#fca5a5";
      resultBox.innerHTML = `<strong>⚠️ មិនទាន់ត្រឹមត្រូវទេ!</strong> ចម្លើយដែលត្រឹមត្រូវគឺជម្រើស [${String.fromCharCode(65 + correctIdx)}]។ សូមពិនិត្យមើលខ្លឹមសារសៀវភៅឡើងវិញ។`;
    }
  },

  /**
   * Dedicated Modal for generating questions from the Book via Gemini AI
   */
  openBookAiGeneratorModal(defaultChapter = "ch4") {
    let modal = document.getElementById("bookAiGeneratorModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "bookAiGeneratorModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10800";
      document.body.appendChild(modal);
    }

    const b = this.BOOK_INFO;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 620px; width: 95%; background: #0f172a; border-radius: 18px; border: 1.5px solid #ec4899; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8); overflow: hidden; padding: 0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #831843, #4c1d95); border-bottom: 2px solid #ec4899; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(236, 72, 153, 0.25); border: 1px solid #ec4899; display: flex; align-items: center; justify-content: center; color: #f472b6; font-size: 1.25rem;">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">
                បង្កើតសំណួរ និងវិញ្ញាសាពីសៀវភៅ (Gemini AI)
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.78rem; color: #fbcfe8;">
                ទាញយកខ្លឹមសារមេរៀនពីសៀវភៅ ១២០ ទំព័រមកបង្កើតសំណួររំលឹក និងវិញ្ញាសាប្រឡង
              </p>
            </div>
          </div>
          <button type="button" onclick="BookStudyEngine.closeBookAiGeneratorModal()" style="background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Form Body -->
        <div style="padding: 22px 24px; display: flex; flex-direction: column; gap: 16px;">
          <!-- Chapter Selector -->
          <div>
            <label style="display: block; font-size: 0.84rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
              📖 ជ្រើសរើសជំពូកនៃសៀវភៅមូលដ្ឋាន (Select Textbook Chapter):
            </label>
            <select id="bookAiChapterSelect" style="width: 100%; height: 42px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #64748b; border-radius: 8px; color: #fff; font-size: 0.85rem;">
              ${b.chapters.map(ch => `
                <option value="${ch.id}" ${ch.id === defaultChapter ? 'selected' : ''}>
                  ${ch.title} (ទំព័រ ${ch.startPage}-${ch.endPage})
                </option>
              `).join("")}
            </select>
          </div>

          <!-- Specific Topic Input -->
          <div>
            <label style="display: block; font-size: 0.84rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
              🎯 ប្រធានបទជាក់លាក់ដែលចង់សង្កត់ធ្ងន់ (Specific Topic - Optional):
            </label>
            <input type="text" id="bookAiTopicInput" placeholder="ឧ. រូបមន្ត IF និង SUMIF, ការកំណត់ Margins A4..." style="width: 100%; height: 40px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #64748b; border-radius: 8px; color: #fff; font-size: 0.85rem;">
          </div>

          <!-- Settings Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                🔢 ចំនួនសំណួរ (Question Count):
              </label>
              <select id="bookAiCountSelect" style="width: 100%; height: 40px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #64748b; border-radius: 8px; color: #fff; font-size: 0.85rem;">
                <option value="3">៣ សំណួរ</option>
                <option value="5" selected>៥ សំណួរ (ស្តង់ដារ)</option>
                <option value="10">១០ សំណួរ (ពេញលេញ)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                ⭐ កម្រិតលំបាក (Difficulty):
              </label>
              <select id="bookAiDiffSelect" style="width: 100%; height: 40px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #64748b; border-radius: 8px; color: #fff; font-size: 0.85rem;">
                <option value="ងាយស្រួល">ងាយស្រួល (Easy)</option>
                <option value="មធ្យម" selected>មធ្យម (Medium)</option>
                <option value="ពិបាក">ពិបាក (Hard)</option>
              </select>
            </div>
          </div>

          <!-- Destination Target Checkbox: Guarantee Exam and Review Sync! -->
          <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 12px 14px;">
            <div style="font-size: 0.82rem; font-weight: 700; color: #f472b6; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-sync"></i> គោលដៅបញ្ចូលទិន្នន័យ (Dual Sync Guarantee):
            </div>
            <div style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.5;">
              ✓ បញ្ចូលទៅក្នុង <strong>«សំណួររំលឹកមុនប្រឡង»</strong> សម្រាប់សិស្សមើលរំលឹក<br>
              ✓ បញ្ចូលទៅក្នុង <strong>«ធនាគារសំណួរ (Question Bank)»</strong> សម្រាប់គ្រូចេញវិញ្ញាសាប្រឡង<br>
              <span style="color: #34d399; font-weight: 700;">➔ ធានាថា សំណួរប្រឡងដែលចេញ នឹងត្រូវមាននៅក្នុងសំណួរដែលសិស្សបានមើលរំលឹក!</span>
            </div>
          </div>

          <!-- Submit Button -->
          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px;">
            <button type="button" onclick="BookStudyEngine.closeBookAiGeneratorModal()" class="btn-secondary" style="height: 42px; padding: 0 18px; font-size: 0.85rem;">
              បោះបង់
            </button>
            <button type="button" id="btnRunBookAiGen" onclick="BookStudyEngine.submitBookAiGenerator()" class="btn-primary" style="height: 42px; padding: 0 22px; font-size: 0.88rem; background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; font-weight: 800; display: inline-flex; align-items: center; gap: 8px; border-radius: 8px; box-shadow: 0 4px 14px rgba(236, 72, 153, 0.4);">
              <i class="fa-solid fa-sparkles"></i> <span>⚡ បង្កើតឥឡូវនេះ (Gemini AI)</span>
            </button>
          </div>
        </div>
      </div>
    `;

    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("bookAiGeneratorModal");
    } else {
      modal.style.display = "flex";
    }
  },

  closeBookAiGeneratorModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("bookAiGeneratorModal");
    } else {
      const el = document.getElementById("bookAiGeneratorModal");
      if (el) el.style.display = "none";
    }
  },

  async submitBookAiGenerator() {
    const chapterSelect = document.getElementById("bookAiChapterSelect");
    const topicInput = document.getElementById("bookAiTopicInput");
    const countSelect = document.getElementById("bookAiCountSelect");
    const diffSelect = document.getElementById("bookAiDiffSelect");
    const submitBtn = document.getElementById("btnRunBookAiGen");

    const chapterId = chapterSelect ? chapterSelect.value : "ch4";
    const topic = topicInput ? topicInput.value.trim() : "";
    const count = countSelect ? parseInt(countSelect.value, 10) : 5;
    const difficulty = diffSelect ? diffSelect.value : "មធ្យម";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>កំពុងដំណើរការ Gemini AI...</span>`;
    }

    if (typeof App !== "undefined") {
      App.showToast("⚡ Google Gemini AI កំពុងវិភាគសៀវភៅមូលដ្ឋាន និងបង្កើតសំណួរ...", "info", 5000);
    }

    try {
      const res = await this.generateQuestionsFromBookWithAI({
        chapterId,
        topic,
        count,
        difficulty,
        targetMode: "both"
      });

      this.closeBookAiGeneratorModal();

      if (typeof App !== "undefined") {
        App.showToast(`🎉 ជោគជ័យ! Gemini AI បានបង្កើត ${res.reviewCount} សំណួររំលឹក និងបញ្ចូលទៅក្នុងធនាគារសំណួររួចរាល់!`, "success", 5000);
      }

      // Re-render pre-exam review modal
      this.renderPreExamReview(res.chapter.course);

    } catch (err) {
      if (typeof App !== "undefined") {
        App.showToast("មានបញ្ហាក្នុងការបង្កើត: " + err.message, "error");
      } else {
        alert(err.message);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-sparkles"></i> <span>⚡ បង្កើតឥឡូវនេះ (Gemini AI)</span>`;
      }
    }
  },

  /**
   * Print Pre-Exam Review Handout A4 for students
   */
  printPreExamReviewHandout(filter = "all") {
    let questions = this.getAllPreExamQuestions();
    if (filter && filter !== "all") {
      questions = questions.filter(q => q.course === filter || q.chapterId === filter);
    }

    const printWin = window.open("", "_blank");
    if (!printWin) {
      alert("សូមអនុញ្ញាត Popup ដើម្បីបោះពុម្ពឯកសារ");
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>សំណួររំលឹកមុនប្រឡង - សាលា អន្តរជាតិ ធានស៊ីន</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Moul&family=Siemreap&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 15mm 15mm 15mm 15mm; }
          body { font-family: 'Kantumruy Pro', sans-serif; font-size: 12px; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 18px; }
          .school-kh { font-family: 'Moul', serif; font-size: 15px; color: #1e3a8a; margin: 0 0 4px; }
          .school-en { font-size: 11px; font-weight: 700; color: #475569; margin: 0 0 8px; }
          .doc-title { font-family: 'Moul', serif; font-size: 14px; color: #b91c1c; margin: 8px 0 4px; }
          .doc-sub { font-size: 11px; color: #64748b; margin: 0; }
          .question-box { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #1e3a8a; border-radius: 6px; padding: 12px 14px; margin-bottom: 14px; page-break-inside: avoid; }
          .q-title { font-weight: 700; font-size: 12.5px; color: #0f172a; margin-bottom: 6px; }
          .q-ans { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 10px; margin-bottom: 6px; color: #334155; font-size: 11.5px; white-space: pre-line; }
          .q-tip { font-size: 10.5px; color: #b45309; background: #fffbeb; padding: 4px 8px; border-radius: 4px; }
          .footer { text-align: center; margin-top: 25px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-kh">សាលា អន្តរជាតិ ធានស៊ីន (TIS LAB COMPUTER)</div>
          <div class="school-en">TIAN XIN INTERNATIONAL SCHOOL • COMPUTER EDUCATION</div>
          <div class="doc-title">កម្រងសំណួរ និងចម្លើយរំលឹកមុនពេលប្រឡង (PRE-EXAM STUDY GUIDE)</div>
          <p class="doc-sub">ដកស្រង់ដោយផ្ទាល់ចេញពី «សៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័ររដ្ឋបាល & IT (១២០ ទំព័រ)» បង្កើតដោយ Gemini AI • សរុប ${questions.length} សំណួរ</p>
        </div>

        ${questions.map((q, idx) => `
          <div class="question-box">
            <div class="q-title">
              សំណួរទី ${idx + 1}៖ ${q.question} 
              <span style="font-size: 10px; font-weight: 600; color: #64748b;">[${q.chapterTitle || 'មេរៀនមូលដ្ឋាន'}]</span>
            </div>
            <div class="q-ans">
              <strong>ចម្លើយត្រឹមត្រូវ៖</strong> ${q.answer}
            </div>
            ${q.examTip ? `<div class="q-tip">💡 <strong>គន្លឹះប្រឡង៖</strong> ${q.examTip}</div>` : ''}
          </div>
        `).join("")}

        <div class="footer">
          ឯកសារសិក្សាផ្លូវការសម្រាប់សិស្សានុសិស្សសាលា អន្តរជាតិ ធានស៊ីន • ធានាថាសំណួរប្រឡងចេញពីកម្រងសំណួរនេះ ១០០%
        </div>

        <script>
          setTimeout(() => { window.print(); window.close(); }, 600);
        <\/script>
      </body>
      </html>
    `);
    printWin.document.close();
  }
};

// Initialize on script load
BookStudyEngine.init();

/**
 * Service & View: Question Bank & Test Generator (ធនាគារសំណួរទុកប្រឡង និងប្រព័ន្ធបង្កើតវិញ្ញាសា)
 * Allows teachers to manage question repository and generate exam papers strictly drawn from the bank.
 */

const QuestionBankService = {
  STORAGE_KEY_BANK: "master_school_question_bank",
  STORAGE_KEY_EXAMS: "master_school_custom_exams",

  // ៤០ សំណួរគំរូស្តង់ដារក្នុងធនាគារសំណួរដើម (Seeded Question Bank)
  DEFAULT_QUESTIONS: [
    // === MICROSOFT WORD (10 សំណួរ) ===
    {
      id: "QB-WRD-001",
      courseId: "Word",
      scenario: "ការកំណត់ទំហំក្រដាស និងរឹមទំព័រ (Page Setup & Margins)",
      question: "តើលោកគ្រូ ឬសិស្សត្រូវចូលតាម Tab និងមុខងារមួយណា ដើម្បីកំណត់រឹមទំព័រ (Margins: Top 2.5cm, Bottom 2.5cm, Left 2.5cm, Right 2cm) តាមស្តង់ដារលិខិតរដ្ឋបាលកម្ពុជា?",
      options: [
        "Tab Layout ➔ Margins ➔ Custom Margins",
        "Tab Insert ➔ Page Setup ➔ Margins",
        "Tab View ➔ Ruler ➔ Margins",
        "Tab Home ➔ Paragraph ➔ Margins"
      ],
      correct: 0,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "ការកំណត់រឹមទំព័រ (Margins) តាមស្តង់ដារលិខិតរដ្ឋបាលកម្ពុជា ត្រូវចូលតាម Tab Layout ➔ Margins ➔ Custom Margins។"
    },
    {
      id: "QB-WRD-002",
      courseId: "Word",
      scenario: "ពុម្ពអក្សររដ្ឋបាលខ្មែរ (Khmer Administrative Fonts)",
      question: "ក្បាលលិខិតរដ្ឋបាលផ្លូវការ 'ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ' ត្រូវប្រើប្រាស់ពុម្ពអក្សរ (Font) មួយណា?",
      options: [
        "Khmer OS Battambang (ទំហំ 12pt)",
        "Khmer OS Muol Light (ទំហំ 14pt)",
        "Arial Unicode MS (ទំហំ 16pt)",
        "Khmer OS Siemreap (ទំហំ 10pt)"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "ក្បាលលិខិតផ្លូវការជាតិ 'ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ' ត្រូវប្រើ Font Khmer OS Muol Light ទំហំ 14pt។"
    },
    {
      id: "QB-WRD-003",
      courseId: "Word",
      scenario: "គម្លាតបន្ទាត់ និងកថាខណ្ឌ (Paragraph Indent & Spacing)",
      question: "ដើម្បីកំណត់ឱ្យបន្ទាត់ទីមួយនៃកថាខណ្ឌរំកិលចូលក្នុង 1.25cm (First Line Indent) និងគម្លាតបន្ទាត់ 1.15 ត្រូវចូលទៅកាន់កន្លែងណា?",
      options: [
        "Group Paragraph ➔ Indents and Spacing (Special: First line 1.25cm, Line Spacing 1.15)",
        "Group Font ➔ Advanced ➔ Spacing",
        "Group Styles ➔ Normal ➔ Modify",
        "Group Editing ➔ Paragraph Spacing"
      ],
      correct: 0,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "First Line Indent និង Line Spacing ត្រូវបានកំណត់នៅក្នុង Paragraph Dialog Box ក្រោម Tab Home ឬ Layout។"
    },
    {
      id: "QB-WRD-004",
      courseId: "Word",
      scenario: "ការដាក់លេខទំព័រស្វ័យប្រវត្តិ (Page Numbering & Footer)",
      question: "ដើម្បីឱ្យឯកសារបង្ហាញលេខទំព័រស្វ័យប្រវត្តនៅផ្នែកខាងក្រោមនៃទំព័រ (Bottom of Page) ត្រូវជ្រើសរើស៖",
      options: [
        "Tab Layout ➔ Line Numbers",
        "Tab Insert ➔ Header & Footer ➔ Page Number ➔ Bottom of Page",
        "Tab References ➔ Insert Footnote",
        "Tab View ➔ Page Numbering"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Insert ➔ Header & Footer ➔ Page Number ➔ Bottom of Page ជាវិធីស្តង់ដារសម្រាប់បន្ថែមលេខទំព័រស្វ័យប្រវត្ត។"
    },
    {
      id: "QB-WRD-005",
      courseId: "Word",
      scenario: "ការគ្រប់គ្រងតារាង (Table Formatting & Cell Merging)",
      question: "ដើម្បីបញ្ចូលក្រឡាច្រើន (Merge Cells) ក្នុងតារាង Word ឱ្យក្លាយជាក្រឡាតែមួយសម្រាប់ក្បាលតារាង ត្រូវធ្វើដូចម្តេច?",
      options: [
        "ជ្រើសរើស Cells ទាំងនោះ រួចចុច Delete",
        "ជ្រើសរើស Cells ទាំងនោះ ➔ Tab Table Layout ➔ ចុច 'Merge Cells'",
        "ចុច Ctrl + M លើ Keyboard",
        "Tab Table Design ➔ Split Cells"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "ជ្រើសរើសក្រឡាដែលត្រូវបញ្ចូលគ្នា រួចចូល Tab Table Layout ➔ ចុច Merge Cells។"
    },
    {
      id: "QB-WRD-006",
      courseId: "Word",
      scenario: "គ្រាប់ចុចកាត់រហ័ស (Keyboard Shortcuts)",
      question: "Shortcut សម្រាប់ រក្សាទុកឯកសារ (Save) និង បោះពុម្ព (Print) រហ័សក្នុង Microsoft Word គឺ៖",
      options: [
        "Ctrl + S (រក្សាទុក) និង Ctrl + P (បោះពុម្ព)",
        "Ctrl + A (រក្សាទុក) និង Ctrl + B (បោះពុម្ព)",
        "Ctrl + W (រក្សាទុក) និង Ctrl + Q (បោះពុម្ព)",
        "Alt + S (រក្សាទុក) និង Alt + P (បោះពុម្ព)"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Ctrl + S សម្រាប់ Save និង Ctrl + P សម្រាប់ Print គឺជាគ្រាប់ចុចកាត់សកល។"
    },
    {
      id: "QB-WRD-007",
      courseId: "Word",
      scenario: "ការស្វែងរក និងជំនួសពាក្យ (Find and Replace)",
      question: "តើគ្រាប់ចុចកាត់ (Shortcut) មួយណាដែលប្រើសម្រាប់បើកផ្ទាំង ស្វែងរក និងជំនួសពាក្យ (Find and Replace) ក្នុង Word?",
      options: [
        "Ctrl + F",
        "Ctrl + H",
        "Ctrl + R",
        "Ctrl + G"
      ],
      correct: 1,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "Ctrl + H ប្រើសម្រាប់បើកផ្ទាំង Replace ដោយផ្ទាល់ រីឯ Ctrl + F សម្រាប់ Navigation Find។"
    },
    {
      id: "QB-WRD-008",
      courseId: "Word",
      scenario: "ការបញ្ចូលរូបភាព និង Watermark (Page Background)",
      question: "ដើម្បីបន្ថែមរូបសញ្ញាសាលា ឬអក្សរស្រមោលនៅខាងក្រោយអត្ថបទ (Watermark) ក្នុង Word ត្រូវចូលតាម៖",
      options: [
        "Tab Design ➔ Watermark ➔ Custom Watermark",
        "Tab Insert ➔ Pictures ➔ Behind Text",
        "Tab View ➔ Background ➔ Watermark",
        "Tab Home ➔ Font Effects ➔ Watermark"
      ],
      correct: 0,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "Watermark ស្ថិតនៅក្នុង Tab Design ក្រុម Page Background។"
    },
    {
      id: "QB-WRD-009",
      courseId: "Word",
      scenario: "ការប្រើប្រាស់ Mail Merge (លិខិតអញ្ជើញស្វ័យប្រវត្ត)",
      question: "មុខងារ Mail Merge ក្នុង Microsoft Word មានអត្ថប្រយោជន៍ចម្បងអ្វីខ្លះ?",
      options: [
        "សម្រាប់គណនារូបមន្តគណិតវិទ្យា",
        "សម្រាប់បង្កើតលិខិតអញ្ជើញ ឬវិញ្ញាបនបត្រជូនមនុស្សច្រើននាក់ដោយស្វ័យប្រវត្តិពីបញ្ជីទិន្នន័យ",
        "សម្រាប់ផ្ញើអ៊ីមែលដោយមិនចាំបាច់មាន Internet",
        "សម្រាប់ប្តូរភាសាពីខ្មែរទៅអង់គ្លេស"
      ],
      correct: 1,
      points: 10,
      difficulty: "ពិបាក",
      explanation: "Mail Merge អនុញ្ញាតឱ្យចងភ្ជាប់ឯកសារតែមួយជាមួយបញ្ជីឈ្មោះជាច្រើន (ឧទាហរណ៍ពី Excel) ដើម្បីបង្កើតលិខិត ឬកាតស្វ័យប្រវត្ត។"
    },
    {
      id: "QB-WRD-010",
      courseId: "Word",
      scenario: "ការបំបែកជួរឈរ (Columns Layout)",
      question: "ដើម្បីបំបែកអត្ថបទជា ២ ឬ ៣ ជួរឈរ (Columns) ដូចកាសែត ត្រូវចូលតាម Tab មួយណា?",
      options: [
        "Tab Home ➔ Paragraph ➔ Columns",
        "Tab Layout ➔ Columns ➔ Two / Three",
        "Tab Insert ➔ Table ➔ Columns",
        "Tab View ➔ Multiple Pages"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "ការកំណត់ Columns ស្ថិតនៅក្នុង Tab Layout ក្រុម Page Setup។"
    },

    // === MICROSOFT EXCEL (10 សំណួរ) ===
    {
      id: "QB-EXC-001",
      courseId: "Excel",
      scenario: "រូបមន្តបូកសរុប (SUM Function & AutoSum)",
      question: "តើរូបមន្តមួយណាត្រឹមត្រូវសម្រាប់បូកសរុបតម្លៃចាប់ពីក្រឡា C2 ដល់ C20?",
      options: [
        "=ADD(C2:C20)",
        "=SUM(C2:C20)",
        "=TOTAL(C2:C20)",
        "=SUM(C2+C20)"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "រូបមន្តស្តង់ដារសម្រាប់បូកសរុប Range គឺ =SUM(C2:C20)។"
    },
    {
      id: "QB-EXC-002",
      courseId: "Excel",
      scenario: "រូបមន្តលក្ខខណ្ឌវិនិច្ឆ័យ (Logical IF Function)",
      question: "ដើម្បីកំណត់ឱ្យសិស្ស 'ជាប់' ប្រសិនបើពិន្ទុក្នុងក្រឡា D2 ធំជាងឬស្មើ 50 បើពុំនោះទេឱ្យ 'ធ្លាក់' តើរូបមន្តមួយណាត្រឹមត្រូវ?",
      options: [
        '=IF(D2>=50, "ជាប់", "ធ្លាក់")',
        '=IF(D2>50; "ធ្លាក់"; "ជាប់")',
        '=CHECK(D2>=50, "ជាប់", "ធ្លាក់")',
        '=CONDITION(D2=50, "ជាប់", "ធ្លាក់")'
      ],
      correct: 0,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "ទម្រង់ទូទៅនៃ IF គឺ =IF(logical_test, value_if_true, value_if_false) ដូច្នេះ =IF(D2>=50, \"ជាប់\", \"ធ្លាក់\") គឺត្រឹមត្រូវ។"
    },
    {
      id: "QB-EXC-003",
      courseId: "Excel",
      scenario: "ការចាក់សោក្រឡាដាច់ខាត (Absolute Cell Reference)",
      question: "ដើម្បីចាក់សោក្រឡា B1 ឱ្យនៅថេរដដែលនៅពេលអូសរូបមន្តចុះក្រោម (Absolute Reference) តើត្រូវសរសេរយ៉ាងដូចម្តេច?",
      options: [
        "#B#1",
        "$B$1",
        "&B&1",
        "@B@1"
      ],
      correct: 1,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "សញ្ញាដុល្លារ $ ត្រូវបានប្រើដើម្បីចាក់សោជួរឈរ និងជួរដេក ($B$1) តាមរយៈការចុច F4។"
    },
    {
      id: "QB-EXC-004",
      courseId: "Excel",
      scenario: "រូបមន្តស្វែងរកទិន្នន័យ (VLOOKUP Function)",
      question: "ក្នុងរូបមន្ត =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]) តើតួលេខ 0 ឬ FALSE នៅចុងក្រោយមានន័យដូចម្តេច?",
      options: [
        "ស្វែងរកតម្លៃប្រហាក់ប្រហែល (Approximate match)",
        "ស្វែងរកតម្លៃដូចគ្នាពិតប្រាកដ ១០០% (Exact match)",
        "មិនឱ្យបង្ហាញលទ្ធផលឡើយ",
        "រាប់ចំនួនជួរឈរ"
      ],
      correct: 1,
      points: 10,
      difficulty: "ពិបាក",
      explanation: "FALSE ឬ 0 ក្នុង VLOOKUP បញ្ជាក់ថាត្រូវស្វែងរក Exact Match (តម្លៃដូចគ្នាពិតប្រាកដ)។"
    },
    {
      id: "QB-EXC-005",
      courseId: "Excel",
      scenario: "រូបមន្តរាប់ចំនួនមានលក្ខខណ្ឌ (COUNTIF Function)",
      question: "តើរូបមន្តមួយណាសម្រាប់រាប់ចំនួនសិស្សប្រុស 'ប្រុស' នៅក្នុងជួរឈរ C2:C50?",
      options: [
        '=COUNT(C2:C50, "ប្រុស")',
        '=COUNTIF(C2:C50, "ប្រុស")',
        '=SUMIF(C2:C50, "ប្រុស")',
        '=TOTALIF(C2:C50, "ប្រុស")'
      ],
      correct: 1,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "=COUNTIF(range, criteria) ប្រើសម្រាប់រាប់ចំនួនក្រឡាដែលផ្ទៀងផ្ទាត់នឹងលក្ខខណ្ឌជាក់លាក់។"
    },
    {
      id: "QB-EXC-006",
      courseId: "Excel",
      scenario: "ការចាក់សោជួរឈរ និងក្បាលតារាង (Freeze Panes)",
      question: "ដើម្បីឱ្យក្បាលតារាងនៅនឹងថ្កល់នៅពេល Scroll អូសទំព័រចុះក្រោម ត្រូវប្រើមុខងារមួយណា?",
      options: [
        "Tab View ➔ Freeze Panes ➔ Freeze Top Row",
        "Tab Page Layout ➔ Lock Header",
        "Tab Home ➔ Format ➔ Lock Cells",
        "Tab Data ➔ Fix Position"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Freeze Panes ស្ថិតនៅក្នុង Tab View ប្រើសម្រាប់ចាក់សោក្បាលជួរឈរ ឬជួរដេក។"
    },
    {
      id: "QB-EXC-007",
      courseId: "Excel",
      scenario: "គ្រាប់ចុចកាត់ AutoSum (Shortcut Key)",
      question: "គ្រាប់ចុចកាត់ (Shortcut) រហ័សសម្រាប់ AutoSum បូកសរុបទិន្នន័យស្វ័យប្រវត្តក្នុង Excel គឺ៖",
      options: [
        "Ctrl + S",
        "Alt + =",
        "Shift + +",
        "Ctrl + Shift + S"
      ],
      correct: 1,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "គ្រាប់ចុច Alt + = គឺជា Shortcut សកលសម្រាប់ AutoSum ក្នុង Excel។"
    },
    {
      id: "QB-EXC-008",
      courseId: "Excel",
      scenario: "រូបមន្តរកមធ្យមភាគ (AVERAGE Function)",
      question: "តើរូបមន្តមួយណាសម្រាប់គណនារកពិន្ទុមធ្យមភាគ នៃមុខវិជ្ជាពីក្រឡា E2 ដល់ H2?",
      options: [
        "=MEDIAN(E2:H2)",
        "=AVERAGE(E2:H2)",
        "=MEAN(E2:H2)",
        "=AVG(E2:H2)"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "រូបមន្តសម្រាប់គណនាមធ្យមភាគក្នុង Excel គឺ =AVERAGE()។"
    },
    {
      id: "QB-EXC-009",
      courseId: "Excel",
      scenario: "ការកំណត់ទម្រង់ប្រាក់ (Currency Formatting)",
      question: "ដើម្បីកំណត់ឱ្យតួលេខក្នុងក្រឡាបង្ហាញសញ្ញាដុល្លារ ($) ឬរៀល (៛) ដោយមិនខូចទម្រង់គណនា ត្រូវធ្វើដូចម្តេច?",
      options: [
        "វាយសញ្ញា $ ដោយដៃនៅពីមុខលេខក្នុងក្រឡា",
        "ជ្រើសរើសក្រឡា ➔ Tab Home ➔ Number Format ➔ Currency / Accounting",
        "ដាក់សញ្ញា Quote (') នៅពីមុខ",
        "ប្តូរ Font ទៅជា Currency Font"
      ],
      correct: 1,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "ត្រូវកំណត់តាម Number Format ➔ Currency ដើម្បីកុំឱ្យប្រែទៅជា Text ដែលមិនអាចគណនាបាន។"
    },
    {
      id: "QB-EXC-010",
      courseId: "Excel",
      scenario: "ការបង្កើតក្រាហ្វិកស្ថិតិ (Chart / Graph Creation)",
      question: "ដើម្បីបំប្លែងទិន្នន័យស្ថិតិជាតារាង ឱ្យទៅជាគំនូសតាងសសរ (Column Chart) ឬរង្វង់ (Pie Chart) ត្រូវចូលតាម៖",
      options: [
        "Tab Home ➔ Illustrations ➔ Chart",
        "Tab Insert ➔ Charts ➔ Recommended Charts",
        "Tab Data ➔ Analysis ➔ Chart",
        "Tab View ➔ Visuals ➔ Chart"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Charts ទាំងអស់ស្ថិតនៅក្នុង Tab Insert ក្រុម Charts។"
    },

    // === MICROSOFT POWERPOINT (10 សំណួរ) ===
    {
      id: "QB-PPT-001",
      courseId: "PowerPoint",
      scenario: "ការចាប់ផ្តើម Slide Show (Presentation Shortcuts)",
      question: "គ្រាប់ចុចកាត់ (Shortcut) ដើម្បីចាប់ផ្តើមបញ្ចាំង Slide Show ពីស្លាយដំបូងគេបង្អស់ (First Slide) គឺ៖",
      options: [
        "F1",
        "F5",
        "Shift + F5",
        "Ctrl + F5"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "F5 ចាប់ផ្តើមបញ្ចាំងពីស្លាយដំបូងគេ រីឯ Shift + F5 ចាប់ផ្តើមពីស្លាយបច្ចុប្បន្ន (Current Slide)។"
    },
    {
      id: "QB-PPT-002",
      courseId: "PowerPoint",
      scenario: "ការបញ្ចាំងស្លាយពីស្លាយបច្ចុប្បន្ន (Current Slide)",
      question: "ប្រសិនបើលោកគ្រូកំពុងស្ថិតនៅស្លាយទី ៥ ហើយចង់បញ្ចាំងពីស្លាយទី ៥ នេះផ្ទាល់ តើត្រូវចុចគ្រាប់ចុចអ្វី?",
      options: [
        "F5",
        "Shift + F5",
        "Alt + F5",
        "Ctrl + Shift + S"
      ],
      correct: 1,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "Shift + F5 ចាប់ផ្តើម Slide Show ពីស្លាយបច្ចុប្បន្នដែលកំពុងជ្រើសរើស។"
    },
    {
      id: "QB-PPT-003",
      courseId: "PowerPoint",
      scenario: "ភាពខុសគ្នារវាង Transitions និង Animations",
      question: "តើ Transitions និង Animations ក្នុង PowerPoint មានភាពខុសគ្នាដូចម្តេច?",
      options: [
        "ដូចគ្នាទាំងស្រុង គ្មានភាពខុសគ្នាឡើយ",
        "Transitions ជាបែបផែនផ្លាស់ប្តូររវាងស្លាយមួយទៅស្លាយមួយ រីឯ Animations ជាបែបផែនលើរូបភាព ឬអក្សរក្នុងស្លាយ",
        "Transitions សម្រាប់ចាក់សំឡេង រីឯ Animations សម្រាប់ដាក់ពណ៌",
        "Transitions ប្រើសម្រាប់ Font រីឯ Animations សម្រាប់ Table"
      ],
      correct: 1,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "Slide Transitions សម្រាប់ចលនារវាងស្លាយ (Slide to Slide) រីឯ Animations សម្រាប់ចលនាវត្ថុខាងក្នុងស្លាយ (Objects/Text)។"
    },
    {
      id: "QB-PPT-004",
      courseId: "PowerPoint",
      scenario: "ការប្រើប្រាស់ Slide Master (Master Layout Template)",
      question: "មុខងារ Slide Master ក្នុង PowerPoint មានអត្ថប្រយោជន៍ចម្បងអ្វី?",
      options: [
        "សម្រាប់កែអក្ខរាវិរុទ្ធស្វ័យប្រវត្ត",
        "សម្រាប់កំណត់ទម្រង់មេ (Logo, Font, Background, ពណ៌) តែមួយដង ឱ្យអនុវត្តលើគ្រប់ស្លាយទាំងអស់ក្នុង Presentation",
        "សម្រាប់កាត់តវីដេអូ",
        "សម្រាប់គណនាលេខ"
      ],
      correct: 1,
      points: 10,
      difficulty: "ពិបាក",
      explanation: "Slide Master ស្ថិតក្នុង Tab View ជួយឱ្យយើងគ្រប់គ្រងស្ទីលមេ (Theme/Template) ទាំងអស់បានយ៉ាងរហ័ស។"
    },
    {
      id: "QB-PPT-005",
      courseId: "PowerPoint",
      scenario: "ការផ្អាកអេក្រង់ពេលកំពុង Presentation (Black Screen / White Screen)",
      question: "នៅពេលកំពុងបញ្ចាំង Slide Show ដើម្បីឱ្យអេក្រង់ប្រែទៅជាងងឹតខ្មៅ (Black screen) បណ្តោះអាសន្នដើម្បីទាក់ទាញចំណាប់អារម្មណ៍ទស្សនិកជន ត្រូវចុចគ្រាប់ចុចអ្វី?",
      options: [
        "Esc",
        "អក្សរ B (ឬ W សម្រាប់អេក្រង់ស White screen)",
        "Spacebar",
        "Ctrl + Z"
      ],
      correct: 1,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "ចុច B សម្រាប់ Black screen និងចុច W សម្រាប់ White screen ក្នុងពេល Slide Show។"
    },
    {
      id: "QB-PPT-006",
      courseId: "PowerPoint",
      scenario: "ការបង្កើតស្លាយថ្មីរហ័ស (New Slide Shortcut)",
      question: "គ្រាប់ចុចកាត់ (Shortcut) ដើម្បីបង្កើត Slide ថ្មីមួយបន្ថែមទៀតក្នុង PowerPoint គឺ៖",
      options: [
        "Ctrl + N (បង្កើត File ថ្មី)",
        "Ctrl + M (បង្កើត Slide ថ្មី)",
        "Ctrl + S",
        "Alt + N"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Ctrl + M សម្រាប់បង្កើត New Slide បន្ថែម រីឯ Ctrl + N គឺបង្កើត New Presentation File ថ្មីស្រឡាង។"
    },
    {
      id: "QB-PPT-007",
      courseId: "PowerPoint",
      scenario: "ការប្រើប្រាស់ SmartArt Graphics",
      question: "ដើម្បីរៀបចំដ្យាក្រាមរចនាសម្ព័ន្ធស្ថាប័ន (Organization Chart) ឬដំណាក់កាលការងារ (Process Steps) ឱ្យមានរបៀបរៀបរយ គួរប្រើ៖",
      options: [
        "Tab Insert ➔ SmartArt",
        "Tab Insert ➔ WordArt",
        "Tab Design ➔ Themes",
        "Tab Animations ➔ Motion Paths"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "SmartArt ជួយរៀបចំគំនូសតាងរចនាសម្ព័ន្ធ ដំណាក់កាល និងឋានានុក្រមស្វ័យប្រវត្ត។"
    },
    {
      id: "QB-PPT-008",
      courseId: "PowerPoint",
      scenario: "ការភ្ជាប់តំណ (Hyperlink & Action Buttons)",
      question: "ដើម្បីឱ្យពេលចុចលើពាក្យ ឬរូបភាពមួយ វាផ្លោះទៅកាន់ស្លាយជាក់លាក់ណាមួយ ឬបើកគេហទំព័រ Internet ត្រូវប្រើ៖",
      options: [
        "Tab Transitions ➔ Link",
        "Tab Insert ➔ Link (Hyperlink) ឬ Action",
        "Tab Home ➔ Editing ➔ Jump",
        "Tab View ➔ Navigate"
      ],
      correct: 1,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "Insert ➔ Link (Ctrl + K) ឬ Action អនុញ្ញាតឱ្យភ្ជាប់តំណរវាងស្លាយ ឬទៅកាន់គេហទំព័រខាងក្រៅ។"
    },
    {
      id: "QB-PPT-009",
      courseId: "PowerPoint",
      scenario: "ការចាក់វីដេអូ ឬសំឡេងស្វ័យប្រវត្ត (Audio / Video Playback)",
      question: "ដើម្បីឱ្យបទភ្លេង ឬវីដេអូចាក់ដោយស្វ័យប្រវត្ត (Automatically) ពេលស្លាយបើកមកដល់ ត្រូវកំណត់ក្នុង Tab មួយណា?",
      options: [
        "Tab Audio/Video Tools Playback ➔ Start: Automatically",
        "Tab Transitions ➔ Sound",
        "Tab Insert ➔ Media Settings",
        "Tab Slide Show ➔ Set Up"
      ],
      correct: 0,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "ជ្រើសរើស Audio/Video រួចចូល Tab Playback ➔ Start: Automatically។"
    },
    {
      id: "QB-PPT-010",
      courseId: "PowerPoint",
      scenario: "ការនាំចេញជាវីដេអូ ឬ PDF (Export Presentation)",
      question: "ដើម្បីរក្សាទុក Presentation ទាំងមូលឱ្យទៅជា File វីដេអូ (MP4) សម្រាប់ចាក់លើទូរទស្សន៍ ឬ YouTube ត្រូវចូលតាម៖",
      options: [
        "File ➔ Export ➔ Create a Video",
        "File ➔ Print ➔ Video Format",
        "Tab View ➔ Record ➔ Save MP4",
        "Tab Insert ➔ Screen Recording ➔ Save"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "File ➔ Export ➔ Create a Video អនុញ្ញាតឱ្យ Export Presentation ទៅជាវីដេអូគុណភាព Full HD (1080p)។"
    },

    // === TYPING & COMPUTER BASICS (10 សំណួរ) ===
    {
      id: "QB-TYP-001",
      courseId: "Typing",
      scenario: "ក្តារចុចមេជួរកណ្តាល (Home Row Keys)",
      question: "នៅក្នុងក្បួនវាយអត្ថបទប៉ះ (Touch Typing) តើម្រាមដៃទាំង ៨ ត្រូវដាក់លើគ្រាប់ចុចជួរកណ្តាល (Home Row) មួយណាជាមូលដ្ឋាន?",
      options: [
        "Q W E R - U I O P",
        "A S D F - J K L ;",
        "Z X C V - M , . /",
        "1 2 3 4 - 7 8 9 0"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Home Row Keys គឺ A S D F (ដៃឆ្វេង) និង J K L ; (ដៃស្តាំ) ដោយមានចំណុចផុសលើគ្រាប់ F និង J។"
    },
    {
      id: "QB-TYP-002",
      courseId: "Typing",
      scenario: "ការវាយជើងអក្សរខ្មែរ (Khmer Subscript Consonant)",
      question: "ក្នុងការវាយអក្សរយូនីកូដខ្មែរ (Khmer Unicode) ដើម្បីបង្កើតជើងអក្សរ (ឧ. ជើង 'ក' ឬ ជើង 'ម') តើត្រូវចុចគ្រាប់ចុចមួយណាជាមុនសិន?",
      options: [
        "ចុចគ្រាប់ចុច j (Subscript key)",
        "ចុចគ្រាប់ចុច Shift",
        "ចុចគ្រាប់ចុច Alt",
        "ចុចគ្រាប់ចុច Spacebar"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "គ្រាប់ចុច j លើក្តារចុច Khmer Unicode ដើរតួជាសញ្ញាជើង (Subscript Sign)។"
    },
    {
      id: "QB-TYP-003",
      courseId: "Typing",
      scenario: "ការផ្លាស់ប្តូរភាសាក្តារចុច (Keyboard Language Switch)",
      question: "ដើម្បីប្តូរក្តារចុចរវាងភាសាខ្មែរ (Khmer) និងភាសាអង់គ្លេស (English) រហ័សលើ Windows តើត្រូវចុច Shortcut អ្វី?",
      options: [
        "Alt + Shift (ឬ Windows Key + Spacebar)",
        "Ctrl + Shift",
        "Ctrl + Tab",
        "Alt + F4"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Alt + Shift ឬ Windows + Spacebar ប្រើសម្រាប់ប្តូរ Language Layout រវាងខ្មែរ និងអង់គ្លេស។"
    },
    {
      id: "QB-TYP-004",
      courseId: "Typing",
      scenario: "រង្វាស់ល្បឿនវាយអត្ថបទ (Typing Speed Measurement)",
      question: "តើពាក្យកាត់ WPM ក្នុងវិញ្ញាសាវាយអត្ថបទកុំព្យូទ័រ តំណាងឱ្យអ្វី?",
      options: [
        "Words Per Minute (ចំនួនពាក្យក្នុងមួយនាទី)",
        "Windows Per Minute",
        "Words Per Month",
        "Work Productivity Metric"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "WPM តំណាងឱ្យ Words Per Minute (ចំនួនពាក្យក្នុងមួយនាទី) ដែលជារង្វាស់ស្តង់ដារអន្តរជាតិ។"
    },
    {
      id: "QB-TYP-005",
      courseId: "Typing",
      scenario: "គ្រាប់ចុចចម្លង និងបិទភ្ជាប់ (Copy, Cut, Paste Shortcuts)",
      question: "គ្រាប់ចុចកាត់ (Shortcut) សកលសម្រាប់ ចម្លង (Copy), កាត់ (Cut), និង បិទភ្ជាប់ (Paste) គឺ៖",
      options: [
        "Ctrl + C (Copy), Ctrl + X (Cut), Ctrl + V (Paste)",
        "Ctrl + A (Copy), Ctrl + B (Cut), Ctrl + C (Paste)",
        "Ctrl + P (Copy), Ctrl + D (Cut), Ctrl + E (Paste)",
        "Alt + C (Copy), Alt + X (Cut), Alt + V (Paste)"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Ctrl + C សម្រាប់ Copy, Ctrl + X សម្រាប់ Cut, និង Ctrl + V សម្រាប់ Paste។"
    },
    {
      id: "QB-TYP-006",
      courseId: "Typing",
      scenario: "ការមិនធ្វើសកម្មភាពឡើងវិញ (Undo / Redo)",
      question: "នៅពេលវាយអក្សរខុស ឬច្រឡំលុបទិន្នន័យ ដើម្បីត្រឡប់ក្រោយមួយជំហាន (Undo) ត្រូវចុច៖",
      options: [
        "Ctrl + Z",
        "Ctrl + Y",
        "Ctrl + U",
        "Ctrl + Backspace"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Ctrl + Z គឺ Undo (ត្រឡប់ក្រោយ) រីឯ Ctrl + Y គឺ Redo (ធ្វើឡើងវិញ)។"
    },
    {
      id: "QB-TYP-007",
      courseId: "Typing",
      scenario: "ការគ្រប់គ្រង Folder និង File (File Management)",
      question: "ដើម្បីបង្កើត Folder ថ្មីរហ័សក្នុង File Explorer នៃ Windows 11/10 ត្រូវចុច Shortcut មួយណា?",
      options: [
        "Ctrl + Shift + N",
        "Ctrl + N",
        "Alt + N",
        "Shift + F10"
      ],
      correct: 0,
      points: 10,
      difficulty: "មធ្យម",
      explanation: "Ctrl + Shift + N បង្កើត Folder ថ្មីភ្លាមៗក្នុង File Explorer។"
    },
    {
      id: "QB-TYP-008",
      courseId: "Typing",
      scenario: "ការជ្រើសរើសទាំងអស់ (Select All Shortcut)",
      question: "ដើម្បីជ្រើសរើសអត្ថបទទាំងអស់ក្នុងឯកសារតែម្តង (Select All) ត្រូវចុច៖",
      options: [
        "Ctrl + A",
        "Ctrl + S",
        "Shift + A",
        "Alt + A"
      ],
      correct: 0,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Ctrl + A គឺ Select All សម្រាប់ជ្រើសរើសឯកសារ ឬអត្ថបទទាំងអស់។"
    },
    {
      id: "QB-TYP-009",
      courseId: "Typing",
      scenario: "សុវត្ថិភាពការបិទម៉ាស៊ីនកុំព្យូទ័រ (Safe Computer Shutdown)",
      question: "តើវិធីណាត្រឹមត្រូវ និងមានសុវត្ថិភាពបំផុតក្នុងការបិទកុំព្យូទ័រ?",
      options: [
        "ដកឌុយភ្លើង ឬចុចប៊ូតុង Power ចុចសង្កត់ជាប់",
        "ចុចបិទកុងតាក់ភ្លើងភ្លាមៗ",
        "Save ឯកសារទាំងអស់ ➔ ចុច Start Menu ➔ Power ➔ Shut down",
        "បិទតែអេក្រង់ Monitor ទុកចោល"
      ],
      correct: 2,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "ការបិទតាម Start Menu ➔ Power ➔ Shut down ជួយការពារកុំឱ្យខូច Hard Drive និងបាត់បង់ទិន្នន័យ។"
    },
    {
      id: "QB-TYP-010",
      courseId: "Typing",
      scenario: "ការដក USB Flash Drive ដោយសុវត្ថិភាព (Safely Remove Hardware)",
      question: "ហេតុអ្វីបានជាត្រូវចុច 'Safely Remove Hardware and Eject Media' មុននឹងដក USB ចេញពីកុំព្យូទ័រ?",
      options: [
        "ដើម្បីកុំឱ្យកុំព្យូទ័រឡើងកម្តៅ",
        "ដើម្បីការពារកុំឱ្យខូចឯកសារ ឬបាត់បង់ទិន្នន័យដែលកំពុងដំណើរការសរសេរលើ USB",
        "ដើម្បីឱ្យ USB សាកថ្មពេញ",
        "ដើម្បីសម្អាតមេរោគលើ USB"
      ],
      correct: 1,
      points: 10,
      difficulty: "ងាយស្រួល",
      explanation: "Safely Remove ជួយធានាថាគ្រប់ទិន្នន័យទាំងអស់ត្រូវបានសរសេរបញ្ចប់សព្វគ្រប់ មុននឹងផ្តាច់ចរន្តអគ្គិសនីពី USB។"
    }
  ],

  /**
   * Initialize Question Bank & Custom Exams
   */
  init() {
    this.ensureSeedQuestions();
    this.syncCustomExamsToExamPapersData();
  },

  ensureSeedQuestions() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_BANK);
      if (!stored) {
        localStorage.setItem(this.STORAGE_KEY_BANK, JSON.stringify(this.DEFAULT_QUESTIONS));
        if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected && StudentAPI.isCloudConnected()) {
          try {
            firebase.database().ref("question_bank").set(this.DEFAULT_QUESTIONS);
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn("QuestionBankService init error:", e);
    }
  },

  getAllQuestions() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_BANK);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...this.DEFAULT_QUESTIONS];
  },

  saveAllQuestions(questions) {
    try {
      localStorage.setItem(this.STORAGE_KEY_BANK, JSON.stringify(questions));
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected && StudentAPI.isCloudConnected()) {
        try {
          firebase.database().ref("question_bank").set(questions);
        } catch (e) {}
      }
      return true;
    } catch (e) {
      console.error("Failed to save questions:", e);
      return false;
    }
  },

  getQuestionsByFilter({ course = "all", difficulty = "all", search = "" } = {}) {
    let list = this.getAllQuestions();

    if (course && course !== "all") {
      list = list.filter(q => q.courseId === course);
    }

    if (difficulty && difficulty !== "all") {
      list = list.filter(q => q.difficulty === difficulty);
    }

    if (search && search.trim()) {
      const qLower = search.trim().toLowerCase();
      list = list.filter(q =>
        (q.question && q.question.toLowerCase().includes(qLower)) ||
        (q.scenario && q.scenario.toLowerCase().includes(qLower)) ||
        (q.id && q.id.toLowerCase().includes(qLower))
      );
    }

    return list;
  },

  getQuestionById(id) {
    return this.getAllQuestions().find(q => q.id === id);
  },

  addQuestion(questionData) {
    const questions = this.getAllQuestions();
    const course = questionData.courseId || "Word";
    const prefixMap = { Word: "WRD", Excel: "EXC", PowerPoint: "PPT", Typing: "TYP" };
    const prefix = prefixMap[course] || "GEN";
    const newId = `QB-${prefix}-${Date.now().toString().slice(-4)}`;

    const newQuestion = {
      id: questionData.id || newId,
      courseId: course,
      scenario: (questionData.scenario || "លំហាត់អនុវត្តកុំព្យូទ័រ").trim(),
      question: (questionData.question || "").trim(),
      options: Array.isArray(questionData.options) ? questionData.options : ["ជម្រើស A", "ជម្រើស B", "ជម្រើស C", "ជម្រើស D"],
      correct: typeof questionData.correct === "number" ? questionData.correct : 0,
      points: parseInt(questionData.points, 10) || 10,
      difficulty: questionData.difficulty || "មធ្យម",
      explanation: (questionData.explanation || "").trim(),
      createdAt: new Date().toISOString()
    };

    questions.unshift(newQuestion);
    this.saveAllQuestions(questions);
    return newQuestion;
  },

  updateQuestion(id, updatedData) {
    const questions = this.getAllQuestions();
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return null;

    questions[index] = {
      ...questions[index],
      ...updatedData,
      id: id, // preserve ID
      updatedAt: new Date().toISOString()
    };

    this.saveAllQuestions(questions);
    return questions[index];
  },

  deleteQuestion(id) {
    let questions = this.getAllQuestions();
    questions = questions.filter(q => q.id !== id);
    this.saveAllQuestions(questions);
    return true;
  },

  /**
   * Generate Authentic Questions via Gemini AI and append directly to Question Bank
   */
  async generateQuestionsWithAI({ course = "Word", topic = "", count = 5, difficulty = "មធ្យម" }) {
    if (typeof GeminiAIService === "undefined") {
      throw new Error("GeminiAIService is not available");
    }

    const courseLabels = {
      Typing: "ជំនាញវាយអត្ថបទកុំព្យូទ័រ & ក្តារចុច Touch Typing & មូលដ្ឋានគ្រឹះកុំព្យូទ័រ",
      Word: "Microsoft Word (ឯកសាររដ្ឋបាល, Margins, Header/Footer, Table, Page Setup)",
      Excel: "Microsoft Excel (រូបមន្ត Sum, Average, If, Vlookup, គណនាតារាង)",
      PowerPoint: "Microsoft PowerPoint (Slide Design, Animations, Transitions, Slide Master)"
    };

    const courseTitle = courseLabels[course] || course;
    const cleanTopic = topic.trim() || `មេរៀនស្តង់ដារនៃវគ្គ ${courseTitle}`;

    const prompt = `
You are a senior computer instructor and curriculum exam designer at Tian Xin International School (TIS LAB COMPUTER).
Generate exactly ${count} multiple-choice exam questions in authentic Khmer for Cambodian computer lab students.

Subject: ${courseTitle} (${course})
Specific Lesson Topic: ${cleanTopic}
Target Difficulty Level: ${difficulty} (ងាយស្រួល / មធ្យម / ពិបាក)

STRICT JSON OUTPUT FORMAT (Return RAW JSON array only, without markdown backticks or commentary):
[
  {
    "scenario": "ប្រធានបទ/សេណារីយ៉ូខ្លីៗ (ឧ. ការកំណត់រឹមទំព័រ)",
    "question": "សំណួរច្បាស់លាស់ជាភាសាខ្មែរ?",
    "options": [
      "ជម្រើសទី ១",
      "ជម្រើសទី ២",
      "ជម្រើសទី ៣",
      "ជម្រើសទី ៤"
    ],
    "correct": 0,
    "points": 10,
    "difficulty": "${difficulty}",
    "explanation": "ការពន្យល់គរុកោសល្យលម្អិតហេតុអ្វីចម្លើយនោះត្រឹមត្រូវ"
  }
]
`;

    let generatedList = [];

    // Use Gemini AIService with fallback chain
    const apiKey = GeminiAIService.getApiKey();
    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 2500,
              responseMimeType: "application/json"
            }
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const rawText = resData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
          generatedList = JSON.parse(cleanJson);
        }
      } catch (e) {
        console.warn("Gemini direct generate failed, falling back to local generator", e);
      }
    }

    // Fallback if AI offline or returned empty
    if (!Array.isArray(generatedList) || generatedList.length === 0) {
      generatedList = this._generateFallbackQuestions(course, cleanTopic, count, difficulty);
    }

    // Add generated questions to bank
    const addedQuestions = [];
    generatedList.forEach(q => {
      const added = this.addQuestion({
        ...q,
        courseId: course,
        difficulty: difficulty
      });
      addedQuestions.push(added);
    });

    return addedQuestions;
  },

  _generateFallbackQuestions(course, topic, count, difficulty) {
    const res = [];
    for (let i = 1; i <= count; i++) {
      res.push({
        scenario: `${topic} - លំហាត់ទី ${i}`,
        question: `តើមុខងារ ឬរូបមន្តមួយណាត្រូវបានប្រើប្រាស់សម្រាប់ ${topic} ក្នុងវគ្គ ${course} ឱ្យមានប្រសិទ្ធភាពបំផុត?`,
        options: [
          `ជម្រើសត្រឹមត្រូវទី ១ សម្រាប់អនុវត្តលើ ${course}`,
          `ជម្រើសទី ២ (ខុស)`,
          `ជម្រើសទី ៣ (ខុស)`,
          `ជម្រើសទី ៤ (ខុស)`
        ],
        correct: 0,
        points: 10,
        difficulty: difficulty,
        explanation: `ការអនុវត្តលើ ${topic} ក្នុងវគ្គ ${course} ជួយពង្រឹងសមត្ថភាពជាក់ស្តែងរបស់សិស្ស។`
      });
    }
    return res;
  },

  /* =====================================================================
   * CUSTOM EXAM GENERATION STRICTLY DRAWN FROM QUESTION BANK
   * ===================================================================== */

  getAllCustomExams() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_EXAMS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  saveAllCustomExams(exams) {
    try {
      localStorage.setItem(this.STORAGE_KEY_EXAMS, JSON.stringify(exams));
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected && StudentAPI.isCloudConnected()) {
        try {
          firebase.database().ref("custom_exams").set(exams);
        } catch (e) {}
      }
      this.syncCustomExamsToExamPapersData();
      return true;
    } catch (e) {
      console.error("Failed to save custom exams:", e);
      return false;
    }
  },

  /**
   * CRITICAL REQUIREMENT:
   * "សំណួរប្រឡងដែលចេញ នឹងត្រូវមាននៅក្នុងសំណួរទុកប្រឡង"
   * Exam questions MUST be drawn directly from the Question Bank!
   */
  createExamFromBank({
    title = "",
    course = "Word",
    selectionMode = "smart_random", // 'smart_random' | 'manual'
    selectedQuestionIds = [],
    questionCount = 10,
    difficulty = "all",
    duration = 45,
    maxScore = 100
  }) {
    const bankQuestions = this.getAllQuestions();
    let chosenQuestions = [];

    if (selectionMode === "manual") {
      // 1. Manual Pick: Only take questions checked by teacher that exist in the Bank
      chosenQuestions = bankQuestions.filter(q => selectedQuestionIds.includes(q.id));
      if (chosenQuestions.length === 0) {
        throw new Error("សូមជ្រើសរើសយ៉ាងហោចណាស់ ១ សំណួរពីធនាគារសំណួរ!");
      }
    } else {
      // 2. Smart Random Draw: Filter strictly within Bank matching Course & Difficulty
      let eligible = bankQuestions;
      if (course && course !== "all") {
        eligible = eligible.filter(q => q.courseId === course);
      }
      if (difficulty && difficulty !== "all") {
        eligible = eligible.filter(q => q.difficulty === difficulty);
      }

      if (eligible.length === 0) {
        throw new Error(`មិនមានសំណួរក្នុងធនាគារដែលត្រូវនឹងលក្ខខណ្ឌ (វគ្គ ${course}, កម្រិត ${difficulty}) ឡើយ! សូមបន្ថែមសំណួរក្នុងធនាគារជាមុនសិន។`);
      }

      // Shuffle array randomly
      const shuffled = [...eligible].sort(() => 0.5 - Math.random());
      const targetCount = Math.min(parseInt(questionCount, 10) || 10, shuffled.length);
      chosenQuestions = shuffled.slice(0, targetCount);
    }

    // Standardize questions format compatible with EXAM_PAPERS_DATA
    const examQuestions = chosenQuestions.map((q, idx) => ({
      id: idx + 1,
      bankQuestionId: q.id,
      scenario: q.scenario,
      question: q.question,
      options: q.options,
      correct: q.correct,
      points: q.points || Math.round(maxScore / chosenQuestions.length),
      difficulty: q.difficulty,
      explanation: q.explanation
    }));

    const calculatedMaxScore = examQuestions.reduce((sum, q) => sum + (q.points || 10), 0);
    const finalCourseId = (course && course !== "all") ? course : "Word";
    const prefixMap = { Word: "WRD", Excel: "EXC", PowerPoint: "PPT", Typing: "TYP" };
    const prefix = prefixMap[finalCourseId] || "CUST";
    const examId = `EXM-${prefix}-${Date.now().toString().slice(-4)}`;

    const examPaper = {
      id: examId,
      courseId: finalCourseId,
      title: title.trim() || `វិញ្ញាសាប្រឡងចេញពីធនាគារសំណួរ (${finalCourseId})`,
      duration: parseInt(duration, 10) || 45,
      maxScore: calculatedMaxScore || maxScore || 100,
      description: `វិញ្ញាសានេះត្រូវបានដកស្រង់សំណួរចេញពី «ធនាគារសំណួរទុកប្រឡង» ដោយផ្ទាល់ សរុប ${examQuestions.length} សំណួរ។`,
      questions: examQuestions,
      selectionMode: selectionMode,
      source: "question_bank",
      createdAt: new Date().toISOString()
    };

    const exams = this.getAllCustomExams();
    exams.unshift(examPaper);
    this.saveAllCustomExams(exams);

    return examPaper;
  },

  deleteCustomExam(id) {
    let exams = this.getAllCustomExams();
    exams = exams.filter(e => e.id !== id);
    this.saveAllCustomExams(exams);
    return true;
  },

  /**
   * Sync custom exams created from Question Bank into global EXAM_PAPERS_DATA
   * so they can be seamlessly selected in Live Exam Arena, Exam Papers Modal, etc.
   */
  syncCustomExamsToExamPapersData() {
    if (typeof EXAM_PAPERS_DATA === "undefined") return;

    const customExams = this.getAllCustomExams();
    customExams.forEach(exam => {
      const c = exam.courseId || "Word";
      if (!EXAM_PAPERS_DATA[c]) EXAM_PAPERS_DATA[c] = [];
      const existingIdx = EXAM_PAPERS_DATA[c].findIndex(p => p.id === exam.id);
      if (existingIdx !== -1) {
        EXAM_PAPERS_DATA[c][existingIdx] = exam;
      } else {
        EXAM_PAPERS_DATA[c].push(exam);
      }
    });
  },

  /* =====================================================================
   * A4 OFFICIAL PRINTING: STUDENT EXAM PAPER & TEACHER ANSWER KEY
   * ===================================================================== */

  printExamSheet(examId, mode = "student") {
    let exam = this.getAllCustomExams().find(e => e.id === examId);
    if (!exam && typeof EXAM_PAPERS_DATA !== "undefined") {
      Object.keys(EXAM_PAPERS_DATA).forEach(k => {
        const found = EXAM_PAPERS_DATA[k].find(p => p.id === examId);
        if (found) exam = found;
      });
    }

    if (!exam) {
      if (typeof App !== "undefined") App.showToast("រកមិនឃើញវិញ្ញាសានេះឡើយ!", "error");
      return;
    }

    const printWin = window.open("", "_blank");
    if (!printWin) {
      if (typeof App !== "undefined") App.showToast("សូមបើកអនុញ្ញាត Pop-up លើ Browser ដើម្បី Print!", "warning");
      return;
    }

    const isTeacher = mode === "teacher";
    const questions = exam.questions || [];

    const courseKhmerMap = {
      Typing: "វគ្គទី ១: ជំនាញវាយអត្ថបទកុំព្យូទ័រ (Touch Typing)",
      Word: "វគ្គទី ២: ការរៀបចំឯកសាររដ្ឋបាល (Microsoft Word Processing)",
      Excel: "វគ្គទី ៣: គណនាតារាង & រូបមន្ត (Microsoft Excel Spreadsheets)",
      PowerPoint: "វគ្គទី ៤: រចនាស្លាយ & បទបង្ហាញ (Microsoft PowerPoint Presentations)"
    };

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>${isTeacher ? "ចម្លើយគ្រូ" : "ក្រដាសប្រឡងសិស្ស"} - ${exam.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 portrait; margin: 15mm 15mm 15mm 15mm; }
          * { box-sizing: border-box; }
          body {
            font-family: 'Kantumruy Pro', sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 10px;
            font-size: 13.5px;
            line-height: 1.6;
            background: #fff;
          }
          .national-header {
            text-align: center;
            margin-bottom: 12px;
          }
          .national-header h2 { font-size: 16px; margin: 0 0 3px 0; font-weight: 800; }
          .national-header h3 { font-size: 13.5px; margin: 0; font-weight: 700; }
          .school-header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 10px;
            margin-bottom: 14px;
          }
          .school-info h1 { font-size: 16px; margin: 0 0 2px 0; font-weight: 800; }
          .school-info p { font-size: 12px; margin: 0; color: #475569; }
          .exam-meta-box {
            text-align: right;
            font-size: 12px;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 6px 12px;
            border-radius: 6px;
          }
          .exam-title-badge {
            text-align: center;
            background: ${isTeacher ? '#ecfdf5' : '#f1f5f9'};
            border: 1.5px solid ${isTeacher ? '#10b981' : '#cbd5e1'};
            border-radius: 8px;
            padding: 8px 14px;
            margin-bottom: 16px;
          }
          .exam-title-badge h2 {
            margin: 0 0 4px 0;
            font-size: 15px;
            font-weight: 800;
            color: ${isTeacher ? '#065f46' : '#0f172a'};
          }
          .student-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            border: 1px dashed #94a3b8;
            border-radius: 6px;
            padding: 8px 14px;
            margin-bottom: 18px;
            font-size: 12.5px;
          }
          .question-item {
            margin-bottom: 16px;
            page-break-inside: avoid;
            padding-bottom: 12px;
            border-bottom: 1px dashed #e2e8f0;
          }
          .question-title {
            font-weight: 700;
            font-size: 13.5px;
            margin-bottom: 6px;
            color: #0f172a;
          }
          .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px 16px;
            margin-left: 10px;
          }
          .option-row {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12.5px;
          }
          .option-box {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1.5px solid #475569;
            border-radius: 3px;
            text-align: center;
            line-height: 14px;
            font-size: 11px;
            font-weight: 800;
          }
          .correct-highlight {
            background: #ecfdf5;
            color: #065f46;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #10b981;
          }
          .explanation-box {
            margin-top: 6px;
            margin-left: 10px;
            background: #f8fafc;
            border-left: 3px solid #10b981;
            padding: 4px 10px;
            font-size: 11.5px;
            color: #334155;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            page-break-inside: avoid;
            text-align: center;
            font-size: 12.5px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="national-header">
          <h2>ព្រះរាជាណាចក្រកម្ពុជា</h2>
          <h3>ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
          <div style="font-size: 13px; letter-spacing: 2px;">***</div>
        </div>

        <div class="school-header-row">
          <div class="school-info">
            <h1>សាលា អន្តរជាតិ ធានស៊ីន - TIS LAB COMPUTER</h1>
            <p>វិទ្យាស្ថានបណ្តុះបណ្តាលព័ត៌មានវិទ្យា & កុំព្យូទ័ររដ្ឋបាល</p>
            <p style="font-weight: 700; color: #0f172a; margin-top: 2px;">${courseKhmerMap[exam.courseId] || exam.courseId}</p>
          </div>
          <div class="exam-meta-box">
            <div><strong>កូដវិញ្ញាសា:</strong> ${exam.id}</div>
            <div><strong>ថិរវេលា:</strong> ${exam.duration} នាទី</div>
            <div><strong>ពិន្ទុសរុប:</strong> ${exam.maxScore} ពិន្ទុ (ជាប់ ≥ 50)</div>
            <div><strong>ប្រភព:</strong> ធនាគារសំណួរផ្លូវការ</div>
          </div>
        </div>

        <div class="exam-title-badge">
          <h2>${isTeacher ? "🔑 សន្លឹកកិច្ចការគ្រូ & ចម្លើយផ្លូវការ (TEACHER ANSWER KEY)" : "📄 ក្រដាសវិញ្ញាសាប្រឡងបញ្ចប់វគ្គ (OFFICIAL EXAMINATION PAPER)"}</h2>
          <div style="font-size: 13px; font-weight: 600;">${exam.title}</div>
        </div>

        ${!isTeacher ? `
          <div class="student-box">
            <div>ឈ្មោះសិស្ស: ....................................................</div>
            <div>ភេទ: ............</div>
            <div>វេន: ....................</div>
            <div>កាលបរិច្ឆេទ: ....................</div>
            <div style="border: 1.5px solid #0f172a; border-radius: 6px; padding: 2px 14px; font-weight: 800; background: #fff;">
              ពិន្ទុ: _______ / ${exam.maxScore}
            </div>
          </div>
        ` : `
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 8px 12px; margin-bottom: 16px; font-size: 12px; color: #065f46;">
            <strong><i class="fa-solid fa-circle-check"></i> ចំណាំសម្រាប់គ្រូ៖</strong> សន្លឹកនេះមានបង្ហាញចម្លើយត្រឹមត្រូវ (សញ្ញាធិកពណ៌បៃតង) និងការពន្យល់លម្អិតសម្រាប់កែពិន្ទុសិស្ស។
          </div>
        `}

        <div style="margin-bottom: 20px;">
          <div style="font-weight: 800; font-size: 13px; margin-bottom: 10px; color: #1e3a8a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px;">
            សេចក្តីណែនាំ៖ សូមគូសសញ្ញាធិក (✓) ឬគូសរង្វង់ជុំវិញអក្សរនៃចម្លើយដែលត្រឹមត្រូវតែមួយគត់ (សរុប ${questions.length} សំណួរ)
          </div>

          ${questions.map((q, idx) => {
            return `
              <div class="question-item">
                <div class="question-title">
                  សំណួរទី ${idx + 1}៖ ${q.question}
                  <span style="font-size: 11px; font-weight: 600; color: #64748b;">(${q.points || 10} ពិន្ទុ)</span>
                </div>
                <div class="options-grid">
                  ${(q.options || []).map((opt, optIdx) => {
                    const optLetter = String.fromCharCode(65 + optIdx);
                    const isCorrect = isTeacher && optIdx === q.correct;
                    return `
                      <div class="option-row ${isCorrect ? 'correct-highlight' : ''}">
                        <span class="option-box">${isCorrect ? '✓' : optLetter}</span>
                        <span>[${optLetter}] ${opt}</span>
                      </div>
                    `;
                  }).join("")}
                </div>
                ${isTeacher && q.explanation ? `
                  <div class="explanation-box">
                    <strong>💡 ការពន្យល់:</strong> ${q.explanation}
                  </div>
                ` : ''}
              </div>
            `;
          }).join("")}
        </div>

        <div class="signatures">
          <div style="width: 200px;">
            <p>ហត្ថលេខាបេក្ខជន<br><strong>(Candidate Signature)</strong></p>
            <div style="height: 50px;"></div>
          </div>
          <div style="width: 200px;">
            <p>ហត្ថលេខា និងឈ្មោះគ្រូត្រួតពិនិត្យ<br><strong>(Examiner Signature)</strong></p>
            <div style="height: 50px;"></div>
          </div>
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

/* Initialize question bank on script load */
QuestionBankService.init();

/* =====================================================================
 * UI VIEW & MODAL COMPONENT FOR QUESTION BANK & EXAM GENERATOR
 * ===================================================================== */

const QuestionBankView = {
  currentTab: "bank", // 'bank' | 'generator' | 'exams'
  selectedCourseFilter: "all",
  selectedDifficultyFilter: "all",
  searchKeyword: "",
  selectedQuestionIdsForExam: new Set(),

  openModal(defaultTab = "bank") {
    this.currentTab = defaultTab;
    this.ensureModalInDOM();
    this.render();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("questionBankModal");
    } else {
      const modal = document.getElementById("questionBankModal");
      if (modal) modal.style.display = "flex";
    }
  },

  closeModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("questionBankModal");
    } else {
      const modal = document.getElementById("questionBankModal");
      if (modal) modal.style.display = "none";
    }
  },

  ensureModalInDOM() {
    let modal = document.getElementById("questionBankModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "questionBankModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10500";
      document.body.appendChild(modal);
    }
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.render();
  },

  render() {
    const modal = document.getElementById("questionBankModal");
    if (!modal) return;

    const allQuestions = QuestionBankService.getAllQuestions();
    const customExams = QuestionBankService.getAllCustomExams();

    // Stats
    const totalCount = allQuestions.length;
    const wordCount = allQuestions.filter(q => q.courseId === "Word").length;
    const excelCount = allQuestions.filter(q => q.courseId === "Excel").length;
    const pptCount = allQuestions.filter(q => q.courseId === "PowerPoint").length;
    const typingCount = allQuestions.filter(q => q.courseId === "Typing").length;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 1050px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; padding: 0; overflow: hidden; background: var(--bg-card, #121024); border-radius: 18px; border: 1.5px solid rgba(139, 92, 246, 0.3); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
        <!-- Modal Header -->
        <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); border-bottom: 2px solid #8b5cf6; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(139, 92, 246, 0.2); border: 1.5px solid #8b5cf6; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; color: #c084fc;">
              <i class="fa-solid fa-boxes-stacked"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 10px;">
                <span>ធនាគារសំណួរទុកប្រឡង & បង្កើតវិញ្ញាសា</span>
                <span class="badge" style="background: #8b5cf6; color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">TIS Question Bank</span>
              </h3>
              <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #cbd5e1;">
                បង្កើត និងស្តុកសំណួរទុកជាមុន ➔ ពេលចេញវិញ្ញាសា ធានាដកស្រង់ចេញពីសំណួរទុកប្រឡង ១០០%
              </p>
            </div>
          </div>
          <button type="button" onclick="QuestionBankView.closeModal()" style="background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;" hover="background: rgba(255,255,255,0.2)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Navigation Tabs Bar -->
        <div style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid var(--border-light, #2d2b52); padding: 8px 24px; display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" onclick="QuestionBankView.switchTab('bank')" class="btn-paper-filter ${this.currentTab === 'bank' ? 'active' : ''}" style="height: 36px; padding: 0 16px; font-size: 0.84rem; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-database text-purple-400"></i>
            <span>📚 ធនាគារសំណួរទុក (${totalCount})</span>
          </button>
          <button type="button" onclick="QuestionBankView.switchTab('generator')" class="btn-paper-filter ${this.currentTab === 'generator' ? 'active' : ''}" style="height: 36px; padding: 0 16px; font-size: 0.84rem; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
            <span>🎯 ចេញវិញ្ញាសាប្រឡងពីធនាគារ</span>
          </button>
          <button type="button" onclick="QuestionBankView.switchTab('exams')" class="btn-paper-filter ${this.currentTab === 'exams' ? 'active' : ''}" style="height: 36px; padding: 0 16px; font-size: 0.84rem; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-file-signature text-sky-400"></i>
            <span>📑 វិញ្ញាសាដែលបានបង្កើត (${customExams.length})</span>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div style="flex: 1; overflow-y: auto; padding: 20px 24px;">
          ${this.currentTab === "bank" ? this.renderBankTab(totalCount, wordCount, excelCount, pptCount, typingCount) : ""}
          ${this.currentTab === "generator" ? this.renderGeneratorTab() : ""}
          ${this.currentTab === "exams" ? this.renderExamsTab(customExams) : ""}
        </div>
      </div>
    `;
  },

  /* -------------------------------------------------------------
   * TAB 1: QUESTION BANK MANAGEMENT
   * ------------------------------------------------------------- */
  renderBankTab(total, word, excel, ppt, typing) {
    const questions = QuestionBankService.getQuestionsByFilter({
      course: this.selectedCourseFilter,
      difficulty: this.selectedDifficultyFilter,
      search: this.searchKeyword
    });

    const courseColorMap = {
      Typing: { color: "#8b5cf6", icon: "fa-keyboard", label: "Typing" },
      Word: { color: "#185abd", icon: "fa-file-word", label: "Word" },
      Excel: { color: "#107c41", icon: "fa-file-excel", label: "Excel" },
      PowerPoint: { color: "#d83b01", icon: "fa-file-powerpoint", label: "PowerPoint" }
    };

    return `
      <!-- Stats KPIs Row -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px;">
        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.4rem; color: #c084fc;"><i class="fa-solid fa-layer-group"></i></div>
          <div>
            <div style="font-size: 0.74rem; color: var(--text-muted, #94a3b8);">សំណួរសរុបក្នុង Bank</div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #fff;">${total}</div>
          </div>
        </div>

        <div style="background: rgba(24, 90, 189, 0.1); border: 1px solid rgba(24, 90, 189, 0.25); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.4rem; color: #60a5fa;"><i class="fa-solid fa-file-word"></i></div>
          <div>
            <div style="font-size: 0.74rem; color: var(--text-muted, #94a3b8);">Microsoft Word</div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #fff;">${word}</div>
          </div>
        </div>

        <div style="background: rgba(16, 124, 65, 0.1); border: 1px solid rgba(16, 124, 65, 0.25); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.4rem; color: #34d399;"><i class="fa-solid fa-file-excel"></i></div>
          <div>
            <div style="font-size: 0.74rem; color: var(--text-muted, #94a3b8);">Microsoft Excel</div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #fff;">${excel}</div>
          </div>
        </div>

        <div style="background: rgba(216, 59, 1, 0.1); border: 1px solid rgba(216, 59, 1, 0.25); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.4rem; color: #fb923c;"><i class="fa-solid fa-file-powerpoint"></i></div>
          <div>
            <div style="font-size: 0.74rem; color: var(--text-muted, #94a3b8);">PowerPoint</div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #fff;">${ppt}</div>
          </div>
        </div>

        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.4rem; color: #a78bfa;"><i class="fa-solid fa-keyboard"></i></div>
          <div>
            <div style="font-size: 0.74rem; color: var(--text-muted, #94a3b8);">Typing & IT</div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #fff;">${typing}</div>
          </div>
        </div>
      </div>

      <!-- Action Toolbar & Filters -->
      <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-light, #2d2b52); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <!-- Filter Controls -->
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex: 1; min-width: 280px;">
          <div style="position: relative; flex: 1; min-width: 180px;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 11px; color: #94a3b8; font-size: 0.85rem;"></i>
            <input type="text" id="qbSearchInput" value="${this.searchKeyword}" oninput="QuestionBankView.onSearchInput(this.value)" placeholder="ស្វែងរកសំណួរ..." style="width: 100%; height: 38px; padding-left: 36px; padding-right: 12px; background: rgba(30, 41, 59, 0.8); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.85rem;">
          </div>

          <select onchange="QuestionBankView.onCourseFilterChange(this.value)" style="height: 38px; padding: 0 12px; background: rgba(30, 41, 59, 0.8); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.85rem;">
            <option value="all" ${this.selectedCourseFilter === 'all' ? 'selected' : ''}>គ្រប់វគ្គសិក្សា (All Courses)</option>
            <option value="Word" ${this.selectedCourseFilter === 'Word' ? 'selected' : ''}>វគ្គ Word</option>
            <option value="Excel" ${this.selectedCourseFilter === 'Excel' ? 'selected' : ''}>វគ្គ Excel</option>
            <option value="PowerPoint" ${this.selectedCourseFilter === 'PowerPoint' ? 'selected' : ''}>វគ្គ PowerPoint</option>
            <option value="Typing" ${this.selectedCourseFilter === 'Typing' ? 'selected' : ''}>វគ្គ Typing & IT</option>
          </select>

          <select onchange="QuestionBankView.onDifficultyFilterChange(this.value)" style="height: 38px; padding: 0 12px; background: rgba(30, 41, 59, 0.8); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.85rem;">
            <option value="all" ${this.selectedDifficultyFilter === 'all' ? 'selected' : ''}>គ្រប់កម្រិត (All Difficulties)</option>
            <option value="ងាយស្រួល" ${this.selectedDifficultyFilter === 'ងាយស្រួល' ? 'selected' : ''}>ងាយស្រួល (Easy)</option>
            <option value="មធ្យម" ${this.selectedDifficultyFilter === 'មធ្យម' ? 'selected' : ''}>មធ្យម (Medium)</option>
            <option value="ពិបាក" ${this.selectedDifficultyFilter === 'ពិបាក' ? 'selected' : ''}>ពិបាក (Hard)</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <button type="button" onclick="QuestionBankView.openAddQuestionDialog()" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.84rem; background: linear-gradient(135deg, #10b981, #059669); border: none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); font-weight: 700;">
            <i class="fa-solid fa-plus"></i>
            <span>បន្ថែមសំណួរដោយដៃ</span>
          </button>
          <button type="button" onclick="QuestionBankView.openAiGenerateDialog()" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.84rem; background: linear-gradient(135deg, #8b5cf6, #d946ef); border: none; box-shadow: 0 4px 12px rgba(217, 70, 239, 0.3); font-weight: 700;">
            <i class="fa-solid fa-sparkles"></i>
            <span>AI បង្កើតសំណួរទុក</span>
          </button>
        </div>
      </div>

      <!-- Question List Items -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${questions.length === 0 ? `
          <div style="text-align: center; padding: 40px; background: rgba(30, 41, 59, 0.4); border-radius: 12px; border: 1px dashed #475569;">
            <i class="fa-solid fa-box-open" style="font-size: 2.5rem; color: #64748b; margin-bottom: 12px;"></i>
            <div style="color: #cbd5e1; font-weight: 700;">មិនមានសំណួរត្រូវនឹងការស្វែងរកឡើយ</div>
            <div style="font-size: 0.82rem; color: #94a3b8; margin-top: 4px;">សូមផ្លាស់ប្តូរពាក្យស្វែងរក ឬចុច «បន្ថែមសំណួរដោយដៃ» / «AI បង្កើតសំណួរទុក»</div>
          </div>
        ` : questions.map((q, idx) => {
          const cMeta = courseColorMap[q.courseId] || { color: "#6366f1", icon: "fa-book", label: q.courseId };
          const diffBadgeColor = q.difficulty === 'ងាយស្រួល' ? '#10b981' : q.difficulty === 'ពិបាក' ? '#ef4444' : '#f59e0b';

          return `
            <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-left: 4px solid ${cMeta.color}; border-radius: 12px; padding: 16px 20px; transition: all 0.2s;">
              <!-- Question Header Row -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span class="badge font-mono" style="background: ${cMeta.color}25; color: ${cMeta.color}; font-weight: 800; font-size: 0.78rem; padding: 3px 8px; border-radius: 6px;">
                    ${q.id}
                  </span>
                  <span class="badge" style="background: rgba(255, 255, 255, 0.08); color: #fff; font-size: 0.76rem; font-weight: 700;">
                    <i class="fa-solid ${cMeta.icon}" style="color: ${cMeta.color};"></i> ${cMeta.label}
                  </span>
                  <span class="badge" style="background: ${diffBadgeColor}20; color: ${diffBadgeColor}; font-size: 0.74rem; font-weight: 700;">
                    ${q.difficulty || 'មធ្យម'}
                  </span>
                  <span class="badge" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; font-size: 0.74rem;">
                    ${q.points || 10} ពិន្ទុ
                  </span>
                </div>

                <div style="display: flex; gap: 6px;">
                  <button type="button" onclick="QuestionBankView.openEditQuestionDialog('${q.id}')" class="btn-action" style="background: rgba(56, 189, 248, 0.12); color: #38bdf8;" title="កែសម្រួល">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button type="button" onclick="QuestionBankView.deleteQuestionPrompt('${q.id}')" class="btn-action" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;" title="លុប">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <!-- Scenario & Text -->
              <div style="font-size: 0.8rem; color: #a78bfa; font-weight: 700; margin-bottom: 4px;">
                🎯 ${App.escapeHtml(q.scenario)}
              </div>
              <h4 style="margin: 0 0 12px 0; font-size: 0.96rem; font-weight: 700; color: #fff; line-height: 1.5;">
                ${idx + 1}. ${App.escapeHtml(q.question)}
              </h4>

              <!-- 4 Options Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px; margin-bottom: 10px;">
                ${(q.options || []).map((opt, optIdx) => {
                  const isCorrect = optIdx === q.correct;
                  const optLetter = String.fromCharCode(65 + optIdx);
                  return `
                    <div style="padding: 7px 12px; border-radius: 8px; font-size: 0.82rem; border: 1px solid ${isCorrect ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}; background: ${isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.5)'}; color: ${isCorrect ? '#34d399' : '#cbd5e1'}; font-weight: ${isCorrect ? '700' : '500'}; display: flex; align-items: center; gap: 8px;">
                      <span style="font-weight: 800; min-width: 18px; color: ${isCorrect ? '#34d399' : '#94a3b8'};">[${optLetter}]</span>
                      <span style="flex: 1;">${App.escapeHtml(opt)}</span>
                      ${isCorrect ? '<i class="fa-solid fa-circle-check" style="color: #34d399;"></i>' : ''}
                    </div>
                  `;
                }).join("")}
              </div>

              ${q.explanation ? `
                <div style="background: rgba(15, 23, 42, 0.5); border-left: 3px solid #10b981; padding: 6px 12px; border-radius: 4px; font-size: 0.78rem; color: #cbd5e1;">
                  <strong style="color: #34d399;">💡 ការពន្យល់៖</strong> ${App.escapeHtml(q.explanation)}
                </div>
              ` : ''}
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  /* -------------------------------------------------------------
   * TAB 2: EXAM PAPER GENERATOR (FROM QUESTION BANK)
   * ------------------------------------------------------------- */
  renderGeneratorTab() {
    const allQuestions = QuestionBankService.getAllQuestions();

    return `
      <div style="max-width: 860px; margin: 0 auto;">
        <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 14px; padding: 18px 24px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 6px 0; font-size: 1.1rem; color: #c084fc; font-weight: 800; display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-certificate"></i>
            <span>ចេញវិញ្ញាសាប្រឡងតេស្ត ឬបញ្ចប់វគ្គ ពីធនាគារសំណួរ</span>
          </h4>
          <p style="margin: 0; font-size: 0.84rem; color: #cbd5e1; line-height: 1.6;">
            ប្រព័ន្ធនឹង **ដកស្រង់សំណួរចេញពីធនាគារសំណួរដែលលោកគ្រូបានរក្សាទុក ១០០%** មិនថាជ្រើសរើសចៃដន្យឆ្លាតវៃ ឬធីករើសដោយដៃឡើយ។
          </p>
        </div>

        <form id="qbExamGenForm" onsubmit="event.preventDefault(); QuestionBankView.submitGenerateExam();">
          <!-- Form Card -->
          <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 22px 26px; display: flex; flex-direction: column; gap: 18px;">
            
            <!-- Exam Title -->
            <div>
              <label style="display: block; font-size: 0.86rem; font-weight: 700; color: #fff; margin-bottom: 6px;">
                ចំណងជើងវិញ្ញាសាប្រឡង (Exam Title) *
              </label>
              <input type="text" id="genExamTitle" required value="វិញ្ញាសាប្រឡងបញ្ចប់វគ្គកុំព្យូទ័ររដ្ឋបាល" placeholder="ឧ. វិញ្ញាសាប្រឡងបញ្ចប់វគ្គ Word & Excel..." style="width: 100%; height: 40px; padding: 0 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.9rem;">
            </div>

            <!-- Course & Duration -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; font-size: 0.86rem; font-weight: 700; color: #fff; margin-bottom: 6px;">
                  វគ្គកុំព្យូទ័រ (Course Module) *
                </label>
                <select id="genExamCourse" onchange="QuestionBankView.onGenCourseChanged(this.value)" style="width: 100%; height: 40px; padding: 0 12px; background: rgba(15, 23, 42, 0.8); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.88rem;">
                  <option value="Word">វគ្គទី ២: Microsoft Word</option>
                  <option value="Excel">វគ្គទី ៣: Microsoft Excel</option>
                  <option value="PowerPoint">វគ្គទី ៤: Microsoft PowerPoint</option>
                  <option value="Typing">វគ្គទី ១: Typing & IT</option>
                  <option value="all">ចម្រុះគ្រប់វគ្គ (All Modules)</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.86rem; font-weight: 700; color: #fff; margin-bottom: 6px;">
                  ថិរវេលាប្រឡង (Duration Minutes) *
                </label>
                <select id="genExamDuration" style="width: 100%; height: 40px; padding: 0 12px; background: rgba(15, 23, 42, 0.8); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.88rem;">
                  <option value="15">១៥ នាទី (តេស្តលឿន)</option>
                  <option value="30">៣០ នាទី</option>
                  <option value="45" selected>៤៥ នាទី (ស្តង់ដារ)</option>
                  <option value="60">៦០ នាទី (១ ម៉ោងពេញ)</option>
                </select>
              </div>
            </div>

            <!-- Selection Mode Switcher -->
            <div>
              <label style="display: block; font-size: 0.86rem; font-weight: 700; color: #fff; margin-bottom: 10px;">
                វិធីសាស្ត្រជ្រើសរើសសំណួរពីធនាគារ (Selection Mode) *
              </label>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <label style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; background: rgba(15, 23, 42, 0.6); border: 1.5px solid #8b5cf6; border-radius: 10px; cursor: pointer;">
                  <input type="radio" name="genMode" value="smart_random" checked onchange="QuestionBankView.toggleGenMode('smart_random')" style="margin-top: 3px;">
                  <div>
                    <div style="font-weight: 800; color: #fff; font-size: 0.88rem; margin-bottom: 2px;">
                      🎲 ចៃដន្យឆ្លាតវៃពីធនាគារ (Smart Draw)
                    </div>
                    <div style="font-size: 0.78rem; color: #cbd5e1;">
                      កំណត់ចំនួនសំណួរ ប្រព័ន្ធនឹងដកស្រង់សំណួរចៃដន្យចេញពី Bank តាមវគ្គ និងកម្រិត
                    </div>
                  </div>
                </label>

                <label style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; background: rgba(15, 23, 42, 0.6); border: 1px solid #475569; border-radius: 10px; cursor: pointer;">
                  <input type="radio" name="genMode" value="manual" onchange="QuestionBankView.toggleGenMode('manual')" style="margin-top: 3px;">
                  <div>
                    <div style="font-weight: 800; color: #fff; font-size: 0.88rem; margin-bottom: 2px;">
                      ☑️ ជ្រើសរើសសំណួរដោយដៃ (Manual Pick)
                    </div>
                    <div style="font-size: 0.78rem; color: #cbd5e1;">
                      គ្រូពិនិត្យ និងធីក (Checkbox) សំណួរនីមួយៗក្នុងធនាគារដោយផ្ទាល់
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Smart Random Options Area -->
            <div id="genSmartRandomArea" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 14px; background: rgba(15, 23, 42, 0.5); border-radius: 10px;">
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #cbd5e1; margin-bottom: 6px;">
                  ចំនួនសំណួរត្រូវដកស្រង់ (Question Count)
                </label>
                <select id="genQuestionCount" style="width: 100%; height: 38px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; border-radius: 6px; color: #fff; font-size: 0.86rem;">
                  <option value="5">៥ សំណួរ (តេស្តលឿន)</option>
                  <option value="10" selected>១០ សំណួរ (ស្តង់ដារ 100 ពិន្ទុ)</option>
                  <option value="15">១៥ សំណួរ</option>
                  <option value="20">២០ សំណួរ (ប្រឡងធំ)</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #cbd5e1; margin-bottom: 6px;">
                  កម្រិតលំបាក (Difficulty)
                </label>
                <select id="genDifficulty" style="width: 100%; height: 38px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; border-radius: 6px; color: #fff; font-size: 0.86rem;">
                  <option value="all" selected>ចម្រុះគ្រប់កម្រិត (Mixed)</option>
                  <option value="ងាយស្រួល">ងាយស្រួល (Easy)</option>
                  <option value="មធ្យម">មធ្យម (Medium)</option>
                  <option value="ពិបាក">ពិបាក (Hard)</option>
                </select>
              </div>
            </div>

            <!-- Manual Pick Selection List Area (Hidden by default) -->
            <div id="genManualPickArea" style="display: none; flex-direction: column; gap: 10px; max-height: 260px; overflow-y: auto; padding: 12px; background: rgba(15, 23, 42, 0.6); border-radius: 10px; border: 1px solid #475569;">
              <div style="font-size: 0.82rem; color: #c084fc; font-weight: 700; margin-bottom: 4px;">
                សូមធីកលើសំណួរដែលចង់ដាក់ក្នុងវិញ្ញាសាប្រឡង (បានជ្រើសរើស: <span id="manualSelectedCountBadge">0</span> សំណួរ)៖
              </div>
              <div id="manualPickQuestionsMount">
                <!-- Dynamically loaded list of questions -->
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-primary" style="height: 44px; font-size: 0.95rem; font-weight: 800; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4); border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 10px;">
              <i class="fa-solid fa-file-circle-check"></i>
              <span>🚀 បង្កើតវិញ្ញាសាប្រឡងឥឡូវនេះ (Generate Exam Paper)</span>
            </button>
          </div>
        </form>
      </div>
    `;
  },

  /* -------------------------------------------------------------
   * TAB 3: CUSTOM GENERATED EXAMS LIST
   * ------------------------------------------------------------- */
  renderExamsTab(exams) {
    if (exams.length === 0) {
      return `
        <div style="text-align: center; padding: 60px 20px; background: rgba(30, 41, 59, 0.4); border-radius: 14px; border: 1px dashed #475569;">
          <i class="fa-solid fa-file-circle-xmark" style="font-size: 3rem; color: #64748b; margin-bottom: 14px;"></i>
          <h4 style="margin: 0 0 6px 0; font-size: 1.1rem; color: #fff; font-weight: 700;">មិនទាន់មានវិញ្ញាសាដែលបានបង្កើតនៅឡើយទេ</h4>
          <p style="margin: 0 0 18px 0; font-size: 0.84rem; color: #94a3b8;">
            លោកគ្រូអាចចូលទៅកាន់ផ្ទាំង «ចេញវិញ្ញាសាប្រឡងពីធនាគារ» ដើម្បីដកស្រង់សំណួរចេញពី Bank មកធ្វើជាវិញ្ញាសាប្រឡងភ្លាមៗ!
          </p>
          <button type="button" onclick="QuestionBankView.switchTab('generator')" class="btn-primary" style="height: 38px; padding: 0 18px; font-size: 0.85rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none;">
            <i class="fa-solid fa-plus"></i> <span>បង្កើតវិញ្ញាសាឥឡូវនេះ</span>
          </button>
        </div>
      `;
    }

    const courseColorMap = {
      Typing: { color: "#8b5cf6", icon: "fa-keyboard", label: "Typing" },
      Word: { color: "#185abd", icon: "fa-file-word", label: "Word" },
      Excel: { color: "#107c41", icon: "fa-file-excel", label: "Excel" },
      PowerPoint: { color: "#d83b01", icon: "fa-file-powerpoint", label: "PowerPoint" }
    };

    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${exams.map((ex, idx) => {
          const cMeta = courseColorMap[ex.courseId] || { color: "#6366f1", icon: "fa-book", label: ex.courseId };
          const qCount = ex.questions ? ex.questions.length : 0;

          return `
            <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-left: 4px solid ${cMeta.color}; border-radius: 14px; padding: 18px 22px;">
              <!-- Header -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <span class="badge font-mono" style="background: ${cMeta.color}25; color: ${cMeta.color}; font-weight: 800; font-size: 0.82rem; padding: 4px 8px; border-radius: 6px;">
                    ${ex.id}
                  </span>
                  <span class="badge" style="background: rgba(255, 255, 255, 0.08); color: #fff; font-size: 0.78rem; font-weight: 700;">
                    <i class="fa-solid ${cMeta.icon}" style="color: ${cMeta.color};"></i> ${cMeta.label}
                  </span>
                  <span class="badge" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; font-size: 0.76rem;">
                    <i class="fa-solid fa-list-check"></i> ${qCount} សំណួរ (ពីធនាគារ)
                  </span>
                  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.76rem;">
                    <i class="fa-regular fa-clock"></i> ${ex.duration} នាទី
                  </span>
                  <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; font-size: 0.76rem;">
                    ពិន្ទុពេញ: ${ex.maxScore}
                  </span>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <button type="button" onclick="QuestionBankService.printExamSheet('${ex.id}', 'student')" class="btn-secondary" style="height: 32px; padding: 0 12px; font-size: 0.78rem;" title="បោះពុម្ពក្រដាសប្រឡងសិស្ស A4">
                    <i class="fa-solid fa-print"></i> <span>ក្រដាសសិស្ស A4</span>
                  </button>
                  <button type="button" onclick="QuestionBankService.printExamSheet('${ex.id}', 'teacher')" class="btn-secondary" style="height: 32px; padding: 0 12px; font-size: 0.78rem; color: #10b981; border-color: rgba(16, 185, 129, 0.35);" title="បោះពុម្ពចម្លើយគ្រូ + ការពន្យល់ A4">
                    <i class="fa-solid fa-key"></i> <span>ចម្លើយគ្រូ A4</span>
                  </button>
                  <button type="button" onclick="QuestionBankView.launchLiveArenaForExam('${ex.courseId}', '${ex.id}')" class="btn-primary" style="height: 32px; padding: 0 14px; font-size: 0.78rem; background: linear-gradient(135deg, ${cMeta.color}, #4f46e5); border: none; box-shadow: 0 2px 8px ${cMeta.color}35;" title="ចូលប្រឡងផ្ទាល់លើកុំព្យូទ័រ (Interactive Arena)">
                    <i class="fa-solid fa-play"></i> <span>ធ្វើតេស្តផ្ទាល់</span>
                  </button>
                  <button type="button" onclick="QuestionBankView.deleteCustomExamPrompt('${ex.id}')" class="btn-action" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;" title="លុបវិញ្ញាសានេះ">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <!-- Title & Desc -->
              <h4 style="margin: 0 0 6px 0; font-size: 1.05rem; font-weight: 800; color: #fff;">
                ${App.escapeHtml(ex.title)}
              </h4>
              <p style="margin: 0; font-size: 0.82rem; color: #94a3b8; line-height: 1.5;">
                ${App.escapeHtml(ex.description)}
              </p>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  /* -------------------------------------------------------------
   * CONTROLLER ACTIONS & MODALS
   * ------------------------------------------------------------- */
  onSearchInput(val) {
    this.searchKeyword = val;
    this.render();
    const input = document.getElementById("qbSearchInput");
    if (input) {
      input.focus();
      input.setSelectionRange(val.length, val.length);
    }
  },

  onCourseFilterChange(val) {
    this.selectedCourseFilter = val;
    this.render();
  },

  onDifficultyFilterChange(val) {
    this.selectedDifficultyFilter = val;
    this.render();
  },

  toggleGenMode(mode) {
    const smartArea = document.getElementById("genSmartRandomArea");
    const manualArea = document.getElementById("genManualPickArea");
    if (mode === "smart_random") {
      if (smartArea) smartArea.style.display = "grid";
      if (manualArea) manualArea.style.display = "none";
    } else {
      if (smartArea) smartArea.style.display = "none";
      if (manualArea) manualArea.style.display = "flex";
      this.populateManualPickQuestions();
    }
  },

  onGenCourseChanged(course) {
    this.populateManualPickQuestions();
  },

  populateManualPickQuestions() {
    const mount = document.getElementById("manualPickQuestionsMount");
    if (!mount) return;

    const courseSelect = document.getElementById("genExamCourse");
    const course = courseSelect ? courseSelect.value : "Word";
    let questions = QuestionBankService.getAllQuestions();
    if (course && course !== "all") {
      questions = questions.filter(q => q.courseId === course);
    }

    mount.innerHTML = questions.map(q => {
      const isChecked = this.selectedQuestionIdsForExam.has(q.id);
      return `
        <label style="display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px; border-radius: 6px; background: rgba(30, 41, 59, 0.7); margin-bottom: 6px; cursor: pointer; border: 1px solid ${isChecked ? '#8b5cf6' : 'transparent'};">
          <input type="checkbox" value="${q.id}" ${isChecked ? 'checked' : ''} onchange="QuestionBankView.onManualPickCheckbox('${q.id}', this.checked)" style="margin-top: 3px;">
          <div style="flex: 1; font-size: 0.8rem; color: #cbd5e1;">
            <strong style="color: #fff;">[${q.id}]</strong> ${App.escapeHtml(q.question)}
            <span style="color: #a78bfa; font-size: 0.75rem;">(${q.points || 10} ពិន្ទុ • ${q.difficulty})</span>
          </div>
        </label>
      `;
    }).join("");

    this.updateManualSelectedBadge();
  },

  onManualPickCheckbox(id, isChecked) {
    if (isChecked) {
      this.selectedQuestionIdsForExam.add(id);
    } else {
      this.selectedQuestionIdsForExam.delete(id);
    }
    this.updateManualSelectedBadge();
  },

  updateManualSelectedBadge() {
    const badge = document.getElementById("manualSelectedCountBadge");
    if (badge) badge.textContent = this.selectedQuestionIdsForExam.size;
  },

  submitGenerateExam() {
    const titleInput = document.getElementById("genExamTitle");
    const courseSelect = document.getElementById("genExamCourse");
    const durationSelect = document.getElementById("genExamDuration");
    const countSelect = document.getElementById("genQuestionCount");
    const diffSelect = document.getElementById("genDifficulty");
    const modeRadio = document.querySelector('input[name="genMode"]:checked');

    const title = titleInput ? titleInput.value.trim() : "";
    const course = courseSelect ? courseSelect.value : "Word";
    const duration = durationSelect ? parseInt(durationSelect.value, 10) : 45;
    const mode = modeRadio ? modeRadio.value : "smart_random";
    const count = countSelect ? parseInt(countSelect.value, 10) : 10;
    const difficulty = diffSelect ? diffSelect.value : "all";

    try {
      const generated = QuestionBankService.createExamFromBank({
        title,
        course,
        selectionMode: mode,
        selectedQuestionIds: Array.from(this.selectedQuestionIdsForExam),
        questionCount: count,
        difficulty,
        duration,
        maxScore: 100
      });

      if (typeof App !== "undefined") {
        App.showToast(`🎉 បានបង្កើតវិញ្ញាសា «${generated.id}» ដោយជោគជ័យចេញពីធនាគារសំណួរ!`, "success");
      }

      this.currentTab = "exams";
      this.render();
    } catch (err) {
      if (typeof App !== "undefined") {
        App.showToast("បរាជ័យក្នុងការបង្កើត: " + err.message, "error");
      } else {
        alert(err.message);
      }
    }
  },

  launchLiveArenaForExam(courseKey, examId) {
    this.closeModal();
    if (typeof ExamsView !== "undefined" && ExamsView.openLiveExamArena) {
      ExamsView.openLiveExamArena(courseKey, examId);
    }
  },

  deleteQuestionPrompt(id) {
    if (confirm(`តើលោកគ្រូប្រាកដជាចង់លុបសំណួរកូដ [${id}] នេះចេញពីធនាគារសំណួរមែនទេ?`)) {
      QuestionBankService.deleteQuestion(id);
      if (typeof App !== "undefined") App.showToast("បានលុបសំណួររួចរាល់!", "info");
      this.render();
    }
  },

  deleteCustomExamPrompt(id) {
    if (confirm(`តើលោកគ្រូប្រាកដជាចង់លុបវិញ្ញាសា [${id}] នេះមែនទេ?`)) {
      QuestionBankService.deleteCustomExam(id);
      if (typeof App !== "undefined") App.showToast("បានលុបវិញ្ញាសារួចរាល់!", "info");
      this.render();
    }
  },

  openAddQuestionDialog() {
    const course = this.selectedCourseFilter !== "all" ? this.selectedCourseFilter : "Word";
    const scenario = prompt("បញ្ចូលប្រធានបទ/សេណារីយ៉ូ (Scenario):", "ការកំណត់រឹមទំព័រ និងទម្រង់លិខិត");
    if (!scenario) return;

    const question = prompt("បញ្ចូលខ្លឹមសារសំណួរជាភាសាខ្មែរ (Question):", "តើត្រូវចូលតាមកន្លែងណាដើម្បីកំណត់រឹមទំព័រ?");
    if (!question) return;

    const optA = prompt("ជម្រើស [A]:", "Tab Layout ➔ Margins");
    const optB = prompt("ជម្រើស [B]:", "Tab Insert ➔ Margins");
    const optC = prompt("ជម្រើស [C]:", "Tab Home ➔ Margins");
    const optD = prompt("ជម្រើស [D]:", "Tab View ➔ Margins");

    const correctStr = prompt("ជម្រើសត្រឹមត្រូវ (0 សម្រាប់ A, 1 សម្រាប់ B, 2 សម្រាប់ C, 3 សម្រាប់ D):", "0");
    const correctIdx = parseInt(correctStr, 10) || 0;

    const explanation = prompt("ការពន្យល់គរុកោសល្យ (Explanation):", "ការកំណត់ Margins ស្ថិតក្រោម Tab Layout។") || "";

    QuestionBankService.addQuestion({
      courseId: course,
      scenario,
      question,
      options: [optA || "A", optB || "B", optC || "C", optD || "D"],
      correct: correctIdx,
      points: 10,
      difficulty: "មធ្យម",
      explanation
    });

    if (typeof App !== "undefined") App.showToast("🎉 បានបន្ថែមសំណួរថ្មីទៅក្នុងធនាគារសំណួរជោគជ័យ!", "success");
    this.render();
  },

  openEditQuestionDialog(id) {
    const q = QuestionBankService.getQuestionById(id);
    if (!q) return;

    const newQuestion = prompt("កែសម្រួលខ្លឹមសារសំណួរ (Question):", q.question);
    if (!newQuestion) return;

    const newScenario = prompt("កែសម្រួលសេណារីយ៉ូ (Scenario):", q.scenario) || q.scenario;
    const newExplanation = prompt("កែសម្រួលការពន្យល់ (Explanation):", q.explanation) || q.explanation;

    QuestionBankService.updateQuestion(id, {
      question: newQuestion,
      scenario: newScenario,
      explanation: newExplanation
    });

    if (typeof App !== "undefined") App.showToast("បានកែសម្រួលសំណួរជោគជ័យ!", "success");
    this.render();
  },

  async openAiGenerateDialog() {
    const course = this.selectedCourseFilter !== "all" ? this.selectedCourseFilter : "Word";
    const topic = prompt(`[Gemini AI] បញ្ចូលប្រធានបទមេរៀនដែលចង់បង្កើតសំណួរសម្រាប់វគ្គ ${course}៖`, "ការកំណត់រចនាសម្ព័ន្ធឯកសារ និងរូបមន្ត");
    if (!topic) return;

    const countStr = prompt("ចំនួនសំណួរដែលត្រូវបង្កើត (ឧ. 5 ឬ 10)៖", "5");
    const count = parseInt(countStr, 10) || 5;

    if (typeof App !== "undefined") App.showToast("កំពុងដំណើរការ Gemini 3.8 Flash AI បង្កើតសំណួរ...", "info", 4000);

    try {
      const added = await QuestionBankService.generateQuestionsWithAI({
        course,
        topic,
        count,
        difficulty: "មធ្យម"
      });

      if (typeof App !== "undefined") {
        App.showToast(`🎉 Gemini AI បានបង្កើត និងបញ្ចូល ${added.length} សំណួរទៅក្នុងធនាគារជោគជ័យ!`, "success");
      }
      this.render();
    } catch (err) {
      alert("បរាជ័យ: " + err.message);
    }
  }
};

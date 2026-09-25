/**
 * Configuration file for Student Management System
 */
const APP_CONFIG = {
  appName: "ប្រព័ន្ធគ្រប់គ្រងសិស្ស - TIS Lab Computer",
  appVersion: "2.1.20260925",
  studentIdPrefix: "TX",
  
  // Firebase Realtime Database Configuration
  firebaseConfig: {
    apiKey: "AIzaSyB0TPQQJ5mdfFv3VXFJQp9wM0EgRs259u0",
    authDomain: "system-student-c2267.firebaseapp.com",
    databaseURL: "https://system-student-c2267-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "system-student-c2267",
    storageBucket: "system-student-c2267.firebasestorage.app",
    messagingSenderId: "593864672714",
    appId: "1:593864672714:web:33628f8f1ea4ccafc3fb33",
    measurementId: "G-PR1SFZT780"
  },
  
  // Storage Keys
  STORAGE_KEY_STUDENTS: "master_school_students_db",
  STORAGE_KEY_SETTINGS: "master_school_settings",
  STORAGE_KEY_THEME: "master_school_theme",
  STORAGE_KEY_ATTENDANCE: "master_school_attendance_db",
  STORAGE_KEY_EXAMS: "master_school_exams_db",
  STORAGE_KEY_AUTH: "master_school_auth_teacher",
  STORAGE_KEY_TEACHERS: "master_school_teachers_db",
  STORAGE_KEY_FEES: "master_school_fees_db",
  STORAGE_KEY_CERTIFICATES: "master_school_certificates_db",
  STORAGE_KEY_TELEGRAM: "master_school_telegram_config",
  STORAGE_KEY_LAB: "master_school_lab_seats",
  STORAGE_KEY_LAB_MAINTENANCE: "master_school_lab_maintenance",
  STORAGE_KEY_LAB_SOFTWARE: "master_school_lab_software",
  STORAGE_KEY_LAB_PRINTERS: "master_school_lab_printers",
  STORAGE_KEY_LAB_EXERCISES: "master_school_lab_exercises",
  STORAGE_KEY_LAB_CURRICULUM: "master_school_lab_curriculum",
  STORAGE_KEY_LAB_MESSAGES: "master_school_lab_messages",
  STORAGE_KEY_LEAVE_REQUESTS: "master_school_leave_requests",
  STORAGE_KEY_ASSIGNMENTS: "master_school_assignments",
  STORAGE_KEY_ASSIGNMENT_SUBS: "master_school_assignment_subs",
  DEFAULT_COURSE_DURATION_MONTHS: 4,
  
  // Telegram Bot Notifications Configuration
  telegramConfig: {
    enabled: true,
    botToken: "8895987401:AAHkXzItXSRlxk-y7H4f3mNxCpiOp6LeHVk",
    botUsername: "my_master_kh_bot",
    chatId: "-5379513071",
    notifyNewStudent: true,
    notifyAttendance: false, // Individual student notification (disabled to avoid message spam)
    notifyIndividualAttendance: false, // Explicit toggle for individual attendance
    notifyShiftAttendanceSummary: true, // Consolidated shift summary 5 minutes after completion
    shiftAttendanceDelayMinutes: 5, // 5 minutes debounce delay
    notifyDailyAttendanceSummary: true,
    dailyAttendanceTime: "19:00", // 7:00 PM
    notifyPayment: true,
    notifyExam: true,
    notifyCertificate: true,
    notifyLeaveRequest: true
  },

  // Tuition & Invoicing Configurations
  feeConfig: {
    defaultCoursePrice: 50, // $50 per module
    currency: "USD",
    currencySymbol: "$",
    bankName: "ABA Bank",
    accountName: "KHIEN THOU (TIS LAB COMPUTER)",
    accountNumber: "071 721 0307",
    khqrReceiver: "master_school@aba"
  },
  
  // Grade Options (Only Computer)
  grades: [
    "ថ្នាក់កុំព្យូទ័រ"
  ],

  // Computer Courses & Sequential Modules (៤ វគ្គកុំព្យូទ័រតាមលំដាប់លំដោយ)
  computerCourses: [
    { 
      id: "Typing", 
      name: "Typing", 
      step: 1, 
      icon: "fa-keyboard", 
      color: "#8b5cf6", 
      bg: "rgba(139, 92, 246, 0.12)", 
      desc: "វគ្គទី ១: វាយអត្ថបទខ្មែរ-អង់គ្លេស",
      maxScore: 100,
      passScore: 50
    },
    { 
      id: "Word", 
      name: "Microsoft Word", 
      step: 2, 
      icon: "fa-file-word", 
      color: "#185abd", 
      bg: "rgba(24, 90, 189, 0.12)", 
      desc: "វគ្គទី ២: រដ្ឋបាល & តាក់តែងអត្ថបទ Word",
      maxScore: 100,
      passScore: 50
    },
    { 
      id: "Excel", 
      name: "Microsoft Excel", 
      step: 3, 
      icon: "fa-file-excel", 
      color: "#107c41", 
      bg: "rgba(16, 124, 65, 0.12)", 
      desc: "វគ្គទី ៣: គណនាតារាង & រូបមន្ត Excel",
      maxScore: 100,
      passScore: 50
    },
    { 
      id: "PowerPoint", 
      name: "Microsoft PowerPoint", 
      step: 4, 
      icon: "fa-file-powerpoint", 
      color: "#d83b01", 
      bg: "rgba(216, 59, 1, 0.12)", 
      desc: "វគ្គទី ៤: Slide & បទបង្ហាញ PowerPoint",
      maxScore: 100,
      passScore: 50
    }
  ],

  // English Levels (Empty - School is 100% Computer focused)
  englishLevels: [],
  
  // Shifts
  shifts: [
    { id: "ព្រឹក", label: "វេនព្រឹក (08:00 - 09:00)" },
    { id: "ថ្ងៃ", label: "វេនថ្ងៃ (15:00 - 16:00)" },
    { id: "រសៀល", label: "វេនរសៀល (17:00 - 18:00)" }
  ],
  
  // Provinces
  provinces: [
    "ខេត្តកំពត", "រាជធានីភ្នំពេញ", "ខេត្តកណ្តាល", "ខេត្តសៀមរាប", "ខេត្តបាត់ដំបង", 
    "ខេត្តកំពង់ចាម", "ខេត្តកំពង់ឆ្នាំង", "ខេត្តកំពង់ធំ", "ខេត្តកំពង់ស្ពឺ", 
    "ខេត្តកែប", "ខេត្តកោះកុង", "ខេត្តក្រចេះ", 
    "ខេត្តតាកែវ", "ខេត្តបន្ទាយមានជ័យ", "ខេត្តព្រៃវែង", "ខេត្តពោធិ៍សាត់", 
    "ខេត្តមណ្ឌលគិរី", "ខេត្តរតនគិរី", "ខេត្តព្រះវិហារ", "ខេត្តព្រះសីហនុ", 
    "ខេត្តស្ទឹងត្រែង", "ខេត្តស្វាយរៀង", "ខេត្តឧត្តរមានជ័យ", "ខេត្តប៉ៃលិន", "ខេត្តត្បូងឃ្មុំ"
  ],

  // Default Teacher Accounts (គណនីគ្រូបង្រៀន & Admin)
  defaultTeachers: [
    {
      id: "TCH-001",
      username: "khienthou",
      password: "11112222",
      nameKh: "លោកគ្រូ ខៀន ធូ",
      nameEn: "Mr. KHIEN THOU",
      role: "គ្រូបង្រៀន & អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin)",
      subject: "គ្រប់គ្រងប្រព័ន្ធ & Computer Admin",
      degree: "បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ (BSc Computer Science)",
      classes: "Typing, Word, Excel, PowerPoint",
      shifts: ["morning", "noon", "afternoon", "evening"],
      email: "khienthou01@gmail.com",
      phone: "071 721 0307",
      telegram: "0717210307",
      joinDate: "2024-01-15",
      experience: "៥ ឆ្នាំ",
      status: "សកម្ម",
      address: "ខេត្តកំពត",
      notes: "អ្នកគ្រប់គ្រងបច្ចេកទេស និងបន្ទប់កុំព្យូទ័រ TIS Lab",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
      gender: "ប្រុស",
      permissions: ["all"]
    }
  ]
};

// Initialize Firebase App
if (typeof firebase !== "undefined" && (!firebase.apps || !firebase.apps.length)) {
  try {
    firebase.initializeApp(APP_CONFIG.firebaseConfig);
    console.log("🔥 Firebase initialized successfully!");
  } catch (err) {
    console.error("Firebase init error:", err);
  }
}

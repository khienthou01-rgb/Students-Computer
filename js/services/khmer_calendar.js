/**
 * Service: Khmer Calendar & National Holidays Telegram Broadcast Engine
 * (ប្រតិទិនខ្មែរ បុណ្យជាតិ និងប្រព័ន្ធផ្សាយដំណឹងឈប់សម្រាកតាម Telegram Bot ជូនដំណឹងមុន)
 */
const KhmerCalendarService = {
  STORAGE_KEY_CUSTOM_HOLIDAYS: "ms_custom_holidays",
  STORAGE_KEY_LAST_NOTIFIED: "ms_last_notified_holiday",

  // Khmer Numeral conversion
  toKhmerNum(num) {
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(num).replace(/[0-9]/g, d => khmerDigits[d]);
  },

  // Khmer Month Names
  khmerMonths: [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
  ],

  // Khmer Weekday Names
  khmerDays: [
    "អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"
  ],

  /**
   * Official Kingdom of Cambodia Public Holidays database
   * Fixed solar dates and annual lunar variable dates (2025, 2026, 2027)
   */
  officialHolidays: [
    // --- January ---
    { id: "ny", month: 1, day: 1, duration: 1, title: "ទិវាចូលឆ្នាំសកល", titleEn: "International New Year's Day", icon: "🎉", type: "national" },
    { id: "vic", month: 1, day: 7, duration: 1, title: "ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍", titleEn: "Victory over Genocide Day", icon: "🕊️", type: "national" },

    // --- March ---
    { id: "women", month: 3, day: 8, duration: 1, title: "ទិវាអន្តរជាតិនារី ៨ មីនា", titleEn: "International Women's Day", icon: "🌸", type: "international" },

    // --- April (Khmer New Year 4 days) ---
    { id: "kny_1", month: 4, day: 13, duration: 1, title: "ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ (ថ្ងៃទី១ មហាសង្ក្រាន្ត)", titleEn: "Khmer New Year (Maha Songkran)", icon: "🇰🇭", type: "cultural" },
    { id: "kny_2", month: 4, day: 14, duration: 1, title: "ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ (ថ្ងៃទី២ វារៈវនបត)", titleEn: "Khmer New Year (Virak Wanabat)", icon: "🇰🇭", type: "cultural" },
    { id: "kny_3", month: 4, day: 15, duration: 1, title: "ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ (ថ្ងៃទី៣ វារៈឡើងស័ក)", titleEn: "Khmer New Year (Virak Leung Sak)", icon: "🇰🇭", type: "cultural" },
    { id: "kny_4", month: 4, day: 16, duration: 1, title: "ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ (ថ្ងៃទី៤ ស្រង់ព្រះ)", titleEn: "Khmer New Year (Water Blessing Day)", icon: "🇰🇭", type: "cultural" },

    // --- May ---
    { id: "labor", month: 5, day: 1, duration: 1, title: "ទិវាពលកម្មអន្តរជាតិ ១ ឧសភា", titleEn: "International Labor Day", icon: "🛠️", type: "international" },
    { id: "king_bday", month: 5, day: 14, duration: 1, title: "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណា ព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី", titleEn: "King Norodom Sihamoni's Birthday", icon: "👑", type: "royal" },

    // --- June ---
    { id: "queen_bday", month: 6, day: 18, duration: 1, title: "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ", titleEn: "Queen Mother's Birthday", icon: "👑", type: "royal" },

    // --- September ---
    { id: "const", month: 9, day: 24, duration: 1, title: "ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ", titleEn: "Constitutional Day", icon: "📜", type: "national" },

    // --- October ---
    { id: "king_father", month: 10, day: 15, duration: 1, title: "ទិវាប្រារព្ធពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះករុណា ព្រះបាទសម្តេចព្រះ នរោត្តម សីហនុ ព្រះបរមរតនកោដ្ឋ", titleEn: "Commemoration of the King Father", icon: "🕯️", type: "royal" },
    { id: "king_coron", month: 10, day: 29, duration: 1, title: "ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិរបស់ ព្រះករុណា ព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី", titleEn: "King's Coronation Day", icon: "👑", type: "royal" },

    // --- November ---
    { id: "indep", month: 11, day: 9, duration: 1, title: "ពិធីបុណ្យឯករាជ្យជាតិ ៩ វិច្ឆិកា", titleEn: "National Independence Day", icon: "🇰🇭", type: "national" },

    // =========================================================================
    // Variable Lunar Holidays for Specific Years (2025, 2026, 2027)
    // =========================================================================
    // 2025
    { id: "plough_2025", dateStr: "2025-05-16", title: "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល", titleEn: "Royal Ploughing Ceremony", icon: "🌾", type: "royal" },
    { id: "visak_2025", dateStr: "2025-05-12", title: "ពិធីបុណ្យវិសាខបូជា", titleEn: "Visak Bochea Day", icon: "☸️", type: "cultural" },
    { id: "pchum_2025_1", dateStr: "2025-09-21", title: "ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី១)", titleEn: "Pchum Ben Festival (Day 1)", icon: "🍱", type: "cultural" },
    { id: "pchum_2025_2", dateStr: "2025-09-22", title: "ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី២ ភ្ជុំធំ)", titleEn: "Pchum Ben Festival (Day 2)", icon: "🍱", type: "cultural" },
    { id: "pchum_2025_3", dateStr: "2025-09-23", title: "ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី៣)", titleEn: "Pchum Ben Festival (Day 3)", icon: "🍱", type: "cultural" },
    { id: "water_2025_1", dateStr: "2025-11-04", title: "ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី១)", titleEn: "Water Festival (Day 1)", icon: "🚣", type: "cultural" },
    { id: "water_2025_2", dateStr: "2025-11-05", title: "ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី២ សំពះព្រះខែ)", titleEn: "Water Festival (Day 2)", icon: "🚣", type: "cultural" },
    { id: "water_2025_3", dateStr: "2025-11-06", title: "ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី៣ កាត់ព្រ័ត្រ)", titleEn: "Water Festival (Day 3)", icon: "🚣", type: "cultural" },

    // 2026 (Active System Year)
    { id: "plough_2026", dateStr: "2026-05-06", title: "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល", titleEn: "Royal Ploughing Ceremony", icon: "🌾", type: "royal" },
    { id: "visak_2026", dateStr: "2026-05-02", title: "ពិធីបុណ្យវិសាខបូជា", titleEn: "Visak Bochea Day", icon: "☸️", type: "cultural" },
    { id: "pchum_2026_1", dateStr: "2026-10-09", title: "ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី១)", titleEn: "Pchum Ben Festival (Day 1)", icon: "🍱", type: "cultural" },
    { id: "pchum_2026_2", dateStr: "2026-10-10", title: "ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី២ ភ្ជុំធំ)", titleEn: "Pchum Ben Festival (Day 2 - Main Day)", icon: "🍱", type: "cultural" },
    { id: "pchum_2026_3", dateStr: "2026-10-11", title: "ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី៣)", titleEn: "Pchum Ben Festival (Day 3)", icon: "🍱", type: "cultural" },
    { id: "water_2026_1", dateStr: "2026-11-23", title: "ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី១ បើកការប្រណាំង)", titleEn: "Water Festival (Day 1)", icon: "🚣", type: "cultural" },
    { id: "water_2026_2", dateStr: "2026-11-24", title: "ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី២ សំពះព្រះខែ & អកអំបុក)", titleEn: "Water Festival (Day 2)", icon: "🚣", type: "cultural" },
    { id: "water_2026_3", dateStr: "2026-11-25", title: "ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី៣ កាត់ព្រ័ត្រ & បណ្តែតប្រទីប)", titleEn: "Water Festival (Day 3)", icon: "🚣", type: "cultural" },

    // 2027
    { id: "plough_2027", dateStr: "2027-05-24", title: "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល", titleEn: "Royal Ploughing Ceremony", icon: "🌾", type: "royal" },
    { id: "visak_2027", dateStr: "2027-05-20", title: "ពិធីបុណ្យវិសាខបូជា", titleEn: "Visak Bochea Day", icon: "☸️", type: "cultural" },
    { id: "pchum_2027_1", dateStr: "2027-09-28", title: "ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី១)", titleEn: "Pchum Ben Festival (Day 1)", icon: "🍱", type: "cultural" },
    { id: "pchum_2027_2", dateStr: "2027-09-29", title: "ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី២ ភ្ជុំធំ)", titleEn: "Pchum Ben Festival (Day 2)", icon: "🍱", type: "cultural" },
    { id: "pchum_2027_3", dateStr: "2027-09-30", title: "ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី៣)", titleEn: "Pchum Ben Festival (Day 3)", icon: "🍱", type: "cultural" },
    { id: "water_2027_1", dateStr: "2027-11-12", title: "ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី១)", titleEn: "Water Festival (Day 1)", icon: "🚣", type: "cultural" },
    { id: "water_2027_2", dateStr: "2027-11-13", title: "ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី២)", titleEn: "Water Festival (Day 2)", icon: "🚣", type: "cultural" },
    { id: "water_2027_3", dateStr: "2027-11-14", title: "ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី៣)", titleEn: "Water Festival (Day 3)", icon: "🚣", type: "cultural" }
  ],

  // ------------------------------------------------------------------------
  // CUSTOM SCHOOL HOLIDAYS (Teacher Defined)
  // ------------------------------------------------------------------------
  getCustomHolidays() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_CUSTOM_HOLIDAYS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveCustomHoliday(holiday) {
    const list = this.getCustomHolidays();
    const newEntry = {
      id: "custom_" + Date.now(),
      title: holiday.title,
      titleEn: holiday.titleEn || "School Break",
      startDate: holiday.startDate,
      endDate: holiday.endDate || holiday.startDate,
      resumeDate: holiday.resumeDate,
      note: holiday.note || "",
      icon: holiday.icon || "🏫",
      type: "school_break"
    };
    list.push(newEntry);
    localStorage.setItem(this.STORAGE_KEY_CUSTOM_HOLIDAYS, JSON.stringify(list));

    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        firebase.database().ref("settings/custom_holidays").set(list);
      } catch (e) {}
    }
    return newEntry;
  },

  deleteCustomHoliday(holidayId) {
    const list = this.getCustomHolidays().filter(h => h.id !== holidayId);
    localStorage.setItem(this.STORAGE_KEY_CUSTOM_HOLIDAYS, JSON.stringify(list));
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        firebase.database().ref("settings/custom_holidays").set(list);
      } catch (e) {}
    }
  },

  // ------------------------------------------------------------------------
  // RESOLVE ALL HOLIDAYS FOR A GIVEN YEAR
  // ------------------------------------------------------------------------
  getHolidaysForYear(year = new Date().getFullYear()) {
    const list = [];

    // 1. Process recurring solar holidays
    this.officialHolidays.forEach(h => {
      if (h.month && h.day) {
        const mStr = String(h.month).padStart(2, "0");
        const dStr = String(h.day).padStart(2, "0");
        const dateStr = `${year}-${mStr}-${dStr}`;
        list.push({
          ...h,
          dateStr: dateStr,
          year: year
        });
      } else if (h.dateStr && h.dateStr.startsWith(String(year))) {
        list.push({
          ...h,
          year: year
        });
      }
    });

    // 2. Process Custom School Breaks for this year
    const customList = this.getCustomHolidays();
    customList.forEach(c => {
      if (c.startDate && c.startDate.startsWith(String(year))) {
        list.push({
          ...c,
          dateStr: c.startDate,
          year: year
        });
      }
    });

    // Sort chronologically
    return list.sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  },

  /**
   * Check if a specific date (YYYY-MM-DD) is a holiday
   */
  getHolidayByDate(dateStr) {
    if (!dateStr) return null;
    const year = parseInt(dateStr.split("-")[0], 10);
    const holidays = this.getHolidaysForYear(year);

    // Exact match
    const exact = holidays.find(h => h.dateStr === dateStr);
    if (exact) return exact;

    // Check custom multi-day range
    const custom = this.getCustomHolidays().find(c => {
      return dateStr >= c.startDate && dateStr <= (c.endDate || c.startDate);
    });
    return custom || null;
  },

  /**
   * Format full Khmer date string
   * e.g. "ថ្ងៃព្រហស្បតិ៍ ទី២៤ ខែកញ្ញា ឆ្នាំ២០២៦"
   */
  formatKhmerFullDate(date = new Date()) {
    const d = (typeof date === "string") ? new Date(date + "T00:00:00") : date;
    const dayName = this.khmerDays[d.getDay()];
    const dayNum = this.toKhmerNum(d.getDate());
    const monthName = this.khmerMonths[d.getMonth()];
    const yearNum = this.toKhmerNum(d.getFullYear());

    return `ថ្ងៃ${dayName} ទី${dayNum} ខែ${monthName} ឆ្នាំ${yearNum}`;
  },

  formatKhmerShortDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const d = this.toKhmerNum(parseInt(parts[2], 10));
    const m = this.khmerMonths[parseInt(parts[1], 10) - 1];
    const y = this.toKhmerNum(parts[0]);
    return `${d} ${m} ${y}`;
  },

  // ------------------------------------------------------------------------
  // ADVANCE HOLIDAY DETECTION (ដឹងមុន ១ ទៅ ៧ ថ្ងៃ)
  // ------------------------------------------------------------------------
  getUpcomingHolidays(daysAhead = 7) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const currentYear = today.getFullYear();
    const holidaysThisYear = this.getHolidaysForYear(currentYear);
    const holidaysNextYear = this.getHolidaysForYear(currentYear + 1);
    const allHolidays = [...holidaysThisYear, ...holidaysNextYear];

    const upcoming = [];

    allHolidays.forEach(h => {
      const hDate = new Date(h.dateStr + "T00:00:00");
      const diffTime = hDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= daysAhead) {
        let resumeDateFormatted = "";
        if (h.resumeDate) {
          resumeDateFormatted = this.formatKhmerShortDate(h.resumeDate);
        } else {
          // Default resume date is the day after the holiday or holiday period
          const rDate = new Date(hDate);
          rDate.setDate(rDate.getDate() + (h.duration || 1));
          // If resumes on Sunday, move to Monday
          if (rDate.getDay() === 0) rDate.setDate(rDate.getDate() + 1);
          const y = rDate.getFullYear();
          const m = String(rDate.getMonth() + 1).padStart(2, "0");
          const d = String(rDate.getDate()).padStart(2, "0");
          resumeDateFormatted = this.formatKhmerShortDate(`${y}-${m}-${d}`);
        }

        upcoming.push({
          ...h,
          diffDays,
          diffLabel: diffDays === 0 ? "ថ្ងៃនេះ!" : (diffDays === 1 ? "ថ្ងៃស្អែកនេះ!" : `សល់ ${this.toKhmerNum(diffDays)} ថ្ងៃទៀត`),
          formattedDateKh: this.formatKhmerShortDate(h.dateStr),
          resumeDateFormatted
        });
      }
    });

    return upcoming.sort((a, b) => a.diffDays - b.diffDays);
  },

  // ------------------------------------------------------------------------
  // AUTOMATED DAILY SYSTEM CHECK & PROMPT
  // ------------------------------------------------------------------------
  checkAndPromptAdvanceHolidays() {
    const upcoming = this.getUpcomingHolidays(3); // Look 3 days ahead
    if (upcoming.length === 0) return;

    const nextH = upcoming[0];
    const todayStr = new Date().toISOString().split("T")[0];
    const notifiedKey = `${this.STORAGE_KEY_LAST_NOTIFIED}_${nextH.id}_${todayStr}`;

    // If teacher hasn't been notified today for this holiday
    if (!localStorage.getItem(notifiedKey)) {
      if (typeof App !== "undefined" && App.showToast) {
        setTimeout(() => {
          App.showToast(
            `🔔 ជិតដល់ថ្ងៃឈប់សម្រាក «${nextH.title}» (${nextH.diffLabel})! សូមចុចពិនិត្យ និងផ្សាយដំណឹង Telegram`,
            "info"
          );
        }, 1500);
      }
      localStorage.setItem(notifiedKey, "prompted");
    }
  },

  // ------------------------------------------------------------------------
  // TELEGRAM BOT HOLIDAY ANNOUNCEMENT BROADCAST
  // ------------------------------------------------------------------------
  async broadcastHolidayToTelegram(holiday, options = {}) {
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("⚠️ សូមកំណត់ Telegram Bot Token និង Chat ID ក្នុង Settings ជាមុនសិន!", "warning");
      }
      return false;
    }

    const branding = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.getSchoolBranding)
      ? TeacherToolsService.getSchoolBranding()
      : { schoolNameKh: "TIS Lab Computer", teacherTitle: "លោកគ្រូ ខៀន ធូ", phone: "097 508 2743" };

    const targetShift = options.targetShift || "ALL";
    let shiftScopeKh = "ប្អូនៗសិស្សានុសិស្សគ្រប់វេនសិក្សាទាំងអស់ (ព្រឹក • រសៀល • យប់) និងអាណាព្យាបាល";
    if (targetShift === "ព្រឹក") shiftScopeKh = "ប្អូនៗសិស្សានុសិស្ស វេនព្រឹក (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)";
    else if (targetShift === "រសៀល") shiftScopeKh = "ប្អូនៗសិស្សានុសិស្ស វេនរសៀល (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)";
    else if (targetShift === "យប់") shiftScopeKh = "ប្អូនៗសិស្សានុសិស្ស វេនយប់ ម៉ោង៥-៦ (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)";

    const startDateStr = options.startDate || holiday.dateStr;
    const endDateStr = options.endDate || holiday.endDate || holiday.dateStr;
    const resumeDateStr = options.resumeDate || holiday.resumeDate;

    const startDateKh = this.formatKhmerShortDate(startDateStr);
    const endDateKh = (endDateStr && endDateStr !== startDateStr) ? this.formatKhmerShortDate(endDateStr) : null;
    const resumeDateKh = resumeDateStr ? this.formatKhmerShortDate(resumeDateStr) : (holiday.resumeDateFormatted || "ថ្ងៃបន្ទាប់");

    const breakPeriodKh = endDateKh ? `ពីថ្ងៃទី ${startDateKh} ដល់ថ្ងៃទី ${endDateKh}` : `នៅថ្ងៃទី ${startDateKh}`;

    const customNote = options.note || holiday.note || "សូមប្អូនៗសិស្សានុសិស្សឆ្លៀតពេលរំលឹកមេរៀន រូបមន្តកុំព្យូទ័រ និងធ្វើដំណើរប្រកបដោយសុវត្ថិភាព!";

    // Telegram Rich HTML Message
    const msg = `🇰🇭 <b>សេចក្តីជូនដំណឹងស្តីពីការឈប់សម្រាកបុណ្យជាតិ</b> 🇰🇭\n` +
      `🏢 <b>${branding.schoolNameKh}</b>\n\n` +
      `📢 <b>ជម្រាបជូន៖</b> ${shiftScopeKh}\n\n` +
      `សាលាសូមជម្រាបជូនដំណឹងដល់ប្អូនៗសិស្សានុសិស្ស និងលោកអ្នកអាណាព្យាបាលឱ្យបានជ្រាបថា ដោយសារក្នុងឱកាស <b>«${holiday.title}»</b> ខាងមុខនេះ ថ្នាក់កុំព្យូទ័រទាំងអស់នឹងត្រូវ៖\n\n` +
      `🛑 <b>ផ្អាកការបង្រៀន និងអនុវត្ត៖</b> ${breakPeriodKh}\n` +
      `🚀 <b>ចូលរៀនឡើងវិញនៅ៖</b> <b>${resumeDateKh}</b> តាមម៉ោង និងវេនសិក្សាធម្មតា\n\n` +
      `💡 <b>សារដាស់តឿន៖</b> ${customNote}\n\n` +
      `🙏 សាលាសូមប្រសិទ្ធពរបវរសួស្តី សុខភាពល្អ និងការធ្វើដំណើរប្រកបដោយសុវត្ថិភាពគ្រប់ទីកន្លែង! 🌟✨\n\n` +
      `✍️ <b>គ្រូទទួលបន្ទុក៖</b> ${branding.teacherTitle}\n` +
      `📞 <b>ទំនាក់ទំនង៖</b> <code>${branding.phone || '071 721 0307'}</code>`;

    const res = await TelegramService.broadcastToShifts(targetShift, msg);

    if (res && res.success) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`🎉 បានផ្សាយដំណឹងឈប់សម្រាក «${holiday.title}» ទៅកាន់ Telegram ជោគជ័យ (${res.sentCount} គ្រុប)!`, "success");
        if (App.triggerConfetti) App.triggerConfetti();
      }
      return true;
    } else {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`⚠️ មិនអាចផ្ញើសារទៅកាន់ Telegram បានទេ៖ ${res?.error || 'សូមពិនិត្យ Chat ID'}`, "error");
      }
      return false;
    }
  },

  // ------------------------------------------------------------------------
  // PRINT OFFICIAL A4 HOLIDAY ANNOUNCEMENT NOTICE (បិទមុខបន្ទប់ Lab)
  // ------------------------------------------------------------------------
  printHolidayNoticeA4(holiday, options = {}) {
    const branding = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.getSchoolBranding)
      ? TeacherToolsService.getSchoolBranding()
      : { schoolNameKh: "មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS Lab", teacherTitle: "លោកគ្រូ ខៀន ធូ", phone: "097 508 2743" };

    const startDateStr = options.startDate || holiday.dateStr;
    const endDateStr = options.endDate || holiday.endDate || holiday.dateStr;
    const resumeDateStr = options.resumeDate || holiday.resumeDate;

    const startDateKh = this.formatKhmerShortDate(startDateStr);
    const endDateKh = (endDateStr && endDateStr !== startDateStr) ? this.formatKhmerShortDate(endDateStr) : null;
    const resumeDateKh = resumeDateStr ? this.formatKhmerShortDate(resumeDateStr) : (holiday.resumeDateFormatted || "ថ្ងៃបន្ទាប់");
    const breakPeriodKh = endDateKh ? `ពីថ្ងៃទី ${startDateKh} ដល់ថ្ងៃទី ${endDateKh}` : `នៅថ្ងៃទី ${startDateKh}`;

    const html = `
      <div style="font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 40px; color: #0f172a; max-width: 750px; margin: 0 auto; border: 12px double #1e1b4b; background: #fff; min-height: 900px; box-sizing: border-box; position: relative;">
        <!-- Watermark / Background Texture -->
        <div style="text-align: center; border-bottom: 2px solid #1e1b4b; padding-bottom: 16px; margin-bottom: 30px;">
          <div style="font-size: 1.1rem; font-weight: 800; color: #1e1b4b; letter-spacing: 1px;">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div style="font-size: 0.95rem; font-weight: 700; color: #4338ca;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div style="font-size: 1.3rem; margin-top: 6px; color: #d97706;">🇰🇭</div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #1e1b4b;">${branding.schoolNameKh}</div>
            <div style="font-size: 0.85rem; color: #64748b;">ផ្នែកបណ្តុះបណ្តាលបច្ចេកវិទ្យាកុំព្យូទ័រ Lab</div>
          </div>
          <div style="text-align: right; font-size: 0.85rem; color: #64748b;">
            <div>កាលបរិច្ឆេទ៖ ${this.formatKhmerFullDate(new Date())}</div>
            <div>លេខ៖ <strong>${this.toKhmerNum(new Date().getMonth() + 1)}/TIS/LAB</strong></div>
          </div>
        </div>

        <!-- Big Official Title -->
        <div style="text-align: center; margin: 35px 0 25px 0;">
          <h1 style="margin: 0; font-size: 1.7rem; font-weight: 900; color: #b91c1c; text-decoration: underline; text-underline-offset: 8px;">
            សេចក្តីជូនដំណឹង
          </h1>
          <h3 style="margin: 12px 0 0 0; font-size: 1.25rem; font-weight: 800; color: #1e1b4b;">
            ស្តីពីការឈប់សម្រាកក្នុងឱកាស «${holiday.title}»
          </h3>
        </div>

        <!-- Body Content -->
        <div style="font-size: 1.05rem; line-height: 2; text-align: justify; margin-bottom: 30px; text-indent: 40px;">
          មជ្ឈមណ្ឌលកុំព្យូទ័រ <strong>${branding.schoolNameKh}</strong> សូមជម្រាបជូនដំណឹងដល់ប្អូនៗសិស្សានុសិស្សគ្រប់វេនសិក្សាទាំងអស់ (វេនព្រឹក ថ្ងៃ និងរសៀល) ព្រមទាំងលោក-លោកស្រីអាណាព្យាបាលសិស្សឱ្យបានជ្រាបថា៖ ក្នុងឱកាសបុណ្យជាតិ <strong>«${holiday.title}»</strong> ខាងមុខនេះ ថ្នាក់កុំព្យូទ័រនឹងត្រូវផ្អាកដំណើរការបង្រៀនជាបណ្តោះអាសន្ន។
        </div>

        <!-- Highlight Box -->
        <div style="background: #f8fafc; border: 2.5px solid #1e1b4b; border-radius: 12px; padding: 22px 26px; margin-bottom: 30px;">
          <div style="font-size: 1.1rem; font-weight: 800; color: #dc2626; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>🛑 កាលបរិច្ឆេទផ្អាកការសិក្សា៖</span>
            <span style="color: #0f172a;">${breakPeriodKh}</span>
          </div>
          <div style="font-size: 1.15rem; font-weight: 800; color: #059669; display: flex; align-items: center; gap: 8px;">
            <span>🚀 ចូលរៀនឡើងវិញនៅថ្ងៃ៖</span>
            <span style="color: #1e1b4b; text-decoration: underline;">${resumeDateKh}</span>
            <span style="font-size: 0.9rem; color: #64748b; font-weight: normal;">(តាមម៉ោង និងវេនសិក្សាធម្មតា)</span>
          </div>
        </div>

        <div style="font-size: 1rem; line-height: 1.9; margin-bottom: 40px;">
          អាស្រ័យហេតុនេះ សូមប្អូនៗសិស្សានុសិស្ស និងលោកអ្នកអាណាព្យាបាលជ្រាបជាព័ត៌មាន និងរៀបចំពេលវេលាឱ្យបានសមស្រប។ សាលាសូមប្រសិទ្ធពរបវរសួស្តី សិរីមង្គល និងសុវត្ថិភាពក្នុងការធ្វើដំណើរគ្រប់ពេលវេលា។
        </div>

        <!-- Footer Signatures -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px;">
          <div>
            <div style="font-size: 0.82rem; color: #64748b;">
              កន្លែងទទួល៖<br>
              - គ្រប់សិស្សានុសិស្ស (វេនព្រឹក • ថ្ងៃ • រសៀល)<br>
              - បិទមុខបន្ទប់ Lab PC-01 ដល់ PC-16<br>
              - រក្សាទុកជាឯកសារ
            </div>
          </div>
          <div style="text-align: center; min-width: 220px; position: relative;">
            <div style="font-size: 0.9rem; margin-bottom: 75px;">គ្រូទទួលបន្ទុកបន្ទប់កុំព្យូទ័រ</div>
            ${branding.stampImageUrl ? `<img src="${branding.stampImageUrl}" style="position: absolute; left: 15px; bottom: 10px; width: 85px; height: 85px; opacity: 0.85;" alt="Seal">` : ''}
            ${branding.signatureImageUrl ? `<img src="${branding.signatureImageUrl}" style="position: absolute; right: 25px; bottom: 25px; width: 110px; height: 50px;" alt="Signature">` : ''}
            <div style="font-weight: 800; font-size: 1.1rem; color: #1e1b4b;">${branding.teacherTitle}</div>
          </div>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>សេចក្តីជូនដំណឹងឈប់សម្រាក - ${holiday.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800;900&family=Battambang:wght@400;700&display=swap" rel="stylesheet">
        <style>@page { size: A4; margin: 0; } body { margin: 0; background: #fff; }</style>
      </head>
      <body>
        ${html}
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `);
    win.document.close();
  },

  // ------------------------------------------------------------------------
  // PRINT ANNUAL HOLIDAYS SCHEDULE A4 TABLE
  // ------------------------------------------------------------------------
  printAnnualHolidaysScheduleA4(year = new Date().getFullYear()) {
    const holidays = this.getHolidaysForYear(year);
    const branding = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.getSchoolBranding)
      ? TeacherToolsService.getSchoolBranding()
      : { schoolNameKh: "TIS Lab Computer", teacherTitle: "លោកគ្រូ ខៀន ធូ" };

    const rows = holidays.map((h, idx) => {
      const typeBadge = h.type === "national" ? "បុណ្យជាតិ" : (h.type === "cultural" ? "ប្រពៃណី/សាសនា" : (h.type === "royal" ? "ព្រះរាជពិធី" : "សាលា"));
      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 9px; text-align: center; font-weight: 700;">${this.toKhmerNum(idx + 1)}</td>
          <td style="padding: 9px; font-weight: 700; color: #1e1b4b;">${this.formatKhmerShortDate(h.dateStr)}</td>
          <td style="padding: 9px; font-weight: 700;">${h.icon || '🇰🇭'} ${h.title}</td>
          <td style="padding: 9px; font-size: 0.8rem; color: #475569;">${h.titleEn || ''}</td>
          <td style="padding: 9px; text-align: center;"><span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; background: #e0e7ff; color: #3730a3; font-weight: 700;">${typeBadge}</span></td>
        </tr>
      `;
    }).join("");

    const html = `
      <div style="font-family: 'Kantumruy Pro', 'Battambang', sans-serif; padding: 30px; color: #0f172a; max-width: 800px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 1.3rem; font-weight: 900; color: #1e1b4b;">${branding.schoolNameKh}</h2>
            <div style="font-size: 1.05rem; font-weight: 700; color: #4338ca;">តារាងកាលវិភាគថ្ងៃឈប់សម្រាកបុណ្យជាតិប្រចាំឆ្នាំ ${this.toKhmerNum(year)}</div>
          </div>
          <div style="text-align: right; font-size: 0.82rem; color: #64748b;">
            <div>សរុបថ្ងៃឈប់សម្រាក៖ <strong>${this.toKhmerNum(holidays.length)} ថ្ងៃ</strong></div>
            <div>កាលបរិច្ឆេទចេញ៖ ${this.formatKhmerFullDate(new Date())}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 30px;">
          <thead>
            <tr style="background: #1e1b4b; color: #fff;">
              <th style="padding: 10px; width: 45px; text-align: center;">ល.រ</th>
              <th style="padding: 10px; width: 140px; text-align: left;">កាលបរិច្ឆេទ</th>
              <th style="padding: 10px; text-align: left;">ឈ្មោះបុណ្យជាតិ & ពិធីបុណ្យ</th>
              <th style="padding: 10px; text-align: left;">ឈ្មោះជាភាសាអង់គ្លេស</th>
              <th style="padding: 10px; width: 100px; text-align: center;">ប្រភេទ</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; font-size: 0.85rem;">
          <div style="color: #64748b;">
            * ប្រតិទិននេះត្រូវបានរៀបចំស្របតាមអនុក្រឹត្យរបស់រាជរដ្ឋាភិបាលកម្ពុជា និងកាលវិភាគ TIS Lab Computer
          </div>
          <div style="text-align: center; min-width: 180px;">
            <div style="margin-bottom: 45px;">រៀបចំដោយ</div>
            <div style="font-weight: 800; color: #1e1b4b;">${branding.teacherTitle}</div>
          </div>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ប្រតិទិនបុណ្យជាតិ ${year}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Battambang:wght@400;700&display=swap" rel="stylesheet">
        <style>@page { size: A4; margin: 10mm; } body { margin: 0; background: #fff; }</style>
      </head>
      <body>
        ${html}
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `);
    win.document.close();
  }
};

// Export to window
window.KhmerCalendarService = KhmerCalendarService;

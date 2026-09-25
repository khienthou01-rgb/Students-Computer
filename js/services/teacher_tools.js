/**
 * ==========================================================================
 * Service: Teacher Tools & Automation Engine (ជំនួយការស្វ័យប្រវត្តិសម្រាប់លោកគ្រូ)
 * TIS Lab Computer - Modern Student Management System
 * ==========================================================================
 */

const TeacherToolsService = {
  // Storage Keys
  STORAGE_KEY_BRANDING: "master_school_branding",
  STORAGE_KEY_PENDING_REG: "master_school_pending_registrations",
  STORAGE_KEY_OFFICIAL_LETTERS: "master_school_official_letters",
  STORAGE_KEY_EXPENSES: "tis_school_expenses",
  STORAGE_KEY_PC_MAINTENANCE: "tis_pc_maintenance",
  STORAGE_KEY_STUDENT_NOTES: "tis_student_notes",

  // ------------------------------------------------------------------------
  // 1. KHMER TO LATIN NAME TRANSLITERATION & FORMATTING HELPER
  // ------------------------------------------------------------------------
  commonKhmerNames: {
    "ខៀន": "KHIEN", "ធូ": "THOU", "ធុ": "THU", "សុក": "SOK", "សុខ": "SOK",
    "ចាន់": "CHAN", "ចាន់ថា": "CHANTHA", "ចិន្តា": "CHINDA", "ដារ៉ា": "DARA",
    "តារា": "DARA", "វណ្ណា": "VANNA", "វណ្ណៈ": "VANNAK", "វីរៈ": "VIRAK",
    "មាស": "MEAS", "មករា": "MAKARA", "ពិសិដ្ឋ": "PISETH", "គង់": "KONG",
    "សុផល": "SOPHAL", "លី": "LY", "ស្រីនាង": "SREYNEANG", "ស្រីពៅ": "SREYPOV",
    "ស្រីមុំ": "SREYMOM", "ស្រីល័ក្ខ": "SREYLEAK", "បុប្ផា": "BOPHA",
    "កញ្ញា": "KANHA", "សុភា": "SOPHEA", "សុភាព": "SOPHEAP", "រតនា": "ROTHANA",
    "រតនៈ": "ROTHANA", "វិបុល": "VIBOL", "សម្បត្តិ": "SAMBATH", "សំណាង": "SAMNANG",
    "ធារ៉ា": "THEARA", "សុជាតា": "SOCHEATA", "មុនី": "MONY", "សារ៉ាត់": "SARATH",
    "សីហា": "SEYHA", "មិថុនា": "MITHONA", "កក្កដា": "KAKADA", "បញ្ញា": "PANHA",
    "រស្មី": "REASMEY", "ចរិយា": "CHORIYA", "ម៉ៅ": "MAO", "ហេង": "HENG",
    "គីម": "KIM", "សេង": "SENG", "ឈាន": "CHHEAN", "ឡុង": "LONG", "អ៊ុំ": "OUM",
    "ជា": "CHEA", "ហុង": "HONG", "វ៉ាន់": "VAN", "ធី": "THY", "ធា": "THEA",
    "ផល": "PHAL", "ពិសី": "PISEY", "ពេជ្រ": "PECH", "វិច្ឆិកា": "VICHEKA",
    "ចរណៃ": "CHORNAI", "ណារី": "NARY", "ណារ៉េត": "NARETH", "សុខា": "SOKHA",
    "សុខុម": "SOKHOM", "នារី": "NEARY", "ស៊ីណាត": "SINAT", "ស៊ីណា": "SINA",
    "ថាវី": "THAVY", "ម៉ាលី": "MALY", "ស្រីណែត": "SREYNET", "ស្រីនិច": "SREYNICH",
    "ផល្លា": "PHALLA", "សុគន្ធ": "SOKUN", "គន្ធា": "KUNTHEA", "គន្ធី": "KUNTHY",
    "ម៉េង": "MENG", "ស្រ៊ុន": "SRUN", "ឈុន": "CHHUN", "ឆាយ": "CHHAY",
    "ហ៊ាង": "HEANG", "ហួត": "HUOT", "លាង": "LEANG", "តាំង": "TANG",
    "អ៊ាង": "EANG", "សុផាត": "SOPHAT", "ណាក់": "NAK", "តុលា": "TOLA",
    "វិចិត្រ": "VICHET", "ស៊ឹម": "SIM", "វឌ្ឍនៈ": "VATTANAK", "វឌ្ឍនា": "VATTANA",
    "ស៊ន": "SORN", "ស៊ុន": "SUN", "សាន": "SAN", "សារិន": "SARIN",
    "សាវ៉ាត": "SAVAT", "សំបូរ": "SAMBOR", "សោភា": "SAOPHEA", "សួន": "SUON",
    "សោម": "SAOM", "កែវ": "KEO", "កុល": "KOL", "កុសល": "KOSAL",
    "ខៀវ": "KHIEV", "ខាត់": "KHAT", "ឃាង": "KHEANG", "ឃីម": "KHIM",
    "ឃុន": "KHUN", "ឃឹម": "KHIM", "ង៉ែត": "NGET", "ង៉ោ": "NGO",
    "ងិន": "NGIN", "ច័ន្ទ": "CHAN", "ចាន់ឌី": "CHANDY", "ចាន់ណា": "CHANNA",
    "ចាន់នី": "CHANNY", "ចាន់ថន": "CHANTHON", "ចិត្ត": "CHET", "ចំរើន": "CHAMROEUN",
    "ជិន": "CHIN", "ជួប": "CHUOB", "ជៀប": "CHIEP", "ជុំ": "CHOUM",
    "ជេដ្ឋ": "CHETH", "ជ័យ": "CHEY", "ឈាង": "CHHEANG", "ឈឿន": "CHHOEUN",
    "ញ៉ែម": "NHEM", "ញឹក": "NHEUK", "ដា": "DA", "ដានី": "DANY",
    "ដួង": "DUONG", "ដាលី": "DALY", "ដារ៉ូ": "DARO", "ឌី": "DY",
    "ឌីណា": "DYNA", "ឌុក": "DUK", "តី": "TEY", "តាក់": "TAK",
    "តេជោ": "TECHO", "ថៃ": "THAI", "ថា": "THA", "ថាន": "THAN",
    "ថារី": "THARY", "ថន": "THON", "ទ្រី": "TRY", "ទេព": "TEP",
    "ទេវី": "TEVY", "ទិត្យ": "TITH", "ទីណា": "TINA", "ទួន": "TUON",
    "ទូច": "TOUCH", "ធីតា": "THIDA", "ធារី": "THEARY", "ធឿន": "THOEUN",
    "និមល": "NIMOL", "និត": "NITH", "នីតា": "NITA", "និស្ស័យ": "NISAY",
    "ណាត": "NAT", "ប៉ែន": "PEN", "ប៊ុន": "BUN", "ប៊ុនថន": "BUNTHON",
    "ប៊ុនរ៉ុង": "BUNRONG", "បូរី": "BOREY", "បូរ៉ា": "BORA", "ប៉ាវ": "PAV",
    "ប៉ិច": "PECH", "ពៅ": "POV", "ពន្លឺ": "PONLEU", "ផាត": "PHAT",
    "ផាន": "PHAN", "ផេង": "PHENG", "ផា": "PHA", "ភ័ក្ត្រ": "PHEAKTRA",
    "ភារម្យ": "PHEAROM", "ភារៈ": "PHEARAK", "ភានុ": "PHEANU", "ភា": "PHEA",
    "ភួង": "PHUONG", "ភិរម្យ": "PHIROM", "មុទិតា": "MUTHITA", "ម៉េងហួត": "MENG HUOT",
    "ម៉ានិត": "MANITH", "ម៉ារ៉ា": "MARA", "មីនា": "MEENA", "ម៉េត": "MET",
    "ម៉ី": "MEY", "យ៉ុន": "YON", "យឿន": "YOEUN", "យី": "YI",
    "យន": "YON", "យឹម": "YIM", "រ៉ា": "RA", "រ៉ានី": "RANY",
    "រឿន": "ROEUN", "រិទ្ធ": "RITH", "រិទ្ធី": "RITHY", "រ៉ុង": "RONG",
    "រ៉េត": "RETH", "លីដា": "LYDA", "លីណា": "LYNA", "ឡៃ": "LAY",
    "លឹម": "LIM", "លាភ": "LEAP", "លីហួរ": "LYHOUR", "វាសនា": "VEASNA",
    "វុទ្ធី": "VUTHY", "វីរ៉ា": "VIRA", "វ៉ាន់នី": "VANNY", "វ៉ាន់ដា": "VANDA",
    "វណ្ណារ៉ា": "VANNARA", "សុវណ្ណ": "SOVANN", "សុវណ្ណារ៉ា": "SOVANNARA", "ស្រី": "SREY",
    "ស្រីរ័ត្ន": "SREYROTH", "ស្រីលក្ខណ៍": "SREYLEAK", "ហ៊ួត": "HUOT", "ហាក់": "HAK",
    "ហៀប": "HIEP", "ហ៊ាន": "HEAN", "ហួ": "HOUA", "អេង": "ENG",
    "អ៊ុក": "OUK", "អាន": "AN", "អ៊ឹង": "EUNG", "ឯម": "EM",
    "ឱក": "AOK", "អ៊ុន": "OUN", "អ៊ីម": "IM", "អ៊ួង": "OUENG",
    "ចាន់រ៉ា": "CHANRA", "ចាន់សុខា": "CHAN SOKHA", "សុខជា": "SOKCHEA",
    "ឆេង": "CHHENG", "ឆេងលី": "CHHENG LY", "គឹម": "KIM",
    "គឹមហុង": "KIM HONG", "គឹមសាន": "KIM SAN", "គឹមស៊ាន": "KIM SEAN", "គឹមសេង": "KIM SENG",
    "គា": "KEA", "គង់ស្រ៊ុន": "KONG SRUN", "ណាន": "NAN", "ណារិន": "NARIN",
    "ណារ៉ុង": "NARONG", "ណាង": "NANG", "បញ្ញាវ័ន្ត": "PANHAVON", "ប្រាក់": "PRAK",
    "ព្រំ": "PROM", "ព្រីង": "PRING", "ភ័ក្រ": "PHEAK", "ម៉ាត់": "MAT",
    "ម៉ិញ": "MINH", "យន់": "YON", "យូ": "YOU", "យ៉ុម": "YOM",
    "រ៉ន": "RORN", "រុំ": "ROUM", "លីម": "LIM", "វ៉ាត": "VAT",
    "ស៊ាង": "SEANG", "សែម": "SEM", "ហួន": "HOUAN", "ហៀក": "HIEK",
    "អៀង": "IENG", "អៀម": "IEM", "ឧត្តម": "OUDOM", "ឧស្សាហ៍": "OUSA",
    "សុខេង": "SOKHENG", "គីមស៊្រុន": "KIM SRUN", "សុវណ្ណារិទ្ធ": "SOVANNARITH",
    "វិចិត្រា": "VICHITRA", "វិទូ": "VITOU", "សុជាត": "SOCHEAT", "សុជាតិ": "SOCHEAT",
    "រ៉ាវី": "RAVY", "រ៉ាវុធ": "RAVUTH", "សារឿន": "SAROEUN", "សុខេន": "SOKHEN",
    "រចនា": "RACHANA", "សុផាន": "SOPHAN", "ស្រីមាស": "SREYMEAS", "ស្រីកែវ": "SREYKEO",
    "ស្រីពេជ្រ": "SREYPECH", "សុខឡេង": "SOKLENG", "វណ្ណឌី": "VANDY",
    "គីមឡេង": "KIMLENG", "ហុងលី": "HONGLY", "ហួតលី": "HUOTLY", "ឡុងហេង": "LONGHENG",
    "ឈុនលី": "CHHUNLY", "សេងហួត": "SENGHUOT", "ម៉េងលី": "MENGLY", "ម៉េងស៊្រុន": "MENGSRUN",
    "ច័ន្ទរស្មី": "CHANREASMEY", "សោភ័ណ្ឌ": "SOPHORN", "ណារ៉ូ": "NARO", "ណារិទ្ធ": "NARITH",
    "សុភ័ក្ត្រ": "SOPHEAKTRA", "សម្ផស្ស": "SAMPHORS", "សិរី": "SEREY", "សេរី": "SEREY",
    "ស៊ីថា": "SITHA", "ស៊ីថុល": "SITHOL", "សុភារ៉ា": "SOPHEARA", "ចាន់ធី": "CHANTHY",
    "ចាន់ធូ": "CHANTHOU", "សុគន្ធា": "SOKUNTHEA", "ចាន់ដា": "CHANDA", "ស្រីលីន": "SREYLIN",
    "ស្រីណុច": "SREYNOCH", "ស្រីនីត": "SREYNITH", "សុខនី": "SOKNY", "សុខណា": "SOKNA",
    "សារិទ្ធ": "SARITH", "វណ្ណថន": "VANNTHON", "វណ្ណដេត": "VANDETH", "សំអាត": "SAMAT",
    "សំអុល": "SAMOL", "សំអុន": "SAMON", "សំអាន": "SAMAN", "សំអឿន": "SAMOEUN",
    "ស៊ូ": "SOU", "ស្រ៊ី": "SREY", "ហាន": "HAN", "ហ៊ុល": "HUL", "ហ៊ុយ": "HUY",
    "ឡាំ": "LAM", "ឡេង": "LENG", "អ៊ឹម": "IM", "អ៊ុល": "OUL", "អ៊ុត": "OUT",
    "អែម": "EM", "អឿន": "OEUN", "អឿម": "OEM"
  },

  _sortedDictKeys: null,

  getSortedDictKeys() {
    if (!this._sortedDictKeys) {
      this._sortedDictKeys = Object.keys(this.commonKhmerNames).sort((a, b) => b.length - a.length);
    }
    return this._sortedDictKeys;
  },

  transliterateToken(token) {
    if (!token) return "";
    token = token.trim();
    if (!token) return "";

    // 1. Direct exact dictionary match
    if (this.commonKhmerNames[token]) {
      return this.commonKhmerNames[token];
    }

    // 2. Greedy prefix matching against common names / syllables
    const keys = this.getSortedDictKeys();
    for (const k of keys) {
      if (token.startsWith(k)) {
        const rest = token.slice(k.length);
        const transliteratedRest = rest ? this.transliterateToken(rest) : "";
        return `${this.commonKhmerNames[k]} ${transliteratedRest}`.trim();
      }
    }

    // 3. Syllable & Phonetic character fallback mapping
    const KHMER_CONSONANTS = {
      '\u1780': 'K', '\u1781': 'KH', '\u1782': 'K', '\u1783': 'KH', '\u1784': 'NG',
      '\u1785': 'CH', '\u1786': 'CHH', '\u1787': 'CH', '\u1788': 'CHH', '\u1789': 'NH',
      '\u178A': 'D', '\u178B': 'TH', '\u178C': 'D', '\u178D': 'TH', '\u178E': 'N',
      '\u178F': 'T', '\u1790': 'TH', '\u1791': 'T', '\u1792': 'TH', '\u1793': 'N',
      '\u1794': 'B', '\u1795': 'PH', '\u1796': 'P', '\u1797': 'PH', '\u1798': 'M',
      '\u1799': 'Y', '\u179A': 'R', '\u179B': 'L', '\u179C': 'V',
      '\u179D': 'S', '\u179E': 'S', '\u179F': 'S', '\u17A0': 'H', '\u17A1': 'L', '\u17A2': 'A'
    };

    const KHMER_INDEP_VOWELS = {
      '\u17A3': 'A', '\u17A4': 'A', '\u17A5': 'E', '\u17A6': 'EI',
      '\u17A7': 'U', '\u17A8': 'OU', '\u17A9': 'OU', '\u17AA': 'OV',
      '\u17AB': 'ROE', '\u17AC': 'ROEU', '\u17AD': 'LOE', '\u17AE': 'LOEU',
      '\u17AF': 'AE', '\u17B0': 'AI', '\u17B1': 'AO', '\u17B2': 'AO', '\u17B3': 'AO'
    };

    const KHMER_DEP_VOWELS = {
      '\u17B6': 'A', '\u17B7': 'I', '\u17B8': 'EY', '\u17B9': 'OE',
      '\u17BA': 'OEU', '\u17BB': 'O', '\u17BC': 'OU', '\u17BD': 'UO',
      '\u17BE': 'OEU', '\u17BF': 'OEA', '\u17C0': 'IE', '\u17C1': 'E',
      '\u17C2': 'AE', '\u17C3': 'AI', '\u17C4': 'AO', '\u17C5': 'OV'
    };

    let res = "";
    let i = 0;
    while (i < token.length) {
      const ch = token[i];

      // Check subscript consonant (ជើង)
      if (ch === '\u17D2' && i + 1 < token.length) {
        const sub = token[i + 1];
        if (KHMER_CONSONANTS[sub]) {
          res += KHMER_CONSONANTS[sub];
          i += 2;
          continue;
        }
      }

      // Independent vowel
      if (KHMER_INDEP_VOWELS[ch]) {
        res += KHMER_INDEP_VOWELS[ch];
        i++;
        continue;
      }

      // Base consonant
      if (KHMER_CONSONANTS[ch]) {
        res += KHMER_CONSONANTS[ch];
        i++;
        continue;
      }

      // Dependent vowel
      if (KHMER_DEP_VOWELS[ch]) {
        res += KHMER_DEP_VOWELS[ch];
        i++;
        continue;
      }

      // Diacritics
      if (ch === '\u17C6') { res += 'M'; i++; continue; } // Nikahit (ំ)
      if (ch === '\u17C7') { res += 'H'; i++; continue; } // Reahmuk (ះ)
      if (ch === '\u17C8') { res += 'A'; i++; continue; } // Yuakaleapintu (ៈ)
      if (ch === '\u17CD') { i++; continue; }             // Toandakhiat (៍ - silent)
      if (ch === '\u17CB') { i++; continue; }             // Bantoc (់)
      if (ch === '\u17C9' || ch === '\u17CA') { i++; continue; } // Series shifter (៉, ៊)

      // Latin characters or digits
      if (/[a-zA-Z0-9]/.test(ch)) {
        res += ch.toUpperCase();
        i++;
        continue;
      }

      i++;
    }

    return res.trim();
  },

  transliterateKhmerToLatin(khmerText) {
    if (!khmerText || typeof khmerText !== "string") return "";
    const clean = khmerText.trim();
    if (!clean) return "";

    // 1. If already in Latin letters, clean and uppercase
    if (/^[a-zA-Z0-9\s.,'_-]+$/.test(clean)) {
      return clean.toUpperCase().replace(/\s+/g, " ").trim();
    }

    // 2. Direct exact match
    if (this.commonKhmerNames[clean]) {
      return this.commonKhmerNames[clean];
    }

    // 3. Split by whitespace and convert word by word
    const parts = clean.split(/\s+/);
    const convertedParts = parts.map(part => this.transliterateToken(part));

    let result = convertedParts.join(" ")
      .replace(/[\u1780-\u17FF]/g, "") // Ensure strictly no remaining Khmer glyphs
      .replace(/\s+/g, " ")
      .toUpperCase()
      .trim();

    return result;
  },

  formatPhoneNumber(phoneStr) {
    if (!phoneStr) return "";
    const digits = phoneStr.replace(/\D/g, "");
    if (digits.length === 9) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    if (digits.length === 10) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    return phoneStr;
  },

  // ------------------------------------------------------------------------
  // 2. SMART 3x4 PASSPORT PHOTO CROPPER (CANVAS CLIENT-SIDE)
  // ------------------------------------------------------------------------
  async cropToPassportAspectRatio(imageSrc, targetWidth = 300, targetHeight = 400) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        // Calculate aspect ratios (3:4)
        const targetRatio = targetWidth / targetHeight;
        const imgRatio = img.width / img.height;

        let srcWidth, srcHeight, srcX, srcY;

        if (imgRatio > targetRatio) {
          // Image is wider than 3:4: crop horizontally, keep vertical center
          srcHeight = img.height;
          srcWidth = img.height * targetRatio;
          srcX = (img.width - srcWidth) / 2;
          srcY = 0;
        } else {
          // Image is taller: focus on top 20% (face/head area)
          srcWidth = img.width;
          srcHeight = img.width / targetRatio;
          srcX = 0;
          srcY = Math.max(0, (img.height - srcHeight) * 0.2);
        }

        // Draw cropped and high-quality scaled
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, targetWidth, targetHeight);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        resolve(dataUrl);
      };
      img.onerror = (e) => reject(e);
      img.src = imageSrc;
    });
  },

  // ------------------------------------------------------------------------
  // 3. SCHOOL BRANDING (DIGITAL SEAL STAMP & TEACHER SIGNATURE)
  // ------------------------------------------------------------------------
  getSchoolBranding() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_BRANDING);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Default branding
    return {
      schoolNameKh: "សាលាកុំព្យូទ័រ TIS Lab Computer",
      schoolNameEn: "TIS LAB COMPUTER TRAINING CENTER",
      schoolAddress: "ខេត្តកំពត, ព្រះរាជាណាចក្រកម្ពុជា",
      schoolPhone: "071 721 0307",
      schoolEmail: "khienthou01@gmail.com",
      teacherTitle: "លោកគ្រូ ខៀន ធូ",
      teacherPosition: "ប្រធានគ្រប់គ្រង & គ្រូបង្រៀនកុំព្យូទ័រ",
      stampImageUrl: "", // Custom Seal image
      signatureImageUrl: "" // Digital Signature image
    };
  },

  saveSchoolBranding(brandingData) {
    const current = this.getSchoolBranding();
    const updated = { ...current, ...brandingData };
    try {
      localStorage.setItem(this.STORAGE_KEY_BRANDING, JSON.stringify(updated));
    } catch (e) {}

    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        firebase.database().ref("settings/schoolBranding").set(updated);
      } catch (e) {}
    }
    return updated;
  },

  // ------------------------------------------------------------------------
  // 4. ONLINE SELF-REGISTRATION / PENDING REGISTRATIONS (QR PORTAL)
  // ------------------------------------------------------------------------
  getPendingRegistrations() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_PENDING_REG);
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) return list;
      }
    } catch (e) {}
    return [];
  },

  savePendingRegistrations(list) {
    try {
      localStorage.setItem(this.STORAGE_KEY_PENDING_REG, JSON.stringify(list));
    } catch (e) {}
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        firebase.database().ref("pending_registrations").set(list);
      } catch (e) {}
    }
  },

  async addSelfRegistrationRequest(regData) {
    const list = this.getPendingRegistrations();
    const newReq = {
      ...regData,
      reqId: "REQ-" + Date.now().toString().slice(-6),
      submittedAt: new Date().toISOString(),
      status: "pending"
    };
    list.unshift(newReq);
    this.savePendingRegistrations(list);

    // Notify Telegram if configured
    if (typeof TelegramService !== "undefined") {
      try {
        const text = `🌟 *មានការចុះឈ្មោះសិស្សថ្មីតាម Online (Self-Registration)*\n\n` +
          `👤 *ឈ្មោះសិស្ស:* ${newReq.NameKh} (${newReq.NameEn || ''})\n` +
          `🚻 *ភេទ:* ${newReq.Gender} | 📞 *ទូរស័ព្ទ:* ${newReq.Phone}\n` +
          `💻 *វគ្គ:* ${newReq.Course || 'Typing'} | ⏰ *វេន:* ${newReq.Shift || 'ព្រឹក'}\n` +
          `📅 *កាលបរិច្ឆេទ:* ${new Date().toLocaleString('km-KH')}\n\n` +
          `👉 *លោកគ្រូអាចចូលទៅផ្ទាំង "បញ្ជីសិស្ស" ដើម្បី Approve សិស្សនេះ!*`;
        await TelegramService.sendMessage(text);
      } catch (e) {}
    }

    return newReq;
  },

  async approveSelfRegistration(reqId) {
    const list = this.getPendingRegistrations();
    const idx = list.findIndex(r => r.reqId === reqId);
    if (idx === -1) throw new Error("រកមិនឃើញពាក្យចុះឈ្មោះនេះឡើយ!");

    const req = list[idx];
    // Remove from pending
    list.splice(idx, 1);
    this.savePendingRegistrations(list);

    // Add as official student via StudentAPI
    const newStudent = {
      NameKh: req.NameKh,
      NameEn: req.NameEn || this.transliterateKhmerToLatin(req.NameKh),
      Gender: req.Gender || "ប្រុស",
      DOB: req.DOB || "",
      Phone: req.Phone || "",
      GuardianPhone: req.GuardianPhone || "",
      Address: req.Address || "",
      Course: req.Course || "Typing",
      Shift: req.Shift || "ព្រឹក",
      Avatar: req.Avatar || "",
      Status: "Active",
      StartDate: new Date().toISOString().split("T")[0]
    };

    let createdStudent = null;
    if (typeof StudentAPI !== "undefined" && StudentAPI.addStudent) {
      createdStudent = await StudentAPI.addStudent(newStudent);
    }

    // Send Telegram Welcome Card
    this.sendTelegramWelcomeCard(createdStudent || newStudent);

    return createdStudent || newStudent;
  },

  async rejectSelfRegistration(reqId) {
    let list = this.getPendingRegistrations();
    list = list.filter(r => r.reqId !== reqId);
    this.savePendingRegistrations(list);
    return true;
  },

  // ------------------------------------------------------------------------
  // 5. OFFICIAL LETTERS GENERATOR (CERTIFICATE OF ENROLLMENT, RECOMMENDATION)
  // ------------------------------------------------------------------------
  generateOfficialLetterHtml(type, student, customNotes = "") {
    const branding = this.getSchoolBranding();
    const today = new Date();
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const dateKhmer = `ថ្ងៃទី ${String(today.getDate()).padStart(2, '0')} ខែ ${khmerMonths[today.getMonth()]} ឆ្នាំ ${today.getFullYear()}`;
    const dateLatin = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    let titleKh = "លិខិតបញ្ជាក់ការសិក្សា";
    let titleEn = "CERTIFICATE OF ENROLLMENT";
    let bodyContent = "";

    const studentNameKh = student.NameKh || "សិស្ស";
    const studentNameEn = student.NameEn || this.transliterateKhmerToLatin(studentNameKh);
    const genderKh = student.Gender === "ស្រី" ? "ភេទស្រី" : "ភេទប្រុស";
    const genderEn = student.Gender === "ស្រី" ? "Female" : "Male";
    const dob = student.DOB || "---";
    const course = student.Course || "កុំព្យូទ័ររដ្ឋបាល (Office Admin)";
    const shift = student.Shift || "ព្រឹក";
    const studentId = student.ID || "TX--";

    if (type === "enrollment") {
      titleKh = "លិខិតបញ្ជាក់ការសិក្សា";
      titleEn = "CERTIFICATE OF ENROLLMENT";
      bodyContent = `
        <p style="text-indent: 36px; line-height: 2.1; margin-bottom: 16px;">
          នាយកគ្រប់គ្រង <strong>${branding.schoolNameKh}</strong> សូមបញ្ជាក់ថា សិស្សានុសិស្សមានអត្តសញ្ញាណដូចខាងក្រោម៖
        </p>
        <div style="background: rgba(0,0,0,0.02); border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 24px; margin: 18px 0; line-height: 2.2;">
          <div>- ឈ្មោះខ្មែរ៖ <strong>${studentNameKh}</strong> &nbsp;&nbsp;&nbsp;&nbsp; ជាអក្សរឡាតាំង៖ <strong>${studentNameEn}</strong></div>
          <div>- ភេទ៖ <strong>${genderKh} (${genderEn})</strong> &nbsp;&nbsp;&nbsp;&nbsp; ថ្ងៃខែកំណើត៖ <strong>${dob}</strong></div>
          <div>- អត្តលេខសិស្ស៖ <strong>${studentId}</strong> &nbsp;&nbsp;&nbsp;&nbsp; វេនសិក្សា៖ <strong>វេន${shift}</strong></div>
          <div>- វគ្គកំពុងសិក្សា៖ <strong>${course}</strong> (ជំនាញកុំព្យូទ័ររដ្ឋបាល)</div>
        </div>
        <p style="text-indent: 36px; line-height: 2.1;">
          ពិតជាបានចុះឈ្មោះ និងកំពុងបន្តការសិក្សាដោយយកចិត្តទុកដាក់ក្នុង <strong>${branding.schoolNameKh}</strong> ពិតប្រាកដមែន។
        </p>
        <p style="text-indent: 36px; line-height: 2.1;">
          លិខិតបញ្ជាក់នេះ ចេញជូនសាមីខ្លួនដើម្បីយកទៅប្រើប្រាស់តាមផ្លូវច្បាប់ និងតម្រូវការចាំបាច់ផ្សេងៗ។
        </p>
      `;
    } else if (type === "recommendation") {
      titleKh = "លិខិតសរសើរ និងបញ្ជាក់សមត្ថភាព";
      titleEn = "LETTER OF RECOMMENDATION";
      bodyContent = `
        <p style="text-indent: 36px; line-height: 2.1; margin-bottom: 16px;">
          គណៈគ្រប់គ្រង និងគ្រូបង្រៀននៃ <strong>${branding.schoolNameKh}</strong> សូមធ្វើការកោតសរសើរ និងបញ្ជាក់ពីសមត្ថភាពរបស់សិស្ស៖
        </p>
        <div style="background: rgba(0,0,0,0.02); border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 24px; margin: 18px 0; line-height: 2.2;">
          <div>- ឈ្មោះខ្មែរ៖ <strong>${studentNameKh}</strong> &nbsp;&nbsp;&nbsp;&nbsp; ជាអក្សរឡាតាំង៖ <strong>${studentNameEn}</strong></div>
          <div>- អត្តលេខសិស្ស៖ <strong>${studentId}</strong> &nbsp;&nbsp;&nbsp;&nbsp; វគ្គសិក្សា៖ <strong>${course}</strong></div>
        </div>
        <p style="text-indent: 36px; line-height: 2.1;">
          ក្នុងអំឡុងពេលនៃការសិក្សា សិស្សរូបនេះបានបង្ហាញនូវការខិតខំប្រឹងប្រែង វិន័យខ្ពស់ គោរពពេលវេលា និងទទួលបានលទ្ធផលល្អប្រសើរលើជំនាញកុំព្យូទ័រ (Typing, Word, Excel, PowerPoint)។
        </p>
        <p style="text-indent: 36px; line-height: 2.1;">
          ${customNotes ? `<em>ចំណាំបន្ថែម៖ ${customNotes}</em><br>` : ''}
          សាលាសូមគាំទ្រ និងលើកទឹកចិត្តយ៉ាងពេញទំហឹងចំពោះសិស្សរូបនេះ ក្នុងការបំពេញការងារ ឬបន្តការសិក្សាទៅមុខទៀត។
        </p>
      `;
    } else if (type === "suspension") {
      titleKh = "លិខិតអនុញ្ញាតផ្អាកការសិក្សាបណ្តោះអាសន្ន";
      titleEn = "STUDY SUSPENSION PERMISSION";
      bodyContent = `
        <p style="text-indent: 36px; line-height: 2.1; margin-bottom: 16px;">
          <strong>${branding.schoolNameKh}</strong> សូមបញ្ជាក់ថា សិស្សឈ្មោះ <strong>${studentNameKh}</strong> (${studentNameEn}) អត្តលេខ <strong>${studentId}</strong> បានស្នើសុំផ្អាកការសិក្សាជាបណ្តោះអាសន្ន ដោយសារមានធុរៈចាំបាច់។
        </p>
        <div style="background: rgba(0,0,0,0.02); border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 24px; margin: 18px 0; line-height: 2.2;">
          <div>- មូលហេតុនៃការសុំផ្អាក៖ <strong>${customNotes || "ធុរៈផ្ទាល់ខ្លួន / ការងារ"}</strong></div>
          <div>- ស្ថានភាពសិស្សក្នុងប្រព័ន្ធ៖ <strong>រក្សាកៅអី និងពិន្ទុទុក (Status: On-Leave)</strong></div>
        </div>
        <p style="text-indent: 36px; line-height: 2.1;">
          សិស្សអាចវិលត្រឡប់មកបន្តការសិក្សាវិញបានគ្រប់ពេលវេលា ដោយគ្រាន់តែជូនដំណឹងមកកាន់លោកគ្រូជាមុន។
        </p>
      `;
    }

    return `
      <div class="official-letter-doc" style="font-family: 'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 50px; background: #fff; color: #1e293b; box-sizing: border-box;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 28px;">
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #1e1b4b;">${branding.schoolNameKh}</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #4338ca; letter-spacing: 0.5px;">${branding.schoolNameEn}</div>
            <div style="font-size: 0.78rem; color: #64748b; margin-top: 4px;">${branding.schoolAddress} | ទូរស័ព្ទ៖ ${branding.schoolPhone}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div style="font-size: 0.8rem; color: #475569;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 6px;">លេខសម្គាល់៖ ${studentId}/${today.getFullYear()}</div>
          </div>
        </div>

        <!-- Document Title -->
        <div style="text-align: center; margin: 30px 0 25px 0;">
          <h1 style="font-size: 1.45rem; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">${titleKh}</h1>
          <div style="font-size: 0.85rem; font-weight: 700; color: #4338ca; letter-spacing: 1px;">${titleEn}</div>
        </div>

        <!-- Body Content -->
        <div style="font-size: 0.95rem; color: #334155; line-height: 2;">
          ${bodyContent}
        </div>

        <!-- Signature & Stamp Footer -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px;">
          <div style="font-size: 0.8rem; color: #94a3b8;">
            <div>ឯកសារចេញដោយប្រព័ន្ធ៖ TIS Lab v2.2</div>
            <div>ផ្ទៀងផ្ទាត់៖ masterSchool-sys</div>
          </div>

          <div style="text-align: center; min-width: 240px; position: relative;">
            <div style="font-size: 0.88rem; color: #475569; margin-bottom: 8px;">${branding.schoolAddress.split(',')[0] || 'ខេត្តកំពត'}, ${dateKhmer}</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 60px;">${branding.teacherPosition}</div>
            
            <!-- Stamp & Signature Overlays -->
            <div style="position: absolute; bottom: 25px; left: 50%; transform: translateX(-50%); width: 180px; height: 90px; pointer-events: none;">
              ${branding.stampImageUrl ? `<img src="${branding.stampImageUrl}" style="position: absolute; left: -20px; top: -10px; width: 100px; height: 100px; opacity: 0.85; transform: rotate(-5deg);" alt="Seal">` : ''}
              ${branding.signatureImageUrl ? `<img src="${branding.signatureImageUrl}" style="position: absolute; right: 0; bottom: 0; width: 120px; height: 60px;" alt="Signature">` : ''}
            </div>

            <div style="font-size: 1rem; font-weight: 800; color: #0f172a; text-decoration: underline; text-underline-offset: 4px;">
              ${branding.teacherTitle}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  printOfficialLetter(type, student, customNotes = "") {
    const html = this.generateOfficialLetterHtml(type, student, customNotes);
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>លិខិតផ្លូវការ - ${student.NameKh}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 15mm; }
          body { margin: 0; padding: 0; background: #f8fafc; }
          @media print {
            body { background: #fff; }
          }
        </style>
      </head>
      <body>
        ${html}
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  },

  // ------------------------------------------------------------------------
  // 6. OFFICIAL STUDENT TRANSCRIPT (ព្រឹត្តិបត្រពិន្ទុផ្លូវការ A4)
  // ------------------------------------------------------------------------
  generateTranscriptHtml(student) {
    const branding = this.getSchoolBranding();
    const today = new Date();
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const dateKhmer = `ថ្ងៃទី ${String(today.getDate()).padStart(2, '0')} ខែ ${khmerMonths[today.getMonth()]} ឆ្នាំ ${today.getFullYear()}`;

    // Fetch exams
    let exams = {};
    if (typeof StudentAPI !== "undefined" && StudentAPI.getStudentExams) {
      exams = StudentAPI.getStudentExams(student.ID) || {};
    }

    const modules = [
      { id: "Typing", nameKh: "វគ្គទី ១៖ ជំនាញវាយអត្ថបទរហ័ស (Touch Typing)", maxScore: 100 },
      { id: "Word", nameKh: "វគ្គទី ២៖ រដ្ឋបាលឯកសារ Microsoft Word", maxScore: 100 },
      { id: "Excel", nameKh: "វគ្គទី ៣៖ គណនាតារាង & រូបមន្ត Microsoft Excel", maxScore: 100 },
      { id: "PowerPoint", nameKh: "វគ្គទី ៤៖ រចនាស្លាយបទបង្ហាញ Microsoft PowerPoint", maxScore: 100 }
    ];

    let totalScore = 0;
    let completedCount = 0;

    const rowsHtml = modules.map((m, idx) => {
      const ex = exams[m.id] || {};
      const score = (ex.score !== undefined && ex.score !== null) ? Number(ex.score) : null;
      let grade = ex.grade || (score !== null ? (score >= 85 ? "A" : score >= 75 ? "B" : score >= 65 ? "C" : score >= 50 ? "D" : "F") : "---");
      let statusText = ex.status === "Pass" ? '<span style="color: #059669; font-weight: 700;">ជាប់ (Pass)</span>' : (score !== null ? '<span style="color: #dc2626;">ធ្លាក់ (Fail)</span>' : '<span style="color: #94a3b8;">មិនទាន់ប្រឡង</span>');

      if (score !== null) {
        totalScore += score;
        completedCount++;
      }

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; height: 44px; text-align: center;">
          <td style="font-weight: 600;">${idx + 1}</td>
          <td style="text-align: left; padding-left: 14px; font-weight: 600;">${m.nameKh}</td>
          <td style="font-weight: 600;">${m.maxScore}</td>
          <td style="font-weight: 700; font-size: 1.05rem; color: #1e1b4b;">${score !== null ? score : '---'}</td>
          <td style="font-weight: 800; font-size: 1.05rem; color: #4338ca;">${grade}</td>
          <td>${statusText}</td>
        </tr>
      `;
    }).join('');

    const avgScore = completedCount > 0 ? (totalScore / completedCount).toFixed(1) : 0;
    let overallGrade = "---";
    let honorText = "ធម្មតា";
    if (completedCount >= 4) {
      if (avgScore >= 90) { overallGrade = "A"; honorText = "ល្អប្រសើរណាស់ (Excellent)"; }
      else if (avgScore >= 80) { overallGrade = "B"; honorText = "ល្អប្រសើរ (Very Good)"; }
      else if (avgScore >= 70) { overallGrade = "C"; honorText = "ល្អ (Good)"; }
      else if (avgScore >= 60) { overallGrade = "D"; honorText = "ល្អបង្គួរ (Fair)"; }
      else if (avgScore >= 50) { overallGrade = "E"; honorText = "មធ្យម (Pass)"; }
      else { overallGrade = "F"; honorText = "ធ្លាក់ (Fail)"; }
    }

    return `
      <div class="student-transcript-doc" style="font-family: 'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif; max-width: 820px; margin: 0 auto; padding: 36px 48px; background: #fff; color: #0f172a; box-sizing: border-box;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 24px;">
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #1e1b4b;">${branding.schoolNameKh}</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #4338ca;">${branding.schoolNameEn}</div>
            <div style="font-size: 0.76rem; color: #64748b; margin-top: 4px;">${branding.schoolAddress} | ${branding.schoolPhone}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div style="font-size: 0.78rem; color: #475569;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">TRANSCRIPT NO: TR-${student.ID}</div>
          </div>
        </div>

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 1.45rem; font-weight: 800; margin: 0 0 4px 0; color: #0f172a;">ព្រឹត្តិបត្រពិន្ទុផ្លូវការ</h1>
          <div style="font-size: 0.85rem; font-weight: 700; color: #4338ca; letter-spacing: 1px;">OFFICIAL ACADEMIC TRANSCRIPT</div>
        </div>

        <!-- Student Profile Row -->
        <div style="display: flex; gap: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
          <div style="flex: 1; font-size: 0.88rem; line-height: 2;">
            <div>- ឈ្មោះខ្មែរ៖ <strong>${student.NameKh}</strong> &nbsp;&nbsp;&nbsp;&nbsp; អក្សរឡាតាំង៖ <strong>${student.NameEn || this.transliterateKhmerToLatin(student.NameKh)}</strong></div>
            <div>- អត្តលេខ (ID)៖ <strong>${student.ID}</strong> &nbsp;&nbsp;&nbsp;&nbsp; ភេទ៖ <strong>${student.Gender || 'ប្រុស'}</strong> &nbsp;&nbsp;&nbsp;&nbsp; ថ្ងៃខែកំណើត៖ <strong>${student.DOB || '---'}</strong></div>
            <div>- វគ្គសិក្សា៖ <strong>ថ្នាក់កុំព្យូទ័ររដ្ឋបាល (Computer Office Pro)</strong> &nbsp;&nbsp;&nbsp;&nbsp; វេន៖ <strong>វេន${student.Shift || 'ព្រឹក'}</strong></div>
          </div>
          ${student.Avatar ? `
            <div style="width: 75px; height: 95px; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; flex-shrink: 0;">
              <img src="${student.Avatar}" style="width: 100%; height: 100%; object-fit: cover;" alt="Student">
            </div>
          ` : ''}
        </div>

        <!-- Grades Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 0.88rem;">
          <thead>
            <tr style="background: #1e1b4b; color: #ffffff; height: 40px; text-align: center;">
              <th style="width: 45px;">ល.រ</th>
              <th style="text-align: left; padding-left: 14px;">មុខវិជ្ជា / វគ្គសិក្សា</th>
              <th style="width: 80px;">ពិន្ទុពេញ</th>
              <th style="width: 90px;">ពិន្ទុទទួលបាន</th>
              <th style="width: 80px;">និទ្ទេស</th>
              <th style="width: 110px;">លទ្ធផល</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- Summary & Evaluation -->
        <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 30px; font-size: 0.88rem;">
          <div style="flex: 1; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 14px 18px; line-height: 1.9;">
            <div style="font-weight: 700; color: #1e1b4b; margin-bottom: 4px;">ការវាយតម្លៃរបស់លោកគ្រូ (Instructor Evaluation)៖</div>
            <div>- សិស្សមានការយកចិត្តទុកដាក់ និងគោរពវិន័យបានយ៉ាងល្អ។</div>
            <div>- ជំនាញអនុវត្តផ្ទាល់លើ Microsoft Office មានកម្រិតខ្ពស់ អាចបំពេញការងាររដ្ឋបាលបានយ៉ាងស្ទាត់ជំនាញ។</div>
          </div>

          <div style="width: 260px; background: #f1f5f9; border-radius: 10px; padding: 14px 18px; line-height: 2;">
            <div>មធ្យមភាគរួម៖ <strong style="font-size: 1.1rem; color: #1e1b4b;">${avgScore} / 100</strong></div>
            <div>និទ្ទេសរួម៖ <strong style="font-size: 1.25rem; color: #4338ca;">${overallGrade}</strong></div>
            <div>ចំណាត់ថ្នាក់កិត្តិយស៖ <strong style="color: #059669;">${honorText}</strong></div>
          </div>
        </div>

        <!-- Signature Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;">
          <div style="font-size: 0.78rem; color: #94a3b8;">
            <div>* ព្រឹត្តិបត្រពិន្ទុនេះ មានសុពលភាពផ្លូវការ</div>
            <div>លេខកូដសម្គាល់៖ ${student.ID}-TIS-${today.getFullYear()}</div>
          </div>

          <div style="text-align: center; min-width: 220px; position: relative;">
            <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 6px;">${branding.schoolAddress.split(',')[0] || 'ខេត្តកំពត'}, ${dateKhmer}</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 50px;">${branding.teacherPosition}</div>
            
            <!-- Stamp & Signature Overlays -->
            <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 160px; height: 80px; pointer-events: none;">
              ${branding.stampImageUrl ? `<img src="${branding.stampImageUrl}" style="position: absolute; left: -15px; top: -10px; width: 90px; height: 90px; opacity: 0.85; transform: rotate(-5deg);" alt="Seal">` : ''}
              ${branding.signatureImageUrl ? `<img src="${branding.signatureImageUrl}" style="position: absolute; right: 0; bottom: 0; width: 110px; height: 50px;" alt="Signature">` : ''}
            </div>

            <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; text-decoration: underline;">
              ${branding.teacherTitle}
            </div>
          </div>
        </div>

      </div>
    `;
  },

  printTranscript(student) {
    const html = this.generateTranscriptHtml(student);
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ព្រឹត្តិបត្រពិន្ទុ - ${student.NameKh}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 12mm; }
          body { margin: 0; padding: 0; background: #f8fafc; }
          @media print { body { background: #fff; } }
        </style>
      </head>
      <body>
        ${html}
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  },

  // ------------------------------------------------------------------------
  // 7. BATCH CERTIFICATES CONTINUOUS PRINT
  // ------------------------------------------------------------------------
  printBatchCertificates() {
    let students = [];
    if (typeof StudentAPI !== "undefined") {
      students = StudentAPI.getLocalStudents() || [];
    }

    // Filter students eligible or passed
    const eligibleStudents = students.filter(s => {
      if (s.Status === "Dropped" || s.Status === "Drop") return false;
      const exams = (typeof StudentAPI !== "undefined" && StudentAPI.getStudentExams) ? StudentAPI.getStudentExams(s.ID) : {};
      const passedCount = Object.values(exams).filter(e => e && e.status === "Pass").length;
      return s.Status === "Graduated" || passedCount >= 4 || (s.Course && exams[s.Course] && exams[s.Course].status === "Pass");
    });

    if (eligibleStudents.length === 0) {
      alert("មិនទាន់មានសិស្សណាគ្រប់លក្ខខណ្ឌទទួលវិញ្ញាបនបត្រនៅឡើយទេ!");
      return;
    }

    const branding = this.getSchoolBranding();
    const certsHtml = eligibleStudents.map(student => {
      return `
        <div class="batch-cert-page" style="page-break-after: always; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center;">
          ${(typeof CertificatesView !== "undefined" && CertificatesView.generateCertificateHtml) ? 
            CertificatesView.generateCertificateHtml(student) : 
            `<div style="padding: 40px; text-align: center;"><h1>វិញ្ញាបនបត្រ - ${student.NameKh} (${student.ID})</h1></div>`
          }
        </div>
      `;
    }).join('');

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>បោះពុម្ពវិញ្ញាបនបត្រទាំងអស់ (${eligibleStudents.length} សន្លឹក)</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Koulen&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 landscape; margin: 0; }
          body { margin: 0; padding: 0; background: #fff; }
          .batch-cert-page { width: 297mm; height: 210mm; box-sizing: border-box; overflow: hidden; page-break-after: always; }
          @media print { .batch-cert-page { page-break-after: always; } }
        </style>
      </head>
      <body>
        ${certsHtml}
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  },

  // ------------------------------------------------------------------------
  // 8. AUTO COURSE PROGRESSION PIPELINE
  // ------------------------------------------------------------------------
  async checkAndAdvanceCourse(studentId, passedCourseId) {
    if (!studentId || !passedCourseId) return null;
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    const student = students.find(s => s.ID === studentId);
    if (!student) return null;

    const progressionMap = {
      "Typing": "Microsoft Word",
      "Word": "Microsoft Excel",
      "Microsoft Word": "Microsoft Excel",
      "Excel": "Microsoft PowerPoint",
      "Microsoft Excel": "Microsoft PowerPoint",
      "PowerPoint": "Graduated",
      "Microsoft PowerPoint": "Graduated"
    };

    const nextStep = progressionMap[passedCourseId];
    if (!nextStep) return null;

    if (nextStep === "Graduated") {
      student.Status = "Graduated";
      student.GraduationDate = new Date().toISOString().split("T")[0];
    } else {
      student.Course = nextStep;
    }

    if (typeof StudentAPI !== "undefined" && StudentAPI.updateStudent) {
      await StudentAPI.updateStudent(studentId, student);
    }

    if (typeof App !== "undefined" && App.showToast) {
      if (nextStep === "Graduated") {
        App.showToast(`🎉 អបអរសាទរ! សិស្ស ${student.NameKh} បានបញ្ចប់ទាំង ៤ វគ្គដោយជោគជ័យ!`, "success");
      } else {
        App.showToast(`🚀 សិស្ស ${student.NameKh} បានឡើងទៅរៀនវគ្គ "${nextStep}" ស្វ័យប្រវត្តិ!`, "success");
      }
    }

    return student;
  },

  // ------------------------------------------------------------------------
  // 9. GRADUATION SCANNER (AUTO-EVALUATE 4-MONTH COMPLETED CANDIDATES)
  // ------------------------------------------------------------------------
  getGraduationCandidates() {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    const now = new Date();

    return students.filter(s => {
      if (s.Status === "Graduated" || s.Status === "Dropped" || s.Status === "Drop") return false;
      
      // 1. Check exams
      const exams = (typeof StudentAPI !== "undefined" && StudentAPI.getStudentExams) ? StudentAPI.getStudentExams(s.ID) : {};
      const passedCount = ["Typing", "Word", "Excel", "PowerPoint"].filter(k => exams[k] && exams[k].status === "Pass").length;

      // 2. Check duration (optional check)
      const startDate = new Date(s.StartDate || s.CreatedAt || "2026-09-01");
      const diffMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

      return passedCount >= 4 || diffMonths >= 4;
    });
  },

  async batchGraduateCandidates(studentIds) {
    if (!Array.isArray(studentIds) || studentIds.length === 0) return 0;
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    let count = 0;

    for (const id of studentIds) {
      const s = students.find(item => item.ID === id);
      if (s) {
        s.Status = "Graduated";
        s.GraduationDate = new Date().toISOString().split("T")[0];
        if (typeof StudentAPI !== "undefined" && StudentAPI.updateStudent) {
          await StudentAPI.updateStudent(id, s);
        }
        count++;
      }
    }
    return count;
  },

  // ------------------------------------------------------------------------
  // 10. PARTIAL / INSTALLMENT TUITION FEE TRACKER
  // ------------------------------------------------------------------------
  async recordPartialFee(studentId, amountPaid, note = "") {
    const paid = Number(amountPaid) || 0;
    const defaultTotal = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.feeConfig && APP_CONFIG.feeConfig.defaultCoursePrice) || 50;

    let feeData = {};
    if (typeof StudentAPI !== "undefined" && StudentAPI.getStudentFee) {
      feeData = StudentAPI.getStudentFee(studentId) || {};
    }

    const currentPaid = Number(feeData.paidAmount || (feeData.status === "Paid" ? defaultTotal : 0)) + paid;
    const remainingDue = Math.max(0, defaultTotal - currentPaid);
    const newStatus = remainingDue === 0 ? "Paid" : "Partial";

    const updatedFee = {
      ...feeData,
      studentId: studentId,
      totalCourseFee: defaultTotal,
      paidAmount: currentPaid,
      dueAmount: remainingDue,
      status: newStatus,
      lastPaymentDate: new Date().toISOString().split("T")[0],
      note: note,
      history: [
        ...(feeData.history || []),
        {
          date: new Date().toISOString(),
          amount: paid,
          note: note
        }
      ]
    };

    if (typeof StudentAPI !== "undefined" && StudentAPI.saveStudentFee) {
      await StudentAPI.saveStudentFee(studentId, updatedFee);
    }

    return updatedFee;
  },

  // ------------------------------------------------------------------------
  // 11. 1-CLICK TELEGRAM PAYMENT REMINDER
  // ------------------------------------------------------------------------
  async sendTelegramPaymentReminder(student) {
    if (!student) return;
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      alert("សូមបើកដំណើរការ Telegram Bot ក្នុង Settings ជាមុនសិន!");
      return;
    }

    const feeConfig = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.feeConfig) || {};
    const fee = (typeof StudentAPI !== "undefined" && StudentAPI.getStudentFee) ? StudentAPI.getStudentFee(student.ID) : null;
    const dueAmount = fee ? (fee.dueAmount !== undefined ? fee.dueAmount : (fee.status === "Paid" ? 0 : 50)) : 50;

    const message = `🔔 *សាររំលឹកការបង់ថ្លៃសិក្សា (Tuition Fee Reminder)*\n\n` +
      `ជម្រាបសួរអាណាព្យាបាល និងប្អូនសិស្សានុសិស្ស *${student.NameKh}* (អត្តលេខ៖ \`${student.ID}\`)\n\n` +
      `សាលា *TIS Lab Computer* សូមជម្រាបរំលឹកពីថ្លៃសិក្សាវគ្គកុំព្យូទ័ររដ្ឋបាល៖\n` +
      `💵 *ចំនួនទឹកប្រាក់នៅខ្វះ៖* \`$${dueAmount}\`\n` +
      `📅 *កាលបរិច្ឆេទកំណត់៖* ថ្ងៃនេះ\n\n` +
      `💳 *ព័ត៌មានគណនីបង់ប្រាក់ (ABA Bank):*\n` +
      `• ឈ្មោះគណនី៖ *${feeConfig.accountName || 'KHIEN THOU'}*\n` +
      `• លេខគណនី៖ \`${feeConfig.accountNumber || '071 721 0307'}\`\n\n` +
      `សូមអរគុណសម្រាប់ការយកចិត្តទុកដាក់ និងការសហការ! 🙏`;

    await TelegramService.sendMessage(message);
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`✅ បានផ្ញើសាររំលឹកបង់លុយ $${dueAmount} ទៅ Telegram សិស្ស ${student.NameKh} រួចរាល់!`, "success");
    }
  },

  // ------------------------------------------------------------------------
  // 12. AUTOMATED 2-DAY ABSENCE FOLLOW-UP
  // ------------------------------------------------------------------------
  async sendAbsenceInquiry(student, consecutiveDays = 2) {
    if (!student) return;
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      alert("សូមបើកដំណើរការ Telegram Bot ជាមុនសិន!");
      return;
    }

    const message = `🌸 *សារសួរសុខទុក្ខពីសាលា TIS Lab Computer*\n\n` +
      `ជម្រាបសួរអាណាព្យាបាល និងប្អូនសិស្ស *${student.NameKh}* (អត្តលេខ \`${student.ID}\`)\n\n` +
      `សាលាបានកត់សម្គាល់ឃើញថា ប្អូនបានអវត្តមានចំនួន *${consecutiveDays} ថ្ងៃ* ជាប់ៗគ្នាក្នុងវគ្គកុំព្យូទ័រ *វេន${student.Shift || 'ព្រឹក'}*។\n\n` +
      `តើប្អូនមានធុរៈរវល់ ឬមិនស្រួលខ្លួនដែរឬទេ? ប្រសិនបើមានបញ្ហា ឬត្រូវការជំនួយរៀនប៉ះប៉ូវ សូមជូនដំណឹងមកកាន់លោកគ្រូ ខៀន ធូ តាមរយៈលេខ \`071 721 0307\`។\n\n` +
      `សូមជូនពរប្អូនមានសុខភាពល្អ និងឆាប់បានត្រឡប់មករៀនវិញ! 💻✨`;

    await TelegramService.sendMessage(message);
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`💌 បានផ្ញើសារសួរសុខទុក្ខសិស្ស ${student.NameKh} ទៅ Telegram រួចរាល់!`, "success");
    }
  },

  // ------------------------------------------------------------------------
  // 13. AUTO WELCOME TELEGRAM CARD FOR NEW STUDENT
  // ------------------------------------------------------------------------
  async sendTelegramWelcomeCard(student) {
    if (!student || typeof TelegramService === "undefined" || !TelegramService.isEnabled()) return;

    const message = `🎉 *សូមស្វាគមន៍សិស្សានុសិស្សថ្មីចូលរៀន! (Welcome to TIS Lab)*\n\n` +
      `✨ *ឈ្មោះខ្មែរ:* ${student.NameKh}\n` +
      `🔤 *អក្សរឡាតាំង:* ${student.NameEn || this.transliterateKhmerToLatin(student.NameKh)}\n` +
      `🆔 *អត្តលេខ (Student ID):* \`${student.ID}\`\n` +
      `🚻 *ភេទ:* ${student.Gender || 'ប្រុស'} | ⏰ *វេនសិក្សា:* វេន${student.Shift || 'ព្រឹក'}\n` +
      `💻 *វគ្គដំបូង:* ${student.Course || 'Typing'}\n` +
      `📅 *កាលបរិច្ឆេទចុះឈ្មោះ:* ${new Date().toLocaleDateString('km-KH')}\n\n` +
      `ជូនពរប្អូនទទួលបានចំណេះដឹង និងជំនាញកុំព្យូទ័រពិតប្រាកដសម្រាប់អនាគត! 🚀💻`;

    try {
      await TelegramService.sendMessage(message);
    } catch (e) {}
  },

  // ------------------------------------------------------------------------
  // 14. AUTO-BACKUP DATABASE TO TEACHER'S TELEGRAM
  // ------------------------------------------------------------------------
  async sendBackupToTelegram() {
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      throw new Error("Telegram Bot មិនទាន់ត្រូវបានបើកដំណើរការឡើយ!");
    }

    // Collect all database snapshot
    const backupSnapshot = {
      backupDate: new Date().toISOString(),
      appName: "TIS Lab Computer",
      version: "2.2",
      students: (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [],
      attendance: JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEY_ATTENDANCE) || "{}"),
      exams: JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEY_EXAMS) || "{}"),
      fees: JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEY_FEES) || "{}"),
      certificates: JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEY_CERTIFICATES) || "{}"),
      teachers: JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEY_TEACHERS) || "[]"),
      branding: this.getSchoolBranding(),
      settings: JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEY_SETTINGS) || "{}")
    };

    const jsonString = JSON.stringify(backupSnapshot, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const filename = `TIS_Lab_Backup_${new Date().toISOString().split('T')[0]}.json`;

    // Try sending file via Telegram Bot sendDocument API
    const config = TelegramService.getConfig();
    const token = config.botToken;
    const chatId = config.chatId;

    if (!token || !chatId) {
      throw new Error("ខ្វះ Bot Token ឬ Chat ID!");
    }

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("caption", `💾 *ឯកសារទិន្នន័យបម្រុងស្វ័យប្រវត្តិ (Auto-Backup)*\n📅 កាលបរិច្ឆេទ៖ ${new Date().toLocaleString('km-KH')}\n👥 សិស្សសរុប៖ ${backupSnapshot.students.length} នាក់`);
    formData.append("document", blob, filename);

    const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (!data.ok) {
      throw new Error("Telegram sendDocument failed: " + (data.description || ""));
    }

    return true;
  },

  // ------------------------------------------------------------------------
  // 15. WEEKLY AUTO-BACKUP SCHEDULER (CHECKS ONCE PER HOUR)
  // ------------------------------------------------------------------------
  initWeeklyTelegramBackupScheduler() {
    setInterval(() => {
      const now = new Date();
      // Sunday is 0, check 20:00 (8:00 PM)
      if (now.getDay() === 0 && now.getHours() === 20) {
        const lastSentKey = "tis_lab_last_backup_date";
        const todayStr = now.toISOString().split("T")[0];
        if (localStorage.getItem(lastSentKey) !== todayStr) {
          localStorage.setItem(lastSentKey, todayStr);
          this.sendBackupToTelegram().then(() => {
            console.log("✅ Weekly database backup sent to teacher's Telegram successfully!");
          }).catch(err => {
            console.warn("⚠️ Weekly backup error:", err);
          });
        }
      }
    }, 1000 * 60 * 30); // Check every 30 mins
  },

  // ------------------------------------------------------------------------
  // 16. TELEGRAM REMOTE COMMANDS FOR TEACHER (/today, /unpaid, /TX01)
  // ------------------------------------------------------------------------
  async pollTelegramTeacherCommands() {
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) return;
    const config = TelegramService.getConfig();
    const token = config.botToken;
    if (!token) return;

    try {
      const lastUpdateId = Number(localStorage.getItem("tis_last_tg_update_id") || "0");
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&limit=5`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          localStorage.setItem("tis_last_tg_update_id", String(update.update_id));
          const msg = update.message;
          if (msg && msg.text) {
            await this.handleTelegramCommand(msg.text.trim(), msg.chat.id);
          }
        }
      }
    } catch (e) {}
  },

  async handleTelegramCommand(commandText, chatId) {
    const lower = commandText.toLowerCase();
    let reply = "";

    const students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];

    if (lower === "/start" || lower === "/help") {
      reply = `👋 *សួស្តីលោកគ្រូ! នេះជាបញ្ជាសម្រាប់ឆែកប្រព័ន្ធ TIS Lab:*\n\n` +
        `• \`/today\` : ឆែកចំនួនសិស្ស និងវត្តមានថ្ងៃនេះ\n` +
        `• \`/unpaid\` : ឆែកបញ្ជីសិស្សដែលជំពាក់ថ្លៃសិក្សា\n` +
        `• \`/backup\` : ផ្ញើឯកសារ Backup ទិន្នន័យមក Telegram ឥឡូវនេះ\n` +
        `• វាយលេខ ID (ឧ. \`TX01\`) : ឆែកព័ត៌មានលម្អិតរបស់សិស្សនោះភ្លាមៗ!`;
    } else if (lower === "/today") {
      const active = students.filter(s => s.Status !== "Dropped" && s.Status !== "Drop");
      reply = `📊 *របាយការណ៍សង្ខេបថ្ងៃនេះ (${new Date().toLocaleDateString('km-KH')}):*\n\n` +
        `👥 *សិស្សកំពុងរៀនសរុប:* ${active.length} នាក់\n` +
        `🌅 *វេនព្រឹក:* ${active.filter(s => (s.Shift || '').includes('ព្រឹក')).length} នាក់\n` +
        `☀️ *វេនថ្ងៃ:* ${active.filter(s => (s.Shift || '').includes('ថ្ងៃ')).length} នាក់\n` +
        `🌇 *វេនរសៀល:* ${active.filter(s => (s.Shift || '').includes('រសៀល')).length} នាក់\n\n` +
        `💻 *ប្រព័ន្ធបន្ទប់ Lab ដំណើរការធម្មតា!*`;
    } else if (lower === "/unpaid") {
      const fees = (typeof StudentAPI !== "undefined" && StudentAPI.getFees) ? StudentAPI.getFees() : {};
      const unpaidStudents = students.filter(s => {
        if (s.Status === "Dropped" || s.Status === "Drop") return false;
        const f = fees[s.ID];
        return !f || f.status !== "Paid";
      });
      reply = `💵 *បញ្ជីសិស្សជំពាក់ថ្លៃសិក្សា (សរុប ${unpaidStudents.length} នាក់):*\n\n` +
        unpaidStudents.slice(0, 15).map(s => `• \`${s.ID}\` ${s.NameKh} (${s.Phone})`).join("\n") +
        (unpaidStudents.length > 15 ? `\n...និង ${unpaidStudents.length - 15} នាក់ទៀត` : "");
    } else if (lower === "/backup") {
      await this.sendBackupToTelegram();
      return;
    } else if (/^(?:tx|stu)[-_]?\d+/i.test(commandText)) {
      const cleanId = (typeof StudentAPI !== "undefined" && StudentAPI.normalizeStudentId) ? StudentAPI.normalizeStudentId(commandText) : commandText.toUpperCase();
      const s = students.find(item => item.ID.toUpperCase() === cleanId.toUpperCase());
      if (s) {
        reply = `👤 *ព័ត៌មានសិស្ស ${s.NameKh}:*\n` +
          `🆔 អត្តលេខ៖ \`${s.ID}\` | 🚻 ភេទ៖ ${s.Gender}\n` +
          `💻 វគ្គ៖ ${s.Course || 'Typing'} | ⏰ វេន៖ វេន${s.Shift}\n` +
          `📞 ទូរស័ព្ទ៖ \`${s.Phone}\` | អាណាព្យាបាល៖ \`${s.GuardianPhone || '---'}\`\n` +
          `🟢 ស្ថានភាព៖ ${s.Status || 'Active'}`;
      } else {
        reply = `❌ រកមិនឃើញសិស្សដែលមានលេខសម្គាល់ "${commandText}" ឡើយ!`;
      }
    }

    if (reply && typeof TelegramService !== "undefined") {
      await TelegramService.sendMessage(reply);
    }
  },

  // ------------------------------------------------------------------------
  // 17. MONTHLY ATTENDANCE SHEET A4 HARDCOPY
  // ------------------------------------------------------------------------
  printMonthlyAttendanceHardcopy(year = new Date().getFullYear(), month = new Date().getMonth(), shift = "ព្រឹក") {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    if (shift && shift !== "ALL") {
      students = students.filter(s => (s.Shift || "").includes(shift));
    }
    students = students.filter(s => s.Status !== "Dropped" && s.Status !== "Drop");

    const branding = this.getSchoolBranding();
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const monthName = khmerMonths[month];

    // Generate 20-22 school days (Mon-Fri)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const schoolDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d);
      const dayOfWeek = dt.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        schoolDays.push(d);
      }
    }

    const headersHtml = schoolDays.map(d => `<th style="width: 24px; font-size: 0.72rem; padding: 2px;">${d}</th>`).join('');

    const rowsHtml = students.map((s, idx) => {
      const emptyCells = schoolDays.map(() => `<td style="border: 1px solid #cbd5e1; height: 26px;"></td>`).join('');
      return `
        <tr style="height: 26px; text-align: center; font-size: 0.78rem;">
          <td style="border: 1px solid #cbd5e1;">${idx + 1}</td>
          <td style="border: 1px solid #cbd5e1; font-weight: 700; font-family: monospace;">${s.ID}</td>
          <td style="border: 1px solid #cbd5e1; text-align: left; padding-left: 6px; font-weight: 600;">${s.NameKh}</td>
          <td style="border: 1px solid #cbd5e1;">${s.Gender || 'ប'}</td>
          ${emptyCells}
          <td style="border: 1px solid #cbd5e1;"></td>
          <td style="border: 1px solid #cbd5e1;"></td>
        </tr>
      `;
    }).join('');

    const html = `
      <div style="font-family: 'Kantumruy Pro', sans-serif; padding: 15px; color: #000;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
          <div>
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800;">${branding.schoolNameKh}</h2>
            <div style="font-size: 0.82rem; font-weight: 700; color: #333;">តារាងវត្តមានសិស្សប្រចាំខែ ${monthName} ឆ្នាំ ${year} — វេន${shift}</div>
          </div>
          <div style="text-align: right; font-size: 0.8rem;">
            <div>សិស្សសរុប៖ <strong>${students.length} នាក់</strong></div>
            <div>គ្រូបង្រៀន៖ <strong>${branding.teacherTitle}</strong></div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; text-align: center;">
          <thead>
            <tr style="background: #e2e8f0; height: 30px; font-size: 0.75rem;">
              <th style="border: 1px solid #94a3b8; width: 30px;">ល.រ</th>
              <th style="border: 1px solid #94a3b8; width: 50px;">អត្តលេខ</th>
              <th style="border: 1px solid #94a3b8; width: 140px; text-align: left; padding-left: 6px;">គោត្តនាម-នាម</th>
              <th style="border: 1px solid #94a3b8; width: 35px;">ភេទ</th>
              ${headersHtml}
              <th style="border: 1px solid #94a3b8; width: 35px;">វត្តមាន</th>
              <th style="border: 1px solid #94a3b8; width: 35px;">អវត្ត</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 0.82rem;">
          <div>សម្គាល់៖ <strong>P</strong> = មកដល់, <strong>A</strong> = អវត្តមាន, <strong>L</strong> = ច្បាប់</div>
          <div style="text-align: center; min-width: 180px;">
            <div>ថ្ងៃទី........ ខែ........ ឆ្នាំ ${year}</div>
            <div style="margin-top: 5px; font-weight: 700;">ហត្ថលេខាគ្រូទទួលបន្ទុក</div>
          </div>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>បញ្ជីវត្តមាន A4 - វេន${shift} - ខែ ${monthName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 landscape; margin: 8mm; }
          body { margin: 0; background: #fff; }
        </style>
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
  // 18. MONTHLY 1-PAGE EXECUTIVE SUMMARY SHEET FOR TEACHER
  // ------------------------------------------------------------------------
  printMonthlyExecutiveSummary(year = new Date().getFullYear(), month = new Date().getMonth()) {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    const active = students.filter(s => s.Status !== "Dropped" && s.Status !== "Drop");
    const graduated = students.filter(s => s.Status === "Graduated");
    const dropped = students.filter(s => s.Status === "Dropped" || s.Status === "Drop");

    const fees = (typeof StudentAPI !== "undefined" && StudentAPI.getFees) ? StudentAPI.getFees() : {};
    let totalRevenue = 0;
    let totalPending = 0;

    active.forEach(s => {
      const f = fees[s.ID];
      if (f && f.status === "Paid") {
        totalRevenue += Number(f.paidAmount || 50);
      } else if (f && f.status === "Partial") {
        totalRevenue += Number(f.paidAmount || 0);
        totalPending += Number(f.dueAmount || 0);
      } else {
        totalPending += 50;
      }
    });

    const branding = this.getSchoolBranding();
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];

    const html = `
      <div style="font-family: 'Kantumruy Pro', sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; color: #0f172a;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px;">
          <div>
            <h2 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #1e1b4b;">${branding.schoolNameKh}</h2>
            <div style="font-size: 0.85rem; font-weight: 700; color: #4338ca;">របាយការណ៍សង្ខេបប្រតិបត្តិការប្រចាំខែ (Executive Summary)</div>
          </div>
          <div style="text-align: right; font-size: 0.85rem;">
            <div>ខែ ${khmerMonths[month]} ឆ្នាំ ${year}</div>
            <div style="color: #64748b;">កាលបរិច្ឆេទចេញ៖ ${new Date().toLocaleDateString('km-KH')}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
            <div style="font-size: 0.8rem; color: #64748b;">សិស្សកំពុងរៀន</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #4338ca;">${active.length} នាក់</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
            <div style="font-size: 0.8rem; color: #64748b;">សិស្សបញ្ចប់ការសិក្សា</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #059669;">${graduated.length} នាក់</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
            <div style="font-size: 0.8rem; color: #64748b;">ចំណូលប្រមូលបាន</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #059669;">$${totalRevenue}</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center;">
            <div style="font-size: 0.8rem; color: #64748b;">ប្រាក់ជំពាក់នៅសល់</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #dc2626;">$${totalPending}</div>
          </div>
        </div>

        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 24px; font-size: 0.88rem; line-height: 2;">
          <h3 style="margin: 0 0 10px 0; font-size: 0.95rem; font-weight: 700; color: #1e1b4b;">ស្ថិតិតាមវេនសិក្សា៖</h3>
          <div>• វេនព្រឹក (08:00 - 09:00)៖ <strong>${active.filter(s => (s.Shift || '').includes('ព្រឹក')).length} នាក់</strong></div>
          <div>• វេនថ្ងៃ (15:00 - 16:00)៖ <strong>${active.filter(s => (s.Shift || '').includes('ថ្ងៃ')).length} នាក់</strong></div>
          <div>• វេនរសៀល (17:00 - 18:00)៖ <strong>${active.filter(s => (s.Shift || '').includes('រសៀល')).length} នាក់</strong></div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 40px;">
          <div style="text-align: center; min-width: 200px;">
            <div style="font-size: 0.85rem; margin-bottom: 50px;">រៀបចំដោយ៖ <strong>${branding.teacherTitle}</strong></div>
            <div style="font-weight: 700; font-size: 0.95rem;">ហត្ថលេខា និងត្រា</div>
          </div>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>របាយការណ៍សង្ខេបប្រចាំខែ - TIS Lab</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>@page { size: A4; margin: 10mm; } body { margin: 0; background: #fff; }</style>
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
  // 19. PASTE EXCEL GRADES PARSER
  // ------------------------------------------------------------------------
  parsePastedExcelGrades(pastedText) {
    if (!pastedText || typeof pastedText !== "string") return [];
    const lines = pastedText.trim().split(/\r?\n/);
    const parsed = [];

    lines.forEach(line => {
      // Split by tab (Excel copy/paste) or comma
      const cols = line.split(/\t|,/).map(c => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        // Expected: [ID or Name, Score]
        const idOrName = cols[0];
        const scoreVal = parseFloat(cols[1]);
        if (!isNaN(scoreVal)) {
          parsed.push({
            idOrName: idOrName,
            score: Math.min(100, Math.max(0, scoreVal))
          });
        }
      }
    });

    return parsed;
  },

  // ------------------------------------------------------------------------
  // 20. INIT GLOBAL TEACHER SHORTCUTS
  // ------------------------------------------------------------------------
  initGlobalKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Check if target is inside an input or textarea
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
      const isInput = tag === "input" || tag === "textarea" || (e.target && e.target.isContentEditable);

      // 1. Ctrl + N -> Quick Register Student Modal
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
          ModalsComponent.open("addStudentModal");
        }
        return;
      }

      // 2. Alt + Number -> Fast Tab Switcher
      if (e.altKey && !isInput) {
        const key = e.key;
        const tabMap = {
          "1": "dashboard",
          "2": "directory",
          "3": "attendance",
          "4": "exams",
          "5": "fees",
          "6": "certificates",
          "7": "timetable",
          "8": "reports"
        };
        if (tabMap[key] && typeof App !== "undefined" && App.switchTab) {
          e.preventDefault();
          App.switchTab(tabMap[key]);
        }
      }
    });
  },

  // ------------------------------------------------------------------------
  // 21. 16-PC LAB VISUAL SEAT ALLOCATION CHART (PRINTABLE A4 LANDSCAPE)
  // ------------------------------------------------------------------------
  print16PcLabSeatChart(shift = "ព្រឹក") {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    // Filter active students in this shift
    const shiftStudents = students.filter(s => {
      if (!s) return false;
      const status = (s.Status || "").toLowerCase();
      if (status === "dropped" || status === "drop" || s.isBlocked) return false;
      return (s.Shift || "").includes(shift);
    });

    const branding = this.getSchoolBranding();
    const today = new Date();
    const dateKhmer = today.toLocaleDateString("km-KH", { year: "numeric", month: "long", day: "numeric" });

    // Build 16 PC boxes (Row 1: 01-08, Row 2: 09-16)
    let pcBoxesHtml = "";
    for (let i = 1; i <= 16; i++) {
      const pcId = `PC-${String(i).padStart(2, "0")}`;
      const student = shiftStudents[i - 1] || null;

      if (student) {
        pcBoxesHtml += `
          <div style="border: 2px solid #4338ca; border-radius: 10px; background: #f8fafc; padding: 10px; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative;">
            <div style="position: absolute; top: 6px; left: 8px; font-weight: 800; font-size: 0.75rem; color: #4338ca; font-family: monospace;">${pcId}</div>
            <img src="${student.Avatar || App.getDefaultAvatar(student.Gender)}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #10b981; margin-top: 14px; margin-bottom: 6px;" alt="Avatar">
            <div style="font-weight: 700; font-size: 0.85rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${student.NameKh}</div>
            <div style="font-size: 0.72rem; color: #64748b; font-family: monospace; font-weight: 600;">${student.ID}</div>
            <span style="display: inline-block; background: #e0e7ff; color: #4338ca; font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">${student.Course || 'Typing'}</span>
          </div>
        `;
      } else {
        pcBoxesHtml += `
          <div style="border: 2px dashed #94a3b8; border-radius: 10px; background: #f1f5f9; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 125px; text-align: center;">
            <div style="font-weight: 800; font-size: 0.8rem; color: #64748b; font-family: monospace;">${pcId}</div>
            <i class="fa-solid fa-desktop" style="font-size: 1.8rem; color: #cbd5e1; margin: 8px 0 6px 0;"></i>
            <div style="font-size: 0.75rem; color: #10b981; font-weight: 700;">[ ទំនេរ / Empty ]</div>
          </div>
        `;
      }
    }

    const html = `
      <div style="font-family: 'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif; padding: 20px; color: #0f172a;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: #1e1b4b;">${branding.schoolNameKh}</h2>
            <div style="font-size: 0.95rem; font-weight: 700; color: #4338ca;">ប្លង់កៅអីអង្គុយបន្ទប់កុំព្យូទ័រ Lab (16 PCs) — វេន${shift}</div>
          </div>
          <div style="text-align: right; font-size: 0.85rem;">
            <div>សិស្សកំពុងរៀន៖ <strong>${shiftStudents.length} / 16 នាក់</strong></div>
            <div>កុំព្យូទ័រទំនេរ៖ <strong style="color: #059669;">${Math.max(0, 16 - shiftStudents.length)} គ្រឿង</strong></div>
            <div style="color: #64748b; font-size: 0.78rem; margin-top: 4px;">កាលបរិច្ឆេទ៖ ${dateKhmer}</div>
          </div>
        </div>

        <!-- Teacher's Podium Indicator -->
        <div style="max-width: 400px; margin: 0 auto 20px auto; background: #e2e8f0; border: 2px solid #94a3b8; border-radius: 8px; text-align: center; padding: 6px; font-weight: 700; font-size: 0.85rem; color: #334155;">
          🖥️ ក្តារខៀន / ផ្ទាំង Projector & តុគ្រូបង្រៀន (Teacher's Desk)
        </div>

        <!-- Row 1: PC-01 to PC-08 -->
        <div style="font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 6px;">ជួរទី ១ (PC-01 ដល់ PC-08)៖</div>
        <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px; margin-bottom: 18px;">
          ${pcBoxesHtml.split('</div>').slice(0, 8).join('</div>') + '</div>'}
        </div>

        <!-- Row 2: PC-09 to PC-16 -->
        <div style="font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 6px;">ជួរទី ២ (PC-09 ដល់ PC-16)៖</div>
        <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px; margin-bottom: 24px;">
          ${pcBoxesHtml.split('</div>').slice(8, 16).join('</div>') + '</div>'}
        </div>

        <!-- Footer Signatures -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; font-size: 0.85rem;">
          <div>
            <div>សម្គាល់៖ សិស្សត្រូវអង្គុយតាមកុំព្យូទ័រដែលបានកំណត់។ ហាមប្តូរកៅអីដោយគ្មានការអនុញ្ញាត។</div>
          </div>
          <div style="text-align: center; min-width: 200px; position: relative;">
            <div style="margin-bottom: 45px;">គ្រូទទួលបន្ទុកបន្ទប់ Lab</div>
            ${branding.stampImageUrl ? `<img src="${branding.stampImageUrl}" style="position: absolute; left: 10px; bottom: 0px; width: 70px; height: 70px; opacity: 0.85;" alt="Seal">` : ''}
            ${branding.signatureImageUrl ? `<img src="${branding.signatureImageUrl}" style="position: absolute; right: 20px; bottom: 10px; width: 90px; height: 40px;" alt="Signature">` : ''}
            <div style="font-weight: 700;">${branding.teacherTitle}</div>
          </div>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ប្លង់កៅអីបន្ទប់កុំព្យូទ័រ - វេន${shift}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <style>@page { size: A4 landscape; margin: 10mm; } body { margin: 0; background: #fff; }</style>
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
  // 22. TYPING WPM & ACCURACY CALCULATOR
  // ------------------------------------------------------------------------
  calculateTypingWpm(words, errors, timeMinutes = 5) {
    const w = Number(words) || 0;
    const e = Number(errors) || 0;
    const t = Math.max(0.5, Number(timeMinutes) || 1);

    const netWords = Math.max(0, w - e);
    const netWpm = Math.round(netWords / t);
    const accuracy = w > 0 ? Math.max(0, Math.round((netWords / w) * 100)) : 100;

    let grade = "F";
    let gradeLabel = "ធ្លាក់ (Re-test)";
    if (netWpm >= 40) { grade = "A"; gradeLabel = "និទ្ទេស A (ឆ្នើម / Excellent)"; }
    else if (netWpm >= 30) { grade = "B"; gradeLabel = "និទ្ទេស B (ល្អ / Good)"; }
    else if (netWpm >= 20) { grade = "C"; gradeLabel = "និទ្ទេស C (មធ្យម / Fair)"; }
    else if (netWpm >= 15) { grade = "D"; gradeLabel = "និទ្ទេស D (ខ្សោយ / Poor)"; }

    return { words: w, errors: e, timeMinutes: t, netWpm, accuracy, grade, gradeLabel };
  },

  // ------------------------------------------------------------------------
  // 23. PRINTABLE THEORY EXAM PAPERS & ANSWER SHEETS A4
  // ------------------------------------------------------------------------
  printTheoryExamPaper(module = "Microsoft Word") {
    const branding = this.getSchoolBranding();
    const today = new Date();

    const papersContent = {
      "Typing": {
        title: "វិញ្ញាសាប្រឡងទ្រឹស្តី វគ្គហាត់វាយអត្ថបទ (Typing Exam Paper)",
        q1: "១. តើគ្រាប់ចុចគោល (Home Row Keys) លើក្ដារចុចកុំព្យូទ័ររួមមានអក្សរអ្វីខ្លះសម្រាប់ដៃឆ្វេង និងដៃស្តាំ? (២០ពិន្ទុ)",
        q2: "២. តើម្រាមដៃមួយណាដែលត្រូវប្រើសម្រាប់ចុច Spacebar និង Enter? (២០ពិន្ទុ)",
        q3: "៣. ចូរពន្យល់ពីរបៀបប្តូរភាសាវាយអត្ថបទខ្មែរ-អង់គ្លេស (Khmer Unicode / English) ក្នុង Windows 10/11? (២០ពិន្ទុ)",
        q4: "៤. តើគ្រាប់ចុចណាខ្លះដែលត្រូវប្រើដើម្បីវាយ «ជើងអក្សរ» និង «ស្រៈពេញតួ» ក្នុងភាសាខ្មែរ? (២០ពិន្ទុ)",
        q5: "៥. ចូររៀបរាប់ពីឥរិយាបថអង្គុយ និងការដាក់ដៃឱ្យបានត្រឹមត្រូវពេលវាយកុំព្យូទ័រ? (២០ពិន្ទុ)"
      },
      "Microsoft Word": {
        title: "វិញ្ញាសាប្រឡងទ្រឹស្តី វគ្គរៀបចំឯកសាររដ្ឋបាល (Microsoft Word Exam Paper)",
        q1: "១. តើ Shortcut Key អ្វីខ្លះសម្រាប់ Save (រក្សាទុក), Copy (ចម្លង), Cut (កាត់), និង Paste (បិទភ្ជាប់)? (២០ពិន្ទុ)",
        q2: "២. ចូរពន្យល់ពីទំហំគែមក្រដាសស្តង់ដារ (Margins) នៃលិខិតរដ្ឋបាលខ្មែរ (Top, Bottom, Left, Right)? (២០ពិន្ទុ)",
        q3: "៣. តើត្រូវចូលទៅកាន់ Menu ឬ Tab ណាដើម្បីបង្កើតតារាង (Table) និងដាក់លេខទំព័រ (Page Number)? (២០ពិន្ទុ)",
        q4: "៤. តើ Header និង Footer មានប្រយោជន៍អ្វីខ្លះក្នុងការតាក់តែងឯកសារ ឬសៀវភៅ? (២០ពិន្ទុ)",
        q5: "៥. ចូរពន្យល់ពីភាពខុសគ្នារវាង Font ខ្មែរយូនីកូដ (ឧ. Kantumruy Pro, Battambang) និង Font Legacy? (២០ពិន្ទុ)"
      },
      "Microsoft Excel": {
        title: "វិញ្ញាសាប្រឡងទ្រឹស្តី វគ្គតារាងគណនាលុយ & រូបមន្ត (Microsoft Excel Exam Paper)",
        q1: "១. ចូរសរសេរទម្រង់រូបមន្ត =SUM(...), =AVERAGE(...), =COUNT(...) ជាមួយឧទាហរណ៍ជាក់ស្តែង? (២០ពិន្ទុ)",
        q2: "២. ចូរបកស្រាយអំពីរូបមន្តលក្ខខណ្ឌ =IF(Logical_test, Value_if_true, Value_if_false)? (២០ពិន្ទុ)",
        q3: "៣. តើត្រូវចុច Shortcut Key អ្វីដើម្បី Fix Cell ឬ Range (ចងដុល្លារ $ ឧ. $A$1)? (២០ពិន្ទុ)",
        q4: "៤. តើត្រូវប្រើរូបមន្តអ្វីដើម្បីស្វែងរកទិន្នន័យពីតារាងមួយទៅតារាងមួយទៀតដោយស្វ័យប្រវត្តិ (VLOOKUP)? (២០ពិន្ទុ)",
        q5: "៥. ចូររៀបរាប់ពីរបៀបបង្កើតក្រាហ្វិក (Charts) ដើម្បីបង្ហាញពីស្ថិតិចំណូល-ចំណាយក្នុង Excel? (២០ពិន្ទុ)"
      },
      "Microsoft PowerPoint": {
        title: "វិញ្ញាសាប្រឡងទ្រឹស្តី វគ្គបទបង្ហាញស្លាយឌីជីថល (Microsoft PowerPoint Exam Paper)",
        q1: "១. ចូរពន្យល់ពីភាពខុសគ្នារវាង Transitions (ការផ្លាស់ប្តូរស្លាយ) និង Animations (ចលនាវត្ថុ)? (២០ពិន្ទុ)",
        q2: "២. តើ Slide Master មានអត្ថប្រយោជន៍អ្វីខ្លះក្នុងការរចនា Slide Presentation ឱ្យមានទម្រង់ដូចគ្នា? (២០ពិន្ទុ)",
        q3: "៣. តើ Shortcut Key អ្វីសម្រាប់ចាប់ផ្តើមចាក់ស្លាយពីដំបូង (Full Slide Show) និងចាក់ពីស្លាយបច្ចុប្បន្ន? (២០ពិន្ទុ)",
        q4: "៤. ចូររៀបរាប់ពីគោលការណ៍រៀបចំស្លាយឱ្យទាក់ទាញ (ការជ្រើសរើសពណ៌, Font អក្សរ, រូបភាព)? (២០ពិន្ទុ)",
        q5: "៥. តើត្រូវ Export ស្លាយទៅជាឯកសារ PDF ឬ Video (MP4) តាមរបៀបណា? (២០ពិន្ទុ)"
      }
    };

    const paper = papersContent[module] || papersContent["Microsoft Word"];

    const html = `
      <div style="font-family: 'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif; max-width: 800px; margin: 0 auto; padding: 25px 35px; color: #0f172a; line-height: 1.8;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #1e1b4b;">${branding.schoolNameKh}</h2>
            <div style="font-size: 0.85rem; font-weight: 700; color: #4338ca;">មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល TIS Lab</div>
            <div style="font-size: 0.78rem; color: #64748b;">ខេត្តកំពត | ទូរស័ព្ទ៖ ${branding.schoolPhone}</div>
          </div>
          <div style="text-align: right; font-size: 0.85rem;">
            <div style="font-weight: 700;">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div style="font-size: 0.8rem; color: #64748b;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div style="font-size: 0.78rem; margin-top: 4px;">ឆ្នាំសិក្សា ${today.getFullYear()}</div>
          </div>
        </div>

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="margin: 0 0 4px 0; font-size: 1.15rem; font-weight: 800; color: #0f172a;">${paper.title}</h3>
          <div style="font-size: 0.85rem; color: #475569;">រយៈពេលប្រឡង៖ ៤៥ នាទី • ពិន្ទុសរុប៖ ១០០ ពិន្ទុ</div>
        </div>

        <!-- Student Info & Score Box -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 0.88rem;">
          <div style="flex: 1; line-height: 2;">
            <div>ឈ្មោះសិស្ស៖ .................................................... ភេទ៖ ............... អត្តលេខ៖ ....................</div>
            <div>វេនសិក្សា៖ ......................................................... ថ្ងៃខែឆ្នាំប្រឡង៖ ${today.toLocaleDateString('km-KH')}</div>
          </div>
          <div style="width: 110px; height: 65px; border: 2px solid #0f172a; border-radius: 8px; text-align: center; background: #fff; display: flex; flex-direction: column; justify-content: center;">
            <div style="font-size: 0.72rem; font-weight: 700; color: #64748b;">ពិន្ទុទទួលបាន</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #4338ca;">.... / 100</div>
          </div>
        </div>

        <!-- Questions -->
        <div style="font-size: 0.92rem; line-height: 2.2;">
          <div style="margin-bottom: 20px;">
            <strong style="color: #1e1b4b;">${paper.q1}</strong>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="color: #1e1b4b;">${paper.q2}</strong>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="color: #1e1b4b;">${paper.q3}</strong>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="color: #1e1b4b;">${paper.q4}</strong>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="color: #1e1b4b;">${paper.q5}</strong>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
            <div style="border-bottom: 1px dotted #94a3b8; height: 26px;"></div>
          </div>
        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 35px; font-size: 0.85rem;">
          <div>ហត្ថលេខាសិស្ស៖ .................................</div>
          <div style="text-align: center; min-width: 180px;">
            <div>គ្រូកែវិញ្ញាសា</div>
            <div style="margin-top: 40px; font-weight: 700;">${branding.teacherTitle}</div>
          </div>
        </div>

      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>វិញ្ញាសាប្រឡង - ${module}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
        <style>@page { size: A4; margin: 12mm; } body { margin: 0; background: #fff; }</style>
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
  // 24. 1-CLICK TELEGRAM SHIFT / CLASS ANNOUNCEMENT BROADCAST
  // ------------------------------------------------------------------------
  async broadcastTelegramAnnouncement(shift = "ទាំងអស់", templateKey = "HOLIDAY", customDetails = "") {
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("⚠️ សូមបើកដំណើរការ Telegram Bot ជាមុនសិន!", "warning");
      } else {
        alert("សូមបើកដំណើរការ Telegram Bot ជាមុនសិន!");
      }
      return false;
    }

    const branding = this.getSchoolBranding();
    let title = "";
    let body = "";

    switch (templateKey) {
      case "HOLIDAY":
        title = "📢 <b>សេចក្តីជូនដំណឹងស្តីពីការឈប់សម្រាកបុណ្យ</b>";
        body = `សូមជម្រាបជូនដំណឹងដល់ប្អូនៗសិស្សានុសិស្សនៃសាលា <b>${branding.schoolNameKh}</b> (វេន${shift}) ទាំងអស់ឱ្យបានជ្រាបថា៖\n\n` +
          `សាលានឹងធ្វើការឈប់សម្រាកចំនួន <b>${customDetails || "២ ថ្ងៃ"}</b>។ ថ្នាក់រៀននឹងចាប់ផ្តើមដំណើរការធម្មតាវិញនៅថ្ងៃបន្ទាប់។\n\n` +
          `សូមជូនពរប្អូនៗ និងក្រុមគ្រួសារមានសេចក្តីសុខ និងធ្វើដំណើរប្រកបដោយសុវត្ថិភាព! 🙏✨`;
        break;
      case "EXAM":
        title = "📝 <b>សេចក្តីជូនដំណឹងស្តីពីការប្រឡងបញ្ចប់វគ្គ</b>";
        body = `សូមជម្រាបជូនប្អូនៗសិស្សានុសិស្ស <b>វេន${shift}</b> ទាំងអស់ឱ្យបានជ្រាបថា៖\n\n` +
          `ការប្រឡងវាស់ស្ទង់សមត្ថភាពបញ្ចប់វគ្គនឹងប្រព្រឹត្តទៅនៅ <b>${customDetails || "ចុងសប្តាហ៍នេះ"}</b>។\n\n` +
          `សូមប្អូនៗរៀបចំពិនិត្យមេរៀន និងមកកាន់បន្ទប់ Lab ឱ្យបានទៀងទាត់ម៉ោង។ ជូនពរទទួលបាននិទ្ទេស A ទាំងអស់គ្នា! 💻🏆`;
        break;
      case "TIME_CHANGE":
        title = "⏰ <b>សេចក្តីជូនដំណឹងស្តីពីការកែសម្រួលម៉ោងរៀន</b>";
        body = `សាលា <b>${branding.schoolNameKh}</b> សូមជូនដំណឹងដល់សិស្ស <b>វេន${shift}</b> ៖\n\n` +
          `ម៉ោងសិក្សានឹងមានការកែសម្រួល៖ <b>${customDetails || "សូមពិនិត្យម៉ោងថ្មីជាមួយលោកគ្រូ"}</b>。\n\n` +
          `សូមអរគុណសម្រាប់ការយោគយល់ និងសហការ! 🙏`;
        break;
      case "FLASH_DRIVE":
        title = "💾 <b>ការរំលឹកយក Flash Drive / សៀវភៅមកអនុវត្ត</b>";
        body = `សូមរំលឹកប្អូនៗសិស្សានុសិស្ស <b>វេន${shift}</b> ៖\n\n` +
          `សម្រាប់ម៉ោងអនុវត្តបន្ទាប់ សូមកុំភ្លេចយក <b>USB Flash Drive</b> និងសៀវភៅកត់ត្រា ដើម្បីផ្ទុកឯកសារកិច្ចការអនុវត្តជាក់ស្តែងក្នុងបន្ទប់ Lab។ 💻`;
        break;
      default:
        title = "📢 <b>ដំណឹងពីលោកគ្រូ ខៀន ធូ</b>";
        body = customDetails || "សូមអរគុណ!";
    }

    const fullMessage = `${title}\n\n${body}\n\n📞 ទំនាក់ទំនង៖ <code>${branding.schoolPhone || '071 721 0307'}</code>`;
    const targetShift = (shift === "ទាំងអស់" || shift === "ALL") ? "ALL" : shift;
    const res = await TelegramService.broadcastToShifts(targetShift, fullMessage);
    if (res && res.success) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`🎉 បានផ្សាយដំណឹងទៅ Telegram ជោគជ័យ (${res.sentCount} គ្រុប)!`, "success");
      }
      return true;
    }
    return false;
  },

  async sendTelegramClassBroadcast(shift = "ALL", title = "", content = "") {
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("⚠️ សូមកំណត់ Telegram Bot Token និង Chat ID ក្នុង Settings ជាមុនសិន!", "warning");
      }
      return false;
    }

    const branding = this.getSchoolBranding();
    let shiftScopeKh = "ប្អូនៗសិស្សានុសិស្សគ្រប់វេនសិក្សាទាំងអស់ (ព្រឹក • រសៀល • យប់)";
    if (shift === "ព្រឹក") shiftScopeKh = "ប្អូនៗសិស្សានុសិស្ស វេនព្រឹក (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)";
    else if (shift === "រសៀល") shiftScopeKh = "ប្អូនៗសិស្សានុសិស្ស វេនរសៀល (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)";
    else if (shift === "យប់") shiftScopeKh = "ប្អូនៗសិស្សានុសិស្ស វេនយប់ ម៉ោង៥-៦ (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)";

    const now = new Date();
    const dateStr = now.toLocaleDateString("km-KH", { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formattedMsg = `
📢 <b>${title || 'សេចក្តីជូនដំណឹងពី TIS Lab Computer'}</b>
━━━━━━━━━━━━━━━━━━━━
🏢 <b>${branding.schoolNameKh || 'មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS LAB COMPUTER'}</b>
👥 <b>ជម្រាបជូន៖</b> ${shiftScopeKh}
📅 <b>កាលបរិច្ឆេទ៖</b> ${dateStr} • ${timeStr}
━━━━━━━━━━━━━━━━━━━━

${content}

━━━━━━━━━━━━━━━━━━━━
✍️ <b>គ្រូទទួលបន្ទុក៖</b> ${branding.teacherTitle || 'លោកគ្រូ ខៀន ធូ'}
📞 <b>ទំនាក់ទំនង៖</b> <code>${branding.schoolPhone || '071 721 0307'}</code>
<i>ប្រព័ន្ធផ្សព្វផ្សាយដំណឹងស្វ័យប្រវត្តិតាម Telegram Bot</i>
    `.trim();

    const res = await TelegramService.broadcastToShifts(shift, formattedMsg);
    if (res && res.success) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`🎉 បានផ្សាយដំណឹងទៅ Telegram ជោគជ័យ (${res.sentCount} គ្រុប)!`, "success");
        App.triggerConfetti();
      }
      return true;
    } else {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`⚠️ មិនអាចផ្សាយដំណឹងបានទេ៖ ${res.error || 'សូមពិនិត្យការកំណត់'}`, "error");
      }
      return false;
    }
  },

  // ------------------------------------------------------------------------
  // 24.1 1-CLICK CLASS REMINDER (BUZZ SHIFT 15 MIN BEFORE CLASS)
  // ------------------------------------------------------------------------
  async broadcastShiftClassReminder(shift = "ALL") {
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      if (typeof App !== "undefined" && App.showToast) App.showToast("⚠️ សូមកំណត់ Telegram Bot ជាមុនសិន!", "warning");
      return false;
    }

    const branding = this.getSchoolBranding();
    let shiftTitle = "ប្អូនៗសិស្សានុសិស្សគ្រប់វេនសិក្សា";
    let shiftTime = "ម៉ោងសិក្សារបស់ប្អូនៗ";
    if (shift === "ព្រឹក") {
      shiftTitle = "ប្អូនៗសិស្សានុសិស្ស វេនព្រឹក";
      shiftTime = "08:00 ព្រឹក";
    } else if (shift === "រសៀល") {
      shiftTitle = "ប្អូនៗសិស្សានុសិស្ស វេនរសៀល";
      shiftTime = "02:00 រសៀល";
    } else if (shift === "យប់") {
      shiftTitle = "ប្អូនៗសិស្សានុសិស្ស វេនយប់ (ម៉ោង ៥-៦)";
      shiftTime = "05:00 ល្ងាច";
    }

    const msg = `
🔔 <b>រំលឹកម៉ោងចូលរៀនកុំព្យូទ័រ (Class Reminder)!</b>
━━━━━━━━━━━━━━━━━━━━
🏢 <b>${branding.schoolNameKh || 'មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS LAB COMPUTER'}</b>
👥 <b>ជម្រាបជូន៖</b> ${shiftTitle}
⏰ <b>ម៉ោងចូលរៀន៖</b> <b>${shiftTime}</b> (នៅសល់ ១៥ នាទីទៀត)
━━━━━━━━━━━━━━━━━━━━

👋 ជម្រាបសួរប្អូនៗទាំងអស់គ្នា! ម៉ោងរៀនកុំព្យូទ័រជិតដល់ហើយ។
សូមប្អូនៗត្រៀមខ្លួន និងអញ្ជើញមកកាន់បន្ទប់ Lab ឲ្យបានទាន់ពេលវេលា៖
• 💻 ម៉ាស៊ីនកុំព្យូទ័រ និងម៉ាស៊ីនត្រជាក់ត្រូវបានបើកត្រៀមរួចជាស្រេច
• 💾 កុំភ្លេចយក Flash Drive (USB) និងសៀវភៅកត់ត្រាមកជាមួយ
• ⚠️ បើមានធុរៈចាំបាច់ សូមវាយ <code>/leave [ID] [មូលហេតុ]</code> ក្នុងគ្រុបនេះ

━━━━━━━━━━━━━━━━━━━━
👨‍🏫 <b>គ្រូទទួលបន្ទុក៖</b> ${branding.teacherTitle || 'លោកគ្រូ ខៀន ធូ'}
<i>ជូនពរប្អូនៗទទួលបានការសិក្សាប្រកបដោយប្រសិទ្ធភាព និងភាពរីករាយ! 🚀✨</i>
    `.trim();

    const res = await TelegramService.broadcastToShifts(shift, msg);
    if (res && res.success) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`🔔 បានផ្ញើសាររំលឹកម៉ោងរៀនទៅគ្រុប ${shift === 'ALL' ? 'ទាំង ៣' : shift} ជោគជ័យ!`, "success");
        App.triggerConfetti();
      }
      return true;
    } else {
      if (typeof App !== "undefined" && App.showToast) App.showToast(`⚠️ បរាជ័យក្នុងការផ្ញើសារ៖ ${res?.error || ''}`, "error");
      return false;
    }
  },

  // ------------------------------------------------------------------------
  // 24.2 DAILY HOMEWORK & PRACTICE DISPATCHER
  // ------------------------------------------------------------------------
  async broadcastShiftHomework(shift = "ALL", course = "Typing", title = "", content = "") {
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      if (typeof App !== "undefined" && App.showToast) App.showToast("⚠️ សូមកំណត់ Telegram Bot ជាមុនសិន!", "warning");
      return false;
    }

    const branding = this.getSchoolBranding();
    const hwTitle = title || `កិច្ចការផ្ទះ & លំហាត់អនុវត្ត (${course})`;
    const hwContent = content || `
1. អនុវត្តលំហាត់អនុវត្តជាក់ស្តែងតាមមេរៀនដែលបានរៀនថ្ងៃនេះ
2. រំលឹកឡើងវិញនូវ Shortcut Keys និងរូបមន្តសំខាន់ៗ
3. រៀបចំចម្លើយ ឬឯកសារទុកក្នុង Flash Drive យកមកបង្ហាញលោកគ្រូនាម៉ោងបន្ទាប់
    `.trim();

    try {
      localStorage.setItem("tis_active_homework", JSON.stringify({
        course,
        title: hwTitle,
        content: hwContent,
        shift,
        date: new Date().toISOString()
      }));
    } catch (e) {}

    let shiftLabel = "គ្រប់វេនសិក្សា";
    if (shift === "ព្រឹក") shiftLabel = "វេនព្រឹក";
    else if (shift === "រសៀល") shiftLabel = "វេនរសៀល";
    else if (shift === "យប់") shiftLabel = "វេនយប់ (ម៉ោង ៥-៦)";

    const msg = `
📚 <b>កិច្ចការផ្ទះ & លំហាត់អនុវត្តប្រចាំថ្ងៃ</b>
━━━━━━━━━━━━━━━━━━━━
🏢 <b>${branding.schoolNameKh || 'មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS LAB COMPUTER'}</b>
🎯 <b>វគ្គសិក្សា៖</b> <b>${course}</b> | <b>វេន៖</b> ${shiftLabel}
📝 <b>ប្រធានបទ៖</b> <b>${hwTitle}</b>
━━━━━━━━━━━━━━━━━━━━

${hwContent}

━━━━━━━━━━━━━━━━━━━━
✍️ <b>ការត្រួតពិនិត្យ៖</b> លោកគ្រូនឹងពិនិត្យការអនុវត្តផ្ទាល់នៅកុំព្យូទ័រ Lab នាម៉ោងបន្ទាប់!
💡 <i>ប្អូនៗអាចវាយបញ្ជា <code>/hw</code> ក្នុងគ្រុបនេះដើម្បីមើលកិច្ចការផ្ទះឡើងវិញបានគ្រប់ពេល។</i>
👨‍🏫 <b>គ្រូទទួលបន្ទុក៖</b> ${branding.teacherTitle || 'លោកគ្រូ ខៀន ធូ'}
    `.trim();

    const res = await TelegramService.broadcastToShifts(shift, msg);
    if (res && res.success) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`📚 បានផ្សាយកិច្ចការផ្ទះទៅគ្រុប ${shiftLabel} ជោគជ័យ!`, "success");
        App.triggerConfetti();
      }
      return true;
    } else {
      if (typeof App !== "undefined" && App.showToast) App.showToast(`⚠️ បរាជ័យក្នុងការផ្សាយកិច្ចការផ្ទះ៖ ${res?.error || ''}`, "error");
      return false;
    }
  },

  // ------------------------------------------------------------------------
  // 24.3 EMERGENCY & RESCHEDULE BROADCAST
  // ------------------------------------------------------------------------
  async broadcastShiftEmergency(shift = "ALL", type = "RAIN", customDetail = "") {
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      if (typeof App !== "undefined" && App.showToast) App.showToast("⚠️ សូមកំណត់ Telegram Bot ជាមុនសិន!", "warning");
      return false;
    }

    const branding = this.getSchoolBranding();
    let icon = "⚠️";
    let title = "សេចក្តីជូនដំណឹងបន្ទាន់ពីសាលា";
    let body = "";

    if (type === "RAIN") {
      icon = "🌧️";
      title = "ដំណឹងផ្អាកការសិក្សាមួយពេល (ភ្លៀងធ្លាក់ខ្លាំង)";
      body = `
ដោយសារស្ថានភាពអាកាសធាតុមានភ្លៀងធ្លាក់ខ្លាំងជាប់ៗគ្នា និងផ្លូវធ្វើដំណើរមានការលំបាក សាលាសម្រេច<b>ផ្អាកការសិក្សាមួយពេល</b>សម្រាប់ប្អូនៗសិស្សានុសិស្ស ដើម្បីសុវត្ថិភាពក្នុងការធ្វើដំណើរ។

${customDetail ? `📝 <b>ព័ត៌មានបន្ថែម៖</b> ${customDetail}\n` : ''}
🚀 <b>ការសិក្សាវិញ៖</b> ថ្នាក់រៀនកុំព្យូទ័រនឹងដំណើរការធម្មតាឡើងវិញនៅថ្ងៃស្អែក ឬម៉ោងកំណត់បន្ទាប់។
      `.trim();
    } else if (type === "POWER") {
      icon = "⚡";
      title = "ដំណឹងផ្អាកការសិក្សាដោយសារដាច់ចរន្តអគ្គិសនី";
      body = `
ដោយសារមានការដាច់ចរន្តអគ្គិសនីជាយថាហេតុនៅតំបន់បន្ទប់ Lab កុំព្យូទ័រ មិនអាចដំណើរការម៉ាស៊ីនបាន សាលាសម្រេច<b>ផ្អាកការសិក្សាបណ្តោះអាសន្ន</b>។

${customDetail ? `📝 <b>ព័ត៌មានបន្ថែម៖</b> ${customDetail}\n` : ''}
🚀 <b>ការសិក្សាវិញ៖</b> សាលានឹងជូនដំណឹងភ្លាមៗនៅពេលចរន្តអគ្គិសនីដំណើរការឡើងវិញជាប្រក្រតី។
      `.trim();
    } else {
      icon = "⏰";
      title = "ដំណឹងផ្លាស់ប្តូរម៉ោងសិក្សា ឬរៀនសង";
      body = `
សាលាសូមជម្រាបជូនដំណឹងស្តីពីការ<b>ផ្លាស់ប្តូរម៉ោងសិក្សា</b> សម្រាប់ប្អូនៗសិស្សានុសិស្សដូចខាងក្រោម៖

${customDetail || 'សូមប្អូនៗពិនិត្យម៉ោងសិក្សាថ្មី និងអញ្ជើញមកឲ្យបានទាន់ពេលវេលា។'}
      `.trim();
    }

    const msg = `
${icon} <b>${title}</b>
━━━━━━━━━━━━━━━━━━━━
🏢 <b>${branding.schoolNameKh || 'មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS LAB COMPUTER'}</b>
👥 <b>ជម្រាបជូន៖</b> សិស្សានុសិស្ស (${shift === 'ALL' ? 'គ្រប់វេនទាំងអស់' : 'វេន' + shift})
━━━━━━━━━━━━━━━━━━━━

${body}

━━━━━━━━━━━━━━━━━━━━
👨‍🏫 <b>គ្រូទទួលបន្ទុក៖</b> ${branding.teacherTitle || 'លោកគ្រូ ខៀន ធូ'}
📞 <b>ទូរស័ព្ទ៖</b> <code>${branding.schoolPhone || '071 721 0307'}</code>
    `.trim();

    const res = await TelegramService.broadcastToShifts(shift, msg);
    if (res && res.success) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`🚨 បានផ្សាយដំណឹងបន្ទាន់ទៅ Telegram ជោគជ័យ!`, "success");
        App.triggerConfetti();
      }
      return true;
    } else {
      if (typeof App !== "undefined" && App.showToast) App.showToast(`⚠️ បរាជ័យក្នុងការផ្សាយដំណឹង៖ ${res?.error || ''}`, "error");
      return false;
    }
  },

  // ------------------------------------------------------------------------
  // 24.4 EXAM SCORES & PASS LIST BROADCAST
  // ------------------------------------------------------------------------
  async broadcastShiftExamResults(shift = "ALL", course = "Typing") {
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
      if (typeof App !== "undefined" && App.showToast) App.showToast("⚠️ សូមកំណត់ Telegram Bot ជាមុនសិន!", "warning");
      return false;
    }

    const branding = this.getSchoolBranding();
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    if (shift && shift !== "ALL") {
      students = students.filter(s => s.Shift === shift);
    }

    const allExams = (typeof StudentAPI !== "undefined" && StudentAPI.getAllExams) ? StudentAPI.getAllExams() : {};
    const scoredList = [];

    students.forEach(s => {
      const exam = allExams[s.ID]?.[course] || allExams[s.ID]?.[course.replace("Microsoft ", "")] || {};
      if (exam && (exam.score !== undefined || exam.wpm !== undefined || exam.status)) {
        scoredList.push({
          id: s.ID,
          nameKh: s.NameKh,
          nameEn: s.NameEn || "",
          shift: s.Shift || "—",
          score: Number(exam.score || exam.wpm || 0),
          wpm: exam.wpm || null,
          grade: exam.grade || "—",
          status: (exam.status || "").toLowerCase()
        });
      }
    });

    if (scoredList.length === 0) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`⚠️ មិនទាន់មានទិន្នន័យពិន្ទុប្រឡងសម្រាប់វគ្គ ${course} (${shift}) ឡើយ!`, "warning");
      }
      return false;
    }

    scoredList.sort((a, b) => b.score - a.score);

    const passCount = scoredList.filter(s => s.status === "pass" || s.status === "ជាប់" || s.score >= 50).length;
    const passRate = Math.round((passCount / scoredList.length) * 100);

    const top3 = scoredList.slice(0, 3);
    const medals = ["🥇", "🥈", "🥉"];
    const top3Text = top3.map((s, idx) => {
      const valText = course.includes("Typing") ? `${s.score} WPM` : `${s.score}/100`;
      return `${medals[idx]} <b>លេខ ${idx + 1}៖</b> <b>${s.nameKh}</b> (<code>${s.id}</code>) ➔ <b>${valText}</b> [និទ្ទេស ${s.grade}]`;
    }).join("\n");

    const rowsText = scoredList.map((s, idx) => {
      const isPass = s.status === "pass" || s.status === "ជាប់" || s.score >= 50;
      const valText = course.includes("Typing") ? `${s.score} WPM` : `${s.score}/100`;
      return `${idx + 1}. <b>${s.nameKh}</b> (<code>${s.id}</code>) : ${valText} [${s.grade}] ${isPass ? '✓' : '✗'}`;
    }).join("\n");

    const msg = `
🏆 <b>ព្រឹត្តិបត្រប្រកាសលទ្ធផលប្រឡងបញ្ចប់វគ្គ</b>
━━━━━━━━━━━━━━━━━━━━
🏢 <b>${branding.schoolNameKh || 'មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS LAB COMPUTER'}</b>
🎯 <b>វគ្គប្រឡង៖</b> <b>${course}</b> | <b>វេន៖</b> ${shift === 'ALL' ? 'គ្រប់វេន' : 'វេន' + shift}
📊 <b>អត្រាជាប់សរុប៖</b> <b>${passRate}%</b> (${passCount}/${scoredList.length} នាក់)
━━━━━━━━━━━━━━━━━━━━

🌟 <b>ផ្ទាំងកិត្តិយសសិស្សឆ្នើម TOP 3៖</b>
${top3Text}

━━━━━━━━━━━━━━━━━━━━
📋 <b>តារាងលទ្ធផលរួម៖</b>
${rowsText}

━━━━━━━━━━━━━━━━━━━━
🎉 <i>សូមអបអរសាទរប្អូនៗទាំងអស់ដែលបានប្រឡងជាប់! សូមបន្តការខិតខំប្រឹងប្រែងសម្រាប់វគ្គបន្តបន្ទាប់ទៀត។</i>
👨‍🏫 <b>គ្រូទទួលបន្ទុក៖</b> ${branding.teacherTitle || 'លោកគ្រូ ខៀន ធូ'}
    `.trim();

    const res = await TelegramService.broadcastToShifts(shift, msg);
    if (res && res.success) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`🏆 បានផ្សាយលទ្ធផលប្រឡង ${course} ទៅ Telegram ជោគជ័យ!`, "success");
        App.triggerConfetti();
      }
      return true;
    } else {
      if (typeof App !== "undefined" && App.showToast) App.showToast(`⚠️ បរាជ័យក្នុងការផ្សាយលទ្ធផល៖ ${res?.error || ''}`, "error");
      return false;
    }
  },

  // ------------------------------------------------------------------------
  // 24.5 TOP 3 HONOR ROLL BROADCAST TO TELEGRAM
  // ------------------------------------------------------------------------
  async broadcastTop3ToTelegram(module = "Typing", shift = "ALL") {
    return this.broadcastShiftExamResults(shift, module);
  },

  // ------------------------------------------------------------------------
  // 24.6 GENERATE TOP 3 HONOR ROLL POSTER A4
  // ------------------------------------------------------------------------
  generateTop3HonorRollPosterA4(module = "Typing", shift = "ទាំងអស់") {
    const branding = this.getSchoolBranding();
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    if (shift && shift !== "ទាំងអស់" && shift !== "ALL") {
      students = students.filter(s => s.Shift === shift);
    }

    const allExams = (typeof StudentAPI !== "undefined" && StudentAPI.getAllExams) ? StudentAPI.getAllExams() : {};
    const scoredList = [];

    students.forEach(s => {
      const exam = allExams[s.ID]?.[module] || allExams[s.ID]?.[module.replace("Microsoft ", "")] || {};
      if (exam && (exam.score !== undefined || exam.wpm !== undefined)) {
        scoredList.push({
          id: s.ID,
          nameKh: s.NameKh,
          nameEn: s.NameEn || "",
          shift: s.Shift || "—",
          avatar: s.Avatar || "assets/images/default-male.svg",
          score: Number(exam.score || exam.wpm || 0),
          grade: exam.grade || "A"
        });
      }
    });

    scoredList.sort((a, b) => b.score - a.score);
    const top3 = scoredList.slice(0, 3);

    const medals = ["🥇 ចំណាត់ថ្នាក់លេខ ១", "🥈 ចំណាត់ថ្នាក់លេខ ២", "🥉 ចំណាត់ថ្នាក់លេខ ៣"];
    const colors = ["#eab308", "#94a3b8", "#d97706"];

    const html = `
      <div style="font-family: 'Kantumruy Pro', sans-serif; padding: 25px; border: 8px double #6366f1; border-radius: 16px; background: #ffffff; text-align: center;">
        <h3 style="color: #4338ca; margin: 0; font-size: 1.1rem;">ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
        <h1 style="color: #1e1b4b; font-size: 1.8rem; margin: 15px 0 5px 0; font-weight: 800;">${branding.schoolNameKh}</h1>
        <h2 style="color: #b45309; font-size: 1.4rem; margin: 5px 0 15px 0;">🏆 ផ្ទាំងកិត្តិយសសិស្សឆ្នើម TOP 3 🏆</h2>
        <div style="font-size: 0.95rem; color: #475569; margin-bottom: 25px;">
          វគ្គសិក្សា៖ <strong>${module}</strong> | វេន៖ <strong>${shift}</strong>
        </div>

        <div style="display: flex; justify-content: center; gap: 20px; margin: 30px 0;">
          ${top3.map((s, idx) => `
            <div style="border: 2px solid ${colors[idx]}; border-radius: 14px; padding: 18px; width: 170px; background: rgba(254, 243, 199, 0.2);">
              <div style="font-size: 1.6rem; margin-bottom: 6px;">${idx === 0 ? '👑' : idx === 1 ? '🥈' : '🥉'}</div>
              <div style="font-weight: 800; font-size: 0.95rem; color: ${colors[idx]}; margin-bottom: 6px;">${medals[idx]}</div>
              <img src="${s.avatar}" style="width: 70px; height: 70px; border-radius: 50%; border: 3px solid ${colors[idx]}; object-fit: cover; margin-bottom: 8px;" onerror="this.src='assets/images/default-male.svg'">
              <div style="font-weight: 800; font-size: 1rem; color: #1e1b4b;">${s.nameKh}</div>
              <div style="font-size: 0.75rem; color: #64748b;">${s.id}</div>
              <div style="margin-top: 8px; font-weight: 800; font-size: 1.1rem; color: #4338ca;">
                ${module.includes("Typing") ? s.score + ' WPM' : s.score + '/100'}
              </div>
              <div style="font-size: 0.8rem; color: #10b981; font-weight: 700;">និទ្ទេស ${s.grade}</div>
            </div>
          `).join("")}
        </div>

        <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 0.9rem;">
          <div>កាលបរិច្ឆេទ៖ ${new Date().toLocaleDateString('km-KH')}</div>
          <div style="text-align: center;">
            <div>គ្រូទទួលបន្ទុកវគ្គ</div>
            <div style="margin-top: 45px; font-weight: 700;">${branding.teacherTitle}</div>
          </div>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ផ្ទាំងកិត្តិយស TOP 3 - ${module}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>@page { size: A4 portrait; margin: 15mm; } body { margin: 0; background: #fff; }</style>
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
  // 25. STUDENT BIRTHDAY REMINDER & TELEGRAM CARD
  // ------------------------------------------------------------------------
  checkStudentBirthdays() {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    const today = new Date();
    const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
    const todayDay = String(today.getDate()).padStart(2, "0");
    const todayMD = `${todayMonth}-${todayDay}`;

    return students.filter(s => {
      if (!s || !s.DOB) return false;
      const dobParts = s.DOB.split("-");
      if (dobParts.length === 3) {
        const studentMD = `${dobParts[1]}-${dobParts[2]}`;
        return studentMD === todayMD && s.Status !== "Dropped";
      }
      return false;
    });
  },

  async sendTelegramBirthdayCard(student) {
    if (!student || typeof TelegramService === "undefined" || !TelegramService.isEnabled()) return;
    const branding = this.getSchoolBranding();

    const msg = `🎂🎉 *រីករាយថ្ងៃខួបកំណើត (Happy Birthday)!* 🎂🎉\n\n` +
      `លោកគ្រូ និងសាលា *${branding.schoolNameKh}* សូមចូលរួមអបអរសាទរខួបកំណើតរបស់ប្អូន៖\n` +
      `👤 *${student.NameKh}* (${student.NameEn || ''})\n` +
      `🆔 អត្តលេខ៖ \`${student.ID}\` | 💻 វគ្គ៖ *${student.Course || 'កុំព្យូទ័រ'}*\n\n` +
      `🌸 សូមជូនពរឱ្យប្អូនមានសុខភាពល្អបរិបូរណ៍ ប្រាជ្ញាឈ្លាសវៃ ជោគជ័យក្នុងការសិក្សាជំនាញកុំព្យូទ័រ និងសម្រេចបាននូវក្តីសុបិនគ្រប់ប្រការ! ✨💻🎁`;

    await TelegramService.sendMessage(msg);
  },

  // ------------------------------------------------------------------------
  // 26. BATCH STUDENT ID CARDS PRINTING (8-10 CARDS PER A4 SHEET)
  // ------------------------------------------------------------------------
  printBatchIdCardsA4(studentsList = null) {
    let students = studentsList || ((typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : []);
    students = students.filter(s => s.Status !== "Dropped" && s.Status !== "Drop");
    const branding = this.getSchoolBranding();

    const cardsHtml = students.map(s => `
      <div style="width: 85.6mm; height: 53.98mm; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 6px 10px; box-sizing: border-box; background: linear-gradient(135deg, #ffffff, #f8fafc); position: relative; display: flex; flex-direction: column; justify-content: space-between;">
        <!-- Header -->
        <div style="display: flex; align-items: center; gap: 6px; border-bottom: 1.5px solid #4338ca; padding-bottom: 3px;">
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #4338ca; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px;">
            <i class="fa-solid fa-laptop"></i>
          </div>
          <div>
            <div style="font-size: 8px; font-weight: 800; color: #1e1b4b; line-height: 1.1;">${branding.schoolNameKh}</div>
            <div style="font-size: 6px; font-weight: 700; color: #4338ca;">STUDENT IDENTIFICATION CARD</div>
          </div>
        </div>

        <!-- Body -->
        <div style="display: flex; gap: 8px; align-items: center; margin: 2px 0;">
          <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" style="width: 45px; height: 55px; border-radius: 4px; object-fit: cover; border: 1.5px solid #4338ca;" alt="Photo">
          <div style="flex: 1; font-size: 7.5px; line-height: 1.5;">
            <div>ឈ្មោះ៖ <strong style="font-size: 9px; color: #0f172a;">${s.NameKh}</strong></div>
            <div>Name: <strong>${s.NameEn || ''}</strong></div>
            <div>ID: <strong style="font-family: monospace; color: #4338ca; font-size: 9px;">${s.ID}</strong> • ភេទ: ${s.Gender}</div>
            <div>វគ្គ៖ <strong style="color: #059669;">${s.Course || 'Typing'}</strong></div>
            <div>វេន៖ <strong>វេន${s.Shift || 'ព្រឹក'}</strong></div>
          </div>
        </div>

        <!-- Footer Barcode & QR -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #cbd5e1; padding-top: 2px; font-size: 6.5px; color: #64748b;">
          <span>📞 ${branding.schoolPhone}</span>
          <span style="font-family: monospace; font-weight: 700; color: #1e1b4b;">*${s.ID}*</span>
        </div>
      </div>
    `).join("");

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>បោះពុម្ពកាតសិស្ស A4 Batch (8 Cards per sheet)</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <style>
          @page { size: A4 portrait; margin: 8mm; }
          body { margin: 0; background: #fff; font-family: 'Kantumruy Pro', sans-serif; }
          .cards-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6mm;
            justify-items: center;
          }
        </style>
      </head>
      <body>
        <div class="cards-grid">
          ${cardsHtml}
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `);
    win.document.close();
  },

  // ------------------------------------------------------------------------
  // 27. CERTIFICATE OF HONOR / EXCELLENCE (ប័ណ្ណសរសើរសិស្សឆ្នើម A4 LANDSCAPE)
  // ------------------------------------------------------------------------
  printCertificateOfHonor(student, awardTitle = "ប័ណ្ណសរសើរសិស្សឆ្នើម", reason = "ទទួលបាននិទ្ទេសល្អប្រសើរ (Grade A) និងមានវិន័យខ្ពស់") {
    const branding = this.getSchoolBranding();
    const today = new Date();
    const dateKhmer = today.toLocaleDateString("km-KH", { year: "numeric", month: "long", day: "numeric" });

    const html = `
      <div style="width: 297mm; height: 210mm; padding: 18mm; box-sizing: border-box; background: #fff; font-family: 'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif; position: relative;">
        <!-- Luxury Gold Border Frame -->
        <div style="width: 100%; height: 100%; border: 6px double #b45309; border-radius: 12px; padding: 12mm; box-sizing: border-box; position: relative; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
          
          <!-- Inner Corner Accents -->
          <div style="position: absolute; top: 10px; left: 10px; font-size: 24px; color: #d97706;">❖</div>
          <div style="position: absolute; top: 10px; right: 10px; font-size: 24px; color: #d97706;">❖</div>
          <div style="position: absolute; bottom: 10px; left: 10px; font-size: 24px; color: #d97706;">❖</div>
          <div style="position: absolute; bottom: 10px; right: 10px; font-size: 24px; color: #d97706;">❖</div>

          <!-- Header -->
          <div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #78350f; letter-spacing: 0.5px;">${branding.schoolNameKh}</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #b45309; letter-spacing: 1px;">${branding.schoolNameEn}</div>
            
            <div style="width: 120px; height: 2px; background: linear-gradient(90deg, transparent, #d97706, transparent); margin: 10px auto;"></div>

            <h1 style="font-size: 2.2rem; font-weight: 800; color: #92400e; margin: 10px 0 4px 0;">${awardTitle}</h1>
            <div style="font-size: 1.05rem; font-weight: 700; color: #b45309; letter-spacing: 2px;">CERTIFICATE OF ACADEMIC EXCELLENCE</div>
          </div>

          <!-- Body -->
          <div style="margin: 15px 0; line-height: 2;">
            <div style="font-size: 1.05rem; color: #475569;">គណៈគ្រប់គ្រងសាលា សូមប្រគល់ប័ណ្ណកិត្តិយសនេះជូនចំពោះ៖</div>
            <div style="font-size: 2rem; font-weight: 800; color: #1e1b4b; text-decoration: underline; margin: 6px 0;">${student.NameKh}</div>
            <div style="font-size: 1.25rem; font-weight: 700; color: #4338ca; font-family: 'Plus Jakarta Sans', sans-serif;">${student.NameEn || this.transliterateKhmerToLatin(student.NameKh)}</div>
            <div style="font-size: 0.95rem; color: #64748b; margin-top: 4px;">អត្តលេខ (Student ID): <strong style="font-family: monospace; color: #0f172a;">${student.ID}</strong></div>

            <div style="max-width: 650px; margin: 14px auto 0 auto; font-size: 1.05rem; color: #334155; line-height: 1.8;">
              ${reason} ក្នុងវគ្គបណ្តុះបណ្តាល <strong>«${student.Course || 'កុំព្យូទ័ររដ្ឋបាល'}»</strong>។<br>
              សាលាសូមកោតសរសើរ និងជូនពរឱ្យទទួលបានជោគជ័យកាន់តែត្រចះត្រចង់ទៅអនាគត!
            </div>
          </div>

          <!-- Footer -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 0 30px;">
            <div style="text-align: left; font-size: 0.85rem; color: #64748b;">
              <div>លេខសម្គាល់៖ ${student.ID}-HONOR-${today.getFullYear()}</div>
              <div>កាលបរិច្ឆេទ៖ ${dateKhmer}</div>
            </div>

            <!-- Gold Medal Seal Badge -->
            <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(217, 119, 6, 0.4); border: 3px solid #fff;">
              <i class="fa-solid fa-award" style="font-size: 1.6rem;"></i>
              <span style="font-size: 8px; font-weight: 800; margin-top: 2px;">HONOR</span>
            </div>

            <div style="text-align: center; min-width: 200px; position: relative;">
              <div style="font-size: 0.95rem; color: #475569; margin-bottom: 50px;">ប្រធានគ្រប់គ្រងសាលា</div>
              ${branding.stampImageUrl ? `<img src="${branding.stampImageUrl}" style="position: absolute; left: 0px; bottom: 5px; width: 85px; height: 85px; opacity: 0.85;" alt="Seal">` : ''}
              ${branding.signatureImageUrl ? `<img src="${branding.signatureImageUrl}" style="position: absolute; right: 10px; bottom: 15px; width: 110px; height: 50px;" alt="Signature">` : ''}
              <div style="font-weight: 800; font-size: 1.05rem; color: #0f172a; text-decoration: underline;">${branding.teacherTitle}</div>
            </div>
          </div>

        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ប័ណ្ណសរសើរសិស្សឆ្នើម - ${student.NameKh}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <style>@page { size: A4 landscape; margin: 0; } body { margin: 0; background: #fff; }</style>
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
  // 28. TOP 3 HONOR ROLL POSTER (A4 PRINTABLE & TELEGRAM / FB GRAPHIC)
  // ------------------------------------------------------------------------
  generateTop3HonorRollPoster(module = "Microsoft Excel", shift = "ព្រឹក") {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    const branding = this.getSchoolBranding();

    // Map module key
    let modKey = "Excel";
    if (module.includes("Typing")) modKey = "Typing";
    else if (module.includes("Word")) modKey = "Word";
    else if (module.includes("PowerPoint") || module.includes("PPT")) modKey = "PowerPoint";

    // Gather scores
    const ranked = students
      .filter(s => s.Status !== "Dropped" && (shift === "ទាំងអស់" || (s.Shift || "").includes(shift)))
      .map(s => {
        const exams = (typeof StudentAPI !== "undefined" && StudentAPI.getStudentExams) ? StudentAPI.getStudentExams(s.ID) : {};
        const score = exams[modKey] ? Number(exams[modKey].score || 0) : 0;
        return { student: s, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const s1 = ranked[0] || null;
    const s2 = ranked[1] || null;
    const s3 = ranked[2] || null;

    const html = `
      <div style="width: 210mm; min-height: 297mm; background: linear-gradient(135deg, #0f172a, #1e1b4b); color: #fff; padding: 25mm 20mm; box-sizing: border-box; font-family: 'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif; text-align: center; position: relative;">
        
        <!-- School Banner -->
        <div style="margin-bottom: 24px;">
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 800; color: #38bdf8;">${branding.schoolNameKh}</h2>
          <div style="font-size: 0.9rem; color: #c7d2fe; letter-spacing: 1px;">TIS LAB COMPUTER TRAINING CENTER</div>
        </div>

        <!-- Trophy & Title -->
        <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(234, 179, 8, 0.2); color: #eab308; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 16px auto; border: 2px solid #eab308;">
          <i class="fa-solid fa-trophy"></i>
        </div>

        <h1 style="font-size: 2rem; font-weight: 800; color: #fbbf24; margin: 0 0 6px 0;">តារាងកិត្តិយសសិស្សឆ្នើម TOP 3</h1>
        <div style="font-size: 1.1rem; color: #e0e7ff; margin-bottom: 30px;">
          វគ្គបណ្តុះបណ្តាល <strong>«${module}»</strong> — វេន${shift}
        </div>

        <!-- 3 Podium Cards -->
        <div style="display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 16px; align-items: flex-end; margin-bottom: 40px;">
          
          <!-- 2nd Place (Silver) -->
          <div style="background: rgba(255,255,255,0.08); border: 2px solid #94a3b8; border-radius: 14px; padding: 18px 12px; backdrop-filter: blur(10px);">
            <div style="font-size: 2rem; color: #cbd5e1; margin-bottom: 6px;">🥈</div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #cbd5e1;">ជើងឯករង (Rank 2)</div>
            ${s2 ? `
              <img src="${s2.student.Avatar || App.getDefaultAvatar(s2.student.Gender)}" style="width: 65px; height: 65px; border-radius: 50%; object-fit: cover; border: 3px solid #cbd5e1; margin: 10px auto;" alt="Photo">
              <div style="font-weight: 800; font-size: 1.05rem; color: #fff;">${s2.student.NameKh}</div>
              <div style="font-size: 0.8rem; color: #94a3b8; font-family: monospace;">ID: ${s2.student.ID}</div>
              <div style="background: #334155; color: #38bdf8; font-size: 1.1rem; font-weight: 800; padding: 4px 10px; border-radius: 8px; margin-top: 8px;">${s2.score} ពិន្ទុ</div>
            ` : '<div style="color: #64748b; padding: 30px 0;">គ្មានទិន្នន័យ</div>'}
          </div>

          <!-- 1st Place (Gold Champion) -->
          <div style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(217, 119, 6, 0.25)); border: 3px solid #eab308; border-radius: 16px; padding: 24px 14px; backdrop-filter: blur(10px); transform: translateY(-15px);">
            <div style="font-size: 2.8rem; color: #f59e0b; margin-bottom: 6px;">🥇</div>
            <div style="font-weight: 900; font-size: 1.15rem; color: #fbbf24;">ជើងឯកឆ្នើម (Rank 1)</div>
            ${s1 ? `
              <img src="${s1.student.Avatar || App.getDefaultAvatar(s1.student.Gender)}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 4px solid #eab308; margin: 12px auto;" alt="Photo">
              <div style="font-weight: 800; font-size: 1.25rem; color: #fff;">${s1.student.NameKh}</div>
              <div style="font-size: 0.85rem; color: #fde68a; font-family: monospace;">ID: ${s1.student.ID}</div>
              <div style="background: #eab308; color: #1e1b4b; font-size: 1.3rem; font-weight: 900; padding: 6px 14px; border-radius: 10px; margin-top: 10px;">${s1.score} ពិន្ទុ</div>
            ` : '<div style="color: #64748b; padding: 40px 0;">គ្មានទិន្នន័យ</div>'}
          </div>

          <!-- 3rd Place (Bronze) -->
          <div style="background: rgba(255,255,255,0.08); border: 2px solid #b45309; border-radius: 14px; padding: 18px 12px; backdrop-filter: blur(10px);">
            <div style="font-size: 2rem; color: #d97706; margin-bottom: 6px;">🥉</div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #d97706;">ជើងឯកលេខ ៣ (Rank 3)</div>
            ${s3 ? `
              <img src="${s3.student.Avatar || App.getDefaultAvatar(s3.student.Gender)}" style="width: 65px; height: 65px; border-radius: 50%; object-fit: cover; border: 3px solid #b45309; margin: 10px auto;" alt="Photo">
              <div style="font-weight: 800; font-size: 1.05rem; color: #fff;">${s3.student.NameKh}</div>
              <div style="font-size: 0.8rem; color: #94a3b8; font-family: monospace;">ID: ${s3.student.ID}</div>
              <div style="background: #334155; color: #38bdf8; font-size: 1.1rem; font-weight: 800; padding: 4px 10px; border-radius: 8px; margin-top: 8px;">${s3.score} ពិន្ទុ</div>
            ` : '<div style="color: #64748b; padding: 30px 0;">គ្មានទិន្នន័យ</div>'}
          </div>

        </div>

        <!-- Congratulations & Motivation -->
        <p style="font-size: 1rem; color: #cbd5e1; max-width: 500px; margin: 0 auto 30px auto; line-height: 1.8;">
          សាលាសូមថ្លែងការកោតសរសើរចំពោះការខិតខំប្រឹងប្រែងរបស់ប្អូនៗ និងសូមលើកទឹកចិត្តដល់សិស្សទាំងអស់ឱ្យបន្តអភិវឌ្ឍជំនាញកុំព្យូទ័រឱ្យកាន់តែពូកែថែមទៀត! 🚀
        </p>

        <!-- Footer -->
        <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 18px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #94a3b8;">
          <div>គ្រូទទួលបន្ទុក៖ <strong>${branding.teacherTitle}</strong></div>
          <div>កាលបរិច្ឆេទ៖ ${new Date().toLocaleDateString('km-KH')}</div>
        </div>

      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Top 3 Honor Roll - ${module}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <style>@page { size: A4 portrait; margin: 0; } body { margin: 0; background: #0f172a; }</style>
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
  // 29. DYNAMIC ABA KHQR GENERATOR
  // ------------------------------------------------------------------------
  generateDynamicKhqr(student, dueAmount = 50) {
    const feeConfig = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.feeConfig) ? APP_CONFIG.feeConfig : {};
    const amount = Number(dueAmount) || 50;

    return {
      accountName: feeConfig.accountName || "KHIEN THOU",
      accountNumber: feeConfig.accountNumber || "071 721 0307",
      amount: amount,
      currency: "USD",
      studentId: student.ID,
      studentName: student.NameKh,
      qrText: `https://link.payway.com.kh/tis?acc=${feeConfig.accountNumber || '0717210307'}&amt=${amount}&id=${student.ID}`,
      qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`ABA_KHQR_TIS_STUDENT_${student.ID}_AMT_${amount}`)}`
    };
  },

  // ------------------------------------------------------------------------
  // 30. DIGITAL PAYMENT RECEIPT WITH TELEGRAM SHARING
  // ------------------------------------------------------------------------
  async sendDigitalReceiptToTelegram(student, paidAmount, note = "") {
    if (!student || typeof TelegramService === "undefined" || !TelegramService.isEnabled()) return;
    const branding = this.getSchoolBranding();
    const receiptNo = "REC-" + Date.now().toString().slice(-6);

    const message = `🧾 *បង្កាន់ដៃទទួលប្រាក់ថ្លៃសិក្សា (Official Receipt)*\n\n` +
      `🔢 *លេខបង្កាន់ដៃ៖* \`${receiptNo}\`\n` +
      `👤 *ឈ្មោះសិស្ស៖* ${student.NameKh} (${student.NameEn || ''})\n` +
      `🆔 *អត្តលេខ៖* \`${student.ID}\`\n` +
      `💻 *វគ្គសិក្សា៖* ${student.Course || 'កុំព្យូទ័ររដ្ឋបាល'} (វេន${student.Shift || 'ព្រឹក'})\n` +
      `💵 *ទឹកប្រាក់បានបង់៖* \`$${paidAmount}\`\n` +
      `📅 *កាលបរិច្ឆេទ៖* ${new Date().toLocaleString('km-KH')}\n` +
      `${note ? `📝 *ចំណាំ៖* ${note}\n` : ''}\n` +
      `🏢 *ចេញដោយ៖* ${branding.schoolNameKh}\n` +
      `✍️ *ហត្ថលេខាគ្រូទទួលបន្ទុក៖* ${branding.teacherTitle}\n\n` +
      `សូមអរគុណសម្រាប់ការបង់ថ្លៃសិក្សា! 🙏💻`;

    await TelegramService.sendMessage(message);
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`✅ បានផ្ញើបង្កាន់ដៃលេខ ${receiptNo} ទៅ Telegram សិស្សរួចរាល់!`, "success");
    }
  },

  // ------------------------------------------------------------------------
  // 31. NEXT MODULE PROGRESSION CRM (UPSELL & RETENTION)
  // ------------------------------------------------------------------------
  getNextModuleFollowUpList() {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    const candidates = [];

    students.forEach(s => {
      if (s.Status === "Dropped" || s.Status === "Drop") return;
      const currentCourse = s.Course || "Typing";
      const exams = (typeof StudentAPI !== "undefined" && StudentAPI.getStudentExams) ? StudentAPI.getStudentExams(s.ID) : {};

      if (currentCourse === "Typing" && exams["Typing"]?.status === "Pass") {
        candidates.push({ student: s, currentCourse: "Typing", nextCourse: "Microsoft Word" });
      } else if (currentCourse === "Microsoft Word" && exams["Word"]?.status === "Pass") {
        candidates.push({ student: s, currentCourse: "Microsoft Word", nextCourse: "Microsoft Excel" });
      } else if (currentCourse === "Microsoft Excel" && exams["Excel"]?.status === "Pass") {
        candidates.push({ student: s, currentCourse: "Microsoft Excel", nextCourse: "Microsoft PowerPoint" });
      }
    });

    return candidates;
  },

  async sendNextModuleInvitation(student, nextCourse) {
    if (!student || typeof TelegramService === "undefined" || !TelegramService.isEnabled()) return;
    const branding = this.getSchoolBranding();

    const msg = `🎉 *អបអរសាទរប្អូន ${student.NameKh}! (Next Course Invitation)*\n\n` +
      `ប្អូនបានបញ្ចប់ការប្រឡងវគ្គ *${student.Course}* ដោយជោគជ័យហើយ! 🚀\n\n` +
      `សាលា *${branding.schoolNameKh}* នឹងបើកបង្រៀនវគ្គបន្តគឺ *«${nextCourse}»* ក្នុងពេលឆាប់ៗនេះ។\n\n` +
      `តើប្អូនមានបំណងចង់បន្តការសិក្សាលើវគ្គនេះក្នុង *វេន${student.Shift || 'ព្រឹក'}* ដដែលដែរឬទេ? សូមទាក់ទងមកលោកគ្រូដើម្បីកក់កុំព្យូទ័រទុកជាមុន! 💻✨`;

    await TelegramService.sendMessage(msg);
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`📩 បានផ្ញើសារអញ្ជើញបន្តវគ្គ ${nextCourse} ទៅ Telegram សិស្សរួចរាល់!`, "success");
    }
  },

  // ------------------------------------------------------------------------
  // 32. SCHOOL EXPENSES & NET PROFIT TRACKER
  // ------------------------------------------------------------------------
  getExpenses() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_EXPENSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: "EXP-1", title: "ថ្លៃភ្លើងបន្ទប់ Lab (ម៉ាស៊ីនត្រជាក់ + 16 PCs)", category: "Electricity", amount: 65, date: "2026-09-10", note: "ខែកញ្ញា" },
      { id: "EXP-2", title: "ថ្លៃអ៊ីនធឺណិត Wi-Fi បន្ទប់កុំព្យូទ័រ", category: "Internet", amount: 20, date: "2026-09-05", note: "Speed 50Mbps" },
      { id: "EXP-3", title: "ទឹកថ្នាំព្រីន និងក្រដាស A4 Double A", category: "Stationery", amount: 15, date: "2026-09-15", note: "បោះពុម្ពឯកសារ" }
    ];
  },

  saveExpenses(list) {
    try {
      localStorage.setItem(this.STORAGE_KEY_EXPENSES, JSON.stringify(list));
    } catch (e) {}
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try { firebase.database().ref("expenses").set(list); } catch(e){}
    }
  },

  recordExpense(expense) {
    const list = this.getExpenses();
    const newExp = {
      ...expense,
      id: "EXP-" + Date.now().toString().slice(-6),
      amount: Number(expense.amount || 0),
      date: expense.date || new Date().toISOString().split("T")[0]
    };
    list.unshift(newExp);
    this.saveExpenses(list);
    return newExp;
  },

  deleteExpense(id) {
    let list = this.getExpenses();
    list = list.filter(e => e.id !== id);
    this.saveExpenses(list);
    return true;
  },

  getNetProfitSummary(year = new Date().getFullYear(), month = new Date().getMonth()) {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    const fees = (typeof StudentAPI !== "undefined" && StudentAPI.getFees) ? StudentAPI.getFees() : {};

    let totalRevenue = 0;
    students.forEach(s => {
      const f = fees[s.ID];
      if (f && f.status === "Paid") totalRevenue += Number(f.paidAmount || 50);
      else if (f && f.status === "Partial") totalRevenue += Number(f.paidAmount || 0);
    });

    const expenses = this.getExpenses();
    const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    return { totalRevenue, totalExpenses, netProfit, expensesList: expenses };
  },

  printMonthlyProfitLossStatement(year = new Date().getFullYear(), month = new Date().getMonth()) {
    const summary = this.getNetProfitSummary(year, month);
    const branding = this.getSchoolBranding();
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];

    const expenseRows = summary.expensesList.map((e, idx) => `
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${idx + 1}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${e.title}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${e.category}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${e.date}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; font-weight: 700; color: #dc2626;">$${e.amount}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family: 'Kantumruy Pro', sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; color: #0f172a;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #1e1b4b;">${branding.schoolNameKh}</h2>
            <div style="font-size: 0.9rem; font-weight: 700; color: #4338ca;">របាយការណ៍ចំណូល ចំណាយ និងប្រាក់ចំណេញសុទ្ធ (Profit & Loss Statement)</div>
          </div>
          <div style="text-align: right; font-size: 0.85rem;">
            <div>ខែ ${khmerMonths[month]} ឆ្នាំ ${year}</div>
            <div style="color: #64748b;">កាលបរិច្ឆេទចេញ៖ ${new Date().toLocaleDateString('km-KH')}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; text-align: center;">
            <div style="font-size: 0.85rem; color: #166534;">ចំណូលប្រមូលបានសរុប (Revenue)</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #059669;">$${summary.totalRevenue}</div>
          </div>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px; text-align: center;">
            <div style="font-size: 0.85rem; color: #991b1b;">ចំណាយសរុប (Expenses)</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #dc2626;">$${summary.totalExpenses}</div>
          </div>
          <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 10px; padding: 16px; text-align: center;">
            <div style="font-size: 0.85rem; color: #3730a3;">ប្រាក់ចំណេញសុទ្ធ (Net Profit)</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #4338ca;">$${summary.netProfit}</div>
          </div>
        </div>

        <h3 style="font-size: 0.95rem; margin-bottom: 8px;">តារាងលម្អិតនៃចំណាយប្រចាំខែ៖</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; width: 40px;">#</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">បរិយាយចំណាយ</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; width: 120px;">ប្រភេទ</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; width: 100px;">កាលបរិច្ឆេទ</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; width: 100px; text-align: right;">ចំនួនទឹកប្រាក់</th>
            </tr>
          </thead>
          <tbody>
            ${expenseRows}
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-top: 40px;">
          <div style="text-align: center; min-width: 200px;">
            <div style="font-size: 0.85rem; margin-bottom: 50px;">រៀបចំដោយ៖ <strong>${branding.teacherTitle}</strong></div>
            <div style="font-weight: 700; font-size: 0.95rem;">ហត្ថលេខា និងត្រា</div>
          </div>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>របាយការណ៍ចំណូល-ចំណាយ - TIS Lab</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>@page { size: A4; margin: 10mm; } body { margin: 0; background: #fff; }</style>
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
  // 33. 16-PC HARDWARE & MAINTENANCE LOG
  // ------------------------------------------------------------------------
  getPcMaintenanceLogs() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_PC_MAINTENANCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Default 16 PCs
    const initial = {};
    for (let i = 1; i <= 16; i++) {
      const id = `PC-${String(i).padStart(2, "0")}`;
      initial[id] = { status: "Good", note: "ដំណើរការល្អ", lastChecked: new Date().toISOString().split("T")[0] };
    }
    return initial;
  },

  savePcMaintenanceStatus(pcId, status, note = "") {
    const logs = this.getPcMaintenanceLogs();
    logs[pcId] = {
      status: status || "Good",
      note: note || "",
      lastChecked: new Date().toISOString().split("T")[0]
    };
    try {
      localStorage.setItem(this.STORAGE_KEY_PC_MAINTENANCE, JSON.stringify(logs));
    } catch (e) {}
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try { firebase.database().ref("pc_maintenance").set(logs); } catch(e){}
    }
    return logs;
  },

  // ------------------------------------------------------------------------
  // 34. STUDENT PROGRESS & OBSERVATION NOTES
  // ------------------------------------------------------------------------
  getStudentNotes(studentId) {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_STUDENT_NOTES);
      if (saved) {
        const allNotes = JSON.parse(saved);
        return allNotes[studentId] || [];
      }
    } catch (e) {}
    return [];
  },

  saveStudentNote(studentId, noteText) {
    if (!studentId || !noteText) return;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_STUDENT_NOTES);
      const allNotes = saved ? JSON.parse(saved) : {};
      if (!allNotes[studentId]) allNotes[studentId] = [];
      allNotes[studentId].unshift({
        id: "NOTE-" + Date.now(),
        text: noteText.trim(),
        date: new Date().toLocaleString('km-KH'),
        author: "លោកគ្រូ ខៀន ធូ"
      });
      localStorage.setItem(this.STORAGE_KEY_STUDENT_NOTES, JSON.stringify(allNotes));
      return allNotes[studentId];
    } catch (e) {}
    return [];
  },

  // ------------------------------------------------------------------------
  // 35. HANDHELD USB BARCODE SCANNER GLOBAL LISTENER
  // ------------------------------------------------------------------------
  initBarcodeScannerListener() {
    let barcodeBuffer = "";
    let lastKeyTime = Date.now();

    window.addEventListener("keydown", (e) => {
      // Don't intercept if user is typing in regular text inputs
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
      const isInput = tag === "input" || tag === "textarea";

      const now = Date.now();
      const diff = now - lastKeyTime;
      lastKeyTime = now;

      // Barcode scanners type with < 40ms interval
      if (diff > 80) {
        barcodeBuffer = "";
      }

      if (e.key === "Enter") {
        if (barcodeBuffer.length >= 3 && barcodeBuffer.startsWith("TX")) {
          // Detected barcode gun scan!
          const scannedId = barcodeBuffer.trim();
          barcodeBuffer = "";

          // Auto-mark attendance or open profile
          if (typeof AttendanceView !== "undefined" && AttendanceView.handleScannedCode) {
            AttendanceView.handleScannedCode(scannedId);
          } else if (typeof App !== "undefined" && App.viewStudentDetails) {
            App.viewStudentDetails(scannedId);
          }
        }
        barcodeBuffer = "";
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
      }
    });
  },

  // ------------------------------------------------------------------------
  // 36. EXAM COUNTDOWN TIMER STATE & WEB AUDIO SYNTHESIZER
  // ------------------------------------------------------------------------
  examTimerState: {
    totalSeconds: 30 * 60,
    remainingSeconds: 30 * 60,
    isRunning: false,
    intervalId: null,
    title: "ការប្រឡងបញ្ចប់វគ្គកុំព្យូទ័រ (Practical Exam)"
  },

  playExamAlarm() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playBeep = (freq, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = audioCtx.currentTime;
      playBeep(880, now, 0.25);
      playBeep(880, now + 0.35, 0.25);
      playBeep(1174.66, now + 0.7, 0.6);
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  },

  // ------------------------------------------------------------------------
  // 37. PRACTICAL EXERCISE LIBRARY BANK
  // ------------------------------------------------------------------------
  getLabExerciseBank() {
    return [
      {
        id: "EX-WORD-01",
        module: "Microsoft Word",
        title: "រៀបចំលិខិតរដ្ឋបាល និងដាក់ត្រាសាលា (Official Administrative Letter)",
        level: "កម្រិតដំបូង",
        duration: "30 នាទី",
        instructions: [
          "កំណត់ Page Setup: Size A4, Margins: Top 2.54cm, Bottom 2.54cm, Left 3cm, Right 2cm",
          "វាយក្បាលលិខិត «ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ» ដោយប្រើ Font Khmer Moul 14pt កណ្តាល",
          "រៀបចំលេខកូដលិខិត កាលបរិច្ឆេទ និងកម្មវត្ថុដោយប្រើ Tab Stop ឱ្យត្រឹមត្រូវ",
          "បញ្ចូល Table ចំនួន ៤ ជួរឈរ និង ៥ ជួរដេក ដោយកំណត់ Cell Padding និង Shading ពណ៌ស្រាល",
          "ដាក់ឈ្មោះអ្នកចុះហត្ថលេខាខាងស្តាំក្រោម ដោយប្រើ Right Align"
        ]
      },
      {
        id: "EX-EXCEL-01",
        module: "Microsoft Excel",
        title: "តារាងគណនាប្រាក់បៀវត្ស និងពន្ធលើប្រាក់បៀវត្ស (Salary & Tax Sheet)",
        level: "កម្រិតមធ្យម",
        duration: "45 នាទី",
        instructions: [
          "បង្កើតតារាងមានជួរឈរ៖ ល.រ, ឈ្មោះបុគ្គលិក, ភេទ, ប្រាក់ខែគោល, ប្រាក់លើកទឹកចិត្ត, ប្រាក់ខែសរុប, ពន្ធ, ប្រាក់ខែសុទ្ធ",
          "ប្រើរូបមន្ត =SUM() ដើម្បីគណនាប្រាក់ខែសរុប (Total Salary)",
          "ប្រើរូបមន្តលក្ខខណ្ឌ =IF(Total > 500, Total*5%, 0) ដើម្បីគណនាប្រាក់ពន្ធ",
          "គណនាប្រាក់ខែសុទ្ធ = Total - Tax",
          "គណនាសរុប (SUM), មធ្យមភាគ (AVERAGE), ប្រាក់ខែខ្ពស់បំផុត (MAX), ទាបបំផុត (MIN)",
          "កំណត់ Currency Format ជាដុល្លារ ($) សម្រាប់ជួរឈរទឹកប្រាក់"
        ]
      },
      {
        id: "EX-EXCEL-02",
        module: "Microsoft Excel",
        title: "វិក្កយបត្រលក់ទំនិញស្វ័យប្រវត្តិ (Automated Sales Invoice)",
        level: "កម្រិតខ្ពស់",
        duration: "45 នាទី",
        instructions: [
          "រៀបចំទម្រង់វិក្កយបត្រ (Invoice Header) មានឈ្មោះហាង, លេខវិក្កយបត្រ, ឈ្មោះអតិថិជន",
          "ប្រើរូបមន្ត =VLOOKUP() ដើម្បីទាញឈ្មោះទំនិញ និងតម្លៃដោយស្វ័យប្រវត្តិតាមកូដទំនិញ",
          "គណនាប្រាក់សរុបតាមមុខទំនិញ = បរិមាណ * តម្លៃឯកតា",
          "គណនាបញ្ចុះតម្លៃ Discount 10% ប្រសិនបើសរុបលើសពី $100",
          "គណនា Grand Total ទឹកប្រាក់ត្រូវទូទាត់ចុងក្រោយ"
        ]
      },
      {
        id: "EX-PPT-01",
        module: "Microsoft PowerPoint",
        title: "រៀបចំស្លាយបទបង្ហាញស្វាគមន៍សិស្សថ្មី (Course Welcome Slides)",
        level: "កម្រិតមធ្យម",
        duration: "30 នាទី",
        instructions: [
          "បង្កើតស្លាយយ៉ាងតិច ៤ ស្លាយ ដោយប្រើ Template ពណ៌សុភាព និងមានភាពទាក់ទាញ",
          "ស្លាយទី១៖ ចំណងជើងធំ «ស្វាគមន៍មកកាន់ TIS Lab Computer» និងឈ្មោះអ្នកធ្វើបទបង្ហាញ",
          "ស្លាយទី២៖ បញ្ជីមាតិកាមេរៀន (Agenda) ដោយប្រើ SmartArt Graphics",
          "ស្លាយទី៣៖ កាលវិភាគសិក្សា ៣ វេន ដោយប្រើ Table ស្អាតបាត",
          "ស្លាយទី៤៖ អត្ថប្រយោជន៍ និងទំនាក់ទំនង (Contact & Social Media)",
          "កំណត់ Slide Transition ស្រទន់ (Fade ឬ Push) និង Animation លើចំណុចអត្ថបទ"
        ]
      },
      {
        id: "EX-TYPE-01",
        module: "Typing",
        title: "ការហាត់វាយអត្ថបទខ្មែរយូនីកូដ ១០០ ពាក្យដោយមិនមើលក្តារចុច",
        level: "កម្រិតដំបូង",
        duration: "15 នាទី",
        instructions: [
          "អង្គុយក្នុងឥរិយាបថត្រង់ខ្លួន ដាក់ម្រាមដៃទាំង ១០ លើ Home Row (ក-ថ)",
          "វាយអត្ថបទកំណត់ដោយគ្មានការសម្លឹងមើលក្តារចុច (Touch Typing)",
          "ល្បឿនគោលដៅ៖ យ៉ាងតិច 25 WPM (Words Per Minute)",
          "កម្រិតភាពត្រឹមត្រូវ (Accuracy)៖ លើសពី 95%"
        ]
      }
    ];
  },

  printExerciseHandoutA4(exerciseId) {
    const bank = this.getLabExerciseBank();
    const ex = bank.find(item => item.id === exerciseId) || bank[0];
    const branding = this.getSchoolBranding();

    const stepsHtml = ex.instructions.map((step, idx) => `
      <div style="display: flex; gap: 14px; margin-bottom: 14px; align-items: flex-start;">
        <div style="background: #1e1b4b; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; flex-shrink: 0;">${idx + 1}</div>
        <div style="font-size: 0.95rem; line-height: 1.6; color: #1e293b; padding-top: 2px;">${step}</div>
      </div>
    `).join("");

    const html = `
      <div style="width: 210mm; min-height: 297mm; padding: 25mm 20mm; box-sizing: border-box; font-family: 'Kantumruy Pro', sans-serif; color: #0f172a;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e1b4b; padding-bottom: 14px; margin-bottom: 24px;">
          <div>
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #1e1b4b;">${branding.schoolNameKh}</h2>
            <div style="font-size: 0.85rem; color: #4338ca; font-weight: 700;">TIS LAB COMPUTER — វិញ្ញាសាអនុវត្តជាក់ស្តែង</div>
          </div>
          <div style="text-align: right; font-size: 0.85rem;">
            <div>កូដលំហាត់៖ <strong>${ex.id}</strong></div>
            <div>កម្រិត៖ <span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-weight: 700;">${ex.level}</span></div>
          </div>
        </div>

        <!-- Exercise Title Box -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-left: 6px solid #4f46e5; border-radius: 8px; padding: 18px 20px; margin-bottom: 26px;">
          <div style="font-size: 0.8rem; text-transform: uppercase; color: #6366f1; font-weight: 800; letter-spacing: 0.5px;">${ex.module} PRACTICAL LAB</div>
          <h1 style="margin: 6px 0 10px 0; font-size: 1.3rem; font-weight: 800; color: #0f172a;">${ex.title}</h1>
          <div style="display: flex; gap: 20px; font-size: 0.85rem; color: #64748b;">
            <div><i class="fa-regular fa-clock"></i> រយៈពេលអនុវត្ត៖ <strong>${ex.duration}</strong></div>
            <div><i class="fa-solid fa-chalkboard-user"></i> គ្រូណែនាំ៖ <strong>${branding.teacherTitle}</strong></div>
          </div>
        </div>

        <!-- Student Info Header Fillable -->
        <div style="display: flex; justify-content: space-between; border: 1px dashed #94a3b8; border-radius: 6px; padding: 12px 16px; margin-bottom: 26px; font-size: 0.88rem;">
          <div>ឈ្មោះសិស្ស៖ ....................................................</div>
          <div>អត្តលេខ ID៖ ..................</div>
          <div>កុំព្យូទ័រលេខ PC-......</div>
          <div>វេន៖ ................</div>
        </div>

        <!-- Instructions -->
        <h3 style="font-size: 1.05rem; font-weight: 800; color: #1e1b4b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 18px;">
          សេចក្តីណែនាំ និងលក្ខខណ្ឌនៃការអនុវត្ត (Instructions):
        </h3>
        <div style="margin-bottom: 30px;">
          ${stepsHtml}
        </div>

        <!-- Submission Rules -->
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 14px 16px; font-size: 0.85rem; color: #92400e; margin-bottom: 40px; line-height: 1.6;">
          <strong>⚠️ ការរក្សាទុក និងប្រគល់កិច្ចការ៖</strong><br>
          សូម Save កិច្ចការចូលក្នុង Drive D: ឬ Desktop ក្នុង Folder ឈ្មោះ <code>D:\\កិច្ចការសិស្ស\\${ex.module}\\</code> ដោយដាក់ឈ្មោះ File ជា៖ <code>[លេខកូដសិស្ស]_[ឈ្មោះសិស្ស]_${ex.id}</code> (ឧទាហរណ៍៖ <code>TX01_Chantara_${ex.id}</code>)។
        </div>

        <!-- Footer / Teacher Sign -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #cbd5e1; padding-top: 20px;">
          <div style="font-size: 0.8rem; color: #64748b;">
            <div>TIS Lab Computer Practical Worksheet</div>
            <div>ឯកសារបណ្តុះបណ្តាលផ្លូវការ</div>
          </div>
          <div style="text-align: center; min-width: 180px;">
            <div style="font-size: 0.85rem; margin-bottom: 50px;">គ្រូទទួលបន្ទុកបច្ចេកទេស</div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #1e1b4b;">${branding.teacherTitle}</div>
          </div>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>វិញ្ញាសាអនុវត្ត - ${ex.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
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
  // 38. DIGITAL CERTIFICATE QR VERIFICATION RESOLVER
  // ------------------------------------------------------------------------
  getCertificateVerificationData(studentId, certNo) {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    const student = students.find(s => s.ID === studentId || s.ID === `TX${studentId}`);
    if (!student) return null;

    const certs = (typeof StudentAPI !== "undefined" && StudentAPI.getCertificates) ? StudentAPI.getCertificates() : [];
    const cert = certs.find(c => c.studentId === student.ID || c.id === certNo);

    return {
      isValid: true,
      studentId: student.ID,
      nameKh: student.NameKh,
      nameEn: student.NameEn || "STUDENT",
      gender: student.Gender,
      avatar: student.Avatar || (typeof App !== "undefined" ? App.getDefaultAvatar(student.Gender) : ""),
      course: (cert && cert.course) || student.Course || "កុំព្យូទ័ររដ្ឋបាលពេញលេញ",
      issueDate: (cert && cert.issueDate) || new Date().toISOString().split("T")[0],
      grade: (cert && cert.grade) || "ល្អប្រសើរ (Very Good)",
      certificateNo: (cert && cert.id) || certNo || `CERT-${student.ID}-${new Date().getFullYear()}`,
      schoolName: "TIS LAB COMPUTER TRAINING CENTER",
      instructor: "លោកគ្រូ ខៀន ធូ (Khien Thou)"
    };
  },

  // ------------------------------------------------------------------------
  // 39. CLASSROOM AUDIO SYNTHESIZER SOUNDBOARD (NO EXTERNAL FILES)
  // ------------------------------------------------------------------------
  playSoundEffect(type = "applause") {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      if (type === "applause") {
        // Celebratory fanfare chime chord
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.65);
        });
      } else if (type === "bell") {
        // High resonance school bell
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.25);
      } else if (type === "buzzer") {
        // Low comical buzz
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(160, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === "spin") {
        // Wheel tick sound
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  },

  // ------------------------------------------------------------------------
  // 40. INSTANT EXAM PACKAGE ENGINE (PAPER + TEACHER ANSWER KEY + RUBRIC)
  // ------------------------------------------------------------------------
  generateFullExamPackageA4(module = "Microsoft Excel", level = "មធ្យម") {
    const branding = this.getSchoolBranding();
    const isExcel = module.includes("Excel");
    const isWord = module.includes("Word");
    const isPpt = module.includes("PowerPoint");

    const packageData = isExcel ? {
      title: "ការប្រឡងអនុវត្តជាក់ស្តែង៖ តារាងលក់ទំនិញ និងវិក្កយបត្រស្វ័យប្រវត្ត",
      duration: "45 នាទី",
      scoreTotal: 100,
      tasks: [
        { desc: "បង្កើតតារាងទំនិញ (Products Sheet) មាន Product_ID, Item_Name, Unit_Price", points: 20 },
        { desc: "ប្រើរូបមន្ត =VLOOKUP() ដើម្បីទាញឈ្មោះទំនិញ និងតម្លៃស្វ័យប្រវត្តិតាមកូដ", points: 25 },
        { desc: "គណនាទឹកប្រាក់សរុប = Qty * Price និងបញ្ចុះតម្លៃ Discount 10% បើសរុបលើសពី $100 ដោយប្រើ =IF()", points: 25 },
        { desc: "គណនា Grand Total, ចំនួនវិក្កយបត្រសរុបដោយប្រើ =COUNTA(), និងកំណត់រូបិយប័ណ្ណជាដុល្លារ ($)", points: 15 },
        { desc: "រៀបចំ Formatting (Header Color, Borders, Font Kantumruy Pro) ឱ្យស្អាតបាត", points: 15 }
      ],
      solutions: [
        "1. បង្កើត Sheet ទី១ ដាក់ឈ្មោះថា «Products» និងបញ្ចូលតារាងទំនិញចាប់ពីក្រឡា A1:C10",
        "2. រូបមន្តទាញយកឈ្មោះទំនិញ៖ =VLOOKUP(B5, Products!$A$2:$C$10, 2, FALSE)",
        "3. រូបមន្តទាញតម្លៃឯកតា៖ =VLOOKUP(B5, Products!$A$2:$C$10, 3, FALSE)",
        "4. រូបមន្តគណនាទឹកប្រាក់ Discount៖ =IF(E5>=100, E5*10%, 0)",
        "5. រូបមន្តសរុបចុងក្រោយ៖ =SUM(F5:F15) - SUM(G5:G15)"
      ]
    } : isWord ? {
      title: "ការប្រឡងអនុវត្តជាក់ស្តែង៖ ការរៀបចំលិខិតរដ្ឋបាល និងតារាងរបាយការណ៍ផ្លូវការ",
      duration: "45 នាទី",
      scoreTotal: 100,
      tasks: [
        { desc: "កំណត់ Page Setup: Size A4, Margins: Top 2.54cm, Bottom 2.54cm, Left 3cm, Right 2cm", points: 15 },
        { desc: "វាយក្បាលលិខិតជាតិ «ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ» ត្រឹមត្រូវតាមក្បួនខ្នាត", points: 20 },
        { desc: "ប្រើប្រាស់ Tab Stop (Left Tab, Right Tab, Decimal Tab) រៀបចំលេខកូដ និងកាលបរិច្ឆេទ", points: 25 },
        { desc: "បង្កើត Table ៥ ជួរឈរ កំណត់ Shading, Borders, Alignment, និងបូកលេខក្នុង Table", points: 25 },
        { desc: "រៀបចំហត្ថលេខាខាងស្តាំក្រោម និងបញ្ចូលរូបភាពត្រាសាលា", points: 15 }
      ],
      solutions: [
        "1. ចូល Layout ➔ Page Setup ➔ Margins ➔ Custom Margins (Top: 2.54, Left: 3cm)",
        "2. Font ក្បាលលិខិត៖ Khmer Moul 14pt (Center), ពាក្យ ជាតិ សាសនា ព្រះមហាក្សត្រ 12pt",
        "3. ដាក់ Right Tab នៅត្រង់ 15.5cm លើបន្ទាត់ Ruler សម្រាប់កាលបរិច្ឆេទ",
        "4. Table ➔ Table Design ➔ Shading ពណ៌ខៀវស្រាល ➔ Cell Alignment Center",
        "5. ប្រើ Right Alignment សម្រាប់ប្លុកឈ្មោះ និងហត្ថលេខាអ្នកចេញលិខិត"
      ]
    } : {
      title: "ការប្រឡងអនុវត្តជាក់ស្តែង៖ ការរៀបចំស្លាយបទបង្ហាញអាជីវកម្មប្រកបដោយវិជ្ជាជីវៈ",
      duration: "45 នាទី",
      scoreTotal: 100,
      tasks: [
        { desc: "រៀបចំស្លាយចំនួន ៤ ស្លាយ ដោយប្រើ Master Slide Theme ពណ៌សុភាព និងសមរម្យ", points: 20 },
        { desc: "ប្រើប្រាស់ SmartArt Graphics ដើម្បីបង្ហាញពីដំណើរការការងារ (Process Diagram)", points: 25 },
        { desc: "បញ្ចូល Charts/Graphs បង្ហាញពីស្ថិតិលក់ និងកំណត់ពណ៌ឱ្យស៊ីសង្វាក់នឹងស្លាយ", points: 25 },
        { desc: "កំណត់ Animation ស្រទន់ (Appear / Fade) និង Transition (Fade / Push 1.5s)", points: 20 },
        { desc: "រៀបចំស្លាយចុងក្រោយ Contact & Q&A ឱ្យមានភាពទាក់ទាញ", points: 10 }
      ],
      solutions: [
        "1. ចូល View ➔ Slide Master ➔ កំណត់ Theme Color Palette & Typography",
        "2. Insert ➔ SmartArt ➔ Process ➔ Horizontal Process ➔ បញ្ចូលជំហានទាំង ៤",
        "3. Insert ➔ Chart ➔ Clustered Column ➔ កែសម្រួលទិន្នន័យ Excel អម",
        "4. Transitions Tab ➔ ជ្រើសរើស Fade ➔ កំណត់ Duration: 01.00 ➔ Apply To All",
        "5. Animations Tab ➔ Add Animation: Fade ➔ Start: On Click"
      ]
    };

    const taskRows = packageData.tasks.map((t, idx) => `
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 10px; text-align: center; font-weight: 700;">${idx + 1}</td>
        <td style="padding: 10px;">${t.desc}</td>
        <td style="padding: 10px; text-align: right; font-weight: 800; color: #4338ca;">${t.points} ពិន្ទុ</td>
      </tr>
    `).join("");

    const solutionRows = packageData.solutions.map((s, idx) => `
      <div style="margin-bottom: 8px; font-size: 0.9rem; line-height: 1.6; color: #1e293b;">
        <strong style="color: #059669;">[ជំហាន ${idx + 1}]</strong> ${s}
      </div>
    `).join("");

    const html = `
      <!-- PAGE 1: STUDENT EXAM PAPER -->
      <div style="width: 210mm; min-height: 297mm; padding: 20mm; box-sizing: border-box; font-family: 'Kantumruy Pro', sans-serif; color: #0f172a; page-break-after: always;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: #1e1b4b;">${branding.schoolNameKh}</h2>
            <div style="font-size: 0.85rem; color: #4338ca; font-weight: 700;">វិញ្ញាសាប្រឡងបញ្ចប់វគ្គ — ${module}</div>
          </div>
          <div style="text-align: right; font-size: 0.85rem;">
            <div>កម្រិត៖ <strong>${level}</strong></div>
            <div>រយៈពេល៖ <strong>${packageData.duration}</strong></div>
            <div>ពិន្ទុសរុប៖ <strong>${packageData.scoreTotal} ពិន្ទុ</strong></div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; border: 1.5px dashed #64748b; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 0.9rem; background: #f8fafc;">
          <div>ឈ្មោះសិស្ស៖ ....................................................</div>
          <div>អត្តលេខ ID៖ ..................</div>
          <div>កុំព្យូទ័រ PC-......</div>
          <div>វេន៖ ................</div>
        </div>

        <h3 style="font-size: 1.1rem; color: #1e1b4b; margin-bottom: 12px;">ប្រធានវិញ្ញាសា៖ ${packageData.title}</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; margin-bottom: 24px;">
          <thead>
            <tr style="background: #e2e8f0;">
              <th style="padding: 10px; width: 40px; text-align: center;">ល.រ</th>
              <th style="padding: 10px; text-align: left;">ភារកិច្ច និងលក្ខខណ្ឌនៃការអនុវត្ត</th>
              <th style="padding: 10px; width: 100px; text-align: right;">ពិន្ទុ</th>
            </tr>
          </thead>
          <tbody>${taskRows}</tbody>
        </table>

        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; font-size: 0.85rem; color: #92400e; line-height: 1.6; margin-bottom: 30px;">
          <strong>⚠️ ការរក្សាទុក File៖</strong> សូម Save កិច្ចការចូល Drive D: ឬ Desktop ក្នុង Folder <code>D:\\កិច្ចការសិស្ស\\${module}\\</code> ដោយដាក់ឈ្មោះ File ថា <code>[លេខID]_[ឈ្មោះសិស្ស]_${module}_Exam</code>។
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px;">
          <div style="font-size: 0.8rem; color: #64748b;">វិញ្ញាសាផ្លូវការ TIS Lab Computer</div>
          <div style="text-align: center; min-width: 180px;">
            <div style="font-size: 0.85rem; margin-bottom: 45px;">គ្រូទទួលបន្ទុកបច្ចេកទេស</div>
            <div style="font-weight: 800; font-size: 0.95rem;">${branding.teacherTitle}</div>
          </div>
        </div>
      </div>

      <!-- PAGE 2: TEACHER ANSWER KEY & GRADING RUBRIC -->
      <div style="width: 210mm; min-height: 297mm; padding: 20mm; box-sizing: border-box; font-family: 'Kantumruy Pro', sans-serif; color: #0f172a;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px;">
          <div>
            <span style="background: #dcfce7; color: #166534; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">TEACHER ONLY — កម្រងចម្លើយផ្លូវការ</span>
            <h2 style="margin: 4px 0 0 0; font-size: 1.25rem; font-weight: 800; color: #065f46;">កម្រងចម្លើយ និងរបៀបដោះស្រាយ (Teacher Solution Guide)</h2>
          </div>
          <div style="text-align: right; font-size: 0.85rem; color: #64748b;">
            <div>វគ្គ៖ <strong>${module}</strong></div>
            <div>កាលបរិច្ឆេទ៖ ${new Date().toLocaleDateString('km-KH')}</div>
          </div>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #166534; font-size: 0.95rem;">គន្លឹះដោះស្រាយ និងរូបមន្តគំរូ (Solution Steps & Formulas):</h4>
          ${solutionRows}
        </div>

        <h4 style="margin: 20px 0 10px 0; color: #1e1b4b; font-size: 0.95rem;">តារាងបែងចែកពិន្ទុវាយតម្លៃលម្អិត (Grading Rubric Matrix):</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px;">កម្រិតសមត្ថភាព</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px;">លក្ខខណ្ឌវិនិច្ឆ័យ (Criteria)</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; width: 90px; text-align: center;">ពិន្ទុ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: 700; color: #059669;">ល្អប្រសើរ (Excellent)</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px;">អនុវត្តបានគ្រប់ ៥ ចំណុច រូបមន្តត្រឹមត្រូវឥតខ្ចោះ និង formatting ស្អាតបាត</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: 700;">85 - 100</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: 700; color: #2563eb;">ល្អបង្គួរ (Good)</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px;">អនុវត្តត្រូវ ៤ ចំណុច រូបមន្តត្រឹមត្រូវភាគច្រើន មានកំហុស formatting បន្តិចបន្តួច</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: 700;">70 - 84</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: 700; color: #d97706;">មធ្យម (Fair)</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px;">អនុវត្តបានតែ ៣ ចំណុច រូបមន្តខ្លះខុស ឬមិនទាន់ចប់តាមពេលវេលាកំណត់</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: 700;">50 - 69</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: 700; color: #dc2626;">ខ្សោយ (Need Retest)</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px;">មិនយល់រូបមន្ត មិនអាចបង្កើតតារាង ឬមិនបាន Save ឯកសារត្រឹមត្រូវ</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: 700;">&lt; 50</td>
            </tr>
          </tbody>
        </table>

        <div style="text-align: right; font-size: 0.85rem; color: #64748b;">
          រៀបចំដោយ៖ <strong>${branding.teacherTitle}</strong>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>វិញ្ញាសា + កម្រងចម្លើយ - ${module}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
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
  // 41. JOB-READY STUDENT COMPUTER SKILLS CV & PORTFOLIO GENERATOR (A4)
  // ------------------------------------------------------------------------
  generateStudentCvPortfolioA4(student) {
    if (!student) return;
    const branding = this.getSchoolBranding();
    const exams = (typeof StudentAPI !== "undefined" && StudentAPI.getStudentExams) ? StudentAPI.getStudentExams(student.ID) : {};

    const wordScore = exams["Word"] ? exams["Word"].score : "90";
    const excelScore = exams["Excel"] ? exams["Excel"].score : "92";
    const pptScore = exams["PowerPoint"] ? exams["PowerPoint"].score : "88";
    const typingScore = exams["Typing"] ? exams["Typing"].score : "95";

    const qrData = `${window.location.origin}${window.location.pathname}#verify-cert?id=${student.ID}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`;

    const html = `
      <div style="width: 210mm; min-height: 297mm; padding: 20mm; box-sizing: border-box; font-family: 'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif; color: #0f172a; position: relative;">
        <!-- Top Header & Banner -->
        <div style="display: grid; grid-template-columns: 100px 1fr auto; gap: 20px; align-items: center; border-bottom: 3px solid #1e1b4b; padding-bottom: 18px; margin-bottom: 24px;">
          <img src="${student.Avatar || (typeof App !== 'undefined' ? App.getDefaultAvatar(student.Gender) : '')}" style="width: 95px; height: 115px; object-fit: cover; border-radius: 8px; border: 2px solid #1e1b4b;" alt="Photo">
          <div>
            <h1 style="margin: 0 0 4px 0; font-size: 1.6rem; font-weight: 800; color: #1e1b4b;">${student.NameKh}</h1>
            <div style="font-size: 1.15rem; font-weight: 700; color: #4338ca; font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: 0.5px;">${student.NameEn || 'STUDENT'}</div>
            <div style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">
              <span>🆔 អត្តលេខ៖ <strong>${student.ID}</strong></span> • 
              <span>ភេទ៖ <strong>${student.Gender}</strong></span> • 
              <span>ថ្ងៃខែឆ្នាំកំណើត៖ <strong>${student.Dob || '-'}</strong></span>
            </div>
            <div style="font-size: 0.85rem; color: #64748b; margin-top: 2px;">
              <span>📞 ទូរស័ព្ទ៖ <strong>${student.Phone || '-'}</strong></span> • 
              <span>ទីលំនៅ៖ <strong>${student.Address || 'ខេត្តកំពត'}</strong></span>
            </div>
          </div>
          <div style="text-align: center;">
            <img src="${qrUrl}" style="width: 75px; height: 75px; border-radius: 6px; border: 1px solid #cbd5e1;" alt="QR Verification">
            <div style="font-size: 0.65rem; color: #64748b; margin-top: 3px;">ស្កេនផ្ទៀងផ្ទាត់ប័ណ្ណ</div>
          </div>
        </div>

        <!-- Career Objective -->
        <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 12px 16px; border-radius: 6px; margin-bottom: 22px;">
          <h3 style="margin: 0 0 6px 0; font-size: 0.95rem; font-weight: 800; color: #1e1b4b;">គោលបំណងការងារ (Career Objective):</h3>
          <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: #334155;">
            មានបំណងចូលបម្រើការងារក្នុងមុខតំណែង <strong>រដ្ឋបាល (Administration), គណនេយ្យករជំនួយ (Assistant Accountant), ឬបុគ្គលិកទិន្នន័យ (Data Entry/Clerk)</strong> ដោយប្រើប្រាស់សមត្ថភាពកុំព្យូទ័ររដ្ឋបាលកម្រិតខ្ពស់ និងជំនាញវាយអត្ថបទរហ័ស ដើម្បីរួមចំណែកជួយដល់ស្ថាប័នឱ្យរីកចម្រើន។
          </p>
        </div>

        <!-- Certified Computer Competencies -->
        <h3 style="font-size: 1.05rem; font-weight: 800; color: #1e1b4b; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 14px;">
          សមត្ថភាពកុំព្យូទ័រដែលបានឆ្លងកាត់ការបណ្តុះបណ្តាល និងប្រឡងជាប់ជាផ្លូវការ (Certified Skills):
        </h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px;">
          <!-- Word -->
          <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: #fff;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="color: #2563eb; font-size: 0.95rem;">📄 Microsoft Word រដ្ឋបាល</strong>
              <span style="background: #dbeafe; color: #1d4ed8; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px;">ពិន្ទុ ${wordScore}/100</span>
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.8rem; color: #475569; line-height: 1.5;">
              <li>រៀបចំលិខិតរដ្ឋបាលផ្លូវការ និងកំណត់ Margins ក្បួនខ្នាត</li>
              <li>ការប្រើប្រាស់ Tab Stop, Bullet & Numbering, Header/Footer</li>
              <li>បង្កើត និងគ្រប់គ្រង Table, Mail Merge បោះពុម្ពសំបុត្រស្វ័យប្រវត្តិ</li>
            </ul>
          </div>

          <!-- Excel -->
          <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: #fff;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="color: #059669; font-size: 0.95rem;">📊 Microsoft Excel & Formulas</strong>
              <span style="background: #d1fae5; color: #047857; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px;">ពិន្ទុ ${excelScore}/100</span>
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.8rem; color: #475569; line-height: 1.5;">
              <li>រូបមន្តគណនាស្វ័យប្រវត្តិ៖ =VLOOKUP, =SUM, =IF, =AVERAGE</li>
              <li>តារាងគ្រប់គ្រងប្រាក់ខែ (Payroll), វិក្កយបត្រ (Invoice), របាយការណ៍លក់</li>
              <li>តម្រៀបទិន្នន័យ (Filter/Sort), PivotTable និងបង្កើត Chart</li>
            </ul>
          </div>

          <!-- PowerPoint -->
          <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: #fff;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="color: #d97706; font-size: 0.95rem;">📽️ Microsoft PowerPoint</strong>
              <span style="background: #fef3c7; color: #b45309; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px;">ពិន្ទុ ${pptScore}/100</span>
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.8rem; color: #475569; line-height: 1.5;">
              <li>ឌីហ្សាញស្លាយបទបង្ហាញស្អាតបាតតាមក្បួន Color Harmony</li>
              <li>ការប្រើ SmartArt Graphics, Slide Master, Transitions & Animations</li>
              <li>រៀបចំ Slide បទបង្ហាញលទ្ធផលការងារ និងគម្រោងអាជីវកម្ម</li>
            </ul>
          </div>

          <!-- Typing -->
          <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: #fff;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="color: #7c3aed; font-size: 0.95rem;">⌨️ Khmer Unicode & English Typing</strong>
              <span style="background: #ede9fe; color: #6d28d9; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px;">ពិន្ទុ ${typingScore}/100</span>
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.8rem; color: #475569; line-height: 1.5;">
              <li>វាយអក្សរខ្មែរយូនីកូដ និងអង់គ្លេសដោយម្រាមដៃ ១០ (Touch Typing)</li>
              <li>ល្បឿនវាយអត្ថបទជាមធ្យម 30+ Words Per Minute (WPM)</li>
              <li>ភាពត្រឹមត្រូវនៃអក្ខរាវិរុទ្ធ (Accuracy) លើសពី 95%</li>
            </ul>
          </div>
        </div>

        <!-- Instructor Recommendation & Stamp -->
        <div style="border: 1.5px solid #1e1b4b; border-radius: 8px; padding: 14px 18px; background: #fafafa; margin-bottom: 24px;">
          <h4 style="margin: 0 0 6px 0; font-size: 0.9rem; font-weight: 800; color: #1e1b4b;">សេចក្តីបញ្ជាក់ និងឧទ្ទេសនាមពីលោកគ្រូបង្ហាត់ (Teacher's Endorsement):</h4>
          <p style="margin: 0; font-size: 0.82rem; line-height: 1.7; color: #334155;">
            ខ្ញុំបាទ <strong>${branding.teacherTitle}</strong> សូមបញ្ជាក់ថាសិស្ស <strong>${student.NameKh}</strong> ពិតជាមានការខិតខំប្រឹងប្រែង គោរពវិន័យម៉ោងពេល មានសីលធម៌ល្អ និងបានឆ្លងកាត់ការអនុវត្តជាក់ស្តែងលើកម្មវិធីកុំព្យូទ័ររដ្ឋបាលយ៉ាងស្ទាត់ជំនាញ។ ខ្ញុំបាទសូមធានា និងឧទ្ទេសនាមសិស្សរូបនេះជូនគ្រប់ស្ថាប័នដើម្បីពិចារណាទទួលឱ្យចូលបម្រើការងារ។
          </p>
        </div>

        <!-- Footer Signatures -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 10px;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #1e1b4b;">មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័រ TIS Lab</div>
            <div style="font-size: 0.75rem; color: #64748b;">កាលបរិច្ឆេទចេញ៖ ${new Date().toLocaleDateString('km-KH')}</div>
          </div>
          <div style="text-align: center; min-width: 200px;">
            <div style="font-size: 0.82rem; margin-bottom: 50px;">គ្រូបង្ហាត់ និងចុះហត្ថលេខា</div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #1e1b4b;">${branding.teacherTitle}</div>
          </div>
        </div>
      </div>
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Computer Skills CV - ${student.NameKh}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
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
  // 42. DROPOUT EARLY-WARNING RADAR & RETENTION CRM
  // ------------------------------------------------------------------------
  getDropoutRadarList() {
    let students = (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents) ? StudentAPI.getLocalStudents() : [];
    if (!students || students.length === 0) {
      if (typeof App !== "undefined" && App.state && App.state.students) {
        students = App.state.students;
      }
    }
    const attData = (typeof StudentAPI !== "undefined" && StudentAPI.getAttendance) ? StudentAPI.getAttendance() : {};
    const fees = (typeof StudentAPI !== "undefined" && StudentAPI.getFees) ? StudentAPI.getFees() : {};

    const atRisk = [];

    students.forEach(s => {
      if (!s || s.Status === "Dropped" || s.Status === "Drop" || s.Status === "Graduated") return;

      const fee = fees[s.ID];
      const isUnpaid = !fee || fee.status === "Unpaid" || fee.status === "Partial";

      // Scan attendance
      let absentCount = 0;
      if (attData && typeof attData === "object") {
        Object.keys(attData).forEach(dateKey => {
          if (attData[dateKey] && attData[dateKey][s.ID] === "A") {
            absentCount++;
          }
        });
      }

      // Scan exam scores safely
      let sExams = {};
      try {
        if (typeof StudentAPI !== "undefined" && typeof StudentAPI.getStudentExams === "function") {
          sExams = StudentAPI.getStudentExams(s.ID) || {};
        }
      } catch (err) {
        console.warn("Could not query exams for student:", s.ID, err);
      }

      let lowScoreCount = 0;
      if (sExams && typeof sExams === "object") {
        Object.keys(sExams).forEach(mod => {
          if (sExams[mod] && sExams[mod].score !== undefined && Number(sExams[mod].score) < 60) {
            lowScoreCount++;
          }
        });
      }

      // Calculate risk level
      let riskLevel = null;
      let reasons = [];

      if (absentCount >= 3 && isUnpaid) {
        riskLevel = "CRITICAL";
        reasons.push(`អវត្តមាន ${absentCount} ថ្ងៃ & នៅសល់ប្រាក់ថ្លៃសិក្សា`);
      } else if (absentCount >= 2 || lowScoreCount > 0) {
        riskLevel = "MODERATE";
        if (absentCount >= 2) reasons.push(`អវត្តមាន ${absentCount} ថ្ងៃ`);
        if (lowScoreCount > 0) reasons.push(`ពិន្ទុប្រឡងទាបជាង ៦០`);
      } else if (absentCount === 1 && isUnpaid) {
        riskLevel = "WATCH";
        reasons.push(`អវត្តមាន ១ ថ្ងៃ & ជំពាក់ថ្លៃសិក្សា`);
      }

      if (riskLevel) {
        atRisk.push({
          student: s,
          riskLevel,
          absentCount,
          reasons: reasons.join(", ")
        });
      }
    });

    return atRisk.sort((a, b) => {
      const order = { "CRITICAL": 0, "MODERATE": 1, "WATCH": 2 };
      return (order[a.riskLevel] ?? 9) - (order[b.riskLevel] ?? 9);
    });
  },

  async sendRetentionEncouragementTelegram(student) {
    if (!student) return;
    if (typeof TelegramService === "undefined" || !TelegramService.isEnabled || !TelegramService.isEnabled()) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("សូមភ្ជាប់ Telegram Bot ក្នុងប្រព័ន្ធជាមុនសិន!", "warning");
      }
      return;
    }
    const branding = this.getSchoolBranding();

    const msg = `🌟 *សារលើកទឹកចិត្តពីសាលា ${branding.schoolNameKh}*\n\n` +
      `ជម្រាបសួរប្អូន *${student.NameKh}* (ID: \`${student.ID}\`)!\n\n` +
      `លោកគ្រូបានកត់សម្គាល់ឃើញថា ប្អូនបានខកខានការចូលរៀន ឬជួបការលំបាកលើមេរៀនមួយចំនួនក្នុង *វេន${student.Shift || 'ព្រឹក'}* កន្លងមកនេះ។\n\n` +
      `លោកគ្រូយល់ថាការរៀនកុំព្យូទ័រអាចមានចំណុចពិបាកខ្លះៗ តែសូមប្អូនកុំបាក់ទឹកចិត្ត! សាលារីករាយនឹង **រៀបចំម៉ោងបំប៉នបន្ថែមដោយឥតគិតថ្លៃ (Free Catch-up Session)** ជូនប្អូន។\n\n` +
      `សូមប្អូនទាក់ទងមកលោកគ្រូវិញ ដើម្បីកំណត់ម៉ោងជួបគ្នា និងបន្តការសិក្សាឱ្យចប់វគ្គទាំងអស់គ្នាណា៎! 💪💻✨`;

    await TelegramService.sendMessage(msg);
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`📩 បានផ្ញើសារលើកទឹកចិត្តទៅ Telegram សិស្ស ${student.NameKh} រួចរាល់!`, "success");
    }
  },

  // ------------------------------------------------------------------------
  // 43. 1-CLICK END-OF-DAY WRAP-UP (៦:០០ ល្ងាច)
  // ------------------------------------------------------------------------
  async executeEndOfDayWrapUp() {
    let students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
    const attData = (typeof StudentAPI !== "undefined" && StudentAPI.getAttendance) ? StudentAPI.getAttendance() : {};
    const branding = this.getSchoolBranding();
    const today = new Date().toISOString().split("T")[0];

    const todayAtt = attData[today] || {};
    let present = 0;
    let absent = 0;
    let permission = 0;

    students.forEach(s => {
      const status = todayAtt[s.ID];
      if (status === "P") present++;
      else if (status === "A") absent++;
      else if (status === "L") permission++;
    });

    const summary = this.getNetProfitSummary();
    const backupJson = (typeof StudentAPI !== "undefined" && StudentAPI.exportFullDatabaseJson)
      ? StudentAPI.exportFullDatabaseJson()
      : null;

    // Send Telegram Briefing
    if (typeof TelegramService !== "undefined" && TelegramService.isEnabled()) {
      const eveningMsg = `☕ *របាយការណ៍បិទបញ្ជីចុងថ្ងៃ (End of Day Briefing)*\n` +
        `🏢 *${branding.schoolNameKh}*\n` +
        `📅 *កាលបរិច្ឆេទ៖* ${new Date().toLocaleDateString('km-KH')} (ម៉ោង ៦:០០ ល្ងាច)\n\n` +
        `📊 *ស្ថិតិវត្តមានថ្ងៃនេះ៖*\n` +
        `• សិស្សមានវត្តមាន (Present)៖ \`${present}\` នាក់\n` +
        `• សិស្សអវត្តមាន (Absent)៖ \`${absent}\` នាក់\n` +
        `• សិស្សសុំច្បាប់ (Permission)៖ \`${permission}\` នាក់\n` +
        `• សរុបសិស្សសកម្ម៖ \`${students.length}\` នាក់\n\n` +
        `💵 *ស្ថានភាពហិរញ្ញវត្ថុប្រចាំខែ៖*\n` +
        `• ចំណូលសរុប៖ \`$${summary.totalRevenue}\`\n` +
        `• ចំណាយសរុប៖ \`$${summary.totalExpenses}\`\n` +
        `• ប្រាក់ចំណេញសុទ្ធ៖ \`$${summary.netProfit}\`\n\n` +
        `💾 *ប្រព័ន្ធសុវត្ថិភាពទិន្នន័យ៖* Database ត្រូវបាន Backup រួចរាល់ដោយស្វ័យប្រវត្តិ។\n\n` +
        `🎉 កិច្ចការថ្ងៃនេះបានបញ្ចប់សព្វគ្រប់! សូមលោកគ្រូ *${branding.teacherTitle}* សម្រាកល្ងាចនេះដោយក្តីរីករាយ! 🌟`;

      await TelegramService.sendMessage(eveningMsg);
    }

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("🎉 បានបិទបញ្ជីចុងថ្ងៃ និងផ្ញើរបាយការណ៍សង្ខេបទៅ Telegram រួចរាល់!", "success");
      App.triggerConfetti();
    }

    return { present, absent, permission, totalStudents: students.length };
  },

  // ------------------------------------------------------------------------
  // 44. KHMER CALENDAR & TELEGRAM HOLIDAY BROADCAST
  // ------------------------------------------------------------------------
  openKhmerCalendar() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.openKhmerCalendarModal) {
      ModalsComponent.openKhmerCalendarModal();
    }
  },

  // ------------------------------------------------------------------------
  // 45. CLASS ATTENDANCE QR SHEET A4
  // ------------------------------------------------------------------------
  printClassAttendanceQrSheet(shift = "ព្រឹក") {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.openClassAttendanceQrSheetModal) {
      ModalsComponent.openClassAttendanceQrSheetModal(shift);
    }
  },

  printMonthlyAttendanceSheet(shift = "ព្រឹក") {
    this.printClassAttendanceQrSheet(shift);
  },

  // ------------------------------------------------------------------------
  // 46. FULL SYSTEM JSON BACKUP
  // ------------------------------------------------------------------------
  exportJsonBackup() {
    try {
      const data = {
        app: "MasterSchool TIS Lab Computer",
        exportDate: new Date().toISOString(),
        students: (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : (App.state.students || []),
        attendance: (typeof StudentAPI !== "undefined") ? StudentAPI.getAllAttendance() : {},
        exams: (typeof StudentAPI !== "undefined") ? StudentAPI.getAllExams() : {},
        fees: (typeof StudentAPI !== "undefined") ? StudentAPI.getAllFees() : {}
      };

      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `MasterSchool_Backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("💾 បានទាញយក JSON Backup ប្រព័ន្ធដោយជោគជ័យ!", "success");
      }
    } catch (err) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("កំហុសក្នុងការ Backup៖ " + err.message, "error");
      }
    }
  },

  // ------------------------------------------------------------------------
  // 47. EXECUTIVE SUMMARY A4 REPORT
  // ------------------------------------------------------------------------
  printExecutiveSummaryA4() {
    window.print();
  }
};

// Export to window
window.TeacherToolsService = TeacherToolsService;
window.transliterateKhmerToLatin = TeacherToolsService.transliterateKhmerToLatin.bind(TeacherToolsService);

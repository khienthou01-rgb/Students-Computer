/**
 * API & Data Service - Manages Firebase Realtime Database Integration & Image Cloud Storage
 */
const StudentAPI = {
  _isFetching: false,

  // Check if Firebase is initialized
  isCloudConnected() {
    return typeof firebase !== "undefined" && firebase.apps && firebase.apps.length > 0;
  },

  // Student ID Helpers (TX01, TX02, ...)
  formatStudentId(num, prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX") {
    const n = parseInt(num, 10) || 1;
    return `${prefix}${String(n).padStart(2, "0")}`;
  },

  parseStudentIdNumber(id) {
    if (!id) return 0;
    const clean = String(id).trim();
    const match = clean.match(/(?:TX|STU)[-_]?(\d+)/i) || clean.match(/(\d+)/);
    if (!match) return 0;
    let num = parseInt(match[1], 10);
    if (isNaN(num)) return 0;
    if (num >= 1000 && num < 2000) {
      num = num - 1000;
    }
    return num;
  },

  normalizeStudentId(id) {
    if (!id) return "";
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";
    const num = this.parseStudentIdNumber(id);
    return num > 0 ? this.formatStudentId(num, prefix) : String(id).trim();
  },

  // Transliterate Khmer name to Latin helper
  transliterateKhmerToLatin(text) {
    if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin) {
      return TeacherToolsService.transliterateKhmerToLatin(text);
    }
    if (typeof window !== "undefined" && typeof window.transliterateKhmerToLatin === "function") {
      return window.transliterateKhmerToLatin(text);
    }
    return "";
  },

  // Helper to normalize student data structure consistently
  normalizeStudent(s, idx = 0) {
    if (!s) return null;
    const student = { ...s };
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";

    if (!student.ID) {
      student.ID = this.formatStudentId(idx + 1, prefix);
    } else {
      const num = this.parseStudentIdNumber(student.ID);
      if (num > 0) {
        student.ID = this.formatStudentId(num, prefix);
      } else if (/^STU-/i.test(student.ID)) {
        student.ID = student.ID.replace(/^STU-/i, `${prefix}`);
      }
    }

    // Auto generate Latin Name (NameEn) if missing, empty, or still containing Khmer characters
    const currentNameEn = (student.NameEn || student.nameEn || "").trim();
    if ((!currentNameEn || /[\u1780-\u17FF]/.test(currentNameEn)) && student.NameKh) {
      const transliterated = this.transliterateKhmerToLatin(student.NameKh);
      if (transliterated) {
        student.NameEn = transliterated;
        student.nameEn = transliterated;
      }
    } else if (currentNameEn) {
      student.NameEn = currentNameEn;
      student.nameEn = currentNameEn;
    }

    // TIS Lab Computer is 100% Computer Class
    student.Grade = "ថ្នាក់កុំព្យូទ័រ";

    // Course
    let c = (student.Course || "").trim();
    if (!c || c.includes("English") || c.includes("Beginner") || c.includes("Intermediate")) {
      student.Course = "Typing";
    } else {
      const lc = c.toLowerCase();
      if (lc.includes("typing") || lc.includes("វាយ")) {
        student.Course = "Typing";
      } else if (lc === "word" || lc.includes("word")) {
        student.Course = "Microsoft Word";
      } else if (lc === "excel" || lc.includes("excel")) {
        student.Course = "Microsoft Excel";
      } else if (lc === "powerpoint" || lc.includes("powerpoint") || lc.includes("ppt")) {
        student.Course = "Microsoft PowerPoint";
      }
    }

    // Shift
    if (!student.Shift) {
      student.Shift = "ព្រឹក";
    } else if (student.Shift.includes("ព្រឹក")) {
      student.Shift = "ព្រឹក";
    } else if (student.Shift.includes("ថ្ងៃ")) {
      student.Shift = "ថ្ងៃ";
    } else if (student.Shift.includes("រសៀល") || student.Shift.includes("យប់")) {
      student.Shift = "រសៀល";
    }

    // Dates — Always enforce 4-month course duration from StartDate
    if (!student.StartDate) {
      student.StartDate = student.CreatedAt || "2026-09-01";
    }
    // Force recalculate EndDate = StartDate + 4 months (override old 45-day values)
    const _startForEnd = new Date(student.StartDate || "2026-09-01");
    _startForEnd.setMonth(_startForEnd.getMonth() + (APP_CONFIG.DEFAULT_COURSE_DURATION_MONTHS || 4));
    student.EndDate = _startForEnd.toISOString().split("T")[0];

    // Status
    if (!student.Status) {
      student.Status = "Active";
    }

    // PIN
    if (!student.PIN && !student.pin) {
      student.PIN = "123";
    }

    // Avatar
    if (!student.Avatar) {
      student.Avatar = student.Gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
    }

    return student;
  },

  // Dynamic Fetching: Pulls directly from Firebase Realtime Database
  async getStudents(forceRefresh = true) {
    let students = this.getLocalStudents();

    // If connected to Firebase, fetch live data directly from Firebase Realtime Database
    if (this.isCloudConnected()) {
      try {
        this._isFetching = true;
        const snapshot = await firebase.database().ref("students").once("value");
        const val = snapshot.val();
        
        if (val) {
          if (Array.isArray(val)) {
            students = val.filter(Boolean);
          } else if (typeof val === "object") {
            students = Object.values(val);
          }
          let needsCloudSync = false;
          const oldIdsToDelete = [];
          const idMigrationMap = {};

          students = students.map((s, idx) => {
            const rawId = s && s.ID ? String(s.ID).trim() : "";
            const rawNameEn = (s && (s.NameEn || s.nameEn) ? String(s.NameEn || s.nameEn).trim() : "");
            const normalized = this.normalizeStudent(s, idx);
            if (!s.Grade || s.Grade !== "ថ្នាក់កុំព្យូទ័រ" || !s.PIN || (rawId && rawId !== normalized.ID) || (!rawNameEn && normalized.NameEn) || (/[\u1780-\u17FF]/.test(rawNameEn) && normalized.NameEn !== rawNameEn)) {
              needsCloudSync = true;
            }
            if (rawId && rawId !== normalized.ID) {
              oldIdsToDelete.push(rawId);
              idMigrationMap[rawId] = normalized.ID;
            }
            return normalized;
          }).filter(Boolean);

          // Always order newest students first (descending by CreatedAt and ID number)
          students.sort((a, b) => {
            const timeA = new Date(a.CreatedAt || a.StartDate || 0).getTime();
            const timeB = new Date(b.CreatedAt || b.StartDate || 0).getTime();
            if (timeB !== timeA) return timeB - timeA;
            const numA = parseInt((a.ID || "").replace(/\D/g, ""), 10) || 0;
            const numB = parseInt((b.ID || "").replace(/\D/g, ""), 10) || 0;
            return numB - numA;
          });

          this.saveLocalStudents(students);
          this._lastSyncedTime = new Date();
          console.log(`✅ ទាញទិន្នន័យពី Firebase Realtime Database ជោគជ័យ: ${students.length} នាក់`);

          // Proactively patch Firebase RTDB in the background if any record lacked Grade or needs TX01 ID migration
          if (needsCloudSync) {
            const updates = {};
            students.forEach(s => {
              updates[`students/${s.ID}`] = s;
            });
            oldIdsToDelete.forEach(oldId => {
              updates[`students/${oldId}`] = null;
            });
            firebase.database().ref().update(updates).catch(e => console.warn("Background normalization sync notice:", e));

            // Also migrate attendance, exams, fees, lab seats for changed IDs
            if (Object.keys(idMigrationMap).length > 0) {
              this._migrateRelatedDataIds(idMigrationMap);
            }
          }

          return students;
        } else {
          // If Firebase is empty, return empty array
          this.saveLocalStudents([]);
          return [];
        }
      } catch (err) {
        console.warn("⚠️ មិនអាចទាញទិន្នន័យពី Firebase (ប្រើទិន្នន័យ Cache បណ្តោះអាសន្ន):", err);
      } finally {
        this._isFetching = false;
      }
    }

    if (!students) {
      students = [];
    }

    return students;
  },

  // Clear all students, attendance, and exam records for fresh entry
  async clearAllStudents() {
    this.saveLocalStudents([]);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY_STUDENTS);
    this.saveAllAttendance({});
    this.saveAllExams({});

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref("students").remove();
        await firebase.database().ref("attendance").remove();
        await firebase.database().ref("exams").remove();
        console.log("✅ បានលុបទិន្នន័យសិស្សចាស់ៗទាំងអស់ពី Firebase RTDB");
      } catch (e) {
        console.warn("Firebase remove error:", e);
      }
    }
  },

  // Migrate related records (attendance, exams, fees, lab seats) when student IDs change
  _migrateRelatedDataIds(idMap) {
    if (!idMap || Object.keys(idMap).length === 0) return;
    try {
      // 1. Attendance migration
      const allAtt = this.getAllAttendance();
      let attChanged = false;
      const attUpdates = {};
      Object.keys(allAtt).forEach(dateKey => {
        const dayRecord = allAtt[dateKey];
        if (dayRecord && typeof dayRecord === "object") {
          Object.keys(idMap).forEach(oldId => {
            const newId = idMap[oldId];
            if (dayRecord[oldId] !== undefined) {
              dayRecord[newId] = dayRecord[oldId];
              attUpdates[`attendance/${dateKey}/${newId}`] = dayRecord[oldId];
              attUpdates[`attendance/${dateKey}/${oldId}`] = null;
              delete dayRecord[oldId];
              attChanged = true;
            }
          });
        }
      });
      if (attChanged) {
        this.saveAllAttendance(allAtt);
        if (this.isCloudConnected()) {
          firebase.database().ref().update(attUpdates).catch(e => console.warn("Firebase attendance migration notice:", e));
        }
      }

      // 2. Exams migration
      const allExams = this.getAllExams();
      let examsChanged = false;
      const examUpdates = {};
      Object.keys(idMap).forEach(oldId => {
        const newId = idMap[oldId];
        if (allExams[oldId]) {
          allExams[newId] = { ...allExams[oldId] };
          examUpdates[`exams/${newId}`] = allExams[newId];
          examUpdates[`exams/${oldId}`] = null;
          delete allExams[oldId];
          examsChanged = true;
        }
      });
      if (examsChanged) {
        this.saveAllExams(allExams);
        if (this.isCloudConnected()) {
          firebase.database().ref().update(examUpdates).catch(e => console.warn("Firebase exam migration notice:", e));
        }
      }

      // 3. Fees migration
      const allFees = this.getAllFees();
      let feesChanged = false;
      const feeUpdates = {};
      Object.keys(idMap).forEach(oldId => {
        const newId = idMap[oldId];
        if (allFees[oldId]) {
          allFees[newId] = { ...allFees[oldId], studentId: newId };
          feeUpdates[`fees/${newId}`] = allFees[newId];
          feeUpdates[`fees/${oldId}`] = null;
          delete allFees[oldId];
          feesChanged = true;
        }
      });
      if (feesChanged) {
        this.saveAllFees(allFees);
        if (this.isCloudConnected()) {
          firebase.database().ref().update(feeUpdates).catch(e => console.warn("Firebase fee migration notice:", e));
        }
      }

      // 4. Lab / Timetable Seats migration
      const labKey = APP_CONFIG.STORAGE_KEY_LAB || "master_school_lab_seats";
      const savedLab = localStorage.getItem(labKey);
      if (savedLab) {
        let seats = JSON.parse(savedLab);
        let seatsChanged = false;
        Object.keys(seats).forEach(shiftKey => {
          const shiftSeats = seats[shiftKey];
          if (shiftSeats && typeof shiftSeats === "object") {
            Object.keys(shiftSeats).forEach(pcId => {
              const currentId = shiftSeats[pcId];
              if (idMap[currentId]) {
                shiftSeats[pcId] = idMap[currentId];
                seatsChanged = true;
              }
            });
          }
        });
        if (seatsChanged) {
          localStorage.setItem(labKey, JSON.stringify(seats));
        }
      }
    } catch (err) {
      console.warn("Migration helper error:", err);
    }
  },

  // Add new student and save to Firebase Realtime Database
  async createStudent(studentData) {
    const students = this.getLocalStudents();
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";

    // Auto-generate ID if not yet generated
    if (!studentData.ID || String(studentData.ID).trim() === "" || studentData.ID === "AUTO") {
      let maxIdNum = 0;
      students.forEach(s => {
        const num = this.parseStudentIdNumber(s && s.ID ? s.ID : "");
        if (num > maxIdNum) maxIdNum = num;
      });
      studentData.ID = this.formatStudentId(maxIdNum + 1, prefix);
    } else {
      studentData.ID = this.normalizeStudentId(studentData.ID);
    }

    if (!studentData.CreatedAt) {
      studentData.CreatedAt = new Date().toISOString();
    }

    studentData = this.normalizeStudent(studentData, students.length);

    // If connected to Firebase, send directly to Firebase Realtime Database
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`students/${studentData.ID}`).set(studentData);
        console.log(`✅ បានបញ្ចូលទិន្នន័យក្នុង Firebase RTDB: ${studentData.ID}`);
      } catch (err) {
        console.warn("⚠️ បញ្ចូលក្នុង Firebase បរាជ័យ កំពុងរក្សាទុកក្នុង Local:", err);
      }
    }

    // Update local cache
    students.unshift(studentData);
    this.saveLocalStudents(students);

    return studentData;
  },

  // Batch insert multiple students from Excel / CSV import
  async createStudentsBatch(newStudentsList) {
    if (!Array.isArray(newStudentsList) || newStudentsList.length === 0) {
      return { count: 0, students: [] };
    }

    const currentStudents = this.getLocalStudents();
    const prefix = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.studentIdPrefix) || "TX";
    
    // Find current max ID number
    let maxIdNum = 0;
    currentStudents.forEach(s => {
      const num = this.parseStudentIdNumber(s && s.ID ? s.ID : "");
      if (num > maxIdNum) maxIdNum = num;
    });

    const processedList = [];
    const firebaseUpdates = {};

    newStudentsList.forEach((st) => {
      if (!st.ID || String(st.ID).trim() === "" || st.ID === "AUTO") {
        maxIdNum += 1;
        st.ID = this.formatStudentId(maxIdNum, prefix);
      } else {
        st.ID = this.normalizeStudentId(st.ID);
        const num = this.parseStudentIdNumber(st.ID);
        if (num > maxIdNum) maxIdNum = num;
      }
      if (!st.CreatedAt) {
        st.CreatedAt = new Date().toISOString().split("T")[0];
      }
      const normalized = this.normalizeStudent(st, currentStudents.length + processedList.length);
      processedList.push(normalized);
      firebaseUpdates[`students/${normalized.ID}`] = normalized;
    });

    // Save locally (new students at the top)
    const merged = [...processedList, ...currentStudents];
    this.saveLocalStudents(merged);

    // Save to Firebase in a single multi-path update
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref().update(firebaseUpdates);
        console.log(`✅ បានបញ្ចូលសិស្សជាក្រុម ${processedList.length} នាក់ ទៅក្នុង Firebase RTDB`);
      } catch (err) {
        console.warn("⚠️ Batch insert Firebase error:", err);
      }
    }

    return { count: processedList.length, students: processedList };
  },

  // Update existing student in Firebase Realtime Database
  async updateStudent(studentData) {
    const students = this.getLocalStudents();
    studentData = this.normalizeStudent(studentData);
    const index = students.findIndex(s => String(s.ID).trim() === String(studentData.ID).trim());

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`students/${studentData.ID}`).update(studentData);
        console.log(`✅ បានកែប្រែទិន្នន័យក្នុង Firebase RTDB: ${studentData.ID}`);
      } catch (err) {
        console.warn("⚠️ កែប្រែក្នុង Firebase បរាជ័យ:", err);
      }
    }

    if (index !== -1) {
      students[index] = { ...students[index], ...studentData };
    } else {
      students.unshift(studentData);
    }
    this.saveLocalStudents(students);

    return studentData;
  },

  // Delete student from Firebase Realtime Database
  async deleteStudent(studentId) {
    let students = this.getLocalStudents();
    students = students.filter(s => String(s.ID).trim() !== String(studentId).trim());
    this.saveLocalStudents(students);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`students/${studentId}`).remove();
        console.log(`✅ បានលុបទិន្នន័យក្នុង Firebase RTDB: ${studentId}`);
      } catch (err) {
        console.warn("⚠️ លុបពី Firebase បរាជ័យ:", err);
      }
    }

    return studentId;
  },

  // Helper: check if a student ID is blocked / dropped out (ID cannot be used)
  isStudentIdBlocked(studentId) {
    if (!studentId) return false;
    const cleanId = String(studentId).trim().toUpperCase();
    const students = this.getLocalStudents();
    const s = students.find(st => st && String(st.ID).trim().toUpperCase() === cleanId);
    if (!s) return false;
    const status = (s.Status || "").toLowerCase();
    return s.isBlocked === true || status === "dropped" || status === "បោះបង់" || status === "បោះបង់ការសិក្សា";
  },

  // Mark student as Dropped Out (ID is locked / deactivated)
  async markStudentDropped(studentId, { dropDate, dropReason, dropNote } = {}) {
    const students = this.getLocalStudents();
    const index = students.findIndex(s => String(s.ID).trim().toUpperCase() === String(studentId).trim().toUpperCase());
    if (index === -1) throw new Error(`រកមិនឃើញសិស្សអត្តលេខ ${studentId} ឡើយ!`);

    const updated = {
      ...students[index],
      Status: "Dropped",
      isBlocked: true,
      DropDate: dropDate || new Date().toISOString().split("T")[0],
      DropReason: dropReason || "រវល់ការងារផ្ទាល់ខ្លួន",
      DropNote: dropNote || "",
      UpdatedAt: new Date().toISOString()
    };

    const result = await this.updateStudent(updated);
    return result;
  },

  // Mark student as Graduated
  async markStudentGraduated(studentId, { graduateDate, finalGrade, course, note, issueCert } = {}) {
    const students = this.getLocalStudents();
    const index = students.findIndex(s => String(s.ID).trim().toUpperCase() === String(studentId).trim().toUpperCase());
    if (index === -1) throw new Error(`រកមិនឃើញសិស្សអត្តលេខ ${studentId} ឡើយ!`);

    const updated = {
      ...students[index],
      Status: "Graduated",
      isBlocked: false,
      GraduateDate: graduateDate || new Date().toISOString().split("T")[0],
      FinalGrade: finalGrade || "ល្អ (Good)",
      GraduateNote: note || "",
      UpdatedAt: new Date().toISOString()
    };
    if (course) updated.Course = course;

    const res = await this.updateStudent(updated);

    // Auto issue certificate if requested
    if (issueCert && typeof this.issueCertificate === "function") {
      try {
        await this.issueCertificate(studentId, {
          certGrade: finalGrade || "Good",
          certDate: graduateDate || new Date().toISOString().split("T")[0]
        });
      } catch (e) {
        console.warn("Auto certificate issue warning:", e);
      }
    }

    return res;
  },

  // Reactivate a dropped student (unlock ID)
  async reactivateStudent(studentId) {
    const students = this.getLocalStudents();
    const index = students.findIndex(s => String(s.ID).trim().toUpperCase() === String(studentId).trim().toUpperCase());
    if (index === -1) throw new Error(`រកមិនឃើញសិស្សអត្តលេខ ${studentId} ឡើយ!`);

    const updated = {
      ...students[index],
      Status: "Active",
      isBlocked: false,
      ReactivatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    };

    return await this.updateStudent(updated);
  },

  // Test connection to Firebase Realtime Database
  async testConnection() {
    if (!this.isCloudConnected()) {
      return { success: false, error: "Firebase មិនទាន់បាន Initialize នៅឡើយទេ!" };
    }
    try {
      const snapshot = await firebase.database().ref("students").once("value");
      const val = snapshot.val();
      let count = 0;
      if (val) {
        count = Array.isArray(val) ? val.filter(Boolean).length : Object.keys(val).length;
      }
      return { success: true, count };
    } catch (err) {
      let msg = err.message || "មិនអាចភ្ជាប់ទៅកាន់ Firebase Realtime Database បានទេ!";
      if (msg.toLowerCase().includes("permission_denied") || msg.toLowerCase().includes("permission denied")) {
        msg = "Permission Denied: សូមចូលទៅ Firebase Console -> Realtime Database -> Rules ហើយកំណត់ \".read\": true, \".write\": true";
      }
      return { success: false, error: msg };
    }
  },

  // Client-Side Image Compression
  compressImage(file, maxWidth = 480, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed base64 JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  // LocalStorage Cache
  getLocalStudents() {
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_STUDENTS);
      const list = data ? JSON.parse(data) : [];
      if (Array.isArray(list) && list.length > 0) {
        const students = list.map((s, idx) => this.normalizeStudent(s, idx)).filter(Boolean);
        students.sort((a, b) => {
          const timeA = new Date(a.CreatedAt || a.StartDate || 0).getTime();
          const timeB = new Date(b.CreatedAt || b.StartDate || 0).getTime();
          if (timeB !== timeA) return timeB - timeA;
          const numA = parseInt((a.ID || "").replace(/\D/g, ""), 10) || 0;
          const numB = parseInt((b.ID || "").replace(/\D/g, ""), 10) || 0;
          return numB - numA;
        });
        return students;
      }
      return [];
    } catch (e) {
      return [];
    }
  },

  saveLocalStudents(students) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_STUDENTS, JSON.stringify(students));
  },

  // ==========================================
  // Attendance Management Service
  // ==========================================
  async fetchAttendanceCloud() {
    if (this.isCloudConnected()) {
      try {
        const snapshot = await firebase.database().ref("attendance").once("value");
        const val = snapshot.val();
        if (val && typeof val === "object") {
          const local = this.getAllAttendance();
          const merged = { ...local, ...val };
          this.saveAllAttendance(merged);
          return merged;
        }
      } catch (e) {
        console.warn("Fetch attendance from Firebase notice:", e);
      }
    }
    return this.getAllAttendance();
  },

  getAllAttendance() {
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_ATTENDANCE);
      if (data) return JSON.parse(data);
    } catch (e) {}

    return {};
  },

  saveAllAttendance(attendanceMap) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_ATTENDANCE, JSON.stringify(attendanceMap));
  },

  getAttendanceForDate(dateStr) {
    const all = this.getAllAttendance();
    return all[dateStr] || {};
  },

  getAttendanceForMonth(year, month) {
    const all = this.getAllAttendance();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const result = {};
    Object.keys(all).forEach(dateStr => {
      if (dateStr.startsWith(monthPrefix)) {
        result[dateStr] = all[dateStr];
      }
    });
    return result;
  },

  async saveAttendanceForDate(dateStr, records) {
    const all = this.getAllAttendance();
    all[dateStr] = records;
    this.saveAllAttendance(all);

    // Sync to Firebase if connected
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`attendance/${dateStr}`).set(records);
      } catch (e) {
        console.warn("Firebase attendance sync notice:", e);
      }
    }
    return records;
  },

  async saveAttendanceRecord(studentId, dateStr = new Date().toISOString().split("T")[0], status = "Present", note = "") {
    const all = this.getAllAttendance();
    const dayRecords = all[dateStr] || {};
    const norm = (status.toLowerCase() === "present" || status === "វត្តមាន") ? "Present" :
                 (status.toLowerCase() === "permission" || status === "ច្បាប់") ? "Permission" : "Absent";
    dayRecords[studentId] = norm;
    return await this.saveAttendanceForDate(dateStr, dayRecords);
  },

  async saveMultipleDaysAttendance(daysRecordsMap) {
    const all = this.getAllAttendance();
    Object.assign(all, daysRecordsMap);
    this.saveAllAttendance(all);

    // Sync to Firebase if connected
    if (this.isCloudConnected()) {
      try {
        const updates = {};
        Object.keys(daysRecordsMap).forEach(d => {
          updates[`attendance/${d}`] = daysRecordsMap[d];
        });
        await firebase.database().ref().update(updates);
      } catch (e) {
        console.warn("Firebase batch attendance sync notice:", e);
      }
    }
    return all;
  },

  getStudentAttendanceSummary(studentId) {
    const all = this.getAllAttendance();
    let totalDays = 0;
    let present = 0;
    let permission = 0;
    let absent = 0;

    Object.values(all).forEach(dayRecord => {
      if (dayRecord && dayRecord[studentId]) {
        totalDays++;
        const status = dayRecord[studentId];
        if (status === "Present" || status === "វត្តមាន") present++;
        else if (status === "Permission" || status === "ច្បាប់") permission++;
        else if (status === "Absent" || status === "អវត្តមាន") absent++;
      }
    });

    const rate = totalDays > 0 ? Math.round((present / totalDays) * 100) : 100;
    return {
      totalDays,
      present,
      permission,
      absent,
      rate
    };
  },

  getStudentAtRiskStatus(studentId) {
    const all = this.getAllAttendance();
    const dates = Object.keys(all).sort(); // Chronological order
    if (dates.length === 0) {
      return { isAtRisk: false, consecutive: 0, totalAbsent: 0, permission: 0, rate: 100, totalDays: 0, lastMissedDates: [] };
    }

    let consecutive = 0;
    const missedDates = [];
    // Traverse backwards from the most recent recorded date
    for (let i = dates.length - 1; i >= 0; i--) {
      const d = dates[i];
      const status = all[d]?.[studentId];
      if (status === "Absent" || status === "អវត្តមាន") {
        consecutive++;
        missedDates.push(d);
      } else if (status === "Present" || status === "វត្តមាន") {
        break; // Streak broken by presence
      } else if (status === "Permission" || status === "ច្បាប់") {
        // Did not break streak if absent right before, but don't count permission as pure unexcused absent
        continue;
      }
    }

    const summary = this.getStudentAttendanceSummary(studentId);
    // Student is at-risk if:
    // 1) 3+ consecutive unexcused absences
    // 2) Or total absences >= 3 and attendance rate < 75%
    // 3) Or total recorded absences >= 4
    const isAtRisk = consecutive >= 3 || (summary.totalDays >= 4 && summary.rate < 75) || summary.absent >= 4;

    return {
      isAtRisk,
      consecutive,
      totalAbsent: summary.absent,
      permission: summary.permission,
      rate: summary.rate,
      totalDays: summary.totalDays,
      lastMissedDates: missedDates
    };
  },

  getAllAtRiskStudents() {
    const students = this.getLocalStudents().filter(s => s.Status !== "Dropped" && s.Status !== "Drop" && s.Status !== "Graduated");
    const result = [];
    students.forEach(s => {
      const risk = this.getStudentAtRiskStatus(s.ID);
      if (risk.isAtRisk) {
        result.push({ student: s, risk });
      }
    });
    // Sort highest consecutive absence first, then lowest attendance rate
    result.sort((a, b) => (b.risk.consecutive - a.risk.consecutive) || (a.risk.rate - b.risk.rate) || (b.risk.totalAbsent - a.risk.totalAbsent));
    return result;
  },

  getLocalAttendance() {
    return [];
  },

  _generateDemoAttendance() {
    const result = {};
    const students = this.getLocalStudents();
    const studentIds = (students && students.length > 0) ? students.map(s => s.ID) : DEFAULT_STUDENTS.map(s => s.ID);
    
    // Generate recent 30 days of demo attendance for weekdays (Mon-Fri)
    const today = new Date();
    for (let i = 35; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayOfWeek = d.getDay();
      // Skip weekends: Sunday (0) and Saturday (6)
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const dateKey = d.toISOString().split("T")[0];
      const dayRecords = {};

      studentIds.forEach((id, idx) => {
        // High attendance rate: ~85-90% present, ~7% permission, ~3% absent
        const seed = (idx * 3 + i * 7) % 20;
        if (seed === 17) dayRecords[id] = "Permission";
        else if (seed === 19) dayRecords[id] = "Absent";
        else dayRecords[id] = "Present";
      });

      result[dateKey] = dayRecords;
    }
    return result;
  },

  async resetDemoData() {
    const demoData = [...DEFAULT_STUDENTS];
    this.saveLocalStudents(demoData);
    this.saveAllAttendance(this._generateDemoAttendance());
    this.saveAllExams({});

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref("exams").remove();
        const studentsObj = {};
        demoData.forEach(s => {
          studentsObj[s.ID] = s;
        });
        await firebase.database().ref("students").set(studentsObj);
      } catch (err) {
        console.warn("Reset demo data to Firebase failed:", err);
      }
    }

    return demoData;
  },

  // ==========================================
  // Computer Course Exams & Score Management
  // ==========================================
  getAllExams() {
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_EXAMS || "master_school_exams_db");
      if (data) return JSON.parse(data);
    } catch (e) {}

    return {};
  },

  saveAllExams(examsMap) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_EXAMS || "master_school_exams_db", JSON.stringify(examsMap));
  },

  getStudentExams(studentId) {
    const all = this.getAllExams();
    return all[studentId] || {};
  },

  async saveStudentExam(studentId, courseId, examData) {
    const all = this.getAllExams();
    if (!all[studentId]) all[studentId] = {};
    all[studentId][courseId] = {
      ...all[studentId][courseId],
      ...examData,
      updatedAt: new Date().toISOString()
    };
    this.saveAllExams(all);

    // Sync to Firebase if connected
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`exams/${studentId}/${courseId}`).set(all[studentId][courseId]);
      } catch (e) {
        console.warn("Firebase exam sync notice:", e);
      }
    }
    return all[studentId][courseId];
  },

  calculateGrade(score) {
    const s = Number(score) || 0;
    if (s >= 90) return "A";
    if (s >= 80) return "B";
    if (s >= 70) return "C";
    if (s >= 60) return "D";
    if (s >= 50) return "E";
    return "F";
  },

  async saveBatchExams(courseId, batchScores, examDate = new Date().toISOString().split("T")[0]) {
    // batchScores is an object: { [studentId]: { score: number, grade?: string, status?: string, note?: string } }
    const all = this.getAllExams();
    const updates = {};
    const nowIso = new Date().toISOString();

    Object.keys(batchScores).forEach(studentId => {
      const entry = batchScores[studentId];
      if (entry === null || entry === undefined) return;
      
      const numScore = Math.max(0, Math.min(100, Number(entry.score) || 0));
      const grade = entry.grade || this.calculateGrade(numScore);
      const status = entry.status || (numScore >= 50 ? "Pass" : "Fail");

      if (!all[studentId]) all[studentId] = {};
      const scoreObj = {
        score: numScore,
        grade: grade,
        status: status,
        examDate: examDate,
        note: entry.note || "",
        updatedAt: nowIso
      };

      all[studentId][courseId] = scoreObj;
      updates[`exams/${studentId}/${courseId}`] = scoreObj;
    });

    this.saveAllExams(all);

    // Sync to Firebase if connected
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref().update(updates);
      } catch (e) {
        console.warn("Firebase batch exam sync notice:", e);
      }
    }

    return all;
  },

  // Promote student to the next module in sequence: Typing -> Word -> Excel -> PowerPoint -> Graduated
  async promoteStudentCourse(studentId) {
    const students = this.getLocalStudents();
    const student = students.find(s => s.ID === studentId);
    if (!student) throw new Error("រកមិនឃើញសិស្សឡើយ");

    const currentCourse = (student.Course || "").trim();
    let nextCourse = "";
    let isGraduated = false;

    if (currentCourse.includes("Typing")) {
      nextCourse = "Microsoft Word";
    } else if (currentCourse.includes("Word")) {
      nextCourse = "Microsoft Excel";
    } else if (currentCourse.includes("Excel")) {
      nextCourse = "Microsoft PowerPoint";
    } else if (currentCourse.includes("PowerPoint")) {
      isGraduated = true;
      nextCourse = "Microsoft PowerPoint";
    } else {
      nextCourse = "Typing";
    }

    student.Course = nextCourse;
    if (isGraduated) {
      student.Status = "Graduated";
    }

    await this.updateStudent(student);
    return { student, nextCourse, isGraduated };
  },

  async clearAllExams() {
    this.saveAllExams({});
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY_EXAMS || "master_school_exams_db");
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref("exams").remove();
      } catch (e) {
        console.warn("Clear exams from Firebase error:", e);
      }
    }
    return {};
  },

  async fetchExamsCloud() {
    if (this.isCloudConnected()) {
      try {
        const snapshot = await firebase.database().ref("exams").once("value");
        const val = snapshot.val();
        if (val && typeof val === "object") {
          this.saveAllExams(val);
          return val;
        } else {
          this.saveAllExams({});
          return {};
        }
      } catch (e) {
        console.warn("Fetch exams notice:", e);
      }
    }
    return this.getAllExams();
  },

  _generateDemoExams() {
    return {};
  },

  // ==========================================
  // Tuition Fees & Invoicing Service
  // ==========================================
  getAllFees() {
    let fees = {};
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_FEES || "master_school_fees_db");
      if (data) fees = JSON.parse(data) || {};
    } catch (e) {}

    const students = this.getLocalStudents();
    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;
    let hasChanges = false;

    if (Array.isArray(students) && students.length > 0) {
      students.forEach(s => {
        const existing = fees[s.ID];
        // Ensure every student has $50 total, $50 paid, $0 balance, status "Paid"
        if (!existing || existing.status !== "Paid" || existing.balance > 0 || existing.totalAmount !== defaultPrice || existing.paidAmount !== defaultPrice) {
          fees[s.ID] = {
            studentId: s.ID,
            studentNameKh: s.NameKh || "",
            studentNameEn: s.NameEn || "",
            course: s.Course || "Typing",
            totalAmount: defaultPrice,
            paidAmount: defaultPrice,
            discount: 0,
            balance: 0,
            status: "Paid",
            receiptNo: existing?.receiptNo || ("INV-2026-" + String(s.ID).replace(/\D/g, "").padStart(4, "0")),
            date: existing?.date || s.StartDate || "2026-08-10",
            paymentMethod: (existing?.paymentMethod && existing?.paymentMethod !== "—") ? existing.paymentMethod : "ABA KHQR",
            note: "បង់ថ្លៃសិក្សាពេញ $50 រួចរាល់",
            updatedAt: new Date().toISOString()
          };
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      this.saveAllFees(fees);
    }
    return fees;
  },

  saveAllFees(feesMap) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_FEES || "master_school_fees_db", JSON.stringify(feesMap));
  },

  async fetchFeesCloud() {
    if (this.isCloudConnected()) {
      try {
        const snapshot = await firebase.database().ref("fees").once("value");
        const val = snapshot.val();
        const local = this.getAllFees();
        const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;

        let merged = { ...local };
        if (val && typeof val === "object") {
          Object.keys(val).forEach(sid => {
            const remote = val[sid];
            // Normalize any remote fee that had debt or old price
            merged[sid] = {
              ...(local[sid] || {}),
              ...remote,
              totalAmount: defaultPrice,
              paidAmount: defaultPrice,
              discount: 0,
              balance: 0,
              status: "Paid",
              paymentMethod: (remote.paymentMethod && remote.paymentMethod !== "—") ? remote.paymentMethod : "ABA KHQR"
            };
          });
        }

        this.saveAllFees(merged);
        // Sync the clean $50 fully paid records back to cloud
        await firebase.database().ref("fees").set(merged);
        return merged;
      } catch (e) {
        console.warn("Fetch fees from Firebase notice:", e);
      }
    }
    return this.getAllFees();
  },

  getStudentFee(studentId) {
    const all = this.getAllFees();
    if (all[studentId]) return all[studentId];

    const defaultPrice = APP_CONFIG.feeConfig?.defaultCoursePrice || 50;
    const students = this.getLocalStudents();
    const student = students.find(s => s.ID === studentId);
    return {
      studentId: studentId,
      studentNameKh: student ? student.NameKh : "",
      studentNameEn: student ? student.NameEn : "",
      course: student ? (student.Course || "Typing") : "Typing",
      totalAmount: defaultPrice,
      paidAmount: defaultPrice,
      discount: 0,
      balance: 0,
      status: "Paid",
      receiptNo: "INV-2026-" + String(studentId).replace(/\D/g, "").padStart(4, "0"),
      date: student?.StartDate || "2026-08-10",
      paymentMethod: "ABA KHQR",
      note: "បង់ថ្លៃសិក្សាពេញ $50 រួចរាល់",
      updatedAt: new Date().toISOString()
    };
  },

  async saveStudentPayment(studentId, paymentData) {
    const all = this.getAllFees();
    const students = this.getLocalStudents();
    const student = students.find(s => s.ID === studentId);

    const total = parseFloat(paymentData.totalAmount) || (APP_CONFIG.feeConfig?.defaultCoursePrice || 50);
    const paid = parseFloat(paymentData.paidAmount) || total;
    const discount = parseFloat(paymentData.discount) || 0;
    const balance = Math.max(0, total - discount - paid);

    let status = "Paid";
    if (balance > 0 && paid > 0) {
      status = "Partial";
    } else if (balance > 0 && paid === 0) {
      status = "Unpaid";
    }

    const receiptNo = paymentData.receiptNo || ("INV-" + new Date().getFullYear() + "-" + String(studentId).replace(/\D/g, "").padStart(4, "0"));

    all[studentId] = {
      studentId: studentId,
      studentNameKh: student ? student.NameKh : (paymentData.studentNameKh || ""),
      studentNameEn: student ? student.NameEn : (paymentData.studentNameEn || ""),
      course: paymentData.course || (student ? student.Course : "Typing"),
      totalAmount: total,
      paidAmount: paid,
      discount: discount,
      balance: balance,
      status: status,
      receiptNo: receiptNo,
      date: paymentData.date || new Date().toISOString().split("T")[0],
      paymentMethod: paymentData.paymentMethod || "ABA KHQR",
      note: paymentData.note || "បង់ថ្លៃសិក្សាគ្រប់ចំនួន ($50)",
      updatedAt: new Date().toISOString()
    };

    this.saveAllFees(all);

    // Sync to Firebase if connected
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`fees/${studentId}`).set(all[studentId]);
      } catch (e) {
        console.warn("Firebase fee sync notice:", e);
      }
    }

    return all[studentId];
  },

  // ==========================================
  // Digital Certificate Management Service
  // ==========================================
  getAllCertificates() {
    try {
      const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY_CERTIFICATES || "master_school_certificates_db");
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {};
  },

  saveAllCertificates(certsMap) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_CERTIFICATES || "master_school_certificates_db", JSON.stringify(certsMap));
  },

  async fetchCertificatesCloud() {
    if (this.isCloudConnected()) {
      try {
        const snapshot = await firebase.database().ref("certificates").once("value");
        const val = snapshot.val();
        if (val && typeof val === "object") {
          const local = this.getAllCertificates();
          const merged = { ...local, ...val };
          this.saveAllCertificates(merged);
          return merged;
        }
      } catch (e) {
        console.warn("Fetch certificates from Firebase notice:", e);
      }
    }
    return this.getAllCertificates();
  },

  getStudentCertificate(studentId) {
    const all = this.getAllCertificates();
    return all[studentId] || null;
  },

  async issueCertificate(studentId, certData = {}) {
    const all = this.getAllCertificates();
    const students = this.getLocalStudents();
    const student = students.find(s => s.ID === studentId);
    const exams = this.getStudentExams(studentId);

    const certId = certData.certId || ("MS-CERT-" + new Date().getFullYear() + "-" + String(studentId).replace(/\D/g, "").padStart(4, "0"));

    const scores = [
      exams.Typing?.score,
      exams.Word?.score,
      exams.Excel?.score,
      exams.PowerPoint?.score
    ].filter(s => typeof s === "number");

    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : (certData.overallScore || 85);
    let grade = "A";
    if (avg >= 85) grade = "A";
    else if (avg >= 75) grade = "B";
    else if (avg >= 65) grade = "C";
    else grade = "D";

    all[studentId] = {
      certId: certId,
      studentId: studentId,
      studentNameKh: student ? student.NameKh : (certData.studentNameKh || "សិស្ស"),
      studentNameEn: student ? student.NameEn : (certData.studentNameEn || ""),
      gender: student ? student.Gender : (certData.gender || "ប្រុស"),
      courseName: certData.courseName || "វគ្គបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល (Administrative Computer Literacy)",
      completionDate: certData.completionDate || new Date().toISOString().split("T")[0],
      issueDate: certData.issueDate || new Date().toISOString().split("T")[0],
      gpa: grade,
      overallScore: avg,
      director: "លោកគ្រូ ខៀន ធូ",
      modules: [
        { name: "Typing", score: exams.Typing?.score ?? 90, grade: exams.Typing?.grade ?? "A" },
        { name: "Microsoft Word", score: exams.Word?.score ?? 88, grade: exams.Word?.grade ?? "A" },
        { name: "Microsoft Excel", score: exams.Excel?.score ?? 85, grade: exams.Excel?.grade ?? "B" },
        { name: "Microsoft PowerPoint", score: exams.PowerPoint?.score ?? 92, grade: exams.PowerPoint?.grade ?? "A" }
      ],
      verified: true,
      issuedAt: new Date().toISOString()
    };

    this.saveAllCertificates(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`certificates/${studentId}`).set(all[studentId]);
      } catch (e) {
        console.warn("Firebase certificate sync notice:", e);
      }
    }

    return all[studentId];
  },

  async saveCertificateRecord(certRecord = {}) {
    const studentId = certRecord.studentId || certRecord.id;
    if (!studentId) return null;
    return await this.issueCertificate(studentId, certRecord);
  },

  // ====================================================
  // PC LAB WORKSTATIONS MAINTENANCE & HEALTH TRACKER
  // ====================================================
  getLabMaintenance() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_LAB_MAINTENANCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  },

  saveAllLabMaintenance(data) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_LAB_MAINTENANCE, JSON.stringify(data));
    } catch (e) {}
  },

  async saveLabMaintenance(pcId, maintenanceData) {
    const all = this.getLabMaintenance();
    all[pcId] = {
      pcId,
      status: maintenanceData.status || "normal", // 'normal' | 'maintenance' | 'broken'
      issueNote: maintenanceData.issueNote || "",
      reportedBy: maintenanceData.reportedBy || "លោកគ្រូ ខៀន ធូ",
      updatedAt: new Date().toISOString()
    };
    this.saveAllLabMaintenance(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`lab_maintenance/${pcId}`).set(all[pcId]);
      } catch (e) {
        console.warn("Firebase lab maintenance error:", e);
      }
    }
    return all[pcId];
  },

  // ====================================================
  // PC LAB SOFTWARE & LICENSE ASSET MANAGEMENT
  // ====================================================
  getDefaultSoftwareList() {
    return [
      {
        id: "sw_word",
        name: "Microsoft Word",
        category: "Office",
        icon: "fa-solid fa-file-word",
        color: "#2563eb",
        version: "2021 (v16.0)",
        licenseType: "Volume License",
        licenseKey: "W269N-WFGWX-YVC9B-4J6C9-T83GX",
        installDate: "2026-01-10",
        expiryDate: "2027-01-10",
        installedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07","PC-08","PC-09","PC-10","PC-11","PC-12","PC-13","PC-14","PC-15","PC-16"],
        updateStatus: "uptodate",
        setupPath: "D:\\Setup\\Office2021_ProPlus.iso",
        downloadUrl: "https://setup.office.com",
        notes: "កម្មវិធីរៀនវាយអត្ថបទរដ្ឋបាល លិខិតស្នាម និងរបាយការណ៍"
      },
      {
        id: "sw_excel",
        name: "Microsoft Excel",
        category: "Office",
        icon: "fa-solid fa-file-excel",
        color: "#059669",
        version: "2021 (v16.0)",
        licenseType: "Volume License",
        licenseKey: "W269N-WFGWX-YVC9B-4J6C9-T83GX",
        installDate: "2026-01-10",
        expiryDate: "2027-01-10",
        installedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07","PC-08","PC-09","PC-10","PC-11","PC-12","PC-13","PC-14","PC-15","PC-16"],
        updateStatus: "uptodate",
        setupPath: "D:\\Setup\\Office2021_ProPlus.iso",
        downloadUrl: "https://setup.office.com",
        notes: "កម្មវិធីគណនាលេខ តារាងទិន្នន័យ វិក្កយបត្រ និងរូបមន្តគណិតវិទ្យា"
      },
      {
        id: "sw_ppt",
        name: "Microsoft PowerPoint",
        category: "Office",
        icon: "fa-solid fa-file-powerpoint",
        color: "#ea580c",
        version: "2021 (v16.0)",
        licenseType: "Volume License",
        licenseKey: "W269N-WFGWX-YVC9B-4J6C9-T83GX",
        installDate: "2026-01-10",
        expiryDate: "2027-01-10",
        installedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07","PC-08","PC-09","PC-10","PC-11","PC-12","PC-13","PC-14","PC-15","PC-16"],
        updateStatus: "uptodate",
        setupPath: "D:\\Setup\\Office2021_ProPlus.iso",
        downloadUrl: "https://setup.office.com",
        notes: "កម្មវិធីធ្វើបទបង្ហាញ និងរចនាស្លាយ Presentation រដ្ឋបាល"
      },
      {
        id: "sw_typing",
        name: "Khmer Typing Tutor",
        category: "Typing",
        icon: "fa-solid fa-keyboard",
        color: "#7c3aed",
        version: "v2.4.0",
        licenseType: "Free / Educational",
        licenseKey: "KHMER-TYPING-LAB-TIS",
        installDate: "2026-01-15",
        expiryDate: "2030-12-31",
        installedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07","PC-08","PC-09","PC-10","PC-11","PC-12","PC-13","PC-14","PC-15","PC-16"],
        updateStatus: "uptodate",
        setupPath: "D:\\Setup\\KhmerTypingTutor_Setup.exe",
        downloadUrl: "",
        notes: "កម្មវិធីហាត់វាយអក្សរខ្មែរក្តារចុចយូនីកូដ ១០ ម្រាម"
      },
      {
        id: "sw_fonts",
        name: "Khmer Unicode & Admin Fonts",
        category: "Fonts",
        icon: "fa-solid fa-font",
        color: "#0891b2",
        version: "v5.2 (Full Pack)",
        licenseType: "Open-Source (Free)",
        licenseKey: "GPL-KHMER-OS",
        installDate: "2026-01-10",
        expiryDate: "2035-01-01",
        installedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07","PC-08","PC-09","PC-10","PC-11","PC-12","PC-13","PC-14","PC-15","PC-16"],
        updateStatus: "uptodate",
        setupPath: "D:\\Setup\\KhmerFonts_Admin_Pack.zip",
        downloadUrl: "",
        notes: "ពុម្ពអក្សរខ្មែររដ្ឋបាល៖ Khmer OS Muol Light, Battambang, Siemreap, Bokor"
      },
      {
        id: "sw_pdf",
        name: "Foxit PDF Reader",
        category: "Utility",
        icon: "fa-solid fa-file-pdf",
        color: "#dc2626",
        version: "v12.1.3",
        licenseType: "Free Edition",
        licenseKey: "FOXIT-FREE-EDITION",
        installDate: "2026-01-12",
        expiryDate: "2028-12-31",
        installedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07","PC-08","PC-09","PC-10","PC-11","PC-12","PC-13","PC-14","PC-15","PC-16"],
        updateStatus: "uptodate",
        setupPath: "D:\\Setup\\FoxitPDFReader_Setup.exe",
        downloadUrl: "https://www.foxit.com/pdf-reader/",
        notes: "កម្មវិធីអាន និងបោះពុម្ពឯកសារ PDF រដ្ឋបាល"
      },
      {
        id: "sw_browser",
        name: "Google Chrome",
        category: "Browser",
        icon: "fa-brands fa-chrome",
        color: "#d97706",
        version: "v128.0 (64-bit)",
        licenseType: "Freeware",
        licenseKey: "GOOGLE-CHROME-ENTERPRISE",
        installDate: "2026-01-10",
        expiryDate: "2030-01-01",
        installedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07","PC-08","PC-09","PC-10","PC-11","PC-12","PC-13","PC-14","PC-15","PC-16"],
        updateStatus: "uptodate",
        setupPath: "D:\\Setup\\ChromeStandaloneSetup64.exe",
        downloadUrl: "https://www.google.com/chrome/",
        notes: "កម្មវិធីបើកអ៊ីនធឺណិត ស្រាវជ្រាវ និងផ្ញើ Email ក្នុងម៉ោងរៀន"
      },
      {
        id: "sw_freeze",
        name: "Deep Freeze Standard",
        category: "Security",
        icon: "fa-solid fa-snowflake",
        color: "#0284c7",
        version: "v8.63",
        licenseType: "Volume License",
        licenseKey: "DF-STD-TIS-LAB-863X",
        installDate: "2026-01-05",
        expiryDate: "2027-05-20",
        installedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07","PC-08","PC-09","PC-10","PC-11","PC-12","PC-13","PC-14","PC-15","PC-16"],
        updateStatus: "uptodate",
        setupPath: "D:\\Setup\\DFStd_Installer.exe",
        downloadUrl: "",
        notes: "ប្រព័ន្ធចាក់សោរ Hard Disk Drive C ការពារសិស្សលុបឯកសារ ឬឆ្លងមេរោគ"
      }
    ];
  },

  getLabSoftwareList() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_LAB_SOFTWARE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const defaults = this.getDefaultSoftwareList();
    this.saveAllLabSoftware(defaults);
    return defaults;
  },

  saveAllLabSoftware(list) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_LAB_SOFTWARE, JSON.stringify(list));
    } catch (e) {}

    if (this.isCloudConnected()) {
      try {
        firebase.database().ref("lab_software").set(list);
      } catch (e) {
        console.warn("Firebase lab software error:", e);
      }
    }
  },

  async saveLabSoftware(swData) {
    const list = this.getLabSoftwareList();
    let updated;
    if (swData.id) {
      const idx = list.findIndex(s => s.id === swData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...swData, updatedAt: new Date().toISOString() };
        updated = list[idx];
      } else {
        updated = { ...swData, id: swData.id, createdAt: new Date().toISOString() };
        list.push(updated);
      }
    } else {
      const newId = `sw_${Date.now()}`;
      updated = { ...swData, id: newId, createdAt: new Date().toISOString() };
      list.push(updated);
    }
    this.saveAllLabSoftware(list);
    return updated;
  },

  async deleteLabSoftware(swId) {
    let list = this.getLabSoftwareList();
    list = list.filter(s => s.id !== swId);
    this.saveAllLabSoftware(list);
    return true;
  },

  async assignSoftwareToPcs(swId, pcList) {
    const list = this.getLabSoftwareList();
    const target = list.find(s => s.id === swId);
    if (target) {
      target.installedPcs = pcList || [];
      target.updatedAt = new Date().toISOString();
      this.saveAllLabSoftware(list);
    }
    return target;
  },

  // Lab Printer Mapping
  getDefaultPrinterMapping() {
    return {
      mainPrinter: {
        name: "Canon LBP2900 (Network Printer)",
        model: "Laser Shot LBP2900",
        ipAddress: "192.168.1.200",
        location: "តុគ្រូបង្រៀន (Teacher Desk)",
        status: "online", // 'online' | 'offline' | 'paper_jam'
        paperStatus: "A4 Normal Ready",
        mappedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07","PC-08","PC-09","PC-10","PC-11","PC-12","PC-13","PC-14"]
      },
      colorPrinter: {
        name: "Epson EcoTank L3210 (Color Printer)",
        model: "EcoTank L3210 All-in-One",
        ipAddress: "192.168.1.201",
        location: "ផ្នែករដ្ឋបាល (Admin Corner)",
        status: "online",
        paperStatus: "Color Ready",
        mappedPcs: ["PC-01","PC-02","PC-03","PC-04","PC-05","PC-06","PC-07"]
      }
    };
  },

  getLabPrinterMapping() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_LAB_PRINTERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const defaults = this.getDefaultPrinterMapping();
    this.saveLabPrinterMapping(defaults);
    return defaults;
  },

  saveLabPrinterMapping(mapping) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_LAB_PRINTERS, JSON.stringify(mapping));
    } catch (e) {}

    if (this.isCloudConnected()) {
      try {
        firebase.database().ref("lab_printers").set(mapping);
      } catch (e) {}
    }
  },

  // Lab Practice Exercises & Shared Homework Dropzone
  getDefaultLabExercises() {
    return [
      {
        id: "ex_word_01",
        title: "លំហាត់ Word ០១៖ ការរៀបចំទម្រង់លិខិតរដ្ឋបាលផ្លូវការ",
        category: "Word",
        fileType: "DOCX",
        fileName: "Lesson01_Official_Letter_Exercise.docx",
        filePath: "D:\\កិច្ចការសិស្ស_TIS\\Exercises\\Word\\Lesson01_Letter.docx",
        targetShift: "ALL",
        updatedAt: "2026-09-15",
        submissionsCount: 14
      },
      {
        id: "ex_excel_01",
        title: "លំហាត់ Excel ០១៖ តារាងគណនាប្រាក់ខែបុគ្គលិក (SUM, IF, VLOOKUP)",
        category: "Excel",
        fileType: "XLSX",
        fileName: "Lesson02_Payroll_Table_Exercise.xlsx",
        filePath: "D:\\កិច្ចការសិស្ស_TIS\\Exercises\\Excel\\Lesson02_Payroll.xlsx",
        targetShift: "ALL",
        updatedAt: "2026-09-16",
        submissionsCount: 12
      },
      {
        id: "ex_ppt_01",
        title: "លំហាត់ PowerPoint ០១៖ ការបង្កើតស្លាយបទបង្ហាញស្ទាត់ជំនាញ",
        category: "PowerPoint",
        fileType: "PPTX",
        fileName: "Lesson03_Master_Slides_Exercise.pptx",
        filePath: "D:\\កិច្ចការសិស្ស_TIS\\Exercises\\PowerPoint\\Lesson03_Slide.pptx",
        targetShift: "ALL",
        updatedAt: "2026-09-17",
        submissionsCount: 10
      },
      {
        id: "ex_type_01",
        title: "លំហាត់វាយអក្សរខ្មែរ៖ អត្ថបទរឿងនិទានប្រចាំថ្ងៃ (កម្រិតមធ្យម ៣០ wpm)",
        category: "Typing",
        fileType: "TXT",
        fileName: "Lesson04_Khmer_Typing_Speed_Test.txt",
        filePath: "D:\\កិច្ចការសិស្ស_TIS\\Exercises\\Typing\\Lesson04_Test.txt",
        targetShift: "ALL",
        updatedAt: "2026-09-17",
        submissionsCount: 14
      }
    ];
  },

  getLabExercisesList() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_LAB_EXERCISES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const defaults = this.getDefaultLabExercises();
    this.saveAllLabExercises(defaults);
    return defaults;
  },

  saveAllLabExercises(list) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_LAB_EXERCISES, JSON.stringify(list));
    } catch (e) {}

    if (this.isCloudConnected()) {
      try {
        firebase.database().ref("lab_exercises").set(list);
      } catch (e) {}
    }
  },

  async saveLabExercise(exData) {
    const list = this.getLabExercisesList();
    let updated;
    if (exData.id) {
      const idx = list.findIndex(e => e.id === exData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...exData, updatedAt: new Date().toISOString().split('T')[0] };
        updated = list[idx];
      } else {
        updated = { ...exData, id: exData.id, updatedAt: new Date().toISOString().split('T')[0] };
        list.push(updated);
      }
    } else {
      updated = { ...exData, id: `ex_${Date.now()}`, submissionsCount: 0, updatedAt: new Date().toISOString().split('T')[0] };
      list.push(updated);
    }
    this.saveAllLabExercises(list);
    return updated;
  },

  async deleteLabExercise(id) {
    let list = this.getLabExercisesList();
    list = list.filter(e => e.id !== id);
    this.saveAllLabExercises(list);
    return true;
  },

  // Remote Smart Lab Commands Dispatcher
  async sendSmartLabCommand(commandType, targetPcs = "ALL", payload = {}) {
    const timestampNow = Date.now();
    const commandRecord = {
      commandId: `cmd_${timestampNow}`,
      type: commandType, // 'shutdown' | 'restart' | 'mute' | 'unmute' | 'exam_mode_on' | 'exam_mode_off' | 'broadcast_screen_on' | 'broadcast_screen_off' | 'distribute_exercise' | 'collect_work'
      action: commandType,
      targetPcs: targetPcs,
      payload: payload || {},
      issuedBy: "លោកគ្រូ ខៀន ធូ",
      timestamp: timestampNow,
      isoDate: new Date().toISOString()
    };

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`lab_monitor/commands/${commandRecord.commandId}`).set(commandRecord);

        // Immediate direct or broadcast command trigger
        if (targetPcs === "ALL") {
          await firebase.database().ref("lab_monitor/commands/ALL").set({
            action: commandType,
            type: commandType,
            timestamp: timestampNow
          });
        } else if (Array.isArray(targetPcs)) {
          for (const pc of targetPcs) {
            await firebase.database().ref(`lab_monitor/commands/${pc}`).set({
              action: commandType,
              type: commandType,
              timestamp: timestampNow
            });
          }
        } else if (typeof targetPcs === "string") {
          await firebase.database().ref(`lab_monitor/commands/${targetPcs}`).set({
            action: commandType,
            type: commandType,
            timestamp: timestampNow
          });
        }

        // Also update policy if it's exam or broadcast
        if (commandType === "exam_mode_on") {
          await firebase.database().ref("lab_monitor/policy").update({
            mode: "exam",
            whitelist: ["WINWORD", "EXCEL", "POWERPNT", "typing", "khmer", "cmd"],
            isInternetBlocked: true,
            updatedAt: new Date().toISOString()
          });
        } else if (commandType === "exam_mode_off") {
          await firebase.database().ref("lab_monitor/policy").update({
            mode: "free",
            isInternetBlocked: false,
            updatedAt: new Date().toISOString()
          });
        } else if (commandType === "broadcast_screen_on") {
          await firebase.database().ref("lab_monitor/policy").update({
            isTeacherBroadcasting: true,
            updatedAt: new Date().toISOString()
          });
        } else if (commandType === "broadcast_screen_off") {
          await firebase.database().ref("lab_monitor/policy").update({
            isTeacherBroadcasting: false,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn("Firebase send command error:", e);
      }
    }
    return commandRecord;
  },

  // Calculate PC Readiness Score (100% Ready)
  getLabReadinessSummary(totalPcs = 16) {
    const softwareList = this.getLabSoftwareList();
    const maintenance = this.getLabMaintenance();
    const requiredSoftwareIds = ["sw_word", "sw_excel", "sw_ppt", "sw_typing", "sw_fonts"];

    const pcStatus = {};
    for (let i = 1; i <= totalPcs; i++) {
      const pcId = `PC-${String(i).padStart(2, '0')}`;
      const maint = maintenance[pcId] || { status: "normal" };
      const missing = [];

      requiredSoftwareIds.forEach(id => {
        const sw = softwareList.find(s => s.id === id);
        if (sw && (!sw.installedPcs || !sw.installedPcs.includes(pcId))) {
          missing.push(sw.name);
        }
      });

      const isBroken = maint.status === "broken";
      const isMaint = maint.status === "maintenance";
      const isReady = !isBroken && !isMaint && missing.length === 0;

      pcStatus[pcId] = {
        pcId,
        isReady,
        missingSoftware: missing,
        maintStatus: maint.status || "normal",
        issueNote: maint.issueNote || "",
        score: isReady ? 100 : Math.max(20, Math.round(((5 - missing.length) / 5) * 80))
      };
    }
    return pcStatus;
  },

  // ====================================================
  // SMART LAB EXTENSIONS (ATTENTION, MESSAGE, URL, SHOWCASE, SEAT CLAIM, CURRICULUM)
  // ====================================================

  getDefaultCurriculum() {
    return [
      {
        id: "mod_typing",
        title: "វាយអត្ថបទខ្មែរ-អង់គ្លេស (Khmer Typing Tutor)",
        icon: "fa-keyboard",
        color: "#6366f1",
        items: [
          { id: "typ_01", text: "ក្បាច់ដាក់ម្រាមដៃលើក្តារចុច (Home Row: A S D F - J K L ;)", done: true },
          { id: "typ_02", text: "វាយព្យញ្ជនៈខ្មែរ (Shift និង Normal Keys)", done: true },
          { id: "typ_03", text: "វាយស្រៈខ្មែរពេញតួ និងស្រៈនិស្ស័យ", done: true },
          { id: "typ_04", text: "វាយជើងអក្សរខ្មែរ (Subscript ដោយប្រើគ្រាប់ចុច F / J)", done: false },
          { id: "typ_05", text: "អនុវត្តវាយអត្ថបទរដ្ឋបាលល្បឿន 25+ WPM ដោយគ្មានកំហុស", done: false }
        ]
      },
      {
        id: "mod_word",
        title: "Microsoft Word (រដ្ឋបាល & លិខិតស្នាម)",
        icon: "fa-file-word",
        color: "#2563eb",
        items: [
          { id: "wrd_01", text: "ការកំណត់ Page Setup, Margin, Paper Size (A4) និង Orientation", done: true },
          { id: "wrd_02", text: "ការរៀបចំ Font Khmer Unicode, Line Spacing, Paragraph Indent", done: true },
          { id: "wrd_03", text: "ការបង្កើត និង Format តារាងរដ្ឋបាល (Tables, Borders & Shading)", done: true },
          { id: "wrd_04", text: "ការប្រើប្រាស់ Tab Stop & Tab Leader (ចុចចុចៗក្នុងទម្រង់រដ្ឋបាល)", done: false },
          { id: "wrd_05", text: "លិខិតស្នាមរដ្ឋបាល & Mail Merge (បញ្ចូលឈ្មោះស្វ័យប្រវត្តក្នុងសំបុត្រ)", done: false },
          { id: "wrd_06", text: "Header, Footer, Page Numbering & Watermark", done: false },
          { id: "wrd_07", text: "ការ Export PDF & Print ឯកសាររដ្ឋបាលស្តង់ដារ A4", done: false }
        ]
      },
      {
        id: "mod_excel",
        title: "Microsoft Excel (ការិយាល័យ & គណនេយ្យគ្រឹះ)",
        icon: "fa-file-excel",
        color: "#16a34a",
        items: [
          { id: "xl_01", text: "គ្រឹះនៃការបញ្ចូលទិន្នន័យ, Format Cell, Border & Alignment", done: true },
          { id: "xl_02", text: "រូបមន្តបឋម (SUM, AVERAGE, MIN, MAX, COUNT)", done: true },
          { id: "xl_03", text: "រូបមន្តលក្ខខណ្ឌ (IF, Nested IF, COUNTIF, SUMIF)", done: false },
          { id: "xl_04", text: "រូបមន្តស្វែងរកទិន្នន័យស្វ័យប្រវត្ត (VLOOKUP, HLOOKUP)", done: false },
          { id: "xl_05", text: "តារាងប្រាក់ខែបុគ្គលិក (Payroll) & បញ្ជីវត្តមានប្រចាំខែ", done: false },
          { id: "xl_06", text: "ការបង្កើត និងកែសម្រួលក្រាហ្វស្ថិតិ (Charts & Graphs)", done: false },
          { id: "xl_07", text: "ការកំណត់ Freeze Panes, Data Sort & Filter", done: false },
          { id: "xl_08", text: "Page Setup & Print តារាង Excel មិនឱ្យដាច់ទំព័រ", done: false }
        ]
      },
      {
        id: "mod_powerpoint",
        title: "Microsoft PowerPoint (បទបង្ហាញវិជ្ជាជីវៈ)",
        icon: "fa-file-powerpoint",
        color: "#d97706",
        items: [
          { id: "ppt_01", text: "ការរៀបចំ Layout, Theme & Color Palette សមរម្យ", done: true },
          { id: "ppt_02", text: "ការប្រើប្រាស់ Slide Master (កំណត់ទម្រង់ក្បាលស្លាយរួម)", done: false },
          { id: "ppt_03", text: "ការបញ្ចូលរូបភាព, SmartArt, Shape & Icon ឱ្យមានទម្ងន់", done: false },
          { id: "ppt_04", text: "ការកំណត់ Transition & Custom Animation មិនឱ្យរញ៉េរញ៉ៃ", done: false },
          { id: "ppt_05", text: "ការរៀបចំ Slide Show, Presenter View & Export PDF/Video", done: false }
        ]
      }
    ];
  },

  getCurriculumProgress(shiftId = "all") {
    try {
      const saved = localStorage.getItem(`${APP_CONFIG.STORAGE_KEY_LAB_CURRICULUM}_${shiftId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return this.getDefaultCurriculum();
  },

  async saveCurriculumProgress(shiftId = "all", curriculumData) {
    try {
      localStorage.setItem(`${APP_CONFIG.STORAGE_KEY_LAB_CURRICULUM}_${shiftId}`, JSON.stringify(curriculumData));
      if (this.isCloudConnected()) {
        await firebase.database().ref(`lab_monitor/curriculum/${shiftId}`).set({
          data: curriculumData,
          updatedAt: new Date().toISOString()
        });
      }
      return true;
    } catch (e) {
      console.warn("Save curriculum error:", e);
      return false;
    }
  },

  async toggleAttentionMode(isLocked, customMessage = "⚠️ សូមផ្អាកការអនុវត្ត និងងាកមកស្តាប់ការពន្យល់របស់លោកគ្រូ!") {
    const cmdType = isLocked ? "attention_lock" : "attention_unlock";
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref("lab_monitor/policy").update({
          isAttentionLocked: !!isLocked,
          attentionMessage: customMessage,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {}
    }
    return this.sendSmartLabCommand(cmdType, "ALL", { message: customMessage });
  },

  async sendBroadcastMessage(targetPcs = "ALL", messageText = "", messageTitle = "ដំណឹងពីលោកគ្រូ") {
    if (!messageText.trim()) return;
    return this.sendSmartLabCommand("popup_message", targetPcs, {
      title: messageTitle,
      text: messageText,
      sentAt: new Date().toLocaleTimeString('km-KH')
    });
  },

  async launchRemoteUrl(targetPcs = "ALL", url = "") {
    if (!url.trim()) return;
    let fullUrl = url.trim();
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      fullUrl = "https://" + fullUrl;
    }
    return this.sendSmartLabCommand("open_url", targetPcs, { url: fullUrl });
  },

  async setShowcaseStream(sourcePcId = null, isActive = false) {
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref("lab_monitor/policy").update({
          showcasePc: isActive ? sourcePcId : null,
          isShowcaseActive: !!isActive,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {}
    }
    return this.sendSmartLabCommand(isActive ? "showcase_on" : "showcase_off", "ALL", { sourcePc: sourcePcId });
  },

  async claimStudentSeat(pcId, studentId, studentName) {
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`lab_monitor/pcs/${pcId}`).update({
          claimedStudentId: studentId,
          claimedStudentName: studentName,
          claimedTime: Date.now()
        });
      } catch (e) {}
    }
    // Also auto-mark attendance for today if not marked
    try {
      const today = new Date().toISOString().split("T")[0];
      const students = this.getAllStudents();
      const st = students.find(s => s.id === studentId);
      if (st) {
        this.saveAttendanceRecord(studentId, today, "present", "Auto-claimed at " + pcId);
      }
    } catch (e) {}
    return true;
  },

  async clearStudentHand(pcId) {
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`lab_monitor/pcs/${pcId}`).update({
          hand_raised: false,
          handRaised: false
        });
      } catch (e) {}
    }
    return true;
  },

  // ====================================================
  // STUDENT LEAVE REQUESTS (ប្រព័ន្ធសុំច្បាប់អវត្តមាន)
  // ====================================================
  getLeaveRequests() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_LEAVE_REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  saveAllLeaveRequests(requests) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_LEAVE_REQUESTS, JSON.stringify(requests));
    } catch (e) {}
  },

  async submitLeaveRequest(requestData) {
    const all = this.getLeaveRequests();
    const isApproved = requestData.status === "approved";
    const newReq = {
      id: "LR-" + Date.now(),
      studentId: requestData.studentId,
      studentNameKh: requestData.studentNameKh,
      startDate: requestData.startDate,
      endDate: requestData.endDate || requestData.startDate,
      reason: requestData.reason || "មានធុរៈចាំបាច់",
      phone: requestData.phone || "",
      status: requestData.status || "pending", // 'pending' | 'approved' | 'rejected'
      createdAt: new Date().toISOString(),
      approvedBy: isApproved ? (requestData.approvedBy || "Telegram Bot (ស្វ័យប្រវត្តិ)") : null,
      approvedAt: isApproved ? new Date().toISOString() : null,
      source: requestData.source || "web" // 'telegram' | 'portal' | 'web'
    };

    all.unshift(newReq);
    this.saveAllLeaveRequests(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`leave_requests/${newReq.id}`).set(newReq);
      } catch (e) {
        console.warn("Firebase leave request error:", e);
      }
    }

    // Auto-mark attendance permission ('Permission') if approved
    if (isApproved && newReq.studentId) {
      this.autoMarkAttendancePermission(newReq.studentId, newReq.startDate, newReq.endDate);
    }

    if (!isApproved && typeof TelegramService !== "undefined" && TelegramService.sendLeaveRequestAlert) {
      TelegramService.sendLeaveRequestAlert(newReq);
    }

    return newReq;
  },

  async updateLeaveRequestStatus(requestId, status, approverName = "លោកគ្រូ ខៀន ធូ") {
    const all = this.getLeaveRequests();
    const req = all.find(r => r.id === requestId);
    if (!req) return null;

    req.status = status; // 'approved' | 'rejected'
    req.approvedBy = approverName;
    req.approvedAt = new Date().toISOString();

    this.saveAllLeaveRequests(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`leave_requests/${requestId}`).update({
          status: req.status,
          approvedBy: req.approvedBy,
          approvedAt: req.approvedAt
        });
      } catch (e) {
        console.warn("Firebase leave status error:", e);
      }
    }

    // Auto-mark attendance permission ('Permission') if approved
    if (status === "approved" && req.studentId) {
      this.autoMarkAttendancePermission(req.studentId, req.startDate, req.endDate);
    }

    if (typeof TelegramService !== "undefined" && TelegramService.sendLeaveStatusAlert) {
      TelegramService.sendLeaveStatusAlert(req);
    }

    return req;
  },

  autoMarkAttendancePermission(studentId, startDate, endDate) {
    try {
      const allAtt = this.getAllAttendance();
      const start = new Date(startDate);
      const end = new Date(endDate || startDate);
      let curr = new Date(start);

      while (curr <= end) {
        const y = curr.getFullYear();
        const m = String(curr.getMonth() + 1).padStart(2, "0");
        const d = String(curr.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;

        if (!allAtt[dateStr]) allAtt[dateStr] = {};
        allAtt[dateStr][studentId] = "Permission";

        // Update live AttendanceView cache if present
        if (typeof AttendanceView !== "undefined" && AttendanceView.records) {
          if (!AttendanceView.records[dateStr]) AttendanceView.records[dateStr] = {};
          AttendanceView.records[dateStr][studentId] = "Permission";
        }

        curr.setDate(curr.getDate() + 1);
      }

      this.saveAllAttendance(allAtt);

      if (this.isCloudConnected()) {
        firebase.database().ref("attendance").update(allAtt).catch(e => {});
      }

      if (typeof AttendanceView !== "undefined" && AttendanceView.renderTable) {
        AttendanceView.renderTable();
      }
    } catch (e) {
      console.warn("Auto mark permission notice:", e);
    }
  },

  // ====================================================
  // PRACTICAL ASSIGNMENTS & HOMEWORK (កិច្ចការអនុវត្តជាក់ស្តែង)
  // ====================================================
  getAssignments() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_ASSIGNMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Realistic default assignments for computer training
    return [
      {
        id: "ASN-01",
        course: "Word",
        title: "កិច្ចការទី ១: រៀបចំលិខិតរដ្ឋបាល & តារាងអត្ថបទផ្លូវការ",
        instructions: "ប្រើប្រាស់ MS Word ដើម្បីរៀបចំលិខិតអញ្ជើញ និងតារាងរបាយការណ៍ ដោយកំណត់ Margin 2cm, Font Kantumruy Pro និងដាក់ Header/Footer ផ្លូវការ។",
        dueDate: "2026-10-15",
        createdBy: "លោកគ្រូ ខៀន ធូ",
        createdAt: "2026-09-01"
      },
      {
        id: "ASN-02",
        course: "Excel",
        title: "កិច្ចការទី ២: តារាងគណនាប្រាក់បៀវត្សរ៍ & VLOOKUP/IF",
        instructions: "បង្កើតតារាងគណនាប្រាក់បៀវត្សរ៍បុគ្គលិក ១០ នាក់ ដោយប្រើរូបមន្ត IF, VLOOKUP, SUM, AVERAGE និង Data Validation។",
        dueDate: "2026-10-25",
        createdBy: "លោកគ្រូ ខៀន ធូ",
        createdAt: "2026-09-01"
      },
      {
        id: "ASN-03",
        course: "PowerPoint",
        title: "កិច្ចការទី ៣: រចនាស្លាយបទបង្ហាញអាជីវកម្ម ៥ ស្លាយ",
        instructions: "រចនាស្លាយ Business Pitch Deck ៥ ស្លាយ ដោយមាន SmartArt, Slide Transitions, និង Animation ស្រស់ស្អាត។",
        dueDate: "2026-11-05",
        createdBy: "លោកគ្រូ ខៀន ធូ",
        createdAt: "2026-09-01"
      }
    ];
  },

  saveAllAssignments(list) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_ASSIGNMENTS, JSON.stringify(list));
    } catch (e) {}
  },

  async saveAssignment(assignmentData) {
    const all = this.getAssignments();
    if (!assignmentData.id) {
      assignmentData.id = "ASN-" + String(all.length + 1).padStart(2, "0");
      assignmentData.createdAt = new Date().toISOString().split("T")[0];
      all.unshift(assignmentData);
    } else {
      const idx = all.findIndex(a => a.id === assignmentData.id);
      if (idx !== -1) all[idx] = { ...all[idx], ...assignmentData };
      else all.unshift(assignmentData);
    }
    this.saveAllAssignments(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`assignments/${assignmentData.id}`).set(assignmentData);
      } catch (e) {}
    }
    return assignmentData;
  },

  async deleteAssignment(id) {
    let all = this.getAssignments();
    all = all.filter(a => a.id !== id);
    this.saveAllAssignments(all);
    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`assignments/${id}`).remove();
      } catch (e) {}
    }
  },

  getAssignmentSubmissions() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_ASSIGNMENT_SUBS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  saveAllAssignmentSubmissions(subs) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY_ASSIGNMENT_SUBS, JSON.stringify(subs));
    } catch (e) {}
  },

  async submitAssignment(subData) {
    const all = this.getAssignmentSubmissions();
    const subId = `SUB-${subData.assignmentId}-${subData.studentId}`;
    const newSub = {
      id: subId,
      assignmentId: subData.assignmentId,
      studentId: subData.studentId,
      studentNameKh: subData.studentNameKh,
      submissionUrl: subData.submissionUrl || "",
      notes: subData.notes || "",
      submittedAt: new Date().toISOString(),
      grade: subData.grade || null, // 'A' | 'B' | 'C' | 'Passed'
      feedback: subData.feedback || ""
    };

    const idx = all.findIndex(s => s.id === subId);
    if (idx !== -1) all[idx] = newSub;
    else all.unshift(newSub);

    this.saveAllAssignmentSubmissions(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`assignment_submissions/${subId}`).set(newSub);
      } catch (e) {}
    }
    return newSub;
  },

  async gradeAssignmentSubmission(subId, grade, feedback = "") {
    const all = this.getAssignmentSubmissions();
    const sub = all.find(s => s.id === subId);
    if (!sub) return null;

    sub.grade = grade;
    sub.feedback = feedback;
    sub.gradedAt = new Date().toISOString();

    this.saveAllAssignmentSubmissions(all);

    if (this.isCloudConnected()) {
      try {
        await firebase.database().ref(`assignment_submissions/${subId}`).update({
          grade: sub.grade,
          feedback: sub.feedback,
          gradedAt: sub.gradedAt
        });
      } catch (e) {}
    }
    return sub;
  }
};

window.StudentAPI = StudentAPI;



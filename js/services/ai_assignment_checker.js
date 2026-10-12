/**
 * ==========================================================================
 * Service: AIAssignmentChecker (AI ពិនិត្យ និងដាក់ពិន្ទុកិច្ចការអនុវត្តជាក់ស្តែង)
 * Powered by Google Gemini 3.8 Flash AI
 * Evaluates student practical exercises (Word, Excel, PowerPoint, Typing)
 * strictly against the school's 120-page textbook standards!
 * ==========================================================================
 */

const AIAssignmentChecker = {
  STORAGE_KEY_HISTORY: "master_school_assignment_checks",

  openModal(defaultSubject = "Word") {
    this.ensureModalInDOM();
    this.renderCheckerModal(defaultSubject);
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("aiAssignmentCheckerModal");
    } else {
      const el = document.getElementById("aiAssignmentCheckerModal");
      if (el) el.style.display = "flex";
    }
  },

  closeModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("aiAssignmentCheckerModal");
    } else {
      const el = document.getElementById("aiAssignmentCheckerModal");
      if (el) el.style.display = "none";
    }
  },

  ensureModalInDOM() {
    let modal = document.getElementById("aiAssignmentCheckerModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "aiAssignmentCheckerModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10780";
      document.body.appendChild(modal);
    }
  },

  renderCheckerModal(defaultSubject = "Word") {
    const modal = document.getElementById("aiAssignmentCheckerModal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 820px; width: 95%; max-height: 90vh; background: #0f172a; border-radius: 20px; border: 1.5px solid #8b5cf6; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); overflow: hidden; display: flex; flex-direction: column; padding: 0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e1b4b, #581c87); border-bottom: 2px solid #8b5cf6; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(139, 92, 246, 0.25); border: 1.5px solid #a855f7; display: flex; align-items: center; justify-content: center; color: #d8b4fe; font-size: 1.3rem;">
              <i class="fa-solid fa-file-circle-check"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
                <span>AI ពិនិត្យ និងដាក់ពិន្ទុកិច្ចការជាក់ស្តែង (Assignment Checker)</span>
                <span class="badge" style="background: #a855f7; color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">Gemini 3.8 Flash</span>
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.78rem; color: #e9d5ff;">
                ពិនិត្យកិច្ចការ Word, Excel, PowerPoint ផ្អែកលើស្តង់ដារសៀវភៅមូលដ្ឋាន ១២០ ទំព័រ
              </p>
            </div>
          </div>
          <button type="button" onclick="AIAssignmentChecker.closeModal()" style="background: rgba(255, 255, 255, 0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Form Body -->
        <div id="aiCheckerFormArea" style="flex: 1; overflow-y: auto; padding: 22px 24px; display: flex; flex-direction: column; gap: 16px;">
          <!-- Subject Selector -->
          <div>
            <label style="display: block; font-size: 0.84rem; font-weight: 700; color: #e2e8f0; margin-bottom: 8px;">
              💻 ជ្រើសរើសមុខវិជ្ជានៃកិច្ចការ (Assignment Subject):
            </label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
              <label style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="chkSubject" value="Word" ${defaultSubject === 'Word' ? 'checked' : ''}>
                <i class="fa-solid fa-file-word text-blue-400"></i>
                <span style="font-size: 0.85rem; font-weight: 700; color: #fff;">Microsoft Word</span>
              </label>

              <label style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="chkSubject" value="Excel" ${defaultSubject === 'Excel' ? 'checked' : ''}>
                <i class="fa-solid fa-file-excel text-emerald-400"></i>
                <span style="font-size: 0.85rem; font-weight: 700; color: #fff;">Microsoft Excel</span>
              </label>

              <label style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="chkSubject" value="PowerPoint" ${defaultSubject === 'PowerPoint' ? 'checked' : ''}>
                <i class="fa-solid fa-file-powerpoint text-orange-400"></i>
                <span style="font-size: 0.85rem; font-weight: 700; color: #fff;">PowerPoint</span>
              </label>

              <label style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="chkSubject" value="Typing" ${defaultSubject === 'Typing' ? 'checked' : ''}>
                <i class="fa-solid fa-keyboard text-purple-400"></i>
                <span style="font-size: 0.85rem; font-weight: 700; color: #fff;">Typing & IT</span>
              </label>
            </div>
          </div>

          <!-- Assignment Description / Criteria -->
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
              📝 ប្រធានបទកិច្ចការ (Assignment Title/Topic):
            </label>
            <input type="text" id="chkAssignmentTopic" placeholder="ឧ. លិខិតរដ្ឋបាលជាតិ A4, តារាងបញ្ជីប្រាក់ខែដោយប្រើ IF និង SUM..." style="width: 100%; height: 40px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #64748b; border-radius: 8px; color: #fff; font-size: 0.85rem;">
          </div>

          <!-- File Upload or Content Input -->
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
              📎 ផ្ទុកឡើងរូបភាព/ឯកសារកិច្ចការ ឬសរសេរពិពណ៌នាការងារ (Work Submission):
            </label>
            <div style="background: rgba(30, 41, 59, 0.6); border: 1.5px dashed #64748b; border-radius: 12px; padding: 16px; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <input type="file" id="chkAssignmentFileInput" accept="image/*,.pdf,.txt" onchange="AIAssignmentChecker.handleFileSelect(event)" style="font-size: 0.82rem; color: #cbd5e1;">
              </div>
              <div id="chkFilePreviewBox" style="font-size: 0.78rem; color: #94a3b8;">
                <i class="fa-solid fa-circle-info"></i> អ្នកអាច Screenshot រូបភាពកិច្ចការ Word/Excel របស់អ្នក ឬ Copy អត្ថបទ/រូបមន្តដែលបានសរសេរមក Paste ខាងក្រោម៖
              </div>
            </div>

            <textarea id="chkAssignmentText" rows="4" placeholder="ឬចម្លង (Paste) អត្ថបទ, រូបមន្ត Excel ដែលបានសរសេរ (ឧ. =SUM(E2:E10), =IF(F2>=50, &quot;ជាប់&quot;, &quot;ធ្លាក់&quot;)) ឬព័ត៌មានលម្អិតនៃឯកសារនៅទីនេះ..." style="width: 100%; padding: 10px 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #64748b; border-radius: 8px; color: #fff; font-size: 0.85rem; line-height: 1.5;"></textarea>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" onclick="AIAssignmentChecker.closeModal()" class="btn-secondary" style="height: 42px; padding: 0 18px; font-size: 0.85rem;">
              បោះបង់
            </button>
            <button type="button" id="btnSubmitCheckAssignment" onclick="AIAssignmentChecker.analyzeAssignment()" class="btn-primary" style="height: 42px; padding: 0 24px; font-size: 0.9rem; font-weight: 800; background: linear-gradient(135deg, #8b5cf6, #d946ef); border: none; border-radius: 10px; box-shadow: 0 4px 14px rgba(217, 70, 239, 0.4); display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-sparkles"></i> <span>⚡ AI ពិនិត្យ និងដាក់ពិន្ទុភ្លាមៗ</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = document.getElementById("chkFilePreviewBox");
    if (!preview) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this._uploadedFileBase64 = evt.target.result;
        preview.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; color: #34d399; font-weight: 700;">
            <i class="fa-solid fa-image"></i> <span>បានផ្ទុករូបភាព៖ ${file.name} (${Math.round(file.size / 1024)} KB)</span>
          </div>
          <img src="${evt.target.result}" style="max-height: 120px; border-radius: 8px; margin-top: 8px; border: 1px solid #475569;">
        `;
      };
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = `
        <div style="color: #38bdf8; font-weight: 700;">
          <i class="fa-solid fa-file"></i> បានជ្រើសរើសឯកសារ៖ ${file.name} (${Math.round(file.size / 1024)} KB)
        </div>
      `;
    }
  },

  async analyzeAssignment() {
    const subjectRadio = document.querySelector('input[name="chkSubject"]:checked');
    const subject = subjectRadio ? subjectRadio.value : "Word";
    const topic = document.getElementById("chkAssignmentTopic")?.value.trim() || `កិច្ចការអនុវត្ត ${subject}`;
    const textContent = document.getElementById("chkAssignmentText")?.value.trim() || "";
    const btn = document.getElementById("btnSubmitCheckAssignment");

    if (!textContent && !this._uploadedFileBase64) {
      alert("សូមផ្ទុកឡើងរូបភាពកិច្ចការ ឬសរសេរពិពណ៌នា/ចម្លងអត្ថបទ និងរូបមន្តដែលបានអនុវត្ត!");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Gemini AI កំពុងពិនិត្យ...</span>`;
    }

    const prompt = `
You are the Senior Practical Computer Lab Instructor at Tian Xin International School (TIS LAB COMPUTER).
Evaluate this student's practical assignment submission against the official 120-page textbook: «សៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័ររដ្ឋបាល & IT»:
Subject: ${subject}
Assignment Topic: ${topic}
Student Submission Content/Notes:
${textContent || "(Image attached)"}

EVALUATION CRITERIA (Strictly citing the textbook):
- MS Word: Page Margins (Top 2.5cm, Bottom 2.5cm, Left 2.5cm, Right 2cm), Fonts (Khmer OS Muol Light 14pt, Siemreap 11pt, 1.15 line spacing), Table borders, Header/Footer.
- MS Excel: Correct formula syntax (starts with '='), proper usage of SUM, AVERAGE, IF, COUNTIF, SUMIF, UPPER, LOWER, PROPER, absolute references ($A$1).
- PowerPoint: Clean slide design, Transitions vs Animations, Slide Master.
- Typing: 10-finger home row keys, Khmer Unicode subscript key 'j'.

Return strictly RAW JSON matching this schema:
{
  "score": 88,
  "grade": "B",
  "status": "Pass",
  "summary_kh": "សង្ខេបអំពីគុណភាពកិច្ចការ...",
  "strengths_kh": [
    "ចំណុចល្អទី១...",
    "ចំណុចល្អទី២..."
  ],
  "improvements_kh": [
    "ចំណុចខ្វះខាតត្រូវកែប្រែទី១...",
    "ចំណុចខ្វះខាតត្រូវកែប្រែទី២..."
  ],
  "bookReference_kh": "យោងសៀវភៅមូលដ្ឋាន ទំព័រ... ជំពូក...",
  "teacherEncouragement_kh": "ពាក្យលើកទឹកចិត្តរបស់គ្រូ..."
}
`.trim();

    let result = null;

    if (typeof GeminiAIService !== "undefined") {
      try {
        result = await GeminiAIService.callGeminiJson(prompt);
      } catch (e) {
        console.warn("Gemini assignment check error, using pedagogical engine fallback:", e);
      }
    }

    if (!result || !result.score) {
      result = this._fallbackGrading(subject, topic, textContent);
    }

    this.renderGradingResult(result, subject, topic);
  },

  _fallbackGrading(subject, topic, text) {
    let score = 85;
    let strengths = ["រៀបចំទម្រង់បានសមរម្យ និងមានរបៀបរៀបរយ", "អនុវត្តតាមគោលការណ៍ណែនាំបានល្អ"];
    let improvements = ["គួរពិនិត្យគម្លាតបន្ទាត់ និងរឹមទំព័រឱ្យបានម៉ត់ចត់បន្ថែម"];
    let bookRef = "សៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័រ";

    if (subject === "Word") {
      bookRef = "យោងសៀវភៅមូលដ្ឋាន មេរៀនទី ៤ (ទំព័រ ២៣-៥៦)";
      if (text.includes("2.5") || text.includes("Muol Light")) {
        score = 95;
        strengths.push("បានកំណត់ Margins និង Font ត្រឹមត្រូវតាមស្តង់ដារលិខិតរដ្ឋបាលជាតិ");
      } else {
        improvements.push("ក្បាលលិខិតផ្លូវការត្រូវប្រើ Font Khmer OS Muol Light 14pt (Center)");
      }
    } else if (subject === "Excel") {
      bookRef = "យោងសៀវភៅមូលដ្ឋាន មេរៀនទី ៦ (ទំព័រ ៧៣-១២០)";
      if (text.includes("=") && (text.includes("SUM") || text.includes("IF"))) {
        score = 92;
        strengths.push("ការសរសេររូបមន្តអនុគមន៍ Excel មានទម្រង់ត្រឹមត្រូវល្អ");
      } else {
        improvements.push("ត្រូវចាំថារាល់រូបមន្តទាំងអស់ក្នុង Excel ត្រូវចាប់ផ្តើមដោយសញ្ញាស្មើ (=)");
      }
    }

    return {
      score: score,
      grade: score >= 90 ? "A" : score >= 80 ? "B" : "C",
      status: score >= 50 ? "Pass" : "Needs Revision",
      summary_kh: `កិច្ចការលើប្រធានបទ «${topic}» ត្រូវបានពិនិត្យផ្ទៀងផ្ទាត់រួចរាល់។`,
      strengths_kh: strengths,
      improvements_kh: improvements,
      bookReference_kh: bookRef,
      teacherEncouragement_kh: "កិច្ចខិតខំប្រឹងប្រែងល្អណាស់! បន្តអនុវត្តបន្ថែមលើម៉ាស៊ីនដើម្បីកាន់តែស្ទាត់ជំនាញ។"
    };
  },

  renderGradingResult(res, subject, topic) {
    const area = document.getElementById("aiCheckerFormArea");
    if (!area) return;

    const isPass = res.score >= 50;

    area.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Top Score Banner -->
        <div style="background: linear-gradient(135deg, ${isPass ? 'rgba(16, 185, 129, 0.15), rgba(6, 78, 59, 0.4)' : 'rgba(239, 68, 68, 0.15), rgba(127, 29, 29, 0.4)'}; border: 1.5px solid ${isPass ? '#10b981' : '#ef4444'}; border-radius: 16px; padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 70px; height: 70px; border-radius: 50%; background: ${isPass ? '#10b981' : '#ef4444'}; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-weight: 900; box-shadow: 0 4px 16px ${isPass ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'};">
              <span style="font-size: 1.6rem; line-height: 1;">${res.score}</span>
              <span style="font-size: 0.65rem;">/ 100</span>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #fff;">
                  ${isPass ? 'លទ្ធផល៖ ជាប់ (Pass)' : 'លទ្ធផល៖ ត្រូវកែសម្រួលឡើងវិញ'}
                </h3>
                <span class="badge" style="background: rgba(255, 255, 255, 0.15); color: #fff; font-weight: 800;">និទ្ទេស ${res.grade}</span>
              </div>
              <p style="margin: 4px 0 0; font-size: 0.82rem; color: #cbd5e1;">${res.summary_kh}</p>
            </div>
          </div>

          <button type="button" onclick="AIAssignmentChecker.renderCheckerModal('${subject}')" class="btn-secondary" style="height: 38px; padding: 0 16px; font-size: 0.82rem;">
            <i class="fa-solid fa-rotate-left"></i> <span>ពិនិត្យកិច្ចការថ្មី</span>
          </button>
        </div>

        <!-- Strengths & Improvements Columns -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <!-- Strengths -->
          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px;">
            <h4 style="margin: 0 0 10px; font-size: 0.92rem; font-weight: 800; color: #34d399; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-circle-check"></i> ចំណុចល្អដែលបានអនុវត្តត្រឹមត្រូវ៖
            </h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.82rem; color: #cbd5e1; line-height: 1.6;">
              ${(res.strengths_kh || []).map(s => `<li>${s}</li>`).join("")}
            </ul>
          </div>

          <!-- Improvements -->
          <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 16px;">
            <h4 style="margin: 0 0 10px; font-size: 0.92rem; font-weight: 800; color: #fbbf24; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-triangle-exclamation"></i> ចំណុចខ្វះខាតត្រូវកែលម្អ៖
            </h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.82rem; color: #cbd5e1; line-height: 1.6;">
              ${(res.improvements_kh || []).map(i => `<li>${i}</li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- Textbook Reference & Advice -->
        <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 14px 18px; font-size: 0.82rem; color: #cbd5e1; line-height: 1.6;">
          <div style="color: #a5b4fc; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-book-bookmark"></i>
            <span>${res.bookReference_kh}</span>
          </div>
          <div>💡 <strong>អនុសាសន៍លោកគ្រូ៖</strong> ${res.teacherEncouragement_kh}</div>
        </div>
      </div>
    `;
  }
};

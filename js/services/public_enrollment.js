/**
 * ==========================================================================
 * Service: PublicEnrollment (ប្រព័ន្ធលីងចុះឈ្មោះសិស្សថ្មី Online & ផ្ទៀងផ្ទាត់ដោយគ្រូ)
 * Route: #enroll
 * Features:
 * - Public self-enrollment form with instant photo upload & shift picker
 * - Instant Telegram Alert to school bot (@my_master_kh_bot)
 * - Teacher Review & 1-Click Approval into active school roster
 * ==========================================================================
 */

const PublicEnrollment = {
  STORAGE_KEY_PENDING: "master_school_pending_enrollments",

  init() {
    this.checkHashRoute();
    window.addEventListener("hashchange", () => this.checkHashRoute());
  },

  checkHashRoute() {
    if (window.location.hash === "#enroll" || window.location.hash.startsWith("#enroll?")) {
      this.openPublicEnrollModal();
    }
  },

  getPendingList() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_PENDING);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  getPendingCount() {
    return this.getPendingList().length;
  },

  copyEnrollmentLink() {
    const url = window.location.origin + window.location.pathname + "#enroll";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        if (typeof Notifications !== "undefined") {
          Notifications.show("បានចម្លង Link ចុះឈ្មោះសិស្សថ្មីរួចរាល់! អាចផ្ញើជូនសិស្ស ឬអាណាព្យាបាលបាន", "success");
        } else {
          alert("បានចម្លង Link ចុះឈ្មោះសិស្សថ្មី៖ " + url);
        }
      }).catch(() => {
        prompt("សូមចម្លង Link នេះដើម្បីផ្ញើជូនសិស្ស៖", url);
      });
    } else {
      prompt("សូមចម្លង Link នេះដើម្បីផ្ញើជូនសិស្ស៖", url);
    }
  },

  savePendingList(list) {
    try {
      localStorage.setItem(this.STORAGE_KEY_PENDING, JSON.stringify(list));
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected && StudentAPI.isCloudConnected()) {
        try {
          firebase.database().ref("pending_enrollments").set(list);
        } catch (e) {}
      }
      return true;
    } catch (e) {
      console.error("Failed to save pending enrollments:", e);
      return false;
    }
  },

  /**
   * Open the Public Self-Enrollment Modal for students/parents
   */
  openPublicEnrollModal() {
    this.ensureModalInDOM();
    this.renderEnrollForm();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("publicEnrollModal");
    } else {
      const el = document.getElementById("publicEnrollModal");
      if (el) el.style.display = "flex";
    }
  },

  closeModal() {
    if (window.location.hash === "#enroll") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("publicEnrollModal");
    } else {
      const el = document.getElementById("publicEnrollModal");
      if (el) el.style.display = "none";
    }
  },

  ensureModalInDOM() {
    let modal = document.getElementById("publicEnrollModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "publicEnrollModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10800";
      document.body.appendChild(modal);
    }
  },

  renderEnrollForm() {
    const modal = document.getElementById("publicEnrollModal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 680px; width: 95%; max-height: 92vh; background: #0f172a; border-radius: 20px; border: 1.5px solid #06b6d4; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); overflow: hidden; display: flex; flex-direction: column; padding: 0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #083344, #0e7490); border-bottom: 2px solid #06b6d4; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="assets/images/logo.png" alt="Logo" style="width: 48px; height: 48px; border-radius: 12px; background: #fff; padding: 2px;">
            <div>
              <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #fff;">
                ចុះឈ្មោះចូលរៀនវគ្គកុំព្យូទ័រ (Online Admission)
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.8rem; color: #cffafe;">
                សាលា អន្តរជាតិ ធានស៊ីន (Tian Xin International School - TIS Lab)
              </p>
            </div>
          </div>
          <button type="button" onclick="PublicEnrollment.closeModal()" style="background: rgba(255, 255, 255, 0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form id="publicEnrollForm" onsubmit="PublicEnrollment.submitForm(event)" style="flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px;">
          <!-- Names Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                👤 ឈ្មោះជាភាសាខ្មែរ (Name in Khmer) <span style="color: #f43f5e;">*</span>:
              </label>
              <input type="text" id="peNameKh" required placeholder="ឧ. សុខ វិសាល" style="width: 100%; height: 42px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.88rem;">
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                🔤 ឈ្មោះជាអក្សរឡាតាំង (Name in Latin) <span style="color: #f43f5e;">*</span>:
              </label>
              <input type="text" id="peNameEn" required placeholder="ឧ. SOK VISAL" style="width: 100%; height: 42px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.88rem; text-transform: uppercase;">
            </div>
          </div>

          <!-- Gender & Phone -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                ⚧ ភេទ (Gender) <span style="color: #f43f5e;">*</span>:
              </label>
              <select id="peGender" required style="width: 100%; height: 42px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.88rem;">
                <option value="ប្រុស">ប្រុស (Male)</option>
                <option value="ស្រី">ស្រី (Female)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                📞 លេខទូរស័ព្ទ / Telegram <span style="color: #f43f5e;">*</span>:
              </label>
              <input type="tel" id="pePhone" required placeholder="ឧ. 012 345 678" style="width: 100%; height: 42px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.88rem;">
            </div>
          </div>

          <!-- Shift & Course -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                ⏰ វេនសិក្សាដែលចង់រៀន (Study Shift) <span style="color: #f43f5e;">*</span>:
              </label>
              <select id="peShift" required style="width: 100%; height: 42px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.88rem;">
                <option value="ព្រឹក">វេនព្រឹក (07:30 - 09:30 ព្រឹក)</option>
                <option value="ថ្ងៃ">វេនថ្ងៃ (11:30 - 13:00 ថ្ងៃត្រង់)</option>
                <option value="រសៀល">វេនរសៀល (13:30 - 15:30 រសៀល)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                💻 វគ្គសិក្សា (Course):
              </label>
              <select id="peCourse" style="width: 100%; height: 42px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; border-radius: 8px; color: #fff; font-size: 0.88rem;">
                <option value="កុំព្យូទ័ររដ្ឋបាល & IT (៤ វគ្គ)">កុំព្យូទ័ររដ្ឋបាល & IT (Windows, Typing, Word, Excel, PPT)</option>
                <option value="Microsoft Word 2019">Microsoft Word 2019 (រដ្ឋបាល)</option>
                <option value="Microsoft Excel 2019">Microsoft Excel 2019 (រូបមន្ត & តារាង)</option>
                <option value="Microsoft PowerPoint 2019">Microsoft PowerPoint 2019 (បទបង្ហាញ)</option>
                <option value="Typing & IT">ជំនាញវាយអត្ថបទ Typing & IT</option>
              </select>
            </div>
          </div>

          <!-- Photo Upload -->
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
              📷 ផ្ទុកឡើងរូបថតផ្ទាល់ខ្លួន (Student Photo - Optional):
            </label>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div id="pePhotoPreviewBox" style="width: 60px; height: 60px; border-radius: 12px; background: rgba(30, 41, 59, 0.8); border: 1px dashed #64748b; display: flex; align-items: center; justify-content: center; overflow: hidden; color: #94a3b8; font-size: 1.4rem;">
                <i class="fa-solid fa-user"></i>
              </div>
              <input type="file" id="pePhotoInput" accept="image/*" onchange="PublicEnrollment.handlePhotoUpload(event)" style="font-size: 0.8rem; color: #cbd5e1;">
            </div>
          </div>

          <!-- Notice Note -->
          <div style="background: rgba(8, 51, 68, 0.5); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 10px; padding: 12px 14px; font-size: 0.78rem; color: #cffafe; line-height: 1.5;">
            <i class="fa-solid fa-circle-check text-cyan-400"></i>
            បន្ទាប់ពីចុះឈ្មោះរួច ប្រព័ន្ធនឹងផ្ញើដំណឹងជូនលោកគ្រូអ្នកគ្រូដោយស្វ័យប្រវត្តិ។ សាលានឹងទាក់ទងមកលោកអ្នកដើម្បីបញ្ជាក់ការចូលរៀន។
          </div>

          <!-- Submit Buttons -->
          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px;">
            <button type="button" onclick="PublicEnrollment.closeModal()" class="btn-secondary" style="height: 42px; padding: 0 18px; font-size: 0.85rem;">
              បោះបង់
            </button>
            <button type="submit" id="peSubmitBtn" class="btn-primary" style="height: 42px; padding: 0 24px; font-size: 0.9rem; font-weight: 800; background: linear-gradient(135deg, #06b6d4, #0284c7); border: none; border-radius: 10px; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4); display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-paper-plane"></i> <span>ចុះឈ្មោះឥឡូវនេះ (Submit Admission)</span>
            </button>
          </div>
        </form>
      </div>
    `;
  },

  handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      this._uploadedPhotoData = evt.target.result;
      const box = document.getElementById("pePhotoPreviewBox");
      if (box) {
        box.innerHTML = `<img src="${evt.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
      }
    };
    reader.readAsDataURL(file);
  },

  async submitForm(e) {
    e.preventDefault();

    const nameKh = document.getElementById("peNameKh")?.value.trim();
    const nameEn = document.getElementById("peNameEn")?.value.trim().toUpperCase();
    const gender = document.getElementById("peGender")?.value;
    const phone = document.getElementById("pePhone")?.value.trim();
    const shift = document.getElementById("peShift")?.value;
    const course = document.getElementById("peCourse")?.value;
    const btn = document.getElementById("peSubmitBtn");

    if (!nameKh || !nameEn || !phone) {
      alert("សូមបំពេញព័ត៌មានដែលចាំបាច់ឱ្យបានពេញលេញ!");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>កំពុងបញ្ជូន...</span>`;
    }

    const applicantId = `APP-${Date.now().toString().slice(-5)}`;
    const newApplicant = {
      id: applicantId,
      nameKh,
      nameEn,
      gender,
      phone,
      shift,
      course,
      photo: this._uploadedPhotoData || (gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg"),
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    // Save locally & cloud
    const list = this.getPendingList();
    list.unshift(newApplicant);
    this.savePendingList(list);

    // Instant Telegram Alert to Teachers
    if (typeof TelegramService !== "undefined" && TelegramService.sendMessage) {
      try {
        const text = `
🔔 <b>[សិស្សថ្មីចុះឈ្មោះ ONLINE តាមប្រព័ន្ធ]</b>
━━━━━━━━━━━━━━━━━━
👤 <b>ឈ្មោះ៖</b> ${nameKh} (${nameEn})
⚧ <b>ភេទ៖</b> ${gender}
⏰ <b>វេនសិក្សា៖</b> វេន${shift}
💻 <b>វគ្គ៖</b> ${course}
📞 <b>លេខទូរស័ព្ទ៖</b> ${phone}
🎫 <b>លេខកូដសំបុត្រ៖</b> <code>${applicantId}</code>
━━━━━━━━━━━━━━━━━━
<i>សូមលោកគ្រូចូលទៅកាន់ប្រព័ន្ធដើម្បីពិនិត្យ និងចុច «Approve»</i>
        `.trim();
        await TelegramService.sendMessage(text);
      } catch (err) {
        console.warn("Telegram alert issue:", err);
      }
    }

    // Render Confirmation Card
    this.renderSuccessCard(newApplicant);
  },

  renderSuccessCard(app) {
    const modal = document.getElementById("publicEnrollModal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 550px; width: 95%; background: #0f172a; border-radius: 20px; border: 1.5px solid #10b981; padding: 32px 24px; text-align: center; color: #fff;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
        <h3 style="margin: 0 0 8px; font-size: 1.35rem; font-weight: 800; color: #34d399;">
          ចុះឈ្មោះចូលរៀនបានជោគជ័យ!
        </h3>
        <p style="margin: 0 0 20px; font-size: 0.88rem; color: #cbd5e1;">
          ព័ត៌មានរបស់អ្នកត្រូវបានបញ្ជូនទៅកាន់សាលា អន្តរជាតិ ធានស៊ីន រួចរាល់ហើយ។
        </p>

        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left; font-size: 0.84rem; line-height: 1.7;">
          <div>🎫 <strong>លេខកូដសំបុត្រ៖</strong> <span style="color: #38bdf8; font-weight: 800;">${app.id}</span></div>
          <div>👤 <strong>ឈ្មោះសិស្ស៖</strong> ${app.nameKh} (${app.nameEn})</div>
          <div>⏰ <strong>វេនសិក្សា៖</strong> វេន${app.shift}</div>
          <div>📞 <strong>លេខទូរស័ព្ទ៖</strong> ${app.phone}</div>
        </div>

        <button type="button" onclick="PublicEnrollment.closeModal()" class="btn-primary" style="height: 44px; padding: 0 28px; font-size: 0.9rem; background: #10b981; border: none; border-radius: 10px; font-weight: 800; cursor: pointer;">
          យល់ព្រម (Close)
        </button>
      </div>
    `;
  },

  /**
   * Teacher/Admin Review Modal to view and 1-Click Approve applicants
   */
  openPendingReviewModal() {
    let modal = document.getElementById("pendingReviewModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "pendingReviewModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10850";
      document.body.appendChild(modal);
    }

    this.renderPendingReview();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("pendingReviewModal");
    } else {
      modal.style.display = "flex";
    }
  },

  closePendingReviewModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("pendingReviewModal");
    } else {
      const el = document.getElementById("pendingReviewModal");
      if (el) el.style.display = "none";
    }
  },

  renderPendingReview() {
    const modal = document.getElementById("pendingReviewModal");
    if (!modal) return;

    const list = this.getPendingList();

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 880px; width: 95%; max-height: 90vh; background: #0f172a; border-radius: 18px; border: 1.5px solid #06b6d4; overflow: hidden; display: flex; flex-direction: column; padding: 0;">
        <div style="background: linear-gradient(135deg, #083344, #0e7490); padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(6, 182, 212, 0.2); border: 1px solid #06b6d4; display: flex; align-items: center; justify-content: center; color: #22d3ee; font-size: 1.25rem;">
              <i class="fa-solid fa-user-clock"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">
                ពិនិត្យសិស្សចុះឈ្មោះតាម Online (Pending Admissions)
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.78rem; color: #cffafe;">
                សរុប ${list.length} នាក់រង់ចាំការយល់ព្រម
              </p>
            </div>
          </div>
          <button type="button" onclick="PublicEnrollment.closePendingReviewModal()" style="background: rgba(255, 255, 255, 0.15); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 20px 24px;">
          ${list.length === 0 ? `
            <div style="text-align: center; padding: 50px 20px; color: #94a3b8;">
              <i class="fa-solid fa-inbox" style="font-size: 2.5rem; margin-bottom: 12px; color: #64748b;"></i>
              <div style="font-weight: 700; color: #cbd5e1;">មិនមានសិស្សរង់ចាំការអនុម័តឡើយ</div>
              <div style="font-size: 0.8rem; margin-top: 4px;">នៅពេលសិស្សចុះឈ្មោះតាម Link #enroll វានឹងបង្ហាញនៅទីនេះ</div>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${list.map(app => `
                <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <img src="${app.photo}" alt="${app.nameKh}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover; background: #fff; border: 1px solid #475569;">
                    <div>
                      <h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: #fff;">
                        ${app.nameKh} <span style="font-size: 0.82rem; color: #94a3b8;">(${app.nameEn})</span>
                      </h4>
                      <div style="font-size: 0.78rem; color: #cbd5e1; margin-top: 3px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <span><i class="fa-solid fa-clock text-cyan-400"></i> វេន${app.shift}</span>
                        <span><i class="fa-solid fa-phone text-emerald-400"></i> ${app.phone}</span>
                        <span><i class="fa-solid fa-laptop text-purple-400"></i> ${app.course}</span>
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; gap: 8px;">
                    <button type="button" onclick="PublicEnrollment.approveApplicant('${app.id}')" class="btn-primary" style="height: 36px; padding: 0 16px; font-size: 0.82rem; background: #10b981; border: none; border-radius: 8px; font-weight: 700;">
                      <i class="fa-solid fa-check"></i> <span>យល់ព្រម (Approve)</span>
                    </button>
                    <button type="button" onclick="PublicEnrollment.rejectApplicant('${app.id}')" class="btn-action" style="height: 36px; padding: 0 12px; background: rgba(239, 68, 68, 0.15); color: #f87171; border-radius: 8px;" title="បដិសេធ">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    `;
  },

  async approveApplicant(id) {
    const list = this.getPendingList();
    const app = list.find(a => a.id === id);
    if (!app) return;

    if (confirm(`តើលោកគ្រូប្រាកដជាចង់យល់ព្រមទទួលសិស្ស [${app.nameKh}] ចូលរៀនផ្លូវការមែនទេ?`)) {
      if (typeof StudentAPI !== "undefined" && StudentAPI.addStudent) {
        // Auto assign ID
        const students = StudentAPI.getLocalStudents ? StudentAPI.getLocalStudents() : [];
        const nextNum = (students.length + 1).toString().padStart(4, "0");
        const officialId = `TIS-2026-${nextNum}`;

        const newStudent = {
          ID: officialId,
          NameKh: app.nameKh,
          NameEn: app.nameEn,
          Gender: app.gender,
          Phone: app.phone,
          Shift: app.shift,
          Grade: app.course,
          Course: app.course,
          Avatar: app.photo,
          Status: "Active",
          EnrolledDate: new Date().toISOString().split("T")[0]
        };

        await StudentAPI.addStudent(newStudent);
      }

      // Remove from pending
      const remaining = list.filter(a => a.id !== id);
      this.savePendingList(remaining);

      if (typeof App !== "undefined") {
        App.showToast(`🎉 បានយល់ព្រមសិស្ស [${app.nameKh}] ចូលក្នុងបញ្ជីសិស្សផ្លូវការរួចរាល់!`, "success");
      }

      this.renderPendingReview();
    }
  },

  rejectApplicant(id) {
    if (confirm("តើលោកគ្រូចង់លុបពាក្យស្នើសុំនេះមែនទេ?")) {
      const list = this.getPendingList().filter(a => a.id !== id);
      this.savePendingList(list);
      this.renderPendingReview();
    }
  }
};

// Initialize Hash listener
PublicEnrollment.init();

/**
 * View: Student Registration Form (4-Step Multi-Step Enrollment Wizard)
 */
const RegisterView = {
  currentStep: 1,

  render() {
    return `
      <section id="view-register" class="page-view">
        <div class="card" style="max-width: 920px; margin: 0 auto; padding: 28px;">
          <!-- Wizard Header -->
          <div class="card-header-clean" style="margin-bottom: 20px;">
            <div class="card-title">
              <i class="fa-solid fa-user-plus text-indigo-500"></i>
              <span>ទម្រង់បែបបទចុះឈ្មោះសិស្សថ្មី (Multi-Step Student Enrollment)</span>
            </div>
            <span class="text-sm text-muted">បំពេញព័ត៌មានតាម ៤ ដំណាក់កាល</span>
          </div>

          <!-- 4-Step Progress Stepper -->
          <div class="form-stepper" id="regFormStepper">
            <!-- Step 1 Item -->
            <div class="step-item active" id="stepIndicator1" onclick="RegisterView.goToStep(1)">
              <div class="step-indicator">1</div>
              <div class="step-text">
                <span class="step-title">ព័ត៌មានផ្ទាល់ខ្លួន</span>
                <span class="step-sub">Personal Info</span>
              </div>
            </div>
            <div class="step-connector" id="stepConnector1"></div>

            <!-- Step 2 Item -->
            <div class="step-item" id="stepIndicator2" onclick="RegisterView.goToStep(2)">
              <div class="step-indicator">2</div>
              <div class="step-text">
                <span class="step-title">ទំនាក់ទំនង</span>
                <span class="step-sub">Contact Info</span>
              </div>
            </div>
            <div class="step-connector" id="stepConnector2"></div>

            <!-- Step 3 Item -->
            <div class="step-item" id="stepIndicator3" onclick="RegisterView.goToStep(3)">
              <div class="step-indicator">3</div>
              <div class="step-text">
                <span class="step-title">អាណាព្យាបាល</span>
                <span class="step-sub">Parents / Guardian</span>
              </div>
            </div>
            <div class="step-connector" id="stepConnector3"></div>

            <!-- Step 4 Item -->
            <div class="step-item" id="stepIndicator4" onclick="RegisterView.goToStep(4)">
              <div class="step-indicator">4</div>
              <div class="step-text">
                <span class="step-title">វគ្គសិក្សាកុំព្យូទ័រ</span>
                <span class="step-sub">Course & Shift</span>
              </div>
            </div>
          </div>

          <form id="studentForm" method="dialog" onsubmit="event.preventDefault(); return false;">
            <!-- ================= STEP 1: PERSONAL INFORMATION ================= -->
            <div class="form-step-pane active" id="stepPane1">
              <!-- Avatar Profile Upload -->
              <div class="avatar-upload-box" style="margin-bottom: 22px;">
                <img id="avatarPreview" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop&crop=faces" alt="រូបថតសិស្ស" class="avatar-preview-img" style="border: 2px solid #4f46e5;">
                <div class="avatar-upload-actions">
                  <label class="form-label font-bold">រូបថតសិស្ស (Student Photo)</label>
                  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <label class="btn-secondary" style="cursor: pointer; padding: 7px 14px; font-size: 0.82rem;">
                      <i class="fa-solid fa-upload text-indigo-400"></i> ជ្រើសរើសរូបភាពពីម៉ាស៊ីន
                      <input type="file" id="avatarFile" accept="image/*" style="display: none;">
                    </label>
                    <input type="url" id="avatarInput" name="avatar" class="form-control" style="flex: 1; min-width: 220px;" placeholder="ឬបិទភ្ជាប់ Image URL (https://...)">
                  </div>
                  <span class="text-xs text-muted">ប្រព័ន្ធនឹងបង្រួមរូបភាពស្វ័យប្រវត្តដើម្បីរក្សាទុកក្នុង Firebase យ៉ាងលឿន</span>
                </div>
              </div>

              <div class="form-grid">
                <!-- Khmer Name -->
                <div class="form-group">
                  <label class="form-label"><span>ឈ្មោះជាភាសាខ្មែរ (Khmer Name)</span> <span class="required">*</span></label>
                  <input type="text" name="nameKh" id="regNameKh" class="form-control" placeholder="ឧទាហរណ៍៖ ចាន់ សុខា" required>
                </div>

                <!-- Latin Name -->
                <div class="form-group">
                  <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
                    <span>ឈ្មោះជាអក្សរឡាតាំង (Latin Name)</span>
                    <button type="button" class="btn-text-action" onclick="App.autoGenerateRegisterLatinName()" title="បំប្លែងឈ្មោះឡាតាំង Auto ភ្លាមៗ" style="font-size: 0.75rem; color: var(--primary-color, #4f46e5); background: none; border: none; cursor: pointer; padding: 0 4px; display: inline-flex; align-items: center; gap: 4px; font-weight: 700;">
                      <i class="fa-solid fa-wand-magic-sparkles"></i> Auto Latin
                    </button>
                  </label>
                  <input type="text" name="nameEn" id="regNameEn" class="form-control" placeholder="ឧទាហរណ៍៖ CHAN SOKHA">
                </div>

                <!-- Gender -->
                <div class="form-group">
                  <label class="form-label"><span>ភេទ (Gender)</span> <span class="required">*</span></label>
                  <select name="gender" id="genderSelect" class="form-control" required>
                    <option value="ប្រុស">ប្រុស (Male)</option>
                    <option value="ស្រី">ស្រី (Female)</option>
                  </select>
                </div>

                <!-- Date of Birth -->
                <div class="form-group">
                  <label class="form-label"><span>ថ្ងៃខែឆ្នាំកំណើត (Date of Birth)</span></label>
                  <input type="date" name="dob" class="form-control" value="2008-01-15">
                </div>

                <!-- Place of Birth -->
                <div class="form-group">
                  <label class="form-label"><span>ទីកន្លែងកំណើត (Place of Birth)</span></label>
                  <input type="text" name="pob" class="form-control" placeholder="ស្រុក/ខណ្ឌ ខេត្ត/រាជធានី">
                </div>

                <!-- Nationality -->
                <div class="form-group">
                  <label class="form-label"><span>សញ្ជាតិ (Nationality)</span></label>
                  <input type="text" name="nationality" class="form-control" value="ខ្មែរ">
                </div>
              </div>

              <!-- Step 1 Navigation -->
              <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 10px;">
                <button type="button" class="btn-primary" onclick="RegisterView.goToStep(2)" style="padding: 9px 22px; font-weight: 800;">
                  <span>បន្ទាប់ (Next)</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- ================= STEP 2: CONTACT INFORMATION ================= -->
            <div class="form-step-pane" id="stepPane2">
              <div class="form-grid">
                <!-- Phone -->
                <div class="form-group">
                  <label class="form-label"><span>លេខទូរស័ព្ទផ្ទាល់ (Phone Number)</span></label>
                  <input type="tel" name="phone" class="form-control" placeholder="012 345 678">
                </div>

                <!-- Email -->
                <div class="form-group">
                  <label class="form-label"><span>អ៊ីមែល (Email)</span></label>
                  <input type="email" name="email" class="form-control" placeholder="student@gmail.com">
                </div>

                <!-- Telegram Account -->
                <div class="form-group">
                  <label class="form-label"><span>គណនី Telegram (@Username ឬលេខ)</span></label>
                  <input type="text" name="telegram" class="form-control" placeholder="@username">
                </div>

                <!-- Address Province -->
                <div class="form-group">
                  <label class="form-label"><span>រាជធានី/ខេត្ត (Province/City)</span></label>
                  <select name="address" class="form-control">
                    ${APP_CONFIG.provinces.map(p => `<option value="${p}">${p}</option>`).join('')}
                  </select>
                </div>

                <!-- District / Khan -->
                <div class="form-group">
                  <label class="form-label"><span>ស្រុក/ខណ្ឌ (District)</span></label>
                  <input type="text" name="district" class="form-control" placeholder="ឧ. ចំការមន">
                </div>

                <!-- Village / Street -->
                <div class="form-group">
                  <label class="form-label"><span>ភូមិ/ឃុំ/ផ្លូវ (Street / Village)</span></label>
                  <input type="text" name="village" class="form-control" placeholder="ផ្ទះលេខ... ផ្លូវ...">
                </div>
              </div>

              <!-- Step 2 Navigation -->
              <div style="margin-top: 25px; display: flex; justify-content: space-between; gap: 10px;">
                <button type="button" class="btn-secondary" onclick="RegisterView.goToStep(1)">
                  <i class="fa-solid fa-arrow-left"></i> <span>ថយក្រោយ (Previous)</span>
                </button>
                <button type="button" class="btn-primary" onclick="RegisterView.goToStep(3)" style="padding: 9px 22px; font-weight: 800;">
                  <span>បន្ទាប់ (Next)</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- ================= STEP 3: PARENT / GUARDIAN ================= -->
            <div class="form-step-pane" id="stepPane3">
              <div class="form-grid">
                <!-- Father Name -->
                <div class="form-group">
                  <label class="form-label"><span>ឈ្មោះឪពុក (Father's Name)</span></label>
                  <input type="text" name="fatherName" class="form-control" placeholder="ឈ្មោះឪពុក">
                </div>

                <!-- Mother Name -->
                <div class="form-group">
                  <label class="form-label"><span>ឈ្មោះម្តាយ (Mother's Name)</span></label>
                  <input type="text" name="motherName" class="form-control" placeholder="ឈ្មោះម្តាយ">
                </div>

                <!-- Guardian Name -->
                <div class="form-group">
                  <label class="form-label"><span>ឈ្មោះអាណាព្យាបាល (Guardian Name)</span></label>
                  <input type="text" name="guardianName" class="form-control" placeholder="បើខុសពីឪពុកម្តាយ">
                </div>

                <!-- Parent Phone -->
                <div class="form-group">
                  <label class="form-label"><span>លេខទូរស័ព្ទអាណាព្យាបាល (Parent Phone)</span></label>
                  <input type="tel" name="parentPhone" class="form-control" placeholder="098 765 432">
                </div>

                <!-- Parent Occupation -->
                <div class="form-group">
                  <label class="form-label"><span>មុខរបរឪពុកម្តាយ (Parent Occupation)</span></label>
                  <input type="text" name="parentJob" class="form-control" placeholder="ឧ. មន្ត្រីរាជការ, អាជីវករ, បុគ្គលិក">
                </div>
              </div>

              <!-- Step 3 Navigation -->
              <div style="margin-top: 25px; display: flex; justify-content: space-between; gap: 10px;">
                <button type="button" class="btn-secondary" onclick="RegisterView.goToStep(2)">
                  <i class="fa-solid fa-arrow-left"></i> <span>ថយក្រោយ (Previous)</span>
                </button>
                <button type="button" class="btn-primary" onclick="RegisterView.goToStep(4)" style="padding: 9px 22px; font-weight: 800;">
                  <span>បន្ទាប់ (Next)</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- ================= STEP 4: COURSE & ENROLLMENT ================= -->
            <div class="form-step-pane" id="stepPane4">
              <div class="form-grid">
                <!-- Course / Module (Computer Training) -->
                <div class="form-group">
                  <label class="form-label"><span><i class="fa-solid fa-laptop-code text-indigo-500"></i> វគ្គសិក្សាកុំព្យូទ័រ (Computer Course)</span> <span class="required">*</span></label>
                  <select name="course" class="form-control" id="regCourseSelect" required>
                    <option value="">-- សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ --</option>
                    ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name} (${c.desc})</option>`).join('')}
                  </select>
                  <input type="hidden" name="grade" value="ថ្នាក់កុំព្យូទ័រ">
                </div>

                <!-- Shift -->
                <div class="form-group">
                  <label class="form-label"><span>វេនសិក្សា (Study Shift)</span> <span class="required">*</span></label>
                  <select name="shift" class="form-control">
                    ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
                  </select>
                </div>

                <!-- Study Start Date -->
                <div class="form-group">
                  <label class="form-label"><span>ថ្ងៃចូលរៀន (Start Date)</span></label>
                  <input type="date" name="startDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>

                <!-- Enrollment Status -->
                <div class="form-group">
                  <label class="form-label"><span>ស្ថានភាពសិស្ស (Status)</span></label>
                  <select name="status" class="form-control">
                    <option value="Active">កំពុងសិក្សា (Active)</option>
                    <option value="Inactive">ផ្អាកការសិក្សា (Suspended/Leave)</option>
                    <option value="Graduated">បញ្ចប់ការសិក្សា (Graduated)</option>
                  </select>
                </div>

                <!-- Student Login PIN -->
                <div class="form-group">
                  <label class="form-label"><span><i class="fa-solid fa-key" style="color: #6366f1;"></i> លេខកូដសម្ងាត់សិស្ស (Student Login Auto PIN)</span></label>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="text" id="registerPagePinInput" name="pin" class="form-control" placeholder="123+5ខ្ទង់" value="${typeof App !== 'undefined' ? App.generateAutoPin() : '123' + Math.floor(10000 + Math.random() * 90000)}" style="font-family: var(--font-mono, monospace); font-weight: 700; letter-spacing: 1px;">
                    <button type="button" class="btn-secondary" onclick="document.getElementById('registerPagePinInput').value = (typeof App !== 'undefined' ? App.generateAutoPin() : '123' + Math.floor(10000 + Math.random() * 90000)); if(typeof App !== 'undefined') App.showToast('🔑 បានបង្កើត Auto PIN ថ្មី!', 'info');" title="បង្កើត PIN ថ្មី" style="height: 42px; padding: 0 12px; white-space: nowrap; font-weight: 700;">
                      <i class="fa-solid fa-dice"></i> Auto
                    </button>
                  </div>
                </div>
              </div>

              <!-- Summary Confirmation Banner -->
              <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 14px 18px; border-radius: 12px; margin-top: 18px; display: flex; align-items: center; gap: 12px;">
                <i class="fa-solid fa-shield-check text-emerald-400" style="font-size: 1.5rem;"></i>
                <div style="font-size: 0.84rem; color: #cbd5e1;">
                  ទិន្នន័យសិស្សនឹងត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តក្នុង <strong>Firebase Cloud Database</strong> ហើយសិស្សអាចប្រើប្រាស់លេខកូដ PIN នេះដើម្បី Sign-In លើកុំព្យូទ័រ Lab ឬត្រួតពិនិត្យពិន្ទុតាម Student Portal។
                </div>
              </div>

              <!-- Step 4 Navigation & Save -->
              <div style="margin-top: 25px; display: flex; justify-content: space-between; gap: 10px;">
                <button type="button" class="btn-secondary" onclick="RegisterView.goToStep(3)">
                  <i class="fa-solid fa-arrow-left"></i> <span>ថយក្រោយ (Previous)</span>
                </button>
                <div style="display: flex; gap: 10px;">
                  <button type="button" id="resetFormBtn" class="btn-secondary">
                    <i class="fa-solid fa-arrow-rotate-left"></i> <span>សម្អាត (Clear)</span>
                  </button>
                  <button type="submit" class="btn-primary" style="padding: 10px 24px; font-size: 0.92rem; font-weight: 800; background: linear-gradient(135deg, #10b981, #059669); border-color: #10b981; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);">
                    <i class="fa-solid fa-check"></i> <span>រក្សាទុកទិន្នន័យសិស្ស (Save Student)</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  goToStep(stepNum) {
    if (stepNum < 1 || stepNum > 4) return;
    this.currentStep = stepNum;

    // Validate Step 1 if moving forward
    if (stepNum > 1) {
      const nameInput = document.getElementById("regNameKh");
      if (nameInput && !nameInput.value.trim()) {
        App.showToast("សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរជាមុនសិន!", "warning");
        this.currentStep = 1;
        stepNum = 1;
      }
    }

    // Toggle panes
    for (let i = 1; i <= 4; i++) {
      const pane = document.getElementById(`stepPane${i}`);
      const indicator = document.getElementById(`stepIndicator${i}`);
      const connector = document.getElementById(`stepConnector${i}`);

      if (pane) {
        if (i === stepNum) {
          pane.classList.add("active");
        } else {
          pane.classList.remove("active");
        }
      }

      if (indicator) {
        if (i === stepNum) {
          indicator.className = "step-item active";
        } else if (i < stepNum) {
          indicator.className = "step-item completed";
        } else {
          indicator.className = "step-item";
        }
      }

      if (connector) {
        if (i < stepNum) {
          connector.classList.add("completed");
        } else {
          connector.classList.remove("completed");
        }
      }
    }
  },

  initEvents() {
    const form = document.getElementById("studentForm");
    const avatarInput = document.getElementById("avatarInput");
    const avatarFile = document.getElementById("avatarFile");
    const avatarPreview = document.getElementById("avatarPreview");

    // Avatar URL input change
    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener("input", (e) => {
        const url = e.target.value.trim();
        if (url) {
          avatarPreview.src = url;
        } else {
          avatarPreview.src = App.getDefaultAvatar(document.getElementById("genderSelect")?.value);
        }
      });
    }

    // Avatar File upload change
    if (avatarFile && avatarPreview) {
      avatarFile.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            avatarPreview.style.opacity = "0.5";
            let finalUrl = "";
            let providerName = "";

            if (typeof ImageHostService !== "undefined") {
              const res = await ImageHostService.upload(file, "reg_student");
              if (res.success && res.url) {
                finalUrl = res.url;
                providerName = res.provider;
              }
            }

            if (!finalUrl) {
              finalUrl = await StudentAPI.compressImage(file, 480, 0.82);
            }

            avatarPreview.src = finalUrl;
            if (avatarInput) avatarInput.value = finalUrl;
            const provKh = providerName === "server" ? "Local Server" : (providerName === "imgbb" ? "ImgBB CDN" : (providerName === "freeimage" ? "FreeImage CDN" : (providerName === "telegram" ? "Telegram CDN" : "Optimized")));
            App.showToast(`📸 រូបថតត្រូវបានផ្ទុកឡើងលើ HostImg (${provKh}) រួចរាល់!`, "success");
          } catch (err) {
            App.showToast("មិនអាចដំណើរការរូបភាពបានទេ!", "error");
          } finally {
            avatarPreview.style.opacity = "1";
          }
        }
      });
    }

    // Clear Form
    const resetBtn = document.getElementById("resetFormBtn");
    if (resetBtn && form) {
      resetBtn.addEventListener("click", () => {
        this.reset();
      });
    }

    // Auto Transliteration from Khmer to Latin Name
    const regNameKh = document.getElementById("regNameKh");
    const nameEnInput = document.getElementById("regNameEn") || (form ? form.querySelector('input[name="nameEn"]') : null);
    if (regNameKh && nameEnInput) {
      regNameKh.addEventListener("input", (e) => {
        if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin) {
          const khVal = e.target.value;
          // Auto generate if Latin name is empty or matched previous auto conversion
          if (!nameEnInput.dataset.manualEdited || !nameEnInput.value.trim()) {
            nameEnInput.value = TeacherToolsService.transliterateKhmerToLatin(khVal);
          }
        }
      });
      nameEnInput.addEventListener("input", () => {
        nameEnInput.dataset.manualEdited = "true";
      });
    }

    // Auto Phone Spacing
    const phoneInputs = form ? form.querySelectorAll('input[name="phone"], input[name="guardianPhone"]') : [];
    phoneInputs.forEach(input => {
      input.addEventListener("blur", (e) => {
        if (typeof TeacherToolsService !== "undefined") {
          e.target.value = TeacherToolsService.formatPhoneNumber(e.target.value);
        }
      });
    });

    // Ctrl+V Direct Image Paste from Clipboard anywhere on registration page
    window.addEventListener("paste", async (e) => {
      const activeTab = (typeof App !== "undefined" && App.state) ? App.state.currentTab : "";
      if (activeTab !== "register") return;

      const items = (e.clipboardData || window.clipboardData)?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (avatarPreview) avatarPreview.style.opacity = "0.5";
          try {
            let finalUrl = "";
            let providerName = "";

            if (typeof ImageHostService !== "undefined") {
              const res = await ImageHostService.upload(blob, "paste_student");
              if (res.success && res.url) {
                finalUrl = res.url;
                providerName = res.provider;
              }
            }

            if (!finalUrl) {
              const reader = new FileReader();
              reader.onload = async (event) => {
                finalUrl = (typeof TeacherToolsService !== "undefined") ? 
                  await TeacherToolsService.cropToPassportAspectRatio(event.target.result, 300, 400) : 
                  event.target.result;
                avatarPreview.src = finalUrl;
                if (avatarInput) avatarInput.value = finalUrl;
              };
              reader.readAsDataURL(blob);
              return;
            }

            avatarPreview.src = finalUrl;
            if (avatarInput) avatarInput.value = finalUrl;
            const provKh = providerName === "server" ? "Local Server" : (providerName === "imgbb" ? "ImgBB CDN" : (providerName === "freeimage" ? "FreeImage CDN" : (providerName === "telegram" ? "Telegram CDN" : "Optimized")));
            App.showToast(`📸 បានបិទភ្ជាប់រូបថត និងផ្ទុកលើ HostImg (${provKh}) រួចរាល់!`, "success");
          } catch (err) {
            console.warn("Paste crop error:", err);
          } finally {
            if (avatarPreview) avatarPreview.style.opacity = "1";
          }
          break;
        }
      }
    });

    // Submit Form
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await App.handleRegisterFormSubmit(form);
      });
    }
  },

  reset() {
    const form = document.getElementById("studentForm");
    if (form) {
      form.reset();
      const nameEnInput = form.querySelector('input[name="nameEn"]');
      if (nameEnInput) nameEnInput.dataset.manualEdited = "";
    }
    const avatarPreview = document.getElementById("avatarPreview");
    if (avatarPreview) avatarPreview.src = App.getDefaultAvatar("ប្រុស");
    this.goToStep(1);
  }
};

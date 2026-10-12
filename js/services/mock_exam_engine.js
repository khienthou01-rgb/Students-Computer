/**
 * ==========================================================================
 * Service: MockExamEngine (ប្រព័ន្ធប្រឡងសាកល្បង Mock Exam កំណត់ម៉ោងស្វ័យប្រវត្តិ)
 * TIS Lab Computer - 45-Minute Timed Mock Exam with Auto-Grading & AI Feedback
 * Aligned with the 120-page textbook: «សៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័រ»
 * ==========================================================================
 */

const MockExamEngine = {
  STORAGE_KEY_HISTORY: "master_school_mock_exam_history",

  currentExam: null,
  timerInterval: null,

  /**
   * Launch Mock Exam Setup Dialog
   */
  openLauncherModal(defaultCourse = "all") {
    this.ensureModalInDOM();
    this.renderLauncher(defaultCourse);
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("mockExamModal");
    } else {
      const el = document.getElementById("mockExamModal");
      if (el) el.style.display = "flex";
    }
  },

  closeModal() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("mockExamModal");
    } else {
      const el = document.getElementById("mockExamModal");
      if (el) el.style.display = "none";
    }
  },

  ensureModalInDOM() {
    let modal = document.getElementById("mockExamModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "mockExamModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10750";
      document.body.appendChild(modal);
    }
  },

  renderLauncher(defaultCourse = "all") {
    const modal = document.getElementById("mockExamModal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 650px; width: 95%; background: #0f172a; border-radius: 18px; border: 1.5px solid #6366f1; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85); overflow: hidden; padding: 0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e1b4b, #4338ca); border-bottom: 2px solid #6366f1; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 46px; height: 46px; border-radius: 12px; background: rgba(99, 102, 241, 0.25); border: 1.5px solid #818cf8; display: flex; align-items: center; justify-content: center; color: #a5b4fc; font-size: 1.35rem;">
              <i class="fa-solid fa-stopwatch-20"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
                <span>ប្រឡងសាកល្បង Mock Exam ៤៥ នាទី</span>
                <span class="badge" style="background: #10b981; color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">Auto-Grading</span>
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.78rem; color: #cbd5e1;">
                សំណួរដកស្រង់ចេញពីសៀវភៅមូលដ្ឋាន ១២០ ទំព័រ មានកំណត់ម៉ោង និងកាត់ពិន្ទុភ្លាមៗ
              </p>
            </div>
          </div>
          <button type="button" onclick="MockExamEngine.closeModal()" style="background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Setup Form -->
        <div style="padding: 24px; display: flex; flex-direction: column; gap: 18px;">
          <!-- Course Selection -->
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #e2e8f0; margin-bottom: 8px;">
              📚 ជ្រើសរើសមុខវិជ្ជាប្រឡងសាកល្បង (Exam Subject):
            </label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
              <label class="mock-course-radio" style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
                <input type="radio" name="mockCourse" value="all" ${defaultCourse === 'all' ? 'checked' : ''} style="margin: 0;">
                <i class="fa-solid fa-layer-group text-purple-400" style="font-size: 1.2rem;"></i>
                <span style="font-size: 0.82rem; font-weight: 700; color: #fff;">វិញ្ញាសារួម (៤ វគ្គ)</span>
              </label>

              <label class="mock-course-radio" style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
                <input type="radio" name="mockCourse" value="Word" ${defaultCourse === 'Word' ? 'checked' : ''} style="margin: 0;">
                <i class="fa-solid fa-file-word text-blue-400" style="font-size: 1.2rem;"></i>
                <span style="font-size: 0.82rem; font-weight: 700; color: #fff;">MS Word 2019</span>
              </label>

              <label class="mock-course-radio" style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
                <input type="radio" name="mockCourse" value="Excel" ${defaultCourse === 'Excel' ? 'checked' : ''} style="margin: 0;">
                <i class="fa-solid fa-file-excel text-emerald-400" style="font-size: 1.2rem;"></i>
                <span style="font-size: 0.82rem; font-weight: 700; color: #fff;">MS Excel 2019</span>
              </label>

              <label class="mock-course-radio" style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
                <input type="radio" name="mockCourse" value="PowerPoint" ${defaultCourse === 'PowerPoint' ? 'checked' : ''} style="margin: 0;">
                <i class="fa-solid fa-file-powerpoint text-orange-400" style="font-size: 1.2rem;"></i>
                <span style="font-size: 0.82rem; font-weight: 700; color: #fff;">PowerPoint</span>
              </label>

              <label class="mock-course-radio" style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; border-radius: 10px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;">
                <input type="radio" name="mockCourse" value="Typing" ${defaultCourse === 'Typing' ? 'checked' : ''} style="margin: 0;">
                <i class="fa-solid fa-keyboard text-purple-400" style="font-size: 1.2rem;"></i>
                <span style="font-size: 0.82rem; font-weight: 700; color: #fff;">Typing & IT</span>
              </label>
            </div>
          </div>

          <!-- Settings Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                🔢 ចំនួនសំណួរប្រឡង (Questions):
              </label>
              <select id="mockQuestionCountSelect" style="width: 100%; height: 42px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #64748b; border-radius: 8px; color: #fff; font-size: 0.85rem;">
                <option value="10" selected>១០ សំណួរ (ស្តង់ដារ ១០០ ពិន្ទុ)</option>
                <option value="15">១៥ សំណួរ (មធ្យម)</option>
                <option value="20">២០ សំណួរ (ពេញលេញ)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
                ⏱️ រយៈពេលកំណត់ (Duration):
              </label>
              <select id="mockDurationSelect" style="width: 100%; height: 42px; padding: 0 12px; background: rgba(30, 41, 59, 0.9); border: 1px solid #64748b; border-radius: 8px; color: #fff; font-size: 0.85rem;">
                <option value="45" selected>៤៥ នាទី (ស្តង់ដារផ្លូវការ)</option>
                <option value="30">៣០ នាទី (លឿនរហ័ស)</option>
                <option value="60">៦០ នាទី (ពង្រីក)</option>
              </select>
            </div>
          </div>

          <!-- Rules Card -->
          <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px 16px;">
            <div style="font-size: 0.82rem; font-weight: 700; color: #fbbf24; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-circle-info"></i> បទបញ្ជា និងការកំណត់ពិន្ទុ៖
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.78rem; color: #cbd5e1; line-height: 1.6;">
              <li>សំណួរត្រូវបានដកស្រង់ចេញពីសៀវភៅមូលដ្ឋាន ១២០ ទំព័រដោយចៃដន្យ (Random Draw)</li>
              <li>នាឡិការាប់ថយក្រោយចាប់ផ្តើមភ្លាមៗ ពេលចុច «ចាប់ផ្តើមប្រឡង»</li>
              <li>សិស្សអាចពិនិត្យកែចម្លើយឡើងវិញមុនពេលចុច Submit</li>
              <li>ពិន្ទុជាប់ (Pass) ចាប់ពី <strong>៥០/១០០ ពិន្ទុឡើងទៅ</strong>។</li>
            </ul>
          </div>

          <!-- Start Action Button -->
          <button type="button" onclick="MockExamEngine.startExamFromLauncher()" class="btn-primary" style="height: 46px; font-size: 0.95rem; font-weight: 800; background: linear-gradient(135deg, #10b981, #059669); border: none; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;">
            <i class="fa-solid fa-play"></i>
            <span>🚀 ចាប់ផ្តើមប្រឡងសាកល្បងឥឡូវនេះ (Start Mock Exam)</span>
          </button>
        </div>
      </div>
    `;
  },

  startExamFromLauncher() {
    const courseRadio = document.querySelector('input[name="mockCourse"]:checked');
    const countSelect = document.getElementById("mockQuestionCountSelect");
    const durSelect = document.getElementById("mockDurationSelect");

    const course = courseRadio ? courseRadio.value : "all";
    const count = countSelect ? parseInt(countSelect.value, 10) : 10;
    const durationMinutes = durSelect ? parseInt(durSelect.value, 10) : 45;

    this.startExam({ course, count, durationMinutes });
  },

  /**
   * Start the Live Timed Mock Exam
   */
  startExam({ course = "all", count = 10, durationMinutes = 45 }) {
    let pool = [];

    // Draw from QuestionBankService first
    if (typeof QuestionBankService !== "undefined") {
      pool = QuestionBankService.getAllQuestions();
    }

    // Fallback or merge with BookStudyEngine pre-exam questions
    if (pool.length < count && typeof BookStudyEngine !== "undefined") {
      const bookQ = BookStudyEngine.getAllPreExamQuestions().map(q => ({
        id: q.id,
        courseId: q.course || "Word",
        scenario: q.chapterTitle,
        question: q.question,
        options: q.options || [q.answer, "ជម្រើសខុស A", "ជម្រើសខុស B", "ជម្រើសខុស C"],
        correct: q.correct !== undefined ? q.correct : 0,
        points: 10,
        difficulty: "មធ្យម",
        explanation: q.answer
      }));
      pool = [...pool, ...bookQ];
    }

    // Filter by course if selected
    if (course && course !== "all") {
      const filtered = pool.filter(q => q.courseId === course);
      if (filtered.length >= 3) {
        pool = filtered;
      }
    }

    // Shuffle
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

    if (selectedQuestions.length === 0) {
      alert("មិនទាន់មានសំណួរគ្រប់គ្រាន់សម្រាប់ប្រឡងឡើយ!");
      return;
    }

    // Standardize points so sum = 100
    const pointsPerQuestion = Math.round(100 / selectedQuestions.length);
    selectedQuestions.forEach((q, idx) => {
      q._mockIndex = idx + 1;
      q._points = pointsPerQuestion;
    });

    this.currentExam = {
      course,
      totalQuestions: selectedQuestions.length,
      questions: selectedQuestions,
      answers: {}, // questionIndex => selectedOptionIndex
      durationSeconds: durationMinutes * 60,
      remainingSeconds: durationMinutes * 60,
      startTime: Date.now(),
      isSubmitted: false
    };

    // Start timer
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.currentExam || this.currentExam.isSubmitted) {
        clearInterval(this.timerInterval);
        return;
      }
      this.currentExam.remainingSeconds--;
      this.updateTimerDisplay();

      if (this.currentExam.remainingSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.submitExam(true); // auto submit on time out
      }
    }, 1000);

    this.renderActiveExamView();
  },

  updateTimerDisplay() {
    const timerEl = document.getElementById("mockExamCountdownBox");
    if (!timerEl || !this.currentExam) return;

    const remaining = Math.max(0, this.currentExam.remainingSeconds);
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    const str = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

    timerEl.innerHTML = `<i class="fa-solid fa-clock"></i> <span>${str}</span>`;

    if (remaining < 300) {
      timerEl.style.color = "#f87171";
      timerEl.style.borderColor = "#ef4444";
      timerEl.style.background = "rgba(239, 68, 68, 0.2)";
    }
  },

  renderActiveExamView() {
    const modal = document.getElementById("mockExamModal");
    if (!modal || !this.currentExam) return;

    const ex = this.currentExam;
    const answeredCount = Object.keys(ex.answers).length;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 960px; width: 96%; height: 90vh; background: #0f172a; border-radius: 18px; border: 1.5px solid #6366f1; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); overflow: hidden; display: flex; flex-direction: column; padding: 0;">
        <!-- Exam Live Header -->
        <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); border-bottom: 2px solid #6366f1; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
              <span>វិញ្ញាសាប្រឡងសាកល្បង Mock Exam (${ex.course === 'all' ? 'វិញ្ញាសារួម' : ex.course})</span>
              <span class="badge" style="background: #8b5cf6; color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">សរុប ${ex.totalQuestions} សំណួរ</span>
            </h3>
            <p style="margin: 2px 0 0; font-size: 0.76rem; color: #cbd5e1;">
              ឆ្លើយបាន៖ <strong id="mockLiveAnsweredCounter" style="color: #34d399;">${answeredCount}</strong>/${ex.totalQuestions} សំណួរ
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <!-- Live Countdown Clock -->
            <div id="mockExamCountdownBox" style="font-family: 'JetBrains Mono', monospace; font-size: 1.15rem; font-weight: 800; color: #34d399; background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10b981; padding: 6px 14px; border-radius: 8px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-clock"></i> <span>45:00</span>
            </div>

            <!-- Submit Button -->
            <button type="button" onclick="MockExamEngine.confirmSubmitExam()" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.85rem; font-weight: 800; background: linear-gradient(135deg, #ec4899, #f43f5e); border: none; border-radius: 8px; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.4);">
              <i class="fa-solid fa-paper-plane"></i> <span>បញ្ចប់ការប្រឡង (Submit)</span>
            </button>
          </div>
        </div>

        <!-- Question Body Area -->
        <div style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 18px;">
          ${ex.questions.map((q, idx) => {
            const chosen = ex.answers[idx];
            const opts = Array.isArray(q.options) && q.options.length > 0 ? q.options : ["A", "B", "C", "D"];

            return `
              <div id="mockQCard-${idx}" style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px 20px; transition: all 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; font-weight: 800; font-size: 0.78rem;">
                    សំណួរទី ${idx + 1} (${q._points} ពិន្ទុ)
                  </span>
                  <span class="badge" style="background: rgba(255, 255, 255, 0.06); color: #94a3b8; font-size: 0.74rem;">
                    ${q.courseId || ex.course}
                  </span>
                </div>

                <h4 style="margin: 0 0 14px; font-size: 1.02rem; font-weight: 700; color: #fff; line-height: 1.55;">
                  ${q.question}
                </h4>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${opts.map((opt, optIdx) => {
                    const isSelected = chosen === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);
                    return `
                      <label style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; background: ${isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.6)'}; border: 1px solid ${isSelected ? '#818cf8' : '#334155'}; cursor: pointer; transition: all 0.15s;">
                        <input type="radio" name="mockOpt_${idx}" value="${optIdx}" ${isSelected ? 'checked' : ''} onchange="MockExamEngine.onOptionSelected(${idx}, ${optIdx})" style="accent-color: #818cf8;">
                        <span style="width: 24px; height: 24px; border-radius: 6px; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.76rem; color: #fff;">${letter}</span>
                        <span style="font-size: 0.86rem; color: #e2e8f0;">${opt}</span>
                      </label>
                    `;
                  }).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    this.updateTimerDisplay();
  },

  onOptionSelected(qIdx, optIdx) {
    if (!this.currentExam || this.currentExam.isSubmitted) return;
    this.currentExam.answers[qIdx] = optIdx;

    const counter = document.getElementById("mockLiveAnsweredCounter");
    if (counter) {
      counter.textContent = Object.keys(this.currentExam.answers).length;
    }

    const card = document.getElementById(`mockQCard-${qIdx}`);
    if (card) {
      const labels = card.querySelectorAll("label");
      labels.forEach((lbl, idx) => {
        if (idx === optIdx) {
          lbl.style.background = "rgba(99, 102, 241, 0.25)";
          lbl.style.borderColor = "#818cf8";
        } else {
          lbl.style.background = "rgba(15, 23, 42, 0.6)";
          lbl.style.borderColor = "#334155";
        }
      });
    }
  },

  confirmSubmitExam() {
    if (!this.currentExam) return;
    const answered = Object.keys(this.currentExam.answers).length;
    const total = this.currentExam.totalQuestions;

    let msg = `តើអ្នកប្រាកដជាចង់បញ្ចប់ការប្រឡង Mock Exam ឥឡូវនេះមែនទេ?`;
    if (answered < total) {
      msg = `⚠️ អ្នកបានឆ្លើយបានតែ ${answered}/${total} សំណួរប៉ុណ្ណោះ!\nតើអ្នកពិតជាចង់បញ្ចប់ការប្រឡងសាកល្បងឥឡូវនេះមែនទេ?`;
    }

    if (confirm(msg)) {
      this.submitExam(false);
    }
  },

  /**
   * Submit and Grade the Mock Exam
   */
  submitExam(isAutoTimeout = false) {
    if (!this.currentExam) return;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.currentExam.isSubmitted = true;
    const ex = this.currentExam;

    let earnedScore = 0;
    let correctCount = 0;

    ex.questions.forEach((q, idx) => {
      const userChoice = ex.answers[idx];
      const isCorrect = userChoice !== undefined && userChoice === q.correct;
      q._userChoice = userChoice;
      q._isCorrect = isCorrect;

      if (isCorrect) {
        earnedScore += q._points;
        correctCount++;
      }
    });

    // Determine Grade
    let grade = "F";
    let isPass = earnedScore >= 50;
    if (earnedScore >= 90) grade = "A";
    else if (earnedScore >= 80) grade = "B";
    else if (earnedScore >= 70) grade = "C";
    else if (earnedScore >= 60) grade = "D";
    else if (earnedScore >= 50) grade = "E";

    const timeSpentSeconds = ex.durationSeconds - Math.max(0, ex.remainingSeconds);
    const spentMinutes = Math.floor(timeSpentSeconds / 60);
    const spentSeconds = timeSpentSeconds % 60;

    const resultRecord = {
      id: `MOCK-${Date.now().toString().slice(-6)}`,
      course: ex.course,
      score: earnedScore,
      grade: grade,
      isPass: isPass,
      correctCount: correctCount,
      totalCount: ex.totalQuestions,
      timeSpentFormatted: `${spentMinutes} នាទី ${spentSeconds} វិនាទី`,
      date: new Date().toISOString()
    };

    // Save to localStorage history
    try {
      const history = JSON.parse(localStorage.getItem(this.STORAGE_KEY_HISTORY) || "[]");
      history.unshift(resultRecord);
      localStorage.setItem(this.STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 30)));
    } catch (e) {}

    // Confetti celebration if passed with distinction
    if (isPass && typeof confetti === "function") {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    this.renderResultView(resultRecord, ex, isAutoTimeout);
  },

  renderResultView(res, ex, isAutoTimeout) {
    const modal = document.getElementById("mockExamModal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 960px; width: 96%; height: 90vh; background: #0f172a; border-radius: 18px; border: 1.5px solid ${res.isPass ? '#10b981' : '#ef4444'}; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); overflow: hidden; display: flex; flex-direction: column; padding: 0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${res.isPass ? '#064e3b, #047857' : '#7f1d1d, #991b1b'}); padding: 22px 24px; text-align: center; color: #fff;">
          <div style="font-size: 2.2rem; margin-bottom: 6px;">
            ${res.isPass ? '🎉' : '⚠️'}
          </div>
          <h2 style="margin: 0 0 4px; font-size: 1.4rem; font-weight: 800;">
            ${res.isPass ? 'អបអរសាទរ! អ្នកបានប្រឡងសាកល្បងជាប់ (Pass)' : 'មិនទាន់ជាប់ទេ! សូមព្យាយាមម្តងទៀត (Keep Trying)'}
          </h2>
          <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">
            ${isAutoTimeout ? 'ពេលវេលា ៤៥ នាទីបានផុតកំណត់ • ប្រព័ន្ធបានកាត់ពិន្ទុស្វ័យប្រវត្តិ' : 'ការប្រឡងសាកល្បង Mock Exam ត្រូវបានកាត់ពិន្ទុ និងវិភាគកំហុសរួចរាល់'}
          </p>
        </div>

        <!-- Metrics Banner -->
        <div style="background: #1e293b; border-bottom: 1px solid #334155; padding: 14px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
          <div>
            <div style="font-size: 0.74rem; color: #94a3b8;">ពិន្ទុសរុប (Score)</div>
            <div style="font-size: 1.5rem; font-weight: 900; color: ${res.isPass ? '#34d399' : '#f87171'};">${res.score}/100</div>
          </div>
          <div>
            <div style="font-size: 0.74rem; color: #94a3b8;">និទ្ទេស (Grade)</div>
            <div style="font-size: 1.5rem; font-weight: 900; color: #a78bfa;">${res.grade}</div>
          </div>
          <div>
            <div style="font-size: 0.74rem; color: #94a3b8;">ចម្លើយត្រឹមត្រូវ</div>
            <div style="font-size: 1.5rem; font-weight: 900; color: #fff;">${res.correctCount}/${res.totalCount}</div>
          </div>
          <div>
            <div style="font-size: 0.74rem; color: #94a3b8;">រយៈពេលប្រើប្រាស់</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #cbd5e1; margin-top: 4px;">${res.timeSpentFormatted}</div>
          </div>
        </div>

        <!-- Detailed Breakdown -->
        <div style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 14px;">
          <h4 style="margin: 0; color: #e2e8f0; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-list-check text-indigo-400"></i>
            <span>ការវិភាគលម្អិតនៃសំណួរនីមួយៗ (Detailed Explanations):</span>
          </h4>

          ${ex.questions.map((q, idx) => {
            const isCorrect = q._isCorrect;
            const chosen = q._userChoice;
            const opts = q.options || [];

            return `
              <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}; border-left: 4px solid ${isCorrect ? '#10b981' : '#ef4444'}; border-radius: 10px; padding: 14px 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-weight: 700; color: #fff; font-size: 0.88rem;">សំណួរទី ${idx + 1}</span>
                  <span class="badge" style="background: ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color: ${isCorrect ? '#34d399' : '#f87171'}; font-weight: 700; font-size: 0.75rem;">
                    ${isCorrect ? '✓ ត្រឹមត្រូវ (+' + q._points + ' ពិន្ទុ)' : '✕ មិនត្រឹមត្រូវ (០ ពិន្ទុ)'}
                  </span>
                </div>

                <div style="color: #cbd5e1; font-size: 0.92rem; margin-bottom: 8px; font-weight: 600;">
                  ${q.question}
                </div>

                <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 6px;">
                  ចម្លើយរបស់អ្នក៖ <strong style="color: ${isCorrect ? '#34d399' : '#f87171'};">${chosen !== undefined ? `[${String.fromCharCode(65 + chosen)}] ${opts[chosen] || ''}` : 'មិនបានឆ្លើយ'}</strong>
                  ${!isCorrect ? ` • ចម្លើយត្រឹមត្រូវគឺ៖ <strong style="color: #34d399;">[${String.fromCharCode(65 + q.correct)}] ${opts[q.correct] || ''}</strong>` : ''}
                </div>

                ${q.explanation ? `
                  <div style="background: rgba(15, 23, 42, 0.6); border-radius: 6px; padding: 8px 12px; font-size: 0.78rem; color: #a5b4fc; display: flex; align-items: flex-start; gap: 6px;">
                    <i class="fa-solid fa-lightbulb text-amber-400" style="margin-top: 2px;"></i>
                    <span><strong>ការពន្យល់:</strong> ${q.explanation}</span>
                  </div>
                ` : ''}
              </div>
            `;
          }).join("")}
        </div>

        <!-- Footer Actions -->
        <div style="background: #0f172a; border-top: 1px solid #334155; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
          <button type="button" onclick="MockExamEngine.renderLauncher('${ex.course}')" class="btn-secondary" style="height: 38px; padding: 0 16px; font-size: 0.84rem;">
            <i class="fa-solid fa-rotate"></i> <span>ប្រឡងម្តងទៀត (Retake)</span>
          </button>
          <button type="button" onclick="MockExamEngine.closeModal()" class="btn-primary" style="height: 38px; padding: 0 20px; font-size: 0.84rem; background: #6366f1;">
            <span>រួចរាល់ (Close)</span>
          </button>
        </div>
      </div>
    `;
  }
};

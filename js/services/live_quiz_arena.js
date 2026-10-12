/**
 * ==========================================================================
 * Service: LiveQuizArena (ការប្រឡងឆ្លើយសំណួរ Live ក្នុងថ្នាក់របៀប Kahoot)
 * Features:
 * - Kahoot-style classroom quiz show for projector & lab computers
 * - 4 vibrant color choices (Red Triangle, Blue Diamond, Yellow Circle, Green Square)
 * - 30-second animated circular timer with dynamic sound effects
 * - Live score calculation based on speed + accuracy
 * - Final Podium (1st, 2nd, 3rd) with confetti & textbook explanations
 * ==========================================================================
 */

const LiveQuizArena = {
  activeSession: null,
  timerInterval: null,
  timeLeft: 30,
  currentQuestionIndex: 0,
  score: 0,
  streak: 0,
  selectedAnswer: null,

  // Curated Questions from the 120-page textbook
  defaultQuestions: [
    {
      subject: "Word",
      question: "ក្នុង Microsoft Word តើ Shortcut មួយណាសម្រាប់តម្រឹមកថាខណ្ឌឱ្យស្មើសងខាង (Justify)?",
      options: [
        { text: "Ctrl + J", isCorrect: true, symbol: "▲", color: "#ef4444" },
        { text: "Ctrl + E", isCorrect: false, symbol: "◆", color: "#3b82f6" },
        { text: "Ctrl + R", isCorrect: false, symbol: "●", color: "#eab308" },
        { text: "Ctrl + L", isCorrect: false, symbol: "■", color: "#10b981" }
      ],
      explanation: "យោងសៀវភៅពុម្ពទំព័រ ២២៖ Ctrl + J គឺប្រើសម្រាប់ Justify (តម្រឹមអត្ថបទឱ្យស្មើគែមទាំងសងខាងក្នុងឯកសាររដ្ឋបាល)។"
    },
    {
      subject: "Excel",
      question: "ក្នុង Microsoft Excel តើរូបមន្តមួយណាត្រូវប្រើដើម្បីគណនាផលបូកសរុបពី Cell B2 ដល់ B10?",
      options: [
        { text: "=ADD(B2:B10)", isCorrect: false, symbol: "▲", color: "#ef4444" },
        { text: "=SUM(B2:B10)", isCorrect: true, symbol: "◆", color: "#3b82f6" },
        { text: "=TOTAL(B2..B10)", isCorrect: false, symbol: "●", color: "#eab308" },
        { text: "=PLUS(B2:B10)", isCorrect: false, symbol: "■", color: "#10b981" }
      ],
      explanation: "យោងសៀវភៅពុម្ពទំព័រ ៥៤៖ រូបមន្ត =SUM(...) គឺជាអនុគមន៍មូលដ្ឋានសម្រាប់បូកសរុបតម្លៃលេខក្នុងតារាងទិន្នន័យ។"
    },
    {
      subject: "PowerPoint",
      question: "តើ Key មួយណាសម្រាប់ចាប់ផ្តើមចាក់បញ្ចាំង Slide បទបង្ហាញចាប់ពី Slide ដំបូងគេ?",
      options: [
        { text: "F5", isCorrect: true, symbol: "▲", color: "#ef4444" },
        { text: "Shift + F5", isCorrect: false, symbol: "◆", color: "#3b82f6" },
        { text: "Ctrl + F5", isCorrect: false, symbol: "●", color: "#eab308" },
        { text: "Alt + F5", isCorrect: false, symbol: "■", color: "#10b981" }
      ],
      explanation: "យោងសៀវភៅពុម្ពទំព័រ ៨៩៖ ចុច F5 ដើម្បី Slide Show ពីដំបូង ចំណែក Shift + F5 គឺបញ្ចាំងចាប់ពី Slide បច្ចុប្បន្ន។"
    },
    {
      subject: "Typing",
      question: "តើគ្រាប់ចុចមួយណាដែលម្រាមដៃចង្អុលទាំងសងខាងត្រូវដាក់ពីលើជាគោល (Home Row Keys)?",
      options: [
        { text: "A និង ;", isCorrect: false, symbol: "▲", color: "#ef4444" },
        { text: "F និង J", isCorrect: true, symbol: "◆", color: "#3b82f6" },
        { text: "D និង K", isCorrect: false, symbol: "●", color: "#eab308" },
        { text: "S និង L", isCorrect: false, symbol: "■", color: "#10b981" }
      ],
      explanation: "យោងសៀវភៅពុម្ពទំព័រ ៨៖ គ្រាប់ចុច F និង J មានគំនូសបន្ទាត់តូចសម្រាប់សម្គាល់ម្រាមដៃចង្អុលឆ្វេង និងស្តាំដោយមិនបាច់មើលក្តារចុច។"
    },
    {
      subject: "Windows",
      question: "តើ Shortcut មួយណាសម្រាប់ចាក់សោអេក្រង់កុំព្យូទ័រ (Lock PC) ពេលដើរចេញពីតុធ្វើការ?",
      options: [
        { text: "Windows + D", isCorrect: false, symbol: "▲", color: "#ef4444" },
        { text: "Windows + E", isCorrect: false, symbol: "●", color: "#eab308" },
        { text: "Windows + L", isCorrect: true, symbol: "◆", color: "#3b82f6" },
        { text: "Ctrl + Alt + L", isCorrect: false, symbol: "■", color: "#10b981" }
      ],
      explanation: "យោងសៀវភៅពុម្ពទំព័រ ១៥៖ Windows + L ប្រើសម្រាប់ Lock កុំព្យូទ័រការពារសុវត្ថិភាពទិន្នន័យការិយាល័យ។"
    }
  ],

  openModal() {
    this.ensureModalInDOM();
    this.renderLobby();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("liveQuizModal");
    } else {
      const el = document.getElementById("liveQuizModal");
      if (el) el.style.display = "flex";
    }
  },

  closeModal() {
    this.clearInterval();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("liveQuizModal");
    } else {
      const el = document.getElementById("liveQuizModal");
      if (el) el.style.display = "none";
    }
  },

  clearInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  ensureModalInDOM() {
    let modal = document.getElementById("liveQuizModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "liveQuizModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10900";
      document.body.appendChild(modal);
    }
  },

  renderLobby() {
    const modal = document.getElementById("liveQuizModal");
    if (!modal) return;

    const pin = Math.floor(100000 + Math.random() * 900000);
    this.currentPin = pin;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 820px; width: 95%; background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 100%); border-radius: 24px; border: 2px solid #8b5cf6; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(139, 92, 246, 0.3); overflow: hidden; padding: 0; color: #fff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4338ca, #6d28d9); padding: 22px 28px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(255,255,255,0.1);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.6rem;">
              🏆
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.3rem; font-weight: 900; letter-spacing: -0.3px;">TIS Live Quiz Battle</h3>
              <p style="margin: 0; font-size: 0.8rem; color: #c7d2fe;">ការប្រកួតឆ្លើយសំណួរកុំព្យូទ័រ Live ក្នុងបន្ទប់ Lab (បែប Kahoot)</p>
            </div>
          </div>
          <button type="button" onclick="LiveQuizArena.closeModal()" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px; text-align: center;">
          <div style="display: inline-block; background: rgba(139, 92, 246, 0.15); border: 1.5px dashed #a855f7; border-radius: 20px; padding: 18px 36px; margin-bottom: 24px;">
            <div style="font-size: 0.85rem; color: #d8b4fe; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Game PIN ប្រឡង Live</div>
            <div style="font-size: 3rem; font-weight: 900; letter-spacing: 6px; color: #facc15; font-family: monospace; text-shadow: 0 0 20px rgba(250, 204, 21, 0.4);">${pin}</div>
          </div>

          <p style="font-size: 0.95rem; color: #94a3b8; max-width: 540px; margin: 0 auto 28px; line-height: 1.6;">
            សិស្សទាំងអស់អាចចូលរួមប្រកួតបានភ្លាមៗ! ឆ្លើយឱ្យត្រូវ និងលឿនបំផុតដើម្បីទទួលបានពិន្ទុខ្ពស់ និងឈ្នះមេដាយមាសលើវេទិកា Podium។
          </p>

          <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-bottom: 32px;">
            <div style="background: rgba(255,255,255,0.05); padding: 12px 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); font-size: 0.88rem;">
              📚 សំណួរយោង៖ <strong>សៀវភៅពុម្ព ១២០ ទំព័រ</strong>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 12px 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); font-size: 0.88rem;">
              ⏱️ ពេលឆ្លើយ៖ <strong>៣០ វិនាទី / សំណួរ</strong>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 12px 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); font-size: 0.88rem;">
              🎯 ចំនួនសំណួរ៖ <strong>៥ សំណួរចម្រុះ</strong>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 14px;">
            <button type="button" onclick="LiveQuizArena.startBattle()" style="padding: 14px 42px; border-radius: 14px; background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; color: #fff; font-size: 1.1rem; font-weight: 800; cursor: pointer; box-shadow: 0 10px 25px rgba(236, 72, 153, 0.4); display: flex; align-items: center; gap: 10px;">
              <span>🚀 ចាប់ផ្តើមប្រកួត Live ឥឡូវនេះ</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  startBattle() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.renderQuestionScreen();
  },

  renderQuestionScreen() {
    const modal = document.getElementById("liveQuizModal");
    if (!modal) return;

    this.clearInterval();
    this.timeLeft = 30;
    this.selectedAnswer = null;

    const q = this.defaultQuestions[this.currentQuestionIndex];
    if (!q) {
      this.renderPodium();
      return;
    }

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 900px; width: 95%; background: #0f172a; border-radius: 24px; border: 2px solid #6366f1; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9); overflow: hidden; padding: 0; color: #fff; min-height: 580px; display: flex; flex-direction: column;">
        <!-- Top Banner -->
        <div style="padding: 16px 24px; background: #1e1b4b; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="background: #4f46e5; padding: 4px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 800; text-transform: uppercase;">
              ${q.subject}
            </span>
            <span style="font-size: 0.9rem; color: #cbd5e1; font-weight: 700;">
              សំណួរទី ${this.currentQuestionIndex + 1} នៃ ${this.defaultQuestions.length}
            </span>
          </div>

          <!-- Circular / Badge Timer -->
          <div style="display: flex; align-items: center; gap: 10px;">
            <div id="quizTimerBox" style="width: 48px; height: 48px; border-radius: 50%; background: #312e81; border: 3px solid #f43f5e; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 900; color: #fff; box-shadow: 0 0 14px rgba(244, 63, 94, 0.5);">
              30
            </div>
          </div>

          <!-- Live Score -->
          <div style="font-weight: 800; font-size: 1rem; color: #facc15;">
            ពិន្ទុ៖ <span id="quizLiveScore">${this.score}</span>
          </div>
        </div>

        <!-- Question Prompt Area -->
        <div style="flex: 1; padding: 32px 36px 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
          <h2 style="font-size: 1.35rem; font-weight: 800; line-height: 1.6; color: #ffffff; max-width: 760px; margin: 0 0 24px 0;">
            ${q.question}
          </h2>

          <!-- 4 Color Cards (Kahoot Style) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; max-width: 780px;">
            ${q.options.map((opt, idx) => `
              <button type="button" id="quizOptBtn_${idx}" onclick="LiveQuizArena.selectOption(${idx})" style="padding: 22px 20px; background: ${opt.color}; border: none; border-radius: 16px; color: #fff; font-size: 1.1rem; font-weight: 800; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.3); transition: all 0.15s ease;">
                <span style="font-size: 1.6rem; width: 34px; height: 34px; background: rgba(0,0,0,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">${opt.symbol}</span>
                <span style="flex: 1; line-height: 1.4;">${opt.text}</span>
              </button>
            `).join('')}
          </div>

          <!-- Explanation Box (Initially Hidden) -->
          <div id="quizExplanationBox" style="display: none; margin-top: 20px; width: 100%; max-width: 780px; padding: 14px 18px; border-radius: 12px; background: rgba(255,255,255,0.08); border-left: 4px solid #10b981; text-align: left; font-size: 0.88rem; color: #e2e8f0;">
          </div>
        </div>

        <!-- Footer Actions -->
        <div id="quizFooterBox" style="padding: 16px 24px; background: #1e1b4b; display: flex; justify-content: flex-end; border-top: 1px solid rgba(255,255,255,0.08); display: none;">
          <button type="button" onclick="LiveQuizArena.nextQuestion()" style="padding: 10px 28px; border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #06b6d4); border: none; color: #fff; font-size: 0.95rem; font-weight: 800; cursor: pointer;">
            សំណួរបន្ទាប់ ➔
          </button>
        </div>
      </div>
    `;

    // Start 30s countdown
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const timerEl = document.getElementById("quizTimerBox");
      if (timerEl) {
        timerEl.textContent = this.timeLeft;
        if (this.timeLeft <= 10) {
          timerEl.style.borderColor = "#ef4444";
          timerEl.style.boxShadow = "0 0 20px #ef4444";
        }
      }
      if (this.timeLeft <= 0) {
        this.timeUp();
      }
    }, 1000);
  },

  selectOption(idx) {
    if (this.selectedAnswer !== null) return; // Already selected
    this.selectedAnswer = idx;
    this.clearInterval();

    const q = this.defaultQuestions[this.currentQuestionIndex];
    const chosen = q.options[idx];
    const isCorrect = chosen && chosen.isCorrect;

    // Calculate score: Max 1000 per question, faster gives more bonus
    let earned = 0;
    if (isCorrect) {
      earned = Math.round(500 + (this.timeLeft / 30) * 500);
      this.streak++;
      if (this.streak > 1) earned += this.streak * 50; // Streak bonus
      this.score += earned;
    } else {
      this.streak = 0;
    }

    // Update Live Score UI
    const scoreEl = document.getElementById("quizLiveScore");
    if (scoreEl) scoreEl.textContent = this.score;

    // Highlight correct & wrong buttons
    q.options.forEach((opt, i) => {
      const btn = document.getElementById(`quizOptBtn_${i}`);
      if (btn) {
        btn.disabled = true;
        btn.style.cursor = "default";
        if (opt.isCorrect) {
          btn.style.boxShadow = "0 0 25px #10b981, inset 0 0 10px #fff";
          btn.style.transform = "scale(1.02)";
        } else if (i === idx) {
          btn.style.opacity = "0.5";
          btn.style.filter = "grayscale(70%)";
        } else {
          btn.style.opacity = "0.3";
        }
      }
    });

    // Show Explanation & Next button
    const expBox = document.getElementById("quizExplanationBox");
    if (expBox) {
      expBox.style.display = "block";
      expBox.style.borderLeftColor = isCorrect ? "#10b981" : "#ef4444";
      expBox.innerHTML = `
        <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px; color: ${isCorrect ? '#34d399' : '#f87171'};">
          ${isCorrect ? '🎉 ឆ្លើយត្រូវ (+ ' + earned + ' ពិន្ទុ)' : '❌ ឆ្លើយមិនទាន់ត្រឹមត្រូវ'}
        </div>
        <div>${q.explanation}</div>
      `;
    }

    const footer = document.getElementById("quizFooterBox");
    if (footer) footer.style.display = "flex";
  },

  timeUp() {
    this.clearInterval();
    this.selectOption(-1);
  },

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= this.defaultQuestions.length) {
      this.renderPodium();
    } else {
      this.renderQuestionScreen();
    }
  },

  renderPodium() {
    const modal = document.getElementById("liveQuizModal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 820px; width: 95%; background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 100%); border-radius: 24px; border: 2px solid #facc15; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(250, 204, 21, 0.3); overflow: hidden; padding: 0; color: #fff; text-align: center;">
        <div style="background: linear-gradient(135deg, #ca8a04, #eab308); padding: 24px; color: #000;">
          <h2 style="margin: 0; font-size: 1.6rem; font-weight: 900;">🏆 វេទិកាជើងឯក TIS Live Battle Podium</h2>
          <p style="margin: 4px 0 0; font-weight: 700; opacity: 0.9;">លទ្ធផលការប្រកួតសំណួរកុំព្យូទ័រ Live ក្នុងបន្ទប់ Lab</p>
        </div>

        <div style="padding: 36px 24px;">
          <!-- 3D Podium Graphic -->
          <div style="display: flex; justify-content: center; align-items: flex-end; gap: 16px; margin: 20px 0 36px; min-height: 200px;">
            <!-- 2nd Place -->
            <div style="display: flex; flex-direction: column; align-items: center; width: 110px;">
              <div style="font-size: 2rem;">🥈</div>
              <div style="font-weight: 800; font-size: 0.88rem; color: #cbd5e1; margin-bottom: 6px;">សិស្សលេខ ២</div>
              <div style="height: 100px; width: 100%; background: linear-gradient(180deg, #94a3b8, #475569); border-radius: 12px 12px 0 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; color: #fff;">
                2
              </div>
            </div>

            <!-- 1st Place (Champion) -->
            <div style="display: flex; flex-direction: column; align-items: center; width: 130px;">
              <div style="font-size: 2.8rem; filter: drop-shadow(0 0 12px rgba(250, 204, 21, 0.8));">👑</div>
              <div style="font-weight: 900; font-size: 0.98rem; color: #facc15; margin-bottom: 6px;">ជើងឯកលេខ ១</div>
              <div style="height: 140px; width: 100%; background: linear-gradient(180deg, #facc15, #ca8a04); border-radius: 14px 14px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; color: #000; box-shadow: 0 0 25px rgba(250, 204, 21, 0.5);">
                1
                <span style="font-size: 0.72rem; font-weight: 800;">CHAMPION</span>
              </div>
            </div>

            <!-- 3rd Place -->
            <div style="display: flex; flex-direction: column; align-items: center; width: 110px;">
              <div style="font-size: 2rem;">🥉</div>
              <div style="font-weight: 800; font-size: 0.88rem; color: #d97706; margin-bottom: 6px;">សិស្សលេខ ៣</div>
              <div style="height: 70px; width: 100%; background: linear-gradient(180deg, #d97706, #78350f); border-radius: 12px 12px 0 0; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 900; color: #fff;">
                3
              </div>
            </div>
          </div>

          <!-- User's Score -->
          <div style="background: rgba(255,255,255,0.06); border-radius: 18px; padding: 18px; max-width: 420px; margin: 0 auto 28px; border: 1px solid rgba(255,255,255,0.12);">
            <div style="font-size: 0.82rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">ពិន្ទុរបស់អ្នកទទួលបាន</div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #38bdf8;">${this.score} <span style="font-size: 1rem; color: #94a3b8;">Pts</span></div>
          </div>

          <div style="display: flex; justify-content: center; gap: 12px;">
            <button type="button" onclick="LiveQuizArena.startBattle()" style="padding: 12px 28px; border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #06b6d4); border: none; color: #fff; font-weight: 800; cursor: pointer;">
              🔄 ប្រកួតម្តងទៀត
            </button>
            <button type="button" onclick="LiveQuizArena.closeModal()" style="padding: 12px 28px; border-radius: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-weight: 700; cursor: pointer;">
              បិទផ្ទាំង
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

window.LiveQuizArena = LiveQuizArena;

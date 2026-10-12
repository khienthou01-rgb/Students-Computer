/**
 * ==========================================================================
 * Service: ShortcutTrainer (កម្មវិធីហ្វឹកហាត់ Shortcut Key Trainer លើ Virtual Keyboard)
 * Features:
 * - Real-time Physical Keyboard listener with illuminated Virtual Keyboard UI
 * - 4 Course Modes: Windows, Word, Excel, and PowerPoint
 * - Speed Challenge Mode with combo streaks and score
 * - Instant feedback and textbook shortcut tips
 * ==========================================================================
 */

const ShortcutTrainer = {
  activeCategory: "Word",
  currentChallengeIndex: 0,
  score: 0,
  streak: 0,
  pressedKeys: new Set(),
  isListening: false,

  challenges: {
    Word: [
      { prompt: "តម្រឹមកថាខណ្ឌឱ្យស្មើសងខាង (Justify)", combo: ["Control", "j"], keyDisplay: "Ctrl + J", desc: "Justify Paragraph" },
      { prompt: "តម្រឹមអត្ថបទចំកណ្តាល (Center Align)", combo: ["Control", "e"], keyDisplay: "Ctrl + E", desc: "Center Align" },
      { prompt: "ដាក់អក្សរដិត (Bold Text)", combo: ["Control", "b"], keyDisplay: "Ctrl + B", desc: "Bold Text" },
      { prompt: "គូសបន្ទាត់ពីក្រោមអក្សរ (Underline)", combo: ["Control", "u"], keyDisplay: "Ctrl + U", desc: "Underline" },
      { prompt: "រក្សាទុកឯកសារភ្លាមៗ (Save Document)", combo: ["Control", "s"], keyDisplay: "Ctrl + S", desc: "Save Document" }
    ],
    Excel: [
      { prompt: "បញ្ចូលកាលបរិច្ឆេទថ្ងៃនេះស្វ័យប្រវត្តិ", combo: ["Control", ";"], keyDisplay: "Ctrl + ;", desc: "Insert Current Date" },
      { prompt: "ប្តូរប្រភេទ Cell ទៅជា Absolute Reference ($A$1)", combo: ["F4"], keyDisplay: "F4", desc: "Toggle Reference ($)" },
      { prompt: "ផលបូក AutoSum ស្វ័យប្រវត្តិ", combo: ["Alt", "="], keyDisplay: "Alt + =", desc: "AutoSum formula" },
      { prompt: "លោតទៅកាន់ Cell ដំបូងបង្អស់ A1", combo: ["Control", "Home"], keyDisplay: "Ctrl + Home", desc: "Go to Cell A1" }
    ],
    Windows: [
      { prompt: "ចាក់សោអេក្រង់កុំព្យូទ័រ (Lock Windows)", combo: ["Meta", "l"], keyDisplay: "Win + L", desc: "Lock Workstation" },
      { prompt: "បង្រួមគ្រប់ផ្ទាំងទាំងអស់ទៅ Desktop (Show Desktop)", combo: ["Meta", "d"], keyDisplay: "Win + D", desc: "Show Desktop" },
      { prompt: "បើកផ្ទាំង File Explorer មើល Drives & Folders", combo: ["Meta", "e"], keyDisplay: "Win + E", desc: "Open File Explorer" },
      { prompt: "ថតរូបអេក្រង់ផ្នែកណាមួយ (Snipping Tool)", combo: ["Meta", "Shift", "s"], keyDisplay: "Win + Shift + S", desc: "Screen Snip" }
    ],
    PowerPoint: [
      { prompt: "ចាក់បញ្ចាំង Slide Show ចាប់ពី Slide ដំបូង", combo: ["F5"], keyDisplay: "F5", desc: "Start Slide Show" },
      { prompt: "ចាក់បញ្ចាំងចាប់ពី Slide បច្ចុប្បន្ន (Current Slide)", combo: ["Shift", "F5"], keyDisplay: "Shift + F5", desc: "From Current Slide" },
      { prompt: "បង្កើត Slide ថ្មីទទេមួយបន្ថែម (New Slide)", combo: ["Control", "m"], keyDisplay: "Ctrl + M", desc: "Insert New Slide" },
      { prompt: "ចម្លងស្ទួន Slide ដដែល (Duplicate Slide)", combo: ["Control", "d"], keyDisplay: "Ctrl + D", desc: "Duplicate Slide" }
    ]
  },

  openModal() {
    this.ensureModalInDOM();
    this.currentChallengeIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.renderModal();
    this.startListener();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("shortcutTrainerModal");
    } else {
      const el = document.getElementById("shortcutTrainerModal");
      if (el) el.style.display = "flex";
    }
  },

  closeModal() {
    this.stopListener();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("shortcutTrainerModal");
    } else {
      const el = document.getElementById("shortcutTrainerModal");
      if (el) el.style.display = "none";
    }
  },

  ensureModalInDOM() {
    let modal = document.getElementById("shortcutTrainerModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "shortcutTrainerModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10900";
      document.body.appendChild(modal);
    }
  },

  startListener() {
    if (this.isListening) return;
    this.isListening = true;
    this._keyDownHandler = (e) => this.handleKeyDown(e);
    this._keyUpHandler = (e) => this.handleKeyUp(e);
    window.addEventListener("keydown", this._keyDownHandler);
    window.addEventListener("keyup", this._keyUpHandler);
  },

  stopListener() {
    this.isListening = false;
    this.pressedKeys.clear();
    if (this._keyDownHandler) window.removeEventListener("keydown", this._keyDownHandler);
    if (this._keyUpHandler) window.removeEventListener("keyup", this._keyUpHandler);
  },

  handleKeyDown(e) {
    const modal = document.getElementById("shortcutTrainerModal");
    if (!modal || modal.style.display === "none") return;

    // Prevent default browser shortcuts while trainer is active
    if (e.ctrlKey || e.altKey || e.key === "F5") {
      e.preventDefault();
    }

    this.pressedKeys.add(e.key.toLowerCase());
    if (e.ctrlKey) this.pressedKeys.add("control");
    if (e.shiftKey) this.pressedKeys.add("shift");
    if (e.altKey) this.pressedKeys.add("alt");
    if (e.metaKey) this.pressedKeys.add("meta");

    this.updateVirtualKeyLights();
    this.checkComboMatch();
  },

  handleKeyUp(e) {
    this.pressedKeys.delete(e.key.toLowerCase());
    if (!e.ctrlKey) this.pressedKeys.delete("control");
    if (!e.shiftKey) this.pressedKeys.delete("shift");
    if (!e.altKey) this.pressedKeys.delete("alt");
    if (!e.metaKey) this.pressedKeys.delete("meta");
    this.updateVirtualKeyLights();
  },

  updateVirtualKeyLights() {
    const keys = document.querySelectorAll(".virtual-key");
    keys.forEach(k => {
      const code = k.getAttribute("data-key");
      if (code && this.pressedKeys.has(code.toLowerCase())) {
        k.classList.add("active");
      } else {
        k.classList.remove("active");
      }
    });
  },

  checkComboMatch() {
    const currentList = this.challenges[this.activeCategory];
    const current = currentList[this.currentChallengeIndex];
    if (!current) return;

    // Check if all combo keys are pressed
    const allMatch = current.combo.every(k => this.pressedKeys.has(k.toLowerCase()));

    if (allMatch) {
      this.score += 100 + (this.streak * 20);
      this.streak++;
      this.showSuccessFeedback(current);
      setTimeout(() => {
        this.nextChallenge();
      }, 700);
    }
  },

  showSuccessFeedback(current) {
    const displayBox = document.getElementById("trainerFeedbackBox");
    if (displayBox) {
      displayBox.innerHTML = `
        <div style="color: #34d399; font-size: 1.15rem; font-weight: 900; animation: pulse 0.5s;">
          🎉 ត្រឹមត្រូវ! ${current.keyDisplay} ➔ ${current.desc}
        </div>
      `;
    }
  },

  nextChallenge() {
    const currentList = this.challenges[this.activeCategory];
    if (this.currentChallengeIndex < currentList.length - 1) {
      this.currentChallengeIndex++;
      this.renderChallengeCard();
    } else {
      this.renderCompleted();
    }
  },

  setCategory(cat) {
    this.activeCategory = cat;
    this.currentChallengeIndex = 0;
    this.renderChallengeCard();
  },

  renderModal() {
    const modal = document.getElementById("shortcutTrainerModal");
    if (!modal) return;

    modal.innerHTML = `
      <style>
        .virtual-key {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          color: #cbd5e1;
          font-family: monospace;
          font-size: 0.82rem;
          font-weight: 700;
          box-shadow: 0 3px 0 #0f172a;
          transition: all 0.08s ease;
          user-select: none;
        }
        .virtual-key.active {
          background: #06b6d4 !important;
          color: #000 !important;
          border-color: #22d3ee !important;
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.8) !important;
          transform: translateY(2px);
        }
      </style>

      <div class="modal-card" style="max-width: 900px; width: 95%; background: #0b0f19; border-radius: 24px; border: 2px solid #06b6d4; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95); overflow: hidden; padding: 0; color: #fff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #083344, #0e7490); padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #06b6d4;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              ⌨️
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.2rem; font-weight: 900;">TIS Shortcut Key Trainer</h3>
              <p style="margin: 0; font-size: 0.78rem; color: #a5f3fc;">កម្មវិធីហ្វឹកហាត់កាត់ផ្លូវកាត់កុំព្យូទ័ររដ្ឋបាលលើក្តារចុច</p>
            </div>
          </div>
          <button type="button" onclick="ShortcutTrainer.closeModal()" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer;">✕</button>
        </div>

        <!-- Category Selector -->
        <div style="background: #0f172a; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; gap: 8px;">
            ${["Word", "Excel", "PowerPoint", "Windows"].map(c => `
              <button type="button" onclick="ShortcutTrainer.setCategory('${c}')" style="padding: 6px 16px; border-radius: 10px; border: 1px solid ${this.activeCategory === c ? '#06b6d4' : 'rgba(255,255,255,0.1)'}; background: ${this.activeCategory === c ? '#0891b2' : 'transparent'}; color: #fff; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
                ${c}
              </button>
            `).join('')}
          </div>
          <div style="font-weight: 800; font-size: 0.95rem; color: #facc15;">
            ពិន្ទុ៖ <span id="trainerScore">${this.score}</span> | Streak: <span id="trainerStreak" style="color: #38bdf8;">${this.streak}🔥</span>
          </div>
        </div>

        <!-- Challenge Prompt Section -->
        <div id="trainerChallengeArea" style="padding: 28px 24px; text-align: center;">
          <!-- Injected dynamically -->
        </div>

        <!-- Virtual Keyboard Preview (QWERTY Base) -->
        <div style="padding: 0 24px 24px;">
          <div style="background: #090d16; border: 1.5px solid #1e293b; border-radius: 18px; padding: 18px; max-width: 780px; margin: 0 auto;">
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <!-- Row 1 -->
              <div style="display: flex; gap: 6px;">
                <span class="virtual-key" data-key="escape">Esc</span>
                <span class="virtual-key" data-key="f1">F1</span>
                <span class="virtual-key" data-key="f2">F2</span>
                <span class="virtual-key" data-key="f4">F4</span>
                <span class="virtual-key" data-key="f5">F5</span>
                <span class="virtual-key" data-key="f12">F12</span>
              </div>
              <!-- Row 2 (Alpha) -->
              <div style="display: flex; gap: 6px;">
                <span class="virtual-key" data-key="q">Q</span>
                <span class="virtual-key" data-key="w">W</span>
                <span class="virtual-key" data-key="e">E</span>
                <span class="virtual-key" data-key="r">R</span>
                <span class="virtual-key" data-key="t">T</span>
                <span class="virtual-key" data-key="y">Y</span>
                <span class="virtual-key" data-key="u">U</span>
                <span class="virtual-key" data-key="i">I</span>
                <span class="virtual-key" data-key="o">O</span>
                <span class="virtual-key" data-key="p">P</span>
              </div>
              <!-- Row 3 (Home Row) -->
              <div style="display: flex; gap: 6px;">
                <span class="virtual-key" data-key="a">A</span>
                <span class="virtual-key" data-key="s">S</span>
                <span class="virtual-key" data-key="d">D</span>
                <span class="virtual-key" data-key="f">F</span>
                <span class="virtual-key" data-key="g">G</span>
                <span class="virtual-key" data-key="h">H</span>
                <span class="virtual-key" data-key="j">J</span>
                <span class="virtual-key" data-key="k">K</span>
                <span class="virtual-key" data-key="l">L</span>
                <span class="virtual-key" data-key=";">;</span>
              </div>
              <!-- Row 4 -->
              <div style="display: flex; gap: 6px;">
                <span class="virtual-key" data-key="shift" style="width: 70px;">Shift</span>
                <span class="virtual-key" data-key="z">Z</span>
                <span class="virtual-key" data-key="x">X</span>
                <span class="virtual-key" data-key="c">C</span>
                <span class="virtual-key" data-key="v">V</span>
                <span class="virtual-key" data-key="b">B</span>
                <span class="virtual-key" data-key="n">N</span>
                <span class="virtual-key" data-key="m">M</span>
                <span class="virtual-key" data-key="shift" style="width: 70px;">Shift</span>
              </div>
              <!-- Row 5 (Modifiers) -->
              <div style="display: flex; gap: 6px;">
                <span class="virtual-key" data-key="control" style="width: 65px; background: #334155;">Ctrl</span>
                <span class="virtual-key" data-key="meta" style="background: #334155;">Win</span>
                <span class="virtual-key" data-key="alt" style="width: 55px; background: #334155;">Alt</span>
                <span class="virtual-key" data-key=" " style="width: 220px;">Spacebar</span>
                <span class="virtual-key" data-key="alt" style="width: 55px; background: #334155;">Alt</span>
                <span class="virtual-key" data-key="control" style="width: 65px; background: #334155;">Ctrl</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderChallengeCard();
  },

  renderChallengeCard() {
    const area = document.getElementById("trainerChallengeArea");
    if (!area) return;

    const currentList = this.challenges[this.activeCategory];
    const current = currentList[this.currentChallengeIndex];
    if (!current) {
      this.renderCompleted();
      return;
    }

    const scoreEl = document.getElementById("trainerScore");
    if (scoreEl) scoreEl.textContent = this.score;

    const streakEl = document.getElementById("trainerStreak");
    if (streakEl) streakEl.textContent = `${this.streak}🔥`;

    area.innerHTML = `
      <div style="font-size: 0.85rem; color: #38bdf8; font-weight: 700; margin-bottom: 8px;">
        សំណួរទី ${this.currentChallengeIndex + 1} នៃ ${currentList.length} • មុខវិជ្ជា ${this.activeCategory}
      </div>
      <h2 style="font-size: 1.5rem; font-weight: 900; color: #fff; margin: 0 0 16px 0;">
        ${current.prompt}
      </h2>
      <div style="display: inline-block; padding: 10px 24px; border-radius: 14px; background: rgba(6, 182, 212, 0.12); border: 1.5px dashed #06b6d4; margin-bottom: 16px;">
        <span style="font-size: 0.9rem; color: #cbd5e1;">សូមចុចលើ Keyboard របស់អ្នកផ្ទាល់៖</span>
        <div style="font-size: 1.6rem; font-weight: 900; color: #facc15; font-family: monospace; margin-top: 4px;">
          ${current.keyDisplay}
        </div>
      </div>
      <div id="trainerFeedbackBox" style="min-height: 28px;"></div>
    `;
  },

  renderCompleted() {
    const area = document.getElementById("trainerChallengeArea");
    if (!area) return;

    area.innerHTML = `
      <div style="padding: 20px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
        <h2 style="font-size: 1.6rem; font-weight: 900; color: #34d399; margin: 0 0 8px 0;">
          អបអរសាទរ! អ្នកបានឆ្លងផុតគ្រប់ Shortcut ក្នុង ${this.activeCategory}
        </h2>
        <div style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 20px;">
          ពិន្ទុសរុប៖ <strong style="color: #facc15; font-size: 1.4rem;">${this.score}</strong> ពិន្ទុ
        </div>
        <button type="button" onclick="ShortcutTrainer.setCategory('${this.activeCategory}')" style="padding: 10px 24px; border-radius: 12px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border: none; color: #fff; font-weight: 800; cursor: pointer;">
          🔄 ហ្វឹកហាត់ម្តងទៀត
        </button>
      </div>
    `;
  }
};

window.ShortcutTrainer = ShortcutTrainer;

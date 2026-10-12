/**
 * ==========================================================================
 * Service: AnimeAIAssistant (ជំនួយការឆ្លាតវៃ TIS AI Anime Companion - ម៉ីលីង AI)
 * All-in-One AI Work Companion with Voice & Anime Visual Studio
 * ==========================================================================
 */

const AnimeAIAssistant = {
  NAME: "ម៉ីលីង AI (Mei-Ling)",
  TITLE: "ជំនួយការឆ្លាតវៃ AI ប្រចាំសាលា TIS",
  AVATAR: "assets/images/anime_ai_assistant.jpg",
  STORAGE_CHAT_KEY: "tis_anime_ai_chat_history",

  state: {
    isSpeaking: false,
    currentTab: "chat", // 'chat', 'voice', 'tools'
    speechUtterance: null,
    speechRate: 1.0,
    messages: [
      {
        sender: "bot",
        text: "សួស្តីលោកគ្រូ! ខ្ញុំគឺ ម៉ីលីង (Mei-Ling) ជំនួយការឆ្លាតវៃ AI ប្រចាំសាលា អន្តរជាតិ ធានស៊ីន។ តើថ្ងៃនេះលោកគ្រូ ឬប្អូនៗចង់ឱ្យខ្ញុំជួយរៀបចំស្លាយបង្រៀន វិញ្ញាសាប្រឡង ឬអានមេរៀនជាសំឡេងដែរទេ? ✨",
        time: new Date().toLocaleTimeString("km-KH", { hour: "2-digit", minute: "2-digit" })
      }
    ]
  },

  /**
   * Initialize Global Anime Companion
   */
  init() {
    this.injectFloatingWidget();
    this.bindGlobalShortcuts();
  },

  /**
   * Injects the persistent floating Anime companion in bottom-right corner
   */
  injectFloatingWidget() {
    if (document.getElementById("animeFloatingCompanion")) return;

    const wrap = document.createElement("div");
    wrap.id = "animeFloatingCompanion";
    wrap.className = "anime-floating-companion";
    wrap.innerHTML = `
      <div class="anime-float-bubble" id="animeFloatBubble" onclick="AnimeAIAssistant.openStudioModal()">
        <span style="font-weight: 700; color: #c084fc;">✨ ម៉ីលីង AI:</span>
        <span id="animeFloatBubbleText">សួស្តីលោកគ្រូ! ចុចលើខ្ញុំដើម្បីបញ្ជា AI និងអានសំឡេង...</span>
      </div>
      <div class="anime-float-avatar-btn" onclick="AnimeAIAssistant.openStudioModal()" title="បើកមជ្ឈមណ្ឌលជំនួយការ Anime AI">
        <div class="anime-float-halo"></div>
        <img src="${this.AVATAR}" alt="${this.NAME}" class="anime-float-avatar-img">
        <span class="anime-float-badge"><i class="fa-solid fa-sparkles"></i> AI</span>
      </div>
    `;

    document.body.appendChild(wrap);

    // Auto rotate tips on bubble
    this.startBubbleTips();
  },

  /**
   * Periodic tips displayed in the floating bubble
   */
  startBubbleTips() {
    const tips = [
      "ចុចលើខ្ញុំដើម្បីបង្កើតកម្រងសំណួរ Quiz! 📝",
      "ខ្ញុំអាចអានមេរៀនជាសំឡេងជូនលោកគ្រូបាន! 🎙️",
      "ចង់បង្កើតស្លាយបង្រៀនកុំព្យូទ័រទេលោកគ្រូ? 📊",
      "ត្រូវការកិច្ចតែងការបង្រៀន Word 2019 ទេ? 💡",
      "ម៉ីលីង AI រង់ចាំជួយលោកគ្រូ ២៤/៧! 💖"
    ];
    let idx = 0;
    setInterval(() => {
      const el = document.getElementById("animeFloatBubbleText");
      if (el) {
        idx = (idx + 1) % tips.length;
        el.textContent = tips[idx];
      }
    }, 12000);
  },

  /**
   * Render Hero Studio Banner on Dashboard
   */
  renderHeroBanner() {
    return `
      <div class="anime-assistant-hero motion-fade-up">
        <!-- Top Row: Avatar & Identity -->
        <div class="anime-hero-top">
          <div class="anime-char-identity">
            <div class="anime-avatar-frame" onclick="AnimeAIAssistant.openStudioModal()" title="ចុចដើម្បីបើក AI Studio ពេញលេញ">
              <div class="anime-avatar-halo"></div>
              <img src="${this.AVATAR}" alt="${this.NAME}" class="anime-avatar-img">
              <span class="anime-status-dot" title="Gemini 3.8 Flash Online"></span>
            </div>
            <div class="anime-char-info">
              <div class="anime-char-badges">
                <span class="anime-tag-role"><i class="fa-solid fa-wand-magic-sparkles"></i> All-in-One AI Assistant</span>
                <span class="anime-tag-model"><i class="fa-solid fa-bolt"></i> Google Gemini 3.8 Flash (Free)</span>
              </div>
              <h3 class="anime-char-name">
                ${this.NAME} • TIS Anime AI Companion
              </h3>
              <div class="anime-speech-bubble" id="animeHeroSpeechBubble">
                <span>« សួស្តីលោកគ្រូ! ខ្ញុំត្រៀមខ្លួនជាស្រេចដើម្បីជួយបង្កើតស្លាយបង្រៀន វិញ្ញាសាប្រឡង និងអានមេរៀនជាសំឡេងជូនសិស្ស! »</span>
              </div>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="anime-header-actions">
            <button type="button" class="btn-anime-voice" id="btnHeroVoiceSpeak" onclick="AnimeAIAssistant.toggleVoiceGreeting()">
              <i class="fa-solid fa-volume-high"></i>
              <span>🔊 ស្តាប់ការស្វាគមន៍</span>
            </button>
            <button type="button" class="btn-anime-open-studio" onclick="AnimeAIAssistant.openStudioModal()">
              <i class="fa-solid fa-robot"></i>
              <span>✨ បើក AI Studio ពេញលេញ</span>
            </button>
          </div>
        </div>

        <!-- Middle: 4 Quick Action Super Hubs -->
        <div class="anime-quick-actions-grid">
          <div class="anime-hub-card" onclick="ModalsComponent.openAiQuizGeneratorModal()">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #a855f7, #6366f1);">
              <i class="fa-solid fa-brain"></i>
            </div>
            <div>
              <h4 class="anime-hub-title">AI Quiz & Exam Maker</h4>
              <p class="anime-hub-sub">បង្កើតសំណួរពហុជ្រើសរើសតាមមេរៀន</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="typeof AiLessonSlidesService !== 'undefined' ? AiLessonSlidesService.openModal() : App.showToast('កំពុងបើក...', 'info')">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #06b6d4, #3b82f6);">
              <i class="fa-solid fa-presentation-screen"></i>
            </div>
            <div>
              <h4 class="anime-hub-title">AI Lesson Slides & A4</h4>
              <p class="anime-hub-sub">បញ្ចាំងស្លាយ & បោះពុម្ពកិច្ចតែងការ A4</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="typeof LiveQuizArenaService !== 'undefined' ? LiveQuizArenaService.openModal() : App.showToast('កំពុងបើក...', 'info')">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #ec4899, #f43f5e);">
              <i class="fa-solid fa-gamepad"></i>
            </div>
            <div>
              <h4 class="anime-hub-title">Live Quiz Arena (Kahoot)</h4>
              <p class="anime-hub-sub">ប្រកួតឆ្លើយសំណួរដណ្តើមពានក្នុងថ្នាក់</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="AnimeAIAssistant.openStudioModal('voice')">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
              <i class="fa-solid fa-waveform-lines"></i>
            </div>
            <div>
              <h4 class="anime-hub-title">Khmer Voice Reader</h4>
              <p class="anime-hub-sub">ជំនួយការអានមេរៀនជាសំឡេង</p>
            </div>
          </div>
        </div>

        <!-- Bottom: Inline Quick Prompt Input -->
        <div class="anime-hero-chat-bar">
          <i class="fa-solid fa-comment-dots" style="color: #c084fc; font-size: 1.1rem;"></i>
          <input type="text" id="animeHeroQuickInput" class="anime-hero-chat-input" 
            placeholder="សួរសំណួរកុំព្យូទ័រ ឬបញ្ជា ម៉ីលីង AI ភ្លាមៗ (ឧ. គន្លឹះបង្រៀន Excel, តែងកិច្ចតែងការ, ដោះស្រាយបញ្ហា)..."
            onkeydown="if(event.key==='Enter') AnimeAIAssistant.handleHeroQuickSubmit()">
          <button type="button" class="btn-anime-send" onclick="AnimeAIAssistant.handleHeroQuickSubmit()">
            <span>សួរ AI</span> <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Handle Hero Inline Input Submit
   */
  handleHeroQuickSubmit() {
    const input = document.getElementById("animeHeroQuickInput");
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = "";
    this.openStudioModal("chat", query);
  },

  /**
   * Open Fullscreen / Windowed Studio Modal
   */
  openStudioModal(tab = "chat", autoQuery = null) {
    this.state.currentTab = tab;
    let modal = document.getElementById("animeStudioModal");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "animeStudioModal";
      modal.className = "anime-studio-modal-overlay";
      modal.innerHTML = `
        <div class="anime-studio-window">
          <!-- Top Header -->
          <div class="anime-studio-header">
            <div class="anime-studio-title-wrap">
              <img src="${this.AVATAR}" alt="${this.NAME}" class="anime-studio-avatar-mini">
              <div>
                <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
                  ${this.NAME}
                  <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 0.7rem; padding: 2px 8px; border-radius: 12px;">
                    <i class="fa-solid fa-bolt"></i> Gemini Flash Active
                  </span>
                </h3>
                <p style="margin: 0; font-size: 0.78rem; color: #94a3b8;">${this.TITLE} • សាលា អន្តរជាតិ ធានស៊ីន</p>
              </div>
            </div>

            <!-- Tab Switcher -->
            <div class="anime-studio-tabs">
              <button type="button" class="anime-studio-tab-btn ${tab === 'chat' ? 'active' : ''}" id="tabBtnAnimeChat" onclick="AnimeAIAssistant.switchModalTab('chat')">
                <i class="fa-solid fa-comments"></i> <span>សន្ទនា AI</span>
              </button>
              <button type="button" class="anime-studio-tab-btn ${tab === 'voice' ? 'active' : ''}" id="tabBtnAnimeVoice" onclick="AnimeAIAssistant.switchModalTab('voice')">
                <i class="fa-solid fa-volume-high"></i> <span>អានជាសំឡេង</span>
              </button>
              <button type="button" class="anime-studio-tab-btn ${tab === 'tools' ? 'active' : ''}" id="tabBtnAnimeTools" onclick="AnimeAIAssistant.switchModalTab('tools')">
                <i class="fa-solid fa-toolbox"></i> <span>ឧបករណ៍បង្រៀន</span>
              </button>
            </div>

            <!-- Close Button -->
            <button type="button" class="anime-studio-close-btn" onclick="AnimeAIAssistant.closeStudioModal()" title="បិទផ្ទាំង">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Body Content -->
          <div class="anime-studio-body" id="animeStudioBody">
            <!-- Dynamic Tab Content Rendered Here -->
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close on escape key
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeStudioModal();
      });
    }

    this.renderCurrentModalTab();
    setTimeout(() => modal.classList.add("active"), 10);

    if (autoQuery) {
      setTimeout(() => this.sendChatMessage(autoQuery), 300);
    }
  },

  /**
   * Close Studio Modal
   */
  closeStudioModal() {
    const modal = document.getElementById("animeStudioModal");
    if (modal) {
      modal.classList.remove("active");
      this.stopSpeaking();
    }
  },

  /**
   * Switch Active Tab in Studio
   */
  switchModalTab(tab) {
    this.state.currentTab = tab;
    document.querySelectorAll(".anime-studio-tab-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`tabBtnAnime${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (activeBtn) activeBtn.classList.add("active");
    this.renderCurrentModalTab();
  },

  /**
   * Render Tab Content
   */
  renderCurrentModalTab() {
    const body = document.getElementById("animeStudioBody");
    if (!body) return;

    if (this.state.currentTab === "chat") {
      body.innerHTML = this.renderChatPanel();
      this.scrollChatToBottom();
    } else if (this.state.currentTab === "voice") {
      body.innerHTML = this.renderVoicePanel();
    } else if (this.state.currentTab === "tools") {
      body.innerHTML = this.renderToolsPanel();
    }
  },

  /**
   * 1. Chat Panel View
   */
  renderChatPanel() {
    const messagesHtml = this.state.messages.map((m, idx) => `
      <div class="anime-msg-row ${m.sender}">
        ${m.sender === "bot" ? `<img src="${this.AVATAR}" class="anime-msg-avatar" alt="${this.NAME}">` : ""}
        <div class="anime-msg-bubble">
          <div>${App.escapeHtml ? App.escapeHtml(m.text).replace(/\n/g, "<br>") : m.text.replace(/\n/g, "<br>")}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 6px; font-size: 0.72rem; color: ${m.sender === 'bot' ? '#94a3b8' : 'rgba(255,255,255,0.7)'};">
            <span>${m.time || ''}</span>
            ${m.sender === 'bot' ? `
              <div style="display: flex; gap: 6px;">
                <button type="button" onclick="AnimeAIAssistant.speakText('${encodeURIComponent(m.text)}')" style="background: transparent; border: none; color: #38bdf8; cursor: pointer; font-size: 0.76rem;" title="អានជាសំឡេង">
                  <i class="fa-solid fa-volume-high"></i> អាន
                </button>
                <button type="button" onclick="AnimeAIAssistant.copyMessage('${encodeURIComponent(m.text)}')" style="background: transparent; border: none; color: #a855f7; cursor: pointer; font-size: 0.76rem;" title="ចម្លងអត្ថបទ">
                  <i class="fa-solid fa-copy"></i>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `).join("");

    return `
      <div class="anime-chat-panel">
        <!-- Messages -->
        <div class="anime-chat-messages" id="animeChatMessagesBox">
          ${messagesHtml}
        </div>

        <!-- Quick Prompts Chips -->
        <div class="anime-quick-prompts">
          <button type="button" class="anime-prompt-chip" onclick="AnimeAIAssistant.sendChatMessage('បង្កើតកិច្ចតែងការបង្រៀន Word 2019 មេរៀន Table')">
            📝 កិច្ចតែងការ Word 2019
          </button>
          <button type="button" class="anime-prompt-chip" onclick="AnimeAIAssistant.sendChatMessage('រៀបចំសំណួរប្រឡងកុំព្យូទ័រ Excel ចំនួន 5 សំណួរ')">
            📊 ៥ សំណួរប្រឡង Excel
          </button>
          <button type="button" class="anime-prompt-chip" onclick="AnimeAIAssistant.sendChatMessage('តើធ្វើដូចម្តេចពេលកុំព្យូទ័រគាំង មិនដើរ?')">
            🛠️ វិធីដោះស្រាយកុំព្យូទ័រគាំង
          </button>
          <button type="button" class="anime-prompt-chip" onclick="AnimeAIAssistant.sendChatMessage('សរសេរលិខិតអញ្ជើញមាតាបិតាសិស្សប្រជុំប្រចាំឆមាស')">
            ✉️ លិខិតអញ្ជើញមាតាបិតា
          </button>
          <button type="button" class="anime-prompt-chip" onclick="AnimeAIAssistant.sendChatMessage('ណែនាំ 5 វិធីទាក់ទាញសិស្សឱ្យចូលចិត្តរៀនកុំព្យូទ័រ')">
            💡 គន្លឹះបង្រៀនកុំព្យូទ័រ
          </button>
        </div>

        <!-- Footer Input -->
        <div class="anime-chat-footer">
          <textarea id="animeModalChatInput" class="anime-chat-textarea" placeholder="សរសេរសំណួរ ឬបញ្ជាកិច្ចការទៅកាន់ ម៉ីលីង AI (ចុច Enter ដើម្បីផ្ញើ)..." rows="1" onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault(); AnimeAIAssistant.handleModalChatSubmit();}"></textarea>
          <button type="button" class="btn-anime-send" onclick="AnimeAIAssistant.handleModalChatSubmit()" style="padding: 12px 18px;">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 2. Voice Audio Reader Studio Panel
   */
  renderVoicePanel() {
    const azureConfigured = typeof AzureTTSService !== "undefined" && AzureTTSService.isAvailable();
    const activeEngine = typeof AzureTTSService !== "undefined" && AzureTTSService.getActiveEngineName ? AzureTTSService.getActiveEngineName() : "Sreymom Khmer Voice";
    const voiceInfo = typeof AzureTTSService !== "undefined" && AzureTTSService.getVoiceInfo ? AzureTTSService.getVoiceInfo() : { name: "ស្រីមុំ (Sreymom)" };

    return `
      <div style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px;">
        <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(236, 72, 153, 0.4); border-radius: 18px; padding: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #ec4899, #f43f5e); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: #fff; box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);">
              <i class="fa-solid fa-microphone-lines"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; color: #fff; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                សម្លេងស្រីមុំ AI (Khmer Voice Reader)
                <span style="background: rgba(236, 72, 153, 0.2); color: #f472b6; font-size: 0.72rem; padding: 3px 10px; border-radius: 10px; font-weight: 700;">
                  <i class="fa-solid fa-sparkles"></i> ${activeEngine}
                </span>
              </h3>
              <p style="margin: 0; font-size: 0.82rem; color: #94a3b8;">
                ${azureConfigured
                  ? 'សម្លេង Azure Neural ១០០% ភាសាខ្មែរ (km-KH-SreymomNeural) — កម្រិត Studio HD ទន់ភ្លន់ រាក់ទាក់'
                  : 'សម្លេងស្រីមុំ ១០០% ភាសាខ្មែរ — ដំណើរការស្វ័យប្រវត្តិដោយឥតគិតថ្លៃ (អាចបន្ថែម Azure Key ក្នុង Settings)'
                }
              </p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span style="font-size: 0.82rem; color: #cbd5e1;">សម្លេង៖</span>
            <select id="selectAzureVoiceInPanel" class="form-control" style="width: 170px; height: 36px; font-size: 0.82rem; background: rgba(15,23,42,0.8); color: #fff; border-color: rgba(236,72,153,0.4);" onchange="AnimeAIAssistant._updateVoiceChoice(this.value)">
              <option value="km-KH-SreymomNeural" ${(!azureConfigured || AzureTTSService.getConfig().voice === 'km-KH-SreymomNeural') ? 'selected' : ''}>🎀 ស្រីមុំ (Sreymom)</option>
              <option value="km-KH-PisethNeural" ${(azureConfigured && AzureTTSService.getConfig().voice === 'km-KH-PisethNeural') ? 'selected' : ''}>👨 ពិសិដ្ឋ (Piseth)</option>
            </select>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <label style="font-weight: 700; font-size: 0.9rem; color: #e2e8f0; display: flex; justify-content: space-between;">
            <span><i class="fa-solid fa-file-lines" style="color: #f472b6;"></i> បញ្ចូល ឬចម្លងអត្ថបទដែលចង់ឱ្យ AI អាន៖</span>
            <span id="voiceEqualizerVisualizer" style="display: none;">
              <span class="anime-voice-wave">
                <span class="anime-wave-bar"></span>
                <span class="anime-wave-bar"></span>
                <span class="anime-wave-bar"></span>
                <span class="anime-wave-bar"></span>
              </span>
              <span style="color: #f472b6; font-size: 0.8rem; font-weight: 700; margin-left: 6px;">🎀 ស្រីមុំកំពុងអាន...</span>
            </span>
          </label>
          <textarea id="inputVoiceText" class="form-control" style="height: 180px; font-size: 0.95rem; line-height: 1.7; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(236, 72, 153, 0.35); border-radius: 14px; color: #fff; padding: 14px;" placeholder="វាយបញ្ចូលអត្ថបទជាភាសាខ្មែរ ឬអង់គ្លេសនៅទីនេះ...">សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! សូមស្វាគមន៍មកកាន់បន្ទប់កុំព្យូទ័រនៃសាលា អន្តរជាតិ ធានស៊ីន។ ថ្ងៃនេះយើងនឹងសិក្សាអំពីមេរៀនមូលដ្ឋានគ្រឹះនៃកុំព្យូទ័រ និងការប្រើប្រាស់ក្តារចុចយូនីកូដ ១០ ម្រាមដៃ។</textarea>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button type="button" class="btn-primary" onclick="AnimeAIAssistant.speakInputText()" style="background: linear-gradient(135deg, #ec4899, #f43f5e); border: none; padding: 12px 24px; font-weight: 800; font-size: 0.9rem; border-radius: 12px; box-shadow: 0 4px 18px rgba(236, 72, 153, 0.4);">
            <i class="fa-solid fa-play"></i> <span>🎀 ស្រីមុំអានជាសំឡេង</span>
          </button>
          <button type="button" class="btn-secondary" onclick="AnimeAIAssistant.stopSpeaking()" style="border-color: #ef4444; color: #ef4444; padding: 12px 20px; font-weight: 700; font-size: 0.9rem; border-radius: 12px;">
            <i class="fa-solid fa-stop"></i> <span>បញ្ឈប់សំឡេង</span>
          </button>
          <button type="button" class="btn-secondary" onclick="AnimeAIAssistant.loadSampleLessonText()" style="padding: 12px 18px; font-size: 0.85rem; border-radius: 12px; color: #cbd5e1;">
            <i class="fa-solid fa-book-open"></i> ដាក់អត្ថបទគំរូមេរៀន
          </button>
          <button type="button" class="btn-secondary" onclick="AnimeAIAssistant.openVoiceConfigModal()" style="padding: 12px 18px; font-size: 0.85rem; border-radius: 12px; color: #ec4899; border-color: rgba(236, 72, 153, 0.35);" title="បើកការកំណត់ Azure Key">
            <i class="fa-solid fa-gear"></i> ការកំណត់ Azure Key
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 3. EdTech Tools Directory Panel
   */
  renderToolsPanel() {
    return `
      <div style="flex: 1; padding: 24px; overflow-y: auto;">
        <h4 style="margin: 0 0 16px 0; font-size: 1.05rem; color: #fff; font-weight: 800; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-cubes-stacked" style="color: #c084fc;"></i>
          ឧបករណ៍បង្រៀនទំនើបទាំង ១០ របស់សាលា (EdTech Super Suite)
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          <div class="anime-hub-card" onclick="AnimeAIAssistant.closeStudioModal(); ModalsComponent.openAiQuizGeneratorModal();">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #a855f7, #6366f1);"><i class="fa-solid fa-brain"></i></div>
            <div>
              <h4 class="anime-hub-title">AI Quiz Generator</h4>
              <p class="anime-hub-sub">បង្កើតសំណួរប្រឡងស្វ័យប្រវត្តិតាមសៀវភៅ</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="AnimeAIAssistant.closeStudioModal(); if(typeof AiLessonSlidesService !== 'undefined') AiLessonSlidesService.openModal();">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #06b6d4, #3b82f6);"><i class="fa-solid fa-presentation-screen"></i></div>
            <div>
              <h4 class="anime-hub-title">AI Lesson Slide Projector</h4>
              <p class="anime-hub-sub">បញ្ចាំងស្លាយពេញអេក្រង់ & កិច្ចតែងការ A4</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="AnimeAIAssistant.closeStudioModal(); if(typeof LiveQuizArenaService !== 'undefined') LiveQuizArenaService.openModal();">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #ec4899, #f43f5e);"><i class="fa-solid fa-gamepad"></i></div>
            <div>
              <h4 class="anime-hub-title">Live Quiz Arena</h4>
              <p class="anime-hub-sub">Kahoot-style ប្រកួតឆ្លើយសំណួរដណ្តើមពាន</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="AnimeAIAssistant.closeStudioModal(); if(typeof ShortcutTrainerService !== 'undefined') ShortcutTrainerService.openModal();">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #10b981, #059669);"><i class="fa-solid fa-keyboard"></i></div>
            <div>
              <h4 class="anime-hub-title">Shortcut Trainer</h4>
              <p class="anime-hub-sub">ហ្វឹកហាត់ក្តារចុចកាត់ Neon QWERTY</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="AnimeAIAssistant.closeStudioModal(); if(typeof ExcelSandboxService !== 'undefined') ExcelSandboxService.openModal();">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #107c41, #15803d);"><i class="fa-solid fa-table"></i></div>
            <div>
              <h4 class="anime-hub-title">Excel Formula Sandbox</h4>
              <p class="anime-hub-sub">ផ្ទាំងអនុវត្តរូបមន្ត Excel និងកែស្វ័យប្រវត្តិ</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="AnimeAIAssistant.closeStudioModal(); if(typeof TeacherToolsService !== 'undefined') TeacherToolsService.openTypingSpeedModal();">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);"><i class="fa-solid fa-gauge-high"></i></div>
            <div>
              <h4 class="anime-hub-title">Typing Master</h4>
              <p class="anime-hub-sub">តេស្តល្បឿនវាយអត្ថបទខ្មែរ-អង់គ្លេស WPM</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="AnimeAIAssistant.closeStudioModal(); if(typeof TeacherToolsService !== 'undefined') TeacherToolsService.openCodeSandboxModal();">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);"><i class="fa-solid fa-code"></i></div>
            <div>
              <h4 class="anime-hub-title">Web Code Sandbox</h4>
              <p class="anime-hub-sub">រៀនសរសេរ HTML/CSS/JS Live Preview</p>
            </div>
          </div>

          <div class="anime-hub-card" onclick="AnimeAIAssistant.closeStudioModal(); ModalsComponent.openAiStudentInsightModal();">
            <div class="anime-hub-icon" style="background: linear-gradient(135deg, #0ea5e9, #0284c7);"><i class="fa-solid fa-chart-line-up"></i></div>
            <div>
              <h4 class="anime-hub-title">AI Student Diagnostics</h4>
              <p class="anime-hub-sub">វិភាគសិស្សខ្សោយ & ទប់ស្កាត់ការបោះបង់</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Handle Chat Submission in Studio Modal
   */
  async handleModalChatSubmit() {
    const input = document.getElementById("animeModalChatInput");
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = "";
    await this.sendChatMessage(query);
  },

  /**
   * Send Message to Gemini AI Engine
   */
  async sendChatMessage(text) {
    if (!text || !text.trim()) return;

    // 1. Add User Message
    this.state.messages.push({
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString("km-KH", { hour: "2-digit", minute: "2-digit" })
    });

    this.renderCurrentModalTab();
    this.scrollChatToBottom();

    // 2. Add Temporary Thinking Bot Bubble
    const thinkingId = "msg_thinking_" + Date.now();
    this.state.messages.push({
      id: thinkingId,
      sender: "bot",
      text: "⚡ ម៉ីលីង កំពុងគិត និងវិភាគតាមរយៈ Gemini AI...",
      time: ""
    });
    this.renderCurrentModalTab();
    this.scrollChatToBottom();

    // 3. System Prompt for Mei-Ling Persona
    const systemPrompt = `អ្នកគឺឈ្មោះ «ម៉ីលីង AI (Mei-Ling)» ជាជំនួយការឆ្លាតវៃ AI (Anime AI Companion) ប្រចាំសាលា អន្តរជាតិ ធានស៊ីន (Tian Xin International School - TIS Lab Computer)។
ចរិតលក្ខណៈ៖ ឆ្លាតវៃ រួសរាយ រហ័សរហួន គួរសម ប្រើពាក្យសម្តីកក់ក្តៅ បែប Anime Assistant និងមានចំណេះដឹងជ្រៅជ្រៅផ្នែកកុំព្យូទ័រ (សៀវភៅមូលដ្ឋាន ១២០ ទំព័រ, Windows 10, Word 2019, Excel, PowerPoint, Typing ខ្មែរ-អង់គ្លេស, Hardware) និងកិច្ចការគ្រប់គ្រងសាលារៀន។
ចូរសរសេរឆ្លើយជាភាសាខ្មែរឱ្យបានត្រឹមត្រូវ ក្បោះក្បាយ ច្បាស់លាស់ និងមានរបៀប។
សំណួរពីលោកគ្រូ/សិស្ស៖ "${text}"`;

    try {
      let replyText = "";
      if (typeof GeminiAIService !== "undefined" && GeminiAIService.generateText) {
        replyText = await GeminiAIService.generateText(systemPrompt);
      } else {
        replyText = "សូមអភ័យទោសលោកគ្រូ! GeminiAIService មិនទាន់ត្រូវបានតភ្ជាប់។";
      }

      // Replace thinking message with real reply
      const idx = this.state.messages.findIndex(m => m.id === thinkingId);
      if (idx !== -1) {
        this.state.messages[idx] = {
          sender: "bot",
          text: replyText,
          time: new Date().toLocaleTimeString("km-KH", { hour: "2-digit", minute: "2-digit" })
        };
      }

      this.renderCurrentModalTab();
      this.scrollChatToBottom();

    } catch (err) {
      const idx = this.state.messages.findIndex(m => m.id === thinkingId);
      if (idx !== -1) {
        this.state.messages[idx] = {
          sender: "bot",
          text: "⚠️ បញ្ហាក្នុងការតភ្ជាប់ Gemini AI: " + (err.message || "Unknown error") + "។ សូមពិនិត្យការកំណត់ API Key។",
          time: new Date().toLocaleTimeString("km-KH", { hour: "2-digit", minute: "2-digit" })
        };
      }
      this.renderCurrentModalTab();
    }
  },

  /**
   * Scroll chat to the newest message
   */
  scrollChatToBottom() {
    const box = document.getElementById("animeChatMessagesBox");
    if (box) {
      setTimeout(() => { box.scrollTop = box.scrollHeight; }, 50);
    }
  },

  /**
   * Copy Message Content
   */
  copyMessage(encodedText) {
    const text = decodeURIComponent(encodedText);
    navigator.clipboard.writeText(text).then(() => {
      App.showToast("បានចម្លងអត្ថបទជោគជ័យ!", "success");
    }).catch(() => {
      App.showToast("មិនអាចចម្លងបាន", "error");
    });
  },

  /**
   * Update voice choice from panel dropdown
   */
  _updateVoiceChoice(voiceName) {
    if (typeof AzureTTSService !== "undefined") {
      AzureTTSService.saveConfig({ voice: voiceName });
    }
  },

  /**
   * Text-to-Speech Engine — Azure Neural TTS (ស្រីមុំ SreymomNeural) primary, Browser TTS fallback
   */
  speakText(rawText) {
    const text = typeof rawText === "string" ? decodeURIComponent(rawText) : "";
    if (!text) {
      App.showToast("មិនមានអត្ថបទដែលត្រូវអាន", "warning");
      return;
    }

    this.stopSpeaking();

    const onSpeakStart = () => {
      this.state.isSpeaking = true;
      const viz = document.getElementById("voiceEqualizerVisualizer");
      if (viz) viz.style.display = "inline-flex";
      const btn = document.getElementById("btnHeroVoiceSpeak");
      if (btn) btn.classList.add("speaking");
    };

    const onSpeakEnd = () => {
      this.state.isSpeaking = false;
      const viz = document.getElementById("voiceEqualizerVisualizer");
      if (viz) viz.style.display = "none";
      const btn = document.getElementById("btnHeroVoiceSpeak");
      if (btn) btn.classList.remove("speaking");
    };

    // === PRIMARY: Use AzureTTSService (Smart Multi-Tier: Azure Neural -> Edge Sreymom -> Google Khmer Audio) ===
    if (typeof AzureTTSService !== "undefined") {
      AzureTTSService.speakLong(text, {
        onStart: onSpeakStart,
        onEnd: onSpeakEnd,
        onError: (err) => {
          console.warn("[AnimeAI] TTS error, falling back:", err);
          onSpeakEnd();
          this._browserTTSFallback(text, onSpeakStart, onSpeakEnd);
        }
      }).catch(err => {
        console.warn("[AnimeAI] TTS promise error:", err);
        onSpeakEnd();
        this._browserTTSFallback(text, onSpeakStart, onSpeakEnd);
      });
      return;
    }

    // === FALLBACK: Browser SpeechSynthesis ===
    this._browserTTSFallback(text, onSpeakStart, onSpeakEnd);
  },

  /**
   * Open Azure TTS Configuration in Settings
   */
  openVoiceConfigModal() {
    this.closeStudioModal();
    if (typeof App !== "undefined" && App.navigateTo) {
      App.navigateTo("settings");
      setTimeout(() => {
        const el = document.getElementById("inputAzureTtsKey");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }, 350);
    }
  },

  /**
   * Browser SpeechSynthesis fallback (used when Azure TTS is not configured)
   */
  _browserTTSFallback(text, onStart, onEnd) {
    if (!("speechSynthesis" in window)) {
      App.showToast("កម្មវិធីរុករកមិនគាំទ្រការបញ្ចេញសំឡេង — សូមកំណត់ Azure TTS Key ក្នុង Settings", "warning");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.state.speechRate || 1.0;
    utterance.pitch = 1.1;

    // Try to find a female Khmer voice
    const voices = window.speechSynthesis.getVoices();
    const khmerFemale = voices.find(v =>
      (v.lang.includes("km") || v.lang.includes("kh")) &&
      (v.name.toLowerCase().includes("female") || v.name.includes("ស្រី"))
    );
    const khmerAny = voices.find(v => v.lang.includes("km") || v.lang.includes("kh"));
    if (khmerFemale) {
      utterance.voice = khmerFemale;
      utterance.lang = "km-KH";
    } else if (khmerAny) {
      utterance.voice = khmerAny;
      utterance.lang = "km-KH";
    }

    utterance.onstart = onStart;
    utterance.onend = utterance.onerror = onEnd;

    this.state.speechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  },

  /**
   * Speak Text in the Voice Panel Input
   */
  speakInputText() {
    const textarea = document.getElementById("inputVoiceText");
    if (!textarea || !textarea.value.trim()) {
      App.showToast("សូមបញ្ចូលអត្ថបទដែលចង់ឱ្យអាន!", "warning");
      return;
    }
    this.speakText(encodeURIComponent(textarea.value.trim()));
  },

  /**
   * Stop Speaking — stops both Azure TTS and Browser TTS
   */
  stopSpeaking() {
    // Stop Azure TTS
    if (typeof AzureTTSService !== "undefined" && AzureTTSService.stop) {
      AzureTTSService.stop();
    }
    // Stop Browser TTS
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.state.isSpeaking = false;
    const viz = document.getElementById("voiceEqualizerVisualizer");
    if (viz) viz.style.display = "none";
    const btn = document.getElementById("btnHeroVoiceSpeak");
    if (btn) btn.classList.remove("speaking");
  },

  /**
   * Toggle Voice Greeting on Dashboard Hero
   */
  toggleVoiceGreeting() {
    if (this.state.isSpeaking) {
      this.stopSpeaking();
    } else {
      const greeting = "សួស្តីលោកគ្រូ និងប្អូនៗសិស្សានុសិស្សទាំងអស់គ្នា! ខ្ញុំគឺ ម៉ីលីង ជំនួយការឆ្លាតវៃ AI ប្រចាំសាលា អន្តរជាតិ ធានស៊ីន។ ថ្ងៃនេះខ្ញុំត្រៀមខ្លួនរួចជាស្រេចដើម្បីជួយលោកគ្រូ ក្នុងការរៀបចំស្លាយបង្រៀន និងកិច្ចការសាលា!";
      this.speakText(encodeURIComponent(greeting));
    }
  },

  /**
   * Load Sample Lesson Text
   */
  loadSampleLessonText() {
    const textarea = document.getElementById("inputVoiceText");
    if (textarea) {
      textarea.value = `មេរៀនទី ១៖ មូលដ្ឋានគ្រឹះនៃកុំព្យូទ័រ
កុំព្យូទ័រ គឺជាឧបករណ៍អេឡិចត្រូនិចមួយប្រភេទ ដែលមានសមត្ថភាពទទួលយកទិន្នន័យ (Input) ធ្វើការគណនានិងដំណើរការទិន្នន័យ (Process) និងផ្តល់នូវលទ្ធផលព័ត៌មានត្រឡប់មកវិញ (Output)។
ផ្នែករឹងកុំព្យូទ័រ (Hardware) រួមមាន៖
១. System Unit (CPU, RAM, Motherboard, Power Supply)
២. Monitor (អេក្រង់បង្ហាញរូបភាព)
៣. Keyboard & Mouse (ក្តារចុច និងកណ្តុរសម្រាប់បញ្ជា)`;
    }
  },

  /**
   * Keyboard shortcut (Ctrl + Space or Alt + A) to open Anime Assistant
   */
  bindGlobalShortcuts() {
    document.addEventListener("keydown", (e) => {
      if ((e.altKey && e.key.toLowerCase() === "a") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a")) {
        e.preventDefault();
        this.openStudioModal();
      }
    });
  }
};

// Auto initialize on load
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    AnimeAIAssistant.init();
  });
}

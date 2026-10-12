/**
 * ==========================================================================
 * Service: AITutor (AI ជំនួយការមេរៀនកុំព្យូទ័រ ២៤ ម៉ោង)
 * Powered by Google Gemini 3.8 Flash AI
 * Answers student questions 24/7 strictly citing the school's 120-page textbook!
 * ==========================================================================
 */

const AITutor = {
  chatHistory: [
    {
      role: "model",
      text: "សួស្តីប្អូន! ខ្ញុំគឺជា AI ជំនួយការមេរៀនកុំព្យូទ័រប្រចាំសាលា អន្តរជាតិ ធានស៊ីន (TIS Lab Computer)។ ប្អូនមានចម្ងល់ ឬមិនទាន់យល់ចំណុចណាមួយក្នុងសៀវភៅមូលដ្ឋាន ១២០ ទំព័រ (Windows, Typing, Word, Excel, PowerPoint) អាចសួរខ្ញុំបានគ្រប់ពេល ២៤ ម៉ោង!"
    }
  ],

  openChatModal() {
    this.ensureModalInDOM();
    this.renderChatModal();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("aiTutorModal");
    } else {
      const el = document.getElementById("aiTutorModal");
      if (el) el.style.display = "flex";
    }
  },

  closeChatModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("aiTutorModal");
    } else {
      const el = document.getElementById("aiTutorModal");
      if (el) el.style.display = "none";
    }
  },

  ensureModalInDOM() {
    let modal = document.getElementById("aiTutorModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "aiTutorModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10820";
      document.body.appendChild(modal);
    }
  },

  renderChatModal() {
    const modal = document.getElementById("aiTutorModal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 680px; width: 95%; height: 86vh; background: #0f172a; border-radius: 20px; border: 1.5px solid #38bdf8; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); overflow: hidden; display: flex; flex-direction: column; padding: 0;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0c4a6e, #0284c7); border-bottom: 2px solid #38bdf8; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(56, 189, 248, 0.25); border: 1.5px solid #38bdf8; display: flex; align-items: center; justify-content: center; color: #bae6fd; font-size: 1.35rem;">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
                <span>AI ជំនួយការមេរៀនកុំព្យូទ័រ ២៤ ម៉ោង</span>
                <span class="badge" style="background: #10b981; color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px;">Online 24/7</span>
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.76rem; color: #e0f2fe;">
                ឆ្លើយតបចម្ងល់តាមសៀវភៅមូលដ្ឋាន ១២០ ទំព័រ (TIS Lab Computer)
              </p>
            </div>
          </div>
          <button type="button" onclick="AITutor.closeChatModal()" style="background: rgba(255, 255, 255, 0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Quick Question Chips -->
        <div style="background: #1e293b; border-bottom: 1px solid #334155; padding: 10px 16px; display: flex; gap: 8px; overflow-x: auto; white-space: nowrap;">
          <button type="button" onclick="AITutor.askQuickQuestion('តើត្រូវកំណត់ Margins A4 ក្នុង Word យ៉ាងដូចម្តេច?')" class="btn-paper-filter" style="height: 30px; font-size: 0.75rem; padding: 0 12px;">
            📄 កំណត់ Margins Word A4
          </button>
          <button type="button" onclick="AITutor.askQuickQuestion('តើក្បួនវាយជើងអក្សរព្យញ្ជនៈខ្មែរត្រូវចុចគ្រាប់ចុចណា?')" class="btn-paper-filter" style="height: 30px; font-size: 0.75rem; padding: 0 12px;">
            ⌨️ ជើងអក្សរខ្មែរ (គ្រាប់ j)
          </button>
          <button type="button" onclick="AITutor.askQuickQuestion('សូមពន្យល់ពីរបៀបប្រើរូបមន្ត IF និង SUMIF ក្នុង Excel')" class="btn-paper-filter" style="height: 30px; font-size: 0.75rem; padding: 0 12px;">
            📊 រូបមន្ត IF & SUMIF Excel
          </button>
          <button type="button" onclick="AITutor.askQuickQuestion('តើ Shortcut បញ្ចាំងស្លាយ PowerPoint ពីស្លាយបច្ចុប្បន្នចុចអ្វី?')" class="btn-paper-filter" style="height: 30px; font-size: 0.75rem; padding: 0 12px;">
            📽️ Shortcut PowerPoint
          </button>
        </div>

        <!-- Message Bubbles Scroll Area -->
        <div id="aiTutorMessagesArea" style="flex: 1; overflow-y: auto; padding: 18px 20px; display: flex; flex-direction: column; gap: 14px;">
          ${this.renderMessageBubbles()}
        </div>

        <!-- Chat Input Bar -->
        <div style="background: #0f172a; border-top: 1px solid #334155; padding: 12px 18px; display: flex; gap: 10px; align-items: center;">
          <input type="text" id="aiTutorInput" onkeydown="if(event.key==='Enter') AITutor.sendMessage()" placeholder="សួរចម្ងល់មេរៀននៅទីនេះ (ឧ. រូបមន្ត Average, ក្បួនម្រាមដៃ)..." style="flex: 1; height: 42px; padding: 0 16px; background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; border-radius: 24px; color: #fff; font-size: 0.88rem;">
          <button type="button" id="btnSendAiTutor" onclick="AITutor.sendMessage()" class="btn-primary" style="width: 44px; height: 42px; border-radius: 50%; background: #0284c7; border: none; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1rem; cursor: pointer; flex-shrink: 0;">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;

    this.scrollToBottom();
  },

  renderMessageBubbles() {
    return this.chatHistory.map(msg => {
      const isUser = msg.role === "user";
      return `
        <div style="display: flex; gap: 10px; align-items: flex-start; justify-content: ${isUser ? 'flex-end' : 'flex-start'};">
          ${!isUser ? `
            <div style="width: 34px; height: 34px; border-radius: 10px; background: #0284c7; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.9rem; flex-shrink: 0;">
              <i class="fa-solid fa-robot"></i>
            </div>
          ` : ''}

          <div style="max-width: 82%; background: ${isUser ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'rgba(30, 41, 59, 0.9)'}; border: 1px solid ${isUser ? '#38bdf8' : '#334155'}; border-radius: ${isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'}; padding: 12px 16px; color: #fff; font-size: 0.88rem; line-height: 1.6; white-space: pre-line;">
            ${msg.text}
          </div>

          ${isUser ? `
            <div style="width: 34px; height: 34px; border-radius: 10px; background: #8b5cf6; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.9rem; flex-shrink: 0;">
              <i class="fa-solid fa-user-graduate"></i>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");
  },

  scrollToBottom() {
    setTimeout(() => {
      const area = document.getElementById("aiTutorMessagesArea");
      if (area) area.scrollTop = area.scrollHeight;
    }, 50);
  },

  askQuickQuestion(q) {
    const input = document.getElementById("aiTutorInput");
    if (input) {
      input.value = q;
      this.sendMessage();
    }
  },

  async sendMessage() {
    const input = document.getElementById("aiTutorInput");
    const text = input ? input.value.trim() : "";
    if (!text) return;

    input.value = "";
    this.chatHistory.push({ role: "user", text: text });
    this.updateMessagesUI();

    const sendBtn = document.getElementById("btnSendAiTutor");
    if (sendBtn) sendBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;

    // System prompt for Gemini AI
    const systemPrompt = `
You are the 24/7 Senior AI Computer Science Tutor at Tian Xin International School (សាលា អន្តរជាតិ ធានស៊ីន - TIS LAB COMPUTER) in Cambodia.
Answer the student's question based STRICTLY and AUTHENTICALLY on the official 120-page textbook: «សៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័ររដ្ឋបាល & IT (Windows 10, Typing, Word, Excel, PowerPoint 2019)».

CRITICAL TEACHING RULES:
1. Always respond in polite, encouraging, and warm Khmer language.
2. Provide concise, crystal-clear step-by-step instructions.
3. Explicitly cite the textbook chapter and page numbers (e.g. "យោងតាមសៀវភៅមូលដ្ឋាន មេរៀនទី ៤ (ទំព័រ ២៣-៥៦)").
4. Mention keyboard shortcuts in bold (e.g. **Ctrl + S**, **F4**, **Ctrl + M**).
5. Encourage the student to practice directly on their computer.
    `.trim();

    const fullPrompt = `${systemPrompt}\n\nStudent Question: ${text}`;
    let reply = "";

    const apiKey = typeof GeminiAIService !== "undefined" ? GeminiAIService.getApiKey() : null;
    if (apiKey) {
      try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }]
          })
        });

        if (resp.ok) {
          const resData = await resp.json();
          reply = resData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (e) {
        console.warn("Gemini Tutor call failed:", e);
      }
    }

    if (!reply) {
      reply = this._fallbackTutorResponse(text);
    }

    this.chatHistory.push({ role: "model", text: reply });
    this.updateMessagesUI();

    if (sendBtn) sendBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`;
  },

  updateMessagesUI() {
    const area = document.getElementById("aiTutorMessagesArea");
    if (area) {
      area.innerHTML = this.renderMessageBubbles();
      this.scrollToBottom();
    }
  },

  _fallbackTutorResponse(query) {
    const q = query.toLowerCase();
    if (q.includes("margin") || q.includes("រឹម")) {
      return "យោងតាមសៀវភៅមូលដ្ឋាន មេរៀនទី ៤ (ទំព័រ ២៤ & ៤៥)៖\nដើម្បីកំណត់រឹមទំព័រ (Margins) តាមស្តង់ដារលិខិតរដ្ឋបាលជាតិកម្ពុជា៖\n1. ចូល Tab Layout ➔ Margins ➔ Custom Margins\n2. កំណត់ Top: 2.5cm, Bottom: 2.5cm, Left: 2.5cm, Right: 2.0cm\n3. ចុច OK ដើម្បីបញ្ចប់។";
    } else if (q.includes("ជើង") || q.includes("typing") || q.includes("j")) {
      return "យោងតាមសៀវភៅមូលដ្ឋាន មេរៀនទី ៣ (ទំព័រ ២០-២២)៖\nក្នុងការវាយអក្សរយូនីកូដខ្មែរ (Khmer Unicode) ដើម្បីបង្កើតជើងព្យញ្ជនៈ ត្រូវចុចគ្រាប់ចុចអក្សរ **j** (Subscript key) ជានិច្ច។\nឧទាហរណ៍៖ ពាក្យ «ក្ដារ» = ក + j + ដ + ា + រ។";
    } else if (q.includes("if") || q.includes("sumif") || q.includes("excel")) {
      return "យោងតាមសៀវភៅមូលដ្ឋាន មេរៀនទី ៦ (ទំព័រ ៩៤-៩៨)៖\n• រូបមន្ត IF៖ `=IF(លក្ខខណ្ឌ, ចម្លើយពិត, ចម្លើយមិនពិត)`\n  ឧទាហរណ៍៖ `=IF(E2>=50, \"ជាប់\", \"ធ្លាក់\")`\n• រូបមន្ត SUMIF៖ `=SUMIF(ចន្លោះលក្ខខណ្ឌ, លក្ខខណ្ឌ, ចន្លោះបូកសរុប)` សម្រាប់បូកសរុបតែទិន្នន័យដែលត្រូវនឹងលក្ខខណ្ឌ។";
    } else {
      return "សំណួរល្អណាស់ប្អូន! ចំណុចនេះមាននៅក្នុងសៀវភៅមូលដ្ឋានគ្រឹះកុំព្យូទ័ររដ្ឋបាល & IT (១២០ ទំព័រ) របស់សាលា។ ប្អូនអាចអនុវត្តតាមជំហានក្នុងសៀវភៅ ឬសាកល្បងលើកុំព្យូទ័រផ្ទាល់។ ប្រសិនបើមានចម្ងល់បន្ថែម ប្អូនអាចសួរខ្ញុំបានជានិច្ច!";
    }
  }
};

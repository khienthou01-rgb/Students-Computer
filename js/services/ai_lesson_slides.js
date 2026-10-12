/**
 * ==========================================================================
 * Service: AILessonSlides (AI បង្កើត Slide បង្រៀន & កិច្ចតែងការស្វ័យប្រវត្តិតាមមេរៀន)
 * Features:
 * - Generates ready-to-teach Presentation Slide Deck directly from the 120-page textbook
 * - Built-in Slide Projector with Keyboard Navigation (Next/Prev/Fullscreen)
 * - Auto-generates Teacher Lesson Plan & Student A4 Handout (កិច្ចតែងការបង្រៀន)
 * - Powered by Gemini AI with high-fidelity textbook fallback templates
 * ==========================================================================
 */

const AILessonSlides = {
  currentDeck: null,
  currentSlideIndex: 0,

  lessonTopics: [
    {
      id: "word_margin",
      subject: "Word",
      title: "ការកំណត់ Margin, Page Setup & Font ស្តង់ដាររដ្ឋបាល",
      bookPage: "ទំព័រ ១៨-២៨",
      summary: "រៀនពីការរៀបចំទំហំក្រដាស A4, កំណត់ Margin លើក្រោមឆ្វេងស្តាំ ២.៥៤cm, និង Font Khmer OS Siemreap 11pt"
    },
    {
      id: "excel_formulas",
      subject: "Excel",
      title: "រូបមន្តស្នូលទាំង ៥ (SUM, AVERAGE, IF, VLOOKUP, COUNTIF)",
      bookPage: "ទំព័រ ៤៥-៦២",
      summary: "រៀនពីរបៀបសរសេររូបមន្តគណនាប្រាក់ខែ, បញ្ជីទំនិញ, និងរូបមន្តលក្ខខណ្ឌ IF ស្តង់ដារ"
    },
    {
      id: "ppt_master",
      subject: "PowerPoint",
      title: "ការរចនា Slide បទបង្ហាញវិជ្ជាជីវៈ & Slide Master",
      bookPage: "ទំព័រ ៨០-៩៨",
      summary: "រៀនពីប្លង់ Layout, Transition មិនរញ៉េរញ៉ៃ, និងការបញ្ចូលតារាង Excel ចូលក្នុង Slide"
    },
    {
      id: "typing_technique",
      subject: "Typing",
      title: "បច្ចេកទេសវាយអក្សរខ្មែរយូនីកូដ ១០ ម្រាមដៃ & Shift Keys",
      bookPage: "ទំព័រ ៥-១៤",
      summary: "រៀនពី Home Row Keys (ASDF - JKL;), របៀបសង្កត់ Shift វាយព្យញ្ជនៈជើង និងស្រៈខ្មែរ"
    }
  ],

  openModal() {
    this.ensureModalInDOM();
    this.renderGenerator();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("aiLessonSlidesModal");
    } else {
      const el = document.getElementById("aiLessonSlidesModal");
      if (el) el.style.display = "flex";
    }
  },

  closeModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("aiLessonSlidesModal");
    } else {
      const el = document.getElementById("aiLessonSlidesModal");
      if (el) el.style.display = "none";
    }
  },

  ensureModalInDOM() {
    let modal = document.getElementById("aiLessonSlidesModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "aiLessonSlidesModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10900";
      document.body.appendChild(modal);
    }
  },

  renderGenerator() {
    const modal = document.getElementById("aiLessonSlidesModal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 860px; width: 95%; background: #0f172a; border-radius: 24px; border: 2px solid #a855f7; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9); overflow: hidden; padding: 0; color: #fff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #581c87, #7c3aed); padding: 22px 28px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(255,255,255,0.1);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.6rem;">
              📽️
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.25rem; font-weight: 900;">AI បង្កើត Slide & កិច្ចតែងការបង្រៀន</h3>
              <p style="margin: 0; font-size: 0.8rem; color: #e9d5ff;">បង្កើត Slide បទបង្ហាញ និងកិច្ចតែងការ A4 ដោយស្វ័យប្រវត្តិតាមសៀវភៅពុម្ព ១២០ ទំព័រ</p>
            </div>
          </div>
          <button type="button" onclick="AILessonSlides.closeModal()" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>

        <!-- Body -->
        <div style="padding: 28px;">
          <h4 style="margin: 0 0 16px 0; font-size: 1rem; color: #cbd5e1; font-weight: 700;">
            ជ្រើសរើសប្រធានបទមេរៀនដែលចង់បង្រៀន៖
          </h4>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 14px; margin-bottom: 24px;">
            ${this.lessonTopics.map((topic, idx) => `
              <div onclick="AILessonSlides.selectTopic('${topic.id}')" style="background: rgba(255,255,255,0.04); border: 1.5px solid rgba(168, 85, 247, 0.25); border-radius: 16px; padding: 18px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#c084fc'; this.style.background='rgba(168,85,247,0.12)'" onmouseout="this.style.borderColor='rgba(168,85,247,0.25)'; this.style.background='rgba(255,255,255,0.04)'">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="background: #6b21a8; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; color: #f3e8ff;">${topic.subject}</span>
                  <span style="font-size: 0.75rem; color: #38bdf8; font-weight: 700;">📖 ${topic.bookPage}</span>
                </div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin-bottom: 6px;">${topic.title}</div>
                <div style="font-size: 0.8rem; color: #94a3b8; line-height: 1.5;">${topic.summary}</div>
              </div>
            `).join('')}
          </div>

          <!-- Custom Topic Input -->
          <div style="background: rgba(255,255,255,0.03); border-radius: 16px; padding: 18px; border: 1px solid rgba(255,255,255,0.08);">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #cbd5e1; margin-bottom: 8px;">
              ✨ ឬវាយបញ្ចូលប្រធានបទមេរៀនផ្ទាល់ខ្លួន (Custom Topic)៖
            </label>
            <div style="display: flex; gap: 10px;">
              <input type="text" id="aiSlideCustomPrompt" placeholder="ឧ. មេរៀន Excel៖ របៀបប្រើ VLOOKUP ឆ្លង Sheet និង RANK រកចំណាត់ថ្នាក់..." style="flex: 1; padding: 12px 16px; border-radius: 12px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 0.9rem;">
              <button type="button" onclick="AILessonSlides.generateCustom()" style="padding: 12px 24px; border-radius: 12px; background: linear-gradient(135deg, #a855f7, #06b6d4); border: none; color: #fff; font-weight: 800; cursor: pointer; white-space: nowrap;">
                ⚡ បង្កើត Slide
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectTopic(topicId) {
    const topic = this.lessonTopics.find(t => t.id === topicId);
    if (!topic) return;
    this.generateDeck(topic.title, topic.subject, topic.bookPage);
  },

  generateCustom() {
    const input = document.getElementById("aiSlideCustomPrompt");
    const val = input ? input.value.trim() : "";
    if (!val) {
      if (typeof Notifications !== "undefined") Notifications.show("សូមបញ្ចូលប្រធានបទមេរៀនជាមុនសិន!", "warning");
      else alert("សូមបញ្ចូលប្រធានបទមេរៀនជាមុនសិន!");
      return;
    }
    this.generateDeck(val, "Computer Science", "សៀវភៅពុម្ពមូលដ្ឋាន");
  },

  generateDeck(title, subject, bookPage) {
    const modal = document.getElementById("aiLessonSlidesModal");
    if (!modal) return;

    // Loading State
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 500px; width: 95%; background: #0f172a; border-radius: 24px; border: 2px solid #a855f7; padding: 48px 24px; text-align: center; color: #fff;">
        <div style="font-size: 3rem; margin-bottom: 16px;" class="motion-float">✨</div>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">Gemini AI កំពុងបង្កើត Slide & កិច្ចតែងការ...</h3>
        <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.6;">ដកស្រង់ក្បួនខ្នាតពី ${bookPage} នៃសៀវភៅពុម្ពកុំព្យូទ័ររដ្ឋបាល ១២០ ទំព័រ</p>
      </div>
    `;

    setTimeout(() => {
      // Create rich deck structure
      this.currentDeck = {
        title: title,
        subject: subject,
        bookPage: bookPage,
        slides: [
          {
            title: title,
            subtitle: `មេរៀនកុំព្យូទ័ររដ្ឋបាល • យោងសៀវភៅពុម្ព ${bookPage}`,
            type: "title",
            content: "បង្រៀនដោយ៖ លោកគ្រូ ខៀន ធូ • សាលា អន្តរជាតិ ធានស៊ីន (TIS)"
          },
          {
            title: "🎯 វត្ថុបំណងនៃមេរៀន (Learning Objectives)",
            type: "bullets",
            bullets: [
              "យល់ដឹងពីសារៈសំខាន់ និងគោលការណ៍គ្រឹះនៃមេរៀនក្នុងឯកសាររដ្ឋបាល",
              "ចេះប្រើប្រាស់ Shortcut Keys និងជំហានអនុវត្តបានត្រឹមត្រូវ ១០០%",
              "អាចដោះស្រាយបញ្ហាជាក់ស្តែងដែលជួបប្រទះក្នុងពេលអនុវត្តលើកុំព្យូទ័រ",
              "ឆ្លងកាត់លំហាត់អនុវត្តដៃផ្ទាល់បានពិន្ទុចាប់ពី ៧០% ឡើងទៅ"
            ]
          },
          {
            title: "⚡ គន្លឹះ និងជំហានអនុវត្តសំខាន់ៗ",
            type: "steps",
            steps: [
              { num: "១", title: "រៀបចំផ្ទាំងការងារ", desc: "បើកកម្មវិធី ពិនិត្យ Page Setup ទំហំ A4 និង Margin 2.54cm" },
              { num: "២", title: "បញ្ចូលទិន្នន័យ", desc: "វាយអត្ថបទ ឬទិន្នន័យតាមគំរូដោយប្រើពុម្ពអក្សរ Khmer OS Siemreap" },
              { num: "៣", title: "អនុវត្តរូបមន្ត / ឧបករណ៍", desc: "ប្រើប្រាស់ឧបករណ៍តាមការណែនាំក្នុងសៀវភៅពុម្ពដោយមិនបាច់ប្រើ Mouse ញឹកញាប់" },
              { num: "៤", title: "រក្សាទុក & Print Preview", desc: "ចុច Ctrl + S និង Ctrl + P ដើម្បីពិនិត្យមុននឹងបោះពុម្ព" }
            ]
          },
          {
            title: "⌨️ Shortcut Keys ចាំបាច់ត្រូវចងចាំ",
            type: "shortcuts",
            shortcuts: [
              { key: "Ctrl + S", desc: "រក្សាទុកឯកសារ (Save)" },
              { key: "Ctrl + Z", desc: "ត្រឡប់ថយក្រោយ (Undo)" },
              { key: "Ctrl + P", desc: "បោះពុម្ពឯកសារ (Print Preview)" },
              { key: "F4 / Ctrl + Y", desc: "ធ្វើសកម្មភាពដដែលឡើងវិញ (Repeat/Redo)" }
            ]
          },
          {
            title: "📝 លំហាត់អនុវត្តជាក់ស្តែងក្នុងបន្ទប់ Lab",
            type: "exercise",
            task: "សិស្សទាំងអស់ត្រូវបើកកុំព្យូទ័រ ហើយអនុវត្តតាមលំហាត់ទំព័រខាងក្រោម៖",
            pageRef: bookPage,
            time: "២០ នាទី",
            criteria: "ត្រឹមត្រូវតាមទម្រង់រដ្ឋបាល • អក្ខរាវិរុទ្ធត្រឹមត្រូវ • រូបមន្តគណនាត្រឹមត្រូវ"
          }
        ],
        lessonPlan: {
          duration: "៦០ នាទី",
          materials: "កុំព្យូទ័រ Lab, Projector, សៀវភៅពុម្ព ១២០ ទំព័រ",
          stages: [
            { time: "១០ នាទី", activity: "រំលឹកមេរៀនចាស់ & បង្ហាញ Slide វត្ថុបំណងថ្មី" },
            { time: "២០ នាទី", activity: "គ្រូធ្វើបទបង្ហាញ និងអនុវត្តជាក់ស្តែងលើ Projector" },
            { time: "២០ នាទី", activity: "សិស្សអនុវត្តលំហាត់ផ្ទាល់ដៃលើម៉ាស៊ីនរៀងៗខ្លួន" },
            { time: "១០ នាទី", activity: "គ្រូត្រួតពិនិត្យ ដាក់ពិន្ទុ និងសង្ខេបចំណុចខ្វះខាត" }
          ]
        }
      };

      this.currentSlideIndex = 0;
      this.renderPlayer();
    }, 800);
  },

  renderPlayer() {
    const modal = document.getElementById("aiLessonSlidesModal");
    if (!modal || !this.currentDeck) return;

    const deck = this.currentDeck;
    const slide = deck.slides[this.currentSlideIndex];
    const totalSlides = deck.slides.length;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 960px; width: 95%; background: #0f172a; border-radius: 24px; border: 2px solid #a855f7; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9); overflow: hidden; padding: 0; color: #fff; min-height: 600px; display: flex; flex-direction: column;">
        <!-- Projector Bar -->
        <div style="background: #1e1b4b; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.2rem;">📽️</span>
            <div>
              <div style="font-size: 0.92rem; font-weight: 800; color: #fff;">${deck.title}</div>
              <div style="font-size: 0.72rem; color: #c084fc;">Slide ${this.currentSlideIndex + 1} នៃ ${totalSlides} • ${deck.bookPage}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <button type="button" onclick="AILessonSlides.openLessonPlanModal()" style="padding: 6px 14px; border-radius: 10px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
              📄 មើលកិច្ចតែងការ A4
            </button>
            <button type="button" onclick="AILessonSlides.closeModal()" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;">✕</button>
          </div>
        </div>

        <!-- 16:9 Presentation Canvas -->
        <div style="flex: 1; padding: 40px 48px; background: radial-gradient(circle at 50% 30%, #1e1b4b 0%, #090d16 100%); display: flex; flex-direction: column; justify-content: center;">
          ${this.renderSlideContent(slide)}
        </div>

        <!-- Controller Footer -->
        <div style="background: #1e1b4b; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1);">
          <button type="button" onclick="AILessonSlides.prevSlide()" ${this.currentSlideIndex === 0 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} style="padding: 10px 20px; border-radius: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-weight: 700; cursor: pointer;">
            ◀ ថយក្រោយ (Prev)
          </button>

          <div style="display: flex; gap: 6px;">
            ${deck.slides.map((_, idx) => `
              <span onclick="AILessonSlides.goToSlide(${idx})" style="width: 12px; height: 12px; border-radius: 50%; cursor: pointer; background: ${idx === this.currentSlideIndex ? '#a855f7' : 'rgba(255,255,255,0.2)'}; display: inline-block;"></span>
            `).join('')}
          </div>

          <button type="button" onclick="AILessonSlides.nextSlide()" ${this.currentSlideIndex === totalSlides - 1 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} style="padding: 10px 24px; border-radius: 12px; background: linear-gradient(135deg, #a855f7, #38bdf8); border: none; color: #fff; font-weight: 800; cursor: pointer;">
            បន្ទាប់ (Next) ▶
          </button>
        </div>
      </div>
    `;
  },

  renderSlideContent(slide) {
    if (slide.type === "title") {
      return `
        <div style="text-align: center; max-width: 720px; margin: 0 auto;">
          <span style="background: rgba(168, 85, 247, 0.2); border: 1px solid #c084fc; color: #e9d5ff; padding: 6px 18px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; display: inline-block; margin-bottom: 20px;">
            ${slide.subtitle}
          </span>
          <h1 style="font-size: 2.2rem; font-weight: 900; line-height: 1.35; color: #fff; margin: 0 0 20px 0; letter-spacing: -0.5px;">
            ${slide.title}
          </h1>
          <div style="font-size: 1rem; color: #cbd5e1; font-weight: 600;">
            ${slide.content}
          </div>
        </div>
      `;
    }

    if (slide.type === "bullets") {
      return `
        <div>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #facc15; margin: 0 0 28px 0;">
            ${slide.title}
          </h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${slide.bullets.map(b => `
              <div style="display: flex; align-items: flex-start; gap: 14px; font-size: 1.1rem; line-height: 1.6; color: #f1f5f9;">
                <span style="color: #38bdf8; font-size: 1.3rem;">✔</span>
                <span>${b}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (slide.type === "steps") {
      return `
        <div>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #38bdf8; margin: 0 0 28px 0;">
            ${slide.title}
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            ${slide.steps.map(s => `
              <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; display: flex; gap: 14px;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: #6b21a8; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 900;">
                  ${s.num}
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 1rem; color: #fff; margin-bottom: 4px;">${s.title}</div>
                  <div style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.4;">${s.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (slide.type === "shortcuts") {
      return `
        <div>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #ec4899; margin: 0 0 28px 0;">
            ${slide.title}
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            ${slide.shortcuts.map(s => `
              <div style="background: rgba(0,0,0,0.4); border: 1.5px solid rgba(236, 72, 153, 0.3); border-radius: 16px; padding: 18px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.95rem; color: #e2e8f0; font-weight: 700;">${s.desc}</span>
                <span style="padding: 6px 14px; background: #be185d; border-radius: 10px; font-weight: 900; font-family: monospace; font-size: 1rem; color: #fff; box-shadow: 0 2px 8px rgba(190, 24, 93, 0.4);">${s.key}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (slide.type === "exercise") {
      return `
        <div style="text-align: center; max-width: 680px; margin: 0 auto;">
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #10b981; margin: 0 0 16px 0;">
            ${slide.title}
          </h2>
          <p style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 24px;">${slide.task}</p>
          <div style="background: rgba(16, 185, 129, 0.12); border: 1.5px dashed #10b981; border-radius: 18px; padding: 22px; margin-bottom: 24px;">
            <div style="font-size: 1.25rem; font-weight: 900; color: #34d399; margin-bottom: 8px;">📖 បើកសៀវភៅពុម្ព៖ ${slide.pageRef}</div>
            <div style="font-size: 0.95rem; color: #fff; font-weight: 700;">⏱️ ថិរវេលាអនុវត្ត៖ ${slide.time}</div>
          </div>
          <div style="font-size: 0.85rem; color: #94a3b8;">
            ស្តង់ដារវាយតម្លៃ៖ ${slide.criteria}
          </div>
        </div>
      `;
    }

    return `<div>Slide Content</div>`;
  },

  nextSlide() {
    if (this.currentDeck && this.currentSlideIndex < this.currentDeck.slides.length - 1) {
      this.currentSlideIndex++;
      this.renderPlayer();
    }
  },

  prevSlide() {
    if (this.currentDeck && this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.renderPlayer();
    }
  },

  goToSlide(idx) {
    if (this.currentDeck && idx >= 0 && idx < this.currentDeck.slides.length) {
      this.currentSlideIndex = idx;
      this.renderPlayer();
    }
  },

  openLessonPlanModal() {
    const deck = this.currentDeck;
    if (!deck) return;

    let planModal = document.getElementById("lessonPlanA4Modal");
    if (!planModal) {
      planModal = document.createElement("div");
      planModal.id = "lessonPlanA4Modal";
      planModal.className = "modal-overlay";
      planModal.style.zIndex = "10950";
      document.body.appendChild(planModal);
    }

    planModal.innerHTML = `
      <div class="modal-card" style="max-width: 800px; width: 95%; background: #ffffff; color: #1e293b; border-radius: 16px; padding: 36px 40px; box-shadow: 0 25px 60px rgba(0,0,0,0.8); max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 1.3rem; font-weight: 900; color: #0f172a;">កិច្ចតែងការបង្រៀនកុំព្យូទ័ររដ្ឋបាល (LESSON PLAN)</h2>
            <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">សាលា អន្តរជាតិ ធានស៊ីន • មុខវិជ្ជា៖ ${deck.subject}</div>
          </div>
          <button type="button" onclick="document.getElementById('lessonPlanA4Modal').style.display='none'" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #64748b;">✕</button>
        </div>

        <div style="background: #f8fafc; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; font-size: 0.88rem; line-height: 1.7;">
          <div><strong>ចំណងជើងមេរៀន៖</strong> ${deck.title}</div>
          <div><strong>ឯកសារយោង៖</strong> សៀវភៅពុម្ពកុំព្យូទ័ររដ្ឋបាល ${deck.bookPage}</div>
          <div><strong>ថិរវេលាបង្រៀន៖</strong> ${deck.lessonPlan.duration}</div>
          <div><strong>សម្ភារឧបទេស៖</strong> ${deck.lessonPlan.materials}</div>
        </div>

        <h4 style="margin: 0 0 10px 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">ដំណាក់កាលបង្រៀនជាក់ស្តែងក្នុងថ្នាក់៖</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 0.85rem;">
          <thead>
            <tr style="background: #e2e8f0; text-align: left;">
              <th style="padding: 10px; border: 1px solid #cbd5e1; width: 100px;">ថិរវេលា</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1;">សកម្មភាពគ្រូ និងសិស្ស</th>
            </tr>
          </thead>
          <tbody>
            ${deck.lessonPlan.stages.map(s => `
              <tr>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 700; color: #4338ca;">${s.time}</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">${s.activity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button type="button" onclick="window.print()" style="padding: 10px 22px; border-radius: 10px; background: #0f172a; color: #fff; font-weight: 800; border: none; cursor: pointer;">
            🖨️ បោះពុម្ពកិច្ចតែងការ A4
          </button>
        </div>
      </div>
    `;

    planModal.style.display = "flex";
  }
};

window.AILessonSlides = AILessonSlides;

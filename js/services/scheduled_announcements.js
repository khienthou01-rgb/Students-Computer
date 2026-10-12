/**
 * ==========================================================================
 * Service: ScheduledAnnouncements (ប្រព័ន្ធផ្សាយដំណឹងស្វ័យប្រវត្តិដល់កាលបរិច្ឆេទ)
 * CRITICAL USER RULE:
 * "ដល់ថ្ងៃ Auto ជូនដំណឹងតែម្តង មិនចាំបាច់ខ្ញុំចុចទេ!"
 * Automatically broadcasts to Telegram groups & displays student modal
 * on the exact scheduled date without any manual teacher intervention!
 * ==========================================================================
 */

const ScheduledAnnouncements = {
  STORAGE_KEY_LIST: "master_school_scheduled_announcements",
  STORAGE_KEY_BROADCAST_LOG: "master_school_announcement_broadcast_log",

  // Default seeded announcements (Holidays, Exam dates, School milestones)
  DEFAULT_ANNOUNCEMENTS: [
    {
      id: "ANN-HOLIDAY-001",
      title: "សេចក្តីជូនដំណឹង៖ ឈប់សម្រាកពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ",
      category: "holiday",
      targetDate: "2026-04-14",
      endDate: "2026-04-17",
      targetShifts: "all",
      autoBroadcastTelegram: true,
      message: "ជម្រាបជូនដំណឹងដល់លោកគ្រូអ្នកគ្រូ និងសិស្សានុសិស្សទាំងអស់ជ្រាបថា សាលានឹងឈប់សម្រាកក្នុងឱកាសពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ។ សូមជូនពរសិស្សានុសិស្សទាំងអស់ទទួលបានសុខភាពល្អ និងធ្វើដំណើរប្រកបដោយសុវត្ថិភាព!",
      active: true
    },
    {
      id: "ANN-HOLIDAY-002",
      title: "សេចក្តីជូនដំណឹង៖ ឈប់សម្រាកពិធីបុណ្យភ្ជុំបិណ្ឌ",
      category: "holiday",
      targetDate: "2026-10-10",
      endDate: "2026-10-13",
      targetShifts: "all",
      autoBroadcastTelegram: true,
      message: "សាលា អន្តរជាតិ ធានស៊ីន សូមជូនដំណឹងអំពីការឈប់សម្រាកពិធីបុណ្យភ្ជុំបិណ្ឌ។ ថ្នាក់រៀនកុំព្យូទ័រនឹងបើកដំណើរការធម្មតាវិញនៅថ្ងៃបន្ទាប់។",
      active: true
    },
    {
      id: "ANN-EXAM-001",
      title: "សេចក្តីជូនដំណឹង៖ ការប្រឡងបញ្ចប់វគ្គកុំព្យូទ័រ (Word & Excel)",
      category: "exam",
      targetDate: "2026-10-15",
      endDate: "2026-10-16",
      targetShifts: "all",
      autoBroadcastTelegram: true,
      message: "សូមរំលឹកដល់សិស្សានុសិស្សគ្រប់វេនទាំងអស់ ត្រៀមខ្លួនសម្រាប់ការប្រឡងបញ្ចប់វគ្គកុំព្យូទ័ររដ្ឋបាល & IT។ សូមចូលពិនិត្យសំណួររំលឹក និងធ្វើតេស្តសាកល្បង Mock Exam ក្នុងប្រព័ន្ធជាមុន!",
      active: true
    },
    {
      id: "ANN-TERM-001",
      title: "សេចក្តីជូនដំណឹង៖ ទទួលចុះឈ្មោះចូលរៀនវគ្គកុំព្យូទ័រជំនាន់ថ្មី",
      category: "intake",
      targetDate: "2026-10-20",
      endDate: "2026-10-25",
      targetShifts: "all",
      autoBroadcastTelegram: true,
      message: "សាលា អន្តរជាតិ ធានស៊ីន បើកទទួលចុះឈ្មោះសិស្សថ្មីវគ្គកុំព្យូទ័ររដ្ឋបាល & IT (Word, Excel, PowerPoint, Typing) ទាំង ៣ វេន។ សិស្សអាចចុះឈ្មោះ Online តាម Link #enroll របស់សាលាបាន!",
      active: true
    }
  ],

  init() {
    this.ensureStorage();
    // Run automated check immediately on app boot
    this.checkAndAutoBroadcastToday();

    // Check again every 30 minutes in background
    setInterval(() => {
      this.checkAndAutoBroadcastToday();
    }, 30 * 60 * 1000);
  },

  ensureStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_LIST);
      if (!stored) {
        localStorage.setItem(this.STORAGE_KEY_LIST, JSON.stringify(this.DEFAULT_ANNOUNCEMENTS));
      }
    } catch (e) {}
  },

  getAllAnnouncements() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_LIST);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [...this.DEFAULT_ANNOUNCEMENTS];
  },

  saveAllAnnouncements(list) {
    try {
      localStorage.setItem(this.STORAGE_KEY_LIST, JSON.stringify(list));
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected && StudentAPI.isCloudConnected()) {
        try {
          firebase.database().ref("scheduled_announcements").set(list);
        } catch (e) {}
      }
      return true;
    } catch (e) {
      console.error("Failed to save announcements:", e);
      return false;
    }
  },

  /**
   * CRITICAL AUTO ENGINE:
   * "ដល់ថ្ងៃ Auto ជូនដំណឹងតែម្តង មិនចាំបាច់ខ្ញុំចុចទេ"
   * Automatically executes when today matches targetDate without teacher clicking!
   */
  async checkAndAutoBroadcastToday() {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const all = this.getAllAnnouncements();
    let broadcastLog = {};

    try {
      broadcastLog = JSON.parse(localStorage.getItem(this.STORAGE_KEY_BROADCAST_LOG) || "{}");
    } catch (e) {}

    for (const ann of all) {
      if (!ann.active) continue;

      // Check if today matches announcement targetDate (or falls between targetDate and endDate)
      const isTodayDue = ann.targetDate === today || (ann.endDate && today >= ann.targetDate && today <= ann.endDate);

      // Unique broadcast key: annId + today
      const broadcastKey = `${ann.id}_${today}`;

      if (isTodayDue && !broadcastLog[broadcastKey]) {
        console.log("⚡ Auto Scheduled Announcement Triggered for today:", ann.title);

        // 1. Mark in log immediately to prevent race conditions
        broadcastLog[broadcastKey] = {
          triggeredAt: new Date().toISOString(),
          title: ann.title
        };
        localStorage.setItem(this.STORAGE_KEY_BROADCAST_LOG, JSON.stringify(broadcastLog));

        // 2. Auto Broadcast to Telegram Group & Shifts
        if (ann.autoBroadcastTelegram && typeof TelegramService !== "undefined" && TelegramService.sendMessage) {
          try {
            const telegramText = `
📢 <b>[សេចក្តីជូនដំណឹងស្វ័យប្រវត្តិ - សាលា អន្តរជាតិ ធានស៊ីន]</b>
━━━━━━━━━━━━━━━━━━━━━━━━
📌 <b>${ann.title}</b>
📅 <b>កាលបរិច្ឆេទ៖</b> ${today} ${ann.endDate ? 'ដល់ ' + ann.endDate : ''}
⏰ <b>វេនសិក្សា៖</b> ${ann.targetShifts === 'all' ? 'គ្រប់វេន (ព្រឹក/ថ្ងៃ/រសៀល)' : ann.targetShifts}

${ann.message}

━━━━━━━━━━━━━━━━━━━━━━━━
🏛 <i>សាលា អន្តរជាតិ ធានស៊ីន (TIS LAB COMPUTER)</i>
            `.trim();

            await TelegramService.sendMessage(telegramText);
            console.log("🚀 Telegram Auto-Broadcast Succeeded for:", ann.title);
          } catch (err) {
            console.warn("Telegram auto broadcast warning:", err);
          }
        }

        // 3. Trigger In-App Notification Modal for Students/Teachers
        setTimeout(() => {
          this.showAutoPopupBanner(ann);
        }, 1500);
      }
    }
  },

  /**
   * Display high-priority in-app modal banner when auto announcement fires
   */
  showAutoPopupBanner(ann) {
    let popup = document.getElementById("autoAnnouncementBannerModal");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "autoAnnouncementBannerModal";
      popup.className = "modal-overlay";
      popup.style.zIndex = "10900";
      document.body.appendChild(popup);
    }

    const categoryIconMap = {
      holiday: { icon: "fa-champagne-glasses", color: "#f59e0b", badge: "បុណ្យឈប់សម្រាក" },
      exam: { icon: "fa-graduation-cap", color: "#ec4899", badge: "ការប្រឡង" },
      intake: { icon: "fa-user-plus", color: "#06b6d4", badge: "សិស្សថ្មី" },
      general: { icon: "fa-bullhorn", color: "#8b5cf6", badge: "ដំណឹងទូទៅ" }
    };

    const cMeta = categoryIconMap[ann.category] || categoryIconMap.general;

    popup.innerHTML = `
      <div class="modal-card" style="max-width: 580px; width: 95%; background: #0f172a; border-radius: 20px; border: 2px solid ${cMeta.color}; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.95); overflow: hidden; padding: 0; animation: msSlideInUp 0.3s ease;">
        <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); border-bottom: 2px solid ${cMeta.color}; padding: 22px 24px; text-align: center; color: #fff;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: ${cMeta.color}30; border: 2px solid ${cMeta.color}; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: ${cMeta.color}; margin: 0 auto 12px;">
            <i class="fa-solid ${cMeta.icon}"></i>
          </div>
          <span class="badge" style="background: ${cMeta.color}; color: #fff; font-size: 0.74rem; padding: 3px 10px; border-radius: 6px; font-weight: 800;">
            ${cMeta.badge} (ស្វ័យប្រវត្ត)
          </span>
          <h3 style="margin: 10px 0 4px; font-size: 1.25rem; font-weight: 800; color: #fff;">
            ${ann.title}
          </h3>
          <p style="margin: 0; font-size: 0.8rem; color: #cbd5e1;">
            សាលា អន្តរជាតិ ធានស៊ីន (TIS LAB COMPUTER)
          </p>
        </div>

        <div style="padding: 22px 24px;">
          <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px 18px; font-size: 0.9rem; color: #e2e8f0; line-height: 1.7; white-space: pre-line; margin-bottom: 18px;">
            ${ann.message}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem; color: #94a3b8; margin-bottom: 20px;">
            <span><i class="fa-solid fa-calendar-day text-cyan-400"></i> កាលបរិច្ឆេទ៖ ${ann.targetDate}</span>
            <span><i class="fa-brands fa-telegram text-sky-400"></i> បានបាញ់ចូល Telegram រួចរាល់</span>
          </div>

          <button type="button" onclick="document.getElementById('autoAnnouncementBannerModal').style.display='none'" class="btn-primary" style="width: 100%; height: 44px; font-size: 0.92rem; font-weight: 800; background: linear-gradient(135deg, ${cMeta.color}, #6366f1); border: none; border-radius: 10px; cursor: pointer;">
            ខ្ញុំបានយល់ដឹង (Got it)
          </button>
        </div>
      </div>
    `;

    popup.style.display = "flex";
  },

  /**
   * Teacher Management Modal: View & Schedule New Auto Announcements
   */
  openManageModal() {
    this.ensureManageModalInDOM();
    this.renderManageModal();
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.open) {
      ModalsComponent.open("manageAnnouncementsModal");
    } else {
      const el = document.getElementById("manageAnnouncementsModal");
      if (el) el.style.display = "flex";
    }
  },

  closeManageModal() {
    if (typeof ModalsComponent !== "undefined" && ModalsComponent.close) {
      ModalsComponent.close("manageAnnouncementsModal");
    } else {
      const el = document.getElementById("manageAnnouncementsModal");
      if (el) el.style.display = "none";
    }
  },

  ensureManageModalInDOM() {
    let modal = document.getElementById("manageAnnouncementsModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "manageAnnouncementsModal";
      modal.className = "modal-overlay";
      modal.style.zIndex = "10860";
      document.body.appendChild(modal);
    }
  },

  renderManageModal() {
    const modal = document.getElementById("manageAnnouncementsModal");
    if (!modal) return;

    const list = this.getAllAnnouncements();

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 880px; width: 95%; max-height: 90vh; background: #0f172a; border-radius: 20px; border: 1.5px solid #f59e0b; overflow: hidden; display: flex; flex-direction: column; padding: 0;">
        <div style="background: linear-gradient(135deg, #78350f, #b45309); padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(245, 158, 11, 0.25); border: 1.5px solid #f59e0b; display: flex; align-items: center; justify-content: center; color: #fef3c7; font-size: 1.3rem;">
              <i class="fa-solid fa-bullhorn"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #fff;">
                គ្រប់គ្រងការផ្សាយដំណឹងស្វ័យប្រវត្ត (Auto Scheduled Announcements)
              </h3>
              <p style="margin: 2px 0 0; font-size: 0.78rem; color: #fef3c7;">
                កំណត់កាលបរិច្ឆេទ ➔ ដល់ថ្ងៃប្រព័ន្ធនឹង Auto ជូនដំណឹង និងបាញ់ចូល Telegram ដោយស្វ័យប្រវត្តិ
              </p>
            </div>
          </div>
          <button type="button" onclick="ScheduledAnnouncements.closeManageModal()" style="background: rgba(255, 255, 255, 0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #334155; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.84rem; color: #cbd5e1;">
            មាន <strong>${list.length}</strong> សេចក្តីជូនដំណឹងត្រូវបានកំណត់ទុក
          </div>
          <button type="button" onclick="ScheduledAnnouncements.openCreateDialog()" class="btn-primary" style="height: 36px; padding: 0 16px; font-size: 0.82rem; background: #f59e0b; border: none; font-weight: 700; border-radius: 8px;">
            <i class="fa-solid fa-plus"></i> <span>បង្កើតសេចក្តីជូនដំណឹងថ្មី</span>
          </button>
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 14px;">
          ${list.map(ann => `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-left: 4px solid #f59e0b; border-radius: 12px; padding: 16px 18px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
              <div style="flex: 1; min-width: 280px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; font-size: 0.74rem;">
                    📅 ដល់ថ្ងៃ៖ ${ann.targetDate}
                  </span>
                  <span class="badge" style="background: ${ann.autoBroadcastTelegram ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)'}; color: ${ann.autoBroadcastTelegram ? '#34d399' : '#94a3b8'}; font-size: 0.74rem;">
                    ${ann.autoBroadcastTelegram ? '✓ Auto Telegram' : '○ អត់បាញ់ Telegram'}
                  </span>
                </div>
                <h4 style="margin: 0 0 6px; font-size: 1rem; font-weight: 800; color: #fff;">
                  ${ann.title}
                </h4>
                <p style="margin: 0; font-size: 0.82rem; color: #cbd5e1; line-height: 1.5;">
                  ${ann.message}
                </p>
              </div>

              <div style="display: flex; gap: 8px; align-items: center;">
                <button type="button" onclick="ScheduledAnnouncements.triggerNowPrompt('${ann.id}')" class="btn-secondary" style="height: 34px; padding: 0 12px; font-size: 0.78rem;" title="សាកល្បងបាញ់ដំណឹងភ្លាមៗឥឡូវនេះ">
                  <i class="fa-solid fa-paper-plane text-cyan-400"></i> <span>បាញ់ភ្លាមៗ</span>
                </button>
                <button type="button" onclick="ScheduledAnnouncements.deleteAnnouncement('${ann.id}')" class="btn-action" style="height: 34px; padding: 0 10px; background: rgba(239, 68, 68, 0.15); color: #f87171; border-radius: 6px;" title="លុប">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  openCreateDialog() {
    const title = prompt("បញ្ចូលចំណងជើងសេចក្តីជូនដំណឹង:", "សេចក្តីជូនដំណឹង៖ ឈប់សម្រាកបុណ្យជាតិ");
    if (!title) return;

    const targetDate = prompt("បញ្ចូលកាលបរិច្ឆេទដែលត្រូវ Auto ជូនដំណឹង (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
    if (!targetDate) return;

    const message = prompt("បញ្ចូលខ្លឹមសារសេចក្តីជូនដំណឹងលម្អិត:", "សាលា អន្តរជាតិ ធានស៊ីន សូមជម្រាបជូនដំណឹងដល់លោកគ្រូអ្នកគ្រូ និងសិស្សានុសិស្សទាំងអស់...");
    if (!message) return;

    const newAnn = {
      id: `ANN-CUST-${Date.now().toString().slice(-5)}`,
      title,
      category: "general",
      targetDate,
      targetShifts: "all",
      autoBroadcastTelegram: true,
      message,
      active: true
    };

    const list = this.getAllAnnouncements();
    list.unshift(newAnn);
    this.saveAllAnnouncements(list);

    if (typeof App !== "undefined") {
      App.showToast("🎉 បានបន្ថែមសេចក្តីជូនដំណឹងស្វ័យប្រវត្តជោគជ័យ!", "success");
    }

    this.renderManageModal();
  },

  async triggerNowPrompt(id) {
    const ann = this.getAllAnnouncements().find(a => a.id === id);
    if (!ann) return;

    if (confirm(`តើលោកគ្រូចង់បាញ់ដំណឹង «${ann.title}» ចូល Telegram ភ្លាមៗឥឡូវនេះមែនទេ?`)) {
      if (typeof TelegramService !== "undefined" && TelegramService.sendMessage) {
        const text = `
📢 <b>[សេចក្តីជូនដំណឹងផ្លូវការ - សាលា អន្តរជាតិ ធានស៊ីន]</b>
━━━━━━━━━━━━━━━━━━━━━━━━
📌 <b>${ann.title}</b>
📅 <b>កាលបរិច្ឆេទ៖</b> ${ann.targetDate}

${ann.message}

━━━━━━━━━━━━━━━━━━━━━━━━
🏛 <i>សាលា អន្តរជាតិ ធានស៊ីន (TIS LAB COMPUTER)</i>
        `.trim();
        await TelegramService.sendMessage(text);
        if (typeof App !== "undefined") App.showToast("🚀 បានបាញ់ដំណឹងចូល Telegram រួចរាល់!", "success");
      }
      this.showAutoPopupBanner(ann);
    }
  },

  deleteAnnouncement(id) {
    if (confirm("តើលោកគ្រូប្រាកដជាចង់លុបសេចក្តីជូនដំណឹងនេះមែនទេ?")) {
      const list = this.getAllAnnouncements().filter(a => a.id !== id);
      this.saveAllAnnouncements(list);
      this.renderManageModal();
    }
  }
};

// Initialize Auto Engine on script load
ScheduledAnnouncements.init();

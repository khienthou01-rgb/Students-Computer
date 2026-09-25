/**
 * Service: Telegram Bot Notifications (ការជូនដំណឹងស្វ័យប្រវត្តិតាម Telegram Bot)
 */
const TelegramService = {
  getLocalDateStr(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  },

  getConfig() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY_TELEGRAM);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...APP_CONFIG.telegramConfig,
          ...parsed,
          botToken: (parsed.botToken && parsed.botToken.trim() !== "") ? parsed.botToken : APP_CONFIG.telegramConfig.botToken,
          chatId: (parsed.chatId && parsed.chatId.trim() !== "") ? parsed.chatId : APP_CONFIG.telegramConfig.chatId,
          shiftChatIds: {
            morning: (parsed.shiftChatIds?.morning || parsed.chatId_morning || "").trim(),
            afternoon: (parsed.shiftChatIds?.afternoon || parsed.chatId_afternoon || "").trim(),
            night: (parsed.shiftChatIds?.night || parsed.chatId_night || "").trim()
          },
          shiftGroupTitles: {
            morning: parsed.shiftGroupTitles?.morning || "រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនព្រឹក",
            afternoon: parsed.shiftGroupTitles?.afternoon || "រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនរសៀល",
            night: parsed.shiftGroupTitles?.night || "រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនយប់ (ម៉ោង៥-៦)"
          },
          enabled: parsed.enabled !== undefined ? parsed.enabled : true,
          notifyShiftAttendanceSummary: parsed.notifyShiftAttendanceSummary !== undefined ? parsed.notifyShiftAttendanceSummary : true,
          shiftAttendanceDelayMinutes: parsed.shiftAttendanceDelayMinutes || 5,
          notifyIndividualAttendance: parsed.notifyIndividualAttendance === true ? true : false,
          notifyAttendance: false // Always disable spammy individual messages
        };
      }
    } catch (e) {}
    return {
      ...APP_CONFIG.telegramConfig,
      shiftChatIds: {
        morning: "",
        afternoon: "",
        night: ""
      },
      shiftGroupTitles: {
        morning: "រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនព្រឹក",
        afternoon: "រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនរសៀល",
        night: "រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនយប់ (ម៉ោង៥-៦)"
      }
    };
  },

  saveConfig(config) {
    localStorage.setItem(APP_CONFIG.STORAGE_KEY_TELEGRAM, JSON.stringify(config));
    if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
      try {
        firebase.database().ref("settings/telegram").set(config);
      } catch (e) {}
    }
  },

  isEnabled() {
    const config = this.getConfig();
    const token = (config.botToken || (typeof APP_CONFIG !== "undefined" && APP_CONFIG.telegramConfig && APP_CONFIG.telegramConfig.botToken) || "").trim();
    const hasAnyChatId = Boolean(
      (config.chatId && config.chatId.trim()) ||
      (config.shiftChatIds?.morning && config.shiftChatIds.morning.trim()) ||
      (config.shiftChatIds?.afternoon && config.shiftChatIds.afternoon.trim()) ||
      (config.shiftChatIds?.night && config.shiftChatIds.night.trim())
    );
    return Boolean(config.enabled !== false && token && hasAnyChatId);
  },

  getChatIdForShift(shift) {
    const config = this.getConfig();
    if (!shift || shift === "ALL") return config.chatId;

    const norm = this.normalizeShift(shift);
    const shiftChatId = config.shiftChatIds?.[norm.key];
    return (shiftChatId && shiftChatId.trim()) ? shiftChatId.trim() : config.chatId;
  },

  async autoDetectChatId() {
    const config = this.getConfig();
    const token = (config.botToken || APP_CONFIG.telegramConfig.botToken || "").trim();
    if (!token) {
      throw new Error("សូមបញ្ចូល Telegram Bot Token ជាមុនសិន!");
    }

    try {
      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=-10`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.ok) {
        throw new Error("Telegram API Error: " + (data.description || "មិនអាចទាញយក updates បានទេ"));
      }

      const updates = data.result || [];
      if (updates.length === 0) {
        throw new Error("មិនទាន់មានសារចូល Bot ឡើយ! សូមបើក Telegram ហើយចុច /start លើ @" + (config.botUsername || "my_master_kh_bot") + " ឬផ្ញើសារណាមួយទៅកាន់ Bot រួចចុចប៊ូតុងនេះម្តងទៀត។");
      }

      // Find latest message with chat ID
      let foundChat = null;
      for (let i = updates.length - 1; i >= 0; i--) {
        const u = updates[i];
        const msg = u.message || u.channel_post || u.my_chat_member || u.edited_message;
        if (msg && msg.chat && msg.chat.id) {
          foundChat = msg.chat;
          break;
        }
      }

      if (!foundChat || !foundChat.id) {
        throw new Error("រកមិនឃើញ Chat ID ឡើយ! សូមចុច /start ក្នុង Bot ហើយសាកល្បងម្តងទៀត។");
      }

      const chatIdStr = String(foundChat.id);
      config.chatId = chatIdStr;
      config.enabled = true;
      this.saveConfig(config);

      return {
        chatId: chatIdStr,
        chatTitle: foundChat.title || foundChat.first_name || foundChat.username || "Chat",
        type: foundChat.type
      };
    } catch (err) {
      throw err;
    }
  },

  async autoDetectAllShiftGroups() {
    const config = this.getConfig();
    const token = (config.botToken || APP_CONFIG.telegramConfig.botToken || "").trim();
    if (!token) {
      throw new Error("សូមបញ្ចូល Telegram Bot Token ជាមុនសិន!");
    }

    try {
      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=-50`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.ok) {
        throw new Error("Telegram API Error: " + (data.description || "មិនអាចទាញយក updates បានទេ"));
      }

      const updates = data.result || [];
      if (updates.length === 0) {
        throw new Error("មិនទាន់ឃើញមានសារថ្មីចូល Bot ឡើយ! សូមបន្ថែម Bot @" + (config.botUsername || "my_master_kh_bot") + " ចូលគ្រុបទាំង ៣ រួចផ្ញើសារណាមួយ (ឧ. hello) ក្នុងគ្រុបនីមួយៗ ហើយចុចប៊ូតុងនេះម្តងទៀត។");
      }

      if (!config.shiftChatIds) config.shiftChatIds = {};
      if (!config.shiftGroupTitles) config.shiftGroupTitles = {};

      const detected = {};
      const allFoundGroups = [];

      for (let i = updates.length - 1; i >= 0; i--) {
        const u = updates[i];
        const msg = u.message || u.channel_post || u.my_chat_member || u.edited_message;
        if (!msg || !msg.chat || !msg.chat.id) continue;

        const chat = msg.chat;
        const chatIdStr = String(chat.id);
        const title = chat.title || chat.username || chat.first_name || "Chat";

        if (!allFoundGroups.some(g => g.id === chatIdStr)) {
          allFoundGroups.push({ id: chatIdStr, title, type: chat.type });
        }

        const tLower = title.toLowerCase();
        if (!detected.morning && (tLower.includes("ព្រឹក") || tLower.includes("morning"))) {
          detected.morning = { id: chatIdStr, title };
        } else if (!detected.night && (tLower.includes("យប់") || tLower.includes("night") || tLower.includes("5-6") || tLower.includes("៥-៦"))) {
          detected.night = { id: chatIdStr, title };
        } else if (!detected.afternoon && (tLower.includes("រសៀល") || tLower.includes("afternoon") || tLower.includes("ថ្ងៃ") || tLower.includes("noon"))) {
          detected.afternoon = { id: chatIdStr, title };
        }
      }

      let newlyMatchedCount = 0;
      if (detected.morning) {
        config.shiftChatIds.morning = detected.morning.id;
        config.shiftGroupTitles.morning = detected.morning.title;
        newlyMatchedCount++;
      }
      if (detected.afternoon) {
        config.shiftChatIds.afternoon = detected.afternoon.id;
        config.shiftGroupTitles.afternoon = detected.afternoon.title;
        newlyMatchedCount++;
      }
      if (detected.night) {
        config.shiftChatIds.night = detected.night.id;
        config.shiftGroupTitles.night = detected.night.title;
        newlyMatchedCount++;
      }

      config.enabled = true;
      this.saveConfig(config);

      return {
        detected,
        allFoundGroups,
        newlyMatchedCount
      };
    } catch (err) {
      throw err;
    }
  },

  async broadcastToShifts(targetShift, messageText, customToken = null) {
    const config = this.getConfig();
    const token = (customToken || config.botToken || APP_CONFIG.telegramConfig.botToken || "").trim();
    if (!token) return { success: false, error: "Bot Token មិនទាន់បានកំណត់" };

    const targets = [];
    const isAll = (!targetShift || targetShift === "ALL");

    if (isAll) {
      const shiftKeys = [
        { key: "morning", label: "វេនព្រឹក" },
        { key: "afternoon", label: "វេនរសៀល" },
        { key: "night", label: "វេនយប់ (ម៉ោង៥-៦)" }
      ];

      shiftKeys.forEach(sh => {
        const id = config.shiftChatIds?.[sh.key];
        if (id && id.trim()) {
          targets.push({ key: sh.key, label: sh.label, id: id.trim() });
        }
      });

      // If no shift-specific chat IDs configured yet, fallback to main chatId
      if (targets.length === 0 && config.chatId) {
        targets.push({ key: "main", label: "គ្រុបទូទៅ", id: config.chatId.trim() });
      }
    } else {
      const norm = this.normalizeShift(targetShift);
      const id = config.shiftChatIds?.[norm.key] || config.chatId;
      if (id && id.trim()) {
        targets.push({ key: norm.key, label: norm.label, id: id.trim() });
      }
    }

    if (targets.length === 0) {
      return { success: false, error: "មិនទាន់មាន Chat ID សម្រាប់គ្រុបគោលដៅឡើយ សូមចូលកំណត់ក្នុង Settings" };
    }

    let successCount = 0;
    const errors = [];

    for (const target of targets) {
      const ok = await this.sendMessage(messageText, token, target.id);
      if (ok) {
        successCount++;
      } else {
        errors.push(target.label);
      }
    }

    return {
      success: successCount > 0,
      sentCount: successCount,
      totalCount: targets.length,
      errors
    };
  },

  async sendMessage(text, customToken = null, customChatId = null, replyToMessageId = null) {
    const config = this.getConfig();
    const token = (customToken || config.botToken || APP_CONFIG.telegramConfig.botToken || "").trim();
    let chatId = (customChatId || config.chatId || "").trim();

    // If chat ID is missing, try auto-detecting once in case user recently messaged the bot
    if (!chatId && token) {
      try {
        const detected = await this.autoDetectChatId();
        if (detected && detected.chatId) {
          chatId = detected.chatId;
        }
      } catch (e) {}
    }

    if (!token || !chatId) {
      console.log("Telegram notification skipped: Bot Token or Chat ID not configured.");
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const postBody = {
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: true
      };
      if (replyToMessageId) {
        postBody.reply_to_message_id = replyToMessageId;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody)
      });

      const res = await response.json();
      if (!res.ok) {
        console.warn("Telegram API Error:", res.description);
        return false;
      }
      return true;
    } catch (err) {
      console.warn("Telegram network error:", err);
      return false;
    }
  },

  async sendDocument(fileBlob, filename, caption = "", customToken = null, customChatId = null) {
    const config = this.getConfig();
    const token = (customToken || config.botToken || APP_CONFIG.telegramConfig.botToken || "").trim();
    const chatId = (customChatId || config.chatId || "").trim();

    if (!token || !chatId) {
      console.log("Telegram sendDocument skipped: Bot Token or Chat ID not configured.");
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("document", fileBlob, filename);
      if (caption) {
        formData.append("caption", caption);
        formData.append("parse_mode", "HTML");
      }

      const url = `https://api.telegram.org/bot${token}/sendDocument`;
      const response = await fetch(url, {
        method: "POST",
        body: formData
      });

      const res = await response.json();
      if (!res.ok) {
        console.warn("Telegram sendDocument Error:", res.description);
        return false;
      }
      return true;
    } catch (err) {
      console.warn("Telegram sendDocument network error:", err);
      return false;
    }
  },

  generateAttendanceExcel(studentsData, title, dateStr, shiftLabel, reporter = "លោកគ្រូ ខៀន ធូ") {
    if (typeof XLSX === "undefined") {
      console.warn("XLSX library is not loaded.");
      return null;
    }

    try {
      const headers = [
        "ល.រ",
        "អត្តលេខ (ID)",
        "គោត្តនាម-នាម (Khmer Name)",
        "ឈ្មោះឡាតាំង (Latin Name)",
        "ភេទ (Gender)",
        "វគ្គសិក្សា (Course)",
        "វេនសិក្សា (Shift)",
        "ស្ថានភាពវត្តមាន (Status)",
        "លេខទូរស័ព្ទ (Phone)",
        "អាណាព្យាបាល (Guardian)"
      ];

      const rows = (studentsData || []).map((s, idx) => {
        let statusKh = "មិនទាន់កត់ត្រា";
        const st = (s.attendanceStatus || s.status || "").toLowerCase();
        if (st === "present" || st === "វត្តមាន") statusKh = "វត្តមាន (Present)";
        else if (st === "permission" || st === "ច្បាប់") statusKh = "មានច្បាប់ (Permission)";
        else if (st === "absent" || st === "អវត្តមាន") statusKh = "អវត្តមាន (Absent)";

        return [
          idx + 1,
          s.ID || "",
          s.NameKh || "",
          s.NameEn || "",
          s.Gender || "",
          s.Course || "ថ្នាក់កុំព្យូទ័រ",
          s.Shift || shiftLabel || "",
          statusKh,
          s.Phone || "",
          s.GuardianPhone || ""
        ];
      });

      // Calculate summary totals
      const total = studentsData.length;
      const present = studentsData.filter(s => {
        const st = (s.attendanceStatus || s.status || "").toLowerCase();
        return st === "present" || st === "វត្តមាន";
      }).length;
      const perm = studentsData.filter(s => {
        const st = (s.attendanceStatus || s.status || "").toLowerCase();
        return st === "permission" || st === "ច្បាប់";
      }).length;
      const absent = studentsData.filter(s => {
        const st = (s.attendanceStatus || s.status || "").toLowerCase();
        return st === "absent" || st === "អវត្តមាន";
      }).length;
      const unmarked = total - (present + perm + absent);
      const presentRate = total > 0 ? Math.round((present / total) * 100) : 0;

      const sheetAoA = [
        ["មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS LAB COMPUTER - ខេត្តកំពត"],
        [`របាយការណ៍វត្តមានសិស្ស៖ ${title}`],
        [`កាលបរិច្ឆេទ៖ ${dateStr} | វេន៖ ${shiftLabel} | គ្រូទទួលបន្ទុក៖ ${reporter}`],
        [],
        headers,
        ...rows,
        [],
        ["ស្ថិតិសរុប (Summary)", "", "", "", "", "", "", ""],
        [
          "សិស្សសរុប", total + " នាក់",
          "វត្តមាន", present + " នាក់ (" + presentRate + "%)",
          "មានច្បាប់", perm + " នាក់",
          "អវត្តមាន", absent + " នាក់",
          "មិនទាន់កត់ត្រា", unmarked + " នាក់"
        ]
      ];

      const ws = XLSX.utils.aoa_to_sheet(sheetAoA);

      // Set column widths
      ws["!cols"] = [
        { wch: 6 },
        { wch: 14 },
        { wch: 24 },
        { wch: 22 },
        { wch: 8 },
        { wch: 18 },
        { wch: 22 },
        { wch: 24 },
        { wch: 16 },
        { wch: 16 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    } catch (err) {
      console.error("Error generating Excel:", err);
      return null;
    }
  },

  async generateAttendancePdf(studentsData, title, dateStr, shiftLabel, reporter = "លោកគ្រូ ខៀន ធូ") {
    const h2c = window.html2canvas;
    const jsPdfClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!h2c || !jsPdfClass) {
      console.warn("html2canvas or jsPDF library not loaded.");
      return null;
    }

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.width = "794px"; // A4 width at 96 DPI
    container.style.padding = "24px 30px";
    container.style.background = "#ffffff";
    container.style.color = "#0f172a";
    container.style.zIndex = "-99999";
    container.style.opacity = "1";
    container.style.pointerEvents = "none";
    container.style.fontFamily = "'Kantumruy Pro', 'Battambang', sans-serif";
    container.style.fontSize = "11px";
    container.style.boxSizing = "border-box";

    const total = studentsData.length;
    const present = studentsData.filter(s => {
      const st = (s.attendanceStatus || s.status || "").toLowerCase();
      return st === "present" || st === "វត្តមាន";
    }).length;
    const perm = studentsData.filter(s => {
      const st = (s.attendanceStatus || s.status || "").toLowerCase();
      return st === "permission" || st === "ច្បាប់";
    }).length;
    const absent = studentsData.filter(s => {
      const st = (s.attendanceStatus || s.status || "").toLowerCase();
      return st === "absent" || st === "អវត្តមាន";
    }).length;
    const unmarked = total - (present + perm + absent);
    const presentRate = total > 0 ? Math.round((present / total) * 100) : 0;

    const rowsHtml = (studentsData || []).map((s, idx) => {
      let statusKh = "មិនទាន់កត់ត្រា";
      let statusStyle = "background: #f1f5f9; color: #475569;";
      const st = (s.attendanceStatus || s.status || "").toLowerCase();
      if (st === "present" || st === "វត្តមាន") {
        statusKh = "✓ វត្តមាន";
        statusStyle = "background: #d1fae5; color: #065f46; font-weight: 700;";
      } else if (st === "permission" || st === "ច្បាប់") {
        statusKh = "📋 មានច្បាប់";
        statusStyle = "background: #fef3c7; color: #92400e; font-weight: 700;";
      } else if (st === "absent" || st === "អវត្តមាន") {
        statusKh = "✗ អវត្តមាន";
        statusStyle = "background: #fee2e2; color: #991b1b; font-weight: 700;";
      }

      const bg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
      return `
        <tr style="background: ${bg}; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 6px 8px; text-align: center; border-right: 1px solid #e2e8f0;">${idx + 1}</td>
          <td style="padding: 6px 8px; font-weight: 600; font-family: monospace; border-right: 1px solid #e2e8f0;">${s.ID || ''}</td>
          <td style="padding: 6px 8px; font-weight: 700; border-right: 1px solid #e2e8f0;">${s.NameKh || ''}</td>
          <td style="padding: 6px 8px; border-right: 1px solid #e2e8f0;">${s.NameEn || '—'}</td>
          <td style="padding: 6px 8px; text-align: center; border-right: 1px solid #e2e8f0;">${s.Gender || '—'}</td>
          <td style="padding: 6px 8px; border-right: 1px solid #e2e8f0;">${s.Course || 'ថ្នាក់កុំព្យូទ័រ'}</td>
          <td style="padding: 6px 8px; border-right: 1px solid #e2e8f0;">${s.Shift || shiftLabel || '—'}</td>
          <td style="padding: 6px 8px; text-align: center; border-right: 1px solid #e2e8f0;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; ${statusStyle}">${statusKh}</span>
          </td>
          <td style="padding: 6px 8px;">${s.Phone || s.GuardianPhone || '—'}</td>
        </tr>
      `;
    }).join("");

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px double #1e293b; padding-bottom: 12px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: #1e1b4b; color: #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; border: 2px solid #38bdf8;">
            💻
          </div>
          <div>
            <h1 style="margin: 0; font-size: 17px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.2px;">TIS LAB COMPUTER</h1>
            <p style="margin: 2px 0 0 0; font-size: 10.5px; color: #64748b;">មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល • ខេត្តកំពត</p>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 12px; font-size: 9.5px; font-weight: 700;">
            OFFICIAL ATTENDANCE REPORT
          </span>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #64748b;">កាលបរិច្ឆេទចេញ៖ ${dateStr}</p>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 14px;">
        <h2 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 800; color: #0f172a;">${title}</h2>
        <p style="margin: 0; font-size: 11px; color: #475569;">វេនសិក្សា៖ <strong>${shiftLabel}</strong> | គ្រូទទួលបន្ទុក៖ <strong>${reporter}</strong></p>
      </div>

      <!-- KPI Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 14px;">
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px; text-align: center;">
          <div style="font-size: 10px; color: #64748b;">សិស្សសរុប</div>
          <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${total}</div>
        </div>
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 7px; text-align: center;">
          <div style="font-size: 10px; color: #166534;">វត្តមាន (${presentRate}%)</div>
          <div style="font-size: 15px; font-weight: 800; color: #15803d;">${present}</div>
        </div>
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 7px; text-align: center;">
          <div style="font-size: 10px; color: #854d0e;">មានច្បាប់</div>
          <div style="font-size: 15px; font-weight: 800; color: #b45309;">${perm}</div>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 7px; text-align: center;">
          <div style="font-size: 10px; color: #991b1b;">អវត្តមាន</div>
          <div style="font-size: 15px; font-weight: 800; color: #dc2626;">${absent}</div>
        </div>
        <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px; text-align: center;">
          <div style="font-size: 10px; color: #475569;">មិនទាន់កត់ត្រា</div>
          <div style="font-size: 15px; font-weight: 800; color: #64748b;">${unmarked}</div>
        </div>
      </div>

      <!-- Main Data Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 10px; border: 1px solid #cbd5e1; margin-bottom: 16px;">
        <thead>
          <tr style="background: #1e293b; color: #ffffff;">
            <th style="padding: 6px 6px; border: 1px solid #334155; width: 30px;">ល.រ</th>
            <th style="padding: 6px 6px; border: 1px solid #334155; width: 64px;">អត្តលេខ</th>
            <th style="padding: 6px 6px; border: 1px solid #334155;">គោត្តនាម-នាម</th>
            <th style="padding: 6px 6px; border: 1px solid #334155;">ឈ្មោះឡាតាំង</th>
            <th style="padding: 6px 6px; border: 1px solid #334155; width: 38px;">ភេទ</th>
            <th style="padding: 6px 6px; border: 1px solid #334155;">វគ្គសិក្សា</th>
            <th style="padding: 6px 6px; border: 1px solid #334155;">វេន</th>
            <th style="padding: 6px 6px; border: 1px solid #334155; width: 84px;">វត្តមាន</th>
            <th style="padding: 6px 6px; border: 1px solid #334155; width: 86px;">លេខទូរស័ព្ទ</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <!-- Signatures Footer -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding: 0 16px;">
        <div style="text-align: center; width: 200px;">
          <p style="margin: 0 0 45px 0; font-size: 11px; font-weight: 600;">គ្រូទទួលបន្ទុកថ្នាក់</p>
          <p style="margin: 0; font-size: 11.5px; font-weight: 700; border-top: 1px dashed #64748b; padding-top: 5px;">${reporter}</p>
        </div>
        <div style="text-align: center; width: 200px;">
          <p style="margin: 0 0 45px 0; font-size: 11px; font-weight: 600;">នាយកមជ្ឈមណ្ឌល</p>
          <p style="margin: 0; font-size: 11.5px; font-weight: 700; border-top: 1px dashed #64748b; padding-top: 5px;">លោកគ្រូ ខៀន ធូ</p>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Allow DOM layout and fonts to settle
    await new Promise(r => setTimeout(r, 200));

    try {
      const canvas = await h2c(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: 0,
        scrollX: 0
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPdfClass({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 8;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = contentHeight;
      let position = margin;
      const usableHeight = pageHeight - (margin * 2);

      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position = position - usableHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
        heightLeft -= usableHeight;
      }

      const pdfBlob = pdf.output('blob');
      if (container.parentNode) document.body.removeChild(container);
      return pdfBlob;
    } catch (e) {
      console.error("PDF generation failed:", e);
      if (container.parentNode) document.body.removeChild(container);
      return null;
    }
  },

  async sendTestMessage(token, chatId) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const text = `
<b>🚀 សាកល្បងការតភ្ជាប់ TIS Lab Computer Telegram Bot</b>
--------------------------------------------
✅ <b>ស្ថានភាព៖</b> បានតភ្ជាប់ជោគជ័យ!
🏫 <b>សាលា៖</b> មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS Lab Computer
⏰ <b>ពេលវេលា៖</b> ${time} • ${new Date().toISOString().split('T')[0]}
👨‍🏫 <b>អ្នកគ្រប់គ្រង៖</b> លោកគ្រូ ខៀន ធូ (071 721 0307)
--------------------------------------------
<i>ប្រព័ន្ធនឹងផ្ញើសារជូនដំណឹងស្វ័យប្រវត្តិពេលមានការចុះឈ្មោះសិស្សថ្មី, កត់ត្រាវត្តមាន, បង់ថ្លៃសិក្សា, និងការចេញវិញ្ញាបនបត្រ!</i>
    `.trim();

    return await this.sendMessage(text, token, chatId);
  },

  // 1. Trigger: New Student Enrollment Notification (ចុះឈ្មោះសិស្សថ្មី)
  async notifyNewStudent(student, registeredBy = null) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyNewStudent) return;

    const teacherName = registeredBy || (typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "លោកគ្រូ / អ្នកគ្រូ");
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = student.StartDate || new Date().toISOString().split('T')[0];

    const text = `
<b>🎉 ចុះឈ្មោះសិស្សថ្មី - TIS LAB COMPUTER</b>
--------------------------------------------
👤 <b>ឈ្មោះខ្មែរ៖</b> <b>${student.NameKh}</b>
🔤 <b>ឈ្មោះឡាតាំង៖</b> ${student.NameEn || '—'}
🆔 <b>អត្តលេខ (ID)៖</b> <code>${student.ID}</code>
⚧ <b>ភេទ៖</b> ${student.Gender || '—'}
💻 <b>វគ្គសិក្សា៖</b> <b>${student.Course || 'ថ្នាក់កុំព្យូទ័រ'}</b>
⏰ <b>វេនសិក្សា៖</b> ${student.Shift || '—'}
📞 <b>លេខទូរស័ព្ទ៖</b> ${student.Phone || '—'}
🏠 <b>អាណាព្យាបាល៖</b> ${student.GuardianPhone || '—'}
📍 <b>អាសយដ្ឋាន៖</b> ${student.Address || '—'}
📅 <b>ថ្ងៃចូលរៀន៖</b> ${dateStr}
👨‍🏫 <b>ចុះឈ្មោះដោយ៖</b> <b>${teacherName}</b>
⏱️ <b>ម៉ោងចុះឈ្មោះ៖</b> ${timeStr}
--------------------------------------------
<i>ប្រព័ន្ធគ្រប់គ្រងសិស្ស TIS Lab Computer</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 2. Trigger: Attendance Recording Notification (កត់ត្រាវត្តមានសិស្សទោល - បិទជាលំនាំដើមដើម្បីកុំឱ្យ Spam សារ)
  async notifyAttendance(student, timeStr, dateStr, status = "Present", teacherName = null) {
    const config = this.getConfig();
    // Only send if explicitly enabled for individual student notifications (default: false per user requirement)
    if (!config.enabled || !config.notifyIndividualAttendance) return;

    const statusKh = status === "Present" ? "មានវត្តមាន (Present) ✓" :
                     (status === "Permission" ? "មានច្បាប់អនុញ្ញាត (Permission) 📋" : "អវត្តមានឥតច្បាប់ (Absent) ❌");
    const statusIcon = status === "Present" ? "✅" : (status === "Permission" ? "📋" : "⚠️");
    const recorder = teacherName || (typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "ស្កេនកាត / QR Code");

    const text = `
<b>🎓 វត្តមានសិស្ស - TIS LAB COMPUTER</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code>
💻 <b>វគ្គសិក្សា៖</b> ${student.Course || 'ថ្នាក់កុំព្យូទ័រ'} (${student.Shift || 'វេន'})
${statusIcon} <b>ស្ថានភាព៖</b> <b>${statusKh}</b>
⏰ <b>ម៉ោងកត់ត្រា៖</b> ${timeStr || new Date().toLocaleTimeString()}
📅 <b>កាលបរិច្ឆេទ៖</b> ${dateStr || new Date().toISOString().split('T')[0]}
👨‍🏫 <b>កត់ត្រាដោយ៖</b> ${recorder}
--------------------------------------------
<i>ប្រព័ន្ធកត់ត្រាវត្តមាន TIS Lab Computer</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 3. Trigger: Tuition Fee Payment Notification
  async notifyPayment(student, fee) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyPayment) return;

    const text = `
<b>💰 ការបង់ថ្លៃសិក្សា - TIS LAB COMPUTER</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code>
💻 <b>វគ្គសិក្សា៖</b> ${fee.course || student.Course || 'Typing'}
💵 <b>ចំនួនទឹកប្រាក់៖</b> <b>$${fee.paidAmount || 50}</b> (បង់គ្រប់ចំនួន)
🧾 <b>លេខវិក្កយបត្រ៖</b> <code>${fee.receiptNo || 'INV-2026-001'}</code>
💳 <b>វិធីសាស្ត្រទូទាត់៖</b> ${fee.paymentMethod || 'ABA KHQR'}
📅 <b>កាលបរិច្ឆេទ៖</b> ${fee.date || new Date().toISOString().split('T')[0]}
✅ <b>ស្ថានភាព៖</b> បានបង់រួចរាល់ (Paid) ✓
--------------------------------------------
<i>មជ្ឈមណ្ឌលបណ្តុះបណ្តាលកុំព្យូទ័ររដ្ឋបាល TIS Lab Computer</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 4. Trigger: Exam Passed Notification
  async notifyExamPassed(student, courseName, score, grade) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyExam) return;

    const text = `
<b>🏆 លទ្ធផលប្រឡងបញ្ចប់វគ្គ - TIS LAB COMPUTER</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code>
💻 <b>វិញ្ញាសា៖</b> ${courseName}
📊 <b>ពិន្ទុទទួលបាន៖</b> <b>${score}/100</b>
🎖️ <b>និទ្ទេស៖</b> Grade <b>${grade}</b>
🎉 <b>លទ្ធផល៖</b> ជាប់ជាស្ថាពរ (PASSED) ✓
--------------------------------------------
<i>អបអរសាទរការបញ្ចប់វគ្គដោយជោគជ័យ!</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 5. Trigger: Certificate Issued Notification
  async notifyCertificateIssued(student, cert) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyCertificate) return;

    const text = `
<b>🎓 វិញ្ញាបនបត្របញ្ចប់ការសិក្សាឌីជីថល</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code>
📜 <b>លេខវិញ្ញាបនបត្រ៖</b> <code>${cert.certId}</code>
🎖️ <b>និទ្ទេសកិត្តិយស៖</b> Grade <b>${cert.gpa}</b> (ពិន្ទុមធ្យម ${cert.overallScore}%)
📅 <b>កាលបរិច្ឆេទចេញ៖</b> ${cert.issueDate}
👨‍🏫 <b>នាយកមជ្ឈមណ្ឌល៖</b> លោកគ្រូ ខៀន ធូ
--------------------------------------------
<i>វិញ្ញាបនបត្រមានសុពលភាពជាផ្លូវការ និងមាន Verification QR Code</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 6. Trigger: Leave Request Alert
  async sendLeaveRequestAlert(leaveReq) {
    const config = this.getConfig();
    if (!config.enabled || !config.notifyLeaveRequest) return;

    const text = `
<b>📝 សំណើសុំច្បាប់អវត្តមានថ្មី - TIS LAB COMPUTER</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${leaveReq.studentNameKh}</b>
🆔 <b>អត្តលេខ៖</b> <code>${leaveReq.studentId}</code>
📅 <b>កាលបរិច្ឆេទសុំឈប់៖</b> ${leaveReq.startDate} ដល់ ${leaveReq.endDate}
💬 <b>មូលហេតុ៖</b> ${leaveReq.reason}
📞 <b>លេខទូរស័ព្ទ៖</b> ${leaveReq.phone || '—'}
⏰ <b>ពេលស្នើសុំ៖</b> ${new Date(leaveReq.createdAt).toLocaleString('km-KH')}
--------------------------------------------
<i>សូមលោកគ្រូចូលប្រព័ន្ធ TIS Lab Computer ដើម្បីពិនិត្យ និងយល់ព្រម (Approve)</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 7. Trigger: Leave Status Alert
  async sendLeaveStatusAlert(leaveReq) {
    const config = this.getConfig();
    if (!config.enabled) return;

    const isApproved = leaveReq.status === "approved";
    const text = `
<b>${isApproved ? '✅ ច្បាប់អវត្តមានត្រូវបានយល់ព្រម' : '❌ ច្បាប់អវត្តមានត្រូវបានបដិសេធ'}</b>
--------------------------------------------
👤 <b>សិស្ស៖</b> <b>${leaveReq.studentNameKh}</b> (<code>${leaveReq.studentId}</code>)
📅 <b>កាលបរិច្ឆេទ៖</b> ${leaveReq.startDate} ដល់ ${leaveReq.endDate}
👨‍🏫 <b>អនុម័តដោយ៖</b> ${leaveReq.approvedBy || 'លោកគ្រូ ខៀន ធូ'}
📊 <b>ស្ថានភាព៖</b> ${isApproved ? 'យល់ព្រម (Approved) ✓' : 'បដិសេធ (Rejected)'}
--------------------------------------------
<i>ប្រព័ន្ធបានកត់ត្រាវត្តមានជាស្វ័យប្រវត្តិក្នុង TIS Lab Computer</i>
    `.trim();

    await this.sendMessage(text);
  },

  // 8. Trigger: Daily Attendance Summary at 7:00 PM (របាយការណ៍វត្តមានសរុបប្រចាំថ្ងៃនៅម៉ោង ៧:០០ យប់)
  async sendDailyAttendanceSummary(targetDateStr = null, forceSend = false, triggeredBy = null) {
    const config = this.getConfig();
    if (!config.enabled) {
      return { success: false, error: "Telegram Bot មិនទាន់បានបើកដំណើរការ (Disabled)" };
    }
    if (!forceSend && config.notifyDailyAttendanceSummary === false) {
      return { success: false, error: "ការជូនដំណឹងរបាយការណ៍វត្តមានសរុបប្រចាំថ្ងៃត្រូវបានបិទ" };
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;
    const dateStr = targetDateStr || todayStr;

    // Check duplicate sending for today unless forced
    const sentKey = `ms_daily_att_sent_${dateStr}`;
    if (!forceSend && localStorage.getItem(sentKey)) {
      console.log(`[TelegramService] Daily attendance summary for ${dateStr} has already been sent.`);
      return { success: false, error: `បានផ្ញើរួចរាល់ហើយសម្រាប់ថ្ងៃ ${dateStr}` };
    }

    // Get all students
    let students = [];
    if (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents) {
      students = StudentAPI.getLocalStudents();
    }
    if ((!students || students.length === 0) && typeof App !== "undefined" && App.state && App.state.students) {
      students = App.state.students;
    }

    // Filter active students
    const activeStudents = (students || []).filter(s => s.Status !== "Dropped" && s.Status !== "Graduated");
    const totalActive = activeStudents.length;

    // Get attendance records for this date
    let allAttendance = {};
    if (typeof StudentAPI !== "undefined" && StudentAPI.getAllAttendance) {
      allAttendance = StudentAPI.getAllAttendance();
    }
    const dayRecords = allAttendance[dateStr] || {};
    const recordedIds = Object.keys(dayRecords);

    // If no attendance has been recorded at all and not forced, skip
    if (!forceSend && recordedIds.length === 0) {
      console.log(`[TelegramService] No attendance recorded for ${dateStr}, skipping daily summary.`);
      return { success: false, error: "មិនទាន់មានទិន្នន័យវត្តមានសម្រាប់ថ្ងៃនេះឡើយ" };
    }

    let presentCount = 0;
    let permissionCount = 0;
    let absentCount = 0;
    let unmarkedCount = 0;

    const absentStudents = [];
    const permissionStudents = [];

    const shiftStats = {
      morning: { label: "វេនព្រឹក (08:00 - 09:00)", present: 0, permission: 0, absent: 0, total: 0 },
      noon: { label: "វេនថ្ងៃ (15:00 - 16:00)", present: 0, permission: 0, absent: 0, total: 0 },
      evening: { label: "វេនរសៀល (17:00 - 18:00)", present: 0, permission: 0, absent: 0, total: 0 }
    };

    activeStudents.forEach(s => {
      const status = dayRecords[s.ID];
      let shiftKey = "morning";
      if (s.Shift) {
        if (s.Shift.includes("ថ្ងៃ")) shiftKey = "noon";
        else if (s.Shift.includes("រសៀល") || s.Shift.includes("យប់")) shiftKey = "evening";
      }
      shiftStats[shiftKey].total++;

      if (status === "Present" || status === "វត្តមាន") {
        presentCount++;
        shiftStats[shiftKey].present++;
      } else if (status === "Permission" || status === "ច្បាប់") {
        permissionCount++;
        shiftStats[shiftKey].permission++;
        permissionStudents.push(s);
      } else if (status === "Absent" || status === "អវត្តមាន") {
        absentCount++;
        shiftStats[shiftKey].absent++;
        absentStudents.push(s);
      } else {
        unmarkedCount++;
      }
    });

    const presentPct = totalActive > 0 ? Math.round((presentCount / totalActive) * 100) : 0;
    const permissionPct = totalActive > 0 ? Math.round((permissionCount / totalActive) * 100) : 0;
    const absentPct = totalActive > 0 ? Math.round((absentCount / totalActive) * 100) : 0;

    // Khmer formatted date
    const daysKh = ["ថ្ងៃអាទិត្យ", "ថ្ងៃចន្ទ", "ថ្ងៃអង្គារ", "ថ្ងៃពុធ", "ថ្ងៃព្រហស្បតិ៍", "ថ្ងៃសុក្រ", "ថ្ងៃសៅរ៍"];
    const monthsKh = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const targetDateObj = new Date(dateStr + "T12:00:00");
    const khDay = daysKh[targetDateObj.getDay()];
    const khDate = targetDateObj.getDate();
    const khMonth = monthsKh[targetDateObj.getMonth()];
    const khYear = targetDateObj.getFullYear();
    const khmerDateStr = `${khDay} ទី${khDate} ខែ${khMonth} ឆ្នាំ${khYear} (${dateStr})`;

    const reporter = triggeredBy || (typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "ប្រព័ន្ធស្វ័យប្រវត្តិ TIS Lab Computer");
    const reportTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let detailList = "";
    if (absentStudents.length > 0) {
      detailList += `❌ <b>អវត្តមានឥតច្បាប់ (${absentStudents.length} នាក់)៖</b>\n`;
      absentStudents.forEach((s, i) => {
        detailList += `  ${i + 1}. <b>${s.NameKh}</b> (<code>${s.ID}</code>) • ${s.Shift || 'វេន'} • ${s.Phone || 'គ្មានលេខ'}\n`;
      });
    }
    if (permissionStudents.length > 0) {
      if (detailList) detailList += "\n";
      detailList += `📋 <b>មានច្បាប់អនុញ្ញាត (${permissionStudents.length} នាក់)៖</b>\n`;
      permissionStudents.forEach((s, i) => {
        detailList += `  ${i + 1}. <b>${s.NameKh}</b> (<code>${s.ID}</code>) • ${s.Shift || 'វេន'}\n`;
      });
    }
    if (!detailList) {
      detailList = "🎉 <b>អបអរសាទរ! សិស្សានុសិស្សទាំងអស់មានវត្តមាន ១០០% ពេញលេញ (គ្មានអវត្តមានឡើយ)</b>";
    }

    const text = `
<b>📊 របាយការណ៍វត្តមានសរុបប្រចាំថ្ងៃ - TIS LAB COMPUTER</b>
━━━━━━━━━━━━━━━━━━━━
📅 <b>កាលបរិច្ឆេទ៖</b> ${khmerDateStr}
⏰ <b>ម៉ោងរាយការណ៍៖</b> ${reportTime} (កំណត់ស្វ័យប្រវត្តិ ៧:០០ យប់)
👨‍🏫 <b>រាយការណ៍ដោយ៖</b> <b>${reporter}</b>

📈 <b>ស្ថិតិវត្តមានរួម (Overall Summary)៖</b>
• 👨‍🎓 សិស្សសរុប៖ <b>${totalActive}</b> នាក់
• ✅ <b>មានវត្តមាន៖</b> <b>${presentCount}</b> នាក់ (<b>${presentPct}%</b>)
• 📋 <b>មានច្បាប់៖</b> <b>${permissionCount}</b> នាក់ (${permissionPct}%)
• ❌ <b>អវត្តមាន៖</b> <b>${absentCount}</b> នាក់ (${absentPct}%)
${unmarkedCount > 0 ? `• ⏳ <b>មិនទាន់កត់ត្រា៖</b> <b>${unmarkedCount}</b> នាក់\n` : ''}
━━━━━━━━━━━━━━━━━━━━
⏰ <b>បែងចែកតាមវេនសិក្សា (By Shifts)៖</b>
☀️ <b>វេនព្រឹក (08:00 - 09:00)៖</b>
   - វត្តមាន: <b>${shiftStats.morning.present}</b> | ច្បាប់: <b>${shiftStats.morning.permission}</b> | អវត្តមាន: <b>${shiftStats.morning.absent}</b>
🌤️ <b>វេនថ្ងៃ (15:00 - 16:00)៖</b>
   - វត្តមាន: <b>${shiftStats.noon.present}</b> | ច្បាប់: <b>${shiftStats.noon.permission}</b> | អវត្តមាន: <b>${shiftStats.noon.absent}</b>
🌙 <b>វេនរសៀល (17:00 - 18:00)៖</b>
   - វត្តមាន: <b>${shiftStats.evening.present}</b> | ច្បាប់: <b>${shiftStats.evening.permission}</b> | អវត្តមាន: <b>${shiftStats.evening.absent}</b>

━━━━━━━━━━━━━━━━━━━━
${detailList}
━━━━━━━━━━━━━━━━━━━━
<i>ប្រព័ន្ធកត់ត្រាវត្តមានស្វ័យប្រវត្តិតាម Telegram Bot - TIS Lab Computer</i>
    `.trim();

    const ok = await this.sendMessage(text);
    if (ok) {
      localStorage.setItem(sentKey, Date.now().toString());
      if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
        try {
          firebase.database().ref(`reports/daily_attendance/${dateStr}`).set({
            sentAt: new Date().toISOString(),
            triggeredBy: reporter,
            totalActive,
            presentCount,
            permissionCount,
            absentCount,
            unmarkedCount
          });
        } catch (e) {}
      }

      // Generate and send Daily Attendance Excel (.xlsx)
      try {
        const allStudentsWithStatus = activeStudents.map(s => ({
          ...s,
          attendanceStatus: dayRecords[s.ID] || "Unmarked"
        }));
        const excelBlob = this.generateAttendanceExcel(
          allStudentsWithStatus,
          "របាយការណ៍វត្តមានសរុបប្រចាំថ្ងៃ (គ្រប់វេនសិក្សា)",
          dateStr,
          "គ្រប់វេនទាំងអស់",
          reporter
        );
        if (excelBlob) {
          const excelName = `Daily_Attendance_All_Shifts_${dateStr}.xlsx`;
          await this.sendDocument(
            excelBlob,
            excelName,
            `📊 <b>របាយការណ៍វត្តមានសរុបប្រចាំថ្ងៃ Excel (.xlsx)</b>\n🏫 TIS Lab Computer | <b>គ្រប់វេនទាំងអស់</b>\n📅 ${khmerDateStr}`
          );
        }
      } catch (errExcel) {
        console.warn("Daily Excel generation/sending error:", errExcel);
      }

      // Generate and send Daily Attendance PDF (.pdf)
      try {
        const allStudentsWithStatus = activeStudents.map(s => ({
          ...s,
          attendanceStatus: dayRecords[s.ID] || "Unmarked"
        }));
        const pdfBlob = await this.generateAttendancePdf(
          allStudentsWithStatus,
          "របាយការណ៍វត្តមានសរុបប្រចាំថ្ងៃ (គ្រប់វេនសិក្សា)",
          dateStr,
          "គ្រប់វេនទាំងអស់",
          reporter
        );
        if (pdfBlob) {
          const pdfName = `Daily_Attendance_All_Shifts_${dateStr}.pdf`;
          await this.sendDocument(
            pdfBlob,
            pdfName,
            `📑 <b>ឯកសារវត្តមានផ្លូវការ PDF (.pdf)</b>\n🏫 TIS Lab Computer | <b>គ្រប់វេនទាំងអស់</b>\n📅 ${khmerDateStr}`
          );
        }
      } catch (errPdf) {
        console.warn("Daily PDF generation/sending error:", errPdf);
      }

      return { success: true, message: "បានផ្ញើរបាយការណ៍វត្តមានសរុប និងឯកសារ PDF & Excel ទៅ Telegram ដោយជោគជ័យ!" };
    } else {
      return { success: false, error: "មិនអាចបញ្ជូនសារទៅកាន់ Telegram API បានទេ សូមពិនិត្យ Chat ID / Token" };
    }
  },

  // 9. Auto-Scheduler: Periodic check for 7:00 PM (19:00) Trigger
  _schedulerInterval: null,

  initDailyAttendanceScheduler() {
    if (this._schedulerInterval) return;

    // Check immediately on startup
    this.checkDailyAttendanceTrigger();

    // Check every 60 seconds
    this._schedulerInterval = setInterval(() => {
      this.checkDailyAttendanceTrigger();
    }, 60000);

    // Restore any pending 5-minute shift timers from localStorage
    this.restorePendingShiftTimers();

    // Start background group listener for leave requests & commands
    this.startGroupListener();

    console.log("⏰ Telegram 7:00 PM Daily Attendance Summary, Shift Debounce & Group Leave Listener Initialized");
  },

  checkDailyAttendanceTrigger() {
    try {
      const config = this.getConfig();
      if (!config.enabled || config.notifyDailyAttendanceSummary === false) return;

      const now = new Date();
      const targetTime = config.dailyAttendanceTime || "19:00"; // Default: 7:00 PM
      const [targetH, targetM] = targetTime.split(":").map(n => parseInt(n, 10));

      const currH = now.getHours();
      const currM = now.getMinutes();

      // Trigger if current time is on or after target time (e.g., 19:00+)
      if (currH > targetH || (currH === targetH && currM >= targetM)) {
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const todayStr = `${y}-${m}-${d}`;

        const sentKey = `ms_daily_att_sent_${todayStr}`;
        if (!localStorage.getItem(sentKey)) {
          console.log(`[TelegramService] 7:00 PM reached! Auto-sending daily attendance summary for ${todayStr}...`);
          this.sendDailyAttendanceSummary(todayStr, false, "Auto-Scheduler (៧:០០ យប់)").then(res => {
            if (res.success && typeof App !== "undefined" && App.showToast) {
              App.showToast("🚀 Telegram Bot បានផ្ញើរបាយការណ៍វត្តមានសរុបប្រចាំថ្ងៃនៅម៉ោង ៧:០០ យប់ រួចរាល់!", "success");
            }
          });
        }
      }
    } catch (e) {
      console.warn("Scheduler check error:", e);
    }
  },

  // =========================================================================
  // 10. Consolidated Shift Attendance Summary (5-Minute Debounced Auto Sender)
  // =========================================================================
  _shiftTimers: {},
  _shiftTimerListeners: [],

  normalizeShift(shiftStr = "") {
    const s = String(shiftStr || "").trim().toLowerCase();
    if (s.includes("យប់") || s.includes("night") || s.includes("5-6") || s.includes("៥-៦")) {
      return { id: "យប់", key: "night", label: "វេនយប់ (ម៉ោង៥-៦)", icon: "🌙", defaultTitle: "រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនយប់ (ម៉ោង៥-៦)" };
    }
    if (s.includes("រសៀល") || s.includes("afternoon") || s.includes("ថ្ងៃ") || s.includes("noon")) {
      return { id: "រសៀល", key: "afternoon", label: "វេនរសៀល", icon: "☀️", defaultTitle: "រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនរសៀល" };
    }
    return { id: "ព្រឹក", key: "morning", label: "វេនព្រឹក", icon: "🌅", defaultTitle: "រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនព្រឹក" };
  },

  onShiftTimerChange(callback) {
    if (typeof callback === "function") {
      this._shiftTimerListeners.push(callback);
    }
  },

  notifyShiftTimerListeners() {
    const active = this.getActiveShiftTimers();
    this._shiftTimerListeners.forEach(cb => {
      try { cb(active); } catch (e) {}
    });
  },

  getActiveShiftTimers() {
    const active = [];
    const now = Date.now();
    Object.keys(this._shiftTimers).forEach(key => {
      const item = this._shiftTimers[key];
      if (item && item.triggerAt > now) {
        active.push({
          key,
          shift: item.shift,
          shiftInfo: this.normalizeShift(item.shift),
          dateStr: item.dateStr,
          triggerAt: item.triggerAt,
          remainingSecs: Math.max(0, Math.ceil((item.triggerAt - now) / 1000)),
          teacherName: item.teacherName
        });
      }
    });
    return active;
  },

  scheduleShiftAttendanceSummary(shift, dateStr = null, teacherName = null, delayMinutes = null) {
    const config = this.getConfig();
    if (!config.enabled || config.notifyShiftAttendanceSummary === false) {
      return;
    }

    const todayStr = dateStr || this.getLocalDateStr();
    const shiftInfo = this.normalizeShift(shift);
    const key = `${shiftInfo.id}_${todayStr}`;
    const delay = (delayMinutes !== null && delayMinutes !== undefined) ? delayMinutes : (config.shiftAttendanceDelayMinutes || 5);
    const durationMs = Math.max(1000, Math.round(delay * 60 * 1000));
    const triggerAt = Date.now() + durationMs;

    // 1. Clear existing timer if any for this shift
    if (this._shiftTimers[key]) {
      if (this._shiftTimers[key].timeoutId) clearTimeout(this._shiftTimers[key].timeoutId);
      if (this._shiftTimers[key].intervalId) clearInterval(this._shiftTimers[key].intervalId);
    }

    // 2. Persist to localStorage so timer survives page navigation/refresh
    try {
      localStorage.setItem(`ms_shift_att_timer_${key}`, JSON.stringify({
        shift: shiftInfo.id,
        dateStr: todayStr,
        triggerAt,
        teacherName: teacherName || null
      }));
    } catch (e) {}

    // 3. Start countdown interval for real-time UI updates
    const intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((triggerAt - now) / 1000));
      if (this._shiftTimers[key]) {
        this._shiftTimers[key].remainingSecs = remaining;
      }
      this.notifyShiftTimerListeners();
    }, 1000);

    // 4. Start main timeout
    const timeoutId = setTimeout(() => {
      if (this._shiftTimers[key] && this._shiftTimers[key].intervalId) {
        clearInterval(this._shiftTimers[key].intervalId);
      }
      delete this._shiftTimers[key];
      try { localStorage.removeItem(`ms_shift_att_timer_${key}`); } catch (e) {}
      this.notifyShiftTimerListeners();

      this.sendShiftAttendanceSummary(shiftInfo.id, todayStr, teacherName, true);
    }, durationMs);

    this._shiftTimers[key] = {
      timeoutId,
      intervalId,
      triggerAt,
      remainingSecs: Math.round(durationMs / 1000),
      shift: shiftInfo.id,
      dateStr: todayStr,
      teacherName
    };

    console.log(`⏱️ [TelegramService] Scheduled 5-minute delayed shift summary for ${shiftInfo.label} on ${todayStr} (in ${delay} mins)`);
    this.notifyShiftTimerListeners();
  },

  cancelShiftAttendanceTimer(shift, dateStr = null) {
    const todayStr = dateStr || this.getLocalDateStr();
    const shiftInfo = this.normalizeShift(shift);
    const key = `${shiftInfo.id}_${todayStr}`;
    if (this._shiftTimers[key]) {
      if (this._shiftTimers[key].timeoutId) clearTimeout(this._shiftTimers[key].timeoutId);
      if (this._shiftTimers[key].intervalId) clearInterval(this._shiftTimers[key].intervalId);
      delete this._shiftTimers[key];
    }
    try { localStorage.removeItem(`ms_shift_att_timer_${key}`); } catch (e) {}
    this.notifyShiftTimerListeners();
  },

  async sendShiftAttendanceSummary(shift, targetDateStr = null, triggeredBy = null, isAuto = false) {
    const config = this.getConfig();
    if (!config.enabled) {
      return { success: false, error: "Telegram Bot មិនទាន់បានបើកដំណើរការ (Disabled)" };
    }

    const todayStr = targetDateStr || this.getLocalDateStr();
    const shiftInfo = this.normalizeShift(shift);
    const key = `${shiftInfo.id}_${todayStr}`;

    // Clean up active timer if manually triggered or finishing
    this.cancelShiftAttendanceTimer(shift, todayStr);

    // Get all students
    let students = [];
    if (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents) {
      students = StudentAPI.getLocalStudents();
    }
    if ((!students || students.length === 0) && typeof App !== "undefined" && App.state && App.state.students) {
      students = App.state.students;
    }

    // Filter active students belonging to this shift
    const activeStudents = (students || []).filter(s => {
      if (!s) return false;
      const status = (s.Status || "").toLowerCase();
      if (s.isBlocked === true || status === "dropped" || status === "បោះបង់" || status === "graduated") return false;
      if (!s.Shift) return false;
      return this.normalizeShift(s.Shift).id === shiftInfo.id;
    });

    const totalInShift = activeStudents.length;
    if (totalInShift === 0) {
      console.log(`[TelegramService] No active students in ${shiftInfo.label}, skipping summary.`);
      return { success: false, error: `មិនមានសិស្សសកម្មក្នុង ${shiftInfo.label} ឡើយ` };
    }

    // Get attendance records (from AttendanceView if current, or StudentAPI)
    let allAttendance = {};
    if (typeof AttendanceView !== "undefined" && AttendanceView.records && Object.keys(AttendanceView.records).length > 0) {
      allAttendance = AttendanceView.records;
    } else if (typeof StudentAPI !== "undefined" && StudentAPI.getAllAttendance) {
      allAttendance = StudentAPI.getAllAttendance();
    }
    const dayRecords = allAttendance[todayStr] || {};

    let presentCount = 0;
    let permissionCount = 0;
    let absentCount = 0;
    let unmarkedCount = 0;

    const presentStudents = [];
    const permissionStudents = [];
    const absentStudents = [];
    const unmarkedStudents = [];

    activeStudents.forEach(s => {
      const status = dayRecords[s.ID];
      if (status === "Present" || status === "វត្តមាន") {
        presentCount++;
        presentStudents.push(s);
      } else if (status === "Permission" || status === "ច្បាប់") {
        permissionCount++;
        permissionStudents.push(s);
      } else if (status === "Absent" || status === "អវត្តមាន") {
        absentCount++;
        absentStudents.push(s);
      } else {
        unmarkedCount++;
        unmarkedStudents.push(s);
      }
    });

    // If auto-triggered but no student has attendance recorded at all, skip
    if (presentCount === 0 && permissionCount === 0 && absentCount === 0 && !triggeredBy && isAuto) {
      console.log(`[TelegramService] No attendance recorded for ${shiftInfo.label} on ${todayStr}, skipping auto summary.`);
      return { success: false, error: `មិនទាន់មានការកត់ត្រាវត្តមានក្នុង ${shiftInfo.label} ឡើយ` };
    }

    const presentPct = Math.round((presentCount / totalInShift) * 100);
    const permissionPct = Math.round((permissionCount / totalInShift) * 100);
    const absentPct = Math.round((absentCount / totalInShift) * 100);

    // Khmer formatted date
    const daysKh = ["ថ្ងៃអាទិត្យ", "ថ្ងៃចន្ទ", "ថ្ងៃអង្គារ", "ថ្ងៃពុធ", "ថ្ងៃព្រហស្បតិ៍", "ថ្ងៃសុក្រ", "ថ្ងៃសៅរ៍"];
    const monthsKh = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const targetDateObj = new Date(todayStr + "T12:00:00");
    const khDay = daysKh[targetDateObj.getDay()];
    const khDate = targetDateObj.getDate();
    const khMonth = monthsKh[targetDateObj.getMonth()];
    const khYear = targetDateObj.getFullYear();
    const khmerDateStr = `${khDay} ទី${khDate} ខែ${khMonth} ឆ្នាំ${khYear} (${todayStr})`;

    const reporter = triggeredBy || (typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "លោកគ្រូ ខៀន ធូ");
    const reportTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let absentSection = "";
    if (absentStudents.length > 0) {
      absentSection += `❌ <b>សិស្សអវត្តមានឥតច្បាប់ (${absentStudents.length} នាក់)៖</b>\n`;
      absentStudents.forEach((s, i) => {
        const phone = s.Phone || s.GuardianPhone || "គ្មានលេខ";
        absentSection += `  ${i + 1}. <b>${s.NameKh}</b> (<code>${s.ID}</code>) • 📞 ${phone}\n`;
      });
    }

    let permissionSection = "";
    if (permissionStudents.length > 0) {
      permissionSection += `📋 <b>សិស្សមានច្បាប់អនុញ្ញាត (${permissionStudents.length} នាក់)៖</b>\n`;
      permissionStudents.forEach((s, i) => {
        permissionSection += `  ${i + 1}. <b>${s.NameKh}</b> (<code>${s.ID}</code>)\n`;
      });
    }

    let presentSection = "";
    if (presentStudents.length > 0) {
      presentSection += `✅ <b>សិស្សមានវត្តមាន (${presentStudents.length} នាក់)៖</b>\n`;
      const names = presentStudents.map((s, idx) => `${idx + 1}. <b>${s.NameKh}</b> (<code>${s.ID}</code>)`).join("\n  ");
      presentSection += `  ${names}\n`;
    }

    if (absentStudents.length === 0 && permissionStudents.length === 0 && unmarkedCount === 0) {
      absentSection = "🎉 <b>អបអរសាទរ! សិស្សក្នុងវេននេះមានវត្តមាន ១០០% ពេញលេញ</b>\n";
    }

    const triggerNote = isAuto ? "៥ នាទីក្រោយបញ្ចូលចប់ស្វ័យប្រវត្តិ" : "ផ្ញើភ្លាមៗដោយគ្រូ";

    const text = `
<b>📊 របាយការណ៍វត្តមានសរុប - ${shiftInfo.label}</b>
━━━━━━━━━━━━━━━━━━━━
📅 <b>កាលបរិច្ឆេទ៖</b> ${khmerDateStr}
⏰ <b>ម៉ោងរាយការណ៍៖</b> ${reportTime} (${triggerNote})
👨‍🏫 <b>គ្រូទទួលបន្ទុក៖</b> <b>${reporter}</b>
💻 <b>បន្ទប់សិក្សា៖</b> Lab A (១៤ ម៉ាស៊ីន)

📈 <b>ស្ថិតិវត្តមានក្នុងវេន៖</b>
• 👨‍🎓 សិស្សសរុបក្នុងវេន៖ <b>${totalInShift}</b> នាក់
• ✅ <b>មានវត្តមាន (Present)៖</b> <b>${presentCount}</b> នាក់ (<b>${presentPct}%</b>)
• 📋 <b>មានច្បាប់ (Permission)៖</b> <b>${permissionCount}</b> នាក់ (${permissionPct}%)
• ❌ <b>អវត្តមាន (Absent)៖</b> <b>${absentCount}</b> នាក់ (${absentPct}%)
${unmarkedCount > 0 ? `• ⏳ <b>មិនទាន់កត់ត្រា៖</b> <b>${unmarkedCount}</b> នាក់\n` : ''}
━━━━━━━━━━━━━━━━━━━━
${absentSection}${permissionSection ? (absentSection ? '\n' : '') + permissionSection : ''}
${presentSection}━━━━━━━━━━━━━━━━━━━━
<i>ប្រព័ន្ធកត់ត្រាវត្តមានស្វ័យប្រវត្តិតាម Telegram Bot - TIS Lab Computer</i>
    `.trim();

    const targetChatId = this.getChatIdForShift(shiftInfo.id) || config.chatId;
    const ok = await this.sendMessage(text, null, targetChatId);
    if (ok) {
      // Prepare active students list with status for this shift
      const activeStudentsWithStatus = activeStudents.map(s => ({
        ...s,
        attendanceStatus: dayRecords[s.ID] || "Unmarked"
      }));

      // Generate and send Shift Attendance Excel (.xlsx)
      try {
        const excelBlob = this.generateAttendanceExcel(
          activeStudentsWithStatus,
          `តារាងវត្តមានសិស្ស - ${shiftInfo.label}`,
          todayStr,
          shiftInfo.label,
          reporter
        );
        if (excelBlob) {
          const excelName = `Attendance_${shiftInfo.key}_${todayStr}.xlsx`;
          await this.sendDocument(
            excelBlob,
            excelName,
            `📊 <b>តារាងវត្តមានសិស្ស Excel (.xlsx)</b>\n🏫 TIS Lab Computer | <b>${shiftInfo.label}</b>\n📅 ${khmerDateStr}`,
            null,
            targetChatId
          );
        }
      } catch (errExcel) {
        console.warn("Shift Excel send error:", errExcel);
      }

      // Generate and send Shift Attendance PDF (.pdf)
      try {
        const pdfBlob = await this.generateAttendancePdf(
          activeStudentsWithStatus,
          `តារាងវត្តមានសិស្ស - ${shiftInfo.label}`,
          todayStr,
          shiftInfo.label,
          reporter
        );
        if (pdfBlob) {
          const pdfName = `Attendance_${shiftInfo.key}_${todayStr}.pdf`;
          await this.sendDocument(
            pdfBlob,
            pdfName,
            `📑 <b>ឯកសារវត្តមានផ្លូវការ PDF (.pdf)</b>\n🏫 TIS Lab Computer | <b>${shiftInfo.label}</b>\n📅 ${khmerDateStr}`,
            null,
            targetChatId
          );
        }
      } catch (errPdf) {
        console.warn("Shift PDF send error:", errPdf);
      }

      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`🚀 Telegram Bot បានផ្ញើរបាយការណ៍ ${shiftInfo.label} និងឯកសារ PDF & Excel ដោយជោគជ័យ!`, "success");
      }
      return { success: true, message: `បានផ្ញើរបាយការណ៍វត្តមានសរុប ${shiftInfo.label} និងឯកសារ PDF & Excel ទៅ Telegram ជោគជ័យ!` };
    } else {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`⚠️ មិនអាចផ្ញើសារសរុបទៅ Telegram បានទេ សូមពិនិត្យ Chat ID / Token`, "error");
      }
      return { success: false, error: "បរាជ័យក្នុងការផ្ញើសារ Telegram" };
    }
  },

  restorePendingShiftTimers() {
    try {
      const now = Date.now();
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("ms_shift_att_timer_")) {
          keys.push(key);
        }
      }

      keys.forEach(key => {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const data = JSON.parse(raw);
            const remainingMs = data.triggerAt - now;
            if (remainingMs <= 0) {
              localStorage.removeItem(key);
              this.sendShiftAttendanceSummary(data.shift, data.dateStr, data.teacherName, true);
            } else {
              const remainingMinutes = remainingMs / (60 * 1000);
              this.scheduleShiftAttendanceSummary(data.shift, data.dateStr, data.teacherName, remainingMinutes);
            }
          }
        } catch (err) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn("Restore shift timers warning:", e);
    }
  },

  // =========================================================================
  // 11. TELEGRAM GROUP LISTENER: AUTO CAPTURE STUDENT LEAVE REQUESTS & COMMANDS
  // =========================================================================
  _groupPollInterval: null,
  _isPolling: false,

  startGroupListener() {
    if (this._groupPollInterval) return;

    // Run initial poll after 3 seconds
    setTimeout(() => this.pollGroupUpdates(), 3000);

    // Poll every 6 seconds
    this._groupPollInterval = setInterval(() => {
      this.pollGroupUpdates();
    }, 6000);

    console.log("🤖 Telegram Group Listener for Student Leave Requests & Commands Running (6s Poll)");
  },

  stopGroupListener() {
    if (this._groupPollInterval) {
      clearInterval(this._groupPollInterval);
      this._groupPollInterval = null;
    }
  },

  async pollGroupUpdates() {
    if (this._isPolling) return;
    const config = this.getConfig();
    if (!config.enabled) return;

    const token = (config.botToken || (typeof APP_CONFIG !== "undefined" && APP_CONFIG.telegramConfig && APP_CONFIG.telegramConfig.botToken) || "").trim();
    if (!token) return;

    this._isPolling = true;
    try {
      const lastUpdateId = Number(localStorage.getItem("tis_last_tg_update_id") || "0");
      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&limit=20&timeout=0`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          localStorage.setItem("tis_last_tg_update_id", String(update.update_id));
          const msg = update.message || update.channel_post || update.edited_message;
          if (msg) {
            await this.handleIncomingGroupMessage(msg, token);
          }
        }
      }
    } catch (err) {
      // Network timeout or background throttle - silent fail
    } finally {
      this._isPolling = false;
    }
  },

  async handleIncomingGroupMessage(msg, token) {
    if (!msg || !msg.chat) return;
    const chatId = msg.chat.id;
    const text = String(msg.text || msg.caption || "").trim();
    if (!text) return;

    const lower = text.toLowerCase();
    const replyToId = msg.message_id;

    // 1. Leave Request Command or Natural Khmer Notice
    const isLeave = lower.startsWith("/leave") || 
                    lower.startsWith("/ច្បាប់") || 
                    lower.startsWith("/សុំច្បាប់") || 
                    lower.startsWith("/permission") ||
                    text.includes("សុំច្បាប់") || 
                    text.includes("សុំឈប់") ||
                    (lower.includes("ច្បាប់") && (text.includes("ឈឺ") || text.includes("ធុរៈ") || text.includes("រវល់")));

    if (isLeave) {
      await this.handleLeaveRequestMessage(text, chatId, msg.from, replyToId, token);
      return;
    }

    // 2. Student Exam Scores Command (/score, /grade, /ពិន្ទុ)
    if (lower.startsWith("/score") || lower.startsWith("/grade") || lower.startsWith("/ពិន្ទុ")) {
      await this.handleStudentScoreMessage(text, chatId, replyToId, token);
      return;
    }

    // 3. Student Attendance Stats Command (/att, /វត្តមាន)
    if (lower.startsWith("/att") || lower.startsWith("/វត្តមាន")) {
      await this.handleStudentAttendanceMessage(text, chatId, replyToId, token);
      return;
    }

    // 4. Daily Homework & Practice Command (/hw, /homework, /កិច្ចការផ្ទះ, /លំហាត់)
    if (lower.startsWith("/hw") || lower.startsWith("/homework") || lower.startsWith("/កិច្ចការផ្ទះ") || lower.startsWith("/លំហាត់")) {
      await this.handleHomeworkMessage(chatId, replyToId, token);
      return;
    }

    // 5. Student Personal Info & Stats (/info)
    if (lower.startsWith("/info")) {
      await this.handleStudentInfoMessage(text, chatId, replyToId, token);
      return;
    }

    // 6. Shift Schedule (/schedule, /កាលវិភាគ, /ម៉ោងរៀន)
    if (lower.startsWith("/schedule") || lower.startsWith("/កាលវិភាគ") || lower.startsWith("/ម៉ោងរៀន")) {
      await this.handleScheduleMessage(chatId, replyToId, token);
      return;
    }

    // 7. Upcoming Holidays (/holiday, /បុណ្យ, /ឈប់សម្រាក)
    if (lower.startsWith("/holiday") || lower.startsWith("/បុណ្យ") || lower.startsWith("/ឈប់សម្រាក")) {
      await this.handleHolidayMessage(chatId, replyToId, token);
      return;
    }

    // 8. Help / Desk Guide (/help, /start, /menu, /desk, /សេវាសិស្ស)
    if (lower === "/help" || lower === "/start" || lower === "/menu" || lower === "/desk" || lower === "/សេវាសិស្ស") {
      await this.handleHelpMessage(chatId, replyToId, token);
      return;
    }

    // 9. Teacher Remote Management Commands (if authorized or private)
    if (lower === "/today" || lower === "/unpaid" || lower === "/backup") {
      if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.handleTelegramCommand) {
        await TeacherToolsService.handleTelegramCommand(text, chatId);
      }
    }
  },

  async handleLeaveRequestMessage(text, chatId, fromUser, replyToId, token) {
    const student = this.findStudentFromText(text, chatId);

    if (!student) {
      const sampleStudent = (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents) 
        ? StudentAPI.getLocalStudents()[0] 
        : null;
      const sampleId = sampleStudent ? sampleStudent.ID : "TX01";
      const sampleName = sampleStudent ? sampleStudent.NameKh : "សុខ ចាន់";

      const helpReply = `
⚠️ <b>រកមិនឃើញឈ្មោះ ឬអត្តលេខសិស្សឡើយ!</b>
━━━━━━━━━━━━━━━━━━━━
📝 <b>សូមវាយតាមទម្រង់ណាមួយដូចខាងក្រោម៖</b>
• <code>/leave ${sampleId} ឈឺក្បាល</code>
• <code>/សុំច្បាប់ ${sampleName} ជាប់ការងារគ្រួសារ</code>
• ឬ <code>សុំច្បាប់ ${sampleId} គ្រុនក្តៅសម្រាក១ថ្ងៃ</code>

<i>💡 បញ្ជាក់៖ សូមប្រាកដថាបានវាយត្រូវអត្តលេខ (ឧ. ${sampleId}) ឬឈ្មោះពេញរបស់សិស្ស។</i>
      `.trim();
      await this.sendMessage(helpReply, token, chatId, replyToId);
      return;
    }

    // Determine target date
    let targetDate = this.getLocalDateStr();
    if (text.includes("ថ្ងៃស្អែក") || text.includes("tomorrow")) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      targetDate = this.getLocalDateStr(tomorrow);
    }

    // Extract Reason
    const reason = this.extractLeaveReason(text);

    // Save leave request into StudentAPI (Auto-Approved)
    if (typeof StudentAPI !== "undefined" && StudentAPI.submitLeaveRequest) {
      await StudentAPI.submitLeaveRequest({
        studentId: student.ID,
        studentNameKh: student.NameKh,
        startDate: targetDate,
        endDate: targetDate,
        reason: reason,
        phone: student.Phone || student.GuardianPhone || "",
        status: "approved",
        approvedBy: "Telegram Bot (ស្វ័យប្រវត្តិ)",
        source: "telegram"
      });
    }

    // Auto-mark attendance permission immediately
    if (typeof StudentAPI !== "undefined" && StudentAPI.autoMarkAttendancePermission) {
      StudentAPI.autoMarkAttendancePermission(student.ID, targetDate, targetDate);
    }

    // Date in Khmer
    const targetObj = new Date(targetDate + "T12:00:00");
    const daysKh = ["ថ្ងៃអាទិត្យ", "ថ្ងៃចន្ទ", "ថ្ងៃអង្គារ", "ថ្ងៃពុធ", "ថ្ងៃព្រហស្បតិ៍", "ថ្ងៃសុក្រ", "ថ្ងៃសៅរ៍"];
    const monthsKh = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const khmerDateStr = `${daysKh[targetObj.getDay()]} ទី${targetObj.getDate()} ខែ${monthsKh[targetObj.getMonth()]} ឆ្នាំ${targetObj.getFullYear()}`;

    // Play chime sound and toast notification in App UI
    if (typeof App !== "undefined") {
      if (App.showToast) {
        App.showToast(`📋 សិស្ស «${student.NameKh}» (${student.Shift || 'វេន'}) បានសុំច្បាប់តាម Telegram! ប្រព័ន្ធកត់ត្រាវត្តមានរួចរាល់។`, "success");
      }
      if (App.triggerConfetti) {
        App.triggerConfetti();
      }
    }
    this.playNotificationSound();

    // Confirm reply back into the Telegram group
    const confirmation = `
✅ <b>បានកត់ត្រាច្បាប់ដោយជោគជ័យ (Leave Approved)!</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ (ID)៖</b> <code>${student.ID}</code>
⏰ <b>វេនសិក្សា៖</b> ${student.Shift || 'ថ្នាក់កុំព្យូទ័រ'}
📅 <b>កាលបរិច្ឆេទសុំឈប់៖</b> ${khmerDateStr}
💬 <b>មូលហេតុ៖</b> ${reason}
━━━━━━━━━━━━━━━━━━━━
📊 <b>ស្ថានភាពវត្តមាន៖</b> បានកត់ត្រា <b>«មានច្បាប់ (Permission) ✓»</b> ក្នុងប្រព័ន្ធ TIS Lab ដោយស្វ័យប្រវត្តិរួចរាល់!
👨‍🏫 <b>គ្រូទទួលបន្ទុក៖</b> លោកគ្រូ ខៀន ធូ ទទួលបានដំណឹងនេះហើយ។
<i>ជូនពរប្អូនឆាប់ជាសះស្បើយ និងវិលត្រឡប់មករៀនវិញដោយជោគជ័យ! 🙏✨</i>
    `.trim();

    await this.sendMessage(confirmation, token, chatId, replyToId);
  },

  async handleStudentScoreMessage(text, chatId, replyToId, token) {
    const student = this.findStudentFromText(text, chatId);
    if (!student) {
      await this.sendMessage(`⚠️ <b>សូមវាយអត្តលេខ ឬឈ្មោះសិស្ស ដើម្បីឆែកពិន្ទុប្រឡង៖</b>\n• <code>/score TX01</code> ឬ <code>/ពិន្ទុ TX01</code>`, token, chatId, replyToId);
      return;
    }

    let exams = {};
    if (typeof StudentAPI !== "undefined" && StudentAPI.getStudentExams) {
      exams = StudentAPI.getStudentExams(student.ID) || {};
    }

    const modules = [
      { key: "Typing", name: "⌨️ វគ្គទី ១: Typing", isTyping: true },
      { key: "Word", name: "📄 វគ្គទី ២: Word" },
      { key: "Excel", name: "📊 វគ្គទី ៣: Excel" },
      { key: "PowerPoint", name: "📑 វគ្គទី ៤: PowerPoint" }
    ];

    let lines = [];
    let passedCount = 0;

    modules.forEach(m => {
      const ex = exams[m.key] || exams[m.name] || {};
      if (ex && (ex.score !== undefined || ex.wpm !== undefined || ex.status)) {
        const status = (ex.status || "").toLowerCase();
        const isPass = status === "pass" || status === "ជាប់";
        if (isPass) passedCount++;

        let scoreText = "";
        if (m.isTyping) {
          scoreText = `<b>${ex.wpm || ex.score || 0} WPM</b> (និទ្ទេស <b>${ex.grade || '—'}</b>) ${isPass ? '✅ ជាប់' : '⚠️ មិនទាន់ជាប់'}`;
        } else {
          scoreText = `<b>${ex.score || 0}/100</b> (និទ្ទេស <b>${ex.grade || '—'}</b>) ${isPass ? '✅ ជាប់' : '⚠️ មិនទាន់ជាប់'}`;
        }
        lines.push(`• ${m.name}៖ ${scoreText}`);
      } else {
        lines.push(`• ${m.name}៖ <i>មិនទាន់ប្រឡង</i>`);
      }
    });

    let overallStatus = "កំពុងសិក្សា";
    if (passedCount === 4) overallStatus = "🎓 បញ្ចប់វគ្គទាំង ៤ (Graduated)";
    else if (passedCount > 0) overallStatus = `✅ បានបញ្ចប់ ${passedCount}/4 វគ្គ`;

    const scoreCard = `
🎯 <b>ព្រឹត្តិបត្រពិន្ទុប្រឡង - TIS LAB COMPUTER</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code> | <b>វេន៖</b> ${student.Shift || 'ថ្នាក់កុំព្យូទ័រ'}
💻 <b>វគ្គកំពុងរៀន៖</b> ${student.Course || 'ថ្នាក់កុំព្យូទ័រ'}
━━━━━━━━━━━━━━━━━━━━
📊 <b>លទ្ធផលប្រឡងបញ្ចប់វគ្គទាំង ៤៖</b>
${lines.join("\n")}
━━━━━━━━━━━━━━━━━━━━
🏆 <b>ស្ថានភាពវគ្គសិក្សា៖</b> <b>${overallStatus}</b>
<i>💡 បញ្ជាក់៖ លទ្ធផលនេះត្រូវបានកត់ត្រាជាផ្លូវការក្នុងប្រព័ន្ធ TIS Lab Computer</i>
    `.trim();

    await this.sendMessage(scoreCard, token, chatId, replyToId);
  },

  async handleStudentAttendanceMessage(text, chatId, replyToId, token) {
    const student = this.findStudentFromText(text, chatId);
    if (!student) {
      await this.sendMessage(`⚠️ <b>សូមវាយអត្តលេខ ឬឈ្មោះសិស្ស ដើម្បីឆែកវត្តមាន៖</b>\n• <code>/att TX01</code> ឬ <code>/វត្តមាន TX01</code>`, token, chatId, replyToId);
      return;
    }

    let totalPresent = 0;
    let totalPermission = 0;
    let totalAbsent = 0;

    if (typeof StudentAPI !== "undefined" && StudentAPI.getAllAttendance) {
      const allAtt = StudentAPI.getAllAttendance();
      Object.keys(allAtt).forEach(d => {
        const st = (allAtt[d][student.ID] || "").toLowerCase();
        if (st === "present" || st === "វត្តមាន") totalPresent++;
        else if (st === "permission" || st === "ច្បាប់" || st === "p") totalPermission++;
        else if (st === "absent" || st === "អវត្តមាន") totalAbsent++;
      });
    }

    const totalSessions = totalPresent + totalPermission + totalAbsent;
    const presentRate = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 100;

    // Visual attendance bar
    const filledBlocks = Math.min(10, Math.max(0, Math.round(presentRate / 10)));
    const emptyBlocks = 10 - filledBlocks;
    const bar = "🟩".repeat(filledBlocks) + "⬜".repeat(emptyBlocks);

    let advice = "🌟 <b>វត្តមានល្អប្រសើរណាស់!</b> សូមបន្តការខិតខំប្រឹងប្រែងដើម្បីទទួលបានវិញ្ញាបនបត្រ។";
    if (totalAbsent >= 3) {
      advice = "⚠️ <b>ប្រយ័ត្ន!</b> ប្អូនមានអវត្តមានច្រើន។ សូមកុំខកខានមករៀនដើម្បីកុំឲ្យបាត់បង់មេរៀនសំខាន់ៗ។";
    }

    const attMsg = `
📅 <b>របាយការណ៍វត្តមានសិស្ស - TIS LAB COMPUTER</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>សិស្ស៖</b> <b>${student.NameKh}</b> (${student.NameEn || ''})
🆔 <b>អត្តលេខ៖</b> <code>${student.ID}</code> | <b>វេន៖</b> ${student.Shift || '—'}
━━━━━━━━━━━━━━━━━━━━
📈 <b>អត្រាវត្តមានសរុប៖</b> <b>${presentRate}%</b>
${bar}

• ✅ វត្តមានជាក់ស្តែង៖ <b>${totalPresent}</b> ថ្ងៃ
• 📋 មានច្បាប់អនុញ្ញាត៖ <b>${totalPermission}</b> ថ្ងៃ
• ❌ អវត្តមានគ្មានច្បាប់៖ <b>${totalAbsent}</b> ថ្ងៃ
• 🔢 កត់ត្រាសរុប៖ <b>${totalSessions}</b> ថ្ងៃ
━━━━━━━━━━━━━━━━━━━━
${advice}
<i>👨‍🏫 គ្រូទទួលបន្ទុក៖ លោកគ្រូ ខៀន ធូ (071 721 0307)</i>
    `.trim();

    await this.sendMessage(attMsg, token, chatId, replyToId);
  },

  async handleHomeworkMessage(chatId, replyToId, token) {
    let hwData = null;
    try {
      const saved = localStorage.getItem("tis_active_homework");
      if (saved) hwData = JSON.parse(saved);
    } catch (e) {}

    const hwTitle = hwData?.title || "លំហាត់អនុវត្តកុំព្យូទ័រប្រចាំថ្ងៃ";
    const hwCourse = hwData?.course || "Typing & Microsoft Office";
    const hwDetails = hwData?.content || `
1. <b>Typing:</b> អនុវត្តវាយអត្ថបទខ្មែរ-អង់គ្លេស យ៉ាងតិច ១៥ នាទី (គោលដៅ 25 WPM)
2. <b>Word/Excel:</b> អនុវត្តលំហាត់តាមសៀវភៅ ឬចម្លងគំរូតារាងដែលលោកគ្រូបានដាក់
3. <b>ត្រៀមខ្លួន៖</b> យក Flash Drive (USB) មកម៉ោងបន្ទាប់ ដើម្បីចម្លងឯកសារថ្មី
    `.trim();

    const hwMsg = `
📚 <b>កិច្ចការផ្ទះ & លំហាត់អនុវត្ត - TIS LAB COMPUTER</b>
━━━━━━━━━━━━━━━━━━━━
💻 <b>វគ្គសិក្សា៖</b> ${hwCourse}
📝 <b>ប្រធានបទ៖</b> <b>${hwTitle}</b>
━━━━━━━━━━━━━━━━━━━━
${hwDetails}
━━━━━━━━━━━━━━━━━━━━
✍️ <b>ការត្រួតពិនិត្យ៖</b> លោកគ្រូនឹងពិនិត្យការអនុវត្តជាក់ស្តែងនៅម៉ោងបន្ទាប់!
<i>សូមប្អូនៗខិតខំអនុវត្តឲ្យបានទៀងទាត់ដើម្បីពង្រឹងជំនាញ។ 💪✨</i>
    `.trim();

    await this.sendMessage(hwMsg, token, chatId, replyToId);
  },

  async handleStudentInfoMessage(text, chatId, replyToId, token) {
    const student = this.findStudentFromText(text, chatId);
    if (!student) {
      await this.sendMessage(`⚠️ សូមវាយអត្តលេខ ឬឈ្មោះសិស្ស ដើម្បីឆែកព័ត៌មាន (ឧ. <code>/info TX01</code>)`, token, chatId, replyToId);
      return;
    }

    let totalPresent = 0;
    let totalPermission = 0;
    let totalAbsent = 0;

    if (typeof StudentAPI !== "undefined" && StudentAPI.getAllAttendance) {
      const allAtt = StudentAPI.getAllAttendance();
      Object.keys(allAtt).forEach(d => {
        const st = (allAtt[d][student.ID] || "").toLowerCase();
        if (st === "present" || st === "វត្តមាន") totalPresent++;
        else if (st === "permission" || st === "ច្បាប់" || st === "p") totalPermission++;
        else if (st === "absent" || st === "អវត្តមាន") totalAbsent++;
      });
    }

    const infoMsg = `
👤 <b>ព័ត៌មានសិស្ស - TIS LAB COMPUTER</b>
━━━━━━━━━━━━━━━━━━━━
• ឈ្មោះខ្មែរ៖ <b>${student.NameKh}</b>
• ឈ្មោះឡាតាំង៖ ${student.NameEn || '—'}
• អត្តលេខ៖ <code>${student.ID}</code>
• ភេទ៖ ${student.Gender || '—'}
• វគ្គសិក្សា៖ <b>${student.Course || 'Typing'}</b>
• វេនសិក្សា៖ <b>${student.Shift || '—'}</b>
• ទូរស័ព្ទ៖ <code>${student.Phone || '—'}</code>
• ស្ថានភាព៖ <b>${student.Status || 'Active'}</b>
━━━━━━━━━━━━━━━━━━━━
📊 <b>ស្ថិតិវត្តមានកន្លងមក៖</b>
• ✅ វត្តមាន៖ <b>${totalPresent}</b> ថ្ងៃ
• 📋 មានច្បាប់៖ <b>${totalPermission}</b> ថ្ងៃ
• ❌ អវត្តមាន៖ <b>${totalAbsent}</b> ថ្ងៃ
━━━━━━━━━━━━━━━━━━━━
<i>មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS Lab Computer</i>
    `.trim();

    await this.sendMessage(infoMsg, token, chatId, replyToId);
  },

  async handleScheduleMessage(chatId, replyToId, token) {
    const scheduleMsg = `
⏰ <b>កាលវិភាគម៉ោងរៀនកុំព្យូទ័រ - TIS LAB COMPUTER</b>
━━━━━━━━━━━━━━━━━━━━
🌅 <b>វេនព្រឹក៖</b> 08:00 ព្រឹក - 09:00 ព្រឹក
☀️ <b>វេនរសៀល៖</b> 14:00 - 15:00 / 15:00 - 16:00
🌙 <b>វេនយប់៖</b> 17:00 - 18:00 (ម៉ោង ៥-៦ ល្ងាច)
━━━━━━━━━━━━━━━━━━━━
💻 <b>បន្ទប់សិក្សា៖</b> Lab A (១៤ ម៉ាស៊ីនទំនើប • ម៉ាស៊ីនត្រជាក់)
📅 <b>ថ្ងៃសិក្សា៖</b> ថ្ងៃចន្ទ ដល់ ថ្ងៃសុក្រ (ឈប់សម្រាកថ្ងៃសៅរ៍-អាទិត្យ និងបុណ្យជាតិ)
👨‍🏫 <b>គ្រូទទួលបន្ទុក៖</b> លោកគ្រូ ខៀន ធូ (071 721 0307)
    `.trim();

    await this.sendMessage(scheduleMsg, token, chatId, replyToId);
  },

  async handleHolidayMessage(chatId, replyToId, token) {
    let holidayText = "មិនទាន់មានថ្ងៃឈប់សម្រាកបុណ្យជាតិនាពេលឆាប់ៗនេះឡើយ។";
    if (typeof KhmerCalendarService !== "undefined" && KhmerCalendarService.getUpcomingHolidays) {
      const upcoming = KhmerCalendarService.getUpcomingHolidays(30);
      if (upcoming.length > 0) {
        holidayText = upcoming.slice(0, 3).map((h, i) => {
          return `${i + 1}. <b>${h.title}</b> (${h.diffLabel})\n` +
                 `   📅 កាលបរិច្ឆេទ៖ ${h.formattedDateKh}\n` +
                 `   🚀 ចូលរៀនវិញ៖ ${h.resumeDateFormatted || 'ថ្ងៃបន្ទាប់'}`;
        }).join("\n\n");
      }
    }

    const msg = `
🇰🇭 <b>ប្រតិទិនថ្ងៃឈប់សម្រាកបុណ្យជាតិខាងមុខ</b>
━━━━━━━━━━━━━━━━━━━━
${holidayText}
━━━━━━━━━━━━━━━━━━━━
<i>មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS Lab Computer</i>
    `.trim();

    await this.sendMessage(msg, token, chatId, replyToId);
  },

  async handleHelpMessage(chatId, replyToId, token) {
    const portalUrl = (typeof window !== "undefined" && window.location)
      ? `${window.location.origin}${window.location.pathname}#portal`
      : "";

    const helpMsg = `
👋 <b>សួស្តីប្អូនៗសិស្សានុសិស្ស! នេះជាបញ្ជាសម្រាប់ប្រើប្រាស់ជាមួយ Bot៖</b>
━━━━━━━━━━━━━━━━━━━━
📋 <b>ការសុំច្បាប់អវត្តមាន (Leave Request)៖</b>
• <code>/leave [ID] [មូលហេតុ]</code> (ឧ. <code>/leave TX01 ឈឺក្បាល</code>)
• <code>/សុំច្បាប់ [ID ឬ ឈ្មោះ] [មូលហេតុ]</code>
<i>Bot នឹងចាប់ឈ្មោះសិស្ស និងកត់ត្រាវត្តមាន "មានច្បាប់" ចូលប្រព័ន្ធស្វ័យប្រវត្តិ!</i>

🎯 <b>ឆែកពិន្ទុ & វត្តមានផ្ទាល់ខ្លួន (Self-Service)៖</b>
• <code>/score [ID]</code> ឬ <code>/ពិន្ទុ [ID]</code> : ឆែកពិន្ទុប្រឡងបញ្ចប់វគ្គទាំង ៤
• <code>/att [ID]</code> ឬ <code>/វត្តមាន [ID]</code> : ឆែកអត្រាវត្តមាន និងចំនួនថ្ងៃមករៀន
• <code>/hw</code> ឬ <code>/កិច្ចការផ្ទះ</code> : មើលកិច្ចការផ្ទះ និងលំហាត់ត្រូវអនុវត្ត
• <code>/info [ID]</code> : មើលព័ត៌មានទូទៅរបស់សិស្ស

⏰ <b>កាលវិភាគ & ព័ត៌មានទូទៅ៖</b>
• <code>/schedule</code> : មើលកាលវិភាគម៉ោងសិក្សាទាំង ៣ វេន
• <code>/holiday</code> : ឆែកថ្ងៃឈប់សម្រាកបុណ្យជាតិខាងមុខ
• <code>/help</code> : បង្ហាញម៉ឺនុយជំនួយនេះ
━━━━━━━━━━━━━━━━━━━━
🌐 <b>ទម្រង់សុំច្បាប់ឌីជីថលតាមទូរស័ព្ទ៖</b>
<a href="${portalUrl}">ចុចទីនេះដើម្បីបើកទម្រង់សុំច្បាប់ Online</a>
━━━━━━━━━━━━━━━━━━━━
👨‍🏫 <b>ទំនាក់ទំនងលោកគ្រូ៖</b> <code>071 721 0307</code>
    `.trim();

    await this.sendMessage(helpMsg, token, chatId, replyToId);
  },

  findStudentFromText(text, chatId = null) {
    let students = [];
    if (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents) {
      students = StudentAPI.getLocalStudents();
    }
    if ((!students || students.length === 0) && typeof App !== "undefined" && App.state && App.state.students) {
      students = App.state.students;
    }

    const active = (students || []).filter(s => {
      if (!s) return false;
      const st = (s.Status || "").toLowerCase();
      return st !== "dropped" && st !== "បោះបង់";
    });

    // 1. Try matching by exact ID or ID patterns (e.g., TX01, TX-01, STU01, ID: 01, etc.)
    const idMatch = text.match(/\b(?:tx|stu|id)[-_]?\s*(\d+)\b/i) || text.match(/\b(tx[-_]?\d+)\b/i);
    if (idMatch) {
      const rawMatch = idMatch[0].replace(/\s+/g, "").toUpperCase();
      const numPart = idMatch[1];

      let found = active.find(s => s.ID.toUpperCase() === rawMatch || s.ID.replace(/\D/g, "") === numPart);
      if (found) return found;
    }

    // 2. Check standalone numbers (e.g., "001", "01", "1")
    const numberMatches = text.match(/\b\d{1,4}\b/g);
    if (numberMatches) {
      for (const num of numberMatches) {
        const numInt = parseInt(num, 10);
        const found = active.find(s => {
          const sNum = parseInt(s.ID.replace(/\D/g, ""), 10);
          return sNum === numInt;
        });
        if (found) return found;
      }
    }

    // 3. Match by Khmer Name (NameKh) - Sort longer names first
    const sortedByName = [...active].sort((a, b) => (b.NameKh || "").length - (a.NameKh || "").length);
    for (const s of sortedByName) {
      if (s.NameKh && text.includes(s.NameKh.trim())) {
        return s;
      }
    }

    // 4. Match by Latin Name (NameEn)
    for (const s of active) {
      if (s.NameEn && text.toUpperCase().includes(s.NameEn.trim().toUpperCase())) {
        return s;
      }
    }

    // 5. Contextual shift match if in a shift group
    const config = this.getConfig();
    let shiftFilter = null;
    if (config.shiftChatIds) {
      if (String(chatId) === String(config.shiftChatIds.morning)) shiftFilter = "ព្រឹក";
      else if (String(chatId) === String(config.shiftChatIds.afternoon)) shiftFilter = "រសៀល";
      else if (String(chatId) === String(config.shiftChatIds.night)) shiftFilter = "យប់";
    }

    if (shiftFilter) {
      const shiftStudents = active.filter(s => (s.Shift || "").includes(shiftFilter));
      for (const s of shiftStudents) {
        const parts = (s.NameKh || "").split(/\s+/).filter(p => p.length >= 2);
        for (const p of parts) {
          if (text.includes(p)) return s;
        }
      }
    }

    return null;
  },

  extractLeaveReason(text) {
    let cleaned = text
      .replace(/^\/(?:leave|ច្បាប់|សុំច្បាប់|permission)\b/i, "")
      .replace(/^@\w+\s*/, "")
      .replace(/សុំច្បាប់/g, "")
      .replace(/លោកគ្រូ/g, "")
      .replace(/ខ្ញុំបាទ|ខ្ញុំ/g, "")
      .replace(/ឈ្មោះ\s*[\u1780-\u17FF\w\s]+/g, "")
      .replace(/id[:\s]*\w+/gi, "")
      .replace(/tx[-_]?\d+/gi, "")
      .trim();

    if (text.includes("ឈឺក្បាល")) return "ឈឺក្បាល";
    if (text.includes("ឈឺពោះ")) return "ឈឺពោះ";
    if (text.includes("ក្តៅខ្លួន") || text.includes("គ្រុនក្តៅ") || text.includes("ផ្តាសាយ")) return "ក្តៅខ្លួន / គ្រុនផ្តាសាយ";
    if (text.includes("ឈឺ") || text.includes("មិនស្រួលខ្លួន")) return "ឈឺ / មិនស្រួលខ្លួន";
    if (text.includes("ការងារគ្រួសារ") || text.includes("ធុរៈគ្រួសារ")) return "ជាប់ការងារគ្រួសារ";
    if (text.includes("ជាប់រវល់") || text.includes("ធុរៈ")) return "មានធុរៈចាំបាច់";
    if (text.includes("ជួបគ្រោះថ្នាក់") || text.includes("ខូចម៉ូតូ")) return "ខូចមធ្យោបាយធ្វើដំណើរ";

    return cleaned.length > 2 ? cleaned : "មានធុរៈចាំបាច់ / ឈឺ";
  },

  playNotificationSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  },

  async publishStudentDeskToShifts(targetShift = "ALL") {
    const branding = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.getSchoolBranding)
      ? TeacherToolsService.getSchoolBranding()
      : { schoolNameKh: "TIS Lab Computer", teacherTitle: "លោកគ្រូ ខៀន ធូ", phone: "071 721 0307" };

    const portalUrl = (typeof window !== "undefined" && window.location)
      ? `${window.location.origin}${window.location.pathname}#portal`
      : "";

    let shiftScope = "គ្រប់វេនសិក្សាទាំងអស់ (ព្រឹក • រសៀល • យប់)";
    if (targetShift === "ព្រឹក") shiftScope = "វេនព្រឹក (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)";
    else if (targetShift === "រសៀល") shiftScope = "វេនរសៀល (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)";
    else if (targetShift === "យប់") shiftScope = "វេនយប់ (ម៉ោង ៥-៦)";

    const deskMsg = `
📋 <b>តុសេវាសិស្ស & កន្លែងសុំច្បាប់ឌីជីថល - TIS LAB COMPUTER</b>
━━━━━━━━━━━━━━━━━━━━
🏢 <b>${branding.schoolNameKh || 'មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS LAB COMPUTER'}</b>
👥 <b>វេនសិក្សា៖</b> ${shiftScope}
👨‍🏫 <b>គ្រូទទួលបន្ទុក៖</b> ${branding.teacherTitle || 'លោកគ្រូ ខៀន ធូ'}
📞 <b>ទំនាក់ទំនង៖</b> <code>${branding.schoolPhone || '071 721 0307'}</code>
━━━━━━━━━━━━━━━━━━━━

ប្អូនៗសិស្សានុសិស្ស ឬលោកអ្នកអាណាព្យាបាលដែលមានធុរៈចាំបាច់ ឬឈឺចង់សុំច្បាប់ អាចធ្វើបានយ៉ាងងាយស្រួល ២ របៀប៖

🔹 <b>របៀបទី ១៖ វាយសារសុំច្បាប់ផ្ទាល់ក្នុងគ្រុប Telegram នេះ</b>
• វាយ៖ <code>/leave [អត្តលេខ] [មូលហេតុ]</code>
  ឧទាហរណ៍៖ <code>/leave TX01 ឈឺក្បាល</code>
• ឬវាយ៖ <code>/សុំច្បាប់ [អត្តលេខ ឬ ឈ្មោះ] [មូលហេតុ]</code>
  ឧទាហរណ៍៖ <code>/សុំច្បាប់ សុខ ចាន់ ជាប់ការងារគ្រួសារ</code>
<i>👉 Telegram Bot នឹងចាប់ឈ្មោះសិស្ស និងកត់ត្រាវត្តមាន "មានច្បាប់ (Permission)" ចូលប្រព័ន្ធសាលាដោយស្វ័យប្រវត្តិភ្លាមៗ!</i>

🔹 <b>របៀបទី ២៖ ចុចបំពេញទម្រង់សុំច្បាប់តាមទូរស័ព្ទ (Online Portal)</b>
🌐 <a href="${portalUrl}">ចុចទីនេះដើម្បីសុំច្បាប់តាមទម្រង់ឌីជីថល</a>

━━━━━━━━━━━━━━━━━━━━
💡 <b>បញ្ជាផ្សេងៗទៀតក្នុង Bot (Quick Commands)៖</b>
• <code>/info [អត្តលេខ]</code> : ឆែកព័ត៌មាន និងវត្តមានផ្ទាល់ខ្លួន
• <code>/schedule</code> : មើលកាលវិភាគម៉ោងរៀនគ្រប់វេន
• <code>/holiday</code> : ឆែកថ្ងៃឈប់សម្រាកបុណ្យជាតិបន្ទាប់
• <code>/help</code> : បង្ហាញការណែនាំទាំងអស់
━━━━━━━━━━━━━━━━━━━━
<i>ប្រព័ន្ធគ្រប់គ្រងសិស្ស និងវត្តមានស្វ័យប្រវត្តិតាម Telegram Bot</i>
    `.trim();

    return await this.broadcastToShifts(targetShift, deskMsg);
  }
};


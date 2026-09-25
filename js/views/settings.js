/**
 * View: Settings & Firebase Cloud Sync Configuration
 */
const SettingsView = {
  render() {
    const isConnected = StudentAPI.isCloudConnected();
    const config = APP_CONFIG.firebaseConfig || {};

    return `
      <section id="view-settings" class="page-view">
        <div class="card">
          <div class="card-header-clean">
            <div class="card-title">
              <i class="fa-solid fa-gear" style="color: var(--primary);"></i>
              <span>ការកំណត់ប្រព័ន្ធទូទៅ (System Settings)</span>
            </div>
          </div>

          <p style="margin-bottom: 20px; font-size: 0.92rem; color: var(--text-muted);">
            គ្រប់គ្រងការតភ្ជាប់ Cloud Database, ការជូនដំណឹង Telegram, និងការថែទាំទិន្នន័យប្រព័ន្ធ TIS Lab Computer ឱ្យដំណើរការរលូន និងសុវត្ថិភាពខ្ពស់។
          </p>

          <!-- Cloud Database Status Info Card -->
          <div style="background: var(--border-light); border-radius: var(--border-radius); padding: 20px; border: 1px solid var(--border-color); margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <h4 style="font-size: 1rem; margin: 0; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-cloud" style="color: var(--primary);"></i>
                <span>មូលដ្ឋានទិន្នន័យលើពពក (Cloud Database & Live Sync)</span>
              </h4>
              <span class="badge ${isConnected ? 'badge-grade' : ''}" style="${isConnected ? 'background: rgba(16,185,129,0.15); color: #059669;' : 'background: rgba(239,68,68,0.15); color: #dc2626;'} font-size: 0.85rem; padding: 4px 12px; border-radius: 20px;">
                <i class="fa-solid ${isConnected ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                ${isConnected ? 'ដំណើរការរលូន (Online)' : 'មិនទាន់ភ្ជាប់ (Offline)'}
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; font-size: 0.88rem;">
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.8rem;">Project ID:</span>
                <strong style="font-family: monospace;">${config.projectId || "system-student-c2267"}</strong>
              </div>
              <div style="grid-column: span 2;">
                <span style="color: var(--text-muted); display: block; font-size: 0.8rem;">Database URL:</span>
                <strong style="font-family: monospace; word-break: break-all; color: var(--primary);">${config.databaseURL || "https://system-student-c2267-default-rtdb.asia-southeast1.firebasedatabase.app"}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.8rem;">Auth Domain:</span>
                <span style="font-family: monospace;">${config.authDomain || "system-student-c2267.firebaseapp.com"}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <button type="button" id="btnExportFullJsonBackup" class="btn-primary" style="background: #10b981; border-color: #10b981;">
              <i class="fa-solid fa-download"></i>
              <span>ទាញយក Database Backup (.json)</span>
            </button>
            <label class="btn-secondary" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin: 0;">
              <i class="fa-solid fa-upload text-indigo-500"></i>
              <span>ស្តារទិន្នន័យ (Restore .json)</span>
              <input type="file" id="importJsonBackupFile" accept=".json" style="display: none;">
            </label>
            <button type="button" id="btnSendBackupToTelegramNow" class="btn-secondary" style="color: #0088cc; border-color: rgba(0, 136, 204, 0.35); background: rgba(0, 136, 204, 0.08);">
              <i class="fa-brands fa-telegram"></i>
              <span>ផ្ញើ Backup ទៅ Telegram ឥឡូវ</span>
            </button>
            <button type="button" id="btnPrintExecutiveSummarySheet" class="btn-secondary">
              <i class="fa-solid fa-file-invoice"></i>
              <span>របាយការណ៍សង្ខេប A4 ប្រចាំខែ</span>
            </button>
            <button type="button" id="testConnectionBtn" class="btn-secondary">
              <i class="fa-solid fa-plug"></i>
              <span>សាកល្បងការតភ្ជាប់ (Test Connection)</span>
            </button>
            <button type="button" id="syncNowBtn" class="btn-secondary">
              <i class="fa-solid fa-arrows-rotate"></i>
              <span>Sync ទិន្នន័យពី Firebase ឥឡូវនេះ</span>
            </button>
            <button type="button" id="btnSettingsAutoFixLatinNames" class="btn-secondary" style="color: #4f46e5; border-color: rgba(99, 102, 241, 0.4); background: rgba(99, 102, 241, 0.08); font-weight: 700;" title="ពិនិត្យ និងបង្កើតឈ្មោះជាអក្សរឡាតាំង Auto ជូនសិស្សទាំងអស់ដែលខ្វះ">
              <i class="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
              <span>Auto ឈ្មោះឡាតាំងសិស្សទាំងអស់</span>
            </button>
            <button type="button" id="clearAllExamsBtn" class="btn-secondary" style="color: #ea580c; border-color: #fdba74;">
              <i class="fa-solid fa-eraser"></i>
              <span>សម្អាតពិន្ទុប្រឡងទាំងអស់ (កំណត់ទៅគ្មានពិន្ទុ)</span>
            </button>
            <button type="button" id="clearAllStudentsBtn" class="btn-outline-danger">
              <i class="fa-solid fa-trash-can"></i>
              <span>លុបទិន្នន័យសិស្សទាំងអស់ (ទុកបញ្ចូលថ្មី)</span>
            </button>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- TELEGRAM BOT NOTIFICATIONS CONFIGURATION                  -->
        <!-- ========================================================= -->
        ${(() => {
          const tgConfig = typeof TelegramService !== "undefined" ? TelegramService.getConfig() : (APP_CONFIG.telegramConfig || {});
          return `
            <div class="card mt-4" style="border-left: 4px solid #0088cc;">
              <div class="card-header-clean" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
                <div class="card-title">
                  <i class="fa-brands fa-telegram" style="color: #0088cc; font-size: 1.3rem;"></i>
                  <span>ការកំណត់ Telegram Bot Notifications (ការជូនដំណឹងស្វ័យប្រវត្តិ)</span>
                </div>
                <span class="badge" id="telegramStatusBadge" style="background: rgba(0, 136, 204, 0.12); color: #0088cc; font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">
                  ${tgConfig.enabled ? '<i class="fa-solid fa-circle-check"></i> បើកដំណើរការ (Active)' : '<i class="fa-solid fa-circle-pause"></i> បិទដំណើរការ (Disabled)'}
                </span>
              </div>

              <p style="margin-bottom: 20px; font-size: 0.92rem; color: var(--text-muted);">
                ផ្ញើសារជូនដំណឹងស្វ័យប្រវត្តិចូល Telegram Channel ឬ Group ភ្លាមៗពេលមានការកត់ត្រាវត្តមានសិស្ស (QR Code), បង់ថ្លៃសិក្សា $50, ប្រឡងជាប់, និងការចេញវិញ្ញាបនបត្រផ្លូវការ។
              </p>

              <form id="telegramConfigForm" autocomplete="off">
                <div style="background: var(--border-light); border-radius: var(--border-radius); padding: 20px; border: 1px solid var(--border-color); margin-bottom: 20px;">
                  
                  <!-- Master Switch -->
                  <div style="margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                      <strong style="font-size: 0.95rem; color: var(--text-main);">បើកដំណើរការការជូនដំណឹងតាម Telegram (Enable Telegram Alerts)</strong>
                      <div style="font-size: 0.82rem; color: var(--text-muted);">បើក/បិទការផ្ញើសារស្វ័យប្រវត្តិនៃប្រព័ន្ធទាំងមូល</div>
                    </div>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="checkbox" id="tgInputEnabled" ${tgConfig.enabled ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: #0088cc; cursor: pointer;">
                      <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-main);">បើកដំណើរការ</span>
                    </label>
                  </div>

                  <!-- Bot Quick Link & Status Banner -->
                  <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0, 136, 204, 0.08); border: 1px solid rgba(0, 136, 204, 0.25); border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <i class="fa-brands fa-telegram" style="color: #0088cc; font-size: 1.6rem;"></i>
                      <div>
                        <strong style="color: var(--text-main); font-size: 0.95rem;">Telegram Bot: @my_master_kh_bot</strong>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">ចុចបើក Bot ក្នុង Telegram រួចចុច Start ដើម្បីទទួលបានសារជូនដំណឹងភ្លាមៗ</div>
                      </div>
                    </div>
                    <a href="https://t.me/my_master_kh_bot" target="_blank" class="btn-primary" style="background: #0088cc; border-color: #0088cc; padding: 6px 14px; font-size: 0.84rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(0, 136, 204, 0.3);">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i> <span>បើក Bot ក្នុង Telegram</span>
                    </a>
                  </div>

                  <!-- Token & Chat ID Inputs -->
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 18px;">
                    <div class="form-group" style="margin-bottom: 0;">
                      <label for="tgInputToken" style="font-weight: 700; font-size: 0.86rem;">
                        <i class="fa-solid fa-key" style="color: #0088cc;"></i> Telegram Bot Token:
                      </label>
                      <input type="text" id="tgInputToken" class="form-control font-mono" placeholder="ឧ. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..." value="${App.escapeHtml(tgConfig.botToken || '')}" style="font-size: 0.85rem;">
                      <small style="color: var(--text-muted); font-size: 0.75rem;">ទទួលបានពី <a href="https://t.me/BotFather" target="_blank" style="color: #0088cc; font-weight: 600;">@BotFather</a></small>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <label for="tgInputChatId" style="font-weight: 700; font-size: 0.86rem; margin: 0;">
                          <i class="fa-solid fa-bullhorn" style="color: #0088cc;"></i> Chat ID / Group ID:
                        </label>
                        <button type="button" id="autoDetectTgChatIdBtn" style="background: none; border: none; color: #0088cc; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;" title="ទាញយក Chat ID ដោយស្វ័យប្រវត្តពីសារ Telegram">
                          <i class="fa-solid fa-wand-magic-sparkles"></i> <span>រក Chat ID ស្វ័យប្រវត្តិ</span>
                        </button>
                      </div>
                      <div style="display: flex; gap: 8px;">
                        <input type="text" id="tgInputChatId" class="form-control font-mono" placeholder="ឧ. -1001234567890 ឬ @your_channel" value="${App.escapeHtml(tgConfig.chatId || '')}" style="font-size: 0.85rem; flex: 1;">
                      </div>
                      <small style="color: var(--text-muted); font-size: 0.75rem;">អត្តលេខ Group/Channel ឬ Telegram Username (ចុច 'រក Chat ID ស្វ័យប្រវត្តិ' ពេលផ្ញើសារចូល Bot)</small>
                    </div>
                  </div>

                  <!-- 3 Shift Groups Configuration (វេនព្រឹក • វេនរសៀល • វេនយប់) -->
                  <div style="background: rgba(0, 136, 204, 0.05); border: 1px solid rgba(0, 136, 204, 0.28); border-radius: 12px; padding: 16px 18px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                      <div>
                        <strong style="color: #0088cc; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                          <i class="fa-solid fa-users-rectangle"></i> ការកំណត់គ្រុប Telegram ទាំង ៣ វេន (Morning • Afternoon • Night Groups)
                        </strong>
                        <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-top: 3px;">
                          Bot នឹងផ្សាយដំណឹងថ្ងៃឈប់សម្រាក បុណ្យជាតិ និងរបាយការណ៍វត្តមានចូលគ្រុបទាំង ៣ ព្រមគ្នា ឬតាមវេននីមួយៗ
                        </span>
                      </div>
                      <button type="button" id="autoDetectAllShiftGroupsBtn" class="btn-primary" style="background: linear-gradient(135deg, #0088cc, #0284c7); border: none; font-size: 0.8rem; padding: 7px 14px; border-radius: 8px; box-shadow: 0 3px 10px rgba(0, 136, 204, 0.35);">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> <span>ស្កេនរកគ្រុបទាំង ៣ ស្វ័យប្រវត្តិ</span>
                      </button>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
                      <!-- Morning Shift Group -->
                      <div style="background: var(--bg-surface); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <label for="tgInputChatId_morning" style="font-weight: 700; font-size: 0.84rem; display: flex; align-items: center; gap: 6px; margin-bottom: 5px; color: #0284c7;">
                          <span>🌅 គ្រុបវេនព្រឹក:</span>
                          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">(រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនព្រឹក)</span>
                        </label>
                        <input type="text" id="tgInputChatId_morning" class="form-control font-mono" placeholder="Group ID វេនព្រឹក (ឧ. -100...)" value="${App.escapeHtml(tgConfig.shiftChatIds?.morning || '')}" style="font-size: 0.82rem;">
                        <small style="color: var(--text-muted); font-size: 0.72rem; display: block; margin-top: 3px;">${App.escapeHtml(tgConfig.shiftGroupTitles?.morning || 'រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនព្រឹក')}</small>
                      </div>

                      <!-- Afternoon Shift Group -->
                      <div style="background: var(--bg-surface); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <label for="tgInputChatId_afternoon" style="font-weight: 700; font-size: 0.84rem; display: flex; align-items: center; gap: 6px; margin-bottom: 5px; color: #d97706;">
                          <span>☀️ គ្រុបវេនរសៀល:</span>
                          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">(រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនរសៀល)</span>
                        </label>
                        <input type="text" id="tgInputChatId_afternoon" class="form-control font-mono" placeholder="Group ID វេនរសៀល (ឧ. -100...)" value="${App.escapeHtml(tgConfig.shiftChatIds?.afternoon || '')}" style="font-size: 0.82rem;">
                        <small style="color: var(--text-muted); font-size: 0.72rem; display: block; margin-top: 3px;">${App.escapeHtml(tgConfig.shiftGroupTitles?.afternoon || 'រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនរសៀល')}</small>
                      </div>

                      <!-- Night Shift Group -->
                      <div style="background: var(--bg-surface); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <label for="tgInputChatId_night" style="font-weight: 700; font-size: 0.84rem; display: flex; align-items: center; gap: 6px; margin-bottom: 5px; color: #7c3aed;">
                          <span>🌙 គ្រុបវេនយប់ (ម៉ោង៥-៦):</span>
                          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">(រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនយប់)</span>
                        </label>
                        <input type="text" id="tgInputChatId_night" class="form-control font-mono" placeholder="Group ID វេនយប់ (ឧ. -100...)" value="${App.escapeHtml(tgConfig.shiftChatIds?.night || '')}" style="font-size: 0.82rem;">
                        <small style="color: var(--text-muted); font-size: 0.72rem; display: block; margin-top: 3px;">${App.escapeHtml(tgConfig.shiftGroupTitles?.night || 'រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនយប់ (ម៉ោង៥-៦)')}</small>
                      </div>
                    </div>

                    <div style="margin-top: 10px; font-size: 0.76rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
                      <i class="fa-solid fa-circle-info" style="color: #0088cc;"></i>
                      <span>របៀបប្រើ៖ សូម Add Bot <b>@my_master_kh_bot</b> ចូលគ្រុបទាំង ៣ រួចផ្ញើសារណាមួយ (ឧ. hello) ក្នុងគ្រុបនីមួយៗ ហើយចុចប៊ូតុង <b>"ស្កេនរកគ្រុបទាំង ៣ ស្វ័យប្រវត្តិ"</b></span>
                    </div>
                  </div>

                  <!-- Event Notification Toggles -->
                  <div style="font-weight: 700; font-size: 0.88rem; margin-bottom: 10px; color: var(--text-main);">
                    <i class="fa-solid fa-bell" style="color: #f59e0b;"></i> ជ្រើសរើសព្រឹត្តិការណ៍ដែលត្រូវជូនដំណឹង (Notification Triggers):
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; font-size: 0.85rem;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                      <input type="checkbox" id="tgNotifyNewStudent" ${tgConfig.notifyNewStudent !== false ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>ចុះឈ្មោះសិស្សថ្មី:</strong> ពេលបញ្ចូលសិស្សថ្មី (Enrollment)</span>
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                      <input type="checkbox" id="tgNotifyPayment" ${tgConfig.notifyPayment ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>ថ្លៃសិក្សា:</strong> ពេលកត់ត្រាបង់ប្រាក់ $50</span>
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                      <input type="checkbox" id="tgNotifyExam" ${tgConfig.notifyExam ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>ប្រឡងកុំព្យូទ័រ:</strong> ពេលសិស្សប្រឡងជាប់</span>
                    </label>

                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                      <input type="checkbox" id="tgNotifyCertificate" ${tgConfig.notifyCertificate ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>វិញ្ញាបនបត្រ:</strong> ពេលចេញ Certificate ថ្មី</span>
                    </label>

                    <!-- Consolidated Shift Attendance Summary -->
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; background: rgba(0, 136, 204, 0.08); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(0, 136, 204, 0.35); grid-column: 1 / -1;">
                      <input type="checkbox" id="tgNotifyShiftAttendanceSummary" ${tgConfig.notifyShiftAttendanceSummary !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #0088cc;">
                      <div style="flex: 1;">
                        <strong style="color: #0088cc; font-size: 0.9rem;"><i class="fa-solid fa-layer-group"></i> របាយការណ៍វត្តមានសរុបតាមវេន (Auto ៥ នាទីក្រោយបញ្ចូលចប់):</strong>
                        <span style="color: var(--text-muted); font-size: 0.78rem; display: block; margin-top: 2px;">នៅពេលបញ្ចូលវត្តមានចប់ក្នុងវេននីមួយៗ (ព្រឹក/រសៀល/យប់) ៥ នាទីក្រោយមក Bot នឹងផ្ញើសារសរុប និងឯកសារ PDF & Excel ចូលគ្រុបតាមវេននោះ</span>
                      </div>
                    </label>

                    <!-- Individual Student Attendance -->
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; background: var(--bg-surface); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); grid-column: 1 / -1;">
                      <input type="checkbox" id="tgNotifyIndividualAttendance" ${tgConfig.notifyIndividualAttendance === true ? 'checked' : ''} style="width: 17px; height: 17px; accent-color: #0088cc;">
                      <span><strong>ផ្ញើសារទោលតាមសិស្សម្នាក់ៗ:</strong> (លំនាំដើម: បិទ ដើម្បីកុំឱ្យ Spam សារក្នុង Telegram)</span>
                    </label>

                    <!-- Daily 7:00 PM Summary -->
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; background: rgba(16, 185, 129, 0.08); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.35); grid-column: 1 / -1;">
                      <input type="checkbox" id="tgNotifyDailyAttendanceSummary" ${tgConfig.notifyDailyAttendanceSummary !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #10b981;">
                      <div style="flex: 1;">
                        <strong style="color: #059669; font-size: 0.9rem;"><i class="fa-solid fa-clock"></i> របាយការណ៍វត្តមានសរុបប្រចាំថ្ងៃនៅម៉ោង ៧:០០ យប់ (Daily Attendance Summary at 19:00):</strong>
                        <span style="color: var(--text-muted); font-size: 0.78rem; display: block; margin-top: 2px;">ផ្ញើសារសរុបវត្តមានសិស្សទាំងអស់ប្រចាំថ្ងៃ (វត្តមាន, ច្បាប់, អវត្តមាន តាមវេន) នៅវេលាម៉ោង <strong>៧:០០ យប់</strong> ដោយស្វ័យប្រវត្តិចូល Telegram</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Telegram Buttons -->
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                  <button type="button" id="saveTelegramConfigBtn" class="btn-primary" style="background: #0088cc; border-color: #0088cc; box-shadow: 0 4px 14px rgba(0, 136, 204, 0.35);">
                    <i class="fa-solid fa-floppy-disk"></i>
                    <span>រក្សាទុកការកំណត់ Telegram</span>
                  </button>
                  <button type="button" id="testBroadcastAllShiftsBtn" class="btn-secondary" style="color: #0088cc; border-color: #0088cc; background: rgba(0, 136, 204, 0.08); font-weight: 700;">
                    <i class="fa-solid fa-bullhorn"></i>
                    <span>សាកល្បងផ្សាយដំណឹងចូលគ្រុបទាំង ៣ (Broadcast Test)</span>
                  </button>
                  <button type="button" id="broadcastStudentDeskBtn" class="btn-secondary" style="color: #059669; border-color: #10b981; background: rgba(16, 185, 129, 0.08); font-weight: 700;">
                    <i class="fa-solid fa-clipboard-user"></i>
                    <span>ផ្សាយតុសេវាសិស្ស & របៀបសុំច្បាប់ទៅគ្រុបទាំង ៣</span>
                  </button>
                  <button type="button" id="testTelegramBtn" class="btn-secondary" style="color: #0088cc; border-color: #0088cc;">
                    <i class="fa-solid fa-paper-plane"></i>
                    <span>សាកល្បងផ្ញើសារទូទៅ</span>
                  </button>
                  <button type="button" id="testShiftSummaryTelegramBtn" class="btn-secondary" style="color: #0088cc; border-color: #0088cc; background: rgba(0, 136, 204, 0.08);">
                    <i class="fa-solid fa-layer-group"></i>
                    <span>សាកល្បងផ្ញើវត្តមានតាមវេន (Shift Report)</span>
                  </button>
                  <button type="button" id="testDailySummaryTelegramBtn" class="btn-secondary" style="color: #059669; border-color: #10b981; background: rgba(16, 185, 129, 0.08);">
                    <i class="fa-solid fa-clipboard-check"></i>
                    <span>សាកល្បងផ្ញើវត្តមានថ្ងៃនេះ (19:00 Report)</span>
                  </button>
                </div>
              </form>
            </div>
          `;
        })()}

        <!-- ========================================================= -->
        <!-- HOSTIMG PRO & STORAGE OPTIMIZATION SECTION               -->
        <!-- ========================================================= -->
        ${this.renderHostImgSection()}

        <!-- ========================================================= -->
        <!-- TEACHER & STAFF MANAGEMENT SECTION (គ្រប់គ្រងឈ្មោះគ្រូ) -->
        <!-- ========================================================= -->
        <div class="card mt-4">
          <div class="card-header-clean" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div class="card-title">
              <i class="fa-solid fa-chalkboard-user text-indigo-500"></i>
              <span>គ្រប់គ្រងគណនីគ្រូបង្រៀន & បុគ្គលិក (Teacher & Staff Management)</span>
            </div>
            <button type="button" id="addNewTeacherBtn" class="btn-primary" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);">
              <i class="fa-solid fa-user-plus"></i>
              <span>+ បន្ថែមគ្រូបង្រៀនថ្មី</span>
            </button>
          </div>

          <p style="margin-bottom: 20px; font-size: 0.92rem; color: var(--text-muted);">
            បញ្ជីឈ្មោះគ្រូបង្រៀន និងបុគ្គលិកដែលមានសិទ្ធិ Login ចូលប្រព័ន្ធ ដើម្បីគ្រប់គ្រងទិន្នន័យសិស្ស កត់ត្រាវត្តមាន និងបញ្ចូលពិន្ទុប្រឡង។
          </p>

          <!-- Teachers Grid List -->
          <div id="teachersGridContainer" class="teachers-grid-container">
            ${this.renderTeachersList()}
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- SCHOOL BRANDING, DIGITAL SEAL & SIGNATURE                 -->
        <!-- ========================================================= -->
        <div class="card mt-4" style="border-left: 4px solid #6366f1;">
          <div class="card-header-clean">
            <div class="card-title">
              <i class="fa-solid fa-stamp" style="color: #6366f1; font-size: 1.3rem;"></i>
              <span>ត្រាសាលា & ហត្ថលេខាឌីជីថល (School Seal & Teacher Signature)</span>
            </div>
            <span class="badge" style="background: rgba(99, 102, 241, 0.12); color: #6366f1; font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">
              ស្វ័យប្រវត្តលើរាល់ឯកសារបោះពុម្ព
            </span>
          </div>

          <p style="margin-bottom: 20px; font-size: 0.92rem; color: var(--text-muted);">
            កំណត់ត្រាសាលា និងហត្ថលេខារបស់លោកគ្រូ ដើម្បីបោះត្រាស្វ័យប្រវត្តលើរាល់ វិញ្ញាបនបត្រ, កាតសិស្ស, ព្រឹត្តិបត្រពិន្ទុ, លិខិតបញ្ជាក់ និងវិក្កយបត្រ ដោយមិនបាច់បោះត្រាដោយដៃឡើយ។
          </p>

          <form id="schoolBrandingForm" autocomplete="off">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 20px;">
              
              <!-- Left: School Seal Stamp -->
              <div style="background: var(--border-light); border-radius: var(--border-radius); padding: 18px; border: 1px solid var(--border-color); text-align: center;">
                <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 10px;">
                  <i class="fa-solid fa-certificate text-indigo-500"></i> រូបភាពត្រាសាលា (School Seal / Stamp)
                </label>
                <div style="width: 120px; height: 120px; margin: 0 auto 14px auto; border: 2px dashed #a5b4fc; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fff; overflow: hidden; position: relative;">
                  <img id="stampPreviewImg" src="" style="width: 100%; height: 100%; object-fit: contain; display: none;" alt="Seal">
                  <span id="stampPlaceholder" style="font-size: 0.75rem; color: #94a3b8;"><i class="fa-solid fa-stamp fa-2x mb-1" style="display: block;"></i> មិនទាន់មានត្រា</span>
                </div>
                <label class="btn-secondary btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin: 0;">
                  <i class="fa-solid fa-upload"></i> <span>Upload រូបត្រាសាលា (.png)</span>
                  <input type="file" id="stampFileInput" accept="image/*" style="display: none;">
                </label>
              </div>

              <!-- Right: Teacher Digital Signature -->
              <div style="background: var(--border-light); border-radius: var(--border-radius); padding: 18px; border: 1px solid var(--border-color); text-align: center;">
                <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 10px;">
                  <i class="fa-solid fa-signature text-emerald-500"></i> ហត្ថលេខារបស់លោកគ្រូ (Teacher Digital Signature)
                </label>
                <div style="width: 200px; height: 120px; margin: 0 auto 14px auto; border: 2px dashed #6ee7b7; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #fff; overflow: hidden; position: relative;">
                  <img id="signaturePreviewImg" src="" style="width: 100%; height: 100%; object-fit: contain; display: none;" alt="Signature">
                  <span id="signaturePlaceholder" style="font-size: 0.75rem; color: #94a3b8;"><i class="fa-solid fa-pen-nib fa-2x mb-1" style="display: block;"></i> មិនទាន់មានហត្ថលេខា</span>
                </div>
                <label class="btn-secondary btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin: 0;">
                  <i class="fa-solid fa-upload"></i> <span>Upload ហត្ថលេខា (.png)</span>
                  <input type="file" id="signatureFileInput" accept="image/*" style="display: none;">
                </label>
              </div>
            </div>

            <!-- Details Form Fields -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px;">
              <div>
                <label class="form-label" style="font-weight: 700; font-size: 0.82rem;">ឈ្មោះសាលា (ភាសាខ្មែរ)៖</label>
                <input type="text" id="brandSchoolNameKh" class="form-control" value="សាលាកុំព្យូទ័រ TIS Lab Computer">
              </div>
              <div>
                <label class="form-label" style="font-weight: 700; font-size: 0.82rem;">ឈ្មោះសាលា (អង់គ្លេស)៖</label>
                <input type="text" id="brandSchoolNameEn" class="form-control" value="TIS LAB COMPUTER TRAINING CENTER">
              </div>
              <div>
                <label class="form-label" style="font-weight: 700; font-size: 0.82rem;">គោត្តនាម & នាមគ្រូ (Teacher Title)៖</label>
                <input type="text" id="brandTeacherTitle" class="form-control" value="លោកគ្រូ ខៀន ធូ">
              </div>
              <div>
                <label class="form-label" style="font-weight: 700; font-size: 0.82rem;">តួនាទី / មុខតំណែង៖</label>
                <input type="text" id="brandTeacherPosition" class="form-control" value="ប្រធានគ្រប់គ្រង & គ្រូបង្រៀនកុំព្យូទ័រ">
              </div>
            </div>

            <button type="button" id="btnSaveSchoolBranding" class="btn-primary" style="background: linear-gradient(135deg, #4f46e5, #6366f1); border: none; padding: 10px 24px; font-weight: 700;">
              <i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកត្រា & ហត្ថលេខាឌីជីថល</span>
            </button>
          </form>
        </div>

        <!-- MODAL: ADD / EDIT TEACHER -->
        <div id="teacherManageModal" class="modal-overlay">
          <div class="modal-card" style="max-width: 580px;">
            <div class="modal-header">
              <h3 id="teacherModalTitle"><i class="fa-solid fa-user-tie text-indigo-500"></i> បន្ថែមគ្រូបង្រៀនថ្មី</h3>
              <button type="button" class="modal-close-btn" id="closeTeacherModalBtn">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <form id="teacherManageForm" autocomplete="off">
                <input type="hidden" id="teacherEditId" value="">

                <!-- Avatar Preview & Selection -->
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; background: var(--border-light); padding: 14px; border-radius: var(--border-radius);">
                  <img id="teacherAvatarPreview" src="assets/images/default-male.svg" alt="Avatar" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 3px solid #8b5cf6;" onerror="this.src='assets/images/default-male.svg'">
                  <div style="flex: 1;">
                    <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 4px;">រូបថតគ្រូបង្រៀន (Avatar URL ឬ Upload)</label>
                    <div style="display: flex; gap: 8px;">
                      <input type="text" id="teacherInputAvatar" class="form-control" placeholder="https://... ឬទុកទទេដើម្បីប្រើរូបលំនាំដើម" style="font-size: 0.82rem;">
                      <label class="btn-secondary" style="margin: 0; cursor: pointer; padding: 0 12px; display: inline-flex; align-items: center;" title="Upload រូបភាពពីកុំព្យូទ័រ">
                        <i class="fa-solid fa-upload"></i>
                        <input type="file" id="teacherAvatarFileInput" accept="image/*" style="display: none;">
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Row 1: Name Kh & Name En -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                  <div class="form-group">
                    <label for="teacherInputNameKh">ឈ្មោះខ្មែរ <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="teacherInputNameKh" class="form-control" placeholder="ឧ. លោកគ្រូ ហុង វណ្ណា" required>
                  </div>
                  <div class="form-group">
                    <label for="teacherInputNameEn">ឈ្មោះឡាតាំង (English Name)</label>
                    <input type="text" id="teacherInputNameEn" class="form-control" placeholder="ឧ. Mr. Hong Vanna">
                  </div>
                </div>

                <!-- Row 2: Gender & Role -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                  <div class="form-group">
                    <label for="teacherInputGender">ភេទ</label>
                    <select id="teacherInputGender" class="form-control">
                      <option value="ប្រុស">ប្រុស (Male)</option>
                      <option value="ស្រី">ស្រី (Female)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="teacherInputRole">តួនាទី / មុខតំណែង <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="teacherInputRole" class="form-control" placeholder="ឧ. គ្រូបង្រៀនកុំព្យូទ័ររដ្ឋបាល" value="គ្រូបង្រៀន" required>
                  </div>
                </div>

                <!-- Row 3: Username & Password -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; background: rgba(99, 102, 241, 0.06); padding: 12px; border-radius: 10px; border: 1px dashed rgba(99, 102, 241, 0.3);">
                  <div class="form-group" style="margin-bottom: 0;">
                    <label for="teacherInputUsername">ឈ្មោះគណនី Login (Username) <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="teacherInputUsername" class="form-control" placeholder="ឧ. vanna ឬ teacher2" required>
                  </div>
                  <div class="form-group" style="margin-bottom: 0;">
                    <label for="teacherInputPassword">លេខសម្ងាត់ Login (Password) <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="teacherInputPassword" class="form-control" placeholder="លេខសម្ងាត់..." value="123" required>
                  </div>
                </div>

                <!-- Row 4: Phone & Email -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
                  <div class="form-group">
                    <label for="teacherInputPhone">លេខទូរស័ព្ទ</label>
                    <input type="text" id="teacherInputPhone" class="form-control" placeholder="ឧ. 012 345 678">
                  </div>
                  <div class="form-group">
                    <label for="teacherInputEmail">អ៊ីមែល (Email)</label>
                    <input type="email" id="teacherInputEmail" class="form-control" placeholder="ឧ. info@tislab.edu.kh">
                  </div>
                </div>

                <!-- Modal Actions -->
                <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                  <button type="button" class="btn-secondary" id="cancelTeacherModalBtn">បោះបង់</button>
                  <button type="submit" class="btn-primary" id="saveTeacherSubmitBtn" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none;">
                    <i class="fa-solid fa-floppy-disk"></i>
                    <span>រក្សាទុកព័ត៌មានគ្រូ</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </section>
    `;
  },

  renderTeachersList() {
    const teachers = (typeof AuthService !== "undefined") ? AuthService.getTeachers() : [];
    const currentUser = (typeof AuthService !== "undefined") ? AuthService.getCurrentUser() : null;

    if (!teachers || teachers.length === 0) {
      return `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <i class="fa-solid fa-user-slash fa-2x mb-2"></i>
          <p>មិនទាន់មានគណនីគ្រូបង្រៀននៅឡើយទេ។ សូមចុចប៊ូតុងខាងលើដើម្បីបន្ថែម។</p>
        </div>
      `;
    }

    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
        ${teachers.map(t => {
          const isMe = currentUser && currentUser.id === t.id;
          return `
            <div class="teacher-card-item" style="background: var(--bg-surface); border: 1.5px solid ${isMe ? '#8b5cf6' : 'var(--border-color)'}; border-radius: 16px; padding: 18px; position: relative; box-shadow: var(--shadow-xs); transition: var(--transition);">
              ${isMe ? `
                <span style="position: absolute; top: 12px; right: 12px; background: rgba(139, 92, 246, 0.15); color: #8b5cf6; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">
                  <i class="fa-solid fa-circle-check"></i> គណនីរបស់អ្នក
                </span>
              ` : ''}
              
              <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px;">
                <img src="${t.avatar || (t.gender === 'ស្រី' ? 'assets/images/default-female.svg' : 'assets/images/default-male.svg')}" 
                     alt="${t.nameKh}" 
                     style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #8b5cf6;"
                     onerror="this.src='assets/images/default-male.svg'">
                <div>
                  <h4 style="margin: 0 0 2px 0; font-size: 1rem; font-weight: 800; color: var(--text-main);">${t.nameKh}</h4>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${t.nameEn || ''}</div>
                  <span style="display: inline-block; background: rgba(99, 102, 241, 0.1); color: #4f46e5; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-top: 4px;">
                    ${t.role || 'គ្រូបង្រៀន'}
                  </span>
                </div>
              </div>

              <div style="background: var(--border-light); border-radius: 10px; padding: 10px 12px; font-size: 0.8rem; margin-bottom: 14px; display: flex; flex-direction: column; gap: 4px;">
                <div><span style="color: var(--text-muted);">Username (Login):</span> <strong class="font-mono text-indigo-600">${t.username}</strong></div>
                <div><span style="color: var(--text-muted);">Password:</span> <strong class="font-mono">${t.password || '123'}</strong></div>
                <div><span style="color: var(--text-muted);">ទូរស័ព្ទ:</span> <strong>${t.phone || '—'}</strong></div>
                <div><span style="color: var(--text-muted);">អ៊ីមែល:</span> <span style="font-size: 0.75rem;">${t.email || '—'}</span></div>
              </div>

              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" class="btn-secondary btn-sm" onclick="SettingsView.openEditTeacherModal('${t.id}')" title="កែប្រែព័ត៌មានគ្រូ">
                  <i class="fa-solid fa-pen-to-square"></i> <span>កែប្រែ</span>
                </button>
                ${!isMe ? `
                  <button type="button" class="btn-outline-danger btn-sm" onclick="SettingsView.handleDeleteTeacher('${t.id}', '${App.escapeHtml(t.nameKh)}')" title="លុបគណនីគ្រូ">
                    <i class="fa-solid fa-trash-can"></i> <span>លុប</span>
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  renderHostImgSection() {
    const config = (typeof ImageHostService !== "undefined")
      ? ImageHostService.getConfig()
      : { provider: "auto", autoCropPassport: true, quality: 0.85 };

    const providerNames = {
      auto: "🌐 Auto Multi-Tier (Server ➔ ImgBB ➔ FreeImage ➔ Telegram)",
      server: "🖥️ Local Server Only (/uploads/images/)",
      telegram: "✈️ Telegram Bot Cloud CDN (ឥតកំណត់ទំហំ)",
      imgbb: "⚡ ImgBB Cloud CDN (Free Global CDN)",
      freeimage: "🖼️ FreeImage.host CDN",
      base64: "💾 Local Base64 (ទម្រង់ចាស់ - ធ្ងន់)"
    };

    return `
      <div class="card mt-4" style="border-left: 4px solid #0ea5e9;">
        <div class="card-header-clean" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div class="card-title">
            <i class="fa-solid fa-cloud-arrow-up" style="color: #0ea5e9; font-size: 1.3rem;"></i>
            <span>សេវាផ្ទុករូបភាព HostImg Pro & បង្កើនល្បឿន Database (Smart Image Hosting & Storage Optimization)</span>
          </div>
          <span class="badge" id="hostimgActiveProviderBadge" style="background: rgba(14, 165, 233, 0.12); color: #0284c7; font-size: 0.85rem; padding: 4px 14px; border-radius: 20px; font-weight: 700;">
            <i class="fa-solid fa-server"></i> ${providerNames[config.provider] || config.provider}
          </span>
        </div>

        <p style="margin-bottom: 20px; font-size: 0.92rem; color: var(--text-muted);">
          បច្ចេកវិទ្យា HostImg Pro បំលែងរូបថតសិស្សពីទម្រង់ Base64 ធ្ងន់ៗ (ដែលផ្ទុកពេញ Browser 5MB Quota) ទៅជា Hosted URLs ស្វ័យប្រវត្តិតាមរយៈ Server មូលដ្ឋាន, Telegram Cloud CDN និង Global CDN។ ជួយឱ្យប្រព័ន្ធដំណើរការលឿនជាងមុន ១០ ដង និង Sync ទៅ Firebase មិនជាប់គាំង។
        </p>

        <!-- Storage & Telemetry Metrics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 22px;">
          
          <!-- Metric 1: Quota Gauge -->
          <div style="background: var(--bg-surface); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-xs);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">ទំហំផ្ទុក LocalStorage:</span>
              <span id="hostimgQuotaPercent" style="font-size: 0.85rem; font-weight: 800; color: #059669;">0%</span>
            </div>
            <div style="height: 8px; border-radius: 4px; background: rgba(0,0,0,0.06); overflow: hidden; margin-bottom: 8px;">
              <div id="hostimgQuotaBar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #10b981, #0ea5e9); transition: width 0.5s ease; border-radius: 4px;"></div>
            </div>
            <div id="hostimgQuotaText" style="font-size: 0.78rem; font-family: monospace; color: var(--text-muted);">0.00 MB / 5.00 MB</div>
          </div>

          <!-- Metric 2: Hosted URLs (Lightweight) -->
          <div style="background: var(--bg-surface); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-xs);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">
              <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> សិស្សមាន Hosted Image (ស្រាល):
            </div>
            <div style="display: flex; align-items: baseline; gap: 6px;">
              <span id="hostimgHostedCount" style="font-size: 1.5rem; font-weight: 800; color: #10b981;">0</span>
              <span style="font-size: 0.82rem; color: var(--text-muted);">នាក់</span>
            </div>
            <span style="font-size: 0.74rem; color: #059669; font-weight: 600;">ចំណាយ ~100 Bytes ក្នុង Database</span>
          </div>

          <!-- Metric 3: Legacy Base64 (Heavy) -->
          <div style="background: var(--bg-surface); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-xs);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">
              <i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b;"></i> សិស្សមាន Base64 ចាស់ (ធ្ងន់):
            </div>
            <div style="display: flex; align-items: baseline; gap: 6px;">
              <span id="hostimgBase64Count" style="font-size: 1.5rem; font-weight: 800; color: #f59e0b;">0</span>
              <span style="font-size: 0.82rem; color: var(--text-muted);">នាក់</span>
            </div>
            <span style="font-size: 0.74rem; color: var(--text-muted);">ខ្ជះខ្ជាយទំហំ <strong id="hostimgBase64Mb" class="text-amber-600">0.00</strong> MB</span>
          </div>

          <!-- Metric 4: Auto Optimization -->
          <div style="background: var(--bg-surface); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-xs);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">
              <i class="fa-solid fa-crop-simple" style="color: #6366f1;"></i> សមាមាត្រកាត់រូប (Aspect Ratio):
            </div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #6366f1; margin-bottom: 4px;">
              3:4 Passport Face
            </div>
            <span style="font-size: 0.74rem; color: var(--text-muted);">កាត់តម្រឹមផ្ទៃមុខស្វ័យប្រវត្តិកម្រិតខ្ពស់</span>
          </div>
        </div>

        <!-- 1-Click Migration Card -->
        <div style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.07), rgba(16, 185, 129, 0.07)); border: 1.5px solid rgba(14, 165, 233, 0.35); border-radius: 14px; padding: 20px; margin-bottom: 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div style="flex: 1; min-width: 260px;">
              <strong style="color: #0284c7; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-wand-magic-sparkles"></i> ឧបករណ៍បំលែង Base64 ➔ Hosted URLs (1-Click Database Shrinker)
              </strong>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 6px 0 0 0; line-height: 1.5;">
                ស្កេនរូបថតសិស្សទាំងអស់ដែលមានទម្រង់ Base64 ចាស់ៗ រួច Upload ចូល Server/Cloud CDN ដោយស្វ័យប្រវត្តិ។ ជួយកាត់បន្ថយទំហំ Database ដល់ទៅ 90% និងលែងបារម្ភរឿង LocalStorage Quota Exceeded ជារៀងរហូត!
              </p>
            </div>
            <button type="button" id="btnMigrateHostImg" class="btn-primary" style="background: linear-gradient(135deg, #0ea5e9, #059669); border: none; font-weight: 700; padding: 10px 22px; border-radius: 10px; box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35); white-space: nowrap;">
              <i class="fa-solid fa-bolt"></i> <span>បំលែងរូបសិស្សទាំងអស់ឥឡូវនេះ (1-Click Migrate)</span>
            </button>
          </div>

          <!-- Real-Time Migration Progress Container -->
          <div id="hostimgMigrationProgress" style="display: none; margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(14, 165, 233, 0.2);">
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
              <span id="hostimgMigrationLabel" style="font-weight: 700; color: #0284c7;">កំពុងដំណើរការបំលែងរូបភាព...</span>
              <span id="hostimgMigrationCounter" style="font-family: monospace; font-weight: 700;">0/0</span>
            </div>
            <div style="height: 10px; border-radius: 6px; background: rgba(0,0,0,0.08); overflow: hidden;">
              <div id="hostimgMigrationBar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #0ea5e9, #10b981); transition: width 0.2s ease; border-radius: 6px;"></div>
            </div>
          </div>
        </div>

        <!-- Configuration Form & Test Uploader -->
        <div style="background: var(--border-light); border-radius: var(--border-radius); padding: 20px; border: 1px solid var(--border-color); margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-sliders" style="color: #0ea5e9;"></i>
            <span>ការកំណត់ប្រភពផ្ទុករូបភាព (Image Hosting Providers & Preferences)</span>
          </h4>

          <form id="hostimgConfigForm" autocomplete="off">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 18px;">
              
              <!-- Provider Selection -->
              <div class="form-group" style="margin-bottom: 0;">
                <label for="hostimgProviderSelect" style="font-weight: 700; font-size: 0.86rem;">
                  <i class="fa-solid fa-network-wired" style="color: #0ea5e9;"></i> ជ្រើសរើស Provider ចម្បង:
                </label>
                <select id="hostimgProviderSelect" class="form-control" style="font-size: 0.86rem; font-weight: 600;">
                  <option value="auto" ${config.provider === 'auto' ? 'selected' : ''}>🌐 Auto Multi-Tier (Local Server ➔ ImgBB ➔ FreeImage ➔ Telegram)</option>
                  <option value="server" ${config.provider === 'server' ? 'selected' : ''}>🖥️ Local Server Only (/uploads/images/ - ដំណើរការទាំងគ្មាន Net)</option>
                  <option value="telegram" ${config.provider === 'telegram' ? 'selected' : ''}>✈️ Telegram Bot Cloud CDN (ឥតកំណត់ទំហំ • មិនផុតកំណត់)</option>
                  <option value="imgbb" ${config.provider === 'imgbb' ? 'selected' : ''}>⚡ ImgBB Cloud CDN (Free Global CDN)</option>
                  <option value="freeimage" ${config.provider === 'freeimage' ? 'selected' : ''}>🖼️ FreeImage.host CDN</option>
                  <option value="base64" ${config.provider === 'base64' ? 'selected' : ''}>💾 Local Base64 (ទម្រង់ចាស់ - មិនណែនាំ)</option>
                </select>
                <small style="color: var(--text-muted); font-size: 0.74rem;">អនុសាសន៍៖ ប្រើ <b>Auto Multi-Tier</b> ដើម្បីធានាថារូបភាព Upload បានជោគជ័យ ១០០% គ្រប់ស្ថានភាព</small>
              </div>

              <!-- ImgBB Custom API Key (Optional) -->
              <div class="form-group" style="margin-bottom: 0;">
                <label for="hostimgInputImgbbKey" style="font-weight: 700; font-size: 0.86rem;">
                  <i class="fa-solid fa-key" style="color: #0ea5e9;"></i> ImgBB API Key (ស្រេចចិត្ត):
                </label>
                <input type="text" id="hostimgInputImgbbKey" class="form-control font-mono" placeholder="ទុកទទេដើម្បីប្រើ Free Global Key របស់ប្រព័ន្ធ" value="${App.escapeHtml(config.imgbbApiKey || '')}" style="font-size: 0.84rem;">
                <small style="color: var(--text-muted); font-size: 0.74rem;">បង្កើត API Key ដោយឥតគិតថ្លៃនៅ <a href="https://api.imgbb.com/" target="_blank" style="color: #0ea5e9; font-weight: 600;">api.imgbb.com</a></small>
              </div>
            </div>

            <!-- Toggles: Passport Cropping & Image Quality -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-bottom: 18px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; background: var(--bg-surface); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                <input type="checkbox" id="hostimgAutoCropCheckbox" ${config.autoCropPassport !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #0ea5e9;">
                <div>
                  <strong style="font-size: 0.86rem; color: var(--text-main); display: block;">កាត់រូបភាព 3:4 Passport ស្វ័យប្រវត្តិ</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">តម្រឹមសមាមាត្រកាតសិស្ស 3:4 និងផ្តោតលើផ្ទៃមុខស្អាតល្អ</span>
                </div>
              </label>

              <div style="background: var(--bg-surface); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                <div>
                  <strong style="font-size: 0.86rem; color: var(--text-main); display: block;">គុណភាពរូបភាព (JPEG Quality):</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">តុល្យភាពរវាងភាពច្បាស់ និងទំហំតូច</span>
                </div>
                <select id="hostimgQualitySelect" class="form-control font-mono" style="width: 100px; font-size: 0.82rem; padding: 4px 8px;">
                  <option value="0.95" ${config.quality === 0.95 ? 'selected' : ''}>95% (Ultra)</option>
                  <option value="0.85" ${(!config.quality || config.quality === 0.85) ? 'selected' : ''}>85% (Optimal)</option>
                  <option value="0.75" ${config.quality === 0.75 ? 'selected' : ''}>75% (Fast)</option>
                </select>
              </div>
            </div>

            <!-- HostImg Action Buttons -->
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <button type="button" id="btnSaveHostImgConfig" class="btn-primary" style="background: #0284c7; border-color: #0284c7; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>រក្សាទុកការកំណត់ HostImg</span>
              </button>
              <button type="button" id="btnRefreshHostImgStats" class="btn-secondary" style="color: #0284c7; border-color: #0284c7;">
                <i class="fa-solid fa-rotate"></i>
                <span>ពិនិត្យ Storage Quota ម្តងទៀត</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Live Test Image Uploader Tool -->
        <div style="background: var(--bg-surface); border-radius: var(--border-radius); padding: 18px; border: 1px dashed #38bdf8;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
            <div>
              <strong style="font-size: 0.92rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-vial-circle-check" style="color: #0ea5e9;"></i> ឧបករណ៍សាកល្បង Upload រូបភាពផ្ទាល់ (Live HostImg Tester)
              </strong>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">ជ្រើសរើសរូបភាពណាមួយដើម្បីសាកល្បងល្បឿន និងទទួលបាន Direct URL ភ្លាមៗ</div>
            </div>
            <label class="btn-secondary btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin: 0; background: rgba(14, 165, 233, 0.08); color: #0284c7; border-color: #38bdf8;">
              <i class="fa-solid fa-upload"></i>
              <span>ជ្រើសរើសរូបភាពសាកល្បង...</span>
              <input type="file" id="hostimgTestFileInput" accept="image/*" style="display: none;">
            </label>
          </div>

          <!-- Test Upload Result Box -->
          <div id="hostimgTestResultBox" style="display: none; background: var(--border-light); padding: 14px; border-radius: 10px; border: 1px solid var(--border-color);">
            <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
              <img id="hostimgTestResultImg" src="" alt="Test Preview" style="width: 70px; height: 90px; object-fit: cover; border-radius: 8px; border: 2px solid #0ea5e9; background: #fff;">
              <div style="flex: 1; min-width: 220px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                  <span id="hostimgTestProviderTag" class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-size: 0.75rem;">Local Server</span>
                  <span id="hostimgTestSpeedTag" style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">⏱️ 120ms</span>
                  <span id="hostimgTestSizeTag" style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">📦 42 KB</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <input type="text" id="hostimgTestUrlInput" class="form-control font-mono" readonly style="font-size: 0.8rem; background: #fff;">
                  <button type="button" id="btnCopyHostImgUrl" class="btn-secondary btn-sm" style="white-space: nowrap;">
                    <i class="fa-solid fa-copy"></i> <span>ចម្លង Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  openAddTeacherModal() {
    const modal = document.getElementById("teacherManageModal");
    const title = document.getElementById("teacherModalTitle");
    const form = document.getElementById("teacherManageForm");
    const idInput = document.getElementById("teacherEditId");
    const preview = document.getElementById("teacherAvatarPreview");

    if (form) form.reset();
    if (idInput) idInput.value = "";
    if (title) title.innerHTML = `<i class="fa-solid fa-user-plus text-indigo-500"></i> បន្ថែមគ្រូបង្រៀនថ្មី`;
    if (preview) preview.src = "assets/images/default-male.svg";

    const passInput = document.getElementById("teacherInputPassword");
    if (passInput) passInput.value = "123";

    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  openEditTeacherModal(teacherId) {
    const teachers = (typeof AuthService !== "undefined") ? AuthService.getTeachers() : [];
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const modal = document.getElementById("teacherManageModal");
    const title = document.getElementById("teacherModalTitle");
    const idInput = document.getElementById("teacherEditId");
    const nameKhInput = document.getElementById("teacherInputNameKh");
    const nameEnInput = document.getElementById("teacherInputNameEn");
    const genderInput = document.getElementById("teacherInputGender");
    const roleInput = document.getElementById("teacherInputRole");
    const userInput = document.getElementById("teacherInputUsername");
    const passInput = document.getElementById("teacherInputPassword");
    const phoneInput = document.getElementById("teacherInputPhone");
    const emailInput = document.getElementById("teacherInputEmail");
    const avatarInput = document.getElementById("teacherInputAvatar");
    const preview = document.getElementById("teacherAvatarPreview");

    if (title) title.innerHTML = `<i class="fa-solid fa-user-pen text-indigo-500"></i> កែប្រែព័ត៌មានគ្រូ៖ ${teacher.nameKh}`;
    if (idInput) idInput.value = teacher.id;
    if (nameKhInput) nameKhInput.value = teacher.nameKh || "";
    if (nameEnInput) nameEnInput.value = teacher.nameEn || "";
    if (genderInput) genderInput.value = teacher.gender || "ប្រុស";
    if (roleInput) roleInput.value = teacher.role || "គ្រូបង្រៀន";
    if (userInput) userInput.value = teacher.username || "";
    if (passInput) passInput.value = teacher.password || "123";
    if (phoneInput) phoneInput.value = teacher.phone || "";
    if (emailInput) emailInput.value = teacher.email || "";
    if (avatarInput) avatarInput.value = teacher.avatar || "";
    if (preview) preview.src = teacher.avatar || (teacher.gender === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg");

    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  closeTeacherModal() {
    const modal = document.getElementById("teacherManageModal");
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  async handleDeleteTeacher(teacherId, teacherName) {
    if (!confirm(`តើអ្នកពិតជាចង់លុបគណនីគ្រូបង្រៀន "${teacherName}" នេះមែនទេ?`)) {
      return;
    }

    try {
      await AuthService.deleteTeacher(teacherId);
      App.showToast(`បានលុបគណនី ${teacherName} ដោយជោគជ័យ!`, "success");
      this.refreshTeachersGrid();
    } catch (err) {
      App.showToast(err.message || "លុបមិនបានជោគជ័យ!", "error");
    }
  },

  async refreshTeachersGrid() {
    if (typeof AuthService !== "undefined" && AuthService.fetchTeachersCloud) {
      await AuthService.fetchTeachersCloud();
    }
    const container = document.getElementById("teachersGridContainer");
    if (container) {
      container.innerHTML = this.renderTeachersList();
    }
  },

  initEvents() {
    this.initHostImgEvents();
    const testConnBtn = document.getElementById("testConnectionBtn");
    const syncNowBtn = document.getElementById("syncNowBtn");
    const clearStudentsBtn = document.getElementById("clearAllStudentsBtn");

    if (testConnBtn) {
      testConnBtn.addEventListener("click", async () => {
        testConnBtn.disabled = true;
        testConnBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងសាកល្បង...`;

        const result = await StudentAPI.testConnection();
        testConnBtn.disabled = false;
        testConnBtn.innerHTML = `<i class="fa-solid fa-plug"></i> សាកល្បងការតភ្ជាប់ (Test Connection)`;

        if (result.success) {
          App.showToast(`ការតភ្ជាប់ Firebase ជោគជ័យ! ទិន្នន័យសិស្សសរុប: ${result.count} នាក់`, "success");
        } else {
          App.showToast("ការតភ្ជាប់ Firebase បរាជ័យ: " + result.error, "error");
        }
      });
    }

    if (syncNowBtn) {
      syncNowBtn.addEventListener("click", async () => {
        syncNowBtn.disabled = true;
        syncNowBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> កំពុង Sync...`;
        await App.loadData(true);
        if (typeof AuthService !== "undefined" && AuthService.fetchTeachersCloud) {
          await AuthService.fetchTeachersCloud();
        }
        await this.refreshTeachersGrid();
        syncNowBtn.disabled = false;
        syncNowBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Sync ទិន្នន័យពី Firebase ឥឡូវនេះ`;
        App.showToast("បានធ្វើសមកាលកម្មទិន្នន័យសិស្ស និងគ្រូពី Firebase ជោគជ័យ!", "success");
      });
    }

    const autoFixLatinBtn = document.getElementById("btnSettingsAutoFixLatinNames");
    if (autoFixLatinBtn) {
      autoFixLatinBtn.addEventListener("click", async () => {
        autoFixLatinBtn.disabled = true;
        autoFixLatinBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងដំណើរការ...`;
        await App.autoFixAllMissingLatinNames(true);
        autoFixLatinBtn.disabled = false;
        autoFixLatinBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Auto ឈ្មោះឡាតាំងសិស្សទាំងអស់`;
      });
    }

    if (clearStudentsBtn) {
      clearStudentsBtn.addEventListener("click", async () => {
        if (confirm("តើអ្នកពិតជាចង់លុបទិន្នន័យសិស្សទាំងអស់ចោល ដើម្បីទុកបញ្ចូលសិស្សថ្មីមែនទេ?")) {
          clearStudentsBtn.disabled = true;
          await StudentAPI.clearAllStudents();
          await App.loadData(false);
          clearStudentsBtn.disabled = false;
          App.showToast("បានលុបទិន្នន័យសិស្សទាំងអស់រួចរាល់ ទុកឲ្យលោកគ្រូជាអ្នកបញ្ចូលថ្មី!", "success");
        }
      });
    }

    const clearExamsBtn = document.getElementById("clearAllExamsBtn");
    if (clearExamsBtn) {
      clearExamsBtn.addEventListener("click", async () => {
        if (confirm("តើអ្នកពិតជាចង់កំណត់ពិន្ទុប្រឡងទាំងអស់ទៅគ្មាន (អត់ទាន់ប្រឡង) មែនទេ?")) {
          clearExamsBtn.disabled = true;
          await StudentAPI.clearAllExams();
          await App.loadData(false);
          clearExamsBtn.disabled = false;
          App.showToast("បានសម្អាតពិន្ទុប្រឡងទាំងអស់រួចរាល់ (គ្មានពិន្ទុទាំងអស់)! ", "success");
        }
      });
    }

    // ----------------------------------------------------
    // TEACHER TOOLS: BACKUP & RESTORE (.JSON)
    // ----------------------------------------------------
    const exportBtn = document.getElementById("btnExportFullJsonBackup");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const students = typeof StudentAPI !== "undefined" ? StudentAPI.getLocalStudents() : [];
        const fees = (typeof StudentAPI !== "undefined" && StudentAPI.getFees) ? StudentAPI.getFees() : {};
        const attendance = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith("attendance_")) {
            try { attendance[k] = JSON.parse(localStorage.getItem(k)); } catch(e){}
          }
        }
        const branding = typeof TeacherToolsService !== "undefined" ? TeacherToolsService.getSchoolBranding() : {};
        const pending = typeof TeacherToolsService !== "undefined" ? TeacherToolsService.getPendingRegistrations() : [];
        const tgConfig = typeof TelegramService !== "undefined" ? TelegramService.getConfig() : {};

        const backupObj = {
          system: "TIS Lab Computer Management",
          version: "2.0",
          exportedAt: new Date().toISOString(),
          students,
          fees,
          attendance,
          branding,
          pendingRegistrations: pending,
          telegramConfig: tgConfig
        };

        const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `TIS_Lab_Backup_${new Date().toISOString().split("T")[0]}_${Date.now().toString().slice(-4)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        App.showToast("បានទាញយកទិន្នន័យ Backup (.json) រួចរាល់!", "success");
      });
    }

    const importInput = document.getElementById("importJsonBackupFile");
    if (importInput) {
      importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const data = JSON.parse(evt.target.result);
            if (!data || (!data.students && !Array.isArray(data))) {
              throw new Error("ទម្រង់ឯកសារ Backup មិនត្រឹមត្រូវ!");
            }

            const count = Array.isArray(data) ? data.length : (data.students?.length || 0);
            if (!confirm(`តើអ្នកពិតជាចង់ស្តារទិន្នន័យពីឯកសារនេះមែនទេ? (មានទិន្នន័យសិស្ស ${count} នាក់)។ ទិន្នន័យចាស់នឹងត្រូវជំនួស។`)) {
              importInput.value = "";
              return;
            }

            const students = Array.isArray(data) ? data : (data.students || []);
            localStorage.setItem("local_students_backup", JSON.stringify(students));

            if (data.fees) {
              localStorage.setItem("tis_student_fees", JSON.stringify(data.fees));
            }
            if (data.attendance) {
              Object.keys(data.attendance).forEach(k => {
                localStorage.setItem(k, JSON.stringify(data.attendance[k]));
              });
            }
            if (data.branding && typeof TeacherToolsService !== "undefined") {
              TeacherToolsService.saveSchoolBranding(data.branding);
            }
            if (data.pendingRegistrations && typeof TeacherToolsService !== "undefined") {
              TeacherToolsService.savePendingRegistrations(data.pendingRegistrations);
            }
            if (data.telegramConfig && typeof TelegramService !== "undefined") {
              TelegramService.saveConfig(data.telegramConfig);
            }

            // Sync to cloud if connected
            if (typeof StudentAPI !== "undefined" && StudentAPI.isCloudConnected()) {
              try {
                await firebase.database().ref("students").set(students);
                if (data.fees) await firebase.database().ref("fees").set(data.fees);
              } catch(e) {}
            }

            await App.loadData(false);
            App.showToast(`🎉 បានស្ដារទិន្នន័យសិស្ស ${count} នាក់ និងការកំណត់ទាំងអស់ដោយជោគជ័យ!`, "success");
            App.triggerConfetti();
          } catch (err) {
            App.showToast("កំហុសក្នុងការអានឯកសារ Backup៖ " + err.message, "error");
          } finally {
            importInput.value = "";
          }
        };
        reader.readAsText(file);
      });
    }

    const sendTgBackupBtn = document.getElementById("btnSendBackupToTelegramNow");
    if (sendTgBackupBtn) {
      sendTgBackupBtn.addEventListener("click", async () => {
        sendTgBackupBtn.disabled = true;
        sendTgBackupBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងផ្ញើ...`;
        try {
          if (typeof TeacherToolsService !== "undefined") {
            const res = await TeacherToolsService.sendBackupToTelegram();
            if (res && res.success) {
              App.showToast("បានផ្ញើ Database Backup ទៅ Telegram រួចរាល់!", "success");
              App.triggerConfetti();
            } else {
              App.showToast("មិនអាចផ្ញើ Backup បានទេ: " + (res?.error || "Chat ID / Token មិនទាន់កំណត់"), "warning");
            }
          }
        } catch(err) {
          App.showToast("កំហុស៖ " + err.message, "error");
        } finally {
          sendTgBackupBtn.disabled = false;
          sendTgBackupBtn.innerHTML = `<i class="fa-brands fa-telegram"></i> <span>ផ្ញើ Backup ទៅ Telegram ឥឡូវ</span>`;
        }
      });
    }

    const printExecBtn = document.getElementById("btnPrintExecutiveSummarySheet");
    if (printExecBtn) {
      printExecBtn.addEventListener("click", () => {
        if (typeof TeacherToolsService !== "undefined") {
          TeacherToolsService.printMonthlyExecutiveSummary();
        }
      });
    }

    // ----------------------------------------------------
    // TEACHER TOOLS: SCHOOL BRANDING & DIGITAL STAMP / SIGNATURE
    // ----------------------------------------------------
    if (typeof TeacherToolsService !== "undefined") {
      const branding = TeacherToolsService.getSchoolBranding();
      const brandSchoolNameKh = document.getElementById("brandSchoolNameKh");
      const brandSchoolNameEn = document.getElementById("brandSchoolNameEn");
      const brandTeacherTitle = document.getElementById("brandTeacherTitle");
      const brandTeacherPosition = document.getElementById("brandTeacherPosition");
      const stampImg = document.getElementById("stampPreviewImg");
      const stampPlace = document.getElementById("stampPlaceholder");
      const sigImg = document.getElementById("signaturePreviewImg");
      const sigPlace = document.getElementById("signaturePlaceholder");

      if (brandSchoolNameKh && branding.schoolNameKh) brandSchoolNameKh.value = branding.schoolNameKh;
      if (brandSchoolNameEn && branding.schoolNameEn) brandSchoolNameEn.value = branding.schoolNameEn;
      if (brandTeacherTitle && branding.teacherTitle) brandTeacherTitle.value = branding.teacherTitle;
      if (brandTeacherPosition && branding.teacherPosition) brandTeacherPosition.value = branding.teacherPosition;

      if (branding.stampImageUrl && stampImg && stampPlace) {
        stampImg.src = branding.stampImageUrl;
        stampImg.style.display = "block";
        stampPlace.style.display = "none";
      }
      if (branding.signatureImageUrl && sigImg && sigPlace) {
        sigImg.src = branding.signatureImageUrl;
        sigImg.style.display = "block";
        sigPlace.style.display = "none";
      }

      const stampFileInput = document.getElementById("stampFileInput");
      if (stampFileInput) {
        stampFileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              if (stampImg && stampPlace) {
                stampImg.src = evt.target.result;
                stampImg.style.display = "block";
                stampPlace.style.display = "none";
                App.showToast("បានបញ្ចូលរូបត្រាសាលា!", "info");
              }
            };
            reader.readAsDataURL(file);
          }
        });
      }

      const sigFileInput = document.getElementById("signatureFileInput");
      if (sigFileInput) {
        sigFileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              if (sigImg && sigPlace) {
                sigImg.src = evt.target.result;
                sigImg.style.display = "block";
                sigPlace.style.display = "none";
                App.showToast("បានបញ្ចូលហត្ថលេខាលោកគ្រូ!", "info");
              }
            };
            reader.readAsDataURL(file);
          }
        });
      }

      const btnSaveBranding = document.getElementById("btnSaveSchoolBranding");
      if (btnSaveBranding) {
        btnSaveBranding.addEventListener("click", () => {
          const updated = {
            schoolNameKh: brandSchoolNameKh?.value.trim() || branding.schoolNameKh,
            schoolNameEn: brandSchoolNameEn?.value.trim() || branding.schoolNameEn,
            teacherTitle: brandTeacherTitle?.value.trim() || branding.teacherTitle,
            teacherPosition: brandTeacherPosition?.value.trim() || branding.teacherPosition,
            stampImageUrl: (stampImg && stampImg.style.display !== "none") ? stampImg.src : "",
            signatureImageUrl: (sigImg && sigImg.style.display !== "none") ? sigImg.src : ""
          };
          TeacherToolsService.saveSchoolBranding(updated);
          App.showToast("បានរក្សាទុកត្រា និងហត្ថលេខាឌីជីថលជោគជ័យ!", "success");
        });
      }
    }

    // ----------------------------------------------------
    // TEACHER MANAGEMENT MODAL & FORM EVENTS
    // ----------------------------------------------------
    const addTeacherBtn = document.getElementById("addNewTeacherBtn");
    const closeTeacherBtn = document.getElementById("closeTeacherModalBtn");
    const cancelTeacherBtn = document.getElementById("cancelTeacherModalBtn");
    const teacherForm = document.getElementById("teacherManageForm");
    const teacherGender = document.getElementById("teacherInputGender");
    const teacherAvatarInput = document.getElementById("teacherInputAvatar");
    const teacherAvatarPreview = document.getElementById("teacherAvatarPreview");
    const teacherAvatarFile = document.getElementById("teacherAvatarFileInput");

    if (addTeacherBtn) {
      addTeacherBtn.addEventListener("click", () => this.openAddTeacherModal());
    }

    if (closeTeacherBtn) {
      closeTeacherBtn.addEventListener("click", () => this.closeTeacherModal());
    }

    if (cancelTeacherBtn) {
      cancelTeacherBtn.addEventListener("click", () => this.closeTeacherModal());
    }

    // Dynamic avatar preview when typing URL
    if (teacherAvatarInput && teacherAvatarPreview) {
      teacherAvatarInput.addEventListener("input", () => {
        const val = teacherAvatarInput.value.trim();
        if (val) {
          teacherAvatarPreview.src = val;
        } else {
          teacherAvatarPreview.src = teacherGender?.value === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
        }
      });
    }

    // Dynamic avatar preview when changing gender
    if (teacherGender && teacherAvatarPreview) {
      teacherGender.addEventListener("change", () => {
        if (!teacherAvatarInput || !teacherAvatarInput.value.trim()) {
          teacherAvatarPreview.src = teacherGender.value === "ស្រី" ? "assets/images/default-female.svg" : "assets/images/default-male.svg";
        }
      });
    }

    // Upload and compress teacher avatar file via HostImg
    if (teacherAvatarFile && teacherAvatarPreview) {
      teacherAvatarFile.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            teacherAvatarPreview.style.opacity = "0.5";
            if (typeof ImageHostService !== "undefined") {
              const res = await ImageHostService.upload(file, "teacher_avatar");
              if (res.success && res.url) {
                teacherAvatarPreview.src = res.url;
                if (teacherAvatarInput) teacherAvatarInput.value = res.url;
                App.showToast("បានផ្ទុករូបថតគ្រូទៅ HostImg ជោគជ័យ!", "success");
              } else {
                throw new Error(res.error || "Upload failed");
              }
            } else {
              const compressed = await StudentAPI.compressImage(file, 400, 0.82);
              teacherAvatarPreview.src = compressed;
              if (teacherAvatarInput) teacherAvatarInput.value = compressed;
              App.showToast("បានបញ្ចូលរូបថតរួចរាល់!", "info");
            }
          } catch (err) {
            App.showToast("មិនអាចដំណើរការរូបភាពបានទេ: " + err.message, "error");
          } finally {
            teacherAvatarPreview.style.opacity = "1";
          }
        }
      });
    }

    // Teacher Form Submit
    if (teacherForm) {
      teacherForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("teacherEditId")?.value.trim();
        const nameKh = document.getElementById("teacherInputNameKh")?.value.trim();
        const nameEn = document.getElementById("teacherInputNameEn")?.value.trim();
        const gender = document.getElementById("teacherInputGender")?.value;
        const role = document.getElementById("teacherInputRole")?.value.trim();
        const username = document.getElementById("teacherInputUsername")?.value.trim();
        const password = document.getElementById("teacherInputPassword")?.value.trim();
        const phone = document.getElementById("teacherInputPhone")?.value.trim();
        const email = document.getElementById("teacherInputEmail")?.value.trim();
        const avatar = document.getElementById("teacherInputAvatar")?.value.trim();

        const submitBtn = document.getElementById("saveTeacherSubmitBtn");
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងរក្សាទុក...`;
        }

        try {
          const teacherData = {
            nameKh,
            nameEn,
            gender,
            role,
            username,
            password,
            phone,
            email,
            avatar
          };

          if (id) {
            await AuthService.updateTeacher(id, teacherData);
            App.showToast(`បានកែសម្រួលព័ត៌មានគ្រូ ${nameKh} ជោគជ័យ!`, "success");
          } else {
            await AuthService.addTeacher(teacherData);
            App.showToast(`🎉 បានបន្ថែមគ្រូបង្រៀនថ្មី ${nameKh} ដោយជោគជ័យ!`, "success");
          }

          this.closeTeacherModal();
          this.refreshTeachersGrid();
        } catch (err) {
          App.showToast(err.message || "រក្សាទុកបរាជ័យ!", "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកព័ត៌មានគ្រូ</span>`;
          }
        }
      });
    }

    // ----------------------------------------------------
    // TELEGRAM BOT NOTIFICATIONS EVENTS
    // ----------------------------------------------------
    const saveTgBtn = document.getElementById("saveTelegramConfigBtn");
    const testTgBtn = document.getElementById("testTelegramBtn");

    if (saveTgBtn) {
      saveTgBtn.addEventListener("click", () => {
        const enabled = document.getElementById("tgInputEnabled")?.checked ?? false;
        const botToken = document.getElementById("tgInputToken")?.value.trim() || "";
        const chatId = document.getElementById("tgInputChatId")?.value.trim() || "";
        const shiftChatIds = {
          morning: document.getElementById("tgInputChatId_morning")?.value.trim() || "",
          afternoon: document.getElementById("tgInputChatId_afternoon")?.value.trim() || "",
          night: document.getElementById("tgInputChatId_night")?.value.trim() || ""
        };
        const notifyNewStudent = document.getElementById("tgNotifyNewStudent")?.checked ?? true;
        const notifyShiftAttendanceSummary = document.getElementById("tgNotifyShiftAttendanceSummary")?.checked ?? true;
        const notifyIndividualAttendance = document.getElementById("tgNotifyIndividualAttendance")?.checked ?? false;
        const notifyPayment = document.getElementById("tgNotifyPayment")?.checked ?? true;
        const notifyExam = document.getElementById("tgNotifyExam")?.checked ?? true;
        const notifyCertificate = document.getElementById("tgNotifyCertificate")?.checked ?? true;
        const notifyDailyAttendanceSummary = document.getElementById("tgNotifyDailyAttendanceSummary")?.checked ?? true;

        const newConfig = {
          enabled,
          botToken,
          chatId,
          shiftChatIds,
          notifyNewStudent,
          notifyShiftAttendanceSummary,
          notifyIndividualAttendance,
          notifyAttendance: notifyIndividualAttendance, // For backwards compatibility
          shiftAttendanceDelayMinutes: 5,
          notifyDailyAttendanceSummary,
          dailyAttendanceTime: "19:00",
          notifyPayment,
          notifyExam,
          notifyCertificate
        };

        if (typeof TelegramService !== "undefined") {
          TelegramService.saveConfig(newConfig);
        }

        const badge = document.getElementById("telegramStatusBadge");
        if (badge) {
          badge.innerHTML = enabled 
            ? '<i class="fa-solid fa-circle-check"></i> បើកដំណើរការ (Active)' 
            : '<i class="fa-solid fa-circle-pause"></i> បិទដំណើរការ (Disabled)';
        }

        App.showToast("បានរក្សាទុកការកំណត់ Telegram Bot ដោយជោគជ័យ!", "success");
      });
    }

    // Auto-detect All 3 Shift Groups button (វេនព្រឹក • វេនរសៀល • វេនយប់)
    const autoDetectAllBtn = document.getElementById("autoDetectAllShiftGroupsBtn");
    if (autoDetectAllBtn) {
      autoDetectAllBtn.addEventListener("click", async () => {
        const origText = autoDetectAllBtn.innerHTML;
        autoDetectAllBtn.disabled = true;
        autoDetectAllBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងស្កេនគ្រុប...`;

        try {
          if (typeof TelegramService !== "undefined") {
            const res = await TelegramService.autoDetectAllShiftGroups();
            if (res.detected.morning) {
              const el = document.getElementById("tgInputChatId_morning");
              if (el) el.value = res.detected.morning.id;
            }
            if (res.detected.afternoon) {
              const el = document.getElementById("tgInputChatId_afternoon");
              if (el) el.value = res.detected.afternoon.id;
            }
            if (res.detected.night) {
              const el = document.getElementById("tgInputChatId_night");
              if (el) el.value = res.detected.night.id;
            }

            const enabledCheckbox = document.getElementById("tgInputEnabled");
            if (enabledCheckbox) enabledCheckbox.checked = true;

            const badge = document.getElementById("telegramStatusBadge");
            if (badge) badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> បើកដំណើរការ (Active)';

            const matchedNames = [];
            if (res.detected.morning) matchedNames.push("🌅 វេនព្រឹក");
            if (res.detected.afternoon) matchedNames.push("☀️ វេនរសៀល");
            if (res.detected.night) matchedNames.push("🌙 វេនយប់");

            if (matchedNames.length > 0) {
              App.showToast(`🎉 ស្កេនរកឃើញ និងផ្គូផ្គងជោគជ័យ ${matchedNames.length} គ្រុប៖ ${matchedNames.join(", ")}!`, "success");
              App.triggerConfetti();
            } else {
              App.showToast(`⚠️ រកឃើញ Chat ID ចំនួន ${res.allFoundGroups?.length || 0} ប៉ុន្តែឈ្មោះគ្រុបមិនទាន់មានពាក្យ 'ព្រឹក', 'រសៀល' ឬ 'យប់'`, "warning");
            }
          }
        } catch (err) {
          App.showToast(err.message, "warning");
        } finally {
          autoDetectAllBtn.disabled = false;
          autoDetectAllBtn.innerHTML = origText;
        }
      });
    }

    // Test Broadcast to All 3 Groups Button
    const testBroadcastAllBtn = document.getElementById("testBroadcastAllShiftsBtn");
    if (testBroadcastAllBtn) {
      testBroadcastAllBtn.addEventListener("click", async () => {
        const origText = testBroadcastAllBtn.innerHTML;
        testBroadcastAllBtn.disabled = true;
        testBroadcastAllBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងផ្សាយដំណឹង...`;

        try {
          if (typeof TelegramService !== "undefined") {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const testMsg = `
📢 <b>សាកល្បងផ្សាយដំណឹងចូលគ្រុប Telegram ទាំង ៣ វេន</b>
━━━━━━━━━━━━━━━━━━━━
🏫 <b>មជ្ឈមណ្ឌលកុំព្យូទ័រ TIS LAB COMPUTER</b>
👥 <b>ជម្រាបជូន៖</b> គ្រុបសិក្សាទាំងអស់ (វេនព្រឹក • វេនរសៀល • វេនយប់)
⏰ <b>ពេលវេលា៖</b> ${timeStr} • ${TelegramService.getLocalDateStr()}
━━━━━━━━━━━━━━━━━━━━
✅ <b>ប្រព័ន្ធ Telegram Broadcast ដំណើរការជោគជ័យ ១០០%!</b>
ប្អូនៗសិស្សានុសិស្សគ្រប់វេននឹងទទួលបានដំណឹងថ្ងៃឈប់សម្រាក បុណ្យជាតិ កាលវិភាគប្រឡង និងរបាយការណ៍វត្តមានតាមវេនស្វ័យប្រវត្តិតាមរយៈ Bot នេះ។

✍️ <b>រៀបចំដោយ៖</b> លោកគ្រូ ខៀន ធូ (071 721 0307)
            `.trim();

            const res = await TelegramService.broadcastToShifts("ALL", testMsg);
            if (res && res.success) {
              App.showToast(`🎉 បានផ្សាយដំណឹងសាកល្បងចូល ${res.sentCount} គ្រុបដោយជោគជ័យ!`, "success");
              App.triggerConfetti();
            } else {
              App.showToast(`⚠️ មិនអាចផ្សាយដំណឹងបានទេ៖ ${res.error || 'សូមពិនិត្យការកំណត់ Group ID'}`, "error");
            }
          }
        } catch (err) {
          App.showToast("កំហុសក្នុងការផ្សាយដំណឹង: " + err.message, "error");
        } finally {
          testBroadcastAllBtn.disabled = false;
          testBroadcastAllBtn.innerHTML = origText;
        }
      });
    }

    // Auto-detect Telegram Chat ID button
    const autoDetectTgBtn = document.getElementById("autoDetectTgChatIdBtn");
    if (autoDetectTgBtn) {
      autoDetectTgBtn.addEventListener("click", async () => {
        const origText = autoDetectTgBtn.innerHTML;
        autoDetectTgBtn.disabled = true;
        autoDetectTgBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងស្វែងរក...`;

        try {
          if (typeof TelegramService !== "undefined") {
            const res = await TelegramService.autoDetectChatId();
            const chatIdInput = document.getElementById("tgInputChatId");
            if (chatIdInput) {
              chatIdInput.value = res.chatId;
            }
            const enabledCheckbox = document.getElementById("tgInputEnabled");
            if (enabledCheckbox) {
              enabledCheckbox.checked = true;
            }
            const badge = document.getElementById("telegramStatusBadge");
            if (badge) {
              badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> បើកដំណើរការ (Active)';
            }

            App.showToast(`🎉 រកឃើញ Chat ID ជោគជ័យ: ${res.chatId} (${res.chatTitle})!`, "success");
            App.triggerConfetti();

            // Send test message
            const botToken = document.getElementById("tgInputToken")?.value.trim() || APP_CONFIG.telegramConfig.botToken;
            await TelegramService.sendTestMessage(botToken, res.chatId);
          }
        } catch (err) {
          App.showToast(err.message, "warning");
        } finally {
          autoDetectTgBtn.disabled = false;
          autoDetectTgBtn.innerHTML = origText;
        }
      });
    }

    // Broadcast Student Desk & Leave Guide to All 3 Groups Button
    const broadcastDeskBtn = document.getElementById("broadcastStudentDeskBtn");
    if (broadcastDeskBtn) {
      broadcastDeskBtn.addEventListener("click", async () => {
        if (typeof TelegramService === "undefined" || !TelegramService.isEnabled()) {
          App.showToast("សូមបើកដំណើរការ Telegram Bot ជាមុនសិន!", "warning");
          return;
        }
        const origText = broadcastDeskBtn.innerHTML;
        broadcastDeskBtn.disabled = true;
        broadcastDeskBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងផ្សាយ...`;

        try {
          const res = await TelegramService.publishStudentDeskToShifts("ALL");
          if (res && res.success) {
            App.showToast(`🎉 បានផ្សាយតុសេវាសិស្ស & របៀបសុំច្បាប់ចូល ${res.sentCount} គ្រុបជោគជ័យ!`, "success");
            App.triggerConfetti();
          } else {
            App.showToast(`⚠️ មិនអាចផ្សាយបានទេ៖ ${res?.error || 'សូមពិនិត្យការកំណត់'}`, "error");
          }
        } catch (err) {
          App.showToast("កំហុសក្នុងការផ្សាយ៖ " + err.message, "error");
        } finally {
          broadcastDeskBtn.disabled = false;
          broadcastDeskBtn.innerHTML = origText;
        }
      });
    }

    if (testTgBtn) {
      testTgBtn.addEventListener("click", async () => {
        const botToken = document.getElementById("tgInputToken")?.value.trim() || "";
        const chatId = document.getElementById("tgInputChatId")?.value.trim() || "";

        if (!botToken || !chatId) {
          App.showToast("សូមបញ្ចូល Bot Token និង Chat ID ជាមុនសិន!", "warning");
          return;
        }

        const origHtml = testTgBtn.innerHTML;
        testTgBtn.disabled = true;
        testTgBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងផ្ញើសារសាកល្បង...`;

        try {
          if (typeof TelegramService !== "undefined") {
            const success = await TelegramService.sendTestMessage(botToken, chatId);
            if (success) {
              App.showToast("🎉 បានផ្ញើសារសាកល្បងទៅកាន់ Telegram ជោគជ័យ!", "success");
              App.triggerConfetti();
            } else {
              App.showToast("⚠️ មិនអាចផ្ញើសារបានទេ! សូមពិនិត្យមើល Bot Token និង Chat ID ម្តងទៀត។", "error");
            }
          }
        } catch (e) {
          App.showToast("កំហុសក្នុងការផ្ញើសារ: " + e.message, "error");
        } finally {
          testTgBtn.disabled = false;
          testTgBtn.innerHTML = origHtml;
        }
      });
    }

    // Test Shift Attendance Summary Button
    const testShiftSummaryBtn = document.getElementById("testShiftSummaryTelegramBtn");
    if (testShiftSummaryBtn) {
      testShiftSummaryBtn.addEventListener("click", async () => {
        const origHtml = testShiftSummaryBtn.innerHTML;
        testShiftSummaryBtn.disabled = true;
        testShiftSummaryBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងផ្ញើរបាយការណ៍តាមវេន...`;

        try {
          if (typeof TelegramService !== "undefined") {
            const user = typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "លោកគ្រូ ខៀន ធូ (Admin)";
            const res = await TelegramService.sendShiftAttendanceSummary("ព្រឹក", null, `${user} [សាកល្បង Shift Report]`, false);
            if (res && res.success) {
              App.showToast("🎉 " + res.message, "success");
              App.triggerConfetti();
            } else {
              App.showToast("⚠️ " + (res.error || "មិនអាចផ្ញើរបាយការណ៍បានទេ សូមពិនិត្យ Chat ID / Token"), "warning");
            }
          }
        } catch (e) {
          App.showToast("កំហុសក្នុងការផ្ញើ៖ " + e.message, "error");
        } finally {
          testShiftSummaryBtn.disabled = false;
          testShiftSummaryBtn.innerHTML = origHtml;
        }
      });
    }

    // Test Daily Attendance Summary Button (7:00 PM Simulation)
    const testDailySummaryBtn = document.getElementById("testDailySummaryTelegramBtn");
    if (testDailySummaryBtn) {
      testDailySummaryBtn.addEventListener("click", async () => {
        const origHtml = testDailySummaryBtn.innerHTML;
        testDailySummaryBtn.disabled = true;
        testDailySummaryBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> កំពុងផ្ញើរបាយការណ៍វត្តមាន...`;

        try {
          if (typeof TelegramService !== "undefined") {
            const user = typeof AuthService !== "undefined" && AuthService.getCurrentUser() ? AuthService.getCurrentUser().nameKh : "លោកគ្រូ ខៀន ធូ (Admin)";
            const res = await TelegramService.sendDailyAttendanceSummary(null, true, `${user} [សាកល្បង 19:00 Report]`);
            if (res && res.success) {
              App.showToast("🎉 " + res.message, "success");
              App.triggerConfetti();
            } else {
              App.showToast("⚠️ " + (res.error || "មិនអាចផ្ញើរបាយការណ៍បានទេ សូមពិនិត្យ Chat ID / Token"), "warning");
            }
          }
        } catch (e) {
          App.showToast("កំហុសក្នុងការផ្ញើ៖ " + e.message, "error");
        } finally {
          testDailySummaryBtn.disabled = false;
          testDailySummaryBtn.innerHTML = origHtml;
        }
      });
    }
  },

  initHostImgEvents() {
    if (typeof ImageHostService === "undefined") return;

    const refreshStats = () => {
      const stats = ImageHostService.getStorageStats();
      const quotaBar = document.getElementById("hostimgQuotaBar");
      const quotaPercent = document.getElementById("hostimgQuotaPercent");
      const quotaText = document.getElementById("hostimgQuotaText");
      const hostedCount = document.getElementById("hostimgHostedCount");
      const base64Count = document.getElementById("hostimgBase64Count");
      const base64Mb = document.getElementById("hostimgBase64Mb");

      if (quotaBar) quotaBar.style.width = `${stats.percentQuota}%`;
      if (quotaPercent) {
        quotaPercent.innerText = `${stats.percentQuota}%`;
        if (stats.percentQuota > 80) quotaPercent.style.color = "#dc2626";
        else if (stats.percentQuota > 50) quotaPercent.style.color = "#d97706";
        else quotaPercent.style.color = "#059669";
      }
      if (quotaText) {
        quotaText.innerText = `${stats.localStorageMb} MB / 5.00 MB (សរុបសិស្ស ${stats.totalStudents} នាក់)`;
      }
      if (hostedCount) hostedCount.innerText = stats.hostedCount;
      if (base64Count) base64Count.innerText = stats.base64Count;
      if (base64Mb) base64Mb.innerText = stats.base64Mb;
    };

    // Run stats initially
    refreshStats();

    // Refresh stats button
    const btnRefreshStats = document.getElementById("btnRefreshHostImgStats");
    if (btnRefreshStats) {
      btnRefreshStats.addEventListener("click", () => {
        refreshStats();
        App.showToast("បានពិនិត្យ Storage Quota រួចរាល់!", "info");
      });
    }

    // Save configuration button
    const btnSaveConfig = document.getElementById("btnSaveHostImgConfig");
    if (btnSaveConfig) {
      btnSaveConfig.addEventListener("click", () => {
        const provider = document.getElementById("hostimgProviderSelect")?.value || "auto";
        const imgbbApiKey = document.getElementById("hostimgInputImgbbKey")?.value.trim() || "";
        const autoCropPassport = document.getElementById("hostimgAutoCropCheckbox")?.checked !== false;
        const quality = parseFloat(document.getElementById("hostimgQualitySelect")?.value || "0.85");

        ImageHostService.saveConfig({
          provider,
          imgbbApiKey,
          autoCropPassport,
          quality
        });

        // Update badge
        const badge = document.getElementById("hostimgActiveProviderBadge");
        if (badge) {
          const providerNames = {
            auto: "🌐 Auto Multi-Tier",
            server: "🖥️ Local Server Only",
            telegram: "✈️ Telegram Bot CDN",
            imgbb: "⚡ ImgBB CDN",
            freeimage: "🖼️ FreeImage.host CDN",
            base64: "💾 Local Base64"
          };
          badge.innerHTML = `<i class="fa-solid fa-server"></i> ${providerNames[provider] || provider}`;
        }

        App.showToast("🎉 បានរក្សាទុកការកំណត់ HostImg Pro ជោគជ័យ!", "success");
        App.triggerConfetti();
      });
    }

    // 1-Click Migration
    const btnMigrate = document.getElementById("btnMigrateHostImg");
    if (btnMigrate) {
      btnMigrate.addEventListener("click", async () => {
        const stats = ImageHostService.getStorageStats();
        if (stats.base64Count === 0) {
          App.showToast("ពុំមានរូបភាព Base64 ចាស់ៗដែលត្រូវបំលែងទេ! រូបទាំងអស់ត្រូវបាន Host រួចជាស្រេច។", "info");
          return;
        }

        if (!confirm(`តើលោកគ្រូចង់ចាប់ផ្តើមបំលែងរូបភាព Base64 របស់សិស្សទាំង ${stats.base64Count} នាក់ (~${stats.base64Mb} MB) ទៅជា Hosted URLs ឥឡូវនេះមែនទេ?`)) {
          return;
        }

        const origHtml = btnMigrate.innerHTML;
        btnMigrate.disabled = true;
        btnMigrate.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងបំលែង...`;

        const progressContainer = document.getElementById("hostimgMigrationProgress");
        const progressBar = document.getElementById("hostimgMigrationBar");
        const progressLabel = document.getElementById("hostimgMigrationLabel");
        const progressCounter = document.getElementById("hostimgMigrationCounter");

        if (progressContainer) progressContainer.style.display = "block";

        try {
          const result = await ImageHostService.migrateAllStudentAvatars((p) => {
            const pct = Math.round((p.current / p.total) * 100);
            if (progressBar) progressBar.style.width = `${pct}%`;
            if (progressLabel) progressLabel.innerText = `កំពុងបំលែង (${p.current}/${p.total}): ${p.studentName}...`;
            if (progressCounter) progressCounter.innerText = `${p.current}/${p.total} (${pct}%)`;
          });

          refreshStats();
          if (progressLabel) progressLabel.innerText = `✅ បំលែងជោគជ័យ ១០០%!`;
          App.showToast(result.message, "success");
          App.triggerConfetti();
        } catch (err) {
          App.showToast("កំហុសក្នុងការបំលែងរូបភាព: " + err.message, "error");
        } finally {
          btnMigrate.disabled = false;
          btnMigrate.innerHTML = origHtml;
        }
      });
    }

    // Test File Input Upload
    const testFileInput = document.getElementById("hostimgTestFileInput");
    if (testFileInput) {
      testFileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const resultBox = document.getElementById("hostimgTestResultBox");
        const resultImg = document.getElementById("hostimgTestResultImg");
        const resultUrlInput = document.getElementById("hostimgTestUrlInput");
        const providerTag = document.getElementById("hostimgTestProviderTag");
        const speedTag = document.getElementById("hostimgTestSpeedTag");
        const sizeTag = document.getElementById("hostimgTestSizeTag");

        if (resultBox) resultBox.style.display = "block";
        if (resultImg) {
          resultImg.style.opacity = "0.4";
          resultImg.src = "assets/images/default-male.svg";
        }
        if (resultUrlInput) resultUrlInput.value = "កំពុង Upload ទៅ HostImg...";

        const startTime = Date.now();
        try {
          const res = await ImageHostService.upload(file, "test_upload");
          const elapsed = Date.now() - startTime;

          if (res.success && res.url) {
            if (resultImg) {
              resultImg.src = res.url;
              resultImg.style.opacity = "1";
            }
            if (resultUrlInput) resultUrlInput.value = res.url;
            if (providerTag) {
              providerTag.innerText = res.provider ? res.provider.toUpperCase() : "HOSTIMG";
            }
            if (speedTag) speedTag.innerText = `⏱️ ${elapsed}ms`;
            if (sizeTag) {
              const kb = Math.round(file.size / 1024);
              sizeTag.innerText = `📦 ${kb} KB`;
            }
            App.showToast(`🎉 Upload រូបភាពសាកល្បងជោគជ័យតាមរយៈ ${res.provider}!`, "success");
          } else {
            throw new Error(res.error || "Upload failed");
          }
        } catch (err) {
          App.showToast("មិនអាច Upload បានទេ: " + err.message, "error");
          if (resultUrlInput) resultUrlInput.value = "បរាជ័យ: " + err.message;
        } finally {
          if (resultImg) resultImg.style.opacity = "1";
          testFileInput.value = "";
        }
      });
    }

    // Copy URL button
    const btnCopyUrl = document.getElementById("btnCopyHostImgUrl");
    if (btnCopyUrl) {
      btnCopyUrl.addEventListener("click", () => {
        const input = document.getElementById("hostimgTestUrlInput");
        if (input && input.value && !input.value.startsWith("កំពុង") && !input.value.startsWith("បរាជ័យ")) {
          navigator.clipboard.writeText(input.value);
          App.showToast("បានចម្លង Direct URL ទៅ Clipboard!", "info");
        }
      });
    }
  }
};



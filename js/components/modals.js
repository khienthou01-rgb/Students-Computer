/**
 * Component: Modals (Student Details & ID Card, Edit, Delete Confirmation)
 */
const ModalsComponent = {
  render() {
    return `
      <!-- 1. Modal: Upgraded Modern Student Profile & Additional Payment Popup -->
      <div id="studentDetailsModal" class="modal-overlay">
        <div class="modal-card">
          <!-- 1.1 Modal Header: Burgundy / Deep Wine #851349 -->
          <div class="student-modal-header">
            <div class="header-title-box">
              <i class="fa-solid fa-circle-info"></i>
              <span id="modalStudentTitle">ព័ត៌មានលម្អិតរបស់សិស្ស និងបង់ប្រាក់បន្ថែម</span>
            </div>
            <button type="button" class="header-close-btn" data-close-modal="studentDetailsModal" title="បិទផ្ទាំង">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- 1.2 Modal Scrollable Body -->
          <div class="student-modal-body">
            <!-- Top Profile Summary Card -->
            <div class="student-profile-header-card">
              <!-- Left: Avatar with Camera Badge -->
              <div class="profile-avatar-wrapper">
                <img id="profileHeaderAvatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e2e8f0'/%3E%3Cpath d='M50 48a16 16 0 100-32 16 16 0 000 32zm0 8c-18 0-32 12-32 26v4h64v-4c0-14-14-26-32-26z' fill='%2394a3b8'/%3E%3C/svg%3E" alt="Avatar" class="profile-avatar-img">
                <label for="profileAvatarFileInput" class="profile-camera-badge" title="ផ្លាស់ប្តូររូបថតសិស្ស">
                  <i class="fa-solid fa-camera"></i>
                  <input type="file" id="profileAvatarFileInput" accept="image/*" style="display: none;">
                </label>
              </div>

              <!-- Center: Student Name & Badges -->
              <div class="profile-info-center">
                <h2 id="profileHeaderNameKh" class="profile-name-title">ឈ្មោះសិស្ស</h2>
                <div class="profile-badges-row">
                  <span class="profile-badge-pill profile-badge-id">
                    <i class="fa-solid fa-id-card"></i> ID: <strong id="profileHeaderId" class="font-mono">TX01</strong>
                  </span>
                  <span class="profile-badge-pill profile-badge-course">
                    <i class="fa-solid fa-graduation-cap"></i> <span id="profileHeaderCourse">ថ្នាក់កុំព្យូទ័រ</span>
                  </span>
                  <span id="profileHeaderFeeStatus" class="profile-badge-pill profile-badge-fee-paid">
                    <i class="fa-solid fa-circle-info"></i> <i class="fa-solid fa-check"></i> <span id="profileHeaderFeeStatusText">បង់រួចរាល់</span>
                  </span>
                </div>
              </div>

              <!-- Right: Action Buttons Group -->
              <div class="profile-actions-right">
                <button type="button" id="profileBtnContactHub" class="btn-pill-action" style="background: rgba(0, 136, 204, 0.12); color: #0088cc; border: 1px solid rgba(0, 136, 204, 0.35); font-weight: 700;" title="មជ្ឈមណ្ឌលទំនាក់ទំនង (Call, Telegram, Templates)">
                  <i class="fa-solid fa-comments"></i> <span>ទំនាក់ទំនង</span>
                </button>
                <button type="button" id="profileBtnReceipt" class="btn-pill-action" style="background: rgba(16, 185, 129, 0.12); color: #059669; border: 1px solid rgba(16, 185, 129, 0.35); font-weight: 700;" title="ចេញបង្កាន់ដៃ & បោះពុម្ព (Print Receipt)">
                  <i class="fa-solid fa-receipt"></i> <span>បង្កាន់ដៃ</span>
                </button>
                <button type="button" id="profileBtnAddPayment" class="btn-pill-action btn-pill-blue" title="កត់ត្រាការបង់ប្រាក់បន្ថែម">
                  <i class="fa-solid fa-plus-circle"></i> <span>បង់ប្រាក់បន្ថែម</span>
                </button>
                <button type="button" id="profileBtnEdit" class="btn-pill-action btn-pill-amber" title="កែប្រែទិន្នន័យសិស្ស">
                  <i class="fa-solid fa-pen-to-square"></i> <span>កែប្រែ</span>
                </button>
                <button type="button" id="profileBtnMarkDrop" class="btn-pill-action" style="border: 1px solid #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.08);" title="កំណត់ជាសិស្សបោះបង់ការសិក្សា (ID នឹងត្រូវចាក់សោរ)">
                  <i class="fa-solid fa-user-xmark"></i> <span>បោះបង់</span>
                </button>
                <button type="button" id="profileBtnMarkGraduate" class="btn-pill-action" style="border: 1px solid #10b981; color: #10b981; background: rgba(16, 185, 129, 0.08);" title="កំណត់ជាសិស្សបញ្ចប់ការសិក្សា">
                  <i class="fa-solid fa-user-graduate"></i> <span>បញ្ចប់</span>
                </button>
                <button type="button" id="profileBtnToggleStatus" class="btn-pill-action btn-pill-outline-yellow" title="ផ្លាស់ប្តូរស្ថានភាពសិស្ស">
                  <i class="fa-regular fa-circle-pause"></i> <span id="profileBtnStatusText">ផ្អាកការសិក្សា</span>
                </button>
                <div class="dropdown-wrapper">
                  <button type="button" id="profileBtnMore" class="btn-pill-action btn-pill-grey" title="ជម្រើសផ្សេងៗ">
                    <i class="fa-solid fa-ellipsis-vertical"></i> <span>ផ្សេងៗ</span> <i class="fa-solid fa-caret-down" style="font-size: 11px;"></i>
                  </button>
                  <div id="profileMoreMenu" class="dropdown-menu-custom">
                    <button type="button" class="dropdown-item-custom" id="menuItemContactHub">
                      <i class="fa-solid fa-comments text-sky-500"></i> <span>មជ្ឈមណ្ឌលទំនាក់ទំនង (Contact Hub)</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemDigitalReceiptModal">
                      <i class="fa-solid fa-receipt text-emerald-500"></i> <span>ចេញបង្កាន់ដៃ & បោះពុម្ព (Digital Receipt)</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemPrintIdCard">
                      <i class="fa-solid fa-id-card text-indigo-500"></i> <span>បោះពុម្ពកាតសិស្ស</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemPrintTranscript">
                      <i class="fa-solid fa-file-invoice text-emerald-500"></i> <span>ព្រឹត្តិបត្រពិន្ទុ (Transcript)</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemOfficialLetter">
                      <i class="fa-solid fa-stamp text-sky-500"></i> <span>ចេញលិខិតផ្លូវការ (Official Letter)</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemQuickSwitchShift">
                      <i class="fa-solid fa-clock-rotate-left text-amber-500"></i> <span>ប្តូរវេនសិក្សា (Switch Shift)</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemStudentNotes">
                      <i class="fa-solid fa-note-sticky text-teal-500"></i> <span>កំណត់ត្រាការសង្កេតសិស្ស (Notes)</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemSendTelegramReceipt">
                      <i class="fa-solid fa-receipt text-emerald-500"></i> <span>ផ្ញើបង្កាន់ដៃបង់ប្រាក់ទៅ Telegram</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemIssueCert">
                      <i class="fa-solid fa-award text-amber-500"></i> <span>ចេញវិញ្ញាបនបត្រឌីជីថល</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemGenerateCv">
                      <i class="fa-solid fa-file-lines text-indigo-500"></i> <span>បង្កើតប្រវត្តិរូប CV ជំនាញកុំព្យូទ័រ A4</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemResetPin">
                      <i class="fa-solid fa-key text-blue-500"></i> <span>កំណត់ PIN ឡើងវិញ</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemMarkDrop" style="color: #ef4444;">
                      <i class="fa-solid fa-user-xmark" style="color: #ef4444;"></i> <span>បោះបង់ការសិក្សា (ចាក់សោរ ID)</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemMarkGraduate" style="color: #10b981;">
                      <i class="fa-solid fa-user-graduate" style="color: #10b981;"></i> <span>បញ្ចប់ការសិក្សា & ចេញប័ណ្ណ</span>
                    </button>
                    <button type="button" class="dropdown-item-custom" id="menuItemReactivateStudent" style="color: #3b82f6;">
                      <i class="fa-solid fa-rotate-left" style="color: #3b82f6;"></i> <span>ស្តារចូលរៀនវិញ (បើកសោរ ID)</span>
                    </button>
                    <div style="height: 1px; background: #e2e8f0; margin: 4px 0;"></div>
                    <button type="button" class="dropdown-item-custom danger" id="menuItemDeleteStudent">
                      <i class="fa-solid fa-trash"></i> <span>លុបទិន្នន័យសិស្ស</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Tabs Bar -->
            <div class="student-nav-tabs-bar">
              <button type="button" class="student-tab-btn" data-student-tab="general">
                <i class="fa-regular fa-user"></i> <span>ព័ត៌មានទូទៅ</span>
              </button>
              <button type="button" class="student-tab-btn" data-student-tab="family">
                <i class="fa-solid fa-users"></i> <span>គ្រួសារ</span>
              </button>
              <button type="button" class="student-tab-btn active" data-student-tab="finance">
                <i class="fa-solid fa-money-bill-wave"></i> <span>ហិរញ្ញវត្ថុ</span>
              </button>
              <button type="button" class="student-tab-btn" data-student-tab="exams">
                <i class="fa-regular fa-newspaper"></i> <span>លទ្ធផលសិក្សា</span>
              </button>
              <button type="button" class="student-tab-btn" data-student-tab="attendance">
                <i class="fa-regular fa-calendar-check"></i> <span>អវត្តមាន</span>
              </button>
              <button type="button" class="student-tab-btn" data-student-tab="services">
                <i class="fa-solid fa-id-card"></i> <span>សេវាផ្សេងៗ</span> <i class="fa-solid fa-caret-down" style="font-size: 10px;"></i>
              </button>
            </div>

            <!-- Tab Panes Container -->
            <div class="student-tab-panes-wrapper">
              <!-- ========================================== -->
              <!-- Tab 1: ហិរញ្ញវត្ថុ (Finance) - DEFAULT ACTIVE -->
              <!-- ========================================== -->
              <div class="student-tab-pane active" id="pane-finance">
                <!-- Inline Quick Payment Drawer/Form -->
                <div id="inlineQuickPayBox" class="inline-quick-pay-form">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <strong style="color: #1e40af; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                      <i class="fa-solid fa-cash-register"></i> កត់ត្រាការបង់ប្រាក់បន្ថែម (Record Payment)
                    </strong>
                    <button type="button" id="closeQuickPayBtn" style="background: none; border: none; font-size: 1.1rem; color: #64748b; cursor: pointer;">✕</button>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 0.85rem;">
                    <div>
                      <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #334155;">ចំនួនទឹកប្រាក់បង់ ($) *</label>
                      <input type="number" id="quickPayAmount" class="form-control" value="50" step="1" min="1" required style="font-weight: 700;">
                    </div>
                    <div>
                      <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #334155;">វិធីសាស្ត្របង់ប្រាក់</label>
                      <select id="quickPayMethod" class="form-control">
                        <option value="Cash">Cash (សាច់ប្រាក់សុទ្ធ)</option>
                        <option value="ABA KHQR">ABA KHQR</option>
                        <option value="Wing">Wing Bank</option>
                        <option value="ACLEDA">ACLEDA Bank</option>
                      </select>
                    </div>
                    <div>
                      <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #334155;">ថ្ងៃខែបង់ប្រាក់</label>
                      <input type="date" id="quickPayDate" class="form-control">
                    </div>
                    <div>
                      <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #334155;">ចំណាំ (Note)</label>
                      <input type="text" id="quickPayNote" class="form-control" placeholder="ឧ. បង់ថ្លៃវគ្គសិក្សាពេញ">
                    </div>
                  </div>
                  <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px;">
                    <button type="button" id="cancelQuickPayBtn" class="btn-secondary" style="height: 34px; padding: 0 14px; font-size: 0.82rem;">បោះបង់</button>
                    <button type="button" id="submitQuickPayBtn" class="btn-primary" style="height: 34px; padding: 0 18px; font-size: 0.82rem; background: #0284c7; border-color: #0284c7;">
                      <i class="fa-solid fa-check"></i> រក្សាទុកការបង់ប្រាក់
                    </button>
                  </div>
                </div>

                <!-- 2-Column Finance Layout -->
                <div class="finance-tab-layout">
                  <!-- Left: Blue Financial Summary Card -->
                  <div class="finance-blue-card">
                    <div>
                      <div class="finance-blue-card-header">
                        <div class="finance-blue-icon-box">
                          <i class="fa-solid fa-wallet"></i>
                        </div>
                        <h3 class="finance-blue-title">សង្ខេបហិរញ្ញវត្ថុ</h3>
                      </div>

                      <div class="finance-breakdown-box">
                        <div class="finance-breakdown-subhead">ការបែងចែកថ្លៃសិក្សា</div>
                        <div class="finance-breakdown-item">
                          <span><i class="fa-solid fa-id-badge"></i> ថ្លៃសិក្សា</span>
                          <span id="financeCardTuition">$250.00</span>
                        </div>
                        <div class="finance-breakdown-item">
                          <span><i class="fa-solid fa-box-archive"></i> ថ្លៃសម្ភារៈ</span>
                          <span id="financeCardMaterials">$0.00</span>
                        </div>
                        <div class="finance-breakdown-item">
                          <span><i class="fa-solid fa-receipt"></i> ថ្លៃរដ្ឋបាល</span>
                          <span id="financeCardAdmin">$0.00</span>
                        </div>
                      </div>
                    </div>

                    <div class="finance-summary-bottom">
                      <div class="finance-total-row">
                        <span>សរុបត្រូវបង់</span>
                        <span id="financeCardTotal" class="finance-total-amount">$250.00</span>
                      </div>
                      <div class="finance-paid-row">
                        <span><i class="fa-regular fa-circle-check"></i> បានបង់រួច</span>
                        <span id="financeCardPaid" class="font-mono">$250.00</span>
                      </div>
                      <div class="finance-due-row">
                        <span>នៅខ្វះ (BALANCE DUE)</span>
                        <span id="financeCardBalance" class="font-mono">$0.00</span>
                      </div>
                    </div>
                  </div>

                  <!-- Right: Payment History Panel -->
                  <div class="finance-history-panel">
                    <div class="history-panel-header">
                      <div class="history-title-box">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                        <div>
                          <h4>ប្រវត្តិការបង់ប្រាក់</h4>
                          <p>ការបង់ប្រាក់ទាំងអស់ដែលបានធ្វើឡើង</p>
                        </div>
                      </div>

                      <div class="history-header-actions">
                        <button type="button" id="financeAddPaymentBtn" class="btn-history-add">
                          <i class="fa-solid fa-plus"></i> <span>បង់ប្រាក់បន្ថែម</span>
                        </button>
                        <button type="button" id="financeOpenReceiptBtn" class="btn-history-print" style="color: #059669; border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.1); width: auto; padding: 0 10px; gap: 4px; display: inline-flex; align-items: center;" title="ចេញបង្កាន់ដៃបង់ប្រាក់ & Print (Digital Receipt)">
                          <i class="fa-solid fa-receipt"></i> <span>ចេញបង្កាន់ដៃ</span>
                        </button>
                        <button type="button" id="financePrintHistoryBtn" class="btn-history-print" title="បោះពុម្ពប្រវត្តិបង់ប្រាក់">
                          <i class="fa-solid fa-print"></i>
                        </button>
                        <span class="badge-history-count" id="financeCountBadge">
                          <i class="fa-regular fa-newspaper"></i> <span>1 លើក</span>
                        </span>
                        <span class="badge-history-total" id="financeTotalPaidBadge">
                          <i class="fa-solid fa-dollar-sign"></i> <span>$250.00</span>
                        </span>
                      </div>
                    </div>

                    <!-- Payment History Table -->
                    <div class="history-table-wrapper">
                      <table class="history-table">
                        <thead>
                          <tr>
                            <th>ដំណាក់កាល</th>
                            <th><i class="fa-regular fa-calendar-days"></i> ថ្ងៃខែបង់ប្រាក់</th>
                            <th><i class="fa-solid fa-history"></i> ចំនួនខែ</th>
                            <th><i class="fa-solid fa-dollar-sign"></i> សរុប/បានបង់/ជំពាក់</th>
                            <th><i class="fa-solid fa-user-shield"></i> អ្នកទទួល</th>
                            <th style="text-align: right;"><i class="fa-solid fa-gear"></i> សកម្មភាព</th>
                          </tr>
                        </thead>
                        <tbody id="financePaymentTableBody">
                          <!-- Filled dynamically by JavaScript -->
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 2: ព័ត៌មានទូទៅ (General Information) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-general">
                <div class="general-info-grid">
                  <!-- Section A: Personal Details -->
                  <div class="info-card-section">
                    <h4 class="info-card-title"><i class="fa-solid fa-user-check text-indigo-500"></i> ព័ត៌មានផ្ទាល់ខ្លួន (Personal Info)</h4>
                    <div class="info-field-row">
                      <span class="info-field-label">អត្តលេខសិស្ស (ID)</span>
                      <span id="modalDetailId" class="info-field-val font-mono">TX01</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ឈ្មោះជាភាសាខ្មែរ</span>
                      <span id="modalDetailNameKh" class="info-field-val">ឈ្មោះសិស្ស</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ឈ្មោះជាអក្សរឡាតាំង</span>
                      <span id="modalDetailNameEn" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ភេទ</span>
                      <span id="modalDetailGender" class="info-field-val">ប្រុស</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ថ្ងៃខែឆ្នាំកំណើត</span>
                      <span id="modalDetailDob" class="info-field-val">2006-01-01</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">លេខទូរស័ព្ទផ្ទាល់ខ្លួន</span>
                      <span id="modalDetailPhone" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">អាសយដ្ឋាន/ខេត្ត</span>
                      <span id="modalDetailAddress" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">កាលបរិច្ឆេទចុះឈ្មោះ</span>
                      <span id="modalDetailCreatedAt" class="info-field-val">—</span>
                    </div>
                  </div>

                  <!-- Section B: Academic & Credentials -->
                  <div class="info-card-section">
                    <h4 class="info-card-title"><i class="fa-solid fa-laptop-code text-indigo-500"></i> ព័ត៌មានការសិក្សា & គណនី (Academic & Account)</h4>
                    <div class="info-field-row">
                      <span class="info-field-label">ថ្នាក់សិក្សា</span>
                      <span id="modalDetailGrade" class="info-field-val badge badge-grade">ថ្នាក់កុំព្យូទ័រ</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">វគ្គសិក្សា</span>
                      <span id="modalDetailCourse" class="info-field-val badge-course">Typing</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">វេនសិក្សា</span>
                      <span id="modalDetailShift" class="info-field-val">ព្រឹក</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ថ្ងៃចូលរៀន</span>
                      <span id="modalDetailStartDate" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row">
                      <span class="info-field-label">ស្ថានភាពសិស្ស</span>
                      <span id="modalDetailStatus" class="info-field-val status-indicator">កំពុងសិក្សា</span>
                    </div>

                    <!-- Credentials Box -->
                    <div style="background: rgba(99, 102, 241, 0.08); border: 1.5px dashed rgba(99, 102, 241, 0.35); border-radius: 10px; padding: 12px 14px; margin-top: 14px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-weight: 700; color: #4338ca; font-size: 0.85rem;"><i class="fa-solid fa-key"></i> គណនីចូលប្រព័ន្ធ (Student Login)</span>
                        <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-size: 0.72rem; padding: 2px 8px; border-radius: 10px;">
                          <i class="fa-solid fa-check-circle"></i> Ready
                        </span>
                      </div>
                      <div style="display: flex; gap: 14px; flex-wrap: wrap; font-size: 0.85rem;">
                        <span>Username: <code id="modalDetailLoginUser" class="font-mono font-bold" style="background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; color: #4338ca;">TX01</code></span>
                        <span>PIN: <code id="modalDetailLoginPin" class="font-mono font-bold" style="background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; color: #4338ca;">123</code></span>
                      </div>
                    </div>
                  </div>

                  <!-- Section C: Study Duration Progress Bar (Full Width) -->
                  <div class="info-card-section" style="grid-column: 1 / -1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <strong style="color: var(--text-main); font-size: 0.9rem;"><i class="fa-solid fa-clock-rotate-left text-indigo-500"></i> វឌ្ឍនភាពថ្ងៃសិក្សា (Study Duration):</strong>
                      <span id="modalDetailDaysStudied" class="badge-days-studied"></span>
                    </div>
                    <div class="duration-progress-bar" style="height: 8px;">
                      <div class="duration-progress-fill" id="modalDetailProgressBar" style="width: 0%;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">
                      <span>ថ្ងៃបញ្ចប់ (ប៉ាន់ស្មាន): <strong id="modalDetailEndDate" style="color: var(--text-main);">—</strong></span>
                      <span id="modalDetailDaysRemaining" style="font-weight: 600; color: var(--primary);">បានរៀន — ថ្ងៃ</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 3: គ្រួសារ (Family / Guardian) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-family">
                <div class="info-card-section">
                  <h4 class="info-card-title"><i class="fa-solid fa-people-roof text-indigo-500"></i> ព័ត៌មានអាណាព្យាបាល & ទំនាក់ទំនងបន្ទាន់ (Family & Guardian)</h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9;">
                      <span class="info-field-label">ឈ្មោះឪពុក (Father's Name)</span>
                      <span id="familyFatherName" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9;">
                      <span class="info-field-label">ឈ្មោះម្តាយ (Mother's Name)</span>
                      <span id="familyMotherName" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9;">
                      <span class="info-field-label">លេខទូរស័ព្ទអាណាព្យាបាល</span>
                      <span id="modalDetailGuardianPhone" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9;">
                      <span class="info-field-label">ទំនាក់ទំនងពេលមានអាសន្ន</span>
                      <span id="familyEmergencyContact" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="border-bottom: 1px solid #f1f5f9; grid-column: 1 / -1;">
                      <span class="info-field-label">អាសយដ្ឋានគ្រួសារ</span>
                      <span id="familyAddress" class="info-field-val">—</span>
                    </div>
                    <div class="info-field-row" style="grid-column: 1 / -1;">
                      <span class="info-field-label">កំណត់ចំណាំបន្ថែម</span>
                      <span id="familyNote" class="info-field-val text-muted">មិនមានកំណត់ចំណាំពិសេសទេ</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 4: លទ្ធផលសិក្សា (Academic & Exams Ladder) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-exams">
                <div class="info-card-section">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <h4 class="info-card-title" style="margin: 0; border: none; padding: 0;">
                      <i class="fa-solid fa-award" style="color: #8b5cf6;"></i> លទ្ធផលប្រលងបញ្ចប់វគ្គកុំព្យូទ័រទាំង ៤ (Computer Module Exams)
                    </h4>
                    <button type="button" id="modalPrintTranscriptBtn" class="btn-secondary" style="height: 30px; padding: 0 12px; font-size: 0.78rem;">
                      <i class="fa-solid fa-print"></i> ព្រឹត្តិបត្រពិន្ទុ
                    </button>
                  </div>

                  <div id="modalDetailExamSection">
                    <div class="exam-ladder-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                      <!-- Step 1: Typing -->
                      <div class="exam-ladder-step" id="modalExamTyping" style="background: var(--border-light); padding: 12px 8px; border-radius: 8px; border-top: 3px solid #8b5cf6;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #8b5cf6;">1. Typing</div>
                        <div class="ladder-score" style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">—</div>
                        <div class="ladder-badge text-xs text-muted">មិនទាន់ប្រលង</div>
                      </div>

                      <!-- Step 2: Word -->
                      <div class="exam-ladder-step" id="modalExamWord" style="background: var(--border-light); padding: 12px 8px; border-radius: 8px; border-top: 3px solid #185abd;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #185abd;">2. Word</div>
                        <div class="ladder-score" style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">—</div>
                        <div class="ladder-badge text-xs text-muted">មិនទាន់ប្រលង</div>
                      </div>

                      <!-- Step 3: Excel -->
                      <div class="exam-ladder-step" id="modalExamExcel" style="background: var(--border-light); padding: 12px 8px; border-radius: 8px; border-top: 3px solid #107c41;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #107c41;">3. Excel</div>
                        <div class="ladder-score" style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">—</div>
                        <div class="ladder-badge text-xs text-muted">មិនទាន់ប្រលង</div>
                      </div>

                      <!-- Step 4: PowerPoint -->
                      <div class="exam-ladder-step" id="modalExamPowerPoint" style="background: var(--border-light); padding: 12px 8px; border-radius: 8px; border-top: 3px solid #d83b01;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #d83b01;">4. PowerPoint</div>
                        <div class="ladder-score" style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">—</div>
                        <div class="ladder-badge text-xs text-muted">មិនទាន់ប្រលង</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 5: អវត្តមាន (Attendance & Absence) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-attendance">
                <div class="info-card-section">
                  <h4 class="info-card-title"><i class="fa-regular fa-calendar-check text-emerald-500"></i> សង្ខេបវត្តមាន & អវត្តមាន (Attendance Breakdown)</h4>
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; margin-bottom: 16px;">
                    <div style="background: var(--border-light); padding: 10px 12px; border-radius: 8px;">
                      <div class="text-muted" style="font-size: 0.75rem;">កត់ត្រាសរុប</div>
                      <strong id="modalDetailAttTotal" style="font-size: 1.25rem; color: var(--text-main);">0 ថ្ងៃ</strong>
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 10px 12px; border-radius: 8px; color: #059669;">
                      <div style="font-size: 0.75rem;">វត្តមាន (Present)</div>
                      <strong id="modalDetailAttPresent" style="font-size: 1.25rem;">0 ថ្ងៃ</strong>
                    </div>
                    <div style="background: rgba(245, 158, 11, 0.1); padding: 10px 12px; border-radius: 8px; color: #d97706;">
                      <div style="font-size: 0.75rem;">ច្បាប់ (Permission)</div>
                      <strong id="modalDetailAttPerm" style="font-size: 1.25rem;">0 ថ្ងៃ</strong>
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.1); padding: 10px 12px; border-radius: 8px; color: #dc2626;">
                      <div style="font-size: 0.75rem;">អវត្តមាន (Absent)</div>
                      <strong id="modalDetailAttAbsent" style="font-size: 1.25rem;">0 ថ្ងៃ</strong>
                    </div>
                  </div>

                  <!-- Recent Attendance Log List -->
                  <div id="modalAttendanceLogContainer" style="max-height: 200px; overflow-y: auto; font-size: 0.84rem;">
                    <!-- Filled dynamically -->
                  </div>
                </div>
              </div>

              <!-- ========================================== -->
              <!-- Tab 6: សេវាផ្សេងៗ (Other Services & ID Card) -->
              <!-- ========================================== -->
              <div class="student-tab-pane" id="pane-services">
                <div class="info-card-section" style="text-align: center;">
                  <h4 class="info-card-title" style="justify-content: center;"><i class="fa-solid fa-id-card text-indigo-500"></i> កាតសិស្សផ្លូវការ (Official Student ID Card)</h4>
                  <!-- Printable Student ID Card Preview -->
                  <div class="id-card-preview-wrapper" style="margin: 12px auto;">
                    <div id="printableIdCard" class="id-card-element">
                      <div class="id-card-header">
                        <div>
                          <div class="school-name">TIS LAB COMPUTER</div>
                          <div class="card-tag">STUDENT IDENTITY CARD</div>
                        </div>
                        <div style="font-size: 20px;">🎓</div>
                      </div>
                      <div class="id-card-body">
                        <img id="cardPreviewAvatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e2e8f0'/%3E%3Cpath d='M50 48a16 16 0 100-32 16 16 0 000 32zm0 8c-18 0-32 12-32 26v4h64v-4c0-14-14-26-32-26z' fill='%2394a3b8'/%3E%3C/svg%3E" alt="Avatar" class="id-card-avatar">
                        <div class="id-card-details">
                          <h4 id="cardPreviewNameKh">ឈ្មោះសិស្ស</h4>
                          <div id="cardPreviewNameEn" class="id-en">Student Name</div>
                          <div class="info-row">អត្តលេខ: <strong id="cardPreviewId" class="font-mono">TX01</strong></div>
                          <div class="info-row">ថ្នាក់: <strong id="cardPreviewGrade">ថ្នាក់កុំព្យូទ័រ</strong> <span id="cardPreviewCourse" class="badge-course badge-course-word" style="display:none;"></span></div>
                          <div class="info-row">ថ្ងៃកំណើត: <span id="cardPreviewDob">2006-05-12</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style="margin-top: 14px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <button type="button" id="printIdCardBtn" class="btn-primary" style="height: 36px; padding: 0 18px; font-size: 0.85rem;">
                      <i class="fa-solid fa-print"></i> <span>បោះពុម្ពកាតសិស្ស (Print ID Card)</span>
                    </button>
                    <button type="button" id="servicesCertBtn" class="btn-secondary" style="height: 36px; padding: 0 16px; font-size: 0.85rem;">
                      <i class="fa-solid fa-award text-amber-500"></i> <span>ចេញវិញ្ញាបនបត្រឌីជីថល</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 1.3 Modal Bottom Footer -->
          <div class="student-modal-footer">
            <button type="button" class="btn-footer-close" data-close-modal="studentDetailsModal">
              <i class="fa-solid fa-xmark"></i> <span>បិទ</span>
            </button>
            <div class="footer-right-buttons">
              <button type="button" id="modalFooterEditBtn" class="btn-footer-edit">
                <i class="fa-solid fa-pen-to-square"></i> <span>កែប្រែ</span>
              </button>
              <button type="button" id="modalFooterPrintBtn" class="btn-footer-print">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 1.5 Modal: Add New Student Fullscreen 3-Step Wizard -->
      <div id="addStudentModal" class="modal-overlay enroll-fullscreen-overlay">
        <div class="modal-card enroll-fullscreen-card">
          <!-- Header Bar: Burgundy #851349 -->
          <div class="enroll-fs-header">
            <div class="enroll-fs-title-box">
              <i class="fa-solid fa-user-plus"></i>
              <h2>ទម្រង់បែបបទចុះឈ្មោះសិស្សថ្មី</h2>
            </div>
            <div class="enroll-fs-header-right">
              <div id="enrollWelcomeAlert" class="enroll-welcome-alert">
                <i class="fa-solid fa-circle-info" style="color: #1890ff;"></i>
                <span>សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងសាលា សូមចុះឈ្មោះសិស្សថ្មី។</span>
                <button type="button" class="enroll-alert-close-btn" onclick="App.dismissEnrollAlert()" title="បិទការជូនដំណឹង">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div class="enroll-header-btns">
                <button type="button" id="btnToggleEnrollFullscreen" class="enroll-hdr-action-btn" onclick="App.toggleEnrollFullscreen()" title="ប្តូរទំហំពេញអេក្រង់/ផ្ទាំងតូច">
                  <i class="fa-solid fa-expand"></i>
                </button>
                <button type="button" class="enroll-hdr-action-btn" data-close-modal="addStudentModal" title="បិទផ្ទាំងចុះឈ្មោះ">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Stepper Navigation Bar: 3 Steps -->
          <div class="enroll-stepper-bar">
            <div class="enroll-stepper-container">
              <div class="enroll-stepper-track">
                <div id="enrollStepperProgress" class="enroll-stepper-progress" style="width: 0%;"></div>
              </div>
              <!-- Step 1: ព័ត៌មានផ្ទាល់ខ្លួន -->
              <button type="button" class="enroll-step-node active" id="enrollStepNode1" onclick="App.goToEnrollStep(1)">
                <div class="enroll-step-circle">១</div>
                <span class="enroll-step-label">ព័ត៌មានផ្ទាល់ខ្លួន</span>
              </button>
              <!-- Step 2: ព័ត៌មានការសិក្សា -->
              <button type="button" class="enroll-step-node" id="enrollStepNode2" onclick="App.goToEnrollStep(2)">
                <div class="enroll-step-circle">២</div>
                <span class="enroll-step-label">ព័ត៌មានការសិក្សា</span>
              </button>
              <!-- Step 3: ព័ត៌មានហិរញ្ញវត្ថុ -->
              <button type="button" class="enroll-step-node" id="enrollStepNode3" onclick="App.goToEnrollStep(3)">
                <div class="enroll-step-circle">៣</div>
                <span class="enroll-step-label">ព័ត៌មានហិរញ្ញវត្ថុ</span>
              </button>
            </div>
          </div>

          <!-- Form Area -->
          <form id="modalAddStudentForm" method="dialog" onsubmit="event.preventDefault(); return false;" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; margin: 0;">
            <div class="enroll-fs-body">
              <div class="enroll-fs-content-wrapper">
                <!-- Sub-header: Title, Student ID and Auto PIN -->
                <div class="enroll-subheader-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                  <div class="enroll-sub-title">
                    <i id="enrollSubheaderIcon" class="fa-regular fa-user"></i>
                    <span id="enrollSubheaderText">ព័ត៌មានអំពីសិស្ស</span>
                  </div>
                  <div class="enroll-header-pills-row" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <!-- Auto ID Pill -->
                    <div class="enroll-id-pill">
                      <span class="enroll-id-label"><i class="fa-solid fa-id-badge" style="color: #f43f5e;"></i> អត្តលេខ:</span>
                      <div class="enroll-id-box">
                        <input type="text" id="modalAddStudentIdInput" name="studentId" value="TX01" placeholder="TX01" class="enroll-id-input" title="អត្តលេខសិស្ស Auto ID">
                        <button type="button" id="btnRefreshEnrollStudentId" class="enroll-id-refresh-btn" onclick="App.refreshEnrollStudentId()" title="បង្កើតអត្តលេខថ្មីដោយស្វ័យប្រវត្តិ (Auto-Generate Next ID)">
                          <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Auto PIN Pill -->
                    <div class="enroll-pin-pill">
                      <span class="enroll-pin-label"><i class="fa-solid fa-key" style="color: #6366f1;"></i> Auto PIN:</span>
                      <div class="enroll-pin-box">
                        <input type="text" id="modalAddStudentPinInput" name="pin" value="12345678" placeholder="Auto PIN" maxlength="12" class="enroll-pin-input" oninput="App.syncEnrollPin(this.value)" title="លេខសម្ងាត់សិស្ស Auto PIN (123+5ខ្ទង់)">
                        <button type="button" class="enroll-pin-btn" onclick="App.refreshEnrollPin()" title="បង្កើតលេខកូដ Auto PIN ថ្មី (Random PIN 123+5ខ្ទង់)">
                          <i class="fa-solid fa-dice"></i>
                        </button>
                        <button type="button" class="enroll-pin-btn" onclick="App.copyEnrollPin()" title="ចម្លងលេខកូដ PIN">
                          <i class="fa-regular fa-copy"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- STEP 1: ព័ត៌មានផ្ទាល់ខ្លួន (Personal Info) -->
                <div id="enrollStepSection1" class="enroll-step-section">
                  <!-- Circular Avatar Upload in Center -->
                  <div class="enroll-avatar-center-container">
                    <div class="enroll-avatar-circle" id="enrollAvatarCircleTrigger" onclick="document.getElementById('modalAddAvatarFile').click()" title="ចុចដើម្បីជ្រើសរើសរូបថតសិស្ស">
                      <img id="modalAddAvatarPreview" class="enroll-avatar-img" src="" alt="រូបថតសិស្ស" style="display: none;">
                      <div id="enrollAvatarPlaceholder" class="enroll-avatar-placeholder">
                        <i class="fa-solid fa-camera"></i>
                        <span>រូបថតសិស្ស</span>
                      </div>
                      <div class="enroll-avatar-hover-overlay">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <span>ផ្លាស់ប្តូររូបថត</span>
                      </div>
                    </div>
                    <input type="file" id="modalAddAvatarFile" accept="image/*" style="display: none;">
                    <input type="hidden" id="modalAddAvatarInput" name="avatar" value="">
                    <span class="enroll-avatar-hint">(ទំហំអតិបរមា 5MB)</span>
                  </div>

                  <!-- Row 1: ឈ្មោះជាភាសាខ្មែរ & ឈ្មោះជាភាសាអង់គ្លេស (2 cols) -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-user"></i> <span>ឈ្មោះជាភាសាខ្មែរ</span> <span class="enroll-req-star">*</span></label>
                      <input type="text" id="enrollInputNameKh" name="nameKh" class="enroll-input-ctrl" placeholder="បញ្ចូលឈ្មោះពេញជាភាសាខ្មែរ" required>
                    </div>
                    <div class="enroll-field">
                      <label style="display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fa-regular fa-id-card"></i> <span>ឈ្មោះជាភាសាអង់គ្លេស (Latin Name)</span></span>
                        <button type="button" class="btn-text-action" onclick="App.autoGenerateEnrollLatinName()" title="បំប្លែងឈ្មោះឡាតាំង Auto ភ្លាមៗ" style="font-size: 0.75rem; color: #4f46e5; background: none; border: none; cursor: pointer; padding: 0 4px; display: inline-flex; align-items: center; gap: 4px; font-weight: 700;">
                          <i class="fa-solid fa-wand-magic-sparkles"></i> Auto Latin
                        </button>
                      </label>
                      <input type="text" id="enrollInputNameEn" name="nameEn" class="enroll-input-ctrl" placeholder="Auto Generate ឬ បញ្ចូលឈ្មោះឡាតាំង">
                    </div>
                  </div>

                  <!-- Row 2: ភេទ (Gender), ថ្ងៃខែឆ្នាំកំណើត (DOB), សញ្ជាតិ (Nationality) -->
                  <div class="enroll-grid-row enroll-cols-3">
                    <div class="enroll-field">
                      <label><span>ភេទ</span> <span class="enroll-req-star">*</span></label>
                      <select name="gender" id="modalAddGenderSelect" class="enroll-input-ctrl" required>
                        <option value="ប្រុស">ប្រុស (Male)</option>
                        <option value="ស្រី">ស្រី (Female)</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar"></i> <span>ថ្ងៃខែឆ្នាំកំណើត</span></label>
                      <input type="date" name="dob" class="enroll-input-ctrl" placeholder="DD/MM/YYYY">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-flag"></i> <span>សញ្ជាតិ</span></label>
                      <input type="text" name="nationality" class="enroll-input-ctrl" value="ខ្មែរ" placeholder="ឧ. ខ្មែរ">
                    </div>
                  </div>

                  <!-- Row 3: លេខទូរស័ព្ទ & រាជធានី/ខេត្ត (2 cols) -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-phone"></i> <span>លេខទូរស័ព្ទសិស្ស</span> <span class="enroll-req-star">*</span></label>
                      <input type="tel" name="phone" class="enroll-input-ctrl" placeholder="012 345 678">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-location-dot"></i> <span>រាជធានី/ខេត្ត (Province/City)</span></label>
                      <select name="address" class="enroll-input-ctrl">
                        ${APP_CONFIG.provinces.map(p => `<option value="${p}" ${p === 'ខេត្តកំពត' ? 'selected' : ''}>${p}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Row 4: ព័ត៌មានសុខភាព (អាឡែស៊ី/ជំងឺប្រចាំកាយ) -->
                  <div class="enroll-grid-row enroll-cols-1">
                    <div class="enroll-field">
                      <label><span>ព័ត៌មានសុខភាព (អាឡែស៊ី/ជំងឺប្រចាំកាយ)</span></label>
                      <input type="text" name="healthNotes" class="enroll-input-ctrl" placeholder="បញ្ជាក់ប្រសិនបើមានប្រតិកម្មអាឡែស៊ី ឬជំងឺប្រចាំកាយ...">
                    </div>
                  </div>
                </div>

                <!-- STEP 2: ព័ត៌មានការសិក្សា (Academic Info) -->
                <div id="enrollStepSection2" class="enroll-step-section" style="display: none;">
                  <!-- Row 1: វគ្គសិក្សាកុំព្យូទ័រ & វេនសិក្សា -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-laptop-code"></i> <span>វគ្គសិក្សាកុំព្យូទ័រ (Computer Course)</span> <span class="enroll-req-star">*</span></label>
                      <select name="course" id="modalAddCourseSelect" class="enroll-input-ctrl" required onchange="App.calculateEnrollFees()">
                        <option value="">-- សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ --</option>
                        ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name} (${c.desc})</option>`).join('')}
                      </select>
                      <input type="hidden" name="grade" value="ថ្នាក់កុំព្យូទ័រ">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-clock"></i> <span>វេនសិក្សា (Study Shift)</span> <span class="enroll-req-star">*</span></label>
                      <select name="shift" class="enroll-input-ctrl">
                        ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Row 2: ថ្ងៃចូលរៀន & ថ្ងៃបញ្ចប់វគ្គ -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar-check"></i> <span>ថ្ងៃចូលរៀន (Start Date)</span> <span class="enroll-req-star">*</span></label>
                      <input type="date" name="startDate" id="modalAddStartDate" class="enroll-input-ctrl" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar-xmark"></i> <span>ថ្ងៃបញ្ចប់វគ្គ (Estimated End Date)</span></label>
                      <input type="date" name="endDate" class="enroll-input-ctrl">
                    </div>
                  </div>

                  <!-- Row 3: ស្ថានភាពសិស្ស & PIN -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><span>ស្ថានភាពសិស្ស (Status)</span></label>
                      <select name="status" class="enroll-input-ctrl">
                        <option value="Active">កំពុងសិក្សា (Active)</option>
                        <option value="Inactive">ផ្អាកការសិក្សា (Inactive)</option>
                        <option value="Graduated">បញ្ចប់ការសិក្សា (Graduated)</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-key" style="color: #6366f1;"></i> <span>លេខកូដសម្ងាត់សិស្ស (Student Login PIN)</span> <span class="text-xs text-muted" style="color: #10b981;">(Auto PIN ស្តង់ដារ)</span></label>
                      <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="text" id="modalAddStep2PinInput" class="enroll-input-ctrl" placeholder="លេខសម្ងាត់ PIN" value="12345678" maxlength="12" oninput="App.syncEnrollPin(this.value)" style="font-family: var(--font-mono, monospace); font-weight: 700; letter-spacing: 1px;">
                        <button type="button" class="btn-secondary" onclick="App.refreshEnrollPin()" title="បង្កើត PIN ថ្មីឡើងវិញ" style="height: 42px; padding: 0 12px; white-space: nowrap; font-weight: 700;">
                          <i class="fa-solid fa-dice"></i> Auto
                        </button>
                        <button type="button" class="btn-secondary" onclick="App.copyEnrollPin()" title="ចម្លងលេខកូដ PIN" style="height: 42px; padding: 0 12px; white-space: nowrap;">
                          <i class="fa-regular fa-copy"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- STEP 3: ព័ត៌មានហិរញ្ញវត្ថុ (Financial Info) -->
                <div id="enrollStepSection3" class="enroll-step-section" style="display: none;">
                  <!-- Financial KPI Cards -->
                  <div class="enroll-kpi-row">
                    <div class="enroll-kpi-card enroll-kpi-total">
                      <span class="enroll-kpi-label"><i class="fa-solid fa-tags"></i> ថ្លៃសិក្សាសរុប (Course Fee)</span>
                      <span class="enroll-kpi-value" id="enrollDisplayTotalFee">$50.00</span>
                      <input type="hidden" name="totalFee" id="enrollInputTotalFee" value="50">
                    </div>
                    <div class="enroll-kpi-card enroll-kpi-paid">
                      <span class="enroll-kpi-label"><i class="fa-solid fa-money-bill-wave"></i> ទឹកប្រាក់បង់ដំបូង (Initial Payment)</span>
                      <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="font-size: 1.2rem; font-weight: 700; color: #16a34a;">$</span>
                        <input type="number" step="0.5" min="0" max="500" name="paidFee" id="enrollInputPaidFee" value="50" oninput="App.calculateEnrollFees()" style="border: 1px solid #86efac; border-radius: 6px; padding: 4px 8px; font-weight: 800; font-size: 1.2rem; color: #16a34a; width: 100px; outline: none; background: #fff;">
                      </div>
                    </div>
                    <div class="enroll-kpi-card enroll-kpi-balance zero" id="enrollKpiBalanceCard">
                      <span class="enroll-kpi-label"><i class="fa-solid fa-scale-balanced"></i> នៅខ្វះ (Balance Due)</span>
                      <span class="enroll-kpi-value" id="enrollDisplayBalance">$0.00</span>
                    </div>
                  </div>

                  <!-- Row 1: វិធីសាស្ត្រទូទាត់ & ស្ថានភាពទូទាត់ -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-credit-card"></i> <span>វិធីសាស្ត្រទូទាត់ (Payment Method)</span></label>
                      <select name="paymentMethod" class="enroll-input-ctrl">
                        <option value="ABA KHQR">ABA KHQR</option>
                        <option value="សាច់ប្រាក់ផ្ទាល់ (Cash)">សាច់ប្រាក់ផ្ទាល់ (Cash)</option>
                        <option value="Wing Bank">Wing Bank</option>
                        <option value="ACLEDA Bank">ACLEDA Bank</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-circle-check"></i> <span>ស្ថានភាពទូទាត់ (Payment Status)</span></label>
                      <select name="paymentStatus" id="enrollSelectPaymentStatus" class="enroll-input-ctrl">
                        <option value="Paid">បានបង់គ្រប់ចំនួន (Paid in Full)</option>
                        <option value="Partial">បានបង់មួយចំនួន (Partial Payment)</option>
                        <option value="Pending">មិនទាន់បង់ (Pending Payment)</option>
                      </select>
                    </div>
                  </div>

                  <!-- Row 2: លេខវិក្កយបត្រ & កំណត់សម្គាល់បន្ថែម -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-receipt"></i> <span>លេខវិក្កយបត្រ (Invoice No.)</span></label>
                      <input type="text" name="receiptNo" id="enrollInputReceiptNo" class="enroll-input-ctrl font-mono" readonly value="INV-2026-1024">
                    </div>
                    <div class="enroll-field">
                      <label><span>កំណត់សម្គាល់បន្ថែម (Payment Note)</span></label>
                      <input type="text" name="paymentNote" class="enroll-input-ctrl" placeholder="សម្គាល់បន្ថែមលើការបង់ប្រាក់..." value="បង់ថ្លៃសិក្សាពេលចុះឈ្មោះ">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Action Controls: Step 1, 2, 3 buttons -->
            <div class="enroll-fs-footer">
              <!-- Left Action Button -->
              <div id="enrollFooterLeft">
                <button type="button" class="btn-enroll-cancel" data-close-modal="addStudentModal">
                  <i class="fa-solid fa-xmark"></i>
                  <span>បោះបង់</span>
                </button>
              </div>

              <!-- Right Action Buttons -->
              <div id="enrollFooterRight">
                <button type="button" id="btnEnrollNextStep" class="btn-enroll-next" onclick="App.nextEnrollStep()">
                  <span>បន្ទាប់: ព័ត៌មានការសិក្សា</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
                <button type="submit" id="btnEnrollSubmit" class="btn-enroll-submit" style="display: none;">
                  <i class="fa-solid fa-check"></i>
                  <span>រក្សាទុក និងចុះឈ្មោះសិស្ស</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- 2. Modal: Edit Student Fullscreen / Modern Wizard -->
      <div id="editModal" class="modal-overlay enroll-fullscreen-overlay">
        <div class="modal-card enroll-fullscreen-card">
          <!-- Header Bar: Burgundy #851349 -->
          <div class="enroll-fs-header">
            <div class="enroll-fs-title-box">
              <i class="fa-solid fa-user-pen"></i>
              <h2>ទម្រង់កែប្រែទិន្នន័យសិស្ស</h2>
            </div>
            <div class="enroll-fs-header-right">
              <div class="enroll-header-btns">
                <button type="button" id="btnToggleEditFullscreen" class="enroll-hdr-action-btn" onclick="App.toggleEditFullscreen()" title="ប្តូរទំហំពេញអេក្រង់/ផ្ទាំងតូច">
                  <i class="fa-solid fa-expand"></i>
                </button>
                <button type="button" class="enroll-hdr-action-btn" data-close-modal="editModal" title="បិទផ្ទាំងកែប្រែ">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Stepper Navigation Bar: 2 Steps -->
          <div class="enroll-stepper-bar">
            <div class="enroll-stepper-container" style="max-width: 520px;">
              <div class="enroll-stepper-track" style="left: 45px; right: 45px;">
                <div id="editStepperProgress" class="enroll-stepper-progress" style="width: 0%;"></div>
              </div>
              <!-- Step 1: ព័ត៌មានផ្ទាល់ខ្លួន -->
              <button type="button" class="enroll-step-node active" id="editStepNode1" onclick="App.goToEditStep(1)">
                <div class="enroll-step-circle">១</div>
                <span class="enroll-step-label">ព័ត៌មានផ្ទាល់ខ្លួន</span>
              </button>
              <!-- Step 2: ព័ត៌មានការសិក្សា -->
              <button type="button" class="enroll-step-node" id="editStepNode2" onclick="App.goToEditStep(2)">
                <div class="enroll-step-circle">២</div>
                <span class="enroll-step-label">ព័ត៌មានការសិក្សា</span>
              </button>
            </div>
          </div>

          <!-- Form Area -->
          <form id="editStudentForm" method="dialog" onsubmit="event.preventDefault(); return false;" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; margin: 0;">
            <input type="hidden" name="id">
            <input type="hidden" name="createdAt">

            <div class="enroll-fs-body">
              <div class="enroll-fs-content-wrapper">
                <!-- Sub-header: Title and Student ID -->
                <div class="enroll-subheader-row">
                  <div class="enroll-sub-title">
                    <i id="editSubheaderIcon" class="fa-regular fa-user"></i>
                    <span id="editSubheaderText">ព័ត៌មានអំពីសិស្ស</span>
                  </div>
                  <div class="enroll-id-pill">
                    <span class="enroll-id-label">អត្តលេខ:</span>
                    <div class="enroll-id-box">
                      <input type="text" id="editModalStudentIdDisplay" class="enroll-id-input" readonly value="TX01">
                    </div>
                  </div>
                </div>

                <!-- STEP 1: ព័ត៌មានផ្ទាល់ខ្លួន (Personal Info) -->
                <div id="editStepSection1" class="enroll-step-section">
                  <!-- Circular Avatar Upload in Center -->
                  <div class="enroll-avatar-center-container">
                    <div class="enroll-avatar-circle" id="editAvatarCircleTrigger" onclick="document.getElementById('editAvatarFile').click()" title="ចុចដើម្បីផ្លាស់ប្តូររូបថតសិស្ស">
                      <img id="editAvatarPreview" class="enroll-avatar-img" src="" alt="រូបថតសិស្ស" style="display: none;">
                      <div id="editAvatarPlaceholder" class="enroll-avatar-placeholder">
                        <i class="fa-solid fa-camera"></i>
                        <span>រូបថតសិស្ស</span>
                      </div>
                      <div class="enroll-avatar-hover-overlay">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <span>ផ្លាស់ប្តូររូបថត</span>
                      </div>
                    </div>
                    <input type="file" id="editAvatarFile" accept="image/*" style="display: none;">
                    <input type="hidden" id="editAvatarInput" name="avatar" value="">
                    <span class="enroll-avatar-hint">(ទំហំអតិបរមា 5MB)</span>
                  </div>

                  <!-- Row 1: ឈ្មោះជាភាសាខ្មែរ & ឈ្មោះជាភាសាអង់គ្លេស (2 cols) -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-user"></i> <span>ឈ្មោះជាភាសាខ្មែរ</span> <span class="enroll-req-star">*</span></label>
                      <input type="text" id="editInputNameKh" name="nameKh" class="enroll-input-ctrl" placeholder="បញ្ចូលឈ្មោះពេញជាភាសាខ្មែរ" required>
                    </div>
                    <div class="enroll-field">
                      <label style="display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fa-regular fa-id-card"></i> <span>ឈ្មោះជាភាសាអង់គ្លេស (Latin Name)</span></span>
                        <button type="button" class="btn-text-action" onclick="App.autoGenerateEditLatinName()" title="បំប្លែងឈ្មោះឡាតាំង Auto ភ្លាមៗ" style="font-size: 0.75rem; color: #4f46e5; background: none; border: none; cursor: pointer; padding: 0 4px; display: inline-flex; align-items: center; gap: 4px; font-weight: 700;">
                          <i class="fa-solid fa-wand-magic-sparkles"></i> Auto Latin
                        </button>
                      </label>
                      <input type="text" id="editInputNameEn" name="nameEn" class="enroll-input-ctrl" placeholder="Enter Full Name in English">
                    </div>
                  </div>

                  <!-- Row 2: ភេទ (Gender), ថ្ងៃខែឆ្នាំកំណើត (DOB), សញ្ជាតិ (Nationality) -->
                  <div class="enroll-grid-row enroll-cols-3">
                    <div class="enroll-field">
                      <label><span>ភេទ</span> <span class="enroll-req-star">*</span></label>
                      <select name="gender" class="enroll-input-ctrl" required>
                        <option value="ប្រុស">ប្រុស (Male)</option>
                        <option value="ស្រី">ស្រី (Female)</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar"></i> <span>ថ្ងៃខែឆ្នាំកំណើត</span></label>
                      <input type="date" name="dob" class="enroll-input-ctrl" placeholder="DD/MM/YYYY">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-flag"></i> <span>សញ្ជាតិ</span></label>
                      <input type="text" name="nationality" class="enroll-input-ctrl" value="ខ្មែរ" placeholder="ឧ. ខ្មែរ">
                    </div>
                  </div>

                  <!-- Row 3: លេខទូរស័ព្ទ & រាជធានី/ខេត្ត (2 cols) -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-phone"></i> <span>លេខទូរស័ព្ទសិស្ស</span> <span class="enroll-req-star">*</span></label>
                      <input type="tel" name="phone" class="enroll-input-ctrl" placeholder="012 345 678">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-location-dot"></i> <span>រាជធានី/ខេត្ត (Province/City)</span></label>
                      <select name="address" class="enroll-input-ctrl">
                        ${APP_CONFIG.provinces.map(p => `<option value="${p}">${p}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Row 4: ព័ត៌មានសុខភាព (អាឡែស៊ី/ជំងឺប្រចាំកាយ) -->
                  <div class="enroll-grid-row enroll-cols-1">
                    <div class="enroll-field">
                      <label><span>ព័ត៌មានសុខភាព (អាឡែស៊ី/ជំងឺប្រចាំកាយ)</span></label>
                      <input type="text" name="healthNotes" class="enroll-input-ctrl" placeholder="បញ្ជាក់ប្រសិនបើមានប្រតិកម្មអាឡែស៊ី ឬជំងឺប្រចាំកាយ...">
                    </div>
                  </div>
                </div>

                <!-- STEP 2: ព័ត៌មានការសិក្សា (Academic Info) -->
                <div id="editStepSection2" class="enroll-step-section" style="display: none;">
                  <!-- Row 1: វគ្គសិក្សាកុំព្យូទ័រ & វេនសិក្សា -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-laptop-code"></i> <span>វគ្គសិក្សាកុំព្យូទ័រ (Computer Course)</span> <span class="enroll-req-star">*</span></label>
                      <select name="course" id="modalEditCourseSelect" class="enroll-input-ctrl" required>
                        <option value="">-- សូមជ្រើសរើសវគ្គសិក្សាកុំព្យូទ័រ --</option>
                        ${APP_CONFIG.computerCourses.map(c => `<option value="${c.name}">${c.name} (${c.desc})</option>`).join('')}
                      </select>
                      <input type="hidden" name="grade" value="ថ្នាក់កុំព្យូទ័រ">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-clock"></i> <span>វេនសិក្សា (Study Shift)</span> <span class="enroll-req-star">*</span></label>
                      <select name="shift" class="enroll-input-ctrl">
                        ${APP_CONFIG.shifts.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Row 2: ថ្ងៃចូលរៀន & ថ្ងៃបញ្ចប់វគ្គ -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar-check"></i> <span>ថ្ងៃចូលរៀន (Start Date)</span> <span class="enroll-req-star">*</span></label>
                      <input type="date" name="startDate" class="enroll-input-ctrl">
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-regular fa-calendar-xmark"></i> <span>ថ្ងៃបញ្ចប់វគ្គ (Estimated End Date)</span></label>
                      <input type="date" name="endDate" class="enroll-input-ctrl">
                    </div>
                  </div>

                  <!-- Row 3: ស្ថានភាពសិស្ស & PIN -->
                  <div class="enroll-grid-row enroll-cols-2">
                    <div class="enroll-field">
                      <label><span>ស្ថានភាពសិស្ស (Status)</span></label>
                      <select name="status" class="enroll-input-ctrl">
                        <option value="Active">កំពុងសិក្សា (Active)</option>
                        <option value="Inactive">ផ្អាកការសិក្សា (Inactive)</option>
                        <option value="Graduated">បញ្ចប់ការសិក្សា (Graduated)</option>
                      </select>
                    </div>
                    <div class="enroll-field">
                      <label><i class="fa-solid fa-key" style="color: #6366f1;"></i> <span>លេខកូដសម្ងាត់សិស្ស (Student Login PIN)</span> <span class="text-xs text-muted">(123+5ខ្ទង់)</span></label>
                      <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="text" id="modalEditStudentPinInput" name="pin" class="enroll-input-ctrl" placeholder="លេខសម្ងាត់ PIN" value="123" maxlength="12" style="font-family: var(--font-mono, monospace); font-weight: 700; letter-spacing: 1px;">
                        <button type="button" class="btn-secondary" onclick="App.refreshEditPin()" title="បង្កើត PIN ថ្មីឡើងវិញ" style="height: 42px; padding: 0 12px; white-space: nowrap; font-weight: 700;">
                          <i class="fa-solid fa-dice"></i> Auto
                        </button>
                        <button type="button" class="btn-secondary" onclick="App.copyEditPin()" title="ចម្លងលេខកូដ PIN" style="height: 42px; padding: 0 12px; white-space: nowrap;">
                          <i class="fa-regular fa-copy"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Action Controls -->
            <div class="enroll-fs-footer">
              <!-- Left Action Button -->
              <div id="editFooterLeft">
                <button type="button" class="btn-enroll-cancel" data-close-modal="editModal">
                  <i class="fa-solid fa-xmark"></i>
                  <span>បោះបង់</span>
                </button>
              </div>

              <!-- Right Action Buttons -->
              <div id="editFooterRight" style="display: flex; gap: 10px; align-items: center;">
                <button type="button" id="btnEditPrevStep" class="btn-enroll-prev" onclick="App.prevEditStep()" style="display: none;">
                  <i class="fa-solid fa-arrow-left"></i>
                  <span>ត្រឡប់ក្រោយ</span>
                </button>
                <button type="button" id="btnEditNextStep" class="btn-enroll-next" onclick="App.nextEditStep()">
                  <span>បន្ទាប់: ព័ត៌មានការសិក្សា</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
                <button type="submit" id="btnEditSubmit" class="btn-enroll-submit">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>រក្សាទុកការកែប្រែ</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- 4. Modal: Official Exam Papers & Test Bank (ឃ្លាំងវិញ្ញាសាប្រឡងកុំព្យូទ័រ) -->
      <div id="examPapersModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 960px; max-height: 90vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                <i class="fa-solid fa-file-signature"></i>
              </div>
              <div>
                <h3 style="color: #ffffff; margin: 0; font-size: 1.15rem;">📑 ឃ្លាំងវិញ្ញាសាប្រឡងកុំព្យូទ័រផ្លូវការ (Official Exam Papers Bank)</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.78rem; color: rgba(255, 255, 255, 0.85);">
                  វិញ្ញាសាប្រឡងវាស់ស្ទង់សមត្ថភាពសិស្សបញ្ចប់វគ្គ Typing, Word, Excel, PowerPoint ស្របតាមស្តង់ដារបណ្តុះបណ្តាល
                </p>
              </div>
            </div>
            <button type="button" class="modal-close-btn" data-close-modal="examPapersModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Filter course tabs inside modal -->
          <div style="padding: 12px 24px; background: var(--border-light); border-bottom: 1px solid var(--border-color); display: flex; gap: 8px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
            <div class="exam-papers-filter-tabs" style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="btn-paper-filter active" data-paper-course="all">
                <i class="fa-solid fa-layer-group"></i> ទាំងអស់ (13)
              </button>
              <button type="button" class="btn-paper-filter" data-paper-course="Typing">
                <i class="fa-solid fa-keyboard" style="color: #8b5cf6;"></i> Typing (5)
              </button>
              <button type="button" class="btn-paper-filter" data-paper-course="Word">
                <i class="fa-solid fa-file-word" style="color: #185abd;"></i> Word (3)
              </button>
              <button type="button" class="btn-paper-filter" data-paper-course="Excel">
                <i class="fa-solid fa-file-excel" style="color: #107c41;"></i> Excel (3)
              </button>
              <button type="button" class="btn-paper-filter" data-paper-course="PowerPoint">
                <i class="fa-solid fa-file-powerpoint" style="color: #d83b01;"></i> PowerPoint (2)
              </button>
            </div>

            <button type="button" class="btn-secondary" style="height: 32px; padding: 0 12px; font-size: 0.8rem;" onclick="ExamsView.printOfficialExamPaper()">
              <i class="fa-solid fa-print"></i> <span>បោះពុម្ពក្រដាសប្រឡង A4</span>
            </button>
          </div>

          <!-- Papers List Container -->
          <div class="modal-body" id="examPapersListContainer" style="padding: 20px 24px; overflow-y: auto; flex: 1; max-height: calc(90vh - 180px);">
            <!-- Rendered by ExamsView.renderPapersList() -->
          </div>

          <div class="modal-footer" style="padding: 12px 24px; background: var(--border-light); justify-content: space-between;">
            <div class="text-xs text-muted">
              <i class="fa-solid fa-circle-info text-indigo-500"></i> វិញ្ញាសានីមួយៗមានពិន្ទុសរុប ១០០ និងមានតារាង Grading Rubric វាយតម្លៃជាក់លាក់។
            </div>
            <button type="button" class="btn-secondary" data-close-modal="examPapersModal">បិទផ្ទាំង</button>
          </div>
        </div>
      </div>

      <!-- 5. Modal: Interactive Live Typing Test Arena (បន្ទប់ធ្វើតេស្តវាយអត្ថបទកុំព្យូទ័រផ្ទាល់) -->
      <!-- 5. Modal: Interactive Live Exam Arena (សាលប្រឡងផ្ទាល់តាមវគ្គកុំព្យូទ័រ Fullscreen Arena) -->
      <div id="liveTypingModal" class="modal-overlay exam-arena-overlay">
        <div class="modal-card exam-arena-fullscreen-card">
          <!-- Modal Header with Course Selector Tabs -->
          <div class="exam-arena-header" id="arenaHeader">
            <!-- Left: Title, Icon, Subtitle, Badge -->
            <div class="exam-arena-header-left">
              <div id="arenaIconBox" class="exam-arena-icon-box">
                <i class="fa-solid fa-graduation-cap"></i>
              </div>
              <div class="exam-arena-title-area">
                <h3>
                  <span>🚀 សាលប្រឡងផ្ទាល់តាមវគ្គកុំព្យូទ័រ (Live Exam Arena)</span>
                  <span class="badge font-mono" id="arenaCourseBadge" style="background: #8b5cf6; color: #ffffff; font-size: 0.75rem; padding: 3px 10px; border-radius: 6px;">Typing</span>
                </h3>
                <p>ប្រឡងវាស់ស្ទង់សមត្ថភាពជាក់ស្តែង &amp; បញ្ចូលពិន្ទុស្វ័យប្រវត្តិទៅក្នុងប្រព័ន្ធ &amp; Firebase ភ្លាមៗ</p>
              </div>
            </div>

            <!-- Center: 4 Course Tabs Bar -->
            <div class="exam-arena-header-center">
              <div class="arena-course-tabs">
                <button type="button" class="arena-course-tab active" data-arena-course="Typing" onclick="ExamsView.switchExamArenaCourse('Typing')">
                  <i class="fa-solid fa-keyboard" style="color: #8b5cf6;"></i>
                  <span>វគ្គទី ១: Typing</span>
                </button>
                <button type="button" class="arena-course-tab" data-arena-course="Word" onclick="ExamsView.switchExamArenaCourse('Word')">
                  <i class="fa-solid fa-file-word" style="color: #185abd;"></i>
                  <span>វគ្គទី ២: Word</span>
                </button>
                <button type="button" class="arena-course-tab" data-arena-course="Excel" onclick="ExamsView.switchExamArenaCourse('Excel')">
                  <i class="fa-solid fa-file-excel" style="color: #107c41;"></i>
                  <span>វគ្គទី ៣: Excel</span>
                </button>
                <button type="button" class="arena-course-tab" data-arena-course="PowerPoint" onclick="ExamsView.switchExamArenaCourse('PowerPoint')">
                  <i class="fa-solid fa-file-powerpoint" style="color: #d83b01;"></i>
                  <span>វគ្គទី ៤: PowerPoint</span>
                </button>
              </div>
            </div>

            <!-- Right: Fullscreen Toggle & Exit Buttons -->
            <div class="exam-arena-header-right">
              <button type="button" class="btn-arena-fs" id="btnArenaFullscreenToggle" onclick="ExamsView.toggleBrowserFullscreen()" title="ពង្រីកពេញអេក្រង់ (Toggle Fullscreen)">
                <i class="fa-solid fa-expand"></i> <span>ពេញអេក្រង់</span>
              </button>
              <button type="button" class="btn-arena-close" data-close-modal="liveTypingModal" onclick="ExamsView.stopExamSession()" title="ចាកចេញពីសាលប្រឡង (Esc)">
                <i class="fa-solid fa-xmark"></i> <span>ចាកចេញ</span>
              </button>
            </div>
          </div>

          <div class="modal-body exam-arena-body">
            <div class="exam-arena-body-inner">
              <!-- Candidate & Shift Selector Bar -->
            <div style="background: var(--border-light); border-radius: var(--border-radius); padding: 12px 18px; margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 260px;">
                <label class="form-label" style="margin: 0; font-size: 0.85rem; font-weight: 700; white-space: nowrap;">
                  <i class="fa-solid fa-user-graduate text-purple-600"></i> បេក្ខជនប្រឡង៖
                </label>
                <select id="typingStudentSelect" class="form-control" style="height: 38px; font-size: 0.88rem; font-weight: 600; flex: 1;" onchange="ExamsView.onStudentCandidateChanged(this.value)">
                  <!-- Filled dynamically with students -->
                </select>
              </div>

              <!-- Live Auto-Save Indicator Tag -->
              <div style="display: flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.12); padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.3);">
                <i class="fa-solid fa-cloud-arrow-up text-emerald-600" style="font-size: 0.9rem;"></i>
                <span style="font-size: 0.78rem; font-weight: 700; color: #059669;">Auto-Save Live Sync ទៅ Firebase</span>
              </div>
            </div>

            <!-- SECTION A: TYPING ARENA CONTAINER -->
            <div id="arenaTypingContainer">
              <!-- Setup & Config Row -->
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 12px 16px; margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; justify-content: space-between;">
                <!-- Paper Selector -->
                <div style="flex: 1.4; min-width: 220px;">
                  <label class="form-label" style="margin-bottom: 4px; font-size: 0.8rem; font-weight: 700;">
                    <i class="fa-solid fa-file-circle-check text-purple-600"></i> ជ្រើសរើសវិញ្ញាសា Typing ស្តង់ដារ:
                  </label>
                  <select id="typingPaperSelect" class="form-control" style="height: 38px; font-size: 0.85rem; width: 100%;">
                    <option value="TYP-01">វិញ្ញាសាទី ១: អត្ថបទស្តង់ដាររដ្ឋបាល និងបច្ចេកវិទ្យាឌីជីថល (Khmer)</option>
                    <option value="TYP-02">វិញ្ញាសាទី ២: អត្ថបទស្តង់ដារការអប់រំ និងការអភិវឌ្ឍធនធានមនុស្ស (Khmer)</option>
                    <option value="TYP-03">វិញ្ញាសាទី ៣: អត្ថបទស្តង់ដារភាសាអង់គ្លេសផ្លូវការ (English)</option>
                    <option value="TYP-04">វិញ្ញាសាទី ៤: អត្ថបទចម្រុះស្តង់ដារ ខ្មែរ-អង់គ្លេស (Bilingual)</option>
                    <option value="TYP-05">វិញ្ញាសាទី ៥: សេចក្តីជូនដំណឹង និងបទដ្ឋានរដ្ឋបាលផ្លូវការ (Khmer)</option>
                  </select>
                </div>

                <!-- Time Limit Selector -->
                <div style="width: 140px;">
                  <label class="form-label" style="margin-bottom: 4px; font-size: 0.8rem; font-weight: 700;">
                    <i class="fa-regular fa-clock text-amber-500"></i> ថិរវេលាប្រឡង:
                  </label>
                  <select id="typingDurationSelect" class="form-control" style="height: 38px; font-size: 0.85rem; width: 100%;">
                    <option value="60">១ នាទី (Quick 1m)</option>
                    <option value="180" selected>៣ នាទី (Standard 3m)</option>
                    <option value="300">៥ នាទី (Official 5m)</option>
                  </select>
                </div>

                <!-- Action Controls -->
                <div style="display: flex; gap: 8px;">
                  <button type="button" id="startTypingBtn" class="btn-primary" style="height: 38px; padding: 0 18px; background: #8b5cf6; border-color: #8b5cf6; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);" onclick="ExamsView.startTypingTest()">
                    <i class="fa-solid fa-play"></i> <span>ចាប់ផ្តើម</span>
                  </button>
                  <button type="button" id="resetTypingBtn" class="btn-secondary" style="height: 38px; padding: 0 12px;" onclick="ExamsView.resetTypingTest()" title="កំណត់ឡើងវិញ">
                    <i class="fa-solid fa-rotate-right"></i>
                  </button>
                </div>
              </div>

              <!-- Live KPI Counters Bar -->
              <div class="typing-kpi-bar">
                <div class="typing-stat-badge" style="border-left: 4px solid #ef4444;">
                  <div class="typing-stat-val" id="typingTimerVal" style="color: #ef4444; font-family: monospace;">03:00</div>
                  <div class="typing-stat-lbl"><i class="fa-regular fa-clock"></i> ពេលនៅសល់</div>
                </div>

                <div class="typing-stat-badge" style="border-left: 4px solid #8b5cf6;">
                  <div class="typing-stat-val" id="typingWpmVal" style="color: #8b5cf6;">0</div>
                  <div class="typing-stat-lbl"><i class="fa-solid fa-gauge-high"></i> ល្បឿន (WPM)</div>
                </div>

                <div class="typing-stat-badge" style="border-left: 4px solid #10b981;">
                  <div class="typing-stat-val" id="typingAccuracyVal" style="color: #10b981;">100%</div>
                  <div class="typing-stat-lbl"><i class="fa-solid fa-bullseye"></i> ភាពត្រឹមត្រូវ</div>
                </div>

                <div class="typing-stat-badge" style="border-left: 4px solid #f59e0b;">
                  <div class="typing-stat-val" id="typingCharsVal" style="color: #f59e0b;">0</div>
                  <div class="typing-stat-lbl"><i class="fa-solid fa-font"></i> ចំនួនតួអក្សរ</div>
                </div>

                <div class="typing-stat-badge" style="border-left: 4px solid #dc2626;">
                  <div class="typing-stat-val" id="typingErrorsVal" style="color: #dc2626;">0</div>
                  <div class="typing-stat-lbl"><i class="fa-solid fa-triangle-exclamation"></i> កំហុសខុស</div>
                </div>
              </div>

              <!-- Official Document Paper Info Banner & Live Progress -->
              <div class="typing-paper-meta-header" id="typingPaperMetaHeader">
                <div class="typing-paper-title-row">
                  <div class="typing-paper-title-col">
                    <span class="badge font-mono typing-badge-code" id="typingPaperCodeBadge">TYP-01</span>
                    <h4 id="typingPaperHeaderTitle" class="typing-paper-title">វិញ្ញាសាទី ១: អត្ថបទស្តង់ដាររដ្ឋបាល និងបច្ចេកវិទ្យាឌីជីថល</h4>
                  </div>
                  <div class="typing-paper-criteria-pills">
                    <span class="badge typing-pill" id="typingPaperLangPill"><i class="fa-solid fa-language text-indigo-400"></i> ភាសាខ្មែរ</span>
                    <span class="badge typing-pill-pass" id="typingPaperPassWpm"><i class="fa-solid fa-gauge-high text-emerald-400"></i> ល្បឿនជាប់៖ ≥35 WPM</span>
                    <span class="badge typing-pill-score"><i class="fa-solid fa-award text-amber-400"></i> ពិន្ទុពេញ៖ ១០០</span>
                  </div>
                </div>

                <!-- Live Typing Progress Bar -->
                <div class="typing-progress-wrapper">
                  <div class="typing-progress-label-row">
                    <span class="text-xs text-muted font-bold"><i class="fa-solid fa-bars-progress text-indigo-500"></i> វឌ្ឍនភាពនៃការវាយអត្ថបទ៖</span>
                    <span class="text-xs font-mono font-bold" id="typingProgressPercent" style="color: var(--primary);">0% (0 / 0 តួ)</span>
                  </div>
                  <div class="typing-progress-track">
                    <div class="typing-progress-fill" id="typingProgressFill" style="width: 0%;"></div>
                  </div>
                </div>
              </div>

              <!-- Target Text Arena Box -->
              <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <label class="form-label" style="margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--text-main);">
                  <i class="fa-solid fa-file-signature text-purple-500"></i> ក្រដាសវិញ្ញាសាស្តង់ដារត្រូវវាយ (Standard Target Document):
                </label>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button type="button" class="btn-action" style="font-size: 0.76rem; padding: 4px 10px; height: auto;" onclick="ExamsView.printCurrentTypingPaper()" title="បោះពុម្ពក្រដាសវិញ្ញាសា A4">
                    <i class="fa-solid fa-print"></i> បោះពុម្ព A4
                  </button>
                  <span class="text-xs text-muted font-mono font-semibold" id="typingTargetMeta"></span>
                </div>
              </div>
              <div id="typingTargetDisplay" class="typing-arena-box typing-doc-sheet" tabindex="0">
                <!-- Character by character rendered by ExamsView with standard formatting -->
              </div>

              <!-- Student Input Textarea -->
              <div style="margin-bottom: 16px;">
                <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                  <label class="form-label" style="margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--text-main);">
                    <i class="fa-solid fa-pen-nib text-indigo-500"></i> កន្លែងសិស្សវាយអត្ថបទជាក់ស្តែង (Typing Input Area):
                  </label>
                  <span class="text-xs text-muted" id="typingInputStatus">
                    <i class="fa-regular fa-circle-dot text-amber-500"></i> រង់ចាំចុច [ចាប់ផ្តើម]
                  </span>
                </div>
                <textarea id="typingInputField" class="form-control typing-input-area" 
                  placeholder="ចុចប៊ូតុង [ចាប់ផ្តើម] ខាងលើ រួចចាប់ផ្តើមវាយអត្ថបទតាមវិញ្ញាសានៅទីនេះ..." 
                  disabled spellcheck="false" autocomplete="off" autocapitalize="off"></textarea>
              </div>
            </div>

            <!-- SECTION B: PRACTICAL & THEORY EXAM CONTAINER (Word, Excel, PowerPoint) -->
            <div id="arenaPracticalContainer" style="display: none;">
              <!-- Meta Header Box -->
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                  <h4 style="margin: 0 0 4px 0; font-size: 1.05rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;" id="practicalExamTitle">
                    <span>វិញ្ញាសាប្រឡងអនុវត្តជាក់ស្តែង</span>
                  </h4>
                  <div class="text-xs text-muted" id="practicalExamSubtitle">
                    សរុប ១០ សំណួរ • ពិន្ទុពេញ ១០០ (ជាប់ ≥ ៥០) • ជ្រើសរើសចម្លើយត្រឹមត្រូវ
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                  <!-- Countdown Timer -->
                  <div class="typing-stat-badge" style="border-left: 3px solid #ef4444; padding: 6px 14px;">
                    <div class="typing-stat-val" id="practicalTimerVal" style="color: #ef4444; font-family: monospace; font-size: 1.25rem;">10:00</div>
                    <div class="typing-stat-lbl"><i class="fa-regular fa-clock"></i> ពេលនៅសល់</div>
                  </div>

                  <!-- Progress Counter -->
                  <div class="typing-stat-badge" style="border-left: 3px solid #10b981; padding: 6px 14px;">
                    <div class="typing-stat-val" id="practicalProgressVal" style="color: #059669; font-size: 1.25rem;">0/10</div>
                    <div class="typing-stat-lbl"><i class="fa-solid fa-check-double"></i> ឆ្លើយបាន</div>
                  </div>
                </div>
              </div>

              <!-- Questions List Mount -->
              <div id="practicalQuestionsList" style="margin-bottom: 20px;">
                <!-- 10 Questions rendered dynamically -->
              </div>

              <!-- Bottom Submit Bar -->
              <div style="background: var(--border-light); border-radius: 10px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <span class="text-xs text-muted">
                  💡 គន្លឹះ៖ ពិនិត្យចម្លើយឱ្យបានសព្វគ្រប់មុនពេលចុចប្រគល់។ ប្រព័ន្ធនឹងគណនាពិន្ទុ និងបញ្ចូលទៅក្នុងប្រព័ន្ធសិស្សដោយស្វ័យប្រវត្តិ។
                </span>

                <button type="button" id="btnSubmitPracticalExam" class="btn-primary" style="height: 40px; padding: 0 22px; font-size: 0.9rem; background: linear-gradient(135deg, #10b981, #059669); border: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);" onclick="ExamsView.submitCourseExam()">
                  <i class="fa-solid fa-paper-plane"></i> <span>🚀 ប្រគល់កិច្ចការប្រឡង & បញ្ចូលពិន្ទុស្វ័យប្រវត្តិ</span>
                </button>
              </div>
            </div>

            <!-- SECTION C: UNIFIED AUTO-SAVED RESULT CONTAINER -->
            <div id="arenaResultContainer" style="display: none; background: var(--bg-surface); border: 2px solid #10b981; border-radius: 14px; padding: 22px 26px; text-align: center; margin-top: 14px; animation: fadeIn 0.3s ease;">
              <!-- Auto-Save Success Banner (Mandatory Requirement) -->
              <div class="auto-save-success-banner">
                <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
                <span id="autoSaveBannerText">✅ ប្រព័ន្ធបានបញ្ចូលពិន្ទុជាក់ស្តែងចូលទៅក្នុងប្រព័ន្ធ និង Firebase Database ដោយស្វ័យប្រវត្តរួចរាល់!</span>
              </div>

              <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: #10b981; color: #ffffff; font-size: 2rem; margin-bottom: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                <i class="fa-solid fa-trophy"></i>
              </div>
              <h3 style="font-size: 1.35rem; margin: 0 0 6px 0; color: var(--text-main);" id="arenaResultHeaderTitle">🎉 លទ្ធផលការប្រឡងជាក់ស្តែង</h3>
              <p style="margin: 0 0 18px 0; font-size: 0.92rem; color: var(--text-muted);" id="arenaResultStudentInfo">បេក្ខជន៖ ...</p>
              
              <!-- Result KPI Stat Cards -->
              <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 20px;">
                <div style="background: var(--border-light); padding: 12px 20px; border-radius: 10px; border: 1px solid var(--border-color); min-width: 120px;">
                  <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">ពិន្ទុសរុប (Score)</div>
                  <div style="font-size: 1.9rem; font-weight: 800; color: #4f46e5;" id="arenaResultScore">0</div>
                </div>

                <div style="background: var(--border-light); padding: 12px 20px; border-radius: 10px; border: 1px solid var(--border-color); min-width: 120px;">
                  <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">និទ្ទេស (Grade)</div>
                  <div style="font-size: 1.9rem; font-weight: 800;" id="arenaResultGrade">—</div>
                </div>

                <div style="background: var(--border-light); padding: 12px 20px; border-radius: 10px; border: 1px solid var(--border-color); min-width: 140px;">
                  <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;">លទ្ធផល (Result)</div>
                  <div style="font-size: 1.35rem; font-weight: 800; margin-top: 4px;" id="arenaResultStatus">—</div>
                </div>

                <div style="background: var(--border-light); padding: 12px 20px; border-radius: 10px; border: 1px solid var(--border-color); min-width: 160px;" id="arenaResultExtraBox">
                  <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700;" id="arenaResultExtraLbl">ព័ត៌មានលម្អិត</div>
                  <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-top: 6px;" id="arenaResultExtraVal">—</div>
                </div>
              </div>

              <!-- Answer Review Mount (For Word, Excel, PowerPoint) -->
              <div id="arenaAnswerReviewMount" style="display: none; text-align: left; margin-bottom: 20px; max-height: 260px; overflow-y: auto; background: var(--border-light); border-radius: 10px; padding: 14px 18px; border: 1px solid var(--border-color);">
                <!-- Review list -->
              </div>

              <!-- Typing Mistakes Breakdown Mount (For Typing Live Exam) -->
              <div id="arenaTypingMistakesMount" style="display: none; text-align: left; margin-bottom: 20px; max-height: 320px; overflow-y: auto; background: var(--border-light); border-radius: 12px; padding: 16px 20px; border: 1px solid var(--border-color);">
                <!-- Mistakes list -->
              </div>

              <!-- Action Controls -->
              <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                <button type="button" class="btn-secondary" style="height: 40px; padding: 0 18px;" onclick="ExamsView.retakeCurrentExam()">
                  <i class="fa-solid fa-rotate-right"></i> <span>ប្រឡងឡើងវិញម្តងទៀត</span>
                </button>
                <button type="button" class="btn-primary" style="height: 40px; padding: 0 22px; background: #4f46e5; border-color: #4f46e5;" data-close-modal="liveTypingModal" onclick="ExamsView.stopExamSession()">
                  <i class="fa-solid fa-check"></i> <span>✓ រួចរាល់ (Close & Return)</span>
                </button>
              </div>
              </div>
            </div>
          </div>

          <div class="exam-arena-footer">
            <div class="text-xs text-muted" id="arenaFooterHint" style="font-size: 0.84rem; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-lightbulb text-amber-500"></i>
              <span>ប្រព័ន្ធនឹងធ្វើការបញ្ចូលពិន្ទុ និងកត់ត្រាចូលទៅក្នុងប្រវត្តិសិស្ស និង Firebase ដោយស្វ័យប្រវត្តភ្លាមៗពេលបញ្ចប់។ ចុច [Esc] ដើម្បីចាកចេញ។</span>
            </div>
            <button type="button" class="btn-secondary" data-close-modal="liveTypingModal" onclick="ExamsView.stopExamSession()" style="height: 38px; padding: 0 20px; font-weight: 700;">
              <i class="fa-solid fa-xmark"></i> បិទផ្ទាំងសាលប្រឡង
            </button>
          </div>
        </div>
      </div>

      <!-- 6. Modal: Delete Confirmation Dialog -->
      <div id="deleteConfirmModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 420px; text-align: center;">
          <div class="modal-body" style="padding: 32px 24px 20px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--danger-light); color: var(--danger); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px;">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 8px;">តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
              សិស្ស៖ <strong id="deleteStudentName" style="color: var(--text-main);"></strong>
            </p>
            <p style="font-size: 0.78rem; color: var(--danger);">
              * ទិន្នន័យដែលបានលុបនឹងមិនអាចត្រឡប់វិញបានឡើយ!
            </p>
          </div>
          <div class="modal-footer" style="justify-content: center; background: var(--border-light);">
            <button type="button" class="btn-secondary" data-close-modal="deleteConfirmModal">បោះបង់</button>
            <button type="button" id="confirmDeleteBtn" class="btn-primary" style="background: var(--danger);">
              <i class="fa-solid fa-trash"></i>
              <span>យល់ព្រមលុប</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 7. Modal: Record Tuition Payment & Issue Invoice -->
      <div id="recordPaymentModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 600px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 8px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-cash-register"></i>
              <span>កត់ត្រាការបង់ថ្លៃសិក្សា (Record Tuition Fee)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="recordPaymentModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <form id="recordPaymentForm" method="dialog" onsubmit="event.preventDefault(); return false;">
            <div class="modal-body" style="padding: 20px 24px; max-height: 75vh; overflow-y: auto;">
              <div class="form-grid">
                <!-- Student Select -->
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label class="form-label"><span>សិស្សត្រូវបង់ថ្លៃសិក្សា (Student)</span> <span class="required">*</span></label>
                  <select id="payStudentSelect" class="form-control" required style="font-weight: 600;">
                    <!-- Filled dynamically -->
                  </select>
                </div>

                <!-- Course Select -->
                <div class="form-group">
                  <label class="form-label"><span>វគ្គសិក្សាកុំព្យូទ័រ (Course)</span></label>
                  <select id="payCourseSelect" class="form-control">
                    <option value="Typing">Typing (វាយអត្ថបទ)</option>
                    <option value="Microsoft Word">Microsoft Word</option>
                    <option value="Microsoft Excel">Microsoft Excel</option>
                    <option value="Microsoft PowerPoint">Microsoft PowerPoint</option>
                  </select>
                </div>

                <!-- Total Amount -->
                <div class="form-group">
                  <label class="form-label"><span>តម្លៃវគ្គសរុប (Total Amount)</span></label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 12px; top: 9px; font-weight: 700; color: var(--text-muted);">$</span>
                    <input type="number" id="payTotalAmount" class="form-control" value="50" step="0.5" style="padding-left: 28px; font-weight: 700;" required>
                  </div>
                </div>

                <!-- Paid Amount -->
                <div class="form-group">
                  <label class="form-label"><span>ចំនួនប្រាក់បានបង់ (Paid Amount)</span> <span class="required">*</span></label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 12px; top: 9px; font-weight: 700; color: #10b981;">$</span>
                    <input type="number" id="payPaidAmount" class="form-control" value="50" step="0.5" style="padding-left: 28px; font-weight: 700; color: #10b981;" required>
                  </div>
                </div>

                <!-- Discount -->
                <div class="form-group">
                  <label class="form-label"><span>បញ្ចុះតម្លៃ (Discount)</span></label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 12px; top: 9px; font-weight: 700; color: var(--text-muted);">$</span>
                    <input type="number" id="payDiscount" class="form-control" value="0" step="0.5" style="padding-left: 28px;">
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="form-group">
                  <label class="form-label"><span>វិធីសាស្ត្រទូទាត់ (Payment Method)</span></label>
                  <select id="payMethodSelect" class="form-control" style="font-weight: 600;">
                    <option value="ABA KHQR">ABA KHQR (Bakong)</option>
                    <option value="Wing Bank">Wing Bank / WingPay</option>
                    <option value="ACLEDA ToanChet">ACLEDA ទាន់ចិត្ត</option>
                    <option value="សាច់ប្រាក់ផ្ទាល់ (Cash)">សាច់ប្រាក់ផ្ទាល់ (Cash)</option>
                  </select>
                </div>

                <!-- Payment Date -->
                <div class="form-group">
                  <label class="form-label"><span>កាលបរិច្ឆេទបង់ (Payment Date)</span></label>
                  <input type="date" id="payDateInput" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>

                <!-- Note -->
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label class="form-label"><span>កំណត់សម្គាល់ (Note)</span></label>
                  <input type="text" id="payNoteInput" class="form-control" placeholder="ឧ. បង់ថ្លៃវគ្គពេញ ឬបង់មុនពាក់កណ្តាល">
                </div>
              </div>
            </div>
            <div class="modal-footer" style="padding: 14px 24px;">
              <button type="button" class="btn-secondary" data-close-modal="recordPaymentModal">បោះបង់</button>
              <button type="submit" class="btn-primary" style="background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                <i class="fa-solid fa-check"></i>
                <span>កត់ត្រាការបង់ប្រាក់ & ចេញវិក្កយបត្រ</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 8. Modal: QR Code & Barcode Attendance Fast Scanner -->
      <div id="qrAttendanceModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 580px; text-align: center;">
          <div class="modal-header" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 8px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-qrcode"></i>
              <span>ស្កេនកាតសិស្សកត់ត្រាវត្តមាន (QR & Barcode Scanner)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="qrAttendanceModal" onclick="AttendanceView.stopQrScanner()" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body" style="padding: 20px 24px;">
            <!-- Camera Viewfinder Box -->
            <div class="qr-scanner-viewport-box">
              <div id="qrReaderContainer" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 0.85rem;">
                <span>ចុច [បើកកាមេរ៉ា] ដើម្បីចាប់ផ្តើមស្កេន</span>
              </div>
              <div class="qr-scan-crosshair"></div>
            </div>

            <!-- Live Camera Controls -->
            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 16px;">
              <button type="button" id="startCamBtn" class="btn-primary" style="height: 34px; padding: 0 16px; font-size: 0.82rem; background: #6366f1; border-color: #6366f1;" onclick="AttendanceView.startQrScanner()">
                <i class="fa-solid fa-camera"></i> <span>បើកកាមេរ៉ាស្កេន</span>
              </button>
              <button type="button" id="stopCamBtn" class="btn-secondary" style="height: 34px; padding: 0 14px; font-size: 0.82rem; display: none;" onclick="AttendanceView.stopQrScanner()">
                <i class="fa-solid fa-camera-rotate"></i> <span>បិទកាមេរ៉ា</span>
              </button>
            </div>

            <!-- Quick USB Barcode Gun / Manual Input -->
            <div style="background: var(--border-light); padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; text-align: left;">
              <label class="form-label" style="font-weight: 700; font-size: 0.8rem; margin-bottom: 6px;">
                <i class="fa-solid fa-barcode text-indigo-500"></i> ឬស្កេនតាមកាំភ្លើងបាកូដ / វាយអត្តលេខសិស្សផ្ទាល់ (Barcode Gun / ID):
              </label>
              <form id="qrManualScanForm" onsubmit="event.preventDefault(); AttendanceView.handleManualQrSubmit(); return false;" style="display: flex; gap: 8px;">
                <input type="text" id="qrManualInput" class="form-control" placeholder="ស្កេនបាកូដ ឬវាយ TX01 រួច Enter..." style="font-family: monospace; font-size: 0.95rem; font-weight: 700;">
                <button type="submit" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 0.85rem; background: #10b981; border-color: #10b981;">
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>

            <!-- Instant Scan Result Feedback Card -->
            <div id="qrScanFeedbackBox" style="display: none; padding: 14px 18px; border-radius: 10px; border: 2px solid #10b981; background: rgba(16, 185, 129, 0.08); text-align: left; animation: fadeIn 0.3s ease;">
              <!-- Filled dynamically on scan -->
            </div>
          </div>
          <div class="modal-footer" style="justify-content: space-between;">
            <span class="text-xs text-muted"><i class="fa-solid fa-volume-high text-indigo-500"></i> មានសំឡេងបន្លឺ Ding! ស្វ័យប្រវត្តិនឹងគ្រីសវត្តមានភ្លាម</span>
            <button type="button" class="btn-secondary" data-close-modal="qrAttendanceModal" onclick="AttendanceView.stopQrScanner()">បិទផ្ទាំង</button>
          </div>
        </div>
      </div>

      <!-- 9. Modal: Bulk Import Students from Excel / CSV -->
      <div id="importExcelModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 860px; max-height: 90vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-file-excel"></i>
              <span>នាំចូលទិន្នន័យសិស្សពី Excel / CSV (Bulk Import Students)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="importExcelModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="modal-body" style="padding: 20px; overflow-y: auto; flex: 1;">
            <!-- Top Step Guidance & Template Download -->
            <div style="background: var(--border-light); border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; border: 1px solid var(--border-color);">
              <div>
                <h4 style="margin: 0 0 4px 0; font-size: 0.95rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-circle-info text-emerald-600"></i>
                  <span>ជំហានទី ១៖ ទាញយកទម្រង់គំរូ (Template)</span>
                </h4>
                <p style="margin: 0; font-size: 0.82rem; color: var(--text-muted);">
                  ទាញយកឯកសារគំរូដែលមានជួរឈរត្រឹមត្រូវ (ឈ្មោះខ្មែរ, ឈ្មោះឡាតាំង, ភេទ, វគ្គ, វេន, លេខទូរស័ព្ទ)
                </p>
              </div>
              <button type="button" id="btnDownloadExcelTemplate" class="btn-secondary" style="font-size: 0.85rem; height: 38px; color: #059669; border-color: #10b981;">
                <i class="fa-solid fa-download text-emerald-600"></i>
                <span>ទាញយកគំរូ Template (.CSV)</span>
              </button>
            </div>

            <!-- Upload Drag-and-Drop Dropzone -->
            <div id="excelDropZone" style="border: 2px dashed #10b981; border-radius: 12px; background: rgba(16, 185, 129, 0.04); padding: 30px 20px; text-align: center; cursor: pointer; transition: all 0.2s ease; margin-bottom: 20px;">
              <input type="file" id="excelFileInput" accept=".xlsx, .xls, .csv" style="display: none;">
              <div style="font-size: 2.8rem; color: #10b981; margin-bottom: 10px;">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <h4 style="margin: 0 0 6px 0; font-size: 1.05rem; color: var(--text-main);">
                ជ្រើសរើស ឬអូសទម្លាក់ឯកសារ Excel ឬ CSV មកទីនេះ
              </h4>
              <p style="margin: 0 0 12px 0; font-size: 0.84rem; color: var(--text-muted);">
                គាំទ្រឯកសារប្រភេទ <code>.xlsx</code>, <code>.xls</code>, និង <code>.csv</code> (UTF-8)
              </p>
              <button type="button" class="btn-primary" style="height: 36px; padding: 0 20px; font-size: 0.85rem; background: #10b981; border-color: #10b981;" onclick="document.getElementById('excelFileInput').click()">
                <i class="fa-solid fa-folder-open"></i> ជ្រើសរើសឯកសារ
              </button>
            </div>

            <!-- Preview Container (Hidden initially until file chosen) -->
            <div id="excelImportPreviewContainer" style="display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-table text-emerald-600"></i>
                  <span>ទិន្នន័យត្រៀមបញ្ចូល៖</span>
                  <span id="importPreviewCountBadge" class="badge" style="background: rgba(16,185,129,0.15); color: #059669; font-size: 0.82rem;">0 នាក់</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted);" id="importPreviewFileInfo"></div>
              </div>

              <!-- Table View of Parsed Rows -->
              <div style="max-height: 260px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 16px;">
                <table class="data-table" style="font-size: 0.82rem; margin: 0;">
                  <thead style="position: sticky; top: 0; background: var(--bg-surface); z-index: 2;">
                    <tr>
                      <th style="width: 40px; text-align: center;">ល.រ</th>
                      <th>អត្តលេខ (ID)</th>
                      <th>ឈ្មោះខ្មែរ (NameKh)</th>
                      <th>ឈ្មោះឡាតាំង (NameEn)</th>
                      <th>ភេទ</th>
                      <th>វគ្គសិក្សា (Course)</th>
                      <th>វេន</th>
                      <th>លេខទូរស័ព្ទ</th>
                    </tr>
                  </thead>
                  <tbody id="importPreviewTableBody">
                    <!-- Injected dynamically -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn-secondary" data-close-modal="importExcelModal">បោះបង់</button>
            <button type="button" id="btnConfirmBatchImport" class="btn-primary" style="background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);" disabled>
              <i class="fa-solid fa-check"></i>
              <span id="btnConfirmBatchImportText">បញ្ជាក់ការបញ្ចូលសិស្ស</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 10. Modal: Admin Review & Manage Student Leave Requests -->
      <div id="leaveRequestAdminModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 780px; max-height: 90vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-envelope-open-text"></i>
              <span>គ្រប់គ្រងសំណើសុំច្បាប់អវត្តមាន (Leave Requests)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="leaveRequestAdminModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="modal-body" style="padding: 20px; overflow-y: auto; flex: 1;">
            <!-- Filter Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div class="leave-filter-tabs" style="display: flex; gap: 6px;">
                <button type="button" class="btn-paper-filter active" data-leave-filter="all">ទាំងអស់</button>
                <button type="button" class="btn-paper-filter" data-leave-filter="pending">
                  <i class="fa-solid fa-clock text-amber-500"></i> រង់ចាំពិនិត្យ
                </button>
                <button type="button" class="btn-paper-filter" data-leave-filter="approved">
                  <i class="fa-solid fa-circle-check text-emerald-500"></i> បានយល់ព្រម
                </button>
                <button type="button" class="btn-paper-filter" data-leave-filter="rejected">
                  <i class="fa-solid fa-circle-xmark text-rose-500"></i> បានបដិសេធ
                </button>
              </div>
              <span class="text-xs text-muted">💡 ពេលយល់ព្រម ប្រព័ន្ធនឹងគ្រីស "ច្បាប់ (P)" ក្នុងតារាងវត្តមានស្វ័យប្រវត្តិ</span>
            </div>

            <!-- List Container -->
            <div id="adminLeaveRequestsListContainer">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" data-close-modal="leaveRequestAdminModal">បិទផ្ទាំង</button>
          </div>
        </div>
      </div>

      <!-- 11. Modal: Mark Student Dropout (កត់ត្រាសិស្សបោះបង់ & ចាក់សោរ ID) -->
      <div id="markDropoutModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 580px; border-top: 4px solid #ef4444;">
          <div class="modal-header" style="background: linear-gradient(135deg, #ef4444, #b91c1c); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-user-xmark"></i>
              <span>កត់ត្រាសិស្សបោះបង់ការសិក្សា (Mark Dropout)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="markDropoutModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form id="markDropoutForm" method="dialog" onsubmit="event.preventDefault(); return false;">
            <div class="modal-body" style="padding: 22px 24px; max-height: 75vh; overflow-y: auto;">
              <!-- ID Lock Alert Warning -->
              <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; display: flex; align-items: flex-start; gap: 12px;">
                <i class="fa-solid fa-triangle-exclamation" style="color: #ef4444; font-size: 1.3rem; margin-top: 2px;"></i>
                <div style="font-size: 0.84rem; color: var(--text-main); line-height: 1.5;">
                  <strong style="color: #ef4444; display: block; margin-bottom: 2px;">ការព្រមានសំខាន់អំពីការចាក់សោរ ID:</strong>
                  នៅពេលសិស្សត្រូវបានកំណត់ជា "បោះបង់ការសិក្សា" នោះ <strong style="color: #ef4444;">អត្តលេខ (ID) របស់សិស្សនឹងត្រូវចាក់សោរជាអចិន្ត្រៃយ៍</strong> ហើយប្រើប្រាស់លែងកើត (មិនអាចស្កេនវត្តមាន ឬ Login បានឡើយ)។
                </div>
              </div>

              <!-- Select Student -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" style="font-weight: 600;"><span>ជ្រើសរើសសិស្សបោះបង់ (Student)</span> <span class="required" style="color: #ef4444;">*</span></label>
                <select id="dropoutSelectStudent" class="form-control" required style="font-weight: 600;">
                  <option value="">-- ជ្រើសរើសសិស្ស --</option>
                </select>
              </div>

              <!-- Student Preview Card -->
              <div id="dropoutStudentPreview" style="display: none; align-items: center; gap: 12px; background: var(--border-light); padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-color);">
              </div>

              <!-- Grid: Drop Date & Reason -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;"><span>កាលបរិច្ឆេទបោះបង់ (Drop Date)</span> <span class="required" style="color: #ef4444;">*</span></label>
                  <input type="date" id="dropoutDate" class="form-control" required>
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;"><span>មូលហេតុបោះបង់ (Reason)</span></label>
                  <select id="dropoutReason" class="form-control">
                    <option value="ជាប់រវល់ការងារ">ជាប់រវល់ការងារ</option>
                    <option value="ប្តូរទីលំនៅ">ប្តូរទីលំនៅ / ផ្លាស់ទៅខេត្ត</option>
                    <option value="បញ្ហាគ្រួសារ">បញ្ហាគ្រួសារ</option>
                    <option value="គ្មានលទ្ធភាពបង់ថ្លៃ">គ្មានលទ្ធភាពបង់ថ្លៃសិក្សា</option>
                    <option value="តាមមិនទាន់មេរៀន">តាមមិនទាន់មេរៀន</option>
                    <option value="ផ្សេងៗ">ផ្សេងៗ</option>
                  </select>
                </div>
              </div>

              <!-- Detailed Note -->
              <div class="form-group">
                <label class="form-label" style="font-weight: 600;"><span>កំណត់សម្គាល់បន្ថែម (Note / Details)</span></label>
                <textarea id="dropoutNote" class="form-control" rows="3" placeholder="បញ្ជាក់លម្អិតអំពីមូលហេតុបោះបង់ ឬព័ត៌មានផ្សេងៗ..."></textarea>
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn-secondary" data-close-modal="markDropoutModal">បោះបង់</button>
              <button type="button" id="btnSubmitDropout" class="btn-primary" style="background: #ef4444; border-color: #ef4444; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);">
                <i class="fa-solid fa-lock"></i>
                <span>បញ្ជាក់ការបោះបង់ & ចាក់សោរ ID</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 12. Modal: Mark Student Graduate (កត់ត្រាសិស្សបញ្ចប់ការសិក្សា & ចេញប័ណ្ណ) -->
      <div id="markGraduateModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 580px; border-top: 4px solid #10b981;">
          <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff;">
            <h3 style="color: #ffffff; display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.15rem;">
              <i class="fa-solid fa-user-graduate"></i>
              <span>កត់ត្រាសិស្សបញ្ចប់ការសិក្សា (Mark Graduate)</span>
            </h3>
            <button type="button" class="modal-close-btn" data-close-modal="markGraduateModal" style="color: #ffffff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form id="markGraduateForm" method="dialog" onsubmit="event.preventDefault(); return false;">
            <div class="modal-body" style="padding: 22px 24px; max-height: 75vh; overflow-y: auto;">
              <!-- Congratulations Banner -->
              <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; display: flex; align-items: flex-start; gap: 12px;">
                <i class="fa-solid fa-award" style="color: #10b981; font-size: 1.4rem; margin-top: 2px;"></i>
                <div style="font-size: 0.84rem; color: var(--text-main); line-height: 1.5;">
                  <strong style="color: #10b981; display: block; margin-bottom: 2px;">អបអរសាទរសិស្សបញ្ចប់ការសិក្សា:</strong>
                  សិស្សនឹងត្រូវបានប្តូរទៅកាន់បញ្ជី "សិស្សបញ្ចប់ការសិក្សា (Alumni)" និងអាចចេញវិញ្ញាបនបត្រឌីជីថលជាផ្លូវការបានភ្លាមៗ។
                </div>
              </div>

              <!-- Select Student -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" style="font-weight: 600;"><span>ជ្រើសរើសសិស្សបញ្ចប់ (Student)</span> <span class="required" style="color: #ef4444;">*</span></label>
                <select id="graduateSelectStudent" class="form-control" required style="font-weight: 600;">
                  <option value="">-- ជ្រើសរើសសិស្ស --</option>
                </select>
              </div>

              <!-- Student Preview Card -->
              <div id="graduateStudentPreview" style="display: none; align-items: center; gap: 12px; background: var(--border-light); padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-color);">
              </div>

              <!-- Grid: Grad Date & Grade -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;"><span>ថ្ងៃបញ្ចប់ការសិក្សា (Date)</span> <span class="required" style="color: #ef4444;">*</span></label>
                  <input type="date" id="graduateDate" class="form-control" required>
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;"><span>និទ្ទេស / លទ្ធផល (Final Grade)</span></label>
                  <select id="graduateFinalGrade" class="form-control">
                    <option value="A (ល្អប្រសើរ)">A (ល្អប្រសើរ - 90-100%)</option>
                    <option value="B (ល្អណាស់)">B (ល្អណាស់ - 80-89%)</option>
                    <option value="C (ល្អ)">C (ល្អ - 70-79%)</option>
                    <option value="D (មធ្យម)">D (មធ្យម - 60-69%)</option>
                  </select>
                </div>
              </div>

              <!-- Checkbox: Auto Issue Certificate -->
              <div style="margin-bottom: 16px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 8px; padding: 12px 16px;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 600; color: var(--text-main); font-size: 0.88rem;">
                  <input type="checkbox" id="graduateAutoIssueCert" checked style="width: 18px; height: 18px; accent-color: #10b981;">
                  <span>ចេញវិញ្ញាបនបត្រឌីជីថល (Digital Certificate) ដោយស្វ័យប្រវត្តិ</span>
                </label>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; padding-left: 28px;">
                  ប្រព័ន្ធនឹងបង្កើតលេខកូដវិញ្ញាបនបត្រ (CERT-xxxx) និងភ្ជាប់ទៅកាន់ទម្រង់បោះពុម្ពវិញ្ញាបនបត្រ។
                </div>
              </div>

              <!-- Detailed Note -->
              <div class="form-group">
                <label class="form-label" style="font-weight: 600;"><span>កំណត់សម្គាល់បន្ថែម (Note)</span></label>
                <textarea id="graduateNote" class="form-control" rows="2" placeholder="ព័ត៌មានបន្ថែមអំពីការបញ្ចប់វគ្គ..."></textarea>
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn-secondary" data-close-modal="markGraduateModal">បោះបង់</button>
              <button type="button" id="btnSubmitGraduate" class="btn-primary" style="background: #10b981; border-color: #10b981; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                <i class="fa-solid fa-graduation-cap"></i>
                <span>បញ្ជាក់ការបញ្ចប់ការសិក្សា</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 7. Modal: PC Remote Screen Inspection & Live Control (NetSupport Style) -->
      <div id="pcRemoteInspectModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 1020px; width: 96vw; background: #080d1a; border: 1.5px solid rgba(56, 189, 248, 0.35); box-shadow: 0 25px 60px rgba(0,0,0,0.85), 0 0 45px rgba(6, 182, 212, 0.22); border-radius: 18px; overflow: hidden;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0b1329 0%, #17153b 100%); color: #fff; padding: 14px 24px; border-bottom: 2px solid rgba(6, 182, 212, 0.5); position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #10b981);"></div>
            <div style="display: flex; align-items: center; gap: 14px;">
              <span style="background: rgba(6, 182, 212, 0.15); border: 1.5px solid rgba(6, 182, 212, 0.5); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #38bdf8; font-size: 1.1rem; box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);">
                <i class="fa-solid fa-desktop"></i>
              </span>
              <div>
                <h3 id="inspectPcTitle" style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 10px; letter-spacing: 0.3px;">
                  <span>ត្រួតពិនិត្យអេក្រង់ផ្ទាល់ (Live Stream Cockpit)</span> 
                  <span id="inspectPcIdBadge" class="badge font-mono" style="background: linear-gradient(135deg, #06b6d4, #0284c7); color: #fff; font-size: 0.82rem; padding: 3px 10px; border-radius: 6px; box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);">PC-01</span>
                </h3>
                <p id="inspectPcSubtitle" style="margin: 3px 0 0 0; font-size: 0.78rem; color: #94a3b8; font-family: var(--font-mono, monospace);">
                  សិស្ស៖ កំពុងផ្ទុក... • IP: 192.168.1.101 • Host: DESKTOP-LAB-01
                </p>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <button type="button" class="btn-sm" id="inspectBtnToggleLock" onclick="TimetableLabView.toggleSinglePcLockFromInspect()" style="background: rgba(239, 68, 68, 0.18); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; font-weight: 700; padding: 7px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;">
                <i class="fa-solid fa-lock"></i> <span>ចាក់សោរ PC</span>
              </button>
              <button type="button" class="btn-sm" onclick="TimetableLabView.openDirectMessageFromInspect()" style="background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.5); color: #a5b4fc; font-weight: 700; padding: 7px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;">
                <i class="fa-solid fa-comment-dots"></i> <span>ផ្ញើសារ</span>
              </button>
              <button type="button" class="header-close-btn" data-close-modal="pcRemoteInspectModal" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; margin-left: 4px; transition: all 0.2s ease;">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <div class="modal-body" style="padding: 20px 24px; background: #060a14;">
            <!-- Active Screen Container (Cinema Ambilight Studio) -->
            <div id="inspectScreenContainer" style="position: relative; width: 100%; height: 480px; background: #02040a; border-radius: 12px; border: 2px solid rgba(56, 189, 248, 0.25); overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 15px 40px rgba(0,0,0,0.8), 0 0 35px rgba(6, 182, 212, 0.18);">
              <div id="inspectScreenDisplay" style="flex: 1; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #010206;">
                <!-- Live canvas / interactive screen stream -->
              </div>
              <div style="height: 38px; background: linear-gradient(180deg, #0f172a 0%, #090d16 100%); border-top: 1px solid rgba(255, 255, 255, 0.08); padding: 0 16px; display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; color: #94a3b8;">
                <div id="inspectActiveAppFooter" style="display: flex; align-items: center; gap: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%;">
                  <i class="fa-solid fa-window-maximize text-cyan-400"></i>
                  <span id="inspectActiveAppName" style="color: #f1f5f9; font-weight: 700;">Microsoft Word - កិច្ចការ.docx</span>
                </div>
                <div style="display: flex; align-items: center; gap: 14px; font-family: var(--font-mono, monospace);">
                  <span id="inspectLiveSyncPill" style="color: #34d399; display: flex; align-items: center; gap: 6px; font-weight: 700;">
                    <span class="pc-live-dot"></span> LIVE STREAM
                  </span>
                  <span id="inspectResolution" style="color: #7dd3fc;">1920 x 1080 (30 FPS • 4.5 Mb/s)</span>
                </div>
              </div>
            </div>

            <!-- Diagnostics & Quick Actions Bar below screen -->
            <div style="margin-top: 16px; display: grid; grid-template-columns: 2fr 1fr; gap: 14px;">
              <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.15); border-radius: 10px; padding: 12px 16px; font-size: 0.82rem; color: #e2e8f0; backdrop-filter: blur(10px);">
                <div style="font-weight: 700; color: #38bdf8; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-bars-progress"></i> កម្មវិធីដំណើរការលើម៉ាស៊ីន (Running Tasks):
                  </span>
                  <span style="font-size: 0.7rem; color: #64748b; font-family: var(--font-mono, monospace);">Auto-Guard Active</span>
                </div>
                <div id="inspectProcessList" style="display: flex; flex-wrap: wrap; gap: 6px;">
                  <!-- Process pills -->
                </div>
              </div>

              <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px 16px; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-weight: 700; color: #cbd5e1; font-size: 0.82rem; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-shield-halved text-amber-400"></i> បញ្ជាការភ្លាមៗលើម៉ាស៊ីននេះ៖
                </div>
                <div style="display: flex; gap: 8px;">
                  <button type="button" class="btn-sm" onclick="TimetableLabView.killCurrentActiveApp()" style="flex: 1; background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3)); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; padding: 8px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease;">
                    <i class="fa-solid fa-ban"></i> បិទ App នេះ
                  </button>
                  <button type="button" class="btn-sm" onclick="TimetableLabView.blankSinglePc()" style="flex: 1; background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.3)); border: 1px solid rgba(245, 158, 11, 0.5); color: #fde68a; padding: 8px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease;">
                    <i class="fa-solid fa-eye-slash"></i> Blank Screen
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer" style="background: #080d1a; border-top: 1px solid rgba(255,255,255,0.08); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-circle-info text-cyan-400"></i> 
              <span>អាចចុចគ្រាប់ចុច <kbd style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 1px 6px; border-radius: 4px; font-size: 0.75rem; color: #38bdf8;">Esc</kbd> ដើម្បីបិទផ្ទាំង ឬចុចលើប៊ូតុងខាងស្តាំ។</span>
            </div>
            <button type="button" class="btn-secondary" data-close-modal="pcRemoteInspectModal" style="height: 38px; padding: 0 18px; font-weight: 700; border-radius: 8px;">បិទផ្ទាំង</button>
          </div>
        </div>
      </div>

      <!-- 8. Modal: Lab App Policy & Restriction Manager -->
      <div id="labAppPolicyModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 640px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #1e1b4b, #312e81); color: #fff; padding: 16px 22px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-shield-halved" style="color: #a78bfa; font-size: 1.3rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #fff;">កំណត់ច្បាប់ប្រើប្រាស់កម្មវិធី (App Policy & Restrictions)</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #cbd5e1;">កំណត់កម្មវិធីដែលអនុញ្ញាត និងហាមឃាត់សម្រាប់ម៉ាស៊ីនសិស្សទាំងអស់ក្នុង Lab</p>
              </div>
            </div>
            <button type="button" class="header-close-btn" data-close-modal="labAppPolicyModal" style="background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="modal-body" style="padding: 20px 24px;">
            <!-- Mode Selector Preset Cards -->
            <label style="font-weight: 700; font-size: 0.9rem; display: block; margin-bottom: 8px;">
              ជ្រើសរើសទម្រង់កំណត់ (Policy Preset Mode)៖
            </label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px;">
              <div class="policy-mode-card" id="modeCardExam" onclick="TimetableLabView.selectPolicyPreset('exam')" style="border: 2px solid #8b5cf6; background: rgba(139, 92, 246, 0.08); padding: 12px; border-radius: 10px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.4rem; color: #8b5cf6; margin-bottom: 4px;"><i class="fa-solid fa-graduation-cap"></i></div>
                <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">Exam Mode (វគ្គប្រឡង)</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">អនុញ្ញាតតែ Word, Excel, PPT, Typing</div>
              </div>
              <div class="policy-mode-card" id="modeCardStudy" onclick="TimetableLabView.selectPolicyPreset('study')" style="border: 1px solid var(--border-color); background: var(--bg-surface); padding: 12px; border-radius: 10px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.4rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-book-open"></i></div>
                <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">Study Mode (រៀនសូត្រ)</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">អនុញ្ញាត Office & PDF (បិទ Games)</div>
              </div>
              <div class="policy-mode-card" id="modeCardFree" onclick="TimetableLabView.selectPolicyPreset('free')" style="border: 1px solid var(--border-color); background: var(--bg-surface); padding: 12px; border-radius: 10px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.4rem; color: #10b981; margin-bottom: 4px;"><i class="fa-solid fa-unlock"></i></div>
                <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">Free Mode (សេរី)</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">អនុញ្ញាតគ្រប់កម្មវិធីទាំងអស់</div>
              </div>
            </div>

            <!-- Whitelist Checkboxes -->
            <div style="margin-bottom: 16px;">
              <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 8px;">
                <i class="fa-solid fa-check-double text-emerald-500"></i> កម្មវិធីដែលអនុញ្ញាតឱ្យបើក (Allowed Applications Whitelist)៖
              </label>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: var(--border-light); padding: 12px 16px; border-radius: 8px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                  <input type="checkbox" class="policy-app-check" value="WINWORD" checked>
                  <i class="fa-solid fa-file-word text-blue-500"></i> <span>Microsoft Word</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                  <input type="checkbox" class="policy-app-check" value="EXCEL" checked>
                  <i class="fa-solid fa-file-excel text-emerald-500"></i> <span>Microsoft Excel</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                  <input type="checkbox" class="policy-app-check" value="POWERPNT" checked>
                  <i class="fa-solid fa-file-powerpoint text-orange-500"></i> <span>Microsoft PowerPoint</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                  <input type="checkbox" class="policy-app-check" value="TypingArena" checked>
                  <i class="fa-solid fa-keyboard text-purple-500"></i> <span>Live Typing Exam Arena</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                  <input type="checkbox" class="policy-app-check" value="notepad" checked>
                  <i class="fa-solid fa-file-lines text-slate-500"></i> <span>Notepad / Text Editor</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                  <input type="checkbox" class="policy-app-check" value="calc" checked>
                  <i class="fa-solid fa-calculator text-cyan-500"></i> <span>Calculator (ម៉ាស៊ីនគិតលេខ)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                  <input type="checkbox" class="policy-app-check" value="chrome" id="policyAllowChrome">
                  <i class="fa-brands fa-chrome text-amber-500"></i> <span>Google Chrome (Web)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                  <input type="checkbox" class="policy-app-check" value="msedge" id="policyAllowEdge">
                  <i class="fa-brands fa-edge text-blue-500"></i> <span>Microsoft Edge (Web)</span>
                </label>
              </div>
            </div>

            <!-- Blacklisted Apps & Action -->
            <div style="margin-bottom: 16px;">
              <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
                <i class="fa-solid fa-ban text-rose-500"></i> ឈ្មោះកម្មវិធីដែលត្រូវបិទភ្លាមៗ (Auto-Terminate Process Name)៖
              </label>
              <input type="text" id="policyBlockedAppsInput" class="form-control" value="RobloxPlayerBeta, Telegram, Discord, Steam, EpicGamesLauncher, Spotify" placeholder="ឧ. Roblox, Telegram, Discord, game.exe" style="font-size: 0.85rem;">
              <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 4px;">
                * ប្រសិនបើសិស្សលួចបើកកម្មវិធីដែលមានឈ្មោះក្នុងបញ្ជីនេះ នោះ Agent នឹងបិទ (Kill Process) ភ្លាមៗដោយស្វ័យប្រវត្តិ។
              </div>
            </div>

            <!-- Lock Message -->
            <div style="margin-bottom: 10px;">
              <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
                សារបង្ហាញលើអេក្រង់ពេលចាក់សោរ (Lock Screen Banner Message)៖
              </label>
              <input type="text" id="policyLockMessageInput" class="form-control" value="🔒 លោកគ្រូកំពុងពន្យល់មេរៀន / ផ្អាកការប្រើប្រាស់កុំព្យូទ័របណ្តោះអាសន្ន" style="font-size: 0.85rem;">
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="labAppPolicyModal">បោះបង់</button>
            <button type="button" class="btn-primary" style="background: #8b5cf6; border-color: #8b5cf6; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);" onclick="TimetableLabView.saveAppPolicy()">
              <i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុក & អនុវត្តច្បាប់ភ្លាមៗ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 9. Modal: Broadcast Message to Student PCs -->
      <div id="labBroadcastModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0f172a, #0369a1); color: #fff; padding: 14px 20px;">
            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-bullhorn text-sky-400"></i>
              <span id="broadcastModalTitle">ផ្ញើសារប្រកាសទៅកាន់អេក្រង់សិស្ស</span>
            </h3>
            <button type="button" class="header-close-btn" data-close-modal="labBroadcastModal" style="background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body" style="padding: 20px;">
            <div class="form-group" style="margin-bottom: 14px;">
              <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
                ផ្ញើទៅកាន់ (Target Station)៖
              </label>
              <select id="broadcastTargetSelect" class="form-control" style="font-size: 0.88rem; font-weight: 600;">
                <option value="ALL">📢 គ្រប់ម៉ាស៊ីនទាំងអស់ក្នុង Lab (PC-01 ដល់ PC-14)</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 14px;">
              <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
                សារប្រកាស ឬការដាស់តឿន (Message)៖
              </label>
              <textarea id="broadcastMessageInput" class="form-control" rows="3" placeholder="វាយសាររបស់អ្នកនៅទីនេះ... ឧ. សល់ពេល ៥ នាទីទៀតត្រូវ Save កិច្ចការ ឬ សូមផ្អាកការវាយអត្ថបទ..."></textarea>
            </div>
          </div>
          <div class="modal-footer" style="padding: 12px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="labBroadcastModal">បោះបង់</button>
            <button type="button" class="btn-primary" style="background: #0284c7; border-color: #0284c7;" onclick="TimetableLabView.sendBroadcastMessage()">
              <i class="fa-solid fa-paper-plane"></i> <span>ផ្ញើសារភ្លាមៗ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 10. Modal: Standard Monthly Student Report (Excel Export & Official Print) -->
      <div id="monthlyReportModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 620px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #064e3b, #047857); color: #fff; padding: 16px 22px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                <i class="fa-solid fa-file-excel"></i>
              </span>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #fff;">របាយការណ៍សិស្សប្រចាំខែ (Excel & Print)</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #a7f3d0;">ទាញយកជាឯកសារ Excel ស្តង់ដារ ឬបោះពុម្ពរបាយការណ៍ផ្លូវការ</p>
              </div>
            </div>
            <button type="button" class="header-close-btn" data-close-modal="monthlyReportModal" style="background: none; border: none; color: #a7f3d0; font-size: 1.3rem; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="modal-body" style="padding: 22px 24px;">
            <!-- Filter Options Grid -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 16px;">
              <div class="form-group" style="margin: 0;">
                <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
                  <i class="fa-solid fa-calendar text-emerald-600"></i> ជ្រើសរើសខែរបាយការណ៍៖
                </label>
                <select id="reportMonthSelect" class="form-control" style="font-weight: 600; font-size: 0.88rem;">
                  <!-- Populated by App.openMonthlyReportModal() -->
                </select>
              </div>

              <div class="form-group" style="margin: 0;">
                <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
                  <i class="fa-solid fa-clock text-cyan-600"></i> ជ្រើសរើសវេនសិក្សា៖
                </label>
                <select id="reportShiftSelect" class="form-control" style="font-weight: 600; font-size: 0.88rem;">
                  <option value="ALL">-- គ្រប់វេនទាំងអស់ --</option>
                  <option value="ព្រឹក">វេនព្រឹក (08:00 - 09:00)</option>
                  <option value="ថ្ងៃ">វេនថ្ងៃ (15:00 - 16:00)</option>
                  <option value="រសៀល">វេនរសៀល (17:00 - 18:00)</option>
                </select>
              </div>
            </div>

            <!-- Status Filter -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label style="font-weight: 700; font-size: 0.88rem; display: block; margin-bottom: 6px;">
                <i class="fa-solid fa-user-check text-indigo-500"></i> ស្ថានភាពសិស្សក្នុងរបាយការណ៍៖
              </label>
              <select id="reportStatusSelect" class="form-control" style="font-weight: 600; font-size: 0.88rem;">
                <option value="Active">សិស្សកំពុងសិក្សាបច្ចុប្បន្ន (Active Students)</option>
                <option value="ALL">សិស្សទាំងអស់ក្នុងប្រព័ន្ធ (All Records)</option>
                <option value="Graduated">សិស្សបញ្ចប់ការសិក្សា (Graduated)</option>
              </select>
            </div>

            <!-- Statistics Summary Preview Card -->
            <div style="background: var(--border-light); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;">
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span><i class="fa-solid fa-chart-pie text-emerald-600"></i> សង្ខេបស្ថិតិនឹងបង្ហាញក្នុងរបាយការណ៍៖</span>
                <span id="reportTotalBadge" class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700;">សរុប 0 នាក់</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                <div style="background: var(--bg-surface); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
                  <div style="font-size: 0.72rem; color: var(--text-muted);">វត្តមានសរុប (ថ្ងៃ)</div>
                  <div id="reportTotalPresentDays" style="font-size: 1.1rem; font-weight: 800; color: #059669;">0 ថ្ងៃ</div>
                </div>
                <div style="background: var(--bg-surface); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
                  <div style="font-size: 0.72rem; color: var(--text-muted);">អវត្តមានសរុប (ថ្ងៃ)</div>
                  <div id="reportTotalAbsentDays" style="font-size: 1.1rem; font-weight: 800; color: #dc2626;">0 ថ្ងៃ</div>
                </div>
                <div style="background: var(--bg-surface); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
                  <div style="font-size: 0.72rem; color: var(--text-muted);">សុំច្បាប់សរុប (ថ្ងៃ)</div>
                  <div id="reportTotalPermDays" style="font-size: 1.1rem; font-weight: 800; color: #d97706;">0 ថ្ងៃ</div>
                </div>
              </div>
            </div>

            <!-- Standard Administrative Notice -->
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 12px 14px; font-size: 0.8rem; color: #047857; line-height: 1.6;">
              <i class="fa-solid fa-circle-check"></i> <strong>ទម្រង់ស្តង់ដាររដ្ឋបាលផ្លូវការ (Standard Format)៖</strong> ឯកសារ Excel (.xlsx) និងទម្រង់ Print មានក្បាលលិខិតជាតិ (ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ), ឈ្មោះមជ្ឈមណ្ឌល, ព័ត៌មានលម្អិត, <strong>វត្តមានគិតជាចំនួនថ្ងៃពិតប្រាកដ (មិនមែន %)</strong>, និងកន្លែងចុះហត្ថលេខាគ្រូ/ប្រធានសាលា។
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 10px;">
            <button type="button" class="btn-secondary" data-close-modal="monthlyReportModal">បោះបង់</button>
            <div style="display: flex; gap: 10px;">
              <button type="button" class="btn-secondary" onclick="App.printFromMonthlyModal()" style="height: 38px; font-weight: 700; color: #0284c7; border-color: rgba(2, 132, 199, 0.3);">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព (Print A4)</span>
              </button>
              <button type="button" class="btn-primary" style="height: 38px; background: #059669; border-color: #059669; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35); font-weight: 700;" onclick="App.exportFromMonthlyModal()">
                <i class="fa-solid fa-file-excel"></i> <span>ទាញយក Excel (.xlsx)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 11. Modal: Add / Edit Lab Software -->
      <div id="addSoftwareModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 660px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #fff; padding: 16px 22px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="width: 38px; height: 38px; border-radius: 8px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                <i class="fa-solid fa-box-open"></i>
              </span>
              <div>
                <h3 id="softwareModalTitle" style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #fff;">បញ្ចូលកម្មវិធីកុំព្យូទ័ររដ្ឋបាលថ្មី</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #93c5fd;">គ្រប់គ្រងព័ត៌មានកម្មវិធី អាជ្ញាប័ណ្ណ និងកំណត់ម៉ាស៊ីនដែលបានដំឡើង</p>
              </div>
            </div>
            <button type="button" class="header-close-btn" data-close-modal="addSoftwareModal" style="background: none; border: none; color: #bfdbfe; font-size: 1.3rem; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form id="formLabSoftware" onsubmit="event.preventDefault(); TimetableLabView.handleSaveSoftwareForm();">
            <input type="hidden" id="swFormId" name="id" value="">
            <div class="modal-body" style="padding: 20px 24px; max-height: 70vh; overflow-y: auto;">
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    ឈ្មោះកម្មវិធី (Software Name) <span style="color: #ef4444;">*</span>
                  </label>
                  <input type="text" id="swFormName" class="form-control" placeholder="ឧ. Microsoft Word 2021" required>
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    ប្រភេទ (Category)
                  </label>
                  <select id="swFormCategory" class="form-control">
                    <option value="Office">Office (ការិយាល័យ)</option>
                    <option value="Typing">Typing (វាយអក្សរ)</option>
                    <option value="Fonts">Fonts (ពុម្ពអក្សរ)</option>
                    <option value="Utility">Utility (ឧបករណ៍)</option>
                    <option value="Browser">Browser (អ៊ីនធឺណិត)</option>
                    <option value="Security">Security (ប្រព័ន្ធការពារ)</option>
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    ជំនាន់ (Version)
                  </label>
                  <input type="text" id="swFormVersion" class="form-control" placeholder="ឧ. 2021 (v16.0)">
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    ប្រភេទអាជ្ញាប័ណ្ណ (License Type)
                  </label>
                  <select id="swFormLicenseType" class="form-control">
                    <option value="Volume License">Volume License (សាលារៀន)</option>
                    <option value="Free / Educational">Free / Educational</option>
                    <option value="Open-Source (Free)">Open-Source (Free)</option>
                    <option value="Commercial Retail">Commercial Retail</option>
                    <option value="Freeware">Freeware</option>
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                  លេខកូដអាជ្ញាប័ណ្ណ (License Key / Product Code)
                </label>
                <input type="text" id="swFormKey" class="form-control font-mono" placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX">
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    ថ្ងៃបានដំឡើង (Install Date)
                  </label>
                  <input type="date" id="swFormInstallDate" class="form-control">
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    ថ្ងៃផុតកំណត់ (Expiry Date)
                  </label>
                  <input type="date" id="swFormExpiryDate" class="form-control">
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    ស្ថានភាពអាប់ដេត (Update Status)
                  </label>
                  <select id="swFormUpdateStatus" class="form-control">
                    <option value="uptodate">ជំនាន់ចុងក្រោយ (Up to date)</option>
                    <option value="update_available">មានកំណែថ្មី (Update Available)</option>
                  </select>
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    ទីតាំងឯកសារ Setup / Link
                  </label>
                  <input type="text" id="swFormSetupPath" class="form-control" placeholder="D:\Setup\Office.iso">
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 14px;">
                <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                  កំណត់ចំណាំ (Notes / Purpose)
                </label>
                <input type="text" id="swFormNotes" class="form-control" placeholder="ព័ត៌មានលម្អិតបន្ថែមអំពីកម្មវិធី...">
              </div>

              <!-- Installed PCs Checklist -->
              <div class="form-group" style="margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <label style="font-weight: 700; font-size: 0.85rem; margin: 0;">
                    <i class="fa-solid fa-desktop text-blue-600"></i> កុំព្យូទ័រដែលបានដំឡើង (Installed PCs)៖
                  </label>
                  <div style="display: flex; gap: 6px;">
                    <button type="button" class="btn-secondary btn-sm" style="font-size: 0.72rem; padding: 2px 8px;" onclick="TimetableLabView.toggleAllSwPcs(true)">ជ្រើសទាំងអស់</button>
                    <button type="button" class="btn-secondary btn-sm" style="font-size: 0.72rem; padding: 2px 8px;" onclick="TimetableLabView.toggleAllSwPcs(false)">ដោះទាំងអស់</button>
                  </div>
                </div>
                <div id="swPcsChecklistGrid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; background: var(--border-light); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                  <!-- Dynamically populated PC-01 to PC-14 -->
                </div>
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn-secondary" data-close-modal="addSoftwareModal">បោះបង់</button>
              <button type="submit" class="btn-primary" style="background: #2563eb; border-color: #2563eb; font-weight: 700;">
                <i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុក</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 12. Modal: Assign Software to PCs Quick Modal -->
      <div id="assignPcsModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 560px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0f766e, #0d9488); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                <i class="fa-solid fa-desktop"></i>
              </span>
              <div>
                <h3 id="assignPcsModalTitle" style="margin: 0; font-size: 1.1rem; color: #fff;">កំណត់ម៉ាស៊ីនសម្រាប់ដំឡើង</h3>
                <p id="assignPcsModalSub" style="margin: 2px 0 0 0; font-size: 0.78rem; color: #99f6e4;">ជ្រើសរើសម៉ាស៊ីនកុំព្យូទ័រដែលមានកម្មវិធីនេះ</p>
              </div>
            </div>
            <button type="button" class="header-close-btn" data-close-modal="assignPcsModal" style="background: none; border: none; color: #ccfbf1; font-size: 1.25rem; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="modal-body" style="padding: 20px;">
            <input type="hidden" id="assignTargetSwId" value="">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">ជ្រើសរើសម៉ាស៊ីនកុំព្យូទ័រ Lab៖</span>
              <div style="display: flex; gap: 6px;">
                <button type="button" class="btn-secondary btn-sm" style="font-size: 0.72rem; padding: 2px 8px;" onclick="TimetableLabView.toggleQuickAssignPcs(true)">ជ្រើសទាំងអស់ (14 គ្រឿង)</button>
                <button type="button" class="btn-secondary btn-sm" style="font-size: 0.72rem; padding: 2px 8px;" onclick="TimetableLabView.toggleQuickAssignPcs(false)">ដោះទាំងអស់</button>
              </div>
            </div>
            <div id="assignQuickPcsGrid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; background: var(--border-light); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color);">
              <!-- Checkboxes PC-01 to PC-14 -->
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between;">
            <button type="button" class="btn-secondary" data-close-modal="assignPcsModal">បោះបង់</button>
            <button type="button" class="btn-primary" style="background: #0d9488; border-color: #0d9488; font-weight: 700;" onclick="TimetableLabView.saveQuickAssignPcs()">
              <i class="fa-solid fa-check"></i> <span>រក្សាទុកការកំណត់</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 13. Modal: Add Lab Practice Exercise Template -->
      <div id="addLabExerciseModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 580px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #4338ca, #6366f1); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                <i class="fa-solid fa-file-arrow-up"></i>
              </span>
              <div>
                <h3 style="margin: 0; font-size: 1.1rem; color: #fff;">បញ្ចូលឯកសារលំហាត់អនុវត្តកុំព្យូទ័ររដ្ឋបាល</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.78rem; color: #c7d2fe;">ចែករំលែកឯកសារគំរូ និងលំហាត់សម្រាប់សិស្សរៀន</p>
              </div>
            </div>
            <button type="button" class="header-close-btn" data-close-modal="addLabExerciseModal" style="background: none; border: none; color: #e0e7ff; font-size: 1.25rem; cursor: pointer;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form id="formLabExercise" onsubmit="event.preventDefault(); TimetableLabView.handleSaveExerciseForm();">
            <input type="hidden" id="exFormId" value="">
            <div class="modal-body" style="padding: 20px;">
              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                  ចំណងជើងលំហាត់ (Exercise Title) <span style="color: #ef4444;">*</span>
                </label>
                <input type="text" id="exFormTitle" class="form-control" placeholder="ឧ. លំហាត់ Excel ០២៖ តារាងលក់ទំនិញ និងវិក្កយបត្រ" required>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    មុខវិជ្ជា (Category)
                  </label>
                  <select id="exFormCategory" class="form-control">
                    <option value="Word">Microsoft Word</option>
                    <option value="Excel">Microsoft Excel</option>
                    <option value="PowerPoint">Microsoft PowerPoint</option>
                    <option value="Typing">Khmer Typing</option>
                  </select>
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                    ប្រភេទឯកសារ (File Type)
                  </label>
                  <select id="exFormFileType" class="form-control">
                    <option value="DOCX">Word Document (.docx)</option>
                    <option value="XLSX">Excel Spreadsheet (.xlsx)</option>
                    <option value="PPTX">PowerPoint Presentation (.pptx)</option>
                    <option value="PDF">PDF Document (.pdf)</option>
                    <option value="TXT">Text File (.txt)</option>
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                  ឈ្មោះឯកសារ (File Name)
                </label>
                <input type="text" id="exFormFileName" class="form-control font-mono" placeholder="Invoice_Template_Exercise.xlsx">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                  ទីតាំងផ្ទុកលើម៉ាស៊ីន (File Path / Shared Folder)
                </label>
                <input type="text" id="exFormFilePath" class="form-control font-mono" placeholder="D:\កិច្ចការសិស្ស_TIS\Exercises\Excel\Lesson02.xlsx">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">
                  វេនសិក្សាគោលដៅ (Target Shift)
                </label>
                <select id="exFormTargetShift" class="form-control">
                  <option value="ALL">-- គ្រប់វេនសិក្សាទាំងអស់ --</option>
                  <option value="ព្រឹក">វេនព្រឹក (08:00 - 09:00)</option>
                  <option value="ថ្ងៃ">វេនថ្ងៃ (15:00 - 16:00)</option>
                  <option value="រសៀល">វេនរសៀល (17:00 - 18:00)</option>
                </select>
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between;">
              <button type="button" class="btn-secondary" data-close-modal="addLabExerciseModal">បោះបង់</button>
              <button type="submit" class="btn-primary" style="background: #4f46e5; border-color: #4f46e5; font-weight: 700;">
                <i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុក</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 14. Modal: Smart Lab Remote Action Confirmation -->
      <div id="smartLabConfirmModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 480px; text-align: center;">
          <div style="padding: 26px 24px 20px 24px;">
            <div id="smartLabConfirmIconBox" style="width: 60px; height: 60px; border-radius: 50%; background: rgba(239, 68, 68, 0.12); color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px auto;">
              <i id="smartLabConfirmIcon" class="fa-solid fa-power-off"></i>
            </div>
            <h3 id="smartLabConfirmTitle" style="margin: 0 0 8px 0; font-size: 1.2rem; font-weight: 700; color: var(--text-main);">
              បញ្ជាក់ការបិទកុំព្យូទ័រទាំងអស់
            </h3>
            <p id="smartLabConfirmMessage" style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.6;">
              តើលោកគ្រូពិតជាចង់បិទ (Shutdown) ម៉ាស៊ីនកុំព្យូទ័រសិស្សទាំងអស់ក្នុង Lab មែនដែរឬទេ?
            </p>
          </div>

          <div class="modal-footer" style="padding: 14px 24px; display: flex; justify-content: center; gap: 12px; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="smartLabConfirmModal" style="min-width: 100px;">បោះបង់</button>
            <button type="button" id="btnSmartLabExecuteConfirm" class="btn-primary" style="background: #dc2626; border-color: #dc2626; font-weight: 700; min-width: 140px;" onclick="TimetableLabView.executeConfirmedSmartCommand()">
              <i class="fa-solid fa-circle-check"></i> <span>យល់ព្រមដំណើរការ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 15. Modal: Send Broadcast Pop-up Message to Student Screens -->
      <div id="sendLabMessageModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 520px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5, #06b6d4); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-comment-dots" style="font-size: 1.25rem;"></i>
              <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff;">ផ្ញើសារ Pop-up ទៅអេក្រង់សិស្ស</h3>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="sendLabMessageModal" style="color: #fff; background: rgba(255,255,255,0.2);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form id="sendLabMessageForm" onsubmit="event.preventDefault(); TimetableLabView.executeSendMessage();">
            <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ផ្ញើទៅកាន់ (Target PCs):</label>
                <select id="msgTargetPcs" class="form-control" style="width: 100%;">
                  <option value="ALL">📢 PC ទាំងអស់ក្នុងបន្ទប់ Lab (PC-01 ដល់ PC-14)</option>
                  <option value="PC-01">PC-01</option>
                  <option value="PC-02">PC-02</option>
                  <option value="PC-03">PC-03</option>
                  <option value="PC-04">PC-04</option>
                  <option value="PC-05">PC-05</option>
                  <option value="PC-06">PC-06</option>
                  <option value="PC-07">PC-07</option>
                  <option value="PC-08">PC-08</option>
                  <option value="PC-09">PC-09</option>
                  <option value="PC-10">PC-10</option>
                  <option value="PC-11">PC-11</option>
                  <option value="PC-12">PC-12</option>
                  <option value="PC-13">PC-13</option>
                  <option value="PC-14">PC-14</option>
                </select>
              </div>

              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ចំណងជើងសារ (Title):</label>
                <input type="text" id="msgTitleInput" class="form-control" value="ដំណឹងពីលោកគ្រូ" required style="width: 100%;">
              </div>

              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ខ្លឹមសារសារ (Message Text):</label>
                <textarea id="msgTextInput" class="form-control" rows="3" placeholder="វាយខ្លឹមសារដែលចង់ឱ្យលោតលើអេក្រង់សិស្ស..." required style="width: 100%;"></textarea>
              </div>

              <div>
                <label class="form-label" style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; display: block;">គំរូសាររហ័ស (Quick Templates):</label>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  <button type="button" class="btn-secondary" style="font-size: 0.76rem; padding: 4px 8px; border-radius: 4px;" onclick="document.getElementById('msgTextInput').value = '⚠️ សល់ ៥ នាទីទៀតត្រូវ Save File ទាំងអស់គ្នា!';">សល់ ៥ នាទីត្រូវ Save</button>
                  <button type="button" class="btn-secondary" style="font-size: 0.76rem; padding: 4px 8px; border-radius: 4px;" onclick="document.getElementById('msgTextInput').value = '🛑 សូមផ្អាកការអនុវត្ត និងងាកមកស្តាប់ការពន្យល់របស់លោកគ្រូ!';">សូមផ្អាកអនុវត្ត</button>
                  <button type="button" class="btn-secondary" style="font-size: 0.76rem; padding: 4px 8px; border-radius: 4px;" onclick="document.getElementById('msgTextInput').value = '📥 ដល់ម៉ោងប្រមូលកិច្ចការហើយ សូមកុំបិទម៉ាស៊ីន!';">ដល់ម៉ោងប្រមូលកិច្ចការ</button>
                </div>
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn-secondary" data-close-modal="sendLabMessageModal">បោះបង់</button>
              <button type="submit" class="btn-primary" style="background: linear-gradient(135deg, #4f46e5, #06b6d4); border: none; font-weight: 700;">
                <i class="fa-solid fa-paper-plane"></i> <span>ផ្ញើសារឥឡូវនេះ</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 16. Modal: Launch Remote Web URL on Student PCs -->
      <div id="launchLabUrlModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 500px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0284c7, #0d9488); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-globe" style="font-size: 1.25rem;"></i>
              <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff;">បញ្ជូន Link វេបសាយឱ្យបើកលើ PC</h3>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="launchLabUrlModal" style="color: #fff; background: rgba(255,255,255,0.2);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form id="launchLabUrlForm" onsubmit="event.preventDefault(); TimetableLabView.executeLaunchUrl();">
            <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">បើកលើ PC (Target):</label>
                <select id="urlTargetPcs" class="form-control" style="width: 100%;">
                  <option value="ALL">🌐 PC ទាំងអស់ក្នុងបន្ទប់ Lab (PC-01 ដល់ PC-14)</option>
                  <option value="PC-01">PC-01</option>
                  <option value="PC-02">PC-02</option>
                  <option value="PC-03">PC-03</option>
                  <option value="PC-04">PC-04</option>
                  <option value="PC-05">PC-05</option>
                  <option value="PC-06">PC-06</option>
                  <option value="PC-07">PC-07</option>
                  <option value="PC-08">PC-08</option>
                  <option value="PC-09">PC-09</option>
                  <option value="PC-10">PC-10</option>
                  <option value="PC-11">PC-11</option>
                  <option value="PC-12">PC-12</option>
                  <option value="PC-13">PC-13</option>
                  <option value="PC-14">PC-14</option>
                </select>
              </div>

              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">អាសយដ្ឋានគេហទំព័រ (URL Link):</label>
                <input type="url" id="remoteUrlInput" class="form-control" placeholder="https://..." required style="width: 100%; font-family: monospace;">
              </div>

              <div>
                <label class="form-label" style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; display: block;">តំណភ្ជាប់គំរូរហ័ស (Quick Links):</label>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <button type="button" class="btn-secondary" style="font-size: 0.8rem; text-align: left; padding: 6px 10px; border-radius: 6px; display: flex; justify-content: space-between;" onclick="document.getElementById('remoteUrlInput').value = 'https://www.typingclub.com';">
                    <span><i class="fa-solid fa-keyboard" style="color: #6366f1;"></i> គេហទំព័រហាត់វាយអត្ថបទ (TypingClub)</span>
                    <span style="color: var(--text-muted); font-size: 0.72rem;">typingclub.com</span>
                  </button>
                  <button type="button" class="btn-secondary" style="font-size: 0.8rem; text-align: left; padding: 6px 10px; border-radius: 6px; display: flex; justify-content: space-between;" onclick="document.getElementById('remoteUrlInput').value = 'https://docs.google.com/forms';">
                    <span><i class="fa-solid fa-clipboard-question" style="color: #0d9488;"></i> Google Forms (ប្រឡង / Quiz Online)</span>
                    <span style="color: var(--text-muted); font-size: 0.72rem;">forms.google.com</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn-secondary" data-close-modal="launchLabUrlModal">បោះបង់</button>
              <button type="submit" class="btn-primary" style="background: linear-gradient(135deg, #0284c7, #0d9488); border: none; font-weight: 700;">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> <span>បើកលើ Browser សិស្ស</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 17. Modal: Showcase Student Screen -->
      <div id="showcasePcModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 480px; text-align: center;">
          <div style="padding: 24px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(245, 158, 11, 0.15); color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px auto;">
              <i class="fa-solid fa-star"></i>
            </div>
            <h3 style="margin: 0 0 8px 0; font-size: 1.2rem; font-weight: 700; color: var(--text-main);">
              បង្ហាញអេក្រង់សិស្សឆ្នើម (Showcase)
            </h3>
            <p style="margin: 0 0 16px 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              ជ្រើសរើសកុំព្យូទ័រសិស្សដែលអនុវត្តបានល្អ ដើម្បីបញ្ចាំងអេក្រង់នោះទៅកាន់ PC ទាំងអស់ក្នុងបន្ទប់រៀន៖
            </p>

            <select id="showcaseSourcePc" class="form-control" style="width: 100%; font-size: 0.95rem; font-weight: 700; padding: 10px; margin-bottom: 8px;">
              <option value="PC-01">PC-01</option>
              <option value="PC-02">PC-02</option>
              <option value="PC-03">PC-03</option>
              <option value="PC-04">PC-04</option>
              <option value="PC-05">PC-05</option>
              <option value="PC-06">PC-06</option>
              <option value="PC-07">PC-07</option>
              <option value="PC-08">PC-08</option>
              <option value="PC-09">PC-09</option>
              <option value="PC-10">PC-10</option>
              <option value="PC-11">PC-11</option>
              <option value="PC-12">PC-12</option>
              <option value="PC-13">PC-13</option>
              <option value="PC-14">PC-14</option>
            </select>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: center; gap: 12px; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="showcasePcModal">បោះបង់</button>
            <button type="button" class="btn-primary" style="background: #d97706; border-color: #d97706; font-weight: 700;" onclick="TimetableLabView.executeShowcaseConfirm()">
              <i class="fa-solid fa-tower-broadcast"></i> <span>ចាប់ផ្តើមបង្ហាញ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 18. Modal: Live Typing Race / Battle Arena -->
      <div id="typingRaceModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 900px; width: 95vw;">
          <div class="modal-header" style="background: linear-gradient(135deg, #1e1b4b, #312e81); color: #fff; padding: 16px 24px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(234, 179, 8, 0.2); color: #eab308; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i class="fa-solid fa-flag-checkered"></i>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #fff;">ការប្រណាំងវាយអត្ថបទផ្សាយផ្ទាល់ (Live Typing Battle 🏎️)</h3>
                <span style="font-size: 0.78rem; color: #c7d2fe;">ការប្រកួតប្រជែងល្បឿនវាយអត្ថបទខ្មែរ-អង់គ្លេសនៃកុំព្យូទ័រទាំង ១៤ គ្រឿង</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="typingRaceModal" style="color: #fff; background: rgba(255,255,255,0.2);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px; background: #0f172a; color: #f8fafc; max-height: 70vh; overflow-y: auto;">
            <!-- Controls Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #1e293b; border-radius: 10px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 0.86rem; font-weight: 600; color: #94a3b8;">ពេលវេលាប្រណាំង៖</span>
                <span id="raceTimerDisplay" style="font-size: 1.3rem; font-weight: 800; color: #38bdf8; font-family: monospace;">05:00</span>
              </div>
              <div style="display: flex; gap: 10px;">
                <button type="button" id="btnStartRace" class="btn-primary" style="background: #16a34a; border-color: #16a34a; font-weight: 700; padding: 6px 14px;" onclick="TimetableLabView.startTypingRace()">
                  <i class="fa-solid fa-play"></i> ចាប់ផ្តើមប្រណាំង
                </button>
                <button type="button" class="btn-secondary" style="padding: 6px 12px; color: #e2e8f0; border-color: #475569;" onclick="TimetableLabView.resetTypingRace()">
                  <i class="fa-solid fa-rotate"></i> Reset
                </button>
              </div>
            </div>

            <!-- Race Tracks for PC-01 to PC-14 -->
            <div id="typingRaceTracksContainer" style="display: flex; flex-direction: column; gap: 8px;">
              <!-- Generated dynamically in TimetableLabView.renderTypingRaceTracks() -->
            </div>
          </div>

          <div class="modal-footer" style="padding: 12px 20px; background: #1e293b; border-top: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; color: #94a3b8;"><i class="fa-solid fa-circle-info"></i> ល្បឿន WPM គណនាជាក់ស្តែងពីការវាយរបស់សិស្ស</span>
            <button type="button" class="btn-secondary" data-close-modal="typingRaceModal" style="color: #e2e8f0; border-color: #475569;">បិទ</button>
          </div>
        </div>
      </div>

      <!-- 19. Modal: Assign Student to Seat (Manual or Claim) -->
      <div id="studentSeatAssignModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-chair" style="font-size: 1.25rem;"></i>
              <h3 id="seatAssignModalTitle" style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff;">កំណត់សិស្សអង្គុយលើ PC-01</h3>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="studentSeatAssignModal" style="color: #fff; background: rgba(255,255,255,0.2);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form id="studentSeatAssignForm" onsubmit="event.preventDefault(); TimetableLabView.saveSeatAssignment();">
            <input type="hidden" id="assignTargetPcId" value="PC-01">
            <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ជ្រើសរើសសិស្ស៖</label>
                <select id="assignStudentSelect" class="form-control" style="width: 100%; font-size: 0.95rem;" required>
                  <option value="">-- សូមជ្រើសរើសសិស្ស --</option>
                  <!-- Populated dynamically -->
                </select>
              </div>
              <div style="background: rgba(79, 70, 229, 0.08); border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: #4338ca; line-height: 1.5;">
                <i class="fa-solid fa-sparkles"></i> ពេលភ្ជាប់សិស្សទៅកៅអីនេះ ប្រព័ន្ធនឹងស្រង់វត្តមានសិស្សនោះជា <b>«មានវត្តមាន»</b> សម្រាប់ថ្ងៃនេះដោយស្វ័យប្រវត្តិ។
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn-secondary" data-close-modal="studentSeatAssignModal">បោះបង់</button>
              <button type="submit" class="btn-primary" style="background: #4f46e5; border-color: #4f46e5; font-weight: 700;">
                <i class="fa-solid fa-check"></i> <span>យល់ព្រមភ្ជាប់កៅអី</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 20. Modal: Pending Online Self-Registrations (សំណើចុះឈ្មោះ Online) -->
      <div id="pendingRegistrationsModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 680px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #059669, #0d9488); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-user-check" style="font-size: 1.25rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff;">សំណើចុះឈ្មោះសិស្សថ្មី Online (Self-Registration)</h3>
                <span style="font-size: 0.78rem; color: #a7f3d0;">ពិនិត្យ និងយល់ព្រម (Approve) ដើម្បីបញ្ចូលជាសិស្សផ្លូវការ</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="pendingRegistrationsModal" style="color: #fff; background: rgba(255,255,255,0.2);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px; max-height: 65vh; overflow-y: auto;">
            <div id="pendingRegistrationsListContainer">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="pendingRegistrationsModal">បិទ</button>
            <button type="button" class="btn-primary" style="background: #0088cc; border-color: #0088cc;" onclick="ModalsComponent.open('selfRegQrModal'); ModalsComponent.initSelfRegQr();">
              <i class="fa-solid fa-qrcode"></i> <span>បង្ហាញ QR ចុះឈ្មោះ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 21. Modal: Self-Registration QR Code Portal (QR Code សម្រាប់សិស្សស្កេនចុះឈ្មោះ) -->
      <div id="selfRegQrModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 480px; text-align: center;">
          <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5, #0088cc); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: center;">
              <i class="fa-solid fa-qrcode" style="font-size: 1.25rem;"></i>
              <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff;">QR Code ចុះឈ្មោះចូលរៀន Online</h3>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="selfRegQrModal" style="color: #fff; background: rgba(255,255,255,0.2);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 24px;">
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 18px;">
              សិស្ស ឬអាណាព្យាបាលអាចស្កេន QR Code នេះដោយទូរស័ព្ទដៃ ដើម្បីបំពេញពាក្យចុះឈ្មោះរៀនដោយខ្លួនឯង ដោយមិនបាច់លោកគ្រូវាយបញ្ចូលដោយដៃឡើយ។
            </p>

            <div style="width: 200px; height: 200px; margin: 0 auto 16px auto; padding: 12px; background: #fff; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.1); border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center;">
              <img id="selfRegQrImg" src="" style="width: 100%; height: 100%; object-fit: contain;" alt="QR Code">
            </div>

            <div style="margin-bottom: 14px;">
              <input type="text" id="selfRegUrlInput" class="form-control text-center font-mono" readonly style="font-size: 0.8rem; background: var(--border-light);">
            </div>

            <button type="button" id="btnCopySelfRegLink" class="btn-secondary" style="width: 100%; justify-content: center; gap: 8px;">
              <i class="fa-solid fa-copy"></i> <span>ចម្លង Link ចុះឈ្មោះ (Copy Link)</span>
            </button>
          </div>

          <div class="modal-footer" style="padding: 12px 20px; display: flex; justify-content: center; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="selfRegQrModal">បិទ</button>
          </div>
        </div>
      </div>

      <!-- 22. Modal: Issue Official A4 School Letter (លិខិតផ្លូវការ ៣ ប្រភេទ) -->
      <div id="officialLettersModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 520px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #1e1b4b, #3b82f6); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-stamp" style="font-size: 1.25rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff;">ចេញលិខិតផ្លូវការរបស់សាលា</h3>
                <span id="officialLetterStudentName" style="font-size: 0.78rem; color: #93c5fd;">សម្រាប់សិស្ស</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="officialLettersModal" style="color: #fff; background: rgba(255,255,255,0.2);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px;">
            <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 16px;">
              ជ្រើសរើសប្រភេទលិខិតផ្លូវការដែលត្រូវចេញជូនសិស្ស។ ប្រព័ន្ធនឹងរៀបចំគំរូ A4 ស្តង់ដារ បោះត្រាសាលា និងហត្ថលេខាលោកគ្រូស្វ័យប្រវត្តិ។
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              <label style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; background: var(--border-light);">
                <input type="radio" name="officialLetterType" value="ENROLLMENT" checked style="margin-top: 3px;">
                <div>
                  <strong style="font-size: 0.92rem; color: var(--text-main);">១. លិខិតបញ្ជាក់ការសិក្សា (Certificate of Enrollment)</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">សម្រាប់សិស្សយកទៅដាក់នៅស្ថាប័នរដ្ឋ ឯកជន ឬសាលាចំណេះទូទៅ</div>
                </div>
              </label>

              <label style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; background: var(--border-light);">
                <input type="radio" name="officialLetterType" value="RECOMMENDATION" style="margin-top: 3px;">
                <div>
                  <strong style="font-size: 0.92rem; color: var(--text-main);">២. លិខិតឧទ្ទេសនាម / ចរិយាសម្បត្តិ (Recommendation Letter)</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">បញ្ជាក់ពីសមត្ថភាពកុំព្យូទ័រ និងចរិយាសម្បត្តិល្អ សម្រាប់សិស្សដាក់ពាក្យធ្វើការ</div>
                </div>
              </label>

              <label style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; background: var(--border-light);">
                <input type="radio" name="officialLetterType" value="SUSPENSION" style="margin-top: 3px;">
                <div>
                  <strong style="font-size: 0.92rem; color: var(--text-main);">៣. លិខិតអនុញ្ញាតព្យួរការសិក្សា (Study Suspension Letter)</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">សម្រាប់សិស្សដែលមានធុរៈចាំបាច់ សុំផ្អាកការសិក្សាជាផ្លូវការមួយរយៈ</div>
                </div>
              </label>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="officialLettersModal">បោះបង់</button>
            <button type="button" id="btnPrintOfficialLetterBtn" class="btn-primary" style="background: #3b82f6; border-color: #3b82f6; font-weight: 700;">
              <i class="fa-solid fa-print"></i> <span>បោះពុម្ពលិខិត A4 ផ្លូវការ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 23. Modal: Quick Switch Shift (ប្តូរវេនសិក្សារហ័ស) -->
      <div id="quickSwitchShiftModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 440px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #d97706, #f59e0b); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-clock-rotate-left" style="font-size: 1.25rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff;">ប្តូរវេនសិក្សា (Change Shift)</h3>
                <span id="quickSwitchShiftStudentName" style="font-size: 0.78rem; color: #fef3c7;"></span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="quickSwitchShiftModal" style="color: #fff; background: rgba(255,255,255,0.2);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form id="quickSwitchShiftForm" onsubmit="event.preventDefault(); ModalsComponent.handleQuickSwitchShiftSubmit();">
            <input type="hidden" id="quickSwitchStudentId" value="">
            <div class="modal-body" style="padding: 20px;">
              <label class="form-label" style="font-weight: 700; margin-bottom: 8px; display: block;">ជ្រើសរើសវេនសិក្សាថ្មី៖</label>
              <select id="quickSwitchNewShift" class="form-control" style="width: 100%; font-size: 0.95rem;" required>
                <option value="ព្រឹក">វេនព្រឹក (08:00 - 09:00)</option>
                <option value="ថ្ងៃ">វេនថ្ងៃ (15:00 - 16:00)</option>
                <option value="រសៀល">វេនរសៀល (17:00 - 18:00)</option>
              </select>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 10px;">
                * ព័ត៌មានវេនសិក្សា និងតារាងវត្តមាននឹងត្រូវធ្វើបច្ចុប្បន្នភាពស្វ័យប្រវត្តិ។
              </div>
            </div>

            <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn-secondary" data-close-modal="quickSwitchShiftModal">បោះបង់</button>
              <button type="submit" class="btn-primary" style="background: #d97706; border-color: #d97706; font-weight: 700;">
                <i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកវេនថ្មី</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 24. Modal: Digital Exam Countdown Timer with Audio Alert & Fullscreen -->
      <div id="examCountdownTimerModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 620px; background: #0f172a; color: #fff; border: 1.5px solid rgba(56, 189, 248, 0.3); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          <div class="modal-header" style="background: linear-gradient(135deg, #1e1b4b, #0f172a); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(56, 189, 248, 0.15); display: flex; align-items: center; justify-content: center; color: #38bdf8;">
                <i class="fa-solid fa-stopwatch" style="font-size: 1.2rem;"></i>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #f8fafc;">នាឡិការាប់ថយក្រោយពេលប្រឡង (Exam Timer)</h3>
                <span style="font-size: 0.78rem; color: #94a3b8;">TIS Lab Computer Digital Countdown Clock</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="examCountdownTimerModal" style="color: #fff; background: rgba(255,255,255,0.1);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 24px; text-align: center;">
            <div style="margin-bottom: 16px;">
              <input type="text" id="examTimerTitleInput" class="form-control" value="ការប្រឡងបញ្ចប់វគ្គកុំព្យូទ័រ (Practical Exam)" style="background: rgba(255,255,255,0.05); color: #fbbf24; border: 1px solid rgba(255,255,255,0.15); text-align: center; font-weight: 700; font-size: 1.05rem;" placeholder="បញ្ចូលចំណងជើងការប្រឡង...">
            </div>

            <!-- Big Digital Display -->
            <div id="examTimerDisplayBox" style="background: #020617; border: 2px solid #38bdf8; border-radius: 16px; padding: 25px 20px; margin-bottom: 20px; box-shadow: 0 0 30px rgba(56, 189, 248, 0.2);">
              <div id="examTimerDigits" style="font-family: 'Plus Jakarta Sans', monospace; font-size: 4.5rem; font-weight: 900; letter-spacing: 4px; color: #38bdf8; text-shadow: 0 0 20px rgba(56, 189, 248, 0.6); line-height: 1;">
                30:00
              </div>
              <div id="examTimerStatusText" style="font-size: 0.85rem; color: #94a3b8; margin-top: 10px; font-weight: 600;">
                <i class="fa-solid fa-circle-pause text-amber-400"></i> កំពុងរង់ចាំការចាប់ផ្តើម
              </div>
            </div>

            <!-- Presets -->
            <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
              <button type="button" class="btn-secondary" onclick="ModalsComponent.setExamTimerMinutes(15)" style="background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.15); font-weight: 700; font-size: 0.85rem;">15 នាទី</button>
              <button type="button" class="btn-secondary" onclick="ModalsComponent.setExamTimerMinutes(30)" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-color: #38bdf8; font-weight: 700; font-size: 0.85rem;">30 នាទី</button>
              <button type="button" class="btn-secondary" onclick="ModalsComponent.setExamTimerMinutes(45)" style="background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.15); font-weight: 700; font-size: 0.85rem;">45 នាទី</button>
              <button type="button" class="btn-secondary" onclick="ModalsComponent.setExamTimerMinutes(60)" style="background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.15); font-weight: 700; font-size: 0.85rem;">60 នាទី</button>
              <button type="button" class="btn-secondary" onclick="ModalsComponent.setExamTimerMinutes(90)" style="background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.15); font-weight: 700; font-size: 0.85rem;">90 នាទី</button>
            </div>

            <!-- Main Control Buttons -->
            <div style="display: flex; justify-content: center; gap: 12px;">
              <button type="button" id="btnToggleExamTimer" onclick="ModalsComponent.toggleExamTimer()" class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); border: none; font-size: 1.1rem; padding: 12px 28px; font-weight: 800; border-radius: 12px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
                <i class="fa-solid fa-play"></i> <span id="btnToggleTimerText">ចាប់ផ្តើម (Start)</span>
              </button>
              <button type="button" onclick="ModalsComponent.resetExamTimer()" class="btn-secondary" style="background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); font-size: 1rem; padding: 12px 20px; font-weight: 700; border-radius: 12px;">
                <i class="fa-solid fa-rotate-left"></i> <span>Reset</span>
              </button>
              <button type="button" onclick="ModalsComponent.toggleExamTimerFullscreen()" class="btn-secondary" style="background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); font-size: 1rem; padding: 12px 18px; border-radius: 12px;" title="ពង្រីកពេញអេក្រង់">
                <i class="fa-solid fa-expand"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 25. Modal: School Expenses & Net Profit Tracker -->
      <div id="schoolExpensesModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 780px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0f172a, #1e1b4b); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-wallet" style="font-size: 1.3rem; color: #10b981;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">ចំណូល ចំណាយ និងប្រាក់ចំណេញសុទ្ធ (Finance Tracker)</h3>
                <span style="font-size: 0.78rem; color: #94a3b8;">TIS Lab Computer Profit & Loss Management</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="schoolExpensesModal" style="color: #fff; background: rgba(255,255,255,0.1);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px;">
            <!-- 3 KPI Cards -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px; text-align: center;">
                <div style="font-size: 0.8rem; color: #166534; font-weight: 700;">ចំណូលប្រមូលបាន (Revenue)</div>
                <div id="expenseModalRevenue" style="font-size: 1.7rem; font-weight: 900; color: #15803d; margin-top: 4px;">$0</div>
              </div>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px; text-align: center;">
                <div style="font-size: 0.8rem; color: #991b1b; font-weight: 700;">ចំណាយសរុប (Expenses)</div>
                <div id="expenseModalExpenses" style="font-size: 1.7rem; font-weight: 900; color: #b91c1c; margin-top: 4px;">$0</div>
              </div>
              <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 14px; text-align: center;">
                <div style="font-size: 0.8rem; color: #3730a3; font-weight: 700;">ចំណេញសុទ្ធ (Net Profit)</div>
                <div id="expenseModalNetProfit" style="font-size: 1.7rem; font-weight: 900; color: #4338ca; margin-top: 4px;">$0</div>
              </div>
            </div>

            <!-- Add Expense Form -->
            <div style="background: var(--bg-surface-hover, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 10px; padding: 14px; margin-bottom: 18px;">
              <div style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px;">
                <i class="fa-solid fa-plus-circle text-emerald-500"></i> កត់ត្រាចំណាយថ្មី (Record New Expense):
              </div>
              <div style="display: grid; grid-template-columns: 2fr 1.2fr 1fr 1fr auto; gap: 8px; align-items: flex-end;">
                <div>
                  <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 3px;">បរិយាយចំណាយ</label>
                  <input type="text" id="newExpenseTitle" class="form-control" placeholder="ឧ. ថ្លៃភ្លើងបន្ទប់ Lab" style="font-size: 0.85rem;">
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 3px;">ប្រភេទ</label>
                  <select id="newExpenseCategory" class="form-control" style="font-size: 0.85rem;">
                    <option value="Electricity">ភ្លើងបន្ទប់ Lab</option>
                    <option value="Internet">អ៊ីនធឺណិត Wi-Fi</option>
                    <option value="Stationery">ក្រដាស & ទឹកថ្នាំ</option>
                    <option value="Hardware">គ្រឿងបន្លាស់ PC</option>
                    <option value="Other">ចំណាយផ្សេងៗ</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 3px;">ចំនួនទឹកប្រាក់ ($)</label>
                  <input type="number" id="newExpenseAmount" class="form-control" placeholder="0" min="0" step="1" style="font-size: 0.85rem; font-weight: 700;">
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 3px;">កាលបរិច្ឆេទ</label>
                  <input type="date" id="newExpenseDate" class="form-control" style="font-size: 0.85rem;">
                </div>
                <div>
                  <button type="button" onclick="ModalsComponent.handleRecordExpenseSubmit()" class="btn-primary" style="height: 38px; padding: 0 14px; font-size: 0.85rem;">
                    <i class="fa-solid fa-check"></i> រក្សាទុក
                  </button>
                </div>
              </div>
            </div>

            <!-- Expenses Table -->
            <div style="max-height: 240px; overflow-y: auto; border: 1px solid var(--border-color, #e2e8f0); border-radius: 8px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                <thead style="background: var(--bg-surface-hover, #f1f5f9); position: sticky; top: 0;">
                  <tr>
                    <th style="padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border-color);">បរិយាយ</th>
                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid var(--border-color);">ប្រភេទ</th>
                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid var(--border-color);">កាលបរិច្ឆេទ</th>
                    <th style="padding: 8px 12px; text-align: right; border-bottom: 1px solid var(--border-color);">ទឹកប្រាក់</th>
                    <th style="padding: 8px; text-align: center; border-bottom: 1px solid var(--border-color); width: 50px;">លុប</th>
                  </tr>
                </thead>
                <tbody id="expenseModalTableBody">
                  <!-- Dynamically rendered -->
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="schoolExpensesModal">បិទ</button>
            <button type="button" onclick="TeacherToolsService.printMonthlyProfitLossStatement()" class="btn-primary" style="background: #4338ca; border-color: #4338ca; font-weight: 700;">
              <i class="fa-solid fa-print"></i> <span>បោះពុម្ពរបាយការណ៍ចំណេញ-ខាត A4</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 26. Modal: 16-PC Lab Hardware & Maintenance Grid -->
      <div id="pcMaintenanceModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 820px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0284c7, #0f172a); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-screwdriver-wrench" style="font-size: 1.3rem; color: #38bdf8;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">ស្ថានភាពម៉ាស៊ីន និងកំណត់ត្រាជួសជុល (16-PC Lab Status)</h3>
                <span style="font-size: 0.78rem; color: #bae6fd;">TIS Lab Computer Hardware Health Check</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="pcMaintenanceModal" style="color: #fff; background: rgba(255,255,255,0.1);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                ចុចលើកុំព្យូទ័រណាមួយដើម្បីកែប្រែស្ថានភាព ឬកត់ត្រាកំណត់សម្គាល់ជួសជុល៖
              </div>
              <div style="display: flex; gap: 12px; font-size: 0.78rem;">
                <span>🟢 ដំណើរការល្អ</span>
                <span>🟡 ត្រូវតាមដាន</span>
                <span>🔴 ខូច/ជួសជុល</span>
              </div>
            </div>

            <!-- 16-PC Grid -->
            <div id="pcMaintenanceGridMount" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
              <!-- Dynamically populated -->
            </div>
          </div>

          <div class="modal-footer" style="padding: 12px 20px; display: flex; justify-content: flex-end; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="pcMaintenanceModal">បិទ</button>
          </div>
        </div>
      </div>

      <!-- 27. Modal: Telegram Cockpit & 3-Group Command Center -->
      <div id="telegramBroadcastModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 900px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 16px; box-shadow: 0 25px 60px rgba(0,0,0,0.55);">
          <!-- Modal Header -->
          <div class="modal-header" style="background: linear-gradient(135deg, #0284c7, #2563eb, #4f46e5); color: #fff; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                <i class="fa-brands fa-telegram"></i>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <h3 style="margin: 0; font-size: 1.22rem; font-weight: 800; color: #fff; letter-spacing: -0.3px;">មជ្ឈមណ្ឌលបញ្ជាគ្រុប Telegram ទាំង ៣</h3>
                  <span id="teleHubStatusBadge" style="font-size: 0.72rem; padding: 3px 8px; border-radius: 20px; font-weight: 700; background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(52, 211, 153, 0.4); color: #a7f3d0; display: inline-flex; align-items: center; gap: 5px;">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 6px #34d399;"></span>
                    <span>Bot ភ្ជាប់ជោគជ័យ</span>
                  </span>
                </div>
                <span style="font-size: 0.78rem; color: #bfdbfe;">TIS Lab Computer • Telegram 3-Shift Automation Cockpit</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="telegramBroadcastModal" style="color: #fff; background: rgba(255,255,255,0.15); border: none; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- 3-Shift Telemetry Status Row -->
          <div style="background: rgba(15, 23, 42, 0.85); border-bottom: 1px solid var(--border-color); padding: 12px 20px; flex-shrink: 0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 10px;">
              <!-- Shift 1: Morning -->
              <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.02)); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; justify-content: space-between; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span style="font-size: 1rem;">🌅</span>
                      <strong style="color: #fbbf24; font-size: 0.86rem;">វេនព្រឹក (08:00 - 09:00)</strong>
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 1px;">រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនព្រឹក</div>
                  </div>
                  <span id="teleHubMorningCount" style="font-size: 0.78rem; font-weight: 800; background: rgba(245, 158, 11, 0.2); color: #fbbf24; padding: 2px 7px; border-radius: 6px;">0 នាក់</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button type="button" onclick="ModalsComponent.handleSendClassBuzz('ព្រឹក')" class="btn-secondary" style="flex: 1; font-size: 0.72rem; padding: 4px 6px; border-color: rgba(245, 158, 11, 0.4); color: #fbbf24; display: flex; align-items: center; justify-content: center; gap: 4px;" title="រោទ៍រំលឹកចូលរៀន ១៥ នាទីមុន">
                    <i class="fa-solid fa-bell"></i> <span>រោទ៍ ១៥នាទី</span>
                  </button>
                  <button type="button" onclick="ModalsComponent.openTelegramHomeworkForShift('ព្រឹក')" class="btn-secondary" style="flex: 1; font-size: 0.72rem; padding: 4px 6px; border-color: rgba(56, 189, 248, 0.4); color: #38bdf8; display: flex; align-items: center; justify-content: center; gap: 4px;" title="ដាក់កិច្ចការផ្ទះវេនព្រឹក">
                    <i class="fa-solid fa-book-open"></i> <span>ដាក់កិច្ចការ</span>
                  </button>
                </div>
              </div>

              <!-- Shift 2: Afternoon -->
              <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(56, 189, 248, 0.02)); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; justify-content: space-between; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span style="font-size: 1rem;">☀️</span>
                      <strong style="color: #38bdf8; font-size: 0.86rem;">វេនរសៀល (14:00 - 16:00)</strong>
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 1px;">រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនរសៀល</div>
                  </div>
                  <span id="teleHubAfternoonCount" style="font-size: 0.78rem; font-weight: 800; background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 2px 7px; border-radius: 6px;">0 នាក់</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button type="button" onclick="ModalsComponent.handleSendClassBuzz('រសៀល')" class="btn-secondary" style="flex: 1; font-size: 0.72rem; padding: 4px 6px; border-color: rgba(56, 189, 248, 0.4); color: #38bdf8; display: flex; align-items: center; justify-content: center; gap: 4px;" title="រោទ៍រំលឹកចូលរៀន ១៥ នាទីមុន">
                    <i class="fa-solid fa-bell"></i> <span>រោទ៍ ១៥នាទី</span>
                  </button>
                  <button type="button" onclick="ModalsComponent.openTelegramHomeworkForShift('រសៀល')" class="btn-secondary" style="flex: 1; font-size: 0.72rem; padding: 4px 6px; border-color: rgba(56, 189, 248, 0.4); color: #38bdf8; display: flex; align-items: center; justify-content: center; gap: 4px;" title="ដាក់កិច្ចការផ្ទះវេនរសៀល">
                    <i class="fa-solid fa-book-open"></i> <span>ដាក់កិច្ចការ</span>
                  </button>
                </div>
              </div>

              <!-- Shift 3: Night -->
              <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(168, 85, 247, 0.02)); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; justify-content: space-between; gap: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span style="font-size: 1rem;">🌙</span>
                      <strong style="color: #c084fc; font-size: 0.86rem;">វេនយប់ (17:00 - 18:00)</strong>
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 1px;">រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនយប់ ម៉ោង៥-៦</div>
                  </div>
                  <span id="teleHubNightCount" style="font-size: 0.78rem; font-weight: 800; background: rgba(168, 85, 247, 0.2); color: #c084fc; padding: 2px 7px; border-radius: 6px;">0 នាក់</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button type="button" onclick="ModalsComponent.handleSendClassBuzz('យប់')" class="btn-secondary" style="flex: 1; font-size: 0.72rem; padding: 4px 6px; border-color: rgba(168, 85, 247, 0.4); color: #c084fc; display: flex; align-items: center; justify-content: center; gap: 4px;" title="រោទ៍រំលឹកចូលរៀន ១៥ នាទីមុន">
                    <i class="fa-solid fa-bell"></i> <span>រោទ៍ ១៥នាទី</span>
                  </button>
                  <button type="button" onclick="ModalsComponent.openTelegramHomeworkForShift('យប់')" class="btn-secondary" style="flex: 1; font-size: 0.72rem; padding: 4px 6px; border-color: rgba(56, 189, 248, 0.4); color: #38bdf8; display: flex; align-items: center; justify-content: center; gap: 4px;" title="ដាក់កិច្ចការផ្ទះវេនយប់">
                    <i class="fa-solid fa-book-open"></i> <span>ដាក់កិច្ចការ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <div style="display: flex; overflow-x: auto; background: var(--bg-surface); border-bottom: 1px solid var(--border-color); padding: 0 16px; gap: 4px; flex-shrink: 0;">
            <button type="button" class="tele-hub-tab active" data-tab="buzz" onclick="ModalsComponent.switchTelegramHubTab('buzz')">
              <i class="fa-solid fa-bell text-amber-400"></i> <span>រោទ៍ចូលរៀន (15m Buzz)</span>
            </button>
            <button type="button" class="tele-hub-tab" data-tab="hw" onclick="ModalsComponent.switchTelegramHubTab('hw')">
              <i class="fa-solid fa-book-open text-sky-400"></i> <span>កិច្ចការផ្ទះ (Homework)</span>
            </button>
            <button type="button" class="tele-hub-tab" data-tab="emergency" onclick="ModalsComponent.switchTelegramHubTab('emergency')">
              <i class="fa-solid fa-triangle-exclamation text-rose-400"></i> <span>ប្រកាសបន្ទាន់ (Emergency)</span>
            </button>
            <button type="button" class="tele-hub-tab" data-tab="exams" onclick="ModalsComponent.switchTelegramHubTab('exams')">
              <i class="fa-solid fa-award text-purple-400"></i> <span>លទ្ធផលប្រឡង & TOP 3</span>
            </button>
            <button type="button" class="tele-hub-tab" data-tab="custom" onclick="ModalsComponent.switchTelegramHubTab('custom')">
              <i class="fa-solid fa-bullhorn text-emerald-400"></i> <span>ដំណឹងទូទៅ (Custom)</span>
            </button>
            <button type="button" class="tele-hub-tab" data-tab="cheatsheet" onclick="ModalsComponent.switchTelegramHubTab('cheatsheet')">
              <i class="fa-solid fa-robot text-teal-400"></i> <span>តុសេវា & បញ្ជា Bot</span>
            </button>
          </div>

          <!-- Body with Panels -->
          <div class="modal-body" style="padding: 18px 24px; overflow-y: auto; flex: 1;">
            <!-- 1. Panel: Buzz -->
            <div id="telePanel-buzz" class="tele-hub-panel active">
              <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 12px; padding: 14px 18px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <i class="fa-solid fa-bell text-amber-400" style="font-size: 1.1rem;"></i>
                  <strong style="color: #fbbf24; font-size: 0.95rem;">រោទ៍រំលឹកសិស្សចូលរៀន ១៥ នាទីមុនម៉ោង (Class Buzz)</strong>
                </div>
                <p style="margin: 0; font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                  សារស្វ័យប្រវត្តិនេះនឹងរំលឹកប្អូនៗសិស្សានុសិស្សឲ្យប្រញាប់មកបន្ទប់ Lab កុំព្យូទ័រ កុំភ្លេចយក Flash Drive (USB) និងសៀវភៅមកជាមួយ។ ព្រមទាំងផ្តល់ការណែនាំពីការសុំច្បាប់ <code>/leave [ID] [មូលហេតុ]</code> ប្រសិនបើមានធុរៈចាំបាច់។
                </p>
              </div>

              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ជ្រើសរើសវេនសិក្សាគោលដៅ៖</label>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px;">
                  <button type="button" class="btn-primary" onclick="ModalsComponent.handleSendClassBuzz('ព្រឹក')" style="background: linear-gradient(135deg, #d97706, #b45309); border: none; padding: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>🌅 រោទ៍វេនព្រឹក (08:00)</span>
                  </button>
                  <button type="button" class="btn-primary" onclick="ModalsComponent.handleSendClassBuzz('រសៀល')" style="background: linear-gradient(135deg, #0284c7, #0369a1); border: none; padding: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>☀️ រោទ៍វេនរសៀល (14:00)</span>
                  </button>
                  <button type="button" class="btn-primary" onclick="ModalsComponent.handleSendClassBuzz('យប់')" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); border: none; padding: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>🌙 រោទ៍វេនយប់ (17:00)</span>
                  </button>
                  <button type="button" class="btn-primary" onclick="ModalsComponent.handleSendClassBuzz('ALL')" style="background: linear-gradient(135deg, #10b981, #059669); border: none; padding: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>📢 រោទ៍គ្រប់គ្រុបទាំង ៣</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 2. Panel: Homework Dispatcher -->
            <div id="telePanel-hw" class="tele-hub-panel">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">វេនសិក្សាគោលដៅ៖</label>
                  <select id="teleHwTargetShift" class="form-control" style="width: 100%;">
                    <option value="ALL">📢 គ្រប់គ្រុបទាំង ៣ (ព្រឹក • រសៀល • យប់)</option>
                    <option value="ព្រឹក">🌅 វេនព្រឹក (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)</option>
                    <option value="រសៀល">☀️ វេនរសៀល (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន)</option>
                    <option value="យប់">🌙 វេនយប់ (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន ម៉ោង ៥-៦)</option>
                  </select>
                </div>
                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">មុខវិជ្ជា/វគ្គសិក្សា៖</label>
                  <select id="teleHwCourseSelect" class="form-control" style="width: 100%;" onchange="ModalsComponent.applyTelegramHomeworkPreset(this.value)">
                    <option value="Typing">⌨️ វគ្គទី ១: Typing (វាយអត្ថបទខ្មែរ-អង់គ្លេស)</option>
                    <option value="Microsoft Word">📄 វគ្គទី ២: Microsoft Word (លិខិត & តារាង)</option>
                    <option value="Microsoft Excel">📊 វគ្គទី ៣: Microsoft Excel (រូបមន្ត & គណនេយ្យ)</option>
                    <option value="Microsoft PowerPoint">📑 វគ្គទី ៤: Microsoft PowerPoint (ស្លាយបទបង្ហាញ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                  <span>គំរូកិច្ចការរហ័ស (Quick Presets):</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">ចុចដើម្បីបំពេញស្វ័យប្រវត្ត</span>
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  <button type="button" class="btn-secondary" style="font-size: 0.74rem; padding: 4px 8px;" onclick="ModalsComponent.applyTelegramHomeworkPreset('Typing')">⌨️ Typing 25 WPM</button>
                  <button type="button" class="btn-secondary" style="font-size: 0.74rem; padding: 4px 8px;" onclick="ModalsComponent.applyTelegramHomeworkPreset('Microsoft Word')">📄 Word តារាង A4</button>
                  <button type="button" class="btn-secondary" style="font-size: 0.74rem; padding: 4px 8px;" onclick="ModalsComponent.applyTelegramHomeworkPreset('Microsoft Excel')">📊 Excel SUM, IF, RANK</button>
                  <button type="button" class="btn-secondary" style="font-size: 0.74rem; padding: 4px 8px;" onclick="ModalsComponent.applyTelegramHomeworkPreset('Microsoft PowerPoint')">📑 PPT 5 Slides បទបង្ហាញ</button>
                </div>
              </div>

              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ប្រធានបទកិច្ចការផ្ទះ៖</label>
                <input type="text" id="teleHwTitleInput" class="form-control" value="លំហាត់អនុវត្តកុំព្យូទ័រប្រចាំថ្ងៃ" required>
              </div>

              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ខ្លឹមសារ និងការណែនាំលម្អិត៖</label>
                <textarea id="teleHwContentInput" class="form-control" rows="4" required></textarea>
              </div>

              <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 10px 14px; font-size: 0.78rem; color: #7dd3fc; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-circle-info" style="font-size: 1.1rem;"></i>
                <span>💡 ពេលផ្សាយរួច ប្រព័ន្ធនឹងកត់ត្រាទុកក្នុង Telegram Bot ដោយស្វ័យប្រវត្តិ។ សិស្សអាចវាយ <code>/hw</code> ឬ <code>/កិច្ចការផ្ទះ</code> ក្នុងគ្រុបដើម្បីមើលឡើងវិញគ្រប់ពេល!</span>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px;">
                <button type="button" onclick="ModalsComponent.handleSendHomeworkSubmit()" class="btn-primary" style="background: linear-gradient(135deg, #0284c7, #2563eb); border: none; font-weight: 700; padding: 10px 20px;">
                  <i class="fa-solid fa-paper-plane"></i> <span>ផ្សាយកិច្ចការផ្ទះ & រក្សាទុកក្នុង Bot</span>
                </button>
              </div>
            </div>

            <!-- 3. Panel: Emergency & Reschedule -->
            <div id="telePanel-emergency" class="tele-hub-panel">
              <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 12px 16px;">
                <strong style="color: #f87171; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-triangle-exclamation"></i> ដំណឹងបន្ទាន់ ផ្អាកការសិក្សា ឬផ្លាស់ប្តូរម៉ោងរៀន
                </strong>
                <p style="margin: 4px 0 0 0; font-size: 0.78rem; color: var(--text-muted);">
                  ផ្ញើសេចក្តីជូនដំណឹងជាបន្ទាន់ចូលគ្រុប Telegram ក្នុងករណីមានភ្លៀងធ្លាក់ខ្លាំង ជន់លិច ដាច់ចរន្តអគ្គិសនី ឬត្រូវការប្តូរម៉ោងរៀន។
                </p>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">វេនសិក្សាគោលដៅ៖</label>
                  <select id="teleEmergencyTargetShift" class="form-control" style="width: 100%;">
                    <option value="ALL">📢 គ្រប់គ្រុបទាំង ៣ (ព្រឹក • រសៀល • យប់)</option>
                    <option value="ព្រឹក">🌅 វេនព្រឹក</option>
                    <option value="រសៀល">☀️ វេនរសៀល</option>
                    <option value="យប់">🌙 វេនយប់ (ម៉ោង ៥-៦)</option>
                  </select>
                </div>
                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ប្រភេទដំណឹងបន្ទាន់៖</label>
                  <select id="teleEmergencyTypeSelect" class="form-control" style="width: 100%;">
                    <option value="RAIN">🌧️ ភ្លៀងធ្លាក់ខ្លាំង / ផ្លូវជន់លិច (ផ្អាក ១ ពេល)</option>
                    <option value="POWER">⚡ ដាច់ចរន្តអគ្គិសនី Lab (ផ្អាកបណ្តោះអាសន្ន)</option>
                    <option value="RESCHEDULE">⏰ ពន្យារពេល / ផ្លាស់ប្តូរម៉ោងរៀន</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">កំណត់សម្គាល់បន្ថែម ឬម៉ោងចូលរៀនថ្មី៖</label>
                <input type="text" id="teleEmergencyDetailInput" class="form-control" placeholder="ឧ. ពន្យារពេលចូលរៀន ៣០នាទី មកម៉ោង ០២:៣០ រសៀល" value="សូមប្អូនៗសិស្សានុសិស្សសម្រាកមួយពេលដើម្បីសុវត្ថិភាព ថ្នាក់រៀននឹងបើកជាធម្មតាវិញនៅថ្ងៃស្អែក។">
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px;">
                <button type="button" onclick="ModalsComponent.handleSendEmergencySubmit()" class="btn-primary" style="background: linear-gradient(135deg, #dc2626, #b91c1c); border: none; font-weight: 700; padding: 10px 20px;">
                  <i class="fa-solid fa-triangle-exclamation"></i> <span>ផ្សាយដំណឹងបន្ទាន់ទៅ Telegram</span>
                </button>
              </div>
            </div>

            <!-- 4. Panel: Exams & Top 3 -->
            <div id="telePanel-exams" class="tele-hub-panel">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">មុខវិជ្ជាប្រឡង៖</label>
                  <select id="teleExamCourseSelect" class="form-control" style="width: 100%;">
                    <option value="Typing">⌨️ វគ្គទី ១: Typing (វាយអត្ថបទ)</option>
                    <option value="Microsoft Word">📄 វគ្គទី ២: Word (ឯកសារ)</option>
                    <option value="Microsoft Excel">📊 វគ្គទី ៣: Excel (តារាងគណនា)</option>
                    <option value="Microsoft PowerPoint">📑 វគ្គទី ៤: PowerPoint (បទបង្ហាញ)</option>
                  </select>
                </div>
                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">វេនសិក្សាគោលដៅ៖</label>
                  <select id="teleExamTargetShift" class="form-control" style="width: 100%;">
                    <option value="ALL">📢 គ្រប់គ្រុបទាំង ៣ (ព្រឹក • រសៀល • យប់)</option>
                    <option value="ព្រឹក">🌅 វេនព្រឹក</option>
                    <option value="រសៀល">☀️ វេនរសៀល</option>
                    <option value="យប់">🌙 វេនយប់ (ម៉ោង ៥-៦)</option>
                  </select>
                </div>
              </div>

              <div style="background: rgba(147, 51, 234, 0.08); border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 12px; padding: 14px 18px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <i class="fa-solid fa-trophy text-amber-400" style="font-size: 1.1rem;"></i>
                  <strong style="color: #c084fc; font-size: 0.95rem;">ជម្រើសផ្សាយលទ្ធផលប្រឡងបញ្ចប់វគ្គ</strong>
                </div>
                <p style="margin: 0; font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
                  លោកគ្រូអាចជ្រើសរើសផ្សាយ <b>«តារាងពិន្ទុ និងអត្រាជាប់»</b> ឬ <b>«ផ្ទាំងកិត្តិយសសិស្សឆ្នើម TOP 3»</b> ចូលគ្រុប Telegram ដើម្បីលើកទឹកចិត្តសិស្សានុសិស្ស។
                </p>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-top: 6px;">
                <button type="button" onclick="ModalsComponent.handleSendExamBroadcastSubmit()" class="btn-primary" style="background: linear-gradient(135deg, #0284c7, #06b6d4); border: none; padding: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <i class="fa-brands fa-telegram"></i> <span>📢 ផ្សាយតារាងពិន្ទុ & និទ្ទេស</span>
                </button>
                <button type="button" onclick="ModalsComponent.handleBroadcastTop3FromHub()" class="btn-primary" style="background: linear-gradient(135deg, #b45309, #f59e0b); border: none; padding: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <i class="fa-solid fa-trophy"></i> <span>🏆 ផ្សាយ TOP 3 កិត្តិយស</span>
                </button>
                <button type="button" onclick="ModalsComponent.handlePrintTop3PosterFromHub()" class="btn-secondary" style="border-color: rgba(245, 158, 11, 0.4); color: #fbbf24; padding: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <i class="fa-solid fa-print"></i> <span>🖨️ បង្កើត Poster A4 TOP 3</span>
                </button>
              </div>
            </div>

            <!-- 5. Panel: Custom Broadcast -->
            <div id="telePanel-custom" class="tele-hub-panel">
              <form id="telegramBroadcastForm" onsubmit="event.preventDefault(); ModalsComponent.handleTelegramBroadcastSubmit();" style="display: flex; flex-direction: column; gap: 14px;">
                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">វេនសិក្សាគោលដៅ (Target Shift):</label>
                  <select id="broadcastTargetShift" class="form-control" style="width: 100%;">
                    <option value="ALL">📢 គ្រប់គ្រុបទាំង ៣ (ព្រឹក • រសៀល • យប់)</option>
                    <option value="ព្រឹក">🌅 គ្រុបវេនព្រឹក (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនព្រឹក)</option>
                    <option value="រសៀល">☀️ គ្រុបវេនរសៀល (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនរសៀល)</option>
                    <option value="យប់">🌙 គ្រុបវេនយប់ (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនយប់ ម៉ោង៥-៦)</option>
                  </select>
                </div>

                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">គំរូសាររហ័ស (Quick Templates):</label>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    <button type="button" class="btn-secondary" style="font-size: 0.76rem; padding: 5px 9px;" onclick="ModalsComponent.applyBroadcastTemplate('HOLIDAY')">🎉 ដំណឹងឈប់សម្រាក</button>
                    <button type="button" class="btn-secondary" style="font-size: 0.76rem; padding: 5px 9px;" onclick="ModalsComponent.applyBroadcastTemplate('EXAM')">📝 កាលវិភាគប្រឡង</button>
                    <button type="button" class="btn-secondary" style="font-size: 0.76rem; padding: 5px 9px;" onclick="ModalsComponent.applyBroadcastTemplate('USB')">💾 យក Flash Drive មក</button>
                    <button type="button" class="btn-secondary" style="font-size: 0.76rem; padding: 5px 9px;" onclick="ModalsComponent.applyBroadcastTemplate('PRACTICE')">🚀 ម៉ោងអនុវត្តសេរី</button>
                  </div>
                </div>

                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ចំណងជើងសេចក្តីជូនដំណឹង:</label>
                  <input type="text" id="broadcastTitleInput" class="form-control" value="សេចក្តីជូនដំណឹងពី TIS Lab Computer" required>
                </div>

                <div>
                  <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ខ្លឹមសារសេចក្តីជូនដំណឹង:</label>
                  <textarea id="broadcastContentInput" class="form-control" rows="4" placeholder="វាយខ្លឹមសារសេចក្តីជូនដំណឹងនៅទីនេះ..." required></textarea>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                  <button type="submit" class="btn-primary" style="background: #2563eb; border-color: #2563eb; font-weight: 700; padding: 10px 20px;">
                    <i class="fa-solid fa-paper-plane"></i> <span>ផ្សាយដំណឹងទៅ Telegram</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- 6. Panel: Cheatsheet & Student Desk -->
            <div id="telePanel-cheatsheet" class="tele-hub-panel">
              <div style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(16, 185, 129, 0.1)); border: 1.5px solid rgba(14, 165, 233, 0.3); border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                  <strong style="color: #38bdf8; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-clipboard-list"></i> តុសេវាសិស្សឌីជីថល (Digital Student Desk Announcement)
                  </strong>
                  <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: var(--text-muted);">
                    ផ្ញើមគ្គុទ្ទេសក៍ណែនាំសុំច្បាប់ <code>/leave</code> និងការប្រើប្រាស់ Bot ចូលក្នុងគ្រុបទាំង ៣
                  </p>
                </div>
                <button type="button" onclick="ModalsComponent.handleSendDeskAnnouncement()" class="btn-primary" style="background: linear-gradient(135deg, #0284c7, #10b981); border: none; font-weight: 700; padding: 8px 16px; font-size: 0.84rem;">
                  <i class="fa-solid fa-paper-plane"></i> <span>ផ្សាយតុសេវាចូលគ្រុប</span>
                </button>
              </div>

              <div>
                <strong style="font-size: 0.88rem; color: var(--text-main); margin-bottom: 8px; display: block;">
                  🤖 បញ្ជាស្វ័យប្រវត្តដែលសិស្សអាចប្រើបានក្នុងគ្រុប Telegram (Student Self-Service Commands):
                </strong>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <span class="tele-cmd-chip">/leave [ID] [មូលហេតុ]</span>
                      <span style="font-size: 0.82rem; color: var(--text-main); margin-left: 8px;">សុំច្បាប់ផ្ទាល់ (Bot នឹងកត់ត្រា <b>«មានច្បាប់»</b> ក្នុងប្រព័ន្ធ Auto)</span>
                    </div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);">ឧ. <code>/leave TX01 ឈឺក្បាល</code></span>
                  </div>

                  <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <span class="tele-cmd-chip">/score [ID]</span>
                      <span style="font-size: 0.82rem; color: var(--text-main); margin-left: 8px;">ឆែកពិន្ទុ និងនិទ្ទេសប្រឡងបញ្ចប់វគ្គទាំង ៤ (Typing, Word, Excel, PPT)</span>
                    </div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);">ឧ. <code>/score TX01</code></span>
                  </div>

                  <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <span class="tele-cmd-chip">/att [ID]</span>
                      <span style="font-size: 0.82rem; color: var(--text-main); margin-left: 8px;">ឆែកអត្រាវត្តមាន ភាគរយ និងរបារពណ៌បៃតង 🟩🟩🟩🟩⬜</span>
                    </div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);">ឧ. <code>/att TX01</code></span>
                  </div>

                  <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <span class="tele-cmd-chip">/hw</span>
                      <span style="font-size: 0.82rem; color: var(--text-main); margin-left: 8px;">មើលកិច្ចការផ្ទះ និងលំហាត់អនុវត្តកុំព្យូទ័រចុងក្រោយ</span>
                    </div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);">វាយ <code>/hw</code> ឬ <code>/កិច្ចការផ្ទះ</code></span>
                  </div>

                  <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <span class="tele-cmd-chip">/info [ID]</span>
                      <span style="font-size: 0.82rem; color: var(--text-main); margin-left: 8px;">មើលព័ត៌មានផ្ទាល់ខ្លួន លេខទូរស័ព្ទ និងវគ្គកំពុងរៀន</span>
                    </div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);">ឧ. <code>/info TX01</code></span>
                  </div>

                  <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <span class="tele-cmd-chip">/schedule</span>
                      <span style="font-size: 0.82rem; color: var(--text-main); margin-left: 8px;">មើលកាលវិភាគម៉ោងរៀនគ្រប់វេន (ព្រឹក • រសៀល • យប់)</span>
                    </div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);">វាយ <code>/schedule</code></span>
                  </div>

                  <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <span class="tele-cmd-chip">/holiday</span>
                      <span style="font-size: 0.82rem; color: var(--text-main); margin-left: 8px;">ឆែកកាលវិភាគថ្ងៃឈប់សម្រាកបុណ្យជាតិបន្ទាប់</span>
                    </div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);">វាយ <code>/holiday</code></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer" style="padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); background: rgba(15, 23, 42, 0.4);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              <i class="fa-solid fa-shield-halved text-emerald-400"></i> ប្រព័ន្ធ Telegram Bot ដំណើរការស្វ័យប្រវត្តិតាមពេលវេលាជាក់ស្តែង (Real-time)
            </div>
            <button type="button" class="btn-secondary" data-close-modal="telegramBroadcastModal" style="padding: 6px 16px;">បិទ</button>
          </div>
        </div>
      </div>

      <!-- 28. Modal: Top 3 Honor Roll Poster Generator -->
      <div id="top3HonorRollModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 520px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #b45309, #f59e0b); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-trophy" style="font-size: 1.3rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">ផ្ទាំងកិត្តិយសសិស្សឆ្នើម TOP 3</h3>
                <span style="font-size: 0.78rem; color: #fef3c7;">Honor Roll Poster Generator</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="top3HonorRollModal" style="color: #fff; background: rgba(255,255,255,0.1);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ជ្រើសរើសវគ្គសិក្សា (Course Module):</label>
              <select id="top3ModuleSelect" class="form-control" style="width: 100%;">
                <option value="Microsoft Word">Microsoft Word</option>
                <option value="Microsoft Excel">Microsoft Excel</option>
                <option value="Microsoft PowerPoint">Microsoft PowerPoint</option>
                <option value="Typing">Khmer Typing</option>
              </select>
            </div>

            <div>
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ជ្រើសរើសវេនសិក្សា (Shift):</label>
              <select id="top3ShiftSelect" class="form-control" style="width: 100%;">
                <option value="ALL">📢 គ្រប់វេនទាំងអស់ (All Shifts)</option>
                <option value="ព្រឹក">🌅 វេនព្រឹក (08:00 - 09:00)</option>
                <option value="រសៀល">☀️ វេនរសៀល (14:00 - 16:00)</option>
                <option value="យប់">🌙 វេនយប់ (17:00 - 18:00)</option>
              </select>
            </div>

            <div style="background: var(--bg-surface-hover, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 8px; padding: 12px; font-size: 0.82rem; color: var(--text-muted); line-height: 1.6;">
              <i class="fa-solid fa-circle-info text-blue-500"></i> ប្រព័ន្ធនឹងគណនាពិន្ទុប្រឡងខ្ពស់ជាងគេទាំង ៣ នាក់ រួមទាំងរូបថត អត្តលេខ និងពិន្ទុ ដើម្បីបង្កើតផ្ទាំងរូបភាព A4 ពណ៌ប្រណិតត្រៀមបោះពុម្ព ឬផ្សាយផ្ទាល់ចូលគ្រុប Telegram តាមវេន។
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
            <button type="button" class="btn-secondary" data-close-modal="top3HonorRollModal">បិទ</button>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button type="button" onclick="ModalsComponent.handleBroadcastTop3ToTelegram()" class="btn-primary" style="background: linear-gradient(135deg, #0284c7, #06b6d4); border: none; font-weight: 700; color: #fff;">
                <i class="fa-brands fa-telegram"></i> <span>ផ្សាយ TOP 3 ទៅ Telegram</span>
              </button>
              <button type="button" onclick="ModalsComponent.handlePrintTop3Poster()" class="btn-primary" style="background: #f59e0b; border-color: #d97706; font-weight: 700; color: #000;">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ពផ្ទាំង A4</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 29. Modal: Practical Exercise Bank Handout Library -->
      <div id="exerciseLibraryModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 720px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #3730a3, #4f46e5); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-book-open-reader" style="font-size: 1.3rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">បណ្ណាល័យវិញ្ញាសាអនុវត្តជាក់ស្តែង (Practical Exercises)</h3>
                <span style="font-size: 0.78rem; color: #c7d2fe;">TIS Lab Computer Ready-to-Print Handouts</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="exerciseLibraryModal" style="color: #fff; background: rgba(255,255,255,0.1);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px;">
            <div id="exerciseLibraryListMount" style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto;">
              <!-- Populated by ModalsComponent.renderExerciseLibraryList() -->
            </div>
          </div>

          <div class="modal-footer" style="padding: 12px 20px; display: flex; justify-content: flex-end; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="exerciseLibraryModal">បិទ</button>
          </div>
        </div>
      </div>

      <!-- 30. Modal: Student Progress & Observation Notes -->
      <div id="studentNotesModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 540px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0d9488, #14b8a6); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-note-sticky" style="font-size: 1.3rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">កំណត់ត្រាការសង្កេតសិស្ស (Teacher Notes)</h3>
                <span id="studentNotesTargetName" style="font-size: 0.78rem; color: #ccfbf1;">សម្រាប់សិស្ស</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="studentNotesModal" style="color: #fff; background: rgba(255,255,255,0.1);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <input type="hidden" id="studentNotesTargetId" value="">

            <div>
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">បន្ថែមចំណាំថ្មី៖</label>
              <textarea id="newStudentNoteInput" class="form-control" rows="3" placeholder="ឧ. សិស្សរៀនរូបមន្ត Excel VLOOKUP បានរហ័ស តែត្រូវពង្រឹងការវាយអក្សរខ្មែរបន្ថែម..." style="width: 100%;"></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="button" onclick="ModalsComponent.handleSaveStudentNote()" class="btn-primary" style="background: #0d9488; border-color: #0d9488; font-weight: 700;">
                <i class="fa-solid fa-floppy-disk"></i> រក្សាទុកកំណត់ត្រា
              </button>
            </div>

            <div style="border-top: 1px solid var(--border-color); padding-top: 12px;">
              <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">ប្រវត្តិកំណត់ត្រាកន្លងមក៖</div>
              <div id="studentNotesListMount" style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
                <!-- Populated dynamically -->
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding: 12px 20px; display: flex; justify-content: flex-end; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="studentNotesModal">បិទ</button>
          </div>
        </div>
      </div>

      <!-- 31. Modal: Smart Classroom HUD on Projector (Live Arena with Lucky Wheel & Soundboard) -->
      <div id="classroomHudModal" class="modal-overlay">
        <div class="modal-card classroom-hud-card" style="max-width: 950px; width: 95%; max-height: 92vh; overflow-y: auto;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0f172a, #1e1b4b); border-bottom: 1.5px solid rgba(56, 189, 248, 0.25); padding: 16px 24px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(56, 189, 248, 0.2); display: flex; align-items: center; justify-content: center; color: #38bdf8; font-size: 1.3rem;">
                <i class="fa-solid fa-chalkboard-user"></i>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #f8fafc;">ផ្ទាំងគ្រប់គ្រងថ្នាក់រៀន Projector (Smart Classroom HUD)</h3>
                <span style="font-size: 0.78rem; color: #94a3b8;">TIS Lab Computer Interactive Teaching Arena</span>
              </div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button type="button" onclick="ModalsComponent.toggleHudFullscreen()" class="btn-secondary" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; font-size: 0.8rem; border-radius: 8px;" title="ពង្រីកពេញអេក្រង់">
                <i class="fa-solid fa-expand"></i> Fullscreen
              </button>
              <button type="button" class="btn-close-modal" data-close-modal="classroomHudModal" style="color: #fff; background: rgba(255,255,255,0.1);"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>

          <div class="modal-body" style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
            <!-- Top Controls Row: Today Goal & Shift -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 16px;">
              <div>
                <label style="font-size: 0.8rem; color: #38bdf8; font-weight: 800; display: block; margin-bottom: 6px; text-transform: uppercase;">
                  🎯 ប្រធានបទ និងគោលដៅមេរៀនថ្ងៃនេះ (Today's Lesson Goal):
                </label>
                <input type="text" id="hudLessonGoalInput" class="form-control" value="មេរៀន Excel ០៤៖ រូបមន្ត VLOOKUP គណនាវិក្កយបត្រស្វ័យប្រវត្ត" style="background: rgba(15,23,42,0.8); border: 1.5px solid rgba(56,189,248,0.4); color: #fbbf24; font-size: 1.05rem; font-weight: 700;">
              </div>
              <div>
                <label style="font-size: 0.8rem; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 6px;">
                  វេនសិក្សាបច្ចុប្បន្ន (Active Shift):
                </label>
                <select id="hudShiftSelect" class="form-control" onchange="ModalsComponent.refreshHudShiftStudents()" style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 0.95rem; font-weight: 700;">
                  <option value="ព្រឹក">🌅 វេនព្រឹក (08:00 - 09:00)</option>
                  <option value="ថ្ងៃ">☀️ វេនថ្ងៃ (15:00 - 16:00)</option>
                  <option value="រសៀល">🌇 វេនរសៀល (17:00 - 18:00)</option>
                </select>
              </div>
            </div>

            <!-- Main Interactive Arena (Soundboard + Lucky Wheel) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <!-- Left: Soundboard & Attention Banner -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #f8fafc; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-volume-high text-amber-400"></i>
                    <span>ក្តារសំឡេងក្នុងថ្នាក់ (Classroom Soundboard):</span>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px;">
                    <button type="button" onclick="TeacherToolsService.playSoundEffect('applause')" class="soundboard-btn applause">
                      <span>👏 ទះដៃអបអរ</span>
                    </button>
                    <button type="button" onclick="TeacherToolsService.playSoundEffect('bell')" class="soundboard-btn bell">
                      <span>🔔 កណ្ដឹងសាលា</span>
                    </button>
                    <button type="button" onclick="TeacherToolsService.playSoundEffect('buzzer')" class="soundboard-btn buzzer">
                      <span>🚨 សំឡេង Buzzer</span>
                    </button>
                    <button type="button" onclick="TeacherToolsService.playSoundEffect('spin')" class="soundboard-btn">
                      <span>🎲 សំឡេង Tick</span>
                    </button>
                  </div>
                </div>

                <!-- Big Attention Button -->
                <button type="button" id="btnHudAttention" onclick="ModalsComponent.triggerAttentionBanner()" style="background: linear-gradient(135deg, #dc2626, #991b1b); border: 2px solid #ef4444; color: #fff; padding: 14px; border-radius: 12px; font-weight: 900; font-size: 1.05rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4); transition: transform 0.2s;">
                  <i class="fa-solid fa-hand text-amber-300" style="font-size: 1.3rem;"></i>
                  <span>🛑 សុំការយកចិត្តទុកដាក់ (EYES ON TEACHER)</span>
                </button>
              </div>

              <!-- Right: Lucky Wheel / Random Student Picker -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; text-align: center;">
                <div style="font-size: 0.95rem; font-weight: 800; color: #f8fafc; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <i class="fa-solid fa-dice text-cyan-400"></i>
                  <span>កង់បង្វិលចាប់ឆ្នោតហៅសិស្ស (Lucky Wheel):</span>
                </div>

                <!-- Wheel Canvas Container -->
                <div class="lucky-wheel-container">
                  <div class="lucky-wheel-pointer"></div>
                  <canvas id="luckyWheelCanvas" width="240" height="240" class="lucky-wheel-canvas"></canvas>
                </div>

                <!-- Spin Trigger Button -->
                <div style="margin-top: 16px;">
                  <button type="button" id="btnSpinLuckyWheel" onclick="ModalsComponent.spinLuckyWheel()" class="btn-primary" style="background: linear-gradient(135deg, #0284c7, #38bdf8); border: none; font-size: 1rem; padding: 10px 24px; font-weight: 800; border-radius: 30px; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4);">
                    <i class="fa-solid fa-rotate text-amber-300"></i> <span>បង្វិលកង់ហៅសិស្ស (SPIN)</span>
                  </button>
                </div>

                <!-- Selected Winner Box -->
                <div id="luckyWheelWinnerBox" style="display: none; margin-top: 14px; background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10b981; border-radius: 10px; padding: 10px; animation: pulseAmber 1.5s infinite;">
                  <div style="font-size: 0.75rem; color: #34d399; font-weight: 700;">🎉 សិស្សដែលត្រូវបានជ្រើសរើស៖</div>
                  <div id="luckyWheelWinnerName" style="font-size: 1.2rem; font-weight: 900; color: #fff; margin-top: 2px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 32. Modal: Instant Exam Package Engine (Exam Paper + Solution Key + Rubric) -->
      <div id="examPackageGeneratorModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 540px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #1e1b4b, #4338ca); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-file-circle-check" style="font-size: 1.3rem; color: #a5b4fc;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">ម៉ាស៊ីនបង្កើតវិញ្ញាសា + ចម្លើយគ្រូ + Rubric</h3>
                <span style="font-size: 0.78rem; color: #c7d2fe;">Instant 3-in-1 Official Exam Package Engine</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="examPackageGeneratorModal" style="color: #fff; background: rgba(255,255,255,0.1);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ជ្រើសរើសមុខវិជ្ជា (Module):</label>
              <select id="examPkgModuleSelect" class="form-control" style="width: 100%; font-size: 0.95rem;">
                <option value="Microsoft Excel">Microsoft Excel (រូបមន្ត & វិក្កយបត្រ)</option>
                <option value="Microsoft Word">Microsoft Word (លិខិតរដ្ឋបាល & Table)</option>
                <option value="Microsoft PowerPoint">Microsoft PowerPoint (ស្លាយអាជីវកម្ម & SmartArt)</option>
                <option value="Typing">Khmer Typing (វាយអត្ថបទយូនីកូដ)</option>
              </select>
            </div>

            <div>
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">កម្រិតលំបាក (Difficulty Level):</label>
              <select id="examPkgLevelSelect" class="form-control" style="width: 100%;">
                <option value="កម្រិតមធ្យម">កម្រិតមធ្យម (Standard Practical Exam)</option>
                <option value="កម្រិតដំបូង">កម្រិតដំបូង (Beginner Friendly)</option>
                <option value="កម្រិតខ្ពស់">កម្រិតខ្ពស់ (Advanced Business Level)</option>
              </select>
            </div>

            <div style="background: var(--bg-surface-hover, #f8fafc); border: 1.5px solid var(--border-color, #e2e8f0); border-radius: 10px; padding: 14px;">
              <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">ឯកសារ A4 ដែលនឹងត្រូវចេញស្វ័យប្រវត្តិ៖</div>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; color: var(--text-muted);">
                <div>✅ <strong>ទំព័រទី១៖</strong> សន្លឹកវិញ្ញាសាសិស្ស A4 (មានក្បាលសាលា, ភារកិច្ច និងពិន្ទុ)</div>
                <div>✅ <strong>ទំព័រទី២៖</strong> សន្លឹកកម្រងចម្លើយ និងរូបមន្តដោះស្រាយរបស់គ្រូ A4 (Solution Key)</div>
                <div>✅ <strong>ទំព័រទី៣៖</strong> តារាងបែងចែកពិន្ទុ និងលក្ខខណ្ឌវិនិច្ឆ័យ (Grading Rubric Matrix)</div>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="examPackageGeneratorModal">បោះបង់</button>
            <button type="button" onclick="ModalsComponent.handlePrintExamPackage()" class="btn-primary" style="background: #4338ca; border-color: #4338ca; font-weight: 700;">
              <i class="fa-solid fa-print"></i> <span>បោះពុម្ពកញ្ចប់វិញ្ញាសា A4</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 33. Modal: Dropout Early-Warning Radar -->
      <div id="dropoutRadarModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 820px; width: 95%;">
          <div class="modal-header" style="background: linear-gradient(135deg, #7f1d1d, #991b1b, #b91c1c); color: #fff; padding: 16px 22px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(254, 202, 202, 0.2); color: #fca5a5; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #fff;">រ៉ាដាស្វែងរកសិស្សប្រឈមនឹងការបោះបង់ (Dropout Radar)</h3>
                <span style="font-size: 0.78rem; color: #fecaca;">Early Warning & Student Retention CRM System</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span id="dropoutRadarCountBadge" style="font-size: 0.78rem; background: rgba(255,255,255,0.15); color: #fff; padding: 4px 10px; border-radius: 12px; font-weight: 800;">កំពុងស្កេន...</span>
              <button type="button" class="btn-close-modal" data-close-modal="dropoutRadarModal" style="color: #fff; background: rgba(255,255,255,0.1); width: 34px; height: 34px; border-radius: 8px;"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>

          <div class="modal-body" style="padding: 20px;">
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;">
              ប្រព័ន្ធធ្វើការស្កេនស្វ័យប្រវត្តិតាមលក្ខខណ្ឌ៖ <strong>អវត្តមាន ≥២ ថ្ងៃជាប់គ្នា, ពិន្ទុប្រឡងទាបជាង ៦០, ឬនៅសល់ប្រាក់ថ្លៃសិក្សា</strong> ដើម្បីឱ្យលោកគ្រូអាចជួយសង្គ្រោះសិស្សបានទាន់ពេលវេលា។
            </p>

            <div id="dropoutRadarListMount" style="max-height: 480px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
              <!-- Populated dynamically -->
            </div>
          </div>

          <div class="modal-footer" style="padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color);">
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              <span>💡 ចុច "លើកទឹកចិត្ត" ដើម្បីផ្ញើសារ Telegram ទៅសិស្សដោយផ្ទាល់</span>
            </div>
            <button type="button" class="btn-secondary" data-close-modal="dropoutRadarModal">បិទ</button>
          </div>
        </div>
      </div>

      <!-- 34. Modal: 1-Click End-of-Day Wrap-Up (៦:០០ ល្ងាច) -->
      <div id="endOfDayWrapUpModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 520px; text-align: center;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0f172a, #1e1b4b); color: #fff; padding: 18px 20px; justify-content: center;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(234, 179, 8, 0.2); color: #fbbf24; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                <i class="fa-solid fa-moon"></i>
              </div>
              <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #fff;">បិទបញ្ជីចុងថ្ងៃ ៦:០០ ល្ងាច (End of Day)</h3>
              <span style="font-size: 0.8rem; color: #94a3b8;">TIS Lab Computer Automated Daily Wrap-Up</span>
            </div>
          </div>

          <div class="modal-body" style="padding: 24px; text-align: left;">
            <div id="endOfDayStatsMount" style="background: var(--bg-surface-hover, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <!-- Populated dynamically with today stats -->
            </div>

            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; text-align: center; margin: 0 0 16px 0;">
              នៅពេលចុចបញ្ជាក់ ប្រព័ន្ធនឹងរក្សាទុកទិន្នន័យ ធ្វើការ Backup ស្វ័យប្រវត្តិ និងផ្ញើរបាយការណ៍សង្ខេប ១ ទំព័រ ចូលទៅកាន់ Telegram របស់លោកគ្រូ។
            </p>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="endOfDayWrapUpModal">បោះបង់</button>
            <button type="button" onclick="ModalsComponent.handleConfirmEndOfDayWrapUp()" class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); border: none; font-weight: 800;">
              <i class="fa-solid fa-check"></i> <span>បញ្ជាក់ការបិទបញ្ជី & ផ្ញើ Telegram</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 35. Modal: Khmer Calendar & National Holidays (ប្រតិទិនខ្មែរ & បុណ្យជាតិ) -->
      <div id="khmerCalendarModal" class="modal-overlay">
        <div class="modal-card khmer-calendar-card">
          <div class="modal-header" style="background: linear-gradient(135deg, #0f172a, #1e1b4b, #312e81); color: #fff; padding: 16px 24px; border-bottom: 1.5px solid rgba(245, 158, 11, 0.35); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(245, 158, 11, 0.2); border: 1.5px solid rgba(245, 158, 11, 0.4); color: #fbbf24; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25);">
                <i class="fa-solid fa-calendar-days"></i>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 10px;">
                  <span>ប្រតិទិនខ្មែរ & បុណ្យជាតិ (Khmer Calendar Dashboard)</span>
                  <span style="font-size: 0.72rem; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); padding: 2px 8px; border-radius: 12px; font-weight: 700;">Live 2025-2027+</span>
                </h3>
                <span style="font-size: 0.8rem; color: #fde68a;">TIS Lab Computer Holiday Schedule & Telegram Advance Broadcast System</span>
              </div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button type="button" onclick="KhmerCalendarService.printAnnualHolidaysScheduleA4()" class="btn-secondary" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); font-size: 0.82rem; padding: 7px 14px; border-radius: 8px;" title="បោះពុម្ពតារាងបុណ្យជាតិប្រចាំឆ្នាំទំហំ A4">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ពប្រចាំឆ្នាំ A4</span>
              </button>
              <button type="button" id="btnToggleCalFullscreen" onclick="ModalsComponent.toggleCalendarFullscreen()" class="btn-secondary" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); font-size: 0.82rem; padding: 7px 14px; border-radius: 8px; font-weight: 700;" title="ពង្រីក/បង្រួមពេញអេក្រង់ (Toggle Fullscreen)">
                <i class="fa-solid fa-expand"></i> <span>ពេញអេក្រង់</span>
              </button>
              <button type="button" class="btn-close-modal" data-close-modal="khmerCalendarModal" style="color: #fff; background: rgba(255,255,255,0.1); width: 36px; height: 36px; border-radius: 8px;"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>

          <div class="modal-body">
            <!-- Top Alert Banner for Upcoming Holiday -->
            <div id="calendarUpcomingBannerMount">
              <!-- Dynamically populated if upcoming holiday detected -->
            </div>

            <!-- Main Layout: 2 Columns (Left: Calendar Grid Box, Right: Upcoming Holidays Box) -->
            <div class="khmer-cal-main-layout">
              <!-- Left Column: Calendar Grid Box -->
              <div class="khmer-cal-grid-box">
                <!-- Navigation Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <button type="button" onclick="ModalsComponent.prevCalendarMonth()" class="btn-secondary" style="padding: 7px 12px; font-size: 0.9rem;" title="ខែមុន">
                      <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <span id="calCurrentMonthTitle" style="font-size: 1.25rem; font-weight: 800; color: #fff; min-width: 170px; text-align: center; letter-spacing: 0.3px;">--</span>
                    <button type="button" onclick="ModalsComponent.nextCalendarMonth()" class="btn-secondary" style="padding: 7px 12px; font-size: 0.9rem;" title="ខែបន្ទាប់">
                      <i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button type="button" onclick="ModalsComponent.todayCalendarMonth()" class="btn-secondary" style="font-size: 0.8rem; padding: 6px 12px; margin-left: 4px; font-weight: 700; color: #34d399; border-color: rgba(52, 211, 153, 0.4);">
                      <i class="fa-solid fa-circle-dot"></i> ថ្ងៃនេះ
                    </button>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <!-- Quick Year Switcher -->
                    <div style="display: flex; background: rgba(255,255,255,0.06); padding: 3px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                      <button type="button" onclick="ModalsComponent.setCalendarYear(2025)" class="btn-secondary cal-year-btn" id="calYearBtn2025" style="border: none; padding: 4px 10px; font-size: 0.78rem; border-radius: 6px;">២០២៥</button>
                      <button type="button" onclick="ModalsComponent.setCalendarYear(2026)" class="btn-secondary cal-year-btn" id="calYearBtn2026" style="border: none; padding: 4px 10px; font-size: 0.78rem; border-radius: 6px;">២០២៦</button>
                      <button type="button" onclick="ModalsComponent.setCalendarYear(2027)" class="btn-secondary cal-year-btn" id="calYearBtn2027" style="border: none; padding: 4px 10px; font-size: 0.78rem; border-radius: 6px;">២០២៧</button>
                    </div>
                    <button type="button" onclick="ModalsComponent.toggleAddCustomHolidayForm()" class="btn-primary" style="background: #4338ca; border-color: #6366f1; font-size: 0.82rem; padding: 7px 14px; font-weight: 700; box-shadow: 0 4px 12px rgba(67, 56, 202, 0.35);">
                      <i class="fa-solid fa-plus-circle"></i> <span>ថែមថ្ងៃឈប់ផ្ទាល់ខ្លួន</span>
                    </button>
                  </div>
                </div>

                <!-- Custom Holiday Inline Form (Collapsed by default) -->
                <div id="customHolidayFormBox" style="display: none; background: rgba(67, 56, 202, 0.15); border: 1.5px solid #6366f1; border-radius: 12px; padding: 14px; margin-bottom: 14px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);">
                  <div style="font-size: 0.86rem; font-weight: 800; color: #a5b4fc; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-calendar-plus text-indigo-400"></i>
                    <span>កំណត់ថ្ងៃឈប់សម្រាកសាលាផ្ទាល់ខ្លួន (School Holiday / Lab Break)៖</span>
                  </div>
                  <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div>
                      <label style="font-size: 0.74rem; color: #94a3b8; margin-bottom: 4px; display: block;">ឈ្មោះពិធី ឬមូលហេតុសម្រាក៖</label>
                      <input type="text" id="custHoliTitle" class="form-control" placeholder="ឧ. ជួសជុល Lab / សម្រាកពាក់កណ្តាលវគ្គ" style="font-size: 0.85rem;">
                    </div>
                    <div>
                      <label style="font-size: 0.74rem; color: #94a3b8; margin-bottom: 4px; display: block;">ចាប់ពីថ្ងៃទី៖</label>
                      <input type="date" id="custHoliStart" class="form-control" style="font-size: 0.85rem;">
                    </div>
                    <div>
                      <label style="font-size: 0.74rem; color: #94a3b8; margin-bottom: 4px; display: block;">ដល់ថ្ងៃទី៖</label>
                      <input type="date" id="custHoliEnd" class="form-control" placeholder="ដល់ថ្ងៃទី" style="font-size: 0.85rem;">
                    </div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 2fr auto; gap: 10px; align-items: flex-end;">
                    <div>
                      <label style="font-size: 0.74rem; color: #34d399; margin-bottom: 4px; display: block;">ចូលរៀនវិញថ្ងៃទី៖</label>
                      <input type="date" id="custHoliResume" class="form-control" style="font-size: 0.85rem;" title="ថ្ងៃចូលរៀនវិញ">
                    </div>
                    <div>
                      <label style="font-size: 0.74rem; color: #94a3b8; margin-bottom: 4px; display: block;">ចំណាំជូនសិស្ស៖</label>
                      <input type="text" id="custHoliNote" class="form-control" placeholder="ឧ. សិស្សរំលឹកមេរៀន Excel & រៀបចំកុំព្យូទ័រ" style="font-size: 0.85rem;">
                    </div>
                    <div style="display: flex; gap: 8px;">
                      <button type="button" onclick="ModalsComponent.handleSaveCustomHoliday()" class="btn-primary" style="background: #10b981; border: none; font-size: 0.85rem; padding: 9px 18px; font-weight: 700;">
                        <i class="fa-solid fa-floppy-disk"></i> រក្សាទុក
                      </button>
                      <button type="button" onclick="ModalsComponent.toggleAddCustomHolidayForm(false)" class="btn-secondary" style="font-size: 0.85rem; padding: 9px 14px;">
                        បោះបង់
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 7-Day Grid Weekday Headers -->
                <div class="cal-weekdays-row">
                  <span class="cal-weekday weekend">អាទិត្យ (Sun)</span>
                  <span class="cal-weekday">ចន្ទ (Mon)</span>
                  <span class="cal-weekday">អង្គារ (Tue)</span>
                  <span class="cal-weekday">ពុធ (Wed)</span>
                  <span class="cal-weekday">ព្រហស្បតិ៍ (Thu)</span>
                  <span class="cal-weekday">សុក្រ (Fri)</span>
                  <span class="cal-weekday weekend">សៅរ៍ (Sat)</span>
                </div>

                <!-- Days Mount -->
                <div id="calDaysGridMount" class="khmer-calendar-grid" style="padding: 0;">
                  <!-- Dynamically rendered -->
                </div>
              </div>

              <!-- Right Column: Holidays Side Box -->
              <div class="khmer-cal-side-box">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-bullhorn text-amber-400" style="font-size: 1.1rem;"></i>
                    <strong style="font-size: 1rem; color: #fff;">កាលវិភាគឈប់សម្រាក & ផ្សាយដំណឹង Telegram</strong>
                  </div>
                  <span id="calHolidaysCountBadge" style="font-size: 0.78rem; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 3px 10px; border-radius: 12px; font-weight: 800;">--</span>
                </div>

                <div id="calHolidaysListMount" class="cal-holidays-list-container">
                  <!-- Dynamically populated -->
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(15, 23, 42, 0.8);">
            <div style="font-size: 0.82rem; color: #94a3b8; display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
              <span>🔴 ថ្ងៃឈប់សម្រាកបុណ្យជាតិ</span>
              <span>🟢 ថ្ងៃបច្ចុប្បន្ន (Today)</span>
              <span>🟣 ថ្ងៃឈប់សម្រាកសាលាផ្ទាល់ខ្លួន</span>
              <span style="color: #38bdf8;"><i class="fa-solid fa-circle-info"></i> ចុចលើប្រអប់ថ្ងៃបុណ្យ ដើម្បីផ្ញើដំណឹង Telegram ភ្លាមៗ ឬចុចលើថ្ងៃទទេ ដើម្បីបង្កើតថ្ងៃឈប់សម្រាក</span>
            </div>
            <button type="button" class="btn-secondary" data-close-modal="khmerCalendarModal" style="padding: 6px 20px;">បិទ</button>
          </div>
        </div>
      </div>

      <!-- 36. Modal: Holiday Telegram Broadcast Confirmation & Customizer -->
      <div id="holidayBroadcastConfirmModal" class="modal-overlay">
        <div class="modal-card" style="max-width: 580px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-brands fa-telegram" style="font-size: 1.4rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">ផ្សាយដំណឹងឈប់សម្រាកទៅ Telegram</h3>
                <span style="font-size: 0.78rem; color: #bfdbfe;">TIS Lab Computer Holiday Telegram Broadcast</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="holidayBroadcastConfirmModal" style="color: #fff; background: rgba(255,255,255,0.1);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ផ្សាយទៅកាន់ (Target Audience):</label>
              <select id="holiBcTargetShift" class="form-control" style="width: 100%;">
                <option value="ALL">📢 គ្រប់គ្រុបទាំង ៣ (ព្រឹក • រសៀល • យប់)</option>
                <option value="ព្រឹក">🌅 គ្រុបវេនព្រឹក (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនព្រឹក)</option>
                <option value="រសៀល">☀️ គ្រុបវេនរសៀល (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនរសៀល)</option>
                <option value="យប់">🌙 គ្រុបវេនយប់ (រៀនកុំព្យូទ័រថ្នាក់មូលដ្ឋាន វេនយប់ ម៉ោង៥-៦)</option>
              </select>
            </div>

            <div>
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ឈ្មោះពិធីបុណ្យជាតិ / ថ្ងៃឈប់សម្រាក៖</label>
              <input type="text" id="holiBcTitleInput" class="form-control" required style="font-weight: 700;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ផ្អាកការបង្រៀនចាប់ពី៖</label>
                <input type="date" id="holiBcStartDateInput" class="form-control" required>
              </div>
              <div>
                <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">ដល់ថ្ងៃទី (End Date):</label>
                <input type="date" id="holiBcEndDateInput" class="form-control">
              </div>
            </div>

            <div>
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">🚀 ចូលរៀនវិញនៅថ្ងៃទី (Resumption Date):</label>
              <input type="date" id="holiBcResumeDateInput" class="form-control" required style="border-color: #10b981; font-weight: 700;">
            </div>

            <div>
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px; display: block;">សារដាស់តឿន / កំណត់ចំណាំ (Note):</label>
              <textarea id="holiBcNoteInput" class="form-control" rows="2" placeholder="សូមប្អូនៗសិស្សានុសិស្សឆ្លៀតពេលរំលឹកមេរៀន រូបមន្តកុំព្យូទ័រ និងធ្វើដំណើរប្រកបដោយសុវត្ថិភាព!"></textarea>
            </div>

            <div style="background: var(--bg-surface-hover, #f8fafc); border: 1.5px solid var(--border-color, #e2e8f0); border-radius: 10px; padding: 12px; font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
              <i class="fa-solid fa-circle-info text-blue-500"></i> ប្រព័ន្ធ Telegram Bot នឹងធ្វើការផ្ញើសេចក្តីជូនដំណឹងផ្លូវការដោយស្វ័យប្រវត្តិចូលគ្រុបសិស្ស ដោយមានក្បាលសាលា កាលបរិច្ឆេទឈប់សម្រាក និងកាលបរិច្ឆេទចូលរៀនវិញយ៉ាងច្បាស់លាស់។
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="holidayBroadcastConfirmModal">បោះបង់</button>
            <div style="display: flex; gap: 8px;">
              <button type="button" onclick="ModalsComponent.handlePrintHolidayNoticeFromModal()" class="btn-secondary" style="font-weight: 700;">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព A4 បិទមុខ Lab</span>
              </button>
              <button type="button" onclick="ModalsComponent.executeHolidayBroadcastFromModal()" class="btn-primary" style="background: #2563eb; border-color: #2563eb; font-weight: 700;">
                <i class="fa-brands fa-telegram"></i> <span>ផ្សាយដំណឹងឥឡូវនេះ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 37. Modal: 1-Click Telegram & Phone Contact Hub with Khmer Templates -->
      <div id="quickContactModal" class="modal-overlay">
        <div class="modal-card contact-hub-dialog">
          <div class="modal-header" style="background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-comments" style="font-size: 1.3rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">មជ្ឈមណ្ឌលទំនាក់ទំនងសិស្ស & អាណាព្យាបាល</h3>
                <span style="font-size: 0.78rem; color: #bae6fd;">1-Click Telegram & Phone Contact Hub • TIS Lab Computer</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="quickContactModal" style="color: #fff; background: rgba(255,255,255,0.15);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <!-- Profile Header Summary Card -->
            <div class="contact-profile-box">
              <img id="contactHubAvatar" src="" alt="Avatar" class="contact-profile-avatar">
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <h4 id="contactHubNameKh" style="margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--text-main);">ឈ្មោះសិស្ស</h4>
                  <span id="contactHubNameEn" style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); font-family: ui-monospace, monospace;">NAME EN</span>
                  <span id="contactHubIdBadge" class="badge badge-id font-mono">TX01</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px; font-size: 0.82rem; color: var(--text-muted); flex-wrap: wrap;">
                  <span id="contactHubCourse"><i class="fa-solid fa-laptop-code text-indigo-400"></i> Typing</span>
                  <span>•</span>
                  <span id="contactHubShift"><i class="fa-solid fa-clock text-amber-400"></i> វេនព្រឹក</span>
                  <span>•</span>
                  <span id="contactHubStatusBadge" class="status-indicator status-active">កំពុងសិក្សា</span>
                </div>
                <!-- Direct Call & Telegram links -->
                <div class="contact-direct-actions">
                  <a id="contactHubCallStudentBtn" href="tel:" class="contact-btn-direct call">
                    <i class="fa-solid fa-phone"></i> <span>Call សិស្ស (<span id="contactHubPhoneText">--</span>)</span>
                  </a>
                  <a id="contactHubCallGuardianBtn" href="tel:" class="contact-btn-direct call" style="background: rgba(99, 102, 241, 0.12); color: #6366f1; border-color: rgba(99, 102, 241, 0.3);">
                    <i class="fa-solid fa-phone-volume"></i> <span>Call អាណាព្យាបាល</span>
                  </a>
                  <a id="contactHubDirectTgBtn" href="#" target="_blank" class="contact-btn-direct telegram">
                    <i class="fa-brands fa-telegram"></i> <span>បើក Telegram</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Template Selector Tabs -->
            <div>
              <label style="font-size: 0.82rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
                ជ្រើសរើសទម្រង់សារស្វ័យប្រវត្តិ (Quick Khmer Templates):
              </label>
              <div class="contact-template-nav">
                <button type="button" class="contact-template-btn active" data-contact-tab="payment" onclick="ModalsComponent.switchContactTemplate('payment')">
                  <i class="fa-solid fa-file-invoice-dollar text-emerald-400"></i> <span>💰 រំលឹកបង់ថ្លៃសិក្សា</span>
                </button>
                <button type="button" class="contact-template-btn" data-contact-tab="absence" onclick="ModalsComponent.switchContactTemplate('absence')">
                  <i class="fa-solid fa-triangle-exclamation text-amber-400"></i> <span>⚠️ សាកសួរអវត្តមាន</span>
                </button>
                <button type="button" class="contact-template-btn" data-contact-tab="exams" onclick="ModalsComponent.switchContactTemplate('exams')">
                  <i class="fa-solid fa-award text-sky-400"></i> <span>📊 លទ្ធផលប្រឡង</span>
                </button>
                <button type="button" class="contact-template-btn" data-contact-tab="portal" onclick="ModalsComponent.switchContactTemplate('portal')">
                  <i class="fa-solid fa-key text-purple-400"></i> <span>🔑 PIN & Student Portal</span>
                </button>
                <button type="button" class="contact-template-btn" data-contact-tab="custom" onclick="ModalsComponent.switchContactTemplate('custom')">
                  <i class="fa-solid fa-pen-nib text-teal-400"></i> <span>✍️ សារផ្ទាល់ខ្លួន</span>
                </button>
              </div>
            </div>

            <!-- Live Message Preview & Editor -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main);">
                  ខ្លឹមសារសារ (អាចកែប្រែបន្ថែមបានមុននឹងផ្ញើ):
                </label>
                <span style="font-size: 0.76rem; color: var(--text-muted);"><i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i> បញ្ចូលព័ត៌មានសិស្សដោយស្វ័យប្រវត្តិ</span>
              </div>
              <textarea id="contactHubMessageText" class="contact-msg-editor" rows="6" placeholder="បញ្ចូលខ្លឹមសារសារនៅទីនេះ..."></textarea>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 10px;">
            <button type="button" class="btn-secondary" data-close-modal="quickContactModal">បិទ</button>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" id="btnContactHubCopy" onclick="ModalsComponent.copyContactMessage()" class="btn-secondary" style="font-weight: 700;">
                <i class="fa-regular fa-copy"></i> <span>ចម្លងសារ (Copy)</span>
              </button>
              <button type="button" id="btnContactHubSms" onclick="ModalsComponent.shareContactViaSms()" class="btn-secondary" style="font-weight: 700; color: #10b981; border-color: rgba(16, 185, 129, 0.4);">
                <i class="fa-solid fa-comment-sms"></i> <span>ផ្ញើជា SMS</span>
              </button>
              <button type="button" id="btnContactHubTelegram" onclick="ModalsComponent.shareContactViaTelegram()" class="btn-primary" style="background: #0088cc; border-color: #0088cc; font-weight: 700; box-shadow: 0 4px 14px rgba(0, 136, 204, 0.35);">
                <i class="fa-brands fa-telegram"></i> <span>ផ្ញើតាម Telegram</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 38. Modal: Quick Batch Exam Grading Grid by Shift -->
      <div id="quickBatchGradingModal" class="modal-overlay">
        <div class="modal-card batch-grading-dialog">
          <div class="modal-header" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-table-cells" style="font-size: 1.3rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">បញ្ចូលពិន្ទុប្រឡងរហ័សតាមវេន (Quick Batch Grading)</h3>
                <span style="font-size: 0.78rem; color: #fef3c7;">បញ្ចូលពិន្ទុរបៀប Spreadsheet លឿនរហ័ស • ប្រើ Enter ឬសញ្ញាព្រួញចុះក្រោមដើម្បីចុះជួរ</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="quickBatchGradingModal" style="color: #fff; background: rgba(255,255,255,0.15);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 18px 20px; display: flex; flex-direction: column; gap: 14px;">
            <!-- Controls Bar: Shift, Course, Exam Date, Quick Tools -->
            <div class="batch-grid-controls-bar">
              <!-- Shift Selector -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); white-space: nowrap;"><i class="fa-solid fa-clock text-amber-500"></i> ជ្រើសរើសវេន៖</label>
                <select id="batchGradingShiftSelect" class="form-control" style="width: 140px; height: 36px; font-weight: 700;" onchange="ModalsComponent.onBatchGradingFilterChange()">
                  <option value="ALL">-- គ្រប់វេន --</option>
                  <option value="ព្រឹក" selected>🌅 វេនព្រឹក</option>
                  <option value="ថ្ងៃ">☀️ វេនថ្ងៃ</option>
                  <option value="រសៀល">🌙 វេនរសៀល/យប់</option>
                </select>
              </div>

              <!-- Course Selector -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); white-space: nowrap;"><i class="fa-solid fa-graduation-cap text-indigo-500"></i> មុខវិជ្ជា៖</label>
                <select id="batchGradingCourseSelect" class="form-control" style="width: 170px; height: 36px; font-weight: 700;" onchange="ModalsComponent.onBatchGradingFilterChange()">
                  <option value="Typing" selected>⌨️ Typing (វាយអត្ថបទ)</option>
                  <option value="Microsoft Word">📄 Microsoft Word</option>
                  <option value="Microsoft Excel">📊 Microsoft Excel</option>
                  <option value="Microsoft PowerPoint">📽️ MS PowerPoint</option>
                </select>
              </div>

              <!-- Exam Date -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); white-space: nowrap;"><i class="fa-regular fa-calendar text-emerald-500"></i> កាលបរិច្ឆេទ៖</label>
                <input type="date" id="batchGradingDateInput" class="form-control" style="width: 140px; height: 36px;">
              </div>

              <!-- Quick Fill Actions -->
              <div style="display: flex; align-items: center; gap: 6px; margin-left: auto;">
                <button type="button" class="btn-secondary" style="height: 34px; padding: 0 10px; font-size: 0.78rem;" onclick="ModalsComponent.batchFillScore(100)" title="ដាក់ពិន្ទុ 100 គ្រប់សិស្ស">
                  100 ទាំងអស់
                </button>
                <button type="button" class="btn-secondary" style="height: 34px; padding: 0 10px; font-size: 0.78rem;" onclick="ModalsComponent.batchFillScore(85)" title="ដាក់ពិន្ទុ 85 គ្រប់សិស្ស">
                  85 ទាំងអស់
                </button>
                <button type="button" class="btn-secondary" style="height: 34px; padding: 0 10px; font-size: 0.78rem;" onclick="ModalsComponent.batchClearScores()" title="សម្អាតពិន្ទុទាំងអស់">
                  <i class="fa-solid fa-rotate-left"></i>
                </button>
              </div>
            </div>

            <!-- Interactive Table -->
            <div class="batch-table-container">
              <table class="data-table" style="margin: 0;">
                <thead style="position: sticky; top: 0; z-index: 10; background: var(--bg-card);">
                  <tr>
                    <th style="width: 45px; text-align: center;">#</th>
                    <th style="width: 85px;">អត្តលេខ</th>
                    <th>ឈ្មោះសិស្ស</th>
                    <th style="width: 110px;">វេនសិក្សា</th>
                    <th style="width: 100px; text-align: center;">ពិន្ទុចាស់</th>
                    <th style="width: 130px; text-align: center;">ពិន្ទុប្រឡងថ្មី (0-100)</th>
                    <th style="width: 80px; text-align: center;">និទ្ទេស</th>
                    <th style="width: 90px; text-align: center;">លទ្ធផល</th>
                  </tr>
                </thead>
                <tbody id="batchGradingTableBody">
                  <!-- Rendered dynamically -->
                </tbody>
              </table>
            </div>

            <!-- Bottom Summary Stats & Broadcast Toggle -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg-card); border-radius: 10px; border: 1px solid var(--border-color); flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 16px; font-size: 0.85rem;">
                <span>សិស្សសរុប៖ <strong id="batchStatTotal" class="font-mono text-sky-400">0</strong> នាក់</span>
                <span>•</span>
                <span>មធ្យមភាគ៖ <strong id="batchStatAvg" class="font-mono text-emerald-400">0.0</strong></span>
                <span>•</span>
                <span>ជាប់៖ <strong id="batchStatPassed" class="font-mono text-emerald-400">0</strong></span>
                <span>•</span>
                <span>ធ្លាក់៖ <strong id="batchStatFailed" class="font-mono text-rose-400">0</strong></span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" id="batchGradingSendTelegramChk" style="width: 16px; height: 16px; accent-color: #0284c7; cursor: pointer;">
                <label for="batchGradingSendTelegramChk" style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); cursor: pointer;">
                  <i class="fa-brands fa-telegram text-sky-400"></i> ផ្ញើលទ្ធផលទៅ Telegram ផងដែរ
                </label>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn-secondary" data-close-modal="quickBatchGradingModal">បោះបង់</button>
            <button type="button" id="btnSaveBatchGrading" onclick="ModalsComponent.saveBatchGradingScores()" class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); border: none; font-weight: 800; padding: 0 24px; height: 40px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
              <i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកពិន្ទុទាំងអស់ (Batch Save)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 39. Modal: Digital Payment Receipt / Invoice Generator & Print -->
      <div id="studentReceiptModal" class="modal-overlay">
        <div class="modal-card receipt-modal-dialog">
          <div class="modal-header" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-receipt" style="font-size: 1.3rem;"></i>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">ចេញវិក្កយបត្រ & បង្កាន់ដៃបង់ប្រាក់ឌីជីថល (Digital Receipt)</h3>
                <span style="font-size: 0.78rem; color: #d1fae5;">TIS Lab Computer Official Receipt Generator with School Seal & Digital Signature</span>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="studentReceiptModal" style="color: #fff; background: rgba(255,255,255,0.15);"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <!-- Format Selector & Customizer Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div class="receipt-format-selector" style="margin-bottom: 0;">
                <button type="button" class="receipt-format-btn active" id="btnReceiptFormatA5" onclick="ModalsComponent.switchReceiptFormat('a5')">
                  <i class="fa-solid fa-file-invoice"></i> <span>ទម្រង់ស្តង់ដារ A5 (Standard Invoice)</span>
                </button>
                <button type="button" class="receipt-format-btn" id="btnReceiptFormatThermal" onclick="ModalsComponent.switchReceiptFormat('thermal')">
                  <i class="fa-solid fa-receipt"></i> <span>ទម្រង់ម៉ាស៊ីនកម្តៅ 80mm POS Slip</span>
                </button>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; font-size: 0.84rem; font-weight: 700; color: var(--text-main);">
                <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" id="receiptToggleSeal" checked onchange="ModalsComponent.toggleReceiptSeal(this.checked)" style="accent-color: #ef4444; width: 16px; height: 16px;">
                  <span>ត្រាសាលា (Seal)</span>
                </label>
                <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" id="receiptToggleSign" checked onchange="ModalsComponent.toggleReceiptSign(this.checked)" style="accent-color: #4f46e5; width: 16px; height: 16px;">
                  <span>ហត្ថលេខាគ្រូ</span>
                </label>
                <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" id="receiptToggleQr" checked onchange="ModalsComponent.toggleReceiptQr(this.checked)" style="accent-color: #10b981; width: 16px; height: 16px;">
                  <span>QR Code</span>
                </label>
              </div>
            </div>

            <!-- Printable Receipt Preview Container -->
            <div class="receipt-preview-outer">
              <div id="receiptPrintableArea">
                <!-- Rendered dynamically -->
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 10px;">
            <button type="button" class="btn-secondary" data-close-modal="studentReceiptModal">បិទ</button>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" onclick="ModalsComponent.copyReceiptText()" class="btn-secondary" style="font-weight: 700;">
                <i class="fa-regular fa-copy"></i> <span>ចម្លងព័ត៌មាន</span>
              </button>
              <button type="button" onclick="ModalsComponent.shareReceiptViaTelegram()" class="btn-secondary" style="color: #0088cc; border-color: rgba(0, 136, 204, 0.4); font-weight: 700;">
                <i class="fa-brands fa-telegram"></i> <span>ផ្ញើតាម Telegram</span>
              </button>
              <button type="button" onclick="ModalsComponent.printCurrentReceipt()" class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); border: none; font-weight: 800; padding: 0 20px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ពបង្កាន់ដៃ (Print)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: Class Attendance QR Sheet A4 Studio (តារាង Scan វត្តមានលឿនលើក្រដាស A4) -->
      <div id="classAttendanceQrSheetModal" class="modal-overlay">
        <div class="attendance-qr-sheet-dialog">
          <!-- Modal Header -->
          <div class="modal-header" style="background: linear-gradient(135deg, #065f46, #047857); color: #fff; padding: 14px 20px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                <i class="fa-solid fa-qrcode"></i>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800;">តារាង Scan វត្តមានលឿនលើក្រដាស A4 (Class Attendance QR Sheet)</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.78rem; opacity: 0.9;">បោះពុម្ពតារាង QR វត្តមានសិស្សតាមវេនសម្រាប់គ្រូស្កេន ឬធីកវត្តមានដោយប៊ិចលើតុ</p>
              </div>
            </div>
            <button type="button" class="btn-close-modal" data-close-modal="classAttendanceQrSheetModal" style="color: #fff; background: rgba(255,255,255,0.15);">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Controls Toolbar -->
          <div class="qr-sheet-controls-bar">
            <div class="qr-sheet-controls-left">
              <!-- Shift filter -->
              <div style="display: flex; align-items: center; gap: 6px;">
                <label style="font-size: 0.8rem; font-weight: 700; color: #94a3b8;">វេនសិក្សា៖</label>
                <select id="qrSheetShiftSelect" class="form-control" style="font-size: 0.82rem; padding: 4px 8px; width: 140px; background: #1e293b; color: #fff; border-color: #475569;" onchange="ModalsComponent.onQrSheetFilterChange()">
                  <option value="all">ទាំងអស់ (All Shifts)</option>
                  <option value="ព្រឹក" selected>🌅 ព្រឹក (Morning)</option>
                  <option value="ថ្ងៃ">☀️ ថ្ងៃត្រង់ (Noon)</option>
                  <option value="រសៀល">🌇 រសៀល (Afternoon)</option>
                  <option value="យប់">🌙 យប់ (Night)</option>
                </select>
              </div>

              <!-- Course filter -->
              <div style="display: flex; align-items: center; gap: 6px;">
                <label style="font-size: 0.8rem; font-weight: 700; color: #94a3b8;">មុខវិជ្ជា៖</label>
                <select id="qrSheetCourseSelect" class="form-control" style="font-size: 0.82rem; padding: 4px 8px; width: 130px; background: #1e293b; color: #fff; border-color: #475569;" onchange="ModalsComponent.onQrSheetFilterChange()">
                  <option value="all">ទាំងអស់ (All)</option>
                  <option value="Typing">Typing</option>
                  <option value="Word">MS Word</option>
                  <option value="Excel">MS Excel</option>
                  <option value="PowerPoint">PowerPoint</option>
                  <option value="IT">IT Support</option>
                </select>
              </div>

              <!-- Layout switcher -->
              <div style="display: flex; align-items: center; gap: 6px;">
                <label style="font-size: 0.8rem; font-weight: 700; color: #94a3b8;">ទម្រង់៖</label>
                <select id="qrSheetLayoutSelect" class="form-control" style="font-size: 0.82rem; padding: 4px 8px; width: 160px; background: #1e293b; color: #fff; border-color: #475569;" onchange="ModalsComponent.onQrSheetFilterChange()">
                  <option value="grid" selected>🔲 Grid Cards (១២-១៨ នាក់)</option>
                  <option value="table">📑 Table List (២០-២៥ នាក់)</option>
                </select>
              </div>

              <!-- Toggles -->
              <div style="display: flex; align-items: center; gap: 12px; margin-left: 6px;">
                <label style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: #cbd5e1; cursor: pointer;">
                  <input type="checkbox" id="qrSheetTogglePhoto" checked onchange="ModalsComponent.onQrSheetFilterChange()" style="accent-color: #10b981;">
                  <span>រូបថត</span>
                </label>
                <label style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: #cbd5e1; cursor: pointer;">
                  <input type="checkbox" id="qrSheetToggleChecks" checked onchange="ModalsComponent.onQrSheetFilterChange()" style="accent-color: #10b981;">
                  <span>ប្រអប់ធីក ៥ ថ្ងៃ</span>
                </label>
                <label style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: #cbd5e1; cursor: pointer;">
                  <input type="checkbox" id="qrSheetToggleSeal" checked onchange="ModalsComponent.onQrSheetFilterChange()" style="accent-color: #ef4444;">
                  <span>ត្រាសាលា</span>
                </label>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="qr-sheet-controls-right">
              <button type="button" class="btn-secondary" style="font-size: 0.82rem; padding: 6px 12px;" onclick="ModalsComponent.launchScannerFromQrSheet()" title="បើកកាមេរ៉ាស្កេនក្រដាសនេះភ្លាមៗ">
                <i class="fa-solid fa-camera text-sky-400"></i> <span>បើកម៉ាស៊ីនស្កេន</span>
              </button>
              <button type="button" class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); border: none; font-size: 0.84rem; font-weight: 800; padding: 6px 16px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);" onclick="ModalsComponent.printClassAttendanceQrSheet()" title="បោះពុម្ពទំព័រ A4 នេះ">
                <i class="fa-solid fa-print"></i> <span>បោះពុម្ព A4 ភ្លាមៗ</span>
              </button>
            </div>
          </div>

          <!-- Preview Viewport -->
          <div class="qr-sheet-preview-viewport">
            <div id="attendanceQrSheetPaper" class="qr-sheet-paper-a4">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer" style="padding: 10px 18px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); background: #0f172a;">
            <div style="font-size: 0.8rem; color: #94a3b8;">
              <i class="fa-solid fa-circle-info text-emerald-400"></i> សន្លឹក A4 នេះត្រូវរចនាឡើងយ៉ាងច្បាស់ដើម្បីឱ្យកាមេរ៉ាទូរស័ព្ទអាចស្កេន QR ពីចម្ងាយបានយ៉ាងលឿន
            </div>
            <button type="button" class="btn-secondary" data-close-modal="classAttendanceQrSheetModal">បិទ</button>
          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    // Close button listeners
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modalId = btn.getAttribute("data-close-modal");
        ModalsComponent.close(modalId);
      });
    });

    // Close on clicking backdrop
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          ModalsComponent.close(overlay.id);
        }
      });
    });

    // Print ID Card listener
    const printBtn = document.getElementById("printIdCardBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        App.printStudentIdCard();
      });
    }

    // Edit form submission
    const editForm = document.getElementById("editStudentForm");
    if (editForm) {
      editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await App.handleEditFormSubmit(editForm);
      });
    }

    // Edit Avatar File change listener
    const editAvatarFile = document.getElementById("editAvatarFile");
    const editAvatarPreview = document.getElementById("editAvatarPreview");
    const editAvatarInput = document.getElementById("editAvatarInput");
    const editAvatarPlaceholder = document.getElementById("editAvatarPlaceholder");
    if (editAvatarFile && editAvatarPreview) {
      editAvatarFile.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            editAvatarPreview.style.opacity = "0.5";
            let finalUrl = "";
            let providerName = "";

            if (typeof ImageHostService !== "undefined") {
              const res = await ImageHostService.upload(file, "edit_student");
              if (res.success && res.url) {
                finalUrl = res.url;
                providerName = res.provider;
              }
            }

            if (!finalUrl) {
              finalUrl = await StudentAPI.compressImage(file, 480, 0.82);
            }

            editAvatarPreview.src = finalUrl;
            editAvatarPreview.style.display = "block";
            if (editAvatarPlaceholder) editAvatarPlaceholder.style.display = "none";
            if (editAvatarInput) editAvatarInput.value = finalUrl;
            const provKh = providerName === "server" ? "Local Server" : (providerName === "imgbb" ? "ImgBB CDN" : (providerName === "freeimage" ? "FreeImage CDN" : (providerName === "telegram" ? "Telegram CDN" : "Optimized")));
            App.showToast(`📸 រូបថតត្រូវបានផ្ទុកឡើងលើ HostImg (${provKh}) រួចរាល់!`, "success");
          } catch (err) {
            App.showToast("មិនអាចដំណើរការរូបភាពបានទេ!", "error");
          } finally {
            editAvatarPreview.style.opacity = "1";
          }
        }
      });
    }

    // Add Student Form submission (Popup Modal)
    const addForm = document.getElementById("modalAddStudentForm");
    if (addForm) {
      addForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await App.handleModalAddStudentSubmit(addForm);
      });
    }

    // Auto Transliteration for Add Student Modal
    const enrollInputNameKh = document.getElementById("enrollInputNameKh");
    const enrollInputNameEn = document.getElementById("enrollInputNameEn");
    if (enrollInputNameKh && enrollInputNameEn) {
      enrollInputNameKh.addEventListener("input", (e) => {
        if (!enrollInputNameEn.dataset.manualEdited || !enrollInputNameEn.value.trim()) {
          if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin) {
            enrollInputNameEn.value = TeacherToolsService.transliterateKhmerToLatin(e.target.value);
          }
        }
      });
      enrollInputNameEn.addEventListener("input", () => {
        enrollInputNameEn.dataset.manualEdited = "true";
      });
    }

    // Auto Transliteration for Edit Student Modal
    const editInputNameKh = document.getElementById("editInputNameKh");
    const editInputNameEn = document.getElementById("editInputNameEn");
    if (editInputNameKh && editInputNameEn) {
      editInputNameKh.addEventListener("input", (e) => {
        if (!editInputNameEn.dataset.manualEdited || !editInputNameEn.value.trim()) {
          if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin) {
            editInputNameEn.value = TeacherToolsService.transliterateKhmerToLatin(e.target.value);
          }
        }
      });
      editInputNameEn.addEventListener("input", () => {
        editInputNameEn.dataset.manualEdited = "true";
      });
    }

    // Add Student Avatar File & Compression
    const addAvatarFile = document.getElementById("modalAddAvatarFile");
    const addAvatarPreview = document.getElementById("modalAddAvatarPreview");
    const addAvatarInput = document.getElementById("modalAddAvatarInput");
    const addGenderSelect = document.getElementById("modalAddGenderSelect");

    if (addAvatarFile && addAvatarPreview) {
      addAvatarFile.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            addAvatarPreview.style.opacity = "0.5";
            let finalUrl = "";
            let providerName = "";

            if (typeof ImageHostService !== "undefined") {
              const res = await ImageHostService.upload(file, "modal_add_student");
              if (res.success && res.url) {
                finalUrl = res.url;
                providerName = res.provider;
              }
            }

            if (!finalUrl) {
              finalUrl = await StudentAPI.compressImage(file, 480, 0.82);
            }

            addAvatarPreview.src = finalUrl;
            addAvatarPreview.style.display = "block";
            const placeholder = document.getElementById("enrollAvatarPlaceholder");
            if (placeholder) placeholder.style.display = "none";
            if (addAvatarInput) addAvatarInput.value = finalUrl;
            const provKh = providerName === "server" ? "Local Server" : (providerName === "imgbb" ? "ImgBB CDN" : (providerName === "freeimage" ? "FreeImage CDN" : (providerName === "telegram" ? "Telegram CDN" : "Optimized")));
            App.showToast(`📸 រូបថតត្រូវបានផ្ទុកឡើងលើ HostImg (${provKh}) រួចរាល់!`, "success");
          } catch (err) {
            App.showToast("មិនអាចដំណើរការរូបភាពបានទេ!", "error");
          } finally {
            addAvatarPreview.style.opacity = "1";
          }
        }
      });
    }

    if (addAvatarInput && addAvatarPreview) {
      addAvatarInput.addEventListener("input", (e) => {
        const url = e.target.value.trim();
        const placeholder = document.getElementById("enrollAvatarPlaceholder");
        if (url) {
          addAvatarPreview.src = url;
          addAvatarPreview.style.display = "block";
          if (placeholder) placeholder.style.display = "none";
        } else {
          addAvatarPreview.src = "";
          addAvatarPreview.style.display = "none";
          if (placeholder) placeholder.style.display = "flex";
        }
      });
    }

    if (addGenderSelect && addAvatarPreview) {
      addGenderSelect.addEventListener("change", (e) => {
        if (!addAvatarInput || !addAvatarInput.value) {
          addAvatarPreview.src = App.getDefaultAvatar(e.target.value);
        }
      });
    }

    // Record Payment Form submission
    const payForm = document.getElementById("recordPaymentForm");
    if (payForm) {
      payForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (typeof FeesView !== "undefined" && FeesView.handlePaymentFormSubmit) {
          await FeesView.handlePaymentFormSubmit(payForm);
        }
      });
    }

    // ----------------------------------------------------
    // EXCEL / CSV BULK IMPORT LOGIC
    // ----------------------------------------------------
    let parsedStudentsImportList = [];

    const btnDownloadTmpl = document.getElementById("btnDownloadExcelTemplate");
    if (btnDownloadTmpl) {
      btnDownloadTmpl.addEventListener("click", () => {
        const header = "ID,NameKh,NameEn,Gender,Dob,Phone,GuardianPhone,Grade,Course,Shift,Address,PIN,Status";
        const sampleRows = [
          "TX01,សុខ ចាន់ដារ៉ា,SOK CHANDARA,ប្រុស,2006-05-12,012345678,098765432,ថ្នាក់កុំព្យូទ័រ,Typing,ព្រឹក,ខេត្តកំពត,123,Active",
          "TX02,គង់ ម៉ារីណា,KONG MARINA,ស្រី,2007-08-20,011223344,077889900,ថ្នាក់កុំព្យូទ័រ,Microsoft Word,ថ្ងៃ,កណ្តាល,123,Active",
          "TX03,សេង វិបុល,SENG VIBOL,ប្រុស,2005-11-15,088990011,099112233,ថ្នាក់កុំព្យូទ័រ,Microsoft Excel,រសៀល,សៀមរាប,123,Active",
          "TX04,លឹម ស្រីនាង,LIM SREINEANG,ស្រី,2006-02-28,097665544,015443322,ថ្នាក់កុំព្យូទ័រ,Microsoft PowerPoint,ព្រឹក,បាត់ដំបង,123,Active"
        ];
        // Add UTF-8 BOM so Excel opens Khmer font correctly
        const csvContent = "\uFEFF" + [header, ...sampleRows].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "TIS_Lab_Computer_Students_Template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        App.showToast("បានទាញយកទម្រង់គំរូ Template CSV ជោគជ័យ!", "success");
      });
    }

    const fileInput = document.getElementById("excelFileInput");
    const dropZone = document.getElementById("excelDropZone");
    const previewContainer = document.getElementById("excelImportPreviewContainer");
    const previewTableBody = document.getElementById("importPreviewTableBody");
    const previewCountBadge = document.getElementById("importPreviewCountBadge");
    const previewFileInfo = document.getElementById("importPreviewFileInfo");
    const btnConfirmImport = document.getElementById("btnConfirmBatchImport");
    const btnConfirmText = document.getElementById("btnConfirmBatchImportText");

    const processFile = async (file) => {
      if (!file) return;
      try {
        if (dropZone) dropZone.style.opacity = "0.6";
        const fileName = file.name;
        const fileExt = fileName.split(".").pop().toLowerCase();

        let rawRows = [];

        if (typeof XLSX !== "undefined" && (fileExt === "xlsx" || fileExt === "xls" || fileExt === "csv")) {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        } else {
          // Fallback text CSV parser
          const text = await file.text();
          const lines = text.split(/\r?\n/).filter(line => line.trim());
          if (lines.length > 1) {
            const headers = lines[0].replace(/^\uFEFF/, "").split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
              const rowObj = {};
              headers.forEach((h, idx) => { rowObj[h] = cols[idx] || ""; });
              rawRows.push(rowObj);
            }
          }
        }

        if (!rawRows || rawRows.length === 0) {
          App.showToast("ឯកសារនេះមិនមានទិន្នន័យសិស្សឡើយ!", "warning");
          return;
        }

        // Normalize and map columns
        parsedStudentsImportList = rawRows.map((r, idx) => {
          const keys = Object.keys(r);
          const findVal = (possibleKeys, fallback = "") => {
            for (const pk of possibleKeys) {
              const found = keys.find(k => k.trim().toLowerCase() === pk.toLowerCase());
              if (found && r[found] !== undefined && String(r[found]).trim() !== "") {
                return String(r[found]).trim();
              }
            }
            return fallback;
          };

          const nameKh = findVal(["NameKh", "ឈ្មោះខ្មែរ", "ឈ្មោះ", "Name", "StudentName"], `សិស្សថ្មី ${idx + 1}`);
          let nameEn = findVal(["NameEn", "ឈ្មោះឡាតាំង", "EnglishName", "LatinName"], "");
          if ((!nameEn || !nameEn.trim() || /[\u1780-\u17FF]/.test(nameEn)) && nameKh) {
            nameEn = (typeof TeacherToolsService !== "undefined" && TeacherToolsService.transliterateKhmerToLatin)
              ? TeacherToolsService.transliterateKhmerToLatin(nameKh)
              : (typeof StudentAPI !== "undefined" && StudentAPI.transliterateKhmerToLatin ? StudentAPI.transliterateKhmerToLatin(nameKh) : "");
          }
          let gender = findVal(["Gender", "ភេទ", "Sex"], "ប្រុស");
          if (gender.includes("F") || gender.includes("ស្រី")) gender = "ស្រី";
          else gender = "ប្រុស";

          let course = findVal(["Course", "វគ្គ", "វគ្គសិក្សា", "CourseName"], "Typing");
          if (course.toLowerCase().includes("word")) course = "Microsoft Word";
          else if (course.toLowerCase().includes("excel")) course = "Microsoft Excel";
          else if (course.toLowerCase().includes("powerpoint") || course.toLowerCase().includes("ppt")) course = "Microsoft PowerPoint";
          else course = "Typing";

          let shift = findVal(["Shift", "វេន", "វេនសិក្សា"], "ព្រឹក");
          if (shift.includes("ថ្ងៃ") || shift.includes("15")) shift = "ថ្ងៃ";
          else if (shift.includes("រសៀល") || shift.includes("17")) shift = "រសៀល";
          else shift = "ព្រឹក";

          const id = findVal(["ID", "អត្តលេខ", "StudentId"], "AUTO");
          const dob = findVal(["Dob", "ថ្ងៃកំណើត", "BirthDate"], "2006-01-01");
          const phone = findVal(["Phone", "ទូរស័ព្ទ", "លេខទូរស័ព្ទ"], "");
          const guardianPhone = findVal(["GuardianPhone", "លេខអាណាព្យាបាល", "អាណាព្យាបាល"], "");
          const address = findVal(["Address", "អាសយដ្ឋាន", "ខេត្ត"], "ខេត្តកំពត");
          const pin = findVal(["PIN", "លេខសម្ងាត់"], "123");
          const status = findVal(["Status", "ស្ថានភាព"], "Active");

          return {
            ID: id,
            NameKh: nameKh,
            NameEn: nameEn,
            Gender: gender,
            Dob: dob,
            Phone: phone,
            GuardianPhone: guardianPhone,
            Grade: "ថ្នាក់កុំព្យូទ័រ",
            Course: course,
            Shift: shift,
            Address: address,
            PIN: pin,
            Status: status,
            StartDate: new Date().toISOString().split("T")[0]
          };
        }).filter(s => s.NameKh && s.NameKh.trim());

        if (parsedStudentsImportList.length === 0) {
          App.showToast("រកមិនឃើញទិន្នន័យសិស្សត្រឹមត្រូវក្នុងឯកសារនេះទេ!", "error");
          return;
        }

        // Render preview table
        if (previewTableBody) {
          previewTableBody.innerHTML = parsedStudentsImportList.map((st, idx) => `
            <tr>
              <td style="text-align: center; color: var(--text-muted);">${idx + 1}</td>
              <td><span class="font-mono font-bold text-indigo-600">${st.ID === 'AUTO' ? '<em style="color:#94a3b8;">ស្វ័យប្រវត្ត</em>' : st.ID}</span></td>
              <td><strong>${st.NameKh}</strong></td>
              <td>${st.NameEn || '—'}</td>
              <td><span class="badge ${st.Gender === 'ស្រី' ? 'badge-gender-female' : 'badge-gender-male'}">${st.Gender}</span></td>
              <td><span class="badge badge-course">${st.Course}</span></td>
              <td>${st.Shift}</td>
              <td>${st.Phone || '—'}</td>
            </tr>
          `).join('');
        }

        if (previewCountBadge) previewCountBadge.textContent = `${parsedStudentsImportList.length} នាក់`;
        if (previewFileInfo) previewFileInfo.innerHTML = `ឯកសារ៖ <strong>${fileName}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
        if (previewContainer) previewContainer.style.display = "block";

        if (btnConfirmImport && btnConfirmText) {
          btnConfirmImport.disabled = false;
          btnConfirmText.textContent = `បញ្ជាក់ការបញ្ចូលសិស្ស (${parsedStudentsImportList.length} នាក់)`;
        }

        App.showToast(`បានអានទិន្នន័យជោគជ័យ៖ សិស្សសរុប ${parsedStudentsImportList.length} នាក់!`, "info");
      } catch (err) {
        App.showToast("កំហុសក្នុងការអានឯកសារ Excel: " + err.message, "error");
      } finally {
        if (dropZone) dropZone.style.opacity = "1";
      }
    };

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
      });
    }

    if (dropZone) {
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#059669";
        dropZone.style.background = "rgba(16, 185, 129, 0.12)";
      });
      dropZone.addEventListener("dragleave", () => {
        dropZone.style.borderColor = "#10b981";
        dropZone.style.background = "rgba(16, 185, 129, 0.04)";
      });
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#10b981";
        dropZone.style.background = "rgba(16, 185, 129, 0.04)";
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
      });
    }

    // Confirm Batch Import button
    if (btnConfirmImport) {
      btnConfirmImport.addEventListener("click", async () => {
        if (!parsedStudentsImportList || parsedStudentsImportList.length === 0) return;

        btnConfirmImport.disabled = true;
        btnConfirmImport.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងបញ្ចូលទិន្នន័យ...`;

        try {
          const result = await StudentAPI.createStudentsBatch(parsedStudentsImportList);
          App.showToast(`🎉 បានបញ្ចូលសិស្ស ${result.count} នាក់ ទៅកាន់ Firebase និងប្រព័ន្ធដោយជោគជ័យ!`, "success");
          App.triggerConfetti();

          // Refresh application state
          await App.loadData(false);
          App.renderView();

          // Close modal and reset
          ModalsComponent.close("importExcelModal");
          parsedStudentsImportList = [];
          if (fileInput) fileInput.value = "";
          if (previewContainer) previewContainer.style.display = "none";
        } catch (err) {
          App.showToast("បញ្ចូលសិស្សបរាជ័យ: " + err.message, "error");
        } finally {
          btnConfirmImport.disabled = false;
          btnConfirmImport.innerHTML = `<i class="fa-solid fa-check"></i> <span id="btnConfirmBatchImportText">បញ្ជាក់ការបញ្ចូលសិស្ស</span>`;
        }
      });
    }

    // Filter tabs in Leave Request Admin Modal
    document.querySelectorAll("[data-leave-filter]").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        document.querySelectorAll("[data-leave-filter]").forEach(b => b.classList.remove("active"));
        tabBtn.classList.add("active");
        const filter = tabBtn.getAttribute("data-leave-filter");
        if (typeof AttendanceView !== "undefined" && AttendanceView.renderLeaveRequestsList) {
          AttendanceView.renderLeaveRequestsList(filter);
        }
      });
    });

    // =========================================================================
    // Upgraded Student Profile & Finance Modal Interactive Listeners
    // =========================================================================
    // 1. Student Details Tab Switching (Zero-lag instantaneous toggle)
    document.querySelectorAll("[data-student-tab]").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        const targetTab = tabBtn.getAttribute("data-student-tab");
        document.querySelectorAll("[data-student-tab]").forEach(b => b.classList.remove("active"));
        tabBtn.classList.add("active");

        document.querySelectorAll(".student-tab-pane").forEach(pane => pane.classList.remove("active"));
        const targetPane = document.getElementById(`pane-${targetTab}`);
        if (targetPane) targetPane.classList.add("active");
      });
    });

    // 2. Student Profile "ផ្សេងៗ" Dropdown Menu
    const moreBtn = document.getElementById("profileBtnMore");
    const moreMenu = document.getElementById("profileMoreMenu");
    if (moreBtn && moreMenu) {
      moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        moreMenu.classList.toggle("show");
      });
      document.addEventListener("click", () => {
        moreMenu.classList.remove("show");
      });
    }

    // 3. Edit Student Button Listeners
    const profileEditBtn = document.getElementById("profileBtnEdit");
    if (profileEditBtn) {
      profileEditBtn.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          App.openEditModal(App.state.selectedStudent.ID);
        }
      });
    }

    const modalFooterEditBtn = document.getElementById("modalFooterEditBtn");
    if (modalFooterEditBtn) {
      modalFooterEditBtn.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          App.openEditModal(App.state.selectedStudent.ID);
        }
      });
    }

    // 4. Toggle Student Status (ផ្អាកការសិក្សា / បន្តការសិក្សា)
    const profileToggleStatusBtn = document.getElementById("profileBtnToggleStatus");
    if (profileToggleStatusBtn) {
      profileToggleStatusBtn.addEventListener("click", async () => {
        if (App.state.selectedStudent) {
          await App.toggleStudentStatus(App.state.selectedStudent.ID);
        }
      });
    }

    // 5. Change Avatar directly from camera badge
    const avatarInput = document.getElementById("profileAvatarFileInput");
    const avatarImg = document.getElementById("profileHeaderAvatar");
    if (avatarInput && avatarImg) {
      avatarInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file && App.state.selectedStudent) {
          try {
            avatarImg.style.opacity = "0.5";
            const compressed = await StudentAPI.compressImage(file, 480, 0.82);
            avatarImg.src = compressed;
            App.state.selectedStudent.Avatar = compressed;
            await StudentAPI.updateStudent(App.state.selectedStudent);
            App.showToast("បានផ្លាស់ប្តូររូបថតសិស្សដោយជោគជ័យ!", "success");
            await App.loadData(false);
          } catch (err) {
            App.showToast("មិនអាចផ្លាស់ប្តូររូបភាពបានទេ!", "error");
          } finally {
            avatarImg.style.opacity = "1";
          }
        }
      });
    }

    // 6. Quick Payment Form Controls in Finance Tab
    const openQuickPay = () => {
      // Ensure Finance tab is active
      const finTabBtn = document.querySelector("[data-student-tab='finance']");
      if (finTabBtn) finTabBtn.click();

      const box = document.getElementById("inlineQuickPayBox");
      if (box) {
        box.style.display = "block";
        const dateInput = document.getElementById("quickPayDate");
        if (dateInput && !dateInput.value) {
          dateInput.value = new Date().toISOString().split("T")[0];
        }
        const amtInput = document.getElementById("quickPayAmount");
        if (amtInput) amtInput.focus();
      }
    };

    const addPayBtn1 = document.getElementById("profileBtnAddPayment");
    const addPayBtn2 = document.getElementById("financeAddPaymentBtn");
    if (addPayBtn1) addPayBtn1.addEventListener("click", openQuickPay);
    if (addPayBtn2) addPayBtn2.addEventListener("click", openQuickPay);

    const closeQuickPay = () => {
      const box = document.getElementById("inlineQuickPayBox");
      if (box) box.style.display = "none";
    };
    const closePayBtn = document.getElementById("closeQuickPayBtn");
    const cancelPayBtn = document.getElementById("cancelQuickPayBtn");
    if (closePayBtn) closePayBtn.addEventListener("click", closeQuickPay);
    if (cancelPayBtn) cancelPayBtn.addEventListener("click", closeQuickPay);

    const submitQuickPayBtn = document.getElementById("submitQuickPayBtn");
    if (submitQuickPayBtn) {
      submitQuickPayBtn.addEventListener("click", async () => {
        await App.handleQuickPaymentSubmit();
      });
    }

    // 7. Dropdown Menu Items
    const itemPrintId = document.getElementById("menuItemPrintIdCard");
    if (itemPrintId) {
      itemPrintId.addEventListener("click", () => {
        App.printStudentIdCard();
      });
    }

    const itemPrintTrans = document.getElementById("menuItemPrintTranscript");
    if (itemPrintTrans) {
      itemPrintTrans.addEventListener("click", () => {
        if (typeof ExamsView !== "undefined" && App.state.selectedStudent) {
          ExamsView.printStudentTranscript(App.state.selectedStudent.ID);
        }
      });
    }

    const itemIssueCert = document.getElementById("menuItemIssueCert");
    const servicesCertBtn = document.getElementById("servicesCertBtn");
    const handleIssueCert = () => {
      if (typeof CertificatesView !== "undefined" && App.state.selectedStudent) {
        CertificatesView.openIssueModal(App.state.selectedStudent.ID);
      } else {
        App.showToast("សូមចូលទៅកាន់ទំព័រវិញ្ញាបនបត្រដើម្បីចេញប័ណ្ណ!", "info");
      }
    };
    if (itemIssueCert) itemIssueCert.addEventListener("click", handleIssueCert);
    if (servicesCertBtn) servicesCertBtn.addEventListener("click", handleIssueCert);

    const itemResetPin = document.getElementById("menuItemResetPin");
    if (itemResetPin) {
      itemResetPin.addEventListener("click", async () => {
        if (App.state.selectedStudent) {
          await App.resetStudentPin(App.state.selectedStudent.ID);
        }
      });
    }

    // Contact Hub Listeners
    const contactHubBtn = document.getElementById("profileBtnContactHub");
    if (contactHubBtn) {
      contactHubBtn.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.openQuickContactModal(App.state.selectedStudent.ID);
        }
      });
    }
    const menuContactHub = document.getElementById("menuItemContactHub");
    if (menuContactHub) {
      menuContactHub.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.openQuickContactModal(App.state.selectedStudent.ID);
        }
      });
    }

    // Receipt Modal Listeners
    const receiptBtn = document.getElementById("profileBtnReceipt");
    if (receiptBtn) {
      receiptBtn.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.openStudentReceiptModal(App.state.selectedStudent.ID);
        }
      });
    }
    const finReceiptBtn = document.getElementById("financeOpenReceiptBtn");
    if (finReceiptBtn) {
      finReceiptBtn.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.openStudentReceiptModal(App.state.selectedStudent.ID);
        }
      });
    }
    const menuReceipt = document.getElementById("menuItemDigitalReceiptModal");
    if (menuReceipt) {
      menuReceipt.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.openStudentReceiptModal(App.state.selectedStudent.ID);
        }
      });
    }

    const itemDeleteStudent = document.getElementById("menuItemDeleteStudent");
    if (itemDeleteStudent) {
      itemDeleteStudent.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.close("studentDetailsModal");
          App.confirmDeleteStudent(App.state.selectedStudent.ID);
        }
      });
    }

    // 8. Print Modal / Fee Receipts
    const financePrintBtn = document.getElementById("financePrintHistoryBtn");
    if (financePrintBtn) {
      financePrintBtn.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof FeesView !== "undefined") {
          FeesView.printOfficialReceipt(App.state.selectedStudent.ID);
        }
      });
    }

    const footerPrintBtn = document.getElementById("modalFooterPrintBtn");
    if (footerPrintBtn) {
      footerPrintBtn.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof FeesView !== "undefined") {
          FeesView.printOfficialReceipt(App.state.selectedStudent.ID);
        } else {
          App.printStudentIdCard();
        }
      });
    }

    // 9. Mark Dropout and Mark Graduate Action Listeners
    const profileBtnMarkDrop = document.getElementById("profileBtnMarkDrop");
    if (profileBtnMarkDrop) {
      profileBtnMarkDrop.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof DroppedStudentsView !== "undefined") {
          DroppedStudentsView.openMarkDropoutModal(App.state.selectedStudent.ID);
        }
      });
    }

    const menuItemMarkDrop = document.getElementById("menuItemMarkDrop");
    if (menuItemMarkDrop) {
      menuItemMarkDrop.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof DroppedStudentsView !== "undefined") {
          DroppedStudentsView.openMarkDropoutModal(App.state.selectedStudent.ID);
        }
      });
    }

    const profileBtnMarkGraduate = document.getElementById("profileBtnMarkGraduate");
    if (profileBtnMarkGraduate) {
      profileBtnMarkGraduate.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof GraduatedStudentsView !== "undefined") {
          GraduatedStudentsView.openMarkGraduateModal(App.state.selectedStudent.ID);
        }
      });
    }

    const menuItemMarkGraduate = document.getElementById("menuItemMarkGraduate");
    if (menuItemMarkGraduate) {
      menuItemMarkGraduate.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof GraduatedStudentsView !== "undefined") {
          GraduatedStudentsView.openMarkGraduateModal(App.state.selectedStudent.ID);
        }
      });
    }

    const menuItemReactivateStudent = document.getElementById("menuItemReactivateStudent");
    if (menuItemReactivateStudent) {
      menuItemReactivateStudent.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof DroppedStudentsView !== "undefined") {
          DroppedStudentsView.confirmReactivate(App.state.selectedStudent.ID);
        }
      });
    }

    // Dropout Modal Event Listeners
    const dropoutSelect = document.getElementById("dropoutSelectStudent");
    if (dropoutSelect) {
      dropoutSelect.addEventListener("change", (e) => {
        if (typeof DroppedStudentsView !== "undefined") {
          DroppedStudentsView.onStudentSelectChanged(e.target.value);
        }
      });
    }

    const btnSubmitDropout = document.getElementById("btnSubmitDropout");
    if (btnSubmitDropout) {
      btnSubmitDropout.addEventListener("click", async () => {
        if (typeof DroppedStudentsView !== "undefined") {
          await DroppedStudentsView.handleDropoutSubmit();
        }
      });
    }

    // Graduate Modal Event Listeners
    const graduateSelect = document.getElementById("graduateSelectStudent");
    if (graduateSelect) {
      graduateSelect.addEventListener("change", (e) => {
        if (typeof GraduatedStudentsView !== "undefined") {
          GraduatedStudentsView.onStudentSelectChanged(e.target.value);
        }
      });
    }

    const btnSubmitGraduate = document.getElementById("btnSubmitGraduate");
    if (btnSubmitGraduate) {
      btnSubmitGraduate.addEventListener("click", async () => {
        if (typeof GraduatedStudentsView !== "undefined") {
          await GraduatedStudentsView.handleGraduateSubmit();
        }
      });
    }

    // ----------------------------------------------------
    // TEACHER TOOLS: PROFILE MENU EXTENSIONS (LETTERS & SHIFT SWITCH)
    // ----------------------------------------------------
    const itemOfficialLetter = document.getElementById("menuItemOfficialLetter");
    if (itemOfficialLetter) {
      itemOfficialLetter.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.openOfficialLetterModal(App.state.selectedStudent);
        }
      });
    }

    const itemQuickSwitchShift = document.getElementById("menuItemQuickSwitchShift");
    if (itemQuickSwitchShift) {
      itemQuickSwitchShift.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.openQuickSwitchShiftModal(App.state.selectedStudent);
        }
      });
    }

    const itemStudentNotes = document.getElementById("menuItemStudentNotes");
    if (itemStudentNotes) {
      itemStudentNotes.addEventListener("click", () => {
        if (App.state.selectedStudent) {
          ModalsComponent.openStudentNotesModal(App.state.selectedStudent);
        }
      });
    }

    const itemSendTelegramReceipt = document.getElementById("menuItemSendTelegramReceipt");
    if (itemSendTelegramReceipt) {
      itemSendTelegramReceipt.addEventListener("click", async () => {
        if (App.state.selectedStudent && typeof TeacherToolsService !== "undefined") {
          const fees = (typeof StudentAPI !== "undefined" && StudentAPI.getFees) ? StudentAPI.getFees() : {};
          const f = fees[App.state.selectedStudent.ID];
          const amount = f ? (f.paidAmount || 50) : 50;
          await TeacherToolsService.sendDigitalReceiptToTelegram(App.state.selectedStudent, amount, "បង់ថ្លៃសិក្សាវគ្គកុំព្យូទ័រ");
        }
      });
    }

    const itemGenerateCv = document.getElementById("menuItemGenerateCv");
    if (itemGenerateCv) {
      itemGenerateCv.addEventListener("click", () => {
        if (App.state.selectedStudent && typeof TeacherToolsService !== "undefined") {
          TeacherToolsService.generateStudentCvPortfolioA4(App.state.selectedStudent);
        }
      });
    }

    const printOfficialLetterBtn = document.getElementById("btnPrintOfficialLetterBtn");
    if (printOfficialLetterBtn) {
      printOfficialLetterBtn.addEventListener("click", () => {
        if (!ModalsComponent._letterStudent) return;
        const checkedRadio = document.querySelector("input[name='officialLetterType']:checked");
        const typeVal = checkedRadio ? checkedRadio.value.toLowerCase() : "enrollment";
        if (typeof TeacherToolsService !== "undefined") {
          TeacherToolsService.printOfficialLetter(typeVal, ModalsComponent._letterStudent);
        }
        ModalsComponent.close("officialLettersModal");
      });
    }

    const copyLinkBtn = document.getElementById("btnCopySelfRegLink");
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => {
        const input = document.getElementById("selfRegUrlInput");
        if (input) {
          navigator.clipboard.writeText(input.value);
          App.showToast("បានចម្លង Link ចុះឈ្មោះចូល Clipboard រួចរាល់!", "success");
        }
      });
    }

    // ----------------------------------------------------
    // TEACHER TOOLS: GLOBAL CTRL+V PHOTO PASTE (AUTO-CROP 3:4)
    // ----------------------------------------------------
    window.addEventListener("paste", async (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (!file) continue;

          const addModal = document.getElementById("addStudentModal");
          const editModal = document.getElementById("editModal");
          const isAddOpen = addModal && (addModal.classList.contains("open") || addModal.style.display === "flex");
          const isEditOpen = editModal && (editModal.classList.contains("open") || editModal.style.display === "flex");

          if (isAddOpen) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = async (evt) => {
              try {
                const cropped = (typeof TeacherToolsService !== "undefined")
                  ? await TeacherToolsService.cropToPassportAspectRatio(evt.target.result)
                  : evt.target.result;
                const input = document.getElementById("addInputAvatar");
                const preview = document.getElementById("addAvatarPreview");
                const place = document.getElementById("addAvatarPlaceholder");
                if (input) input.value = cropped;
                if (preview) { preview.src = cropped; preview.style.display = "block"; }
                if (place) place.style.display = "none";
                App.showToast("🎉 បានបិទភ្ជាប់រូបថតសិស្ស (Auto-Crop 3:4) ជោគជ័យ!", "success");
              } catch(err){}
            };
            reader.readAsDataURL(file);
            break;
          } else if (isEditOpen) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = async (evt) => {
              try {
                const cropped = (typeof TeacherToolsService !== "undefined")
                  ? await TeacherToolsService.cropToPassportAspectRatio(evt.target.result)
                  : evt.target.result;
                const input = document.getElementById("editInputAvatar");
                const preview = document.getElementById("editAvatarPreview");
                if (input) input.value = cropped;
                if (preview) preview.src = cropped;
                App.showToast("🎉 បានបិទភ្ជាប់រូបថតសិស្ស (Auto-Crop 3:4) ជោគជ័យ!", "success");
              } catch(err){}
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    });
  },

  initSelfRegQr() {
    const url = window.location.origin + window.location.pathname + '#self-register';
    const input = document.getElementById("selfRegUrlInput");
    const img = document.getElementById("selfRegQrImg");
    if (input) input.value = url;
    if (img) img.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
  },

  renderPendingRegistrationsList() {
    const container = document.getElementById("pendingRegistrationsListContainer");
    if (!container) return;

    const list = (typeof TeacherToolsService !== "undefined") ? TeacherToolsService.getPendingRegistrations() : [];
    if (!list || list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-clipboard-check fa-3x" style="color: #cbd5e1; margin-bottom: 12px; display: block;"></i>
          <h4 style="margin: 0 0 6px 0; color: var(--text-main);">មិនមានពាក្យសុំចុះឈ្មោះថ្មីនៅឡើយទេ</h4>
          <p style="font-size: 0.85rem; margin: 0;">ពេលសិស្សស្កេន QR Code បំពេញទិន្នន័យ នោះព័ត៌មាននឹងបង្ហាញនៅទីនេះភ្លាមៗ។</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => `
      <div style="background: var(--border-light); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="${item.Avatar || App.getDefaultAvatar(item.Gender)}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #059669;" alt="${item.NameKh}">
          <div>
            <div style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${item.NameKh} <span style="font-size: 0.8rem; color: var(--text-muted);">(${item.NameEn || ''})</span></div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
              <span>ភេទ៖ <strong>${item.Gender}</strong></span> • 
              <span>ទូរស័ព្ទ៖ <strong>${item.Phone}</strong></span> • 
              <span>វគ្គ៖ <strong>${item.Course || 'Typing'}</strong></span> • 
              <span>វេន៖ <strong>${item.Shift || 'ព្រឹក'}</strong></span>
            </div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">
              <i class="fa-regular fa-clock"></i> ស្នើសុំកាលពី៖ ${new Date(item.submittedAt || Date.now()).toLocaleString('km-KH')}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn-primary btn-sm" style="background: #059669; border-color: #059669; font-weight: 700; padding: 6px 14px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;" onclick="ModalsComponent.handleApprovePending('${item.reqId}')">
            <i class="fa-solid fa-check"></i> <span>យល់ព្រម (Approve)</span>
          </button>
          <button type="button" class="btn-outline-danger btn-sm" style="padding: 6px 12px; font-size: 0.82rem;" onclick="ModalsComponent.handleRejectPending('${item.reqId}')">
            <i class="fa-solid fa-xmark"></i> <span>បដិសេធ</span>
          </button>
        </div>
      </div>
    `).join("");
  },

  async handleApprovePending(reqId) {
    try {
      if (typeof TeacherToolsService !== "undefined") {
        const student = await TeacherToolsService.approveSelfRegistration(reqId);
        App.showToast(`🎉 បានយល់ព្រម និងបញ្ចូលសិស្ស ${student.NameKh} (ID: ${student.ID}) ចូលប្រព័ន្ធជោគជ័យ!`, "success");
        App.triggerConfetti();
        await App.loadData(false);
        this.renderPendingRegistrationsList();
        if (typeof DirectoryView !== "undefined" && DirectoryView.updatePendingBadge) {
          DirectoryView.updatePendingBadge();
        }
      }
    } catch(err) {
      App.showToast("កំហុស៖ " + err.message, "error");
    }
  },

  async handleRejectPending(reqId) {
    if (!confirm("តើអ្នកពិតជាចង់បដិសេធពាក្យចុះឈ្មោះនេះមែនទេ?")) return;
    try {
      if (typeof TeacherToolsService !== "undefined") {
        await TeacherToolsService.rejectSelfRegistration(reqId);
        App.showToast("បានបដិសេធពាក្យចុះឈ្មោះរួចរាល់!", "info");
        this.renderPendingRegistrationsList();
        if (typeof DirectoryView !== "undefined" && DirectoryView.updatePendingBadge) {
          DirectoryView.updatePendingBadge();
        }
      }
    } catch(err) {
      App.showToast("កំហុស៖ " + err.message, "error");
    }
  },

  openOfficialLetterModal(student) {
    this._letterStudent = student;
    const nameEl = document.getElementById("officialLetterStudentName");
    if (nameEl) nameEl.textContent = `សម្រាប់សិស្ស៖ ${student.NameKh} (${student.ID}) - វគ្គ ${student.Course || 'កុំព្យូទ័រ'}`;
    this.open("officialLettersModal");
  },

  openQuickSwitchShiftModal(student) {
    this._switchShiftStudent = student;
    const nameEl = document.getElementById("quickSwitchShiftStudentName");
    const idInput = document.getElementById("quickSwitchStudentId");
    const shiftSelect = document.getElementById("quickSwitchNewShift");

    if (nameEl) nameEl.textContent = `${student.NameKh} (${student.ID}) - វេនបច្ចុប្បន្ន: ${student.Shift || 'ព្រឹក'}`;
    if (idInput) idInput.value = student.ID;
    if (shiftSelect && student.Shift) shiftSelect.value = student.Shift;

    this.open("quickSwitchShiftModal");
  },

  async handleQuickSwitchShiftSubmit() {
    const idInput = document.getElementById("quickSwitchStudentId");
    const shiftSelect = document.getElementById("quickSwitchNewShift");
    const studentId = idInput?.value;
    const newShift = shiftSelect?.value;

    if (!studentId || !newShift) return;

    let students = App.state.students || [];
    const student = students.find(s => s.ID === studentId);
    if (!student) return;

    const oldShift = student.Shift || 'ព្រឹក';
    student.Shift = newShift;

    if (typeof StudentAPI !== "undefined" && StudentAPI.updateStudent) {
      await StudentAPI.updateStudent(student);
    }

    App.showToast(`🎉 បានផ្លាស់ប្តូរវេនសិស្ស ${student.NameKh} ពី វេន${oldShift} ទៅ វេន${newShift} ដោយជោគជ័យ!`, "success");
    App.triggerConfetti();
    this.close("quickSwitchShiftModal");
    await App.loadData(false);

    // Refresh profile modal if open
    if (App.state.selectedStudent && App.state.selectedStudent.ID === studentId) {
      App.state.selectedStudent = student;
      const shiftBadge = document.getElementById("profileHeaderShift");
      if (shiftBadge) shiftBadge.textContent = `វេន${newShift}`;
    }
  },

  // ------------------------------------------------------------------------
  // EXAM COUNTDOWN TIMER CONTROLLERS
  // ------------------------------------------------------------------------
  _examTimer: {
    remaining: 30 * 60,
    total: 30 * 60,
    interval: null,
    running: false
  },

  openExamCountdownTimer(minutes = 30, title = "") {
    if (title) {
      const input = document.getElementById("examTimerTitleInput");
      if (input) input.value = title;
    }
    this.setExamTimerMinutes(minutes);
    this.open("examCountdownTimerModal");
  },

  setExamTimerMinutes(mins) {
    if (this._examTimer.interval) {
      clearInterval(this._examTimer.interval);
      this._examTimer.interval = null;
      this._examTimer.running = false;
    }
    this._examTimer.total = mins * 60;
    this._examTimer.remaining = mins * 60;
    this.updateExamTimerDisplay();

    const btn = document.getElementById("btnToggleExamTimer");
    const text = document.getElementById("btnToggleTimerText");
    const status = document.getElementById("examTimerStatusText");
    if (btn) btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    if (text) text.innerHTML = '<i class="fa-solid fa-play"></i> ចាប់ផ្តើម (Start)';
    if (status) status.innerHTML = '<i class="fa-solid fa-circle-pause text-amber-400"></i> កំពុងរង់ចាំការចាប់ផ្តើម';
  },

  updateExamTimerDisplay() {
    const el = document.getElementById("examTimerDigits");
    if (!el) return;
    const m = Math.floor(this._examTimer.remaining / 60);
    const s = this._examTimer.remaining % 60;
    el.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  },

  toggleExamTimer() {
    const btn = document.getElementById("btnToggleExamTimer");
    const text = document.getElementById("btnToggleTimerText");
    const status = document.getElementById("examTimerStatusText");
    const digits = document.getElementById("examTimerDigits");

    if (this._examTimer.running) {
      // Pause
      clearInterval(this._examTimer.interval);
      this._examTimer.interval = null;
      this._examTimer.running = false;
      if (btn) btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
      if (text) text.innerHTML = '<i class="fa-solid fa-play"></i> បន្ត (Resume)';
      if (status) status.innerHTML = '<i class="fa-solid fa-circle-pause text-amber-400"></i> បានផ្អាកជាបណ្តោះអាសន្ន';
    } else {
      // Start / Resume
      this._examTimer.running = true;
      if (btn) btn.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
      if (text) text.innerHTML = '<i class="fa-solid fa-pause"></i> ផ្អាក (Pause)';
      if (status) status.innerHTML = '<i class="fa-solid fa-circle-play text-emerald-400"></i> កំពុងរាប់ថយក្រោយ...';

      this._examTimer.interval = setInterval(() => {
        if (this._examTimer.remaining > 0) {
          this._examTimer.remaining--;
          this.updateExamTimerDisplay();
        } else {
          // Time is up!
          clearInterval(this._examTimer.interval);
          this._examTimer.interval = null;
          this._examTimer.running = false;
          if (digits) {
            digits.style.color = "#ef4444";
            digits.style.textShadow = "0 0 25px rgba(239, 68, 68, 0.8)";
          }
          if (status) status.innerHTML = '🚨 <strong style="color: #ef4444;">អស់ម៉ោងប្រឡងហើយ! សូមសិស្ស Save File និងឈប់វាយ!</strong>';
          if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.playExamAlarm) {
            TeacherToolsService.playExamAlarm();
          }
          App.showToast("⏰ អស់ម៉ោងប្រឡងហើយ! សូមប្រមូលកិច្ចការសិស្ស!", "warning");
        }
      }, 1000);
    }
  },

  resetExamTimer() {
    if (this._examTimer.interval) {
      clearInterval(this._examTimer.interval);
      this._examTimer.interval = null;
      this._examTimer.running = false;
    }
    this._examTimer.remaining = this._examTimer.total;
    const digits = document.getElementById("examTimerDigits");
    if (digits) {
      digits.style.color = "#38bdf8";
      digits.style.textShadow = "0 0 20px rgba(56, 189, 248, 0.6)";
    }
    this.updateExamTimerDisplay();

    const btn = document.getElementById("btnToggleExamTimer");
    const text = document.getElementById("btnToggleTimerText");
    const status = document.getElementById("examTimerStatusText");
    if (btn) btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    if (text) text.innerHTML = '<i class="fa-solid fa-play"></i> ចាប់ផ្តើម (Start)';
    if (status) status.innerHTML = '<i class="fa-solid fa-circle-pause text-amber-400"></i> បានកំណត់ឡើងវិញ';
  },

  toggleExamTimerFullscreen() {
    const box = document.getElementById("examTimerDisplayBox");
    if (!box) return;
    if (!document.fullscreenElement) {
      box.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  },

  // ------------------------------------------------------------------------
  // SCHOOL EXPENSES & PROFIT CONTROLLERS
  // ------------------------------------------------------------------------
  openSchoolExpensesModal() {
    this.renderExpensesContent();
    const dateInput = document.getElementById("newExpenseDate");
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }
    this.open("schoolExpensesModal");
  },

  renderExpensesContent() {
    if (typeof TeacherToolsService === "undefined") return;
    const summary = TeacherToolsService.getNetProfitSummary();

    const revEl = document.getElementById("expenseModalRevenue");
    const expEl = document.getElementById("expenseModalExpenses");
    const netEl = document.getElementById("expenseModalNetProfit");
    const tbody = document.getElementById("expenseModalTableBody");

    if (revEl) revEl.textContent = `$${summary.totalRevenue}`;
    if (expEl) expEl.textContent = `$${summary.totalExpenses}`;
    if (netEl) netEl.textContent = `$${summary.netProfit}`;

    if (tbody) {
      if (summary.expensesList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 16px;">មិនទាន់មានកំណត់ត្រាចំណាយនៅឡើយ</td></tr>`;
      } else {
        tbody.innerHTML = summary.expensesList.map(e => `
          <tr style="border-bottom: 1px solid var(--border-color, #e2e8f0);">
            <td style="padding: 8px 12px; font-weight: 600;">${e.title}</td>
            <td style="padding: 8px; text-align: center;"><span style="background: rgba(56, 189, 248, 0.1); color: #0284c7; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem;">${e.category}</span></td>
            <td style="padding: 8px; text-align: center; color: var(--text-muted);">${e.date}</td>
            <td style="padding: 8px 12px; text-align: right; font-weight: 800; color: #dc2626;">$${e.amount}</td>
            <td style="padding: 8px; text-align: center;">
              <button type="button" onclick="ModalsComponent.handleDeleteExpense('${e.id}')" style="background: none; border: none; color: #ef4444; cursor: pointer;" title="លុបចំណាយ">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
        `).join("");
      }
    }
  },

  handleRecordExpenseSubmit() {
    const titleInput = document.getElementById("newExpenseTitle");
    const catSelect = document.getElementById("newExpenseCategory");
    const amtInput = document.getElementById("newExpenseAmount");
    const dateInput = document.getElementById("newExpenseDate");

    const title = titleInput?.value.trim();
    const category = catSelect?.value;
    const amount = Number(amtInput?.value || 0);
    const date = dateInput?.value || new Date().toISOString().split("T")[0];

    if (!title || !amount) {
      App.showToast("សូមបំពេញបរិយាយ និងចំនួនទឹកប្រាក់ចំណាយ!", "warning");
      return;
    }

    if (typeof TeacherToolsService !== "undefined") {
      TeacherToolsService.recordExpense({ title, category, amount, date });
      App.showToast(`✅ បានកត់ត្រាចំណាយ $${amount} ដោយជោគជ័យ!`, "success");
      if (titleInput) titleInput.value = "";
      if (amtInput) amtInput.value = "";
      this.renderExpensesContent();
    }
  },

  handleDeleteExpense(id) {
    if (!confirm("តើអ្នកពិតជាចង់លុបកំណត់ត្រាចំណាយនេះមែនទេ?")) return;
    if (typeof TeacherToolsService !== "undefined") {
      TeacherToolsService.deleteExpense(id);
      App.showToast("បានលុបកំណត់ត្រាចំណាយរួចរាល់!", "info");
      this.renderExpensesContent();
    }
  },

  // ------------------------------------------------------------------------
  // 16-PC LAB MAINTENANCE GRID CONTROLLER
  // ------------------------------------------------------------------------
  openPcMaintenanceModal() {
    this.renderPcMaintenanceGrid();
    this.open("pcMaintenanceModal");
  },

  renderPcMaintenanceGrid() {
    const mount = document.getElementById("pcMaintenanceGridMount");
    if (!mount || typeof TeacherToolsService === "undefined") return;

    const logs = TeacherToolsService.getPcMaintenanceLogs();
    let html = "";

    for (let i = 1; i <= 16; i++) {
      const pcId = `PC-${String(i).padStart(2, "0")}`;
      const pc = logs[pcId] || { status: "Good", note: "ដំណើរការល្អ", lastChecked: "-" };

      const statusBadge = pc.status === "Good" 
        ? '<span style="background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">🟢 ដំណើរការល្អ</span>'
        : pc.status === "Warning"
        ? '<span style="background: #fef9c3; color: #a16207; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">🟡 ត្រូវតាមដាន</span>'
        : '<span style="background: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">🔴 ខូច/ជួសជុល</span>';

      html += `
        <div style="background: var(--bg-surface-hover, #f8fafc); border: 1.5px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 1rem; color: #0284c7; font-family: monospace;">${pcId}</strong>
              ${statusBadge}
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
              ចំណាំ៖ <em>${pc.note || 'គ្មាន'}</em>
            </div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">
              ពិនិត្យចុងក្រោយ៖ ${pc.lastChecked}
            </div>
          </div>

          <div style="display: flex; gap: 4px; margin-top: 10px; border-top: 1px dashed var(--border-color, #cbd5e1); padding-top: 8px;">
            <select onchange="ModalsComponent.handleUpdatePcStatus('${pcId}', this.value)" class="form-control" style="font-size: 0.72rem; padding: 2px 6px; height: 26px;">
              <option value="Good" ${pc.status === "Good" ? "selected" : ""}>ល្អ</option>
              <option value="Warning" ${pc.status === "Warning" ? "selected" : ""}>តាមដាន</option>
              <option value="Broken" ${pc.status === "Broken" ? "selected" : ""}>ខូច</option>
            </select>
            <button type="button" onclick="ModalsComponent.promptPcNote('${pcId}', '${App.escapeHtml(pc.note || '')}')" class="btn-secondary" style="font-size: 0.72rem; padding: 2px 6px; height: 26px;" title="កែប្រែចំណាំ">
              <i class="fa-solid fa-pen"></i>
            </button>
          </div>
        </div>
      `;
    }

    mount.innerHTML = html;
  },

  handleUpdatePcStatus(pcId, newStatus) {
    if (typeof TeacherToolsService === "undefined") return;
    const logs = TeacherToolsService.getPcMaintenanceLogs();
    const currentNote = logs[pcId]?.note || "";
    TeacherToolsService.savePcMaintenanceStatus(pcId, newStatus, currentNote);
    App.showToast(`បានកែប្រែស្ថានភាព ${pcId} ទៅជា ${newStatus}!`, "success");
    this.renderPcMaintenanceGrid();
  },

  promptPcNote(pcId, currentNote) {
    const note = prompt(`បញ្ចូលកំណត់ត្រាសម្គាល់សម្រាប់ ${pcId}:`, currentNote);
    if (note !== null && typeof TeacherToolsService !== "undefined") {
      const logs = TeacherToolsService.getPcMaintenanceLogs();
      const currentStatus = logs[pcId]?.status || "Good";
      TeacherToolsService.savePcMaintenanceStatus(pcId, currentStatus, note);
      App.showToast(`បានកត់ត្រាចំណាំសម្រាប់ ${pcId}!`, "success");
      this.renderPcMaintenanceGrid();
    }
  },

  // ------------------------------------------------------------------------
  // TELEGRAM COCKPIT & 3-GROUP COMMAND CENTER CONTROLLERS
  // ------------------------------------------------------------------------
  openTelegramBroadcastModal(initialTab = "buzz") {
    const students = (typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents)
      ? StudentAPI.getLocalStudents()
      : (App.state.students || []);

    const morningCount = students.filter(s => (s.Shift || "").includes("ព្រឹក")).length;
    const afternoonCount = students.filter(s => (s.Shift || "").includes("រសៀល")).length;
    const nightCount = students.filter(s => (s.Shift || "").includes("យប់")).length;

    const elM = document.getElementById("teleHubMorningCount");
    const elA = document.getElementById("teleHubAfternoonCount");
    const elN = document.getElementById("teleHubNightCount");
    if (elM) elM.textContent = `${morningCount} នាក់`;
    if (elA) elA.textContent = `${afternoonCount} នាក់`;
    if (elN) elN.textContent = `${nightCount} នាក់`;

    const isConnected = (typeof TelegramService !== "undefined" && TelegramService.isEnabled && TelegramService.isEnabled());
    const badge = document.getElementById("teleHubStatusBadge");
    if (badge) {
      if (isConnected) {
        badge.innerHTML = `<span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 6px #34d399;"></span> <span>Bot ភ្ជាប់ជោគជ័យ</span>`;
        badge.style.background = "rgba(16, 185, 129, 0.25)";
        badge.style.borderColor = "rgba(52, 211, 153, 0.4)";
        badge.style.color = "#a7f3d0";
      } else {
        badge.innerHTML = `<span style="width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 6px #f59e0b;"></span> <span>មិនទាន់ភ្ជាប់ Bot Token</span>`;
        badge.style.background = "rgba(245, 158, 11, 0.25)";
        badge.style.borderColor = "rgba(245, 158, 11, 0.4)";
        badge.style.color = "#fde68a";
      }
    }

    this.switchTelegramHubTab(initialTab);

    // Apply default preset if content is empty
    const hwContent = document.getElementById("teleHwContentInput");
    if (hwContent && !hwContent.value.trim()) {
      this.applyTelegramHomeworkPreset("Typing");
    }

    this.open("telegramBroadcastModal");
  },

  openTelegramHubModal(initialTab = "buzz") {
    this.openTelegramBroadcastModal(initialTab);
  },

  switchTelegramHubTab(tabName) {
    const tabs = document.querySelectorAll(".tele-hub-tab");
    tabs.forEach(t => {
      if (t.getAttribute("data-tab") === tabName) {
        t.classList.add("active");
      } else {
        t.classList.remove("active");
      }
    });

    const panels = document.querySelectorAll(".tele-hub-panel");
    panels.forEach(p => {
      p.classList.remove("active");
    });

    const activePanel = document.getElementById(`telePanel-${tabName}`);
    if (activePanel) {
      activePanel.classList.add("active");
    }
  },

  openTelegramHomeworkForShift(shift) {
    this.switchTelegramHubTab("hw");
    const shiftSelect = document.getElementById("teleHwTargetShift");
    if (shiftSelect) shiftSelect.value = shift;
  },

  applyTelegramHomeworkPreset(course) {
    const titleInput = document.getElementById("teleHwTitleInput");
    const contentInput = document.getElementById("teleHwContentInput");
    const courseSelect = document.getElementById("teleHwCourseSelect");
    if (courseSelect && courseSelect.value !== course) {
      courseSelect.value = course;
    }
    if (!titleInput || !contentInput) return;

    if (course === "Typing") {
      titleInput.value = "វាយអត្ថបទល្បឿន 25+ WPM & ភាពត្រឹមត្រូវ";
      contentInput.value = "1. ហាត់វាយអត្ថបទខ្មែរតាមមេរៀនយ៉ាងតិច ១៥ នាទី\n2. គោលដៅល្បឿន 25+ WPM និងភាពត្រឹមត្រូវ 95%+\n3. ត្រៀម Flash Drive (USB) មកចម្លងលំហាត់ថ្មីនៅម៉ោងបន្ទាប់";
    } else if (course === "Microsoft Word") {
      titleInput.value = "បង្កើតតារាង និងរៀបចំទម្រង់ A4 ស្អាត";
      contentInput.value = "1. អនុវត្តបញ្ចូល Table 5x4 និងកំណត់ Header Row ឲ្យបានស្អាត\n2. ប្រើពុម្ពអក្សរ Khmer OS Battambang ទំហំ 12pt\n3. រក្សាទុកកិច្ចការក្នុង Flash Drive ដើម្បីយកមកបង្ហាញលោកគ្រូ";
    } else if (course === "Microsoft Excel") {
      titleInput.value = "គណនារូបមន្ត SUM, AVERAGE, IF & RANK";
      contentInput.value = "1. បង្កើតតារាងបញ្ជីវត្តមាន និងពិន្ទុសិស្សគំរូ\n2. ប្រើប្រាស់រូបមន្ត =SUM(), =AVERAGE(), =IF(), =RANK()\n3. ដាក់ទម្រង់ Conditional Formatting ពណ៌បៃតងលើសិស្សជាប់";
    } else if (course === "Microsoft PowerPoint") {
      titleInput.value = "រៀបចំស្លាយបទបង្ហាញ ៥ ទំព័រ";
      contentInput.value = "1. បង្កើត Slide យ៉ាងតិច ៥ ទំព័រ តាមប្រធានបទដែលប្អូនចូលចិត្ត\n2. ដាក់ Transition រលូន និង Animation សមស្របមិនឲ្យរញ៉េរញ៉ៃ\n3. ត្រៀមឡើងធ្វើ Presentation សាកល្បងនៅម៉ោងបន្ទាប់";
    }
  },

  async handleSendClassBuzz(shift = "ALL") {
    const shiftKh = shift === "ALL" ? "គ្រប់គ្រុបទាំង ៣ (ព្រឹក • រសៀល • យប់)" : "វេន" + shift;
    if (confirm(`តើលោកគ្រូចង់រោទ៍រំលឹកចូលរៀន ១៥ នាទីមុន ទៅកាន់គ្រុប (${shiftKh}) មែនទេ?`)) {
      if (typeof TeacherToolsService !== "undefined") {
        await TeacherToolsService.broadcastShiftClassReminder(shift);
      }
    }
  },

  async handleSendHomeworkSubmit() {
    const shift = document.getElementById("teleHwTargetShift")?.value || "ALL";
    const course = document.getElementById("teleHwCourseSelect")?.value || "Typing";
    const title = document.getElementById("teleHwTitleInput")?.value.trim();
    const content = document.getElementById("teleHwContentInput")?.value.trim();

    if (!title || !content) {
      App.showToast("សូមបំពេញចំណងជើង និងខ្លឹមសារកិច្ចការផ្ទះ!", "warning");
      return;
    }

    if (typeof TeacherToolsService !== "undefined") {
      await TeacherToolsService.broadcastShiftHomework(shift, course, title, content);
      this.close("telegramBroadcastModal");
    }
  },

  async handleSendEmergencySubmit() {
    const shift = document.getElementById("teleEmergencyTargetShift")?.value || "ALL";
    const type = document.getElementById("teleEmergencyTypeSelect")?.value || "RAIN";
    const customDetail = document.getElementById("teleEmergencyDetailInput")?.value.trim() || "";

    const shiftKh = shift === "ALL" ? "គ្រប់គ្រុបទាំង ៣" : "វេន" + shift;
    if (confirm(`តើលោកគ្រូចង់ផ្សាយដំណឹងបន្ទាន់នេះទៅកាន់គ្រុប Telegram (${shiftKh}) មែនទេ?`)) {
      if (typeof TeacherToolsService !== "undefined") {
        await TeacherToolsService.broadcastShiftEmergency(shift, type, customDetail);
        this.close("telegramBroadcastModal");
      }
    }
  },

  async handleSendExamBroadcastSubmit() {
    const course = document.getElementById("teleExamCourseSelect")?.value || "Typing";
    const shift = document.getElementById("teleExamTargetShift")?.value || "ALL";
    const shiftKh = shift === "ALL" ? "គ្រប់គ្រុបទាំង ៣" : "វេន" + shift;

    if (confirm(`តើលោកគ្រូចង់ផ្សាយតារាងពិន្ទុ «${course}» ទៅកាន់គ្រុប Telegram (${shiftKh}) មែនទេ?`)) {
      if (typeof TeacherToolsService !== "undefined") {
        await TeacherToolsService.broadcastShiftExamResults(shift, course);
        this.close("telegramBroadcastModal");
      }
    }
  },

  async handleBroadcastTop3FromHub() {
    const course = document.getElementById("teleExamCourseSelect")?.value || "Typing";
    const shift = document.getElementById("teleExamTargetShift")?.value || "ALL";
    if (typeof TeacherToolsService !== "undefined") {
      await TeacherToolsService.broadcastTop3ToTelegram(course, shift);
      this.close("telegramBroadcastModal");
    }
  },

  handlePrintTop3PosterFromHub() {
    const course = document.getElementById("teleExamCourseSelect")?.value || "Typing";
    const shift = document.getElementById("teleExamTargetShift")?.value || "ALL";
    if (typeof TeacherToolsService !== "undefined") {
      TeacherToolsService.generateTop3HonorRollPosterA4(course, shift);
      this.close("telegramBroadcastModal");
    }
  },

  async handleSendDeskAnnouncement() {
    if (confirm("តើលោកគ្រូចង់ផ្សាយមគ្គុទ្ទេសក៍តុសេវាសិស្ស និងការសុំច្បាប់ /leave ទៅកាន់គ្រប់គ្រុប Telegram ទាំង ៣ មែនទេ?")) {
      if (typeof TelegramService !== "undefined") {
        await TelegramService.publishStudentDeskToShifts("ALL");
        if (typeof App !== "undefined" && App.showToast) {
          App.showToast("📢 បានផ្សាយមគ្គុទ្ទេសក៍តុសេវាសិស្សចូលគ្រប់គ្រុប Telegram ជោគជ័យ!", "success");
        }
      }
    }
  },

  applyBroadcastTemplate(type) {
    const titleInput = document.getElementById("broadcastTitleInput");
    const contentInput = document.getElementById("broadcastContentInput");
    if (!titleInput || !contentInput) return;

    if (type === "HOLIDAY") {
      titleInput.value = "📢 ដំណឹងឈប់សម្រាកបុណ្យជាតិ";
      contentInput.value = "ជម្រាបជូនសិស្សានុសិស្សទាំងអស់៖ នៅថ្ងៃស្អែកនេះ សាលានឹងត្រូវឈប់សម្រាកបុណ្យជាតិចំនួន ១ ថ្ងៃ។ ថ្នាក់រៀនកុំព្យូទ័រនឹងបើកបង្រៀនជាធម្មតាឡើងវិញនៅថ្ងៃបន្ទាប់។ សូមអរគុណ!";
    } else if (type === "EXAM") {
      titleInput.value = "📝 កាលវិភាគប្រឡងបញ្ចប់វគ្គកុំព្យូទ័រ";
      contentInput.value = "ជម្រាបជូនសិស្សានុសិស្សទាំងអស់៖ សាលានឹងរៀបចំការប្រឡងអនុវត្តជាក់ស្តែងនៅចុងសប្តាហ៍នេះ។ សូមប្អូនៗអញ្ជើញមកឱ្យបានទាន់ពេលវេលា និងកុំភ្លេចយកកាតសិស្សមកជាមួយ!";
    } else if (type === "USB") {
      titleInput.value = "💾 រំលឹកការយក Flash Drive (USB) មកផ្ទុកមេរៀន";
      contentInput.value = "សូមប្អូនៗសិស្សានុសិស្សទាំងអស់យក Flash Drive ឬ USB ទំហំយ៉ាងតិច 4GB មកជាមួយនៅម៉ោងរៀន ដើម្បី Copy លំហាត់គំរូ និងឯកសារមេរៀនយកទៅអនុវត្តនៅផ្ទះបន្ថែម!";
    } else if (type === "PRACTICE") {
      titleInput.value = "🚀 បើកបន្ទប់ Lab អនុវត្តកុំព្យូទ័រសេរី";
      contentInput.value = "ដំណឹងល្អ! បន្ទប់កុំព្យូទ័រ TIS Lab បើកទ្វារស្វាគមន៍សិស្សដែលមានបំណងចង់មកអនុវត្តមេរៀនសេរីនៅថ្ងៃសៅរ៍ ដោយឥតគិតថ្លៃ។ សូមមកកក់កុំព្យូទ័រជាមួយលោកគ្រូ!";
    }
  },

  async handleTelegramBroadcastSubmit() {
    const shift = document.getElementById("broadcastTargetShift")?.value || "ALL";
    const title = document.getElementById("broadcastTitleInput")?.value.trim();
    const content = document.getElementById("broadcastContentInput")?.value.trim();

    if (!title || !content) {
      App.showToast("សូមបំពេញចំណងជើង និងខ្លឹមសារសេចក្តីជូនដំណឹង!", "warning");
      return;
    }

    if (typeof TeacherToolsService !== "undefined") {
      await TeacherToolsService.sendTelegramClassBroadcast(shift, title, content);
      this.close("telegramBroadcastModal");
    }
  },

  // ------------------------------------------------------------------------
  // TOP 3 HONOR ROLL POSTER CONTROLLERS
  // ------------------------------------------------------------------------
  openTop3HonorRollModal() {
    this.open("top3HonorRollModal");
  },

  handlePrintTop3Poster() {
    const mod = document.getElementById("top3ModuleSelect")?.value || "Microsoft Word";
    const shift = document.getElementById("top3ShiftSelect")?.value || "ALL";

    if (typeof TeacherToolsService !== "undefined") {
      TeacherToolsService.generateTop3HonorRollPosterA4(mod, shift);
      this.close("top3HonorRollModal");
    }
  },

  async handleBroadcastTop3ToTelegram() {
    const mod = document.getElementById("top3ModuleSelect")?.value || "Microsoft Word";
    const shift = document.getElementById("top3ShiftSelect")?.value || "ALL";

    if (typeof TeacherToolsService !== "undefined") {
      await TeacherToolsService.broadcastTop3ToTelegram(mod, shift);
      this.close("top3HonorRollModal");
    }
  },

  // ------------------------------------------------------------------------
  // PRACTICAL EXERCISE LIBRARY CONTROLLER
  // ------------------------------------------------------------------------
  openExerciseLibraryModal() {
    this.renderExerciseLibraryList();
    this.open("exerciseLibraryModal");
  },

  renderExerciseLibraryList() {
    const mount = document.getElementById("exerciseLibraryListMount");
    if (!mount || typeof TeacherToolsService === "undefined") return;

    const list = TeacherToolsService.getLabExerciseBank();
    mount.innerHTML = list.map(ex => `
      <div style="background: var(--bg-surface-hover, #f8fafc); border: 1.5px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; gap: 14px;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="background: #e0e7ff; color: #4338ca; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">${ex.module}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">[${ex.id}]</span>
            <span style="font-size: 0.75rem; color: #10b981; font-weight: 600;"><i class="fa-regular fa-clock"></i> ${ex.duration}</span>
          </div>
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">${ex.title}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${ex.instructions.length} ចំណុចនៃការអនុវត្តជាក់ស្តែង</div>
        </div>
        <button type="button" onclick="TeacherToolsService.printExerciseHandoutA4('${ex.id}')" class="btn-primary" style="background: #4f46e5; border-color: #4f46e5; font-size: 0.85rem; padding: 8px 16px; white-space: nowrap;">
          <i class="fa-solid fa-print"></i> <span>បោះពុម្ព A4</span>
        </button>
      </div>
    `).join("");
  },

  // ------------------------------------------------------------------------
  // STUDENT OBSERVATION NOTES CONTROLLERS
  // ------------------------------------------------------------------------
  openStudentNotesModal(student) {
    if (!student) return;
    this._noteStudent = student;

    const targetName = document.getElementById("studentNotesTargetName");
    const targetId = document.getElementById("studentNotesTargetId");
    if (targetName) targetName.textContent = `សម្រាប់សិស្ស៖ ${student.NameKh} (${student.ID}) - ${student.Course || 'កុំព្យូទ័រ'}`;
    if (targetId) targetId.value = student.ID;

    this.renderStudentNotesHistory(student.ID);
    this.open("studentNotesModal");
  },

  renderStudentNotesHistory(studentId) {
    const mount = document.getElementById("studentNotesListMount");
    if (!mount || typeof TeacherToolsService === "undefined") return;

    const notes = TeacherToolsService.getStudentNotes(studentId);
    if (notes.length === 0) {
      mount.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 12px;">មិនទាន់មានកំណត់ត្រាលើសិស្សនេះនៅឡើយ</div>`;
    } else {
      mount.innerHTML = notes.map(n => `
        <div style="background: var(--bg-surface-hover, #f8fafc); border-left: 3px solid #0d9488; padding: 8px 12px; border-radius: 4px; font-size: 0.82rem;">
          <div style="color: var(--text-main); line-height: 1.5; margin-bottom: 4px;">${App.escapeHtml(n.text)}</div>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted);">
            <span>📅 ${n.date}</span>
            <span>✍️ ${n.author || 'លោកគ្រូ ខៀន ធូ'}</span>
          </div>
        </div>
      `).join("");
    }
  },

  handleSaveStudentNote() {
    const targetId = document.getElementById("studentNotesTargetId")?.value;
    const input = document.getElementById("newStudentNoteInput");
    const text = input?.value.trim();

    if (!targetId || !text) {
      App.showToast("សូមសរសេរកំណត់សម្គាល់មុនពេលរក្សាទុក!", "warning");
      return;
    }

    if (typeof TeacherToolsService !== "undefined") {
      TeacherToolsService.saveStudentNote(targetId, text);
      App.showToast("បានរក្សាទុកកំណត់ត្រាសិស្សជោគជ័យ!", "success");
      if (input) input.value = "";
      this.renderStudentNotesHistory(targetId);
    }
  },

  // ------------------------------------------------------------------------
  // 31. CLASSROOM HUD & LUCKY WHEEL CONTROLLERS
  // ------------------------------------------------------------------------
  _hudCurrentAngle: 0,
  _hudIsSpinning: false,

  openClassroomHud(shift = "ព្រឹក") {
    const shiftSelect = document.getElementById("hudShiftSelect");
    if (shiftSelect) {
      shiftSelect.value = shift;
    }
    this.refreshHudShiftStudents();
    this.open("classroomHudModal");
  },

  refreshHudShiftStudents() {
    const shiftSelect = document.getElementById("hudShiftSelect");
    const shift = shiftSelect ? shiftSelect.value : "ព្រឹក";
    const allStudents = (typeof App !== "undefined" && App.state && App.state.students) ? App.state.students : [];
    const activeShiftStudents = allStudents.filter(s => {
      const matchShift = (s.Shift === shift || (!s.Shift && shift === "ព្រឹក"));
      const isActive = (s.Status !== "Dropped" && s.Status !== "Drop" && s.Status !== "Graduated");
      return matchShift && isActive;
    });

    this.drawLuckyWheel(activeShiftStudents, this._hudCurrentAngle);
    const winnerBox = document.getElementById("luckyWheelWinnerBox");
    if (winnerBox) winnerBox.style.display = "none";
  },

  drawLuckyWheel(students, angle = 0) {
    const canvas = document.getElementById("luckyWheelCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = [
      "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
      "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6",
      "#6366f1", "#f97316", "#84cc16", "#0ea5e9"
    ];

    if (!students || students.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#334155";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#475569";
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 13px 'Kantumruy Pro', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("គ្មានសិស្សក្នុងវេននេះ", cx, cy);
      return;
    }

    const total = students.length;
    const arc = (2 * Math.PI) / total;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    for (let i = 0; i < total; i++) {
      const startAngle = i * arc;
      const endAngle = startAngle + arc;

      // Draw Sector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#0f172a";
      ctx.stroke();

      // Draw Student Name
      ctx.save();
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'Kantumruy Pro', sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 3;

      let name = students[i].NameKh || students[i].NameEn || students[i].ID;
      if (name.length > 9) name = name.substring(0, 8) + "…";
      ctx.fillText(name, radius - 14, 4);
      ctx.restore();
    }

    // Center Bullseye Hub
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#38bdf8";
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("TIS", 0, 1);

    ctx.restore();
  },

  spinLuckyWheel() {
    if (this._hudIsSpinning) return;
    const shiftSelect = document.getElementById("hudShiftSelect");
    const shift = shiftSelect ? shiftSelect.value : "ព្រឹក";
    const allStudents = (typeof App !== "undefined" && App.state && App.state.students) ? App.state.students : [];
    let students = allStudents.filter(s => {
      const matchShift = (s.Shift === shift || (!s.Shift && shift === "ព្រឹក"));
      const isActive = (s.Status !== "Dropped" && s.Status !== "Drop" && s.Status !== "Graduated");
      return matchShift && isActive;
    });

    if (students.length === 0) {
      students = allStudents.filter(s => s.Status !== "Dropped" && s.Status !== "Drop" && s.Status !== "Graduated");
    }

    if (students.length === 0) {
      App.showToast("មិនមានសិស្សក្នុងប្រព័ន្ធសម្រាប់ចាប់ឆ្នោតឡើយ!", "warning");
      return;
    }

    this._hudIsSpinning = true;
    const btn = document.getElementById("btnSpinLuckyWheel");
    if (btn) btn.disabled = true;

    const winnerBox = document.getElementById("luckyWheelWinnerBox");
    if (winnerBox) winnerBox.style.display = "none";

    const winningIndex = Math.floor(Math.random() * students.length);
    const winner = students[winningIndex];

    const total = students.length;
    const arc = (2 * Math.PI) / total;
    // Pointer is at the top (angle = 3 * Math.PI / 2 or -Math.PI / 2).
    const targetSectorCenter = winningIndex * arc + arc / 2;
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const finalAngle = extraSpins + ((3 * Math.PI / 2) - targetSectorCenter);

    const duration = 3800; // ms
    const startTime = performance.now();
    const startAngle = this._hudCurrentAngle % (2 * Math.PI);
    const totalRotation = finalAngle - startAngle;

    let lastTickTime = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + totalRotation * ease;

      this._hudCurrentAngle = currentAngle;
      this.drawLuckyWheel(students, currentAngle);

      // Play tick sound every ~100-250ms during spin
      if (currentTime - lastTickTime > (80 + progress * 200)) {
        lastTickTime = currentTime;
        if (typeof TeacherToolsService !== "undefined") {
          TeacherToolsService.playSoundEffect("spin");
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this._hudIsSpinning = false;
        if (btn) btn.disabled = false;

        // Reveal Winner
        const winnerNameEl = document.getElementById("luckyWheelWinnerName");
        if (winnerNameEl) {
          winnerNameEl.textContent = `${winner.NameKh} (${winner.ID}) - វេន៖ ${winner.Shift || 'ព្រឹក'}`;
        }
        if (winnerBox) winnerBox.style.display = "block";

        if (typeof TeacherToolsService !== "undefined") {
          TeacherToolsService.playSoundEffect("applause");
        }
        if (typeof App !== "undefined" && App.triggerConfetti) {
          App.triggerConfetti();
        }
      }
    };

    requestAnimationFrame(animate);
  },

  toggleHudFullscreen() {
    const card = document.querySelector("#classroomHudModal .modal-card") || document.getElementById("classroomHudModal");
    if (!card) return;
    if (!document.fullscreenElement) {
      if (card.requestFullscreen) {
        card.requestFullscreen();
      } else if (card.webkitRequestFullscreen) {
        card.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  },

  triggerAttentionBanner() {
    if (typeof TeacherToolsService !== "undefined") {
      TeacherToolsService.playSoundEffect("bell");
    }
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("🛑 សូមសិស្សានុសិស្សទាំងអស់ផ្អាកការអនុវត្ត និងងាកមកស្តាប់ការពន្យល់របស់លោកគ្រូ! (EYES ON TEACHER)", "warning");
    }
    if (typeof TimetableLabView !== "undefined" && TimetableLabView.broadcastAttentionMode) {
      TimetableLabView.broadcastAttentionMode();
    }
  },

  // ------------------------------------------------------------------------
  // 32. EXAM PACKAGE ENGINE CONTROLLER
  // ------------------------------------------------------------------------
  openExamPackageGeneratorModal() {
    this.open("examPackageGeneratorModal");
  },

  handlePrintExamPackage() {
    const moduleSelect = document.getElementById("examPkgModuleSelect");
    const levelSelect = document.getElementById("examPkgLevelSelect");
    const module = moduleSelect ? moduleSelect.value : "Microsoft Excel";
    const level = levelSelect ? levelSelect.value : "កម្រិតមធ្យម";

    if (typeof TeacherToolsService !== "undefined") {
      TeacherToolsService.generateFullExamPackageA4(module, level);
      this.close("examPackageGeneratorModal");
    }
  },

  // ------------------------------------------------------------------------
  // 33. DROPOUT EARLY-WARNING RADAR CONTROLLERS
  // ------------------------------------------------------------------------
  openDropoutRadarModal() {
    this.open("dropoutRadarModal");
    try {
      this.renderDropoutRadarList();
    } catch (e) {
      console.error("Error in renderDropoutRadarList:", e);
    }
  },

  renderDropoutRadarList() {
    const mount = document.getElementById("dropoutRadarListMount");
    const badge = document.getElementById("dropoutRadarCountBadge");
    if (!mount) return;

    let list = [];
    if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.getDropoutRadarList) {
      try {
        list = TeacherToolsService.getDropoutRadarList() || [];
      } catch (err) {
        console.error("Error in getDropoutRadarList:", err);
      }
    }

    if (badge) {
      badge.textContent = `រកឃើញ ${list.length} នាក់`;
      badge.style.background = list.length > 0 ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)";
    }

    if (list.length === 0) {
      mount.innerHTML = `
        <div style="text-align: center; padding: 32px 20px; color: #10b981; font-weight: 700; background: rgba(16, 185, 129, 0.08); border-radius: 12px; border: 1.5px dashed rgba(16, 185, 129, 0.4);">
          <i class="fa-solid fa-circle-check" style="font-size: 2.5rem; margin-bottom: 10px; display: block;"></i>
          <div style="font-size: 1rem; color: #10b981; font-weight: 800;">អស្ចារ្យណាស់! គ្មានសិស្សណាស្ថិតក្នុងហានិភ័យបោះបង់ការសិក្សាឡើយ (All Good)</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">សិស្សទាំងអស់ចូលរៀនទៀងទាត់ និងមានពិន្ទុល្អ</div>
        </div>
      `;
      return;
    }

    mount.innerHTML = list.map(item => {
      const s = item.student;
      if (!s) return "";
      const isCritical = item.riskLevel === "CRITICAL";
      const isModerate = item.riskLevel === "MODERATE";
      const badgeStyle = isCritical
        ? "background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);"
        : (isModerate
          ? "background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4);"
          : "background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4);");

      const badgeText = isCritical
        ? "🔴 ហានិភ័យខ្ពស់ (Critical)"
        : (isModerate ? "🟡 ត្រូវតាមដាន (Moderate)" : "🔵 គួរតាមដាន (Watch)");

      const defaultAvatar = (typeof App !== "undefined" && App.getDefaultAvatar)
        ? App.getDefaultAvatar(s.Gender)
        : "assets/images/default-male.svg";
      const avatarSrc = s.Avatar || defaultAvatar;

      return `
        <div style="background: var(--bg-surface-hover, rgba(255,255,255,0.04)); border: 1.5px solid ${isCritical ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-color, rgba(255,255,255,0.1))'}; border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; gap: 14px; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
            <img src="${avatarSrc}" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid ${isCritical ? '#ef4444' : '#f59e0b'}; flex-shrink: 0;" alt="Avatar" onerror="this.src='${defaultAvatar}'">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <strong style="font-size: 0.98rem; color: var(--text-main);">${s.NameKh}</strong>
                <span style="font-size: 0.75rem; font-family: monospace; color: var(--text-muted); font-weight: 700;">[${s.ID}]</span>
                <span style="font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; ${badgeStyle}">${badgeText}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span>វេន៖ <strong>${s.Shift || 'ព្រឹក'}</strong> (${s.Course || 'កុំព្យូទ័រ'})</span>
                <span>•</span>
                <span style="color: ${isCritical ? '#f87171' : '#fbbf24'}; font-weight: 700;">⚠️ ${item.reasons}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <button type="button" onclick="ModalsComponent.handleSendRetention('${s.ID}')" class="btn-primary" style="background: #2563eb; border-color: #3b82f6; font-size: 0.8rem; padding: 7px 14px; white-space: nowrap; font-weight: 700; border-radius: 8px;" title="ផ្ញើសារលើកទឹកចិត្តទៅ Telegram">
              <i class="fa-brands fa-telegram"></i> <span>លើកទឹកចិត្ត</span>
            </button>
            <button type="button" onclick="ModalsComponent.close('dropoutRadarModal'); if (typeof App !== 'undefined' && App.viewStudentDetails) { App.viewStudentDetails('${s.ID}'); }" class="btn-secondary" style="font-size: 0.8rem; padding: 7px 12px; border-radius: 8px;" title="មើល Profile សិស្ស">
              <i class="fa-solid fa-user"></i>
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  async handleSendRetention(studentId) {
    let allStudents = (typeof App !== "undefined" && App.state && App.state.students) ? App.state.students : [];
    if (allStudents.length === 0 && typeof StudentAPI !== "undefined" && StudentAPI.getLocalStudents) {
      allStudents = StudentAPI.getLocalStudents();
    }
    const student = allStudents.find(s => String(s.ID).trim() === String(studentId).trim());
    if (!student) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("រកមិនឃើញទិន្នន័យសិស្សឡើយ!", "error");
      }
      return;
    }

    if (typeof TeacherToolsService !== "undefined") {
      await TeacherToolsService.sendRetentionEncouragementTelegram(student);
    }
  },

  // ------------------------------------------------------------------------
  // 34. 1-CLICK END-OF-DAY WRAP-UP CONTROLLER
  // ------------------------------------------------------------------------
  openEndOfDayWrapUpModal() {
    const mount = document.getElementById("endOfDayStatsMount");
    if (mount && typeof TeacherToolsService !== "undefined") {
      const students = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : [];
      const attData = (typeof StudentAPI !== "undefined" && StudentAPI.getAttendance) ? StudentAPI.getAttendance() : {};
      const today = new Date().toISOString().split("T")[0];
      const todayAtt = attData[today] || {};

      let present = 0;
      let absent = 0;
      let permission = 0;
      students.forEach(s => {
        const st = todayAtt[s.ID];
        if (st === "P") present++;
        else if (st === "A") absent++;
        else if (st === "L") permission++;
      });

      const summary = TeacherToolsService.getNetProfitSummary();

      mount.innerHTML = `
        <div style="font-size: 0.9rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px;">
          📊 ស្ថិតិសង្ខេបប្រចាំថ្ងៃ ${new Date().toLocaleDateString('km-KH')}៖
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center; margin-bottom: 12px;">
          <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); padding: 8px; border-radius: 8px;">
            <div style="font-size: 0.75rem; color: #10b981; font-weight: 700;">មានវត្តមាន</div>
            <div style="font-size: 1.3rem; font-weight: 900; color: #10b981;">${present}</div>
          </div>
          <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); padding: 8px; border-radius: 8px;">
            <div style="font-size: 0.75rem; color: #ef4444; font-weight: 700;">អវត្តមាន</div>
            <div style="font-size: 1.3rem; font-weight: 900; color: #ef4444;">${absent}</div>
          </div>
          <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); padding: 8px; border-radius: 8px;">
            <div style="font-size: 0.75rem; color: #f59e0b; font-weight: 700;">សុំច្បាប់</div>
            <div style="font-size: 1.3rem; font-weight: 900; color: #f59e0b;">${permission}</div>
          </div>
        </div>
        <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.6;">
          <div>• ចំនួនសិស្សសរុបទាំង ៣ វេន៖ <strong>${students.length} នាក់</strong></div>
          <div>• ចំណូលសរុបខែនេះ៖ <strong style="color: #10b981;">$${summary.totalRevenue}</strong> | ចំណាយ៖ <strong style="color: #ef4444;">$${summary.totalExpenses}</strong></div>
          <div>• ប្រាក់ចំណេញសុទ្ធបច្ចុប្បន្ន៖ <strong style="color: #4338ca; font-size: 0.95rem;">$${summary.netProfit}</strong></div>
        </div>
      `;
    }

    this.open("endOfDayWrapUpModal");
  },

  async handleConfirmEndOfDayWrapUp() {
    if (typeof TeacherToolsService !== "undefined") {
      await TeacherToolsService.executeEndOfDayWrapUp();
      this.close("endOfDayWrapUpModal");
    }
  },

  // ------------------------------------------------------------------------
  // 35. KHMER CALENDAR & TELEGRAM HOLIDAY BROADCAST CONTROLLERS
  // ------------------------------------------------------------------------
  _calCurrentYear: new Date().getFullYear(),
  _calCurrentMonth: new Date().getMonth(), // 0 to 11
  _selectedHolidayForBroadcast: null,

  openKhmerCalendarModal(year, month) {
    if (year !== undefined) this._calCurrentYear = year;
    if (month !== undefined) this._calCurrentMonth = month;

    this.renderKhmerCalendarView();
    this.open("khmerCalendarModal");
  },

  toggleCalendarFullscreen() {
    const modal = document.getElementById("khmerCalendarModal");
    const btn = document.getElementById("btnToggleCalFullscreen");
    if (!modal) return;

    const isFull = modal.classList.toggle("is-fullscreen");
    if (btn) {
      if (isFull) {
        btn.innerHTML = `<i class="fa-solid fa-compress"></i> <span>បង្រួម</span>`;
        btn.title = "បង្រួមអេក្រង់ធម្មតា (Exit Fullscreen)";
      } else {
        btn.innerHTML = `<i class="fa-solid fa-expand"></i> <span>ពេញអេក្រង់</span>`;
        btn.title = "ពង្រីកពេញអេក្រង់ (Toggle Fullscreen)";
      }
    }
  },

  setCalendarYear(year) {
    this._calCurrentYear = parseInt(year, 10);
    this.renderKhmerCalendarView();
  },

  renderKhmerCalendarView() {
    if (typeof KhmerCalendarService === "undefined") return;

    const y = this._calCurrentYear;
    const m = this._calCurrentMonth;

    // 1. Update Title Header (e.g. "ខែកញ្ញា ២០២៦")
    const titleEl = document.getElementById("calCurrentMonthTitle");
    if (titleEl) {
      const monthKh = KhmerCalendarService.khmerMonths[m];
      const yearKh = KhmerCalendarService.toKhmerNum(y);
      titleEl.textContent = `ខែ${monthKh} ឆ្នាំ${yearKh}`;
    }

    // Update Year Switcher active state
    [2025, 2026, 2027].forEach(yr => {
      const btn = document.getElementById(`calYearBtn${yr}`);
      if (btn) {
        if (yr === y) {
          btn.style.background = "#4338ca";
          btn.style.color = "#fff";
          btn.style.fontWeight = "800";
        } else {
          btn.style.background = "transparent";
          btn.style.color = "#cbd5e1";
          btn.style.fontWeight = "normal";
        }
      }
    });

    // 2. Render Upcoming Banner
    const bannerMount = document.getElementById("calendarUpcomingBannerMount");
    if (bannerMount) {
      const upcoming = KhmerCalendarService.getUpcomingHolidays(7);
      if (upcoming.length > 0) {
        const nextH = upcoming[0];
        const isUrgent = nextH.diffDays <= 2;
        bannerMount.innerHTML = `
          <div style="background: ${isUrgent ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(185, 28, 28, 0.32))' : 'rgba(56, 189, 248, 0.12)'}; border: 1.5px solid ${isUrgent ? '#ef4444' : '#38bdf8'}; border-radius: 14px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.2rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));">${nextH.icon || '🇰🇭'}</span>
              <div>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                  <strong style="font-size: 1.05rem; color: #fff; letter-spacing: 0.2px;">${nextH.title}</strong>
                  <span class="holiday-countdown-pill ${nextH.diffDays === 0 ? 'today' : ''}">${nextH.diffLabel}</span>
                </div>
                <div style="font-size: 0.84rem; color: #cbd5e1; margin-top: 4px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                  <span>📅 កាលបរិច្ឆេទ៖ <strong style="color: #fde68a;">${nextH.formattedDateKh}</strong></span>
                  <span>•</span>
                  <span>ចូលរៀនវិញ៖ <strong style="color: #34d399;">${nextH.resumeDateFormatted}</strong></span>
                </div>
              </div>
            </div>
            <button type="button" onclick="ModalsComponent.openHolidayBroadcastConfirm('${nextH.id}')" class="btn-primary" style="background: #2563eb; border-color: #3b82f6; font-weight: 800; font-size: 0.88rem; padding: 10px 18px; white-space: nowrap; box-shadow: 0 4px 18px rgba(37, 99, 235, 0.45); border-radius: 10px;">
              <i class="fa-brands fa-telegram"></i> <span>ផ្សាយដំណឹង Telegram ឥឡូវនេះ</span>
            </button>
          </div>
        `;
      } else {
        bannerMount.innerHTML = "";
      }
    }

    // 3. Render Calendar Grid
    this.renderKhmerCalendarGrid(y, m);

    // 4. Render Holidays List
    this.renderUpcomingHolidaysList(y, m);
  },

  renderKhmerCalendarGrid(year, month) {
    const mount = document.getElementById("calDaysGridMount");
    if (!mount || typeof KhmerCalendarService === "undefined") return;

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    let cellsHtml = "";

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      cellsHtml += `
        <div class="cal-day-cell other-month">
          <div class="day-header-row">
            <span class="day-khmer-num">${KhmerCalendarService.toKhmerNum(dayNum)}</span>
            <span class="day-latin-num">${dayNum}</span>
          </div>
        </div>
      `;
    }

    // Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateStr = `${year}-${mStr}-${dStr}`;

      const isToday = (dateStr === todayStr);
      const holiday = KhmerCalendarService.getHolidayByDate(dateStr);

      let cellClasses = "cal-day-cell";
      if (isToday) cellClasses += " today";
      if (holiday) {
        if (holiday.type === "school_break") {
          cellClasses += " custom-holiday";
        } else {
          cellClasses += " holiday";
        }
      }

      let holidayTagHtml = "";
      if (holiday) {
        const isCustom = holiday.type === "school_break";
        holidayTagHtml = `
          <div class="day-holiday-tag ${isCustom ? 'school-tag' : ''}" title="${holiday.title}">
            <span>${holiday.icon || (isCustom ? '🏫' : '🇰🇭')}</span>
            <span>${holiday.title}</span>
          </div>
        `;
      }

      let todayBadge = "";
      if (isToday && !holiday) {
        todayBadge = `<span class="day-today-indicator"><i class="fa-solid fa-circle-dot"></i> ថ្ងៃនេះ</span>`;
      }

      cellsHtml += `
        <div class="${cellClasses}" onclick="ModalsComponent.onCalendarDayClick('${dateStr}')" title="${isToday ? 'ថ្ងៃនេះ' : ''} ${holiday ? ' - ' + holiday.title : 'ចុចដើម្បីថែមថ្ងៃឈប់'}">
          <div class="day-header-row">
            <span class="day-khmer-num">${KhmerCalendarService.toKhmerNum(day)}</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              ${todayBadge}
              <span class="day-latin-num">${day}</span>
            </div>
          </div>
          ${holidayTagHtml}
        </div>
      `;
    }

    // Next month padding to fill complete weeks (rows of 7)
    const totalRendered = firstDayIndex + totalDaysInMonth;
    const remainingSlots = (7 - (totalRendered % 7)) % 7;
    for (let d = 1; d <= remainingSlots; d++) {
      cellsHtml += `
        <div class="cal-day-cell other-month">
          <div class="day-header-row">
            <span class="day-khmer-num">${KhmerCalendarService.toKhmerNum(d)}</span>
            <span class="day-latin-num">${d}</span>
          </div>
        </div>
      `;
    }

    mount.innerHTML = cellsHtml;
  },

  renderUpcomingHolidaysList(year, month) {
    const mount = document.getElementById("calHolidaysListMount");
    const badge = document.getElementById("calHolidaysCountBadge");
    if (!mount || typeof KhmerCalendarService === "undefined") return;

    const allHolidays = KhmerCalendarService.getHolidaysForYear(year);
    const mStr = String(month + 1).padStart(2, "0");
    const currentPrefix = `${year}-${mStr}`;

    const monthHolidays = allHolidays.filter(h => h.dateStr.startsWith(currentPrefix));
    const upcomingList = KhmerCalendarService.getUpcomingHolidays(30);

    const displayList = [...monthHolidays];
    upcomingList.forEach(u => {
      if (!displayList.some(h => h.id === u.id)) {
        displayList.push(u);
      }
    });

    displayList.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

    if (badge) {
      badge.textContent = `${KhmerCalendarService.toKhmerNum(displayList.length)} ពិធីបុណ្យ`;
    }

    if (displayList.length === 0) {
      mount.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; color: var(--text-muted); font-size: 0.9rem;">
          <i class="fa-solid fa-calendar-check" style="font-size: 2rem; opacity: 0.4; margin-bottom: 8px; display: block;"></i>
          មិនមានថ្ងៃឈប់សម្រាកក្នុងខែនេះឡើយ
        </div>
      `;
      return;
    }

    mount.innerHTML = displayList.map(h => {
      const isCustom = h.type === "school_break";
      const dateKh = KhmerCalendarService.formatKhmerShortDate(h.dateStr);

      return `
        <div class="upcoming-holiday-card ${h.diffDays <= 2 ? 'urgent' : ''}">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
            <div style="font-size: 1.6rem; width: 44px; height: 44px; border-radius: 10px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);">
              ${h.icon || (isCustom ? '🏫' : '🇰🇭')}
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <strong style="font-size: 0.92rem; color: #fff;">${h.title}</strong>
                ${isCustom ? `<span style="font-size: 0.68rem; background: #e0e7ff; color: #4338ca; padding: 1px 6px; border-radius: 4px; font-weight: 700;">សាលា</span>` : ''}
              </div>
              <div style="font-size: 0.78rem; color: #cbd5e1; margin-top: 3px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span>📅 ${dateKh}</span>
                ${h.diffLabel ? `<span style="color: #fbbf24; font-weight: 700;">(${h.diffLabel})</span>` : ''}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0;">
            <button type="button" onclick="ModalsComponent.openHolidayBroadcastConfirm('${h.id}')" class="btn-primary" style="background: #2563eb; border-color: #3b82f6; font-size: 0.78rem; padding: 6px 12px; font-weight: 700; border-radius: 8px;" title="ផ្សាយដំណឹង Telegram ទៅគ្រុបសិស្ស">
              <i class="fa-brands fa-telegram"></i> <span>ផ្សាយ Telegram</span>
            </button>
            <button type="button" onclick="KhmerCalendarService.printHolidayNoticeA4(${JSON.stringify(h).replace(/"/g, '&quot;')})" class="btn-secondary" style="font-size: 0.78rem; padding: 6px 10px; border-radius: 8px;" title="បោះពុម្ព A4 បិទមុខបន្ទប់ Lab">
              <i class="fa-solid fa-print"></i>
            </button>
            ${isCustom ? `
              <button type="button" onclick="ModalsComponent.handleDeleteCustomHoliday('${h.id}')" class="btn-secondary" style="color: #ef4444; font-size: 0.78rem; padding: 6px 10px; border-radius: 8px;" title="លុបថ្ងៃឈប់សម្រាកនេះ">
                <i class="fa-solid fa-trash"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");
  },

  prevCalendarMonth() {
    this._calCurrentMonth--;
    if (this._calCurrentMonth < 0) {
      this._calCurrentMonth = 11;
      this._calCurrentYear--;
    }
    this.renderKhmerCalendarView();
  },

  nextCalendarMonth() {
    this._calCurrentMonth++;
    if (this._calCurrentMonth > 11) {
      this._calCurrentMonth = 0;
      this._calCurrentYear++;
    }
    this.renderKhmerCalendarView();
  },

  todayCalendarMonth() {
    const today = new Date();
    this._calCurrentYear = today.getFullYear();
    this._calCurrentMonth = today.getMonth();
    this.renderKhmerCalendarView();
  },

  onCalendarDayClick(dateStr) {
    if (typeof KhmerCalendarService === "undefined") return;
    const holiday = KhmerCalendarService.getHolidayByDate(dateStr);
    if (holiday) {
      this.openHolidayBroadcastConfirm(holiday.id);
    } else {
      this.toggleAddCustomHolidayForm(true);
      const startInp = document.getElementById("custHoliStart");
      const endInp = document.getElementById("custHoliEnd");
      if (startInp) startInp.value = dateStr;
      if (endInp) endInp.value = dateStr;
    }
  },

  toggleAddCustomHolidayForm(forceOpen = null) {
    const box = document.getElementById("customHolidayFormBox");
    if (!box) return;
    if (forceOpen === true) box.style.display = "block";
    else if (forceOpen === false) box.style.display = "none";
    else box.style.display = (box.style.display === "none" || !box.style.display) ? "block" : "none";
  },

  handleSaveCustomHoliday() {
    const title = document.getElementById("custHoliTitle")?.value.trim();
    const startDate = document.getElementById("custHoliStart")?.value;
    const endDate = document.getElementById("custHoliEnd")?.value || startDate;
    const resumeDate = document.getElementById("custHoliResume")?.value;
    const note = document.getElementById("custHoliNote")?.value.trim();

    if (!title || !startDate) {
      App.showToast("សូមបញ្ចូលឈ្មោះ និងកាលបរិច្ឆេទថ្ងៃឈប់សម្រាក!", "warning");
      return;
    }

    if (typeof KhmerCalendarService !== "undefined") {
      KhmerCalendarService.saveCustomHoliday({
        title,
        startDate,
        endDate,
        resumeDate,
        note
      });
      App.showToast("បានរក្សាទុកថ្ងៃឈប់សម្រាកថ្មីជោគជ័យ!", "success");
      this.toggleAddCustomHolidayForm(false);
      document.getElementById("custHoliTitle").value = "";
      document.getElementById("custHoliStart").value = "";
      document.getElementById("custHoliEnd").value = "";
      document.getElementById("custHoliResume").value = "";
      document.getElementById("custHoliNote").value = "";
      this.renderKhmerCalendarView();
    }
  },

  handleDeleteCustomHoliday(holidayId) {
    if (typeof KhmerCalendarService !== "undefined") {
      KhmerCalendarService.deleteCustomHoliday(holidayId);
      App.showToast("បានលុបថ្ងៃឈប់សម្រាកជោគជ័យ!", "info");
      this.renderKhmerCalendarView();
    }
  },

  // ------------------------------------------------------------------------
  // 36. TELEGRAM HOLIDAY BROADCAST CONFIRMATION
  // ------------------------------------------------------------------------
  openHolidayBroadcastConfirm(holidayId) {
    if (typeof KhmerCalendarService === "undefined") return;

    const allHolidays = [
      ...KhmerCalendarService.getHolidaysForYear(this._calCurrentYear),
      ...KhmerCalendarService.getHolidaysForYear(this._calCurrentYear + 1)
    ];

    const h = allHolidays.find(item => item.id === holidayId) || KhmerCalendarService.getUpcomingHolidays(30).find(item => item.id === holidayId);
    if (!h) return;

    this._selectedHolidayForBroadcast = h;

    const titleInput = document.getElementById("holiBcTitleInput");
    const startInput = document.getElementById("holiBcStartDateInput");
    const endInput = document.getElementById("holiBcEndDateInput");
    const resumeInput = document.getElementById("holiBcResumeDateInput");
    const noteInput = document.getElementById("holiBcNoteInput");

    if (titleInput) titleInput.value = h.title;
    if (startInput) startInput.value = h.dateStr;
    if (endInput) endInput.value = h.endDate || h.dateStr;

    if (resumeInput) {
      if (h.resumeDate) {
        resumeInput.value = h.resumeDate;
      } else {
        const d = new Date(h.dateStr + "T00:00:00");
        d.setDate(d.getDate() + (h.duration || 1));
        if (d.getDay() === 0) d.setDate(d.getDate() + 1);
        resumeInput.value = d.toISOString().split("T")[0];
      }
    }

    if (noteInput) {
      noteInput.value = h.note || "សូមប្អូនៗសិស្សានុសិស្សឆ្លៀតពេលរំលឹកមេរៀន រូបមន្តកុំព្យូទ័រ និងធ្វើដំណើរប្រកបដោយសុវត្ថិភាព!";
    }

    this.open("holidayBroadcastConfirmModal");
  },

  async executeHolidayBroadcastFromModal() {
    if (!this._selectedHolidayForBroadcast || typeof KhmerCalendarService === "undefined") return;

    const targetShift = document.getElementById("holiBcTargetShift")?.value || "ALL";
    const title = document.getElementById("holiBcTitleInput")?.value || this._selectedHolidayForBroadcast.title;
    const startDate = document.getElementById("holiBcStartDateInput")?.value || this._selectedHolidayForBroadcast.dateStr;
    const endDate = document.getElementById("holiBcEndDateInput")?.value || startDate;
    const resumeDate = document.getElementById("holiBcResumeDateInput")?.value;
    const note = document.getElementById("holiBcNoteInput")?.value;

    const holidayPayload = {
      ...this._selectedHolidayForBroadcast,
      title,
      dateStr: startDate,
      endDate,
      resumeDate,
      note
    };

    const success = await KhmerCalendarService.broadcastHolidayToTelegram(holidayPayload, {
      targetShift,
      startDate,
      endDate,
      resumeDate,
      note
    });

    if (success) {
      this.close("holidayBroadcastConfirmModal");
    }
  },

  handlePrintHolidayNoticeFromModal() {
    if (!this._selectedHolidayForBroadcast || typeof KhmerCalendarService === "undefined") return;

    const title = document.getElementById("holiBcTitleInput")?.value || this._selectedHolidayForBroadcast.title;
    const startDate = document.getElementById("holiBcStartDateInput")?.value || this._selectedHolidayForBroadcast.dateStr;
    const endDate = document.getElementById("holiBcEndDateInput")?.value || startDate;
    const resumeDate = document.getElementById("holiBcResumeDateInput")?.value;
    const note = document.getElementById("holiBcNoteInput")?.value;

    const holidayPayload = {
      ...this._selectedHolidayForBroadcast,
      title,
      dateStr: startDate,
      endDate,
      resumeDate,
      note
    };

    KhmerCalendarService.printHolidayNoticeA4(holidayPayload, {
      startDate,
      endDate,
      resumeDate,
      note
    });
  },

  // ========================================================================
  // FEATURE 1: 1-CLICK TELEGRAM & PHONE CONTACT HUB CONTROLLER
  // ========================================================================
  _currentContactStudent: null,
  _activeContactTab: 'payment',

  openQuickContactModal(studentId, defaultTab = 'payment') {
    const student = (typeof StudentAPI !== "undefined") 
      ? StudentAPI.getLocalStudents().find(s => s.ID === studentId)
      : (App?.state?.students || []).find(s => s.ID === studentId);
      
    if (!student) {
      if (typeof App !== "undefined" && App.showToast) App.showToast("រកមិនឃើញទិន្នន័យសិស្សឡើយ!", "error");
      return;
    }

    this._currentContactStudent = student;
    this._activeContactTab = defaultTab;

    // Header info
    const avatarEl = document.getElementById("contactHubAvatar");
    if (avatarEl) {
      avatarEl.src = student.Avatar || (typeof App !== "undefined" ? App.getDefaultAvatar(student.Gender) : "");
    }
    const nameKhEl = document.getElementById("contactHubNameKh");
    if (nameKhEl) nameKhEl.textContent = student.NameKh || "";
    const nameEnEl = document.getElementById("contactHubNameEn");
    if (nameEnEl) nameEnEl.textContent = student.NameEn || (typeof TeacherToolsService !== "undefined" ? TeacherToolsService.transliterateKhmerToLatin(student.NameKh) : "");
    const idBadgeEl = document.getElementById("contactHubIdBadge");
    if (idBadgeEl) idBadgeEl.textContent = student.ID || "";
    const courseEl = document.getElementById("contactHubCourse");
    if (courseEl) courseEl.innerHTML = `<i class="fa-solid fa-laptop-code text-indigo-400"></i> ${student.Course || "Typing"}`;
    const shiftEl = document.getElementById("contactHubShift");
    if (shiftEl) shiftEl.innerHTML = `<i class="fa-solid fa-clock text-amber-400"></i> ${typeof App !== "undefined" ? App.getShiftLabel(student.Shift) : student.Shift}`;
    const statusEl = document.getElementById("contactHubStatusBadge");
    if (statusEl) {
      statusEl.textContent = student.Status === "Dropped" ? "បោះបង់" : (student.Status === "Graduated" ? "បញ្ចប់ការសិក្សា" : "កំពុងសិក្សា");
      statusEl.className = "status-indicator " + (student.Status === "Dropped" ? "status-inactive" : "status-active");
    }

    // Direct Call & Telegram Actions
    const phone = student.Phone || "";
    const guardianPhone = student.GuardianPhone || "";
    const primaryPhone = phone || guardianPhone;
    const cleanPrimaryPhone = primaryPhone.replace(/\D/g, "");

    const phoneTextEl = document.getElementById("contactHubPhoneText");
    if (phoneTextEl) phoneTextEl.textContent = primaryPhone || "គ្មានលេខ";

    const callStudentBtn = document.getElementById("contactHubCallStudentBtn");
    if (callStudentBtn) {
      if (primaryPhone) {
        callStudentBtn.href = `tel:${primaryPhone}`;
        callStudentBtn.style.display = "inline-flex";
      } else {
        callStudentBtn.style.display = "none";
      }
    }

    const callGuardianBtn = document.getElementById("contactHubCallGuardianBtn");
    if (callGuardianBtn) {
      if (guardianPhone && guardianPhone !== phone) {
        callGuardianBtn.href = `tel:${guardianPhone}`;
        callGuardianBtn.style.display = "inline-flex";
      } else {
        callGuardianBtn.style.display = "none";
      }
    }

    const tgBtn = document.getElementById("contactHubDirectTgBtn");
    if (tgBtn) {
      if (cleanPrimaryPhone) {
        const tgNumber = cleanPrimaryPhone.replace(/^0/, "");
        tgBtn.href = `https://t.me/+855${tgNumber}`;
        tgBtn.style.display = "inline-flex";
      } else {
        tgBtn.style.display = "none";
      }
    }

    // Load template
    this.switchContactTemplate(defaultTab);

    this.open("quickContactModal");
  },

  switchContactTemplate(tabKey) {
    this._activeContactTab = tabKey;
    const student = this._currentContactStudent;
    if (!student) return;

    // Update tab styling
    document.querySelectorAll(".contact-template-btn").forEach(btn => {
      if (btn.getAttribute("data-contact-tab") === tabKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const msgBox = document.getElementById("contactHubMessageText");
    if (!msgBox) return;

    const branding = (typeof TeacherToolsService !== "undefined") ? TeacherToolsService.getSchoolBranding() : {
      schoolNameKh: "សាលាកុំព្យូទ័រ TIS Lab Computer",
      schoolPhone: "071 721 0307",
      teacherTitle: "លោកគ្រូ ខៀន ធូ"
    };

    let generatedText = "";

    if (tabKey === "payment") {
      const allFees = (typeof StudentAPI !== "undefined") ? StudentAPI.getAllFees() : {};
      const fee = allFees[student.ID] || { totalAmount: 50, paidAmount: 0, balance: 50 };
      const balance = parseFloat(fee.balance) || (parseFloat(fee.totalAmount || 50) - parseFloat(fee.paidAmount || 0));
      const amountDue = balance > 0 ? balance : 50;

      generatedText = 
`🔔 ជម្រាបសួរអាណាព្យាបាល និងប្អូន ${student.NameKh}!
🏫 ខាងមជ្ឈមណ្ឌលកុំព្យូទ័រ ${branding.schoolNameKh} សូមជម្រាបជូនអំពីការទូទាត់ថ្លៃសិក្សា៖
- ឈ្មោះសិស្ស៖ ${student.NameKh} (${student.NameEn || ''})
- អត្តលេខ (ID)៖ ${student.ID}
- វគ្គសិក្សា៖ ${student.Course || 'កុំព្យូទ័ររដ្ឋបាល'} (វេន${student.Shift || 'ព្រឹក'})
- ទឹកប្រាក់នៅសល់៖ $${amountDue}

💳 ព័ត៌មានគណនីបង់ប្រាក់តាម ABA KHQR៖
• ឈ្មោះគណនី៖ KHIEN THOU
• លេខគណនី៖ 071 721 0307
• ទូរស័ព្ទទំនាក់ទំនង៖ ${branding.schoolPhone || '071 721 0307'}

សូមអរគុណសម្រាប់ការសហការ និងការយកចិត្តទុកដាក់! 🙏✨`;
    } 
    else if (tabKey === "absence") {
      const risk = (typeof StudentAPI !== "undefined") ? StudentAPI.getStudentAtRiskStatus(student.ID) : { consecutive: 2 };
      const missedCount = risk.consecutive > 0 ? risk.consecutive : 2;

      generatedText = 
`🌸 ជម្រាបសួរអាណាព្យាបាល និងប្អូន ${student.NameKh}!
🏫 ខាងមជ្ឈមណ្ឌលកុំព្យូទ័រ ${branding.schoolNameKh} សូមសាកសួរអំពីសុខទុក្ខរបស់ប្អូន។
ដោយសារគ្រូបានកត់សម្គាល់ឃើញថា ប្អូនបានអវត្តមានចំនួន ${missedCount} ថ្ងៃជាប់គ្នាក្នុងថ្នាក់កុំព្យូទ័រ (វេន${student.Shift || 'ព្រឹក'})។

តើប្អូនមានបញ្ហាសុខភាព ឬធុរៈរវល់អ្វីដែរទេ?
ប្រសិនបើមានបញ្ហា ឬត្រូវការជំនួយរៀនប៉ះប៉ូវបន្ថែម សូមឆ្លើយតបមកកាន់គ្រូ ឬទាក់ទងមកលេខ ${branding.schoolPhone || '071 721 0307'}។

លោកគ្រូជូនពរប្អូនឆាប់បានត្រឡប់មករៀនវិញដោយសុខសប្បាយ! 💻📚`;
    }
    else if (tabKey === "exams") {
      const allExams = (typeof StudentAPI !== "undefined") ? StudentAPI.getStudentExams(student.ID) : {};
      const courses = ["Typing", "Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint"];
      let scoresList = "";
      courses.forEach(c => {
        const ex = allExams[c];
        if (ex && ex.score !== undefined) {
          scoresList += `• ${c}៖ ${ex.score} ពិន្ទុ (និទ្ទេស ${ex.grade || '—'}, ${ex.status === 'Pass' ? 'ជាប់' : 'ធ្លាក់'})\n`;
        } else {
          scoresList += `• ${c}៖ មិនទាន់ប្រឡង\n`;
        }
      });

      generatedText = 
`🏆 អបអរសាទរប្អូន ${student.NameKh} (${student.NameEn || ''})!
📊 ខាងក្រោមនេះជាលទ្ធផលប្រឡងបញ្ចប់វគ្គកុំព្យូទ័រនៅ ${branding.schoolNameKh}៖
- អត្តលេខសិស្ស៖ ${student.ID}
- វេនសិក្សា៖ ${student.Shift || 'ព្រឹក'}

${scoresList}
លោកគ្រូសូមកោតសរសើរចំពោះការខិតខំប្រឹងប្រែងរៀនសូត្រ និងអនុវត្តជាក់ស្តែងនៅលើកុំព្យូទ័ររបស់ប្អូន! បន្តរក្សាការខិតខំនេះបន្តទៀតណា៎! 👏🎉`;
    }
    else if (tabKey === "portal") {
      const portalUrl = window.location.origin + window.location.pathname + "#portal";
      generatedText = 
`🔑 សួស្តីប្អូន ${student.NameKh}!
📱 នេះជាព័ត៌មានគណនី Student Portal សម្រាប់ចូលឆែកមើលវត្តមាន និងពិន្ទុប្រឡងផ្ទាល់ខ្លួនពីគេហដ្ឋាន៖
- ឈ្មោះសិស្ស៖ ${student.NameKh} (${student.NameEn || ''})
- អត្តលេខសិស្ស (Student ID)៖ ${student.ID}
- លេខកូដសម្ងាត់ (PIN)៖ ${student.PIN || '1234'}
- គេហទំព័រ Portal៖ ${portalUrl}

💡 របៀបប្រើប្រាស់៖
១. ចុចលើតំណភ្ជាប់ខាងលើ
២. វាយបញ្ចូលអត្តលេខ ${student.ID} និង PIN ${student.PIN || '1234'}
៣. ប្អូនអាចពិនិត្យមើលវត្តមាន លទ្ធផលប្រឡង និងទាញយកវិញ្ញាបនបត្រឌីជីថលបានភ្លាមៗ!`;
    }
    else {
      generatedText = 
`សួស្តីប្អូន ${student.NameKh}!
ពី ${branding.schoolNameKh} (លោកគ្រូ ខៀន ធូ)៖
`;
    }

    msgBox.value = generatedText;
  },

  copyContactMessage() {
    const msgBox = document.getElementById("contactHubMessageText");
    if (!msgBox || !msgBox.value) return;

    navigator.clipboard.writeText(msgBox.value).then(() => {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("✅ បានចម្លងសាររួចរាល់! អាចបិទភ្ជាប់ (Paste) ផ្ញើបានភ្លាមៗ", "success");
      }
    }).catch(() => {
      msgBox.select();
      document.execCommand("copy");
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("✅ បានចម្លងសាររួចរាល់!", "success");
      }
    });
  },

  shareContactViaTelegram() {
    const msgBox = document.getElementById("contactHubMessageText");
    const text = msgBox ? msgBox.value : "";
    if (!text) return;

    const url = `https://t.me/share/url?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("🚀 កំពុងបើក Telegram ដើម្បីចែករំលែកសារ...", "info");
    }
  },

  shareContactViaSms() {
    const student = this._currentContactStudent;
    const msgBox = document.getElementById("contactHubMessageText");
    const text = msgBox ? msgBox.value : "";
    const phone = student ? (student.Phone || student.GuardianPhone || "") : "";
    const cleanPhone = phone.replace(/\D/g, "");

    const url = `sms:${cleanPhone}?body=${encodeURIComponent(text)}`;
    window.open(url, "_self");
  },

  // ========================================================================
  // FEATURE 3: QUICK BATCH EXAM GRADING GRID BY SHIFT CONTROLLER
  // ========================================================================
  openQuickBatchGradingModal(shift = "ព្រឹក", course = "Typing") {
    const shiftSelect = document.getElementById("batchGradingShiftSelect");
    const courseSelect = document.getElementById("batchGradingCourseSelect");
    const dateInput = document.getElementById("batchGradingDateInput");

    if (shiftSelect) shiftSelect.value = shift || "ព្រឹក";
    if (courseSelect) courseSelect.value = course || "Typing";
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }

    this.renderBatchGradingRows();
    this.open("quickBatchGradingModal");
  },

  onBatchGradingFilterChange() {
    this.renderBatchGradingRows();
  },

  renderBatchGradingRows() {
    const shiftSelect = document.getElementById("batchGradingShiftSelect");
    const courseSelect = document.getElementById("batchGradingCourseSelect");
    const tbody = document.getElementById("batchGradingTableBody");
    if (!tbody) return;

    const selectedShift = shiftSelect ? shiftSelect.value : "ALL";
    const selectedCourse = courseSelect ? courseSelect.value : "Typing";

    const allStudents = (typeof StudentAPI !== "undefined") ? StudentAPI.getLocalStudents() : (App?.state?.students || []);
    const allExams = (typeof StudentAPI !== "undefined") ? StudentAPI.getAllExams() : {};

    const filtered = allStudents.filter(s => {
      if (s.Status === "Dropped" || s.Status === "Drop") return false;
      if (selectedShift !== "ALL" && s.Shift !== selectedShift) return false;
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">
            <i class="fa-solid fa-users-slash fa-2x mb-2" style="display: block;"></i>
            <span>ពុំមានសិស្សក្នុងវេន ${selectedShift} ឡើយ</span>
          </td>
        </tr>
      `;
      this.updateBatchGradingStats([]);
      return;
    }

    tbody.innerHTML = filtered.map((s, idx) => {
      const studentExams = allExams[s.ID] || {};
      const currentExam = studentExams[selectedCourse] || {};
      const prevScore = currentExam.score !== undefined ? currentExam.score : "—";
      const initialScore = currentExam.score !== undefined ? currentExam.score : "";
      const numScore = Number(initialScore) || 0;
      const initialGrade = initialScore !== "" ? (currentExam.grade || StudentAPI.calculateGrade(numScore)) : "—";
      const initialStatus = initialScore !== "" ? (currentExam.status || (numScore >= 50 ? "Pass" : "Fail")) : "—";

      return `
        <tr class="batch-grade-row" data-student-id="${s.ID}">
          <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
          <td><span class="badge badge-id font-mono">${App.escapeHtml(s.ID)}</span></td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="${s.Avatar || App.getDefaultAvatar(s.Gender)}" alt="${s.NameKh}" class="avatar-sm" onerror="this.src='${App.getDefaultAvatar(s.Gender)}'">
              <div>
                <div style="font-weight: 700; color: var(--text-main);">${App.escapeHtml(s.NameKh)}</div>
                <div style="font-size: 0.76rem; color: var(--text-muted); font-family: ui-monospace, monospace;">${App.escapeHtml(s.NameEn || '')}</div>
              </div>
            </div>
          </td>
          <td><span class="badge" style="background: rgba(245, 158, 11, 0.12); color: #d97706; font-size: 0.78rem;">${App.getShiftLabel(s.Shift)}</span></td>
          <td style="text-align: center; font-weight: 700; font-family: ui-monospace, monospace; color: var(--text-muted);">${prevScore}</td>
          <td style="text-align: center;">
            <input type="number" min="0" max="100" 
              class="batch-score-cell-input" 
              data-student-id="${s.ID}" 
              data-row-index="${idx}"
              value="${initialScore}" 
              placeholder="0-100"
              oninput="ModalsComponent.onBatchScoreInput(this, '${s.ID}')"
              onkeydown="ModalsComponent.handleBatchKeyNav(event, this)">
          </td>
          <td style="text-align: center;">
            <span class="batch-grade-pill ${initialGrade !== '—' ? 'grade-' + initialGrade : ''}" id="batchGradeBadge_${s.ID}">
              ${initialGrade}
            </span>
          </td>
          <td style="text-align: center;">
            <span id="batchStatusBadge_${s.ID}" class="status-indicator ${initialStatus === 'Pass' ? 'status-active' : (initialStatus === 'Fail' ? 'status-inactive' : '')}">
              ${initialStatus === 'Pass' ? 'ជាប់' : (initialStatus === 'Fail' ? 'ធ្លាក់' : '—')}
            </span>
          </td>
        </tr>
      `;
    }).join("");

    this.updateBatchGradingStats(filtered);
  },

  onBatchScoreInput(inputEl, studentId) {
    let val = inputEl.value;
    if (val !== "") {
      let num = Number(val);
      if (num < 0) num = 0;
      if (num > 100) num = 100;
      inputEl.value = num;

      const grade = (typeof StudentAPI !== "undefined") ? StudentAPI.calculateGrade(num) : (num >= 90 ? "A" : (num >= 80 ? "B" : (num >= 70 ? "C" : (num >= 60 ? "D" : (num >= 50 ? "E" : "F")))));
      const isPass = num >= 50;

      const gradeEl = document.getElementById(`batchGradeBadge_${studentId}`);
      if (gradeEl) {
        gradeEl.textContent = grade;
        gradeEl.className = `batch-grade-pill grade-${grade}`;
      }

      const statusEl = document.getElementById(`batchStatusBadge_${studentId}`);
      if (statusEl) {
        statusEl.textContent = isPass ? "ជាប់" : "ធ្លាក់";
        statusEl.className = `status-indicator ${isPass ? 'status-active' : 'status-inactive'}`;
      }
    } else {
      const gradeEl = document.getElementById(`batchGradeBadge_${studentId}`);
      if (gradeEl) {
        gradeEl.textContent = "—";
        gradeEl.className = "batch-grade-pill";
      }
      const statusEl = document.getElementById(`batchStatusBadge_${studentId}`);
      if (statusEl) {
        statusEl.textContent = "—";
        statusEl.className = "status-indicator";
      }
    }

    this.recalculateVisibleBatchStats();
  },

  handleBatchKeyNav(event, currentInput) {
    const currentIndex = parseInt(currentInput.getAttribute("data-row-index"), 10);
    const allInputs = document.querySelectorAll(".batch-score-cell-input");

    if (event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      if (currentIndex + 1 < allInputs.length) {
        allInputs[currentIndex + 1].focus();
        allInputs[currentIndex + 1].select();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (currentIndex - 1 >= 0) {
        allInputs[currentIndex - 1].focus();
        allInputs[currentIndex - 1].select();
      }
    }
  },

  batchFillScore(score) {
    const allInputs = document.querySelectorAll(".batch-score-cell-input");
    allInputs.forEach(input => {
      input.value = score;
      const studentId = input.getAttribute("data-student-id");
      this.onBatchScoreInput(input, studentId);
    });
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`បានបញ្ចូលពិន្ទុ ${score} ដល់សិស្សទាំងអស់រួចរាល់!`, "info");
    }
  },

  batchClearScores() {
    const allInputs = document.querySelectorAll(".batch-score-cell-input");
    allInputs.forEach(input => {
      input.value = "";
      const studentId = input.getAttribute("data-student-id");
      this.onBatchScoreInput(input, studentId);
    });
  },

  recalculateVisibleBatchStats() {
    const allInputs = document.querySelectorAll(".batch-score-cell-input");
    let totalScored = 0;
    let sumScore = 0;
    let passedCount = 0;
    let failedCount = 0;

    allInputs.forEach(input => {
      const val = input.value;
      if (val !== "") {
        const num = Number(val);
        totalScored++;
        sumScore += num;
        if (num >= 50) passedCount++;
        else failedCount++;
      }
    });

    const avg = totalScored > 0 ? (sumScore / totalScored).toFixed(1) : "0.0";

    const totalEl = document.getElementById("batchStatTotal");
    const avgEl = document.getElementById("batchStatAvg");
    const passEl = document.getElementById("batchStatPassed");
    const failEl = document.getElementById("batchStatFailed");

    if (totalEl) totalEl.textContent = allInputs.length;
    if (avgEl) avgEl.textContent = avg;
    if (passEl) passEl.textContent = passedCount;
    if (failEl) failEl.textContent = failedCount;
  },

  updateBatchGradingStats(studentsList) {
    this.recalculateVisibleBatchStats();
  },

  async saveBatchGradingScores() {
    const courseSelect = document.getElementById("batchGradingCourseSelect");
    const dateInput = document.getElementById("batchGradingDateInput");
    const shiftSelect = document.getElementById("batchGradingShiftSelect");
    const sendTgChk = document.getElementById("batchGradingSendTelegramChk");

    const course = courseSelect ? courseSelect.value : "Typing";
    const examDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split("T")[0];
    const shift = shiftSelect ? shiftSelect.value : "ព្រឹក";
    const shouldSendTg = sendTgChk ? sendTgChk.checked : false;

    const allInputs = document.querySelectorAll(".batch-score-cell-input");
    const batchMap = {};
    let enteredCount = 0;

    allInputs.forEach(input => {
      const val = input.value;
      const studentId = input.getAttribute("data-student-id");
      if (val !== "" && studentId) {
        batchMap[studentId] = {
          score: Number(val),
          grade: StudentAPI.calculateGrade(Number(val)),
          status: Number(val) >= 50 ? "Pass" : "Fail"
        };
        enteredCount++;
      }
    });

    if (enteredCount === 0) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("សូមបញ្ចូលពិន្ទុយ៉ាងហោចណាស់សិស្សម្នាក់មុននឹងរក្សាទុក!", "warning");
      }
      return;
    }

    const saveBtn = document.getElementById("btnSaveBatchGrading");
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>កំពុងរក្សាទុក...</span>`;
    }

    try {
      await StudentAPI.saveBatchExams(course, batchMap, examDate);

      // Optional Telegram broadcast
      if (shouldSendTg && typeof TeacherToolsService !== "undefined" && TeacherToolsService.broadcastExamScoresByShift) {
        await TeacherToolsService.broadcastExamScoresByShift(shift, course);
      }

      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`🎉 បានរក្សាទុកពិន្ទុ ${enteredCount} នាក់ក្នុងមុខវិជ្ជា ${course} ជោគជ័យ!`, "success");
      }

      this.close("quickBatchGradingModal");

      // Refresh ExamsView if active
      if (typeof ExamsView !== "undefined" && ExamsView.renderTable) {
        ExamsView.renderTable();
      }
      if (typeof DashboardView !== "undefined" && DashboardView.render) {
        App.renderApp();
      }
    } catch (err) {
      console.error("Batch save error:", err);
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("មានបញ្ហាក្នុងការរក្សាទុកពិន្ទុ!", "error");
      }
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>រក្សាទុកពិន្ទុទាំងអស់ (Batch Save)</span>`;
      }
    }
  },

  // ========================================================================
  // FEATURE 4: DIGITAL PAYMENT RECEIPT / INVOICE GENERATOR & PRINT
  // ========================================================================
  _receiptStudentId: null,
  _receiptFormat: 'a5',
  _receiptShowSeal: true,
  _receiptShowSign: true,
  _receiptShowQr: true,

  openStudentReceiptModal(studentId, feeRecord = null) {
    this._receiptStudentId = studentId;
    this._receiptFormat = 'a5';
    this._receiptShowSeal = true;
    this._receiptShowSign = true;
    this._receiptShowQr = true;

    // Reset toggles in UI
    const sealChk = document.getElementById("receiptToggleSeal");
    const signChk = document.getElementById("receiptToggleSign");
    const qrChk = document.getElementById("receiptToggleQr");
    if (sealChk) sealChk.checked = true;
    if (signChk) signChk.checked = true;
    if (qrChk) qrChk.checked = true;

    const btnA5 = document.getElementById("btnReceiptFormatA5");
    const btnThermal = document.getElementById("btnReceiptFormatThermal");
    if (btnA5) btnA5.classList.add("active");
    if (btnThermal) btnThermal.classList.remove("active");

    this.renderReceiptPreview('a5');
    this.open("studentReceiptModal");
  },

  switchReceiptFormat(format) {
    this._receiptFormat = format;
    const btnA5 = document.getElementById("btnReceiptFormatA5");
    const btnThermal = document.getElementById("btnReceiptFormatThermal");

    if (format === 'a5') {
      if (btnA5) btnA5.classList.add("active");
      if (btnThermal) btnThermal.classList.remove("active");
    } else {
      if (btnA5) btnA5.classList.remove("active");
      if (btnThermal) btnThermal.classList.add("active");
    }

    this.renderReceiptPreview(format);
  },

  toggleReceiptSeal(show) {
    this._receiptShowSeal = show;
    const sealEls = document.querySelectorAll(".school-red-seal-wrapper");
    sealEls.forEach(el => el.style.display = show ? "block" : "none");
  },

  toggleReceiptSign(show) {
    this._receiptShowSign = show;
    const signEls = document.querySelectorAll(".teacher-sign-wrapper");
    signEls.forEach(el => el.style.display = show ? "block" : "none");
  },

  toggleReceiptQr(show) {
    this._receiptShowQr = show;
    const qrEls = document.querySelectorAll(".receipt-qr-wrapper");
    qrEls.forEach(el => el.style.display = show ? "block" : "none");
  },

  renderReceiptPreview(format = 'a5') {
    const container = document.getElementById("receiptPrintableArea");
    if (!container) return;

    const student = (typeof StudentAPI !== "undefined")
      ? StudentAPI.getLocalStudents().find(s => s.ID === this._receiptStudentId)
      : (App?.state?.students || []).find(s => s.ID === this._receiptStudentId);

    if (!student) {
      container.innerHTML = `<div style="padding: 20px; color: red;">រកមិនឃើញទិន្នន័យសិស្សឡើយ</div>`;
      return;
    }

    const allFees = (typeof StudentAPI !== "undefined") ? StudentAPI.getAllFees() : {};
    const defaultPrice = 50;
    const fee = allFees[student.ID] || {
      totalAmount: defaultPrice,
      paidAmount: defaultPrice,
      discount: 0,
      balance: 0,
      status: "Paid",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "ABA KHQR",
      receiptNo: "INV-2026-" + String(student.ID).replace(/\D/g, "").padStart(4, "0"),
      note: "បង់ថ្លៃសិក្សាវគ្គកុំព្យូទ័ររដ្ឋបាលពេញ"
    };

    const total = parseFloat(fee.totalAmount) || defaultPrice;
    const paid = parseFloat(fee.paidAmount) || defaultPrice;
    const discount = parseFloat(fee.discount) || 0;
    const balance = parseFloat(fee.balance) || Math.max(0, total - paid - discount);
    const receiptNo = fee.receiptNo || ("INV-2026-" + String(student.ID).replace(/\D/g, "").padStart(4, "0"));
    const dateStr = fee.date || new Date().toISOString().split("T")[0];

    const branding = (typeof TeacherToolsService !== "undefined") ? TeacherToolsService.getSchoolBranding() : {
      schoolNameKh: "សាលាកុំព្យូទ័រ TIS Lab Computer",
      schoolNameEn: "TIS LAB COMPUTER TRAINING CENTER",
      schoolAddress: "ខេត្តកំពត, ព្រះរាជាណាចក្រកម្ពុជា",
      schoolPhone: "071 721 0307",
      teacherTitle: "លោកគ្រូ ខៀន ធូ"
    };

    // Official Stamp Seal SVG
    const stampSvg = `
      <svg width="105" height="105" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(220, 38, 38, 0.2));">
        <circle cx="80" cy="80" r="74" fill="none" stroke="#dc2626" stroke-width="3" stroke-dasharray="6 3"/>
        <circle cx="80" cy="80" r="66" fill="none" stroke="#dc2626" stroke-width="2"/>
        <circle cx="80" cy="80" r="44" fill="none" stroke="#dc2626" stroke-width="1.5"/>
        <path id="sealTextPathTop" d="M 22 80 A 58 58 0 0 1 138 80" fill="none"/>
        <text font-size="10.5" font-weight="900" fill="#dc2626" letter-spacing="1.5">
          <textPath href="#sealTextPathTop" startOffset="50%" text-anchor="middle">
            ★ TIS LAB COMPUTER ★
          </textPath>
        </text>
        <path id="sealTextPathBottom" d="M 138 80 A 58 58 0 0 1 22 80" fill="none"/>
        <text font-size="10" font-weight="900" fill="#dc2626" letter-spacing="1">
          <textPath href="#sealTextPathBottom" startOffset="50%" text-anchor="middle">
            ខេត្តកំពត • ទទួលប្រាក់រួច
          </textPath>
        </text>
        <!-- Center Emblem -->
        <g transform="translate(62, 58)">
          <rect x="2" y="2" width="32" height="22" rx="3" fill="none" stroke="#dc2626" stroke-width="2"/>
          <line x1="12" y1="24" x2="24" y2="24" stroke="#dc2626" stroke-width="2.5"/>
          <line x1="18" y1="24" x2="18" y2="29" stroke="#dc2626" stroke-width="2"/>
          <line x1="8" y1="29" x2="28" y2="29" stroke="#dc2626" stroke-width="2"/>
          <path d="M9 13 L15 18 L26 8" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <text x="80" y="104" font-size="10" font-weight="900" fill="#dc2626" text-anchor="middle">PAID</text>
      </svg>
    `;

    // Teacher Digital Signature SVG
    const signatureSvg = `
      <svg width="130" height="48" viewBox="0 0 150 55" xmlns="http://www.w3.org/2000/svg">
        <path d="M 15 40 Q 25 10 40 22 T 65 30 Q 80 15 95 35 T 120 20 Q 135 25 140 45" fill="none" stroke="#1e1b4b" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M 30 20 Q 55 5 75 18" fill="none" stroke="#1e1b4b" stroke-width="2" stroke-linecap="round"/>
        <path d="M 20 48 L 135 44" fill="none" stroke="#1e1b4b" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="80 10"/>
      </svg>
    `;

    // Dynamic Verification QR SVG
    const qrSvg = `
      <svg width="72" height="72" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px; background: #fff;">
        <rect width="100" height="100" fill="#fff"/>
        <rect x="10" y="10" width="26" height="26" fill="#0f172a"/>
        <rect x="14" y="14" width="18" height="18" fill="#fff"/>
        <rect x="18" y="18" width="10" height="10" fill="#0f172a"/>
        <rect x="64" y="10" width="26" height="26" fill="#0f172a"/>
        <rect x="68" y="14" width="18" height="18" fill="#fff"/>
        <rect x="72" y="18" width="10" height="10" fill="#0f172a"/>
        <rect x="10" y="64" width="26" height="26" fill="#0f172a"/>
        <rect x="14" y="68" width="18" height="18" fill="#fff"/>
        <rect x="18" y="72" width="10" height="10" fill="#0f172a"/>
        <rect x="42" y="15" width="8" height="8" fill="#0f172a"/>
        <rect x="52" y="25" width="6" height="6" fill="#0f172a"/>
        <rect x="42" y="38" width="16" height="8" fill="#0f172a"/>
        <rect x="65" y="45" width="8" height="14" fill="#0f172a"/>
        <rect x="45" y="65" width="12" height="12" fill="#0f172a"/>
        <rect x="65" y="70" width="18" height="8" fill="#0f172a"/>
        <rect x="80" y="55" width="8" height="12" fill="#0f172a"/>
        <rect x="44" y="80" width="15" height="8" fill="#0f172a"/>
        <circle cx="50" cy="50" r="5" fill="#ef4444"/>
      </svg>
    `;

    if (format === 'a5') {
      container.innerHTML = `
        <div class="receipt-paper-a5" id="printableInvoiceNode">
          <!-- Top Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #047857; padding-bottom: 12px; margin-bottom: 14px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.5rem; color: #047857;"><i class="fa-solid fa-laptop-code"></i></span>
                <div>
                  <h1 style="margin: 0; font-size: 1.15rem; font-weight: 900; color: #047857;">${branding.schoolNameKh}</h1>
                  <div style="font-size: 0.72rem; font-weight: 800; color: #475569; letter-spacing: 0.5px;">${branding.schoolNameEn}</div>
                </div>
              </div>
              <div style="margin-top: 4px; font-size: 0.76rem; color: #64748b;">
                <span>📍 ${branding.schoolAddress}</span> | <span>📞 ${branding.schoolPhone}</span>
              </div>
            </div>

            <!-- Receipt Meta -->
            <div style="text-align: right;">
              <div style="display: inline-block; background: #ecfdf5; color: #047857; border: 1.5px solid #a7f3d0; padding: 4px 10px; border-radius: 8px; font-weight: 800; font-size: 0.85rem; font-family: ui-monospace, monospace;">
                ${receiptNo}
              </div>
              <div style="margin-top: 4px; font-size: 0.75rem; color: #64748b;">
                កាលបរិច្ឆេទ៖ <strong>${dateStr}</strong>
              </div>
              <div style="font-size: 0.72rem; color: #64748b;">
                បេឡាធិការ៖ <strong>${branding.teacherTitle}</strong>
              </div>
            </div>
          </div>

          <!-- Title Banner -->
          <div style="text-align: center; margin-bottom: 12px;">
            <h2 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 1px;">
              បង្កាន់ដៃទទួលប្រាក់ថ្លៃសិក្សា / OFFICIAL RECEIPT
            </h2>
          </div>

          <!-- Student Meta 2x2 Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; font-size: 0.82rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">អត្តលេខសិស្ស (ID)៖</span>
              <strong style="color: #0f172a; font-family: ui-monospace, monospace;">${student.ID}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">ភេទ (Gender)៖</span>
              <strong style="color: #0f172a;">${student.Gender || 'ប្រុស'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">ឈ្មោះសិស្ស (Khmer)៖</span>
              <strong style="color: #047857; font-size: 0.88rem;">${student.NameKh}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">ឈ្មោះឡាតាំង (Latin)៖</span>
              <strong style="color: #0f172a; font-family: ui-monospace, monospace;">${student.NameEn || ''}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">វគ្គសិក្សា (Course)៖</span>
              <strong style="color: #0f172a;">${student.Course || 'កុំព្យូទ័ររដ្ឋបាល'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">វេនសិក្សា (Shift)៖</span>
              <strong style="color: #d97706;">${typeof App !== "undefined" ? App.getShiftLabel(student.Shift) : student.Shift}</strong>
            </div>
          </div>

          <!-- Breakdown Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 0.82rem;">
            <thead>
              <tr style="background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;">
                <th style="padding: 6px 10px; text-align: center; width: 40px;">ល.រ</th>
                <th style="padding: 6px 10px; text-align: left;">បរិយាយ / Description</th>
                <th style="padding: 6px 10px; text-align: center; width: 90px;">ថិរវេលា</th>
                <th style="padding: 6px 10px; text-align: right; width: 100px;">ចំនួនទឹកប្រាក់</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 10px; text-align: center; font-weight: 700;">1</td>
                <td style="padding: 8px 10px;">
                  <strong style="color: #0f172a;">ថ្លៃសិក្សាវគ្គកុំព្យូទ័ររដ្ឋបាលអាជីព (${student.Course || 'Typing'})</strong>
                  <div style="font-size: 0.74rem; color: #64748b;">${fee.note || 'បណ្តុះបណ្តាលអនុវត្តផ្ទាល់លើកុំព្យូទ័រ ១សិស្ស ១គ្រឿង'}</div>
                </td>
                <td style="padding: 8px 10px; text-align: center; color: #64748b;">៤៥ ថ្ងៃ</td>
                <td style="padding: 8px 10px; text-align: right; font-family: ui-monospace, monospace; font-weight: 700;">$${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Subtotal Summary & KHQR Section -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
            <!-- Left: KHQR & Verification QR -->
            <div style="display: flex; gap: 10px; align-items: center;">
              <div class="receipt-qr-wrapper" style="display: ${this._receiptShowQr ? 'block' : 'none'};">
                ${qrSvg}
                <div style="font-size: 0.65rem; color: #64748b; text-align: center; margin-top: 2px;">ស្កេនផ្ទៀងផ្ទាត់</div>
              </div>
              <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 6px 10px; font-size: 0.72rem; line-height: 1.4;">
                <div style="font-weight: 800; color: #dc2626;"><i class="fa-solid fa-building-columns"></i> ABA KHQR / Bank</div>
                <div>គណនី៖ <strong>071 721 0307</strong></div>
                <div style="color: #64748b;">ឈ្មោះ៖ KHIEN THOU</div>
                <div style="color: #059669; font-weight: 700;">មធ្យោបាយ៖ ${fee.paymentMethod || 'ABA KHQR'}</div>
              </div>
            </div>

            <!-- Right: Price Math Summary -->
            <div style="width: 220px; font-size: 0.82rem;">
              <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                <span style="color: #64748b;">សរុប (Subtotal)៖</span>
                <strong style="font-family: ui-monospace, monospace;">$${total.toFixed(2)}</strong>
              </div>
              ${discount > 0 ? `
                <div style="display: flex; justify-content: space-between; padding: 2px 0; color: #059669;">
                  <span>បញ្ចុះតម្លៃ (Discount)៖</span>
                  <strong style="font-family: ui-monospace, monospace;">-$${discount.toFixed(2)}</strong>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-top: 1.5px solid #047857; border-bottom: 1.5px solid #047857; margin: 3px 0; font-size: 0.95rem; font-weight: 900; color: #047857;">
                <span>បានបង់ (Paid)៖</span>
                <span style="font-family: ui-monospace, monospace;">$${paid.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 2px 0; font-weight: 700;">
                <span style="color: #64748b;">នៅសល់ (Balance)៖</span>
                <span style="font-family: ui-monospace, monospace; color: ${balance > 0 ? '#dc2626' : '#059669'};">$${balance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Signatures & Seal -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 10px; padding-top: 8px;">
            <div style="text-align: center; width: 150px; font-size: 0.78rem;">
              <div style="color: #475569; font-weight: 700;">ហត្ថលេខាសិស្ស / អាណាព្យាបាល</div>
              <div style="height: 38px;"></div>
              <div style="border-top: 1px dotted #94a3b8; padding-top: 4px; color: #64748b;">....................................</div>
            </div>

            <!-- Red Official Stamp Seal -->
            <div class="school-red-seal-wrapper" style="display: ${this._receiptShowSeal ? 'block' : 'none'};">
              ${stampSvg}
            </div>

            <div style="text-align: center; width: 170px; font-size: 0.78rem;">
              <div style="color: #475569; font-weight: 700;">បេឡាធិការ / គ្រូទទួលបន្ទុក</div>
              <div class="teacher-sign-wrapper" style="height: 38px; display: ${this._receiptShowSign ? 'flex' : 'none'}; align-items: center; justify-content: center;">
                ${signatureSvg}
              </div>
              <div style="border-top: 1px dotted #94a3b8; padding-top: 4px; font-weight: 800; color: #0f172a;">${branding.teacherTitle}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // 80mm POS Thermal Receipt Layout
      container.innerHTML = `
        <div class="receipt-paper-thermal" id="printableInvoiceNode">
          <div style="text-align: center; margin-bottom: 8px;">
            <div style="font-size: 14px; font-weight: 900; color: #047857;">${branding.schoolNameKh}</div>
            <div style="font-size: 9.5px; font-weight: 700; color: #475569;">${branding.schoolNameEn}</div>
            <div style="font-size: 9px; color: #64748b;">ទូរស័ព្ទ៖ ${branding.schoolPhone} | កំពត</div>
          </div>

          <div style="border-top: 1px dashed #475569; border-bottom: 1px dashed #475569; padding: 4px 0; margin: 6px 0; text-align: center; font-weight: 800;">
            *** បង្កាន់ដៃបង់ប្រាក់ / RECEIPT ***
          </div>

          <div style="line-height: 1.4; margin-bottom: 6px;">
            <div>លេខវិក្កយបត្រ៖ <strong>${receiptNo}</strong></div>
            <div>កាលបរិច្ឆេទ៖ ${dateStr}</div>
            <div>សិស្ស៖ <strong>${student.NameKh} (${student.ID})</strong></div>
            <div>ឈ្មោះឡាតាំង៖ ${student.NameEn || ''}</div>
            <div>វគ្គ៖ ${student.Course || 'Typing'} (វេន${student.Shift || 'ព្រឹក'})</div>
            <div>មធ្យោបាយ៖ ${fee.paymentMethod || 'ABA KHQR'}</div>
          </div>

          <div style="border-top: 1px dashed #94a3b8; padding: 4px 0; margin: 4px 0;">
            <div style="display: flex; justify-content: space-between;">
              <span>១. វគ្គកុំព្យូទ័ររដ្ឋបាល</span>
              <strong style="font-family: monospace;">$${total.toFixed(2)}</strong>
            </div>
            ${discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: #059669;">
                <span>- បញ្ចុះតម្លៃ</span>
                <strong style="font-family: monospace;">-$${discount.toFixed(2)}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 13px; margin-top: 4px; border-top: 1px solid #000; padding-top: 3px;">
              <span>បានបង់ (PAID):</span>
              <strong style="font-family: monospace;">$${paid.toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; color: ${balance > 0 ? '#dc2626' : '#059669'}; font-weight: 700;">
              <span>នៅសល់ (DUE):</span>
              <strong style="font-family: monospace;">$${balance.toFixed(2)}</strong>
            </div>
          </div>

          <!-- Thermal Seal & QR -->
          <div style="display: flex; justify-content: space-around; align-items: center; margin: 8px 0;">
            <div class="receipt-qr-wrapper" style="display: ${this._receiptShowQr ? 'block' : 'none'};">
              ${qrSvg}
            </div>
            <div class="school-red-seal-wrapper" style="transform: scale(0.75); margin: -10px 0; display: ${this._receiptShowSeal ? 'block' : 'none'};">
              ${stampSvg}
            </div>
          </div>

          <div style="text-align: center; margin-top: 6px; font-size: 9.5px; color: #475569; line-height: 1.3;">
            <div class="teacher-sign-wrapper" style="display: ${this._receiptShowSign ? 'block' : 'none'}; margin-bottom: 2px;">
              ${signatureSvg}
            </div>
            <div>បេឡាធិការ៖ <strong>${branding.teacherTitle}</strong></div>
            <div style="margin-top: 4px; font-style: italic;">សូមអរគុណសម្រាប់ការបង់ថ្លៃសិក្សា! 🙏💻</div>
          </div>
        </div>
      `;
    }
  },

  printCurrentReceipt() {
    const node = document.getElementById("printableInvoiceNode");
    if (!node) return;

    const printWin = window.open("", "_blank", "width=850,height=900");
    if (!printWin) {
      alert("សូមអនុញ្ញាត Popup Window ក្នុងកម្មវិធីរុករក (Browser) ដើម្បីបោះពុម្ពវិក្កយបត្រ!");
      return;
    }

    const isThermal = this._receiptFormat === 'thermal';
    const pageStyle = isThermal 
      ? `@page { size: 80mm auto; margin: 2mm; } body { margin: 0; padding: 4px; display: flex; justify-content: center; font-family: 'Kantumruy Pro', 'Inter', monospace; }`
      : `@page { size: A5 landscape; margin: 8mm; } body { margin: 0; padding: 10px; display: flex; justify-content: center; font-family: 'Kantumruy Pro', 'Inter', sans-serif; }`;

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>Receipt_${this._receiptStudentId || 'TIS'}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          ${pageStyle}
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
          .receipt-paper-a5 { width: 100% !important; max-width: 650px !important; box-shadow: none !important; border: 1px solid #cbd5e1; }
          .receipt-paper-thermal { width: 100% !important; max-width: 320px !important; box-shadow: none !important; }
        </style>
      </head>
      <body>
        ${node.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  },

  copyReceiptText() {
    const student = (typeof StudentAPI !== "undefined")
      ? StudentAPI.getLocalStudents().find(s => s.ID === this._receiptStudentId)
      : null;
    if (!student) return;

    const allFees = (typeof StudentAPI !== "undefined") ? StudentAPI.getAllFees() : {};
    const fee = allFees[student.ID] || { totalAmount: 50, paidAmount: 50, balance: 0 };
    const text = `🧾 បង្កាន់ដៃបង់ប្រាក់ថ្លៃសិក្សា TIS Lab Computer
- លេខវិក្កយបត្រ៖ ${fee.receiptNo || 'INV-2026-001'}
- ឈ្មោះសិស្ស៖ ${student.NameKh} (${student.NameEn || ''})
- អត្តលេខ៖ ${student.ID}
- វគ្គសិក្សា៖ ${student.Course || 'Typing'} (វេន${student.Shift || 'ព្រឹក'})
- បានបង់៖ $${fee.paidAmount || 50}
- នៅសល់៖ $${fee.balance || 0}
- កាលបរិច្ឆេទ៖ ${fee.date || new Date().toISOString().split('T')[0]}
- ចេញដោយ៖ លោកគ្រូ ខៀន ធូ (071 721 0307)`;

    navigator.clipboard.writeText(text).then(() => {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("✅ បានចម្លងព័ត៌មានបង្កាន់ដៃរួចរាល់!", "success");
      }
    });
  },

  shareReceiptViaTelegram() {
    const student = (typeof StudentAPI !== "undefined")
      ? StudentAPI.getLocalStudents().find(s => s.ID === this._receiptStudentId)
      : null;
    if (!student) return;

    const allFees = (typeof StudentAPI !== "undefined") ? StudentAPI.getAllFees() : {};
    const fee = allFees[student.ID] || { totalAmount: 50, paidAmount: 50, balance: 0 };

    if (typeof TeacherToolsService !== "undefined" && TeacherToolsService.sendDigitalReceiptToTelegram) {
      TeacherToolsService.sendDigitalReceiptToTelegram(student, fee.paidAmount, fee.note);
    } else {
      this.copyReceiptText();
    }
  },

  // ------------------------------------------------------------------------
  // FEATURE: CLASS ATTENDANCE QR SHEET A4 STUDIO CONTROLLER
  // ------------------------------------------------------------------------
  _qrSheetShift: "ព្រឹក",
  _qrSheetCourse: "all",
  _qrSheetLayout: "grid",

  openClassAttendanceQrSheetModal(initialShift = "ព្រឹក") {
    this._qrSheetShift = initialShift;
    const shiftSel = document.getElementById("qrSheetShiftSelect");
    if (shiftSel) shiftSel.value = initialShift;
    this.renderClassAttendanceQrSheet();
    this.open("classAttendanceQrSheetModal");
  },

  onQrSheetFilterChange() {
    this._qrSheetShift = document.getElementById("qrSheetShiftSelect")?.value || "all";
    this._qrSheetCourse = document.getElementById("qrSheetCourseSelect")?.value || "all";
    this._qrSheetLayout = document.getElementById("qrSheetLayoutSelect")?.value || "grid";
    this.renderClassAttendanceQrSheet();
  },

  renderClassAttendanceQrSheet() {
    const paper = document.getElementById("attendanceQrSheetPaper");
    if (!paper) return;

    const allStudents = (typeof StudentAPI !== "undefined")
      ? StudentAPI.getLocalStudents()
      : (App.state.students || []);

    const showPhoto = document.getElementById("qrSheetTogglePhoto")?.checked !== false;
    const showChecks = document.getElementById("qrSheetToggleChecks")?.checked !== false;
    const showSeal = document.getElementById("qrSheetToggleSeal")?.checked !== false;

    // Filter active students by shift and course
    let filtered = allStudents.filter(s => {
      const active = s.Status !== "Dropped" && s.Status !== "បោះបង់" && s.Status !== "Graduated";
      const shiftMatch = this._qrSheetShift === "all" || (s.Shift && s.Shift.includes(this._qrSheetShift));
      const courseMatch = this._qrSheetCourse === "all" || (s.Course && s.Course.toLowerCase().includes(this._qrSheetCourse.toLowerCase()));
      return active && shiftMatch && courseMatch;
    });

    if (filtered.length === 0) {
      filtered = allStudents.filter(s => s.Status !== "Dropped" && s.Status !== "បោះបង់");
    }

    const maleCount = filtered.filter(s => s.Gender === "ប្រុស" || s.Gender === "M").length;
    const femaleCount = filtered.filter(s => s.Gender === "ស្រី" || s.Gender === "F").length;
    const now = new Date();
    const monthNames = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const currentMonthKh = monthNames[now.getMonth()];
    const currentYearKh = now.getFullYear();

    let html = `
      <div class="qr-sheet-header-top">
        <div class="qr-sheet-school-block">
          <div class="qr-sheet-school-logo">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <div style="font-size: 13.5px; font-weight: 800; color: #1e3a8a; text-transform: uppercase;">សាលាកុំព្យូទ័រ TIS LAB COMPUTER</div>
            <div style="font-size: 10.5px; font-weight: 600; color: #475569;">MODERN STUDENT MANAGEMENT SYSTEM • SMART ATTENDANCE</div>
          </div>
        </div>
        <div class="qr-sheet-kingdom-block">
          <div class="qr-sheet-kingdom-title">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div class="qr-sheet-kingdom-motto">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
        </div>
      </div>

      <div class="qr-sheet-title-banner">
        <h2 class="qr-sheet-main-title">តារាងស្កេនវត្តមាន និងចុះហត្ថលេខាសិស្សប្រចាំវេន</h2>
        <div class="qr-sheet-sub-title">CLASS ATTENDANCE SCANNER & SIGNATURE ROSTER SHEET (A4)</div>
      </div>

      <div class="qr-sheet-meta-strip">
        <div><strong>វេនសិក្សា៖</strong> ${this._qrSheetShift === 'all' ? 'គ្រប់វេនទាំងអស់' : 'វេន' + this._qrSheetShift}</div>
        <div><strong>មុខវិជ្ជា៖</strong> ${this._qrSheetCourse === 'all' ? 'កុំព្យូទ័ររដ្ឋបាល' : this._qrSheetCourse}</div>
        <div><strong>ខែ/ឆ្នាំ៖</strong> ខែ${currentMonthKh} ឆ្នាំ${currentYearKh}</div>
        <div><strong>សរុបសិស្ស៖</strong> ${filtered.length} នាក់ (ស្រី ${femaleCount} / ប្រុស ${maleCount})</div>
        <div><strong>គ្រូទទួលបន្ទុក៖</strong> លោកគ្រូ ខៀន ធូ</div>
      </div>
    `;

    if (this._qrSheetLayout === "grid") {
      html += `<div class="qr-sheet-cards-grid" id="qrCardsGridContainer">`;
      filtered.forEach((s, idx) => {
        const photoHtml = showPhoto
          ? (s.Avatar
            ? `<img src="${s.Avatar}" class="qr-card-avatar" alt="${App.escapeHtml(s.NameKh)}" onerror="this.outerHTML='<div class=\\'qr-card-avatar-placeholder\\'><i class=\\'fa-solid fa-user\\'></i></div>'">`
            : `<div class="qr-card-avatar-placeholder"><i class="fa-solid fa-user"></i></div>`)
          : '';

        const checkStripHtml = showChecks ? `
          <div class="qr-card-check-strip">
            <div class="qr-day-box"><span class="qr-day-label">ចន្ទ</span><div class="qr-day-circle"></div></div>
            <div class="qr-day-box"><span class="qr-day-label">អង្គារ</span><div class="qr-day-circle"></div></div>
            <div class="qr-day-box"><span class="qr-day-label">ពុធ</span><div class="qr-day-circle"></div></div>
            <div class="qr-day-box"><span class="qr-day-label">ព្រហ</span><div class="qr-day-circle"></div></div>
            <div class="qr-day-box"><span class="qr-day-label">សុក្រ</span><div class="qr-day-circle"></div></div>
          </div>
        ` : '';

        html += `
          <div class="qr-card-item">
            <div class="qr-card-header">
              ${photoHtml}
              <div class="qr-card-info">
                <div class="qr-card-name-kh">${idx + 1}. ${App.escapeHtml(s.NameKh)}</div>
                <div class="qr-card-name-en">${App.escapeHtml(s.NameEn || '')} (${s.Gender === 'ស្រី' ? 'F' : 'M'})</div>
                <div class="qr-card-id-badge">${s.ID}</div>
              </div>
            </div>
            <div class="qr-card-middle">
              <div id="qrCodeCard_${s.ID}" class="qr-card-code-container"></div>
            </div>
            ${checkStripHtml}
          </div>
        `;
      });
      html += `</div>`;
    } else {
      // Table List
      html += `
        <table class="qr-sheet-table-roster">
          <thead>
            <tr>
              <th style="width: 28px;">#</th>
              ${showPhoto ? '<th style="width: 42px;">រូបថត</th>' : ''}
              <th style="width: 65px;">អត្តលេខ</th>
              <th style="text-align: left;">គោត្តនាម និងនាម</th>
              <th style="width: 40px;">ភេទ</th>
              <th style="width: 65px;">QR ស្កេន</th>
              ${showChecks ? `
                <th style="width: 40px;">ចន្ទ</th>
                <th style="width: 40px;">អង្គារ</th>
                <th style="width: 40px;">ពុធ</th>
                <th style="width: 40px;">ព្រហ</th>
                <th style="width: 40px;">សុក្រ</th>
              ` : ''}
              <th>ផ្សេងៗ / សម្គាល់</th>
            </tr>
          </thead>
          <tbody>
      `;

      filtered.forEach((s, idx) => {
        const photoTd = showPhoto
          ? `<td style="text-align: center;">
              ${s.Avatar
                ? `<img src="${s.Avatar}" style="width: 30px; height: 38px; object-fit: cover; border-radius: 3px; border: 1px solid #cbd5e1;">`
                : `<div style="width: 30px; height: 38px; background: #e2e8f0; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; color: #64748b;"><i class="fa-solid fa-user"></i></div>`
              }
            </td>`
          : '';

        const checkTds = showChecks ? `
          <td style="text-align: center;"><div style="width: 14px; height: 14px; border: 1px solid #94a3b8; border-radius: 3px; margin: 0 auto;"></div></td>
          <td style="text-align: center;"><div style="width: 14px; height: 14px; border: 1px solid #94a3b8; border-radius: 3px; margin: 0 auto;"></div></td>
          <td style="text-align: center;"><div style="width: 14px; height: 14px; border: 1px solid #94a3b8; border-radius: 3px; margin: 0 auto;"></div></td>
          <td style="text-align: center;"><div style="width: 14px; height: 14px; border: 1px solid #94a3b8; border-radius: 3px; margin: 0 auto;"></div></td>
          <td style="text-align: center;"><div style="width: 14px; height: 14px; border: 1px solid #94a3b8; border-radius: 3px; margin: 0 auto;"></div></td>
        ` : '';

        html += `
          <tr>
            <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
            ${photoTd}
            <td style="text-align: center; font-family: monospace; font-weight: 700; color: #0284c7;">${s.ID}</td>
            <td>
              <div style="font-weight: 700; color: #0f172a;">${App.escapeHtml(s.NameKh)}</div>
              <div style="font-size: 9.5px; color: #64748b;">${App.escapeHtml(s.NameEn || '')}</div>
            </td>
            <td style="text-align: center;">${s.Gender || '—'}</td>
            <td style="text-align: center;">
              <div id="qrCodeTable_${s.ID}" class="qr-table-code-container"></div>
            </td>
            ${checkTds}
            <td style="font-size: 9px; color: #64748b;">${s.Phone || ''}</td>
          </tr>
        `;
      });
      html += `</tbody></table>`;
    }

    const sealHtml = showSeal ? `
      <div class="qr-sheet-sign-seal-group">
        <div class="school-red-seal" style="width: 80px; height: 80px; font-size: 8.5px;">
          <div>★ ★ ★</div>
          <div>សាលាកុំព្យូទ័រ</div>
          <div style="font-size: 7.5px;">TIS LAB COMPUTER</div>
          <div>ត្រាផ្លូវការ</div>
          <div>★ ★ ★</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 10.5px; font-weight: 600; color: #475569;">ថ្ងៃទី ${now.getDate()} ខែ${currentMonthKh} ឆ្នាំ${currentYearKh}</div>
          <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 2px;">ហត្ថលេខាគ្រូទទួលបន្ទុក</div>
          <svg class="teacher-signature-svg" style="height: 38px;" viewBox="0 0 160 50">
            <path d="M 15 35 Q 35 10 55 30 T 95 20 T 135 32 Q 150 25 155 35" fill="none" stroke="#1e3a8a" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <div style="font-size: 10.5px; font-weight: 700; color: #1e3a8a;">លោកគ្រូ ខៀន ធូ</div>
        </div>
      </div>
    ` : '';

    html += `
      <div class="qr-sheet-footer-block">
        <div class="qr-sheet-instructions-box">
          <strong>📌 របៀបប្រើប្រាស់តារាងនេះ៖</strong><br>
          • <strong>ស្កេនតាមទូរស័ព្ទ៖</strong> លើកទូរស័ព្ទបើកមុខងារ Scanner លើប្រព័ន្ធ រួចចង្អុលចំ QR Code របស់សិស្សដើម្បី Check វត្តមានភ្លាមៗ។<br>
          • <strong>ធីកដោយប៊ិច៖</strong> គូសធីកក្នុងប្រអប់ថ្ងៃនីមួយៗ (<strong>P</strong>: វត្តមាន, <strong>A</strong>: អវត្តមាន, <strong>L</strong>: ច្បាប់)។
        </div>
        ${sealHtml}
      </div>
    `;

    paper.innerHTML = html;

    setTimeout(() => {
      filtered.forEach(s => {
        const targetId = this._qrSheetLayout === "grid" ? `qrCodeCard_${s.ID}` : `qrCodeTable_${s.ID}`;
        const container = document.getElementById(targetId);
        if (container && typeof QRCode !== "undefined") {
          container.innerHTML = "";
          const qrSize = this._qrSheetLayout === "grid" ? 76 : 48;
          try {
            new QRCode(container, {
              text: s.ID,
              width: qrSize,
              height: qrSize,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.M
            });
          } catch (e) {
            console.warn("QR generation error:", e);
          }
        }
      });
    }, 50);
  },

  printClassAttendanceQrSheet() {
    document.body.classList.add("printing-attendance-qr-sheet");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-attendance-qr-sheet");
    }, 1500);
  },

  launchScannerFromQrSheet() {
    this.close("classAttendanceQrSheetModal");
    if (typeof App !== "undefined" && App.switchTab) {
      App.switchTab("attendance");
      setTimeout(() => {
        if (typeof AttendanceView !== "undefined" && AttendanceView.startQrScanner) {
          AttendanceView.startQrScanner();
        }
      }, 300);
    }
  },

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("open");
      modal.style.display = "none";
      document.body.style.overflow = "";

      if (modalId === "addStudentModal" && typeof App !== "undefined") {
        if (App.state.currentTab === "register") {
          App.switchTab(App.state.previousTab || "directory");
        }
      }
    }
  }
};

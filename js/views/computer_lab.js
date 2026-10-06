/**
 * View: Computer Lab Management System (NetSupport / Veyon Architecture)
 * Fully integrated into Tian Xin International School Student Management System.
 */
const ComputerLabView = {
  activeSubTab: "overview", // overview | computers | monitor | broadcast | files | messages | sessions | enrollment | logs | settings
  gridMode: "cards",        // cards | list
  monitorMatrix: "3x3",     // 2x2 | 3x3 | 4x4
  selectedPcIds: new Set(),
  searchQuery: "",
  statusFilter: "ALL",
  classroomFilter: "ALL",
  monitorIntervals: {},
  activeFullscreenAgentId: null,
  isRemoteControlActive: false,

  render() {
    return `
      <div id="view-computer-lab" class="page-view">
        <style>
          #view-computer-lab button {
            font-family: inherit;
            box-sizing: border-box;
          }
          .lab-container {
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            box-sizing: border-box;
            width: 100%;
          }
          .lab-header {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            background: rgba(18, 12, 32, 0.85);
            border: 1px solid rgba(139, 92, 246, 0.22);
            border-radius: 20px;
            padding: 20px 26px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
          }
          .lab-subnav {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(18, 12, 32, 0.9);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 16px;
            padding: 8px;
            overflow-x: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(16px);
          }
          .lab-tab-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 12px;
            border: 1px solid transparent;
            background: transparent;
            color: #94a3b8;
            font-weight: 700;
            font-size: 0.88rem;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            white-space: nowrap;
            outline: none;
          }
          .lab-tab-btn:hover {
            background: rgba(139, 92, 246, 0.14);
            color: #ffffff;
            border-color: rgba(139, 92, 246, 0.25);
          }
          .lab-tab-btn.active {
            background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 4px 16px rgba(6, 182, 212, 0.4);
            border-color: transparent !important;
          }
          .lab-action-bar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
            background: rgba(18, 12, 32, 0.85);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 16px;
            padding: 14px 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(16px);
          }
          .lab-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            font-size: 0.86rem;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            white-space: nowrap;
          }
          .lab-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
          }
          .lab-btn-primary { background: linear-gradient(135deg, #3b82f6, #6366f1); color: #ffffff; }
          .lab-btn-success { background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; }
          .lab-btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; }
          .lab-btn-danger  { background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; }
          .lab-btn-cyan    { background: linear-gradient(135deg, #06b6d4, #0284c7); color: #ffffff; }
          .lab-btn-purple  { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: #ffffff; }
          .lab-btn-dark    { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.16); color: #ffffff; }
          .lab-metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            gap: 16px;
            width: 100%;
          }
          .lab-metric-card {
            background: rgba(18, 12, 32, 0.85);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 18px;
            padding: 18px 22px;
            display: flex;
            align-items: center;
            gap: 18px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(16px);
            transition: transform 0.2s, border-color 0.2s;
          }
          .lab-metric-card:hover {
            transform: translateY(-2px);
            border-color: rgba(6, 182, 212, 0.4);
          }
          .lab-metric-icon {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
          }
          .lab-metric-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .lab-metric-info .val {
            font-size: 1.8rem;
            font-weight: 800;
            font-family: 'Outfit', sans-serif;
            color: #ffffff;
            line-height: 1.1;
          }
          .lab-metric-info .lbl {
            font-size: 0.82rem;
            color: #94a3b8;
            font-weight: 600;
          }
          .lab-computers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
            gap: 22px;
            width: 100%;
          }
        </style>
        <div class="lab-container">
          <!-- 1. Header Banner -->
          <div class="lab-header">
            <div class="lab-title-area">
              <div class="lab-icon-badge">
                <i class="fa-solid fa-desktop"></i>
              </div>
              <div class="lab-title-text">
                <h2>🖥 បន្ទប់កុំព្យូទ័រ (Computer Lab Management)</h2>
                <p>NetSupport-style Realtime Monitoring, Screen Broadcasting, Remote Control & Classroom Management</p>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <!-- Classroom Switcher -->
              <select id="labClassroomSelect" class="form-control" style="width: auto; font-weight: 700; background: var(--bg-surface-hover); border-radius: 10px; padding: 8px 14px; border: 1px solid rgba(139, 92, 246, 0.2); color: #ffffff;">
                <option value="ALL">🌐 បន្ទប់ទាំងអស់ (All Classrooms)</option>
                <option value="lab_a" selected>🖥 បន្ទប់កុំព្យូទ័រ A (Lab A - 40 PCs)</option>
                <option value="lab_b">🖥 បន្ទប់កុំព្យូទ័រ B (Lab B - 30 PCs)</option>
                <option value="lab_c">🖥 បន្ទប់កុំព្យូទ័រ C (Lab C - 25 PCs)</option>
              </select>

              <!-- WebSocket Live Indicator -->
              <div id="labWsStatusIndicator" style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3);">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
                <span id="labWsStatusText">WS Live</span>
              </div>
            </div>
          </div>

          <!-- 2. Sub-Navigation Tabs -->
          <div class="lab-subnav">
            <button type="button" class="lab-tab-btn active" data-sub="overview" onclick="ComputerLabView.switchSubTab('overview')">
              <i class="fa-solid fa-gauge-high"></i> <span>ផ្ទាំងបញ្ជា (Overview)</span>
            </button>
            <button type="button" class="lab-tab-btn" data-sub="computers" onclick="ComputerLabView.switchSubTab('computers')">
              <i class="fa-solid fa-network-wired"></i> <span>កុំព្យូទ័រ (Computers)</span>
            </button>
            <button type="button" class="lab-tab-btn" data-sub="monitor" onclick="ComputerLabView.switchSubTab('monitor')">
              <i class="fa-solid fa-tv"></i> <span>តាមដានអេក្រង់ (Screen Monitor)</span>
            </button>
            <button type="button" class="lab-tab-btn" data-sub="broadcast" onclick="ComputerLabView.switchSubTab('broadcast')">
              <i class="fa-solid fa-satellite-dish" style="color: #c084fc;"></i> <span>ផ្សាយអេក្រង់ (Broadcast)</span>
            </button>
            <button type="button" class="lab-tab-btn" data-sub="files" onclick="ComputerLabView.switchSubTab('files')">
              <i class="fa-solid fa-folder-arrow-up"></i> <span>ឯកសារ & កិច្ចការ (Files)</span>
            </button>
            <button type="button" class="lab-tab-btn" data-sub="messages" onclick="ComputerLabView.switchSubTab('messages')">
              <i class="fa-solid fa-comment-dots"></i> <span>ផ្ញើសារ (Messages)</span>
            </button>
            <button type="button" class="lab-tab-btn" data-sub="sessions" onclick="ComputerLabView.switchSubTab('sessions')">
              <i class="fa-solid fa-clock-rotate-left"></i> <span>វេនសិក្សា (Sessions)</span>
            </button>
            <button type="button" class="lab-tab-btn" data-sub="enrollment" onclick="ComputerLabView.switchSubTab('enrollment')">
              <i class="fa-solid fa-qrcode"></i> <span>ចុះឈ្មោះ & QR (Enrollment)</span>
            </button>
            <button type="button" class="lab-tab-btn" data-sub="logs" onclick="ComputerLabView.switchSubTab('logs')">
              <i class="fa-solid fa-clipboard-list"></i> <span>កំណត់ហេតុ (Audit Logs)</span>
            </button>
            <button type="button" class="lab-tab-btn" data-sub="settings" onclick="ComputerLabView.switchSubTab('settings')">
              <i class="fa-solid fa-sliders"></i> <span>ការកំណត់ (Settings)</span>
            </button>
          </div>

          <!-- 3. Dynamic Sub-View Mount Area -->
          <div id="labSubTabContent">
            <!-- Content will be rendered by switchSubTab -->
          </div>
        </div>

        <!-- Hidden Modals Container for Computer Lab -->
        <div id="labModalsMount"></div>
      </div>
    `;
  },

  initEvents() {
    // Initialize Lab WebSocket hub connection
    if (typeof LabManagerService !== "undefined") {
      LabManagerService.initWebSocket();

      // Listen for updates
      LabManagerService.on("computers_updated", () => {
        if (this.activeSubTab === "overview" || this.activeSubTab === "computers") {
          this.renderComputersSection();
          this.updateOverviewMetrics();
        } else if (this.activeSubTab === "monitor") {
          this.renderMonitorSection();
        }
      });

      LabManagerService.on("agent_telemetry", (data) => {
        this.updateCardTelemetry(data.agentId, data);
      });

      LabManagerService.on("screen_frame", (data) => {
        this.updateScreenThumbnail(data.agentId, data.url);
      });

      LabManagerService.on("connection_status", (data) => {
        const ind = document.getElementById("labWsStatusIndicator");
        const txt = document.getElementById("labWsStatusText");
        if (ind && txt) {
          if (data.status === "connected") {
            ind.style.color = "#10b981";
            ind.style.borderColor = "rgba(16, 185, 129, 0.25)";
            ind.style.background = "rgba(16, 185, 129, 0.12)";
            txt.innerText = "WS Live";
          } else {
            ind.style.color = "#ef4444";
            ind.style.borderColor = "rgba(239, 68, 68, 0.25)";
            ind.style.background = "rgba(239, 68, 68, 0.12)";
            txt.innerText = "Reconnecting...";
          }
        }
      });
    }

    // Classroom select change
    const roomSelect = document.getElementById("labClassroomSelect");
    if (roomSelect) {
      roomSelect.addEventListener("change", (e) => {
        this.classroomFilter = e.target.value;
        LabManagerService.activeClassroomId = e.target.value;
        this.refreshData();
      });
    }

    // Render initial subtab
    try {
      const savedSubTab = sessionStorage.getItem("tis_last_lab_subtab");
      if (savedSubTab) this.activeSubTab = savedSubTab;
    } catch (e) {}
    this.switchSubTab(this.activeSubTab);
  },

  onActivated() {
    this.refreshData();
  },

  async refreshData() {
    if (typeof LabManagerService !== "undefined") {
      await LabManagerService.getEnrolledComputers(this.classroomFilter);
      // Avoid resetting subtab view if user has an enrollment modal open
      if (!document.getElementById("labEnrollModalBackdrop") && !document.getElementById("labProjectorModalBackdrop")) {
        this.switchSubTab(this.activeSubTab);
      } else {
        this.updateOverviewMetrics();
      }
    }
  },

  switchSubTab(subTabId) {
    this.activeSubTab = subTabId;
    try {
      sessionStorage.setItem("tis_last_lab_subtab", subTabId);
    } catch (e) {}

    // Update active button
    document.querySelectorAll(".lab-tab-btn").forEach(btn => {
      if (btn.getAttribute("data-sub") === subTabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const mount = document.getElementById("labSubTabContent");
    if (!mount) return;

    if (subTabId === "overview") {
      mount.innerHTML = this.renderOverviewSection();
      this.updateOverviewMetrics();
    } else if (subTabId === "computers") {
      mount.innerHTML = this.renderComputersSection();
    } else if (subTabId === "monitor") {
      mount.innerHTML = this.renderMonitorSection();
    } else if (subTabId === "broadcast") {
      mount.innerHTML = this.renderBroadcastSection();
    } else if (subTabId === "files") {
      mount.innerHTML = this.renderFilesSection();
      this.loadFilesData();
    } else if (subTabId === "messages") {
      mount.innerHTML = this.renderMessagesSection();
    } else if (subTabId === "sessions") {
      mount.innerHTML = this.renderSessionsSection();
      this.loadSessionsData();
    } else if (subTabId === "enrollment") {
      mount.innerHTML = this.renderEnrollmentSection();
      this.loadEnrollmentData();
    } else if (subTabId === "logs") {
      mount.innerHTML = this.renderLogsSection();
      this.loadAuditLogsData();
    } else if (subTabId === "settings") {
      mount.innerHTML = this.renderSettingsSection();
      this.loadSettingsData();
    }
  },

  // =========================================================================
  // SUBTAB 1: OVERVIEW DASHBOARD
  // =========================================================================
  renderOverviewSection() {
    const computers = (LabManagerService && LabManagerService.computers) || [];
    const onlineCount = computers.filter(c => c.status === "online").length;
    const offlineCount = computers.filter(c => c.status === "offline").length;
    const lockedCount = computers.filter(c => c.isLocked).length;

    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Action Toolbar -->
        <div class="lab-action-bar">
          <button type="button" class="lab-btn lab-btn-success" onclick="ComputerLabView.openStartSessionModal()">
            <i class="fa-solid fa-play"></i> <span>ចាប់ផ្តើមវេន (Start Session)</span>
          </button>
          <button type="button" class="lab-btn lab-btn-cyan" onclick="ComputerLabView.openQrEnrollmentModal()">
            <i class="fa-solid fa-qrcode"></i> <span>បន្ថែមកុំព្យូទ័រ (Add Computers)</span>
          </button>
          <button type="button" class="lab-btn lab-btn-purple" onclick="ComputerLabView.switchSubTab('broadcast')">
            <i class="fa-solid fa-satellite-dish"></i> <span>ផ្សាយអេក្រង់ (Broadcast)</span>
          </button>
          <button type="button" class="lab-btn lab-btn-warning" onclick="ComputerLabView.lockAllComputers()">
            <i class="fa-solid fa-lock"></i> <span>ចាក់សោទាំងអស់ (Lock All)</span>
          </button>
          <button type="button" class="lab-btn lab-btn-primary" onclick="ComputerLabView.unlockAllComputers()">
            <i class="fa-solid fa-lock-open"></i> <span>ដោះសោទាំងអស់ (Unlock All)</span>
          </button>
          <button type="button" class="lab-btn lab-btn-dark" onclick="ComputerLabView.openSendFileModal('ALL')">
            <i class="fa-solid fa-file-arrow-up"></i> <span>ផ្ញើឯកសារ (Send File)</span>
          </button>
          <button type="button" class="lab-btn lab-btn-dark" onclick="ComputerLabView.openSendMessageModal('ALL')">
            <i class="fa-solid fa-comment"></i> <span>ផ្ញើសារ (Message)</span>
          </button>
          <button type="button" class="lab-btn lab-btn-dark" onclick="ComputerLabView.openUrlModal('ALL')">
            <i class="fa-solid fa-globe"></i> <span>បើក Web (Open URL)</span>
          </button>
          <button type="button" class="lab-btn lab-btn-danger" onclick="ComputerLabView.confirmRestartOrShutdown('RESTART', 'ALL')">
            <i class="fa-solid fa-rotate-right"></i> <span>Restart All</span>
          </button>
          <button type="button" class="lab-btn lab-btn-danger" onclick="ComputerLabView.confirmRestartOrShutdown('SHUTDOWN', 'ALL')">
            <i class="fa-solid fa-power-off"></i> <span>Shutdown All</span>
          </button>
        </div>

        <!-- Metrics Cards -->
        <div class="lab-metrics-grid">
          <div class="lab-metric-card">
            <div class="lab-metric-icon" style="background: rgba(59, 130, 246, 0.12); color: #3b82f6;">
              <i class="fa-solid fa-desktop"></i>
            </div>
            <div class="lab-metric-info">
              <div class="val" id="metricTotalPcs">${computers.length}</div>
              <div class="lbl">កុំព្យូទ័រសរុប (Total PCs)</div>
            </div>
          </div>

          <div class="lab-metric-card">
            <div class="lab-metric-icon" style="background: rgba(16, 185, 129, 0.12); color: #10b981;">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="lab-metric-info">
              <div class="val" id="metricOnlinePcs" style="color: #10b981;">${onlineCount}</div>
              <div class="lbl">កំពុងដំណើរការ (Online)</div>
            </div>
          </div>

          <div class="lab-metric-card">
            <div class="lab-metric-icon" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;">
              <i class="fa-solid fa-circle-xmark"></i>
            </div>
            <div class="lab-metric-info">
              <div class="val" id="metricOfflinePcs" style="color: #ef4444;">${offlineCount}</div>
              <div class="lbl">បិទម៉ាស៊ីន (Offline)</div>
            </div>
          </div>

          <div class="lab-metric-card">
            <div class="lab-metric-icon" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
              <i class="fa-solid fa-lock"></i>
            </div>
            <div class="lab-metric-info">
              <div class="val" id="metricLockedPcs" style="color: #f59e0b;">${lockedCount}</div>
              <div class="lbl">បានចាក់សោ (Locked)</div>
            </div>
          </div>

          <div class="lab-metric-card">
            <div class="lab-metric-icon" style="background: rgba(139, 92, 246, 0.12); color: #8b5cf6;">
              <i class="fa-solid fa-user-graduate"></i>
            </div>
            <div class="lab-metric-info">
              <div class="val" id="metricAssignedStudents" style="color: #8b5cf6;">
                ${computers.filter(c => c.assignedStudentId).length}
              </div>
              <div class="lbl">សិស្សតភ្ជាប់ (Students)</div>
            </div>
          </div>
        </div>

        <!-- Live Computers Preview Grid -->
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-main);">
              🖥 កុំព្យូទ័រសិស្សក្នុងបន្ទប់ (Live Classroom Computers)
            </h3>
            <button type="button" class="btn-sm btn-ghost" onclick="ComputerLabView.switchSubTab('computers')">
              មើលទាំងអស់ (View All) <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          ${this.renderComputersCardsHtml(computers.slice(0, 12))}
        </div>
      </div>
    `;
  },

  updateOverviewMetrics() {
    const computers = (LabManagerService && LabManagerService.computers) || [];
    const online = computers.filter(c => c.status === "online").length;
    const offline = computers.filter(c => c.status === "offline").length;
    const locked = computers.filter(c => c.isLocked).length;
    const assigned = computers.filter(c => c.assignedStudentId).length;

    const elTotal = document.getElementById("metricTotalPcs");
    const elOnline = document.getElementById("metricOnlinePcs");
    const elOffline = document.getElementById("metricOfflinePcs");
    const elLocked = document.getElementById("metricLockedPcs");
    const elAssigned = document.getElementById("metricAssignedStudents");

    if (elTotal) elTotal.innerText = computers.length;
    if (elOnline) elOnline.innerText = online;
    if (elOffline) elOffline.innerText = offline;
    if (elLocked) elLocked.innerText = locked;
    if (elAssigned) elAssigned.innerText = assigned;
  },

  // =========================================================================
  // SUBTAB 2: COMPUTERS GRID & LIST
  // =========================================================================
  renderComputersSection() {
    const computers = (LabManagerService && LabManagerService.computers) || [];
    const filtered = this.getFilteredComputers(computers);

    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Filters & View Mode Bar -->
        <div class="lab-action-bar" style="justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; flex: 1;">
            <div class="search-input-wrap" style="max-width: 280px; width: 100%;">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input type="text" id="labSearchPcInput" class="form-control search-input" placeholder="ស្វែងរកកុំព្យូទ័រ / សិស្ស..." value="${this.searchQuery}" oninput="ComputerLabView.handleSearch(this.value)">
            </div>

            <select id="labFilterStatus" class="form-control" style="width: auto; padding: 8px 14px;" onchange="ComputerLabView.handleStatusFilter(this.value)">
              <option value="ALL" ${this.statusFilter === "ALL" ? "selected" : ""}>ស្ថានភាពទាំងអស់ (All Status)</option>
              <option value="online" ${this.statusFilter === "online" ? "selected" : ""}>🟢 កំពុងដំណើរការ (Online)</option>
              <option value="offline" ${this.statusFilter === "offline" ? "selected" : ""}>🔴 បិទម៉ាស៊ីន (Offline)</option>
              <option value="locked" ${this.statusFilter === "locked" ? "selected" : ""}>🔒 បានចាក់សោ (Locked)</option>
            </select>

            <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 700;">
              បង្ហាញ ${filtered.length} ក្នុងចំណោម ${computers.length} គ្រឿង
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn-icon ${this.gridMode === 'cards' ? 'active' : ''}" title="Card Grid" onclick="ComputerLabView.setGridMode('cards')">
              <i class="fa-solid fa-grip"></i>
            </button>
            <button type="button" class="btn-icon ${this.gridMode === 'list' ? 'active' : ''}" title="Table List" onclick="ComputerLabView.setGridMode('list')">
              <i class="fa-solid fa-list"></i>
            </button>
          </div>
        </div>

        <!-- Render Grid or List -->
        ${this.gridMode === 'cards' ? this.renderComputersCardsHtml(filtered) : this.renderComputersListHtml(filtered)}
      </div>
    `;
  },

  getFilteredComputers(computers) {
    let list = [...computers];

    if (this.classroomFilter && this.classroomFilter !== "ALL") {
      list = list.filter(c => c.classroomId === this.classroomFilter);
    }

    if (this.statusFilter && this.statusFilter !== "ALL") {
      if (this.statusFilter === "locked") {
        list = list.filter(c => c.isLocked);
      } else {
        list = list.filter(c => c.status === this.statusFilter);
      }
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(c =>
        (c.displayName && c.displayName.toLowerCase().includes(q)) ||
        (c.hostname && c.hostname.toLowerCase().includes(q)) ||
        (c.ipAddress && c.ipAddress.toLowerCase().includes(q)) ||
        (c.seatNumber && c.seatNumber.toLowerCase().includes(q)) ||
        (c.assignedStudentName && c.assignedStudentName.toLowerCase().includes(q)) ||
        (c.assignedStudentId && c.assignedStudentId.toLowerCase().includes(q))
      );
    }

    return list;
  },

  handleSearch(val) {
    this.searchQuery = val;
    this.switchSubTab("computers");
  },

  handleStatusFilter(val) {
    this.statusFilter = val;
    this.switchSubTab("computers");
  },

  setGridMode(mode) {
    this.gridMode = mode;
    this.switchSubTab("computers");
  },

  renderComputersCardsHtml(computers) {
    if (!computers || computers.length === 0) {
      return `
        <div style="background: var(--bg-surface); border: 2px dashed var(--border-color); border-radius: 16px; padding: 48px; text-align: center;">
          <i class="fa-solid fa-desktop" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i>
          <h4 style="font-size: 1.1rem; color: var(--text-main); margin: 0 0 8px 0;">មិនទាន់មានកុំព្យូទ័របានចុះឈ្មោះនៅឡើយទេ</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 480px; margin: 0 auto 20px auto;">
            សូមចុចប៊ូតុង "បន្ថែមកុំព្យូទ័រ (Add Computers)" ដើម្បីបង្ហាញ QR Code ឬទាញយក Student Agent ដំឡើងលើកុំព្យូទ័រសិស្ស។
          </p>
          <button type="button" class="lab-btn lab-btn-cyan" onclick="ComputerLabView.openQrEnrollmentModal()">
            <i class="fa-solid fa-qrcode"></i> បង្ហាញ QR Code ចុះឈ្មោះ
          </button>
        </div>
      `;
    }

    return `
      <div class="lab-computers-grid">
        ${computers.map(pc => this.renderPcCard(pc)).join("")}
      </div>
    `;
  },

  renderPcCard(pc) {
    const isOnline = pc.status === "online";
    const statusClass = pc.isLocked ? "status-locked" : (isOnline ? "status-online" : "status-offline");
    const statusText = pc.isLocked ? "🔒 Locked" : (isOnline ? "🟢 Online" : "🔴 Offline");
    const telem = (LabManagerService && LabManagerService.telemetry && LabManagerService.telemetry[pc.agentId]) || {};
    const cpu = telem.cpuUsage || pc.cpuUsage || 0;
    const ram = telem.ramUsage || pc.ramUsage || 0;
    const latency = telem.latencyMs || 1;
    const activeWin = telem.activeWindow || "";
    const thumbnail = (LabManagerService && LabManagerService.screenFrames && LabManagerService.screenFrames[pc.agentId]) || null;

    return `
      <div class="lab-pc-card" id="pcCard_${pc.agentId}" data-agent-id="${pc.agentId}">
        <!-- Header -->
        <div class="lab-pc-header">
          <div class="lab-pc-title">
            <span class="lab-pc-seat">${pc.seatNumber || 'A01'}</span>
            <h4 title="${pc.hostname || ''}">${pc.displayName || pc.hostname || 'PC'}</h4>
          </div>
          <span class="lab-status-badge ${statusClass}">
            ${statusText}
          </span>
        </div>

        <!-- Live Screen Preview -->
        <div class="lab-pc-screen-wrap" ondblclick="ComputerLabView.openFullscreenMonitor('${pc.agentId}')" title="ចុចពីរដងដើម្បីមើលពេញអេក្រង់ (Double click for full screen)">
          ${thumbnail ? `
            <img src="${thumbnail}" id="screenImg_${pc.agentId}" class="lab-pc-screen-img" alt="Screen Preview">
          ` : `
            <div id="screenFallback_${pc.agentId}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.4); text-align: center; padding: 12px;">
              <i class="fa-solid fa-display" style="font-size: 2.2rem; margin-bottom: 8px; color: ${isOnline ? '#38bdf8' : '#64748b'};"></i>
              <span style="font-size: 0.72rem; font-weight: 700; color: #94a3b8;">${isOnline ? (activeWin ? activeWin.slice(0, 24) : 'Windows Desktop') : 'ម៉ាស៊ីនមិនទាន់បើក (Standby)'}</span>
            </div>
          `}
          <div class="lab-pc-screen-overlay">
            <button type="button" class="btn-sm lab-btn-primary" onclick="ComputerLabView.openFullscreenMonitor('${pc.agentId}')">
              <i class="fa-solid fa-expand"></i> មើលអេក្រង់ធំ
            </button>
          </div>
        </div>

        <!-- Body / Student & Telemetry -->
        <div class="lab-pc-body">
          <!-- Student Info -->
          <div class="lab-pc-student-info">
            <div class="student-tag">
              <i class="fa-solid fa-user-graduate text-cyan-400"></i>
              <span>${pc.assignedStudentName ? `${pc.assignedStudentName} (${pc.assignedStudentId})` : '<span style="color: var(--text-muted); font-weight: normal;">មិនទាន់កំណត់សិស្ស</span>'}</span>
            </div>
            <button type="button" class="btn-xs btn-ghost" onclick="ComputerLabView.openAssignStudentModal('${pc.agentId}')" title="កំណត់សិស្សអង្គុយ (Assign Student)">
              <i class="fa-solid fa-user-pen"></i>
            </button>
          </div>

          <!-- Gauges -->
          <div class="lab-telemetry-row">
            <span>CPU: <strong id="cpuVal_${pc.agentId}">${cpu}%</strong></span>
            <div class="telemetry-bar-wrap">
              <div class="telemetry-bar-fill" id="cpuBar_${pc.agentId}" style="width: ${cpu}%; background: ${cpu > 80 ? '#ef4444' : '#10b981'};"></div>
            </div>
          </div>

          <div class="lab-telemetry-row">
            <span>RAM: <strong id="ramVal_${pc.agentId}">${ram}%</strong></span>
            <div class="telemetry-bar-wrap">
              <div class="telemetry-bar-fill" id="ramBar_${pc.agentId}" style="width: ${ram}%; background: ${ram > 85 ? '#ef4444' : '#3b82f6'};"></div>
            </div>
          </div>

          <div class="lab-telemetry-row" style="font-size: 0.7rem;">
            <span>IP: <code style="font-family: var(--font-mono); color: #38bdf8;">${pc.ipAddress || '127.0.0.1'}</code></span>
            <span>Ping: <strong style="color: #10b981;">${latency}ms</strong></span>
          </div>
        </div>

        <!-- Action Toolbar -->
        <div class="lab-pc-actions">
          <button type="button" class="lab-pc-btn" onclick="ComputerLabView.openFullscreenMonitor('${pc.agentId}')" title="តាមដានអេក្រង់">
            <i class="fa-solid fa-eye"></i> មើល
          </button>
          <button type="button" class="lab-pc-btn" onclick="ComputerLabView.startRemoteControl('${pc.agentId}')" title="បញ្ជា Mouse & Keyboard">
            <i class="fa-solid fa-gamepad"></i> បញ្ជា
          </button>
          <button type="button" class="lab-pc-btn" onclick="ComputerLabView.openSendMessageModal(['${pc.agentId}'])" title="ផ្ញើសារ">
            <i class="fa-solid fa-comment"></i> សារ
          </button>
          <button type="button" class="lab-pc-btn" onclick="ComputerLabView.openSendFileModal(['${pc.agentId}'])" title="ផ្ញើឯកសារ">
            <i class="fa-solid fa-folder"></i> ឯកសារ
          </button>
          <button type="button" class="lab-pc-btn" onclick="ComputerLabView.toggleLockPc('${pc.agentId}', ${!pc.isLocked})" title="${pc.isLocked ? 'ដោះសោ' : 'ចាក់សោ'}">
            <i class="fa-solid ${pc.isLocked ? 'fa-lock-open text-emerald-400' : 'fa-lock text-amber-400'}"></i>
          </button>
          <button type="button" class="lab-pc-btn" onclick="ComputerLabView.openPcMoreMenu('${pc.agentId}')" title="ជម្រើសបន្ថែម">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderComputersListHtml(computers) {
    return `
      <div class="table-responsive" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px;">
        <table class="table">
          <thead>
            <tr>
              <th>កៅអី</th>
              <th>ឈ្មោះកុំព្យូទ័រ</th>
              <th>សិស្សកំពុងអង្គុយ</th>
              <th>IP & Machine ID</th>
              <th>Hardware (CPU/RAM)</th>
              <th>ស្ថានភាព</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            ${computers.map(pc => {
              const isOnline = pc.status === "online";
              return `
                <tr>
                  <td><span class="lab-pc-seat">${pc.seatNumber || 'A01'}</span></td>
                  <td><strong>${pc.displayName || pc.hostname}</strong></td>
                  <td>
                    ${pc.assignedStudentName ? `
                      <span style="font-weight: 700; color: #38bdf8;">${pc.assignedStudentName}</span>
                      <small style="color: var(--text-muted); display: block;">ID: ${pc.assignedStudentId}</small>
                    ` : '<span style="color: var(--text-muted);">មិនទាន់កំណត់</span>'}
                  </td>
                  <td>
                    <code style="font-family: var(--font-mono); color: #0284c7;">${pc.ipAddress}</code>
                    <small style="display: block; color: var(--text-muted);">${(pc.machineId || '').slice(0, 16)}...</small>
                  </td>
                  <td>
                    <small style="display: block;">${pc.cpu || 'CPU'} | ${pc.ram || 'RAM'}</small>
                    <small style="color: var(--text-muted);">${pc.screenResolution || '1920x1080'}</small>
                  </td>
                  <td>
                    <span class="lab-status-badge ${pc.isLocked ? 'status-locked' : (isOnline ? 'status-online' : 'status-offline')}">
                      ${pc.isLocked ? '🔒 Locked' : (isOnline ? '🟢 Online' : '🔴 Offline')}
                    </span>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <button type="button" class="btn-xs btn-outline" onclick="ComputerLabView.openFullscreenMonitor('${pc.agentId}')" title="មើលអេក្រង់">
                        <i class="fa-solid fa-eye"></i>
                      </button>
                      <button type="button" class="btn-xs btn-outline" onclick="ComputerLabView.startRemoteControl('${pc.agentId}')" title="បញ្ជា">
                        <i class="fa-solid fa-gamepad"></i>
                      </button>
                      <button type="button" class="btn-xs btn-outline" onclick="ComputerLabView.openSendMessageModal(['${pc.agentId}'])" title="ផ្ញើសារ">
                        <i class="fa-solid fa-comment"></i>
                      </button>
                      <button type="button" class="btn-xs btn-outline" onclick="ComputerLabView.toggleLockPc('${pc.agentId}', ${!pc.isLocked})">
                        <i class="fa-solid ${pc.isLocked ? 'fa-lock-open' : 'fa-lock'}"></i>
                      </button>
                      <button type="button" class="btn-xs btn-danger" onclick="ComputerLabView.deleteComputer('${pc.agentId}')" title="លុបចេញ">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  },

  updateCardTelemetry(agentId, telem) {
    const cpuEl = document.getElementById(`cpuVal_${agentId}`);
    const cpuBar = document.getElementById(`cpuBar_${agentId}`);
    const ramEl = document.getElementById(`ramVal_${agentId}`);
    const ramBar = document.getElementById(`ramBar_${agentId}`);

    if (cpuEl) cpuEl.innerText = `${telem.cpuUsage}%`;
    if (cpuBar) {
      cpuBar.style.width = `${telem.cpuUsage}%`;
      cpuBar.style.background = telem.cpuUsage > 80 ? '#ef4444' : '#10b981';
    }
    if (ramEl) ramEl.innerText = `${telem.ramUsage}%`;
    if (ramBar) {
      ramBar.style.width = `${telem.ramUsage}%`;
      ramBar.style.background = telem.ramUsage > 85 ? '#ef4444' : '#3b82f6';
    }
  },

  updateScreenThumbnail(agentId, url) {
    const img = document.getElementById(`screenImg_${agentId}`);
    const fallback = document.getElementById(`screenFallback_${agentId}`);
    if (img) {
      img.src = url;
    } else if (fallback && fallback.parentElement) {
      fallback.parentElement.innerHTML = `
        <img src="${url}" id="screenImg_${agentId}" class="lab-pc-screen-img" alt="Screen Preview">
        <div class="lab-pc-screen-overlay">
          <button type="button" class="btn-sm lab-btn-primary" onclick="ComputerLabView.openFullscreenMonitor('${agentId}')">
            <i class="fa-solid fa-expand"></i> មើលអេក្រង់ធំ
          </button>
        </div>
      `;
    }

    // Also update tile in multi-screen matrix if open
    const matrixImg = document.getElementById(`matrixImg_${agentId}`);
    if (matrixImg) matrixImg.src = url;

    // Also update fullscreen modal canvas/image if active
    if (this.activeFullscreenAgentId === agentId) {
      const fullImg = document.getElementById("fullMonitorImage");
      if (fullImg) fullImg.src = url;
    }
  },

  // =========================================================================
  // SUBTAB 3: MULTI-SCREEN MONITOR
  // =========================================================================
  renderMonitorSection() {
    const computers = (LabManagerService && LabManagerService.computers) || [];
    const online = computers.filter(c => c.status === "online");

    // Automatically request screen streams for online PCs
    online.forEach(pc => {
      LabManagerService.requestScreenStream(pc.agentId, 10, "medium");
    });

    return `
      <div class="lab-matrix-wrap">
        <div class="matrix-toolbar">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">
              <i class="fa-solid fa-tv text-cyan-400"></i> ទម្រង់អេក្រង់ (Matrix Grid):
            </span>
            <div style="display: flex; gap: 6px;">
              <button type="button" class="btn-xs ${this.monitorMatrix === '2x2' ? 'lab-btn-cyan' : 'btn-outline'}" onclick="ComputerLabView.setMatrixGrid('2x2')">2×2</button>
              <button type="button" class="btn-xs ${this.monitorMatrix === '3x3' ? 'lab-btn-cyan' : 'btn-outline'}" onclick="ComputerLabView.setMatrixGrid('3x3')">3×3</button>
              <button type="button" class="btn-xs ${this.monitorMatrix === '4x4' ? 'lab-btn-cyan' : 'btn-outline'}" onclick="ComputerLabView.setMatrixGrid('4x4')">4×4</button>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">FPS:</span>
              <select id="matrixFpsSelect" class="form-control" style="width: auto; padding: 4px 10px; font-size: 0.8rem;" onchange="ComputerLabView.updateStreamSettings()">
                <option value="5">5 FPS (Save LAN)</option>
                <option value="10" selected>10 FPS (Standard)</option>
                <option value="15">15 FPS (Smooth)</option>
                <option value="25">25 FPS (Ultra)</option>
              </select>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Quality:</span>
              <select id="matrixQualitySelect" class="form-control" style="width: auto; padding: 4px 10px; font-size: 0.8rem;" onchange="ComputerLabView.updateStreamSettings()">
                <option value="low">Low (Fastest)</option>
                <option value="medium" selected>Medium (Optimal)</option>
                <option value="high">High (Crisp)</option>
              </select>
            </div>

            <span style="font-size: 0.8rem; color: #10b981; font-weight: 700;">
              🟢 ${online.length} គ្រឿងកំពុង Stream
            </span>
          </div>
        </div>

        <!-- Tiles Grid -->
        <div class="matrix-grid-${this.monitorMatrix}">
          ${online.map(pc => {
            const frame = (LabManagerService && LabManagerService.screenFrames && LabManagerService.screenFrames[pc.agentId]) || '';
            return `
              <div class="matrix-tile" ondblclick="ComputerLabView.openFullscreenMonitor('${pc.agentId}')">
                <div class="matrix-tile-header">
                  <span>${pc.seatNumber || 'PC'} - ${pc.displayName || pc.hostname}</span>
                  <div style="display: flex; gap: 4px;">
                    <button type="button" class="btn-xs btn-ghost" onclick="event.stopPropagation(); ComputerLabView.startRemoteControl('${pc.agentId}')" title="Remote Control">
                      <i class="fa-solid fa-gamepad"></i>
                    </button>
                    <button type="button" class="btn-xs btn-ghost" onclick="event.stopPropagation(); ComputerLabView.openFullscreenMonitor('${pc.agentId}')" title="Full Screen">
                      <i class="fa-solid fa-expand"></i>
                    </button>
                  </div>
                </div>

                <img id="matrixImg_${pc.agentId}" src="${frame || 'assets/images/logo.png'}" style="width: 100%; height: 100%; object-fit: cover;" alt="${pc.displayName}">
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  setMatrixGrid(grid) {
    this.monitorMatrix = grid;
    this.switchSubTab("monitor");
  },

  updateStreamSettings() {
    const fps = parseInt(document.getElementById("matrixFpsSelect").value, 10) || 10;
    const quality = document.getElementById("matrixQualitySelect").value || "medium";
    const online = (LabManagerService && LabManagerService.computers.filter(c => c.status === "online")) || [];

    online.forEach(pc => {
      LabManagerService.requestScreenStream(pc.agentId, fps, quality);
    });

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`Updated stream: ${fps} FPS (${quality})`, "info");
    }
  },

  // =========================================================================
  // SUBTAB 4: SCREEN BROADCAST (TEACHER -> STUDENTS)
  // =========================================================================
  renderBroadcastSection() {
    const isBroadcasting = LabManagerService && LabManagerService.activeBroadcast;

    return `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px; display: flex; flex-direction: column; gap: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <h3 style="margin: 0 0 6px 0; font-size: 1.3rem; font-weight: 800; color: var(--text-main);">
              <i class="fa-solid fa-satellite-dish text-purple-400"></i> ផ្សាយអេក្រង់គ្រូបង្រៀន (Teacher Screen Broadcast)
            </h3>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">
              ផ្សាយផ្ទាល់អេក្រង់កុំព្យូទ័រលោកគ្រូ/អ្នកគ្រូ ទៅកាន់កុំព្យូទ័រសិស្សទាំងអស់ក្នុងបន្ទប់ ដោយផ្ទាល់តាម LAN
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            ${isBroadcasting ? `
              <button type="button" class="lab-btn lab-btn-danger" onclick="ComputerLabView.stopScreenBroadcast()">
                <i class="fa-solid fa-stop"></i> <span>បញ្ឈប់ការផ្សាយ (Stop Broadcast)</span>
              </button>
            ` : `
              <button type="button" class="lab-btn lab-btn-purple" onclick="ComputerLabView.startScreenBroadcast()">
                <i class="fa-solid fa-play"></i> <span>ចាប់ផ្តើមផ្សាយអេក្រង់ (Start Broadcast)</span>
              </button>
            `}
          </div>
        </div>

        <!-- Broadcast Status Banner -->
        <div style="background: ${isBroadcasting ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)'}; border: 1px solid ${isBroadcasting ? '#8b5cf6' : 'var(--border-color)'}; border-radius: 14px; padding: 20px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: ${isBroadcasting ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #fff;">
              <i class="fa-solid ${isBroadcasting ? 'fa-satellite-dish fa-fade' : 'fa-tv'}"></i>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1rem; color: var(--text-main);">
                ${isBroadcasting ? '🔴 កំពុងផ្សាយផ្ទាល់ទៅកាន់សិស្ស (Broadcasting Live)' : '⚪ ការផ្សាយអេក្រង់ត្រូវបានបិទ (Broadcast Idle)'}
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">
                ${isBroadcasting ? 'កុំព្យូទ័រសិស្សទាំងអស់កំពុងបង្ហាញអេក្រង់របស់អ្នកក្នុងកម្រិត Fullscreen/Window' : 'ចុចប៊ូតុងខាងលើ ដើម្បីជ្រើសរើស Screen ឬ Window ដែលចង់ផ្សាយ'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async startScreenBroadcast() {
    try {
      await LabManagerService.startScreenBroadcast("ALL", 10);
      this.switchSubTab("broadcast");
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Teacher screen broadcast started successfully!", "success");
      }
    } catch (err) {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Broadcast cancelled or failed: " + err.message, "warning");
      }
    }
  },

  stopScreenBroadcast() {
    LabManagerService.stopScreenBroadcast();
    this.switchSubTab("broadcast");
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("Screen broadcast stopped.", "info");
    }
  },

  // =========================================================================
  // SUBTAB 5: FILE TRANSFER & ASSIGNMENT COLLECTION
  // =========================================================================
  renderFilesSection() {
    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Action Row -->
        <div class="lab-action-bar" style="justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <button type="button" class="lab-btn lab-btn-primary" onclick="ComputerLabView.openSendFileModal('ALL')">
              <i class="fa-solid fa-cloud-arrow-up"></i> <span>ផ្ញើឯកសារមេរៀន (Send Lesson File)</span>
            </button>
            <button type="button" class="lab-btn lab-btn-dark" onclick="ComputerLabView.loadFilesData()">
              <i class="fa-solid fa-rotate"></i> <span>Refresh</span>
            </button>
          </div>

          <span style="font-size: 0.84rem; color: var(--text-muted);">
            ទីតាំងរក្សាទុកលើសិស្ស: <code>C:\\Classroom\\Lessons\\</code>
          </span>
        </div>

        <!-- 2 Columns: Sent Transfers & Collected Assignments -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px;">
          <!-- Left: Sent Files -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px;">
            <h4 style="margin: 0 0 16px 0; font-size: 1rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-share-nodes text-blue-400"></i> ប្រវត្តិផ្ញើឯកសារទៅសិស្ស (File Transfers)
            </h4>
            <div id="labSentFilesList" style="display: flex; flex-direction: column; gap: 10px;">
              <p style="color: var(--text-muted); font-size: 0.85rem;">កំពុងផ្ទុក...</p>
            </div>
          </div>

          <!-- Right: Collected Assignments -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px;">
            <h4 style="margin: 0 0 16px 0; font-size: 1rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-inbox text-emerald-400"></i> កិច្ចការដែលបានប្រមូលពីសិស្ស (Collected Assignments)
            </h4>
            <div id="labCollectedFilesList" style="display: flex; flex-direction: column; gap: 10px;">
              <p style="color: var(--text-muted); font-size: 0.85rem;">កំពុងផ្ទុក...</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async loadFilesData() {
    try {
      const [transfers, assignments] = await Promise.all([
        LabManagerService.getFileTransfers(),
        LabManagerService.getCollectedAssignments()
      ]);

      const sentMount = document.getElementById("labSentFilesList");
      if (sentMount) {
        if (!transfers || transfers.length === 0) {
          sentMount.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 20px; text-align: center;">មិនទាន់មានប្រវត្តិផ្ញើឯកសារនៅឡើយ</p>`;
        } else {
          sentMount.innerHTML = transfers.slice().reverse().map(t => `
            <div style="background: var(--bg-surface-hover); border-radius: 10px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-file-pdf text-amber-400" style="font-size: 1.4rem;"></i>
                <div>
                  <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main);">${t.fileName}</div>
                  <div style="font-size: 0.74rem; color: var(--text-muted);">${(t.fileSize / 1024).toFixed(1)} KB • ${new Date(t.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
              <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">ផ្ញើរួច</span>
            </div>
          `).join("");
        }
      }

      const colMount = document.getElementById("labCollectedFilesList");
      if (colMount) {
        if (!assignments || assignments.length === 0) {
          colMount.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 20px; text-align: center;">មិនទាន់មានសិស្សផ្ញើកិច្ចការចូលមកទេ</p>`;
        } else {
          colMount.innerHTML = assignments.slice().reverse().map(a => `
            <div style="background: var(--bg-surface-hover); border-radius: 10px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-file-word text-blue-400" style="font-size: 1.4rem;"></i>
                <div>
                  <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main);">${a.studentName} (${a.studentId})</div>
                  <div style="font-size: 0.74rem; color: var(--text-muted);">${a.fileName} • ${a.assignmentTitle}</div>
                </div>
              </div>
              <a href="${a.downloadUrl}" target="_blank" class="btn-xs btn-outline" download>
                <i class="fa-solid fa-download"></i> Download
              </a>
            </div>
          `).join("");
        }
      }
    } catch (e) {
      console.error("loadFilesData error:", e);
    }
  },

  // =========================================================================
  // SUBTAB 6: MESSAGES BROADCASTER
  // =========================================================================
  renderMessagesSection() {
    return `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <h3 style="margin: 0 0 8px 0; font-size: 1.25rem; font-weight: 800; color: var(--text-main);">
          <i class="fa-solid fa-comment-dots text-pink-400"></i> ផ្ញើសារបន្ទាន់ទៅកុំព្យូទ័រសិស្ស (Teacher Messages)
        </h3>
        <p style="color: var(--text-muted); font-size: 0.86rem; margin: 0 0 24px 0;">
          សារនឹងលោតឡើងចំកណ្តាលអេក្រង់សិស្សភ្លាមៗ ជាមួយប៊ូតុងចុចទទួលដឹងឮ [OK]
        </p>

        <form onsubmit="event.preventDefault(); ComputerLabView.submitQuickMessage();">
          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label">គោលដៅទទួលសារ (Target Computers):</label>
            <select id="msgTargetSelect" class="form-control">
              <option value="ALL">🌐 សិស្សទាំងអស់ក្នុងបន្ទប់ (All Students)</option>
              ${((LabManagerService && LabManagerService.computers) || []).map(pc => `
                <option value="${pc.agentId}">${pc.seatNumber || 'PC'} - ${pc.displayName} (${pc.assignedStudentName || 'Unknown'})</option>
              `).join("")}
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label">ចំណងជើងសារ (Message Title):</label>
            <input type="text" id="msgTitleInput" class="form-control" value="សារពីលោកគ្រូ ខៀន ធូ (Teacher Announcement)" required>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label class="form-label">ខ្លឹមសារសារ (Message Body):</label>
            <textarea id="msgBodyInput" class="form-control" rows="4" placeholder="សូមសិស្សទាំងអស់បើកកម្មវិធី Microsoft Word..." required></textarea>
          </div>

          <!-- Quick Templates -->
          <div style="margin-bottom: 24px;">
            <label class="form-label" style="font-size: 0.8rem; color: var(--text-muted);">គំរូសាររហ័ស (Quick Presets):</label>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button type="button" class="btn-xs btn-outline" onclick="ComputerLabView.setQuickMessageText('សូមសិស្សទាំងអស់បើកកម្មវិធី Microsoft Word!')">
                📝 បើក MS Word
              </button>
              <button type="button" class="btn-xs btn-outline" onclick="ComputerLabView.setQuickMessageText('សូមផ្អាកការអនុវត្ត ហើយមើលមកកាន់ក្តារខៀន!')">
                👀 មើលមកក្តារខៀន
              </button>
              <button type="button" class="btn-xs btn-outline" onclick="ComputerLabView.setQuickMessageText('ដល់ពេលចាប់ផ្តើមប្រឡងអនុវត្ត! ហាមនិយាយគ្នា។')">
                ⏳ ចាប់ផ្តើមប្រឡង
              </button>
              <button type="button" class="btn-xs btn-outline" onclick="ComputerLabView.setQuickMessageText('សូមរក្សាទុកឯកសារ និងបិទកម្មវិធីទាំងអស់!')">
                💾 Save & Close
              </button>
            </div>
          </div>

          <button type="submit" class="lab-btn lab-btn-primary" style="width: 100%; justify-content: center; padding: 12px;">
            <i class="fa-solid fa-paper-plane"></i> <span>ផ្ញើសារភ្លាមៗ (Send Message Now)</span>
          </button>
        </form>
      </div>
    `;
  },

  setQuickMessageText(text) {
    const el = document.getElementById("msgBodyInput");
    if (el) el.value = text;
  },

  async submitQuickMessage() {
    const target = document.getElementById("msgTargetSelect").value;
    const title = document.getElementById("msgTitleInput").value;
    const body = document.getElementById("msgBodyInput").value;

    const targets = target === "ALL" ? "ALL" : [target];
    await LabManagerService.sendMessage(targets, body, title);

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("Message sent to student computers!", "success");
    }
  },

  // =========================================================================
  // SUBTAB 7: CLASSROOM SESSIONS & ATTENDANCE INTEGRATION
  // =========================================================================
  renderSessionsSection() {
    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Active Session Card -->
        <div id="activeSessionMount">
          <p style="color: var(--text-muted);">កំពុងផ្ទុកព័ត៌មានវេនសិក្សា...</p>
        </div>

        <!-- Past Sessions Table -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px;">
          <h4 style="margin: 0 0 16px 0; font-size: 1.1rem; font-weight: 800; color: var(--text-main);">
            <i class="fa-solid fa-clock-rotate-left text-teal-400"></i> ប្រវត្តិវេនបង្រៀនកន្លងមក (Past Class Sessions)
          </h4>
          <div id="pastSessionsTableMount">
            <p style="color: var(--text-muted); font-size: 0.85rem;">កំពុងផ្ទុក...</p>
          </div>
        </div>
      </div>
    `;
  },

  async loadSessionsData() {
    try {
      const active = await LabManagerService.getActiveSession(this.classroomFilter || "lab_a");
      const mount = document.getElementById("activeSessionMount");

      if (mount) {
        if (active) {
          mount.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.12)); border: 1px solid #10b981; border-radius: 20px; padding: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
              <div>
                <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.76rem; margin-bottom: 8px;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span> វេនកំពុងបង្រៀនផ្ទាល់ (Active Session)
                </div>
                <h3 style="margin: 0 0 4px 0; font-size: 1.4rem; font-weight: 800; color: var(--text-main);">${active.subject}</h3>
                <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted);">
                  គ្រូបង្រៀន: <strong>${active.teacherName}</strong> • បន្ទប់: <strong>${active.classroomId}</strong> • វេន: <strong>${active.shift}</strong> • ចាប់ផ្តើម: <strong>${new Date(active.startTime).toLocaleTimeString()}</strong>
                </p>
                <div style="margin-top: 12px; font-size: 0.82rem; color: #10b981; font-weight: 700;">
                  <i class="fa-solid fa-circle-check"></i> វត្តមានសិស្សតភ្ជាប់ត្រូវបានកត់ត្រាស្វ័យប្រវត្តិក្នុ TIS Attendance
                </div>
              </div>

              <button type="button" class="lab-btn lab-btn-danger" onclick="ComputerLabView.endClassSession('${active.sessionId}')">
                <i class="fa-solid fa-stop"></i> <span>បញ្ចប់វេនសិក្សា (End Session)</span>
              </button>
            </div>
          `;
        } else {
          mount.innerHTML = `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 20px; padding: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
              <div>
                <h3 style="margin: 0 0 6px 0; font-size: 1.25rem; font-weight: 800; color: var(--text-main);">
                  មិនទាន់មានវេនសិក្សាកំពុងដំណើរការទេ
                </h3>
                <p style="margin: 0; font-size: 0.86rem; color: var(--text-muted);">
                  ចុចចាប់ផ្តើមវេនសិក្សា ដើម្បីបើកឧបករណ៍បង្រៀន និងកត់ត្រាវត្តមានសិស្សតាមកុំព្យូទ័រ
                </p>
              </div>

              <button type="button" class="lab-btn lab-btn-success" onclick="ComputerLabView.openStartSessionModal()">
                <i class="fa-solid fa-play"></i> <span>ចាប់ផ្តើមវេនថ្មី (Start Class Session)</span>
              </button>
            </div>
          `;
        }
      }

      // Past sessions
      const res = await fetch(`${LabManagerService.getBaseUrl()}/api/lab/sessions/list`);
      const data = await res.json();
      const tableMount = document.getElementById("pastSessionsTableMount");
      if (tableMount && data.success) {
        const sessions = data.sessions || [];
        if (sessions.length === 0) {
          tableMount.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">មិនទាន់មានប្រវត្តិវេនបង្រៀននៅឡើយ</p>`;
        } else {
          tableMount.innerHTML = `
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>កាលបរិច្ឆេទ & ម៉ោង</th>
                    <th>មុខវិជ្ជា</th>
                    <th>បន្ទប់</th>
                    <th>វេន</th>
                    <th>គ្រូបង្រៀន</th>
                    <th>រយៈពេល</th>
                  </tr>
                </thead>
                <tbody>
                  ${sessions.slice().reverse().map(s => {
                    const start = new Date(s.startTime);
                    const end = s.endTime ? new Date(s.endTime) : null;
                    const diffMins = end ? Math.round((end - start) / 60000) : 'កំពុងរៀន';
                    return `
                      <tr>
                        <td>${start.toLocaleDateString()} ${start.toLocaleTimeString()}</td>
                        <td><strong>${s.subject}</strong></td>
                        <td>${s.classroomId}</td>
                        <td>${s.shift}</td>
                        <td>${s.teacherName}</td>
                        <td>${diffMins} នាទី</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          `;
        }
      }
    } catch (e) {
      console.error("loadSessionsData error:", e);
    }
  },

  async endClassSession(sessionId) {
    if (!confirm("តើលោកគ្រូពិតជាចង់បញ្ចប់វេនសិក្សានេះមែនទេ?")) return;
    await LabManagerService.endClassSession(sessionId);
    this.loadSessionsData();
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("Class session ended successfully.", "info");
    }
  },

  // =========================================================================
  // SUBTAB 8: AUTOMATIC ZERO-IP ENROLLMENT & QR CODE (REAL LAN IP & OFFLINE)
  // =========================================================================
  enrollmentData: null,
  selectedEnrollHost: null,
  enrollCountdownInterval: null,

  renderEnrollmentSection() {
    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Real LAN Network Selector & Status Banner -->
        <div style="background: rgba(18, 12, 32, 0.85); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 18px; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <div class="lab-host-selector-badge" id="enrollLanStatusBadge">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
              <span id="enrollLanStatusText">🌐 Classroom Real LAN IP Active</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <label for="enrollHostSelect" style="font-size: 0.82rem; font-weight: 700; color: #94a3b8; white-space: nowrap;">
                <i class="fa-solid fa-network-wired text-cyan-400"></i> Server Host / IP Address:
              </label>
              <select id="enrollHostSelect" class="form-control" onchange="ComputerLabView.onEnrollHostChanged(this.value)" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; color: #ffffff; padding: 6px 14px; font-weight: 700; font-family: var(--font-mono); font-size: 0.88rem; width: auto; max-width: 320px;">
                <option value="">កំពុងស្វែងរក IP បណ្តាញ LAN...</option>
              </select>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="lab-btn lab-btn-cyan" onclick="ComputerLabView.openProjectorMode()" style="padding: 8px 18px; font-size: 0.85rem;">
              <i class="fa-solid fa-expand"></i> <span>Projector Mode (ផ្ទាំងធំ)</span>
            </button>
            <button type="button" class="lab-btn lab-btn-dark" onclick="ComputerLabView.loadEnrollmentData(true)" style="padding: 8px 16px; font-size: 0.85rem;">
              <i class="fa-solid fa-rotate"></i> <span>Regenerate</span>
            </button>
          </div>
        </div>

        <!-- Main Enrollment Cockpit Card -->
        <div class="enrollment-hero-card" style="position: relative;">
          <!-- Left: Crisp Offline SVG QR Code Box -->
          <div class="qr-display-box" id="qrContainer" style="min-width: 260px;">
            <div id="qrCodeTarget" style="width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; background: #ffffff; border-radius: 16px; padding: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden;">
              <div style="text-align: center; color: #0284c7;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.2rem; margin-bottom: 8px;"></i>
                <div style="font-size: 0.78rem; font-weight: 700;">កំពុងបង្កើត QR Code...</div>
              </div>
            </div>

            <!-- Big Token PIN -->
            <div class="token-pill" id="qrTokenDisplay" title="ចុចដើម្បីចម្លង Token" onclick="ComputerLabView.copyEnrollmentToken()" style="cursor: pointer;">
              ------
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                One-Time Registration PIN
              </div>
              <div id="qrExpiryCountdown" style="font-size: 0.76rem; font-weight: 700; color: #f59e0b; display: flex; align-items: center; gap: 5px;">
                <i class="fa-regular fa-clock"></i> ផុតកំណត់ក្នុង: 30:00
              </div>
            </div>

            <!-- Projector Mode Shortcut Button -->
            <button type="button" class="btn-sm btn-outline" onclick="ComputerLabView.openProjectorMode()" style="width: 100%; border-radius: 10px; font-weight: 700; font-size: 0.82rem; margin-top: 4px; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <i class="fa-solid fa-chalkboard-user text-cyan-500"></i> បើកលើ Projector បង្រៀន
            </button>
          </div>

          <!-- Right: Real LAN URL Details, One-Click Actions, and Commands -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 16px; min-width: 300px;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
              <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(6, 182, 212, 0.15); color: #06b6d4; padding: 5px 14px; border-radius: 20px; font-weight: 800; font-size: 0.76rem; border: 1px solid rgba(6, 182, 212, 0.3);">
                <i class="fa-solid fa-bolt"></i> REAL LAN AUTO-ENROLLMENT
              </div>
              <span id="enrollClassroomBadge" style="font-size: 0.8rem; font-weight: 700; color: #a78bfa; background: rgba(167, 139, 250, 0.12); padding: 4px 12px; border-radius: 12px; border: 1px solid rgba(167, 139, 250, 0.25);">
                🖥 បន្ទប់កុំព្យូទ័រ A (Lab A)
              </span>
            </div>

            <h3 style="margin: 0; font-size: 1.45rem; font-weight: 800; color: #ffffff;">
              ចុះឈ្មោះកុំព្យូទ័រសិស្សស្វ័យប្រវត្តិតាម Real LAN QR & Link
            </h3>

            <p style="margin: 0; color: #94a3b8; font-size: 0.88rem; line-height: 1.6;">
              ប្រព័ន្ធប្រើប្រាស់អាសយដ្ឋាន <strong style="color: #38bdf8;">Real LAN IP</strong> នៃម៉ាស៊ីនមេក្នុងបន្ទប់កុំព្យូទ័រ។ សិស្សមិនបាច់វាយបញ្ចូល IP ឡើយ!
              គ្រាន់តែស្កេន QR Code លើកញ្ចក់ Projector ឬបើក Link លើ Browser សិស្ស ហើយចុច <strong>[Download Student Agent]</strong> ឬ Run PowerShell script នោះម៉ាស៊ីននឹងតភ្ជាប់ចូលមកកាន់ផ្ទាំងគ្រប់គ្រងគ្រូភ្លាមៗ!
            </p>

            <!-- 1. Real LAN Enrollment URL Box -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.78rem; font-weight: 700; color: #94a3b8; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-link text-cyan-400"></i> Classroom Web Enrollment URL (Real IP):
              </label>
              <div style="display: flex; align-items: center; gap: 8px; background: rgba(8, 5, 18, 0.7); padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(139, 92, 246, 0.3); flex-wrap: wrap;">
                <code id="enrollUrlCode" style="font-family: var(--font-mono); font-size: 0.92rem; color: #38bdf8; flex: 1; word-break: break-all; min-width: 220px; font-weight: 600;">កំពុងរៀបចំ Real LAN URL...</code>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <button type="button" class="btn-sm btn-outline" onclick="ComputerLabView.copyEnrollmentLink()" title="ចម្លងតំណភ្ជាប់">
                    <i class="fa-solid fa-copy"></i> ចម្លង Link
                  </button>
                  <button type="button" class="btn-sm btn-outline" onclick="ComputerLabView.openEnrollmentLink()" title="បើកសាកល្បងលើផ្ទាំង Browser ថ្មី">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> តេស្តបើក ↗
                  </button>
                </div>
              </div>
            </div>

            <!-- 2. Fast PowerShell One-Liner Box -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-size: 0.78rem; font-weight: 700; color: #94a3b8; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-terminal text-emerald-400"></i> ដំណើរការរហ័សតាម PowerShell One-Liner (Run on Student PC):
              </label>
              <div style="display: flex; align-items: center; gap: 8px; background: #020617; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3); flex-wrap: wrap;">
                <code id="enrollPsCode" style="font-family: var(--font-mono); font-size: 0.84rem; color: #34d399; flex: 1; word-break: break-all; min-width: 220px;">irm http://192.168.1.7:8080/api/lab/enroll/run?t=... | iex</code>
                <button type="button" class="btn-sm btn-outline" onclick="ComputerLabView.copyEnrollmentPsCommand()" style="border-color: rgba(16, 185, 129, 0.4); color: #34d399;">
                  <i class="fa-solid fa-copy"></i> ចម្លង Command
                </button>
              </div>
            </div>

            <!-- 3. Direct Download Buttons -->
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 4px;">
              <a id="btnDownloadAgentBat" href="#" class="lab-btn lab-btn-primary" download>
                <i class="fa-solid fa-download"></i> ទាញយក Setup Batch File (.bat)
              </a>
              <button type="button" class="lab-btn lab-btn-cyan" onclick="ComputerLabView.openProjectorMode()">
                <i class="fa-solid fa-desktop"></i> បើក Projector Mode ពេញអេក្រង់
              </button>
            </div>
          </div>
        </div>

        <!-- 3-Step Classroom Instruction Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
          <div class="lab-step-card">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(56, 189, 248, 0.18); color: #38bdf8; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem;">
                1
              </div>
              <h4 style="margin: 0; font-size: 0.96rem; font-weight: 700; color: #ffffff;">ស្កេន QR ឬបើក Link</h4>
            </div>
            <p style="margin: 0; font-size: 0.82rem; color: #94a3b8; line-height: 1.5;">
              សិស្សភ្ជាប់ Wi-Fi ឬ LAN បន្ទប់កុំព្យូទ័រ រួចបើក Camera/Browser ស្កេន QR Code ឬវាយ Link ខាងលើ។
            </p>
          </div>

          <div class="lab-step-card">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(16, 185, 129, 0.18); color: #10b981; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem;">
                2
              </div>
              <h4 style="margin: 0; font-size: 0.96rem; font-weight: 700; color: #ffffff;">ដំឡើង Student Agent</h4>
            </div>
            <p style="margin: 0; font-size: 0.82rem; color: #94a3b8; line-height: 1.5;">
              ចុចប៊ូតុង <strong>[ទាញយក .bat]</strong> ឬ Run PowerShell One-Liner។ ប្រព័ន្ធនឹង Scan Hardware & Auto Config ភ្លាមៗ។
            </p>
          </div>

          <div class="lab-step-card">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(168, 85, 247, 0.18); color: #c084fc; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem;">
                3
              </div>
              <h4 style="margin: 0; font-size: 0.96rem; font-weight: 700; color: #ffffff;">ភ្ជាប់ចូលផ្ទាំងគ្រូភ្លាមៗ</h4>
            </div>
            <p style="margin: 0; font-size: 0.82rem; color: #94a3b8; line-height: 1.5;">
              កុំព្យូទ័រនឹងបង្ហាញពណ៌បៃតង <strong>Online</strong> លើអេក្រង់គ្រូ ជាមួយ Thumbnail និងឈ្មោះសិស្ស។
            </p>
          </div>
        </div>
      </div>
    `;
  },

  isLoadingEnrollment: false,

  async loadEnrollmentData(forceRefresh = false) {
    if (this.isLoadingEnrollment) return this.enrollmentData;
    this.isLoadingEnrollment = true;

    try {
      const room = this.classroomFilter === "ALL" ? "lab_a" : this.classroomFilter;
      const data = await LabManagerService.createEnrollmentToken(room, 30, this.selectedEnrollHost);
      this.enrollmentData = data;

      // 1. Populate Host / IP Selector dropdown if needed
      const hostSelect = document.getElementById("enrollHostSelect");
      if (hostSelect && (forceRefresh || hostSelect.options.length <= 1)) {
        hostSelect.innerHTML = "";
        
        // Primary Real LAN IP
        if (data.realLanIp) {
          const optPrimary = document.createElement("option");
          optPrimary.value = data.realLanIp;
          optPrimary.innerText = `🌐 Real LAN: ${data.realLanIp}:${data.port || 8080} (Wi-Fi / Ethernet - Recommended)`;
          if (!this.selectedEnrollHost || this.selectedEnrollHost === data.realLanIp) {
            optPrimary.selected = true;
          }
          hostSelect.appendChild(optPrimary);
        }

        // Other LAN Adapters
        if (Array.isArray(data.allLanIps)) {
          data.allLanIps.forEach(net => {
            const netIp = net.ip || net.address;
            if (netIp && netIp !== data.realLanIp) {
              const opt = document.createElement("option");
              opt.value = netIp;
              opt.innerText = `📡 ${net.name}: ${netIp}:${data.port || 8080}`;
              if (this.selectedEnrollHost === netIp) opt.selected = true;
              hostSelect.appendChild(opt);
            }
          });
        }

        // Localhost option
        const optLocal = document.createElement("option");
        optLocal.value = "localhost";
        optLocal.innerText = `💻 Localhost: localhost:${data.port || 8080} (This PC Only)`;
        if (this.selectedEnrollHost === "localhost" || this.selectedEnrollHost === "127.0.0.1") {
          optLocal.selected = true;
        }
        hostSelect.appendChild(optLocal);
      }

      // 2. Update UI elements with Real LAN Data
      const tokenEl = document.getElementById("qrTokenDisplay");
      const urlEl = document.getElementById("enrollUrlCode");
      const psEl = document.getElementById("enrollPsCode");
      const dlBtn = document.getElementById("btnDownloadAgentBat");
      const qrTarget = document.getElementById("qrCodeTarget");
      const classBadge = document.getElementById("enrollClassroomBadge");
      const lanStatus = document.getElementById("enrollLanStatusText");

      if (tokenEl) tokenEl.innerText = data.token;
      if (urlEl) urlEl.innerText = data.enrollUrl;
      if (classBadge) classBadge.innerText = `🖥 ${data.classroomName || 'Computer Lab'}`;
      if (lanStatus && data.targetHost) {
        lanStatus.innerText = `🌐 Real LAN IP: ${data.targetHost}:${data.port || 8080} (Active)`;
      }

      const hostBase = data.enrollUrl ? data.enrollUrl.replace(new RegExp(`/enroll/${data.token}.*`), "") : `${LabManagerService.getBaseUrl()}`;
      const psCmd = `irm ${hostBase}/api/lab/enroll/run?t=${data.token} | iex`;
      if (psEl) psEl.innerText = psCmd;
      if (dlBtn) dlBtn.href = `${LabManagerService.getBaseUrl()}/api/lab/agent/download?token=${data.token}`;

      // 3. Render Crisp Offline Native SVG QR Code
      if (qrTarget) {
        if (data.qrSvg && data.qrSvg.trim().startsWith("<svg")) {
          // Adjust SVG size to fit perfectly inside container
          let cleanSvg = data.qrSvg
            .replace(/width="[^"]*"/, 'width="100%"')
            .replace(/height="[^"]*"/, 'height="100%"');
          qrTarget.innerHTML = cleanSvg;
        } else if (data.qrDataUrl) {
          qrTarget.innerHTML = `<img src="${data.qrDataUrl}" alt="Enrollment QR" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">`;
        } else if (typeof QRCode !== "undefined") {
          qrTarget.innerHTML = "";
          new QRCode(qrTarget, {
            text: data.enrollUrl,
            width: 220,
            height: 220,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
        } else {
          // Fallback to internal node QR endpoint
          qrTarget.innerHTML = `<img src="${LabManagerService.getBaseUrl()}/api/lab/qr?text=${encodeURIComponent(data.enrollUrl)}" alt="Enrollment QR" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">`;
        }
      }

      // 4. Start Countdown Timer (30 minutes default)
      this.startEnrollmentCountdown(data.expiresAt || (Date.now() + 30 * 60 * 1000));

    } catch (e) {
      console.warn("loadEnrollmentData warning:", e);
      if (forceRefresh && typeof App !== "undefined" && App.showToast) {
        App.showToast("Notice: " + e.message, "warning");
      }
    } finally {
      this.isLoadingEnrollment = false;
    }
    return this.enrollmentData;
  },

  onEnrollHostChanged(newHost) {
    this.selectedEnrollHost = newHost;
    this.loadEnrollmentData(true);
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`Switched enrollment host to ${newHost}`, "info");
    }
  },

  startEnrollmentCountdown(expiresAt) {
    if (this.enrollCountdownInterval) {
      clearInterval(this.enrollCountdownInterval);
    }

    const updateTimer = () => {
      const remainingSec = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      const el = document.getElementById("qrExpiryCountdown");
      const projEl = document.getElementById("projectorExpiryCountdown");

      if (remainingSec <= 0) {
        const expiredTxt = `<i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> <span style="color: #ef4444;">Expired (ផុតកំណត់)</span>`;
        if (el) el.innerHTML = expiredTxt;
        if (projEl) projEl.innerHTML = expiredTxt;
        clearInterval(this.enrollCountdownInterval);
        return;
      }

      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      const txt = `<i class="fa-regular fa-clock"></i> ផុតកំណត់ក្នុង: ${formatted}`;
      if (el) el.innerHTML = txt;
      if (projEl) projEl.innerHTML = txt;
    };

    updateTimer();
    this.enrollCountdownInterval = setInterval(updateTimer, 1000);
  },

  copyEnrollmentLink() {
    const el = document.getElementById("projectorEnrollUrlText") || document.getElementById("enrollUrlCode");
    const url = el ? el.innerText.trim() : (this.enrollmentData && this.enrollmentData.enrollUrl);
    if (url) {
      navigator.clipboard.writeText(url);
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Copied Real LAN enrollment link to clipboard!", "success");
      }
    }
  },

  copyEnrollmentToken() {
    const token = (this.enrollmentData && this.enrollmentData.token) || "------";
    navigator.clipboard.writeText(token);
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`Copied token PIN (${token}) to clipboard!`, "success");
    }
  },

  copyEnrollmentPsCommand() {
    const el = document.getElementById("projectorPsCode") || document.getElementById("enrollPsCode");
    const cmd = el ? el.innerText.trim() : (this._lastPsCmd || "");
    if (cmd) {
      navigator.clipboard.writeText(cmd);
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Copied PowerShell command to clipboard!", "success");
      }
    }
  },

  openEnrollmentLink() {
    const url = (this.enrollmentData && this.enrollmentData.enrollUrl);
    if (url) {
      window.open(url, "_blank");
    }
  },

  toggleNativeFullscreen() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  },

  // =========================================================================
  // FULLSCREEN CLASSROOM PROJECTOR MODE COCKPIT
  // =========================================================================
  async openProjectorMode() {
    if (!this.enrollmentData) {
      await this.loadEnrollmentData();
    }
    const data = this.enrollmentData;
    if (!data) {
      console.warn("Projector Mode: No enrollment data available.");
      return;
    }

    // Remove any existing projector modal
    const existing = document.getElementById("labProjectorModalBackdrop");
    if (existing) existing.remove();

    const computers = (LabManagerService && LabManagerService.computers) || [];
    const onlineCount = computers.filter(c => c.status === "online").length;

    let svgHtml = "";
    if (data.qrSvg && data.qrSvg.trim().startsWith("<svg")) {
      svgHtml = data.qrSvg
        .replace(/width="[^"]*"/, 'width="250"')
        .replace(/height="[^"]*"/, 'height="250"');
    } else if (data.qrDataUrl) {
      svgHtml = `<img src="${data.qrDataUrl}" alt="QR" style="width: 250px; height: 250px; object-fit: contain;">`;
    } else {
      svgHtml = `<img src="${LabManagerService.getBaseUrl()}/api/lab/qr?text=${encodeURIComponent(data.enrollUrl)}" alt="QR" style="width: 250px; height: 250px;">`;
    }

    const hostBase = data.enrollUrl ? data.enrollUrl.replace(new RegExp(`/enroll/${data.token}.*`), "") : `${LabManagerService.getBaseUrl()}`;
    const psCmd = `irm ${hostBase}/api/lab/enroll/run?t=${data.token} | iex`;
    this._lastPsCmd = psCmd;
    const dlBatUrl = `${LabManagerService.getBaseUrl()}/api/lab/agent/download?token=${data.token}`;

    const modalHtml = `
      <div class="lab-projector-backdrop" id="labProjectorModalBackdrop" onclick="if(event.target===this) ComputerLabView.closeProjectorMode()">
        <!-- Top Bar -->
        <header class="lab-projector-header">
          <div class="lab-proj-brand">
            <img src="assets/images/logo.png" alt="Logo" class="lab-proj-logo" onerror="this.style.display='none'">
            <div>
              <div class="lab-proj-title">
                <span>🖥 បន្ទប់កុំព្យូទ័រ Lab — ភ្ជាប់ម៉ាស៊ីនសិស្ស (Auto Enrollment)</span>
                <span class="lab-proj-badge">${data.classroomName || 'Computer Lab A'}</span>
              </div>
              <div class="lab-proj-subtitle">
                Tian Xin International School &bull; Real LAN Server Network
              </div>
            </div>
          </div>

          <div class="lab-projector-controls">
            <!-- LAN IP Selector -->
            <div class="lab-proj-ip-picker">
              <label><i class="fa-solid fa-network-wired text-cyan-400"></i> LAN IP:</label>
              <select id="projectorEnrollHostSelect" class="form-control" onchange="ComputerLabView.onEnrollHostChanged(this.value); ComputerLabView.openProjectorMode();">
                ${this.renderHostOptionsHtml(data)}
              </select>
            </div>

            <!-- Status Pill -->
            <div class="lab-proj-status-pill">
              <span class="pulse-dot"></span>
              <span>LAN: ${data.targetHost}:${data.port || 8080}</span>
            </div>

            <!-- Hardware Fullscreen Toggle -->
            <button type="button" class="lab-btn lab-btn-dark" onclick="ComputerLabView.toggleNativeFullscreen()" title="ពង្រីកពេញអេក្រង់ (Full Screen)">
              <i class="fa-solid fa-expand" id="projFullscreenIcon"></i> <span id="projFullscreenLabel">Full Screen</span>
            </button>

            <!-- Close Button -->
            <button type="button" class="lab-btn lab-btn-danger" onclick="ComputerLabView.closeProjectorMode()" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5;" title="បិទ (Esc)">
              <i class="fa-solid fa-xmark"></i> <span>បិទ / Close (Esc)</span>
            </button>
          </div>
        </header>

        <!-- Center Presentation Grid -->
        <main class="lab-projector-grid">
          <!-- Left Column: Big QR & PIN -->
          <div class="lab-projector-qr-column">
            <div class="lab-qr-header-tag">
              <i class="fa-solid fa-qrcode text-cyan-400"></i>
              <span>វិធីទី ១៖ ស្កេន QR CODE (សម្រាប់សិស្ស)</span>
            </div>

            <div class="lab-projector-qr-card">
              <div class="qr-svg-wrapper">
                ${svgHtml}
              </div>
            </div>

            <div class="lab-projector-pin-card" onclick="ComputerLabView.copyEnrollmentToken()" title="ចុចដើម្បីចម្លង Token PIN">
              <div class="pin-label">PIN TOKEN ចុះឈ្មោះ</div>
              <div class="pin-code">${data.token}</div>
              <div class="pin-copy-hint"><i class="fa-solid fa-copy"></i> ចុចចម្លងលេខកូដ Token</div>
            </div>

            <div id="projectorExpiryCountdown" class="lab-proj-timer">
              <i class="fa-regular fa-clock"></i> ផុតកំណត់ក្នុង: 30:00
            </div>
          </div>

          <!-- Right Column: Methods & Live Counters -->
          <div class="lab-projector-info-column">
            <!-- Option A: Direct Web Link -->
            <div class="lab-proj-card">
              <div class="lab-proj-card-title">
                <div class="card-num">2</div>
                <div>
                  <h4>បើកតាម Browser សិស្ស (Chrome / Edge / Safari)</h4>
                  <p>វាយអាសយដ្ឋាន Link នេះលើ Browser ម៉ាស៊ីនសិស្សដើម្បីភ្ជាប់ភ្លាមៗ</p>
                </div>
              </div>
              <div class="lab-proj-url-bar">
                <i class="fa-solid fa-globe text-cyan-400" style="font-size: 1.2rem;"></i>
                <span class="url-text" id="projectorEnrollUrlText">${data.enrollUrl}</span>
                <button type="button" class="btn-sm btn-outline" onclick="ComputerLabView.copyEnrollmentLink()">
                  <i class="fa-solid fa-copy"></i> ចម្លង Link
                </button>
                <button type="button" class="btn-sm btn-outline" onclick="ComputerLabView.openEnrollmentLink()">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> តេស្តបើក ↗
                </button>
              </div>
            </div>

            <!-- Option B: Direct Batch / Script Setup -->
            <div class="lab-proj-card">
              <div class="lab-proj-card-title">
                <div class="card-num">3</div>
                <div>
                  <h4>ទាញយក Setup Agent ឬ Run Script (1-Click Install)</h4>
                  <p>ទាញយក Setup Batch file ឬចម្លង PowerShell One-Liner ទៅ Run លើ PC សិស្ស</p>
                </div>
              </div>
              <div class="lab-proj-actions-row">
                <a href="${dlBatUrl}" download class="lab-btn lab-btn-success" style="text-decoration: none; padding: 10px 18px; font-weight: 700;">
                  <i class="fa-solid fa-download"></i> <span>ទាញយក Setup Agent (.bat)</span>
                </a>
                <button type="button" class="lab-btn lab-btn-dark" onclick="ComputerLabView.copyEnrollmentPsCommand()" style="padding: 10px 16px;">
                  <i class="fa-solid fa-terminal text-emerald-400"></i> <span>ចម្លង PowerShell Command</span>
                </button>
                <button type="button" class="lab-btn lab-btn-cyan" onclick="ComputerLabView.regenerateProjectorToken()" style="padding: 10px 16px;">
                  <i class="fa-solid fa-arrows-rotate"></i> <span>ប្ដូរ Token ថ្មី</span>
                </button>
              </div>
              <code id="projectorPsCode" style="display: none;">${psCmd}</code>
            </div>

            <!-- Realtime Connected Summary Card -->
            <div class="lab-proj-card lab-proj-status-card">
              <div class="status-card-inner">
                <div class="status-counter-wrap">
                  <div class="status-counter-number">
                    <span class="pulse-dot"></span>
                    <span id="projectorConnectedCount">${onlineCount}</span>
                  </div>
                  <div class="status-counter-label">កុំព្យូទ័របានភ្ជាប់ (Connected)</div>
                </div>
                <div class="status-counter-info">
                  <div class="status-badge"><i class="fa-solid fa-circle-check"></i> Auto-Detect Realtime</div>
                  <p>នៅពេលសិស្សភ្ជាប់ជោគជ័យ ម៉ាស៊ីននឹងលេចឡើងពណ៌បៃតងលើផ្ទាំងគ្រប់គ្រងដោយស្វ័យប្រវត្តិ។</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Bottom Footer -->
        <footer class="lab-projector-footer">
          <div class="footer-hint">
            <i class="fa-solid fa-keyboard text-cyan-400"></i>
            <span>ចុច <strong>[Esc]</strong> ដើម្បីត្រឡប់ទៅបន្ទប់កុំព្យូទ័រ | ចុច <strong>[Full Screen]</strong> ដើម្បីបង្ហាញពេញអេក្រង់ Projector</span>
          </div>
          <div>
            <span>Tian Xin International School &copy; 2026 &bull; Computer Lab System</span>
          </div>
        </footer>
      </div>
    `;

    // Append to body
    const div = document.createElement("div");
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);

    // Escape key listener to close
    this._projectorKeydownHandler = (e) => {
      if (e.key === "Escape") {
        ComputerLabView.closeProjectorMode();
      }
    };
    window.addEventListener("keydown", this._projectorKeydownHandler);

    // Fullscreen change handler to update UI state
    this._fullscreenChangeHandler = () => {
      const lbl = document.getElementById("projFullscreenLabel");
      const icon = document.getElementById("projFullscreenIcon");
      if (document.fullscreenElement) {
        if (lbl) lbl.innerText = "Exit Full";
        if (icon) icon.className = "fa-solid fa-compress";
      } else {
        if (lbl) lbl.innerText = "Full Screen";
        if (icon) icon.className = "fa-solid fa-expand";
      }
    };
    document.addEventListener("fullscreenchange", this._fullscreenChangeHandler);

    // Start countdown
    this.startEnrollmentCountdown(data.expiresAt || (Date.now() + 30 * 60 * 1000));
  },

  async regenerateProjectorToken() {
    await this.loadEnrollmentData(true);
    this.openProjectorMode();
  },

  closeProjectorMode() {
    const modal = document.getElementById("labProjectorModalBackdrop");
    if (modal) modal.remove();
    if (this._projectorKeydownHandler) {
      window.removeEventListener("keydown", this._projectorKeydownHandler);
      this._projectorKeydownHandler = null;
    }
    if (this._fullscreenChangeHandler) {
      document.removeEventListener("fullscreenchange", this._fullscreenChangeHandler);
      this._fullscreenChangeHandler = null;
    }
  },

  // =========================================================================
  // SUBTAB 9: AUDIT LOGS
  // =========================================================================
  renderLogsSection() {
    return `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <h4 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-main);">
            <i class="fa-solid fa-clipboard-list text-slate-400"></i> កំណត់ហេតុសកម្មភាពគ្រូបង្រៀន (Audit Logs)
          </h4>
          <button type="button" class="btn-sm btn-outline" onclick="ComputerLabView.loadAuditLogsData()">
            <i class="fa-solid fa-rotate"></i> Refresh Logs
          </button>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>ម៉ោង / កាលបរិច្ឆេទ</th>
                <th>គ្រូបង្រៀន</th>
                <th>សកម្មភាព (Action)</th>
                <th>គោលដៅ (Target)</th>
                <th>ព័ត៌មានលម្អិត</th>
              </tr>
            </thead>
            <tbody id="labAuditLogsTbody">
              <tr><td colspan="5" style="text-align: center; color: var(--text-muted);">កំពុងផ្ទុក...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async loadAuditLogsData() {
    try {
      const logs = await LabManagerService.getAuditLogs();
      const tbody = document.getElementById("labAuditLogsTbody");
      if (tbody) {
        if (!logs || logs.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">មិនទាន់មានកំណត់ហេតុនៅឡើយ</td></tr>`;
        } else {
          tbody.innerHTML = logs.slice().reverse().map(l => `
            <tr>
              <td>${new Date(l.timestamp).toLocaleString()}</td>
              <td><strong>${l.teacherName || 'Teacher'}</strong></td>
              <td><span class="badge" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">${l.action}</span></td>
              <td><code>${l.targetId || 'ALL'}</code></td>
              <td>${l.details || ''}</td>
            </tr>
          `).join("");
        }
      }
    } catch (e) {
      console.error("loadAuditLogsData error:", e);
    }
  },

  // =========================================================================
  // SUBTAB 10: SETTINGS
  // =========================================================================
  renderSettingsSection() {
    return `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px; max-width: 800px; margin: 0 auto;">
        <h3 style="margin: 0 0 20px 0; font-size: 1.25rem; font-weight: 800; color: var(--text-main);">
          <i class="fa-solid fa-sliders text-cyan-400"></i> ការកំណត់បន្ទប់កុំព្យូទ័រ (Computer Lab Settings)
        </h3>

        <form onsubmit="event.preventDefault(); ComputerLabView.saveSettings();">
          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label">Screen Stream Default FPS:</label>
            <select id="cfgDefaultFps" class="form-control">
              <option value="5">5 FPS</option>
              <option value="10" selected>10 FPS (Recommended)</option>
              <option value="15">15 FPS</option>
              <option value="20">20 FPS</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label">Screen Stream Default Quality:</label>
            <select id="cfgDefaultQuality" class="form-control">
              <option value="low">Low (Fast LAN)</option>
              <option value="medium" selected>Medium (Standard)</option>
              <option value="high">High (HQ)</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label">One-Time Token Expiration (Minutes):</label>
            <input type="number" id="cfgTokenTtl" class="form-control" value="10" min="1" max="120">
          </div>

          <div class="form-group" style="margin-bottom: 24px;">
            <label class="form-label">Allowed Applications on Student PCs (Allowlist, separated by commas):</label>
            <input type="text" id="cfgAllowlist" class="form-control" value="WINWORD.EXE, EXCEL.EXE, POWERPNT.EXE, chrome.exe, msedge.exe, notepad.exe, calc.exe">
          </div>

          <button type="submit" class="lab-btn lab-btn-primary" style="width: 100%; justify-content: center; padding: 12px;">
            <i class="fa-solid fa-floppy-disk"></i> រក្សាទុកការកំណត់ (Save Settings)
          </button>
        </form>
      </div>
    `;
  },

  async loadSettingsData() {
    try {
      const s = await LabManagerService.getSettings();
      if (s) {
        const fps = document.getElementById("cfgDefaultFps");
        const q = document.getElementById("cfgDefaultQuality");
        const ttl = document.getElementById("cfgTokenTtl");
        const list = document.getElementById("cfgAllowlist");

        if (fps && s.defaultFps) fps.value = s.defaultFps;
        if (q && s.defaultQuality) q.value = s.defaultQuality;
        if (ttl && s.tokenTtlMinutes) ttl.value = s.tokenTtlMinutes;
        if (list && s.allowedApplications) list.value = s.allowedApplications.join(", ");
      }
    } catch (e) {
      console.error("loadSettingsData error:", e);
    }
  },

  async saveSettings() {
    try {
      const fps = parseInt(document.getElementById("cfgDefaultFps").value, 10) || 10;
      const quality = document.getElementById("cfgDefaultQuality").value || "medium";
      const tokenTtl = parseInt(document.getElementById("cfgTokenTtl").value, 10) || 10;
      const rawAllow = document.getElementById("cfgAllowlist").value || "";
      const allowed = rawAllow.split(",").map(x => x.trim()).filter(Boolean);

      await LabManagerService.updateSettings({
        defaultFps: fps,
        defaultQuality: quality,
        tokenTtlMinutes: tokenTtl,
        allowedApplications: allowed
      });

      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Lab settings saved successfully!", "success");
      }
    } catch (e) {
      console.error("saveSettings error:", e);
    }
  },

  // =========================================================================
  // CONTROL ACTIONS (LOCK, UNLOCK, RESTART, SHUTDOWN, ASSIGN, REMOTE CONTROL)
  // =========================================================================
  async lockAllComputers() {
    if (!confirm("តើលោកគ្រូពិតជាចង់ចាក់សោកុំព្យូទ័រសិស្សទាំងអស់មែនទេ?")) return;
    await LabManagerService.lockScreen("ALL", "CLASSROOM LOCKED - សូមយកចិត្តទុកដាក់ស្តាប់លោកគ្រូពន្យល់");
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("Locked all student computers.", "warning");
    }
    this.refreshData();
  },

  async unlockAllComputers() {
    await LabManagerService.unlockScreen("ALL");
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("Unlocked all student computers.", "success");
    }
    this.refreshData();
  },

  async toggleLockPc(agentId, lock) {
    if (lock) {
      await LabManagerService.lockScreen([agentId]);
      if (typeof App !== "undefined" && App.showToast) App.showToast("Computer locked.", "warning");
    } else {
      await LabManagerService.unlockScreen([agentId]);
      if (typeof App !== "undefined" && App.showToast) App.showToast("Computer unlocked.", "success");
    }
    this.refreshData();
  },

  async confirmRestartOrShutdown(action, target) {
    const text = action === "RESTART" ? "Restart" : "Shutdown";
    if (!confirm(`តើលោកគ្រូពិតជាចង់ ${text} កុំព្យូទ័រ ${target === 'ALL' ? 'ទាំងអស់' : target} មែនទេ?`)) return;

    if (action === "RESTART") {
      await LabManagerService.restartComputers(target);
    } else {
      await LabManagerService.shutdownComputers(target);
    }

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`Command ${text} sent.`, "info");
    }
  },

  async deleteComputer(agentId) {
    if (!confirm("តើលោកគ្រូពិតជាចង់លុបកុំព្យូទ័រនេះចេញពីបញ្ជីមែនទេ?")) return;
    await LabManagerService.deleteComputer(agentId);
    this.refreshData();
  },

  // =========================================================================
  // INTERACTIVE REMOTE CONTROL & FULLSCREEN MONITOR MODAL
  // =========================================================================
  openFullscreenMonitor(agentId) {
    this.activeFullscreenAgentId = agentId;
    this.isRemoteControlActive = false;
    LabManagerService.requestScreenStream(agentId, 15, "high");

    const pc = (LabManagerService.computers || []).find(c => c.agentId === agentId) || {};
    const frame = (LabManagerService.screenFrames && LabManagerService.screenFrames[agentId]) || '';

    const modalHtml = `
      <div class="lab-remote-modal" id="labRemoteModal">
        <div class="lab-remote-bar">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span class="lab-pc-seat">${pc.seatNumber || 'A01'}</span>
            <span style="font-weight: 800; font-size: 1.05rem;">${pc.displayName || pc.hostname} (${pc.assignedStudentName || 'Unknown'})</span>
            <span id="remoteStatusIndicator" class="badge" style="background: rgba(59, 130, 246, 0.2); color: #38bdf8;">
              <i class="fa-solid fa-eye"></i> Viewing Stream
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button type="button" id="btnToggleRemote" class="lab-btn lab-btn-cyan" onclick="ComputerLabView.toggleRemoteControlSession('${agentId}')">
              <i class="fa-solid fa-gamepad"></i> <span>ចាប់ផ្តើមបញ្ជា (Remote Control)</span>
            </button>
            <button type="button" class="btn-icon" style="background: rgba(255,255,255,0.1); color: #fff;" onclick="ComputerLabView.closeFullscreenMonitor()" title="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div class="lab-remote-viewport" id="labRemoteViewport">
          <div class="lab-remote-canvas-wrap">
            <img id="fullMonitorImage" src="${frame || 'assets/images/logo.png'}" class="lab-remote-canvas" alt="Full Screen">
          </div>
        </div>
      </div>
    `;

    const mount = document.getElementById("labModalsMount");
    if (mount) mount.innerHTML = modalHtml;
  },

  toggleRemoteControlSession(agentId) {
    const btn = document.getElementById("btnToggleRemote");
    const ind = document.getElementById("remoteStatusIndicator");
    const viewport = document.getElementById("labRemoteViewport");

    if (!this.isRemoteControlActive) {
      // Start Remote Control
      this.isRemoteControlActive = true;
      LabManagerService.startRemoteControl(agentId);
      if (btn) btn.innerHTML = `<i class="fa-solid fa-stop"></i> <span>បញ្ឈប់ការបញ្ជា (Stop Remote)</span>`;
      if (btn) btn.className = "lab-btn lab-btn-danger";
      if (ind) {
        ind.style.background = "rgba(239, 68, 68, 0.2)";
        ind.style.color = "#ef4444";
        ind.innerHTML = `<i class="fa-solid fa-gamepad fa-fade"></i> Remote Controlling Active`;
      }
      this.attachRemoteInputListeners(agentId, viewport);
    } else {
      // Stop Remote Control
      this.isRemoteControlActive = false;
      LabManagerService.stopRemoteControl(agentId);
      if (btn) btn.innerHTML = `<i class="fa-solid fa-gamepad"></i> <span>ចាប់ផ្តើមបញ្ជា (Remote Control)</span>`;
      if (btn) btn.className = "lab-btn lab-btn-cyan";
      if (ind) {
        ind.style.background = "rgba(59, 130, 246, 0.2)";
        ind.style.color = "#38bdf8";
        ind.innerHTML = `<i class="fa-solid fa-eye"></i> Viewing Stream`;
      }
      this.detachRemoteInputListeners();
    }
  },

  startRemoteControl(agentId) {
    this.openFullscreenMonitor(agentId);
    setTimeout(() => {
      this.toggleRemoteControlSession(agentId);
    }, 200);
  },

  attachRemoteInputListeners(agentId, viewport) {
    if (!viewport) return;
    const img = document.getElementById("fullMonitorImage");
    if (!img) return;

    this._onMouseMove = (e) => {
      if (!this.isRemoteControlActive) return;
      const rect = img.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      if (normX >= 0 && normX <= 1 && normY >= 0 && normY <= 1) {
        LabManagerService.sendRemoteInput(agentId, {
          action: "mouse_move",
          norm_x: normX,
          norm_y: normY
        });
      }
    };

    this._onMouseDown = (e) => {
      if (!this.isRemoteControlActive) return;
      e.preventDefault();
      const rect = img.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      const btn = e.button === 2 ? "right" : (e.button === 1 ? "middle" : "left");
      LabManagerService.sendRemoteInput(agentId, {
        action: "mouse_down",
        button: btn,
        norm_x: normX,
        norm_y: normY
      });
    };

    this._onMouseUp = (e) => {
      if (!this.isRemoteControlActive) return;
      e.preventDefault();
      const rect = img.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      const btn = e.button === 2 ? "right" : (e.button === 1 ? "middle" : "left");
      LabManagerService.sendRemoteInput(agentId, {
        action: "mouse_up",
        button: btn,
        norm_x: normX,
        norm_y: normY
      });
    };

    this._onContextMenu = (e) => {
      if (this.isRemoteControlActive) e.preventDefault();
    };

    this._onKeyDown = (e) => {
      if (!this.isRemoteControlActive) return;
      if (e.key === "Escape") {
        this.closeFullscreenMonitor();
        return;
      }
      LabManagerService.sendRemoteInput(agentId, {
        action: "key_down",
        key: e.key,
        code: e.code
      });
    };

    this._onKeyUp = (e) => {
      if (!this.isRemoteControlActive) return;
      LabManagerService.sendRemoteInput(agentId, {
        action: "key_up",
        key: e.key,
        code: e.code
      });
    };

    img.addEventListener("mousemove", this._onMouseMove);
    img.addEventListener("mousedown", this._onMouseDown);
    img.addEventListener("mouseup", this._onMouseUp);
    img.addEventListener("contextmenu", this._onContextMenu);
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
  },

  detachRemoteInputListeners() {
    const img = document.getElementById("fullMonitorImage");
    if (img) {
      if (this._onMouseMove) img.removeEventListener("mousemove", this._onMouseMove);
      if (this._onMouseDown) img.removeEventListener("mousedown", this._onMouseDown);
      if (this._onMouseUp) img.removeEventListener("mouseup", this._onMouseUp);
      if (this._onContextMenu) img.removeEventListener("contextmenu", this._onContextMenu);
    }
    if (this._onKeyDown) window.removeEventListener("keydown", this._onKeyDown);
    if (this._onKeyUp) window.removeEventListener("keyup", this._onKeyUp);
  },

  closeFullscreenMonitor() {
    if (this.isRemoteControlActive && this.activeFullscreenAgentId) {
      LabManagerService.stopRemoteControl(this.activeFullscreenAgentId);
    }
    this.detachRemoteInputListeners();
    this.isRemoteControlActive = false;
    this.activeFullscreenAgentId = null;

    const modal = document.getElementById("labRemoteModal");
    if (modal) modal.remove();
  },

  // =========================================================================
  // MODALS (ASSIGN STUDENT, QR ENROLL, SEND FILE, SEND MESSAGE, OPEN URL, SESSION)
  // =========================================================================
  openAssignStudentModal(agentId) {
    const pc = (LabManagerService.computers || []).find(c => c.agentId === agentId) || {};
    const students = (typeof App !== "undefined" && App.state && App.state.students) || [];

    const modalHtml = `
      <div class="modal-backdrop active" id="assignStudentModalBackdrop">
        <div class="modal-content" style="max-width: 520px;">
          <div class="modal-header">
            <h3><i class="fa-solid fa-user-pen text-cyan-400"></i> កំណត់សិស្សលើកុំព្យូទ័រ (${pc.displayName})</h3>
            <button type="button" class="btn-close" onclick="document.getElementById('assignStudentModalBackdrop').remove()">&times;</button>
          </div>
          <form onsubmit="event.preventDefault(); ComputerLabView.submitAssignStudent('${agentId}');" class="modal-body">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">លេខកៅអី (Seat Number):</label>
              <input type="text" id="assignSeatInput" class="form-control" value="${pc.seatNumber || 'A01'}" placeholder="A01, B02..." required>
            </div>

            <div class="form-group" style="margin-bottom: 20px;">
              <label class="form-label">ជ្រើសរើសសិស្ស (Select Student from TIS):</label>
              <select id="assignStudentSelect" class="form-control">
                <option value="">-- ជ្រើសរើសសិស្ស --</option>
                ${students.map(s => `
                  <option value="${s.ID}" data-name="${s.nameKh || s.nameEn}" ${pc.assignedStudentId === s.ID ? 'selected' : ''}>
                    ${s.ID} - ${s.nameKh || s.nameEn} (${s.className || 'ថ្នាក់កុំព្យូទ័រ'})
                  </option>
                `).join("")}
              </select>
            </div>

            <div class="modal-footer" style="padding: 0;">
              <button type="button" class="btn-secondary" onclick="document.getElementById('assignStudentModalBackdrop').remove()">បោះបង់</button>
              <button type="submit" class="btn-primary">រក្សាទុកការចាត់តាំង</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const mount = document.getElementById("labModalsMount");
    if (mount) mount.innerHTML = modalHtml;
  },

  async submitAssignStudent(agentId) {
    const seat = document.getElementById("assignSeatInput").value;
    const sel = document.getElementById("assignStudentSelect");
    const studentId = sel.value;
    const selectedOpt = sel.options[sel.selectedIndex];
    const studentName = selectedOpt ? selectedOpt.getAttribute("data-name") : "";

    await LabManagerService.assignStudent(agentId, studentId, studentName, seat);
    const bd = document.getElementById("assignStudentModalBackdrop");
    if (bd) bd.remove();
    this.refreshData();

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("Student assigned to computer successfully!", "success");
    }
  },

  openQrEnrollmentModal() {
    this.openProjectorMode();
  },

  renderHostOptionsHtml(data) {
    if (!data) return "";
    let html = "";
    if (data.realLanIp) {
      const isSel = (!this.selectedEnrollHost || this.selectedEnrollHost === data.realLanIp) ? "selected" : "";
      html += `<option value="${data.realLanIp}" ${isSel}>🌐 Real LAN: ${data.realLanIp}:${data.port || 8080} (Recommended)</option>`;
    }
    if (Array.isArray(data.allLanIps)) {
      data.allLanIps.forEach(net => {
        const netIp = net.ip || net.address;
        if (netIp && netIp !== data.realLanIp) {
          const isSel = this.selectedEnrollHost === netIp ? "selected" : "";
          html += `<option value="${netIp}" ${isSel}>📡 ${net.name}: ${netIp}:${data.port || 8080}</option>`;
        }
      });
    }
    const isLocalSel = (this.selectedEnrollHost === "localhost" || this.selectedEnrollHost === "127.0.0.1") ? "selected" : "";
    html += `<option value="localhost" ${isLocalSel}>💻 Localhost: localhost:${data.port || 8080} (This PC Only)</option>`;
    return html;
  },

  openSendMessageModal(target) {
    const targetArr = Array.isArray(target) ? target : [target];
    const isAll = target === "ALL" || targetArr[0] === "ALL";

    const modalHtml = `
      <div class="modal-backdrop active" id="sendMsgModalBackdrop">
        <div class="modal-content" style="max-width: 500px;">
          <div class="modal-header">
            <h3><i class="fa-solid fa-comment-dots text-pink-400"></i> ផ្ញើសារទៅកាន់សិស្ស</h3>
            <button type="button" class="btn-close" onclick="document.getElementById('sendMsgModalBackdrop').remove()">&times;</button>
          </div>
          <form onsubmit="event.preventDefault(); ComputerLabView.submitModalMessage();" class="modal-body">
            <input type="hidden" id="modalMsgTarget" value="${isAll ? 'ALL' : targetArr.join(',')}">
            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label">គោលដៅ: <strong>${isAll ? 'កុំព្យូទ័រទាំងអស់ក្នុងបន្ទប់' : `${targetArr.length} គ្រឿង`}</strong></label>
            </div>
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">ចំណងជើង:</label>
              <input type="text" id="modalMsgTitle" class="form-control" value="សារពីលោកគ្រូ ខៀន ធូ" required>
            </div>
            <div class="form-group" style="margin-bottom: 20px;">
              <label class="form-label">ខ្លឹមសារ:</label>
              <textarea id="modalMsgText" class="form-control" rows="3" placeholder="វាយខ្លឹមសារនៅទីនេះ..." required></textarea>
            </div>
            <div class="modal-footer" style="padding: 0;">
              <button type="button" class="btn-secondary" onclick="document.getElementById('sendMsgModalBackdrop').remove()">បោះបង់</button>
              <button type="submit" class="btn-primary">ផ្ញើសារ</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const mount = document.getElementById("labModalsMount");
    if (mount) mount.innerHTML = modalHtml;
  },

  async submitModalMessage() {
    const rawTarget = document.getElementById("modalMsgTarget").value;
    const title = document.getElementById("modalMsgTitle").value;
    const text = document.getElementById("modalMsgText").value;
    const targets = rawTarget === "ALL" ? "ALL" : rawTarget.split(",");

    await LabManagerService.sendMessage(targets, text, title);
    const bd = document.getElementById("sendMsgModalBackdrop");
    if (bd) bd.remove();
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast("Message sent to student!", "success");
    }
  },

  openSendFileModal(target) {
    const isAll = target === "ALL";
    const modalHtml = `
      <div class="modal-backdrop active" id="sendFileModalBackdrop">
        <div class="modal-content" style="max-width: 520px;">
          <div class="modal-header">
            <h3><i class="fa-solid fa-cloud-arrow-up text-blue-400"></i> ផ្ញើឯកសារមេរៀនទៅសិស្ស</h3>
            <button type="button" class="btn-close" onclick="document.getElementById('sendFileModalBackdrop').remove()">&times;</button>
          </div>
          <form onsubmit="event.preventDefault(); ComputerLabView.submitSendFile();" class="modal-body">
            <input type="hidden" id="modalSendTarget" value="${isAll ? 'ALL' : target}">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">ជ្រើសរើសឯកសារ (PDF, DOCX, ZIP...):</label>
              <input type="file" id="modalFileInput" class="form-control" required>
            </div>
            <div class="modal-footer" style="padding: 0;">
              <button type="button" class="btn-secondary" onclick="document.getElementById('sendFileModalBackdrop').remove()">បោះបង់</button>
              <button type="submit" class="btn-primary">ផ្ញើឯកសារទៅសិស្ស</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const mount = document.getElementById("labModalsMount");
    if (mount) mount.innerHTML = modalHtml;
  },

  async submitSendFile() {
    const fileInput = document.getElementById("modalFileInput");
    const rawTarget = document.getElementById("modalSendTarget").value;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      const targets = rawTarget === "ALL" ? "ALL" : rawTarget.split(",");
      await LabManagerService.sendLessonFile(file.name, base64, targets, ComputerLabView.classroomFilter || "lab_a");

      const bd = document.getElementById("sendFileModalBackdrop");
      if (bd) bd.remove();
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`Sent file ${file.name} to students!`, "success");
      }
    };

    reader.readAsDataURL(file);
  },

  openUrlModal(target) {
    const url = prompt("សូមបញ្ចូល URL វេបសាយដែលចង់បើកលើកុំព្យូទ័រសិស្ស:", "https://google.com");
    if (url && url.trim()) {
      LabManagerService.openUrl(target, url.trim());
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(`Opening ${url} on student PCs...`, "info");
      }
    }
  },

  openStartSessionModal() {
    const modalHtml = `
      <div class="modal-backdrop active" id="startSessionModalBackdrop">
        <div class="modal-content" style="max-width: 520px;">
          <div class="modal-header">
            <h3><i class="fa-solid fa-play text-emerald-400"></i> ចាប់ផ្តើមវេនសិក្សាថ្មី (Start Class Session)</h3>
            <button type="button" class="btn-close" onclick="document.getElementById('startSessionModalBackdrop').remove()">&times;</button>
          </div>
          <form onsubmit="event.preventDefault(); ComputerLabView.submitStartSession();" class="modal-body">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">មុខវិជ្ជាកុំព្យូទ័រ (Computer Subject):</label>
              <select id="sessionSubjectSelect" class="form-control">
                <option value="Microsoft Word">Microsoft Word 2021</option>
                <option value="Microsoft Excel">Microsoft Excel 2021</option>
                <option value="Microsoft PowerPoint">Microsoft PowerPoint 2021</option>
                <option value="Photoshop CC">Adobe Photoshop Graphic Design</option>
                <option value="HTML & Web Design">HTML & Web Development</option>
                <option value="Typing Master">Typing Speed Practice</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 20px;">
              <label class="form-label">វេនសិក្សា (Shift):</label>
              <select id="sessionShiftSelect" class="form-control">
                <option value="ព្រឹក (Morning)">ព្រឹក (Morning 7:30 - 10:30)</option>
                <option value="រសៀល (Afternoon)">រសៀល (Afternoon 13:30 - 16:30)</option>
                <option value="យប់ (Evening)">យប់ (Evening 17:30 - 20:30)</option>
              </select>
            </div>

            <div class="modal-footer" style="padding: 0;">
              <button type="button" class="btn-secondary" onclick="document.getElementById('startSessionModalBackdrop').remove()">បោះបង់</button>
              <button type="submit" class="btn-primary">ចាប់ផ្តើមវេនឥឡូវ</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const mount = document.getElementById("labModalsMount");
    if (mount) mount.innerHTML = modalHtml;
  },

  async submitStartSession() {
    const subj = document.getElementById("sessionSubjectSelect").value;
    const shift = document.getElementById("sessionShiftSelect").value;
    const room = this.classroomFilter === "ALL" ? "lab_a" : this.classroomFilter;

    await LabManagerService.startClassSession(room, subj, shift);
    const bd = document.getElementById("startSessionModalBackdrop");
    if (bd) bd.remove();
    this.refreshData();

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`Started session for ${subj}! Attendance linked.`, "success");
    }
  },

  openPcMoreMenu(agentId) {
    const action = prompt("ជ្រើសរើសសកម្មភាពបន្ថែម:\n1: បើក URL\n2: បញ្ជា Restart\n3: បញ្ជា Shutdown\n4: លុបកុំព្យូទ័រចេញពីបញ្ជី\n\nបញ្ចូលលេខ (1-4):");
    if (action === "1") {
      this.openUrlModal([agentId]);
    } else if (action === "2") {
      this.confirmRestartOrShutdown("RESTART", [agentId]);
    } else if (action === "3") {
      this.confirmRestartOrShutdown("SHUTDOWN", [agentId]);
    } else if (action === "4") {
      this.deleteComputer(agentId);
    }
  }
};

window.ComputerLabView = ComputerLabView;

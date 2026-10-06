/**
 * Service: Computer Lab Management & Realtime Orchestration (Client API)
 * Coordinates enrollment tokens, registered computers, WebSocket communication,
 * screen monitoring, screen broadcasting, file transfer, remote control, and sessions.
 */
const LabManagerService = {
  activeClassroomId: "lab_a",
  currentEnrollmentToken: null,
  ws: null,
  wsConnected: false,
  reconnectAttempts: 0,
  maxReconnectAttempts: 20,
  reconnectTimer: null,
  eventListeners: {},
  computers: [],
  telemetry: {}, // agentId -> { cpuUsage, ramUsage, activeWindow, latencyMs, lastHeartbeat }
  screenFrames: {}, // agentId -> objectURL or base64
  activeBroadcast: false,
  broadcastStream: null,
  broadcastInterval: null,
  activeRemoteSession: null, // agentId

  // Get base URLs (automatically points to Node.js backend on port 8080 if running in VS Code Live Server / dev ports)
  getBaseUrl() {
    if (typeof window !== "undefined" && window.location) {
      const port = window.location.port;
      const hostname = window.location.hostname;
      // If served via VS Code Live Server (e.g. port 5500) or other static dev servers
      if (port && port !== "8080" && (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168."))) {
        return `http://${hostname}:8080`;
      }
      return window.location.origin;
    }
    return "http://localhost:8080";
  },

  getWsUrl() {
    if (typeof window !== "undefined" && window.location) {
      const port = window.location.port;
      const hostname = window.location.hostname;
      if (port && port !== "8080" && (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168."))) {
        return `ws://${hostname}:8080/ws/classroom`;
      }
      const loc = window.location;
      const proto = loc.protocol === "https:" ? "wss:" : "ws:";
      return `${proto}//${loc.host}/ws/classroom`;
    }
    return "ws://localhost:8080/ws/classroom";
  },

  // Event Subscription System
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
    return () => this.off(event, callback);
  },

  off(event, callback) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
  },

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`[LabManager] Event error (${event}):`, e);
        }
      });
    }
  },

  // Initialize and Connect Teacher Console to WebSocket
  initWebSocket() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const url = this.getWsUrl();
      this.ws = new WebSocket(url);
      this.ws.binaryType = "arraybuffer";

      this.ws.onopen = () => {
        this.wsConnected = true;
        this.reconnectAttempts = 0;
        console.log("⚡ [Lab WS] Teacher Console connected to", url);

        // Subscribe as Teacher
        this.sendWs({
          type: "TEACHER_SUBSCRIBE",
          teacherId: this.getCurrentTeacher().id,
          teacherName: this.getCurrentTeacher().nameKh
        });

        this.emit("connection_status", { status: "connected" });
      };

      this.ws.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          this.handleBinaryMessage(event.data);
          return;
        }

        try {
          const msg = JSON.parse(event.data);
          this.handleJsonMessage(msg);
        } catch (e) {
          console.warn("[Lab WS] Failed to parse message:", e);
        }
      };

      this.ws.onclose = () => {
        this.wsConnected = false;
        this.emit("connection_status", { status: "disconnected" });
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn("[Lab WS] Error:", err);
      };
    } catch (e) {
      console.error("[Lab WS] Connection failed:", e);
      this.scheduleReconnect();
    }
  },

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    this.reconnectAttempts++;
    const delay = Math.min(3000 * Math.pow(1.2, this.reconnectAttempts), 15000);
    this.reconnectTimer = setTimeout(() => {
      this.initWebSocket();
    }, delay);
  },

  sendWs(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  },

  handleBinaryMessage(arrayBuffer) {
    // Screen frame packet: JSON metadata + '\n' + JPEG image binary
    const uint8 = new Uint8Array(arrayBuffer);
    let newlineIdx = -1;
    for (let i = 0; i < Math.min(uint8.length, 512); i++) {
      if (uint8[i] === 10) { // '\n'
        newlineIdx = i;
        break;
      }
    }

    if (newlineIdx !== -1) {
      try {
        const metaStr = new TextDecoder().decode(uint8.subarray(0, newlineIdx));
        const meta = JSON.parse(metaStr);
        const imageBytes = uint8.subarray(newlineIdx + 1);
        const blob = new Blob([imageBytes], { type: "image/jpeg" });
        const imgUrl = URL.createObjectURL(blob);

        if (meta.agentId) {
          if (this.screenFrames[meta.agentId]) {
            URL.revokeObjectURL(this.screenFrames[meta.agentId]);
          }
          this.screenFrames[meta.agentId] = imgUrl;
          this.emit("screen_frame", { agentId: meta.agentId, url: imgUrl });
        }
      } catch (err) {
        console.warn("[Lab WS] Binary parse error:", err);
      }
    }
  },

  handleJsonMessage(msg) {
    const { type } = msg;

    if (type === "SNAPSHOT") {
      this.computers = msg.computers || [];
      this.emit("snapshot", msg);
      this.emit("computers_updated", this.computers);
    } else if (type === "AGENT_ONLINE") {
      const idx = this.computers.findIndex(c => c.agentId === msg.agentId);
      if (idx !== -1) {
        this.computers[idx].status = "online";
        this.computers[idx].ipAddress = msg.ipAddress || this.computers[idx].ipAddress;
        this.computers[idx].lastSeen = msg.lastSeen;
      } else {
        this.refreshComputers();
      }
      this.emit("agent_online", msg);
      this.emit("computers_updated", this.computers);
    } else if (type === "AGENT_OFFLINE") {
      const pc = this.computers.find(c => c.agentId === msg.agentId);
      if (pc) {
        pc.status = "offline";
        pc.lastSeen = msg.lastSeen;
      }
      this.emit("agent_offline", msg);
      this.emit("computers_updated", this.computers);
    } else if (type === "AGENT_TELEMETRY") {
      this.telemetry[msg.agentId] = {
        cpuUsage: msg.cpuUsage,
        ramUsage: msg.ramUsage,
        activeWindow: msg.activeWindow,
        latencyMs: msg.latencyMs,
        lastHeartbeat: msg.timestamp
      };
      const pc = this.computers.find(c => c.agentId === msg.agentId);
      if (pc) {
        pc.status = "online";
        pc.lastSeen = new Date().toISOString();
      }
      this.emit("agent_telemetry", msg);
    } else if (type === "AGENT_COMMAND_RESULT") {
      this.emit("command_result", msg);
    } else if (type === "ASSIGNMENT_RECEIVED") {
      this.emit("assignment_received", msg.assignment);
    } else if (type === "TEACHER_BROADCAST_ACTIVE") {
      this.activeBroadcast = msg.active;
      this.emit("broadcast_state", { active: msg.active });
    }
  },

  getCurrentTeacher() {
    return (typeof AuthService !== "undefined" && AuthService.getCurrentUser()) || {
      id: "TCH-001",
      nameKh: "លោកគ្រូ ខៀន ធូ"
    };
  },

  // 1. Enrollment API
  async createEnrollmentToken(classroomId = "lab_a", ttlMinutes = 10, preferredHost = null) {
    try {
      const teacher = this.getCurrentTeacher();
      const res = await fetch(`${this.getBaseUrl()}/api/lab/enroll/create-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classroomId,
          teacherId: teacher.id || "TCH-001",
          teacherName: teacher.nameKh || "លោកគ្រូ ខៀន ធូ",
          ttlMinutes,
          preferredHost
        })
      });

      if (!res.ok) {
        let errBody = "";
        try { errBody = await res.text(); } catch (e) {}
        throw new Error(`HTTP ${res.status}: ${errBody || res.statusText}`);
      }

      const text = await res.text();
      if (!text || !text.trim()) {
        throw new Error("Empty response from server");
      }

      const data = JSON.parse(text);
      if (data && data.success) {
        this.currentEnrollmentToken = data;
        return data;
      }
      throw new Error(data.error || "Failed to generate enrollment token");
    } catch (err) {
      console.warn("createEnrollmentToken failed:", err.message);
      // Fallback: If backend is completely offline or unreachable, return local offline token so UI does not freeze
      const fallbackToken = "LAB-" + Math.floor(100000 + Math.random() * 900000);
      const fallbackHost = preferredHost || "192.168.1.7";
      const fallbackUrl = `http://${fallbackHost}:8080/enroll/${fallbackToken}`;
      const fallbackData = {
        success: true,
        token: fallbackToken,
        classroomId,
        classroomName: "បន្ទប់កុំព្យូទ័រ A (Lab A)",
        expiresAt: Date.now() + ttlMinutes * 60 * 1000,
        ttlMinutes,
        enrollUrl: fallbackUrl,
        realLanIp: fallbackHost,
        allLanIps: [{ name: "Wi-Fi", ip: fallbackHost }],
        targetHost: fallbackHost,
        port: 8080,
        isOfflineFallback: true
      };
      this.currentEnrollmentToken = fallbackData;
      return fallbackData;
    }
  },

  async getNetworkInfo() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/network-info`);
      return await res.json();
    } catch (e) {
      return { primaryIp: "localhost", allIps: [], port: 8080 };
    }
  },

  async verifyToken(token) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/enroll/verify-token?token=${encodeURIComponent(token)}`);
      return await res.json();
    } catch (err) {
      return { valid: false, error: err.message };
    }
  },

  // 2. Computers & Classrooms API
  async getEnrolledComputers(classroomId = null) {
    try {
      let url = `${this.getBaseUrl()}/api/lab/computers`;
      if (classroomId && classroomId !== "ALL") {
        url += `?classroomId=${encodeURIComponent(classroomId)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        this.computers = data.computers || [];
        return this.computers;
      }
      return [];
    } catch (err) {
      console.warn("getEnrolledComputers warning:", err);
      return [];
    }
  },

  async refreshComputers() {
    const list = await this.getEnrolledComputers(this.activeClassroomId);
    this.emit("computers_updated", list);
    return list;
  },

  async deleteComputer(agentId) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/computers/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId })
      });
      const data = await res.json();
      if (data.success) {
        this.computers = this.computers.filter(c => c.agentId !== agentId);
        this.emit("computers_updated", this.computers);
        return true;
      }
      return false;
    } catch (e) {
      console.error("deleteComputer error:", e);
      return false;
    }
  },

  async getClassrooms() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/classrooms`);
      const data = await res.json();
      return data.success ? (data.classrooms || []) : [];
    } catch (err) {
      console.warn("getClassrooms warning:", err);
      return [];
    }
  },

  async createClassroom(roomData) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/classrooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData)
      });
      return await res.json();
    } catch (e) {
      console.error("createClassroom error:", e);
      throw e;
    }
  },

  async assignStudent(agentId, studentId, studentName = "", seatNumber = "") {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/assign-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, studentId, studentName, seatNumber })
      });
      const data = await res.json();
      if (data && data.success) {
        const idx = this.computers.findIndex(c => c.agentId === agentId);
        if (idx !== -1) {
          this.computers[idx] = data.agent;
          this.emit("computers_updated", this.computers);
        }
        return data.agent;
      }
      throw new Error(data.error || "Failed to assign student");
    } catch (err) {
      console.error("assignStudent error:", err);
      throw err;
    }
  },

  // 3. Command Dispatching (REST + WS Fallback)
  async dispatchCommand(command, targetAgentIds = "ALL", commandPayload = {}) {
    const teacher = this.getCurrentTeacher();
    const payload = {
      command,
      targetAgentIds,
      commandPayload,
      teacherName: teacher.nameKh || "លោកគ្រូ ខៀន ធូ"
    };

    // Fast WS route if connected
    if (this.wsConnected) {
      this.sendWs({
        type: "DISPATCH_COMMAND",
        command,
        targetAgentIds,
        payload: commandPayload,
        teacherName: payload.teacherName
      });
    }

    // Also dispatch via HTTP for persistence and audit logging
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/commands/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.error("dispatchCommand error:", err);
      throw err;
    }
  },

  // High-Level Control Actions
  async lockScreen(targetAgentIds = "ALL", customMessage = "") {
    const teacher = this.getCurrentTeacher();
    return await this.dispatchCommand("LOCK_SCREEN", targetAgentIds, {
      message: customMessage || "CLASSROOM LOCKED - Please pay attention to teacher",
      teacherName: teacher.nameKh
    });
  },

  async unlockScreen(targetAgentIds = "ALL") {
    return await this.dispatchCommand("UNLOCK_SCREEN", targetAgentIds, {});
  },

  async sendMessage(targetAgentIds = "ALL", message = "", title = "សារពីគ្រូបង្រៀន (Teacher Message)") {
    const teacher = this.getCurrentTeacher();
    return await this.dispatchCommand("SHOW_MESSAGE", targetAgentIds, {
      title,
      message,
      teacherName: teacher.nameKh
    });
  },

  async openUrl(targetAgentIds = "ALL", url = "") {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    return await this.dispatchCommand("OPEN_URL", targetAgentIds, { url });
  },

  async restartComputers(targetAgentIds = "ALL") {
    return await this.dispatchCommand("RESTART", targetAgentIds, { delaySeconds: 5 });
  },

  async shutdownComputers(targetAgentIds = "ALL") {
    return await this.dispatchCommand("SHUTDOWN", targetAgentIds, { delaySeconds: 5 });
  },

  async launchApplication(targetAgentIds = "ALL", appName = "") {
    return await this.dispatchCommand("LAUNCH_APP", targetAgentIds, { appName });
  },

  async terminateApplication(targetAgentIds = "ALL", processName = "") {
    return await this.dispatchCommand("TERMINATE_APP", targetAgentIds, { processName });
  },

  // 4. Live Screen Monitoring
  requestScreenStream(agentId, fps = 10, quality = "medium") {
    if (this.wsConnected) {
      this.sendWs({
        type: "REQUEST_SCREEN_STREAM",
        agentId,
        fps,
        quality
      });
    }
  },

  stopScreenStream(agentId) {
    if (this.wsConnected) {
      this.sendWs({
        type: "STOP_SCREEN_STREAM",
        agentId
      });
    }
  },

  // 5. Teacher Screen Broadcast to Students
  async startScreenBroadcast(targetAgentIds = "ALL", fps = 8) {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("Screen sharing is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always", frameRate: fps },
        audio: false
      });

      this.broadcastStream = stream;
      this.activeBroadcast = true;
      const teacher = this.getCurrentTeacher();

      this.sendWs({
        type: "BROADCAST_START",
        targetAgentIds,
        teacherName: teacher.nameKh
      });

      // Capture frames using hidden canvas
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.onloadedmetadata = () => {
        canvas.width = Math.min(video.videoWidth, 1280);
        canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth));

        const intervalMs = Math.round(1000 / fps);
        this.broadcastInterval = setInterval(() => {
          if (!this.activeBroadcast || !this.broadcastStream) {
            this.stopScreenBroadcast();
            return;
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.65);
          const base64Data = dataUrl.split(",")[1];

          this.sendWs({
            type: "BROADCAST_FRAME",
            image: base64Data
          });
        }, intervalMs);
      };

      stream.getVideoTracks()[0].onended = () => {
        this.stopScreenBroadcast();
      };

      this.emit("broadcast_state", { active: true });
      return true;
    } catch (err) {
      console.error("startScreenBroadcast failed:", err);
      this.activeBroadcast = false;
      this.emit("broadcast_state", { active: false, error: err.message });
      throw err;
    }
  },

  stopScreenBroadcast() {
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
      this.broadcastInterval = null;
    }
    if (this.broadcastStream) {
      this.broadcastStream.getTracks().forEach(t => t.stop());
      this.broadcastStream = null;
    }
    this.activeBroadcast = false;
    const teacher = this.getCurrentTeacher();

    this.sendWs({
      type: "BROADCAST_STOP",
      teacherName: teacher.nameKh
    });

    this.emit("broadcast_state", { active: false });
  },

  // 6. Interactive Remote Control
  startRemoteControl(agentId) {
    const teacher = this.getCurrentTeacher();
    this.activeRemoteSession = agentId;
    this.sendWs({
      type: "REMOTE_CONTROL_START",
      agentId,
      teacherName: teacher.nameKh
    });
    // Request stream
    this.requestScreenStream(agentId, 15, "high");
    this.emit("remote_control_state", { active: true, agentId });
  },

  sendRemoteInput(agentId, eventData) {
    if (this.wsConnected && this.activeRemoteSession === agentId) {
      this.sendWs({
        type: "REMOTE_INPUT_EVENT",
        agentId,
        event: eventData
      });
    }
  },

  stopRemoteControl(agentId) {
    const teacher = this.getCurrentTeacher();
    if (this.activeRemoteSession === agentId) {
      this.activeRemoteSession = null;
    }
    this.sendWs({
      type: "REMOTE_CONTROL_STOP",
      agentId,
      teacherName: teacher.nameKh
    });
    this.emit("remote_control_state", { active: false, agentId });
  },

  // 7. File Distribution
  async sendLessonFile(fileName, base64Content, targetPcs = "ALL", classroomId = "lab_a") {
    try {
      const teacher = this.getCurrentTeacher();
      const res = await fetch(`${this.getBaseUrl()}/api/lab/files/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          fileContentBase64: base64Content,
          targetPcs,
          classroomId,
          teacherName: teacher.nameKh
        })
      });
      return await res.json();
    } catch (e) {
      console.error("sendLessonFile error:", e);
      throw e;
    }
  },

  async getFileTransfers() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/files/list`);
      const data = await res.json();
      return data.success ? (data.transfers || []) : [];
    } catch (e) {
      return [];
    }
  },

  async getCollectedAssignments() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/files/assignments`);
      const data = await res.json();
      return data.success ? (data.assignments || []) : [];
    } catch (e) {
      return [];
    }
  },

  // 8. Sessions & Attendance Integration
  async startClassSession(classroomId, subject, shift = "ព្រឹក") {
    try {
      const teacher = this.getCurrentTeacher();
      const res = await fetch(`${this.getBaseUrl()}/api/lab/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classroomId,
          subject,
          shift,
          teacherId: teacher.id,
          teacherName: teacher.nameKh
        })
      });
      const data = await res.json();

      // Attendance integration: if active computers have assigned students, record present
      if (data && data.success && typeof StudentAPI !== "undefined" && StudentAPI.markAttendance) {
        const activeOnline = this.computers.filter(c => c.status === "online" && c.assignedStudentId);
        const todayStr = new Date().toISOString().split("T")[0];
        for (const pc of activeOnline) {
          try {
            await StudentAPI.markAttendance(pc.assignedStudentId, todayStr, "present", `Computer Lab Session (${subject} - ${pc.displayName})`);
          } catch (attErr) {
            console.warn("Attendance auto-mark error:", attErr);
          }
        }
      }

      return data;
    } catch (e) {
      console.error("startClassSession error:", e);
      throw e;
    }
  },

  async endClassSession(sessionId) {
    try {
      const teacher = this.getCurrentTeacher();
      const res = await fetch(`${this.getBaseUrl()}/api/lab/sessions/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, teacherName: teacher.nameKh })
      });
      return await res.json();
    } catch (e) {
      console.error("endClassSession error:", e);
      throw e;
    }
  },

  async getActiveSession(classroomId = "lab_a") {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/sessions/active?classroomId=${encodeURIComponent(classroomId)}`);
      const data = await res.json();
      return data.success ? data.session : null;
    } catch (e) {
      return null;
    }
  },

  // 9. Audit Logs & Settings
  async getAuditLogs() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/audit-logs`);
      const data = await res.json();
      return data.success ? (data.logs || []) : [];
    } catch (err) {
      console.warn("getAuditLogs warning:", err);
      return [];
    }
  },

  async getSettings() {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/settings`);
      const data = await res.json();
      return data.success ? data.settings : {};
    } catch (e) {
      return {};
    }
  },

  async updateSettings(settings) {
    try {
      const res = await fetch(`${this.getBaseUrl()}/api/lab/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      return await res.json();
    } catch (e) {
      console.error("updateSettings error:", e);
      throw e;
    }
  }
};

window.LabManagerService = LabManagerService;

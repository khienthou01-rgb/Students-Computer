/**
 * Module: Laboratory Database & Persistence Store (Computer Lab Management)
 * Manages classrooms, computer agents, one-time enrollment tokens, assignments,
 * active classroom sessions, file distribution & collection records, settings, and audit logs.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Store in hidden .lab_data directory so development file watchers (VS Code Live Server) never trigger unwanted browser page reloads
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', '.lab_data') : path.join(__dirname, '..', '.lab_data');
const DB_FILE = path.join(DATA_DIR, 'lab_db.json');
const LEGACY_DB_FILE = path.join(__dirname, '..', 'data', 'lab', 'lab_db.json');

class LabStore {
  constructor() {
    this._saveTimer = null;
    this.data = {
      classrooms: [
        {
          id: "lab_a",
          name: "Computer Lab A",
          roomNumber: "Lab A4",
          totalCapacity: 24,
          assignedTeacherId: "TCH-001",
          assignedTeacherName: "លោកគ្រូ ខៀន ធូ",
          defaultShifts: ["ព្រឹក", "ថ្ងៃ", "រសៀល"],
          createdAt: new Date().toISOString()
        },
        {
          id: "lab_b",
          name: "Computer Lab B",
          roomNumber: "Lab B2",
          totalCapacity: 20,
          assignedTeacherId: "TCH-001",
          assignedTeacherName: "លោកគ្រូ ខៀន ធូ",
          defaultShifts: ["ព្រឹក", "ថ្ងៃ", "រសៀល"],
          createdAt: new Date().toISOString()
        }
      ],
      computer_agents: {},
      enrollment_tokens: {},
      computer_assignments: {},
      classroom_sessions: {},
      file_transfers: [],
      collected_assignments: [],
      settings: {
        fps: 10,
        quality: "medium", // low, medium, high
        enrollmentTtlMinutes: 10,
        allowedApplications: [
          "WINWORD.EXE",
          "EXCEL.EXE",
          "POWERPNT.EXE",
          "notepad.exe",
          "calc.exe",
          "chrome.exe",
          "msedge.exe",
          "typing.exe",
          "cmd.exe"
        ],
        lockScreenMessage: "ថ្នាក់រៀនត្រូវបានចាក់សោ (Classroom Locked). សូមរង់ចាំការណែនាំពីលោកគ្រូ!",
        autoStartAgent: true
      },
      audit_logs: []
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      // Migrate from legacy DB file if new one doesn't exist yet
      if (!fs.existsSync(DB_FILE) && fs.existsSync(LEGACY_DB_FILE)) {
        try {
          fs.copyFileSync(LEGACY_DB_FILE, DB_FILE);
        } catch (e) {}
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        if (raw) {
          const parsed = JSON.parse(raw);
          this.data = {
            classrooms: parsed.classrooms || this.data.classrooms,
            computer_agents: parsed.computer_agents || {},
            enrollment_tokens: parsed.enrollment_tokens || {},
            computer_assignments: parsed.computer_assignments || {},
            classroom_sessions: parsed.classroom_sessions || {},
            file_transfers: parsed.file_transfers || [],
            collected_assignments: parsed.collected_assignments || [],
            settings: { ...this.data.settings, ...(parsed.settings || {}) },
            audit_logs: parsed.audit_logs || []
          };
        }
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('⚠️ LabStore initialization note:', err.message);
    }
  }

  scheduleSave() {
    if (this._saveTimer) return;
    this._saveTimer = setTimeout(() => {
      this._saveTimer = null;
      this.save();
    }, 1200);
  }

  save() {
    try {
      if (this._saveTimer) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
      }
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ LabStore save failed:', err.message);
    }
  }

  // ==========================================
  // 1. CLASSROOM MANAGEMENT
  // ==========================================
  getClassrooms() {
    return this.data.classrooms || [];
  }

  getClassroom(id) {
    return this.getClassrooms().find(c => c.id === id);
  }

  createClassroom(classroom) {
    const id = classroom.id || `lab_${Date.now().toString(36)}`;
    const newClassroom = {
      id,
      name: classroom.name || "New Computer Lab",
      roomNumber: classroom.roomNumber || "Lab Room",
      totalCapacity: parseInt(classroom.totalCapacity, 10) || 24,
      assignedTeacherId: classroom.assignedTeacherId || "TCH-001",
      assignedTeacherName: classroom.assignedTeacherName || "លោកគ្រូ ខៀន ធូ",
      defaultShifts: classroom.defaultShifts || ["ព្រឹក", "ថ្ងៃ", "រសៀល"],
      createdAt: new Date().toISOString()
    };
    this.data.classrooms.push(newClassroom);
    this.save();
    return newClassroom;
  }

  // ==========================================
  // 2. ONE-TIME ENROLLMENT TOKEN ENGINE
  // ==========================================
  createEnrollmentToken(classroomId = "lab_a", teacherId = "TCH-001", teacherName = "លោកគ្រូ ខៀន ធូ", ttlMinutes = 10) {
    const classroom = this.getClassroom(classroomId) || this.data.classrooms[0];
    
    // Generate clean 6-character uppercase alphanumeric code (e.g. 7F82A9)
    const token = crypto.randomBytes(3).toString('hex').toUpperCase();
    const now = Date.now();
    const expiresAt = now + (ttlMinutes * 60 * 1000);

    const record = {
      token,
      classroomId: classroom ? classroom.id : "lab_a",
      classroomName: classroom ? classroom.name : "Computer Lab A",
      teacherId,
      teacherName,
      createdAt: now,
      expiresAt,
      ttlMinutes,
      isUsed: false,
      usedByMachineId: null,
      usedByHostname: null,
      usedAt: null
    };

    this.data.enrollment_tokens[token] = record;
    this.scheduleSave();

    this.logAudit(
      "TOKEN_CREATED",
      `Token ${token}`,
      `Created one-time enrollment token for ${record.classroomName} (Expires in ${ttlMinutes}m)`,
      teacherName
    );

    return record;
  }

  verifyToken(tokenStr) {
    if (!tokenStr) return { valid: false, error: "Missing token parameter" };
    const cleanToken = String(tokenStr).trim().toUpperCase();
    const record = this.data.enrollment_tokens[cleanToken];

    if (!record) {
      return { valid: false, error: "Invalid enrollment token (Token មិនត្រឹមត្រូវ)" };
    }
    if (record.isUsed) {
      return { 
        valid: false, 
        error: "Enrollment token has already been used (Token នេះត្រូវបានប្រើប្រាស់រួចហើយ)",
        usedAt: record.usedAt,
        usedByHostname: record.usedByHostname 
      };
    }
    if (Date.now() > record.expiresAt) {
      return { 
        valid: false, 
        error: "Enrollment token has expired (Token បានផុតកំណត់សុពលភាព)",
        expiredAt: new Date(record.expiresAt).toISOString()
      };
    }

    const remainingSeconds = Math.max(0, Math.floor((record.expiresAt - Date.now()) / 1000));
    return {
      valid: true,
      token: cleanToken,
      classroomId: record.classroomId,
      classroomName: record.classroomName,
      teacherName: record.teacherName,
      expiresAt: record.expiresAt,
      remainingSeconds
    };
  }

  burnToken(tokenStr, machineId, hostname) {
    const cleanToken = String(tokenStr).trim().toUpperCase();
    const record = this.data.enrollment_tokens[cleanToken];
    if (record) {
      record.isUsed = true;
      record.usedByMachineId = machineId;
      record.usedByHostname = hostname || null;
      record.usedAt = new Date().toISOString();
      this.save();
    }
  }

  // ==========================================
  // 3. COMPUTER AGENT REGISTRATION & STATUS
  // ==========================================
  registerAgent(payload, connectionIp = "") {
    const { token, machineId, hostname, hardware = {}, seatNumber = "" } = payload;
    
    // 1. Verify token
    const tokenCheck = this.verifyToken(token);
    if (!tokenCheck.valid) {
      throw new Error(tokenCheck.error);
    }

    if (!machineId || !machineId.trim()) {
      throw new Error("Missing machineId (Machine fingerprint is required)");
    }

    const cleanMachineId = String(machineId).trim();
    const cleanHostname = (hostname || cleanMachineId).trim();
    const detectedIp = connectionIp.replace(/^::ffff:/, '');

    // 2. Check if machine previously enrolled
    let agentId = null;
    let existingRecord = Object.values(this.data.computer_agents).find(a => a.machineId === cleanMachineId);
    
    if (existingRecord) {
      agentId = existingRecord.agentId;
    } else {
      agentId = `ag_${crypto.randomBytes(8).toString('hex')}`;
    }

    const secretKey = crypto.randomBytes(24).toString('hex');

    // Determine default seat or displayName
    let displayName = cleanHostname;
    const match = cleanHostname.match(/PC[-_]?(\d+)/i);
    let autoSeat = seatNumber;
    if (!autoSeat && match) {
      autoSeat = `A${String(match[1]).padStart(2, '0')}`;
      displayName = `PC-${String(match[1]).padStart(2, '0')}`;
    }

    const agentRecord = {
      agentId,
      machineId: cleanMachineId,
      hostname: cleanHostname,
      displayName,
      classroomId: tokenCheck.classroomId,
      classroomName: tokenCheck.classroomName,
      seatNumber: autoSeat || existingRecord?.seatNumber || "",
      assignedStudentId: existingRecord?.assignedStudentId || null,
      assignedStudentName: existingRecord?.assignedStudentName || null,
      ipAddress: detectedIp || hardware.ip || existingRecord?.ipAddress || "127.0.0.1",
      macAddress: hardware.mac || existingRecord?.macAddress || "",
      osVersion: hardware.os || "Windows",
      cpu: hardware.cpu || "Unknown CPU",
      ram: hardware.ram || "Unknown RAM",
      gpu: hardware.gpu || "Unknown GPU",
      storage: hardware.storage || "Unknown Storage",
      screenResolution: hardware.resolution || "1920x1080",
      status: "online",
      isLocked: false,
      isStreaming: false,
      latencyMs: 1,
      secretKey,
      agentVersion: payload.agentVersion || "2.2.0",
      enrolledAt: existingRecord?.enrolledAt || new Date().toISOString(),
      lastSeen: new Date().toISOString()
    };

    this.data.computer_agents[agentId] = agentRecord;

    // 3. Mark token as used
    this.burnToken(token, cleanMachineId, cleanHostname);

    this.logAudit(
      "COMPUTER_ENROLLED",
      agentRecord.displayName,
      `Successfully enrolled ${agentRecord.displayName} (${agentRecord.hostname}) into ${agentRecord.classroomName} using token ${tokenCheck.token}`,
      tokenCheck.teacherName,
      detectedIp
    );

    this.save();

    return {
      success: true,
      agentId,
      machineId: cleanMachineId,
      displayName: agentRecord.displayName,
      classroomId: agentRecord.classroomId,
      classroomName: agentRecord.classroomName,
      secretKey,
      enrolledAt: agentRecord.enrolledAt
    };
  }

  getAgents(classroomId = null) {
    const list = Object.values(this.data.computer_agents || {});
    if (classroomId && classroomId !== "ALL") {
      return list.filter(a => a.classroomId === classroomId);
    }
    return list;
  }

  getAgent(agentId) {
    return this.data.computer_agents[agentId] || null;
  }

  updateAgentHeartbeat(agentId, ip = "", metrics = {}) {
    const agent = this.getAgent(agentId);
    if (!agent) return false;
    agent.lastSeen = new Date().toISOString();
    agent.status = "online";
    if (ip) agent.ipAddress = ip.replace(/^::ffff:/, '');
    if (metrics.cpuUsage !== undefined) agent.cpuUsage = metrics.cpuUsage;
    if (metrics.ramUsage !== undefined) agent.ramUsage = metrics.ramUsage;
    if (metrics.latencyMs !== undefined) agent.latencyMs = metrics.latencyMs;
    if (metrics.activeWindow !== undefined) agent.activeWindow = metrics.activeWindow;
    return true;
  }

  setAgentStatus(agentId, status) {
    const agent = this.getAgent(agentId);
    if (!agent) return false;
    agent.status = status;
    agent.lastSeen = new Date().toISOString();
    this.save();
    return true;
  }

  setAgentLockState(agentId, isLocked) {
    const agent = this.getAgent(agentId);
    if (!agent) return false;
    agent.isLocked = isLocked;
    this.save();
    return true;
  }

  deleteAgent(agentId) {
    if (this.data.computer_agents[agentId]) {
      const name = this.data.computer_agents[agentId].displayName;
      delete this.data.computer_agents[agentId];
      delete this.data.computer_assignments[agentId];
      this.save();
      this.logAudit("COMPUTER_DELETED", name, `Deleted computer agent ${name} (${agentId})`);
      return true;
    }
    return false;
  }

  // ==========================================
  // 4. STUDENT & SEAT ASSIGNMENT (LINKED TO EXISTING STUDENTS)
  // ==========================================
  assignStudent(agentId, studentId, studentName = "", seatNumber = "") {
    const agent = this.getAgent(agentId);
    if (!agent) throw new Error("Computer agent not found");

    agent.assignedStudentId = studentId ? String(studentId).trim() : null;
    agent.assignedStudentName = studentName ? String(studentName).trim() : null;
    if (seatNumber) agent.seatNumber = String(seatNumber).trim();

    this.data.computer_assignments[agentId] = {
      agentId,
      studentId: agent.assignedStudentId,
      studentName: agent.assignedStudentName,
      seatNumber: agent.seatNumber,
      updatedAt: new Date().toISOString()
    };

    this.logAudit(
      "STUDENT_ASSIGNED",
      agent.displayName,
      `Assigned student ${agent.assignedStudentName || agent.assignedStudentId || 'None'} to ${agent.displayName} (Seat: ${agent.seatNumber || 'N/A'})`
    );

    this.save();
    return agent;
  }

  // ==========================================
  // 5. CLASSROOM SESSIONS & ATTENDANCE INTEGRATION
  // ==========================================
  startSession(classroomId = "lab_a", subject = "Microsoft Word", shift = "ព្រឹក", teacherId = "TCH-001", teacherName = "លោកគ្រូ ខៀន ធូ") {
    // Automatically close any existing active session for this classroom
    Object.values(this.data.classroom_sessions || {}).forEach(s => {
      if (s.classroomId === classroomId && s.isActive) {
        s.isActive = false;
        s.status = "ended";
        s.endedAt = new Date().toISOString();
      }
    });

    const sessionId = `sess_${Date.now()}`;
    const session = {
      sessionId,
      classroomId,
      subject,
      shift,
      teacherId,
      teacherName,
      startedAt: new Date().toISOString(),
      endedAt: null,
      isActive: true,
      status: "active",
      attendanceSnapshot: []
    };

    // Snapshot currently assigned online students for attendance integration
    const agents = this.getAgents(classroomId);
    agents.forEach(a => {
      if (a.assignedStudentId) {
        session.attendanceSnapshot.push({
          studentId: a.assignedStudentId,
          studentName: a.assignedStudentName || a.assignedStudentId,
          agentId: a.agentId,
          computerName: a.displayName,
          status: a.status === 'online' ? 'present' : 'absent',
          timestamp: new Date().toISOString()
        });
      }
    });

    this.data.classroom_sessions[sessionId] = session;
    this.save();

    this.logAudit("SESSION_STARTED", subject, `Started ${subject} (${shift}) in ${classroomId}`, teacherName);
    return session;
  }

  endSession(sessionId, teacherName = "Teacher") {
    const session = this.data.classroom_sessions[sessionId];
    if (session) {
      session.isActive = false;
      session.status = "ended";
      session.endedAt = new Date().toISOString();
      this.save();
      this.logAudit("SESSION_ENDED", session.subject, `Ended class session ${session.subject}`, teacherName);
      return session;
    }
    return null;
  }

  getActiveSession(classroomId = null) {
    const sessions = Object.values(this.data.classroom_sessions || {});
    const active = sessions
      .filter(s => s.isActive && (!classroomId || s.classroomId === classroomId))
      .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    return active[0] || null;
  }

  getSessions(classroomId = null) {
    const sessions = Object.values(this.data.classroom_sessions || {});
    if (classroomId && classroomId !== "ALL") {
      return sessions.filter(s => s.classroomId === classroomId);
    }
    return sessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  }

  // ==========================================
  // 6. FILE TRANSFERS & ASSIGNMENTS
  // ==========================================
  createFileTransfer(transferData) {
    const transferId = `ft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const record = {
      transferId,
      type: transferData.type || "send", // send or collect
      classroomId: transferData.classroomId || "lab_a",
      teacherName: transferData.teacherName || "Teacher",
      fileName: transferData.fileName,
      fileSize: transferData.fileSize || 0,
      fileUrl: transferData.fileUrl || "",
      targetPcs: transferData.targetPcs || "ALL",
      targetCount: Array.isArray(transferData.targetPcs) ? transferData.targetPcs.length : (this.getAgents(transferData.classroomId).length),
      status: "completed",
      timestamp: new Date().toISOString()
    };
    this.data.file_transfers.unshift(record);
    if (this.data.file_transfers.length > 200) {
      this.data.file_transfers = this.data.file_transfers.slice(0, 200);
    }
    this.save();
    return record;
  }

  getFileTransfers(limit = 50) {
    return (this.data.file_transfers || []).slice(0, limit);
  }

  recordCollectedAssignment(item) {
    const id = `asg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const record = {
      id,
      assignmentId: id,
      classroomId: item.classroomId || "lab_a",
      subject: item.subject || "Microsoft Word",
      assignmentTitle: item.assignmentTitle || "Exercise",
      studentId: item.studentId || "TX01",
      studentName: item.studentName || "Student",
      agentId: item.agentId || "",
      computerName: item.computerName || "PC-01",
      fileName: item.fileName,
      fileSize: item.fileSize || 0,
      savedPath: item.savedPath || "",
      downloadUrl: item.downloadUrl || "",
      submittedAt: new Date().toISOString()
    };
    this.data.collected_assignments.unshift(record);
    this.save();
    return record;
  }

  getCollectedAssignments(limit = 100) {
    return (this.data.collected_assignments || []).slice(0, limit);
  }

  // ==========================================
  // 7. LAB SETTINGS
  // ==========================================
  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings
    };
    this.save();
    return this.data.settings;
  }

  // ==========================================
  // 8. AUDIT LOGGING ENGINE
  // ==========================================
  logAudit(action, target, details, teacherName = "System", ip = "127.0.0.1") {
    const record = {
      logId: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      target,
      details,
      teacherName,
      ip
    };
    this.data.audit_logs.unshift(record);
    if (this.data.audit_logs.length > 1000) {
      this.data.audit_logs = this.data.audit_logs.slice(0, 1000);
    }
    this.scheduleSave();
    return record;
  }

  getAuditLogs(limit = 100) {
    return (this.data.audit_logs || []).slice(0, limit);
  }
}

module.exports = new LabStore();

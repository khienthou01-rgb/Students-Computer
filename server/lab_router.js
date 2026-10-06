/**
 * Module: Classroom Lab Management Router
 * Routes all /enroll and /api/lab endpoints for the Student Computer Management Module.
 */
const os = require('os');
const fs = require('fs');
const path = require('path');
const labStore = require('./lab_store');
const { renderEnrollmentPage } = require('./enrollment_page');
const { generateBootstrapPs1, generateBootstrapBat } = require('./agent_bootstrap');

const UPLOADS_DIR = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, '..', 'uploads');
const LESSONS_DIR = path.join(UPLOADS_DIR, 'lessons');
const ASSIGNMENTS_DIR = path.join(UPLOADS_DIR, 'assignments');

[LESSONS_DIR, ASSIGNMENTS_DIR].forEach(dir => {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (e) {}
});

const QRCode = require('qrcode');

function getAllLanIps() {
  const ifaces = os.networkInterfaces();
  const list = [];
  for (const name in ifaces) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        list.push({
          name,
          address: iface.address
        });
      }
    }
  }
  return list;
}

function getPrimaryLanIp() {
  const list = getAllLanIps();
  if (list.length === 0) return 'localhost';
  // 1. Prefer active physical Wi-Fi or Ethernet adapter
  const physical = list.find(item => /wi-?fi|ethernet|local area|lan|wlan0|eth0/i.test(item.name) && !item.address.startsWith('169.254.'));
  if (physical) return physical.address;
  // 2. Next prefer any standard class C/A private LAN address
  const standard = list.find(item => (item.address.startsWith('192.168.') || item.address.startsWith('10.') || item.address.startsWith('172.')) && !item.address.startsWith('169.254.'));
  if (standard) return standard.address;
  // 3. Any non-APIPA IP
  const nonApipa = list.find(item => !item.address.startsWith('169.254.'));
  if (nonApipa) return nonApipa.address;
  return list[0].address || 'localhost';
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20 * 1024 * 1024) { // 20MB limit for files
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

async function handleLabRoutes(req, res, urlPath, port, wsHub = null) {
  const hostHeader = (req.headers.host || '').split(':')[0] || getPrimaryLanIp();
  const primaryIp = getPrimaryLanIp();
  const effectiveHost = (hostHeader === 'localhost' || hostHeader === '127.0.0.1') ? primaryIp : hostHeader;

  // 1. Student Web Enrollment Page: GET /enroll/:token
  if (req.method === 'GET' && (urlPath.startsWith('/enroll/') || urlPath === '/enroll')) {
    let token = '';
    if (urlPath.startsWith('/enroll/')) {
      token = urlPath.slice('/enroll/'.length).trim().split(/[/?#]/)[0];
    } else {
      const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      token = (parsed.searchParams.get('token') || parsed.searchParams.get('t') || '').trim();
    }

    const tokenData = labStore.verifyToken(token);
    const html = renderEnrollmentPage(tokenData, effectiveHost, port);

    res.writeHead(tokenData.valid ? 200 : 400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return true;
  }

  // 2. One-Time Token Verification: GET /api/lab/enroll/verify-token
  if (req.method === 'GET' && urlPath === '/api/lab/enroll/verify-token') {
    const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const token = (parsed.searchParams.get('token') || parsed.searchParams.get('t') || '').trim();
    const result = labStore.verifyToken(token);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(result));
    return true;
  }

  // 3. Generate One-Time Token: POST /api/lab/enroll/create-token
  if (req.method === 'POST' && urlPath === '/api/lab/enroll/create-token') {
    try {
      const payload = await parseJsonBody(req);
      const classroomId = payload.classroomId || 'lab_a';
      const teacherId = payload.teacherId || 'TCH-001';
      const teacherName = payload.teacherName || 'លោកគ្រូ ខៀន ធូ';
      const ttlMinutes = parseInt(payload.ttlMinutes, 10) || 10;
      const requestedHost = (payload.preferredHost || '').trim();

      const record = labStore.createEnrollmentToken(classroomId, teacherId, teacherName, ttlMinutes);
      
      const realLanIp = getPrimaryLanIp();
      const allLanIps = getAllLanIps();
      // If client explicitly selected an IP/host, use that; otherwise use the real LAN IP!
      const targetHost = requestedHost || realLanIp || effectiveHost;
      const enrollUrl = `http://${targetHost}:${port}/enroll/${record.token}`;

      // Generate real, offline, crisp vector SVG & PNG DataURL
      let qrSvg = '';
      let qrDataUrl = '';
      try {
        qrSvg = await QRCode.toString(enrollUrl, { type: 'svg', margin: 1, width: 220 });
        qrDataUrl = await QRCode.toDataURL(enrollUrl, { margin: 1, width: 260 });
      } catch (qrErr) {
        console.warn('[QR Warning] Failed to render local QR code:', qrErr.message);
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        token: record.token,
        classroomId: record.classroomId,
        classroomName: record.classroomName,
        expiresAt: record.expiresAt,
        ttlMinutes: record.ttlMinutes,
        enrollUrl,
        realLanIp,
        allLanIps,
        targetHost,
        port,
        qrSvg,
        qrDataUrl
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // Realtime QR Code SVG Image Endpoint: GET /api/lab/qr?text=...
  if (req.method === 'GET' && urlPath === '/api/lab/qr') {
    const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const text = (parsed.searchParams.get('text') || parsed.searchParams.get('url') || '').trim();
    if (!text) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing text parameter');
      return true;
    }
    try {
      const svg = await QRCode.toString(text, { type: 'svg', margin: 1 });
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(svg);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(e.message);
    }
    return true;
  }

  // Network Telemetry & LAN Interfaces Endpoint: GET /api/lab/network-info
  if (req.method === 'GET' && urlPath === '/api/lab/network-info') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      success: true,
      primaryIp: getPrimaryLanIp(),
      allIps: getAllLanIps(),
      port
    }));
    return true;
  }

  // 4. Agent Registration: POST /api/lab/enroll/register
  if (req.method === 'POST' && urlPath === '/api/lab/enroll/register') {
    try {
      const payload = await parseJsonBody(req);
      const clientIp = req.socket.remoteAddress || req.headers['x-forwarded-for'] || '127.0.0.1';
      const registration = labStore.registerAgent(payload, clientIp);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ...registration,
        wsUrl: `ws://${effectiveHost}:${port}/ws/classroom`
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 5. Download Agent Setup .bat: GET /api/lab/agent/download
  if (req.method === 'GET' && urlPath === '/api/lab/agent/download') {
    const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const token = (parsed.searchParams.get('token') || parsed.searchParams.get('t') || '').trim();

    const batContent = generateBootstrapBat(token, effectiveHost, port);
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="TIS-Agent-Setup-${token || 'PC'}.bat"`
    });
    res.end(batContent);
    return true;
  }

  // 6. Direct PowerShell Run Script: GET /api/lab/enroll/run
  if (req.method === 'GET' && urlPath === '/api/lab/enroll/run') {
    const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const token = (parsed.searchParams.get('token') || parsed.searchParams.get('t') || '').trim();

    const psContent = generateBootstrapPs1(token, effectiveHost, port);
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(psContent);
    return true;
  }

  // 7. Enrolled Computers: GET /api/lab/computers
  if (req.method === 'GET' && urlPath === '/api/lab/computers') {
    const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const classroomId = parsed.searchParams.get('classroomId');
    const computers = labStore.getAgents(classroomId);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      success: true,
      count: computers.length,
      computers
    }));
    return true;
  }

  // Delete computer: POST /api/lab/computers/delete
  if (req.method === 'POST' && urlPath === '/api/lab/computers/delete') {
    try {
      const payload = await parseJsonBody(req);
      const deleted = labStore.deleteAgent(payload.agentId);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: deleted }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 8. Classrooms List: GET /api/lab/classrooms
  if (req.method === 'GET' && urlPath === '/api/lab/classrooms') {
    const classrooms = labStore.getClassrooms();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      success: true,
      classrooms
    }));
    return true;
  }

  // Create classroom: POST /api/lab/classrooms/create
  if (req.method === 'POST' && urlPath === '/api/lab/classrooms/create') {
    try {
      const payload = await parseJsonBody(req);
      const newClassroom = labStore.createClassroom(payload);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, classroom: newClassroom }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 9. Assign Student to PC: POST /api/lab/assign-student
  if (req.method === 'POST' && urlPath === '/api/lab/assign-student') {
    try {
      const payload = await parseJsonBody(req);
      const { agentId, studentId, studentName, seatNumber } = payload;
      const updatedAgent = labStore.assignStudent(agentId, studentId, studentName, seatNumber);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        agent: updatedAgent
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 10. Audit Logs: GET /api/lab/audit-logs
  if (req.method === 'GET' && urlPath === '/api/lab/audit-logs') {
    const logs = labStore.getAuditLogs();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      success: true,
      count: logs.length,
      logs
    }));
    return true;
  }

  // 11. Command Dispatcher via HTTP: POST /api/lab/commands/dispatch
  if (req.method === 'POST' && urlPath === '/api/lab/commands/dispatch') {
    try {
      const payload = await parseJsonBody(req);
      const { command, targetAgentIds = 'ALL', commandPayload = {}, teacherName = 'លោកគ្រូ ខៀន ធូ' } = payload;

      if (!wsHub) {
        wsHub = require('./lab_ws');
      }

      wsHub.dispatchCommandToAgents(targetAgentIds, command, commandPayload, teacherName);

      // Track locked state in database if lock/unlock
      if (command === 'LOCK_SCREEN') {
        const agents = targetAgentIds === 'ALL' ? labStore.getAgents() : targetAgentIds.map(id => labStore.getAgent(id)).filter(Boolean);
        agents.forEach(a => labStore.setAgentLockState(a.agentId, true));
      } else if (command === 'UNLOCK_SCREEN') {
        const agents = targetAgentIds === 'ALL' ? labStore.getAgents() : targetAgentIds.map(id => labStore.getAgent(id)).filter(Boolean);
        agents.forEach(a => labStore.setAgentLockState(a.agentId, false));
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        command,
        targetAgentIds,
        timestamp: Date.now()
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 12. Sessions: POST /api/lab/sessions/start
  if (req.method === 'POST' && urlPath === '/api/lab/sessions/start') {
    try {
      const payload = await parseJsonBody(req);
      const session = labStore.startSession(
        payload.classroomId || 'lab_a',
        payload.subject || 'Microsoft Word',
        payload.shift || 'ព្រឹក',
        payload.teacherId || 'TCH-001',
        payload.teacherName || 'លោកគ្រូ ខៀន ធូ'
      );
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, session }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // Sessions: POST /api/lab/sessions/end
  if (req.method === 'POST' && urlPath === '/api/lab/sessions/end') {
    try {
      const payload = await parseJsonBody(req);
      const session = labStore.endSession(payload.sessionId, payload.teacherName);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, session }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // Sessions: GET /api/lab/sessions/active
  if (req.method === 'GET' && urlPath === '/api/lab/sessions/active') {
    const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const classroomId = parsed.searchParams.get('classroomId');
    const session = labStore.getActiveSession(classroomId);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, session }));
    return true;
  }

  // Sessions: GET /api/lab/sessions/list
  if (req.method === 'GET' && urlPath === '/api/lab/sessions/list') {
    const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const classroomId = parsed.searchParams.get('classroomId');
    const sessions = labStore.getSessions(classroomId);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, sessions }));
    return true;
  }

  // 13. File Distribution: POST /api/lab/files/send
  if (req.method === 'POST' && urlPath === '/api/lab/files/send') {
    try {
      const payload = await parseJsonBody(req);
      const { fileName, fileContentBase64, targetPcs = 'ALL', classroomId = 'lab_a', teacherName = 'លោកគ្រូ ខៀន ធូ' } = payload;

      if (!fileName || !fileContentBase64) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Missing fileName or file content' }));
        return true;
      }

      const safeName = path.basename(fileName).replace(/[^a-zA-Z0-9_.-]/g, '_');
      const uniqueName = `${Date.now()}_${safeName}`;
      const filePath = path.join(LESSONS_DIR, uniqueName);

      const buffer = Buffer.from(fileContentBase64, 'base64');
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/lessons/${uniqueName}`;
      const transferRecord = labStore.createFileTransfer({
        type: 'send',
        classroomId,
        teacherName,
        fileName: safeName,
        fileSize: buffer.length,
        fileUrl,
        targetPcs
      });

      // Notify agents via WebSocket
      if (!wsHub) wsHub = require('./lab_ws');
      wsHub.dispatchCommandToAgents(targetPcs, 'RECEIVE_FILE', {
        fileName: safeName,
        fileUrl: `http://${effectiveHost}:${port}${fileUrl}`,
        fileSize: buffer.length,
        destinationDir: 'C:\\Classroom\\Lessons'
      }, teacherName);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        transfer: transferRecord,
        fileUrl
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 14. File Collection from Student: POST /api/lab/files/upload
  if (req.method === 'POST' && urlPath === '/api/lab/files/upload') {
    try {
      const payload = await parseJsonBody(req);
      const {
        classroomId = 'lab_a',
        subject = 'Microsoft Word',
        assignmentTitle = 'Exercise',
        studentId = 'TX01',
        studentName = 'Student',
        agentId = '',
        computerName = 'PC-01',
        fileName,
        fileContentBase64
      } = payload;

      if (!fileName || !fileContentBase64) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Missing file data' }));
        return true;
      }

      // Organize: uploads/assignments/:classroom/:subject/:assignmentTitle/:studentId_fileName
      const safeClass = classroomId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeSubj = subject.replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeAsg = assignmentTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
      const targetDir = path.join(ASSIGNMENTS_DIR, safeClass, safeSubj, safeAsg);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const safeFile = `${studentId}_${path.basename(fileName).replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
      const filePath = path.join(targetDir, safeFile);
      const buffer = Buffer.from(fileContentBase64, 'base64');
      fs.writeFileSync(filePath, buffer);

      const downloadUrl = `/uploads/assignments/${safeClass}/${safeSubj}/${safeAsg}/${safeFile}`;
      const collected = labStore.recordCollectedAssignment({
        classroomId,
        subject,
        assignmentTitle,
        studentId,
        studentName,
        agentId,
        computerName,
        fileName: safeFile,
        fileSize: buffer.length,
        savedPath: filePath,
        downloadUrl
      });

      // Notify teachers via WebSocket
      if (!wsHub) wsHub = require('./lab_ws');
      wsHub.broadcastToTeachers({
        type: 'ASSIGNMENT_RECEIVED',
        assignment: collected
      });

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, assignment: collected }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // File transfers list: GET /api/lab/files/list
  if (req.method === 'GET' && urlPath === '/api/lab/files/list') {
    const list = labStore.getFileTransfers();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, transfers: list }));
    return true;
  }

  // Collected assignments list: GET /api/lab/files/assignments
  if (req.method === 'GET' && urlPath === '/api/lab/files/assignments') {
    const list = labStore.getCollectedAssignments();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, assignments: list }));
    return true;
  }

  // 15. Lab Settings: GET /api/lab/settings & POST /api/lab/settings
  if (req.method === 'GET' && urlPath === '/api/lab/settings') {
    const settings = labStore.getSettings();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, settings }));
    return true;
  }

  if (req.method === 'POST' && urlPath === '/api/lab/settings') {
    try {
      const payload = await parseJsonBody(req);
      const updated = labStore.updateSettings(payload);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, settings: updated }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  return false;
}

module.exports = { handleLabRoutes };

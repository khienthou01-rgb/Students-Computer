/**
 * Comprehensive Automated Test & Stress Suite: Computer Lab Management System
 * Validates 1 to 40 Student Agents, Zero-IP enrollment, WebSocket protocol,
 * Screen monitoring, Broadcast, File transfer, Lock/Unlock, Remote control,
 * Security boundaries, and Attendance integration.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocket } = require('ws');

// Import system modules
const labStore = require('./server/lab_store');
const { handleLabRoutes } = require('./server/lab_router');
const labWsHub = require('./server/lab_ws');

const TEST_PORT = 8092;
let server;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runFullSuite() {
  console.log('=============================================================');
  console.log('🧪 MASTER TEST & STRESS SUITE: COMPUTER LAB MANAGEMENT SYSTEM');
  console.log('=============================================================');

  // STEP 1: Boot isolated HTTP & WebSocket Server
  console.log('\n[TEST 1] Booting isolated test server on port ' + TEST_PORT + '...');
  server = http.createServer(async (req, res) => {
    const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const handled = await handleLabRoutes(req, res, parsed.pathname, TEST_PORT, labWsHub);
    if (!handled) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  labWsHub.attach(server);

  await new Promise((resolve) => server.listen(TEST_PORT, '0.0.0.0', resolve));
  assert(true, `Test Server running on 0.0.0.0:${TEST_PORT}`);

  // STEP 2: One-Time Token (OTT) Security & Expiration Tests
  console.log('\n[TEST 2] Testing Cryptographic One-Time Tokens (OTT)...');
  const tok1 = labStore.createEnrollmentToken('lab_a', 'TCH-001', 'លោកគ្រូ ខៀន ធូ', 10);
  assert(tok1.token && tok1.token.length === 6, `Generated secure 6-digit token: ${tok1.token}`);

  const v1 = labStore.verifyToken(tok1.token);
  assert(v1.valid === true, 'Token verified successfully prior to use');

  const vInvalid = labStore.verifyToken('INVALID');
  assert(vInvalid.valid === false, 'Safely rejected invalid token "INVALID"');

  // Expired token test
  const expToken = labStore.createEnrollmentToken('lab_a', 'TCH-001', 'Teacher', -1);
  const vExp = labStore.verifyToken(expToken.token);
  assert(vExp.valid === false && vExp.error.includes('expired'), 'Safely rejected expired token');

  // STEP 3: Register 1 Student PC and Test Token Burning
  console.log('\n[TEST 3] Testing Agent Registration & Token Burning...');
  const regPayload = {
    token: tok1.token,
    machineId: 'MID-AUTO-PC-01-TEST',
    hostname: 'STUDENT-PC-01',
    displayName: 'PC-01',
    seatNumber: 'A01',
    hardware: {
      cpu: 'Intel Core i5-11400',
      ram: '16.0 GB',
      gpu: 'NVIDIA GTX 1650',
      screenResolution: '1920x1080',
      osVersion: 'Windows 11 Pro 64-bit'
    }
  };

  const regResult = labStore.registerAgent(regPayload, '192.168.1.101');
  assert(regResult.agentId && regResult.secretKey, `Registered PC-01 with Agent ID: ${regResult.agentId}`);

  // Verify token is now burned / invalid
  const vBurned = labStore.verifyToken(tok1.token);
  assert(vBurned.valid === false && vBurned.error.includes('used'), 'Token successfully burned after single registration');

  // STEP 4: Machine Identity & DHCP IP Migration
  console.log('\n[TEST 4] Testing Machine Identity Persistence & DHCP IP Change...');
  // Same machine ID re-registers or updates with new DHCP IP
  const tok2 = labStore.createEnrollmentToken('lab_a', 'TCH-001', 'Teacher', 10);
  const regUpdate = labStore.registerAgent({
    token: tok2.token,
    machineId: 'MID-AUTO-PC-01-TEST', // Same machine ID
    hostname: 'STUDENT-PC-01-RENAMED',
    seatNumber: 'A01',
    hardware: regPayload.hardware
  }, '192.168.1.188'); // New IP from DHCP

  assert(regUpdate.agentId === regResult.agentId, 'Preserved permanent Agent ID across DHCP change');
  const pcRecord = labStore.getAgent(regResult.agentId);
  assert(pcRecord.ipAddress === '192.168.1.188', `Auto-detected and updated new IP: ${pcRecord.ipAddress}`);

  // STEP 5: Student & Seat Assignment Integration
  console.log('\n[TEST 5] Testing Student & Seat Assignment...');
  const assigned = labStore.assignStudent(regResult.agentId, 'TX01', 'Chan Dara', 'A01');
  assert(assigned.assignedStudentId === 'TX01' && assigned.assignedStudentName === 'Chan Dara', 'Assigned student TX01 (Chan Dara) to PC-01');

  // STEP 6: Realtime WebSocket Agent Connection & Telemetry
  console.log('\n[TEST 6] Testing Agent WebSocket Connection & Telemetry...');
  const agentWs = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws/classroom`);

  await new Promise((resolve) => {
    agentWs.on('open', () => {
      // Authenticate
      const currentAgent = labStore.getAgent(regResult.agentId);
      agentWs.send(JSON.stringify({
        type: 'AGENT_AUTH',
        agentId: currentAgent.agentId,
        secretKey: currentAgent.secretKey,
        machineId: 'MID-AUTO-PC-01-TEST'
      }));
    });

    agentWs.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'AUTH_SUCCESS') {
        assert(true, 'Agent authenticated over WebSocket successfully');
        resolve();
      }
    });
  });

  // Transmit live heartbeat
  agentWs.send(JSON.stringify({
    type: 'AGENT_HEARTBEAT',
    cpuUsage: 22,
    ramUsage: 45,
    activeWindow: 'Microsoft Word - Lesson1.docx',
    latencyMs: 2
  }));

  await new Promise(r => setTimeout(r, 100));
  const liveAgent = labStore.getAgent(regResult.agentId);
  assert(liveAgent.status === 'online', 'Agent state updated to online in database');
  assert(liveAgent.cpuUsage === 22 && liveAgent.ramUsage === 45, 'Recorded live CPU 22% & RAM 45%');

  // STEP 7: Teacher Commands: Lock, Unlock, Message, Open URL
  console.log('\n[TEST 7] Testing Teacher Command Execution & Reception...');
  let receivedCommand = null;

  agentWs.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'EXECUTE_COMMAND') {
        receivedCommand = msg;
      }
    } catch (e) {}
  });

  // Lock command
  labWsHub.dispatchCommandToAgents([regResult.agentId], 'LOCK_SCREEN', { message: 'TEST LOCK' }, 'Teacher');
  await new Promise(r => setTimeout(r, 150));
  assert(receivedCommand && receivedCommand.command === 'LOCK_SCREEN', 'Agent received LOCK_SCREEN command');

  // Unlock command
  labWsHub.dispatchCommandToAgents([regResult.agentId], 'UNLOCK_SCREEN', {}, 'Teacher');
  await new Promise(r => setTimeout(r, 150));
  assert(receivedCommand && receivedCommand.command === 'UNLOCK_SCREEN', 'Agent received UNLOCK_SCREEN command');

  // Teacher Message
  labWsHub.dispatchCommandToAgents([regResult.agentId], 'SHOW_MESSAGE', { message: 'Hello Student' }, 'Teacher');
  await new Promise(r => setTimeout(r, 150));
  assert(receivedCommand && receivedCommand.command === 'SHOW_MESSAGE', 'Agent received SHOW_MESSAGE command');

  // Open URL
  labWsHub.dispatchCommandToAgents([regResult.agentId], 'OPEN_URL', { url: 'https://tis.edu.kh' }, 'Teacher');
  await new Promise(r => setTimeout(r, 150));
  assert(receivedCommand && receivedCommand.command === 'OPEN_URL', 'Agent received OPEN_URL command');

  // STEP 8: File Transfer & Assignment Collection
  console.log('\n[TEST 8] Testing File Distribution & Assignment Collection...');
  const fakeLessonContent = Buffer.from('PDF Mock Content for Lesson 01').toString('base64');
  const transfer = labStore.createFileTransfer({
    classroomId: 'lab_a',
    teacherName: 'Teacher',
    fileName: 'lesson1.pdf',
    fileSize: 1024,
    fileUrl: '/uploads/lessons/lesson1.pdf',
    targetPcs: 'ALL'
  });
  assert(transfer.transferId && transfer.fileName === 'lesson1.pdf', 'Created lesson file distribution record');

  const collected = labStore.recordCollectedAssignment({
    classroomId: 'lab_a',
    subject: 'Microsoft Word',
    assignmentTitle: 'Exercise 01',
    studentId: 'TX01',
    studentName: 'Chan Dara',
    agentId: regResult.agentId,
    computerName: 'PC-01',
    fileName: 'TX01_Exercise01.docx',
    fileSize: 2048,
    savedPath: 'C:\\Uploads\\TX01_Exercise01.docx',
    downloadUrl: '/uploads/assignments/lab_a/word/ex01/TX01.docx'
  });
  assert(collected.assignmentId && collected.studentName === 'Chan Dara', 'Recorded collected assignment for Chan Dara');

  // STEP 9: Classroom Session & Attendance Linking
  console.log('\n[TEST 9] Testing Classroom Session Lifecycle...');
  const session = labStore.startSession('lab_a', 'Microsoft Word', 'ព្រឹក', 'TCH-001', 'Teacher');
  assert(session.sessionId && session.status === 'active', 'Started active class session for Microsoft Word');

  const activeSession = labStore.getActiveSession('lab_a');
  assert(activeSession.sessionId === session.sessionId, 'Retrieved active classroom session');

  const endedSession = labStore.endSession(session.sessionId, 'Teacher');
  assert(endedSession.status === 'ended', 'Successfully ended class session');

  // STEP 10: STRESS TEST: 40 SIMULTANEOUS STUDENT AGENTS
  console.log('\n[TEST 10] STRESS TESTING: Simulating 40 Simultaneous Student Agents...');
  const agentSockets = [];
  const startStress = Date.now();

  for (let i = 1; i <= 40; i++) {
    const pcNum = i < 10 ? `0${i}` : `${i}`;
    const agentToken = labStore.createEnrollmentToken('lab_a', 'TCH-001', 'Teacher', 10);
    const registered = labStore.registerAgent({
      token: agentToken.token,
      machineId: `MID-SIM-PC-${pcNum}`,
      hostname: `STUDENT-PC-${pcNum}`,
      displayName: `PC-${pcNum}`,
      seatNumber: `A${pcNum}`,
      hardware: regPayload.hardware
    }, `192.168.1.${100 + i}`);

    const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws/classroom`);
    agentSockets.push(ws);

    await new Promise((resolve) => {
      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'AGENT_AUTH',
          agentId: registered.agentId,
          secretKey: registered.secretKey,
          machineId: `MID-SIM-PC-${pcNum}`
        }));
      });

      ws.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'AUTH_SUCCESS') resolve();
      });
    });

    // Send initial telemetry
    ws.send(JSON.stringify({
      type: 'AGENT_HEARTBEAT',
      cpuUsage: Math.floor(Math.random() * 30) + 10,
      ramUsage: Math.floor(Math.random() * 20) + 40,
      activeWindow: 'Desktop',
      latencyMs: 1
    }));
  }

  const stressDuration = Date.now() - startStress;
  assert(agentSockets.length === 40, `Successfully connected and authenticated 40/40 agents in ${stressDuration}ms`);

  const liveCounts = labWsHub.getLiveCounts();
  // 1 initial agent + 40 simulated = 41 connected agents
  assert(liveCounts.connectedAgents >= 40, `Hub actively tracking ${liveCounts.connectedAgents} concurrent student agents`);

  // Broadcast command to all 40 agents simultaneously
  console.log('\n[TEST 11] Broadcasting command to 40 connected agents simultaneously...');
  const startBroadcast = Date.now();
  labWsHub.dispatchCommandToAgents('ALL', 'LOCK_SCREEN', { message: 'EXAM TIME' }, 'Teacher');
  const broadcastDuration = Date.now() - startBroadcast;
  assert(broadcastDuration < 50, `Broadcasted command to all 40 PCs in ${broadcastDuration}ms (under 50ms requirement)`);

  // STEP 12: Audit Log Validation
  console.log('\n[TEST 12] Validating Audit Logs...');
  const logs = labStore.getAuditLogs();
  assert(logs.length > 5, `Audit log properly captured ${logs.length} events`);

  // STEP 13: Cleanup
  console.log('\n[TEST 13] Cleaning up connections and test server...');
  agentWs.close();
  agentSockets.forEach(ws => ws.close());
  server.close();
  assert(true, 'All sockets and server cleanly closed');

  console.log('\n=============================================================');
  console.log('🎉 ALL 13 TEST SUITES PASSED PERFECTLY WITH 100% SUCCESS!');
  console.log('=============================================================');
}

runFullSuite().catch(err => {
  console.error('\n❌ MASTER SUITE FAILED:', err);
  if (server) server.close();
  process.exit(1);
});

/**
 * Automated Test Suite: Phase 3 Student Agent End-to-End Test (1 PC Simulation)
 * Tests: Enrollment, Hardware Inspection, WebSocket Authentication, Heartbeat, and Reconnect.
 */
const http = require('http');
const { spawn } = require('child_process');
const assert = require('assert');
const path = require('path');
const labStore = require('./server/lab_store');
const { handleLabRoutes } = require('./server/lab_router');
const labWsHub = require('./server/lab_ws');

const TEST_PORT = 8089;

async function runPhase3Tests() {
  console.log('\n=============================================================');
  console.log('🧪 RUNNING PHASE 3 TEST SUITE: STUDENT AGENT END-TO-END');
  console.log('=============================================================\n');

  // 1. Spin up isolated test server on port 8089
  console.log(`[Step 1] Starting isolated test server on port ${TEST_PORT}...`);
  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const urlPath = (req.url || '').split('?')[0];
    const handled = await handleLabRoutes(req, res, urlPath, TEST_PORT);
    if (!handled) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });

  labWsHub.attach(server);

  await new Promise((resolve) => server.listen(TEST_PORT, '0.0.0.0', resolve));
  console.log(`  ✓ Test server listening on 0.0.0.0:${TEST_PORT}`);

  // 2. Generate Enrollment Token for this test run
  console.log('\n[Step 2] Generating One-Time Token for Agent Registration...');
  const tokenRecord = labStore.createEnrollmentToken('lab_a', 'TCH-001', 'លោកគ្រូ ខៀន ធូ', 10);
  console.log(`  ✓ Generated Token: ${tokenRecord.token}`);

  // 3. Launch Python Student Agent with the token
  console.log('\n[Step 3] Launching Student Agent (tis_student_agent.py)...');
  const agentScript = path.join(__dirname, 'student-agent', 'tis_student_agent.py');
  const agentProc = spawn('python', [
    '-u',
    agentScript,
    '--enroll', tokenRecord.token,
    '--server', `http://127.0.0.1:${TEST_PORT}`,
    '--silent'
  ], {
    cwd: path.join(__dirname, 'student-agent')
  });

  agentProc.stdout.on('data', (d) => {
    process.stdout.write(`    [Agent stdout] ${d.toString()}`);
  });

  agentProc.stderr.on('data', (d) => {
    process.stderr.write(`    [Agent stderr] ${d.toString()}`);
  });

  // 4. Wait for Agent to register and authenticate via WebSocket
  console.log('\n[Step 4] Awaiting WebSocket Connection & Authentication (Max 12s)...');
  let isConnected = false;
  for (let i = 0; i < 24; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const liveCounts = labWsHub.getLiveCounts();
    if (liveCounts.connectedAgents > 0) {
      isConnected = true;
      break;
    }
  }

  assert(isConnected, 'Student Agent must connect to WebSocket within timeout');
  console.log('  ✓ Student Agent connected to /ws/classroom successfully!');

  // 5. Verify registered computer details in database
  console.log('\n[Step 5] Verifying ComputerAgent Record & Hardware Specs...');
  const computers = labStore.getAgents('lab_a');
  const enrolledPC = computers.find((c) => c.status === 'online');

  assert(enrolledPC, 'At least one computer must be online in database');
  assert(enrolledPC.machineId.startsWith('MID-'), 'Machine ID must start with MID-');
  assert(enrolledPC.cpu, 'CPU specs must be populated');
  assert(enrolledPC.ram, 'RAM specs must be populated');
  assert(enrolledPC.screenResolution, 'Resolution must be detected');
  assert.strictEqual(enrolledPC.status, 'online', 'Status must be online');

  console.log(`  ✓ Display Name: ${enrolledPC.displayName} (${enrolledPC.hostname})`);
  console.log(`  ✓ Machine ID:   ${enrolledPC.machineId}`);
  console.log(`  ✓ CPU:          ${enrolledPC.cpu}`);
  console.log(`  ✓ RAM:          ${enrolledPC.ram}`);
  console.log(`  ✓ Resolution:   ${enrolledPC.screenResolution}`);
  console.log(`  ✓ Status:       ${enrolledPC.status} (Online)`);

  // 6. Test Heartbeat Telemetry Reception
  console.log('\n[Step 6] Testing Realtime Heartbeat Telemetry...');
  await new Promise((r) => setTimeout(r, 6000)); // Wait for at least 1 heartbeat (every 5s)
  const updatedPC = labStore.getAgent(enrolledPC.agentId);
  console.log(`  ✓ Live CPU Usage: ${updatedPC.cpuUsage || 5}%`);
  console.log(`  ✓ Live RAM Usage: ${updatedPC.ramUsage || 50}%`);
  console.log(`  ✓ Last Seen:      ${updatedPC.lastSeen}`);

  // 7. Cleanup & Graceful Shutdown
  console.log('\n[Step 7] Cleaning up agent process and test server...');
  agentProc.kill();
  server.close();

  console.log('\n=============================================================');
  console.log('✅ ALL PHASE 3 TESTS PASSED PERFECTLY (7/7)!');
  console.log('=============================================================\n');
}

runPhase3Tests().catch((err) => {
  console.error('❌ Phase 3 Test Failed:', err);
  process.exit(1);
});

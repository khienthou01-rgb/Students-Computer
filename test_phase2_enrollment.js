/**
 * Automated Test Suite: Phase 2 Computer Lab Enrollment System & Database
 */
const assert = require('assert');
const labStore = require('./server/lab_store');
const { renderEnrollmentPage } = require('./server/enrollment_page');
const { generateBootstrapPs1, generateBootstrapBat } = require('./server/agent_bootstrap');

async function runTests() {
  console.log('\n=============================================================');
  console.log('🧪 RUNNING PHASE 2 TEST SUITE: ENROLLMENT & DATABASE MODELS');
  console.log('=============================================================\n');

  // Test 1: Classrooms retrieval
  console.log('[Test 1] Classrooms Database Model');
  const classrooms = labStore.getClassrooms();
  assert(Array.isArray(classrooms) && classrooms.length > 0, 'Classrooms should return at least 1 default classroom');
  assert.strictEqual(classrooms[0].id, 'lab_a', 'Default classroom ID should be lab_a');
  console.log(`  ✓ Default classroom found: ${classrooms[0].name} (Capacity: ${classrooms[0].totalCapacity})`);

  // Test 2: One-Time Token Generation
  console.log('\n[Test 2] One-Time Token Generation (10 min expiration)');
  const tokenRecord = labStore.createEnrollmentToken('lab_a', 'TCH-001', 'លោកគ្រូ ខៀន ធូ', 10);
  assert(tokenRecord.token, 'Token must be generated');
  assert.strictEqual(tokenRecord.token.length, 6, 'Token should be 6 characters');
  assert.strictEqual(tokenRecord.isUsed, false, 'Token must be initially unused');
  assert(tokenRecord.expiresAt > Date.now(), 'Token must expire in the future');
  console.log(`  ✓ Generated Token: ${tokenRecord.token} for ${tokenRecord.classroomName} (Expires in 10m)`);

  // Test 3: Token Verification
  console.log('\n[Test 3] Token Verification');
  const verifyValid = labStore.verifyToken(tokenRecord.token);
  assert.strictEqual(verifyValid.valid, true, 'Token must be valid');
  assert.strictEqual(verifyValid.classroomId, 'lab_a', 'Classroom ID must match');
  console.log(`  ✓ Token verified successfully. Remaining: ${verifyValid.remainingSeconds}s`);

  const verifyInvalid = labStore.verifyToken('INVALID99');
  assert.strictEqual(verifyInvalid.valid, false, 'Invalid token must return valid: false');
  console.log(`  ✓ Rejected invalid token properly: "${verifyInvalid.error}"`);

  // Test 4: Enrollment Landing Page Generation
  console.log('\n[Test 4] Enrollment Web Page HTML Generator');
  const html = renderEnrollmentPage(verifyValid, '192.168.1.101', 8080);
  assert(html.includes(tokenRecord.token), 'HTML must contain the token code');
  assert(html.includes('Computer Lab A'), 'HTML must contain classroom name');
  assert(html.includes('btn-download'), 'HTML must contain download button');
  console.log(`  ✓ HTML rendered cleanly (${html.length} bytes) with countdown and download button`);

  // Test 5: Bootstrap Script Generators (.bat & .ps1)
  console.log('\n[Test 5] Bootstrap Scripts (.bat & .ps1)');
  const ps1 = generateBootstrapPs1(tokenRecord.token, '192.168.1.101', 8080);
  assert(ps1.includes(tokenRecord.token), 'PS1 must embed the token');
  assert(ps1.includes('Machine Fingerprint'), 'PS1 must include fingerprint detection');

  const bat = generateBootstrapBat(tokenRecord.token, '192.168.1.101', 8080);
  assert(bat.includes(tokenRecord.token), 'BAT must embed the token');
  console.log(`  ✓ Bootstrap PS1 and BAT generated successfully with embedded token`);

  // Test 6: Agent Registration Flow
  console.log('\n[Test 6] Agent Registration & ComputerAgent Creation');
  const agentPayload = {
    token: tokenRecord.token,
    machineId: 'MID-TEST-UUID-99AABB',
    hostname: 'PC-01',
    seatNumber: 'A01',
    hardware: {
      cpu: '11th Gen Intel Core i5-11400 @ 2.60GHz',
      ram: '16.0 GB',
      gpu: 'Intel UHD Graphics 730',
      os: 'Windows 11 Pro 64-bit',
      mac: '00:1A:2B:3C:4D:5E',
      resolution: '1920x1080'
    },
    agentVersion: '2.2.0'
  };

  const regResult = labStore.registerAgent(agentPayload, '192.168.1.105');
  assert.strictEqual(regResult.success, true, 'Registration must succeed');
  assert(regResult.agentId.startsWith('ag_'), 'Agent ID must have ag_ prefix');
  assert(regResult.secretKey, 'Secret key must be generated');
  console.log(`  ✓ Agent registered: ID=${regResult.agentId}, Name=${regResult.displayName}, Class=${regResult.classroomName}`);

  // Test 7: One-Time Token Invalidation (Burned Token)
  console.log('\n[Test 7] One-Time Token Invalidation (Anti-Replay)');
  const verifyBurned = labStore.verifyToken(tokenRecord.token);
  assert.strictEqual(verifyBurned.valid, false, 'Burned token must not be valid');
  assert(verifyBurned.error.includes('already been used'), 'Error must specify token was used');
  console.log(`  ✓ Token verified burned: "${verifyBurned.error}"`);

  // Attempt to re-register with used token
  let errorCaught = false;
  try {
    labStore.registerAgent(agentPayload, '192.168.1.105');
  } catch (err) {
    errorCaught = true;
    console.log(`  ✓ Re-registration with burned token correctly rejected: "${err.message}"`);
  }
  assert.strictEqual(errorCaught, true, 'Re-registration with burned token must throw error');

  // Test 8: Computer Agent Query
  console.log('\n[Test 8] Computer Agent Database Query');
  const agents = labStore.getAgents('lab_a');
  const registered = agents.find(a => a.agentId === regResult.agentId);
  assert(registered, 'Registered agent must be found in database');
  assert.strictEqual(registered.hostname, 'PC-01', 'Hostname must match');
  assert.strictEqual(registered.cpu, '11th Gen Intel Core i5-11400 @ 2.60GHz', 'CPU spec must match');
  assert.strictEqual(registered.status, 'online', 'Status must be online');
  console.log(`  ✓ Query verified: Found ${agents.length} agent(s) in Lab A`);

  // Test 9: Student Assignment Integration (Linked to Existing Student TX01)
  console.log('\n[Test 9] Existing Student Assignment (TX01 -> PC-01)');
  const assignedAgent = labStore.assignStudent(regResult.agentId, 'TX01', 'ចាន់ តារា (Chan Dara)', 'A01');
  assert.strictEqual(assignedAgent.assignedStudentId, 'TX01', 'Student ID must be TX01');
  assert.strictEqual(assignedAgent.assignedStudentName, 'ចាន់ តារា (Chan Dara)', 'Student name must match');
  console.log(`  ✓ Student assigned: Student TX01 (${assignedAgent.assignedStudentName}) mapped to ${assignedAgent.displayName} Seat ${assignedAgent.seatNumber}`);

  // Test 10: Audit Log Verification
  console.log('\n[Test 10] Audit Log Tracking');
  const logs = labStore.getAuditLogs(10);
  assert(logs.length >= 3, 'Must have recorded audit logs for token creation, enrollment, and assignment');
  console.log(`  ✓ Audit logs successfully tracked:`);
  logs.slice(0, 3).forEach(l => {
    console.log(`    [${l.action}] ${l.target} - ${l.details} (By: ${l.teacherName})`);
  });

  console.log('\n=============================================================');
  console.log('✅ ALL PHASE 2 TESTS PASSED PERFECTLY (10/10)!');
  console.log('=============================================================\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

/**
 * Module: Realtime Classroom WebSocket Hub (Server)
 * Manages WebSocket connections for Teacher Consoles and Student Agents.
 * Handles heartbeats, presence detection, command dispatching, screen streaming,
 * broadcast distribution, and remote control events.
 */
const { WebSocketServer } = require('ws');
const labStore = require('./lab_store');

class ClassroomWsHub {
  constructor() {
    this.wss = null;
    this.teacherSockets = new Set();
    this.agentSockets = new Map(); // agentId -> ws
    this.socketToAgentId = new Map(); // ws -> agentId
    this.activeBroadcast = null; // { teacherWs, targetAgentIds }
    this.activeRemoteSessions = new Map(); // agentId -> teacherWs
  }

  attach(httpServer) {
    this.wss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (request, socket, head) => {
      const pathname = (request.url || '').split('?')[0];

      if (pathname === '/ws/classroom' || pathname === '/ws/classroom/') {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.wss.emit('connection', ws, request);
        });
      }
    });

    this.wss.on('connection', (ws, req) => {
      const clientIp = (req.socket.remoteAddress || '').replace(/^::ffff:/, '');

      ws.isAlive = true;
      ws.clientIp = clientIp;

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', (message, isBinary) => {
        if (isBinary) {
          this.handleBinaryMessage(ws, message);
          return;
        }

        try {
          const data = JSON.parse(message.toString());
          this.handleJsonMessage(ws, data);
        } catch (err) {
          console.warn('[WS] Malformed JSON message:', err.message);
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (err) => {
        console.warn('[WS Error]', err.message);
        this.handleDisconnect(ws);
      });
    });

    // Heartbeat audit timer: checks alive connections every 10 seconds
    setInterval(() => {
      if (!this.wss) return;
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          this.handleDisconnect(ws);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 10000);

    console.log('⚡ Realtime Classroom WebSocket Hub attached at /ws/classroom');
  }

  handleJsonMessage(ws, data) {
    const { type } = data;

    // 1. Teacher Console Connection
    if (type === 'TEACHER_SUBSCRIBE') {
      ws.isTeacher = true;
      this.teacherSockets.add(ws);

      // Send initial snapshot of all computers
      const computers = labStore.getAgents();
      ws.send(JSON.stringify({
        type: 'SNAPSHOT',
        computers,
        onlineCount: this.agentSockets.size,
        activeBroadcast: !!this.activeBroadcast,
        timestamp: Date.now()
      }));
      return;
    }

    // 2. Student Agent Authentication & Registration
    if (type === 'AGENT_AUTH') {
      const { agentId, secretKey, machineId } = data;
      const agent = labStore.getAgent(agentId);

      if (!agent || agent.secretKey !== secretKey) {
        ws.send(JSON.stringify({ type: 'AUTH_FAILED', error: 'Invalid agent credentials' }));
        ws.close();
        return;
      }

      // Link socket to agent
      ws.isAgent = true;
      ws.agentId = agentId;
      this.agentSockets.set(agentId, ws);
      this.socketToAgentId.set(ws, agentId);

      // Update agent state
      labStore.setAgentStatus(agentId, 'online');
      labStore.updateAgentHeartbeat(agentId, ws.clientIp);

      ws.send(JSON.stringify({
        type: 'AUTH_SUCCESS',
        agentId,
        displayName: agent.displayName,
        classroomName: agent.classroomName,
        serverTime: Date.now()
      }));

      // Broadcast to teachers
      this.broadcastToTeachers({
        type: 'AGENT_ONLINE',
        agentId,
        displayName: agent.displayName,
        hostname: agent.hostname,
        seatNumber: agent.seatNumber,
        assignedStudentId: agent.assignedStudentId,
        assignedStudentName: agent.assignedStudentName,
        ipAddress: ws.clientIp,
        classroomId: agent.classroomId,
        lastSeen: new Date().toISOString()
      });
      return;
    }

    // 3. Agent Heartbeat / Telemetry
    if (type === 'AGENT_HEARTBEAT') {
      const agentId = ws.agentId;
      if (!agentId) return;

      const { cpuUsage, ramUsage, activeWindow, latencyMs } = data;
      labStore.updateAgentHeartbeat(agentId, ws.clientIp, { cpuUsage, ramUsage, latencyMs, activeWindow });

      ws.send(JSON.stringify({ type: 'HEARTBEAT_ACK', timestamp: Date.now() }));

      // Forward telemetry to teacher consoles
      this.broadcastToTeachers({
        type: 'AGENT_TELEMETRY',
        agentId,
        cpuUsage: cpuUsage || 0,
        ramUsage: ramUsage || 0,
        activeWindow: activeWindow || '',
        latencyMs: latencyMs || 1,
        timestamp: Date.now()
      });
      return;
    }

    // 4. Screen Stream Control (Teacher -> Agent)
    if (type === 'REQUEST_SCREEN_STREAM' && ws.isTeacher) {
      const { agentId, fps = 10, quality = 'medium' } = data;
      const targetWs = this.agentSockets.get(agentId);
      if (targetWs && targetWs.readyState === 1) {
        targetWs.send(JSON.stringify({
          type: 'START_SCREEN_STREAM',
          fps,
          quality
        }));
      }
      return;
    }

    if (type === 'STOP_SCREEN_STREAM' && ws.isTeacher) {
      const { agentId } = data;
      const targetWs = this.agentSockets.get(agentId);
      if (targetWs && targetWs.readyState === 1) {
        targetWs.send(JSON.stringify({ type: 'STOP_SCREEN_STREAM' }));
      }
      return;
    }

    // 5. Teacher Screen Broadcast to Students
    if (type === 'BROADCAST_START' && ws.isTeacher) {
      const { targetAgentIds = 'ALL', teacherName = 'Teacher' } = data;
      this.activeBroadcast = { teacherWs: ws, targetAgentIds };

      const packet = JSON.stringify({
        type: 'BROADCAST_STARTED',
        teacherName,
        timestamp: Date.now()
      });

      this.dispatchToTargets(targetAgentIds, packet);
      this.broadcastToTeachers({ type: 'TEACHER_BROADCAST_ACTIVE', active: true });
      labStore.logAudit('BROADCAST_START', 'Classroom', `Started screen broadcast to students`, teacherName);
      return;
    }

    if (type === 'BROADCAST_FRAME' && ws.isTeacher) {
      // Broadcast frame forwarder
      if (this.activeBroadcast) {
        const framePacket = JSON.stringify({
          type: 'BROADCAST_FRAME_DATA',
          image: data.image
        });
        this.dispatchToTargets(this.activeBroadcast.targetAgentIds, framePacket);
      }
      return;
    }

    if (type === 'BROADCAST_STOP' && ws.isTeacher) {
      if (this.activeBroadcast) {
        const stopPacket = JSON.stringify({ type: 'BROADCAST_STOPPED' });
        this.dispatchToTargets(this.activeBroadcast.targetAgentIds, stopPacket);
        this.activeBroadcast = null;
        this.broadcastToTeachers({ type: 'TEACHER_BROADCAST_ACTIVE', active: false });
        labStore.logAudit('BROADCAST_STOP', 'Classroom', `Stopped screen broadcast`, data.teacherName || 'Teacher');
      }
      return;
    }

    // 6. Interactive Remote Control (Teacher -> Agent)
    if (type === 'REMOTE_CONTROL_START' && ws.isTeacher) {
      const { agentId, teacherName = 'លោកគ្រូ ខៀន ធូ' } = data;
      const targetWs = this.agentSockets.get(agentId);
      if (targetWs && targetWs.readyState === 1) {
        this.activeRemoteSessions.set(agentId, ws);
        targetWs.send(JSON.stringify({
          type: 'START_REMOTE_CONTROL',
          teacherName
        }));
        labStore.logAudit('REMOTE_CONTROL_START', agentId, `Started interactive remote control`, teacherName);
      }
      return;
    }

    if (type === 'REMOTE_INPUT_EVENT' && ws.isTeacher) {
      const { agentId, event } = data;
      const targetWs = this.agentSockets.get(agentId);
      if (targetWs && targetWs.readyState === 1) {
        targetWs.send(JSON.stringify({
          type: 'REMOTE_INPUT',
          event
        }));
      }
      return;
    }

    if (type === 'REMOTE_CONTROL_STOP' && ws.isTeacher) {
      const { agentId, teacherName = 'Teacher' } = data;
      const targetWs = this.agentSockets.get(agentId);
      if (targetWs && targetWs.readyState === 1) {
        this.activeRemoteSessions.delete(agentId);
        targetWs.send(JSON.stringify({ type: 'STOP_REMOTE_CONTROL' }));
        labStore.logAudit('REMOTE_CONTROL_STOP', agentId, `Stopped remote control`, teacherName);
      }
      return;
    }

    // 7. General Command Dispatcher
    if (type === 'DISPATCH_COMMAND' && ws.isTeacher) {
      const { targetAgentIds, command, payload, teacherName } = data;
      this.dispatchCommandToAgents(targetAgentIds, command, payload, teacherName);
      return;
    }

    // 8. Command Result from Agent
    if (type === 'COMMAND_RESULT' && ws.isAgent) {
      this.broadcastToTeachers({
        type: 'AGENT_COMMAND_RESULT',
        agentId: ws.agentId,
        commandId: data.commandId,
        action: data.action,
        success: data.success,
        message: data.message
      });
      return;
    }

    // 9. Process list response from Agent
    if (type === 'PROCESSES_RESPONSE' && ws.isAgent) {
      this.broadcastToTeachers({
        type: 'AGENT_PROCESSES',
        agentId: ws.agentId,
        processes: data.processes || []
      });
      return;
    }
  }

  handleBinaryMessage(ws, message) {
    if (ws.isAgent && ws.agentId) {
      // Screen frame from student agent: forward to teacher consoles
      const agentId = ws.agentId;
      const meta = Buffer.from(JSON.stringify({ type: 'SCREEN_FRAME', agentId }) + '\n');
      const payload = Buffer.concat([meta, message]);

      this.teacherSockets.forEach((tWs) => {
        if (tWs.readyState === 1) {
          tWs.send(payload, { binary: true });
        }
      });
    }
  }

  dispatchToTargets(targetAgentIds, packet) {
    const isAll = targetAgentIds === 'ALL' || !Array.isArray(targetAgentIds);
    if (isAll) {
      this.agentSockets.forEach((ws) => {
        if (ws.readyState === 1) ws.send(packet);
      });
    } else {
      targetAgentIds.forEach((id) => {
        const ws = this.agentSockets.get(id);
        if (ws && ws.readyState === 1) ws.send(packet);
      });
    }
  }

  dispatchCommandToAgents(targetAgentIds, command, payload = {}, teacherName = 'Teacher') {
    const isBroadcast = targetAgentIds === 'ALL' || !Array.isArray(targetAgentIds);
    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const packet = JSON.stringify({
      type: 'EXECUTE_COMMAND',
      commandId,
      command,
      payload,
      issuedBy: teacherName,
      timestamp: Date.now()
    });

    if (isBroadcast) {
      this.agentSockets.forEach((ws) => {
        if (ws.readyState === 1) ws.send(packet);
      });
      labStore.logAudit(`COMMAND_${command}`, 'ALL_PCS', `Broadcast command ${command} to all PCs`, teacherName);
    } else {
      targetAgentIds.forEach((id) => {
        const ws = this.agentSockets.get(id);
        if (ws && ws.readyState === 1) ws.send(packet);
      });
      labStore.logAudit(`COMMAND_${command}`, targetAgentIds.join(','), `Sent command ${command} to ${targetAgentIds.length} PC(s)`, teacherName);
    }
  }

  handleDisconnect(ws) {
    if (ws.isTeacher) {
      this.teacherSockets.delete(ws);
      if (this.activeBroadcast && this.activeBroadcast.teacherWs === ws) {
        this.activeBroadcast = null;
      }
    }

    if (ws.isAgent && ws.agentId) {
      const agentId = ws.agentId;
      this.agentSockets.delete(agentId);
      this.socketToAgentId.delete(ws);
      this.activeRemoteSessions.delete(agentId);

      labStore.setAgentStatus(agentId, 'offline');

      const agent = labStore.getAgent(agentId);
      this.broadcastToTeachers({
        type: 'AGENT_OFFLINE',
        agentId,
        displayName: agent ? agent.displayName : agentId,
        lastSeen: new Date().toISOString()
      });
    }
  }

  broadcastToTeachers(data) {
    const msg = typeof data === 'string' ? data : JSON.stringify(data);
    this.teacherSockets.forEach((tWs) => {
      if (tWs.readyState === 1) {
        tWs.send(msg);
      }
    });
  }

  broadcastAll(data) {
    const msg = typeof data === 'string' ? data : JSON.stringify(data);
    this.teacherSockets.forEach((tWs) => {
      if (tWs.readyState === 1) tWs.send(msg);
    });
    this.agentSockets.forEach((aWs) => {
      if (aWs.readyState === 1) aWs.send(msg);
    });
  }

  getLiveCounts() {
    return {
      connectedAgents: this.agentSockets.size,
      connectedTeachers: this.teacherSockets.size
    };
  }
}

module.exports = new ClassroomWsHub();

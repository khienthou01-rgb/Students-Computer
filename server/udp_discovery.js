/**
 * Module: Realtime UDP Discovery Beacon & Auto-Discovery Service
 * Broadcasts teacher presence on local Wi-Fi / LAN subnet so student agents
 * and client tools automatically discover the teacher's IP even when Wi-Fi changes.
 */
const dgram = require('dgram');
const os = require('os');

const UDP_PORT = 8088;
let udpSocket = null;

function startUdpDiscovery(getPort, getLanIp) {
  try {
    udpSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    udpSocket.on('error', (err) => {
      console.warn('[UDP Discovery Warning]', err.message);
      try { udpSocket.close(); } catch (e) {}
    });

    udpSocket.on('message', (msg, rinfo) => {
      try {
        const text = msg.toString().trim();
        if (text.includes('TIS_DISCOVER_TEACHER') || text.includes('WHO_IS_TEACHER')) {
          const currentIp = getLanIp();
          const port = getPort();
          const reply = JSON.stringify({
            service: 'tis-lab-teacher',
            ip: currentIp,
            port,
            hostname: os.hostname(),
            serverUrl: `http://${currentIp}:${port}`,
            wsUrl: `ws://${currentIp}:${port}/ws/classroom`,
            timestamp: Date.now()
          });
          const replyBuf = Buffer.from(reply);
          udpSocket.send(replyBuf, 0, replyBuf.length, rinfo.port, rinfo.address);
        }
      } catch (e) {}
    });

    udpSocket.bind(UDP_PORT, () => {
      try {
        udpSocket.setBroadcast(true);
      } catch (e) {}
      console.log(`📡 UDP Classroom Auto-Discovery Beacon listening on port ${UDP_PORT}`);
    });

    const sendBeacon = () => {
      if (!udpSocket) return;
      try {
        const currentIp = getLanIp();
        const port = getPort();
        if (!currentIp || currentIp === 'localhost') return;
        const beacon = JSON.stringify({
          service: 'tis-lab-teacher',
          ip: currentIp,
          port,
          hostname: os.hostname(),
          serverUrl: `http://${currentIp}:${port}`,
          wsUrl: `ws://${currentIp}:${port}/ws/classroom`,
          timestamp: Date.now()
        });
        const beaconBuf = Buffer.from(beacon);
        udpSocket.send(beaconBuf, 0, beaconBuf.length, UDP_PORT, '255.255.255.255');
      } catch (e) {}
    };

    global.sendUdpBeacon = sendBeacon;
    setInterval(sendBeacon, 3000); // Send beacon every 3s
    setTimeout(sendBeacon, 1000);
  } catch (err) {
    console.warn('[UDP Init Warning]', err.message);
  }
}

module.exports = { startUdpDiscovery };

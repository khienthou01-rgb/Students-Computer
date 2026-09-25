const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 8080;
const BASE_DIR = process.env.VERCEL ? process.cwd() : __dirname;


const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoint: /api/info for Server & LAN network telemetry
  if (req.method === 'GET' && req.url === '/api/info') {
    const ifaces = os.networkInterfaces();
    const lanIps = [];
    for (const name in ifaces) {
      for (const iface of ifaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          lanIps.push({ name, ip: iface.address, url: `http://${iface.address}:${PORT}/` });
        }
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'online',
      server: 'TIS Lab Computer HostImg Server v2.1',
      port: PORT,
      lanIps,
      uptime: process.uptime()
    }));
    return;
  }

  // API Endpoint: /api/upload for Local Image Hosting (HostImg)
  if (req.method === 'POST' && (req.url === '/api/upload' || req.url.startsWith('/api/upload'))) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard max 15MB upload
      if (body.length > 15 * 1024 * 1024) {
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        let base64Data = '';
        let fileName = 'photo';
        if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
          const parsed = JSON.parse(body || '{}');
          base64Data = parsed.image || parsed.data || parsed.base64 || '';
          fileName = parsed.name || parsed.filename || 'student';
        } else {
          base64Data = body;
        }

        if (!base64Data) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'No image data provided' }));
          return;
        }

        const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        let ext = 'jpg';
        let buffer;
        if (matches && matches.length === 3) {
          const rawExt = matches[1].toLowerCase();
          ext = rawExt.includes('png') ? 'png' : (rawExt.includes('webp') ? 'webp' : 'jpg');
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          buffer = Buffer.from(base64Data, 'base64');
        }

        const uploadsDir = path.join(BASE_DIR, 'uploads', 'images');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const safeName = (fileName ? path.basename(fileName, path.extname(fileName)) : 'img')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .slice(0, 30);
        const uniqueName = `${safeName}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const targetFile = path.join(uploadsDir, uniqueName);

        fs.writeFileSync(targetFile, buffer);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          url: `/uploads/images/${uniqueName}`,
          fullUrl: `http://localhost:${PORT}/uploads/images/${uniqueName}`,
          filename: uniqueName,
          size: buffer.length
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  let safePath = path.normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = 'index.html';
  } else if (safePath.startsWith('/') || safePath.startsWith('\\')) {
    safePath = safePath.slice(1);
  }

  const filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const ext = path.extname(filePath);
      if (!ext) {
        const indexPath = path.join(BASE_DIR, 'index.html');
        return fs.stat(indexPath, (iErr, iStats) => {
          if (!iErr && iStats.isFile()) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return fs.createReadStream(indexPath).pipe(res);
          }
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        });
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

if (!process.env.VERCEL) {
  server.listen(PORT, '0.0.0.0', () => {
    const ifaces = os.networkInterfaces();
    const lanIps = [];
    for (const name in ifaces) {
      for (const iface of ifaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          lanIps.push({ name, ip: iface.address });
        }
      }
    }

    console.log(`\n==========================================================`);
    console.log(`🚀 TIS Lab Computer - Modern School Server (HostImg Pro)`);
    console.log(`🌐 Localhost:  http://localhost:${PORT}/`);
    lanIps.forEach(net => {
      console.log(`📱 LAN/Wi-Fi:  http://${net.ip}:${PORT}/  (${net.name})`);
    });
    console.log(`⚡ API Upload: http://localhost:${PORT}/api/upload`);
    console.log(`⏰ Telegram:   7:00 PM Daily Attendance Summary Scheduler Active`);
    console.log(`==========================================================\n`);
  });
}


// ---------------------------------------------------------------------------
// 7:00 PM Daily Attendance Summary Auto-Scheduler
// ---------------------------------------------------------------------------
const https = require('https');

function checkServerDailyAttendance() {
  try {
    const now = new Date();
    const h = now.getHours();

    if (h >= 19) {
      const y = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const todayStr = `${y}-${mo}-${d}`;

      const sentFlagFile = path.join(BASE_DIR, `.sent_daily_att_${todayStr}`);
      if (fs.existsSync(sentFlagFile)) return;

      const dbUrl = 'https://system-student-c2267-default-rtdb.asia-southeast1.firebasedatabase.app';

      const req1 = https.get(`${dbUrl}/settings/telegram.json`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          let tgConfig = {};
          try { tgConfig = JSON.parse(data) || {}; } catch (e) { }
          const token = tgConfig.botToken || "8895987401:AAHkXzItXSRlxk-y7H4f3mNxCpiOp6LeHVk";
          const chatId = tgConfig.chatId || "-5379513071";
          if (!chatId || tgConfig.notifyDailyAttendanceSummary === false) return;

          const req2 = https.get(`${dbUrl}/students.json`, (sRes) => {
            let sData = '';
            sRes.on('data', c => sData += c);
            sRes.on('end', () => {
              let students = [];
              try {
                const parsed = JSON.parse(sData);
                students = Array.isArray(parsed) ? parsed.filter(Boolean) : Object.values(parsed || {});
              } catch (e) { }

              const req3 = https.get(`${dbUrl}/attendance/${todayStr}.json`, (aRes) => {
                let aData = '';
                aRes.on('data', c => aData += c);
                aRes.on('end', () => {
                  let records = {};
                  try { records = JSON.parse(aData) || {}; } catch (e) { }
                  if (Object.keys(records).length === 0) return;

                  const active = students.filter(s => s && s.Status !== 'Dropped' && s.Status !== 'Graduated');
                  let present = 0, perm = 0, absent = 0, unmarked = 0;
                  let absentList = [], permList = [];
                  const shifts = {
                    morning: { present: 0, perm: 0, absent: 0 },
                    noon: { present: 0, perm: 0, absent: 0 },
                    evening: { present: 0, perm: 0, absent: 0 }
                  };

                  active.forEach(s => {
                    if (!s || !s.ID) return;
                    const st = records[s.ID];
                    const sLower = (st || '').toString().toLowerCase();
                    let sh = 'morning';
                    if (s.Shift && s.Shift.includes('ថ្ងៃ')) sh = 'noon';
                    else if (s.Shift && (s.Shift.includes('រសៀល') || s.Shift.includes('យប់'))) sh = 'evening';

                    if (st === 'Present' || st === 'វត្តមាន' || sLower === 'present') {
                      present++; shifts[sh].present++;
                    } else if (st === 'Permission' || st === 'ច្បាប់' || sLower === 'permission') {
                      perm++; shifts[sh].perm++; permList.push(s);
                    } else if (st === 'Absent' || st === 'អវត្តមាន' || sLower === 'absent') {
                      absent++; shifts[sh].absent++; absentList.push(s);
                    } else {
                      unmarked++;
                    }
                  });

                  const presentPct = active.length > 0 ? Math.round((present / active.length) * 100) : 0;
                  const permPct = active.length > 0 ? Math.round((perm / active.length) * 100) : 0;
                  const absentPct = active.length > 0 ? Math.round((absent / active.length) * 100) : 0;

                  let details = '';
                  if (absentList.length > 0) {
                    details += `❌ <b>អវត្តមានឥតច្បាប់ (${absentList.length} នាក់)៖</b>\n`;
                    absentList.forEach((s, idx) => {
                      details += `  ${idx + 1}. <b>${s.NameKh}</b> (<code>${s.ID}</code>) • ${s.Shift || 'វេន'} • ${s.Phone || '—'}\n`;
                    });
                  }
                  if (permList.length > 0) {
                    if (details) details += '\n';
                    details += `📋 <b>មានច្បាប់អនុញ្ញាត (${permList.length} នាក់)៖</b>\n`;
                    permList.forEach((s, idx) => {
                      details += `  ${idx + 1}. <b>${s.NameKh}</b> (<code>${s.ID}</code>) • ${s.Shift || 'វេន'}\n`;
                    });
                  }
                  if (!details) {
                    details = '🎉 <b>អបអរសាទរ! សិស្សានុសិស្សទាំងអស់មានវត្តមាន ១០០% ពេញលេញ</b>';
                  }

                  const msg = `
<b>📊 របាយការណ៍វត្តមានសរុបប្រចាំថ្ងៃ - TIS LAB COMPUTER</b>
━━━━━━━━━━━━━━━━━━━━
📅 <b>កាលបរិច្ឆេទ៖</b> ${todayStr}
⏰ <b>ម៉ោងរាយការណ៍៖</b> 19:00 (កំណត់ស្វ័យប្រវត្តិ ៧:០០ យប់)
👨‍🏫 <b>រាយការណ៍ដោយ៖</b> TIS Lab Computer Server Auto-Scheduler

📈 <b>ស្ថិតិវត្តមានរួម (Overall Summary)៖</b>
• 👨‍🎓 សិស្សសរុប៖ <b>${active.length}</b> នាក់
• ✅ <b>មានវត្តមាន៖</b> <b>${present}</b> នាក់ (<b>${presentPct}%</b>)
• 📋 <b>មានច្បាប់៖</b> <b>${perm}</b> នាក់ (${permPct}%)
• ❌ <b>អវត្តមាន៖</b> <b>${absent}</b> នាក់ (${absentPct}%)
${unmarked > 0 ? `• ⏳ <b>មិនទាន់កត់ត្រា៖</b> <b>${unmarked}</b> នាក់\n` : ''}
━━━━━━━━━━━━━━━━━━━━
⏰ <b>បែងចែកតាមវេនសិក្សា (By Shifts)៖</b>
☀️ <b>វេនព្រឹក (08:00 - 09:00)៖</b>
   - វត្តមាន: <b>${shifts.morning.present}</b> | ច្បាប់: <b>${shifts.morning.perm}</b> | អវត្តមាន: <b>${shifts.morning.absent}</b>
🌤️ <b>វេនថ្ងៃ (15:00 - 16:00)៖</b>
   - វត្តមាន: <b>${shifts.noon.present}</b> | ច្បាប់: <b>${shifts.noon.perm}</b> | អវត្តមាន: <b>${shifts.noon.absent}</b>
🌙 <b>វេនរសៀល (17:00 - 18:00)៖</b>
   - វត្តមាន: <b>${shifts.evening.present}</b> | ច្បាប់: <b>${shifts.evening.perm}</b> | អវត្តមាន: <b>${shifts.evening.absent}</b>

━━━━━━━━━━━━━━━━━━━━
${details}
━━━━━━━━━━━━━━━━━━━━
<i>ប្រព័ន្ធកត់ត្រាវត្តមានស្វ័យប្រវត្តិតាម Telegram Bot - TIS Lab Computer</i>
                  `.trim();

                  const postData = JSON.stringify({
                    chat_id: chatId,
                    text: msg,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                  });

                  const req = https.request({
                    hostname: 'api.telegram.org',
                    path: `/bot${token}/sendMessage`,
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Content-Length': Buffer.byteLength(postData)
                    }
                  }, (tRes) => {
                    if (tRes.statusCode === 200) {
                      fs.writeFileSync(sentFlagFile, new Date().toISOString());
                      console.log(`[Telegram] 7:00 PM daily attendance summary sent successfully for ${todayStr}!`);
                    }
                  });
                  req.on('error', (err) => console.warn('[Telegram req error]', err.message));
                  req.write(postData);
                  req.end();
                });
              });
              req3.on('error', (err) => console.warn('[Firebase att req error]', err.message));
            });
          });
          req2.on('error', (err) => console.warn('[Firebase students req error]', err.message));
        });
      });
      req1.on('error', (err) => console.warn('[Firebase tg req error]', err.message));
    }
  } catch (err) {
    console.warn('[Scheduler Error]', err);
  }
}

process.on('uncaughtException', (err) => {
  console.warn('[Server uncaughtException]', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.warn('[Server unhandledRejection]', reason);
});

if (!process.env.VERCEL) {
  setInterval(checkServerDailyAttendance, 60000);
  setTimeout(checkServerDailyAttendance, 5000);
}

module.exports = (req, res) => {
  server.emit('request', req, res);
};



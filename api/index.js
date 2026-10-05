// Vercel Serverless Function entry point
const server = require('../server.js');

module.exports = (req, res) => {
  // CORS & Preflight Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const rawUrl = req.url || '';
  const urlPath = rawUrl.split('?')[0];

  // Direct fast path for /api/info
  if (req.method === 'GET' && (urlPath === '/api/info' || urlPath.endsWith('/info'))) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'online',
      server: 'TIS Lab Computer HostImg Server v2.1',
      platform: 'Vercel Serverless',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Direct fast path for /api/health
  if (req.method === 'GET' && (urlPath === '/api/health' || urlPath.endsWith('/health') || urlPath === '/api' || urlPath === '/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'TIS Lab Computer API',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Delegate to server request handler
  if (typeof server === 'function') {
    return server(req, res);
  }
  if (server && typeof server.emit === 'function') {
    return server.emit('request', req, res);
  }

  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Server initialization failed' }));
};


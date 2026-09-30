// Vercel Serverless Function entry point
const server = require('../server.js');

module.exports = (req, res) => {
  // If server is an export function
  if (typeof server === 'function') {
    return server(req, res);
  }
  // If server is http.Server instance
  if (server && typeof server.emit === 'function') {
    return server.emit('request', req, res);
  }
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Server initialization failed' }));
};

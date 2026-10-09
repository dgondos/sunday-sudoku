'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.env.SITE_DIR || '.');
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) {res.writeHead(403).end(); return;}
  fs.readFile(file, (error, content) => {
    if (error) {res.writeHead(404).end('Not found'); return;}
    res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(content);
  });
}).listen(port, '0.0.0.0', () => console.log('Sudoku server: http://localhost:' + port));

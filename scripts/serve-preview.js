// Read-only static preview with the same base path as GitHub Pages.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../out');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  if (pathname === '/') { res.writeHead(302, { Location: '/my-portfolio/' }).end(); return; }
  if (!pathname.startsWith('/my-portfolio/')) { res.writeHead(404).end(); return; }
  let file = path.resolve(root, '.' + pathname.slice('/my-portfolio'.length));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); const missing = path.join(root, '404.html'); res.end(fs.existsSync(missing) ? fs.readFileSync(missing) : 'Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('Preview: http://localhost:4173/my-portfolio/'));

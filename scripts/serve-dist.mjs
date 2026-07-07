/* global console, process, URL */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

const root = resolve('dist');
const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 5173);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function sendFile(res, path) {
  const type = contentTypes[extname(path)] ?? 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  createReadStream(path).pipe(res);
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${host}:${port}`);
  const rawPath = decodeURIComponent(url.pathname);
  const candidate = resolve(join(root, rawPath === '/' ? 'index.html' : rawPath));
  const safePath = candidate.startsWith(root) ? candidate : join(root, 'index.html');
  const filePath = existsSync(safePath) && statSync(safePath).isFile() ? safePath : join(root, 'index.html');
  sendFile(res, filePath);
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}/`);
});

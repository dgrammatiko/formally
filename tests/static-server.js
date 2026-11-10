import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

const root = process.cwd();

export async function startServer(port = 0) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port || 5432}`);
    let filePath = join(root, url.pathname);
    if (filePath === join(root, '/')) {
      filePath = join(root, 'index.html');
    }
    try {
      const ext = extname(filePath).toLowerCase();
      const content = await readFile(filePath);
      res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.end(content);
    } catch {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });
  await new Promise((resolve) => server.listen(port, resolve));
  const actualPort = server.address().port;
  return { server, port: actualPort };
}

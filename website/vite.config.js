import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function createAppPwaRoutingMiddleware(baseDir) {
  return (req, res, next) => {
    const rawUrl = req.url || '/';
    const [pathname, search = ''] = rawUrl.split('?');

    if (pathname === '/app') {
      res.statusCode = 301;
      res.setHeader('Location', `/app/${search ? `?${search}` : ''}`);
      res.end();
      return;
    }

    if (!pathname.startsWith('/app/')) {
      return next();
    }

    const subPath = decodeURIComponent(pathname.slice('/app/'.length));
    const simulatorRoot = path.resolve(baseDir, 'simulator');
    const candidate = path.resolve(simulatorRoot, subPath);

    let targetFile = path.join(simulatorRoot, 'index.html');
    if (
      subPath &&
      candidate.startsWith(simulatorRoot) &&
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isFile()
    ) {
      targetFile = candidate;
    }

    const ext = path.extname(targetFile).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    if (subPath === 'sw.js') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    fs.createReadStream(targetFile).pipe(res);
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'nammaride-app-pwa-routing',
      configureServer(server) {
        server.middlewares.use(createAppPwaRoutingMiddleware(path.resolve(__dirname, 'public')));
      },
      configurePreviewServer(server) {
        server.middlewares.use(createAppPwaRoutingMiddleware(path.resolve(__dirname, 'dist')));
      },
    },
  ],
  server: {
    port: 3000,
    open: true,
  },
});

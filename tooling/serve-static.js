// Local static server that applies the `_headers` rules of a build folder,
// so the security headers can be inspected before deploying (curl -I).
// Pure Node, no dependencies. Listens on 127.0.0.1 only.
//
// Usage: node tooling/serve-static.js <dist-folder> [port] [--spa]
//   --spa  serve index.html (200) for paths that do not exist (app router)
//
// It approximates Cloudflare static assets for this repository's needs; it is
// not a full emulation (no ETag, no redirects, no html_handling).
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { headersForPath, parseHeadersFile } from './headers-file.js';

// Cloudflare's default for static assets (same docs page as headers-file.js).
const DEFAULT_CACHE_CONTROL = 'public, max-age=0, must-revalidate';

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
};

/** Files that configure the host and are never served. */
const HIDDEN = new Set(['/_headers', '/_redirects']);

/**
 * @param {string} root
 * @param {string} pathname decoded, starting with "/"
 * @returns {string | undefined} absolute file path inside root
 */
function resolveFile(root, pathname) {
  const candidate = path.resolve(root, `.${pathname}`);
  if (candidate !== root && !candidate.startsWith(root + path.sep)) return undefined;
  if (!existsSync(candidate)) return undefined;
  const stat = statSync(candidate);
  if (stat.isFile()) return candidate;
  if (stat.isDirectory()) {
    const index = path.join(candidate, 'index.html');
    return existsSync(index) && statSync(index).isFile() ? index : undefined;
  }
  return undefined;
}

/**
 * @param {string} rootDir folder with the built files (and its `_headers`)
 * @param {{ spa?: boolean }} [options]
 */
export function createStaticServer(rootDir, options = {}) {
  const root = path.resolve(rootDir);
  const headersPath = path.join(root, '_headers');
  const rules = existsSync(headersPath) ? parseHeadersFile(readFileSync(headersPath, 'utf8')) : [];

  return createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }

    let file = HIDDEN.has(pathname.toLowerCase()) ? undefined : resolveFile(root, pathname);
    let status = 200;
    if (!file && options.spa) file = resolveFile(root, '/index.html');
    if (!file) status = 404;

    // Custom headers follow the requested path, as on Cloudflare.
    /** @type {Record<string, string>} */
    const headers = {};
    if (file) {
      const ext = path.extname(file).toLowerCase();
      headers['Content-Type'] = CONTENT_TYPES[ext] ?? 'application/octet-stream';
      headers['Content-Length'] = String(statSync(file).size);
      headers['Cache-Control'] = DEFAULT_CACHE_CONTROL;
    }
    for (const { name, value } of headersForPath(rules, pathname).values()) {
      for (const key of Object.keys(headers)) {
        if (key.toLowerCase() === name.toLowerCase()) delete headers[key];
      }
      headers[name] = value;
    }

    res.writeHead(status, headers);
    if (!file || req.method === 'HEAD') {
      res.end();
      return;
    }
    createReadStream(file).pipe(res);
  });
}

function main() {
  const args = process.argv.slice(2);
  const spa = args.includes('--spa');
  const [dir, portArg = '4173'] = args.filter((a) => !a.startsWith('--'));
  if (!dir) {
    console.error('Usage: node tooling/serve-static.js <dist-folder> [port] [--spa]');
    process.exit(1);
  }
  const root = path.resolve(dir);
  if (!existsSync(path.join(root, 'index.html'))) {
    console.error(`No index.html in ${root}. Run "pnpm build" first.`);
    process.exit(1);
  }
  const port = Number(portArg);
  createStaticServer(root, { spa }).listen(port, '127.0.0.1', () => {
    console.log(`Serving ${root} at http://127.0.0.1:${port}/${spa ? ' (SPA fallback)' : ''}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}

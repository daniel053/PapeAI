// Critical test `e2e.csp-blocks` (precursor, docs/processo/testes-e-qualidade.md):
// static checks of the security headers, robots.txt and security.txt of both
// origins (docs/seguranca/seguranca-web-headers-csp-robots.md). The browser-level
// E2E version arrives with Playwright; until then these tests guard the files that
// Cloudflare serves, plus the local server used to inspect them (tooling/serve-static.js).
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { request, type IncomingHttpHeaders } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  MAX_LINE_LENGTH,
  MAX_RULES,
  headersForPath,
  parseHeadersFile,
  pathMatches,
} from '../../tooling/headers-file.js';
import { createStaticServer } from '../../tooling/serve-static.js';
import { NETWORK_ALLOWLIST } from './config/network';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const read = (relative: string) => readFileSync(path.join(repoRoot, relative), 'utf8');

const appRules = parseHeadersFile(read('app/public/_headers'));
const siteRules = parseHeadersFile(read('site/public/_headers'));

function header(rules: ReturnType<typeof parseHeadersFile>, pathname: string, name: string) {
  return headersForPath(rules, pathname).get(name.toLowerCase())?.value;
}

/** Parses a CSP string into directive -> source list. */
function parseCsp(csp: string | undefined): Map<string, string[]> {
  if (!csp) throw new Error('Missing Content-Security-Policy');
  const directives = new Map<string, string[]>();
  for (const part of csp.split(';')) {
    const [name, ...values] = part.trim().split(/\s+/);
    if (!name) continue;
    if (directives.has(name)) throw new Error(`Duplicate CSP directive ${name}`);
    directives.set(name, values);
  }
  return directives;
}

const appCsp = parseCsp(header(appRules, '/', 'Content-Security-Policy'));
const siteCsp = parseCsp(header(siteRules, '/', 'Content-Security-Policy'));

describe.each([
  ['app', appCsp],
  ['site', siteCsp],
])('e2e.csp-blocks (static): %s CSP', (_origin, csp) => {
  it('never allows unsafe-inline, unsafe-eval, wildcards or third-party hosts', () => {
    for (const [directive, sources] of csp) {
      for (const source of sources) {
        expect(source, directive).not.toMatch(/unsafe-(inline|eval|hashes)/);
        expect(source, directive).not.toMatch(/\*/);
        expect(source, directive).not.toMatch(/^(https?|wss?):/i);
      }
    }
  });

  it('starts from default-src none and closes the classic injection tricks', () => {
    expect(csp.get('default-src')).toEqual(["'none'"]);
    expect(csp.get('object-src')).toEqual(["'none'"]);
    expect(csp.get('base-uri')).toEqual(["'none'"]);
    expect(csp.get('frame-ancestors')).toEqual(["'none'"]);
    expect(csp.get('frame-src')).toEqual(["'none'"]);
    expect(csp.has('upgrade-insecure-requests')).toBe(true);
  });

  it('allows connections only to its own origin', () => {
    expect(csp.get('connect-src')).toEqual(["'self'"]);
  });
});

describe('e2e.csp-blocks (static): app specifics', () => {
  it('loads scripts and styles only from the app itself', () => {
    expect(appCsp.get('script-src')).toEqual(["'self'"]);
    expect(appCsp.get('style-src')).toEqual(["'self'"]);
    expect(appCsp.get('font-src')).toEqual(["'self'"]);
    expect(appCsp.get('form-action')).toEqual(["'self'"]);
  });

  it('allows the PWA service worker and manifest from the same origin only', () => {
    expect(appCsp.get('worker-src')).toEqual(["'self'"]);
    expect(appCsp.get('manifest-src')).toEqual(["'self'"]);
  });

  it('keeps connect-src in sync with the network allowlist (core/net)', () => {
    const fromAllowlist = NETWORK_ALLOWLIST.map((entry) => (entry === 'self' ? "'self'" : entry));
    expect([...(appCsp.get('connect-src') ?? [])].sort()).toEqual([...fromAllowlist].sort());
  });

  it('monitors Trusted Types in report-only mode', () => {
    expect(header(appRules, '/', 'Content-Security-Policy-Report-Only')).toBe(
      "require-trusted-types-for 'script'",
    );
  });

  it('is never indexed (X-Robots-Tag on every path)', () => {
    for (const pathname of ['/', '/index.html', '/assets/x.js', '/some/deep/link']) {
      expect(header(appRules, pathname, 'X-Robots-Tag')).toBe('noindex, nofollow, noarchive');
    }
  });

  it('denies the microphone and other powerful features until a phase needs them', () => {
    const policy = header(appRules, '/', 'Permissions-Policy') ?? '';
    for (const feature of ['microphone', 'camera', 'geolocation', 'payment', 'usb']) {
      expect(policy).toContain(`${feature}=()`);
    }
  });

  it('revalidates the entry points and caches hashed assets forever', () => {
    expect(header(appRules, '/', 'Cache-Control')).toBe('no-cache');
    expect(header(appRules, '/index.html', 'Cache-Control')).toBe('no-cache');
    expect(header(appRules, '/sw.js', 'Cache-Control')).toBe('no-cache');
    expect(header(appRules, '/assets/index-abc123.js', 'Cache-Control')).toBe(
      'public, max-age=31536000, immutable',
    );
  });

  it('has the robots meta tag and no inline script in index.html', () => {
    const html = read('app/index.html');
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
    for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) {
      expect(tag).toMatch(/\ssrc=/);
    }
    expect(html).not.toMatch(/\sstyle=/);
    expect(html).not.toMatch(/\son[a-z]+=/i);
  });
});

describe('e2e.csp-blocks (static): site specifics', () => {
  it('runs no JavaScript at all', () => {
    expect(siteCsp.get('script-src')).toEqual(["'none'"]);
    expect(siteCsp.get('form-action')).toEqual(["'none'"]);
    expect(read('site/index.html')).not.toMatch(/<script\b/i);
  });

  it('is indexable (no X-Robots-Tag)', () => {
    expect(header(siteRules, '/', 'X-Robots-Tag')).toBeUndefined();
  });
});

describe.each([
  ['app', appRules],
  ['site', siteRules],
])('security headers: %s', (_origin, rules) => {
  it.each([
    ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains'],
    ['X-Content-Type-Options', 'nosniff'],
    ['Referrer-Policy', 'no-referrer'],
    ['Cross-Origin-Opener-Policy', 'same-origin'],
    ['Cross-Origin-Resource-Policy', 'same-origin'],
  ])('sends %s on every path', (name, value) => {
    for (const pathname of ['/', '/robots.txt', '/assets/a.css', '/.well-known/security.txt']) {
      expect(header(rules, pathname, name)).toBe(value);
    }
  });

  it('never joins two values into one header (Cloudflare joins duplicates with a comma)', () => {
    for (const pathname of ['/', '/index.html', '/sw.js', '/assets/a.css', '/robots.txt']) {
      const headers = headersForPath(rules, pathname);
      expect(headers.get('cache-control')?.value ?? '').not.toContain(', public');
      const csp = headers.get('content-security-policy')?.value ?? '';
      expect(csp.match(/default-src/g)).toHaveLength(1);
    }
  });

  it('serves security.txt as UTF-8 plain text (RFC 9116)', () => {
    expect(header(rules, '/.well-known/security.txt', 'Content-Type')).toBe(
      'text/plain; charset=utf-8',
    );
  });
});

describe('robots.txt', () => {
  const lines = (file: string) =>
    read(file)
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

  it('blocks every robot on the app', () => {
    expect(lines('app/public/robots.txt')).toEqual(['User-agent: *', 'Disallow: /']);
  });

  it('allows robots on the site', () => {
    expect(lines('site/public/robots.txt')).toEqual(['User-agent: *', 'Allow: /']);
  });
});

describe.each(['app', 'site'])('security.txt (RFC 9116): %s', (origin) => {
  const text = read(`${origin}/public/.well-known/security.txt`);
  const fields = text
    .split(/\r?\n/)
    .filter((l) => l.trim() !== '' && !l.startsWith('#'))
    .map((l) => {
      const colon = l.indexOf(':');
      return [l.slice(0, colon).trim().toLowerCase(), l.slice(colon + 1).trim()] as const;
    });
  const all = (name: string) => fields.filter(([n]) => n === name).map(([, v]) => v);

  it('is identical on both origins', () => {
    expect(text).toBe(read('app/public/.well-known/security.txt'));
  });

  it('has an https Contact pointing to GitHub private vulnerability reporting', () => {
    expect(all('contact')).toEqual(['https://github.com/daniel053/PapeAI/security/advisories/new']);
  });

  it('has exactly one Expires, in the future and less than a year ahead', () => {
    const expires = all('expires');
    expect(expires).toHaveLength(1);
    const value = expires[0] ?? '';
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
    const when = Date.parse(value);
    const now = Date.now();
    // When this fails, renew Expires (and review the file): RFC 9116 section 2.5.5.
    expect(when).toBeGreaterThan(now);
    expect(when - now).toBeLessThan(366 * 24 * 60 * 60 * 1000);
  });

  it('declares languages and the policy, without personal e-mail', () => {
    expect(all('preferred-languages')).toEqual(['pt, en']);
    expect(all('policy')).toEqual(['https://github.com/daniel053/PapeAI/blob/main/SECURITY.md']);
    expect(text).not.toMatch(/mailto:|@[a-z0-9-]+\.[a-z]/i);
  });
});

describe('_headers parser (tooling/headers-file.js)', () => {
  it('matches exact paths and a single splat', () => {
    expect(pathMatches('/', '/')).toBe(true);
    expect(pathMatches('/', '/index.html')).toBe(false);
    expect(pathMatches('/*', '/')).toBe(true);
    expect(pathMatches('/assets/*', '/assets/a/b.js')).toBe(true);
    expect(pathMatches('/assets/*', '/assetsx.js')).toBe(false);
    expect(pathMatches('/*.txt', '/robots.txt')).toBe(true);
  });

  it('applies rules in order, joins repeats with a comma and detaches', () => {
    const rules = parseHeadersFile(
      [
        '# comment',
        '/*',
        '  X-A: one',
        '  Cache-Control: max-age=0',
        '/special',
        '  X-A: two',
        '  ! Cache-Control',
        '  Cache-Control: max-age=60',
        '',
      ].join('\n'),
    );
    const special = headersForPath(rules, '/special');
    expect(special.get('x-a')?.value).toBe('one, two');
    expect(special.get('cache-control')?.value).toBe('max-age=60');
    expect(headersForPath(rules, '/other').get('cache-control')?.value).toBe('max-age=0');
  });

  it('rejects syntax it does not support instead of guessing', () => {
    expect(() => parseHeadersFile('  X-A: orphan')).toThrow(/without a path/);
    expect(() => parseHeadersFile('https://example.com/*\n  X-A: b')).toThrow(/unsupported/);
    expect(() => parseHeadersFile('/a/*/b/*\n  X-A: b')).toThrow(/one splat/);
    expect(() => parseHeadersFile('/movies/:title\n  X-A: b')).toThrow(/placeholders/);
    expect(() => parseHeadersFile('/a\n  not a header')).toThrow(/Name: value/);
  });

  it('enforces the Cloudflare limits (100 rules, 2000 characters per line)', () => {
    const many = Array.from({ length: MAX_RULES + 1 }, (_, i) => `/r${i}\n  X-A: b`).join('\n');
    expect(() => parseHeadersFile(many)).toThrow(/limit/);
    expect(() => parseHeadersFile(`/a\n  X-A: ${'b'.repeat(MAX_LINE_LENGTH)}`)).toThrow(/exceeds/);
  });

  it('keeps both real files within the limits', () => {
    for (const file of ['app/public/_headers', 'site/public/_headers']) {
      const text = read(file);
      expect(parseHeadersFile(text).length).toBeLessThanOrEqual(MAX_RULES);
      for (const line of text.split(/\r?\n/)) expect(line.length).toBeLessThanOrEqual(2000);
    }
  });
});

describe('local static server (tooling/serve-static.js)', () => {
  let dir = '';
  let port = 0;
  let close: () => Promise<void> = () => Promise.resolve();

  beforeAll(async () => {
    dir = mkdtempSync(path.join(tmpdir(), 'papeai-serve-'));
    cpSync(path.join(repoRoot, 'app/public'), dir, { recursive: true });
    writeFileSync(path.join(dir, 'index.html'), '<!doctype html><title>t</title>');
    mkdirSync(path.join(dir, 'assets'));
    writeFileSync(path.join(dir, 'assets', 'index-abc123.js'), 'export {};');
    writeFileSync(path.join(path.dirname(dir), 'papeai-outside.txt'), 'secret');
    const server = createStaticServer(dir, { spa: true });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    port = (server.address() as AddressInfo).port;
    close = () => new Promise((resolve) => server.close(() => resolve()));
  });

  afterAll(async () => {
    await close();
    rmSync(dir, { recursive: true, force: true });
    rmSync(path.join(path.dirname(dir), 'papeai-outside.txt'), { force: true });
  });

  function get(pathname: string, method = 'GET') {
    return new Promise<{ status: number; headers: IncomingHttpHeaders; body: string }>(
      (resolve, reject) => {
        const req = request({ host: '127.0.0.1', port, path: pathname, method }, (res) => {
          let body = '';
          res.setEncoding('utf8');
          res.on('data', (chunk: string) => (body += chunk));
          res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body }));
        });
        req.on('error', reject);
        req.end();
      },
    );
  }

  it('sends the CSP and X-Robots-Tag from _headers', async () => {
    const res = await get('/', 'HEAD');
    expect(res.status).toBe(200);
    expect(res.headers['content-security-policy']).toBe(
      header(appRules, '/', 'Content-Security-Policy'),
    );
    expect(res.headers['x-robots-tag']).toBe('noindex, nofollow, noarchive');
    expect(res.headers['cache-control']).toBe('no-cache');
  });

  it('serves hashed assets as immutable and security.txt as text/plain', async () => {
    const asset = await get('/assets/index-abc123.js');
    expect(asset.headers['cache-control']).toBe('public, max-age=31536000, immutable');
    expect(asset.headers['content-type']).toBe('text/javascript; charset=utf-8');
    const txt = await get('/.well-known/security.txt');
    expect(txt.headers['content-type']).toBe('text/plain; charset=utf-8');
    expect(txt.body).toContain('Contact: https://github.com/');
  });

  it('falls back to index.html for app routes, with the same headers', async () => {
    const res = await get('/some/deep/link');
    expect(res.status).toBe(200);
    expect(res.body).toContain('<title>t</title>');
    expect(res.headers['content-security-policy']).toContain("default-src 'none'");
  });

  it('never serves _headers or files outside the folder', async () => {
    expect((await get('/_headers')).body).not.toContain('Content-Security-Policy');
    for (const evil of ['/../papeai-outside.txt', '/%2e%2e/papeai-outside.txt']) {
      expect((await get(evil)).body).not.toContain('secret');
    }
    expect((await get('/', 'POST')).status).toBe(405);
  });
});

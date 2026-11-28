import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { crc32, inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import {
  BACKGROUND_COLOR,
  NAVIGATE_FALLBACK_DENYLIST,
  PRECACHE_GLOB_PATTERNS,
  THEME_COLOR,
  pwaOptions,
} from './pwa-config';

const appRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const repoRoot = fileURLToPath(new URL('../../../../../', import.meta.url));
const publicDir = `${appRoot}public`;

interface Png {
  width: number;
  height: number;
  colorType: number;
  /** RGBA bytes, row by row. */
  pixels: Buffer;
}

/** Minimal PNG reader for the files written by tooling/generate-icons.js. */
function readPng(file: string): Png {
  const data = readFileSync(file);
  expect(data.subarray(0, 8)).toEqual(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
  let offset = 8;
  let header: Buffer | undefined;
  const idat: Buffer[] = [];
  const types: string[] = [];
  while (offset < data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.toString('latin1', offset + 4, offset + 8);
    const body = data.subarray(offset + 8, offset + 8 + length);
    const crc = data.readUInt32BE(offset + 8 + length);
    expect(crc, `CRC of ${type}`).toBe(crc32(data.subarray(offset + 4, offset + 8 + length)));
    types.push(type);
    if (type === 'IHDR') header = body;
    if (type === 'IDAT') idat.push(body);
    offset += 12 + length;
  }
  expect(types[0]).toBe('IHDR');
  expect(types.at(-1)).toBe('IEND');
  if (!header) throw new Error('No IHDR');

  const width = header.readUInt32BE(0);
  const height = header.readUInt32BE(4);
  const raw = inflateSync(Buffer.concat(idat));
  const rowLength = width * 4 + 1;
  expect(raw.length).toBe(rowLength * height);
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    expect(raw[y * rowLength], 'filter type').toBe(0); // the generator writes unfiltered rows
    raw.copy(pixels, y * width * 4, y * rowLength + 1, (y + 1) * rowLength);
  }
  return { width, height, colorType: header[9] ?? -1, pixels };
}

function hexToRgb(hex: string): number[] {
  return [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
}

function tokenFromStyles(name: string): string | undefined {
  const css = readFileSync(`${appRoot}src/ui/styles.css`, 'utf8');
  return new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(css)?.[1]?.toLowerCase();
}

const manifest = pwaOptions.manifest;
if (!manifest) throw new Error('PWA manifest must be configured');
const icons = manifest.icons ?? [];

describe('web app manifest', () => {
  it('identifies the app in pt-BR', () => {
    expect(manifest).toMatchObject({
      name: 'PapeAI',
      short_name: 'PapeAI',
      lang: 'pt-BR',
      start_url: '/',
      scope: '/',
      display: 'standalone',
    });
    expect(manifest.description).toMatch(/inglês/);
  });

  it('uses the design tokens for its colors', () => {
    expect(manifest.theme_color).toBe(THEME_COLOR);
    expect(manifest.background_color).toBe(BACKGROUND_COLOR);
    expect(THEME_COLOR).toBe(tokenFromStyles('color-primary-600'));
    expect(BACKGROUND_COLOR).toBe(tokenFromStyles('color-surface-0'));
    expect(readFileSync(`${appRoot}index.html`, 'utf8')).toContain(
      `<meta name="theme-color" content="${THEME_COLOR}"`,
    );
  });

  it('has 192 and 512 "any" icons and a 512 maskable icon', () => {
    const summary = icons.map((icon) => `${icon.sizes ?? ''} ${String(icon.purpose)}`);
    expect(summary).toEqual(['192x192 any', '512x512 any', '512x512 maskable']);
  });

  it.each(icons.map((icon) => [icon.src, icon.sizes] as const))(
    '%s is a valid RGBA PNG of %s',
    (src, sizes) => {
      const png = readPng(`${publicDir}${src}`);
      expect(`${png.width}x${png.height}`).toBe(sizes);
      expect(png.colorType).toBe(6);
    },
  );
});

describe('icons', () => {
  it('maskable icon is full-bleed and keeps the artwork inside the safe zone', () => {
    const maskable = icons.find((icon) => icon.purpose === 'maskable');
    if (!maskable) throw new Error('No maskable icon');
    const png = readPng(`${publicDir}${maskable.src}`);
    const background = hexToRgb(THEME_COLOR);
    const center = png.width / 2;
    const safeRadius = 0.4 * png.width; // W3C "Manifest" spec: maskable safe zone
    let outsideSafeZone = 0;
    let notOpaque = 0;
    let artworkOutsideSafeZone = 0;
    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        const i = (y * png.width + x) * 4;
        if (png.pixels[i + 3] !== 255) notOpaque++;
        if (Math.hypot(x + 0.5 - center, y + 0.5 - center) > safeRadius) {
          outsideSafeZone++;
          const rgb = [...png.pixels.subarray(i, i + 3)];
          if (rgb.some((value, channel) => value !== background[channel])) {
            artworkOutsideSafeZone++;
          }
        }
      }
    }
    expect(outsideSafeZone).toBeGreaterThan(0);
    expect(notOpaque).toBe(0);
    expect(artworkOutsideSafeZone).toBe(0);
  });

  it('apple-touch-icon is a 180px PNG without transparency', () => {
    const html = readFileSync(`${appRoot}index.html`, 'utf8');
    const href = /<link rel="apple-touch-icon" href="([^"]+)"/.exec(html)?.[1];
    expect(href).toBe('/icons/apple-touch-icon-180.png');
    const png = readPng(`${publicDir}${href ?? ''}`);
    expect([png.width, png.height]).toEqual([180, 180]);
    let notOpaque = 0;
    for (let i = 3; i < png.pixels.length; i += 4) {
      if (png.pixels[i] !== 255) notOpaque++;
    }
    expect(notOpaque).toBe(0);
  });

  it('favicon.svg is linked from index.html', () => {
    const html = readFileSync(`${appRoot}index.html`, 'utf8');
    expect(html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml"');
    expect(readFileSync(`${publicDir}/favicon.svg`, 'utf8')).toContain(`fill="${THEME_COLOR}"`);
  });

  it('committed icons match the SVG master (tooling/generate-icons.js --check)', () => {
    const output = execFileSync(
      process.execPath,
      [`${repoRoot}tooling/generate-icons.js`, '--check'],
      { encoding: 'utf8' },
    );
    expect(output).toContain('Icons are up to date.');
  }, 60_000);
});

describe('service worker', () => {
  it('registers from code, never through an injected inline script', () => {
    expect(pwaOptions.injectRegister).toBe(false);
    expect(pwaOptions.registerType).toBe('prompt');
    expect(pwaOptions.devOptions?.enabled).toBe(false);
  });

  it('precaches only static build files and caches nothing at runtime', () => {
    expect(PRECACHE_GLOB_PATTERNS).toEqual(['**/*.{js,css,html,woff2,svg,png}']);
    expect(pwaOptions.workbox?.globPatterns).toBe(PRECACHE_GLOB_PATTERNS);
    expect(pwaOptions.workbox?.runtimeCaching ?? []).toEqual([]);
    expect(pwaOptions.workbox?.skipWaiting).toBe(false);
    expect(pwaOptions.workbox?.clientsClaim).toBe(false);
  });

  it.each(['/robots.txt', '/.well-known/security.txt', '/sw.js', '/manifest.webmanifest'])(
    'lets the server answer navigations to %s',
    (pathname) => {
      expect(NAVIGATE_FALLBACK_DENYLIST.some((pattern) => pattern.test(pathname))).toBe(true);
    },
  );

  it.each(['/', '/settings', '/lesson/12'])('serves the SPA shell for %s', (pathname) => {
    expect(NAVIGATE_FALLBACK_DENYLIST.some((pattern) => pattern.test(pathname))).toBe(false);
  });
});

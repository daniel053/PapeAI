// Generates the PWA icons from the SVG master (tooling/icons/mascot-face.svg).
//
//   node tooling/generate-icons.js          writes the icons
//   node tooling/generate-icons.js --check  fails if the committed icons are stale
//
// Pure Node on purpose (no image library to install or audit): the master only
// uses circles, ellipses and one stroked curve, so we rasterize them here with
// 4x4 supersampling and encode the PNG ourselves with node:zlib.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { crc32, deflateSync, inflateSync } from 'node:zlib';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const MASTER_PATH = path.join(REPO_ROOT, 'tooling', 'icons', 'mascot-face.svg');
const PUBLIC_DIR = path.join(REPO_ROOT, 'app', 'public');

/** --color-primary-600 in app/src/ui/styles.css. */
const BACKGROUND = '#2f4ae0';

/** Point of the artwork placed at the center of every icon (center of the head). */
const ARTWORK_CENTER = { x: 100, y: 105 };

/**
 * corner: corner radius as a fraction of the icon size (0 = full-bleed square).
 * reach: distance from the center to the farthest artwork pixel, as a fraction
 * of the icon size.
 */
const LAYOUTS = {
  // Browsers and desktop installs show this as is.
  any: { corner: 0.2, reach: 0.45 },
  // Android adaptive icons crop to a shape inside the central circle of radius
  // 40% (the "safe zone"); everything outside it may be cut off.
  maskable: { corner: 0, reach: 0.36 },
  // iOS rounds the corners itself and turns transparency into black.
  apple: { corner: 0, reach: 0.42 },
};

const PNG_OUTPUTS = [
  { file: 'icons/icon-192.png', size: 192, layout: 'any' },
  { file: 'icons/icon-512.png', size: 512, layout: 'any' },
  { file: 'icons/icon-maskable-512.png', size: 512, layout: 'maskable' },
  { file: 'icons/apple-touch-icon-180.png', size: 180, layout: 'apple' },
];

const SVG_OUTPUTS = [{ file: 'favicon.svg', size: 200, layout: 'any' }];

const SUPERSAMPLING = 4;

// ---------------------------------------------------------------------------
// SVG master parsing (deliberately tiny: unknown elements are an error)

function parseColor(value) {
  if (value === undefined || value === 'none') return null;
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value)?.[1];
  if (!hex) throw new Error(`Unsupported color: ${value}`);
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
}

function parseAttributes(source) {
  const attributes = {};
  for (const [, name, value] of source.matchAll(/([\w:-]+)="([^"]*)"/g)) {
    attributes[name] = value;
  }
  return attributes;
}

function num(attributes, name) {
  const value = Number(attributes[name]);
  if (!Number.isFinite(value)) throw new Error(`Missing or invalid attribute "${name}"`);
  return value;
}

function ellipseShape(cx, cy, rx, ry, fill, stroke, strokeWidth) {
  const half = stroke ? strokeWidth / 2 : 0;
  const inside = (u, v, ex, ey) =>
    ex > 0 && ey > 0 && ((u - cx) / ex) ** 2 + ((v - cy) / ey) ** 2 <= 1;
  return {
    fill,
    stroke,
    bbox: [cx - rx - half, cy - ry - half, cx + rx + half, cy + ry + half],
    inFill: (u, v) => inside(u, v, rx, ry),
    inStroke: (u, v) => inside(u, v, rx + half, ry + half) && !inside(u, v, rx - half, ry - half),
    reach(x, y) {
      let max = 0;
      for (let i = 0; i < 720; i++) {
        const t = (i / 720) * 2 * Math.PI;
        const px = cx + (rx + half) * Math.cos(t);
        const py = cy + (ry + half) * Math.sin(t);
        max = Math.max(max, Math.hypot(px - x, py - y));
      }
      return max;
    },
  };
}

function flattenPath(d) {
  const tokens = d.match(/[MLQ]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? [];
  if (tokens.join('').length !== d.replace(/[\s,]/g, '').length) {
    throw new Error(`Unsupported path data (only absolute M, L, Q): ${d}`);
  }
  const points = [];
  let i = 0;
  const next = () => Number(tokens[i++]);
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'M' || command === 'L') {
      points.push([next(), next()]);
    } else if (command === 'Q') {
      const start = points.at(-1);
      if (!start) throw new Error('Path must start with M');
      const control = [next(), next()];
      const end = [next(), next()];
      for (let step = 1; step <= 32; step++) {
        const t = step / 32;
        const a = (1 - t) ** 2;
        const b = 2 * (1 - t) * t;
        const c = t ** 2;
        points.push([
          a * start[0] + b * control[0] + c * end[0],
          a * start[1] + b * control[1] + c * end[1],
        ]);
      }
    } else {
      throw new Error(`Unsupported path command: ${command}`);
    }
  }
  return points;
}

function distanceToSegmentSquared(u, v, [x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  const t =
    lengthSquared === 0
      ? 0
      : Math.max(0, Math.min(1, ((u - x1) * dx + (v - y1) * dy) / lengthSquared));
  return (u - x1 - t * dx) ** 2 + (v - y1 - t * dy) ** 2;
}

function pathShape(attributes) {
  if (parseColor(attributes.fill) !== null) throw new Error('Filled paths are not supported');
  if (attributes['stroke-linecap'] !== 'round')
    throw new Error('Paths need stroke-linecap="round"');
  const stroke = parseColor(attributes.stroke);
  const half = num(attributes, 'stroke-width') / 2;
  const points = flattenPath(attributes.d ?? '');
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return {
    fill: null,
    stroke,
    bbox: [
      Math.min(...xs) - half,
      Math.min(...ys) - half,
      Math.max(...xs) + half,
      Math.max(...ys) + half,
    ],
    inFill: () => false,
    inStroke(u, v) {
      for (let k = 1; k < points.length; k++) {
        if (distanceToSegmentSquared(u, v, points[k - 1], points[k]) <= half * half) return true;
      }
      return false;
    },
    reach: (x, y) => Math.max(...points.map(([px, py]) => Math.hypot(px - x, py - y) + half)),
  };
}

function parseMaster(svg) {
  const withoutComments = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/<\?xml[^>]*\?>/, '');
  const inner = /<svg\b[^>]*>([\s\S]*)<\/svg>/.exec(withoutComments)?.[1];
  if (inner === undefined) throw new Error('Master is not an <svg> document');

  const shapes = [];
  const markup = [];
  for (const [element, tag, rawAttributes] of inner.matchAll(/<(\w+)\b([^>]*?)\/>/g)) {
    const a = parseAttributes(rawAttributes);
    const fill = parseColor(a.fill);
    const stroke = parseColor(a.stroke);
    const strokeWidth = stroke ? num(a, 'stroke-width') : 0;
    if (tag === 'circle') {
      const r = num(a, 'r');
      shapes.push(ellipseShape(num(a, 'cx'), num(a, 'cy'), r, r, fill, stroke, strokeWidth));
    } else if (tag === 'ellipse') {
      shapes.push(
        ellipseShape(
          num(a, 'cx'),
          num(a, 'cy'),
          num(a, 'rx'),
          num(a, 'ry'),
          fill,
          stroke,
          strokeWidth,
        ),
      );
    } else if (tag === 'path') {
      shapes.push(pathShape(a));
    } else {
      throw new Error(`Unsupported element <${tag}> in the master`);
    }
    markup.push(element);
  }
  const leftover = inner.replace(/<(\w+)\b([^>]*?)\/>/g, '').trim();
  if (leftover !== '')
    throw new Error(`Unsupported markup in the master: ${leftover.slice(0, 60)}`);
  if (shapes.length === 0) throw new Error('Master has no shapes');
  return { shapes, markup };
}

// ---------------------------------------------------------------------------
// Layout and rasterization

function placement(shapes, size, layoutName) {
  const layout = LAYOUTS[layoutName];
  const artworkReach = Math.max(...shapes.map((s) => s.reach(ARTWORK_CENTER.x, ARTWORK_CENTER.y)));
  const scale = (layout.reach * size) / artworkReach;
  return {
    scale,
    offsetX: size / 2 - ARTWORK_CENTER.x * scale,
    offsetY: size / 2 - ARTWORK_CENTER.y * scale,
    cornerRadius: layout.corner * size,
  };
}

function insideRoundedSquare(x, y, size, radius) {
  if (x < 0 || y < 0 || x > size || y > size) return false;
  if (radius === 0) return true;
  const qx = Math.max(Math.abs(x - size / 2) - (size / 2 - radius), 0);
  const qy = Math.max(Math.abs(y - size / 2) - (size / 2 - radius), 0);
  return qx * qx + qy * qy <= radius * radius;
}

/** Returns raw PNG scanlines: per row, filter byte 0 followed by RGBA pixels. */
function rasterize(shapes, size, layoutName) {
  const { scale, offsetX, offsetY, cornerRadius } = placement(shapes, size, layoutName);
  const background = parseColor(BACKGROUND);
  const samples = SUPERSAMPLING * SUPERSAMPLING;
  const rowLength = size * 4 + 1;
  const raw = Buffer.alloc(rowLength * size);

  for (let y = 0; y < size; y++) {
    raw[y * rowLength] = 0;
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let alpha = 0;
      for (let sy = 0; sy < SUPERSAMPLING; sy++) {
        for (let sx = 0; sx < SUPERSAMPLING; sx++) {
          const px = x + (sx + 0.5) / SUPERSAMPLING;
          const py = y + (sy + 0.5) / SUPERSAMPLING;
          let color = insideRoundedSquare(px, py, size, cornerRadius) ? background : null;
          const u = (px - offsetX) / scale;
          const v = (py - offsetY) / scale;
          for (const shape of shapes) {
            const [minX, minY, maxX, maxY] = shape.bbox;
            if (u < minX || u > maxX || v < minY || v > maxY) continue;
            if (shape.fill && shape.inFill(u, v)) color = shape.fill;
            if (shape.stroke && shape.inStroke(u, v)) color = shape.stroke;
          }
          if (color) {
            r += color[0];
            g += color[1];
            b += color[2];
            alpha += 1;
          }
        }
      }
      const offset = y * rowLength + 1 + x * 4;
      if (alpha > 0) {
        raw[offset] = Math.round(r / alpha);
        raw[offset + 1] = Math.round(g / alpha);
        raw[offset + 2] = Math.round(b / alpha);
        raw[offset + 3] = Math.round((alpha / samples) * 255);
      }
    }
  }
  return raw;
}

// ---------------------------------------------------------------------------
// PNG encoding (RGBA, 8 bits per channel, no interlace)

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

function encodePng(size, raw) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // color type: RGBA
  header[10] = 0; // compression: deflate
  header[11] = 0; // filter method
  header[12] = 0; // interlace: none
  return Buffer.concat([
    PNG_SIGNATURE,
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Decompressed scanlines of a PNG written by encodePng (used by --check). */
function readPngScanlines(file) {
  const parts = [];
  let offset = PNG_SIGNATURE.length;
  while (offset < file.length) {
    const length = file.readUInt32BE(offset);
    const type = file.toString('latin1', offset + 4, offset + 8);
    if (type === 'IDAT') parts.push(file.subarray(offset + 8, offset + 8 + length));
    offset += 12 + length;
  }
  return inflateSync(Buffer.concat(parts));
}

// ---------------------------------------------------------------------------
// SVG output

function composeSvg(markup, size, layoutName, shapes) {
  const { scale, offsetX, offsetY, cornerRadius } = placement(shapes, size, layoutName);
  const round = (n) => Number(n.toFixed(4));
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`,
    `<rect width="${size}" height="${size}" rx="${round(cornerRadius)}" fill="${BACKGROUND}"/>`,
    `<g transform="translate(${round(offsetX)} ${round(offsetY)}) scale(${round(scale)})">`,
    ...markup,
    '</g>',
    '</svg>',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------

/** Missing or unreadable files count as stale in --check mode. */
function readOrNull(read) {
  try {
    return read();
  } catch {
    return null;
  }
}

function main() {
  const check = process.argv.includes('--check');
  const { shapes, markup } = parseMaster(readFileSync(MASTER_PATH, 'utf8'));
  const stale = [];

  for (const { file, size, layout } of PNG_OUTPUTS) {
    const target = path.join(PUBLIC_DIR, file);
    const raw = rasterize(shapes, size, layout);
    if (check) {
      // Compare pixels, not bytes: another zlib build may compress differently.
      const current = readOrNull(() => readPngScanlines(readFileSync(target)));
      if (!current?.equals(raw)) stale.push(file);
    } else {
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, encodePng(size, raw));
      console.log(`wrote ${file} (${size}x${size}, ${layout})`);
    }
  }

  for (const { file, size, layout } of SVG_OUTPUTS) {
    const target = path.join(PUBLIC_DIR, file);
    const svg = composeSvg(markup, size, layout, shapes);
    if (check) {
      // Git on Windows may check text files out with CRLF line endings.
      const current = readOrNull(() => readFileSync(target, 'utf8').replace(/\r\n/g, '\n'));
      if (current !== svg) stale.push(file);
    } else {
      writeFileSync(target, svg);
      console.log(`wrote ${file} (${layout})`);
    }
  }

  if (check) {
    if (stale.length > 0) {
      console.error(`Stale icons (run "pnpm --filter ./app icons"): ${stale.join(', ')}`);
      process.exitCode = 1;
    } else {
      console.log('Icons are up to date.');
    }
  }
}

main();

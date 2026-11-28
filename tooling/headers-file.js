// Minimal parser for Cloudflare `_headers` files (pure Node, no dependencies).
//
// It supports only the subset of the syntax this repository uses, as documented at
// https://developers.cloudflare.com/workers/static-assets/headers/ (checked 2026-11-26):
// - a non-indented line starting with "/" opens a rule (path pattern);
// - indented "Name: value" lines add a header to the current rule;
// - indented "! Name" lines detach a header added by an earlier matching rule;
// - "#" lines are comments; blank lines are ignored;
// - at most one "*" splat per path; it matches any characters, including "/".
// Every matching rule applies in file order; repeated headers are joined with ", ".
// Unsupported syntax (absolute URLs, :placeholders) throws instead of being guessed.

export const MAX_RULES = 100;
export const MAX_LINE_LENGTH = 2000;

/**
 * @typedef {{ type: 'set', name: string, value: string } | { type: 'detach', name: string }} HeaderOp
 * @typedef {{ path: string, ops: HeaderOp[] }} HeaderRule
 */

/**
 * @param {string} text
 * @returns {HeaderRule[]}
 */
export function parseHeadersFile(text) {
  /** @type {HeaderRule[]} */
  const rules = [];
  /** @type {HeaderRule | undefined} */
  let current;

  const lines = text.split(/\r?\n/);
  lines.forEach((raw, index) => {
    const lineNo = index + 1;
    if (raw.length > MAX_LINE_LENGTH) {
      throw new Error(`_headers line ${lineNo} exceeds ${MAX_LINE_LENGTH} characters`);
    }
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) return;

    const indented = /^\s/.test(raw);
    if (!indented) {
      if (!line.startsWith('/')) {
        throw new Error(`_headers line ${lineNo}: unsupported rule "${line}" (use a path)`);
      }
      if ((line.match(/\*/g) ?? []).length > 1) {
        throw new Error(`_headers line ${lineNo}: only one splat (*) is allowed`);
      }
      if (/\/:[A-Za-z]/.test(line)) {
        throw new Error(`_headers line ${lineNo}: placeholders are not supported`);
      }
      current = { path: line, ops: [] };
      rules.push(current);
      return;
    }

    if (!current) {
      throw new Error(`_headers line ${lineNo}: header without a path rule`);
    }
    if (line.startsWith('!')) {
      const name = line.slice(1).trim();
      if (name === '') throw new Error(`_headers line ${lineNo}: empty detach`);
      current.ops.push({ type: 'detach', name });
      return;
    }
    const colon = line.indexOf(':');
    if (colon <= 0) {
      throw new Error(`_headers line ${lineNo}: expected "Name: value"`);
    }
    const name = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (!/^[A-Za-z0-9-]+$/.test(name) || value === '') {
      throw new Error(`_headers line ${lineNo}: invalid header "${line}"`);
    }
    current.ops.push({ type: 'set', name, value });
  });

  if (rules.length > MAX_RULES) {
    throw new Error(`_headers has ${rules.length} rules; the limit is ${MAX_RULES}`);
  }
  return rules;
}

/**
 * @param {string} pattern
 * @param {string} pathname
 */
export function pathMatches(pattern, pathname) {
  const star = pattern.indexOf('*');
  if (star === -1) return pattern === pathname;
  const prefix = pattern.slice(0, star);
  const suffix = pattern.slice(star + 1);
  return (
    pathname.length >= prefix.length + suffix.length &&
    pathname.startsWith(prefix) &&
    pathname.endsWith(suffix)
  );
}

/**
 * Headers for one request path, keyed by lower-case name.
 * @param {HeaderRule[]} rules
 * @param {string} pathname
 * @returns {Map<string, { name: string, value: string }>}
 */
export function headersForPath(rules, pathname) {
  /** @type {Map<string, { name: string, value: string }>} */
  const headers = new Map();
  for (const rule of rules) {
    if (!pathMatches(rule.path, pathname)) continue;
    for (const op of rule.ops) {
      const key = op.name.toLowerCase();
      if (op.type === 'detach') {
        headers.delete(key);
        continue;
      }
      const existing = headers.get(key);
      headers.set(
        key,
        existing
          ? { name: existing.name, value: `${existing.value}, ${op.value}` }
          : { name: op.name, value: op.value },
      );
    }
  }
  return headers;
}

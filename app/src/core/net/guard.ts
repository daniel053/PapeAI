// Network guard: every request the app makes must go to an origin on the
// allowlist. This is a second line of defense behind the CSP `connect-src`
// header (docs/seguranca/seguranca-web-headers-csp-robots.md).

/** Allowlist entry meaning "the origin the app is served from". */
export const SELF = 'self';

export class NetworkBlockedError extends Error {
  override readonly name = 'NetworkBlockedError';
  /** Only the origin is kept: full URLs may carry secrets in the query. */
  readonly blockedOrigin: string;

  constructor(blockedOrigin: string) {
    super(`Network request blocked: ${blockedOrigin} is not on the allowlist.`);
    this.blockedOrigin = blockedOrigin;
  }
}

function isHttp(url: URL): boolean {
  return url.protocol === 'https:' || url.protocol === 'http:';
}

function parseSelfOrigin(selfOrigin: string): string {
  const url = new URL(selfOrigin);
  if (!isHttp(url)) {
    throw new Error(`Invalid self origin: ${selfOrigin}`);
  }
  return url.origin;
}

/**
 * Turns allowlist entries into a set of exact origins.
 * External entries must be bare HTTPS origins (no path, query, credentials).
 */
export function resolveAllowlist(
  entries: readonly string[],
  selfOrigin: string,
): ReadonlySet<string> {
  const self = parseSelfOrigin(selfOrigin);
  const origins = new Set<string>();

  for (const entry of entries) {
    if (entry === SELF) {
      origins.add(self);
      continue;
    }
    let url: URL;
    try {
      url = new URL(entry);
    } catch {
      throw new Error(`Invalid allowlist entry: ${entry}`);
    }
    if (url.protocol !== 'https:' || url.origin !== entry) {
      throw new Error(`Allowlist entries must be bare https origins: ${entry}`);
    }
    origins.add(url.origin);
  }

  return origins;
}

/** True only for http(s) URLs whose exact origin is on the allowlist. */
export function isAllowedUrl(
  input: string | URL,
  allowedOrigins: ReadonlySet<string>,
  selfOrigin: string,
): boolean {
  let url: URL;
  try {
    url = new URL(input, selfOrigin);
  } catch {
    return false;
  }
  if (!isHttp(url)) return false;
  if (url.username !== '' || url.password !== '') return false;
  return allowedOrigins.has(url.origin);
}

function originForError(input: string | URL, selfOrigin: string): string {
  try {
    const url = new URL(input, selfOrigin);
    return isHttp(url) ? url.origin : url.protocol;
  } catch {
    return '<invalid url>';
  }
}

export interface GuardedFetchOptions {
  /** Entries such as `'self'` or `'https://api.anthropic.com'`. */
  allowlist: readonly string[];
  /** Origin the app is served from, e.g. `window.location.origin`. */
  selfOrigin: string;
  /** Injected for tests; defaults to the global fetch. */
  fetchImpl?: typeof fetch;
}

/**
 * Returns a fetch that rejects with NetworkBlockedError (without sending
 * anything) when the destination is not allowed. Redirects are refused so an
 * allowed origin cannot bounce the request somewhere else.
 */
export function createGuardedFetch(options: GuardedFetchOptions): typeof fetch {
  const selfOrigin = parseSelfOrigin(options.selfOrigin);
  const allowedOrigins = resolveAllowlist(options.allowlist, selfOrigin);

  return (input, init) => {
    const target = input instanceof Request ? input.url : input;
    if (!isAllowedUrl(target, allowedOrigins, selfOrigin)) {
      return Promise.reject(new NetworkBlockedError(originForError(target, selfOrigin)));
    }
    const fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
    return fetchImpl(input, { ...init, redirect: 'error' });
  };
}

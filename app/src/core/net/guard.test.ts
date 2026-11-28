import { describe, expect, it, vi } from 'vitest';
import { NetworkBlockedError, createGuardedFetch, isAllowedUrl, resolveAllowlist } from './index';

const SELF_ORIGIN = 'https://app.papeai.test';
const ANTHROPIC = 'https://api.anthropic.com';

describe('resolveAllowlist', () => {
  it('maps "self" to the app origin', () => {
    expect([...resolveAllowlist(['self'], SELF_ORIGIN)]).toEqual([SELF_ORIGIN]);
  });

  it('accepts bare https origins', () => {
    expect(resolveAllowlist(['self', ANTHROPIC], SELF_ORIGIN).has(ANTHROPIC)).toBe(true);
  });

  it.each([
    'http://api.anthropic.com',
    'https://api.anthropic.com/',
    'https://api.anthropic.com/v1',
    'https://api.anthropic.com?x=1',
    'https://user:pass@api.anthropic.com',
    '*.anthropic.com',
    'not a url',
  ])('rejects malformed entry %s', (entry) => {
    expect(() => resolveAllowlist([entry], SELF_ORIGIN)).toThrow();
  });

  it('rejects a non-http self origin', () => {
    expect(() => resolveAllowlist(['self'], 'file:///C:/app')).toThrow();
  });
});

describe('isAllowedUrl', () => {
  const allowed = resolveAllowlist(['self', ANTHROPIC], SELF_ORIGIN);
  const check = (url: string) => isAllowedUrl(url, allowed, SELF_ORIGIN);

  it.each([
    '/api/health',
    'assets/logo.svg',
    `${SELF_ORIGIN}/index.html`,
    `${ANTHROPIC}/v1/messages`,
  ])('allows %s', (url) => {
    expect(check(url)).toBe(true);
  });

  it.each([
    ['another site', 'https://evil.example/collect'],
    ['look-alike suffix', 'https://api.anthropic.com.evil.example/v1/messages'],
    ['sibling subdomain', 'https://console.anthropic.com/'],
    ['downgrade to http', 'http://api.anthropic.com/v1/messages'],
    ['different port', 'https://api.anthropic.com:8443/v1/messages'],
    ['credentials trick', `https://app.papeai.test@evil.example/`],
    ['credentials on allowed host', `${ANTHROPIC.replace('https://', 'https://u:p@')}/v1`],
    ['protocol-relative', '//evil.example/x'],
    ['data url', 'data:text/plain,hello'],
    ['javascript url', 'javascript:alert(1)'],
    ['blob url', `blob:${SELF_ORIGIN}/1234`],
    ['websocket', 'wss://api.anthropic.com/'],
  ])('blocks %s', (_label, url) => {
    expect(check(url)).toBe(false);
  });
});

describe('createGuardedFetch', () => {
  function setup(allowlist: readonly string[] = ['self']) {
    const fetchImpl = vi.fn<typeof fetch>(() => Promise.resolve(new Response('ok')));
    const guardedFetch = createGuardedFetch({ allowlist, selfOrigin: SELF_ORIGIN, fetchImpl });
    return { fetchImpl, guardedFetch };
  }

  it('starts with only the app origin allowed', async () => {
    const { fetchImpl, guardedFetch } = setup();
    await expect(guardedFetch(`${ANTHROPIC}/v1/messages`)).rejects.toBeInstanceOf(
      NetworkBlockedError,
    );
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('forwards allowed requests and refuses redirects', async () => {
    const { fetchImpl, guardedFetch } = setup();
    const response = await guardedFetch('/version.json', { method: 'GET' });
    expect(await response.text()).toBe('ok');
    expect(fetchImpl).toHaveBeenCalledWith('/version.json', { method: 'GET', redirect: 'error' });
  });

  it('checks the URL inside Request objects', async () => {
    const { fetchImpl, guardedFetch } = setup();
    await expect(guardedFetch(new Request('https://evil.example/x'))).rejects.toBeInstanceOf(
      NetworkBlockedError,
    );
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('checks URL objects', async () => {
    const { guardedFetch } = setup(['self', ANTHROPIC]);
    await expect(guardedFetch(new URL('/v1/messages', ANTHROPIC))).resolves.toBeInstanceOf(
      Response,
    );
  });

  it('reports only the origin, never the full URL', async () => {
    const { guardedFetch } = setup();
    const error = await guardedFetch('https://evil.example/path?token=secret-value').catch(
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(NetworkBlockedError);
    const blocked = error as NetworkBlockedError;
    expect(blocked.blockedOrigin).toBe('https://evil.example');
    expect(blocked.message).not.toContain('secret-value');
  });
});

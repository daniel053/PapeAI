// Critical test `lint.vault-imports` (docs/processo/testes-e-qualidade.md):
// proves the security rules in eslint.config.js are active. If a rule is
// removed or weakened, one of these cases fails.
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const eslint = new ESLint({ cwd: repoRoot });

async function ruleIdsFor(code: string, filePath: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath });
  if (!result) throw new Error('ESLint returned no result');
  const fatal = result.messages.find((m) => m.fatal);
  if (fatal) throw new Error(`Parse error in fixture: ${fatal.message}`);
  return result.messages.map((m) => m.ruleId ?? 'unknown');
}

const FEATURE = 'app/src/features/home/Fixture.tsx';

describe('vault import boundary', () => {
  it.each([
    ['relative import', "import { x } from '../../core/vault';\nexport { x };"],
    ['deep import', "import { x } from '../../core/vault/store';\nexport { x };"],
    ['type-only import', "import type { X } from '../../core/vault';\nexport type { X };"],
    ['re-export', "export * from '../../core/vault';"],
    ['dynamic import', "export const load = () => import('../../core/vault');"],
  ])('blocks %s from a feature', async (_label, code) => {
    expect(await ruleIdsFor(code, FEATURE)).toContain('papeai/restricted-modules');
  });

  it.each([
    ['app/src/core/net/Fixture.ts', '../vault'],
    ['app/src/core/tutor/Fixture.ts', '../vault'],
    ['app/src/core/tutor/deep/Fixture.ts', '../../vault/store'],
    ['app/src/ui/Fixture.tsx', '../core/vault'],
    ['app/src/app/Fixture.tsx', '../core/vault/index'],
    ['app/src/features/home/Fixture.tsx', '@/core/vault'],
  ])('blocks the vault from %s (%s)', async (filePath, specifier) => {
    const ids = await ruleIdsFor(`import { x } from '${specifier}';\nexport { x };`, filePath);
    expect(ids).toContain('papeai/restricted-modules');
  });

  it('ignores folders that only look similar', async () => {
    const ids = await ruleIdsFor(
      "import { x } from '../core/vault-ui';\nexport { x };",
      'app/src/ui/Fixture.tsx',
    );
    expect(ids).not.toContain('papeai/restricted-modules');
  });

  it('allows the LLM client to use the vault', async () => {
    const ids = await ruleIdsFor(
      "import { x } from '../vault';\nexport { x };",
      'app/src/core/llm/Fixture.ts',
    );
    expect(ids).not.toContain('papeai/restricted-modules');
  });

  it('keeps the network away from the vault', async () => {
    const ids = await ruleIdsFor(
      "import { x } from '../net';\nexport { x };",
      'app/src/core/vault/Fixture.ts',
    );
    expect(ids).toContain('papeai/restricted-modules');
  });
});

describe('network boundary', () => {
  it('blocks features from importing core/net', async () => {
    const ids = await ruleIdsFor("import { x } from '../../core/net';\nexport { x };", FEATURE);
    expect(ids).toContain('papeai/restricted-modules');
  });

  it.each([
    ['global fetch', "export const go = () => fetch('/x');", 'no-restricted-globals'],
    ['window.fetch', "export const go = () => window.fetch('/x');", 'no-restricted-properties'],
    ['XMLHttpRequest', 'export const x = new XMLHttpRequest();', 'no-restricted-globals'],
    ['WebSocket', "export const ws = new WebSocket('wss://x');", 'no-restricted-globals'],
    [
      'sendBeacon',
      "export const go = () => navigator.sendBeacon('/x');",
      'no-restricted-properties',
    ],
  ])('blocks direct %s outside core/net', async (_label, code, rule) => {
    expect(await ruleIdsFor(code, FEATURE)).toContain(rule);
  });

  it('lets core/net call fetch', async () => {
    const ids = await ruleIdsFor(
      "export const go = () => globalThis.fetch('/x');",
      'app/src/core/net/Fixture.ts',
    );
    expect(ids).toEqual([]);
  });
});

describe('raw HTML and code evaluation', () => {
  it.each([
    [
      'dangerouslySetInnerHTML',
      'export const A = (p: { h: string }) => <div dangerouslySetInnerHTML={{ __html: p.h }} />;',
      'no-restricted-syntax',
    ],
    [
      'innerHTML',
      "export const f = (el: HTMLElement) => { el.innerHTML = '<b>x</b>'; };",
      'no-restricted-syntax',
    ],
    [
      'computed innerHTML',
      "export const f = (el: HTMLElement) => { el['innerHTML'] = 'x'; };",
      'no-restricted-syntax',
    ],
    [
      'outerHTML',
      "export const f = (el: HTMLElement) => { el.outerHTML = 'x'; };",
      'no-restricted-syntax',
    ],
    [
      'insertAdjacentHTML',
      "export const f = (el: HTMLElement) => el.insertAdjacentHTML('beforeend', 'x');",
      'no-restricted-syntax',
    ],
    ['document.write', "export const f = () => document.write('x');", 'no-restricted-syntax'],
    ['eval', "export const f = () => eval('1 + 1');", 'no-eval'],
    ['new Function', "export const f = () => new Function('return 1');", 'no-new-func'],
    ['string setTimeout', "export const f = () => setTimeout('go()', 1);", 'no-implied-eval'],
  ])('blocks %s', async (_label, code, rule) => {
    expect(await ruleIdsFor(code, FEATURE)).toContain(rule);
  });

  it('accepts ordinary React text rendering', async () => {
    const ids = await ruleIdsFor('export const A = (p: { t: string }) => <p>{p.t}</p>;', FEATURE);
    expect(ids).toEqual([]);
  });
});

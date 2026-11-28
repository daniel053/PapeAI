import { describe, expect, it } from 'vitest';
import { createI18n, detectInitialLanguage } from './index';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

function keysOf(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keysOf(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('locales', () => {
  it('pt-BR and en have exactly the same keys', () => {
    expect(keysOf(en).sort()).toEqual(keysOf(ptBR).sort());
  });

  it('has no empty strings', () => {
    for (const locale of [ptBR, en]) {
      const empty = keysOf(locale).filter((key) => {
        const value = key.split('.').reduce<unknown>((node, part) => {
          return (node as Record<string, unknown>)[part];
        }, locale);
        return typeof value !== 'string' || value.trim() === '';
      });
      expect(empty).toEqual([]);
    }
  });
});

describe('detectInitialLanguage', () => {
  it.each([
    [null, ['pt-BR'], 'pt-BR'],
    [null, ['pt-PT', 'en-US'], 'pt-BR'],
    [null, ['en-GB'], 'en'],
    [null, ['fr-FR', 'en-US'], 'en'],
    [null, ['fr-FR'], 'pt-BR'],
    [null, [], 'pt-BR'],
    ['en', ['pt-BR'], 'en'],
    ['xx', ['en-US'], 'en'],
  ] as const)('saved=%s browser=%j -> %s', (saved, browser, expected) => {
    expect(detectInitialLanguage(saved, browser)).toBe(expected);
  });
});

describe('createI18n', () => {
  it('switches between pt-BR and en', async () => {
    const i18n = await createI18n('pt-BR');
    expect(i18n.t('language.label')).toBe('Idioma da interface');
    await i18n.changeLanguage('en');
    expect(i18n.t('language.label')).toBe('Interface language');
  });
});

import { describe, expect, it } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyThemeAttribute,
  parseThemePreference,
  readThemePreference,
  resolveTheme,
  saveThemePreference,
  themeAttributeFor,
} from './theme';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    data,
  };
}

const throwingStorage = {
  getItem: (): string | null => {
    throw new Error('blocked');
  },
  setItem: (): void => {
    throw new Error('blocked');
  },
};

describe('resolveTheme', () => {
  it.each([
    ['system', false, 'light'],
    ['system', true, 'dark'],
    ['light', true, 'light'],
    ['light', false, 'light'],
    ['dark', false, 'dark'],
    ['dark', true, 'dark'],
  ] as const)('%s with system dark=%s -> %s', (preference, systemDark, expected) => {
    expect(resolveTheme(preference, systemDark)).toBe(expected);
  });
});

describe('parseThemePreference', () => {
  it.each([
    ['light', 'light'],
    ['dark', 'dark'],
    ['system', 'system'],
    [null, 'system'],
    [undefined, 'system'],
    ['', 'system'],
    ['DARK', 'system'],
    ['purple', 'system'],
  ] as const)('%j -> %s', (raw, expected) => {
    expect(parseThemePreference(raw)).toBe(expected);
  });
});

describe('themeAttributeFor / applyThemeAttribute', () => {
  it('leaves "system" to the CSS media query', () => {
    expect(themeAttributeFor('system')).toBeNull();
  });

  it('sets and removes data-theme on the root element', () => {
    const attributes = new Map<string, string>();
    const root = {
      setAttribute: (name: string, value: string) => void attributes.set(name, value),
      removeAttribute: (name: string) => void attributes.delete(name),
    };
    applyThemeAttribute(root, 'dark');
    expect(attributes.get('data-theme')).toBe('dark');
    applyThemeAttribute(root, 'light');
    expect(attributes.get('data-theme')).toBe('light');
    applyThemeAttribute(root, 'system');
    expect(attributes.has('data-theme')).toBe(false);
  });
});

describe('theme preference storage', () => {
  it('round-trips a saved preference', () => {
    const storage = memoryStorage();
    saveThemePreference(storage, 'dark');
    expect(storage.data.get(THEME_STORAGE_KEY)).toBe('dark');
    expect(readThemePreference(storage)).toBe('dark');
  });

  it('falls back to "system" for missing, invalid or blocked storage', () => {
    expect(readThemePreference(null)).toBe('system');
    expect(readThemePreference(memoryStorage({ [THEME_STORAGE_KEY]: 'neon' }))).toBe('system');
    expect(readThemePreference(throwingStorage)).toBe('system');
  });

  it('does not throw when saving is blocked', () => {
    expect(() => saveThemePreference(throwingStorage, 'light')).not.toThrow();
    expect(() => saveThemePreference(null, 'light')).not.toThrow();
  });
});

// Theme preference logic, kept free of React and of the DOM so it can be
// unit-tested in Node.

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'papeai.theme';
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value);
}

/** Turns a stored value (possibly missing or garbage) into a valid preference. */
export function parseThemePreference(raw: string | null | undefined): ThemePreference {
  return isThemePreference(raw) ? raw : DEFAULT_THEME_PREFERENCE;
}

/** The theme actually shown, given the preference and the OS setting. */
export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light';
  return preference;
}

/**
 * Value of `<html data-theme>`. For "system" the attribute is removed and the
 * CSS media query `prefers-color-scheme` decides, which also covers the moment
 * before JavaScript runs.
 */
export function themeAttributeFor(preference: ThemePreference): ResolvedTheme | null {
  return preference === 'system' ? null : preference;
}

interface AttributeTarget {
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

export function applyThemeAttribute(root: AttributeTarget, preference: ThemePreference): void {
  const value = themeAttributeFor(preference);
  if (value) root.setAttribute('data-theme', value);
  else root.removeAttribute('data-theme');
}

type PreferenceStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Reads the saved preference; storage can be missing or throw (private mode). */
export function readThemePreference(storage: PreferenceStorage | null): ThemePreference {
  try {
    return parseThemePreference(storage?.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME_PREFERENCE;
  }
}

/** Saves the preference. Not critical: on failure it just will not survive a reload. */
export function saveThemePreference(
  storage: PreferenceStorage | null,
  preference: ThemePreference,
): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Ignored on purpose (see above).
  }
}

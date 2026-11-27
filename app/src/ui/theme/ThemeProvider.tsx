import {
  createContext,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  THEME_STORAGE_KEY,
  applyThemeAttribute,
  parseThemePreference,
  readThemePreference,
  resolveTheme,
  saveThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

interface ThemeContextValue {
  preference: ThemePreference;
  /** What is on screen right now (resolves "system"). */
  resolvedTheme: ResolvedTheme;
  setPreference(preference: ThemePreference): void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DARK_QUERY = '(prefers-color-scheme: dark)';

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null; // storage can be blocked (private mode, strict settings)
  }
}

function subscribeToSystemTheme(onChange: () => void): () => void {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const systemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;
const noSystemPreference = () => false;

/**
 * Applies the saved theme to `<html data-theme>` without an inline script
 * (strict CSP). Until this runs, the CSS follows the OS setting, so a user who
 * picked a theme different from the OS may see a brief flash on load.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readThemePreference(browserStorage()),
  );
  const systemDark = useSyncExternalStore(
    subscribeToSystemTheme,
    systemPrefersDark,
    noSystemPreference,
  );

  useLayoutEffect(() => {
    applyThemeAttribute(document.documentElement, preference);
  }, [preference]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) setPreferenceState(parseThemePreference(event.newValue));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    saveThemePreference(browserStorage(), next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, resolvedTheme: resolveTheme(preference, systemDark), setPreference }),
    [preference, systemDark, setPreference],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
  return context;
}

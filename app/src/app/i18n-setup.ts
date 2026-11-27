import type { i18n } from 'i18next';
import { createI18n, detectInitialLanguage } from '../core/i18n';

const STORAGE_KEY = 'papeai.ui-language';

function readSavedLanguage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage can be blocked (private mode, strict settings)
  }
}

function saveLanguage(language: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Not critical: the choice just will not survive a reload.
  }
}

/** Starts i18n, keeps <html lang> in sync and remembers the user's choice. */
export async function setupI18n(): Promise<i18n> {
  const language = detectInitialLanguage(readSavedLanguage(), navigator.languages);
  const instance = await createI18n(language);
  document.documentElement.lang = instance.language;
  instance.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
    saveLanguage(lng);
  });
  return instance;
}

export const SUPPORTED_LANGUAGES = ['pt-BR', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'pt-BR';

export function isLanguage(value: unknown): value is Language {
  return SUPPORTED_LANGUAGES.some((lang) => lang === value);
}

/**
 * Picks the interface language: a saved choice wins; otherwise the first
 * browser language we support (any `pt-*` maps to pt-BR, any `en-*` to en);
 * otherwise pt-BR.
 */
export function detectInitialLanguage(
  saved: string | null,
  browserLanguages: readonly string[],
): Language {
  if (isLanguage(saved)) return saved;
  for (const tag of browserLanguages) {
    const base = tag.toLowerCase().split('-')[0];
    if (base === 'pt') return 'pt-BR';
    if (base === 'en') return 'en';
  }
  return DEFAULT_LANGUAGE;
}

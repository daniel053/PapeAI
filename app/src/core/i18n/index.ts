import i18next, { type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type Language } from './languages';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

export {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  detectInitialLanguage,
  isLanguage,
  type Language,
} from './languages';

export const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
} as const;

/** Creates the i18next instance used by React. All strings ship with the app. */
export async function createI18n(language: Language): Promise<i18n> {
  const instance = i18next.createInstance();
  await instance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'pt-BR',
    supportedLngs: SUPPORTED_LANGUAGES,
    // React already escapes text; escaping twice would show "&amp;" etc.
    interpolation: { escapeValue: false },
  });
  return instance;
}

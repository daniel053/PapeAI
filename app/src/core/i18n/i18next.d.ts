import 'i18next';
import type ptBR from './locales/pt-BR.json';

// Makes `t('some.key')` a type error when the key does not exist.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof ptBR };
  }
}

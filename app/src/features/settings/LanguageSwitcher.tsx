import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../core/i18n';
import { cx } from '../../ui';

/** Two toggle buttons, one tap to switch. The active one is filled and pressed. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();

  return (
    <div role="group" aria-label={t('language.label')} className={cx('flex gap-1', className)}>
      {SUPPORTED_LANGUAGES.map((lang) => {
        const active = i18n.resolvedLanguage === lang;
        return (
          <button
            key={lang}
            type="button"
            lang={lang}
            aria-pressed={active}
            onClick={() => void i18n.changeLanguage(lang)}
            className={cx(
              'min-h-11 rounded-control border-2 px-3 text-sm font-semibold transition-colors duration-150',
              active
                ? 'border-primary-600 bg-primary-600 text-on-primary'
                : 'border-line-200 text-ink-600 hover:bg-primary-50 hover:text-ink-900',
            )}
          >
            {t(`language.${lang}`)}
          </button>
        );
      })}
    </div>
  );
}

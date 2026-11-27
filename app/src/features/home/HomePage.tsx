import { useTranslation } from 'react-i18next';
import { MascotPlaceholder } from '../../mascot/MascotPlaceholder';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center gap-6 text-center">
      <MascotPlaceholder label={t('mascot.placeholderLabel')} className="size-40 sm:size-48" />
      <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
        {t('home.title')}
      </h1>
      <p className="max-w-prose text-lg text-ink-600">{t('home.intro')}</p>
      <p className="max-w-prose rounded-card border border-line-200 bg-primary-50 p-4 font-medium text-ink-900">
        {t('home.keyPromise')}
      </p>
      <p className="text-sm text-ink-600">{t('home.status')}</p>
    </section>
  );
}

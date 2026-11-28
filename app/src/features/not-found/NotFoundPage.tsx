import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { buttonClassName } from '../../ui';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center gap-4 text-center">
      <h1 className="font-display text-3xl font-extrabold text-ink-900">{t('notFound.title')}</h1>
      <p className="text-ink-600">{t('notFound.body')}</p>
      <Link to="/" className={buttonClassName({ size: 'lg' })}>
        {t('notFound.back')}
      </Link>
    </section>
  );
}

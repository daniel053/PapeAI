import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Card,
  DeviceIcon,
  MoonIcon,
  RadioGroup,
  SunIcon,
  useTheme,
  type RadioOption,
  type ThemePreference,
} from '../../ui';
import { LanguageSwitcher } from './LanguageSwitcher';

export function SettingsPage() {
  const { t } = useTranslation();
  const { preference, resolvedTheme, setPreference } = useTheme();

  const themeOptions: RadioOption<ThemePreference>[] = [
    {
      value: 'system',
      label: t('settings.themeSystem'),
      description: t('settings.themeSystemHint'),
      icon: <DeviceIcon className="size-5" />,
    },
    { value: 'light', label: t('settings.themeLight'), icon: <SunIcon className="size-5" /> },
    { value: 'dark', label: t('settings.themeDark'), icon: <MoonIcon className="size-5" /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink-900">{t('settings.title')}</h1>
        <p className="mt-2 text-ink-600">{t('settings.intro')}</p>
      </header>

      <Card title={t('settings.languageTitle')} description={t('settings.languageDescription')}>
        <LanguageSwitcher />
      </Card>

      <Card title={t('settings.themeTitle')}>
        <RadioGroup
          legend={t('settings.themeLegend')}
          name="theme"
          options={themeOptions}
          value={preference}
          onChange={setPreference}
        />
        <p className="mt-3 text-sm text-ink-600">
          {resolvedTheme === 'dark' ? t('settings.themeNowDark') : t('settings.themeNowLight')}
        </p>
      </Card>

      {import.meta.env.DEV && (
        <p>
          <Link
            to="/dev/componentes"
            className="font-semibold text-primary-600 underline underline-offset-4"
          >
            {t('settings.galleryLink')}
          </Link>
        </p>
      )}
    </div>
  );
}

// Development-only page (route registered only when import.meta.env.DEV).
// Shows every design system component so the owner can try them by mouse,
// touch, keyboard and screen reader, in light and dark themes.
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Dialog,
  DeviceIcon,
  MoonIcon,
  RadioGroup,
  SunIcon,
  Switch,
  Tabs,
  TextField,
  useTheme,
  useToast,
  type ThemePreference,
} from '../../ui';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-2xl font-bold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

export function ComponentGalleryPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { preference, setPreference } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [saving, setSaving] = useState(false);

  const fakeSave = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 2000);
  };

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="font-display text-3xl font-extrabold text-ink-900">{t('gallery.title')}</h1>
        <p className="mt-2 text-ink-600">{t('gallery.intro')}</p>
      </header>

      <Section title={t('gallery.buttons')}>
        <div className="flex flex-wrap items-center gap-3">
          <Button>{t('gallery.primary')}</Button>
          <Button variant="secondary">{t('gallery.secondary')}</Button>
          <Button variant="ghost">{t('gallery.ghost')}</Button>
          <Button variant="danger">{t('gallery.danger')}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">{t('gallery.small')}</Button>
          <Button size="lg">{t('gallery.large')}</Button>
          <Button disabled>{t('gallery.disabled')}</Button>
          <Button loading={saving} loadingLabel={t('gallery.saving')} onClick={fakeSave}>
            {t('gallery.save')}
          </Button>
        </div>
      </Section>

      <Section title={t('gallery.fields')}>
        <TextField label={t('gallery.nameLabel')} hint={t('gallery.nameHint')} />
        <TextField
          label={t('gallery.emailLabel')}
          type="email"
          defaultValue="ana@"
          error={t('gallery.emailError')}
        />
      </Section>

      <Section title={t('gallery.card')}>
        <Card title={t('gallery.cardTitle')} headingLevel={3}>
          <p className="text-ink-600">{t('gallery.cardBody')}</p>
        </Card>
      </Section>

      <Section title={t('gallery.dialog')}>
        <div>
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            {t('gallery.openDialog')}
          </Button>
        </div>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={t('gallery.dialogTitle')}
          description={t('gallery.dialogBody')}
          closeLabel={t('ui.close')}
          footer={
            <>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                {t('gallery.cancel')}
              </Button>
              <Button variant="danger" onClick={() => setDialogOpen(false)}>
                {t('gallery.confirm')}
              </Button>
            </>
          }
        />
      </Section>

      <Section title={t('gallery.toasts')}>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => showToast({ message: t('gallery.infoMessage') })}
          >
            {t('gallery.showInfo')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => showToast({ message: t('gallery.successMessage'), tone: 'success' })}
          >
            {t('gallery.showSuccess')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => showToast({ message: t('gallery.errorMessage'), tone: 'error' })}
          >
            {t('gallery.showError')}
          </Button>
        </div>
      </Section>

      <Section title={t('gallery.switch')}>
        <Card>
          <Switch
            label={t('gallery.switchLabel')}
            description={t('gallery.switchDescription')}
            checked={captions}
            onCheckedChange={setCaptions}
          />
        </Card>
      </Section>

      <Section title={t('gallery.tabs')}>
        <Tabs
          label={t('gallery.tabsLabel')}
          items={[
            {
              id: 'today',
              label: t('gallery.tabToday'),
              panel: <p>{t('gallery.tabTodayBody')}</p>,
            },
            { id: 'week', label: t('gallery.tabWeek'), panel: <p>{t('gallery.tabWeekBody')}</p> },
            {
              id: 'month',
              label: t('gallery.tabMonth'),
              panel: <p>{t('gallery.tabMonthBody')}</p>,
            },
          ]}
        />
      </Section>

      <Section title={t('gallery.radio')}>
        <RadioGroup<ThemePreference>
          legend={t('settings.themeLegend')}
          name="gallery-theme"
          value={preference}
          onChange={setPreference}
          options={[
            {
              value: 'system',
              label: t('settings.themeSystem'),
              icon: <DeviceIcon className="size-5" />,
            },
            {
              value: 'light',
              label: t('settings.themeLight'),
              icon: <SunIcon className="size-5" />,
            },
            {
              value: 'dark',
              label: t('settings.themeDark'),
              icon: <MoonIcon className="size-5" />,
            },
          ]}
        />
      </Section>
    </div>
  );
}

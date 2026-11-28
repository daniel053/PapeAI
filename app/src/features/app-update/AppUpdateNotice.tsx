import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { appUpdateStore } from '../../platform/web/pwa';

/**
 * "New version available" notice. Rendered outside the router so it shows on
 * every screen. It never takes focus: the live region announces it and the
 * user decides when to update.
 */
export function AppUpdateNotice() {
  const { t } = useTranslation();
  const status = useSyncExternalStore(appUpdateStore.subscribe, appUpdateStore.getSnapshot);
  const visible = status === 'available' || status === 'updating';
  const updating = status === 'updating';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div
        className={
          visible
            ? 'pointer-events-auto flex w-full max-w-md flex-col gap-3 rounded-card border border-line-200 bg-surface-0 p-4 shadow-lg sm:flex-row sm:items-center'
            : 'contents'
        }
      >
        {/* Always mounted, so screen readers announce the text when it appears. */}
        <p role="status" className="flex-1 text-sm text-ink-900">
          {visible ? t('appUpdate.message') : null}
        </p>
        {visible ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void appUpdateStore.update()}
              disabled={updating}
              className="min-h-11 rounded-control bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-70"
            >
              {updating ? t('appUpdate.updating') : t('appUpdate.update')}
            </button>
            <button
              type="button"
              onClick={appUpdateStore.dismiss}
              disabled={updating}
              className="min-h-11 rounded-control border border-line-200 px-4 text-sm font-semibold text-ink-600 hover:bg-primary-50 disabled:opacity-70"
            >
              {t('appUpdate.dismiss')}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

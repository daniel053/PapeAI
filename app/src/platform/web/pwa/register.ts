import { registerSW } from 'virtual:pwa-register';
import { appUpdateStore } from './update-store';

/**
 * Registers the service worker (production builds only). Imported from code
 * instead of an injected inline script, so the CSP keeps `script-src 'self'`.
 */
export function registerPwa(): void {
  if (!import.meta.env.PROD) return;

  const updateServiceWorker = registerSW({
    onNeedRefresh() {
      appUpdateStore.markAvailable(() => updateServiceWorker());
    },
    onRegisterError() {
      // Without a service worker the app still works online; nothing to report.
    },
  });
}

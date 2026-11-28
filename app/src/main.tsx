import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router';
import { setupI18n } from './app/i18n-setup';
import { router } from './app/router';
import { AppUpdateNotice } from './features/app-update';
import { registerPwa } from './platform/web/pwa';
import './ui/styles.css';

async function start() {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Missing #root element');

  const i18n = await setupI18n();

  createRoot(rootElement).render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
        <AppUpdateNotice />
      </I18nextProvider>
    </StrictMode>,
  );

  registerPwa();
}

void start();

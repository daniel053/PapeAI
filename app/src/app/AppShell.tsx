import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router';
import { LanguageSwitcher } from '../features/settings/LanguageSwitcher';
import { HomeIcon, SettingsIcon, ThemeProvider, ToastProvider, cx } from '../ui';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

/**
 * App frame: top bar (wordmark, language) + navigation. On phones the
 * navigation is a bottom bar within thumb reach; from the `sm` breakpoint
 * (640px) it moves into the top bar. NavLink sets aria-current="page"; the
 * active item is also bold and marked by a pill/underline, not colour alone.
 */
export function AppShell() {
  const { t } = useTranslation();

  const items: NavItem[] = [
    { to: '/', label: t('nav.home'), icon: <HomeIcon /> },
    { to: '/configuracoes', label: t('nav.settings'), icon: <SettingsIcon /> },
  ];

  return (
    <ThemeProvider>
      <ToastProvider
        dismissLabel={t('ui.dismissNotice')}
        regionLabel={t('ui.notices')}
        // Above the bottom navigation on phones.
        viewportClassName="bottom-24 sm:bottom-6"
      >
        <div className="flex min-h-dvh flex-col">
          <a
            href="#content"
            className="sr-only z-50 focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:rounded-control focus:bg-surface-1 focus:p-3 focus:font-semibold focus:text-ink-900 focus:shadow-lg"
          >
            {t('shell.skipToContent')}
          </a>

          <header className="border-b border-line-200 bg-surface-0">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2">
              <Link
                to="/"
                aria-label={t('shell.home')}
                className="flex min-h-11 flex-col justify-center leading-tight"
              >
                <span className="font-display text-2xl font-extrabold text-primary-600">
                  {t('app.name')}
                </span>
                <span className="hidden text-xs text-ink-600 min-[400px]:block">
                  {t('app.tagline')}
                </span>
              </Link>

              <nav aria-label={t('nav.label')} className="hidden sm:block">
                <ul className="flex gap-1">
                  {items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end
                        className={({ isActive }) =>
                          cx(
                            'flex min-h-11 items-center gap-2 rounded-full px-4 transition-colors duration-150',
                            isActive
                              ? 'bg-primary-50 font-bold text-primary-600 underline decoration-2 underline-offset-8'
                              : 'font-medium text-ink-600 hover:bg-primary-50 hover:text-ink-900',
                          )
                        }
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <LanguageSwitcher />
            </div>
          </header>

          <main
            id="content"
            tabIndex={-1}
            className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-28 focus:outline-none sm:pt-10 sm:pb-10"
          >
            <Outlet />
          </main>

          <nav
            aria-label={t('nav.label')}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line-200 bg-surface-1 pb-[env(safe-area-inset-bottom)] sm:hidden"
          >
            <ul className="mx-auto grid max-w-md grid-cols-2">
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      cx(
                        'flex min-h-16 flex-col items-center justify-center gap-1 px-2 py-2 text-sm',
                        isActive ? 'font-bold text-primary-600' : 'font-medium text-ink-600',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cx(
                            'flex h-8 w-16 items-center justify-center rounded-full transition-colors duration-150',
                            isActive && 'bg-primary-50',
                          )}
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

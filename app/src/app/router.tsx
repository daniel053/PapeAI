import { createBrowserRouter, type RouteObject } from 'react-router';
import { HomePage } from '../features/home/HomePage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { AppShell } from './AppShell';

// Component gallery for development only. `import.meta.env.DEV` is replaced by
// `false` in production builds, so this branch and the lazy chunk it imports
// are removed from the published app.
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: 'dev/componentes',
        lazy: async () => {
          const { ComponentGalleryPage } =
            await import('../features/dev-gallery/ComponentGalleryPage');
          return { Component: ComponentGalleryPage };
        },
      },
    ]
  : [];

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppShell,
    children: [
      { index: true, Component: HomePage },
      { path: 'configuracoes', Component: SettingsPage },
      ...devRoutes,
      { path: '*', Component: NotFoundPage },
    ],
  },
]);

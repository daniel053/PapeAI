// Build-time PWA configuration, consumed by vite.config.ts (vite-plugin-pwa 2.0.0).
// Kept here, outside the Vite config, so the security-relevant values are
// covered by unit tests (pwa-config.test.ts).
import type { VitePWAOptions } from 'vite-plugin-pwa';

/** --color-primary-600 in src/ui/styles.css. */
export const THEME_COLOR = '#2f4ae0';
/** --color-surface-0 in src/ui/styles.css. */
export const BACKGROUND_COLOR = '#ffffff';

/**
 * The service worker precaches only the static files of the build. There is
 * no runtime caching: nothing cross-origin and nothing from APIs is ever
 * stored (docs/seguranca/seguranca-web-headers-csp-robots.md).
 */
export const PRECACHE_GLOB_PATTERNS = ['**/*.{js,css,html,woff2,svg,png}'];

/**
 * Font subsets the pt-BR/en interface does not need offline. The browser still
 * downloads them on demand (unicode-range) when a page shows such characters.
 */
export const PRECACHE_GLOB_IGNORES = [
  '**/*-{cyrillic,cyrillic-ext,greek,greek-ext,vietnamese}-wght-normal-*.woff2',
];

/**
 * Navigations that must reach the server instead of the SPA shell:
 * any path with a file extension (robots.txt, sw.js, ...) and /.well-known/.
 */
export const NAVIGATE_FALLBACK_DENYLIST = [/^\/\.well-known\//, /\/[^/]+\.[^/]+$/];

export const pwaOptions: Partial<VitePWAOptions> = {
  strategies: 'generateSW',
  // 'prompt': a new version waits until the user accepts the update notice
  // (src/features/app-update). No skipWaiting/clientsClaim.
  registerType: 'prompt',
  // false: the plugin injects no <script> into index.html (CSP has no
  // 'unsafe-inline'); we register from code via virtual:pwa-register.
  injectRegister: false,
  manifestFilename: 'manifest.webmanifest',
  // The icons are already matched by PRECACHE_GLOB_PATTERNS (public/ is copied
  // to dist/); listing them twice would only duplicate precache entries.
  // The plugin always adds manifest.webmanifest itself.
  includeManifestIcons: false,
  manifest: {
    id: '/',
    name: 'PapeAI',
    short_name: 'PapeAI',
    description:
      'Tutor de inglês com IA: conversa com você, escuta palavra por palavra e monta a trilha para o seu objetivo.',
    lang: 'pt-BR',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    theme_color: THEME_COLOR,
    background_color: BACKGROUND_COLOR,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    globPatterns: PRECACHE_GLOB_PATTERNS,
    globIgnores: PRECACHE_GLOB_IGNORES,
    navigateFallback: 'index.html',
    navigateFallbackDenylist: NAVIGATE_FALLBACK_DENYLIST,
    runtimeCaching: [],
    cleanupOutdatedCaches: true,
    skipWaiting: false,
    clientsClaim: false,
    sourcemap: false,
  },
  devOptions: { enabled: false },
};

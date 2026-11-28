// ESLint flat config for the whole workspace.
// The security rules below are covered by app/src/security-lint.test.ts:
// removing or weakening one of them makes that test fail.
import path from 'node:path';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import papeai from './tooling/eslint-plugin-papeai.js';

const APP_SRC = path.join(import.meta.dirname, 'app', 'src');

const VAULT_MESSAGE =
  'Only core/llm and BYOK speech providers may use core/vault (docs/arquitetura/estrutura-de-pastas-e-modulos.md).';
const NET_MESSAGE =
  'Only core modules and the app bootstrap may use core/net (docs/arquitetura/estrutura-de-pastas-e-modulos.md).';

const HTML_SINK_MESSAGE =
  'Writing raw HTML is forbidden (XSS could expose the API key). Render text through React instead.';

// Builds the module-boundary and security rules for one group of files.
// ESLint replaces (does not merge) a rule's options when several config
// objects match a file, so every group gets the full list.
function guardRules({ allowVault, allowNet }) {
  const forbidden = [];
  if (!allowVault) {
    forbidden.push({
      dir: path.join(APP_SRC, 'core', 'vault'),
      name: 'vault',
      message: VAULT_MESSAGE,
    });
  }
  if (!allowNet) {
    forbidden.push({ dir: path.join(APP_SRC, 'core', 'net'), name: 'net', message: NET_MESSAGE });
  }

  return {
    'papeai/restricted-modules': ['error', { forbidden }],
    'no-restricted-syntax': [
      'error',
      {
        selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
        message: HTML_SINK_MESSAGE,
      },
      {
        selector: "Property[key.name='dangerouslySetInnerHTML']",
        message: HTML_SINK_MESSAGE,
      },
      {
        selector: 'MemberExpression[property.name=/^(innerHTML|outerHTML)$/]',
        message: HTML_SINK_MESSAGE,
      },
      {
        selector: 'MemberExpression[computed=true][property.value=/^(innerHTML|outerHTML)$/]',
        message: HTML_SINK_MESSAGE,
      },
      {
        selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
        message: HTML_SINK_MESSAGE,
      },
      {
        selector:
          "CallExpression[callee.object.name='document'][callee.property.name=/^(write|writeln)$/]",
        message: HTML_SINK_MESSAGE,
      },
    ],
  };
}

const NETWORK_MESSAGE =
  'Network access must go through core/net (allowlist guard). Do not call it directly.';

const directNetworkRules = {
  'no-restricted-globals': [
    'error',
    ...['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'].map((name) => ({
      name,
      message: NETWORK_MESSAGE,
    })),
  ],
  'no-restricted-properties': [
    'error',
    ...['window', 'globalThis', 'self'].map((object) => ({
      object,
      property: 'fetch',
      message: NETWORK_MESSAGE,
    })),
    { object: 'navigator', property: 'sendBeacon', message: NETWORK_MESSAGE },
  ],
};

export default defineConfig([
  globalIgnores(['**/node_modules/', '**/dist/', '**/coverage/', 'docs/']),

  js.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.strict, tseslint.configs.stylistic],
  },

  {
    files: ['**/*.js'],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['app/src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    plugins: { papeai },
    languageOptions: { globals: globals.browser },
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      ...directNetworkRules,
      ...guardRules({ allowVault: false, allowNet: false }),
    },
  },

  // Bootstrap and core modules may use the network guard, never the vault.
  {
    files: ['app/src/app/**/*.{ts,tsx}', 'app/src/core/**/*.{ts,tsx}'],
    rules: guardRules({ allowVault: false, allowNet: true }),
  },

  // The vault itself: no network, ever.
  {
    files: ['app/src/core/vault/**/*.{ts,tsx}'],
    rules: guardRules({ allowVault: true, allowNet: false }),
  },

  // The only consumers of the key: the LLM client and BYOK speech providers.
  {
    files: ['app/src/core/llm/**/*.{ts,tsx}', 'app/src/core/speech/providers/**/*.{ts,tsx}'],
    rules: guardRules({ allowVault: true, allowNet: true }),
  },

  // The network guard is the one place allowed to touch fetch directly.
  {
    files: ['app/src/core/net/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': 'off',
      'no-restricted-properties': 'off',
    },
  },

  // Tests run in Node and may use its globals. They also need malicious-looking
  // strings (e.g. `javascript:` URLs) as fixtures to prove the guards work.
  {
    files: ['app/src/**/*.test.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { 'no-script-url': 'off' },
  },
]);

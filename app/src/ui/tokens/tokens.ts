// Reads the colour tokens out of ui/styles.css so tests can check them.
// Test-only helper: nothing in the app imports it.

export type TokenMap = Record<string, string>;

export interface ThemeTokens {
  light: TokenMap;
  dark: TokenMap;
  /** Dark values used when the preference is "system" (media query block). */
  darkSystem: TokenMap;
}

function blockAfter(css: string, marker: RegExp): string {
  const match = marker.exec(css);
  if (!match) throw new Error(`Block not found: ${marker}`);
  const start = css.indexOf('{', match.index) + 1;
  let depth = 1;
  let index = start;
  while (depth > 0 && index < css.length) {
    const char = css[index];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    index += 1;
  }
  return css.slice(start, index - 1);
}

function colours(block: string): TokenMap {
  const tokens: TokenMap = {};
  for (const [, name, value] of block.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-f]{3,6})\s*;/gi)) {
    if (name && value) tokens[name] = value.toLowerCase();
  }
  return tokens;
}

export function parseThemeTokens(css: string): ThemeTokens {
  const light = colours(blockAfter(css, /@theme\s*\{/));
  const dark = { ...light, ...colours(blockAfter(css, /:root\[data-theme=['"]dark['"]\]\s*\{/)) };
  const media = blockAfter(css, /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{/);
  const darkSystem = {
    ...light,
    ...colours(blockAfter(media, /:root:not\(\[data-theme=['"]light['"]\]\)\s*\{/)),
  };
  return { light, dark, darkSystem };
}

// WCAG 2.2 AA: 4.5:1 for normal text, 3:1 for large text and for
// non-text UI (control borders, focus ring, icons, switch track).
const TEXT = 4.5;
const NON_TEXT = 3;

/** Every foreground/background pair the UI uses: [fg, bg, minimum, where]. */
export const CONTRAST_PAIRS: readonly (readonly [string, string, number, string])[] = [
  ['ink-900', 'surface-0', TEXT, 'main text on the page'],
  ['ink-900', 'surface-1', TEXT, 'main text on cards, dialogs, toasts'],
  ['ink-900', 'primary-50', TEXT, 'text on soft blue boxes'],
  ['ink-600', 'surface-0', TEXT, 'secondary text on the page'],
  ['ink-600', 'surface-1', TEXT, 'hints and descriptions on cards'],
  ['ink-600', 'primary-50', TEXT, 'secondary text on soft blue'],
  ['primary-600', 'surface-0', TEXT, 'links, wordmark, active nav label'],
  ['primary-600', 'surface-1', TEXT, 'secondary/ghost button text on cards'],
  ['primary-600', 'primary-50', TEXT, 'button text on hover, selected item'],
  ['on-primary', 'primary-600', TEXT, 'primary button'],
  ['on-primary', 'primary-700', TEXT, 'primary button (hover)'],
  ['on-primary', 'error-700', TEXT, 'danger button'],
  ['on-primary', 'error-800', TEXT, 'danger button (hover)'],
  ['error-700', 'surface-0', TEXT, 'field error message'],
  ['error-700', 'surface-1', TEXT, 'field error message on cards'],
  ['success-700', 'surface-1', TEXT, 'success text'],
  ['warning-700', 'surface-1', TEXT, 'warning text'],
  ['line-500', 'surface-0', NON_TEXT, 'text field border, switch track (off)'],
  ['line-500', 'surface-1', NON_TEXT, 'text field border on cards'],
  ['primary-600', 'surface-0', NON_TEXT, 'focus ring, switch track (on)'],
  ['surface-0', 'line-500', NON_TEXT, 'switch thumb (off)'],
  ['on-primary', 'primary-600', NON_TEXT, 'switch thumb (on)'],
  ['success-600', 'surface-1', NON_TEXT, 'success icon'],
  ['warning-600', 'surface-1', NON_TEXT, 'warning icon'],
  ['error-600', 'surface-1', NON_TEXT, 'error icon'],
];

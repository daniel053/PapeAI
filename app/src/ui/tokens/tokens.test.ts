import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio, relativeLuminance } from './contrast';
import { CONTRAST_PAIRS, parseThemeTokens } from './tokens';

const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const themes = parseThemeTokens(css);

describe('contrastRatio (WCAG 2.x)', () => {
  it('matches the reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBe(1);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
    expect(contrastRatio('#fff', '#000')).toBeCloseTo(21, 5);
  });

  it('does not depend on the order of the colours', () => {
    expect(contrastRatio('#2f4ae0', '#eef1ff')).toBe(contrastRatio('#eef1ff', '#2f4ae0'));
  });

  it('rejects values that are not hex colours', () => {
    expect(() => relativeLuminance('blue')).toThrow();
  });
});

describe('colour tokens', () => {
  it('the dark block for "system" matches the explicit dark block', () => {
    expect(themes.darkSystem).toEqual(themes.dark);
  });

  it('every dark token also exists in the light theme', () => {
    expect(Object.keys(themes.dark).sort()).toEqual(Object.keys(themes.light).sort());
  });

  for (const [name, tokens] of [
    ['light', themes.light],
    ['dark', themes.dark],
  ] as const) {
    it.each(CONTRAST_PAIRS)(`${name}: %s on %s >= %s (%s)`, (fg, bg, min) => {
      const foreground = tokens[fg];
      const background = tokens[bg];
      expect(foreground, fg).toBeDefined();
      expect(background, bg).toBeDefined();
      expect(contrastRatio(foreground ?? '', background ?? '')).toBeGreaterThanOrEqual(min);
    });
  }
});

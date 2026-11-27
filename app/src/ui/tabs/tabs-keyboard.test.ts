import { describe, expect, it } from 'vitest';
import { nextTabIndex } from './tabs-keyboard';

describe('nextTabIndex', () => {
  it.each([
    [0, 'ArrowRight', 3, 1],
    [2, 'ArrowRight', 3, 0],
    [0, 'ArrowLeft', 3, 2],
    [2, 'ArrowLeft', 3, 1],
    [1, 'Home', 3, 0],
    [1, 'End', 3, 2],
    [0, 'ArrowRight', 1, 0],
  ])('from %i, %s with %i tabs -> %i', (current, key, count, expected) => {
    expect(nextTabIndex(current, key, count)).toBe(expected);
  });

  it.each(['ArrowUp', 'ArrowDown', 'Enter', ' ', 'Tab', 'a'])('ignores %j', (key) => {
    expect(nextTabIndex(0, key, 3)).toBeNull();
  });

  it('handles an empty tab list', () => {
    expect(nextTabIndex(0, 'ArrowRight', 0)).toBeNull();
  });
});

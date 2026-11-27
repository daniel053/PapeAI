// Keyboard model of the WAI-ARIA tabs pattern (horizontal tab list):
// ←/→ move to the previous/next tab and wrap around, Home/End jump to the
// first/last tab. https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

/** Index to move to after `key`, or null when the key is not handled. */
export function nextTabIndex(current: number, key: string, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % count;
    case 'ArrowLeft':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}

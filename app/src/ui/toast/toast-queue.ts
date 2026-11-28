// Pure list operations behind <ToastProvider>, tested in Node.

export type ToastTone = 'info' | 'success' | 'error';

export interface ToastOptions {
  /** Text already translated. */
  message: string;
  tone?: ToastTone;
  /**
   * Time on screen in ms; `null` keeps it until dismissed.
   * Default: 6 s, except errors, which stay until dismissed.
   */
  durationMs?: number | null;
}

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  durationMs: number | null;
}

export const DEFAULT_TOAST_DURATION_MS = 6000;
/** More than this and the oldest notices are dropped, so the screen never fills up. */
export const MAX_VISIBLE_TOASTS = 3;

export function createToast(id: number, options: ToastOptions): ToastItem {
  const tone = options.tone ?? 'info';
  const durationMs =
    options.durationMs !== undefined
      ? options.durationMs
      : tone === 'error'
        ? null
        : DEFAULT_TOAST_DURATION_MS;
  return { id, message: options.message, tone, durationMs };
}

export function addToast(
  list: readonly ToastItem[],
  toast: ToastItem,
  max = MAX_VISIBLE_TOASTS,
): ToastItem[] {
  return [...list, toast].slice(-max);
}

export function removeToast(list: readonly ToastItem[], id: number): ToastItem[] {
  return list.filter((toast) => toast.id !== id);
}

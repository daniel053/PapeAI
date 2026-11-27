import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from 'react';
import { cx } from '../cx';
import { CheckIcon, CloseIcon, ErrorIcon, InfoIcon } from '../icons';
import {
  addToast,
  createToast,
  removeToast,
  type ToastItem,
  type ToastOptions,
  type ToastTone,
} from './toast-queue';

interface ToastContextValue {
  /** Shows a notice and returns its id. */
  showToast(options: ToastOptions): number;
  dismissToast(id: number): void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  /** Accessible label of each notice's × button, already translated. */
  dismissLabel: string;
  /** Accessible name of the notifications area, already translated. */
  regionLabel: string;
  /** Positioning of the stack (e.g. to stay above a bottom navigation bar). */
  viewportClassName?: string;
  children: ReactNode;
}

/**
 * Notices announced by screen readers through live regions that exist from
 * the start (regions added later are often not read). Info/success use a
 * polite region; errors an assertive one.
 */
export function ToastProvider({
  dismissLabel,
  regionLabel,
  viewportClassName,
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismissToast = useCallback((id: number) => {
    setToasts((list) => removeToast(list, id));
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    const id = nextId.current;
    nextId.current += 1;
    setToasts((list) => addToast(list, createToast(id, options)));
    return id;
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);
  const errors = toasts.filter((toast) => toast.tone === 'error');
  const others = toasts.filter((toast) => toast.tone !== 'error');

  const renderList = (list: ToastItem[]) =>
    list.map((toast) => (
      <ToastCard
        key={toast.id}
        toast={toast}
        dismissLabel={dismissLabel}
        onDismiss={dismissToast}
      />
    ));

  return (
    <ToastContext value={value}>
      {children}
      <section
        aria-label={regionLabel}
        className={cx(
          'pointer-events-none fixed inset-x-0 z-50 flex flex-col items-center gap-2 px-4',
          viewportClassName ?? 'bottom-4',
        )}
      >
        <div aria-live="assertive" className="flex w-full max-w-md flex-col gap-2">
          {renderList(errors)}
        </div>
        <div aria-live="polite" className="flex w-full max-w-md flex-col gap-2">
          {renderList(others)}
        </div>
      </section>
    </ToastContext>
  );
}

const TONE_ICON: Record<ToastTone, ReactNode> = {
  info: <InfoIcon className="text-primary-600" />,
  success: <CheckIcon className="text-success-600" />,
  error: <ErrorIcon className="text-error-600" />,
};

const TONE_BORDER: Record<ToastTone, string> = {
  info: 'border-l-primary-600',
  success: 'border-l-success-600',
  error: 'border-l-error-600',
};

interface ToastCardProps {
  toast: ToastItem;
  dismissLabel: string;
  onDismiss(id: number): void;
}

function ToastCard({ toast, dismissLabel, onDismiss }: ToastCardProps) {
  // The timer pauses while the pointer or keyboard focus is on the notice,
  // so nobody loses a message while reading it (WCAG 2.2.1).
  const [paused, setPaused] = useState(false);
  const remainingMs = useRef(toast.durationMs);

  useEffect(() => {
    if (paused || remainingMs.current === null) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismiss(toast.id), remainingMs.current);
    return () => {
      window.clearTimeout(timer);
      if (remainingMs.current !== null) {
        remainingMs.current = Math.max(0, remainingMs.current - (Date.now() - startedAt));
      }
    };
  }, [paused, toast.id, onDismiss]);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={handleBlur}
      className={cx(
        'pointer-events-auto flex items-start gap-3 rounded-card border border-l-4 border-line-200',
        'bg-surface-1 py-2 pr-2 pl-4 text-ink-900 shadow-lg motion-safe:animate-toast-in',
        TONE_BORDER[toast.tone],
      )}
    >
      <span className="pt-2.5">{TONE_ICON[toast.tone]}</span>
      <p className="flex-1 py-2.5">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label={dismissLabel}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-600 hover:bg-primary-50 hover:text-ink-900"
      >
        <CloseIcon className="size-5" />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const context = use(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}

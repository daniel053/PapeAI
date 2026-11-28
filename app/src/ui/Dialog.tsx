import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react';
import { cx } from './cx';
import { CloseIcon } from './icons';

export interface DialogProps {
  open: boolean;
  /** Called on Esc, the close button, a backdrop click or `dialog.close()`. */
  onClose(): void;
  /** Visible title; also the dialog's accessible name. */
  title: string;
  description?: string;
  /** Accessible label of the close (×) button, already translated. */
  closeLabel: string;
  /** Buttons at the bottom, e.g. "Cancelar" and "Confirmar". */
  footer?: ReactNode;
  /** Close when the dimmed area outside the box is clicked. Default true. */
  closeOnBackdropClick?: boolean;
  children?: ReactNode;
}

/**
 * Modal dialog on top of the native <dialog> element. `showModal()` gives us,
 * for free and without injected styles: focus moved inside, the rest of the
 * page made inert (focus cannot escape), Esc to close and a ::backdrop.
 * We add: labelling by the title and focus returned to the trigger.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  closeLabel,
  footer,
  closeOnBackdropClick = true,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    const trigger = returnFocusRef.current;
    returnFocusRef.current = null;
    if (trigger?.isConnected) trigger.focus();
    onClose();
  };

  // A click on the ::backdrop is reported on the <dialog> itself; clicks on
  // the content land on its children because the inner box fills the dialog.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      event.currentTarget.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={handleClose}
      onClick={handleClick}
      className={cx(
        'm-auto w-[calc(100%-2rem)] max-w-lg rounded-card border border-line-200 p-0',
        'max-h-[calc(100dvh-2rem)] bg-surface-1 text-ink-900 shadow-xl',
        'backdrop:bg-black/60',
      )}
    >
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="font-display text-xl font-bold">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-ink-600">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={closeLabel}
            className="-mt-1 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-600 hover:bg-primary-50 hover:text-ink-900"
          >
            <CloseIcon />
          </button>
        </div>
        {children && <div className="text-ink-900">{children}</div>}
        {footer && <div className="flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </dialog>
  );
}

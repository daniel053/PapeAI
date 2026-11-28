import { useId } from 'react';
import { cx } from './cx';
import { CheckIcon } from './icons';

export interface SwitchProps {
  /** Visible label (already translated); clicking it also toggles. */
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange(checked: boolean): void;
  disabled?: boolean;
  className?: string;
}

/**
 * On/off control: <button role="switch" aria-checked>. Space and Enter toggle
 * it (native button behaviour). The state is shown by the knob position and a
 * check mark, not by colour alone.
 */
export function Switch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: SwitchProps) {
  const id = useId();
  const descriptionId = `${id}-description`;

  return (
    <div className={cx('flex min-h-11 items-center justify-between gap-4', className)}>
      <div className="flex flex-col">
        <label htmlFor={id} className="font-semibold text-ink-900">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-sm text-ink-600">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cx(
          // 44×44 hit area around a 52×32 track.
          'group relative inline-flex min-h-11 min-w-14 shrink-0 items-center justify-center rounded-full',
          'disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            'flex h-8 w-13 items-center rounded-full p-1 transition-colors duration-150',
            checked ? 'bg-primary-600' : 'bg-line-500',
          )}
        >
          <span
            className={cx(
              'flex size-6 items-center justify-center rounded-full transition-transform duration-150',
              checked
                ? 'translate-x-5 bg-on-primary text-primary-600'
                : 'translate-x-0 bg-surface-0',
            )}
          >
            {checked && <CheckIcon className="size-4" />}
          </span>
        </span>
      </button>
    </div>
  );
}

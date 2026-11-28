import { useId, type ComponentProps } from 'react';
import { cx } from './cx';
import { ErrorIcon } from './icons';

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  /** Visible label (already translated). Always shown: placeholders are not labels. */
  label: string;
  /** Help text under the field. */
  hint?: string;
  /** Error message. When set, the field is marked invalid and the message is read out. */
  error?: string;
  id?: string;
}

export function TextField({
  label,
  hint,
  error,
  id,
  className,
  type = 'text',
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [inputProps['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="font-semibold text-ink-900">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-ink-600">
          {hint}
        </p>
      )}
      <input
        type={type}
        {...inputProps}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cx(
          'min-h-11 w-full rounded-control border-2 border-line-500 bg-surface-1 px-3 py-2',
          'text-base text-ink-900 placeholder:text-ink-600',
          'focus-visible:border-primary-600',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'aria-[invalid=true]:border-error-700',
        )}
      />
      {error && (
        <p id={errorId} className="flex items-start gap-1.5 text-sm font-medium text-error-700">
          <ErrorIcon className="size-5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

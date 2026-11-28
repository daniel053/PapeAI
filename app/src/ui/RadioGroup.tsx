import { useId, type ReactNode } from 'react';
import { cx } from './cx';

export interface RadioOption<T extends string> {
  value: T;
  /** Visible text, already translated. */
  label: string;
  description?: string;
  /** Decorative icon. */
  icon?: ReactNode;
}

export interface RadioGroupProps<T extends string> {
  /** Question or group title (rendered as <legend>), already translated. */
  legend: string;
  /** Shared `name` of the native radio inputs. */
  name: string;
  options: readonly RadioOption<T>[];
  value: T;
  onChange(value: T): void;
  className?: string;
}

/**
 * Pick one of a few options. Native <fieldset> + <input type="radio">, so
 * screen readers and arrow-key navigation work as the browser defines them.
 * The selected option shows a filled radio and a thicker border.
 */
export function RadioGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  className,
}: RadioGroupProps<T>) {
  const baseId = useId();

  return (
    <fieldset className={className}>
      <legend className="mb-2 font-semibold text-ink-900">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const labelId = `${baseId}-${option.value}-label`;
          const descriptionId = `${baseId}-${option.value}-description`;
          return (
            // The whole box is clickable; the accessible name is only the short
            // label, the description is read as a description.
            <label
              key={option.value}
              className={cx(
                'flex min-h-11 cursor-pointer items-start gap-3 rounded-control border-2 p-3',
                'transition-colors duration-150',
                option.value === value
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-line-200 hover:border-line-500',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={option.value === value}
                onChange={() => onChange(option.value)}
                aria-labelledby={labelId}
                aria-describedby={option.description ? descriptionId : undefined}
                className="mt-0.5 size-5 shrink-0 accent-primary-600"
              />
              <span className="flex flex-col gap-0.5">
                <span id={labelId} className="flex items-center gap-2 font-semibold text-ink-900">
                  {option.icon}
                  {option.label}
                </span>
                {option.description && (
                  <span id={descriptionId} className="text-sm text-ink-600">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

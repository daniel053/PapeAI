import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cx } from './cx';
import { SpinnerIcon } from './icons';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-on-primary hover:bg-primary-700',
  secondary: 'border-2 border-primary-600 bg-surface-1 text-primary-600 hover:bg-primary-50',
  ghost: 'text-primary-600 hover:bg-primary-50',
  danger: 'bg-error-700 text-on-primary hover:bg-error-800',
};

// Every size keeps a touch target of at least 44px (min-h-11).
const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-11 gap-1.5 px-4 text-sm',
  md: 'min-h-11 gap-2 px-5 text-base',
  lg: 'min-h-12 gap-2 px-6 text-lg',
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/** Button look for other elements, e.g. a router link that should look like a button. */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cx(
    'inline-flex min-w-11 items-center justify-center rounded-full font-semibold',
    'transition-colors duration-150 select-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );
}

export interface ButtonProps
  extends Omit<ComponentProps<'button'>, 'children'>, ButtonStyleOptions {
  children: ReactNode;
  /** Shows a spinner, keeps the button focusable and ignores clicks. */
  loading?: boolean;
  /** Text shown while loading (already translated), e.g. "Salvando…". */
  loadingLabel?: string;
  /** Decorative icon before the text. */
  icon?: ReactNode;
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  loading = false,
  loadingLabel,
  icon,
  children,
  type = 'button',
  onClick,
  ...rest
}: ButtonProps) {
  // While loading we use aria-disabled instead of `disabled` so keyboard focus
  // is not lost in the middle of an action.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      {...rest}
      aria-disabled={loading || rest['aria-disabled'] ? true : undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={buttonClassName({ variant, size, fullWidth, className })}
    >
      {loading ? <SpinnerIcon className="size-5 motion-safe:animate-spin" /> : icon}
      <span>{loading && loadingLabel ? loadingLabel : children}</span>
    </button>
  );
}

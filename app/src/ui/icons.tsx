// Simple hand-drawn icons (24×24 grid, rounded strokes). No icon package:
// each icon is a few plain SVG paths that follow the text colour.
import type { ReactNode } from 'react';
import { cx } from './cx';

interface IconProps {
  className?: string;
}

function Icon({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cx('size-6 shrink-0', className)}
    >
      {children}
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-5.5h4V20h3.5a1 1 0 0 0 1-1v-9" />
    </Icon>
  );
}

/** Two sliders: reads as "settings" without a detailed gear. */
export function SettingsIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 7h9M19 7h1M4 17h3M13 17h7" />
      <circle cx="16" cy="7" r="2.5" />
      <circle cx="10" cy="17" r="2.5" />
    </Icon>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M5 12.5 9.5 17 19 7.5" />
    </Icon>
  );
}

export function InfoIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </Icon>
  );
}

export function WarningIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M12 4 21 19.5H3Z" />
      <path d="M12 10v4M12 17h.01" />
    </Icon>
  );
}

export function ErrorIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V13M12 16.5h.01" />
    </Icon>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </Icon>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z" />
    </Icon>
  );
}

/** A screen: stands for "same as the device". */
export function DeviceIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8.5 20h7M12 16v4" />
    </Icon>
  );
}

export function SpinnerIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="9" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </Icon>
  );
}

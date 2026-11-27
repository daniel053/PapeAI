interface MascotPlaceholderProps {
  /** Accessible description, already translated by the caller. */
  label: string;
  className?: string;
}

/**
 * 2D stand-in for the 3D marmoset (F08). Plain SVG shapes only:
 * no external images, no raw HTML.
 */
export function MascotPlaceholder({ label, className }: MascotPlaceholderProps) {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className={className}>
      {/* White ear tufts, typical of the common marmoset */}
      <ellipse cx="38" cy="92" rx="30" ry="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
      <ellipse cx="162" cy="92" rx="30" ry="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
      {/* Head */}
      <circle cx="100" cy="105" r="62" fill="#6b5b4d" />
      {/* Face */}
      <ellipse cx="100" cy="120" rx="42" ry="40" fill="#e7d3bd" />
      {/* White forehead blaze */}
      <ellipse cx="100" cy="66" rx="10" ry="8" fill="#f8fafc" />
      {/* Eyes */}
      <circle cx="82" cy="112" r="9" fill="#0f172a" />
      <circle cx="118" cy="112" r="9" fill="#0f172a" />
      <circle cx="85" cy="109" r="3" fill="#ffffff" />
      <circle cx="121" cy="109" r="3" fill="#ffffff" />
      {/* Nose and smile */}
      <ellipse cx="100" cy="130" rx="5" ry="3.5" fill="#4b3f35" />
      <path
        d="M88 142 Q100 152 112 142"
        fill="none"
        stroke="#4b3f35"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

import { useId, type ReactNode } from 'react';
import { cx } from './cx';

export interface CardProps {
  /** Optional heading. With a title the card becomes a labelled <section>. */
  title?: string;
  description?: string;
  /** Heading level of the title, to keep the page outline correct. Default 2. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
  children?: ReactNode;
}

export function Card({ title, description, headingLevel = 2, className, children }: CardProps) {
  const titleId = useId();
  const Heading = `h${headingLevel}` as const;
  const classes = cx(
    'rounded-card border border-line-200 bg-surface-1 p-5 text-ink-900 shadow-sm sm:p-6',
    className,
  );

  if (!title) return <div className={classes}>{children}</div>;

  return (
    <section aria-labelledby={titleId} className={classes}>
      <Heading id={titleId} className="font-display text-xl font-bold text-ink-900">
        {title}
      </Heading>
      {description && <p className="mt-1 text-ink-600">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}

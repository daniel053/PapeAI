import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../cx';
import { nextTabIndex } from './tabs-keyboard';

export interface TabItem {
  /** Stable id (not shown). */
  id: string;
  /** Visible tab text, already translated. */
  label: string;
  panel: ReactNode;
}

export interface TabsProps {
  /** Accessible name of the tab list, already translated. */
  label: string;
  items: readonly TabItem[];
  /** Controlled selection. Omit to let the component manage it. */
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectedChange?(id: string): void;
  className?: string;
}

/**
 * WAI-ARIA tabs with roving tabindex: Tab enters the list on the selected tab,
 * ←/→/Home/End move and select (automatic activation), Tab again goes to the
 * panel. The selected tab is marked by an underline and bold text, not colour alone.
 */
export function Tabs({
  label,
  items,
  selectedId,
  defaultSelectedId,
  onSelectedChange,
  className,
}: TabsProps) {
  const baseId = useId();
  const [internalId, setInternalId] = useState(defaultSelectedId ?? items[0]?.id);
  const currentId = selectedId ?? internalId;
  const currentIndex = Math.max(
    0,
    items.findIndex((item) => item.id === currentId),
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const item = items[index];
    if (!item) return;
    setInternalId(item.id);
    onSelectedChange?.(item.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = nextTabIndex(currentIndex, event.key, items.length);
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="flex gap-1 overflow-x-auto border-b border-line-200"
      >
        {items.map((item, index) => {
          const selected = index === currentIndex;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              className={cx(
                '-mb-px min-h-11 shrink-0 border-b-4 px-4 py-2 transition-colors duration-150',
                selected
                  ? 'border-primary-600 font-bold text-primary-600'
                  : 'border-transparent font-medium text-ink-600 hover:bg-primary-50 hover:text-ink-900',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.id}`}
          tabIndex={0}
          hidden={index !== currentIndex}
          className="pt-4"
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}

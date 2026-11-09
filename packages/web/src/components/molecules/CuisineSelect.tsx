'use client';

import type { FC, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { PiCaretDown, PiCheckBold } from 'react-icons/pi';
import type { Cuisine } from '@/data';

interface CuisineSelectProps {
  cuisines: Cuisine[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
}

export const CuisineSelect: FC<CuisineSelectProps> = ({
  cuisines,
  value,
  onChange,
  allLabel = 'All Cuisines',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = cuisines.find((cuisine) => cuisine.value === value);

  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // Move focus into the listbox when it opens, on the selected option.
  useEffect(() => {
    if (!open) return;
    const selectedOption = menuRef.current?.querySelector<HTMLElement>(
      '[role="option"][aria-selected="true"]'
    );
    (selectedOption ?? menuRef.current)?.focus();
  }, [open]);

  const menuOptions = (): HTMLElement[] =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []
    );

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = menuOptions();
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const next =
        current < 0
          ? event.key === 'ArrowDown'
            ? 0
            : items.length - 1
          : (current + delta + items.length) % items.length;
      items[next]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      items.at(-1)?.focus();
    }
  };

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        data-testid="cuisine-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
          open
            ? 'text-accent border-accent/50 bg-accent/10'
            : 'text-base-content border-base-content/20 bg-base-content/5'
        }`}>
        <span className="w-5 shrink-0 text-center text-base leading-none">
          {selected?.emoji ?? '🎲'}
        </span>
        <span className="flex-1 truncate text-left">
          {selected?.label ?? allLabel}
        </span>
        <PiCaretDown
          className={`ml-0.5 h-3 w-3 shrink-0 transition-transform duration-200 ${
            open ? 'text-accent rotate-180' : 'text-base-content/70'
          }`}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          data-testid="cuisine-select-menu"
          role="listbox"
          aria-label="Cuisine"
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
          className="border-base-content/10 bg-base-200 absolute right-0 left-0 z-[1000] mt-2 rounded-2xl border p-1.5 shadow-2xl shadow-black/50">
          <button
            role="option"
            aria-selected={value === 'all'}
            onClick={() => choose('all')}
            className={`flex w-full cursor-pointer items-center gap-2 rounded-xl border-none px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ${
              value === 'all'
                ? 'text-accent bg-accent/20'
                : 'text-base-content hover:bg-base-content/10'
            }`}>
            <span className="inline-flex h-5 w-5 items-center justify-center text-base leading-none">
              🎲
            </span>
            <span className="flex-1">{allLabel}</span>
            {value === 'all' && (
              <PiCheckBold className="h-3.5 w-3.5 shrink-0" />
            )}
          </button>

          <div className="border-base-content/10 mx-2 my-1 border-t" />

          {cuisines.map((cuisine) => (
            <button
              key={cuisine.value}
              role="option"
              aria-selected={value === cuisine.value}
              onClick={() => choose(cuisine.value)}
              title={cuisine.label}
              className={`flex w-full cursor-pointer items-center gap-2 rounded-xl border-none px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ${
                value === cuisine.value
                  ? 'text-accent bg-accent/20'
                  : 'text-base-content hover:bg-base-content/10'
              }`}>
              <span className="inline-flex h-5 w-5 items-center justify-center text-base leading-none">
                {cuisine.emoji}
              </span>
              <span className="flex-1">{cuisine.label}</span>
              {value === cuisine.value && (
                <PiCheckBold className="h-3.5 w-3.5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

CuisineSelect.displayName = 'CuisineSelect';

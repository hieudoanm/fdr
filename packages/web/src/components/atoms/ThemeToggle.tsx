'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { PiMoon, PiSun } from 'react-icons/pi';

export const THEMES = ['fdr', 'fdr-dark'] as const;
export type Theme = (typeof THEMES)[number];
export const THEME_STORAGE_KEY = 'fdr:theme';

export const isTheme = (value: string | null): value is Theme =>
  value === 'fdr' || value === 'fdr-dark';

export const ThemeToggle: FC = () => {
  const [theme, setTheme] = useState<Theme>('fdr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((previous) => {
      const next: Theme = previous === 'fdr' ? 'fdr-dark' : 'fdr';
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      data-testid="theme-toggle"
      aria-label={
        mounted && theme === 'fdr-dark' ? 'Switch to light' : 'Switch to dark'
      }
      className="text-base-content/70 hover:text-accent btn btn-ghost btn-circle btn-sm">
      {mounted && theme === 'fdr-dark' ? (
        <PiSun className="h-4 w-4" />
      ) : (
        <PiMoon className="h-4 w-4" />
      )}
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';

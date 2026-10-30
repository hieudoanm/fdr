'use client';

import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';

const APP_NAME: string = 'FDR';
const THEME_KEY: string = 'fdr:theme';
const THEME_DARK: string = 'fdr-dark';
const THEME_LIGHT: string = 'fdr-light';

const getInitialTheme = (): string => {
  if (typeof window === 'undefined') return THEME_LIGHT;
  return localStorage.getItem(THEME_KEY) || THEME_LIGHT;
};

export const Header: FC = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) => (current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT));

  return (
    <header className="border-base-300 bg-base-100 sticky top-0 z-10 border-b px-4 py-3 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
        <div>
          <Link href="/" className="text-base-content text-sm font-bold">
            {APP_NAME}
          </Link>
        </div>

        <nav className="flex w-auto items-center gap-1">
          <div className="dropdown dropdown-end md:hidden">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              aria-label="Menu"
              aria-haspopup="menu"
              tabIndex={0}>
              <FiMenu className="text-lg" />
            </button>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            data-testid="theme-toggle">
            {theme === THEME_DARK ? (
              <FiSun className="text-lg" />
            ) : (
              <FiMoon className="text-lg" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

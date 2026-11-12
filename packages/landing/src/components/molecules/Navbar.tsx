'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { PiGithubLogo } from 'react-icons/pi';

const GITHUB_URL = 'https://github.com/hieudoanm/fdr';

const NAV_LINK =
  'text-base-content/60 hover:text-primary px-3 py-2 text-sm font-semibold transition-colors';

interface NavItem {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    label: 'Foods',
    items: [
      { href: '/foods/wheel/', label: 'Wheel' },
      { href: '/foods/randomizer/', label: 'Randomizer' },
      { href: '/foods/dishes/', label: 'Dishes' },
    ],
  },
  {
    label: 'Drinks',
    items: [
      { href: '/drinks/wheel/', label: 'Wheel' },
      { href: '/drinks/randomizer/', label: 'Randomizer' },
      { href: '/drinks/dishes/', label: 'Drinks' },
    ],
  },
  {
    label: 'Snacks',
    items: [
      { href: '/snacks/wheel/', label: 'Wheel' },
      { href: '/snacks/randomizer/', label: 'Randomizer' },
      { href: '/snacks/dishes/', label: 'Snacks' },
    ],
  },
];

const SCHEDULE_ITEMS: NavItem[] = [
  { href: '/schedule/', label: 'Overview' },
  { href: '/schedule/scheldon/', label: "Sheldon's Schedule" },
  { href: '/schedule/vietnam/', label: 'Vietnam' },
  { href: '/schedule/united-kingdom/', label: 'United Kingdom' },
];

const Dropdown: FC<{
  label: string;
  items: NavItem[];
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}> = ({ label, items, open, onToggle, onNavigate }) => (
  <div className="relative">
    <button
      type="button"
      aria-expanded={open}
      aria-haspopup="true"
      onClick={onToggle}
      className={`${NAV_LINK} inline-flex items-center gap-1`}>
      {label}
      <span aria-hidden="true" className="text-xs">
        {open ? '▴' : '▾'}
      </span>
    </button>
    {open && (
      <ul className="border-base-content/10 bg-base-100 absolute top-full left-0 z-50 mt-1 min-w-40 rounded-xl border p-1 shadow-lg">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="text-base-content/70 hover:bg-base-200 hover:text-primary block rounded-lg px-3 py-2 text-sm font-semibold transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export const Navbar: FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const close = () => setOpenMenu(null);

  const renderGroup = (
    group: NavGroup | { label: string; items: NavItem[] }
  ) => (
    <Dropdown
      key={group.label}
      label={group.label}
      items={group.items}
      open={openMenu === group.label}
      onToggle={() =>
        setOpenMenu(openMenu === group.label ? null : group.label)
      }
      onNavigate={close}
    />
  );

  return (
    <header className="border-base-content/10 bg-base-100/90 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-5">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icons/icon.svg`}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-serif text-lg font-bold tracking-tight">
            FDR
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {GROUPS.map(renderGroup)}
          {renderGroup({ label: 'Schedules', items: SCHEDULE_ITEMS })}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm ml-2 gap-1.5">
            <PiGithubLogo className="h-4 w-4" />
            GitHub
          </a>
        </nav>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm ml-auto gap-1.5 md:hidden">
          <PiGithubLogo className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
};

export default Navbar;

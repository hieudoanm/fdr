'use client';

import Link from 'next/link';
import { FC } from 'react';
import { OfflineBadge } from '@/components/atoms/OfflineBadge';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';

export const Header: FC = () => (
  <header className="border-base-300 bg-base-100 sticky top-0 z-10 border-b px-4 py-3 sm:px-6">
    <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
      <Link href="/" className="text-base-content text-sm font-bold">
        Food &amp; Drink
      </Link>
      <div className="flex items-center gap-2">
        <OfflineBadge />
        <ThemeToggle />
      </div>
    </div>
  </header>
);

Header.displayName = 'Header';

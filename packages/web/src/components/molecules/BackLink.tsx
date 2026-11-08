import Link from 'next/link';
import type { FC } from 'react';
import { PiArrowLeft } from 'react-icons/pi';

export const BackLink: FC = () => (
  <nav aria-label="Back" className="flex w-full max-w-3xl justify-center">
    <Link
      href="/"
      data-testid="back-home"
      className="text-base-content/60 hover:text-primary inline-flex items-center gap-1 text-sm font-semibold">
      <PiArrowLeft className="h-3.5 w-3.5" />
      Home
    </Link>
  </nav>
);

BackLink.displayName = 'BackLink';

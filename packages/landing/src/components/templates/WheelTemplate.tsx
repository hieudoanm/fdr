import type { FC } from 'react';
import { CuisineWheel } from '@/components/organisms/Wheel';
import { BackLink } from '@/components/molecules/BackLink';

interface WheelTemplateProps {
  blurb: string;
  randomizerBasePath?: string;
  title: string;
}

export const WheelTemplate: FC<WheelTemplateProps> = ({
  blurb,
  randomizerBasePath,
  title,
}) => (
  <main className="bg-base-100 flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-12 sm:px-6">
    <BackLink />
    <div className="text-center">
      <h1 className="text-primary font-serif text-3xl font-bold tracking-tight">
        {title}
      </h1>
      <p className="text-base-content/60 mt-1 text-sm">{blurb}</p>
    </div>
    <CuisineWheel randomizerBasePath={randomizerBasePath} />
  </main>
);

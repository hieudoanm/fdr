'use client';

import type { FC } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Food } from '@/data';
import { FoodRandomizer } from '@/components/organisms/Randomizer';
import { BackLink } from '@/components/molecules/BackLink';

interface RandomizerTemplateProps {
  basePath: string;
  items: Food[];
  optionsMap: Record<string, string[]>;
  title: string;
  blurb: string;
  unitLabel: string;
}

const RandomizerContent: FC<RandomizerTemplateProps> = ({
  basePath,
  items,
  optionsMap,
  title,
  blurb,
  unitLabel,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCountry = searchParams.get('country') ?? 'all';

  const handleCountryChange = (value: string) => {
    router.replace(value === 'all' ? basePath : `${basePath}?country=${value}`);
  };

  return (
    <FoodRandomizer
      items={items}
      optionsMap={optionsMap}
      title={title}
      blurb={blurb}
      unitLabel={unitLabel}
      initialCountry={initialCountry}
      onCountryChange={handleCountryChange}
    />
  );
};

export const RandomizerTemplate: FC<RandomizerTemplateProps> = (props) => (
  <main className="bg-base-100 flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-12 sm:px-6">
    <BackLink />
    <Suspense fallback={null}>
      <RandomizerContent {...props} />
    </Suspense>
  </main>
);

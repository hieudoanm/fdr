import type { FC } from 'react';
import { CuisineList } from '@/components/organisms/List';
import { BackLink } from '@/components/molecules/BackLink';
import type { ListKind } from '@/components/organisms/List';

interface DishesTemplateProps {
  blurb: string;
  kind: ListKind;
  title: string;
}

export const DishesTemplate: FC<DishesTemplateProps> = ({
  blurb,
  kind,
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
    <CuisineList kind={kind} />
  </main>
);

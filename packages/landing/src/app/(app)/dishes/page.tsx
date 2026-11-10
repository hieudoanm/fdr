import { CuisineList } from '@/components/organisms/List';
import { BackLink } from '@/components/molecules/BackLink';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Dishes | FDR',
  description: "Browse and search dishes across the world's cuisines",
  alternates: { canonical: '/dishes/' },
};

const DishesPage: NextPage = () => (
  <main className="bg-base-100 flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-12 sm:px-6">
    <BackLink />
    <div className="text-center">
      <h1 className="text-primary font-serif text-3xl font-bold tracking-tight">
        Dishes
      </h1>
      <p className="text-base-content/60 mt-1 text-sm">
        Browse and search dishes across the world's cuisines
      </p>
    </div>
    <CuisineList />
  </main>
);

export default DishesPage;

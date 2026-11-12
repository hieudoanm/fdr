import { DishesTemplate } from '@/components/templates/DishesTemplate';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Dishes | FDR',
  description: "Browse and search dishes across the world's cuisines",
  alternates: { canonical: '/foods/dishes/' },
};

const Page: NextPage = () => (
  <DishesTemplate
    blurb="Browse and search dishes across the world's cuisines"
    kind="foods"
    title="Dishes"
  />
);

export default Page;

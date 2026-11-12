import { DishesTemplate } from '@/components/templates/DishesTemplate';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Drinks | FDR',
  description: "Browse and search drinks across the world's cuisines",
  alternates: { canonical: '/drinks/dishes/' },
};

const Page: NextPage = () => (
  <DishesTemplate
    blurb="Browse and search drinks across the world's cuisines"
    kind="drinks"
    title="Drinks"
  />
);

export default Page;

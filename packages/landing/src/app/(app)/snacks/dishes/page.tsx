import { DishesTemplate } from '@/components/templates/DishesTemplate';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Snacks | FDR',
  description:
    "Browse and search snacks and desserts across the world's cuisines",
  alternates: { canonical: '/snacks/dishes/' },
};

const Page: NextPage = () => (
  <DishesTemplate
    blurb="Browse and search snacks and desserts across the world's cuisines"
    kind="snacks"
    title="Snacks"
  />
);

export default Page;

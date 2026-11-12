import { WheelTemplate } from '@/components/templates/WheelTemplate';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Wheel of Cuisine | FDR',
  description: 'Spin the wheel to let fate pick a country to drink from',
  alternates: { canonical: '/drinks/wheel/' },
};

const Page: NextPage = () => (
  <WheelTemplate
    blurb="Spin the wheel to let fate pick a country to drink from"
    randomizerBasePath="/drinks/randomizer"
    title="Wheel of Cuisine"
  />
);

export default Page;

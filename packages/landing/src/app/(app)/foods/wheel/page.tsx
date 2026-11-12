import { WheelTemplate } from '@/components/templates/WheelTemplate';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Wheel of Cuisine | FDR',
  description: 'Spin the wheel to let fate pick a country to eat from',
  alternates: { canonical: '/foods/wheel/' },
};

const Page: NextPage = () => (
  <WheelTemplate
    blurb="Spin the wheel to let fate pick a country to eat from"
    title="Wheel of Cuisine"
  />
);

export default Page;

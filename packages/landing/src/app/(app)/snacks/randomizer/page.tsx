import { snacks, SNACK_OPTIONS } from '@/data';
import { RandomizerTemplate } from '@/components/templates/RandomizerTemplate';
import type { NextPage } from 'next';

const Page: NextPage = () => (
  <RandomizerTemplate
    basePath="/snacks/randomizer"
    items={snacks}
    optionsMap={SNACK_OPTIONS}
    title="Snack Randomizer"
    blurb="Can't decide on a snack? Spin the reel and let fate choose."
    unitLabel="snacks"
  />
);

export default Page;

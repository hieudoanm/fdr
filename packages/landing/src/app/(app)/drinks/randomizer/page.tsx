import { drinks, DRINK_OPTIONS } from '@/data';
import { RandomizerTemplate } from '@/components/templates/RandomizerTemplate';
import type { NextPage } from 'next';

const Page: NextPage = () => (
  <RandomizerTemplate
    basePath="/drinks/randomizer"
    items={drinks}
    optionsMap={DRINK_OPTIONS}
    title="Drink Randomizer"
    blurb="Can't decide what to drink? Spin the reel and let fate choose."
    unitLabel="drinks"
  />
);

export default Page;

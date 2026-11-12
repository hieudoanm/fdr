import { foods, FOOD_OPTIONS } from '@/data';
import { RandomizerTemplate } from '@/components/templates/RandomizerTemplate';
import type { NextPage } from 'next';

const Page: NextPage = () => (
  <RandomizerTemplate
    basePath="/foods/randomizer"
    items={foods}
    optionsMap={FOOD_OPTIONS}
    title="Food Randomizer"
    blurb="Can't decide what to eat? Spin the reel and let fate choose."
    unitLabel="dishes"
  />
);

export default Page;

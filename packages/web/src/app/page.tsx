import {
  CourseGrid,
  HomeTemplate,
  scheduleToCourseItem,
  type CourseItem,
} from '@/components/templates/HomeTemplate';
import { listSchedules } from '@/data';
import type { Metadata } from 'next';
import { NextPage } from 'next';
import { PiCircleNotch, PiHamburger, PiListDashes } from 'react-icons/pi';

const ITEMS: CourseItem[] = [
  {
    label: 'Wheel of Cuisine',
    description: 'Spin a wheel to choose a country to eat from',
    icon: PiCircleNotch,
    href: '/wheel/',
  },
  {
    label: 'Food Randomizer',
    description: 'Spin the reel to pick what to eat today',
    icon: PiHamburger,
    href: '/randomizer/',
  },
  {
    label: 'Dishes',
    description: 'Browse and search dishes across world cuisines',
    icon: PiListDashes,
    href: '/dishes/',
  },
];

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const SCHEDULE_ITEMS = listSchedules().map(scheduleToCourseItem);

const HomePage: NextPage = () => {
  return (
    <HomeTemplate
      title="Food & Drink"
      description="Can't decide what to eat? Spin the reel and let fate choose."
      items={ITEMS}>
      <div className="text-base-content/50 flex w-full max-w-3xl items-center gap-4 text-xs font-bold tracking-widest uppercase">
        <hr className="border-base-content/10 flex-1 border-t" />
        Schedules
        <hr className="border-base-content/10 flex-1 border-t" />
      </div>
      <CourseGrid items={SCHEDULE_ITEMS} />
    </HomeTemplate>
  );
};

export default HomePage;

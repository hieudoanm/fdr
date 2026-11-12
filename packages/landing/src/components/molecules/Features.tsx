import type { FC } from 'react';
import { PiCalendarBlank, PiListDashes, PiWifiSlash } from 'react-icons/pi';
import SectionHead from './SectionHead';
import { countries, foodsAndDrinks } from '@/data';

const FEATURES = [
  {
    icon: PiListDashes,
    title: 'Dish index',
    description: `Search ${foodsAndDrinks.length} dishes, drinks and snacks across ${countries.length} cuisines`,
  },
  {
    icon: PiCalendarBlank,
    title: 'Weekly schedules',
    description: 'Follow a ready-made plan instead of deciding nightly',
  },
  {
    icon: PiWifiSlash,
    title: 'Works offline',
    description:
      'Installs to your home screen and keeps working without signal',
  },
];

const Features: FC = () => (
  <section className="border-base-content/10 border-t">
    <div className="mx-auto w-full max-w-6xl px-5 py-20">
      <SectionHead
        title="Features"
        description="Everything you need to end dinner indecision — fast, offline, and free."
      />
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="border-base-content/10 rounded-xl border p-5">
            <div className="bg-primary/10 text-primary mb-3 flex h-9 w-9 items-center justify-center rounded-lg">
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold">{title}</h3>
            <p className="text-base-content/60 mt-1 text-xs">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;

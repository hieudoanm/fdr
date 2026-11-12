import Link from 'next/link';
import type { Metadata } from 'next';
import { NextPage } from 'next';
import type { FC } from 'react';
import {
  PiCalendarBlank,
  PiCircleNotch,
  PiCookie,
  PiHamburger,
  PiListDashes,
  PiWifiSlash,
  PiWine,
} from 'react-icons/pi';
import {
  CourseGrid,
  scheduleToCourseItem,
  type CourseItem,
} from '@/components/templates/HomeTemplate';
import Footer from '@/components/molecules/Footer';
import Features, { type Feature } from '@/components/molecules/Features';
import CTA from '@/components/molecules/CTA';
import Hero from '@/components/molecules/Hero';
import SectionHead from '@/components/molecules/SectionHead';
import { countries, foodsAndDrinks, listSchedules } from '@/data';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const FEATURES: Feature[] = [
  {
    title: 'Dish index',
    body: `Search ${foodsAndDrinks.length} dishes, drinks and snacks across ${countries.length} cuisines`,
    icon: PiListDashes,
  },
  {
    title: 'Weekly schedules',
    body: 'Follow a ready-made plan instead of deciding nightly',
    icon: PiCalendarBlank,
  },
  {
    title: 'Works offline',
    body: 'Installs to your home screen and keeps working without signal',
    icon: PiWifiSlash,
  },
];

const APP_ITEMS: CourseItem[] = [
  {
    label: 'Food Wheel',
    description: 'Spin to pick a cuisine to eat from',
    icon: PiCircleNotch,
    href: '/foods/wheel/',
  },
  {
    label: 'Food Randomizer',
    description: 'Spin the reel to pick what to eat today',
    icon: PiHamburger,
    href: '/foods/randomizer/',
  },
  {
    label: 'Food Dishes',
    description: 'Browse and search food dishes by cuisine',
    icon: PiListDashes,
    href: '/foods/dishes/',
  },
  {
    label: 'Drink Wheel',
    description: 'Spin to pick a cuisine to drink from',
    icon: PiCircleNotch,
    href: '/drinks/wheel/',
  },
  {
    label: 'Drink Randomizer',
    description: 'Spin the reel to pick what to drink today',
    icon: PiWine,
    href: '/drinks/randomizer/',
  },
  {
    label: 'Drink Dishes',
    description: 'Browse and search drinks by cuisine',
    icon: PiListDashes,
    href: '/drinks/dishes/',
  },
  {
    label: 'Snack Wheel',
    description: 'Spin to pick a cuisine for a snack',
    icon: PiCircleNotch,
    href: '/snacks/wheel/',
  },
  {
    label: 'Snack Randomizer',
    description: 'Spin the reel to pick a snack or dessert',
    icon: PiCookie,
    href: '/snacks/randomizer/',
  },
  {
    label: 'Snack Dishes',
    description: 'Browse and search snacks by cuisine',
    icon: PiListDashes,
    href: '/snacks/dishes/',
  },
];

const SCHEDULE_ITEMS = listSchedules().map(scheduleToCourseItem);

const STATS = [
  { value: foodsAndDrinks.length, label: 'dishes' },
  { value: countries.length, label: 'cuisines' },
  { value: listSchedules().length, label: 'schedules' },
];

const HomePage: NextPage = () => {
  return (
    <div className="bg-base-100 min-h-dvh">
      <main id="top">
        <Hero
          title={
            <>
              Can&apos;t decide
              <span className="text-primary">what to eat?</span>
            </>
          }
          description="Spin the wheel, roll the reel, or follow a weekly schedule — FDR turns dinner indecision into a game."
          primary={{ label: 'Spin the wheel', href: '/foods/wheel/' }}
          secondary={{
            label: 'Try the randomizer',
            href: '/foods/randomizer/',
          }}
          stats={STATS}>
          <figure className="w-full max-w-sm justify-self-center lg:justify-self-end">
            <figcaption className="text-base-content/50 mb-3 text-xs font-bold tracking-widest uppercase">
              Example pick
            </figcaption>
            <div className="border-base-content/10 bg-base-200 rounded-3xl border p-10 text-center">
              <span className="text-7xl" aria-hidden="true">
                🍣
              </span>
              <p className="mt-5 font-serif text-3xl font-bold">Sushi</p>
              <p className="text-base-content/60 mt-2 text-sm">
                🇯🇵 Japanese · Main course
              </p>
              <span className="badge badge-primary badge-outline mt-6">
                Your meal
              </span>
            </div>
          </figure>
        </Hero>

        <Features
          title="Everything you need to end dinner indecision."
          description="Fast, offline, and free — every tool in one place."
          features={FEATURES}
        />

        <section
          id="apps"
          className="border-base-content/10 bg-base-200 border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-20">
            <SectionHead
              title="Apps"
              description="Every tool in one place — wheels, reels, menus, and weekly dining schedules."
            />
            <CourseGrid wide items={[...APP_ITEMS, ...SCHEDULE_ITEMS]} />
          </div>
        </section>

        <CTA
          title="Still can't decide?"
          description="Let fate pick tonight's meal — it takes less time than scrolling delivery apps."
          primary={{ label: 'Spin the wheel', href: '/foods/wheel/' }}
          secondary={{
            label: 'Star on GitHub',
            href: 'https://github.com/hieudoanm/fdr',
            external: true,
          }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

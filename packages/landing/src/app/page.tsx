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
import Features from '@/components/molecules/Features';
import CTA from '@/components/molecules/CTA';
import SectionHead from '@/components/molecules/SectionHead';
import { countries, foodsAndDrinks, listSchedules } from '@/data';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

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
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-16 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
          <div>
            <h1 className="font-serif text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
              Can&apos;t decide{' '}
              <span className="text-primary">what to eat?</span>
            </h1>
            <p className="text-base-content/60 mt-6 max-w-xl text-lg">
              Spin the wheel, roll the reel, or follow a weekly schedule — FDR
              turns dinner indecision into a game.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/foods/wheel/" className="btn btn-primary btn-lg">
                Spin the wheel
              </Link>
              <Link href="/foods/randomizer/" className="btn btn-ghost btn-lg">
                Try the randomizer
              </Link>
            </div>
            <dl className="mt-12 flex items-start gap-10 sm:gap-14">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-primary font-serif text-4xl font-bold sm:text-5xl">
                    {stat.value}
                  </dt>
                  <dd className="text-base-content/50 mt-1 text-xs font-bold tracking-widest uppercase">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

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
        </section>

        <Features />

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

        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

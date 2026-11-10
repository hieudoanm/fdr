import Link from 'next/link';
import type { Metadata } from 'next';
import { NextPage } from 'next';
import type { FC } from 'react';
import {
  PiCircleNotch,
  PiGithubLogo,
  PiHamburger,
  PiListDashes,
} from 'react-icons/pi';
import {
  CourseGrid,
  scheduleToCourseItem,
  type CourseItem,
} from '@/components/templates/HomeTemplate';
import { countries, foods, listSchedules } from '@/data';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

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

const SCHEDULE_ITEMS = listSchedules().map(scheduleToCourseItem);

const STATS = [
  { value: foods.length, label: 'dishes' },
  { value: countries.length, label: 'cuisines' },
  { value: listSchedules().length, label: 'schedules' },
];

const GITHUB_URL = 'https://github.com/hieudoanm/fdr';

const SectionHead: FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="mb-10 max-w-2xl">
    <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
      {title}
    </h2>
    <p className="text-base-content/60 mt-3 text-base">{description}</p>
  </div>
);

SectionHead.displayName = 'SectionHead';

const HomePage: NextPage = () => {
  return (
    <div className="bg-base-100 min-h-dvh">
      <header className="border-base-content/10 bg-base-100/90 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5">
          <a href="#top" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG asset */}
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icons/icon.svg`}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-serif text-lg font-bold tracking-tight">
              FDR
            </span>
          </a>
          <nav className="ml-auto hidden items-center gap-6 sm:flex">
            <a
              href="#apps"
              className="text-base-content/60 hover:text-primary text-sm font-semibold transition-colors">
              Apps
            </a>
            <a
              href="#schedules"
              className="text-base-content/60 hover:text-primary text-sm font-semibold transition-colors">
              Schedules
            </a>
          </nav>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm ml-auto gap-1.5 sm:ml-0">
            <PiGithubLogo className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </header>

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
              <Link href="/wheel/" className="btn btn-primary btn-lg">
                Spin the wheel
              </Link>
              <Link href="/randomizer/" className="btn btn-ghost btn-lg">
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

        <section id="apps" className="border-base-content/10 border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-20">
            <SectionHead
              title="Apps"
              description="Three ways to let fate decide — each one a tiny app of its own."
            />
            <CourseGrid items={ITEMS} />
          </div>
        </section>

        <section
          id="schedules"
          className="border-base-content/10 bg-base-200 border-t">
          <div className="mx-auto w-full max-w-6xl px-5 py-20">
            <SectionHead
              title="Schedules"
              description="Weekly dining plans to inspect — from a sitcom legend to two weeks of Vietnamese classics."
            />
            <CourseGrid items={SCHEDULE_ITEMS} />
          </div>
        </section>
      </main>

      <footer className="border-base-content/10 border-t">
        <div className="text-base-content/50 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs">
          <span>© 2026 FDR — Food &amp; Drink</span>
          <span>Static site · MIT licensed</span>
          <nav className="flex items-center gap-5">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary inline-flex items-center gap-1.5 font-semibold transition-colors">
              <PiGithubLogo className="h-4 w-4" />
              GitHub
            </a>
            <a
              href={`${GITHUB_URL}/blob/master/README.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary font-semibold transition-colors">
              README
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

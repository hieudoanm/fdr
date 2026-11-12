import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { FC, ReactNode } from 'react';
import { ServiceWorker } from '@/components/atoms/ServiceWorker';
import Navbar from '@/components/molecules/Navbar';
import { OfflineBadge } from '@/components/atoms/OfflineBadge';

export const metadata: Metadata = {
  title: 'FDR',
  description: 'Spin the reel and let fate pick your next meal',
  metadataBase: new URL('https://hieudoanm.github.io/fdr/'),
  openGraph: {
    type: 'website',
    siteName: 'FDR',
    url: 'https://hieudoanm.github.io/fdr/',
    title: 'Spin the wheel, eat better',
    description:
      'Spin the reel and let fate pick your next meal, with a weekly schedule and a reusable dish list.',
    images: [
      {
        url: '/og.png',
        width: 1280,
        height: 640,
        alt: 'FDR — Spin the wheel, eat better',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spin the wheel, eat better',
    description:
      'Spin the reel and let fate pick your next meal, with a weekly schedule and a reusable dish list.',
    images: ['/og.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FDR',
  },
  icons: {
    apple: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icons/icon-180x180.png`,
        sizes: '180x180',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const inter = Inter({ subsets: ['latin'] });

const GITHUB_URL = 'https://github.com/hieudoanm/fdr';
const LOGO = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icons/icon.svg`;

const TOOL_ITEMS = (base: string) => [
  { href: `${base}/wheel/`, label: 'Wheel' },
  { href: `${base}/randomizer/`, label: 'Randomizer' },
  { href: `${base}/dishes/`, label: 'Dishes' },
];

const NAV_GROUPS = [
  { label: 'Foods', items: TOOL_ITEMS('/foods') },
  { label: 'Drinks', items: TOOL_ITEMS('/drinks') },
  {
    label: 'Snacks',
    items: [
      { href: '/snacks/wheel/', label: 'Wheel' },
      { href: '/snacks/randomizer/', label: 'Randomizer' },
      { href: '/snacks/dishes/', label: 'Snacks' },
    ],
  },
  {
    label: 'Schedules',
    items: [
      { href: '/schedule/', label: 'Overview' },
      { href: '/schedule/sheldon/', label: "Sheldon's Schedule" },
      { href: '/schedule/vietnam/', label: 'Vietnam' },
      { href: '/schedule/united-kingdom/', label: 'United Kingdom' },
    ],
  },
];

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <html lang="en" data-theme="fdr" className={inter.className}>
    <body className="bg-base-100 text-base-content h-screen overflow-y-auto">
      <Navbar
        name="FDR"
        logoSrc={LOGO}
        links={[]}
        groups={NAV_GROUPS}
        githubUrl={GITHUB_URL}
      />
      {children}
      <ServiceWorker />
      <div className="pointer-events-none fixed right-4 bottom-4 z-50">
        <OfflineBadge />
      </div>
    </body>
  </html>
);

export default RootLayout;

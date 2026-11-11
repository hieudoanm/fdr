import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { FC, ReactNode } from 'react';
import { SWProvider } from '@/providers/SWProvider';
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

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <html lang="en" data-theme="fdr">
    <body className="bg-base-100 text-base-content h-screen overflow-y-auto font-mono">
      <SWProvider>{children}</SWProvider>
      <div className="pointer-events-none fixed right-4 bottom-4 z-50">
        <OfflineBadge />
      </div>
    </body>
  </html>
);

export default RootLayout;

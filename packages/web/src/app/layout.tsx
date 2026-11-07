import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { FC, ReactNode } from 'react';
import { Header } from '@/components/organisms/Header';
import { SWProvider } from '@/providers/SWProvider';

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
        url: '/og/og.png',
        width: 1200,
        height: 630,
        alt: 'FDR — Spin the wheel, eat better',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spin the wheel, eat better',
    description:
      'Spin the reel and let fate pick your next meal, with a weekly schedule and a reusable dish list.',
    images: ['/og/og.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FDR',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const themeScript = `try{var t=localStorage.getItem('fdr:theme');if(t==='fdr'||t==='fdr-dark')document.documentElement.dataset.theme=t;}catch(e){}`;
const iconHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icons/icon-192x192.png`;

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <html lang="en" data-theme="fdr" suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <link rel="apple-touch-icon" href={iconHref} />
    </head>
    <body className="bg-base-100 text-base-content h-screen overflow-y-auto font-mono">
      <SWProvider>
        <Header />
        {children}
      </SWProvider>
    </body>
  </html>
);

export default RootLayout;

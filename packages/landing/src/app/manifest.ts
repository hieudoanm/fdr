import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// URLs are relative so they resolve against the manifest URL, which keeps
// them correct under the /fdr base path used by GitHub Pages.
const manifest = (): MetadataRoute.Manifest => ({
  name: 'FDR — Food & Drink Randomizer',
  short_name: 'FDR',
  description:
    'Spin the reel and let fate pick your next meal, with a weekly schedule and a reusable dish list.',
  start_url: './',
  scope: './',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#dc2626',
  orientation: 'any',
  lang: 'en',
  dir: 'ltr',
  categories: ['food and drink'],
  shortcuts: [
    {
      name: 'Spin the wheel',
      short_name: 'Wheel',
      description: 'Pick a cuisine at random',
      url: './wheel/',
      icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192' }],
    },
    {
      name: 'Food randomizer',
      short_name: 'Randomizer',
      description: 'Spin the reel to pick a dish',
      url: './randomizer/',
      icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192' }],
    },
  ],
  icons: [
    { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    {
      src: 'icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    {
      src: 'icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
});

export default manifest;

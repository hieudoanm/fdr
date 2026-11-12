import type { MetadataRoute } from 'next';
import { listSchedules } from '@/data';

export const dynamic = 'force-static';

const SITE_URL = 'https://hieudoanm.github.io/fdr';

const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
  {
    url: `${SITE_URL}/foods/wheel/`,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/foods/randomizer/`,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/foods/dishes/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/drinks/wheel/`,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/drinks/randomizer/`,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/drinks/dishes/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/snacks/wheel/`,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/snacks/randomizer/`,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/snacks/dishes/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  { url: `${SITE_URL}/schedule/`, changeFrequency: 'monthly', priority: 0.6 },
  ...listSchedules().map((schedule) => ({
    url: `${SITE_URL}/schedule/${schedule.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })),
];

export default sitemap;

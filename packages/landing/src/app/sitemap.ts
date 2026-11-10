import type { MetadataRoute } from 'next';
import { listSchedules } from '@/data';

export const dynamic = 'force-static';

const SITE_URL = 'https://hieudoanm.github.io/fdr';

const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
  { url: `${SITE_URL}/wheel/`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${SITE_URL}/randomizer/`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${SITE_URL}/dishes/`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE_URL}/schedule/`, changeFrequency: 'monthly', priority: 0.6 },
  ...listSchedules().map((schedule) => ({
    url: `${SITE_URL}/schedule/${schedule.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })),
];

export default sitemap;

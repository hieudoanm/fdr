import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: '*',
      allow: '/',
    },
    {
      userAgent: AI_BOTS,
      allow: '/',
    },
  ],
  sitemap: 'https://hieudoanm.github.io/fdr/sitemap.xml',
});

export default robots;

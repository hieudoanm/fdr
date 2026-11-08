import scheldon from './json/schedule-scheldon.json';
import vietnam from './json/schedule-vietnam.json';
import unitedKingdom from './json/schedule-united-kingdom.json';
import type { ScheduleEntry, ScheduleMeta } from './types';

const SCHEDULES: ScheduleMeta[] = [
  {
    slug: 'scheldon',
    label: "Sheldon's Schedule",
    description: 'A week of meals dictated by a rigorous schedule',
    emoji: '📜',
    quote: 'I cannot accept a fluctuating weekly dining schedule.',
    entries: scheldon,
  },
  {
    slug: 'vietnam',
    label: 'Vietnam',
    description: 'Two weeks of classic Vietnamese dishes',
    emoji: '🇻🇳',
    entries: vietnam,
  },
  {
    slug: 'united-kingdom',
    label: 'United Kingdom',
    description: 'A week of British comfort food',
    emoji: '🇬🇧',
    entries: unitedKingdom,
  },
];

export const getSchedule = (slug: string): ScheduleMeta | undefined =>
  SCHEDULES.find((schedule) => schedule.slug === slug);

export const listSchedules = (): ScheduleMeta[] => SCHEDULES;

export default SCHEDULES;

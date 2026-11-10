import type { Metadata, NextPage } from 'next';
import {
  HomeTemplate,
  scheduleToCourseItem,
} from '@/components/templates/HomeTemplate';
import { listSchedules } from '@/data';

export const metadata: Metadata = {
  title: 'Food Schedules | FDR',
  description: 'Pick a weekly dining schedule to inspect',
  alternates: { canonical: '/schedule/' },
};

const SchedulePage: NextPage = () => (
  <HomeTemplate
    title="Food Schedules"
    description="Pick a weekly dining schedule to inspect"
    items={listSchedules().map(scheduleToCourseItem)}
    showBackLink
  />
);

export default SchedulePage;

import { NextPage } from 'next';
import {
  HomeTemplate,
  scheduleToCourseItem,
} from '@/components/templates/HomeTemplate';
import { listSchedules } from '@/data';

const SchedulePage: NextPage = () => (
  <HomeTemplate
    title="Food Schedules"
    description="Pick a weekly dining schedule to inspect"
    items={listSchedules().map(scheduleToCourseItem)}
    showBackLink
  />
);

export default SchedulePage;

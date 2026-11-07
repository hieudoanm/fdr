import { NextPage } from 'next';
import { FoodSchedule } from '@/components/organisms/Schedule';
import { SchedulePicker } from '@/components/molecules/SchedulePicker';
import { listSchedules } from '@/data';

const SchedulePage: NextPage = () => {
  const schedules = listSchedules();

  return (
    <main className="bg-base-100 flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-primary font-serif text-3xl font-bold tracking-tight">
          Food Schedules
        </h1>
        <p className="text-base-content/60 mt-1 text-sm">
          Pick a weekly dining schedule to inspect
        </p>
      </div>
      <div className="w-full max-w-3xl">
        <SchedulePicker schedules={schedules} />
      </div>
      <div className="w-full max-w-3xl">
        <FoodSchedule
          entries={schedules[0].entries}
          quote={schedules[0].quote}
        />
      </div>
    </main>
  );
};

export default SchedulePage;

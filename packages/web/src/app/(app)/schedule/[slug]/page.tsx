import type { NextPage } from 'next';
import { notFound } from 'next/navigation';
import { FoodSchedule } from '@/components/organisms/Schedule';
import { SchedulePicker } from '@/components/molecules/SchedulePicker';
import { getSchedule, listSchedules } from '@/data';

interface ScheduleSlugPageProps {
  params: Promise<{ slug: string }>;
}

const ScheduleSlugPage: NextPage<ScheduleSlugPageProps> = async ({
  params,
}) => {
  const { slug } = await params;
  const schedule = getSchedule(slug);
  if (!schedule) notFound();

  return (
    <main className="bg-base-100 flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-primary font-serif text-3xl font-bold tracking-tight">
          {schedule.label}
        </h1>
        <p className="text-base-content/60 mt-1 text-sm">
          {schedule.description}
        </p>
      </div>
      <div className="w-full max-w-3xl">
        <SchedulePicker schedules={listSchedules()} activeSlug={slug} />
      </div>
      <div className="w-full max-w-3xl">
        <FoodSchedule entries={schedule.entries} quote={schedule.quote} />
      </div>
    </main>
  );
};

export default ScheduleSlugPage;

export function generateStaticParams() {
  return listSchedules().map((schedule) => ({ slug: schedule.slug }));
}

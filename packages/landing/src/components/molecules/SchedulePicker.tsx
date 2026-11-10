import type { FC } from 'react';
import Link from 'next/link';
import { PiCalendarDots } from 'react-icons/pi';
import type { ScheduleEntry } from '@/data';

export interface ScheduleSummary {
  slug: string;
  label: string;
  description: string;
  emoji: string;
  entries: ScheduleEntry[];
}

interface SchedulePickerProps {
  schedules: ScheduleSummary[];
  activeSlug?: string;
}

export const SchedulePicker: FC<SchedulePickerProps> = ({
  schedules,
  activeSlug,
}) => (
  <div className="flex flex-col gap-2">
    {schedules.map((schedule) => {
      const isActive = schedule.slug === activeSlug;
      return (
        <Link
          key={schedule.slug}
          href={`/schedule/${schedule.slug}/`}
          data-testid={`schedule-picker-${schedule.slug}`}
          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
            isActive
              ? 'border-accent/50 bg-accent/10 text-accent'
              : 'border-base-content/10 bg-base-200 text-base-content hover:border-base-content/30'
          }`}>
          <span className="bg-base-300 flex h-9 w-9 items-center justify-center rounded-full text-base">
            {schedule.emoji}
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold">{schedule.label}</span>
            <span className="text-base-content/60 block text-xs font-normal">
              {schedule.description}
            </span>
          </span>
          <PiCalendarDots className="text-base-content/40 h-4 w-4" />
        </Link>
      );
    })}
  </div>
);

SchedulePicker.displayName = 'SchedulePicker';

'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { ScheduleEntry } from '@/data';

const todayLabel = (): string =>
  new Date().toLocaleDateString('en-US', { weekday: 'long' });

interface FoodScheduleProps {
  entries: ScheduleEntry[];
  quote?: string;
  today?: string;
}

export const FoodSchedule: FC<FoodScheduleProps> = ({
  entries,
  quote,
  today,
}) => {
  const [clientToday, setClientToday] = useState('');

  useEffect(() => {
    if (!today) setClientToday(todayLabel());
  }, [today]);

  const activeDay = today ?? clientToday;
  const showWeek = entries.some((entry) => entry.week);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {quote && (
        <p className="text-base-content/60 border-base-content/10 bg-base-200 rounded-xl border px-4 py-3 text-center text-sm italic">
          “{quote}”
        </p>
      )}

      <div className="border-base-content/10 bg-base-200 overflow-hidden rounded-2xl border">
        <table
          data-testid="schedule-table"
          className="w-full text-left text-sm">
          <thead>
            <tr className="text-base-content/50 border-base-content/10 border-b text-xs font-bold tracking-wider uppercase">
              <th scope="col" className="px-4 py-3">
                Day
              </th>
              {showWeek && (
                <th scope="col" className="px-4 py-3">
                  Week
                </th>
              )}
              <th scope="col" className="px-4 py-3">
                Meal
              </th>
              <th scope="col" className="px-4 py-3">
                Source
              </th>
              <th scope="col" className="hidden px-4 py-3 sm:table-cell">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isToday = entry.day === activeDay;
              return (
                <tr
                  key={entry.week ? `${entry.week}-${entry.day}` : entry.day}
                  data-testid="schedule-row"
                  data-today={isToday || undefined}
                  className={`border-base-content/5 border-b transition-colors last:border-b-0 ${
                    isToday ? 'text-accent bg-accent/10' : ''
                  }`}>
                  <td className="px-4 py-3 font-semibold">{entry.day}</td>
                  {showWeek && (
                    <td className="text-base-content/60 px-4 py-3">
                      {entry.week}
                    </td>
                  )}
                  <td className="px-4 py-3 font-medium">
                    <span className="mr-2">{entry.emoji}</span>
                    {entry.meal}
                  </td>
                  <td className="text-base-content/70 px-4 py-3">
                    {entry.restaurant}
                  </td>
                  <td className="text-base-content/60 hidden px-4 py-3 sm:table-cell">
                    {entry.note}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p
        data-testid="schedule-today"
        className="text-base-content/60 m-0 text-center text-xs">
        {activeDay}
      </p>
    </div>
  );
};

FoodSchedule.displayName = 'FoodSchedule';

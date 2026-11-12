import { listSchedules, getSchedule } from '@/data';

describe('schedules', () => {
  it('lists three schedules', () => {
    const schedules = listSchedules();
    expect(schedules).toHaveLength(3);
    expect(schedules.map((s) => s.slug)).toEqual([
      'scheldon',
      'vietnam',
      'united-kingdom',
    ]);
  });

  it('returns the schedule by slug', () => {
    const vietnam = getSchedule('vietnam');
    expect(vietnam).toBeDefined();
    expect(vietnam?.label).toBe('Vietnam');
    expect(vietnam?.entries).toHaveLength(28);
  });

  it('returns undefined for an unknown slug', () => {
    expect(getSchedule('nope')).toBeUndefined();
  });

  it('each schedule has whole weeks of entries', () => {
    listSchedules().forEach((schedule) => {
      expect(schedule.entries.length % 7).toBe(0);
      schedule.entries.forEach((entry) => {
        expect(entry.day.length).toBeGreaterThan(0);
        expect(entry.meal.length).toBeGreaterThan(0);
        expect(entry.emoji.length).toBeGreaterThan(0);
        expect(entry.restaurant.length).toBeGreaterThan(0);
        expect(entry.note.length).toBeGreaterThan(0);
      });
    });
  });
});

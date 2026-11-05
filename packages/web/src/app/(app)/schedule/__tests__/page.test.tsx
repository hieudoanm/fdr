import { render, screen } from '@testing-library/react';
import SchedulePage from '@/app/(app)/schedule/page';

jest.mock('@/components/organisms/Schedule', () => ({
  FoodSchedule: () => <div data-testid="food-schedule" />,
}));
jest.mock('@/components/molecules/SchedulePicker', () => ({
  SchedulePicker: () => <div data-testid="schedule-picker" />,
}));

describe('SchedulePage', () => {
  it('renders the heading and both sections', () => {
    render(<SchedulePage />);
    expect(screen.getByText(/food schedules/i)).toBeInTheDocument();
    expect(screen.getByTestId('food-schedule')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-picker')).toBeInTheDocument();
  });
});

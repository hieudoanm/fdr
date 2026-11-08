import { render, screen } from '@testing-library/react';
import SchedulePage from '@/app/(app)/schedule/page';

describe('SchedulePage', () => {
  it('renders the heading and a card per schedule', () => {
    render(<SchedulePage />);
    expect(
      screen.getByRole('heading', { name: 'Food Schedules' })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tool-card-schedulescheldon')
    ).toBeInTheDocument();
    expect(screen.getByTestId('tool-card-schedulevietnam')).toBeInTheDocument();
    expect(
      screen.getByTestId('tool-card-scheduleunited-kingdom')
    ).toBeInTheDocument();
  });

  it('links each card to its schedule route', () => {
    render(<SchedulePage />);
    expect(screen.getByTestId('tool-card-schedulevietnam')).toHaveAttribute(
      'href',
      '/schedule/vietnam'
    );
  });

  it('renders a back link', () => {
    render(<SchedulePage />);
    expect(screen.getByTestId('back-home')).toHaveAttribute('href', '/');
  });
});

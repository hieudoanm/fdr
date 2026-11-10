import { render, screen } from '@testing-library/react';
import { scheldon } from '@/data';
import { FoodSchedule } from '../Schedule';

describe('FoodSchedule', () => {
  it('renders one row per weekday', () => {
    render(<FoodSchedule entries={scheldon} today="Monday" />);
    expect(screen.getByTestId('schedule-table')).toBeInTheDocument();
    expect(screen.getAllByTestId('schedule-row')).toHaveLength(scheldon.length);
  });

  it('renders a quote when provided', () => {
    render(
      <FoodSchedule
        entries={scheldon}
        quote="I cannot accept a fluctuating weekly dining schedule."
        today="Monday"
      />
    );
    expect(
      screen.getByText(/fluctuating weekly dining schedule/)
    ).toBeInTheDocument();
  });

  it('omits the quote when not provided', () => {
    render(<FoodSchedule entries={scheldon} today="Monday" />);
    expect(
      screen.queryByText(/fluctuating weekly dining schedule/)
    ).not.toBeInTheDocument();
  });

  it('highlights the active day when it matches today', () => {
    render(<FoodSchedule entries={scheldon} today="Wednesday" />);
    const rows = screen.getAllByTestId('schedule-row');
    expect(rows).toHaveLength(scheldon.length);
    const wednesday = rows.find(
      (row) => row.getAttribute('data-today') !== null
    );
    expect(wednesday).toBeDefined();
    expect(wednesday?.textContent).toContain('Wednesday');
  });

  it('shows a week column when entries span multiple weeks', () => {
    const twoWeek = scheldon.flatMap((entry, index) => [
      { ...entry, week: 'Week 1' },
      { ...entry, week: 'Week 2', meal: `${entry.meal} II` },
    ]);
    render(<FoodSchedule entries={twoWeek} today="Monday" />);
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getAllByText('Week 1')).toHaveLength(scheldon.length);
    expect(screen.getAllByText('Week 2')).toHaveLength(scheldon.length);
    expect(screen.getAllByTestId('schedule-row')).toHaveLength(
      scheldon.length * 2
    );
  });

  it('shows the canonical meal for each day', () => {
    render(<FoodSchedule entries={scheldon} today="Thursday" />);
    expect(screen.getByText(/Pizza/)).toBeInTheDocument();
    expect(screen.getByText(/Thai/)).toBeInTheDocument();
    expect(screen.getByText(/Chinese/)).toBeInTheDocument();
    expect(screen.getByText(/Siam Palace/)).toBeInTheDocument();
  });
});

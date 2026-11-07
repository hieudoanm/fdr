import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FoodRandomizer } from '../Randomizer';
import { FOOD_OPTIONS, foods } from '@/data';

jest.mock('@/lib/progress', () => ({
  getProgress: jest.fn(() =>
    Promise.resolve({ xp: 0, streak: 0, lastActive: '' })
  ),
  awardXp: jest.fn(() =>
    Promise.resolve({ xp: 10, streak: 1, lastActive: '2026-01-01' })
  ),
}));

const advance = async () => {
  await act(async () => {
    jest.advanceTimersByTime(1800);
    await Promise.resolve();
  });
};

describe('FoodRandomizer', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['setImmediate'] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the reel placeholder and spin controls', () => {
    render(<FoodRandomizer />);
    expect(screen.getByTestId('reel-display')).toHaveTextContent('🍽️');
    expect(screen.getByTestId('spin-button')).toBeEnabled();
    expect(screen.getByTestId('stats-line').textContent).toContain(
      `${foods.length} dishes`
    );
    expect(screen.getByTestId('spin-count')).toHaveTextContent('0');
  });

  it('spins, lands on a valid dish and counts the spin', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<FoodRandomizer />);
    await user.click(screen.getByTestId('spin-button'));
    expect(screen.getByTestId('spin-button')).toBeDisabled();
    expect(screen.getAllByText('Rolling…').length).toBeGreaterThan(0);
    await advance();
    expect(FOOD_OPTIONS.all).toContain(
      screen.getByTestId('reel-display').textContent
    );
    expect(screen.getByTestId('spin-button')).toBeEnabled();
    expect(screen.getByTestId('spin-count')).toHaveTextContent('1');
  });

  it('awards XP and shows progress after a landed spin', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<FoodRandomizer />);
    await user.click(screen.getByTestId('spin-button'));
    await advance();
    await act(async () => {});
    expect(screen.getByTestId('progress-line')).toHaveTextContent('XP');
  });

  it('spins with the Space key', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<FoodRandomizer />);
    await user.keyboard(' ');
    expect(screen.getByTestId('spin-button')).toBeDisabled();
    await advance();
    expect(screen.getByTestId('spin-button')).toBeEnabled();
    expect(screen.getByTestId('spin-count')).toHaveTextContent('1');
  });

  it('locks a cuisine through the select and spins within it', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<FoodRandomizer />);
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    await user.click(screen.getByTitle('Japanese'));
    await user.click(screen.getByTestId('spin-button'));
    await advance();
    expect(FOOD_OPTIONS.japanese).toContain(
      screen.getByTestId('reel-display').textContent
    );
  });

  it('pre-selects the cuisine from the initial country', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<FoodRandomizer initialCountry="japanese" />);
    expect(screen.getByTestId('cuisine-select-trigger')).toHaveTextContent(
      'Japanese'
    );
    await user.click(screen.getByTestId('spin-button'));
    await advance();
    expect(FOOD_OPTIONS.japanese).toContain(
      screen.getByTestId('reel-display').textContent
    );
  });

  it('defaults an unknown initial country to All Cuisines', () => {
    render(<FoodRandomizer initialCountry="does-not-exist" />);
    expect(screen.getByTestId('cuisine-select-trigger')).toHaveTextContent(
      'All Cuisines'
    );
  });
});

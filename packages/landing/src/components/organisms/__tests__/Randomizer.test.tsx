import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FoodRandomizer } from '../Randomizer';
import { DRINK_OPTIONS, FOOD_OPTIONS, drinks, foods } from '@/data';

const advance = () => act(() => jest.advanceTimersByTime(1800));

describe('FoodRandomizer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
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
    advance();
    expect(FOOD_OPTIONS.all).toContain(
      screen.getByTestId('reel-display').textContent
    );
    expect(screen.getByTestId('spin-button')).toBeEnabled();
    expect(screen.getByTestId('spin-count')).toHaveTextContent('1');
  });

  it('spins with the Space key', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<FoodRandomizer />);
    await user.keyboard(' ');
    expect(screen.getByTestId('spin-button')).toBeDisabled();
    advance();
    expect(screen.getByTestId('spin-button')).toBeEnabled();
    expect(screen.getByTestId('spin-count')).toHaveTextContent('1');
  });

  it('locks a cuisine through the select and spins within it', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<FoodRandomizer />);
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    await user.click(screen.getByTitle('Japanese'));
    await user.click(screen.getByTestId('spin-button'));
    advance();
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
    advance();
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

  it('renders the drinks variant with its own title and options', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FoodRandomizer
        items={drinks}
        optionsMap={DRINK_OPTIONS}
        title="Drink Randomizer"
        blurb="Can't decide what to drink?"
        unitLabel="drinks"
      />
    );
    expect(screen.getByText('Drink Randomizer')).toBeInTheDocument();
    expect(screen.getByTestId('stats-line').textContent).toContain(
      `${drinks.length} drinks`
    );
    await user.click(screen.getByTestId('spin-button'));
    advance();
    expect(DRINK_OPTIONS.all).toContain(
      screen.getByTestId('reel-display').textContent
    );
  });
});

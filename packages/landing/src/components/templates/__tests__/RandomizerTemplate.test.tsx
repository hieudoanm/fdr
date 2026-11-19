import { render, screen } from '@testing-library/react';
import { foods, FOOD_OPTIONS } from '@/data';
import { RandomizerTemplate } from '@/components/templates/RandomizerTemplate';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn() }),
}));

describe('RandomizerTemplate', () => {
  it('renders the randomizer reel and heading copy', () => {
    render(
      <RandomizerTemplate
        basePath="/foods/randomizer"
        items={foods}
        optionsMap={FOOD_OPTIONS}
        title="Food Randomizer"
        blurb="Spin the reel"
        unitLabel="dishes"
      />
    );
    expect(screen.getByTestId('reel-display')).toBeInTheDocument();
    expect(screen.getByText('Food Randomizer')).toBeInTheDocument();
    expect(screen.getByText('Spin the reel')).toBeInTheDocument();
  });
});

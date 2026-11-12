import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RandomizerTemplate from '@/app/(app)/snacks/randomizer/page';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('country=japanese'),
  useRouter: () => ({ replace }),
}));

describe('SnacksRandomizerPage', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it('renders the snack randomizer reel', () => {
    render(<RandomizerTemplate />);
    expect(screen.getByTestId('reel-display')).toBeInTheDocument();
    expect(screen.getByText('Snack Randomizer')).toBeInTheDocument();
  });

  it('pre-selects the shared country query param', () => {
    render(<RandomizerTemplate />);
    expect(screen.getByTestId('cuisine-select-trigger')).toHaveTextContent(
      'Japanese'
    );
  });

  it('updates the shareable URL when the country changes', async () => {
    const user = userEvent.setup();
    render(<RandomizerTemplate />);
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    await user.click(screen.getByTitle('Italian'));
    expect(replace).toHaveBeenCalledWith('/snacks/randomizer?country=italian');
  });

  it('clears the country param when all is selected', async () => {
    const user = userEvent.setup();
    render(<RandomizerTemplate />);
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    await user.click(screen.getByRole('option', { name: /All Cuisines/ }));
    expect(replace).toHaveBeenCalledWith('/snacks/randomizer');
  });
});

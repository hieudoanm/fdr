import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RandomizerTemplate from '@/app/(app)/foods/randomizer/page';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('country=japanese'),
  useRouter: () => ({ replace }),
}));

describe('RandomizerTemplate', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it('renders the food randomizer reel', () => {
    render(<RandomizerTemplate />);
    expect(screen.getByTestId('reel-display')).toBeInTheDocument();
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
    expect(replace).toHaveBeenCalledWith('/foods/randomizer?country=italian');
  });

  it('clears the country param when all is selected', async () => {
    const user = userEvent.setup();
    render(<RandomizerTemplate />);
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    await user.click(screen.getByRole('option', { name: /All Cuisines/ }));
    expect(replace).toHaveBeenCalledWith('/foods/randomizer');
  });
});

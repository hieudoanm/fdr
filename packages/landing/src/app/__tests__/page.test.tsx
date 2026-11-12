import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

global.fetch = jest.fn() as unknown as typeof global.fetch;

describe('HomePage', () => {
  it('renders the randomizer tool card', () => {
    render(<HomePage />);
    expect(screen.getByTestId('tool-card-foodsrandomizer')).toBeInTheDocument();
  });

  it('links the randomizer card to the randomizer route', () => {
    render(<HomePage />);
    expect(screen.getByTestId('tool-card-foodsrandomizer')).toHaveAttribute(
      'href',
      '/foods/randomizer'
    );
  });
});

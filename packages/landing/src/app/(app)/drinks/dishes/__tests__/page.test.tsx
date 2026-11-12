import { render, screen } from '@testing-library/react';
import DrinksPage from '@/app/(app)/drinks/dishes/page';

describe('DrinksPage', () => {
  it('renders the drink list and heading', () => {
    render(<DrinksPage />);
    expect(screen.getByTestId('cuisine-table')).toBeInTheDocument();
    expect(screen.getByText('Drinks')).toBeInTheDocument();
    expect(screen.getByTestId('cuisine-count')).toHaveTextContent(
      'of 60 drinks'
    );
  });
});

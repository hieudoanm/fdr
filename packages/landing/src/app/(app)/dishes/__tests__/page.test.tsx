import { render, screen } from '@testing-library/react';
import DishesPage from '@/app/(app)/dishes/page';

describe('DishesPage', () => {
  it('renders the cuisine list and heading', () => {
    render(<DishesPage />);
    expect(screen.getByTestId('cuisine-table')).toBeInTheDocument();
    expect(screen.getByText('Dishes')).toBeInTheDocument();
  });
});

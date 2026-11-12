import { render, screen } from '@testing-library/react';
import DishesTemplate from '@/app/(app)/foods/dishes/page';

describe('DishesTemplate', () => {
  it('renders the cuisine list and heading', () => {
    render(<DishesTemplate />);
    expect(screen.getByTestId('cuisine-table')).toBeInTheDocument();
    expect(screen.getByText('Dishes')).toBeInTheDocument();
  });
});

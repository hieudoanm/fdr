import { render, screen } from '@testing-library/react';
import { DishesTemplate } from '@/components/templates/DishesTemplate';

describe('DishesTemplate', () => {
  it('renders the heading, blurb and cuisine list', () => {
    render(
      <DishesTemplate blurb="Browse and search" kind="drinks" title="Drinks" />
    );
    expect(screen.getByText('Drinks')).toBeInTheDocument();
    expect(screen.getByText('Browse and search')).toBeInTheDocument();
    expect(screen.getByTestId('cuisine-table')).toBeInTheDocument();
  });
});

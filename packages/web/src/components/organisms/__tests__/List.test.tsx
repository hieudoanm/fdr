import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CuisineList } from '../List';
import { countries, foods } from '@/data';

describe('CuisineList', () => {
  it('renders every dish and the total count', () => {
    render(<CuisineList />);
    expect(screen.getAllByTestId('cuisine-row')).toHaveLength(foods.length);
    expect(screen.getByTestId('cuisine-count')).toHaveTextContent(
      `${foods.length} of ${foods.length} dishes`
    );
  });

  it('renders the dish, cuisine, category, course, and slug columns', async () => {
    const user = userEvent.setup();
    render(<CuisineList />);
    await user.type(screen.getByTestId('cuisine-search'), 'coffee');
    const [row] = screen.getAllByTestId('cuisine-row');

    ['Dish', 'Cuisine', 'Category', 'Course', 'Slug'].forEach((column) => {
      expect(
        screen.getByRole('columnheader', { name: column })
      ).toBeInTheDocument();
    });
    expect(within(row).getAllByText('drink')).toHaveLength(2);
    expect(within(row).getByText('coffee')).toBeInTheDocument();
  });

  it('searches dishes by name', async () => {
    const user = userEvent.setup();
    render(<CuisineList />);
    await user.type(screen.getByTestId('cuisine-search'), 'sushi');
    const rows = screen.getAllByTestId('cuisine-row');
    expect(rows).toHaveLength(1);
    expect(within(rows[0]).getByText('Sushi')).toBeInTheDocument();
  });

  it('filters by cuisine', async () => {
    const user = userEvent.setup();
    render(<CuisineList />);
    await user.selectOptions(screen.getByTestId('cuisine-filter'), 'japanese');
    const rows = screen.getAllByTestId('cuisine-row');
    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((row) => {
      expect(within(row).getByText(/Japan/)).toBeInTheDocument();
    });
  });

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<CuisineList />);
    await user.type(screen.getByTestId('cuisine-search'), 'zzzzz');
    expect(screen.queryAllByTestId('cuisine-row')).toHaveLength(0);
    expect(screen.getByText('No dishes match your search')).toBeInTheDocument();
    expect(screen.getByTestId('cuisine-count')).toHaveTextContent(
      `0 of ${foods.length} dishes`
    );
  });

  it('lists one option per cuisine in the filter', () => {
    render(<CuisineList />);
    countries.forEach((cuisine) => {
      expect(
        screen.getByRole('option', {
          name: `${cuisine.emoji} ${cuisine.label}`,
        })
      ).toBeInTheDocument();
    });
  });
});

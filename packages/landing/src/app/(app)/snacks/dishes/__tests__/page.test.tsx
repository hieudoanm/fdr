import { render, screen } from '@testing-library/react';
import SnacksPage from '@/app/(app)/snacks/dishes/page';

describe('SnacksPage', () => {
  it('renders the snack list and heading', () => {
    render(<SnacksPage />);
    expect(screen.getByTestId('cuisine-table')).toBeInTheDocument();
    expect(screen.getByText('Snacks')).toBeInTheDocument();
    expect(screen.getByTestId('cuisine-count')).toHaveTextContent(
      'of 60 snacks'
    );
  });
});

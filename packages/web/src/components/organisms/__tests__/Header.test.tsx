import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders brand linking home', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Food & Drink' })).toHaveAttribute(
      'href',
      '/'
    );
  });
});

import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders brand linking home', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'FDR' })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('renders the theme toggle', () => {
    render(<Header />);
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('renders the mobile menu button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });
});

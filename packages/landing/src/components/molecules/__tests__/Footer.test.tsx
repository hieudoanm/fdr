import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the copyright, tagline and footer links', () => {
    render(<Footer />);
    expect(
      screen.getByText(`© ${new Date().getFullYear()} fdr`)
    ).toBeInTheDocument();
    expect(screen.getByText(/Food & Drink/)).toBeInTheDocument();

    const github = screen.getByRole('link', { name: /GitHub/ });
    expect(github).toHaveAttribute('href', 'https://github.com/hieudoanm/fdr');
    expect(github).toHaveAttribute('target', '_blank');

    const readme = screen.getByRole('link', { name: 'README' });
    expect(readme).toHaveAttribute(
      'href',
      'https://github.com/hieudoanm/fdr#readme'
    );
  });
});

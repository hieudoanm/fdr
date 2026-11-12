import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renders the brand and GitHub link', () => {
    render(<Navbar />);
    expect(screen.getByText('FDR')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/hieudoanm/fdr'
    );
  });

  it('links every app route through the dropdowns', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.click(screen.getByRole('button', { name: 'Foods' }));
    expect(screen.getByRole('link', { name: 'Randomizer' })).toHaveAttribute(
      'href',
      '/foods/randomizer'
    );
    await user.click(screen.getByRole('button', { name: 'Schedules' }));
    expect(screen.getByRole('link', { name: 'Vietnam' })).toHaveAttribute(
      'href',
      '/schedule/vietnam'
    );
  });
});

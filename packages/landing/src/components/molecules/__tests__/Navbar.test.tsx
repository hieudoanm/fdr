import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';

const PROPS = {
  name: 'FDR',
  logoSrc: '/icons/icon.svg',
  links: [],
  groups: [
    {
      label: 'Foods',
      items: [
        { href: '/foods/wheel/', label: 'Wheel' },
        { href: '/foods/randomizer', label: 'Randomizer' },
      ],
    },
    {
      label: 'Schedules',
      items: [{ href: '/schedule/vietnam', label: 'Vietnam' }],
    },
  ],
  githubUrl: 'https://github.com/hieudoanm/fdr',
};

describe('Navbar', () => {
  it('renders the brand and GitHub link', () => {
    render(<Navbar {...PROPS} />);
    expect(screen.getByText('FDR')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/hieudoanm/fdr'
    );
  });

  it('renders flat links', () => {
    render(
      <Navbar
        {...PROPS}
        groups={[]}
        links={[{ label: 'Docs', href: '/docs' }]}
      />
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      '/docs'
    );
  });

  it('opens a dropdown and links its items', async () => {
    const user = userEvent.setup();
    render(<Navbar {...PROPS} />);
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

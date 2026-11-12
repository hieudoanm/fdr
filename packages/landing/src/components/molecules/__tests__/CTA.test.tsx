import { render, screen } from '@testing-library/react';
import CTA from '../CTA';

const PROPS = {
  title: 'Still can’t decide?',
  description: 'Let fate pick tonight’s meal.',
  primary: { label: 'Spin the wheel', href: '/foods/wheel/' },
  secondary: {
    label: 'Star on GitHub',
    href: 'https://github.com/hieudoanm/fdr',
    external: true,
  },
};

describe('CTA', () => {
  it('renders the heading, description and both actions', () => {
    render(<CTA {...PROPS} />);
    expect(
      screen.getByRole('heading', { name: 'Still can’t decide?' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Let fate pick tonight’s meal.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Spin the wheel' })
    ).toHaveAttribute('href', '/foods/wheel');
    expect(
      screen.getByRole('link', { name: 'Star on GitHub' })
    ).toHaveAttribute('href', 'https://github.com/hieudoanm/fdr');
  });
});

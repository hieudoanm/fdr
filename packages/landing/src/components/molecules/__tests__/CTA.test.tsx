import { render, screen } from '@testing-library/react';
import CTA from '../CTA';

describe('CTA', () => {
  it('renders the closing call to action', () => {
    render(<CTA />);
    expect(
      screen.getByRole('heading', { name: /Still can't decide/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Spin the wheel' })
    ).toHaveAttribute('href', '/foods/wheel');
  });
});

import { render, screen } from '@testing-library/react';
import { BackLink } from '../BackLink';

describe('BackLink', () => {
  it('links back to the home page', () => {
    render(<BackLink />);
    expect(screen.getByTestId('back-home')).toHaveAttribute('href', '/');
  });
});

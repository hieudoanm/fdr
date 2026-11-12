import { render, screen } from '@testing-library/react';
import Features from '../Features';

describe('Features', () => {
  it('renders the section heading and feature cards', () => {
    render(<Features />);
    expect(
      screen.getByRole('heading', { name: 'Features' })
    ).toBeInTheDocument();
    expect(screen.getByText('Dish index')).toBeInTheDocument();
    expect(screen.getByText('Weekly schedules')).toBeInTheDocument();
    expect(screen.getByText('Works offline')).toBeInTheDocument();
  });
});

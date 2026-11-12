import { render, screen } from '@testing-library/react';
import { PiListDashes } from 'react-icons/pi';
import Features from '../Features';

const FEATURES = [
  { title: 'Dish index', body: 'Search dishes', icon: PiListDashes },
];

describe('Features', () => {
  it('renders the section heading and feature cards', () => {
    render(
      <Features
        title="Everything you need."
        description="Fast and free."
        features={FEATURES}
      />
    );
    expect(
      screen.getByRole('heading', { name: 'Everything you need.' })
    ).toBeInTheDocument();
    expect(screen.getByText('Dish index')).toBeInTheDocument();
    expect(screen.getByText('Search dishes')).toBeInTheDocument();
  });
});

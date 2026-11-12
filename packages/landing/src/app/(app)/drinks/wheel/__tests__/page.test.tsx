import { render, screen } from '@testing-library/react';
import WheelTemplate from '@/app/(app)/drinks/wheel/page';

describe('DrinksWheelPage', () => {
  it('renders the cuisine wheel and heading', () => {
    render(<WheelTemplate />);
    expect(screen.getByTestId('cuisine-wheel-wrap')).toBeInTheDocument();
    expect(screen.getByText('Wheel of Cuisine')).toBeInTheDocument();
  });
});

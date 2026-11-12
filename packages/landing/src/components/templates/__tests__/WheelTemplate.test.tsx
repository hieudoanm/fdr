import { render, screen } from '@testing-library/react';
import { WheelTemplate } from '@/components/templates/WheelTemplate';

describe('WheelTemplate', () => {
  it('renders the heading, blurb and cuisine wheel', () => {
    render(<WheelTemplate blurb="Spin to pick" title="Wheel of Cuisine" />);
    expect(screen.getByText('Wheel of Cuisine')).toBeInTheDocument();
    expect(screen.getByText('Spin to pick')).toBeInTheDocument();
    expect(screen.getByTestId('cuisine-wheel-wrap')).toBeInTheDocument();
  });
});

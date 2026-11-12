import { render, screen } from '@testing-library/react';
import SectionHead from '../SectionHead';

describe('SectionHead', () => {
  it('renders the title and description', () => {
    render(<SectionHead title="Apps" description="Every tool in one place" />);
    expect(screen.getByRole('heading', { name: 'Apps' })).toBeInTheDocument();
    expect(screen.getByText('Every tool in one place')).toBeInTheDocument();
  });
});

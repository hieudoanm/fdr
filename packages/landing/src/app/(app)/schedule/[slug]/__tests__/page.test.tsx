import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import ScheduleSlugPage from '@/app/(app)/schedule/[slug]/page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@/components/organisms/Schedule', () => ({
  FoodSchedule: () => <div data-testid="food-schedule" />,
}));
vi.mock('@/components/molecules/SchedulePicker', () => ({
  SchedulePicker: () => <div data-testid="schedule-picker" />,
}));

const mockNotFound = vi.mocked(notFound);

const Page = ScheduleSlugPage as unknown as ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => Promise<React.ReactElement>;

const renderForSlug = async (slug: string) => {
  const element = await Page({ params: Promise.resolve({ slug }) });
  render(element);
};

describe('ScheduleSlugPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the schedule for a known slug', async () => {
    await renderForSlug('scheldon');
    expect(screen.getByText(/Sheldon's Schedule/i)).toBeInTheDocument();
    expect(screen.getByTestId('food-schedule')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-picker')).toBeInTheDocument();
    expect(mockNotFound).not.toHaveBeenCalled();
  });

  it('renders the Vietnam schedule', async () => {
    await renderForSlug('vietnam');
    expect(screen.getByText('Vietnam')).toBeInTheDocument();
  });

  it('renders the United Kingdom schedule', async () => {
    await renderForSlug('united-kingdom');
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('calls notFound for an unknown slug', async () => {
    mockNotFound.mockImplementation(() => {
      throw new Error('not_found');
    });
    await expect(renderForSlug('nope')).rejects.toThrow('not_found');
    expect(mockNotFound).toHaveBeenCalled();
  });
});

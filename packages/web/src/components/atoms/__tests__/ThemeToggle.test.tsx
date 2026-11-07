import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle, THEME_STORAGE_KEY } from '../ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders a toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('switches to dark theme and persists the choice', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByTestId('theme-toggle'));
    expect(document.documentElement).toHaveAttribute('data-theme', 'fdr-dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('fdr-dark');
  });

  it('restores the stored theme on mount', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'fdr-dark');
    render(<ThemeToggle />);
    await act(async () => {});
    expect(document.documentElement).toHaveAttribute('data-theme', 'fdr-dark');
    expect(screen.getByTestId('theme-toggle')).toHaveAttribute(
      'aria-label',
      'Switch to light'
    );
  });

  it('toggles back to the light theme', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(THEME_STORAGE_KEY, 'fdr-dark');
    render(<ThemeToggle />);
    await act(async () => {});
    await user.click(screen.getByTestId('theme-toggle'));
    expect(document.documentElement).toHaveAttribute('data-theme', 'fdr');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('fdr');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ThemeToggle, {
  DARK_THEME,
  LIGHT_THEME,
  THEME_STORAGE_KEY,
} from '../ThemeToggle';

describe('ThemeToggle', () => {
  it('switches to dark mode and persists the choice', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', LIGHT_THEME);
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Toggle dark mode' }));

    expect(document.documentElement).toHaveAttribute('data-theme', DARK_THEME);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(DARK_THEME);
  });

  it('switches back to light mode', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', DARK_THEME);
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Toggle dark mode' }));

    expect(document.documentElement).toHaveAttribute('data-theme', LIGHT_THEME);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(LIGHT_THEME);
  });
});

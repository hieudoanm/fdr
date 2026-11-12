import { test, expect } from '@playwright/test';

test('drinks dishes page lists and filters drinks', async ({ page }) => {
  await page.goto('/drinks/dishes/');

  await expect(page.getByRole('heading', { name: 'Drinks' })).toBeVisible();
  await expect(page.getByTestId('cuisine-table')).toBeVisible();

  await page.getByTestId('cuisine-search').fill('coffee');
  await expect(page.getByTestId('cuisine-count')).toContainText('of 60 drinks');
  await expect(page.getByTestId('cuisine-row').first()).toContainText(
    /coffee/i
  );
});

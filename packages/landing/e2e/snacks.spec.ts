import { test, expect } from '@playwright/test';

test('snacks dishes page lists and filters snacks', async ({ page }) => {
  await page.goto('/snacks/dishes/');

  await expect(page.getByRole('heading', { name: 'Snacks' })).toBeVisible();
  await expect(page.getByTestId('cuisine-table')).toBeVisible();

  await page.getByTestId('cuisine-search').fill('apple pie');
  await expect(page.getByTestId('cuisine-count')).toContainText('of 60 snacks');
  await expect(page.getByTestId('cuisine-row').first()).toContainText(
    /apple pie/i
  );
});

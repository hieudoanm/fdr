import { test, expect } from '@playwright/test';

test('dishes page lists and filters dishes', async ({ page }) => {
  await page.goto('/dishes/');

  await expect(page.getByRole('heading', { name: 'Dishes' })).toBeVisible();
  await expect(page.getByTestId('cuisine-table')).toBeVisible();

  await page.getByTestId('cuisine-search').fill('ramen');
  await expect(page.getByTestId('cuisine-count')).toContainText(
    'of 200 dishes'
  );
  await expect(page.getByTestId('cuisine-row').first()).toContainText(/ramen/i);
});

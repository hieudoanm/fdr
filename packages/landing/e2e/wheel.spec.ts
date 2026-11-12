import { test, expect } from '@playwright/test';

test('wheel page spins and reveals a cuisine', async ({ page }) => {
  await page.goto('/foods/wheel/');

  await expect(
    page.getByRole('heading', { name: 'Wheel of Cuisine' })
  ).toBeVisible();
  await page.getByTestId('wheel-spin').click();
  await expect(page.getByTestId('wheel-result')).not.toHaveText(
    'Press spin to pick a cuisine',
    { timeout: 10000 }
  );
  await expect(page.getByTestId('wheel-result-link')).toBeVisible();
});

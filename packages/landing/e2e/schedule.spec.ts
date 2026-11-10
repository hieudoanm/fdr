import { test, expect } from '@playwright/test';

test('schedule page lists schedules and opens one', async ({ page }) => {
  await page.goto('/schedule/');

  await expect(
    page.getByRole('heading', { name: 'Food Schedules' })
  ).toBeVisible();
  await expect(page.getByTestId('tool-card-schedulevietnam')).toBeVisible();

  await page.getByTestId('tool-card-schedulevietnam').click();
  await expect(page).toHaveURL(/\/schedule\/vietnam\//);
  await expect(page.getByRole('heading', { name: 'Vietnam' })).toBeVisible();
  await expect(page.getByTestId('schedule-table')).toBeVisible();
});

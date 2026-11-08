import { test, expect } from '@playwright/test';
import path from 'path';

test('page has correct title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('FDR');
});

test('home lists the app tools', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Food & Drink' })
  ).toBeVisible();
  await expect(page.getByTestId('tool-card-wheel')).toBeVisible();
  await expect(page.getByTestId('tool-card-randomizer')).toBeVisible();
  await expect(page.getByTestId('tool-card-dishes')).toBeVisible();
  await expect(page.getByTestId('tool-card-schedulevietnam')).toBeVisible();
});

test('navigating to food randomizer works', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('tool-card-randomizer').click();
  await expect(
    page.getByRole('heading', { name: 'Food Randomizer' })
  ).toBeVisible();
});

test('404 page for unknown routes', async ({ page }) => {
  await page.goto('/nonexistent');

  await expect(page.getByText('404')).toBeVisible();
});

test('captures marketing screenshot (1280x720)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  await page.screenshot({
    path: path.join(__dirname, 'screenshots', 'home.png'),
  });
});

import { test, expect } from '@playwright/test';
import path from 'path';

test('page has correct title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('FDR');
});

test('home lists the app tools', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: "Can't decide what to eat?" })
  ).toBeVisible();
  await expect(page.getByTestId('tool-card-foodswheel')).toBeVisible();
  await expect(page.getByTestId('tool-card-foodsrandomizer')).toBeVisible();
  await expect(page.getByTestId('tool-card-foodsdishes')).toBeVisible();
  await expect(page.getByTestId('tool-card-drinkswheel')).toBeVisible();
  await expect(page.getByTestId('tool-card-drinksrandomizer')).toBeVisible();
  await expect(page.getByTestId('tool-card-drinksdishes')).toBeVisible();
  await expect(page.getByTestId('tool-card-snackswheel')).toBeVisible();
  await expect(page.getByTestId('tool-card-snacksrandomizer')).toBeVisible();
  await expect(page.getByTestId('tool-card-snacksdishes')).toBeVisible();
  await expect(page.getByTestId('tool-card-schedulevietnam')).toBeVisible();
});

test('navigating to food randomizer works', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('tool-card-foodsrandomizer').click();
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

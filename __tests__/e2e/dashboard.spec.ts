import { test, expect } from '@playwright/test';

test.describe('CARBONMIND AI - Landing & Auth Flows', () => {
  test('should load the main landing page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CARBONMIND AI/i);
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should display the login form elements', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should load registration screen', async ({ page }) => {
    await page.goto('/register');
    const nameInput = page.locator('input[type="text"]');
    await expect(nameInput).toBeVisible();
  });
});

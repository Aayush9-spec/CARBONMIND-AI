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

  test('should redirect protected dashboard requests to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fdashboard/);
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('should expose basic password guidance on the registration form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText(/at least 8 characters with uppercase, lowercase, and a number/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('should preserve keyboard-friendly access to auth actions', async ({ page }) => {
    await page.goto('/login');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.locator('#login-email')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#login-password')).toBeFocused();
  });
});

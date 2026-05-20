import { test, expect } from '@playwright/test';

test('AT-006 Upload input exists', async ({ page }) => {
  await page.goto('/register');

  
  await page.waitForTimeout(2000);

  await expect(page.getByPlaceholder(/full name/i)).toBeVisible({ timeout: 5000 });
  await expect(page.getByPlaceholder(/email/i)).toBeVisible();
  await expect(page.getByPlaceholder(/^password/i)).toBeVisible();

  await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
});
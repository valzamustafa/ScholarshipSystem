import { test, expect } from '@playwright/test';

test('AT-002 Login fail', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('Email...').fill('wrong@gmail.com');
  await page.getByPlaceholder('Password...').fill('wrongpass');
  await page.getByRole('button', { name: 'Login as Student' }).click();

  await page.waitForTimeout(4000);

  const errorDiv = page.locator('.alert.alert-danger');
  await expect(errorDiv).toBeVisible({ timeout: 8000 });
});

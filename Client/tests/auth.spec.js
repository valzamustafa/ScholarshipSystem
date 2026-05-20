import { test, expect } from '@playwright/test';

test('Login success', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('Email...').fill('test@gmail.com');
  await page.getByPlaceholder('Password...').fill('Pass123!');
  await page.getByRole('button', { name: 'Login as Student' }).click();

 
  await page.waitForTimeout(3000);
  await expect(page).not.toHaveURL(/login/, { timeout: 10000 });
});

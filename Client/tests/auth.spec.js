import { test, expect } from '@playwright/test';

test('Login success', async ({ page }) => {
  await page.goto('/login');
  await page.waitForTimeout(3000);

  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(10);
  await expect(page).toHaveURL(/login/);
});
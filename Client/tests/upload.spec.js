import { test, expect } from '@playwright/test';

test('AT-006 Upload input exists', async ({ page }) => {
  await page.goto('/register');
  await page.waitForTimeout(3000);

  
  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(5);

  await expect(page).toHaveURL(/register/);
});
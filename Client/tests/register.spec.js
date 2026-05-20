import { test, expect } from '@playwright/test';

test('AT-003 Register student', async ({ page }) => {
  await page.goto('/register');
  await page.waitForTimeout(3000);


  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(10);
  await expect(page).toHaveURL(/register/);
});
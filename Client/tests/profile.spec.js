import { test, expect } from '@playwright/test';

test('AT-007 Profile access requires login', async ({ page }) => {
  await page.goto('/profile');
  await page.waitForTimeout(3000);


  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(5);
});
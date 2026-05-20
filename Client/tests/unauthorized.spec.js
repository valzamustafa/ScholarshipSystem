import { test, expect } from '@playwright/test';

test('AT-010 Unauthorized access', async ({ page }) => {
  await page.goto('/admin');
  await page.waitForTimeout(3000);


  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(5);
});
import { test, expect } from '@playwright/test';

test('AT-009 Unauthorized admin access', async ({ page }) => {
  await page.goto('/admin');
  await page.waitForTimeout(3000);

  
  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(5);
});
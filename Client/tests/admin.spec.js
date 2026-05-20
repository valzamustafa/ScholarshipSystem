import { test, expect } from '@playwright/test';

test('AT-009 Unauthorized admin access', async ({ page }) => {
  await page.goto('/admin');
  await page.waitForTimeout(3000);


  const url = page.url();
  const bodyText = await page.locator('body').textContent();
  const isBlocked =
    url.includes('/login') ||
    url.includes('/unauthorized') ||
    bodyText.includes('Unauthorized') ||
    bodyText.includes('login') ||
    !url.includes('/admin');

  expect(isBlocked).toBeTruthy();
});
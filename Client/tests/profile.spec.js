import { test, expect } from '@playwright/test';

test('AT-007 Profile access requires login', async ({ page }) => {
  await page.goto('/profile');
  await page.waitForTimeout(3000);


  const url = page.url();
  const bodyText = await page.locator('body').textContent();

  const isBlocked =
    url.includes('/login') ||
    url.includes('/unauthorized') ||
    bodyText.includes('login') ||
    bodyText.includes('Unauthorized') ||
    !url.includes('/profile');

  expect(isBlocked).toBeTruthy();
});
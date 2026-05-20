import { test, expect } from '@playwright/test';

test('AT-010 Unauthorized access', async ({ page }) => {
  await page.goto('/admin');

  await page.waitForTimeout(2000);

  const url = page.url();
  const redirected = !url.endsWith('/admin') || url.includes('/login') || url.includes('/unauthorized');
  expect(redirected).toBeTruthy();
});

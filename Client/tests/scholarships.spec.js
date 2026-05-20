import { test, expect } from '@playwright/test';

test('AT-004 View scholarships', async ({ page }) => {
  await page.goto('/scholarships');

  await page.waitForTimeout(3000);

  await expect(page.locator('body')).not.toContainText('Internal Server Error');

  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(100);
});

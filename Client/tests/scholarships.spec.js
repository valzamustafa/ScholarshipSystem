import { test, expect } from '@playwright/test';

test('AT-004 View scholarships', async ({ page }) => {
  await page.goto('/scholarships');
  await page.waitForTimeout(3000);

  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(5);

 
  await expect(page).toHaveURL(/scholarships/);
});
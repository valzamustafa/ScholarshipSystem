import { test, expect } from '@playwright/test';

test('AT-008 Login page visible', async ({ page }) => {
  await page.goto('/login');
  await page.waitForTimeout(3000);


  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(10);

  // Verifiko se URL është /login
  await expect(page).toHaveURL(/login/);
});
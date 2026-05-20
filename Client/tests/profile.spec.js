import { test, expect } from '@playwright/test';

test('AT-007 Profile access requires login', async ({ page }) => {

  await page.goto('/profile');

  await expect(page).toHaveURL(/login/);

});
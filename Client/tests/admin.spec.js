import { test, expect } from '@playwright/test';

test('AT-009 Unauthorized admin access', async ({ page }) => {

  await page.goto('/admin');

  await expect(page).toHaveURL(/login/);

});
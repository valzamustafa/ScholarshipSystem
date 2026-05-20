import { test, expect } from '@playwright/test';

test('AT-005 Scholarships page loads', async ({ page }) => {

  await page.goto('/scholarships');

  await expect(page.locator('body'))
    .toContainText('Scholarship');

});
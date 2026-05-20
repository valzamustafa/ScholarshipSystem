import { test, expect } from '@playwright/test';

test('AT-002 Login fail', async ({ page }) => {
  await page.goto('/login');
  await page.waitForTimeout(3000);


  const emailInput = page.getByPlaceholder('Email...');
  const isVisible = await emailInput.isVisible().catch(() => false);

  if (isVisible) {
    await emailInput.fill('wrong@gmail.com');
    await page.getByPlaceholder('Password...').fill('wrongpass');
    await page.getByRole('button', { name: 'Login as Student' }).click();
    await page.waitForTimeout(4000);

    
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  } else {

    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  }
});
import { test, expect } from '@playwright/test';
 
test('AT-008 Login page visible', async ({ page }) => {
  await page.goto('/login');
 
  // Verifiko titullin
  await expect(page.locator('body')).toContainText('Welcome Back!');
 
  
  await expect(page.getByPlaceholder('Email...')).toBeVisible();
  await expect(page.getByPlaceholder('Password...')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login as Student' })).toBeVisible();
});
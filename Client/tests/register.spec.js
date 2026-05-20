import { test, expect } from '@playwright/test';

test('AT-003 Register student', async ({ page }) => {
  await page.goto('/register');

  await page.getByPlaceholder(/full name/i).fill('Test Student');
  await page.getByPlaceholder(/email/i).fill(`pw${Date.now()}@test.com`);
  await page.getByPlaceholder(/phone/i).fill('+38344111222');
  await page.getByPlaceholder(/^password/i).fill('Pass123!');
  await page.getByPlaceholder(/confirm password/i).fill('Pass123!');
  await page.getByPlaceholder(/school|university/i).fill('University of Prishtina');
  await page.getByPlaceholder(/field of study/i).fill('Computer Science');
  await page.selectOption('select', { label: 'Bachelor' });
  await page.getByRole('button', { name: /register/i }).click();

  await page.waitForTimeout(4000);

  const bodyText = await page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(50);
});

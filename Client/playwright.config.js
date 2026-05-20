import { defineConfig } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  use: {
    baseURL: 'https://localhost:3000',
    headless: true,
    ignoreHTTPSErrors: true
  },

  reporter: [['html', { outputFolder: 'playwright-report' }]]

});
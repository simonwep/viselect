import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  define: {
    VERSION: JSON.stringify(process.env.npm_package_version)
  },

  test: {
    include: ['tests/**/*.spec.ts'],
    retry: process.env.CI ? 2 : 0,
    browser: {
      enabled: true,
      headless: true,
      screenshotFailures: false,
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    }
  }
});

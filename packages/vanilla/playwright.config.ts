import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  projects: [
    {
      name: 'chromium',
      use: {
        baseURL: 'http://127.0.0.1:3005',
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        baseURL: 'http://127.0.0.1:3005',
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit',
      use: {
        baseURL: 'http://127.0.0.1:3005',
        ...devices['Desktop Safari']
      }
    }
  ],
  webServer: {
    command: 'pnpm vite --mode test --host 127.0.0.1',
    url: 'http://127.0.0.1:3005/tests/utils/setup.html'
  }
});

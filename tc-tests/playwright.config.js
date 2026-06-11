import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
SETUP INSTRUCTIONS FOR CI:
1) run `npm install @testchimp/playwright` in your repo.
2) Ensure TESTCHIMP_API_KEY is set in CI (from Project Settings → Key management). TESTCHIMP_PROJECT_ID is optional.
3) Sync this 'tests' folder to a folder in your repo (Click "Sync with GitHub" - in SmartTests page in TestChimp).
4) Setup your git workflow to run tests using standard playwright runner. Sample workflow file: https://github.com/testchimphq/CafeTime/blob/main/.github/workflows/playwright-tests.yml

Note: the runner should be run from the tests folder to ensure proper path resolution (refer sample workflow file).
Full Documentation: https://docs.testchimp.io/smart-tests/run-in-ci-playwright

Keep @playwright/test and playwright on the SAME version in package.json (e.g. both 1.59.x). Mismatched versions cause
"Playwright Test did not expect test() to be called here". Verify with: npm ls @playwright/test playwright
If a dependency nests another playwright, use package.json "overrides" to force a single version.

Global setup: project "setup" runs first (tests/setup/global.setup.spec.js), then "chromium" discovers *.spec.{js,ts} anywhere under tests/ except setup/. (TestChimp SmartTests use *.spec.* only — not *.test.*.) See https://playwright.dev/docs/test-global-setup-teardown#option-1-project-dependencies
**/

dotenv.config({
  path: `.env-${process.env.TESTCHIMP_ENV || 'QA'}`,
});

/**
 * See https://playwright.dev/docs/test-configuration.
 * Config file lives in tests/; testDir values are relative to this file.
 */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['@testchimp/playwright/reporter', { verbose: false }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    actionTimeout: 15 * 1000,
    trace: 'retain-on-failure',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'setup',
      testDir: 'setup',
      testMatch: /global\.setup\.spec\.(js|ts)$/,
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      testDir: '.',
      testIgnore: ['**/setup/**', '**/scripts/**'],
      testMatch: '**/*.spec.{js,ts}',
      use: { ...devices['Desktop Chrome'], actionTimeout: 15 * 1000 },
    },
  ],
});

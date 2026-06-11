import { test } from '@playwright/test';

/**
 * Global setup (runs before test projects via project dependencies in playwright.config.js).
 *
 * Use this file to:
 * - Seed test data in your database or APIs
 * - Prepare shared authentication (e.g. save storageState for reuse)
 * - Any one-time harness work needed by your e2e tests
 */
test('global setup', async () => {
  // Extend when seed/teardown endpoints are added during /testchimp test.
});

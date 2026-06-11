import { test, expect } from '../fixtures/index.js';
import { emitJourneyEvent } from '../shared/rum-bridge.js';

test('locked-out user sees login error', async ({ page, markScreenState }) => {
  // @Scenario: #TS-101 Locked-out user sees login error
  await page.goto('/');
  await markScreenState('Login', 'default');

  await page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/\//);
  await expect(page.locator('[data-test="error"]')).toContainText(/locked out/i);
  await emitJourneyEvent(page, 'login-failed', { 'error.kind': 'locked_out' });
  await markScreenState('Login', 'error');
});

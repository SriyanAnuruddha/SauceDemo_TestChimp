import { test, expect } from '../fixtures/index.js';
import { emitJourneyEvent } from '../shared/rum-bridge.js';

test('standard user can log in and reach inventory', async ({ page, markScreenState }) => {
  await page.goto('/');
  await markScreenState('Login', 'default');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await emitJourneyEvent(page, 'login-success', { 'user.persona': 'standard' });
  await markScreenState('Inventory', 'default');
  await expect(page.locator('.inventory_list')).toBeVisible();
});

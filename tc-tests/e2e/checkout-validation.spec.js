import { test, expect } from '../fixtures/index.js';
import { emitJourneyEvent } from '../shared/rum-bridge.js';

test('checkout step-one shows validation errors for empty fields', async ({ page, markScreenState }) => {
  // @Scenario: #TS-103 Checkout step-one shows errors for empty required fields
  await page.goto('/');
  await markScreenState('Login', 'default');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory\.html/);
  await markScreenState('Inventory', 'default');

  await page.locator('.inventory_item').first().locator('button').click();
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);
  await markScreenState('Cart', 'default');

  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one/);
  await markScreenState('Checkout', 'step-one');

  await page.locator('[data-test="continue"]').click();

  await expect(page).toHaveURL(/checkout-step-one/);
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText(/required/i);
  await emitJourneyEvent(page, 'checkout-validation-error', { 'error.kind': 'missing_customer_info' });
  await markScreenState('Checkout', 'validation-error');
});

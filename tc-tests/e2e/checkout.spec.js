import { test, expect } from '../fixtures/index.js';
import { emitJourneyEvent } from '../shared/rum-bridge.js';

test('standard user completes purchase funnel', async ({ page, markScreenState }) => {
  // @Scenario: #TS-102 Standard user completes checkout end-to-end
  await page.goto('/');
  await markScreenState('Login', 'default');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory\.html/);
  await emitJourneyEvent(page, 'login-success', { 'user.persona': 'standard' });
  await markScreenState('Inventory', 'default');

  const productName = await page.locator('.inventory_item').first().locator('.inventory_item_name').textContent();
  await page.locator('.inventory_item').first().locator('button').click();
  await emitJourneyEvent(page, 'add-to-cart', {
    'product.slug': (productName ?? 'unknown').trim().toLowerCase().replace(/\s+/g, '-'),
    'cart.item_count_bucket': '1',
  });

  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);
  await emitJourneyEvent(page, 'cart-view', { 'cart.item_count_bucket': '1', 'cart.is_empty': false });
  await markScreenState('Cart', 'default');

  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one/);
  await emitJourneyEvent(page, 'checkout-started', { 'cart.item_count_bucket': '1' });
  await markScreenState('Checkout', 'step-one');

  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('Chimp');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  await expect(page).toHaveURL(/checkout-step-two/);
  await emitJourneyEvent(page, 'checkout-info-submitted', { 'order.subtotal_bucket': 'under_50' });
  await markScreenState('Checkout', 'overview');

  await page.locator('[data-test="finish"]').click();
  await expect(page).toHaveURL(/checkout-complete/);
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  await emitJourneyEvent(page, 'checkout-completed', { 'order.subtotal_bucket': 'under_50' });
  await markScreenState('Checkout', 'complete');
});

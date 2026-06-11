/**
 * One-off journey exploration for TrueCoverage event planning.
 * Run: npx playwright test scripts/explore-journeys.spec.js --project chromium
 */
import { test } from '@playwright/test';

const USER = 'standard_user';
const PASS = 'secret_sauce';

test('map Swag Labs journeys', async ({ page }) => {
  const journeys = [];

  const record = (step, url, extra = {}) => {
    journeys.push({ step, url: page.url(), pathname: new URL(page.url()).pathname, ...extra });
  };

  await page.goto('/');
  record('landing', page.url(), { title: await page.title() });

  await page.locator('[data-test="username"]').fill(USER);
  await page.locator('[data-test="password"]').fill(PASS);
  await page.locator('[data-test="login-button"]').click();
  await page.waitForURL(/inventory/);
  record('login-success', page.url(), { itemCount: await page.locator('.inventory_item').count() });

  const firstItem = page.locator('.inventory_item').first();
  const itemName = await firstItem.locator('.inventory_item_name').textContent();
  await firstItem.locator('button').click();
  record('add-to-cart', page.url(), { product: itemName?.trim() });

  await page.locator('.shopping_cart_link').click();
  await page.waitForURL(/cart/);
  record('cart-view', page.url(), { cartItems: await page.locator('.cart_item').count() });

  await page.locator('[data-test="checkout"]').click();
  await page.waitForURL(/checkout-step-one/);
  record('checkout-started', page.url());

  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('Chimp');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  await page.waitForURL(/checkout-step-two/);
  record('checkout-info-submitted', page.url(), {
    summary: await page.locator('.summary_subtotal_label').textContent(),
  });

  await page.locator('[data-test="finish"]').click();
  await page.waitForURL(/checkout-complete/);
  record('checkout-completed', page.url(), {
    completeHeader: await page.locator('.complete-header').textContent(),
  });

  await page.locator('[data-test="back-to-products"]').click();
  await page.waitForURL(/inventory/);
  record('return-to-inventory', page.url());

  await page.locator('#react-burger-menu-btn').click();
  await page.locator('#logout_sidebar_link').click();
  await page.waitForURL(/\//);
  record('logout', page.url());

  // eslint-disable-next-line no-console
  console.log('\n--- JOURNEY MAP ---\n' + JSON.stringify(journeys, null, 2));
});

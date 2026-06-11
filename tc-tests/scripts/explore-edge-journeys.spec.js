import { test } from '@playwright/test';

test('map login failure and checkout validation', async ({ page }) => {
  const edges = [];

  await page.goto('/');
  await page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  edges.push({
    step: 'login-failed',
    error: await page.locator('[data-test="error"]').textContent(),
    url: page.url(),
  });

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="login-button"]').click();
  await page.waitForURL(/inventory/);

  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="continue"]').click();
  edges.push({
    step: 'checkout-validation-error',
    errors: await page.locator('[data-test="error"]').allTextContents(),
    url: page.url(),
  });

  const firstName = page.locator('.inventory_item').first().locator('.inventory_item_name');
  await firstName.click();
  await page.waitForURL(/inventory-item/);
  edges.push({
    step: 'product-detail-view',
    product: await page.locator('.inventory_details_name').textContent(),
    url: page.url(),
  });

  // eslint-disable-next-line no-console
  console.log('\n--- EDGE JOURNEYS ---\n' + JSON.stringify(edges, null, 2));
});

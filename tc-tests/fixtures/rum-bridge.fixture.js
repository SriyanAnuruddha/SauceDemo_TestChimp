import { test as base } from '@playwright/test';
import { ensureRumInitialized } from '../shared/rum-bridge.js';

export const test = base.extend({
  page: async ({ page }, use) => {
    const originalGoto = page.goto.bind(page);
    page.goto = async (...args) => {
      const response = await originalGoto(...args);
      await ensureRumInitialized(page);
      return response;
    };
    await use(page);
  },
});

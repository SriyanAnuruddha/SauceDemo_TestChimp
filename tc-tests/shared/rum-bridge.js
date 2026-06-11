const RUM_CDN = 'https://unpkg.com/@testchimp/rum-js@0.1.7/dist/testchimp-rum.min.js';

/**
 * Injects @testchimp/rum-js into the page for test-time journey emits.
 * Use when the app under test is external and cannot host RUM in its bundle.
 * Production apps should use npm install @testchimp/rum-js in the app instead.
 */
export async function ensureRumInitialized(page) {
  if (page.__tcRumReady) return;

  const projectId = process.env.TESTCHIMP_PROJECT_ID;
  const apiKey = process.env.TESTCHIMP_API_KEY;
  if (!projectId || !apiKey) return;

  const environment = process.env.TESTCHIMP_ENV || 'QA';

  await page.addScriptTag({ url: RUM_CDN });
  await page.evaluate(
    ({ projectId, apiKey, environment }) => {
      if (typeof testchimp === 'undefined' || window.__TC_RUM_READY) return;
      testchimp.init({
        projectId,
        apiKey,
        environment,
        config: {
          captureEnabled: true,
          eventSendInterval: 3000,
          maxRepeatsPerEvent: 20,
          maxEventsPerSession: 100,
        },
      });
      window.__TC_RUM_READY = true;
    },
    { projectId, apiKey, environment },
  );

  page.__tcRumReady = true;
}

export async function emitJourneyEvent(page, title, metadata = {}) {
  await page.evaluate(
    ({ title, metadata }) => {
      if (typeof testchimp !== 'undefined') {
        testchimp.emit({ title, metadata });
      }
    },
    { title, metadata },
  );
}

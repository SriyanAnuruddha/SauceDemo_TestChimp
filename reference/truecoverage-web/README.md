# TrueCoverage web RUM — production integration reference

Use this when you **own** the application source. For external demos (e.g. saucedemo.com), this repo uses the **test-injected RUM bridge** in `tc-tests/shared/rum-bridge.js` instead.

## 1. Install

```bash
npm install @testchimp/rum-js
```

Latest published: check `npm view @testchimp/rum-js version`.

## 2. Initialize once at app bootstrap

```javascript
import testchimp from '@testchimp/rum-js';

testchimp.init({
  projectId: '<TESTCHIMP_PROJECT_ID>',
  apiKey: '<TESTCHIMP_API_KEY>',
  environment: 'QA', // align with tc-tests/.env-QA / TESTCHIMP_ENV
  config: {
    captureEnabled: true,
    maxEventsPerSession: 100,
    maxRepeatsPerEvent: 3,
    eventSendInterval: 10000,
  },
});
```

Read credentials from build-time env — not from SmartTests `.env-QA`.

## 3. Emit helper (single module)

```javascript
export function emitProductEvent(title, metadata = {}) {
  testchimp.emit({ title, metadata });
}
```

## 4. SmartTests runner

- `fixtures/index.js` → `installTestChimp(mergeTests(...))`
- `@testchimp/playwright/reporter` in `playwright.config.js`
- Runner process needs `TESTCHIMP_API_KEY` and `TESTCHIMP_PROJECT_ID`

## 5. Event catalog

See `tc-plans/events/*.event.md` and `tc-plans/knowledge/truecoverage-instrument-progress.md`.

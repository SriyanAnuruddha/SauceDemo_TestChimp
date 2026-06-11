# TestChimp Init Progress

## Completed Items

- Workstation MCP configured (`.cursor/mcp.json`)
- SmartTests harness scaffolded in `tc-tests/` (web, Playwright + `@testchimp/playwright`)
- Test-side TrueCoverage wiring (`fixtures/index.js` → `installTestChimp`)
- Environment strategy: live Swag Labs URL for PR/local testing
- Sample SmartTests against [Swag Labs](https://www.saucedemo.com/) (`standard_user` / `secret_sauce`)
- TrueCoverage journey map documented in `truecoverage-instrument-progress.md` (14 planned semantic events across 7 routes)

## Pending Items

- GitHub sync PRs from TestChimp platform (if not yet merged) to align remote markers
- CI workflow (GitHub Actions) for PR test runs
- Seed/teardown/read endpoints (when scenarios require deterministic data)
- Remaining journey emits (`login-failed`, `logout`, etc.) — see progress tracker

## Deferred Items

- AIMock (no LLM in scope for Swag Labs demo)
- Bunnyshell EaaS (using live URL instead of ephemeral envs)

---

## Environment Provision Strategy

### Local - Test Authoring

- **Target:** Live Swag Labs demo — no local app stack required.
- **Bring-up command:** `cd tc-tests && npm install && npx playwright install chromium`
- **Wait-for-healthy:** `curl -sf -o /dev/null -w "%{http_code}" https://www.saucedemo.com/` returns `200` (or open `BASE_URL` in browser).
- **URLs:**
  - `BASE_URL=https://www.saucedemo.com/` (in `tc-tests/.env-QA`)
  - `TESTCHIMP_ENV=QA` (SmartTests env file selector; RUM `environment` tag when app RUM is added later)

### CI - Test Execution

- **Strategy:** Persistent live URL (same as local) — PR tests run against `https://www.saucedemo.com/`.
- **Runner cwd:** `tc-tests/` (SmartTests root with `.testchimp-tests`).
- **Required secrets:** `TESTCHIMP_API_KEY` in CI provider secrets.
- **Env:** `BASE_URL=https://www.saucedemo.com/`, `TESTCHIMP_ENV=QA`.

---

## TrueCoverage Plan

**Status:** **Enabled** — test-side + test-injected RUM bridge (2026-06-11 setup).

Swag Labs is third-party; production RUM cannot live in its bundle. This project uses a **test-injected RUM bridge** (`tc-tests/shared/rum-bridge.js`) that loads `@testchimp/rum-js` during SmartTest runs so journey emits reach TestChimp with test identity from `installTestChimp`.

| Layer | Status |
|-------|--------|
| `@testchimp/playwright` reporter | `playwright.config.js` |
| `installTestChimp` + RUM bridge fixture | `tc-tests/fixtures/index.js` |
| `@testchimp/rum-js` | `^0.1.7` in `tc-tests/package.json`; UMD inject at runtime |
| Journey emits (initial slice) | 6 events in `e2e/*.spec.js` — see `tc-plans/events/` |
| Production app RUM | Use `reference/truecoverage-web/README.md` when you own the app |

**Credentials:** `TESTCHIMP_PROJECT_ID` + `TESTCHIMP_API_KEY` on the **Playwright runner** process (from `.cursor/mcp.json` `env`).

**RUM environment tag:** `QA` — matches `TESTCHIMP_ENV` / `tc-tests/.env-QA`.

**Progress tracker:** `tc-plans/knowledge/truecoverage-instrument-progress.md`

---

## Mocking Plan

- **http_mocking:** Not required — live Swag Labs backend; no `page.route` mocks in init.
- **aimock:** Deferred — no LLM calls in scope.

---

## ExploreChimp

- **Default sources:** DOM, screenshot, console, metrics (omit NETWORK for Swag Labs — no custom API regex).
- **Scope:** UI SmartTests under `tc-tests/e2e/` with `markScreenState`.
- **NETWORK regex:** N/A until custom API domains are in scope (Swag Labs uses standard HTTPS).
- **Local timeout:** Use `npx playwright test … --timeout 120000 --workers 2` when `EXPLORECHIMP_ENABLED=true` (default 30s is too low for multi-marker checkout flows).

---

## Past learnings — authoring & validation (FAQ)

### Q: Can we instrument TrueCoverage RUM on saucedemo.com?

**A:** No. RUM runs inside the application bundle. For external demos, enable test-side `installTestChimp` + reporter only; plan app RUM when testing code you deploy.

### Q: Local stack reports healthy but tests hit wrong API host

**A:** Confirm `BASE_URL` in `tc-tests/.env-QA` is `https://www.saucedemo.com/` and that `TESTCHIMP_ENV` is unset or `QA` so `.env-QA` loads.

### Q: ExploreChimp runs time out on checkout specs

**A:** Raise per-test timeout (`--timeout 120000`) and reduce parallelism (`--workers 2`). Set `EXPLORECHIMP_SOURCES_TO_ANALYZE=DOM,SCREENSHOT,CONSOLE,METRICS` to skip NETWORK when no regex is configured.

---

## Init action items

| Area | status | notes |
|------|--------|-------|
| 1. Basic TestChimp integration | done | Markers, harness, MCP verified |
| 2. Existing Playwright / import | skipped | Greenfield |
| 3. Mocking | done | Documented N/A for live demo |
| 4. TrueCoverage Infra | done | Test-side + RUM bridge; 6 journey emits; `tc-plans/events/` |
| 5. Environment provision | done | Live URL strategy documented |
| 6. CI setup | pending | Add workflow when ready |

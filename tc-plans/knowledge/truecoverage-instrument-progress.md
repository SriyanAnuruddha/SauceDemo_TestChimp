# TrueCoverage instrumentation progress

**App under test:** [Swag Labs](https://www.saucedemo.com/) (third-party — app RUM not installable in this repo).

**Credentials used for journey discovery:** `standard_user` / `secret_sauce` (happy path); `locked_out_user` / `secret_sauce` (login failure).

**Test harness:** `installTestChimp` + reporter enabled in `tc-tests/`.

**RUM environment tag (when app is owned):** `QA` — align with `tc-tests/.env-QA` / `TESTCHIMP_ENV`.

---

## Route / page map (discovered)

| Route | Screen | Primary user actions |
|-------|--------|----------------------|
| `/` | Login | Enter credentials, submit |
| `/inventory.html` | Inventory | Browse 6 products, add/remove cart, open product detail |
| `/inventory-item.html?id={n}` | Product detail | View item, add to cart, back to inventory |
| `/cart.html` | Cart | Review items, continue checkout, remove items |
| `/checkout-step-one.html` | Checkout — info | First/last name, postal code, continue/cancel |
| `/checkout-step-two.html` | Checkout — overview | Review totals, finish or cancel |
| `/checkout-complete.html` | Order complete | Confirmation, back to products |

---

## Primary purchase funnel (happy path)

Observed sequence with `standard_user`:

```
landing → login-success → add-to-cart → cart-view → checkout-started
  → checkout-info-submitted → checkout-completed → return-to-inventory → logout
```

---

## Planned events by route

### `/` — Login

| Event title | Status | Trigger | Suggested metadata |
|-------------|--------|---------|-------------------|
| `login-success` | done | Redirect to `/inventory.html` after valid credentials | `user.persona`: `standard` \| `performance` \| `problem` (enum, not raw username) |
| `login-failed` | planned | Error banner visible after submit | `error.kind`: `locked_out` \| `invalid_credentials` \| `required_fields` |

**Discovery notes:** `locked_out_user` → *"Epic sadface: Sorry, this user has been locked out."*

### `/inventory.html` — Inventory

| Event title | Status | Trigger | Suggested metadata |
|-------------|--------|---------|-------------------|
| `inventory-viewed` | planned | Inventory list rendered (6 items for standard_user) | `catalog.size_bucket`: `small` (6 items) |
| `add-to-cart` | done | Cart badge increments after Add to cart | `product.slug`: kebab-case name (e.g. `sauce-labs-backpack`), `cart.item_count_bucket`: `1` \| `2-3` \| `4+` |
| `remove-from-cart` | planned | Remove from cart on inventory | `product.slug` |

### `/inventory-item.html` — Product detail

| Event title | Status | Trigger | Suggested metadata |
|-------------|--------|---------|-------------------|
| `product-detail-view` | planned | Product detail page loaded | `product.slug` |

### `/cart.html` — Cart

| Event title | Status | Trigger | Suggested metadata |
|-------------|--------|---------|-------------------|
| `cart-view` | done | Cart page opened | `cart.item_count_bucket`, `cart.is_empty`: boolean |

### `/checkout-step-one.html` — Checkout info

| Event title | Status | Trigger | Suggested metadata |
|-------------|--------|---------|-------------------|
| `checkout-started` | done | Land on step one from cart | `cart.item_count_bucket` |
| `checkout-validation-error` | planned | Continue with empty required fields | `error.kind`: `missing_customer_info` |

**Discovery notes:** Empty continue → errors for First Name, Last Name, and Postal Code.

### `/checkout-step-two.html` — Checkout overview

| Event title | Status | Trigger | Suggested metadata |
|-------------|--------|---------|-------------------|
| `checkout-info-submitted` | done | Reach overview after valid customer info | `order.subtotal_bucket`: e.g. `under_50` \| `50_100` |

### `/checkout-complete.html` — Complete

| Event title | Status | Trigger | Suggested metadata |
|-------------|--------|---------|-------------------|
| `checkout-completed` | done | "Thank you for your order!" shown | `order.subtotal_bucket` |
| `checkout-cancelled` | planned | User cancels from step one or two | `checkout.step`: `one` \| `two` |

### Session end

| Event title | Status | Trigger | Suggested metadata |
|-------------|--------|---------|-------------------|
| `logout` | planned | Return to login after menu logout | — |

---

## Funnel priority (significance for evolve)

| Rank | Event | Why |
|------|-------|-----|
| 5 | `checkout-completed` | Core conversion milestone |
| 5 | `login-success` | Top-of-funnel gate |
| 4 | `add-to-cart` | Intent signal before checkout |
| 4 | `checkout-started` | Checkout entry |
| 3 | `checkout-validation-error` | High-signal error variant |
| 3 | `login-failed` | Auth failure slice |
| 2 | `cart-view`, `product-detail-view` | Engagement, not terminal |

---

## Instrumented (initial slice)

**Mode:** Test-injected RUM bridge (`tc-tests/shared/rum-bridge.js`) — injects `@testchimp/rum-js` UMD during SmartTest runs on saucedemo.com. Emits carry test identity via `installTestChimp`. **Not** production RUM on Swag Labs; for owned apps use `reference/truecoverage-web/README.md`.

| Event title | Status | Wired in |
|-------------|--------|----------|
| `login-success` | done | `e2e/login.spec.js`, `e2e/checkout.spec.js` |
| `add-to-cart` | done | `e2e/checkout.spec.js` |
| `cart-view` | done | `e2e/checkout.spec.js` |
| `checkout-started` | done | `e2e/checkout.spec.js` |
| `checkout-info-submitted` | done | `e2e/checkout.spec.js` |
| `checkout-completed` | done | `e2e/checkout.spec.js` |
| `login-failed` | planned | — |
| `checkout-validation-error` | planned | — |
| `inventory-viewed` | planned | — |
| `product-detail-view` | planned | — |
| `remove-from-cart` | planned | — |
| `checkout-cancelled` | planned | — |
| `logout` | planned | — |

Event docs: `tc-plans/events/*.event.md` (one per instrumented event).

---

## Test-side wiring (SmartTests)

| Item | Status |
|------|--------|
| `fixtures/index.js` → `installTestChimp` + RUM bridge | done |
| `@testchimp/playwright/reporter` | done |
| `shared/rum-bridge.js` (test-injected `@testchimp/rum-js`) | done |
| `markScreenState` + journey emits in UI specs | done |
| `e2e/login.spec.js` | done — login → inventory + `login-success` emit |
| `e2e/checkout.spec.js` | done — full funnel + 5 journey emits |
| `@testchimp/rum-js` dependency (v0.1.7) | done |

---

## Example emit (reference — for owned app only)

```javascript
// After successful login redirect:
emitProductEvent('login-success', { 'user.persona': 'standard' });

// After add to cart:
emitProductEvent('add-to-cart', {
  'product.slug': 'sauce-labs-backpack',
  'cart.item_count_bucket': '1',
});
```

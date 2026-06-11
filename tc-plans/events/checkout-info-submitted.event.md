---
title: checkout-info-submitted
description: User submits valid customer info and reaches checkout overview (step two).
added-on: 2026-06-11
significance: 3
---

## Rationale

Mid-checkout milestone after validation passes. Pairs with `checkout-validation-error` for error-path coverage.

## Metadata keys

| Key | Values | Notes |
|-----|--------|-------|
| `order.subtotal_bucket` | `under_50` \| `50_100` \| `over_100` | Order value bucket |

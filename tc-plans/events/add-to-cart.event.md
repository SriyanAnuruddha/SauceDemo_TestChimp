---
title: add-to-cart
description: User adds a product to the cart from the inventory page.
added-on: 2026-06-11
significance: 4
---

## Rationale

Intent signal before checkout. Helps prioritize tests and fixtures for cart composition slices (single item vs multi-item).

## Metadata keys

| Key | Values | Notes |
|-----|--------|-------|
| `product.slug` | kebab-case product name | Low cardinality for demo catalog |
| `cart.item_count_bucket` | `1` \| `2-3` \| `4+` | Bucketed count after add |

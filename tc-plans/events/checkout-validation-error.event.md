---
title: checkout-validation-error
description: Checkout step-one rejects submit when required customer fields are empty.
added-on: 2026-06-11
significance: 3
---

## Rationale

Measures how often shoppers hit form validation during checkout. Helps prioritize UX fixes on the customer-info step.

## Metadata keys

| Key | Values | Notes |
|-----|--------|-------|
| `error.kind` | `missing_customer_info` | Required fields empty on continue |

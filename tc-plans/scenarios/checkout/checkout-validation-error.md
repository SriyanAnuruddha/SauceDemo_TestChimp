---
type: scenario
id: TS-103
title: Checkout step-one shows errors for empty required fields
story: US-111
---

## Prerequisites

- Authenticated `standard_user` with at least one item in the cart.

## Test steps

1. Log in as `standard_user`.
2. Add an item to cart, open cart, and continue to checkout step-one.
3. Click Continue without filling First Name, Last Name, or Postal Code.

## Expected behaviour

- Validation errors appear for all three required fields.
- User remains on checkout step-one.

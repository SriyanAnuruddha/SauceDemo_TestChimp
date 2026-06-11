---
type: scenario
id: TS-102
title: Standard user completes checkout end-to-end
story: US-111
---

## Prerequisites

- Anonymous visitor; will authenticate as `standard_user` during the test.

## Test steps

1. Log in as `standard_user`.
2. Add the first inventory item to the cart.
3. Open the cart and continue to checkout.
4. Complete checkout step-one with valid customer info.
5. Finish the order on checkout step-two.

## Expected behaviour

- Cart shows the added item.
- Order complete page displays "Thank you for your order!".

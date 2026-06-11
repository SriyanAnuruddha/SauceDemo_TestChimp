---
type: scenario
id: TS-100
title: Standard user logs in and reaches inventory
story: US-110
---

## Prerequisites

- Anonymous visitor on Swag Labs login page (`/`).

## Test steps

1. Enter username `standard_user` and password `secret_sauce`.
2. Click Login.

## Expected behaviour

- Browser navigates to `/inventory.html`.
- Inventory product list is visible.

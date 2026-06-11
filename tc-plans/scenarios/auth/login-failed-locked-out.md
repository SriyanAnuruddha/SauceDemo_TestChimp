---
type: scenario
id: TS-101
title: Locked-out user sees login error
story: US-110
---

## Prerequisites

- Anonymous visitor on Swag Labs login page (`/`).

## Test steps

1. Enter username `locked_out_user` and password `secret_sauce`.
2. Click Login.

## Expected behaviour

- User remains on the login page.
- Error message indicates the account is locked out.

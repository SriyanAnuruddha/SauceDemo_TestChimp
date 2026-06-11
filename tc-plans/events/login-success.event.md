---
title: login-success
description: User lands on inventory after valid login credentials are accepted.
added-on: 2026-06-11
significance: 5
---

## Rationale

Top-of-funnel gate for the Swag Labs purchase journey. TrueCoverage uses this to measure how many sessions reach a shoppable state versus failing at login. Instrumented via test-time RUM bridge during SmartTests (`standard_user` persona).

## Metadata keys

| Key | Values | Notes |
|-----|--------|-------|
| `user.persona` | `standard` \| `performance` \| `problem` | Demo user class — never emit raw usernames |

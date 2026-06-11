---
title: login-failed
description: Login attempt rejected; error banner shown on login page.
added-on: 2026-06-11
significance: 4
---

## Rationale

Captures authentication failures at the top of the funnel. Used to distinguish locked-out accounts from other credential errors during TrueCoverage analysis.

## Metadata keys

| Key | Values | Notes |
|-----|--------|-------|
| `error.kind` | `locked_out` \| `invalid_credentials` \| `required_fields` | Failure category — never emit raw credentials |

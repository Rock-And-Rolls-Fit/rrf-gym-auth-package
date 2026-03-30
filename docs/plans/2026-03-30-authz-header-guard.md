# Authz Header Guard Implementation Plan

## Goal

Add an `AuthzHeaderGuard` that reads the `x-authz` header, parses its JSON payload into `request.user`, and keeps `PermissionsGuard` focused on authorization.

## Scope

- Add and export the new guard
- Update module exports/providers so consumers can inject/use it
- Document guard usage with `@UseGuards(AuthzHeaderGuard, PermissionsGuard)`
- Validate the package with `bun run build`

## Files Changed

- `src/guards/authz-header.guard.ts`
- `src/authz.module.ts`
- `src/index.ts`
- `README.md`

## Validation Performed

- `bun run build`

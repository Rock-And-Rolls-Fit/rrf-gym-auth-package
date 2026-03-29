# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run build          # Compile TypeScript → dist/ (uses tsconfig.build.json)
bun run clean          # Remove dist/
bun run prepublishOnly # clean + build (runs automatically before npm publish)
```

There are no tests configured yet. The package is built with `bun` and compiled with `tsc`.

## Publishing

Published to **GitHub Packages** (`https://npm.pkg.github.com`) under the `@rock-and-rolls-fit` scope.

**To release a new version:**
1. Update `version` in `package.json`
2. Commit and push
3. Push a tag: `git tag v1.x.x && git push origin v1.x.x`

The GitHub Actions workflow (`.github/workflows/publish.yml`) triggers on `v*` tags, builds, and runs `npm publish` using the built-in `GITHUB_TOKEN`.

**Consumers** need an `.npmrc` with:
```
@rock-and-rolls-fit:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Architecture

This is a **NestJS dynamic module** (`AuthzModule`) that provides CASL-based authorization for Rock and Rolls Fit microservices. It is a **read-only consumer** of Redis — it never writes rules.

### Authorization flow

1. A JWT auth guard (in the consuming service) runs first and populates `request.user` as `IGymUserRequest` (`{ userId, email, roleName, roleId }`).
2. `PermissionsGuard` reads route metadata set by decorators, fetches CASL rules from Redis via `RedisRulesProvider`, builds an `AppAbility` via `AuthzAbilityFactory`, and evaluates it.
3. If no decorator is present on a route, access is allowed. If `@Public()` is set, access is always allowed.

### Redis key contract

Rules are written by `rrf-ms-auth` and read here. Key format: `{redisKeyPrefix}:{roleName}` (default prefix: `rrf:auth:gym:abilities`). Value is `IRawRule[]` JSON.

### Two decorator styles for protecting routes

- `@CheckPermission(action, subject)` — simple single-rule check
- `@CheckPolicies(...handlers)` — arbitrary `(ability: AppAbility) => boolean` functions for compound checks

### Module registration

- `AuthzModule.register(options)` — synchronous
- `AuthzModule.registerAsync({ imports, inject, useFactory })` — for use with `ConfigService`

### Type extension

`Subjects` is defined as `DefaultSubjects | (string & {})`, so consuming services can use any string subject without modifying this package.

### Module resolution

Uses `"module": "nodenext"` — all internal imports must use `.js` extensions even for `.ts` source files.

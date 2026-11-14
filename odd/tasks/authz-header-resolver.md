# ODD Task: Reusable x-authz Header Resolver

Repository locator: `odd/tasks/authz-header-resolver.md`

## Objective
Extract the existing `x-authz` JSON parsing and user-field validation into a reusable public utility, while keeping `AuthzHeaderGuard` as the HTTP adapter that assigns `request.user`.

## Problem and Why
Consumers can currently resolve the header only through the NestJS guard. A standalone utility makes the existing behavior reusable without coupling permission evaluation to transport parsing.

## Scope and Constraints
- Authorized files: `src/utils/resolve-authz-header.ts`, `src/guards/authz-header.guard.ts`, `src/index.ts`.
- Preserve the existing contract: required non-empty string fields are `userId`, `email`, `roleName`, and `roleId`; invalid header input throws `ForbiddenException('Invalid x-authz header')`.
- No unrelated refactoring, dependency additions, or test-runner setup.
- TDD: off for this change, explicitly approved by the user; verification runner: `bun run build`.
- Delivery strategy: `ask-on-risk`; forecast is below 400 authored changed lines, so no chain decision is currently needed.

## Checklist
- [x] T1 — Extract and export `resolveAuthzHeader(headerValue: unknown): IGymUserRequest`; route `AuthzHeaderGuard` through it; verify the package build and diff.

## Acceptance Criteria
- Valid JSON header values produce the same four validated user fields as the current guard.
- Missing/non-string values, invalid JSON, non-object JSON, and absent/empty/whitespace-only required fields are rejected with the existing forbidden error.
- The guard continues to set `request.user` and return `true` for valid input.
- Consumers can import the utility from the package entrypoint.

## Verification
- `bun run build`: passed in writer run and parent spot check.
- `git diff --check`: passed in writer run.
- No tests were run: no test suite is configured and TDD was explicitly off.
- Independent read-only verification found no issues.
- Native risk assessment was high/unassessable because untracked files were not declared. RDD is off, so no native review was run.
- No runtime harness applies; this package has no runtime application.

## Progress
- T1: implementation and functional verification complete; work-unit commit `50a5c2d` (`feat(auth): add reusable x-authz resolver`).

## Next Step
No additional work remains. Push, PR creation, and merge remain the user's decision.

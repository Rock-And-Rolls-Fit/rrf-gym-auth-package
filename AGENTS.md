# Repository Guidelines

## Project Structure & Module Organization

This repository is a TypeScript authorization package for NestJS services. Runtime code lives in `src/`: `guards/` handles request authentication context and permission checks, `decorators/` declares endpoint metadata, `providers/` builds abilities and reads Redis rules, and `types/` contains shared contracts. `src/index.ts` is the public export surface. The README documents consumer setup and the Redis key contract. Build output goes to `dist/`; edit `src/`, not generated files.

## Build, Test, and Development Commands

Use Bun for package workflows:

- `bun install` installs dependencies from the lockfile.
- `bun run build` compiles the package with `tsc -p tsconfig.build.json` into `dist/`.
- `bun run clean` removes generated output.
- `bun run prepublishOnly` cleans and rebuilds before publishing.

`package.json` currently defines no test, lint, or watch script. After changes, run the build and add focused tests if a test harness is introduced; do not claim test coverage that was not run.

## Coding Style & Naming Conventions

Follow the existing strict TypeScript configuration (`tsconfig.json`). Use two-space indentation, single quotes, semicolons, and `.js` extensions for relative imports, matching the source files. Name classes and interfaces in PascalCase, methods and variables in camelCase, and files in kebab-case (for example, `authz-header.guard.ts`). Export consumer-facing APIs through `src/index.ts`.

## Testing Guidelines

There is no configured test framework or test command in the package scripts. For every change, at minimum run `bun run build`; when adding tests, keep them focused on the affected guard, provider, or decorator behavior and document the exact command used.

## Commit & Pull Request Guidelines

Recent commit subjects use short, imperative descriptions (for example, “Add x-authz header guard…”). Keep commits similarly concise and action-oriented. Pull requests should explain the behavior change, note compatibility or configuration impact, link a related issue when available, and list checks actually run. Update `README.md` when consumer-facing usage or contracts change.

## Security & Configuration

Do not commit secrets. Configure Redis URLs and other credentials through environment-backed application configuration; preserve the package's read-only Redis rules behavior unless an explicitly reviewed change requires otherwise.

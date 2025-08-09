# Contributing to Apex

Thanks for your interest in contributing! This repository is a pnpm + Turborepo monorepo.

## Prerequisites

- Install Node.js 20+
- Install pnpm 9: `npm i -g pnpm`

## Getting Started

1. Install dependencies: `pnpm install`
2. Start development (runs all apps): `pnpm dev`
3. Build all packages/apps: `pnpm build`
4. Lint all workspaces: `pnpm lint`
5. Run tests: `pnpm test`

## Workspace Layout

- `apps/*`: runnable applications (e.g., API, web)
- `packages/*`: shared libraries and tooling

## Creating a New Package

1. Create a folder in `packages/your-package`
2. Add a `package.json` with `name`, `version`, `main`, `types`, and scripts
3. Add `tsconfig.json` extending `../../tsconfig.base.json`
4. Implement code in `src/`

## Conventional Commits

We use conventional commits. Example: `feat(api): add new endpoint`.

## Changesets (Versioning)

- Create a changeset: `pnpm changeset`
- Version packages: `pnpm release`

## Code Style

- ESLint + Prettier enforced
- Format on save is enabled via workspace settings

## Security

See `SECURITY.md` for reporting vulnerabilities.

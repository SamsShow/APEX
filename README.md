# Apex Monorepo

APEX is a high-frequency on-chain matching engine on Aptos for multi-leg options. This repository is a pnpm + Turborepo monorepo.

## Prerequisites

- Node.js 20+
- pnpm 9 (recommended via Corepack)

## Getting Started

```bash
# enable corepack and activate the pinned pnpm version
corepack enable
corepack prepare pnpm@9.0.0 --activate

# install dependencies
yarn --version >/dev/null 2>&1 || true # no-op, doc hint
pnpm install

# run all apps in dev
yarn >/dev/null 2>&1 || true # no-op, doc hint
pnpm dev

# build all workspaces
pnpm build

# lint all workspaces
pnpm lint

# run tests
pnpm test
```

## Workspace Layout

- `apps/api`: minimal TypeScript service placeholder
- `packages/shared`: shared TypeScript utilities

## Scripts (root)

- `pnpm dev`: run all `dev` scripts in parallel
- `pnpm build`: build all packages/apps
- `pnpm lint`: run ESLint across workspaces
- `pnpm test`: run tests across workspaces

## Commit, Versioning, Release

- Conventional commits enforced by commitlint (Husky hook)
- Pre-commit runs Prettier on staged files
- Changesets manages versions and publishing
  - Create changeset: `pnpm changeset`
  - Release: `pnpm release`

## CI

GitHub Actions runs lint, build, and test on PRs and main.

## License

MIT © 2025 Apex
